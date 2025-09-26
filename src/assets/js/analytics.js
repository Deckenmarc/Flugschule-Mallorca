// Analytics and lead generation tracking
// Supports Google Analytics 4, Google Tag Manager, and custom event tracking

class AnalyticsManager {
  constructor() {
    this.isInitialized = false;
    this.leadEvents = [];
    this.pageViews = [];
    
    // Initialize analytics when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.setupGoogleAnalytics();
    this.setupLeadTracking();
    this.setupPerformanceTracking();
    this.trackPageView();
    this.isInitialized = true;
  }

  setupGoogleAnalytics() {
    // Google Analytics 4 setup
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      // Enhanced ecommerce and lead tracking
      send_page_view: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: false, // GDPR compliance
      cookie_flags: 'SameSite=Strict;Secure'
    });

    // Custom dimensions for flight school tracking
    gtag('config', GA_MEASUREMENT_ID, {
      custom_map: {
        'custom_parameter_1': 'course_interest',
        'custom_parameter_2': 'lead_source',
        'custom_parameter_3': 'contact_method'
      }
    });
  }

  setupLeadTracking() {
    // Track form interactions
    document.addEventListener('submit', (event) => {
      if (event.target.matches('form[data-netlify="true"]')) {
        this.trackLeadGeneration(event.target);
      }
    });

    // Track CTA button clicks
    document.addEventListener('click', (event) => {
      if (event.target.matches('[data-track="cta"]')) {
        this.trackCTAClick(event.target);
      }
    });

    // Track phone number clicks
    document.addEventListener('click', (event) => {
      if (event.target.matches('a[href^="tel:"]')) {
        this.trackPhoneClick(event.target);
      }
    });

    // Track email clicks
    document.addEventListener('click', (event) => {
      if (event.target.matches('a[href^="mailto:"]')) {
        this.trackEmailClick(event.target);
      }
    });
  }

  setupPerformanceTracking() {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendToAnalytics.bind(this));
        getFID(this.sendToAnalytics.bind(this));
        getFCP(this.sendToAnalytics.bind(this));
        getLCP(this.sendToAnalytics.bind(this));
        getTTFB(this.sendToAnalytics.bind(this));
      });
    }

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        this.trackPerformance(perfData);
      }, 0);
    });
  }

  trackPageView(page = null) {
    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page || window.location.pathname,
      content_group1: this.getContentGroup(),
      content_group2: this.getPageType()
    };

    if (window.gtag) {
      gtag('event', 'page_view', pageData);
    }

    // Custom page view tracking
    this.pageViews.push({
      ...pageData,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      user_agent: navigator.userAgent
    });
  }

  trackLeadGeneration(form) {
    const formData = new FormData(form);
    const courseInterest = formData.get('courseInterest') || 'unknown';
    const contactMethod = formData.get('preferredContact') || 'email';
    
    const leadData = {
      event_category: 'Lead Generation',
      event_label: courseInterest,
      course_interest: courseInterest,
      contact_method: contactMethod,
      lead_source: this.getLeadSource(),
      value: this.getLeadValue(courseInterest)
    };

    if (window.gtag) {
      gtag('event', 'generate_lead', leadData);
    }

    // Store lead event for analysis
    this.leadEvents.push({
      ...leadData,
      timestamp: new Date().toISOString(),
      form_id: form.id || 'contact-form',
      page_path: window.location.pathname
    });

    console.log('Lead generation tracked:', leadData);
  }

  trackCTAClick(element) {
    const ctaData = {
      event_category: 'CTA',
      event_label: element.textContent.trim(),
      cta_position: this.getElementPosition(element),
      page_section: this.getPageSection(element)
    };

    if (window.gtag) {
      gtag('event', 'click', ctaData);
    }
  }

  trackPhoneClick(element) {
    const phoneNumber = element.href.replace('tel:', '');
    
    if (window.gtag) {
      gtag('event', 'phone_call', {
        event_category: 'Contact',
        event_label: phoneNumber,
        phone_number: phoneNumber
      });
    }
  }

  trackEmailClick(element) {
    const email = element.href.replace('mailto:', '');
    
    if (window.gtag) {
      gtag('event', 'email_click', {
        event_category: 'Contact',
        event_label: email,
        email_address: email
      });
    }
  }

  trackPerformance(perfData) {
    const performanceMetrics = {
      event_category: 'Performance',
      page_load_time: Math.round(perfData.loadEventEnd - perfData.navigationStart),
      dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
      first_paint: Math.round(perfData.responseEnd - perfData.navigationStart)
    };

    if (window.gtag) {
      gtag('event', 'timing_complete', performanceMetrics);
    }
  }

  sendToAnalytics(metric) {
    if (window.gtag) {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true
      });
    }
  }

  // Helper methods
  getContentGroup() {
    const path = window.location.pathname;
    if (path.includes('flugschule')) return 'Flight Training';
    if (path.includes('charter')) return 'Charter Services';
    if (path.includes('flotte')) return 'Fleet Information';
    return 'Homepage';
  }

  getPageType() {
    return window.location.pathname === '/' ? 'Landing Page' : 'Content Page';
  }

  getLeadSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const referrer = document.referrer;
    
    if (utmSource) return utmSource;
    if (referrer.includes('google')) return 'google_organic';
    if (referrer.includes('facebook')) return 'facebook';
    if (referrer.includes('instagram')) return 'instagram';
    if (referrer) return 'referral';
    return 'direct';
  }

  getLeadValue(courseInterest) {
    // Assign values based on course type for ROI tracking
    const values = {
      'online-solo': 100,
      'online-instructor': 200,
      'presence-mallorca': 500
    };
    return values[courseInterest] || 150;
  }

  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return Math.round(rect.top + scrollTop);
  }

  getPageSection(element) {
    const section = element.closest('section, header, main, footer');
    return section ? section.id || section.className : 'unknown';
  }

  // GDPR compliance methods
  enableAnalytics() {
    if (window.gtag) {
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  }

  disableAnalytics() {
    if (window.gtag) {
      gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  }

  // Export data for analysis
  exportLeadData() {
    return {
      leads: this.leadEvents,
      pageViews: this.pageViews,
      exportDate: new Date().toISOString()
    };
  }
}

// Initialize analytics
const analytics = new AnalyticsManager();

// Export for use in other scripts
window.FlugschuleAnalytics = analytics;