

## Why "rotation" looks fixed — root cause

I checked your database directly. Here's the truth:

- **7 published projects total**
- **0 marked as `featured`**

So when the code shuffles and picks 3 from a pool of 7, you'll naturally see the same projects appear often (basic statistics — with 7 items, ~43% of any 3-card sample will overlap with the previous one). It *is* rotating, but with such a small pool the variation feels invisible.

Plus on `/projects`, the spotlight grid shows projects **3–6** of the shuffled pool (positions 4, 5, 6 out of 7) — so it's effectively cycling through only 4 projects most of the time. With 7 projects total, hero takes 3, spotlight gets the remaining 4. Rotation is mathematically constrained.

## Fix — make rotation visible and fair

### 1. Visible rotation indicator (Projects page)
Add a small "Refresh selection" button next to the Featured Projects header so visitors and you can confirm rotation is working without a full page refresh. Triggers a new shuffle in place. Removes the "is it broken?" doubt.

### 2. Allow hero/spotlight overlap when pool is small
On `/projects`, when there are fewer than 6 projects, the current code falls back to showing the *same* 3 in both hero and spotlight. Change the logic: always shuffle independently. Hero gets a fresh sample of 3, spotlight gets a *different* fresh sample of 3 from the full pool — overlap is allowed but the two sets are independently shuffled, so you maximize variety per visit.

### 3. Show 3 spotlight cards even when DB has only 7
Same shuffle seed approach as homepage — `Math.random()` per mount — but draw spotlight from `pool.slice(0,3)` of an *independent* shuffle, not `slice(3,6)`. This way every visit you get genuinely random 3 in spotlight, even if 1–2 overlap with hero.

### 4. Homepage — already correct, but add tiny safeguard
`HomepageFeaturedProjects.tsx` is already doing the right thing (fresh `mountId` seed per mount, fetches all published, shuffles). No code change needed there — it works. The perceived "stuckness" was the same small-pool issue.

### 5. Strong recommendation (no code, just config)
Mark **3–4 projects as `featured = true`** in the admin. Right now zero are featured, so the "featured-first" priority logic does nothing — every project is equally weighted. Marking some as featured will make those rotate among the top of the pool consistently while still drawing variety from the rest.

## Files touched (1)

- `src/pages/Projects.tsx` — independent shuffle for spotlight, optional "refresh" button

## Out of scope

- Homepage component (already correct)
- DB changes
- Layout/visual changes

## Result

- Spotlight grid on `/projects` will draw a fresh, independent random sample on every mount — no more recycling positions 4–6 of a single shuffle.
- Optional refresh button removes the "is rotation broken?" question.
- Once you mark a few projects as featured, the priority logic activates and you get consistent quality on top + rotation underneath.

