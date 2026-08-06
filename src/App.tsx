import React, { useState, useEffect } from 'react';
import { ColumnId, SocialItem, UserProfile } from './types';
import { getStoredItems, getStoredProfile, getStoredCurrentUser, saveStoredCurrentUser } from './utils/storage';
import { PhoneContainer } from './components/PhoneContainer';
import { TopBar } from './components/TopBar';
import { ColumnsContainer } from './components/ColumnsContainer';
import { BottomNav } from './components/BottomNav';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { LoginModal } from './components/LoginModal';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

const CreatePostModal = React.lazy(() => import('./components/CreatePostModal').then(m=>({default:m.CreatePostModal})));
const PostDetailModal = React.lazy(() => import('./components/PostDetailModal').then(m=>({default:m.PostDetailModal})));
const NotificationModal = React.lazy(() => import('./components/NotificationModal').then(m=>({default:m.NotificationModal})));
const SearchModal = React.lazy(() => import('./components/SearchModal').then(m=>({default:m.SearchModal})));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(m=>({default:m.SettingsModal})));
const ShareModal = React.lazy(() => import('./components/ShareModal').then(m=>({default:m.ShareModal})));
const ReportModal = React.lazy(() => import('./components/ReportModal').then(m=>({default:m.ReportModal})));
const ProfileModal = React.lazy(() => import('./components/ProfileModal').then(m=>({default:m.ProfileModal})));
const FriendsModal = React.lazy(() => import('./components/FriendsModal').then(m=>({default:m.FriendsModal})));
const WalletModal = React.lazy(() => import('./components/WalletModal').then(m=>({default:m.WalletModal})));
const GiftModal = React.lazy(() => import('./components/GiftModal').then(m=>({default:m.GiftModal})));

class EB extends React.Component<any,any>{state={hasError:false};static getDerivedStateFromError(){return {hasError:true}};render(){return this.state.hasError?null:this.props.children}}

export default function App(){
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(()=>{try{return getStoredCurrentUser()}catch{return null}});
  const [items, setItems] = useState<SocialItem[]>(()=>{try{return getStoredItems()}catch{return []}});
  const [profile] = useState(()=>{try{return getStoredProfile()}catch{return {name:'Sakib',handle:'@sakib',avatar:''} as any}});
  const [activeColumn, setActiveColumn] = useState<ColumnId | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<SocialItem | null>(null);
  const [selectedSharePost, setSelectedSharePost] = useState<SocialItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDefaultColumn, setCreateDefaultColumn] = useState<ColumnId>('feed');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedGiftPost, setSelectedGiftPost] = useState<SocialItem | null>(null);
  const [selectedReportPost, setSelectedReportPost] = useState<SocialItem | null>(null);
  const activeUser = currentUser || profile;

  useEffect(()=>{
    try{
      if((db as any)?._offline) return;
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsub = onSnapshot(q, (snap)=>{
        const fb = snap.docs.map(d=>{const data=d.data() as any; return {id:d.id,column:data.column||'feed',text:data.text||'',image:data.image||data.videoUrl||'',videoUrl:data.videoUrl||null,mediaType:'image',likeCount:data.likeCount||0,views:0,commentCount:0,isLiked:false,timestamp:'Just now',author:{name:data.userName||'User',handle:data.userHandle||'@user',avatar:data.userAvatar||'',verified:false,online:true,isFollowing:false},tags:[],comments:[],messages:[],userId:data.userId} as any;});
        if(fb.length>0) setItems(fb);
      });
      return ()=>unsub();
    }catch{}
  },[]);

  const handleLogin = (u:UserProfile)=>{setCurrentUser(u); saveStoredCurrentUser(u);};
  const handleGuest = ()=>{const guest={name:'Sakib Guest',handle:'@sakib',avatar:'',verified:true} as any; handleLogin(guest);};

  if(!currentUser){
    return (
      <div className="relative w-full h-screen bg-[#0A0A0F]">
        <LoginModal onLoginSuccess={handleLogin} />
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2">
          <button onClick={handleGuest} className="bg-white text-black px-6 py-3 rounded-full font-bold">Continue as Guest (Bypass)</button>
          <div className="text-white text-xs text-center">Firebase key না থাকলে Guest এ ক্লিক করো</div>
        </div>
      </div>
    );
  }

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden">
        <EB><TopBar currentUser={activeUser} unreadCount={0} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} onOpenCreate={()=>{setCreateDefaultColumn('feed'); setIsCreateOpen(true);}} onOpenNotifications={()=>setIsNotifOpen(true)} onOpenSearch={()=>setIsSearchOpen(true)} onOpenSettings={()=>setIsSettingsOpen(true)} onOpenProfile={()=>setIsProfileOpen(true)} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} onOpenDailyReward={()=>{}} onLogout={()=>{localStorage.clear(); location.reload();}} /></EB>
        <div className="flex-1 flex w-full min-h-0 overflow-hidden">
          <EB><LeftSidebar currentUser={activeUser} onOpenDailyReward={()=>{}} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} /></EB>
          <EB><ColumnsContainer activeColumn={activeColumn} items={items} currentUser={activeUser} onLikeToggle={(id)=>setItems(p=>p.map(i=>i.id===id?{...i,isLiked:!i.isLiked,likeCount:i.isLiked?i.likeCount-1:i.likeCount+1}:i))} onOpenDetail={setSelectedPost} onSendMessage={()=>{}} onOpenCreateForColumn={(c)=>{setCreateDefaultColumn(c); setIsCreateOpen(true);}} onOpenShare={setSelectedSharePost} onFollowToggle={()=>{}} onOpenReport={setSelectedReportPost} onOpenGift={setSelectedGiftPost} /></EB>
          <EB><RightSidebar onFollowToggle={()=>{}} onOpenChatWithUser={()=>setActiveColumn('chat')} /></EB>
        </div>
        <EB><BottomNav activeColumn={activeColumn} onSelectColumn={setActiveColumn} unreadChats={0} /></EB>
        <React.Suspense fallback={null}>
          {isCreateOpen && <EB><CreatePostModal isOpen={isCreateOpen} onClose={()=>setIsCreateOpen(false)} onSubmitPost={(n:any)=>setItems(p=>[n,...p])} defaultColumn={createDefaultColumn} currentUser={activeUser} /></EB>}
          {selectedPost && <EB><PostDetailModal item={selectedPost} onClose={()=>setSelectedPost(null)} onLikeToggle={()=>{}} onAddComment={()=>{}} onShareOpen={setSelectedSharePost} onOpenReport={setSelectedReportPost} onOpenGift={setSelectedGiftPost} onOpenTip={setSelectedGiftPost} onSubscribeCreator={()=>{}} onDeletePost={async(id)=>{try{await deleteDoc(doc(db,"posts",id));}catch{}; setItems(p=>p.filter(x=>x.id!==id)); setSelectedPost(null);}} currentUserHandle={activeUser.handle} isOwner={true} /></EB>}
          {isNotifOpen && <EB><NotificationModal isOpen={isNotifOpen} onClose={()=>setIsNotifOpen(false)} /></EB>}
          {isSearchOpen && <EB><SearchModal isOpen={isSearchOpen} onClose={()=>setIsSearchOpen(false)} items={items} onSelectPost={setSelectedPost} /></EB>}
          {isSettingsOpen && <EB><SettingsModal isOpen={isSettingsOpen} onClose={()=>setIsSettingsOpen(false)} profile={activeUser} currentUser={activeUser} settings={{} as any} initialTab={'profile'} onSaveProfile={()=>{}} onSaveSettings={()=>{}} onResetData={()=>{}} onLogout={()=>{localStorage.clear(); location.reload();}} onDeleteAccount={()=>{}} /></EB>}
          {isProfileOpen && <EB><ProfileModal isOpen={isProfileOpen} onClose={()=>setIsProfileOpen(false)} targetUser={activeUser} currentUser={activeUser} items={items} onLikeToggle={()=>{}} onOpenDetail={setSelectedPost} onOpenSettings={()=>setIsSettingsOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} onFollowUser={()=>{}} /></EB>}
          {isFriendsOpen && <EB><FriendsModal isOpen={isFriendsOpen} onClose={()=>setIsFriendsOpen(false)} currentUser={activeUser} initialTab={'friends'} onOpenProfileWithUser={()=>{}} onOpenChatWithUser={()=>{}} /></EB>}
          {selectedSharePost && <EB><ShareModal item={selectedSharePost} onClose={()=>setSelectedSharePost(null)} lang={'en' as any} /></EB>}
          {selectedReportPost && <EB><ReportModal item={selectedReportPost} onClose={()=>setSelectedReportPost(null)} onConfirmReport={()=>{}} /></EB>}
          {isWalletOpen && <EB><WalletModal isOpen={isWalletOpen} onClose={()=>setIsWalletOpen(false)} coinBalance={500} transactions={[]} onBuyCoins={()=>{}} /></EB>}
          {selectedGiftPost && <EB><GiftModal isOpen={!!selectedGiftPost} onClose={()=>setSelectedGiftPost(null)} item={selectedGiftPost} userCoins={500} onSendGift={()=>{}} onOpenBuyCoins={()=>{}} /></EB>}
        </React.Suspense>

        {/* FLOATING SETTINGS BUTTON - V27 FIX */}
        <button onClick={()=>setIsSettingsOpen(true)} style={{position:'fixed',top:70,right:12,background:'linear-gradient(90deg,#1877F2,#FF0000)',color:'white',padding:'10px 14px',borderRadius:999,zIndex:99999,fontSize:12,fontWeight:'900',boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>⚙️ SETTINGS FB/TT/YT</button>

        <div style={{position:'fixed',bottom:5,left:5,background:'#00ff00',color:'black',padding:'2px 6px',fontSize:10,zIndex:99999}}>V27 SETTINGS FB+TT+YT+STUDIO</div>
      </div>
    </PhoneContainer>
  );
  }
