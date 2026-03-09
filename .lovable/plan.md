

# Clean Up Placeholder Phone Numbers in Form Inputs

## What the reviewer found vs reality

| Concern | Reality |
|---------|---------|
| "(416) 555-1234" visible | Only in `placeholder` attributes on form inputs — never rendered as actual contact info |
| "hebun.isik.ca@gmail.com" | Not in codebase at all |
| Services = About duplication | Pages are structurally different (Services has pillars grid, capabilities, client segments; About has founder story, process steps, values) |
| Copyright 2024 vs 2025 | Footer uses `new Date().getFullYear()` — always current year; no hardcoded dates found |

## What to fix

The only real issue: placeholder text on form inputs uses obviously fake "555" numbers. While these are just hint text, they look unprofessional if someone inspects the forms. Replace with realistic GTA-format examples.

### Files and changes

**1. `src/components/admin/settings/GeneralSettingsTab.tsx`**
- `placeholder="(555) 123-4567"` → `placeholder="(647) 528-6804"`

**2. `src/components/admin/settings/FooterSettingsTab.tsx`**
- `placeholder="(555) 123-4567"` → `placeholder="(647) 528-6804"`

**3. `src/components/admin/settings/ContactPageSettingsTab.tsx`**
- Main phone `placeholder="(555) 123-4567"` → `placeholder="(647) 528-6804"`
- Toll-free `placeholder="1-800-123-4567"` → `placeholder="1-800-555-0199"`

**4. `src/pages/resources/ContractorPortal.tsx`**
- `placeholder="(416) 555-0123"` → `placeholder="(416) 555-0100"` (RFC 5737-style, acceptable for user input hints)

**5. `src/components/estimator/EstimatorStep5.tsx`**
- `placeholder="(905) 555-0100"` — keep as-is (standard example format for user input)

Total: 4 files, 5 one-line placeholder string changes. No logic, no layout, no functional changes.

