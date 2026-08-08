
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
const [bot,setBot]=useState('Home');
const [show,setShow]=useState(false);
const [txt,setTxt]=useState('');
const [media,setMedia]=useState('');
const [q,setQ]=useState('');
const [priv,setPriv]=useState(false);
const [uMap,setUMap]=useState<Record<string,any>>({});
const [chatId,setChatId]=useState<string|null>(null);
const [chatUser,setChatUser]=useState<any>(null);
const [msgs,setMsgs]=useState<Msg[]>([]);
const [msgTxt,setMsgTxt]=useState('');
const [editName,setEditName]=useState('');
const [notifLike,setNotifLike]=useState(true);
const [notifCmnt,setNotifCmnt]=useState(true);
const [notifMsg,setNotifMsg]=useState(true);
const [hideLike,setHideLike]=useState(false);
const [online,setOnline]=useState(true);
const cur=auth.currentUser;
useEffect(()=>onSnapshot(query(collection(db,'posts'),
orderBy('timestamp','desc')),s=>setPosts(s.docs.map(d=>({id:d.id,
...d.data()} as Post)))),[]);
useEffect(()=>onSnapshot(collection(db,'users'),s=>{
const m:any={};s.docs.forEach(d=>m[d.id]=d.data());setUMap(m);}),[]);
const openChat=(uid:string,name:string)=>{
if(!cur) return;
const id=[cur.uid,uid].sort().join('_');
setChatId(id);setChatUser({id:uid,name});setBot('Chat');
setDoc(doc(db,'chats',id),{users:[cur.uid,uid],
names:[cur.email?.split('@')[0],name]},{merge:true});};
const sendMsg=async()=>{
if(!msgTxt.trim()||!chatId||!cur||!chatUser) return;
await addDoc(collection(db,'chats',chatId,'messages'),
{text:msgTxt,from:cur.uid,to:chatUser.id,
time:serverTimestamp()});
setMsgTxt('');};
useEffect(()=>{if(!chatId) return;
return onSnapshot(query(collection(db,'chats',chatId,'messages'),
orderBy('time','asc')),s=>setMsgs(s.docs.map(d=>({id:d.id,
...d.data()} as Msg))));},[chatId]);
return(
<div className="min-h-screen bg-black flex justify-center">
<div className="w-full max-w-[430px] h-[100dvh] bg-[#0a0a0a] flex flex-col">
<div className="p-3 bg-[#111] border-b border-white/10 flex justify-between">
<p className="text-white font-black">OneFeedBD</p>
<button onClick={()=>setBot('Settings')}
className="text-white/60 text-xs">Settings</button>
</div>
<div className="flex-1 overflow-y-auto p-3 pb-24">
{bot==='Home'&&<div className="space-y-3">
{posts.slice(0,20).map(p=>
<div key={p.id} className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
<p className="text-white text-xs font-bold">{p.userName}</p>
<p className="text-white/70 text-sm mt-1">{p.text}</p>
{p.image&&<img src={p.image} className="w-full mt-2 rounded-lg"/>}
</div>)}
</div>}
{bot==='Inbox'&&<div>
<h2 className="text-white font-bold mb-3">Messages - All Users</h2>
<div className="space-y-2">
{Object.entries(uMap).filter(([uid])=>uid!==cur?.uid)
.map(([uid,ud]:any)=>
<div key={uid} className="bg-[#1a1a1a] rounded-xl p-3 flex gap-2 items-center">
<img src={`https://i.pravatar.cc/100?u=${uid}`} className="w-8 h-8 rounded-full"/>
<p className="text-white text-xs flex-1">{ud.userName||'User'}</p>
<button onClick={()=>openChat(uid,ud.userName||'User')}
className="bg-white text-black px-3 py-1 rounded-full text-xs">Chat</button>
</div>)}
</div>
</div>}
{bot==='Chat'&&chatUser&&<div className="flex flex-col h-full">
<div className="flex gap-2 items-center mb-3">
<button onClick={()=>setBot('Inbox')} className="text-white">Back</button>
<p className="text-white font-bold">{chatUser.name}</p>
</div>
<div className="flex-1 space-y-2 overflow-y-auto">
{msgs.map(m=><div key={m.id} className={`p-2 rounded-lg text-xs max-w-[70%] ${m.from===cur?.uid?'ml-auto bg-white text-black':'bg-[#1a1a1a] text-white'}`}>{m.text}</div>)}
</div>
<div className="flex gap-2 mt-3">
<input value={msgTxt} onChange={e=>setMsgTxt(e.target.value)}
className="flex-1 bg-[#1a1a1a] rounded-full px-3 py-2 text-white text-sm"/>
<button onClick={sendMsg} className="bg-white text-black px-4 rounded-full">Send</button>
</div>
</div>}
{bot==='Settings'&&<div className="space-y-4">
<div className="flex gap-2 items-center">
<button onClick={()=>setBot('Home')} className="text-white">Back</button>
<h2 className="text-white font-black">Settings</h2>
</div>
<div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
<p className="text-white/40 text-[10px] mb-3">PRIVACY</p>
<div className="space-y-3">
<div className="flex justify-between">
<p className="text-white text-xs">Private Account</p>
<button onClick={()=>setPriv(!priv)} className={`w-10 h-5 rounded-full ${priv?'bg-green-500':'bg-white/20'}`}/>
</div>
<div className="flex justify-between">
<p className="text-white text-xs">Hide Like Count</p>
<button onClick={()=>setHideLike(!hideLike)} className={`w-10 h-5 rounded-full ${hideLike?'bg-green-500':'bg-white/20'}`}/>
</div>
<div className="flex justify-between">
<p className="text-white text-xs">Show Online Status</p>
<button onClick={()=>setOnline(!online)} className={`w-10 h-5 rounded-full ${online?'bg-green-500':'bg-white/20'}`}/>
</div>
</div>
</div>
<div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
<p className="text-white/40 text-[10px] mb-3">ACCOUNT</p>
<div className="space-y-2">
<button onClick={()=>{setEditName(cur?.email?.split('@')[0]||''); setBot('EditProfile');}} className="w-full text-left text-white text-xs py-2 border-b border-white/5">Edit Profile</button>
<button className="w-full text-left text-white text-xs py-2 border-b border-white/5">Change Password</button>
<button className="w-full text-left text-white text-xs py-2 border-b border-white/5">Blocked Users 0</button>
<button className="w-full text-left text-white text-xs py-2">Two Factor Auth</button>
</div>
</div>
<div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
<p className="text-white/40 text-[10px] mb-3">NOTIFICATIONS</p>
<div className="space-y-3">
<div className="flex justify-between">
<p className="text-white text-xs">Like Notifications</p>
<button onClick={()=>setNotifLike(!notifLike)} className={`w-10 h-5 rounded-full ${notifLike?'bg-green-500':'bg-white/20'}`}/>
</div>
<div className="flex justify-between">
<p className="text-white text-xs">Comment Notifications</p>
<button onClick={()=>setNotifCmnt(!notifCmnt)} className={`w-10 h-5 rounded-full ${notifCmnt?'bg-green-500':'bg-white/20'}`}/>
</div>
<div className="flex justify-between">
<p className="text-white text-xs">Message Notifications</p>
<button onClick={()=>setNotifMsg(!notifMsg)} className={`w-10 h-5 rounded-full ${notifMsg?'bg-green-500':'bg-white/20'}`}/>
</div>
</div>
</div>
<div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
<p className="text-white/40 text-[10px] mb-3">APP SETTINGS</p>
<div className="space-y-2">
<div className="flex justify-between py-2 border-b border-white/5">
<p className="text-white text-xs">Language</p>
<p className="text-white/40 text-xs">English</p>
</div>
<div className="flex justify-between py-2 border-b border-white/5">
<p className="text-white text-xs">Dark Mode</p>
<p className="text-white/40 text-xs">On</p>
</div>
<div className="flex justify-between py-2 border-b border-white/5">
<p className="text-white text-xs">Data Saver</p>
<p className="text-white/40 text-xs">Off</p>
</div>
<div className="flex justify-between py-2">
<p className="text-white text-xs">App Version</p>
<p className="text-white/40 text-xs">v2.0.0</p>
</div>
</div>
</div>
<div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
<p className="text-white/40 text-[10px] mb-3">STORAGE</p>
<div className="space-y-2">
<div className="flex justify-between py-1">
<p className="text-white text-xs">Clear Cache</p>
<p className="text-white/40 text-xs">12.5 MB</p>
</div>
<div className="flex justify-between py-1">
<p className="text-white text-xs">Clear Search History</p>
<p className="text-white/40 text-xs">Clear</p>
</div>
</div>
</div>
<div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
<p className="text-white/40 text-[10px] mb-3">SUPPORT</p>
<div className="space-y-2">
<p className="text-white text-xs py-1">Help Center</p>
<p className="text-white text-xs py-1">Report Problem</p>
<p className="text-white text-xs py-1">Privacy Policy</p>
<p className="text-white text-xs py-1">Terms of Service</p>
</div>
</div>
<button onClick={onLogout} className="w-full py-3 rounded-full bg-white/10 text-white text-xs font-bold">LOGOUT</button>
<button className="w-full py-3 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">DELETE ACCOUNT</button>
</div>}
{bot==='EditProfile'&&<div className="space-y-4">
<button onClick={()=>setBot('Settings')} className="text-white">Back</button>
<h2 className="text-white font-bold">Edit Profile</h2>
<div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
<input value={editName} onChange={e=>setEditName(e.target.value)}
placeholder="Username" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm"/>
<textarea placeholder="Bio" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm h-20"/>
<button onClick={async()=>{if(cur) await setDoc(doc(db,'users',cur.uid),{userName:editName},{merge:true}); setBot('Settings');}} className="w-full bg-white text-black py-2 rounded-full font-bold text-sm">SAVE</button>
</div>
</div>}
</div>
<div className="p-3 bg-[#111] border-t border-white/10 flex justify-around">
<button onClick={()=>setBot('Home')} className="text-white text-xs">Home</button>
<button onClick={()=>setBot('Inbox')} className="text-white text-xs">Inbox</button>
<button onClick={()=>setBot('Settings')} className="text-white text-xs">Settings</button>
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
 
