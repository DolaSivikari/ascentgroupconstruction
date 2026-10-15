# Homepage repair-scope walkthrough

Owner request: make “From the scope to the handover” understandable, useful and visually realistic. Based on `f7a88cf` on main, including the owner's subsequent homepage edits and merged PR #76.

The section follows one educational window-joint example, W-01, from agreed scope to field record to closeout index. Each tab explains the work, boundaries or changes, the associated records and the decision that information helps the owner make. The example does not diagnose a leak, quote a project, claim a completed inspection or promise a particular warranty. Actual requirements depend on the building and agreed scope.

The generic elevation is replaced with a close-up AI-generated reference image of separation at a window-to-wall joint. This is deliberately disclosed in the caption; it is not actual Ascent project photography. The image was generated for this example, visually inspected and encoded as a 1536×1024 WebP (approximately 216 KB). It loads lazily with reserved dimensions. No remote image dependency or media upload is introduced.

Three existing Radix tabs retain arrow/Home/End keyboard navigation and active-panel semantics. Only the selected stage is shown. Existing content-module identity and retained field keys remain compatible with saved overrides; new fields use code defaults. Existing published values continue to take priority, so previously saved wording can still appear. No content records are rewritten. Detailed checklists and the existing getting-started steps are available in native expandable sections. Their text remains available; the process wording is unchanged.

Scope: this homepage section, its existing content module, targeted tests and verification hooks. The new primary action links to the existing Contact page; the Technology and Process links remain available. Public changes are declared only for Home visible text and screenshots. Navigation, hero/video/scroll behavior, credentials, metadata, forms, other homepage sections and database objects are outside this change.

[Desktop preview](previews/desktop.png) · [Phone preview](previews/phone.png)

Previews and verification are local production-build captures with synthetic fixtures and all external requests intercepted. They do not establish production database or publishing status. See `verification.json` for exact coverage and results.

After review and merge, the owner uses Lovable **Publish → Update** and checks the section on desktop and phone. Revert this PR and publish the reverted version to restore the previous section; no SQL rollback is needed.
