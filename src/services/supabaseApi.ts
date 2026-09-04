/**
 * Supabase API service that communicates with our secure server-side API proxy.
 * Keeps all database credentials safely on the backend while providing real-time
 * cloud sync for reviews, support messages, and admin settings.
 */

export interface SupabaseStatus {
  connected: boolean;
  url: string;
  tables?: string[];
  error?: string;
}

export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  try {
    const res = await fetch('/api/supabase/status');
    if (!res.ok) {
      return { connected: false, url: '', error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { connected: false, url: '', error: err.message };
  }
}

export async function fetchCloudReviews(): Promise<any[] | null> {
  try {
    const res = await fetch('/api/reviews');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.reviews)) {
      return data.reviews;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch cloud reviews:', err);
    return null;
  }
}

export async function submitCloudReview(review: {
  name: string;
  country: string;
  countryCode?: string;
  rating: number;
  content: string;
  isApproved?: boolean;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Failed to submit cloud review:', err);
    return false;
  }
}

export async function submitCloudMessage(message: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Failed to submit cloud message:', err);
    return false;
  }
}

export async function syncCloudSettings(settings: any): Promise<boolean> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Failed to sync settings to cloud:', err);
    return false;
  }
}

export async function fetchCloudSettings(): Promise<any | null> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.settings) {
      return data.settings;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch cloud settings:', err);
    return null;
  }
}
