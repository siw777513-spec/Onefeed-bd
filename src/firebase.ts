import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey-Placeholder",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "onefeed-bd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "onefeed-bd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "onefeed-bd.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXX"
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase OK", firebaseConfig.projectId);
} catch (e) {
  console.warn("Firebase init failed - running offline mode", e);
  // Dummy objects যাতে crash না করে
  db = { _offline: true } as any;
  auth = { _offline: true } as any;
  storage = { _offline: true } as any;
}

export { auth, db, storage };
export const googleProvider = new GoogleAuthProvider();
export default app;
