// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/compat/app";
import {getAuth} from 'firebase/compat/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuh3g6xopDh9FOhrM4W0LjIjw_NOvu_ic",
    authDomain: "se3316-pparlato-jjohn483-lab4.firebaseapp.com",
    projectId: "se3316-pparlato-jjohn483-lab4",
    storageBucket: "se3316-pparlato-jjohn483-lab4.appspot.com",
    messagingSenderId: "393530132117",
    appId: "1:393530132117:web:9c1bc00dae89a62244fd9c",
    measurementId: "G-YY9YP5YCVM"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  export const auth = getAuth(firebaseApp);
