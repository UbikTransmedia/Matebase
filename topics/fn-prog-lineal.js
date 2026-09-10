/* Tema: Programación lineal */
Course.topic('fn-prog-lineal', function (p) {

  p.text('Hasta ahora, optimizar era buscar el máximo o el mínimo de una función sin más. Pero en el ' +
    'mundo real casi nunca se puede elegir libremente: hay <strong>restricciones</strong>. Solo tengo ' +
    'tantas horas de máquina, tanto material, tanto presupuesto.');

  p.text('La <strong>programación lineal</strong> resuelve exactamente eso cuando tanto lo que se ' +
    'quiere optimizar como las restricciones son <em>lineales</em>. Es, con diferencia, la ' +
    'herramienta matemática más usada por las empresas del mundo.');

  p.formulas([
    'Z = a\\,x + b\\,y \\quad \\text{(función objetivo: lo que se maximiza o minimiza)}',
    '\\begin{cases} p_1 x + q_1 y \\le r_1 \\\\ p_2 x + q_2 y \\le r_2 \\\\ x \\ge 0,\\ y \\ge 0 \\end{cases} \\quad \\text{(restricciones)}'
  ]);

  p.section('La región factible');

  p.text('Cada inecuación divide el plano en dos: los puntos que la cumplen y los que no. La zona ' +
    'donde se cumplen <strong>todas a la vez</strong> se llama <strong>región factible</strong>, y es ' +
    'la intersección de todos esos semiplanos.');

  p.text('Al ser intersección de semiplanos, la región siempre es un <strong>polígono convexo</strong> ' +
    '(posiblemente no acotado). Nunca tiene entrantes ni agujeros, y eso va a ser decisivo.');

  p.demo({
    title: 'Construir la región factible',
    intro: 'Añade restricciones una a una y mira cómo se va recortando el plano. Los puntos gordos son los vértices.',
    build: function (host, d) {
      var activas = 2;
      var restr = [
        { p: 1, q: 2, r: 14, t: 'x + 2y \\le 14' },
        { p: 3, q: 1, r: 18, t: '3x + y \\le 18' },
        { p: 1, q: 1, r: 8, t: 'x + y \\le 8' }
      ];
      var out = W.readout(host, '');
      function vertices() {
        var act = restr.slice(0, activas);
        var rectas = act.map(function (c) { return [c.p, c.q, c.r]; });
        rectas.push([1, 0, 0]);   // x >= 0  (borde x = 0)
        rectas.push([0, 1, 0]);   // y >= 0
        var pts = [];
        for (var i = 0; i < rectas.length; i++) {
          for (var j = i + 1; j < rectas.length; j++) {
            var A = rectas[i], B = rectas[j];
            var det = A[0] * B[1] - B[0] * A[1];
            if (Math.abs(det) < 1e-9) continue;
            var x = (A[2] * B[1] - B[2] * A[1]) / det;
            var y = (A[0] * B[2] - B[0] * A[2]) / det;
            if (x < -1e-9 || y < -1e-9) continue;
            var vale = act.every(function (c) { return c.p * x + c.q * y <= c.r + 1e-9; });
            if (vale && !pts.some(function (q) { return Math.abs(q[0] - x) < 1e-6 && Math.abs(q[1] - y) < 1e-6; })) {
              pts.push([x, y]);
            }
          }
        }
        // ordenar por ángulo para dibujar el polígono
        var cx = U.sum(pts.map(function (q) { return q[0]; })) / pts.length;
        var cy = U.sum(pts.map(function (q) { return q[1]; })) / pts.length;
        pts.sort(function (a, b) {
          return Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx);
        });
        return pts;
      }
      var plot = W.plot(host, {
        xmin: -1, xmax: 16, ymin: -1, ymax: 12, height: 340,
        draw: function (g) {
          var V = vertices();
          if (V.length > 2) g.poly(V, { color: 2, fill: 2, fillAlpha: .28, w: 2 });
          restr.slice(0, activas).forEach(function (c, i) {
            if (Math.abs(c.q) > 1e-9) g.fn(function (x) { return (c.r - c.p * x) / c.q; }, { color: i, w: 2.2 });
            else g.vline(c.r / c.p, { color: i, w: 2.2 });
          });
          V.forEach(function (q) {
            g.point(q[0], q[1], { color: 2, r: 6, label: '(' + U.fmt(q[0], 1) + ', ' + U.fmt(q[1], 1) + ')', labelDy: -12, size: 11 });
          });
        }
      });
      function paint() {
        var V = vertices();
        out.set('Restricciones activas: $' + restr.slice(0, activas).map(function (c) { return c.t; }).join('$, $') +
          '$, más $x \\ge 0$ e $y \\ge 0$.<br>' +
          'La región factible tiene <strong>' + V.length + ' vértices</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Cada restricción nueva corta un trozo ' +
          'del plano. La zona que queda es siempre convexa: si unes dos puntos de dentro, el segmento ' +
          'entero está dentro.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: '1 restricción', value: 1 }, { label: '2 restricciones', value: 2 },
        { label: '3 restricciones', value: 3 }
      ], { value: 2, on: function (v) { activas = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El teorema fundamental');

  p.note('<strong>Si el óptimo existe, está en un vértice de la región factible.</strong> Y si se ' +
    'alcanza en dos vértices, entonces todo el lado que los une también es óptimo.', 'ok',
    'El resultado que lo resuelve todo');

  p.text('¿Por qué? Porque las <strong>rectas de nivel</strong> de $Z = ax+by$ son todas paralelas ' +
    'entre sí. Al ir aumentando $Z$, la recta se desplaza sin girar, y el último punto de la región ' +
    'que toca antes de salirse es forzosamente una esquina.');

  p.text('Y de ahí sale un método que es casi un algoritmo de cocina:');

  p.list([
    'Dibujar la región factible.',
    'Calcular las coordenadas de <strong>todos</strong> sus vértices.',
    'Evaluar la función objetivo en cada uno.',
    'Quedarse con el mayor (o el menor, si se minimiza).'
  ], true);

  p.demo({
    title: 'La recta de nivel deslizándose',
    intro: 'Sube el valor de Z y mira cómo la recta se desplaza sin girar. El último vértice que toca antes de abandonar la región es el óptimo.',
    build: function (host, d) {
      var a = 3, b = 5, Z = 10;
      var restr = [
        { p: 1, q: 2, r: 14 }, { p: 3, q: 1, r: 18 }
      ];
      var V = [[0, 0], [6, 0], [4.4, 4.8], [0, 7]];
      var out = W.readout(host, '');
      function optimo() {
        var mejor = V[0], mv = -Infinity;
        V.forEach(function (q) {
          var z = a * q[0] + b * q[1];
          if (z > mv) { mv = z; mejor = q; }
        });
        return { p: mejor, z: mv };
      }
      var plot = W.plot(host, {
        xmin: -1, xmax: 12, ymin: -1, ymax: 10, height: 340,
        draw: function (g) {
          g.poly(V, { color: 2, fill: 2, fillAlpha: .25, w: 2 });
          restr.forEach(function (c, i) {
            g.fn(function (x) { return (c.r - c.p * x) / c.q; }, { color: i, w: 1.8, alpha: .7 });
          });
          // recta de nivel Z = a x + b y
          if (Math.abs(b) > 1e-9) {
            g.fn(function (x) { return (Z - a * x) / b; }, { color: 3, w: 3 });
          }
          var op = optimo();
          V.forEach(function (q) {
            var esOpt = Math.abs(q[0] - op.p[0]) < 1e-9 && Math.abs(q[1] - op.p[1]) < 1e-9;
            g.point(q[0], q[1], { color: esOpt ? 'ok' : 2, r: esOpt ? 8 : 5 });
          });
        }
      });
      function paint() {
        var op = optimo();
        var tabla = V.map(function (q) {
          var z = a * q[0] + b * q[1];
          var es = Math.abs(z - op.z) < 1e-9;
          return (es ? '<strong style="color:var(--ok)">' : '') +
            '(' + U.fmt(q[0], 1) + ', ' + U.fmt(q[1], 1) + ') → Z = ' + U.fmt(z, 2) +
            (es ? '</strong>' : '');
        }).join(' &nbsp;·&nbsp; ');
        out.set('$Z = ' + U.fmt(a, 0) + 'x + ' + U.fmt(b, 0) + 'y$ &nbsp;·&nbsp; recta dibujada: $Z = ' + U.fmt(Z, 0) + '$<br>' +
          tabla + '<br><strong>Máximo: Z = ' + U.fmt(op.z, 2) + ' en (' + U.fmt(op.p[0], 1) + ', ' + U.fmt(op.p[1], 1) + ')</strong>' +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Cambia los coeficientes: al girar ' +
          'la recta de nivel, el vértice ganador puede cambiar, pero <em>siempre</em> es un vértice.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'coeficiente a', min: 1, max: 8, step: 1, value: 3, dec: 0, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'coeficiente b', min: 1, max: 8, step: 1, value: 5, dec: 0, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'valor de Z dibujado', min: 0, max: 60, step: 1, value: 10, dec: 0, on: function (v) { Z = v; paint(); } });
      paint();
    }
  });

  p.hist('El método lo desarrolló George Dantzig en 1947 para la Fuerza Aérea estadounidense: se ' +
    'trataba de planificar suministros y transporte, un problema con miles de variables. Su algoritmo ' +
    'del <em>símplex</em> recorre los vértices de forma inteligente en vez de probarlos todos, y sigue ' +
    'siendo la base del software de logística de medio planeta. Dantzig, siendo estudiante, llegó tarde ' +
    'a una clase y copió del encerado dos problemas que creyó que eran deberes; los resolvió en unos ' +
    'días. Eran dos problemas abiertos de estadística que nadie había podido resolver.');

  /* ---------------------------------------------------------------- */
  p.util('Que el óptimo esté siempre en un vértice es lo que convierte un problema con infinitas ' +
    'posibilidades en uno con una lista corta que revisar, y eso es lo que hace que se pueda ' +
    'resolver de verdad. Con esta idea se planifican las rutas y la carga de las aerolíneas, la ' +
    'mezcla de crudos de una refinería, la dieta más barata que cumple unos requisitos nutricionales ' +
    'y el reparto de turnos de un hospital. Es de las matemáticas que más dinero mueven al día.');

  p.section('Casos especiales');
  p.text('No siempre hay un único ganador. Conviene reconocer los tres finales raros, porque en un examen ' +
    'aparecen y porque en la práctica dicen cosas útiles: que el problema está mal planteado, que ' +
    'sobran recursos o que hay varias soluciones igual de buenas y se puede elegir por otro ' +
    'criterio.');


  p.table(['Situación', 'Qué pasa'],
    [['Región vacía', 'las restricciones se contradicen: el problema no tiene solución'],
     ['Región no acotada', 'puede no haber máximo (aunque sí mínimo, o al revés)'],
     ['La recta de nivel es paralela a un lado', 'hay <strong>infinitas</strong> soluciones: todo ese lado es óptimo'],
     ['Variables enteras', 'ya no basta con los vértices: es programación lineal <em>entera</em>, mucho más difícil']]);

  p.note('Ese último caso importa más de lo que parece: si $x$ son autobuses o trabajadores, la ' +
    'respuesta $x = 3{,}7$ no sirve. Y redondear <strong>no</strong> garantiza el óptimo. La ' +
    'programación entera es un problema NP-difícil, del mismo club que el viajante de comercio.',
    'warn');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿El punto es factible?',
    level: 'basico',
    gen: function (r) {
      var p1 = r.int(1, 4), q1 = r.int(1, 4), r1 = r.int(10, 30);
      var p2 = r.int(1, 4), q2 = r.int(1, 4), r2 = r.int(10, 30);
      // Con el punto al azar quedaba fuera el 75% de las veces. La mitad de
      // las veces se elige dentro de la region, para que no valga responder
      // «no» sin mirar.
      var x, y;
      if (r.bool(0.5)) {
        var tope = Math.min(r1 / p1, r2 / p2);
        x = r.int(0, Math.max(0, Math.floor(tope)));
        var libre = Math.min((r1 - p1 * x) / q1, (r2 - p2 * x) / q2);
        y = r.int(0, Math.max(0, Math.floor(libre)));
      } else {
        x = r.int(0, 10); y = r.int(0, 10);
      }
      var c1 = p1 * x + q1 * y <= r1;
      var c2 = p2 * x + q2 * y <= r2;
      return { p1: p1, q1: q1, r1: r1, p2: p2, q2: q2, r2: r2, x: x, y: y, ok: c1 && c2 };
    },
    ask: function (d) {
      return '¿Pertenece el punto $(' + d.x + ', ' + d.y + ')$ a la región factible definida por<br>' +
        '$\\begin{cases}' + d.p1 + 'x + ' + d.q1 + 'y \\le ' + d.r1 + ' \\\\ ' +
        d.p2 + 'x + ' + d.q2 + 'y \\le ' + d.r2 + ' \\\\ x \\ge 0,\\ y \\ge 0\\end{cases}$?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === d.ok;
    },
    hint: function () { return 'Sustituye el punto en cada inecuación. Basta con que falle una para que quede fuera.'; },
    steps: function (d) {
      var v1 = d.p1 * d.x + d.q1 * d.y, v2 = d.p2 * d.x + d.q2 * d.y;
      return ['Primera: $' + d.p1 + '\\cdot' + d.x + ' + ' + d.q1 + '\\cdot' + d.y + ' = ' + v1 +
        (v1 <= d.r1 ? ' \\le ' : ' > ') + d.r1 + '$ → ' + (v1 <= d.r1 ? 'se cumple ✓' : 'no se cumple ✗'),
        'Segunda: $' + d.p2 + '\\cdot' + d.x + ' + ' + d.q2 + '\\cdot' + d.y + ' = ' + v2 +
        (v2 <= d.r2 ? ' \\le ' : ' > ') + d.r2 + '$ → ' + (v2 <= d.r2 ? 'se cumple ✓' : 'no se cumple ✗'),
        'Y las de no negatividad se cumplen porque $x, y \\ge 0$.',
        d.ok ? 'Todas se cumplen: el punto <strong>sí</strong> es factible.'
          : 'Alguna falla: el punto <strong>no</strong> es factible.'];
    },
    answer: function (d) { return d.ok ? 'Sí es factible.' : 'No es factible.'; }
  });

  p.exercise({
    title: 'El vértice óptimo',
    level: 'medio',
    gen: function (r) {
      var a = r.int(1, 9), b = r.int(1, 9);
      var V = [[0, 0], [r.int(3, 10), 0], [r.int(2, 8), r.int(2, 8)], [0, r.int(3, 10)]];
      var zs = V.map(function (q) { return a * q[0] + b * q[1]; });
      var mx = Math.max.apply(null, zs);
      if (zs.filter(function (z) { return z === mx; }).length > 1) return null;
      var idx = zs.indexOf(mx);
      return { a: a, b: b, V: V, zs: zs, idx: idx, mx: mx };
    },
    ask: function (d) {
      return 'La región factible de un problema tiene los vértices $' +
        d.V.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join('$, $') + '$. ' +
        'Si $Z = ' + d.a + 'x + ' + d.b + 'y$, ¿cuál es el <strong>valor máximo</strong> de $Z$?';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: -1, xmax: Math.max.apply(null, d.V.map(function (q) { return q[0]; })) + 2,
        ymin: -1, ymax: Math.max.apply(null, d.V.map(function (q) { return q[1]; })) + 2,
        height: 240,
        draw: function (g) {
          g.poly(d.V, { color: 2, fill: 2, fillAlpha: .25, w: 2 });
          d.V.forEach(function (q, i) {
            g.point(q[0], q[1], { color: i === d.idx ? 'ok' : 2, r: i === d.idx ? 7 : 5 });
          });
        }
      });
    },
    fields: [{ name: 'z', label: 'Z máximo', w: 'tiny' }],
    sol: function (d) { return { z: d.mx }; },
    hint: function () { return 'El óptimo está siempre en un vértice: evalúa $Z$ en los cuatro y quédate con el mayor.'; },
    steps: function (d) {
      var s = d.V.map(function (q, i) {
        return '$Z(' + q[0] + ', ' + q[1] + ') = ' + d.a + '\\cdot' + q[0] + ' + ' + d.b + '\\cdot' + q[1] +
          ' = ' + d.zs[i] + '$' + (i === d.idx ? ' ← <strong>máximo</strong>' : '');
      });
      s.push('El máximo es $Z = ' + d.mx + '$, alcanzado en $(' + d.V[d.idx][0] + ', ' + d.V[d.idx][1] + ')$.');
      return s;
    },
    answer: function (d) { return 'Z = ' + d.mx + ' en (' + d.V[d.idx][0] + ', ' + d.V[d.idx][1] + ')'; }
  });

  p.exercise({
    title: 'Corte de dos restricciones',
    level: 'medio',
    gen: function (r) {
      var x = r.int(1, 9), y = r.int(1, 9);
      var p1 = r.int(1, 5), q1 = r.int(1, 5);
      var p2 = r.int(1, 5), q2 = r.int(1, 5);
      if (p1 * q2 === p2 * q1) return null;
      return { p1: p1, q1: q1, r1: p1 * x + q1 * y, p2: p2, q2: q2, r2: p2 * x + q2 * y, x: x, y: y };
    },
    ask: function (d) {
      return 'Halla el vértice de la región factible que se obtiene al cortarse las rectas<br>' +
        '$' + d.p1 + 'x + ' + d.q1 + 'y = ' + d.r1 + '$ &nbsp;y&nbsp; $' + d.p2 + 'x + ' + d.q2 + 'y = ' + d.r2 + '$.';
    },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: d.x, y: d.y }; },
    tol: 1e-6,
    hint: function () { return 'Un vértice es la intersección de dos restricciones convertidas en igualdad: resuelve el sistema.'; },
    steps: function (d) {
      return ['Los vértices salen de resolver el sistema formado por dos restricciones <em>en igualdad</em>.',
        '$\\begin{cases}' + d.p1 + 'x + ' + d.q1 + 'y = ' + d.r1 + ' \\\\ ' + d.p2 + 'x + ' + d.q2 + 'y = ' + d.r2 + '\\end{cases}$',
        'Resolviendo por reducción: $x = ' + d.x + '$, $y = ' + d.y + '$.',
        'Después habría que comprobar que ese punto cumple <em>todas</em> las demás restricciones: ' +
        'si no, es un corte de rectas pero no un vértice de la región.'];
    },
    answer: function (d) { return '(' + d.x + ', ' + d.y + ')'; }
  });

  p.exercise({
    title: 'Problema de producción',
    level: 'avanzado',
    gen: function (r) {
      // dos productos A y B; recursos limitados; beneficio por unidad
      var bA = r.int(2, 9) * 10, bB = r.int(2, 9) * 10;
      var h1A = r.int(1, 3), h1B = r.int(1, 3), H1 = r.int(12, 40);
      var h2A = r.int(1, 3), h2B = r.int(1, 3), H2 = r.int(12, 40);
      if (h1A * h2B === h2A * h1B) return null;
      // vertices: (0,0), (H1/h1A o H2/h2A por el eje x), corte, (por el eje y)
      var xMax = Math.min(H1 / h1A, H2 / h2A);
      var yMax = Math.min(H1 / h1B, H2 / h2B);
      var det = h1A * h2B - h2A * h1B;
      var xc = (H1 * h2B - H2 * h1B) / det;
      var yc = (h1A * H2 - h2A * H1) / det;
      var V = [[0, 0], [xMax, 0], [0, yMax]];
      if (xc > 1e-9 && yc > 1e-9 && h1A * xc + h1B * yc <= H1 + 1e-9 && h2A * xc + h2B * yc <= H2 + 1e-9) {
        V.push([xc, yc]);
      }
      var zs = V.map(function (q) { return bA * q[0] + bB * q[1]; });
      var mx = Math.max.apply(null, zs);
      var idx = zs.indexOf(mx);
      if (!isFinite(mx) || mx <= 0) return null;
      return {
        bA: bA, bB: bB, h1A: h1A, h1B: h1B, H1: H1, h2A: h2A, h2B: h2B, H2: H2,
        V: V, zs: zs, mx: mx, idx: idx
      };
    },
    ask: function (d) {
      return 'Una fábrica produce sillas y mesas. Cada silla necesita $' + d.h1A + '$ h de carpintería ' +
        'y $' + d.h2A + '$ h de pintura; cada mesa, $' + d.h1B + '$ h y $' + d.h2B + '$ h. ' +
        'Se dispone de $' + d.H1 + '$ h de carpintería y $' + d.H2 + '$ h de pintura. ' +
        'El beneficio es de $' + d.bA + '$ € por silla y $' + d.bB + '$ € por mesa. ' +
        '¿Cuál es el <strong>beneficio máximo</strong>? (cuatro decimales)';
    },
    fields: [{ name: 'z', label: 'Beneficio (€)', w: 'wide' }],
    sol: function (d) { return { z: U.round(d.mx, 6) }; },
    tol: 3e-5,
    hint: function (d) {
      return 'Llama $x$ a las sillas e $y$ a las mesas. Las restricciones son $' + d.h1A + 'x + ' + d.h1B +
        'y \\le ' + d.H1 + '$ y $' + d.h2A + 'x + ' + d.h2B + 'y \\le ' + d.H2 + '$. Evalúa en los vértices.';
    },
    steps: function (d) {
      var s = ['Variables: $x$ sillas, $y$ mesas. Objetivo: $Z = ' + d.bA + 'x + ' + d.bB + 'y$.',
        'Carpintería: $' + d.h1A + 'x + ' + d.h1B + 'y \\le ' + d.H1 + '$.',
        'Pintura: $' + d.h2A + 'x + ' + d.h2B + 'y \\le ' + d.H2 + '$. Y además $x, y \\ge 0$.',
        'Los vértices de la región factible son:'];
      d.V.forEach(function (q, i) {
        s.push('$(' + U.fmt(q[0], 3) + ', ' + U.fmt(q[1], 3) + ')$ → $Z = ' + U.fmt(d.zs[i], 3) + '$' +
          (i === d.idx ? ' ← <strong>máximo</strong>' : ''));
      });
      s.push('Beneficio máximo: $' + U.fmt(d.mx, 4) + '$ €.');
      s.push('Nota: si las cantidades tienen que ser enteras, este valor es solo una cota superior.');
      return s;
    },
    answer: function (d) { return U.fmt(d.mx, 4) + ' €'; }
  });

  p.exercise({
    title: '¿Cuántas soluciones óptimas?',
    level: 'medio',
    gen: function (r) {
      var R1 = '\\begin{cases} x \\ge 0,\\ y \\ge 0 \\\\ 2x + y \\le 12 \\\\ x + 4y \\le 20 \\end{cases}';
      var R2 = '\\begin{cases} x \\ge 0,\\ y \\ge 0 \\\\ x + y \\ge 4 \\\\ x - y \\le 2 \\end{cases}';
      var casos = [
        { reg: R1, z: [1, 2], op: 'máximo', ok: 'unica', por: 'Los vértices son $(0,0)$, $(6,0)$, $(4,4)$ y $(0,5)$; $Z$ vale 0, 6, 12 y 10: un único máximo, en $(4,4)$.' },
        { reg: R1, z: [2, 1], op: 'máximo', ok: 'infinitas', por: 'En $(6,0)$ y en $(4,4)$ vale lo mismo, 12: la función objetivo es paralela a ese lado, y todo él es óptimo.' },
        { reg: R1, z: [1, 4], op: 'máximo', ok: 'infinitas', por: 'En $(4,4)$ y en $(0,5)$ vale 20: $Z$ es paralela al lado $x + 4y = 20$, que es entero óptimo.' },
        { reg: R2, z: [1, 1], op: 'máximo', ok: 'noacotada', por: 'La región no está acotada hacia arriba: $Z$ crece sin límite y no hay máximo.' },
        { reg: R2, z: [1, 1], op: 'mínimo', ok: 'infinitas', por: 'Los vértices son $(0,4)$ y $(3,1)$, y en los dos $Z$ vale 4: todo el lado $x + y = 4$ es óptimo.' },
        { reg: R2, z: [1, 2], op: 'mínimo', ok: 'unica', por: 'En $(0,4)$ vale 8 y en $(3,1)$ vale 5: un único mínimo, en $(3,1)$.' }
      ];
      var c = r.pick(casos);
      return { c: c, z: c.z };
    },
    ask: function (d) {
      return 'Para la región $' + d.c.reg + '$, ¿cuántas soluciones tiene el <strong>' + d.c.op + '</strong> de $Z = ' + ML.termTex(d.z[0], 'x', 1, true) + ML.termTex(d.z[1], 'y', 1, false) + '$?';
    },
    fields: [{ name: 't', label: 'Respuesta', opts: [{ t: 'Una única solución', v: 'unica' }, { t: 'Infinitas: todo un lado', v: 'infinitas' }, { t: 'Ninguna: la región no está acotada en esa dirección', v: 'noacotada' }] }],
    sol: function (d) { return { t: d.c.ok }; },
    hint: function () { return ['Dibuja la región y halla sus vértices.', 'Evalúa $Z$ en cada uno: si el mejor valor se repite en dos vértices seguidos, todo el lado es óptimo. Y mira si la región se escapa hacia el infinito.']; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return { unica: 'Única', infinitas: 'Infinitas', noacotada: 'No hay' }[d.c.ok]; }
  });

  p.exercise({
    title: 'La mejor solución entera',
    level: 'avanzado',
    gen: function (r) {
      var a1 = r.int(1, 4), b1 = r.int(1, 4), c1 = r.int(10, 24), a2 = r.int(1, 4), b2 = r.int(1, 4), c2 = r.int(10, 24);
      var pz = r.int(1, 5), qz = r.int(1, 5);
      var best = -1, arg = null, empate = false;
      for (var x = 0; x <= 24; x++) for (var y = 0; y <= 24; y++) {
        if (a1 * x + b1 * y > c1 || a2 * x + b2 * y > c2) continue;
        var z = pz * x + qz * y;
        if (z > best) { best = z; arg = [x, y]; empate = false; } else if (z === best) empate = true;
      }
      if (!arg || empate) return null;
      // optimo continuo: el mejor de los vertices
      var vert = [[0, 0], [c1 / a1, 0], [c2 / a2, 0], [0, c1 / b1], [0, c2 / b2]];
      var det = a1 * b2 - a2 * b1;
      if (det) vert.push([(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det]);
      var cont = null, zc = -1;
      vert.forEach(function (v) {
        if (v[0] < -1e-9 || v[1] < -1e-9 || a1 * v[0] + b1 * v[1] > c1 + 1e-9 || a2 * v[0] + b2 * v[1] > c2 + 1e-9) return;
        var z = pz * v[0] + qz * v[1];
        if (z > zc) { zc = z; cont = v; }
      });
      if (!cont || (Math.abs(cont[0] - Math.round(cont[0])) < 1e-9 && Math.abs(cont[1] - Math.round(cont[1])) < 1e-9)) return null;
      return { a1: a1, b1: b1, c1: c1, a2: a2, b2: b2, c2: c2, pz: pz, qz: qz, arg: arg, best: best, cont: cont, zc: zc };
    },
    ask: function (d) {
      return 'Maximiza $Z = ' + d.pz + 'x + ' + d.qz + 'y$ con $x, y \\ge 0$, $' + d.a1 + 'x + ' + d.b1 + 'y \\le ' + d.c1 + '$ y $' + d.a2 + 'x + ' + d.b2 + 'y \\le ' + d.c2 + '$, sabiendo que $x$ e $y$ tienen que ser <strong>enteros</strong>.';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }, { name: 'y', label: 'y =', w: 'tiny' }],
    sol: function (d) { return { x: d.arg[0], y: d.arg[1] }; },
    hint: function (d) { return ['Resuelve primero sin la condición de enteros: el óptimo está en un vértice, $(' + U.fmt(d.cont[0], 2) + ',\\ ' + U.fmt(d.cont[1], 2) + ')$, que no es entero.', 'Revisa los puntos enteros de la región cercanos a ese vértice y quédate con el de mayor $Z$. Redondear sin más puede dar un punto fuera de la región o que no es el mejor.']; },
    steps: function (d) {
      return ['Sin exigir enteros, el óptimo es el vértice $(' + U.fmt(d.cont[0], 3) + ',\\ ' + U.fmt(d.cont[1], 3) + ')$ con $Z \\approx ' + U.fmt(d.zc, 3) + '$.',
        'Entre los puntos enteros de la región, el mejor es $(' + d.arg[0] + ',\\ ' + d.arg[1] + ')$, con $Z = ' + d.best + '$.',
        'Comprobación de las restricciones: $' + (d.a1 * d.arg[0] + d.b1 * d.arg[1]) + ' \\le ' + d.c1 + '$ y $' + (d.a2 * d.arg[0] + d.b2 * d.arg[1]) + ' \\le ' + d.c2 + '$ ✓'];
    },
    answer: function (d) { return '(' + d.arg[0] + ', ' + d.arg[1] + '), Z = ' + d.best; }
  });

  p.keys([
    'Si la función objetivo es paralela a un lado óptimo hay infinitas soluciones; en una región no acotada puede no haber óptimo; con variables enteras hay que revisar los puntos enteros.',
    'Programación lineal: optimizar una función lineal sujeta a restricciones lineales.',
    'La región factible es la intersección de semiplanos: siempre un polígono <strong>convexo</strong>.',
    'Las rectas de nivel de $Z$ son paralelas entre sí: al desplazarse, el último punto que tocan es una esquina.',
    '<strong>El óptimo está siempre en un vértice</strong> (y si empata en dos, en todo el lado).',
    'Método: dibujar la región, hallar los vértices, evaluar $Z$ en cada uno, elegir.',
    'Si las variables deben ser enteras, redondear el óptimo <em>no</em> garantiza la solución.'
  ]);
});
