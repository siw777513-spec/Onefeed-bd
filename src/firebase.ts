import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNdp71_i5S8b3RdypvtJQ-IXK9P5vjssU",
  authDomain: "onefeed-bangladesh.firebaseapp.com",
  projectId: "onefeed-bangladesh",
  storageBucket: "onefeed-bangladesh.firebasestorage.app",
  messagingSenderId: "658176332596",
  appId: "1:658176332596:web:0101c94065e834c1ff8b61",
  measurementId: "G-4WRRME52K2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
