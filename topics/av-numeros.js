/* Tema: Teoría de números */
Course.topic('av-numeros', function (p) {

  p.text('Gauss la llamó «la reina de las matemáticas». Estudia los números enteros, que son el objeto ' +
    'más simple que existe, y contiene los problemas más difíciles que se conocen. Durante siglos fue ' +
    'el ejemplo perfecto de matemática sin aplicación posible. Hoy protege todas tus contraseñas.');

  p.section('Aritmética modular: el reloj');

  p.text('Trabajar <strong>módulo $n$</strong> es quedarse solo con el resto al dividir entre $n$. Es ' +
    'exactamente lo que hace un reloj: si son las 10 y pasan 5 horas, no son las 15, son las 3. Estamos ' +
    'calculando módulo 12.');

  p.formula('a \\equiv b \\pmod{n} \\iff n \\mid (a - b)', 'a y b dejan el mismo resto',
    'El signo $\\equiv$ con tres rayas se lee «es congruente con», y $\\pmod{n}$ se dice «módulo ' +
      'ene». La barra $\\mid$ se lee «divide a».<br><br>Entera: <em>«a es congruente con b módulo ene ' +
      'si y solo si ene divide a la diferencia a menos b»</em>.<br><br>En cristiano: <em>«a y b dejan ' +
      'el mismo resto al dividir entre ene»</em>. Como en el reloj: las 15 y las 3 son congruentes ' +
      'módulo 12, porque su diferencia, 12, es múltiplo de 12.');

  p.text('Lo asombroso es que las operaciones <strong>sobreviven</strong>: se puede sumar, restar y ' +
    'multiplicar en el mundo modular con toda libertad. El resto del resultado solo depende de los ' +
    'restos de partida.');

  p.demo({
    title: 'El reloj modular',
    intro: 'Ve sumando el mismo paso una y otra vez. Fíjate en cuándo se visitan todos los números y cuándo se cae en un ciclo corto.',
    build: function (host, d) {
      var n = 12, paso = 5, k = 0;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, height: 330,
        grid: false, axes: false,
        draw: function (g) {
          g.circle(0, 0, 1, { color: 'axis', w: 1.6, stroke: true });
          var visitados = {};
          var pos = 0;
          for (var i = 0; i <= k; i++) { visitados[pos] = i; pos = (pos + paso) % n; }
          for (var j = 0; j < n; j++) {
            var a = Math.PI / 2 - 2 * Math.PI * j / n;
            var P = [Math.cos(a), Math.sin(a)];
            var vis = visitados[j] !== undefined;
            g.point(P[0], P[1], { color: vis ? 0 : 'axis', r: vis ? 9 : 6 });
            g.text(P[0] * 1.22, P[1] * 1.22, String(j), { align: 'center', baseline: 'middle', size: 12.5, color: vis ? 0 : 'ink' });
          }
          // saltos
          var q = 0;
          for (var s = 0; s < k; s++) {
            var a1 = Math.PI / 2 - 2 * Math.PI * q / n;
            var q2 = (q + paso) % n;
            var a2 = Math.PI / 2 - 2 * Math.PI * q2 / n;
            g.seg(Math.cos(a1), Math.sin(a1), Math.cos(a2), Math.sin(a2), { color: 2, w: 1.6, alpha: .7 });
            q = q2;
          }
          var af = Math.PI / 2 - 2 * Math.PI * q / n;
          g.point(Math.cos(af), Math.sin(af), { color: 1, r: 8 });
        }
      });
      function paint() {
        var pos = (k * paso) % n;
        var vis = {};
        var q = 0;
        for (var i = 0; i <= k; i++) { vis[q] = true; q = (q + paso) % n; }
        var cuantos = Object.keys(vis).length;
        var g = ML.gcd(paso, n);
        out.set('Módulo <strong>' + n + '</strong>, sumando <strong>' + paso + '</strong> cada vez.<br>' +
          '$' + k + ' \\cdot ' + paso + ' \\equiv ' + pos + ' \\pmod{' + n + '}$ &nbsp;·&nbsp; ' +
          'visitados: <strong>' + cuantos + '</strong> de ' + n + '<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">$\\operatorname{mcd}(' + paso + ', ' + n + ') = ' + g + '$: ' +
          (g === 1 ? 'como es 1, este paso <strong>recorre todos</strong> los números antes de repetirse.'
            : 'como no es 1, el paso solo alcanza ' + (n / g) + ' posiciones y se queda dando vueltas en un ciclo corto.') +
          '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'módulo n', min: 5, max: 24, step: 1, value: 12, dec: 0, on: function (v) { n = v; paso = Math.min(paso, v - 1); k = 0; paint(); } });
      W.slider(row, { label: 'paso', min: 1, max: 12, step: 1, value: 5, dec: 0, on: function (v) { paso = v; k = 0; paint(); } });
      W.buttons(host, [
        { t: 'Siguiente salto →', cls: 'btn--main', on: function () { k++; paint(); } },
        { t: '↺ Reiniciar', on: function () { k = 0; paint(); } }
      ]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Primos: los ladrillos');

  p.text('Ya sabes que todo entero se descompone en primos de forma única. Lo que hace especial a los ' +
    'primos es la tensión entre dos hechos: <strong>son infinitos</strong> (Euclides) y aun así ' +
    '<strong>se van espaciando</strong>.');

  p.formula('\\pi(x) \\sim \\frac{x}{\\ln x}', 'teorema de los números primos');

  p.text('$\\pi(x)$ cuenta cuántos primos hay hasta $x$. El teorema —demostrado en 1896 por Hadamard y ' +
    'de la Vallée Poussin— dice que hasta un millón hay aproximadamente $10^6/\\ln(10^6) \\approx 72\\,382$ ' +
    'primos. El valor real es 78 498. Nada mal para una fórmula con un logaritmo.');

  p.demo({
    title: 'Cómo se reparten los primos',
    intro: 'La cuenta real de primos frente a la estimación x/ln(x). Amplía el rango y verás que la proporción se ajusta cada vez mejor.',
    build: function (host, d) {
      var N = 200;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 200, ymin: 0, ymax: 50, height: 290,
        xlabel: 'x', ylabel: 'nº de primos',
        draw: function (g) {
          var primos = ML.primesUpTo(N);
          var pts = [], c = 0, idx = 0;
          for (var x = 2; x <= N; x++) {
            if (primos[idx] === x) { c++; idx++; }
            pts.push([x, c]);
          }
          g.path(pts, { color: 0, w: 2.4 });
          g.fn(function (x) { return x > 2 ? x / Math.log(x) : 0; }, { color: 1, w: 2.2, dash: true });
        }
      });
      function paint() {
        var primos = ML.primesUpTo(N);
        var est = N / Math.log(N);
        plot.view(0, N, 0, Math.max(10, primos.length * 1.2));
        out.set('Hasta $' + U.miles(N) + '$ hay <strong>' + primos.length + '</strong> primos.<br>' +
          'La estimación $\\dfrac{x}{\\ln x}$ da $' + U.fmt(est, 2) + '$ — se equivoca en un $' +
          U.fmt(Math.abs(est - primos.length) / primos.length * 100, 2) + '\\%$.<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">La densidad de primos cerca de $x$ es ' +
          'aproximadamente $1/\\ln x$: hacia el millón, uno de cada 14 números es primo.</span>');
      }
      W.slider(W.row(host), { label: 'hasta N', min: 50, max: 5000, step: 50, value: 200, dec: 0, on: function (v) { N = v; paint(); } });
      W.legend(host, [{ c: 0, t: 'primos reales' }, { c: 1, t: '$x/\\ln x$' }]);
      paint();
    }
  });

  p.sub('Preguntas todavía abiertas');
  p.text('Conviene terminar con una idea que rara vez se cuenta en clase: las matemáticas no son un ' +
    'edificio acabado. En la teoría de números —la parte que trabaja con los objetos más sencillos ' +
    'que existen, los números enteros— hay preguntas que se formulan en una línea, que un niño ' +
    'entiende, y que llevan siglos sin respuesta.');


  p.list([
    '<strong>Conjetura de Goldbach</strong> (1742): todo par mayor que 2 es suma de dos primos. Comprobada hasta $4\\cdot10^{18}$. Sin demostrar.',
    '<strong>Primos gemelos</strong>: ¿hay infinitas parejas de primos separados por 2 (11 y 13, 17 y 19…)? Sin resolver.',
    '<strong>Hipótesis de Riemann</strong> (1859): sobre la distribución fina de los primos. Es el problema abierto más famoso de las matemáticas, con un millón de dólares de premio.'
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El pequeño teorema de Fermat');
  p.text('Fermat descubrió una regularidad sorprendente al elevar números a exponentes primos y quedarse ' +
    'con el resto. Parece un juego de aritmética modular sin más consecuencia, y sin embargo es la ' +
    'pieza sobre la que se apoya el cifrado que protege internet: da una forma barata de sospechar ' +
    'si un número enorme es primo, y explica por qué el sistema RSA descifra bien lo que ha cifrado.');


  p.formula('a^{p-1} \\equiv 1 \\pmod{p} \\qquad (p \\text{ primo},\\ p \\nmid a)', 'pequeño teorema de Fermat',
    'Se lee: <em>«a elevado a pe menos uno es congruente con uno módulo pe, siendo pe primo y a no ' +
      'divisible por pe»</em>.<br><br>En cristiano: <em>«si elevas cualquier número a la potencia ' +
      'primo menos uno y divides entre ese primo, el resto es siempre 1»</em>. Pruébalo con $p=7$ y ' +
      '$a=2$: $2^6=64$, y 64 dividido entre 7 da 9 con resto 1.<br><br>Lo llamativo es que funciona ' +
      'sea cual sea el $a$, y eso lo convierte en un test de primalidad.');

  p.text('Un resultado con aspecto inofensivo y consecuencias enormes: permite calcular potencias ' +
    'gigantescas módulo $p$ sin calcularlas, y es la base de los tests de primalidad rápidos que usan ' +
    'los ordenadores para generar claves.');

  p.util('Este teorema es lo que permite comprobar si un número enorme es primo sin factorizarlo, y sin ' +
    'esa comprobación no habría comercio electrónico: cada vez que se establece una conexión segura ' +
    'hay que fabricar primos de cientos de cifras en milisegundos. Los tests que se usan en la ' +
    'práctica son descendientes directos de este resultado del siglo XVII, escrito por un juez que ' +
    'hacía matemáticas por afición.');

  p.section('RSA: por qué esto protege tus datos');

  p.text('Y aquí llega la vuelta de tuerca histórica. En 1940 G. H. Hardy presumía de que la teoría de ' +
    'números era la rama más pura e inútil de las matemáticas, sin ninguna aplicación bélica ni ' +
    'práctica. En 1977 se convirtió en la base de la criptografía moderna.');

  p.text('La idea de RSA descansa en una <strong>asimetría</strong> brutal:');

  p.list([
    'Multiplicar dos primos de 300 cifras: <strong>instantáneo</strong>.',
    'Factorizar el producto resultante: <strong>siglos</strong>, incluso con todos los ordenadores del planeta.'
  ]);

  p.formulas([
    'n = p\\cdot q, \\qquad \\varphi(n) = (p-1)(q-1)',
    'e\\,d \\equiv 1 \\pmod{\\varphi(n)}',
    'c = m^e \\bmod n \\qquad m = c^d \\bmod n'
  ], 'cifrado y descifrado',
    'La letra $\\varphi$ es la fi griega y $\\varphi(n)$ se dice «fi de ene» o «indicador de Euler»: ' +
      'cuenta cuántos números menores que $n$ no comparten factores con él.<br><br>Se lee: <em>«ene es ' +
      'igual a pe por cu; fi de ene es igual a pe menos uno por cu menos uno»</em>.<br><br>Y aquí está ' +
      'toda la seguridad del sistema: cualquiera puede ver $n$, porque es público, pero para calcular ' +
      '$\\varphi(n)$ hacen falta $p$ y $q$ por separado, y recuperarlos a partir de $n$ es el problema ' +
      'de factorizar que nadie sabe resolver deprisa.');

  p.note('La clave pública $(n, e)$ se puede publicar en internet sin ningún riesgo: cualquiera puede ' +
    'cifrar con ella. Solo quien conozca $p$ y $q$ puede calcular $d$ y descifrar. Y para conocer $p$ ' +
    'y $q$ habría que factorizar $n$. Toda la seguridad del comercio electrónico se apoya en que nadie ' +
    'sabe factorizar rápido.', 'ok', 'Por qué funciona');

  p.text('Conviene señalar el matiz: no está <em>demostrado</em> que factorizar sea difícil. Solo se ' +
    'sabe que nadie ha encontrado cómo hacerlo rápido en cuarenta años de intentos. Y un ordenador ' +
    'cuántico suficientemente grande podría hacerlo con el algoritmo de Shor. De ahí que se esté ' +
    'trabajando ya en criptografía poscuántica.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Aritmética modular',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([5, 7, 9, 11, 12, 13, 24]);
      var a = r.int(20, 500);
      var b = r.int(20, 500);
      var op = r.int(0, 2);
      var val = op === 0 ? (a + b) % n : (op === 1 ? ((a - b) % n + n) % n : (a * b) % n);
      return { n: n, a: a, b: b, op: op, val: val };
    },
    ask: function (d) {
      var s = [' + ', ' - ', ' \\cdot '][d.op];
      return 'Calcula $(' + d.a + s + d.b + ') \\bmod ' + d.n + '$.';
    },
    fields: [{ name: 'v', label: 'Resto', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'Puedes reducir cada número antes de operar: $' + d.a + ' \\equiv ' + (d.a % d.n) + '$ y $' + d.b + ' \\equiv ' + (d.b % d.n) + ' \\pmod{' + d.n + '}$.'; },
    steps: function (d) {
      var s = [' + ', ' - ', ' \\cdot '][d.op];
      var ra = d.a % d.n, rb = d.b % d.n;
      return ['Reducimos primero: $' + d.a + ' \\equiv ' + ra + '$ y $' + d.b + ' \\equiv ' + rb + ' \\pmod{' + d.n + '}$.',
        'Las operaciones respetan las congruencias, así que basta operar con los restos: $(' + ra + s + rb + ')$.',
        'Y volvemos a reducir: el resultado es $' + d.val + '$.',
        'Trabajar con números pequeños desde el principio es lo que hace manejable la aritmética modular.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Potencia modular',
    level: 'medio',
    gen: function (r) {
      var p = r.pick([5, 7, 11, 13, 17]);
      var a = r.int(2, p - 1);
      var e = r.int(2, 12);
      var val = 1;
      for (var i = 0; i < e; i++) val = (val * a) % p;
      return { p: p, a: a, e: e, val: val };
    },
    ask: function (d) {
      return 'Calcula $' + d.a + '^{' + d.e + '} \\bmod ' + d.p + '$.<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">No calcules la potencia entera: ve ' +
        'reduciendo en cada paso.</span>';
    },
    fields: [{ name: 'v', label: 'Resto', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return 'Por el pequeño teorema de Fermat, $' + d.a + '^{' + (d.p - 1) + '} \\equiv 1 \\pmod{' + d.p +
        '}$, así que el exponente se puede reducir módulo $' + (d.p - 1) + '$.';
    },
    steps: function (d) {
      var ered = d.e % (d.p - 1);
      return ['Pequeño teorema de Fermat: como $' + d.p + '$ es primo, $' + d.a + '^{' + (d.p - 1) + '} \\equiv 1$.',
        'Podemos reducir el exponente módulo $' + (d.p - 1) + '$: $' + d.e + ' \\bmod ' + (d.p - 1) + ' = ' + ered + '$.',
        'Basta con calcular $' + d.a + '^{' + (ered === 0 ? d.p - 1 : ered) + '} \\bmod ' + d.p + '$, mucho más corto.',
        'Resultado: $' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Función φ de Euler',
    level: 'medio',
    gen: function (r) {
      var primos = [3, 5, 7, 11, 13, 17, 19, 23];
      var pp = r.pick(primos), q = r.pick(primos);
      if (pp === q) return null;
      return { p: pp, q: q, n: pp * q, phi: (pp - 1) * (q - 1) };
    },
    ask: function (d) {
      return 'Sea $n = ' + d.p + ' \\cdot ' + d.q + ' = ' + d.n + '$, producto de dos primos. ' +
        'Calcula $\\varphi(n) = (p-1)(q-1)$, el número que se usa en RSA.';
    },
    fields: [{ name: 'v', label: 'φ(n)', w: 'tiny' }],
    sol: function (d) { return { v: d.phi }; },
    hint: function (d) { return '$(' + d.p + '-1)\\cdot(' + d.q + '-1)$.'; },
    steps: function (d) {
      return ['$\\varphi(n)$ cuenta cuántos números menores que $n$ son primos con $n$.',
        'Si $n = pq$ con $p$ y $q$ primos distintos: $\\varphi(n) = (p-1)(q-1)$.',
        '$= ' + (d.p - 1) + ' \\cdot ' + (d.q - 1) + ' = ' + d.phi + '$',
        'Aquí está el corazón de RSA: calcular $\\varphi(n)$ es trivial si conoces $p$ y $q$, e ' +
        'inviable si solo conoces $n$. Por eso $n$ se puede publicar.'];
    },
    answer: function (d) { return String(d.phi); }
  });

  p.exercise({
    title: 'Criterio de primalidad',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(100, 400);
      var esPrimo = ML.isPrime(n);
      var limite = Math.floor(Math.sqrt(n));
      return { n: n, esPrimo: esPrimo, limite: limite };
    },
    ask: function (d) {
      return 'Para comprobar si $' + d.n + '$ es primo basta con probar divisores hasta $\\sqrt{n}$. ' +
        '¿Hasta qué número entero hay que probar?';
    },
    fields: [{ name: 'v', label: 'Hasta', w: 'tiny' }],
    sol: function (d) { return { v: d.limite }; },
    hint: function (d) { return 'Calcula $\\sqrt{' + d.n + '} = ' + U.fmt(Math.sqrt(d.n), 4) + '$ y quédate con la parte entera.'; },
    steps: function (d) {
      return ['Si $n = a\\cdot b$ con $a \\le b$, entonces $a \\le \\sqrt{n}$: siempre hay un divisor pequeño.',
        'Por tanto basta con probar hasta $\\lfloor\\sqrt{' + d.n + '}\\rfloor = ' + d.limite + '$.',
        'Además solo hace falta probar con los <strong>primos</strong> hasta ahí: ' +
        ML.primesUpTo(d.limite).join(', ') + '.',
        'Resultado: $' + d.n + '$ ' + (d.esPrimo ? '<strong>sí es primo</strong>.'
          : '<strong>no es primo</strong>: $' + d.n + ' = ' + ML.factorTex(d.n) + '$.'),
        'Este método es válido para números pequeños; para los de 600 cifras de RSA es completamente inviable, ' +
        'y por eso se usan tests probabilísticos basados en el teorema de Fermat.'];
    },
    answer: function (d) { return String(d.limite); }
  });

  p.keys([
    'La aritmética modular es la aritmética del reloj: solo importan los restos.',
    'Sumar, restar y multiplicar respetan las congruencias, así que se puede reducir en cada paso.',
    'Los primos son infinitos pero se espacian: $\\pi(x) \\sim x/\\ln x$.',
    'Goldbach, primos gemelos y Riemann siguen abiertos después de siglos.',
    'Pequeño teorema de Fermat: $a^{p-1}\\equiv 1 \\pmod p$.',
    'RSA se apoya en que multiplicar primos es fácil y factorizar es (hasta hoy) inviable.',
    'La rama que se presumía «inútil» acabó siendo la que protege todo el comercio electrónico.'
  ]);
});
