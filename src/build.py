import pathlib
d = pathlib.Path(__file__).parent
body = (d/"body.html").read_text().replace("<!--MAP-->", (d/"map.svg.html").read_text())
themes = {
 "a": ("Field Notes", "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap"),
 "b": ("Bold", "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800;900&family=Inter:wght@400;500;600;700&display=swap"),
 "b2": ("Bold, earthier", "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;0,9..144,800;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap"),
 "c": ("Blueprint", "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap"),
}
script = """<script>
(function(){var els=document.querySelectorAll('.reveal');
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
els.forEach(function(e){io.observe(e)});})();
(function(){var mb=document.querySelector('.mapblock');if(!mb)return;
function set(c,on){mb.querySelectorAll('[data-c="'+c+'"]').forEach(function(n){n.classList.toggle('active',on)})}
mb.querySelectorAll('[data-c]').forEach(function(n){var c=n.getAttribute('data-c');
n.addEventListener('mouseenter',function(){set(c,true)});n.addEventListener('mouseleave',function(){set(c,false)});
n.addEventListener('click',function(){mb.querySelectorAll('.active').forEach(function(a){a.classList.remove('active')});set(c,true)})})})();
</script>"""
for k,(name,fonts) in themes.items():
    css = (d/f"{k}.css").read_text()
    extra = ""
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Shiva Rajbhandari — Direction {k.upper()}: {name}</title>
<meta name="description" content="Shiva Rajbhandari builds institutions and policy: a student-run credit union, climate research, and public service.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{fonts}" rel="stylesheet">
<script>document.documentElement.classList.add('js')</script>
<style>{css}</style>
</head>
<body>
{body}
{script}
{extra}
</body>
</html>"""
    (d/f"{k}.html").write_text(html)
(d/"index.html").write_text("""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mockups</title>
<style>body{font:18px/1.6 system-ui;max-width:640px;margin:8vh auto;padding:0 20px;color:#1b2a2f}a{display:block;padding:18px 20px;margin:12px 0;border:1.5px solid #1b2a2f;border-radius:10px;text-decoration:none;color:inherit}a:hover{background:#f3efe6}small{display:block;color:#5b6b70}h2{font-size:15px;color:#5b6b70;margin-top:36px}.alt a{padding:10px 16px;border-color:#c9c2b3;font-size:15px}</style></head>
<body><h1>shivarajbhandari.com mockup</h1>
<a href="a.html"><b>Field Notes (chosen direction)</b><small>Warm editorial. Serif type, salmon accent.</small></a>
<h2>Parked directions</h2><div class="alt"><a href="b2.html">Bold, earthier</a><a href="b.html">Bold (black and yellow)</a><a href="c.html">Blueprint</a></div>
</body></html>""")
print("built")
