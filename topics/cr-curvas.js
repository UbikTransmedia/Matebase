/* Tema: Curvas elipticas en la practica */
Course.topic('cr-curvas', function (p) {

  p.puente('En [[av-cripto-curvas|curvas elípticas]] se sumaron puntos con una recta. Aquí se hace lo ' +
    'que hace un ordenador: contar los puntos de la curva módulo $p$, multiplicar un punto por un ' +
    'número de 256 bits con la idea de los [[cr-modular|cuadrados sucesivos]], y ver por qué el ' +
    '[[cr-logdiscreto|ataque de la raíz cuadrada]] es lo único que hay, y eso lo cambia todo.');

  p.text('Una curva elíptica sobre los reales es un dibujo. Módulo un primo es una nube de puntos sin ' +
    'forma aparente, y aun así se pueden sumar con las mismas fórmulas. Ese grupo tiene una ' +
    'propiedad que no tiene el de las potencias módulo $p$: contra su logaritmo discreto no se ' +
    'conocen las cribas. Solo queda la raíz cuadrada, y eso permite claves de 256 bits donde RSA ' +
    'necesita 3072.');

  /* ---------------------------------------------------------------- */
  p.section('La curva módulo p es una nube de puntos');

  p.text('Los puntos son las parejas $(x, y)$ con $0 \\le x, y < p$ que cumplen $y^2 \\equiv x^3 + ax + b$, ' +
    'más el punto del infinito, el neutro. Para cada $x$, el lado derecho es un número; si es un ' +
    'cuadrado módulo $p$, hay dos $y$ (o uno, si es 0); si no, ninguno. Como la mitad de los ' +
    'números son cuadrados, salen unos $p$ puntos. Hasse lo precisó:');

  p.formula('|\\#E - (p + 1)| \\le 2\\sqrt{p}', 'teorema de Hasse',
    'Se lee: <em>«el número de puntos de la curva difiere de pe más uno en como mucho dos raíz de ' +
    'pe»</em>. Una curva sobre un primo de 256 bits tiene unos $2^{256}$ puntos, ni uno de más ni de ' +
    'menos que $2^{129}$.<br><br>El número exacto se calcula con el algoritmo de Schoof, y se ' +
    'busca que sea primo, o primo por un factor pequeño: así todo punto tiene orden enorme y ' +
    'Pohlig-Hellman no tiene dónde agarrarse.');

  p.demo({
    title: 'Los puntos de una curva pequeña',
    intro: 'Cada punto es una solución de $y^2 = x^3 + ax + b$ módulo $p$. La nube no tiene la forma de la curva real, pero es simétrica: si $(x, y)$ está, $(x, p - y)$ también. Abajo, el recuento y el intervalo de Hasse.',
    predice: 'Para $p = 97$, ¿cuántos puntos tendrá la curva, más o menos: unos 50, unos 100 o unos 200? ¿Y entre qué valores garantiza Hasse que estará?',
    build: function (host) {
      var pr = 97, a = 2, b = 3, puntos = [];
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -3, xmax: 100, ymin: -3, ymax: 100, height: 320, grid: false,
        aria: 'Nube de puntos con las soluciones de una curva elíptica módulo un primo, simétrica respecto de la horizontal central',
        draw: function (g) { puntos.forEach(function (P) { g.point(P[0], P[1], { color: 0, r: 2.6 }); }); g.hline(pr / 2, { color: 'axis', dash: [4, 4], w: 1 }); }
      });
      function pinta() {
        var C = CR.curva(a, b, pr); puntos = C.puntos();
        var n = puntos.length + 1, lo = pr + 1 - 2 * Math.sqrt(pr), hi = pr + 1 + 2 * Math.sqrt(pr);
        plot.view(-3, pr + 3, -3, pr + 3);
        plot.render();
        out.set('$y^2 = x^3 + ' + a + 'x + ' + b + '$ módulo $' + pr + '$: <strong>' + n + '</strong> puntos (' + puntos.length + ' más el infinito).<br>Hasse: entre $' + U.fmt(lo, 1) + '$ y $' + U.fmt(hi, 1) + '$' + (n >= lo && n <= hi ? ' ✓' : '') + '.' + (CR.esPrimo(n) ? ' <span style="color:var(--ok)">Es primo: todo punto salvo el infinito genera el grupo entero.</span>' : ' <span style="font-size:0.7812rem;color:var(--ink-faint)">' + n + ' = ' + ML.factorTex(n).replace(/\\cdot/g, '·').replace(/\^\{(\d+)\}/g, '^$1') + ': hay puntos de orden pequeño.</span>'));
      }
      W.chips(host, [{ label: 'p = 17', value: 17 }, { label: 'p = 47', value: 47 }, { label: 'p = 97', value: 97 }, { label: 'p = 193', value: 193 }], { value: pr, on: function (v) { pr = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'a', min: 0, max: 20, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'b', min: 1, max: 20, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Multiplicar un punto: doblar y sumar');

  p.text('La operación de la criptografía con curvas es $kG$: sumar el punto $G$ consigo mismo $k$ ' +
    'veces, con $k$ de 256 bits. No se hace sumando $k$ veces: se usa la misma idea que las potencias ' +
    'por cuadrados, con doblar en lugar de elevar al cuadrado y sumar en lugar de multiplicar.');

  p.formula('kG: \\quad \\text{por cada bit de } k, \\text{ de izquierda a derecha: } R \\leftarrow 2R, \\text{ y si el bit es 1, } R \\leftarrow R + G',
    'doblar y sumar',
    'Con $k$ de 256 bits son 256 doblados y, de media, 128 sumas: unas 384 operaciones con puntos, ' +
    'cada una un puñado de multiplicaciones e inversos módulo $p$. Un móvil lo hace en una fracción ' +
    'de milisegundo.<br><br>Ir al revés, de $kG$ a $k$, es el logaritmo discreto de la curva: solo ' +
    'se conocen los ataques de raíz cuadrada, bebés y gigantes o Pollard rho, que cuestan $2^{128}$.');

  p.demo({
    title: 'kG paso a paso',
    intro: 'La curva $y^2 = x^3 + 2x + 2$ módulo 17, con $G = (5, 1)$, que tiene orden 19. Cada fila es un bit de $k$: se dobla el acumulado y, si el bit es 1, se le suma $G$. Compara el número de filas con $k$.',
    predice: 'Para $k = 19$, ¿qué punto saldrá? ¿Y para $k = 20$?',
    build: function (host) {
      var k = 13, C = CR.curva(2, 2, 17), G = [5, 1];
      var out = W.readout(host, '');
      function pinta() {
        var t = C.multTraza(k, G), h = '$k = ' + k + ' = ' + t.bits + '_2$<div class="tbl-wrap"><table class="tbl"><thead><tr><th>bit</th><th>acumulado</th><th>doblado</th><th>+ G si el bit es 1</th></tr></thead><tbody>';
        t.pasos.forEach(function (ps) { h += '<tr><td>' + ps.bit + '</td><td>' + C.txt(ps.antes) + '</td><td>' + C.txt(ps.doble) + '</td><td>' + (ps.bit === '1' ? '<strong>' + C.txt(ps.despues) + '</strong>' : '—') + '</td></tr>'; });
        h += '</tbody></table></div>$' + k + 'G = ' + C.txt(t.valor) + '$: ' + t.bits.length + ' doblados y ' + (t.bits.split('1').length - 1) + ' sumas.' + (t.valor === null ? ' El infinito: $k$ es múltiplo del orden de $G$, 19.' : '');
        out.set(h);
      }
      W.slider(W.row(host), { label: 'k', min: 1, max: 60, step: 1, value: k, on: function (v) { k = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: '5G con doblar y sumar',
    enunciado: 'En $y^2 = x^3 + 2x + 2$ módulo 17 con $G = (5, 1)$, calcular $5G$ sabiendo que $2G = (6, 3)$.',
    pasos: [
      { t: '<strong>Los bits.</strong> $5 = 101_2$: doblar, doblar y sumar $G$. Es decir, $5G = 2(2G) + G = 4G + G$.', antes: 'Escribe 5 en binario. ¿Qué operaciones marca?' },
      { t: '<strong>Doblar $2G = (6, 3)$.</strong> $\\lambda = (3\\cdot 6^2 + 2)/(2\\cdot 3) = 110/6$. Módulo 17: $110 \\equiv 8$, $6^{-1} = 3$ (porque $18 \\equiv 1$), $\\lambda = 24 \\equiv 7$. $x = 49 - 12 = 37 \\equiv 3$, $y = 7(6 - 3) - 3 = 18 \\equiv 1$. $4G = (3, 1)$.', antes: 'Tangente en $(6, 3)$: $\\lambda = (3x^2 + a)/(2y)$, con el inverso modular.' },
      { t: '<strong>Sumar $G$.</strong> $(3, 1) + (5, 1)$: $\\lambda = (1 - 1)/(5 - 3) = 0$. $x = 0 - 3 - 5 = -8 \\equiv 9$, $y = 0\\cdot(3 - 9) - 1 = -1 \\equiv 16$. $5G = (9, 16)$.', antes: 'Los dos puntos tienen la misma $y$: ¿qué pendiente tiene la recta?' },
      { t: '<strong>Comprobar.</strong> $16^2 = 256 = 15\\cdot 17 + 1 \\equiv 1$, y $9^3 + 2\\cdot 9 + 2 = 749 = 44\\cdot 17 + 1 \\equiv 1$ ✓. Está en la curva.' }
    ],
    cierre: 'Tres operaciones con puntos para $k = 5$; con $k$ de 256 bits, unas 384. Y para volver de $(9, 16)$ al 5 sin saberlo, con $p$ de 256 bits, $2^{128}$ pasos.'
  });

  /* ---------------------------------------------------------------- */
  p.section('ECDH y las curvas con nombre');

  p.text('El intercambio de claves con curvas es Diffie-Hellman con la notación cambiada: Alicia elige ' +
    '$a$ y envía $aG$; Benito elige $b$ y envía $bG$; los dos calculan $abG$. Eva ve $aG$ y $bG$ y ' +
    'necesitaría $a$ o $b$. Todo lo demás es igual, incluidos el hombre en el medio y la necesidad ' +
    'de firmar.');

  p.table(['Curva', 'Bits', 'Dónde', 'Seguridad'], [
    ['P-256 (secp256r1)', '256', 'la mayoría de las conexiones seguras y certificados', '128 bits'],
    ['Curve25519', '255', 'mensajería cifrada, SSH, la mitad de las conexiones seguras', '128 bits'],
    ['secp256k1', '256', 'Bitcoin y otras criptomonedas', '128 bits'],
    ['P-384', '384', 'documentos gubernamentales, claves de larga duración', '192 bits']
  ]);

  p.table(['Seguridad', 'Clave simétrica', 'Curva elíptica', 'RSA'], [
    ['80 bits (retirado)', '80', '160', '1024'],
    ['112 bits', '112', '224', '2048'],
    ['128 bits', '128', '256', '3072'],
    ['192 bits', '192', '384', '7680'],
    ['256 bits', '256', '512', '15 360']
  ]);

  p.text('La segunda tabla es la razón de que las curvas hayan ganado. Contra el logaritmo discreto ' +
    'en una curva solo hay ataques de raíz cuadrada, así que la seguridad es la mitad de los bits ' +
    'de la clave: 256 bits dan 128. Contra RSA hay cribas, y hacen falta 3072. Una clave de curva ' +
    'es doce veces más corta que la RSA equivalente, y las operaciones, más rápidas.');

  p.demo({
    title: 'ECDH en la curva de 17',
    intro: 'Alicia y Benito eligen secretos y se envían múltiplos de $G$. Los dos llegan al mismo punto. Eva, con los dos puntos públicos, tendría que resolver el logaritmo discreto: aquí, probar 19 valores; en una curva real, $2^{128}$.',
    predice: 'Si Alicia elige $a = 3$ y Benito $b = 7$, ¿qué múltiplo de $G$ obtendrán los dos? Recuerda que $G$ tiene orden 19.',
    build: function (host) {
      var a = 3, b = 7, C = CR.curva(2, 2, 17), G = [5, 1];
      var out = W.mono(host, '');
      function pinta() {
        var A = C.mult(a, G), B = C.mult(b, G), KA = C.mult(a, B), KB = C.mult(b, A);
        out.set('<b>público:</b> curva y² = x³ + 2x + 2 mod 17, G = (5, 1) de orden 19\n\n<b>Alicia:</b> a = ' + a + ', envía aG = ' + C.txt(A) + '\n<b>Benito:</b> b = ' + b + ', envía bG = ' + C.txt(B) + '\n\n<b>Alicia</b> calcula a·(bG) = ' + C.txt(KA) + '\n<b>Benito</b> calcula b·(aG) = ' + C.txt(KB) + (C.txt(KA) === C.txt(KB) ? '  <span class="cr-ok">el mismo punto: ' + ((a * b) % 19) + 'G</span>' : '') + '\n\n<span class="cr-tenue">Eva ve ' + C.txt(A) + ' y ' + C.txt(B) + '. Para hallar a probaría los múltiplos de G hasta dar con ' + C.txt(A) + '.</span>');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'secreto de Alicia a', min: 1, max: 18, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'secreto de Benito b', min: 1, max: 18, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('¿Por qué una clave de curva elíptica de 256 bits equivale a una de RSA de 3072 y no a una de 256?', [
    { t: 'Porque contra la curva solo hay ataques de raíz cuadrada ($2^{128}$), y contra RSA hay cribas mucho mejores que la raíz cuadrada', ok: true, por: 'La seguridad se mide por el mejor ataque conocido. En la curva es $\\sqrt{\\text{orden}}$; en RSA es $L(n)$, subexponencial, y por eso $n$ tiene que ser mucho mayor.' },
    { t: 'Porque los puntos tienen dos coordenadas', ok: false, por: 'Las dos coordenadas no duplican nada: la $y$ se deduce de la $x$ salvo un signo. Lo que importa es el mejor ataque.' },
    { t: 'No equivalen: RSA de 3072 es más seguro', ok: false, por: 'Ambos cuestan unos $2^{128}$ con el mejor método conocido. Por eso las normas los consideran equivalentes.' }
  ]);

  p.util('Cuando tu navegador abre una web segura, casi siempre hace un ECDH con P-256 o Curve25519; el ' +
    'certificado de la web va firmado con RSA o con una curva. Las aplicaciones de mensajería usan ' +
    'Curve25519 para acordar claves y su hermana Ed25519 para firmar. Las criptomonedas usan ' +
    'secp256k1 para las firmas de las transacciones. Y en 2013 se supo que un generador de números ' +
    'aleatorios estandarizado, basado en una curva con constantes de origen no explicado, podía ' +
    'llevar una puerta trasera: desde entonces se exige que las constantes de una curva se ' +
    'generen de forma verificable.');

  p.hist('Helmut Hasse demostró la cota del número de puntos en 1933. Neal Koblitz y Victor Miller ' +
    'propusieron las curvas para criptografía en 1985, René Schoof dio el algoritmo para contar ' +
    'puntos en el mismo año, y durante veinte años se consideraron exóticas: las patentes y la ' +
    'falta de estándares frenaron su uso. La NSA las recomendó en 2005, Daniel Bernstein publicó ' +
    'Curve25519 ese año con todas las decisiones de diseño explicadas, y en la década de 2010 pasaron ' +
    'a ser el estándar de facto para intercambio de claves y firmas.');

  p.trampas([
    { e: 'Usar una curva cuyo número de puntos tenga factores pequeños', por: 'Pohlig-Hellman ataca el subgrupo pequeño. Se exige que el orden sea primo o casi.' },
    { e: 'No comprobar que el punto recibido está en la curva', por: 'Un punto inválido enviado por Mallory cae en otra curva con orden pequeño, y con unas cuantas consultas revela el secreto. Se comprueba siempre.' },
    { e: 'Sumar $k$ veces en vez de doblar y sumar', por: 'Con $k$ de 256 bits no acabaría nunca; doblar y sumar son unas 384 operaciones.' },
    { e: 'Comparar bits de curva con bits de RSA', por: '256 de curva son 128 de seguridad, como 3072 de RSA. Los bits de clave solo se comparan a través del mejor ataque.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var C17 = CR.curva(2, 2, 17), G17 = [5, 1];
  var MULT = []; for (var k = 1; k <= 18; k++) MULT.push(C17.mult(k, G17));

  p.exercise({
    title: '¿Está en la curva?',
    level: 'basico',
    gen: function (r) { var P = r.pick([23, 29, 31]), a = r.int(1, 5), b = r.int(1, 5), x = r.int(0, P - 1), y = r.int(0, P - 1); var izq = CR.mod(y * y, P), der = CR.mod(x * x * x + a * x + b, P); return { P: P, a: a, b: b, x: x, y: y, izq: izq, der: der, esta: izq === der }; },
    ask: function (d) { return 'Curva $y^2 = x^3 + ' + d.a + 'x + ' + d.b + '$ módulo $' + d.P + '$. Para el punto $(' + d.x + ', ' + d.y + ')$, calcula $y^2$ y $x^3 + ' + d.a + 'x + ' + d.b + '$ módulo $' + d.P + '$. ¿Está en la curva?'; },
    fields: [{ name: 'i', label: 'y²', w: 'tiny' }, { name: 'd', label: 'x³+ax+b', w: 'tiny' }, { name: 'q', label: 'está', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { i: d.izq, d: d.der, q: d.esta ? 'si' : 'no' }; },
    hint: function () { return 'Reduce los dos lados módulo $p$ y compara.'; },
    steps: function (d) { return ['$y^2 = ' + (d.y * d.y) + ' \\equiv ' + d.izq + '$.', '$x^3 + ' + d.a + 'x + ' + d.b + ' = ' + (d.x * d.x * d.x + d.a * d.x + d.b) + ' \\equiv ' + d.der + '$.', d.esta ? 'Iguales: el punto está en la curva.' : 'Distintos: no está. Un punto que no está en la curva se rechaza siempre.']; },
    answer: function (d) { return d.izq + ', ' + d.der + (d.esta ? ', sí' : ', no'); }
  });

  p.exercise({
    title: 'El intervalo de Hasse',
    level: 'basico',
    gen: function (r) { var P = r.pick([101, 211, 503, 1009, 4001, 10007, 65537]); return { P: P, lo: P + 1 - 2 * Math.sqrt(P), hi: P + 1 + 2 * Math.sqrt(P) }; },
    ask: function (d) { return 'Una curva elíptica módulo $p = ' + U.miles(d.P) + '$. Según Hasse, ¿entre qué dos valores está su número de puntos? (un decimal)'; },
    fields: [{ name: 'lo', label: 'mínimo', w: 'tiny' }, { name: 'hi', label: 'máximo', w: 'tiny' }],
    sol: function (d) { return { lo: d.lo, hi: d.hi }; },
    dec: 1, tol: 1e-3,
    hint: function () { return '$p + 1 \\pm 2\\sqrt{p}$.'; },
    steps: function (d) { return ['$2\\sqrt{' + U.miles(d.P) + '} = ' + U.fmt(2 * Math.sqrt(d.P), 1) + '$.', 'Entre $' + U.fmt(d.lo, 1) + '$ y $' + U.fmt(d.hi, 1) + '$: del orden de $p$, con un margen de $\\sqrt{p}$.']; },
    answer: function (d) { return U.fmt(d.lo, 1) + ' a ' + U.fmt(d.hi, 1); }
  });

  p.exercise({
    title: 'Cuántas operaciones cuesta kG',
    level: 'medio',
    gen: function (r) { var k = r.int(50, 5000); var bits = k.toString(2); return { k: k, bits: bits, dob: bits.length - 1, sum: bits.split('1').length - 2 }; },
    ask: function (d) { return 'Para calcular $' + d.k + 'G$ por doblar y sumar (empezando con $G$ tras el primer bit), ¿cuántos doblados y cuántas sumas hacen falta?'; },
    fields: [{ name: 'd', label: 'doblados', w: 'tiny' }, { name: 's', label: 'sumas', w: 'tiny' }],
    sol: function (d) { return { d: d.dob, s: d.sum }; },
    hint: function (d) { return '$' + d.k + ' = ' + d.bits + '_2$: un doblado por bit tras el primero, una suma por cada 1 tras el primero.'; },
    steps: function (d) { return ['$' + d.k + '$ tiene ' + d.bits.length + ' bits y ' + (d.bits.split('1').length - 1) + ' unos.', 'Doblados: ' + d.dob + '. Sumas: ' + d.sum + '. Total ' + (d.dob + d.sum) + ' en vez de ' + (d.k - 1) + ' sumas.']; },
    answer: function (d) { return d.dob + ' doblados, ' + d.sum + ' sumas'; }
  });

  p.exercise({
    title: 'Sumar múltiplos de G',
    level: 'medio',
    gen: function (r) { var i = r.int(1, 9), j = r.int(1, 9); if (i === j) return null; var P = MULT[i - 1], Q = MULT[j - 1], S = C17.suma(P, Q); return { i: i, j: j, P: P, Q: Q, S: S, k: (i + j) % 19 }; },
    ask: function (d) { return 'En la curva $y^2 = x^3 + 2x + 2$ módulo 17, $' + d.i + 'G = (' + d.P.join(', ') + ')$ y $' + d.j + 'G = (' + d.Q.join(', ') + ')$. Calcula su suma con la fórmula de la recta, y di de qué múltiplo de $G$ se trata.'; },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }, { name: 'k', label: 'múltiplo', w: 'tiny' }],
    sol: function (d) { return { x: d.S[0], y: d.S[1], k: d.k }; },
    hint: function (d) { return ['$\\lambda = (y_2 - y_1)(x_2 - x_1)^{-1} \\bmod 17$, luego $x_3 = \\lambda^2 - x_1 - x_2$, $y_3 = \\lambda(x_1 - x_3) - y_1$.', 'El múltiplo no hace falta calcularlo: $' + d.i + 'G + ' + d.j + 'G = ' + (d.i + d.j) + 'G$.']; },
    steps: function (d) { var l = C17.suma(d.P, d.Q); var num = CR.mod(d.Q[1] - d.P[1], 17), den = CR.mod(d.Q[0] - d.P[0], 17); return ['$\\lambda = ' + num + '\\cdot ' + den + '^{-1} = ' + num + '\\cdot ' + CR.inv(den, 17) + ' \\equiv ' + l[2] + '$.', '$x_3 = ' + l[2] + '^2 - ' + d.P[0] + ' - ' + d.Q[0] + ' \\equiv ' + d.S[0] + '$, $y_3 = ' + l[2] + '(' + d.P[0] + ' - ' + d.S[0] + ') - ' + d.P[1] + ' \\equiv ' + d.S[1] + '$.', 'Es $' + d.k + 'G$: sumar múltiplos es sumar los coeficientes, módulo el orden 19.']; },
    answer: function (d) { return '(' + d.S.join(', ') + ') = ' + d.k + 'G'; }
  });

  p.exercise({
    title: 'ECDH en la curva de 17',
    level: 'avanzado',
    gen: function (r) { var a = r.int(2, 18), b = r.int(2, 18); if (a === b) return null; var A = MULT[a - 1], B = MULT[b - 1], k = (a * b) % 19; if (k === 0) return null; var K = MULT[k - 1]; return { a: a, b: b, A: A, B: B, k: k, K: K }; },
    ask: function (d) { return 'ECDH en $y^2 = x^3 + 2x + 2$ módulo 17 con $G = (5, 1)$ de orden 19. Alicia tiene $a = ' + d.a + '$ y recibe de Benito $bG = (' + d.B.join(', ') + ')$. Eva, que solo ve $aG = (' + d.A.join(', ') + ')$ y $bG$, quiere el secreto: ¿cuál es el punto compartido, y qué múltiplo de $G$ es? Puedes usar la lista de múltiplos de la pista.'; },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }, { name: 'k', label: 'múltiplo', w: 'tiny' }],
    sol: function (d) { return { x: d.K[0], y: d.K[1], k: d.k }; },
    hint: function (d) { var l = []; for (var i = 1; i <= 18; i++) l.push(i + 'G = (' + MULT[i - 1].join(',') + ')'); return ['Alicia calcula $a\\cdot(bG) = ab\\,G$, y como $G$ tiene orden 19, es $(ab \\bmod 19)\\,G$.', 'Múltiplos de $G$: ' + l.join(', ') + '.']; },
    steps: function (d) { return ['$ab = ' + d.a + '\\cdot ' + d.b + ' = ' + (d.a * d.b) + ' \\equiv ' + d.k + ' \\pmod{19}$.', 'El punto compartido es $' + d.k + 'G = (' + d.K.join(', ') + ')$.', 'Eva tendría que averiguar $b$ a partir de $bG$: en esta curva, buscar en 18 múltiplos; en P-256, $2^{128}$ operaciones.']; },
    answer: function (d) { return '(' + d.K.join(', ') + ') = ' + d.k + 'G'; }
  });

  p.keys([
    'Módulo $p$, la curva es una nube de unos $p$ puntos: Hasse acota $\\#E = p + 1 \\pm 2\\sqrt{p}$, y se elige que sea primo.',
    '$kG$ se calcula doblando y sumando: unas 384 operaciones con $k$ de 256 bits. Volver de $kG$ a $k$ cuesta $2^{128}$.',
    'ECDH es Diffie-Hellman con puntos: $aG$, $bG$ y $abG$. Con el mismo hombre en el medio.',
    '256 bits de curva equivalen a 128 simétricos y a 3072 de RSA, porque contra la curva solo hay ataques de raíz cuadrada.',
    'P-256, Curve25519 y secp256k1 son las curvas de la web, la mensajería y las criptomonedas; y todo punto recibido se comprueba.'
  ]);
});
