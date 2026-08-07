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
  const [openMenuId, setOpenMenuId] = useState<string|null>(null);
  const [searchQ, setSearchQ] = useState('');
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const myPosts = posts.filter(p=>p.userId===currentUser?.uid);
  const totalLikes = posts.filter(p=>p.userId===currentUser?.uid).reduce((a,b)=>a+(b.likeCount||0),0);

  useEffect(()=>{ const q=query(collection(db,'posts'),orderBy('timestamp','desc')); return onSnapshot(q,s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post)))); },[]);
  const handleLike = async (p:Post)=>{ const liked=p.likes?.includes(currentUser!.uid); await updateDoc(doc(db,'posts',p.id),{likes: liked? arrayRemove(currentUser!.uid):arrayUnion(currentUser!.uid), likeCount: liked? p.likeCount-1:p.likeCount+1}); };
  const handleComment = async (p:Post)=>{ if(!commentText.trim()) return; await updateDoc(doc(db,'posts',p.id),{comments: arrayUnion({ id:Date.now().toString(), user:currentUser?.email?.split('@')[0], text:commentText })}); setCommentText(''); };
  const handleShare = async ()=>{ try{ await navigator.clipboard.writeText(location.href); alert('Link Copy ✅'); }catch{} };
  const handleDelete = async (p:Post)=>{ if(!confirm('Delete করবে?')) return; await deleteDoc(doc(db,'posts',p.id)); setOpenMenuId(null); };
  const handleFile = async (e:any)=>{ const file=e.target.files[0]; if(!file) return; if(file.size>100*1024*1024) return alert('100MB বেশি!'); setUploading(true); const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',UPLOAD_PRESET); const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{method:'POST',body:fd}); const d=await res.json(); if(d.secure_url) setMediaUrl(d.secure_url); else alert('Fail'); setUploading(false); };
  const handleCreate = async ()=>{ if(!newText &&!mediaUrl) return alert('কিছু লিখো!'); await addDoc(collection(db,'posts'),{text:newText, image:createType!=='short'?mediaUrl:'', videoUrl:createType==='short'?mediaUrl:'', userName:currentUser?.email?.split('@')[0]||'User', userId:currentUser?.uid, likeCount:0, likes:[], comments:[], mediaType:createType, timestamp:serverTimestamp()}); setNewText(''); setMediaUrl(''); setShowCreate(false); };

  const filtered = posts.filter(p=>{ if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType; if(tab==='Short') return p.mediaType==='short'; if(tab==='Watch') return p.videoUrl; if(tab==='Story') return p.mediaType==='story'; return true; });
  const searched = posts.filter(p=> p.text.toLowerCase().includes(searchQ.toLowerCase()) || p.userName.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden">
        {/* FULL WATER BG */}
        <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-black/65 to-purple-900/30"></div><div className="absolute inset-0 backdrop-blur-[2px]"></div></div>
        <div className="absolute top-[-60px] left-[-40px] w-[280px] h-[280px] bg-cyan-400/25 rounded-full blur-[70px]"></div>
        <div className="absolute bottom-[80px] right-[-40px] w-[280px] h-[280px] bg-purple-400/20 rounded-full blur-[70px]"></div>

        <div className="relative z-10 h-full flex flex-col p-3">
          {/* Header Water */}
          <div className="bg-white/[0.10] backdrop-blur-[30px] border border-white/20 rounded-[24px] px-4 py-3 flex justify-between items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div className="flex gap-2.5 items-center"><div className="w-9 h-9 rounded-full bg-white text-black font-black flex items-center justify-center shadow-lg">⚡</div><div><p className="text-white font-black text-[13px]">OneFeedBD {isAdmin&&<span className="ml-1 text-[8px] bg-cyan-400 text-black px-1.5 py-0.5 rounded-full">ADMIN</span>}</p><p className="text-white/50 text-[8px] tracking-[2px]">WATER EDITION</p></div></div>
            <div className="flex gap-2"><button onClick={()=>setActiveBottom('Inbox')} className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-sm">✉</button><button onClick={()=>setActiveBottom('Settings')} className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-sm">⚙️</button></div>
          </div>

          <div className="flex-1 mt-3 overflow-hidden flex flex-col">
            {/* HOME */}
            {activeBottom==='Home' && <>
              <div className="flex gap-1 p-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">{['Feed','Short','Watch','Story'].map(k=><button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2.5 rounded-full text-[10px] font-black tracking-widest ${tab===k?'bg-white text-black shadow':'text-white/40'}`}>{k.toUpperCase()}</button>)}</div>
              <div className="flex-1 overflow-y-auto pb-28 mt-3 space-y-3 no-scrollbar">
                {filtered.map(p=>{ const liked=p.likes?.includes(currentUser?.uid||''); const canDelete=p.userId===currentUser?.uid || isAdmin; return (
                  <div key={p.id} className="rounded-[26px] overflow-hidden bg-white/[0.10] backdrop-blur-[30px] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <div className="flex justify-between p-3.5"><div className="flex gap-2.5 items-center"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-9 h-9 rounded-full ring-1 ring-white/20"/><div><p className="text-white text-xs font-bold">{p.userName}</p><p className="text-white/40 text-[9px]">{p.mediaType} • now</p></div></div><div className="relative"><button onClick={()=>setOpenMenuId(openMenuId===p.id?null:p.id)} className="w-8 h-8 rounded-full bg-white/10 border border-white/10 text-white/40 flex items-center justify-center">⋯</button>{openMenuId===p.id && <div className="absolute right-0 top-9 w-36 bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden z-20">{canDelete&&<button onClick={()=>handleDelete(p)} className="w-full text-left px-3 py-2.5 text-xs text-red-300 hover:bg-white/5">🗑️ Delete</button>}<button onClick={handleShare} className="w-full text-left px-3 py-2.5 text-xs text-white/60 hover:bg-white/5">↗️ Share</button></div>}</div></div>
                    {p.image&&<img src={p.image} className="w-full max-h-[420px] object-cover"/>}{p.videoUrl&&<video src={p.videoUrl} controls playsInline className="w-full max-h-[500px] bg-black/30"/>}
                    <div className="p-3.5"><p className="text-[13px] text-white/90">{p.text}</p>
                      {/* BEAUTIFUL BUTTONS */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                        <button onClick={()=>handleLike(p)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border backdrop-blur-xl text-[11px] font-black active:scale-90 ${liked?'bg-pink-500/20 border-pink-300/30 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.3)]':'bg-white/10 border-white/15 text-white/50'}`}><span className="text-[14px]">{liked?'❤️':'🤍'}</span>{p.likeCount||0}</button>
                        <button onClick={()=>setOpenCommentId(openCommentId===p.id?null:p.id)} className={`px-4 py-2 rounded-full border text-[11px] font-black backdrop-blur-xl ${openCommentId===p.id?'bg-cyan-400/20 border-cyan-300/30 text-cyan-200':'bg-white/10 border-white/15 text-white/50'}`}>💬 {p.comments?.length||0}</button>
                        <button onClick={handleShare} className="ml-auto px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/50 text-[11px] font-black">✈️ Share</button>
                      </div>
                      {openCommentId===p.id && <div className="mt-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-3"><div className="space-y-2 mb-2 max-h-32 overflow-y-auto no-scrollbar">{p.comments?.length? p.comments.map((c:any)=><div key={c.id} className="flex gap-2"><img src={`https://i.pravatar.cc/100?u=${c.user}`} className="w-5 h-5 rounded-full"/><div className="bg-white/10 rounded-xl rounded-tl-sm px-3 py-1.5"><p className="text-[10px] font-bold text-cyan-200">{c.user}</p><p className="text-[11px] text-white/70">{c.text}</p></div></div>):<p className="text-center text-[11px] text-white/20 py-2">No comments yet</p>}</div><div className="flex gap-2 bg-white/5 border border-white/10 rounded-full p-1 pl-3"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Comment..." className="flex-1 bg-transparent text-xs text-white outline-none"/><button onClick={()=>handleComment(p)} className="w-7 h-7 rounded-full bg-white text-black font-bold">↑</button></div></div>}
                    </div>
                  </div>
                )})}
                {filtered.length===0 && <div className="text-center mt-20"><p className="text-4xl opacity-20">💧</p><p className="text-white/20 text-xs mt-2">No {tab} yet</p></div>}
              </div>
            </>}

            {/* SEARCH */}
            {activeBottom==='Search' && <div className="flex-1 flex flex-col pb-24"><div className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-full px-5 py-3.5 flex gap-3"><span className="text-white/30">⌕</span><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search users, posts..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"/></div><div className="mt-3 flex gap-2 flex-wrap">{['#ForYou','#Viral','#BD','#Trending'].map(t=><span key={t} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/50">{t}</span>)}</div><div className="mt-4 space-y-2 overflow-y-auto no-scrollbar">{(searchQ?searched:posts).slice(0,12).map(p=><div key={p.id} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-3 flex gap-3"><img src={p.image||`https://i.pravatar.cc/100?u=${p.userId}`} className="w-12 h-12 rounded-xl object-cover"/><div><p className="text-white text-xs font-bold">{p.userName}</p><p className="text-white/40 text-[11px] truncate w-[200px]">{p.text}</p></div></div>)}</div></div>}

            {/* INBOX FULL */}
            {activeBottom==='Inbox' && <div className="flex-1 flex flex-col pb-24"><div className="flex justify-between items-center"><div><h2 className="text-white font-black text-xl">Inbox</h2><p className="text-white/40 text-[11px]">5 online • Water glass chat</p></div><button className="w-10 h-10 rounded-full bg-white text-black font-black text-lg">+</button></div><div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-full px-4 py-2.5 flex gap-2 mt-4"><span className="text-white/30">⌕</span><input placeholder="Search messages..." className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"/></div><div className="mt-4 space-y-2.5 overflow-y-auto no-scrollbar">{posts.slice(0,10).map((p,i)=><div key={p.id} className="bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[20px] p-3.5 flex gap-3 items-center hover:bg-white/15"><div className="relative"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-12 h-12 rounded-full"/><div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div></div><div className="flex-1"><p className="text-white text-[13px] font-bold">{p.userName}</p><p className="text-white/40 text-[11px] truncate">Water glass msg... 💧</p></div><div className="text-right"><p className="text-white/20 text-[9px]">2m</p>{i<2&&<div className="mt-1 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[9px] font-black">2</div>}</div></div>)}</div></div>}

            {/* PROFILE WITH CLEAR STATS */}
            {activeBottom==='Profile' && <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
              <div className="relative h-32 rounded-[28px] overflow-hidden border border-white/15"><img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div></div>
              <div className="-mt-12 px-2"><div className="bg-white/10 backdrop-blur-[35px] border border-white/20 rounded-[28px] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <img src={`https://i.pravatar.cc/150?u=${currentUser?.uid}`} className="w-24 h-24 rounded-full mx-auto -mt-14 border-[3px] border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)]"/>
                <h3 className="text-white font-black mt-4 text-[16px]">{currentUser?.email?.split('@')[0]} {isAdmin&&<span className="ml-1 text-cyan-300">✔</span>}</h3><p className="text-white/40 text-[11px] mt-1">{currentUser?.email}</p>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-[18px] py-4"><p className="text-white font-black text-[20px]">{myPosts.length}</p><p className="text-white/60 text-[9px] font-black tracking-[2px] mt-1">POSTS</p></div>
                  <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-[18px] py-4"><p className="text-pink-300 font-black text-[20px]">{totalLikes}</p><p className="text-white/60 text-[9px] font-black tracking-[2px] mt-1">LIKES ❤️</p></div>
                  <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-[18px] py-4"><p className="text-cyan-300 font-black text-[20px]">1.2K</p><p className="text-white/60 text-[9px] font-black tracking-[2px] mt-1">FOLLOWERS</p></div>
                </div>
                <div className="flex gap-2.5 mt-6"><button onClick={()=>setActiveBottom('Settings')} className="flex-1 py-3 rounded-full bg-white text-black font-black text-[11px]">EDIT PROFILE</button><button onClick={()=>setActiveBottom('Settings')} className="flex-1 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-[11px]">⚙️ SETTINGS</button></div>
                <button onClick={()=>setActiveBottom('Inbox')} className="w-full mt-3 py-3 rounded-full bg-cyan-400/15 border border-cyan-400/25 text-cyan-200 font-black text-[11px] tracking-widest">💬 MESSAGE</button>
              </div>
              <div className="flex gap-1 mt-4 p-1 rounded-full bg-white/10 border border-white/10"><button className="flex-1 py-2.5 rounded-full bg-white text-black text-[10px] font-black">POSTS</button><button className="flex-1 py-2.5 rounded-full text-white/30 text-[10px] font-black">VIDEOS</button><button className="flex-1 py-2.5 rounded-full text-white/30 text-[10px] font-black">SAVED</button></div>
              <div className="grid grid-cols-3 gap-2 mt-3">{myPosts.map(p=> p.image? <img key={p.id} src={p.image} className="h-28 rounded-xl object-cover border border-white/10"/> : p.videoUrl? <video key={p.id} src={p.videoUrl} className="h-28 rounded-xl object-cover border border-white/10"/> : <div key={p.id} className="h-28 bg-white/10 backdrop-blur rounded-xl border border-white/10 p-2 text-[10px] text-white/40">{p.text.slice(0,40)}</div>)}</div>
              </div>
            </div>}

            {/* SETTINGS FULL */}
            {activeBottom==='Settings' && <div className="flex-1 overflow-y-auto pb-28 no-scrollbar"><div className="flex items-center gap-3 mb-5"><button onClick={()=>setActiveBottom('Profile')} className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center">‹</button><h2 className="text-white font-black text-[18px]">Settings</h2></div>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-[25px] border border-white/15 rounded-[22px] p-4"><p className="text-white/30 text-[9px] tracking-widest mb-3">ACCOUNT • WATER GLASS</p>
                  <div className="space-y-4"><div className="flex justify-between items-center"><div className="flex gap-3 items-center"><div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">👤</div><div><p className="text-white text-xs font-bold">Edit Profile</p><p className="text-white/30 text-[10px]">Name, bio, avatar</p></div></div><span className="text-white/20">›</span></div><div className="flex justify-between items-center"><div className="flex gap-3 items-center"><div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">🔒</div><div><p className="text-white text-xs font-bold">Privacy</p><p className="text-white/30 text-[10px]">Private account, block</p></div></div><span className="text-white/20">›</span></div><div className="flex justify-between items-center"><div className="flex gap-3 items-center"><div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">🔔</div><div><p className="text-white text-xs font-bold">Notifications</p><p className="text-white/30 text-[10px]">Push, email</p></div></div><span className="text-white/20">›</span></div></div>
                </div>
                <div className="bg-white/10 backdrop-blur-[25px] border border-white/15 rounded-[22px] p-4"><p className="text-white/30 text-[9px] tracking-widest mb-3">APP</p><div className="flex gap-3 items-center"><div className="w-9 h-9 rounded-full bg-cyan-400/15 flex items-center justify-center">💧</div><div><p className="text-white text-xs font-bold">Water Glass Theme</p><p className="text-cyan-200/50 text-[10px]">ON • Transparent blur active</p></div><div className="ml-auto w-10 h-6 rounded-full bg-cyan-400 flex items-center justify-end pr-1"><div className="w-4 h-4 rounded-full bg-white"></div></div></div></div>
                <button onClick={onLogout} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-black text-xs tracking-widest">LOGOUT</button>
                <p className="text-center text-white/20 text-[9px] mt-2 tracking-widest">OneFeedBD v3.0 • WATER GLASS ULTIMATE</p>
              </div>
            </div>}

            {/* Bottom Nav Water */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-[40px] border border-white/20 rounded-[32px] flex justify-around items-center py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              {[{k:'Home',i:'⌂'},{k:'Search',i:'⌕'},{k:'Add',i:'+'},{k:'Inbox',i:'✉'},{k:'Profile',i:'◍'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=>setShowCreate(true)} className="w-12 h-12 r
