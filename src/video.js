document.addEventListener('click',function(e){var b=e.target.closest('.vid');if(!b)return;
var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+b.getAttribute('data-id')+'?autoplay=1&rel=0';
f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title='Idaho Climate Conversations video';
b.replaceWith(f);f.parentNode.classList.add('playing')});
