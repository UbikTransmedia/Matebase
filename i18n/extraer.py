# -*- coding: utf-8 -*-
"""Extrae de topics/*.js la prosa traducible, con su propiedad de origen.

Por que en Python y no en el navegador: la prosa son literales de cadena
concatenados con `+`, y eso se pliega leyendo el archivo. Ademas aqui se ve
TODA la prosa, tambien la que solo se pinta al abrir una pista, un paso o la
explicacion de una trampa, que una captura en vivo de MathX.inline se pierde.

Lo que lleva variables (`'... ' + d.f + ' ...'`) no se puede plegar, y
tampoco se podria traducir con un diccionario de claves: se descarta.

La clave de traduccion es la cadena espanola ya concatenada, tal cual la
recibe el curso. Este script la escribe; el traductor solo escribe el
ingles, en el mismo orden. Asi ninguna clave se copia a mano, que es de
donde salen los acentos mal puestos que dejan una frase sin traducir sin
avisar de nada.
"""
import io, json, os, re, glob

# Propiedades cuyo valor es CODIGO, no prosa: no se traducen nunca.
CODIGO = {
    'codigo', 'src', 'glsl', 'programa', 'netlist', 'fuente',
    'ref', 'name', 'n', 'id', 'v', 'cls', 'href', 'tipo', 'w',
    'level', 'curso', 'piel', 'color', 'font', 'style', 'x', 'g',
}
# `e:` es el texto de un error en p.trampas y `ph:` el texto guia de una
# casilla: los dos se leen en pantalla. Estaban en la lista de codigo por
# parecerse a los campos de glsl.js, que aqui no se lee.
# Propiedades cuyo valor es prosa segura (rotulos incluidos).
PROSA = {
    't', 'd', 'r', 'por', 'msg', 'label', 'titulo', 'title', 'intro',
    'nota', 'lectura', 'antes', 'cierre', 'enunciado', 'predice', 'aria',
    'xlabel', 'ylabel', 'ask', 'e_', 'texto', 'pie', 'sub', 'desc', 'o',
}

RE_ID = re.compile(r'([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*$')


def literales(src, i):
    """Lee desde src[i] cadenas concatenadas con `+`. Devuelve (texto, j), o
    (None, j) si aparece algo que no es un literal: entonces es dinamico."""
    partes = []
    n = len(src)
    while i < n:
        while i < n and src[i] in ' \t\r\n':
            i += 1
        if i >= n or src[i] not in "'\"":
            return None, i
        cierre = src[i]
        i += 1
        buf = []
        while i < n:
            c = src[i]
            if c == '\\':
                nxt = src[i + 1] if i + 1 < n else ''
                if nxt == 'n':
                    buf.append('\n')
                elif nxt == 't':
                    buf.append('\t')
                elif nxt == 'r':
                    buf.append('\r')
                elif nxt == 'u':
                    buf.append(chr(int(src[i + 2:i + 6], 16))); i += 6; continue
                elif nxt == 'x':
                    buf.append(chr(int(src[i + 2:i + 4], 16))); i += 4; continue
                else:
                    buf.append(nxt)
                i += 2
                continue
            if c == cierre:
                i += 1
                break
            buf.append(c)
            i += 1
        partes.append(''.join(buf))
        j = i
        while j < n and src[j] in ' \t\r\n':
            j += 1
        if j < n and src[j] == '+':
            i = j + 1
            continue
        return ''.join(partes), i
    return None, i


def propiedad(src, i):
    """El nombre de propiedad inmediatamente anterior a la posicion i, si la
    cadena es el valor de una (`por: '...'`). None si va suelta."""
    j = i - 1
    while j >= 0 and src[j] in ' \t\r\n':
        j -= 1
    if j < 0 or src[j] != ':':
        return None
    k = j
    while k >= 0 and src[k - 1:k].strip() == '' and k > 0:
        break
    m = RE_ID.search(src[max(0, j - 40):j + 1])
    return m.group(1) if m else None


def es_codigo(s):
    """Bloques de codigo: varias lineas con llaves o punto y coma, GLSL,
    ensamblador. No son prosa aunque estén llenos de letras."""
    if s.count('\n') >= 1 and re.search(r'[{};]\s*$|^\s*(var|function|float|vec[234]|void|return|if|for)\b', s, re.M):
        return True
    if re.match(r'^\s*(vec[234]|float|void|uniform|const|#define|gl_)\b', s):
        return True
    if re.match(r'^[A-Z]{2,6}( [A-Za-z0-9_#$-]+)*$', s.strip()):     # CARGA R1, 5
        return True
    return False


def util(s, prop):
    t = s.strip()
    if len(t) < 2:
        return False
    if prop in CODIGO:
        return False
    if not re.search(r'[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2}', t):
        return False
    # Identificadores: minusculas con guiones/puntos, o cualquier cosa con
    # _ $ # dentro. Una palabra normal con mayuscula («Cuantificadores») NO
    # es un identificador, y descartarla dejaba secciones sin traducir.
    if re.fullmatch(r'[a-z0-9]+([_.-][a-z0-9]+)+', t):
        return False
    if re.fullmatch(r'[a-z]+', t) and len(t) <= 3:
        return False
    if re.search(r'[_$#]', t) and not re.search(r'\s', t):
        return False
    if es_codigo(t):
        return False
    return True


def cadenas_de(src):
    out = []
    n = len(src)
    i = 0
    while i < n:
        c = src[i]
        if c == '/' and src[i + 1:i + 2] == '/':
            j = src.find('\n', i); i = n if j < 0 else j + 1; continue
        if c == '/' and src[i + 1:i + 2] == '*':
            j = src.find('*/', i); i = n if j < 0 else j + 2; continue
        if c in "'\"":
            prop = propiedad(src, i)
            txt, j = literales(src, i)
            if txt is not None and util(txt, prop):
                out.append(txt)
            i = max(j, i + 1)
            continue
        i += 1
    return out


def main():
    salida = {}
    # Los objetivos de cada tema viven en curriculum.js y se pintan en la
    # cabecera de todos los temas: entran por la misma puerta.
    src = io.open('assets/js/curriculum.js', encoding='utf-8').read()
    obj, vis = [], set()
    for m in re.finditer(r"\bo:\s*\[(.*?)\]", src, re.S):
        for s in cadenas_de('[' + m.group(1) + ']'):
            if s not in vis:
                vis.add(s); obj.append(s)
    salida['@curriculum'] = obj

    for f in sorted(glob.glob('topics/*.js')):
        tid = os.path.basename(f)[:-3]
        src = io.open(f, encoding='utf-8').read()
        vistos, lista = set(), []
        for s in cadenas_de(src):
            if s in vistos:
                continue
            vistos.add(s)
            lista.append(s)
        salida[tid] = lista
    os.makedirs('i18n', exist_ok=True)
    io.open('i18n/claves.js', 'w', encoding='utf-8').write(
        'window.__PY = ' + json.dumps(salida, ensure_ascii=False) + ';\n')
    io.open('i18n/claves.json', 'w', encoding='utf-8').write(
        json.dumps(salida, ensure_ascii=False, indent=0))
    n = sum(len(v) for v in salida.values())
    ch = sum(len(s) for v in salida.values() for s in v)
    print('temas %d · cadenas %d · caracteres %d · palabras ~%d' % (len(salida), n, ch, ch // 5.9))


if __name__ == '__main__':
    main()
