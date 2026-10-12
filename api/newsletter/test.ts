export type EmailTemplateId = 
  | 'institutional_navy' 
  | 'obsidian_gold' 
  | 'editorial_light' 
  | 'cyber_quant' 
  | 'royal_gradient';

function generateNewsletterHtml(params: {
  templateId?: EmailTemplateId;
  headline: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  replyAddress?: string;
  isTestPreview?: boolean;
}): string {
  const {
    templateId = 'institutional_navy',
    headline,
    message,
    ctaText,
    ctaUrl,
    replyAddress = 'ushforex@gmail.com',
    isTestPreview = false,
  } = params;

  const safeMessage = (message || 'Market briefing and structural analysis from USH Community of Traders.')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const previewBanner = isTestPreview ? `
    <div style="background-color:#1e3a5f;border-left:4px solid #38bdf8;padding:11px 16px;border-radius:8px;margin-bottom:24px;font-size:12px;color:#93c5fd;font-weight:700;letter-spacing:0.3px;">
      ✉️ USH CMS PREVIEW TEST • Verify links and presentation prior to audience dispatch
    </div>
  ` : '';

  // 1. INSTITUTIONAL NAVY (Default)
  if (templateId === 'institutional_navy') {
    const paragraphsHtml = safeMessage
      .map((para) => `<p style="margin:0 0 18px;color:#cbd5e1;font-size:14.5px;line-height:1.75;letter-spacing:-0.1px;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const ctaButtonHtml = ctaText && ctaUrl ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px auto 16px;">
        <tr>
          <td align="center" style="border-radius:10px;background:linear-gradient(135deg, #0053CF 0%, #0070F3 100%);box-shadow:0 8px 24px rgba(0,83,207,0.35);">
            <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 34px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:0.3px;border-radius:10px;">
              ${ctaText} →
            </a>
          </td>
        </tr>
      </table>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline || 'USH Community Market Analysis'}</title>
</head>
<body style="margin:0;padding:0;background-color:#080d1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#080d1a;padding:40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#111a2e;border-radius:20px;overflow:hidden;border:1px solid #1e293b;box-shadow:0 25px 60px rgba(0,0,0,0.6);">
          <tr>
            <td style="background:linear-gradient(135deg, #050b14 0%, #003a94 50%, #0053CF 100%);padding:36px 32px;text-align:center;border-bottom:1px solid #1e3a5f;">
              <div style="display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.1);border-radius:20px;margin-bottom:12px;">
                <span style="color:#93c5fd;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">● Institutional Intelligence</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">USH Community of Traders</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:12.5px;font-weight:600;">Systematic Global Forex & Market Analysis</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              ${previewBanner}
              <h2 style="margin:0 0 20px;color:#ffffff;font-size:21px;font-weight:800;letter-spacing:-0.4px;line-height:1.35;">${headline}</h2>
              <div style="width:40px;height:3px;background:#0053CF;border-radius:2px;margin-bottom:22px;"></div>
              ${paragraphsHtml}
              ${ctaButtonHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#0a0f1d;padding:24px 32px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;font-weight:700;">
                USH Community of Traders • Global Forex & Market Analysis
              </p>
              <p style="margin:0 0 10px;color:#64748b;font-size:11px;line-height:1.5;">
                You received this preview test from the administration panel.
              </p>
              <p style="margin:0;color:#94a3b8;font-size:11.5px;">
                Reply-To address configured: <a href="mailto:${replyAddress}" style="color:#38bdf8;text-decoration:underline;">${replyAddress}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 2. OBSIDIAN GOLD VIP ALPHA
  if (templateId === 'obsidian_gold') {
    const paragraphsHtml = safeMessage
      .map((para) => `<p style="margin:0 0 18px;color:#e2e8f0;font-size:14.5px;line-height:1.75;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const ctaButtonHtml = ctaText && ctaUrl ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:34px auto 16px;">
        <tr>
          <td align="center" style="border-radius:10px;background:linear-gradient(135deg, #D4AF37 0%, #AA771C 100%);box-shadow:0 8px 24px rgba(212,175,55,0.3);">
            <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:#0b0b0f;text-decoration:none;font-size:14px;font-weight:900;letter-spacing:0.5px;text-transform:uppercase;border-radius:10px;">
              ${ctaText} ★
            </a>
          </td>
        </tr>
      </table>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headline || 'USH VIP Intelligence'}</title>
</head>
<body style="margin:0;padding:0;background-color:#07070a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#07070a;padding:40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#111116;border-radius:20px;overflow:hidden;border:1px solid #2d2616;box-shadow:0 25px 60px rgba(0,0,0,0.8);">
          <tr>
            <td style="background:linear-gradient(135deg, #0b0b0f 0%, #1e1808 60%, #3a2e0a 100%);padding:38px 32px;text-align:center;border-bottom:1px solid #4a3910;">
              <div style="display:inline-block;padding:5px 14px;background:rgba(212,175,55,0.12);border:1px solid #84681e;border-radius:20px;margin-bottom:12px;">
                <span style="color:#F3E5AB;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">★ VIP Private Community Brief ★</span>
              </div>
              <h1 style="margin:0;color:#F3E5AB;font-size:24px;font-weight:900;letter-spacing:0.5px;">USH TRADING COMMUNITY</h1>
              <p style="margin:6px 0 0;color:#caba8e;font-size:12.5px;font-weight:600;">High-Probability Market Frameworks & Analysis</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              ${previewBanner}
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:21px;font-weight:800;line-height:1.35;">${headline}</h2>
              <div style="width:48px;height:3px;background:linear-gradient(90deg,#D4AF37,#AA771C);border-radius:2px;margin-bottom:24px;"></div>
              ${paragraphsHtml}
              ${ctaButtonHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#09090d;padding:24px 32px;text-align:center;border-top:1px solid #241d0e;">
              <p style="margin:0 0 6px;color:#caba8e;font-size:12px;font-weight:700;">
                USH Community of Traders • Elite Forex & Financial Markets
              </p>
              <p style="margin:0;color:#85795d;font-size:11.5px;">
                Reply-To address configured: <a href="mailto:${replyAddress}" style="color:#D4AF37;text-decoration:underline;">${replyAddress}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 3. EDITORIAL MINIMALIST LIGHT
  if (templateId === 'editorial_light') {
    const paragraphsHtml = safeMessage
      .map((para) => `<p style="margin:0 0 18px;color:#334155;font-size:15px;line-height:1.75;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const ctaButtonHtml = ctaText && ctaUrl ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px auto 16px;">
        <tr>
          <td align="center" style="border-radius:8px;background-color:#0f172a;">
            <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 34px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;">
              ${ctaText} →
            </a>
          </td>
        </tr>
      </table>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headline || 'Market Briefing'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 35px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:36px 36px 24px;border-bottom:1px solid #f1f5f9;">
              <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Market Briefing & Analysis</p>
              <h1 style="margin:0;color:#0f172a;font-size:23px;font-weight:900;letter-spacing:-0.5px;">USH Community of Traders</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px;">
              ${previewBanner}
              <h2 style="margin:0 0 20px;color:#0f172a;font-size:20px;font-weight:800;line-height:1.4;">${headline}</h2>
              ${paragraphsHtml}
              ${ctaButtonHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:24px 36px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;">
                USH Community of Traders • Official Newsletter
              </p>
              <p style="margin:0;color:#94a3b8;font-size:11.5px;">
                Reply-To address configured: <a href="mailto:${replyAddress}" style="color:#0f172a;text-decoration:underline;">${replyAddress}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 4. CYBER QUANT MATRIX
  if (templateId === 'cyber_quant') {
    const paragraphsHtml = safeMessage
      .map((para) => `<p style="margin:0 0 18px;color:#cbd5e1;font-size:14.5px;line-height:1.75;font-family:-apple-system,BlinkMacSystemFont,monospace;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const ctaButtonHtml = ctaText && ctaUrl ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px auto 16px;">
        <tr>
          <td align="center" style="border-radius:8px;background-color:#10B981;box-shadow:0 0 20px rgba(16,185,129,0.35);">
            <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:#064e3b;text-decoration:none;font-size:13.5px;font-weight:900;letter-spacing:1px;text-transform:uppercase;border-radius:8px;font-family:monospace;">
              EXECUTE: ${ctaText} ⚡
            </a>
          </td>
        </tr>
      </table>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headline || 'Quant Intelligence'}</title>
</head>
<body style="margin:0;padding:0;background-color:#050914;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050914;padding:40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#0b1224;border-radius:18px;overflow:hidden;border:1px solid #10b98133;box-shadow:0 20px 60px rgba(0,0,0,0.8);">
          <tr>
            <td style="background-color:#060d1f;padding:32px 30px;border-bottom:1px solid #10b98144;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:4px 10px;background:#064e3b;color:#34d399;font-size:10.5px;font-weight:800;border-radius:6px;font-family:monospace;letter-spacing:1px;">
                      ● LIVE MATRIX SIGNAL
                    </span>
                    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">USH TRADING INTELLIGENCE</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:34px 30px;">
              ${previewBanner}
              <div style="background:#061a1f;border-left:3px solid #10B981;padding:8px 12px;margin-bottom:18px;color:#34d399;font-family:monospace;font-size:11.5px;">
                BRIEFING // ${new Date().toLocaleDateString()} // STATUS: ACTIVE
              </div>
              <h2 style="margin:0 0 20px;color:#ffffff;font-size:20px;font-weight:800;line-height:1.4;">${headline}</h2>
              ${paragraphsHtml}
              ${ctaButtonHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#050a18;padding:22px 30px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11.5px;font-family:monospace;">
                USH Community of Traders • Systematic Precision
              </p>
              <p style="margin:0;color:#64748b;font-size:11px;">
                Reply-To address configured: <a href="mailto:${replyAddress}" style="color:#10B981;text-decoration:none;">${replyAddress}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // 5. ROYAL GRADIENT HIGH-IMPACT
  const paragraphsHtml = safeMessage
    .map((para) => `<p style="margin:0 0 18px;color:#cbd5e1;font-size:14.5px;line-height:1.75;">${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const ctaButtonHtml = ctaText && ctaUrl ? `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:34px auto 16px;">
      <tr>
        <td align="center" style="border-radius:12px;background:linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);box-shadow:0 8px 24px rgba(99,102,241,0.4);">
          <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:15px 36px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:0.3px;border-radius:12px;">
            ${ctaText} 🚀
          </a>
        </td>
      </tr>
    </table>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headline || 'USH Community Update'}</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0a1d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0c0a1d;padding:40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#161233;border-radius:24px;overflow:hidden;border:1px solid #312e81;box-shadow:0 25px 60px rgba(0,0,0,0.7);">
          <tr>
            <td style="background:linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">USH Community of Traders</h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;font-weight:600;">Official Community & Market Newsletter</p>
            </td>
          </tr>
          <tr>
            <td style="padding:38px 32px;">
              ${previewBanner}
              <h2 style="margin:0 0 20px;color:#ffffff;font-size:21px;font-weight:800;line-height:1.35;">${headline}</h2>
              <div style="width:40px;height:4px;background:#6366f1;border-radius:2px;margin-bottom:24px;"></div>
              ${paragraphsHtml}
              ${ctaButtonHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#0d0a22;padding:26px 32px;text-align:center;border-top:1px solid #282054;">
              <p style="margin:0 0 6px;color:#c7d2fe;font-size:12px;font-weight:700;">
                USH Community of Traders • Global Forex & Market Analysis
              </p>
              <p style="margin:0;color:#818cf8;font-size:11.5px;">
                Reply-To address configured: <a href="mailto:${replyAddress}" style="color:#c7d2fe;text-decoration:underline;">${replyAddress}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  try {
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

    const fromAddress = (senderEmail || process.env.RESEND_FROM_EMAIL || 'USH Community <updates@ushcommunity.com>').trim();
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
      error: err?.message || 'Server error while processing newsletter test dispatch.',
    });
  }
}
