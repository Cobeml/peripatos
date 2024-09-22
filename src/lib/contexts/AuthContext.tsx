"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { User } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (username: string, userType: string[]) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmailAndPassword: (emailOrUsername: string, password: string) => Promise<User>;
  signUpWithEmailAndPassword: (email: string, password: string, username: string, userType: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const signInWithEmailAndPassword = async (emailOrUsername: string, password: string) => {
    try {
      let email = emailOrUsername;
      
      // Check if input is not an email
      if (!emailOrUsername.includes('@')) {
        // Query Firestore to get the email associated with the username
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("username", "==", emailOrUsername));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('No user found with this username.');
        }
        
        email = querySnapshot.docs[0].data().email;
      }

      const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with email/username and password", error);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (email: string, password: string, username: string, userType: string[]) => {
    try {
      console.log('Creating user with email and password...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully, updating profile...');
      await updateProfile(userCredential.user, { displayName: username });
      console.log('Profile updated, setting user data in Firestore...');
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        username,
        userType,
        displayName: username,
      });
      console.log('User data set in Firestore successfully');
    } catch (error: any) {
      console.error('Error in signUpWithEmailAndPassword:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already in use. Please try logging in or use a different email.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('The email address is not valid.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('The password is too weak. Please choose a stronger password.');
      } else {
        throw new Error(`An unexpected error occurred: ${error.message}`);
      }
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Add this custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
