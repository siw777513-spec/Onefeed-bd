import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Plus, Bell, Search, Radio, Download, Flame, Users, MoreVertical, Shield, Globe, Moon, Sun, UserX, ChevronRight, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { SettingsTab } from './SettingsModal';

interface TopBarProps {
  onOpenCreate: () => void; onOpenNotifications: () => void; onOpenSearch: () => void; onOpenSettings: (tab?: SettingsTab) => void; onOpenProfile?: () => void; onOpenWallet?: () => void; onOpenFriends?: (tab?: any) => void; onOpenExport?: () => void; onOpenDailyReward?: () => void; onLogout?: () => void; isPhoneFrame?: boolean; onTogglePhoneFrame?: () => void; unreadCount: number; currentUser?: UserProfile;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenCreate, onOpenNotifications, onOpenSearch, onOpenSettings, onOpenProfile, onOpenWallet, onOpenFriends, onOpenExport, onOpenDailyReward, onLogout, unreadCount, currentUser }) => {
  const isOwner = currentUser?.email === 'siw777513@gmail.com';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => { if (menuRef.current &&!menuRef.current.contains(e.target as Node)) setIsMenuOpen(false); };
    if (isMenuOpen) document.addEventListener('mousedown', handle, true);
    return () => document.removeEventListener('mousedown', handle, true);
  }, [isMenuOpen]);
  return (
    <header className="sticky top-0 z-[9999] bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/10 px-2 sm:px-3 py-2 flex items-center justify-between select-none shrink-0 w-full">
      <div className="flex items-center space-x-1.5 shrink-0">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-[#8A2BE2] to-[#FF007A] p-[1.5px]"><div className="w-full h-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /></div></div>
        <span className="font-extrabold text-sm tracking-tight text-white">OneFeed</span>
        <span className="hidden sm:inline-flex text-[8px] font-bold px-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Radio className="w-2 h-2 animate-ping" />5-in-1</span>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 ml-auto">
        {onOpenDailyReward && (<button onClick={onOpenDailyReward} className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold"><Flame className="w-3.5 h-3.5 fill-amber-400" /><span>5</span></button>)}
        {onOpenWallet && (<button onClick={onOpenWallet} className="flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[12px] font-black shadow-lg">💰 {currentUser?.coinBalance?? 500}</button>)}
        {onOpenFriends && (<button onClick={() => onOpenFriends('friends')} className="p-1.5 rounded-full hover:bg-white/10"><Users className="w-4 h-4 text-cyan-400" /></button>)}
        <button onClick={onOpenSearch} className="p-1.5 rounded-full hover:bg-white/10"><Search className="w-4 h-4 text-slate-300" /></button>
        <button onClick={onOpenNotifications} className="relative p-1.5 rounded-full hover:bg-white/10"><Bell className="w-4 h-4 text-slate-300" />{unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF007A]" />}</button>
        {isOwner && onOpenExport && (<button onClick={onOpenExport} className="hidden sm:flex px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px]"><Download className="w-3.5 h-3.5" />Export</button>)}
        <button onClick={() => (onOpenProfile? onOpenProfile() : onOpenSettings('profile'))} className="p-0.5 rounded-full ring-2 ring-cyan-400"><img src={currentUser?.avatar || 'https://i.pravatar.cc/150?u=user'} className="w-5 h-5 rounded-full" /></button>
        <button onClick={onOpenCreate} className="p-1.5 sm:px-2.5 rounded-full bg-gradient-to-r from-[#FF007A] to-[#8A2BE2] text-white"><Plus className="w-4 h-4" /></button>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 rounded-xl bg-white/10 border border-white/20"><MoreVertical className="w-4 h-4 text-cyan-300" /></button>
          {isMenuOpen && (
            <div className="absolute right-0 top-11 w-72 bg-[#12121E] border border-white/20 rounded-2xl shadow-2xl p-3 space-y-2">
              <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between"><div className="flex items-center gap-2"><img src={currentUser?.avatar} className="w-8 h-8 rounded-full" /><div><p className="text-xs font-bold text-white">{currentUser?.name}</p><p className="text-[10px] text-white/60">{currentUser?.handle}</p></div></div><ChevronRight className="w-4 h-4 text-white/40" /></div>
              <button onClick={() => { setIsMenuOpen(false); onOpenSettings('privacy'); }} className="w-full text-left px-2 py-1.5 rounded-xl hover:bg-white/10 flex justify-between text-xs text-white"><span className="flex gap-2"><Shield className="w-3.5 h-3.5" />Privacy</span><ChevronRight className="w-3 h-3" /></button>
              <button onClick={() => { setIsMenuOpen(false); if (onLogout) onLogout(); }} className="w-full px-2 py-2 rounded-xl bg-rose-500/15 text-rose-400 text-xs font-bold flex justify-between"><span className="flex gap-2"><LogOut className="w-4 h-4" />Logout</span><ChevronRight className="w-3 h-3" /></button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
