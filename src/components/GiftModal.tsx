import React, { useState } from 'react';
import { Gift, X, Sparkles, Coins, Check, Zap } from 'lucide-react';
import { GiftOption, SocialItem } from '../types';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SocialItem | null;
  userCoins: number;
  onSendGift: (gift: GiftOption, recipientHandle: string, itemId?: string) => void;
  onOpenBuyCoins: () => void;
}

export const GIFT_OPTIONS: GiftOption[] = [
  { id: 'rose', name: 'Rose', icon: '🌹', coinPrice: 10, valueDollars: 0.1 },
  { id: 'fire', name: 'Fire Flame', icon: '🔥', coinPrice: 50, valueDollars: 0.5 },
  { id: 'diamond', name: 'Diamond', icon: '💎', coinPrice: 100, valueDollars: 1.0 },
  { id: 'crown', name: 'Royal Crown', icon: '👑', coinPrice: 500, valueDollars: 5.0 },
  { id: 'supercar', name: 'Super Car', icon: '🏎️', coinPrice: 1000, valueDollars: 10.0 },
  { id: 'rocket', name: 'Star Rocket', icon: '🚀', coinPrice: 2500, valueDollars: 25.0 },
];

export const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  item,
  userCoins,
  onSendGift,
  onOpenBuyCoins,
}) => {
  const [selectedGift, setSelectedGift] = useState<GiftOption>(GIFT_OPTIONS[0]);
  const [flyingAnim, setFlyingAnim] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const canAfford = userCoins >= selectedGift.coinPrice;

  const handleSend = () => {
    if (!canAfford) {
      onOpenBuyCoins();
      return;
    }

    // Trigger flying gift effect
    setFlyingAnim(selectedGift.icon);
    onSendGift(selectedGift, item.author.handle, item.id);

    setTimeout(() => {
      setFlyingAnim(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Flying Gift Animation Overlay */}
      {flyingAnim && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce transform scale-150 transition-all filter drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">
            {flyingAnim}
          </div>
        </div>
      )}

      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1E102A] via-[#140A1D] to-[#0D0514] rounded-2xl border border-amber-500/40 shadow-2xl p-4 text-slate-100 flex flex-col space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Gift className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1">
                Send Gift to {item.author.name}
              </h3>
              <p className="text-[10px] text-slate-400">Support creator & unlock top fan badge</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Balance Bar */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-500/20 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-amber-400 text-sm">🪙</span>
            <span className="text-slate-300">Your Coin Balance:</span>
            <span className="font-extrabold text-amber-300 font-mono">{userCoins} Coins</span>
          </div>

          <button
            onClick={onOpenBuyCoins}
            className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black font-extrabold text-[10px] transition-all flex items-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>+ Re-fill</span>
          </button>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-3 gap-2">
          {GIFT_OPTIONS.map((g) => {
            const isSelected = selectedGift.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGift(g)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/30 to-purple-600/30 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#180A22] border-white/10 hover:border-amber-500/30 hover:bg-white/5'
                }`}
              >
                <span className="text-2xl mb-1 filter drop-shadow-md">{g.icon}</span>
                <span className="text-[11px] font-bold text-white line-clamp-1">{g.name}</span>
                <span className="text-[10px] font-mono font-bold text-amber-300 flex items-center gap-0.5 mt-0.5">
                  🪙 {g.coinPrice}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          className={`w-full py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all ${
            canAfford
              ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-black shadow-amber-500/25 hover:brightness-110 active:scale-95'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-black'
          }`}
        >
          {canAfford ? (
            <>
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Send {selectedGift.name} ({selectedGift.coinPrice} Coins)</span>
            </>
          ) : (
            <>
              <Coins className="w-4 h-4" />
              <span>Insufficient Coins - Re-fill Wallet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
