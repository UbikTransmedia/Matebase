/* Tema: Fabricar primos de 300 cifras */
Course.topic('cr-primos', function (p) {

  p.puente('RSA necesita dos primos de 300 cifras, y hay que fabricarlos en milisegundos. Este tema ' +
    'junta el [[av-numeros|pequeño teorema de Fermat]] y la [[av-numeros|densidad de los primos]] ' +
    'con las [[cr-modular|potencias por cuadrados]] y un poco de [[pe-probabilidad|probabilidad]], y ' +
    'sale un método que se equivoca menos de una vez cada $10^{40}$.');

  p.text('Comprobar si un número de 300 cifras es primo dividiéndolo no es posible: habría que probar ' +
    'divisores hasta $10^{150}$. Y sin embargo tu móvil genera dos primos así cada vez que crea una ' +
    'clave. Lo hace con un test que no demuestra que un número sea primo, sino que lo <strong>deja ' +
    'de dudar</strong> con una probabilidad de error que se puede hacer tan pequeña como se quiera, ' +
    'y que es más pequeña que la de que el ordenador se equivoque al sumar.');

  /* ---------------------------------------------------------------- */
  p.section('Hay primos de sobra');

  p.text('Antes de comprobar nada hay que saber que buscar a ciegas funciona. El teorema de los ' +
    'números primos dice que cerca de $n$ hay un primo cada $\\ln n$ números. Para $n \\approx ' +
    '2^{1024}$, $\\ln n \\approx 710$: uno de cada 710, o uno de cada 355 si solo se prueban ' +
    'impares. Con unos cientos de candidatos al azar aparece uno.');

  p.formula('P(n \\text{ primo}) \\approx \\frac{1}{\\ln n}, \\qquad \\text{intentos esperados (impares)} \\approx \\frac{\\ln n}{2} = \\frac{b\\,\\ln 2}{2} \\approx 0{,}35\\,b',
    'cuántos candidatos hacen falta',
    'Se lee: <em>«la probabilidad de que un número cerca de ene sea primo es uno partido por el ' +
    'logaritmo neperiano de ene»</em>. Para $b$ bits, $\\ln n = b \\ln 2$.<br><br>Un primo de 1024 ' +
    'bits cuesta unos 355 candidatos impares, y cada candidato, un test rápido. Es cuestión de ' +
    'milisegundos.');

  p.demo({
    title: 'Contar primos en una ventana',
    intro: 'Se toman los mil números que siguen a $10^k$ y se cuentan los primos con el test del tema. La estimación es $1000 / \\ln(10^k)$. Sube $k$ y mira cómo se van espaciando, despacio.',
    predice: 'Entre $10^{6}$ y $10^6 + 1000$ hay unos 72 primos. Entre $10^{12}$ y $10^{12} + 1000$, ¿habrá unos 72, unos 36 o unos 7?',
    build: function (host) {
      var k = 6;
      var out = W.readout(host, '');
      function pinta() {
        var N = Math.pow(10, k), c = 0, primeros = [];
        for (var i = 1; i <= 1000; i++) if (CR.primoProbable(N + i)) { c++; if (primeros.length < 5) primeros.push(N + i); }
        out.set('Entre $10^{' + k + '}$ y $10^{' + k + '} + 1000$: <strong>' + c + '</strong> primos. Estimación $1000 / \\ln 10^{' + k + '} = ' + U.fmt(1000 / (k * Math.LN10), 1) + '$.<br>Los primeros: ' + primeros.map(function (x) { return U.miles(x); }).join(', ') + '…<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Cada uno se ha comprobado con Miller-Rabin y siete bases, en tu navegador.</span>');
      }
      W.slider(W.row(host), { label: 'k (la ventana empieza en 10^k)', min: 3, max: 15, step: 1, value: k, on: function (v) { k = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El test de Fermat, y los números que lo engañan');

  p.text('El pequeño teorema de Fermat dice que si $n$ es primo, $a^{n-1} \\equiv 1 \\pmod n$ para todo ' +
    '$a$ que no sea múltiplo de $n$. Dándole la vuelta: si para algún $a$ sale otra cosa, $n$ ' +
    '<strong>seguro</strong> que no es primo. Ese $a$ se llama <em>testigo</em>. Y calcular ' +
    '$a^{n-1} \\bmod n$ cuesta unos cientos de multiplicaciones por cuadrados sucesivos.');

  p.text('El problema es el recíproco. Si sale 1, $n$ <em>podría</em> ser primo. Para la mayoría de los ' +
    'compuestos, casi cualquier base los delata. Pero hay una familia, los <strong>números de ' +
    'Carmichael</strong>, que cumplen $a^{n-1} \\equiv 1$ para <em>todas</em> las bases que no ' +
    'comparten factores con ellos: 561, 1105, 1729… Son infinitos, y el test de Fermat no los ' +
    'distingue de los primos.');

  p.demo({
    title: 'Fermat contra 561',
    intro: 'Elige $n$ y varias bases. Para cada base se calcula $a^{n-1} \\bmod n$: si no da 1, la base es testigo de que $n$ es compuesto. Con 561 no aparece ningún testigo entre las bases que no comparten factor con él.',
    predice: '$561 = 3\\cdot 11\\cdot 17$ no es primo. ¿Cuántas de las bases 2, 4, 5, 7, 8, 10 lo delatarán con Fermat?',
    build: function (host) {
      var n = 561;
      var out = W.mono(host, '');
      function pinta() {
        var h = '<b>n = ' + n + '</b>' + (CR.esPrimo(n) ? ' (es primo)' : ' = ' + ML.factorTex(n).replace(/\\cdot/g, '·').replace(/\^\{(\d+)\}/g, '^$1') + ' (compuesto)') + '\n\n', testigos = 0, probadas = 0;
        [2, 3, 4, 5, 7, 8, 10, 11, 13].forEach(function (a) {
          if (a >= n) return;
          var g = ML.gcd(a, n), v = CR.potMod(a, n - 1, n);
          probadas++;
          if (g !== 1) { h += 'a = ' + (a < 10 ? ' ' : '') + a + ': comparte el factor ' + g + ' con n  <span class="cr-dif">delata</span>\n'; testigos++; return; }
          h += 'a = ' + (a < 10 ? ' ' : '') + a + ': a^(n−1) mod n = ' + v + (v === 1 ? '  <span class="cr-tenue">no dice nada</span>' : '  <span class="cr-dif">testigo: compuesto</span>') + '\n';
          if (v !== 1) testigos++;
        });
        h += '\n' + (CR.esPrimo(n) ? 'Es primo, y ninguna base puede delatarlo.' : (testigos ? testigos + ' de ' + probadas + ' bases lo delatan.' : '<span class="cr-dif">Ninguna base lo delata salvo las que comparten factor: es un número de Carmichael.</span>'));
        out.set(h);
      }
      W.chips(host, [{ label: '561', value: 561 }, { label: '1105', value: 1105 }, { label: '1729', value: 1729 }, { label: '221', value: 221 }, { label: '341', value: 341 }, { label: '563 (primo)', value: 563 }], { value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Miller-Rabin: mirar las raíces cuadradas');

  p.text('La mejora es exigir más. Si $n$ es primo, las únicas raíces cuadradas de 1 módulo $n$ son ' +
    '$1$ y $-1$. Se escribe $n - 1 = 2^s d$ con $d$ impar, y se mira la sucesión $a^d, a^{2d}, ' +
    'a^{4d}, \\dots, a^{2^{s-1}d}$, cada término el cuadrado del anterior. Si $n$ es primo, o bien ' +
    '$a^d \\equiv 1$, o bien algún término de la sucesión es $-1$. Si no pasa ninguna de las dos ' +
    'cosas, $n$ es compuesto y $a$ es testigo.');

  p.formula('n - 1 = 2^s d, \\qquad a^d \\equiv 1 \\ \\text{ o }\\ a^{2^r d} \\equiv -1 \\text{ para algún } r < s',
    'la condición de Miller-Rabin',
    'Se lee: <em>«a elevado a d es uno, o alguna de sus potencias sucesivas al cuadrado es menos ' +
    'uno»</em>. Si $n$ es primo, todo $a$ la cumple. Si $n$ es compuesto, como mucho <strong>una ' +
    'cuarta parte</strong> de las bases la cumplen: al menos tres de cada cuatro son testigos, y los ' +
    'números de Carmichael no se libran.<br><br>Con $k$ bases al azar, un compuesto se cuela con ' +
    'probabilidad menor que $4^{-k}$. Con $k = 64$, menos de $10^{-38}$: más probable es que un rayo ' +
    'cósmico cambie un bit de la memoria durante el cálculo.');

  p.demo({
    title: 'Miller-Rabin, base a base',
    intro: 'Para el $n$ elegido se muestra la sucesión $a^d, a^{2d}, \\dots$ de cada base y el veredicto. Abajo, para los $n$ pequeños, cuántas bases de todas las posibles mienten: nunca más de una cuarta parte.',
    predice: 'Para 561, que engañaba a Fermat, ¿cuántas de las bases 2, 3, 5, 7 lo delatarán ahora?',
    build: function (host) {
      var n = 561;
      var out = W.mono(host, '');
      function pinta() {
        var sd = CR.descompone(n), h = '<b>n = ' + n + '</b>, n − 1 = 2^' + sd.s + ' · ' + sd.d + '\n\n';
        [2, 3, 5, 7, 11, 13].forEach(function (a) {
          if (a >= n - 1) return;
          var r = CR.millerRabin(n, a);
          h += 'a = ' + (a < 10 ? ' ' : '') + a + ': ' + r.cadena.map(function (x) { return x === n - 1 ? x + ' (= −1)' : x; }).join(' → ') + '  ' + (r.compuesto ? '<span class="cr-dif">testigo: compuesto</span>' : '<span class="cr-tenue">compatible con primo</span>') + '\n';
        });
        if (n < 3000 && !CR.esPrimo(n)) {
          var mentirosas = 0, total = 0;
          for (var a = 2; a < n - 1; a++) { total++; if (!CR.millerRabin(n, a).compuesto) mentirosas++; }
          h += '\nDe las ' + total + ' bases entre 2 y ' + (n - 2) + ', mienten ' + mentirosas + ' (' + U.fmt(100 * mentirosas / total, 1) + ' %): menos de una cuarta parte.';
        } else if (CR.esPrimo(n)) h += '\nEs primo: ninguna base puede ser testigo.';
        out.set(h);
      }
      W.chips(host, [{ label: '561', value: 561 }, { label: '1105', value: 1105 }, { label: '221', value: 221 }, { label: '341', value: 341 }, { label: '2047', value: 2047 }, { label: '563 (primo)', value: 563 }, { label: '1009 (primo)', value: 1009 }], { value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Dos bases contra 221',
    enunciado: '$n = 221$. Aplicar Miller-Rabin con la base $a = 174$ y con la base $a = 137$, sabiendo que $174^{55} \\equiv 47$ y $137^{55} \\equiv 188 \\pmod{221}$.',
    pasos: [
      { t: '<strong>Descomponer.</strong> $n - 1 = 220 = 4\\cdot 55 = 2^2\\cdot 55$: $s = 2$, $d = 55$. La sucesión tiene dos términos: $a^{55}$ y $a^{110}$.', antes: 'Saca todos los factores 2 de 220.' },
      { t: '<strong>Base 174.</strong> $174^{55} \\equiv 47$, que no es 1 ni $-1$. Al cuadrado: $47^2 = 2209 = 10\\cdot 221 - 1 \\equiv -1$. Ha aparecido el $-1$: la condición se cumple. La base 174 <em>miente</em>: 221 pasa el test con ella.', antes: '$47^2 \\bmod 221$: ¿sale $-1$, es decir, 220?' },
      { t: '<strong>Base 137.</strong> $137^{55} \\equiv 188$, no es $\\pm 1$. Al cuadrado: $188^2 = 35\\,344 = 159\\cdot 221 + 205 \\equiv 205$. Tampoco es $-1$, y se han acabado los términos. Testigo: <strong>221 es compuesto</strong> ($13\\cdot 17$).', antes: 'Ahora con 188. ¿Aparece el $-1$?' },
      { t: '<strong>Lo que enseña.</strong> Una sola base puede mentir; con varias al azar, la probabilidad de que todas mientan cae como $4^{-k}$. En la práctica se usan 40 o 64, y ningún compuesto pasa.' }
    ],
    cierre: 'El test nunca dice «primo»: dice «no he encontrado testigo». Con 64 bases, eso vale más que cualquier certificado.'
  });

  p.comprueba('Un número de 2048 bits pasa Miller-Rabin con 64 bases al azar. ¿Qué se sabe?', [
    { t: 'Que la probabilidad de que sea compuesto es menor que $4^{-64} \\approx 3\\cdot 10^{-39}$: se usa como primo sin más', ok: true, por: 'Cada base miente con probabilidad menor que 1/4 y las bases son independientes. Una probabilidad así es menor que la de un fallo del hardware durante el cálculo.' },
    { t: 'Que es primo con seguridad', ok: false, por: 'El test no demuestra: acota la probabilidad de error. Existe un test determinista, AKS, pero es mucho más lento y en la práctica no hace falta.' },
    { t: 'Nada: podría ser un número de Carmichael', ok: false, por: 'Los números de Carmichael engañan a Fermat, no a Miller-Rabin: para ellos también hay al menos tres cuartas partes de testigos.' }
  ]);

  p.util('Cada clave RSA, cada primo de Diffie-Hellman y cada curva elíptica que se genera pasa por este ' +
    'test, y las bibliotecas criptográficas lo ejecutan millones de veces al día. Es además un ' +
    'ejemplo de una idea que va más allá de los primos: un algoritmo <em>probabilista</em> que se ' +
    'equivoca con probabilidad controlada puede ser mucho mejor que uno exacto pero inviable, y en ' +
    'muchos problemas de computación esa es hoy la única forma de avanzar.');

  p.hist('Fermat enunció su pequeño teorema en una carta de 1640, sin demostración, y Euler lo demostró ' +
    'en 1736. Robert Carmichael encontró en 1910 los números que engañan a Fermat, y se demostró en ' +
    '1994 que son infinitos. Gary Miller publicó en 1976 un test determinista que dependía de la ' +
    'hipótesis de Riemann generalizada, y Michael Rabin lo convirtió en 1980 en el test ' +
    'probabilista que se usa desde entonces. En 2002, Agrawal, Kayal y Saxena, dos de ellos ' +
    'estudiantes, dieron el primer test determinista en tiempo polinómico sin hipótesis; fue una ' +
    'noticia en todo el mundo, y no sustituyó a Miller-Rabin en ningún sitio.');

  p.trampas([
    { e: 'Buscar primos dividiendo', por: 'Hasta $\\sqrt{n}$ con $n$ de 600 cifras son $10^{300}$ divisiones. La división sirve para descartar deprisa los múltiplos de primos pequeños, nada más.' },
    { e: 'Fiarse del test de Fermat', por: '561 lo pasa con todas las bases que no comparten factor con él, y hay infinitos como él. Miller-Rabin no se deja.' },
    { e: 'Usar bases fijas y pocas', por: 'Para bases fijas se pueden construir compuestos que las engañan a todas. Bases al azar, y muchas.' },
    { e: 'Creer que «probable» significa «inseguro»', por: 'Con 64 bases, el error es menor que $10^{-38}$. La probabilidad de que un rayo cósmico altere el resultado es mayor.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Sacar los doses',
    level: 'basico',
    gen: function (r) { var n = r.int(50, 2000) * 2 + 1; var sd = CR.descompone(n); if (sd.s < 2) return null; return { n: n, s: sd.s, d: sd.d }; },
    ask: function (d) { return 'Para aplicar Miller-Rabin a $n = ' + d.n + '$ hay que escribir $n - 1 = 2^s\\,d$ con $d$ impar. ¿Cuánto valen $s$ y $d$?'; },
    fields: [{ name: 's', label: 's', w: 'tiny' }, { name: 'd', label: 'd', w: 'tiny' }],
    sol: function (d) { return { s: d.s, d: d.d }; },
    errores: [{ si: function (v, d) { return v.d % 2 === 0 && v.d > 0; }, msg: '$d$ tiene que ser impar: sigue dividiendo entre 2.' }],
    hint: function (d) { return 'Divide ' + (d.n - 1) + ' entre 2 tantas veces como se pueda.'; },
    steps: function (d) { return ['$' + (d.n - 1) + ' = 2^{' + d.s + '}\\cdot ' + d.d + '$.', 'La sucesión del test tendrá ' + d.s + ' términos: $a^{' + d.d + '}, a^{' + 2 * d.d + '}' + (d.s > 2 ? ', \\dots' : '') + '$.']; },
    answer: function (d) { return 's = ' + d.s + ', d = ' + d.d; }
  });

  p.exercise({
    title: 'Probabilidad de que se cuele un compuesto',
    level: 'basico',
    gen: function (r) { var k = r.pick([5, 10, 20, 32, 40, 64]); return { k: k, p: Math.pow(4, -k) }; },
    ask: function (d) { return 'Un número compuesto pasa ' + d.k + ' rondas de Miller-Rabin con bases al azar. ¿Cuál es, como mucho, la probabilidad de que eso ocurra? Escríbela como potencia de 2 (solo el exponente, con signo) o en notación científica.'; },
    fields: [{ name: 'p', label: 'probabilidad', w: 'wide' }],
    sol: function (d) { return { p: d.p }; },
    rel: 1e-2,
    check: function (v, d) {
      var raw = String(v.raw.p || '').trim().replace(',', '.');
      if (/^-?\d+$/.test(raw) && +raw === -2 * d.k) return { ok: true };
      if (Math.abs(v.p - d.p) <= 1e-2 * d.p) return { ok: true };
      if (/^-?\d+$/.test(raw) && +raw === -d.k) return { ok: false, msg: 'Cada ronda deja pasar como mucho una cuarta parte, $4^{-1} = 2^{-2}$: son dos bits por ronda.' };
      return { ok: false, msg: 'Una cuarta parte por ronda, independientes: $4^{-k} = 2^{-2k}$.' };
    },
    hint: function () { return 'Menos de $1/4$ por ronda, y las rondas son independientes.'; },
    steps: function (d) { return ['$4^{-' + d.k + '} = 2^{-' + 2 * d.k + '} \\approx ' + d.p.toExponential(1).replace('e-', '\\cdot 10^{-') + '}$.', d.k >= 32 ? 'Menor que la probabilidad de un fallo del hardware: se usa como primo.' : 'Para claves reales se usan más rondas: 40 o 64.']; },
    answer: function (d) { return '2^-' + 2 * d.k; }
  });

  p.exercise({
    title: 'El test de Fermat',
    level: 'medio',
    gen: function (r) { var n = r.pick([15, 21, 25, 33, 35, 39, 45, 49, 51, 55, 57, 65]), a = r.int(2, n - 2); if (ML.gcd(a, n) !== 1) return null; var v = CR.potMod(a, n - 1, n); return { n: n, a: a, v: v, testigo: v !== 1 }; },
    ask: function (d) { return 'Aplica el test de Fermat a $n = ' + d.n + '$ con la base $a = ' + d.a + '$: calcula $' + d.a + '^{' + (d.n - 1) + '} \\bmod ' + d.n + '$ por cuadrados sucesivos. ¿Es $a$ un testigo de que $n$ es compuesto?'; },
    fields: [{ name: 'v', label: 'resultado', w: 'tiny' }, { name: 'q', label: 'testigo', opts: [{ t: 'sí, delata a n', v: 'si' }, { t: 'no, sale 1', v: 'no' }] }],
    sol: function (d) { return { v: d.v, q: d.testigo ? 'si' : 'no' }; },
    hint: function (d) { return ['$' + (d.n - 1) + ' = ' + (d.n - 1).toString(2) + '_2$: cuadrados y productos, todo módulo ' + d.n + '.', 'Si el resultado no es 1, $n$ no puede ser primo.']; },
    steps: function (d) { var t = CR.potModTraza(d.a, d.n - 1, d.n); return [t.pasos.map(function (ps) { return ps.bit + ':' + ps.despues; }).join(' → ') + ' — resultado $' + d.v + '$.', d.testigo ? '$' + d.v + ' \\ne 1$: la base ' + d.a + ' es <strong>testigo</strong>. $' + d.n + ' = ' + ML.factorTex(d.n) + '$ es compuesto.' : 'Sale 1: la base ' + d.a + ' <strong>miente</strong>. $' + d.n + ' = ' + ML.factorTex(d.n) + '$ es compuesto, pero esta base no lo delata.']; },
    answer: function (d) { return d.v + (d.testigo ? ', testigo' : ', no'); }
  });

  p.exercise({
    title: 'Cuántos candidatos',
    level: 'medio',
    gen: function (r) { var b = r.pick([256, 512, 1024, 1536, 2048, 3072]); return { b: b, ln: b * Math.LN2, imp: b * Math.LN2 / 2 }; },
    ask: function (d) { return 'Se buscan primos de ' + d.b + ' bits probando números impares al azar. ¿Cuántos candidatos hacen falta, de media, hasta encontrar uno? (sin decimales)'; },
    fields: [{ name: 'n', label: 'candidatos', w: 'tiny' }],
    sol: function (d) { return { n: d.imp }; },
    rel: 2e-2,
    errores: [{ si: function (v, d) { return Math.abs(v.n - d.ln) < 0.02 * d.ln; }, msg: 'Eso es contando pares e impares. Los pares se descartan sin probar: la mitad.' }],
    hint: function () { return '$\\ln n = b\\ln 2$, y entre 2 por probar solo impares.'; },
    steps: function (d) { return ['$\\ln 2^{' + d.b + '} = ' + d.b + '\\cdot 0{,}693 = ' + U.fmt(d.ln, 0) + '$: uno de cada ' + U.fmt(d.ln, 0) + ' números es primo.', 'Solo impares: uno de cada $' + U.fmt(d.imp, 0) + '$.', 'Unos <strong>' + U.fmt(d.imp, 0) + '</strong> candidatos, cada uno con un test de milisegundos.']; },
    answer: function (d) { return U.fmt(d.imp, 0); }
  });

  p.exercise({
    title: 'Miller-Rabin a mano',
    level: 'avanzado',
    gen: function (r) { var n = r.pick([91, 221, 341, 561, 703, 1105]), a = r.int(2, 20); if (ML.gcd(a, n) !== 1) return null; var mr = CR.millerRabin(n, a); return { n: n, a: a, s: mr.s, d: mr.d, cadena: mr.cadena, primero: mr.cadena[0], compuesto: mr.compuesto }; },
    ask: function (d) { return 'Miller-Rabin para $n = ' + d.n + '$ con la base $a = ' + d.a + '$. Ya se sabe que $n - 1 = 2^{' + d.s + '}\\cdot ' + d.d + '$. Calcula $a^{d} = ' + d.a + '^{' + d.d + '} \\bmod ' + d.n + '$ y decide, elevando al cuadrado hasta ' + (d.s - 1) + ' veces, si la base delata a $n$.'; },
    fields: [{ name: 'v', label: 'a^d mod n', w: 'tiny' }, { name: 'q', label: 'veredicto', opts: [{ t: 'testigo: compuesto', v: 'si' }, { t: 'compatible con primo', v: 'no' }] }],
    sol: function (d) { return { v: d.primero, q: d.compuesto ? 'si' : 'no' }; },
    hint: function (d) { return ['Primero $a^d$ por cuadrados sucesivos.', 'Si es 1 o $' + (d.n - 1) + '$ (que es $-1$), la base no delata. Si no, eleva al cuadrado: si aparece $' + (d.n - 1) + '$, tampoco; si se acaban los cuadrados sin aparecer, es testigo.']; },
    steps: function (d) { return ['$' + d.a + '^{' + d.d + '} \\equiv ' + d.primero + '$.', 'Sucesión: ' + d.cadena.map(function (x) { return x === d.n - 1 ? x + ' (= -1)' : String(x); }).join(' → ') + '.', d.compuesto ? 'No aparece $-1$: la base $' + d.a + '$ es <strong>testigo</strong> y $' + d.n + ' = ' + ML.factorTex(d.n) + '$ es compuesto.' : 'Aparece 1 o $-1$ donde toca: esta base <strong>no delata</strong> a $' + d.n + ' = ' + ML.factorTex(d.n) + '$, aunque sea compuesto. Otra base lo haría.']; },
    answer: function (d) { return d.primero + (d.compuesto ? ', testigo' : ', no delata'); }
  });

  p.keys([
    'Cerca de $n$ hay un primo cada $\\ln n$ números: un primo de $b$ bits cuesta unos $0{,}35\\,b$ candidatos impares.',
    'Test de Fermat: si $a^{n-1} \\bmod n \\ne 1$, $n$ es compuesto. Pero los números de Carmichael lo pasan con todas las bases.',
    'Miller-Rabin mira la sucesión $a^d, a^{2d}, \\dots$ con $n - 1 = 2^s d$: si $n$ es primo aparece 1 o $-1$; si es compuesto, al menos tres cuartas partes de las bases lo delatan.',
    'Con $k$ bases al azar, un compuesto se cuela con probabilidad menor que $4^{-k}$: con 64, menos que un fallo del hardware.',
    'Un algoritmo probabilista con error acotado vale más que uno exacto e inviable.'
  ]);
});
