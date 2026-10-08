# www.shivarajbhandari.com

Personal site for Shiva Rajbhandari. A single page, built from editable content files.

- **Edit the site:** go to `/admin` on the site and sign in with GitHub. Every save rebuilds and publishes the page.
- `content/*.json` is all the text and settings (edited through `/admin`, or by hand).
- `src/render.js` draws the page (also used for the live preview), `src/a.css` is the design, `src/map.svg.html` is the research map.
- `build.js` assembles `dist/` (run by GitHub Actions; `node build.js` locally). `img/` holds the pictures.
- `src/gen_map.py` is the original generator for the map graphic. The map only highlights Mexico, Peru, Chile, Uruguay, Nepal and Egypt; adding a country means regenerating it.
- Hosted on GitHub Pages. `CNAME` sets the custom domain. This is a public repository, so keep private information out of it.
