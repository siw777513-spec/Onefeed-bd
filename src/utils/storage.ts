import { db, auth } from '../lib/firebase';
import {
  collection, doc, setDoc, addDoc, updateDoc,
  arrayUnion, arrayRemove, serverTimestamp,
  query, onSnapshot, orderBy
} from "firebase/firestore";
import { SocialItem } from '../types';

export const STORAGE_KEYS = {
  PROFILE: 'onefeed_profile',
  ITEMS: 'onefeed_items_v2',
  THEME: 'onefeed_theme',
  SETTINGS: 'onefeed_settings',
  CURRENT_USER: 'onefeed_current_user',
  USERS: 'onefeed_users'
};

export const DEFAULT_PROFILE = {
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

const safeGet = (k: string, f: any) => {
  try {
    const d = localStorage.getItem(k);
    return d? JSON.parse(d) : f;
  } catch { return f; }
};
const safeSet = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

export const getStoredProfile = () => safeGet(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
export const saveProfile = (p: any) => safeSet(STORAGE_KEYS.PROFILE, p);
export const getStoredItems = () => safeGet(STORAGE_KEYS.ITEMS, []);
export const saveItems = (i: any) => safeSet(STORAGE_KEYS.ITEMS, i);
export const getStoredTheme = () => localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
export const saveTheme = (t: string) => localStorage.setItem(STORAGE_KEYS.THEME, t);
export const getStoredSettings = () => safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveStoredSettings = (s: any) => safeSet(STORAGE_KEYS.SETTINGS, s);
export const getStoredCurrentUser = () => safeGet(STORAGE_KEYS.CURRENT_USER, null);
export const saveStoredCurrentUser = (u: any) => safeSet(STORAGE_KEYS.CURRENT_USER, u);
export const logoutCurrentUser = () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
export const getStoredUsers = () => safeGet(STORAGE_KEYS.USERS, []);
export const saveStoredUsers = (u: any) => safeSet(STORAGE_KEYS.USERS, u);
export const clearAllStorage = () => { try { localStorage.clear(); } catch {} };

export const getPosts = (cb: (p: SocialItem[]) => void) => {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (s) => cb(s.docs.map(d => ({ id: d.id,...d.data() } as SocialItem))));
};
export const createPost = async (post: any) => {
  await addDoc(collection(db, "posts"), {
   ...post,
    userId: auth.currentUser?.uid,
    userEmail: auth.currentUser?.email,
    userName: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0],
    userAvatar: auth.currentUser?.photoURL || `https://i.pravatar.cc/150?u=${auth.currentUser?.uid}`,
    likes: [], commentsCount: 0, shares: 0, timestamp: serverTimestamp()
  });
};
export const likePost = async (id: string) => {
  await updateDoc(doc(db, `posts/${id}`), { likes: arrayUnion(auth.currentUser?.uid) });
};
export const unlikePost = async (id: string) => {
  await updateDoc(doc(db, `posts/${id}`), { likes: arrayRemove(auth.currentUser?.uid) });
};
export const commentOnPost = async (id: string, text: string) => {
  await addDoc(collection(db, `posts/${id}/comments`), {
    userId: auth.currentUser?.uid, text, timestamp: serverTimestamp()
  });
};
export const sharePost = async (id: string) => {
  await updateDoc(doc(db, `posts/${id}`), { shares: arrayUnion(auth.currentUser?.uid) });
};
export const followUser = async (tid: string) => {
  await setDoc(doc(db, `follows/${auth.currentUser?.uid}_${tid}`), {
    followerId: auth.currentUser?.uid, followingId: tid, timestamp: serverTimestamp()
  });
};
export const unfollowUser = async (tid: string) => {
  await setDoc(doc(db, `follows/${auth.currentUser?.uid}_${tid}`), {}, { merge: true });
};
export const sendFriendRequest = async (tid: string) => {
  await addDoc(collection(db, "friendRequests"), {
    senderId: auth.currentUser?.uid, receiverId: tid, status: "pending", timestamp: serverTimestamp()
  });
};
export const acceptFriendRequest = async (rid: string) => {
  await updateDoc(doc(db, `friendRequests/${rid}`), { status: "accepted" });
};
export const addStory = async (url: string) => {
  await addDoc(collection(db, "stories"), {
    userId: auth.currentUser?.uid, mediaUrl: url, createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 86400000)
  });
};
export const getStories = (cb: any) => {
  return onSnapshot(query(collection(db, "stories"), orderBy("createdAt", "desc")), s => cb(s.docs.map(d => ({ id: d.id,...d.data() }))));
};
export const addShort = async (url: string, cap: string) => {
  await addDoc(collection(db, "shorts"), {
    userId: auth.currentUser?.uid, videoUrl: url, caption: cap, likes: [], timestamp: serverTimestamp()
  });
};
export const getShorts = (cb: any) => {
  return onSnapshot(query(collection(db, "shorts"), orderBy("timestamp", "desc")), s => cb(s.docs.map(d => ({ id: d.id,...d.data() }))));
};
