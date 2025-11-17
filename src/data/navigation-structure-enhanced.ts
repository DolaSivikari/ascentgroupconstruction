import { LucideIcon } from "lucide-react";

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

export const megaMenuDataEnhanced: MegaMenuDataEnhanced = {
  services: [
    {
      sectionTitle: "Our Services",
      sectionLink: "/services",
      categories: [
        {
          title: "Building Envelope Systems",
          description: "Complete exterior envelope and cladding solutions",
          subItems: [
            { name: "Building Envelope Solutions", link: "/services/building-envelope", description: "Comprehensive envelope systems", badge: "popular" },
            { name: "Cladding Systems", link: "/services/cladding-systems", description: "Metal panels, EIFS, stucco & rainscreen", badge: "new" },
            { name: "Waterproofing", link: "/services/waterproofing", description: "Complete waterproofing solutions" },
            { name: "Protective & Architectural Coatings", link: "/services/protective-coatings", description: "Interior/exterior protective systems" },
          ],
        },
        {
          title: "Interior Construction",
          description: "Commercial interior construction and finishing",
          subItems: [
            { name: "Interior Buildouts & Finishing", link: "/services/interior-buildouts", description: "Tenant improvements & fit-outs" },
            { name: "Painting Services", link: "/services/painting-services", description: "Commercial, multi-family & residential", badge: "new" },
            { name: "Tile & Flooring", link: "/services/tile-flooring", description: "Ceramic, porcelain, LVT & specialty", badge: "new" },
          ],
        },
        {
          title: "Specialty Services",
          description: "Sustainable building and specialty solutions",
          subItems: [
            { name: "Sustainable Building", link: "/services/sustainable-construction", description: "LEED & green building solutions", badge: "new" },
          ],
        },
      ],
    },
  ],
  projects: [
    {
      sectionTitle: "Projects",
      sectionLink: "/projects",
      categories: [
        {
          title: "Browse by Type",
          description: "View projects by category and client type",
          subItems: [
            { name: "All Projects", link: "/projects" },
            { name: "Residential Projects", link: "/projects?client_type=homeowner" },
            { name: "Commercial Projects", link: "/projects?client_type=commercial" },
            { name: "Multi-Unit Projects", link: "/projects?client_type=developer", badge: "popular" },
            { name: "Blog & Case Studies", link: "/blog" },
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
          title: "Our Company",
          description: "Learn about our team and values",
          subItems: [
            { name: "About Us", link: "/about", description: "Our story and values" },
            { name: "Leadership Team", link: "/about#team", description: "Meet our experienced team" },
            { name: "Our Process", link: "/our-process", description: "How we deliver projects" },
          ],
        },
        {
          title: "Credentials & Compliance",
          description: "Qualifications and certifications",
          subItems: [
            { name: "Pre-Qualification Package", link: "/prequalification", description: "Download contractor qualifications", badge: "important" },
            { name: "Capabilities Overview", link: "/capabilities", description: "Project delivery methods", badge: "new" },
            { name: "Certifications & Insurance", link: "/company/certifications-insurance", description: "Licenses and coverage" },
          ],
        },
        {
          title: "Company Info",
          description: "Additional information and opportunities",
          subItems: [
            { name: "Why Specialty Contractor?", link: "/why-specialty-contractor", description: "Specialty vs general contractor comparison", badge: "new" },
            { name: "Equipment & Resources", link: "/company/equipment-resources", description: "Our self-perform capabilities" },
            { name: "For Developers", link: "/company/developers", description: "Partnership opportunities" },
            { name: "Sustainability", link: "/sustainability", description: "Environmental commitment" },
            { name: "Careers", link: "/careers", description: "Join our team" },
          ],
        },
      ],
    },
  ],
  partners: [
    {
      sectionTitle: "For Our Partners",
      categories: [
        {
          title: "Partner Solutions",
          description: "Specialized services for industry professionals",
          subItems: [
            { name: "Commercial Clients", link: "/commercial-clients", description: "Solutions for commercial projects" },
            { name: "Property Managers", link: "/property-managers", description: "Property management services" },
            { name: "General Contractors", link: "/for-general-contractors", description: "Partnership opportunities" },
          ],
        },
      ],
    },
  ],
  resources: [
    {
      sectionTitle: "Support & Resources",
      categories: [
        {
          title: "Resources",
          description: "Help center and knowledge base",
          subItems: [
            { name: "FAQ", link: "/faq", description: "Frequently asked questions" },
            { name: "Service Areas", link: "/resources/service-areas", description: "Where we work" },
            { name: "Blog & Insights", link: "/blog", description: "Industry knowledge" },
          ],
        },
        {
          title: "For Professionals",
          description: "Tools for contractors and partners",
          subItems: [
            { name: "Contractor Portal", link: "/resources/contractor-portal", description: "Trade partner resources", badge: "important" },
            { name: "Submit RFP", link: "/submit-rfp", description: "Request for proposal" },
            { name: "Request Proposal", link: "/estimate", description: "Get detailed estimate" },
          ],
        },
      ],
    },
  ],
};
