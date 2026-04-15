import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId']

function hasFirebaseConfig() {
  return requiredKeys.every((k) => String(firebaseConfig[k] || '').trim() !== '')
}

let app = null
let auth = null
let db = null
let analytics = null

if (hasFirebaseConfig()) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)

  // Analytics runs only in supported browser environments.
  if (typeof window !== 'undefined') {
    isAnalyticsSupported().then((supported) => {
      if (supported) analytics = getAnalytics(app)
    })
  }
} else {
  console.warn('[firebase] Firebase env vars are missing. Check .env values.')
}

export { app, auth, db, analytics, hasFirebaseConfig }
