type Props = { onLogin: () => void };
export default function Auth({ onLogin }: Props) {
  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center flex items-center justify-center p-6" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px]"></div>
        <div className="relative z-10 w-full bg-white/[0.08] backdrop-blur-[25px] border border-white/15 rounded-[32px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <h1 className="text-center text-2xl font-black text-cyan-100">OneFeedBD ✨</h1>
          <p className="text-center text-xs text-white/40 mt-2 mb-6">LOGIN TO CONTINUE</p>
          <input placeholder="Email" className="w-full bg-white/10 border border-white/10 rounded-full py-3 px-5 mb-3 text-sm outline-none" />
          <input placeholder="Password" type="password" className="w-full bg-white/10 border border-white/10 rounded-full py-3 px-5 mb-6 text-sm outline-none" />
          <button onClick={onLogin} className="w-full py-4 rounded-full bg-cyan-400 text-black font-black shadow-[0_0_20px_#22d3ee]">LOGIN TO FEED →</button>
        </div>
      </div>
    </div>
  );
}
