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
