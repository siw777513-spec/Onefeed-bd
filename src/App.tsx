import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './components/Auth';

type Post = { id: string; text: string; image: string; videoUrl: string; userName: string; likeCount: number; likes: string[]; userId: string; };

function FeedApp({ mode, onLogout }: { mode: 'guest'|'auth', onLogout: ()=>void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState('Feed');
  const [activeBottom, setActiveBottom] = useState('Home');
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState('');
  const isGuest = mode==='guest';
  const currentUser = auth.currentUser;

  useEffect(()=>{
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap)=>{
      setPosts(snap.docs.map(d=> ({id:d.id,...d.data()} as Post)));
    });
    return ()=>unsub();
  },[]);

  const handleLike = async (p: Post) => {
    if (isGuest) return alert('Guest Mode: Like করতে Login করতে হবে!');
    if (!currentUser) return;
    const ref = doc(db, 'posts', p.id);
    const liked = p.likes?.includes(currentUser.uid);
    await updateDoc(ref, {
      likes: liked? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
      likeCount: liked? p.likeCount-1 : p.likeCount+1
    });
  };

  const handleCreate = async () => {
    if (!currentUser) return;
    if (!newText.trim()) return alert('কিছু লিখো!');
    await addDoc(collection(db, 'posts'), {
      text: newText,
      image: `https://picsum.photos/seed/${Date.now()}/800/800`,
      videoUrl: '',
      userName: currentUser.email?.split('@')[0] || 'User',
      userId: currentUser.uid,
      likeCount: 0,
      likes: [],
      mediaType: 'feed',
      timestamp: serverTimestamp()
    });
    setNewText(''); setShowCreate(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[420px] h-[100vh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex flex-col p-3">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-[20px] p-3 flex justify-between items-center">
            <span className="font-black text-cyan-100">OneFeedBD {isGuest? '(Guest)' : ''}</span>
            <button onClick={onLogout} className="text-[10px] bg-white/10 px-3 py-1 rounded-full">Logout</button>
          </div>

          <div className="flex gap-2 mt-3">
            {['Feed','Short','Watch','Story'].map(k=>(
              <button key={k} onClick={()=>setTab(k)} className={`flex-1 py-3 rounded-full text-xs font-bold border backdrop-blur-xl ${tab===k? 'bg-cyan-400/30 border-cyan-300 text-white' : 'bg-white/10 border-white/10 text-white/50'}`}>{k}</button>
            ))}
          </div>

          <div className="flex-1 mt-3 overflow-y-auto pb-28 space-y-4">
            {posts.map(p=>(
              <div key={p.id} className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.05] backdrop-blur-xl">
                {p.image && <img src={p.image} className="w-full h-[420px] object-cover" alt="" />}
                {p.videoUrl && <video src={p.videoUrl} controls className="w-full h-[420px]" />}
                <div className="p-4">
                  <p className="text-sm text-white/80">{p.text}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={()=>handleLike(p)} className={`px-4 py-2 rounded-full text-xs border ${p.likes?.includes(currentUser?.uid||'')? 'bg-cyan-400 text-black' : 'bg-white/10 border-white/10 text-white/60'}`}>❤️ {p.likeCount}</button>
                    <button onClick={()=> isGuest? alert('Login করতে হবে'): alert('Comment Soon!')} className="px-4 py-2 rounded-full text-xs bg-white/10 border border-white/10 text-white/60">💬 Comment</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-3 left-3 right-3 bg-white/[0.08] backdrop-blur-[25px] border border-cyan-300/20 rounded-[28px] flex justify-around items-center py-3">
            <button onClick={()=>setActiveBottom('Home')} className={`${activeBottom==='Home'? 'text-cyan-300' : 'text-white/50'} text-xs`}>🏠 Home</button>
            <button className="text-white/50 text-xs">🔍 Search</button>
            <button onClick={()=> isGuest? alert('Post করতে Login লাগবে!') : setShowCreate(true)} className="w-12 h-12 rounded-full bg-cyan-400 text-black text-2xl font-bold shadow-[0_0_20px_#22d3ee]">+</button>
            <button className="text-white/50 text-xs">✉️ Inbox</button>
            <button className="text-white/50 text-xs">👤 Profile</button>
          </div>
        </div>

        {showCreate && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="w-full bg-white/[0.08] border border-white/20 rounded-[28px] p-6">
              <h3 className="text-white font-bold mb-3">Create Post</h3>
              <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="w-full h-24 bg-white/10 border border-white/10 rounded-2xl p-3 text-sm outline-none" />
              <div className="flex gap-2 mt-4">
                <button onClick={()=>setShowCreate(false)} className="flex-1 py-3 rounded-full bg-white/10 text-white/60">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3 rounded-full bg-cyan-400 text-black font-bold">Post</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<'none'|'guest'|'auth'>('none');
  const [checking, setChecking] = useState(true);
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{ if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChecking(false); });
    return ()=>unsub();
  },[]);
  if(checking) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-300">Loading OneFeedBD...</div>;
  if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
  return <FeedApp mode={mode} onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
}
