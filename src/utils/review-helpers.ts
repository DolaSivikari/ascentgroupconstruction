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
 * Get consistent aggregate rating across the site from database
 * This function should be used with the useAggregateRating hook for async data
 * @returns Standardized rating object with zeros as default
 */
export const getConsistentAggregateRating = () => {
  // Returns zeros by default - use useAggregateRating hook for real data
  return {
    ratingValue: "0",
    reviewCount: "0",
    bestRating: "5",
    worstRating: "1"
  };
};

/**
 * Calculate aggregate rating from testimonial data
 * @param testimonials - Array of published testimonials with ratings
 * @returns Aggregate rating object
 */
export const calculateAggregateRating = (testimonials: Array<{ rating: number }>) => {
  if (!testimonials || testimonials.length === 0) {
    return {
      ratingValue: "0",
      reviewCount: "0",
      bestRating: "5",
      worstRating: "1"
    };
  }

  const ratings = testimonials.map(t => t.rating).filter(r => r > 0);
  if (ratings.length === 0) {
    return {
      ratingValue: "0",
      reviewCount: "0",
      bestRating: "5",
      worstRating: "1"
    };
  }

  const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  return {
    ratingValue: avgRating.toFixed(1),
    reviewCount: ratings.length.toString(),
    bestRating: maxRating.toString(),
    worstRating: minRating.toString()
  };
};
