'use client';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import React, { createContext, useContext, ReactNode } from 'react';
import { FirebaseClientProvider } from './client-provider';
import { FirebaseErrorListener } from '../components/FirebaseErrorListener';

export interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(
  null,
);

export interface FirebaseProviderProps {
  children: React.ReactNode;
}

export function FirebaseProvider(props: FirebaseProviderProps) {
  return (
    <FirebaseClientProvider>
        <FirebaseErrorListener />
        {props.children}
    </FirebaseClientProvider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const context = useFirebase();
  return context.firebaseApp;
}

export function useFirestore() {
  const context = useFirebase();
  return context.firestore;
}

export function useFirebaseAuth() {
  const context = useFirebase();
  return context.auth;
}
