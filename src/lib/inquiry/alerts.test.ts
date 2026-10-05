/// <reference types="node" />
import { describe, expect, it, vi } from "vitest";
import { webcrypto } from "node:crypto";
import {
  aggregateAlertStatus,
  recipientList,
  recipientKey,
  emailErrorCode,
} from "../../../supabase/functions/_shared/inquiry-alert-contract";
describe("per-recipient alert delivery", () => {
  it("deduplicates overlapping type and all recipients without losing addresses", () =>
    expect(
      recipientList([
        { email: " Staff@Example.test " },
        { email: "staff@example.test" },
        { email: "other@example.test" },
      ]),
    ).toEqual(["other@example.test", "staff@example.test"]));
  it("reports mixed delivery as partial and does not claim all-suppressed email was sent", () => {
    expect(aggregateAlertStatus(["sent", "failed"])).toBe("partial");
    expect(aggregateAlertStatus(["sent", "sent"])).toBe("sent");
    expect(aggregateAlertStatus(["suppressed", "suppressed"])).toBe(
      "suppressed",
    );
    expect(aggregateAlertStatus(["failed", "suppressed"])).toBe("failed");
  });
  it("makes provider keys stable for case variants and different for distinct recipients", async () => {
    vi.stubGlobal("crypto", webcrypto);
    expect(await recipientKey("STAFF@EXAMPLE.TEST")).toBe(
      await recipientKey("staff@example.test"),
    );
    expect(await recipientKey("staff@example.test")).not.toBe(
      await recipientKey("other@example.test"),
    );
    vi.unstubAllGlobals();
  });
  it("records safe error codes instead of provider responses that may contain private details", () => {
    expect(emailErrorCode({ code: "recipient_suppressed" })).toBe(
      "recipient_suppressed",
    );
    expect(
      emailErrorCode({ code: "send failed for private@example.test" }),
    ).toBe("send_failed");
  });
});
