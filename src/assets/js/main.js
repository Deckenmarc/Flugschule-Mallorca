// Main JavaScript file for Flugschule Mallorca

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

if ('PerformanceObserver' in window) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Flugschule Mallorca website loaded');
    
    // Initialize critical functionality immediately
    initMobileMenu();
    initNavigationActiveState();
    initSmoothScrolling();
    initContactForm();
    
    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initStatisticsCounters();
            initScrollAnimations();
            initImageLoading();
            initCourseRegistration();
            initInteractiveElements();
            initPerformanceOptimizations();
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            initStatisticsCounters();
            initScrollAnimations();
            initImageLoading();
            initCourseRegistration();
            initInteractiveElements();
            initPerformanceOptimizations();
        }, 100);
    }
    
    // Preload critical images
    preloadCriticalImages();
    
    // Initialize SEO utilities
    import('./seo-utils.js').then(module => {
        console.log('SEO utilities initialized');
    });
});

/**
 * Initialize additional interactive elements
 */
function initInteractiveElements() {
    // Add hover effects to cards
    initCardHoverEffects();
    
    // Add button click animations
    initButtonAnimations();
    
    // Add scroll-to-top functionality
    initScrollToTop();
    
    // Add keyboard navigation support
    initKeyboardNavigation();
}

/**
 * Initialize card hover effects
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .card-modern');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Initialize button click animations
 */
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .btn-outline, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            // Add ripple animation CSS if not exists
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Ensure button has relative positioning
            const position = window.getComputedStyle(this).position;
            if (position !== 'relative' && position !== 'absolute') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

/**
 * Initialize scroll-to-top functionality
 */
function initScrollToTop() {
    // Create scroll-to-top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    scrollButton.className = 'fixed bottom-6 right-6 bg-aviation-blue-600 hover:bg-aviation-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform translate-y-16 opacity-0 z-50';
    scrollButton.setAttribute('aria-label', 'Nach oben scrollen');
    scrollButton.id = 'scroll-to-top';
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    let isVisible = false;
    function toggleScrollButton() {
        const shouldShow = window.pageYOffset > 300;
        
        if (shouldShow && !isVisible) {
            isVisible = true;
            scrollButton.style.transform = 'translateY(0)';
            scrollButton.style.opacity = '1';
        } else if (!shouldShow && isVisible) {
            isVisible = false;
            scrollButton.style.transform = 'translateY(16px)';
            scrollButton.style.opacity = '0';
        }
    }
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                toggleScrollButton();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize keyboard navigation support
 */
function initKeyboardNavigation() {
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #3B82F6';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

/**
 * Initialize performance optimizations
 */
function initPerformanceOptimizations() {
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Add loading states
    addLoadingStates();
}

/**
 * Preload critical images for better performance
 */
function preloadCriticalImages() {
    const criticalImages = [
        '/assets/images/hero-background.jpg',
        '/assets/images/aircrew-hero.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalImages = [
        '/assets/images/hero-background.jpg',
        '/assets/images/aircrew-hero.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Optimize scroll performance
 */
function optimizeScrollPerformance() {
    // Use passive event listeners for better performance
    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
            }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
    
    // Apply passive listeners where appropriate
    if (supportsPassive) {
        window.addEventListener('scroll', function() {
            // Scroll handlers that don't prevent default
        }, { passive: true });
        
        window.addEventListener('touchstart', function() {
            // Touch handlers that don't prevent default
        }, { passive: true });
    }
}

/**
 * Add loading states for better UX
 */
function addLoadingStates() {
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class when everything is loaded
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        // Trigger any entrance animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    });
}

/**
 * Initialize mobile menu toggle functionality with enhanced animations
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    let isAnimating = false;
    
    // Enhanced menu toggle with animations
    function toggleMobileMenu() {
        if (isAnimating) return;
        
        const isOpen = !mobileMenu.classList.contains('hidden');
        isAnimating = true;
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        // Show menu
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.setAttribute('aria-label', 'Menü schließen');
        
        // Animate button icon
        animateButtonIcon(true);
        
        // Animate menu appearance
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Trigger animation
        requestAnimationFrame(() => {
            mobileMenu.style.opacity = '1';
            mobileMenu.style.transform = 'translateY(0)';
        });
        
        // Animate menu items with stagger
        const menuItems = mobileMenu.querySelectorAll('a, .mobile-menu-link');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            isAnimating = false;
        }, 400);
    }
    
    function closeMobileMenu() {
        mobileMenuButton.setAttribute('aria-label', 'Menü öffnen');
        
        // Animate button icon
        animateButtonIcon(false);
        
        // Animate menu disappearance
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        
        // Animate menu items out
        const menuItems = mobileMenu.querySelectorAll('a, .mobile-menu-link');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            }, index * 30);
        });
        
        // Hide menu after animation
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            mobileMenu.style.opacity = '';
            mobileMenu.style.transform = '';
            
            // Reset menu items
            menuItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            });
            
            isAnimating = false;
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    function animateButtonIcon(isOpen) {
        const button = mobileMenuButton;
        button.style.transform = 'scale(0.8)';
        button.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            if (isOpen) {
                // Change to X icon
                button.innerHTML = `
                    <svg class="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
            } else {
                // Change to hamburger icon
                button.innerHTML = `
                    <svg class="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                `;
            }
            
            button.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Event listeners
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a, .mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                closeMobileMenu();
            }, 150);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && 
            !mobileMenu.contains(event.target) && 
            !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
}

/**
 * Initialize navigation active state based on current page
 */
function initNavigationActiveState() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (!href || href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for sticky header
                const header = document.querySelector('header') || document.querySelector('.nav-header') || document.querySelector('nav');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuButton) {
                        mobileMenuButton.setAttribute('aria-label', 'Menü öffnen');
                        mobileMenuButton.innerHTML = `
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        `;
                    }
                }
            }
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (location.hash) {
            const targetElement = document.querySelector(location.hash);
            if (targetElement) {
                const header = document.querySelector('header') || document.querySelector('.nav-header') || document.querySelector('nav');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        }
    });
}

/**
 * Initialize statistics counter animations
 */
function initStatisticsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let hasAnimated = false;
    
    // Enhanced counter animation with easing
    function animateCounter(element, target, duration = 2500) {
        const start = 0;
        const startTime = performance.now();
        
        // Easing function for smooth animation
        function easeOutQuart(t) {
            return 1 - (--t) * t * t * t;
        }
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = start + (target - start) * easedProgress;
            
            // Format the number based on the target value
            let displayValue;
            if (target === 1996) {
                displayValue = Math.floor(current);
            } else if (target === 13200) {
                displayValue = Math.floor(current).toLocaleString('de-DE');
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue;
            
            // Add visual feedback during animation
            if (progress < 1) {
                element.style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.1})`;
                requestAnimationFrame(updateCounter);
            } else {
                element.style.transform = 'scale(1)';
                // Add completion effect
                element.style.transition = 'transform 0.3s ease';
                element.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Enhanced viewport detection with Intersection Observer
    function initCounterObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            initScrollBasedCounters();
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    
                    // Add staggered animation delays
                    statNumbers.forEach((element, index) => {
                        const target = parseInt(element.getAttribute('data-count'));
                        const delay = index * 200; // 200ms delay between each counter
                        
                        setTimeout(() => {
                            // Add entrance animation
                            element.style.transform = 'translateY(20px)';
                            element.style.opacity = '0';
                            element.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                            
                            setTimeout(() => {
                                element.style.transform = 'translateY(0)';
                                element.style.opacity = '1';
                                animateCounter(element, target);
                            }, 100);
                        }, delay);
                    });
                    
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px 0px'
        });
        
        const statsSection = document.querySelector('.stats-grid');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    // Fallback for browsers without Intersection Observer
    function initScrollBasedCounters() {
        function checkStatisticsInView() {
            if (hasAnimated) return;
            
            const statsSection = document.querySelector('.stats-grid');
            if (!statsSection) return;
            
            const rect = statsSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            
            if (isInView) {
                hasAnimated = true;
                
                statNumbers.forEach((element, index) => {
                    const target = parseInt(element.getAttribute('data-count'));
                    setTimeout(() => {
                        animateCounter(element, target);
                    }, index * 200);
                });
            }
        }
        
        // Throttled scroll listener
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkStatisticsInView();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', handleScroll);
        checkStatisticsInView(); // Check immediately
    }
    
    // Initialize the appropriate method
    if (statNumbers.length > 0) {
        initCounterObserver();
    }
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkElementsInView() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            
            if (isInView && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkElementsInView();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    checkElementsInView(); // Check immediately
}

/**
 * Initialize lazy image loading and error handling
 */
function initImageLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        initLazyLoading();
    } else {
        // Fallback for older browsers
        initBasicImageLoading();
    }
}

/**
 * Initialize modern lazy loading with Intersection Observer
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[src], img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    images.forEach(img => {
        // Add loading skeleton initially
        img.classList.add('loading-skeleton');
        
        // If image has data-src, set up lazy loading
        if (img.dataset.src && !img.src) {
            imageObserver.observe(img);
        } else {
            // Image already has src, just handle loading states
            loadImage(img);
        }
    });
}

/**
 * Load individual image with proper error handling
 */
function loadImage(img) {
    const src = img.dataset.src || img.src;
    
    // Create a new image to test loading
    const imageLoader = new Image();
    
    imageLoader.onload = function() {
        // Image loaded successfully
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        img.classList.remove('loading-skeleton');
        img.classList.add('loaded');
        
        // Add fade-in animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        // Trigger fade-in
        setTimeout(() => {
            img.style.opacity = '1';
        }, 10);
    };
    
    imageLoader.onerror = function() {
        // Image failed to load
        img.classList.remove('loading-skeleton');
        img.classList.add('error');
        
        // Create error placeholder
        const errorDiv = document.createElement('div');
        errorDiv.className = 'flex items-center justify-center bg-aviation-gray-100 text-aviation-gray-500 text-sm p-4 rounded-lg';
        errorDiv.innerHTML = `
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>Bild nicht verfügbar</span>
        `;
        
        // Replace image with error placeholder
        img.parentNode.replaceChild(errorDiv, img);
    };
    
    // Start loading
    imageLoader.src = src;
}

/**
 * Fallback image loading for older browsers
 */
function initBasicImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.classList.add('loading-skeleton');
        
        img.addEventListener('load', function() {
            this.classList.remove('loading-skeleton');
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.classList.remove('loading-skeleton');
            this.style.backgroundColor = '#f3f4f6';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #6b7280; font-size: 14px;">Bild nicht verfügbar</span>';
        });
        
        // If image not already loaded, keep skeleton
        if (!img.complete) {
            img.classList.add('loading-skeleton');
        } else {
            img.classList.remove('loading-skeleton');
        }
    });
}

/**
 * Initialize course registration button functionality
 */
function initCourseRegistration() {
    const registrationButtons = document.querySelectorAll('[data-course]');
    
    registrationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const courseType = this.getAttribute('data-course');
            
            // Pre-select the course in the contact form
            const courseSelect = document.querySelector('select[name="course"]');
            if (courseSelect) {
                courseSelect.value = courseType;
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.querySelector('form');
    if (!contactForm) return;
    
    // Add form validation on submit
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields before submission
        const isFormValid = validateForm(this);
        if (!isFormValid) {
            // Scroll to first error field
            const firstError = this.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Wird gesendet...
        `;
        
        // Simulate form submission (replace with actual form handling service like Netlify Forms)
        setTimeout(() => {
            handleFormSuccess(contactForm, submitButton, originalButtonText);
        }, 2000);
    });
    
    // Real-time form validation
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        // Validate on blur (when user leaves field)
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors on input if field was previously invalid
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
        
        // Special handling for checkbox
        if (field.type === 'checkbox') {
            field.addEventListener('change', function() {
                validateField(this);
            });
        }
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Handle successful form submission
 */
function handleFormSuccess(form, submitButton, originalButtonText) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-message bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6';
    successMessage.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <div>
                <h4 class="font-semibold mb-1">Nachricht erfolgreich gesendet!</h4>
                <p class="text-sm">Vielen Dank für Ihr Interesse. Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
            </div>
        </div>
    `;
    
    // Insert success message at the top of the form
    form.insertBefore(successMessage, form.firstChild);
    
    // Reset form
    form.reset();
    
    // Clear any validation errors
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error', 'border-red-500');
    });
    
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    
    // Remove success message after 8 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 8000);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Handle form submission error
 */
function handleFormError(form, submitButton, originalButtonText, errorMsg = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.') {
    // Remove any existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-message bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6';
    errorMessage.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div>
                <h4 class="font-semibold mb-1">Fehler beim Senden</h4>
                <p class="text-sm">${errorMsg}</p>
            </div>
        </div>
    `;
    
    // Insert error message at the top of the form
    form.insertBefore(errorMessage, form.firstChild);
    
    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    
    // Remove error message after 8 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 8000);
    
    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value ? field.value.trim() : '';
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error', 'border-red-500');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Special handling for checkbox (GDPR consent)
    if (fieldType === 'checkbox' && field.hasAttribute('required')) {
        if (!field.checked) {
            isValid = false;
            errorMessage = 'Sie müssen der Datenschutzerklärung zustimmen.';
        }
    }
    // Check if required field is empty
    else if (field.hasAttribute('required') && !value) {
        isValid = false;
        switch (fieldName) {
            case 'name':
                errorMessage = 'Bitte geben Sie Ihren Namen ein.';
                break;
            case 'email':
                errorMessage = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
                break;
            case 'message':
                errorMessage = 'Bitte geben Sie eine Nachricht ein.';
                break;
            default:
                errorMessage = 'Dieses Feld ist erforderlich.';
        }
    }
    
    // Field-specific validation for non-empty values
    if (value && isValid) {
        switch (fieldType) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                }
                break;
                
            case 'tel':
                // More flexible phone validation for international numbers
                const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{8,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein.';
                }
                break;
                
            case 'text':
                if (fieldName === 'name') {
                    // Name should be at least 2 characters and contain only letters, spaces, hyphens
                    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s\-\.]{2,}$/;
                    if (!nameRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Bitte geben Sie einen gültigen Namen ein (mindestens 2 Zeichen).';
                    }
                }
                break;
        }
        
        // Message length validation
        if (field.tagName.toLowerCase() === 'textarea' && fieldName === 'message') {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Ihre Nachricht sollte mindestens 10 Zeichen lang sein.';
            } else if (value.length > 1000) {
                isValid = false;
                errorMessage = 'Ihre Nachricht ist zu lang (maximal 1000 Zeichen).';
            }
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error', 'border-red-500');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-600 text-sm mt-2 flex items-center';
        errorElement.innerHTML = `
            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>${errorMessage}</span>
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}
/**

 * Initialize charter inquiry functionality
 */
function initCharterInquiry() {
    const charterButtons = document.querySelectorAll('.charter-inquiry-btn');
    const charterForm = document.getElementById('charter-form');
    const aircraftSelect = document.getElementById('charter-aircraft');
    
    // Handle charter inquiry buttons
    charterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const aircraft = this.getAttribute('data-aircraft');
            
            // Pre-select aircraft in form
            if (aircraftSelect && aircraft) {
                aircraftSelect.value = aircraft;
            }
            
            // Scroll to form
            if (charterForm) {
                const formPosition = charterForm.offsetTop - 100;
                window.scrollTo({
                    top: formPosition,
                    behavior: 'smooth'
                });
                
                // Focus on first input after scroll
                setTimeout(() => {
                    const firstInput = charterForm.querySelector('input[type="text"], input[type="email"]');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Handle charter form submission
    if (charterForm) {
        charterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!data.name || !data.email) {
                showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            // Privacy checkbox validation
            if (!data.privacy) {
                showNotification('Bitte stimmen Sie der Datenschutzerklärung zu.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
            `;
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Show success message
                showNotification('Ihre Charter-Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen!', 'success');
                
                // Reset form
                this.reset();
                
                // Log for analytics (replace with actual tracking)
                console.log('Charter inquiry submitted:', data);
                
                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'charter_inquiry', {
                        'aircraft': data.aircraft,
                        'passengers': data.passengers,
                        'departure': data.departure,
                        'destination': data.destination
                    });
                }
            }, 2000);
        });
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${type === 'success' ? `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                ` : type === 'error' ? `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                ` : `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                `}
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0">
                <button class="inline-flex text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Initialize charter functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add charter functionality to existing initialization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initCharterInquiry();
        });
    } else {
        setTimeout(() => {
            initCharterInquiry();
        }, 100);
    }
});