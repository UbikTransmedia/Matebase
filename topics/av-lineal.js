/* Tema: Álgebra lineal: autovalores */
Course.topic('av-lineal', function (p) {

  p.text('En [[al-matrices|el tema de matrices]] las viste como tablas de números. Hay una manera mucho más ' +
    'iluminadora de entenderlas: <strong>una matriz es una transformación del espacio</strong>. ' +
    'Coge el plano entero, lo estira, lo comprime, lo gira y lo tuerce, todo a la vez.');

  p.formula('\\vec{x} \\longmapsto A\\vec{x}');

  p.text('Y entonces surge una pregunta natural: en ese estrujamiento del plano, ¿hay alguna dirección ' +
    'que <strong>no se tuerza</strong>? ¿Algún vector que salga apuntando exactamente a donde ' +
    'apuntaba, solo más largo o más corto?');

  p.formula('A\\vec{v} = \\lambda\\,\\vec{v}', 'v es autovector y λ su autovalor');

  p.note('Esa ecuación dice: «aplicar la matriz a $\\vec{v}$ es lo mismo que multiplicarlo por un ' +
    'número». Los autovectores son los <strong>ejes propios</strong> de la transformación, las ' +
    'direcciones en las que la matriz se comporta como una simple multiplicación. Encontrarlas ' +
    'simplifica enormemente cualquier problema.', 'ok');

  p.demo({
    title: 'Buscar las direcciones que no se tuercen',
    intro: 'Gira el vector azul y observa su imagen en rojo. Casi siempre apuntan a sitios distintos; en unas pocas direcciones, se alinean. Esas son los autovectores.',
    build: function (host, d) {
      var M = [[2, 1], [1, 2]];
      var ang = 0.6;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -5, xmax: 5, ymin: -4, ymax: 4, height: 340,
        draw: function (g) {
          var v = [2 * Math.cos(ang), 2 * Math.sin(ang)];
          var Av = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
          // circunferencia de vectores unidad y su imagen (elipse)
          g.param(function (t) { return 2 * Math.cos(t); }, function (t) { return 2 * Math.sin(t); },
            0, 6.2832, { color: 'axis', w: 1.2, dash: true });
          g.param(function (t) { return M[0][0] * 2 * Math.cos(t) + M[0][1] * 2 * Math.sin(t); },
            function (t) { return M[1][0] * 2 * Math.cos(t) + M[1][1] * 2 * Math.sin(t); },
            0, 6.2832, { color: 3, w: 1.4, dash: true });
          g.vec(0, 0, v[0], v[1], { color: 0, w: 3 });
          g.vec(0, 0, Av[0], Av[1], { color: 1, w: 3 });
          var cosAng = (v[0] * Av[0] + v[1] * Av[1]) / (Math.hypot(v[0], v[1]) * Math.hypot(Av[0], Av[1]));
          if (Math.abs(Math.abs(cosAng) - 1) < 0.004) {
            g.text(Av[0], Av[1], '¡alineados!', { color: 2, dx: 8, dy: -14, box: true, size: 13 });
          }
        }
      });
      function paint() {
        var v = [2 * Math.cos(ang), 2 * Math.sin(ang)];
        var Av = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
        var cosAng = (v[0] * Av[0] + v[1] * Av[1]) / (Math.hypot(v[0], v[1]) * Math.hypot(Av[0], Av[1]));
        var alineados = Math.abs(Math.abs(cosAng) - 1) < 0.004;
        var razon = Math.hypot(Av[0], Av[1]) / Math.hypot(v[0], v[1]) * (cosAng > 0 ? 1 : -1);
        out.set('$A = ' + ML.matTex(M) + '$ &nbsp;·&nbsp; ' +
          '$\\vec{v} = (' + U.fmt(v[0], 2) + ', ' + U.fmt(v[1], 2) + ')$ &nbsp;→&nbsp; ' +
          '$A\\vec{v} = (' + U.fmt(Av[0], 2) + ', ' + U.fmt(Av[1], 2) + ')$<br>' +
          (alineados
            ? '<strong style="color:var(--ok)">Alineados: es un autovector, con autovalor λ = ' + U.fmt(razon, 3) + '.</strong>'
            : 'Ángulo entre ellos: $' + U.fmt(Math.acos(U.clamp(cosAng, -1, 1)) * 180 / Math.PI, 1) +
              '^\\circ$. Sigue girando hasta que se alineen.'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'dirección del vector', min: 0, max: 6.28, step: 0.01, value: 0.6, dec: 2, on: function (v) { ang = v; paint(); } });
      W.chips(host, [
        { label: '$\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$', value: [[2, 1], [1, 2]] },
        { label: '$\\begin{pmatrix}3&0\\\\0&1\\end{pmatrix}$', value: [[3, 0], [0, 1]] },
        { label: '$\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$', value: [[0, -1], [1, 0]] }
      ], { toggle: false, on: function (v) { M = v; paint(); } });
      W.legend(host, [{ c: 0, t: '$\\vec{v}$' }, { c: 1, t: '$A\\vec{v}$' }, { c: 3, t: 'imagen de la circunferencia' }]);
      W.hint(host, 'Prueba la última matriz: es un giro de 90°, y no tiene ninguna dirección invariante real.');
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cómo se calculan');

  p.text('De $A\\vec{v} = \\lambda\\vec{v}$ se pasa a $(A - \\lambda I)\\vec{v} = \\vec{0}$. Para que ' +
    'esa ecuación tenga solución distinta de cero, la matriz $A - \\lambda I$ no puede tener inversa, ' +
    'y eso significa que su determinante es nulo:');

  p.formula('\\det(A - \\lambda I) = 0', 'ecuación característica');

  p.text('Para una matriz $2\\times2$ sale una ecuación de segundo grado en $\\lambda$, y hay un atajo ' +
    'que conviene conocer:');

  p.formula('\\lambda^2 - (\\operatorname{tr}A)\\,\\lambda + \\det A = 0',
    'traza = suma de la diagonal');

  p.formulas([
    '\\lambda_1 + \\lambda_2 = \\operatorname{tr}A',
    '\\lambda_1 \\cdot \\lambda_2 = \\det A'
  ], 'comprobación rápida');

  p.section('Diagonalización');

  p.text('Si una matriz $n\\times n$ tiene $n$ autovectores independientes, se puede escribir así:');

  p.formula('A = P\\,D\\,P^{-1}', 'D es diagonal con los autovalores; P tiene los autovectores por columnas');

  p.text('Traducido: <em>en la base de sus autovectores, la matriz es simplemente una lista de ' +
    'estiramientos</em>. Toda la complicación era el sistema de coordenadas.');

  p.note('Esto tiene una consecuencia práctica enorme. Calcular $A^{100}$ multiplicando cien veces es ' +
    'inviable; pero $A^{100} = P D^{100} P^{-1}$, y elevar una matriz diagonal es elevar sus elementos ' +
    'uno a uno. Así se resuelven las cadenas de Markov, la evolución de poblaciones estructuradas por ' +
    'edad y los sistemas dinámicos lineales.', 'ok', 'Para qué sirve diagonalizar');

  p.hist('El algoritmo PageRank, con el que Google ordenó la web en 1998, es esencialmente esto: se ' +
    'construye una matriz enorme con los enlaces entre páginas y se busca <strong>su autovector ' +
    'principal</strong>. La importancia de cada página es su componente en ese autovector. Una tesis ' +
    'doctoral, un autovector y una empresa de un billón de dólares.');

  /* ================= EJERCICIOS ================= */
  p.util('Los autovalores son las frecuencias propias de una estructura, y conocerlas es cuestión de ' +
    'seguridad. Un puente, un rascacielos o un ala de avión vibran de forma natural a ciertas ' +
    'frecuencias, y si una excitación externa coincide con una de ellas, la amplitud crece sola: eso ' +
    'es la resonancia. El puente del Milenio de Londres tuvo que cerrar a los dos días de abrir en ' +
    'el año 2000 porque el paso de la gente excitó uno de sus modos propios. Calcular autovalores es ' +
    'lo que evita que eso ocurra.');

  p.section('Autovalores complejos: girar también transforma');

  p.text('Hay matrices que no dejan ninguna dirección sin torcer. La más evidente es un giro: si todo el plano gira ' +
    '$90^\\circ$, ningún vector acaba sobre su misma recta, y la ecuación característica no tiene raíces reales. ' +
    'Pero sí tiene raíces [[al-complejos|complejas]], y esas raíces dicen exactamente cuánto gira y cuánto estira ' +
    'la transformación.');

  p.formula('A = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix} = r\\begin{pmatrix} \\cos\\theta & -\\operatorname{sen}\\theta \\\\ \\operatorname{sen}\\theta & \\cos\\theta \\end{pmatrix}, \\qquad \\lambda = a \\pm b\\,i',
    'giro con escala: autovalores complejos',
    'La ecuación característica es $(a - \\lambda)^2 + b^2 = 0$, así que $\\lambda = a \\pm bi$.<br><br>El ' +
    '<strong>módulo</strong> del autovalor, $r = \\sqrt{a^2 + b^2}$, es cuánto estira la matriz; su ' +
    '<strong>argumento</strong>, $\\theta$, cuánto gira.<br><br>Multiplicar el vector $(x, y)$ por $A$ da lo mismo ' +
    'que multiplicar el complejo $x + yi$ por $a + bi$: los números complejos <em>son</em> giros con escala.');

  p.text('Toda matriz real 2×2 con autovalores complejos $a \\pm bi$ se comporta así en una base adecuada: en cada ' +
    'aplicación gira un ángulo $\\theta$ y estira por $r$. Si $r < 1$, los puntos caen en espiral hacia el origen; si ' +
    '$r > 1$, se alejan en espiral; si $r = 1$, giran para siempre sobre una curva cerrada. Es el mismo criterio de ' +
    'estabilidad de los [[av-sistemas-dinamicos|sistemas dinámicos]].');

  p.demo({
    title: 'La espiral de los autovalores complejos',
    intro: 'Se aplica la matriz una y otra vez a un punto de partida. Cada aplicación gira un ángulo θ y estira por r, los dos datos del autovalor complejo. Pon r justo en 1 y el punto da vueltas sin acercarse ni alejarse.',
    build: function (host) {
      var rr = 0.93, th = 25;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -3, xmax: 3, ymin: -3, ymax: 3, height: 320,
        aria: 'Las imágenes sucesivas de un punto al aplicar muchas veces una matriz de giro con escala, formando una espiral',
        draw: function (g) {
          var t = th * Math.PI / 180, a = rr * Math.cos(t), b = rr * Math.sin(t), x = 2.5, y = 0, pts = [[x, y]];
          for (var i = 0; i < 60; i++) { var nx = a * x - b * y, ny = b * x + a * y; x = nx; y = ny; pts.push([x, y]); if (Math.hypot(x, y) > 20) break; }
          g.path(pts, { color: 0, w: 1.8 });
          pts.forEach(function (q, i) { g.point(q[0], q[1], { color: i === 0 ? 1 : 0, r: i === 0 ? 5 : 3 }); });
        }
      });
      function pinta() {
        var t = th * Math.PI / 180, a = rr * Math.cos(t), b = rr * Math.sin(t);
        out.set('$A = \\begin{pmatrix} ' + U.fmt(a, 3) + ' & ' + U.fmt(-b, 3) + ' \\\\ ' + U.fmt(b, 3) + ' & ' + U.fmt(a, 3) + ' \\end{pmatrix}$ &nbsp;·&nbsp; $\\lambda = ' + U.fmt(a, 3) + ' \\pm ' + U.fmt(Math.abs(b), 3) + 'i$ &nbsp;·&nbsp; $|\\lambda| = ' +
          U.fmt(rr, 3) + '$, argumento $' + th + '^\\circ$ &nbsp;·&nbsp; ' + (rr < 0.999 ? 'cae en espiral hacia el origen' : (rr > 1.001 ? 'se aleja en espiral' : 'gira sin acercarse ni alejarse')));
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'módulo r', min: 0.8, max: 1.08, step: 0.005, value: rr, on: function (v) { rr = v; pinta(); } });
      W.slider(fila, { label: 'ángulo θ (°)', min: 0, max: 180, step: 1, value: th, on: function (v) { th = v; pinta(); } });
      pinta();
    }
  });

  p.section('Practica');

  p.exercise({
    title: 'Autovalores de una matriz 2×2',
    level: 'medio',
    gen: function (r) {
      var l1 = r.pm(1, 6), l2 = r.pm(1, 6);
      if (l1 === l2) return null;
      // construimos A con traza y determinante conocidos
      var a = r.nz(-5, 5);
      var dd = l1 + l2 - a;
      var b = r.nz(-4, 4);
      var c = (a * dd - l1 * l2) / b;
      if (!Number.isInteger(c) || Math.abs(c) > 20) return null;
      return { m: [[a, b], [c, dd]], l1: Math.min(l1, l2), l2: Math.max(l1, l2), tr: a + dd, det: l1 * l2 };
    },
    ask: function (d) {
      return 'Halla los autovalores de $A = ' + ML.matTex(d.m) + '$, de menor a mayor.';
    },
    fields: [{ name: 'a', label: 'λ menor', w: 'tiny' }, { name: 'b', label: 'λ mayor', w: 'tiny' }],
    sol: function (d) { return { a: d.l1, b: d.l2 }; },
    tol: 1e-6,
    hint: function (d) { return 'Traza $= ' + d.tr + '$ y determinante $= ' + d.det + '$. Resuelve $\\lambda^2 - ' + d.tr + '\\lambda + ' + d.det + ' = 0$.'; },
    steps: function (d) {
      return ['Traza: $' + d.m[0][0] + ' + ' + d.m[1][1] + ' = ' + d.tr + '$.',
        'Determinante: $' + d.m[0][0] + '\\cdot' + d.m[1][1] + ' - ' + d.m[0][1] + '\\cdot' + d.m[1][0] + ' = ' + d.det + '$.',
        'Ecuación característica: $' + ML.polyTex([1, -d.tr, d.det], '\\lambda') + ' = 0$.',
        'Sus raíces son $\\lambda_1 = ' + d.l1 + '$ y $\\lambda_2 = ' + d.l2 + '$.',
        'Comprobación: suman $' + (d.l1 + d.l2) + '$ (la traza) y multiplican $' + (d.l1 * d.l2) + '$ (el determinante) ✓'];
    },
    answer: function (d) { return 'λ = ' + d.l1 + ' y λ = ' + d.l2; }
  });

  p.exercise({
    title: 'Comprobar un autovector',
    level: 'medio',
    gen: function (r) {
      var lam = r.nz(-5, 5);
      var v = [r.nz(-3, 3), r.nz(-3, 3)];
      // construimos A que tenga a v como autovector con autovalor lam
      var a = r.nz(-4, 4);
      var b = (lam * v[0] - a * v[0]) / v[1];
      if (!Number.isInteger(b)) return null;
      var c = r.nz(-4, 4);
      var dd = (lam * v[1] - c * v[0]) / v[1];
      if (!Number.isInteger(dd)) return null;
      return { m: [[a, b], [c, dd]], v: v, lam: lam };
    },
    ask: function (d) {
      return 'Comprueba que $\\vec{v} = (' + d.v + ')$ es autovector de $A = ' + ML.matTex(d.m) +
        '$ y halla su autovalor.';
    },
    fields: [{ name: 'l', label: 'Autovalor λ', w: 'tiny' }],
    sol: function (d) { return { l: d.lam }; },
    tol: 1e-6,
    hint: function () { return 'Multiplica $A\\vec{v}$ y mira por cuánto hay que multiplicar $\\vec{v}$ para obtener ese resultado.'; },
    steps: function (d) {
      var Av = [d.m[0][0] * d.v[0] + d.m[0][1] * d.v[1], d.m[1][0] * d.v[0] + d.m[1][1] * d.v[1]];
      return ['$A\\vec{v} = (' + d.m[0][0] + '\\cdot' + d.v[0] + ' + ' + d.m[0][1] + '\\cdot' + d.v[1] + ',\\ ' +
        d.m[1][0] + '\\cdot' + d.v[0] + ' + ' + d.m[1][1] + '\\cdot' + d.v[1] + ') = (' + Av + ')$',
        'Comparamos con $\\vec{v} = (' + d.v + ')$: cada componente se ha multiplicado por el mismo número.',
        '$\\lambda = ' + d.lam + '$',
        'La dirección de $\\vec v$ no ha cambiado: solo se ha estirado ' + (d.lam < 0 ? 'y dado la vuelta' : '') + '.'];
    },
    answer: function (d) { return 'λ = ' + d.lam; }
  });

  p.exercise({
    title: 'Traza y determinante',
    level: 'basico',
    gen: function (r) {
      var l1 = r.pm(1, 8), l2 = r.pm(1, 8);
      return { l1: l1, l2: l2, tr: l1 + l2, det: l1 * l2 };
    },
    ask: function (d) {
      return 'Una matriz $2\\times2$ tiene autovalores $' + d.l1 + '$ y $' + d.l2 + '$. ¿Cuánto valen ' +
        'su traza y su determinante?';
    },
    fields: [{ name: 't', label: 'Traza', w: 'tiny' }, { name: 'd', label: 'Determinante', w: 'tiny' }],
    sol: function (d) { return { t: d.tr, d: d.det }; },
    tol: 1e-6,
    hint: function () { return 'La traza es la suma de los autovalores y el determinante su producto.'; },
    steps: function (d) {
      return ['$\\operatorname{tr}A = \\lambda_1 + \\lambda_2 = ' + d.l1 + ' + (' + d.l2 + ') = ' + d.tr + '$',
        '$\\det A = \\lambda_1 \\cdot \\lambda_2 = ' + d.l1 + ' \\cdot (' + d.l2 + ') = ' + d.det + '$',
        d.det === 0 ? 'Determinante nulo: hay un autovalor cero, así que la matriz <strong>aplasta</strong> el plano sobre una recta y no tiene inversa.'
          : 'Como el determinante no es cero, la matriz es inversible.'];
    },
    answer: function (d) { return 'Traza ' + d.tr + ', determinante ' + d.det + '.'; }
  });

  p.exercise({
    title: 'Potencia de una matriz diagonalizable',
    level: 'avanzado',
    gen: function (r) {
      var l1 = r.pick([1, 2, 3, -1, -2, 0.5]);
      var l2 = r.pick([1, 2, 3, -1, -2, 0.5]);
      var n = r.int(3, 10);
      if (Math.abs(Math.pow(l1, n)) > 1e7 || Math.abs(Math.pow(l2, n)) > 1e7) return null;
      return { l1: l1, l2: l2, n: n, a: Math.pow(l1, n), b: Math.pow(l2, n) };
    },
    ask: function (d) {
      return 'Una matriz diagonalizable tiene autovalores $' + U.fmt(d.l1, 1) + '$ y $' + U.fmt(d.l2, 1) +
        '$. ¿Cuáles son los autovalores de $A^{' + d.n + '}$?';
    },
    fields: [{ name: 'a', label: 'Primer autovalor', w: 'wide' }, { name: 'b', label: 'Segundo autovalor', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.a, 6), b: U.round(d.b, 6) }; },
    tol: 3e-5,
    hint: function () { return 'Si $A = PDP^{-1}$, entonces $A^n = PD^nP^{-1}$: solo hay que elevar los autovalores.'; },
    steps: function (d) {
      return ['$A^{' + d.n + '} = P\\,D^{' + d.n + '}\\,P^{-1}$, y elevar una diagonal es elevar sus elementos.',
        '$' + U.fmt(d.l1, 1) + '^{' + d.n + '} = ' + U.fmt(d.a, 4) + '$',
        '$' + U.fmt(d.l2, 1) + '^{' + d.n + '} = ' + U.fmt(d.b, 4) + '$',
        'Los autovectores <strong>no cambian</strong>: siguen siendo las mismas direcciones.',
        Math.abs(d.l1) > 1 || Math.abs(d.l2) > 1
          ? 'A la larga domina el autovalor de mayor módulo: casi cualquier vector acaba alineándose con su autovector. Eso es lo que aprovecha PageRank.'
          : 'Como los dos módulos son menores o iguales que 1, al elevar la matriz todo se encoge hacia el origen.'];
    },
    answer: function (d) { return U.fmt(d.a, 4) + ' y ' + U.fmt(d.b, 4); }
  });

  p.exercise({
    title: 'Un giro con escala',
    level: 'medio',
    gen: function (r) {
      var par = r.pick([[1, 1], [-1, 1], [0, 2], [1, -1], [-1, -1], [0, -3], [2, 2], [-2, 0], [3, 3]]);
      var a = par[0], b = par[1];
      if (b === 0) return null;
      var ang = Math.atan2(b, a) * 180 / Math.PI;
      return { a: a, b: b, r: Math.hypot(a, b), ang: ang, malAng: a !== 0 ? Math.atan(b / a) * 180 / Math.PI : ang };
    },
    ask: function (d) {
      return 'La matriz $A = \\begin{pmatrix} ' + d.a + ' & ' + (-d.b) + ' \\\\ ' + d.b + ' & ' + d.a + ' \\end{pmatrix}$ tiene autovalores $\\lambda = ' + d.a + ' \\pm ' + Math.abs(d.b) +
        'i$. ¿Cuánto estira y cuánto gira? Da el módulo y el ángulo de giro en grados, entre $-180^\\circ$ y $180^\\circ$, del autovalor $' + d.a + (d.b < 0 ? ' - ' : ' + ') + Math.abs(d.b) + 'i$. (Tres decimales.)';
    },
    fields: [{ name: 'r', label: 'módulo', w: 'tiny' }, { name: 'a', label: 'ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { r: U.round(d.r, 6), a: U.round(d.ang, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.malAng - d.ang) > 1e-3 && Math.abs(v.a - d.malAng) < 5e-4; }, msg: 'La arcotangente de $\\frac{b}{a}$ no distingue cuadrantes: con $a < 0$ el complejo está a la izquierda, y hay que sumar o restar $180^\\circ$.' }],
    hint: function () { return ['Módulo: $\\sqrt{a^2 + b^2}$.', 'Ángulo: el argumento del complejo $a + bi$. Dibújalo para ver en qué cuadrante está.']; },
    steps: function (d) {
      return ['$r = \\sqrt{' + d.a + '^2 + ' + (d.b < 0 ? '(' + d.b + ')' : d.b) + '^2} = \\sqrt{' + (d.a * d.a + d.b * d.b) + '} \\approx ' + U.fmt(d.r, 3) + '$',
        'El complejo $' + d.a + (d.b < 0 ? ' - ' : ' + ') + Math.abs(d.b) + 'i$ tiene argumento $' + U.fmt(d.ang, 3) + '^\\circ$.',
        'Cada aplicación de $A$ estira por ' + U.fmt(d.r, 3) + ' y gira ' + U.fmt(d.ang, 3) + '°.'];
    },
    answer: function (d) { return 'r ≈ ' + U.fmt(d.r, 3) + ', ' + U.fmt(d.ang, 3) + '°'; }
  });

  p.keys([
    'Si los autovalores de una matriz real 2×2 son complejos, $a \\pm bi$, la transformación gira un ángulo igual a su argumento y estira por su módulo.',
    'Una matriz es una <strong>transformación del espacio</strong>, no solo una tabla.',
    'Autovector: dirección que la transformación no tuerce. Autovalor: cuánto la estira.',
    'Se calculan resolviendo $\\det(A-\\lambda I) = 0$.',
    'Atajo $2\\times2$: $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0$.',
    'Traza = suma de autovalores; determinante = producto.',
    'Diagonalizar es cambiar a la base donde la matriz solo estira: $A = PDP^{-1}$.',
    'Potencias, cadenas de Markov y PageRank son autovalores disfrazados.'
  ]);
});
