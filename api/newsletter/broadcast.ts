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

  const { subject, headline, message, ctaText, ctaUrl, resendApiKey, senderEmail, recipientEmails } = req.body || {};

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

  const formattedMessage = (message || '')
    .split('\n\n')
    .map((para: string) => `<p style="margin:0 0 16px;color:#cbd5e1;font-size:14px;line-height:1.7;">${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const ctaBlock = ctaText && ctaUrl ? `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px auto 14px;">
      <tr>
        <td align="center" style="border-radius:8px;background-color:#0053CF;">
          <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:13px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;">
            ${ctaText} →
          </a>
        </td>
      </tr>
    </table>
  ` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headline || 'USH Market Broadcast'}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg,#0a192f 0%,#0053CF 100%);padding:32px 28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">USH Community of Traders</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Official Market Updates & Newsletter</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="margin:0 0 18px;color:#ffffff;font-size:19px;font-weight:700;">${headline}</h2>
              ${formattedMessage}
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a;padding:20px 24px;text-align:center;border-top:1px solid #334155;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;font-weight:600;">
                USH Community of Traders • Global Forex & Market Analysis
              </p>
              <p style="margin:0;color:#64748b;font-size:11px;">
                You received this newsletter as a registered community member.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
