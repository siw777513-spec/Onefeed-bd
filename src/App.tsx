import React, { useState, useEffect } from 'react';
import { ColumnId, GiftOption, SocialItem, Transaction, UserProfile, UserSettings } from './types';
import { getStoredItems, saveStoredItems, getStoredProfile, saveStoredProfile, getStoredSettings, saveStoredSettings, getStoredCurrentUser, saveStoredCurrentUser, logoutCurrentUser, clearAllStorage, DEFAULT_PROFILE, DEFAULT_SETTINGS } from './utils/storage';
import { PhoneContainer } from './components/PhoneContainer';
import { TopBar } from './components/TopBar';
import { ColumnsContainer } from './components/ColumnsContainer';
import { BottomNav } from './components/BottomNav';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { NotificationModal } from './components/NotificationModal';
import { SearchModal } from './components/SearchModal';
import { SettingsModal, SettingsTab } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ReportModal } from './components/ReportModal';
import { ExportModal } from './components/ExportModal';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { FriendsModal } from './components/FriendsModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { WalletModal } from './components/WalletModal';
import { GiftModal } from './components/GiftModal';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [items, setItems] = useState<SocialItem[]>(() => getStoredItems());
  const [profile, setProfile] = useState<UserProfile>(() => getStoredCurrentUser() || getStoredProfile());
  const [settings, setSettings] = useState<UserSettings>(() => getStoredSettings());
  const [activeColumn, setActiveColumn] = useState<ColumnId | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<SocialItem | null>(null);
  const [selectedSharePost, setSelectedSharePost] = useState<SocialItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDefaultColumn, setCreateDefaultColumn] = useState<ColumnId>('feed');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsDefaultTab, setSettingsDefaultTab] = useState<SettingsTab>('profile');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [friendsDefaultTab, setFriendsDefaultTab] = useState<'friends' | 'followers' | 'subscribers'>('friends');
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedGiftPost, setSelectedGiftPost] = useState<SocialItem | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<UserProfile | null>(null);
  const [selectedReportPost, setSelectedReportPost] = useState<SocialItem | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const activeUser = currentUser || profile;
  const isOwner = (activeUser?.email || '').toLowerCase().trim() === 'siw777513@gmail.com';

  // 🔥 LIVE FIREBASE
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const fbPosts = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          column: data.column || 'feed',
          text: data.text || '',
          image: data.image || data.videoUrl || '',
          videoUrl: data.videoUrl || null,
          mediaType: data.mediaType || (data.videoUrl ? 'video' : 'image'),
          likeCount: data.likeCount || 0,
          views: data.views || 0,
          commentCount: data.commentCount || 0,
          isLiked: false,
          timestamp: 'Just now',
          author: { name: data.userName || 'User', handle: data.userHandle || '@user', avatar: data.userAvatar || `https://i.pravatar.cc/150?u=${data.userId}`, verified: false, online: true, isFollowing: false },
          tags: ['#onefeed'], comments: [], messages: []
        } as unknown as SocialItem;
      });
      if (fbPosts.length > 0) {
        setItems(prev => {
          const mocks = getStoredItems().filter(m => !fbPosts.some(f => f.text === m.text));
          return [...fbPosts, ...mocks];
        });
      }
    });
    return () => unsub();
  }, []);

  const handleOpenProfile = (u?: UserProfile) => { setSelectedProfileUser(u || activeUser); setIsProfileOpen(true); };
  const handleLoginSuccess = (user: UserProfile) => { setCurrentUser(user); setProfile(user); saveStoredCurrentUser(user); saveStoredProfile(user); };
  const handleLogout = () => { logoutCurrentUser(); setCurrentUser(null); };
  const handleLikeToggle = (id: string) => { setItems(p => p.map(i => i.id === id ? { ...i, isLiked: !i.isLiked, likeCount: !i.isLiked ? i.likeCount + 1 : Math.max(0, i.likeCount - 1) } : i)); };
  const handleFollowToggle = (h: string) => { setItems(p => p.map(i => i.author.handle === h ? { ...i, author: { ...i.author, isFollowing: !i.author.isFollowing } } : i)); };
  
  if (!currentUser) return <LoginModal onLoginSuccess={handleLoginSuccess} />;

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden">
        <TopBar onOpenCreate={() => { setCreateDefaultColumn('feed'); setIsCreateOpen(true); }} onOpenNotifications={() => setIsNotifOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} onOpenSettings={(t) => { setSettingsDefaultTab(t as any); setIsSettingsOpen(true); }} onOpenProfile={() => handleOpenProfile()} onOpenWallet={() => setIsWalletOpen(true)} onOpenFriends={(t) => { setFriendsDefaultTab(t as any); setIsFriendsOpen(true); }} onOpenDailyReward={() => setIsDailyRewardOpen(true)} onLogout={handleLogout} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} unreadCount={2} currentUser={activeUser} />
        <div className="flex-1 flex w-full min-h-0 overflow-hidden">
          <LeftSidebar currentUser={activeUser} onOpenDailyReward={()=>setIsDailyRewardOpen(true)} onOpenWallet={()=>setIsWalletOpen(true)} onOpenFriends={()=>setIsFriendsOpen(true)} />
          <ColumnsContainer activeColumn={activeColumn} items={items} currentUser={activeUser} onLikeToggle={handleLikeToggle} onOpenDetail={setSelectedPost} onSendMessage={()=>{}} onOpenCreateForColumn={(c)=>{setCreateDefaultColumn(c); setIsCreateOpen(true);}} onOpenShare={setSelectedSharePost} onFollowToggle={handleFollowToggle} onOpenReport={setSelectedReportPost} onOpenGift={setSelectedGiftPost} />
          <RightSidebar onFollowToggle={handleFollowToggle} onOpenChatWithUser={()=>setActiveColumn('chat')} />
        </div>
        <BottomNav activeColumn={activeColumn} onSelectColumn={setActiveColumn} unreadChats={0} />
        <CreatePostModal isOpen={isCreateOpen} onClose={()=>setIsCreateOpen(false)} onSubmitPost={(n)=>setItems(p=>[n,...p])} defaultColumn={createDefaultColumn} currentUser={activeUser} />
        <PostDetailModal item={selectedPost} onClose={()=>setSelectedPost(null)} onLikeToggle={handleLikeToggle} onAddComment={()=>{}} onShareOpen={setSelectedSharePost} onOpenReport={setSelectedReportPost} />
        <NotificationModal isOpen={isNotifOpen} onClose={()=>setIsNotifOpen(false)} />
        <SearchModal isOpen={isSearchOpen} onClose={()=>setIsSearchOpen(false)} items={items} onSelectPost={setSelectedPost} />
        <SettingsModal isOpen={isSettingsOpen} onClose={()=>setIsSettingsOpen(false)} profile={profile} currentUser={activeUser} settings={settings} initialTab={settingsDefaultTab} onSaveProfile={(u)=>{setProfile(u); setCurrentUser(u); saveStoredCurrentUser(u);}} onSaveSettings={setSettings} onResetData={()=>{}} onLogout={handleLogout} onDeleteAccount={()=>{}} />
        <ProfileModal isOpen={isProfileOpen} onClose={()=>setIsProfileOpen(false)} targetUser={selectedProfileUser || activeUser} currentUser={activeUser} items={items} onLikeToggle={handleLikeToggle} onOpenDetail={setSelectedPost} onOpenSettings={()=>{setIsProfileOpen(false); setIsSettingsOpen(true);}} onOpenFriends={()=>setIsFriendsOpen(true)} onFollowUser={handleFollowToggle} />
        <FriendsModal isOpen={isFriendsOpen} onClose={()=>setIsFriendsOpen(false)} currentUser={activeUser} initialTab={friendsDefaultTab} onOpenProfileWithUser={(u)=>{setIsFriendsOpen(false); handleOpenProfile(u);}} onOpenChatWithUser={()=>{setIsFriendsOpen(false); setActiveColumn('chat');}} />
        <ShareModal item={selectedSharePost} onClose={()=>setSelectedSharePost(null)} lang={settings.language} />
        <ReportModal item={selectedReportPost} onClose={()=>setSelectedReportPost(null)} onConfirmReport={()=>{}} />
        <DailyRewardModal isOpen={isDailyRewardOpen} onClose={()=>setIsDailyRewardOpen(false)} currentUser={activeUser} onClaimReward={()=>{}} />
        <WalletModal isOpen={isWalletOpen} onClose={()=>setIsWalletOpen(false)} coinBalance={activeUser.coinBalance ?? 500} transactions={transactions} onBuyCoins={()=>{}} />
        <GiftModal isOpen={!!selectedGiftPost} onClose={()=>setSelectedGiftPost(null)} item={selectedGiftPost} userCoins={activeUser.coinBalance ?? 500} onSendGift={()=>{}} onOpenBuyCoins={()=>{setSelectedGiftPost(null); setIsWalletOpen(true);}} />
      </div>
    </PhoneContainer>
  );
    }
