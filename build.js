#!/usr/bin/env node
// Builds the site into dist/ from content/*.json. No dependencies (Node 18+).
const fs = require('fs'), path = require('path');
const R = require('./src/render.js');
const root = __dirname, out = path.join(root, 'dist');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const names = ['site', 'home', 'now', 'about', 'building', 'research', 'recognition', 'contact'];
const c = {}; names.forEach((n) => { c[n] = JSON.parse(rd('content/' + n + '.json')); });
const ORIGIN = rd('CNAME').trim(); const URL_ = 'https://' + ORIGIN + '/';
const mapSvg = rd('src/map.svg.html');
const seo = c.site.seo, brand = c.site.brand, th = (c.site.theme || {}).light || {};
const a = R.esc, desc = a(seo.description), title = a(seo.title);
const linkedin = (c.contact.items || []).map((i) => i.url).find((u) => /linkedin\.com/.test(u));
const ld = JSON.stringify({'@context': 'https://schema.org', '@type': 'Person', name: brand.name, url: URL_, image: URL_ + 'img/headshot.jpg', description: seo.description,
  alumniOf: {'@type': 'CollegeOrUniversity', name: 'University of North Carolina at Chapel Hill', sameAs: 'https://www.unc.edu/'},
  knowsAbout: ['Public policy', 'Climate policy', 'Democracy', 'Design innovation'], sameAs: linkedin ? [linkedin] : []}).replace(/</g, '\\u003c');
const fav = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%2316271F'/%3E%3Ctext x='32' y='41' font-family='Georgia,serif' font-size='26' text-anchor='middle' fill='%23EDF1E7'%3E" + encodeURIComponent(brand.mark) + "%3C/text%3E%3C/svg%3E";
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${a(R.fontsUrl(c.site))}" rel="stylesheet">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${URL_}">
<meta property="og:site_name" content="${a(brand.name)}">
<meta property="og:image" content="${URL_}img/og-card.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${a(seo.image_alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${URL_}img/og-card.jpg">
<link rel="canonical" href="${URL_}">
<link rel="icon" href="${fav}">
<meta name="theme-color" content="${a(th.bg || '#E3E9DC')}">
<script type="application/ld+json">${ld}</script>
<script>document.documentElement.classList.add('js')</script>
<style>${rd('src/a.css')}
${R.themeCss(c.site)}</style>
</head>
<body>
${R.body(c, mapSvg)}
<script>
${rd('src/script.js').trim()}
</script>

</body>
</html>`;
fs.rmSync(out, {recursive: true, force: true}); fs.mkdirSync(out, {recursive: true});
const cp = (s, d) => fs.cpSync(path.join(root, s), path.join(out, d), {recursive: true});
fs.writeFileSync(path.join(out, 'index.html'), html);
cp('img', 'img'); cp('CNAME', 'CNAME'); cp('content', 'content');
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'googlec29395e74e8d042a.html'), 'google-site-verification: googlec29395e74e8d042a.html');
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ' + URL_ + 'sitemap.xml\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + URL_ + '</loc><lastmod>' + new Date().toISOString().slice(0, 10) + '</lastmod></url>\n</urlset>\n');
cp('admin', 'admin'); cp('src/render.js', 'admin/render.js'); cp('src/a.css', 'admin/preview.css'); cp('src/map.svg.html', 'admin/map.svg.html');
console.log('built dist/index.html', Math.round(html.length / 1024) + ' KB');
