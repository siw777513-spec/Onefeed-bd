import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Users,
  FileText,
  Heart,
  MessageSquare,
  Trash2,
  Pin,
  Ban,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Lock,
  Sparkles,
  RefreshCw,
  Search,
  Key,
  DollarSign,
  Gift,
  Coins,
  Check,
} from 'lucide-react';
import { SocialItem, UserProfile, Transaction, WithdrawalRequest } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SocialItem[];
  currentUser: UserProfile;
  transactions?: Transaction[];
  withdrawals?: WithdrawalRequest[];
  commissionRate?: number;
  onDeletePost: (id: string) => void;
  onTogglePinPost: (id: string) => void;
  onToggleBlockUser: (handle: string) => void;
  onClearReport: (id: string) => void;
  onClearAllData: () => void;
  onUpdateCommission?: (rate: number) => void;
  onApproveWithdrawal?: (id: string) => void;
  onRejectWithdrawal?: (id: string) => void;
  onGrantBonusCoins?: (handle: string, amount: number) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  transactions = [],
  withdrawals = [],
  commissionRate = 30,
  onDeletePost,
  onTogglePinPost,
  onToggleBlockUser,
  onClearReport,
  onClearAllData,
  onUpdateCommission,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onGrantBonusCoins,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'monetization' | 'posts' | 'users' | 'reports' | 'danger'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [passcode, setPasscode] = useState('');
  const [overrideAccess, setOverrideAccess] = useState(false);
  const [commissionInput, setCommissionInput] = useState(commissionRate.toString());

  // Grant Bonus state
  const [bonusTargetHandle, setBonusTargetHandle] = useState('');
  const [bonusCoinAmount, setBonusCoinAmount] = useState('500');
  const [bonusSuccessMsg, setBonusSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const OWNER_EMAIL = 'siw777513@gmail.com';
  const isOwner = currentUser.email?.toLowerCase() === OWNER_EMAIL || currentUser.isAdmin || overrideAccess;

  // Aggregate Metrics
  const totalPosts = items.length;
  const totalLikes = items.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
  const totalComments = items.reduce((acc, curr) => acc + (curr.commentCount || 0), 0);
  const reportedItems = items.filter((item) => item.isReported);

  // Derive unique users
  const uniqueUsersMap = new Map<string, { name: string; handle: string; avatar: string; isBlocked?: boolean; postCount: number; totalGifts?: number }>();
  items.forEach((item) => {
    const handle = item.author.handle;
    if (!uniqueUsersMap.has(handle)) {
      uniqueUsersMap.set(handle, {
        name: item.author.name,
        handle: item.author.handle,
        avatar: item.author.avatar,
        isBlocked: item.author.isBlocked,
        postCount: 1,
        totalGifts: item.totalGiftsReceivedCoins || 0,
      });
    } else {
      const existing = uniqueUsersMap.get(handle)!;
      existing.postCount += 1;
      existing.totalGifts = (existing.totalGifts || 0) + (item.totalGiftsReceivedCoins || 0);
      if (item.author.isBlocked) existing.isBlocked = true;
    }
  });

  const uniqueUsersList = Array.from(uniqueUsersMap.values());
  const totalUsers = uniqueUsersList.length + 1;

  // Leaderboard Top Earners
  const topEarners = [...uniqueUsersList].sort((a, b) => (b.totalGifts || 0) - (a.totalGifts || 0));

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(bonusCoinAmount, 10);
    if (!bonusTargetHandle || isNaN(amt) || amt <= 0) return;

    if (onGrantBonusCoins) {
      onGrantBonusCoins(bonusTargetHandle.trim(), amt);
    }

    setBonusSuccessMsg(true);
    setTimeout(() => {
      setBonusSuccessMsg(false);
      setBonusTargetHandle('');
    }, 1500);
  };

  // Chart data simulation (Posts per day)
  const chartDays = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 28 },
    { day: 'Fri', count: 34 },
    { day: 'Sat', count: 42 },
    { day: 'Sun', count: totalPosts },
  ];
  const maxChartVal = Math.max(...chartDays.map((d) => d.count), 1);

  const filteredPosts = items.filter(
    (item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.column.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnlockWithPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '777' || passcode.trim() === 'admin') {
      setOverrideAccess(true);
    } else {
      alert('Invalid Owner Access Passcode!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#14080C] rounded-2xl border border-red-500/30 shadow-2xl shadow-red-900/30 text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 border-b border-red-500/20 bg-gradient-to-r from-[#200A10] via-[#16080C] to-[#0A0A0F]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                  SUPER ADMIN CONTROL PANEL
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-[9px] font-black uppercase tracking-widest">
                  OWNER ONLY
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Logged as: <span className="text-amber-300 font-mono font-semibold">{currentUser.email || OWNER_EMAIL}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Gate if not owner */}
        {!isOwner ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Access Restricted</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                This panel is strictly reserved for the owner account (<span className="text-red-300">{OWNER_EMAIL}</span>).
              </p>
            </div>

            <form onSubmit={handleUnlockWithPasscode} className="max-w-xs mx-auto space-y-2 pt-2">
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Owner Passcode (e.g. 777)..."
                  className="w-full bg-[#0A0A0F] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Unlock Admin Access
              </button>
            </form>
          </div>
        ) : (
          /* Main Admin Content */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Admin Tabs */}
            <div className="flex border-b border-red-500/20 bg-[#1A0A0F] overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2.5 px-3.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'overview'
                    ? 'text-red-400 border-red-500 bg-red-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('monetization')}
                className={`py-2.5 px-3.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'monetization'
                    ? 'text-emerald-400 border-emerald-500 bg-emerald-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monetization & Payouts</span>
              </button>

              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2.5 px-3.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'posts'
                    ? 'text-red-400 border-red-500 bg-red-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Manage Posts ({items.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`py-2.5 px-3.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'users'
                    ? 'text-red-400 border-red-500 bg-red-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Users ({totalUsers})</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2.5 px-3.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'reports'
                    ? 'text-amber-400 border-amber-500 bg-amber-500/10'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Reports</span>
                {reportedItems.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black">
                    {reportedItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('danger')}
                className={`py-2.5 px-3.5 text-xs font-extrabold whitespace-nowrap transition-all border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'danger'
                    ? 'text-red-500 border-red-600 bg-red-600/20'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Danger Zone</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#1C0A10] border border-red-500/20 shadow-md">
                      <div className="flex items-center justify-between text-red-400 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-xl font-black text-white">{totalUsers}</p>
                      <span className="text-[9px] text-emerald-400 font-semibold">+12% this week</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1C0A10] border border-red-500/20 shadow-md">
                      <div className="flex items-center justify-between text-cyan-400 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Posts</span>
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-xl font-black text-white">{totalPosts}</p>
                      <span className="text-[9px] text-cyan-300 font-semibold">Across 5 Columns</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1C0A10] border border-red-500/20 shadow-md">
                      <div className="flex items-center justify-between text-pink-400 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Likes</span>
                        <Heart className="w-4 h-4" />
                      </div>
                      <p className="text-xl font-black text-white">{totalLikes.toLocaleString()}</p>
                      <span className="text-[9px] text-pink-400 font-semibold">High engagement</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1C0A10] border border-red-500/20 shadow-md">
                      <div className="flex items-center justify-between text-amber-400 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comments</span>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <p className="text-xl font-black text-white">{totalComments}</p>
                      <span className="text-[9px] text-amber-400 font-semibold">Active threads</span>
                    </div>
                  </div>

                  {/* Activity Bar Chart */}
                  <div className="p-3.5 rounded-xl bg-[#1A090E] border border-red-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-red-400" />
                          Platform Activity & Posts Traffic
                        </h4>
                        <p className="text-[10px] text-slate-400">Daily post frequency analysis</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                        Live Analytics
                      </span>
                    </div>

                    <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-white/10">
                      {chartDays.map((item, idx) => {
                        const heightPct = Math.round((item.count / maxChartVal) * 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center group relative">
                            {/* Hover tooltip */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-black text-red-300 text-[9px] px-1.5 py-0.5 rounded border border-red-500/40 transition-opacity whitespace-nowrap">
                              {item.count} posts
                            </div>
                            <div
                              className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-red-600 via-pink-500 to-amber-400 group-hover:brightness-125 transition-all"
                              style={{ height: `${Math.max(heightPct, 10)}%` }}
                            />
                            <span className="text-[9px] font-bold text-slate-400 mt-1">{item.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Monetization Control */}
              {activeTab === 'monetization' && (
                <div className="space-y-4">
                  {/* Commission Rate & Bonus Coins Controls Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Platform Commission Rate */}
                    <div className="p-3.5 rounded-xl bg-[#091510] border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" /> Platform Commission Rate
                        </span>
                        <span className="text-xs font-mono font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded">
                          {commissionRate}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        OneFeed platform share on subscriptions & paid content. Default is 30%.
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={commissionInput}
                          onChange={(e) => setCommissionInput(e.target.value)}
                          className="w-24 bg-black border border-emerald-500/30 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = parseInt(commissionInput, 10);
                            if (!isNaN(val) && val >= 0 && val <= 100 && onUpdateCommission) {
                              onUpdateCommission(val);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs transition-all"
                        >
                          Save %
                        </button>
                      </div>
                    </div>

                    {/* Grant Bonus Coins Form */}
                    <div className="p-3.5 rounded-xl bg-[#130E1C] border border-purple-500/30 space-y-2">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-300" /> Grant Bonus Coins to User
                      </span>
                      <p className="text-[10px] text-slate-400">Reward top creators or testers with free coins.</p>

                      {bonusSuccessMsg ? (
                        <div className="p-1.5 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" /> Bonus Granted!
                        </div>
                      ) : (
                        <form onSubmit={handleGrantSubmit} className="space-y-2 pt-1">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={bonusTargetHandle}
                              onChange={(e) => setBonusTargetHandle(e.target.value)}
                              placeholder="@handle (e.g. @sarah_design)"
                              className="flex-1 bg-black border border-purple-500/30 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                              required
                            />
                            <input
                              type="number"
                              value={bonusCoinAmount}
                              onChange={(e) => setBonusCoinAmount(e.target.value)}
                              placeholder="Coins"
                              className="w-20 bg-black border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-amber-300 font-mono focus:outline-none"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-amber-500 text-black font-extrabold text-xs transition-all"
                          >
                            Grant Coins
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Pending Withdrawal Requests */}
                  <div className="p-3.5 rounded-xl bg-[#0C120F] border border-emerald-500/30 space-y-2">
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> Pending Creator Withdrawal Requests ({withdrawals.filter(w => w.status === 'pending').length})
                    </h4>

                    {withdrawals.length === 0 ? (
                      <p className="text-[11px] text-slate-500 py-2">No withdrawal requests found.</p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        {withdrawals.map((wd) => (
                          <div
                            key={wd.id}
                            className="p-2.5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-white">{wd.userName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{wd.userHandle}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                                    wd.status === 'approved'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : wd.status === 'rejected'
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {wd.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                                Method: <span className="text-amber-300 font-bold uppercase">{wd.paymentMethod}</span> ({wd.accountNumber})
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black text-emerald-400 font-mono">${wd.amountDollars.toFixed(2)}</span>
                              {wd.status === 'pending' && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => onApproveWithdrawal && onApproveWithdrawal(wd.id)}
                                    className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-[10px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => onRejectWithdrawal && onRejectWithdrawal(wd.id)}
                                    className="px-2 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-white font-bold text-[10px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top Earners Leaderboard */}
                  <div className="p-3.5 rounded-xl bg-[#140C1A] border border-purple-500/30 space-y-2">
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-purple-400" /> Top Earners Leaderboard
                    </h4>
                    <div className="space-y-1.5">
                      {topEarners.slice(0, 5).map((usr, i) => (
                        <div
                          key={usr.handle}
                          className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-4 font-extrabold text-amber-400 font-mono">#{i + 1}</span>
                            <img src={usr.avatar} className="w-6 h-6 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                            <span className="font-bold text-white">{usr.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{usr.handle}</span>
                          </div>
                          <span className="font-mono text-amber-300 font-bold">
                            🪙 {usr.totalGifts || 0} Gifts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Manage Posts */}
              {activeTab === 'posts' && (
                <div className="space-y-3">
                  {/* Search filter */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search post captions or authors..."
                      className="w-full bg-[#0D0508] border border-red-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-2.5 rounded-xl bg-[#18080C] border border-white/10 flex items-center justify-between space-x-3 hover:border-red-500/30 transition-colors"
                      >
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white truncate">{post.author.name}</span>
                            <span className="text-[9px] text-slate-400 uppercase font-mono px-1 bg-white/5 rounded">
                              {post.column}
                            </span>
                            {post.isPinned && (
                              <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5">
                                <Pin className="w-2.5 h-2.5 fill-amber-400" /> Pinned
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-1">{post.text}</p>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => onTogglePinPost(post.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              post.isPinned
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                            title="Pin / Unpin Post"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeletePost(post.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Users Management */}
              {activeTab === 'users' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-2">Registered creators and active handles:</p>
                  {uniqueUsersList.map((usr) => (
                    <div
                      key={usr.handle}
                      className="p-2.5 rounded-xl bg-[#18080C] border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={usr.avatar}
                          alt={usr.name}
                          className="w-8 h-8 rounded-full object-cover border border-red-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{usr.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{usr.handle} • {usr.postCount} posts</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleBlockUser(usr.handle)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-all ${
                          usr.isBlocked
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Ban className="w-3 h-3" />
                        <span>{usr.isBlocked ? 'Unblock' : 'Block User'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Reported Content */}
              {activeTab === 'reports' && (
                <div className="space-y-2">
                  {reportedItems.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-200">No Pending Reports</p>
                      <p className="text-[10px]">All user flags and reports have been resolved!</p>
                    </div>
                  ) : (
                    reportedItems.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#220B10] border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            Reported Flag
                          </span>
                          <span className="text-[9px] text-slate-400">Reason: {item.reportReason || 'Inappropriate content'}</span>
                        </div>

                        <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-lg">
                          <img src={item.image} alt="Preview" className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white">{item.author.name}</p>
                            <p className="text-[11px] text-slate-300 line-clamp-1">{item.text}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            onClick={() => onClearReport(item.id)}
                            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold"
                          >
                            Dismiss Flag
                          </button>
                          <button
                            onClick={() => onDeletePost(item.id)}
                            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                          >
                            Delete Reported Post
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 5: Danger Zone */}
              {activeTab === 'danger' && (
                <div className="p-4 rounded-xl bg-[#2A080C] border border-red-600/50 space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-extrabold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>DANGER ZONE - IRREVERSIBLE ACTIONS</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Clearing system database will erase all created posts, user state, and local storage variables instantly.
                  </p>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to completely purge and reset all app data?')) {
                        onClearAllData();
                        onClose();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-red-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Purge & Reset All Database</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
