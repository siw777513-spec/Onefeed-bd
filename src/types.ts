export type ColumnId = 'feed' | 'shorts' | 'watch' | 'story' | 'chat';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  coverImage: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isAdmin?: boolean;
  coinBalance?: number;
  totalEarnings?: number;
  availableBalance?: number;
  subscribersCount?: number;
  giftsReceivedCount?: number;
}

export interface UserSettings {
  privateAccount: boolean;
  notificationsEnabled: boolean;
  language: 'en' | 'bn';
  darkMode?: boolean;
}

export interface GiftOption {
  id: string;
  name: string;
  icon: string;
  coinPrice: number;
  valueDollars: number;
}

export interface Transaction {
  id: string;
  type: 'buy_coins' | 'sent_gift' | 'subscription' | 'ad_revenue' | 'payout' | 'tip' | 'paid_unlock';
  amountCoins?: number;
  amountDollars?: number;
  title: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WithdrawalRequest {
  id: string;
  userHandle: string;
  userName: string;
  amountDollars: number;
  paymentMethod: 'bkash' | 'nagad' | 'bank' | 'paypal';
  accountNumber: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SocialItem {
  id: string;
  column: ColumnId;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
    online?: boolean;
    isFollowing?: boolean;
    isBlocked?: boolean;
    isSubscribed?: boolean;
  };
  image: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  mediaId?: string;
  fileSizeMb?: number;
  posterImage?: string;
  text: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  shareCount: number;
  timestamp: string;
  tags?: string[];
  soundTrack?: string;
  duration?: string;
  views?: string;
  storyExpires?: string;
  isViewed?: boolean;
  isPinned?: boolean;
  isReported?: boolean;
  reportReason?: string;
  isPaidPost?: boolean;
  unlockPriceCoins?: number;
  isUnlocked?: boolean;
  totalGiftsReceivedCoins?: number;
  unreadCount?: number;
  lastMessageTime?: string;
  chatStatus?: 'typing' | 'online' | 'offline';
  messages?: {
    id: string;
    sender: 'user' | 'other';
    text: string;
    time: string;
    liked?: boolean;
    image?: string;
  }[];
  comments?: Comment[];
}

export interface ColumnConfig {
  id: ColumnId;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

