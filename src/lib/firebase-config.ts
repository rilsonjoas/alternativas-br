// Configurações do Firebase
// As variáveis são carregadas do arquivo .env.local

const firebaseConfig = {
  apiKey: "AIzaSyBiUNvJc-sBHkjYSpgqeOqtabDcC3wbb08",
  authDomain: "alternativas-br.firebaseapp.com",
  projectId: "alternativas-br",
  storageBucket: "alternativas-br.firebasestorage.app",
  messagingSenderId: "980293963848",
  appId: "1:980293963848:web:e1e7e0722b4197565e487d",
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