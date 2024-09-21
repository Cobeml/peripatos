"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "../../components/ui/navbar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { auth, db } from '../../lib/firebase/firebase';
import { updateProfile, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    userType: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData({
            displayName: userData.displayName || '',
            email: authUser.email ?? '',
            userType: userData.userType || '',
          });
        } else {
          setProfileData({ 
            displayName: authUser.displayName ?? '', 
            email: authUser.email ?? '', 
            userType: '' 
          });
        }
      } else {
        setUser(null);
        setProfileData({ displayName: '', email: '', userType: '' });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, { displayName: profileData.displayName });
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: profileData.displayName,
        userType: profileData.userType,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-black text-pink-100">
        <Navbar />
        <div className="min-h-screen w-full px-4 pt-20 flex items-center justify-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-pink-100">
      <Navbar />
      <div className="min-h-screen w-full px-4 pt-20">
        <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <Input
            type="text"
            name="displayName"
            value={profileData.displayName}
            onChange={handleInputChange}
            placeholder="Display Name"
            className="mb-4 text-black"
          />
          <Input
            type="email"
            name="email"
            value={profileData.email}
            readOnly
            className="mb-4 text-black"
          />
          <select
            name="userType"
            value={profileData.userType}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 bg-black border border-pink-100 rounded"
          >
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="classroomOwner">Classroom Owner</option>
          </select>
          <Button type="submit" className="w-full">Update Profile</Button>
        </form>
      </div>
    </div>
  );
}