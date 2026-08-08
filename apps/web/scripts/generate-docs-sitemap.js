// Gera public/sitemap.xml com as rotas estáticas + uma entrada real por
// produto cadastrado no Firestore (/produto/:slug — é aqui que a
// estratégia de SEO ("alternativa ao X") realmente precisa ranquear).
//
// Antes deste fix (2026-08-08): o sitemap só tinha 4 URLs fixas — home,
// /explorar, /sobre e, por engano, /admin (painel interno, não deveria
// estar público). Nenhuma página de produto individual estava listada,
// então o Google nunca soube que elas existiam.
//
// Rodar com: node scripts/generate-docs-sitemap.js
// (depois de `npm run build`, ou como parte do build, pra pegar produtos
// novos automaticamente a cada deploy)

import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const SITEMAP_PATH = './public/sitemap.xml';
const BASE_URL = 'https://alternativasbr.com.br';

// Mesmos valores de src/lib/firebase-config.ts (config pública do client
// SDK, não é segredo — a segurança vem das regras do Firestore, não de
// esconder isso).
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBiUNvJc-sBHkjYSpgqeOqtabDcC3wbb08',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'alternativas-br.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'alternativas-br',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'alternativas-br.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '980293963848',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:980293963848:web:e1e7e0722b4197565e487d',
};

async function fetchProductSlugs() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, 'products'));

  const slugs = [];
  snapshot.forEach((doc) => {
    const slug = doc.data().slug;
    if (slug) slugs.push(slug);
  });
  return slugs;
}

async function generateSitemap() {
  const staticRoutes = [
    { path: '', priority: '1.0' },
    { path: '/explorar', priority: '0.8' },
    { path: '/sobre', priority: '0.8' },
  ];

  let productSlugs = [];
  try {
    productSlugs = await fetchProductSlugs();
    console.log(`✅ ${productSlugs.length} produtos encontrados no Firestore`);
  } catch (err) {
    console.error('⚠️  Não consegui buscar produtos do Firestore — gerando sitemap só com rotas estáticas.', err.message);
  }

  const productRoutes = productSlugs.map((slug) => ({
    path: `/produto/${slug}`,
    priority: '0.7',
  }));

  const allRoutes = [...staticRoutes, ...productRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(({ path, priority }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`).join('')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`Sitemap gerado em ${SITEMAP_PATH} — ${allRoutes.length} URLs (${productRoutes.length} de produto)`);
}

// O Firestore SDK mantém uma conexão persistente aberta, então o
// processo Node nunca sai sozinho depois de terminar — sem isso, o
// script trava o `npm run build` indefinidamente. Achado real ao
// rodar pela primeira vez (2026-08-08).
generateSitemap().then(() => process.exit(0));
