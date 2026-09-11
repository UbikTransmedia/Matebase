/* Tema: Recurrencias y funciones generadoras */
Course.topic('av-recurrencias', function (p) {

  p.puente('Muchas sucesiones no se definen con una fórmula para el término $n$, sino diciendo cómo se calcula ' +
    'cada término a partir de los anteriores. Es lo que en [[fn-sucesiones]] se llamaba una definición por ' +
    'recurrencia. La más famosa es la de Fibonacci: cada término es la suma de los dos anteriores. Pero aparecen ' +
    'por todas partes: en poblaciones que crecen, en préstamos que se amortizan y, sobre todo, al contar cuánto ' +
    'tarda un algoritmo que se llama a sí mismo. Para resolverlas basta una ecuación de segundo grado y un ' +
    'sistema de dos ecuaciones.');

  p.text('La pregunta de este tema es cómo pasar de la regla a la fórmula: cómo saber cuánto vale el término ' +
    'mil sin calcular los novecientos noventa y nueve anteriores. Y la respuesta sale de sitios conocidos: una ' +
    'ecuación de segundo grado, los [[av-lineal|autovalores]] de una matriz y las ' +
    '[[fn-integral-racional|fracciones simples]].');

  /* ---------------------------------------------------------------- */
  p.section('Recurrencias lineales y su ecuación característica');

  p.formula('a_n = p\\,a_{n-1} + q\\,a_{n-2}', 'una recurrencia lineal de orden 2',
    'Cada término es una combinación lineal fija de los dos anteriores. Para arrancar hacen falta dos valores iniciales, $a_0$ y $a_1$.<br><br>' +
    'Fibonacci es el caso $p = q = 1$ con $a_0 = 0$ y $a_1 = 1$: $0, 1, 1, 2, 3, 5, 8, 13, \\dots$');

  p.text('El truco para resolverla es el mismo que en las ecuaciones diferenciales: probar una solución de la ' +
    'forma más sencilla posible. Aquí esa forma es una progresión geométrica, $a_n = x^n$. Sustituyendo y ' +
    'dividiendo por $x^{n-2}$ queda una ecuación de segundo grado.');

  p.formulas([
    'x^2 = p\\,x + q \\qquad \\text{(ecuación característica)}',
    'a_n = A\\,x_1^n + B\\,x_2^n'
  ], 'la solución general cuando las raíces son distintas',
    '$x_1$ y $x_2$ son las raíces de la ecuación característica. Cualquier combinación de las dos progresiones ' +
    'geométricas cumple la recurrencia, porque la recurrencia es lineal.<br><br>Los números $A$ y $B$ se fijan con ' +
    'los valores iniciales: $A + B = a_0$ y $A\\,x_1 + B\\,x_2 = a_1$, un sistema de dos ecuaciones.<br><br>La misma ' +
    'recurrencia se escribe con una matriz, $\\begin{pmatrix} a_{n+1} \\\\ a_n \\end{pmatrix} = \\begin{pmatrix} p & q \\\\ 1 & 0 \\end{pmatrix}' +
    '\\begin{pmatrix} a_n \\\\ a_{n-1} \\end{pmatrix}$, y las raíces $x_1$, $x_2$ son exactamente los autovalores de esa matriz.');

  p.comprueba('La recurrencia $a_n = 2a_{n-1} + 3a_{n-2}$. ¿Cuáles son sus raíces características?', [
    { t: '$3$ y $-1$', ok: true, por: '$x^2 = 2x + 3$, es decir, $x^2 - 2x - 3 = 0$, que factoriza como $(x - 3)(x + 1)$. Comprobación: suman 2 y su producto es $-3$.' },
    { t: '$-3$ y $1$', ok: false, por: 'Eso sale de $x^2 + 2x - 3 = 0$, con los signos cambiados. La ecuación es $x^2 = px + q$: al pasar todo a un lado quedan $-p$ y $-q$.' },
    { t: '$2$ y $3$', ok: false, por: '$p$ y $q$ no son las raíces: son los coeficientes. Las raíces se obtienen resolviendo $x^2 = 2x + 3$.' }
  ]);

  p.ejemplo({
    title: 'Una recurrencia resuelta de principio a fin',
    enunciado: 'Hallar el término general de $a_n = a_{n-1} + 2a_{n-2}$ con $a_0 = 2$ y $a_1 = 1$, y calcular $a_{10}$ sin pasar por los anteriores.',
    pasos: [
      { t: '<strong>Ecuación característica.</strong> $x^2 = x + 2$, o sea $x^2 - x - 2 = 0$: raíces $x_1 = 2$ y $x_2 = -1$.', antes: 'Prueba $a_n = x^n$. ¿Qué ecuación de segundo grado queda?' },
      { t: '<strong>Solución general.</strong> $a_n = A\\cdot 2^n + B\\cdot(-1)^n$, para cualesquiera $A$ y $B$.' },
      { t: '<strong>Los valores iniciales.</strong> $n = 0$: $A + B = 2$. $n = 1$: $2A - B = 1$. Sumando, $3A = 3$: $A = 1$, $B = 1$.', antes: 'Dos incógnitas, dos datos. Plantea el sistema y resuélvelo.' },
      { t: '<strong>El término general.</strong> $a_n = 2^n + (-1)^n$. Comprobar con la recurrencia: $a_2 = 4 + 1 = 5$, y también $a_1 + 2a_0 = 1 + 4 = 5$ ✓. $a_3 = 8 - 1 = 7$, y $a_2 + 2a_1 = 5 + 2 = 7$ ✓.', antes: 'Calcula $a_2$ de las dos maneras. ¿Coinciden?' },
      { t: '<strong>$a_{10}$ directo.</strong> $2^{10} + (-1)^{10} = 1024 + 1 = 1025$. Sin la fórmula habría que calcular nueve términos; con ella, una potencia.' }
    ],
    cierre: 'La raíz 2 manda: a la larga $a_n \\approx 2^n$ y el $(-1)^n$ solo añade o quita 1. En la demo de arriba se ve como el cociente $a_n/a_{n-1}$ acercándose a 2.'
  });

  p.demo({
    title: 'Una recurrencia y su ecuación característica',
    intro: 'Elige los coeficientes p y q y los dos primeros términos. Arriba, los términos; abajo, el cociente entre cada término y el anterior, con las raíces marcadas a trazos. Cuando las raíces son reales, el cociente acaba pegándose a la de mayor valor absoluto: esa raíz es la que manda. Con raíces complejas, la sucesión oscila.',
    predice: 'Pon $p = 1$, $q = 2$, $a_0 = 2$ y $a_1 = 1$: la recurrencia del ejemplo. ¿A qué valor se acercará el cociente de abajo? ¿Y si pones $q = -2$: seguirá acercándose a algo?',
    build: function (host) {
      var pp = 1, qq = 1, a0 = 0, a1 = 1, N = 16;
      var out = W.readout(host, '');
      function terminos() { var a = [a0, a1]; for (var n = 2; n <= N; n++) a.push(pp * a[n - 1] + qq * a[n - 2]); return a; }
      var plotT = W.plot(host, {
        xmin: -0.5, xmax: N + 0.5, ymin: -10, ymax: 10, height: 220, xlabel: 'n', ylabel: 'aₙ',
        draw: function (g) {
          terminos().forEach(function (v, n) { g.seg(n, 0, n, v, { color: 0, w: 1.4 }); g.point(n, v, { color: 0, r: 3.5 }); });
        }
      });
      var plotR = W.plot(host, {
        xmin: 1, xmax: N, ymin: -3, ymax: 3, height: 190, xlabel: 'n', ylabel: 'cociente',
        aria: 'Cociente entre cada término y el anterior, con las raíces de la ecuación característica',
        draw: function (g) {
          var a = terminos(), pts = [], disc = pp * pp + 4 * qq;
          if (disc >= 0) {
            g.hline((pp + Math.sqrt(disc)) / 2, { color: 1, dash: [4, 4], w: 1.3 });
            g.hline((pp - Math.sqrt(disc)) / 2, { color: 2, dash: [4, 4], w: 1.3 });
          }
          for (var n = 2; n <= N; n++) if (Math.abs(a[n - 1]) > 1e-9) pts.push([n, Math.max(-50, Math.min(50, a[n] / a[n - 1]))]);
          g.path(pts, { color: 0, w: 2 });
          pts.forEach(function (q) { g.point(q[0], q[1], { color: 0, r: 3 }); });
        }
      });
      function pinta() {
        var a = terminos(), m = 1, disc = pp * pp + 4 * qq, txt;
        a.forEach(function (v) { m = Math.max(m, Math.abs(v)); });
        plotT.view(-0.5, N + 0.5, -1.1 * m, 1.1 * m);
        plotR.render();
        if (disc > 1e-9) txt = 'raíces reales $x_1 \\approx ' + U.fmt((pp + Math.sqrt(disc)) / 2, 4) + '$ y $x_2 \\approx ' + U.fmt((pp - Math.sqrt(disc)) / 2, 4) + '$';
        else if (disc > -1e-9) txt = 'una raíz doble, $x = ' + U.fmt(pp / 2, 3) + '$';
        else txt = 'raíces complejas $' + U.fmt(pp / 2, 3) + ' \\pm ' + U.fmt(Math.sqrt(-disc) / 2, 3) + 'i$, de módulo $' + U.fmt(Math.sqrt(-qq), 3) + '$: la sucesión oscila';
        out.set('$a_n = ' + U.fmt(pp, 1) + '\\,a_{n-1} ' + (qq < 0 ? '- ' + U.fmt(-qq, 1) : '+ ' + U.fmt(qq, 1)) + '\\,a_{n-2}$ &nbsp;·&nbsp; $x^2 = ' + U.fmt(pp, 1) + 'x ' +
          (qq < 0 ? '- ' + U.fmt(-qq, 1) : '+ ' + U.fmt(qq, 1)) + '$: ' + txt + ' &nbsp;·&nbsp; $a_{' + N + '} = ' + U.fmt(a[N], 2) + '$');
      }
      var f1 = W.row(host);
      W.slider(f1, { label: 'p', min: -2, max: 2, step: 0.1, value: pp, on: function (v) { pp = v; pinta(); } });
      W.slider(f1, { label: 'q', min: -2, max: 2, step: 0.1, value: qq, on: function (v) { qq = v; pinta(); } });
      var f2 = W.row(host);
      W.slider(f2, { label: '$a_0$', min: -3, max: 3, step: 1, value: a0, on: function (v) { a0 = v; pinta(); } });
      W.slider(f2, { label: '$a_1$', min: -3, max: 3, step: 1, value: a1, on: function (v) { a1 = v; pinta(); } });
      W.hint(host, 'Con p = q = 1, a₀ = 0 y a₁ = 1 es Fibonacci, y el cociente se acerca al número de oro, 1,618…');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Fibonacci y el número de oro');

  p.text('Para Fibonacci la ecuación característica es $x^2 = x + 1$, cuyas raíces son el número de oro y su ' +
    'compañero negativo. Con $a_0 = 0$ y $a_1 = 1$ se obtienen $A$ y $B$, y sale una fórmula que parece imposible: ' +
    'una expresión llena de raíces cuadradas de 5 que, sin embargo, da siempre números enteros.');

  p.formula('F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt 5}, \\qquad \\varphi = \\frac{1 + \\sqrt 5}{2} \\approx 1{,}618, \\qquad \\psi = \\frac{1 - \\sqrt 5}{2} \\approx -0{,}618',
    'la fórmula de Binet',
    'Como $|\\psi| < 1$, el término $\\psi^n$ se hace diminuto enseguida, y $F_n$ es simplemente el entero más cercano a $\\frac{\\varphi^n}{\\sqrt 5}$.<br><br>' +
    'Por eso el cociente $\\frac{F_{n+1}}{F_n}$ tiende a $\\varphi$, y lo hace alternando: una vez por encima, otra por debajo, porque $\\psi$ es negativo.');

  /* ---------------------------------------------------------------- */
  p.section('Funciones generadoras');

  p.text('Hay otra manera de atrapar una sucesión entera en una sola expresión: usar sus términos como ' +
    'coeficientes de una serie de potencias, $G(x) = a_0 + a_1 x + a_2 x^2 + \\dots$ Esa serie se llama ' +
    '<strong>función generadora</strong>, y lo sorprendente es que la recurrencia se convierte en una ecuación ' +
    'algebraica para $G$.');

  p.formula('G(x) = \\sum_{n \\ge 0} F_n\\,x^n = \\frac{x}{1 - x - x^2}', 'la función generadora de Fibonacci',
    'Se obtiene multiplicando la serie por $x$ y por $x^2$ y restando: la recurrencia $F_n = F_{n-1} + F_{n-2}$ hace que casi todo se cancele y queda $G(x)\\,(1 - x - x^2) = x$.<br><br>' +
    'Descomponiendo la fracción en [[fn-integral-racional|fracciones simples]] y desarrollando cada una como una [[fn-series|serie geométrica]] se recupera la fórmula de Binet: las funciones generadoras convierten contar en hacer álgebra con fracciones.');

  p.note('Un problema de contar que es Fibonacci disfrazado: ¿de cuántas maneras se puede subir una escalera de ' +
    '$n$ peldaños, subiendo de uno en uno o de dos en dos? Para llegar al peldaño $n$, el último paso se da desde ' +
    'el $n - 1$ o desde el $n - 2$, así que las maneras cumplen la recurrencia de Fibonacci: 1, 2, 3, 5, 8…', 'ok', 'Contar con recurrencias');

  p.hist('Leonardo de Pisa, llamado Fibonacci, planteó en 1202, en su <em>Liber abaci</em>, un problema sobre ' +
    'conejos que se reproducen cada mes, y de él salió la sucesión. El libro sirvió sobre todo para introducir en ' +
    'Europa los números indo-arábigos. Las funciones generadoras las inventó Abraham de Moivre hacia 1730, ' +
    'precisamente para resolver recurrencias, y la fórmula de Binet, que lleva el nombre de Jacques Binet por un ' +
    'artículo de 1843, ya la conocían de Moivre y Euler un siglo antes.');

  p.util('Cuando un algoritmo resuelve un problema partiéndolo en trozos y llamándose a sí mismo, su coste cumple ' +
    'una recurrencia: ordenar una lista partiéndola en dos mitades cuesta $T(n) = 2\\,T(\\frac{n}{2}) + n$, y de ahí ' +
    'sale que tarda del orden de $n\\log n$ (lo verás en [[av-complejidad]]). Las cuotas de un préstamo cumplen ' +
    '$s_{n+1} = (1 + i)\\,s_n - c$, una recurrencia de orden 1 como las de [[fn-finanzas]].');

  p.trampas([
    { e: 'Tomar $p$ y $q$ como raíces', por: 'Son los coeficientes. Las raíces salen de $x^2 = px + q$; para Fibonacci, $p = q = 1$ y las raíces son $1{,}618$ y $-0{,}618$.' },
    { e: 'Equivocar los signos al pasar la ecuación a un lado', por: '$x^2 = px + q$ se convierte en $x^2 - px - q = 0$. Con $p = 2$, $q = 3$ sale $x^2 - 2x - 3$, no $x^2 + 2x + 3$.' },
    { e: 'Fijar $A$ y $B$ con $a_1$ y $a_2$ en vez de con $a_0$ y $a_1$', por: 'Vale cualquier par de términos, pero hay que sustituir el $n$ correcto en cada uno: $a_2 = A x_1^2 + B x_2^2$, no $A x_1 + B x_2$.' },
    { e: 'Creer que la fórmula de Binet da decimales', por: 'Lleva $\\sqrt 5$ por todas partes y aun así da enteros exactos, porque las partes irracionales se cancelan. Redondeando $\\varphi^n/\\sqrt 5$ se obtiene $F_n$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La ecuación característica',
    level: 'basico',
    gen: function (r) {
      var r1 = r.pm(1, 4), r2 = r.pm(1, 4);
      if (r1 === r2) return null;
      return { r1: Math.min(r1, r2), r2: Math.max(r1, r2), p: r1 + r2, q: -r1 * r2 };
    },
    ask: function (d) {
      var rec = d.p === 0 ? ML.termTex(d.q, 'a_{n-2}', 1, true) : ML.termTex(d.p, 'a_{n-1}', 1, true) + ML.termTex(d.q, 'a_{n-2}', 1, false);
      return 'Una sucesión cumple $a_n = ' + rec + '$. ¿Cuáles son las raíces de su ecuación característica? (Primero la menor.)';
    },
    fields: [{ name: 'x1', label: '$x_1$', w: 'tiny' }, { name: 'x2', label: '$x_2$', w: 'tiny' }],
    sol: function (d) { return { x1: d.r1, x2: d.r2 }; },
    errores: [{ si: function (v, d) { return d.r1 !== -d.r2 && v.x1 === -d.r2 && v.x2 === -d.r1; }, msg: 'Cuidado con los signos: la ecuación característica es $x^2 = px + q$, es decir, $x^2 - px - q = 0$.' }],
    hint: function () { return ['Sustituye $a_n = x^n$ y divide por $x^{n-2}$: $x^2 = px + q$.', 'Pasa todo a un lado y resuelve la ecuación de segundo grado.']; },
    steps: function (d) {
      return ['$x^2 = ' + ML.polyTex([d.p, d.q]) + '$, es decir, $' + ML.polyTex([1, -d.p, -d.q]) + ' = 0$.',
        'Raíces: $x_1 = ' + d.r1 + '$ y $x_2 = ' + d.r2 + '$ (comprueba: suman $' + d.p + '$ y su producto es $' + (-d.q) + '$).'];
    },
    answer: function (d) { return d.r1 + ' y ' + d.r2; }
  });

  p.exercise({
    title: 'Subir una escalera',
    level: 'basico',
    gen: function (r) {
      var n = r.int(4, 14), a = 1, b = 2;
      for (var i = 3; i <= n; i++) { var c = a + b; a = b; b = c; }
      return { n: n, v: b, pot: Math.pow(2, n - 1) };
    },
    ask: function (d) { return '¿De cuántas maneras distintas se puede subir una escalera de ' + d.n + ' peldaños, si en cada paso se sube uno o dos peldaños?'; },
    fields: [{ name: 'v', label: 'maneras', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{ si: function (v, d) { return v.v === d.pot; }, msg: 'Eso contaría todas las formas de partir la escalera en tramos de cualquier longitud. Aquí los pasos solo pueden ser de 1 o de 2.' }],
    hint: function () { return ['Para llegar al peldaño $n$, el último paso sale del $n - 1$ o del $n - 2$.', 'Así que $m_n = m_{n-1} + m_{n-2}$, con $m_1 = 1$ y $m_2 = 2$.']; },
    steps: function (d) {
      var s = [1, 2];
      for (var i = 3; i <= d.n; i++) s.push(s[i - 2] + s[i - 3]);
      return ['$m_n = m_{n-1} + m_{n-2}$, con $m_1 = 1$ y $m_2 = 2$.', 'Valores: $' + s.join(',\\ ') + '$.', 'Para ' + d.n + ' peldaños hay <strong>' + d.v + '</strong> maneras: el término $F_{' + (d.n + 1) + '}$ de Fibonacci.'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'El término general',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pick([2, 3, -1]), x2 = r.pick([1, -2, 4]), A = r.pm(1, 3), B = r.pm(1, 3);
      if (x1 === x2) return null;
      return { x1: x1, x2: x2, A: A, B: B, a0: A + B, a1: A * x1 + B * x2, p: x1 + x2, q: -x1 * x2 };
    },
    ask: function (d) {
      var rec = d.p === 0 ? ML.termTex(d.q, 'a_{n-2}', 1, true) : ML.termTex(d.p, 'a_{n-1}', 1, true) + ML.termTex(d.q, 'a_{n-2}', 1, false);
      return 'La sucesión $a_n = ' + rec + '$, con $a_0 = ' + d.a0 + '$ y $a_1 = ' + d.a1 + '$, tiene como raíces características $x_1 = ' + d.x1 + '$ y $x_2 = ' + d.x2 +
        '$. Halla $A$ y $B$ tales que $a_n = A\\,x_1^n + B\\,x_2^n$.';
    },
    fields: [{ name: 'A', label: '$A$', w: 'tiny' }, { name: 'B', label: '$B$', w: 'tiny' }],
    sol: function (d) { return { A: d.A, B: d.B }; },
    errores: [{ si: function (v, d) { return d.A !== d.B && v.A === d.B && v.B === d.A; }, msg: '$A$ acompaña a $x_1^n$ y $B$ a $x_2^n$: están intercambiados.' }],
    hint: function () { return ['Con $n = 0$: $A + B = a_0$.', 'Con $n = 1$: $A\\,x_1 + B\\,x_2 = a_1$. Resuelve el sistema.']; },
    steps: function (d) {
      return ['$\\begin{cases} A + B = ' + d.a0 + ' \\\\ ' + ML.termTex(d.x1, 'A', 1, true) + ML.termTex(d.x2, 'B', 1, false) + ' = ' + d.a1 + ' \\end{cases}$',
        'Resolviendo: $A = ' + d.A + '$, $B = ' + d.B + '$.',
        'Así, $a_n = ' + d.A + '\\cdot(' + d.x1 + ')^n ' + (d.B < 0 ? '- ' + (-d.B) : '+ ' + d.B) + '\\cdot(' + d.x2 + ')^n$. Comprueba con $n = 2$: $' + (d.A * d.x1 * d.x1 + d.B * d.x2 * d.x2) + '$, que coincide con $' + d.p + '\\cdot ' + d.a1 + ' + (' + d.q + ')\\cdot ' + d.a0 + '$.'];
    },
    answer: function (d) { return 'A = ' + d.A + ', B = ' + d.B; }
  });

  p.exercise({
    title: 'El cociente de Fibonacci',
    level: 'medio',
    gen: function (r) {
      var n = r.int(5, 14), F = [0, 1];
      for (var i = 2; i <= n + 1; i++) F.push(F[i - 1] + F[i - 2]);
      var c = F[n + 1] / F[n], phi = (1 + Math.sqrt(5)) / 2;
      return { n: n, Fn: F[n], Fn1: F[n + 1], c: c, lado: c > phi ? 'encima' : 'debajo' };
    },
    ask: function (d) {
      return 'Con $F_0 = 0$ y $F_1 = 1$, se tiene $F_{' + d.n + '} = ' + d.Fn + '$ y $F_{' + (d.n + 1) + '} = ' + d.Fn1 + '$. Calcula el cociente $\\frac{F_{' + (d.n + 1) + '}}{F_{' + d.n +
        '}}$ con seis decimales. ¿Queda por encima o por debajo del número de oro, $\\varphi \\approx 1{,}618034$?';
    },
    fields: [{ name: 'c', label: 'cociente', w: 'wide' }, { name: 't', label: 'Queda', opts: [{ t: 'por encima de φ', v: 'encima' }, { t: 'por debajo de φ', v: 'debajo' }] }],
    sol: function (d) { return { c: U.round(d.c, 8), t: d.lado }; },
    tol: 2e-6,
    hint: function () { return ['Divide.', 'Por la fórmula de Binet, el error lleva el signo de $\\psi^n$, que es negativo: el cociente se alterna por encima y por debajo.']; },
    steps: function (d) {
      return ['$\\dfrac{' + d.Fn1 + '}{' + d.Fn + '} \\approx ' + U.fmt(d.c, 6) + '$', 'Queda ' + (d.lado === 'encima' ? 'por encima' : 'por debajo') + ' de $\\varphi$, a una distancia de $' + U.fmt(Math.abs(d.c - (1 + Math.sqrt(5)) / 2), 7) + '$.',
        'Con $n$ par el cociente queda por encima, y con $n$ impar, por debajo: se va acercando alternando lados.'];
    },
    answer: function (d) { return U.fmt(d.c, 6) + ', por ' + d.lado; }
  });

  p.keys([
    'Una recurrencia lineal $a_n = p\\,a_{n-1} + q\\,a_{n-2}$ se resuelve probando $a_n = x^n$: sale la ecuación característica $x^2 = px + q$.',
    'Con raíces distintas, $a_n = A\\,x_1^n + B\\,x_2^n$, y $A$ y $B$ salen de los dos valores iniciales.',
    'Las raíces características son los autovalores de la matriz de la recurrencia; la de mayor valor absoluto domina a largo plazo.',
    'Fibonacci: $F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt 5}$, y $\\frac{F_{n+1}}{F_n} \\to \\varphi$.',
    'Una función generadora guarda la sucesión en los coeficientes de una serie y convierte la recurrencia en álgebra.'
  ]);
});
