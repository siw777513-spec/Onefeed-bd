import { useState } from 'react';
import AuthPage from './components/Auth';

const BG = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200";
const FEED_IMGS = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
  "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800",
];

function FeedApp() {
  const [tab, setTab] = useState('Feed');
  const [inbox, setInbox] = useState(false);
  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(${BG})`}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 to-black/80"></div>
        <div className="relative z-10 h-full flex flex-col p-3">
          <div className="bg-white/[0.08] backdrop-blur-[20px] border border-white/20 rounded-[20px] p-3 flex justify-between items-center">
            <span className="font-black tracking-widest text-cyan-100">OneFeedBD ✨</span>
            <span className="text-xs">🔔</span>
          </div>
          <div className="flex gap-2 mt-3">
            {['Feed','Short','Watch','Story'].map(k=>(
              <button key={k} onClick={()=>setTab(k)} className={`flex-1 py-3 rounded-full text-xs font-bold border backdrop-blur-xl ${tab===k? 'bg-cyan-400/30 border-cyan-300 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 'bg-white/10 border-white/10 text-white/60'}`}>{k}</button>
            ))}
          </div>
          <div className="flex-1 mt-3 overflow-y-auto pb-24 space-y-4">
            {FEED_IMGS.map((img,i)=>(
              <div key={i} className="rounded-[28px] overflow-hidden border border-white/20 relative">
                <img src={img} className="w-full h-[480px] object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white/70">Evening Dhaka 🌧️ #RainyDhaka</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-white/[0.08] backdrop-blur-[25px] border border-cyan-300/30 rounded-[28px] flex justify-around items-center py-3">
            <span>🏠</span><span>🔍</span><span className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-black">+</span><button onClick={()=>setInbox(true)}>✉️</button><span>👤</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(false); // firebase auth দিয়ে পরে connect করবে
  // যদি user না থাকে -> Auth Page দেখাবে
  if (!user) {
    return <AuthPage onLogin={()=>setUser(true)} />;
  }
  return <FeedApp />;
}
