(function(){var w=document.querySelector('.idwrap');if(!w)return;var pop=w.querySelector('.idpop'),hide;
function slug(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function show(p,e){clearTimeout(hide);var v=+p.getAttribute('data-v'),r=w.getBoundingClientRect(),b=p.getBoundingClientRect();
pop.innerHTML='<strong>'+p.getAttribute('data-n')+'</strong><span>'+(v?v+(v>1?' videos':' video'):'No videos online yet')+'</span>';pop.hidden=false;
var x=(e&&e.clientX?e.clientX:b.left+b.width/2)-r.left,y=(e&&e.clientY?e.clientY:b.top)-r.top,pw=pop.offsetWidth,ph=pop.offsetHeight;
pop.style.left=Math.max(0,Math.min(r.width-pw,x-pw/2))+'px';pop.style.top=Math.max(0,y-ph-14)+'px'}
function off(){hide=setTimeout(function(){pop.hidden=true},150)}
w.querySelectorAll('.cty').forEach(function(p){var n=p.getAttribute('data-n'),v=+p.getAttribute('data-v');
p.setAttribute('aria-label',n+(v?', '+v+' videos':', no videos online yet'));if(v){p.setAttribute('tabindex','0');p.setAttribute('role','link')}
p.addEventListener('mousemove',function(e){show(p,e)});p.addEventListener('mouseleave',off);p.addEventListener('focus',function(){show(p)});p.addEventListener('blur',off);
function go(){if(!v)return;var t=document.getElementById(slug(n));if(t){t.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#'+slug(n))}}
p.addEventListener('click',function(e){if(window.matchMedia('(hover:none)').matches&&pop.hidden===false&&pop.dataset.last!==n){pop.dataset.last=n;show(p,e);return}go()});
p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')pop.hidden=true})})();
