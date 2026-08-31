import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#E2E8F0] relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#75777E] hover:text-[#091C35] p-1.5 rounded-lg hover:bg-[#F1F4F9] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'contact' ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0053CF]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-manrope text-[20px] font-bold text-[#091C35]">Contact U.S.H Forex</h3>
                <p className="font-inter text-[13px] text-[#44474D]">Get in touch with our team</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-manrope text-[18px] font-bold text-[#091C35]">Message Received</h4>
                <p className="font-inter text-[14px] text-[#44474D]">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-inter text-[13px] font-semibold text-[#091C35] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Sterling"
                    className="w-full bg-[#F1F4F9] border border-[#C5C6CE] focus:border-[#0053CF] focus:bg-white rounded-lg px-3.5 py-2.5 text-[14px] text-[#181C20] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13px] font-semibold text-[#091C35] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="trader@example.com"
                    className="w-full bg-[#F1F4F9] border border-[#C5C6CE] focus:border-[#0053CF] focus:bg-white rounded-lg px-3.5 py-2.5 text-[14px] text-[#181C20] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13px] font-semibold text-[#091C35] mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#F1F4F9] border border-[#C5C6CE] focus:border-[#0053CF] focus:bg-white rounded-lg px-3 py-2.5 text-[14px] text-[#181C20] outline-none transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Broker Partnership & Setup">Broker Partnership & Setup</option>
                    <option value="Telegram Community Access">Telegram Community Access</option>
                    <option value="Educational Questions">Educational Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block font-inter text-[13px] font-semibold text-[#091C35] mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your trading journey?"
                    className="w-full bg-[#F1F4F9] border border-[#C5C6CE] focus:border-[#0053CF] focus:bg-white rounded-lg px-3.5 py-2.5 text-[14px] text-[#181C20] outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0053CF] hover:bg-[#0040A2] text-white py-3 rounded-xl font-inter text-[14px] font-semibold transition-all shadow-md active:scale-98"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#BA1A1A]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-manrope text-[20px] font-bold text-[#091C35]">Risk & Legal Disclosure</h3>
                <p className="font-inter text-[13px] text-[#44474D]">Regulatory & Policy Statements</p>
              </div>
            </div>

            <div className="space-y-3 font-inter text-[13px] text-[#44474D] leading-relaxed bg-[#F7FAFF] p-4 rounded-xl border border-[#E2E8F0]">
              <p>
                <strong>1. High-Risk Investment:</strong> Foreign exchange and CFD trading carries a significant level of risk to your capital. You should not invest money that you cannot afford to lose.
              </p>
              <p>
                <strong>2. Educational Purpose:</strong> All market analyses, chart setups, and commentary provided by U.S.H Forex are for educational purposes only and do not constitute financial or investment advice.
              </p>
              <p>
                <strong>3. Regulatory Separation:</strong> U.S.H Forex is an independent educational publisher and community platform. Brokerage services are provided directly by regulated third parties such as Exness.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#091C35] hover:bg-[#181C20] text-white py-2.5 rounded-xl font-inter text-[14px] font-semibold transition-all"
            >
              I Understand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
