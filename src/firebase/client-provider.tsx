
'use client';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { FirebaseContext, FirebaseContextValue } from './provider';
import { getFirebaseSdks } from './firebase-app';

// We need to store the instances in a module-level variable to avoid
// creating new instances on every render.
let firebaseSdks: {
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
} | undefined;


// This ensures that Firebase is initialized only once on the client.
if (typeof window !== 'undefined' && !firebaseSdks) {
  firebaseSdks = getFirebaseSdks();
}

export interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    // This effect runs only on the client.
    // When it runs, we know the firebaseApp instance is available.
    if (firebaseSdks) {
        setInstances(firebaseSdks);
    }
  }, []);

  // Render nothing until Firebase is initialized on the client.
  // This prevents child components from trying to access Firebase too early.
  if (!instances) {
    return null;
  }
  
  return (
    <FirebaseContext.Provider value={instances}>
      {children}
    </FirebaseContext.Provider>
  );
}
