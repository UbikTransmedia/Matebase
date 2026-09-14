# -*- coding: utf-8 -*-
"""Imprime las claves que le faltan a un tema (o el recuento de todos).

    python3 __falta.py               resumen por bloque
    python3 __falta.py lg-conjuntos  las claves pendientes de ese tema
"""
import io, json, os, re, sys

claves = json.load(io.open('__i18n/claves.json', encoding='utf-8'))


def hechas(tid):
    f = '__i18n/en/%s.json' % tid
    if not os.path.exists(f):
        return {}
    d = json.load(io.open(f, encoding='utf-8'))
    return d if isinstance(d, dict) else {}


if len(sys.argv) > 1:
    tid = sys.argv[1]
    hay = hechas(tid)
    falta = [s for s in claves.get(tid, []) if not hay.get(s)]
    for s in falta:
        print(s)
    sys.stderr.write('%s: faltan %d de %d\n' % (tid, len(falta), len(claves.get(tid, []))))
else:
    src = io.open('assets/js/curriculum.js', encoding='utf-8').read()
    bloques = re.findall(r"\n    id: '([a-z0-9]+)', n: (\d+), title: '([^']*)'(.*?)\n  \}", src, re.S)
    tot = hecho_tot = 0
    for bid, n, title, body in bloques:
        ids = re.findall(r"id: '([a-z0-9-]+)', t: '", body)
        t = sum(len(claves.get(i, [])) for i in ids)
        h = sum(sum(1 for s in claves.get(i, []) if hechas(i).get(s)) for i in ids)
        tot += t; hecho_tot += h
        print('%2s %-46s %5d/%-5d %3d%%' % (n, title[:46], h, t, 100 * h / t if t else 0))
    for extra in ['@curriculum']:
        t = len(claves.get(extra, []))
        h = sum(1 for s in claves.get(extra, []) if hechas(extra).get(s))
        tot += t; hecho_tot += h
        print('%2s %-46s %5d/%-5d %3d%%' % ('·', extra, h, t, 100 * h / t if t else 0))
    print('%-50s %5d/%-5d %3d%%' % ('TOTAL', hecho_tot, tot, 100 * hecho_tot / tot if tot else 0))
