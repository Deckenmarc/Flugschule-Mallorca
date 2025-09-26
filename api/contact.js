// Vercel serverless function for contact form processing
// Alternative to Netlify Functions for form handling

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Basic validation
    const requiredFields = ['name', 'email', 'courseInterest'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Fehlende Pflichtfelder',
        missingFields 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({ 
        error: 'Ungültige E-Mail-Adresse' 
      });
    }

    // Spam protection - simple honeypot check
    if (formData.website) {
      return res.status(400).json({ 
        error: 'Spam detected' 
      });
    }

    // Prepare lead data for tracking
    const leadData = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: req.headers.referer || 'direct',
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Log lead for analytics (in production, send to CRM or analytics service)
    console.log('New lead generated:', JSON.stringify(leadData, null, 2));

    // In production, you would send this data to:
    // - Email service (SendGrid, Mailgun, etc.)
    // - CRM system (HubSpot, Salesforce, etc.)
    // - Database for lead tracking
    // - Slack/Discord notification

    // Example email notification (implement with your preferred service)
    // await sendNotificationEmail(leadData);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Vielen Dank für Ihre Anfrage! Wir werden uns bald bei Ihnen melden.',
      leadId: leadData.id
    });

  } catch (error) {
    console.error('Form processing error:', error);
    
    return res.status(500).json({
      error: 'Interner Serverfehler. Bitte versuchen Sie es später erneut.'
    });
  }
}

// Helper function for email notifications (implement based on your email service)
async function sendNotificationEmail(leadData) {
  // Example implementation with SendGrid, Mailgun, or similar
  // const emailService = require('your-email-service');
  // 
  // await emailService.send({
  //   to: 'contact@flightservice365.com',
  //   subject: `Neue Anfrage von ${leadData.name}`,
  //   html: generateEmailTemplate(leadData)
  // });
}

function generateEmailTemplate(leadData) {
  return `
    <h2>Neue Kontaktanfrage - Flugschule Mallorca</h2>
    <p><strong>Name:</strong> ${leadData.name}</p>
    <p><strong>E-Mail:</strong> ${leadData.email}</p>
    <p><strong>Telefon:</strong> ${leadData.phone || 'Nicht angegeben'}</p>
    <p><strong>Kursinteresse:</strong> ${leadData.courseInterest}</p>
    <p><strong>Bevorzugter Kontakt:</strong> ${leadData.preferredContact || 'E-Mail'}</p>
    <p><strong>Nachricht:</strong></p>
    <p>${leadData.message || 'Keine Nachricht'}</p>
    <hr>
    <p><strong>Lead-ID:</strong> ${leadData.id}</p>
    <p><strong>Zeitstempel:</strong> ${leadData.timestamp}</p>
    <p><strong>Quelle:</strong> ${leadData.source}</p>
  `;
}