import { useState } from 'react';

type Props = { onLogin: () => void; onGuest: () => void; };

export default function Auth({ onLogin, onGuest }: Props) {
  const [isLogin, setIsLogin] = useState(false); // প্রথমে Sign Up দেখাবে

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center flex flex-col justify-between p-6" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[4px]"></div>
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10 mt-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-400 shadow-[0_0_25px_#22d3ee] flex items-center justify-center">⚡</div>
          <h1 className="text-center text-3xl font-black text-white mt-3">OneFeedBD</h1>
        </div>

        <div className="relative z-10 bg-white/[0.08] backdrop-blur-[25px] border border-white/15 rounded-[32px] p-6">
          <div className="flex bg-black/40 rounded-full p-1 border border-white/10 mb-6">
            <button onClick={()=>setIsLogin(false)} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${!isLogin? 'bg-white text-black' : 'text-white/50'}`}>Sign Up</button>
            <button onClick={()=>setIsLogin(true)} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${isLogin? 'bg-white text-black' : 'text-white/50'}`}>Login</button>
          </div>

          <div className="space-y-3">
            {!isLogin && <input placeholder="Full Name" className="w-full bg-white/10 border border-white/10 rounded-full py-3.5 px-5 text-sm outline-none placeholder:text-white/30" />}
            <input placeholder="Email" className="w-full bg-white/10 border border-white/10 rounded-full py-3.5 px-5 text-sm outline-none placeholder:text-white/30" />
            <input placeholder="Password" type="password" className="w-full bg-white/10 border border-white/10 rounded-full py-3.5 px-5 text-sm outline-none placeholder:text-white/30" />
            <button onClick={onLogin} className="w-full py-4 rounded-full bg-cyan-400 text-black font-black mt-2 shadow-[0_0_20px_#22d3ee]">
              {isLogin? 'LOGIN →' : 'CREATE ACCOUNT →'}
            </button>
          </div>

          <div className="mt-6">
            <button onClick={onGuest} className="w-full py-3.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm backdrop-blur">
              👁️ Continue as Guest - Only Watch
            </button>
            <p className="text-[10px] text-white/30 text-center mt-2">Guest can only view Short / Watch / Story</p>
          </div>
        </div>
      </div>
    </div>
  );
}
