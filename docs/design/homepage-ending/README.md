# Homepage ending: secondary paths

Implements the owner-supplied Claude handoff against main `d40d961`, after PR #77. The handoff remains outside the repository as requested.

The inline inquiry form remains unchanged and is followed by a light, compact section headed “Prefer another way to start?” Three text blocks provide Contact, Projects and Prequalification links. The former second navy gradient, dot pattern, card buttons and entrance animation are removed. Content renders immediately, with semantic theme colors, three native links and no new dependencies or imagery.

The `HomepageFinalCta` named export and lazy import are preserved. Existing `home-final-cta` fields f001–f008 retain their IDs, order and roles. Only f001/f002 defaults change; f003–f008 remain byte-for-byte unchanged. New editable labels f009–f011 are appended, while destinations remain structural. Published overrides retain priority and may keep the old heading until edited in the existing Pages editor. No content records or activation flags are changed.

Scope is Home only. The form, Intake V2 behavior, hero/video/scroll framing, StickyInquiryBar, navigation, footer, company contact constants, credentials, response promises, metadata and other sections/routes are unchanged. A pre-existing malformed Home declaration in `config/page-safety/intentional-changes.json` is repaired while retaining its full historical reason, including the owner-authorized FAQ removal. The current ending change is appended to the same Home entry.

## Review

[Desktop](previews/desktop.png) · [Phone](previews/phone.png) · [Dark phone, enlarged text](previews/dark-phone.png)

Measured section heights (offline default content): 1440px viewport: **709.89 → 448px** (36.9% shorter); 390px viewport: **1390.53 → 898.80px** (35.4% shorter). Saved wording may produce different heights.

See `verification.json` for exact checks and measured before/after heights, `public-comparison.json` for the six-route comparison and `public-bundle.json` for bundle provenance. Section captures retain the existing floating inquiry and scroll controls; those controls are outside this PR. These are offline fixture captures with external requests intercepted, not evidence of live publishing, database contents or document availability. The retained before build matches main's application source exactly (`3c85620` and merge `d40d961` have identical Git trees).

Repeat the optional browser hook with `HERO_QA_ENDING=true` in `scripts/hero-headers-browser.cjs`; use `HERO_QA_ENDING_BEFORE=true` only for the original band. It checks native link destinations, heading structure, keyboard order and focus rings, overflow and clearance above the fixed bar at the page bottom. It measures section height and captures the section. It never submits a form.

## Owner decisions retained from the handoff

- The new link says “See prequalification details”; public downloadable files have not been verified. Existing f008 still says “download our prequalification package.” That description is unchanged pending an owner content decision.
- “Request a Proposal” still goes to `/contact`, overlapping the form above. Removing the path would need a separate decision and a safe content-field retirement approach.
- Existing estimate, response-time and credential statements remain unchanged. This PR neither reconciles them nor verifies their underlying facts.

After review and merge, the owner uses Lovable **Publish → Update** and checks the homepage ending in a private window at desktop/phone widths. A merge does not publish. Rollback is a PR revert followed by publishing; no SQL is required.
