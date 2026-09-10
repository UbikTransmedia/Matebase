/* Tema: Ángulos, distancias, proyecciones y simétricos */
Course.topic('ge-metrico', function (p) {

  /* utilidades del tema */
  function cruz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function esc(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function mod(a) { return Math.sqrt(esc(a, a)); }
  function suma(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function resta(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function por(k, a) { return [k * a[0], k * a[1], k * a[2]]; }
  function nulo(a) { return !a[0] && !a[1] && !a[2]; }
  function vt(a) { return '(' + a.map(function (x) { return U.fmt(x, 4); }).join(',\\ ') + ')'; }
  function grados(rad) { return rad * 180 / Math.PI; }
  function planoTex(n, D) {
    var s = ML.termTex(n[0], 'x', 1, true);
    s += ML.termTex(n[1], 'y', 1, s === '');
    s += ML.termTex(n[2], 'z', 1, s === '');
    s += ML.termTex(D, '', 0, s === '');
    return (s || '0') + ' = 0';
  }
  function paramTex(P, v, par) {
    par = par || '\\lambda';
    return '\\begin{cases} x = ' + P[0] + ML.termTex(v[0], par, 1, false) + ' \\\\ y = ' + P[1] +
      ML.termTex(v[1], par, 1, false) + ' \\\\ z = ' + P[2] + ML.termTex(v[2], par, 1, false) + '\\end{cases}';
  }

  p.text('Con rectas y planos escritos en ecuaciones, este tema responde a las preguntas de medir: qué ' +
    'ángulo forman, a qué distancia están, dónde cae la sombra de un punto, dónde está su reflejo. Son ' +
    'muchas fórmulas en apariencia, pero todas salen de una sola idea que conviene tener grabada: ' +
    '<strong>la distancia más corta se mide siempre en perpendicular</strong>, y en perpendicular ' +
    'quiere decir con el producto escalar valiendo cero.');

  /* ---------------------------------------------------------------- */
  p.section('Ángulos');

  p.text('El ángulo entre dos rectas, dos planos o una recta y un plano se toma siempre entre 0° y 90°: ' +
    'dos rectas que se cortan forman dos ángulos suplementarios, y se da el pequeño. Por eso las ' +
    'fórmulas llevan <strong>valor absoluto</strong> en el producto escalar.');

  p.formulas([
    '\\cos\\alpha(r, s) = \\frac{|\\vec{u}\\cdot\\vec{v}|}{|\\vec{u}|\\,|\\vec{v}|}',
    '\\cos\\alpha(\\pi_1, \\pi_2) = \\frac{|\\vec{n}_1\\cdot\\vec{n}_2|}{|\\vec{n}_1|\\,|\\vec{n}_2|}',
    '\\operatorname{sen}\\alpha(r, \\pi) = \\frac{|\\vec{v}\\cdot\\vec{n}|}{|\\vec{v}|\\,|\\vec{n}|}'
  ], 'ángulos entre rectas y planos',
    'Las dos primeras son la fórmula del ángulo entre dos vectores, con los directores de las rectas o ' +
      'con las normales de los planos: dos planos forman el mismo ángulo que sus normales.<br><br>La ' +
      'tercera lleva <strong>seno</strong>, no coseno, y es el error más repetido del tema. El producto ' +
      'escalar da el ángulo entre la recta y la <em>normal</em> del plano, y ese ángulo es el ' +
      'complementario del que la recta forma con el plano: si la recta es perpendicular al plano, forma ' +
      '0° con la normal y 90° con el plano.');

  /* ---------------------------------------------------------------- */
  p.section('Proyecciones y simétricos');

  p.text('Proyectar un punto $P$ sobre un plano $\\pi$ es dejar caer una perpendicular desde $P$ hasta ' +
    'el plano: el pie $Q$ es la proyección. Y el <strong>simétrico</strong> $P\'$ es el punto que queda ' +
    'al otro lado, a la misma distancia: $Q$ es el punto medio de $P$ y $P\'$.');

  p.list([
    '<strong>Proyección de un punto sobre un plano</strong>: se traza la recta que pasa por $P$ con dirección $\\vec{n}$ y se corta con el plano.',
    '<strong>Proyección de un punto sobre una recta</strong>: se traza el plano que pasa por $P$ con normal $\\vec{u}$ (el director de la recta) y se corta con la recta.',
    '<strong>Simétrico</strong>: una vez hallada la proyección $Q$, $P\' = 2Q - P$.'
  ], true);

  p.formula('Q = P - \\frac{\\vec{n}\\cdot P + D}{|\\vec{n}|^2}\\,\\vec{n}, \\qquad P\' = 2Q - P',
    'proyección sobre el plano Ax + By + Cz + D = 0 y simétrico',
    'Es el procedimiento anterior hecho de una vez. La fracción es el valor del parámetro $\\lambda$ en ' +
      'el que la recta perpendicular choca con el plano.<br><br>Se dice: <em>«cu es pe menos ene ' +
      'escalar pe más de, partido por el módulo de ene al cuadrado, por ene»</em>.<br><br>No hace ' +
      'falta memorizarla: en un examen se valora más el procedimiento de tres pasos, que además ' +
      'funciona igual para proyectar sobre una recta.');

  p.demo({
    title: 'La sombra y el reflejo de un punto',
    intro: 'Mueve el punto P. El segmento de puntos es la perpendicular al plano: el pie Q es la proyección y P′ el simétrico. Gira el dibujo para comprobar que P, Q y P′ están alineados en perpendicular.',
    build: function (host) {
      var n = [1, 1, 2], D = -2, P = [2, 1, 3];
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 4, height: 380,
        aria: 'Un plano, un punto P, su proyección Q sobre el plano y su simétrico P prima al otro lado',
        draw: function (g) {
          var t = (esc(n, P) + D) / esc(n, n);
          var Q = resta(P, por(t, n)), P2 = resta(por(2, Q), P);
          g.plano(n, D, { color: 0, fillAlpha: 0.14, w: 0.9 });
          g.seg(P, P2, { color: 3, dash: [6, 4], w: 2 });
          g.punto(Q, { color: 2, label: 'Q' });
          g.punto(P, { color: 1, label: 'P' });
          g.punto(P2, { color: 4, label: 'P′' });
        }
      });
      function pinta() {
        var t = (esc(n, P) + D) / esc(n, n);
        var Q = resta(P, por(t, n)), P2 = resta(por(2, Q), P);
        out.set('$\\pi:\\ ' + planoTex(n, D) + '$, &nbsp; $P = (' + P.join(',\\ ') + ')$<br>' +
          'Recta perpendicular: $P + \\lambda\\vec n$; choca con el plano en $\\lambda = ' + U.fmt(-t, 4) + '$<br>' +
          '$Q = ' + vt(Q) + '$ &nbsp;·&nbsp; $P\' = 2Q - P = ' + vt(P2) + '$<br>' +
          'Distancia de $P$ al plano: $|PQ| = ' + U.fmt(Math.abs(esc(n, P) + D) / mod(n), 4) + '$');
        vista.render();
      }
      var fila = W.row(host);
      ['x', 'y', 'z'].forEach(function (nom, i) {
        W.slider(fila, { label: 'P: ' + nom, min: -3, max: 3, step: 0.5, value: P[i], on: function (x) { P[i] = x; pinta(); } });
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Distancias');

  p.formulas([
    'd(P, \\pi) = \\frac{|Ap_1 + Bp_2 + Cp_3 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
    'd(P, r) = \\frac{\\left|\\overrightarrow{AP}\\times\\vec{u}\\right|}{|\\vec{u}|}',
    'd(r, s) = \\frac{\\left|[\\overrightarrow{AB},\\ \\vec{u},\\ \\vec{v}]\\right|}{|\\vec{u}\\times\\vec{v}|} \\quad \\text{(rectas que se cruzan)}'
  ], 'las tres distancias que hay que saber',
    '<strong>Punto y plano</strong>: se sustituye el punto en la ecuación, se toma valor absoluto y se ' +
      'divide por el módulo de la normal.<br><br><strong>Punto y recta</strong> ($A$ es un punto de la ' +
      'recta y $\\vec u$ su director): el producto vectorial da el área del paralelogramo de lados ' +
      '$\\overrightarrow{AP}$ y $\\vec u$; dividida por la base $|\\vec u|$, queda la altura, que es la ' +
      'distancia.<br><br><strong>Rectas que se cruzan</strong> ($A \\in r$, $B \\in s$): el producto ' +
      'mixto es el volumen del paralelepípedo; dividido por el área de la base $|\\vec u\\times\\vec v|$, ' +
      'queda la altura. Las tres son la misma idea: <em>volumen o área entre base es altura</em>.');

  p.text('Y los casos que quedan se reducen a estos: la distancia entre una recta y un plano paralelos, ' +
    'o entre dos planos paralelos, es la distancia desde un punto cualquiera de uno al otro. Si las ' +
    'rectas o los planos se cortan, la distancia es cero.');

  p.note('Para la distancia entre dos planos paralelos hay un atajo: con las ecuaciones escritas con la ' +
    'misma normal, $Ax+By+Cz+D_1=0$ y $Ax+By+Cz+D_2=0$, la distancia es $\\frac{|D_1 - D_2|}{|\\vec n|}$. ' +
    'Pero <strong>solo</strong> si la normal es exactamente la misma: si una ecuación es la otra ' +
    'multiplicada por 2, hay que igualar antes los coeficientes. Saltarse eso es un fallo clásico.',
    'warn', 'Planos paralelos: primero, igualar las normales');

  p.sub('La perpendicular común');
  p.text('Dos rectas que se cruzan tienen exactamente una recta que las corta a las dos ' +
    'perpendicularmente: la <strong>perpendicular común</strong>. El segmento que va de una a otra ' +
    'por ella es el camino más corto, y su longitud es la distancia entre las rectas. Se halla con ' +
    'el método más directo: un punto genérico de cada recta, $X = A + \\lambda\\vec u$ e ' +
    '$Y = B + \\mu\\vec v$, y se obliga a que $\\overrightarrow{XY}$ sea perpendicular a los dos ' +
    'directores. Sale un sistema 2×2 en $\\lambda$ y $\\mu$.');

  p.demo({
    title: 'El camino más corto entre dos rectas que se cruzan',
    intro: 'Mueve la recta s. El segmento naranja es la perpendicular común: une los dos puntos más cercanos y es perpendicular a las dos rectas. Su longitud es la distancia, y coincide con la fórmula del producto mixto.',
    build: function (host) {
      var A = [-1, 0, -1], u = [1, 1, 0];
      var sb = 1.5, giro = 90;
      var out = W.readout(host, '');
      function datos() {
        var a = giro * Math.PI / 180;
        var v = [Math.cos(a), -Math.sin(a) * 0.4, Math.sin(a)];
        var B = [0.5, -1.2, sb];
        // X = A + l u, Y = B + m v, XY·u = 0, XY·v = 0
        var w0 = resta(A, B);
        var a11 = esc(u, u), a12 = -esc(u, v), a21 = esc(u, v), a22 = -esc(v, v);
        var b1 = -esc(w0, u), b2 = -esc(w0, v);
        var det = a11 * a22 - a12 * a21;
        if (Math.abs(det) < 1e-9) return { v: v, B: B, paralelas: true };
        var l = (b1 * a22 - a12 * b2) / det, m = (a11 * b2 - a21 * b1) / det;
        var X = suma(A, por(l, u)), Y = suma(B, por(m, v));
        var mixto = ML.det3([resta(B, A), u, v]);
        return { v: v, B: B, X: X, Y: Y, d: mod(resta(Y, X)), formula: Math.abs(mixto) / mod(cruz(u, v)) };
      }
      var vista = W.space3d(host, {
        rango: 3, height: 380,
        aria: 'Dos rectas que se cruzan en el espacio y el segmento de su perpendicular común',
        draw: function (g) {
          var q = datos();
          g.linea(A, u, { color: 0, w: 2.6 });
          g.linea(q.B, q.v, { color: 1, w: 2.6 });
          if (!q.paralelas) {
            g.seg(q.X, q.Y, { color: 3, w: 3 });
            g.punto(q.X, { color: 3, r: 4 });
            g.punto(q.Y, { color: 3, r: 4 });
          }
        }
      });
      function pinta() {
        var q = datos();
        out.set(q.paralelas ? 'Las rectas son paralelas: no hay una sola perpendicular común.'
          : 'Puntos más cercanos: $X \\approx ' + vt(q.X) + '$ y $Y \\approx ' + vt(q.Y) + '$<br>' +
          'Longitud del segmento $XY$: $' + U.fmt(q.d, 4) + '$ &nbsp;·&nbsp; fórmula del producto mixto: $' + U.fmt(q.formula, 4) + '$');
        vista.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'altura de s', min: -2, max: 2, step: 0.1, value: sb, on: function (x) { sb = x; pinta(); } });
      W.slider(fila, { label: 'giro de s (grados)', min: 0, max: 180, step: 5, value: giro, on: function (x) { giro = x; pinta(); } });
      pinta();
    }
  });

  p.hist('La fórmula de la distancia de un punto a un plano es tan cómoda gracias a Ludwig Otto Hesse, ' +
    'un matemático alemán del siglo XIX que propuso escribir la ecuación del plano dividida por el ' +
    'módulo de su normal. En esa <em>forma normal de Hesse</em>, sustituir un punto en la ecuación da ' +
    'directamente su distancia al plano, con signo: positiva a un lado y negativa al otro. Es la misma ' +
    'fórmula de este tema, sin el valor absoluto, y es la que usan hoy los programas de gráficos para ' +
    'saber en qué lado de una superficie queda cada punto.');

  p.util('El control del tráfico aéreo trata las trayectorias de dos aviones en vuelo recto como dos ' +
    'rectas del espacio, que casi siempre se cruzan. La pregunta que importa es la distancia mínima ' +
    'entre ellas: si baja de la separación reglamentaria, hay conflicto aunque las rutas no se corten ' +
    'nunca en el mapa. Lo mismo se calcula en robótica para saber si dos brazos pueden chocar, y en ' +
    'minería para decidir dónde perforar un túnel que conecte dos galerías por el camino más corto.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Distancia de un punto a un plano',
    level: 'medio',
    gen: function (r) {
      var n = [r.nz(-4, 4), r.nz(-4, 4), r.nz(-4, 4)], D = r.pm(0, 9);
      var P = [r.pm(0, 6), r.pm(0, 6), r.pm(0, 6)];
      var num = esc(n, P) + D;
      if (num === 0) return null;
      return { n: n, D: D, P: P, num: num, n2: esc(n, n), dist: Math.abs(num) / mod(n) };
    },
    ask: function (d) {
      return 'Calcula la distancia del punto $P(' + d.P.join(',\\ ') + ')$ al plano $' + planoTex(d.n, d.D) + '$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Distancia', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.dist, 6) }; },
    tol: 3e-4,
    errores: [
      { si: function (v, d) { return d.num < 0 && Math.abs(v.v + d.dist) < 1e-3; }, msg: 'Una distancia no puede ser negativa: te falta el <strong>valor absoluto</strong> del numerador.' },
      { si: function (v, d) { return Math.abs(v.v - Math.abs(d.num)) < 1e-3; }, msg: 'Has sustituido bien, pero falta <strong>dividir</strong> por el módulo del vector normal.' },
      { si: function (v, d) { return Math.abs(v.v - Math.abs(d.num) / d.n2) < 1e-3; }, msg: 'Se divide por el módulo de la normal, $\\sqrt{A^2+B^2+C^2}$, no por su cuadrado.' }
    ],
    hint: function () {
      return ['Sustituye el punto en la ecuación del plano.',
        'Toma el valor absoluto y divide por $\\sqrt{A^2+B^2+C^2}$.'];
    },
    steps: function (d) {
      return ['Numerador: $|' + esc(d.n, d.P) + ' + ' + d.D + '| = ' + Math.abs(d.num) + '$.',
        'Denominador: $\\sqrt{' + d.n2 + '} \\approx ' + U.fmt(Math.sqrt(d.n2), 4) + '$.',
        '$d = \\dfrac{' + Math.abs(d.num) + '}{\\sqrt{' + d.n2 + '}} \\approx ' + U.fmt(d.dist, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.dist, 4); }
  });

  p.exercise({
    title: 'Ángulo entre una recta y un plano',
    level: 'medio',
    gen: function (r) {
      var n = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)], v = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      if (nulo(n) || nulo(v) || esc(v, n) === 0) return null;
      var s = Math.abs(esc(v, n)) / (mod(v) * mod(n));
      if (s > 0.999999) return null;
      var ang = grados(Math.asin(s));
      if (Math.abs(ang - 45) < 0.5) return null;      // que confundir seno y coseno se note
      return { n: n, v: v, P: [r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)], D: r.pm(0, 6), vn: esc(v, n), s: s, ang: ang };
    },
    ask: function (d) {
      return 'Halla el ángulo, en grados, que forman la recta $r:\\ ' + paramTex(d.P, d.v) + '$ y el plano $\\pi:\\ ' +
        planoTex(d.n, d.D) + '$ (dos decimales).';
    },
    fields: [{ name: 'a', label: 'ángulo (°)', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.ang, 4) }; },
    tol: 1e-3,
    errores: [{
      si: function (v, d) { return Math.abs(v.a - (90 - d.ang)) < 0.05; },
      msg: 'Has usado el <strong>coseno</strong>: eso da el ángulo con la normal. El ángulo con el plano es su complementario, y la fórmula lleva seno.'
    }],
    hint: function () {
      return ['Necesitas el director de la recta y la normal del plano.',
        '$\\operatorname{sen}\\alpha = \\frac{|\\vec v\\cdot\\vec n|}{|\\vec v|\\,|\\vec n|}$: <strong>seno</strong>, no coseno.'];
    },
    steps: function (d) {
      return ['$\\vec{v} = (' + d.v.join(',\\ ') + ')$, $\\vec{n} = (' + d.n.join(',\\ ') + ')$, $\\vec v\\cdot\\vec n = ' + d.vn + '$',
        '$\\operatorname{sen}\\alpha = \\dfrac{|' + d.vn + '|}{\\sqrt{' + esc(d.v, d.v) + '}\\,\\sqrt{' + esc(d.n, d.n) + '}} \\approx ' + U.fmt(d.s, 5) + '$',
        '$\\alpha = \\arcsin(' + U.fmt(d.s, 5) + ') \\approx ' + U.fmt(d.ang, 2) + '^\\circ$'];
    },
    answer: function (d) { return U.fmt(d.ang, 2) + '°'; }
  });

  p.problem({
    title: 'Proyección y simétrico respecto de un plano',
    level: 'avanzado',
    gen: function (r) {
      var n = [r.pm(0, 2), r.pm(0, 2), r.pm(0, 2)];
      if (nulo(n)) return null;
      var Q = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var k = r.pm(1, 2);
      var P = suma(Q, por(k, n));
      return { n: n, D: -esc(n, Q), Q: Q, P: P, k: k, P2: resta(por(2, Q), P) };
    },
    intro: function (d) {
      return 'Sean el punto $P(' + d.P.join(',\\ ') + ')$ y el plano $\\pi:\\ ' + planoTex(d.n, d.D) + '$.';
    },
    partes: [
      {
        ask: function () { return 'Da un vector director de la recta que pasa por $P$ y es perpendicular a $\\pi$.'; },
        fields: [{ name: 'a', label: '$v_1$', w: 'tiny' }, { name: 'b', label: '$v_2$', w: 'tiny' }, { name: 'c', label: '$v_3$', w: 'tiny' }],
        sol: function (d) { return { a: d.n[0], b: d.n[1], c: d.n[2] }; },
        check: function (v, d) {
          var w = [v.a, v.b, v.c];
          if (w.some(isNaN)) return { ok: false, msg: 'Rellena las tres componentes.' };
          return !nulo(w) && nulo(cruz(w, d.n));
        },
        hint: function () { return 'Perpendicular al plano quiere decir paralela a su vector normal.'; },
        steps: function (d) { return ['El director es la normal del plano: $\\vec n = (' + d.n.join(',\\ ') + ')$ (o un múltiplo).']; },
        answer: function (d) { return '$(' + d.n.join(',\\ ') + ')$'; }
      },
      {
        ask: function () { return 'Halla la proyección ortogonal $Q$ de $P$ sobre $\\pi$.'; },
        fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }, { name: 'z', label: 'z', w: 'tiny' }],
        sol: function (d) { return { x: d.Q[0], y: d.Q[1], z: d.Q[2] }; },
        tol: 1e-6,
        hint: function () {
          return ['Escribe la recta perpendicular en paramétricas: $P + \\lambda\\vec n$.',
            'Sustituye $x$, $y$, $z$ en la ecuación del plano y despeja $\\lambda$.',
            'Con ese $\\lambda$, el punto de la recta es $Q$.'];
        },
        steps: function (d) {
          var num = esc(d.n, d.P) + d.D, den = esc(d.n, d.n);
          return ['Recta: $' + paramTex(d.P, d.n) + '$',
            'Sustituyendo en $\\pi$: $' + den + '\\lambda + ' + num + ' = 0 \\Rightarrow \\lambda = ' + ML.F(-num, den).tex() + '$',
            '$Q = P + (' + ML.F(-num, den).tex() + ')\\vec n = (' + d.Q.join(',\\ ') + ')$'];
        },
        answer: function (d) { return '$Q(' + d.Q.join(',\\ ') + ')$'; }
      },
      {
        ask: function () { return 'Halla el simétrico $P\'$ de $P$ respecto de $\\pi$.'; },
        fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }, { name: 'z', label: 'z', w: 'tiny' }],
        sol: function (d) { return { x: d.P2[0], y: d.P2[1], z: d.P2[2] }; },
        errores: [{
          si: function (v, d) { return v.x === d.Q[0] && v.y === d.Q[1] && v.z === d.Q[2]; },
          msg: 'Ese punto es la proyección $Q$, que está <em>en</em> el plano. El simétrico está al otro lado, a la misma distancia.'
        }, {
          si: function (v, d) { var m = [(d.P[0] + d.Q[0]) / 2, (d.P[1] + d.Q[1]) / 2, (d.P[2] + d.Q[2]) / 2]; return Math.abs(v.x - m[0]) < 1e-6 && Math.abs(v.y - m[1]) < 1e-6 && Math.abs(v.z - m[2]) < 1e-6; },
          msg: 'Has calculado el punto medio de $P$ y $Q$. Es al revés: $Q$ es el punto medio de $P$ y $P\'$.'
        }],
        hint: function () { return ['$Q$ es el punto medio del segmento $PP\'$.', 'Despeja: $P\' = 2Q - P$.']; },
        steps: function (d) { return ['$P\' = 2Q - P = 2(' + d.Q.join(',\\ ') + ') - (' + d.P.join(',\\ ') + ') = (' + d.P2.join(',\\ ') + ')$']; },
        answer: function (d) { return '$P\'(' + d.P2.join(',\\ ') + ')$'; }
      }
    ]
  });

  p.exercise({
    title: 'Distancia de un punto a una recta',
    level: 'avanzado',
    gen: function (r) {
      var A = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)], u = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var P = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
      if (nulo(u)) return null;
      var AP = resta(P, A), c = cruz(AP, u);
      if (nulo(c)) return null;
      return { A: A, u: u, P: P, AP: AP, c: c, c2: esc(c, c), u2: esc(u, u), dist: mod(c) / mod(u) };
    },
    ask: function (d) {
      return 'Calcula la distancia del punto $P(' + d.P.join(',\\ ') + ')$ a la recta $r:\\ (x, y, z) = (' + d.A.join(',\\ ') +
        ') + \\lambda(' + d.u.join(',\\ ') + ')$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Distancia', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.dist, 6) }; },
    tol: 3e-4,
    errores: [{
      si: function (v, d) { return d.u2 !== 1 && Math.abs(v.v - mod(d.c)) < 1e-3; },
      msg: 'Eso es el área del paralelogramo, $|\\overrightarrow{AP}\\times\\vec u|$. La distancia es esa área <strong>dividida</strong> por la base $|\\vec u|$.'
    }],
    hint: function () {
      return ['Toma un punto $A$ de la recta y calcula $\\overrightarrow{AP}$.',
        '$d = \\frac{|\\overrightarrow{AP}\\times\\vec u|}{|\\vec u|}$: área del paralelogramo entre la base.'];
    },
    steps: function (d) {
      return ['$\\overrightarrow{AP} = (' + d.AP.join(',\\ ') + ')$',
        '$\\overrightarrow{AP}\\times\\vec{u} = (' + d.c.join(',\\ ') + ')$, de módulo $\\sqrt{' + d.c2 + '}$',
        '$d = \\dfrac{\\sqrt{' + d.c2 + '}}{\\sqrt{' + d.u2 + '}} \\approx ' + U.fmt(d.dist, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.dist, 4); }
  });

  p.problem({
    title: 'Dos rectas que se cruzan',
    level: 'avanzado',
    gen: function (r) {
      var A = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)], B = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var u = [r.pm(0, 2), r.pm(0, 2), r.pm(0, 2)], v = [r.pm(0, 2), r.pm(0, 2), r.pm(0, 2)];
      var w = cruz(u, v);
      if (nulo(w)) return null;
      var AB = resta(B, A), mixto = ML.det3([AB, u, v]);
      if (mixto === 0) return null;
      return { A: A, B: B, u: u, v: v, w: w, AB: AB, mixto: mixto, w2: esc(w, w), dist: Math.abs(mixto) / mod(w) };
    },
    intro: function (d) {
      return 'Sean $r:\\ (x, y, z) = (' + d.A.join(',\\ ') + ') + \\lambda(' + d.u.join(',\\ ') + ')$ y $s:\\ (x, y, z) = (' +
        d.B.join(',\\ ') + ') + \\mu(' + d.v.join(',\\ ') + ')$.';
    },
    partes: [
      {
        ask: function () { return 'Comprueba que se cruzan: ¿cuánto vale $[\\overrightarrow{AB},\\vec u,\\vec v]$?'; },
        fields: [{ name: 'm', label: 'producto mixto', w: 'tiny' }],
        sol: function (d) { return { m: d.mixto }; },
        hint: function () { return 'Determinante con $\\overrightarrow{AB} = B - A$, $\\vec u$ y $\\vec v$ por filas. Si no es cero, se cruzan.'; },
        steps: function (d) {
          return ['$\\overrightarrow{AB} = (' + d.AB.join(',\\ ') + ')$',
            '$[\\overrightarrow{AB},\\vec u,\\vec v] = ' + ML.matTex([d.AB, d.u, d.v], 'vmatrix') + ' = ' + d.mixto + ' \\ne 0$: se cruzan.'];
        },
        answer: function (d) { return String(d.mixto); }
      },
      {
        ask: function () { return 'Da la dirección de su perpendicular común.'; },
        fields: [{ name: 'a', label: '$w_1$', w: 'tiny' }, { name: 'b', label: '$w_2$', w: 'tiny' }, { name: 'c', label: '$w_3$', w: 'tiny' }],
        sol: function (d) { return { a: d.w[0], b: d.w[1], c: d.w[2] }; },
        check: function (v, d) {
          var x = [v.a, v.b, v.c];
          if (x.some(isNaN)) return { ok: false, msg: 'Rellena las tres componentes.' };
          return !nulo(x) && nulo(cruz(x, d.w));
        },
        hint: function () { return 'Tiene que ser perpendicular a los dos directores a la vez.'; },
        steps: function (d) { return ['$\\vec w = \\vec u\\times\\vec v = (' + d.w.join(',\\ ') + ')$ (o un múltiplo).']; },
        answer: function (d) { return '$(' + d.w.join(',\\ ') + ')$'; }
      },
      {
        ask: function () { return 'Calcula la distancia entre $r$ y $s$ (cuatro decimales).'; },
        fields: [{ name: 'd', label: 'distancia', w: 'wide' }],
        sol: function (d) { return { d: U.round(d.dist, 6) }; },
        tol: 3e-4,
        errores: [{
          si: function (v, d) { return d.w2 !== 1 && Math.abs(v.d - Math.abs(d.mixto)) < 1e-3; },
          msg: 'Ese es el volumen del paralelepípedo. La distancia es la altura: volumen entre el área de la base, $|\\vec u\\times\\vec v|$.'
        }],
        hint: function () { return '$d = \\frac{|[\\overrightarrow{AB},\\vec u,\\vec v]|}{|\\vec u\\times\\vec v|}$: volumen entre área de la base.'; },
        steps: function (d) {
          return ['$|\\vec u\\times\\vec v| = \\sqrt{' + d.w2 + '}$',
            '$d = \\dfrac{|' + d.mixto + '|}{\\sqrt{' + d.w2 + '}} \\approx ' + U.fmt(d.dist, 4) + '$'];
        },
        answer: function (d) { return U.fmt(d.dist, 4); }
      }
    ]
  });

  p.exercise({
    title: 'Distancia entre dos planos paralelos',
    level: 'medio',
    gen: function (r) {
      var n = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      if (nulo(n)) return null;
      var k = r.pick([2, 3, -2]), D1 = r.pm(0, 6), D2 = r.pm(0, 9);
      if (k * D1 === D2) return null;
      var dist = Math.abs(D1 - D2 / k) / mod(n);
      return { n: n, k: k, D1: D1, D2: D2, n2: esc(n, n), dist: dist, malo: Math.abs(D1 - D2) / mod(n) };
    },
    ask: function (d) {
      return 'Calcula la distancia entre los planos paralelos $\\pi_1:\\ ' + planoTex(d.n, d.D1) + '$ y $\\pi_2:\\ ' +
        planoTex(por(d.k, d.n), d.D2) + '$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Distancia', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.dist, 6) }; },
    tol: 3e-4,
    errores: [{
      si: function (v, d) { return Math.abs(d.malo - d.dist) > 1e-3 && Math.abs(v.v - d.malo) < 1e-3; },
      msg: 'Has restado los términos independientes sin <strong>igualar antes las normales</strong>: la segunda ecuación está multiplicada por un número.'
    }],
    hint: function () {
      return ['Divide la ecuación de $\\pi_2$ para que tenga exactamente la misma normal que $\\pi_1$.',
        'Entonces $d = \\frac{|D_1 - D_2|}{|\\vec n|}$.'];
    },
    steps: function (d) {
      return ['Se divide $\\pi_2$ entre $' + d.k + '$: $' + planoTex(d.n, d.D2 / d.k) + '$',
        'Ahora las dos tienen normal $(' + d.n.join(',\\ ') + ')$: $d = \\dfrac{|' + d.D1 + ' - (' + U.fmt(d.D2 / d.k, 4) + ')|}{\\sqrt{' + d.n2 + '}} \\approx ' + U.fmt(d.dist, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.dist, 4); }
  });

  p.keys([
    'Los ángulos entre rectas y planos se dan entre 0° y 90°: el producto escalar va en valor absoluto.',
    'Recta con recta y plano con plano: <strong>coseno</strong>. Recta con plano: <strong>seno</strong>, porque la normal forma el ángulo complementario.',
    'Proyectar un punto sobre un plano: recta perpendicular por el punto y corte con el plano. Sobre una recta: plano perpendicular y corte.',
    'El simétrico es $P\' = 2Q - P$, con $Q$ la proyección.',
    '$d(P,\\pi) = \\frac{|Ap_1+Bp_2+Cp_3+D|}{\\sqrt{A^2+B^2+C^2}}$.',
    'Punto y recta, rectas que se cruzan: área o volumen entre base, con productos vectorial y mixto.',
    'Planos paralelos: igualar primero las normales, y luego $\\frac{|D_1-D_2|}{|\\vec n|}$.'
  ]);
});
