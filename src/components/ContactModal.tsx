import React, { useState } from 'react';
import { X, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  type: 'contact' | 'disclaimer';
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, type, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl max-w-lg w-full p-6 md:p-8 shadow-xl border border-slate-300 relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'contact' ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-[#0053CF]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-manrope text-[19px] font-black text-slate-900">Contact U.S.H Forex</h3>
                <p className="font-inter text-[13px] text-slate-600">Get in touch with our team</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-manrope text-[18px] font-bold text-slate-900">Message Received</h4>
                <p className="font-inter text-[14px] text-slate-600">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-inter text-[12.5px] font-bold text-slate-900 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Sterling"
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[12.5px] font-bold text-slate-900 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="trader@example.com"
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[12.5px] font-bold text-slate-900 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-2.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Broker Partnership & Setup">Broker Partnership & Setup</option>
                    <option value="Telegram Community Access">Telegram Community Access</option>
                    <option value="Educational Questions">Educational Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block font-inter text-[12.5px] font-bold text-slate-900 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your trading journey?"
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-900 outline-hidden font-inter resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 rounded-lg font-inter text-[14px] font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#BA1A1A]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-manrope text-[19px] font-black text-slate-900">Risk & Legal Disclosure</h3>
                <p className="font-inter text-[13px] text-slate-600">Regulatory & Policy Statements</p>
              </div>
            </div>

            <div className="space-y-2.5 font-inter text-[13px] text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-300">
              <p>
                <strong className="text-slate-900">1. High-Risk Investment:</strong> Foreign exchange and CFD trading carries a significant level of risk to your capital. You should not invest money that you cannot afford to lose.
              </p>
              <p>
                <strong className="text-slate-900">2. Educational Purpose:</strong> All market analyses, chart setups, and commentary provided by U.S.H Forex are for educational purposes only and do not constitute financial or investment advice.
              </p>
              <p>
                <strong className="text-slate-900">3. Regulatory Separation:</strong> U.S.H Forex is an independent educational publisher and community platform. Brokerage services are provided directly by regulated third parties such as Exness.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-inter text-[14px] font-bold transition-colors cursor-pointer"
            >
              I Understand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
