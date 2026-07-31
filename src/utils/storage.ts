import { SocialItem, UserProfile, UserSettings, Transaction, WithdrawalRequest } from '../types';
import { INITIAL_DATA } from '../data/mockData';

const STORAGE_KEYS = {
  ITEMS: 'onefeed_items_v2',
  PROFILE: 'onefeed_user_profile_v2',
  SETTINGS: 'onefeed_user_settings_v2',
  FOLLOWS: 'onefeed_user_follows_v2',
  BOOKMARKS: 'onefeed_user_bookmarks_v2',
  TRANSACTIONS: 'onefeed_transactions_v1',
  WITHDRAWALS: 'onefeed_withdrawals_v1',
  COMMISSION: 'onefeed_commission_rate_v1',
  CURRENT_USER: 'onefeed_currentUser',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Vance (Owner)',
  handle: '@alex_vance',
  email: 'siw777513@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  bio: 'Owner & Lead Engineer of OneFeed platform. 🛡️ Global Admin',
  followersCount: 1240,
  followingCount: 380,
  isAdmin: true,
  coinBalance: 500,
  totalEarnings: 148.50,
  availableBalance: 112.00,
  subscribersCount: 28,
  giftsReceivedCount: 142,
};

export const DEFAULT_SETTINGS: UserSettings = {
  privateAccount: false,
  notificationsEnabled: true,
  language: 'en',
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'buy_coins',
    amountCoins: 500,
    amountDollars: 5.0,
    title: 'Purchased 500 Coins (bKash)',
    timestamp: '2 hours ago',
    status: 'completed',
  },
  {
    id: 'tx-2',
    type: 'sent_gift',
    amountCoins: -100,
    title: 'Sent Diamond Gift to @sarah_design',
    timestamp: '5 hours ago',
    status: 'completed',
  },
  {
    id: 'tx-3',
    type: 'subscription',
    amountDollars: 2.99,
    title: 'Monthly Subscription from @mike_vlog',
    timestamp: '1 day ago',
    status: 'completed',
  },
  {
    id: 'tx-4',
    type: 'ad_revenue',
    amountDollars: 12.40,
    title: 'Ad Revenue Payout (1,240,000 Views)',
    timestamp: '3 days ago',
    status: 'completed',
  },
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-101',
    userHandle: '@alex_vance',
    userName: 'Alex Vance (Owner)',
    amountDollars: 35.0,
    paymentMethod: 'bkash',
    accountNumber: '01711223344',
    timestamp: '1 day ago',
    status: 'pending',
  },
  {
    id: 'wd-100',
    userHandle: '@sarah_design',
    userName: 'Sarah Chen',
    amountDollars: 50.0,
    paymentMethod: 'nagad',
    accountNumber: '01899887766',
    timestamp: '3 days ago',
    status: 'approved',
  },
];

export function getStoredItems(): SocialItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DATA;
  } catch {
    return INITIAL_DATA;
  }
}

export function saveStoredItems(items: SocialItem[]): void {
  try {
    // Sanitize heavy blob or data URLs to prevent localStorage quota errors
    const sanitizedItems = items.map((item) => {
      const isHeavyMedia =
        (item.image && item.image.length > 200000) ||
        (item.videoUrl && item.videoUrl.length > 200000);

      if (isHeavyMedia) {
        return {
          ...item,
          image: item.image && item.image.length > 200000 ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' : item.image,
          videoUrl: item.videoUrl && item.videoUrl.length > 200000 ? undefined : item.videoUrl,
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(sanitizedItems));
  } catch (err) {
    console.warn('Failed to save items to localStorage quota', err);
  }
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function getStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return INITIAL_TRANSACTIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions', err);
  }
}

export function getStoredWithdrawals(): WithdrawalRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    if (!raw) return INITIAL_WITHDRAWALS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_WITHDRAWALS;
  }
}

export function saveStoredWithdrawals(withdrawals: WithdrawalRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  } catch (err) {
    console.error('Failed to save withdrawals', err);
  }
}

export function getStoredCommission(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMISSION);
    if (!raw) return 30;
    return parseInt(raw, 10) || 30;
  } catch {
    return 30;
  }
}

export function saveStoredCommission(rate: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMISSION, rate.toString());
  } catch (err) {
    console.error('Failed to save commission rate', err);
  }
}

export function getStoredCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get current user from storage', err);
    return null;
  }
}

export function saveStoredCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save current user', err);
  }
}

export function logoutCurrentUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (err) {
    console.error('Failed to logout user', err);
  }
}

export function clearAllStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.FOLLOWS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.WITHDRAWALS);
    localStorage.removeItem(STORAGE_KEYS.COMMISSION);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (err) {
    console.error('Failed to clear storage', err);
  }
}
