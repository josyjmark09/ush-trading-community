import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lahyyqzhrnndcdxzcnmn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.suba_base_anon_key || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaHl5cXpocm5uZGNkeHpjbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTE1NDUsImV4cCI6MjEwNDAyNzU0NX0.qYsGmHgeNV_ymg3gjx8lQRdEJ5jVCjxFDAuficO5pBE';

let supabaseClient: any = null;
function getSupabase(): any {
  if (!supabaseClient && SUPABASE_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseClient;
}

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 2. Supabase connection status check
app.get('/api/supabase/status', async (_req, res) => {
  const client = getSupabase();
  if (!client) {
    return res.json({
      connected: false,
      url: SUPABASE_URL,
      error: 'Supabase key not configured in environment',
    });
  }

  try {
    const { error } = await client.from('reviews').select('id', { count: 'exact', head: true });
    if (error) {
      return res.json({
        connected: false,
        url: SUPABASE_URL,
        error: error.message,
      });
    }
    return res.json({
      connected: true,
      url: SUPABASE_URL,
      tables: ['reviews', 'messages', 'site_settings'],
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      url: SUPABASE_URL,
      error: err.message,
    });
  }
});

// Persistent File Storage Configuration
const STORAGE_DIR = path.join(process.cwd(), 'server_data');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

const REVIEWS_FILE = path.join(STORAGE_DIR, 'reviews.json');
const SETTINGS_FILE = path.join(STORAGE_DIR, 'settings.json');
const MESSAGES_FILE = path.join(STORAGE_DIR, 'messages.json');

const SEED_REVIEWS = [
  {
    id: 'rev-seed-1',
    name: 'David Mwangi',
    country: 'Kenya',
    countryCode: 'KE',
    rating: 5,
    content: 'Joining this community changed how I look at London open sessions. The daily key level breakdowns and invalidation zones are clean and reliable.',
    status: 'approved',
    submittedAt: '2026-08-25',
    orderIndex: 0,
    isPinned: false
  },
  {
    id: 'rev-seed-2',
    name: 'Elena Rostova',
    country: 'United Kingdom',
    countryCode: 'GB',
    rating: 5,
    content: 'No hype, no unrealistic promises. Just systematic risk-to-reward setups and disciplined trade management. The Exness setup was quick and straightforward.',
    status: 'approved',
    submittedAt: '2026-08-28',
    orderIndex: 1,
    isPinned: false
  },
  {
    id: 'rev-seed-3',
    name: 'Carlos Mendez',
    country: 'Spain',
    countryCode: 'ES',
    rating: 5,
    content: 'Top-tier analysis on EUR/USD and Gold. Having clear invalidation levels keeps me from overtrading and revenge trading. Highly recommended community.',
    status: 'approved',
    submittedAt: '2026-09-02',
    orderIndex: 2,
    isPinned: false
  }
];

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile(filePath: string, data: any): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

function getStoredReviews(): any[] {
  return readJsonFile<any[]>(REVIEWS_FILE, SEED_REVIEWS);
}

function saveStoredReviews(reviews: any[]): boolean {
  return writeJsonFile(REVIEWS_FILE, reviews);
}

function getStoredSettings(): any {
  return readJsonFile<any>(SETTINGS_FILE, null);
}

function saveStoredSettings(settings: any): boolean {
  return writeJsonFile(SETTINGS_FILE, settings);
}

function getStoredMessages(): any[] {
  return readJsonFile<any[]>(MESSAGES_FILE, []);
}

function saveStoredMessages(messages: any[]): boolean {
  return writeJsonFile(MESSAGES_FILE, messages);
}

const SUBSCRIBERS_FILE = path.join(STORAGE_DIR, 'subscribers.json');

function getStoredSubscribers(): any[] {
  return readJsonFile<any[]>(SUBSCRIBERS_FILE, []);
}

function saveStoredSubscribers(subscribers: any[]): boolean {
  return writeJsonFile(SUBSCRIBERS_FILE, subscribers);
}

// 3. Reviews: GET reviews
app.get('/api/reviews', async (req, res) => {
  let reviews = getStoredReviews();

  // Try fetching from Supabase to merge any cloud additions
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const existingIds = new Set(reviews.map((r) => r.id));
        let changed = false;
        data.forEach((r) => {
          if (!existingIds.has(r.id)) {
            reviews.push({
              id: r.id,
              name: r.name,
              country: r.country,
              countryCode: r.country_code || 'US',
              rating: r.rating,
              content: r.content,
              avatar: r.avatar || undefined,
              status: r.is_approved ? 'approved' : 'pending',
              submittedAt: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              orderIndex: reviews.length,
              isPinned: false
            });
            changed = true;
          }
        });
        if (changed) {
          saveStoredReviews(reviews);
        }
      }
    } catch (err) {
      console.warn('Supabase review fetch note:', err);
    }
  }

  // Filter if query status is provided (e.g., status=approved)
  const statusFilter = req.query.status as string;
  let result = [...reviews];
  if (statusFilter && statusFilter !== 'all') {
    result = result.filter((r) => r.status === statusFilter);
  }

  // Sort by orderIndex ascending (items with smaller index appear first on page)
  result.sort((a, b) => (a.orderIndex ?? 999999) - (b.orderIndex ?? 999999));

  res.json({ success: true, reviews: result });
});

// POST new review (user submission or admin creation)
app.post('/api/reviews', async (req, res) => {
  const { country, countryCode, rating, isApproved, avatar } = req.body;
  const name = req.body.name || req.body.author || '';
  const content = req.body.content || req.body.comment || req.body.review || req.body.message || '';

  if (!name || !content || !rating) {
    return res.status(400).json({ success: false, error: 'Name, rating, and content are required' });
  }

  // Check moderation setting (defaults to require approval if not set)
  const currentSettings = getStoredSettings();
  let requireApproval = true;
  if (currentSettings?.moderation && typeof currentSettings.moderation.requireReviewApproval === 'boolean') {
    requireApproval = currentSettings.moderation.requireReviewApproval;
  }

  // Determine final status
  let finalStatus: 'approved' | 'pending';
  if (isApproved !== undefined) {
    finalStatus = isApproved ? 'approved' : 'pending';
  } else {
    // If requireApproval is FALSE -> Auto-Approve (status = 'approved')
    // If requireApproval is TRUE -> Moderated (status = 'pending')
    finalStatus = requireApproval ? 'pending' : 'approved';
  }

  const reviews = getStoredReviews();
  // Shift existing order indexes down by 1 so new review is at position 0
  reviews.forEach((r, idx) => {
    r.orderIndex = idx + 1;
  });

  const newReview: any = {
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: String(name).trim(),
    country: String(country || 'United States').trim(),
    countryCode: String(countryCode || 'US').toUpperCase(),
    rating: Math.min(5, Math.max(1, Number(rating))),
    content: String(content).trim(),
    avatar: avatar ? String(avatar) : undefined,
    status: finalStatus,
    submittedAt: new Date().toISOString().split('T')[0],
    orderIndex: 0,
    isPinned: false
  };

  reviews.unshift(newReview);
  saveStoredReviews(reviews);

  // Background sync to Supabase if connected
  const client = getSupabase();
  if (client) {
    const payload: any = {
      id: newReview.id,
      name: newReview.name,
      country: newReview.country,
      country_code: newReview.countryCode,
      rating: newReview.rating,
      content: newReview.content,
      is_approved: newReview.status === 'approved',
    };
    if (avatar) payload.avatar = String(avatar);

    client.from('reviews').insert([payload]).then(({ error }: any) => {
      if (error && (error.message?.includes('avatar') || error.details?.includes('avatar'))) {
        delete payload.avatar;
        client.from('reviews').insert([payload]).catch(() => {});
      }
    }).catch(() => {});
  }

  res.json({
    success: true,
    review: newReview,
    requiresApproval: finalStatus === 'pending',
  });
});

// PUT update review (accept/approve, edit content, change rating, etc.)
app.put('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const reviews = getStoredReviews();
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  const current = reviews[index];
  const updatedReview = {
    ...current,
    ...updates,
    id: current.id, // preserve ID
  };

  if (updates.status) {
    updatedReview.status = updates.status;
  }

  reviews[index] = updatedReview;
  saveStoredReviews(reviews);

  // Background sync to Supabase if connected
  const client = getSupabase();
  if (client) {
    const sbUpdates: any = {};
    if (updates.status !== undefined) sbUpdates.is_approved = updates.status === 'approved';
    if (updates.name !== undefined) sbUpdates.name = updates.name;
    if (updates.country !== undefined) sbUpdates.country = updates.country;
    if (updates.rating !== undefined) sbUpdates.rating = updates.rating;
    if (updates.content !== undefined) sbUpdates.content = updates.content;

    client.from('reviews').update(sbUpdates).eq('id', id).catch(() => {});
  }

  res.json({ success: true, review: updatedReview });
});

// DELETE review
app.delete('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  let reviews = getStoredReviews();
  const initialLen = reviews.length;
  reviews = reviews.filter((r) => r.id !== id);

  if (reviews.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  // Re-index remaining reviews
  reviews.forEach((r, idx) => {
    r.orderIndex = idx;
  });
  saveStoredReviews(reviews);

  // Background sync to Supabase if connected
  const client = getSupabase();
  if (client) {
    client.from('reviews').delete().eq('id', id).catch(() => {});
  }

  res.json({ success: true });
});

// POST push review to top (#1 position shown first on page)
app.post('/api/reviews/:id/top', (req, res) => {
  const { id } = req.params;
  const reviews = getStoredReviews();
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  const [selected] = reviews.splice(index, 1);
  selected.orderIndex = 0;
  reviews.unshift(selected);

  // Re-index all reviews
  reviews.forEach((r, idx) => {
    r.orderIndex = idx;
  });
  saveStoredReviews(reviews);

  res.json({ success: true, reviews });
});

// POST reorder reviews
app.post('/api/reviews/reorder', (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ success: false, error: 'orderedIds must be an array of IDs' });
  }

  const reviews = getStoredReviews();
  const map = new Map(reviews.map((r) => [r.id, r]));
  const reordered: any[] = [];

  orderedIds.forEach((id: string) => {
    const found = map.get(id);
    if (found) {
      reordered.push(found);
      map.delete(id);
    }
  });

  // Append any reviews that were not included in orderedIds
  for (const remaining of map.values()) {
    reordered.push(remaining);
  }

  reordered.forEach((r, idx) => {
    r.orderIndex = idx;
  });

  saveStoredReviews(reordered);
  res.json({ success: true, reviews: reordered });
});

// 4. Contact / Support Messages
app.get('/api/messages', (_req, res) => {
  const messages = getStoredMessages();
  res.json({ success: true, messages });
});

app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: String(name).trim(),
    email: String(email).trim(),
    subject: String(subject || 'General Inquiry').trim(),
    message: String(message).trim(),
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    read: false,
    status: 'new'
  };

  const messages = getStoredMessages();
  messages.unshift(newMsg);
  saveStoredMessages(messages);

  const client = getSupabase();
  if (client) {
    client.from('messages').insert([
      { name: newMsg.name, email: newMsg.email, subject: newMsg.subject, message: newMsg.message }
    ]).catch(() => {});
  }

  res.json({ success: true, data: newMsg });
});

// 5. Site Settings
app.get('/api/settings', async (_req, res) => {
  let settings = getStoredSettings();

  if (!settings) {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('site_settings')
          .select('data')
          .eq('id', 'current')
          .single();
        if (!error && (data as any)?.data) {
          settings = (data as any).data;
          saveStoredSettings(settings);
        }
      } catch (err) {
        console.warn('Supabase settings fetch note:', err);
      }
    }
  }

  res.json({ success: true, settings: settings || null });
});

app.post('/api/settings', async (req, res) => {
  const incoming = req.body?.settings || req.body;

  if (!incoming || typeof incoming !== 'object' || Object.keys(incoming).length === 0) {
    return res.status(400).json({ success: false, error: 'Settings object is required' });
  }

  const existing = getStoredSettings() || {};
  const merged = { ...existing, ...incoming };
  if (incoming.moderation && existing.moderation) {
    merged.moderation = { ...existing.moderation, ...incoming.moderation };
  }

  saveStoredSettings(merged);

  const client = getSupabase();
  if (client) {
    client.from('site_settings').upsert(
      {
        id: 'current',
        data: merged,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    ).catch(() => {});
  }

  res.json({ success: true, settings: merged });
});

// 6. Resend Email Sending Helper & HTML Templates
async function sendResendEmail({
  to,
  subject,
  html,
  apiKey,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  apiKey?: string;
  from?: string;
}): Promise<{ success: boolean; data?: any; error?: string; notConfigured?: boolean }> {
  const currentSettings = getStoredSettings() || {};
  const activeKey = apiKey || process.env.RESEND_API_KEY || currentSettings?.newsletter?.resendApiKey;

  if (!activeKey || !activeKey.trim()) {
    console.warn('Notice: Resend API key is not configured. Email logged to console instead of live dispatch.');
    return { success: false, notConfigured: true, error: 'Resend API key is not yet configured.' };
  }

  const senderEmail = from || process.env.RESEND_FROM_EMAIL || currentSettings?.newsletter?.senderEmail || 'USH Community of Traders <onboarding@resend.dev>';
  const toList = Array.isArray(to) ? to : [to];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: toList,
        subject,
        html,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result?.message || result?.error || 'Failed to dispatch via Resend' };
    }
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error while contacting Resend' };
  }
}

function generateWelcomeEmailHtml({
  email,
  country,
  telegramUrl = 'https://t.me/+wHFuFFkA2i0xZTA8',
  brokerUrl = 'https://one.exnesstrack.net/a/c_iun6m90d5o'
}: {
  email: string;
  country?: string;
  telegramUrl?: string;
  brokerUrl?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to USH Community of Traders</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a192f 0%,#0053CF 100%);padding:36px 28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">USH Community of Traders</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Official Market Updates & Newsletter</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:18px;font-weight:700;">Registration Confirmed</h2>
              <p style="margin:0 0 18px;color:#cbd5e1;font-size:14px;line-height:1.6;">
                Hello Trader,
              </p>
              <p style="margin:0 0 20px;color:#cbd5e1;font-size:14px;line-height:1.6;">
                Thank you for subscribing to the <strong>USH Community of Traders</strong> newsletter. Your registration for <span style="color:#60a5fa;">${email}</span>${country ? ` (${country})` : ''} is now active.
              </p>
              
              <div style="background-color:#0f172a;border-left:4px solid #0053CF;padding:16px 20px;border-radius:8px;margin:24px 0;">
                <p style="margin:0 0 10px;color:#ffffff;font-size:14px;font-weight:700;">What you will receive:</p>
                <ul style="margin:0;padding-left:18px;color:#94a3b8;font-size:13px;line-height:1.7;">
                  <li>Systematic market structure updates and daily key levels</li>
                  <li>High-probability liquidity breakdowns on major FX pairs & Gold</li>
                  <li>Disciplined risk management frameworks</li>
                  <li>Important community announcements and educational releases</li>
                </ul>
              </div>

              <p style="margin:0 0 24px;color:#cbd5e1;font-size:14px;line-height:1.6;">
                To join our active trader discussions and access real-time session updates, connect directly to our official Telegram channel:
              </p>

              <!-- Telegram CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 24px;">
                <tr>
                  <td align="center" style="border-radius:8px;background-color:#0053CF;">
                    <a href="${telegramUrl}" target="_blank" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;">
                      Open Telegram Community →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#64748b;font-size:12px;line-height:1.5;text-align:center;">
                No hype. No unrealistic promises. Pure market structure and risk discipline.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#0f172a;padding:20px 24px;text-align:center;border-top:1px solid #334155;">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;font-weight:600;">
                USH Community of Traders • Global Forex & Market Analysis
              </p>
              <p style="margin:0;color:#64748b;font-size:11px;">
                You received this email because you subscribed on our official website.
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

function generateBroadcastEmailHtml({
  headline,
  message,
  ctaText,
  ctaUrl,
}: {
  headline: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}): string {
  const formattedMessage = message
    .split('\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="margin:0 0 14px;color:#cbd5e1;font-size:14px;line-height:1.65;">${p}</p>`)
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg,#0a192f 0%,#0053CF 100%);padding:32px 28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">USH Community of Traders</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Market Updates & Newsletter</p>
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
}

// 7. Newsletter API Endpoints
app.get('/api/newsletter/subscribers', async (_req, res) => {
  let subscribers = getStoredSubscribers();

  // Try syncing from Supabase if connected
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Map supabase snake_case to camelCase
        const cloudSubs = data.map((d: any) => ({
          id: String(d.id),
          email: d.email,
          country: d.country || 'United States',
          countryCode: d.country_code || 'US',
          source: d.source || 'popup',
          status: d.status || 'active',
          welcomeEmailSent: Boolean(d.welcome_email_sent),
          createdAt: d.created_at || new Date().toISOString(),
          lastEmailSentAt: d.last_email_sent_at || null,
        }));

        // Merge keeping unique emails
        const map = new Map<string, any>();
        cloudSubs.forEach(s => map.set(s.email.toLowerCase(), s));
        subscribers.forEach(s => {
          if (!map.has(s.email.toLowerCase())) {
            map.set(s.email.toLowerCase(), s);
          }
        });
        subscribers = Array.from(map.values());
        saveStoredSubscribers(subscribers);
      }
    } catch (err) {
      console.warn('Supabase subscribers fetch note:', err);
    }
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const newcomers7Days = subscribers.filter(s => {
    const age = now - new Date(s.createdAt).getTime();
    return age <= sevenDaysMs;
  }).length;

  const newcomers30Days = subscribers.filter(s => {
    const age = now - new Date(s.createdAt).getTime();
    return age <= thirtyDaysMs;
  }).length;

  // Build unique countries count map
  const countriesMap: Record<string, { country: string; code: string; count: number }> = {};
  subscribers.forEach(s => {
    const countryName = s.country || 'United States';
    const countryCode = s.countryCode || 'US';
    if (!countriesMap[countryName]) {
      countriesMap[countryName] = { country: countryName, code: countryCode, count: 0 };
    }
    countriesMap[countryName].count += 1;
  });

  const countriesList = Object.values(countriesMap).sort((a, b) => b.count - a.count);

  res.json({
    success: true,
    subscribers,
    total: subscribers.length,
    newcomers7Days,
    newcomers30Days,
    countries: countriesList,
  });
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email, country, countryCode, source } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCountry = (country || 'United States').trim();
  const cleanCountryCode = (countryCode || 'US').trim().toUpperCase();
  const cleanSource = source === 'footer' ? 'footer' : 'popup';

  const subscribers = getStoredSubscribers();
  const existingIndex = subscribers.findIndex(s => s.email.toLowerCase() === cleanEmail);

  if (existingIndex !== -1) {
    return res.json({ 
      success: true, 
      alreadySubscribed: true, 
      message: 'You are already registered for our newsletter.' 
    });
  }

  const newSub = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    country: cleanCountry,
    countryCode: cleanCountryCode,
    source: cleanSource,
    status: 'active',
    welcomeEmailSent: false,
    createdAt: new Date().toISOString(),
  };

  subscribers.unshift(newSub);
  saveStoredSubscribers(subscribers);

  // Sync to Supabase in background
  const client = getSupabase();
  if (client) {
    client.from('subscribers').insert([{
      id: newSub.id,
      email: newSub.email,
      country: newSub.country,
      country_code: newSub.countryCode,
      source: newSub.source,
      status: newSub.status,
      welcome_email_sent: false,
      created_at: newSub.createdAt
    }]).catch((err: any) => {
      console.warn('Supabase subscriber insert note:', err?.message);
    });
  }

  // Send automated Welcome Email via Resend
  let emailDispatched = false;
  try {
    const welcomeHtml = generateWelcomeEmailHtml({
      email: cleanEmail,
      country: cleanCountry,
    });

    const sendResult = await sendResendEmail({
      to: cleanEmail,
      subject: 'Welcome to USH Community of Traders • Market Updates',
      html: welcomeHtml,
    });

    if (sendResult.success) {
      emailDispatched = true;
      newSub.welcomeEmailSent = true;
      saveStoredSubscribers(subscribers);

      if (client) {
        client.from('subscribers').update({ welcome_email_sent: true }).eq('id', newSub.id).catch(() => {});
      }
    }
  } catch (emailErr) {
    console.warn('Welcome email dispatch note:', emailErr);
  }

  res.json({
    success: true,
    message: 'Thank you! You have been successfully registered for updates.',
    emailSent: emailDispatched,
    subscriber: newSub,
  });
});

app.post('/api/newsletter/broadcast', async (req, res) => {
  const { subject, headline, message, ctaText, ctaUrl, filters } = req.body || {};

  if (!subject || !headline || !message) {
    return res.status(400).json({ success: false, error: 'Subject, headline, and message are required.' });
  }

  const subscribers = getStoredSubscribers().filter(s => s.status !== 'unsubscribed');
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // Filter subscribers according to selection
  const filtered = subscribers.filter(s => {
    // Country filter
    if (filters?.country && filters.country !== 'all') {
      if ((s.country || '').toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
    }

    // Timeframe filter
    const createdTime = new Date(s.createdAt).getTime();
    if (filters?.timeframe === 'newcomers_7d') {
      if (now - createdTime > sevenDaysMs) return false;
    } else if (filters?.timeframe === 'newcomers_30d') {
      if (now - createdTime > thirtyDaysMs) return false;
    } else if (filters?.timeframe === 'custom_date' && filters?.startDate) {
      const start = new Date(filters.startDate).getTime();
      const end = filters?.endDate ? new Date(filters.endDate).getTime() : now;
      if (createdTime < start || createdTime > end) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    return res.status(400).json({ success: false, error: 'No subscribers match the selected filter criteria.' });
  }

  const broadcastHtml = generateBroadcastEmailHtml({
    headline,
    message,
    ctaText,
    ctaUrl,
  });

  // Collect emails
  const recipients = filtered.map(s => s.email);

  // Send via Resend
  const sendResult = await sendResendEmail({
    to: recipients,
    subject,
    html: broadcastHtml,
  });

  if (!sendResult.success) {
    return res.status(500).json({ 
      success: false, 
      error: sendResult.error,
      notConfigured: sendResult.notConfigured,
      recipientsCount: recipients.length 
    });
  }

  // Update last email sent timestamp
  const nowIso = new Date().toISOString();
  filtered.forEach(s => { s.lastEmailSentAt = nowIso; });
  saveStoredSubscribers(subscribers);

  res.json({
    success: true,
    message: `Broadcast successfully dispatched to ${recipients.length} subscriber(s).`,
    recipientsCount: recipients.length,
  });
});

app.post('/api/newsletter/test', async (req, res) => {
  const { testEmail, subject, headline, message, ctaText, ctaUrl } = req.body || {};

  if (!testEmail || !testEmail.includes('@')) {
    return res.status(400).json({ success: false, error: 'A valid test email address is required.' });
  }

  const broadcastHtml = generateBroadcastEmailHtml({
    headline: headline || 'Test Broadcast Preview',
    message: message || 'This is a test preview of your newsletter broadcast.',
    ctaText,
    ctaUrl,
  });

  const sendResult = await sendResendEmail({
    to: testEmail.trim(),
    subject: `[TEST] ${subject || 'Newsletter Preview'}`,
    html: broadcastHtml,
  });

  if (!sendResult.success) {
    return res.status(500).json({ 
      success: false, 
      error: sendResult.error, 
      notConfigured: sendResult.notConfigured 
    });
  }

  res.json({
    success: true,
    message: `Test email successfully sent to ${testEmail}. Check your inbox!`,
  });
});

app.delete('/api/newsletter/subscribers/:id', async (req, res) => {
  const { id } = req.params;
  const subscribers = getStoredSubscribers().filter(s => s.id !== id);
  saveStoredSubscribers(subscribers);

  const client = getSupabase();
  if (client) {
    client.from('subscribers').delete().eq('id', id).catch(() => {});
  }

  res.json({ success: true, message: 'Subscriber removed successfully.' });
});

// 8. Admin Authentication & Password Reset Endpoints
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();
  
  if (cleanEmail !== 'ushforex@gmail.com') {
    return res.status(403).json({ 
      success: false, 
      error: 'Access denied: Only registered admin email (ushforex@gmail.com) is permitted.' 
    });
  }
  
  if (password !== 'BullsMark500$$') {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid administrative password.' 
    });
  }
  
  res.json({ 
    success: true, 
    email: 'ushforex@gmail.com',
    role: 'administrator'
  });
});

app.post('/api/admin/reset-password', async (req, res) => {
  const { email } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();
  
  if (cleanEmail !== 'ushforex@gmail.com') {
    return res.status(403).json({ 
      success: false, 
      error: 'Access denied: Only registered admin email (ushforex@gmail.com) is authorized for password recovery.' 
    });
  }
  
  const client = getSupabase();
  if (client && client.auth) {
    try {
      await client.auth.resetPasswordForEmail('ushforex@gmail.com');
    } catch (err: any) {
      console.warn('Supabase password reset note:', err.message);
    }
  }
  
  res.json({ 
    success: true, 
    message: 'Verification dispatched to ushforex@gmail.com' 
  });
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Supabase URL: ${SUPABASE_URL}`);
    console.log(`Supabase Key configured: ${!!SUPABASE_KEY}`);
  });
}

startServer();
