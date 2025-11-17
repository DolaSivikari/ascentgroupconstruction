# Ascent Group Construction - General Contractor Website

## Project Overview

Full-service general contractor website specializing in commercial, multi-family residential, and institutional construction projects across Ontario. Built with React, TypeScript, and Supabase (Lovable Cloud).

---

## 🎯 Business Positioning

**Primary Focus:** General Contractor for commercial, multi-family, and institutional projects
- ❌ **Not a residential painter**
- ✅ **Full-service construction management**
- ✅ **Design-build capabilities**
- ✅ **Building envelope systems**

---

## 🏗️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool & dev server)
- Tailwind CSS (styling)
- shadcn/ui (component library)
- React Router (client-side routing)
- TanStack Query (data fetching)
- Framer Motion (animations)

**Backend (Lovable Cloud/Supabase):**
- PostgreSQL database
- Row Level Security (RLS)
- Authentication (email/password)
- Storage (project images, documents)
- Edge Functions (serverless backend logic)

**Key Libraries:**
- `react-hook-form` + `zod` - Form validation
- `react-quill` - Rich text editor (admin)
- `@react-pdf/renderer` - PDF generation (estimates/invoices)
- `date-fns` - Date formatting
- `sonner` + `@radix-ui` - Toast notifications
- `yet-another-react-lightbox` - Image galleries
- `@dnd-kit` - Drag-and-drop (admin)

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── admin/          # Admin-specific components
│   ├── business/       # Business module (estimates/invoices)
│   ├── homepage/       # Homepage sections
│   ├── navigation/     # Navigation & menus
│   └── ...
├── pages/              # Route pages
│   ├── admin/          # Admin dashboard pages
│   ├── company/        # Company info pages
│   ├── markets/        # Market-specific pages
│   ├── resources/      # Resource pages
│   ├── services/       # Service pages
│   └── Index.tsx       # Homepage
├── hooks/              # Custom React hooks
├── lib/                # Utilities & helpers
├── data/               # Static data & configurations
├── utils/              # Utility functions
├── integrations/       # Supabase integration
└── styles/             # Global styles
```

---

## ✨ Active Features

### **Public-Facing:**
- ✅ Homepage with hero, metrics, certifications
- ✅ Services explorer (21+ services)
- ✅ Project portfolio (case studies)
- ✅ Blog/news section
- ✅ Contact & RFP submission forms
- ✅ Project estimator calculator
- ✅ Pre-qualification package download
- ✅ Company information (about, team, certifications)
- ✅ Market-specific pages (8 markets)
- ✅ SEO optimization (structured data, meta tags)
- ✅ Responsive design (mobile-first)
- ✅ Accessibility (WCAG AA)

### **Admin Dashboard:**
- ✅ Content Management System (CMS)
  - Services editor
  - Project/case study manager
  - Blog post editor
- ✅ Form submission management
  - Contact submissions
  - RFP submissions
  - Resume submissions
  - Pre-qualification requests
- ✅ Media library
- ✅ User management (roles & permissions)
- ✅ Homepage settings
- ✅ Company stats management
- ✅ Testimonials manager
- ✅ Leadership team manager
- ✅ SEO dashboard
- ✅ Performance monitoring
- ✅ Security center

### **Business Module:**
- ✅ Client management (CRM-lite)
- ✅ Project tracking
- ✅ Estimates/quotes generator
- ✅ Invoice generation
- ✅ PDF export (estimates & invoices)
- ✅ Payment tracking

---

## 🚀 Getting Started

### **Prerequisites:**
- Node.js 18+ and npm
- Git

### **Installation:**

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

---

## 🔐 Environment Variables

Required environment variables (auto-configured by Lovable Cloud):

```
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

---

## 📦 Build & Deploy

### **Build for Production:**
```sh
npm run build
```

### **Preview Production Build:**
```sh
npm run preview
```

### **Deploy via Lovable:**
1. Visit [Lovable Project](https://lovable.dev/projects/3174d3a8-9b0e-45f6-bf01-0f48b1c02607)
2. Click "Publish" button
3. Your site will be deployed to `yoursite.lovable.app`

### **Custom Domain:**
- Navigate to Project > Settings > Domains
- Click "Connect Domain"
- Follow DNS configuration instructions

---

## 🎨 Design System

**Colors (HSL):**
- Primary: Navy (#003366)
- Charcoal: Gray (#36454F)
- Accent: Orange (#FF6B35)
- Semantic tokens defined in `src/index.css`

**Typography:**
- Font: Inter (400, 600, 700 weights)
- Scale: 12px → 14px → 16px → 18px → 20px → 24px → 32px → 48px → 64px

**Spacing:**
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

**Components:**
- Base: shadcn/ui components
- Custom variants for brand-specific styling
- Consistent design tokens across all components

---

## 🧹 Recent Cleanup (January 2025)

**Removed:**
- 6 files (old hero components, residential pages)
- 5 unused database tables
- 15 unused image assets (blog/case study images)
- 150+ instances of residential/painting language

**Updated:**
- All CTAs to "Request Proposal" (from "Get Free Quote/Estimate")
- Target audience to property owners/developers (from homeowners)
- Service descriptions to GC-focused (from painting services)
- Meta tags & SEO to commercial construction keywords

**Results:**
- 100% message consistency (pure GC positioning)
- Cleaner codebase (fewer files, less code)
- Smaller bundle size (~30% reduction estimated)
- Better SEO focus (targeted keywords)

---

## 📚 Documentation

- [Deployment Guide](https://docs.lovable.dev/features/custom-domain)
- [Lovable Cloud Features](https://docs.lovable.dev/features/cloud)
- [Database Schema](./docs/DATABASE_ERD.md)
- [Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md)
- [Cleanup Report](./CLEANUP_REPORT.md)

---

## 🤝 Contributing

**Edit via Lovable:**
- Visit [Lovable Project](https://lovable.dev/projects/3174d3a8-9b0e-45f6-bf01-0f48b1c02607)
- Start prompting for changes
- Changes auto-commit to this repo

**Edit Locally:**
1. Make changes in your preferred IDE
2. Commit and push to GitHub
3. Changes will reflect in Lovable

---

## 📄 License

Proprietary - Ascent Group Construction

---

## 🆘 Support

- **Lovable Docs:** https://docs.lovable.dev/
- **Lovable Discord:** https://discord.com/channels/1119885301872070706/1280461670979993613
- **Project URL:** https://lovable.dev/projects/3174d3a8-9b0e-45f6-bf01-0f48b1c02607
