import pathlib, re, shutil
d = pathlib.Path(__file__).parent
out = d.parent / "site-live"
if out.exists():
    for c in out.iterdir():
        if c.name == ".git": continue
        shutil.rmtree(c) if c.is_dir() else c.unlink()
(out/"img").mkdir(parents=True, exist_ok=True); (out/"src").mkdir(exist_ok=True)
html = (d/"a.html").read_text()

desc = "Shiva Rajbhandari builds institutions and policy at the intersection of climate, democracy and innovation. MPP candidate at UNC–Chapel Hill, from Boise."
title = "Shiva Rajbhandari | Public policy, climate and democracy"
import json
ld = json.dumps({"@context":"https://schema.org","@type":"Person","name":"Shiva Rajbhandari","url":"https://www.shivarajbhandari.com/","image":"https://www.shivarajbhandari.com/img/headshot.jpg","description":desc,"alumniOf":{"@type":"CollegeOrUniversity","name":"University of North Carolina at Chapel Hill","sameAs":"https://www.unc.edu/"},"knowsAbout":["Public policy","Climate policy","Democracy","Design innovation"],"sameAs":["https://www.linkedin.com/in/shiva-rajbhandari/"]}, ensure_ascii=False)
fav = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%2316271F'/%3E%3Ctext x='32' y='41' font-family='Georgia,serif' font-size='26' text-anchor='middle' fill='%23EDF1E7'%3ESR%3C/text%3E%3C/svg%3E"
head_extra = f'''<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://www.shivarajbhandari.com/">
<meta property="og:site_name" content="Shiva Rajbhandari">
<meta property="og:image" content="https://www.shivarajbhandari.com/img/og-card.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Shiva Rajbhandari: climate, democracy, innovation">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="https://www.shivarajbhandari.com/img/og-card.jpg">
<link rel="canonical" href="https://www.shivarajbhandari.com/">
<link rel="icon" href="{fav}">
<meta name="theme-color" content="#E3E9DC">
<script type="application/ld+json">{ld}</script>
'''
html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.S)
html = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', html, count=1)
html = html.replace("<script>document.documentElement.classList.add('js')</script>", head_extra + "<script>document.documentElement.classList.add('js')</script>", 1)
(out/"index.html").write_text(html)

used = sorted(set(re.findall(r"img/([\w\-\.]+\.jpg)", html)))
for f in used: shutil.copy(d/"img"/f, out/"img"/f)
shutil.copy(d/"img"/"og-card.jpg", out/"img"/"og-card.jpg")
import datetime
(out/"sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.shivarajbhandari.com/</loc><lastmod>{datetime.date.today().isoformat()}</lastmod></url>\n</urlset>\n')
(out/"robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: https://www.shivarajbhandari.com/sitemap.xml\n")
(out/"CNAME").write_text("www.shivarajbhandari.com\n")
(out/".nojekyll").write_text("")
for f in ("body.html","a.css","build.py","gen_map.py","make_dist.py","map.svg.html"): shutil.copy(d/f, out/"src"/f)
(out/"README.md").write_text("""# www.shivarajbhandari.com

Personal site for Shiva Rajbhandari. A single static page, no build tools required to host it.

- `index.html` is the built page (CSS and JS inline). `img/` holds its images.
- `src/` holds the editable pieces: `body.html` (content), `a.css` (styles), `gen_map.py` (research map), `build.py` and `make_dist.py` (assemble the page).
- Hosted on GitHub Pages. `CNAME` points the custom domain.
""")
print("images:", used); print("size KB:", (out/"index.html").stat().st_size//1024)
