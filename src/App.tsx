import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './components/Auth';

type Post = { id: string; text: string; image: string; videoUrl: string; userName: string; likeCount: number; likes: string[]; userId: string; };
type UserData = { name: string; bio: string; location: string; website: string; gender: string; birthday: string; language: string; }

// ----- CLEAN PRO PROFILE PAGE -----
function ProfilePage({ onLogout, postsCount }: { onLogout: ()=>void, postsCount: number }) {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState<'Posts'|'About'|'Settings'>('Posts');
  const [userData, setUserData] = useState<UserData>({ name: '', bio: '', location: 'Bangladesh', website: '', gender: 'Male', birthday: '', language: 'বাংলা' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(()=>{
    if(!user) return;
    const ref = doc(db, 'users', user.uid);
    getDoc(ref).then(snap=>{
      if(snap.exists()) setUserData(snap.data() as UserData);
      else setUserData({ name: user.email?.split('@')[0]||'', bio: 'OneFeedBD User 🇧🇩', location: 'Dhaka, Bangladesh', website: 'onefeedbd.com', gender: 'Male', birthday: '', language: 'বাংলা' });
    });
  },[user]);

  const saveProfile = async () => {
    if(!user) return;
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    setIsEditing(false);
    alert('Profile Saved ✅');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
      {/* COVER + AVATAR */}
      <div className="relative">
        <div className="h-28 rounded-[28px] bg-gradient-to-r from-cyan-400/30 to-purple-500/30 border border-white/10"></div>
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <img src={`https://i.pravatar.cc/150?u=${user?.uid}`} className="w-20 h-20 rounded-full border-[3px] border-black shadow-xl" />
          <div className="mb-1">
            <h2 className="text-white font-black text-[17px]">{userData.name || 'Sakib Islam'}</h2>
            <p className="text-white/40 text-[11px]">{user?.email}</p>
          </div>
        </div>
        <button onClick={()=>setIsEditing(!isEditing)} className="absolute right-4 -bottom-10 px-4 py-2 rounded-full bg-white text-black text-[11px] font-black">{isEditing? 'Cancel':'Edit'}</button>
      </div>

      <div className="mt-14 px-2">
        <p className="text-white/70 text-[13px] leading-relaxed">{userData.bio}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-[10px] bg-white/10 border border-white/10 px-3 py-1 rounded-full text-white/60">📍 {userData.location}</span>
          <span className="text-[10px] bg-white/10 border border-white/10 px-3 py-1 rounded-full text-white/60">🔗 {userData.website}</span>
        </div>
        <div className="flex gap-5 mt-4">
          <span className="text-sm text-white font-bold">{postsCount} <span className="font-normal text-white/40 text-xs">Posts</span></span>
          <span className="text-sm text-white font-bold">1.2k <span className="font-normal text-white/40 text-xs">Followers</span></span>
          <span className="text-sm text-white font-bold">180 <span className="font-normal text-white/40 text-xs">Following</span></span>
        </div>
      </div>

      {/* 3 OPTIONS TABS */}
      <div className="flex gap-2 mt-6 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-full p-1">
        {(['Posts','About','Settings'] as const).map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={`flex-1 py-2.5 rounded-full text-[11px] font-bold transition-all ${activeTab===t? 'bg-white text-black shadow' : 'text-white/50'}`}>{t}</button>
        ))}
      </div>

      {/* TAB 1: POSTS */}
      {activeTab==='Posts' && (
        <div className="grid grid-cols-3 gap-[5px] mt-4">
          {Array.from({length: 9}).map((_,i)=>(
            <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-white/[0.05] border border-white/5 relative group">
              <img src={`https://picsum.photos/seed/${i+55}/400/400`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px]">❤ 120</div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ABOUT - ALL INFO */}
      {activeTab==='About' && (
        <div className="mt-4 bg-white/[0.06] border border-white/10 rounded-[24px] p-4 space-y-3">
          {[
            {label:'Full Name', key:'name', ph:'Your name'},
            {label:'Bio', key:'bio', ph:'Write about you'},
            {label:'Location', key:'location', ph:'Dhaka, Bangladesh'},
            {label:'Website', key:'website', ph:'yourlink.com'},
            {label:'Gender', key:'gender', ph:'Male/Female'},
            {label:'Birthday', key:'birthday', ph:'01 Jan 2000'},
          ].map(f=>(
            <div key={f.key}>
              <p className="text-[10px] text-white/40 tracking-widest mb-1 ml-1">{f.label.toUpperCase()}</p>
              {isEditing? <input value={(userData as any)[f.key]} onChange={e=>setUserData({...userData, [f.key]: e.target.value})} placeholder={f.ph} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-300/50" />
              : <div className="w-full bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3 text-xs text-white/70">{(userData as any)[f.key] || 'Not set'}</div>}
            </div>
          ))}
          {isEditing && <button onClick={saveProfile} className="w-full py-3 rounded-full bg-cyan-400 text-black font-black text-xs mt-2">Save Changes</button>}
        </div>
      )}

      {/* TAB 3: SETTINGS - LANGUAGE + ALL */}
      {activeTab==='Settings' && (
        <div className="mt-4 space-y-3">
          <div className="bg-white/[0.06] border border-white/10 rounded-[24px] overflow-hidden">
            <p className="px-5 pt-4 text-[10px] tracking-widest text-white/30">GENERAL</p>
            {[
              {icon:'🌐', title:'Language', value: userData.language, action: ()=>{ const l = userData.language==='বাংলা'? 'English':'বাংলা'; setUserData({...userData, language:l}); }},
              {icon:'🔔', title:'Notifications', value:'On'},
              {icon:'🌙', title:'Dark Mode', value:'On'},
              {icon:'🔒', title:'Privacy & Safety', value:''},
              {icon:'🛡️', title:'Account Security', value:''},
              {icon:'💾', title:'Data Saver', value:'Off'},
            ].map(row=>(
              <div key={row.title} onClick={row.action} className="flex justify-between items-center px-5 py-4 border-b border-white/5 last:border-0 active:bg-white/5">
                <div className="flex items-center gap-3"><span>{row.icon}</span><span className="text-[13px] text-white/80">{row.title}</span></div>
                <div className="flex items-center gap-2"><span className="text-[11px] text-white/40">{row.value}</span><span className="text-white/20">›</span></div>
              </div>
            ))}
          </div>
          <div className="bg-white/[0.06] border border-white/10 rounded-[24px] overflow-hidden">
            <p className="px-5 pt-4 text-[10px] tracking-widest text-white/30">SUPPORT</p>
            {['Help Center','Report a Problem','About OneFeedBD','Terms & Policy'].map(t=>(
              <div key={t} className="flex justify-between items-center px-5 py-4 border-b border-white/5 last:border-0"><span className="text-[13px] text-white/70">{t}</span><span className="text-white/20">›</span></div>
            ))}
          </div>
          <button onClick={onLogout} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold">Log Out</button>
          <p className="text-center text-[10px] text-white/20 mt-2">OneFeedBD v1.0 • Made in Bangladesh 🇧🇩</p>
        </div>
      )}
    </div>
  )
}

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
    const unsub = onSnapshot(q, (snap)=> setPosts(snap.docs.map(d=> ({id:d.id,...d.data()} as Post))));
    return ()=>unsub();
  },[]);

  const handleLike = async (p: Post) => {
    if (isGuest) return alert('Like করতে Login লাগবে!');
    if (!currentUser) return;
    const ref = doc(db, 'posts', p.id);
    const liked = p.likes?.includes(currentUser.uid);
    await updateDoc(ref, { likes: liked? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid), likeCount: liked? p.likeCount-1 : p.likeCount+1 });
  };
  const handleCreate = async () => {
    if (!currentUser ||!newText.trim()) return;
    await addDoc(collection(db, 'posts'), { text: newText, image: `https://picsum.photos/seed/${Date.now()}/800/800`, videoUrl: '', userName: currentUser.email?.split('@')[0]||'User', userId: currentUser.uid, likeCount: 0, likes: [], mediaType: 'feed', timestamp: serverTimestamp() });
    setNewText(''); setShowCreate(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[430px] h-[100dvh] relative overflow-hidden bg-cover bg-center" style={{backgroundImage:`url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200)`}}>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative z-10 h-full flex flex-col p-3">
          <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/15 rounded-[20px] px-4 py-3 flex justify-between items-center">
            <span className="font-black text-white">OneFeedBD</span>
            <button onClick={onLogout} className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full text-white/60 border border-white/10">Logout</button>
          </div>
          {activeBottom==='Home' && (
            <div className="flex gap-2 mt-3">
              {['Feed','Short','Watch','Story'].map(k=>(
                <button key={k} onClick={()=>setTab(k)} className={`flex-1 py-2.5 rounded-full text-[11px] font-bold border ${tab===k? 'bg-cyan-400 text-black border-cyan-300' : 'bg-white/10 border-white/10 text-white/50'}`}>{k}</button>
              ))}
            </div>
          )}
          <div className="flex-1 mt-3 overflow-hidden flex flex-col">
            {activeBottom==='Profile'? <ProfilePage onLogout={onLogout} postsCount={posts.length} /> :
            <div className="flex-1 overflow-y-auto pb-28 space-y-4 no-scrollbar">
              {posts.map(p=>(
                <div key={p.id} className="rounded-[28px] overflow-hidden border border-white/15 bg-white/[0.06] backdrop-blur-2xl">
                  {p.image && <img src={p.image} className="w-full h-[420px] object-cover" />}
                  <div className="p-4"><p className="text-[13px] text-white/80">{p.text}</p><button onClick={()=>handleLike(p)} className={`mt-3 px-4 py-2 rounded-full text-[11px] font-bold border ${p.likes?.includes(currentUser?.uid||'')? 'bg-cyan-400 text-black':'bg-white/10 border-white/10 text-white/60'}`}>❤ {p.likeCount}</button></div>
                </div>
              ))}
            </div>}
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-white/[0.08] backdrop-blur-[30px] border border-white/15 rounded-[30px] flex justify-around items-center py-2.5">
            {[{k:'Home',i:'⌂'},{k:'Search',i:'◍'},{k:'Add',i:'+'},{k:'Inbox',i:'✉'},{k:'Profile',i:'◐'}].map(b=> b.k==='Add'? <button key={b.k} onClick={()=> isGuest? alert('Post করতে Login!') : setShowCreate(true)} className="w-12 h-12 rounded-full bg-cyan-400 text-black text-xl font-black shadow-[0_0_20px_rgba(34,211,238,0.8)]">+</button> : <button key={b.k} onClick={()=>setActiveBottom(b.k)} className={`flex flex-col items-center text-[10px] ${activeBottom===b.k? 'text-cyan-300':'text-white/40'}`}><span className="text-[18px]">{b.i}</span><span className="text-[9px] mt-1">{b.k}</span></button>)}
          </div>
        </div>
        {showCreate && <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"><div className="w-full bg-[#111]/90 border border-white/15 rounded-[28px] p-6"><h3 className="text-white font-bold mb-3">Create Post</h3><textarea value={newText} onChange={e=>setNewText(e.target.value)} className="w-full h-28 bg-white/10 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none resize-none"/><div className="flex gap-2 mt-4"><button onClick={()=>setShowCreate(false)} className="flex-1 py-3 rounded-full bg-white/10 text-white/60 text-sm">Cancel</button><button onClick={handleCreate} className="flex-1 py-3 rounded-full bg-cyan-400 text-black font-black text-sm">Post</button></div></div></div>}
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<'none'|'guest'|'auth'>('none');
  const [checking, setChecking] = useState(true);
  useEffect(()=>{ const unsub = onAuthStateChanged(auth, (u)=>{ if(u) setMode('auth'); else if(mode!=='guest') setMode('none'); setChecking(false); }); return ()=>unsub(); },[]);
  if(checking) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-300 text-sm">Loading OneFeedBD...</div>;
  if(mode==='none') return <AuthPage onGuest={()=>setMode('guest')} />;
  return <FeedApp mode={mode} onLogout={async()=>{ await signOut(auth); setMode('none'); }} />;
          }
