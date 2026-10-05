# Company Settings System Documentation

## Overview

The company settings system provides a **single source of truth** for all company contact information, business details, and content throughout the application. All data is stored in the database and accessed through centralized hooks.

## 🎯 Core Principle

**NEVER hardcode contact information in components.** Always use the database hooks.

## Architecture

### Database Tables

#### 1. `site_settings` (Primary Source)
The main table for company-wide settings.

**Fields:**
- `company_name` - Official company name
- `phone` - Primary phone number
- `email` - Primary email address
- `address` - Physical address
- `business_hours` - Operating hours (JSON object)
- `social_links` - Social media URLs (JSON object)
- `certifications` - Array of certifications
- `meta_title`, `meta_description` - SEO defaults

**Usage:** Global contact information, company details

#### 2. `about_page_settings`
Content specific to the About, Values, Safety, and Sustainability pages.

**Fields:**
- `years_in_business`, `total_projects`, `satisfaction_rate` - Stats
- `values` - Array of company values
- `sustainability_commitment`, `sustainability_initiatives` - Sustainability content
- `safety_commitment`, `safety_programs`, `safety_stats` - Safety content
- `story_content`, `story_headline` - Company story

**Usage:** About page, Values page, Safety page

#### 3. `footer_settings`
Footer-specific content and links.

**Fields:**
- `quick_links`, `sectors_links` - Navigation arrays
- `contact_info` - Contact details (should mirror site_settings)
- `social_media` - Social links
- `trust_bar_items` - Trust badges

#### 4. `contact_page_settings`
Contact page specific content.

**Fields:**
- `main_phone`, `toll_free_phone` - Phone numbers
- `general_email`, `projects_email`, `careers_email` - Email addresses
- `office_address` - Address
- `weekday_hours`, `saturday_hours`, `sunday_hours` - Business hours
- `map_embed_url` - Google Maps embed

## Hooks

### `useCompanySettings()`
Primary hook for accessing company-wide settings from `site_settings` table.

```typescript
import { useCompanySettings } from '@/hooks/useCompanySettings';

const MyComponent = () => {
  const { settings, loading, error } = useCompanySettings();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{settings.companyName}</h1>
      <p>Phone: {settings.phone}</p>
      <p>Email: {settings.email}</p>
      <p>Address: {settings.address}</p>
      <p>Hours: {settings.businessHours.weekday}</p>
      <a href={settings.socialLinks.linkedin}>LinkedIn</a>
    </div>
  );
};
```

**Returns:**
```typescript
interface CompanySettings {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  certifications: string[];
  metaTitle: string;
  metaDescription: string;
}
```

### `useSettingsData(tableName, selectQuery)`
Generic hook for accessing any settings table.

```typescript
import { useSettingsData } from '@/hooks/useSettingsData';

const AboutPage = () => {
  const { data, loading, error, refetch } = useSettingsData('about_page_settings');
  
  const values = (data?.values as any[]) || [];
  const sustainabilityData = data?.sustainability_commitment;
  
  return (
    <div>
      {values.map(value => (
        <Card key={value.title}>
          <h3>{value.title}</h3>
          <p>{value.description}</p>
        </Card>
      ))}
    </div>
  );
};
```

## Admin Management

### Updating Company Settings

1. **Navigate to Admin Panel** → Settings
2. Available settings pages:
   - Site Settings (`/admin/site-settings`)
   - Footer Settings (`/admin/footer-settings`)
   - Contact Page Settings (`/admin/contact-page-settings`)
   - About Page Settings (`/admin/about-page`)

### Settings Health Check

Monitor the consistency of your settings:

**URL:** `/admin/settings-health`

**Features:**
- Scans all components for hardcoded values
- Validates database settings completeness
- Checks component integration status
- Identifies legacy data source usage
- Real-time health monitoring

## Development Guidelines

### ✅ DO

```typescript
// ✅ Use the hook
import { useCompanySettings } from '@/hooks/useCompanySettings';

const ContactButton = () => {
  const { settings } = useCompanySettings();
  return <a href={`tel:${settings.phone}`}>{settings.phone}</a>;
};
```

```typescript
// ✅ Format phone numbers dynamically
const displayPhone = settings?.phone 
  ? settings.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  : '';
```

```typescript
// ✅ Use semantic tokens in design system
// index.css
--company-phone: var(--from-database);
```

### ❌ DON'T

```typescript
// ❌ Never hardcode contact info
const ContactButton = () => {
  return <a href="tel:6475286804">Call Us</a>;
};
```

```typescript
// ❌ Don't use old JSON files
import companyInfo from '@/data/company-info.json';
```

```typescript
// ❌ Don't hardcode in PDFs
<Text>Tel: (416) 555-0100</Text>
```

## Development Mode Validation

The system includes automatic validation in development mode that warns when hardcoded values are detected.

### How It Works

```typescript
import { useContactValidation } from '@/utils/devContactValidation';

const MyComponent = () => {
  const { settings } = useCompanySettings();
  
  // Automatically validates in dev mode
  useContactValidation('MyComponent', [settings]);
  
  // Your component code...
};
```

### What It Detects

- Hardcoded phone numbers (any pattern like 416-555, (416) 555, etc.)
- Hardcoded email addresses
- Hardcoded physical addresses
- Company name typos ("Ascen" instead of "Ascent")

### Console Output

When hardcoded values are detected:

```
⚠️ Contact Validation: 2 hardcoded value(s) detected

1. PHONE - Component: MyComponent
   Pattern: /416[-\s]?555/gi
   Suggestion: Use useCompanySettings() hook to get phone from database

2. EMAIL - Component: MyComponent
   Pattern: /info@ascengroup\.ca/gi
   Suggestion: Use useCompanySettings() hook to get email from database
```

## Testing

### Manual Testing

1. Update company phone in admin: `/admin/site-settings`
2. Check these pages to verify update:
   - Homepage (FloatingContact button)
   - Contact page
   - Footer
   - Any PDFs (estimates, invoices)

### Health Check

Run the settings health check: `/admin/settings-health`

Expected results:
- ✅ All checks passing
- ✅ No hardcoded values detected
- ✅ Database connection successful
- ✅ All required fields populated

## Troubleshooting

### Problem: Settings not updating on public site

**Solution:**
1. Check `/admin/site-settings` - is the data saved?
2. Clear browser cache
3. Check if component is using `useCompanySettings()`
4. Run health check: `/admin/settings-health`

### Problem: Conflicting data in different locations

**Solution:**
1. Run health check to identify conflicts
2. Update all settings tables to match `site_settings`
3. Ensure components use database hooks, not JSON files

### Problem: Development validation warnings

**Solution:**
1. Find the hardcoded value in the component
2. Replace with `useCompanySettings()` hook
3. Re-check - warning should disappear

## Migration History

### Phase 1: Database Consolidation ✅
- Established `site_settings` as single source of truth
- Updated database with consistent contact information
- Fixed typos and inconsistencies

### Phase 2: Component Refactoring ✅
- Created `useCompanySettings` hook
- Updated all components to use database hooks
- Removed hardcoded values from 10+ components

### Phase 3: Legacy Cleanup ✅
- Deprecated `company-info.json` and `company-credentials.json`
- Updated About.tsx, Safety.tsx, Values.tsx to use database
- Added deprecation notice

### Phase 4: Monitoring & Prevention ✅
- Built Settings Health Check dashboard
- Added development mode validation
- Created comprehensive documentation

## Best Practices

1. **Always Check Health Dashboard** - Before and after making changes
2. **Use Type Safety** - TypeScript interfaces ensure correct usage
3. **Test Across Pages** - Changes affect multiple pages
4. **Document Changes** - Update this doc when adding new settings fields
5. **Monitor in Dev Mode** - Pay attention to validation warnings

## Adding New Settings Fields

1. **Update Database Table**
   ```sql
   ALTER TABLE site_settings ADD COLUMN new_field TEXT;
   ```

2. **Update Hook Interface**
   ```typescript
   // src/hooks/useCompanySettings.ts
   export interface CompanySettings {
     // ... existing fields
     newField: string;
   }
   ```

3. **Update Hook Logic**
   ```typescript
   setSettings({
     // ... existing mappings
     newField: data.new_field || 'default',
   });
   ```

4. **Update Admin Form**
   - Add input field in `/admin/site-settings`
   - Add validation if needed

5. **Test**
   - Run health check
   - Verify data saves correctly
   - Confirm component usage

## Support

For questions or issues:
- Check `/admin/settings-health` for diagnostics
- Review console warnings in development mode
- Refer to this documentation
- Check `src/data/.deprecated-notice.md` for migration info

---

Last Updated: 2025-11-04
