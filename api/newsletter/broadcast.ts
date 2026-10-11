import { generateNewsletterHtml, EmailTemplateId } from './templates';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lahyyqzhrnndcdxzcnmn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.suba_base_anon_key || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaHl5cXpocm5uZGNkeHpjbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTE1NDUsImV4cCI6MjEwNDAyNzU0NX0.qYsGmHgeNV_ymg3gjx8lQRdEJ5jVCjxFDAuficO5pBE';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { subject, headline, message, ctaText, ctaUrl, resendApiKey, senderEmail, replyToEmail, templateId, recipientEmails } = req.body || {};

  const activeKey = (resendApiKey || process.env.RESEND_API_KEY || '').trim();
  if (!activeKey) {
    return res.status(200).json({
      success: false,
      notConfigured: true,
      error: 'Resend API key is not configured. Please paste your Resend key in Email Delivery Settings.',
    });
  }

  // Get recipient list: either passed directly or fetch from Supabase
  let recipients: string[] = Array.isArray(recipientEmails) ? recipientEmails : [];

  if (recipients.length === 0 && SUPABASE_URL && SUPABASE_KEY) {
    try {
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await sb.from('subscribers').select('email').eq('status', 'active');
      if (data && Array.isArray(data)) {
        recipients = data.map((d: any) => d.email).filter(Boolean);
      }
    } catch (err) {
      console.warn('Supabase subscribers query error:', err);
    }
  }

  if (recipients.length === 0) {
    return res.status(200).json({
      success: false,
      error: 'No active subscribers found to broadcast to.',
    });
  }

  const fromAddress = (senderEmail || process.env.RESEND_FROM_EMAIL || 'USH Community of Traders <onboarding@resend.dev>').trim();
  const replyAddress = (replyToEmail || process.env.RESEND_REPLY_TO || 'ushforex@gmail.com').trim();

  const html = generateNewsletterHtml({
    templateId: (templateId || 'institutional_navy') as EmailTemplateId,
    headline,
    message,
    ctaText,
    ctaUrl,
    replyAddress,
    isTestPreview: false,
  });

  try {
    // Send in batches of 50 to respect Resend limits
    const batchSize = 50;
    let sentCount = 0;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const slice = recipients.slice(i, i + batchSize);
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: slice,
          reply_to: replyAddress,
          subject,
          html,
        }),
      });

      const data = await resendRes.json();
      if (!resendRes.ok) {
        let errorMsg = data?.message || data?.error || 'Resend rejected broadcast.';
        if (typeof errorMsg === 'string' && (errorMsg.toLowerCase().includes('domain') || errorMsg.toLowerCase().includes('verify'))) {
          errorMsg += ' (Note: To send to public audiences, Resend requires a verified domain like ushcommunity.com. Public domains like @gmail.com are not permitted as sender).';
        }
        return res.status(200).json({
          success: false,
          error: errorMsg,
        });
      }
      sentCount += slice.length;
    }

    return res.status(200).json({
      success: true,
      message: `Broadcast successfully dispatched to ${sentCount} recipient(s)!`,
      recipientsCount: sentCount,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      error: err?.message || 'Network error while contacting Resend email service.',
    });
  }
}
