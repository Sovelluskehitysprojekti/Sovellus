import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: 
  authDomain:
  projectId: 
  storageBucket:
  messagingSenderId: 
  appId: 
  measurementId:  
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

