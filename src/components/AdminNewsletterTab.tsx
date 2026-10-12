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
  ArrowRight,
  Palette,
  Check,
  Target,
  UserCheck
} from 'lucide-react';
import { 
  fetchNewsletterSubscribers, 
  sendNewsletterBroadcast, 
  sendNewsletterTest, 
  deleteNewsletterSubscriber 
} from '../services/supabaseApi';
import { EMAIL_TEMPLATES, EmailTemplateId } from '../services/emailTemplates';
import { validateEmail } from '../utils/emailValidation';
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

  // Filters & Targeting State
  const RESEND_SETUP_DATE = '2026-10-10';
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
  const [specificRecipients, setSpecificRecipients] = useState<string[]>([]);
  const [specificEmailInput, setSpecificEmailInput] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'since_resend' | 'newcomers_7d' | 'newcomers_30d' | 'custom_date'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState(RESEND_SETUP_DATE);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Specific Recipients Handlers
  const handleAddSpecificRecipient = (emailToAdd?: string) => {
    const raw = (emailToAdd || specificEmailInput).trim().toLowerCase();
    if (!raw) return;
    const validation = validateEmail(raw);
    if (!validation.isValid) return;
    if (!specificRecipients.includes(raw)) {
      setSpecificRecipients((prev) => [...prev, raw]);
    }
    setSpecificEmailInput('');
  };

  const handleRemoveSpecificRecipient = (emailToRemove: string) => {
    setSpecificRecipients((prev) => prev.filter((e) => e.toLowerCase() !== emailToRemove.toLowerCase()));
  };

  const handleClearSpecificRecipients = () => {
    setSpecificRecipients([]);
    setSpecificEmailInput('');
  };

  // Style Template State (5 Options with Default)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateId>(
    settings?.newsletter?.templateId || 'institutional_navy'
  );

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
  const [senderEmail, setSenderEmail] = useState(settings?.newsletter?.senderEmail || 'USH Community <updates@ushcommunity.com>');
  const [replyToEmail, setReplyToEmail] = useState(settings?.newsletter?.replyToEmail || settings?.social?.supportEmail || 'ushforex@gmail.com');
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
    // Safety auto-upgrade: If stored sender still uses onboarding@resend.dev or public Gmail, upgrade to verified domain
    if (
      senderEmail.toLowerCase().includes('onboarding@resend.dev') ||
      senderEmail.toLowerCase().includes('@gmail.com') ||
      senderEmail.toLowerCase().includes('@yahoo.com')
    ) {
      setSenderEmail('USH Community <updates@ushcommunity.com>');
    }
  }, []);

  // Filtered subscribers list based on active filters & targeting mode
  const filteredSubscribers = useMemo(() => {
    // 1. Direct Specific Recipient Targeting Mode (Supports Multiple Emails)
    if (targetType === 'specific') {
      const allTargets = [...specificRecipients];
      const pending = specificEmailInput.trim().toLowerCase();
      if (pending && validateEmail(pending).isValid && !allTargets.includes(pending)) {
        allTargets.push(pending);
      }
      if (allTargets.length === 0) return [];
      return allTargets.map((target, idx) => {
        const matched = subscribers.find((s) => (s.email || '').toLowerCase() === target.toLowerCase());
        if (matched) return matched;
        return {
          id: `specific-${idx}-${target}`,
          email: target,
          country: 'Specific Target',
          createdAt: new Date().toISOString(),
          source: 'manual',
          welcomeEmailSent: false,
        };
      });
    }

    // 2. Filtered Audience Mode
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const resendSetupMs = new Date('2026-10-10T00:00:00Z').getTime();

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
      if (timeFilter === 'since_resend') {
        if (createdTime < resendSetupMs) return false;
      } else if (timeFilter === 'newcomers_7d') {
        if (now - createdTime > sevenDaysMs) return false;
      } else if (timeFilter === 'newcomers_30d') {
        if (now - createdTime > thirtyDaysMs) return false;
      } else if (timeFilter === 'custom_date') {
        const start = startDate ? new Date(startDate).getTime() : resendSetupMs;
        const end = endDate ? new Date(endDate).getTime() + (24 * 60 * 60 * 1000) : now;
        if (createdTime < start || createdTime > end) return false;
      }

      return true;
    });
  }, [subscribers, searchQuery, countryFilter, timeFilter, startDate, endDate, targetType, specificRecipients]);

  const handleSaveResendSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingResend(true);

    updateSettings((prev) => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        resendApiKey: resendApiKey.trim(),
        senderEmail: senderEmail.trim(),
        replyToEmail: replyToEmail.trim(),
        templateId: selectedTemplate,
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
        replyToEmail: replyToEmail.trim() || settings?.newsletter?.replyToEmail || 'ushforex@gmail.com',
        templateId: selectedTemplate,
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
    // If targeting specific recipients and there is a valid email still in specificEmailInput, auto-commit it
    if (targetType === 'specific' && specificEmailInput.trim()) {
      const val = validateEmail(specificEmailInput.trim());
      if (val.isValid && !specificRecipients.includes(specificEmailInput.trim().toLowerCase())) {
        const updated = [...specificRecipients, specificEmailInput.trim().toLowerCase()];
        setSpecificRecipients(updated);
        setSpecificEmailInput('');
      }
    }

    if (!subject.trim() || !headline.trim() || !message.trim()) {
      setActionFeedback({ type: 'error', message: 'Please provide a Subject, Headline, and Message body for the broadcast.' });
      return;
    }

    if (filteredSubscribers.length === 0) {
      setActionFeedback({ 
        type: 'error', 
        message: targetType === 'specific'
          ? 'Please enter at least one valid recipient email address above.'
          : 'No subscribers match the current filter selection.' 
      });
      return;
    }

    const confirmMsg = targetType === 'specific'
      ? `Are you sure you want to send this broadcast directly to the ${filteredSubscribers.length} specific recipient(s) (${filteredSubscribers.map(s => s.email).slice(0, 3).join(', ')}${filteredSubscribers.length > 3 ? '...' : ''})?`
      : `Are you sure you want to send this broadcast to ${filteredSubscribers.length} subscriber(s)?`;
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
        replyToEmail: replyToEmail.trim() || settings?.newsletter?.replyToEmail || 'ushforex@gmail.com',
        templateId: selectedTemplate,
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
      <div id="composer-section" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
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
              Send updates, market analysis, or exclusive signals to your audience.
            </p>
          </div>

          {/* Targeted Audience Counter */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-900 text-[12.5px] font-bold self-start sm:self-auto">
            <Users className="w-4 h-4 text-[#0053CF]" />
            <span>Targeting {filteredSubscribers.length} Recipient(s)</span>
          </div>
        </div>

        {/* Audience Targeting Mode Switcher */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setTargetType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audience Segment Filters ({subscribers.length})
            </button>
            <button
              type="button"
              onClick={() => setTargetType('specific')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                targetType === 'specific'
                  ? 'bg-[#0053CF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Target Specific Email</span>
            </button>
          </div>

          {/* Specific Recipient Box */}
          {targetType === 'specific' ? (
            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/90 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#0053CF]" />
                  <span>Specific Recipient Targets ({specificRecipients.length})</span>
                </label>
                {specificRecipients.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSpecificRecipients}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Tag / Chip Badges List */}
              {specificRecipients.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 p-2 bg-white/90 rounded-xl border border-blue-200 max-h-32 overflow-y-auto">
                  {specificRecipients.map((emailAddr) => (
                    <span
                      key={emailAddr}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100/80 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold"
                    >
                      <span className="truncate max-w-[200px]">{emailAddr}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecificRecipient(emailAddr)}
                        className="w-3.5 h-3.5 rounded-full hover:bg-rose-200 hover:text-rose-800 flex items-center justify-center transition-colors cursor-pointer text-[10px]"
                        title={`Remove ${emailAddr}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 bg-white/60 border border-blue-200/60 rounded-xl text-center text-xs text-slate-500 font-medium">
                  No specific recipients added yet. Type an email below and press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono text-[10px] font-bold">Enter</kbd>, or pick from the directory.
                </div>
              )}

              {/* Type or Pick email */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={specificEmailInput}
                    onChange={(e) => setSpecificEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddSpecificRecipient();
                      }
                    }}
                    placeholder="Type recipient email and press Enter (e.g. trader@gmail.com)..."
                    className={`w-full pl-8 pr-3 py-2 bg-white border rounded-xl text-slate-900 text-[13px] font-medium outline-none focus:ring-2 transition-all ${
                      validateEmail(specificEmailInput).status === 'valid'
                        ? 'border-emerald-500 focus:ring-emerald-500/20'
                        : validateEmail(specificEmailInput).status === 'invalid'
                        ? 'border-amber-400 focus:ring-amber-500/20'
                        : 'border-blue-300 focus:ring-[#0053CF]/20'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddSpecificRecipient()}
                  disabled={!validateEmail(specificEmailInput).isValid}
                  className="px-3.5 py-2 bg-[#0053CF] hover:bg-[#0042a6] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1"
                >
                  <span>+ Add</span>
                </button>
                {subscribers.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleAddSpecificRecipient(e.target.value);
                    }}
                    className="px-3 py-2 bg-white border border-blue-300 rounded-xl text-slate-700 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="">+ Add from registered ({subscribers.length})...</option>
                    {subscribers.map((s) => (
                      <option key={s.id} value={s.email}>
                        {s.email} ({s.country || 'Global'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Real-time Validation Note while typing */}
              {validateEmail(specificEmailInput).status === 'valid' && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid email address. Press Enter or click + Add to log this recipient.</span>
                </p>
              )}
              {validateEmail(specificEmailInput).status === 'invalid' && (
                <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1 animate-in fade-in">
                  <span>⚠️</span>
                  <span>{validateEmail(specificEmailInput).message}</span>
                </p>
              )}

              <p className="text-[11px] text-slate-500">
                This broadcast will be sent exclusively to the {specificRecipients.length} logged recipient(s) above instead of your general list.
              </p>
            </div>
          ) : (
            /* Dynamic Audience Filters */
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Audience Filter Criteria</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Resend Setup: Oct 10, 2026
                </span>
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
                    <option value="since_resend">Since Resend Setup (From Oct 10, 2026)</option>
                    <option value="newcomers_7d">Newcomers (&lt; 7 Days / 1 Week)</option>
                    <option value="newcomers_30d">Past 30 Days (1 Month)</option>
                    <option value="custom_date">Custom Date Range (From Oct 10, 2026)...</option>
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
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date (From Setup)</label>
                      <input
                        type="date"
                        value={startDate}
                        min={RESEND_SETUP_DATE}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || RESEND_SETUP_DATE}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
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

          {/* Email Layout & Design Styles (5 Options with Default) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#0053CF]" />
                <span>Email Layout & Design Theme (5 Professional Layouts)</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                Default: Institutional Navy
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {EMAIL_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0053CF] bg-blue-50/40 ring-2 ring-[#0053CF]/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      {/* Swatch & Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                            style={{ backgroundColor: tmpl.themeColor }}
                          />
                          {tmpl.id === 'institutional_navy' && (
                            <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] font-black rounded uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-[#0053CF] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </div>

                      {/* Mock Header Preview */}
                      <div
                        className="w-full h-8 rounded-lg mb-2 p-1.5 flex items-center justify-between overflow-hidden border border-slate-200/50"
                        style={{ backgroundColor: tmpl.previewCardBg }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tmpl.themeColor }} />
                          <span className="text-[8px] font-bold tracking-wider" style={{ color: tmpl.id === 'editorial_light' ? '#0f172a' : '#ffffff' }}>
                            USH
                          </span>
                        </div>
                        <span
                          className="text-[7px] font-bold px-1 py-0.5 rounded"
                          style={{ backgroundColor: tmpl.badgeBg, color: tmpl.badgeText }}
                        >
                          BRIEF
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-[12.5px] leading-tight">
                        {tmpl.name}
                      </h4>
                      <p className="text-[10.5px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                        {tmpl.tagline}
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions & Test Send */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-start gap-2">
                <div className="flex-1 max-w-[260px]">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => {
                      setTestEmail(e.target.value);
                      if (testFeedback) setTestFeedback(null);
                    }}
                    placeholder="Enter test email..."
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-800 text-[13px] font-medium focus:outline-none transition-all ${
                      validateEmail(testEmail).status === 'valid'
                        ? 'border-emerald-500 focus:border-emerald-600'
                        : validateEmail(testEmail).status === 'invalid'
                        ? 'border-amber-400 focus:border-amber-500'
                        : 'border-slate-300 focus:border-[#0053CF]'
                    }`}
                  />
                  {validateEmail(testEmail).status === 'valid' && (
                    <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Valid email format</span>
                    </p>
                  )}
                  {validateEmail(testEmail).status === 'invalid' && (
                    <p className="text-[11px] font-bold text-amber-600 mt-1 flex items-center gap-1 animate-in fade-in">
                      <span>⚠️</span>
                      <span>{validateEmail(testEmail).message}</span>
                    </p>
                  )}
                </div>
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

        {/* Real-time Inline Feedback for Broadcast Dispatch */}
        {actionFeedback && (
          <div className={`mt-3 p-4 rounded-xl border flex items-center justify-between gap-3 text-[13px] font-medium animate-in fade-in ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
              : 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs'
          }`}>
            <div className="flex items-start gap-2.5">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-[13.5px]">
                  {actionFeedback.type === 'success' ? 'Broadcast Dispatched Successfully' : 'Broadcast Dispatch Notice'}
                </p>
                <p className="text-[12px] opacity-90 mt-0.5 leading-relaxed">{actionFeedback.message}</p>
                {actionFeedback.type === 'success' && (
                  <p className="text-[11px] text-emerald-800 font-medium mt-1">
                    💡 <strong>Tip for Gmail:</strong> If you don't see it in your Primary inbox, check the <strong>Promotions</strong> tab or <strong>Spam</strong> folder (Gmail often puts first-time emails from newly verified domains there). Mark as "Not Spam" or drag to Primary!
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
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

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('specific');
                      handleAddSpecificRecipient(sub.email);
                      const composerEl = document.getElementById('composer-section');
                      if (composerEl) composerEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-[#0053CF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-blue-200"
                    title="Add to specific recipients broadcast"
                  >
                    <Target className="w-3 h-3" />
                    <span>Send Direct</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove subscriber"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <label className="block text-[12px] font-bold text-slate-700">
                Sender Email ("From" Field)
              </label>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ushcommunity.com Verified</span>
              </div>
            </div>

            <input
              type="text"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="USH Community <updates@ushcommunity.com>"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-[13.5px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 outline-none transition-all ${
                senderEmail.toLowerCase().includes('@ushcommunity.com')
                  ? 'border-emerald-500 focus:border-emerald-600'
                  : 'border-slate-300 focus:border-[#0053CF]'
              }`}
            />

            {/* Quick Domain Presets */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
              {[
                'USH | USH Community <updates@ushcommunity.com>',
                'USH Community <updates@ushcommunity.com>',
                'USH Community <newsletter@ushcommunity.com>',
                'USH Community <team@ushcommunity.com>',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSenderEmail(preset)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md border transition-colors cursor-pointer ${
                    senderEmail === preset
                      ? 'bg-blue-50 text-[#0053CF] border-blue-200 ring-1 ring-blue-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {preset.replace('USH Community <', '').replace('USH | USH Community <', 'USH | ').replace('>', '')}
                </button>
              ))}
            </div>

            {senderEmail.toLowerCase().includes('@ushcommunity.com') ? (
              <div className="mt-2 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[12px] leading-relaxed flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Verified Domain Active:</strong> Emails will be delivered to any email inbox worldwide with high deliverability via your verified Hostinger DNS records.
                </div>
              </div>
            ) : senderEmail.toLowerCase().includes('@gmail.com') || senderEmail.toLowerCase().includes('@yahoo.com') || senderEmail.toLowerCase().includes('@outlook.com') ? (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Cannot send from public domains:</strong> Email servers reject emails pretending to come from @gmail.com. Since your domain <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">ushcommunity.com</code> is verified on Resend, use <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">USH Community &lt;updates@ushcommunity.com&gt;</code> instead!
                </div>
              </div>
            ) : (
              <p className="text-[11.5px] text-slate-500 mt-1">
                Your domain <strong className="text-slate-800">ushcommunity.com</strong> is verified. Recommended: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-bold">USH Community &lt;updates@ushcommunity.com&gt;</code>.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">
              Reply-To Email Address
            </label>
            <input
              type="email"
              value={replyToEmail}
              onChange={(e) => setReplyToEmail(e.target.value)}
              placeholder="ushforex@gmail.com"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-[13.5px] font-medium focus:ring-2 focus:ring-[#0053CF]/20 outline-none transition-all ${
                validateEmail(replyToEmail).status === 'valid'
                  ? 'border-emerald-500 focus:border-emerald-600'
                  : validateEmail(replyToEmail).status === 'invalid'
                  ? 'border-amber-400 focus:border-amber-500'
                  : 'border-slate-300 focus:border-[#0053CF]'
              }`}
            />
            {validateEmail(replyToEmail).status === 'valid' && (
              <p className="text-[11.5px] font-bold text-emerald-600 mt-1 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Valid inbox address</span>
              </p>
            )}
            {validateEmail(replyToEmail).status === 'invalid' && (
              <p className="text-[11.5px] font-bold text-amber-600 mt-1 flex items-center gap-1 animate-in fade-in">
                <span>⚠️</span>
                <span>{validateEmail(replyToEmail).message}</span>
              </p>
            )}
            <p className="text-[11.5px] text-slate-500 mt-1">
              When subscribers hit <strong>"Reply"</strong> in their email app (Gmail, Apple Mail, Outlook), their message will be delivered directly to this address (e.g. <code>ushforex@gmail.com</code>).
            </p>
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
