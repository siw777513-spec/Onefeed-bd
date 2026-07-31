import React, { useState } from 'react';
import { Sparkles, Mail, User, ArrowRight, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!cleanEmail ||!cleanEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
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
       ? 'Owner & Lead Engineer of OneFeed platform.'
        : 'OneFeed community member 🚀',
      followersCount: isOwner? 1240 : 42,
      followingCount: isOwner? 380 : 18,
      isAdmin: isOwner,
      coinBalance: isOwner? 500 : 100,
      totalEarnings: isOwner? 148.50 : 0,
      availableBalance: isOwner? 112.00 : 0,
      subscribersCount: isOwner? 28 : 0,
      giftsReceivedCount: isOwner? 142 : 0,
    };

    setTimeout(() => {
      try {
        localStorage.setItem('onefeed_currentUser', JSON.stringify(newUser));
      } catch (err) {
        console.error('Failed to save user', err);
      }
      setLoading(false);
      onLoginSuccess(newUser);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A10]/95 backdrop-blur-xl">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#12121E] border border-white/10 rounded-3xl p-8 shadow-2xl text-slate-100 flex flex-col items-center">
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-[2px]">
            <div className="w-full h-full bg-[#0A0A10] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">OneFeed</h1>
            <p className="text-[11px] text-slate-400">Welcome Back</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full bg-[#0A0A10] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-[#0A0A10] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#0A0A10] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" required />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50">
            {loading? <span>Signing in...</span> : <><span>Login to OneFeed</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};
