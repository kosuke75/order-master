import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore をインポート

const firebaseConfig = {
  apiKey: "AIzaSyDlhqHZFnf4bebWxEk9eAZMiJDTIIBznUo",
  authDomain: "order-80614.firebaseapp.com",
  projectId: "order-80614",
  storageBucket: "order-80614.firebasestorage.app",
  messagingSenderId: "285933137656",
  appId: "1:285933137656:web:6f384c419cf165531dd50d",
  measurementId: "G-9GCKYTWYXW"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);  // Firestore のインスタンスを作成

export { auth, provider, db };
