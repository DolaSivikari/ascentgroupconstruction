import { useState, useMemo, useEffect } from "react";
import { megaMenuDataEnhanced } from "@/data/navigation-structure-enhanced";
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

  // Extract items from services
  megaMenuDataEnhanced.services.forEach((section) => {
    section.categories.forEach((category) => {
      if (category.subItems) {
        category.subItems.forEach((item) => {
          items.push({
            name: item.name,
            link: item.link,
            category: category.title,
            section: "Services",
            badge: item.badge as "new" | "popular" | "important" | undefined,
          });
        });
      }
    });
  });

  // Extract items from projects
  megaMenuDataEnhanced.projects.forEach((section) => {
    section.categories.forEach((category) => {
      if (category.subItems) {
        category.subItems.forEach((item) => {
          items.push({
            name: item.name,
            link: item.link,
            category: "Projects",
            section: "Projects",
            badge: item.badge as "new" | "popular" | "important" | undefined,
          });
        });
      }
    });
  });

  // Extract items from company
  megaMenuDataEnhanced.company.forEach((section) => {
    section.categories.forEach((category) => {
      if (category.subItems) {
        category.subItems.forEach((item) => {
          items.push({
            name: item.name,
            link: item.link,
            category: section.sectionTitle,
            section: "Company",
            badge: item.badge as "new" | "popular" | "important" | undefined,
          });
        });
      }
    });
  });

  // Extract items from resources
  megaMenuDataEnhanced.resources.forEach((section) => {
    section.categories.forEach((category) => {
      if (category.subItems) {
        category.subItems.forEach((item) => {
          items.push({
            name: item.name,
            link: item.link,
            category: section.sectionTitle,
            section: "Resources",
            badge: item.badge as "new" | "popular" | "important" | undefined,
          });
        });
      }
    });
  });

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
