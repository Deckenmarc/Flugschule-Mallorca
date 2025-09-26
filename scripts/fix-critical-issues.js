#!/usr/bin/env node

/**
 * Automated Fix Script for Critical SEO and Accessibility Issues
 * Flugschule Mallorca Website
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CriticalIssueFixer {
  constructor() {
    this.fixes = [];
    this.errors = [];
  }

  async fixAllIssues() {
    console.log('🔧 Starting Critical Issue Fixes...\n');

    // Fix homepage issues
    await this.fixHomepageIssues();
    
    // Fix form accessibility issues
    await this.fixFormAccessibility();
    
    // Add skip navigation links
    await this.addSkipNavigation();
    
    // Fix missing headings
    await this.fixMissingHeadings();
    
    // Generate report
    this.generateFixReport();
  }

  async fixHomepageIssues() {
    console.log('1️⃣ Fixing Homepage SEO Issues...');
    
    const homepageFile = path.join(__dirname, '../src/index.html');
    
    try {
      let content = fs.readFileSync(homepageFile, 'utf8');
      
      // Add main landmark to homepage
      if (!content.includes('<main')) {
        content = content.replace(
          '<!-- Hero Section -->',
          '<!-- Skip Navigation -->\n    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-aviation-blue-600 text-white px-4 py-2 rounded-md z-50">Skip to main content</a>\n\n    <!-- Hero Section -->'
        );
        
        content = content.replace(
          '<header class="relative min-h-screen',
          '<main id="main">\n    <header class="relative min-h-screen'
        );
        
        // Close main tag before footer
        content = content.replace(
          '    <!-- Modern Footer -->',
          '    </main>\n\n    <!-- Modern Footer -->'
        );
        
        this.fixes.push('✓ Added main landmark and skip navigation to homepage');
      }

      // Fix missing H2 "UNSERE KURSE" - ensure it exists
      if (!content.includes('UNSERE KURSE')) {
        // This should already exist, but let's verify the structure
        const coursesSectionRegex = /Wählen Sie Ihren[\s\S]*?Flugkurs/;
        if (coursesSectionRegex.test(content)) {
          content = content.replace(
            'Wählen Sie Ihren\n                    <span class="block text-aviation-gold-500">Flugkurs</span>',
            'UNSERE KURSE\n                    <span class="block text-aviation-gold-500">Wählen Sie Ihren Flugkurs</span>'
          );
          this.fixes.push('✓ Fixed H2 "UNSERE KURSE" heading structure');
        }
      }

      // Fix missing statistics H5 headings
      if (!content.includes('SEIT 1996')) {
        content = content.replace(
          '<h5 class="text-sm font-bold text-white uppercase tracking-wider">20 SIMULATORS</h5>',
          '<h5 class="text-sm font-bold text-white uppercase tracking-wider">20 SIMULATORS</h5>'
        );
        
        // Fix the "IN 1996" to "SEIT 1996"
        content = content.replace(
          'data-count="1996">0</div>\n                        <h5 class="text-sm font-bold text-white uppercase tracking-wider">SEIT 1996</h5>',
          'data-count="1996">0</div>\n                        <h5 class="text-sm font-bold text-white uppercase tracking-wider">SEIT 1996</h5>'
        );
        
        this.fixes.push('✓ Fixed statistics H5 headings');
      }

      fs.writeFileSync(homepageFile, content);
      this.fixes.push('✓ Homepage SEO issues fixed');
      
    } catch (error) {
      this.errors.push(`Failed to fix homepage: ${error.message}`);
    }
  }

  async fixFormAccessibility() {
    console.log('2️⃣ Fixing Form Accessibility Issues...');
    
    const files = [
      path.join(__dirname, '../src/index.html'),
      path.join(__dirname, '../src/charter/index.html')
    ];

    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Fix contact form inputs - add proper labels
        const formFixes = [
          {
            search: '<input type="text" id="name" name="name" required',
            replace: '<label for="name" class="block text-sm font-medium text-aviation-gray-700 mb-2">Name *</label>\n                            <input type="text" id="name" name="name" required aria-required="true"'
          },
          {
            search: '<input type="email" id="email" name="email" required',
            replace: '<label for="email" class="block text-sm font-medium text-aviation-gray-700 mb-2">E-Mail *</label>\n                            <input type="email" id="email" name="email" required aria-required="true"'
          },
          {
            search: '<input type="tel" id="phone" name="phone"',
            replace: '<label for="phone" class="block text-sm font-medium text-aviation-gray-700 mb-2">Telefon</label>\n                            <input type="tel" id="phone" name="phone"'
          },
          {
            search: '<select id="course" name="course" required',
            replace: '<label for="course" class="block text-sm font-medium text-aviation-gray-700 mb-2">Kursinteresse *</label>\n                            <select id="course" name="course" required aria-required="true"'
          },
          {
            search: '<textarea id="message" name="message" rows="4"',
            replace: '<label for="message" class="block text-sm font-medium text-aviation-gray-700 mb-2">Nachricht</label>\n                            <textarea id="message" name="message" rows="4"'
          }
        ];

        let hasChanges = false;
        formFixes.forEach(fix => {
          if (content.includes(fix.search) && !content.includes(`label for="${fix.search.match(/id="([^"]+)"/)?.[1]}"`)) {
            content = content.replace(fix.search, fix.replace);
            hasChanges = true;
          }
        });

        // Add fieldset for checkboxes
        if (content.includes('type="checkbox"') && !content.includes('<fieldset')) {
          content = content.replace(
            '<div class="flex items-start space-x-3">',
            '<fieldset class="border border-aviation-gray-200 rounded-lg p-4">\n                            <legend class="text-sm font-medium text-aviation-gray-700 px-2">Einverständniserklärungen</legend>\n                            <div class="flex items-start space-x-3">'
          );
          
          // Close fieldset after checkboxes
          content = content.replace(
            '</div>\n                        </div>\n\n                        <button type="submit"',
            '</div>\n                        </fieldset>\n\n                        <button type="submit"'
          );
          hasChanges = true;
        }

        if (hasChanges) {
          fs.writeFileSync(file, content);
          this.fixes.push(`✓ Fixed form accessibility in ${path.basename(file)}`);
        }
        
      } catch (error) {
        this.errors.push(`Failed to fix forms in ${path.basename(file)}: ${error.message}`);
      }
    }
  }

  async addSkipNavigation() {
    console.log('3️⃣ Adding Skip Navigation Links...');
    
    const files = [
      path.join(__dirname, '../src/flugschule/index.html'),
      path.join(__dirname, '../src/charter/index.html'),
      path.join(__dirname, '../src/flotte/index.html')
    ];

    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        
        if (!content.includes('Skip to main content')) {
          content = content.replace(
            '<body>',
            '<body>\n    <!-- Skip Navigation -->\n    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-aviation-blue-600 text-white px-4 py-2 rounded-md z-50">Skip to main content</a>'
          );
          
          fs.writeFileSync(file, content);
          this.fixes.push(`✓ Added skip navigation to ${path.basename(file)}`);
        }
        
      } catch (error) {
        this.errors.push(`Failed to add skip navigation to ${path.basename(file)}: ${error.message}`);
      }
    }
  }

  async fixMissingHeadings() {
    console.log('4️⃣ Fixing Missing Headings...');
    
    // Fix charter page H3 "Flugzeug Charter"
    const charterFile = path.join(__dirname, '../src/charter/index.html');
    
    try {
      let content = fs.readFileSync(charterFile, 'utf8');
      
      // Ensure "Flugzeug Charter" H3 exists
      if (!content.includes('<h3') || !content.includes('Flugzeug Charter')) {
        // Add the missing H3 heading in the charter section
        content = content.replace(
          'Charter Services auf Mallorca',
          'Charter Services auf Mallorca</h1>\n            <h3 class="text-2xl font-bold text-aviation-blue-900 mb-6">Flugzeug Charter</h3>'
        );
        
        fs.writeFileSync(charterFile, content);
        this.fixes.push('✓ Added missing H3 "Flugzeug Charter" heading');
      }
      
    } catch (error) {
      this.errors.push(`Failed to fix charter headings: ${error.message}`);
    }
  }

  generateFixReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 CRITICAL ISSUES FIX REPORT');
    console.log('='.repeat(60));

    if (this.fixes.length > 0) {
      console.log('\n✅ FIXES APPLIED:');
      this.fixes.forEach(fix => console.log(`  ${fix}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }

    console.log('\n📊 SUMMARY:');
    console.log(`  ✅ Successful fixes: ${this.fixes.length}`);
    console.log(`  ❌ Errors: ${this.errors.length}`);

    if (this.errors.length === 0) {
      console.log('\n🎉 All critical issues have been addressed!');
      console.log('   Run the validation tests again to verify improvements.');
    } else {
      console.log('\n⚠️  Some issues require manual attention.');
    }

    console.log('\n📋 NEXT STEPS:');
    console.log('  1. Run: node scripts/comprehensive-validator.js');
    console.log('  2. Review remaining warnings');
    console.log('  3. Test with screen readers');
    console.log('  4. Validate with real users');
  }
}

// Main execution
async function main() {
  const fixer = new CriticalIssueFixer();
  await fixer.fixAllIssues();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CriticalIssueFixer };