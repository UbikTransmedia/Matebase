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
    'ref', 'name', 'id', 'v', 'cls', 'href', 'tipo', 'w',
    'level', 'curso', 'piel', 'color', 'font', 'style', 'x', 'g',
}
# `e:` es el texto de un error en p.trampas, `ph:` el texto guia de una
# casilla y `n:` el rotulo de un caso en varias demos: los tres se leen en
# pantalla. Estaban en la lista de codigo por
# parecerse a los campos de glsl.js, que aqui no se lee.
# Propiedades cuyo valor es prosa segura (rotulos incluidos).
PROSA = {
    't', 'd', 'r', 'por', 'msg', 'label', 'titulo', 'title', 'intro',
    'nota', 'lectura', 'antes', 'cierre', 'enunciado', 'predice', 'aria',
    'xlabel', 'ylabel', 'ask', 'e_', 'texto', 'pie', 'sub', 'desc', 'o',
}

RE_ID = re.compile(r'([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*$')


def literales(src, i, trozos=None):
    """Lee desde src[i] cadenas concatenadas con `+`. Devuelve (texto, j), o
    (None, j) si aparece algo que no es un literal: entonces es dinamico.

    Si se pasa `trozos`, ahi se deja lo leido antes de toparse con la parte
    dinamica. Esos pedazos son prosa de verdad -el rotulo de un cuadro de
    resultados- y se traducen aparte, por sustitucion."""
    partes = []
    if trozos is not None:
        trozos.append(partes)
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


RE_TAG = re.compile(r'<[^>]*>?')        # etiqueta, aunque quede a medias
RE_ENT = re.compile(r'&[a-zA-Z]+;')     # &nbsp;
RE_CMD = re.compile(r'\\[a-zA-Z]+')     # \dfrac, \approx, \cdot
RE_CSS = re.compile(r'[a-z]+-[a-z]+\s*:\s*[^;"\'>]*')   # font-size:1.2rem
RE_LETRA = re.compile(r'[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]')


def util_trozo(s):
    """Un pedazo de una concatenacion dinamica solo merece traducirse si
    quedan PALABRAS despues de quitar lo que no es idioma: etiquetas HTML,
    entidades, declaraciones CSS y ordenes de LaTeX. `'$ \\approx '` o
    `';font-size:1.2rem">'` son pegamento entre numeros, no prosa."""
    if re.fullmatch(r'\s*[a-z-]+\s*:\s*', s):      # 'background:', 'color:'
        return False
    t = RE_CSS.sub('', RE_CMD.sub('', RE_ENT.sub('', RE_TAG.sub('', s))))
    # La apertura de interrogacion o admiracion y las comillas angulares solo
    # existen en castellano: donde aparecen hay prosa, aunque sean dos letras
    # («¿Es $»). Sin esto, el enunciado empieza en castellano y sigue en ingles.
    minimo = 1 if re.search(r'[¿¡«»]', s) else 4
    if len(RE_LETRA.findall(t)) < minimo:
        return False
    if minimo > 1 and not re.search(r'[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3}', t):
        return False
    if es_codigo(t):
        return False
    return True


def salta_operando(src, i):
    """Desde i, salta un operando de una concatenacion -un identificador, una
    llamada, un indice, un parentesis- y se para en el `+` que lo une al
    siguiente trozo, o en el final de la expresion."""
    n, hondo = len(src), 0
    while i < n:
        c = src[i]
        if c in '([{':
            hondo += 1
        elif c in ')]}':
            if hondo == 0:
                return i
            hondo -= 1
        elif hondo == 0 and c in "+,;'\"":
            return i
        i += 1
    return i


def continuaciones(src, j, cont):
    """Una cadena dinamica sigue despues del numero: `'a ' + n + ' b'`. El
    ultimo trozo tambien es prosa, pero el lector de literales ya se paro en
    el numero y nunca lo ve como continuacion: lo tomaria por una frase
    entera y suelta. Aqui se recorre lo que queda de la suma y se apuntan las
    posiciones donde arrancan esos trozos, para reconocerlos al pasar."""
    n = len(src)
    while j < n:
        j = salta_operando(src, j)
        if j >= n or src[j] != '+':
            return
        j += 1
        while j < n and src[j] in ' \t\r\n':
            j += 1
        if j >= n or src[j] not in "'\"":
            continue                       # otro operando dinamico
        cont.add(j)
        txt, j2 = literales(src, j)
        if txt is not None:
            return                         # la suma acaba en literal
        j = j2


def cadenas_de(src, trozos_out=None):
    out = []
    n = len(src)
    cont = set()
    i = 0
    while i < n:
        c = src[i]
        if c == '/' and src[i + 1:i + 2] == '/':
            j = src.find('\n', i); i = n if j < 0 else j + 1; continue
        if c == '/' and src[i + 1:i + 2] == '*':
            j = src.find('*/', i); i = n if j < 0 else j + 2; continue
        if c in "'\"":
            prop = propiedad(src, i)
            sigue = i in cont
            trozos = []
            txt, j = literales(src, i, trozos)
            if txt is not None and not sigue:
                if util(txt, prop):
                    out.append(txt)
            elif trozos_out is not None and prop not in CODIGO:
                partes = [txt] if txt is not None else trozos[0]
                for parte in partes:
                    if util_trozo(parte):
                        trozos_out.append(parte)
            if txt is None:
                continuaciones(src, j, cont)
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

    fragmentos = {}
    for f in sorted(glob.glob('topics/*.js')):
        tid = os.path.basename(f)[:-3]
        src = io.open(f, encoding='utf-8').read()
        vistos, lista, trozos = set(), [], []
        for s in cadenas_de(src, trozos):
            if s in vistos:
                continue
            vistos.add(s)
            lista.append(s)
        # Los pedazos van al final de la lista para no descolocar nada, y
        # aparte, porque el curso los traduce sustituyendo, no buscando.
        fr = []
        for s in trozos:
            if s in vistos:
                continue
            vistos.add(s)
            fr.append(s)
            lista.append(s)
        if fr:
            fragmentos[tid] = fr
        salida[tid] = lista
    os.makedirs('i18n', exist_ok=True)
    io.open('i18n/fragmentos.json', 'w', encoding='utf-8').write(
        json.dumps(fragmentos, ensure_ascii=False, indent=0))
    io.open('i18n/claves.js', 'w', encoding='utf-8').write(
        'window.__PY = ' + json.dumps(salida, ensure_ascii=False) + ';\n')
    io.open('i18n/claves.json', 'w', encoding='utf-8').write(
        json.dumps(salida, ensure_ascii=False, indent=0))
    n = sum(len(v) for v in salida.values())
    ch = sum(len(s) for v in salida.values() for s in v)
    print('temas %d · cadenas %d · caracteres %d · palabras ~%d' % (len(salida), n, ch, ch // 5.9))


if __name__ == '__main__':
    main()
