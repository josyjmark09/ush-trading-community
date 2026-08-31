import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  X, 
  Save, 
  RotateCcw, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Star, 
  ShieldCheck, 
  Send, 
  Globe, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  Sliders, 
  Download, 
  FileJson, 
  HelpCircle, 
  Info,
  Check,
  AlertCircle,
  Palette,
  Layers,
  Users,
  BookOpen,
  Database,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { ReviewItem, FAQItem, FeatureItem } from '../types';

const COUNTRIES_LIST = [
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
    exportSettingsJson,
    importSettingsJson,
  } = useSite();

  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'reviews' | 'features' | 'community' | 'broker' | 'about' | 'faqs' | 'social' | 'backup'>('branding');
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
  const [revCountry, setRevCountry] = useState(COUNTRIES_LIST[0]);
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

  if (!isAdminOpen) return null;

  const handleSaveAll = () => {
    updateSettings(draft);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo' | 'heroChart' | 'communityChart') => {
    const file不易 = e.target.files?.[0];
    if (!file不易) return;

    if (file不易.size > 5 * 1024 * 1024) {
      alert('File is larger than 5MB. Please choose a smaller image.');
      return;
    }

    const reader不易 = new FileReader();
    reader不易.onload = (loadEvent) => {
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
    reader不易.readAsDataURL(file不易);
  };

  const handleSaveNewReview = (e: React.FormEvent) => {
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
    const c = COUNTRIES_LIST.find((x) => x.code === item.countryCode || x.name === item.country) || COUNTRIES_LIST[0];
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

  const pendingCount不易 = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount不易 = reviews.filter((r) => r.status === 'approved').length;

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Admin Header Bar */}
        <div className="bg-gradient-to-r from-[#091C35] via-[#003B94] to-[#0053CF] text-white px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Sliders className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-manrope text-[18px] sm:text-[20px] font-extrabold tracking-tight">
                  USH Management & CMS Control Panel
                </h2>
                <span className="bg-sky-400/20 text-sky-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-sky-300/30">
                  Live Admin
                </span>
              </div>
              <p className="text-slate-300 text-[12px] font-inter">
                Edit branding, texts, images, CTA links, and moderate trader reviews in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={closeAdmin}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast */}
        {saveSuccessToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-center text-[13px] font-semibold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes successfully updated & saved to live website!</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 flex items-center gap-1.5 overflow-x-auto shrink-0 py-2.5 scrollbar-none">
          {[
            { id: 'branding', label: 'Branding & Logo', icon: Palette },
            { id: 'hero', label: 'Hero & CTAs', icon: Sparkles },
            { 
              id: 'reviews', 
              label: `Reviews ${pendingCount不易 > 0 ? `(${pendingCount不易} Pending)` : `(${approvedCount不易})`}`, 
              icon: Star,
              highlight: pendingCount不易 > 0 
            },
            { id: 'features', label: 'What You Get', icon: Layers },
            { id: 'community', label: 'Community', icon: Users },
            { id: 'broker', label: 'Broker Setup', icon: ShieldCheck },
            { id: 'about', label: 'About & Pillars', icon: BookOpen },
            { id: 'faqs', label: 'FAQs', icon: HelpCircle },
            { id: 'social', label: 'Links & Socials', icon: LinkIcon },
            { id: 'backup', label: 'Backup & Reset', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-[12.5px] sm:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#0053CF] text-white shadow-xs'
                    : tab.highlight
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === tab.id ? 'text-white' : tab.highlight ? 'text-amber-800' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800">
          
          {/* TAB 1: BRANDING & LOGO */}
          {activeTab === 'branding' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  Logo & Brand Identity
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Customize the brand name, tagline, and upload your custom logo image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Brand Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Top Left Brand Name
                  </label>
                  <input
                    type="text"
                    value={draft.branding.brandName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, branding: { ...prev.branding, brandName: val } }));
                      updateSettings((prev) => ({ ...prev, branding: { ...prev.branding, brandName: val } }));
                    }}
                    placeholder="e.g. USH"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[14px] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                  />
                  <p className="text-[11.5px] text-slate-400">Currently set to "{draft.branding.brandName}" next to the logo.</p>
                </div>

                {/* Brand Tagline Input */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Sub-tagline under Brand Name
                  </label>
                  <input
                    type="text"
                    value={draft.branding.tagline}
                    onChange={(e) => {
                      const val不易 = e.target.value;
                      setDraft((prev) => ({ ...prev, branding: { ...prev.branding, tagline: val不易 } }));
                      updateSettings((prev) => ({ ...prev, branding: { ...prev.branding, tagline: val不易 } }));
                    }}
                    placeholder="e.g. COMMUNITY OF TRADERS"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[14px] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                  />
                  <p className="text-[11.5px] text-slate-400">Small uppercase badge under the logo name.</p>
                </div>
              </div>

              {/* Logo Management */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-manrope font-bold text-[15px] text-slate-900">
                      Website Logo Graphic
                    </h4>
                    <p className="text-[12.5px] text-slate-500">
                      Upload a new logo file (PNG, SVG, JPG, WebP) or paste an image URL.
                    </p>
                  </div>
                  {draft.branding.logoUrl && (
                    <button
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: '' } }));
                        updateSettings((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: '' } }));
                      }}
                      className="text-[12px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Reset to Default Logo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                  {/* Current Logo Preview */}
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-200 p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                    {draft.branding.logoUrl ? (
                      <img
                        src={draft.branding.logoUrl}
                        alt="Brand Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0053CF] font-extrabold text-[14px]">
                        Default SVG
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    {/* File Upload Button */}
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all shadow-xs active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Upload New Logo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, 'logo')}
                        />
                      </label>
                      <span className="text-[12px] text-slate-400">PNG, SVG, JPG (Max 5MB)</span>
                    </div>

                    {/* Or URL Input */}
                    <div className="space-y-1">
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          placeholder="Or paste direct image URL (https://...)"
                          value={draft.branding.logoUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: val } }));
                            updateSettings((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: val } }));
                          }}
                          className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO SECTION & CTA BUTTONS */}
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  Hero Section Text & CTA Buttons
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Edit all hero text and configure the exact links for the "Join Free Telegram" & "Broker Access" buttons.
                </p>
              </div>

              {/* Badge & Headings */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 block">
                      Hero Badge Pill Text
                    </label>
                    <input
                      type="text"
                      value={draft.hero.badgeText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, badgeText: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, badgeText: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 block">
                      Badge Subtext (Community / Partner note)
                    </label>
                    <input
                      type="text"
                      value={draft.hero.badgeSubtext || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, badgeSubtext: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, badgeSubtext: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 block">
                      Hero Main Title (Top Line)
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headingLine1}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, headingLine1: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, headingLine1: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 block">
                      Hero Main Title (Highlighted Bottom Line)
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headingLine2}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, headingLine2: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, headingLine2: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter font-bold text-[#0053CF] focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Hero Subtitle / Description Text
                  </label>
                  <textarea
                    rows={3}
                    value={draft.hero.subtitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: val } }));
                      updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                  />
                </div>
              </div>

              {/* Primary CTA Slot (Telegram) */}
              <div className="bg-sky-50/60 border border-sky-200 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[#0053CF]">
                  <Send className="w-4 h-4" />
                  <h4 className="font-manrope font-bold text-[15px]">
                    Primary CTA Button ("Join Telegram")
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12.5px] font-bold text-slate-700 block">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={draft.hero.primaryCtaText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaText: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaText: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12.5px] font-bold text-slate-700 block">
                      Destination Link URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        placeholder="https://t.me/yourchannel"
                        value={draft.hero.primaryCtaLink}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaLink: val } }));
                          updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaLink: val } }));
                        }}
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-mono text-[#0053CF] focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary CTA Slot (Broker Access) */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-manrope font-bold text-[15px]">
                    Secondary CTA Button ("Broker Setup / Custom")
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12.5px] font-bold text-slate-700 block">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={draft.hero.secondaryCtaText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaText: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaText: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-inter font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12.5px] font-bold text-slate-700 block">
                      Destination Link URL (or page anchor)
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="https://one.exnesstrack.net/... or #broker"
                        value={draft.hero.secondaryCtaLink}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaLink: val } }));
                          updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaLink: val } }));
                        }}
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-mono text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Showcase Chart Image */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-manrope font-bold text-[15px] text-slate-900">
                      Hero Chart / Showcase Image
                    </h4>
                    <p className="text-[12.5px] text-slate-500">
                      Change the main trading chart graphic displayed beneath the hero section.
                    </p>
                  </div>
                  {draft.hero.chartImageUrl && (
                    <button
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, chartImageUrl: '' } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, chartImageUrl: '' } }));
                      }}
                      className="text-[12px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Reset to Default Chart Image
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all shadow-xs active:scale-95 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload New Chart Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'heroChart')}
                    />
                  </label>
                  <div className="flex-1 w-full">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL"
                      value={draft.hero.chartImageUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, hero: { ...prev.hero, chartImageUrl: val } }));
                        updateSettings((prev) => ({ ...prev, hero: { ...prev.hero, chartImageUrl: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter focus:outline-hidden focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEW MODERATION & APPROVAL */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                    Trader Review Moderation & Management
                  </h3>
                  <p className="text-[13px] text-slate-500 font-inter">
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
                  className="inline-flex items-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Verified Review</span>
                </button>
              </div>

              {/* Moderation Settings Switch */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-bold text-[14.5px] text-amber-950">
                      Review Approval Workflow
                    </h4>
                    <p className="text-[12.5px] text-amber-800 font-inter">
                      {draft.moderation.requireReviewApproval
                        ? 'STRICT MODE: User reviews are stored as "Pending" until you manually review & approve them.'
                        : 'INSTANT MODE: User reviews immediately publish and appear live on the site as soon as they submit.'}
                    </p>
                  </div>
                </div>

                {/* Switch Control */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[12.5px] font-bold text-slate-700">
                    {draft.moderation.requireReviewApproval ? 'Require Approval' : 'Auto-Approve'}
                  </span>
                  <button
                    onClick={() => {
                      const newVal = !draft.moderation.requireReviewApproval;
                      setDraft((prev) => ({
                        ...prev,
                        moderation: { ...prev.moderation, requireReviewApproval: newVal },
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
                <form onSubmit={handleSaveNewReview} className="bg-slate-50 border-2 border-[#0053CF]/30 p-5 rounded-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h4 className="font-manrope font-bold text-[15px] text-[#0053CF] flex items-center gap-2">
                      {editingReviewId ? (
                        <>
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Review Details</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Create New Verified Review</span>
                        </>
                      )}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="text-slate-400 hover:text-slate-600 text-[13px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-700">Trader Name</label>
                      <input
                        type="text"
                        required
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        placeholder="e.g. Marcus Sterling"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-inter focus:ring-2 focus:ring-[#0053CF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-700">Country</label>
                      <select
                        value={revCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES_LIST.find((c) => c.code === e.target.value) || COUNTRIES_LIST[0];
                          setRevCountry(found);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-inter focus:ring-2 focus:ring-[#0053CF]"
                      >
                        {COUNTRIES_LIST.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name} ({c.code.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-700">Status</label>
                      <select
                        value={revStatus}
                        onChange={(e) => setRevStatus(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-inter font-bold text-slate-800 focus:ring-2 focus:ring-[#0053CF]"
                      >
                        <option value="approved">Approved (Visible)</option>
                        <option value="pending">Pending (Hidden)</option>
                        <option value="rejected">Rejected (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRevRating(star)}
                          className="cursor-pointer p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= revRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[12px] text-slate-500 font-semibold ml-2">
                        {revRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700">Review Content / Testimonial</label>
                    <textarea
                      rows={3}
                      required
                      value={revContent}
                      onChange={(e) => setRevContent(e.target.value)}
                      placeholder="Write the trader review feedback..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-inter focus:ring-2 focus:ring-[#0053CF]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-600 text-[13px] font-medium hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-xl bg-[#0053CF] hover:bg-[#0040A2] text-white text-[13px] font-bold shadow-xs cursor-pointer"
                    >
                      {editingReviewId ? 'Save Edits' : 'Publish Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* Review Filter Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: `All Reviews (${reviews.length})` },
                    { id: 'pending', label: `Pending Approval (${pendingCount不易})` },
                    { id: 'approved', label: `Approved & Live (${approvedCount不易})` },
                    { id: 'rejected', label: `Rejected` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setReviewFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                        reviewFilter === f.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[13px] font-medium text-slate-500">
                      No reviews found in this filter category.
                    </p>
                  </div>
                ) : (
                  filteredReviews.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.status === 'pending'
                          ? 'bg-amber-50/70 border-amber-300'
                          : item.status === 'rejected'
                          ? 'bg-rose-50/50 border-rose-200 opacity-75'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-manrope font-bold text-[14px] text-slate-900">
                            {item.name}
                          </span>
                          {item.country && (
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {item.country}
                            </span>
                          )}
                          <div className="flex items-center text-amber-400">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'pending'
                                ? 'bg-amber-200 text-amber-900 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[12.5px] text-slate-600 italic font-inter leading-relaxed line-clamp-2">
                          "{item.content}"
                        </p>
                        {item.submittedAt && (
                          <span className="text-[10.5px] text-slate-400 block">
                            Submitted on: {item.submittedAt}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.status !== 'approved' && (
                          <button
                            onClick={() => approveReview(item.id)}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-[12px] font-bold shadow-xs cursor-pointer transition-all"
                            title="Approve & Show Live"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {item.status === 'approved' && (
                          <button
                            onClick={() => rejectReview(item.id)}
                            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-[12px] font-bold shadow-xs cursor-pointer transition-all"
                            title="Unpublish"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Unpublish</span>
                          </button>
                        )}
                        <button
                          onClick={() => startEditReview(item)}
                          className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete review from "${item.name}"?`)) {
                              deleteReview(item.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WHAT YOU GET FEATURES (CLEAN INFO DISPLAY) */}
          {activeTab === 'features' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  "What You Get" Informational Cards
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Edit the informational text inside each feature card. Cards display clean, complete information without nested redirect buttons.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Section Badge</label>
                  <input
                    type="text"
                    value={draft.whatYouGet.sectionBadge}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, sectionBadge: val } }));
                      updateSettings((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, sectionBadge: val } }));
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Section Title</label>
                  <input
                    type="text"
                    value={draft.whatYouGet.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, title: val } }));
                      updateSettings((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, title: val } }));
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-bold"
                  />
                </div>
              </div>

              {/* 4 Feature Items */}
              <div className="space-y-4 pt-2">
                {draft.whatYouGet.features.map((feature, idx) => (
                  <div key={feature.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-extrabold text-[#0053CF] uppercase">
                        Card #{idx + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-slate-700">Card Title</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = draft.whatYouGet.features.map((f) =>
                              f.id === feature.id ? { ...f, title: val } : f
                            );
                            setDraft((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, features: updated } }));
                            updateSettings((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, features: updated } }));
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-slate-700">Icon</label>
                        <select
                          value={feature.icon}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = draft.whatYouGet.features.map((f) =>
                              f.id === feature.id ? { ...f, icon: val } : f
                            );
                            setDraft((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, features: updated } }));
                            updateSettings((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, features: updated } }));
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px]"
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
                      <label className="text-[12px] font-bold text-slate-700">Detailed Information Description</label>
                      <textarea
                        rows={2}
                        value={feature.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated深受 = draft.whatYouGet.features.map((f) =>
                            f.id === feature.id ? { ...f, description: val } : f
                          );
                          setDraft((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, features: updated深受 } }));
                          updateSettings((prev) => ({ ...prev, whatYouGet: { ...prev.whatYouGet, features: updated深受 } }));
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px] leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COMMUNITY SECTION */}
          {activeTab === 'community' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  Community Section & Telegram Hub
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Edit community copy, bullet points, CTA button, and upload community graphic.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Title Line 1
                  </label>
                  <input
                    type="text"
                    value={draft.community.titleLine1}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, community: { ...prev.community, titleLine1: val } }));
                      updateSettings((prev) => ({ ...prev, community: { ...prev.community, titleLine1: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Title Highlight Line
                  </label>
                  <input
                    type="text"
                    value={draft.community.titleHighlight}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, community: { ...prev.community, titleHighlight: val } }));
                      updateSettings((prev) => ({ ...prev, community: { ...prev.community, titleHighlight: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-bold text-[#0053CF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={draft.community.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev) => ({ ...prev, community: { ...prev.community, description: val } }));
                    updateSettings((prev) => ({ ...prev, community: { ...prev.community, description: val } }));
                  }}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px]"
                />
              </div>

              {/* Community CTA Button & Link */}
              <div className="bg-sky-50/60 border border-sky-200 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700 block">
                    Community Button Text
                  </label>
                  <input
                    type="text"
                    value={draft.community.ctaText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, community: { ...prev.community, ctaText: val } }));
                      updateSettings((prev) => ({ ...prev, community: { ...prev.community, ctaText: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-bold text-slate-700 block">
                    Telegram Link URL
                  </label>
                  <input
                    type="url"
                    value={draft.community.ctaLink}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, community: { ...prev.community, ctaLink: val } }));
                      updateSettings((prev) => ({ ...prev, community: { ...prev.community, ctaLink: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13px] font-mono text-[#0053CF]"
                  />
                </div>
              </div>

              {/* Community Image Upload */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-manrope font-bold text-[14px] text-slate-900">
                    Community Section Graphic / Chart
                  </h4>
                  {draft.community.chartImageUrl && (
                    <button
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, community: { ...prev.community, chartImageUrl: '' } }));
                        updateSettings((prev) => ({ ...prev, community: { ...prev.community, chartImageUrl: '' } }));
                      }}
                      className="text-[12px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Reset Image
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex items-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer transition-all shadow-xs active:scale-95 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'communityChart')}
                    />
                  </label>
                  <input
                    type="url"
                    placeholder="Or paste direct image URL"
                    value={draft.community.chartImageUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, community: { ...prev.community, chartImageUrl: val } }));
                      updateSettings((prev) => ({ ...prev, community: { ...prev.community, chartImageUrl: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BROKER RECOMMENDATION */}
          {activeTab === 'broker' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  Recommended Broker Settings & Links
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Configure your Exness partner link, account creation CTA, and live spread metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Broker Name
                  </label>
                  <input
                    type="text"
                    value={draft.broker.brokerName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, broker: { ...prev.broker, brokerName: val } }));
                      updateSettings((prev) => ({ ...prev, broker: { ...prev.broker, brokerName: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">
                    Partner Registration Link URL
                  </label>
                  <input
                    type="url"
                    value={draft.broker.partnerLink}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        broker: { ...prev.broker, partnerLink: val, createAccountCtaLink: val },
                        social: { ...prev.social, brokerPartnerUrl: val },
                      }));
                      updateSettings((prev) => ({
                        ...prev,
                        broker: { ...prev.broker, partnerLink: val, createAccountCtaLink: val },
                        social: { ...prev.social, brokerPartnerUrl: val },
                      }));
                    }}
                    placeholder="https://one.exnesstrack.net/a/c_iun6m90d5o"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-mono text-[#0053CF]"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Spreads</label>
                  <input
                    type="text"
                    value={draft.broker.spreadsText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, broker: { ...prev.broker, spreadsText: val } }));
                      updateSettings((prev) => ({ ...prev, broker: { ...prev.broker, spreadsText: val } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Leverage</label>
                  <input
                    type="text"
                    value={draft.broker.leverageText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, broker: { ...prev.broker, leverageText: val } }));
                      updateSettings((prev) => ({ ...prev, broker: { ...prev.broker, leverageText: val } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Withdrawals</label>
                  <input
                    type="text"
                    value={draft.broker.withdrawalsText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, broker: { ...prev.broker, withdrawalsText: val } }));
                      updateSettings((prev) => ({ ...prev, broker: { ...prev.broker, withdrawalsText: val } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Min Deposit</label>
                  <input
                    type="text"
                    value={draft.broker.minDepositText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, broker: { ...prev.broker, minDepositText: val } }));
                      updateSettings((prev) => ({ ...prev, broker: { ...prev.broker, minDepositText: val } }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[13px] font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  About Us & Core Philosophy
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Edit trading desk mission, leadership title, and core philosophy pillars.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">Mission Heading</label>
                  <input
                    type="text"
                    value={draft.about.missionHeading}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, about: { ...prev.about, missionHeading: val } }));
                      updateSettings((prev) => ({ ...prev, about: { ...prev.about, missionHeading: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">Mission Paragraph 1</label>
                  <textarea
                    rows={2}
                    value={draft.about.missionP1}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, about: { ...prev.about, missionP1: val } }));
                      updateSettings((prev) => ({ ...prev, about: { ...prev.about, missionP1: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">Mission Paragraph 2</label>
                  <textarea
                    rows={2}
                    value={draft.about.missionP2}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({ ...prev, about: { ...prev.about, missionP2: val } }));
                      updateSettings((prev) => ({ ...prev, about: { ...prev.about, missionP2: val } }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                    Frequently Asked Questions (FAQs)
                  </h3>
                  <p className="text-[13px] text-slate-500 font-inter">
                    Add, edit, or remove FAQ questions and answers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingFaq(true);
                    setEditingFaqId(null);
                    setFaqQuestion('');
                    setFaqAnswer('');
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-3.5 py-1.5 rounded-xl text-[12.5px] font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {/* Add / Edit FAQ Form */}
              {isAddingFaq && (
                <form onSubmit={handleSaveFaq} className="bg-slate-50 border border-[#0053CF]/30 p-4 rounded-2xl space-y-3">
                  <h4 className="font-manrope font-bold text-[14px] text-[#0053CF]">
                    {editingFaqId ? 'Edit FAQ Item' : 'New FAQ Item'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[12px] font-bold text-slate-700">Question</label>
                      <input
                        type="text"
                        required
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        placeholder="e.g. How do I join the Telegram channel?"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-700">Category</label>
                      <select
                        value={faqCategory}
                        onChange={(e) => setFaqCategory(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[13px]"
                      >
                        <option value="Community">Community</option>
                        <option value="Broker">Broker</option>
                        <option value="Trading">Trading</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700">Answer</label>
                    <textarea
                      rows={3}
                      required
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Write the clear FAQ answer..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[13px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFaq(false)}
                      className="px-3 py-1 rounded-lg border text-[12px] font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded-lg bg-[#0053CF] text-white text-[12px] font-bold"
                    >
                      Save FAQ
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {draft.faqs.map((f) => (
                  <div key={f.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                          {f.category}
                        </span>
                        <h5 className="font-manrope font-bold text-[14px] text-slate-900">
                          {f.question}
                        </h5>
                      </div>
                      <p className="text-[13px] text-slate-600 leading-relaxed">
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
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFaqItem(f.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SOCIAL & GLOBAL LINKS */}
          {activeTab === 'social' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  Global Social Links & Contact Handles
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Edit all social media channels, support emails, and partner links site-wide.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">Telegram Channel Link</label>
                  <input
                    type="url"
                    value={draft.social.telegramUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        social: { ...prev.social, telegramUrl: val },
                        hero: { ...prev.hero, primaryCtaLink: val },
                        community: { ...prev.community, ctaLink: val },
                      }));
                      updateSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, telegramUrl: val },
                        hero: { ...prev.hero, primaryCtaLink: val },
                        community: { ...prev.community, ctaLink: val },
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-mono text-[#0053CF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 block">Exness Broker Partner Link</label>
                  <input
                    type="url"
                    value={draft.social.brokerPartnerUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        social: { ...prev.social, brokerPartnerUrl: val },
                        broker: { ...prev.broker, partnerLink: val, createAccountCtaLink: val },
                      }));
                      updateSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, brokerPartnerUrl: val },
                        broker: { ...prev.broker, partnerLink: val, createAccountCtaLink: val },
                      }));
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px] font-mono text-[#0053CF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 block">Support Email</label>
                    <input
                      type="email"
                      value={draft.social.supportEmail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, social: { ...prev.social, supportEmail: val } }));
                        updateSettings((prev) => ({ ...prev, social: { ...prev.social, supportEmail: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 block">Support Telegram</label>
                    <input
                      type="text"
                      value={draft.social.supportTelegram}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, social: { ...prev.social, supportTelegram: val } }));
                        updateSettings((prev) => ({ ...prev, social: { ...prev.social, supportTelegram: val } }));
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[13.5px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700">Twitter / X URL</label>
                    <input
                      type="url"
                      value={draft.social.twitterUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, social: { ...prev.social, twitterUrl: val } }));
                        updateSettings((prev) => ({ ...prev, social: { ...prev.social, twitterUrl: val } }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700">YouTube URL</label>
                    <input
                      type="url"
                      value={draft.social.youtubeUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, social: { ...prev.social, youtubeUrl: val } }));
                        updateSettings((prev) => ({ ...prev, social: { ...prev.social, youtubeUrl: val } }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-700">Instagram URL</label>
                    <input
                      type="url"
                      value={draft.social.instagramUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({ ...prev, social: { ...prev.social, instagramUrl: val } }));
                        updateSettings((prev) => ({ ...prev, social: { ...prev.social, instagramUrl: val } }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[12.5px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: BACKUP & RESTORE & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                  Data Backup, Export & Reset
                </h3>
                <p className="text-[13px] text-slate-500 font-inter">
                  Export your complete site configuration as JSON, restore backups, or reset to original defaults.
                </p>
              </div>

              {/* Export JSON */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-manrope font-bold text-[15px] text-slate-900">
                      Export Configuration JSON
                    </h4>
                    <p className="text-[12.5px] text-slate-500">
                      Download or copy your complete settings & reviews backup.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const jsonStr = exportSettingsJson();
                      navigator.clipboard.writeText(jsonStr);
                      alert('Configuration JSON copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-[12.5px] font-bold cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Copy JSON to Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Import JSON */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <h4 className="font-manrope font-bold text-[15px] text-slate-900">
                  Import Configuration JSON
                </h4>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste your exported configuration JSON here..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-[12px] font-mono"
                />
                {importError && (
                  <p className="text-[12px] text-rose-600 font-semibold">{importError}</p>
                )}
                {importSuccess && (
                  <p className="text-[12px] text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Configuration successfully restored!</span>
                  </p>
                )}
                <button
                  onClick={handleImportJson}
                  className="inline-flex items-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-4 py-2 rounded-xl text-[12.5px] font-bold cursor-pointer"
                >
                  <FileJson className="w-4 h-4" />
                  <span>Restore from JSON</span>
                </button>
              </div>

              {/* Reset to Default */}
              <div className="bg-rose-50/60 border border-rose-200 p-5 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-manrope font-bold text-[15px] text-rose-950">
                    Reset Website to Initial Factory Defaults
                  </h4>
                  <p className="text-[12.5px] text-rose-800">
                    This will restore original USH text, default reviews, and original branding.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all site settings & reviews to original factory defaults?')) {
                      resetSettings();
                      alert('Website restored to initial defaults.');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-[12.5px] font-bold cursor-pointer shadow-xs shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Admin Footer Bar */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
          <span className="text-[12px] text-slate-500 font-medium hidden sm:inline">
            Tip: Tap the logo in the header 5 times anytime to return to this Admin Panel.
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={closeAdmin}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-200 cursor-pointer"
            >
              Exit Panel
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-[13px] shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Live</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
