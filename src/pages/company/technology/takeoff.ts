export type Point = { x: number; y: number };
export function measureShape(mode: string, points: Point[]): number {
  const unitsPerMetre = 18.3; // Grid A–B spans 183 drawing units = 10.000 m.
  if (mode === "count") return points.length;
  if (mode === "length")
    return points
      .slice(1)
      .reduce(
        (sum, point, i) =>
          sum +
          Math.hypot(point.x - points[i].x, point.y - points[i].y) /
            unitsPerMetre,
        0,
      );
  return (
    Math.abs(
      points.reduce((sum, point, i) => {
        const next = points[(i + 1) % points.length];
        return sum + point.x * next.y - next.x * point.y;
      }, 0),
    ) /
    2 /
    unitsPerMetre ** 2
  );
}
