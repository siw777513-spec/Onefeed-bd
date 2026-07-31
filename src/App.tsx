import React, { useState, useEffect } from 'react';
import { ColumnId, GiftOption, SocialItem, Transaction, UserProfile, UserSettings } from './types';
import {
  getStoredItems,
  saveStoredItems,
  getStoredProfile,
  saveStoredProfile,
  getStoredSettings,
  saveStoredSettings,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  logoutCurrentUser,
  clearAllStorage,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
} from './utils/storage';
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

const AUTO_REPLIES = [
  'Hey! Thanks for messaging. That looks amazing! 🔥',
  'Got your message! Let me review this and get back to you in a bit 🚀',
  'Super cool! Always love checking out new OneFeed updates ✨',
  'অসাধারণ! মেসেজের জন্য ধন্যবাদ। দারুণ কাজ হচ্ছে!',
  'Thanks! Let’s stay connected on OneFeed 💫',
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [items, setItems] = useState<SocialItem[]>(() => getStoredItems());
  const [profile, setProfile] = useState<UserProfile>(() => {
    const user = getStoredCurrentUser();
    return user || getStoredProfile();
  });
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

  const handleOpenSettings = (tab: SettingsTab = 'profile') => {
    setSettingsDefaultTab(tab);
    setIsSettingsOpen(true);
  };
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [friendsDefaultTab, setFriendsDefaultTab] = useState<'friends' | 'followers' | 'subscribers'>('friends');
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);

  const handleOpenFriends = (tab: 'friends' | 'followers' | 'subscribers' = 'friends') => {
    setFriendsDefaultTab(tab);
    setIsFriendsOpen(true);
  };
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedGiftPost, setSelectedGiftPost] = useState<SocialItem | null>(null);

  const [selectedProfileUser, setSelectedProfileUser] = useState<UserProfile | null>(null);
  const [selectedReportPost, setSelectedReportPost] = useState<SocialItem | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Determine owner status securely
  const activeUser = currentUser || profile;
  const isOwner = (activeUser?.email || '').toLowerCase().trim() === 'siw777513@gmail.com';

  const handleOpenProfile = (userToView?: UserProfile) => {
    setSelectedProfileUser(userToView || activeUser);
    setIsProfileOpen(true);
  };

  const handleDeleteAccount = () => {
    clearAllStorage();
    setCurrentUser(null);
    setIsSettingsOpen(false);
    setIsAdminOpen(false);
    setIsExportOpen(false);
    setIsProfileOpen(false);
    setIsDailyRewardOpen(false);
    setIsWalletOpen(false);
  };

  // Sync state changes to localStorage
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setProfile(user);
    saveStoredCurrentUser(user);
    saveStoredProfile(user);
  };

  const handleLogout = () => {
    logoutCurrentUser();
    setCurrentUser(null);
    setIsSettingsOpen(false);
    setIsAdminOpen(false);
    setIsExportOpen(false);
    setIsDailyRewardOpen(false);
    setIsWalletOpen(false);
  };

  // Claim Daily Streak Coins
  const handleClaimReward = (rewardCoins: number) => {
    const updatedUser = {
      ...activeUser,
      coinBalance: (activeUser.coinBalance ?? 500) + rewardCoins,
    };
    setCurrentUser(updatedUser);
    setProfile(updatedUser);
    saveStoredCurrentUser(updatedUser);
    saveStoredProfile(updatedUser);

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'reward',
        title: '🔥 Daily Streak Reward',
        amountCoins: rewardCoins,
        timestamp: 'Just now',
        status: 'completed',
      },
      ...prev,
    ]);
  };

  // Wallet Coin Refill
  const handleBuyCoins = (coinAmount: number, priceDollars: number, paymentMethod: string) => {
    const updatedUser = {
      ...activeUser,
      coinBalance: (activeUser.coinBalance ?? 500) + coinAmount,
    };
    setCurrentUser(updatedUser);
    setProfile(updatedUser);
    saveStoredCurrentUser(updatedUser);
    saveStoredProfile(updatedUser);

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'purchase',
        title: `Coins Purchase via ${paymentMethod.toUpperCase()}`,
        amountCoins: coinAmount,
        amountDollars: priceDollars,
        timestamp: 'Just now',
        status: 'completed',
      },
      ...prev,
    ]);
  };

  // Send Gift Handler
  const handleSendGift = (gift: GiftOption, recipientHandle: string, itemId?: string) => {
    const updatedUser = {
      ...activeUser,
      coinBalance: Math.max(0, (activeUser.coinBalance ?? 500) - gift.coinPrice),
    };
    setCurrentUser(updatedUser);
    setProfile(updatedUser);
    saveStoredCurrentUser(updatedUser);
    saveStoredProfile(updatedUser);

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'gift',
        title: `Sent ${gift.name} ${gift.icon} to ${recipientHandle}`,
        amountCoins: -gift.coinPrice,
        timestamp: 'Just now',
        status: 'completed',
      },
      ...prev,
    ]);
  };

  // Toggle Like state on any item
  const handleLikeToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLikedNow = !item.isLiked;
          return {
            ...item,
            isLiked: isLikedNow,
            likeCount: isLikedNow ? item.likeCount + 1 : Math.max(0, item.likeCount - 1),
          };
        }
        return item;
      })
    );

    // Keep detail modal in sync
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) => {
        if (!prev) return null;
        const isLikedNow = !prev.isLiked;
        return {
          ...prev,
          isLiked: isLikedNow,
          likeCount: isLikedNow ? prev.likeCount + 1 : Math.max(0, prev.likeCount - 1),
        };
      });
    }
  };

  // Toggle Follow author
  const handleFollowToggle = (handle: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.author.handle === handle) {
          const newFollowState = !item.author.isFollowing;
          return {
            ...item,
            author: {
              ...item.author,
              isFollowing: newFollowState,
            },
          };
        }
        return item;
      })
    );

    setProfile((prev) => ({
      ...prev,
      followingCount: prev.followingCount + 1,
    }));
  };

  // Add message to chat thread & schedule fake 2s reply
  const handleSendMessage = (itemId: string, messageText: string) => {
    const userMsgId = `msg-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: messageText,
      time: 'Just now',
    };

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedMessages = [...(item.messages || []), userMsg];
          return {
            ...item,
            text: `You: ${messageText}`,
            lastMessageTime: 'Just now',
            messages: updatedMessages,
            commentCount: item.commentCount + 1,
            chatStatus: 'typing' as const,
          };
        }
        return item;
      })
    );

    // After 2 seconds, simulate incoming auto reply
    setTimeout(() => {
      const replyText = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'other' as const,
        text: replyText,
        time: 'Just now',
      };

      setItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const updatedMessages = [...(item.messages || []), replyMsg];
            return {
              ...item,
              text: replyText,
              lastMessageTime: 'Just now',
              messages: updatedMessages,
              chatStatus: 'online' as const,
            };
          }
          return item;
        })
      );
    }, 2000);
  };

  // Add comment to post detail
  const handleAddComment = (itemId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: profile.name,
      avatar: profile.avatar,
      text: commentText,
      time: 'Just now',
      likes: 0,
    };

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedComments = [...(item.comments || []), newComment];
          return {
            ...item,
            comments: updatedComments,
            commentCount: item.commentCount + 1,
          };
        }
        return item;
      })
    );

    if (selectedPost && selectedPost.id === itemId) {
      setSelectedPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [...(prev.comments || []), newComment],
          commentCount: prev.commentCount + 1,
        };
      });
    }
  };

  // Add new post item from CreatePostModal
  const handleSubmitPost = (newItem: SocialItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleOpenCreateForColumn = (columnId: ColumnId) => {
    setCreateDefaultColumn(columnId);
    setIsCreateOpen(true);
  };

  const handleResetData = () => {
    clearAllStorage();
    setItems(getStoredItems());
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
  };

  // Admin Actions
  const handleDeletePost = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost(null);
    }
  };

  const handleTogglePinPost = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const handleToggleBlockUser = (handle: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.author.handle === handle) {
          return {
            ...item,
            author: {
              ...item.author,
              isBlocked: !item.author.isBlocked,
            },
          };
        }
        return item;
      })
    );
  };

  const handleConfirmReport = (itemId: string, reason: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isReported: true, reportReason: reason } : item
      )
    );
  };

  const handleClearReport = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isReported: false, reportReason: undefined } : item
      )
    );
  };

  const unreadChats = items
    .filter((i) => i.column === 'chat')
    .reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  if (!currentUser) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden select-none">
        {/* Top Header Bar */}
        <TopBar
          onOpenCreate={() => handleOpenCreateForColumn('feed')}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={handleOpenSettings}
          onOpenProfile={() => handleOpenProfile()}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenFriends={handleOpenFriends}
          onOpenExport={isOwner ? () => setIsExportOpen(true) : undefined}
          onOpenDailyReward={() => setIsDailyRewardOpen(true)}
          onLogout={handleLogout}
          isPhoneFrame={true}
          onTogglePhoneFrame={() => {}}
          unreadCount={unreadChats + 2}
          currentUser={activeUser}
        />

        {/* Main Body Area with Optional Left/Right Sidebars on Wide Screens */}
        <div className="flex-1 flex w-full min-h-0 overflow-hidden relative">
          <LeftSidebar
            currentUser={activeUser}
            onOpenDailyReward={() => setIsDailyRewardOpen(true)}
            onOpenWallet={() => setIsWalletOpen(true)}
            onOpenFriends={handleOpenFriends}
          />

          {/* Center 5-Column Grid / Single Column Dashboard */}
          <ColumnsContainer
            activeColumn={activeColumn}
            items={items}
            currentUser={activeUser}
            onLikeToggle={handleLikeToggle}
            onOpenDetail={(item) => setSelectedPost(item)}
            onSendMessage={handleSendMessage}
            onOpenCreateForColumn={handleOpenCreateForColumn}
            onOpenShare={(item) => setSelectedSharePost(item)}
            onFollowToggle={handleFollowToggle}
            onOpenReport={(item) => setSelectedReportPost(item)}
            onOpenGift={(item) => setSelectedGiftPost(item)}
          />

          <RightSidebar
            onFollowToggle={handleFollowToggle}
            onOpenChatWithUser={(name, handle, avatar) => {
              setActiveColumn('chat');
            }}
          />
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeColumn={activeColumn}
          onSelectColumn={(id) => setActiveColumn(id)}
          unreadChats={unreadChats}
        />

        {/* Modals & Drawers */}
        <DailyRewardModal
          isOpen={isDailyRewardOpen}
          onClose={() => setIsDailyRewardOpen(false)}
          currentUser={activeUser}
          onClaimReward={handleClaimReward}
        />

        <WalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          coinBalance={activeUser.coinBalance ?? 500}
          transactions={transactions}
          onBuyCoins={handleBuyCoins}
        />

        <GiftModal
          isOpen={!!selectedGiftPost}
          onClose={() => setSelectedGiftPost(null)}
          item={selectedGiftPost}
          userCoins={activeUser.coinBalance ?? 500}
          onSendGift={handleSendGift}
          onOpenBuyCoins={() => {
            setSelectedGiftPost(null);
            setIsWalletOpen(true);
          }}
        />

        <CreatePostModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmitPost={handleSubmitPost}
          defaultColumn={createDefaultColumn}
          currentUser={activeUser}
        />

        <PostDetailModal
          item={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLikeToggle={handleLikeToggle}
          onAddComment={handleAddComment}
          onShareOpen={(item) => setSelectedSharePost(item)}
          onOpenReport={(item) => setSelectedReportPost(item)}
        />

        <NotificationModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          items={items}
          onSelectPost={(item) => setSelectedPost(item)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={profile}
          currentUser={activeUser}
          settings={settings}
          initialTab={settingsDefaultTab}
          onSaveProfile={(updated) => {
            setProfile(updated);
            setCurrentUser(updated);
            saveStoredCurrentUser(updated);
          }}
          onSaveSettings={(updated) => setSettings(updated)}
          onResetData={handleResetData}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onOpenAdminPanel={isOwner ? () => setIsAdminOpen(true) : undefined}
          onOpenExport={isOwner ? () => setIsExportOpen(true) : undefined}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          targetUser={selectedProfileUser || activeUser}
          currentUser={activeUser}
          items={items}
          onLikeToggle={handleLikeToggle}
          onOpenDetail={(item) => setSelectedPost(item)}
          onOpenSettings={() => {
            setIsProfileOpen(false);
            setIsSettingsOpen(true);
          }}
          onOpenFriends={(tab) => {
            setIsProfileOpen(false);
            handleOpenFriends(tab);
          }}
          onFollowUser={handleFollowToggle}
        />

        <FriendsModal
          isOpen={isFriendsOpen}
          onClose={() => setIsFriendsOpen(false)}
          currentUser={activeUser}
          initialTab={friendsDefaultTab}
          onOpenProfileWithUser={(user) => {
            setIsFriendsOpen(false);
            handleOpenProfile(user);
          }}
          onOpenChatWithUser={(_name, _handle, _avatar) => {
            setIsFriendsOpen(false);
            setActiveColumn('chat');
          }}
        />

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

        <ShareModal
          item={selectedSharePost}
          onClose={() => setSelectedSharePost(null)}
          lang={settings.language}
        />

        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          items={items}
          currentUser={profile}
          onDeletePost={handleDeletePost}
          onTogglePinPost={handleTogglePinPost}
          onToggleBlockUser={handleToggleBlockUser}
          onClearReport={handleClearReport}
          onClearAllData={handleResetData}
        />

        <ReportModal
          item={selectedReportPost}
          onClose={() => setSelectedReportPost(null)}
          onConfirmReport={handleConfirmReport}
        />
      </div>
    </PhoneContainer>
  );
}
