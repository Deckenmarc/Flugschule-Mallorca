# Deployment Guide - Flugschule Mallorca Website

This guide provides step-by-step instructions for deploying the Flugschule Mallorca website to production hosting with CDN, form handling, and analytics.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository access
- Hosting provider account (Netlify recommended)

## Quick Deployment

### Option 1: Netlify (Recommended)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run deploy:netlify
   ```

3. **Follow the prompts to:**
   - Connect to your Netlify account
   - Create a new site or select existing
   - Configure domain settings

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build and deploy:**
   ```bash
   npm run deploy:vercel
   ```

### Option 3: Manual Deployment

1. **Build the project:**
   ```bash
   npm run build:prod
   ```

2. **Upload the `dist` folder to your hosting provider**

## Detailed Setup Instructions

### 1. Static Hosting Configuration

#### Netlify Setup
- **Build command:** `npm run build:prod`
- **Publish directory:** `dist`
- **Node version:** 18

#### Vercel Setup
- **Framework preset:** Other
- **Build command:** `npm run build:prod`
- **Output directory:** `dist`

#### Other Static Hosts
- Upload contents of `dist` folder to web root
- Ensure server supports SPA routing (see redirect rules)

### 2. Domain and SSL Configuration

#### Custom Domain Setup
1. **Add domain in hosting provider dashboard**
2. **Update DNS records:**
   - A record: Point to hosting provider IP
   - CNAME: Point www to main domain
3. **Enable SSL certificate** (usually automatic)
4. **Force HTTPS redirect** in hosting settings

#### DNS Configuration Example
```
Type    Name    Value
A       @       192.0.2.1
CNAME   www     flugschule-mallorca.com
```

### 3. Form Handling Setup

#### Netlify Forms (Recommended)
Forms are automatically configured via `netlify.toml`. No additional setup required.

#### Alternative Form Services
If not using Netlify, configure one of these services:

**Formspree:**
1. Create account at formspree.io
2. Update form action in HTML files:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

**Getform:**
1. Create account at getform.io
2. Update form action in HTML files:
   ```html
   <form action="https://getform.io/f/YOUR_FORM_ID" method="POST">
   ```

### 4. Analytics Configuration

#### Google Analytics 4 Setup
1. **Create GA4 property** at analytics.google.com
2. **Get Measurement ID** (format: G-XXXXXXXXXX)
3. **Update analytics.js:**
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR-MEASUREMENT-ID';
   ```
4. **Redeploy the site**

#### Google Tag Manager (Optional)
1. **Create GTM account** at tagmanager.google.com
2. **Add GTM code** to HTML head section:
   ```html
   <!-- Google Tag Manager -->
   <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
   })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
   <!-- End Google Tag Manager -->
   ```

### 5. SEO and Performance Optimization

#### Search Console Setup
1. **Verify domain** in Google Search Console
2. **Submit sitemap:** `https://your-domain.com/sitemap.xml`
3. **Monitor indexing** and fix any issues

#### Performance Monitoring
1. **Set up Core Web Vitals monitoring**
2. **Configure performance budgets**
3. **Enable real user monitoring (RUM)**

## Environment Variables

### Production Environment Variables
Set these in your hosting provider's dashboard:

```bash
NODE_ENV=production
GA_MEASUREMENT_ID=G-XXXXXXXXXX
CONTACT_EMAIL=contact@flightservice365.com
```

### Development Environment Variables
Create `.env.local` file:

```bash
NODE_ENV=development
GA_MEASUREMENT_ID=G-XXXXXXXXXX
CONTACT_EMAIL=contact@flightservice365.com
```

## Security Configuration

### Content Security Policy
The site includes security headers via `_headers` file:

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### GDPR Compliance
- Cookie consent is handled in analytics.js
- Form data collection notices are included
- Privacy policy link is in footer

## Monitoring and Maintenance

### Uptime Monitoring
Set up monitoring with services like:
- UptimeRobot
- Pingdom
- StatusCake

### Performance Monitoring
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### Analytics Monitoring
- Google Analytics 4
- Google Search Console
- Lead generation tracking

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

**Form Submissions Not Working:**
- Check form action URLs
- Verify CORS settings
- Test with browser developer tools

**Analytics Not Tracking:**
- Verify GA4 Measurement ID
- Check browser console for errors
- Test in incognito mode

**SEO Issues:**
- Validate HTML structure
- Check meta tags
- Verify sitemap accessibility

### Support Contacts

For deployment issues:
- Check project documentation
- Review hosting provider docs
- Contact development team

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm run test:all`)
- [ ] Build successful (`npm run build:prod`)
- [ ] Content reviewed and approved
- [ ] Analytics configured
- [ ] Form handling tested

### Post-Deployment
- [ ] Domain and SSL configured
- [ ] All pages loading correctly
- [ ] Forms submitting successfully
- [ ] Analytics tracking verified
- [ ] Mobile responsiveness tested
- [ ] SEO elements validated
- [ ] Performance metrics acceptable

### Ongoing Maintenance
- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] Content updates as needed
- [ ] Analytics review monthly
- [ ] Backup verification

---

## Quick Reference Commands

```bash
# Development
npm run dev                 # Start development server
npm run preview            # Preview production build

# Testing
npm run test:all           # Run all tests
npm run validate           # Validate before deployment

# Building
npm run build              # Standard build
npm run build:prod         # Production build with optimizations

# Deployment
npm run deploy             # Prepare for deployment
npm run deploy:netlify     # Deploy to Netlify
npm run deploy:vercel      # Deploy to Vercel
```

For detailed technical documentation, see the project README and individual component documentation.