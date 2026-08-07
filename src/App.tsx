import { useState } from 'react';
import Auth from './components/Auth';

const FEED_IMGS = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
];

function FeedApp({ mode, onLogout }: { mode: 'guest'|'auth', onLogout: ()=>void }) {
  const [tab, setTab] = useState('Short'); // Guest এর জন্য Short default
  const isGuest = mode === 'guest';

  const handleLike = () => {
    if (isGuest) alert('Guest Mode: Like করতে Sign Up করতে হবে!');
  };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center flex flex-col" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex flex-col p-3">

          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-[20px] p-3 flex justify-between items-center">
            <span className="font-black text-cyan-100">OneFeedBD {isGuest && '(Guest)'}</span>
            <button onClick={onLogout} className="text-[10px] bg-white/10 px-3 py-1 rounded-full">{isGuest? 'Login' : 'Logout'}</button>
          </div>

          <div className="flex gap-2 mt-3">
            {['Feed','Short','Watch','Story'].map(k=>{
              const disabled = isGuest && k==='Feed'; // Guest Feed দেখতে পারবে না
              return (
                <button key={k} disabled={disabled} onClick={()=>!disabled && setTab(k)}
                  className={`flex-1 py-3 rounded-full text-xs font-bold border backdrop-blur-xl ${disabled? 'opacity-20' : ''} ${tab===k? 'bg-cyan-400/30 border-cyan-300 text-white' : 'bg-white/10 border-white/10 text-white/50'}`}>
                  {k}
                </button>
              )
            })}
          </div>

          {isGuest && <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full py-1 px-3 text-[10px] text-yellow-200 text-center">Guest Mode: Only Short / Watch / Story - Like/Comment Disabled</div>}

          <div className="flex-1 mt-3 overflow-y-auto pb-24 space-y-4">
            {FEED_IMGS.map((img,i)=>(
              <div key={i} className="rounded-[28px] overflow-hidden border border-white/20 relative">
                <img src={img} className="w-full h-[450px] object-cover" alt="" />
                <div className="absolute right-2 bottom-20 flex flex-col gap-3">
                  <button onClick={handleLike} className={`w-12 h-12 rounded-full backdrop-blur border flex flex-col items-center justify-center ${isGuest? 'bg-white/5 border-white/10 opacity-50' : 'bg-white/10 border-white/20'}`}>❤️<span className="text-[8px]">12k</span></button>
                  <button onClick={handleLike} className={`w-12 h-12 rounded-full backdrop-blur border flex items-center justify-center ${isGuest? 'opacity-50' : ''}`}>💬</button>
                </div>
              </div>
            ))}
          </div>
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
