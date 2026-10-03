import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Estimate from "./Estimate";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  insert: vi.fn(),
  invoke: vi.fn(),
  conversion: vi.fn(),
  formSubmit: vi.fn(),
  toast: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: mocks.from, functions: { invoke: mocks.invoke } },
}));
vi.mock("@/lib/analytics", () => ({ trackConversion: mocks.conversion, trackFormSubmit: mocks.formSubmit }));
vi.mock("@/hooks/useABTest", () => ({ trackABTestConversion: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: mocks.toast }) }));
vi.mock("@/components/Navigation", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SEO", () => ({ default: () => null }));
vi.mock("@/components/shared/PageHero", () => ({ PageHero: () => null }));

type StepProps = { onChange: (field: string, value: string | boolean) => void };
vi.mock("@/components/estimator/EstimatorStep0", () => ({
  default: ({ onChange }: StepProps) => <button onClick={() => {
    onChange("quoteType", "trade_package");
    onChange("company", "Fixture GC");
    onChange("role", "general_contractor");
  }}>Trade package</button>,
}));
vi.mock("@/components/estimator/EstimatorStep1", () => ({
  default: ({ onChange }: StepProps) => <button onClick={() => {
    onChange("service", "residential_painting");
    onChange("sqft", "1000");
    onChange("stories", "1");
  }}>Set scope</button>,
}));
vi.mock("@/components/estimator/EstimatorStep2Enhanced", () => ({
  default: ({ onChange }: StepProps) => <button onClick={() => {
    onChange("prepComplexity", "standard");
    onChange("finishQuality", "standard");
    onChange("region", "toronto");
  }}>Set conditions</button>,
}));
vi.mock("@/components/estimator/EstimatorStep3", () => ({ default: () => null }));
vi.mock("@/components/estimator/EstimatorStep4", () => ({ default: () => null }));
vi.mock("@/components/estimator/EstimatorStep5", () => ({
  default: ({ onChange }: StepProps) => <button onClick={() => {
    onChange("name", "Fixture Client");
    onChange("email", "client@example.test");
    onChange("phone", "4165550100");
    onChange("consent", true);
  }}>Contact information</button>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.invoke.mockResolvedValue({ data: { success: true }, error: null });
  mocks.from.mockImplementation((table: string) => ({ insert: (payload: unknown) => {
    mocks.insert(table, payload);
    // Simulate insert-only access: asking for a representation is rejected.
    return Object.assign(Promise.resolve({ data: null, error: null }), {
      select: () => ({ single: async () => ({ data: null, error: { code: "42501" } }) }),
    });
  } }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function submitEstimate() {
  render(<MemoryRouter><Estimate /></MemoryRouter>);
  for (const action of ["Trade package", "Set scope", "Set conditions"]) {
    fireEvent.click(screen.getByRole("button", { name: action }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  }
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Contact information" }));
  fireEvent.click(screen.getByRole("button", { name: "Submit Request" }));
}

describe("estimate persistence", () => {
  it("saves an anonymous commercial quote without read permission or returned scoring fields", async () => {
    submitEstimate();
    await screen.findByRole("heading", { name: "Estimate Request Submitted" });
    expect(mocks.insert.mock.calls.map(([table]) => table)).toEqual(["contact_submissions", "quote_requests"]);
    expect(mocks.insert).toHaveBeenCalledWith("quote_requests", expect.objectContaining({
      quote_type: "trade_package", company: "Fixture GC", consent_given: true,
    }));
    expect(mocks.conversion).toHaveBeenCalledWith("quote_form_submitted", { quote_type: "trade_package" });
    expect(mocks.formSubmit).toHaveBeenCalledOnce();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("retains the saved estimate when the secondary quote fails, without a false conversion or personal-data log", async () => {
    const original = mocks.from.getMockImplementation()!;
    mocks.from.mockImplementation((table: string) => table === "quote_requests" ? {
      insert: async () => ({ error: { code: "23514", message: "Private client@example.test details" } }),
    } : original(table));
    submitEstimate();
    await screen.findByRole("heading", { name: "Estimate Request Submitted" });
    expect(mocks.conversion.mock.calls.some(([event]) => event === "quote_form_submitted")).toBe(false);
    expect(console.error).toHaveBeenCalledWith("Quote request save failed", { code: "23514" });
    expect(mocks.invoke).toHaveBeenCalledOnce();
  });

  it("does not claim success or send a notification when the primary estimate cannot be saved", async () => {
    mocks.from.mockReturnValue({ insert: async () => ({ error: new Error("Save unavailable") }) });
    submitEstimate();
    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Submission Error" })));
    expect(screen.queryByRole("heading", { name: "Estimate Request Submitted" })).not.toBeInTheDocument();
    expect(mocks.from).toHaveBeenCalledTimes(1);
    expect(mocks.formSubmit).not.toHaveBeenCalled();
    expect(mocks.invoke).not.toHaveBeenCalled();
  });
});
