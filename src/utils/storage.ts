import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { UserProfile, SocialItem } from '../types';

const db = getFirestore();
const auth = getAuth();

// === REAL FIREBASE STORAGE ===

// 1. POSTS - সবাই সবার Post দেখবে
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
    likes: [],
    comments: [],
    shares: 0,
    timestamp: serverTimestamp()
  });
};

// 2. FOLLOW SYSTEM
export const followUser = async (targetUserId: string) => {
  const uid = auth.currentUser?.uid!;
  await setDoc(doc(db, `follows/${uid}_${targetUserId}`), {
    followerId: uid, followingId: targetUserId, timestamp: serverTimestamp()
  });
  // Real time update
  const targetRef = doc(db, "users", targetUserId);
  await updateDoc(targetRef, { followersCount: arrayUnion(uid) }).catch(async () => {
    await setDoc(targetRef, { followersCount: [uid] }, { merge: true });
  });
};

export const unfollowUser = async (targetUserId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `users/${targetUserId}`), { followersCount: arrayRemove(uid) });
};

// 3. FRIEND REQUEST
export const sendFriendRequest = async (targetUserId: string) => {
  await addDoc(collection(db, "friendRequests"), {
    senderId: auth.currentUser?.uid, receiverId: targetUserId, status: "pending", timestamp: serverTimestamp()
  });
};

// 4. LIKE / COMMENT / SHARE - Facebook Style
export const likePost = async (postId: string) => {
  const uid = auth.currentUser?.uid!;
  await updateDoc(doc(db, `posts/${postId}`), { likes: arrayUnion(uid) });
};

export const commentOnPost = async (postId: string, text: string) => {
  await addDoc(collection(db, `posts/${postId}/comments`), {
    userId: auth.currentUser?.uid, text, timestamp: serverTimestamp()
  });
};

export const sharePost = async (postId: string) => {
  await updateDoc(doc(db, `posts/${postId}`), { shares: arrayUnion(auth.currentUser?.uid) });
};

// 5. STORY (24h)
export const addStory = async (mediaUrl: string) => {
  await addDoc(collection(db, "stories"), {
    userId: auth.currentUser?.uid, mediaUrl, createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 24*60*60*1000)
  });
};

// 6. SHORTS / WATCH (TikTok Style)
export const addShort = async (videoUrl: string, caption: string) => {
  await addDoc(collection(db, "shorts"), {
    userId: auth.currentUser?.uid, videoUrl, caption, likes: [], views: 0, timestamp: serverTimestamp()
  });
};

// পুরানো LocalStorage Keys আর লাগবে না - এখন সব Firebase!
