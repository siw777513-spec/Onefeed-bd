import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Bell,
  Search,
  Radio,
  Download,
  Flame,
  Users,
  MoreVertical,
  Shield,
  Globe,
  Moon,
  Sun,
  UserX,
  User,
  Key,
  Trash2,
  HelpCircle,
  Info,
  ShieldCheck,
  FileText,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { UserProfile } from '../types';
import { SettingsTab } from './SettingsModal';

interface TopBarProps {
  onOpenCreate: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  onOpenProfile?: () => void;
  onOpenWallet?: () => void;
  onOpenFriends?: (tab?: 'friends' | 'followers' | 'subscribers') => void;
  onOpenExport?: () => void;
  onOpenDailyReward?: () => void;
  onLogout?: () => void;
  isPhoneFrame?: boolean;
  onTogglePhoneFrame?: () => void;
  unreadCount: number;
  currentUser?: UserProfile;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCreate,
  onOpenNotifications,
  onOpenSearch,
  onOpenSettings,
  onOpenProfile,
  onOpenWallet,
  onOpenFriends,
  onOpenExport,
  onOpenDailyReward,
  onLogout,
  unreadCount,
  currentUser,
}) => {
  const isOwner = currentUser?.email === 'siw777513@gmail.com';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isMenuOpen]);

  const handleOpenTab = (tab: SettingsTab) => {
    setIsMenuOpen(false);
    onOpenSettings(tab);
  };

  return (
    <header className="sticky top-0 z-[9999] bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/10 px-2 sm:px-3 py-2 flex items-center justify-between select-none shrink-0 w-full">
      {/* Logo & Brand */}
      <div className="flex items-center space-x-1.5 shrink-0 min-w-0">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-[#8A2BE2] to-[#FF007A] p-[1.5px] shadow-lg shadow-[#FF007A]/20 shrink-0">
          <div className="w-full h-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center space-x-1 min-w-0">
          <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent truncate">
            OneFeed
          </span>
          <span className="hidden sm:inline-flex text-[8px] font-bold tracking-wider px-1 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase items-center gap-0.5 shrink-0">
            <Radio className="w-2 h-2 text-cyan-400 animate-ping" />
            5-in-1
          </span>
        </div>
      </div>

      {/* Quick Action Icons & 3-Dot Button */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 ml-auto">
        {/* Daily Streak Flame */}
        {onOpenDailyReward && (
          <button
            onClick={onOpenDailyReward}
            className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all text-[11px] font-bold shrink-0"
            title="Daily Streak & Rewards"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
            <span>5</span>
          </button>
        )}

        {/* Coin Balance Pill */}
        {onOpenWallet && (
          <button
            onClick={onOpenWallet}
            className="hidden xs:flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all text-[11px] font-mono font-bold shrink-0"
            title="Wallet & Coins"
          >
            <span>🪙</span>
            <span>{currentUser?.coinBalance ?? 500}</span>
          </button>
        )}

        {/* Friends Hub Icon */}
        {onOpenFriends && (
          <button
            onClick={() => onOpenFriends('friends')}
            className="p-1.5 rounded-full text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors shrink-0"
            title="Friends Hub"
          >
            <Users className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        <button
          onClick={onOpenSearch}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Search OneFeed"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF007A] ring-2 ring-[#0A0A0F]" />
          )}
        </button>

        {onOpenExport && isOwner && (
          <button
            onClick={onOpenExport}
            className="hidden sm:flex p-1.5 rounded-full text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all items-center gap-1 text-[11px] font-bold px-2 shrink-0"
            title="Export HTML & ZIP"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export</span>
          </button>
        )}

        {/* Profile Avatar Button */}
        <button
          onClick={() => (onOpenProfile ? onOpenProfile() : handleOpenTab('profile'))}
          className="p-0.5 rounded-full ring-2 ring-cyan-400/80 hover:ring-cyan-300 transition-all shrink-0"
          title="View Profile"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt="Profile Avatar"
            className="w-5 h-5 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Create Plus Button */}
        <button
          onClick={onOpenCreate}
          className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-[#FF007A] to-[#8A2BE2] text-white text-xs font-semibold shadow-md shadow-[#FF007A]/25 hover:opacity-90 active:scale-95 transition-all shrink-0"
          title="Create Post / Short / Live"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* ALWAYS VISIBLE 3-DOT (⋮) MENU BUTTON */}
        <div className="relative shrink-0 z-[9999]" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0 border ${
              isMenuOpen
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105'
                : 'bg-white/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border-white/20 hover:border-cyan-400/50'
            }`}
            title="More Menu & Settings"
            aria-label="More Options Menu"
          >
            <MoreVertical className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Glassmorphism Dropdown Menu Overlay */}
          {isMenuOpen && (
            <div className="absolute right-0 top-11 z-[9999] w-72 sm:w-80 bg-[#12121E]/98 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-3 space-y-2.5 text-slate-100 animate-fade-in max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* User Mini Profile Header */}
              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onOpenProfile) onOpenProfile();
                  else onOpenSettings('profile');
                }}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#0E1528] via-[#121B35] to-[#18112C] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between shadow-md"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{currentUser?.name || 'OneFeed Member'}</p>
                    <p className="text-[10px] text-cyan-300/80 font-mono truncate">{currentUser?.handle || '@onefeed'}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>

              {/* 1. SETTINGS PAGE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-0.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-cyan-400">
                    1. Settings Page
                  </span>
                  <Settings className="w-3 h-3 text-cyan-400" />
                </div>

                <button
                  onClick={() => handleOpenTab('privacy')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>Privacy Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleOpenTab('privacy')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Notification Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dark Mode Inline Toggle */}
                <div className="px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center space-x-2">
                    {isDarkMode ? <Moon className="w-3.5 h-3.5 text-cyan-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                    <span>Dark Mode Toggle</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      isDarkMode ? 'bg-cyan-500 justify-end' : 'bg-white/20 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Language Switcher */}
                <button
                  type="button"
                  onClick={() => {
                    const next = lang === 'EN' ? 'BN' : 'EN';
                    setLang(next);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Language ({lang === 'EN' ? 'English' : 'Bangla'})</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30">
                    {lang}
                  </span>
                </button>

                <button
                  onClick={() => handleOpenTab('blocked')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <UserX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Blocked Users</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="h-[1px] bg-white/10 my-1" />

              {/* 2. MY ACCOUNT */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-0.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400">
                    2. My Account
                  </span>
                  <User className="w-3 h-3 text-amber-400" />
                </div>

                <button
                  onClick={() => handleOpenTab('profile')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit Profile</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleOpenTab('password')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Password</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleOpenTab('general')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 flex items-center justify-between text-xs text-rose-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Account</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="h-[1px] bg-white/10 my-1" />

              {/* 3. MORE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-0.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-400">
                    3. More
                  </span>
                  <Info className="w-3 h-3 text-purple-400" />
                </div>

                <button
                  onClick={() => handleOpenTab('help')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Help & Support</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleOpenTab('about')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>About OneFeed</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleOpenTab('about')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => handleOpenTab('about')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Terms of Service</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 font-extrabold flex items-center justify-between text-xs border border-rose-500/30 transition-all mt-1.5 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span className="font-extrabold text-rose-300">Logout</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
