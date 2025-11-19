/**
 * Centralized video metadata for VideoObject schema
 * Enables video-rich snippets in search results and AI engine citations
 */

export interface VideoMetadata {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 format: PT1M30S (1 min 30 sec)
  contentUrl: string;
  category?: string;
}

/**
 * Hero video - Main building envelope demonstration
 */
export const heroVideo: VideoMetadata = {
  name: "Building Envelope & Restoration Services - Ascent Group Construction",
  description: "Professional demonstration of Ascent Group Construction's building envelope systems, facade restoration, waterproofing solutions, and commercial construction expertise across the Greater Toronto Area. Showcasing 15+ years of team experience in EIFS installation, masonry restoration, parking garage rehabilitation, and specialty contracting services.",
  thumbnailUrl: "/hero-poster-1.webp",
  uploadDate: "2025-01-15",
  duration: "PT45S", // 45 seconds
  contentUrl: "/hero-clipchamp.mp4",
  category: "Construction Services"
};

/**
 * Splash screen video - Company brand introduction
 */
export const splashVideo: VideoMetadata = {
  name: "Ascent Group Construction - Brand Introduction",
  description: "Ascent Group Construction logo animation and brand introduction. Ontario-based specialty contractor specializing in building envelope systems, facade restoration, and commercial construction services.",
  thumbnailUrl: "/logo.png",
  uploadDate: "2025-01-15",
  duration: "PT5S", // 5 seconds
  contentUrl: "/ascent-logo-intro.mp4",
  category: "Brand"
};

/**
 * Service demonstration videos (to be added as content is created)
 * Template for future service-specific videos
 */
export const serviceDemoVideos: Record<string, VideoMetadata> = {
  // Example structure for future videos:
  // "eifs-installation": {
  //   name: "EIFS Installation Process - Exterior Insulation and Finish System",
  //   description: "Step-by-step demonstration of EIFS (Exterior Insulation and Finish System) installation by Ascent Group Construction. See our professional crew applying insulation boards, base coat, mesh reinforcement, and finish coat for superior building envelope performance.",
  //   thumbnailUrl: "/services/eifs-demo-thumbnail.jpg",
  //   uploadDate: "2025-01-20",
  //   duration: "PT3M30S", // 3 minutes 30 seconds
  //   contentUrl: "/videos/eifs-installation-demo.mp4",
  //   category: "EIFS Services"
  // },
  // "masonry-restoration": {
  //   name: "Masonry Restoration & Tuckpointing - Historic Building Preservation",
  //   description: "Professional masonry restoration techniques including tuckpointing, brick replacement, and mortar repair. Watch our experienced masons restore historic commercial buildings in Toronto and the GTA.",
  //   thumbnailUrl: "/services/masonry-demo-thumbnail.jpg",
  //   uploadDate: "2025-01-22",
  //   duration: "PT4M15S", // 4 minutes 15 seconds
  //   contentUrl: "/videos/masonry-restoration-demo.mp4",
  //   category: "Masonry Services"
  // },
  // "parking-garage-restoration": {
  //   name: "Parking Garage Restoration - Concrete Repair & Waterproofing",
  //   description: "Comprehensive parking garage restoration including concrete spalling repair, expansion joint replacement, traffic coating application, and structural waterproofing for underground and above-grade facilities.",
  //   thumbnailUrl: "/services/parking-garage-demo-thumbnail.jpg",
  //   uploadDate: "2025-01-25",
  //   duration: "PT5M45S", // 5 minutes 45 seconds
  //   contentUrl: "/videos/parking-garage-restoration-demo.mp4",
  //   category: "Parking Garage Services"
  // }
};

/**
 * Get all active video metadata for homepage
 */
export const getHomepageVideos = (): VideoMetadata[] => {
  return [heroVideo];
};

/**
 * Get video metadata by category
 */
export const getVideosByCategory = (category: string): VideoMetadata[] => {
  return Object.values(serviceDemoVideos).filter(video => video.category === category);
};

/**
 * Get all service demonstration videos
 */
export const getAllServiceVideos = (): VideoMetadata[] => {
  return Object.values(serviceDemoVideos);
};
