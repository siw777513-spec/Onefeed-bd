import { useState } from 'react';

const photos = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
  "https://images.unsplash.com/photo-1572949791660-6626e0e8d482?w=800",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Feed'|'Short'|'Watch'|'Story'>('Feed');
  const [showInbox, setShowInbox] = useState(false);

  return (
    <div className="min-h-screen bg-[#030a0f] text-white flex justify-center p-2 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/15 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[420px] relative z-10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-[30px] rounded-[42px] border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(6,182,212,0.15)] flex flex-col h-[92vh] overflow-hidden">

        {/* Header Water Glass */}
        <div className="p-5">
          <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-2xl rounded-[20px] border border-white/20 p-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="bg-black/20 backdrop-blur-xl rounded-[19px] p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-300 to-teal-500 shadow-[0_0_15px_#22d3ee]"></div>
                <h1 className="text-[22px] font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">OneFeedBD</h1>
              </div>
              <div className="flex gap-2">
                <div className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur border border-white/10 flex items-center justify-center">🔍</div>
                <div className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur border border-white/10 flex items-center justify-center">🔔</div>
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          </div>

          {/* Tabs Water Glass */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {(['Feed','Short','Watch','Story'] as const).map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className={`relative py-[14px] rounded-[16px] text-[12px] font-bold tracking-wide transition-all duration-300 border overflow-hidden
                ${activeTab===tab
                 ? 'bg-gradient-to-br from-cyan-400/30 to-teal-400/20 text-cyan-100 border-cyan-300/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_20px_rgba(34,211,238,0.4)]'
                  : 'bg-white/[0.06] backdrop-blur-xl border-white/[0.08] text-white/50 hover:bg-white/[0.10]'}`}>
                {activeTab===tab && <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-28 scrollbar-hide">
          {activeTab==='Feed' && (
            <div className="space-y-5">
              {photos.map((p,i)=>(
                <div key={i} className="group relative rounded-[28px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="rounded-[27px] overflow-hidden bg-black/30 backdrop-blur-xl border border-white/5">
                    <img src={p} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="relative p-4 flex justify-between items-center bg-white/[0.04] backdrop-blur-md">
                      <div className="flex gap-4 text-xs">
                        <span className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">❤️ 12.4K</span>
                        <span className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">💬 321</span>
                      </div>
                      <span className="text-[10px] text-white/40">@riaz_dhaka</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab!=='Feed' && (
            <div className="h-64 flex items-center justify-center bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/10 text-white/30">
              {activeTab} Coming Soon...
            </div>
          )}
        </div>

        {/* Floating Message - Liquid Glass */}
        <button onClick={()=>setShowInbox(true)}
          className="absolute bottom-[100px] right-5 w-[62px] h-[62px] rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(6,182,212,0.4)] flex items-center justify-center text-xl">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-black shadow-[0_0_20px_#22d3ee]">💬</div>
        </button>

        {/* Bottom Nav - Water Glass */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="relative bg-gradient-to-b from-white/[0.12] to-white/[0.04] backdrop-blur-[25px] rounded-[28px] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_15px_40px_rgba(0,0,0,0.4)] p-[1px]">
            <div className="bg-black/30 backdrop-blur-xl rounded-[27px] flex justify-around items-center py-3">
              {[
                {icon:'🏠',label:'Home',active:true},
                {icon:'🔍',label:'Search',active:false},
                {icon:'+',label:'Plus',center:true},
                {icon:'✉️',label:'Inbox',active:false, badge:3},
                {icon:'👤',label:'Profile',active:false},
              ].map((b,i)=>(
                b.center? (
                  <button key={i} className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 shadow-[0_0_25px_#22d3ee,inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center text-3xl text-black font-bold">+</button>
                ) : (
                  <button key={i} onClick={()=>b.label==='Inbox'&&setShowInbox(true)} className={`relative text-center ${b.active?'text-cyan-300':''}`}>
                    <div className="text-[18px]">{b.icon}{b.badge&&<span className="absolute -top-1 -right-2 bg-red-500 text-[8px] px-1 rounded-full text-white">{b.badge}</span>}</div>
                    <span className="text-[9px] opacity-60">{b.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {showInbox && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px] z-50 p-5">
            <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/15 rounded-[24px] p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-black">Messages</h2>
                <button onClick={()=>setShowInbox(false)} className="w-8 h-8 rounded-full bg-white/10">✕</button>
              </div>
              <div className="space-y-3">
                {['Sakib','Nila'].map(n=>(
                  <div key={n} className="bg-white/[0.06] p-3 rounded-xl flex gap-3 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-cyan-400/20"></div>
                    <div><p className="font-bold text-sm">{n}</p><p className="text-xs text-white/40">Hey, nice post!</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                  }
