import { db, auth } from '../lib/firebase';
import {
  collection, doc, setDoc, getDoc, updateDoc,
  arrayUnion, arrayRemove, addDoc, serverTimestamp,
  query, where, onSnapshot, orderBy, getDocs
} from "firebase/firestore";
import { SocialItem } from '../types';

// === ONEFEED BD - REAL SOCIAL SYSTEM ===

// 1. POSTS - Feed (সবাই সবার Post দেখবে)
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

// 2. FOLLOW / SUBSCRIBE SYSTEM
export const followUser = async (targetUserId: string) => {
  const uid = auth.currentUser?.uid!;
  if (!uid) throw new Error("Login করো");
  await setDoc(doc(db, `follows/${uid}_${targetUserId}`), {
    followerId: uid,
    followingId: targetUserId,
    timestamp: serverTimestamp()
  });
  // Followers Count Update
  const targetRef = doc(db, "users", targetUserId);
  const snap = await getDoc(targetRef);
  if (snap.exists()) {
    await updateDoc(targetRef, { followersCount: arrayUnion(uid) });
  } else {
    await setDoc(targetRef, { followersCount: [uid] }, { merge: true });
  }
};

export const unfollowUser = async (targetUserId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `users/${targetUserId}`), {
    followersCount: arrayRemove(uid)
  }).catch(() => {});
};

// 3. FRIEND REQUEST SYSTEM
export const sendFriendRequest = async (targetUserId: string) => {
  await addDoc(collection(db, "friendRequests"), {
    senderId: auth.currentUser?.uid,
    receiverId: targetUserId,
    status: "pending",
    timestamp: serverTimestamp()
  });
};

export const acceptFriendRequest = async (requestId: string) => {
  await updateDoc(doc(db, `friendRequests/${requestId}`), { status: "accepted" });
};

// 4. LIKE / COMMENT / SHARE (Facebook Style)
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
  await updateDoc(doc(db, `posts/${postId}`), {
    commentsCount: arrayUnion(auth.currentUser?.uid)
  }).catch(() => {});
};

export const sharePost = async (postId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `posts/${postId}`), { shares: arrayUnion(uid) });
};

// 5. STORY (24h - Facebook/Instagram Style)
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

// 6. SHORTS / WATCH (TikTok Style)
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
