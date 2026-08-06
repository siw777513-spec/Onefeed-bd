import React, { useState } from 'react';
import { Sparkles, Mail, User, Lock, Eye } from 'lucide-react';
import { UserProfile } from '../types';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const LoginModal = ({onLoginSuccess}: {onLoginSuccess:(u:UserProfile)=>void}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const makeProfile = (n:string,e:string, guest=false): UserProfile => ({
    name: n, handle: `@${n.toLowerCase().replace(/\s+/g,'_')}`, email: e,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${n}`,
    coverImage: '', bio: guest?'Guest Viewer':'OneFeed Member', followersCount:0, followingCount:0,
    isAdmin: false, coinBalance: guest?0:100, isGuest: guest
  } as any);

  const handleAuth = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!email.includes('@') || password.length<6){ setError('Valid Email & Password min 6 chars'); return; }
    setLoading(true); setError('');
    try{
      let cred;
      if(isSignUp) cred = await createUserWithEmailAndPassword(auth, email, password);
      else cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = makeProfile(name||email.split('@')[0], email, false);
      try{ await setDoc(doc(db,"users",cred.user.uid), {...profile, uid:cred.user.uid}, {merge:true}); }catch{}
      localStorage.setItem('onefeed_currentUser', JSON.stringify(profile));
      onLoginSuccess(profile);
    }catch(err:any){ setError(err.message); }
    setLoading(false);
  };

  const handleGuest = ()=>{
    const guestProfile = makeProfile('Guest Viewer','guest@onefeed.com', true);
    localStorage.setItem('onefeed_currentUser', JSON.stringify(guestProfile));
    localStorage.setItem('onefeed_isGuest','true');
    onLoginSuccess(guestProfile);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-[#12121E] border border-white/10 rounded-3xl p-7">
        <div className="flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center"><Sparkles className="w-5 h-5 text-black"/></div><div><h1 className="text-xl font-black text-white">OneFeed</h1><p className="text-[11px] text-white/40">First Time? Sign Up or Continue as Guest</p></div></div>

        <form onSubmit={handleAuth} className="space-y-3">
          {isSignUp && <div className="relative"><User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white" required={isSignUp}/></div>}
          <div className="relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white" required/></div>
          <div className="relative"><Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ chars)" type="password" className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white" required/></div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-xl">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm">{loading? 'Loading...' : (isSignUp?'Sign Up & Login':'Login')}</button>
        </form>

        <button onClick={()=>setIsSignUp(!isSignUp)} className="w-full text-xs text-white/50 mt-3 hover:text-white">{isSignUp? 'Already have account? Login' : "New here? Create Account (Sign Up)"}</button>

        <div className="flex items-center my-4"><div className="flex-1 h-px bg-white/10"/><span className="px-2 text-[10px] text-white/30">OR</span><div className="flex-1 h-px bg-white/10"/></div>

        <button onClick={handleGuest} className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10"><Eye className="w-4 h-4"/> Continue as Guest (View Only)</button>
        <p className="text-[10px] text-white/30 text-center mt-2">Guest cannot Like, Comment, Post - Only View</p>
      </div>
    </div>
  )
    }
