/**
 * Utility functions for review schema generation
 */

/**
 * Convert relative date strings to ISO format (YYYY-MM-DD)
 * @param relativeDate - e.g., "5 days ago", "2 weeks ago", "1 month ago"
 * @returns ISO date string
 */
export const calculateISODate = (relativeDate: string): string => {
  const now = new Date();
  const lowerDate = relativeDate.toLowerCase();

  if (lowerDate.includes("day")) {
    const days = parseInt(lowerDate);
    now.setDate(now.getDate() - days);
  } else if (lowerDate.includes("week")) {
    const weeks = parseInt(lowerDate);
    now.setDate(now.getDate() - weeks * 7);
  } else if (lowerDate.includes("month")) {
    const months = parseInt(lowerDate);
    now.setMonth(now.getMonth() - months);
  }

  return now.toISOString().split("T")[0];
};

/**
 * Infer service type from review text
 * @param reviewText - The review content
 * @returns Service name and type
 */
export const inferServiceFromReview = (reviewText: string): { name: string; type: string } => {
  const text = reviewText.toLowerCase();

  if (text.includes("parking garage") || text.includes("garage restoration")) {
    return { name: "Parking Garage Restoration", type: "Service" };
  }
  if (text.includes("condo") || text.includes("condominium")) {
    return { name: "Condo Painting & Restoration", type: "Service" };
  }
  if (text.includes("paint") || text.includes("exterior") || text.includes("interior")) {
    return { name: "Commercial Painting", type: "Service" };
  }
  if (text.includes("office") || text.includes("commercial")) {
    return { name: "Commercial Renovation", type: "Service" };
  }
  if (text.includes("warehouse") || text.includes("floor") || text.includes("coating")) {
    return { name: "Industrial Flooring", type: "Service" };
  }
  if (text.includes("stucco") || text.includes("masonry") || text.includes("concrete")) {
    return { name: "Masonry & Concrete Restoration", type: "Service" };
  }

  return { name: "Construction Services", type: "Service" };
};

/**
 * Get consistent aggregate rating across the site
 * @returns Standardized rating object
 */
export const getConsistentAggregateRating = () => {
  // Returns zeros until real reviews are collected
  return {
    ratingValue: "0",
    reviewCount: "0",
    bestRating: "5",
    worstRating: "1"
  };
};
