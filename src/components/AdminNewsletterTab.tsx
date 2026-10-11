import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  Filter, 
  Calendar, 
  Globe, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles,
  Search,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  fetchNewsletterSubscribers, 
  sendNewsletterBroadcast, 
  sendNewsletterTest, 
  deleteNewsletterSubscriber 
} from '../services/supabaseApi';
import { useSite } from '../context/SiteContext';

export const AdminNewsletterTab: React.FC = () => {
  const { settings, updateSettings } = useSite();

  // Subscribers State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    newcomers7Days: 0,
    newcomers30Days: 0,
    countries: [] as Array<{ country: string; code: string; count: number }>,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters State
  const [timeFilter, setTimeFilter] = useState<'all' | 'newcomers_7d' | 'newcomers_30d' | 'custom_date'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Composer State
  const [subject, setSubject] = useState('');
  const [headline, setHeadline] = useState('');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('Open Telegram VIP Channel');
  const [ctaUrl, setCtaUrl] = useState(settings?.social?.telegramUrl || 'https://t.me/+wHFuFFkA2i0xZTA8');
  const [testEmail, setTestEmail] = useState('');
  const [testFeedback, setTestFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Action States
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Resend Settings State
  const [resendApiKey, setResendApiKey] = useState(settings?.newsletter?.resendApiKey || '');
  const [senderEmail, setSenderEmail] = useState(settings?.newsletter?.senderEmail || 'USH Community <onboarding@resend.dev>');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingResend, setIsSavingResend] = useState(false);
  const [resendSavedToast, setResendSavedToast] = useState(false);

  // Load subscribers
  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNewsletterSubscribers();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setStats({
          total: data.total || 0,
          newcomers7Days: data.newcomers7Days || 0,
          newcomers30Days: data.newcomers30Days || 0,
          countries: data.countries || [],
        });
      }
    } catch (e) {
      console.warn('Failed to load subscribers:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  // Filtered subscribers list based on active filters
  const filteredSubscribers = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    return subscribers.filter((s) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEmail = (s.email || '').toLowerCase().includes(q);
        const matchCountry = (s.country || '').toLowerCase().includes(q);
        if (!matchEmail && !matchCountry) return false;
      }

      // Country filter
      if (countryFilter !== 'all') {
        if ((s.country || '').toLowerCase() !== countryFilter.toLowerCase()) {
          return false;
        }
      }

      // Timeframe filter
      const createdTime = new Date(s.createdAt).getTime();
      if (timeFilter === 'newcomers_7d') {
        if (now - createdTime > sevenDaysMs) return false;
      } else if (timeFilter === 'newcomers_30d') {
        if (now - createdTime > thirtyDaysMs) return false;
      } else if (timeFilter === 'custom_date' && startDate) {
        const start = new Date(startDate).getTime();
        const end = endDate ? new Date(endDate).getTime() + (24 * 60 * 60 * 1000) : now;
        if (createdTime < start || createdTime > end) return false;
      }

      return true;
    });
  }, [subscribers, searchQuery, countryFilter, timeFilter, startDate, endDate]);

  const handleSaveResendSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingResend(true);

    updateSettings((prev) => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        resendApiKey: resendApiKey.trim(),
        senderEmail: senderEmail.trim(),
      },
    }));

    setTimeout(() => {
      setIsSavingResend(false);
      setResendSavedToast(true);
      setTimeout(() => setResendSavedToast(false), 3000);
    }, 400);
  };

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@') || !testEmail.includes('.')) {
      setTestFeedback({ type: 'error', message: 'Please enter a valid test email address.' });
      return;
    }

    setIsSendingTest(true);
    setTestFeedback(null);

    try {
      const res = await sendNewsletterTest({
        testEmail: testEmail.trim(),
        subject: subject || 'Weekly Market Overview & Structure Analysis',
        headline: headline || 'Systematic Market Updates',
        message: message || 'This is a preview broadcast test from the USH Trading Community administration panel.',
        ctaText,
        ctaUrl,
        resendApiKey: resendApiKey.trim() || settings?.newsletter?.resendApiKey,
        senderEmail: senderEmail.trim() || settings?.newsletter?.senderEmail,
      });

      if (res.success) {
        setTestFeedback({ 
          type: 'success', 
          message: res.message || `Test email dispatched to ${testEmail}! Check your inbox.` 
        });
        setActionFeedback({ 
          type: 'success', 
          message: res.message || `Test email dispatched to ${testEmail}! Check your inbox.` 
        });
      } else {
        if (res.notConfigured) {
          const msg = 'Resend API key is not configured. Please paste your Resend API key in Email Delivery Settings below.';
          setTestFeedback({ type: 'warning', message: msg });
          setActionFeedback({ type: 'error', message: msg });
        } else {
          const msg = res.error || 'Failed to dispatch test email.';
          setTestFeedback({ type: 'error', message: msg });
          setActionFeedback({ type: 'error', message: msg });
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Error communicating with email service.';
      setTestFeedback({ type: 'error', message: msg });
      setActionFeedback({ type: 'error', message: msg });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!subject.trim() || !headline.trim() || !message.trim()) {
      setActionFeedback({ type: 'error', message: 'Please provide a Subject, Headline, and Message body for the broadcast.' });
      return;
    }

    if (filteredSubscribers.length === 0) {
      setActionFeedback({ type: 'error', message: 'No subscribers match the current filter selection.' });
      return;
    }

    const confirmMsg = `Are you sure you want to send this broadcast to ${filteredSubscribers.length} subscriber(s)?`;
    if (!window.confirm(confirmMsg)) return;

    setIsSendingBroadcast(true);
    setActionFeedback(null);

    try {
      const res = await sendNewsletterBroadcast({
        subject: subject.trim(),
        headline: headline.trim(),
        message: message.trim(),
        ctaText: ctaText.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
        resendApiKey: resendApiKey.trim() || settings?.newsletter?.resendApiKey,
        senderEmail: senderEmail.trim() || settings?.newsletter?.senderEmail,
        recipientEmails: filteredSubscribers.map((s) => s.email),
        filters: {
          country: countryFilter,
          timeframe: timeFilter,
          startDate: timeFilter === 'custom_date' ? startDate : undefined,
          endDate: timeFilter === 'custom_date' ? endDate : undefined,
        },
      });

      if (res.success) {
        setActionFeedback({ type: 'success', message: res.message || 'Broadcast successfully sent to your audience!' });
        loadSubscribers();
      } else {
        if (res.notConfigured) {
          setActionFeedback({ type: 'error', message: 'Resend API key is not configured. Please paste your Resend API key below.' });
        } else {
          setActionFeedback({ type: 'error', message: res.error || 'Failed to dispatch broadcast.' });
        }
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err?.message || 'Error dispatching broadcast.' });
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!window.confirm(`Remove ${email} from newsletter subscribers?`)) return;
    const ok = await deleteNewsletterSubscriber(id);
    if (ok) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Live Audience Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11.5px] font-bold uppercase tracking-wider">Subscribers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Active</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11.5px] font-bold uppercase tracking-wider">Newcomers (&lt; 7d)</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.newcomers7Days}</span>
            <span className="text-[11px] font-medium text-slate-500">This week</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11.5px] font-bold uppercase tracking-wider">Past Month</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.newcomers30Days}</span>
            <span className="text-[11px] font-medium text-slate-500">&lt; 30 days</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11.5px] font-bold uppercase tracking-wider">Countries</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.countries.length}</span>
            <span className="text-[11px] font-medium text-slate-500">Global</span>
          </div>
        </div>
      </div>

      {/* 2. Feedback Notification */}
      {actionFeedback && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          actionFeedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-[13.5px] font-medium leading-relaxed">
            {actionFeedback.message}
          </div>
          <button 
            onClick={() => setActionFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Campaign Broadcast Composer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-[#0053CF] rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
              <Mail className="w-3 h-3" />
              <span>Email Marketing Broadcast</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Compose Newsletter Campaign
            </h3>
            <p className="text-[13px] text-slate-500">
              Send updates and analysis to all subscribers or targeted newcomer segments.
            </p>
          </div>

          {/* Targeted Audience Counter */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-900 text-[12.5px] font-bold self-start sm:self-auto">
            <Users className="w-4 h-4 text-[#0053CF]" />
            <span>Targeting {filteredSubscribers.length} Recipient(s)</span>
          </div>
        </div>

        {/* Dynamic Audience Filters */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Audience Filter Criteria</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Timeframe Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Registration Timeframe</label>
              <select
                value={timeFilter}
                onChange={(e: any) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
              >
                <option value="all">All Time (Everyone)</option>
                <option value="newcomers_7d">Newcomers (&lt; 7 Days / 1 Week)</option>
                <option value="newcomers_30d">Past 30 Days (1 Month)</option>
                <option value="custom_date">Custom Date Range...</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Country</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
              >
                <option value="all">All Countries ({stats.total})</option>
                {stats.countries.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country} ({c.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Dates if selected */}
            {timeFilter === 'custom_date' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Campaign Input Fields */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Weekly Market Overview: Gold & Key Liquidity Zones"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Main Headline (Inside Email)
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Market Structure & Execution Notes for This Week"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Message Body
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your market update, educational note, or community announcement here... (Paragraph breaks are preserved)"
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none leading-relaxed"
            />
          </div>

          {/* Optional Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Call-to-Action Button Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Open Telegram Community"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Button Destination URL
              </label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://t.me/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions & Test Send */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => {
                    setTestEmail(e.target.value);
                    if (testFeedback) setTestFeedback(null);
                  }}
                  placeholder="Enter test email..."
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-[13px] font-medium w-48 sm:w-56 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={isSendingTest || isSendingBroadcast}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[12.5px] rounded-xl transition-colors cursor-pointer disabled:opacity-60 shrink-0 flex items-center gap-1.5"
                >
                  {isSendingTest ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                      <span>Sending Test...</span>
                    </>
                  ) : (
                    <span>Send Test</span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dispatches a single preview to this address to verify layout before sending to all subscribers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendBroadcast}
              disabled={isSendingBroadcast || filteredSubscribers.length === 0}
              className="px-6 py-2.5 bg-[#0053CF] hover:bg-[#0042a6] active:scale-[0.99] text-white font-bold text-[14px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
            {isSendingBroadcast ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Broadcasting to {filteredSubscribers.length}...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Broadcast ({filteredSubscribers.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Real-time Inline Feedback for Test Send */}
        {testFeedback && (
          <div className={`mt-3 p-3.5 rounded-xl border flex items-center justify-between gap-3 text-[13px] font-medium animate-in fade-in ${
            testFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : testFeedback.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2">
              {testFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : testFeedback.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testFeedback.message}</span>
            </div>
            {testFeedback.type === 'warning' ? (
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('resend-settings-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-amber-800 underline font-bold text-xs shrink-0 cursor-pointer"
              >
                Configure Resend Key ↓
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setTestFeedback(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {/* 4. Subscribers Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Registered Subscribers ({filteredSubscribers.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search email or country..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[12.5px] font-medium outline-none focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            <button
              onClick={() => { setRefreshing(true); loadSubscribers(); }}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading subscriber records...
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-1">
            <p className="font-bold text-[14px]">No subscribers found</p>
            <p className="text-xs text-slate-400">
              {searchQuery || countryFilter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Subscribers will appear here when visitors submit their email in the popup or footer.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {filteredSubscribers.map((sub) => (
              <div
                key={sub.id}
                className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-[13.5px] truncate">
                      {sub.email}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10.5px] font-bold shrink-0">
                      {sub.country || 'Unknown'}
                    </span>
                    <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded text-[10px] font-medium uppercase shrink-0">
                      {sub.source || 'popup'}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Joined: {new Date(sub.createdAt).toLocaleDateString()}</span>
                    {sub.welcomeEmailSent && (
                      <span className="text-emerald-600 font-semibold">• Welcome email sent</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Remove subscriber"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Resend API Key Configuration */}
      <div id="resend-settings-section" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-700" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Resend Email Marketing Configuration
            </h3>
          </div>
          {resendSavedToast && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              Settings Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveResendSettings} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Resend API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                placeholder="re_123456789..."
                className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-mono focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11.5px] text-slate-500 mt-1">
              Get your free API key at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">resend.com</a> (Free tier includes 100 emails/day, no credit card required).
            </p>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Sender Email ("From" Field)
            </label>
            <input
              type="text"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="USH Community <onboarding@resend.dev> or custom domain"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
            />
            {senderEmail.toLowerCase().includes('@gmail.com') || senderEmail.toLowerCase().includes('@yahoo.com') || senderEmail.toLowerCase().includes('@outlook.com') ? (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Cannot send from @gmail.com:</strong> Resend and email servers reject emails pretending to be sent from public domains like Gmail because of anti-phishing security (DMARC).
                  <div className="mt-1 text-amber-800">
                    • For testing: keep <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">USH Community &lt;onboarding@resend.dev&gt;</code>
                    <br />
                    • For production with your brand: verify <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">ushcommunity.com</code> at <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="underline font-bold">resend.com/domains</a>, then set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">USH Community &lt;updates@ushcommunity.com&gt;</code>.
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11.5px] text-slate-500 mt-1">
                Default is <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">USH Community &lt;onboarding@resend.dev&gt;</code> for instant testing without domain verification. (Public domains like <code>@gmail.com</code> are rejected by Resend).
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingResend}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0053CF] hover:bg-[#0042a6] text-white font-bold text-[13px] rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Email Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
