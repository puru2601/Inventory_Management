import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC9Ur64YSOAQhK-7B8JHbOcnZ7bj5fg_mk",
  authDomain: "inventory-control-ae8aa.firebaseapp.com",
  projectId: "inventory-control-ae8aa",
  storageBucket: "inventory-control-ae8aa.appspot.com",
  messagingSenderId: "622047089616",
  appId: "1:622047089616:web:495ae0056fd5a1d8bfdfd5",
  measurementId: "G-G8BV4P5GSZ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
