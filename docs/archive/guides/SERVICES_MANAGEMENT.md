# Services Management System

## Overview

The Services Management System provides a comprehensive solution for managing, analyzing, and optimizing the Popular Services feature in your mobile navigation. It includes analytics tracking, personalized recommendations, featured services management, seasonal promotions, and A/B testing capabilities.

## Features

### 1. Analytics Dashboard
Track and analyze how users interact with Popular Services:
- **Impressions**: Total views of service cards
- **Clicks**: Number of service clicks
- **Conversions**: User actions after clicking
- **CTR (Click-Through Rate)**: Percentage of views that result in clicks
- **Service Performance**: Detailed metrics for each service

**Access**: `/admin/services-management` → Analytics tab

### 2. Smart Recommendations
Three recommendation modes:
- **Trending**: Data-driven based on search analytics (default)
- **Personalized**: Based on user's viewing history and preferences
- **Featured**: Admin-curated services with priority display

The system automatically tracks user interactions and builds personalized recommendations over time.

### 3. Featured Services Management
Admins can manually curate which services appear in Popular Services:
- Set display order
- Add promotional badges
- Set date ranges for temporary featuring
- Category organization
- Custom descriptions

**Access**: `/admin/services-management` → Featured Services tab

### 4. Seasonal Promotions
Create time-limited promotions for services:
- **Types**: Seasonal, Campaign, Urgent, New
- **Custom badges**: Text and colors
- **Discount percentages**: Display special offers
- **Priority system**: Control which promotions show first
- **Target audience**: Coming soon
- **Promotion messages**: Additional context

**Access**: `/admin/services-management` → Promotions tab

### 5. A/B Testing Framework
Test different variations of Popular Services (Coming Soon):
- Variant creation and management
- Performance comparison
- Statistical significance testing
- Automatic winner selection

**Access**: `/admin/services-management` → A/B Tests tab

## Database Tables

### `featured_services`
Stores admin-curated featured services
```sql
- id: UUID
- service_name: TEXT
- service_link: TEXT
- icon_name: TEXT
- display_order: INTEGER
- is_active: BOOLEAN
- category: TEXT
- description: TEXT
- promotion_badge: TEXT
- start_date: TIMESTAMPTZ
- end_date: TIMESTAMPTZ
```

### `service_promotions`
Manages seasonal and campaign promotions
```sql
- id: UUID
- title: TEXT
- service_link: TEXT
- promotion_type: TEXT (seasonal|campaign|urgent|new)
- badge_text: TEXT
- badge_color: TEXT
- priority: INTEGER
- start_date: TIMESTAMPTZ
- end_date: TIMESTAMPTZ
- promotion_message: TEXT
- discount_percentage: INTEGER
```

### `popular_services_analytics`
Tracks all user interactions
```sql
- id: UUID
- service_link: TEXT
- service_name: TEXT
- event_type: TEXT (impression|click|conversion)
- user_identifier: TEXT
- session_id: TEXT
- source: TEXT
- position: INTEGER
- variant: TEXT
```

### `user_service_preferences`
Stores user interaction history for personalization
```sql
- id: UUID
- user_identifier: TEXT
- service_link: TEXT
- interaction_count: INTEGER
- last_viewed_at: TIMESTAMPTZ
- time_spent_seconds: INTEGER
- clicked_from_popular: BOOLEAN
```

### `service_recommendations_cache`
Caches personalized recommendations
```sql
- id: UUID
- user_identifier: TEXT
- recommended_services: JSONB
- recommendation_score: FLOAT
- algorithm_version: TEXT
- expires_at: TIMESTAMPTZ
```

## API Functions

### `get_active_featured_services()`
Returns currently active featured services based on date ranges and active status.

### `get_active_promotions()`
Returns active promotions sorted by priority.

### `track_service_interaction(user_identifier, service_link, time_spent, from_popular)`
Records user interactions with services for personalization.

### `get_personalized_recommendations(user_identifier, limit)`
Generates personalized service recommendations using:
- User's past interactions
- Trending services
- Collaborative filtering

## Usage

### For Developers

#### Tracking Analytics
```typescript
import { useServiceAnalytics } from '@/hooks/useServiceAnalytics';

const { trackEvent, trackInteraction } = useServiceAnalytics();

// Track impression
trackEvent({
  service_link: '/services/waterproofing',
  service_name: 'Waterproofing',
  event_type: 'impression',
  position: 0,
  variant: 'trending'
});

// Track click
trackEvent({
  service_link: '/services/waterproofing',
  service_name: 'Waterproofing',
  event_type: 'click',
  position: 0,
  variant: 'trending'
});

// Track interaction
trackInteraction({
  serviceLink: '/services/waterproofing',
  timeSpent: 45,
  fromPopular: true
});
```

#### Using Smart Popular Services
```typescript
import { SmartPopularServices } from '@/components/navigation/SmartPopularServices';

// Default trending mode
<SmartPopularServices onLinkClick={handleClose} />

// Personalized mode
<SmartPopularServices onLinkClick={handleClose} variant="personalized" />

// Featured mode
<SmartPopularServices onLinkClick={handleClose} variant="featured" />
```

### For Admins

#### Creating Featured Services
1. Go to `/admin/services-management`
2. Click "Featured Services" tab
3. Click "Add Service"
4. Fill in:
   - Service Name (e.g., "Waterproofing")
   - Service Link (e.g., "/services/waterproofing")
   - Icon Name (from Lucide icons)
   - Display Order (lower = higher priority)
   - Optional: Category, Description, Promotion Badge
5. Set date range if temporary
6. Click "Create"

#### Creating Promotions
1. Go to `/admin/services-management`
2. Click "Promotions" tab
3. Click "Add Promotion"
4. Fill in:
   - Title
   - Service Link
   - Promotion Type
   - Badge Text (e.g., "20% OFF")
   - Start and End Dates
   - Priority (1-10)
   - Optional: Discount %, Promotion Message
5. Click "Create"

#### Viewing Analytics
1. Go to `/admin/services-management`
2. Default view shows Analytics Dashboard
3. Review:
   - Summary metrics (Impressions, Clicks, CTR, Conversions)
   - Service Performance table
   - Top performing services

## Performance Optimization

The system includes several optimizations:

1. **Caching**: 
   - Recommendations cached for 10 minutes
   - Featured services cached for 15 minutes
   - Analytics cached for 2 minutes

2. **Database Indexes**:
   - Composite indexes on frequently queried fields
   - Date range indexes for active promotions

3. **Lazy Loading**:
   - Services only tracked when in viewport
   - Uses Intersection Observer API

4. **Query Optimization**:
   - Parallel fetching of trending, featured, and promotions
   - Efficient aggregation queries

## Security

### Row Level Security (RLS)
- **Featured Services**: Public read, admin write
- **Promotions**: Public read active ones, admin write
- **Analytics**: Anyone can insert, admins read
- **User Preferences**: Users manage their own
- **Recommendations**: Users read their own

### Admin Access
All admin functions check for admin role using `is_admin(auth.uid())`

## Future Enhancements

1. **A/B Testing**:
   - Variant creation UI
   - Statistical significance testing
   - Auto-winner selection

2. **Advanced Personalization**:
   - Machine learning recommendations
   - Collaborative filtering
   - Seasonal adjustments

3. **Campaign Management**:
   - Email integration for promotions
   - Multi-service campaigns
   - ROI tracking

4. **Enhanced Analytics**:
   - Conversion funnel analysis
   - Heat maps for mobile navigation
   - User journey tracking
   - Export capabilities

## Troubleshooting

### Services not showing
- Check if services are marked as `is_active`
- Verify date ranges for featured services
- Ensure search analytics has sufficient data (>50 searches)

### Recommendations not personalizing
- User needs at least 3 interactions
- Check recommendation cache hasn't expired
- Verify user_identifier is being tracked

### Analytics not tracking
- Ensure user has granted localStorage access
- Check browser console for errors
- Verify RLS policies allow insertions

## Support

For questions or issues, contact the development team or refer to:
- [Lovable Cloud Documentation](https://docs.lovable.dev)
- Project issue tracker
- Admin dashboard help section
