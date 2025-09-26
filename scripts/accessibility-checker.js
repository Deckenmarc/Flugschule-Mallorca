#!/usr/bin/env node

/**
 * Accessibility Checker for Flugschule Mallorca Website
 * Comprehensive WCAG 2.1 AA compliance testing
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AccessibilityChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.passed = [];
  }

  async checkFile(filePath) {
    console.log(`\n♿ Checking accessibility: ${filePath}`);
    
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Run all accessibility checks
      this.checkImages(document);
      this.checkForms(document);
      this.checkHeadings(document);
      this.checkLinks(document);
      this.checkColorContrast(document);
      this.checkKeyboardNavigation(document);
      this.checkARIA(document);
      this.checkLanguage(document);
      this.checkFocus(document);
      this.checkSemantics(document);

    } catch (error) {
      this.violations.push(`Failed to check ${filePath}: ${error.message}`);
    }
  }

  checkImages(document) {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      
      // Check for alt attribute
      if (!img.hasAttribute('alt')) {
        this.violations.push(`Image ${index + 1} (${src}) missing alt attribute`);
      } else if (alt === null || alt === undefined) {
        this.violations.push(`Image ${index + 1} (${src}) has null alt attribute`);
      } else if (alt.trim() === '' && !this.isDecorativeImage(img)) {
        this.warnings.push(`Image ${index + 1} (${src}) has empty alt - ensure it's decorative`);
      } else if (alt.trim() !== '') {
        this.passed.push(`✓ Image ${index + 1} has descriptive alt text`);
      }

      // Check for redundant text in alt
      if (alt && (alt.toLowerCase().includes('image of') || alt.toLowerCase().includes('picture of'))) {
        this.warnings.push(`Image ${index + 1} alt text contains redundant phrases`);
      }

      // Check for very long alt text
      if (alt && alt.length > 125) {
        this.warnings.push(`Image ${index + 1} alt text is very long (${alt.length} chars) - consider using longdesc`);
      }
    });

    if (images.length === 0) {
      this.warnings.push('No images found to check');
    }
  }

  isDecorativeImage(img) {
    // Check if image is likely decorative based on context
    const parent = img.parentElement;
    const classes = img.className.toLowerCase();
    
    return classes.includes('decoration') || 
           classes.includes('background') || 
           classes.includes('icon') ||
           (parent && parent.tagName.toLowerCase() === 'figure');
  }

  checkForms(document) {
    const formElements = document.querySelectorAll('input, textarea, select');
    
    formElements.forEach((element, index) => {
      const type = element.type;
      const id = element.id;
      const name = element.name;
      
      // Skip hidden inputs
      if (type === 'hidden') return;

      // Check for labels
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledby = element.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledby) {
        this.violations.push(`Form element ${index + 1} (${type}) missing label or aria-label`);
      } else {
        this.passed.push(`✓ Form element ${index + 1} has proper labeling`);
      }

      // Check for required field indicators
      if (element.hasAttribute('required')) {
        const requiredIndicator = label && (
          label.textContent.includes('*') || 
          label.textContent.includes('required') ||
          element.getAttribute('aria-required') === 'true'
        );
        
        if (!requiredIndicator && !element.getAttribute('aria-required')) {
          this.warnings.push(`Required field ${index + 1} should have visual and programmatic indication`);
        } else {
          this.passed.push(`✓ Required field ${index + 1} properly indicated`);
        }
      }

      // Check for fieldsets in groups
      if (type === 'radio' || type === 'checkbox') {
        const fieldset = element.closest('fieldset');
        if (!fieldset) {
          this.warnings.push(`${type} input ${index + 1} should be in a fieldset with legend`);
        }
      }
    });

    // Check for form validation
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      const hasValidation = form.querySelector('[aria-describedby], [aria-invalid]');
      if (!hasValidation) {
        this.warnings.push(`Form ${index + 1} should implement accessible error handling`);
      }
    });
  }

  checkHeadings(document) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      this.violations.push('No headings found - page structure unclear');
      return;
    }

    // Check for H1
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      this.violations.push('No H1 heading found');
    } else if (h1s.length > 1) {
      this.warnings.push(`Multiple H1 headings found (${h1s.length}) - consider using only one per page`);
    } else {
      this.passed.push('✓ Single H1 heading found');
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      
      // Check for empty headings
      if (!text) {
        this.violations.push(`Heading ${index + 1} (${heading.tagName}) is empty`);
        return;
      }

      // Check hierarchy
      if (index === 0 && currentLevel !== 1) {
        this.warnings.push('First heading should be H1');
      }
      
      if (currentLevel > previousLevel + 1) {
        this.warnings.push(`Heading hierarchy skip: ${heading.tagName} after H${previousLevel}`);
      }
      
      previousLevel = currentLevel;
    });

    this.passed.push(`✓ Found ${headings.length} headings with content`);
  }

  checkLinks(document) {
    const links = document.querySelectorAll('a');
    
    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      const ariaLabel = link.getAttribute('aria-label');
      
      // Check for href
      if (!href || href === '#') {
        this.warnings.push(`Link ${index + 1} has no href or placeholder href`);
      }

      // Check for link text
      if (!text && !ariaLabel) {
        this.violations.push(`Link ${index + 1} has no accessible text`);
      } else if (text.toLowerCase() === 'click here' || text.toLowerCase() === 'read more') {
        this.warnings.push(`Link ${index + 1} has non-descriptive text: "${text}"`);
      } else if (text || ariaLabel) {
        this.passed.push(`✓ Link ${index + 1} has descriptive text`);
      }

      // Check for external links
      if (href && (href.startsWith('http') && !href.includes(document.location?.hostname))) {
        const hasExternalIndicator = link.getAttribute('aria-label')?.includes('external') ||
                                   text.includes('external') ||
                                   link.querySelector('[aria-hidden="true"]'); // Icon indicator
        
        if (!hasExternalIndicator) {
          this.warnings.push(`External link ${index + 1} should indicate it opens externally`);
        }
      }

      // Check for target="_blank" without security
      if (link.getAttribute('target') === '_blank') {
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
          this.warnings.push(`Link ${index + 1} with target="_blank" should include rel="noopener noreferrer"`);
        }
      }
    });
  }

  checkColorContrast(document) {
    // Basic check for inline styles with colors
    const elementsWithColor = document.querySelectorAll('[style*="color"]');
    
    if (elementsWithColor.length > 0) {
      this.warnings.push(`${elementsWithColor.length} elements with inline color styles - verify contrast ratios meet WCAG AA (4.5:1)`);
    }

    // Check for color-only information
    const colorOnlyElements = document.querySelectorAll('[style*="color: red"], [style*="color: green"]');
    if (colorOnlyElements.length > 0) {
      this.warnings.push('Elements using color alone to convey information - ensure alternative indicators exist');
    }

    this.passed.push('✓ Basic color usage check completed');
  }

  checkKeyboardNavigation(document) {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex], [onclick], [onkeydown]'
    );

    interactiveElements.forEach((element, index) => {
      const tabindex = element.getAttribute('tabindex');
      
      // Check for positive tabindex (anti-pattern)
      if (tabindex && parseInt(tabindex) > 0) {
        this.warnings.push(`Element ${index + 1} has positive tabindex (${tabindex}) - avoid unless necessary`);
      }

      // Check for keyboard event handlers
      const hasClick = element.hasAttribute('onclick');
      const hasKeydown = element.hasAttribute('onkeydown');
      
      if (hasClick && !hasKeydown && element.tagName.toLowerCase() !== 'button' && element.tagName.toLowerCase() !== 'a') {
        this.warnings.push(`Element ${index + 1} has click handler but no keyboard handler`);
      }
    });

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    const hasSkipToMain = Array.from(skipLinks).some(link => 
      link.textContent.toLowerCase().includes('skip') || 
      link.getAttribute('href') === '#main' ||
      link.getAttribute('href') === '#content'
    );

    if (!hasSkipToMain) {
      this.warnings.push('Consider adding skip navigation link for keyboard users');
    } else {
      this.passed.push('✓ Skip navigation link found');
    }
  }

  checkARIA(document) {
    // Check for ARIA landmarks
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
    
    if (landmarks.length === 0) {
      this.warnings.push('No ARIA landmarks found - consider adding for screen reader navigation');
    } else {
      this.passed.push(`✓ Found ${landmarks.length} ARIA landmarks`);
    }

    // Check for proper ARIA usage
    const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
    
    ariaElements.forEach((element, index) => {
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledby = element.getAttribute('aria-labelledby');
      const ariaDescribedby = element.getAttribute('aria-describedby');
      
      // Check for empty ARIA labels
      if (ariaLabel === '') {
        this.violations.push(`Element ${index + 1} has empty aria-label`);
      }

      // Check for referenced elements
      if (ariaLabelledby) {
        const referencedElement = document.getElementById(ariaLabelledby);
        if (!referencedElement) {
          this.violations.push(`Element ${index + 1} aria-labelledby references non-existent ID: ${ariaLabelledby}`);
        }
      }

      if (ariaDescribedby) {
        const referencedElement = document.getElementById(ariaDescribedby);
        if (!referencedElement) {
          this.violations.push(`Element ${index + 1} aria-describedby references non-existent ID: ${ariaDescribedby}`);
        }
      }
    });

    // Check for ARIA hidden on focusable elements
    const ariaHiddenFocusable = document.querySelectorAll('[aria-hidden="true"]:is(a, button, input, textarea, select, [tabindex])');
    if (ariaHiddenFocusable.length > 0) {
      this.violations.push(`${ariaHiddenFocusable.length} focusable elements are aria-hidden`);
    }
  }

  checkLanguage(document) {
    const html = document.documentElement;
    const lang = html.getAttribute('lang');
    
    if (!lang) {
      this.violations.push('HTML element missing lang attribute');
    } else if (lang.length < 2) {
      this.violations.push(`Invalid lang attribute: ${lang}`);
    } else {
      this.passed.push(`✓ Page language set to: ${lang}`);
    }

    // Check for language changes
    const langElements = document.querySelectorAll('[lang]');
    langElements.forEach((element, index) => {
      const elementLang = element.getAttribute('lang');
      if (elementLang !== lang) {
        this.passed.push(`✓ Language change marked for element ${index + 1}: ${elementLang}`);
      }
    });
  }

  checkFocus(document) {
    // Check for focus indicators (basic check)
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex="0"]');
    
    if (focusableElements.length === 0) {
      this.warnings.push('No focusable elements found');
    } else {
      this.passed.push(`✓ Found ${focusableElements.length} focusable elements`);
    }

    // Check for autofocus (should be used carefully)
    const autofocusElements = document.querySelectorAll('[autofocus]');
    if (autofocusElements.length > 0) {
      this.warnings.push(`${autofocusElements.length} elements have autofocus - ensure this doesn't disrupt navigation`);
    }
  }

  checkSemantics(document) {
    // Check for semantic HTML5 elements
    const semanticElements = ['main', 'nav', 'header', 'footer', 'section', 'article', 'aside'];
    const foundSemantics = [];
    
    semanticElements.forEach(tag => {
      const elements = document.querySelectorAll(tag);
      if (elements.length > 0) {
        foundSemantics.push(tag);
      }
    });

    if (foundSemantics.length === 0) {
      this.warnings.push('No semantic HTML5 elements found - consider using main, nav, header, footer, etc.');
    } else {
      this.passed.push(`✓ Using semantic elements: ${foundSemantics.join(', ')}`);
    }

    // Check for proper list usage
    const lists = document.querySelectorAll('ul, ol, dl');
    lists.forEach((list, index) => {
      const listItems = list.children;
      let hasProperItems = true;
      
      for (let item of listItems) {
        if (list.tagName === 'UL' || list.tagName === 'OL') {
          if (item.tagName !== 'LI') {
            hasProperItems = false;
            break;
          }
        } else if (list.tagName === 'DL') {
          if (item.tagName !== 'DT' && item.tagName !== 'DD') {
            hasProperItems = false;
            break;
          }
        }
      }
      
      if (!hasProperItems) {
        this.violations.push(`List ${index + 1} contains improper child elements`);
      }
    });
  }

  generateAccessibilityReport() {
    console.log('\n' + '='.repeat(60));
    console.log('♿ ACCESSIBILITY COMPLIANCE REPORT');
    console.log('='.repeat(60));

    if (this.passed.length > 0) {
      console.log('\n✅ PASSED CHECKS:');
      this.passed.forEach(item => console.log(`  ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS (Review Recommended):');
      this.warnings.forEach(item => console.log(`  ${item}`));
    }

    if (this.violations.length > 0) {
      console.log('\n❌ VIOLATIONS (Must Fix):');
      this.violations.forEach(item => console.log(`  ${item}`));
    }

    // Calculate compliance score
    const totalChecks = this.passed.length + this.warnings.length + this.violations.length;
    const score = totalChecks > 0 ? (this.passed.length / totalChecks * 100) : 0;
    
    console.log('\n📊 COMPLIANCE SUMMARY:');
    console.log(`  ✅ Passed: ${this.passed.length}`);
    console.log(`  ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`  ❌ Violations: ${this.violations.length}`);
    console.log(`  🎯 Compliance Score: ${score.toFixed(1)}%`);

    // Compliance level assessment
    let complianceLevel = 'Non-compliant';
    if (this.violations.length === 0) {
      if (this.warnings.length === 0) {
        complianceLevel = 'WCAG AA Compliant';
      } else if (this.warnings.length <= 3) {
        complianceLevel = 'Nearly WCAG AA Compliant';
      } else {
        complianceLevel = 'Partially WCAG AA Compliant';
      }
    }
    
    console.log(`  📋 Assessment: ${complianceLevel}`);

    if (this.violations.length > 0) {
      console.log('\n🔧 PRIORITY FIXES:');
      console.log('  1. Fix all violations marked with ❌');
      console.log('  2. Review warnings for potential issues');
      console.log('  3. Test with screen readers and keyboard navigation');
      console.log('  4. Validate color contrast ratios with tools like WebAIM');
    }

    return {
      passed: this.passed.length,
      warnings: this.warnings.length,
      violations: this.violations.length,
      score: parseFloat(score.toFixed(1)),
      complianceLevel
    };
  }
}

// Main execution
async function main() {
  const checker = new AccessibilityChecker();
  
  const filesToCheck = [
    path.join(__dirname, '../src/index.html'),
    path.join(__dirname, '../src/flugschule/index.html'),
    path.join(__dirname, '../src/charter/index.html'),
    path.join(__dirname, '../src/flotte/index.html')
  ];

  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      await checker.checkFile(file);
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  }

  const results = checker.generateAccessibilityReport();
  
  // Exit with error code if there are violations
  if (results.violations > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AccessibilityChecker };