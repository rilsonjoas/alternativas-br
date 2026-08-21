/**
 * Prerender — gera HTML estatico com conteudo real do Firestore.
 *
 * Em vez de Puppeteer, gera o HTML diretamente com dados do Firestore
 * embutidos no <div id="root">. O Googlebot ve conteudo real, e quando
 * o JS carrega, o React "hidrata" por cima.
 *
 * Rodar com: tsx scripts/prerender.ts
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://alternativasbr.com.br';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBiUNvJc-sBHkjYSpgqeOqtabDcC3wbb08',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'alternativas-br.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'alternativas-br',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'alternativas-br.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '980293963848',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:980293963848:web:e1e7e0722b4197565e487d',
};

interface Product {
  slug: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  tags?: string[];
  features?: string[];
  alternativeTo?: string[];
  metaTitle?: string;
  metaDescription?: string;
  pricing?: {
    type?: string;
    description?: string;
    plans?: Array<{ name: string; price: string; description: string }>;
  };
  location?: { city?: string; country?: string };
  companyInfo?: { foundedYear?: number; headquarters?: string };
  foundedYear?: number;
  isUnicorn?: boolean;
  upvotes?: number;
}

async function fetchAllProducts(): Promise<Product[]> {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, 'products'));

  const products: Product[] = [];
  snapshot.forEach((doc) => {
    const d = doc.data();
    if (d.slug) {
      products.push({
        slug: d.slug,
        name: d.name || '',
        description: d.description || '',
        logo: d.logo || '',
        website: d.website || '',
        tags: d.tags || [],
        features: d.features || [],
        alternativeTo: d.alternativeTo || [],
        metaTitle: d.metaTitle,
        metaDescription: d.metaDescription,
        pricing: d.pricing,
        location: d.location,
        companyInfo: d.companyInfo,
        foundedYear: d.foundedYear,
        isUnicorn: d.isUnicorn,
        upvotes: d.upvotes,
      });
    }
  });
  return products;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Cache do shell limpo do Vite (antes de qualquer escrita)
const VITE_SHELL = fs.readFileSync(INDEX_HTML, 'utf-8');

function wrapShell(innerHtml: string, title: string, description: string, canonical: string, jsonLd?: string): string {
  let shell = VITE_SHELL;
  shell = shell.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  shell = shell.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(description)}"`
  );
  // Remove tags originais do Vite pra evitar duplicata
  shell = shell.replace(/<link rel="canonical" href="[^"]*" \/? ?>/, '');
  shell = shell.replace(/<meta property="og:title" content="[^"]*" \/? ?>/, '');
  shell = shell.replace(/<meta property="og:description" content="[^"]*" \/? ?>/, '');
  shell = shell.replace(/<meta property="og:url" content="[^"]*" \/? ?>/, '');
  shell = shell.replace(/<meta property="og:type" content="[^"]*" \/? ?>/, '');
  shell = shell.replace(/<meta name="twitter:title" content="[^"]*" \/? ?>/, '');
  shell = shell.replace(/<meta name="twitter:description" content="[^"]*" \/? ?>/, '');
  const metaTags = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : '',
  ].filter(Boolean).join('\n    ');
  shell = shell.replace('</head>', `    ${metaTags}\n  </head>`);
  shell = shell.replace('<div id="root"></div>', `<div id="root">${innerHtml}</div>`);
  return shell;
}

function productJsonLd(p: Product): string {
  const offers = (p.pricing?.plans || []).map(plan => ({
    "@type": "Offer",
    name: plan.name,
    description: plan.description,
    price: plan.price?.includes("Gratuito") ? "0" : plan.price,
    priceCurrency: "BRL",
  }));
  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.description,
    applicationCategory: p.tags?.[0] || "Software",
    operatingSystem: "Web",
    url: p.website,
  };
  if (offers.length > 0) obj.offers = offers;
  return JSON.stringify(obj);
}

function renderProduct(p: Product): string {
  const tags = (p.tags || []).map(t => `<span class="px-3 py-1 text-xs font-medium rounded-full bg-gray-50/50 border border-gray-200/50 text-muted-foreground">${esc(t)}</span>`).join('');
  const plans = (p.pricing?.plans || []).map(pl => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
      <div class="flex-1">
        <div class="font-bold text-sm text-gray-900">${esc(pl.name)}</div>
        <div class="text-[10px] text-gray-500">${esc(pl.description)}</div>
      </div>
      <div class="text-right">
        <div class="font-extrabold text-sm text-primary">${esc(pl.price)}</div>
      </div>
    </div>`).join('');
  const feats = (p.features || []).map(f => `
    <div class="flex items-start gap-5 p-6 rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 border border-green-200/60">
      <span class="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
      <span class="text-lg font-semibold text-gray-800 leading-relaxed">${esc(f)}</span>
    </div>`).join('');
  const alts = (p.alternativeTo || []).map(a => `<span class="text-base py-3 px-5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold">${esc(a)}</span>`).join('');

  const founded = p.companyInfo?.foundedYear || p.foundedYear;
  const sede = p.companyInfo?.headquarters || [p.location?.city, p.location?.country].filter(Boolean).join(', ') || '-';

  return `
    <header class="border-b border-border/50 bg-gradient-to-br from-background/95 to-primary/5 backdrop-blur-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid lg:grid-cols-3 gap-12 items-start">
          <div class="lg:col-span-2 space-y-8">
            <div class="flex flex-col items-center md:items-start gap-6">
              <div class="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white border border-gray-100 shadow-xl flex items-center justify-center overflow-hidden">
                ${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" class="w-full h-full object-contain p-3 md:p-4" />` : `<div class="w-full h-full bg-primary/5 flex items-center justify-center text-4xl md:text-5xl font-bold text-primary/30">${esc(p.name[0])}</div>`}
              </div>
              <div class="text-center md:text-left space-y-4">
                <h1 class="text-3xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">${esc(p.name)}${p.isUnicorn ? ' <span class="text-xs px-3 py-0.5 bg-purple-100 text-purple-700 rounded-full align-middle">Unicornio</span>' : ''}</h1>
                <p class="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">${esc(p.description)}</p>
              </div>
            </div>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              ${founded ? `<span class="text-xs font-semibold px-3 py-1.5 bg-white/80 rounded-full border border-gray-100 shadow-sm">Desde ${founded}</span>` : ''}
              ${sede !== '-' ? `<span class="text-xs font-semibold px-3 py-1.5 bg-white/80 rounded-full border border-gray-100 shadow-sm">${esc(sede)}</span>` : ''}
            </div>
            <div class="flex flex-wrap justify-center md:justify-start gap-2">${tags}</div>
          </div>
          <div class="space-y-6">
            ${plans ? `<div class="border-gray-100 bg-white shadow-xl rounded-2xl overflow-hidden border-none">
              <div class="bg-gradient-to-br from-primary/5 to-transparent border-b border-gray-50 pb-4 p-5">
                <h2 class="flex items-center gap-3 text-lg font-bold">Opcoes de Preco</h2>
              </div>
              <div class="p-5 space-y-3">
                <p class="text-muted-foreground mb-4 text-sm leading-relaxed">${esc(p.pricing?.description || 'Consulte os planos abaixo')}</p>
                ${plans}
              </div>
            </div>` : ''}
            <a href="${esc(p.website)}" target="_blank" rel="noopener noreferrer" class="block w-full h-12 text-sm font-bold rounded-xl shadow-md bg-primary text-primary-foreground text-center leading-[48px]">Visitar Site Oficial</a>
          </div>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <section>
        <div class="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20 p-5">
            <h2 class="text-2xl font-bold">Sobre o ${esc(p.name)}</h2>
          </div>
          <div class="p-8">
            <p class="text-foreground/90 leading-relaxed text-lg mb-8 font-medium">${esc(p.description)}</p>
            <hr class="my-8" />
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="font-bold text-xl mb-6">Informacoes da Empresa</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 border border-border/5">
                    <span class="text-muted-foreground font-semibold text-base uppercase tracking-tight">Empresa:</span>
                    <span class="font-bold text-foreground text-lg">${esc(p.name)}</span>
                  </div>
                  <div class="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 border border-border/5">
                    <span class="text-muted-foreground font-semibold text-base uppercase tracking-tight">Fundacao:</span>
                    <span class="font-bold text-foreground text-lg">${founded || '-'}</span>
                  </div>
                  <div class="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 border border-border/5">
                    <span class="text-muted-foreground font-semibold text-base uppercase tracking-tight">Sede:</span>
                    <span class="font-bold text-foreground text-lg">${esc(sede)}</span>
                  </div>
                  <div class="flex justify-between items-center py-4 px-5 rounded-xl bg-muted/30 border border-border/5">
                    <span class="text-muted-foreground font-semibold text-base uppercase tracking-tight">Site:</span>
                    <span class="font-bold text-lg"><a href="${esc(p.website)}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${esc(p.website.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="font-bold text-xl mb-6">Caracteristicas</h3>
                <div class="space-y-3">
                  ${p.isUnicorn ? '<div class="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200"><span class="font-medium text-purple-800">Empresa Unicornio</span></div>' : ''}
                  <div class="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200"><span class="font-medium text-green-800">100% Brasileira</span></div>
                  <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200"><span class="font-medium text-blue-800">Suporte em Portugues</span></div>
                  <div class="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200"><span class="font-medium text-yellow-800">Adequada a legislacao brasileira</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${feats ? `<section><div class="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20 p-5"><h2 class="text-2xl font-bold">Principais Recursos</h2></div>
        <div class="p-8"><div class="grid md:grid-cols-2 gap-6">${feats}</div></div>
      </div></section>` : ''}
      ${alts ? `<section><div class="border-border/50 bg-background/95 backdrop-blur-sm shadow-elegant rounded-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20 p-5"><h2 class="text-2xl font-bold">Alternativa Brasileira</h2></div>
        <div class="p-8">
          <p class="text-muted-foreground text-lg mb-6 leading-relaxed">Este produto brasileiro oferece funcionalidades similares aos seguintes servicos internacionais:</p>
          <div class="flex flex-wrap gap-3 mb-8">${alts}</div>
          <div class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h4 class="font-bold text-green-800 text-lg mb-3">Por que escolher uma alternativa brasileira?</h4>
            <ul class="text-green-700 space-y-3">
              <li>Suporte em portugues brasileiro</li>
              <li>Adequacao a legislacao nacional</li>
              <li>Proximidade cultural e temporal</li>
              <li>Fortalecimento do ecossistema brasileiro</li>
            </ul>
          </div>
        </div>
      </div></section>` : ''}
    </main>`;
}

async function prerender() {
  console.log('Buscando produtos no Firestore...');

  let products: Product[] = [];
  try {
    products = await fetchAllProducts();
    console.log(`${products.length} produtos encontrados`);
  } catch (err: unknown) {
    console.error('Nao conseguiu buscar produtos:', err instanceof Error ? err.message : err);
  }

  let count = 0;

  // Home page
  const homeHtml = wrapShell(
    `<header class="border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-foreground mb-6">Tecnologia Brasileira</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">Promovendo o ecossistema de tecnologia brasileiro atraves da descoberta de alternativas nacionais as ferramentas internacionais.</p>
        <div class="flex justify-center gap-4">
          <a href="/alternativas" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold">Explorar Alternativas</a>
          <a href="/sobre" class="px-6 py-3 border border-border rounded-lg font-semibold">Sobre o Projeto</a>
        </div>
      </div>
    </header>`,
    'AlternativasBR - Descubra Softwares Brasileiros',
    'O maior diretorio de softwares e SaaS brasileiros. Encontre a alternativa nacional ideal para as ferramentas que voce ja usa.',
    BASE_URL
  );
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeHtml, 'utf-8');
  count++;
  console.log(`  OK / (${(homeHtml.length / 1024).toFixed(1)}KB)`);

  // Product pages
  for (const p of products) {
    const route = `/produto/${p.slug}`;
    const dir = path.join(DIST_DIR, route);
    fs.mkdirSync(dir, { recursive: true });

    const title = p.metaTitle || `${p.name} | AlternativasBR`;
    const desc = p.metaDescription || p.description;
    const canonical = `${BASE_URL}${route}`;
    const html = wrapShell(renderProduct(p), title, desc, canonical, productJsonLd(p));

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    count++;
    console.log(`  OK ${route} (${(html.length / 1024).toFixed(1)}KB)`);
  }

  console.log(`\nPrerender concluido: ${count} arquivos gerados em ${DIST_DIR}`);
}

prerender().then(() => process.exit(0)).catch((err) => {
  console.error('Erro no prerender:', err);
  process.exit(1);
});
