import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './components/Auth';

type Post = { id: string; text: string; image: string; videoUrl: string; userName: string; likeCount: number; likes: string[]; userId: string; mediaType: string; comments?: any[] };
const CLOUD_NAME = "bvvoprge";
const UPLOAD_PRESET = "onefeed_preset";
const ADMIN_EMAIL = "siw777513@gmail.com";

function FeedApp({ mode, onLogout }: { mode: 'guest'|'auth', onLogout: ()=>void }) {
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
  const [openMenuId, setOpenMenuId] = useState<string|null>(null);
  const [searchQ, setSearchQ] = useState('');
  const isGuest = mode==='guest';
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const myPosts = posts.filter(p=>p.userId===currentUser?.uid);

  useEffect(()=>{ const q=query(collection(db,'posts'),orderBy('timestamp','desc')); return onSnapshot(q,s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post)))); },[]);
  const handleLike = async (p:Post)=>{ if(isGuest) return alert('Login লাগবে!'); const liked=p.likes?.includes(currentUser!.uid); await updateDoc(doc(db,'posts',p.id),{likes: liked? arrayRemove(currentUser!.uid):arrayUnion(currentUser!.uid), likeCount: liked? p.likeCount-1:p.likeCount+1}); };
  const handleComment = async (p:Post)=>{ if(!commentText.trim()) return; await updateDoc(doc(db,'posts',p.id),{comments: arrayUnion({ id:Date.now().toString(), user:currentUser?.email?.split('@')[0], text:commentText })}); setCommentText(''); };
  const handleShare = async ()=>{ if(navigator.share){ try{ await navigator.share({title:'OneFeedBD', url:location.href}); }catch{}} else { navigator.clipboard.writeText(location.href); alert('Link Copy ✅'); } };
  const handleDelete = async (p:Post)=>{ if(!confirm('Delete?')) return; await deleteDoc(doc(db,'posts',p.id)); };
  const handleFile = async (e:any)=>{ const file=e.target.files[0]; if(!file) return; setUploading(true); const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',UPLOAD_PRESET); const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{method:'POST',body:fd}); const d=await res.json(); setMediaUrl(d.secure_url); setUploading(false); };
  const handleCreate = async ()=>{ await addDoc(collection(db,'posts'),{text:newText, image:createType!=='short'?mediaUrl:'', videoUrl:createType==='short'?mediaUrl:'', userName:currentUser?.email?.split('@')[0], userId:currentUser?.uid, likeCount:0, likes:[], comments:[], mediaType:createType, timestamp:serverTimestamp()}); setNewText(''); setMediaUrl(''); setShowCreate(false); };

  const filtered = posts.filter(p=>{ if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType; if(tab==='Short') return p.mediaType==='short'; if(tab==='Watch') return p.videoUrl; if(tab==='Story') return p.mediaType==='story'; return true; });
  const searched = posts.filter(p=> p.text.toLowerCase().includes(searchQ.toLowerCase()) || p.userName.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="min-h-screen flex justify-center bg-[#050507]">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/90"></div>
        {/* Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 h-full flex flex-col p-3">
          {/* Header */}
          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[22px] px-4 py-3 flex justify-between items-center shadow-2xl">
            <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black">⚡</div><div><p className="font-black text-white text-[13px]">OneFeedBD {isAdmin&&<span className="bg-cyan-400 text-black text-[8px] px-1.5 py-0.5 rounded-full ml-1">ADMIN</span>}</p><p className="text-white/30 text-[8px] tracking-widest">PREMIUM SOCIAL</p></div></div>
            <div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 text-xs">🔔</div><button onClick={onLogout} className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 text-xs">↪</button></div>
          </div>

          {/* CONTENT SWITCH */}
          <div className="flex-1 mt-3 overflow-hidden flex flex-col">

            {/* HOME */}
            {activeBottom==='Home' && <>
              <div className="flex gap-1.5 bg-black/40 backdrop-blur-xl border border-white/5 p-1 rounded-full">{['Feed','Short','Watch','Story'].map(k=><button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-all ${tab===k?'bg-white text-black':'text-white/40'}`}>{k.toUpperCase()}</button>)}</div>
              <div className="flex-1 overflow-y-auto pb-28 mt-3 space-y-3.5 no-scrollbar">
                {filtered.map(p=>{
                  const liked=p.likes?.includes(currentUser?.uid||''); const canDelete=p.userId===currentUser?.uid || isAdmin;
                  return <div key={p.id} className="rounded-[26px] overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl">
                    <div className="flex justify-between p-3.5"><div className="flex gap-2.5"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-9 h-9 rounded-full"/><div><p className="text-white text-xs font-bold">{p.userName}</p><p className="text-white/30 text-[9px]">{p.mediaType} • 2m ago</p></div></div>
                      <div className="relative"><button onClick={()=>setOpenMenuId(openMenuId===p.id?p.id+'':p.id)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30">⋯</button>
                      {openMenuId===p.id && <div className="absolute right-0 top-9 w-36 bg-[#141414] border border-white/10 rounded-xl overflow-hidden z-20">{canDelete&&<button onClick={()=>handleDelete(p)} className="w-full text-left px-3 py-2.5 text-xs text-red-300 hover:bg-white/5">🗑️ Delete</button>}<button onClick={handleShare} className="w-full text-left px-3 py-2.5 text-xs text-white/60 hover:bg-white/5">↗️ Share</button></div>}</div>
                    </div>
                    {p.image&&<img src={p.image} className="w-full max-h-[420px] object-cover"/>}
                    {p.videoUrl&&<video src={p.videoUrl} controls className="w-full max-h-[500px] bg-black"/>}
                    <div className="p-3.5"><p className="text-[13px] text-white/80 mb-3">{p.text}</p>
                      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        <button onClick={()=>handleLike(p)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-black transition-all active:scale-90 ${liked?'bg-pink-500/15 border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]':'bg-white/5 border-white/10 text-white/50'}`}><span>{liked?'❤️':'🤍'}</span>{p.likeCount||0}</button>
                        <button onClick={()=>setOpenCommentId(openCommentId===p.id?null:p.id)} className={`px-4 py-2 rounded-full border text-[11px] font-black bg-white/5 border-white/10 text-white/50 ${openCommentId===p.id?'!bg-cyan-400/15!text-cyan-300!border-cyan-400/30':''}`}>💬 {p.comments?.length||0}</button>
                        <button onClick={handleShare} className="ml-auto px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] font-black">↗️ Share</button>
                      </div>
                      {openCommentId===p.id && <div className="mt-3 bg-black/40 border border-white/10 rounded-2xl p-3"><div className="space-y-2 mb-2 max-h-32 overflow-y-auto">{p.comments?.map((c:any)=><div key={c.id} className="flex gap-2"><img src={`https://i.pravatar.cc/100?u=${c.user}`} className="w-5 h-5 rounded-full"/><div className="bg-white/10 rounded-xl px-3 py-1.5 flex-1"><p className="text-[10px] font-bold text-cyan-300">{c.user}</p><p className="text-[11px] text-white/70">{c.text}</p></div></div>)}</div><div className="flex gap-2 bg-white/5 rounded-full p-1 pl-3 border border-white/10"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Comment..." className="flex-1 bg-transparent text-xs text-white outline-none"/><button onClick={()=>handleComment(p)} className="w-7 h-7 rounded-full bg-white text-black font-bold">↑</button></div></div>}
                    </div>
                  </div>
                })}
              </div>
            </>}

            {/* SEARCH - ADVANCE */}
            {activeBottom==='Search' && <div className="flex-1 flex flex-col pb-24">
              <div className="bg-white/10 border border-white/10 rounded-full flex items-center px-4 py-3 gap-2"><span className="text-white/30">⌕</span><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search people, posts, videos..." className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"/></div>
              <div className="flex-1 overflow-y-auto mt-4 space-y-2 no-scrollbar">
                {searchQ? searched.map(p=><div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-3"><img src={p.image||`https://i.pravatar.cc/100?u=${p.userId}`} className="w-12 h-12 rounded-xl object-cover"/><div><p className="text-white text-xs font-bold">{p.userName}</p><p className="text-white/50 text-[11px] line-clamp-1">{p.text}</p></div></div>) : <div className="text-center mt-20"><p className="text-3xl">🔍</p><p className="text-white/20 text-xs mt-2">Trending in Bangladesh</p><div className="flex flex-wrap gap-2 justify-center mt-4">{['#OneFeedBD','#ViralBD','#Cricket','#Dhaka'].map(t=><span key={t} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40">{t}</span>)}</div></div>}
              </div>
            </div>}

            {/* INBOX - ADVANCE */}
            {activeBottom==='Inbox' && <div className="flex-1 flex flex-col pb-24">
              <h2 className="text-white font-black text-lg">Messages</h2><p className="text-white/30 text-[10px] mb-4">3 new messages</p>
              <div className="space-y-2 overflow-y-auto no-scrollbar">
                {posts.slice(0,6).map(p=><div key={p.id} className="bg-white/[0.06] border border-white/10 rounded-2xl p-3 flex items-center gap-3 hover:bg-white/10"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-10 h-10 rounded-full"/><div className="flex-1"><p className="text-white text-xs font-bold">{p.userName}</p><p className="text-white/40 text-[11px] truncate">Hey! Seen your {p.mediaType} 🔥</p></div><span className="text-[9px] text-white/20">2m</span></div>)}
              </div>
              <button className="mt-auto w-full py-4 rounded-full bg-white text-black font-black text-xs tracking-widest">+ NEW CHAT</button>
            </div>}

            {/* PROFILE - ADVANCE */}
            {activeBottom==='Profile' && <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
              <div className="bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-[28px] p-5 text-center">
                <img src={`https://i.pravatar.cc/150?u=${currentUser?.uid}`} className="w-20 h-20 rounded-full mx-auto border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"/>
                <h3 className="text-white font-black mt-3 flex justify-center items-center gap-1">{currentUser?.email?.split('@')[0]} {isAdmin&&<span className="text-cyan-300">✔</span>}</h3>
                <p className="text-white/30 text-[10px]">{currentUser?.email}</p>
                <div className="flex justify-center gap-6 mt-4"><div><p className="text-white font-black">{myPosts.length}</p><p className="text-white/30 text-[9px]">POSTS</p></div><div><p className="text-white font-black">{posts.reduce((a,b)=>a+b.likeCount,0)}</p><p className="text-white/30 text-[9px]">LIKES</p></div><div><p className="text-white font-black">1.2K</p><p className="text-white/30 text-[9px]">FOLLOWERS</p></div></div>
                <div className="flex gap-2 mt-5"><button className="flex-1 py-2.5 rounded-full bg-white text-black font-bold text-xs">Edit Profile</button><button className="flex-1 py-2.5 rounded-full bg-white/10 border border-white/10 text-white/70 font-bold text-xs">Share Profile</button></div>
              </div>
              <div className="flex gap-1.5 mt-4 bg-black/40 p-1 rounded-full border border-white/5"><button className="flex-1 py-2 rounded-full bg-white text-black text-[10px] font-black">POSTS</button><button className="flex-1 py-2 rounded-full text-white/30 text-[10px] font-black">VIDEOS</button><button className="flex-1 py-2 rounded-full text-white/30 text-[10px] font-black">SAVED</button></div>
              <div className="grid grid-cols-3 gap-1.5 mt-3">{myPosts.map(p=> p.image? <img key={p.id} src={p.image} className="h-28 object-cover rounded-xl"/> : p.videoUrl? <video key={p.id} src={p.videoUrl} className="h-28 object-cover rounded-xl"/> : <div key={p.id} className="h-28 bg-white/5 rounded-xl p-2 text-[10px] text-white/50">{p.text}</div>)}</div>
            </div>}

            {/* Bottom Nav - PRO */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#101012]/90 backdrop-blur-2xl border border-white/10 rounded-[30px] flex justify-around items-center py-2.5 px-2 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              {[{k:'Home',i:'⌂'},{k:'Search',i:'⌕'},{k:'Add',i:'+'},{k:'Inbox',i:'✉'},{k:'Profile',i:'◍'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=>setShowCreate(true)} className="w-12 h-12 rounded-full bg-white text-black font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-90">+</button>:<button key={b.k} onClick={()=>setActiveBottom(b.k)} className={`flex flex-col items-center px-3.5 py-1 rounded-full transition-all ${activeBottom===b.k?'text-white bg-white/10':'text-white/30'}`}><span className="text-[18px] leading-none">{b.i}</span><span className="text-[7px] font-black mt-1 tracking-widest">{b.k.toUpperCase()}</span></button>)}
            </div>
          </div>

          {/* CREATE MODAL */}
          {showCreate && <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"><div className="w-full bg-[#161616] border border-white/10 rounded-[28px] p-5"><div className="flex justify-between mb-4"><h3 className="text-white font-black text-sm">Create</h3><button onClick={()=>setShowCreate(false)} className="w-8 h-8 rounded-full bg-white/10 text-white/50">✕</button></div><div className="flex gap-1 mb-4 bg-black border border-white/5 rounded-full p-1">{(['feed','short','story'] as const).map(t=><button key={t} onClick={()=>setCreateType(t)} className={`flex-1 py-2.5 rounded-full text-[10px] font-black ${createType===t?'bg-white text-black':'text-white/40'}`}>{t.toUpperCase()}</button>)}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none"/><label className="block mt-3 py-4 rounded-2xl bg-white/5 border border-dashed border-white/15 text-center text-[11px] text-white/40 cursor-pointer">{uploading?'Uploading...':mediaUrl?'✅ Done': createType==='short'?'📹 Video':'🖼️ Image'}<input type="file" accept={createType==='short'?'video/*':'image/*'} onChange={handleFile} className="hidden"/></label>{mediaUrl && <div className="mt-3 rounded-2xl overflow-hidden border border-white/10">{createType==='short'?<video src={mediaUrl} className="w-full h-40 object-cover"/>:<img src={mediaUrl} className="w-full h-40 object-cover"/>}</div>}<button onClick={handleCreate} disabled={uploading} className="w-full mt-5 py-4 rounded-full bg-white text-black font-black text-xs">PUBLISH →</button></div></div>}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<'none'|'guest'|'auth'>('none');
  const [checking, setChecking] = useState(true);
  useEffect(()=>{ const unsub=onAuthStateChanged(auth,u=>{ if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChecking(false); }); return ()=>unsub(); },[]);
  if(checking) return <div className="min-h-screen bg-black flex items-center justify-center text-white/30 text-xs">Loading OneFeedBD...</div>;
  if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
  return <FeedApp mode={mode} onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
    }
