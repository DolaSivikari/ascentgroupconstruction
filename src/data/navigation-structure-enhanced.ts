// Enhanced Navigation Structure for Professional Appearance
// Services menu is auto-built from src/data/service-registry.ts so that
// new service pages added to the registry automatically appear in the nav.

import {
  SERVICE_CATEGORIES,
  getNavServicesByCategory,
  type ServiceCategory,
} from "./service-registry";

export interface SubItem {
  name: string;
  link: string;
  description?: string;

  icon?: string;
  isFeatured?: boolean;
}

export interface AccordionCategory {
  title: string;
  description?: string;
  subItems: SubItem[];
}

export interface SectionCTA {
  text: string;
  link: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface Section {
  sectionTitle: string;
  sectionLink?: string;
  categories: AccordionCategory[];
  cta?: SectionCTA;
}

export interface MegaMenuConfig {
  sections: Section[];
  width: number; // in pixels
  columns: number;
}

export interface MegaMenuDataEnhanced {
  [key: string]: MegaMenuConfig;
}

// Build the Services mega-menu categories from the registry — keeps nav,
// routes, and audit in sync from one source.
function buildServicesCategories(): AccordionCategory[] {
  const grouped = getNavServicesByCategory();
  const order: ServiceCategory[] = ["envelope", "restoration", "interior"];
  return order
    .map((key) => {
      const meta = SERVICE_CATEGORIES[key];
      const subItems: SubItem[] = grouped[key].map((entry) => ({
        name: entry.navLabel,
        link: entry.path,
        description: entry.navDescription,
        icon: entry.icon,
      }));
      return {
        title: meta.title,
        description: meta.description,
        subItems,
      };
    })
    .filter((cat) => cat.subItems.length > 0);
}

// Complete mega menu structure
export const megaMenuDataEnhanced: MegaMenuDataEnhanced = {
  // ============================================
  // SERVICES MEGA MENU (auto-built from registry)
  // ============================================
  services: {
    width: 760,
    columns: 3,
    sections: [
      {
        sectionTitle: "Our Services",
        sectionLink: "/services",
        cta: { text: "View all services", link: "/services", variant: "primary" },
        categories: buildServicesCategories(),
      },
    ],
  },

  // ============================================
  // MARKETS MEGA MENU
  // ============================================
  markets: {
    width: 520,
    columns: 3,
    sections: [
      {
        sectionTitle: "Markets",
        sectionLink: "/markets",
        cta: { text: "View All Projects", link: "/projects", variant: "primary" },
        categories: [
          {
            title: "Commercial",
            subItems: [
              { name: "Property Managers", link: "/property-managers", description: "Building maintenance solutions", icon: "Building2" },
              { name: "Commercial Clients", link: "/commercial-clients", description: "Business property services", icon: "Briefcase" },
            ],
          },
          {
            title: "Residential",
            subItems: [
              { name: "Homeowners", link: "/homeowners", description: "Residential services", icon: "Home" },
            ],
          },
          {
            title: "Industry Partners",
            subItems: [
              { name: "General Contractors", link: "/for-general-contractors", description: "Trade partnerships", icon: "HardHat" },
              { name: "Developers", link: "/company/developers", description: "Development projects", icon: "Building" },
              { name: "Architects & Consultants", link: "/for-architects", description: "Design professional partners", icon: "Ruler" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // COMPANY (ABOUT) MEGA MENU
  // ============================================
  company: {
    width: 620,
    columns: 3,
    sections: [
      {
        sectionTitle: "About Ascent Group",
        sectionLink: "/about",
        cta: { text: "Contact Us", link: "/contact", variant: "primary" },
        categories: [
          {
            title: "Company",
            subItems: [
              { name: "About Ascent", link: "/about", description: "Our story and values", icon: "Info" },
              { name: "Capabilities", link: "/capabilities", description: "What we deliver", icon: "Hammer" },
              { name: "Why Specialty?", link: "/why-specialty-contractor", description: "Our advantage", icon: "Award" },
              { name: "Our Process", link: "/our-process", description: "How we work", icon: "GitBranch" },
              { name: "Careers", link: "/careers", description: "Join our team", icon: "Users" },
              { name: "FAQ", link: "/faq", description: "Common questions", icon: "HelpCircle" },
            ],
          },
          {
            title: "Who We Serve",
            subItems: [
              { name: "Property Managers", link: "/property-managers", description: "Building maintenance solutions", icon: "Building2" },
              { name: "Commercial Clients", link: "/commercial-clients", description: "Business property services", icon: "Briefcase" },
              { name: "Homeowners", link: "/homeowners", description: "Residential services", icon: "Home" },
              { name: "Developers", link: "/company/developers", description: "Development projects", icon: "Building" },
            ],
          },
          {
            title: "Credentials",
            subItems: [
              { name: "Certifications & Insurance", link: "/company/certifications-insurance", description: "Credentials", icon: "Shield" },
              { name: "Technology & Innovation", link: "/company/technology", description: "Our digital workflow", icon: "Laptop" },
              { name: "Service Areas", link: "/resources/service-areas", description: "Where we work", icon: "MapPin" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // TRADE PARTNERS MEGA MENU
  // ============================================
  tradePartners: {
    width: 480,
    columns: 2,
    sections: [
      {
        sectionTitle: "Trade Partners",
        sectionLink: "/for-general-contractors",
        cta: { text: "Submit RFP", link: "/submit-rfp", variant: "primary" },
        categories: [
          {
            title: "Get Started",
            subItems: [
              { name: "Submit RFP", link: "/submit-rfp", description: "Formal proposal request", icon: "FileText", isFeatured: true },
              { name: "Request Estimate", link: "/estimate", description: "Project estimate", icon: "Calculator" },
              { name: "Prequalification", link: "/prequalification", description: "Vendor onboarding", icon: "FileCheck", isFeatured: true },
            ],
          },
          {
            title: "Resources",
            subItems: [
              { name: "Contractor Portal", link: "/resources/contractor-portal", description: "Access your documents", icon: "Layout", isFeatured: true },
              { name: "Blog", link: "/blog", description: "Industry insights", icon: "BookOpen" },
            ],
          },
        ],
      },
    ],
  },
};

// Helper to get sections array from config
export const getMegaMenuSections = (key: string): Section[] => {
  return megaMenuDataEnhanced[key]?.sections || [];
};

// Helper to get menu config
export const getMegaMenuConfig = (key: string): MegaMenuConfig | null => {
  return megaMenuDataEnhanced[key] || null;
};
