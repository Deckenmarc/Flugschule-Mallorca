/**
 * Responsive Image Loader with WebP support and lazy loading
 * Optimizes image loading for performance
 */

class ImageLoader {
  constructor() {
    this.supportsWebP = null;
    this.imageManifest = null;
    this.init();
  }

  async init() {
    // Check WebP support
    this.supportsWebP = await this.checkWebPSupport();
    
    // Load image manifest
    try {
      const response = await fetch('/assets/images/optimized/image-manifest.json');
      this.imageManifest = await response.json();
    } catch (error) {
      console.warn('Could not load image manifest:', error);
    }

    // Initialize lazy loading
    this.initLazyLoading();
  }

  /**
   * Check if browser supports WebP format
   */
  checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get optimized image source based on browser support and screen size
   */
  getOptimizedImageSrc(imageName, category = 'aircraft') {
    if (!this.imageManifest) {
      return `/assets/images/${imageName}`;
    }

    const imageData = this.imageManifest[category]?.[imageName.replace(/\.(jpg|jpeg|png)$/i, '')];
    if (!imageData) {
      return `/assets/images/${imageName}`;
    }

    // Return WebP if supported, otherwise original optimized image
    const basePath = '/assets/images/optimized/';
    return this.supportsWebP 
      ? basePath + imageData.webp 
      : basePath + imageData.original;
  }

  /**
   * Create responsive image element with srcset
   */
  createResponsiveImage(imageName, alt, className = '', category = 'aircraft') {
    const img = document.createElement('img');
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';
    img.decoding = 'async';

    // Set optimized source
    img.src = this.getOptimizedImageSrc(imageName, category);

    // Add error fallback
    img.onerror = () => {
      img.src = `/assets/images/${imageName}`;
    };

    return img;
  }

  /**
   * Initialize intersection observer for lazy loading
   */
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the actual image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }

            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }

            // Remove loading class and add loaded class
            img.classList.remove('loading');
            img.classList.add('loaded');

            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages(imageNames) {
    imageNames.forEach(imageName => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.getOptimizedImageSrc(imageName, 'hero');
      document.head.appendChild(link);
    });
  }

  /**
   * Generate picture element with WebP fallback
   */
  createPictureElement(imageName, alt, className = '', category = 'aircraft') {
    const picture = document.createElement('picture');
    
    if (this.imageManifest && this.imageManifest[category]?.[imageName.replace(/\.(jpg|jpeg|png)$/i, '')]) {
      const imageData = this.imageManifest[category][imageName.replace(/\.(jpg|jpeg|png)$/i, '')];
      
      // WebP source
      const webpSource = document.createElement('source');
      webpSource.srcset = `/assets/images/optimized/${imageData.webp}`;
      webpSource.type = 'image/webp';
      picture.appendChild(webpSource);
      
      // Fallback image
      const img = document.createElement('img');
      img.src = `/assets/images/optimized/${imageData.original}`;
      img.alt = alt;
      img.className = className;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(img);
    } else {
      // Fallback to original image
      const img = document.createElement('img');
      img.src = `/assets/images/${imageName}`;
      img.alt = alt;
      img.className = className;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(img);
    }
    
    return picture;
  }
}

// Initialize image loader
const imageLoader = new ImageLoader();

// Export for use in other modules
export default imageLoader;