import { describe, expect, it, vi } from "vitest";
import { uploadRfpAttachments } from "./rfpAttachments";
describe("RFP attachments", () => {
  it("stops a submission on failure and reuses earlier successful files on retry", async () => {
    const first = new File(["a"], "plan.pdf");
    const second = new File(["b"], "scope.pdf");
    const uploaded = new Map<File, string>();
    const upload = vi
      .fn()
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: new Error("offline") });
    await expect(
      uploadRfpAttachments([first, second], uploaded, upload),
    ).rejects.toThrow('Could not upload "scope.pdf"');
    expect(uploaded.size).toBe(1);
    upload.mockResolvedValue({ error: null });
    const paths = await uploadRfpAttachments([first, second], uploaded, upload);
    expect(paths).toHaveLength(2);
    expect(paths[0]).toBe(uploaded.get(first));
    expect(upload).toHaveBeenCalledTimes(3);
    expect(upload.mock.calls[2][1]).toBe(second);
    expect(await uploadRfpAttachments([], uploaded, upload)).toEqual([]);
  });
});
