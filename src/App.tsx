import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './components/Auth';

type Post = { id: string; text: string; image: string; videoUrl: string; userName: string; likeCount: number; likes: string[]; userId: string; mediaType: string; comments?: any[] };
const CLOUD_NAME = "bvvoprge";
const UPLOAD_PRESET = "onefeed_preset";
const ADMIN_EMAIL = "siw777513@gmail.com";

function FeedApp({ onLogout }: { onLogout: ()=>void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState('Feed');
  const [activeBottom, setActiveBottom] = useState('Home');
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<'feed'|'short'|'story'>('feed');
  const [newText, setNewText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [openCommentId, setOpenCommentId] = useState<string|null>(null);
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(()=>{ const q=query(collection(db,'posts'),orderBy('timestamp','desc')); return onSnapshot(q,s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post)))); },[]);
  const handleLike = async (p:Post)=>{ const liked=p.likes?.includes(currentUser!.uid); await updateDoc(doc(db,'posts',p.id),{likes: liked? arrayRemove(currentUser!.uid):arrayUnion(currentUser!.uid), likeCount: liked? p.likeCount-1:p.likeCount+1}); };
  const handleComment = async (p:Post)=>{ await updateDoc(doc(db,'posts',p.id),{comments: arrayUnion({ id:Date.now().toString(), user:currentUser?.email?.split('@')[0], text:commentText })}); setCommentText(''); };
  const handleFile = async (e:any)=>{ const file=e.target.files[0]; setUploading(true); const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',UPLOAD_PRESET); const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{method:'POST',body:fd}); const d=await res.json(); setMediaUrl(d.secure_url); setUploading(false); };
  const handleCreate = async ()=>{ await addDoc(collection(db,'posts'),{text:newText, image:createType!=='short'?mediaUrl:'', videoUrl:createType==='short'?mediaUrl:'', userName:currentUser?.email?.split('@')[0], userId:currentUser?.uid, likeCount:0, likes:[], comments:[], mediaType:createType, timestamp:serverTimestamp()}); setNewText(''); setMediaUrl(''); setShowCreate(false); };
  const filtered = posts.filter(p=>{ if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType; if(tab==='Short') return p.mediaType==='short'; if(tab==='Watch') return p.videoUrl; if(tab==='Story') return p.mediaType==='story'; return true; });

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden">
        {/* FULL WATER BACKGROUND */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-black/50 to-purple-900/40"></div>
          <div className="absolute inset-0 backdrop-blur-[3px]"></div>
        </div>
        {/* Water Light Orbs */}
        <div className="absolute top-[-80px] left-[-50px] w-[300px] h-[300px] bg-cyan-400/30 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[100px] right-[-50px] w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-[80px] animate-pulse"></div>

        <div className="relative z-10 h-full flex flex-col p-3">
          {/* Header Water Glass */}
          <div className="bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[24px] px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="flex gap-2.5 items-center"><div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-black font-black flex items-center justify-center shadow-lg">⚡</div><div><p className="text-white font-black text-[13px] tracking-wide drop-shadow">OneFeedBD</p><p className="text-white/60 text-[8px] tracking-[3px]">WATER GLASS</p></div></div>
            <button onClick={onLogout} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/70">↪</button>
          </div>

          <div className="flex-1 mt-3 overflow-hidden flex flex-col">
            {activeBottom==='Home' && <>
              <div className="flex gap-1 p-1 rounded-full bg-white/10 backdrop-blur-[25px] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">{['Feed','Short','Watch','Story'].map(k=><button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${tab===k?'bg-white/90 backdrop-blur text-black shadow-lg':'text-white/50 hover:text-white/80'}`}>{k}</button>)}</div>
              <div className="flex-1 overflow-y-auto pb-28 mt-3 space-y-3 no-scrollbar">
                {filtered.map(p=>{ const liked=p.likes?.includes(currentUser?.uid||''); return <div key={p.id} className="rounded-[28px] overflow-hidden bg-white/10 backdrop-blur-[30px] border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <div className="flex justify-between p-4"><div className="flex gap-3"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-9 h-9 rounded-full ring-1 ring-white/30"/><div><p className="text-white text-xs font-bold drop-shadow">{p.userName}</p><p className="text-white/50 text-[9px]">{p.mediaType}</p></div></div></div>
                  {p.image&&<img src={p.image} className="w-full max-h-[400px] object-cover"/>}
                  {p.videoUrl&&<video src={p.videoUrl} controls className="w-full bg-black/20"/>}
                  <div className="p-4"><p className="text-[13px] text-white/90 drop-shadow-sm">{p.text}</p>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10"><button onClick={()=>handleLike(p)} className={`px-4 py-2 rounded-full border backdrop-blur-xl text-[11px] font-black ${liked?'bg-pink-500/20 border-pink-300/30 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.4)]':'bg-white/10 border-white/15 text-white/60'}`}>{liked?'❤️':'🤍'} {p.likeCount}</button><button onClick={()=>setOpenCommentId(openCommentId===p.id?null:p.id)} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/60 text-[11px] font-black backdrop-blur-xl">💬 {p.comments?.length||0}</button><button className="ml-auto px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/50 text-[11px]">↗ Share</button></div>
                    {openCommentId===p.id && <div className="mt-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-3"><div className="space-y-1 mb-2">{p.comments?.map((c:any)=><div key={c.id} className="text-[11px]"><span className="text-cyan-200 font-bold">{c.user}: </span><span className="text-white/70">{c.text}</span></div>)}</div><div className="flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Comment..." className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-xs text-white outline-none"/><button onClick={()=>handleComment(p)} className="px-4 rounded-full bg-white text-black font-bold text-xs">↑</button></div></div>}
                  </div>
                </div>})}
              </div>
            </>}

            {activeBottom==='Search' && <div className="flex-1 pb-24"><div className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-full px-5 py-3.5 flex gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"><span className="text-white/40">⌕</span><input placeholder="Search water glass..." className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"/></div><div className="mt-10 text-center"><p className="text-5xl opacity-30">💧</p><p className="text-white/20 text-xs mt-3 tracking-widest">WATER GLASS SEARCH</p></div></div>}

            {activeBottom==='Inbox' && <div className="flex-1 pb-24"><h2 className="text-white font-black text-xl drop-shadow">Inbox 💧</h2><div className="mt-4 space-y-2">{[1,2,3,4].map(i=><div key={i} className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-[20px] p-4 flex gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"><img src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full"/><div><p className="text-white text-xs font-bold">User {i}</p><p className="text-white/40 text-[11px]">Water glass message...</p></div></div>)}</div></div>}

            {activeBottom==='Profile' && <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
              <div className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-[28px] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
                <img src={`https://i.pravatar.cc/150?u=${currentUser?.uid}`} className="w-20 h-20 rounded-full mx-auto border-2 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)]"/>
                <h3 className="text-white font-black mt-3 drop-shadow">{currentUser?.email?.split('@')[0]}</h3><p className="text-white/40 text-[10px]">{currentUser?.email}</p>
                <div className="grid grid-cols-3 gap-2 mt-5">{[['POSTS',posts.filter(p=>p.userId===currentUser?.uid).length],['LIKES',posts.reduce((a,b)=>a+b.likeCount,0)],['FANS','1.2K']].map(([k,v])=><div key={k} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl py-3"><p className="text-white font-black">{v}</p><p className="text-white/30 text-[8px]">{k}</p></div>)}</div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">{posts.filter(p=>p.userId===currentUser?.uid).map(p=> p.image? <img key={p.id} src={p.image} className="h-24 object-cover rounded-xl border border-white/10"/> : <div key={p.id} className="h-24 bg-white/10 backdrop-blur rounded-xl border border-white/10 p-2 text-[10px] text-white/40">{p.text}</div>)}</div>
            </div>}

            <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-[40px] border border-white/20 rounded-[32px] flex justify-around items-center py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              {[{k:'Home',i:'⌂'},{k:'Search',i:'⌕'},{k:'Add',i:'+'},{k:'Inbox',i:'✉'},{k:'Profile',i:'◍'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=>setShowCreate(true)} className="w-12 h-12 rounded-full bg-white/90 backdrop-blur text-black font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.5)]">+</button>:<button key={b.k} onClick={()=>setActiveBottom(b.k)} className={`px-4 py-1.5 rounded-full ${activeBottom===b.k?'bg-white/15 text-white':'text-white/40'}`}><span className="text-[16px]">{b.i}</span></button>)}
            </div>
          </div>

          {showCreate && <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[20px] flex items-center justify-center p-4"><div className="w-full bg-white/15 backdrop-blur-[40px] border border-white/20 rounded-[28px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"><div className="flex justify-between mb-4"><h3 className="text-white font-black">Create Water Post</h3><button onClick={()=>setShowCreate(false)} className="w-8 h-8 rounded-full bg-white/10 text-white/50">✕</button></div><div className="flex gap-1 mb-4 bg-black/20 p-1 rounded-full border border-white/10">{(['feed','short','story'] as const).map(t=><button key={t} onClick={()=>setCreateType(t)} className={`flex-1 py-2 rounded-full text-[10px] font-black ${createType===t?'bg-white text-black':'text-white/40'}`}>{t.toUpperCase()}</button>)}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind? 💧" className="w-full h-24 bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-xs text-white outline-none placeholder:text-white/30"/><label className="block mt-3 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center text-xs text-white/40 cursor-pointer">{uploading?'Uploading...':mediaUrl?'✅ Done':'📎 Upload Media'}<input type="file" accept={createType==='short'?'video/*':'image/*'} onChange={handleFile} className="hidden"/></label><button onClick={handleCreate} className="w-full mt-5 py-4 rounded-full bg-white/90 backdrop-blur text-black font-black text-xs">PUBLISH 💧</button></div></div>}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<'none'|'guest'|'auth'>('none');
  const [checking, setChecking] = useState(true);
  useEffect(()=>{ const unsub=onAuthStateChanged(auth,u=>{ if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChecking(false); }); return ()=>unsub(); },[]);
  if(checking) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">💧 Loading Water Glass...</div>;
  if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
  return <FeedApp onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
  }
