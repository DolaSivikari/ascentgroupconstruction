import estimatorModel from "@/data/estimator-model.json";

// Service classification system
export const SERVICE_CLASSIFICATION = {
  estimatable: [
    'residential_painting',
    'commercial_painting',
    'condo_multi_unit_painting',
    'stucco_eifs',
    'exterior_siding_cladding',
    'drywall_interior_finishing',
  ],
  requiresQuote: [
    'commercial_construction',
    'multi_family_construction',
    'institutional_construction',
    'masonry',
    'roofing',
    'metal_cladding',
    'waterproofing',
    'sealants',
    'parking_garage',
    'windows_doors',
    'general_contracting',
    'design_build',
    'construction_management',
    'preconstruction',
    'suite_buildouts',
    'tile_flooring',
    'sustainable_building',
  ],
} as const;

export function isEstimatable(service: string): boolean {
  return SERVICE_CLASSIFICATION.estimatable.includes(service as any);
}

export function requiresQuote(service: string): boolean {
  return SERVICE_CLASSIFICATION.requiresQuote.includes(service as any);
}

export function getServiceMessage(service: string): {
  title: string;
  description: string;
  ballparkRange?: string;
} {
  const messages: Record<string, any> = {
    commercial_construction: {
      title: "Commercial Construction Quote Required",
      description: "Commercial construction projects require detailed site assessment, architectural review, and comprehensive planning. We'll provide a customized quote based on your specific requirements.",
      ballparkRange: "$250,000 - $5,000,000+ (depending on scope and complexity)",
    },
    multi_family_construction: {
      title: "Multi-Family Construction Quote Required",
      description: "Multi-family projects involve complex zoning, structural, and building code requirements. Our team will schedule a consultation to provide accurate pricing.",
      ballparkRange: "$500,000 - $10,000,000+ (depending on unit count and specifications)",
    },
    institutional_construction: {
      title: "Institutional Construction Quote Required",
      description: "Institutional projects (schools, hospitals, government buildings) require specialized expertise and compliance. We'll provide a detailed proposal after reviewing your plans.",
      ballparkRange: "$750,000 - $15,000,000+ (highly variable by scope)",
    },
    masonry: {
      title: "Custom Masonry Quote Required",
      description: "Masonry projects vary significantly based on materials, structural requirements, and site conditions. We'll schedule a free site inspection to provide accurate pricing.",
      ballparkRange: "$15,000 - $150,000+ (depending on scope)",
    },
    roofing: {
      title: "Roofing Quote Required",
      description: "Roofing costs depend on roof pitch, access, existing layers, and material selection. Let's schedule a free roof inspection.",
      ballparkRange: "$8,000 - $50,000+ (typical commercial building)",
    },
    parking_garage: {
      title: "Parking Garage Coating Quote",
      description: "Coating selection depends on traffic level, surface condition, and performance requirements. We'll assess your garage and recommend the right system.",
      ballparkRange: "$3 - $12/sqft (depending on coating type)",
    },
    metal_cladding: {
      title: "Metal Cladding Quote Required",
      description: "Metal panel systems require detailed engineering, material selection, and custom fabrication. Let's discuss your project specifications.",
      ballparkRange: "$25 - $60/sqft (installed)",
    },
    waterproofing: {
      title: "Waterproofing & Restoration Quote",
      description: "Building envelope restoration requires thorough assessment of existing conditions and moisture intrusion. We'll conduct a comprehensive building audit.",
      ballparkRange: "$20,000 - $200,000+ (varies by building size)",
    },
    sealants: {
      title: "Sealants & Caulking Quote",
      description: "Joint sealing costs depend on linear footage, accessibility, and material specifications. We'll assess your building's envelope needs.",
      ballparkRange: "$8 - $25/linear foot",
    },
    windows_doors: {
      title: "Window & Door Installation Quote",
      description: "Installation costs vary by product selection, size, quantity, and structural requirements. Let's review your specifications and site conditions.",
      ballparkRange: "$500 - $3,000+ per unit installed",
    },
    general_contracting: {
      title: "General Contracting Services",
      description: "Project-based pricing requires understanding your full scope, timeline, and deliverables. Let's discuss your project goals.",
      ballparkRange: "Custom pricing based on project scope",
    },
    design_build: {
      title: "Design-Build Quote Required",
      description: "Design-Build services include design, permits, and construction. Pricing depends on project complexity and design requirements.",
      ballparkRange: "Custom pricing based on project scope",
    },
    construction_management: {
      title: "Construction Management Services",
      description: "CM fees are typically a percentage of construction costs or fixed monthly fee. Let's discuss your project requirements.",
      ballparkRange: "3-8% of construction value",
    },
    preconstruction: {
      title: "Preconstruction & Advisory Services",
      description: "Preconstruction services include cost estimating, value engineering, and constructability review. Pricing varies by project scope.",
      ballparkRange: "$5,000 - $50,000+ depending on project size",
    },
    suite_buildouts: {
      title: "Suite Buildout Quote Required",
      description: "Tenant improvement costs depend on finishes, mechanical/electrical work, and existing conditions. We'll review your space plan and specifications.",
      ballparkRange: "$50 - $200/sqft (varies widely by finish level)",
    },
    tile_flooring: {
      title: "Tile & Flooring Quote",
      description: "Flooring costs vary by material selection, pattern complexity, and substrate preparation. Let's discuss your design and functional requirements.",
      ballparkRange: "$8 - $35/sqft installed",
    },
    sustainable_building: {
      title: "Sustainable Building Consultation",
      description: "Green building strategies and certifications require detailed analysis and custom solutions. Let's explore your sustainability goals.",
      ballparkRange: "Custom pricing based on certification target",
    },
  };

  return messages[service] || {
    title: "Custom Quote Required",
    description: "This service requires a detailed consultation to provide accurate pricing. We'll work with you to understand your needs and provide a comprehensive quote.",
    ballparkRange: "Custom pricing based on project scope",
  };
}

export interface EstimateInput {
  service: 
    | "residential_painting" 
    | "stucco_eifs"
    | "commercial_painting"
    | "condo_multi_unit_painting"
    | "exterior_siding_cladding"
    | "drywall_interior_finishing";
  sqft: number;
  stories?: "1" | "2" | "3_plus";
  prepComplexity?: "none" | "standard" | "heavy" | "structural_repair_required";
  finishQuality?: "standard" | "premium" | "luxury";
  region?: "gta_default" | "inner_city" | "suburban" | "rural";
  // Commercial painting specific
  buildingType?: "office" | "retail" | "industrial" | "institutional";
  accessibility?: "ground_floor" | "mid_rise" | "high_rise";
  businessHoursConstraint?: "regular_hours" | "after_hours" | "weekends_only";
  // Condo specific
  unitCount?: "1_5" | "6_10" | "11_20" | "21_plus";
  includeCommonAreas?: boolean;
  // Material specific
  materialType?: "vinyl" | "fiber_cement" | "wood" | "metal" | "brick_veneer";
  addOns?: {
    scaffolding?: "low" | "mid" | "high";
    colorConsultation?: boolean;
    rushScheduling?: boolean;
    warrantyExtension?: boolean;
    siteCleanup?: boolean;
  };
}

export interface EstimateResult {
  min: number;
  max: number;
  currency: string;
  breakdown: {
    baseMin: number;
    baseMax: number;
    prepMultiplier: number;
    finishMultiplier: number;
    storiesMultiplier: number;
    regionalMultiplier: number;
    addOnsMin: number;
    addOnsMax: number;
  };
  explanation: string;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const service = (estimatorModel.services as any)[input.service];
  
  // Defensive error handling - service not found in estimator model
  if (!service || !service.base_per_sqft) {
    console.error(`[Estimator Error] Service not found in model: ${input.service}`);
    throw new Error(
      `This service requires a custom quote. Please contact us directly for accurate pricing.`
    );
  }
  
  const modifiers = estimatorModel.modifiers;
  const rules = estimatorModel.estimation_rules;
  const addOns = estimatorModel.add_ons;

  // Default safe values for undefined optional fields
  const sqft = input.sqft || 0;
  const regionKey = input.region || "gta_default";
  const storiesKey = input.stories || "1";
  const prepKey = input.prepComplexity || "standard";
  const finishKey = input.finishQuality || "standard";
  const addOnInput = input.addOns || {};

  // Step 1: Base calculation
  let minPrice = service.base_per_sqft.min * sqft;
  let maxPrice = service.base_per_sqft.max * sqft;
  const baseMin = minPrice;
  const baseMax = maxPrice;

  // Step 2: Apply prep complexity
  const prepMultiplier = modifiers.prep_complexity[prepKey] ?? 1;
  minPrice *= prepMultiplier;
  maxPrice *= prepMultiplier;

  // Step 3: Apply finish quality
  const finishMultiplier = modifiers.finish_quality[finishKey] ?? 1;
  minPrice *= finishMultiplier;
  maxPrice *= finishMultiplier;

  // Step 4: Apply stories multiplier
  const storiesMultiplier = modifiers.stories_multiplier[storiesKey] ?? 1;
  minPrice *= storiesMultiplier;
  maxPrice *= storiesMultiplier;

  // Step 4.5: Apply service-specific modifiers
  const serviceModifiers = (estimatorModel as any).service_specific_modifiers || {};

  if (input.service === "commercial_painting" && serviceModifiers.commercial_painting) {
    const commercialMods = serviceModifiers.commercial_painting;
    
    if (input.buildingType && commercialMods.building_type) {
      const buildingMultiplier = commercialMods.building_type[input.buildingType] ?? 1;
      minPrice *= buildingMultiplier;
      maxPrice *= buildingMultiplier;
    }
    
    if (input.accessibility && commercialMods.accessibility) {
      const accessMultiplier = commercialMods.accessibility[input.accessibility] ?? 1;
      minPrice *= accessMultiplier;
      maxPrice *= accessMultiplier;
    }
    
    if (input.businessHoursConstraint && commercialMods.business_hours_constraint) {
      const scheduleMultiplier = commercialMods.business_hours_constraint[input.businessHoursConstraint] ?? 1;
      minPrice *= scheduleMultiplier;
      maxPrice *= scheduleMultiplier;
    }
  }

  if (input.service === "condo_multi_unit_painting" && serviceModifiers.condo_multi_unit_painting) {
    const condoMods = serviceModifiers.condo_multi_unit_painting;
    
    if (input.unitCount && condoMods.unit_count_discount) {
      const discountMultiplier = condoMods.unit_count_discount[input.unitCount] ?? 1;
      minPrice *= discountMultiplier;
      maxPrice *= discountMultiplier;
    }
    
    if (input.includeCommonAreas && condoMods.common_areas_multiplier) {
      minPrice *= condoMods.common_areas_multiplier;
      maxPrice *= condoMods.common_areas_multiplier;
    }
  }

  if (input.service === "exterior_siding_cladding" && serviceModifiers.exterior_siding_cladding) {
    const sidingMods = serviceModifiers.exterior_siding_cladding;
    
    if (input.materialType && sidingMods.material_type) {
      const materialMultiplier = sidingMods.material_type[input.materialType] ?? 1;
      minPrice *= materialMultiplier;
      maxPrice *= materialMultiplier;
    }
  }

  // Step 5: Add add-ons (safe and fault-tolerant)
  let addOnsMin = 0;
  let addOnsMax = 0;

  if (addOnInput.scaffolding) {
    const tier = addOns.scaffolding.tiers.find(
      (t) => t.name === addOnInput.scaffolding
    );
    if (tier) {
      addOnsMin += tier.min;
      addOnsMax += tier.max;
    }
  }

  if (
    addOnInput.colorConsultation &&
    !addOns.color_consultation.default_included_with_full_job
  ) {
    addOnsMin += addOns.color_consultation.flat_min;
    addOnsMax += addOns.color_consultation.flat_max;
  }

  if (addOnInput.rushScheduling) {
    const rushMin = addOns.rush_scheduling.multiplier_min;
    const rushMax = addOns.rush_scheduling.multiplier_max;
    minPrice *= rushMin;
    maxPrice *= rushMax;
  }

  if (addOnInput.warrantyExtension) {
    addOnsMin += addOns.warranty_extension.flat_min;
    addOnsMax += addOns.warranty_extension.flat_max;
  }

  if (addOnInput.siteCleanup) {
    addOnsMin += addOns.site_cleanup.flat_min;
    addOnsMax += addOns.site_cleanup.flat_max;
  }

  minPrice += addOnsMin;
  maxPrice += addOnsMax;

  // Step 6: Apply regional multiplier (safe)
  const regionalMultiplier = modifiers.regional_multiplier[regionKey] ?? 1;
  minPrice *= regionalMultiplier;
  maxPrice *= regionalMultiplier;

  // Step 7: Apply minimum job fee
  const minJobFee = rules.minimum_job_fee.amount ?? 0;
  minPrice = Math.max(minPrice, minJobFee);
  maxPrice = Math.max(maxPrice, minJobFee);

  // Generate explanation
  const explanation = generateExplanation(input, {
    baseMin,
    baseMax,
    prepMultiplier,
    finishMultiplier,
    storiesMultiplier,
    regionalMultiplier,
  });

  // Final rounded result
  return {
    min: Math.round(minPrice),
    max: Math.round(maxPrice),
    currency: estimatorModel.currency || "CAD",
    breakdown: {
      baseMin,
      baseMax,
      prepMultiplier,
      finishMultiplier,
      storiesMultiplier,
      regionalMultiplier,
      addOnsMin,
      addOnsMax,
    },
    explanation,
  };
}

function generateExplanation(
  input: EstimateInput,
  breakdown: {
    baseMin: number;
    baseMax: number;
    prepMultiplier: number;
    finishMultiplier: number;
    storiesMultiplier: number;
    regionalMultiplier: number;
  }
): string {
  const parts: string[] = [];

  parts.push(`Based on ${input.sqft || 0} sq ft`);

  if (breakdown.prepMultiplier > 1 && input.prepComplexity) {
    parts.push(`${input.prepComplexity.replace(/_/g, " ")} prep work`);
  }

  if (breakdown.finishMultiplier > 1 && input.finishQuality) {
    parts.push(`${input.finishQuality} finish quality`);
  }

  if (breakdown.storiesMultiplier > 1 && input.stories) {
    parts.push(`${input.stories.replace("_", "+")} story structure`);
  }

  // Add service-specific details
  if (input.service === "commercial_painting") {
    if (input.buildingType) {
      parts.push(`${input.buildingType} building type`);
    }
    if (input.accessibility === "high_rise") {
      parts.push("high-rise accessibility");
    }
    if (input.businessHoursConstraint === "after_hours" || input.businessHoursConstraint === "weekends_only") {
      parts.push("after-hours scheduling");
    }
  }

  if (input.service === "condo_multi_unit_painting") {
    if (input.unitCount) {
      const unitRanges: Record<string, string> = {
        "1_5": "1-5",
        "6_10": "6-10",
        "11_20": "11-20",
        "21_plus": "21+",
      };
      parts.push(`${unitRanges[input.unitCount]} units`);
    }
    if (input.includeCommonAreas) {
      parts.push("including common areas");
    }
  }

  if (input.service === "exterior_siding_cladding" && input.materialType) {
    parts.push(`${input.materialType.replace(/_/g, " ")} material`);
  }

  return `Estimate includes: ${parts.join(
    ", "
  )}. Final price depends on site inspection and material selection.`;
}

export function formatCurrency(
  amount: number,
  currency: string = "CAD"
): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
