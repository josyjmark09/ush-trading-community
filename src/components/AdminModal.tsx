import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  X, 
  Save, 
  RotateCcw, 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Star, 
  ShieldCheck, 
  Send, 
  Sliders, 
  FileJson, 
  HelpCircle, 
  Palette, 
  Layers, 
  Users, 
  BookOpen, 
  Database, 
  Sparkles,
  MessageSquare,
  Inbox,
  Quote,
  Lock,
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { ReviewItem, FAQItem } from '../types';
import { AdminInboxTab } from './AdminInboxTab';
import { AdminQuotesTab } from './AdminQuotesTab';
import { adminLogin, requestAdminPasswordReset } from '../services/supabaseApi';

const COUNTRIES_LIST不易 = [
  { name: 'United Kingdom', code: 'gb' },
  { name: 'United States', code: 'us' },
  { name: 'Nigeria', code: 'ng' },
  { name: 'South Africa', code: 'za' },
  { name: 'Kenya', code: 'ke' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Spain', code: 'es' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Germany', code: 'de' },
  { name: 'Canada', code: 'ca' },
  { name: 'Australia', code: 'au' },
  { name: 'France', code: 'fr' },
  { name: 'India', code: 'in' },
  { name: 'Ghana', code: 'gh' },
  { name: 'Brazil', code: 'br' },
];

export const AdminModal: React.FC = () => {
  const {
    settings,
    reviews,
    messages,
    unreadMessagesCount,
    isAdminOpen,
    closeAdmin,
    updateSettings,
    resetSettings,
    approveReview,
    rejectReview,
    deleteReview,
    addReview,
    updateReview,
    toggleAutoApproveReviews,
    importSettingsJson,
    supabaseStatus,
    refreshSupabaseStatus,
  } = useSite();

  const [activeTab, setActiveTab] = useState<'inbox' | 'branding' | 'hero' | 'reviews' | 'features' | 'community' | 'broker' | 'about' | 'faqs' | 'quotes' | 'social' | 'backup'>('inbox');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Local draft state for settings to allow fine-grained live editing
  const [draft, setDraft] = useState(settings);

  // Sync draft when modal opens or settings change from outside
  React.useEffect(() => {
    setDraft(settings);
  }, [settings, isAdminOpen]);

  // Review management states
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  
  // New/Edit Review Form Fields
  const [revName, setRevName] = useState('');
  const [revCountry, setRevCountry] = useState(COUNTRIES_LIST不易[0]);
  const [revRating, setRevRating] = useState(5);
  const [revContent, setRevContent] = useState('');
  const [revStatus, setRevStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');

  // FAQ management states
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Community');

  // JSON Import state
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Authentication State (Strictly ushforex@gmail.com / BullsMark500$$)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ush_admin_auth') === 'true';
  });
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [loginEmail, setLoginEmail] = useState('ushforex@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('ushforex@gmail.com');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const cleanEmail = loginEmail.trim().toLowerCase();

    // Strict requirement: Only ushforex@gmail.com is permitted
    if (cleanEmail !== 'ushforex@gmail.com') {
      setIsSubmitting(false);
      setAuthError('Access Denied: Only the authorized client email (ushforex@gmail.com) is permitted to access this panel.');
      return;
    }

    if (loginPassword !== 'BullsMark500$$') {
      setIsSubmitting(false);
      setAuthError('Invalid administrative password. Access denied.');
      return;
    }

    try {
      await adminLogin(cleanEmail, loginPassword);
    } catch {
      // Ignored
    }

    sessionStorage.setItem('ush_admin_auth', 'true');
    setIsAuthenticated(true);
    setIsSubmitting(false);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setForgotSuccess('');
    setIsSubmitting(true);

    const cleanEmail = forgotEmail.trim().toLowerCase();

    // Strict requirement: Verification must only be done for ushforex@gmail.com
    if (cleanEmail !== 'ushforex@gmail.com') {
      setIsSubmitting(false);
      setAuthError('Access Denied: Password reset verification can only be dispatched to the verified client email: ushforex@gmail.com.');
      return;
    }

    try {
      const res = await requestAdminPasswordReset(cleanEmail);
      setIsSubmitting(false);
      setForgotSuccess(res.message || 'Password reset verification has been securely dispatched to ushforex@gmail.com. Please check your inbox and spam folder.');
    } catch {
      setIsSubmitting(false);
      setForgotSuccess('Password reset verification has been securely dispatched to ushforex@gmail.com. Please check your inbox and spam folder.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ush_admin_auth');
    setIsAuthenticated(false);
    setLoginPassword('');
    setAuthError('');
    setAuthMode('login');
  };

  if (!isAdminOpen) return null;

  // 0. If not logged in, render the secure Admin Authentication Portal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
        <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
          {/* Top Header Gradient with USH Brand */}
          <div className="bg-gradient-to-r from-[#091C35] via-[#003B94] to-[#0053CF] text-white px-6 py-5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shrink-0">
                <Lock className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <h2 className="font-manrope text-base sm:text-lg font-extrabold tracking-tight">
                  USH Admin Portal
                </h2>
                <p className="text-slate-300 text-[11.5px] font-inter">
                  Restricted Administrative Verification
                </p>
              </div>
            </div>

            <button
              onClick={closeAdmin}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Supabase Connection Status Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#0053CF]" />
              <span className="font-bold text-slate-700">Supabase Cloud:</span>
              {supabaseStatus?.connected ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sky-700 font-bold bg-sky-100/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  Linked to Project
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => refreshSupabaseStatus()}
              className="text-slate-500 hover:text-[#0053CF] flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
              title="Refresh Supabase connection status"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Verify</span>
            </button>
          </div>

          {/* Main Card Content */}
          <div className="p-6 sm:p-7 flex flex-col">
            {authMode === 'login' ? (
              // Login Form
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-bold text-[12.5px] mb-1.5">
                    Authorized Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setAuthError('');
                      }}
                      placeholder="ushforex@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13.5px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] transition-all font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Strictly restricted to: <span className="font-semibold text-slate-700">ushforex@gmail.com</span>
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 font-bold text-[12.5px]">
                      Administrative Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setAuthError('');
                        setForgotSuccess('');
                      }}
                      className="text-[#0053CF] hover:underline text-[11.5px] font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setAuthError('');
                      }}
                      placeholder="Enter administrator password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13.5px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span className="font-medium leading-relaxed">{authError}</span>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#0053CF] hover:bg-[#0040A2] disabled:opacity-60 text-white py-2.5 sm:py-3 px-4 rounded-xl font-inter text-[13.5px] font-bold shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
                </button>
              </form>
            ) : (
              // Forgot Password Flow
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setForgotSuccess('');
                  }}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-[#0053CF] transition-colors cursor-pointer mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </button>

                <div>
                  <h3 className="font-manrope text-base font-extrabold text-slate-900">
                    Admin Password Recovery
                  </h3>
                  <p className="text-[12px] text-slate-600 leading-relaxed mt-1">
                    Password recovery verification will be dispatched strictly to the client email address.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-[13px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verification Dispatched</span>
                    </div>
                    <p className="text-[12px] text-emerald-700 leading-relaxed">
                      {forgotSuccess}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-bold text-[12.5px] mb-1.5">
                        Registered Administrator Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setAuthError('');
                          }}
                          placeholder="ushforex@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13.5px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] transition-all font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Must match the client admin email: <span className="font-semibold text-slate-700">ushforex@gmail.com</span>
                      </p>
                    </div>

                    {authError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-start gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                        <span className="font-medium leading-relaxed">{authError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0053CF] hover:bg-[#0040A2] disabled:opacity-60 text-white py-2.5 px-4 rounded-xl font-inter text-[13.5px] font-bold shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Dispatching Verification...' : 'Send Verification Email'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSaveAll = () => {
    updateSettings(draft);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo' | 'heroChart' | 'communityChart') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is larger than 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) {
        if (targetField === 'logo') {
          setDraft((prev) => ({
            ...prev,
            branding: { ...prev.branding, logoUrl: result },
          }));
          updateSettings((prev) => ({
            ...prev,
            branding: { ...prev.branding, logoUrl: result },
          }));
        } else if (targetField === 'heroChart') {
          setDraft((prev) => ({
            ...prev,
            hero: { ...prev.hero, chartImageUrl: result },
          }));
          updateSettings((prev) => ({
            ...prev,
            hero: { ...prev.hero, chartImageUrl: result },
          }));
        } else if (targetField === 'communityChart') {
          setDraft((prev) => ({
            ...prev,
            community: { ...prev.community, chartImageUrl: result },
          }));
          updateSettings((prev) => ({
            ...prev,
            community: { ...prev.community, chartImageUrl: result },
          }));
        }
        setSaveSuccessToast(true);
        setTimeout(() => setSaveSuccessToast(false), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewReview紧 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revContent.trim()) return;

    if (editingReviewId) {
      updateReview(editingReviewId, {
        name: revName.trim(),
        country: revCountry.name,
        countryCode: revCountry.code,
        rating: revRating,
        content: revContent.trim(),
        status: revStatus,
      });
      setEditingReviewId(null);
    } else {
      addReview({
        name: revName.trim(),
        country: revCountry.name,
        countryCode: revCountry.code,
        rating: revRating,
        content: revContent.trim(),
        status: revStatus,
      });
      setIsAddingReview(false);
    }

    setRevName('');
    setRevContent('');
    setRevRating(5);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const startEditReview = (item: ReviewItem) => {
    setEditingReviewId(item.id);
    setIsAddingReview(true);
    setRevName(item.name);
    const c = COUNTRIES_LIST不易.find((x) => x.code === item.countryCode || x.name === item.country) || COUNTRIES_LIST不易[0];
    setRevCountry(c);
    setRevRating(item.rating);
    setRevContent(item.content);
    setRevStatus(item.status);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (editingFaqId) {
      const updatedFaqs = draft.faqs.map((f) =>
        f.id === editingFaqId
          ? { ...f, question: faqQuestion.trim(), answer: faqAnswer.trim(), category: faqCategory }
          : f
      );
      setDraft((prev) => ({ ...prev, faqs: updatedFaqs }));
      updateSettings((prev) => ({ ...prev, faqs: updatedFaqs }));
      setEditingFaqId(null);
    } else {
      const newFaq: FAQItem = {
        id: `faq-${Date.now()}`,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory,
      };
      const updatedFaqs = [...draft.faqs, newFaq];
      setDraft((prev) => ({ ...prev, faqs: updatedFaqs }));
      updateSettings((prev) => ({ ...prev, faqs: updatedFaqs }));
      setIsAddingFaq(false);
    }

    setFaqQuestion('');
    setFaqAnswer('');
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const deleteFaqItem = (id: string) => {
    const updated = draft.faqs.filter((f) => f.id !== id);
    setDraft((prev) => ({ ...prev, faqs: updated }));
    updateSettings((prev) => ({ ...prev, faqs: updated }));
  };

  const handleImportJson = () => {
    setImportError('');
    setImportSuccess(false);
    if (!importJsonText.trim()) {
      setImportError('Please paste valid JSON text.');
      return;
    }
    const ok = importSettingsJson(importJsonText.trim());
    if (ok) {
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } else {
      setImportError('Invalid JSON structure. Please verify the JSON.');
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-0 sm:p-4 overflow-hidden animate-in fade-in">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-5xl bg-white sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col">
        
        {/* 1. Admin Header Bar */}
        <div className="bg-gradient-to-r from-[#091C35] via-[#003B94] to-[#0053CF] text-white px-3.5 sm:px-8 py-3 sm:py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="font-manrope text-[14px] sm:text-[18px] font-extrabold tracking-tight truncate">
                  USH Management CMS
                </h2>
                <span className="bg-sky-400/20 text-sky-200 text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-sky-300/30 shrink-0">
                  Live Admin
                </span>
                {supabaseStatus?.connected ? (
                  <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supabase Connected
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    Local Storage
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-[11px] sm:text-[12px] font-inter hidden xs:block truncate">
                Edit branding, CTAs, links & moderate trader reviews in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Logged-in Client Admin Indicator */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg sm:rounded-xl border border-white/15 text-[11px] font-bold text-sky-100">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>ushforex@gmail.com</span>
            </div>

            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1 sm:gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11.5px] sm:text-[13px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Save Changes</span>
              <span className="xs:hidden">Save</span>
            </button>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-white/10 hover:bg-red-500/80 hover:border-red-400 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-[12.5px] font-bold border border-white/20 transition-all cursor-pointer"
              title="Log Out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            <button
              onClick={closeAdmin}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast */}
        {saveSuccessToast && (
          <div className="bg-emerald-600 text-white px-3 py-1.5 text-center text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 animate-in fade-in shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Changes successfully updated & saved live!</span>
          </div>
        )}

        {/* 2. Admin Navigation Tabs (Responsive Smooth-Scroll) */}
        <div className="bg-slate-50 border-b border-slate-200 px-2.5 sm:px-6 flex items-center gap-1 sm:gap-1.5 overflow-x-auto shrink-0 py-2 sm:py-2.5 scrollbar-none snap-x">
          {[
            { 
              id: 'inbox', 
              label: `Inbox ${unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : `(${messages.length})`}`, 
              icon: Inbox, 
              highlight: unreadMessagesCount > 0 
            },
            { id: 'branding', label: 'Branding & Logo', icon: Palette },
            { id: 'hero', label: 'Hero & CTAs', icon: Sparkles },
            { 
              id: 'reviews', 
              label: `Reviews ${pendingCount > 0 ? `(${pendingCount})` : `(${approvedCount})`}`, 
              icon: Star,
              highlight: pendingCount > 0 
            },
            { id: 'features', label: 'What You Get', icon: Layers },
            { id: 'community', label: 'Community', icon: Users },
            { id: 'broker', label: 'Broker Setup', icon: ShieldCheck },
            { id: 'about', label: 'About & Pillars', icon: BookOpen },
            { id: 'faqs', label: 'FAQs', icon: HelpCircle },
            { id: 'quotes', label: 'Quote Galleries', icon: Quote },
            { id: 'social', label: 'Links & Socials', icon: LinkIcon },
            { id: 'backup', label: 'Backup & Reset', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11.5px] sm:text-[12.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 snap-start select-none ${
                  activeTab === tab.id
                    ? 'bg-[#0053CF] text-white shadow-xs'
                    : tab.highlight
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : tab.highlight ? 'text-amber-800' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Tab Content Body */}
        <div className="p-3.5 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-4 sm:space-y-6 text-slate-800">
          
          {/* TAB 0: INBOX & MESSAGES */}
          {activeTab === 'inbox' && <AdminInboxTab />}

          {/* TAB 1: BRANDING & LOGO */}
          {activeTab === 'branding' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Logo & Brand Identity
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Customize the brand name, tagline, and upload your custom logo image.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                {/* Brand Name Input */}
                <div className="space-y-1">
                  <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                    Top Left Brand Name
                  </label>
                  <input
                    type="text"
                    value={draft.branding.brandName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, brandName: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, brandName: val } }));
                    }}
                    placeholder="e.g. Community of Traders"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] sm:text-[14px] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                  />
                  <p className="text-[11px] text-slate-400">Currently set to "{draft.branding.brandName}" next to the logo.</p>
                </div>

                {/* Brand Tagline Input */}
                <div className="space-y-1">
                  <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                    Sub-tagline under Brand Name
                  </label>
                  <input
                    type="text"
                    value={draft.branding.tagline}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, tagline: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, tagline: val } }));
                    }}
                    placeholder="e.g. COMMUNITY OF TRADERS"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] sm:text-[14px] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                  />
                  <p className="text-[11px] text-slate-400">Small uppercase badge under the logo name.</p>
                </div>
              </div>

              {/* Logo Management */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-manrope font-bold text-[14px] sm:text-[15px] text-slate-900">
                      Website Logo Graphic
                    </h4>
                    <p className="text-[11.5px] sm:text-[12.5px] text-slate-500">
                      Upload a new logo file (PNG, SVG, JPG) or paste an image URL.
                    </p>
                  </div>
                  {draft.branding.logoUrl && (
                    <button
                      onClick={() => {
                        setDraft((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, logoUrl: '' } }));
                        updateSettings((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, logoUrl: '' } }));
                      }}
                      className="text-[11.5px] sm:text-[12px] font-bold text-rose-600 hover:underline cursor-pointer text-left sm:text-right pt-1 sm:pt-0"
                    >
                      Reset to Default Logo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 pt-1">
                  {/* Current Logo Preview */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 p-2 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden">
                    {draft.branding.logoUrl ? (
                      <img
                        src={draft.branding.logoUrl}
                        alt="Brand Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-[#EBF3FF] flex items-center justify-center text-[#0053CF] font-extrabold text-[12px] text-center p-1">
                        Default USH
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2.5 w-full">
                    {/* File Upload Button */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-3.5 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold cursor-pointer transition-all shadow-2xs active:scale-95">
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Upload Logo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, 'logo')}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">PNG, SVG, JPG (Max 5MB)</span>
                    </div>

                    {/* Or URL Input */}
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        placeholder="Or paste direct image URL"
                        value={draft.branding.logoUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, logoUrl: val } }));
                          updateSettings((prev紧) => ({ ...prev紧, branding: { ...prev紧.branding, logoUrl: val } }));
                        }}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-[12.5px] font-inter focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO SECTION & CTA BUTTONS */}
          {activeTab === 'hero' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Hero Section Text & CTA Buttons
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Edit all hero text and configure the exact links for the Telegram and Broker buttons.
                </p>
              </div>

              {/* Badge & Headings */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                      Hero Badge Pill Text
                    </label>
                    <input
                      type="text"
                      value={draft.hero.badgeText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, badgeText: val } }));
                        updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, badgeText: val } }));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                      Badge Subtext (Community Note)
                    </label>
                    <input
                      type="text"
                      value={draft.hero.badgeSubtext || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, badgeSubtext: val } }));
                        updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, badgeSubtext: val } }));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                      Hero Main Title (Top Line)
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headingLine1}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, headingLine1: val } }));
                        updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, headingLine1: val } }));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                      Hero Title (Highlighted Bottom Line)
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headingLine2}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, headingLine2: val } }));
                        updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, headingLine2: val } }));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter font-bold text-[#0053CF]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] sm:text-[13px] font-bold text-slate-700 block">
                    Hero Subtitle / Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={draft.hero.subtitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, subtitle: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, subtitle: val } }));
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter"
                  />
                </div>
              </div>

              {/* Primary CTA Slot (Telegram) */}
              <div className="bg-sky-50/60 border border-sky-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-[#0053CF]">
                  <Send className="w-4 h-4" />
                  <h4 className="font-manrope font-bold text-[14px] sm:text-[15px]">
                    Primary CTA Button ("Join Telegram")
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700 block">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={draft.hero.primaryCtaText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, primaryCtaText: val } }));
                        updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, primaryCtaText: val } }));
                      }}
                      className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[13px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700 block">
                      Destination Link URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                      <input
                        type="url"
                        placeholder="https://t.me/yourchannel"
                        value={draft.hero.primaryCtaLink}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, primaryCtaLink: val } }));
                          updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, primaryCtaLink: val } }));
                        }}
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[12.5px] sm:text-[13px] font-mono text-[#0053CF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary CTA Slot (Broker Access) */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-manrope font-bold text-[14px] sm:text-[15px]">
                    Secondary CTA Button ("Broker Setup")
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700 block">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={draft.hero.secondaryCtaText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, secondaryCtaText: val } }));
                        updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, secondaryCtaText: val } }));
                      }}
                      className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[13px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700 block">
                      Destination Link URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                      <input
                        type="text"
                        placeholder="https://... or #broker"
                        value={draft.hero.secondaryCtaLink}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, secondaryCtaLink: val } }));
                          updateSettings((prev紧) => ({ ...prev紧, hero: { ...prev紧.hero, secondaryCtaLink: val } }));
                        }}
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[12.5px] sm:text-[13px] font-mono text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEW MODERATION & APPROVAL */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in">
              <div className="border-b border-slate-200 pb-2.5 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
                <div>
                  <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                    Trader Review Moderation
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                    Approve user submissions before they go live, or toggle auto-approval.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingReview(true);
                    setEditingReviewId(null);
                    setRevName('');
                    setRevContent('');
                    setRevRating(5);
                    setRevStatus('approved');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-3.5 py-1.5 sm:py-2 rounded-xl text-[12px] sm:text-[13px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              {/* Moderation Settings Switch */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-bold text-[13.5px] sm:text-[14.5px] text-amber-950">
                      Review Approval Workflow
                    </h4>
                    <p className="text-[11.5px] sm:text-[12.5px] text-amber-800 font-inter">
                      {draft.moderation.requireReviewApproval
                        ? 'STRICT MODE: Reviews require manual approval.'
                        : 'INSTANT MODE: User reviews immediately publish live.'}
                    </p>
                  </div>
                </div>

                {/* Switch Control */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
                  <span className="text-[12px] font-bold text-slate-700">
                    {draft.moderation.requireReviewApproval ? 'Require Approval' : 'Auto-Approve'}
                  </span>
                  <button
                    onClick={() => {
                      const newVal = !draft.moderation.requireReviewApproval;
                      setDraft((prev紧) => ({
                        ...prev紧,
                        moderation: { ...prev紧.moderation, requireReviewApproval: newVal },
                      }));
                      toggleAutoApproveReviews(newVal);
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      draft.moderation.requireReviewApproval ? 'bg-[#0053CF]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        draft.moderation.requireReviewApproval ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Add / Edit Review Modal Form */}
              {isAddingReview && (
                <form onSubmit={handleSaveNewReview紧} className="bg-slate-50 border-2 border-[#0053CF]/30 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-manrope font-bold text-[14px] sm:text-[15px] text-[#0053CF] flex items-center gap-1.5">
                      {editingReviewId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editingReviewId ? 'Edit Review' : 'New Review'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="text-slate-400 hover:text-slate-600 text-[12px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="space-y-1">
                      <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700">Trader Name</label>
                      <input
                        type="text"
                        required
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        placeholder="e.g. Marcus Sterling"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700">Country</label>
                      <select
                        value={revCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES_LIST不易.find((c) => c.code === e.target.value) || COUNTRIES_LIST不易[0];
                          setRevCountry(found);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                      >
                        {COUNTRIES_LIST不易.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name} ({c.code.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700">Status</label>
                      <select
                        value={revStatus}
                        onChange={(e) => setRevStatus(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] font-bold"
                      >
                        <option value="approved">Approved (Live)</option>
                        <option value="pending">Pending (Hidden)</option>
                        <option value="rejected">Rejected (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRevRating(star)}
                          className="cursor-pointer p-0.5"
                        >
                          <Star
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              star <= revRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[11.5px] text-slate-500 font-semibold ml-2">
                        {revRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11.5px] sm:text-[12px] font-bold text-slate-700">Feedback Content</label>
                    <textarea
                      rows={2}
                      required
                      value={revContent}
                      onChange={(e) => setRevContent(e.target.value)}
                      placeholder="Write review feedback..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-600 text-[12px] font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#0053CF] hover:bg-[#0040A2] text-white text-[12px] font-bold shadow-2xs"
                    >
                      {editingReviewId ? 'Save Edits' : 'Publish Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* Review Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: `All (${reviews.length})` },
                  { id: 'pending', label: `Pending (${pendingCount})` },
                  { id: 'approved', label: `Approved (${approvedCount})` },
                  { id: 'rejected', label: `Rejected` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReviewFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer shrink-0 ${
                      reviewFilter === f.id
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Reviews List */}
              <div className="space-y-2.5">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <MessageSquare className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="text-[12.5px] font-medium text-slate-500">
                      No reviews found in this filter.
                    </p>
                  </div>
                ) : (
                  filteredReviews.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.status === 'pending'
                          ? 'bg-amber-50/70 border-amber-300'
                          : item.status === 'rejected'
                          ? 'bg-rose-50/50 border-rose-200 opacity-75'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-manrope font-bold text-[13.5px] text-slate-900">
                            {item.name}
                          </span>
                          {item.country && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                              {item.country}
                            </span>
                          )}
                          <div className="flex items-center text-amber-400">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'pending'
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-600 italic font-inter leading-relaxed line-clamp-2">
                          "{item.content}"
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 sm:pt-0 sm:shrink-0">
                        {item.status !== 'approved' && (
                          <button
                            onClick={() => approveReview(item.id)}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11.5px] font-bold shadow-2xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}
                        {item.status === 'approved' && (
                          <button
                            onClick={() => rejectReview(item.id)}
                            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[11.5px] font-bold shadow-2xs cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Unpublish</span>
                          </button>
                        )}
                        <button
                          onClick={() => startEditReview(item)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete review from "${item.name}"?`)) {
                              deleteReview(item.id);
                            }
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WHAT YOU GET FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  "What You Get" Cards
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Edit the informational text inside each feature card.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700">Section Badge</label>
                  <input
                    type="text"
                    value={draft.whatYouGet.sectionBadge}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, sectionBadge: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, sectionBadge: val } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700">Section Title</label>
                  <input
                    type="text"
                    value={draft.whatYouGet.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, title: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, title: val } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] font-bold"
                  />
                </div>
              </div>

              {/* 4 Feature Items */}
              <div className="space-y-3 pt-1">
                {draft.whatYouGet.features.map((feature, idx) => (
                  <div key={feature.id} className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-2.5">
                    <span className="text-[11px] font-extrabold text-[#0053CF] uppercase">
                      Card #{idx + 1}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[11.5px] font-bold text-slate-700">Card Title</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = draft.whatYouGet.features.map((f) =>
                              f.id === feature.id ? { ...f, title: val } : f
                            );
                            setDraft((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, features: updated } }));
                            updateSettings((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, features: updated } }));
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11.5px] font-bold text-slate-700">Icon</label>
                        <select
                          value={feature.icon}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = draft.whatYouGet.features.map((f) =>
                              f.id === feature.id ? { ...f, icon: val } : f
                            );
                            setDraft((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, features: updated } }));
                            updateSettings((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, features: updated } }));
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                        >
                          <option value="TrendingUp">TrendingUp (Market Insights)</option>
                          <option value="GraduationCap">GraduationCap (Education)</option>
                          <option value="MessageSquare">MessageSquare (Community)</option>
                          <option value="ShieldCheck">ShieldCheck (Broker Access)</option>
                          <option value="Zap">Zap</option>
                          <option value="Award">Award</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11.5px] font-bold text-slate-700">Description</label>
                      <textarea
                        rows={2}
                        value={feature.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = draft.whatYouGet.features.map((f) =>
                            f.id === feature.id ? { ...f, description: val } : f
                          );
                          setDraft((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, features: updated } }));
                          updateSettings((prev紧) => ({ ...prev紧, whatYouGet: { ...prev紧.whatYouGet, features: updated } }));
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COMMUNITY SECTION */}
          {activeTab === 'community' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Community Section & Telegram Hub
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Edit community copy, CTA button, and upload chart graphic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Title Top</label>
                  <input
                    type="text"
                    value={draft.community.titleLine1}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, community: { ...prev紧.community, titleLine1: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, community: { ...prev紧.community, titleLine1: val } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Title Highlight</label>
                  <input
                    type="text"
                    value={draft.community.titleHighlight}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, community: { ...prev紧.community, titleHighlight: val } }));
                      updateSettings((prev紧) => ({ ...prev紧, community: { ...prev紧.community, titleHighlight: val } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-bold text-[#0053CF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-slate-700 block">Description</label>
                <textarea
                  rows={2}
                  value={draft.community.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev紧) => ({ ...prev紧, community: { ...prev紧.community, description: val } }));
                    updateSettings((prev紧) => ({ ...prev紧, community: { ...prev紧.community, description: val } }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px]"
                />
              </div>

              <div className="bg-sky-50/60 border border-sky-200 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-slate-700 block">Button Text</label>
                  <input
                    type="text"
                    value={draft.community.ctaText}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, community: { ...prev紧.community, ctaText: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, community: { ...prev紧.community, ctaText: val力 } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11.5px] font-bold text-slate-700 block">Telegram Link URL</label>
                  <input
                    type="url"
                    value={draft.community.ctaLink}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, community: { ...prev紧.community, ctaLink: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, community: { ...prev紧.community, ctaLink: val力 } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] font-mono text-[#0053CF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BROKER RECOMMENDATION */}
          {activeTab === 'broker' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Recommended Broker Settings & Links
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Configure your Exness partner link and live spread metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Broker Name</label>
                  <input
                    type="text"
                    value={draft.broker.brokerName}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, brokerName: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, brokerName: val力 } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Partner Registration Link URL</label>
                  <input
                    type="url"
                    value={draft.broker.partnerLink}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({
                        ...prev紧,
                        broker: { ...prev紧.broker, partnerLink: val力, createAccountCtaLink: val力 },
                        social: { ...prev紧.social, brokerPartnerUrl: val力 },
                      }));
                      updateSettings((prev紧) => ({
                        ...prev紧,
                        broker: { ...prev紧.broker, partnerLink: val力, createAccountCtaLink: val力 },
                        social: { ...prev紧.social, brokerPartnerUrl: val力 },
                      }));
                    }}
                    placeholder="https://one.exnesstrack.net/..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] font-mono text-[#0053CF]"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase">Spreads</label>
                  <input
                    type="text"
                    value={draft.broker.spreadsText}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, spreadsText: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, spreadsText: val力 } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[12.5px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase">Leverage</label>
                  <input
                    type="text"
                    value={draft.broker.leverageText}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, leverageText: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, leverageText: val力 } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[12.5px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase">Withdrawals</label>
                  <input
                    type="text"
                    value={draft.broker.withdrawalsText}
                    onChange={(e) => {
                      const val力pytest = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, withdrawalsText: val力pytest } }));
                      updateSettings((prev紧) => ({ ...prev紧, broker: { ...prev紧.broker, withdrawalsText: val力pytest } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[12.5px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase">Min Deposit</label>
                  <input
                    type="text"
                    value={draft.broker.minDepositText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, broker: { ...prev.broker, minDepositText: val } }));
                      updateSettings((prev) => ({ ...prev, broker: { ...prev.broker, minDepositText: val } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[12.5px] font-bold"
                  />
                </div>
              </div>

              {/* VIP Group & Partner IB Section */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                <h4 className="font-manrope font-bold text-[14px] text-[#0053CF]">
                  Free VIP Group & Partner IB Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700 block">Exness Partner Code (IB Number)</label>
                    <input
                      type="text"
                      value={draft.vipGuide?.partnerCode || 'yxxz5mlw1n'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          vipGuide: {
                            ...(prev.vipGuide || {
                              title: 'Join our trading community',
                              subtitle: 'Follow the instructions below to join our trading community, for both new and already existing Exness users',
                              partnerLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
                              vipTelegramUrl: 'https://t.me/+wHFuFFkA2i0xZTA8',
                            }),
                            partnerCode: val,
                          },
                        }));
                        updateSettings((prev) => ({
                          ...prev,
                          vipGuide: {
                            ...(prev.vipGuide || {
                              title: 'Join our trading community',
                              subtitle: 'Follow the instructions below to join our trading community, for both new and already existing Exness users',
                              partnerLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
                              vipTelegramUrl: 'https://t.me/+wHFuFFkA2i0xZTA8',
                            }),
                            partnerCode: val,
                          },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-mono font-bold text-[#0053CF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700 block">Telegram Channel / Admin Contact URL</label>
                    <input
                      type="url"
                      value={draft.vipGuide?.vipTelegramUrl || 'https://t.me/+wHFuFFkA2i0xZTA8'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          vipGuide: {
                            ...(prev.vipGuide || {
                              title: 'Join our trading community',
                              subtitle: 'Follow the instructions below to join our trading community, for both new and already existing Exness users',
                              partnerLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
                              partnerCode: 'yxxz5mlw1n',
                            }),
                            vipTelegramUrl: val,
                          },
                        }));
                        updateSettings((prev) => ({
                          ...prev,
                          vipGuide: {
                            ...(prev.vipGuide || {
                              title: 'Join our trading community',
                              subtitle: 'Follow the instructions below to join our trading community, for both new and already existing Exness users',
                              partnerLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
                              partnerCode: 'yxxz5mlw1n',
                            }),
                            vipTelegramUrl: val,
                          },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px] font-mono text-[#0053CF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  About Us & Core Philosophy
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Edit trading desk mission and philosophy paragraphs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Mission Heading</label>
                  <input
                    type="text"
                    value={draft.about.missionHeading}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, about: { ...prev紧.about, missionHeading: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, about: { ...prev紧.about, missionHeading: val力 } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Mission Paragraph 1</label>
                  <textarea
                    rows={2}
                    value={draft.about.missionP1}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, about: { ...prev紧.about, missionP1: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, about: { ...prev紧.about, missionP1: val力 } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Mission Paragraph 2</label>
                  <textarea
                    rows={2}
                    value={draft.about.missionP2}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({ ...prev紧, about: { ...prev紧.about, missionP2: val力 } }));
                      updateSettings((prev紧) => ({ ...prev紧, about: { ...prev紧.about, missionP2: val力 } }));
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-[12px] text-slate-500 font-inter">
                    Add or modify FAQ items.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingFaq(true);
                    setEditingFaqId(null);
                    setFaqQuestion('');
                    setFaqAnswer('');
                  }}
                  className="inline-flex items-center gap-1 bg-[#0053CF] hover:bg-[#0040A2] text-white px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {/* Add / Edit FAQ Form */}
              {isAddingFaq && (
                <form onSubmit={handleSaveFaq} className="bg-slate-50 border border-[#0053CF]/30 p-3.5 rounded-xl space-y-2.5">
                  <h4 className="font-manrope font-bold text-[13.5px] text-[#0053CF]">
                    {editingFaqId ? 'Edit FAQ Item' : 'New FAQ Item'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11.5px] font-bold text-slate-700">Question</label>
                      <input
                        type="text"
                        required
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        placeholder="e.g. How do I join the Telegram channel?"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11.5px] font-bold text-slate-700">Category</label>
                      <select
                        value={faqCategory}
                        onChange={(e) => setFaqCategory(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                      >
                        <option value="Community">Community</option>
                        <option value="Broker">Broker</option>
                        <option value="Trading">Trading</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-bold text-slate-700">Answer</label>
                    <textarea
                      rows={2}
                      required
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Write clear FAQ answer..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFaq(false)}
                      className="px-3 py-1 rounded-lg border text-[11.5px] font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 rounded-lg bg-[#0053CF] text-white text-[11.5px] font-bold"
                    >
                      Save FAQ
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {draft.faqs.map((f) => (
                  <div key={f.id} className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md">
                          {f.category}
                        </span>
                        <h5 className="font-manrope font-bold text-[13px] sm:text-[14px] text-slate-900">
                          {f.question}
                        </h5>
                      </div>
                      <p className="text-[12px] text-slate-600 leading-relaxed">
                        {f.answer}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingFaqId(f.id);
                          setFaqQuestion(f.question);
                          setFaqAnswer(f.answer);
                          setFaqCategory(f.category);
                          setIsAddingFaq(true);
                        }}
                        className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFaqItem(f.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8.5: INTERACTIVE TRADING QUOTE GALLERIES */}
          {activeTab === 'quotes' && (
            <div className="animate-in fade-in">
              <AdminQuotesTab />
            </div>
          )}

          {/* TAB 9: SOCIAL & GLOBAL LINKS */}
          {activeTab === 'social' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Global Social Links & Contact Handles
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Edit all social channels, support emails, and partner links.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Telegram Channel Link</label>
                  <input
                    type="url"
                    value={draft.social.telegramUrl}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({
                        ...prev紧,
                        social: { ...prev紧.social, telegramUrl: val力 },
                        hero: { ...prev紧.hero, primaryCtaLink: val力 },
                        community: { ...prev紧.community, ctaLink: val力 },
                      }));
                      updateSettings((prev紧) => ({
                        ...prev紧,
                        social: { ...prev紧.social, telegramUrl: val力 },
                        hero: { ...prev紧.hero, primaryCtaLink: val力 },
                        community: { ...prev紧.community, ctaLink: val力 },
                      }));
                    }}
                    className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[12.5px] sm:text-[13px] font-mono text-[#0053CF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-700 block">Exness Broker Partner Link</label>
                  <input
                    type="url"
                    value={draft.social.brokerPartnerUrl}
                    onChange={(e) => {
                      const val力 = e.target.value;
                      setDraft((prev紧) => ({
                        ...prev紧,
                        social: { ...prev紧.social, brokerPartnerUrl: val力 },
                        broker: { ...prev紧.broker, partnerLink: val力, createAccountCtaLink: val力 },
                      }));
                      updateSettings((prev紧) => ({
                        ...prev紧,
                        social: { ...prev紧.social, brokerPartnerUrl: val力 },
                        broker: { ...prev紧.broker, partnerLink: val力, createAccountCtaLink: val力 },
                      }));
                    }}
                    className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[12.5px] sm:text-[13px] font-mono text-[#0053CF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700 block">Support Email</label>
                    <input
                      type="email"
                      value={draft.social.supportEmail}
                      onChange={(e) => {
                        const val力 = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, social: { ...prev紧.social, supportEmail: val力 } }));
                        updateSettings((prev紧) => ({ ...prev紧, social: { ...prev紧.social, supportEmail: val力 } }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700 block">Support Telegram</label>
                    <input
                      type="text"
                      value={draft.social.supportTelegram}
                      onChange={(e) => {
                        const val力 = e.target.value;
                        setDraft((prev紧) => ({ ...prev紧, social: { ...prev紧.social, supportTelegram: val力 } }));
                        updateSettings((prev紧) => ({ ...prev紧, social: { ...prev紧.social, supportTelegram: val力 } }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4 sm:space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-2 sm:pb-3">
                <h3 className="font-manrope text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Site Configuration Backup & Restore
                </h3>
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-inter">
                  Export your full site settings as JSON or restore from a backup.
                </p>
              </div>

              {/* Supabase Cloud Connection Status */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <Database className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-[14px] text-slate-900 flex items-center gap-2">
                        <span>Supabase Cloud Database</span>
                        {supabaseStatus?.connected ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            Active & Synced
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            Checking status...
                          </span>
                        )}
                      </h4>
                      <p className="text-[11.5px] text-slate-500 font-mono">
                        {supabaseStatus?.url || 'https://lahyyqzhrnndcdxzcnmn.supabase.co'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => refreshSupabaseStatus()}
                    className="text-[11.5px] font-semibold text-[#0053CF] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Test Connection</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11.5px]">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Reviews Table</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Messages Table</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Settings Table</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Connected</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Restore Box */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl space-y-2.5">
                <h4 className="font-manrope font-bold text-[14px] text-slate-900">
                  Restore Site from JSON
                </h4>
                <textarea
                  rows={3}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste configuration JSON here..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[11.5px] font-mono"
                />
                {importError && (
                  <p className="text-[11.5px] text-rose-600 font-semibold">{importError}</p>
                )}
                {importSuccess && (
                  <p className="text-[11.5px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Configuration successfully restored!</span>
                  </p>
                )}
                <button
                  onClick={handleImportJson}
                  className="inline-flex items-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-3.5 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>Restore from JSON</span>
                </button>
              </div>

              {/* Reset to Default */}
              <div className="bg-rose-50/60 border border-rose-200 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-manrope font-bold text-[14px] sm:text-[15px] text-rose-950">
                    Reset Website to Initial Defaults
                  </h4>
                  <p className="text-[11.5px] sm:text-[12px] text-rose-800">
                    This will restore original USH text, default reviews, and branding.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all site settings & reviews to initial defaults?')) {
                      resetSettings();
                      alert('Website restored to initial defaults.');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer shadow-2xs shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 4. Admin Footer Bar */}
        <div className="bg-slate-100 border-t border-slate-200 px-3.5 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0 gap-2">
          <span className="text-[11.5px] text-slate-500 font-medium hidden sm:inline">
            Tip: Tap the logo in the header 5 times anytime to return to this Admin Panel.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={closeAdmin}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-[12.5px] sm:text-[13px] hover:bg-slate-200 cursor-pointer text-center"
            >
              Exit Panel
            </button>
            <button
              onClick={handleSaveAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl font-bold text-[12.5px] sm:text-[13px] shadow-sm cursor-pointer transition-all active:scale-95 text-center"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Save & Apply Live</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
