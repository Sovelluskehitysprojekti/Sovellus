import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnmsSmzp2-MKZgKDbPuSLOSm3DTfNXcR4",
  authDomain: "quiz-app-73866.firebaseapp.com",
  projectId:  "quiz-app-73866",
  storageBucket: "quiz-app-73866.firebasestorage.app",
  messagingSenderId:  "979165461037",
  appId: "1:979165461037:web:9feef3af2be3682a1dd6a4",
  measurementId:  "G-C7XCR7M769"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ modern persistence setup (no deprecated methods)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export async function ensureAnonAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return auth.currentUser;
}
