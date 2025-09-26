#!/usr/bin/env node

// Deployment script for Flugschule Mallorca website
// Handles build optimization, validation, and deployment preparation

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

class DeploymentManager {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.deploymentConfig = {
      environment: process.env.NODE_ENV || 'production',
      buildDir: 'dist',
      sourceDir: 'src'
    };
  }

  async deploy() {
    console.log('🚀 Starting deployment process for Flugschule Mallorca...\n');

    try {
      await this.validateEnvironment();
      await this.runPreDeploymentChecks();
      await this.optimizeBuild();
      await this.validateBuild();
      await this.generateDeploymentReport();
      
      if (this.errors.length === 0) {
        console.log('✅ Deployment preparation completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Review the deployment report in deployment-report.md');
        console.log('2. Deploy to your hosting provider (Netlify, Vercel, etc.)');
        console.log('3. Configure domain and SSL certificates');
        console.log('4. Set up form handling and analytics');
      } else {
        console.log('❌ Deployment preparation failed with errors:');
        this.errors.forEach(error => console.log(`   - ${error}`));
        process.exit(1);
      }
    } catch (error) {
      console.error('💥 Deployment failed:', error.message);
      process.exit(1);
    }
  }

  async validateEnvironment() {
    console.log('🔍 Validating environment...');

    // Check Node.js version
    const nodeVersion = process.version;
    const requiredNodeVersion = '18.0.0';
    if (!this.compareVersions(nodeVersion.slice(1), requiredNodeVersion)) {
      this.errors.push(`Node.js version ${requiredNodeVersion} or higher required, found ${nodeVersion}`);
    }

    // Check required files
    const requiredFiles = [
      'package.json',
      'vite.config.js',
      'tailwind.config.js',
      'src/index.html',
      'netlify.toml'
    ];

    requiredFiles.forEach(file => {
      if (!existsSync(resolve(rootDir, file))) {
        this.errors.push(`Required file missing: ${file}`);
      }
    });

    console.log('✓ Environment validation completed');
  }

  async runPreDeploymentChecks() {
    console.log('🧪 Running pre-deployment checks...');

    try {
      // Run SEO validation
      console.log('  - Running SEO validation...');
      execSync('npm run test:seo', { cwd: rootDir, stdio: 'pipe' });
      
      // Run accessibility checks
      console.log('  - Running accessibility checks...');
      execSync('npm run test:accessibility', { cwd: rootDir, stdio: 'pipe' });
      
      // Run responsive design tests
      console.log('  - Running responsive design tests...');
      execSync('npm run test:responsive', { cwd: rootDir, stdio: 'pipe' });
      
      console.log('✓ All pre-deployment checks passed');
    } catch (error) {
      this.warnings.push('Some pre-deployment checks failed - review test outputs');
    }
  }

  async optimizeBuild() {
    console.log('🏗️  Building optimized production version...');

    try {
      // Clean previous build
      if (existsSync(resolve(rootDir, 'dist'))) {
        execSync('rm -rf dist', { cwd: rootDir });
      }

      // Run production build
      execSync('npm run build:prod', { cwd: rootDir, stdio: 'inherit' });
      
      // Copy deployment files to dist
      this.copyDeploymentFiles();
      
      console.log('✓ Production build completed');
    } catch (error) {
      this.errors.push(`Build failed: ${error.message}`);
    }
  }

  copyDeploymentFiles() {
    const deploymentFiles = [
      { src: 'netlify.toml', dest: 'dist/netlify.toml' },
      { src: '_headers', dest: 'dist/_headers' },
      { src: '_redirects', dest: 'dist/_redirects' }
    ];

    deploymentFiles.forEach(({ src, dest }) => {
      const srcPath = resolve(rootDir, src);
      const destPath = resolve(rootDir, dest);
      
      if (existsSync(srcPath)) {
        copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied ${src} to dist/`);
      }
    });
  }

  async validateBuild() {
    console.log('🔍 Validating build output...');

    const distDir = resolve(rootDir, 'dist');
    
    // Check if build directory exists
    if (!existsSync(distDir)) {
      this.errors.push('Build directory (dist) not found');
      return;
    }

    // Check required files in build
    const requiredBuildFiles = [
      'index.html',
      'flugschule/index.html',
      'charter/index.html',
      'flotte/index.html',
      'sitemap.xml',
      'robots.txt'
    ];

    requiredBuildFiles.forEach(file => {
      if (!existsSync(resolve(distDir, file))) {
        this.errors.push(`Required build file missing: ${file}`);
      }
    });

    // Validate HTML files
    this.validateHTMLFiles();
    
    // Check asset optimization
    this.validateAssetOptimization();

    console.log('✓ Build validation completed');
  }

  validateHTMLFiles() {
    const htmlFiles = [
      'dist/index.html',
      'dist/flugschule/index.html',
      'dist/charter/index.html',
      'dist/flotte/index.html'
    ];

    htmlFiles.forEach(file => {
      const filePath = resolve(rootDir, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf8');
        
        // Check for required SEO elements
        if (!content.includes('<title>')) {
          this.warnings.push(`Missing title tag in ${file}`);
        }
        if (!content.includes('meta name="description"')) {
          this.warnings.push(`Missing meta description in ${file}`);
        }
        if (!content.includes('FLUGSCHULE MALLORCA')) {
          this.warnings.push(`Missing main heading in ${file}`);
        }
      }
    });
  }

  validateAssetOptimization() {
    const assetsDir = resolve(rootDir, 'dist/assets');
    
    if (existsSync(assetsDir)) {
      // Check if CSS is minified
      const cssFiles = execSync('find dist/assets -name "*.css"', { cwd: rootDir, encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
      
      if (cssFiles.length === 0) {
        this.warnings.push('No CSS files found in build');
      }

      // Check if JS is minified
      const jsFiles = execSync('find dist/assets -name "*.js"', { cwd: rootDir, encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
      
      if (jsFiles.length === 0) {
        this.warnings.push('No JavaScript files found in build');
      }
    }
  }

  async generateDeploymentReport() {
    console.log('📊 Generating deployment report...');

    const report = this.createDeploymentReport();
    writeFileSync(resolve(rootDir, 'deployment-report.md'), report);
    
    console.log('✓ Deployment report generated: deployment-report.md');
  }

  createDeploymentReport() {
    const timestamp = new Date().toISOString();
    const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
    
    return `# Deployment Report - Flugschule Mallorca

**Generated:** ${timestamp}
**Version:** ${packageJson.version}
**Environment:** ${this.deploymentConfig.environment}

## Build Status

${this.errors.length === 0 ? '✅ **SUCCESS** - Ready for deployment' : '❌ **FAILED** - Issues need to be resolved'}

## Errors (${this.errors.length})

${this.errors.length > 0 ? this.errors.map(error => `- ❌ ${error}`).join('\n') : 'No errors found.'}

## Warnings (${this.warnings.length})

${this.warnings.length > 0 ? this.warnings.map(warning => `- ⚠️ ${warning}`).join('\n') : 'No warnings.'}

## Deployment Checklist

### Hosting Configuration
- [ ] Static hosting provider configured (Netlify/Vercel/etc.)
- [ ] Domain name configured
- [ ] SSL certificate installed
- [ ] CDN enabled for global performance

### Form Handling
- [ ] Netlify Forms enabled (or alternative form service)
- [ ] Form submission notifications configured
- [ ] GDPR compliance implemented
- [ ] Spam protection enabled

### Analytics & Monitoring
- [ ] Google Analytics 4 configured
- [ ] Google Tag Manager set up (optional)
- [ ] Lead generation tracking implemented
- [ ] Performance monitoring enabled
- [ ] Error tracking configured

### SEO & Performance
- [ ] Sitemap submitted to search engines
- [ ] Google Search Console configured
- [ ] Core Web Vitals optimized
- [ ] Mobile-first indexing verified
- [ ] Structured data implemented

### Security
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Content Security Policy implemented
- [ ] Privacy policy updated

## Next Steps

1. **Deploy to hosting provider:**
   \`\`\`bash
   # For Netlify CLI
   netlify deploy --prod --dir=dist
   
   # For Vercel CLI
   vercel --prod
   \`\`\`

2. **Configure domain and SSL:**
   - Point domain to hosting provider
   - Enable SSL certificate
   - Configure redirects if needed

3. **Set up analytics:**
   - Replace GA_MEASUREMENT_ID in analytics.js
   - Configure Google Tag Manager (optional)
   - Set up conversion tracking

4. **Test deployment:**
   - Verify all pages load correctly
   - Test form submissions
   - Check mobile responsiveness
   - Validate SEO elements

5. **Monitor performance:**
   - Set up uptime monitoring
   - Configure performance alerts
   - Monitor Core Web Vitals

## Contact Information

For deployment support, contact the development team or refer to the project documentation.

---
*This report was generated automatically by the deployment script.*`;
  }

  compareVersions(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part > v2part) return true;
      if (v1part < v2part) return false;
    }
    return true;
  }
}

// Run deployment if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployment = new DeploymentManager();
  deployment.deploy().catch(console.error);
}

export default DeploymentManager;