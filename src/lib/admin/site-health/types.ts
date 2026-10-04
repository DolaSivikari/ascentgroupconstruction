import type { HealthRun, HealthResult, IssueState } from "./contract";
type Table<Row, Insert = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};
/** Hand-written until Lovable regenerates the database types. */
export type HealthDatabase = {
  public: {
    Tables: {
      site_health_runs: Table<HealthRun>;
      site_health_results: Table<HealthResult>;
      site_health_issue_states: Table<IssueState>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
