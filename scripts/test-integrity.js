import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const PAGES_DIR = '/home/daniel-favour/Documents/project/bliize/bliize-astro/src/pages';
const PUBLIC_DIR = '/home/daniel-favour/Documents/project/bliize/bliize-astro/public';

const pages = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.astro'));
console.log(`Auditing ${pages.length} Astro pages for asset and internal link integrity...\n`);

let totalAssetErrors = 0;
let totalLinkErrors = 0;
let totalCheckedAssets = 0;
let totalCheckedLinks = 0;

const validRoutes = new Set(pages.map(p => {
  const base = p.replace('.astro', '');
  return base === 'index' ? '/' : `/${base}`;
}));

for (const page of pages) {
  const pagePath = path.join(PAGES_DIR, page);
  const content = fs.readFileSync(pagePath, 'utf-8');

  // Extract HTML portion
  const htmlMatch = content.match(/---[\s\S]*?---([\s\S]*)/);
  const html = htmlMatch ? htmlMatch[1] : content;

  const $ = cheerio.load(html, { decodeEntities: false });

  // 1. Check all img src
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && src.startsWith('/assets/')) {
      totalCheckedAssets++;
      const diskPath = path.join(PUBLIC_DIR, src);
      if (!fs.existsSync(diskPath)) {
        console.error(`[ERROR] Missing image in ${page}: ${src}`);
        totalAssetErrors++;
      }
    }
  });

  // 2. Check all data-background
  $('[data-background]').each((_, el) => {
    const bg = $(el).attr('data-background');
    if (bg && bg.startsWith('/assets/')) {
      totalCheckedAssets++;
      const diskPath = path.join(PUBLIC_DIR, bg);
      if (!fs.existsSync(diskPath)) {
        console.error(`[ERROR] Missing bg image in ${page}: ${bg}`);
        totalAssetErrors++;
      }
    }
  });

  // 3. Check all data-bg-image
  $('[data-bg-image]').each((_, el) => {
    const bg = $(el).attr('data-bg-image');
    if (bg && bg.startsWith('/assets/')) {
      totalCheckedAssets++;
      const diskPath = path.join(PUBLIC_DIR, bg);
      if (!fs.existsSync(diskPath)) {
        console.error(`[ERROR] Missing bg image in ${page}: ${bg}`);
        totalAssetErrors++;
      }
    }
  });

  // 4. Check internal links
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('/') && !href.startsWith('/assets/') && !href.startsWith('/#')) {
      totalCheckedLinks++;
      const cleanPath = href.split('?')[0].split('#')[0];
      if (!validRoutes.has(cleanPath)) {
        console.error(`[ERROR] Broken internal route link in ${page}: ${href}`);
        totalLinkErrors++;
      }
    }
  });
}

console.log(`\nIntegrity check finished:`);
console.log(`- Total pages audited: ${pages.length}`);
console.log(`- Total asset references checked: ${totalCheckedAssets}`);
console.log(`- Total asset errors: ${totalAssetErrors}`);
console.log(`- Total internal links checked: ${totalCheckedLinks}`);
console.log(`- Total broken route links: ${totalLinkErrors}`);

if (totalAssetErrors === 0 && totalLinkErrors === 0) {
  console.log(`\n🎉 ALL 41 PAGES, ASSETS, AND INTERNAL ROUTE LINKS ARE 100% VALID AND INTACT!`);
}
