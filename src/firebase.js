// Firebase client init — reads config from REACT_APP_* env vars.
// Set these in .env.local (see .env.example for the list).
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);

let appInstance = null;
let dbInstance = null;
let authInstance = null;
let analyticsPromise = null; // lazy, resolves to Analytics or null

if (isFirebaseConfigured) {
  appInstance = initializeApp(firebaseConfig);
  dbInstance = getFirestore(appInstance);
  authInstance = getAuth(appInstance);

  // Analytics only works in the browser and only when GA is reachable.
  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    analyticsPromise = analyticsIsSupported()
      .then((ok) => (ok ? getAnalytics(appInstance) : null))
      .catch(() => null);
  }
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;

/** Resolves to a Firebase Analytics instance, or null if unsupported / unconfigured. */
export const getAnalyticsInstance = () => analyticsPromise || Promise.resolve(null);
