import { db, auth } from '../lib/firebase';
import {
  collection, doc, setDoc, addDoc, updateDoc,
  arrayUnion, arrayRemove, serverTimestamp,
  query, onSnapshot, orderBy
} from "firebase/firestore";
import { SocialItem, UserProfile } from '../types';

// === 100% COMPATIBILITY FIX ===
export const STORAGE_KEYS = {
  PROFILE: 'onefeed_profile',
  ITEMS: 'onefeed_items_v2',
  THEME: 'onefeed_theme',
  SETTINGS: 'onefeed_settings',
  CURRENT_USER: 'onefeed_current_user',
  USERS: 'onefeed_users'
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'default',
  name: 'User',
  handle: 'user',
  avatar: 'https://i.pravatar.cc/150',
  bio: 'OneFeed BD User',
  followers: 0,
  following: 0
};

export const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'bn',
  notifications: true
};

const safeGet = (key: string, fallback: any) => {
  try {
    const d = localStorage.getItem(key);
    return d? JSON.parse(d) : fallback;
  } catch { return fallback; }
};
const safeSet = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

export const getStoredProfile = () => safeGet(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
export const saveProfile = (p: any) => safeSet(STORAGE_KEYS.PROFILE, p);
export const getStoredItems = () => safeGet(STORAGE_KEYS.ITEMS, []);
export const saveItems = (items: any) => safeSet(STORAGE_KEYS.ITEMS, items);
export const getStoredTheme = () => localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
export const saveTheme = (t: string) => localStorage.setItem(STORAGE_KEYS.THEME, t);

export const getStoredSettings = () => safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveStoredSettings = (s: any) => safeSet(STORAGE_KEYS.SETTINGS, s);

export const getStoredCurrentUser = () => safeGet(STORAGE_KEYS.CURRENT_USER, null);
export const saveStoredCurrentUser = (u: any) => safeSet(STORAGE_KEYS.CURRENT_USER, u);
export const logoutCurrentUser = () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

export const getStoredUsers = () => safeGet(STORAGE_KEYS.USERS, []);
export const saveStoredUsers = (u: any) => safeSet(STORAGE_KEYS.USERS, u);

// এইটাই Error দিচ্ছিল
export const clearAllStorage = () => {
  try {
    localStorage.clear();
  } catch {}
};

// === REAL FIREBASE ===
export const getPosts = (callback: (posts: SocialItem[]) => void) => {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(d => ({ id: d.id,...d.data() } as SocialItem));
    callback(posts);
  });
};

export const createPost = async (post: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Login করো");
  await addDoc(collection(db, "posts"), {
  ...post,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName || user.email?.split('@')[0],
    userAvatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
    likes: [],
    commentsCount: 0,
    shares: 0,
    timestamp: serverTimestamp()
  });
};

export const followUser = async (targetUserId: string) => {
  const uid = auth.currentUser?.uid!;
  await setDoc(doc(db, `follows/${uid}_${targetUserId}`), {
    followerId: uid, followingId: targetUserId, timestamp: serverTimestamp()
  });
};

export const unfollowUser = async (targetUserId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `users/${targetUserId}`), {
    followersCount: arrayRemove(uid)
  }).catch(() => {});
};

export const sendFriendRequest = async (targetUserId: string) => {
  await addDoc(collection(db, "friendRequests"), {
    senderId: auth.currentUser?.uid, receiverId: targetUserId, status: "pending", timestamp: serverTimestamp()
  });
};

export const acceptFriendRequest = async (requestId: string) => {
  await updateDoc(doc(db, `friendRequests/${requestId}`), { status: "accepted" });
};

export const likePost = async (postId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `posts/${postId}`), { likes: arrayUnion(uid) });
};

export const unlikePost = async (postId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `posts/${postId}`), { likes: arrayRemove(uid) });
};

export const commentOnPost = async (postId: string, text: string) => {
  await addDoc(collection(db, `posts/${postId}/comments`), {
    userId: auth.currentUser?.uid,
    userName: auth.currentUser?.displayName || auth.currentUser?.email,
    userAvatar: auth.currentUser?.photoURL,
    text,
    timestamp: serverTimestamp()
  });
};

export const sharePost = async (postId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `posts/${postId}`), { shares: arrayUnion(uid) });
};

export const addStory = async (mediaUrl: string) => {
  await addDoc(collection(db, "stories"), {
    userId: auth.currentUser?.uid,
    userName: auth.currentUser?.displayName,
    userAvatar: auth.currentUser?.photoURL,
    mediaUrl,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 24*60*60*1000)
  });
};

export const getStories = (callback: (stories: any[]) => void) => {
  const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id,...d.data() })));
  });
};

export const addShort = async (videoUrl: string, caption: string) => {
  await addDoc(collection(db, "shorts"), {
    userId: auth.currentUser?.uid,
    userName: auth.currentUser?.displayName,
    userAvatar: auth.currentUser?.photoURL,
    videoUrl,
    caption,
    likes: [],
    views: 0,
    timestamp: serverTimestamp()
  });
};

export const getShorts = (callback: (shorts: any[]) => void) => {
  const q = query(collection(db, "shorts"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id,...d.data() })));
  });
};
