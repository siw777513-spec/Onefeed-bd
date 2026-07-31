import React, { useState } from 'react';
import {
  DollarSign,
  X,
  Wallet,
  Eye,
  Gift,
  Users,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Building2,
  Send,
  CheckCircle2,
  Sparkles,
  Lock,
  Award,
} from 'lucide-react';
import { UserProfile, WithdrawalRequest } from '../types';

interface MonetizationDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onRequestWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'status' | 'timestamp'>) => void;
}

export const MonetizationDashboardModal: React.FC<MonetizationDashboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRequestWithdrawal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw' | 'tiers'>('overview');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('50');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank' | 'paypal'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalEarnings = profile.totalEarnings || 148.5;
  const availableBalance = profile.availableBalance || 112.0;
  const subscribers = profile.subscribersCount || 28;
  const giftsCount = profile.giftsReceivedCount || 142;

  const dailyEarnings = [
    { day: 'Mon', amount: 12.5 },
    { day: 'Tue', amount: 18.2 },
    { day: 'Wed', amount: 15.0 },
    { day: 'Thu', amount: 24.8 },
    { day: 'Fri', amount: 31.4 },
    { day: 'Sat', amount: 42.0 },
    { day: 'Sun', amount: 52.6 },
  ];
  const maxDayVal = Math.max(...dailyEarnings.map((d) => d.amount), 1);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableBalance) {
      alert('Invalid withdrawal amount! Check your available balance.');
      return;
    }
    if (!accountNumber.trim()) {
      alert('Please enter your account / phone number.');
      return;
    }

    onRequestWithdrawal({
      userHandle: profile.handle,
      userName: profile.name,
      amountDollars: amt,
      paymentMethod,
      accountNumber: accountNumber.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('overview');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#12111E] via-[#0B0A14] to-[#06060A] rounded-2xl border border-emerald-500/30 shadow-2xl p-4 text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base text-white">Creator Earnings & Wallet</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase">
                  MONETIZED
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Gifts, memberships, ad revenue & sponsorships</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 my-3 bg-black/40 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'overview' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'withdraw' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'tiers' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Monetization Perks</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Earnings Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#0F1A15] border border-emerald-500/30">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                  <p className="text-lg font-black text-white mt-0.5">${totalEarnings.toFixed(2)}</p>
                  <span className="text-[9px] text-emerald-400 font-bold">+24% this month</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0F1A15] border border-emerald-500/30">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Withdrawable</span>
                  <p className="text-lg font-black text-emerald-300 mt-0.5">${availableBalance.toFixed(2)}</p>
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className="text-[9px] text-emerald-400 underline font-bold"
                  >
                    Payout Now →
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#141220] border border-purple-500/30">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gifts Received</span>
                  <p className="text-lg font-black text-amber-300 mt-0.5">{giftsCount} 🎁</p>
                  <span className="text-[9px] text-purple-300 font-bold">Top gift: Diamond 💎</span>
                </div>

                <div className="p-3 rounded-xl bg-[#18111A] border border-pink-500/30">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Subscribers</span>
                  <p className="text-lg font-black text-pink-300 mt-0.5">{subscribers}</p>
                  <span className="text-[9px] text-pink-400 font-bold">$2.99 / mo</span>
                </div>
              </div>

              {/* Earnings Bar Chart */}
              <div className="p-3.5 rounded-xl bg-[#0B120E] border border-emerald-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Weekly Creator Revenue Growth ($)
                    </h4>
                    <p className="text-[10px] text-slate-400">Ad views + Gifts + Subscriptions split</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 font-mono px-2 py-0.5 rounded bg-emerald-500/20">
                    +$211.90 Projected
                  </span>
                </div>

                <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-white/10">
                  {dailyEarnings.map((item, idx) => {
                    const heightPct = Math.round((item.amount / maxDayVal) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-black text-emerald-300 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/40 transition-opacity whitespace-nowrap">
                          ${item.amount.toFixed(2)}
                        </div>
                        <div
                          className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-emerald-600 via-teal-400 to-amber-300 group-hover:brightness-125 transition-all"
                          style={{ height: `${Math.max(heightPct, 10)}%` }}
                        />
                        <span className="text-[9px] font-bold text-slate-400 mt-1">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Creator Status Badge */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-emerald-500/15 border border-amber-500/30 flex items-center space-x-3">
                <div className="text-3xl">🌟</div>
                <div>
                  <h5 className="text-xs font-black text-amber-300 flex items-center gap-1">
                    Verified Top Creator Tier
                  </h5>
                  <p className="text-[10px] text-slate-300">
                    You keep 70% of all subscriptions and 100% of direct tips! Ad share is calculated daily.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Withdraw Funds */}
          {activeTab === 'withdraw' && (
            <div className="space-y-3">
              {submitted ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="font-bold text-sm text-white">Withdrawal Request Sent!</h4>
                  <p className="text-xs text-slate-400">
                    The owner will review & release ${withdrawAmount} to your account shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#09120D] border border-emerald-500/30 flex items-center justify-between">
                    <span className="text-xs text-slate-300">Available to Cash Out:</span>
                    <span className="text-base font-black text-emerald-300 font-mono">
                      ${availableBalance.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Amount to Withdraw ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={availableBalance}
                      className="w-full bg-[#090812] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Payout Method:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'bkash', label: 'bKash Wallet', icon: '📱' },
                        { id: 'nagad', label: 'Nagad Wallet', icon: '📲' },
                        { id: 'bank', label: 'Bank Transfer', icon: '🏛️' },
                        { id: 'paypal', label: 'PayPal', icon: '🌐' },
                      ].map((pm) => (
                        <button
                          type="button"
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id as any)}
                          className={`p-2 rounded-xl border text-left text-xs font-bold flex items-center space-x-1.5 transition-all ${
                            paymentMethod === pm.id
                              ? 'bg-emerald-500/20 border-emerald-400 text-white'
                              : 'bg-[#0A0A10] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{pm.icon}</span>
                          <span>{pm.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Account Number / Phone / IBAN:</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 01711223344 or name@paypal.com"
                      className="w-full bg-[#090812] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Payout Request</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab 3: Monetization Perks */}
          {activeTab === 'tiers' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0D151B] border border-cyan-500/30 space-y-1.5">
                <h5 className="font-bold text-cyan-300 flex items-center gap-1">
                  <Gift className="w-4 h-4" /> 1. Virtual Gifts System
                </h5>
                <p className="text-slate-300 text-[11px]">
                  Fans send virtual items (Rose = 10 coins, Diamond = 100 coins, Super Car = 1000 coins).
                  Coins convert directly to USD in your creator wallet.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1A0E18] border border-pink-500/30 space-y-1.5">
                <h5 className="font-bold text-pink-300 flex items-center gap-1">
                  <Users className="w-4 h-4" /> 2. Creator Subscriptions ($2.99/mo)
                </h5>
                <p className="text-slate-300 text-[11px]">
                  Followers get a VIP Gold badge next to their comments and access to subscriber-only posts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1A150E] border border-amber-500/30 space-y-1.5">
                <h5 className="font-bold text-amber-300 flex items-center gap-1">
                  <Lock className="w-4 h-4" /> 3. Paid Locked Posts
                </h5>
                <p className="text-slate-300 text-[11px]">
                  Publish high-value posts or videos locked behind a coin paywall (e.g. 50 coins to unlock).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
