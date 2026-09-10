/* Tema: Minimos cuadrados y proyecciones */
Course.topic('av-minimos-cuadrados', function (p) {

  p.text('Se miden tres puntos que deberían estar en una recta, y no lo están: toda medida tiene error. La recta ' +
    '$y = c_0 + c_1 t$ tendría que cumplir tres ecuaciones con solo dos incógnitas, y un sistema así casi nunca ' +
    'tiene solución. En [[pe-bidimensional]] se resolvía con la recta de regresión y una fórmula que había que ' +
    'creerse. Este tema explica de dónde sale: es una <strong>proyección</strong>, la misma idea de la sombra de un ' +
    'vector, llevada a espacios de más dimensiones.');

  /* ---------------------------------------------------------------- */
  p.section('Un sistema que no tiene solución');

  p.text('Si la recta pasara por los puntos $(t_1, y_1)$, $(t_2, y_2)$ y $(t_3, y_3)$, se cumpliría $c_0 + c_1 t_i = y_i$ ' +
    'para los tres. Escrito con matrices:');

  p.formula('A\\,\\vec x = \\vec b, \\qquad A = \\begin{pmatrix} 1 & t_1 \\\\ 1 & t_2 \\\\ 1 & t_3 \\end{pmatrix}, \\quad \\vec x = \\begin{pmatrix} c_0 \\\\ c_1 \\end{pmatrix}, \\quad \\vec b = \\begin{pmatrix} y_1 \\\\ y_2 \\\\ y_3 \\end{pmatrix}',
    'el ajuste como sistema',
    'Tres ecuaciones y dos incógnitas: por el [[al-discusion|teorema de Rouché-Fröbenius]], en general es incompatible.<br><br>' +
    'Mirado de otra manera: $A\\vec x = c_0\\,\\vec a_1 + c_1\\,\\vec a_2$ es una combinación lineal de las dos columnas de $A$. ' +
    'Todas esas combinaciones forman un plano dentro del espacio de tres dimensiones, el <strong>espacio columna</strong>. El ' +
    'sistema tiene solución solo si $\\vec b$ está en ese plano, y casi nunca lo está.');

  p.text('Si no se puede conseguir que $A\\vec x$ sea exactamente $\\vec b$, lo razonable es buscar el $\\vec x$ que lo deje ' +
    '<strong>lo más cerca posible</strong>, es decir, que haga mínima la longitud del residuo $\\vec r = \\vec b - A\\vec x$. Y como ' +
    '$|\\vec r|^2$ es la suma de los cuadrados de los errores de cada medida, eso es exactamente minimizar la suma de ' +
    'cuadrados.');

  /* ---------------------------------------------------------------- */
  p.section('Proyección ortogonal sobre un subespacio');

  p.text('El punto de un plano más cercano a un punto exterior es su proyección ortogonal: el pie de la perpendicular. ' +
    'Así que la mejor aproximación es $A\\hat x$, la proyección de $\\vec b$ sobre el espacio columna, y el residuo tiene que ' +
    'ser <strong>perpendicular a todas las columnas</strong> de $A$. Escribir esa perpendicularidad con el producto escalar ' +
    'da directamente la solución:');

  p.formula('A^{t}\\,(\\vec b - A\\hat x) = \\vec 0 \\qquad\\Longleftrightarrow\\qquad A^{t}A\\,\\hat x = A^{t}\\vec b',
    'las ecuaciones normales',
    'Cada fila de $A^t$ es una columna de $A$, así que $A^t\\vec r = \\vec 0$ dice «el residuo es perpendicular a cada columna».<br><br>' +
    '$A^tA$ es una matriz cuadrada, de tantas filas como incógnitas, y si las columnas de $A$ son independientes tiene ' +
    '[[al-inversa|inversa]]: $\\hat x = (A^tA)^{-1}A^t\\vec b$.<br><br>Con dos incógnitas, desarrollar estas ecuaciones da ' +
    'exactamente las fórmulas de la recta de regresión.');

  p.demo({
    title: 'Dos vistas del mismo ajuste',
    intro: 'Tres medidas tomadas en t = −1, 0 y 1. Arriba, en el espacio: el vector de medidas b no está en el plano de las columnas de A; su proyección p es el punto del plano más cercano, y el segmento rojo, el residuo, perpendicular al plano. Abajo, lo mismo como ajuste: la recta de mínimos cuadrados y el error de cada medida. Mueve las medidas y arrastra la vista 3D para girarla.',
    build: function (host) {
      var y = [1, 3, 2];
      var out = W.readout(host, '');
      function calcula() {
        var c0 = (y[0] + y[1] + y[2]) / 3, c1 = (y[2] - y[0]) / 2, pv = [c0 - c1, c0, c0 + c1];
        return { c0: c0, c1: c1, pv: pv, r: [y[0] - pv[0], y[1] - pv[1], y[2] - pv[2]] };
      }
      var esp = W.space3d(host, {
        rango: 5, height: 320, aria: 'El vector de medidas, el plano generado por las columnas de la matriz y la proyección ortogonal del vector sobre ese plano',
        draw: function (v) {
          var c = calcula();
          v.plano([1, -2, 1], 0, { color: 0, fillAlpha: 0.13 });
          v.vec([0, 0, 0], [1, 1, 1], { color: 0, w: 2, label: 'a₁' });
          v.vec([0, 0, 0], [-1, 0, 1], { color: 0, w: 2, label: 'a₂' });
          v.vec([0, 0, 0], y, { color: 1, w: 2.6, label: 'b' });
          v.vec([0, 0, 0], c.pv, { color: 2, w: 2.6, label: 'p' });
          v.seg(y, c.pv, { color: 'bad', w: 2.2, dash: [4, 3] });
        }
      });
      var plano = W.plot(host, {
        xmin: -1.6, xmax: 1.6, ymin: -5, ymax: 5, height: 230, xlabel: 't', ylabel: 'y',
        aria: 'Las tres medidas, la recta de mínimos cuadrados y los residuos de cada medida',
        draw: function (g) {
          var c = calcula();
          g.fn(function (t) { return c.c0 + c.c1 * t; }, { color: 2, w: 2.4 });
          [-1, 0, 1].forEach(function (t, i) { g.seg(t, y[i], t, c.pv[i], { color: 'bad', w: 1.6 }); g.point(t, y[i], { color: 1, r: 5 }); });
        }
      });
      function pinta() {
        var c = calcula();
        out.set('Recta: $y = ' + U.fmt(c.c0, 3) + (c.c1 < 0 ? ' - ' : ' + ') + U.fmt(Math.abs(c.c1), 3) + '\\,t$ &nbsp;·&nbsp; residuo $\\vec r = (' + c.r.map(function (x) { return U.fmt(x, 3); }).join(',\\ ') +
          ')$, $|\\vec r|^2 = ' + U.fmt(c.r[0] * c.r[0] + c.r[1] * c.r[1] + c.r[2] * c.r[2], 3) + '$ &nbsp;·&nbsp; $\\vec a_1\\cdot\\vec r = ' + U.fmt(c.r[0] + c.r[1] + c.r[2], 3) + '$, $\\vec a_2\\cdot\\vec r = ' + U.fmt(c.r[2] - c.r[0], 3) + '$');
        esp.render();
        plano.render();
      }
      var fila = W.row(host);
      [0, 1, 2].forEach(function (i) {
        W.slider(fila, { label: '$y_' + (i + 1) + '$ (en $t = ' + (i - 1) + '$)', min: -4, max: 4, step: 0.1, value: y[i], on: function (v) { y[i] = v; pinta(); } });
      });
      W.hint(host, 'Los dos productos escalares del final valen siempre 0: el residuo es perpendicular a las dos columnas, se muevan como se muevan las medidas.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Ajustar rectas, parábolas y lo que haga falta');

  p.text('Nada de lo anterior depende de que el modelo sea una recta. Solo hace falta que sea <strong>lineal en los ' +
    'coeficientes</strong>. Para una parábola $y = c_0 + c_1 t + c_2 t^2$, la matriz $A$ tiene tres columnas: unos, los ' +
    '$t_i$ y los $t_i^2$. Para un modelo con senos y cosenos, columnas de senos y cosenos. Las ecuaciones normales son ' +
    'siempre las mismas.');

  p.note('Si hay tantas medidas como coeficientes —tres puntos para una parábola—, el sistema tiene solución exacta, el ' +
    'residuo es cero y el ajuste pasa por todos los puntos. Con más medidas que coeficientes, el ajuste promedia los ' +
    'errores. Y con demasiados coeficientes para pocas medidas, el modelo se ajusta tan bien a los datos que empieza a ' +
    'ajustar también el ruido: es el sobreajuste, el gran peligro del aprendizaje automático.', 'warn', 'Cuántos coeficientes');

  p.hist('El método lo publicó Legendre en 1805 y lo reclamó Gauss, que lo había usado para encontrar el planeta enano ' +
    'Ceres. La palabra <em>regresión</em> es de Francis Galton, que en la década de 1880 comparó la estatura de padres e ' +
    'hijos y vio que los hijos de padres muy altos tendían a ser algo menos altos que ellos: «regresaban hacia la ' +
    'media». Galton lo interpretó como una ley de la herencia; en realidad es un efecto estadístico que aparece siempre ' +
    'que dos medidas no están perfectamente relacionadas.');

  p.util('Un receptor GPS suele recibir señal de más satélites de los estrictamente necesarios, y calcula su posición ' +
    'resolviendo un sistema sobredeterminado por mínimos cuadrados. Las cámaras de los móviles calibran sus lentes igual, ' +
    'y la regresión lineal, la versión más sencilla del aprendizaje automático, es literalmente este tema.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Las ecuaciones normales',
    level: 'medio',
    gen: function (r) {
      var y = [r.int(-3, 4), r.int(-3, 4), r.int(-3, 4)];
      if (y[0] + y[2] === 2 * y[1]) return null;
      var c1 = ML.F(y[2] - y[0], 2), c0 = ML.F(y[0] + y[1] + y[2], 3).sub(c1);
      return { y: y, c0: c0, c1: c1, sy: y[0] + y[1] + y[2], sty: y[1] + 2 * y[2] };
    },
    ask: function (d) {
      return 'Se han medido los puntos $(0,\\ ' + d.y[0] + ')$, $(1,\\ ' + d.y[1] + ')$ y $(2,\\ ' + d.y[2] + ')$. Plantea $A$ y $\\vec b$, resuelve las ecuaciones normales $A^tA\\,\\hat x = A^t\\vec b$ y da la recta de mínimos cuadrados $y = c_0 + c_1 t$. (Fracciones.)';
    },
    fields: [{ name: 'c0', label: '$c_0$', w: 'tiny' }, { name: 'c1', label: '$c_1$', w: 'tiny' }],
    sol: function (d) { return { c0: d.c0.val(), c1: d.c1.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return !d.c0.eq(ML.F(d.y[0])) && Math.abs(v.c0 - d.y[0]) < 1e-9; }, msg: 'Esa es la recta que pasa por el primer punto y el último. Mínimos cuadrados tiene en cuenta los tres, y la recta no tiene por qué pasar por ninguno.' }],
    hint: function () { return ['$A = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$, así que $A^tA = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}$.', '$A^t\\vec b = \\begin{pmatrix} y_1 + y_2 + y_3 \\\\ y_2 + 2y_3 \\end{pmatrix}$. Resuelve el sistema 2×2.']; },
    steps: function (d) {
      return ['$A^tA = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}$, $A^t\\vec b = \\begin{pmatrix} ' + d.sy + ' \\\\ ' + d.sty + ' \\end{pmatrix}$',
        '$\\begin{cases} 3c_0 + 3c_1 = ' + d.sy + ' \\\\ 3c_0 + 5c_1 = ' + d.sty + ' \\end{cases}$: restando, $2c_1 = ' + (d.sty - d.sy) + '$.',
        '$c_1 = ' + d.c1.tex() + '$ y $c_0 = ' + d.c0.tex() + '$: la recta es $y = ' + d.c0.tex() + ' + ' + d.c1.texp() + '\\,t$.'];
    },
    answer: function (d) { return 'c₀ = ' + d.c0.toString() + ', c₁ = ' + d.c1.toString(); }
  });

  p.exercise({
    title: 'Proyectar sobre una recta del espacio',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([[1, 2, 2], [2, 1, 2], [2, 2, 1], [1, 1, 1], [0, 3, 4]]), b = [r.int(-3, 5), r.int(-3, 5), r.int(-3, 5)];
      var ab = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], aa = a[0] * a[0] + a[1] * a[1] + a[2] * a[2], bb = b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
      if (ab === 0) return null;
      return { a: a, b: b, ab: ab, aa: aa, coef: ML.F(ab, aa), res2: ML.F(bb * aa - ab * ab, aa), mal: ab / Math.sqrt(aa) };
    },
    ask: function (d) {
      return 'Se proyecta $\\vec b = (' + d.b.join(',\\ ') + ')$ sobre la recta generada por $\\vec a = (' + d.a.join(',\\ ') + ')$: la proyección es $\\hat x\\,\\vec a$. ¿Cuánto vale $\\hat x$, y cuánto vale $|\\vec r|^2$, el cuadrado de la distancia de $\\vec b$ a la recta? (Fracciones.)';
    },
    fields: [{ name: 'x', label: '$\\hat x$', w: 'tiny' }, { name: 'r', label: '$|\\vec r|^2$', w: 'tiny' }],
    sol: function (d) { return { x: d.coef.val(), r: d.res2.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return Math.abs(v.x - d.mal) < 1e-3 && d.aa !== 1; }, msg: 'Eso es la longitud de la sombra. El coeficiente que multiplica a $\\vec a$ se divide por $|\\vec a|^2$, no por $|\\vec a|$.' }],
    hint: function () { return ['Con una sola columna, las ecuaciones normales son $(\\vec a\\cdot\\vec a)\\,\\hat x = \\vec a\\cdot\\vec b$.', '$|\\vec r|^2 = |\\vec b|^2 - \\hat x^2\\,|\\vec a|^2$, por el teorema de Pitágoras.']; },
    steps: function (d) {
      return ['$\\vec a\\cdot\\vec b = ' + d.ab + '$, $\\vec a\\cdot\\vec a = ' + d.aa + '$, así que $\\hat x = ' + d.coef.tex() + '$.',
        '$|\\vec r|^2 = |\\vec b|^2 - \\dfrac{(\\vec a\\cdot\\vec b)^2}{\\vec a\\cdot\\vec a} = ' + d.res2.tex() + '$'];
    },
    answer: function (d) { return 'x̂ = ' + d.coef.toString() + ', |r|² = ' + d.res2.toString(); }
  });

  p.exercise({
    title: 'Una parábola por tres puntos',
    level: 'medio',
    gen: function (r) {
      var y = [r.int(-3, 4), r.int(-3, 4), r.int(-3, 4)];
      return { y: y, c0: ML.F(y[1]), c1: ML.F(y[2] - y[0], 2), c2: ML.F(y[0] + y[2], 2).sub(y[1]) };
    },
    ask: function (d) {
      return 'Se ajusta la parábola $y = c_0 + c_1 t + c_2 t^2$ a los puntos $(-1,\\ ' + d.y[0] + ')$, $(0,\\ ' + d.y[1] + ')$ y $(1,\\ ' + d.y[2] + ')$ por mínimos cuadrados. ¿Cuáles son los coeficientes? (Fracciones.)';
    },
    fields: [{ name: 'a', label: '$c_0$', w: 'tiny' }, { name: 'b', label: '$c_1$', w: 'tiny' }, { name: 'c', label: '$c_2$', w: 'tiny' }],
    sol: function (d) { return { a: d.c0.val(), b: d.c1.val(), c: d.c2.val() }; },
    tol: 1e-9,
    hint: function () { return ['Hay tres coeficientes y tres puntos: la matriz $A$ es cuadrada.', 'Si $A$ tiene inversa, el sistema tiene solución exacta y la de mínimos cuadrados es esa misma: la parábola pasa por los tres puntos.']; },
    steps: function (d) {
      return ['En $t = 0$: $c_0 = ' + d.y[1] + '$.', 'En $t = \\pm 1$: $c_0 + c_1 + c_2 = ' + d.y[2] + '$ y $c_0 - c_1 + c_2 = ' + d.y[0] + '$. Restando, $c_1 = ' + d.c1.tex() + '$; sumando, $c_2 = ' + d.c2.tex() + '$.',
        'El residuo es cero: con tantos coeficientes como datos, el ajuste deja de promediar y se limita a interpolar.'];
    },
    answer: function (d) { return 'c₀ = ' + d.c0.toString() + ', c₁ = ' + d.c1.toString() + ', c₂ = ' + d.c2.toString(); }
  });

  p.exercise({
    title: '¿Es la solución de mínimos cuadrados?',
    level: 'avanzado',
    gen: function (r) {
      var y = [r.int(-3, 4), r.int(-3, 4), r.int(-3, 4)];
      var c1 = ML.F(y[2] - y[0], 2), c0 = ML.F(y[0] + y[1] + y[2], 3).sub(c1);
      var buena = r.bool(0.5), x0 = buena ? c0 : c0.add(ML.F(r.pm(1, 2), 2)), x1 = buena ? c1 : c1;
      if (!buena && r.bool(0.5)) { x0 = c0; x1 = c1.add(ML.F(r.pm(1, 2), 2)); }
      var res = [0, 1, 2].map(function (t) { return ML.F(y[t]).sub(x0).sub(x1.mul(t)); });
      var d1 = res[0].add(res[1]).add(res[2]), d2 = res[1].add(res[2].mul(2));
      return { y: y, x0: x0, x1: x1, d1: d1, d2: d2, ok: d1.n === 0 && d2.n === 0 ? 'si' : 'no' };
    },
    ask: function (d) {
      return 'Para los puntos $(0,\\ ' + d.y[0] + ')$, $(1,\\ ' + d.y[1] + ')$ y $(2,\\ ' + d.y[2] + ')$, alguien propone la recta $y = ' + d.x0.tex() + ' + ' + d.x1.texp() +
        '\\,t$. Calcula los productos escalares del residuo con las dos columnas de $A$, $\\vec a_1 = (1, 1, 1)$ y $\\vec a_2 = (0, 1, 2)$. ¿Es la recta de mínimos cuadrados?';
    },
    fields: [{ name: 'd1', label: '$\\vec a_1\\cdot\\vec r$', w: 'tiny' }, { name: 'd2', label: '$\\vec a_2\\cdot\\vec r$', w: 'tiny' }, { name: 't', label: '¿Es la de mínimos cuadrados?', opts: [{ t: 'Sí', v: 'si' }, { t: 'No', v: 'no' }] }],
    sol: function (d) { return { d1: d.d1.val(), d2: d.d2.val(), t: d.ok }; },
    tol: 1e-9,
    hint: function () { return ['Residuo: $r_i = y_i - (c_0 + c_1 t_i)$ para cada punto.', 'Es la recta de mínimos cuadrados si y solo si los dos productos escalares valen 0.']; },
    steps: function (d) {
      return ['Residuos: $' + [0, 1, 2].map(function (t) { return ML.F(d.y[t]).sub(d.x0).sub(d.x1.mul(t)).tex(); }).join(',\\ ') + '$',
        '$\\vec a_1\\cdot\\vec r = ' + d.d1.tex() + '$, $\\vec a_2\\cdot\\vec r = ' + d.d2.tex() + '$',
        d.ok === 'si' ? 'Los dos son 0: el residuo es perpendicular al espacio columna. <strong>Sí</strong> es la solución de mínimos cuadrados.' : 'Alguno no es 0: el residuo no es perpendicular a las columnas y hay rectas mejores. <strong>No</strong> es la solución.'];
    },
    answer: function (d) { return d.d1.toString() + ', ' + d.d2.toString() + '; ' + (d.ok === 'si' ? 'sí' : 'no'); }
  });

  p.keys([
    'Un ajuste con más datos que coeficientes es un sistema $A\\vec x = \\vec b$ incompatible: $\\vec b$ no está en el espacio columna.',
    'La mejor aproximación es la proyección ortogonal de $\\vec b$ sobre el espacio columna; el residuo es perpendicular a todas las columnas.',
    'Eso da las ecuaciones normales: $A^tA\\,\\hat x = A^t\\vec b$.',
    'El modelo solo tiene que ser lineal en los coeficientes: rectas, parábolas o combinaciones de senos se ajustan igual.'
  ]);
});
