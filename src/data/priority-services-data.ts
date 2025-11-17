import { 
  Paintbrush, 
  Building2, 
  Home, 
  Building, 
  Hammer,
  Shield,
  Clock,
  Award,
  DollarSign,
  Users,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Heart,
  Wrench,
  Settings,
  Zap,
  Leaf
} from 'lucide-react';
import type { ServicePageTemplateProps } from '@/components/services/ServicePageTemplate';
import { serviceFAQs } from './service-faqs-enriched';

export const priorityServicesData: Record<string, ServicePageTemplateProps['service']> = {
  'commercial-painting': {
    slug: 'commercial-painting',
    name: 'Commercial Construction & Finishing',
    category: 'Construction Services',
    tagline: 'Prime specialty contractor for commercial building envelope and restoration across Ontario',
    description: 'Transform your commercial facility with comprehensive specialty contracting services including façade restoration, waterproofing systems, and protective coatings. Serving developers, property managers, and building owners throughout Toronto and the GTA with proven expertise in multi-trade execution and zero-disruption project delivery.',
    longDescription: 'Ascent Group Construction delivers commercial building envelope solutions through self-performed specialty trades, eliminating subcontractor layers that cause delays and quality issues. Our in-house crews execute 85% of project scope directly—from EIFS and masonry restoration to structural waterproofing and parking garage rehabilitation. This integrated approach provides schedule certainty (95% on-time completion vs. 65% industry average), cost efficiency (no subcontractor markup), and single-point accountability. We specialize in occupied building work with flexible scheduling (after-hours, weekends, phased execution) that minimizes tenant disruption while maintaining strict safety protocols. Projects include high-rise façade remediation, parking structure restoration, sealant replacement programs, and emergency leak response. Comprehensive structural engineering support, municipal permitting experience, and 25-year system warranties included.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Clock,
        title: 'Minimal Downtime',
        description: 'Flexible scheduling and efficient execution to keep your business running smoothly during the project'
      },
      {
        icon: Award,
        title: 'Professional Results',
        description: 'Commercial-grade finishes that enhance your brand image and create a welcoming environment'
      },
      {
        icon: Shield,
        title: 'Durability',
        description: 'High-performance materials designed to withstand heavy traffic and frequent use'
      },
      {
        icon: CheckCircle,
        title: 'Safety Compliance',
        description: 'Full adherence to commercial safety standards and regulations'
      },
      {
        icon: DollarSign,
        title: 'Budget Certainty',
        description: 'Transparent pricing with no hidden costs or surprise charges'
      },
      {
        icon: Shield,
        title: 'Warranty Protection',
        description: 'Comprehensive warranty coverage for materials and workmanship'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Site Assessment & Planning',
        description: 'Comprehensive evaluation of your facility',
        details: 'We conduct a thorough site assessment to understand your specific needs, define the project scope, and create a detailed schedule that minimizes operational impact. Our team coordinates with your facilities manager to ensure seamless integration with your business operations.'
      },
      {
        step: 2,
        title: 'Surface Preparation',
        description: 'Professional cleaning, repairs, and priming',
        details: 'Using commercial-grade materials and equipment, we prepare all surfaces meticulously. This includes cleaning, minor repairs, filling imperfections, and applying appropriate primers to ensure optimal paint adhesion and longevity.'
      },
      {
        step: 3,
        title: 'Premium Execution',
        description: 'High-quality construction with attention to detail',
        details: 'Our skilled professionals execute work using advanced techniques and commercial-grade products. We maintain strict timelines while ensuring even coverage, clean lines, and a flawless finish that enhances your commercial space.'
      },
      {
        step: 4,
        title: 'Quality Control',
        description: 'Thorough inspection and touch-ups',
        details: 'Before project completion, our quality control team conducts a comprehensive inspection. We address any touch-ups immediately and perform a final walkthrough with you to ensure complete satisfaction and a flawless finish.'
      }
    ],
    quickFacts: {
      projectTypes: [
        'Office buildings and corporate spaces',
        'Retail stores and shopping centers',
        'Warehouses and industrial facilities',
        'Healthcare facilities and medical offices',
        'Educational institutions',
        'Hospitality venues and restaurants'
      ],
      timeline: '3-5 days for most commercial projects',
      serviceArea: 'Greater Toronto Area and surrounding Ontario regions',
      certifications: [
        'WSIB Compliant',
        'Full Liability Insurance',
        'Lead-Safe Certified',
        'Low-VOC Paint Certified'
      ]
    },
    relatedServices: [
      {
        slug: 'residential-construction',
        name: 'Residential Construction',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'condo-multi-unit',
        name: 'Condo & Multi-Unit Construction',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'drywall-finishing',
        name: 'Drywall Finishing',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Ascent Group completed our 15,000 sq ft office renovation over a weekend. Zero disruption to our operations and the quality exceeded expectations. Their team was professional, efficient, and delivered exactly what they promised.',
      author: 'Michael Chen',
      project: 'Office Tower Renovation',
      location: 'Downtown Toronto'
    },
    faqs: serviceFAQs['commercial-painting'] || []
  },

  'condo-multi-unit': {
    slug: 'condo-multi-unit',
    name: 'Condo & Multi-Unit Construction',
    category: 'Construction Services',
    tagline: 'Specialized construction for condos, apartments, and multi-residential buildings',
    description: 'Expert construction services for multi-unit residential properties with coordinated scheduling, efficient execution, and minimal resident disruption.',
    longDescription: 'We specialize in condo and multi-unit residential construction with extensive experience in coordinating large-scale projects across multiple units. Our team understands the unique challenges of multi-residential properties, including scheduling coordination with property managers, compliance with condo bylaws, and minimizing disruption to residents. We provide comprehensive project management, efficient crew deployment, and consistent quality across all units. Whether it\'s common area refreshes, individual unit turnover, or building-wide exterior construction, we deliver exceptional results on time and within budget.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Users,
        title: 'Resident-Focused',
        description: 'Minimal disruption with flexible scheduling and proactive communication with residents'
      },
      {
        icon: Building,
        title: 'Multi-Unit Expertise',
        description: 'Specialized experience managing large-scale projects across multiple units simultaneously'
      },
      {
        icon: CheckCircle,
        title: 'Consistent Quality',
        description: 'Uniform finish and color matching across all units for cohesive appearance'
      },
      {
        icon: Settings,
        title: 'Condo Compliance',
        description: 'Full adherence to condo regulations, bylaws, and property management requirements'
      },
      {
        icon: Clock,
        title: 'Efficient Scheduling',
        description: 'Coordinated timelines that work with property management and resident schedules'
      },
      {
        icon: DollarSign,
        title: 'Volume Pricing',
        description: 'Competitive rates for multi-unit projects with transparent pricing structure'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Property Assessment',
        description: 'Comprehensive evaluation and planning',
        details: 'We meet with property managers and condo boards to assess the scope, discuss scheduling requirements, review bylaws and regulations, and create a detailed project plan that minimizes resident disruption.'
      },
      {
        step: 2,
        title: 'Resident Communication',
        description: 'Proactive scheduling and notifications',
        details: 'We coordinate with property management to communicate timelines to residents, schedule unit access, and provide clear expectations. Residents receive advance notice and our team maintains professional, respectful interactions.'
      },
      {
        step: 3,
        title: 'Systematic Execution',
        description: 'Efficient multi-unit construction',
        details: 'Our crews work systematically through units using consistent techniques and materials. We maintain organized workflows, protect common areas, and ensure uniform quality across all spaces while adhering to the project timeline.'
      },
      {
        step: 4,
        title: 'Quality Verification',
        description: 'Unit-by-unit inspection and approval',
        details: 'Each completed unit undergoes thorough inspection before final approval. We coordinate with property management for walkthroughs, address any concerns immediately, and ensure complete satisfaction before moving to the next phase.'
      }
    ],
    quickFacts: {
      projectTypes: [
        'Condo common area finishing',
        'Individual unit turnover',
        'Building exterior construction',
        'Hallway and corridor finishes',
        'Parking garage systems',
        'Amenity space renovations'
      ],
      timeline: '1-4 weeks depending on building size and unit count',
      serviceArea: 'GTA including Toronto, Mississauga, Brampton, Vaughan, and surrounding areas',
      certifications: [
        'Multi-Residential Specialists',
        'Condo Board Approved',
        'WSIB Compliant',
        'Fully Insured'
      ]
    },
    relatedServices: [
      {
        slug: 'commercial-painting',
        name: 'Commercial Painting',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'residential-painting',
        name: 'Commercial Construction',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'parking-garage-restoration',
        name: 'Parking Garage Restoration',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Managing a 200-unit condo building renovation project seemed overwhelming, but Ascent Group made it seamless. They coordinated everything perfectly, communicated clearly with residents, and delivered consistent quality throughout. Highly recommended for any multi-unit property.',
      author: 'David Thompson',
      project: 'Condo Building Renovation',
      location: 'North York'
    },
    faqs: serviceFAQs['condo-multi-unit'] || []
  },

  'exterior-siding': {
    slug: 'exterior-siding',
    name: 'Exterior Siding',
    category: 'Exterior Systems',
    tagline: 'Professional siding installation and repair for lasting protection',
    description: 'Expert exterior siding services including installation, repair, and replacement for vinyl, fiber cement, wood, and engineered siding systems.',
    longDescription: 'Our exterior siding services provide comprehensive solutions to protect and beautify your building\'s exterior. We specialize in all types of siding materials including vinyl, fiber cement, wood, and engineered products. Our experienced installers ensure proper installation techniques that maximize durability, energy efficiency, and weather resistance. Whether you need complete siding replacement, repairs, or new installation, we deliver quality workmanship backed by manufacturer warranties and our commitment to excellence. We use advanced installation methods and premium materials to ensure your siding performs beautifully for decades.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Weather Protection',
        description: 'Premium siding systems protect your building from moisture, wind, and environmental damage'
      },
      {
        icon: Home,
        title: 'Enhanced Aesthetics',
        description: 'Modern siding options dramatically improve curb appeal and property value'
      },
      {
        icon: DollarSign,
        title: 'Energy Efficiency',
        description: 'Proper siding installation with insulation reduces heating and cooling costs'
      },
      {
        icon: Clock,
        title: 'Low Maintenance',
        description: 'Quality siding materials require minimal maintenance while looking great for years'
      },
      {
        icon: Award,
        title: 'Expert Installation',
        description: 'Professional installation techniques ensure long-term performance and durability'
      },
      {
        icon: CheckCircle,
        title: 'Warranty Protection',
        description: 'Manufacturer warranties plus our workmanship guarantee provide complete peace of mind'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Material Selection',
        description: 'Expert consultation on siding options',
        details: 'We help you select the ideal siding material and style for your building, considering aesthetics, budget, maintenance requirements, and climate considerations. We provide samples and detailed information on all options.'
      },
      {
        step: 2,
        title: 'Surface Preparation',
        description: 'Thorough preparation and repairs',
        details: 'We remove old siding if needed, inspect and repair underlying structure, install proper moisture barriers and insulation, and ensure a solid foundation for your new siding system.'
      },
      {
        step: 3,
        title: 'Professional Installation',
        description: 'Expert siding installation',
        details: 'Our certified installers follow manufacturer specifications and industry best practices. We ensure proper alignment, secure fastening, correct overlaps, and weathertight seals for optimal performance and appearance.'
      },
      {
        step: 4,
        title: 'Finishing & Inspection',
        description: 'Trim installation and quality verification',
        details: 'We install trim, soffits, and fascia for a complete, polished look. Our final inspection verifies proper installation, addresses any details, and ensures you\'re completely satisfied with the result.'
      }
    ],
    quickFacts: {
      projectTypes: [
        'Vinyl siding installation',
        'Fiber cement siding',
        'Wood and cedar siding',
        'Engineered wood siding',
        'Siding repair and replacement',
        'Trim and soffit installation'
      ],
      timeline: '1-3 weeks for typical residential projects',
      serviceArea: 'GTA and Southern Ontario',
      certifications: [
        'Certified Siding Installers',
        'Manufacturer Approved',
        'WSIB Compliant',
        'Fully Insured'
      ]
    },
    relatedServices: [
      {
        slug: 'stucco-installation',
        name: 'Stucco Installation',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'masonry-repair',
        name: 'Masonry Repair',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'metal-cladding',
        name: 'Metal Cladding',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'The transformation is incredible! Our home looks modern and beautiful. The Ascent team was professional, completed the work efficiently, and the quality of installation is outstanding. Best decision we made for our home.',
      author: 'Robert Anderson',
      project: 'Full Home Siding Replacement',
      location: 'Aurora'
    },
    faqs: serviceFAQs['exterior-siding'] || []
  },

  'stucco-eifs': {
    slug: 'stucco-eifs',
    name: 'Stucco & EIFS',
    category: 'Exterior Systems',
    tagline: 'Expert stucco and EIFS installation, repair, and restoration services',
    description: 'Specialized in traditional stucco and modern EIFS systems with comprehensive installation, repair, and waterproofing solutions.',
    longDescription: 'Our stucco and EIFS expertise covers everything from traditional three-coat stucco to modern synthetic systems. We provide complete installation, repair, and restoration services with focus on proper moisture management and long-term durability. Whether restoring historic stucco or installing energy-efficient EIFS, our certified technicians deliver superior results.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Moisture Protection',
        description: 'Advanced waterproofing techniques that prevent moisture intrusion and ensure long-lasting performance.'
      },
      {
        icon: Award,
        title: 'EIFS Certified',
        description: 'Factory-trained technicians certified in all major EIFS systems and manufacturers.'
      },
      {
        icon: Wrench,
        title: 'Repair Specialists',
        description: 'Expert diagnosis and repair of stucco failures, cracks, and moisture damage.'
      },
      {
        icon: Paintbrush,
        title: 'Custom Finishes',
        description: 'Wide range of textures, colors, and architectural details to match any design vision.'
      },
      {
        icon: Building,
        title: 'All Building Types',
        description: 'Experience with residential, commercial, and heritage buildings of all sizes.'
      },
      {
        icon: CheckCircle,
        title: 'System Warranty',
        description: 'Comprehensive warranties covering materials and installation workmanship.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'System Evaluation',
        description: 'Detailed inspection and moisture assessment',
        details: 'We thoroughly inspect existing conditions, using moisture meters and thermal imaging to detect hidden issues. Our assessment includes substrate evaluation, identifying failure points, and determining the optimal repair or installation approach for your specific situation.'
      },
      {
        step: 2,
        title: 'Preparation & Detailing',
        description: 'Critical substrate prep and waterproofing installation',
        details: 'Proper preparation is key to stucco success. We ensure substrates are sound, install comprehensive flashing systems, and apply appropriate weather barriers. All penetrations, transitions, and details receive special attention for complete moisture protection.'
      },
      {
        step: 3,
        title: 'Application & Finishing',
        description: 'Expert installation with precision craftsmanship',
        details: 'Our skilled crews apply stucco or EIFS systems following manufacturer specifications and industry standards. Multiple coats are properly cured between applications. We create uniform textures and clean architectural details that enhance your building\'s appearance.'
      },
      {
        step: 4,
        title: 'Quality Verification',
        description: 'Comprehensive inspection and performance testing',
        details: 'Final inspection includes thickness verification, bond testing, and visual quality checks. We provide documentation of all work performed and guidance on maintenance practices to ensure decades of trouble-free performance.'
      }
    ],
    quickFacts: {
      projectTypes: ['EIFS Installation', 'Traditional Stucco', 'Repair & Restoration', 'Historic Matching'],
      timeline: '3-6 weeks typical projects',
      serviceArea: 'GTA and surrounding regions',
      certifications: ['EIFS Industry Members Association', 'Dryvit Certified', 'STO Approved Contractor']
    },
    relatedServices: [
      {
        slug: 'exterior-siding',
        name: 'Exterior Siding',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'waterproofing',
        name: 'Waterproofing',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'masonry',
        name: 'Masonry Repair',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'After years of moisture problems, this team properly diagnosed and repaired our EIFS system. The attention to detail in waterproofing was impressive. No more leaks and the building looks fantastic.',
      author: 'David Chen',
      project: 'Condo EIFS Restoration',
      location: 'Markham'
    }
  },

  'masonry': {
    slug: 'masonry',
    name: 'Masonry Repair & Restoration',
    category: 'Exterior Systems',
    tagline: 'Professional masonry repair and heritage restoration services',
    description: 'Expert repair, restoration, and maintenance of brick, stone, and concrete masonry for all building types.',
    longDescription: 'Our masonry specialists bring decades of experience in structural repairs, heritage restoration, and preventive maintenance. We work with all masonry materials including brick, stone, concrete block, and terra cotta. From tuckpointing to complete facade restoration, we preserve the integrity and beauty of your masonry structures.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Building,
        title: 'Structural Expertise',
        description: 'Licensed masons skilled in both cosmetic restoration and structural masonry repairs.'
      },
      {
        icon: Award,
        title: 'Heritage Specialists',
        description: 'Experienced in historic restoration with proper mortar matching and traditional techniques.'
      },
      {
        icon: Shield,
        title: 'Waterproofing',
        description: 'Comprehensive moisture protection to prevent further deterioration and damage.'
      },
      {
        icon: Wrench,
        title: 'Complete Solutions',
        description: 'From minor tuckpointing to full facade rebuilds, we handle all masonry needs.'
      },
      {
        icon: Clock,
        title: 'Preventive Care',
        description: 'Regular maintenance programs that extend the life of your masonry and prevent costly repairs.'
      },
      {
        icon: CheckCircle,
        title: 'Quality Materials',
        description: 'Premium mortars, sealants, and materials that match existing work and exceed standards.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Masonry Assessment',
        description: 'Comprehensive structural and condition evaluation',
        details: 'Our licensed masons conduct detailed inspections, identifying deterioration, structural issues, and failure causes. We assess mortar condition, check for movement or cracking, evaluate brick/stone condition, and determine appropriate repair strategies.'
      },
      {
        step: 2,
        title: 'Material Matching',
        description: 'Custom mortar analysis and material selection',
        details: 'For restoration work, we analyze existing mortars to create perfect matches in color, strength, and composition. We source matching brick or stone as needed and select appropriate sealants and repair materials for lasting compatibility.'
      },
      {
        step: 3,
        title: 'Expert Restoration',
        description: 'Skilled craftsmen performing precise repairs',
        details: 'Our master masons carefully remove deteriorated materials, prepare surfaces properly, and rebuild using proven techniques. We ensure proper curing, maintain consistent joint profiles, and match existing masonry aesthetics throughout the restoration.'
      },
      {
        step: 4,
        title: 'Protection & Sealing',
        description: 'Comprehensive finishing and preservation',
        details: 'We apply breathable sealers where appropriate, install or restore flashing systems, and verify all joints are properly filled. Final inspection ensures structural integrity and aesthetic quality while providing maintenance recommendations.'
      }
    ],
    quickFacts: {
      projectTypes: ['Tuckpointing', 'Brick Replacement', 'Stone Restoration', 'Structural Repairs'],
      timeline: '1-6 weeks based on scope',
      serviceArea: 'Greater Toronto Area',
      certifications: ['Licensed Masons', 'Heritage Restoration Certified', 'WSIB Compliant']
    },
    relatedServices: [
      {
        slug: 'waterproofing',
        name: 'Waterproofing',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'stucco-eifs',
        name: 'Stucco & EIFS',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'exterior-siding',
        name: 'Exterior Siding',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Outstanding restoration of our 1920s heritage building. They matched the original brick and mortar perfectly. True craftsmen who care about quality and historical accuracy.',
      author: 'Patricia Williams',
      project: 'Heritage Building Restoration',
      location: 'Toronto'
    }
  },

  'metal-cladding': {
    slug: 'metal-cladding',
    name: 'Metal Cladding & Panels',
    category: 'Exterior Systems',
    tagline: 'Modern metal cladding systems for commercial and industrial buildings',
    description: 'Professional installation of architectural metal panels, standing seam systems, and composite metal cladding.',
    longDescription: 'Specializing in contemporary metal cladding systems that provide superior durability, weather protection, and modern aesthetics. Our expertise includes aluminum composite panels, standing seam metal roofing, corrugated metal siding, and custom architectural metal systems. We deliver precision installation that meets stringent performance requirements.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Superior Durability',
        description: '50+ year lifespan with minimal maintenance and exceptional weather resistance.'
      },
      {
        icon: Zap,
        title: 'Modern Aesthetics',
        description: 'Clean, contemporary appearance with wide range of colors, finishes, and profiles.'
      },
      {
        icon: DollarSign,
        title: 'Cost Effective',
        description: 'Low lifecycle costs due to durability, minimal maintenance, and energy efficiency.'
      },
      {
        icon: Award,
        title: 'Precision Installation',
        description: 'Factory-trained installers ensuring proper performance and manufacturer warranties.'
      },
      {
        icon: Leaf,
        title: 'Sustainable Choice',
        description: 'Recyclable materials with high recycled content and energy-efficient properties.'
      },
      {
        icon: Clock,
        title: 'Fast Installation',
        description: 'Efficient installation process minimizes project timelines and disruption.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'System Design',
        description: 'Engineering and specification development',
        details: 'We work with architects and engineers to select optimal metal systems for your project. This includes panel profile selection, thermal performance analysis, structural considerations, and color/finish choices. Engineering drawings ensure proper installation and building code compliance.'
      },
      {
        step: 2,
        title: 'Preparation & Framing',
        description: 'Substrate preparation and support installation',
        details: 'Critical preparation includes verifying structural adequacy, installing proper weather barriers and insulation, and creating precise mounting systems. Our crews ensure all framing is level, plumb, and properly spaced for perfect panel alignment.'
      },
      {
        step: 3,
        title: 'Panel Installation',
        description: 'Precision mounting and weatherproofing',
        details: 'Expert installation of metal panels following manufacturer specifications and engineered shop drawings. We maintain precise alignment, ensure proper fastening and sealing, and integrate all flashing and trim details for complete weather protection.'
      },
      {
        step: 4,
        title: 'Quality Control',
        description: 'Final inspection and performance verification',
        details: 'Comprehensive review includes checking all fasteners, seals, and joints for proper installation. We verify alignment and finish quality, test for water penetration, and provide complete installation documentation and warranty information.'
      }
    ],
    quickFacts: {
      projectTypes: ['Commercial Buildings', 'Industrial Facilities', 'Office Towers', 'Retail Centers'],
      timeline: '4-12 weeks typical projects',
      serviceArea: 'Ontario-wide service',
      certifications: ['Kingspan Approved', 'Alucobond Certified', 'OMAA Member']
    },
    relatedServices: [
      {
        slug: 'roofing',
        name: 'Roofing Services',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'exterior-siding',
        name: 'Exterior Siding',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'commercial-painting',
        name: 'Commercial Painting',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'The metal panel installation transformed our facility. Professional crew, excellent coordination, and the building looks spectacular. The quality and precision exceeded our expectations.',
      author: 'James Morrison',
      project: 'Industrial Facility Renovation',
      location: 'Mississauga'
    }
  },

  'roofing': {
    slug: 'roofing',
    name: 'Roofing Services',
    category: 'Exterior Systems',
    tagline: 'Complete roofing solutions for commercial and industrial buildings',
    description: 'Professional roofing installation, repair, and maintenance for flat, low-slope, and steep-slope commercial roofing systems.',
    longDescription: 'Our roofing division provides comprehensive services for all commercial roofing types including TPO, EPDM, modified bitumen, built-up roofing, and metal roofing systems. We offer new installations, repairs, re-roofing, and preventive maintenance programs. With certified installers and manufacturer-backed warranties, we ensure your building stays protected.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Weather Protection',
        description: 'Superior waterproofing and wind resistance engineered for Ontario climate conditions.'
      },
      {
        icon: Award,
        title: 'Manufacturer Certified',
        description: 'Factory-trained crews authorized to install all major commercial roofing systems.'
      },
      {
        icon: DollarSign,
        title: 'Energy Efficient',
        description: 'Cool roof systems and proper insulation reduce energy costs year-round.'
      },
      {
        icon: Wrench,
        title: 'Emergency Service',
        description: '24/7 emergency response for leaks and storm damage with rapid mobilization.'
      },
      {
        icon: Clock,
        title: 'Preventive Programs',
        description: 'Regular maintenance extends roof life and prevents costly emergency repairs.'
      },
      {
        icon: CheckCircle,
        title: 'Long-Term Warranties',
        description: 'Comprehensive coverage up to 30 years on materials and workmanship.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Roof Evaluation',
        description: 'Comprehensive inspection and condition assessment',
        details: 'Our certified inspectors conduct thorough roof surveys using moisture detection, core sampling, and detailed documentation. We assess remaining service life, identify problem areas, evaluate drainage, and provide clear recommendations for repair or replacement.'
      },
      {
        step: 2,
        title: 'System Selection',
        description: 'Custom roofing solution design',
        details: 'Based on building type, budget, and performance requirements, we recommend optimal roofing systems. Presentations include lifecycle cost analysis, warranty options, energy performance data, and specification packages for all stakeholders.'
      },
      {
        step: 3,
        title: 'Professional Installation',
        description: 'Certified crews following best practices',
        details: 'We coordinate all aspects including protection of occupied spaces, removal and disposal of old roofing, proper deck repair and preparation, and precise installation of new roofing system. Daily cleanup maintains safe, professional work areas.'
      },
      {
        step: 4,
        title: 'Quality Assurance',
        description: 'Thorough testing and documentation',
        details: 'Final inspection includes water testing of all penetrations and seams, verification of proper installation details, documentation for warranty activation, and implementation of recommended maintenance program for long-term performance.'
      }
    ],
    quickFacts: {
      projectTypes: ['Flat Roofs', 'Low-Slope Systems', 'Metal Roofing', 'Emergency Repairs'],
      timeline: '1-4 weeks depending on size',
      serviceArea: 'Greater Toronto Area',
      certifications: ['GAF Master Elite', 'Firestone Master Contractor', 'RCABC Member']
    },
    relatedServices: [
      {
        slug: 'waterproofing',
        name: 'Waterproofing',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'metal-cladding',
        name: 'Metal Cladding',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'exterior-siding',
        name: 'Exterior Siding',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Fast, professional roof replacement with zero disruption to our operations. The crew was knowledgeable, efficient, and left our site cleaner than they found it. Highly recommended.',
      author: 'Robert Thompson',
      project: 'Warehouse Roof Replacement',
      location: 'Brampton'
    }
  },

  'waterproofing': {
    slug: 'waterproofing',
    name: 'Waterproofing & Restoration',
    category: 'Exterior Systems',
    tagline: 'Comprehensive waterproofing solutions for building envelope protection',
    description: 'Expert waterproofing services for foundations, balconies, parking garages, and building envelopes with proven moisture control systems.',
    longDescription: 'Specializing in complete waterproofing solutions that protect buildings from water damage and deterioration. Our services include foundation waterproofing, balcony and deck systems, parking structure restoration, and building envelope repairs. Using advanced materials and proven techniques, we provide long-lasting moisture protection.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Complete Protection',
        description: 'Comprehensive moisture barriers that prevent water intrusion and structural damage.'
      },
      {
        icon: Award,
        title: 'System Specialists',
        description: 'Certified installers of all major waterproofing manufacturers and systems.'
      },
      {
        icon: Wrench,
        title: 'Problem Solving',
        description: 'Expert diagnosis of complex moisture issues with proven remediation strategies.'
      },
      {
        icon: Building,
        title: 'All Structures',
        description: 'Experience with buildings of all types from residential to large commercial complexes.'
      },
      {
        icon: Clock,
        title: 'Fast Response',
        description: 'Rapid mobilization for emergency leaks with temporary and permanent solutions.'
      },
      {
        icon: CheckCircle,
        title: 'Guaranteed Results',
        description: 'Comprehensive warranties backing both materials and installation workmanship.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Moisture Investigation',
        description: 'Detailed leak detection and analysis',
        details: 'Using advanced tools including infrared cameras, moisture meters, and water testing, we identify all moisture sources and pathways. Detailed documentation shows existing conditions, failure points, and extent of damage requiring attention.'
      },
      {
        step: 2,
        title: 'Solution Design',
        description: 'Custom waterproofing system specification',
        details: 'Based on inspection findings, we design comprehensive waterproofing solutions using appropriate materials and methods. Specifications address all identified issues with redundant protection and long-term durability as primary goals.'
      },
      {
        step: 3,
        title: 'Expert Application',
        description: 'Certified installation of waterproofing systems',
        details: 'Our trained crews properly prepare surfaces, apply waterproofing materials according to manufacturer specifications, install proper drainage systems, and ensure complete protection at all penetrations and transitions.'
      },
      {
        step: 4,
        title: 'Performance Testing',
        description: 'Thorough verification and quality control',
        details: 'We conduct flood testing, inspect all details, verify proper drainage, and document installation. Final walkthrough includes maintenance recommendations to preserve waterproofing performance for decades.'
      }
    ],
    quickFacts: {
      projectTypes: ['Foundation Waterproofing', 'Balcony Systems', 'Parking Garages', 'Envelope Repairs'],
      timeline: '1-6 weeks typical projects',
      serviceArea: 'GTA and surrounding areas',
      certifications: ['Tremco Approved', 'Sika Certified', 'IIBEC Member']
    },
    relatedServices: [
      {
        slug: 'parking-garage',
        name: 'Parking Garage Coating',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'masonry',
        name: 'Masonry Repair',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'roofing',
        name: 'Roofing Services',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'After years of persistent leaking, this team finally solved our moisture problems. Thorough investigation, professional repairs, and no more leaks. Worth every penny for the peace of mind.',
      author: 'Lisa Anderson',
      project: 'Condo Balcony Waterproofing',
      location: 'North York'
    }
  },

  'sealants': {
    slug: 'sealants',
    name: 'Sealants & Caulking',
    category: 'Exterior Systems',
    tagline: 'Professional building sealant and caulking services',
    description: 'Expert installation of expansion joints, curtain wall seals, and weatherproofing caulking for commercial buildings.',
    longDescription: 'Specialized in high-performance sealant systems that protect building envelopes from water, air, and thermal infiltration. Our services include curtain wall sealing, expansion joint systems, perimeter caulking, and fire-rated sealants. We use premium materials and precise application techniques to ensure long-lasting weather protection.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Weather Sealing',
        description: 'Superior protection against water, air, and thermal infiltration.'
      },
      {
        icon: Award,
        title: 'High-Rise Expertise',
        description: 'Specialized in curtain wall systems and high-elevation work on towers and commercial buildings.'
      },
      {
        icon: Wrench,
        title: 'Restoration Services',
        description: 'Complete removal and replacement of failed sealants in existing buildings.'
      },
      {
        icon: CheckCircle,
        title: 'Premium Materials',
        description: 'Commercial-grade sealants from leading manufacturers with extended service life.'
      },
      {
        icon: Clock,
        title: 'Minimal Disruption',
        description: 'Efficient application methods that minimize impact on building occupants.'
      },
      {
        icon: Building,
        title: 'Code Compliance',
        description: 'All work meets fire rating requirements and building code standards.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Joint Assessment',
        description: 'Comprehensive evaluation of existing conditions',
        details: 'We inspect all joint locations, measure movement capabilities, identify substrate materials, and assess existing sealant condition. Testing determines compatibility requirements and appropriate sealant specifications.'
      },
      {
        step: 2,
        title: 'Surface Preparation',
        description: 'Critical cleaning and priming operations',
        details: 'Old sealant is completely removed, joints are cleaned to bare substrate, backer rod is properly sized and installed, and primers are applied where required. Proper prep ensures optimal sealant adhesion and performance.'
      },
      {
        step: 3,
        title: 'Sealant Application',
        description: 'Precision installation by skilled technicians',
        details: 'Premium sealants are installed using professional equipment ensuring proper depth-to-width ratios, complete joint filling, and smooth tooled finishes. Weather conditions are monitored to ensure optimal curing.'
      },
      {
        step: 4,
        title: 'Quality Verification',
        description: 'Inspection and documentation of completed work',
        details: 'Final inspection verifies complete adhesion, proper joint filling, uniform appearance, and correct installation details. Documentation includes product data sheets, warranty information, and maintenance recommendations.'
      }
    ],
    quickFacts: {
      projectTypes: ['Curtain Wall Sealing', 'Expansion Joints', 'Window Perimeters', 'Control Joints'],
      timeline: '1-4 weeks depending on scope',
      serviceArea: 'Greater Toronto Area',
      certifications: ['Sealant Waterproofing & Restoration Institute', 'IIBEC Member', 'Rope Access Certified']
    },
    relatedServices: [
      {
        slug: 'waterproofing',
        name: 'Waterproofing',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'windows-doors',
        name: 'Windows & Doors',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'exterior-siding',
        name: 'Exterior Siding',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Professional curtain wall re-caulking on our 20-story tower. The crew was efficient, safe, and thorough. No more air leaks and improved energy efficiency throughout the building.',
      author: 'Mark Stevens',
      project: 'Office Tower Envelope Restoration',
      location: 'Toronto'
    }
  },

  'parking-garage': {
    slug: 'parking-garage',
    name: 'Parking Garage Coating & Restoration',
    category: 'Specialty Services',
    tagline: 'Complete parking structure restoration and protective coating systems',
    description: 'Specialized parking garage restoration including concrete repair, traffic coatings, and comprehensive waterproofing solutions.',
    longDescription: 'Expert restoration of parking structures with focus on extending service life and protecting structural integrity. Our services include concrete repairs, expansion joint replacement, traffic membrane systems, and complete waterproofing. We minimize disruption while delivering durable solutions that protect your parking investment.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Structural Protection',
        description: 'Comprehensive repairs that stop deterioration and extend structure lifespan decades.'
      },
      {
        icon: Award,
        title: 'System Specialists',
        description: 'Certified in all major traffic coating and waterproofing systems for parking structures.'
      },
      {
        icon: Wrench,
        title: 'Complete Restoration',
        description: 'Full-scope services from concrete repair to final protective coatings and line striping.'
      },
      {
        icon: Clock,
        title: 'Phased Scheduling',
        description: 'Strategic project phasing maintains parking availability throughout restoration work.'
      },
      {
        icon: DollarSign,
        title: 'Cost Effective',
        description: 'Proactive restoration prevents expensive structural failures and extends asset life.'
      },
      {
        icon: CheckCircle,
        title: 'Long-Term Warranties',
        description: 'Comprehensive system warranties providing confidence in durability and performance.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Structure Assessment',
        description: 'Comprehensive condition survey and analysis',
        details: 'Detailed inspection documents all deterioration, delaminated concrete, cracking, and corrosion. We test concrete strength, map damage areas, evaluate drainage, and develop comprehensive repair specifications and cost estimates.'
      },
      {
        step: 2,
        title: 'Concrete Restoration',
        description: 'Structural repairs and surface preparation',
        details: 'Failed concrete is removed, reinforcing steel is cleaned or replaced, and structural repairs are performed using high-performance materials. Surfaces are properly prepared through shotblasting or grinding for coating adhesion.'
      },
      {
        step: 3,
        title: 'Coating Application',
        description: 'Installation of traffic membrane systems',
        details: 'Multi-layer traffic membrane systems are applied including primer, waterproofing layers, and wear surface. Expansion joints are replaced, proper drainage is ensured, and all details are carefully executed for complete protection.'
      },
      {
        step: 4,
        title: 'Final Finishing',
        description: 'Completion and quality verification',
        details: 'Final work includes line striping, signage installation, joint sealing, and thorough cleanup. Comprehensive inspection verifies all work meets specifications with complete documentation and warranty activation.'
      }
    ],
    quickFacts: {
      projectTypes: ['Above-Grade Decks', 'Below-Grade Structures', 'Ramps & Drive Lanes', 'Rooftop Parking'],
      timeline: '4-16 weeks depending on size',
      serviceArea: 'Ontario-wide service',
      certifications: ['ICRI Member', 'Dur-A-Flex Certified', 'Tennant Coatings Approved']
    },
    relatedServices: [
      {
        slug: 'waterproofing',
        name: 'Waterproofing',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'commercial-painting',
        name: 'Commercial Painting',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'general-contracting',
        name: 'General Contracting',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Excellent parking garage restoration. They coordinated perfectly to keep most spaces available during construction. The new coating looks great and we finally have no more leaks into the underground levels.',
      author: 'Jennifer Lee',
      project: 'Condominium Parking Restoration',
      location: 'Vaughan'
    }
  },


  'tile-flooring': {
    slug: 'tile-flooring',
    name: 'Tile & Flooring Installation',
    category: 'Specialty Services',
    tagline: 'Professional tile and flooring installation services',
    description: 'Expert installation of ceramic, porcelain, natural stone tile, and commercial flooring systems.',
    longDescription: 'Specialized in high-quality tile and flooring installation for commercial and residential projects. Our skilled installers work with all materials including ceramic, porcelain, natural stone, LVT, and specialty flooring. We deliver precision installation with proper substrate preparation and waterproofing for lasting beauty and performance.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Award,
        title: 'Expert Installation',
        description: 'Certified installers with decades of experience in all tile and flooring types.'
      },
      {
        icon: CheckCircle,
        title: 'Proper Preparation',
        description: 'Thorough substrate prep and waterproofing ensures long-lasting installations.'
      },
      {
        icon: Paintbrush,
        title: 'Design Expertise',
        description: 'Creative layout and pattern suggestions that enhance your space aesthetics.'
      },
      {
        icon: Shield,
        title: 'Waterproofing',
        description: 'Complete moisture protection systems for wet areas and high-moisture environments.'
      },
      {
        icon: Building,
        title: 'All Applications',
        description: 'Experience with floors, walls, showers, commercial spaces, and custom installations.'
      },
      {
        icon: Clock,
        title: 'Efficient Service',
        description: 'Professional crews completing quality installations on schedule with minimal disruption.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Surface Assessment',
        description: 'Substrate evaluation and preparation planning',
        details: 'We thoroughly inspect existing conditions, check for level and structural adequacy, test for moisture, and determine required preparation. Proper assessment ensures appropriate substrate treatment and installation methods.'
      },
      {
        step: 2,
        title: 'Substrate Preparation',
        description: 'Critical prep work and waterproofing',
        details: 'Surfaces are properly leveled, cracks repaired, and appropriate underlayments installed. Waterproofing membranes are applied in wet areas. Heating systems are installed if specified. Quality prep is key to long-lasting installations.'
      },
      {
        step: 3,
        title: 'Tile Installation',
        description: 'Precision setting and grouting',
        details: 'Tile is carefully laid maintaining consistent spacing and alignment. Premium thin-set mortars ensure proper adhesion. After proper cure time, professional grouting and sealing complete the installation with attention to every detail.'
      },
      {
        step: 4,
        title: 'Finishing & Protection',
        description: 'Final cleaning and care instructions',
        details: 'Thorough cleaning removes all haze and residue leaving surfaces pristine. Final inspection ensures quality meets standards. Complete care and maintenance instructions help preserve beauty and performance for years to come.'
      }
    ],
    quickFacts: {
      projectTypes: ['Bathrooms & Showers', 'Commercial Floors', 'Lobbies & Entrances', 'Kitchen Backsplashes'],
      timeline: '3 days to 3 weeks depending on scope',
      serviceArea: 'Greater Toronto Area',
      certifications: ['CTEF Certified', 'Schluter Systems Trained', 'WSIB Compliant']
    },
    relatedServices: [
      {
        slug: 'waterproofing',
        name: 'Waterproofing',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'drywall-finishing',
        name: 'Drywall Finishing',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'suite-buildouts',
        name: 'Suite Buildouts',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Beautiful tile work in our master ensuite. Perfect installation with no lippage, clean grout lines, and the waterproofing gives us complete confidence. True craftsmen who take pride in their work.',
      author: 'Amanda Wilson',
      project: 'Luxury Home Bathroom Renovation',
      location: 'Aurora'
    }
  },

  'windows-doors': {
    slug: 'windows-doors',
    name: 'Window & Door Installation',
    category: 'Specialty Services',
    tagline: 'Professional window and door installation services',
    description: 'Expert installation of commercial windows, doors, storefront systems, and curtain wall components.',
    longDescription: 'Specialized in commercial window and door installation including aluminum storefront, curtain wall, commercial entrances, and window wall systems. Our experienced crews ensure proper installation with focus on weatherproofing, energy efficiency, and long-term performance. We work with all major manufacturers and system types.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Shield,
        title: 'Weather Protection',
        description: 'Proper installation and sealing prevents air and water infiltration for decades.'
      },
      {
        icon: Award,
        title: 'Manufacturer Certified',
        description: 'Factory-trained installers authorized by major window and door manufacturers.'
      },
      {
        icon: Zap,
        title: 'Energy Efficient',
        description: 'Precision installation maximizes thermal performance and reduces energy costs.'
      },
      {
        icon: Building,
        title: 'All Systems',
        description: 'Experience with storefront, curtain wall, window wall, and specialty glazing systems.'
      },
      {
        icon: Clock,
        title: 'Minimal Disruption',
        description: 'Efficient installation methods minimize impact on building operations and occupants.'
      },
      {
        icon: CheckCircle,
        title: 'Code Compliant',
        description: 'All installations meet Ontario Building Code and energy efficiency requirements.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Site Measurement',
        description: 'Precise field verification and planning',
        details: 'Detailed measurements verify rough opening dimensions and conditions. We assess structural conditions, identify any issues requiring correction, and confirm system selection is appropriate. Accurate measurement prevents costly fit-up problems.'
      },
      {
        step: 2,
        title: 'Preparation & Framing',
        description: 'Opening preparation and backing installation',
        details: 'Rough openings are properly prepared with required backing, flashing, and weather barriers. Structural adequacy is verified and any deficiencies corrected. Proper preparation is critical for weatherproof installations.'
      },
      {
        step: 3,
        title: 'Installation & Sealing',
        description: 'Professional mounting and weatherproofing',
        details: 'Windows and doors are carefully installed maintaining proper alignment and clearances. Comprehensive sealing with quality sealants and weather stripping ensures complete air and water tightness. Hardware is properly adjusted for smooth operation.'
      },
      {
        step: 4,
        title: 'Testing & Inspection',
        description: 'Performance verification and quality control',
        details: 'Water testing verifies weatherproofing of all installations. Operation is checked and adjusted. Final inspection ensures quality workmanship and all details meet specifications. Documentation includes warranty information and care instructions.'
      }
    ],
    quickFacts: {
      projectTypes: ['Storefront Systems', 'Commercial Entrances', 'Window Replacement', 'Curtain Wall'],
      timeline: '1-8 weeks depending on scope',
      serviceArea: 'Ontario-wide service',
      certifications: ['AAMA Certified', 'Manufacturer Authorized', 'WSIB Compliant']
    },
    relatedServices: [
      {
        slug: 'sealants',
        name: 'Sealants & Caulking',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'exterior-siding',
        name: 'Exterior Siding',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'general-contracting',
        name: 'General Contracting',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Perfect storefront installation for our new retail location. Professional team, quality materials, and the entrance looks spectacular. Smooth operation and excellent weather sealing.',
      author: 'Sophia Martinez',
      project: 'Retail Storefront Installation',
      location: 'Toronto'
    }
  },


  'design-build': {
    slug: 'design-build',
    name: 'Design-Build Solutions',
    category: 'Construction Management',
    tagline: 'Integrated design-build services for streamlined project delivery',
    description: 'Complete design-build solutions that combine architectural design, engineering, and construction under one contract.',
    longDescription: 'Our design-build approach streamlines project delivery by integrating design and construction services. This single-source responsibility model improves communication, reduces risks, and accelerates schedules. From concept through completion, our integrated team delivers superior results with greater cost certainty and faster occupancy.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Users,
        title: 'Single Source',
        description: 'One contract, one team, one point of accountability for design and construction.'
      },
      {
        icon: Clock,
        title: 'Faster Delivery',
        description: 'Overlapping design and construction phases significantly reduces project timelines.'
      },
      {
        icon: DollarSign,
        title: 'Cost Certainty',
        description: 'Early budget development and value engineering provides predictable project costs.'
      },
      {
        icon: Award,
        title: 'Design Excellence',
        description: 'Experienced design team balances aesthetics, functionality, and buildability.'
      },
      {
        icon: Shield,
        title: 'Reduced Risk',
        description: 'Unified responsibility eliminates design-construction conflicts and finger-pointing.'
      },
      {
        icon: CheckCircle,
        title: 'Quality Focus',
        description: 'Integrated approach ensures constructability and quality throughout design process.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Concept Development',
        description: 'Collaborative programming and conceptual design',
        details: 'We work closely with you to understand project goals, functional requirements, and budget parameters. Our integrated team develops conceptual designs with construction input ensuring realistic budgets and schedules from the start.'
      },
      {
        step: 2,
        title: 'Design & Estimating',
        description: 'Detailed design with real-time cost feedback',
        details: 'Design development proceeds with continuous cost estimating and value engineering input. This iterative process ensures the final design meets your budget and schedule. Constructability reviews prevent future problems during construction.'
      },
      {
        step: 3,
        title: 'Preconstruction Services',
        description: 'Final engineering and construction planning',
        details: 'Detailed construction documents are completed, permits obtained, and long-lead items procured. Comprehensive construction planning including detailed schedules, safety plans, and quality programs prepares for efficient construction execution.'
      },
      {
        step: 4,
        title: 'Construction & Closeout',
        description: 'Build execution and project delivery',
        details: 'Our construction team builds what we designed, eliminating translation errors and conflicts. The designer remains engaged throughout construction ensuring design intent is maintained. Fast-track scheduling gets you operational sooner.'
      }
    ],
    quickFacts: {
      projectTypes: ['Commercial Buildings', 'Industrial Facilities', 'Institutional Projects', 'Build-to-Suit'],
      timeline: '20-30% faster than traditional',
      serviceArea: 'Ontario-wide service',
      certifications: ['DBIA Certified', 'LEED Accredited', 'Professional Engineers']
    },
    relatedServices: [
      {
        slug: 'construction-management',
        name: 'Construction Management',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'general-contracting',
        name: 'General Contracting',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'virtual-design-construction',
        name: 'Virtual Design & BIM',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'The design-build approach was perfect for our tight timeline. Having design and construction coordinated by one team eliminated conflicts and kept the project moving. Delivered on time and exceeded expectations.',
      author: 'Catherine Mitchell',
      project: 'Corporate Headquarters',
      location: 'Burlington'
    }
  },

  'preconstruction-services': {
    slug: 'preconstruction-services',
    name: 'Preconstruction & Advisory Services',
    category: 'Construction Management',
    tagline: 'Strategic preconstruction planning and cost consulting services',
    description: 'Expert preconstruction services including cost estimating, value engineering, scheduling, and constructability reviews.',
    longDescription: 'Comprehensive preconstruction services that set projects up for success. Our team provides detailed cost estimating, value engineering, scheduling analysis, and constructability reviews. Early involvement allows us to identify opportunities and risks, optimize designs for cost and schedule, and establish realistic project baselines.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: DollarSign,
        title: 'Accurate Budgets',
        description: 'Detailed cost estimating provides reliable budget forecasts and prevents surprises.'
      },
      {
        icon: Award,
        title: 'Value Engineering',
        description: 'Expert analysis identifies cost savings without compromising quality or function.'
      },
      {
        icon: Clock,
        title: 'Schedule Optimization',
        description: 'Realistic scheduling and planning ensures achievable project timelines.'
      },
      {
        icon: Wrench,
        title: 'Constructability Review',
        description: 'Builder input during design prevents costly issues during construction.'
      },
      {
        icon: Shield,
        title: 'Risk Assessment',
        description: 'Early identification of risks allows proactive mitigation and contingency planning.'
      },
      {
        icon: Users,
        title: 'Expert Advisory',
        description: 'Decades of construction experience informing better project decisions.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Project Assessment',
        description: 'Understanding scope, goals, and constraints',
        details: 'We review project documentation, meet with stakeholders, visit the site, and understand your objectives. This comprehensive assessment allows us to provide relevant, actionable guidance tailored to your specific project requirements and constraints.'
      },
      {
        step: 2,
        title: 'Cost Estimating',
        description: 'Detailed quantity takeoff and pricing',
        details: 'Our estimating team performs detailed quantity surveys and applies current market pricing. Estimates include all construction costs, contingencies, and escalation. Multiple estimate iterations track budget as design develops providing continuous cost feedback.'
      },
      {
        step: 3,
        title: 'Value Engineering',
        description: 'Identifying cost reduction opportunities',
        details: 'We analyze design elements for cost optimization opportunities. Alternative materials, systems, and methods are evaluated for cost impact versus functional and aesthetic considerations. Value engineering delivers savings without compromising project quality or goals.'
      },
      {
        step: 4,
        title: 'Planning & Recommendations',
        description: 'Comprehensive reporting and guidance',
        details: 'Detailed reports document all findings including cost estimates, value engineering recommendations, schedule analysis, and risk assessment. Clear recommendations help you make informed decisions about design direction, budget, and procurement strategy.'
      }
    ],
    quickFacts: {
      projectTypes: ['Budget Development', 'Value Engineering', 'Feasibility Studies', 'Schedule Analysis'],
      timeline: '2-6 weeks depending on scope',
      serviceArea: 'Ontario-wide service',
      certifications: ['Certified Cost Professional', 'PMP Certified', 'LEED Accredited']
    },
    relatedServices: [
      {
        slug: 'construction-management',
        name: 'Construction Management',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'design-build',
        name: 'Design-Build',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'general-contracting',
        name: 'General Contracting',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Their preconstruction input was invaluable. The value engineering saved us significant money while the constructability reviews prevented what would have been major issues. Money well spent.',
      author: 'Gregory Phillips',
      project: 'Medical Office Building',
      location: 'Kitchener'
    }
  },

  'virtual-design-construction': {
    slug: 'virtual-design-construction',
    name: 'Virtual Design & Construction (BIM)',
    category: 'Construction Management',
    tagline: 'Advanced BIM and virtual construction services',
    description: 'Building Information Modeling (BIM) and virtual construction services for improved coordination, planning, and execution.',
    longDescription: 'Leveraging Building Information Modeling and virtual construction technologies to improve project outcomes. Our BIM services include 3D modeling, clash detection, 4D scheduling, 5D cost estimating, and virtual design coordination. These advanced tools enhance collaboration, reduce errors, and optimize construction sequencing.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Award,
        title: 'BIM Expertise',
        description: 'Experienced BIM professionals using latest Revit, Navisworks, and coordination tools.'
      },
      {
        icon: Shield,
        title: 'Error Reduction',
        description: 'Virtual coordination detects and resolves conflicts before construction starts.'
      },
      {
        icon: Clock,
        title: '4D Scheduling',
        description: 'Visual construction sequencing optimizes schedules and logistics planning.'
      },
      {
        icon: DollarSign,
        title: '5D Cost Control',
        description: 'Model-based estimating provides accurate costs and tracks changes in real-time.'
      },
      {
        icon: Users,
        title: 'Enhanced Collaboration',
        description: 'Common data environment improves communication among all project stakeholders.'
      },
      {
        icon: CheckCircle,
        title: 'As-Built Models',
        description: 'Final BIM models provide valuable facility management data for building operations.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Model Development',
        description: '3D BIM model creation and coordination',
        details: 'We develop detailed 3D models of all building systems including architectural, structural, mechanical, electrical, and plumbing. Models are built to appropriate LOD levels and follow industry standards for interoperability and data exchange.'
      },
      {
        step: 2,
        title: 'Clash Detection',
        description: 'Virtual coordination and conflict resolution',
        details: 'All discipline models are coordinated using Navisworks or similar tools. Clashes between systems are identified and resolved virtually. Regular coordination meetings with all trades ensure conflicts are eliminated before installation begins.'
      },
      {
        step: 3,
        title: '4D/5D Analysis',
        description: 'Schedule and cost integration',
        details: 'Construction schedules are linked to BIM models for 4D visualization of construction sequencing. Cost data is integrated for 5D estimating and cost tracking. These tools optimize schedules, identify logistics challenges, and track project costs.'
      },
      {
        step: 4,
        title: 'Construction Support',
        description: 'Model utilization during construction',
        details: 'BIM models support field coordination, prefabrication, and quality control. Models are updated as construction progresses creating accurate as-built documentation. Final models provide facility management with valuable data for operations and maintenance.'
      }
    ],
    quickFacts: {
      projectTypes: ['Complex MEP Coordination', 'Prefabrication Support', 'Facility Management', 'Large Projects'],
      timeline: 'Integrated with project schedule',
      serviceArea: 'Ontario-wide service',
      certifications: ['Revit Certified', 'Navisworks Certified', 'BIM Management']
    },
    relatedServices: [
      {
        slug: 'design-build',
        name: 'Design-Build',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'construction-management',
        name: 'Construction Management',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'preconstruction-services',
        name: 'Preconstruction Services',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'BIM coordination saved our project from major MEP conflicts. The virtual coordination sessions identified issues that would have caused significant delays and costs. Highly recommended for complex projects.',
      author: 'Daniel Rodriguez',
      project: 'Research Laboratory',
      location: 'Waterloo'
    }
  },

  'sustainable-construction': {
    slug: 'sustainable-construction',
    name: 'Sustainable Building Services',
    category: 'Specialty Services',
    tagline: 'Green building and sustainable construction services',
    description: 'LEED consulting and sustainable construction services focused on environmental performance and energy efficiency.',
    longDescription: 'Comprehensive sustainable building services including LEED consulting, green building certification, energy modeling, and sustainable material selection. Our LEED Accredited Professionals guide projects through green building certification while our construction team implements sustainable practices that reduce environmental impact and operating costs.',
    heroImage: '/hero-construction.jpg',
    benefits: [
      {
        icon: Leaf,
        title: 'LEED Certified',
        description: 'LEED Accredited Professionals with extensive green building certification experience.'
      },
      {
        icon: DollarSign,
        title: 'Lower Operating Costs',
        description: 'Energy efficient systems and sustainable materials reduce long-term operating expenses.'
      },
      {
        icon: Award,
        title: 'Certification Support',
        description: 'Complete LEED documentation and submittal services for successful certification.'
      },
      {
        icon: Zap,
        title: 'Energy Optimization',
        description: 'Building envelope and systems design maximizes energy performance and comfort.'
      },
      {
        icon: Shield,
        title: 'Healthier Buildings',
        description: 'Low-VOC materials and improved indoor air quality create healthier environments.'
      },
      {
        icon: CheckCircle,
        title: 'Rebate Assistance',
        description: 'Help accessing utility rebates and government incentives for green building features.'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Goal Setting',
        description: 'Defining sustainability objectives and certification targets',
        details: 'We work with project teams to establish sustainability goals, select appropriate certification systems (LEED, WELL, etc.), and identify priority credit categories. Early goal-setting ensures sustainable features are integrated into design and budgeted appropriately.'
      },
      {
        step: 2,
        title: 'Design Integration',
        description: 'Sustainable strategies in design development',
        details: 'Our team provides guidance on sustainable materials, energy-efficient systems, water conservation strategies, and indoor environmental quality. We perform energy modeling, daylighting analysis, and other studies supporting certification requirements.'
      },
      {
        step: 3,
        title: 'Construction Implementation',
        description: 'Sustainable practices during construction',
        details: 'Green construction practices include waste diversion, indoor air quality management during construction, sustainable materials procurement, and commissioning. We document all activities required for certification submittals.'
      },
      {
        step: 4,
        title: 'Certification Support',
        description: 'Documentation and certification completion',
        details: 'Complete LEED documentation including all required forms, calculations, and supporting documentation. We manage submittal process, respond to reviewer comments, and guide projects through to successful certification achievement.'
      }
    ],
    quickFacts: {
      projectTypes: ['LEED Certification', 'Energy Audits', 'Green Renovations', 'Net-Zero Projects'],
      timeline: 'Integrated with project schedule',
      serviceArea: 'Ontario-wide service',
      certifications: ['LEED AP BD+C', 'WELL AP', 'Certified Energy Manager']
    },
    relatedServices: [
      {
        slug: 'design-build',
        name: 'Design-Build',
        image: '/project-commercial.jpg'
      },
      {
        slug: 'construction-management',
        name: 'Construction Management',
        image: '/project-industrial.jpg'
      },
      {
        slug: 'general-contracting',
        name: 'General Contracting',
        image: '/project-institutional.jpg'
      }
    ],
    testimonial: {
      quote: 'Achieved LEED Gold certification thanks to their expertise. They guided us through the entire process, from design integration to final documentation. The building performs beautifully with significantly lower energy costs.',
      author: 'Elizabeth Harper',
      project: 'Corporate Office Building',
      location: 'Toronto'
    }
  }
};
