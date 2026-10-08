import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeImageFile } from "./image-normalizer";

let width = 480,
  height = 640,
  decodeFails = false;
const drawImage = vi.fn(),
  fillRect = vi.fn();
let context: Partial<CanvasRenderingContext2D> | null;
let encodedType = "";
const toBlob = vi.fn();
const file = () =>
  new File(["fixture"], "home-design-full (9).jpg", { type: "image/jpeg" });

beforeEach(() => {
  width = 480;
  height = 640;
  decodeFails = false;
  encodedType = "";
  toBlob.mockReset();
  drawImage.mockClear();
  fillRect.mockClear();
  context = { drawImage, fillRect };
  vi.stubGlobal(
    "Image",
    class {
      naturalWidth = width;
      naturalHeight = height;
      onload?: () => void;
      onerror?: () => void;
      set src(_value: string) {
        queueMicrotask(() =>
          decodeFails ? this.onerror?.() : this.onload?.(),
        );
      }
    },
  );
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => "blob:fixture"),
    revokeObjectURL: vi.fn(),
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => context as CanvasRenderingContext2D,
  );
  toBlob.mockImplementation((callback: BlobCallback, type: string) =>
    callback(new Blob(["encoded image"], { type: encodedType || type })),
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(toBlob);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const gallery = {
  targetAspectRatio: null,
  minWidth: 800,
  minHeight: 600,
  maxWidth: 2400,
  preserveUnchanged: true,
} as const;

describe("automatic image sizing", () => {
  it("enlarges the reported portrait without losing or stretching its content", async () => {
    const result = await normalizeImageFile(file(), gallery);
    expect(result).toMatchObject({
      originalWidth: 480,
      originalHeight: 640,
      outputWidth: 800,
      outputHeight: 1067,
      didCrop: false,
      didResize: true,
      didPad: false,
    });
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      0,
      480,
      640,
      0,
      0,
      800,
      1067,
    );
    expect(context).toMatchObject({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    expect(result.file.type).toBe("image/jpeg");
  });
  it.each([
    [1200, 300, 2400, 600],
    [400, 400, 800, 800],
    [240, 320, 800, 1067],
  ])("satisfies both minima for %i×%i", async (w, h, outW, outH) => {
    width = w;
    height = h;
    expect(await normalizeImageFile(file(), gallery)).toMatchObject({
      outputWidth: outW,
      outputHeight: outH,
      didCrop: false,
    });
  });
  it("leaves compliant gallery files byte-for-byte unchanged", async () => {
    width = 1200;
    height = 900;
    const original = file();
    const result = await normalizeImageFile(original, gallery);
    expect(result.file).toBe(original);
    expect(result.didReencode).toBe(false);
    expect(toBlob).not.toHaveBeenCalled();
  });
  it("bounds large portrait photos by their longest edge", async () => {
    width = 3000;
    height = 4000;
    expect(await normalizeImageFile(file(), gallery)).toMatchObject({
      outputWidth: 1800,
      outputHeight: 2400,
      didCrop: false,
      didResize: true,
    });
  });
  it.each([
    [100, 8000, 800, 2400],
    [8000, 100, 2400, 600],
  ])(
    "pads an extreme %i×%i photo instead of distorting it or making an enormous canvas",
    async (w, h, outW, outH) => {
      width = w;
      height = h;
      expect(await normalizeImageFile(file(), gallery)).toMatchObject({
        outputWidth: outW,
        outputHeight: outH,
        didPad: true,
        didCrop: false,
      });
      const draw = drawImage.mock.calls[0];
      expect(draw[7]).toBeLessThanOrEqual(2400);
      expect(draw[8]).toBeLessThanOrEqual(2400);
    },
  );
  it("crops a portrait cover before enlarging it to the cover requirements", async () => {
    const result = await normalizeImageFile(file(), {
      targetAspectRatio: 16 / 9,
      minWidth: 1200,
      minHeight: 675,
      forceExactRatio: true,
    });
    expect(result).toMatchObject({
      outputWidth: 1200,
      outputHeight: 675,
      didCrop: true,
      didResize: true,
    });
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      185,
      480,
      270,
      0,
      0,
      1200,
      675,
    );
  });
  it("does not report a crop when a cover already has the required ratio", async () => {
    width = 1600;
    height = 900;
    expect(
      await normalizeImageFile(file(), {
        targetAspectRatio: 16 / 9,
        forceExactRatio: true,
      }),
    ).toMatchObject({ didCrop: false, didResize: false });
  });
  it("preserves transparency when WebP is requested", async () => {
    const result = await normalizeImageFile(file(), {
      ...gallery,
      format: "image/webp",
    });
    expect(fillRect).not.toHaveBeenCalled();
    expect(result.file.name).toBe("home-design-full (9).webp");
    expect(result.file.type).toBe("image/webp");
  });
  it("labels the actual PNG result when the browser falls back from WebP", async () => {
    encodedType = "image/png";
    const result = await normalizeImageFile(file(), {
      ...gallery,
      format: "image/webp",
    });
    expect(result.file.type).toBe("image/png");
    expect(result.file.name).toMatch(/\.png$/);
  });
  it("never silently returns an undersized original when image processing fails", async () => {
    context = null;
    await expect(normalizeImageFile(file(), gallery)).rejects.toThrow(
      "processing is unavailable",
    );
  });
  it("rejects encoder failures", async () => {
    toBlob.mockImplementation((callback: BlobCallback) => callback(null));
    await expect(normalizeImageFile(file(), gallery)).rejects.toThrow(
      "Could not encode",
    );
  });
  it("releases the temporary URL for corrupt files", async () => {
    decodeFails = true;
    await expect(normalizeImageFile(file(), gallery)).rejects.toThrow(
      "Could not decode",
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:fixture");
  });
});
