// app/api/notify/route.js
// Notification routing system with Teams and Brevo SMTP options
// Sends the same notification via multiple channels

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { type, data } = await req.json();
    
    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
    }

    const results = [];

    // Route 1: Teams Integration
    if (process.env.TEAMS_WEBHOOK_URL) {
      try {
        const teamsResult = await sendTeamsNotification(type, data);
        results.push({ channel: 'teams', success: true, ...teamsResult });
      } catch (error) {
        console.error('[notify] Teams error:', error);
        results.push({ channel: 'teams', success: false, error: error.message });
      }
    } else {
      results.push({ channel: 'teams', success: false, error: 'TEAMS_WEBHOOK_URL not configured' });
    }

    // Route 2: Brevo SMTP Email
    if (process.env.BREVO_SMTP_KEY) {
      try {
        const emailResult = await sendBrevoEmail(type, data);
        results.push({ channel: 'email', success: true, ...emailResult });
      } catch (error) {
        console.error('[notify] Brevo SMTP error:', error);
        results.push({ channel: 'email', success: false, error: error.message });
      }
    } else {
      results.push({ channel: 'email', success: false, error: 'BREVO_SMTP_KEY not configured' });
    }

    // Return summary
    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      success: successCount > 0,
      totalChannels: results.length,
      successfulChannels: successCount,
      results,
    });

  } catch (error) {
    console.error('[notify] Routing error:', error);
    return NextResponse.json({ error: 'Notification routing failed' }, { status: 500 });
  }
}

// ─── Teams Integration ────────────────────────────────────────────────────────
async function sendTeamsNotification(type, data) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  
  const teamsMessage = buildTeamsMessage(type, data);
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamsMessage),
  });

  if (!response.ok) {
    throw new Error(`Teams webhook failed: ${response.status} ${response.statusText}`);
  }

  return { messageId: response.headers.get('x-ms-request-id') };
}

function buildTeamsMessage(type, data) {
  const baseMessage = {
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    summary: getNotificationSummary(type, data),
    themeColor: "e85d04", // Abstrakt orange
    sections: []
  };

  switch (type) {
    case 'audit_completed':
      return {
        ...baseMessage,
        title: "🎯 New AI Audit Completed",
        sections: [{
          activityTitle: `${data.company} Assessment`,
          activitySubtitle: `Score: ${data.score}/100 | Industry: ${data.industry}`,
          facts: [
            { name: "Company", value: data.company },
            { name: "Website", value: data.website },
            { name: "Contact", value: `${data.firstName} ${data.lastName} (${data.email})` },
            { name: "AI Visibility Score", value: `${data.score}/100` },
            { name: "Urgency", value: data.urgency },
          ],
          potentialAction: [{
            "@type": "OpenUri",
            name: "View Results",
            targets: [{ os: "default", uri: data.resultsUrl }]
          }]
        }]
      };

    case 'form_submission':
      return {
        ...baseMessage,
        title: "📝 New Assessment Form Submitted",
        sections: [{
          activityTitle: `${data.company} - Lead Captured`,
          facts: [
            { name: "Company", value: data.company },
            { name: "Contact", value: `${data.firstName} ${data.lastName}` },
            { name: "Email", value: data.email },
            { name: "Phone", value: data.phone || 'Not provided' },
            { name: "Industry", value: data.industry },
            { name: "Goal", value: data.goal },
            { name: "Budget Range", value: data.budgetRange },
          ]
        }]
      };

    default:
      return {
        ...baseMessage,
        title: "📋 AMG Notification",
        sections: [{ text: JSON.stringify(data, null, 2) }]
      };
  }
}

// ─── Brevo SMTP Email ─────────────────────────────────────────────────────────
async function sendBrevoEmail(type, data) {
  const apiKey = process.env.BREVO_SMTP_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL || 'notifications@abstraktmg.com';
  const toEmail = process.env.BREVO_TO_EMAIL || 'team@abstraktmg.com';

  const emailContent = buildEmailContent(type, data);
  
  const brevoPayload = {
    sender: { email: fromEmail, name: 'AMG AI Audit' },
    to: [{ email: toEmail }],
    subject: emailContent.subject,
    htmlContent: emailContent.html,
    textContent: emailContent.text,
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(brevoPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo SMTP failed: ${response.status} - ${error}`);
  }

  const result = await response.json();
  return { messageId: result.messageId };
}

function buildEmailContent(type, data) {
  const baseHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0;">Abstrakt Marketing Group</h1>
        <p style="color: #666; margin: 5px 0;">AI Search Audit Notification</p>
      </div>
      {{CONTENT}}
    </div>
  `;

  switch (type) {
    case 'audit_completed':
      const html = baseHtml.replace('{{CONTENT}}', `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #e85d04; margin: 0 0 15px 0;">🎯 New AI Audit Completed</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0; font-weight: bold;">Company:</td><td>${data.company}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Website:</td><td>${data.website}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Contact:</td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td>${data.email}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">AI Score:</td><td><strong>${data.score}/100</strong></td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Urgency:</td><td>${data.urgency}</td></tr>
          </table>
        </div>
        <p style="text-align: center;">
          <a href="${data.resultsUrl}" style="background: #e85d04; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Full Results
          </a>
        </p>
      `);
      
      return {
        subject: `New AI Audit: ${data.company} (Score: ${data.score}/100)`,
        html,
        text: `New AI Audit Completed\n\nCompany: ${data.company}\nScore: ${data.score}/100\nContact: ${data.firstName} ${data.lastName} (${data.email})\nResults: ${data.resultsUrl}`
      };

    case 'form_submission':
      const formHtml = baseHtml.replace('{{CONTENT}}', `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e85d04; margin: 0 0 15px 0;">📝 New Lead Captured</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0; font-weight: bold;">Company:</td><td>${data.company}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Contact:</td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Email:</td><td>${data.email}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Phone:</td><td>${data.phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Industry:</td><td>${data.industry}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Goal:</td><td>${data.goal}</td></tr>
            <tr><td style="padding: 5px 0; font-weight: bold;">Budget:</td><td>${data.budgetRange}</td></tr>
          </table>
        </div>
      `);
      
      return {
        subject: `New Lead: ${data.company} - ${data.firstName} ${data.lastName}`,
        html: formHtml,
        text: `New Lead Captured\n\nCompany: ${data.company}\nContact: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}`
      };

    default:
      return {
        subject: 'AMG Notification',
        html: baseHtml.replace('{{CONTENT}}', `<pre>${JSON.stringify(data, null, 2)}</pre>`),
        text: JSON.stringify(data, null, 2)
      };
  }
}

function getNotificationSummary(type, data) {
  switch (type) {
    case 'audit_completed': return `AI Audit completed for ${data.company}`;
    case 'form_submission': return `New lead from ${data.company}`;
    default: return 'AMG Notification';
  }
}
