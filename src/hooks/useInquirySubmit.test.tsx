import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useInquirySubmit } from "./useInquirySubmit";
const mock = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/lib/publicSettings", () => ({
  visitorSupabase: { functions: { invoke: mock.invoke } },
}));
const input = {
  inquiry_type: "general",
  contact_name: "Fixture Person",
  email: "fixture@example.test",
  message: "A real project question",
  consent_given: true,
};
beforeEach(() => {
  vi.clearAllMocks();
  mock.invoke.mockResolvedValue({
    data: { success: true, id: "saved", reference_code: "AGC-1" },
    error: null,
  });
});
describe("inquiry form retries", () => {
  it("retries an ambiguous failure with the original submission key and preserves a confirmed receipt", async () => {
    mock.invoke.mockResolvedValueOnce({
      data: null,
      error: new Error("Network interrupted"),
    });
    const { result } = renderHook(useInquirySubmit);
    await act(async () => {
      await expect(result.current(input)).rejects.toThrow(
        "could not be confirmed",
      );
    });
    await act(async () => {
      expect(await result.current(input)).toMatchObject({
        success: true,
        reference_code: "AGC-1",
      });
    });
    const bodies = mock.invoke.mock.calls.map((call) => call[1].body);
    expect(bodies[0].data.submission_key).toBe(bodies[1].data.submission_key);
    expect(bodies[1].data.consent_given).toBe(true);
    expect(bodies[1].data.source_path).toBe("/");
  });
  it("uses a new key after changing the request, and rejects missing consent without sending", async () => {
    const { result } = renderHook(useInquirySubmit);
    await act(async () => {
      await result.current(input);
      await result.current({
        ...input,
        message: "A different project question",
      });
    });
    expect(mock.invoke.mock.calls[0][1].body.data.submission_key).not.toBe(
      mock.invoke.mock.calls[1][1].body.data.submission_key,
    );
    await act(async () => {
      await expect(
        result.current({ ...input, consent_given: false }),
      ).rejects.toThrow();
    });
    expect(mock.invoke).toHaveBeenCalledTimes(2);
  });
});
