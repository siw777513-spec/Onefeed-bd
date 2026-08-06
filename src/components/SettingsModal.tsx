import React, { useState, useEffect } from 'react';
import { X, Settings, Monitor, Bell, Lock, Wallet, Database, Globe } from 'lucide-react';

type Lang = 'en' | 'bn';
const translations = {
  en: {
    title: 'Settings', feed: 'Feed', appearance: 'Appearance', notifications: 'Notifications', privacy: 'Privacy', wallet: 'Wallet & Earnings', data: 'Data & Storage', language: 'Language',
    defaultColumn: 'Default Feed', autoRefresh: 'Auto Refresh', videoAutoplay: 'Video Autoplay', nsfw: 'Hide Sensitive Content',
    theme: 'Theme', fontSize: 'Font Size', phoneFrame: 'Phone Frame', phoneDesc: 'Show desktop as phone',
    doubleTap: 'Double tap to like', blocked: 'Blocked Users', keywords: 'Filtered Keywords',
    privateAcc: 'Private Account', whoCanSee: 'Who can see posts', whoCanMsg: 'Who can message you', online: 'Show online status',
    coins: 'Coins', buyCoins: 'Buy Coins', payout: 'Payout Method', analytics: 'Creator Analytics',
    dataSaver: 'Data Saver', clearCache: 'Clear Cache', deleteAcc: 'Delete Account', logout: 'Log Out',
    save: 'Saved', english: 'English', bangla: 'বাংলা'
  },
  bn: {
    title: 'সেটিংস', feed: 'ফিড', appearance: 'ডিজাইন', notifications: 'নোটিফিকেশন', privacy: 'প্রাইভেসি', wallet: 'ওয়ালেট', data: 'ডাটা', language: 'ভাষা',
    defaultColumn: 'ডিফল্ট ফিড', autoRefresh: 'অটো রিফ্রেশ', videoAutoplay: 'ভিডিও অটো প্লে', nsfw: 'সেনসিটিভ কন্টেন্ট লুকাও',
    theme: 'থিম', fontSize: 'ফন্ট সাইজ', phoneFrame: 'ফোন ফ্রেম', phoneDesc: 'ডেস্কটপে ফোনের মত দেখাবে',
    doubleTap: 'ডাবল ট্যাপে লাইক', blocked: 'ব্লকড ইউজার', keywords: 'ফিল্টার শব্দ',
    privateAcc: 'প্রাইভেট একাউন্ট', whoCanSee: 'কে পোস্ট দেখতে পারবে', whoCanMsg: 'কে মেসেজ দিতে পারবে', online: 'অনলাইন দেখাবে',
    coins: 'কয়েন', buyCoins: 'কয়েন কিনো', payout: 'পেমেন্ট মেথড', analytics: 'ক্রিয়েটর এনালিটিক্স',
    dataSaver: 'ডাটা সেভার', clearCache: 'ক্যাশ ক্লিয়ার', deleteAcc: 'একাউন্ট ডিলিট', logout: 'লগ আউট',
    save: 'সেভ হয়েছে', english: 'English', bangla: 'বাংলা'
  }
};

export const SettingsModal = ({isOpen, onClose, currentUser, profile, onLogout}: any) => {
  const [tab, setTab] = useState('feed');
  const [lang, setLang] = useState<Lang>(()=> (localStorage.getItem('onefeed_lang') as Lang) || 'en');
  const t = translations[lang];

  const [settings, setSettings] = useState(()=>{
    const s = localStorage.getItem('onefeed_settings_v2');
    return s? JSON.parse(s) : { defaultColumn:'all', autoRefresh:true, autoPlay:'wifi', nsfw:true, phoneFrame:true, theme:'dark', fontSize:'medium', doubleTap:true, private:false, whoSee:'public', whoMsg:'followers', online:true, dataSaver:false };
  });

  useEffect(()=>{ localStorage.setItem('onefeed_settings_v2', JSON.stringify(settings)); }, [settings]);
  useEffect(()=>{ localStorage.setItem('onefeed_lang', lang); }, [lang]);

  if(!isOpen) return null;

  const Row = ({title, desc, children}: any) => (
    <div className="flex items-center justify-between py-4 px-5 bg-white/[0.04] hover:bg-white/[0.06] border-b border-white/[0.06] last:border-0">
      <div className="pr-4"><p className="text-[13px] font-semibold text-white">{title}</p>{desc && <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>}</div>
      <div>{children}</div>
    </div>
  );

  const Toggle = ({checked, onChange}: any) => (
    <button onClick={onChange} className={`w-11 h-6 rounded-full p-0.5 transition-all ${checked?'bg-white':'bg-white/20'}`}><div className={`w-5 h-5 rounded-full bg-black transition-all ${checked?'translate-x-5':'translate-x-0'}`}></div></button>
  );

  const Select = ({value, onChange, options}: any) => (
    <select value={value} onChange={e=>onChange(e.target.value)} className="bg-[#1A1A1F] border border-white/10 text-white text-xs rounded-full px-3 py-1.5 outline-none">
      {options.map((o:any)=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#121216] w-full max-w-[820px] h-[78vh] rounded-[24px] border border-white/10 flex overflow-hidden shadow-2xl">

        {/* Sidebar - Clean */}
        <div className="w-[220px] bg-[#0A0A0E] p-3 border-r border-white/[0.06] flex flex-col">
          <div className="flex items-center gap-2 px-2 py-3 mb-4"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">{currentUser?.name?.[0]}</div><div><p className="text-sm font-bold text-white">{currentUser?.name}</p><p className="text-[10px] text-white/40">@{currentUser?.handle}</p></div></div>

          {[
            {id:'feed', label:t.feed, icon: Settings},
            {id:'appearance', label:t.appearance, icon: Monitor},
            {id:'privacy', label:t.privacy, icon: Lock},
            {id:'wallet', label:t.wallet, icon: Wallet},
            {id:'data', label:t.data, icon: Database},
            {id:'language', label:t.language, icon: Globe},
          ].map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id)} className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] flex items-center gap-2.5 mb-1 transition ${tab===item.id?'bg-white text-black font-semibold':'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <item.icon className="w-4 h-4"/>{item.label}
            </button>
          ))}
          <button onClick={onLogout} className="mt-auto w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-red-400 hover:bg-red-500/10">Log out</button>
        </div>

        {/* Content - Premium List Style */}
        <div className="flex-1 flex flex-col bg-[#121216]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]"><h2 className="text-[15px] font-bold">{t.title} / {tab}</h2><button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><X className="w-4 h-4"/></button></div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="bg-[#1A1A20] rounded-2xl overflow-hidden border border-white/[0.05]">

              {tab==='feed' && <>
                <Row title={t.defaultColumn} desc="Choose starting feed"><Select value={settings.defaultColumn} onChange={(v:any)=>setSettings((p:any)=>({...p, defaultColumn:v}))} options={[{value:'all',label:'All Feeds'},{value:'feed',label:'Feed'},{value:'tiktok',label:'TikTok'},{value:'youtube',label:'YouTube'}]}/></Row>
                <Row title={t.autoRefresh}><Toggle checked={settings.autoRefresh} onChange={()=>setSettings((p:any)=>({...p, autoRefresh:!p.autoRefresh}))}/></Row>
                <Row title={t.videoAutoplay}><Select value={settings.autoPlay} onChange={(v:any)=>setSettings((p:any)=>({...p, autoPlay:v}))} options={[{value:'wifi',label:'WiFi Only'},{value:'always',label:'Always'},{value:'never',label:'Never'}]}/></Row>
                <Row title={t.nsfw}><Toggle checked={settings.nsfw} onChange={()=>setSettings((p:any)=>({...p, nsfw:!p.nsfw}))}/></Row>
              </>}

              {tab==='appearance' && <>
                <Row title={t.phoneFrame} desc={t.phoneDesc}><Toggle checked={settings.phoneFrame} onChange={()=>setSettings((p:any)=>({...p, phoneFrame:!p.phoneFrame}))}/></Row>
                <Row title={t.theme}><Select value={settings.theme} onChange={(v:any)=>setSettings((p:any)=>({...p, theme:v}))} options={[{value:'dark',label:'Dark'},{value:'light',label:'Light'},{value:'midnight',label:'Midnight'}]}/></Row>
                <Row title={t.fontSize}><Select value={settings.fontSize} onChange={(v:any)=>setSettings((p:any)=>({...p, fontSize:v}))} options={[{value:'small',label:'Small'},{value:'medium',label:'Medium'},{value:'large',label:'Large'}]}/></Row>
                <Row title={t.doubleTap}><Toggle checked={settings.doubleTap} onChange={()=>setSettings((p:any)=>({...p, doubleTap:!p.doubleTap}))}/></Row>
              </>}

              {tab==='privacy' && <>
                <Row title={t.privateAcc}><Toggle checked={settings.private} onChange={()=>setSettings((p:any)=>({...p, private:!p.private}))}/></Row>
                <Row title={t.whoCanSee}><Select value={settings.whoSee} onChange={(v:any)=>setSettings((p:any)=>({...p, whoSee:v}))} options={[{value:'public',label:'Public'},{value:'followers',label:'Followers'},{value:'onlyme',label:'Only Me'}]}/></Row>
                <Row title={t.whoCanMsg}><Select value={settings.whoMsg} onChange={(v:any)=>setSettings((p:any)=>({...p, whoMsg:v}))} options={[{value:'everyone',label:'Everyone'},{value:'followers',label:'Followers'},{value:'none',label:'No One'}]}/></Row>
                <Row title={t.online}><Toggle checked={settings.online} onChange={()=>setSettings((p:any)=>({...p, online:!p.online}))}/></Row>
              </>}

              {tab==='language' && <>
                <Row title="Language / ভাষা" desc="Choose your language"><div className="flex gap-2">
                  <button onClick={()=>setLang('en')} className={`px-4 py-1.5 rounded-full text-xs ${lang==='en'?'bg-white text-black font-bold':'bg-white/10 text-white/60'}`}>{t.english}</button>
                  <button onClick={()=>setLang('bn')} className={`px-4 py-1.5 rounded-full text-xs ${lang==='bn'?'bg-white text-black font-bold':'bg-white/10 text-white/60'}`}>{t.bangla}</button>
                </div></Row>
                <div className="p-4 text-[11px] text-white/30">Language saved. Restart will apply fully.</div>
              </>}

              {tab==='wallet' && <>
                <div className="p-5 bg-gradient-to-r from-white to-zinc-300 text-black"><p className="text-2xl font-black">500 {t.coins}</p><p className="text-xs opacity-70">OneFeed Wallet</p></div>
                <Row title={t.buyCoins} desc="Bkash, Nagad, Card"><button onClick={()=>alert('Buy Coins - Working')} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold">Buy</button></Row>
                <Row title={t.payout}><button onClick={()=>alert('Payout Setup - Working')} className="bg-white/10 px-4 py-1.5 rounded-full text-xs">Setup</button></Row>
                <Row title={t.analytics}><button className="bg-white/10 px-4 py-1.5 rounded-full text-xs">View</button></Row>
              </>}

              {tab==='data' && <>
                <Row title={t.dataSaver}><Toggle checked={settings.dataSaver} onChange={()=>setSettings((p:any)=>({...p, dataSaver:!p.dataSaver}))}/></Row>
                <Row title={t.clearCache} desc="2.5 MB cached"><button onClick={()=>{localStorage.clear(); alert('Cache cleared'); location.reload();}} className="bg-white/10 px-4 py-1.5 rounded-full text-xs">Clear</button></Row>
                <Row title={t.deleteAcc}><button onClick={()=>{if(confirm('Delete account?')){localStorage.clear(); location.reload();}}} className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs">Delete</button></Row>
              </>}

            </div>
            <p className="text-[10px] text-white/20 text-center mt-4">OneFeed v28 • Original Settings • {lang==='en'?'English':'বাংলা'} Mode</p>
          </div>
        </div>
      </div>
    </div>
  )
}
