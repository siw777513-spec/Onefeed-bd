import React, { useState } from 'react';
import { DollarSign, X, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { SocialItem } from '../types';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorHandle: string;
  onSendTip: (amountDollars: number, recipientHandle: string) => void;
}

const TIP_AMOUNTS = [1.0, 3.0, 5.0, 10.0, 25.0];

export const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  creatorHandle,
  onSendTip,
}) => {
  const [selectedAmt, setSelectedAmt] = useState<number>(5.0);
  const [customAmt, setCustomAmt] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const finalAmount = customAmt ? parseFloat(customAmt) || 0 : selectedAmt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    onSendTip(finalAmount, creatorHandle);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1A0E24] via-[#12081A] to-[#0A0410] rounded-2xl border border-pink-500/30 shadow-2xl p-4 text-slate-100 flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Tip {creatorName}</h3>
              <p className="text-[10px] text-slate-400">100% of direct tips go to creator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-white">Tip Sent!</h4>
            <p className="text-xs text-slate-400">Thank you for supporting {creatorName}!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {TIP_AMOUNTS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setSelectedAmt(amt);
                    setCustomAmt('');
                  }}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedAmt === amt && !customAmt
                      ? 'bg-pink-500/25 border-pink-400 text-pink-200'
                      : 'bg-[#12081A] border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  ${amt.toFixed(2)}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Custom Amount ($):</label>
              <input
                type="number"
                step="0.5"
                placeholder="Or enter custom amount..."
                value={customAmt}
                onChange={(e) => setCustomAmt(e.target.value)}
                className="w-full bg-[#0A0410] border border-pink-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 hover:brightness-110 transition-all flex items-center justify-center space-x-1.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Send ${finalAmount.toFixed(2)} Tip</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
