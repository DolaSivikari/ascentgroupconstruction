// Production-preview upload checks; all backend requests are intercepted with synthetic fixtures.
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "/workspace/.design-tools/browser/node_modules/playwright",
);
const root = process.cwd(),
  base = process.env.IMAGE_UPLOAD_PREVIEW || "http://127.0.0.1:4187";
assert(
  ["127.0.0.1", "localhost"].includes(new URL(base).hostname),
  "Use a loopback preview only.",
);
const out =
  process.env.IMAGE_UPLOAD_EVIDENCE ||
  "/workspace/image-upload-evidence/browser";
fs.mkdirSync(out, { recursive: true });
const backend = fs
  .readdirSync(path.join(root, "dist/assets"))
  .filter((f) => f.endsWith(".js"))
  .map((f) =>
    fs
      .readFileSync(path.join(root, "dist/assets", f), "utf8")
      .match(/https:\/\/[a-z0-9]+\.supabase\.co/),
  )
  .find(Boolean)[0];
const ref = new URL(backend).hostname.split(".")[0];
const uid = "00000000-0000-4000-8000-000000000999",
  projectId = "00000000-0000-4000-8000-000000000001";
const project = {
  id: projectId,
  title: "Offline existing project",
  slug: "offline-existing-project",
  summary: "Synthetic image upload fixture",
  description: "<p>Existing project.</p>",
  featured_image: "",
  publish_state: "published",
  project_status: "completed",
  category: "Restoration",
  tags: [],
  content_blocks: [],
  team_credits: [],
  start_date: "2026-01-01",
  completion_date: "2026-01-02",
  created_at: "2026-01-01T00:00:00Z",
  trades_coordinated: null,
  peak_workforce: null,
  on_time_completion: null,
  on_budget: null,
  safety_incidents: null,
};
function filePart(request) {
  const body = request.postDataBuffer(),
    boundary = /boundary=(?:"([^"]+)"|([^;]+))/.exec(
      request.headers()["content-type"],
    );
  assert(body && boundary, "Missing upload body");
  const start = body.indexOf(Buffer.from('filename="'));
  assert(start >= 0, "Missing uploaded file part");
  const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), start);
  const headers = body.subarray(start, headerEnd).toString();
  const mime = /Content-Type:\s*([^\r\n]+)/i.exec(headers)[1];
  const end = body.indexOf(
    Buffer.from("\r\n--" + (boundary[1] || boundary[2])),
    headerEnd + 4,
  );
  return {
    mime,
    bytes: body.subarray(headerEnd + 4, end),
    pathname: new URL(request.url()).pathname,
  };
}
(async () => {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const generator = await browser.newPage();
  const samples = await generator.evaluate(async () => {
    const make = async (width, height, mime, alpha = false) => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const x = c.getContext("2d");
      if (!alpha) {
        x.fillStyle = "#ee3333";
        x.fillRect(0, 0, width, height / 2);
        x.fillStyle = "#2233ee";
        x.fillRect(0, height / 2, width, height / 2);
      } else {
        x.fillStyle = "#33aa55";
        x.fillRect(width / 4, height / 4, width / 2, height / 2);
      }
      const b = await new Promise((r) => c.toBlob(r, mime, 0.95));
      return {
        mime: b.type,
        bytes: [...new Uint8Array(await b.arrayBuffer())],
      };
    };
    return {
      portrait: await make(480, 640, "image/jpeg"),
      small: await make(240, 320, "image/jpeg"),
      alpha: await make(480, 640, "image/png", true),
      large: await make(3000, 4000, "image/jpeg"),
      valid: await make(1200, 900, "image/jpeg"),
    };
  });
  await generator.close();
  const results = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await context.addInitScript(
      ({ base, ref, uid }) => {
        if (location.origin !== base) return;
        localStorage.setItem("cookie-consent", "rejected");
        localStorage.setItem("admin-theme", "light");
        sessionStorage.setItem("deployment-check-done", "true");
        const token =
          btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) +
          "." +
          btoa(
            JSON.stringify({ sub: uid, exp: 4102444800, aud: "authenticated" }),
          ) +
          ".fixture";
        localStorage.setItem(
          `sb-${ref}-auth-token`,
          JSON.stringify({
            access_token: token,
            refresh_token: "fixture-refresh",
            expires_at: 4102444800,
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: uid,
              email: "admin@example.test",
              aud: "authenticated",
              role: "authenticated",
            },
          }),
        );
      },
      { base, ref, uid },
    );
    const uploads = [],
      errors = [],
      writes = [];
    await context.route("**/*", async (route) => {
      const request = route.request(),
        url = new URL(request.url());
      if (url.origin === base) return route.continue();
      if (!url.hostname.endsWith(".supabase.co")) return route.abort();
      const headers = {
        "access-control-allow-origin": base,
        "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
        "content-type": "application/json",
      };
      const respond = (status, value) =>
        route.fulfill({ status, headers, body: JSON.stringify(value) });
      if (request.method() === "OPTIONS") return respond(200, {});
      if (url.pathname === "/auth/v1/user")
        return respond(200, {
          id: uid,
          email: "admin@example.test",
          role: "authenticated",
          aud: "authenticated",
        });
      if (
        url.pathname.startsWith("/storage/v1/object/") &&
        request.method() === "POST"
      ) {
        const file = filePart(request);
        uploads.push(file);
        return respond(200, { Key: file.pathname, Id: "fixture-upload" });
      }
      if (url.pathname.startsWith("/storage/v1/object/public/"))
        return route.fulfill({
          status: 200,
          contentType: "image/jpeg",
          body: Buffer.from(samples.portrait.bytes),
        });
      if (request.method() !== "GET" && request.method() !== "HEAD") {
        writes.push(url.pathname);
        return respond(400, { message: "Unexpected fixture write" });
      }
      const table = url.pathname.split("/").pop();
      let rows = [];
      if (table === "projects") rows = [project];
      if (table === "user_roles")
        rows = [{ id: "fixture-role", user_id: uid, role: "super_admin" }];
      if (table === "profiles")
        rows = [
          { id: uid, email: "admin@example.test", full_name: "Fixture owner" },
        ];
      if (
        table === "project_images" &&
        url.searchParams.get("select") !== "alt_text"
      )
        rows = [
          {
            id: "existing-image",
            project_id: projectId,
            url:
              backend + "/storage/v1/object/public/project-images/existing.jpg",
            category: "gallery",
            display_order: 0,
            featured: false,
            caption: "Existing image",
            alt_text: "Existing image",
          },
        ];
      if ((request.headers().accept || "").includes("vnd.pgrst.object"))
        return rows.length
          ? respond(200, rows[0])
          : respond(406, { code: "PGRST116", message: "No fixture row" });
      return respond(200, rows);
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/admin/projects/" + projectId, {
      waitUntil: "networkidle",
    });
    const gallery = page.locator("#upload-gallery");
    await gallery.waitFor({ state: "attached" });
    async function inspect(file) {
      return page.evaluate(
        async ({ bytes, mime }) => {
          const image = await createImageBitmap(
            new Blob([new Uint8Array(bytes)], { type: mime }),
          );
          const c = document.createElement("canvas");
          c.width = image.width;
          c.height = image.height;
          const x = c.getContext("2d");
          x.drawImage(image, 0, 0);
          const pixel = (px, py) => [...x.getImageData(px, py, 1, 1).data];
          return {
            width: image.width,
            height: image.height,
            corner: pixel(0, 0),
            top: pixel(Math.floor(image.width / 2), 5),
            bottom: pixel(Math.floor(image.width / 2), image.height - 6),
          };
        },
        { bytes: [...file.bytes], mime: file.mime },
      );
    }
    async function upload(input, sample, name, expected) {
      const count = uploads.length;
      const response = page.waitForResponse(
        (r) =>
          r.request().method() === "POST" &&
          new URL(r.url()).pathname.startsWith("/storage/v1/object/"),
      );
      await input.setInputFiles({
        name,
        mimeType: sample.mime,
        buffer: Buffer.from(sample.bytes),
      });
      await response;
      assert.equal(
        uploads.length,
        count + 1,
        "Upload did not complete: " + name,
      );
      const record = uploads[count],
        image = await inspect(record);
      assert.equal(image.width, expected[0], name);
      assert.equal(image.height, expected[1], name);
      results.push({
        viewport: width,
        file: name,
        path: record.pathname,
        mime: record.mime,
        ...image,
      });
      const publicPath = record.pathname.replace(
        "/storage/v1/object/",
        "/storage/v1/object/public/",
      );
      await page.waitForFunction(
        (publicPath) =>
          [...document.images].some(
            (img) => new URL(img.src).pathname === publicPath,
          ),
        publicPath,
      );
      return { record, image };
    }
    const portrait = await upload(
      gallery,
      samples.portrait,
      "home-design-full (9).jpg",
      [800, 1067],
    );
    assert(
      portrait.image.top[0] > 180 && portrait.image.bottom[2] > 180,
      "Gallery photo was cropped",
    );
    await upload(gallery, samples.large, "large-portrait.jpg", [1800, 2400]);
    const alpha = await upload(
      gallery,
      samples.alpha,
      "transparent.png",
      [800, 1067],
    );
    assert.equal(alpha.image.corner[3], 0, "Transparency lost");
    assert(alpha.record.pathname.endsWith(".webp"), "Wrong output extension");
    const valid = await upload(
      gallery,
      samples.valid,
      "valid.jpg",
      [1200, 900],
    );
    assert.deepEqual(
      valid.record.bytes,
      Buffer.from(samples.valid.bytes),
      "Valid file was recompressed",
    );
    await upload(gallery, samples.small, "small-portrait.jpg", [800, 1067]);
    const cover = page.locator('#project-images input[type="file"]').first();
    await upload(cover, samples.portrait, "cover-portrait.jpg", [1200, 675]);
    assert(
      (await page
        .getByRole("img", { name: "Existing image", exact: true })
        .count()) > 0,
      "Existing image lost",
    );
    assert.equal(writes.length, 0, "Unexpected save or deletion");
    assert.deepEqual(errors, []);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Horizontal overflow",
    );
    // Let upload notices settle so evidence shows the final editor state.
    await page.evaluate(() => document.activeElement?.blur());
    await page.mouse.move(0, 0);
    await page.waitForTimeout(4500);
    await page
      .locator("#project-images")
      .screenshot({ path: path.join(out, `images-${width}.png`) });
    await context.close();
  }
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify(
      {
        status: "passed",
        results,
        scope:
          "Local production build; synthetic auth/project/storage only; no save or delete requests.",
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    "Passed",
    results.length,
    "real-image uploads across desktop/mobile",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
