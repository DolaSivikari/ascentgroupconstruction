# Video Schema Implementation Guide

## Overview
This document outlines the VideoObject schema implementation for enabling video-rich snippets in search results and AI engine citations.

## Current Implementation

### ✅ **Implemented Videos**

#### 1. **Hero Video** (`hero-clipchamp.mp4`)
- **Location**: Homepage hero section
- **Schema Type**: VideoObject
- **Key Metadata**:
  - Name: "Building Envelope & Restoration Services - Ascent Group Construction"
  - Duration: PT45S (45 seconds)
  - Upload Date: 2025-01-15
  - Thumbnail: `/hero-poster-1.webp`
  - Description: 200+ character SEO-optimized description including key services

#### 2. **Splash Screen Video** (`ascent-logo-intro.mp4`)
- **Location**: Initial page load animation
- **Schema Type**: VideoObject
- **Key Metadata**:
  - Name: "Ascent Group Construction - Brand Introduction"
  - Duration: PT5S (5 seconds)
  - Upload Date: 2025-01-15
  - Thumbnail: `/logo.png`
  - Description: Brand introduction animation

## Schema Structure

### VideoObject Schema Properties

```typescript
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: string,              // SEO-optimized title with keywords
  description: string,       // 150-300 chars with service keywords
  thumbnailUrl: string,      // Full URL to poster/thumbnail image
  uploadDate: string,        // ISO 8601 format: YYYY-MM-DD
  contentUrl: string,        // Full URL to video file
  duration: string,          // ISO 8601 format: PT#M#S (e.g., PT3M30S)
}
```

## Files Modified

1. **`src/data/video-metadata.ts`** (NEW)
   - Centralized video metadata repository
   - Type-safe video information
   - Functions to retrieve videos by category
   - Template structure for future service videos

2. **`src/pages/Index.tsx`**
   - Imports `videoSchema` and `getHomepageVideos`
   - Generates VideoObject schemas for all homepage videos
   - Adds schemas to SEO component's `additionalSchemas` prop

## Future Expansion

### 🚀 **Service Demonstration Videos**

Template structure ready for adding service-specific videos:

#### EIFS Installation Demo
```typescript
{
  name: "EIFS Installation Process - Exterior Insulation and Finish System",
  description: "Step-by-step EIFS installation...",
  duration: "PT3M30S",
  category: "EIFS Services"
}
```

#### Masonry Restoration Demo
```typescript
{
  name: "Masonry Restoration & Tuckpointing...",
  description: "Professional masonry restoration...",
  duration: "PT4M15S",
  category: "Masonry Services"
}
```

#### Parking Garage Restoration Demo
```typescript
{
  name: "Parking Garage Restoration - Concrete Repair...",
  description: "Comprehensive parking garage restoration...",
  duration: "PT5M45S",
  category: "Parking Garage Services"
}
```

## How to Add New Service Videos

### Step 1: Create Video Content
1. Record high-quality service demonstration video
2. Export in web-optimized format (H.264, 1-3 Mbps)
3. Create poster/thumbnail image (WebP/JPG, optimized)
4. Upload to `/public/videos/` directory

### Step 2: Add Metadata
Update `src/data/video-metadata.ts`:

```typescript
export const serviceDemoVideos: Record<string, VideoMetadata> = {
  "your-service-slug": {
    name: "SEO-Optimized Video Title with Keywords",
    description: "Detailed description 150-300 characters including service keywords, location (GTA/Toronto), and benefits. Focus on value proposition and expertise.",
    thumbnailUrl: "/videos/your-service-thumbnail.webp",
    uploadDate: "2025-MM-DD", // Actual upload date
    duration: "PT#M#S", // Calculate actual duration
    contentUrl: "/videos/your-service-demo.mp4",
    category: "Service Category"
  }
};
```

### Step 3: Add to Service Page
Update the relevant service page (e.g., `src/pages/services/EIFSPage.tsx`):

```tsx
import { videoSchema } from "@/utils/structured-data";
import { serviceDemoVideos } from "@/data/video-metadata";

const eifsDemoVideo = serviceDemoVideos["eifs-installation"];
const eifsDemoSchema = eifsDemoVideo ? videoSchema({
  ...eifsDemoVideo,
  thumbnailUrl: `${window.location.origin}${eifsDemoVideo.thumbnailUrl}`,
  contentUrl: `${window.location.origin}${eifsDemoVideo.contentUrl}`
}) : null;

// In SEO component:
<SEO
  title="EIFS Installation Services..."
  additionalSchemas={eifsDemoSchema ? [eifsDemoSchema, ...otherSchemas] : otherSchemas}
/>
```

## Duration Format (ISO 8601)

### Examples:
- `PT30S` = 30 seconds
- `PT1M30S` = 1 minute 30 seconds
- `PT3M` = 3 minutes
- `PT5M45S` = 5 minutes 45 seconds
- `PT1H30M` = 1 hour 30 minutes

### Calculation:
```typescript
// Use this helper if needed:
const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (seconds > 0) duration += `${seconds}S`;
  
  return duration;
};
```

## SEO Benefits

### 1. **Video Rich Snippets**
- Thumbnail preview in Google search results
- Duration badge overlay
- Play button icon
- Higher click-through rates (CTR)

### 2. **AI Engine Citations**
- ChatGPT, Claude, Perplexity can reference video content
- Video descriptions included in AI summaries
- Enhanced credibility through multimedia presence

### 3. **Google Video Search**
- Videos appear in dedicated video search results
- Category filtering for service-specific queries
- Enhanced discoverability

### 4. **Voice Assistant Integration**
- Alexa, Siri, Google Assistant can surface video content
- "Show me videos about..." queries
- Smart display integration

## Validation

### Test Your VideoObject Schema:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **JSON-LD Playground**: https://json-ld.org/playground/

### Check Implementation:
```javascript
// In browser console:
JSON.parse(
  document.querySelector('script[type="application/ld+json"]')?.textContent || '{}'
)
```

## Performance Considerations

### Video File Optimization:
- ✅ Desktop: 1920x1080, 2-3 Mbps, H.264
- ✅ Mobile: 1280x720, 1-1.5 Mbps, H.264
- ✅ Poster images: WebP format, < 200KB
- ✅ Lazy loading: `preload="metadata"` for hero, `preload="none"` for below-fold

### Thumbnail Requirements:
- **Minimum resolution**: 160x90px
- **Recommended resolution**: 1280x720px (16:9 aspect ratio)
- **Maximum file size**: 200KB
- **Supported formats**: JPG, PNG, WebP (WebP preferred)

## Analytics Tracking

### Video Engagement Metrics:
Consider adding tracking for:
- Video play/pause events
- Watch time percentage (25%, 50%, 75%, 100%)
- Video completion rate
- Thumbnail click-through rate

### Example Implementation:
```typescript
const trackVideoEvent = (action: string, videoName: string) => {
  // Add your analytics tracking here
  console.log(`Video ${action}: ${videoName}`);
};
```

## Maintenance

### Regular Updates:
- ✅ Keep upload dates accurate
- ✅ Update thumbnails if video content changes
- ✅ Verify video URLs are accessible
- ✅ Monitor video file sizes and loading performance
- ✅ Update descriptions to match current service offerings

### Quarterly Review:
- Check Google Search Console for video performance
- Analyze which videos drive most traffic
- Update or replace underperforming videos
- Add new service demonstration videos

## Support Resources

- **Schema.org VideoObject**: https://schema.org/VideoObject
- **Google Video Structured Data**: https://developers.google.com/search/docs/appearance/structured-data/video
- **Video SEO Best Practices**: https://developers.google.com/search/docs/appearance/video
- **ISO 8601 Duration Format**: https://en.wikipedia.org/wiki/ISO_8601#Durations

---

**Status**: ✅ Hero video schema implemented and active  
**Next Steps**: Create and add service demonstration videos  
**Maintained By**: Development Team  
**Last Updated**: 2025-01-19
