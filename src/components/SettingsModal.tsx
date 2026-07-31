import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Bell,
  Globe,
  Trash2,
  LogOut,
  Save,
  CheckCircle2,
  Camera,
  Sparkles,
  Lock,
  ShieldAlert,
  DollarSign,
  Coins,
  Download,
  Key,
  UserX,
  HelpCircle,
  Info,
  FileText,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Send,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { UserProfile, UserSettings } from '../types';

export type SettingsTab =
  | 'profile'
  | 'privacy'
  | 'general'
  | 'password'
  | 'blocked'
  | 'about'
  | 'help'
  | 'delete';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentUser?: UserProfile;
  settings: UserSettings;
  initialTab?: SettingsTab;
  onSaveProfile: (updated: UserProfile) => void;
  onSaveSettings: (updated: UserSettings) => void;
  onResetData: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenMonetization?: () => void;
  onOpenWallet?: () => void;
  onOpenExport?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
];

const INITIAL_BLOCKED = [
  { id: 'b1', handle: '@spam_bot_99', name: 'Spam Bot 99' },
  { id: 'b2', handle: '@troll_account_v2', name: 'Troll User' },
];

const FAQS = [
  {
    q: 'How do I upload Shorts and Watch videos?',
    a: 'Click the "+" button in TopBar, select "Shorts" or "Watch" tab, attach your video or enter a URL, and tap Post.',
  },
  {
    q: 'How do I earn Coins and withdraw money?',
    a: 'Users can send you digital gifts on your posts or live streams. You can convert coins to cash in Wallet & Earnings.',
  },
  {
    q: 'Is my data stored locally or synced?',
    a: 'OneFeed uses IndexedDB and local storage for instant zero-latency performance.',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentUser,
  settings,
  initialTab = 'profile',
  onSaveProfile,
  onSaveSettings,
  onResetData,
  onLogout,
  onDeleteAccount,
  onOpenAdminPanel,
  onOpenMonetization,
  onOpenWallet,
  onOpenExport,
}) => {
  const activeUser = currentUser || profile;
  const userEmail = (activeUser?.email || '').toLowerCase().trim();
  const isOwner = userEmail === 'siw777513@gmail.com';

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const [name, setName] = useState(activeUser.name || profile.name);
  const [email, setEmail] = useState(activeUser.email || profile.email);
  const [bio, setBio] = useState(activeUser.bio || profile.bio);
  const [avatar, setAvatar] = useState(activeUser.avatar || profile.avatar);
  const [cover, setCover] = useState(activeUser.coverImage || profile.coverImage);

  const [privateAcc, setPrivateAcc] = useState(settings.privateAccount);
  const [notif, setNotif] = useState(settings.notificationsEnabled);
  const [lang, setLang] = useState<'en' | 'bn'>(settings.language);
  const [darkMode, setDarkMode] = useState<boolean>(settings.darkMode ?? true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMessage, setPassMessage] = useState<string | null>(null);

  // Blocked users state
  const [blockedList, setBlockedList] = useState(INITIAL_BLOCKED);
  const [newBlockHandle, setNewBlockHandle] = useState('');

  // Legal Subtab
  const [legalSubTab, setLegalSubTab] = useState<'about' | 'privacy' | 'terms'>('about');

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact support state
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '' });
  const [ticketSent, setTicketSent] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const isBn = lang === 'bn';

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    const isNewOwner = cleanEmail === 'siw777513@gmail.com';

    onSaveProfile({
      ...profile,
      name,
      email: cleanEmail,
      bio,
      avatar,
      coverImage: cover,
      isAdmin: isNewOwner,
    });
    onSaveSettings({
      privateAccount: privateAcc,
      notificationsEnabled: notif,
      language: lang,
      darkMode,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPassMessage('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      setPassMessage('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage('New passwords do not match');
      return;
    }
    setPassMessage('Password changed successfully! ✓');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassMessage(null), 3000);
  };

  const handleUnblock = (id: string) => {
    setBlockedList((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockHandle.trim()) return;
    const handle = newBlockHandle.startsWith('@') ? newBlockHandle : `@${newBlockHandle}`;
    setBlockedList((prev) => [
      ...prev,
      { id: Date.now().toString(), handle, name: handle.replace('@', '') },
    ]);
    setNewBlockHandle('');
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCover(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportTicket.message.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setSupportTicket({ subject: '', message: '' });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#12121E]/95 rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#0A0A10]/90 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-md">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {isBn ? 'সেটিংস ও অ্যাকাউন্ট' : 'Settings & Account'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Manage preferences and profile</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar border-b border-white/10 bg-[#0E0E18] p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'profile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'privacy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'password'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Password</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'general'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>General</span>
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'blocked'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5 text-rose-400" />
            <span>Blocked</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'about'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>About</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'help'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
            <span>Help</span>
          </button>
        </div>

        {/* Main Content Area */}
        <form onSubmit={handleSaveAll} className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* User Status Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0D1322] via-[#0E172A] to-[#13112A] border border-white/10 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={activeUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={activeUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/40 shrink-0 shadow-md"
              />
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <p className="text-xs font-black text-white truncate">{activeUser.name}</p>
                  {isOwner ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40">
                      Super Admin
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Member
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate font-mono">{activeUser.email}</p>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center space-x-1.5 transition-all shrink-0 ml-2 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* TAB: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              {/* Cover Banner */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Cover Banner
                </label>
                <div className="relative rounded-xl overflow-hidden aspect-[3/1] border border-white/10 group mb-2">
                  <img src={cover} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Camera className="w-5 h-5 text-white mr-1" />
                    <span className="text-xs font-bold text-white">Change Cover</span>
                    <input type="file" accept="image/*" onChange={handleCoverFile} className="hidden" />
                  </label>
                </div>

                <div className="flex space-x-2">
                  {COVER_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCover(p)}
                      className="w-12 h-6 rounded border border-white/20 overflow-hidden shrink-0 hover:scale-105 transition-transform"
                    >
                      <img src={p} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Profile Avatar
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0 group">
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                  </div>

                  <div className="flex-1 flex items-center space-x-2">
                    {AVATAR_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(p)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                          avatar === p ? 'border-cyan-400 scale-105' : 'border-white/20 opacity-70'
                        }`}
                      >
                        <img src={p} alt="Avatar Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Email & Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#0A0A10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0A0A10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Bio / Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0A0A10] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB: PRIVACY & NOTIFICATIONS */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Private Account</p>
                    <p className="text-[10px] text-slate-400">Only approved followers can view your posts</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivateAcc(!privateAcc)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    privateAcc ? 'bg-cyan-500 justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Push Notifications</p>
                    <p className="text-[10px] text-slate-400">Alerts for likes, comments & new subscribers</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotif(!notif)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notif ? 'bg-purple-500 justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10 space-y-2">
                <p className="text-xs font-bold text-white">Direct Message Permissions</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold text-left"
                  >
                    Everyone
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-left"
                  >
                    Friends Only
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Key className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">Change Account Password</h4>
                </div>

                {passMessage && (
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    {passMessage}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#12121E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 pr-9 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-[#12121E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 pr-9 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#12121E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* TAB: GENERAL & LANGUAGE & DARK MODE */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fade-in">
              {/* Dark Mode Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Dark Mode Atmosphere</p>
                    <p className="text-[10px] text-slate-400">Low-glare eye-safe theme</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    darkMode ? 'bg-cyan-500 justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Language Selection */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">App Language</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      lang === 'en'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    English (US)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('bn')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      lang === 'bn'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                </div>
              </div>

              {/* Reset Data */}
              <div className="p-3.5 rounded-2xl bg-[#2A141A] border border-rose-500/30">
                <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4" />
                  Reset Local Storage
                </p>
                <p className="text-[10px] text-rose-200/80 my-1">
                  Clear local feed caches and restore clean state.
                </p>
                {showConfirmReset ? (
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetData();
                        setShowConfirmReset(false);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmReset(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(true)}
                    className="mt-1 text-xs text-rose-400 underline hover:text-rose-300 font-semibold"
                  >
                    Reset Storage
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB: BLOCKED USERS */}
          {activeTab === 'blocked' && (
            <div className="space-y-4 animate-fade-in">
              <form onSubmit={handleAddBlock} className="flex gap-2">
                <input
                  type="text"
                  value={newBlockHandle}
                  onChange={(e) => setNewBlockHandle(e.target.value)}
                  placeholder="Block user by @handle..."
                  className="flex-1 bg-[#0A0A10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
                >
                  Block
                </button>
              </form>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400">Blocked Accounts ({blockedList.length})</h4>
                {blockedList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No blocked users</p>
                ) : (
                  blockedList.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A10] border border-white/10"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{user.handle}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnblock(user.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 text-[11px] font-bold border border-white/10 transition-colors"
                      >
                        Unblock
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: ABOUT & LEGAL */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex border-b border-white/10 bg-[#0A0A10] rounded-xl p-1 gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLegalSubTab('about')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    legalSubTab === 'about' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
                  }`}
                >
                  About OneFeed
                </button>
                <button
                  type="button"
                  onClick={() => setLegalSubTab('privacy')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    legalSubTab === 'privacy' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
                  }`}
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => setLegalSubTab('terms')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    legalSubTab === 'terms' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
                  }`}
                >
                  Terms of Service
                </button>
              </div>

              {legalSubTab === 'about' && (
                <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-white text-sm">OneFeed v5.2.0</span>
                  </div>
                  <p>
                    OneFeed is an all-in-one 5-in-1 social platform combining Social Feed, Short Video Reels, Watch Streams, Stories, and Real-time Messaging into a single fluid interface.
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 font-mono space-y-1">
                    <p>Engine: React 18 + Tailwind CSS</p>
                    <p>Storage: IndexedDB & Local Storage</p>
                    <p>© 2026 OneFeed Inc. All rights reserved.</p>
                  </div>
                </div>
              )}

              {legalSubTab === 'privacy' && (
                <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10 space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar">
                  <h4 className="font-bold text-white">Privacy Policy Overview</h4>
                  <p>
                    1. <strong>Data Collection:</strong> We respect user privacy. Profile settings and feeds are saved directly on your client device using browser persistent storage.
                  </p>
                  <p>
                    2. <strong>Security:</strong> All communication media and direct chats are processed locally with strict client security measures.
                  </p>
                </div>
              )}

              {legalSubTab === 'terms' && (
                <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10 space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar">
                  <h4 className="font-bold text-white">Terms of Service</h4>
                  <p>
                    1. <strong>Community Standards:</strong> Harassment, spam, and unlawful media distribution are strictly prohibited.
                  </p>
                  <p>
                    2. <strong>Content Ownership:</strong> Users retain ownership of posts created and uploaded to OneFeed.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: HELP & SUPPORT */}
          {activeTab === 'help' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  Frequently Asked Questions
                </h4>
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="rounded-xl bg-[#0A0A10] border border-white/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-3 text-left font-bold text-xs text-white flex items-center justify-between"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-3 pt-0 text-xs text-slate-300 border-t border-white/5 bg-black/20">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Support Ticket Form */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A10] border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white">Contact OneFeed Support</h4>
                {ticketSent ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold text-center">
                    Support ticket submitted! We will respond shortly.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={supportTicket.subject}
                      onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                      placeholder="Subject / Issue..."
                      className="w-full bg-[#12121E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <textarea
                      value={supportTicket.message}
                      onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                      rows={2}
                      placeholder="Describe your issue or feedback..."
                      className="w-full bg-[#12121E] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleSupportSubmit}
                      className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Ticket</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Profile Button (for profile/privacy/general) */}
          {(activeTab === 'profile' || activeTab === 'privacy' || activeTab === 'general') && (
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all mt-4"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
