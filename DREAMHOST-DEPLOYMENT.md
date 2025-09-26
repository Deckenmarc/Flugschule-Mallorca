# DreamHost Deployment Guide - Flugschule Mallorca

This guide provides step-by-step instructions for deploying the Flugschule Mallorca website to DreamHost hosting.

## Prerequisites

- DreamHost hosting account with SSH access
- Domain configured in DreamHost panel
- Node.js 18+ (for local building)

## Deployment Steps

### 1. Build the Website Locally

First, build the production version of the website:

```bash
# Install dependencies (if not already done)
npm install

# Build production version
npm run build:prod
```

This creates a `dist` folder with all the optimized files.

### 2. Upload Files to DreamHost

#### Option A: Using FTP/SFTP Client (Recommended)

1. **Connect to your DreamHost server:**
   - Host: `your-domain.com` or DreamHost server IP
   - Username: Your DreamHost username
   - Password: Your DreamHost password
   - Port: 22 (SFTP) or 21 (FTP)

2. **Navigate to your domain's directory:**
   ```
   /home/username/your-domain.com/
   ```

3. **Upload the contents of the `dist` folder:**
   - Upload all files from `dist/` to your domain's root directory
   - Make sure to upload:
     - `index.html`
     - `assets/` folder (CSS, JS, images)
     - `flugschule/`, `charter/`, `flotte/` folders
     - `sitemap.xml`, `robots.txt`
     - `_headers`, `_redirects` (for configuration)

#### Option B: Using SSH/SCP

1. **Connect via SSH:**
   ```bash
   ssh username@your-domain.com
   ```

2. **Navigate to your domain directory:**
   ```bash
   cd ~/your-domain.com/
   ```

3. **Upload files using SCP from your local machine:**
   ```bash
   scp -r dist/* username@your-domain.com:~/your-domain.com/
   ```

### 3. Configure DreamHost Settings

#### Enable HTTPS
1. Log into DreamHost Panel
2. Go to **Secure Certificates**
3. Add a **Let's Encrypt SSL certificate** for your domain
4. Enable **Force HTTPS redirect**

#### Configure Custom Error Pages (Optional)
1. In DreamHost Panel, go to **Domains > Manage Domains**
2. Click **Edit** next to your domain
3. Set custom 404 page to `/index.html` for SPA-like behavior

### 4. Set Up Form Handling

Since DreamHost doesn't support serverless functions like Netlify, you'll need to set up form handling:

#### Option A: Use a Third-Party Service

**Formspree (Recommended):**
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Update the contact form in your HTML files:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

**Getform:**
1. Sign up at [getform.io](https://getform.io)
2. Create a new form endpoint
3. Update the contact form action URL

#### Option B: PHP Contact Form (Advanced)

If you want to handle forms on DreamHost directly, create a PHP script:

1. **Create `contact.php` in your domain root:**
   ```php
   <?php
   if ($_POST) {
       $name = $_POST['name'];
       $email = $_POST['email'];
       $message = $_POST['message'];
       $courseInterest = $_POST['courseInterest'];
       
       // Validate and sanitize input
       $name = htmlspecialchars(strip_tags($name));
       $email = filter_var($email, FILTER_SANITIZE_EMAIL);
       $message = htmlspecialchars(strip_tags($message));
       
       // Send email
       $to = "contact@flightservice365.com";
       $subject = "Neue Anfrage von $name";
       $body = "Name: $name\nEmail: $email\nKurs: $courseInterest\nNachricht: $message";
       $headers = "From: $email";
       
       if (mail($to, $subject, $body, $headers)) {
           echo json_encode(['success' => true, 'message' => 'Nachricht gesendet!']);
       } else {
           echo json_encode(['success' => false, 'message' => 'Fehler beim Senden.']);
       }
   }
   ?>
   ```

2. **Update form action in HTML files:**
   ```html
   <form action="/contact.php" method="POST">
   ```

### 5. Configure Analytics

1. **Get Google Analytics 4 Measurement ID:**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create a new property for your domain
   - Copy the Measurement ID (G-XXXXXXXXXX)

2. **Update analytics configuration:**
   - Edit `assets/js/analytics-[hash].js` in your uploaded files
   - Replace `G-XXXXXXXXXX` with your actual Measurement ID

### 6. Set Up Redirects and Headers

DreamHost supports `.htaccess` files for Apache configuration. Create a `.htaccess` file in your domain root:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Clean URLs
RewriteRule ^flugschule/?$ /flugschule/index.html [L]
RewriteRule ^charter/?$ /charter/index.html [L]
RewriteRule ^flotte/?$ /flotte/index.html [L]

# Legacy redirects
RewriteRule ^flight-school/?$ /flugschule/ [R=301,L]
RewriteRule ^aircraft/?$ /flotte/ [R=301,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache optimization
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### 7. Test Your Deployment

1. **Visit your domain** and verify:
   - All pages load correctly
   - Images display properly
   - Forms work (if using PHP or third-party service)
   - HTTPS is working
   - Mobile responsiveness

2. **Test SEO elements:**
   - Check `your-domain.com/sitemap.xml`
   - Check `your-domain.com/robots.txt`
   - Verify meta tags and structured data

3. **Performance testing:**
   - Use Google PageSpeed Insights
   - Test Core Web Vitals
   - Verify analytics tracking

### 8. Set Up Monitoring

1. **Google Search Console:**
   - Add and verify your domain
   - Submit your sitemap
   - Monitor indexing and performance

2. **Analytics:**
   - Verify Google Analytics is tracking
   - Set up conversion goals
   - Monitor lead generation

### 9. Maintenance and Updates

To update your website:

1. **Make changes locally**
2. **Build new version:** `npm run build:prod`
3. **Upload updated files** to DreamHost
4. **Clear any caches** if needed

## Troubleshooting

### Common Issues

**Forms not working:**
- Check form action URLs
- Verify PHP mail configuration
- Test with third-party form services

**Images not loading:**
- Check file paths and case sensitivity
- Verify all image files were uploaded
- Check file permissions (755 for directories, 644 for files)

**HTTPS issues:**
- Ensure SSL certificate is installed
- Check .htaccess redirect rules
- Verify mixed content warnings

**Performance issues:**
- Enable Gzip compression
- Optimize image sizes
- Use DreamHost's CDN if available

## Support

For DreamHost-specific issues:
- DreamHost Knowledge Base
- DreamHost Support Panel
- Community forums

For website issues:
- Check browser developer console
- Review server error logs
- Test in different browsers

---

## Quick Deployment Checklist

- [ ] Build production version (`npm run build:prod`)
- [ ] Upload all files from `dist/` to domain root
- [ ] Configure SSL certificate
- [ ] Set up form handling (Formspree/PHP)
- [ ] Update Google Analytics ID
- [ ] Create `.htaccess` file
- [ ] Test all pages and functionality
- [ ] Submit sitemap to Google Search Console
- [ ] Set up monitoring and analytics

Your Flugschule Mallorca website is now ready for DreamHost hosting!