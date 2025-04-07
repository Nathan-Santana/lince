// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDK6RwSH7oMyEJijiIF4-1voFXsLFsNW3Y",
  authDomain: "lince-monitor.firebaseapp.com",
  databaseURL: "https://lince-monitor-default-rtdb.firebaseio.com",
  projectId: "lince-monitor",
  storageBucket: "lince-monitor.firebasestorage.app",
  messagingSenderId: "464882599358",
  appId: "1:464882599358:web:18908208ebd0b2d08b65ef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
