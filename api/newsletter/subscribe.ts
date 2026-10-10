import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lahyyqzhrnndcdxzcnmn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.suba_base_anon_key || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaHl5cXpocm5uZGNkeHpjbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTE1NDUsImV4cCI6MjEwNDAyNzU0NX0.qYsGmHgeNV_ymg3gjx8lQRdEJ5jVCjxFDAuficO5pBE';

export default async function handler(req: any, res: any) {
  // Enable CORS
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

  const { email, country, countryCode, source } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCountry = (country || 'Nigeria').trim();
  const cleanCountryCode = (countryCode || 'NG').trim().toUpperCase();
  const cleanSource = source === 'footer' ? 'footer' : 'popup';

  const newSubId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Sync to Supabase Cloud
  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      await client.from('subscribers').insert([{
        id: newSubId,
        email: cleanEmail,
        country: cleanCountry,
        country_code: cleanCountryCode,
        source: cleanSource,
        status: 'active',
        welcome_email_sent: false,
        created_at: new Date().toISOString()
      }]);
    }
  } catch (err: any) {
    console.warn('Vercel API Supabase note:', err?.message);
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you! You have been successfully registered for updates.',
  });
}
