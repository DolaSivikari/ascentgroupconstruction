import { Building2, Home, Building, Layers, Hammer } from 'lucide-react';

// Construction Services Variants
export const paintingVariants = [
  {
    id: 'commercial',
    title: 'Commercial',
    tagline: 'Professional Commercial Construction Solutions',
    description: 'Expert construction and finishing services for offices, retail spaces, warehouses, and commercial facilities. Minimize disruption with flexible scheduling and efficient project management.',
    benefits: [
      'Minimal business disruption with flexible scheduling',
      'High-performance materials for heavy traffic areas',
      'Compliance with commercial building codes',
      'Large-scale project management expertise',
      'Quick turnaround times',
      'Warranty protection for all work performed'
    ],
    process: [
      {
        step: 1,
        title: 'Site Assessment & Planning',
        description: 'Evaluate space and plan logistics',
        details: 'Our team conducts a thorough site assessment, evaluates traffic patterns, and develops a detailed work schedule that minimizes impact on your business operations.'
      },
      {
        step: 2,
        title: 'Surface Preparation',
        description: 'Professional prep work for optimal results',
        details: 'We prepare all surfaces through cleaning, repairs, priming, and protection of fixtures and equipment to ensure a flawless finish.'
      },
      {
        step: 3,
        title: 'Construction Execution',
        description: 'Premium material application',
        details: 'Using commercial-grade materials and proven techniques, we execute work systematically to deliver consistent, professional results throughout your facility.'
      },
      {
        step: 4,
        title: 'Quality Inspection & Handover',
        description: 'Final inspection and cleanup',
        details: 'We conduct a detailed quality inspection, address any touch-ups, and ensure complete cleanup before handing over your refreshed space.'
      }
    ],
    quickFacts: {
      projectTypes: ['Office Buildings', 'Retail Spaces', 'Warehouses', 'Medical Facilities', 'Educational Institutions'],
      timeline: '2-6 weeks depending on scope',
      certifications: ['WSIB Certified', 'OSHA Compliant', 'Commercial Insurance']
    }
  },
  {
    id: 'residential',
    title: 'Residential',
    tagline: 'Transform Your Home with Expert Construction',
    description: 'Premium residential construction and finishing services for interiors and exteriors. From single rooms to whole-home transformations, we deliver beautiful, lasting results.',
    benefits: [
      'Personalized design consultation',
      'Meticulous attention to detail',
      'Premium materials for durability',
      'Respectful of your home and schedule',
      'Clean, organized worksite daily',
      'Satisfaction guaranteed'
    ],
    process: [
      {
        step: 1,
        title: 'Consultation & Design Selection',
        description: 'Plan your perfect project',
        details: 'We meet with you to understand your vision, provide design recommendations, and create a detailed project plan that aligns with your timeline and budget.'
      },
      {
        step: 2,
        title: 'Preparation',
        description: 'Thorough prep for perfect results',
        details: 'Our team carefully prepares all surfaces through cleaning, patching, sanding, and priming while protecting your furniture and flooring.'
      },
      {
        step: 3,
        title: 'Construction',
        description: 'Expert execution',
        details: 'We apply premium materials using professional techniques to achieve smooth, even coverage with clean lines and beautiful finishes.'
      },
      {
        step: 4,
        title: 'Final Walkthrough',
        description: 'Ensure your complete satisfaction',
        details: 'We conduct a final walkthrough with you, address any concerns, and ensure you\'re delighted with your newly completed project.'
      }
    ],
    quickFacts: {
      projectTypes: ['Single Rooms', 'Whole Home Interior', 'Exterior Finishes', 'Trim & Millwork', 'Deck & Outdoor'],
      timeline: '3-10 days for most projects',
      certifications: ['Licensed & Insured', 'Lead-Safe Certified', 'Warranty Backed']
    }
  },
  {
    id: 'multi-unit',
    title: 'Condo & Multi-Unit',
    tagline: 'Specialized Construction for Multi-Residential Properties',
    description: 'Comprehensive construction and finishing solutions for condominiums, apartment complexes, and multi-unit residential buildings. Expert coordination and tenant-friendly scheduling.',
    benefits: [
      'Experience with condo board requirements',
      'Tenant-friendly scheduling options',
      'Common area specialists',
      'Balcony and exterior expertise',
      'Unit turnover construction services',
      'Volume pricing for multiple units'
    ],
    process: [
      {
        step: 1,
        title: 'Building Assessment & Coordination',
        description: 'Plan with property management',
        details: 'We coordinate with property managers and condo boards to assess the scope, schedule work around tenant occupancy, and plan logistics for multi-unit access.'
      },
      {
        step: 2,
        title: 'Unit & Common Area Prep',
        description: 'Systematic preparation',
        details: 'Our teams work unit by unit, preparing surfaces while coordinating with tenants and protecting common areas during the painting process.'
      },
      {
        step: 3,
        title: 'Efficient Execution',
        description: 'Coordinated construction execution',
        details: 'We work on multiple units simultaneously when possible, maintaining consistent quality while maximizing efficiency and minimizing overall project duration.'
      },
      {
        step: 4,
        title: 'Unit Sign-Off & Documentation',
        description: 'Detailed completion process',
        details: 'Each unit is inspected and signed off individually, with photo documentation provided to property management for records.'
      }
    ],
    quickFacts: {
      projectTypes: ['Condo Suites', 'Common Areas', 'Hallways & Stairwells', 'Balconies', 'Parkades', 'Amenity Spaces'],
      timeline: '2-8 weeks for buildings',
      certifications: ['Property Management Preferred', 'High-Rise Certified', 'Tenant Insurance']
    }
  },
  {
    id: 'parking-garage',
    title: 'Parking Garage',
    tagline: 'Heavy-Duty Parking Structure Solutions',
    description: 'Specialized protective coatings and waterproofing systems for parking structures. Expert traffic coatings, line striping, concrete repair, and waterproofing for underground and above-ground facilities.',
    benefits: [
      'Heavy-duty traffic coatings',
      'Waterproofing and moisture protection',
      'Concrete repair and restoration',
      'Line striping and safety markings',
      'Chemical-resistant finishes',
      'Extended structure lifespan'
    ],
    process: [
      {
        step: 1,
        title: 'Structure Assessment',
        description: 'Evaluate parking facility condition',
        details: 'Our team conducts a thorough structural assessment, identifying areas of concrete damage, water infiltration, and coating failure to develop a comprehensive restoration plan.'
      },
      {
        step: 2,
        title: 'Surface Preparation & Repair',
        description: 'Prepare and repair concrete surfaces',
        details: 'We repair concrete cracks and spalls, clean and prepare surfaces through shot blasting or grinding, and ensure proper substrate conditions for coating application.'
      },
      {
        step: 3,
        title: 'Coating Application',
        description: 'Apply heavy-duty protective systems',
        details: 'We apply specialized parking garage coatings including primers, base coats, and traffic coatings designed to withstand vehicle traffic, de-icing salts, and moisture.'
      },
      {
        step: 4,
        title: 'Striping & Final Protection',
        description: 'Complete with line striping and sealing',
        details: 'We apply high-visibility line striping, stall markings, and signage, then seal the system to ensure long-lasting protection and safe, organized parking.'
      }
    ],
    quickFacts: {
      projectTypes: ['Underground Parkades', 'Above-Ground Structures', 'Commercial Parking', 'Residential Garages', 'Public Facilities'],
      timeline: '3-8 weeks depending on size',
      certifications: ['Concrete Restoration Certified', 'Coating Manufacturer Approved', 'Safety Compliance']
    }
  }
];

// Exterior Cladding Variants
export const claddingVariants = [
  {
    id: 'siding',
    title: 'Siding Systems',
    tagline: 'Traditional & Modern Siding Solutions',
    description: 'Expert installation of vinyl, fiber cement, wood, and composite siding systems. Enhance your building\'s curb appeal while protecting your investment.',
    benefits: [
      'Wide range of siding materials and styles',
      'Improved energy efficiency',
      'Weather and moisture protection',
      'Low maintenance solutions',
      'Manufacturer warranties',
      'Professional installation expertise'
    ],
    process: [
      {
        step: 1,
        title: 'Material Selection & Planning',
        description: 'Choose the right siding',
        details: 'We help you select the ideal siding material based on your building style, budget, and performance requirements, then plan the installation logistics.'
      },
      {
        step: 2,
        title: 'Existing Siding Removal',
        description: 'Safe removal and disposal',
        details: 'If replacing existing siding, we carefully remove old materials, inspect the building envelope, and address any underlying issues before installation.'
      },
      {
        step: 3,
        title: 'Installation',
        description: 'Professional siding application',
        details: 'Our certified installers apply your new siding using manufacturer-approved methods, ensuring proper weatherproofing and long-term performance.'
      },
      {
        step: 4,
        title: 'Finishing & Inspection',
        description: 'Complete the transformation',
        details: 'We install trim, seal joints, conduct a final inspection, and ensure your new siding is ready to protect and beautify your building for years to come.'
      }
    ],
    quickFacts: {
      projectTypes: ['Residential Homes', 'Multi-Unit Buildings', 'Commercial Facilities', 'Heritage Restoration'],
      timeline: '2-6 weeks depending on size',
      certifications: ['Manufacturer Certified', 'Building Envelope Specialist', 'WSIB & Insured']
    }
  },
  {
    id: 'metal-cladding',
    title: 'Metal Cladding & Panels',
    tagline: 'Modern Metal Cladding Systems',
    description: 'Contemporary metal panel systems including standing seam, corrugated metal, and architectural panel installations for modern buildings.',
    benefits: [
      'Contemporary aesthetic appeal',
      'Exceptional durability and longevity',
      'Fire-resistant properties',
      'Recyclable and sustainable',
      'Low maintenance requirements',
      'Wide range of colors and finishes'
    ],
    process: [
      {
        step: 1,
        title: 'Design & Engineering',
        description: 'Plan your metal cladding system',
        details: 'We work with architects and engineers to design a metal cladding system that meets structural, aesthetic, and performance requirements.'
      },
      {
        step: 2,
        title: 'Substrate Preparation',
        description: 'Prepare the building envelope',
        details: 'We ensure the substrate is properly prepared with appropriate moisture barriers, insulation, and structural support for the metal panel system.'
      },
      {
        step: 3,
        title: 'Panel Installation',
        description: 'Precision metal fabrication',
        details: 'Our skilled teams install metal panels using specialized tools and techniques, ensuring proper alignment, weatherproofing, and fastening.'
      },
      {
        step: 4,
        title: 'Sealing & Quality Control',
        description: 'Final sealing and inspection',
        details: 'We seal all joints, install flashings, and conduct thorough quality inspections to ensure your metal cladding system performs flawlessly.'
      }
    ],
    quickFacts: {
      projectTypes: ['Commercial Buildings', 'Industrial Facilities', 'Modern Residential', 'Institutional Buildings'],
      timeline: '4-12 weeks for large projects',
      certifications: ['Metal Construction Certified', 'Welding Certified', 'Engineered Systems']
    }
  }
];

// Interior Buildouts Variants
export const interiorbuildoutsVariants = [
  {
    id: 'buildouts',
    title: 'Suite Buildouts',
    tagline: 'Complete Tenant Improvement Solutions',
    description: 'Ground-up interior construction for commercial and residential spaces. From framing to finishes, we deliver turnkey suite buildouts.',
    benefits: [
      'Complete project management',
      'Design-build capabilities',
      'Coordination with trades',
      'On-time, on-budget delivery',
      'Code compliance expertise',
      'Quality craftsmanship'
    ],
    process: [
      {
        step: 1,
        title: 'Planning & Permitting',
        description: 'Design and approval phase',
        details: 'We work with your architect and engineers to finalize plans, obtain permits, and establish a detailed construction schedule.'
      },
      {
        step: 2,
        title: 'Framing & Rough-Ins',
        description: 'Structure and systems',
        details: 'Our teams frame walls, coordinate mechanical/electrical/plumbing rough-ins, and prepare the space for drywall and finishes.'
      },
      {
        step: 3,
        title: 'Drywall & Finishing',
        description: 'Interior surface completion',
        details: 'We install and finish drywall to smooth perfection, preparing surfaces for paint and creating the canvas for your final finishes.'
      },
      {
        step: 4,
        title: 'Final Finishes & Handover',
        description: 'Complete the space',
        details: 'We install final finishes including flooring, paint, trim, and fixtures, then conduct final inspections before handing over your completed space.'
      }
    ],
    quickFacts: {
      projectTypes: ['Office Fit-Outs', 'Retail Spaces', 'Medical Suites', 'Restaurant Build-Outs', 'Residential Units'],
      timeline: '6-16 weeks typical',
      certifications: ['General Contractor License', 'All Trades Coordinated', 'Fully Insured']
    }
  },
  {
    id: 'drywall',
    title: 'Drywall & Finishing',
    tagline: 'Expert Drywall Installation & Finishing',
    description: 'Professional drywall hanging, taping, mudding, and finishing services for new construction, renovations, and repairs.',
    benefits: [
      'Smooth, flawless finishes',
      'Fast, efficient installation',
      'Expert repair capabilities',
      'Multiple finish levels available',
      'Dust control measures',
      'Experienced finishing crews'
    ],
    process: [
      {
        step: 1,
        title: 'Measurement & Material Prep',
        description: 'Plan the drywall installation',
        details: 'We measure spaces precisely, calculate materials, and prepare the site for efficient drywall installation.'
      },
      {
        step: 2,
        title: 'Hanging',
        description: 'Professional drywall installation',
        details: 'Our skilled crews hang drywall sheets using proper techniques for structural integrity and minimal seams.'
      },
      {
        step: 3,
        title: 'Taping & Mudding',
        description: 'Multiple coat application',
        details: 'We apply tape and multiple coats of joint compound, sanding between coats to achieve your desired finish level.'
      },
      {
        step: 4,
        title: 'Final Sanding & Inspection',
        description: 'Smooth finish ready for paint',
        details: 'We sand surfaces to perfection, clean thoroughly, and inspect to ensure walls and ceilings are ready for primer and paint.'
      }
    ],
    quickFacts: {
      projectTypes: ['New Construction', 'Renovations', 'Repairs', 'Ceiling Installation', 'Soundproofing'],
      timeline: '1-3 weeks for most projects',
      certifications: ['Journeyman Certified', 'Level 5 Finish Capable', 'WSIB Certified']
    }
  }
];

// Building Envelope Systems Variants
export const buildingEnvelopeVariants = [
  {
    id: 'stucco-eifs',
    title: 'Stucco & EIFS',
    tagline: 'Premium Stucco & EIFS Installation',
    description: 'Expert application of traditional stucco and modern EIFS (Exterior Insulation and Finish System). Transform your building\'s exterior with durable, attractive finishes that provide excellent insulation and weather resistance.',
    benefits: [
      'Superior weather resistance',
      'Enhanced energy efficiency',
      'Attractive, customizable finishes',
      'Crack repair and color matching',
      'Manufacturer-certified installation',
      'Long-lasting durability'
    ],
    process: [
      {
        step: 1,
        title: 'Surface Assessment & Design',
        description: 'Evaluate and plan your exterior',
        details: 'We assess the building substrate, evaluate moisture protection needs, and design a stucco or EIFS system that meets structural and aesthetic requirements.'
      },
      {
        step: 2,
        title: 'Substrate Preparation',
        description: 'Prepare the building envelope',
        details: 'We install or repair weather barriers, moisture protection layers, and ensure proper structural support for the stucco or EIFS system.'
      },
      {
        step: 3,
        title: 'Base Coat Application',
        description: 'Apply reinforced base layers',
        details: 'For EIFS, we install insulation boards and apply reinforced base coats. For stucco, we apply scratch and brown coats, ensuring proper cure times between applications.'
      },
      {
        step: 4,
        title: 'Finish Coat & Detailing',
        description: 'Complete with color and texture',
        details: 'We apply the final finish coat in your chosen color and texture, install trim and details, and ensure all joints are properly sealed for lasting protection.'
      }
    ],
    quickFacts: {
      projectTypes: ['Commercial Buildings', 'Residential Homes', 'Multi-Unit Properties', 'Heritage Restoration', 'New Construction'],
      timeline: '4-10 weeks depending on scope',
      certifications: ['EIFS Manufacturer Certified', 'Stucco Trade Certified', 'Building Envelope Specialist']
    }
  },
  {
    id: 'sealants',
    title: 'Sealants & Caulking',
    tagline: 'Professional Weatherproofing Solutions',
    description: 'Complete caulking and sealant services including waterproofing, air sealing, joint sealing, and building envelope protection. Protect your building from water infiltration and air leakage.',
    benefits: [
      'Prevent water infiltration',
      'Improve energy efficiency',
      'Extend building lifespan',
      'Multiple sealant types for every application',
      'Warranty-backed installations',
      'Expert joint design consultation'
    ],
    process: [
      {
        step: 1,
        title: 'Joint Inspection & Analysis',
        description: 'Assess existing sealant conditions',
        details: 'We inspect all building joints, identify failed sealants, evaluate joint design, and determine the appropriate sealant materials for each application.'
      },
      {
        step: 2,
        title: 'Removal & Surface Prep',
        description: 'Remove old sealant and prepare joints',
        details: 'We carefully remove deteriorated sealant, clean joint surfaces, install backer rods where needed, and ensure proper joint dimensions for new sealant.'
      },
      {
        step: 3,
        title: 'Sealant Application',
        description: 'Apply new weatherproofing sealants',
        details: 'We apply high-performance sealants using professional techniques, ensuring proper adhesion, tooling, and joint fill to create lasting weatherproof seals.'
      },
      {
        step: 4,
        title: 'Quality Inspection & Testing',
        description: 'Verify seal integrity',
        details: 'We inspect all sealed joints for proper adhesion and finish, conduct water testing where applicable, and provide documentation of completed work.'
      }
    ],
    quickFacts: {
      projectTypes: ['Window & Door Perimeters', 'Expansion Joints', 'Building Panels', 'Roof Penetrations', 'Curtain Walls'],
      timeline: '1-4 weeks typical',
      certifications: ['Sealant Manufacturer Approved', 'Building Envelope Certified', 'Warranty Backed']
    }
  }
];
