

# Add Trusted Partners Section Back to Contact Page

## What happened
The `TrustedPartners` component exists at `src/components/partners/TrustedPartners.tsx` but is no longer imported or rendered on the Contact page. It needs to be added back.

## Change

**`src/pages/Contact.tsx`**
- Import `TrustedPartners` from `@/components/partners/TrustedPartners`
- Render `<TrustedPartners variant="simple" />` between the Map section and Footer — this shows the flat grid of all partner logos (Noble Exteriors, Eagle Contracting, Eagle Cladding, Miral Cladding, Elips Yapı, OSTIM, Silverstone, Durmus Group, SKOCC, MÜSİAD Canada, Studios Holdings)

One file, two lines added.

