// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvRGQ5yIHW_9YyZk6rdDlwaYqRw6tc7v8",
  authDomain: "fooddonation-223cc.firebaseapp.com",
  projectId: "fooddonation-223cc",
  storageBucket: "fooddonation-223cc.firebasestorage.app",
  messagingSenderId: "478488255793",
  appId: "1:478488255793:web:b69c77da73f1d4bf592410",
  measurementId: "G-W2CZTKZZLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export const storage = getStorage(app);
export { auth, db };