import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Plus, Bell, Search, Radio, Download, Flame, Users, MoreVertical, Shield, Globe, Moon, Sun, UserX, User, Key, Trash2, HelpCircle, Info, ShieldCheck, FileText, LogOut, ChevronRight, Settings,
} from 'lucide-react';
import { UserProfile } from '../types';
import { SettingsTab } from './SettingsModal';

interface TopBarProps {
  onOpenCreate: () => void; onOpenNotifications: () => void; onOpenSearch: () => void; onOpenSettings: (tab?: SettingsTab) => void; onOpenProfile?: () => void; onOpenWallet?: () => void; onOpenFriends?: (tab?: 'friends' | 'followers' | 'subscribers') => void; onOpenExport?: () => void; onOpenDailyReward?: () => void; onLogout?: () => void; isPhoneFrame?: boolean; onTogglePhoneFrame?: () => void; unreadCount: number; currentUser?: UserProfile;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenCreate, onOpenNotifications, onOpenSearch, onOpenSettings, onOpenProfile, onOpenWallet, onOpenFriends, onOpenExport, onOpenDailyReward, onLogout, unreadCount, currentUser }) => {
  const isOwner = currentUser?.email === 'siw777513@gmail.com';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (menuRef.current &&!menuRef.current.contains(e.target as Node)) setIsMenuOpen(false); };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isMenuOpen]);
  const handleOpenTab = (tab: SettingsTab) => { setIsMenuOpen(false); onOpenSettings(tab); };
  return (
    <header className="sticky top-0 z-[9999] bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/10 px-2 sm:px-3 py-2 flex items-center justify-between select-none shrink-0 w-full">
      <div className="flex items-center space-x-1.5 shrink-0 min-w-0">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-[#8A2BE2] to-[#FF007A] p-[1.5px] shadow-lg shadow-[#FF007A]/20 shrink-0">
          <div className="w-full h-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /></div>
        </div>
        <div className="flex items-center space-x-1 min-w-0">
          <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent truncate">OneFeed</span>
          <span className="hidden sm:inline-flex text-[8px] font-bold tracking-wider px-1 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase items-center gap-0.5 shrink-0"><Radio className="w-2 h-2 text-cyan-400 animate-ping" />5-in-1</span>
        </div>
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 ml-auto">
        {onOpenDailyReward && (<button onClick={onOpenDailyReward} className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold shrink-0"><Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" /><span>5</span></button>)}

        {/* WALLET BUTTON - FIXED VISIBLE ON MOBILE */}
        {onOpenWallet && (<button onClick={onOpenWallet} className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 border border-amber-300 text-black text-[12px] font-black shrink-0 shadow-lg shadow-amber-500/30 animate-pulse"><span>💰</span><span>{currentUser?.coinBalance?? 500}</span></button>)}

        {onOpenFriends && (<button onClick={() => onOpenFriends('friends')} className="p-1.5 rounded-full text-slate-300 hover:text-cyan-400 hover:bg-white/10 shrink-0"><Users className="w-4 h-4 text-cyan-400" /></button>)}
        <button onClick={onOpenSearch} className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 shrink-0"><Search className="w-4 h-4" /></button>
        <button onClick={onOpenNotifications} className="relative p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 shrink-0"><Bell className="w-4 h-4" />{unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF007A] ring-2 ring-[#0A0A0F]" />}</button>
        {onOpenExport && isOwner && (<button onClick={onOpenExport} className="hidden sm:flex p-1.5 rounded-full text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold px-2 shrink-0"><Download className="w-3.5 h-3.5 text-cyan-400" /><span>Export</span></button>)}
        <button onClick={() => (onOpenProfile? onOpenProfile() : handleOpenTab('profile'))} className="p-0.5 rounded-full ring-2 ring-cyan-400/80 hover:ring-cyan-300 shrink-0"><img src={currentUser?.avatar || 'https://i.pravatar.cc/150?u=user'} alt="Profile" className="w-5 h-5 rounded-full object-cover" /></button>
        <button onClick={onOpenCreate} className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-[#FF007A] to-[#8A2BE2] text-white text-xs font-semibold shadow-md shadow-[#FF007A]/25 shrink-0"><Plus className="w-4 h-4 stroke-[2.5]" /></button>
        <div className="relative shrink-0 z-[9999]" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-1.5 rounded-xl flex items-center justify-center shrink-0 border ${isMenuOpen? 'bg-cyan-500 text-black border-cyan-300' : 'bg-white/10 text-cyan-300 border-white/20'}`}><MoreVertical className="w-4 h-4 stroke-[2.5]" /></button>
          {isMenuOpen && (
            <div className="absolute right-0 top-11 z-[9999] w-72 sm:w-80 bg-[#12121E]/98 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-3 space-y-2.5 text-slate-100 max-h-[80vh] overflow-y-auto">
              <div onClick={() => { setIsMenuOpen(false); if (onOpenProfile) onOpenProfile(); else onOpenSettings('profile'); }} className="p-2.5 rounded-2xl bg-gradient-to-r from-[#0E1528] to-[#18112C] border border-cyan-500/30 flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img src={currentUser?.avatar || 'https://i.pravatar.cc/150?u=user'} alt="User" className="w-8 h-8 rounded-full border-2 border-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">OneFeed User</p>
                    <p className="text-[10px] text-cyan-300/80 font-mono truncate">@onefeed_user</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase text-cyan-400 px-2">Settings</span>
                <button onClick={() => handleOpenTab('privacy')} className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs"><div className="flex items-center space-x-2"><Shield className="w-3.5 h-3.5 text-purple-400" /><span>Privacy Settings</span></div><ChevronRight className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleOpenTab('blocked')} className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs"><div className="flex items-center space-x-2"><UserX className="w-3.5 h-3.5 text-rose-400" /><span>Blocked Users</span></div><ChevronRight className="w-3.5 h-3.5" /></button>
                <div className="px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs"><div className="flex items-center space-x-2">{isDarkMode? <Moon className="w-3.5 h-3.5 text-cyan-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}<span>Dark Mode</span></div><button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-9 h-5 flex items-center rounded-full p-0.5 ${isDarkMode? 'bg-cyan-500 justify-end' : 'bg-white/20 justify-start'}`}><span className="w-4 h-4 rounded-full bg-white" /></button></div>
                <button onClick={() => setLang(lang === 'EN'? 'BN' : 'EN')} className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs"><div className="flex items-center space-x-2"><Globe className="w-3.5 h-3.5 text-emerald-400" /><span>Language ({lang})</span></div><span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">{lang}</span></button>
              </div>
              <div className="h-[1px] bg-white/10" />
              <button onClick={() => { setIsMenuOpen(false); if (onLogout) onLogout(); }} className="w-full text-left px-2.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 font-extrabold flex items-center justify-between text-xs border border-rose-500/30 mt-1.5"><div className="flex items-center space-x-2"><LogOut className="w-4 h-4 text-rose-500" /><span>Logout</span></div><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
