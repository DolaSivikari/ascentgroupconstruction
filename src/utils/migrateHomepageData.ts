import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate homepage settings to database
 */
export const migrateHomepageSettings = async () => {
  console.log("🚀 Starting homepage settings migration...");
  
  try {
    // Check if settings already exist
    const { data: existing, error: checkError } = await supabase
      .from("homepage_settings")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ Error checking existing data:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existing && existing.length > 0) {
      console.log("⚠️ Homepage settings already exist. Skipping migration.");
      return { 
        success: false, 
        error: "Settings already exist. Delete existing record first." 
      };
    }

    // Insert default homepage settings
    const { error } = await supabase
      .from("homepage_settings")
      .insert([{
        headline: "Ontario's Trusted General Contractor",
        subheadline: "Delivering commercial, multi-family, and institutional projects on-time and on-budget since 2009",
        hero_description: "With 15+ years of construction management expertise across Ontario, Ascent Group Construction specializes in design-build, general contracting, and construction management for commercial, institutional, and multi-family projects.",
        cta_primary_text: "Submit RFP",
        cta_primary_url: "/submit-rfp",
        cta_secondary_text: "Request Proposal",
        cta_secondary_url: "/contact",
        cta_tertiary_text: "View Projects",
        cta_tertiary_url: "/projects",
        value_prop_1: "Licensed & Bonded",
        value_prop_2: "500+ Projects Completed",
        value_prop_3: "98% Client Satisfaction",
        is_active: true
      }]);

    if (error) {
      console.error("❌ Migration failed:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Homepage settings migrated successfully!");
    return { 
      success: true, 
      message: "Homepage settings created successfully!"
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
 * Migrate hero slides to database
 */
export const migrateHeroSlides = async () => {
  console.log("🚀 Starting hero slides migration...");
  
  try {
    // Check if slides already exist
    const { data: existing, error: checkError } = await supabase
      .from("hero_slides")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ Error checking existing data:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existing && existing.length > 0) {
      console.log("⚠️ Hero slides already exist. Skipping migration.");
      return { 
        success: false, 
        error: "Hero slides already exist. Delete existing records first." 
      };
    }

    // Insert default hero slide
    const { error } = await supabase
      .from("hero_slides")
      .insert([{
        headline: "Building Ontario's Future",
        subheadline: "Excellence in Commercial & Institutional Construction",
        description: "Award-winning general contractor specializing in design-build, construction management, and comprehensive project delivery across Ontario.",
        primary_cta_text: "Submit RFP",
        primary_cta_url: "/submit-rfp",
        primary_cta_icon: "FileText",
        secondary_cta_text: "View Projects",
        secondary_cta_url: "/projects",
        stat_number: "500+",
        stat_label: "Projects Completed",
        display_order: 0,
        is_active: true
      }]);

    if (error) {
      console.error("❌ Migration failed:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Hero slides migrated successfully!");
    return { 
      success: true, 
      message: "Hero slide created successfully!"
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
 * Clear all homepage data (use with caution!)
 */
export const clearHomepageData = async () => {
  try {
    await supabase.from("homepage_settings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("hero_slides").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    console.log("✅ Homepage data cleared");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Error clearing data:", error);
    return { success: false, error: error.message };
  }
};
