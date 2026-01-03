
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This function is safe to call on both server and client.
export function getFirebaseApp() {
  if (getApps().length === 0) {
    try {
      // For App Hosting, initializeApp() is called without args.
      return initializeApp();
    } catch {
      return initializeApp(firebaseConfig);
    }
  }
  return getApp();
}

export function getFirebaseSdks() {
  const app = getFirebaseApp();
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}
