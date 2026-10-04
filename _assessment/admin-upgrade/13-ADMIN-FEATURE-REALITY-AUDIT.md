# 13. Admin panel: which features are real and which are fake

Read-only audit, 3 October 2026. I traced each admin feature through four steps: the admin screen, the database table it saves to, the public page that should read that table, and what a visitor actually sees. Four parallel reviews covered the work. I re-checked the most important claims myself: the new-project date failure, the About page that reads nothing, and the Contact and phone settings requests. Nothing in the repository was changed.

**Caveat.** This folder is a few PRs behind GitHub. PR #43 (the quote fix) and the new Leads workspace are not in it. Neither touches the features below, but re-check any line numbers against `main` before changing code.

**Verdicts**

| Verdict | Meaning |
|---|---|
| ✅ REAL | Saving in the admin changes the website |
| 🟡 PARTIAL | Works, but some fields are ignored, or it breaks in common cases |
| ❌ FAKE | Saves to the database, but the website never reads it |
| 💥 BROKEN | The save itself fails, or the result is wrong |
| ⚫ DEAD | A placeholder or leftover with no function |

---

## 1. Scorecard

| Area | Feature | Verdict | Why, in one line |
|---|---|---|---|
| Leads | Inbox, notifications, Leads workspace | ✅ | Real data, recently rebuilt |
| Content | **Blog posts** | 🟡 | Create, publish and preview work. 3 inputs are never saved, 5 case-study fields never show, and the list-page preview button is broken |
| Content | **Projects** (edit existing) | 🟡 | Saves and publishes. Autosave can push half-done edits live, deleting an image removes the file before you press Save, and preview never shows drafts |
| Content | **Projects** (create new) | 💥 | Fails unless both dates are filled. Empty dates are sent as `""`, which the date column rejects (`ProjectEditor.tsx:40-41`, `projectEditor.ts:27-34`) |
| Content | **Services** | 🟡 | Saves and publishes. Most of the public page (overview, process, benefits, FAQs, category) can't be edited. 9 service pages are written in code, so admin edits never reach them |
| Content | **Documents** | ✅/🟡 | Uploads appear on /prequalification. Expired documents still show, and the download counter never increases |
| Content | **Testimonials** | ❌ | No page shows testimonials (the public component is imported nowhere) |
| Content | **Media Library** | ❌ | Always empty. It lists only image rows in the documents table, and the uploader there accepts only PDF and Office files. No upload, no picker |
| Website | **Homepage → Hero slides** | ✅ | Database slides replace the built-in ones. The description and icon fields are ignored, and reordering doesn't report errors |
| Website | **Homepage → Why Choose Us** | ✅ | Works |
| Website | **Homepage → Company Overview** | ❌ | Its public section is not on any page |
| Website | **Services → Featured / Promotions** | ❌ | Their public sections are not on any page. The homepage service grid is fixed code |
| Website | **Page Headers** | ⚫ (read-only) | A list of pages, not an editor. Header images are set in code |
| Website | **SEO Dashboard → robots.txt** | ❌ | Saved to the database. The site serves the fixed `public/robots.txt` |
| Website | **SEO Dashboard → Regenerate sitemap** | ❌💥 | The site serves the fixed `public/sitemap.xml`. The button shows "undefined URLs", and its log write is denied |
| Website | **SEO Dashboard → keywords and scores** | 🟡 | Analytics only. Page titles and descriptions can't be edited here; they live in each page's code |
| Website | Navigation menu editor | ⚫ | The page says plainly that no editor exists. The menu is fixed code |
| Settings | **About page** | ❌ | All 12 fields are fake. `About.tsx` doesn't read the database at all |
| Settings | **General** | ❌ (mostly) | Only **Address** reaches the site (footer). Company name, tagline, social links, default meta, founded year and email are never shown. Phone works on some pages only (see 2.1) |
| Settings | **Footer** | 🟡 | LinkedIn, phone and email work. Facebook, X and Instagram are ignored |
| Settings | **Contact page** | 💥/❓ | Probably broken for visitors (see 2.1): you see your edits while logged in, visitors see built-in values. Toll-free, careers and RFP emails are never shown |
| Settings | **Security** | ❌💥 | Nothing reads these settings. Password switches set to "off" come back "on" after reload (`\|\| true`), and the tab may not save at all because no settings row exists |
| Settings | **Health Check** | 🟡 | Runs as the admin, so it can't see the visitor-side failure and shows a misleading "all green" |
| Settings | **Email Templates** | ❌ | No email uses them. Real emails are built in code |
| Settings | **Users & Roles** | 🟡 | Lists users. Role changes work for super admins only; plain admins get a generic error. Editor, contributor and viewer can't open the admin at all. The permission table is static and wrong. "Active" is hard-coded |
| Tools | **Monitoring** | ❌/🟡 | Browser errors are real. "System Status: Healthy" is hard-coded, "Avg Load Time" is always 0 ms, and performance tracking is switched off |
| Tools | **Audit Log** | 🟡 | Real, but it only logs profiles, roles and projects. The IP and browser columns are always empty |
| Shell | Onboarding tour | 💥 | Points at sidebar markers that don't exist, describes features that don't exist, and can't be restarted |
| Shell | Sidebar links | ✅ | All 17 links open a real page. One dead link: "Back to Dashboard" inside the hero editor goes to `/admin/dashboard` (404) |

**Count:** of about 30 admin features, roughly **6 work fully**, **10 partly work**, **11 are fake** (save but are never shown) and **4 are broken**.

---

## 2. Root causes (why "I edit it but the site doesn't change")

### 2.1 Visitors can't read the settings, while you can (likely; needs one live check)
- A security hardening step (`drizzle/migrations/0001_*.sql:2-14`) hides some columns of `site_settings` and `contact_page_settings` from anonymous visitors (phone, emails).
- The Contact page and `PhoneLink` ask for **every column** (`useSettingsData` defaults to `select('*')`, `useActiveSettings.ts:10`; `Contact.tsx:43`, `PhoneLink.tsx:19`).
- When a visitor isn't allowed to see one of those columns, the database rejects the whole request. The code then quietly falls back to built-in values (`Contact.tsx:146-153`).
- Logged in as admin you're allowed to see everything, so you see your edits. A visitor sees the old built-in text.
- **To confirm:** open /contact in a private window after changing the office hours. Or run preflight query 11 to see whether that hardening step is live.

### 2.2 The website was rebuilt with fixed text, and the editors weren't updated
- **About page:** `About.tsx` is entirely fixed text, from in-file constants and `src/data/*`.
- **Homepage:** `Index.tsx` uses fixed sections (`HomepageServiceHighlights`, `HomepageProofStrip`, `WhoWeServeHomepage`).
  - The components that did read the database are no longer placed on any page: `CompanyOverviewHub`, `SmartPopularServices`, `ServicePromotionsSection`, `ValuePillars` and `Testimonials`.
  - The admin editors still write to those tables.
- Header phone, sticky bar and calls to action use the code constant `COMPANY_PHONE` on purpose (`siteSettingsColumns.ts:2-5`, "so they cannot be bulk harvested"). The admin still offers a phone field.

### 2.3 Fixed files beat database settings
- robots.txt and sitemap.xml are fixed files in `public/`. Nothing on the host reads the database versions.

### 2.4 Editor bugs
- **Projects:**
  - Empty dates break the save.
  - Autosave writes the whole form, including published or draft state, to the live row every 30 seconds.
  - Deleting a gallery image removes the file immediately, before you press Save.
  - Drag-and-drop uses a stale copy of the image list and can drop newly added images.
  - Preview links use the wrong format, and the project page never reads preview tokens.
- **Blog:**
  - `sector`, `source` and `is_pinned` are never saved.
  - Case-study fields are never shown.
  - Before/after images can't be added.
  - The list page's preview button never saves its preview token.
  - The header Save button skips validation.
- **All editors:**
  - The "rich text" editor is a plain text box (`RichTextEditor.tsx:45`). On project pages, line breaks collapse into one paragraph.
  - Back and Cancel discard changes without warning.
  - Error messages say "Failed to save" without the reason.
  - Some labels show garbled characters (text encoding).
- **Settings:**
  - About and Security have no starting database row, so Save can fail with "Cannot read properties of null".

### 2.5 Pages that look busy but say nothing true
- Monitoring shows "Healthy" and 0 ms.
- Users shows a static permission table and marks everyone "Active".
- The onboarding tour points at nothing.
- Email Templates and Media Library show data that nothing else uses.

---

## 3. What to do with each feature: connect, fix or remove

For each fake feature, the choice is: **connect it** (make the website read it), **fold it in** (merge it into something real), or **remove it** (so the admin stops lying). My recommendation is in the last column.

| Feature | Recommendation | Reason |
|---|---|---|
| About page settings | **Connect** a small set: hero headline and intro, the story paragraphs, the stat strip and the founder quote. Remove the rest (sustainability, safety, satisfaction %) | The owner expects to edit this page. Credential wording stays on owner hold, so those blocks stay in code until decided |
| General settings | **Connect** company tagline, social links (used in footer and structured data) and default meta. **Remove** the phone and email fields, or make them read-only with "set in code for spam protection" | One source of truth |
| Contact page settings | **Fix** the read: request only allowed columns, and serve phone and email through the existing constants. **Remove** the toll-free, careers and RFP email fields | Visitors currently see built-in values |
| Footer | **Connect** the remaining socials, or remove those fields | |
| Security settings | **Remove the tab.** The real controls (MFA, password rules, lockout) live in Supabase Auth and the `check-login-attempt` function. Make the idle timeout a single code setting | Pretending to enforce security is worse than not offering it |
| Email Templates | **Remove** from the menu (keep the table). Emails are code templates in the Lovable email stack. Admin email work moves to the planned Email Delivery page and recipient settings | No email reads it |
| Media Library | **Rebuild** as a real image library over the `project-images` bucket: upload, browse, copy URL, alt text. **Add a "choose existing image" picker** to every image field | Biggest everyday friction |
| Testimonials | **Connect** (put the section on the homepage or About) once real testimonials exist, or **hide** the menu item until then | The owner holds testimonial content |
| Company Overview, Featured Services, Promotions | **Remove** the editors (keep the tables), unless the owner wants those homepage sections back. The current homepage design doesn't use them | Design was approved without them |
| robots.txt editor, Regenerate sitemap | **Remove** both buttons, and replace them with a read-only "what crawlers see" panel showing the live file | The files are deployed with the code |
| Page Headers | **Keep** as an inventory, labelled "read-only, managed in code" | Already honest |
| Navigation editor placeholders | **Remove** the routes | Nobody needs a page that says "not available" |
| Monitoring | **Fix:** real status from recent errors, drop the 0 ms card or record real web vitals, and show load errors | |
| Audit Log | **Extend** logging to services, blog, settings and inquiries; fill actor names; drop the empty IP and browser columns | |
| Users & Roles | **Fix:** `set_user_role` (already in the 0001 SQL). Hide role editing from non-super-admins. Remove the editor, contributor and viewer options (or let them in with limited menus, which is bigger work). Delete the static permission table and the fake "Active" | |
| Onboarding tour | **Remove** it; replace it with a one-page "How to" panel linked from the user menu | |

---

## 4. Making it smoother: the editing experience

These are the changes that make adding a project or a blog post quick:

1. **One-page editors with a sticky top bar.** The title, a status pill (Draft or Published), a **Publish/Unpublish** switch, **Preview** and **Save** are always visible. The 6 project tabs become sections on one scrolling page, with a left-hand outline. Publishing is no longer hidden in the SEO tab.
2. **Autosave that never publishes.** Autosave keeps a draft copy (local, or a `draft_data` column) and never touches the live row until you press Save or Publish. Show "Saved 10 s ago".
3. **Working preview** for projects, services and blog, using the existing preview-token functions and one shared link format.
4. **A real text editor.** It needs bold, headings, lists, links, line breaks and pasting from Word, and it must store safe HTML. This needs one new library such as Tiptap; that is an owner decision because the current rules forbid new dependencies. The alternative is Markdown with a live preview, which needs no new library but is less friendly.
5. **Image handling that matches how people work.** Drag-drop several images, reorder with thumbnails, set the cover image with one click, pick from the library, and delete only on Save.
6. **List pages that help.** Every list gets thumbnails, search, a status filter (Draft, Published, Archived), sort, "Duplicate" and quick publish. The Projects page already has this code, unrendered.
7. **Clear errors.** Show the real reason ("This slug is already used by *Project X*"). Warn before leaving with unsaved changes, including Back and Cancel. Fix the garbled labels.
8. **Fields that match the page.** Every field shown on the public page is editable, and no field in the admin is invisible on the site. Remove or wire the mismatches listed in 2.4.

---

## 5. Look and feel (graphical redesign)

The current state:
- The admin is always dark (`admin-dark-theme`).
- Accents are a slightly different orange from the website (#FF6600 vs #F97316).
- Pages mix card styles.
- Headers are inconsistent.
- The sidebar groups don't match how you work (Website vs Settings, "Analytics & Logs").

**Proposed direction:**
- **Light theme by default with a dark toggle.** Light reads better for long editing sessions and matches the website.
- Use the brand's navy, white and steel blue, with **one** accent orange (the website's #F97316).
- Barlow for headings, a readable body size (15–16 px), generous spacing and an 8 px radius.
- **Shell:**
  - A slim left sidebar with icons and labels, grouped by task:
    - **Today:** Dashboard, Leads
    - **Content:** Projects, Blog, Services, Documents, Media, Testimonials
    - **Website:** Homepage, About, Contact & Footer, SEO overview
    - **Admin:** Users, Settings, Activity
  - A top bar with page title, search (Ctrl/Cmd+K), "+ New" (project, post, service), the bell, View site, and a user menu.
- **One page template everywhere:** a header (title, short help line, primary action at top-right), a filter row, then content. Every empty state explains what to do next ("No projects yet. Add your first project →").
- **Phone use:** sidebar becomes a bottom sheet, tables become cards, editors become single-column with the action bar fixed at the bottom.

If you want to see it before Codex builds it, I can make a clickable mockup of the dashboard, a list page and the project editor.

---

## 6. Suggested order (for Codex, after the Leads phases already planned)

| Step | What | Size |
|---|---|---|
| R1 | **Stop the lies and the breakage.** Fix the project empty-date save, the Contact/PhoneLink column request, the Security `\|\| true` bug, the About/Security missing-row save, the hero "Back to Dashboard" link, the blog list preview, the blog unsaved fields, Monitoring "Healthy"/0 ms, and the fake "Active". Hide the fake menu items (Email Templates, Media Library until rebuilt, Company Overview, Featured, Promotions, robots/sitemap buttons, Security tab, navigation placeholders, tour) | Small |
| R2 | **Connect the settings that matter.** About page fields (as agreed), General tagline, socials and meta, Contact page, Footer socials. Add a "visitor view" check to Health Check that runs a read without logging in | Medium |
| R3 | **New admin shell and theme** (section 5): light/dark, sidebar regroup, top bar, page template, mobile | Medium |
| R4 | **Editor rebuild** (section 4): one-page editors, sticky bar, draft autosave, preview, image manager, list pages | Large |
| R5 | **Media Library and picker** | Medium |
| R6 | Roles cleanup, extended audit log, real monitoring | Medium |

R1 can run in parallel with the Leads phases (P4a, P5), because they touch different files. R3 should replace the separate "header bar and sidebar" work in P5, so the shell isn't built twice.

---

## 7. Decisions needed from you

1. **For each fake feature: connect or remove?** Section 3 gives my recommendation. The ones that need your call are **About page** (which parts you want to edit yourself), **Testimonials** (hide until you have real ones?), and **Company Overview / Featured / Promotions** (bring those homepage sections back, or drop the editors?).
2. **Rich text:** allow one new library (Tiptap) for a proper editor, or use Markdown with preview?
3. **Theme:** light by default with a dark toggle, or stay dark?
4. **Mockup first?** Would you like a clickable design mockup to approve before Codex builds R3 and R4?
5. **Roles:** do other people (an estimator, an assistant) need limited logins? If not, remove the editor, contributor and viewer options.
