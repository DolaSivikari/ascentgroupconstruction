# Website design system

Keep the current Ascent design, content, and page-specific presentation. Use the shared rules below when editing a page so ordinary cards and text do not acquire a separate theme.

## Sources of truth

| Concern | Location |
| --- | --- |
| Font files, base typography | `public/fonts/barlow-*.woff2`, `src/styles/typography.css` |
| Font family, sizes, spacing, radii, standard motion | `src/styles/tokens.css` |
| Light/dark semantic colors and card shadows | `src/index.css` |
| Layout, typography roles, card surface presets | `src/design-system/constants.ts` |
| Standard card | `src/design-system/components/Card.tsx` |
| Standard button and all button variants | `src/ui/Button.tsx` |
| Section titles and introductions | `src/design-system/components/SectionHeader.tsx` |
| Scroll reveals | `src/components/animations/ScrollReveal.tsx`, `src/styles/animations.css` |

The token and typography stylesheets are imported through `index.css` so their base rules participate in Tailwind's cascade. Do not import another global typography stylesheet or redefine the body font on a page. Font files are Barlow v13, downloaded from Google Fonts with normal TLS verification; their SIL Open Font License is retained in `public/fonts/barlow-OFL.txt`. The Latin subset includes the punctuation and accented Latin characters used by the English site.

## Typography

Barlow is the existing website typeface. It is now self-hosted so blocked third-party font requests cannot silently change the design. Both inherited text and Tailwind `font-sans` use `--font-sans`. Weights 300–800 and regular italic are included.

Use `TYPOGRAPHY_STYLES` from `src/design-system/constants.ts`:

- `sectionTitle`: 30px on mobile, 36px on desktop, bold.
- `subsectionTitle`: 24px on mobile, 30px on desktop.
- `cardTitle`: 20px, semibold, tight line height on all viewports.
- `cardBody`: 16px with relaxed line height.
- `metadata`: 14px; labels and badges may use 12px where appropriate.
- `bodyDefault` / `bodyLarge`: reading text and section introductions, rather than card copy.

Use `SectionHeader` for ordinary section titles. Hero headings, image-overlay feature treatments, statistics, and editorial quotations can retain intentional display sizing. Different heading roles should not be forced to the same size.

## Cards and panels

Use `Card`, `CardTitle`, and `CardDescription`, or the existing `CapabilityCard`, `DetailCard`, `SegmentCard`, and `ProofCard` patterns. Standard surfaces share `--card-border-radius` (8px), semantic borders/backgrounds, and the same shadow family.

`Card` offers `default`, `elevated`, `interactive`, `outline`, and `ghost` variants. Choose emphasis for a reason, not a different style for every page. Padding is 16px for compact cards, 24px by default, and 32px for deliberately spacious panels. Avoid padding both the root and its content; a standard card's content wrapper is unpadded. Full-bleed media cards can set root `p-0` and pad their text content once.

For a whole-card link or button, keep its native element and compose `CARD_STYLES.base`, `CARD_STYLES.motion`, `CARD_STYLES.hover`, and `CARD_STYLES.interactive`. This retains link/button keyboard semantics. Do not make a clickable div as a replacement for a link.

The legacy `@/components/ui/card` adapter retains its existing header/content padding contract and extra `featured`, `glass`, and `flat` variants, but shares the same visual presets. This prevents layout breakage in older forms and admin screens. `@/ui/Card` re-exports the standard card. Prefer the standard API for new code.

Pill badges and circular step indicators remain rounded. Dedicated image and hero wrappers may retain larger corners. Inverse cards on navy/photo sections keep their readable inverse colors while using the standard corner and typography roles.

## Buttons and motion

`@/components/ui/button` re-exports the canonical `Button` and `buttonVariants`; do not add another variant table. All sizes use the same control corners, focus rings, and disabled states. Preserve explicit inverse button colors on photographic heroes.

Ordinary card hover is a 4px lift with a shadow change over 300ms. Do not stack a second lift/scale on a parent link and its child card. Standard scroll reveals use 16px travel and 500ms duration with the shared ease curve. Staggered reveals use the same duration and ease as unstaggered reveals. Tailwind animation classes must be literal strings so production CSS includes them.

Reduced Motion disables these movements. The homepage intentionally shows its poster when Reduced Motion or Data Saver is enabled. Do not remove that preference check or mark a video ready before it can render. Preserve the homepage/project heroes' dedicated media and slideshow behavior.

## Checking a change

Run the production build and existing Vitest suite. Validate the built service worker when building. Compare type and lint diagnostics against the existing baseline; new failures in already-failing files still count as regressions.

Render affected routes on desktop and mobile. Check card text wrapping, keyboard focus, light/dark surfaces, navigation, and the hero with normal and reduced motion. Exercise RFP steps without submitting or uploading test data to production. Style checks do not establish successful backend writes or email delivery.

During this unification, production rendering was checked on 15 routes at 1440px and 390px: homepage, capabilities, services, markets, about, process, projects, contact, RFP, commercial clients, property managers, general contractors, developers, blog, and the login screen. Checks covered local font loading, shared card corners, and horizontal overflow. Additional browser checks covered card typography and hover, keyboard focus, dark card colors, normal/reduced-motion hero playback, mobile navigation, and RFP progression to the scope step without submitting.

The production build, service-worker validation, and all five existing Vitest tests pass. The full application type check retains its existing `BlogPostEditor` error; the selected strict type check also retains its existing errors. ESLint diagnostics match the untouched baseline (360 errors and 44 warnings). These checks do not establish authenticated admin behavior, backend writes, or email delivery.
