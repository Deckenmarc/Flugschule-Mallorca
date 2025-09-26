#!/usr/bin/env node

/**
 * SEO and Accessibility Validator for Flugschule Mallorca Website
 * Validates HTML structure, heading hierarchy, and accessibility compliance
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEOValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  // Expected SEO structure from requirements
  expectedStructure = {
    homepage: {
      h1: ['FLUGSCHULE MALLORCA'],
      h2: [
        'flugschule mallorca',
        'BEREIT ZUM ABHEBEN?',
        'Lassen sie ihre träume fliegen',
        'UNSERE KURSE',
        'UNSER TEAM',
        'Kontaktieren Sie uns',
        'FLugschule MALLORCA',
        'Unsere Kontaktdaten'
      ],
      h3: ['UNSERE FLOTTE', 'Flugzeug Charter', 'SChnell anmelden'],
      h5: ['20 SIMULATORS', '700 STUDENTS', 'IN 1996', '13.200 Square Meters', 'Gregor Schulz', 'Marcus Schulz', 'Erika Elsser'],
      h6: ['Unser Büro auf Mallorca', 'Unser Büro in Stuttgart']
    },
    flugschule: {
      h2: ['Ausbildung PPL-365']
    }
  };

  async validateFile(filePath, pageType = 'homepage') {
    console.log(`\n🔍 Validating ${filePath}...`);
    
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Validate HTML structure
      this.validateHTMLStructure(document, pageType);
      
      // Validate heading hierarchy
      this.validateHeadingHierarchy(document, pageType);
      
      // Validate SEO meta tags
      this.validateSEOMetaTags(document, pageType);
      
      // Validate accessibility
      this.validateAccessibility(document, pageType);
      
      // Validate structured data
      this.validateStructuredData(document, pageType);

    } catch (error) {
      this.errors.push(`Failed to validate ${filePath}: ${error.message}`);
    }
  }

  validateHTMLStructure(document, pageType) {
    // Check for required HTML5 elements
    const requiredElements = ['html', 'head', 'body', 'title', 'meta[charset]'];
    
    requiredElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        this.errors.push(`Missing required element: ${selector}`);
      } else {
        this.passed.push(`✓ Found required element: ${selector}`);
      }
    });

    // Check for semantic HTML5 elements
    const semanticElements = ['header', 'nav', 'main', 'section', 'footer'];
    semanticElements.forEach(tag => {
      const element = document.querySelector(tag);
      if (!element) {
        this.warnings.push(`Consider adding semantic element: ${tag}`);
      } else {
        this.passed.push(`✓ Found semantic element: ${tag}`);
      }
    });
  }

  validateHeadingHierarchy(document, pageType) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingStructure = {};
    
    headings.forEach(heading => {
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent.trim();
      
      if (!headingStructure[level]) {
        headingStructure[level] = [];
      }
      headingStructure[level].push(text);
    });

    // Validate against expected structure
    const expected = this.expectedStructure[pageType];
    if (expected) {
      Object.keys(expected).forEach(level => {
        const expectedHeadings = expected[level];
        const actualHeadings = headingStructure[level] || [];
        
        expectedHeadings.forEach(expectedText => {
          if (actualHeadings.includes(expectedText)) {
            this.passed.push(`✓ Found expected ${level.toUpperCase()}: "${expectedText}"`);
          } else {
            this.errors.push(`Missing expected ${level.toUpperCase()}: "${expectedText}"`);
          }
        });
      });
    }

    // Check heading hierarchy logic
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && currentLevel !== 1) {
        this.warnings.push('First heading should be H1');
      }
      
      if (currentLevel > previousLevel + 1) {
        this.warnings.push(`Heading hierarchy skip detected: ${heading.tagName} after H${previousLevel}`);
      }
      
      previousLevel = currentLevel;
    });
  }

  validateSEOMetaTags(document, pageType) {
    const requiredMetaTags = [
      { selector: 'meta[name="description"]', name: 'Meta description' },
      { selector: 'meta[name="viewport"]', name: 'Viewport meta tag' },
      { selector: 'title', name: 'Page title' }
    ];

    requiredMetaTags.forEach(({ selector, name }) => {
      const element = document.querySelector(selector);
      if (!element) {
        this.errors.push(`Missing ${name}`);
      } else {
        const content = element.content || element.textContent;
        if (!content || content.trim().length === 0) {
          this.errors.push(`Empty ${name}`);
        } else {
          this.passed.push(`✓ Found ${name}: "${content.substring(0, 50)}..."`);
        }
      }
    });

    // Check for Open Graph tags
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    ogTags.forEach(property => {
      const element = document.querySelector(`meta[property="${property}"]`);
      if (element) {
        this.passed.push(`✓ Found Open Graph tag: ${property}`);
      } else {
        this.warnings.push(`Consider adding Open Graph tag: ${property}`);
      }
    });
  }

  validateAccessibility(document, pageType) {
    // Check for alt attributes on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        this.errors.push(`Image ${index + 1} missing alt attribute`);
      } else if (img.getAttribute('alt').trim() === '') {
        this.warnings.push(`Image ${index + 1} has empty alt attribute`);
      } else {
        this.passed.push(`✓ Image ${index + 1} has alt text`);
      }
    });

    // Check for form labels
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
    inputs.forEach((input, index) => {
      const id = input.id;
      const label = document.querySelector(`label[for="${id}"]`);
      
      if (!label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        this.errors.push(`Form input ${index + 1} missing label or aria-label`);
      } else {
        this.passed.push(`✓ Form input ${index + 1} has proper labeling`);
      }
    });

    // Check for skip links
    const skipLink = document.querySelector('a[href="#main"], a[href="#content"]');
    if (!skipLink) {
      this.warnings.push('Consider adding skip navigation link for accessibility');
    } else {
      this.passed.push('✓ Found skip navigation link');
    }

    // Check for proper heading structure (no empty headings)
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        this.errors.push(`Heading ${index + 1} (${heading.tagName}) is empty`);
      }
    });

    // Check for color contrast (basic check for inline styles)
    const elementsWithColor = document.querySelectorAll('[style*="color"]');
    if (elementsWithColor.length > 0) {
      this.warnings.push('Elements with inline color styles found - ensure proper contrast ratios');
    }
  }

  validateStructuredData(document, pageType) {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (jsonLdScripts.length === 0) {
      this.warnings.push('No structured data (JSON-LD) found');
      return;
    }

    jsonLdScripts.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent);
        this.passed.push(`✓ Valid JSON-LD structured data block ${index + 1}`);
        
        // Check for local business schema
        if (data['@type'] === 'LocalBusiness' || data['@type'] === 'EducationalOrganization') {
          this.passed.push(`✓ Found ${data['@type']} schema`);
        }
        
        // Check for required properties
        const requiredProps = ['name', 'address', 'telephone'];
        requiredProps.forEach(prop => {
          if (data[prop]) {
            this.passed.push(`✓ Structured data has ${prop}`);
          } else {
            this.warnings.push(`Structured data missing ${prop}`);
          }
        });
        
      } catch (error) {
        this.errors.push(`Invalid JSON-LD in script block ${index + 1}: ${error.message}`);
      }
    });
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 SEO & ACCESSIBILITY VALIDATION REPORT');
    console.log('='.repeat(60));

    if (this.passed.length > 0) {
      console.log('\n✅ PASSED CHECKS:');
      this.passed.forEach(item => console.log(`  ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(item => console.log(`  ${item}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(item => console.log(`  ${item}`));
    }

    console.log('\n📊 SUMMARY:');
    console.log(`  ✅ Passed: ${this.passed.length}`);
    console.log(`  ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`  ❌ Errors: ${this.errors.length}`);

    const score = this.passed.length / (this.passed.length + this.warnings.length + this.errors.length) * 100;
    console.log(`  🎯 Score: ${score.toFixed(1)}%`);

    return {
      passed: this.passed.length,
      warnings: this.warnings.length,
      errors: this.errors.length,
      score: score
    };
  }
}

// Main execution
async function main() {
  const validator = new SEOValidator();
  
  // Define files to validate
  const filesToValidate = [
    { path: path.join(__dirname, '../src/index.html'), type: 'homepage' },
    { path: path.join(__dirname, '../src/flugschule/index.html'), type: 'flugschule' },
    { path: path.join(__dirname, '../src/charter/index.html'), type: 'charter' },
    { path: path.join(__dirname, '../src/flotte/index.html'), type: 'flotte' }
  ];

  // Validate each file
  for (const file of filesToValidate) {
    if (fs.existsSync(file.path)) {
      await validator.validateFile(file.path, file.type);
    } else {
      console.log(`⚠️  File not found: ${file.path}`);
    }
  }

  // Generate final report
  const results = validator.generateReport();
  
  // Exit with error code if there are critical errors
  if (results.errors > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SEOValidator };