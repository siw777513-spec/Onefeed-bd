import React, { useState } from 'react';
import { X, User, Video, Youtube, Shield, DollarSign, Settings, Bell, Lock, Eye, Users, UserX, MessageCircle, BarChart3, Wallet } from 'lucide-react';

export const SettingsModal = ({isOpen, onClose, profile, currentUser, onLogout}: any) => {
  if(!isOpen) return null;
  const [main, setMain] = useState<'facebook'|'tiktok'|'youtube'|'studio'>('facebook');
  const [sub, setSub] = useState('profile');
  const user = currentUser || profile;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-2">
      <div className="bg-[#0F0F14] w-full max-w-[1100px] h-[92vh] rounded-3xl border border-white/10 flex overflow-hidden text-white">

        {/* MAIN SIDEBAR - FB / TT / YT / STUDIO */}
        <div className="w-[180px] bg-black p-3 flex flex-col gap-2 border-r border-white/10">
          <div className="flex items-center gap-2 p-2 mb-4"><img src={user?.avatar} className="w-8 h-8 rounded-full bg-white/10"/><div><p className="text-xs font-bold truncate">{user?.name}</p><p className="text-[10px] opacity-50">All Settings</p></div></div>
          <button onClick={()=>{setMain('facebook'); setSub('profile')}} className={`p-3 rounded-xl text-sm font-bold flex gap-2 ${main==='facebook'?'bg-[#1877F2] text-white':'bg-white/5'}`}><User className="w-4 h-4"/> Facebook</button>
          <button onClick={()=>{setMain('tiktok'); setSub('account')}} className={`p-3 rounded-xl text-sm font-bold flex gap-2 ${main==='tiktok'?'bg-[#FE2C55] text-white':'bg-white/5'}`}><Video className="w-4 h-4"/> TikTok</button>
          <button onClick={()=>{setMain('youtube'); setSub('privacy')}} className={`p-3 rounded-xl text-sm font-bold flex gap-2 ${main==='youtube'?'bg-[#FF0000] text-white':'bg-white/5'}`}><Youtube className="w-4 h-4"/> YouTube</button>
          <button onClick={()=>{setMain('studio'); setSub('dashboard')}} className={`p-3 rounded-xl text-sm font-bold flex gap-2 ${main==='studio'?'bg-white text-black':'bg-white/5'}`}><BarChart3 className="w-4 h-4"/> YT Studio</button>
          <button onClick={()=>{localStorage.clear(); location.reload();}} className="mt-auto bg-red-500/20 text-red-400 p-3 rounded-xl text-xs">Log Out</button>
        </div>

        {/* SUB SIDEBAR */}
        <div className="w-[200px] bg-[#12121A] p-3 border-r border-white/10 overflow-y-auto">
          {main==='facebook' && <>
            <p className="text-[10px] opacity-40 mb-2">FACEBOOK SETTINGS</p>
            {[
              ['profile','Profile Settings'],['audience','Audience & Visibility'],['notif','Notifications'],['blocking','Blocking'],['stories','Stories / Reels'],['page','Professional Mode']
            ].map(([id,label])=> <button key={id} onClick={()=>setSub(id)} className={`w-full text-left p-2.5 rounded-lg text-xs mb-1 ${sub===id?'bg-white/10 text-white':'opacity-60'}`}>{label}</button>)}
          </>}
          {main==='tiktok' && <>
            <p className="text-[10px] opacity-40 mb-2">TIKTOK SETTINGS</p>
            {[
              ['account','Account - Manage'],['privacy','Privacy'],['security','Security & Permissions'],['content','Content & Display'],['creator','Creator Tools'],['wallet','Wallet / Balance']
            ].map(([id,label])=> <button key={id} onClick={()=>setSub(id)} className={`w-full text-left p-2.5 rounded-lg text-xs mb-1 ${sub===id?'bg-white/10 text-white':'opacity-60'}`}>{label}</button>)}
          </>}
          {main==='youtube' && <>
            <p className="text-[10px] opacity-40 mb-2">YOUTUBE SETTINGS</p>
            {[
              ['privacy','Video & Privacy'],['history','History & Privacy'],['notif_yt','Notifications'],['personal','Personal Details'],['password','Password & Security'],['ads','Ad Preferences']
            ].map(([id,label])=> <button key={id} onClick={()=>setSub(id)} className={`w-full text-left p-2.5 rounded-lg text-xs mb-1 ${sub===id?'bg-white/10 text-white':'opacity-60'}`}>{label}</button>)}
          </>}
          {main==='studio' && <>
            <p className="text-[10px] opacity-40 mb-2">YT STUDIO - PRO</p>
            {[
              ['dashboard','Dashboard Analytics'],['content_st','Content'],['analytics','Analytics'],['comments','Comments'],['monet','Monetization'],['custom','Customization'],['settings_st','Studio Settings']
            ].map(([id,label])=> <button key={id} onClick={()=>setSub(id)} className={`w-full text-left p-2.5 rounded-lg text-xs mb-1 ${sub===id?'bg-white/10 text-white':'opacity-60'}`}>{label}</button>)}
          </>}
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-[#0A0A0F] p-5 overflow-y-auto">
          <div className="flex justify-between items-center mb-5"><h2 className="font-black text-lg capitalize">{sub.replace('_',' ')} - {main}</h2><button onClick={onClose} className="bg-white/10 p-2 rounded-full"><X className="w-4 h-4"/></button></div>

          {/* FACEBOOK */}
          {main==='facebook' && sub==='profile' && <div className="space-y-3"><Item title="কে তোমার প্রোফাইল দেখতে পারবে?" desc="Public / Friends / Only Me"/><Item title="কে Tag করতে পারবে?" desc="Everyone / Friends / No one"/><Item title="Timeline Review" desc="Tag করা Post Approve করতে হবে"/></div>}
          {main==='facebook' && sub==='audience' && <div className="space-y-3"><Item title="Who can see your posts" desc="Public / Friends / Only Me - FB"/><Item title="Who can send Friend Request" desc="Everyone / Friends of Friends"/><Item title="Who can see Friends List" desc="Public / Friends / Only Me"/><Item title="Profile Locking" desc="Enable - Only Friends can see full profile"/></div>}
          {main==='facebook' && sub==='notif' && <div className="space-y-3"><Item title="Like Notification" desc="Push / Email / SMS"/><Item title="Comment Notification" desc="Push / Email"/><Item title="Live Notification" desc="On/Off"/><Item title="Friend Request" desc="Push + Email"/></div>}
          {main==='facebook' && sub==='blocking' && <div className="space-y-3"><Item title="Blocked Users" desc="2 Users Blocked - Unblock"/><Item title="Block New User" desc="Enter @handle to block"/></div>}
          {main==='facebook' && sub==='stories' && <div className="space-y-3"><Item title="Who can see Story?" desc="Public / Friends / Custom"/><Item title="Who can Reply?" desc="Everyone / Friends"/></div>}
          {main==='facebook' && sub==='page' && <div className="space-y-3"><Item title="Professional Mode" desc="Turn On - Creator Mode"/><Item title="Monetization" desc="Stars, Ads, Subscription"/><Item title="Payout Settings" desc="Bkash / Nagad / Bank"/><Item title="Insights" desc="Page Insights & Analytics"/></div>}

          {/* TIKTOK */}
          {main==='tiktok' && sub==='account' && <div className="space-y-3"><Item title="Manage Account" desc="Phone, Email, Password"/><Item title="Switch to Business/Creator Account" desc="Creator / Business"/></div>}
          {main==='tiktok' && sub==='privacy' && <div className="space-y-3"><Item title="Private Account On/Off" desc="TikTok Private"/><Item title="Who can follow / comment / Duet / Stitch / Download" desc="Everyone / Friends / No one"/><Item title="Blocked Accounts" desc="Manage Blocked"/><Item title="Activity Status On/Off" desc="Show active status"/></div>}
          {main==='tiktok' && sub==='security' && <div className="space-y-3"><Item title="2-Step Verification" desc="SMS / Authenticator / Email"/><Item title="Device Management" desc="Where you're logged in"/><Item title="App Permissions" desc="Manage permissions"/></div>}
          {main==='tiktok' && sub==='content' && <div className="space-y-3"><Item title="Content Preferences" desc="Restricted Mode On/Off"/><Item title="Video Language Filter" desc="Filter Languages"/><Item title="Keyword Filter" desc="কোন শব্দ Comment এ আসবে না - Add keywords"/></div>}
          {main==='tiktok' && sub==='creator' && <div className="space-y-3"><Item title="Creator Fund / Creativity Program Beta" desc="টাকা ইনকাম - Eligible"/><Item title="Analytics" desc="Follower, Video View, Watch Time"/><Item title="Promote" desc="Boost Video with Money"/><Item title="TikTok Studio" desc="All Video Management"/></div>}
          {main==='tiktok' && sub==='wallet' && <div className="space-y-3"><div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-xl text-black"><p className="text-xl font-black">500 Coins</p><p>Balance</p></div><Item title="Gift" desc="Received Gifts"/><Item title="Payout" desc="Bkash / Nagad"/></div>}

          {/* YOUTUBE */}
          {main==='youtube' && sub==='privacy' && <div className="space-y-3"><Item title="Keep all subscriptions private" desc="YT Privacy"/><Item title="Keep all liked videos private" desc="YT Privacy"/></div>}
          {main==='youtube' && sub==='history' && <div className="space-y-3"><Item title="Watch History" desc="Pause / Clear"/><Item title="Search History" desc="Pause / Clear"/><Item title="Manage all activity" desc="Google My Activity"/></div>}
          {main==='youtube' && sub==='notif_yt' && <div className="space-y-3"><Item title="Recommended videos" desc="Mobile / Email"/><Item title="Mentions, Comments" desc="All / None"/></div>}
          {main==='youtube' && sub==='personal' && <div className="space-y-3"><Item title="Personal Details" desc="Name, DOB, Contact - Email/Phone"/><Item title="Google Account" desc="Manage Google Account"/></div>}
          {main==='youtube' && sub==='password' && <div className="space-y-3"><Item title="Change Password" desc="Google Password"/><Item title="Two-Factor Authentication (2FA)" desc="SMS / Authenticator App / Security Key"/><Item title="Where you're logged in" desc="Device list - Logout"/><Item title="Login Alerts" desc="Notify on new login"/></div>}
          {main==='youtube' && sub==='ads' && <div className="space-y-3"><Item title="Ad Preferences" desc="What ads you see - Dashboard"/></div>}

          {/* STUDIO */}
          {main==='studio' && sub==='dashboard' && <div className="space-y-3"><div className="bg-white text-black p-4 rounded-xl"><p className="font-black">Channel Analytics</p><p className="text-sm">Views: 1.2M, Watch Time: 5K hrs</p></div></div>}
          {main==='studio' && sub==='content_st' && <div className="space-y-3"><Item title="All Videos" desc="Visibility: Public / Unlisted / Private / Scheduled"/></div>}
          {main==='studio' && sub==='analytics' && <div className="space-y-3"><Item title="Views, Watch Time, Audience, Revenue" desc="YT Studio Analytics"/></div>}
          {main==='studio' && sub==='comments' && <div className="space-y-3"><Item title="All Comments" desc="Filter, Blocked Words"/></div>}
          {main==='studio' && sub==='monet' && <div className="space-y-3"><Item title="Monetization On/Off" desc="Ads, Memberships, Super Chat"/><Item title="Copyright Claims / Strikes" desc="Check Claims"/></div>}
          {main==='studio' && sub==='custom' && <div className="space-y-3"><Item title="Layout, Branding" desc="Logo, Banner, Watermark"/><Item title="Basic Info" desc="Channel Info"/></div>}
          {main==='studio' && sub==='settings_st' && <div className="space-y-3"><Item title="Channel > Basic Info" desc="Audience - Kids or Not"/><Item title="Upload Defaults" desc="Title, Description, Tags, Category - Auto"/><Item title="Permissions" desc="Manager / Editor Add"/><Item title="Community" desc="Default Comment Settings, Auto Block"/></div>}
        </div>
      </div>
    </div>
  )
}

const Item = ({title, desc}: any) => (
  <div className="bg-white/[0.06] border border-white/10 p-3.5 rounded-xl flex justify-between items-center">
    <div><p className="text-sm font-bold">{title}</p><p className="text-[11px] opacity-50">{desc}</p></div>
    <span className="text-xs bg-white/10 px-3 py-1 rounded-full">Edit</span>
  </div>
)
