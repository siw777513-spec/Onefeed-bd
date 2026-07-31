import React, { useState } from 'react';
import {
  X,
  User,
  Settings,
  Edit3,
  Heart,
  MessageCircle,
  Share2,
  Users,
  UserCheck,
  UserPlus,
  Sparkles,
  Shield,
  CheckCircle2,
  FileText,
  Info,
  Lock,
  Mail,
  Calendar,
  Coins,
  Globe,
  Award,
  Zap,
  Tv,
  LayoutGrid,
} from 'lucide-react';
import { SocialItem, UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserProfile;
  currentUser: UserProfile;
  items: SocialItem[];
  onLikeToggle: (id: string) => void;
  onOpenDetail: (item: SocialItem) => void;
  onOpenSettings: () => void;
  onOpenFriends?: (tab?: 'friends' | 'followers' | 'subscribers') => void;
  onFollowUser?: (handle: string) => void;
  followingHandles?: string[];
}

// Sample followers data for interactive list
const SAMPLE_MOCK_USERS = [
  {
    name: 'Aria Vance',
    handle: '@aria_v',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Tokyo Tech Explorer & UI Designer ⛩️',
    isFollowing: true,
  },
  {
    name: 'CyberSamurai',
    handle: '@cyber_samurai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Unreal Engine 5 & VR Developer 🎮',
    isFollowing: true,
  },
  {
    name: 'Sarah Jenkins',
    handle: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Shorts creator & digital nomad 🌏',
    isFollowing: false,
  },
  {
    name: 'Tech Insider',
    handle: '@tech_daily',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    bio: 'Breaking AI & gadget news daily ⚡',
    isFollowing: true,
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  items,
  onLikeToggle,
  onOpenDetail,
  onOpenSettings,
  onOpenFriends,
  onFollowUser,
  followingHandles = ['@aria_v', '@cyber_samurai', '@tech_daily'],
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'followers' | 'following' | 'about'>('posts');
  const [followingState, setFollowingState] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    SAMPLE_MOCK_USERS.forEach((u) => {
      map[u.handle] = followingHandles.includes(u.handle);
    });
    return map;
  });

  if (!isOpen) return null;

  const isSelf = currentUser.email.toLowerCase().trim() === targetUser.email.toLowerCase().trim() ||
    currentUser.handle === targetUser.handle;
  const isOwner = targetUser.email.toLowerCase().trim() === 'siw777513@gmail.com';

  // Filter user posts
  const myPosts = items.filter((item) => {
    if (isSelf) return true; // Show all items authored by self or current user
    return item.author.handle.toLowerCase() === targetUser.handle.toLowerCase();
  });

  // Filter liked posts
  const likedPosts = items.filter((item) => item.isLiked);

  // Stats calculation
  const totalLikes = items.reduce((acc, curr) => acc + (curr.isLiked ? 1 : 0) + (curr.likeCount || 0), 0);
  const totalComments = items.reduce((acc, curr) => acc + (curr.commentCount || 0) + (curr.comments?.length || 0), 0);
  const totalShares = items.reduce((acc, curr) => acc + (curr.shareCount || 0), 0);

  const toggleFollowLocal = (handle: string) => {
    setFollowingState((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
    if (onFollowUser) {
      onFollowUser(handle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0D0D18] rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Cover Image & Header Actions */}
        <div className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 overflow-hidden shrink-0">
          <img
            src={targetUser.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D18] via-transparent to-black/40" />

          {/* Header Controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-extrabold text-cyan-300 border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              OneFeed Profile
            </span>
            <div className="flex items-center space-x-2">
              {isSelf && (
                <button
                  onClick={onOpenSettings}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-slate-200 hover:text-white hover:bg-black/80 border border-white/10 transition-all shadow-md"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-slate-200 hover:text-white hover:bg-black/80 border border-white/10 transition-all shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info Header Section */}
        <div className="px-5 pb-3 -mt-12 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10">
          <div className="flex items-end space-x-3">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-[#0D0D18] shadow-2xl shrink-0 bg-slate-800">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {isOwner && (
                <div className="absolute bottom-0 inset-x-0 bg-red-600/90 text-[8px] font-black text-white text-center py-0.5 uppercase tracking-wider">
                  Owner
                </div>
              )}
            </div>

            <div className="mb-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  {targetUser.name}
                  {isOwner ? (
                    <CheckCircle2 className="w-4 h-4 text-red-400 fill-red-400/20 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </h2>
              </div>
              <p className="text-xs font-mono text-cyan-400 font-semibold">{targetUser.handle}</p>
              <p className="text-[11px] text-slate-400 font-mono">{targetUser.email}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 self-start sm:self-auto mb-1">
            {isSelf ? (
              <button
                onClick={onOpenSettings}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => toggleFollowLocal(targetUser.handle)}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
                  followingState[targetUser.handle]
                    ? 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-cyan-500/20'
                }`}
              >
                {followingState[targetUser.handle] ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bio Banner */}
        <div className="px-5 py-3 border-b border-white/5 bg-[#0B0B14]">
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {targetUser.bio || 'Welcome to my official OneFeed profile page! ✨'}
          </p>
        </div>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-6 gap-1 px-3 py-2 bg-[#090912] border-b border-white/10 text-center select-none shrink-0">
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-center text-rose-400 mb-0.5">
              <Heart className="w-3 h-3" />
            </div>
            <p className="text-xs font-black text-white">{totalLikes}</p>
            <p className="text-[9px] text-slate-400 font-medium uppercase">Likes</p>
          </div>

          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-center text-cyan-400 mb-0.5">
              <MessageCircle className="w-3 h-3" />
            </div>
            <p className="text-xs font-black text-white">{totalComments}</p>
            <p className="text-[9px] text-slate-400 font-medium uppercase">Comments</p>
          </div>

          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-center text-purple-400 mb-0.5">
              <Share2 className="w-3 h-3" />
            </div>
            <p className="text-xs font-black text-white">{totalShares}</p>
            <p className="text-[9px] text-slate-400 font-medium uppercase">Shares</p>
          </div>

          <button
            onClick={() => {
              if (onOpenFriends) {
                onOpenFriends('followers');
              } else {
                setActiveTab('followers');
              }
            }}
            className={`p-1.5 rounded-xl border transition-all ${
              activeTab === 'followers' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center text-emerald-400 mb-0.5">
              <Users className="w-3 h-3" />
            </div>
            <p className="text-xs font-black text-white">{targetUser.followersCount ?? 1240}</p>
            <p className="text-[9px] text-slate-400 font-medium uppercase">Followers</p>
          </button>

          <button
            onClick={() => {
              if (onOpenFriends) {
                onOpenFriends('friends');
              } else {
                setActiveTab('following');
              }
            }}
            className={`p-1.5 rounded-xl border transition-all ${
              activeTab === 'following' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center text-amber-400 mb-0.5">
              <UserCheck className="w-3 h-3" />
            </div>
            <p className="text-xs font-black text-white">{targetUser.followingCount ?? 380}</p>
            <p className="text-[9px] text-slate-400 font-medium uppercase">Following</p>
          </button>

          <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-center text-pink-400 mb-0.5">
              <Award className="w-3 h-3" />
            </div>
            <p className="text-xs font-black text-white">{targetUser.subscribersCount ?? 28}</p>
            <p className="text-[9px] text-slate-400 font-medium uppercase">Subs</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-[#0A0A12] text-xs font-bold">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 transition-all border-b-2 flex items-center justify-center space-x-1 ${
              activeTab === 'posts'
                ? 'text-cyan-400 border-cyan-400 bg-white/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Posts ({myPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-2.5 transition-all border-b-2 flex items-center justify-center space-x-1 ${
              activeTab === 'liked'
                ? 'text-rose-400 border-rose-400 bg-white/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liked ({likedPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-2.5 transition-all border-b-2 flex items-center justify-center space-x-1 ${
              activeTab === 'followers'
                ? 'text-emerald-400 border-emerald-400 bg-white/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Followers</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2.5 transition-all border-b-2 flex items-center justify-center space-x-1 ${
              activeTab === 'following'
                ? 'text-amber-400 border-amber-400 bg-white/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2.5 transition-all border-b-2 flex items-center justify-center space-x-1 ${
              activeTab === 'about'
                ? 'text-purple-400 border-purple-400 bg-white/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3 min-h-[220px]">
          {/* POSTS TAB */}
          {activeTab === 'posts' && (
            <div>
              {myPosts.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No posts published yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onOpenDetail(post)}
                      className="group relative bg-[#121220] rounded-xl border border-white/10 hover:border-cyan-400/50 overflow-hidden cursor-pointer transition-all shadow-md"
                    >
                      <div className="aspect-square w-full relative bg-slate-900">
                        <img
                          src={post.image}
                          alt={post.text}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end justify-between">
                          <span className="text-[10px] font-bold text-white flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                            {post.likeCount}
                          </span>
                          <span className="text-[10px] font-bold text-white flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-cyan-400" />
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-slate-200 line-clamp-1 font-medium">{post.text}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{post.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LIKED TAB */}
          {activeTab === 'liked' && (
            <div>
              {likedPosts.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-40 text-rose-400" />
                  <p className="text-xs font-semibold">No liked posts yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {likedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onOpenDetail(post)}
                      className="group relative bg-[#121220] rounded-xl border border-white/10 hover:border-rose-400/50 overflow-hidden cursor-pointer transition-all shadow-md"
                    >
                      <div className="aspect-square w-full relative bg-slate-900">
                        <img
                          src={post.image}
                          alt={post.text}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500 text-white shadow-lg">
                          <Heart className="w-3 h-3 fill-white" />
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-slate-200 line-clamp-1 font-medium">{post.text}</p>
                        <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{post.author.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FOLLOWERS TAB */}
          {activeTab === 'followers' && (
            <div className="space-y-2">
              {SAMPLE_MOCK_USERS.map((user) => (
                <div
                  key={user.handle}
                  className="p-3 rounded-2xl bg-[#121220] border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-400/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] font-mono text-cyan-400">{user.handle}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.bio}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowLocal(user.handle)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ml-2 ${
                      followingState[user.handle]
                        ? 'bg-slate-800 text-slate-300 border border-white/10'
                        : 'bg-cyan-500 text-black font-extrabold'
                    }`}
                  >
                    {followingState[user.handle] ? 'Following' : 'Follow Back'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* FOLLOWING TAB */}
          {activeTab === 'following' && (
            <div className="space-y-2">
              {SAMPLE_MOCK_USERS.filter((u) => followingState[u.handle]).map((user) => (
                <div
                  key={user.handle}
                  className="p-3 rounded-2xl bg-[#121220] border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] font-mono text-amber-400">{user.handle}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.bio}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowLocal(user.handle)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 transition-all shrink-0 ml-2"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#121220] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                  </span>
                  <span className="font-bold text-white">{targetUser.name}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Email
                  </span>
                  <span className="font-bold font-mono text-cyan-300">{targetUser.email}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Account Role
                  </span>
                  <span className="font-bold text-white">
                    {isOwner ? '👑 Owner & Super Admin' : '👤 Verified Community Member'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> Coin Balance
                  </span>
                  <span className="font-bold font-mono text-amber-300">🪙 {targetUser.coinBalance ?? 500}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" /> Joined Platform
                  </span>
                  <span className="font-bold text-slate-300">July 2026</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
