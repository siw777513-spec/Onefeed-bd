import React, { useState } from 'react';
import { X, User, Shield, Bell, Video, DollarSign, Settings, Lock } from 'lucide-react';

export const SettingsModal = ({isOpen, onClose, profile, currentUser, onLogout}: any) => {
  if(!isOpen) return null;
  const [tab, setTab] = useState('facebook');
  const user = currentUser || profile;

  const TABS = [
    {id:'facebook', label:'Facebook Style', icon: User},
    {id:'tiktok', label:'TikTok Style', icon: Video},
    {id:'youtube', label:'YouTube Style', icon: Bell},
    {id:'security', label:'Security', icon: Lock},
    {id:'monetization', label:'Earning', icon: DollarSign},
    {id:'advanced', label:'Advanced', icon: Settings},
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-3">
      <div className="bg-[#12121E] w-full max-w-5xl h-[90vh] rounded-3xl border border-white/10 flex overflow-hidden text-white">
        {/* Left */}
        <div className="w-[200px] bg-[#0A0A0F] p-3 border-r border-white/10 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 p-2">
            <img src={user?.avatar} className="w-10 h-10 rounded-full bg-white/10" alt="" />
            <div><p className="text-sm font-bold truncate">{user?.name}</p><p className="text-[10px] text-white/50">{user?.handle}</p></div>
          </div>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`w-full text-left p-3 rounded-xl mb-1 flex items-center gap-2 text-sm ${tab===t.id?'bg-white text-black font-bold':'text-white/60 hover:bg-white/10'}`}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full mt-8 bg-red-500/20 text-red-400 p-3 rounded-xl text-sm">Log Out</button>
        </div>

        {/* Right */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black">{TABS.find(t=>t.id===tab)?.label} Settings</h2><button onClick={onClose} className="bg-white/10 p-2 rounded-full"><X className="w-4 h-4"/></button></div>

          {tab==='facebook' && (
            <div className="space-y-4">
              <h3 className="font-bold text-cyan-400">Facebook Privacy (FB)</h3>
              {[
                'Who can see your future posts? [Public / Friends / Only Me]',
                'Who can send you friend requests? [Everyone / Friends of Friends]',
                'Who can see your friends list? [Public / Friends]',
                'Profile Locking [Enable - Only Friends can see full profile]',
                'Timeline Review [Review posts you are tagged in]',
                'Story Privacy [Public / Friends / Custom]',
                'Face Recognition [On/Off]',
                'Blocking - Blocked Users List',
              ].map(i=><div key={i} className="bg-white/5 p-3 rounded-xl text-sm flex justify-between"><span>{i}</span><span className="text-cyan-400">Edit</span></div>)}
            </div>
          )}

          {tab==='tiktok' && (
            <div className="space-y-4">
              <h3 className="font-bold text-pink-400">TikTok Privacy & Creator</h3>
              {[
                'Private Account [On/Off] - TikTok',
                'Suggest your account to others [On/Off]',
                'Who can Duet with your videos? [Everyone / Friends / No one]',
                'Who can Stitch your videos? [Everyone / Friends / No one]',
                'Who can download your videos? [On/Off]',
                'Who can comment? [Everyone / Friends / No one]',
                'Comment Filters - Filter Keywords, Filter Spam',
                'Family Pairing / Restricted Mode',
                'Activity Status [Show when you are active]',
              ].map(i=><div key={i} className="bg-white/5 p-3 rounded-xl text-sm flex justify-between"><span>{i}</span><input type="checkbox" defaultChecked /></div>)}
            </div>
          )}

          {tab==='youtube' && (
            <div className="space-y-4">
              <h3 className="font-bold text-red-400">YouTube Content & Playback</h3>
              {[
                'Restricted Mode [Hides potentially mature videos] - YT',
                'Autoplay [Autoplay next video] - YT',
                'Playback - Always show captions, Double tap to seek',
                'Upload Defaults - Title, Description, Visibility, Tags, Category',
                'Privacy - Keep all my subscriptions private',
                'Privacy - Keep all my liked videos private',
                'History - Pause Watch History, Clear Watch History',
                'History - Pause Search History, Clear Search History',
                'Connected Apps - Manage apps connected to YouTube',
              ].map(i=><div key={i} className="bg-white/5 p-3 rounded-xl text-sm flex justify-between"><span>{i}</span><span className="text-red-400">Manage</span></div>)}
            </div>
          )}

          {tab==='security' && (
            <div className="space-y-3">
              <h3 className="font-bold text-green-400">Facebook + YouTube Security</h3>
              <div className="bg-white/5 p-4 rounded-xl"><p>Two-Factor Authentication</p><p className="text-xs text-white/50">SMS / Authenticator App / Security Key</p></div>
              <div className="bg-white/5 p-4 rounded-xl"><p>Where you're logged in</p><p className="text-xs text-white/50">iPhone, Windows PC - Logout from all devices</p></div>
              <div className="bg-white/5 p-4 rounded-xl"><p>Change Password</p><input className="w-full mt-2 bg-black p-2 rounded-lg text-sm" placeholder="Current Password" /></div>
            </div>
          )}

          {tab==='monetization' && (
            <div className="space-y-3">
              <h3 className="font-bold text-yellow-400">YouTube + TikTok Earning</h3>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl text-black"><p className="text-2xl font-black">500 Coins</p><p>≈ 250 Taka</p></div>
              <div className="bg-white/5 p-3 rounded-xl">Creator Fund / Creativity Program - TikTok</div>
              <div className="bg-white/5 p-3 rounded-xl">YouTube Monetization - Ads, Memberships, Super Thanks</div>
              <div className="bg-white/5 p-3 rounded-xl">Payout - Bkash / Nagad / Bank - YT Studio Style</div>
              <div className="bg-white/5 p-3 rounded-xl">Analytics - Views, Watch Time, Audience</div>
            </div>
          )}

          {tab==='advanced' && (
            <div className="space-y-3">
              <h3 className="font-bold">Advanced - Combined</h3>
              <div className="bg-white/5 p-3 rounded-xl">Language - English / বাংলা - FB+YT+TT</div>
              <div className="bg-white/5 p-3 rounded-xl">Dark Mode [Always On for OneFeed]</div>
              <div className="bg-white/5 p-3 rounded-xl">Data Saver - Reduce data usage - TT+FB</div>
              <div className="bg-white/5 p-3 rounded-xl">Clear Cache - 2.5 MB</div>
              <div className="bg-white/5 p-3 rounded-xl">Download your information - FB+YT Data Export</div>
              <div className="bg-white/5 p-3 rounded-xl">Version: OneFeed V25 FB+TT+YT Pro Max</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
              }
