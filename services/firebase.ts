
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

// --- CONFIGURATION ---
// IMPORTANT: Add your Gmail address here to grant yourself admin access.
// Anyone else logging in will see an "Access Denied" screen.
export const ADMIN_EMAILS = [
    "jeherulislam0069@gmail.com"
];

const firebaseConfig = {
  apiKey: "AIzaSyCY4RpDOJRJfgVTKd-QT0uGcJUKny6Knc0",
  authDomain: "jeherul01.firebaseapp.com",
  projectId: "jeherul01",
  storageBucket: "jeherul01.firebasestorage.app",
  messagingSenderId: "584841154648",
  appId: "1:584841154648:web:e90351abba1ade05e7ba2d",
  measurementId: "G-N4QNY0JNYM"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- AUTH FUNCTIONS ---

export const loginWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// Check if a user is an admin
export const isAdmin = (user: User | null): boolean => {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email);
};
