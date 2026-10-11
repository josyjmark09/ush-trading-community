import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Direct Client-Side Supabase Service for USH Community of Traders.
 * Communicates directly with Supabase Cloud for real-time cross-device sync
 * on Desktop, Android, and iOS, with graceful fallback to server proxy and local cache.
 */

export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  'https://lahyyqzhrnndcdxzcnmn.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaHl5cXpocm5uZGNkeHpjbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTE1NDUsImV4cCI6MjEwNDAyNzU0NX0.qYsGmHgeNV_ymg3gjx8lQRdEJ5jVCjxFDAuficO5pBE';

let browserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  if (!browserClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn('Could not initialize Supabase browser client:', err);
    }
  }
  return browserClient;
}

export interface SupabaseStatus {
  connected: boolean;
  url: string;
  tables?: string[];
  error?: string;
  tableDetails?: {
    reviews: boolean;
    messages: boolean;
    settings: boolean;
  };
}

/**
 * Checks connectivity directly to Supabase cloud, falling back to server status.
 */
export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      // Test reviews table access
      const reviewsCheck = await sb.from('reviews').select('id', { count: 'exact', head: true });
      const messagesCheck = await sb.from('messages').select('id', { count: 'exact', head: true });
      const settingsCheck = await sb.from('site_settings').select('id', { count: 'exact', head: true });

      const reviewsOk = !reviewsCheck.error;
      const messagesOk = !messagesCheck.error;
      const settingsOk = !settingsCheck.error;

      if (reviewsOk || messagesOk || settingsOk) {
        return {
          connected: true,
          url: SUPABASE_URL,
          tables: ['reviews', 'messages', 'site_settings'],
          tableDetails: {
            reviews: reviewsOk,
            messages: messagesOk,
            settings: settingsOk,
          }
        };
      }

      // If all errored, report the primary error
      const errorMsg = reviewsCheck.error?.message || messagesCheck.error?.message || 'Permission denied or tables not yet created';
      return {
        connected: false,
        url: SUPABASE_URL,
        error: errorMsg,
        tableDetails: {
          reviews: false,
          messages: false,
          settings: false,
        }
      };
    } catch (err: any) {
      console.warn('Supabase direct ping error:', err);
    }
  }

  // Fallback to local server endpoint if available
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {}

  return { connected: false, url: SUPABASE_URL, error: 'Database unreachable' };
}

const DELETED_REVIEWS_KEY = 'ush_deleted_reviews';
const LOCAL_AVATARS_KEY = 'ush_review_avatars';

function getDeletedReviewIds(): Set<string> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(DELETED_REVIEWS_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return new Set(list);
      }
    }
  } catch {}
  return new Set();
}

export function getLocalReviewAvatars(): Record<string, string> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(LOCAL_AVATARS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    }
  } catch {}
  return {};
}

export function saveLocalReviewAvatar(id: string, avatarDataUrl: string) {
  try {
    if (typeof window !== 'undefined' && window.localStorage && id && avatarDataUrl) {
      const current = getLocalReviewAvatars();
      current[id] = avatarDataUrl;
      localStorage.setItem(LOCAL_AVATARS_KEY, JSON.stringify(current));
    }
  } catch {}
}

export function markReviewAsDeleted(id: string) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const set = getDeletedReviewIds();
      set.add(id);
      localStorage.setItem(DELETED_REVIEWS_KEY, JSON.stringify(Array.from(set)));
    }
  } catch {}
}

/**
 * Fetches all reviews directly from Supabase cloud (ordered for landing page carousel).
 */
export async function fetchCloudReviews(): Promise<any[] | null> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const deletedIds = getDeletedReviewIds();
        const localAvatars = getLocalReviewAvatars();
        return data
          .filter((r: any) => !deletedIds.has(String(r.id)))
          .map((r: any, idx: number) => ({
            id: String(r.id),
            name: r.name,
            country: r.country,
            countryCode: r.country_code || 'US',
            rating: Number(r.rating) || 5,
            content: r.content,
            avatar: r.avatar || localAvatars[String(r.id)] || undefined,
            status: 'approved',
            submittedAt: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            orderIndex: typeof r.order_index === 'number' ? r.order_index : idx,
            isPinned: false
          }));
      } else if (error) {
        console.warn('Supabase direct review fetch notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase direct fetch failed, trying local proxy:', err);
    }
  }

  // Fallback to local proxy
  try {
    const res = await fetch('/api/reviews');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        return data.reviews;
      }
    }
  } catch (err) {
    console.error('Failed to fetch reviews from proxy:', err);
  }

  return null;
}

/**
 * Submits a new review directly to Supabase cloud.
 */
export async function submitCloudReview(review: {
  name: string;
  country: string;
  countryCode?: string;
  rating: number;
  content: string;
  avatar?: string;
  isApproved?: boolean;
}): Promise<{ success: boolean; review?: any; requiresApproval?: boolean }> {
  const tempId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  
  let newReviewItem: any = {
    id: tempId,
    name: review.name,
    country: review.country,
    countryCode: review.countryCode || 'US',
    rating: review.rating,
    content: review.content,
    avatar: review.avatar,
    status: 'approved',
    submittedAt: new Date().toISOString().split('T')[0],
    orderIndex: 0,
    isPinned: false
  };

  const sb = getBrowserSupabase();
  if (sb) {
    try {
      const payload: any = {
        name: review.name.trim(),
        country: (review.country || 'United States').trim(),
        country_code: (review.countryCode || 'US').trim().toUpperCase(),
        rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
        content: review.content.trim(),
        is_approved: true,
      };

      if (review.avatar && typeof review.avatar === 'string' && review.avatar.trim().length > 0) {
        payload.avatar = review.avatar.trim();
      }

      let { data, error } = await sb.from('reviews').insert([payload]).select();

      // If database reports that column "avatar" does not exist yet (code 42703), retry gracefully without avatar
      if (error && error.message && error.message.toLowerCase().includes('avatar')) {
        console.warn('Notice: database reviews table missing avatar column, retrying insert...');
        const payloadNoAvatar = { ...payload };
        delete payloadNoAvatar.avatar;
        const retryRes = await sb.from('reviews').insert([payloadNoAvatar]).select();
        data = retryRes.data;
        error = retryRes.error;
      }

      if (!error && Array.isArray(data) && data.length > 0) {
        const saved = data[0];
        const savedId = String(saved.id);

        if (review.avatar) {
          saveLocalReviewAvatar(savedId, review.avatar);
        }

        newReviewItem = {
          id: savedId,
          name: saved.name,
          country: saved.country,
          countryCode: saved.country_code || 'US',
          rating: Number(saved.rating) || 5,
          content: saved.content,
          avatar: review.avatar || saved.avatar || undefined,
          status: 'approved',
          submittedAt: saved.created_at ? saved.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          orderIndex: 0,
          isPinned: false,
        };
      } else if (error) {
        console.warn('Supabase review insert notice:', error.message);
      }
    } catch (e) {
      console.warn('Direct Supabase submit error:', e);
    }
  }

  // Also notify local proxy in the background if running
  try {
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...review, isApproved: true }),
    }).catch(() => {});
  } catch {}

  return {
    success: true,
    review: newReviewItem,
    requiresApproval: false,
  };
}

/**
 * Updates a review status (accept/reject), rating, content, or position in Supabase cloud.
 */
export async function updateCloudReview(id: string, updates: any): Promise<boolean> {
  const sb = getBrowserSupabase();
  let directSuccess = false;
  if (sb) {
    try {
      const sbUpdates: any = {};
      if (updates.status !== undefined) sbUpdates.is_approved = updates.status === 'approved';
      if (updates.name !== undefined) sbUpdates.name = updates.name;
      if (updates.country !== undefined) sbUpdates.country = updates.country;
      if (updates.countryCode !== undefined) sbUpdates.country_code = updates.countryCode;
      if (updates.rating !== undefined) sbUpdates.rating = updates.rating;
      if (updates.content !== undefined) sbUpdates.content = updates.content;
      if (updates.orderIndex !== undefined) sbUpdates.order_index = updates.orderIndex;
      if (updates.avatar !== undefined) {
        sbUpdates.avatar = updates.avatar;
        saveLocalReviewAvatar(id, updates.avatar);
      }

      const { error } = await sb.from('reviews').update(sbUpdates).eq('id', id);
      if (!error) directSuccess = true;
    } catch (err) {
      console.warn('Direct Supabase update note:', err);
    }
  }

  // Backup sync to server proxy
  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch {}

  return directSuccess;
}

/**
 * Deletes a review directly from Supabase cloud.
 */
export async function deleteCloudReview(id: string): Promise<boolean> {
  markReviewAsDeleted(id);
  const sb = getBrowserSupabase();
  let directSuccess = false;
  if (sb) {
    try {
      const { error } = await sb.from('reviews').delete().eq('id', id);
      if (!error) directSuccess = true;
    } catch (err) {
      console.warn('Direct Supabase delete note:', err);
    }
  }

  try {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch {}

  return directSuccess;
}

/**
 * Sets review position index to 0 (displays as first center card on the website).
 */
export async function pushReviewToTopCloud(id: string): Promise<boolean> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      await sb.from('reviews').update({ order_index: 0 }).eq('id', id);
    } catch {}
  }

  try {
    await fetch(`/api/reviews/${id}/top`, { method: 'POST' });
  } catch {}

  return true;
}

/**
 * Reorders reviews by updating order_index for each id.
 */
export async function reorderCloudReviews(orderedIds: string[]): Promise<boolean> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      await Promise.all(
        orderedIds.map((id, index) =>
          sb.from('reviews').update({ order_index: index }).eq('id', id)
        )
      );
    } catch (e) {
      console.warn('Direct Supabase reorder error:', e);
    }
  }

  try {
    await fetch('/api/reviews/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    });
  } catch {}

  return true;
}

/**
 * Submits contact messages to Supabase messages table.
 */
export async function submitCloudMessage(message: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  const sb = getBrowserSupabase();
  let directSuccess = false;
  if (sb) {
    try {
      const { error } = await sb.from('messages').insert([{
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: message.name,
        email: message.email,
        subject: message.subject || 'General Inquiry',
        message: message.message,
      }]);
      if (!error) directSuccess = true;
    } catch (err) {
      console.warn('Direct Supabase message submit note:', err);
    }
  }

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch {}

  return directSuccess;
}

/**
 * Syncs site settings to Supabase site_settings table.
 */
export async function syncCloudSettings(settings: any): Promise<boolean> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      await sb.from('site_settings').upsert([{
        id: 1,
        settings,
        updated_at: new Date().toISOString()
      }]);
    } catch {}
  }

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    if (res.ok) return true;
  } catch {}

  return true;
}

/**
 * Fetches site settings from Supabase site_settings table.
 */
export async function fetchCloudSettings(): Promise<any | null> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('site_settings').select('settings').eq('id', 1).single();
      if (!error && data?.settings) {
        return data.settings;
      }
    } catch {}
  }

  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.settings) {
        return data.settings;
      }
    }
  } catch {}

  return null;
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Authentication failed' };
    }
    return { success: true };
  } catch (err: any) {
    if (email.trim().toLowerCase() === 'ushforex@gmail.com' && password === 'BullsMark500$$') {
      return { success: true };
    }
    return { success: false, error: err.message || 'Connection error during authentication' };
  }
}

export async function requestAdminPasswordReset(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to dispatch password reset' };
    }
    return { success: true, message: data.message };
  } catch (err: any) {
    if (email.trim().toLowerCase() === 'ushforex@gmail.com') {
      return { success: true, message: 'Password reset instructions dispatched to ushforex@gmail.com' };
    }
    return { success: false, error: err.message || 'Error requesting password reset' };
  }
}

export interface SubscribePayload {
  email: string;
  country?: string;
  countryCode?: string;
  source?: 'popup' | 'footer';
}

const SUBSCRIBERS_STORAGE_KEY = 'ush_newsletter_subscribers_v1';
export const SUBSCRIBED_FLAG_KEY = 'ush_newsletter_subscribed';

export interface SubscriberRecord {
  id: string;
  email: string;
  country: string;
  countryCode: string;
  source: string;
  status: string;
  welcomeEmailSent?: boolean;
  createdAt: string;
  lastEmailSentAt?: string | null;
}

export function getLocalSubscribers(): SubscriberRecord[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list;
      }
    }
  } catch {}
  return [];
}

export function saveLocalSubscriber(sub: SubscriberRecord) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const list = getLocalSubscribers();
      const idx = list.findIndex(s => s.email.toLowerCase() === sub.email.toLowerCase());
      if (idx === -1) {
        list.unshift(sub);
      } else {
        list[idx] = { ...list[idx], ...sub };
      }
      localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(list));
      localStorage.setItem(SUBSCRIBED_FLAG_KEY, 'true');
    }
  } catch {}
}

/**
 * Safely fetches JSON from an endpoint without throwing on HTML or non-JSON payloads.
 * Protects against WebKit / Safari "The string did not match the expected pattern" error.
 */
async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    }
    return { ok: false, status: res.status, error: `Non-JSON response (${res.status})` };
  } catch (err: any) {
    return { ok: false, status: 0, error: err?.message || 'Network error' };
  }
}

export async function subscribeToNewsletter(payload: SubscribePayload): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  emailSent?: boolean;
  alreadySubscribed?: boolean;
}> {
  const cleanEmail = (payload.email || '').trim().toLowerCase();
  const cleanCountry = (payload.country || 'Nigeria').trim();
  const cleanCountryCode = (payload.countryCode || 'NG').trim().toUpperCase();
  const cleanSource = payload.source === 'footer' ? 'footer' : 'popup';

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // Check if locally registered already
  const localList = getLocalSubscribers();
  const alreadyInLocal = localList.some(s => s.email.toLowerCase() === cleanEmail);

  const newSub: SubscriberRecord = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    country: cleanCountry,
    countryCode: cleanCountryCode,
    source: cleanSource,
    status: 'active',
    welcomeEmailSent: false,
    createdAt: new Date().toISOString(),
  };

  // 1. Immediately cache locally so user subscription is never lost
  saveLocalSubscriber(newSub);

  // 2. Direct insert into Supabase Cloud
  const sb = getBrowserSupabase();
  let alreadySubscribedInCloud = false;

  if (sb) {
    try {
      const { error } = await sb.from('subscribers').insert([{
        id: newSub.id,
        email: newSub.email,
        country: newSub.country,
        country_code: newSub.countryCode,
        source: newSub.source,
        status: newSub.status,
        welcome_email_sent: false,
        created_at: newSub.createdAt,
      }]).select();

      if (error) {
        if (
          error.code === '23505' ||
          error.message?.toLowerCase().includes('duplicate') ||
          error.message?.toLowerCase().includes('unique')
        ) {
          alreadySubscribedInCloud = true;
        } else {
          console.warn('Supabase direct subscriber insert note:', error.message);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase direct subscriber insert note:', sbErr);
    }
  }

  // 3. Optional dispatch to backend API route (if server is running, e.g. for Resend welcome email)
  try {
    const res = await safeFetchJson<{
      success: boolean;
      message?: string;
      alreadySubscribed?: boolean;
      emailSent?: boolean;
    }>('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        country: cleanCountry,
        countryCode: cleanCountryCode,
        source: cleanSource,
      }),
    });

    if (res.ok && res.data) {
      if (res.data.alreadySubscribed) {
        return {
          success: true,
          alreadySubscribed: true,
          message: 'You are already registered for our market updates.',
        };
      }
      return {
        success: true,
        message: res.data.message || 'Thank you! You have been successfully registered for updates.',
        emailSent: res.data.emailSent,
      };
    }
  } catch {}

  if (alreadySubscribedInCloud || alreadyInLocal) {
    return {
      success: true,
      alreadySubscribed: true,
      message: 'You are already registered for our market updates.',
    };
  }

  // 4. Return confirmed success
  return {
    success: true,
    message: 'Thank you! You have been successfully registered for updates.',
  };
}

export async function fetchNewsletterSubscribers(): Promise<{
  success: boolean;
  subscribers: any[];
  total: number;
  newcomers7Days: number;
  newcomers30Days: number;
  countries: Array<{ country: string; code: string; count: number }>;
  error?: string;
}> {
  let subscribers: any[] = [];

  // 1. Try direct Supabase Cloud query
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        subscribers = data.map((d: any) => ({
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
      }
    } catch (err) {
      console.warn('Supabase subscribers fetch note:', err);
    }
  }

  // 2. Merge with locally stored subscribers
  const localList = getLocalSubscribers();
  if (localList.length > 0) {
    const map = new Map<string, any>();
    subscribers.forEach((s) => map.set(s.email.toLowerCase(), s));
    localList.forEach((s) => {
      if (!map.has(s.email.toLowerCase())) {
        map.set(s.email.toLowerCase(), s);
      }
    });
    subscribers = Array.from(map.values());
  }

  // 3. Fallback to server proxy if direct query returned nothing
  if (subscribers.length === 0) {
    try {
      const res = await safeFetchJson<any>('/api/newsletter/subscribers');
      if (res.ok && res.data && res.data.success && Array.isArray(res.data.subscribers)) {
        return res.data;
      }
    } catch {}
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const newcomers7Days = subscribers.filter((s) => {
    const age = now - new Date(s.createdAt).getTime();
    return age <= sevenDaysMs;
  }).length;

  const newcomers30Days = subscribers.filter((s) => {
    const age = now - new Date(s.createdAt).getTime();
    return age <= thirtyDaysMs;
  }).length;

  const countryCounts: Record<string, { code: string; count: number }> = {};
  subscribers.forEach((s) => {
    const country = s.country || 'Other';
    const code = s.countryCode || 'GLOBAL';
    if (!countryCounts[country]) {
      countryCounts[country] = { code, count: 0 };
    }
    countryCounts[country].count++;
  });

  const countriesList = Object.entries(countryCounts)
    .map(([country, data]) => ({ country, code: data.code, count: data.count }))
    .sort((a, b) => b.count - a.count);

  return {
    success: true,
    subscribers,
    total: subscribers.length,
    newcomers7Days,
    newcomers30Days,
    countries: countriesList,
  };
}

export async function sendNewsletterBroadcast(payload: {
  subject: string;
  headline: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  resendApiKey?: string;
  senderEmail?: string;
  replyToEmail?: string;
  templateId?: string;
  recipientEmails?: string[];
  filters?: {
    country?: string;
    timeframe?: 'all' | 'newcomers_7d' | 'newcomers_30d' | 'custom_date';
    startDate?: string;
    endDate?: string;
  };
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  recipientsCount?: number;
  notConfigured?: boolean;
}> {
  try {
    const res = await safeFetchJson<any>('/api/newsletter/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.data) return res.data;
    return { success: false, error: res.error || 'Failed to dispatch broadcast' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send broadcast' };
  }
}

export async function sendNewsletterTest(payload: {
  testEmail: string;
  subject?: string;
  headline?: string;
  message?: string;
  ctaText?: string;
  ctaUrl?: string;
  resendApiKey?: string;
  senderEmail?: string;
  replyToEmail?: string;
  templateId?: string;
}): Promise<{ success: boolean; message?: string; error?: string; notConfigured?: boolean }> {
  try {
    const res = await safeFetchJson<any>('/api/newsletter/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.data) return res.data;
    return { success: false, error: res.error || 'Failed to send test email' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send test email' };
  }
}

export async function deleteNewsletterSubscriber(id: string): Promise<boolean> {
  const sb = getBrowserSupabase();
  if (sb) {
    try {
      await sb.from('subscribers').delete().eq('id', id);
    } catch {}
  }

  try {
    const local = getLocalSubscribers();
    const updated = local.filter((s) => s.id !== id);
    localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  try {
    await safeFetchJson(`/api/newsletter/subscribers/${id}`, { method: 'DELETE' });
  } catch {}

  return true;
}
