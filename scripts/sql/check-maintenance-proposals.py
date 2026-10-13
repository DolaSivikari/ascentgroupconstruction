"""Offline checks against the explicitly named, network-isolated Docker fixture only.

Create a fresh agc-maintenance-fixture container, then apply maintenance-fixture.sql.
Never pass a database URL, project reference, password or production container.
"""
import os
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
ENV = os.environ.copy()
for key in ("DOCKER_HOST", "DOCKER_CONTEXT", "DOCKER_TLS", "DOCKER_TLS_VERIFY", "DOCKER_CERT_PATH"):
    ENV.pop(key, None)
DOCKER = ["docker", "--host=unix:///var/run/docker.sock"]
CONTAINER = "agc-maintenance-fixture"
network = subprocess.check_output(DOCKER + ["inspect", "--format", "{{.HostConfig.NetworkMode}}", CONTAINER], env=ENV, text=True).strip()
if network != "none":
    raise RuntimeError("Requires the network-isolated disposable fixture")


def sql(source, failure=None):
    result = subprocess.run(DOCKER + ["exec", "-i", CONTAINER, "psql", "-U", "postgres", "-X", "-qAt", "-v", "ON_ERROR_STOP=1"],
                            input=source, text=True, capture_output=True, env=ENV)
    if failure:
        assert result.returncode != 0 and failure in result.stderr, result.stderr
    elif result.returncode:
        raise RuntimeError(result.stderr)
    return result.stdout.strip()


assert sql("select count(*) from public.performance_metrics") == "5", "Fresh fixture required"
folder = ROOT / "docs/operations/sql"
truncate = (folder / "revoke-browser-truncate.proposal.sql").read_text()
retention = (folder / "performance-retention.proposal.sql").read_text()
recovery = (folder / "performance-retention.recovery.sql").read_text()
catalog_query = re.search(r"  select md5\(jsonb_build_object\([\s\S]+?into actual_catalog;", truncate).group().replace("into actual_catalog", "")


def reviewed_truncate():
    return truncate.replace("PENDING_RECHECK_AND_APPROVAL", sql(catalog_query))


sql(truncate, "Unapproved or changed")
sql(retention, "Retention is not approved")
sql("create role fixture_inherited; grant fixture_inherited to anon; grant truncate on public.performance_metrics to fixture_inherited;")
sql(reviewed_truncate(), "inherited TRUNCATE remains")
assert sql("select has_table_privilege('anon','public.error_logs','TRUNCATE')") == "t", "Failed revoke must roll back"
sql("revoke fixture_inherited from anon; revoke truncate on public.performance_metrics from fixture_inherited; drop role fixture_inherited;")
sql(reviewed_truncate())
assert sql("select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace cross join pg_roles r where n.nspname='public' and c.relkind='r' and r.rolname in ('anon','authenticated') and has_table_privilege(r.oid,c.oid,'TRUNCATE')") == "0"
assert sql("select has_table_privilege('anon','public.performance_metrics','INSERT') and has_table_privilege('authenticated','public.performance_metrics','SELECT') and has_table_privilege('service_role','public.performance_metrics','TRUNCATE')") == "t"
print("TRUNCATE: unapproved/inherited changes refused; browser access removed; normal/server grants preserved")

fingerprint = sql("select md5(coalesce(string_agg(to_jsonb(m)::text,E'\\n' order by id),'')) from public.performance_metrics m where recorded_at < '2026-07-15T00:00:00Z'")
reviewed = retention.replace("bigint := -1", "bigint := 2").replace("PENDING_RECHECK_AND_APPROVAL", fingerprint)
sql(reviewed.replace("bigint := 2", "bigint := 3"), "Eligible count or set drifted")
sql(reviewed.replace(fingerprint, "0" * 32), "Eligible count or set drifted")
sql("create table public.fixture_metrics_ref (metric_id uuid references public.performance_metrics(id));")
sql(reviewed, "Referencing foreign key found")
sql("drop table public.fixture_metrics_ref;")
sql("create function public.fixture_delete_hook() returns trigger language plpgsql as $$ begin delete from public.error_logs; return old; end $$; create trigger fixture_delete before delete on public.performance_metrics for each row execute function public.fixture_delete_hook();")
sql(reviewed, "Metrics trigger found")
assert sql("select count(*) from public.error_logs") == "1"
sql("drop trigger fixture_delete on public.performance_metrics; drop function public.fixture_delete_hook();")
forced_failure = reviewed.replace("-- Every deleted row", "alter table agc_metrics_archive_20261013.performance_metrics add constraint fixture_archive_failure check (value < 0);\n-- Every deleted row")
sql(forced_failure, "fixture_archive_failure")
assert sql("select count(*) from public.performance_metrics") == "5"
assert sql("select to_regclass('agc_metrics_archive_20261013.performance_metrics') is null") == "t"
sql(reviewed)
assert sql("select count(*) from public.performance_metrics") == "3"
assert sql("select count(*) from agc_metrics_archive_20261013.performance_metrics") == "2"
assert sql("select count(*) from public.performance_metrics where recorded_at is null or recorded_at = '2026-07-15T00:00:00Z'") == "2"
assert sql("select count(*) from public.error_logs") == "1"
assert sql("select count(*) from public.audit_log") == "1"
assert sql("select count(*) from public.content_versions") == "1"
sql(recovery, "Recovery requires a separate reviewed approval")
sql(recovery.replace("  raise exception 'Recovery requires a separate reviewed approval; remove this guard only then';", "  null; -- disposable fixture review only"))
assert sql("select count(*) from public.performance_metrics") == "5"
sql(recovery.replace("  raise exception 'Recovery requires a separate reviewed approval; remove this guard only then';", "  null; -- disposable fixture review only"), "Recovery ID collision")
print("Retention: approval/count/set/FK/trigger guards, archive failure rollback, cutoff/NULL preservation and recovery/collision checks passed")

# Validate the read-only verification query against the historical contract,
# strictly in this fixture. This is not the missing owner-reviewed activation SQL.
verification = (folder / "site-health-verification.sql").read_text()
contract_query = "with expected" + verification.split("with expected", 1)[1].split(";", 1)[0] + ";"
assert len(sql(contract_query).splitlines()) == 29, "All missing columns must be reported"
historical = (ROOT / "supabase/migrations/20261004050716_site_control_and_health.sql").read_text()
fixture_health = "create schema auth; create function auth.uid() returns uuid language sql as $$ select null::uuid $$; create table public.profiles(id uuid primary key); create function public.is_admin(uuid) returns boolean language sql as $$ select false $$;\n"
for table in ("site_health_runs", "site_health_results", "site_health_issue_states"):
    fixture_health += re.search(r"create table public\." + table + r" \([\s\S]+?\n\);", historical).group() + "\n"
    fixture_health += "alter table public." + table + " enable row level security;\n"
fixture_health += "\n".join(line for line in historical.splitlines() if line.startswith("create index site_health_")) + "\n"
fixture_health += "revoke all on public.site_health_runs,public.site_health_results,public.site_health_issue_states from PUBLIC,anon,authenticated; grant all on public.site_health_runs,public.site_health_results,public.site_health_issue_states to service_role;\n"
fixture_health += historical[historical.index("grant select on public.site_health_runs"):historical.index("\ncommit;")]
sql(fixture_health)
assert sql(contract_query) == "", "Historical contract must have no column mismatches"
sql(verification)
print("Site Health verification: 29 absent columns detected; historical local fixture has zero column mismatches; aggregate/catalog queries execute")
