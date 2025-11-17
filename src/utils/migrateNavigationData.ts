import { supabase } from "@/integrations/supabase/client";
import { megaMenuDataEnhanced } from "@/data/navigation-structure-enhanced";

interface NavigationItem {
  menu_type: string;
  parent_id?: string;
  label: string;
  url: string;
  description?: string;
  badge?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  is_mega_menu: boolean;
  mega_menu_section_title?: string;
}

/**
 * Migrate hardcoded navigation data to database
 * Run this once to import all navigation items from navigation-structure-enhanced.ts
 */
export const migrateNavigationData = async () => {
  console.log("🚀 Starting navigation data migration...");
  
  try {
    const itemsToInsert: NavigationItem[] = [];
    let displayOrder = 0;

    // Process each top-level menu (services, markets, projects, company, resources)
    for (const [menuKey, sections] of Object.entries(megaMenuDataEnhanced)) {
      console.log(`Processing menu: ${menuKey}`);
      
      for (const section of sections) {
        displayOrder++;
        
        // Create section as parent item
        const sectionItem: NavigationItem = {
          menu_type: 'primary',
          label: section.sectionTitle,
          url: section.sectionLink || '#',
          display_order: displayOrder,
          is_active: true,
          is_mega_menu: true,
          mega_menu_section_title: section.sectionTitle,
        };
        
        itemsToInsert.push(sectionItem);
        
        // Process categories under this section
        for (const category of section.categories) {
          displayOrder++;
          
          const categoryItem: NavigationItem = {
            menu_type: 'primary',
            label: category.title,
            url: '#',
            description: category.description,
            display_order: displayOrder,
            is_active: true,
            is_mega_menu: true,
          };
          
          itemsToInsert.push(categoryItem);
          
          // Process sub-items under category
          for (const subItem of category.subItems) {
            displayOrder++;
            
            const navItem: NavigationItem = {
              menu_type: 'primary',
              label: subItem.name,
              url: subItem.link,
              description: subItem.description,
              badge: subItem.badge,
              display_order: displayOrder,
              is_active: true,
              is_mega_menu: false,
            };
            
            itemsToInsert.push(navItem);
          }
        }
      }
    }

    console.log(`📦 Prepared ${itemsToInsert.length} navigation items for insertion`);

    // Check if data already exists
    const { data: existing, error: checkError } = await supabase
      .from("navigation_menu_items")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ Error checking existing data:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existing && existing.length > 0) {
      console.log("⚠️ Navigation data already exists. Skipping migration.");
      console.log("To re-run migration, first delete existing items from navigation_menu_items table");
      return { 
        success: false, 
        error: "Data already exists. Delete existing records first." 
      };
    }

    // Insert all items
    const { data, error } = await supabase
      .from("navigation_menu_items")
      .insert(itemsToInsert)
      .select();

    if (error) {
      console.error("❌ Migration failed:", error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Successfully migrated ${data?.length || 0} navigation items!`);
    return { 
      success: true, 
      itemsCreated: data?.length || 0,
      message: `Migration complete! ${data?.length || 0} items created.`
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
 * Clear all navigation items (use with caution!)
 */
export const clearNavigationData = async () => {
  const { error } = await supabase
    .from("navigation_menu_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (error) {
    console.error("❌ Error clearing data:", error);
    return { success: false, error: error.message };
  }

  console.log("✅ All navigation items cleared");
  return { success: true };
};
