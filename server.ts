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

// 6. Admin Authentication & Password Reset Endpoints
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
