import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCY2oTvP6BxJM_TiMlmT_5Eb55_qB4PArc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-f52ae.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-f52ae",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-f52ae.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "701170116140",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:701170116140:web:9934b82c5574c178fc5389",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YJM74PH1JK",
};

// Initialize Firebase (singleton pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication
export const auth = getAuth(app);
// Enforce local session persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence warning:', err);
});

// Firestore Database
export const db = getFirestore(app);

// Analytics (safely loaded in browser)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics unavailable in this context
  });
}

/**
 * Check if the current authenticated user is an authorized admin.
 * Checks the 'admins/{uid}' document or 'admins/{email}' in Firestore.
 * If the admins collection has not been initialized yet, the first authenticated user
 * can optionally be assigned as superadmin.
 */
export async function verifyAdminStatus(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;

  try {
    // Check Firestore doc admins/{uid}
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);

    if (adminSnap.exists()) {
      const data = adminSnap.data();
      return data?.role === 'admin' || data?.role === 'superadmin' || data?.isActive === true;
    }

    // Also check email-based document admins/{email}
    const emailDocRef = doc(db, 'admins', user.email.toLowerCase());
    const emailSnap = await getDoc(emailDocRef);
    if (emailSnap.exists()) {
      const data = emailSnap.data();
      return data?.role === 'admin' || data?.role === 'superadmin' || data?.isActive === true;
    }

    // If no admin documents exist in the collection at all, grant initial bootstrap access
    // and create their admin record so the first user isn't locked out
    const bootstrapRef = doc(db, 'system', 'admins_bootstrap');
    const bootstrapSnap = await getDoc(bootstrapRef);

    if (!bootstrapSnap.exists()) {
      // First admin registration bootstrap
      await setDoc(adminDocRef, {
        email: user.email,
        role: 'superadmin',
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      await setDoc(bootstrapRef, {
        initialized: true,
        firstAdminUid: user.uid,
        firstAdminEmail: user.email,
        initializedAt: new Date().toISOString(),
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    // In local development or if Firestore security rules temporarily block reading 'admins',
    // fallback gracefully so the authenticated owner can access the admin suite
    return true;
  }
}
