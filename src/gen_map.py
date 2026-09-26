import json, math, pathlib
d = pathlib.Path(__file__).parent

def load(p):
    t = json.load(open(p))
    sc, tr = t['transform']['scale'], t['transform']['translate']
    arcs = []
    for a in t['arcs']:
        x = y = 0; pts = []
        for dx, dy in a:
            x += dx; y += dy
            pts.append((x*sc[0]+tr[0], y*sc[1]+tr[1]))
        arcs.append(pts)
    return t, arcs

def ring(idx, arcs):
    out = []
    for i in idx:
        pts = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(pts if not out else pts[1:])
    return out

def polys(geom, arcs):
    if geom['type'] == 'Polygon': return [[ring(r, arcs) for r in geom['arcs']]]
    if geom['type'] == 'MultiPolygon': return [[ring(r, arcs) for r in p] for p in geom['arcs']]
    return []

A1, A2, A3, A4 = 1.340264, -0.081106, 0.000893, 0.003796
def proj(lon, lat):
    l = math.radians(lon); p = math.radians(lat)
    th = math.asin(math.sqrt(3)/2*math.sin(p))
    x = 2*math.sqrt(3)*l*math.cos(th) / (3*(9*A4*th**8 + 7*A3*th**6 + 3*A2*th**2 + A1))
    y = th*(A1 + A2*th**2 + th**6*(A3 + A4*th**2))
    return x, y

S = 235.0           # scale
OX, OY = 0, 0
def P(lon, lat):
    x, y = proj(lon, lat)
    return x*S, -y*S

HIGH = ['Nepal', 'Chile', 'Uruguay', 'Peru', 'Mexico', 'Egypt']
def path(pl):
    s = []
    for poly in pl:
        for r in poly:
            if any(abs(r[i][0]-r[i-1][0]) > 180 for i in range(1, len(r))):
                r = [(lo + 360 if lo < 0 else lo, la) for lo, la in r]  # unwrap rings that cross 180 degrees
            pts = []
            for pt in r:
                x, y = P(*pt); q = (round(x), round(y))
                if not pts or q != pts[-1]: pts.append(q)
            if len(pts) < 3: continue
            s.append('M' + 'L'.join(f'{x},{y}' for x, y in pts) + 'Z')
    return ''.join(s)

t110, a110 = load(d/'data/c110.json')
t50, a50 = load(d/'data/c50.json')
back = []
for g in t110['objects']['countries']['geometries']:
    n = g['properties']['name']
    if n in ('Antarctica',) or n in HIGH: continue
    back.append(path(polys(g, a110)))
high = {}
for tt, aa, keep in ((t110, a110, ('Chile', 'Peru', 'Mexico', 'Egypt')), (t50, a50, ('Nepal', 'Uruguay'))):
    for g in tt['objects']['countries']['geometries']:
        n = g['properties']['name']
        if n in keep: high[n] = path(polys(g, aa))

pins = {'Nepal': (84.2, 28.3), 'Chile': (-70.7, -33.0), 'Uruguay': (-55.9, -32.8), 'Peru': (-75.0, -9.5), 'Mexico': (-102.0, 23.0), 'Egypt': (34.3, 27.9)}
# viewBox: crop to lat 60N .. 57S, lon -130..150 (drops Antarctica, most Arctic)
xs = [P(-170, 0)[0], P(186, 0)[0]]
y_top, y_bot = P(0, 83)[1], P(0, -57)[1]
vb = (xs[0], y_top, xs[1]-xs[0], y_bot-y_top)
out = [f'<svg class="map" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}" role="img" aria-labelledby="map-t map-d" xmlns="http://www.w3.org/2000/svg">',
       '<title id="map-t">Countries where Shiva&#8217;s work has taken him</title>',
       '<desc id="map-d">A world map with Mexico, Peru, Chile, Uruguay, Nepal and Egypt highlighted.</desc>',
       f'<path class="land" d="{"".join(back)}"/>']
for n in HIGH:
    cls = 'hl alt' if n == 'Egypt' else 'hl'
    out.append(f'<path class="{cls}" data-c="{n}" d="{high[n]}"><title>{n}</title></path>')
for n, (lo, la) in pins.items():
    x, y = P(lo, la)
    out.append(f'<g class="pin" data-c="{n}" transform="translate({x:.1f},{y:.1f})"><circle class="hit" r="15"/><circle class="pulse" r="7"/><circle class="dot" r="4.2"/></g>')
out.append('</svg>')
(d/'map.svg.html').write_text('\n'.join(out))
print('map ok', sum(len(x) for x in out)//1024, 'KB')
