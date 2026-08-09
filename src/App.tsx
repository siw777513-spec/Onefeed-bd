import {useState,useEffect} from 'react';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import {collection,query,orderBy,onSnapshot,addDoc,
serverTimestamp,updateDoc,arrayUnion,arrayRemove,doc,
deleteDoc,setDoc} from 'firebase/firestore';
import {auth,db} from './firebase';
import AuthPage from './components/Auth';
type Post={id:string;text:string;image:string;videoUrl:string;
userName:string;likeCount:number;likes:string[];userId:string;
mediaType:string;};
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
const [pTab,setPTab]=useState('All');
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
const like=async(p:Post)=>{
const l=p.likes?.includes(cur!.uid);
await updateDoc(doc(db,'posts',p.id),
{likes:l?arrayRemove(cur!.uid):arrayUnion(cur!.uid),
likeCount:l?(p.likeCount||0)-1:(p.likeCount||0)+1});};
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
likeCount:0,likes:[],mediaType:ct,
timestamp:serverTimestamp()});
setTxt('');setMedia('');setShow(false);};
const filt=posts.filter(p=>{
if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType;
if(tab==='Short') return p.mediaType==='short';
if(tab==='Watch') return p.mediaType==='watch'||p.videoUrl;
if(tab==='Story') return p.mediaType==='story';
return true;});
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
<div className="min-h-screen flex justify-center bg-[#050508] relative overflow-hidden">
<div className="absolute inset-0">
<div className="absolute top-[-20%] left-[-10%] w-[80%] h-[50%] bg-[#ff006e]/[0.15]
 blur-[120px] rounded-full"/>
<div className="absolute top-[10%] right-[-20%] w-[70%] h-[40%] bg-[#3a86ff]/[0.15]
 blur-[120px] rounded-full"/>
<div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-[#8338ec]/[0.12]
 blur-[120px] rounded-full"/>
</div>
<div className="w-full max-w-[430px] h-[100dvh] relative z-10 flex flex-col">
<div className="m-3 rounded-[24px] bg-white/[0.08] backdrop-blur-[40px] border
 border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_20px_80px_rgba(0,0,0,0.5)
 ] px-4 py-3.5 flex justify-between items-center">
<div className="flex gap-3 items-center">
<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff006e] to-[#3a86ff] flex
 items-center justify-center text-white font-black text-[14px] shadow-lg">O</div>
<div><p className="text-white font-black text-[13px] tracking-wide">OneFeedBD</p><p
 className="text-white/30 text-[9px]">PREMIUM</p></div>
</div>
<div className="flex gap-2">
<button onClick={()=>setBot('Inbox')} className="w-9 h-9 rounded-full bg-white/[0.08] border
 border-white/10 backdrop-blur text-white/70 flex items-center justify-center">✉️</button>
<button onClick={()=>setBot('Settings')} className="w-9 h-9 rounded-full bg-white/[0.08]
 border border-white/10 backdrop-blur text-white/70">⚙️</button>
</div>
</div>
<div className="flex-1 mx-3 overflow-hidden flex flex-col">
{bot==='Home'&&<>
<div className="flex gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-[30px] border
 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
{['Feed','Short','Watch','Story'].map(k=>
<button key={k} onClick={()=>setTab(k)}
className={`flex-1 py-2.5 rounded-full text-[11px] font-bold tracking-wide transition-all
 ${tab===k?'bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.3)]
 scale-[1.02]':'text-white/40 hover:text-white/70'}`}>{k}</button>)}
</div>
<div className="flex-1 overflow-y-auto pb-28 mt-4 space-y-4">
{filt.map(p=>{const liked=p.likes?.includes(cur?.uid||'');return(
<div key={p.id} className="group rounded-[28px] bg-white/[0.06] backdrop-blur-[40px] border
 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.4)]
 overflow-hidden hover:bg-white/[0.08] transition-all">
<div className="flex justify-between p-4 items-center">
<div className="flex gap-3 items-center">
<div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-br from-[#ff006e]
 to-[#3a86ff]"><img src={`https://i.pravatar.cc/100?u=${p.userId}`} className="w-full h-full
 rounded-full border-2 border-black"/></div>
<div><p className="text-white text-[13px] font-bold">{p.userName}</p><p
 className="text-white/30 text-[10px]">Just now • Public</p></div>
</div>
<button onClick={()=>openChat(p.userId,p.userName)} className="w-8 h-8 rounded-full bg-white/5
 border border-white/10 text-white/50">💬</button>
</div>
{p.image&&<div className="relative"><img src={p.image} className="w-full"/><div
 className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
 pointer-events-none"/></div>}
{p.videoUrl&&<video src={p.videoUrl} controls className="w-full"/>}
<div className="p-4">
<p className="text-white/90 text-[14px] leading-[1.5]">{p.text}</p>
<div className="flex gap-2 mt-4">
<button onClick={()=>like(p)} className={`group/btn flex items-center gap-2 px-4 py-2.5
 rounded-full text-[12px] font-bold transition-all ${liked?'bg-gradient-to-r from-[#ff006e]
 to-[#ff4081] text-white shadow-[0_4px_20px_rgba(255,0,110,0.4)] scale-105':'bg-white/[0.06]
 border border-white/[0.08] text-white/60 hover:bg-white/[0.1] hover:text-white'}`}><span
 className={`${liked?'animate-bounce':''}`}>❤️</span> {p.likeCount||0}</button>
<button onClick={()=>setOpenC(openC===p.id?null:p.id)} className="px-4 py-2.5 rounded-full
 bg-white/[0.06] border border-white/[0.08] text-white/60 text-[12px] font-bold
 hover:bg-white/[0.1]">💬 Comment</button>
<button onClick={()=>{if(navigator.share) navigator.share({text:p.text});}} className="px-4
 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[12px]
 font-bold">↗ Share</button>
</div>
{openC===p.id&&<div className="mt-4 p-3 rounded-2xl bg-black/20 border border-white/5 flex
 gap-2">
<input value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Add a beautiful
 comment..." className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2.5
 text-xs text-white outline-none focus:bg-white/[0.1] focus:border-white/20 transition-all"/>
<button onClick={async()=>{if(!cmt.trim()) return; await
 updateDoc(doc(db,'posts',p.id),{likeCount:(p.likeCount||0)}); setCmt('');}} className="w-10
 h-10 rounded-full bg-white text-black font-bold">↑</button>
</div>}
</div>
</div>)})}
</div>
</>}
{bot==='Profile'&&<div className="flex-1 overflow-y-auto pb-28">
<div className="rounded-[32px] bg-gradient-to-br from-white/[0.08] to-white/[0.03]
 backdrop-blur-[40px] border border-white/[0.1]
 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_20px_60px_rgba(0,0,0,0.5)] p-6 text-center
 relative overflow-hidden">
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r
 from-transparent via-white/20 to-transparent"/>
<div className="w-24 h-24 mx-auto rounded-full p-[2px] bg-gradient-to-br from-[#ff006e]
 via-[#8338ec] to-[#3a86ff] shadow-[0_0_30px_rgba(255,0,110,0.3)]"><img
 src={`https://i.pravatar.cc/150?u=${cur?.uid}`} className="w-full h-full rounded-full
 border-[3px] border-black"/></div>
<h3 className="text-white font-black mt-4 text-[18px]
 tracking-wide">{cur?.email?.split('@')[0]}</h3>
<p className="text-white/30 text-[11px] mt-1">@{cur?.email?.split('@')[0]} • {my.length} posts
 • Premium Member</p>
<div className="flex gap-3 mt-6">
<button onClick={()=>{setEditName(cur?.email?.split('@')[0]||''); setBot('EditProfile');}}
 className="flex-1 py-3 rounded-full bg-white text-black text-[12px] font-black tracking-wide
 shadow-[0_8px_20px_rgba(255,255,255,0.2)]">Edit Profile</button>
<button onClick={()=>setBot('Settings')} className="flex-1 py-3 rounded-full bg-white/[0.08]
 border border-white/10 text-white text-[12px] font-bold backdrop-blur">Settings</button>
</div>
</div>
<div className="flex gap-1 mt-5 p-1.5 rounded-full bg-black/50 backdrop-blur-[30px] border
 border-white/[0.06]">
{['All','Photo','Shorts','Watch','Story'].map(t=>
<button key={t} onClick={()=>setPTab(t)} className={`flex-1 py-2.5 rounded-full text-[10px]
 font-black tracking-widest ${pTab===t?'bg-white text-black shadow-lg':'text-white/30
 hover:text-white/60'}`}>{t}</button>)}
</div>
<div className="mt-5 grid grid-cols-3 gap-2">
{my.filter(p=>{
if(pTab==='All') return true;
if(pTab==='Photo') return p.image;
if(pTab==='Shorts') return p.mediaType==='short';
if(pTab==='Watch') return p.mediaType==='watch';
if(pTab==='Story') return p.mediaType==='story';
return true;
}).map(p=>
<div key={p.id} className="group aspect-square rounded-[16px] overflow-hidden bg-white/[0.04]
 border border-white/[0.06] hover:border-white/15 transition-all hover:scale-[1.02]">
{p.image&&<img src={p.image} className="w-full h-full object-cover group-hover:scale-110
 transition-transform duration-500"/>}
{p.videoUrl&&<video src={p.videoUrl} className="w-full h-full object-cover"/>}
{!p.image&&!p.videoUrl&&<div className="w-full h-full flex items-center justify-center p-3
 bg-gradient-to-br from-white/[0.05] to-transparent"><p className="text-white/50 text-[10px]
 text-center">{p.text.slice(0,40)}</p></div>}
</div>)}
</div>
</div>}
{bot==='Settings'&&<div className="flex-1 overflow-y-auto pb-28">
<h2 className="text-white font-black text-[20px] mb-5">Settings</h2>
<div className="space-y-4">
<div className="rounded-[20px] bg-white/[0.06] backdrop-blur-[30px] border border-white/[0.08]
 p-5">
<p className="text-white/20 text-[10px] tracking-[2px] mb-4">PRIVACY</p>
<div className="flex justify-between items-center"><p className="text-white
 text-[13px]">Private Account</p><div className={`w-12 h-7 rounded-full p-1 flex
 ${priv?'bg-[#3a86ff] justify-end':'bg-white/10 justify-start'}`}><div className="w-5 h-5
 bg-white rounded-full shadow-lg"/></div></div>
</div>
<div className="rounded-[20px] bg-white/[0.06] backdrop-blur-[30px] border border-white/[0.08]
 p-5 space-y-3">
<p className="text-white/20 text-[10px] tracking-[2px]">ACCOUNT</p>
<button onClick={()=>setBot('EditProfile')} className="w-full text-left text-white text-[13px]
 py-2 flex justify-between">Edit Profile <span className="text-white/20">›</span></button>
</div>
<button onClick={onLogout} className="w-full py-4 rounded-full bg-gradient-to-r
 from-red-500/20 to-pink-500/20 border border-red-500/20 text-red-300 text-[12px] font-black
 tracking-widest">LOGOUT</button>
</div>
</div>}
<div className="mt-auto mb-3 mx-1 rounded-[28px] bg-black/60 backdrop-blur-[50px] border
 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_80px_rgba(0,0,0,0.8)]
 flex justify-around items-center py-3 px-2">
{[{k:'Home',e:'◉'},{k:'Search',e:'◎'},{k:'Profile',e:'◍'}].map(b=>
<button key={b.k} onClick={()=>setBot(b.k)} className={`w-11 h-11 rounded-full flex
 items-center justify-center text-[14px] transition-all ${bot===b.k?'bg-white text-black
 shadow-[0_8px_20px_rgba(255,255,255,0.3)] scale-110':'text-white/30
 hover:text-white/60'}`}>{b.e}</button>)}
<button onClick={()=>setShow(true)} className="w-12 h-12 rounded-full bg-gradient-to-br
 from-[#ff006e] to-[#3a86ff] text-white font-black text-[20px]
 shadow-[0_8px_30px_rgba(255,0,110,0.4)] scale-105">+</button>
{[{k:'Inbox',e:'✉'},{k:'Settings',e:'⚙'}].map(b=>
<button key={b.k} onClick={()=>setBot(b.k)} className={`w-11 h-11 rounded-full flex
 items-center justify-center text-[14px] ${bot===b.k?'bg-white text-black shadow-lg
 scale-110':'text-white/30'}`}>{b.e}</button>)}
</div>
</div>
{show&&<div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[20px] flex
 items-center justify-center p-4">
<div className="w-full rounded-[28px] bg-[#0f0f10]/80 backdrop-blur-[40px] border
 border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-6">
<h3 className="text-white font-black text-[16px] mb-4">Create Premium Post</h3>
<div className="flex gap-1.5 mb-4 p-1 rounded-full bg-black/50 border border-white/5">
{(['feed','short','story','watch'] as const).map(t=>
<button key={t} onClick={()=>setCt(t)} className={`flex-1 py-2 rounded-full text-[10px]
 font-black ${ct===t?'bg-white text-black
 shadow-lg':'text-white/30'}`}>{t.toUpperCase()}</button>)}
</div>
<textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="What's on your mind?
 Make it beautiful..." className="w-full h-24 bg-white/[0.04] border border-white/[0.08]
 rounded-2xl p-4 text-[13px] text-white outline-none focus:bg-white/[0.08]
 focus:border-white/15 transition-all"/>
<button onClick={create} className="w-full mt-4 py-3.5 rounded-full bg-white text-black
 font-black text-[12px] tracking-wide shadow-[0_8px_30px_rgba(255,255,255,0.2)]">PUBLISH
 ✨</button>
<button onClick={()=>setShow(false)} className="w-full mt-3 py-2 text-white/30
 text-[11px]">Cancel</button>
</div>
</div>}
</div>
</div>
);
}
export default function App(){
const [mode,setMode]=useState<'none'|'guest'|'auth'>('none');
const [chk,setChk]=useState(true);
useEffect(()=>{return onAuthStateChanged(auth,u=>{if(u) setMode('auth'); else
 if(mode!=='guest') setMode('none'); setChk(false);});},[]);
if(chk) return <div className="min-h-screen bg-[#050508] flex items-center justify-center
 text-white/20">Loading Premium...</div>;
if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
return <FeedApp onLogout={async()=>{await signOut(auth); setMode('none');}} />;
                                                  }
