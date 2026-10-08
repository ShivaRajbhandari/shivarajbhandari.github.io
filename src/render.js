// Draws the whole page from the content files. Used by build.js (publishing) and admin/preview.js (live preview),
// so what you see in the editor is exactly what gets published.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.SiteRender = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); };
  // Inline formatting: [text](link), **bold**, *italic*
  var md = function (s) {
    var t = esc(s);
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, a, u) { return '<a href="' + u + '"' + (/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '') + '>' + a + '</a>'; });
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return t;
  };
  var paras = function (s) { return String(s || '').split(/\n\s*\n/).filter(function (x) { return x.trim(); }).map(function (x) { return '<p>' + md(x.trim()) + '</p>'; }).join(''); };
  var head = function (num, title) { return '<div class="section-head reveal"><span class="num">' + esc(num) + '</span><h2>' + esc(title) + '</h2></div>'; };
  var tip = function (title, text) { return (title || text) ? '<span class="tip" role="tooltip"><b>' + esc(title) + '</b> ' + md(text) + '</span>' : ''; };
  var band = function (img, tall) { return img ? '<div class="photo-band' + (tall ? ' tall' : '') + '" aria-hidden="true" style="--img:url(' + esc(img) + ')"></div>' : ''; };
  var sep = ' &middot; ';
  var R = {esc: esc, md: md, paras: paras};

  R.header = function (site) {
    var n = site.nav || {}, b = site.brand || {};
    return '<a class="skip" href="#main">Skip to content</a>\n<header class="nav" id="nav">\n  <a class="brand" href="#top" aria-label="' + esc(b.name) + ', home"><span class="brand-mark">' + esc(b.mark) + '</span><span class="brand-name">' + esc(b.name) + '</span></a>\n  <nav aria-label="Primary">\n' +
      (n.links || []).map(function (l) { return '    <a href="' + esc(l.target) + '">' + esc(l.label) + '</a>\n'; }).join('') +
      '    <a class="jump" href="' + esc(n.jump_target || '#contact') + '">' + esc(n.jump_label) + ' <span aria-hidden="true">↓</span></a>\n  </nav>\n</header>';
  };
  R.hero = function (h) {
    var p = h.portrait || {}, a = h.primary_button || {}, b = h.secondary_button || {};
    return '<section class="hero" id="top">\n<div class="hero-text"><p class="eyebrow">' + esc(h.eyebrow) + '</p><h1>' + esc(h.first_name) + ' <span class="em">' + esc(h.last_name) + '</span></h1><p class="lede">' + esc(h.lede) + '</p><p class="sub">' + esc(h.sub) + '</p>' +
      '<div class="cta"><a class="btn primary" href="' + esc(a.target) + '">' + esc(a.label) + '</a><a class="btn ghost" href="' + esc(b.target) + '">' + esc(b.label) + '</a></div></div>\n' +
      '<figure class="portrait"><div class="portrait-frame"><span>' + esc(p.initials) + '</span><img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" onerror="this.remove()"></div></figure>\n' +
      '<ul class="facts" aria-label="' + esc(h.facts_label) + '">' + (h.facts || []).map(function (f) { return '<li><strong>' + esc(f.value) + '</strong><span>' + esc(f.text) + '</span></li>'; }).join('') + '</ul>\n</section>';
  };
  R.now = function (d) {
    return '<section class="now" id="now">' + head(d.number, d.heading) + '<div class="now-grid">' + (d.cards || []).map(function (c) {
      return '<article class="card reveal"><p class="tag">' + esc(c.tag) + '</p><h3>' + esc(c.title) + '</h3><p>' + md(c.body) + '</p></article>'; }).join('') + '</div></section>';
  };
  R.about = function (d) {
    return '<section class="block" id="about">' + head(d.number, d.heading) + '<div class="block-body reveal"><p class="big">' + md(d.big) + '</p>' + paras(d.body) +
      '<dl class="mini">' + (d.details || []).map(function (x) { return '<div><dt>' + esc(x.label) + '</dt><dd>' + md(x.text) + '</dd></div>'; }).join('') + '</dl></div></section>';
  };
  R.building = function (d) {
    return '<section class="block" id="building">' + head(d.number, d.heading) + '<ol class="timeline">' + (d.items || []).map(function (i) {
      return '<li class="reveal"><span class="when">' + esc(i.when) + '</span><div><h3>' + esc(i.title) + '</h3><p>' + md(i.body) + '</p></div></li>'; }).join('') + '</ol></section>';
  };
  R.research = function (d, mapSvg) {
    var map = d.map || {}, cls = d.classes || {}, er = d.earlier || {}, c = d.course || {};
    return '<section class="block" id="research">' + head(d.number, d.heading) + '<div class="paper-grid">' + (d.papers || []).map(function (p) {
      return '<article class="paper reveal"><p class="tag">' + esc(p.tag) + '</p>' + (p.award ? '<p class="award"><span aria-hidden="true">&#9733;</span> ' + esc(p.award) + '</p>' : '') + '<h3>' + esc(p.title) + '</h3><p>' + md(p.body) + '</p>' +
        (p.advisors ? '<p class="advisors">' + esc(p.advisors) + '</p>' : '') + (p.link_url ? '<a href="' + esc(p.link_url) + '">' + esc(p.link_text) + ' &rarr;</a>' : '') + '</article>'; }).join('') + '</div>' +
      '<article class="teach reveal"><p class="tag">' + esc(c.tag) + '</p><h3>' + esc(c.title) + '</h3><p>' + md(c.body) + '</p>' + (c.advisors ? '<p class="advisors">' + esc(c.advisors) + '</p>' : '') + '</article>' +
      '<div class="mapblock reveal"><h3>' + esc(map.heading) + '</h3>' + (mapSvg || '') + '<ul class="places">' + (map.places || []).map(function (p) {
        return '<li data-c="' + esc(p.country) + '"><strong>' + esc(p.country) + '</strong><span>' + md(p.text) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="classes reveal"><h3>' + esc(cls.heading) + '</h3><ul>' + (cls.items || []).map(function (i) {
        return '<li><strong><em class="code">' + esc(i.code) + '</em>' + esc(i.title) + '</strong><span>' + md(i.text) + '</span></li>'; }).join('') + '</ul></div>' +
      '<p class="earlier extra reveal"><span>' + esc(er.label) + '</span>\n' + (er.items || []).map(function (i) {
        return '<a class="inline-chip" href="' + esc(i.url) + '">' + esc(i.label) + tip(i.tip_title, i.tip_text) + '</a>'; }).join(sep + '\n') + '\n</p></section>';
  };
  var chip = function (i, inline) {
    return inline ? '<span class="inline-chip" tabindex="0">' + esc(i.name) + tip(i.tip_title, i.tip_text) + '</span>'
                  : '<li tabindex="0">' + esc(i.name) + (i.year ? ' <small>' + esc(i.year) + '</small>' : '') + tip(i.tip_title, i.tip_text) + '</li>';
  };
  R.recognition = function (d) {
    return '<section class="block" id="recognition">' + head(d.number, d.heading) + '<div class="recog reveal"><ul class="chips big">' + (d.featured || []).map(function (i) { return chip(i); }).join('') + '</ul><ul class="chips">' +
      (d.more || []).map(function (i) { return chip(i); }).join('') + '</ul><p class="earlier"><span>' + esc(d.earlier_label) + '</span>\n' + (d.earlier || []).map(function (i) { return chip(i, true); }).join(sep + '\n') + '\n</p>' +
      (d.hint ? '<p class="hint">' + esc(d.hint) + '</p>' : '') + '</div></section>';
  };
  R.contact = function (d) {
    return '<section class="contact' + (d.background ? ' has-photo' : '') + '" id="contact"' + (d.background ? ' style="--img:url(' + esc(d.background) + ')"' : '') + '>' + head(d.number, d.heading) +
      '<div class="contact-body reveal"><p class="big">' + md(d.big) + '</p><ul class="contact-list">' + (d.items || []).map(function (i) {
        return '<li><span>' + esc(i.label) + '</span><a href="' + esc(i.url) + '">' + esc(i.text) + '</a></li>'; }).join('') + '</ul></div></section>';
  };
  R.footer = function (site) {
    var f = site.footer || {};
    return '<footer class="foot"><span>' + esc(f.copyright) + '</span><a href="#top">' + esc(f.back_to_top) + ' &uarr;</a></footer>';
  };
  R.body = function (c, mapSvg) {
    return [R.header(c.site), '<main id="main">', R.hero(c.home), R.now(c.now), band(c.now.photo_after), R.about(c.about), R.building(c.building), R.research(c.research, mapSvg),
      band(c.research.photo_after, true), R.recognition(c.recognition), R.contact(c.contact), '</main>', R.footer(c.site)].join('\n\n');
  };
  // Fonts and colors
  var HEADING = {'Fraunces': 'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400', 'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,500;0,600;1,400', 'Lora': 'Lora:ital,wght@0,400;0,500;0,600;1,400', 'Source Serif 4': 'Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400'};
  var BODY = {'Inter': 'Inter:wght@400;500;600;700', 'DM Sans': 'DM+Sans:wght@400;500;600;700', 'Source Sans 3': 'Source+Sans+3:wght@400;500;600;700', 'Work Sans': 'Work+Sans:wght@400;500;600;700'};
  R.fontsUrl = function (site) {
    var f = site.fonts || {}, h = HEADING[f.heading] || HEADING.Fraunces, b = BODY[f.body] || BODY.Inter;
    return 'https://fonts.googleapis.com/css2?family=' + h + '&family=' + b + '&display=swap';
  };
  var hex = function (v) { return /^#[0-9a-fA-F]{3,8}$/.test(v || '') ? v : null; };
  var vars = function (o) { return Object.keys(o || {}).filter(function (k) { return hex(o[k]) && /^(bg|paper|ink|muted|line|accent|river)$/.test(k); }).map(function (k) { return '--' + k + ':' + o[k]; }).join(';'); };
  R.themeCss = function (site) {
    var t = site.theme || {}, f = site.fonts || {};
    var fam = (HEADING[f.heading] ? "--serif:'" + f.heading + "',Georgia,serif;" : '') + (BODY[f.body] ? "--sans:'" + f.body + "',system-ui,sans-serif;" : '');
    return ':root{' + vars(t.light) + (vars(t.light) ? ';' : '') + fam + '}\n@media (prefers-color-scheme: dark){:root{' + vars(t.dark) + '}}';
  };
  return R;
});
