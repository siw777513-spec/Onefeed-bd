import React, { useState } from 'react';
import { X, LayoutGrid, Palette, Heart, Lock, Wallet, Shield } from 'lucide-react';

export const SettingsModal = ({isOpen, onClose, profile, currentUser, onLogout}: any) => {
  if(!isOpen) return null;
  const [tab, setTab] = useState('feed');
  const user = currentUser || profile;

  const TABS = [
    {id:'feed', label:'Feed & Columns', icon: LayoutGrid},
    {id:'appearance', label:'Appearance', icon: Palette},
    {id:'interaction', label:'Interaction', icon: Heart},
    {id:'privacy', label:'Privacy', icon: Lock},
    {id:'wallet', label:'Wallet & Creator', icon: Wallet},
    {id:'security', label:'Data & Security', icon: Shield},
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#0F0F14] w-full max-w-4xl h-[85vh] rounded-3xl border border-white/10 flex overflow-hidden text-white">
        {/* Left */}
        <div className="w-[200px] bg-black/50 p-3 border-r border-white/10">
          <div className="flex items-center gap-2 p-2 mb-6">
            <img src={user?.avatar} className="w-10 h-10 rounded-full bg-white/10"/>
            <div><p className="text-sm font-bold">{user?.name}</p><p className="text-[10px] opacity-50">OneFeed Original</p></div>
          </div>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`w-full text-left p-3 rounded-xl mb-1 flex items-center gap-2 text-sm ${tab===t.id?'bg-white text-black font-bold':'opacity-60 hover:bg-white/10'}`}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full mt-8 bg-red-500/20 text-red-400 p-3 rounded-xl text-sm">Log Out</button>
        </div>

        {/* Right */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black">{TABS.find(t=>t.id===tab)?.label}</h2><button onClick={onClose} className="bg-white/10 p-2 rounded-full"><X className="w-4 h-4"/></button></div>

          {tab==='feed' && <div className="space-y-3">
            <Card title="Default Column" desc="App Open হলে কোন Column দেখাবে" val="All Feeds"/>
            <Card title="Auto-Refresh Feed" desc="নতুন Post Auto Load হবে" toggle/>
            <Card title="Video Auto-Play" desc="Feed এ Video Auto চলবে" val="WiFi Only"/>
            <Card title="NSFW Filter" desc="18+ Content Hide করবে" toggle/>
          </div>}

          {tab==='appearance' && <div className="space-y-3">
            <Card title="Phone Frame" desc="Desktop এ Phone এর মত দেখাবে" toggle checked/>
            <Card title="Theme" desc="App এর Color Theme" val="Midnight Dark"/>
            <Card title="Font Size" desc="লেখার Size" val="Medium"/>
            <Card title="Density" desc="Post এর Gap" val="Comfortable"/>
          </div>}

          {tab==='interaction' && <div className="space-y-3">
            <Card title="Double Tap to Like" desc="Post এ 2 বার Tap করলে Like" toggle checked/>
            <Card title="Swipe to Next Column" desc="Swipe করলে Column Change" toggle checked/>
            <Card title="Comment Keyword Filter" desc="গালি বা খারাপ শব্দ Block" val="Add Keywords"/>
            <Card title="Blocked Users" desc="Block করা Users" val="2 Users"/>
          </div>}

          {tab==='privacy' && <div className="space-y-3">
            <Card title="Private Profile" desc="Only Followers can see your posts" toggle/>
            <Card title="Who can see your posts" desc="Post Visibility" val="Public"/>
            <Card title="Who can message you" desc="Chat Permission" val="Followers Only"/>
            <Card title="Show Online Status" desc="Online দেখাবে কিনা" toggle checked/>
            <Card title="Allow Post Download" desc="তোমার Post Download করতে পারবে" toggle/>
          </div>}

          {tab==='wallet' && <div className="space-y-3">
            <div className="bg-gradient-to-r from-violet-500 to-cyan-400 p-5 rounded-2xl text-black"><p className="text-3xl font-black">500 Coins</p><p className="text-sm">OneFeed Wallet</p></div>
            <Card title="Buy Coins" desc="Bkash / Nagad দিয়ে Coins কিনো" val="Buy"/>
            <Card title="Creator Analytics" desc="Views, Likes, Earnings দেখো" val="View"/>
            <Card title="Payout Settings" desc="টাকা Withdraw - Bkash/Nagad/Bank" val="Setup"/>
          </div>}

          {tab==='security' && <div className="space-y-3">
            <Card title="Data Saver Mode" desc="Video Quality Low - Data বাঁচাবে" toggle/>
            <Card title="Clear Cache" desc="App Cache Clear - 2.5 MB" val="Clear"/>
            <Card title="Change Password" desc="Password Change করো" val="Change"/>
            <Card title="Where you're logged in" desc="সব Device থেকে Logout" val="Manage"/>
            <Card title="Download Your Data" desc="তোমার সব Post Download" val="Download"/>
            <Card title="Delete Account" desc="Account Permanently Delete" val="Delete" danger/>
          </div>}
        </div>
      </div>
    </div>
  )
}

const Card = ({title, desc, val, toggle, checked, danger}: any) => (
  <div className={`bg-white/[0.06] border border-white/10 p-4 rounded-2xl flex justify-between items-center ${danger?'border-red-500/20':''}`}>
    <div><p className={`text-sm font-bold ${danger?'text-red-400':''}`}>{title}</p><p className="text-[11px] opacity-50">{desc}</p></div>
    {toggle? <input type="checkbox" defaultChecked={checked} className="w-10 h-6"/> : <span className={`text-xs px-3 py-1.5 rounded-full ${danger?'bg-red-500 text-white':'bg-white/10'}`}>{val}</span>}
  </div>
)
