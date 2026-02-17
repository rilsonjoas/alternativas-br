// Configurações do Firebase
// As variáveis são carregadas do arquivo .env.local

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBiUNvJc-sBHkjYSpgqeOqtabDcC3wbb08",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alternativas-br.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alternativas-br",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alternativas-br.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "980293963848",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:980293963848:web:e1e7e0722b4197565e487d",
  measurementId: "G-7FTVYGNH79"
};


// Coleções do Firestore
export const COLLECTIONS = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRICING_PLANS: 'pricing_plans',
  REVIEWS: 'reviews',
} as const;

export default firebaseConfig;