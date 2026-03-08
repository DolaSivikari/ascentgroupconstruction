

# Fix: Add `id` and `name` to form inputs

The browser autofill warning is about the search input in `ServicesExplorer.tsx` missing `id`/`name` attributes. I'll also add them to the other search inputs across the project for consistency.

## Changes

**`src/components/services/ServicesExplorer.tsx`** — Add `id="services-search"` and `name="services-search"` to the search `<Input>`.

**`src/components/services/SearchBar.tsx`** — Add `id="services-searchbar"` and `name="services-searchbar"`.

**`src/components/admin/filters/SearchInput.tsx`** — Add `id` and `name` props passed through or defaulted to `"search-input"`.

