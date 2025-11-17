# Developer Onboarding Guide

> Complete guide for setting up and contributing to the AscentGroup Construction platform

---

## Welcome! 👋

This guide will get you from zero to productive contributor in about 30 minutes. The AscentGroup platform is a full-stack React + Supabase application with an enterprise-grade admin panel and business management suite.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Project Architecture](#project-architecture)
4. [Development Workflow](#development-workflow)
5. [Code Standards](#code-standards)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Getting Help](#getting-help)

---

## Prerequisites

### Required Software

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor:** VS Code recommended ([Download](https://code.visualstudio.com/))

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "supabase.supabase-vscode",
    "VisualStudioExptTeam.vscodeintellicode"
  ]
}
```

### Required Accounts

- GitHub account (for repository access)
- Supabase account (for database access) - *Provided by team lead*

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ascentgroup-website.git
cd ascentgroup-website
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 18.3+ with React Router
- Supabase client
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching
- Form libraries (React Hook Form + Zod)
- And 40+ other production dependencies

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

**Request these values from your team lead:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xdowuirheazerlwatwja.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=xdowuirheazerlwatwja

# Optional: For local development
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**You should see:** The AscentGroup landing page with video background.

### 5. Verify Database Connection

Navigate to [http://localhost:5173/admin](http://localhost:5173/admin)

**Test Login Credentials (Development Only):**
- Email: `admin@ascentgroup.com`
- Password: `AscentAdmin2025!`

✅ **Success:** You should see the admin dashboard with metrics.

---

## Project Architecture

### High-Level Structure

```
ascentgroup-website/
├── src/
│   ├── pages/              # Route components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Home.tsx        # Main home page
│   │   ├── About.tsx       # About page
│   │   ├── Services.tsx    # Services listing
│   │   ├── admin/          # Admin panel pages
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── admin/          # Admin-specific components
│   │   ├── business/       # Business management components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   ├── integrations/       # Supabase client and types
│   ├── data/               # Static data (mostly deprecated)
│   └── styles/             # Global styles
├── supabase/
│   ├── functions/          # Edge Functions (serverless)
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── docs/                   # Documentation
```

### Key Architectural Decisions

**Why React + Vite?**
- Fast HMR (Hot Module Replacement)
- Native ESM support
- Excellent TypeScript support

**Why Supabase?**
- PostgreSQL database (rock-solid RDBMS)
- Built-in authentication
- Real-time subscriptions
- Row-Level Security (RLS)
- Edge Functions for serverless backend
- Storage for file uploads

**Why Tailwind CSS?**
- Utility-first approach
- Design system consistency via `tailwind.config.ts`
- No CSS file bloat
- Responsive design made easy

**Why shadcn/ui?**
- Radix UI primitives (accessible by default)
- Copy-paste components (not an npm dependency)
- Full customization control
- TypeScript-first

---

## Development Workflow

### Creating a New Feature

#### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes

#### 2. Database Changes

If your feature requires database changes:

```bash
# Create a new migration file
supabase migration new your_migration_name
```

Edit the generated file in `supabase/migrations/`:

```sql
-- Example: Add a new table
CREATE TABLE public.new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.new_feature ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access"
ON public.new_feature FOR SELECT
USING (true);

CREATE POLICY "Admin full access"
ON public.new_feature FOR ALL
USING (is_admin(auth.uid()));
```

**Run migration locally:**

```bash
supabase db push
```

#### 3. Update TypeScript Types

Supabase automatically generates TypeScript types:

```bash
npm run generate-types
```

This updates `src/integrations/supabase/types.ts` (read-only).

#### 4. Create Components

**Example: Creating a new page component**

```tsx
// src/pages/NewFeature.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageLayout } from '@/components/layout/PageLayout';

export default function NewFeature() {
  const { data, isLoading } = useQuery({
    queryKey: ['new-feature'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('new_feature')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <PageLayout>
      <h1 className="text-display-lg font-heading">New Feature</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data?.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      )}
    </PageLayout>
  );
}
```

**Add route in `src/App.tsx`:**

```tsx
<Route path="/new-feature" element={<NewFeature />} />
```

#### 5. Styling Guidelines

**Use semantic design tokens:**

```tsx
// ❌ WRONG - Direct colors
<button className="bg-blue-500 text-white">

// ✅ CORRECT - Semantic tokens
<button className="bg-primary text-primary-foreground">
```

**Design tokens defined in `src/index.css`:**

```css
:root {
  --primary: 25 96% 35%;        /* Brand teal */
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 240 10% 4%;
  /* ... more tokens */
}
```

**Use existing components from shadcn/ui:**

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Card>Content here</Card>
```

#### 6. Data Fetching Patterns

**Use TanStack Query for all data fetching:**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('publish_state', 'published');
    if (error) throw error;
    return data;
  }
});

// Mutate data
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async (newProject) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject]);
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }
});
```

#### 7. Form Handling

**Use React Hook Form + Zod:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

function ContactForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' }
  });

  async function onSubmit(values) {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([values]);
    
    if (error) {
      toast.error('Submission failed');
    } else {
      toast.success('Thank you for contacting us!');
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

#### 8. Authentication & Authorization

**Check if user is authenticated:**

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

function ProtectedPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return <div>Protected Content</div>;
}
```

**Check if user is admin:**

```tsx
import { useAdminRoleCheck } from '@/hooks/useAdminRoleCheck';

function AdminPage() {
  const { isAdmin, loading } = useAdminRoleCheck();

  if (loading) return <p>Checking permissions...</p>;
  if (!isAdmin) return <p>Access denied</p>;

  return <div>Admin Dashboard</div>;
}
```

**Custom hook definition:**

```tsx
// src/hooks/useAdminRoleCheck.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminRoleCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin', 'super_admin'])
        .single();

      setIsAdmin(!!data);
      setLoading(false);
    }

    checkRole();
  }, []);

  return { isAdmin, loading };
}
```

---

## Code Standards

### TypeScript

**Always use explicit types:**

```tsx
// ❌ WRONG
const handleSubmit = (data) => { ... }

// ✅ CORRECT
const handleSubmit = (data: FormData): Promise<void> => { ... }
```

**Use interfaces for props:**

```tsx
interface ProjectCardProps {
  id: string;
  title: string;
  thumbnail: string;
  onSelect?: (id: string) => void;
}

export function ProjectCard({ id, title, thumbnail, onSelect }: ProjectCardProps) {
  // ...
}
```

### React Best Practices

**Use functional components with hooks:**

```tsx
// ❌ WRONG - Class components
class MyComponent extends React.Component { ... }

// ✅ CORRECT - Functional component
function MyComponent() {
  const [state, setState] = useState(initialValue);
  // ...
}
```

**Extract custom hooks for reusable logic:**

```tsx
// src/hooks/useProjects.ts
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      if (error) throw error;
      return data;
    }
  });
}

// Usage
import { useProjects } from '@/hooks/useProjects';
const { data: projects, isLoading } = useProjects();
```

### Naming Conventions

- **Components:** PascalCase (`ProjectCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useProjects.ts`)
- **Utilities:** camelCase (`formatCurrency.ts`)
- **Constants:** UPPER_SNAKE_CASE (`const MAX_FILE_SIZE = 50`)

### File Organization

```
src/components/
├── ui/                    # Generic UI primitives (Button, Card, etc.)
├── admin/                 # Admin-specific components
├── business/              # Business management components
├── blog/                  # Blog-specific components
├── homepage/              # Homepage sections
└── ProjectCard.tsx        # Shared components at root
```

**Component file structure:**

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface ProjectCardProps { ... }

// 3. Component
export function ProjectCard({ ... }: ProjectCardProps) {
  // 4. Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 5. Handlers
  const handleClick = () => { ... };
  
  // 6. Render
  return ( ... );
}
```

### Database Queries

**Always use RLS policies, never check permissions in code:**

```tsx
// ❌ WRONG - Client-side permission check
const { data } = await supabase.from('projects').select('*');
const visibleProjects = data.filter(p => user.isAdmin || p.publish_state === 'published');

// ✅ CORRECT - Let RLS handle it
const { data } = await supabase.from('projects').select('*');
// RLS policy automatically filters based on user
```

**RLS policy example:**

```sql
CREATE POLICY "Published projects viewable by everyone"
ON public.projects FOR SELECT
USING (
  publish_state = 'published' 
  OR auth.uid() IS NOT NULL  -- Authenticated users see all
);
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

**Component test example:**

```tsx
// src/components/__tests__/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';

describe('ProjectCard', () => {
  it('renders project title', () => {
    render(
      <ProjectCard
        id="123"
        title="Test Project"
        thumbnail="/test.jpg"
      />
    );
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(
      <ProjectCard
        id="123"
        title="Test Project"
        thumbnail="/test.jpg"
        onSelect={handleSelect}
      />
    );
    
    screen.getByText('Test Project').click();
    expect(handleSelect).toHaveBeenCalledWith('123');
  });
});
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui
```

**E2E test example:**

```typescript
// tests/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test('submits contact form successfully', async ({ page }) => {
  await page.goto('/contact');
  
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.fill('textarea[name="message"]', 'Test message');
  
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.toast')).toContainText('Thank you');
});
```

---

## Deployment

### Staging Deployment

```bash
# Push to staging branch
git push origin staging

# GitHub Actions automatically deploys to staging.ascentgroup.com
```

### Production Deployment

```bash
# Create a pull request to main branch
gh pr create --base main --head your-branch

# After approval and merge, GitHub Actions deploys to production
```

### Database Migrations

Migrations run automatically on deployment. To run manually:

```bash
supabase db push --project-ref xdowuirheazerlwatwja
```

### Edge Functions

Edge functions deploy automatically with code changes. To manually deploy:

```bash
supabase functions deploy function-name --project-ref xdowuirheazerlwatwja
```

---

## Troubleshooting

### Common Issues

#### 1. "Supabase client not initialized"

**Cause:** Missing or incorrect `.env` variables.

**Solution:**
```bash
# Check .env file has correct values
cat .env

# Restart dev server
npm run dev
```

#### 2. "RLS policy prevents access"

**Cause:** Row-Level Security blocking query.

**Solution:**
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Temporarily disable RLS for testing (DON'T DO IN PRODUCTION!)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;

-- Better: Fix the policy
CREATE POLICY "Allow authenticated users"
ON public.your_table FOR SELECT
USING (auth.uid() IS NOT NULL);
```

#### 3. "TypeScript types out of sync"

**Cause:** Database schema changed but types not regenerated.

**Solution:**
```bash
npm run generate-types
```

#### 4. "Module not found" errors

**Cause:** Path alias not resolved.

**Solution:**
- Check `tsconfig.json` has correct paths:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```
- Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

### Debugging

**Enable verbose logging:**

```tsx
// In development only
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

**Use React DevTools:**
- Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- Inspect component state and props

**Use Supabase logs:**
```bash
# View Edge Function logs
supabase functions logs function-name --project-ref xdowuirheazerlwatwja

# View database logs
supabase logs --project-ref xdowuirheazerlwatwja
```

---

## Getting Help

### Internal Resources

- **Documentation:** `/docs` folder
- **Component Library:** [http://localhost:5173/admin/style-guide](http://localhost:5173/admin/style-guide)
- **Database Schema:** [Database ERD](./DATABASE_ERD.md)
- **API Docs:** [Data Flow Diagrams](./DATA_FLOW_DIAGRAMS.md)

### Team Communication

- **Slack:** #ascentgroup-dev channel
- **Code Reviews:** Required on all PRs
- **Daily Standup:** 10 AM EST
- **Sprint Planning:** Mondays 2 PM EST

### External Resources

- [React Docs](https://react.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)

---

## Next Steps

Now that you're set up:

1. **Read existing code:** Browse `src/pages/` to understand patterns
2. **Pick up a starter task:** Check Jira for "Good First Issue" tickets
3. **Make your first PR:** Follow the workflow above
4. **Attend code review:** Learn from feedback

Welcome to the team! 🎉

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build

# Testing
npm test                       # Run tests
npm run test:watch             # Watch mode

# Database
npm run generate-types         # Generate TypeScript types
supabase db push               # Push migrations

# Linting
npm run lint                   # Check for errors
npm run format                 # Format code
```

### Important Files

- `src/App.tsx` - Main routing
- `src/integrations/supabase/client.ts` - Supabase client (read-only)
- `src/index.css` - Design tokens
- `tailwind.config.ts` - Tailwind config
- `vite.config.ts` - Vite config
- `supabase/config.toml` - Supabase config

### Key Hooks

- `useCompanySettings()` - Fetch company info
- `useAdminRoleCheck()` - Check if user is admin
- `useProjects()` - Fetch projects
- `useIntersectionObserver()` - Lazy loading
- `useCountUp()` - Animated counters

---

**Last Updated:** January 4, 2025  
**Maintainer:** Development Team Lead
