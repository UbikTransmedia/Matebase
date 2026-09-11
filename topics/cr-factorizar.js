/* Tema: Romper RSA: factorizar */
Course.topic('cr-factorizar', function (p) {

  p.puente('Toda la seguridad de [[cr-rsa|RSA]] está en que nadie sabe factorizar deprisa. Este tema mira ' +
    'de cerca qué significa «deprisa»: los métodos que se conocen, cuánto cuestan y por qué las ' +
    'claves miden 2048 bits y no 512. Reaparecen la [[cr-hash|paradoja del cumpleaños]] y la ' +
    'idea de [[av-complejidad|complejidad]] de un algoritmo.');

  p.text('Factorizar un número de 617 cifras no es imposible en principio: se puede ir probando ' +
    'divisores, y en algún momento se acaba. El problema es el tiempo. Lo que separa un sistema ' +
    'seguro de uno roto es la <strong>curva de coste</strong>: cómo crece el tiempo de factorizar con ' +
    'el tamaño del número. Los métodos ingeniosos mueven esa curva, y cada vez que la han movido, las ' +
    'claves han tenido que crecer.');

  /* ---------------------------------------------------------------- */
  p.section('Dividir hasta la raíz');

  p.text('El método de la escuela: probar divisores del 2 en adelante. Basta llegar hasta $\\sqrt{n}$, ' +
    'porque un compuesto tiene siempre un factor por debajo. Para $n$ de $b$ bits eso son $2^{b/2}$ ' +
    'divisiones: con 2048 bits, $2^{1024}$, un número de 309 cifras de divisiones. La edad del ' +
    'universo en nanosegundos tiene 27. La división sirve para una cosa: quitar de en medio los ' +
    'factores pequeños, que es lo primero que hace cualquier programa.');

  /* ---------------------------------------------------------------- */
  p.section('El método de Fermat: primos demasiado cercanos');

  p.text('Si $n = pq$ con $p$ y $q$ impares, entonces $n$ es una diferencia de cuadrados: ' +
    '$n = a^2 - b^2$ con $a = (p + q)/2$ y $b = (q - p)/2$. Fermat propuso buscar ese $a$: empezar en ' +
    '$\\lceil\\sqrt{n}\\rceil$ y subir de uno en uno hasta que $a^2 - n$ sea un cuadrado perfecto. ' +
    'Entonces $p = a - b$ y $q = a + b$.');

  p.formula('n = a^2 - b^2 = (a - b)(a + b), \\qquad \\text{pasos} \\approx \\frac{(\\sqrt{q} - \\sqrt{p})^2}{2}',
    'el método de Fermat',
    'Se lee: <em>«ene es a al cuadrado menos b al cuadrado, que es a menos b por a más b»</em>.<br><br>' +
    'El número de pasos depende de lo <strong>cerca</strong> que estén los primos: si $q - p$ es ' +
    'pequeño, $a$ está pegado a $\\sqrt n$ y se encuentra en un instante, aunque $n$ tenga 600 ' +
    'cifras. Si están lejos, el método es peor que dividir. Por eso los primos de RSA se eligen al ' +
    'azar e independientes: la probabilidad de que caigan cerca es nula.');

  p.demo({
    title: 'Fermat contra dos primos',
    intro: 'Elige dos primos y mira cuántos pasos tarda el método en encontrarlos. Con primos cercanos, dos o tres. Con primos lejanos, tantos que la demo se rinde.',
    predice: 'Con $p = 1\\,000\\,003$ y $q = 1\\,000\\,033$, ¿cuántos pasos harán falta: 1, 30 o unos 15 000?',
    build: function (host) {
      var pp = 1000003, q = 1000033;
      var out = W.mono(host, '');
      function pinta() {
        var n = pp * q, a = Math.ceil(Math.sqrt(n)), h = '<b>n = ' + U.miles(pp) + ' · ' + U.miles(q) + ' = ' + U.miles(n) + '</b>\n√n ≈ ' + U.fmt(Math.sqrt(n), 1) + ', se empieza en a = ' + U.miles(a) + '\n\n', pasos = 0, hallado = null;
        while (pasos < 20000) {
          var r = a * a - n, b = Math.round(Math.sqrt(r));
          pasos++;
          if (pasos <= 6) h += 'a = ' + U.miles(a) + ':  a² − n = ' + U.miles(r) + (b * b === r ? ' = ' + U.miles(b) + '²  <span class="cr-ok">cuadrado</span>' : '  <span class="cr-tenue">no es cuadrado</span>') + '\n';
          if (b * b === r) { hallado = { a: a, b: b }; break; }
          a++;
        }
        if (hallado) h += (pasos > 6 ? '…\n' : '') + '\n<b>' + pasos + ' pasos:</b> p = a − b = ' + U.miles(hallado.a - hallado.b) + ', q = a + b = ' + U.miles(hallado.a + hallado.b);
        else h += '…\n\n<span class="cr-dif">20 000 pasos y nada:</span> los primos están lejos y el método no sirve. Dividir hasta √n costaría ' + U.miles(Math.round(Math.sqrt(n))) + ' pasos, que tampoco.';
        out.set(h);
      }
      W.chips(host, [{ label: '1 000 003 y 1 000 033 (cercanos)', value: 'c' }, { label: '1 000 003 y 1 002 187', value: 'm' }, { label: '1 000 003 y 9 999 991 (lejanos)', value: 'l' }, { label: '10 007 y 9 999 991', value: 'll' }], { value: 'c', on: function (v) { if (v === 'c') { pp = 1000003; q = 1000033; } else if (v === 'm') { pp = 1000003; q = 1002187; } else if (v === 'l') { pp = 1000003; q = 9999991; } else { pp = 10007; q = 9999991; } pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Fermat con 5959',
    enunciado: 'Factorizar $n = 5959$ por el método de Fermat.',
    pasos: [
      { t: '<strong>Empezar.</strong> $\\sqrt{5959} \\approx 77{,}2$, así que $a = 78$. $78^2 - 5959 = 6084 - 5959 = 125$, que no es un cuadrado.', antes: '¿Cuál es el primer entero por encima de $\\sqrt{5959}$?' },
      { t: '<strong>Segundo paso.</strong> $a = 79$: $6241 - 5959 = 282$. Tampoco.' },
      { t: '<strong>Tercer paso.</strong> $a = 80$: $6400 - 5959 = 441 = 21^2$. Cuadrado: $b = 21$.', antes: '¿Es 441 un cuadrado?' },
      { t: '<strong>Los factores.</strong> $p = 80 - 21 = 59$, $q = 80 + 21 = 101$. Comprobación: $59\\cdot 101 = 5959$ ✓. Tres pasos; dividiendo habría hecho falta probar hasta 59.' }
    ],
    cierre: 'Con primos a distancia 42 de un número de cuatro cifras, tres pasos. Con primos de 300 cifras a distancia $10^{50}$, el método tarda más que el universo: la cercanía se mide en relación a $\\sqrt n$.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Pollard rho: cumpleaños entre los restos');

  p.text('En 1975 John Pollard tuvo una idea que parece no tener nada que ver: iterar una función al ' +
    'azar módulo $n$, por ejemplo $x \\mapsto x^2 + 1$, y esperar a que dos valores coincidan ' +
    '<em>módulo $p$</em>, el factor desconocido. No hace falta conocer $p$ para detectarlo: si ' +
    '$x_i \\equiv x_j \\pmod p$, entonces $p$ divide a $x_i - x_j$, y $\\operatorname{mcd}(x_i - x_j, n)$ ' +
    'lo entrega. Por la paradoja del cumpleaños, la coincidencia módulo $p$ llega tras unos ' +
    '$\\sqrt{p}$ pasos, y como $p \\le \\sqrt n$, son $n^{1/4}$ pasos.');

  p.formula('x_{i+1} = x_i^2 + c \\bmod n, \\qquad d = \\operatorname{mcd}(|x_{i} - x_{2i}|,\\ n)',
    'Pollard rho con el truco de Floyd',
    'Se lee: <em>«cada equis es el cuadrado de la anterior más ce, módulo ene; y de es el máximo ' +
    'común divisor de la diferencia entre la equis i y la equis dos i, con ene»</em>.<br><br>Comparar ' +
    '$x_i$ con $x_{2i}$, una tortuga y una liebre, detecta el ciclo sin guardar todos los valores. ' +
    'Cuando $d$ no es 1 ni $n$, es un factor. Con $n = pq$ y $p \\approx 2^{20}$, unos mil pasos.');

  p.demo({
    title: 'La tortuga y la liebre',
    intro: 'Un $n$ producto de dos primos. Cada fila avanza la tortuga un paso y la liebre dos, y calcula el mcd de su diferencia con $n$. En cuanto sale un factor, se para. Compara los pasos con $\\sqrt{p}$.',
    predice: 'Para $n = 1\\,000\\,003 \\cdot 9\\,999\\,991$, con $p \\approx 10^6$, ¿cuántos pasos habrá que dar: unos 1000, unos 10 000 o unos $10^6$?',
    build: function (host) {
      var pp = 1000003, q = 9999991, c = 1;
      var out = W.mono(host, '');
      function pinta() {
        var n = pp * q, x = 2, y = 2, d = 1, pasos = 0, h = '<b>n = ' + U.miles(n) + '</b>, x₀ = 2, f(x) = x² + ' + c + '\n\n';
        while (d === 1 && pasos < 200000) {
          x = CR.mod(CR.mulMod(x, x, n) + c, n);
          y = CR.mod(CR.mulMod(y, y, n) + c, n); y = CR.mod(CR.mulMod(y, y, n) + c, n);
          d = ML.gcd(Math.abs(x - y), n);
          pasos++;
          if (pasos <= 5) h += 'paso ' + pasos + ': tortuga ' + U.miles(x) + ', liebre ' + U.miles(y) + ', mcd = ' + d + '\n';
        }
        if (d !== 1 && d !== n) h += (pasos > 5 ? '…\n' : '') + '\n<b>paso ' + U.miles(pasos) + ':</b> mcd = ' + U.miles(d) + '  <span class="cr-ok">factor</span>. El otro: ' + U.miles(n / d) + '\n<span class="cr-tenue">√p ≈ ' + U.miles(Math.round(Math.sqrt(Math.min(pp, q)))) + '; dividir hasta p costaría ' + U.miles(Math.min(pp, q)) + ' pasos</span>';
        else h += '\nSin suerte con c = ' + c + ': se cambia la constante y se repite.';
        out.set(h);
      }
      W.chips(host, [{ label: '10 007 · 9 999 991', value: 'a' }, { label: '1 000 003 · 9 999 991', value: 'b' }, { label: '104 729 · 1 299 709', value: 'c' }], { value: 'b', on: function (v) { if (v === 'a') { pp = 10007; q = 9999991; } else if (v === 'b') { pp = 1000003; q = 9999991; } else { pp = 104729; q = 1299709; } pinta(); } });
      W.slider(W.row(host), { label: 'constante c', min: 1, max: 9, step: 1, value: c, on: function (v) { c = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Pollard rho encuentra un factor $p$ en unos $\\sqrt{p}$ pasos. Contra un RSA con $p$ de 1024 bits, ¿cuántos pasos son?', [
    { t: 'Unos $2^{512}$: sigue siendo inalcanzable', ok: true, por: 'La raíz cuadrada de $2^{1024}$ es $2^{512}$. El método es enormemente mejor que dividir, y aun así no se acerca. Contra RSA hacen falta las cribas.' },
    { t: 'Unos 1024', ok: false, por: 'Los bits no son el número: $p$ tiene $2^{1024}$ posibles valores, y la raíz es $2^{512}$.' },
    { t: 'Unos $2^{32}$, como el cumpleaños con hashes', ok: false, por: 'El cumpleaños da la raíz del tamaño del espacio. Con hashes de 64 bits es $2^{32}$; con $p$ de 1024 bits, $2^{512}$.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Las cribas y los récords');

  p.text('Los métodos que factorizan de verdad números de RSA son otra familia: buscan muchos ' +
    'números cuyos cuadrados módulo $n$ se factoricen en primos pequeños, y los combinan con álgebra ' +
    'lineal hasta obtener $x^2 \\equiv y^2 \\pmod n$ con $x \\ne \\pm y$; entonces $\\operatorname{mcd}(x - y, n)$ ' +
    'da un factor. La criba cuadrática y la criba del cuerpo de números generalizada tienen un ' +
    'coste que crece más despacio que cualquier exponencial, pero mucho más deprisa que cualquier ' +
    'polinomio:');

  p.formula('L(n) = \\exp\\Bigl(1{,}923\\,(\\ln n)^{1/3}\\,(\\ln\\ln n)^{2/3}\\Bigr)', 'coste de la criba del cuerpo de números',
    'Se lee: <em>«ele de ene es la exponencial de una constante por la raíz cúbica del logaritmo de ' +
    'ene por el logaritmo del logaritmo elevado a dos tercios»</em>.<br><br>Para 1024 bits da unos ' +
    '$2^{87}$ operaciones; para 2048, unos $2^{117}$; para 3072, unos $2^{139}$. De ahí las ' +
    'equivalencias: 2048 bits de RSA valen por unos 112 de clave simétrica, y 3072 por 128.');

  p.table(['Año', 'Número', 'Bits', 'Cómo'], [
    ['1994', 'RSA-129', '426', 'criba cuadrática, 600 voluntarios, 8 meses'],
    ['1999', 'RSA-155', '512', 'criba del cuerpo de números, 3 meses'],
    ['2009', 'RSA-768', '768', 'dos años, unos 2000 años de procesador'],
    ['2020', 'RSA-250', '829', 'unos 2700 años de procesador'],
    ['?', 'RSA-1024', '1024', 'unas mil veces más que RSA-250: al alcance de un estado']
  ]);

  p.util('Estos algoritmos son los que fijan el tamaño de las claves de todo el mundo: cuando en 2009 ' +
    'cayó RSA-768, las claves de 1024 bits pasaron a considerarse insuficientes, y los navegadores ' +
    'dejaron de aceptarlas. Pollard rho tiene además vida propia fuera de la factorización: la ' +
    'misma tortuga y liebre encuentra colisiones en funciones hash y logaritmos discretos en ' +
    'curvas elípticas, y es el mejor ataque conocido contra ellas. Y las cribas fueron el primer ' +
    'gran cálculo distribuido por internet, con voluntarios de todo el mundo.');

  p.hist('Fermat describió su método en una carta de 1643. John Pollard publicó rho en 1975, y en 1974 ' +
    'otro método, $p - 1$, que encuentra factores $p$ tales que $p - 1$ solo tiene factores pequeños; ' +
    'las claves RSA se generan evitándolo. Carl Pomerance inventó la criba cuadrática en 1981, y ' +
    'Pollard propuso en 1988 la criba del cuerpo de números, que Arjen Lenstra, Hendrik Lenstra y ' +
    'otros desarrollaron. El desafío RSA-129 de Martin Gardner de 1977, que sus autores estimaron ' +
    'seguro durante cuarenta billones de años, se resolvió en diecisiete.');

  p.trampas([
    { e: 'Elegir $q$ como «el siguiente primo después de $p$»', por: 'Fermat lo factoriza en un paso, con 2048 bits o con 20. Los primos se generan al azar e independientes.' },
    { e: 'Creer que factorizar es exponencial «sin más»', por: 'Dividir sí lo es; las cribas crecen como $L(n)$, entre polinomio y exponencial. Por eso las claves tienen que ser mucho más largas que las simétricas.' },
    { e: 'Comparar bits de RSA con bits de AES', por: '2048 bits de RSA equivalen a 112 simétricos, no a 2048. El ataque no es la fuerza bruta.' },
    { e: 'Dar una clave por segura para siempre', por: 'RSA-129 iba a durar $10^{13}$ años y duró 17. Las claves se dimensionan para la vida útil del dato, con margen.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var PRIMOS = ML.primesUpTo(400).filter(function (x) { return x > 50; });

  p.exercise({
    title: 'Cuántas divisiones',
    level: 'basico',
    gen: function (r) { var b = r.pick([32, 64, 128, 256, 512, 1024, 2048]); return { b: b, e: b / 2 }; },
    ask: function (d) { return 'Para factorizar un $n$ de ' + d.b + ' bits dividiendo hasta $\\sqrt n$, ¿del orden de cuántas divisiones hacen falta? Da el exponente: $2^{\\,?}$.'; },
    fields: [{ name: 'e', label: '2^', w: 'tiny' }],
    sol: function (d) { return { e: d.e }; },
    errores: [{ si: function (v, d) { return v.e === d.b; }, msg: 'Basta llegar a la raíz cuadrada: la mitad de los bits.' }],
    hint: function () { return '$\\sqrt{2^b} = 2^{b/2}$.'; },
    steps: function (d) { return ['$n \\approx 2^{' + d.b + '}$, $\\sqrt n \\approx 2^{' + d.e + '}$.', d.e <= 40 ? 'Con $2^{' + d.e + '}$ divisiones, un ordenador lo hace en un momento.' : '$2^{' + d.e + '}$ divisiones no se hacen ni con todos los ordenadores del planeta durante la edad del universo.']; },
    answer: function (d) { return '2^' + d.e; }
  });

  p.exercise({
    title: 'El primer paso de Fermat',
    level: 'basico',
    gen: function (r) { var pp = r.pick(PRIMOS), q = r.pick(PRIMOS); if (pp === q) return null; var n = pp * q, a = Math.ceil(Math.sqrt(n)); return { n: n, a: a, r: a * a - n, cuad: Number.isInteger(Math.sqrt(a * a - n)) }; },
    ask: function (d) { return 'Método de Fermat para $n = ' + d.n + '$: ¿en qué $a$ se empieza (el primer entero mayor o igual que $\\sqrt n$) y cuánto vale $a^2 - n$? ¿Es un cuadrado perfecto?'; },
    fields: [{ name: 'a', label: 'a', w: 'tiny' }, { name: 'r', label: 'a² − n', w: 'tiny' }, { name: 'q', label: 'cuadrado', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { a: d.a, r: d.r, q: d.cuad ? 'si' : 'no' }; },
    hint: function (d) { return '$\\sqrt{' + d.n + '} \\approx ' + U.fmt(Math.sqrt(d.n), 2) + '$.'; },
    steps: function (d) { return ['$a = \\lceil\\sqrt{' + d.n + '}\\rceil = ' + d.a + '$.', '$' + d.a + '^2 - ' + d.n + ' = ' + d.r + '$' + (d.cuad ? ' = ' + Math.sqrt(d.r) + '^2$: cuadrado. Los factores son $' + (d.a - Math.sqrt(d.r)) + '$ y $' + (d.a + Math.sqrt(d.r)) + '$.' : '$, que no es un cuadrado: se sigue con $a = ' + (d.a + 1) + '$.')]; },
    answer: function (d) { return 'a = ' + d.a + ', ' + d.r + (d.cuad ? ', sí' : ', no'); }
  });

  p.exercise({
    title: 'Fermat hasta el final',
    level: 'medio',
    gen: function (r) {
      var pp = r.pick(PRIMOS), q = pp;
      var cand = PRIMOS.filter(function (x) { return x > pp && x - pp <= 30; });
      if (!cand.length) return null;
      q = r.pick(cand);
      var n = pp * q, a = Math.ceil(Math.sqrt(n)), pasos = 0;
      while (!Number.isInteger(Math.sqrt(a * a - n))) { a++; pasos++; }
      if (pasos > 4) return null;
      return { n: n, p: pp, q: q, a: a, b: Math.sqrt(a * a - n), pasos: pasos + 1 };
    },
    ask: function (d) { return 'Factoriza $n = ' + d.n + '$ por el método de Fermat. Da los dos primos, el menor primero.'; },
    fields: [{ name: 'p', label: 'p', w: 'tiny' }, { name: 'q', label: 'q', w: 'tiny' }],
    sol: function (d) { return { p: d.p, q: d.q }; },
    check: function (v, d) { if ((v.p === d.p && v.q === d.q) || (v.p === d.q && v.q === d.p)) return { ok: true }; if (Number.isInteger(v.p) && Number.isInteger(v.q) && v.p * v.q === d.n) return { ok: true }; return { ok: false, msg: 'El producto tiene que dar ' + d.n + '. Empieza en $\\lceil\\sqrt n\\rceil$ y sube hasta que $a^2 - n$ sea un cuadrado.' }; },
    hint: function (d) { return ['$\\sqrt{' + d.n + '} \\approx ' + U.fmt(Math.sqrt(d.n), 1) + '$.', 'Hacen falta ' + d.pasos + ' ' + (d.pasos === 1 ? 'paso' : 'pasos') + '.']; },
    steps: function (d) { var l = [], a0 = Math.ceil(Math.sqrt(d.n)); for (var a = a0; a <= d.a; a++) l.push('$a = ' + a + '$: $' + (a * a - d.n) + '$' + (a === d.a ? ' $= ' + d.b + '^2$ ✓' : ', no')); return [l.join('; ') + '.', '$p = ' + d.a + ' - ' + d.b + ' = ' + d.p + '$, $q = ' + d.a + ' + ' + d.b + ' = ' + d.q + '$.', 'Los primos estaban a ' + (d.q - d.p) + ' de distancia: por eso ha bastado con ' + d.pasos + ' ' + (d.pasos === 1 ? 'paso' : 'pasos') + '.']; },
    answer: function (d) { return d.p + ' · ' + d.q; }
  });

  p.exercise({
    title: 'Tres pasos de rho',
    level: 'medio',
    gen: function (r) { var pp = r.pick(PRIMOS), q = r.pick(PRIMOS); if (pp === q) return null; var n = pp * q, c = r.int(1, 5), x = [2]; for (var i = 0; i < 3; i++) x.push(CR.mod(x[i] * x[i] + c, n)); return { n: n, c: c, x: x }; },
    ask: function (d) { return 'Pollard rho para $n = ' + d.n + '$ con $f(x) = x^2 + ' + d.c + '$ y $x_0 = 2$. Calcula $x_1$, $x_2$ y $x_3$ módulo $n$.'; },
    fields: [{ name: 'x1', label: 'x₁', w: 'tiny' }, { name: 'x2', label: 'x₂', w: 'tiny' }, { name: 'x3', label: 'x₃', w: 'tiny' }],
    sol: function (d) { return { x1: d.x[1], x2: d.x[2], x3: d.x[3] }; },
    hint: function () { return 'Cada uno es el cuadrado del anterior más la constante, reducido módulo $n$.'; },
    steps: function (d) { return ['$x_1 = 2^2 + ' + d.c + ' = ' + d.x[1] + '$.', '$x_2 = ' + d.x[1] + '^2 + ' + d.c + ' \\equiv ' + d.x[2] + '$.', '$x_3 = ' + d.x[2] + '^2 + ' + d.c + ' \\equiv ' + d.x[3] + '$.', 'La liebre iría por $x_2$, $x_4$, $x_6$; en cada paso se calcula $\\operatorname{mcd}(|x_i - x_{2i}|, n)$: ahora, $\\operatorname{mcd}(|' + d.x[1] + ' - ' + d.x[2] + '|, ' + d.n + ') = ' + ML.gcd(Math.abs(d.x[1] - d.x[2]), d.n) + '$.']; },
    answer: function (d) { return d.x.slice(1).join(', '); }
  });

  p.exercise({
    title: 'Bits de seguridad de RSA',
    level: 'avanzado',
    gen: function (r) { var b = r.pick([512, 768, 1024, 1536, 2048, 3072, 4096]); var ln = b * Math.LN2, exp = 1.923 * Math.pow(ln, 1 / 3) * Math.pow(Math.log(ln), 2 / 3); return { b: b, ln: ln, exp: exp, bits: exp / Math.LN2 }; },
    ask: function (d) { return 'Con la fórmula del coste de la criba, $L(n) = \\exp\\bigl(1{,}923\\,(\\ln n)^{1/3}(\\ln\\ln n)^{2/3}\\bigr)$, estima cuántos bits de seguridad da un RSA de ' + d.b + ' bits, es decir, $\\log_2 L(n)$ con $n = 2^{' + d.b + '}$. (sin decimales)'; },
    fields: [{ name: 'bits', label: 'bits de seguridad', w: 'tiny' }],
    sol: function (d) { return { bits: d.bits }; },
    rel: 0.03,
    hint: function (d) { return ['$\\ln n = ' + d.b + '\\ln 2 = ' + U.fmt(d.ln, 1) + '$, y $\\ln\\ln n = ' + U.fmt(Math.log(d.ln), 3) + '$.', 'Calcula el exponente y divide entre $\\ln 2$ para pasar a bits.']; },
    steps: function (d) { return ['$(\\ln n)^{1/3} = ' + U.fmt(Math.pow(d.ln, 1 / 3), 3) + '$, $(\\ln\\ln n)^{2/3} = ' + U.fmt(Math.pow(Math.log(d.ln), 2 / 3), 3) + '$.', 'Exponente: $1{,}923\\cdot ' + U.fmt(Math.pow(d.ln, 1 / 3), 3) + '\\cdot ' + U.fmt(Math.pow(Math.log(d.ln), 2 / 3), 3) + ' = ' + U.fmt(d.exp, 1) + '$.', '$\\log_2 L = ' + U.fmt(d.exp, 1) + ' / \\ln 2 \\approx ' + U.fmt(d.bits, 0) + '$ bits.', d.b <= 1024 ? 'Por debajo de los 100 bits: hoy se considera insuficiente.' : 'Del orden de los 112 a 140 bits que exigen las normas actuales.']; },
    answer: function (d) { return U.fmt(d.bits, 0) + ' bits'; }
  });

  p.keys([
    'Dividir hasta $\\sqrt n$ cuesta $2^{b/2}$: solo sirve para quitar factores pequeños.',
    'Fermat escribe $n = a^2 - b^2$ y encuentra en un instante primos demasiado cercanos: por eso se generan al azar e independientes.',
    'Pollard rho itera $x^2 + c$ y usa el cumpleaños: un factor $p$ en unos $\\sqrt p$ pasos. Contra RSA sigue siendo $2^{512}$.',
    'Las cribas cuestan $L(n) = \\exp(1{,}923\\,(\\ln n)^{1/3}(\\ln\\ln n)^{2/3})$: entre polinomio y exponencial. De ahí que 2048 bits de RSA valgan por 112 simétricos.',
    'Los récords mueven la curva y las claves crecen detrás: 768 bits en 2009, 829 en 2020, 1024 al alcance de un estado.'
  ]);
});
