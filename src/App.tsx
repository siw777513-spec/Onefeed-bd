import {useState,useEffect} from 'react';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import {collection,query,orderBy,onSnapshot,addDoc,serverTimestamp,updateDoc,arrayUnion,arrayRemove,doc,deleteDoc,setDoc,getDoc} from 'firebase/firestore';
import {auth,db} from './firebase';
import AuthPage from './components/Auth';
type Post={id:string;text:string;image:string;videoUrl:string;userName:string;likeCount:number;likes:string[];userId:string;mediaType:string;comments?:any[]};
type Msg={id:string;text:string;from:string;to:string;time:any};
const CLOUD="bvvoprge";
const PRESET="onefeed_preset";
function FeedApp({onLogout}:{onLogout:()=>void}){
 const [posts,setPosts]=useState<Post[]>([]);
 const [tab,setTab]=useState('Feed');
 const [bot,setBot]=useState('Home');
 const [show,setShow]=useState(false);
 const [ct,setCt]=useState<'feed'|'short'|'story'|'watch'>('feed');
 const [txt,setTxt]=useState('');
 const [media,setMedia]=useState('');
 const [up,setUp]=useState(false);
 const [cmt,setCmt]=useState('');
 const [openC,setOpenC]=useState<string|null>(null);
 const [q,setQ]=useState('');
 const [viewId,setViewId]=useState<string|null>(null);
 const [viewName,setViewName]=useState('');
 const [pTab,setPTab]=useState('all');
 const [priv,setPriv]=useState(false);
 const [uMap,setUMap]=useState<Record<string,any>>({});
 const [chatId,setChatId]=useState<string|null>(null);
 const [chatUser,setChatUser]=useState<{id:string,name:string}|null>(null);
 const [msgs,setMsgs]=useState<Msg[]>([]);
 const [msgTxt,setMsgTxt]=useState('');
 const cur=auth.currentUser;
 const my=posts.filter(p=>p.userId===cur?.uid);
 const vPosts=posts.filter(p=>p.userId===viewId);
 useEffect(()=>{
  return onSnapshot(
   query(collection(db,'posts'),orderBy('timestamp','desc')),
   s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post)))
  )
 },[]);
 useEffect(()=>{
  return onSnapshot(collection(db,'users'),s=>{
   const m:any={}; s.docs.forEach(d=>m[d.id]=d.data()); setUMap(m);
  })
 },[]);
 useEffect(()=>{
  (async()=>{
   if(!cur) return;
   const d=await getDoc(doc(db,'users',cur.uid));
   if(d.exists()) setPriv(d.data().isPrivate||false);
  })();
 },[cur]);
 useEffect(()=>{
  if(!chatId) return;
  return onSnapshot(
   query(collection(db,'chats',chatId,'messages'),orderBy('time','asc')),
   s=>setMsgs(s.docs.map(d=>({id:d.id,...d.data()} as Msg)))
  );
 },[chatId]);
 const togglePriv=async()=>{
  const v=!priv; setPriv(v);
  if(cur) await setDoc(doc(db,'users',cur.uid),
   {isPrivate:v,userName:cur?.email?.split('@')[0],userId:cur.uid},{merge:true});
 };
 const like=async(p:Post)=>{
  const l=p.likes?.includes(cur!.uid);
  await updateDoc(doc(db,'posts',p.id),{
   likes:l?arrayRemove(cur!.uid):arrayUnion(cur!.uid),
   likeCount:l?(p.likeCount||0)-1:(p.likeCount||0)+1
  });
 };
 const comment=async(p:Post)=>{
  if(!cmt.trim()) return;
  await updateDoc(doc(db,'posts',p.id),{
   comments:arrayUnion({id:Date.now().toString(),user:cur?.email?.split('@')[0],text:cmt})
  });
  setCmt('');
 };
 const del=async(p:Post)=>{
  if(confirm('Delete?')) await deleteDoc(doc(db,'posts',p.id));
 };
 const upload=async(e:any)=>{
  const f=e.target.files[0]; if(!f) return; setUp(true);
  const fd=new FormData(); fd.append('file',f); fd.append('upload_preset',PRESET);
  const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`,{method:'POST',body:fd});
  const d=await r.json(); setMedia(d.secure_url); setUp(false);
 };
 const create=async()=>{
  if(!txt && !media) return;
  await addDoc(collection(db,'posts'),{
   text:txt,
   image:ct==='feed'||ct==='story'?media:'',
   videoUrl:ct==='short'||ct==='watch'?media:'',
   userName:cur?.email?.split('@')[0],
   userId:cur?.uid,
   likeCount:0,likes:[],comments:[],mediaType:ct,
   timestamp:serverTimestamp()
  });
  setTxt(''); setMedia(''); setShow(false);
 };
 const filt=posts.filter(p=>{
  if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType;
  if(tab==='Short') return p.mediaType==='short';
  if(tab==='Watch') return p.mediaType==='watch'||(p.videoUrl&&p.mediaType!=='short'&&p.mediaType!=='story');
  if(tab==='Story') return p.mediaType==='story';
  return true;
 });
 const search=posts.filter(p=>p.userName.toLowerCase().includes(q.toLowerCase()));
 const openProfile=(id:string,name:string)=>{
  setViewId(id); setViewName(name); setBot('UserProfile'); setPTab('all');
 };
 const filterProfile=(list:Post[])=>{
  if(pTab==='all') return list;
  if(pTab==='photo') return list.filter(p=>p.image);
  if(pTab==='short') return list.filter(p=>p.mediaType==='short');
  if(pTab==='watch') return list.filter(p=>p.mediaType==='watch');
  if(pTab==='story') return list.filter(p=>p.mediaType==='story');
  if(pTab==='video') return list.filter(p=>p.videoUrl);
  return list;
 };
 const openChat=(uid:string,name:string)=>{
  if(!cur) return;
  const id=[cur.uid,uid].sort().join('_');
  setChatId(id); setChatUser({id:uid,name}); setBot('Chat');
  setDoc(doc(db,'chats',id),{users:[cur.uid,uid],names:[cur.email?.split('@')[0],name]},{merge:true});
 };
 const sendMsg=async()=>{
  if(!msgTxt.trim()||!chatId||!cur||!chatUser) return;
  await addDoc(collection(db,'chats',chatId,'messages'),{
   text:msgTxt,from:cur.uid,to:chatUser.id,time:serverTimestamp()
  });
  setMsgTxt('');
 };
 return (
 <div className="min-h-screen flex justify-center bg-black">
 <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900"/>
  <div className="relative z-10 h-full flex flex-col p-3">
   <div className="bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[22px] px-4 py-3 flex justify-between items-center">
    <div className="flex gap-2 items-center">
     <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center"></div>
     <p className="text-white font-black text-[12px]">OneFeedBD {priv?'🔒':'🌍'}</p>
    </div>
    <div className="flex gap-2">
     <button onClick={()=>setBot('Inbox')} className="w-8 h-8 rounded-full bg-white/10 text-white">M</button>
     <button onClick={()=>setBot('Settings')} className="w-8 h-8 rounded-full bg-white/10 text-white">⚙</button>
    </div>
   </div>
   <div className="flex-1 mt-3 overflow-hidden flex flex-col">
    {bot==='Home'&&<>
     <div className="flex gap-1 p-1 rounded-full bg-white/10 border border-white/10">
      {['Feed','Short','Watch','Story'].map(k=>
       <button key={k} onClick={()=>setTab(k)}
        className={`flex-1 py-2 rounded-full text-[10px] font-black ${tab===k?'bg-white text-black':'text-white/40'}`}>{k}</button>
      )}
     </div>
     <div className="flex-1 overflow-y-auto pb-28 mt-3 space-y-3">
      {filt.map(p=>{
       const liked=p.likes?.includes(cur?.uid||'');
       return (
       <div key={p.id} className="rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
        <div className="flex justify-between p-3">
         <div onClick={()=>openProfile(p.userId,p.userName)} className="flex gap-2 items-center cursor-pointer">
          <img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-7 h-7 rounded-full"/>
          <p className="text-white text-xs font-bold">{p.userName}</p>
         </div>
         <button onClick={()=>openChat(p.userId,p.userName)} className="w-7 h-7 rounded-full bg-white/10 text-white text-[10px]">M</button>
        </div>
        {p.image&&<img src={p.image} className="w-full"/>}
        {p.videoUrl&&<video src={p.videoUrl} controls className="w-full"/>}
        <div className="p-3">
         <p className="text-white/80 text-[13px]">{p.text}</p>
         <div className="flex gap-2 mt-3">
          <button onClick={()=>like(p)} className={`px-3 py-1.5 rounded-full text-[11px] ${liked?'bg-pink-500/20 text-pink-200':'bg-white/10 text-white/50'}`}>
           {liked?'❤️':'🤍'} {(p.likeCount||0)}
          </button>
          <button onClick={()=>{setOpenC(openC===p.id?null:p.id)}} className="px-3 py-1.5 rounded-full bg-white/10 text-white/50 text-[11px]"></button>
          {cur?.uid===p.userId&&<button onClick={()=>del(p)} className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-300 text-[11px]">🗑️</button>}
         </div>
         {openC===p.id&&<div className="mt-3">
          <div className="flex gap-2">
           <input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Comment..." className="flex-1 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white outline-none"/>
           <button onClick={()=>comment(p)} className="px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-black">Send</button>
          </div>
          <div className="mt-2 space-y-1">
           {p.comments?.map((c:any)=><p key={c.id} className="text-[11px] text-white/50"><b className="text-white/80">{c.user}:</b> {c.text}</p>)}
          </div>
         </div>}
        </div>
       </div>
      )})}
     </div>
    </>}
    {bot==='Search'&&<div className="flex-1 pb-24">
     <div className="bg-white/10 border border-white/15 rounded-full px-4 py-2.5 flex gap-2">
      <span className="text-white/30">⌕</span>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search user..." className="flex-1 bg-transparent text-sm text-white outline-none"/>
     </div>
     <div className="mt-4 space-y-2">
      {(q?search:posts).slice(0,12).map(p=>
       <div key={p.id} onClick={()=>openProfile(p.userId,p.userName)} className="bg-white/10 border border-white/15 rounded-2xl p-3 flex gap-3 items-center cursor-pointer">
        <img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-10 h-10 rounded-full"/>
        <div><p className="text-white text-xs font-bold">{p.userName}</p><p className="text-white/30 text-[11px]">Tap to message</p></div>
        <button onClick={(e)=>{e.stopPropagation(); openChat(p.userId,p.userName)}} className="ml-auto w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-200">M</button>
       </div>
      )}
     </div>
    </div>}
    {bot==='UserProfile'&&<div className="flex-1 overflow-y-auto pb-24">
     <button onClick={()=>setBot('Search')} className="mb-3 w-8 h-8 rounded-full bg-white/10 text-white">‹</button>
     <div className="bg-white/10 border border-white/20 rounded-[24px] p-5 text-center">
      <img src={`https://i.pravatar.cc/150?u=${viewId}`} className="w-20 h-20 rounded-full mx-auto"/>
      <h3 className="text-white font-black mt-2">{viewName}</h3>
      <button onClick={()=>viewId&&openChat(viewId,viewName)} className="w-full mt-4 py-2.5 rounded-full bg-white text-black text-xs font-black"> MESSAGE</button>
     </div>
     <div className="mt-4 bg-white/10 border border-white/10 rounded-full p-1 flex gap-1">
      {[{id:'all',l:'All'},{id:'photo',l:'Photos'},{id:'short',l:'Shorts'},{id:'watch',l:'Watch'},{id:'story',l:'Story'}].map(t=>
       <button key={t.id} onClick={()=>setPTab(t.id)} className={`px-3 py-2 rounded-full text-[9px] font-black ${pTab===t.id?'bg-white text-black':'text-white/40'}`}>{t.l}</button>
      )}
     </div>
     <div className="grid grid-cols-3 gap-2 mt-3">
      {filterProfile(vPosts).map(p=>p.image?<img key={p.id} src={p.image} className="h-24 w-full object-cover rounded-xl"/>:p.videoUrl?<video key={p.id} src={p.videoUrl} className="h-24 w-full object-cover rounded-xl"/>:<div key={p.id} className="h-24 bg-white/10 rounded-xl p-2 text-[10px] text-white/30">{p.text.slice(0,20)}</div>)}
     </div>
    </div>}
    {bot==='Inbox'&&<div className="flex-1 pb-24 flex flex-col">
     <h2 className="text-white font-black text-lg">Messages</h2>
     <p className="text-white/30 text-[10px] mb-3">All users</p>
     <div className="space-y-2 overflow-y-auto">
      {Object.entries(uMap).filter(([uid])=>uid!==cur?.uid).map(([uid,ud]:any)=>
       <div key={uid} className="bg-white/10 border border-white/15 rounded-2xl p-3 flex gap-3 items-center">
        <img src={`https://i.pravatar.cc/100?u=${uid}`} className="w-10 h-10 rounded-full"/>
        <div className="flex-1 cursor-pointer" onClick={()=>openChat(uid,ud.userName||uid.slice(0,6))}>
         <p className="text-white text-xs font-bold">{ud.userName||'User'}</p>
         <p className="text-white/30 text-[10px]">Tap to chat</p>
        </div>
        <button onClick={()=>openChat(uid,ud.userName||uid.slice(0,6))} className="w-8 h-8 rounded-full bg-white text-black font-bold">M</button>
       </div>
      )}
     </div>
    </div>}
    {bot==='Chat'&&chatUser&&<div className="flex-1 flex flex-col pb-3">
     <div className="flex items-center gap-3 mb-3">
      <button onClick={()=>setBot('Inbox')} className="w-8 h-8 rounded-full bg-white/10 text-white">‹</button>
      <img src={`https://i.pravatar.cc/100?u=${chatUser.id}`} className="w-8 h-8 rounded-full"/>
      <p className="text-white font-bold text-sm flex-1">{chatUser.name}</p>
     </div>
     <div className="flex-1 overflow-y-auto space-y-2 bg-black/20 rounded-2xl p-3 border border-white/10">
      {msgs.map(m=><div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${m.from===cur?.uid?'ml-auto bg-white text-black':'bg-white/10 text-white'}`}>{m.text}</div>)}
      {msgs.length===0&&<p className="text-white/20 text-xs text-center mt-10">No messages yet<br/>Start chatting </p>}
     </div>
     <div className="mt-3 flex gap-2">
      <input value={msgTxt} onChange={e=>setMsgTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Message..." className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-sm text-white outline-none"/>
      <button onClick={sendMsg} className="w-10 h-10 rounded-full bg-white text-black font-black">➤</button>
     </div>
    </div>}
    {bot==='Profile'&&<div className="flex-1 overflow-y-auto pb-24">
     <div className="bg-white/10 border border-white/20 rounded-[24px] p-5 text-center">
      <img src={`https://i.pravatar.cc/150?u=${cur?.uid}`} className="w-20 h-20 rounded-full mx-auto"/>
      <h3 className="text-white font-black mt-2">{cur?.email?.split('@')[0]}</h3>
      <div className="grid grid-cols-3 gap-2 mt-4">
       <div className="bg-black/20 rounded-xl py-2"><p className="text-white font-bold">{my.length}</p><p className="text-white/40 text-[8px]">POSTS</p></div>
       <div className="bg-black/20 rounded-xl py-2"><p className="text-pink-300 font-bold">{my.reduce((a,b)=>a+(b.likeCount||0),0)}</p><p className="text-white/40 text-[8px]">LIKES</p></div>
       <div className="bg-black/20 rounded-xl py-2"><p className="text-cyan-300 font-bold">1.2K</p><p className="text-white/40 text-[8px]">FOLLOWERS</p></div>
      </div>
     </div>
     <div className="grid grid-cols-3 gap-2 mt-3">
      {my.map(p=>p.image?<img key={p.id} src={p.image} className="h-24 w-full object-cover rounded-xl"/>:p.videoUrl?<video key={p.id} src={p.videoUrl} className="h-24 w-full object-cover rounded-xl"/>:<div key={p.id} className="h-24 bg-white/10 rounded-xl p-2 text-[10px] text-white/30">{p.text.slice(0,20)}</div>)}
     </div>
    </div>}
    {bot==='Settings'&&<div className="flex-1 overflow-y-auto pb-28">
     <div className="flex gap-3 items-center mb-5">
      <button onClick={()=>setBot('Profile')} className="w-8 h-8 rounded-full bg-white/10 text-white">‹</button>
      <h2 className="text-white font-black">Settings</h2>
     </div>
     <div className="space-y-3">
      <div className="bg-white/10 border border-white/15 rounded-[20px] p-4">
       <div className="flex justify-between items-center">
        <p className="text-white text-xs font-bold">{priv?'🔒 Private':'🌍 Public'}</p>
        <button onClick={togglePriv} className={`w-12 h-6 rounded-full flex items-center p-1 ${priv?'bg-cyan-400 justify-end':'bg-white/20 justify-start'}`}><div className="w-4 h-4 rounded-full bg-white"/></button>
       </div>
      </div>
      <button onClick={onLogout} className="w-full py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black">LOGOUT</button>
     </div>
    </div>}
    <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-[30px] border border-white/20 rounded-[28px] flex justify-around items-center py-2">
     {[{k:'Home',i:'⌂'},{k:'Search',i:'⌕'},{k:'Add',i:'+'},{k:'Inbox',i:'M'},{k:'Profile',i:'◍'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=>setShow(true)} className="w-10 h-10 rounded-full bg-white text-black font-black">+</button>:<button key={b.k} onClick={()=>setBot(b.k)} className={`w-8 h-8 rounded-full ${bot===b.k?'bg-white/15 text-white':'text-white/30'}`}>{b.i}</button>)}
    </div>
   </div>
   {show&&<div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xl flex items-center justify-center p-4">
    <div className="w-full bg-white/15 border border-white/20 rounded-[20px] p-4">
     <div className="flex justify-between mb-3"><h3 className="text-white font-bold">Create</h3><button onClick={()=>setShow(false)} className="w-7 h-7 rounded-full bg-white/10 text-white/50">✕</button></div>
     <div className="flex gap-1 mb-3 bg-black/20 p-1 rounded-full">
      {(['feed','short','story','watch'] as const).map(t=><button key={t} onClick={()=>setCt(t)} className={`flex-1 py-1.5 rounded-full text-[8px] font-black ${ct===t?'bg-white text-black':'text-white/40'}`}>{t.toUpperCase()}</button>)}
     </div>
     <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="What's up?" className="w-full h-16 bg-white/10 border border-white/10 rounded-xl p-2 text-xs text-white outline-none"/>
     <label className="block mt-2 py-2 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40 cursor-pointer">{up?'Uploading...':media?'✅ Done':'📎 Media'}<input type="file" accept="video/*,image/*" onChange={upload} className="hidden"/></label>
     <button onClick={create} className="w-full mt-3 py-2.5 rounded-full bg-white text-black font-black text-xs">PUBLISH</button>
    </div>
   </div>}
  </div>
 </div>
 </div>
 );
}
export default function App(){
 const [mode,setMode]=useState<'none'|'guest'|'auth'>('none');
 const [chk,setChk]=useState(true);
 useEffect(()=>{
  return onAuthStateChanged(auth,u=>{
   if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChk(false);
  });
 },[]);
 if(chk) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">Loading...</div>;
 if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
 return <FeedApp onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
}
 
