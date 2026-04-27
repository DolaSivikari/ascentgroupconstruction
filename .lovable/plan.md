## Root cause

The mobile menu search box always returns zero results because of a data-shape bug in `src/hooks/useNavigationSearch.ts`.

`megaMenuDataEnhanced` is shaped as:

```ts
{
  services: { width, columns, sections: [...] },
  markets:  { width, columns, sections: [...] },
  company:  { ... },
  tradePartners: { ... },
}
```

Each value is a **`MegaMenuConfig` object**, not an array of sections.

But `getAllNavigationItems()` does:

```ts
Object.entries(megaMenuDataEnhanced).forEach(([sectionKey, sections]) => {
  if (!sections || !Array.isArray(sections)) return; // ← always bails
  sections.forEach((section) => { ... });
});
```

Because `sections` is an object (`{ width, columns, sections }`), `Array.isArray(sections)` is `false`, so every iteration returns early. `allNavigationItems` ends up as `[]`, and `filteredResults` is therefore always empty — so `MobileSearchResults` shows the "No results found" empty state for any query.

This only affects the mobile nav search (the only consumer of `useNavigationSearch`); the admin global search uses a different component and is unaffected.

## Fix

Update `getAllNavigationItems()` in `src/hooks/useNavigationSearch.ts` to read from `config.sections` instead of treating the value itself as an array:

```ts
Object.entries(megaMenuDataEnhanced).forEach(([, config]) => {
  const sections = config?.sections;
  if (!Array.isArray(sections)) return;

  sections.forEach((section) => {
    section.categories?.forEach((category) => {
      category.subItems?.forEach((item) => {
        items.push({
          name: item.name,
          link: item.link,
          category: category.title,
          section: section.sectionTitle,
          badge: (item as any).badge,
        });
      });
    });
  });
});
```

No other files need to change. After the fix, typing in the mobile nav search field (e.g. "envelope", "parking", "restoration", "markets") will surface the matching items, grouped by section, in `MobileSearchResults`.

## Verification

- TypeScript: confirm `tsc --noEmit` stays clean.
- Manual: open mobile menu → tap search → type "envelope" → expect Services results; type "industrial" → expect Markets results.