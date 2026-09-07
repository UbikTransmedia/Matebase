/* Tema: La recta en el plano */
Course.topic('ge-rectas', function (p) {

  p.text('Con vectores en la mano, la geometría se vuelve <strong>analítica</strong>: cada figura ' +
    'pasa a ser una ecuación, y los problemas de dibujo se convierten en cálculos. Empezamos por lo ' +
    'más simple, la recta.');

  p.text('Una recta queda determinada por un <strong>punto</strong> $P(p_1,p_2)$ por el que pasa y un ' +
    '<strong>vector director</strong> $\\vec{v}=(v_1,v_2)$ que marca su dirección. Con eso, cualquier ' +
    'punto de la recta se alcanza avanzando desde $P$ un múltiplo de $\\vec{v}$.');

  p.formula('(x,y) = (p_1,p_2) + t\\,(v_1,v_2), \\quad t \\in \\mathbb{R}', 'ecuación vectorial');

  p.demo({
    title: 'Recorrer una recta con el parámetro',
    intro: 'Mueve t y verás cómo el punto barre toda la recta. El vector director es el paso que se da cada vez que t aumenta en 1.',
    build: function (host, d) {
      var t = 1;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -8, xmax: 8, ymin: -5.5, ymax: 5.5, height: 340,
        handles: {
          P: { x: -2, y: -1, label: 'P', color: 1, constrain: snap },
          V: { x: 1, y: 2, label: 'P + v', color: 3, constrain: snap }
        },
        draw: function (g) {
          var P = g.h('P'), Q = g.h('V');
          var v = { x: Q.x - P.x, y: Q.y - P.y };
          if (v.x === 0 && v.y === 0) return;
          g.param(function (s) { return P.x + s * v.x; }, function (s) { return P.y + s * v.y; },
            -20, 20, { color: 0, w: 2.4 });
          g.vec(P.x, P.y, P.x + v.x, P.y + v.y, { color: 3, w: 3 });
          var X = { x: P.x + t * v.x, y: P.y + t * v.y };
          g.point(X.x, X.y, { color: 2, r: 6.5, label: 't = ' + U.fmt(t, 1), labelDy: -14 });
          out.set('$\\vec{v} = (' + v.x + ', ' + v.y + ')$ &nbsp;·&nbsp; ' +
            '$(x,y) = (' + P.x + ', ' + P.y + ') + ' + U.fmt(t, 1) + '(' + v.x + ', ' + v.y + ') = (' +
            U.fmt(X.x, 2) + ', ' + U.fmt(X.y, 2) + ')$<br>' +
            (v.x !== 0
              ? 'Pendiente $m = \\dfrac{' + v.y + '}{' + v.x + '} = ' + U.fmt(v.y / v.x, 3) + '$ &nbsp;·&nbsp; ' +
                'ecuación explícita: $y = ' + U.fmt(v.y / v.x, 3) + 'x ' +
                (P.y - v.y / v.x * P.x >= 0 ? '+ ' : '- ') + U.fmt(Math.abs(P.y - v.y / v.x * P.x), 3) + '$'
              : 'Recta <strong>vertical</strong>: $x = ' + P.x + '$. No tiene pendiente.'));
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
      W.slider(W.row(host), { label: 'parámetro t', min: -4, max: 4, step: 0.1, value: 1, dec: 1, on: function (v) { t = v; plot.render(); } });
      W.hint(host, 'Arrastra P y el extremo del vector director.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Las cinco formas de escribir la misma recta');
  p.text('Viene una tabla con cinco maneras de escribir lo mismo, y eso desconcierta con razón. La clave ' +
    'es que <strong>no compiten entre sí</strong>: cada una deja a la vista un dato distinto y se ' +
    'elige según lo que te den y lo que busques. Antes de aprendértelas, fíjate en qué información ' +
    'se lee de un vistazo en cada una.');


  p.table(['Nombre', 'Ecuación', 'Cuándo conviene'],
    [['Vectorial', '$(x,y) = (p_1,p_2)+t(v_1,v_2)$', 'para entender qué es la recta'],
     ['Paramétricas', '$\\begin{cases}x = p_1 + t v_1\\\\ y = p_2 + t v_2\\end{cases}$', 'para generar puntos'],
     ['Continua', '$\\dfrac{x-p_1}{v_1} = \\dfrac{y-p_2}{v_2}$', 'paso intermedio; se obtiene despejando $t$'],
     ['General o implícita', '$Ax + By + C = 0$', 'la más versátil; vale también para verticales'],
     ['Explícita', '$y = mx + n$', 'para dibujar y para funciones']]);

  p.note('En la forma general $Ax+By+C=0$, el vector $(A,B)$ es <strong>perpendicular</strong> a la ' +
    'recta (se llama vector normal) y $(-B,A)$ es un vector director. Saber esto ahorra muchísimo ' +
    'tiempo en los ejercicios.', 'ok', 'El dato que más rentabilidad da');

  p.formula('Ax+By+C = 0 \\ \\Longrightarrow\\ \\vec{n} = (A,B) \\perp r, \\quad \\vec{v} = (-B, A) \\parallel r');

  /* ---------------------------------------------------------------- */
  p.util('Cinco formas para la misma recta no es un capricho: cada una responde bien a una pregunta ' +
    'distinta. La explícita $y=mx+n$ es la que se lee de un vistazo en una gráfica de datos; la ' +
    'paramétrica es la que usa un robot o un dron, porque describe <em>dónde está en cada ' +
    'instante</em>; la general es la que le conviene al ordenador para decidir de qué lado de la ' +
    'recta cae un punto. Saber cambiar de una a otra es saber elegir la herramienta.');

  p.section('Posiciones relativas');

  p.text('Dos rectas del plano solo pueden hacer tres cosas, y se distingue comparando sus vectores ' +
    'directores (o, lo que es lo mismo, resolviendo el sistema de sus ecuaciones):');

  p.table(['Situación', 'Vectores directores', 'El sistema es'],
    [['Se cortan en un punto', 'no proporcionales', 'compatible determinado'],
     ['Paralelas', 'proporcionales, rectas distintas', 'incompatible'],
     ['Coincidentes', 'proporcionales, misma recta', 'compatible indeterminado']]);

  p.section('Distancias');

  p.text('La distancia de un punto a una recta es la longitud del segmento <strong>perpendicular</strong> ' +
    'que los une, que es el camino más corto. Con la ecuación general sale de una fórmula directa:');

  p.formula('d(P, r) = \\frac{|A p_1 + B p_2 + C|}{\\sqrt{A^2+B^2}}');

  p.demo({
    title: 'Distancia de un punto a una recta',
    intro: 'Arrastra el punto y los que definen la recta. El segmento rojo es siempre perpendicular: por eso es el más corto.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -8, xmax: 8, ymin: -5.5, ymax: 5.5, height: 340,
        handles: {
          A: { x: -4, y: -1, label: 'A', color: 0, constrain: snap },
          B: { x: 3, y: 2, label: 'B', color: 0, constrain: snap },
          P: { x: -1, y: 3, label: 'P', color: 1, constrain: snap }
        },
        draw: function (g) {
          var A = g.h('A'), B = g.h('B'), P = g.h('P');
          var vx = B.x - A.x, vy = B.y - A.y;
          if (vx === 0 && vy === 0) return;
          g.param(function (s) { return A.x + s * vx; }, function (s) { return A.y + s * vy; },
            -20, 20, { color: 0, w: 2.4 });
          // proyeccion de P sobre la recta
          var t = ((P.x - A.x) * vx + (P.y - A.y) * vy) / (vx * vx + vy * vy);
          var H = { x: A.x + t * vx, y: A.y + t * vy };
          g.seg(P.x, P.y, H.x, H.y, { color: 2, w: 2.6 });
          g.point(H.x, H.y, { color: 2, r: 5, hollow: true });
          var dist = Math.hypot(P.x - H.x, P.y - H.y);
          // ecuacion general:  vy(x - Ax) - vx(y - Ay) = 0
          var Ac = vy, Bc = -vx, Cc = -(vy * A.x - vx * A.y);
          out.set('Recta: $' + ML.termTex(Ac, 'x', 1, true) + ML.termTex(Bc, 'y', 1, false) +
            ML.termTex(Cc, '', 0, false) + ' = 0$<br>' +
            '$d(P,r) = \\dfrac{|' + Ac + '\\cdot(' + P.x + ') + (' + Bc + ')\\cdot(' + P.y + ') + (' + Cc + ')|}{\\sqrt{' +
            (Ac * Ac + Bc * Bc) + '}} = ' + U.fmt(dist, 4) + '$');
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('La distancia de un punto a una recta es lo que calcula un coche con asistente de carril: la ' +
    'línea pintada en el asfalto es la recta, el coche es el punto, y si esa distancia se sale del ' +
    'margen suena el aviso. Es también como un programa de dibujo decide si has hecho clic «sobre» ' +
    'una línea, y cómo un sistema de control mide cuánto se desvía una máquina de la trayectoria que ' +
    'debía seguir.');

  p.section('Practica');

  p.exercise({
    title: 'De dos puntos a la ecuación general',
    level: 'medio',
    gen: function (r) {
      var A = [r.pm(0, 6), r.pm(0, 6)];
      var v = [r.nz(-5, 5), r.nz(-5, 5)];
      var B = [A[0] + v[0], A[1] + v[1]];
      // vy x - vx y + (vx Ay - vy Ax) = 0
      var Ac = v[1], Bc = -v[0], Cc = v[0] * A[1] - v[1] * A[0];
      var g = ML.gcd(ML.gcd(Math.abs(Ac), Math.abs(Bc)), Math.abs(Cc)) || 1;
      if (Ac / g !== Math.round(Ac / g)) return null;
      return { A: A, B: B, Ac: Ac / g, Bc: Bc / g, Cc: Cc / g };
    },
    ask: function (d) {
      return 'Halla la ecuación general de la recta que pasa por $A(' + d.A + ')$ y $B(' + d.B + ')$. ' +
        'Da los coeficientes $A$, $B$ y $C$ de $Ax+By+C=0$ (simplificados y con $A > 0$ si es posible).';
    },
    fields: [{ name: 'a', label: 'A', w: 'tiny' }, { name: 'b', label: 'B', w: 'tiny' }, { name: 'c', label: 'C', w: 'tiny' }],
    check: function (v, d) {
      if (isNaN(v.a) || isNaN(v.b) || isNaN(v.c)) return { ok: false, msg: 'Escribe los tres coeficientes.' };
      if (v.a === 0 && v.b === 0) return { ok: false, msg: 'A y B no pueden ser los dos cero.' };
      // proporcionalidad con la solucion
      var k = null;
      var pares = [[v.a, d.Ac], [v.b, d.Bc], [v.c, d.Cc]];
      for (var i = 0; i < 3; i++) {
        if (Math.abs(pares[i][1]) > 1e-9) { k = pares[i][0] / pares[i][1]; break; }
      }
      if (k === null || Math.abs(k) < 1e-9) return false;
      for (var j = 0; j < 3; j++) {
        if (Math.abs(pares[j][0] - k * pares[j][1]) > 1e-6) return false;
      }
      return true;
    },
    sol: function (d) { return { a: d.Ac, b: d.Bc, c: d.Cc }; },
    hint: function (d) {
      return 'El vector director es $\\vec{AB} = (' + (d.B[0] - d.A[0]) + ', ' + (d.B[1] - d.A[1]) +
        ')$, así que el normal es $(' + (d.B[1] - d.A[1]) + ', ' + (-(d.B[0] - d.A[0])) + ')$.';
    },
    steps: function (d) {
      var vx = d.B[0] - d.A[0], vy = d.B[1] - d.A[1];
      return ['Vector director: $\\vec{AB} = (' + vx + ', ' + vy + ')$.',
        'De la ecuación continua $\\dfrac{x-' + d.A[0] + '}{' + vx + '} = \\dfrac{y-' + d.A[1] + '}{' + vy + '}$ ' +
        'se multiplica en cruz.',
        'Se ordena todo a un lado y se simplifica.',
        'Queda $' + ML.termTex(d.Ac, 'x', 1, true) + ML.termTex(d.Bc, 'y', 1, false) +
        ML.termTex(d.Cc, '', 0, false) + ' = 0$.',
        'Comprobación con el punto $A$: $' + d.Ac + '\\cdot(' + d.A[0] + ') + (' + d.Bc + ')\\cdot(' + d.A[1] + ') + (' + d.Cc + ') = 0$ ✓'];
    },
    answer: function (d) {
      return '$' + ML.termTex(d.Ac, 'x', 1, true) + ML.termTex(d.Bc, 'y', 1, false) +
        ML.termTex(d.Cc, '', 0, false) + ' = 0$';
    }
  });

  p.exercise({
    title: 'Posición relativa de dos rectas',
    level: 'medio',
    gen: function (r) {
      var tipo = r.int(0, 2);
      var a1 = r.nz(-5, 5), b1 = r.nz(-5, 5), c1 = r.pm(1, 8);
      var k = r.pick([2, 3, -2]);
      if (tipo === 0) {
        var a2 = r.nz(-5, 5), b2 = r.nz(-5, 5);
        if (Math.abs(a1 * b2 - a2 * b1) < 1e-9) return null;
        return { a1: a1, b1: b1, c1: c1, a2: a2, b2: b2, c2: r.pm(1, 8), tipo: 0 };
      }
      if (tipo === 1) return { a1: a1, b1: b1, c1: c1, a2: k * a1, b2: k * b1, c2: k * c1 + r.nz(1, 6), tipo: 1 };
      return { a1: a1, b1: b1, c1: c1, a2: k * a1, b2: k * b1, c2: k * c1, tipo: 2 };
    },
    ask: function (d) {
      var eq = function (a, b, c) {
        return ML.termTex(a, 'x', 1, true) + ML.termTex(b, 'y', 1, false) + ML.termTex(c, '', 0, false) + ' = 0';
      };
      return '¿Qué posición relativa tienen las rectas<br>$r: ' + eq(d.a1, d.b1, d.c1) + '$<br>' +
        '$s: ' + eq(d.a2, d.b2, d.c2) + '$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>1</code> si se cortan, ' +
        '<code>2</code> si son paralelas, <code>3</code> si son coincidentes.</span>';
    },
    fields: [{ name: 't', label: 'Posición', w: 'tiny' }],
    sol: function (d) { return { t: d.tipo + 1 }; },
    hint: function () { return 'Compara $\\frac{A_1}{A_2}$ con $\\frac{B_1}{B_2}$; si coinciden, mira también $\\frac{C_1}{C_2}$.'; },
    steps: function (d) {
      return ['$\\dfrac{A_1}{A_2} = ' + U.fmt(d.a1 / d.a2, 3) + '$ &nbsp;y&nbsp; $\\dfrac{B_1}{B_2} = ' + U.fmt(d.b1 / d.b2, 3) + '$',
        d.tipo === 0 ? 'Son distintos: las direcciones no son proporcionales, así que <strong>se cortan</strong>.'
          : 'Son iguales, así que las direcciones son proporcionales. Comparamos $\\dfrac{C_1}{C_2} = ' + U.fmt(d.c1 / d.c2, 3) + '$.',
        d.tipo === 0 ? '' : (d.tipo === 1 ? 'No coincide: son <strong>paralelas</strong> distintas.'
          : 'También coincide: son la <strong>misma recta</strong>.')].filter(function (x) { return x; });
    },
    answer: function (d) { return ['Se cortan en un punto', 'Paralelas', 'Coincidentes'][d.tipo]; }
  });

  p.exercise({
    title: 'Distancia de un punto a una recta',
    level: 'avanzado',
    gen: function (r) {
      var A = r.nz(-5, 5), B = r.nz(-5, 5), C = r.pm(0, 9);
      var P = [r.pm(0, 7), r.pm(0, 7)];
      var dist = Math.abs(A * P[0] + B * P[1] + C) / Math.hypot(A, B);
      return { A: A, B: B, C: C, P: P, dist: dist };
    },
    ask: function (d) {
      return 'Calcula la distancia del punto $P(' + d.P + ')$ a la recta $' +
        ML.termTex(d.A, 'x', 1, true) + ML.termTex(d.B, 'y', 1, false) + ML.termTex(d.C, '', 0, false) +
        ' = 0$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Distancia', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.dist, 4) }; },
    tol: 3e-4,
    hint: function () { return '$d = \\dfrac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$. Cuidado con el valor absoluto.'; },
    steps: function (d) {
      var num = d.A * d.P[0] + d.B * d.P[1] + d.C;
      return ['Numerador: $|' + d.A + '\\cdot(' + d.P[0] + ') + (' + d.B + ')\\cdot(' + d.P[1] + ') + (' + d.C + ')| = |' + num + '| = ' + Math.abs(num) + '$.',
        'Denominador: $\\sqrt{' + d.A + '^2 + (' + d.B + ')^2} = \\sqrt{' + (d.A * d.A + d.B * d.B) + '} = ' + U.fmt(Math.hypot(d.A, d.B), 4) + '$.',
        '$d = \\dfrac{' + Math.abs(num) + '}{' + U.fmt(Math.hypot(d.A, d.B), 4) + '} = ' + U.fmt(d.dist, 4) + '$',
        d.dist === 0 ? 'La distancia es cero: el punto está sobre la recta.' : ''].filter(function (x) { return x; });
    },
    answer: function (d) { return U.fmt(d.dist, 4); }
  });

  p.exercise({
    title: 'Recta paralela o perpendicular',
    level: 'medio',
    gen: function (r) {
      var A = r.nz(-5, 5), B = r.nz(-5, 5), C = r.pm(0, 9);
      var P = [r.pm(0, 6), r.pm(0, 6)];
      var perp = r.bool();
      // paralela: A x + B y + C' = 0 con C' = -(A p1 + B p2)
      // perpendicular: B x - A y + C' = 0
      var nA = perp ? B : A, nB = perp ? -A : B;
      return { A: A, B: B, C: C, P: P, perp: perp, nA: nA, nB: nB, nC: -(nA * P[0] + nB * P[1]) };
    },
    ask: function (d) {
      return 'Halla la ecuación general de la recta ' + (d.perp ? '<strong>perpendicular</strong>' : '<strong>paralela</strong>') +
        ' a $' + ML.termTex(d.A, 'x', 1, true) + ML.termTex(d.B, 'y', 1, false) + ML.termTex(d.C, '', 0, false) +
        ' = 0$ que pasa por $P(' + d.P + ')$. Da sus tres coeficientes.';
    },
    fields: [{ name: 'a', label: 'A', w: 'tiny' }, { name: 'b', label: 'B', w: 'tiny' }, { name: 'c', label: 'C', w: 'tiny' }],
    sol: function (d) { return { a: d.nA, b: d.nB, c: d.nC }; },
    check: function (v, d) {
      if (isNaN(v.a) || isNaN(v.b) || isNaN(v.c)) return { ok: false, msg: 'Escribe los tres coeficientes.' };
      if (v.a === 0 && v.b === 0) return false;
      var k = Math.abs(d.nA) > 1e-9 ? v.a / d.nA : v.b / d.nB;
      if (Math.abs(k) < 1e-9) return false;
      return Math.abs(v.a - k * d.nA) < 1e-6 && Math.abs(v.b - k * d.nB) < 1e-6 && Math.abs(v.c - k * d.nC) < 1e-6;
    },
    hint: function (d) {
      return d.perp ? 'Una perpendicular intercambia $A$ y $B$ y cambia un signo: $(B, -A)$.'
        : 'Una paralela conserva $A$ y $B$; solo cambia $C$.';
    },
    steps: function (d) {
      return [d.perp ? 'Para que sea perpendicular, los coeficientes pasan de $(' + d.A + ', ' + d.B + ')$ a $(' + d.nA + ', ' + d.nB + ')$.'
        : 'Para que sea paralela, se conservan los coeficientes: $(' + d.nA + ', ' + d.nB + ')$.',
        'Falta $C$, que se obtiene obligando a que pase por $P$:',
        '$' + d.nA + '\\cdot(' + d.P[0] + ') + (' + d.nB + ')\\cdot(' + d.P[1] + ') + C = 0$',
        '$C = ' + d.nC + '$',
        'Recta: $' + ML.termTex(d.nA, 'x', 1, true) + ML.termTex(d.nB, 'y', 1, false) + ML.termTex(d.nC, '', 0, false) + ' = 0$'];
    },
    answer: function (d) {
      return '$' + ML.termTex(d.nA, 'x', 1, true) + ML.termTex(d.nB, 'y', 1, false) + ML.termTex(d.nC, '', 0, false) + ' = 0$';
    }
  });

  p.keys([
    'Una recta = un punto + un vector director.',
    'Cinco formas de escribirla; la general $Ax+By+C=0$ es la más versátil.',
    'En $Ax+By+C=0$: $(A,B)$ es <strong>perpendicular</strong> a la recta y $(-B,A)$ es director.',
    'Posiciones relativas: se cortan, paralelas o coincidentes, según sean proporcionales los coeficientes.',
    '$d(P,r) = \\dfrac{|Ap_1+Bp_2+C|}{\\sqrt{A^2+B^2}}$: la distancia se mide en perpendicular.'
  ]);
});
