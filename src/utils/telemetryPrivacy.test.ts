import { expect, it } from "vitest";
import { diagnosticContext, diagnosticText } from "./telemetryPrivacy";
it("removes query/hash, credentials and contact details while keeping the asset path", () => {
  expect(
    diagnosticText(
      "https://user:password@example.test/assets/chunk.js?email=owner@example.test#token",
    ),
  ).toBe("https://example.test/assets/chunk.js");
  expect(
    diagnosticText("owner@example.test Bearer secret-token +1 647-528-6804"),
  ).not.toMatch(/owner|secret-token|647/);
});
it("drops arbitrary context and hides private package tokens", () => {
  expect(
    diagnosticContext({
      feature: "Editor",
      email: "private",
      additionalArgs: ["private"],
      line: 42,
    }),
  ).toEqual({ feature: "Editor", line: 42 });
  expect(
    diagnosticText("https://example.test/prequal-package/secret-token"),
  ).toBe("https://example.test/prequal-package/[redacted]");
});
