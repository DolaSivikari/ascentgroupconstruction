# Hero Video Optimization Guide

## Current Implementation

The hero section now implements several optimizations:
- **Lazy Loading**: Videos use `preload="metadata"` to load only essential data initially
- **Smooth Transitions**: 400ms fade delay between poster and video for seamless crossfade
- **Improved Event Handling**: Both `onLoadedData` and `onCanPlay` events trigger video readiness
- **Mobile Optimization**: Separate mobile video source path for lighter file sizes

## Video Compression Recommendations

### Recommended Video Specifications

For optimal performance across devices:

**Desktop Video** (`hero-clipchamp.mp4`):
- Resolution: 1920x1080 (Full HD)
- Bitrate: 2-3 Mbps (target: 2.5 Mbps)
- Codec: H.264 (High Profile)
- Frame Rate: 24-30 fps
- File Size Target: < 5 MB for 10-second loop
- Audio: Remove (videos are muted)

**Mobile Video** (`hero-clipchamp-mobile.mp4`):
- Resolution: 1280x720 (HD)
- Bitrate: 1-1.5 Mbps
- Codec: H.264 (Main Profile)
- Frame Rate: 24 fps
- File Size Target: < 2 MB for 10-second loop
- Audio: Remove (videos are muted)

### Compression Tools

#### Option 1: FFmpeg (Command Line - Most Control)

**Desktop compression:**
```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -preset slow -crf 23 -b:v 2.5M -maxrate 3M -bufsize 6M -an -movflags +faststart hero-clipchamp.mp4
```

**Mobile compression:**
```bash
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 25 -b:v 1.2M -maxrate 1.5M -bufsize 3M -an -movflags +faststart hero-clipchamp-mobile.mp4
```

Key flags explained:
- `-vf scale`: Set resolution
- `-crf`: Quality (23 = high quality, 25 = good quality)
- `-b:v`: Target bitrate
- `-maxrate`/`-bufsize`: Rate control
- `-an`: Remove audio
- `-movflags +faststart`: Enable progressive download

#### Option 2: HandBrake (GUI - User Friendly)

1. Download HandBrake: https://handbrake.fr/
2. Load your video
3. Set these parameters:
   - **Summary Tab**:
     - Format: MP4
     - Web Optimized: ✓
   - **Dimensions Tab**:
     - Desktop: 1920x1080
     - Mobile: 1280x720
   - **Video Tab**:
     - Encoder: H.264 (x264)
     - Framerate: 24 or 30 fps (Same as source)
     - Quality: Constant Quality RF 23 (desktop) or RF 25 (mobile)
     - Encoder Preset: Slow
   - **Audio Tab**:
     - Remove all audio tracks

#### Option 3: Online Tools (Quick & Easy)

- **Cloudinary**: https://cloudinary.com/video-editor
- **Clideo**: https://clideo.com/compress-video
- **Kapwing**: https://www.kapwing.com/tools/compress-video

Settings to use:
- Target resolution: 1920x1080 (desktop) or 1280x720 (mobile)
- Quality: High (desktop) or Medium-High (mobile)
- Remove audio

### Current File Analysis

Check your current file sizes:
```bash
ls -lh public/hero-clipchamp.mp4
```

If the file is > 10 MB, compression is highly recommended.

## Additional Optimizations

### 1. Create Multiple Poster Images

Generate optimized poster images from video frames:

```bash
# Extract frame at 1 second
ffmpeg -i hero-clipchamp.mp4 -ss 00:00:01 -vframes 1 -q:v 2 public/hero-poster-temp.jpg

# Convert to WebP (better compression)
ffmpeg -i public/hero-poster-temp.jpg -q:v 80 public/hero-poster-1.webp
```

Repeat for all 6 hero slides with appropriate filenames.

### 2. Implement Adaptive Streaming (Future)

For even better performance with very large videos, consider:
- **HLS (HTTP Live Streaming)**: Breaks video into chunks
- **DASH**: Similar to HLS, better cross-browser support
- Services: Cloudflare Stream, Mux, AWS CloudFront

### 3. CDN Delivery

Host videos on a CDN for faster delivery:
- Cloudflare R2
- AWS S3 + CloudFront
- Vercel Blob Storage
- Bunny CDN

### 4. Lazy Load Below-the-Fold Videos

If you add videos elsewhere on the page:
```tsx
<video preload="none" loading="lazy">
  <source src="/video.mp4" type="video/mp4" />
</video>
```

## Performance Targets

After optimization, aim for:
- **Desktop**: < 5 MB per video file
- **Mobile**: < 2 MB per video file
- **Poster Images**: < 200 KB per WebP image
- **LCP**: < 2.5 seconds
- **First Contentful Paint**: < 1.8 seconds

## Testing

1. **Test loading performance:**
   - Chrome DevTools → Network tab (throttle to "Slow 3G")
   - Measure time to video playback

2. **Test on real devices:**
   - iOS Safari (iPhone)
   - Android Chrome
   - Desktop browsers

3. **PageSpeed Insights:**
   - Run before and after compression
   - Compare mobile/desktop scores

## Implementation Checklist

- [ ] Compress desktop video to ~2.5 Mbps
- [ ] Create mobile version at ~1.2 Mbps
- [ ] Generate WebP poster images
- [ ] Test on slow network connections
- [ ] Verify smooth poster-to-video transitions
- [ ] Run PageSpeed Insights
- [ ] Test on mobile devices
- [ ] Consider CDN for video delivery

## Need Help?

For video compression assistance or questions about optimization, refer to:
- FFmpeg documentation: https://ffmpeg.org/documentation.html
- Web.dev video guidance: https://web.dev/fast/#optimize-your-images
- Performance optimization doc: `/docs/PERFORMANCE_OPTIMIZATION_2025.md`
