

# Merge "How We Work" Process Strip with Old 3-Column Layout

## Concept

Combine the current 4-step process row (Assess → Scope → Execute → Close Out) with the old 3-column cards (Our Approach / Our Values / Our Promise) into one cohesive section. The result: a two-part section that first shows the 4-step process as a horizontal timeline, then follows with the 3-column deep-dive cards underneath.

## Layout

```text
┌─────────────────────────────────────────────────────────┐
│  Section Header                                         │
│  "Your Envelope, Restoration & Interior Trades Partner" │
│  Subtitle text                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │  01  │  │  02  │  │  03  │  │  04  │               │
│  │Assess│  │Scope │  │Execute│ │Close │               │
│  └──────┘  └──────┘  └──────┘  └──────┘               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐      │
│  │Our Approach  │ │ Our Values   │ │Our Promise  │      │
│  │ border-t     │ │ bg-primary   │ │ border-t    │      │
│  │ primary      │ │ dark card    │ │ accent      │      │
│  │ checklist    │ │ icon+desc    │ │ icon+desc   │      │
│  └─────────────┘ └──────────────┘ └─────────────┘      │
│                                                         │
│           "See our full process →"                      │
└─────────────────────────────────────────────────────────┘
```

## Changes — `src/components/homepage/HomepageProcessStrip.tsx`

1. **Header**: Use the old section header style — left-aligned, with the specialty contractor title and subtitle (matches site pattern).

2. **Process steps row**: Keep the current 4-step grid (`grid-cols-2 md:grid-cols-4`) with numbered icons, but positioned as the first visual block.

3. **3-column cards below**: Add the three cards from the old layout:
   - **Our Approach** — white card, `border-t-4 border-t-primary`, checklist with CheckCircle icons
   - **Our Values** — dark card, `bg-primary text-primary-foreground`, icon badges with descriptions
   - **Our Promise** — white card, `border-t-4 border-t-accent`, Target icons with descriptions

4. **Footer link**: Keep "See our full process" link at the bottom.

5. **Animations**: Retain existing `useScrollFadeIn` and `useStaggerAnimation` hooks, apply to both the process row and the cards grid.

## Section styling
- `bg-gradient-to-b from-muted/40 to-background` (from old layout, more refined than current `bg-muted/20`)
- `max-w-7xl` container (matches site standard)
- Standard section padding `py-20 md:py-28 lg:py-32`

## File modified
- `src/components/homepage/HomepageProcessStrip.tsx` — full rewrite merging both layouts

