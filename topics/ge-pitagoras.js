/* Tema: El teorema de Pitágoras */
Course.topic('ge-pitagoras', function (p) {

  p.text('En un triángulo <strong>rectángulo</strong> (el que tiene un ángulo de $90^\\circ$), los dos ' +
    'lados que forman ese ángulo se llaman <em>catetos</em> y el lado de enfrente, siempre el más ' +
    'largo, es la <em>hipotenusa</em>. Entre los tres hay una relación exacta:');

  p.formula('a^2 + b^2 = c^2', 'catetos a y b, hipotenusa c');

  p.text('Es probablemente el resultado más famoso de las matemáticas, y también uno de los más ' +
    'útiles: es la manera de calcular distancias. Cada vez que un GPS mide cuánto hay entre dos ' +
    'puntos, por debajo está esto.');

  p.hist('Los babilonios conocían ternas como (3,4,5) mil años antes de Pitágoras, y los egipcios ' +
    'usaban una cuerda de 12 nudos para trazar ángulos rectos en el campo. Lo que aportó la escuela ' +
    'pitagórica (siglo VI a.C.) fue la <em>demostración</em>: no que funcione en los casos probados, ' +
    'sino que es imposible que falle. Es el nacimiento de la matemática como ciencia deductiva. ' +
    'Existen más de 350 demostraciones distintas; una es del presidente estadounidense James Garfield.');

  p.demo({
    title: 'La demostración con áreas',
    intro: 'El cuadrado construido sobre la hipotenusa tiene exactamente la misma área que los dos cuadrados de los catetos juntos. Arrastra el vértice y compruébalo.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6.5, xmax: 9, ymin: -5.5, ymax: 8, height: 380,
        grid: true, axes: false,
        handles: {
          C: {
            x: 0, y: 3, label: 'C', color: 2,
            constrain: function (h) { h.x = U.clamp(Math.round(h.x * 2) / 2, -3, 3); h.y = U.clamp(Math.round(h.y * 2) / 2, 0.5, 6); }
          }
        },
        draw: function (g) {
          var A = [0, 0], B = [4, 0], C = [g.h('C').x, g.h('C').y];
          // hacemos que el angulo recto este siempre en A: C se mueve solo en vertical
          C[0] = 0;
          var a = C[1];                       // cateto vertical
          var b = 4;                          // cateto horizontal
          var c = Math.hypot(a, b);

          // cuadrado sobre el cateto horizontal (hacia abajo)
          g.poly([[0, 0], [b, 0], [b, -b], [0, -b]], { color: 0, fill: 0, fillAlpha: .2, w: 1.6 });
          g.text(b / 2, -b / 2, 'b² = ' + U.fmt(b * b, 2), { align: 'center', color: 0, size: 13 });
          // cuadrado sobre el cateto vertical (hacia la izquierda)
          g.poly([[0, 0], [0, a], [-a, a], [-a, 0]], { color: 3, fill: 3, fillAlpha: .2, w: 1.6 });
          g.text(-a / 2, a / 2, 'a² = ' + U.fmt(a * a, 2), { align: 'center', color: 3, size: 13 });
          // cuadrado sobre la hipotenusa
          var ux = (B[0] - C[0]) / c, uy = (B[1] - C[1]) / c;   // direccion C->B
          var px = -uy, py = ux;                                 // perpendicular
          g.poly([C, B, [B[0] + px * c, B[1] + py * c], [C[0] + px * c, C[1] + py * c]],
            { color: 1, fill: 1, fillAlpha: .2, w: 1.6 });
          g.text(C[0] + ux * c / 2 + px * c / 2, C[1] + uy * c / 2 + py * c / 2,
            'c² = ' + U.fmt(c * c, 2), { align: 'center', color: 1, size: 13 });

          // triangulo
          g.poly([A, B, C], { color: 'ink', fill: false, w: 2.4, stroke: true });
          g.rightAngle(0, 0, 0, Math.PI / 2, 0.45, { color: 'ink', w: 1.6 });
          g.point(0, 0, { color: 'ink', r: 4 });
          g.point(4, 0, { color: 'ink', r: 4 });

          out.set('$a = ' + U.fmt(a, 2) + '$, &nbsp; $b = ' + b + '$, &nbsp; $c = ' + U.fmt(c, 4) + '$<br>' +
            '$a^2 + b^2 = ' + U.fmt(a * a, 2) + ' + ' + U.fmt(b * b, 2) + ' = ' + U.fmt(a * a + b * b, 2) + '$' +
            ' &nbsp;=&nbsp; $c^2 = ' + U.fmt(c * c, 2) + '$ ✓');
        }
      });
      W.hint(host, 'Arrastra el punto C hacia arriba y hacia abajo.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Usarlo en los dos sentidos');

  p.text('Si conoces los dos catetos, la hipotenusa sale con una suma; si conoces la hipotenusa y ' +
    'un cateto, sale con una <strong>resta</strong>. Este es el punto donde se falla:');

  p.formulas([
    'c = \\sqrt{a^2+b^2} \\qquad \\text{(busco la hipotenusa: sumo)}',
    'a = \\sqrt{c^2-b^2} \\qquad \\text{(busco un cateto: resto)}'
  ]);

  p.note('Antes de calcular, identifica quién es la hipotenusa: es el lado <strong>opuesto al ángulo ' +
    'recto</strong>, y siempre el más largo. Si te sale una hipotenusa más corta que un cateto, ' +
    'algo has hecho mal.', 'warn');

  p.sub('El recíproco: sirve para comprobar si un ángulo es recto');

  p.text('El teorema funciona también al revés. Si en un triángulo se cumple $a^2+b^2=c^2$, entonces ' +
    'ese triángulo <em>es</em> rectángulo. Y si no se cumple, sirve para clasificarlo:');

  p.table(['Comparación', 'El triángulo es'],
    [['$c^2 = a^2+b^2$', 'rectángulo'],
     ['$c^2 < a^2+b^2$', 'acutángulo (todos sus ángulos agudos)'],
     ['$c^2 > a^2+b^2$', 'obtusángulo (tiene un ángulo obtuso)']]);

  p.sub('Ternas pitagóricas');
  p.text('Son los tríos de números enteros que cumplen el teorema. Conviene reconocer las principales ' +
    'porque aparecen constantemente en los exámenes:');
  p.formula('(3,4,5) \\quad (5,12,13) \\quad (8,15,17) \\quad (7,24,25) \\quad (20,21,29)');
  p.text('Y todos sus múltiplos: $(6,8,10)$, $(9,12,15)$, $(30,40,50)$…');

  /* ================= EJERCICIOS ================= */
  p.util('El sentido inverso —si $a^2+b^2=c^2$ entonces el ángulo es recto— es una herramienta de obra. ' +
    'Los albañiles replantean esquinas con la «regla del 3-4-5»: se miden 3 metros en una dirección, ' +
    '4 en la otra, y si la diagonal da exactamente 5, la esquina está a escuadra. Los egipcios ' +
    'tensaban cuerdas con doce nudos para lo mismo hace 4000 años, y hoy cualquier maestro de obras ' +
    'lo sigue usando porque no necesita instrumentos.');

  p.section('Practica');

  p.exercise({
    title: 'Calcula el lado que falta',
    level: 'basico',
    gen: function (r) {
      var ternas = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
      var t = r.pick(ternas), k = r.pick([1, 1, 1, 2, 3]);
      var a = t[0] * k, b = t[1] * k, c = t[2] * k;
      var busca = r.int(0, 2);         // 0 y 1: un cateto; 2: la hipotenusa
      return { a: a, b: b, c: c, busca: busca, res: [a, b, c][busca] };
    },
    ask: function (d) {
      if (d.busca === 2) {
        return 'Un triángulo rectángulo tiene catetos de $' + d.a + '$ cm y $' + d.b + '$ cm. ' +
          '¿Cuánto mide la <strong>hipotenusa</strong>?';
      }
      var otro = d.busca === 0 ? d.b : d.a;
      return 'Un triángulo rectángulo tiene hipotenusa de $' + d.c + '$ cm y un cateto de $' + otro +
        '$ cm. ¿Cuánto mide el <strong>otro cateto</strong>?';
    },
    fields: [{ name: 'v', label: 'Longitud (cm)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-6,
    hint: function (d) {
      return d.busca === 2 ? 'Buscas la hipotenusa: suma los cuadrados y haz la raíz.'
        : 'Buscas un cateto: resta el cuadrado del cateto conocido al de la hipotenusa.';
    },
    steps: function (d) {
      if (d.busca === 2) {
        return ['$c^2 = a^2 + b^2 = ' + d.a + '^2 + ' + d.b + '^2 = ' + (d.a * d.a) + ' + ' + (d.b * d.b) + ' = ' + (d.c * d.c) + '$',
          '$c = \\sqrt{' + (d.c * d.c) + '} = ' + d.c + '$ cm'];
      }
      var otro = d.busca === 0 ? d.b : d.a;
      return ['Despejamos el cateto: $x^2 = c^2 - (\\text{cateto conocido})^2$.',
        '$x^2 = ' + d.c + '^2 - ' + otro + '^2 = ' + (d.c * d.c) + ' - ' + (otro * otro) + ' = ' + (d.res * d.res) + '$',
        '$x = \\sqrt{' + (d.res * d.res) + '} = ' + d.res + '$ cm'];
    },
    answer: function (d) { return d.res + ' cm'; }
  });

  p.exercise({
    title: '¿Es rectángulo?',
    level: 'medio',
    gen: function (r) {
      var ternas = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]];
      var t = r.pick(ternas).slice();
      if (r.bool(0.5)) {                      // lo estropeamos un poco
        t[2] += r.pick([-2, -1, 1, 2]);
      }
      var a = t[0], b = t[1], c = t[2];
      var s = a * a + b * b - c * c;
      return { a: a, b: b, c: c, tipo: Math.abs(s) < 1e-9 ? 1 : (s > 0 ? 2 : 3) };
    },
    ask: function (d) {
      return 'Un triángulo tiene lados $' + d.a + '$, $' + d.b + '$ y $' + d.c + '$. ¿Qué tipo es?' +
        '<br><span style="font-size:14px;color:var(--ink-faint)">Escribe <code>1</code> si es rectángulo, ' +
        '<code>2</code> si es acutángulo, <code>3</code> si es obtusángulo.</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.tipo }; },
    hint: function (d) { return 'Compara $' + d.c + '^2$ con $' + d.a + '^2 + ' + d.b + '^2$.'; },
    steps: function (d) {
      var s1 = d.a * d.a + d.b * d.b, s2 = d.c * d.c;
      return ['El lado mayor es $' + d.c + '$, así que hace de hipotenusa candidata.',
        '$a^2+b^2 = ' + (d.a * d.a) + ' + ' + (d.b * d.b) + ' = ' + s1 + '$',
        '$c^2 = ' + s2 + '$',
        s1 === s2 ? 'Son iguales: el triángulo es <strong>rectángulo</strong>.'
          : (s1 > s2 ? 'Como $c^2 < a^2+b^2$, el ángulo mayor es agudo: <strong>acutángulo</strong>.'
            : 'Como $c^2 > a^2+b^2$, el ángulo mayor pasa de $90^\\circ$: <strong>obtusángulo</strong>.')];
    },
    answer: function (d) { return ['', 'Rectángulo', 'Acutángulo', 'Obtusángulo'][d.tipo]; }
  });

  p.exercise({
    title: 'Diagonal y altura: problemas de la vida real',
    level: 'medio',
    gen: function (r) {
      var t = r.int(0, 2);
      if (t === 0) {
        var a = r.int(3, 20), b = r.int(3, 20);
        return { t: 0, a: a, b: b, res: Math.sqrt(a * a + b * b) };
      }
      if (t === 1) {
        var esc = r.int(3, 10), sep = r.int(1, esc - 1);
        return { t: 1, esc: esc, sep: sep, res: Math.sqrt(esc * esc - sep * sep) };
      }
      var l = r.int(2, 15);
      return { t: 2, l: l, res: l * Math.sqrt(2) };
    },
    ask: function (d) {
      if (d.t === 0) return 'Una pantalla mide $' + d.a + '$ cm de ancho y $' + d.b + '$ cm de alto. ' +
        '¿Cuánto mide su diagonal? (dos decimales)';
      if (d.t === 1) return 'Una escalera de $' + d.esc + '$ m se apoya en una pared con la base a $' +
        d.sep + '$ m de ella. ¿A qué altura llega? (dos decimales)';
      return 'Un cuadrado tiene lado $' + d.l + '$ cm. ¿Cuánto mide su diagonal? (dos decimales)';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.res, 2) }; },
    tol: 3e-3,
    hint: function (d) {
      if (d.t === 1) return 'La escalera es la hipotenusa; la separación y la altura son los catetos.';
      return 'La diagonal es la hipotenusa de un triángulo rectángulo cuyos catetos son los lados.';
    },
    steps: function (d) {
      if (d.t === 0) return ['La diagonal es la hipotenusa: $d^2 = ' + d.a + '^2 + ' + d.b + '^2 = ' + (d.a * d.a + d.b * d.b) + '$.',
        '$d = \\sqrt{' + (d.a * d.a + d.b * d.b) + '} \\approx ' + U.fmt(d.res, 2) + '$ cm.'];
      if (d.t === 1) return ['La escalera es la hipotenusa ($' + d.esc + '$ m) y la separación un cateto ($' + d.sep + '$ m).',
        '$h^2 = ' + d.esc + '^2 - ' + d.sep + '^2 = ' + (d.esc * d.esc - d.sep * d.sep) + '$',
        '$h \\approx ' + U.fmt(d.res, 2) + '$ m.'];
      return ['La diagonal de un cuadrado parte el cuadrado en dos triángulos rectángulos iguales.',
        '$d^2 = ' + d.l + '^2 + ' + d.l + '^2 = ' + (2 * d.l * d.l) + '$',
        '$d = ' + d.l + '\\sqrt{2} \\approx ' + U.fmt(d.res, 2) + '$ cm.'];
    },
    answer: function (d) { return U.fmt(d.res, 2); }
  });

  p.exercise({
    title: 'Distancia entre dos puntos',
    level: 'avanzado',
    gen: function (r) {
      var x1 = r.pm(0, 8), y1 = r.pm(0, 8), dx = r.nz(-8, 8), dy = r.nz(-8, 8);
      return { x1: x1, y1: y1, x2: x1 + dx, y2: y1 + dy, res: Math.hypot(dx, dy) };
    },
    ask: function (d) {
      return 'Calcula la distancia entre los puntos $A(' + d.x1 + ', ' + d.y1 + ')$ y ' +
        '$B(' + d.x2 + ', ' + d.y2 + ')$ (dos decimales).';
    },
    show: function (d, host) {
      W.board(host, {
        xmin: Math.min(d.x1, d.x2) - 2, xmax: Math.max(d.x1, d.x2) + 2,
        ymin: Math.min(d.y1, d.y2) - 2, ymax: Math.max(d.y1, d.y2) + 2,
        height: 230,
        draw: function (g) {
          g.seg(d.x1, d.y1, d.x2, d.y1, { color: 3, w: 2, dash: true });
          g.seg(d.x2, d.y1, d.x2, d.y2, { color: 3, w: 2, dash: true });
          g.seg(d.x1, d.y1, d.x2, d.y2, { color: 0, w: 2.6 });
          g.point(d.x1, d.y1, { color: 0, r: 5, label: 'A' });
          g.point(d.x2, d.y2, { color: 1, r: 5, label: 'B' });
        }
      });
    },
    fields: [{ name: 'v', label: 'Distancia', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.res, 2) }; },
    tol: 3e-3,
    hint: function () { return 'Los catetos son las diferencias de coordenadas: $\\Delta x$ y $\\Delta y$.'; },
    steps: function (d) {
      var dx = d.x2 - d.x1, dy = d.y2 - d.y1;
      return ['$\\Delta x = ' + d.x2 + ' - (' + d.x1 + ') = ' + dx + '$ &nbsp;y&nbsp; $\\Delta y = ' + d.y2 + ' - (' + d.y1 + ') = ' + dy + '$.',
        'Esos son los catetos del triángulo rectángulo que ves dibujado.',
        '$d = \\sqrt{(' + dx + ')^2 + (' + dy + ')^2} = \\sqrt{' + (dx * dx + dy * dy) + '} \\approx ' + U.fmt(d.res, 2) + '$'];
    },
    answer: function (d) { return U.fmt(d.res, 4); }
  });

  p.keys([
    'Solo vale en triángulos <strong>rectángulos</strong>: $a^2+b^2=c^2$ con $c$ la hipotenusa.',
    'Hipotenusa = suma de cuadrados y raíz. Cateto = resta de cuadrados y raíz.',
    'La hipotenusa es siempre el lado mayor y está enfrente del ángulo recto.',
    'El recíproco permite comprobar si un triángulo es rectángulo, acutángulo u obtusángulo.',
    'La fórmula de la distancia entre dos puntos es Pitágoras disfrazado: $d=\\sqrt{\\Delta x^2 + \\Delta y^2}$.'
  ]);
});
