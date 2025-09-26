#!/usr/bin/env node

/**
 * Comprehensive SEO, Accessibility, and Responsive Testing Suite
 * For Flugschule Mallorca Website
 */

import { SEOValidator } from './seo-validator.js';
import { AccessibilityChecker } from './accessibility-checker.js';
import { ResponsiveTester, CSSAnalyzer } from './responsive-tester.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComprehensiveValidator {
  constructor() {
    this.results = {
      seo: null,
      accessibility: null,
      responsive: null,
      css: null
    };
    this.fixes = [];
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Website Validation...\n');

    // Run SEO validation
    console.log('1️⃣ Running SEO Validation...');
    const seoValidator = new SEOValidator();
    const filesToValidate = [
      { path: path.join(__dirname, '../src/index.html'), type: 'homepage' },
      { path: path.join(__dirname, '../src/flugschule/index.html'), type: 'flugschule' },
      { path: path.join(__dirname, '../src/charter/index.html'), type: 'charter' },
      { path: path.join(__dirname, '../src/flotte/index.html'), type: 'flotte' }
    ];

    for (const file of filesToValidate) {
      if (fs.existsSync(file.path)) {
        await seoValidator.validateFile(file.path, file.type);
      }
    }
    this.results.seo = seoValidator.generateReport();

    // Run Accessibility validation
    console.log('\n2️⃣ Running Accessibility Validation...');
    const accessibilityChecker = new AccessibilityChecker();
    for (const file of filesToValidate) {
      if (fs.existsSync(file.path)) {
        await accessibilityChecker.checkFile(file.path);
      }
    }
    this.results.accessibility = accessibilityChecker.generateAccessibilityReport();

    // Run CSS Analysis
    console.log('\n3️⃣ Running CSS Analysis...');
    const cssAnalyzer = new CSSAnalyzer();
    const cssFiles = [
      path.join(__dirname, '../src/assets/css/main.css'),
      path.join(__dirname, '../src/assets/css/critical.css')
    ];
    cssFiles.forEach(file => cssAnalyzer.analyzeCSSFile(file));
    cssAnalyzer.generateCSSReport();

    // Try to run responsive tests if server is available
    console.log('\n4️⃣ Attempting Responsive Testing...');
    try {
      const responsiveTester = new ResponsiveTester();
      this.results.responsive = await responsiveTester.testResponsiveness();
    } catch (error) {
      console.log('⚠️  Responsive testing skipped - dev server not running');
      console.log('   To run responsive tests: npm run dev (in another terminal)');
    }

    // Generate comprehensive report
    this.generateComprehensiveReport();
    this.generateFixRecommendations();
  }

  generateComprehensiveReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE VALIDATION REPORT');
    console.log('='.repeat(80));

    // Overall scores
    const seoScore = this.results.seo?.score || 0;
    const accessibilityScore = this.results.accessibility?.score || 0;
    const responsiveScore = this.results.responsive?.passRate || 0;

    console.log('\n🎯 OVERALL SCORES:');
    console.log(`  SEO Compliance: ${seoScore.toFixed(1)}%`);
    console.log(`  Accessibility: ${accessibilityScore.toFixed(1)}%`);
    if (this.results.responsive) {
      console.log(`  Responsive Design: ${responsiveScore.toFixed(1)}%`);
    }

    // Calculate overall grade
    const scores = [seoScore, accessibilityScore];
    if (this.results.responsive) scores.push(responsiveScore);
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    console.log(`\n🏆 OVERALL GRADE: ${overallScore.toFixed(1)}%`);

    let grade = 'F';
    if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 70) grade = 'C';
    else if (overallScore >= 60) grade = 'D';

    console.log(`📝 LETTER GRADE: ${grade}`);

    // Priority issues
    const totalErrors = (this.results.seo?.errors || 0) + (this.results.accessibility?.violations || 0);
    const totalWarnings = (this.results.seo?.warnings || 0) + (this.results.accessibility?.warnings || 0);

    console.log('\n🚨 PRIORITY ISSUES:');
    console.log(`  Critical Errors: ${totalErrors}`);
    console.log(`  Warnings: ${totalWarnings}`);

    if (totalErrors === 0 && totalWarnings <= 5) {
      console.log('\n✅ EXCELLENT! Your website meets high standards for SEO and accessibility.');
    } else if (totalErrors <= 3 && totalWarnings <= 10) {
      console.log('\n👍 GOOD! Minor improvements needed for optimal performance.');
    } else {
      console.log('\n⚠️  NEEDS IMPROVEMENT! Several issues require attention.');
    }
  }

  generateFixRecommendations() {
    console.log('\n' + '='.repeat(80));
    console.log('🔧 RECOMMENDED FIXES');
    console.log('='.repeat(80));

    // SEO Fixes
    if (this.results.seo?.errors > 0) {
      console.log('\n🎯 SEO CRITICAL FIXES:');
      console.log('  1. Add missing H1 "FLUGSCHULE MALLORCA" to homepage');
      console.log('  2. Add missing H2 "UNSERE KURSE" section');
      console.log('  3. Add missing H3 "Flugzeug Charter" heading');
      console.log('  4. Add missing H5 statistics: "IN 1996", "13.200 Square Meters"');
      console.log('  5. Add proper labels to all form inputs');
    }

    // Accessibility Fixes
    if (this.results.accessibility?.violations > 0) {
      console.log('\n♿ ACCESSIBILITY CRITICAL FIXES:');
      console.log('  1. Add proper labels to all form inputs using <label> tags');
      console.log('  2. Fix links with no accessible text');
      console.log('  3. Add skip navigation links for keyboard users');
      console.log('  4. Group related form fields in fieldsets with legends');
      console.log('  5. Implement accessible error handling for forms');
    }

    // General Improvements
    console.log('\n💡 GENERAL IMPROVEMENTS:');
    console.log('  1. Add main landmark to homepage');
    console.log('  2. Improve heading hierarchy (avoid skipping levels)');
    console.log('  3. Add structured data for all pages');
    console.log('  4. Implement ARIA labels where needed');
    console.log('  5. Test with screen readers and keyboard navigation');

    // Performance Recommendations
    console.log('\n⚡ PERFORMANCE RECOMMENDATIONS:');
    console.log('  1. Optimize images with WebP format');
    console.log('  2. Implement lazy loading for images');
    console.log('  3. Minify CSS and JavaScript');
    console.log('  4. Use CDN for static assets');
    console.log('  5. Implement service worker for caching');

    // Next Steps
    console.log('\n📋 NEXT STEPS:');
    console.log('  1. Fix critical errors first (marked with ❌)');
    console.log('  2. Address accessibility violations');
    console.log('  3. Review and fix warnings');
    console.log('  4. Test with real users and assistive technologies');
    console.log('  5. Monitor Core Web Vitals in production');
    console.log('  6. Set up automated testing in CI/CD pipeline');
  }
}

// Main execution
async function main() {
  const validator = new ComprehensiveValidator();
  await validator.runAllTests();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ComprehensiveValidator };