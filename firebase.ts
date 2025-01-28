// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain:process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINSENDERID,
    appId: process.env.FIREBASE_APPID
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const firebaseApp = getApp();
export const storage = getStorage(firebaseApp, "gs://web-arch-file.appspot.com/");


export default appFirebase;
