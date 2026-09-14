# -*- coding: utf-8 -*-
"""Cose las traducciones con sus claves y escribe el diccionario.

El traductor escribe, por tema, un archivo `i18n/en/<tema>.json`: un
objeto {frase espanola: frase inglesa}. Las claves se sacan de
`i18n/claves.json`, que lo genera `extraer.py` leyendo los temas, y
`falta.py` imprime las que quedan por traducir.

Se empareja por CONTENIDO y no por posicion porque el extractor puede
afinarse -y se ha afinado- y una lista posicional se descoloca entera en
cuanto aparece una clave nueva. Con el contenido como llave, afinar el
extractor solo anade huecos al final.
"""
import io, json, os, glob, sys

CAB = """/* ===================================================================
   Matebase · en-txt.js
   LA PROSA DEL CURSO EN INGLES. Cada clave es la frase espanola tal cual
   la escribio el autor; el valor, su traduccion. Lo que no este aqui sale
   en castellano y el tema lo avisa arriba.

   NO SE EDITA A MANO. Lo genera `coser.py` a partir de:
     __i18n/claves.json   las claves espanolas, extraidas de topics/
     __i18n/en/<tema>.json  la traduccion, en el mismo orden

   `hechos` dice que temas tienen la prosa completa: solo esos dejan de
   avisar de que estan en castellano.
   =================================================================== */
(function () {
  'use strict';
  var d = I18N.diccionario('en');
  if (!d) return;
"""


def main():
    claves = json.load(io.open('i18n/claves.json', encoding='utf-8'))
    # Pedazos de las concatenaciones con numeros dentro: no tienen frase
    # entera que buscar, se sustituyen dentro del texto ya armado.
    fragmentos = {}
    if os.path.exists('i18n/fragmentos.json'):
        fragmentos = json.load(io.open('i18n/fragmentos.json', encoding='utf-8'))
    frag = {}
    txt = {}
    hechos = {}
    parcial = {}
    # Pedazos que valen para TODO el curso: la «y» que une dos formulas, por
    # ejemplo, aparece en casi todos los temas y no merece copiarse en cada uno.
    gf = 'i18n/en/@global.json'
    if os.path.exists(gf):
        g = json.load(io.open(gf, encoding='utf-8')).get('@frag') or {}
        pares = [[a, g[a]] for a in g if g[a]]
        pares.sort(key=lambda p: -len(p[0]))
        if pares:
            frag['@'] = pares
    for f in sorted(glob.glob('i18n/en/*.json')):
        tid = os.path.basename(f)[:-5]
        if tid == '@global':
            continue
        en = json.load(io.open(f, encoding='utf-8'))
        es = claves.get(tid)
        if es is None:
            print('  ! %s no está en claves.json' % tid); continue
        if isinstance(en, list):
            print('  ! %s sigue en formato de lista — se omite' % tid); continue
        # `@frag` no es una frase: es la lista de pedazos que el traductor
        # anade a mano cuando el extractor no puede verlos -pegamento de dos
        # letras, o una palabra suelta que viaja dentro de un enunciado-.
        manual = en.pop('@frag', None) or {}
        # Claves que el extractor estatico no ve: las arma una demo al vuelo
        # y solo se leen ejecutando el tema. Son legitimas y se guardan.
        for k in en:
            if k not in es and en[k] and en[k].strip() and en[k] != k:
                txt[k] = en[k]
        n = 0
        for a in es:
            b = en.get(a)
            if not (b and b.strip()):
                continue
            n += 1                       # traducida, aunque salga igual
            if b != a:
                txt[a] = b               # solo se guarda lo que cambia
        pares, ya = [], set()
        # 1. Los pedazos que rodean a los numeros.
        # 2. Las frases enteras que se INSERTAN en esas cadenas: el caso
        #    («un polígono es un cuadrado») sale de una lista de datos y
        #    viaja dentro del enunciado, asi que tampoco se encuentra
        #    buscando la frase entera. Se piden con espacio dentro y de
        #    longitud media: una sola palabra seria peligrosa como trozo
        #    («racional» esta dentro de «irracional») y un parrafo no se
        #    inserta en ningun sitio.
        cand = list(fragmentos.get(tid, []))
        largo = lambda k: 12 <= len(k) <= 400 and (' ' in k or '<' in k)
        cand += [a for a in es if largo(a)]
        cand += [a for a in en if a not in es and largo(a)]
        for a in cand:
            if a in ya:
                continue
            ya.add(a)
            b = en.get(a)
            if b and b.strip() and b != a:
                # Si la frase ya va en `txt` no se repite el ingles: basta
                # con nombrarla y el curso la busca alli.
                pares.append(a if txt.get(a) == b else [a, b])
        for a in manual:
            if manual[a] and a not in ya:
                ya.add(a); pares.append([a, manual[a]])
        if pares:
            # De mas largo a mas corto: si no, un pedazo corto se come el
            # principio de otro largo y el resto se queda en castellano.
            pares.sort(key=lambda p: -len(p if isinstance(p, str) else p[0]))
            frag[tid] = pares
        if n == len(es):
            hechos[tid] = 1
        elif n:
            parcial[tid] = '%d/%d' % (n, len(es))
    out = [CAB]
    out.append('  var t = d.txt;\n')
    for k in sorted(txt):
        out.append('  t[%s] = %s;\n' % (json.dumps(k, ensure_ascii=False), json.dumps(txt[k], ensure_ascii=False)))
    out.append('\n  d.frag = d.frag || {};\n')
    for k in sorted(frag):
        out.append('  d.frag[%s] = %s;\n'
                   % (json.dumps(k), json.dumps(frag[k], ensure_ascii=False)))
    out.append('\n  d.hechos = d.hechos || {};\n')
    for k in sorted(hechos):
        out.append('  d.hechos[%s] = 1;\n' % json.dumps(k))
    out.append('})();\n')
    io.open('assets/js/i18n/en-txt.js', 'w', encoding='utf-8').write(''.join(out))
    ch = sum(len(v) for v in txt.values())
    print('frases %d · caracteres %d · temas completos %d · parciales %d · pedazos %d'
          % (len(txt), ch, len(hechos), len(parcial), sum(len(v) for v in frag.values())))
    if parcial:
        print('  parciales:', ', '.join('%s %s' % (k, v) for k, v in sorted(parcial.items())))


if __name__ == '__main__':
    main()
