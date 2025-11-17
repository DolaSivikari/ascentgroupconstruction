// Personalization Engine
interface UserProfile {
  id?: string;
  referralSource?: string;
  location?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  visitCount: number;
  lastVisit?: Date;
  interests: string[];
  viewedServices: string[];
  interactedElements: string[];
}

interface PersonalizedContent {
  heroHeadline?: string;
  ctaText?: string;
  featuredServices?: string[];
  urgencyMessage?: string;
}

class PersonalizationEngine {
  private profile: UserProfile | null = null;

  /**
   * Initialize user profile
   */
  initialize(): UserProfile {
    const stored = localStorage.getItem('user_profile');
    
    if (stored) {
      this.profile = JSON.parse(stored);
      this.profile!.visitCount++;
      this.profile!.lastVisit = new Date();
    } else {
      this.profile = {
        deviceType: this.detectDeviceType(),
        timeOfDay: this.getTimeOfDay(),
        visitCount: 1,
        interests: [],
        viewedServices: [],
        interactedElements: [],
      };
    }

    // Detect referral source
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    if (utmSource) {
      this.profile.referralSource = utmSource;
    }

    // Detect location (you can use IP geolocation API for more accuracy)
    this.detectLocation();

    this.save();
    return this.profile;
  }

  /**
   * Get personalized content based on user profile
   */
  getPersonalizedContent(): PersonalizedContent {
    if (!this.profile) {
      this.initialize();
    }

    const content: PersonalizedContent = {};

    // Personalize based on time of day
    if (this.profile!.timeOfDay === 'night' || this.profile!.timeOfDay === 'evening') {
      content.urgencyMessage = '24/7 Emergency Service Available';
    }

    // Personalize based on device
    if (this.profile!.deviceType === 'mobile') {
      content.ctaText = 'Call Now';
    } else {
      content.ctaText = 'Request Free Consultation';
    }

    // Personalize based on visit count
    if (this.profile!.visitCount === 1) {
      content.heroHeadline = 'Ontario\'s Trusted Building Envelope Specialists';
    } else if (this.profile!.visitCount > 3) {
      content.heroHeadline = 'Welcome Back! Ready to Start Your Project?';
    }

    // Personalize based on referral source
    if (this.profile!.referralSource?.includes('google')) {
      content.featuredServices = ['Emergency Response', 'Free Assessment', 'COR Certified'];
    } else if (this.profile!.referralSource?.includes('social')) {
      content.featuredServices = ['View Gallery', 'Client Reviews', 'Success Stories'];
    }

    return content;
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, data?: any): void {
    if (!this.profile) {
      this.initialize();
    }

    this.profile!.interactedElements.push(element);

    // Track viewed services
    if (element === 'service_view' && data?.service) {
      this.profile!.viewedServices.push(data.service);
    }

    // Infer interests based on interactions
    if (element.includes('masonry') || element.includes('brick')) {
      if (!this.profile!.interests.includes('masonry')) {
        this.profile!.interests.push('masonry');
      }
    }

    this.save();
  }

  /**
   * Get recommended services based on profile
   */
  getRecommendedServices(): string[] {
    if (!this.profile) {
      this.initialize();
    }

    const recommendations: string[] = [];

    // Based on viewed services
    if (this.profile!.viewedServices.length > 0) {
      // If they viewed facade services, recommend related services
      if (this.profile!.viewedServices.some(s => s.includes('facade'))) {
        recommendations.push('Waterproofing', 'Caulking & Sealants');
      }
    }

    // Based on interests
    if (this.profile!.interests.includes('masonry')) {
      recommendations.push('Brick Restoration', 'Stone Repair');
    }

    // Default recommendations for new visitors
    if (recommendations.length === 0) {
      recommendations.push('Building Envelope Assessment', 'Emergency Repairs', 'Preventive Maintenance');
    }

    return recommendations;
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get time of day
   */
  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Detect user location (basic implementation)
   */
  private async detectLocation(): Promise<void> {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (this.profile) {
        this.profile.location = `${data.city}, ${data.region}`;
        this.save();
      }
    } catch (error) {
      console.warn('Could not detect location:', error);
    }
  }

  /**
   * Save profile to localStorage
   */
  private save(): void {
    if (this.profile) {
      localStorage.setItem('user_profile', JSON.stringify(this.profile));
    }
  }

  /**
   * Get current profile
   */
  getProfile(): UserProfile | null {
    return this.profile;
  }
}

// Export singleton instance
export const personalization = new PersonalizationEngine();
