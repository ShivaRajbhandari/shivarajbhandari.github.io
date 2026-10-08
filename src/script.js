(function(){var els=document.querySelectorAll('.reveal');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
els.forEach(function(e){io.observe(e)});})();
(function(){var mb=document.querySelector('.mapblock');if(!mb)return;
function set(c,on){mb.querySelectorAll('[data-c="'+c+'"]').forEach(function(n){n.classList.toggle('active',on)})}
mb.querySelectorAll('[data-c]').forEach(function(n){var c=n.getAttribute('data-c');
n.addEventListener('mouseenter',function(){set(c,true)});n.addEventListener('mouseleave',function(){set(c,false)});
n.addEventListener('click',function(){mb.querySelectorAll('.active').forEach(function(a){a.classList.remove('active')});set(c,true)})})})();
