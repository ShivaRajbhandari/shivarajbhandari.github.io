// Live preview for the editor: draws your whole page (same code as the published site)
// with the section you are editing swapped in as you type, and scrolls to that section.
(function () {
  var R = window.SiteRender;
  var KEYS = ['site', 'home', 'now', 'about', 'building', 'research', 'recognition', 'contact', 'notfound'];
  var SECTION = {site: 'top', home: 'top', now: 'now', about: 'about', building: 'building', research: 'research', recognition: 'recognition', contact: 'contact', notfound: 'top'};
  var load = function () {
    return Promise.all(KEYS.map(function (k) { return fetch('/content/' + k + '.json?t=' + Date.now()).then(function (r) { return r.json(); }); })
      .concat([fetch('/admin/map.svg.html').then(function (r) { return r.text(); })])).then(function (res) {
      var others = {}; KEYS.forEach(function (k, i) { others[k] = res[i]; }); return {others: others, map: res[KEYS.length]};
    });
  };
  var make = function (key) {
    return createClass({
      getInitialState: function () { return {data: null}; },
      componentDidMount: function () { var self = this; load().then(function (d) { self.setState({data: d}); }); },
      render: function () {
        if (!this.state.data) return h('p', {style: {font: '16px system-ui', padding: '24px'}}, 'Loading preview…');
        var edited = this.props.entry.get('data'); edited = edited && edited.toJS ? edited.toJS() : {};
        var content = Object.assign({}, this.state.data.others); content[key] = edited;
        var html = '<link rel="stylesheet" href="' + R.esc(R.fontsUrl(content.site)) + '"><style>' + R.themeCss(content.site) + '</style>' + (key === 'notfound' ? R.notFoundBody(content) : R.body(content, this.state.data.map));
        var self = this;
        return h('div', {dangerouslySetInnerHTML: {__html: html}, ref: function (el) {
          if (!el || self._scrolled) return; self._scrolled = true;   // jump to the section being edited, once
          var go = function () { var d = el.ownerDocument, t = d.getElementById(SECTION[key]); if (t) { t.scrollIntoView({behavior: 'instant', block: 'start'}); if (SECTION[key] !== 'top') d.defaultView.scrollBy(0, -72); } };
          setTimeout(go, 80); setTimeout(go, 700);   // second pass once fonts and images have settled
        }});
      }
    });
  };
  CMS.registerPreviewStyle('/admin/preview.css');
  KEYS.forEach(function (k) { CMS.registerPreviewTemplate(k, make(k)); });
})();
