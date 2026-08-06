console.log("ONEFEED V16 SAFE", Date.now());
import React, { useState, useEffect } from 'react';
import { ColumnId, SocialItem, UserProfile, UserSettings } from './types';
import { getStoredItems, getStoredProfile, getStoredCurrentUser, saveStoredCurrentUser } from './utils/storage';
import { PhoneContainer } from './components/PhoneContainer';
import { TopBar } from './components/TopBar';
import { ColumnsContainer } from './components/ColumnsContainer';
import { BottomNav } from './components/BottomNav';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { NotificationModal } from './components/NotificationModal';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { ReportModal } from './components/ReportModal';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { FriendsModal } from './components/FriendsModal';
import { WalletModal } from './components/WalletModal';
import { GiftModal } from './components/GiftModal';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [items, setItems] = useState<SocialItem[]>(() => getStoredItems());
  const [profile] = useState(() => getStoredProfile());
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

  useEffect(() => {
    try {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsub = onSnapshot(q, (snap) => {
        const fbPosts = snap.docs.map(d => {
          const data = d.data() as any;
          return { id: d.id, column: data.column || 'feed', text: data.text || '', image: data.image || data.videoUrl || '', videoUrl: data.videoUrl || null, mediaType: data.mediaType || 'image', likeCount: data.likeCount || 0, views: data.views || 0, commentCount: 0, isLiked: false, timestamp: 'Just now', author: { name: data.userName || 'User', handle: data.userHandle || '@user', avatar: data.userAvatar || '', verified: false, online: true, isFollowing: false }, tags: [], comments: [], messages: [], userId: data.userId } as any;
        });
        if (fbPosts.length > 0) setItems(fbPosts);
      }, (err) => { console.error("Firebase error", err); });
      return () => unsub();
    } catch (e) { console.error(e); }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => { setCurrentUser(user); saveStoredCurrentUser(user); };

  if (!currentUser) return <LoginModal onLoginSuccess={handleLoginSuccess} />;

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden">
        <TopBar currentUser={activeUser} unreadCount={0} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} onOpenCreate={()=>{setCreateDefaultColumn('feed'); setIsCreateOpen(true);}} onOpenNotifications={()=>setIsNotifOpen(true)} onOpenSearch={()=>setIsSearchOpen(true)} onOpenSettings={()=>setIsSettingsOpen(true)} onOpenProfile={()=>setIsProfileOpen(true)} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} onOpenDailyReward={()=>{}} onLogout={()=>{localStorage.clear(); location.reload();}} />
        <div className="flex-1 flex w-full min-h-0 overflow-hidden">
          <LeftSidebar currentUser={activeUser} onOpenDailyReward={()=>{}} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} />
          <ColumnsContainer activeColumn={activeColumn} items={items} currentUser={activeUser} onLikeToggle={(id)=>setItems(p=>p.map(i=>i.id===id?{...i,isLiked:!i.isLiked,likeCount:i.isLiked?i.likeCount-1:i.likeCount+1}:i))} onOpenDetail={setSelectedPost} onSendMessage={()=>{}} onOpenCreateForColumn={(c)=>{setCreateDefaultColumn(c); setIsCreateOpen(true);}} onOpenShare={setSelectedSharePost} onFollowToggle={()=>{}} onOpenReport={setSelectedReportPost} onOpenGift={setSelectedGiftPost} />
          <RightSidebar onFollowToggle={()=>{}} onOpenChatWithUser={()=>setActiveColumn('chat')} />
        </div>
        <BottomNav activeColumn={activeColumn} onSelectColumn={setActiveColumn} unreadChats={0} />
        <CreatePostModal isOpen={isCreateOpen} onClose={()=>setIsCreateOpen(false)} onSubmitPost={(n:any)=>setItems(p=>[n,...p])} defaultColumn={createDefaultColumn} currentUser={activeUser} />
        {selectedPost && <PostDetailModal item={selectedPost} onClose={()=>setSelectedPost(null)} onLikeToggle={()=>{}} onAddComment={()=>{}} onShareOpen={setSelectedSharePost} onOpenReport={setSelectedReportPost} onOpenGift={setSelectedGiftPost} onOpenTip={setSelectedGiftPost} onSubscribeCreator={()=>{}} onDeletePost={async(id)=>{try{await deleteDoc(doc(db,"posts",id));}catch{}; setItems(p=>p.filter(x=>x.id!==id)); setSelectedPost(null);}} currentUserHandle={activeUser.handle} isOwner={true} />}
        <NotificationModal isOpen={isNotifOpen} onClose={()=>setIsNotifOpen(false)} />
        <SearchModal isOpen={isSearchOpen} onClose={()=>setIsSearchOpen(false)} items={items} onSelectPost={setSelectedPost} />
        <SettingsModal isOpen={isSettingsOpen} onClose={()=>setIsSettingsOpen(false)} profile={activeUser} currentUser={activeUser} settings={{} as any} initialTab={'profile'} onSaveProfile={()=>{}} onSaveSettings={()=>{}} onResetData={()=>{}} onLogout={()=>{localStorage.clear(); location.reload();}} onDeleteAccount={()=>{}} />
        <ProfileModal isOpen={isProfileOpen} onClose={()=>setIsProfileOpen(false)} targetUser={activeUser} currentUser={activeUser} items={items} onLikeToggle={()=>{}} onOpenDetail={setSelectedPost} onOpenSettings={()=>{}} onOpenFriends={()=>setIsFriendsOpen(true)} onFollowUser={()=>{}} />
        <FriendsModal isOpen={isFriendsOpen} onClose={()=>setIsFriendsOpen(false)} currentUser={activeUser} initialTab={'friends'} onOpenProfileWithUser={()=>{}} onOpenChatWithUser={()=>{}} />
        <ShareModal item={selectedSharePost} onClose={()=>setSelectedSharePost(null)} lang={'en' as any} />
        <ReportModal item={selectedReportPost} onClose={()=>setSelectedReportPost(null)} onConfirmReport={()=>{}} />
        <WalletModal isOpen={isWalletOpen} onClose={()=>setIsWalletOpen(false)} coinBalance={500} transactions={[]} onBuyCoins={()=>{}} />
        <GiftModal isOpen={!!selectedGiftPost} onClose={()=>setSelectedGiftPost(null)} item={selectedGiftPost} userCoins={500} onSendGift={()=>{}} onOpenBuyCoins={()=>{}} />
      </div>
    </PhoneContainer>
  );
    }
