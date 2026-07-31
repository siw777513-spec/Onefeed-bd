import React, { useState } from 'react';
import { Sparkles, Mail, User, Shield, CheckCircle, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    if (!cleanName) {
      setError('Please enter your full name');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    const isOwner = cleanEmail === 'siw777513@gmail.com';

    const newUser: UserProfile = {
      name: cleanName,
      handle: `@${cleanName.toLowerCase().replace(/\s+/g, '_')}`,
      email: cleanEmail,
      avatar: isOwner
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      bio: isOwner
        ? 'Owner & Lead Engineer of OneFeed platform. 🛡️ Global Admin'
        : 'OneFeed community member 🚀 Exploring Feed, Shorts, Watch & Story.',
      followersCount: isOwner ? 1240 : 42,
      followingCount: isOwner ? 380 : 18,
      isAdmin: isOwner,
      coinBalance: isOwner ? 500 : 100,
      totalEarnings: isOwner ? 148.50 : 0,
      availableBalance: isOwner ? 112.00 : 0,
      subscribersCount: isOwner ? 28 : 0,
      giftsReceivedCount: isOwner ? 142 : 0,
    };

    setTimeout(() => {
      try {
        localStorage.setItem('onefeed_currentUser', JSON.stringify(newUser));
      } catch (err) {
        console.error('Failed to save user to localStorage', err);
      }
      setLoading(false);
      onLoginSuccess(newUser);
    }, 400);
  };

  const handleSelectPreset = (presetName: string, presetEmail: string) => {
    setName(presetName);
    setEmail(presetEmail);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A10]/95 backdrop-blur-xl animate-fade-in">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#12121E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0A0A10] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              OneFeed
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Email Authentication Portal</p>
          </div>
        </div>

        <p className="text-xs text-center text-slate-400 mt-1 mb-6">
          Sign in with your email address to access your personalized feed, wallet, shorts & messages.
        </p>

        {/* Quick Demo Preset Accounts */}
        <div className="w-full mb-5">
          <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
            Quick Login Presets
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelectPreset('Alex Vance (Owner)', 'siw777513@gmail.com')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${
                email.toLowerCase().trim() === 'siw777513@gmail.com'
                  ? 'bg-red-500/15 border-red-500/50 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <p className="text-[9px] text-slate-400 truncate">siw777513@gmail.com</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('Demo Member', 'user@onefeed.com')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${
                email.toLowerCase().trim() === 'user@onefeed.com'
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Normal Member</p>
                <p className="text-[9px] text-slate-400 truncate">user@onefeed.com</p>
              </div>
            </button>
          </div>
        </div>

        <div className="w-full flex items-center my-1 mb-5">
          <div className="flex-1 border-t border-white/10" />
          <span className="px-3 text-[10px] text-slate-500 font-bold uppercase">or enter credentials</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Vance"
                className="w-full bg-[#0A0A10] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. siw777513@gmail.com or user@example.com"
                className="w-full bg-[#0A0A10] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
            {email.toLowerCase().trim() === 'siw777513@gmail.com' && (
              <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Super Admin access recognized
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Continue to OneFeed</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-5">
          🔒 Secured session saved locally to your device.
        </p>
      </div>
    </div>
  );
};
