"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/ui/navbar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { auth, db } from '../../lib/firebase/firebase';
import { updateProfile, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    userType: '',
    bio: '',
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData({
            displayName: userData.displayName || authUser.displayName || '',
            email: authUser.email || '',
            userType: userData.userType || '',
            bio: userData.bio || '',
          });
        } else {
          setProfileData({ 
            displayName: authUser.displayName || '', 
            email: authUser.email || '', 
            userType: '',
            bio: '',
          });
        }
      } else {
        setUser(null);
        setProfileData({ displayName: '', email: '', userType: '', bio: '' });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        bio: profileData.bio,
      }, { merge: true });
      alert('Profile updated successfully!');
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const toggleEditing = (field: string) => {
    setEditingField(editingField === field ? null : field);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-black text-pink-100">
        <Navbar />
        <div className="min-h-screen w-full px-4 flex items-center justify-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-pink-100">
      <Navbar />
      <div className="min-h-screen w-full px-4 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="max-w-2xl w-full">
          <div className="mb-4">
            <label className="block mb-2">Display Name</label>
            {editingField === 'displayName' ? (
              <Input
                type="text"
                name="displayName"
                value={profileData.displayName}
                onChange={handleInputChange}
                onBlur={() => toggleEditing('displayName')}
                className="text-black w-full"
                autoFocus
              />
            ) : (
              <p className="p-2 rounded cursor-pointer border border-pink-100" onClick={() => toggleEditing('displayName')}>
                {profileData.displayName}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <p className="bg-gray-800 p-2 rounded">{profileData.email}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2">User Type</label>
            {editingField === 'userType' ? (
              <select
                name="userType"
                value={profileData.userType}
                onChange={handleInputChange}
                onBlur={() => toggleEditing('userType')}
                className="w-full p-2 border border-pink-100 rounded text-black"
                autoFocus
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="classroomOwner">Classroom Owner</option>
              </select>
            ) : (
              <p className="p-2 rounded cursor-pointer border border-pink-100" onClick={() => toggleEditing('userType')}>
                {profileData.userType ? capitalizeFirstLetter(profileData.userType) : 'Not set'}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Bio</label>
            {editingField === 'bio' ? (
              <Textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                onBlur={() => toggleEditing('bio')}
                className="w-full p-2 border border-pink-100 rounded text-black"
                rows={4}
                autoFocus
              />
            ) : (
              <p className="p-2 rounded cursor-pointer border border-pink-100" onClick={() => toggleEditing('bio')}>
                {profileData.bio || 'No bio provided'}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button type="submit" className="w-full mb-4">Update Profile</Button>
            <Button onClick={handleLogout} className="w-full justify-center mt-4 bg-red-600 hover:bg-red-700">Log Out</Button>
          </div>
        </form>
      </div>
    </div>
  );
}