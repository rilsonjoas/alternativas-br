
import fs from 'fs';

const SITEMAP_PATH = './public/sitemap.xml';
const BASE_URL = 'https://alternativasbr.com.br';

const generateSitemap = () => {
  const routes = [
    '',
    '/explorar',
    '/sobre',
    '/admin',
  ];

  // We are generating a static sitemap for core pages. 
  // Dynamic product pages would require fetching from Firebase.
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
`).join('')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`Sitemap generated at ${SITEMAP_PATH}`);
};

generateSitemap();
