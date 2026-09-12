/* Tema: Cifrado por bloques: confusion y difusion */
Course.topic('cr-bloque', function (p) {

  p.puente('[[cr-hill|Hill]] mezclaba letras con una matriz y se rompía por ser lineal; la ' +
    '[[cr-transposicion|transposición]] enseñó que sustituir y desordenar a la vez se refuerzan. ' +
    'Este tema junta las dos ideas con la [[cr-vernam|operación XOR]] y da la receta de todos los ' +
    'cifrados actuales: rondas de sustitución no lineal, permutación y clave.');

  p.text('Un cifrado por bloques toma un trozo de mensaje de tamaño fijo, hoy 128 bits, y lo ' +
    'convierte en otro del mismo tamaño con una clave. Es una permutación gigantesca de los ' +
    '$2^{128}$ bloques posibles, elegida por la clave. Nadie puede escribir esa tabla; lo que se ' +
    'escribe es una receta corta que la <em>calcula</em>, y la receta la dio Shannon en 1949 con ' +
    'dos palabras: <strong>confusión</strong> y <strong>difusión</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Confusión y difusión');

  p.list([
    '<strong>Confusión</strong>: que la relación entre la clave y el cifrado sea lo más enrevesada posible, nada de ecuaciones lineales que se despejen como en Hill. Se consigue con <em>cajas de sustitución</em>, tablas pequeñas no lineales.',
    '<strong>Difusión</strong>: que cada bit del mensaje influya en muchos bits del cifrado, para que las frecuencias y cualquier otra regularidad se repartan y desaparezcan. Se consigue con <em>permutaciones</em> de bits y mezclas.'
  ]);

  p.text('Ninguna de las dos basta sola: una sustitución de bloques enteros sería una tabla imposible, ' +
    'y una permutación es lineal. La solución es hacer las dos cosas <strong>a pequeña escala y ' +
    'muchas veces</strong>: una ronda sustituye cada grupo de 4 bits con una tabla, permuta los bits ' +
    'del bloque y mezcla la clave con XOR; y se encadenan diez o doce rondas. Es la ' +
    '<strong>red de sustitución y permutación</strong>.');

  p.table(['Entrada', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'], [
    ['S-box', 'E', '4', 'D', '1', '2', 'F', 'B', '8', '3', 'A', '6', 'C', '5', '9', '0', '7']
  ]);

  p.text('Esa es la caja de sustitución de 4 bits que usa la demo: cada grupo de 4 bits, leído como un ' +
    'número de 0 a 15, se cambia por el de la tabla. No hay fórmula detrás, y eso es lo que se busca: ' +
    'una tabla que no se pueda escribir como $ax + b$. La permutación es más simple: el bit $i$ va a la ' +
    'posición $4(i \\bmod 4) + \\lfloor i/4 \\rfloor$, como transponer una rejilla de $4\\times 4$.');

  p.demo({
    title: 'Una red de sustitución y permutación de 16 bits',
    intro: 'Un bloque de 16 bits, una clave de 16 bits y hasta cuatro rondas. En cada ronda: XOR con la clave de ronda, S-box a cada grupo de 4 bits y permutación de los 16 bits (menos en la última, donde no aporta nada). Cambia un bit del bloque o de la clave y mira cuántos cambian a la salida.',
    predice: 'Con una sola ronda, cambiar el primer bit del bloque cambia como mucho los 4 bits de su S-box. ¿Cuántos bits cambiarán con dos rondas? ¿Y con cuatro?',
    build: function (host) {
      var bloque = 0x1234, clave = 0xC0DE, rondas = 4, bitVolteado = -1;
      var out = W.mono(host, '');
      function pinta() {
        var b2 = bitVolteado >= 0 ? bloque ^ (1 << (15 - bitVolteado)) : bloque;
        var r1 = CR.spn.cifra(bloque, clave, rondas), r2 = CR.spn.cifra(b2, clave, rondas), h = '';
        h += '<b>bloque:</b> ' + CR.bitsHtml(CR.bits(bloque, 16), CR.bits(b2, 16)) + '   <b>clave:</b> ' + CR.bits(clave, 16) + '\n\n';
        r1.traza.forEach(function (t, i) {
          var t2 = r2.traza[i], dif = CR.hamming([t.valor >> 8, t.valor & 255], [t2.valor >> 8, t2.valor & 255]);
          h += (t.ronda ? 'ronda ' + t.ronda + ' ' : '        ') + (t.paso + '            ').slice(0, 12) + CR.bitsHtml(CR.bits(t.valor, 16), CR.bits(t2.valor, 16)) + (bitVolteado >= 0 ? '  <span class="cr-tenue">' + dif + ' bits distintos</span>' : '') + '\n';
        });
        h += '\n<b>salida:</b> ' + CR.bits(r1.salida, 16) + ' = ' + ('0000' + r1.salida.toString(16).toUpperCase()).slice(-4) + ' (hex)';
        out.set(h);
      }
      W.texto(host, { label: 'bloque (4 cifras hexadecimales)', value: '1234', max: 4, corto: true, on: function (v) { bloque = parseInt(v, 16) || 0; pinta(); } });
      W.texto(host, { label: 'clave (4 cifras hexadecimales)', value: 'C0DE', max: 4, corto: true, on: function (v) { clave = parseInt(v, 16) || 0; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'rondas', min: 1, max: 4, step: 1, value: rondas, on: function (v) { rondas = v; pinta(); } });
      W.slider(fila, { label: 'comparar cambiando el bit nº (−1: no)', min: -1, max: 15, step: 1, value: bitVolteado, on: function (v) { bitVolteado = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El efecto avalancha');

  p.text('Lo que la demo enseña tiene nombre: <strong>efecto avalancha</strong>. Un bit cambiado en la ' +
    'entrada altera 4 bits tras la primera S-box, la permutación los reparte en cuatro cajas ' +
    'distintas, la segunda ronda los convierte en hasta 16, y a partir de ahí cada bit de salida ' +
    'cambia con probabilidad cercana a $1/2$. Un buen cifrado por bloques cumple que, cambiando un ' +
    'bit cualquiera de la entrada o de la clave, cambia <strong>la mitad</strong> de los bits de la ' +
    'salida, y cuáles cambian parece azar.');

  p.formula('\\mathbb{E}[\\text{bits que cambian}] \\approx \\frac{n}{2}', 'criterio de avalancha',
    'Se lee: <em>«el número esperado de bits que cambian es aproximadamente ene medios»</em>. Con ' +
    'bloques de 128 bits, 64. Menos que eso significa que hay bits de salida que «recuerdan» bits ' +
    'de entrada, y esa memoria es una grieta.');

  p.demo({
    title: 'Medir la avalancha',
    intro: 'Se cifran muchos bloques al azar, y cada uno también con un bit cambiado. La barra de cada ronda es el promedio de bits de salida que cambian. Con pocas rondas la avalancha no se completa.',
    predice: 'Con 16 bits de bloque, ¿hacia qué número tendrá que subir la barra para que el cifrado sea «bueno»? ¿Lo alcanzará con dos rondas?',
    build: function (host) {
      var out = W.readout(host, ''), r = U.rng(3), medias = [0, 0, 0, 0];
      var plot = W.barChart(host, { labels: ['1 ronda', '2 rondas', '3 rondas', '4 rondas'], values: medias, height: 240, ylabel: 'bits que cambian', dec: 1, color: 0,
        extra: function (g) { g.hline(8, { color: 1, dash: [5, 4], w: 1.4, label: '8 = la mitad' }); } });
      function mide() {
        var N = 300, suma = [0, 0, 0, 0];
        for (var i = 0; i < N; i++) {
          var b = r.int(0, 65535), k = r.int(0, 65535), bit = r.int(0, 15);
          for (var ro = 1; ro <= 4; ro++) {
            var a = CR.spn.cifra(b, k, ro).salida, c = CR.spn.cifra(b ^ (1 << bit), k, ro).salida;
            suma[ro - 1] += CR.hamming([a >> 8, a & 255], [c >> 8, c & 255]);
          }
        }
        for (var j = 0; j < 4; j++) medias[j] = suma[j] / N;
        plot.view(-0.7, 3.7, 0, 16);
        plot.render();
        out.set('Promedio sobre ' + N + ' bloques al azar con un bit cambiado: ' + medias.map(function (m, i) { return (i + 1) + ' ronda' + (i ? 's' : '') + ': <strong>' + U.fmt(m, 1) + '</strong>'; }).join(' · ') + ' de 16 bits.');
      }
      W.buttons(host, [{ t: 'Volver a medir', cls: 'btn--main', on: mide }]);
      mide();
    }
  });

  p.comprueba('Un cifrado por bloques de 64 bits cambia, de media, 12 bits de salida cuando se cambia uno de entrada. ¿Qué indica?', [
    { t: 'Difusión insuficiente: faltan rondas. Debería rondar los 32', ok: true, por: 'La avalancha completa pone cada bit de salida a cambiar con probabilidad 1/2: 32 de 64. Con 12, hay bits de salida que dependen de pocos bits de entrada, y eso se explota.' },
    { t: 'Que es muy seguro, porque cambia poco', ok: false, por: 'Al revés: que cambie poco significa que el cifrado conserva la estructura del mensaje. La seguridad está en que cambie la mitad, y al azar.' },
    { t: 'Nada: la avalancha solo importa en las funciones hash', ok: false, por: 'Importa en los dos casos, y por el mismo motivo: sin avalancha, la salida delata a la entrada.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Por qué hacen falta rondas');

  p.text('Con una ronda, el cifrado es una S-box y una permutación, y Eva escribe la tabla. Con dos, ' +
    'todavía puede aproximar la S-box por una ecuación lineal que acierta, digamos, el 75 % de las ' +
    'veces, y esa aproximación se propaga. Pero al encadenar rondas las aproximaciones se ' +
    '<strong>multiplican</strong>: si cada una acierta con probabilidad $1/2 + \\varepsilon$, las $r$ ' +
    'juntas dan un sesgo del orden de $\\varepsilon^r$, que se hunde exponencialmente. Es la idea ' +
    'del criptoanálisis lineal y del diferencial, y también la razón de que AES tenga diez rondas y ' +
    'no dos: se calculó cuántas hacían falta para que ninguna aproximación sobreviviera, y se ' +
    'añadieron unas cuantas de margen.');

  p.ejemplo({
    title: 'Una ronda a mano, con 8 bits',
    enunciado: 'Un bloque de 8 bits, 1011 0010, con clave de ronda 0110 1100. Aplicar XOR con la clave, la S-box de la tabla a cada grupo de 4 bits, y después la permutación que cruza los bits: el bit $i$ va a la posición $2(i \\bmod 4) + \\lfloor i/4 \\rfloor$ (numerando de 0 a 7 desde la izquierda).',
    pasos: [
      { t: '<strong>La clave.</strong> $1011\\,0010 \\oplus 0110\\,1100 = 1101\\,1110$.', antes: 'XOR bit a bit. ¿Qué sale?' },
      { t: '<strong>Las S-boxes.</strong> $1101 = $ D $\\to$ 9 $= 1001$. $1110 = $ E $\\to$ 0 $= 0000$. Queda $1001\\,0000$.', antes: 'Busca D y E en la tabla de la S-box.' },
      { t: '<strong>La permutación.</strong> Bits en posiciones 0 a 7: $1, 0, 0, 1, 0, 0, 0, 0$. El bit 0 va a la posición 0; el bit 3 va a $2\\cdot 3 + 0 = 6$. Los demás son ceros. Resultado: $1000\\,0010$.', antes: 'Los dos unos están en las posiciones 0 y 3. ¿A dónde va cada uno?' },
      { t: '<strong>Lo que se ve.</strong> El uno de la posición 3, que salió de la primera S-box, ha ido a parar a la segunda mitad: en la ronda siguiente entrará en la otra S-box. Eso es la difusión: lo que la S-box cambia se reparte por todo el bloque.' }
    ],
    cierre: 'Tres operaciones simples. La fuerza no está en ninguna de ellas, sino en repetirlas hasta que la avalancha sea completa.'
  });

  p.util('Un cifrado por bloques es la pieza con la que se construye casi todo lo demás: con él se ' +
    'cifran discos duros enteros, se protege cada paquete de una conexión segura, se fabrican ' +
    'generadores de números aleatorios y funciones hash. AES, el que verás en dos temas, está ' +
    'incorporado como instrucción en los procesadores desde 2010, y por eso cifrar un disco entero ' +
    'no se nota al usar el ordenador. Y el criptoanálisis lineal y diferencial, nacidos para atacar ' +
    'estas redes, son hoy la prueba que todo cifrado nuevo tiene que superar antes de publicarse.');

  p.hist('Claude Shannon definió confusión y difusión en su artículo de 1949. Horst Feistel diseñó en ' +
    'IBM, hacia 1971, el primer cifrado por bloques moderno, Lucifer, del que salió DES en 1977. Eli ' +
    'Biham y Adi Shamir publicaron el criptoanálisis diferencial en 1990, y se supo entonces que el ' +
    'equipo de IBM y la NSA lo conocían desde los setenta y habían diseñado las S-boxes de DES para ' +
    'resistirlo, en secreto. Mitsuru Matsui publicó el lineal en 1993. Con esas dos herramientas se ' +
    'evaluaron los candidatos a AES en 1998, y el ganador, Rijndael, se diseñó demostrando que ' +
    'ninguna de las dos técnicas llegaba más allá de cuatro rondas.');

  p.note('Queda una pregunta práctica: cómo se consigue que una función sea invertible cuando está ' +
    'hecha de trozos que no lo son. La respuesta es una estructura con nombre, la ' +
    '<strong>red de Feistel</strong>, que parte el bloque en dos mitades y las cruza de forma que ' +
    'descifrar es hacer lo mismo al revés <em>usando la misma función</em>, sea o no invertible. Está ' +
    'en [[cr-feistel|redes de Feistel y DES]], y es el truco que sostuvo el cifrado estándar durante ' +
    'veinticinco años.', null, 'Cómo se hace invertible');

  p.trampas([
    { e: 'Usar una S-box con fórmula', por: 'Si $S(x) = ax + b$, la ronda entera es lineal y todo el cifrado es un Hill grande: se rompe con texto conocido. La S-box tiene que ser una tabla sin ecuación.' },
    { e: 'Ahorrar rondas', por: 'Con dos rondas, una aproximación lineal de la S-box acierta lo bastante como para recuperar la clave. Las rondas se cuentan con el criptoanálisis en la mano, y se añade margen.' },
    { e: 'Permutar en la última ronda', por: 'Una permutación al final es pública y no mezcla nada más: Eva la deshace gratis. Por eso la última ronda solo lleva S-box y clave.' },
    { e: 'Confundir un bloque cifrado con un mensaje cifrado', por: 'El cifrado por bloques transforma 16 bytes. Cómo se encadenan los bloques de un mensaje largo es otro problema, y equivocarse ahí deja el mensaje a la vista.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var HEX = '0123456789ABCDEF';

  p.exercise({
    title: 'Pasar por la S-box',
    level: 'basico',
    gen: function (r) { var x = r.int(0, 15); return { x: x, y: CR.spn.S[x] }; },
    ask: function (d) { return 'Con la S-box del tema, ¿en qué se convierte el grupo de bits $' + CR.bits(d.x, 4) + '$ (el ' + HEX.charAt(d.x) + ' en hexadecimal)? Escribe los 4 bits.'; },
    fields: [{ name: 'y', label: 'salida', w: 'tiny' }],
    sol: function (d) { return { y: CR.bits(d.y, 4) }; },
    check: function (v, d) { var t = String(v.raw.y || '').replace(/[^01]/g, ''); if (t.length !== 4) return { ok: false, msg: 'Son 4 bits.' }; if (t === CR.bits(d.y, 4)) return { ok: true }; if (t === CR.bits(CR.spn.SI[d.x], 4)) return { ok: false, msg: 'Has buscado ' + HEX.charAt(d.x) + ' en la fila de salida: eso es la S-box inversa. La entrada se busca en la fila de arriba.' }; return { ok: false, msg: 'No coincide. Busca la columna ' + HEX.charAt(d.x) + ' en la tabla y pasa la letra a 4 bits.' }; },
    hint: function (d) { return '$' + CR.bits(d.x, 4) + '$ es el ' + d.x + ', columna ' + HEX.charAt(d.x) + ' de la tabla.'; },
    steps: function (d) { return ['Columna ' + HEX.charAt(d.x) + ': sale ' + HEX.charAt(d.y) + ' = ' + d.y + '.', 'En bits: <strong>' + CR.bits(d.y, 4) + '</strong>.']; },
    answer: function (d) { return CR.bits(d.y, 4); }
  });

  p.exercise({
    title: 'A dónde va cada bit',
    level: 'basico',
    gen: function (r) { var i = r.int(0, 15); return { i: i, j: 4 * (i % 4) + Math.floor(i / 4) }; },
    ask: function (d) { return 'La permutación de la red de 16 bits manda el bit $i$ a la posición $4(i \\bmod 4) + \\lfloor i/4 \\rfloor$. ¿A qué posición va el bit ' + d.i + '?'; },
    fields: [{ name: 'j', label: 'posición', w: 'tiny' }],
    sol: function (d) { return { j: d.j }; },
    hint: function (d) { return '$' + d.i + ' \\bmod 4 = ' + (d.i % 4) + '$ y $\\lfloor ' + d.i + '/4 \\rfloor = ' + Math.floor(d.i / 4) + '$.'; },
    steps: function (d) { return ['$4\\cdot ' + (d.i % 4) + ' + ' + Math.floor(d.i / 4) + ' = ' + d.j + '$.', 'Es transponer una rejilla de $4\\times 4$: el bit de la fila ' + Math.floor(d.i / 4) + ' y columna ' + (d.i % 4) + ' pasa a la fila ' + (d.i % 4) + ' y columna ' + Math.floor(d.i / 4) + '. Así cada S-box reparte sus 4 bits entre las cuatro cajas de la ronda siguiente.']; },
    answer: function (d) { return String(d.j); }
  });

  p.exercise({
    title: 'Una ronda de 8 bits',
    level: 'medio',
    gen: function (r) {
      var b = r.int(0, 255), k = r.int(0, 255), x = b ^ k, s = (CR.spn.S[x >> 4] << 4) | CR.spn.S[x & 15], perm = 0;
      for (var i = 0; i < 8; i++) if (s & (1 << (7 - i))) perm |= 1 << (7 - (2 * (i % 4) + Math.floor(i / 4)));
      return { b: b, k: k, x: x, s: s, perm: perm };
    },
    ask: function (d) { return 'Bloque $' + CR.bits(d.b, 8) + '$ y clave de ronda $' + CR.bits(d.k, 8) + '$. Aplica XOR con la clave y después la S-box del tema a cada grupo de 4 bits. ¿Qué 8 bits salen (antes de la permutación)?'; },
    fields: [{ name: 's', label: 'salida', w: 'wide' }],
    sol: function (d) { return { s: CR.bits(d.s, 8) }; },
    check: function (v, d) { var t = String(v.raw.s || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; if (t === CR.bits(d.s, 8)) return { ok: true }; if (t === CR.bits(d.x, 8)) return { ok: false, msg: 'Eso es solo el XOR con la clave: falta pasar cada mitad por la S-box.' }; if (t === CR.bits((CR.spn.S[d.b >> 4] << 4) | CR.spn.S[d.b & 15], 8)) return { ok: false, msg: 'Has aplicado la S-box sin hacer antes el XOR con la clave.' }; return { ok: false, msg: 'No coincide. XOR primero, y luego cada grupo de 4 bits por la tabla.' }; },
    hint: function (d) { return ['XOR: $' + CR.bits(d.x, 8) + '$.', 'Primer grupo: ' + HEX.charAt(d.x >> 4) + ' → ' + HEX.charAt(CR.spn.S[d.x >> 4]) + '. Segundo: ' + HEX.charAt(d.x & 15) + ' → ' + HEX.charAt(CR.spn.S[d.x & 15]) + '.']; },
    steps: function (d) { return ['$' + CR.bits(d.b, 8) + ' \\oplus ' + CR.bits(d.k, 8) + ' = ' + CR.bits(d.x, 8) + '$.', 'S-box: ' + HEX.charAt(d.x >> 4) + ' → ' + HEX.charAt(CR.spn.S[d.x >> 4]) + ' y ' + HEX.charAt(d.x & 15) + ' → ' + HEX.charAt(CR.spn.S[d.x & 15]) + '.', 'Salida: <strong>' + CR.bits(d.s, 8) + '</strong>. La permutación la dejaría en $' + CR.bits(d.perm, 8) + '$.']; },
    answer: function (d) { return CR.bits(d.s, 8); }
  });

  p.exercise({
    title: 'La avalancha esperada',
    level: 'medio',
    gen: function (r) { var n = r.pick([16, 32, 64, 128, 256]), obs = r.pick([0.1, 0.2, 0.3, 0.5, 0.5, 0.5]); return { n: n, esp: n / 2, obs: Math.round(n * obs), bien: obs === 0.5 }; },
    ask: function (d) { return 'Un cifrado tiene bloques de ' + d.n + ' bits. ¿Cuántos bits de salida deberían cambiar, de media, al cambiar un bit de entrada si la avalancha es completa? En una prueba cambian ' + d.obs + ' de media: ¿es aceptable?'; },
    fields: [{ name: 'e', label: 'esperados', w: 'tiny' }, { name: 'q', label: 'aceptable', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { e: d.esp, q: d.bien ? 'si' : 'no' }; },
    hint: function () { return 'Cada bit de salida cambia con probabilidad 1/2: la mitad del bloque.'; },
    steps: function (d) { return ['$' + d.n + ' / 2 = ' + d.esp + '$ bits.', d.bien ? 'Los ' + d.obs + ' observados coinciden: la avalancha es completa.' : 'Solo ' + d.obs + ': muy por debajo. Hay bits de salida que dependen de pocos de entrada. Faltan rondas o la permutación no reparte bien.']; },
    answer: function (d) { return d.esp + ', ' + (d.bien ? 'sí' : 'no'); }
  });

  p.exercise({
    title: 'Diferencias a través de la S-box',
    level: 'avanzado',
    gen: function (r) { var x = r.int(0, 15), delta = r.int(1, 15); var y = CR.spn.S[x], y2 = CR.spn.S[x ^ delta]; return { x: x, delta: delta, x2: x ^ delta, y: y, y2: y2, dy: y ^ y2 }; },
    ask: function (d) { return 'El criptoanálisis diferencial sigue <em>diferencias</em>: dos entradas que difieren en $\\Delta = ' + CR.bits(d.delta, 4) + '$. Con la S-box del tema, calcula $S(' + CR.bits(d.x, 4) + ')$, $S(' + CR.bits(d.x, 4) + ' \\oplus \\Delta)$ y la diferencia de salida $S(x) \\oplus S(x \\oplus \\Delta)$, en 4 bits.'; },
    fields: [{ name: 'y', label: 'S(x)', w: 'tiny' }, { name: 'y2', label: 'S(x ⊕ Δ)', w: 'tiny' }, { name: 'dy', label: 'diferencia', w: 'tiny' }],
    sol: function (d) { return { y: CR.bits(d.y, 4), y2: CR.bits(d.y2, 4), dy: CR.bits(d.dy, 4) }; },
    check: function (v, d) {
      function lee(s) { return String(s || '').replace(/[^01]/g, ''); }
      var a = lee(v.raw.y) === CR.bits(d.y, 4), b = lee(v.raw.y2) === CR.bits(d.y2, 4), c = lee(v.raw.dy) === CR.bits(d.dy, 4);
      if (a && b && c) return { ok: true };
      if (a && b && lee(v.raw.dy) === CR.bits(d.delta, 4)) return { ok: false, msg: 'La diferencia de salida no es la de entrada: la S-box la cambia, y en eso se apoya el ataque. Haz el XOR de las dos salidas.', fields: { y: true, y2: true, dy: false } };
      return { ok: false, msg: 'Revisa: $x \\oplus \\Delta = ' + CR.bits(d.x2, 4) + '$, y cada uno pasa por la tabla.', fields: { y: a, y2: b, dy: c } };
    },
    hint: function (d) { return ['$x \\oplus \\Delta = ' + CR.bits(d.x2, 4) + '$.', 'Busca las dos entradas en la tabla y haz el XOR de las salidas.']; },
    steps: function (d) { return ['$S(' + HEX.charAt(d.x) + ') = ' + HEX.charAt(d.y) + ' = ' + CR.bits(d.y, 4) + '$.', '$x \\oplus \\Delta = ' + HEX.charAt(d.x2) + '$, y $S(' + HEX.charAt(d.x2) + ') = ' + HEX.charAt(d.y2) + ' = ' + CR.bits(d.y2, 4) + '$.', 'Diferencia de salida: $' + CR.bits(d.dy, 4) + '$.', 'Si para un $\\Delta$ dado cierta diferencia de salida apareciera muy a menudo, esa regularidad atravesaría las rondas y delataría bits de la clave. Una buena S-box reparte las diferencias de salida lo más uniformemente posible.']; },
    answer: function (d) { return CR.bits(d.y, 4) + ', ' + CR.bits(d.y2, 4) + ', ' + CR.bits(d.dy, 4); }
  });

  p.keys([
    'Un cifrado por bloques es una permutación de los $2^n$ bloques elegida por la clave, calculada con una receta corta.',
    '<strong>Confusión</strong> (S-boxes no lineales) y <strong>difusión</strong> (permutaciones y mezclas), a pequeña escala y en muchas rondas: la red de sustitución y permutación.',
    'Efecto avalancha: un bit cambiado en la entrada cambia la mitad de los bits de salida, al azar. Menos es una grieta.',
    'Las rondas se cuentan con el criptoanálisis lineal y diferencial: las aproximaciones se multiplican y se hunden con cada ronda.',
    'Una S-box con fórmula, pocas rondas o una permutación al final son los errores clásicos.'
  ]);
});
