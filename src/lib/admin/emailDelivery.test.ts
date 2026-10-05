import { describe, expect, it } from "vitest";
import {
  emailDateRange,
  emailLeadHref,
  maskEmailAddresses,
  maskRecipient,
} from "./emailDelivery";
describe("email delivery presentation", () => {
  it("masks recipients in addresses and error details", () => {
    expect(maskRecipient("jane@example.test")).toBe("j***@example.test");
    expect(maskEmailAddresses("Delivery denied for jane@example.test")).toBe(
      "Delivery denied for j***@example.test",
    );
  });
  it("links existing RFP records and does not accept arbitrary metadata URLs", () => {
    expect(
      emailLeadHref({ rfp_id: "00000000-0000-4000-8000-000000000001" }),
    ).toBe(
      "/admin/inbox?tab=rfp&highlight=00000000-0000-4000-8000-000000000001",
    );
    expect(emailLeadHref({ inquiry_id: "https://external.test" })).toBeNull();
  });
  it("uses inclusive calendar days through an exclusive next-day UTC boundary", () => {
    expect(emailDateRange("2026-10-04", "2026-10-04")).toEqual({
      start: "2026-10-04T00:00:00.000Z",
      end: "2026-10-05T00:00:00.000Z",
    });
  });
});
