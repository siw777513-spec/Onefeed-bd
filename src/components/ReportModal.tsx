import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SocialItem } from '../types';

interface ReportModalProps {
  item: SocialItem | null;
  onClose: () => void;
  onConfirmReport: (itemId: string, reason: string) => void;
}

const REPORT_REASONS = [
  'Inappropriate or offensive content',
  'Spam or misleading information',
  'Harassment or hate speech',
  'Copyright or intellectual property violation',
  'Other issue',
];

export const ReportModal: React.FC<ReportModalProps> = ({ item, onClose, onConfirmReport }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReport(item.id, selectedReason);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#141420] rounded-2xl border border-amber-500/30 shadow-2xl p-4 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Report Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-white">Report Submitted</h4>
            <p className="text-xs text-slate-400">Our Admin team will review this post shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-3 space-y-3">
            <p className="text-xs text-slate-300">
              Why are you reporting this post by <span className="font-bold text-white">{item.author.name}</span>?
            </p>

            <div className="space-y-1.5">
              {REPORT_REASONS.map((reason, idx) => (
                <label
                  key={idx}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-[#0A0A10] border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-amber-400"
                  />
                  <span className="text-xs font-semibold">{reason}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity"
            >
              Submit Flag to Admin
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
