/**
 * Structured Data (JSON-LD) for Flugschule Mallorca
 * Implements local business and course structured data for better SEO
 */

// Local Business Schema for Mallorca Office
const mallorcanBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://flugschule-mallorca.com/#mallorca-office",
  "name": "Flugschule Mallorca",
  "alternateName": "Flight School Mallorca",
  "description": "Professional flight training school in Mallorca offering PPL courses, aircraft charter services, and comprehensive aviation training since 1996.",
  "url": "https://flugschule-mallorca.com",
  "telephone": "+34 691 367 430",
  "email": "contact@flightservice365.com",
  "foundingDate": "1996",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Son Bonet Airport",
    "addressLocality": "Marratxi",
    "addressRegion": "Balearic Islands",
    "postalCode": "07141",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "39.6012",
    "longitude": "2.7038"
  },
  "openingHours": "Mo-Su 08:00-20:00",
  "priceRange": "€€",
  "image": [
    "https://flugschule-mallorca.com/assets/images/hero-background.jpg",
    "https://flugschule-mallorca.com/assets/images/aircrew-hero.jpg"
  ],
  "logo": "https://flugschule-mallorca.com/assets/images/logo.png",
  "sameAs": [
    "https://www.flightservice365.com"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Flight Training Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "PPL-365 Private Pilot License Training",
          "description": "Year-round private pilot license training in Mallorca"
        }
      }
    ]
  }
};

// Local Business Schema for Stuttgart Office
const stuttgartBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://flugschule-mallorca.com/#stuttgart-office",
  "name": "Flugschule Mallorca - Stuttgart Office",
  "description": "Stuttgart office of Flugschule Mallorca providing flight training coordination and support services.",
  "url": "https://flugschule-mallorca.com",
  "telephone": "+49 171 6502219",
  "email": "contact@flightservice365.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Stuttgart",
    "addressRegion": "Baden-Württemberg",
    "addressCountry": "DE"
  },
  "parentOrganization": {
    "@id": "https://flugschule-mallorca.com/#mallorca-office"
  }
};

// Flight Training Course Schema
const flightTrainingSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "PPL-365 Private Pilot License Training",
  "description": "Comprehensive private pilot license training available year-round in Mallorca with flexible online and in-person options.",
  "provider": {
    "@type": "Organization",
    "name": "Flugschule Mallorca",
    "@id": "https://flugschule-mallorca.com/#mallorca-office"
  },
  "courseCode": "PPL-365",
  "educationalLevel": "Beginner to Advanced",
  "teaches": [
    "Private Pilot License (PPL)",
    "Flight Theory",
    "Aircraft Operation",
    "Navigation",
    "Aviation Regulations",
    "Flight Safety"
  ],
  "coursePrerequisites": "Medical certificate, minimum age requirements",
  "hasCourseInstance": [
    {
      "@type": "CourseInstance",
      "name": "Online Course without Instructor",
      "courseMode": "online",
      "description": "Self-paced online flight training course"
    },
    {
      "@type": "CourseInstance", 
      "name": "Online Course with Instructor",
      "courseMode": "blended",
      "description": "Online flight training with dedicated instructor support"
    },
    {
      "@type": "CourseInstance",
      "name": "In-Person Training in Mallorca", 
      "courseMode": "onsite",
      "location": {
        "@type": "Place",
        "name": "Son Bonet Airport, Mallorca",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Marratxi",
          "addressCountry": "ES"
        }
      },
      "description": "Hands-on flight training at our Mallorca facility"
    }
  ]
};

// Aircraft Charter Service Schema
const charterServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Aircraft Charter Services",
  "description": "Professional aircraft charter services with modern fleet including Cessna T303, Socata TB20, and Piper aircraft.",
  "provider": {
    "@type": "Organization",
    "name": "Flugschule Mallorca",
    "@id": "https://flugschule-mallorca.com/#mallorca-office"
  },
  "serviceType": "Aircraft Charter",
  "areaServed": {
    "@type": "Place",
    "name": "Europe"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Aircraft Fleet",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Vehicle",
          "name": "Cessna T303 Crusader",
          "description": "Twin-engine business and travel aircraft",
          "vehicleEngine": {
            "@type": "EngineSpecification",
            "name": "Twin Engine"
          }
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Vehicle",
          "name": "Socata TB20 Trinidad",
          "description": "Single-engine short-haul and recreational aircraft",
          "vehicleEngine": {
            "@type": "EngineSpecification", 
            "name": "Single Engine"
          }
        }
      }
    ]
  }
};

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Flugschule Mallorca",
  "alternateName": "Flight School Mallorca",
  "url": "https://flugschule-mallorca.com",
  "logo": "https://flugschule-mallorca.com/assets/images/logo.png",
  "description": "Leading flight training school in Mallorca offering comprehensive PPL courses and aircraft charter services since 1996.",
  "foundingDate": "1996",
  "numberOfEmployees": "10-50",
  "email": "contact@flightservice365.com",
  "sameAs": [
    "https://www.flightservice365.com"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Aviation Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Private Pilot License Training"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Aircraft Charter Services"
        }
      }
    ]
  }
};

// Function to inject structured data into the page
function injectStructuredData() {
  const schemas = [
    mallorcanBusinessSchema,
    stuttgartBusinessSchema, 
    flightTrainingSchema,
    charterServiceSchema,
    organizationSchema
  ];

  schemas.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = `structured-data-${index}`;
    document.head.appendChild(script);
  });
}

// Initialize structured data when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectStructuredData);
} else {
  injectStructuredData();
}

// Export for use in other modules
export {
  mallorcanBusinessSchema,
  stuttgartBusinessSchema,
  flightTrainingSchema,
  charterServiceSchema,
  organizationSchema,
  injectStructuredData
};