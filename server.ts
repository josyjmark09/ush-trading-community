import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lahyyqzhrnndcdxzcnmn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.suba_base_anon_key || process.env.SUPABASE_KEY || '';

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

// 3. Reviews: GET approved reviews & POST new review
app.get('/api/reviews', async (_req, res) => {
  const client = getSupabase();
  if (!client) {
    return res.status(200).json({ success: true, reviews: [] });
  }

  try {
    const { data, error } = await client
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const formatted = (data || []).map((r) => ({
      id: r.id,
      name: r.name,
      country: r.country,
      countryCode: r.country_code || 'US',
      rating: r.rating,
      content: r.content,
      status: r.is_approved ? 'approved' : 'pending',
      submittedAt: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    res.json({ success: true, reviews: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const client = getSupabase();
  const { name, country, countryCode, rating, content, isApproved } = req.body;

  if (!name || !content || !rating) {
    return res.status(400).json({ success: false, error: 'Name, rating, and content are required' });
  }

  if (!client) {
    return res.json({ success: true, savedLocally: true });
  }

  try {
    const { data, error } = await client
      .from('reviews')
      .insert([
        {
          name: String(name).trim(),
          country: String(country || 'United States').trim(),
          country_code: String(countryCode || 'US').toUpperCase(),
          rating: Math.min(5, Math.max(1, Number(rating))),
          content: String(content).trim(),
          is_approved: Boolean(isApproved),
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Contact / Support Messages: POST new message
app.post('/api/messages', async (req, res) => {
  const client = getSupabase();
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  if (!client) {
    return res.json({ success: true, savedLocally: true });
  }

  try {
    const { data, error } = await client
      .from('messages')
      .insert([
        {
          name: String(name).trim(),
          email: String(email).trim(),
          subject: String(subject || 'General Inquiry').trim(),
          message: String(message).trim(),
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Site Settings: GET and POST
app.get('/api/settings', async (_req, res) => {
  const client = getSupabase();
  if (!client) {
    return res.json({ success: false, error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('data')
      .eq('id', 'current')
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, settings: (data as any)?.data || null });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  const client = getSupabase();
  const { settings } = req.body;

  if (!settings) {
    return res.status(400).json({ success: false, error: 'Settings object is required' });
  }

  if (!client) {
    return res.json({ success: true, savedLocally: true });
  }

  try {
    const { error } = await client
      .from('site_settings')
      .upsert(
        {
          id: 'current',
          data: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
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
