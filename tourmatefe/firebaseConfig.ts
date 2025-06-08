import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnrdte2F_VtOXJjqaq4m7cUgzIvYe3MaU",
  authDomain: "badmintoncourtbooking-183b2.firebaseapp.com",
  databaseURL: "https://badmintoncourtbooking-183b2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "badmintoncourtbooking-183b2",
  storageBucket: "badmintoncourtbooking-183b2.appspot.com",
  messagingSenderId: "859078707099",
  appId: "1:859078707099:web:185eae36409c2810be833e",
  measurementId: "G-51XHF6B2B5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // 👈 Thêm dòng này
export const provider = new GoogleAuthProvider(); // 👈 Và dòng này
export const storage = getStorage(app);
