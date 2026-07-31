import React, { useState } from 'react';
import {
  X,
  Search,
  Users,
  UserCheck,
  UserPlus,
  MessageCircle,
  MoreVertical,
  Share2,
  ShieldCheck,
  Check,
  UserX,
  Flag,
  Sparkles,
  Wifi,
  Clock,
  UserPlus2,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../types';

export interface FriendUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isOnline: boolean;
  mutualCount: number;
  isFollowing: boolean;
  isSubscriber?: boolean;
  isFriend?: boolean;
  type: 'friend' | 'follower' | 'subscriber';
  lastSeen?: string;
}

const INITIAL_FRIENDS: FriendUser[] = [
  {
    id: 'u1',
    name: 'Aria Vance',
    handle: '@aria_v',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    mutualCount: 8,
    isFollowing: true,
    isFriend: true,
    type: 'friend',
    lastSeen: 'Active now',
  },
  {
    id: 'u2',
    name: 'CyberSamurai',
    handle: '@cyber_samurai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    mutualCount: 14,
    isFollowing: true,
    isFriend: true,
    type: 'friend',
    lastSeen: 'Active now',
  },
  {
    id: 'u3',
    name: 'Sarah Jenkins',
    handle: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isOnline: false,
    mutualCount: 3,
    isFollowing: false,
    isFriend: false,
    type: 'follower',
    lastSeen: '10m ago',
  },
  {
    id: 'u4',
    name: 'Tech Insider Daily',
    handle: '@tech_daily',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    mutualCount: 22,
    isFollowing: true,
    isSubscriber: true,
    type: 'subscriber',
    lastSeen: 'Active now',
  },
  {
    id: 'u5',
    name: 'Elena Rostova',
    handle: '@elena_design',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    isOnline: false,
    mutualCount: 5,
    isFollowing: true,
    isFriend: true,
    type: 'friend',
    lastSeen: '1h ago',
  },
  {
    id: 'u6',
    name: 'Tanvir Hossain',
    handle: '@tanvir_bd',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    mutualCount: 19,
    isFollowing: true,
    isSubscriber: true,
    type: 'subscriber',
    lastSeen: 'Active now',
  },
  {
    id: 'u7',
    name: 'Kazi Noman',
    handle: '@kazi_dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isOnline: false,
    mutualCount: 2,
    isFollowing: false,
    type: 'follower',
    lastSeen: '2h ago',
  },
];

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  initialTab?: 'friends' | 'followers' | 'subscribers';
  onOpenProfileWithUser?: (user: UserProfile) => void;
  onOpenChatWithUser?: (name: string, handle: string, avatar: string) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = 'friends',
  onOpenProfileWithUser,
  onOpenChatWithUser,
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'followers' | 'subscribers'>(initialTab);
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<FriendUser[]>(INITIAL_FRIENDS);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [menuOpenUserId, setMenuOpenUserId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOwner = (currentUser.email || '').toLowerCase().trim() === 'siw777513@gmail.com';

  const handleToggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u))
    );
  };

  const handleRemoveUser = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setMenuOpenUserId(null);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://onefeed.app/invite/${currentUser.handle.replace('@', '')}`);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  // Filter logic
  const tabFilteredUsers = users.filter((u) => {
    if (activeTab === 'friends') return u.type === 'friend' || u.isFriend;
    if (activeTab === 'followers') return u.type === 'follower' || u.isFollowing || true; // show followers
    if (activeTab === 'subscribers') return u.isSubscriber || u.type === 'subscriber';
    return true;
  });

  const finalFilteredUsers = tabFilteredUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'online') return u.isOnline;
    if (filterMode === 'recent') return u.mutualCount > 5;
    return true;
  });

  const friendsCount = users.filter((u) => u.type === 'friend' || u.isFriend).length;
  const followersCount = users.length + 1200;
  const subscribersCount = users.filter((u) => u.isSubscriber).length + 42;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#12121A]/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[80vh] max-h-[620px] transition-all">
        {/* Header */}
        <div className="p-3.5 border-b border-white/10 bg-[#0A0A0F]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0A0A0F] rounded-[11px] flex items-center justify-center">
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                Friends Hub
                {isOwner && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[9px] font-mono border border-red-500/40">
                    Owner
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Connections & Subscriptions</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopyInviteLink}
              className="px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-3 h-3 text-cyan-400" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 text-cyan-400" />
                  <span>Invite</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="p-3 bg-[#0A0A0F]/60 border-b border-white/5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends by name or @username..."
              className="w-full bg-[#12121A] border border-white/10 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* 3 Main Tabs Header */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-[#0A0A0F] border-b border-white/10 shrink-0 text-center text-xs">
          <button
            onClick={() => setActiveTab('friends')}
            className={`py-2 px-1 rounded-2xl font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-white border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Friends</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
              {friendsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('followers')}
            className={`py-2 px-1 rounded-2xl font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'followers'
                ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-white border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Followers</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
              {followersCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`py-2 px-1 rounded-2xl font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'subscribers'
                ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-white border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>VIP Subs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono">
              {subscribersCount}
            </span>
          </button>
        </div>

        {/* Sub-Filter Row: All | Online | Recent */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0A0A0F]/40 border-b border-white/5 text-[11px] shrink-0">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Filter:</span>
          <div className="flex space-x-1">
            {(['all', 'online', 'recent'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-0.5 rounded-lg font-bold capitalize transition-all ${
                  filterMode === mode
                    ? 'bg-white/15 text-cyan-300 border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'online' ? '🟢 Online' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* User Card List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {finalFilteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
              <p className="text-xs font-bold">No connections found</p>
              <p className="text-[10px] text-slate-500">Try adjusting search or invite new friends</p>
            </div>
          ) : (
            finalFilteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  if (onOpenProfileWithUser) {
                    onOpenProfileWithUser({
                      name: user.name,
                      handle: user.handle,
                      avatar: user.avatar,
                      email: `${user.handle.replace('@', '')}@onefeed.io`,
                      bio: 'OneFeed Verified Creator ✨',
                      followersCount: user.mutualCount * 120,
                      followingCount: 320,
                    });
                    onClose();
                  }
                }}
                className="group relative p-2.5 rounded-2xl bg-[#0A0A0F]/60 hover:bg-[#161624] border border-white/5 hover:border-cyan-400/30 transition-all flex items-center justify-between cursor-pointer"
              >
                {/* Left Side: Avatar + Details */}
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {user.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0A0A0F]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1">
                      <h4 className="text-xs font-extrabold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {user.name}
                      </h4>
                      {user.isSubscriber && (
                        <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold">
                          VIP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                      <span>{user.handle}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-sans font-bold">
                        {user.mutualCount} mutual
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Action Buttons */}
                <div className="flex items-center space-x-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Message Button */}
                  <button
                    onClick={() => {
                      if (onOpenChatWithUser) {
                        onOpenChatWithUser(user.name, user.handle, user.avatar);
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 transition-all"
                    title="Send Direct Message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>

                  {/* Follow/Unfollow Toggle Button */}
                  <button
                    onClick={(e) => handleToggleFollow(user.id, e)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all flex items-center space-x-1 ${
                      user.isFollowing
                        ? 'bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="w-3 h-3" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {/* More Menu Dropdown Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenUserId(menuOpenUserId === user.id ? null : user.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuOpenUserId === user.id && (
                      <div className="absolute right-0 top-8 z-30 w-36 bg-[#161622] rounded-2xl border border-white/10 shadow-2xl p-1 text-xs text-slate-200 animate-fade-in">
                        <button
                          onClick={(e) => handleRemoveUser(user.id, e)}
                          className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-500/20 text-rose-300 flex items-center gap-2 font-bold"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                        <button
                          onClick={() => {
                            alert(`Reported ${user.handle} to moderation team.`);
                            setMenuOpenUserId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-slate-300 flex items-center gap-2"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
