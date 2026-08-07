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
  const isGuest = mode==='guest';
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(()=>{ const q=query(collection(db,'posts'),orderBy('timestamp','desc')); return onSnapshot(q,s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post)))); },[]);

  const handleLike = async (p:Post)=>{ if(isGuest) return alert('Login লাগবে!'); const ref=doc(db,'posts',p.id); const liked=p.likes?.includes(currentUser!.uid); await updateDoc(ref,{likes: liked? arrayRemove(currentUser!.uid):arrayUnion(currentUser!.uid), likeCount: liked? p.likeCount-1:p.likeCount+1}); };
  const handleComment = async (p:Post)=>{ if(isGuest) return alert('Login লাগবে!'); if(!commentText.trim()) return; const newComment = { id: Date.now().toString(), user: currentUser?.email?.split('@')[0], text: commentText }; await updateDoc(doc(db,'posts',p.id),{comments: arrayUnion(newComment)}); setCommentText(''); };
  const handleShare = async (p:Post)=>{ if(navigator.share){ try{ await navigator.share({title:'OneFeedBD', text:p.text, url:location.href}); }catch{}} else { navigator.clipboard.writeText(location.href); alert('Link Copy ✅'); } };
  const handleDelete = async (p:Post)=>{ if(!confirm('Delete করবে?')) return; await deleteDoc(doc(db,'posts',p.id)); setOpenMenuId(null); };
  const handleBlock = async (p:Post)=>{ if(!confirm(`${p.userName} কে Block?`)) return; await setDoc(doc(db,'blocked',p.userId),{by:ADMIN_EMAIL,time:serverTimestamp()}); alert('Blocked ✅'); };
  const handleFile = async (e:any)=>{ const file=e.target.files[0]; if(!file) return; if(file.size>100*1024*1024) return alert('100MB বেশি!'); setUploading(true); const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',UPLOAD_PRESET); const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{method:'POST',body:fd}); const d=await res.json(); if(d.secure_url) setMediaUrl(d.secure_url); else alert('Upload Fail: '+d.error?.message); setUploading(false); };
  const handleCreate = async ()=>{ if(!currentUser) return; if(!newText &&!mediaUrl) return alert('কিছু লিখো বা মিডিয়া দাও!'); await addDoc(collection(db,'posts'),{text:newText, image:createType!=='short'?mediaUrl:'', videoUrl:createType==='short'?mediaUrl:'', userName:currentUser.email?.split('@')[0]||'User', userId:currentUser.uid, likeCount:0, likes:[], comments:[], mediaType:createType, timestamp:serverTimestamp()}); setNewText(''); setMediaUrl(''); setShowCreate(false); };

  const filtered = posts.filter(p=>{ if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType; if(tab==='Short') return p.mediaType==='short'; if(tab==='Watch') return p.mediaType==='short'||p.videoUrl; if(tab==='Story') return p.mediaType==='story'; return true; });

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]"></div>
        <div className="relative z-10 h-full flex flex-col p-3">
          {/* Header */}
          <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-[20px] px-4 py-3 flex justify-between items-center"><div><p className="font-black text-white text-[13px] tracking-wide">OneFeedBD {isAdmin&&<span className="ml-2 text-[9px] bg-cyan-400 text-black px-2 py-0.5 rounded-full">ADMIN 👑</span>}</p><p className="text-white/30 text-[9px]">BANGLADESH FIRST SOCIAL</p></div><button onClick={onLogout} className="text-[10px] bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full text-white/60">Logout</button></div>

          {/* Tabs */}
          {activeBottom==='Home' && <div className="flex gap-1.5 mt-3 bg-black/40 backdrop-blur-xl border border-white/5 p-1 rounded-full">{['Feed','Short','Watch','Story'].map(k=><button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2.5 rounded-full text-[11px] font-black tracking-wide transition-all ${tab===k?'bg-white text-black shadow-lg':'text-white/40 hover:text-white/70'}`}>{k}</button>)}</div>}

          {/* Feed List */}
          <div className="flex-1 mt-3 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto pb-28 space-y-3.5 no-scrollbar">
              {filtered.map(p=>{
                const isOwner = p.userId === currentUser?.uid;
                const canDelete = isOwner || isAdmin;
                const liked = p.likes?.includes(currentUser?.uid||'');
                return (
                <div key={p.id} className="rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl shadow-2xl">
                  {/* Post Header */}
                  <div className="flex justify-between items-center p-3.5">
                    <div className="flex gap-2.5 items-center"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-9 h-9 rounded-full border-white/10"/><div><p className="text-white text-[12px] font-bold flex items-center gap-1">{p.userName} {isAdmin && p.userId===currentUser?.uid && <span className="text-cyan-300">✔</span>}</p><p className="text-white/30 text-[9px]">{p.mediaType} • Just now</p></div></div>
                    <div className="relative"><button onClick={()=>setOpenMenuId(openMenuId===p.id?null:p.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">⋯</button>
                      {openMenuId===p.id && <div className="absolute right-0 top-10 w-40 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl">
                        <button onClick={()=>handleShare(p)} className="w-full text-left px-4 py-3 text-xs text-white/70 hover:bg-white/5">↗️ Share Post</button>
                        {canDelete && <button onClick={()=>handleDelete(p)} className="w-full text-left px-4 py-3 text-xs text-red-300 hover:bg-red-500/10 border-t border-white/5">🗑️ Delete Post</button>}
                        {isAdmin &&!isOwner && <button onClick={()=>handleBlock(p)} className="w-full text-left px-4 py-3 text-xs text-orange-300 hover:bg-orange-500/10 border-t border-white/5">🚫 Block User</button>}
                      </div>}
                    </div>
                  </div>

                  {/* Media */}
                  {p.image && <img src={p.image} className="w-full max-h-[480px] object-cover bg-black/20"/>}
                  {p.videoUrl && <video src={p.videoUrl} controls playsInline className="w-full max-h-[500px] bg-black"/>}

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[13px] text-white/85 leading-[18px] mb-1">{p.text}</p>

                    {/* BEAUTIFUL BUTTONS */}
                    <div className="flex items-center gap-2 border-t border-white/[0.06] pt-3.5 mt-3">
                      <button onClick={()=>handleLike(p)} className={`group flex items-center gap-1.5 px-4 py-2 rounded-full border backdrop-blur-md transition-all active:scale-90 ${liked?'bg-pink-500/15 border-pink-500/30 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.25)]':'bg-white/[0.06] border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                        <span className={`text-[16px] transition-all ${liked?'scale-110':''}`}>{liked?'❤️':'🤍'}</span>
                        <span className="text-[11px] font-black">{p.likeCount||0}</span>
                      </button>
                      <button onClick={()=>setOpenCommentId(openCommentId===p.id?null:p.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border backdrop-blur-md transition-all active:scale-90 ${openCommentId===p.id?'bg-cyan-400/15 border-cyan-400/30 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]':'bg-white/[0.06] border-white/10 text-white/50 hover:bg-white/10'}`}>
                        <span className="text-[14px]">💬</span><span className="text-[11px] font-black">{p.comments?.length||0}</span>
                      </button>
                      <button onClick={()=>handleShare(p)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-white/50 backdrop-blur-md hover:bg-white/10 hover:text-white transition-all active:scale-90 ml-auto">
                        <span className="text-[14px]">✈️</span><span className="text-[11px] font-black">Share</span>
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60">🔖</button>
                    </div>

                    {/* COMMENT BOX */}
                    {openCommentId===p.id && <div className="mt-3 bg-black/30 border border-white/10 rounded-[20px] p-3 backdrop-blur-xl">
                      <div className="space-y-2.5 max-h-40 overflow-y-auto mb-3 pr-1 no-scrollbar">
                        {p.comments?.length? p.comments.map((c:any)=><div key={c.id} className="flex gap-2"><img src={`https://i.pravatar.cc/100?u=${c.user}`} className="w-6 h-6 rounded-full mt-0.5"/><div className="bg-white/10 rounded-2xl rounded-tl-md px-3 py-2 flex-1"><p className="text-[11px] font-bold text-cyan-300">{c.user}</p><p className="text-[11px] text-white/80 leading-snug">{c.text}</p></div></div>):<p className="text-center text-[11px] text-white/20 py-4">প্রথম Comment করো! 👇</p>}
                      </div>
                      <div className="flex gap-2 items-center bg-[#1a1a1a] border border-white/10 rounded-full p-1 pl-4"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Comment লিখো..." className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"/><button onClick={()=>handleComment(p)} className="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-black shadow-[0_0_15px_#22d3ee] active:scale-90">↑</button></div>
                    </div>}
                  </div>
                </div>
              )})}
              {filtered.length===0 && <div className="text-center mt-20"><p className="text-4xl">📭</p><p className="text-white/30 text-xs mt-3">কোনো {tab} নেই</p><p className="text-white/20 text-[10px] mt-1">+ দিয়ে প্রথম {tab} ছাড়ো!</p></div>}
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-[28px] flex justify-around items-center py-2 px-2 shadow-2xl">
              {[{k:'Home',i:'⌂'},{k:'Search',i:'⌕'},{k:'Add',i:'+'},{k:'Inbox',i:'✉'},{k:'Profile',i:'◍'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=> isGuest? alert('Login লাগবে!'):setShowCreate(true)} className="w-12 h-12 rounded-full bg-white text-black font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-90">+</button>:<button key={b.k} onClick={()=>setActiveBottom(b.k)} className={`flex flex-col items-center px-3 py-1 rounded-full ${activeBottom===b.k?'text-white bg-white/10':'text-white/30'}`}><span className="text-[18px]">{b.i}</span><span className="text-[8px] font-bold mt-0.5 tracking-widest">{b.k.toUpperCase()}</span></button>)}
            </div>
          </div>

          {/* CREATE MODAL */}
          {showCreate && <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"><div className="w-full bg-[#161616] border border-white/10 rounded-[28px] p-5 shadow-2xl"><div className="flex justify-between items-center mb-4"><h3 className="text-white font-black text-sm">Create New</h3><button onClick={()=>setShowCreate(false)} className="w-8 h-8 rounded-full bg-white/10 text-white/50">✕</button></div><div className="flex gap-1 mb-4 bg-black border border-white/5 rounded-full p-1">{(['feed','short','story'] as const).map(t=><button key={t} onClick={()=>setCreateType(t)} className={`flex-1 py-2.5 rounded-full text-[10px] font-black tracking-widest ${createType===t?'bg-white text-black':'text-white/40'}`}>{t.toUpperCase()}</button>)}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder={createType==='short'?'Short এর Caption...':'কি ভাবছো?'} className="w-full h-24 bg-white/[0.06] border border-white/10 rounded-2xl p-4 text-xs text-white outline-none resize-none placeholder:text-white/20"/><label className="block mt-3 py-4 rounded-2xl bg-white/[0.04] border border-dashed border-white/15 text-center text-[11px] text-white/40 cursor-pointer hover:bg-white/[0.07]">{uploading?'⏳ Uploading...':mediaUrl?'✅ Upload Done - Change?': createType==='short'?'📹 ভিডিও Select করো (Max 100MB)':'🖼️ ছবি Select করো'}<input type="file" accept={createType==='short'?'video/*':'image/*'} onChange={handleFile} className="hidden"/></label>{mediaUrl && <div className="mt-3 rounded-2xl overflow-hidden border border-white/10">{createType==='short'?<video src={mediaUrl} className="w-full h-40 object-cover"/>:<img src={mediaUrl} className="w-full h-40 object-cover"/>}</div>}<button onClick={handleCreate} disabled={uploading} className="w-full mt-5 py-4 rounded-full bg-white text-black font-black text-xs tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 active:scale-[0.98]">PUBLISH NOW →</button></div></div>}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<'none'|'guest'|'auth'>('none');
  const [checking, setChecking] = useState(true);
  useEffect(()=>{ const unsub=onAuthStateChanged(auth,u=>{ if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChecking(false); }); return ()=>unsub(); },[]);
  if(checking) return <div className="min-h-screen bg-black flex items-center justify-center text-white/30 text-xs">OneFeedBD Loading...</div>;
  if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
  return <FeedApp mode={mode} onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
                                                                                              }
