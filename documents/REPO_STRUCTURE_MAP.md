# Ascent Group Construction — Full Repository Structure Map

> Generated: 2026-03-01
> Branch: `claude/repo-structure-map-To5et`

---

## Complete File & Folder Tree

```
ascentgroupconstruction/
│
├── .env                                      # Environment variables (secrets, API keys)
├── .gitignore                                # Git ignore rules
├── .lighthouserc.js                          # Lighthouse CI configuration
├── components.json                           # shadcn/ui component registry config
├── eslint.config.js                          # ESLint configuration
├── index.html                                # Root HTML entry point
├── package.json                              # NPM dependencies and scripts
├── package-lock.json                         # Locked dependency tree
├── postcss.config.js                         # PostCSS configuration
├── tailwind.config.ts                        # Tailwind CSS configuration
├── tsconfig.json                             # TypeScript root config
├── tsconfig.app.json                         # TypeScript app config
├── tsconfig.node.json                        # TypeScript Node config
├── vite.config.ts                            # Vite build configuration
│
├── .github/
│   └── workflows/
│       ├── lighthouse-ci.yml                 # Automated Lighthouse performance CI
│       └── smoke-test.yml                    # Automated smoke test CI
│
├── .lovable/
│   └── plan.md                               # Lovable platform plan file
│
├── documents/                                # (This folder)
│   └── REPO_STRUCTURE_MAP.md                 # Full repository structure map (this file)
│
├── docs/                                     # Project documentation
│   ├── README.md                             # Docs index
│   ├── ACCESSIBILITY.md                      # Accessibility guidelines & compliance
│   ├── ADMIN_GUIDE.md                        # Admin panel user guide
│   ├── ARCHITECTURE_OVERVIEW.md             # System architecture overview
│   ├── AUDIT_IMPLEMENTATION_COMPLETE.md     # Audit implementation notes
│   ├── BRAND_GUIDELINES.md                  # Brand identity & usage rules
│   ├── BUSINESS_MODULE_GUIDE.md             # Business module documentation
│   ├── COMPANY_SETTINGS.md                  # Company settings reference
│   ├── DATABASE_ERD.md                      # Database entity relationship diagram
│   ├── DEPLOYMENT.md                        # Deployment instructions
│   ├── DESIGN_SYSTEM.md                     # Design system documentation
│   ├── DEVELOPER_ONBOARDING.md             # Developer onboarding guide
│   ├── PERFORMANCE_OPTIMIZATION_2025.md    # Performance optimization notes
│   ├── RESPONSIVE_TESTING_RESULTS.md       # Responsive testing results
│   ├── RLS_AUDIT_RESULTS.md                # Row-level security audit results
│   ├── SERVICES_MANAGEMENT.md              # Services management guide
│   └── VIDEO_OPTIMIZATION_GUIDE.md         # Video optimization guide
│
├── public/                                   # Static public assets (served at root)
│   ├── _headers                              # HTTP response headers config (Netlify/CF)
│   ├── _redirects                            # URL redirect rules (Netlify)
│   ├── apple-touch-icon.png                 # Apple touch icon
│   ├── ascent-logo.png                      # Company logo
│   ├── favicon.png                          # Browser favicon
│   ├── hero-clipchamp.mp4                   # Hero video (primary)
│   ├── hero-poster-1.webp                   # Hero video poster frame 1
│   ├── hero-poster-2.webp                   # Hero video poster frame 2
│   ├── hero-poster-3.webp                   # Hero video poster frame 3
│   ├── hero-poster-4.webp                   # Hero video poster frame 4
│   ├── hero-poster-5.webp                   # Hero video poster frame 5
│   ├── hero-poster-6.webp                   # Hero video poster frame 6
│   ├── llms.txt                             # LLM/AI crawler instructions
│   ├── placeholder.svg                      # Generic placeholder image
│   ├── robots.txt                           # Search engine crawler rules
│   ├── service-worker.js                    # PWA service worker
│   ├── sitemap.xml                          # XML sitemap for SEO
│   ├── fonts/
│   │   └── inter-400.woff2                  # Inter font (weight 400)
│   └── images/
│       ├── ascent-logo-nav-dark.png         # Navigation logo (dark mode)
│       └── ascent-logo-nav-light.png        # Navigation logo (light mode)
│
├── scripts/                                  # Developer utility scripts
│   ├── README.md                            # Scripts documentation
│   ├── audit-rls-policies.sql              # SQL: audit row-level security policies
│   ├── audit-routes.ts                     # TypeScript: audit app routes
│   ├── auto-fix-imports.js                 # Auto-fix import paths
│   ├── check-console-errors.js             # Detect console errors in build
│   ├── convert-images.js                   # Image format conversion utility
│   ├── design-audit.js                     # Design consistency audit
│   ├── design-lint.js                      # Design linting rules
│   ├── smoke-test.sh                       # Shell: end-to-end smoke test
│   ├── validate-sw.js                      # Validate service worker
│   └── verify-headers.js                   # Verify HTTP headers config
│
├── src/                                      # Main application source code
│   ├── App.tsx                              # Root React app component & router
│   ├── index.css                            # Global CSS entry point
│   ├── main.tsx                             # React DOM entry point
│   ├── vite-env.d.ts                        # Vite environment type declarations
│   │
│   ├── assets/                              # Bundled static assets
│   │   ├── ascent-icon-round.png
│   │   ├── ascent-icon.png
│   │   ├── ascent-logo-horizontal-dark-round.png
│   │   ├── ascent-logo-horizontal-dark.png
│   │   ├── ascent-logo-horizontal-light-round.png
│   │   ├── ascent-logo-horizontal-light.png
│   │   ├── ascent-logo-intro.mp4
│   │   ├── ascent-logo-vertical-dark-round.png
│   │   ├── ascent-logo-vertical-dark.png
│   │   ├── ascent-logo-vertical-light-round.png
│   │   ├── ascent-logo-vertical-light.png
│   │   ├── ascent-logo-vertical-white.png
│   │   ├── hero-building-envelope.jpg
│   │   ├── hero-clipchamp.mp4
│   │   ├── hero-construction-management.jpg
│   │   ├── hero-design-build.jpg
│   │   ├── hero-eifs-stucco.jpg
│   │   ├── hero-exterior-cladding.jpg
│   │   ├── hero-general-contracting.jpg
│   │   ├── hero-interior-buildouts.jpg
│   │   ├── hero-masonry-restoration.jpg
│   │   ├── hero-metal-cladding.jpg
│   │   ├── hero-parking-rehabilitation.jpg
│   │   ├── hero-waterproofing.jpg
│   │   └── heroes/                          # Per-page hero images
│   │       ├── hero-about-company.jpg
│   │       ├── hero-certifications.jpg
│   │       ├── hero-cladding.jpg
│   │       ├── hero-commercial.jpg
│   │       ├── hero-construction-management.jpg
│   │       ├── hero-contractor-portal.jpg
│   │       ├── hero-design-build.jpg
│   │       ├── hero-developers.jpg
│   │       ├── hero-education.jpg
│   │       ├── hero-equipment.jpg
│   │       ├── hero-facade-remediation.jpg
│   │       ├── hero-financing.jpg
│   │       ├── hero-general-contracting.jpg
│   │       ├── hero-healthcare.jpg
│   │       ├── hero-hospitality.jpg
│   │       ├── hero-industrial.jpg
│   │       ├── hero-institutional.jpg
│   │       ├── hero-markets-overview.jpg
│   │       ├── hero-multi-family.jpg
│   │       ├── hero-painting.jpg
│   │       ├── hero-parking-garage.jpg
│   │       ├── hero-protective-coatings.jpg
│   │       ├── hero-retail.jpg
│   │       ├── hero-sealant-replacement.jpg
│   │       ├── hero-service-areas.jpg
│   │       ├── hero-sustainable.jpg
│   │       ├── hero-team.jpg
│   │       ├── hero-tenant-improvements.jpg
│   │       ├── hero-tile-flooring.jpg
│   │       └── hero-warranties.jpg
│   │
│   ├── assets/partners/                     # Partner/affiliate logos
│   │   ├── durmus-group.png
│   │   ├── eagle-cladding.png
│   │   ├── eagle-contracting.png
│   │   ├── elips-yapi.png
│   │   ├── miral-cladding.png
│   │   ├── musiad-canada.png
│   │   ├── musiad-canada.svg
│   │   ├── noble-exteriors.png
│   │   ├── noble-exteriors.webp
│   │   ├── ostim.png
│   │   ├── silverstone.png
│   │   ├── skocc.jpg
│   │   ├── skocc.png
│   │   └── studios-holdings.png
│   │
│   ├── components/                          # Reusable React components
│   │   ├── BackToTop.tsx                    # Scroll-to-top button
│   │   ├── BeforeAfterSlider.tsx            # Before/after image comparison slider
│   │   ├── BlogPreview.tsx                  # Blog post preview card
│   │   ├── Breadcrumb.tsx                   # Breadcrumb navigation
│   │   ├── ContentPageHeader.tsx            # Content page header
│   │   ├── CookieBanner.tsx                 # GDPR cookie consent banner
│   │   ├── EmailLink.tsx                    # Accessible email link
│   │   ├── ErrorBoundary.tsx                # React error boundary wrapper
│   │   ├── FeaturedProjects.tsx             # Featured projects section
│   │   ├── FilterBar.tsx                    # Generic filter bar
│   │   ├── Footer.tsx                       # Site footer
│   │   ├── InteractiveLightbox.tsx          # Image lightbox
│   │   ├── Navigation.tsx                   # Main site navigation
│   │   ├── OptimizedImage.tsx               # Lazy-loaded optimized image
│   │   ├── PageHeader.tsx                   # Standard page header
│   │   ├── PaintCalculator.tsx              # Paint/coating calculator tool
│   │   ├── ProcessTimelineStep.tsx          # Process timeline step item
│   │   ├── ProjectCard.tsx                  # Project card (grid view)
│   │   ├── ProjectFeaturedCard.tsx          # Featured project card
│   │   ├── ProjectGallery.tsx               # Project image gallery
│   │   ├── ProjectSidebar.tsx               # Project detail sidebar
│   │   ├── QuoteWidget.tsx                  # Get-a-quote widget
│   │   ├── ResumeSubmissionDialog.tsx       # Resume/job application dialog
│   │   ├── SEO.tsx                          # Page-level SEO meta tags
│   │   ├── ScrollToTop.tsx                  # Scroll-to-top on route change
│   │   ├── SkipLink.tsx                     # Accessibility skip-nav link
│   │   ├── Testimonials.tsx                 # Customer testimonials section
│   │   │
│   │   ├── admin/                           # Admin panel components
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── AdminPageHeader.tsx
│   │   │   ├── AdminPageLayout.tsx
│   │   │   ├── AdminTopBar.tsx
│   │   │   ├── BulkActionsBar.tsx
│   │   │   ├── ChangesDiffDialog.tsx
│   │   │   ├── CompanyOverviewManager.tsx
│   │   │   ├── CompletionChecklist.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── ContentHealthCheck.tsx
│   │   │   ├── ExportButton.tsx
│   │   │   ├── FeaturedServicesManager.tsx
│   │   │   ├── FieldPreviewButton.tsx
│   │   │   ├── FieldPreviewDialog.tsx
│   │   │   ├── FilterPresets.tsx
│   │   │   ├── GlobalSearch.tsx
│   │   │   ├── GlobalSearchDialog.tsx
│   │   │   ├── IdleTimeoutWrapper.tsx
│   │   │   ├── ImageUploadField.tsx
│   │   │   ├── InviteUserDialog.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── MultiImageUpload.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationBellInbox.tsx
│   │   │   ├── OnboardingTour.tsx
│   │   │   ├── PasswordStrengthIndicator.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── PermissionMatrix.tsx
│   │   │   ├── PreviewModal.tsx
│   │   │   ├── ProcessStepsEditor.tsx
│   │   │   ├── ProjectEditorHeader.tsx
│   │   │   ├── ProjectImageManager.tsx
│   │   │   ├── PromotionsManager.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── RealTimeMetricsCard.tsx
│   │   │   ├── RevisionHistory.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── RoleDistributionCard.tsx
│   │   │   ├── ServiceAnalyticsDashboard.tsx
│   │   │   ├── ServiceMultiSelect.tsx
│   │   │   ├── ServicesListManager.tsx
│   │   │   ├── SessionWarningDialog.tsx
│   │   │   ├── SitemapManager.tsx
│   │   │   ├── UnifiedAdminLayout.tsx
│   │   │   ├── UnifiedSidebar.tsx
│   │   │   ├── WhyChooseUsManager.tsx
│   │   │   ├── filters/
│   │   │   │   ├── AdvancedFilterExample.tsx
│   │   │   │   ├── DateRangePicker.tsx
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── MultiSelectFilter.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   └── TagFilter.tsx
│   │   │   ├── inbox/
│   │   │   │   ├── InboxDashboard.tsx
│   │   │   │   ├── InboxDetailDialog.tsx
│   │   │   │   └── InboxTable.tsx
│   │   │   ├── project-tabs/
│   │   │   │   ├── BasicInfoTab.tsx
│   │   │   │   ├── ImagesTab.tsx
│   │   │   │   ├── MetricsTab.tsx
│   │   │   │   ├── ProjectDetailsTab.tsx
│   │   │   │   ├── SEOTab.tsx
│   │   │   │   └── ServicesTab.tsx
│   │   │   └── seo/
│   │   │       └── AIVisibilitySection.tsx
│   │   │
│   │   ├── animations/                      # Animation wrapper components
│   │   │   ├── index.ts
│   │   │   ├── PageTransition.tsx
│   │   │   ├── ParallaxSection.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   └── StaggerContainer.tsx
│   │   │
│   │   ├── blog/                            # Blog-specific components
│   │   │   ├── BlogCard.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── NewsletterSection.tsx
│   │   │   ├── ReadingProgress.tsx
│   │   │   └── ShareMenu.tsx
│   │   │
│   │   ├── contact/
│   │   │   └── PremiumContactHero.tsx
│   │   │
│   │   ├── contractor/
│   │   │   └── PremiumDocumentSuite.tsx
│   │   │
│   │   ├── estimator/                       # Multi-step estimator/quote flow
│   │   │   ├── EstimatorStep0.tsx
│   │   │   ├── EstimatorStep1.tsx
│   │   │   ├── EstimatorStep2.tsx
│   │   │   ├── EstimatorStep2Enhanced.tsx
│   │   │   ├── EstimatorStep3.tsx
│   │   │   ├── EstimatorStep4.tsx
│   │   │   ├── EstimatorStep5.tsx
│   │   │   └── QuoteRequestDialog.tsx
│   │   │
│   │   ├── footer/                          # Footer variants
│   │   │   ├── FooterNavCard.tsx
│   │   │   ├── NewsletterBackend.tsx
│   │   │   ├── ProfessionalFooter.tsx
│   │   │   ├── SimpleModernFooter.tsx
│   │   │   ├── SocialMediaButton.tsx
│   │   │   ├── TrustBadgeBar.tsx
│   │   │   └── UnifiedFooter.tsx
│   │   │
│   │   ├── forms/                           # Reusable form components
│   │   │   ├── BudgetSlider.tsx
│   │   │   ├── FileUploadZone.tsx
│   │   │   ├── MultiStepForm.tsx
│   │   │   ├── ProjectTypeSelector.tsx
│   │   │   ├── TimelineSelector.tsx
│   │   │   └── UnifiedFormField.tsx
│   │   │
│   │   ├── homeowners/
│   │   │   └── ResidentialServiceCard.tsx
│   │   │
│   │   ├── homepage/                        # Homepage-specific sections
│   │   │   ├── CertificationsBar.tsx
│   │   │   ├── ClientSegmentCard.tsx
│   │   │   ├── ClientSelector.tsx
│   │   │   ├── ClientValueProposition.tsx
│   │   │   ├── CompanyIntroduction.tsx
│   │   │   ├── CompanyOverviewHub.tsx
│   │   │   ├── CompanyResponse.tsx
│   │   │   ├── CompanyTimeline.tsx
│   │   │   ├── ContentHub.tsx
│   │   │   ├── CredentialBadge.tsx
│   │   │   ├── EnhancedHero.tsx
│   │   │   ├── GCTrustStrip.tsx
│   │   │   ├── HeroTabNavigation.tsx
│   │   │   ├── InteractiveCTA.tsx
│   │   │   ├── MarketChallenge.tsx
│   │   │   ├── PartnershipCarousel.tsx
│   │   │   ├── PrequalPackage.tsx
│   │   │   ├── ProvenTrackRecord.tsx
│   │   │   ├── QuickFactsSidebar.tsx
│   │   │   ├── TrustBadgeBar.tsx
│   │   │   ├── ValuePillars.tsx
│   │   │   ├── WhoWeServe.tsx
│   │   │   ├── WhoWeServeHomepage.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   │
│   │   ├── insights/
│   │   │   └── InsightsFeed.tsx
│   │   │
│   │   ├── landing/                         # Landing page components
│   │   │   ├── LandingPanel.tsx
│   │   │   ├── LandingWrapper.tsx
│   │   │   └── RotatingBackground.tsx
│   │   │
│   │   ├── layout/
│   │   │   └── PageLayout.tsx
│   │   │
│   │   ├── navigation/                      # Navigation & mega menu components
│   │   │   ├── AppLink.tsx
│   │   │   ├── DynamicServicesMegaMenu.tsx
│   │   │   ├── EnhancedPopularServices.tsx
│   │   │   ├── GridMegaMenuCard.tsx
│   │   │   ├── GridMegaMenuSection.tsx
│   │   │   ├── MegaMenuAccordionCategory.tsx
│   │   │   ├── MegaMenuSection.tsx
│   │   │   ├── MegaMenuWithSections.tsx
│   │   │   ├── MobileNavSheet.tsx
│   │   │   ├── MobileSearchResults.tsx
│   │   │   ├── NavCategoryCard.tsx
│   │   │   ├── RecentlyViewed.tsx
│   │   │   ├── SearchSuggestions.tsx
│   │   │   └── SmartPopularServices.tsx
│   │   │
│   │   ├── partners/
│   │   │   ├── PartnerCaseStudies.tsx
│   │   │   └── TrustedPartners.tsx
│   │   │
│   │   ├── partnerships/
│   │   │   ├── index.ts
│   │   │   ├── PartnershipDiagram.tsx
│   │   │   ├── PartnershipModelCard.tsx
│   │   │   ├── PartnershipModelDetail.tsx
│   │   │   └── PartnershipModelsSection.tsx
│   │   │
│   │   ├── projects/                        # Project listing/detail components
│   │   │   ├── FilterChips.tsx
│   │   │   ├── FilterDrawer.tsx
│   │   │   ├── PremiumProjectHero.tsx
│   │   │   ├── ProjectCaseStudy.tsx
│   │   │   └── ProjectQuickView.tsx
│   │   │
│   │   ├── rfp/                             # RFP (Request for Proposal) form steps
│   │   │   ├── RFPStep1Company.tsx
│   │   │   ├── RFPStep2Project.tsx
│   │   │   ├── RFPStep3Timeline.tsx
│   │   │   └── RFPStep4Scope.tsx
│   │   │
│   │   ├── sections/                        # Generic page section layouts
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── PageHero.tsx
│   │   │   ├── Section.tsx
│   │   │   └── UnifiedPageHero.tsx
│   │   │
│   │   ├── seo/                             # SEO content components
│   │   │   ├── DirectAnswer.tsx
│   │   │   ├── PeopleAlsoAsk.tsx
│   │   │   ├── QuickFacts.tsx
│   │   │   ├── ServiceAreaSection.tsx
│   │   │   └── VoiceFAQ.tsx
│   │   │
│   │   ├── services/                        # Service listing & detail components
│   │   │   ├── CategoryTabs.tsx
│   │   │   ├── categoryMapping.ts
│   │   │   ├── challengeMapping.ts
│   │   │   ├── FeaturedServicesGrid.tsx
│   │   │   ├── MarketSegmentHeader.tsx
│   │   │   ├── MarketSegmentedServices.tsx
│   │   │   ├── PremiumServiceHero.tsx
│   │   │   ├── RelatedServices.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceCard3D.tsx
│   │   │   ├── ServiceCardTier1.tsx
│   │   │   ├── ServiceCardTier2.tsx
│   │   │   ├── ServiceCardTier3.tsx
│   │   │   ├── ServiceCategoryCard.tsx
│   │   │   ├── ServiceCitySection.tsx
│   │   │   ├── ServiceDetailsModal.tsx
│   │   │   ├── ServicePageLayout.tsx
│   │   │   ├── ServicePageTemplate.tsx
│   │   │   ├── ServicePromotionsSection.tsx
│   │   │   ├── ServiceQuickViewModal.tsx
│   │   │   ├── ServiceStats.tsx
│   │   │   ├── ServiceTabs.tsx
│   │   │   ├── ServicesExplorer.tsx
│   │   │   ├── TieredServicesGrid.tsx
│   │   │   └── UnifiedServiceCard.tsx
│   │   │
│   │   ├── shared/                          # Shared UI components
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── BeforeAfterSlider.tsx
│   │   │   ├── CardGrid.tsx
│   │   │   ├── CertificationBadges.tsx
│   │   │   ├── PageHero.tsx
│   │   │   ├── PhoneLink.tsx
│   │   │   ├── ProjectCompletionTicker.tsx
│   │   │   ├── RippleEffect.tsx
│   │   │   ├── TestimonialRatings.tsx
│   │   │   ├── UnifiedCard.tsx
│   │   │   └── VideoBackground.tsx
│   │   │
│   │   ├── skeletons/                       # Loading skeleton screens
│   │   │   ├── HeroSkeleton.tsx
│   │   │   └── ServicesSkeleton.tsx
│   │   │
│   │   ├── timeline/
│   │   │   └── AnimatedProcessTimeline.tsx
│   │   │
│   │   ├── tools/
│   │   │   └── ServiceSelector.tsx
│   │   │
│   │   ├── ui/                              # shadcn/ui base components
│   │   │   ├── AggregateRatingDisplay.tsx
│   │   │   ├── ProgressiveImage.tsx
│   │   │   ├── ScreenReaderAnnouncement.tsx
│   │   │   ├── SectionBadge.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── modern-tag.tsx
│   │   │   ├── nav-badge.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── scroll-to-top.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   └── unified/                         # Unified/shared section components
│   │       ├── index.ts
│   │       ├── BenefitCard.tsx
│   │       ├── ClientSegmentCard.tsx
│   │       ├── FeatureCard.tsx
│   │       ├── ProcessStepCard.tsx
│   │       ├── WhoWeServeCard.tsx
│   │       └── WhoWeServeSection.tsx
│   │
│   ├── data/                                # Static data / content files
│   │   ├── blog-faq-data.ts
│   │   ├── case-study-faq-data.ts
│   │   ├── enriched-company-content.ts
│   │   ├── enriched-hero-slides.ts
│   │   ├── estimator-model.json
│   │   ├── hero-images.ts
│   │   ├── landing-panels.ts
│   │   ├── merged-services-data.ts
│   │   ├── navigation-descriptions.ts
│   │   ├── navigation-icons.ts
│   │   ├── navigation-structure-enhanced.ts
│   │   ├── partnership-models.ts
│   │   ├── service-area-cities.ts
│   │   ├── service-faqs-enriched.ts
│   │   ├── service-people-ask.ts
│   │   ├── service-quick-facts.ts
│   │   ├── specialty-contractor-comparison.ts
│   │   └── video-metadata.ts
│   │
│   ├── design-system/                       # Design system tokens & components
│   │   ├── animations.ts
│   │   ├── constants.ts
│   │   ├── image-system.ts
│   │   ├── layouts.ts
│   │   ├── tokens.ts
│   │   ├── typography.ts
│   │   └── components/
│   │       ├── Card.tsx
│   │       └── Typography.tsx
│   │
│   ├── hooks/                               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── use3DTilt.ts
│   │   ├── useABTest.ts
│   │   ├── useAdminAuth.ts
│   │   ├── useAdminRoleCheck.ts
│   │   ├── useAggregateRating.ts
│   │   ├── useAutoSave.ts
│   │   ├── useBulkSelection.ts
│   │   ├── useCarousel.ts
│   │   ├── useCompanyOverview.ts
│   │   ├── useCompanyOverviewAdmin.ts
│   │   ├── useCompanySettings.ts
│   │   ├── useCountUpOnView.ts
│   │   ├── useDocuments.ts
│   │   ├── useFeaturedServices.ts
│   │   ├── useFormCompletion.ts
│   │   ├── useHomepageData.ts
│   │   ├── useHoverTimeout.ts
│   │   ├── useIdleTimeout.ts
│   │   ├── useImageLoad.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useIsMobile.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useNavigationHistory.ts
│   │   ├── useNavigationSearch.ts
│   │   ├── usePageAnalytics.ts
│   │   ├── usePerformanceMonitoring.ts
│   │   ├── usePermissions.ts
│   │   ├── usePersonalizedRecommendations.ts
│   │   ├── usePopularSearches.ts
│   │   ├── usePopularServices.ts
│   │   ├── usePreviewMode.ts
│   │   ├── useRealtimeProjects.ts
│   │   ├── useRecentSearches.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useSEOKeywords.ts
│   │   ├── useScrollDirection.ts
│   │   ├── useScrollIndicator.ts
│   │   ├── useScrollReveal.ts
│   │   ├── useSearchAnalytics.ts
│   │   ├── useServiceAnalytics.ts
│   │   ├── useServicesAdmin.ts
│   │   ├── useSettingsData.ts
│   │   ├── useSettingsValidation.ts
│   │   ├── useSiteSettings.ts
│   │   ├── useStaggerAnimation.ts
│   │   ├── useSwipeGesture.ts
│   │   ├── useTableFilters.ts
│   │   ├── useTablePagination.ts
│   │   ├── useTableSort.ts
│   │   ├── useUnsavedChanges.ts
│   │   ├── useUrlFilters.ts
│   │   ├── useVideoPreloader.tsx
│   │   └── useWhyChooseUs.ts
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                    # Supabase client setup
│   │       └── types.ts                     # Auto-generated database types
│   │
│   ├── lib/                                 # Core utility libraries
│   │   ├── analytics.ts
│   │   ├── utils.ts
│   │   └── webVitals.ts
│   │
│   ├── pages/                               # Route-level page components
│   │   ├── About.tsx
│   │   ├── Accessibility.tsx
│   │   ├── Auth.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── Capabilities.tsx
│   │   ├── Careers.tsx
│   │   ├── CommercialClients.tsx
│   │   ├── Contact.tsx
│   │   ├── DynamicSpecialtyPage.tsx
│   │   ├── Estimate.tsx
│   │   ├── FAQ.tsx
│   │   ├── ForGeneralContractors.tsx
│   │   ├── Homeowners.tsx
│   │   ├── Index.tsx
│   │   ├── Insights.tsx
│   │   ├── LandingGateway.tsx
│   │   ├── NotFound.tsx
│   │   ├── OurProcess.tsx
│   │   ├── Prequalification.tsx
│   │   ├── Privacy.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Projects.tsx
│   │   ├── PropertyManagers.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── ServiceSelectorPage.tsx
│   │   ├── Services.tsx
│   │   ├── SubmitRFPNew.tsx
│   │   ├── Sustainability.tsx
│   │   ├── Terms.tsx
│   │   ├── Unsubscribe.tsx
│   │   ├── WhySpecialtyContractor.tsx
│   │   ├── admin/                           # Admin panel pages
│   │   │   ├── AuditDashboard.tsx
│   │   │   ├── BlogPostEditor.tsx
│   │   │   ├── BlogPosts.tsx
│   │   │   ├── ContentVersioning.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DocumentsLibrary.tsx
│   │   │   ├── EmailTemplates.tsx
│   │   │   ├── HeroSlidesManager.tsx
│   │   │   ├── HomepageBuilder.tsx
│   │   │   ├── MediaLibraryEnhanced.tsx
│   │   │   ├── Monitoring.tsx
│   │   │   ├── NavigationBuilder.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── PerformanceDashboard.tsx
│   │   │   ├── ProjectEditor.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── RedirectsManager.tsx
│   │   │   ├── SEODashboard.tsx
│   │   │   ├── SearchAnalytics.tsx
│   │   │   ├── ServiceEditor.tsx
│   │   │   ├── ServicesManager.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── StatsManager.tsx
│   │   │   ├── TestimonialsManager.tsx
│   │   │   ├── Testing.tsx
│   │   │   ├── UnifiedInbox.tsx
│   │   │   └── Users.tsx
│   │   ├── company/                         # Company sub-pages
│   │   │   ├── CertificationsInsurance.tsx
│   │   │   ├── Developers.tsx
│   │   │   └── EquipmentResources.tsx
│   │   ├── resources/                       # Resource sub-pages
│   │   │   ├── ContractorPortal.tsx
│   │   │   ├── LocationPage.tsx
│   │   │   └── ServiceAreas.tsx
│   │   └── services/                        # Service-specific sub-pages
│   │       ├── BuildingEnvelope.tsx
│   │       ├── CladdingSystems.tsx
│   │       ├── InteriorBuildouts.tsx
│   │       ├── PaintingServices.tsx
│   │       ├── ProtectiveCoatings.tsx
│   │       ├── SustainableBuilding.tsx
│   │       └── TileFlooring.tsx
│   │
│   ├── schemas/                             # Zod validation schemas
│   │   ├── rfp-validation.ts
│   │   └── settings-validation.ts
│   │
│   ├── styles/                              # Additional CSS files
│   │   ├── admin-theme.css
│   │   ├── animations.css
│   │   ├── index.css
│   │   ├── interactions.css
│   │   ├── mobile-nav.css
│   │   ├── rich-text-editor.css
│   │   ├── textures.css
│   │   ├── tokens.css
│   │   └── typography.css
│   │
│   ├── ui/                                  # Top-level primitive UI components
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Section.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   │
│   └── utils/                               # Utility/helper functions
│       ├── ab-testing.ts
│       ├── assetResolver.ts
│       ├── authCache.ts
│       ├── cacheBuster.ts
│       ├── devContactValidation.ts
│       ├── errorLogger.ts
│       ├── estimator.ts
│       ├── faq-schema.ts
│       ├── haptics.ts
│       ├── image-optimizer.ts
│       ├── imageResolver.ts
│       ├── migrateAboutPageData.ts
│       ├── migrateHomepageData.ts
│       ├── migrateNavigationData.ts
│       ├── personalization.ts
│       ├── previewToken.ts
│       ├── review-helpers.ts
│       ├── routeHelpers.ts
│       ├── sanitize.ts
│       ├── schema-injector.ts
│       ├── schemaGenerators.ts
│       ├── serviceIcons.ts
│       ├── statusHelpers.ts
│       ├── structured-data.ts
│       └── seo/
│           ├── index.ts
│           ├── ai-content.ts
│           ├── meta-generator.ts
│           └── structured-data.ts
│
├── supabase/                                # Supabase backend configuration
│   ├── config.toml                          # Supabase project config
│   ├── functions/                           # Edge (serverless) functions
│   │   ├── _shared/                         # Shared function utilities
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── analyze-performance/
│   │   │   └── index.ts
│   │   ├── check-login-attempt/
│   │   │   └── index.ts
│   │   ├── fetch-search-console-data/
│   │   │   └── index.ts
│   │   ├── generate-keywords/
│   │   │   └── index.ts
│   │   ├── generate-seo-content/
│   │   │   └── index.ts
│   │   ├── generate-sitemap/
│   │   │   └── index.ts
│   │   ├── google-oauth-callback/
│   │   │   └── index.ts
│   │   ├── google-search-console-auth/
│   │   │   └── index.ts
│   │   ├── invite-user/
│   │   │   └── index.ts
│   │   ├── process-image/
│   │   │   └── index.ts
│   │   ├── scheduled-fetch-search-console/
│   │   │   └── index.ts
│   │   ├── send-admin-notification/
│   │   │   └── index.ts
│   │   ├── send-contact-notification/
│   │   │   └── index.ts
│   │   ├── send-package-notification/
│   │   │   └── index.ts
│   │   ├── send-resume-notification/
│   │   │   └── index.ts
│   │   ├── send-review-request/
│   │   │   └── index.ts
│   │   ├── send-rfp-notification/
│   │   │   └── index.ts
│   │   └── submit-form/
│   │       └── index.ts
│   └── migrations/                          # Ordered SQL database migrations
│       ├── 20251117201340_remix_migration_from_pg_dump.sql
│       ├── 20251117204514_e3ce6104-8470-49f4-a9ca-ba193b672369.sql
│       ├── 20251117210811_3507f670-890d-4415-99a8-53019d36b08f.sql
│       ├── 20251118013455_8dbdce1f-12c0-434a-9d42-687d473b2624.sql
│       ├── 20251118171619_b80e372a-0622-4953-b04f-d08cc8c27f6e.sql
│       ├── 20251118172153_af39e260-fea1-48e3-af3a-d48f44fd0261.sql
│       ├── 20251118172339_3e265589-9ff4-41cb-96f8-a6db973deb4f.sql
│       ├── 20251118172556_1e2426e3-58e1-4427-aa8b-49a6cf43acd4.sql
│       ├── 20251118191204_31cdd36f-0eae-4891-91b7-934d2238cb08.sql
│       ├── 20251118192317_1ae277f8-e7c6-4392-aeb1-24012b94eea1.sql
│       ├── 20251119033604_80e8b4ea-50c9-4953-8851-a265ac0309b2.sql
│       ├── 20251119150657_1d222b08-e17b-4898-8427-cc736c04c7cf.sql
│       ├── 20251121151044_f150430a-4c50-4787-a87d-5c321c6c39e7.sql
│       ├── 20251207202648_f89c5f0d-09ab-475e-a3c3-745d8de6e9be.sql
│       ├── 20251207213352_64faf05c-1156-443e-b3c4-eb33b51b8470.sql
│       └── 20260119042619_129d965c-76f5-4a36-ac5e-25d7ea382370.sql
│
└── README.md                                # Project overview & quick-start guide
```

---

## Summary by Category

| Category | Count |
|---|---|
| Root config files | 14 |
| GitHub Actions workflows | 2 |
| Documentation files (`docs/`) | 17 |
| Public static assets | 18 files + 2 subdirs |
| Developer scripts | 11 |
| Source pages (`src/pages/`) | 31 main + 25 admin/sub-pages |
| React components (`src/components/`) | 200+ |
| Custom React hooks (`src/hooks/`) | 53 |
| Data files (`src/data/`) | 17 |
| Design system files | 8 |
| Utility files (`src/utils/`) | 27 |
| CSS/style files | 10 |
| Supabase edge functions | 18 |
| Supabase migrations | 16 |
| Asset images/videos | 80+ |
| Partner logos | 14 |

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Netlify (via `_headers`, `_redirects`)
- **CI/CD**: GitHub Actions (Lighthouse CI, smoke tests)
- **SEO**: Structured data, sitemap, robots.txt, LLMs.txt
- **PWA**: Service worker (`public/service-worker.js`)
