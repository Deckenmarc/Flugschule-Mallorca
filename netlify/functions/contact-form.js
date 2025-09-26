// Netlify function for enhanced contact form processing
// Handles form submissions with validation, spam protection, and lead tracking

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const formData = JSON.parse(event.body);
    
    // Basic validation
    const requiredFields = ['name', 'email', 'courseInterest'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Fehlende Pflichtfelder',
          missingFields 
        })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Ungültige E-Mail-Adresse' 
        })
      };
    }

    // Spam protection - simple honeypot check
    if (formData.website) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Spam detected' 
        })
      };
    }

    // Prepare lead data for tracking
    const leadData = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: event.headers.referer || 'direct',
      userAgent: event.headers['user-agent'],
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for'],
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Log lead for analytics (in production, send to CRM or analytics service)
    console.log('New lead generated:', JSON.stringify(leadData, null, 2));

    // Send notification email (implement with your preferred email service)
    // await sendNotificationEmail(leadData);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Vielen Dank für Ihre Anfrage! Wir werden uns bald bei Ihnen melden.',
        leadId: leadData.id
      })
    };

  } catch (error) {
    console.error('Form processing error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Interner Serverfehler. Bitte versuchen Sie es später erneut.'
      })
    };
  }
};

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