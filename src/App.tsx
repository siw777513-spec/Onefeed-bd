
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
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
  const [viewUserId, setViewUserId] = useState<string|null>(null);
  const [viewUserName, setViewUserName] = useState('');
  const [profileTab, setProfileTab] = useState('feed');
  const [isPrivate, setIsPrivate] = useState(false);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const myPosts = posts.filter(p=>p.userId===currentUser?.uid);
  const totalLikes = myPosts.reduce((a,b)=>a+(b.likeCount||0),0);
  const viewUserPosts = posts.filter(p=>p.userId===viewUserId);

  useEffect(()=>{
    const q=query(collection(db,'posts'),orderBy('timestamp','desc'));
    const unsub = onSnapshot(q,s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post))));
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'users'), snap=>{
      const map: any = {};
      snap.docs.forEach(d=>{ map[d.id] = d.data(); });
      setUsersMap(map);
    });
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    const loadPrivacy = async ()=>{
      if(!currentUser) return;
      const ref = doc(db,'users',currentUser.uid);
      const snap = await getDoc(ref);
      if(snap.exists()) setIsPrivate(snap.data().isPrivate||false);
    };
    loadPrivacy();
  },[currentUser]);

  const togglePrivacy = async ()=>{
    const newVal = !isPrivate;
    setIsPrivate(newVal);
    if(!currentUser) return;
    await setDoc(doc(db,'users',currentUser.uid), { isPrivate: newVal, userName: currentUser.email?.split('@')[0], userId: currentUser.uid }, { merge: true });
  };

  const handleLike = async (p:Post)=>{ const liked=p.likes?.includes(currentUser!.uid); await updateDoc(doc(db,'posts',p.id),{likes: liked? arrayRemove(currentUser!.uid):arrayUnion(currentUser!.uid), likeCount: liked? p.likeCount-1:p.likeCount+1}); };
  const handleComment = async (p:Post)=>{ if(!commentText.trim()) return; await updateDoc(doc(db,'posts',p.id),{comments: arrayUnion({ id:Date.now().toString(), user:currentUser?.email?.split('@')[0], text:commentText })}); setCommentText(''); };
  const handleDelete = async (p:Post)=>{ if(!confirm('Delete?')) return; await deleteDoc(doc(db,'posts',p.id)); };
  const handleFile = async (e:any)=>{ const file=e.target.files[0]; if(!file) return; setUploading(true); const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',UPLOAD_PRESET); const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{method:'POST',body:fd}); const d=await res.json(); setMediaUrl(d.secure_url); setUploading(false); };
  const handleCreate = async ()=>{ if(!newText && !mediaUrl) return; await addDoc(collection(db,'posts'),{text:newText, image:createType!=='short'?mediaUrl:'', videoUrl:createType==='short'?mediaUrl:'', userName:currentUser?.email?.split('@')[0]||'User', userId:currentUser?.uid, likeCount:0, likes:[], comments:[], mediaType:createType, timestamp:serverTimestamp()}); setNewText(''); setMediaUrl(''); setShowCreate(false); };
  const filtered = posts.filter(p=>{ if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType; if(tab==='Short') return p.mediaType==='short'; if(tab==='Watch') return p.videoUrl; return p.mediaType==='story'; });
  const searched = posts.filter(p=>p.text.toLowerCase().includes(searchQ.toLowerCase())||p.userName.toLowerCase().includes(searchQ.toLowerCase()));
  const openPublicProfile = (userId:string, userName:string)=>{ setViewUserId(userId); setViewUserName(userName); setActiveBottom('UserProfile'); setProfileTab('feed'); };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden">
        <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-black/60 to-purple-900/30 backdrop-blur-[2px]"></div></div>
        <div className="relative z-10 h-full flex flex-col p-3">
          <div className="bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[22px] px-4 py-3 flex justify-between items-center">
            <div className="flex gap-2.5 items-center"><div className="w-9 h-9 rounded-full bg-white text-black font-black flex items-center justify-center">⚡</div><div><p className="text-white font-black text-[13px]">OneFeedBD {isAdmin&&<span className="ml-1 text-[8px] bg-cyan-400 text-black px-1.5 py-0.5 rounded-full">ADMIN</span>}</p><p className="text-white/50 text-[8px] tracking-[2px]">{isPrivate?'🔒 PRIVATE':'🌍 PUBLIC'} • WATER</p></div></div>
            <div className="flex gap-2"><button onClick={()=>setActiveBottom('Inbox')} className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white">✉</button><button onClick={()=>setActiveBottom('Settings')} className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white">⚙️</button></div>
          </div>
          <div className="flex-1 mt-3 overflow-hidden flex flex-col">
            {activeBottom==='Home' && (<><div className="flex gap-1 p-1 rounded-full bg-white/10 border border-white/10">{['Feed','Short','Watch','Story'].map(k=><button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2.5 rounded-full text-[10px] font-black ${tab===k?'bg-white text-black':'text-white/40'}`}>{k}</button>)}</div>
              <div className="flex-1 overflow-y-auto pb-28 mt-3 space-y-3">
                {filtered.map(p=>{ const liked=p.likes?.includes(currentUser!.uid||''); const canDelete=p.userId===currentUser?.uid||isAdmin; return (<div key={p.id} className="rounded-[24px] bg-white/10 backdrop-blur-[25px] border border-white/20 overflow-hidden"><div className="flex justify-between p-3"><div className="flex gap-2.5 items-center cursor-pointer" onClick={()=>openPublicProfile(p.userId,p.userName)}><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-8 h-8 rounded-full"/><div><p className="text-white text-xs font-bold hover:underline">{p.userName} {usersMap[p.userId]?.isPrivate&&<span className="ml-1">🔒</span>}</p><p className="text-white/40 text-[9px]">{p.mediaType}</p></div></div><button onClick={()=>setOpenMenuId(openMenuId===p.id?null:p.id)} className="w-8 h-8 rounded-full bg-white/10 text-white/40">⋯</button></div>{p.image&&<img src={p.image} className="w-full"/>}{p.videoUrl&&<video src={p.videoUrl} controls className="w-full"/>}<div className="p-3"><p className="text-white/90 text-[13px]">{p.text}</p><div className="flex gap-2 mt-3 pt-3 border-t border-white/10"><button onClick={()=>handleLike(p)} className={`px-4 py-2 rounded-full border text-[11px] font-bold ${liked?'bg-pink-500/20 border-pink-300/30 text-pink-200':'bg-white/10 border-white/10 text-white/50'}`}>{liked?'❤️':'🤍'} {p.likeCount}</button><button onClick={()=>setOpenCommentId(openCommentId===p.id?null:p.id)} className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/50 text-[11px] font-bold">💬 {p.comments?.length||0}</button></div>{canDelete&&openMenuId===p.id&&<button onClick={()=>handleDelete(p)} className="mt-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">🗑️ Delete</button>}{openCommentId===p.id&&<div className="mt-3 bg-black/30 border border-white/10 rounded-xl p-3"><div className="space-y-1 mb-2 max-h-24 overflow-y-auto">{p.comments?.map((c:any)=><p key={c.id} className="text-[11px] text-white/60"><span className="text-cyan-200 font-bold">{c.user}: </span>{c.text}</p>)}</div><div className="flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Comment..." className="flex-1 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white outline-none"/><button onClick={()=>handleComment(p)} className="px-3 rounded-full bg-white text-black text-xs font-bold">Send</button></div></div>}</div></div>);})}</div></>)}

            {activeBottom==='Search' && <div className="flex-1 flex flex-col pb-24"><div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-full px-5 py-3 flex gap-2"><span className="text-white/30">⌕</span><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search name like Facebook..." className="flex-1 bg-transparent text-sm text-white outline-none"/></div><div className="mt-4 space-y-2 overflow-y-auto"><p className="text-white/30 text-[10px] tracking-widest mb-2">{searchQ?`RESULTS FOR "${searchQ}"`:'ALL USERS'}</p>{(searchQ?searched:posts).slice(0,15).map(p=><div key={p.id} onClick={()=>openPublicProfile(p.userId,p.userName)} className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-3 flex gap-3 items-center cursor-pointer hover:bg-white/15"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-12 h-12 rounded-full"/><div className="flex-1"><p className="text-white text-xs font-bold">{p.userName} {usersMap[p.userId]?.isPrivate&&'🔒'} {p.userId===currentUser?.uid&&<span className="text-[8px] bg-white text-black px-1 rounded-full">YOU</span>}</p><p className="text-white/40 text-[11px] truncate w-[200px]">{p.text.slice(0,30)}</p></div><span className="text-white/20 text-xs">›</span></div>)}</div></div>}

            {activeBottom==='UserProfile' && <div className="flex-1 overflow-y-auto pb-28"><div className="flex items-center gap-3 mb-4"><button onClick={()=>setActiveBottom('Search')} className="w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white">‹</button><h2 className="text-white font-black">{viewUserName} {usersMap[viewUserId||'']?.isPrivate&&'🔒'}</h2></div>
            {usersMap[viewUserId||'']?.isPrivate && viewUserId!==currentUser?.uid ? <div className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-[28px] p-10 text-center"><p className="text-5xl">🔒</p><p className="text-white font-black mt-4">This Account is Private</p><p className="text-white/40 text-xs mt-2">Follow to see their posts, shorts, watch, story</p><button className="mt-6 px-8 py-3 rounded-full bg-white text-black font-black text-xs">+ FOLLOW</button></div> : <><div className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-[28px] p-6 text-center"><img src={`https://i.pravatar.cc/150?u=${viewUserId}`} className="w-24 h-24 rounded-full mx-auto border-2 border-white/20"/><h3 className="text-white font-black mt-3">{viewUserName}</h3><p className="text-white/30 text-[11px]">{usersMap[viewUserId||'']?.isPrivate?'🔒 Private':'🌍 Public'} Profile</p><div className="grid grid-cols-3 gap-3 mt-5"><div className="bg-black/20 border border-white/10 rounded-2xl py-3"><p className="text-white font-black text-[18px]">{viewUserPosts.length}</p><p className="text-white/50 text-[8px]">POSTS</p></div><div className="bg-black/20 border border-white/10 rounded-2xl py-3"><p className="text-pink-300 font-black text-[18px]">{viewUserPosts.reduce((a,b)=>a+(b.likeCount||0),0)}</p><p className="text-white/50 text-[8px]">LIKES</p></div><div className="bg-black/20 border border-white/10 rounded-2xl py-3"><p className="text-cyan-300 font-black text-[18px]">1.2K</p><p className="text-white/50 text-[8px]">FOLLOWERS</p></div></div></div><div className="flex gap-1 mt-4 p-1 rounded-full bg-white/10 border border-white/10">{['feed','short','watch','story'].map(k=><button key={k} onClick={()=>setProfileTab(k)} className={`flex-1 py-2 rounded-full text-[9px] font-black ${profileTab===k?'bg-white text-black':'text-white/40'}`}>{k.toUpperCase()}</button>)}</div><div className="grid grid-cols-3 gap-2 mt-3">{viewUserPosts.filter(p=>{ if(profileTab==='feed') return p.mediaType==='feed'||!p.mediaType; return p.mediaType===profileTab; }).map(p=> p.image? <img key={p.id} src={p.image} className="h-28 rounded-xl object-cover border border-white/10"/> : p.videoUrl? <video key={p.id} src={p.videoUrl} className="h-28 rounded-xl object-cover border border-white/10"/> : <div key={p.id} className="h-28 bg-white/10 rounded-xl p-2 text-[10px] text-white/30">{p.text.slice(0,30)}</div>)}</div></>}
            </div>}

            {activeBottom==='Inbox' && <div className="flex-1 pb-24"><h2 className="text-white font-black text-xl">Inbox 💧</h2><div className="mt-4 space-y-2">{posts.slice(0,8).map((p)=><div key={p.id} onClick={()=>openPublicProfile(p.userId,p.userName)} className="bg-white/10 border border-white/15 rounded-[18px] p-3.5 flex gap-3 items-center cursor-pointer"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-11 h-11 rounded-full"/><div><p className="text-white text-[13px] font-bold">{p.userName} {usersMap[p.userId]?.isPrivate&&'🔒'}</p><p className="text-white/40 text-[11px]">Tap to view profile</p></div></div>)}</div></div>}

            {activeBottom==='Profile' && <div className="flex-1 overflow-y-auto pb-28"><div className="bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-[28px] p-6 text-center"><img src={`https://i.pravatar.cc/150?u=${currentUser?.uid}`} className="w-24 h-24 rounded-full mx-auto border-2 border-white/20"/><h3 className="text-white font-black mt-3">{currentUser?.email?.split('@')[0]}</h3><p className="text-white/40 text-[11px]">{isPrivate?'🔒 Private - Only you':'🌍 Public - Anyone can see'}</p><div className="grid grid-cols-3 gap-3 mt-5"><div className="bg-black/20 border border-white/10 rounded-2xl py-4"><p className="text-white font-black text-[20px]">{myPosts.length}</p><p className="text-white/60 text-[9px]">POSTS</p></div><div className="bg-black/20 border border-white/10 rounded-2xl py-4"><p className="text-pink-300 font-black text-[20px]">{totalLikes}</p><p className="text-white/60 text-[9px]">LIKES</p></div><div className="bg-black/20 border border-white/10 rounded-2xl py-4"><p className="text-cyan-300 font-black text-[20px]">1.2K</p><p className="text-white/60 text-[9px]">FOLLOWERS</p></div></div></div><div className="flex gap-1 mt-4 p-1 rounded-full bg-white/10 border border-white/10">{['feed','short','watch','story'].map(k=><button key={k} onClick={()=>setProfileTab(k)} className={`flex-1 py-2 rounded-full text-[9px] font-black ${profileTab===k?'bg-white text-black':'text-white/40'}`}>{k.toUpperCase()}</button>)}</div><div className="grid grid-cols-3 gap-2 mt-3">{myPosts.filter(p=>{ if(profileTab==='feed') return p.mediaType==='feed'||!p.mediaType; return p.mediaType===profileTab; }).map(p=> p.image? <img key={p.id} src={p.image} className="h-28 rounded-xl object-cover border border-white/10"/> : p.videoUrl? <video key={p.id} src={p.videoUrl} className="h-28 rounded-xl object-cover border border-white/10"/> : <div key={p.id} className="h-28 bg-white/10 rounded-xl p-2 text-[10px] text-white/30">{p.text.slice(0,30)}</div>)}</div></div>}

            {activeBottom==='Settings' && <div className="flex-1 pb-28 overflow-y-auto"><div className="flex items-center gap-3 mb-5"><button onClick={()=>setActiveBottom('Profile')} className="w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white">‹</button><h2 className="text-white font-black text-lg">Settings</h2></div><div className="space-y-3"><div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-[20px] p-4"><p className="text-white/30 text-[9px] tracking-widest mb-4">PRIVACY CONTROL</p><div className="flex justify-between items-center"><div className="flex gap-3 items-center"><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">{isPrivate?'🔒':'🌍'}</div><div><p className="text-white text-xs font-bold">{isPrivate?'Private Account':'Public Account'}</p><p className="text-white/40 text-[10px]">{isPrivate?'Only followers can see':'Anyone can search & see'}</p></div></div><button onClick={togglePrivacy} className={`w-14 h-8 rounded-full p-1 flex items-center transition-all ${isPrivate?'bg-cyan-400 justify-end':'bg-white/20 justify-start'}`}><div className="w-6 h-6 rounded-full bg-white shadow"></div></button></div><div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/10"><p className="text-[11px] text-white/60">{isPrivate?'🔒 ON: Search করলে তোমার Profile Private দেখাবে, Post দেখতে পারবে না।':'🌍 OFF: সবাই তোমার Profile Search করে দেখতে পারবে Facebook এর মতো।'}</p></div></div><div className="bg-white/10 border border-white/15 rounded-2xl p-4"><p className="text-white/30 text-[9px] mb-3">ACCOUNT</p><div className="space-y-3 text-xs text-white/70"><p>👤 Edit Profile</p><p>🔔 Notifications</p><p>💧 Water Glass Theme ON</p></div></div><button onClick={onLogout} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-black text-xs">LOGOUT</button><p className="text-center text-white/20 text-[9px] mt-3">OneFeedBD v4.0 • PRIVATE/PUBLIC TOGGLE</p></div></div>}

            <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-[35px] border border-white/20 rounded-[30px] flex justify-around items-center py-2.5">
              {[{k:'Home',i:'⌂'},{k:'Search',i:'⌕'},{k:'Add',i:'+'},{k:'Inbox',i:'✉'},{k:'Profile',i:'◍'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=>setShowCreate(true)} className="w-12 h-12 rounded-full bg-white text-black font-black text-xl">+</button>:<button key={b.k} onClick={()=>setActiveBottom(b.k)} className={`w-10 h-10 rounded-full flex items-center justify-center ${activeBottom===b.k?'bg-white/15 text-white':'text-white/30'}`}>{b.i}</button>)}
            </div>
          </div>
          {showCreate && <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xl flex items-center justify-center p-4"><div className="w-full bg-white/15 backdrop-blur-[35px] border border-white/20 rounded-[24px] p-5"><div className="flex justify-between mb-3"><h3 className="text-white font-black">Create 💧</h3><button onClick={()=>setShowCreate(false)} className="w-8 h-8 rounded-full bg-white/10 text-white/50">✕</button></div><div className="flex gap-1 mb-3 bg-black/20 p-1 rounded-full">{(['feed','short','story'] as const).map(t=><button key={t} onClick={()=>setCreateType(t)} className={`flex-1 py-2 rounded-full text-[10px] font-black ${createType===t?'bg-white text-black':'text-white/40'}`}>{t}</button>)}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's up? 💧" className="w-full h-20 bg-white/10 border border-white/15 rounded-xl p-3 text-xs text-white outline-none"/><label className="block mt-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/15 text-center text-xs text-white/40 cursor-pointer">{uploading?'Uploading...':mediaUrl?'✅ Done':'📎 Media'}
