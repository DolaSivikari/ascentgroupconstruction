import { z } from "zod";

export const HEALTH_ORIGIN = "https://www.ascentgroupconstruction.com";
export const HEALTH_WORKFLOW_URL =
  "https://github.com/DolaSivikari/ascentgroupconstruction/actions/workflows/site-health.yml";
export const publicHealthPath = (path: string) =>
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !/[?:#]/.test(path) &&
  !path.includes("..") &&
  !path.startsWith("/admin") &&
  !["/tekev", "/404", "/unsubscribe"].includes(path);
export const healthIssueSchema = z.object({
  code: z
    .string()
    .regex(/^[a-z_]+$/)
    .max(60),
  severity: z.enum(["error", "warning", "info"]),
  message: z.string().min(1).max(500),
  target: z.string().max(500).optional(),
  fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
});
export const healthResultSchema = z.object({
  id: z.string().uuid(),
  path: z.string().max(500).refine(publicHealthPath),
  viewport: z.enum(["desktop", "mobile"]),
  http_status: z.number().int().min(100).max(599).nullable(),
  load_ms: z.number().int().nonnegative().max(600_000).nullable(),
  title: z.string().max(300).nullable(),
  h1: z.string().max(300).nullable(),
  canonical: z.string().max(500).nullable(),
  text_hash: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .nullable(),
  console_errors: z.number().int().nonnegative(),
  failed_requests: z.number().int().nonnegative(),
  issues: z.array(healthIssueSchema).max(100),
  checked_at: z.string().datetime(),
});
export const healthPayloadSchema = z
  .object({
    version: z.literal(1),
    id: z.string().uuid(),
    kind: z.enum(["full_crawl", "manual"]),
    target_origin: z.literal(HEALTH_ORIGIN),
    commit_ref: z.string().max(80).nullable(),
    started_at: z.string().datetime(),
    finished_at: z.string().datetime(),
    paths: z.array(z.string().max(500).refine(publicHealthPath)).max(500),
    results: z.array(healthResultSchema).max(1000),
    blocked: z.boolean(),
    failure: z.string().max(500).nullable(),
  })
  .superRefine((value, context) => {
    const pairs = new Set(
      value.results.map((row) => `${row.path}:${row.viewport}`),
    );
    if (
      new Set(value.paths).size !== value.paths.length ||
      pairs.size !== value.results.length ||
      value.results.some((row) => !value.paths.includes(row.path))
    )
      context.addIssue({
        code: "custom",
        message: "Duplicate or unexpected page results",
      });
    if (
      !value.blocked &&
      !value.failure &&
      (!value.paths.length ||
        value.results.length !== value.paths.length * 2 ||
        value.paths.some(
          (path) =>
            !pairs.has(`${path}:desktop`) || !pairs.has(`${path}:mobile`),
        ))
    )
      context.addIssue({
        code: "custom",
        message: "Complete desktop and mobile coverage is required",
      });
    if (Date.parse(value.finished_at) < Date.parse(value.started_at))
      context.addIssue({ code: "custom", message: "Invalid run times" });
  });
export type HealthIssue = z.infer<typeof healthIssueSchema>;
export type HealthResult = z.infer<typeof healthResultSchema> & {
  run_id: string;
};
export type HealthPayload = z.infer<typeof healthPayloadSchema>;
export type IssueState = {
  fingerprint: string;
  state: "fixed" | "ignored";
  reason: string | null;
  updated_at: string;
  updated_by: string | null;
};
export type HealthRun = {
  id: string;
  started_at: string;
  finished_at: string | null;
  kind: "full_crawl" | "baseline" | "manual";
  target_origin: string;
  commit_ref: string | null;
  pages_checked: number;
  errors: number;
  warnings: number;
  status: "running" | "passed" | "warnings" | "failed" | "aborted" | "blocked";
};

export function distinctIssues(
  results: Array<{ issues: HealthIssue[] }>,
): HealthIssue[] {
  return [
    ...new Map(
      results
        .flatMap((row) => row.issues)
        .map((issue) => [issue.fingerprint, issue]),
    ).values(),
  ];
}
export function nightlyPilotDays(runs: HealthRun[]): number {
  return new Set(
    runs
      .filter(
        (run) =>
          run.kind !== "manual" &&
          run.finished_at &&
          ["passed", "warnings", "failed"].includes(run.status),
      )
      .map((run) => run.started_at.slice(0, 10)),
  ).size;
}
export function newSeriousIssues(
  current: HealthIssue[],
  previous: HealthIssue[],
  states: IssueState[],
): HealthIssue[] {
  const known = new Set(previous.map((issue) => issue.fingerprint));
  const ignored = new Set(
    states
      .filter((state) => state.state === "ignored")
      .map((state) => state.fingerprint),
  );
  return current.filter(
    (issue) =>
      issue.severity === "error" &&
      !known.has(issue.fingerprint) &&
      !ignored.has(issue.fingerprint),
  );
}
export function missingHealthSchema(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    ["42P01", "42703", "PGRST204", "PGRST205"].includes(
      String((error as { code?: string }).code),
    )
  );
}
export const healthTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not recorded";
