

## Plan: Increase Logo Size

Current sizes → New sizes (one step up, with increased negative margins to keep nav height unchanged):

| | Current | New |
|---|---|---|
| **Desktop** | `h-12 md:h-14 lg:h-16 -my-2 md:-my-3 lg:-my-4` | `h-14 md:h-16 lg:h-20 -my-3 md:-my-4 lg:-my-6` |
| **Mobile** | `h-11 -my-1` | `h-12 -my-2` |

Single file edit: `src/components/Navigation.tsx` (lines 190 and 391).

Nav bar heights stay exactly the same — the larger negative margins absorb the extra logo height.

