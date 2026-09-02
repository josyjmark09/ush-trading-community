import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  Inbox, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare,
  AlertCircle,
  Plus,
  X,
  FileText,
  User,
  Hash,
  Send
} from 'lucide-react';
import { InboxMessage } from '../types';

export const AdminInboxTab: React.FC = () => {
  const { 
    messages, 
    markMessageRead, 
    updateMessageStatus, 
    deleteMessage, 
    addAdminNote, 
    addInboxMessage,
    clearAllMessages 
  } = useSite();

  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Manual log new message modal state
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    email: '',
    topic: 'VIP Access Request',
    accountId: '',
    message: '',
  });

  const handleCopyText = (text: string, type: 'id' | 'email', itemKey: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(itemKey);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedEmail(itemKey);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  const handleSaveNote = (id: string) => {
    addAdminNote(id, noteText);
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleCreateManualMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.message.trim()) return;

    addInboxMessage({
      name: manualForm.name.trim(),
      email: manualForm.email.trim() || 'telegram_inquiry@direct.user',
      topic: manualForm.topic,
      accountId: manualForm.accountId.trim(),
      message: manualForm.message.trim(),
      source: 'admin_support',
      status: 'new',
    });

    setIsAddingManual(false);
    setManualForm({
      name: '',
      email: '',
      topic: 'VIP Access Request',
      accountId: '',
      message: '',
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const inProgressCount = messages.filter((m) => m.status === 'in_progress').length;
  const resolvedCount = messages.filter((m) => m.status === 'resolved').length;

  const filteredMessages = messages.filter((m) => {
    if (filter === 'new' && m.status !== 'new' && m.read) return false;
    if (filter === 'in_progress' && m.status !== 'in_progress') return false;
    if (filter === 'resolved' && m.status !== 'resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchId = m.accountId?.toLowerCase().includes(q);
      const matchTopic = m.topic?.toLowerCase().includes(q);
      const matchMsg = m.message?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchTopic && !matchMsg) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl animate-in fade-in pb-8">
      {/* 1. Header Bar & Quick Stats */}
      <div className="border-b border-slate-200 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-manrope text-[17px] sm:text-[20px] font-bold text-slate-900">
              Customer Care & VIP Support Inbox
            </h3>
            {unreadCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-[12.5px] sm:text-[13px] text-slate-500 font-inter mt-0.5">
            All customer inquiries, VIP registration requests, and broker account verification requests.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddingManual(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-lg text-[12px] font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Request</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div 
          onClick={() => setFilter('all')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            filter === 'all' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${filter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              Total
            </span>
            <Inbox className="w-4 h-4 opacity-70" />
          </div>
          <p className="text-[20px] sm:text-[24px] font-black font-manrope mt-1">
            {messages.length}
          </p>
        </div>

        <div 
          onClick={() => setFilter('new')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            filter === 'new' 
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
              : 'bg-amber-50/70 border-amber-200 hover:border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${filter === 'new' ? 'text-amber-100' : 'text-amber-700'}`}>
              New / Unread
            </span>
            <AlertCircle className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-[20px] sm:text-[24px] font-black font-manrope mt-1">
            {unreadCount}
          </p>
        </div>

        <div 
          onClick={() => setFilter('in_progress')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            filter === 'in_progress' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
              : 'bg-blue-50/70 border-blue-200 hover:border-blue-300 text-blue-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${filter === 'in_progress' ? 'text-blue-100' : 'text-blue-700'}`}>
              In Progress
            </span>
            <Clock className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-[20px] sm:text-[24px] font-black font-manrope mt-1">
            {inProgressCount}
          </p>
        </div>

        <div 
          onClick={() => setFilter('resolved')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            filter === 'resolved' 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
              : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${filter === 'resolved' ? 'text-emerald-100' : 'text-emerald-700'}`}>
              Resolved
            </span>
            <CheckCircle2 className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-[20px] sm:text-[24px] font-black font-manrope mt-1">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, Exness ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[12.5px] font-inter focus:outline-hidden focus:border-[#0053CF]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'in_progress', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                filter === f
                  ? 'bg-[#0053CF] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'new' ? 'New' : f === 'in_progress' ? 'In Progress' : 'Resolved'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="font-manrope font-bold text-[16px] text-slate-800">
            No Messages Found
          </h4>
          <p className="text-[13px] text-slate-500 font-inter max-w-sm mx-auto">
            {searchQuery
              ? `No inquiries match "${searchQuery}". Try clearing the search query.`
              : `There are currently no messages under the "${filter}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isUnread = !msg.read;
            const isEditingNote = editingNoteId === msg.id;

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-xl sm:rounded-2xl border transition-all p-4 sm:p-5 shadow-xs ${
                  isUnread
                    ? 'border-blue-400/80 bg-blue-50/20 ring-1 ring-blue-400/30'
                    : 'border-slate-200'
                }`}
              >
                {/* Top Row: Sender Info & Status Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-[#0053CF] flex items-center justify-center font-bold text-[13px] shrink-0">
                      {msg.name?.slice(0, 2).toUpperCase() || 'TR'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-manrope font-extrabold text-[14.5px] sm:text-[15.5px] text-slate-900 leading-tight">
                          {msg.name}
                        </h4>

                        {/* Status Select */}
                        <select
                          value={msg.status}
                          onChange={(e) => updateMessageStatus(msg.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer border ${
                            msg.status === 'new'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : msg.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>

                        {/* Source Pill */}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {msg.source === 'vip_onboarding' ? 'VIP Onboarding' : 'Support Desk'}
                        </span>
                      </div>

                      {/* Contact row */}
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-inter mt-1 flex-wrap">
                        <span className="font-mono text-slate-700">{msg.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.email, 'email', msg.id)}
                          className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedEmail === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <span>•</span>
                        <span className="text-[11px] text-slate-400">{msg.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Exness Account ID and Quick Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {msg.accountId && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 text-[11.5px] font-mono text-slate-900">
                        <Hash className="w-3 h-3 text-slate-500" />
                        <span className="font-bold">{msg.accountId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.accountId!, 'id', msg.id)}
                          className="text-slate-500 hover:text-[#0053CF] ml-0.5 cursor-pointer"
                          title="Copy Exness Account ID"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        `[USH Support] Regarding your request: ${msg.topic || 'Inquiry'}`
                      )}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-md text-[11.5px] font-bold transition-colors cursor-pointer"
                      title="Reply via Email"
                    >
                      <Mail className="w-3 h-3" />
                      <span className="hidden xs:inline">Reply</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => markMessageRead(msg.id, !msg.read)}
                      className={`px-2 py-1 rounded-md text-[11.5px] font-semibold border transition-colors cursor-pointer ${
                        msg.read
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300'
                      }`}
                      title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.read ? 'Mark Unread' : 'Mark Read'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete message from ${msg.name}?`)) {
                          deleteMessage(msg.id);
                        }
                      }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Middle: Topic & Message Body */}
                <div className="pt-3 space-y-2">
                  {msg.topic && (
                    <div className="inline-block">
                      <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200">
                        Topic: {msg.topic}
                      </span>
                    </div>
                  )}

                  <p className="text-[13px] sm:text-[13.5px] text-slate-800 font-inter leading-relaxed whitespace-pre-line bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    {msg.message}
                  </p>
                </div>

                {/* Bottom: Internal Admin Notes */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                  <div className="flex-1 min-w-0">
                    {isEditingNote ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add internal action notes (e.g. VIP access granted on TG)..."
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-[12px] font-inter focus:outline-hidden focus:border-[#0053CF]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveNote(msg.id);
                            if (e.key === 'Escape') setEditingNoteId(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNote(msg.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11.5px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-500">Admin Note:</span>
                        <span className="italic text-slate-700 truncate">
                          {msg.adminNotes || 'No notes added yet.'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(msg.id);
                            setNoteText(msg.adminNotes || '');
                          }}
                          className="text-[#0053CF] hover:underline font-bold text-[11.5px] ml-1 cursor-pointer"
                        >
                          {msg.adminNotes ? 'Edit Note' : '+ Add Note'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Manual Log Modal */}
      {isAddingManual && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-soft-fade">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-300 relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0053CF] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-manrope font-bold text-[16px] text-slate-900">
                  Log Customer Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingManual(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualMessage} className="space-y-3 font-inter">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">
                  Customer / Trader Name
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-hidden focus:border-[#0053CF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    placeholder="trader@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-hidden focus:border-[#0053CF]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">
                    Exness Account ID
                  </label>
                  <input
                    type="text"
                    value={manualForm.accountId}
                    onChange={(e) => setManualForm({ ...manualForm, accountId: e.target.value })}
                    placeholder="e.g. 1928374"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-hidden focus:border-[#0053CF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">
                  Topic
                </label>
                <select
                  value={manualForm.topic}
                  onChange={(e) => setManualForm({ ...manualForm, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-hidden focus:border-[#0053CF]"
                >
                  <option value="VIP Access Request">VIP Access Request</option>
                  <option value="Broker IB Change / Setup">Broker IB Change / Setup</option>
                  <option value="Deposit & Verification Help">Deposit & Verification Help</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">
                  Request / Inquiry Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={manualForm.message}
                  onChange={(e) => setManualForm({ ...manualForm, message: e.target.value })}
                  placeholder="Details of the trader's request or inquiry..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-hidden focus:border-[#0053CF] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingManual(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-800 text-[12.5px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-lg text-[12.5px] font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Save to Inbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
