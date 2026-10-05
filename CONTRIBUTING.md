# Contributing to Ascent Group Construction

Start with [the development guide](docs/development/README.md) and [AGENTS.md](AGENTS.md).

Thanks for working on this codebase. This guide focuses on the rules that the
linter cannot enforce — most importantly, the **design token system**.

---

## Design Tokens (mandatory)

The site uses a **semantic token system** built on CSS variables and exposed as
Tailwind utility classes. Every color decision in a component must go through
this system. Do **not** reach for raw Tailwind palette utilities like
`bg-green-500` or `text-yellow-400`.

### Why

1. **Consistent branding.** Designers tweak the palette in one place
   (`src/styles/tokens.css`) and the entire site updates.
2. **Dark mode works.** Semantic tokens have light/dark variants; palette
   utilities don't.
3. **Accessibility.** Foreground/background pairs are pre-checked for contrast.
4. **Auditability.** A linter can enforce "no palette colors" — it cannot
   enforce "use the *right* shade of green for status pills."

### The semantic palette

| Intent  | Background     | Text             | Border         | Foreground (text on bg) |
| ------- | -------------- | ---------------- | -------------- | ----------------------- |
| Success | `bg-success`   | `text-success`   | `border-success` | `text-success-foreground` |
| Warning | `bg-warning`   | `text-warning`   | `border-warning` | `text-warning-foreground` |
| Danger  | `bg-danger`    | `text-danger`    | `border-danger`  | `text-danger-foreground`  |
| Info    | `bg-info`      | `text-info`      | `border-info`    | `text-info-foreground`    |

Brand surfaces: `bg-brand-primary`, `bg-brand-accent`, `bg-bg-soft`, `bg-muted`,
`text-ink`, `text-muted-foreground`, `border-line`.

Opacity ramps work: `bg-success/10`, `bg-warning/20`, `bg-danger/50`, etc.

### Live preview

Run the dev server and visit **`/dev/tokens`** to see every token rendered with
its class name. Use it as a copy-paste reference when building UI.

### Examples

#### ✅ Do

```tsx
// Status pill
<span className="bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full text-sm">
  Active
</span>

// Inline alert
<div className="bg-danger/5 border-l-4 border-danger p-4">
  <p className="text-danger font-semibold">Submission failed</p>
</div>

// Use the Badge component (already wired to tokens)
<Badge variant="warning">Pending Review</Badge>
```

#### ❌ Don't

```tsx
// Hardcoded palette — breaks dark mode, can't be re-themed
<span className="bg-green-100 text-green-700">Active</span>

// Hardcoded HSL — same problem, plus invisible to grep audits
<div className="bg-[hsl(142_76%_36%)] text-white">Success</div>

// Inline style — bypasses the design system entirely
<div style={{ color: '#16A34A' }}>Success</div>
```

### When you genuinely need a custom color

Almost never. If the design calls for a new accent, **add it as a token first**:

1. Add an HSL CSS variable in `src/styles/tokens.css`:
   ```css
   --eco-accent: 80 47% 40%;
   ```
2. Wire it into `tailwind.config.ts`:
   ```ts
   "eco-accent": "hsl(var(--eco-accent))",
   ```
3. Use `bg-eco-accent` / `text-eco-accent` in components.

Document the new token in the relevant section of this file and in
`docs/design/README.md`.

### Status badges

The `<Badge>` component in `src/components/ui/badge.tsx` accepts a `variant`
prop that maps directly to semantic tokens. Use it instead of building your own
pills:

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="success">Won</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Lost</Badge>
<Badge variant="info">Contacted</Badge>
```

Legacy variant names (`active`, `completed`, `resolved`, `new`, `contacted`,
`inactive`) are aliased to the canonical semantic variants so existing code
continues to work.

---

## Other notable conventions

- **Roles**: stored in `public.user_roles`, never on `profiles`. Check via the
  `has_role()` security-definer function — never via client-side storage.
- **Supabase client**: import from `@/integrations/supabase/client`. Never
  edit `src/integrations/supabase/client.ts` or `types.ts` — both are
  auto-generated.
- **Edge functions**: live in `supabase/functions/<name>/index.ts`. Verify
  deployment separately; a Git commit or frontend publish does not prove deployment.
- **Routes**: registered in `src/routes/AppRoutes.tsx`. Lazy-load anything
  outside the homepage entry path.
- **Project instructions**: read `AGENTS.md` and the current assessment/plan
  entry point before making sweeping changes.

For a deep dive on architecture see `docs/archive/guides/ARCHITECTURE_OVERVIEW.md`. For brand
guidelines see `docs/archive/guides/BRAND_GUIDELINES.md`.
