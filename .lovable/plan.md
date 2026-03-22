

## Review: Navigation Enhancement Plan

Overall this is a solid refinement pass. Here's my assessment of each change:

### Good changes (recommend as-is)

- **Change 1 (Reduce nav height)**: Correct direction. h-20 at lg (80px) is professional and matches enterprise construction sites. The current 112px is excessive.
- **Change 2 (Scale logo)**: Proportional reduction makes sense with the new height.
- **Change 3 (text-sm + tracking-wide)**: Good call. 14px semibold with letter spacing reads cleaner at this density.
- **Change 7 (White underline on hero)**: This is a real bug fix. White underlines on transparent hero nav is correct behavior.
- **Change 8 (Reduce horizontal padding)**: The current xl:px-20 is aggressive. xl:px-14 is a reasonable tightening.

### Changes I'd adjust

- **Change 4 (gap-1 lg:gap-2)**: Too tight. With text-sm links and px-2 padding, gap-1 will make items feel cramped on md screens. I'd recommend **gap-2 lg:gap-3** instead -- still tighter than current gap-4/gap-6 but won't risk touch targets overlapping or visual crowding.

- **Change 5 (Remove Markets)**: Directionally correct -- Markets and Services do overlap conceptually. However, before removing it entirely, we should verify the Markets content is reachable elsewhere. Currently the About mega menu (`megaMenuDataEnhanced.company`) doesn't include Markets links. We'd need to either add a "Markets" category to the Company mega menu or add a "Who We Serve" link in the Services mega menu. Without this, the /markets page and its sub-pages become orphaned from navigation. I'd recommend adding it as a section in the Company/About mega menu as part of this change.

- **Change 6 (Phone number to text-xs opacity-80)**: The hierarchy logic is right but text-xs (12px) with opacity-80 might make the phone number too hard to read, especially for the target audience (property managers, GCs). I'd keep **text-sm** but use `font-normal` instead of `font-medium`, and use `text-muted-foreground` without the opacity reduction. That creates hierarchy without sacrificing legibility.

### Summary recommendation

Implement all 8 changes with these three adjustments:
1. Change 4: use `gap-2 lg:gap-3` instead of `gap-1 lg:gap-2`
2. Change 5: also add Markets links to the Company/About mega menu data so they remain reachable
3. Change 6: use `text-sm font-normal text-muted-foreground` instead of `text-xs font-medium opacity-80`

The plan is well-structured and the testing checklist is thorough. Ready to implement when you approve.

