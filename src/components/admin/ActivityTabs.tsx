import { NavLink } from "react-router-dom";
export function ActivityTabs() {
  return (
    <nav aria-label="Activity views" className="flex flex-wrap gap-2">
      {[
        ["/admin/audit", "Audit log"],
        ["/admin/monitoring", "Site Health & errors"],
        ["/admin/email-delivery", "Email delivery"],
      ].map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `rounded-lg border px-3 py-2 text-sm ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
