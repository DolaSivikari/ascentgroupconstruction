// Enhanced Navigation Structure for Professional Appearance
// Goal: Clean, organized navigation matching enterprise construction sites (PCL, Bird, EllisDon)

export interface SubItem {
  name: string;
  link: string;
  description?: string;
  badge?: "new" | "popular" | "important";
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

// Complete mega menu structure with 4 main sections
export const megaMenuDataEnhanced: MegaMenuDataEnhanced = {
  // ============================================
  // SERVICES MEGA MENU (900px, 4 columns)
  // ============================================
  services: {
    width: 580,
    columns: 3,
    sections: [
      {
        sectionTitle: "Our Services",
        sectionLink: "/services",
        cta: { text: "Request a Proposal", link: "/contact", variant: "primary" },
        categories: [
          {
            title: "Commercial Envelope",
            subItems: [
              { name: "Building Envelope Solutions", link: "/services/building-envelope", description: "Complete envelope systems", icon: "Building2" },
              { name: "Cladding Systems", link: "/services/cladding-systems", description: "Metal panel & ACM installation", icon: "Layers" },
              { name: "Masonry Restoration", link: "/services/masonry-restoration", description: "Brick and stone repair", icon: "Landmark" },
              { name: "Waterproofing Systems", link: "/services/building-envelope", description: "Foundation to roof protection", icon: "Droplets" },
              { name: "EIFS & Stucco", link: "/services/cladding-systems", description: "Exterior insulation systems", icon: "Square" },
            ],
          },
          {
            title: "Restoration Services",
            subItems: [
              { name: "Façade Remediation", link: "/services/facade-remediation", description: "Exterior restoration", icon: "Hammer" },
              { name: "Parking Garage Restoration", link: "/services/parking-garage-restoration", description: "Structural concrete repair", icon: "Car" },
              { name: "Sealant Programs", link: "/services/building-envelope", description: "Joint maintenance programs", icon: "Wrench" },
            ],
          },
          {
            title: "Residential Services",
            subItems: [
              { name: "Interior Finishing", link: "/services/interior-buildouts", description: "Complete interior renovations", icon: "Home" },
              { name: "Architectural Coatings", link: "/services/painting-services", description: "Commercial & residential painting", icon: "Paintbrush" },
              { name: "Tile & Flooring", link: "/services/tile-flooring", description: "Professional installation", icon: "Grid2X2" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // MARKETS / WHO WE SERVE MEGA MENU (800px, 4 columns)
  // ============================================
  markets: {
    width: 800,
    columns: 4,
    sections: [
      {
        sectionTitle: "Who We Serve",
        cta: { text: "View All Projects", link: "/projects", variant: "primary" },
        categories: [
          {
            title: "Commercial",
            subItems: [
              { name: "Property Managers", link: "/property-managers", description: "Building maintenance solutions", icon: "Building2" },
              { name: "Commercial Clients", link: "/commercial-clients", description: "Business property services", icon: "Briefcase" },
              { name: "Facility Managers", link: "/commercial-clients", description: "Facility maintenance", icon: "Settings" },
            ],
          },
          {
            title: "Residential",
            subItems: [
              { name: "Homeowners", link: "/homeowners", description: "Residential services", icon: "Home" },
              { name: "Condo Owners", link: "/homeowners", description: "Condo unit services", icon: "Building" },
            ],
          },
          {
            title: "Partners",
            subItems: [
              { name: "General Contractors", link: "/for-general-contractors", description: "Trade partnerships", icon: "HardHat", badge: "important" },
              { name: "Developers", link: "/company/developers", description: "Development projects", icon: "Building" },
              { name: "Consultants", link: "/for-general-contractors", description: "Consulting partnerships", icon: "Users" },
            ],
          },
          {
            title: "By Sector",
            subItems: [
              { name: "Multi-Residential", link: "/projects?sector=multi-residential", description: "Condos & apartments", icon: "Building" },
              { name: "Commercial", link: "/projects?sector=commercial", description: "Office & retail", icon: "Store" },
              { name: "Industrial", link: "/projects?sector=industrial", description: "Warehouses & facilities", icon: "Factory" },
              { name: "Institutional", link: "/projects?sector=institutional", description: "Schools & hospitals", icon: "School" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // COMPANY MEGA MENU (700px, 3 columns)
  // ============================================
  company: {
    width: 700,
    columns: 3,
    sections: [
      {
        sectionTitle: "About Ascent Group",
        sectionLink: "/about",
        cta: { text: "Contact Us", link: "/contact", variant: "primary" },
        categories: [
          {
            title: "About Us",
            subItems: [
              { name: "About Ascent", link: "/about", description: "Our story and values", icon: "Info" },
              { name: "Our Process", link: "/our-process", description: "How we work", icon: "GitBranch" },
              { name: "Why Specialty Contractor", link: "/why-specialty-contractor", description: "Our positioning", icon: "Star" },
              { name: "Sustainability", link: "/sustainability", description: "Environmental commitment", icon: "Leaf" },
            ],
          },
          {
            title: "Capabilities",
            subItems: [
              { name: "Our Capabilities", link: "/capabilities", description: "What we can do", icon: "Award" },
              { name: "Equipment & Resources", link: "/company/equipment-resources", description: "Our fleet", icon: "Wrench" },
              { name: "Certifications & Insurance", link: "/company/certifications-insurance", description: "Credentials", icon: "Shield" },
              { name: "Service Areas", link: "/resources/service-areas", description: "Where we work", icon: "MapPin" },
            ],
          },
          {
            title: "Join Us",
            subItems: [
              { name: "Careers", link: "/careers", description: "Join our team", icon: "Users" },
              { name: "Request Estimate", link: "/estimate", description: "Project estimate", icon: "Calculator" },
              { name: "Submit RFP", link: "/submit-rfp", description: "Request for proposal", icon: "FileText" },
            ],
          },
        ],
      },
    ],
  },

  // ============================================
  // RESOURCES MEGA MENU (600px, 3 columns)
  // ============================================
  resources: {
    width: 600,
    columns: 3,
    sections: [
      {
        sectionTitle: "Resources",
        cta: { text: "Download Vendor Packet", link: "/resources/contractor-portal#vendor-packet", variant: "primary" },
        categories: [
          {
            title: "For Clients",
            subItems: [
              { name: "Contractor Portal", link: "/resources/contractor-portal", description: "Access your documents", icon: "Layout", isFeatured: true, badge: "important" },
              { name: "Prequalification", link: "/prequalification", description: "Vendor prequalification", icon: "FileCheck", isFeatured: true, badge: "important" },
              { name: "Documents Library", link: "/resources/contractor-portal", description: "Downloadable resources", icon: "FolderOpen" },
            ],
          },
          {
            title: "Knowledge",
            subItems: [
              { name: "Blog", link: "/blog", description: "Industry insights", icon: "BookOpen" },
              { name: "Insights", link: "/insights", description: "Thought leadership", icon: "Lightbulb" },
              { name: "FAQ", link: "/faq", description: "Common questions", icon: "HelpCircle" },
            ],
          },
          {
            title: "Tools",
            subItems: [
              { name: "Service Selector", link: "/service-selector", description: "Find the right service", icon: "Compass", isFeatured: true },
              { name: "Request Estimate", link: "/estimate", description: "Get a quote", icon: "Calculator" },
              { name: "Submit RFP", link: "/submit-rfp", description: "Formal proposal", icon: "FileText" },
            ],
          },
        ],
      },
    ],
  },

  // Legacy support - keeping partners for backward compatibility
  partners: {
    width: 600,
    columns: 2,
    sections: [
      {
        sectionTitle: "Who We Serve",
        categories: [
          {
            title: "Our Clients",
            subItems: [
              { name: "General Contractors", link: "/for-general-contractors", description: "Trade partnerships", badge: "important", icon: "HardHat" },
              { name: "Property Managers", link: "/property-managers", description: "Building maintenance", icon: "Building2" },
              { name: "Homeowners", link: "/homeowners", description: "Residential services", icon: "Home" },
              { name: "Commercial Clients", link: "/commercial-clients", description: "Business properties", icon: "Briefcase" },
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

// Export navigation menu items for mobile/other components
export const mainNavItems = [
  { label: "Services", link: "/services", hasMegaMenu: true, menuKey: "services" },
  { label: "Who We Serve", link: null, hasMegaMenu: true, menuKey: "markets" },
  { label: "Projects", link: "/projects", hasMegaMenu: false },
  { label: "Company", link: "/about", hasMegaMenu: true, menuKey: "company" },
  { label: "Resources", link: null, hasMegaMenu: true, menuKey: "resources" },
  { label: "Contact", link: "/contact", hasMegaMenu: false },
];
