#!/usr/bin/env node

/**
 * Lead Generation Functionality Tester
 * Tests contact forms, CTAs, and conversion paths
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LeadGenerationTester {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  async testAllPages() {
    console.log('📞 Starting Lead Generation Testing...\n');

    const pages = [
      { path: path.join(__dirname, '../src/index.html'), name: 'Homepage' },
      { path: path.join(__dirname, '../src/charter/index.html'), name: 'Charter' },
      { path: path.join(__dirname, '../src/flugschule/index.html'), name: 'Flight School' },
      { path: path.join(__dirname, '../src/flotte/index.html'), name: 'Fleet' }
    ];

    for (const page of pages) {
      if (fs.existsSync(page.path)) {
        await this.testPageLeadGeneration(page.path, page.name);
      }
    }

    this.generateLeadGenerationReport();
  }

  async testPageLeadGeneration(filePath, pageName) {
    console.log(`📋 Testing ${pageName}...`);

    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Test contact forms
      this.testContactForms(document, pageName);
      
      // Test CTAs (Call-to-Actions)
      this.testCallToActions(document, pageName);
      
      // Test contact information visibility
      this.testContactInformation(document, pageName);
      
      // Test lead capture mechanisms
      this.testLeadCaptureMechanisms(document, pageName);
      
      // Test conversion paths
      this.testConversionPaths(document, pageName);

    } catch (error) {
      this.errors.push(`Failed to test ${pageName}: ${error.message}`);
    }
  }

  testContactForms(document, pageName) {
    const forms = document.querySelectorAll('form');
    
    if (forms.length === 0) {
      this.warnings.push(`${pageName}: No contact forms found`);
      return;
    }

    forms.forEach((form, index) => {
      const formId = form.id || `form-${index + 1}`;
      
      // Test form structure
      const requiredFields = form.querySelectorAll('[required]');
      const emailFields = form.querySelectorAll('input[type="email"]');
      const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
      
      if (requiredFields.length === 0) {
        this.warnings.push(`${pageName}: Form ${formId} has no required fields`);
      } else {
        this.passed.push(`${pageName}: Form ${formId} has ${requiredFields.length} required fields`);
      }

      if (emailFields.length === 0) {
        this.errors.push(`${pageName}: Form ${formId} missing email field for lead capture`);
      } else {
        this.passed.push(`${pageName}: Form ${formId} has email field for lead capture`);
      }

      if (submitButtons.length === 0) {
        this.errors.push(`${pageName}: Form ${formId} missing submit button`);
      } else {
        this.passed.push(`${pageName}: Form ${formId} has submit button`);
      }

      // Test form validation
      const hasValidation = form.querySelector('[aria-invalid], [aria-describedby*="error"]');
      if (!hasValidation) {
        this.warnings.push(`${pageName}: Form ${formId} should implement client-side validation`);
      }

      // Test GDPR compliance
      const gdprCheckbox = form.querySelector('input[type="checkbox"]');
      if (!gdprCheckbox) {
        this.warnings.push(`${pageName}: Form ${formId} should include GDPR consent checkbox`);
      } else {
        this.passed.push(`${pageName}: Form ${formId} includes consent checkbox`);
      }

      // Test course interest selection
      const courseSelect = form.querySelector('select[name*="course"], select[name*="interest"]');
      if (courseSelect) {
        this.passed.push(`${pageName}: Form ${formId} includes course interest selection`);
      }
    });
  }

  testCallToActions(document, pageName) {
    // Test primary CTAs
    const primaryCTAs = document.querySelectorAll(
      'a[href*="contact"], a[href*="#contact"], button[onclick*="contact"], .btn-primary, .cta-button'
    );

    if (primaryCTAs.length === 0) {
      this.errors.push(`${pageName}: No primary CTAs found`);
    } else {
      this.passed.push(`${pageName}: Found ${primaryCTAs.length} primary CTAs`);
    }

    // Test phone number CTAs
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    if (phoneLinks.length === 0) {
      this.warnings.push(`${pageName}: No clickable phone numbers found`);
    } else {
      this.passed.push(`${pageName}: Found ${phoneLinks.length} clickable phone numbers`);
      
      // Validate phone numbers
      phoneLinks.forEach((link, index) => {
        const phoneNumber = link.getAttribute('href').replace('tel:', '');
        if (phoneNumber.includes('+34') || phoneNumber.includes('+49')) {
          this.passed.push(`${pageName}: Phone ${index + 1} has international format`);
        } else {
          this.warnings.push(`${pageName}: Phone ${index + 1} should use international format`);
        }
      });
    }

    // Test email CTAs
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    if (emailLinks.length > 0) {
      this.passed.push(`${pageName}: Found ${emailLinks.length} email links`);
    }

    // Test CTA text quality
    const ctaTexts = [];
    primaryCTAs.forEach(cta => {
      const text = cta.textContent.trim().toLowerCase();
      ctaTexts.push(text);
      
      if (text.includes('kontakt') || text.includes('anmelden') || text.includes('starten')) {
        this.passed.push(`${pageName}: CTA has action-oriented text: "${text}"`);
      } else if (text === 'click here' || text === 'mehr') {
        this.warnings.push(`${pageName}: CTA text could be more specific: "${text}"`);
      }
    });
  }

  testContactInformation(document, pageName) {
    // Test phone number visibility
    const phonePattern = /(\+\d{1,3}\s?)?\(?\d{1,4}\)?\s?\d{1,4}\s?\d{1,4}\s?\d{1,9}/g;
    const pageText = document.body.textContent;
    const phoneMatches = pageText.match(phonePattern) || [];
    
    const validPhones = phoneMatches.filter(phone => 
      phone.includes('+34') || phone.includes('+49') || phone.length > 8
    );

    if (validPhones.length === 0) {
      this.errors.push(`${pageName}: No visible phone numbers found`);
    } else {
      this.passed.push(`${pageName}: Found ${validPhones.length} visible phone numbers`);
    }

    // Test email visibility
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = pageText.match(emailPattern) || [];
    
    if (emailMatches.length === 0) {
      this.warnings.push(`${pageName}: No visible email addresses found`);
    } else {
      this.passed.push(`${pageName}: Found ${emailMatches.length} visible email addresses`);
    }

    // Test address information
    const addressKeywords = ['mallorca', 'stuttgart', 'son bonet', 'palma'];
    const hasAddress = addressKeywords.some(keyword => 
      pageText.toLowerCase().includes(keyword)
    );

    if (hasAddress) {
      this.passed.push(`${pageName}: Contains location/address information`);
    } else {
      this.warnings.push(`${pageName}: Should include location/address information`);
    }
  }

  testLeadCaptureMechanisms(document, pageName) {
    // Test lead magnets
    const leadMagnets = document.querySelectorAll(
      '[class*="download"], [class*="brochure"], [class*="guide"], [href*="pdf"]'
    );

    if (leadMagnets.length > 0) {
      this.passed.push(`${pageName}: Found ${leadMagnets.length} potential lead magnets`);
    }

    // Test newsletter signup
    const newsletterSignup = document.querySelector(
      'input[name*="newsletter"], input[name*="subscribe"], [class*="newsletter"]'
    );

    if (newsletterSignup) {
      this.passed.push(`${pageName}: Has newsletter signup`);
    }

    // Test course information requests
    const courseRequests = document.querySelectorAll(
      'select[name*="course"], input[name*="course"], [class*="course-select"]'
    );

    if (courseRequests.length > 0) {
      this.passed.push(`${pageName}: Has course information request mechanism`);
    }

    // Test callback requests
    const callbackFields = document.querySelectorAll(
      'input[name*="callback"], input[name*="phone"], select[name*="time"]'
    );

    if (callbackFields.length > 0) {
      this.passed.push(`${pageName}: Supports callback requests`);
    }
  }

  testConversionPaths(document, pageName) {
    // Test navigation to contact
    const contactNavigation = document.querySelectorAll(
      'a[href*="contact"], a[href="#contact"], nav a[href*="kontakt"]'
    );

    if (contactNavigation.length === 0) {
      this.warnings.push(`${pageName}: No clear navigation to contact section`);
    } else {
      this.passed.push(`${pageName}: Has ${contactNavigation.length} contact navigation links`);
    }

    // Test course page links
    const courseLinks = document.querySelectorAll(
      'a[href*="flugschule"], a[href*="course"], a[href*="ausbildung"]'
    );

    if (courseLinks.length > 0) {
      this.passed.push(`${pageName}: Has ${courseLinks.length} course page links`);
    }

    // Test charter service links
    const charterLinks = document.querySelectorAll(
      'a[href*="charter"], a[href*="fleet"], a[href*="flotte"]'
    );

    if (charterLinks.length > 0) {
      this.passed.push(`${pageName}: Has ${charterLinks.length} charter service links`);
    }

    // Test social proof elements
    const socialProof = document.querySelectorAll(
      '[class*="testimonial"], [class*="review"], [class*="statistic"]'
    );

    if (socialProof.length > 0) {
      this.passed.push(`${pageName}: Has ${socialProof.length} social proof elements`);
    }

    // Test trust indicators
    const trustIndicators = document.querySelectorAll(
      '[class*="certificate"], [class*="award"], [class*="experience"]'
    );

    const experienceText = document.body.textContent.toLowerCase();
    const hasExperience = experienceText.includes('jahre') || 
                         experienceText.includes('erfahrung') ||
                         experienceText.includes('1996');

    if (hasExperience) {
      this.passed.push(`${pageName}: Contains experience/trust indicators`);
    }
  }

  generateLeadGenerationReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📞 LEAD GENERATION TEST REPORT');
    console.log('='.repeat(60));

    if (this.passed.length > 0) {
      console.log('\n✅ PASSED TESTS:');
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

    // Calculate lead generation score
    const totalTests = this.passed.length + this.warnings.length + this.errors.length;
    const score = totalTests > 0 ? (this.passed.length / totalTests * 100) : 0;

    console.log('\n📊 LEAD GENERATION SUMMARY:');
    console.log(`  ✅ Passed: ${this.passed.length}`);
    console.log(`  ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`  ❌ Errors: ${this.errors.length}`);
    console.log(`  🎯 Lead Gen Score: ${score.toFixed(1)}%`);

    // Assessment
    let assessment = 'Poor';
    if (score >= 90) assessment = 'Excellent';
    else if (score >= 80) assessment = 'Good';
    else if (score >= 70) assessment = 'Fair';
    else if (score >= 60) assessment = 'Needs Improvement';

    console.log(`  📋 Assessment: ${assessment}`);

    // Recommendations
    console.log('\n💡 LEAD GENERATION RECOMMENDATIONS:');
    
    if (this.errors.length > 0) {
      console.log('  🔴 CRITICAL:');
      console.log('    • Fix missing email fields in contact forms');
      console.log('    • Add primary CTAs to pages without them');
      console.log('    • Ensure phone numbers are visible and clickable');
    }

    if (this.warnings.length > 0) {
      console.log('  🟡 IMPROVEMENTS:');
      console.log('    • Add GDPR consent checkboxes to all forms');
      console.log('    • Implement client-side form validation');
      console.log('    • Improve CTA text to be more action-oriented');
      console.log('    • Add newsletter signup options');
    }

    console.log('  🟢 ENHANCEMENTS:');
    console.log('    • Add lead magnets (brochures, guides)');
    console.log('    • Implement callback request functionality');
    console.log('    • Add more social proof elements');
    console.log('    • Create landing pages for specific campaigns');
    console.log('    • Add exit-intent popups for lead capture');

    return {
      passed: this.passed.length,
      warnings: this.warnings.length,
      errors: this.errors.length,
      score: parseFloat(score.toFixed(1)),
      assessment
    };
  }
}

// Performance testing function
class PerformanceTester {
  constructor() {
    this.metrics = {};
  }

  async testCoreWebVitals() {
    console.log('\n⚡ CORE WEB VITALS SIMULATION');
    console.log('='.repeat(40));
    
    // Simulate performance metrics (in a real scenario, you'd use Lighthouse or similar)
    console.log('📊 Simulated Performance Metrics:');
    console.log('  • First Contentful Paint (FCP): ~1.2s');
    console.log('  • Largest Contentful Paint (LCP): ~2.1s');
    console.log('  • First Input Delay (FID): ~45ms');
    console.log('  • Cumulative Layout Shift (CLS): ~0.08');
    
    console.log('\n💡 Performance Recommendations:');
    console.log('  • Optimize images with WebP format');
    console.log('  • Implement lazy loading for below-fold content');
    console.log('  • Minify CSS and JavaScript files');
    console.log('  • Use a CDN for static assets');
    console.log('  • Enable gzip compression');
    console.log('  • Implement service worker for caching');
    
    console.log('\n🔧 To measure real performance:');
    console.log('  1. Use Google PageSpeed Insights');
    console.log('  2. Run Lighthouse audits');
    console.log('  3. Monitor Core Web Vitals in production');
    console.log('  4. Use tools like GTmetrix or WebPageTest');
  }
}

// Main execution
async function main() {
  const leadTester = new LeadGenerationTester();
  await leadTester.testAllPages();
  
  const perfTester = new PerformanceTester();
  await perfTester.testCoreWebVitals();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { LeadGenerationTester, PerformanceTester };