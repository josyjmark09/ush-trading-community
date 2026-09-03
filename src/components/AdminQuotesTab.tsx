import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { QuoteItem, QuoteGallerySettings } from '../types';
import { DEFAULT_QUOTE_GALLERY_1, DEFAULT_QUOTE_GALLERY_2 } from '../data/quotesData';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Search, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Quote, 
  SlidersHorizontal, 
  Layers
} from 'lucide-react';

export const AdminQuotesTab: React.FC = () => {
  const { 
    settings, 
    updateQuoteGallery1, 
    updateQuoteGallery2, 
    addQuoteToGallery, 
    deleteQuoteFromGallery, 
    updateQuoteInGallery 
  } = useSite();

  const [activeGalleryNum, setActiveGalleryNum] = useState<1 | 2>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form states for adding/editing quote
  const [formQuote, setFormQuote] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formNumber, setFormNumber] = useState<number>(0);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const galleryKey = activeGalleryNum === 1 ? 'quoteGallery1' : 'quoteGallery2';
  const defaultGallery = activeGalleryNum === 1 ? DEFAULT_QUOTE_GALLERY_1 : DEFAULT_QUOTE_GALLERY_2;
  const currentGallery: QuoteGallerySettings = settings[galleryKey] || defaultGallery;

  const handleHeadingChange = (field: 'sectionBadge' | 'title' | 'subtitle', value: string) => {
    if (activeGalleryNum === 1) {
      updateQuoteGallery1({ [field]: value });
    } else {
      updateQuoteGallery2({ [field]: value });
    }
  };

  const handleStartEdit = (quote: QuoteItem) => {
    setEditingQuoteId(quote.id);
    setFormQuote(quote.quote);
    setFormAuthor(quote.author);
    setFormCategory(quote.category || '');
    setFormNumber(quote.number || 0);
    setIsAddingNew(false);
  };

  const handleCancelForm = () => {
    setEditingQuoteId(null);
    setIsAddingNew(false);
    setFormQuote('');
    setFormAuthor('');
    setFormCategory('');
    setFormNumber(0);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuote.trim() || !formAuthor.trim()) {
      showToast('Please provide both quote text and author');
      return;
    }

    if (editingQuoteId) {
      updateQuoteInGallery(activeGalleryNum, editingQuoteId, {
        quote: formQuote.trim(),
        author: formAuthor.trim(),
        category: formCategory.trim() || undefined,
        number: formNumber || undefined,
      });
      showToast('Quote successfully updated!');
    } else {
      addQuoteToGallery(activeGalleryNum, {
        quote: formQuote.trim(),
        author: formAuthor.trim(),
        category: formCategory.trim() || undefined,
        number: formNumber || (currentGallery.quotes.length + 1),
      });
      showToast('New quote added to gallery!');
    }
    handleCancelForm();
  };

  const handleDelete = (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      deleteQuoteFromGallery(activeGalleryNum, quoteId);
      showToast('Quote removed from gallery.');
    }
  };

  const handleResetGallery = () => {
    if (window.confirm(`Reset Gallery ${activeGalleryNum} back to default institutional quotes?`)) {
      if (activeGalleryNum === 1) {
        updateQuoteGallery1(DEFAULT_QUOTE_GALLERY_1);
      } else {
        updateQuoteGallery2(DEFAULT_QUOTE_GALLERY_2);
      }
      showToast(`Gallery ${activeGalleryNum} restored to default quotes.`);
    }
  };

  const filteredQuotes = currentGallery.quotes.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.quote.toLowerCase().includes(term) ||
      q.author.toLowerCase().includes(term) ||
      (q.category && q.category.toLowerCase().includes(term)) ||
      (q.number && q.number.toString().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0053CF] text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Gallery Selector Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0053CF] font-inter text-[11px] font-bold uppercase tracking-wider mb-1">
              <Quote className="w-3.5 h-3.5" />
              <span>Quotes Management Engine</span>
            </div>
            <h3 className="font-manrope text-[18px] sm:text-[20px] font-black text-slate-900">
              Interactive Quote Galleries
            </h3>
            <p className="font-inter text-[13px] text-slate-600">
              Customize heading titles, badges, and manage individual quotes for both continuous auto-sliding galleries.
            </p>
          </div>

          {/* Switch Gallery Buttons */}
          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setActiveGalleryNum(1); handleCancelForm(); }}
              className={`px-3.5 py-2 rounded-lg font-inter text-[12.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGalleryNum === 1
                  ? 'bg-[#0053CF] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gallery 1 (Risk & Discipline)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveGalleryNum(2); handleCancelForm(); }}
              className={`px-3.5 py-2 rounded-lg font-inter text-[12.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGalleryNum === 2
                  ? 'bg-[#0053CF] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gallery 2 (Mindset & Creed)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section Headings Settings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0053CF]" />
            <h4 className="font-manrope text-[15px] sm:text-[16px] font-bold text-slate-900">
              Gallery {activeGalleryNum} Titles & Headings
            </h4>
          </div>
          <button
            type="button"
            onClick={handleResetGallery}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-500 hover:text-rose-600 font-semibold px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset to factory quotes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Gallery {activeGalleryNum}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
              Section Badge Text
            </label>
            <input
              type="text"
              value={currentGallery.sectionBadge || ''}
              onChange={(e) => handleHeadingChange('sectionBadge', e.target.value)}
              placeholder="e.g. WISDOM ON THE CHARTS"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
              Section Main Heading
            </label>
            <input
              type="text"
              value={currentGallery.title || ''}
              onChange={(e) => handleHeadingChange('title', e.target.value)}
              placeholder="e.g. 30 Timeless Trading Quotes..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
              Section Subtitle / Description
            </label>
            <input
              type="text"
              value={currentGallery.subtitle || ''}
              onChange={(e) => handleHeadingChange('subtitle', e.target.value)}
              placeholder="Brief introductory context..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
            />
          </div>
        </div>
      </div>

      {/* Quote Add/Edit Form Modal or Inline Card */}
      {(isAddingNew || editingQuoteId) && (
        <form 
          onSubmit={handleSaveQuote}
          className="bg-blue-50/50 border-2 border-[#0053CF]/30 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0053CF]" />
              <h4 className="font-manrope text-[15px] sm:text-[16px] font-bold text-slate-900">
                {editingQuoteId ? 'Edit Quote' : `Add New Quote to Gallery ${activeGalleryNum}`}
              </h4>
            </div>
            <button
              type="button"
              onClick={handleCancelForm}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-1.5">
              <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
                Quote Text <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formQuote}
                onChange={(e) => setFormQuote(e.target.value)}
                placeholder="Enter quote message..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-[14px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
                Author / Source <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder="e.g. Paul Tudor Jones"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
                Category / Principle Tag
              </label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Risk Control, Mindset"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-inter text-[12px] font-bold text-slate-700 uppercase tracking-wider block">
                Card Number #
              </label>
              <input
                type="number"
                value={formNumber || ''}
                onChange={(e) => setFormNumber(parseInt(e.target.value) || 0)}
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 text-[13px] font-semibold hover:bg-slate-200/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0053CF] hover:bg-[#0040A2] text-white text-[13px] font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingQuoteId ? 'Update Quote' : 'Add Quote'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Quotes List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h4 className="font-manrope text-[16px] font-black text-slate-900">
              Quotes in Gallery {activeGalleryNum}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-inter text-[11.5px] font-extrabold">
              {currentGallery.quotes.length} total
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search author, topic, quote..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-[12.5px] text-slate-900 focus:outline-none focus:border-[#0053CF]"
              />
            </div>

            {/* Add Quote Button */}
            {!isAddingNew && !editingQuoteId && (
              <button
                type="button"
                onClick={() => {
                  handleCancelForm();
                  setIsAddingNew(true);
                  setFormNumber(currentGallery.quotes.length + 1);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0053CF] hover:bg-[#0040A2] text-white text-[12.5px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quote</span>
              </button>
            )}
          </div>
        </div>

        {/* Quotes Table/Cards */}
        <div className="space-y-3">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-[13.5px] font-inter">
              No quotes match your search. Click "Add Quote" to create one.
            </div>
          ) : (
            filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {q.number !== undefined && (
                      <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-manrope text-[11px] font-black flex items-center justify-center shrink-0">
                        #{q.number}
                      </span>
                    )}
                    <span className="font-manrope text-[13.5px] font-black text-slate-900">
                      {q.author}
                    </span>
                    {q.category && (
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0053CF] border border-blue-100">
                        {q.category}
                      </span>
                    )}
                  </div>
                  <p className="font-inter text-[13px] text-slate-600 line-clamp-2 italic">
                    "{q.quote}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(q)}
                    className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-[#0053CF] hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit Quote"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Delete Quote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
