import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate about page settings to database
 */
export const migrateAboutPageSettings = async () => {
  console.log("🚀 Starting about page settings migration...");
  
  try {
    // Check if settings already exist
    const { data: existing, error: checkError } = await supabase
      .from("about_page_settings")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ Error checking existing data:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existing && existing.length > 0) {
      console.log("⚠️ About page settings already exist. Skipping migration.");
      return { 
        success: false, 
        error: "Settings already exist. Delete existing record first." 
      };
    }

    // Insert default about page settings
    const { error } = await supabase
      .from("about_page_settings")
      .insert([{
        story_headline: "Our Story",
        story_promise_title: "Our Promise",
        story_promise_text: "We are committed to delivering exceptional construction services that exceed our clients' expectations through innovation, quality craftsmanship, and transparent communication.",
        story_content: [
          {
            type: "paragraph",
            content: "Ascent Group Construction was established in 2025 by construction professionals with 15+ years of combined experience in building envelope and interior trades work across the Greater Toronto Area."
          },
          {
            type: "paragraph",
            content: "We specialize in building envelope restoration, EIFS/stucco systems, masonry, waterproofing, and interior finishing for commercial, multi-family, and institutional properties."
          }
        ],
        years_in_business: 15,
        total_projects: 10,
        satisfaction_rate: null,
        values: [
          {
            title: "Integrity",
            description: "Building trust through honest communication and transparent practices.",
            icon: "Shield"
          },
          {
            title: "Excellence",
            description: "Delivering superior quality in every project we undertake.",
            icon: "Award"
          },
          {
            title: "Innovation",
            description: "Embracing cutting-edge technologies and construction methodologies.",
            icon: "Lightbulb"
          },
          {
            title: "Safety",
            description: "Maintaining the highest safety standards on every job site.",
            icon: "HardHat"
          }
        ],
        safety_headline: "Safety First, Always",
        safety_commitment: "Safety is not just a priority—it's a core value that guides everything we do. We maintain rigorous safety protocols and invest in continuous training to ensure every team member returns home safely.",
        safety_stats: [
          { label: "Safety Training Hours", value: "10,000+" },
          { label: "Ontario OHSA Compliance", value: "100%" },
          { label: "Safety Record", value: "Excellent" }
        ],
        safety_programs: [
          { name: "Daily Safety Briefings", description: "Comprehensive site-specific safety meetings" },
          { name: "Ongoing Training", description: "Regular safety certification and skill development" },
          { name: "Equipment Inspection", description: "Daily tool and equipment safety checks" }
        ],
        sustainability_headline: "Sustainability Commitment",
        sustainability_commitment: "We're dedicated to sustainable building practices that reduce environmental impact while delivering long-term value for our clients and communities.",
        sustainability_initiatives: [
          { title: "Sustainable Practices", description: "Energy-efficient envelope systems and low-VOC materials" },
          { title: "Waste Reduction", description: "Comprehensive recycling and waste management programs" },
          { title: "Energy Efficiency", description: "Integration of energy-efficient systems and materials" }
        ],
        licenses: [
          { type: "General Contractor License", number: "GC-123456", issuer: "Province of Ontario" }
        ],
        insurance: {
          liability: "$2,000,000 General Liability",
          workers_comp: "Full WSIB Coverage",
        },
        memberships: [
          "Ontario General Contractors Association",
          "Canadian Construction Association",
          "Better Business Bureau"
        ],
        credentials_cta_headline: "Our Credentials",
        credentials_cta_text: "View our complete certifications and insurance coverage",
        cta_headline: "Ready to Work with Us?",
        cta_subheadline: "Let's discuss your next construction project",
        faq_items: [
          {
            question: "What types of projects do you specialize in?",
            answer: "We specialize in building envelope restoration, EIFS/stucco, masonry, waterproofing, protective coatings, and interior finishing for commercial, multi-family, and institutional properties."
          },
          {
            question: "What is your typical project timeline?",
            answer: "Project timelines vary based on scope and complexity. We provide detailed schedules during the planning phase and maintain transparent communication throughout the construction process."
          },
          {
            question: "What contract types do you work with?",
            answer: "We work with lump sum, cost-plus, unit price, and time & materials contracts depending on the project scope and client preference."
          }
        ],
        is_active: true
      }]);

    if (error) {
      console.error("❌ Migration failed:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ About page settings migrated successfully!");
    return { 
      success: true, 
      message: "About page settings created successfully!"
    };

  } catch (error: any) {
    console.error("❌ Migration error:", error);
    return { 
      success: false, 
      error: error.message || "Unknown error occurred" 
    };
  }
};

/**
 * Clear about page data (use with caution!)
 */
export const clearAboutPageData = async () => {
  try {
    await supabase.from("about_page_settings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    console.log("✅ About page data cleared");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Error clearing data:", error);
    return { success: false, error: error.message };
  }
};
