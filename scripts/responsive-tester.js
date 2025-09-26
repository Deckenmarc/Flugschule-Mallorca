#!/usr/bin/env node

/**
 * Responsive Design Tester for Flugschule Mallorca Website
 * Tests mobile responsiveness across different viewport sizes
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ResponsiveTester {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  // Common device viewports to test
  viewports = [
    { name: 'Mobile Portrait', width: 375, height: 667 },
    { name: 'Mobile Landscape', width: 667, height: 375 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ];

  async testResponsiveness(baseUrl = 'http://localhost:5173') {
    console.log('🔍 Starting responsive design tests...');
    
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const pages = [
        { url: `${baseUrl}/`, name: 'Homepage' },
        { url: `${baseUrl}/flugschule/`, name: 'Flight School' },
        { url: `${baseUrl}/charter/`, name: 'Charter' },
        { url: `${baseUrl}/flotte/`, name: 'Fleet' }
      ];

      for (const pageInfo of pages) {
        console.log(`\n📱 Testing ${pageInfo.name}...`);
        
        for (const viewport of this.viewports) {
          await this.testPageAtViewport(browser, pageInfo, viewport);
        }
      }

    } catch (error) {
      this.errors.push(`Browser testing failed: ${error.message}`);
    } finally {
      await browser.close();
    }

    this.generateResponsiveReport();
  }

  async testPageAtViewport(browser, pageInfo, viewport) {
    const page = await browser.newPage();
    
    try {
      // Set viewport
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1
      });

      // Navigate to page
      await page.goto(pageInfo.url, { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });

      // Test responsive elements
      const tests = await page.evaluate(() => {
        const results = {
          hasHorizontalScroll: false,
          navigationVisible: false,
          contentOverflow: false,
          touchTargetSize: true,
          readableText: true
        };

        // Check for horizontal scroll
        results.hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;

        // Check navigation visibility
        const nav = document.querySelector('nav, .navigation, header nav');
        if (nav) {
          const navStyle = window.getComputedStyle(nav);
          results.navigationVisible = navStyle.display !== 'none';
        }

        // Check for content overflow
        const main = document.querySelector('main, .main-content, body');
        if (main) {
          results.contentOverflow = main.scrollWidth > window.innerWidth;
        }

        // Check touch target sizes (minimum 44px)
        const clickableElements = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');
        clickableElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            results.touchTargetSize = false;
          }
        });

        // Check text readability (minimum 16px on mobile)
        const textElements = document.querySelectorAll('p, span, div, li');
        textElements.forEach(element => {
          const style = window.getComputedStyle(element);
          const fontSize = parseFloat(style.fontSize);
          if (window.innerWidth < 768 && fontSize < 16) {
            results.readableText = false;
          }
        });

        return results;
      });

      // Record results
      const testResult = {
        page: pageInfo.name,
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        tests: tests,
        passed: !tests.hasHorizontalScroll && 
                tests.navigationVisible && 
                !tests.contentOverflow && 
                tests.touchTargetSize && 
                tests.readableText
      };

      this.results.push(testResult);

      // Log immediate results
      const status = testResult.passed ? '✅' : '❌';
      console.log(`  ${status} ${viewport.name} (${viewport.width}x${viewport.height})`);

      if (!testResult.passed) {
        if (tests.hasHorizontalScroll) console.log(`    ⚠️  Horizontal scroll detected`);
        if (!tests.navigationVisible) console.log(`    ⚠️  Navigation not visible`);
        if (tests.contentOverflow) console.log(`    ⚠️  Content overflow detected`);
        if (!tests.touchTargetSize) console.log(`    ⚠️  Touch targets too small`);
        if (!tests.readableText) console.log(`    ⚠️  Text too small for mobile`);
      }

    } catch (error) {
      this.errors.push(`Failed to test ${pageInfo.name} at ${viewport.name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  generateResponsiveReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📱 RESPONSIVE DESIGN TEST REPORT');
    console.log('='.repeat(60));

    // Group results by page
    const pageResults = {};
    this.results.forEach(result => {
      if (!pageResults[result.page]) {
        pageResults[result.page] = [];
      }
      pageResults[result.page].push(result);
    });

    // Report by page
    Object.keys(pageResults).forEach(pageName => {
      console.log(`\n📄 ${pageName}:`);
      
      const pageTests = pageResults[pageName];
      const passedTests = pageTests.filter(test => test.passed).length;
      const totalTests = pageTests.length;
      
      console.log(`  Overall: ${passedTests}/${totalTests} viewports passed`);
      
      pageTests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`  ${status} ${test.viewport} (${test.dimensions})`);
      });
    });

    // Overall summary
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const passRate = (passedTests / totalTests * 100).toFixed(1);

    console.log('\n📊 OVERALL SUMMARY:');
    console.log(`  ✅ Passed: ${passedTests}/${totalTests} (${passRate}%)`);
    console.log(`  ❌ Failed: ${totalTests - passedTests}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }

    // Recommendations
    if (passedTests < totalTests) {
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('  • Review CSS media queries for failed viewports');
      console.log('  • Ensure touch targets are at least 44px');
      console.log('  • Use relative units (rem, em) for better scaling');
      console.log('  • Test navigation functionality on mobile devices');
      console.log('  • Consider using CSS Grid or Flexbox for responsive layouts');
    }

    return {
      totalTests,
      passedTests,
      passRate: parseFloat(passRate),
      errors: this.errors.length
    };
  }
}

// CSS Analysis for responsive design
class CSSAnalyzer {
  constructor() {
    this.issues = [];
    this.recommendations = [];
  }

  analyzeCSSFile(filePath) {
    console.log(`\n🎨 Analyzing CSS: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      this.issues.push(`CSS file not found: ${filePath}`);
      return;
    }

    const css = fs.readFileSync(filePath, 'utf8');
    
    // Check for media queries
    const mediaQueries = css.match(/@media[^{]+\{[^{}]*\{[^{}]*\}[^{}]*\}/g) || [];
    if (mediaQueries.length === 0) {
      this.issues.push('No media queries found - site may not be responsive');
    } else {
      console.log(`  ✅ Found ${mediaQueries.length} media queries`);
    }

    // Check for mobile-first approach
    const mobileFirstPattern = /@media\s*\(\s*min-width/g;
    const desktopFirstPattern = /@media\s*\(\s*max-width/g;
    
    const mobileFirstCount = (css.match(mobileFirstPattern) || []).length;
    const desktopFirstCount = (css.match(desktopFirstPattern) || []).length;
    
    if (mobileFirstCount > desktopFirstCount) {
      console.log('  ✅ Mobile-first approach detected');
    } else if (desktopFirstCount > 0) {
      this.recommendations.push('Consider using mobile-first approach with min-width media queries');
    }

    // Check for flexible units
    const flexibleUnits = css.match(/\d+(\.\d+)?(rem|em|%|vw|vh|vmin|vmax)/g) || [];
    const fixedUnits = css.match(/\d+px/g) || [];
    
    if (flexibleUnits.length > fixedUnits.length) {
      console.log('  ✅ Good use of flexible units');
    } else {
      this.recommendations.push('Consider using more flexible units (rem, em, %) instead of px');
    }

    // Check for common responsive patterns
    const hasFlexbox = css.includes('display: flex') || css.includes('display:flex');
    const hasGrid = css.includes('display: grid') || css.includes('display:grid');
    
    if (hasFlexbox) console.log('  ✅ Uses Flexbox for layout');
    if (hasGrid) console.log('  ✅ Uses CSS Grid for layout');
    
    if (!hasFlexbox && !hasGrid) {
      this.recommendations.push('Consider using Flexbox or CSS Grid for responsive layouts');
    }
  }

  generateCSSReport() {
    console.log('\n🎨 CSS ANALYSIS REPORT:');
    
    if (this.issues.length > 0) {
      console.log('\n❌ ISSUES:');
      this.issues.forEach(issue => console.log(`  ${issue}`));
    }

    if (this.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }
}

// Main execution
async function main() {
  const tester = new ResponsiveTester();
  const cssAnalyzer = new CSSAnalyzer();

  // Analyze CSS files
  const cssFiles = [
    path.join(__dirname, '../src/assets/css/main.css'),
    path.join(__dirname, '../src/assets/css/critical.css')
  ];

  cssFiles.forEach(file => cssAnalyzer.analyzeCSSFile(file));
  cssAnalyzer.generateCSSReport();

  // Test responsiveness (requires dev server to be running)
  try {
    await tester.testResponsiveness();
  } catch (error) {
    console.log('\n⚠️  Could not run browser tests. Make sure dev server is running on http://localhost:5173');
    console.log('   Run: npm run dev');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ResponsiveTester, CSSAnalyzer };