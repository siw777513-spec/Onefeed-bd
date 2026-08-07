import { useState } from 'react';

const BG = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200";
const FEED_IMGS = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
  "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800",
];

export default function App() {
  const [tab, setTab] = useState('Feed');
  const [inbox, setInbox] = useState(false);

  return (
    <div className="min-h-screen flex justify-center bg-black">
      {/* Phone Frame with Rainy Dhaka Background */}
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(${BG})`}}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-transparent to-black/80"></div>

        {/* Content Layer */}
        <div className="relative z-10 h-full flex flex-col p-3">

          {/* Top Glass Bar - Like Image */}
          <div className="bg-white/[0.08] backdrop-blur-[20px] border border-white/20 rounded-[20px] p-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
              <span className="font-black tracking-widest text-cyan-100">OneFeedBD ✨</span>
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur">🔍</div>
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur">🔔</div>
            </div>
          </div>

          {/* Tabs - Like Image */}
          <div className="flex gap-2 mt-3">
            {[
              {k:'Feed', icon:'🏠'}, {k:'Short', icon:'🎵'}, {k:'Watch', icon:'▶️'}, {k:'Story', icon:'✨'}
            ].map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)}
                className={`flex-1 py-3 rounded-full text-xs font-bold border backdrop-blur-xl transition-all
                ${tab===t.k? 'bg-cyan-400/30 border-cyan-300 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]' : 'bg-white/10 border-white/10 text-white/60'}`}>
                {t.icon} {t.k}
              </button>
            ))}
          </div>

          {/* Main Card - Like Rainy Image in Screenshot */}
          <div className="flex-1 mt-3 overflow-y-auto scrollbar-hide pb-24">
            {tab==='Feed' && (
              <div className="space-y-4">
                {FEED_IMGS.map((img,i)=>(
                  <div key={i} className="relative rounded-[28px] overflow-hidden border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    {/* LIVE Badge */}
                    <div className="absolute top-3 left-3 z-20 bg-black/50 backdrop-blur-md border border-red-400/30 text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> LIVE • 1.2k watching
                    </div>

                    <img src={img} className="w-full h-[520px] object-cover" />

                    {/* Right Side Buttons - Like Image */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                      {[
                        {icon:'🤍', txt:'12.4k'}, {icon:'💬', txt:'832'}, {icon:'↗️', txt:'Share'}, {icon:'🔖', txt:'Save'}
                      ].map((b,j)=>(
                        <div key={j} className="w-14 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                          <span>{b.icon}</span><span className="text-[10px]">{b.txt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Info - Glass */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full border border-cyan-400" />
                        <span className="font-bold text-sm">@ahasan_ride ✔️</span>
                      </div>
                      <p className="text-xs mt-2 text-white/70">Evening rickshaw ride through Dhanmondi 🌧️✨ #Monsoon2026</p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-[10px] px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10">#RainyDhaka</span>
                        <span className="text-[10px] px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10">#RickshawRide</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab!=='Feed' && (
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] p-10 text-center text-white/50">
                {tab} - {tab==='Short'? '15-60s vertical videos' : tab==='Watch'? 'Long 1min-3hr videos' : 'Photo+Video+Text 24h expiry'}
              </div>
            )}
          </div>

          {/* Bottom Glass Nav */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/[0.08] backdrop-blur-[25px] border border-cyan-300/30 rounded-[28px] flex justify-around items-center py-3 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]">
            <button className="text-cyan-300 text-center"><div>🏠</div><div className="text-[9px]">Home</div></button>
            <button className="text-white/60 text-center"><div>🔍</div><div className="text-[9px]">Search</div></button>
            <button className="w-12 h-12 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] flex items-center justify-center text-black text-2xl">+</button>
            <button onClick={()=>setInbox(true)} className="relative text-white/60 text-center"><div>✉️</div><div className="text-[9px]">Inbox</div><span className="absolute -top-1 -right-1 bg-red-500 text-[7px] px-1 rounded-full text-white">3</span></button>
            <button className="text-white/60 text-center"><div>👤</div><div className="text-[9px]">Profile</div></button>
          </div>

          {/* Message Bubble - Like Image */}
          <button onClick={()=>setInbox(true)} className="absolute bottom-[85px] right-5 w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-cyan-300/50 shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center">💬</div>
          </button>

          {inbox && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl z-50 p-4">
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[20px] p-4">
                <div className="flex justify-between mb-4"><b>Messages</b><button onClick={()=>setInbox(false)}>✕</button></div>
                <p className="text-xs text-white/50">Message system ready - users can chat here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
                      }
