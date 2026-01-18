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

// Simplified mega menu - fewer items, cleaner organization
export const megaMenuDataEnhanced: MegaMenuDataEnhanced = {
  services: [
    {
      sectionTitle: "Our Services",
      sectionLink: "/services",
      categories: [
        {
          title: "Building Envelope",
          subItems: [
            { name: "Envelope Solutions", link: "/services/building-envelope", description: "Complete envelope systems" },
            { name: "Waterproofing", link: "/services/waterproofing", description: "Foundation to roof protection" },
            { name: "Cladding Systems", link: "/services/cladding-systems", description: "Metal panel installation" },
            { name: "Masonry Restoration", link: "/services/masonry-restoration", description: "Brick and stone repair" },
          ],
        },
        {
          title: "Interior & Coatings",
          subItems: [
            { name: "Painting Services", link: "/services/painting-services", description: "Commercial & residential" },
            { name: "Tile & Flooring", link: "/services/tile-flooring", description: "Professional installation" },
            { name: "Protective Coatings", link: "/services/protective-coatings", description: "Surface protection" },
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
            { name: "Prequalification Package", link: "/prequalification", description: "GC qualification docs", badge: "important" },
            { name: "Submit RFP", link: "/submit-rfp", description: "Request for proposal" },
            { name: "FAQ", link: "/faq", description: "Common questions" },
          ],
        },
      ],
    },
  ],
};