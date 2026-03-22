// Enhanced Navigation Structure for Professional Appearance
// Phase 4: Restructured for About → Services → Markets → Projects → Trade Partners → Contact

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

// Complete mega menu structure
export const megaMenuDataEnhanced: MegaMenuDataEnhanced = {
  // ============================================
  // SERVICES MEGA MENU
  // ============================================
  services: {
    width: 580,
    columns: 3,
    sections: [
      {
        sectionTitle: "Our Services",
        sectionLink: "/services",
        cta: { text: "Submit RFP", link: "/submit-rfp", variant: "primary" },
        categories: [
          {
            title: "Commercial Envelope",
            subItems: [
              { name: "Building Envelope Solutions", link: "/services/building-envelope", description: "Complete envelope systems", icon: "Building2" },
              { name: "Cladding Systems", link: "/services/cladding-systems", description: "Metal panel & ACM installation", icon: "Layers" },
              { name: "Masonry Restoration", link: "/services/masonry-restoration", description: "Brick and stone repair", icon: "Landmark" },
              { name: "Waterproofing Systems", link: "/services/waterproofing", description: "Foundation to roof protection", icon: "Droplets" },
              { name: "EIFS & Stucco", link: "/services/eifs-stucco", description: "Exterior insulation systems", icon: "Square" },
            ],
          },
          {
            title: "Restoration Services",
            subItems: [
              { name: "Façade Remediation", link: "/services/facade-remediation", description: "Exterior restoration", icon: "Hammer" },
              { name: "Parking Garage Restoration", link: "/services/parking-garage-restoration", description: "Structural concrete repair", icon: "Car" },
              { name: "Sealant Programs", link: "/services/sealant-programs", description: "Joint maintenance programs", icon: "Wrench" },
              { name: "Emergency Repair", link: "/emergency-repair", description: "24/7 urgent response", icon: "AlertTriangle" },
            ],
          },
          {
            title: "Interior & Finishing",
            subItems: [
              { name: "Interior Finishing", link: "/services/interior-buildouts", description: "Complete interior renovations", icon: "Home" },
              { name: "Architectural Coatings", link: "/services/painting-services", description: "Commercial & residential painting", icon: "Paintbrush" },
              { name: "Tile & Flooring", link: "/services/tile-flooring", description: "Professional installation", icon: "Grid2X2" },
              { name: "Sustainable Construction", link: "/services/sustainable-construction", description: "Green building practices", icon: "Leaf" },
            ],
          },
        ],
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
    width: 520,
    columns: 2,
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
