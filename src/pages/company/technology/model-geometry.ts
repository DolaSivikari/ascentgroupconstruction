/** Drawing coordinates from the supplied Claude preview; one unit represents 0.1 m. */
export const BLUEPRINT_OUTLINE = [
  [-210, -120],
  [90, -120],
  [90, -30],
  [170, -30],
  [170, 130],
  [40, 130],
  [40, 10],
  [-210, 10],
] as const;

/** Non-overlapping slab rectangles, sharing the same perimeter as the drawing. */
export const BLUEPRINT_SLABS = [
  [-210, -120, 300, 130],
  [90, -30, 80, 40],
  [40, 10, 130, 120],
] as const;

export function wallLayout(
  layers: readonly { mm: number }[],
  exploded: boolean,
) {
  const thicknesses = layers.map((layer) =>
    Math.max(7, Math.min(64, layer.mm * 0.42)),
  );
  const gap = exploded ? 44 : 0;
  const span =
    thicknesses.reduce((sum, thickness) => sum + thickness, 0) +
    gap * (layers.length - 1);
  let offset = -span / 2;
  return thicknesses.map((thickness, i) => {
    const width = 300 - i * 20;
    const part = {
      x: offset + thickness / 2,
      y: (300 - width) / 2,
      thickness,
      width,
      height: 290 - i * 16,
    };
    offset += thickness + gap;
    return part;
  });
}
