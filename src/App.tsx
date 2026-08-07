import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './components/Auth';

type Post = { id: string; text: string; image: string; videoUrl: string; userName: string; likeCount: number; likes: string[]; userId: string; mediaType: string; };
type UserData = { name: string; bio: string; location: string; website: string; language: string; }

const CLOUD_NAME = "bvvoprge";
const UPLOAD_PRESET = "onefeed_preset";

function ProfilePage({ onLogout, postsCount }: { onLogout: ()=>void, postsCount: number }) {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState<'Posts'|'About'|'Settings'>('Posts');
  const [userData, setUserData] = useState<UserData>({ name: '', bio: 'OneFeedBD User 🇧🇩', location: 'Dhaka, Bangladesh', website: 'onefeedbd.com', language: 'বাংলা' });
  const [isEditing, setIsEditing] = useState(false);
  useEffect(()=>{ if(!user) return; getDoc(doc(db, 'users', user.uid)).then(s=>{ if(s.exists()) setUserData(s.data() as any); }); },[user]);
  const saveProfile = async ()=>{ if(!user) return; await setDoc(doc(db, 'users', user.uid), userData, {merge:true}); setIsEditing(false); alert('Saved ✅'); };
  return (
    <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
      <div className="h-24 rounded-[24px] bg-gradient-to-r from-cyan-400/30 to-purple-500/30 border border-white/10"></div>
      <div className="flex items-center gap-3 -mt-8 ml-4">
        <img src={`https://i.pravatar.cc/150?u=${user?.uid}`} className="w-16 h-16 rounded-full border-2 border-black" />
        <div><h2 className="text-white font-black text-sm">{userData.name || user?.email?.split('@')[0]}</h2><p className="text-white/40 text-[10px]">{user?.email}</p></div>
        <button onClick={()=>setIsEditing(!isEditing)} className="ml-auto mr-4 px-4 py-2 rounded-full bg-white text-black text-[10px] font-bold">{isEditing?'Cancel':'Edit'}</button>
      </div>
      <div className="flex gap-2 mt-4 bg-white/[0.06] border border-white/10 rounded-full p-1">
        {(['Posts','About','Settings'] as const).map(t=><button key={t} onClick={()=>setActiveTab(t)} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${activeTab===t?'bg-white text-black':'text-white/50'}`}>{t}</button>)}
      </div>
      {activeTab==='Posts' && <div className="grid grid-cols-3 gap-1 mt-3">{Array.from({length:9}).map((_,i)=><div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5"><img src={`https://picsum.photos/seed/${i+10}/300/300`} className="w-full h-full object-cover"/></div>)}</div>}
      {activeTab==='About' && <div className="mt-3 bg-white/[0.06] border border-white/10 rounded-[20px] p-4 space-y-3">{Object.keys(userData).map(k=><div key={k}><p className="text-[9px] text-white/30">{k.toUpperCase()}</p>{isEditing?<input value={(userData as any)[k]} onChange={e=>setUserData({...userData,[k]:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"/>:<div className="text-xs text-white/70 py-2">{(userData as any)[k]}</div>}</div>)}<button onClick={saveProfile} className="w-full py-3 rounded-full bg-cyan-400 text-black font-bold text-xs">Save</button></div>}
      {activeTab==='Settings' && <div className="mt-3 bg-white/[0.06] border border-white/10 rounded-[20px] overflow-hidden">{['🌐 Language: '+userData.language,'🔔 Notifications','🔒 Privacy','❓ Help','ℹ️ About'].map(t=><div key={t} className="px-4 py-4 border-b border-white/5 text-xs text-white/70">{t}</div>)}<button onClick={onLogout} className="w-full m-2 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold">Log Out</button></div>}
      <p className="text-center text-[10px] text-white/20 mt-4">Posts: {postsCount}</p>
    </div>
  )
}

function FeedApp({ mode, onLogout }: { mode: 'guest'|'auth', onLogout: ()=>void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState('Feed');
  const [activeBottom, setActiveBottom] = useState('Home');
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<'feed'|'short'|'story'>('feed');
  const [newText, setNewText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const isGuest = mode==='guest';
  const currentUser = auth.currentUser;

  useEffect(()=>{ const q=query(collection(db,'posts'),orderBy('timestamp','desc')); const unsub=onSnapshot(q,s=>setPosts(s.docs.map(d=>({id:d.id,...d.data()} as Post)))); return ()=>unsub(); },[]);
  const handleLike = async (p:Post)=>{ if(isGuest) return alert('Login লাগবে!'); if(!currentUser) return; const ref=doc(db,'posts',p.id); const liked=p.likes?.includes(currentUser.uid); await updateDoc(ref,{likes: liked? arrayRemove(currentUser.uid):arrayUnion(currentUser.uid), likeCount: liked? p.likeCount-1:p.likeCount+1}); };
  const handleFile = async (e:any)=>{ const file=e.target.files[0]; if(!file) return; setUploading(true); const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',UPLOAD_PRESET); const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{method:'POST',body:fd}); const data=await res.json(); setMediaUrl(data.secure_url); setUploading(false); };
  const handleCreate = async ()=>{ if(!currentUser) return; if(!newText.trim() &&!mediaUrl) return alert('কিছু লিখো!'); await addDoc(collection(db,'posts'),{text:newText, image:createType!=='short'?mediaUrl:'', videoUrl:createType==='short'?mediaUrl:'', userName:currentUser.email?.split('@')[0]||'User', userId:currentUser.uid, likeCount:0, likes:[], mediaType:createType, timestamp:serverTimestamp()}); setNewText(''); setMediaUrl(''); setShowCreate(false); };
  const filtered = posts.filter(p=>{ if(tab==='Feed') return p.mediaType==='feed'||!p.mediaType; if(tab==='Short') return p.mediaType==='short'; if(tab==='Watch') return p.mediaType==='short'||p.videoUrl; if(tab==='Story') return p.mediaType==='story'; return true; });

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 h-full flex flex-col p-3">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-[20px] px-4 py-3 flex justify-between"><span className="font-black text-white text-sm">OneFeedBD</span><button onClick={onLogout} className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-white/60">Logout</button></div>
          {activeBottom==='Home' && <div className="flex gap-2 mt-3">{['Feed','Short','Watch','Story'].map(k=><button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2 rounded-full text-[11px] font-bold border ${tab===k?'bg-cyan-400 text-black':'bg-white/10 text-white/50 border-white/10'}`}>{k}</button>)}</div>}
          <div className="flex-1 mt-3 overflow-hidden flex flex-col">
            {activeBottom==='Profile'? <ProfilePage onLogout={onLogout} postsCount={posts.length}/> : <div className="flex-1 overflow-y-auto pb-28 space-y-3 no-scrollbar">{filtered.map(p=><div key={p.id} className="rounded-[24px] overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur-xl">{p.image && <img src={p.image} className="w-full h-[380px] object-cover"/>}{p.videoUrl && <video src={p.videoUrl} controls className="w-full h-[380px] bg-black"/>}<div className="p-3"><p className="text-[12px] text-white/80">{p.text}</p><div className="flex gap-2 mt-2"><button onClick={()=>handleLike(p)} className={`px-3 py-1.5 rounded-full text-[11px] border ${p.likes?.includes(currentUser?.uid||'')?'bg-cyan-400 text-black':'bg-white/10 text-white/60 border-white/10'}`}>❤ {p.likeCount}</button><span className="text-[10px] text-white/30">{p.mediaType}</span></div></div></div>)}{filtered.length===0 && <p className="text-center text-white/30 text-xs mt-10">এখানে কোনো {tab} নেই, + দিয়ে ছাড়ো!</p>}</div>}
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-white/[0.08] backdrop-blur-2xl border border-white/10 rounded-[30px] flex justify-around py-2.5">{[{k:'Home'},{k:'Search'},{k:'Add'},{k:'Inbox'},{k:'Profile'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=> isGuest? alert('Login লাগবে!'):setShowCreate(true)} className="w-11 h-11 rounded-full bg-cyan-400 text-black font-black">+</button>:<button key={b.k} onClick={()=>setActiveBottom(b.k)} className={`text-[10px] ${activeBottom===b.k?'text-cyan-300':'text-white/40'}`}>{b.k}</button>)}</div>
        </div>
        {showCreate && <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"><div className="w-full bg-[#111] border border-white/15 rounded-[24px] p-4"><div className="flex gap-1 mb-3 bg-white/10 rounded-full p-1">{(['feed','short','story'] as const).map(t=><button key={t} onClick={()=>setCreateType(t)} className={`flex-1 py-2 rounded-full text-[10px] font-bold ${createType===t?'bg-cyan-400 text-black':'text-white/60'}`}>{t.toUpperCase()}</button>)}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="কি লিখবে?" className="w-full h-20 bg-white/10 border border-white/10 rounded-xl p-3 text-xs text-white outline-none resize-none"/><label className="block mt-3 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-center text-[11px] text-white/50 cursor-pointer">{uploading?'Uploading...':mediaUrl?'✅ Done': createType==='short'?'📹 ভিডিও Select':'🖼️ ছবি Select'}<input type="file" accept={createType==='short'?'video/*':'image/*'} onChange={handleFile} className="hidden"/></label>{mediaUrl && <div className="mt-2">{createType==='short'?<video src={mediaUrl} className="w-full h-32 rounded-xl"/>:<img src={mediaUrl} className="w-full h-32 object-cover rounded-xl"/>}</div>}<div className="flex gap-2 mt-4"><button onClick={()=>setShowCreate(false)} className="flex-1 py-3 rounded-full bg-white/10 text-white/60 text-xs">Cancel</button><button onClick={handleCreate} disabled={uploading} className="flex-1 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs">Post {createType}</button></div></div></div>}
      </div>
    </div>
  )
}
export default function App() {
  const [mode, setMode] = useState<'none'|'guest'|'auth'>('none');
  const [checking, setChecking] = useState(true);
  useEffect(()=>{ const unsub=onAuthStateChanged(auth,u=>{ if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChecking(false); }); return ()=>unsub(); },[]);
  if(checking) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-300 text-sm">Loading...</div>;
  if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
  return <FeedApp mode={mode} onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
        }
