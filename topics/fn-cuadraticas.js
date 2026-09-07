/* Tema: Funciones cuadráticas */
Course.topic('fn-cuadraticas', function (p) {

  p.text('Después de la recta, la curva más importante: la <strong>parábola</strong>. Es la gráfica ' +
    'de cualquier función de segundo grado.');

  p.formula('f(x) = ax^2 + bx + c \\qquad (a \\ne 0)');

  p.text('Aparece por todas partes en el mundo real porque describe el <em>movimiento bajo gravedad ' +
    'constante</em>: la trayectoria de una pelota, un chorro de agua, un proyectil. También es la ' +
    'forma de las antenas parabólicas y de los faros de los coches, por una propiedad óptica preciosa: ' +
    'todos los rayos paralelos al eje se concentran en el foco.');

  p.section('Los elementos de la parábola');
  p.text('Toda parábola tiene los mismos cuatro elementos, y con ellos se dibuja sin dar valores. Antes ' +
    'de la lista, quédate con lo que hace cada coeficiente: el de $x^2$ decide si abre hacia arriba ' +
    'o hacia abajo y cómo de estrecha es, y el término independiente marca por dónde corta al eje ' +
    'vertical. El del medio es el que menos se ve a simple vista y el que decide dónde cae el ' +
    'vértice.');


  p.list([
    '<strong>Orientación</strong>: si $a>0$ se abre hacia arriba (tiene mínimo); si $a<0$, hacia abajo (tiene máximo).',
    '<strong>Anchura</strong>: cuanto mayor es $|a|$, más estrecha.',
    '<strong>Vértice</strong>: el punto más alto o más bajo. Su abscisa es $x_v = -\\dfrac{b}{2a}$.',
    '<strong>Eje de simetría</strong>: la vertical que pasa por el vértice, $x = x_v$.',
    '<strong>Corte con el eje Y</strong>: el punto $(0, c)$.',
    '<strong>Cortes con el eje X</strong>: las raíces de $ax^2+bx+c = 0$ (puede haber dos, una o ninguna).'
  ]);

  p.formula('x_v = -\\frac{b}{2a}, \\qquad y_v = f(x_v)', 'el vértice');

  p.note('¿De dónde sale $-\\frac{b}{2a}$? De la simetría: si hay dos raíces, el vértice está justo ' +
    'en medio, y el punto medio de $\\frac{-b\\pm\\sqrt{\\Delta}}{2a}$ es $\\frac{-b}{2a}$ porque las ' +
    'raíces se van. Y si no hay raíces, la fórmula sigue valiendo.', null, 'Por qué esa fórmula');

  p.demo({
    title: 'Los tres coeficientes',
    intro: 'Mueve a, b y c por separado y descubre qué controla cada uno. Fíjate en que c sube y baja la curva sin deformarla, pero b la desplaza en diagonal.',
    build: function (host, d) {
      var a = 1, b = -2, c = -3;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -8, xmax: 8, ymin: -10, ymax: 10, height: 330,
        draw: function (g) {
          var f = function (x) { return a * x * x + b * x + c; };
          g.fn(f, { color: 0, w: 2.8 });
          var xv = -b / (2 * a), yv = f(xv);
          g.vline(xv, { color: 3, w: 1.4, dash: true });
          g.point(xv, yv, { color: 2, r: 6, label: 'V', labelDy: a > 0 ? 16 : -16 });
          g.point(0, c, { color: 1, r: 5 });
          var s = ML.quadratic(a, b, c);
          if (s.n >= 1) {
            g.point(s.x1, 0, { color: 4, r: 5 });
            if (s.n === 2) g.point(s.x2, 0, { color: 4, r: 5 });
          }
        }
      });
      function paint() {
        var xv = -b / (2 * a), yv = a * xv * xv + b * xv + c;
        var s = ML.quadratic(a, b, c);
        out.set('$f(x) = ' + ML.polyTex([a, b, c]) + '$<br>' +
          'Vértice: $\\left(' + U.fmt(xv, 3) + ', ' + U.fmt(yv, 3) + '\\right)$ — es un <strong>' +
          (a > 0 ? 'mínimo' : 'máximo') + '</strong><br>' +
          'Corta al eje Y en $(0, ' + U.fmt(c, 2) + ')$ &nbsp;·&nbsp; ' +
          (s.n === 2 ? 'corta al eje X en $' + U.fmt(Math.min(s.x1, s.x2), 3) + '$ y $' + U.fmt(Math.max(s.x1, s.x2), 3) + '$'
            : (s.n === 1 ? 'toca el eje X en $' + U.fmt(s.x1, 3) + '$' : 'no corta al eje X')));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a (abertura)', min: -3, max: 3, step: 0.25, value: 1, dec: 2, on: function (v) { a = v || 0.25; paint(); } });
      W.slider(row, { label: 'b', min: -8, max: 8, step: 0.5, value: -2, dec: 1, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'c (corte con Y)', min: -8, max: 8, step: 0.5, value: -3, dec: 1, on: function (v) { c = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Optimizar: para qué sirve el vértice');

  p.text('Muchísimos problemas prácticos se reducen a «¿cuál es el valor máximo (o mínimo) de esta ' +
    'cantidad?». Si la cantidad depende cuadráticamente de una variable, la respuesta está ' +
    '<strong>siempre</strong> en el vértice. No hace falta probar valores ni derivar: basta con ' +
    '$x_v = -\\frac{b}{2a}$.');

  p.demo({
    title: 'El corral más grande con la valla que tengo',
    intro: 'Con una longitud fija de valla, ¿qué forma da más superficie? Mueve la base y observa el área. El máximo está en el vértice de la parábola.',
    build: function (host, d) {
      var P = 40;
      var x = 8;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 21, ymin: 0, ymax: 115, height: 280,
        xlabel: 'base x (m)', ylabel: 'área (m²)',
        draw: function (g) {
          var f = function (t) { return t * (P / 2 - t); };
          g.fn(f, { from: 0, to: P / 2, color: 0, w: 2.6 });
          var xv = P / 4;
          g.point(xv, f(xv), { color: 2, r: 6, label: 'máximo', labelDy: -14 });
          g.point(x, f(x), { color: 1, r: 6 });
          g.seg(x, 0, x, f(x), { color: 1, w: 1.4, dash: true });
        }
      });
      function paint() {
        var alto = P / 2 - x;
        var area = x * alto;
        out.set('Perímetro fijo de $' + P + '$ m. Base $x = ' + U.fmt(x, 1) + '$ m → altura $' +
          U.fmt(alto, 1) + '$ m → <strong>área $' + U.fmt(area, 2) + '$ m²</strong><br>' +
          '$A(x) = x\\left(\\dfrac{' + P + '}{2} - x\\right) = -x^2 + ' + (P / 2) + 'x$, ' +
          'con vértice en $x = \\dfrac{' + (P / 2) + '}{2} = ' + (P / 4) + '$<br>' +
          (Math.abs(x - P / 4) < 0.3
            ? '<strong style="color:var(--ok)">Es el cuadrado, y es el que más área encierra: ' + (P * P / 16) + ' m².</strong>'
            : 'El máximo se alcanza con base $' + (P / 4) + '$ m (un cuadrado), dando $' + (P * P / 16) + '$ m².'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'base x (m)', min: 1, max: 19, step: 0.5, value: 8, dec: 1, on: function (v) { x = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('El vértice es «lo mejor posible», y por eso esta es la primera optimización que aprende ' +
    'cualquier estudiante. Con una longitud fija de valla, el rectángulo de área máxima es el ' +
    'cuadrado, y sale del vértice de una parábola; con un presupuesto fijo de publicidad, el ' +
    'beneficio máximo también. La trayectoria de cualquier proyectil es una parábola y su vértice es ' +
    'la altura máxima: es la cuenta que hace la artillería, y también la que hace un jugador de ' +
    'baloncesto sin saberlo.');

  p.hist('Que un proyectil describe una parábola lo demostró Galileo hacia 1638, y fue mucho más ' +
    'subversivo de lo que parece: contradecía la física de Aristóteles, según la cual el proyectil ' +
    'iba recto hasta agotar su impulso y luego caía a plomo. Galileo comprendió que el movimiento se ' +
    'descompone en dos independientes, uno horizontal uniforme y otro vertical acelerado, y que de ' +
    'combinarlos sale una parábola. Es la primera vez que una curva matemática describe un fenómeno ' +
    'físico real.');

  p.section('Practica');

  p.exercise({
    title: 'Vértice y orientación',
    level: 'basico',
    gen: function (r) {
      var a = r.nz(-4, 4), b = r.pm(0, 12), c = r.pm(0, 10);
      if (b % (2 * a) !== 0) return null;
      var xv = -b / (2 * a);
      return { a: a, b: b, c: c, xv: xv, yv: a * xv * xv + b * xv + c };
    },
    ask: function (d) {
      return 'Halla el vértice de $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) + '$ y di si es un máximo ' +
        'o un mínimo.<br><span style="font-size:14px;color:var(--ink-faint)">Para lo último escribe ' +
        '<code>1</code> si es mínimo o <code>2</code> si es máximo.</span>';
    },
    fields: [
      { name: 'x', label: 'x del vértice', w: 'tiny' },
      { name: 'y', label: 'y del vértice', w: 'tiny' },
      { name: 't', label: 'Tipo (1 o 2)', w: 'tiny' }
    ],
    sol: function (d) { return { x: d.xv, y: d.yv, t: d.a > 0 ? 1 : 2 }; },
    tol: 1e-6,
    hint: function (d) { return '$x_v = -\\frac{b}{2a}$. Y el signo de $a$ decide: positivo abre hacia arriba (mínimo).'; },
    steps: function (d) {
      return ['$x_v = -\\dfrac{b}{2a} = -\\dfrac{' + d.b + '}{2 \\cdot (' + d.a + ')} = ' + d.xv + '$',
        '$y_v = f(' + d.xv + ') = ' + d.yv + '$',
        'Como $a = ' + d.a + (d.a > 0 ? ' > 0$, la parábola se abre hacia arriba: el vértice es un <strong>mínimo</strong>.'
          : ' < 0$, la parábola se abre hacia abajo: el vértice es un <strong>máximo</strong>.')];
    },
    answer: function (d) {
      return 'Vértice $(' + d.xv + ', ' + d.yv + ')$, ' + (d.a > 0 ? 'mínimo' : 'máximo') + '.';
    }
  });

  p.exercise({
    title: 'Cortes con los ejes',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pm(1, 6), x2 = r.pm(1, 6);
      if (x1 === x2) return null;
      var a = r.pick([1, 1, -1, 2]);
      return { a: a, b: -a * (x1 + x2), c: a * x1 * x2, x1: Math.min(x1, x2), x2: Math.max(x1, x2) };
    },
    ask: function (d) {
      return 'Halla los cortes de $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) + '$ con el eje X, ' +
        'de menor a mayor.';
    },
    fields: [{ name: 'a', label: 'Corte menor', w: 'tiny' }, { name: 'b', label: 'Corte mayor', w: 'tiny' }],
    sol: function (d) { return { a: d.x1, b: d.x2 }; },
    tol: 1e-6,
    hint: function () { return 'Los cortes con el eje X son las soluciones de $f(x)=0$.'; },
    steps: function (d) {
      var D = d.b * d.b - 4 * d.a * d.c;
      return ['Igualamos a cero: $' + ML.polyTex([d.a, d.b, d.c]) + ' = 0$.',
        'Discriminante: $\\Delta = ' + D + ' > 0$, así que hay dos cortes.',
        'Aplicando la fórmula general salen $x = ' + d.x1 + '$ y $x = ' + d.x2 + '$.',
        'Puntos: $(' + d.x1 + ', 0)$ y $(' + d.x2 + ', 0)$. El vértice está justo en medio, en $x = ' +
        U.fmt((d.x1 + d.x2) / 2, 3) + '$.'];
    },
    answer: function (d) { return '(' + d.x1 + ', 0) y (' + d.x2 + ', 0)'; }
  });

  p.exercise({
    title: 'Problema de optimización',
    level: 'avanzado',
    gen: function (r) {
      var P = r.int(5, 30) * 4;
      return { P: P, x: P / 4, area: P * P / 16 };
    },
    ask: function (d) {
      return 'Con $' + d.P + '$ metros de valla queremos cerrar un terreno <strong>rectangular</strong> ' +
        'de la mayor superficie posible. ¿Cuánto debe medir cada lado y cuál es esa superficie máxima?';
    },
    fields: [{ name: 'l', label: 'Lado (m)', w: 'tiny' }, { name: 'a', label: 'Área (m²)', w: 'tiny' }],
    sol: function (d) { return { l: d.x, a: d.area }; },
    tol: 1e-6,
    hint: function (d) { return 'Si la base es $x$, la altura es $' + (d.P / 2) + ' - x$. El área es una parábola en $x$: busca su vértice.'; },
    steps: function (d) {
      return ['Llamamos $x$ a la base. Como el perímetro es $' + d.P + '$, la altura es $\\frac{' + d.P + '}{2} - x = ' + (d.P / 2) + ' - x$.',
        'Área: $A(x) = x\\left(' + (d.P / 2) + ' - x\\right) = -x^2 + ' + (d.P / 2) + 'x$.',
        'Es una parábola con $a = -1 < 0$: tiene un máximo en el vértice.',
        '$x_v = -\\dfrac{' + (d.P / 2) + '}{2\\cdot(-1)} = ' + d.x + '$ m.',
        'La altura sale también $' + d.x + '$ m: <strong>el rectángulo óptimo es un cuadrado</strong>.',
        'Área máxima: $' + d.x + '^2 = ' + d.area + '$ m².'];
    },
    answer: function (d) { return 'Cuadrado de ' + d.x + ' m de lado, con ' + d.area + ' m² de área.'; }
  });

  p.exercise({
    title: 'Tiro parabólico',
    level: 'avanzado',
    gen: function (r) {
      var v0 = r.int(10, 40), h0 = r.int(0, 20);
      // h(t) = -5t^2 + v0 t + h0  (g ≈ 10)
      var tv = v0 / 10;
      return { v0: v0, h0: h0, tv: tv, hmax: -5 * tv * tv + v0 * tv + h0 };
    },
    ask: function (d) {
      return 'Se lanza un objeto hacia arriba y su altura viene dada por $h(t) = -5t^2 + ' + d.v0 +
        't + ' + d.h0 + '$ (metros, con $t$ en segundos). ¿En qué instante alcanza la altura máxima ' +
        'y cuál es esa altura? (cuatro decimales)';
    },
    fields: [{ name: 't', label: 'Instante (s)', w: 'tiny' }, { name: 'h', label: 'Altura máxima (m)', w: 'tiny' }],
    sol: function (d) { return { t: U.round(d.tv, 4), h: U.round(d.hmax, 4) }; },
    tol: 3e-4,
    hint: function () { return 'La altura máxima está en el vértice de la parábola: $t = -\\frac{b}{2a}$.'; },
    steps: function (d) {
      return ['Aquí $a = -5$ y $b = ' + d.v0 + '$.',
        '$t_v = -\\dfrac{' + d.v0 + '}{2\\cdot(-5)} = \\dfrac{' + d.v0 + '}{10} = ' + U.fmt(d.tv, 4) + '$ s.',
        '$h(' + U.fmt(d.tv, 4) + ') = -5\\cdot' + U.fmt(d.tv * d.tv, 4) + ' + ' + d.v0 + '\\cdot' + U.fmt(d.tv, 4) + ' + ' + d.h0 + '$',
        '$= ' + U.fmt(d.hmax, 4) + '$ m',
        'Como $a<0$, la parábola se abre hacia abajo: efectivamente es un máximo.'];
    },
    answer: function (d) { return 'A los ' + U.fmt(d.tv, 4) + ' s, con ' + U.fmt(d.hmax, 4) + ' m.'; }
  });

  p.keys([
    'La parábola $f(x)=ax^2+bx+c$: $a$ decide la orientación y la anchura, $c$ el corte con el eje Y.',
    'Vértice en $x_v = -\\frac{b}{2a}$: mínimo si $a>0$, máximo si $a<0$.',
    'Los cortes con el eje X son las raíces de la ecuación de segundo grado.',
    'El eje de simetría pasa por el vértice; las raíces son simétricas respecto a él.',
    'Todo problema de máximo o mínimo con dependencia cuadrática se resuelve con el vértice.',
    'La trayectoria de cualquier objeto lanzado bajo gravedad constante es una parábola.'
  ]);
});
