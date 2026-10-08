# Project image upload automatic resizing

This maintenance patch fixes the old-project gallery rejection `home-design-full (9).jpg: Image is too small (480×640px). Minimum width: 800px.` It does not advance another admin redesign phase.

## Result

- Gallery photos are processed before dimension validation. The reported 480×640 photo becomes **800×1067**, preserving the entire portrait. Gallery output meets the existing minimum of 800×600.
- Already qualifying gallery files with a longest edge of at most 2400 pixels are uploaded byte-for-byte unchanged. Larger photos are reduced proportionally; a 3000×4000 portrait becomes 1800×2400.
- Cover uploads honor both the requested crop ratio and minimum dimensions. A portrait selected for the 16:9 cover becomes 1200×675 through a centered crop and proportional resizing.
- High-quality browser interpolation is used. Enlarging a source cannot restore detail absent from the original. Extreme aspect ratios receive centered padding to satisfy minimum dimensions while keeping the output longest edge within 2400 pixels.
- Resized PNG/WebP gallery photos retain transparency. Encoded MIME type and filename extension agree, including a browser fallback to PNG.
- The processed file is validated before upload. Processing failures or corrupt images produce an error, and batch uploads continue with the remaining files. Original source limits remain 10MB for gallery uploads and 15MB for the shared field; processed limits remain 10MB and 8MB respectively. Resized animated files become static canvas images; qualifying gallery files keep their original bytes.

No application dependency, backend endpoint, database schema, storage permission, or public page was changed. Existing project images remain in place. Upload and project-save behavior use the existing storage and editor integration.

## Verification

| Check | Result |
| --- | --- |
| Full Vitest | 582 tests in 88 files passed; 21 new regression tests |
| Focused upload/normalizer tests | 24 tests in 3 files passed |
| Full app TypeScript | Passed |
| Selected strict TypeScript | Passed |
| Production build | Passed |
| Service worker validation | Passed |
| Route audit | Passed |
| Changed application/test files lint | 0 errors, 0 warnings |
| Repository lint | 211 existing errors / 29 warnings, within 288 / 34 ceiling |
| Diff whitespace | Passed |
| Real-image browser uploads | 12 passed across Chromium at 1440px and 390px |
| Public comparison | 12 of 12 captures passed; 6 routes; no unexpected changes or declarations |
| Public bundle gate | Passed for 6 routes and 81 loaded chunks |

Browser fixtures exercise an existing published project's editor with mocked authentication, project records, and storage. The harness inspects actual uploaded image bytes and verifies output dimensions, complete gallery content, transparency, unchanged qualifying bytes, and retention of the existing gallery image. It prevents external requests and verifies that no project save or deletion occurs.

The six public routes compared against pristine `origin/main` at `840dcf5` are `/`, `/contact`, `/company/technology`, `/capabilities`, `/projects/65-westmount-avenue`, and `/services/caulking-sealants-toronto`, each at 1440px and 390px. All passed the repository comparator with no structural/metadata differences. The project screenshots had negligible raster variation (under 0.003%); the other screenshots had zero pixel difference. This is a focused fixture comparison, not a full 86-route production replay. No page errors or horizontal overflow were observed.

Coverage is Chromium and offline fixtures. Live authentication/storage authorization, Safari, and Firefox were not exercised. Existing build chunk warnings and test React/jsdom diagnostics remain; all listed checks completed successfully.

## Evidence and reproduction

- [Desktop editor after uploads](image-upload-autofix-evidence/images-1440.png)
- [Mobile editor after uploads](image-upload-autofix-evidence/images-390.png)
- [Actual uploaded file measurements](image-upload-autofix-evidence/browser-results.json)
- [Public comparison results](image-upload-autofix-evidence/public-comparison.json)
- [Public bundle results](image-upload-autofix-evidence/public-bundle.json)

Run the standard repository test/build checks. For the real-image browser checks, serve the production build locally with Vite preview, provide an isolated Playwright installation and Chromium executable, and run:

```sh
PLAYWRIGHT_MODULE=/path/to/isolated/node_modules/playwright \
IMAGE_UPLOAD_PREVIEW=http://127.0.0.1:4187 \
IMAGE_UPLOAD_EVIDENCE=/tmp/image-upload-evidence \
node scripts/admin-image-upload-browser.cjs
```

The harness defaults to `/usr/bin/chromium`, refuses a non-loopback preview URL, and intercepts all backend/external requests. It creates synthetic image fixtures rather than using the user's private photo.

## Release and rollback

Review and merge this patch, then use **Lovable Publish → Update**. Merging alone does not update the live site. After publishing, check in a private window and upload the 480×640 photo to the intended old project's gallery; confirm the automatic-size notice and preview before saving normally.

No migration or function deployment is required. Rollback is a revert of this patch followed by Publish → Update. No live project, image, or storage object was written during implementation or verification.
