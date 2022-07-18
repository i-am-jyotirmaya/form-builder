// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCWR87TL9ZpuIWD3TirCrVXyRYBizwPY4",
  authDomain: "formbuilderreact.firebaseapp.com",
  projectId: "formbuilderreact",
  storageBucket: "formbuilderreact.appspot.com",
  messagingSenderId: "655780692619",
  appId: "1:655780692619:web:b6717b1cff3c017b080a8e",
  databaseUrl: "https://formbuilderreact-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
