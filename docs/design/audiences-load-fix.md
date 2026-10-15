# Restore the homepage audience section after merge

The merged version of `WhoWeServeHomepage.tsx` still rendered the old client-benefits block, including `benefits.map`, after its data had moved to the unified carousel. Rendering therefore threw `ReferenceError: benefits is not defined`, which the section boundary displayed as “Who we serve could not load.”

Remove that obsolete block and its unused imports, and attach the header reveal to the remaining audience heading. Preserve the latest four audience cards, including their updated styling, wording and destinations, byte-for-byte. The unified carousel remains the single benefit system; there are no SQL or database changes.

The new component regression tests fail against merged main with the exact reported error and pass after this fix. The browser integration check now explicitly requires the four audience destinations and rejects a restored `[data-client-reasons]` block before checking the carousel.

[Verification results](audiences-load-fix-verification.json): targeted tests pass, desktop/phone fixture checks reach all four audience links and all 13 carousel benefits, and public comparison uses the last verified healthy pre-merge carousel build as its reference. The reference is **not** the already-broken merged build. Full TypeScript, build and existing operational gates passed. The full suite had one existing admin preview timing failure, and all three tests in that file passed on isolated rerun.

After merge, use Lovable **Publish → Update** and check in a private window. Existing open tabs need a refresh to load the fixed build; save any entered form details first. No publishing was performed here.
