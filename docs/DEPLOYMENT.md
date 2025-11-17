# Deployment Guide - Ascent Group Construction

## Custom Domain Configuration

### Connecting Your Domain

1. Navigate to **Project Settings → Domains** in Lovable
2. Enter your custom domain: `ascentgroupconstruction.com`
3. Follow the DNS configuration steps provided

### DNS Configuration

Add the following DNS records at your domain registrar:

**Option 1: CNAME Record (Recommended)**
```
Type: CNAME
Name: @ (or root)
Value: [provided by Lovable]
TTL: 3600
```

**Option 2: A Record**
```
Type: A
Name: @ (or root)
Value: [IP address provided by Lovable]
TTL: 3600
```

### www to non-www Redirect

✅ **Automatic**: Lovable's hosting platform automatically handles `www` to non-`www` redirects when your custom domain is connected.

No manual `.htaccess` or nginx configuration needed. The platform ensures:
- `https://www.ascentgroupconstruction.com` → `https://ascentgroupconstruction.com`
- Permanent 301 redirects for SEO
- SSL/TLS certificates auto-provisioned

---

## Performance Optimization

### CDN & Caching

✅ **Automatic**: Lovable's CDN provides:

- **Global Edge Network**: Content delivered from nearest geographic location
- **Brotli/Gzip Compression**: Automatic compression for all text assets
- **HTTP/2 Support**: Multiplexing and server push enabled
- **Long Cache Lifetimes**: Static assets cached with optimal headers
- **Cache Busting**: Vite generates hashed filenames (e.g., `index-abc123.css`)

### Cache Headers (Automatic)

```
Static Assets (JS, CSS, Images):
  Cache-Control: public, max-age=31536000, immutable

HTML Files:
  Cache-Control: public, max-age=0, must-revalidate
```

### SSL/TLS

- **Auto-provisioned**: SSL certificates automatically generated and renewed
- **HTTPS Enforced**: Automatic redirect from HTTP to HTTPS
- **HSTS Enabled**: HTTP Strict Transport Security headers

---

## Web Vitals Monitoring

Web Vitals tracking is implemented and sends metrics to Google Analytics (GA4).

### Metrics Tracked

- **LCP** (Largest Contentful Paint): Target ≤ 2.5s
- **CLS** (Cumulative Layout Shift): Target < 0.1
- **INP** (Interaction to Next Paint): Target ≤ 200ms
- **FCP** (First Contentful Paint): Target ≤ 1.8s
- **TTFB** (Time to First Byte): Target ≤ 800ms

### Viewing Metrics in GA4

1. Navigate to **Google Analytics 4 → Events**
2. Look for custom events: `CLS`, `INP`, `LCP`, `FCP`, `TTFB`
3. Metrics appear after 5-10 pageviews
4. Create custom reports for monitoring trends

---

## Google Search Console

### Verification

1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://ascentgroupconstruction.com`
3. Choose verification method: **HTML tag**
4. Copy verification code
5. Update `index.html` line 74 with actual code:
   ```html
   <meta name="google-site-verification" content="YOUR_ACTUAL_CODE_HERE" />
   ```

### Post-Launch Checklist

After deploying with custom domain:

✅ Submit sitemap: `https://ascentgroupconstruction.com/sitemap.xml`  
✅ Request indexing for key pages  
✅ Monitor Core Web Vitals report  
✅ Check Mobile Usability report  
✅ Review Coverage report for indexing issues  

---

## Performance Testing

### Tools

- **Lighthouse**: Built into Chrome DevTools (Run on mobile profile)
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/ (Test from multiple locations)

### Testing Checklist

Run tests before and after deployment:

```bash
# Lighthouse CLI (if installed)
npx lighthouse https://ascentgroupconstruction.com --view --preset=desktop
npx lighthouse https://ascentgroupconstruction.com --view --preset=mobile --throttling.cpuSlowdownMultiplier=4
```

### Expected Targets (Mobile)

- **Performance**: 90-92
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **LCP**: 2.0-2.5s
- **CLS**: < 0.1

---

## Troubleshooting

### Domain Not Connecting

1. Verify DNS records propagated: `dig ascentgroupconstruction.com`
2. Wait 24-48 hours for full DNS propagation
3. Clear browser cache and test in incognito mode

### Slow Performance

1. Check Web Vitals in GA4 for specific metrics
2. Run Lighthouse audit to identify bottlenecks
3. Verify CDN serving assets (check Response Headers)
4. Test from multiple geographic locations

### SSL Certificate Issues

1. Certificate auto-renews every 90 days
2. If issues persist, contact Lovable support
3. Verify domain ownership is current

---

## Production Deployment Steps

1. ✅ Generate production build via Lovable dashboard
2. ✅ Connect custom domain `ascentgroupconstruction.com`
3. ✅ Verify DNS configuration
4. ✅ Test SSL certificate
5. ✅ Submit sitemap to Google Search Console
6. ✅ Run Lighthouse audit (mobile + desktop)
7. ✅ Monitor Web Vitals in GA4 for 7 days
8. ✅ Set up uptime monitoring (optional: UptimeRobot, Pingdom)

---

## Support

- **Lovable Documentation**: https://docs.lovable.dev/
- **Community Discord**: https://discord.com/channels/lovable
- **GA4 Help**: https://support.google.com/analytics
