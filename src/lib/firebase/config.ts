import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCBNp9xDPDCPvpqy32bYoU5FqxcVLMBhg",
  authDomain: "jce-tasks.firebaseapp.com",
  projectId: "jce-tasks",
  storageBucket: "jce-tasks.firebasestorage.app",
  messagingSenderId: "808775126911",
  appId: "1:808775126911:web:3b19db36059626bf3fd44a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);