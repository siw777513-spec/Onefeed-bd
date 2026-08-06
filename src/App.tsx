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
  const [profile] = useState(()=>{try{return getStoredProfile()}catch{return {name:'Sakib',handle:'@sakib',avatar:'https://i.pravatar.cc/150?u=sakib'} as any}});
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
  const isGuest = (currentUser as any)?.isGuest || localStorage.getItem('onefeed_isGuest')==='true';

  const guardGuest = (action='do this')=>{
    if(isGuest){
      alert(`🚫 Guest Mode - View Only!\n\nPlease Sign Up / Login to ${action}\n\nGuest can only view, cannot Like, Comment, Post or Follow.`);
      return true;
    }
    return false;
  };

  useEffect(()=>{
    try{
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsub = onSnapshot(q, (snap)=>{
        const fb = snap.docs.map(d=>{
          const data=d.data() as any;
          return {id:d.id,column:data.column||'feed',text:data.text||'',image:data.image||data.videoUrl||'',videoUrl:data.videoUrl||null,mediaType:'image',likeCount:data.likeCount||0,views:0,commentCount:0,isLiked:false,timestamp:'Just now',author:{name:data.userName||'User',handle:data.userHandle||'@user',avatar:data.userAvatar||'',verified:false,online:true,isFollowing:false},tags:[],comments:[],messages:[],userId:data.userId} as any;
        });
        if(fb.length>0) setItems(fb);
      });
      return ()=>unsub();
    }catch{}
  },[]);

  const handleLogin = (u:UserProfile)=>{
    localStorage.removeItem('onefeed_isGuest');
    setCurrentUser(u);
    saveStoredCurrentUser(u);
  };
  const handleGuest = ()=>{
    const guest={name:'Guest Viewer',handle:'@guest',avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',verified:false,isGuest:true, email:'guest@onefeed.com'} as any;
    localStorage.setItem('onefeed_isGuest','true');
    setCurrentUser(guest);
    saveStoredCurrentUser(guest);
  };

  const handleLogout = ()=>{
    localStorage.removeItem('onefeed_isGuest');
    localStorage.removeItem('onefeed_currentUser');
    location.reload();
  };

  if(!currentUser){
    return <LoginModal onLoginSuccess={handleLogin} onGuest={handleGuest} />;
  }

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden">
        <EB><TopBar currentUser={activeUser} unreadCount={0} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} onOpenCreate={()=>{ if(guardGuest('create posts')) return; setCreateDefaultColumn('feed'); setIsCreateOpen(true);}} onOpenNotifications={()=>setIsNotifOpen(true)} onOpenSearch={()=>setIsSearchOpen(true)} onOpenSettings={()=>setIsSettingsOpen(true)} onOpenProfile={()=>setIsProfileOpen(true)} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} onOpenDailyReward={()=>{}} onLogout={handleLogout} /></EB>
        <div className="flex-1 flex w-full min-h-0 overflow-hidden">
          <EB><LeftSidebar currentUser={activeUser} onOpenDailyReward={()=>{}} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} /></EB>
          <EB><ColumnsContainer activeColumn={activeColumn} items={items} currentUser={activeUser} onLikeToggle={(id)=>{ if(guardGuest('like posts')) return; setItems(p=>p.map(i=>i.id===id?{...i,isLiked:!i.isLiked,likeCount:i.isLiked?i.likeCount-1:i.likeCount+1}:i))}} onOpenDetail={setSelectedPost} onSendMessage={()=>{ if(guardGuest('send messages')) return;}} onOpenCreateForColumn={(c)=>{ if(guardGuest('create posts')) return; setCreateDefaultColumn(c); setIsCreateOpen(true);}} onOpenShare={setSelectedSharePost} onFollowToggle={()=>{ if(guardGuest('follow users')) return;}} onOpenReport={setSelectedReportPost} onOpenGift={(p)=>{ if(guardGuest('send gifts')) return; setSelectedGiftPost(p);}} /></EB>
          <EB><RightSidebar onFollowToggle={()=>{ if(guardGuest('follow users')) return;}} onOpenChatWithUser={()=>setActiveColumn('chat' as any)} /></EB>
        </div>
        <EB><BottomNav activeColumn={activeColumn} onSelectColumn={setActiveColumn} unreadChats={0} /></EB>
        <React.Suspense fallback={null}>
          {isCreateOpen && <EB><CreatePostModal isOpen={isCreateOpen} onClose={()=>setIsCreateOpen(false)} onSubmitPost={(n:any)=>{ if(guardGuest('create posts')) return; setItems(p=>[n,...p])}} defaultColumn={createDefaultColumn} currentUser={activeUser} /></EB>}
          {selectedPost && <EB><PostDetailModal item={selectedPost} onClose={()=>setSelectedPost(null)} onLikeToggle={()=>{ if(guardGuest('like posts')) return;}} onAddComment={()=>{ if(guardGuest('comment')) return;}} onShareOpen={setSelectedSharePost} onOpenReport={setSelectedReportPost} onOpenGift={setSelectedGiftPost} onOpenTip={setSelectedGiftPost} onSubscribeCreator={()=>{}} onDeletePost={async(id)=>{try{await deleteDoc(doc(db,"posts",id));}catch{}; setItems(p=>p.filter(x=>x.id!==id)); setSelectedPost(null);}} currentUserHandle={activeUser.handle} isOwner={!isGuest} /></EB>}
          {isNotifOpen && <EB><NotificationModal isOpen={isNotifOpen} onClose={()=>setIsNotifOpen(false)} /></EB>}
          {isSearchOpen && <EB><SearchModal isOpen={isSearchOpen} onClose={()=>setIsSearchOpen(false)} items={items} onSelectPost={setSelectedPost} /></EB>}
          {isSettingsOpen && <EB><SettingsModal isOpen={isSettingsOpen} onClose={()=>setIsSettingsOpen(false)} profile={activeUser} currentUser={activeUser} settings={{} as any} initialTab={'profile'} onSaveProfile={()=>{}} onSaveSettings={()=>{}} onResetData={()=>{}} onLogout={handleLogout} onDeleteAccount={()=>{}} /></EB>}
          {isProfileOpen && <EB><ProfileModal isOpen={isProfileOpen} onClose={()=>setIsProfileOpen(false)} targetUser={activeUser} currentUser={activeUser} items={items} onLikeToggle={()=>{}} onOpenDetail={setSelectedPost} onOpenSettings={()=>setIsSettingsOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} onFollowUser={()=>{}} /></EB>}
          {isFriendsOpen && <EB><FriendsModal isOpen={isFriendsOpen} onClose={()=>setIsFriendsOpen(false)} currentUser={activeUser} initialTab={'friends'} onOpenProfileWithUser={()=>{}} onOpenChatWithUser={()=>{}} /></EB>}
          {selectedSharePost && <EB><ShareModal item={selectedSharePost} onClose={()=>setSelectedSharePost(null)} lang={'en' as any} /></EB>}
          {selectedReportPost && <EB><ReportModal item={selectedReportPost} onClose={()=>setSelectedReportPost(null)} onConfirmReport={()=>{}} /></EB>}
          {isWalletOpen && <EB><WalletModal isOpen={isWalletOpen} onClose={()=>setIsWalletOpen(false)} coinBalance={isGuest?0:500} transactions={[]} onBuyCoins={()=>{ if(guardGuest('buy coins')) return;}} /></EB>}
          {selectedGiftPost && <EB><GiftModal isOpen={!!selectedGiftPost} onClose={()=>setSelectedGiftPost(null)} item={selectedGiftPost} userCoins={isGuest?0:500} onSendGift={()=>{ if(guardGuest('send gifts')) return;}} onOpenBuyCoins={()=>{}} /></EB>}
        </React.Suspense>

        {isGuest && <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[11px] font-bold z-[9999]">👁️ Guest View Only - Sign Up to Like/Comment</div>}
      </div>
    </PhoneContainer>
  );
  }
