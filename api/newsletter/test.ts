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

  const { testEmail, subject, headline, message, ctaText, ctaUrl, resendApiKey, senderEmail } = req.body || {};

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

  // HTML Email Template
  const formattedMessage = (message || 'This is a test preview from USH Community CMS.')
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
  <title>${headline || 'Test Broadcast'}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg,#0a192f 0%,#0053CF 100%);padding:32px 28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">USH Community of Traders</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Official Market Updates & Newsletter [PREVIEW]</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <div style="background-color:#1e3a5f;border-left:4px solid #38bdf8;padding:10px 14px;border-radius:6px;margin-bottom:20px;font-size:12px;color:#93c5fd;font-weight:600;">
                ✉️ This is a preview test email dispatched from USH CMS
              </div>
              <h2 style="margin:0 0 18px;color:#ffffff;font-size:19px;font-weight:700;">${headline || 'Weekly Market Analysis'}</h2>
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
                You received this test email because it was requested in the USH Admin Console.
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
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [testEmail.trim()],
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
