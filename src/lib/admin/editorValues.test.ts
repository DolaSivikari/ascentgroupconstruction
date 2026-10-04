import { describe, expect, it } from "vitest";
import {
  adminErrorMessage,
  normalizeSlug,
  nullableDate,
  nullableInteger,
} from "./editorValues";

describe("editor values and actionable save failures", () => {
  it.each([
    [" Façade / Repair?! ", "facade-repair"],
    ["__A---B__", "a-b"],
    ["  ", ""],
  ])("sanitizes typed slug %s", (input, expected) =>
    expect(normalizeSlug(input)).toBe(expected),
  );
  it("converts empty dates and numbers to null and retains zero", () => {
    expect(nullableDate(" ")).toBeNull();
    expect(nullableDate("2026-10-04")).toBe("2026-10-04");
    expect(nullableInteger("", "Read time")).toBeNull();
    expect(nullableInteger("0", "Read time")).toBe(0);
    expect(() => nullableInteger(NaN, "Read time")).toThrow(
      "Read time must be a non-negative whole number",
    );
  });
  it.each([
    ["23505", "already in use"],
    ["22007", "date or number"],
    ["22P02", "date or number"],
    ["42501", "permission"],
  ])("explains database error %s", (code, reason) =>
    expect(adminErrorMessage({ code, message: "database detail" })).toContain(
      reason,
    ),
  );
});
