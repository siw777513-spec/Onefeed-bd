import {useState,useEffect} from 'react';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import {collection,query,orderBy,onSnapshot,addDoc,
serverTimestamp,updateDoc,arrayUnion,arrayRemove,doc,
deleteDoc,setDoc,getDoc} from 'firebase/firestore';
import {auth,db} from './firebase';
import AuthPage from './components/Auth';
type Post={id:string;text:string;image:string;videoUrl:string;
userName:string;likeCount:number;likes:string[];userId:string;
mediaType:string;comments?:any[]};
type Msg={id:string;text:string;from:string;to:string;time:any};
const CLOUD="bvvoprge";const PRESET="onefeed_preset";
function FeedApp({onLogout}:{onLogout:()=>void}){
const [posts,setPosts]=useState<Post[]>([]);
const [tab,setTab]=useState('Feed');
const [bot,setBot]=useState('Home');
const [show,setShow]=useState(false);
const [ct,setCt]=useState('feed');
const [txt,setTxt]=useState('');
const [media,setMedia]=useState('');
const [cmt,setCmt]=useState('');
const [openC,setOpenC]=useState<string|null>(null);
const [q,setQ]=useState('');
const [viewId,setViewId]=useState<string|null>(null);
const [viewName,setViewName]=useState('');
const [priv,setPriv]=useState(false);
const [uMap,setUMap]=useState<Record<string,any>>({});
const [chatId,setChatId]=useState<string|null>(null);
const [chatUser,setChatUser]=useState<any>(null);
const [msgs,setMsgs]=useState<Msg[]>([]);
const [msgTxt,setMsgTxt]=useState('');
const [editName,setEditName]=useState('');
const [profileTab,setProfileTab]=useState('All');
const cur=auth.currentUser;
const my=posts.filter(p=>p.userId===cur?.uid);
useEffect(()=>onSnapshot(query(collection(db,'posts'),
orderBy('timestamp','desc')),s=>setPosts(s.docs.map(d=>({id:d.id,
...d.data()} as Post)))),[]);
useEffect(()=>onSnapshot(collection(db,'users'),s=>{
const m:any={};s.docs.forEach(d=>m[d.id]=d.data());setUMap(m);}),[]);
useEffect(()=>{if(!chatId) return;
return onSnapshot(query(collection(db,'chats',chatId,'messages'),
orderBy('time','asc')),s=>setMsgs(s.docs.map(d=>({id:d.id,
...d.data()} as Msg))));},[chatId]);
const togglePriv=async()=>{
const v=!priv;setPriv(v);
if(cur) await setDoc(doc(db,'users',cur.uid),
{isPrivate:v,userName:cur?.email?.split('@')[0],userId:cur.uid},{merge:true});};
const like=async(p:Post)=>{
const l=p.likes?.includes(cur!.uid);
await updateDoc(doc(db,'posts',p.id),
{likes:l?arrayRemove(cur!.uid):arrayUnion(cur!.uid),
likeCount:l?(p.likeCount||0)-1:(p.likeCount||0)+1});};
const comment=async(p:Post)=>{
if(!cmt.trim()) return;
await updateDoc(doc(db,'posts',p.id),{comments:arrayUnion(
{id:Date.now().toString(),user:cur?.email?.split('@')[0],text:cmt})});
setCmt('');};
const del=async(p:Post)=>{
if(confirm('Delete?')) await deleteDoc(doc(db,'posts',p.id));};
const upload=async(e:any)=>{
const f=e.target.files[0];if(!f) return;
const fd=new FormData();fd.append('file',f);
fd.append('upload_preset',PRESET);
const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`,
{method:'POST',body:fd});const d=await r.json();setMedia(d.secure_url);};
const create=async()=>{
if(!txt&&!media) return;
await addDoc(collection(db,'posts'),{text:txt,
image:ct==='feed'||ct==='story'?media:'',
videoUrl:ct==='short'||ct==='watch'?media:'',
userName:cur?.email?.split('@')[0],userId:cur?.uid,
likeCount:0,likes:[],comments:[],mediaType:ct,
timestamp:serverTimestamp()});
setTxt('');setMedia('');setShow(false);};
const filt=posts.filter(p=>{
if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType;
if(tab==='Short') return p.mediaType==='short';
if(tab==='Watch') return p.mediaType==='watch'||p.videoUrl;
if(tab==='Story') return p.mediaType==='story';
return true;});
const search=posts.filter(p=>p.userName.toLowerCase().includes(q.toLowerCase()));
const openProfile=(id:string,name:string)=>{
setViewId(id);setViewName(name);setBot('UserProfile');};
const openChat=(uid:string,name:string)=>{
if(!cur) return;
const id=[cur.uid,uid].sort().join('_');
setChatId(id);setChatUser({id:uid,name});setBot('Chat');
setDoc(doc(db,'chats',id),{users:[cur.uid,uid],
names:[cur.email?.split('@')[0],name]},{merge:true});};
const sendMsg=async()=>{
if(!msgTxt.trim()||!chatId||!cur||!chatUser) return;
await addDoc(collection(db,'chats',chatId,'messages'),
{text:msgTxt,from:cur.uid,to:chatUser.id,time:serverTimestamp()});
setMsgTxt('');};
return(
<div className="min-h-screen flex justify-center bg-black">
<div className="w-full max-w-[430px] h-[100dvh] relative">
<div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-black to-[#1e293b]"/>
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_50%)]"/>
<div className="relative z-10 h-full flex flex-col p-3">
<div className="bg-white/[0.08] backdrop-blur-[40px] border border-white/[0.15] rounded-[22px] px-4 py-3 flex justify-between">
<div className="flex gap-2 items-center">
<div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center">O</div>
<p className="text-white font-black text-[12px]">OneFeedBD</p>
</div>
<div className="flex gap-2">
<button onClick={()=>setBot('Inbox')} className="w-8 h-8 rounded-full bg-white/10 text-white">M</button>
<button onClick={()=>setBot('Settings')} className="w-8 h-8 rounded-full bg-white/10 text-white">S</button>
</div>
</div>
<div className="flex-1 mt-3 overflow-hidden flex flex-col">
{bot==='Home'&&<>
<div className="flex gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
{['Feed','Short','Watch','Story'].map(k=>
<button key={k} onClick={()=>setTab(k)}
className={`flex-1 py-2 rounded-full text-[10px] font-black ${tab===k?'bg-white text-black':'text-white/40'}`}>{k}</button>)}
</div>
<div className="flex-1 overflow-y-auto pb-28 mt-3 space-y-3">
{filt.map(p=>{const liked=p.likes?.includes(cur?.uid||'');return(
<div key={p.id} className="rounded-[28px] bg-white/[0.08] backdrop-blur-[40px] border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.12] overflow-hidden">
<div className="flex justify-between p-3">
<div onClick={()=>openProfile(p.userId,p.userName)} className="flex gap-2 items-center">
<img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-7 h-7 rounded-full border border-white/20"/>
<p className="text-white text-xs font-bold">{p.userName}</p>
</div>
<button onClick={()=>openChat(p.userId,p.userName)} className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/20">M</button>
</div>
{p.image&&<img src={p.image} className="w-full"/>}
{p.videoUrl&&<video src={p.videoUrl} controls className="w-full"/>}
<div className="p-3">
<p className="text-white/90 text-[13px]">{p.text}</p>
<div className="flex gap-1.5 mt-3">
<button onClick={()=>like(p)} className={`px-3 py-2 rounded-full text-[11px] font-black ${liked?'bg-gradient-to-r from-pink-500 to-red-500 text-white':'bg-white/[0.08] text-white/60 border border-white/10'}`}>❤️ {p.likeCount||0}</button>
<button onClick={()=>setOpenC(openC===p.id?null:p.id)} className="px-3 py-2 rounded-full bg-white/[0.08] text-white/60 text-[11px] border border-white/10">💬 Comment</button>
<button onClick={()=>{if(navigator.share) navigator.share({text:p.text}); else alert('Copied!');}} className="px-3 py-2 rounded-full bg-white/[0.08] text-white/60 text-[11px] border border-white/10">↗ Share</button>
{cur?.uid===p.userId&&<button onClick={()=>del(p)} className="ml-auto w-8 h-8 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">X</button>}
</div>
{openC===p.id&&<div className="mt-3 flex gap-2">
<input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Write comment..." className="flex-1 bg-white/10 border border-white/10 rounded-full px-3 py-2 text-xs text-white outline-none"/>
<button onClick={()=>comment(p)} className="px-4 py-2 rounded-full bg-white text-black text-[10px] font-black">Send</button>
</div>}
</div>
</div>)})}
</div>
</>}
{bot==='Search'&&<div className="flex-1 pb-24">
<div className="bg-white/[0.07] border border-white/10 rounded-full px-4 py-2.5 flex gap-2 backdrop-blur-[20px]">
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search user..." className="flex-1 bg-transparent text-sm text-white outline-none"/>
</div>
<div className="mt-4 space-y-2">
{(q?search:posts).slice(0,12).map(p=>
<div key={p.id} onClick={()=>openProfile(p.userId,p.userName)} className="bg-white/[0.06] border border-white/10 rounded-2xl p-3 flex gap-3 items-center backdrop-blur-[20px]">
<img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-10 h-10 rounded-full"/>
<p className="text-white text-xs font-bold">{p.userName}</p>
</div>)}
</div>
</div>}
{bot==='Inbox'&&<div className="flex-1 pb-24">
<h2 className="text-white font-black text-lg">Messages</h2>
<div className="space-y-2 mt-3">
{Object.entries(uMap).filter(([uid])=>uid!==cur?.uid).map(([uid,ud]:any)=>
<div key={uid} className="bg-white/[0.06] border border-white/10 rounded-2xl p-3 flex gap-3 items-center">
<img src={`https://i.pravatar.cc/100?u=${uid}`} className="w-10 h-10 rounded-full"/>
<p className="text-white text-xs flex-1">{ud.userName||'User'}</p>
<button onClick={()=>openChat(uid,ud.userName||'User')} className="w-8 h-8 rounded-full bg-white text-black">M</button>
</div>)}
</div>
</div>}
{bot==='Chat'&&chatUser&&<div className="flex-1 flex flex-col pb-3">
<div className="flex items-center gap-3 mb-3">
<button onClick={()=>setBot('Inbox')} className="w-8 h-8 rounded-full bg-white/10 text-white">B</button>
<p className="text-white font-bold text-sm flex-1">{chatUser.name}</p>
</div>
<div className="flex-1 overflow-y-auto space-y-2 bg-black/20 rounded-2xl p-3 border border-white/10">
{msgs.map(m=><div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${m.from===cur?.uid?'ml-auto bg-white text-black':'bg-white/10 text-white'}`}>{m.text}</div>)}
</div>
<div className="mt-3 flex gap-2">
<input value={msgTxt} onChange={e=>setMsgTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Message..." className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white outline-none"/>
<button onClick={sendMsg} className="w-10 h-10 rounded-full bg-white text-black">S</button>
</div>
</div>}
{bot==='Profile'&&<div className="flex-1 overflow-y-auto pb-28">
<div className="bg-white/[0.07] backdrop-blur-[30px] border border-white/[0.12] rounded-[24px] p-5 text-center">
<img src={`https://i.pravatar.cc/150?u=${cur?.uid}`} className="w-20 h-20 rounded-full mx-auto border-2 border-white/20"/>
<h3 className="text-white font-black mt-3">{cur?.email?.split('@')[0]}</h3>
<p className="text-white/40 text-xs">{my.length} posts</p>
<div className="flex gap-2 mt-4">
<button onClick={()=>{setEditName(cur?.email?.split('@')[0]||''); setBot('EditProfile');}} className="flex-1 py-2 rounded-full bg-white text-black text-xs font-black">Edit Profile</button>
<button onClick={()=>setBot('Settings')} className="flex-1 py-2 rounded-full bg-white/10 text-white text-xs border border-white/10">Settings</button>
</div>
</div>
<div className="flex gap-1 mt-4 p-1 rounded-full bg-white/[0.06] border border-white/10">
{['All','Photo','Shorts','Watch','Story'].map(t=>
<button key={t} onClick={()=>setProfileTab(t)} className={`flex-1 py-2 rounded-full text-[9px] font-black ${profileTab===t?'bg-white text-black':'text-white/40'}`}>{t}</button>)}
</div>
<div className="mt-4 grid grid-cols-3 gap-1.5">
{my.filter(p=>{
if(profileTab==='All') return true;
if(profileTab==='Photo') return p.image;
if(profileTab==='Shorts') return p.mediaType==='short';
if(profileTab==='Watch') return p.mediaType==='watch';
if(profileTab==='Story') return p.mediaType==='story';
return true;
}).map(p=>
<div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
{p.image&&<img src={p.image} className="w-full h-full object-cover"/>}
{p.videoUrl&&<video src={p.videoUrl} className="w-full h-full object-cover"/>}
{!p.image&&!p.videoUrl&&<div className="w-full h-full flex items-center justify-center p-2"><p className="text-white/60 text-[9px]">{p.text.slice(0,30)}</p></div>}
</div>)}
</div>
</div>}
{bot==='Settings'&&<div className="flex-1 overflow-y-auto pb-28">
<div className="flex gap-3 items-center mb-4">
<button onClick={()=>setBot('Profile')} className="w-8 h-8 rounded-full bg-white/10 text-white">B</button>
<h2 className="text-white font-black">Settings</h2>
</div>
<div className="space-y-3">
<div className="bg-white/[0.07] backdrop-blur-[25px] border border-white/10 rounded-[20px] p-4">
<p className="text-white/40 text-[10px] mb-2">PRIVACY</p>
<div className="flex justify-between items-center">
<p className="text-white text-xs">Private Account</p>
<button onClick={togglePriv} className={`w-11 h-6 rounded-full p-1 flex ${priv?'bg-cyan-400 justify-end':'bg-white/20 justify-start'}`}>
<div className="w-4 h-4 bg-white rounded-full"/>
</button>
</div>
</div>
<div className="bg-white/[0.07] border border-white/10 rounded-[20px] p-4 space-y-2">
<p className="text-white/40 text-[10px]">ACCOUNT</p>
<button onClick={()=>{setEditName(cur?.email?.split('@')[0]||''); setBot('EditProfile');}} className="w-full text-left text-white text-xs py-2 border-b border-white/5">Edit Profile</button>
<button className="w-full text-left text-white text-xs py-2">Blocked Users 0</button>
</div>
<div className="bg-white/[0.07] border border-white/10 rounded-[20px] p-4">
<p className="text-white/40 text-[10px]">APP</p>
<p className="text-white text-xs">Water Glass v2.0</p>
<p className="text-white/40 text-[10px] mt-1">Advanced Liquid Design</p>
</div>
<button onClick={onLogout} className="w-full py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black">LOGOUT</button>
</div>
</div>}
{bot==='EditProfile'&&<div className="flex-1 pb-28">
<button onClick={()=>setBot('Settings')} className="w-8 h-8 rounded-full bg-white/10 text-white mb-3">B</button>
<div className="bg-white/[0.07] border border-white/10 rounded-[20px] p-4 space-y-3 backdrop-blur-[25px]">
<p className="text-white font-bold">Edit Profile</p>
<input value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"/>
<button onClick={async()=>{if(cur) await setDoc(doc(db,'users',cur.uid),{userName:editName},{merge:true}); setBot('Settings');}} className="w-full py-2 rounded-full bg-white text-black font-bold text-xs">SAVE</button>
</div>
</div>}
{bot==='UserProfile'&&<div className="flex-1 pb-24">
<button onClick={()=>setBot('Search')} className="mb-3 w-8 h-8 rounded-full bg-white/10 text-white">B</button>
<div className="bg-white/[0.07] border border-white/10 rounded-[24px] p-5 text-center backdrop-blur-[25px]">
<img src={`https://i.pravatar.cc/150?u=${viewId}`} className="w-20 h-20 rounded-full mx-auto"/>
<h3 className="text-white font-black mt-2">{viewName}</h3>
<button onClick={()=>viewId&&openChat(viewId,viewName)} className="w-full mt-4 py-2.5 rounded-full bg-white text-black text-xs font-black">MESSAGE</button>
</div>
</div>}
<div className="absolute bottom-3 left-3 right-3 bg-white/[0.08] backdrop-blur-[40px] border border-white/[0.15] rounded-[28px] flex justify-around items-center py-2.5">
<button onClick={()=>setBot('Home')} className={`w-8 h-8 rounded-full ${bot==='Home'?'bg-white/15 text-white':'text-white/30'}`}>H</button>
<button onClick={()=>setBot('Search')} className={`w-8 h-8 rounded-full ${bot==='Search'?'bg-white/15 text-white':'text-white/30'}`}>S</button>
<button onClick={()=>setShow(true)} className="w-10 h-10 rounded-full bg-white text-black font-black">+</button>
<button onClick={()=>setBot('Inbox')} className={`w-8 h-8 rounded-full ${bot==='Inbox'?'bg-white/15 text-white':'text-white/30'}`}>M</button>
<button onClick={()=>setBot('Profile')} className={`w-8 h-8 rounded-full ${bot==='Profile'?'bg-white/15 text-white':'text-white/30'}`}>P</button>
</div>
</div>
{show&&<div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xl flex items-center justify-center p-4">
<div className="w-full bg-white/15 border border-white/20 rounded-[20px] p-4 backdrop-blur-[30px]">
<div className="flex justify-between mb-3">
<h3 className="text-white font-bold">Create</h3>
<button onClick={()=>setShow(false)} className="w-7 h-7 rounded-full bg-white/10 text-white">X</button>
</div>
<div className="flex gap-1 mb-3 bg-black/20 p-1 rounded-full">
{(['feed','short','story','watch'] as const).map(t=>
<button key={t} onClick={()=>setCt(t)} className={`flex-1 py-1.5 rounded-full text-[8px] font-black ${ct===t?'bg-white text-black':'text-white/40'}`}>{t.toUpperCase()}</button>)}
</div>
<textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="What's up?" className="w-full h-16 bg-white/10 border border-white/10 rounded-xl p-2 text-xs text-white outline-none"/>
<label className="block mt-2 py-2 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-white/40">Media
<input type="file" accept="video/*,image/*" onChange={upload} className="hidden"/>
</label>
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
useEffect(()=>{return onAuthStateChanged(auth,u=>{if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChk(false);});},[]);
if(chk) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20">Loading...</div>;
if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
return <FeedApp onLogout={async()=>{await signOut(auth); setMode('none');}} />;
 }
 
