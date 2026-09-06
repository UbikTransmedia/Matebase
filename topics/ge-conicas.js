/* Tema: Cónicas */
Course.topic('ge-conicas', function (p) {

  p.text('Coge un cono y córtalo con un plano. Según la inclinación del corte salen cuatro curvas ' +
    'distintas: <strong>circunferencia, elipse, parábola e hipérbola</strong>. Por eso se llaman ' +
    '<em>cónicas</em>. Que estas cuatro curvas tan distintas sean la misma cosa mirada de otra manera ' +
    'es uno de los descubrimientos más bonitos de la geometría griega.');

  p.demo({
    title: 'Cortar el cono',
    intro: 'Inclina el plano de corte y mira qué curva aparece. La familia entera depende de un solo ángulo.',
    build: function (host, d) {
      var incl = 0;
      var out = W.readout(host, '');
      var textos = [
        { n: 'Circunferencia', t: 'Corte perpendicular al eje. Todos los puntos están a la misma distancia del centro.', e: 'e = 0' },
        { n: 'Elipse', t: 'Corte inclinado pero menos que la generatriz: la curva se cierra.', e: '0 < e < 1' },
        { n: 'Parábola', t: 'Corte exactamente paralelo a la generatriz: la curva ya no se cierra.', e: 'e = 1' },
        { n: 'Hipérbola', t: 'Corte más inclinado que la generatriz: alcanza las dos hojas del cono y salen dos ramas.', e: 'e > 1' }
      ];
      var plot = W.board(host, {
        xmin: -4.5, xmax: 4.5, ymin: -3.4, ymax: 3.4, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          // cono visto de perfil (dos rectas) y el plano de corte
          g.seg(-3, -3, 3, 3, { color: 'axis', w: 2 });
          g.seg(3, -3, -3, 3, { color: 'axis', w: 2 });
          g.seg(0, -3.2, 0, 3.2, { color: 'axis', w: 1, dash: true });
          var m = [0, 0.45, 1, 1.8][incl];
          g.fn(function (x) { return m * x + 1; }, { color: 1, w: 3 });
          g.text(0, 3.05, 'plano de corte', { align: 'center', size: 12, color: 1 });
        }
      });
      var plot2 = W.board(host, {
        xmin: -4, xmax: 4, ymin: -3, ymax: 3, height: 280,
        draw: function (g) {
          if (incl === 0) g.circle(0, 0, 2, { color: 0, w: 2.6, stroke: true });
          else if (incl === 1) g.param(function (t) { return 2.8 * Math.cos(t); }, function (t) { return 1.7 * Math.sin(t); }, 0, 6.2832, { color: 0, w: 2.6 });
          else if (incl === 2) g.fn(function (x) { return 0.45 * x * x - 2; }, { color: 0, w: 2.6 });
          else {
            g.fn(function (x) { return Math.abs(x) > 1.2 ? 1.2 * Math.sqrt(x * x / 1.44 - 1) : NaN; }, { color: 0, w: 2.6 });
            g.fn(function (x) { return Math.abs(x) > 1.2 ? -1.2 * Math.sqrt(x * x / 1.44 - 1) : NaN; }, { color: 0, w: 2.6 });
          }
        }
      });
      function paint() {
        var t = textos[incl];
        out.set('<strong>' + t.n + '</strong> ($' + t.e + '$) — ' + t.t);
        plot.render(); plot2.render();
      }
      W.chips(host, [
        { label: 'circunferencia', value: 0 }, { label: 'elipse', value: 1 },
        { label: 'parábola', value: 2 }, { label: 'hipérbola', value: 3 }
      ], { value: 0, on: function (v) { incl = v; paint(); } });
      paint();
    }
  });

  p.hist('Apolonio de Perga escribió las <em>Cónicas</em> hacia el 200 a.C.: ocho libros, y les puso ' +
    'los nombres que seguimos usando. Durante 1800 años fueron matemática pura sin aplicación ' +
    'conocida. Hasta que en 1609 Kepler descubrió que los planetas describen <strong>elipses</strong>, ' +
    'y Galileo que los proyectiles siguen <strong>parábolas</strong>. Es el ejemplo favorito de los ' +
    'matemáticos para defender la investigación sin aplicación inmediata.');

  /* ---------------------------------------------------------------- */
  p.section('Cada cónica como lugar geométrico');

  p.text('Además de como cortes de un cono, cada una se define por una propiedad de distancias. ' +
    'Esta es la definición que se usa para deducir sus ecuaciones:');

  p.table(['Cónica', 'Definición', 'Ecuación reducida'],
    [['Circunferencia', 'puntos a distancia $r$ de un centro', '$x^2+y^2 = r^2$'],
     ['Elipse', 'la <strong>suma</strong> de distancias a dos focos es constante', '$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2} = 1$'],
     ['Hipérbola', 'la <strong>diferencia</strong> de distancias a dos focos es constante', '$\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2} = 1$'],
     ['Parábola', 'equidista de un foco y de una recta (directriz)', '$y^2 = 2px$']]);

  p.note('La definición de la elipse es la receta del jardinero: clava dos estacas, ata una cuerda ' +
    'entre ellas y tensa con un palo. Al girar, el palo dibuja una elipse perfecta, porque la longitud ' +
    'de la cuerda —la suma de las dos distancias— no cambia.', 'ok', 'Cómo dibujar una elipse en el jardín');

  p.demo({
    title: 'La elipse y sus focos',
    intro: 'Arrastra el punto por la elipse: las dos distancias cambian, pero su suma es siempre la misma. Mueve también la excentricidad.',
    build: function (host, d) {
      var a = 3.2, b = 2.2;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -5, xmax: 5, ymin: -3.5, ymax: 3.5, height: 330,
        handles: {
          P: {
            x: 3.2, y: 0, label: 'P', color: 2,
            constrain: function (h) {
              var t = Math.atan2(h.y / b, h.x / a);
              h.x = a * Math.cos(t); h.y = b * Math.sin(t);
            }
          }
        },
        draw: function (g) {
          var c = Math.sqrt(Math.max(0.0001, a * a - b * b));
          g.param(function (t) { return a * Math.cos(t); }, function (t) { return b * Math.sin(t); },
            0, 6.2832, { color: 0, w: 2.6 });
          g.point(-c, 0, { color: 1, r: 5, label: 'F₁', labelDy: 14 });
          g.point(c, 0, { color: 1, r: 5, label: 'F₂', labelDy: 14 });
          var P = g.h('P');
          g.seg(-c, 0, P.x, P.y, { color: 3, w: 2 });
          g.seg(c, 0, P.x, P.y, { color: 4, w: 2 });
          var d1 = Math.hypot(P.x + c, P.y), d2 = Math.hypot(P.x - c, P.y);
          out.set('$a = ' + U.fmt(a, 2) + '$, &nbsp; $b = ' + U.fmt(b, 2) + '$, &nbsp; ' +
            '$c = \\sqrt{a^2-b^2} = ' + U.fmt(c, 3) + '$<br>' +
            '<span style="color:var(--c4)">$d(P,F_1) = ' + U.fmt(d1, 3) + '$</span> &nbsp;+&nbsp; ' +
            '<span style="color:var(--c5)">$d(P,F_2) = ' + U.fmt(d2, 3) + '$</span> &nbsp;=&nbsp; ' +
            '<strong>' + U.fmt(d1 + d2, 3) + '</strong> $= 2a$<br>' +
            'Excentricidad: $e = \\dfrac{c}{a} = ' + U.fmt(c / a, 4) + '$ — ' +
            (c / a < 0.15 ? 'casi una circunferencia' : (c / a > 0.8 ? 'muy achatada' : 'elipse normal')));
        }
      });
      var row = W.row(host);
      W.slider(row, { label: 'semieje a', min: 1.5, max: 4.5, step: 0.1, value: a, dec: 2, on: function (v) { a = Math.max(v, b + 0.05); plot.render(); } });
      W.slider(row, { label: 'semieje b', min: 0.5, max: 3, step: 0.1, value: b, dec: 2, on: function (v) { b = Math.min(v, a - 0.05); plot.render(); } });
      W.hint(host, 'Arrastra P alrededor de la elipse y vigila la suma.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Excentricidad');

  p.text('Un solo número mide «cuánto se aparta de ser un círculo»:');

  p.formula('e = \\frac{c}{a}', 'excentricidad');

  p.list([
    '$e = 0$: circunferencia.',
    '$0 < e < 1$: elipse. Cuanto mayor, más achatada. (La órbita de la Tierra tiene $e = 0{,}0167$: es casi circular.)',
    '$e = 1$: parábola.',
    '$e > 1$: hipérbola.'
  ]);

  p.text('En la elipse y la hipérbola, $a$, $b$ y $c$ están ligados. Y ojo, no es la misma relación ' +
    'en las dos:');

  p.formulas([
    '\\text{elipse:}\\quad a^2 = b^2 + c^2',
    '\\text{hipérbola:}\\quad c^2 = a^2 + b^2'
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Circunferencia: centro y radio',
    level: 'basico',
    gen: function (r) {
      var cx = r.pm(0, 6), cy = r.pm(0, 6), rad = r.int(1, 9);
      // x^2+y^2 -2cx x -2cy y + (cx^2+cy^2-r^2) = 0
      return { cx: cx, cy: cy, rad: rad, D: -2 * cx, E: -2 * cy, F: cx * cx + cy * cy - rad * rad };
    },
    ask: function (d) {
      return 'Halla el centro y el radio de $x^2 + y^2 ' + ML.termTex(d.D, 'x', 1, false) +
        ML.termTex(d.E, 'y', 1, false) + ML.termTex(d.F, '', 0, false) + ' = 0$.';
    },
    fields: [
      { name: 'a', label: 'Centro: x', w: 'tiny' }, { name: 'b', label: 'Centro: y', w: 'tiny' },
      { name: 'r', label: 'Radio', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.cx, b: d.cy, r: d.rad }; },
    tol: 1e-6,
    hint: function () { return 'En $x^2+y^2+Dx+Ey+F=0$, el centro es $(-D/2, -E/2)$.'; },
    steps: function (d) {
      return ['Comparamos con $x^2+y^2+Dx+Ey+F=0$: aquí $D = ' + d.D + '$, $E = ' + d.E + '$, $F = ' + d.F + '$.',
        'Centro: $\\left(-\\dfrac{D}{2}, -\\dfrac{E}{2}\\right) = (' + d.cx + ', ' + d.cy + ')$.',
        'Radio: $r = \\sqrt{\\left(\\frac{D}{2}\\right)^2 + \\left(\\frac{E}{2}\\right)^2 - F} = ' +
        '\\sqrt{' + (d.cx * d.cx) + ' + ' + (d.cy * d.cy) + ' - (' + d.F + ')} = \\sqrt{' + (d.rad * d.rad) + '} = ' + d.rad + '$.'];
    },
    answer: function (d) { return 'Centro $(' + d.cx + ', ' + d.cy + ')$, radio $' + d.rad + '$.'; }
  });

  p.exercise({
    title: 'Elementos de una elipse',
    level: 'medio',
    gen: function (r) {
      var pares = [[5, 3], [5, 4], [13, 12], [13, 5], [10, 6], [10, 8], [17, 15], [25, 24]];
      var pr = r.pick(pares);
      var a = pr[0], b = pr[1];
      return { a: a, b: b, c: Math.sqrt(a * a - b * b), e: Math.sqrt(a * a - b * b) / a };
    },
    ask: function (d) {
      return 'Dada la elipse $\\dfrac{x^2}{' + (d.a * d.a) + '} + \\dfrac{y^2}{' + (d.b * d.b) +
        '} = 1$, halla $c$ (la semidistancia focal) y su excentricidad (cuatro decimales).';
    },
    fields: [{ name: 'c', label: 'c', w: 'tiny' }, { name: 'e', label: 'Excentricidad', w: 'tiny' }],
    sol: function (d) { return { c: U.round(d.c, 4), e: U.round(d.e, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'En la elipse, $a^2 = b^2 + c^2$, con $a = ' + d.a + '$ y $b = ' + d.b + '$.'; },
    steps: function (d) {
      return ['De los denominadores: $a = ' + d.a + '$ y $b = ' + d.b + '$ (el mayor es siempre $a$).',
        '$c^2 = a^2 - b^2 = ' + (d.a * d.a) + ' - ' + (d.b * d.b) + ' = ' + (d.a * d.a - d.b * d.b) + '$',
        '$c = ' + U.fmt(d.c, 4) + '$, y los focos están en $(\\pm' + U.fmt(d.c, 4) + ', 0)$.',
        '$e = \\dfrac{c}{a} = \\dfrac{' + U.fmt(d.c, 4) + '}{' + d.a + '} = ' + U.fmt(d.e, 4) + '$'];
    },
    answer: function (d) { return 'c = ' + U.fmt(d.c, 4) + ', e = ' + U.fmt(d.e, 4); }
  });

  p.exercise({
    title: '¿Qué cónica es?',
    level: 'medio',
    gen: function (r) {
      var t = r.int(0, 3);
      return { t: t, a: r.int(2, 9), b: r.int(2, 9), rad: r.int(2, 9), pp: r.int(1, 8) };
    },
    ask: function (d) {
      var eq = [
        'x^2 + y^2 = ' + (d.rad * d.rad),
        '\\dfrac{x^2}{' + (d.a * d.a) + '} + \\dfrac{y^2}{' + (d.b * d.b) + '} = 1',
        '\\dfrac{x^2}{' + (d.a * d.a) + '} - \\dfrac{y^2}{' + (d.b * d.b) + '} = 1',
        'y^2 = ' + (2 * d.pp) + 'x'
      ][d.t];
      return '¿Qué cónica es $' + eq + '$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>1</code> circunferencia, ' +
        '<code>2</code> elipse, <code>3</code> hipérbola, <code>4</code> parábola.</span>';
    },
    fields: [{ name: 'c', label: 'Cónica', w: 'tiny' }],
    sol: function (d) { return { c: d.t + 1 }; },
    hint: function () { return 'Fíjate en los signos y en si las dos variables están al cuadrado.'; },
    steps: function (d) {
      return ['Circunferencia: los dos cuadrados suman y tienen el mismo denominador.',
        'Elipse: los dos cuadrados <strong>suman</strong> con denominadores distintos.',
        'Hipérbola: los dos cuadrados se <strong>restan</strong>.',
        'Parábola: solo una de las dos variables está al cuadrado.',
        'En este caso es una <strong>' + ['circunferencia', 'elipse', 'hipérbola', 'parábola'][d.t] + '</strong>.'];
    },
    answer: function (d) { return ['Circunferencia', 'Elipse', 'Hipérbola', 'Parábola'][d.t]; }
  });

  p.exercise({
    title: 'Asíntotas de una hipérbola',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(2, 9), b = r.int(2, 9);
      return { a: a, b: b, m: b / a, c: Math.sqrt(a * a + b * b) };
    },
    ask: function (d) {
      return 'La hipérbola $\\dfrac{x^2}{' + (d.a * d.a) + '} - \\dfrac{y^2}{' + (d.b * d.b) +
        '} = 1$ tiene dos asíntotas $y = \\pm m x$. Halla $m$ (positiva) y la semidistancia focal $c$ ' +
        '(cuatro decimales).';
    },
    fields: [{ name: 'm', label: 'Pendiente m', w: 'tiny' }, { name: 'c', label: 'c', w: 'tiny' }],
    sol: function (d) { return { m: U.round(d.m, 4), c: U.round(d.c, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Las asíntotas son $y = \\pm\\frac{b}{a}x$, y en la hipérbola $c^2 = a^2+b^2$.'; },
    steps: function (d) {
      return ['De los denominadores: $a = ' + d.a + '$ y $b = ' + d.b + '$.',
        'Asíntotas: $y = \\pm\\dfrac{b}{a}x = \\pm\\dfrac{' + d.b + '}{' + d.a + '}x$, o sea $m = ' + U.fmt(d.m, 4) + '$.',
        'En la hipérbola la relación es $c^2 = a^2 + b^2$ (¡suma, no resta como en la elipse!).',
        '$c = \\sqrt{' + (d.a * d.a) + ' + ' + (d.b * d.b) + '} = ' + U.fmt(d.c, 4) + '$'];
    },
    answer: function (d) { return 'm = ' + U.fmt(d.m, 4) + ', c = ' + U.fmt(d.c, 4); }
  });

  p.keys([
    'Las cuatro cónicas son cortes del mismo cono con distinta inclinación.',
    'Elipse: la <strong>suma</strong> de distancias a los focos es constante. Hipérbola: la <strong>diferencia</strong>.',
    'Parábola: equidista del foco y de la directriz.',
    'La excentricidad $e = c/a$ clasifica la familia entera: 0, entre 0 y 1, 1, y mayor que 1.',
    'Elipse: $a^2 = b^2+c^2$. Hipérbola: $c^2 = a^2+b^2$. No confundirlas.',
    'Kepler y Galileo demostraron que estas curvas, estudiadas 1800 años antes por puro gusto, describen el movimiento real del universo.'
  ]);
});
