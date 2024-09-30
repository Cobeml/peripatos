import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Section functions
export const addSection = async (courseId: string, sectionData: any) => {
  const sectionRef = collection(db, 'courses', courseId, 'sections');
  return addDoc(sectionRef, sectionData);
};

export const updateSection = async (courseId: string, sectionId: string, sectionData: any) => {
  const sectionRef = doc(db, 'courses', courseId, 'sections', sectionId);
  return updateDoc(sectionRef, sectionData);
};

export const getSections = async (courseId: string) => {
  const sectionsRef = collection(db, 'courses', courseId, 'sections');
  const q = query(sectionsRef, orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Page functions
export const addPage = async (courseId: string, sectionId: string, pageData: any) => {
  const pageRef = collection(db, 'courses', courseId, 'sections', sectionId, 'pages');
  return addDoc(pageRef, pageData);
};

export const updatePage = async (courseId: string, sectionId: string, pageId: string, pageData: any) => {
  const pageRef = doc(db, 'courses', courseId, 'sections', sectionId, 'pages', pageId);
  return updateDoc(pageRef, pageData);
};

export const getPages = async (courseId: string, sectionId: string) => {
  const pagesRef = collection(db, 'courses', courseId, 'sections', sectionId, 'pages');
  const q = query(pagesRef, orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};