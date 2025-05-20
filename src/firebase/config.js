import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config object
  apiKey: "AIzaSyAU4q12dor6sB-SxflIgb-d1VKqwGNr8jk",
  authDomain: "todoapplication-15fa6.firebaseapp.com",
  projectId: "todoapplication-15fa6",
  storageBucket: "todoapplication-15fa6.appspot.com",
  messagingSenderId: "479127050846",
  appId: "1:479127050846:web:574a0529e00a835874f2cf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 