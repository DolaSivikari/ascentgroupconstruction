// Deterministic synthetic public fixtures. No live database requests.
exports.fixture = (request) => {
  const url = new URL(request.url());
  const table = url.pathname.split("/").pop();
  const slug = (url.searchParams.get("slug") || "").replace(/^eq\./, "");
  const single = (request.headers().accept || "").includes(
    "application/vnd.pgrst.object+json",
  );
  let record;
  if (slug && table === "services")
    record = {
      id: "fixture-service",
      name: slug
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(" "),
      slug,
      short_description: "Offline service fixture for regression validation.",
      long_description: null,
      icon_name: "Building2",
      featured_image: null,
      seo_title: null,
      seo_description: null,
      seo_keywords: [],
      service_overview:
        "Illustrative offline content. Production CMS data is not used.",
      process_steps: [],
      what_we_provide: ["Offline fixture scope"],
      typical_applications: ["Commercial buildings"],
      key_benefits: [],
      faq_items: [],
      category: "envelope",
      publish_state: "published",
    };
  if (slug && table === "projects")
    record = {
      id: "fixture-project",
      title: "Offline project fixture",
      slug,
      summary: "Illustrative offline project content for layout regression.",
      featured_image: null,
      category: "Restoration",
      location: "Sample location",
      description: "Offline regression fixture.",
      before_images: [],
      after_images: [],
      content_blocks: [],
      seo_keywords: [],
      status: "completed",
      publish_state: "published",
    };
  if (slug && table === "blog_posts")
    record = {
      id: "fixture-blog",
      title: "Offline article fixture",
      slug,
      content:
        "<p>Illustrative article content for local regression validation.</p>",
      excerpt: "Offline article fixture.",
      category: "Construction",
      publish_state: "published",
      published_at: "2026-04-14T12:00:00Z",
      created_at: "2026-04-14T12:00:00Z",
      seo_keywords: [],
      featured_image: null,
    };
  if (record)
    return {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(single ? record : [record]),
    };
  if (single)
    return {
      status: 406,
      contentType: "application/json",
      body: JSON.stringify({
        code: "PGRST116",
        message: "No row in offline fixture",
        details: "0 rows",
      }),
    };
  return { status: 200, contentType: "application/json", body: "[]" };
};
