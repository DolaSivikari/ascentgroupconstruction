// Google Analytics & GTM Helper Functions

interface GTMEvent {
  event: string;
  [key: string]: any;
}

// Push events to GTM dataLayer
export const pushToDataLayer = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

// Page view tracking
export const trackPageView = (url: string, title: string) => {
  pushToDataLayer({
    event: 'pageview',
    page_path: url,
    page_title: title,
  });
};

// Conversion tracking
export const trackConversion = (eventName: string, data?: Record<string, any>) => {
  pushToDataLayer({
    event: eventName,
    ...data,
  });
};

// Form submission tracking
export const trackFormSubmit = (formName: string, formData?: Record<string, any>) => {
  pushToDataLayer({
    event: 'form_submit',
    form_name: formName,
    ...formData,
  });
};

// Form interaction tracking - NEW
export const trackFormStart = (formName: string) => {
  pushToDataLayer({
    event: 'form_start',
    form_name: formName,
  });
};

export const trackFormError = (formName: string, errorField: string, errorMessage: string) => {
  pushToDataLayer({
    event: 'form_error',
    form_name: formName,
    error_field: errorField,
    error_message: errorMessage,
  });
};

export const trackFormAbandonment = (formName: string, lastField: string, timeSpent: number) => {
  pushToDataLayer({
    event: 'form_abandonment',
    form_name: formName,
    last_field: lastField,
    time_spent_seconds: timeSpent,
  });
};

// CTA click tracking
export const trackCTAClick = (ctaName: string, ctaLocation: string) => {
  pushToDataLayer({
    event: 'cta_click',
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
};

// Phone click tracking
export const trackPhoneClick = (location: string = 'unknown') => {
  pushToDataLayer({
    event: 'phone_click',
    conversion_label: 'phone_call',
    click_location: location,
  });
};

// Email click tracking - NEW
export const trackEmailClick = (location: string = 'unknown') => {
  pushToDataLayer({
    event: 'email_click',
    click_location: location,
  });
};

// File download tracking
export const trackFileDownload = (fileName: string, fileType: string) => {
  pushToDataLayer({
    event: 'file_download',
    file_name: fileName,
    file_type: fileType,
  });
};

// Outbound link tracking
export const trackOutboundLink = (url: string, linkText: string) => {
  pushToDataLayer({
    event: 'outbound_click',
    outbound_url: url,
    link_text: linkText,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number) => {
  pushToDataLayer({
    event: 'scroll_depth',
    scroll_percentage: depth,
  });
};

// Time on page tracking - NEW
export const trackTimeOnPage = (pageName: string, timeSeconds: number) => {
  pushToDataLayer({
    event: 'time_on_page',
    page_name: pageName,
    time_seconds: timeSeconds,
  });
};

// Video interaction tracking
export const trackVideoPlay = (videoName: string, location: string) => {
  pushToDataLayer({
    event: 'video_play',
    video_name: videoName,
    video_location: location,
  });
};

export const trackVideoComplete = (videoName: string, location: string) => {
  pushToDataLayer({
    event: 'video_complete',
    video_name: videoName,
    video_location: location,
  });
};

// Interactive element tracking
export const trackInteraction = (elementType: string, elementName: string, action: string) => {
  pushToDataLayer({
    event: 'user_interaction',
    element_type: elementType,
    element_name: elementName,
    interaction_action: action,
  });
};

// Before/After slider tracking - NEW
export const trackBeforeAfterInteraction = (projectName: string) => {
  pushToDataLayer({
    event: 'before_after_interaction',
    project_name: projectName,
  });
};

// Filter usage tracking - NEW
export const trackFilterUsage = (filterType: string, filterValue: string, location: string) => {
  pushToDataLayer({
    event: 'filter_used',
    filter_type: filterType,
    filter_value: filterValue,
    page_location: location,
  });
};

// Quiz tracking
export const trackQuizStart = () => {
  pushToDataLayer({
    event: 'quiz_start',
  });
};

export const trackQuizComplete = (results: string[]) => {
  pushToDataLayer({
    event: 'quiz_complete',
    quiz_results: results,
  });
};

// TypeScript declaration for window.dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
