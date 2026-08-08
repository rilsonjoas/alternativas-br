export const environment = {
  production: false,
  firebase: {
    // Mesmo valor hardcoded de environment.prod.ts — process.env não
    // existe em runtime num bundle Angular normal (achado real,
    // 2026-08-08: quebrava o type-check no CI e, em dev, sempre
    // resolvia pra '' silenciosamente, sem conectar no Firebase de
    // verdade). Config pública do client SDK, não é segredo — a
    // segurança vem das regras do Firestore.
    apiKey: 'AIzaSyBiUNvJc-sBHkjYSpgqeOqtabDcC3wbb08',
    authDomain: 'alternativas-br.firebaseapp.com',
    projectId: 'alternativas-br',
    storageBucket: 'alternativas-br.firebasestorage.app',
    messagingSenderId: '980293963848',
    appId: '1:980293963848:web:e1e7e0722b4197565e487d',
    measurementId: 'G-7FTVYGNH79'
  }
};
