/* Tema: AES: el cifrado del mundo, paso a paso */
Course.topic('cr-aes', function (p) {

  p.puente('Ya están todas las piezas: la [[cr-bloque|red de sustitución y permutación]] con sus ' +
    'rondas, la aritmética de [[cr-galois|bytes como polinomios]] y la idea de [[cr-hill|Hill]] de ' +
    'mezclar con una matriz. AES es exactamente eso, y en este tema se ve funcionar entero, byte a ' +
    'byte, con los mismos números del documento oficial.');

  p.text('El <em>Advanced Encryption Standard</em> cifra hoy el tráfico de internet, los discos duros, ' +
    'los mensajes del móvil y las copias de seguridad. Se eligió en un concurso público de tres ' +
    'años entre quince candidatos, se publicó con todos los detalles, y en un cuarto de siglo de ' +
    'ataques nadie ha encontrado nada mejor que probar claves. Y es corto: cabe en una página.');

  /* ---------------------------------------------------------------- */
  p.section('El estado: dieciséis bytes en una rejilla');

  p.text('AES trabaja con bloques de 128 bits, 16 bytes, colocados en una rejilla de $4\\times 4$ por ' +
    'columnas: el primer byte arriba a la izquierda, el segundo debajo, y así. La clave de 128 bits ' +
    'se estira en 11 claves de ronda de 16 bytes. Y el cifrado son diez rondas de cuatro operaciones, ' +
    'cada una sobre la rejilla:');

  p.table(['Operación', 'Qué hace', 'De dónde viene'], [
    ['<strong>SubBytes</strong>', 'cada byte pasa por la S-box: su inverso en $\\text{GF}(2^8)$ y una mezcla lineal', 'confusión: la parte no lineal'],
    ['<strong>ShiftRows</strong>', 'la fila $r$ se desplaza $r$ posiciones a la izquierda', 'difusión entre columnas'],
    ['<strong>MixColumns</strong>', 'cada columna se multiplica por una matriz fija en $\\text{GF}(2^8)$', 'difusión dentro de la columna: un Hill de bytes'],
    ['<strong>AddRoundKey</strong>', 'XOR con la clave de la ronda', 'la clave entra en cada ronda']
  ]);

  p.formula('\\begin{pmatrix} 2 & 3 & 1 & 1 \\\\ 1 & 2 & 3 & 1 \\\\ 1 & 1 & 2 & 3 \\\\ 3 & 1 & 1 & 2 \\end{pmatrix} \\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\\\ a_3 \\end{pmatrix}',
    'MixColumns: la matriz de una columna',
    'Se lee: <em>«la columna nueva es la matriz por la columna vieja»</em>, con los productos en ' +
    '$\\text{GF}(2^8)$ y las sumas como XOR. El 2 es «multiplicar por $x$», xtime, y el 3 es $x + 1$: ' +
    'xtime más el propio byte.<br><br>La matriz se eligió con entradas mínimas, para que ' +
    'multiplicar cueste poco, y de modo que cualquier cambio en un byte de la columna cambie los ' +
    'cuatro de la salida. Con ShiftRows, en dos rondas cada byte ha influido en los dieciséis.');

  p.demo({
    title: 'AES-128, paso a paso',
    intro: 'El bloque y la clave son los del ejemplo del documento del estándar: se puede seguir cada paso con él en la mano. Mueve el mando para ver el estado tras cada operación; los bytes resaltados son los que ha cambiado ese paso.',
    predice: 'Tras el primer SubBytes, ¿cuántos de los 16 bytes habrán cambiado? ¿Y tras ShiftRows? Piensa en qué hace cada operación con un byte concreto.',
    build: function (host) {
      var bloqueHex = '00112233445566778899aabbccddeeff', claveHex = '000102030405060708090a0b0c0d0e0f', paso = 1;
      var out = W.readout(host, ''), rejilla = U.el('div.cr-estado'), res;
      var lector = U.el('div.sr-solo', { 'aria-live': 'polite' });
      host.appendChild(out); host.appendChild(rejilla); host.appendChild(lector);
      function hex(n) { return ('0' + n.toString(16)).slice(-2); }
      function pinta() {
        var b = CR.deHex(bloqueHex), k = CR.deHex(claveHex);
        while (b.length < 16) b.push(0); while (k.length < 16) k.push(0);
        res = CR.aes.cifra(b.slice(0, 16), k.slice(0, 16));
        var t = res.traza[Math.min(paso, res.traza.length - 1)], ant = res.traza[Math.max(0, Math.min(paso, res.traza.length - 1) - 1)];
        rejilla.innerHTML = '';
        for (var fila = 0; fila < 4; fila++) for (var col = 0; col < 4; col++) {
          var i = fila + 4 * col;
          rejilla.appendChild(U.el('span' + (t.estado[i] !== ant.estado[i] && paso > 0 ? '.is-dif' : ''), { text: hex(t.estado[i]) }));
        }
        out.set('<strong>' + (t.ronda ? 'ronda ' + t.ronda + ' · ' : '') + t.paso + '</strong>' + (t.paso === 'AddRoundKey' ? ' con la clave $' + CR.hex(res.claves[t.ronda]).replace(/(.{8})/g, '$1 ') + '$' : '') + '<br>estado: $' + CR.hex(t.estado).replace(/(.{8})/g, '$1 ') + '$<br><span style="font-size:0.7812rem;color:var(--ink-faint)">salida final: ' + CR.hex(res.salida) + (CR.hex(res.salida) === '69c4e0d86a7b0430d8cdb78070b4c55a' && bloqueHex === '00112233445566778899aabbccddeeff' ? ' = la del documento del estándar ✓' : '') + '</span>');
        lector.textContent = t.paso + ', estado ' + CR.hex(t.estado);
      }
      W.texto(host, { label: 'bloque (32 cifras hexadecimales)', value: bloqueHex, max: 32, on: function (v) { bloqueHex = v; pinta(); } });
      W.texto(host, { label: 'clave (32 cifras hexadecimales)', value: claveHex, max: 32, on: function (v) { claveHex = v; pinta(); } });
      W.slider(W.row(host), { label: 'paso (0 entrada … 40 salida)', min: 0, max: 40, step: 1, value: paso, on: function (v) { paso = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('En AES, la última ronda no lleva MixColumns. ¿Por qué se quita?', [
    { t: 'Porque una mezcla lineal al final, sin clave después ni S-box, se deshace gratis: no añade seguridad y sí coste', ok: true, por: 'Cualquiera puede aplicar la inversa de MixColumns al cifrado. Lo que cuenta es que la mezcla vaya entre operaciones no lineales y claves. Quitarla además hace que descifrar tenga la misma estructura que cifrar.' },
    { t: 'Porque en la última ronda ya está todo mezclado', ok: false, por: 'Las rondas no se quitan por «suficiencia»: se quitan cuando no aportan. Y aquí no aporta porque después no hay nada que la proteja.' },
    { t: 'Para que el cifrado sea más corto', ok: false, por: 'El motivo no es el tamaño: el cifrado siempre mide 16 bytes. Es que esa operación, ahí, no cambia la seguridad.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('La clave se estira: la expansión');

  p.text('Once claves de ronda de 16 bytes salen de una clave de 16. Se trabaja con palabras de 4 bytes: ' +
    'las cuatro primeras son la clave; cada palabra siguiente es la de cuatro atrás XOR la anterior, ' +
    'y una de cada cuatro pasa antes por una transformación: girar sus bytes, pasarlos por la S-box ' +
    'y sumar una constante de ronda.');

  p.formulas([
    'w_i = w_{i-4} \\oplus w_{i-1} \\quad (i \\bmod 4 \\ne 0)',
    'w_i = w_{i-4} \\oplus \\text{SubWord}(\\text{RotWord}(w_{i-1})) \\oplus \\text{Rcon}_{i/4} \\quad (i \\equiv 0 \\bmod 4)'
  ], 'la expansión de la clave de AES-128',
    'Se lee: <em>«la palabra i es la palabra i menos cuatro xor la palabra i menos uno»</em>, y cada ' +
    'cuatro palabras, con RotWord (girar un byte), SubWord (la S-box a cada byte) y la constante ' +
    '$\\text{Rcon}_j = x^{j-1}$ en $\\text{GF}(2^8)$: 01, 02, 04, 08, 10, 20, 40, 80, 1B, 36.<br><br>La ' +
    'S-box y las constantes rompen la simetría: sin ellas, una clave toda ceros daría claves de ' +
    'ronda todas iguales, y el cifrado tendría regularidades explotables.');

  p.demo({
    title: 'Las once claves de ronda',
    intro: 'La clave del estándar y sus once claves de ronda, con el cálculo de la primera palabra nueva. Cambia un byte de la clave y observa cuántas palabras de las claves de ronda cambian.',
    predice: 'Si cambias el último byte de la clave, ¿cambiará la clave de la ronda 1 entera, o solo una parte? Sigue las fórmulas: ¿qué palabras dependen de $w_3$?',
    build: function (host) {
      var claveHex = '000102030405060708090a0b0c0d0e0f';
      var out = W.mono(host, '');
      function pinta() {
        var k = CR.deHex(claveHex); while (k.length < 16) k.push(0);
        var ks = CR.aes.expandeClave(k.slice(0, 16)), base = CR.aes.expandeClave(CR.deHex('000102030405060708090a0b0c0d0e0f')), h = '';
        var w3 = k.slice(12, 16), rot = [w3[1], w3[2], w3[3], w3[0]], sub = rot.map(function (b) { return CR.aes.SBOX[b]; }), t = [sub[0] ^ 1, sub[1], sub[2], sub[3]], w4 = [k[0] ^ t[0], k[1] ^ t[1], k[2] ^ t[2], k[3] ^ t[3]];
        h += '<b>w₃</b> = ' + CR.hex(w3) + '  → RotWord ' + CR.hex(rot) + ' → SubWord ' + CR.hex(sub) + ' → ⊕ Rcon₁ (01) ' + CR.hex(t) + '\n<b>w₄</b> = w₀ ⊕ eso = ' + CR.hex(k.slice(0, 4)) + ' ⊕ ' + CR.hex(t) + ' = <b>' + CR.hex(w4) + '</b>\n\n';
        ks.forEach(function (rk, i) {
          h += 'ronda ' + (i < 10 ? ' ' : '') + i + ': ' + CR.hexHtml(rk, claveHex === '000102030405060708090a0b0c0d0e0f' ? null : base[i]) + '\n';
        });
        out.set(h);
      }
      W.texto(host, { label: 'clave (32 cifras hexadecimales)', value: claveHex, max: 32, on: function (v) { claveHex = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'MixColumns de una columna, a mano',
    enunciado: 'Calcular el primer byte de la salida de MixColumns para la columna $(\\text{D4}, \\text{BF}, \\text{5D}, \\text{30})$, es decir, $2\\cdot\\text{D4} \\oplus 3\\cdot\\text{BF} \\oplus \\text{5D} \\oplus \\text{30}$ en $\\text{GF}(2^8)$.',
    pasos: [
      { t: '<strong>$2\\cdot\\text{D4}$.</strong> D4 $= 1101\\,0100$. Desplazado: $1010\\,1000$ con un 1 fuera; XOR 1B: $1011\\,0011 = $ B3.', antes: 'Multiplicar por 2 es xtime. ¿Sale un bit por la izquierda?' },
      { t: '<strong>$3\\cdot\\text{BF}$.</strong> $3 = 2 + 1$: es $2\\cdot\\text{BF} \\oplus \\text{BF}$. BF $= 1011\\,1111$, desplazado $0111\\,1110$ con un 1 fuera, XOR 1B: $0110\\,0101 = $ 65. Y $\\text{65} \\oplus \\text{BF} = \\text{DA}$.', antes: '$3 = x + 1$: xtime y luego XOR con el propio byte.' },
      { t: '<strong>Sumar los cuatro.</strong> $\\text{B3} \\oplus \\text{DA} = \\text{69}$; $\\text{69} \\oplus \\text{5D} = \\text{34}$; $\\text{34} \\oplus \\text{30} = \\text{04}$.', antes: 'XOR de B3, DA, 5D y 30.' },
      { t: '<strong>Comprobación.</strong> El estándar da para esa columna la salida $(\\text{04}, \\text{66}, \\text{81}, \\text{E5})$: el primer byte es 04 ✓. Los otros tres se calculan igual, con las filas siguientes de la matriz.' }
    ],
    cierre: 'Una columna de MixColumns son cuatro cuentas como esta. Una ronda, cuatro columnas. Diez rondas por bloque, y un procesador moderno hace miles de millones de bloques por segundo con una instrucción dedicada.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Por qué diez rondas, y por qué se confía');

  p.text('Los diseñadores demostraron que cualquier «camino» de diferencias a través de cuatro rondas ' +
    'activa al menos 25 S-boxes, y que con eso el criptoanálisis diferencial y el lineal se quedan ' +
    'sin probabilidad útil a partir de seis rondas. Pusieron diez para AES-128, doce para claves de ' +
    '192 bits y catorce para 256: el margen es lo que separa un cifrado de un ejercicio. El mejor ' +
    'ataque conocido contra AES-128 completo, publicado en 2011, cuesta $2^{126{,}1}$ operaciones: ' +
    'cuatro veces menos que la fuerza bruta, es decir, nada.');

  p.util('AES está en todas partes porque, además de seguro, es rápido: sus operaciones son tablas, ' +
    'desplazamientos y XOR, y desde 2010 los procesadores traen instrucciones que hacen una ronda ' +
    'entera de golpe. Con ellas un portátil cifra varios gigabytes por segundo, más de lo que lee ' +
    'el disco, y por eso cifrar un disco entero no se nota. El mismo cifrado protege la wifi, las ' +
    'conexiones seguras, los mensajes de las aplicaciones de chat, los archivos comprimidos con ' +
    'contraseña y los datos de las tarjetas.');

  p.hist('En 1997 el NIST estadounidense convocó un concurso abierto para sustituir a DES. Se presentaron ' +
    'quince cifrados de equipos de doce países; tres años de análisis público redujeron la lista a ' +
    'cinco, y en octubre de 2000 ganó Rijndael, de los belgas Joan Daemen y Vincent Rijmen, por su ' +
    'combinación de seguridad, velocidad y sencillez. Se publicó como estándar en 2001. Fue la ' +
    'primera vez que un gobierno adoptaba un cifrado diseñado fuera de sus fronteras, con las ' +
    'razones de cada decisión de diseño publicadas.');

  p.trampas([
    { e: 'Leer el estado por filas', por: 'Los 16 bytes se colocan por columnas: el byte 1 va debajo del 0. Leerlo por filas descoloca ShiftRows y MixColumns.' },
    { e: 'Multiplicar por 2 y por 3 como enteros', por: '$2\\cdot\\text{D4}$ no es 1A8: es xtime, con reducción. Y $3\\cdot b$ es $2\\cdot b \\oplus b$, no $3b$.' },
    { e: 'Creer que AES «está roto» porque hay ataques publicados', por: 'El mejor ataque cuesta $2^{126}$: es fuerza bruta con un pequeño descuento. Roto significaría un ataque practicable, y no lo hay.' },
    { e: 'Pensar que AES protege por sí solo un mensaje largo', por: 'AES transforma 16 bytes. Cómo se encadenan los bloques, el modo, decide todo lo demás, y es el tema siguiente.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  function hex(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }

  p.exercise({
    title: 'ShiftRows',
    level: 'basico',
    gen: function (r) { var fila = r.int(1, 3), col = r.int(0, 3); return { fila: fila, col: col, dest: (col - fila + 4) % 4, i: fila + 4 * col }; },
    ask: function (d) { return 'ShiftRows desplaza la fila $r$ del estado $r$ posiciones a la izquierda, dando la vuelta. El byte que está en la fila ' + d.fila + ', columna ' + d.col + ' (numeradas desde 0), ¿a qué columna va?'; },
    fields: [{ name: 'c', label: 'columna', w: 'tiny' }],
    sol: function (d) { return { c: d.dest }; },
    errores: [{ si: function (v, d) { return v.c === (d.col + d.fila) % 4 && (d.col + d.fila) % 4 !== d.dest; }, msg: 'Eso sería desplazar a la derecha. La fila se mueve hacia la izquierda: la columna baja.' }],
    hint: function () { return 'Columna nueva $= (c - r) \\bmod 4$.'; },
    steps: function (d) { return ['$(' + d.col + ' - ' + d.fila + ') \\bmod 4 = ' + d.dest + '$.', 'Ese byte es el número ' + d.i + ' del bloque (fila + 4·columna) y pasa a ser el ' + (d.fila + 4 * d.dest) + '. Así los cuatro bytes de una columna acaban en cuatro columnas distintas.']; },
    answer: function (d) { return String(d.dest); }
  });

  p.exercise({
    title: 'AddRoundKey',
    level: 'basico',
    gen: function (r) { var a = r.int(0, 255), k = r.int(0, 255); return { a: a, k: k, s: a ^ k }; },
    ask: function (d) { return 'Un byte del estado vale $\\text{' + hex(d.a) + '}$ y el byte correspondiente de la clave de ronda, $\\text{' + hex(d.k) + '}$. ¿Qué byte queda tras AddRoundKey? Escribe los 8 bits.'; },
    fields: [{ name: 's', label: 'resultado', w: 'wide' }],
    sol: function (d) { return { s: CR.bits(d.s, 8) }; },
    check: function (v, d) { var t = String(v.raw.s || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; if (t === CR.bits(d.s, 8)) return { ok: true }; if (t === CR.bits((d.a + d.k) & 255, 8) && ((d.a + d.k) & 255) !== d.s) return { ok: false, msg: 'Has sumado como enteros. AddRoundKey es XOR, sin llevadas.' }; return { ok: false, msg: 'No coincide. Pasa los dos bytes a binario y haz XOR bit a bit.' }; },
    hint: function (d) { return '$\\text{' + hex(d.a) + '} = ' + CR.bits(d.a, 8) + '$ y $\\text{' + hex(d.k) + '} = ' + CR.bits(d.k, 8) + '$.'; },
    steps: function (d) { return ['$' + CR.bits(d.a, 8) + ' \\oplus ' + CR.bits(d.k, 8) + ' = ' + CR.bits(d.s, 8) + '$.', 'Es el byte $\\text{' + hex(d.s) + '}$. Al descifrar, el mismo XOR con la misma clave lo deshace.']; },
    answer: function (d) { return CR.bits(d.s, 8); }
  });

  p.exercise({
    title: 'Tamaños y rondas',
    level: 'medio',
    gen: function (r) { var k = r.pick([128, 192, 256]); var rondas = { 128: 10, 192: 12, 256: 14 }[k]; return { k: k, rondas: rondas, claves: rondas + 1, sbox: 16 * rondas }; },
    ask: function (d) { return 'AES admite claves de 128, 192 y 256 bits, y el número de rondas crece con la clave. Con una clave de ' + d.k + ' bits, ¿cuántas rondas hace? ¿Cuántas claves de ronda necesita? ¿Y cuántas consultas a la S-box se hacen al cifrar un bloque, contando los 16 bytes de cada ronda?'; },
    fields: [{ name: 'r', label: 'rondas', w: 'tiny' }, { name: 'k', label: 'claves de ronda', w: 'tiny' }, { name: 's', label: 'pasos por la S-box', w: 'tiny' }],
    sol: function (d) { return { r: d.rondas, k: d.claves, s: d.sbox }; },
    hint: function () { return ['10, 12 o 14 rondas para 128, 192 o 256 bits.', 'Claves de ronda: una más que rondas, por el AddRoundKey inicial. S-box: 16 bytes por ronda.']; },
    steps: function (d) { return ['Clave de ' + d.k + ' bits: <strong>' + d.rondas + '</strong> rondas.', 'Claves de ronda: la inicial más una por ronda, <strong>' + d.claves + '</strong>.', 'SubBytes actúa sobre los 16 bytes en cada ronda: $16\\cdot ' + d.rondas + ' = ' + d.sbox + '$ consultas a la S-box por bloque.']; },
    answer: function (d) { return d.rondas + ', ' + d.claves + ', ' + d.sbox; }
  });

  p.exercise({
    title: 'Un byte de MixColumns',
    level: 'medio',
    gen: function (r) { var c = [r.int(0, 255), r.int(0, 255), r.int(0, 255), r.int(0, 255)]; var s = CR.gf.mul(2, c[0]) ^ CR.gf.mul(3, c[1]) ^ c[2] ^ c[3]; return { c: c, s: s, dos: CR.gf.mul(2, c[0]), tres: CR.gf.mul(3, c[1]) }; },
    ask: function (d) { return 'Una columna del estado es $(\\text{' + d.c.map(hex).join('}, \\text{') + '})$. Calcula su primer byte tras MixColumns: $2\\cdot a_0 \\oplus 3\\cdot a_1 \\oplus a_2 \\oplus a_3$ en $\\text{GF}(2^8)$. Escribe los 8 bits.'; },
    fields: [{ name: 's', label: 'byte', w: 'wide' }],
    sol: function (d) { return { s: CR.bits(d.s, 8) }; },
    check: function (v, d) { var t = String(v.raw.s || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; if (t === CR.bits(d.s, 8)) return { ok: true }; var sinRed = (((d.c[0] << 1) & 255) ^ ((d.c[1] << 1) & 255) ^ d.c[1] ^ d.c[2] ^ d.c[3]); if (t === CR.bits(sinRed, 8) && sinRed !== d.s) return { ok: false, msg: 'Has desplazado sin reducir: cuando sale un 1 por la izquierda hay que hacer XOR con 1B.' }; return { ok: false, msg: 'No coincide. $2\\cdot a_0$ es xtime; $3\\cdot a_1$ es xtime más el propio byte; los otros dos van tal cual; todo con XOR.' }; },
    hint: function (d) { return ['$2\\cdot\\text{' + hex(d.c[0]) + '} = \\text{' + hex(d.dos) + '}$.', '$3\\cdot\\text{' + hex(d.c[1]) + '} = \\text{' + hex(d.tres) + '}$. Ahora XOR de los cuatro.']; },
    steps: function (d) { return ['$2\\cdot\\text{' + hex(d.c[0]) + '} = \\text{' + hex(d.dos) + '}$ (xtime' + (d.c[0] >= 128 ? ', con reducción' : '') + ').', '$3\\cdot\\text{' + hex(d.c[1]) + '} = 2\\cdot\\text{' + hex(d.c[1]) + '} \\oplus \\text{' + hex(d.c[1]) + '} = \\text{' + hex(d.tres) + '}$.', '$\\text{' + hex(d.dos) + '} \\oplus \\text{' + hex(d.tres) + '} \\oplus \\text{' + hex(d.c[2]) + '} \\oplus \\text{' + hex(d.c[3]) + '} = \\text{' + hex(d.s) + '} = ' + CR.bits(d.s, 8) + '$.']; },
    answer: function (d) { return CR.bits(d.s, 8); }
  });

  p.exercise({
    title: 'Una palabra de la expansión',
    level: 'avanzado',
    gen: function (r) {
      var w0 = [r.int(0, 255), r.int(0, 255), r.int(0, 255), r.int(0, 255)], w3 = [r.int(0, 255), r.int(0, 255), r.int(0, 255), r.int(0, 255)], j = r.int(1, 4);
      var rcon = [1, 2, 4, 8][j - 1], rot = [w3[1], w3[2], w3[3], w3[0]], sub = rot.map(function (b) { return CR.aes.SBOX[b]; }), t = [sub[0] ^ rcon, sub[1], sub[2], sub[3]];
      return { w0: w0, w3: w3, j: j, rcon: rcon, rot: rot, sub: sub, t: t, w4: [w0[0] ^ t[0], w0[1] ^ t[1], w0[2] ^ t[2], w0[3] ^ t[3]] };
    },
    ask: function (d) { return 'En la expansión de la clave, $w_{4j} = w_{4j-4} \\oplus \\text{SubWord}(\\text{RotWord}(w_{4j-1})) \\oplus \\text{Rcon}_j$. Con $w_{4j-4} = \\text{' + CR.hex(d.w0) + '}$, $w_{4j-1} = \\text{' + CR.hex(d.w3) + '}$ y $j = ' + d.j + '$ ($\\text{Rcon}_' + d.j + ' = \\text{' + hex(d.rcon) + '000000}$). Se dan las consultas a la S-box que hacen falta: ' + d.rot.map(function (b, i) { return 'S(' + hex(b) + ') = ' + hex(d.sub[i]); }).join(', ') + '. Calcula $w_{4j}$ en hexadecimal (8 cifras).'; },
    fields: [{ name: 'w', label: 'w', w: 'wide' }],
    sol: function (d) { return { w: CR.hex(d.w4) }; },
    check: function (v, d) {
      var t = String(v.raw.w || '').replace(/[^0-9a-fA-F]/g, '').toLowerCase();
      if (t.length !== 8) return { ok: false, msg: 'Son 8 cifras hexadecimales, cuatro bytes.' };
      if (t === CR.hex(d.w4)) return { ok: true };
      var sinRot = d.w3.map(function (b) { return CR.aes.SBOX[b]; }); sinRot[0] ^= d.rcon;
      if (t === CR.hex(d.w0.map(function (b, i) { return b ^ sinRot[i]; }))) return { ok: false, msg: 'Falta RotWord: antes de la S-box, el primer byte pasa al final.' };
      if (t === CR.hex(d.w0.map(function (b, i) { return b ^ d.sub[i]; }))) return { ok: false, msg: 'Falta la constante de ronda: XOR de $\\text{' + hex(d.rcon) + '}$ con el primer byte.' };
      return { ok: false, msg: 'No coincide. RotWord gira un byte, SubWord aplica la S-box a cada byte, se hace XOR con Rcon en el primer byte, y el resultado se combina con $w_{4j-4}$.' };
    },
    hint: function (d) { return ['RotWord: $\\text{' + CR.hex(d.rot) + '}$. SubWord: $\\text{' + CR.hex(d.sub) + '}$.', 'XOR con Rcon: $\\text{' + CR.hex(d.t) + '}$. Y XOR con $w_{4j-4}$.']; },
    steps: function (d) { return ['RotWord: $\\text{' + CR.hex(d.w3) + '} \\to \\text{' + CR.hex(d.rot) + '}$.', 'SubWord: $\\text{' + CR.hex(d.sub) + '}$. Con Rcon: $\\text{' + CR.hex(d.t) + '}$.', '$w_{4j} = \\text{' + CR.hex(d.w0) + '} \\oplus \\text{' + CR.hex(d.t) + '} = \\text{' + CR.hex(d.w4) + '}$.', 'Las tres palabras siguientes son solo XOR de la anterior con la de cuatro atrás.']; },
    answer: function (d) { return CR.hex(d.w4); }
  });

  p.keys([
    'AES: 16 bytes en una rejilla $4\\times 4$ por columnas, y diez rondas de SubBytes, ShiftRows, MixColumns y AddRoundKey (la última sin MixColumns).',
    'SubBytes es el inverso en $\\text{GF}(2^8)$ más una mezcla lineal; MixColumns es un Hill de bytes con la matriz de 2, 3, 1, 1; AddRoundKey es XOR.',
    'La clave se expande a 11 claves de ronda con RotWord, SubWord y las constantes Rcon.',
    'Diez rondas se eligieron demostrando que el criptoanálisis diferencial y lineal no pasan de seis, más margen.',
    'Veinticinco años de ataques públicos y el mejor cuesta $2^{126}$: por eso se confía, no porque lo diga nadie.'
  ]);
});
