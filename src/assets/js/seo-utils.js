/**
 * SEO Utilities for Flugschule Mallorca
 * Handles dynamic SEO enhancements and monitoring
 */

class SEOUtils {
  constructor() {
    this.init();
  }

  init() {
    this.addCanonicalLinks();
    this.optimizeImages();
    this.addBreadcrumbs();
    this.monitorPagePerformance();
    this.enhanceInternalLinking();
  }

  /**
   * Ensure canonical links are properly set
   */
  addCanonicalLinks() {
    if (!document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = window.location.href.split('?')[0].split('#')[0];
      document.head.appendChild(canonical);
    }
  }

  /**
   * Optimize images for SEO
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Ensure all images have alt text
      if (!img.alt || img.alt.trim() === '') {
        const src = img.src || img.dataset.src || '';
        const filename = src.split('/').pop().split('.')[0];
        
        // Generate meaningful alt text based on context
        if (filename.includes('hero')) {
          img.alt = 'Flugschule Mallorca - Professionelle Flugausbildung auf Mallorca';
        } else if (filename.includes('team')) {
          img.alt = 'Flugschule Mallorca Team - Erfahrene Fluglehrer';
        } else if (filename.includes('aircraft') || filename.includes('cessna') || filename.includes('piper') || filename.includes('socata')) {
          img.alt = 'Flugzeug der Flugschule Mallorca Flotte';
        } else {
          img.alt = 'Flugschule Mallorca - Flugausbildung und Charter Services';
        }
      }

      // Add loading optimization
      if (!img.loading) {
        const rect = img.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;
        img.loading = isAboveFold ? 'eager' : 'lazy';
      }

      // Add decoding optimization
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });
  }

  /**
   * Add structured breadcrumb navigation
   */
  addBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    
    if (!breadcrumbContainer) return;

    const breadcrumbs = this.generateBreadcrumbs(path);
    const breadcrumbSchema = this.generateBreadcrumbSchema(breadcrumbs);
    
    // Inject breadcrumb schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
  }

  generateBreadcrumbs(path) {
    const segments = path.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    
    let currentPath = '';
    segments.forEach(segment => {
      currentPath += '/' + segment;
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Translate German paths
      if (segment === 'flugschule') name = 'Flugausbildung';
      if (segment === 'charter') name = 'Charter Services';
      if (segment === 'flotte') name = 'Unsere Flotte';
      
      breadcrumbs.push({ name, url: currentPath + '/' });
    });
    
    return breadcrumbs;
  }

  generateBreadcrumbSchema(breadcrumbs) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `https://flugschule-mallorca.com${crumb.url}`
      }))
    };
  }

  /**
   * Monitor page performance for SEO
   */
  monitorPagePerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('LCP:', entry.startTime);
          // Send to analytics if needed
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Enhance internal linking for better SEO
   */
  enhanceInternalLinking() {
    const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    
    links.forEach(link => {
      // Add title attributes for better accessibility and SEO
      if (!link.title && link.textContent.trim()) {
        link.title = link.textContent.trim();
      }

      // Add rel attributes for external links
      if (link.hostname && link.hostname !== window.location.hostname) {
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
      }
    });
  }

  /**
   * Generate FAQ schema for pages with FAQ content
   */
  generateFAQSchema(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  /**
   * Add hreflang tags for international SEO (if needed in the future)
   */
  addHreflangTags() {
    const languages = [
      { lang: 'de', href: window.location.href },
      { lang: 'en', href: window.location.href.replace('/de/', '/en/') },
      { lang: 'es', href: window.location.href.replace('/de/', '/es/') }
    ];

    languages.forEach(({ lang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
    });
  }
}

// Initialize SEO utilities
const seoUtils = new SEOUtils();

export default seoUtils;