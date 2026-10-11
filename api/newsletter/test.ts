import { generateNewsletterHtml, EmailTemplateId } from './templates';

export default async function handler(req: any, res: any) {
  // CORS Headers
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

  const { testEmail, subject, headline, message, ctaText, ctaUrl, resendApiKey, senderEmail, replyToEmail, templateId } = req.body || {};

  if (!testEmail || typeof testEmail !== 'string' || !testEmail.includes('@')) {
    return res.status(200).json({ success: false, error: 'A valid test email address is required.' });
  }

  const activeKey = (resendApiKey || process.env.RESEND_API_KEY || '').trim();

  if (!activeKey) {
    return res.status(200).json({
      success: false,
      notConfigured: true,
      error: 'Resend API key is not configured. Please paste your Resend key in Email Delivery Settings below.',
    });
  }

  const fromAddress = (senderEmail || process.env.RESEND_FROM_EMAIL || 'USH Community of Traders <onboarding@resend.dev>').trim();
  const replyAddress = (replyToEmail || process.env.RESEND_REPLY_TO || 'ushforex@gmail.com').trim();

  const html = generateNewsletterHtml({
    templateId: (templateId || 'institutional_navy') as EmailTemplateId,
    headline: headline || 'Systematic Market Updates',
    message: message || 'This is a preview broadcast test from the USH Trading Community administration panel.',
    ctaText,
    ctaUrl,
    replyAddress,
    isTestPreview: true,
  });

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [testEmail.trim()],
        reply_to: replyAddress,
        subject: `[TEST] ${subject || 'Market Overview & Structure Analysis'}`,
        html,
      }),
    });

    const data = await resendRes.json();
    if (!resendRes.ok) {
      let errorMsg = data?.message || data?.error || 'Resend rejected dispatch. Check your API key and verified domain.';
      if (typeof errorMsg === 'string' && (errorMsg.toLowerCase().includes('domain') || errorMsg.toLowerCase().includes('verify') || errorMsg.toLowerCase().includes('testing'))) {
        errorMsg += ' (Tip: Resend requires a verified domain or "USH Community <onboarding@resend.dev>". Also, onboarding@resend.dev can only deliver test emails to the email address registered on your Resend account).';
      }
      return res.status(200).json({
        success: false,
        error: errorMsg,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test email successfully dispatched to ${testEmail}! Check your inbox.`,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      error: err?.message || 'Network error while contacting Resend email service.',
    });
  }
}
