/* Tema: Los bytes como polinomios: el cuerpo de 256 elementos */
Course.topic('cr-galois', function (p) {

  p.puente('Para mezclar bytes como [[cr-hill|Hill]] mezclaba letras hace falta poder multiplicarlos ' +
    'y dividirlos sin salirse del byte. Los enteros módulo 256 no sirven, porque el 2 no tiene ' +
    'inverso. La solución trata cada byte como un [[al-polinomios|polinomio]] con coeficientes 0 y ' +
    '1, suma con [[cr-vernam|XOR]] y multiplica reduciendo módulo un polinomio que hace de primo. ' +
    'Es la aritmética que hay dentro de AES.');

  p.text('En la aritmética modular del bloque, se ha trabajado módulo 26 y módulo un primo. Módulo 26 ' +
    'no todos los números tienen inverso, porque 26 no es primo. Con bytes pasa lo mismo: módulo ' +
    '256 solo los impares tienen inverso. Y un cifrado quiere dividir entre cualquier byte que no ' +
    'sea cero. La salida está en cambiar de aritmética: no la de los números, sino la de los ' +
    'polinomios.');

  /* ---------------------------------------------------------------- */
  p.section('Un byte es un polinomio');

  p.text('Se lee cada bit como el coeficiente de una potencia de $x$: el byte $0101\\,0111$, que en ' +
    'hexadecimal es 57, es el polinomio $x^6 + x^4 + x^2 + x + 1$. Los coeficientes solo pueden ' +
    'valer 0 o 1, y se operan módulo 2, así que $1 + 1 = 0$: sumar dos polinomios es hacer XOR de ' +
    'los bytes, y no hay llevadas.');

  p.formula('\\text{57} = x^6 + x^4 + x^2 + x + 1, \\qquad \\text{57} + \\text{83} = \\text{57} \\oplus \\text{83} = \\text{D4}',
    'bytes como polinomios y su suma',
    'Se lee: <em>«el byte cinco siete es equis a la sexta más equis a la cuarta más equis cuadrado ' +
    'más equis más uno»</em>.<br><br>83 es $x^7 + x + 1$. Sumados, la $x$ y el 1 aparecen dos veces y ' +
    'se cancelan: $x^7 + x^6 + x^4 + x^2$, que es $1101\\,0100 = $ D4. Lo mismo que $0101\\,0111 \\oplus ' +
    '1000\\,0011$.');

  p.demo({
    title: 'Del byte al polinomio y vuelta',
    intro: 'Escribe dos bytes en hexadecimal. La demo los escribe como polinomios y los suma, cancelando los términos repetidos, que es lo que hace XOR.',
    predice: '¿Qué byte hace de cero en esta aritmética, el que sumado a cualquiera lo deja igual? ¿Y qué da un byte sumado consigo mismo?',
    build: function (host) {
      var a = 0x57, b = 0x83;
      var out = W.readout(host, '');
      function poli(n) {
        var t = [];
        for (var i = 7; i >= 0; i--) if (n & (1 << i)) t.push(i === 0 ? '1' : (i === 1 ? 'x' : 'x^{' + i + '}'));
        return t.length ? t.join(' + ') : '0';
      }
      function hex(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }
      function pinta() {
        out.set('$\\text{' + hex(a) + '} = ' + CR.bits(a, 8) + ' = ' + poli(a) + '$<br>$\\text{' + hex(b) + '} = ' + CR.bits(b, 8) + ' = ' + poli(b) + '$<br>suma: $' + poli(a ^ b) + ' = ' + CR.bits(a ^ b, 8) + ' = \\text{' + hex(a ^ b) + '}$<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Los términos que aparecen en los dos se cancelan, porque $1 + 1 = 0$: es el XOR bit a bit.</span>');
      }
      W.texto(host, { label: 'primer byte (hex)', value: '57', max: 2, corto: true, on: function (v) { a = parseInt(v, 16) & 255 || 0; pinta(); } });
      W.texto(host, { label: 'segundo byte (hex)', value: '83', max: 2, corto: true, on: function (v) { b = parseInt(v, 16) & 255 || 0; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Multiplicar y reducir');

  p.text('Multiplicar dos polinomios es lo de siempre, con coeficientes módulo 2. El problema es que el ' +
    'producto de dos de grado 7 tiene grado 14, y no cabe en un byte. Se hace lo mismo que con los ' +
    'enteros módulo un primo: se divide entre un polinomio fijo de grado 8 y se toma el resto. AES ' +
    'usa este:');

  p.formula('m(x) = x^8 + x^4 + x^3 + x + 1', 'el módulo de AES',
    'Es <strong>irreducible</strong>: no se factoriza en polinomios de grado menor con coeficientes ' +
    '0 y 1, igual que un primo no se factoriza. Eso es lo que garantiza que todo byte distinto de ' +
    'cero tenga inverso.<br><br>Reducir es fácil si se hace paso a paso. Multiplicar por $x$ es ' +
    'desplazar los bits una posición a la izquierda; si se sale un 1 por la izquierda, es que ha ' +
    'aparecido $x^8$, y como $x^8 = x^4 + x^3 + x + 1$ módulo $m(x)$, se sustituye haciendo XOR con ' +
    '$0001\\,1011 = $ 1B. A esa operación se le llama <em>xtime</em>.');

  p.formula('a \\cdot b = \\bigoplus_{k:\\ b_k = 1} a\\cdot x^k, \\qquad a\\cdot x^{k+1} = \\text{xtime}(a\\cdot x^k)',
    'multiplicar con xtime',
    'Se lee: <em>«a por b es la suma, para cada bit de b que vale 1, de a por equis a la ka»</em>. ' +
    'Como en la multiplicación rusa: se van doblando (xtime) y se suman las potencias que ' +
    'correspondan a los unos de $b$.');

  p.demo({
    title: 'Multiplicar dos bytes',
    intro: 'Cada fila es $a\\cdot x^k$, obtenida de la anterior con xtime: desplazar y, si sale un bit, XOR con 1B. Se suman las filas de los bits de $b$ que valen 1.',
    predice: 'Multiplica 57 por 02 y por 04. ¿Qué relación hay entre los resultados? ¿Y qué pasa con 80 por 02, donde el bit alto está encendido?',
    build: function (host) {
      var a = 0x57, b = 0x83;
      var out = W.mono(host, '');
      function hex(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }
      function pinta() {
        var t = CR.gf.mulTraza(a, b), h = '<b>' + hex(a) + ' · ' + hex(b) + '</b>   b = ' + CR.bits(b, 8) + '\n\n';
        t.pasos.forEach(function (ps) {
          h += (ps.usa ? '<b>' : '<span class="cr-tenue">') + 'a·x^' + ps.k + ' = ' + CR.bits(ps.potencia, 8) + ' (' + hex(ps.potencia) + ')' + (ps.usa ? '  ← bit ' + ps.k + ' de b es 1: se suma' : '') + (ps.usa ? '</b>' : '</span>') + '\n';
        });
        h += '\n<b>resultado:</b> ' + CR.bits(t.valor, 8) + ' = ' + hex(t.valor);
        out.set(h);
      }
      W.texto(host, { label: 'a (hex)', value: '57', max: 2, corto: true, on: function (v) { a = parseInt(v, 16) & 255 || 0; pinta(); } });
      W.texto(host, { label: 'b (hex)', value: '83', max: 2, corto: true, on: function (v) { b = parseInt(v, 16) & 255 || 0; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: '57 por 83, como en el estándar',
    enunciado: 'Calcular $\\text{57}\\cdot\\text{83}$ en el cuerpo de AES. Es el ejemplo del propio documento del estándar.',
    pasos: [
      { t: '<strong>Las potencias.</strong> $\\text{57}\\cdot x = 1010\\,1110 = $ AE (desplazar; no sale nada). $\\cdot x$ otra vez: $0101\\,1100$ con un 1 fuera, XOR 1B: $0100\\,0111 = $ 47. Seguimos: $\\text{8E}$, luego $0001\\,1100 \\oplus \\text{1B} = $ 07, luego 0E, 1C, 38.', antes: 'Desplaza 57 una vez. ¿Sale algún bit por la izquierda?' },
      { t: '<strong>Los bits de 83.</strong> $\\text{83} = 1000\\,0011$: bits 0, 1 y 7.', antes: '¿Qué potencias de $x$ tiene el 83?' },
      { t: '<strong>Sumar.</strong> $\\text{57}\\cdot x^0 \\oplus \\text{57}\\cdot x^1 \\oplus \\text{57}\\cdot x^7 = \\text{57} \\oplus \\text{AE} \\oplus \\text{38}$. $\\text{57} \\oplus \\text{AE} = \\text{F9}$, y $\\text{F9} \\oplus \\text{38} = \\text{C1}$.', antes: 'XOR de las tres filas que tocan.' },
      { t: '<strong>Comprobación.</strong> El estándar dice $\\text{57}\\cdot\\text{83} = \\text{C1}$ ✓. Y $\\text{57}\\cdot\\text{13} = \\text{FE}$, que puedes verificar en la demo.' }
    ],
    cierre: 'Ocho desplazamientos y unos cuantos XOR: una multiplicación en este cuerpo cuesta menos que una multiplicación de enteros, y por eso AES es tan rápido en hardware.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Un cuerpo: todo lo que no es cero se puede dividir');

  p.text('Con $m(x)$ irreducible, los 256 bytes con esta suma y este producto forman un ' +
    '<strong>cuerpo</strong>: se puede sumar, restar (que es sumar), multiplicar y dividir entre ' +
    'cualquier byte distinto de cero, y todas las reglas de siempre se cumplen. Se llama ' +
    '$\\text{GF}(2^8)$, el cuerpo de Galois de 256 elementos, y es el análogo exacto de los enteros ' +
    'módulo un primo, con $m(x)$ en el papel del primo. Hay una sola versión de este cuerpo, salvo ' +
    'el nombre de los elementos; AES eligió $m(x)$ entre los 30 polinomios irreducibles de grado 8 ' +
    'porque era el primero de la lista.');

  p.formula('a^{255} = 1 \\quad (a \\ne 0), \\qquad a^{-1} = a^{254}', 'el inverso, con el teorema de Fermat del cuerpo',
    'Se lee: <em>«a elevado a doscientos cincuenta y cinco es uno, y el inverso de a es a elevado a ' +
    'doscientos cincuenta y cuatro»</em>. Es el [[av-numeros|pequeño teorema de Fermat]] en este ' +
    'cuerpo: los 255 elementos no nulos forman un grupo con el producto.<br><br>El inverso también ' +
    'se puede calcular con Euclides extendido para polinomios, o mirarlo en una tabla de 256 ' +
    'entradas, que es lo que hace cualquier implementación.');

  p.demo({
    title: 'Inversos y la S-box de AES',
    intro: 'Cada byte no nulo tiene un inverso: su producto da 01. La S-box de AES es ese inverso seguido de una mezcla lineal de bits y un XOR con 63. Así, la única parte «sin fórmula» de AES tiene, en realidad, una fórmula, pero no es lineal: es una división.',
    predice: '¿Cuál es el inverso de 01? ¿Y de 02, sabiendo que $x\\cdot x^{-1} = 1$ y que $x^8 = x^4 + x^3 + x + 1$?',
    build: function (host) {
      var a = 0x53;
      var out = W.readout(host, '');
      function hex(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }
      function pinta() {
        if (!a) { out.set('El 00 es el único byte sin inverso: nada multiplicado por cero da uno.'); return; }
        var inv = CR.gf.inv(a);
        out.set('$\\text{' + hex(a) + '}^{-1} = \\text{' + hex(inv) + '}$, porque $\\text{' + hex(a) + '}\\cdot\\text{' + hex(inv) + '} = \\text{' + hex(CR.gf.mul(a, inv)) + '}$.<br>S-box de AES: inverso $' + CR.bits(inv, 8) + '$, tras la mezcla lineal y el XOR con 63: $\\text{S(' + hex(a) + ')} = \\text{' + hex(CR.aes.SBOX[a]) + '}$.<br><span style="font-size:0.7812rem;color:var(--ink-faint)">El estándar da como ejemplo $\\text{S(53)} = \\text{ED}$. La mezcla lineal es la que evita que la S-box sea «solo» una división, con puntos fijos y demasiada estructura algebraica.</span>');
      }
      W.slider(W.row(host), { label: 'byte a', min: 0, max: 255, step: 1, value: a, format: function (v) { return hex(v); }, on: function (v) { a = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('¿Por qué AES no usa simplemente los enteros módulo 256 para multiplicar bytes?', [
    { t: 'Porque módulo 256 la mitad de los bytes, los pares, no tienen inverso, y el cifrado necesita deshacer cualquier multiplicación', ok: true, por: '256 no es primo. En $\\text{GF}(2^8)$, con $m(x)$ irreducible, los 255 bytes no nulos tienen inverso: es un cuerpo, como los enteros módulo un primo.' },
    { t: 'Porque los polinomios son más rápidos que los números', ok: false, por: 'La rapidez es una consecuencia agradable, no el motivo. El motivo es algebraico: hace falta un cuerpo, y $\\mathbb{Z}_{256}$ no lo es.' },
    { t: 'Porque 256 no es una potencia de 2', ok: false, por: '$256 = 2^8$ sí lo es. El problema es que no es primo, y por eso hay que construir el cuerpo de otra manera.' }
  ]);

  p.util('$\\text{GF}(2^8)$ está en más sitios de los que parece. Cada código QR lleva bytes de corrección ' +
    'calculados con polinomios sobre este cuerpo, los códigos de Reed y Solomon, y por eso se lee ' +
    'aunque le falte un trozo; lo mismo protege los CD, los DVD y las transmisiones de las sondas ' +
    'espaciales. Los sistemas RAID 6 de los discos duros reconstruyen dos discos perdidos con la ' +
    'misma aritmética. Y en AES, dos de las cuatro operaciones de cada ronda, SubBytes y ' +
    'MixColumns, son inversos y productos en este cuerpo.');

  p.hist('Évariste Galois describió los cuerpos finitos en 1830, con veinte años, en un trabajo que la ' +
    'Academia de Ciencias de París extravió; murió en un duelo dos años después, tras pasar la ' +
    'noche anterior escribiendo sus resultados en cartas. Irving Reed y Gustave Solomon usaron ' +
    'estos cuerpos en 1960 para corregir errores, y Joan Daemen y Vincent Rijmen los pusieron en el ' +
    'centro de Rijndael en 1998. El polinomio $x^8 + x^4 + x^3 + x + 1$ se eligió, según sus autores, ' +
    'por ser el primer irreducible de grado 8 de una tabla de un libro de texto.');

  p.trampas([
    { e: 'Sumar bytes con llevadas', por: 'En el cuerpo, $1 + 1 = 0$ y no hay acarreo: $\\text{57} + \\text{83}$ es $\\text{D4}$, no $\\text{DA}$. Sumar es XOR.' },
    { e: 'Olvidar la reducción al desplazar', por: 'Si al multiplicar por $x$ sale un 1 por la izquierda, ha aparecido $x^8$ y hay que hacer XOR con 1B. Sin eso, el resultado no es un byte.' },
    { e: 'Reducir cuando no sale nada', por: 'El XOR con 1B solo se aplica si el bit alto era 1 antes de desplazar. Aplicarlo siempre estropea el producto.' },
    { e: 'Buscar el inverso de 00', por: 'No existe, en ningún cuerpo. Por eso la S-box de AES lo trata aparte: manda el 00 al 63, que es lo que da la mezcla lineal sobre 00.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  function hex(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }
  function poli(n) { var t = []; for (var i = 7; i >= 0; i--) if (n & (1 << i)) t.push(i === 0 ? '1' : (i === 1 ? 'x' : 'x^{' + i + '}')); return t.length ? t.join(' + ') : '0'; }

  p.exercise({
    title: 'Del polinomio al byte',
    level: 'basico',
    gen: function (r) { var n = r.int(1, 255); return { n: n }; },
    ask: function (d) { return '¿Qué byte es el polinomio $' + poli(d.n) + '$? Escribe sus 8 bits.'; },
    fields: [{ name: 'b', label: 'bits', w: 'wide' }],
    sol: function (d) { return { b: CR.bits(d.n, 8) }; },
    check: function (v, d) { var t = String(v.raw.b || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits, incluidos los ceros de la izquierda.' }; if (t === CR.bits(d.n, 8)) return { ok: true }; if (t === CR.bits(d.n, 8).split('').reverse().join('')) return { ok: false, msg: 'Está al revés: $x^7$ es el bit de más a la izquierda.' }; return { ok: false, msg: 'No coincide. Cada término $x^k$ es un 1 en la posición $k$, contando desde la derecha y empezando en 0.' }; },
    hint: function () { return 'Bit $k$ (desde la derecha, desde 0) $= 1$ si el polinomio tiene $x^k$.'; },
    steps: function (d) { return ['Términos presentes: ' + poli(d.n).replace(/\^\{(\d)\}/g, '^$1') + '.', 'Bits: <strong>' + CR.bits(d.n, 8) + '</strong>, el byte ' + hex(d.n) + ' en hexadecimal.']; },
    answer: function (d) { return CR.bits(d.n, 8); }
  });

  p.exercise({
    title: 'Sumar en el cuerpo',
    level: 'basico',
    gen: function (r) { var a = r.int(1, 255), b = r.int(1, 255); if (a === b) return null; return { a: a, b: b, s: a ^ b }; },
    ask: function (d) { return 'Suma los bytes $\\text{' + hex(d.a) + '} = ' + CR.bits(d.a, 8) + '$ y $\\text{' + hex(d.b) + '} = ' + CR.bits(d.b, 8) + '$ en $\\text{GF}(2^8)$. Escribe los 8 bits.'; },
    fields: [{ name: 's', label: 'suma', w: 'wide' }],
    sol: function (d) { return { s: CR.bits(d.s, 8) }; },
    check: function (v, d) { var t = String(v.raw.s || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; if (t === CR.bits(d.s, 8)) return { ok: true }; if (t === CR.bits((d.a + d.b) & 255, 8) && ((d.a + d.b) & 255) !== d.s) return { ok: false, msg: 'Has sumado con llevadas, como enteros. En el cuerpo, $1 + 1 = 0$: es XOR.' }; return { ok: false, msg: 'No coincide. Bit a bit, sin llevadas.' }; },
    hint: function () { return 'Los términos repetidos se cancelan: XOR.'; },
    steps: function (d) { return ['$' + poli(d.a) + '$ más $' + poli(d.b) + '$.', 'Los términos comunes se anulan; queda $' + poli(d.s) + '$.', 'En bits: <strong>' + CR.bits(d.s, 8) + '</strong> $= \\text{' + hex(d.s) + '}$.']; },
    answer: function (d) { return CR.bits(d.s, 8); }
  });

  p.exercise({
    title: 'Multiplicar por x',
    level: 'medio',
    gen: function (r) { var a = r.int(1, 255); return { a: a, x: CR.gf.xtime(a), sale: a >= 128 }; },
    ask: function (d) { return 'Calcula $\\text{' + hex(d.a) + '}\\cdot x$ en el cuerpo de AES: desplaza $' + CR.bits(d.a, 8) + '$ un bit a la izquierda y, si sale un 1, haz XOR con $0001\\,1011$. Escribe los 8 bits.'; },
    fields: [{ name: 'x', label: 'resultado', w: 'wide' }],
    sol: function (d) { return { x: CR.bits(d.x, 8) }; },
    check: function (v, d) { var t = String(v.raw.x || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; if (t === CR.bits(d.x, 8)) return { ok: true }; if (d.sale && t === CR.bits((d.a << 1) & 255, 8)) return { ok: false, msg: 'Ha salido un 1 por la izquierda: es $x^8$, y hay que reducirlo con XOR 1B.' }; if (!d.sale && t === CR.bits(((d.a << 1) & 255) ^ 0x1b, 8)) return { ok: false, msg: 'No ha salido ningún bit: no hay que reducir. El XOR con 1B es solo cuando el bit alto era 1.' }; return { ok: false, msg: 'No coincide. Desplaza, y reduce solo si se sale un 1.' }; },
    hint: function (d) { return 'El bit alto de ' + CR.bits(d.a, 8) + ' es ' + (d.sale ? '1: al desplazar sale, y toca reducir.' : '0: al desplazar no sale nada.'); },
    steps: function (d) { return ['Desplazado: $' + CR.bits((d.a << 1) & 255, 8) + '$' + (d.sale ? ', y ha salido un 1: es $x^8 = x^4 + x^3 + x + 1$.' : ', sin que salga nada.'), d.sale ? '$' + CR.bits((d.a << 1) & 255, 8) + ' \\oplus 0001\\,1011 = ' + CR.bits(d.x, 8) + '$.' : 'Resultado: $' + CR.bits(d.x, 8) + '$.', '$\\text{' + hex(d.a) + '}\\cdot x = \\text{' + hex(d.x) + '}$.']; },
    answer: function (d) { return CR.bits(d.x, 8); }
  });

  p.exercise({
    title: 'Un producto pequeño',
    level: 'medio',
    gen: function (r) { var a = r.int(16, 255), b = r.pick([3, 5, 6, 9, 10, 12]); return { a: a, b: b, p: CR.gf.mul(a, b) }; },
    ask: function (d) { return 'Calcula $\\text{' + hex(d.a) + '}\\cdot\\text{' + hex(d.b) + '}$ en $\\text{GF}(2^8)$. Como $\\text{' + hex(d.b) + '} = ' + poli(d.b) + '$, basta con sumar las potencias $\\text{' + hex(d.a) + '}\\cdot x^k$ que correspondan. Escribe los 8 bits.'; },
    fields: [{ name: 'p', label: 'producto', w: 'wide' }],
    sol: function (d) { return { p: CR.bits(d.p, 8) }; },
    check: function (v, d) { var t = String(v.raw.p || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; if (t === CR.bits(d.p, 8)) return { ok: true }; return { ok: false, msg: 'No coincide. Calcula $a$, $a\\cdot x$, $a\\cdot x^2$, $a\\cdot x^3$ con xtime y suma las que marquen los bits de ' + hex(d.b) + '.' }; },
    hint: function (d) { var t = CR.gf.mulTraza(d.a, d.b); return t.pasos.map(function (ps) { return '$a\\cdot x^{' + ps.k + '} = ' + CR.bits(ps.potencia, 8) + '$' + (ps.usa ? ' (se suma)' : ''); }).join(', ') + '.'; },
    steps: function (d) { var t = CR.gf.mulTraza(d.a, d.b); return ['Potencias: ' + t.pasos.map(function (ps) { return '$a x^{' + ps.k + '} = \\text{' + hex(ps.potencia) + '}$'; }).join(', ') + '.', 'Se suman las de los bits ' + t.pasos.filter(function (ps) { return ps.usa; }).map(function (ps) { return ps.k; }).join(', ') + ' de ' + hex(d.b) + ': $' + t.pasos.filter(function (ps) { return ps.usa; }).map(function (ps) { return '\\text{' + hex(ps.potencia) + '}'; }).join(' \\oplus ') + ' = \\text{' + hex(d.p) + '}$.', 'En bits: <strong>' + CR.bits(d.p, 8) + '</strong>.']; },
    answer: function (d) { return CR.bits(d.p, 8); }
  });

  p.exercise({
    title: '¿Es su inverso?',
    level: 'avanzado',
    gen: function (r) { var a = r.int(2, 255), inv = CR.gf.inv(a), es = r.bool(0.5), b = es ? inv : (inv ^ r.int(1, 255)) || 1; if (b === inv) es = true; return { a: a, b: b, prod: CR.gf.mul(a, b), es: es, inv: inv }; },
    ask: function (d) { return '¿Es $\\text{' + hex(d.b) + '}$ el inverso de $\\text{' + hex(d.a) + '}$ en $\\text{GF}(2^8)$? Calcula el producto $\\text{' + hex(d.a) + '}\\cdot\\text{' + hex(d.b) + '}$ (8 bits) y decide.'; },
    fields: [{ name: 'p', label: 'producto', w: 'wide' }, { name: 'q', label: 'es el inverso', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { p: CR.bits(d.prod, 8), q: d.es ? 'si' : 'no' }; },
    check: function (v, d) { var t = String(v.raw.p || '').replace(/[^01]/g, ''); var okP = t === CR.bits(d.prod, 8), okQ = v.raw.q === (d.es ? 'si' : 'no'); if (okP && okQ) return { ok: true }; return { ok: false, msg: okP ? 'El producto está bien: es el inverso exactamente cuando el producto vale $0000\\,0001$.' : 'El producto no coincide. Hazlo con xtime: hasta ocho potencias de $a$, sumando las que marquen los bits de $b$.', fields: { p: okP, q: okQ } }; },
    hint: function () { return 'Es el inverso si y solo si el producto es 01. Multiplica con la tabla de potencias y xtime.'; },
    steps: function (d) { return ['$\\text{' + hex(d.a) + '}\\cdot\\text{' + hex(d.b) + '} = \\text{' + hex(d.prod) + '} = ' + CR.bits(d.prod, 8) + '$.', d.es ? 'Es 01: <strong>sí</strong> es el inverso.' : 'No es 01: <strong>no</strong>. El inverso de ' + hex(d.a) + ' es ' + hex(d.inv) + '.', 'Ese inverso, pasado por la mezcla lineal y el XOR con 63, es lo que la S-box de AES devuelve para ' + hex(d.a) + ': S(' + hex(d.a) + ') = ' + hex(CR.aes.SBOX[d.a]) + '.']; },
    answer: function (d) { return CR.bits(d.prod, 8) + (d.es ? ', sí' : ', no'); }
  });

  p.keys([
    'Un byte es un polinomio de grado menor que 8 con coeficientes 0 y 1. Sumar es XOR: sin llevadas.',
    'Multiplicar es multiplicar polinomios y reducir módulo $m(x) = x^8 + x^4 + x^3 + x + 1$; por $x$ es desplazar y, si sale un bit, XOR con 1B.',
    'Como $m(x)$ es irreducible, los 256 bytes forman un cuerpo, $\\text{GF}(2^8)$: todo lo que no es cero tiene inverso, $a^{-1} = a^{254}$.',
    'La S-box de AES es el inverso en este cuerpo seguido de una mezcla lineal: no lineal, pero con fórmula.',
    'La misma aritmética corrige errores en los QR, los CD y los discos RAID.'
  ]);
});
