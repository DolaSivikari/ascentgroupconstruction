# Homepage hero scroll-out: handoff for Codex

**The feature.** As visitors scroll, the hero video shrinks into a rounded, framed panel and a "Built to be documented" statement fades in over it. Your hero itself stays exactly as it is today: slides, timing, dots, counter, stat, black overlay and video.

**Why Codex's first attempt failed.** Two things in the site's code stop this effect from working the obvious way:
1. **Sticky positioning is switched off site-wide.** `src/index.css` sets `overflow-x: hidden` on `html`, `body` and `#root`, which disables `position: sticky` everywhere.
2. **Fixed positioning breaks after page changes.** After any in-site navigation, the page-transition animation leaves a transform on the page wrapper. That makes `position: fixed` behave like normal scrolling.

The code here works around both. It was tested on a page that reproduces both conditions, and the hero pinned exactly at the top of the window in every case.

## What's inside
| Path | What it is |
|---|---|
| `CODEX-PROMPT-HERO-SCROLL.md` | **Part A:** the prompt to paste into Codex. **Part B (optional):** a one-line navigation-bar fix |
| `code/src/components/homepage/HeroScrollFrame.tsx` | The new wrapper that pins the hero and runs the effect |
| `code/src/components/homepage/heroScrollPin.ts` | The scroll maths, kept separate so it can be tested |
| `code/src/components/homepage/hero-scroll-frame.css` | The look: frame, shade and statement styles |
| `code/src/components/homepage/HeroScrollFrame.test.tsx` | Tests Codex must run |
| `code/src/content/pages/home-commitment.ts` | The statement text, editable in admin like the rest of the homepage |
| `changes-to-existing-files.diff` | The only edits to existing files. There are 4 changed lines: two marker attributes, plus wrapping the hero in `Index.tsx` |
| `code/src/components/homepage/EnhancedHero.tsx`, `AnimatedScrollIndicator.tsx`, `code/src/pages/Index.tsx` | The same three files with those edits applied, for comparison only |
| `screenshots/` | The effect at 0%, 30%, 70% and 100% of the scroll |
| `test-page/index.html` | A standalone page that copies the site's conditions and runs the same code. Open it from your copy of the repo |

## Behaviour
- **Desktop and laptop** (at least 1024 px wide and 640 px tall): the hero pins while you scroll half a screen.
  - **First:** the video shrinks into the frame and the slide text fades.
  - **Then:** the statement fades in.
  - **After that:** the page continues normally.
- **Phones, tablets, and visitors who turn off motion:** no pinning. The statement shows as a dark band right under the hero.
- **Google and screen readers:** the page keeps exactly one main heading (the slide headline). The statement is a real sub-heading.
- **Keyboard users:** if they tab back to a hero button after scrolling, the page scrolls back so the button is visible.

## How to send it
1. Upload this whole folder to GitHub at `_assessment/page-redesigns/homepage-hero-scroll/` (**Add file → Upload files**, commit to `main`).
2. Paste **Part A** from `CODEX-PROMPT-HERO-SCROLL.md` into Codex.
3. When the pull request is ready, check items a–f in the prompt's manual list on the Lovable preview before merging.
4. **Optional:** if your navigation bar disappears when you scroll after clicking between pages, send **Part B** as a separate task.
