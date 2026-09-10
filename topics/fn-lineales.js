/* Tema: Funciones lineales y afines */
Course.topic('fn-lineales', function (p) {

  p.text('La función más sencilla que existe, y también la más útil: aquella cuya gráfica es una ' +
    '<strong>recta</strong>. Se escribe siempre igual:');

  p.formula('y = mx + n', 'ecuación explícita de la recta');

  p.list([
    '$m$ es la <strong>pendiente</strong>: cuánto sube (o baja) la $y$ cada vez que la $x$ avanza una unidad.',
    '$n$ es la <strong>ordenada en el origen</strong>: el valor donde la recta corta al eje Y.'
  ]);

  p.text('Si $n = 0$ la función se llama <em>lineal</em> (pasa por el origen y es una ' +
    'proporcionalidad directa); si $n \\ne 0$, <em>afín</em>.');

  p.demo({
    title: 'Qué hacen la pendiente y la ordenada',
    intro: 'Mueve los dos parámetros. La pendiente inclina la recta; la ordenada la sube y la baja sin cambiar su inclinación.',
    build: function (host, d) {
      var m = 1, n = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -8, xmax: 8, ymin: -6, ymax: 6, height: 320,
        draw: function (g) {
          g.fn(function (x) { return m * x + n; }, { color: 0, w: 2.8 });
          g.point(0, n, { color: 2, r: 5.5, label: 'n = ' + U.fmt(n, 1), labelDx: -12, labelDy: -14, labelAlign: 'right' });
          // triangulo de la pendiente
          g.seg(1, m + n, 2, m + n, { color: 3, w: 2 });
          g.seg(2, m + n, 2, 2 * m + n, { color: 3, w: 2 });
          g.text(1.5, m + n - 0.35, '1', { align: 'center', color: 3, size: 12, box: true });
          g.text(2.2, 1.5 * m + n, 'm = ' + U.fmt(m, 1), { align: 'left', color: 3, size: 12, box: true });
          if (Math.abs(m) > 1e-9) {
            var raiz = -n / m;
            if (Math.abs(raiz) < 8) g.point(raiz, 0, { color: 1, r: 4.5 });
          }
        }
      });
      function paint() {
        out.set('$y = ' + ML.termTex(m, 'x', 1, true) + (n ? ML.termTex(n, '', 0, false) : '') + '$' +
          '<br>' + (m > 0 ? 'Pendiente positiva → la recta <strong>sube</strong>'
            : (m < 0 ? 'Pendiente negativa → la recta <strong>baja</strong>'
              : 'Pendiente cero → recta <strong>horizontal</strong>')) +
          '. Corta al eje Y en $' + U.fmt(n, 1) + '$' +
          (Math.abs(m) > 1e-9 ? ' y al eje X en $' + U.fmt(-n / m, 3) + '$.' : '.'));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'pendiente m', min: -4, max: 4, step: 0.25, value: m, dec: 2, on: function (v) { m = v; paint(); } });
      W.slider(row, { label: 'ordenada n', min: -5, max: 5, step: 0.5, value: n, dec: 1, on: function (v) { n = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Calcular la pendiente');

  p.text('Si conoces dos puntos de la recta, la pendiente es el cociente entre lo que sube y lo que ' +
    'avanza. Se llama, con toda lógica, «incremento de y partido por incremento de x».');

  p.formula('m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}');

  p.note('La pendiente es la primera aparición de una idea enorme: mide <strong>el ritmo al que cambia ' +
    'una cosa respecto de otra</strong>. Cuando esa idea se aplique a curvas y no solo a rectas, se ' +
    'llamará <em>derivada</em>, y es el corazón del bloque de análisis.', 'ok', 'Hacia dónde lleva esto');

  p.text('Con la pendiente y un punto $(x_1,y_1)$ ya se tiene la recta entera:');

  p.formula('y - y_1 = m\\,(x - x_1)', 'ecuación punto-pendiente');

  p.demo({
    title: 'La recta que pasa por dos puntos',
    intro: 'Arrastra los dos puntos y observa cómo cambian la pendiente y la ecuación.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.plot(host, {
        xmin: -8, xmax: 8, ymin: -6, ymax: 6, height: 330,
        handles: {
          A: { x: -3, y: -2, label: 'A', color: 0, constrain: snap },
          B: { x: 3, y: 2, label: 'B', color: 1, constrain: snap }
        },
        draw: function (g) {
          var A = g.h('A'), B = g.h('B');
          if (Math.abs(B.x - A.x) < 1e-9) {
            g.vline(A.x, { color: 2, w: 2.6 });
            out.set('Los dos puntos tienen la misma $x$: la recta es <strong>vertical</strong> ' +
              '($x = ' + A.x + '$) y no se puede escribir como $y = mx+n$: su pendiente es infinita.');
            return;
          }
          var m = (B.y - A.y) / (B.x - A.x);
          var n = A.y - m * A.x;
          g.fn(function (x) { return m * x + n; }, { color: 2, w: 2.6 });
          g.seg(A.x, A.y, B.x, A.y, { color: 3, w: 1.8, dash: true });
          g.seg(B.x, A.y, B.x, B.y, { color: 3, w: 1.8, dash: true });
          g.text((A.x + B.x) / 2, A.y - 0.4, 'Δx = ' + U.fmt(B.x - A.x, 1), { align: 'center', color: 3, size: 12, box: true });
          g.text(B.x + 0.25, (A.y + B.y) / 2, 'Δy = ' + U.fmt(B.y - A.y, 1), { align: 'left', color: 3, size: 12, box: true });
          out.set('$m = \\dfrac{' + U.fmt(B.y - A.y, 1) + '}{' + U.fmt(B.x - A.x, 1) + '} = ' + U.fmt(m, 4) + '$' +
            ' &nbsp;·&nbsp; $y = ' + U.fmt(m, 3) + 'x ' + (n >= 0 ? '+ ' : '- ') + U.fmt(Math.abs(n), 3) + '$');
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
    }
  });

  p.util('La pendiente es la respuesta a «¿cuánto sube por cada unidad que avanzo?», y con ese nombre ' +
    'aparece en todas partes: el 12 % de una señal de tráfico, la tarifa de un taxi por kilómetro, ' +
    'el consumo por hora de un aparato, los euros por unidad de una factura. Cuando alguien dice «me ' +
    'cobran tanto fijo más tanto por cada uno» está describiendo una recta, y la pendiente es la ' +
    'parte variable.');

  p.hist('La palabra <em>función</em> la introdujo Leibniz en 1673, y durante más de un siglo significó ' +
    'algo bastante más estrecho que hoy: una expresión construida con operaciones conocidas. La ' +
    'definición moderna —una regla cualquiera que asigna a cada entrada una salida, tenga o no ' +
    'fórmula— es de Dirichlet, en 1837, y fue revolucionaria porque permitía funciones que no se ' +
    'pueden escribir. Sin ella no existiría la matemática del siglo XX.');

  p.section('Rectas paralelas y perpendiculares');
  p.text('Dos rectas son paralelas cuando suben igual, así que basta con que tengan la misma pendiente: ' +
    'eso no sorprende a nadie. Lo de las perpendiculares es menos evidente y merece una explicación. ' +
    'Girar una recta un ángulo recto convierte su avance en subida y su subida en avance, cambiando ' +
    'además el sentido; por eso la pendiente se da la vuelta y cambia de signo.');


  p.formulas([
    '\\text{paralelas:}\\quad m_1 = m_2',
    '\\text{perpendiculares:}\\quad m_1 \\cdot m_2 = -1 \\ \\Longleftrightarrow\\ m_2 = -\\frac{1}{m_1}'
  ]);

  p.text('Lo de las perpendiculares tiene sentido: si una recta sube 2 por cada 1 que avanza, la ' +
    'perpendicular tiene que avanzar 2 por cada 1 que baja. Se intercambian los papeles y cambia el signo.');

  /* ================= EJERCICIOS ================= */
  p.util('Que dos rectas perpendiculares tengan pendientes cuyo producto es $-1$ es lo que permite a un ' +
    'programa de diseño trazar una perpendicular exacta, y a un robot calcular la dirección en la ' +
    'que debe apartarse de un obstáculo. En estadística, la recta de regresión que verás más ' +
    'adelante se define minimizando distancias perpendiculares o verticales a ella, y de nuevo hace ' +
    'falta esta relación.');

  p.section('Practica');

  p.exercise({
    title: 'Corte con los ejes',
    level: 'basico',
    gen: function (r) {
      var m = r.nz(-6, 6), n = r.nz(-12, 12);
      if (n % m !== 0) return null;
      return { m: m, n: n, raiz: -n / m };
    },
    ask: function (d) {
      return 'La recta $y = ' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) +
        '$ corta al eje X en un punto. ¿Cuál es su abscisa?';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.raiz }; },
    hint: function () { return 'En el eje X la altura es cero: resuelve $mx+n = 0$.'; },
    steps: function (d) {
      return ['En el eje X se cumple $y = 0$.',
        '$' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + ' = 0$',
        '$' + ML.termTex(d.m, 'x', 1, true) + ' = ' + (-d.n) + ' \\Rightarrow x = ' + d.raiz + '$'];
    },
    answer: function (d) { return 'x = ' + d.raiz; }
  });

  p.exercise({
    title: 'Pendiente y ordenada a partir de dos puntos',
    level: 'medio',
    gen: function (r) {
      var m = ML.F(r.nz(-6, 6), r.pick([1, 1, 1, 2]));
      var x1 = r.pm(0, 6);
      var n = r.pm(0, 6);
      var dx = r.pick([2, 4]) * m.d;
      var y1 = m.val() * x1 + n, y2 = m.val() * (x1 + dx) + n;
      if (!Number.isInteger(y1) || !Number.isInteger(y2)) return null;
      return { x1: x1, y1: y1, x2: x1 + dx, y2: y2, m: m.val(), n: n };
    },
    ask: function (d) {
      return 'La recta pasa por $A(' + d.x1 + ', ' + d.y1 + ')$ y $B(' + d.x2 + ', ' + d.y2 + ')$. ' +
        'Halla su pendiente y su ordenada en el origen.';
    },
    fields: [{ name: 'm', label: 'Pendiente m', w: 'tiny' }, { name: 'n', label: 'Ordenada n', w: 'tiny' }],
    sol: function (d) { return { m: d.m, n: d.n }; },
    tol: 1e-6,
    hint: function () { return '$m = \\dfrac{y_2-y_1}{x_2-x_1}$. Después usa un punto para despejar $n$.'; },
    steps: function (d) {
      return ['$m = \\dfrac{' + d.y2 + ' - (' + d.y1 + ')}{' + d.x2 + ' - (' + d.x1 + ')} = \\dfrac{' +
        (d.y2 - d.y1) + '}{' + (d.x2 - d.x1) + '} = ' + U.fmt(d.m, 4) + '$',
        'Sustituimos el punto $A$ en $y = mx+n$: $' + d.y1 + ' = ' + U.fmt(d.m, 4) + '\\cdot(' + d.x1 + ') + n$.',
        '$n = ' + U.fmt(d.n, 4) + '$',
        'La recta es $y = ' + U.fmt(d.m, 4) + 'x ' + (d.n >= 0 ? '+ ' + d.n : '- ' + (-d.n)) + '$.'];
    },
    answer: function (d) { return 'm = ' + U.fmt(d.m, 4) + ', n = ' + U.fmt(d.n, 4); }
  });

  p.exercise({
    title: 'Paralelas y perpendiculares',
    level: 'medio',
    gen: function (r) {
      var m = ML.F(r.nz(-6, 6), r.pick([1, 1, 2, 3]));
      var quiere = r.bool();
      return { m: m.val(), mn: m.n, md: m.d, perp: quiere, res: quiere ? -1 / m.val() : m.val() };
    },
    ask: function (d) {
      return 'Halla la pendiente de una recta ' + (d.perp ? '<strong>perpendicular</strong>' : '<strong>paralela</strong>') +
        ' a $y = ' + (d.md === 1 ? d.mn : '\\frac{' + d.mn + '}{' + d.md + '}') + 'x + 3$.';
    },
    fields: [{ name: 'm', label: 'Pendiente', w: 'tiny' }],
    sol: function (d) { return { m: d.res }; },
    tol: 1e-6,
    hint: function (d) { return d.perp ? 'La perpendicular tiene pendiente $-1/m$.' : 'Las paralelas tienen la misma pendiente.'; },
    steps: function (d) {
      if (!d.perp) return ['Dos rectas son paralelas cuando tienen la misma pendiente.',
        'Por tanto $m = ' + U.fmt(d.m, 4) + '$.'];
      return ['Para que sean perpendiculares: $m_1\\cdot m_2 = -1$.',
        '$m_2 = -\\dfrac{1}{' + U.fmt(d.m, 4) + '} = ' + U.fmt(d.res, 4) + '$',
        'Fíjate: se le da la vuelta a la fracción y se cambia el signo.'];
    },
    answer: function (d) { return U.fmt(d.res, 4); }
  });

  p.exercise({
    title: 'Un modelo lineal de la vida real',
    level: 'avanzado',
    gen: function (r) {
      var fijo = r.int(2, 25), porKm = r.pick([0.5, 0.8, 1, 1.2, 1.5, 2]);
      var km = r.int(3, 40);
      return { fijo: fijo, porKm: porKm, km: km, res: U.round(fijo + porKm * km, 2) };
    },
    ask: function (d) {
      return 'Un taxi cobra $' + d.fijo + '$ € de bajada de bandera y $' + U.fmt(d.porKm, 2) +
        '$ € por kilómetro. Escribe la función del precio y calcula cuánto cuesta un viaje de $' +
        d.km + '$ km.';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: 0, xmax: 45, ymin: 0, ymax: d.fijo + d.porKm * 45 + 4, height: 210,
        xlabel: 'km', ylabel: '€',
        draw: function (g) {
          g.fn(function (x) { return d.fijo + d.porKm * x; }, { color: 0, w: 2.6 });
          g.point(0, d.fijo, { color: 2, r: 4.5 });
          g.point(d.km, d.res, { color: 1, r: 5.5 });
          g.seg(d.km, 0, d.km, d.res, { color: 1, w: 1.4, dash: true });
        }
      });
    },
    fields: [{ name: 'v', label: 'Precio (€)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-4,
    hint: function (d) { return 'La bajada de bandera es la ordenada en el origen; el precio por km, la pendiente.'; },
    steps: function (d) {
      return ['El precio fijo se paga siempre: es la ordenada en el origen, $n = ' + d.fijo + '$.',
        'Cada kilómetro añade $' + U.fmt(d.porKm, 2) + '$ €: esa es la pendiente.',
        '$P(x) = ' + U.fmt(d.porKm, 2) + 'x + ' + d.fijo + '$',
        '$P(' + d.km + ') = ' + U.fmt(d.porKm, 2) + '\\cdot' + d.km + ' + ' + d.fijo + ' = ' + U.fmt(d.res, 2) + '$ €'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' €'; }
  });

  p.keys([
    '$y = mx+n$: $m$ inclina, $n$ desplaza arriba y abajo.',
    '$m = \\dfrac{\\Delta y}{\\Delta x}$ mide el ritmo de cambio. Es el germen de la derivada.',
    'Punto-pendiente: $y - y_1 = m(x-x_1)$ da la recta con un punto y la pendiente.',
    'Paralelas: misma $m$. Perpendiculares: $m_1m_2 = -1$.',
    'Toda situación con una cantidad fija más otra proporcional es un modelo lineal.'
  ]);
});
