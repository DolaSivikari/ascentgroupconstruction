# Homepage hero scroll-out: Codex prompt (standalone)

## Before you send it
1. On GitHub choose **Add file → Upload files**. Drag in this whole `homepage-hero-scroll` folder so it lands at `_assessment/page-redesigns/homepage-hero-scroll/`, then commit to `main`. These are reference files only, so the website doesn't change.
2. Paste **Part A** (the box below) into Codex. It is one small pull request.
3. **Part B** is optional and separate: a one-line fix for the navigation bar, explained under the box. Send it as its own task after Part A is merged and checked.

---

## Part A: the hero scroll-out

```
TASK: Add the homepage hero "scroll-out" effect. As the visitor scrolls through half a screen, the
hero video shrinks into a rounded, framed panel, the slide copy fades out, and a "Built to be
documented" statement fades in over the video. The hero itself (EnhancedHero: slides, timing,
dots, counter, stat, black overlay, video) does not change.

Read AGENTS.md first and follow it. Branch: hp/hero-scroll-out. One PR to main. Do not merge,
publish or deploy. No database, migration, env, secret or dependency changes.

THE CODE IS ALREADY WRITTEN. Use it; do not redesign it.
Reference folder: _assessment/page-redesigns/homepage-hero-scroll/
1. Copy these NEW files from code/ into the repo at the same paths:
   - src/components/homepage/HeroScrollFrame.tsx
   - src/components/homepage/heroScrollPin.ts
   - src/components/homepage/hero-scroll-frame.css
   - src/components/homepage/HeroScrollFrame.test.tsx
   - src/content/pages/home-commitment.ts   (makes the statement copy editable in admin Pages;
     it is picked up automatically by the import.meta.glob in src/content/registry.ts)
2. Apply the four-line diff in changes-to-existing-files.diff to the CURRENT repo files. Do not copy
   the full EnhancedHero.tsx / AnimatedScrollIndicator.tsx / Index.tsx from code/ over the repo's
   versions; they are only there for comparison and may be older than main.
   - EnhancedHero.tsx: add data-hero-content="" to the <div className="max-w-4xl mx-auto"> that holds
     the headline, subheadline, buttons and control strip. Nothing else changes in that file.
   - AnimatedScrollIndicator.tsx: add data-hero-scroll-cue="" to its root <div>.
   - pages/Index.tsx: import HeroScrollFrame and wrap <EnhancedHero /> inside <HeroSurface>.

WHY EARLIER ATTEMPTS FAILED (do not repeat these)
- position: sticky cannot work on this site: src/index.css sets overflow-x: hidden on html, body and
  #root, which turns them into scroll containers. HeroScrollFrame therefore pins with JavaScript
  (position: fixed while pinned). Do NOT switch it to sticky and do NOT change index.css in this PR.
- After any in-app navigation, PageTransition (src/components/animations/PageTransition.tsx) keeps
  transform: translateY(0) scale(1) from its "page-enter" animation. A transformed ancestor makes
  position: fixed behave like absolute. HeroScrollFrame detects this on the first pinned frame
  (stage not at the top of the viewport) and switches to a transform-based pin
  (data-pin="transform"). Keep that fallback.
- React must not re-render on scroll. The component writes CSS variables on one
  requestAnimationFrame per scroll; keep it that way.

BEHAVIOUR (already implemented; verify it)
- Desktop and laptop only: (min-width: 1024px) and (min-height: 640px), and not
  prefers-reduced-motion. Read synchronously on first render, so desktop never flips layout.
- Phones, tablets, short windows and reduced motion: no pin; the statement renders as a static
  dark band directly below the hero.
- Pin length: 100svh + 50svh. Curves (same as the approved preview):
  frame = 1-(1-p)^2 -> clip-path inset(frame*13% frame*9% round frame*14px) + 45% black shade;
  slide copy opacity 1-clamp(p*2.6) and rises 60px; scroll cue opacity 1-clamp(p*5);
  statement opacity clamp((p-0.4)*2.5), rising 24px into place.
- Once the slide copy has faded (opacity < 0.1) it ignores pointer hits (data-faded). If keyboard
  focus enters it, the page scrolls back to the top of the hero so the focused button is visible.
  Do not make it inert: it holds the page's only h1.
- The statement is a real <h2> (the page keeps exactly one <h1>, the visible slide headline).
- Copy (owner's wording, editable in admin as module "home-commitment"):
  Our Commitment / Built to be documented / From envelope restoration to interior finishing —
  self-performed trades, accountable delivery, and documentation you can hand to your client. /
  Self-performed crews · Daily field reports · Closeout on every job

PUBLIC CHANGE DECLARATION
- Declare the intended homepage change in _assessment/baseline/intentional-changes.json (page "/":
  new pinned hero wrapper on desktop; new "Built to be documented" section, static on 390 px).
  Include the public comparison artifacts AGENTS.md requires. No other page may change.

TESTS AND CHECKS (report exact results; never call a skipped check "passed")
- The included HeroScrollFrame.test.tsx must pass (pin maths, curves, static vs pinned vs reduced
  motion, single h1).
- Full Vitest, selected and full app TypeScript, production build, service-worker validation, route
  audit, public comparison and bundle gates, lint within the repository ceiling with the new files
  clean, git diff --check.
- Manual check on the PR preview, desktop 1440x900 in Chrome, Safari and Firefox:
  a) load / directly and scroll: the hero pins, shrinks into the frame, the statement appears, then
     the page continues with "What kind of property are you planning work on?";
  b) open another page, click the logo back to Home, scroll again: it still pins (transform
     fallback);
  c) scroll back up: the hero returns exactly as before, slides still auto-advance;
  d) 390 px phone: no pin, the statement is a dark band under the hero, no horizontal scroll;
  e) prefers-reduced-motion: same as phone;
  f) After scrolling past the hero, Shift+Tab back into the hero buttons: the page scrolls back so
     the focused button is visible.
- PR description: screenshots at 1440 px for scroll progress 0, 30%, 70% and 100%, and at 390 px.
  The reference screenshots are in screenshots/ in the reference folder.
```

---

## Part B (optional, separate PR): keep the navigation bar fixed after page changes

My local test reproduced your site's styles and found something outside the hero. After the page-transition animation, the fixed navigation bar scrolls off the screen with the page instead of staying at the top, for the same reason as the hero problem above. I couldn't confirm this on your live site, because the browser here blocks your domain. If you see the nav disappear while scrolling after clicking between pages, send this:

```
TASK: Stop the page-transition animation from leaving a transform on the page wrapper.
Read AGENTS.md first. Branch: fix/page-transition-transform. One PR, no other changes.
In src/styles/animations.css, @keyframes page-enter currently ends with
  transform: translateY(0) scale(1);
Change that final keyframe value to
  transform: none;
(Visually identical. A non-"none" transform kept by animation-fill-mode: forwards makes the
wrapper the containing block for position: fixed, so the fixed Navigation scrolls with the page.)
Also apply the same "transform: none" end value to slide-in-from-right and zoom-in for consistency.
Verify on the PR preview: go to /services, click to /about, scroll down 1,000 px, scroll up: the
navigation bar stays attached to the top of the window. Run the checks AGENTS.md requires and
report results exactly.
```

After Part B, the hero scroll-out uses true fixed positioning everywhere. Its transform fallback simply never triggers.
