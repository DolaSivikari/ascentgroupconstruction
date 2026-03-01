

# Project Cleanup & Documentation Audit Plan

## Scope
Identify and remove unused files, duplicates, and outdated documentation. Ensure remaining docs reflect the current state of the website.

---

## Part 1: Unused Source Files to Delete

### Unused Components (0 imports found)
| File | Reason |
|------|--------|
| `src/components/SEOChecklist.tsx` | Never imported |
| `src/components/ServicesPreview.tsx` | Never imported |
| `src/components/HomepageContent.tsx` | Never imported |
| `src/components/LoadingProgress.tsx` | Never imported |
| `src/components/SplashScreen.tsx` | Never imported (references missing asset) |
| `src/components/ProcessTimeline.tsx` | Never imported (AnimatedProcessTimeline used instead) |
| `src/components/shared/ConfettiWrapper.tsx` | Never imported |
| `src/components/shared/TiltCard.tsx` | Never imported |
| `src/components/shared/VideoTestimonials.tsx` | Duplicate -- `advanced/VideoTestimonials.tsx` also exists; shared version imported by Projects.tsx but advanced version is orphaned |
| `src/components/advanced/InteractiveProjectMap.tsx` | Never imported by any page |
| `src/components/advanced/VideoTestimonials.tsx` | Duplicate of shared version, never imported |
| `src/components/calculators/InsuranceCalculator.tsx` | Never imported |
| `src/components/calculators/ProjectTimelineEstimator.tsx` | Never imported |

### Unused Hooks
| File | Reason |
|------|--------|
| `src/hooks/useMousePosition.ts` | Never imported |
| `src/hooks/useParallax.ts` | Never imported |
| `src/hooks/useWebGLSupport.ts` | Never imported |
| `src/hooks/useCountUp.ts` | Never imported (useCountUpOnView is used) |
| `src/hooks/useVideoPreloader.ts` | Duplicate of `.tsx` version; check which is imported |

### Unused Utils
| File | Reason |
|------|--------|
| `src/utils/navigationSync.ts` | Never imported |

### Unused Pages
| File | Reason |
|------|--------|
| `src/pages/ServiceSelector.tsx` | Never imported in App.tsx; `ServiceSelectorPage.tsx` is the actual routed page |
| `src/pages/services/Waterproofing.tsx` | Never imported or routed |

### Unused Admin Page
| File | Reason |
|------|--------|
| `src/pages/admin/DatabaseMigrations.tsx` | Never imported or routed -- one-time migration tool, no longer needed |

### Unused Data Files
| File | Reason |
|------|--------|
| `src/data/priority-services-data.ts` | Never imported |
| `src/data/.deprecated-notice.md` | Documentation artifact inside src |

### Unused Assets (images in src/assets not referenced)
| File | Reason |
|------|--------|
| `src/assets/case-heritage-building.jpg` | Never imported |
| `src/assets/project-commercial.jpg` | Never imported |
| `src/assets/project-industrial.jpg` | Never imported |
| `src/assets/project-institutional.jpg` | Never imported |
| `src/assets/team-work.jpg` | Never imported |

### Duplicate Files
| Keep | Delete | Reason |
|------|--------|--------|
| `src/components/shared/BeforeAfterSlider.tsx` | Neither -- both are used. `components/BeforeAfterSlider.tsx` is used by ProjectDetail, ProjectGallery, BlogPost | Consolidate later |

### Root-Level Stray Files
| File | Reason |
|------|--------|
| `IMAGE_OPTIMIZATION_GUIDE.md` | Should be in docs/ or deleted |
| `netlify.toml` | Project deploys via Lovable, not Netlify |
| `lighthouserc.json` | Duplicate of `.lighthouserc.js` |
| `bun.lock` | Project uses npm (package-lock.json exists) |

### Scripts to Review
| File | Action |
|------|--------|
| `scripts/complete-migration.js` | One-time migration, likely safe to delete |
| `scripts/cleanup-archived-services.ts` | One-time cleanup, likely safe to delete |
| `scripts/auto-fix-imports.js` | Utility -- keep or delete based on preference |
| `scripts/convert-images.js` | Utility -- keep or delete based on preference |

---

## Part 2: Documentation Audit

### Delete -- Outdated Phase Reports (historical, no longer actionable)
These are implementation logs from completed work. They add no ongoing value:

| File | Content |
|------|---------|
| `docs/PHASE_1_COMPLETE.md` | Phase 1 completion log |
| `docs/PHASE_2_COMPLETE.md` | Phase 2 completion log |
| `docs/PHASE_3_COMPLETE.md` | Phase 3 completion log |
| `docs/PHASE_4_COMPLETE.md` | Phase 4 completion log |
| `docs/PHASE_5_COMPLETE.md` | Phase 5 completion log |
| `docs/PHASE_6_COMPLETE.md` | Phase 6 completion log |
| `docs/PHASE_6_SUMMARY.md` | Duplicate of Phase 6 report |
| `docs/PHASE_6_FINAL_REPORT.md` | Duplicate of Phase 6 report |
| `docs/IMPLEMENTATION_PROGRESS.md` | Superseded by STATUS |
| `docs/IMPLEMENTATION_STATUS.md` | Now 100%, no longer needed |
| `docs/COMPLETE_IMPLEMENTATION_REPORT.md` | Historical |
| `docs/FULL_IMPLEMENTATION_COMPLETE.md` | Historical |
| `docs/CONSTRUCTION_BRAND_TRANSFORMATION.md` | Historical branding log |
| `docs/AGGREGATE_RATING_FIX.md` | One-time fix record |
| `docs/SEO_IMPLEMENTATION_COMPLETE.md` | Historical |
| `docs/VIDEO_SCHEMA_IMPLEMENTATION.md` | Historical |
| `docs/WEEK_1_IMPLEMENTATION_COMPLETE.md` | Historical |
| `docs/WEEK_1_IMPLEMENTATION_PLAN.md` | Historical |
| `docs/UNIFIED_COMPONENTS_GUIDE.md` | Merged into DESIGN_SYSTEM.md |
| `docs/DESIGN_SYSTEM_USAGE_GUIDE.md` | Merged into DESIGN_SYSTEM.md |
| `.lovable/plan.md` | Stale plan from previous session |

**That is 20 doc files to delete.**

### Keep & Update
| File | Action |
|------|---------|
| `docs/README.md` | Update index to reflect remaining docs only |
| `docs/ARCHITECTURE_OVERVIEW.md` | Review for accuracy |
| `docs/DEVELOPER_ONBOARDING.md` | Review for accuracy |
| `docs/DEPLOYMENT.md` | Keep |
| `docs/DATABASE_ERD.md` | Keep |
| `docs/ADMIN_GUIDE.md` | Keep |
| `docs/BUSINESS_MODULE_GUIDE.md` | Keep |
| `docs/COMPANY_SETTINGS.md` | Keep |
| `docs/DESIGN_SYSTEM.md` | Keep (consolidate usage guide into it) |
| `docs/BRAND_GUIDELINES.md` | Keep |
| `docs/PERFORMANCE_OPTIMIZATION_2025.md` | Keep |
| `docs/RLS_AUDIT_RESULTS.md` | Keep |
| `docs/RESPONSIVE_TESTING_RESULTS.md` | Keep |
| `docs/ACCESSIBILITY.md` | Keep |
| `docs/SERVICES_MANAGEMENT.md` | Keep -- update with new service names |
| `docs/VIDEO_OPTIMIZATION_GUIDE.md` | Keep |
| `docs/AUDIT_IMPLEMENTATION_COMPLETE.md` | Keep as historical summary |
| `README.md` | Update to reflect current service names and cleanup |

---

## Part 3: Implementation Steps

1. **Delete ~30 unused source files** (components, hooks, utils, pages, assets)
2. **Delete ~20 outdated doc files** and stale plan
3. **Delete root-level stray files** (netlify.toml, bun.lock, lighthouserc.json, IMAGE_OPTIMIZATION_GUIDE.md)
4. **Update `docs/README.md`** to list only remaining docs
5. **Update `docs/SERVICES_MANAGEMENT.md`** with current service names
6. **Clear `.lovable/plan.md`** content
7. **Verify build passes** after deletions

### Estimated Impact
- ~50+ files removed
- ~5 unused image assets removed (~several MB)
- Documentation reduced from 37 files to ~16 actionable docs
- Cleaner repository, faster cloning, less confusion

