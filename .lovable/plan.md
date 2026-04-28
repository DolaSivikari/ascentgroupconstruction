## Add Procore Construction Network Badge

Add Ascent Group's official Procore Construction Network listing as a verifiable network membership, linked back to the Procore profile (good for SEO via the dofollow backlink and for B2B credibility with GCs already using Procore).

### Where it goes

Add **Procore Construction Network** as a new entry in the existing `TrustedPartners` component under the **"Affiliations & Community"** category. That component already powers the partners roster on the **Contact** page, so the badge will appear there alongside MÜSİAD Canada and Studios Holdings — consistent placement, no new section needed.

### Changes

1. **Save the badge asset locally** (don't hot-link to procore.com):
   - Download `https://network.procore.com/assets/static/procore-white-badge.svg`
   - Save to `src/assets/partners/procore-network.svg`
   - Why local: faster, avoids third-party CDN failures, allows the existing grayscale→color hover treatment to apply consistently.

2. **Update `src/components/partners/TrustedPartners.tsx`**:
   - Import the new SVG.
   - Add one entry to the `partners` array:
     ```ts
     { name: "Procore Construction Network", url: "https://network.procore.com/p/ascent-group-construction-toronto", category: "affiliations", logo: procoreNetwork }
     ```
   - The existing `<a>` wrapper uses `rel="noopener noreferrer"`. To preserve the SEO value of Procore's dofollow guidance, change the rel for this card to `rel="noopener external"` (drops `noreferrer`/`nofollow` while keeping security). Implementation: allow an optional `rel` override on the `Partner` type and apply it in `PartnerCard`.

3. **No layout / copy changes** elsewhere. The badge inherits the same card styling (aspect 4/3, grayscale hover-to-color, label underneath) so it doesn't visually clash with the white Procore mark.

### Notes

- The Procore badge SVG is white-on-transparent. Inside our card it sits on a light `from-muted/30 to-muted/10` background, so the white mark may be invisible. I'll verify after download — if it's unreadable I'll either (a) request the dark-variant badge URL from Procore or (b) wrap it in a subtle dark tile so it reads correctly. I'll flag this back if a swap is needed.
- No homepage / footer placement — keeping the partners roster as the single source of truth per the existing Trusted Partners memory.
