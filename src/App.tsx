import { useState } from 'react';
import Auth from './components/Auth';

const FEED_IMGS = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
  "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800",
];

function FeedApp({ mode, onLogout }: { mode: 'guest'|'auth', onLogout: ()=>void }) {
  const [tab, setTab] = useState('Short');
  const [activeBottom, setActiveBottom] = useState('Home');
  const isGuest = mode === 'guest';

  const handleLike = () => {
    if (isGuest) alert('Guest Mode: Like করতে Sign Up করতে হবে!');
  };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex flex-col p-3">

          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-[20px] p-3 flex justify-between items-center">
            <span className="font-black text-cyan-100">OneFeedBD {isGuest && '(Guest)'}</span>
            <button onClick={onLogout} className="text-[10px] bg-white/10 px-3 py-1 rounded-full">{isGuest? 'Login' : 'Logout'}</button>
          </div>

          <div className="flex gap-2 mt-3">
            {['Feed','Short','Watch','Story'].map(k=>{
              const disabled = isGuest && k==='Feed';
              return (
                <button key={k} disabled={disabled} onClick={()=>!disabled && setTab(k)}
                  className={`flex-1 py-3 rounded-full text-xs font-bold border backdrop-blur-xl ${disabled? 'opacity-20' : ''} ${tab===k? 'bg-cyan-400/30 border-cyan-300 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-white/10 border-white/10 text-white/50'}`}>
                  {k}
                </button>
              )
            })}
          </div>

          {isGuest && <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full py-1 px-3 text-[10px] text-yellow-200 text-center">Guest: Only Short/Watch/Story • No Like/Comment</div>}

          <div className="flex-1 mt-3 overflow-y-auto pb-28 space-y-4 scrollbar-hide">
            {FEED_IMGS.map((img,i)=>(
              <div key={i} className="rounded-[28px] overflow-hidden border border-white/20 relative">
                <img src={img} className="w-full h-[460px] object-cover" alt="" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  <button onClick={handleLike} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center">❤️<span className="text-[8px]">12k</span></button>
                  <button onClick={handleLike} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">💬</button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white/70">Dhaka Evening 🌧️</p>
                </div>
              </div>
            ))}
          </div>

          {/* --- BOTTOM HOME BUTTONS --- */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/[0.08] backdrop-blur-[25px] border border-cyan-300/20 rounded-[28px] flex justify-around items-center py-3 shadow-[0_0_30px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]">
              {[
                {icon:'🏠', label:'Home'},
                {icon:'🔍', label:'Search'},
                {icon:'+', label:'Plus', center:true},
                {icon:'✉️', label:'Inbox'},
                {icon:'👤', label:'Profile'},
              ].map((b,i)=> b.center? (
                <button key={i} onClick={handleLike} className="w-12 h-12 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] flex items-center justify-center text-black text-2xl font-bold">+</button>
              ) : (
                <button key={i} onClick={()=>setActiveBottom(b.label)} className={`flex flex-col items-center ${activeBottom===b.label? 'text-cyan-300' : 'text-white/50'}`}>
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[9px] mt-1">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Floating Message */}
          <button onClick={handleLike} className="absolute bottom-[90px] right-5 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-cyan-300/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">💬</button>

        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [auth, setAuth] = useState<'none'|'guest'|'auth'>('none');
  if (auth === 'none') {
    return <Auth onLogin={()=>setAuth('auth')} onGuest={()=>setAuth('guest')} />;
  }
  return <FeedApp mode={auth} onLogout={()=>setAuth('none')} />;
          }
