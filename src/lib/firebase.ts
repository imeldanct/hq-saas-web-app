
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-4927644298-1f723",
  appId: "1:925709591672:web:093b6df48c0b3cd2c5398d",
  apiKey: "AIzaSyD_RvfyYDjf1pNXTVgB_O-nFEjvHxgOBmU",
  authDomain: "studio-4927644298-1f723.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "925709591672"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
