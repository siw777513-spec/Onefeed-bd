import React, { useState } from 'react';
import { UserPlus, UserCheck, MessageSquare, Sparkles, Radio, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface RightSidebarProps {
  onFollowToggle?: (handle: string) => void;
  onOpenChatWithUser?: (name: string, handle: string, avatar: string) => void;
}

const SUGGESTED_CREATORS = [
  {
    name: 'Aria Vance',
    handle: '@aria_v',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Tokyo Tech Explorer ⛩️',
    verified: true,
  },
  {
    name: 'CyberSamurai',
    handle: '@cyber_samurai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Unreal Engine 5 Creator 🎮',
    verified: true,
  },
  {
    name: 'Sarah Jenkins',
    handle: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Reels & Shorts Vlogger 🌏',
    verified: false,
  },
];

const ONLINE_FRIENDS = [
  {
    name: 'Tech Daily',
    handle: '@tech_daily',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    status: 'Gaming in VR',
  },
  {
    name: 'Elena Rostova',
    handle: '@elena_r',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    status: 'Editing video',
  },
  {
    name: 'Liam Vance',
    handle: '@liam_v',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    status: 'Coding Applet',
  },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onFollowToggle,
  onOpenChatWithUser,
}) => {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (handle: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
    if (onFollowToggle) onFollowToggle(handle);
  };

  return (
    <div className="w-64 shrink-0 hidden xl:flex flex-col gap-4 p-3 bg-[#0A0A12]/90 border-l border-white/10 overflow-y-auto custom-scrollbar select-none text-slate-100">
      {/* Who to Follow Suggestions */}
      <div className="p-3.5 rounded-2xl bg-[#121220] border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Who to Follow
          </span>
        </div>

        <div className="space-y-2.5">
          {SUGGESTED_CREATORS.map((user) => {
            const isFollowing = followingMap[user.handle];
            return (
              <div key={user.handle} className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                      {user.name}
                      {user.verified && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                    </p>
                    <p className="text-[9px] font-mono text-cyan-400 truncate">{user.handle}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(user.handle)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all shrink-0 ${
                    isFollowing
                      ? 'bg-white/10 text-slate-300 border border-white/10'
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold shadow-md hover:scale-105'
                  }`}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Friends Online */}
      <div className="p-3.5 rounded-2xl bg-[#121220] border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Active Friends
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">3 Online</span>
        </div>

        <div className="space-y-2">
          {ONLINE_FRIENDS.map((friend) => (
            <div
              key={friend.handle}
              onClick={() => onOpenChatWithUser && onOpenChatWithUser(friend.name, friend.handle, friend.avatar)}
              className="p-2 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#121220]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                    {friend.name}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">{friend.status}</p>
                </div>
              </div>

              <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
