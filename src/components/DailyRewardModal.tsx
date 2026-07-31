import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Coins, Sparkles, CheckCircle2, Gift, X, Trophy, Zap, Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onClaimReward: (rewardCoins: number) => void;
}

const REWARD_DAYS = [
  { day: 1, coins: 50, label: 'Day 1', icon: Coins, claimed: true },
  { day: 2, coins: 100, label: 'Day 2', icon: Coins, claimed: true },
  { day: 3, coins: 150, label: 'Day 3', icon: Coins, claimed: true },
  { day: 4, coins: 200, label: 'Day 4', icon: Coins, claimed: true },
  { day: 5, coins: 350, label: 'Today!', icon: Flame, claimed: false, isToday: true },
  { day: 6, coins: 500, label: 'Day 6', icon: Gift, claimed: false },
  { day: 7, coins: 1000, label: 'Grand Prize', icon: Crown, claimed: false, isGrand: true },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onClaimReward,
}) => {
  const [claimedToday, setClaimedToday] = useState(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    // Trigger confetti burst
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#ec4899', '#eab308'],
    });

    setClaimedToday(true);
    onClaimReward(350); // Day 5 reward
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D0D18] rounded-3xl border border-amber-500/30 p-6 shadow-2xl text-slate-100 overflow-hidden flex flex-col items-center text-center">
        {/* Glow ambient background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Flame Header Icon */}
        <div className="relative mb-3 p-4 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 shadow-xl">
          <Flame className="w-12 h-12 text-amber-400 fill-amber-400 animate-bounce" />
          <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] uppercase shadow">
            🔥 5 Streak
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 justify-center">
          Daily Streak Reward
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Log in daily to claim free OneFeed coins & build your unstoppable streak!
        </p>

        {/* Current Coin Balance */}
        <div className="my-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300">Your Coin Balance:</span>
          <span className="text-sm font-extrabold text-amber-300 font-mono">
            🪙 {(currentUser.coinBalance ?? 500) + (claimedToday ? 350 : 0)}
          </span>
        </div>

        {/* 7-Day Reward Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 w-full my-3">
          {REWARD_DAYS.map((item) => {
            const Icon = item.icon;
            const isDone = item.claimed || (item.isToday && claimedToday);

            return (
              <div
                key={item.day}
                className={`p-2 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                  item.isToday && !claimedToday
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <span className="text-[9px] font-bold uppercase">{item.label}</span>
                <div className="my-1">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                  ) : (
                    <Icon className={`w-5 h-5 mx-auto ${item.isGrand ? 'text-amber-400' : 'text-slate-300'}`} />
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300">
                  +{item.coins}
                </span>
              </div>
            );
          })}
        </div>

        {/* Claim Action */}
        <div className="w-full mt-3">
          {claimedToday ? (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Today's +350 Coins Claimed! Come back tomorrow.</span>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-black font-black text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>CLAIM TODAY'S 350 COINS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
