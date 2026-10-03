# Quarantine — Phase 0

No item below is approved for deletion. Phase 0 records candidates; Phase 2a must check imports, filename/stem references, runtime/config use and the effect of removal. Phase 2b requires the owner's explicit approved list. No removal/build/smoke experiment has been performed.

## Code candidates

All [175 raw file candidates](raw/unused-files-candidates.json) and [219 value-export candidates](raw/unused-exports-candidates.json) remain in place. The following historical F-44 candidates also appear in the current graph:

| Path | Why it looks unused | Why it was not deleted | What would settle it |
| --- | --- | --- | --- |
| `src/components/contractor/PremiumDocumentSuite.tsx` | Graph reports unreachable file | Phase 0 forbids removal; complete rule 10 evidence absent | Phase 2a evidence and owner approval |
| `src/components/homepage/GCTrustStrip.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/shared/CertificationBadges.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/homepage/ProvenTrackRecord.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/homepage/CompanyIntroduction.tsx` | Graph reports unreachable file; current Index does not import it | Same | Same |
| `src/components/homepage/CompanyOverviewHub.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/homepage/HomepageProcessStrip.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/services/PremiumServiceHero.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/homepage/ClientSelector.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/homepage/ClientValueProposition.tsx` | Graph reports unreachable file | Same | Same |
| `src/components/homepage/PrequalPackage.tsx` | Graph reports unreachable file | Same | Same |

The three historical header paths `src/components/sections/PageHero.tsx`, `src/components/PageHeader.tsx` and `src/components/ContentPageHeader.tsx` are already absent from this baseline. `src/components/shared/PageHero.tsx` is live and must remain.

## Assets and platform-sensitive candidates

The complete [size inventory](raw/metrics.json) preserves existing image paths. The graph cannot prove database image strings are unused; `assetResolver.ts` includes a wildcard asset lookup.

| Path | Why it looks unused or duplicated | Why it was not deleted | What would settle it |
| --- | --- | --- | --- |
| `src/assets/landing-bg-light.png`, `src/assets/landing-bg-dark.png` | Historical asset candidates | Asset glob and database string references are unresolved | Owner-supplied stored image paths, complete reference search and permitted later removal checks |
| `src/assets/ascent-logo-vertical-*.png` | Historical alternate-logo candidates | Same | Same |
| `src/assets/ascent-logo-horizontal-*-round.png` | Historical alternate-logo candidates | Same | Same |
| `src/assets/ascent-icon.png`, `src/assets/ascent-icon-round.png` | Historical icon candidates | Same; similar bytes exist in public brand assets | Same |
| `public/brand/logo-*.png` | Historical alternate-logo candidates | Public, email and CMS URL references may exist | Stored-path inventory and complete public/email reference search |
| `public/images/ascent-logo-nav-*.png` | Historical navbar-logo candidates | Same; navigation behavior is protected | Same, without changing navigation output |
| `public/fonts/inter-400.woff2` | Historical font candidate | Rule 11 protects public files; typography and references not audited for removal | Complete font/URL references and explicit permitted phase |
| `public/hero-clipchamp.mp4` | Identical to source video, 578,552 bytes | **Referenced and protected**: HTML shell, video metadata and slide-editor defaults use the public path | Keep; any future relocation requires a separate owner-authorized behavior review |
| `src/assets/hero-clipchamp.mp4` | Identical to public video, 578,552 bytes | **Referenced and protected**: `src/data/enriched-hero-slides.ts` imports it | Keep; same protection |
| `public/_redirects`, `public/_headers` | Historical host-specific files | Hosting effect has not been verified; public files protected | Owner/platform confirmation and permitted later-phase evidence |
| `0===` | Historical 12-byte shell artifact | Phase 1 only; not removed in baseline phase | Phase 1 filename/stem search and authorized hygiene task |
| Existing `docs/`, `documents/`, `scripts/` content | Some historical reports/tooling look stale | Scripts were conservatively included as graph roots; documentation deletion is not approved | Phase-specific inventory/reference evidence; Phase 7 has its own approval stop |
| `drizzle/`, `supabase/migrations/`, `supabase/functions/` | Historical overlap/architecture candidates | Live application/deployment history is outside the offline baseline | Keep migrations; use only the later-phase proposal/review workflow |

Both videos have SHA-256 `301202f99b679fd670e6cc1eb8fdee15a701d1b13e8ce3badf409e7e110affdb`. Duplicate bytes do not establish duplicate runtime roles.

## Dependency candidates

The [23 runtime candidates](raw/unused-dependencies-candidates.json) and [four dev candidates](raw/unused-devDependencies-candidates.json) remain declared at their current versions. Types, unreachable components, workflow invocations and non-JavaScript config can invalidate a graph-only conclusion.

| Path / package | Why it looks unused | Why it was not deleted | What would settle it |
| --- | --- | --- | --- |
| `@react-pdf/renderer`, `qrcode`, `@types/qrcode`, `react-spring`, `@types/dompurify` | Current graph dependency candidates | Complete rule 10 evidence absent; typing and currently unreachable components require review | Phase 2a package-specific import/string/config checks, removal gates and owner approval |
| `@lhci/cli` | Graph dev candidate | Can be invoked by tooling rather than a source import | Workflow/script audit and same approval gates |
| `@tailwindcss/typography` | Graph dev candidate; current Tailwind plugins contain only `tailwindcssAnimate` | `prose` classes alone do not prove the package is safely removable; protected design cannot change | Complete package/config review and same approval gates; do not add the plugin here |
| `drizzle-orm`, `postgres` | Graph dev candidates | Tied to the separate Drizzle/database decision | Leave declared pending that decision |
| `@types/node`, `@types/react-dom` | Historical candidates, **not** flagged by this scan | Type-checker usage; imports alone are insufficient | Keep unless a later typing review proves otherwise |

This is a hold list, not the Phase 2a proposed DELETE list.
