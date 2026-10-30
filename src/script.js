(function(){var els=document.querySelectorAll('.reveal');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
els.forEach(function(e){io.observe(e)});})();
(function(){var mb=document.querySelector('.mapblock');if(!mb)return;
var pop=document.createElement('div');pop.className='map-pop';pop.setAttribute('role','status');pop.hidden=true;mb.appendChild(pop);
var cur=null,timer=null;
function pinFor(c){return mb.querySelector('.pin[data-c="'+c+'"]')}
function set(c,on){mb.querySelectorAll('.map [data-c="'+c+'"]').forEach(function(n){n.classList.toggle('active',on)})}
function hide(){clearTimeout(timer);if(cur){set(cur,false);cur=null}pop.hidden=true}
function show(c){clearTimeout(timer);if(cur===c&&!pop.hidden)return;if(cur)set(cur,false);cur=c;set(c,true);
var li=mb.querySelector('.places li[data-c="'+c+'"]'),pin=pinFor(c);if(!li||!pin)return;
pop.innerHTML=li.innerHTML;pop.hidden=false;
var b=mb.getBoundingClientRect(),r=pin.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;
var x=r.left+r.width/2-b.left-w/2;x=Math.max(0,Math.min(x,b.width-w));
var y=r.top-b.top-h-10;if(y<0)y=r.bottom-b.top+10;
pop.style.left=x+'px';pop.style.top=y+'px'}
function later(){clearTimeout(timer);timer=setTimeout(hide,260)}
mb.querySelectorAll('.map [data-c]').forEach(function(n){var c=n.getAttribute('data-c');
if(n.classList.contains('pin')){n.setAttribute('tabindex','0');n.setAttribute('role','button');n.setAttribute('aria-label',c)}
n.addEventListener('mouseenter',function(){show(c)});n.addEventListener('mouseleave',later);
n.addEventListener('focus',function(){show(c)});n.addEventListener('blur',later);
n.addEventListener('click',function(e){e.stopPropagation();show(c)})});
pop.addEventListener('mouseenter',function(){clearTimeout(timer)});pop.addEventListener('mouseleave',later);
document.addEventListener('click',function(e){if(!pop.contains(e.target))hide()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});})();
(function(){var y=new Date().getFullYear();document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=y})})();
