import { describe, expect, it } from "vitest";
import {
  BLUEPRINT_OUTLINE,
  BLUEPRINT_SLABS,
  wallLayout,
} from "./model-geometry";
import { WALL_ASSEMBLIES } from "./interactive-data";

describe("Construction geometry", () => {
  it("tiles the drawing footprint without slab gaps, overlaps or a filled-in courtyard", () => {
    const polygonArea =
      Math.abs(
        BLUEPRINT_OUTLINE.reduce((sum, [x, y], i) => {
          const [nextX, nextY] =
            BLUEPRINT_OUTLINE[(i + 1) % BLUEPRINT_OUTLINE.length];
          return sum + x * nextY - nextX * y;
        }, 0),
      ) / 2;
    expect(BLUEPRINT_SLABS.reduce((sum, [, , w, d]) => sum + w * d, 0)).toBe(
      polygonArea,
    );
    for (const [i, [x, y, w, d]] of BLUEPRINT_SLABS.entries()) {
      for (const [otherX, otherY, otherW, otherD] of BLUEPRINT_SLABS.slice(
        i + 1,
      )) {
        expect(
          Math.max(0, Math.min(x + w, otherX + otherW) - Math.max(x, otherX)) *
            Math.max(0, Math.min(y + d, otherY + otherD) - Math.max(y, otherY)),
        ).toBe(0);
      }
    }
    const inside = (x: number, y: number) =>
      BLUEPRINT_SLABS.some(
        ([left, top, w, d]) =>
          x > left && x < left + w && y > top && y < top + d,
      );
    expect(inside(-100, 100)).toBe(false);
    expect(inside(100, 100)).toBe(true);
    expect(inside(-100, -100)).toBe(true);
  });

  it.each(Object.keys(WALL_ASSEMBLIES))(
    "keeps %s layers touching in assembly and separates them along their thickness axis",
    (assembly) => {
      for (const exploded of [false, true]) {
        const parts = wallLayout(WALL_ASSEMBLIES[assembly].layers, exploded);
        parts.slice(1).forEach((part, i) => {
          const previous = parts[i];
          expect(
            part.x - part.thickness / 2 - (previous.x + previous.thickness / 2),
          ).toBeCloseTo(exploded ? 44 : 0);
          // Align one edge of the stepped cutaway; every layer stands on z=-140.
          expect(part.y + part.width / 2).toBeCloseTo(
            previous.y + previous.width / 2,
          );
          expect(part.height).toBeLessThan(previous.height);
        });
        expect(parts[0].x - parts[0].thickness / 2).toBeCloseTo(
          -(parts[parts.length - 1].x + parts[parts.length - 1].thickness / 2),
        );
      }
    },
  );
});
