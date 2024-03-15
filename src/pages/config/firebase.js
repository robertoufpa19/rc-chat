// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-KT2QQu50aYmXIko4REI11VjFyWh-3IQ",
  authDomain: "react-native-chat-a146e.firebaseapp.com",
  projectId: "react-native-chat-a146e",
  storageBucket: "react-native-chat-a146e.appspot.com",
  messagingSenderId: "996893567495",
  appId: "1:996893567495:web:f635b1eb5e20709637d8a2",
  measurementId: "G-HNC3PY56D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, db }; 
