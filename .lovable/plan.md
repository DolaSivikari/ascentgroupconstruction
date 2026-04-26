# Why "Up to date" but no changes are visible

I verified directly against your live URLs:

| URL | Deployment ID being served |
|---|---|
| `www.ascentgroupconstruction.com` | `66b99407-b1c0-4dd0-ab43-c8b9e417c2c0` |
| `ascentgroupconstruction.lovable.app` | `66b99407-b1c0-4dd0-ab43-c8b9e417c2c0` |

Both URLs are serving the **same old deployment ID** from before our recent frontend work. The custom domain is *not* the problem — it correctly mirrors what Lovable is publishing. The issue is that the new frontend code (the rebuilt RFP success screen, `EmailUnsubscribe.tsx`, the admin inbox `?highlight=` logic, and the new route registration) was never built into a new deployment.

"Up to date" in the publish dialog means "the last published deployment matches the last known build state" — but a build only kicks off when something forces it. Since our recent edits were saved to source but no new build was produced, the dialog shows green while serving stale code.

# Plan

## 1. Force a fresh build by making a trivial code touch
A no-op change to a tracked file (e.g., bump a version constant or a comment) will mark the project as having unpublished changes, which flips the publish dialog from "Up to date" to **"Update"**. I'll touch `src/utils/cacheBuster.ts` since it already holds a build-version constant — bumping it has the side benefit of busting any client-side caches at the same time.

## 2. Verify the new build deploys
After you click **Update** in the publish dialog, I'll re-run the `curl` check against both URLs and confirm the `x-deployment-id` header changes to a new value. That proves the new bundle is live.

## 3. Confirm the new code is reachable
I'll spot-check the deployed bundle for fingerprints of the new work:
- `/email-unsubscribe` route resolves (not a 404)
- `/submit-rfp` shows the new reference-ID success screen (after a test submission)
- Admin inbox accepts `?highlight=<id>` and rings the matching row

## 4. If a touch + Update still doesn't produce a new deployment ID
That would indicate a build failure on Lovable's side that's silently keeping the old deployment pinned. In that case I'll:
- Check the build by reading runtime errors and recent edits for any TypeScript/import errors that would block compilation (likely culprits are the new `EmailUnsubscribe.tsx` route or the `@ts-nocheck` edge-function templates leaking into the client bundle)
- Fix any blocker and retry

# What you'll need to do
Just one click: after I make the version-bump touch, open the publish dialog and click **Update** (the button will switch from "Up to date" to "Update"). Everything else I'll verify automatically.