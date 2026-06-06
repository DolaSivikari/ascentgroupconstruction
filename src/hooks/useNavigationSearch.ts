import { useState, useMemo, useEffect } from "react";
import { megaMenuDataEnhanced } from "@/data/navigation-structure-enhanced";
import { SERVICE_REGISTRY, SERVICE_CATEGORIES } from "@/data/service-registry";
import { useSearchAnalytics } from "./useSearchAnalytics";

export interface SearchResult {
  name: string;
  link: string;
  category: string;
  section: string;
  badge?: "new" | "popular" | "important";
}

// Export allNavigationItems as a separate variable for use in other hooks
export const getAllNavigationItems = (): SearchResult[] => {
  const items: SearchResult[] = [];
  const seen = new Set<string>();

  // Dynamically iterate over all navigation configs
  Object.entries(megaMenuDataEnhanced).forEach(([, config]) => {
    const sections = config?.sections;
    if (!Array.isArray(sections)) return;

    sections.forEach((section) => {
      section.categories?.forEach((category) => {
        category.subItems?.forEach((item) => {
          const key = `${section.sectionTitle}::${item.link}`;
          if (seen.has(key)) return;
          seen.add(key);
          items.push({
            name: item.name,
            link: item.link,
            category: category.title,
            section: section.sectionTitle,
            badge: (item as { badge?: "new" | "popular" | "important" }).badge,
          });
        });
      });
    });
  });

  // Also surface every registered service page — including ones hidden from
  // the top nav (e.g. Wave 1+2 painting sub-pages, sealant programs) so
  // search still finds them.
  for (const entry of SERVICE_REGISTRY) {
    const key = `Our Services::${entry.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      name: entry.navLabel,
      link: entry.path,
      category: SERVICE_CATEGORIES[entry.category].title,
      section: "Our Services",
    });
  }

  return items;
};


export function useNavigationSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { trackSearch } = useSearchAnalytics();

  const allNavigationItems = useMemo(() => getAllNavigationItems(), []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    let results = allNavigationItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const categoryMatch = item.category.toLowerCase().includes(query);
      const sectionMatch = item.section.toLowerCase().includes(query);
      return nameMatch || categoryMatch || sectionMatch;
    });

    // Apply category filter
    if (activeCategory !== "all") {
      results = results.filter(
        (item) => item.section.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    return results;
  }, [searchQuery, allNavigationItems, activeCategory]);

  // Track search analytics when results change
  useEffect(() => {
    if (searchQuery.trim() && filteredResults.length >= 0) {
      // Calculate section distribution
      const sectionDistribution = filteredResults.reduce((acc, result) => {
        acc[result.section] = (acc[result.section] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      trackSearch({
        search_query: searchQuery,
        results_count: filteredResults.length,
        section_distribution: sectionDistribution,
      });
    }
  }, [searchQuery, filteredResults, trackSearch]);

  return {
    searchQuery,
    setSearchQuery,
    filteredResults,
    isSearching: searchQuery.length > 0,
    activeCategory,
    setActiveCategory,
  };
}
