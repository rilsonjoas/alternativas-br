// Configurações do Firebase
// As variáveis são carregadas do arquivo .env.local

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Coleções do Firestore
export const COLLECTIONS = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRICING_PLANS: 'pricing_plans',
  REVIEWS: 'reviews',
} as const;
