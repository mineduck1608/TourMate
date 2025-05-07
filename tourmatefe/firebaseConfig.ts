// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAnrdte2F_VtOXJjqaq4m7cUgzIvYe3MaU',
  authDomain: 'badmintoncourtbooking-183b2.firebaseapp.com',
  databaseURL: 'https://badmintoncourtbooking-183b2-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'badmintoncourtbooking-183b2',
  storageBucket: 'badmintoncourtbooking-183b2.appspot.com',
  messagingSenderId: '859078707099',
  appId: '1:859078707099:web:185eae36409c2810be833e',
  measurementId: 'G-51XHF6B2B5'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
//