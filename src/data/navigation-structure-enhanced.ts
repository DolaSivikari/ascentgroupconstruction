// Simplified Navigation Structure for Professional Appearance
// Goal: Clean, organized navigation like enterprise construction sites

export interface SubItem {
  name: string;
  link: string;
  description?: string;
  badge?: "new" | "popular" | "important";
}

export interface AccordionCategory {
  title: string;
  description?: string;
  subItems: SubItem[];
}

export interface Section {
  sectionTitle: string;
  sectionLink?: string;
  categories: AccordionCategory[];
}

export interface MegaMenuDataEnhanced {
  [key: string]: Section[];
}

// Updated mega menu with 3-column Services structure
export const megaMenuDataEnhanced: MegaMenuDataEnhanced = {
  services: [
    {
      sectionTitle: "Our Services",
      sectionLink: "/services",
      categories: [
        {
          title: "Commercial Envelope",
          subItems: [
            { name: "Building Envelope Solutions", link: "/services/building-envelope-solutions", description: "Complete envelope systems" },
            { name: "Cladding Systems", link: "/services/cladding-systems", description: "Metal panel & ACM installation" },
            { name: "Masonry Restoration", link: "/services/masonry-restoration", description: "Brick and stone repair" },
            { name: "Waterproofing Systems", link: "/services/waterproofing-systems", description: "Foundation to roof protection" },
            { name: "EIFS & Stucco", link: "/services/eifs-stucco-systems", description: "Exterior insulation systems" },
          ],
        },
        {
          title: "Restoration Services",
          subItems: [
            { name: "Façade Remediation", link: "/services/facade-remediation", description: "Exterior restoration" },
            { name: "Parking Garage Restoration", link: "/services/parking-garage-restoration", description: "Structural concrete repair" },
            { name: "Sealant Programs", link: "/services/sealant-programs", description: "Joint maintenance programs" },
          ],
        },
        {
          title: "Residential",
          subItems: [
            { name: "Interior Finishing", link: "/services/interior-finishing-renovations", description: "Complete interior renovations" },
            { name: "Architectural Coatings", link: "/services/painting-services", description: "Commercial & residential painting" },
            { name: "Tile & Flooring", link: "/services/tile-flooring", description: "Professional installation" },
            { name: "View All Services", link: "/services", description: "Complete service list" },
          ],
        },
      ],
    },
  ],
  
  company: [
    {
      sectionTitle: "About Ascent Group",
      sectionLink: "/about",
      categories: [
        {
          title: "Company",
          subItems: [
            { name: "About Us", link: "/about", description: "Our story and values" },
            { name: "Our Process", link: "/our-process", description: "How we work" },
            { name: "Certifications & Insurance", link: "/company/certifications-insurance", description: "Licenses & coverage" },
            { name: "Careers", link: "/careers", description: "Join our team" },
          ],
        },
      ],
    },
  ],
  
  partners: [
    {
      sectionTitle: "Who We Serve",
      categories: [
        {
          title: "Our Clients",
          subItems: [
            { name: "General Contractors", link: "/for-general-contractors", description: "Trade partnerships", badge: "important" },
            { name: "Property Managers", link: "/property-managers", description: "Building maintenance" },
            { name: "Homeowners", link: "/homeowners", description: "Residential services" },
            { name: "Commercial Clients", link: "/commercial-clients", description: "Business properties" },
          ],
        },
      ],
    },
  ],
  
  resources: [
    {
      sectionTitle: "Resources",
      categories: [
        {
          title: "Information",
          subItems: [
            { name: "Projects Portfolio", link: "/projects", description: "Our completed work" },
            { name: "Contractor Portal", link: "/resources/contractor-portal", description: "GC resources & documents", badge: "important" },
            { name: "Submit RFP", link: "/submit-rfp", description: "Request for proposal" },
            { name: "FAQ", link: "/faq", description: "Common questions" },
          ],
        },
      ],
    },
  ],
};
