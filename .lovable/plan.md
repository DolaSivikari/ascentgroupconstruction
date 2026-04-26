## Fix: Quick Contact form fields missing `id` / `name` / `autoComplete`

### Diagnosis
DevTools is flagging the **homepage Quick Contact form** in `src/components/homepage/InteractiveCTA.tsx` (lines 241–297). The four fields — Name, Email, Phone, Message textarea — are rendered without `id`, `name`, or `autoComplete` attributes, so browsers can't reliably autofill them and the accessibility audit warns about it.

The other forms across the site (RFP steps, Contact page, Estimator, Resume dialog, Newsletter) already have `id`s wired up and aren't the source of these specific 4 warnings.

### Changes

**`src/components/homepage/InteractiveCTA.tsx`** — add `id`, `name`, and `autoComplete` to each input + textarea, and pair each with a visually-hidden `<label htmlFor>` for screen readers (placeholders alone are not accessible labels):

| Field | id / name | autoComplete |
|---|---|---|
| Name | `quick-contact-name` | `name` |
| Email | `quick-contact-email` | `email` |
| Phone | `quick-contact-phone` | `tel` |
| Message | `quick-contact-message` | `off` |

Add `<Label htmlFor="..." className="sr-only">` above each field so the visible UI doesn't change but assistive tech and Chrome's autofill heuristics get proper labels.

### Audit pass (defensive)
While in there, do a quick `rg` sweep for any other `<Input` / `<Textarea` usages on public landing components that lack an `id`, and patch the same way if found. Most known forms are already compliant per memory, so this should be a small list (likely just `InteractiveCTA` based on the DevTools resource count of 4).

### Verification
1. After deploy, open the homepage in Chrome DevTools → Issues panel; the 4 "form field element should have an id or name" entries tied to those exact selectors should disappear.
2. Browser autofill (Chrome/Safari) should now offer to fill name/email/phone in the Quick Contact form.
3. Submission flow is unchanged — `handleQuickContact` still reads from `formData` state, so no behavioral regression.

### Out of scope
- The other DevTools notices in your screenshot (SVG animation perf hint, deprecated `unload` listener) originate from the **Lovable editor SDK** (`lovable.js`), not your app — no fix possible from project code.