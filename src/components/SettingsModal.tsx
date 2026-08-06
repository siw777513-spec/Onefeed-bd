import React, { useState, useEffect } from 'react';
import { X, LayoutGrid, Palette, Heart, Lock, Wallet, Shield } from 'lucide-react';

export const SettingsModal = ({isOpen, onClose, profile, currentUser, onLogout}: any) => {
  if(!isOpen) return null;
  const [tab, setTab] = useState('feed');

  // Real Settings State - LocalStorage থেকে Load
  const [settings, setSettings] = useState(()=>{
    const s = localStorage.getItem('onefeed_settings');
    return s? JSON.parse(s) : {
      defaultColumn:'all', autoRefresh:true, autoPlay:'wifi', nsfw:false,
      phoneFrame:true, theme:'dark', fontSize:'medium', density:'comfortable',
      doubleTap:true, swipe:true, private:false, postVisibility:'public', messagePerm:'followers', online:true, allowDownload:true,
      dataSaver:false
    };
  });

  useEffect(()=>{ localStorage.setItem('onefeed_settings', JSON.stringify(settings)); }, [settings]);

  const toggle = (key:string) => setSettings((p:any)=>({...p, [key]:!p[key]}));
  const setVal = (key:string, val:any) => setSettings((p:any)=>({...p, [key]:val}));

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-3">
      <div className="bg-[#0F0F14] w-full max-w-4xl h-[85vh] rounded-3xl border border-white/10 flex overflow-hidden text-white">
        <div className="w-[200px] bg-black/50 p-3 border-r border-white/10">
          <div className="p-2 mb-6"><p className="font-bold">{currentUser?.name}</p><p className="text-[10px] opacity-50">OneFeed Settings</p></div>
          {[
            {id:'feed', label:'Feed & Columns', icon: LayoutGrid},
            {id:'appearance', label:'Appearance', icon: Palette},
            {id:'interaction', label:'Interaction', icon: Heart},
            {id:'privacy', label:'Privacy', icon: Lock},
            {id:'wallet', label:'Wallet', icon: Wallet},
            {id:'security', label:'Data & Security', icon: Shield},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`w-full text-left p-3 rounded-xl mb-1 flex gap-2 text-sm ${tab===t.id?'bg-white text-black font-bold':'opacity-60 hover:bg-white/10'}`}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full mt-8 bg-red-500/20 text-red-400 p-3 rounded-xl text-sm">Log Out - কাজ করে</button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between mb-6"><h2 className="text-xl font-black capitalize">{tab}</h2><button onClick={onClose} className="bg-white/10 p-2 rounded-full"><X className="w-4 h-4"/></button></div>

          {tab==='feed' && <div className="space-y-3">
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between"><div><p className="font-bold text-sm">Default Column</p><p className="text-xs opacity-50">Open হবে {settings.defaultColumn}</p></div>
              <select value={settings.defaultColumn} onChange={e=>{setVal('defaultColumn', e.target.value); alert('Saved! Reload করলে '+e.target.value+' Column Open হবে');}} className="bg-black border border-white/10 rounded-full px-3 text-xs"><option value="all">All</option><option value="feed">Feed</option><option value="tiktok">TikTok</option><option value="youtube">YouTube</option></select>
            </div>
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">Auto-Refresh</p><p className="text-xs opacity-50">নতুন Post Auto Load</p></div><button onClick={()=>toggle('autoRefresh')} className={`w-12 h-6 rounded-full p-1 transition ${settings.autoRefresh?'bg-green-500':'bg-white/20'}`}><div className={`w-4 h-4 bg-white rounded-full transition ${settings.autoRefresh?'translate-x-6':''}`}></div></button></div>
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">NSFW Filter</p><p className="text-xs opacity-50">18+ Hide</p></div><button onClick={()=>toggle('nsfw')} className={`w-12 h-6 rounded-full p-1 transition ${settings.nsfw?'bg-green-500':'bg-white/20'}`}><div className={`w-4 h-4 bg-white rounded-full transition ${settings.nsfw?'translate-x-6':''}`}></div></button></div>
          </div>}

          {tab==='appearance' && <div className="space-y-3">
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">Phone Frame</p><p className="text-xs opacity-50">Phone এর মত দেখাবে</p></div><button onClick={()=>{toggle('phoneFrame'); alert('Phone Frame '+(!settings.phoneFrame?'On':'Off')+' - Reload দাও');}} className={`w-12 h-6 rounded-full p-1 ${settings.phoneFrame?'bg-green-500':'bg-white/20'}`}><div className={`w-4 h-4 bg-white rounded-full ${settings.phoneFrame?'translate-x-6':''}`}></div></button></div>
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between"><div><p className="font-bold text-sm">Font Size - {settings.fontSize}</p></div><select value={settings.fontSize} onChange={e=>setVal('fontSize', e.target.value)} className="bg-black border rounded-full px-3 text-xs"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
          </div>}

          {tab==='privacy' && <div className="space-y-3">
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">Private Profile</p><p className="text-xs opacity-50">Only Followers</p></div><button onClick={()=>toggle('private')} className={`w-12 h-6 rounded-full p-1 ${settings.private?'bg-green-500':'bg-white/20'}`}><div className={`w-4 h-4 bg-white rounded-full ${settings.private?'translate-x-6':''}`}></div></button></div>
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between"><div><p className="font-bold text-sm">Who can message you</p></div><select value={settings.messagePerm} onChange={e=>setVal('messagePerm', e.target.value)} className="bg-black border rounded-full px-3 text-xs"><option value="everyone">Everyone</option><option value="followers">Followers</option><option value="none">No one</option></select></div>
          </div>}

          {tab==='security' && <div className="space-y-3">
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">Data Saver Mode</p></div><button onClick={()=>toggle('dataSaver')} className={`w-12 h-6 rounded-full p-1 ${settings.dataSaver?'bg-green-500':'bg-white/20'}`}><div className={`w-4 h-4 bg-white rounded-full ${settings.dataSaver?'translate-x-6':''}`}></div></button></div>
            <button onClick={()=>{localStorage.removeItem('onefeed_settings'); alert('Cache Cleared!'); location.reload();}} className="w-full bg-white/[0.06] p-4 rounded-2xl text-left"><p className="font-bold text-sm">Clear Cache - কাজ করে</p><p className="text-xs opacity-50">Click করলে সব Settings Reset হবে</p></button>
            <button onClick={()=>{if(confirm('Delete Account?')){localStorage.clear(); location.reload();}}} className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-left"><p className="font-bold text-sm text-red-400">Delete Account - কাজ করে</p><p className="text-xs opacity-50">Permanently Delete</p></button>
          </div>}

          {tab==='wallet' && <div className="space-y-3">
            <div className="bg-gradient-to-r from-violet-500 to-cyan-400 p-5 rounded-2xl text-black"><p className="text-3xl font-black">500 Coins</p></div>
            <div className="bg-white/[0.06] p-4 rounded-2xl"><p className="font-bold text-sm">Payout - Bkash Setup</p><button onClick={()=>alert('Bkash Number Save করার Page খুলবে')} className="mt-2 bg-white text-black px-4 py-1 rounded-full text-xs">Setup - কাজ করে</button></div>
          </div>}

          {tab==='interaction' && <div className="space-y-3">
            <div className="bg-white/[0.06] p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">Double Tap to Like</p></div><button onClick={()=>toggle('doubleTap')} className={`w-12 h-6 rounded-full p-1 ${settings.doubleTap?'bg-green-500':'bg-white/20'}`}><div className={`w-4 h-4 bg-white rounded-full ${settings.doubleTap?'translate-x-6':''}`}></div></button></div>
          </div>}
        </div>
      </div>
    </div>
  )
                                                                                                                                                                                                                                                                                                                                                                                                                                   }
