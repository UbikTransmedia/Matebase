/* Tema: Integrales dobles y triples */
Course.topic('av-integrales-multiples', function (p) {

  p.puente('La [[fn-integral-def|integral definida]] suma infinitos rectángulos muy estrechos bajo una curva y da un ' +
    'área. Si en lugar de una curva hay una superficie, $z = f(x, y)$, sobre una región del plano, la misma idea suma ' +
    'infinitos prismas muy finos y da un <strong>volumen</strong>. Es la integral doble, y con ella se calculan masas, ' +
    'centros de gravedad, probabilidades de sucesos con dos variables y, con un truco precioso, una integral de una ' +
    'variable que nadie sabe calcular de otra forma.');

  /* ---------------------------------------------------------------- */
  p.section('Integrales iteradas y teorema de Fubini');

  p.formula('\\iint_R f(x, y)\\,dA \\approx \\sum_{i}\\sum_{j} f(x_i, y_j)\\,\\Delta x\\,\\Delta y',
    'la integral doble como suma de prismas',
    'La región $R$ se divide en casillas de lados $\\Delta x$ y $\\Delta y$. Cada prisma tiene como base una casilla y como ' +
    'altura el valor de $f$ en un punto de ella. Al hacer las casillas cada vez más pequeñas, la suma tiende a la integral.');

  p.text('Calcular esa suma es más fácil de lo que parece. Si se suman primero todos los prismas de una misma columna, ' +
    'con $x$ fija, se obtiene una integral de una variable en $y$; y luego se suman las columnas. El ' +
    '<strong>teorema de Fubini</strong> garantiza que, para funciones continuas en un rectángulo, da igual por qué ' +
    'variable se empiece:');

  p.formula('\\iint_{[a, b]\\times[c, d]} f(x, y)\\,dA = \\int_a^b\\left(\\int_c^d f(x, y)\\,dy\\right)dx = \\int_c^d\\left(\\int_a^b f(x, y)\\,dx\\right)dy',
    'el teorema de Fubini',
    'En la integral de dentro, la otra variable se trata como una constante, igual que en una [[av-vectorial|derivada parcial]].<br><br>' +
    'Por ejemplo, $\\int_0^2\\int_0^1 xy\\,dy\\,dx = \\int_0^2 \\frac{x}{2}\\,dx = 1$.<br><br>Si la región no es un rectángulo, ' +
    'los límites de la integral de dentro dependen de la variable de fuera: sobre el triángulo $0 \\le y \\le x \\le 1$, ' +
    '$\\int_0^1\\int_0^x f\\,dy\\,dx$.');

  p.comprueba('$\\displaystyle\\int_0^1\\int_0^2 x\\,dx\\,dy$. ¿Cuánto vale?', [
    { t: '$2$', ok: true, por: 'Dentro, $\\int_0^2 x\\,dx = 2$. Fuera, $\\int_0^1 2\\,dy = 2$. Es el volumen bajo el plano $z = x$ sobre el rectángulo $[0, 2]\\times[0, 1]$.' },
    { t: '$1$', ok: false, por: 'Sería $\\int_0^1 x\\,dx\\cdot\\int_0^2 dy$ con los límites cambiados de sitio. El $dx$ va con el límite 2 y el $dy$ con el 1: hay que leer qué diferencial acompaña a cada integral.' },
    { t: '$\\frac{1}{2}$', ok: false, por: 'Falta la integral de fuera: $\\int_0^2 x\\,dx = 2$, no $\\frac{1}{2}$, y luego se integra esa constante en $y$ entre 0 y 1.' }
  ]);

  p.ejemplo({
    title: 'Un triángulo en los dos órdenes',
    enunciado: 'Calcular $\\displaystyle\\iint_T (x + y)\\,dA$ sobre el triángulo $T = \\{0 \\le y \\le x \\le 1\\}$, integrando primero en $y$ y después al revés.',
    pasos: [
      { t: '<strong>Dibujar la región.</strong> Vértices $(0, 0)$, $(1, 0)$ y $(1, 1)$: el triángulo bajo la diagonal $y = x$. Para cada $x$ entre 0 y 1, la $y$ va de 0 hasta la diagonal, $x$.', antes: 'Dibuja el triángulo. Fijado un $x$, ¿entre qué valores se mueve $y$?' },
      { t: '<strong>Primero en $y$.</strong> $\\displaystyle\\int_0^x (x + y)\\,dy = \\left[xy + \\frac{y^2}{2}\\right]_0^x = x^2 + \\frac{x^2}{2} = \\frac{3x^2}{2}$. La $x$ se ha tratado como constante.' },
      { t: '<strong>Después en $x$.</strong> $\\displaystyle\\int_0^1 \\frac{3x^2}{2}\\,dx = \\frac{1}{2}$.' },
      { t: '<strong>Al revés: primero en $x$.</strong> Fijado un $y$ entre 0 y 1, la $x$ va desde la diagonal, $y$, hasta 1: $\\displaystyle\\int_y^1 (x + y)\\,dx = \\left[\\frac{x^2}{2} + xy\\right]_y^1 = \\frac{1}{2} + y - \\frac{y^2}{2} - y^2 = \\frac{1}{2} + y - \\frac{3y^2}{2}$.', antes: 'Ahora fija $y$. ¿Entre qué valores se mueve $x$? Los límites cambian.' },
      { t: '<strong>Y en $y$.</strong> $\\displaystyle\\int_0^1 \\left(\\frac{1}{2} + y - \\frac{3y^2}{2}\\right)dy = \\frac{1}{2} + \\frac{1}{2} - \\frac{1}{2} = \\frac{1}{2}$ ✓. Lo mismo, por Fubini.' }
    ],
    cierre: 'Los dos órdenes dan $\\frac{1}{2}$, pero los límites de dentro son distintos: $0 \\le y \\le x$ en uno, $y \\le x \\le 1$ en el otro. Elegir el orden es elegir cuál de los dos es más cómodo, y a veces uno es imposible y el otro trivial.'
  });

  p.demo({
    title: 'Sumar prismas',
    intro: 'La región se divide en n × n casillas. En cada una se toma el valor de la función en el centro como altura de un prisma, y se suma su volumen. El color de cada casilla indica su altura. Sube n y mira cómo la suma se acerca a la integral exacta.',
    predice: 'Con $n = 1$ hay un solo prisma con la altura del centro. Para $f = xy$, ¿la suma saldrá por encima o por debajo de la integral exacta, 1? ¿Y para $x^2 + y^2$?',
    build: function (host) {
      var cual = 'xy', n = 4;
      var F = {
        xy: { t: '$f(x, y) = xy$ en $[0, 2]\\times[0, 1]$', f: function (x, y) { return x * y; }, a: 0, b: 2, c: 0, d: 1, ex: 1, max: 2 },
        cuad: { t: '$f(x, y) = x^2 + y^2$ en $[0, 1]\\times[0, 1]$', f: function (x, y) { return x * x + y * y; }, a: 0, b: 1, c: 0, d: 1, ex: 2 / 3, max: 2 },
        trig: { t: '$f(x, y) = \\operatorname{sen} x\\cos y$ en $[0, \\frac{\\pi}{2}]^2$', f: function (x, y) { return Math.sin(x) * Math.cos(y); }, a: 0, b: Math.PI / 2, c: 0, d: Math.PI / 2, ex: 1, max: 1 }
      };
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -0.2, xmax: 2.2, ymin: -0.2, ymax: 1.2, height: 300,
        aria: 'La región de integración dividida en casillas, coloreadas según el valor de la función',
        draw: function (g) {
          var e = F[cual], dx = (e.b - e.a) / n, dy = (e.d - e.c) / n;
          for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
            var v = e.f(e.a + (i + 0.5) * dx, e.c + (j + 0.5) * dy) / e.max;
            g.rect(e.a + i * dx, e.c + j * dy, dx, dy, { fill: true, color: 0, fillAlpha: 0.06 + 0.8 * Math.max(0, v), w: 0.8 });
          }
        }
      });
      function pinta() {
        var e = F[cual], dx = (e.b - e.a) / n, dy = (e.d - e.c) / n, s = 0;
        for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) s += e.f(e.a + (i + 0.5) * dx, e.c + (j + 0.5) * dy) * dx * dy;
        plot.view(e.a - 0.2, e.b + 0.2, e.c - 0.2, e.d + 0.2);
        out.set(e.t + ' &nbsp;·&nbsp; suma de ' + (n * n) + ' prismas: <strong>' + U.fmt(s, 5) + '</strong> &nbsp;·&nbsp; integral exacta: $' + U.fmt(e.ex, 5) + '$ &nbsp;·&nbsp; error: ' + U.fmt(Math.abs(s - e.ex), 5));
      }
      W.chips(host, [{ label: 'xy', value: 'xy' }, { label: 'x² + y²', value: 'cuad' }, { label: 'sen x · cos y', value: 'trig' }], { value: cual, on: function (v) { cual = v; pinta(); } });
      W.slider(W.row(host), { label: 'casillas por lado n', min: 1, max: 30, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cambio a polares, cilíndricas y esféricas');

  p.text('Integrar sobre un círculo con $x$ e $y$ es incómodo: los límites de la integral de dentro llevan raíces. En ' +
    '[[gfx-coordenadas|coordenadas polares]], $x = r\\cos\\theta$, $y = r\\operatorname{sen}\\theta$, un círculo es simplemente ' +
    '$0 \\le r \\le R$, $0 \\le \\theta \\le 2\\pi$. Pero hay que tener cuidado con el tamaño de las casillas: una casilla ' +
    'polar no mide $\\Delta r\\,\\Delta\\theta$, porque se ensancha al alejarse del centro.');

  p.formulas([
    'dA = r\\,dr\\,d\\theta \\qquad \\text{(polares)}',
    'dV = r\\,dr\\,d\\theta\\,dz \\qquad \\text{(cilíndricas)}',
    'dV = \\rho^2\\operatorname{sen}\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta \\qquad \\text{(esféricas)}'
  ], 'los elementos de área y de volumen',
    'El factor que aparece, $r$ o $\\rho^2\\operatorname{sen}\\varphi$, es el <strong>jacobiano</strong>: el valor absoluto del ' +
    '[[al-determinantes|determinante]] de la matriz de derivadas del cambio de coordenadas. Mide cuánto estira el cambio ' +
    'las áreas o los volúmenes.<br><br>Con él, el área de un círculo sale en una línea: $\\int_0^{2\\pi}\\int_0^R r\\,dr\\,d\\theta = 2\\pi\\cdot\\frac{R^2}{2} = \\pi R^2$.');

  p.demo({
    title: 'Por qué aparece la r',
    intro: 'Una casilla polar está entre dos radios y dos ángulos. No es un rectángulo: cuanto más lejos del centro, más ancha. Su área es casi r·Δr·Δθ, y esa r mide el ensanchamiento. Aleja la casilla del centro y compara el área exacta con la aproximación, y con lo que saldría olvidando la r.',
    predice: 'Si duplicas la distancia al centro $r$ sin tocar $\\Delta r$ ni $\\Delta\\theta$, ¿el área de la casilla se duplicará, se cuadruplicará o no cambiará?',
    build: function (host) {
      var r = 2, dr = 0.5, dth = 30, th0 = 20;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -0.5, xmax: 5, ymin: -0.5, ymax: 4.2, height: 300,
        aria: 'Una casilla en coordenadas polares, delimitada por dos radios y dos arcos de circunferencia',
        draw: function (g) {
          var a0 = th0 * Math.PI / 180, a1 = (th0 + dth) * Math.PI / 180, pts = [], k;
          for (k = 0; k <= 30; k++) { var a = a0 + (a1 - a0) * k / 30; pts.push([r * Math.cos(a), r * Math.sin(a)]); }
          for (k = 30; k >= 0; k--) { var b = a0 + (a1 - a0) * k / 30; pts.push([(r + dr) * Math.cos(b), (r + dr) * Math.sin(b)]); }
          g.poly(pts, { color: 0, fillAlpha: 0.25, w: 2 });
          g.seg(0, 0, 4.8 * Math.cos(a0), 4.8 * Math.sin(a0), { color: 'axis', dash: [4, 4], w: 1 });
          g.seg(0, 0, 4.8 * Math.cos(a1), 4.8 * Math.sin(a1), { color: 'axis', dash: [4, 4], w: 1 });
          g.arc(0, 0, r, a0, a1, { color: 1, w: 1.4 });
          g.point(0, 0, { color: 'ink', r: 4 });
        }
      });
      function pinta() {
        var t = dth * Math.PI / 180, exacta = 0.5 * ((r + dr) * (r + dr) - r * r) * t;
        out.set('Área exacta: $\\frac{1}{2}\\bigl((r + \\Delta r)^2 - r^2\\bigr)\\Delta\\theta = ' + U.fmt(exacta, 4) + '$ &nbsp;·&nbsp; $r\\,\\Delta r\\,\\Delta\\theta = ' + U.fmt(r * dr * t, 4) +
          '$ &nbsp;·&nbsp; sin la $r$: $\\Delta r\\,\\Delta\\theta = ' + U.fmt(dr * t, 4) + '$');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'distancia al centro r', min: 0.1, max: 3.5, step: 0.05, value: r, on: function (v) { r = v; pinta(); } });
      W.slider(fila, { label: 'Δr', min: 0.05, max: 1, step: 0.05, value: dr, on: function (v) { dr = v; pinta(); } });
      W.slider(fila, { label: 'Δθ (°)', min: 2, max: 60, step: 1, value: dth, on: function (v) { dth = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La integral de Gauss');

  p.text('La función $e^{-x^2}$, la forma de la [[pe-normal|campana de Gauss]], no tiene una primitiva que se pueda ' +
    'escribir con funciones conocidas. Aun así, el área bajo toda la campana se puede calcular exactamente, con un ' +
    'truco que parece hacer trampa: en lugar de calcular la integral, se calcula <strong>su cuadrado</strong>, que es una ' +
    'integral doble, y esa se resuelve en polares.');

  p.formula('I^2 = \\int_{-\\infty}^{\\infty} e^{-x^2}dx\\int_{-\\infty}^{\\infty} e^{-y^2}dy = \\iint_{\\mathbb R^2} e^{-(x^2 + y^2)}\\,dA = \\int_0^{2\\pi}\\int_0^{\\infty} e^{-r^2}\\,r\\,dr\\,d\\theta = \\pi',
    'la integral de Gauss: I = √π',
    'El producto de las dos integrales es la integral doble de $e^{-x^2}e^{-y^2} = e^{-(x^2 + y^2)}$ sobre todo el plano.<br><br>' +
    'En polares, $x^2 + y^2 = r^2$, y el factor $r$ del jacobiano es justo lo que hacía falta: $e^{-r^2}r$ sí tiene primitiva, ' +
    '$-\\frac{1}{2}e^{-r^2}$. La integral en $r$ vale $\\frac{1}{2}$, y la de $\\theta$, $2\\pi$.<br><br>Por eso $I = \\sqrt{\\pi}$, y ' +
    'por eso en la densidad de la distribución normal aparece $\\frac{1}{\\sqrt{2\\pi}}$.');

  p.hist('Guido Fubini publicó en 1907 el teorema que permite cambiar el orden de integración con toda generalidad, ' +
    'aunque los matemáticos llevaban siglos haciéndolo sin preocuparse demasiado. La integral de Gauss la calculó ' +
    'Laplace en 1774, y el truco de elevarla al cuadrado y pasar a polares se atribuye a Poisson. Gauss la usó en 1809 ' +
    'al estudiar los errores de las observaciones astronómicas, y de ahí le viene el nombre a la campana.');

  p.util('Con integrales dobles y triples se calculan la masa de una pieza cuya densidad varía, su centro de gravedad y ' +
    'su momento de inercia, que decide cuánto cuesta hacerla girar. Los programas de diseño industrial lo hacen ' +
    'automáticamente con cada pieza, y los escáneres de tomografía reconstruyen el interior del cuerpo invirtiendo ' +
    'integrales de la densidad de los tejidos a lo largo de miles de rectas.');

  p.note('Hay una integral que se calcula así y se ve: la de la luz que atraviesa una nube. El color de ' +
    'cada píxel es la integral, a lo largo del rayo que entra en el ojo, de lo que cada trocito de ' +
    'volumen aporta y de lo que tapa lo que hay detrás. En ' +
    '[[gfx-nubes|la luz dentro de un volumen]] esa integral se aproxima por pasos —que es la suma de ' +
    'Riemann de toda la vida— y el resultado se mira en pantalla.', null, 'Una integral que se mira');

  p.trampas([
    { e: 'Integrar en $y$ y olvidar que $x$ sigue en el resultado', por: '$\\int_0^b x\\,dy = bx$, no $x$: la constante $x$ se multiplica por la longitud del intervalo.' },
    { e: 'Usar los límites del rectángulo en una región que no lo es', por: 'Sobre el triángulo $0 \\le y \\le x$, la $y$ de dentro llega hasta $x$, no hasta 1. Los límites de dentro dependen de la variable de fuera.' },
    { e: 'Cambiar a polares sin la $r$', por: '$dA = r\\,dr\\,d\\theta$. Sin la $r$ el área del círculo saldría $2\\pi R$, que es la longitud de la circunferencia.' },
    { e: 'Poner el ángulo en grados dentro de la integral', por: 'La integral en $\\theta$ mide longitudes de arco, y eso exige radianes: $90^\\circ = \\frac{\\pi}{2}$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Una integral doble en un rectángulo',
    level: 'basico',
    gen: function (r) {
      var a = r.int(1, 3), b = r.int(1, 2), pp = r.int(1, 3), q = r.int(1, 3);
      return { a: a, b: b, p: pp, q: q, v: ML.F(pp * a * a * b + q * a * b * b, 2), mal: ML.F(pp * a * a + q * b * b, 2) };
    },
    ask: function (d) { return 'Calcula $\\displaystyle\\iint_R (' + ML.termTex(d.p, 'x', 1, true) + ML.termTex(d.q, 'y', 1, false) + ')\\,dA$ sobre el rectángulo $R = [0, ' + d.a + ']\\times[0, ' + d.b + ']$. (Fracción.)'; },
    fields: [{ name: 'v', label: 'integral', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return !d.mal.eq(d.v) && Math.abs(v.v - d.mal.val()) < 1e-9; }, msg: 'Falta integrar cada término en la otra variable: al integrar $' + 'x$ respecto de $y$ entre 0 y $b$, sale $bx$, no $x$.' }],
    hint: function () { return ['Integra primero en $y$, tratando $x$ como constante.', 'Después integra el resultado en $x$.']; },
    steps: function (d) {
      return ['$\\displaystyle\\int_0^{' + d.b + '} (' + ML.termTex(d.p, 'x', 1, true) + ML.termTex(d.q, 'y', 1, false) + ')\\,dy = ' + ML.termTex(d.p * d.b, 'x', 1, true) + ' + ' + ML.F(d.q * d.b * d.b, 2).tex() + '$',
        '$\\displaystyle\\int_0^{' + d.a + '} \\left(' + ML.termTex(d.p * d.b, 'x', 1, true) + ' + ' + ML.F(d.q * d.b * d.b, 2).tex() + '\\right)dx = ' + ML.F(d.p * d.b * d.a * d.a, 2).tex() + ' + ' + ML.F(d.q * d.b * d.b * d.a, 2).tex() + ' = ' + d.v.tex() + '$'];
    },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.exercise({
    title: 'Una región triangular',
    level: 'medio',
    gen: function (r) { var a = r.pick([1, 2, 3, 6]); return { a: a, v: ML.F(a * a * a, 6), mal: ML.F(a * a * a, 2) }; },
    ask: function (d) { return 'Calcula $\\displaystyle\\iint_T y\\,dA$ sobre el triángulo $T = \\{(x, y) : 0 \\le y \\le x \\le ' + d.a + '\\}$. (Fracción.)'; },
    fields: [{ name: 'v', label: 'integral', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.mal.val()) < 1e-9; }, msg: 'Esa es la integral sobre el cuadrado entero. En el triángulo, para cada $x$, la $y$ solo llega hasta $x$.' }],
    hint: function (d) { return ['Para cada $x$ entre 0 y ' + d.a + ', la $y$ va de 0 a $x$.', '$\\int_0^{' + d.a + '}\\left(\\int_0^x y\\,dy\\right)dx$.']; },
    steps: function (d) { return ['$\\displaystyle\\int_0^x y\\,dy = \\frac{x^2}{2}$', '$\\displaystyle\\int_0^{' + d.a + '} \\frac{x^2}{2}\\,dx = \\frac{' + d.a + '^3}{6} = ' + d.v.tex() + '$']; },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.exercise({
    title: 'Área en polares',
    level: 'medio',
    gen: function (r) {
      var r1 = r.int(1, 2), r2 = r1 + r.int(1, 2), th = r.pick([30, 45, 60, 90, 120]), t = th * Math.PI / 180;
      return { r1: r1, r2: r2, th: th, v: 0.5 * (r2 * r2 - r1 * r1) * t, sinR: (r2 - r1) * t, grados: 0.5 * (r2 * r2 - r1 * r1) * th };
    },
    ask: function (d) { return 'Calcula el área de la región $' + d.r1 + ' \\le r \\le ' + d.r2 + '$, $0 \\le \\theta \\le ' + d.th + '^\\circ$ con una integral en polares. (Tres decimales.)'; },
    fields: [{ name: 'v', label: 'área', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 1e-3,
    errores: [
      { si: function (v, d) { return Math.abs(v.v - d.sinR) < 5e-4; }, msg: 'Falta el jacobiano: el elemento de área en polares es $r\\,dr\\,d\\theta$, no $dr\\,d\\theta$.' },
      { si: function (v, d) { return Math.abs(v.v - d.grados) < 5e-4; }, msg: 'El ángulo tiene que ir en <strong>radianes</strong> dentro de la integral.' }
    ],
    hint: function () { return ['$\\displaystyle\\int_0^{\\theta}\\int_{r_1}^{r_2} r\\,dr\\,d\\theta$, con el ángulo en radianes.']; },
    steps: function (d) {
      return ['$\\displaystyle\\int_{' + d.r1 + '}^{' + d.r2 + '} r\\,dr = \\frac{' + d.r2 + '^2 - ' + d.r1 + '^2}{2} = ' + ML.F(d.r2 * d.r2 - d.r1 * d.r1, 2).tex() + '$',
        '$' + d.th + '^\\circ = ' + ML.F(d.th, 180).tex() + '\\pi$ rad, así que el área es $' + ML.F(d.r2 * d.r2 - d.r1 * d.r1, 2).tex() + '\\cdot ' + ML.F(d.th, 180).tex() + '\\pi \\approx ' + U.fmt(d.v, 3) + '$'];
    },
    answer: function (d) { return U.fmt(d.v, 3); }
  });

  p.exercise({
    title: 'La integral de Gauss con un parámetro',
    level: 'avanzado',
    gen: function (r) { var a = r.pick([2, 4, 0.5, 9, 16]); return { a: a, v: Math.sqrt(Math.PI / a), mal: Math.sqrt(Math.PI) / a }; },
    ask: function (d) { return 'Sabiendo que $\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}$, calcula $\\displaystyle\\int_{-\\infty}^{\\infty} e^{-' + U.fmt(d.a, 1) + 'x^2}\\,dx$. (Cuatro decimales.)'; },
    fields: [{ name: 'v', label: 'integral', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 8) }; },
    tol: 2e-4,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.mal) < 2e-4; }, msg: 'Con el cambio $u = \\sqrt{a}\\,x$, $dx = \\frac{du}{\\sqrt a}$: se divide por $\\sqrt a$, no por $a$.' }],
    hint: function () { return ['Haz el cambio de variable $u = \\sqrt{a}\\,x$.', 'Entonces $dx = \\frac{du}{\\sqrt{a}}$ y la integral queda $\\frac{1}{\\sqrt a}\\int e^{-u^2}du$.']; },
    steps: function (d) { return ['$u = \\sqrt{' + U.fmt(d.a, 1) + '}\\,x$, $dx = \\dfrac{du}{\\sqrt{' + U.fmt(d.a, 1) + '}}$', '$\\dfrac{1}{\\sqrt{' + U.fmt(d.a, 1) + '}}\\sqrt{\\pi} = \\sqrt{\\dfrac{\\pi}{' + U.fmt(d.a, 1) + '}} \\approx ' + U.fmt(d.v, 4) + '$']; },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.keys([
    'La integral doble suma prismas bajo una superficie: $\\iint_R f\\,dA$ es un volumen.',
    'Fubini: se calcula como dos integrales de una variable seguidas, y en un rectángulo el orden no importa.',
    'En regiones no rectangulares, los límites de la integral de dentro dependen de la variable de fuera.',
    'Al cambiar de coordenadas aparece el jacobiano: $dA = r\\,dr\\,d\\theta$ en polares y $dV = \\rho^2\\operatorname{sen}\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$ en esféricas.',
    'Elevando al cuadrado y pasando a polares: $\\int_{-\\infty}^{\\infty} e^{-x^2}dx = \\sqrt{\\pi}$.'
  ]);
});
