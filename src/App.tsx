import { useState } from 'react';

const photos = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
  "https://images.unsplash.com/photo-1572949791660-6626e0e8d482?w=800",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
];

const shortVideos = [
  { id: 1, user: "@sakib_dhaka", views: "12.4K", desc: "Rainy Dhaka ride 🌧️ #DhakaRain" },
  { id: 2, user: "@nila_vlog", views: "8.2K", desc: "Old Dhaka Biryani 😍" },
];

const watchVideos = [
  { id: 1, title: "Full Dhaka City Tour 2026 - 4K", duration: "15:42", thumb: photos[0] },
  { id: 2, title: "How I edit my vlogs?", duration: "32:10", thumb: photos[1] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'Feed'|'Short'|'Watch'|'Story'>('Feed');
  const [showInbox, setShowInbox] = useState(false);

  return (
    <div className="min-h-screen bg-[#050a0f] text-white flex justify-center p-2 font-sans">
      <div className="w-full max-w-[420px] bg-black/40 backdrop-blur-2xl rounded-[40px] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,255,200,0.15)] flex flex-col h-[92vh] relative">

        <div className="p-5">
          <div className="bg-white/[0.07] border border-cyan-400/30 rounded-2xl p-4 flex justify-between items-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <h1 className="text-2xl font-black tracking-wider text-cyan-300">OneFeedBD</h1>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {(['Feed','Short','Watch','Story'] as const).map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className={`py-3 rounded-2xl text-[13px] font-bold border transition-all ${activeTab===tab? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_15px_#22d3ee]' : 'bg-white/10 border-white/10 text-white/60'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-28 scrollbar-hide">

          {activeTab==='Feed' && (
            <div className="space-y-5">
              {photos.map((p,i)=>(
                <div key={i} className="w-full rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.04]">
                  <img src={p} className="w-full h-auto object-cover" />
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex gap-4 text-[13px]">
                      <span>❤️ 1.2k</span>
                      <span>💬 89</span>
                      <span>↗️ Share</span>
                    </div>
                    <span className="text-xs text-white/40">@user_{i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==='Short' && (
            <div className="space-y-4">
              {shortVideos.map(v=>(
                <div key={v.id} className="h-[500px] rounded-[30px] overflow-hidden relative border border-white/10 bg-gray-900">
                  <img src={photos[0]} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black to-transparent">
                    <p className="font-bold">{v.user}</p>
                    <p className="text-sm text-white/70">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==='Watch' && (
            <div className="space-y-4">
              {watchVideos.map(v=>(
                <div key={v.id} className="bg-white/5 rounded-3xl p-3 border border-white/10">
                  <div className="aspect-video rounded-2xl overflow-hidden relative">
                    <img src={v.thumb} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded-lg text-xs">{v.duration}</span>
                  </div>
                  <p className="font-bold mt-3 text-sm">{v.title}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab==='Story' && (
            <div>
              <div className="flex gap-3 overflow-x-auto pb-3">
                {[1,2,3,4].map(i=>(
                  <div key={i} className="min-w-[70px] text-center">
                    <div className="w-[64px] h-[64px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-pink-600">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full rounded-full border-2 border-black" />
                    </div>
                    <p className="text-[11px] mt-1">User {i}</p>
                    <p className="text-[9px] text-yellow-400">12h left</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gradient-to-br from-yellow-500/10 to-pink-500/10 border border-yellow-400/20 rounded-3xl p-4 text-center">
                <p className="text-yellow-300 font-bold">⏰ Story System</p>
                <p className="text-xs text-white/60 mt-1">Photo + Video + Text<br/>24 ঘণ্টা পর Auto Delete</p>
              </div>
            </div>
          )}
        </div>

        <button onClick={()=>setShowInbox(true)} className="absolute bottom-[92px] right-5 w-14 h-14 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee] flex items-center justify-center text-black text-xl">
          💬
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-cyan-400/30 rounded-[28px] flex justify-around items-center py-3">
            <button className="text-cyan-300 text-center">🏠<br/><span className="text-[10px]">Home</span></button>
            <button className="text-center">🔍<br/><span className="text-[10px]">Search</span></button>
            <button className="w-12 h-12 rounded-full bg-cyan-400 text-black text-2xl font-bold shadow-[0_0_15px_#22d3ee]">+</button>
            <button onClick={()=>setShowInbox(true)} className="relative text-center">✉️<span className="absolute -top-1 -right-1 bg-red-500 text-[8px] px-1 rounded-full">3</span><br/><span className="text-[10px]">Inbox</span></button>
            <button className="text-center">👤<br/><span className="text-[10px]">Profile</span></button>
          </div>
        </div>

        {showInbox && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-black">Messages</h2>
              <button onClick={()=>setShowInbox(false)} className="w-9 h-9 rounded-full bg-white/10">✕</button>
            </div>
            <div className="space-y-3">
              {['Sakib','Nila','Rafi'].map(n=>(
                <div key={n} className="bg-white/5 p-4 rounded-2xl flex gap-3 border border-white/5">
                  <img src={`https://i.pravatar.cc/100?u=${n}`} className="w-10 h-10 rounded-full" />
                  <div><p className="font-bold text-sm">{n}</p><p className="text-xs text-white/50">Hey, seen my new post?</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
                      }
