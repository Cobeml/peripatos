"use client";

import React, { createContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { User } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (username: string, userType: string[]) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string, username: string, userType: string[]) => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string, username: string, userType: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  signInWithEmailAndPassword: async () => {},
  signUpWithEmailAndPassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (username: string, userType: string[]) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        username,
        userType,
        displayName: username, // Add this line
      }, { merge: true });
      
      // Update the user's profile
      await updateProfile(result.user, { displayName: username });
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string, username: string, userType: string[]) => {
    try {
      const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        username,
        userType,
        displayName: username,
      });
      
      // Update the user's profile
      await updateProfile(userCredential.user, { displayName: username });
    } catch (error) {
      console.error("Error signing in with email and password", error);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string, username: string, userType: string[]) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        username,
        userType,
        displayName: username,
      });
      
      // Update the user's profile
      await updateProfile(userCredential.user, { displayName: username });
    } catch (error) {
      console.error("Error signing up with email and password", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signOut: signOutUser, 
      signInWithEmailAndPassword,
      signUpWithEmailAndPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
