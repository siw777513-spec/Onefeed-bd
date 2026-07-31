import React from 'react';
import {
  Flame,
  Coins,
  TrendingUp,
  Hash,
  ShieldCheck,
  UserCheck,
  Zap,
  Sparkles,
  BarChart3,
  Moon,
  Sun,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';

interface LeftSidebarProps {
  currentUser: UserProfile;
  onOpenDailyReward: () => void;
  onOpenWallet: () => void;
  onOpenFriends?: (tab?: 'friends' | 'followers' | 'subscribers') => void;
  onSelectHashtag?: (tag: string) => void;
}

const TRENDING_HASHTAGS = [
  { name: '#OneFeed', posts: '124.5K' },
  { name: '#AIStudio', posts: '89.2K' },
  { name: '#React19', posts: '54.1K' },
  { name: '#BangladeshiTech', posts: '38.9K' },
  { name: '#TailwindV4', posts: '22.4K' },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  onOpenDailyReward,
  onOpenWallet,
  onOpenFriends,
  onSelectHashtag,
}) => {
  const isOwner = (currentUser.email || '').toLowerCase().trim() === 'siw777513@gmail.com';

  return (
    <div className="w-64 shrink-0 hidden lg:flex flex-col gap-4 p-3 bg-[#0A0A12]/90 border-r border-white/10 overflow-y-auto custom-scrollbar select-none text-slate-100">
      {/* User Quick Profile Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#161626] to-[#0E0E1A] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-cyan-400 shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black text-white truncate flex items-center gap-1">
              {currentUser.name}
              {isOwner && <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />}
            </h3>
            <p className="text-[10px] font-mono text-cyan-400 truncate">{currentUser.handle}</p>
          </div>
        </div>

        {/* User Stats Grid (Clickable to open Friends Hub) */}
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 text-center text-[10px]">
          <div className="cursor-pointer hover:bg-white/5 rounded-lg p-0.5 transition-colors">
            <span className="text-slate-400 font-medium block">Posts</span>
            <span className="font-extrabold text-white">42</span>
          </div>
          <div
            onClick={() => onOpenFriends && onOpenFriends('followers')}
            className="cursor-pointer hover:bg-cyan-500/10 rounded-lg p-0.5 transition-colors"
            title="View Followers"
          >
            <span className="text-slate-400 font-medium block">Followers</span>
            <span className="font-extrabold text-cyan-300">{currentUser.followersCount ?? 1240}</span>
          </div>
          <div
            onClick={() => onOpenFriends && onOpenFriends('friends')}
            className="cursor-pointer hover:bg-amber-500/10 rounded-lg p-0.5 transition-colors"
            title="View Friends & Connections"
          >
            <span className="text-slate-400 font-medium block">Following</span>
            <span className="font-extrabold text-amber-300">{currentUser.followingCount ?? 380}</span>
          </div>
        </div>
      </div>

      {/* Friends Hub Banner */}
      {onOpenFriends && (
        <div
          onClick={() => onOpenFriends('friends')}
          className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/40 hover:border-cyan-300 shadow-lg cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/30 text-cyan-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Friends Hub</span>
              <span className="text-[10px] text-cyan-300">Manage 1.2k connections</span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </div>
      )}

      {/* Daily Streak Banner */}
      <div
        onClick={onOpenDailyReward}
        className="group p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 hover:border-amber-400 shadow-lg cursor-pointer transition-all flex items-center justify-between"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 fill-amber-400 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider block">
              Daily Streak
            </span>
            <span className="text-xs font-bold text-white">🔥 5 Days (Claim +350)</span>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </div>

      {/* Coin Balance Wallet Card */}
      <div
        onClick={onOpenWallet}
        className="p-3 rounded-2xl bg-[#121220] border border-white/10 hover:border-amber-400/50 cursor-pointer transition-all flex items-center justify-between"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Coin Balance</span>
            <span className="text-xs font-black text-amber-300 font-mono">
              🪙 {currentUser.coinBalance ?? 500} Coins
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
          Top Up
        </span>
      </div>

      {/* Trending Hashtags */}
      <div className="p-3.5 rounded-2xl bg-[#121220] border border-white/10 space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Trending Topics
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {TRENDING_HASHTAGS.map((tag) => (
            <div
              key={tag.name}
              onClick={() => onSelectHashtag && onSelectHashtag(tag.name)}
              className="p-1.5 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                <Hash className="w-3 h-3 text-cyan-500" />
                {tag.name.replace('#', '')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{tag.posts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
