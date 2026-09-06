/* Tema: Vectores en el plano */
Course.topic('ge-vectores', function (p) {

  p.text('Hay magnitudes que quedan definidas con un número: la masa, la temperatura, el tiempo. ' +
    'Se llaman <strong>escalares</strong>. Pero otras necesitan además una dirección: la velocidad, ' +
    'la fuerza, un desplazamiento. Para esas hace falta un <strong>vector</strong>: una flecha.');

  p.text('Un vector tiene tres cosas: <strong>módulo</strong> (su longitud), <strong>dirección</strong> ' +
    '(la recta sobre la que va) y <strong>sentido</strong> (hacia dónde apunta de los dos posibles).');

  p.formula('\\vec{v} = (v_1, v_2) \\qquad |\\vec{v}| = \\sqrt{v_1^2 + v_2^2}', 'componentes y módulo');

  p.note('El módulo es Pitágoras otra vez: las componentes son los catetos y el vector, la hipotenusa.',
    'ok');

  p.text('El vector que va del punto $A(a_1,a_2)$ al punto $B(b_1,b_2)$ se calcula restando: ' +
    '<strong>final menos inicial</strong>.');

  p.formula('\\vec{AB} = B - A = (b_1 - a_1,\\ b_2 - a_2)');

  p.demo({
    title: 'Un vector, sus componentes y su módulo',
    intro: 'Arrastra la punta del vector. Fíjate en el triángulo rectángulo que forman las componentes.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -8, xmax: 8, ymin: -6, ymax: 6, height: 340,
        handles: {
          V: {
            x: 4, y: 3, label: 'v', color: 0,
            constrain: function (h) { h.x = Math.round(h.x * 2) / 2; h.y = Math.round(h.y * 2) / 2; }
          }
        },
        draw: function (g) {
          var v = g.h('V');
          g.seg(0, 0, v.x, 0, { color: 3, w: 2, dash: true });
          g.seg(v.x, 0, v.x, v.y, { color: 3, w: 2, dash: true });
          g.vec(0, 0, v.x, v.y, { color: 0, w: 3 });
          g.text(v.x / 2, -0.35, 'v₁ = ' + U.fmt(v.x, 1), { align: 'center', color: 3, size: 12, box: true });
          g.text(v.x + 0.25, v.y / 2, 'v₂ = ' + U.fmt(v.y, 1), { align: 'left', color: 3, size: 12, box: true });
          var m = Math.hypot(v.x, v.y);
          var ang = Math.atan2(v.y, v.x) * 180 / Math.PI;
          out.set('$\\vec{v} = (' + U.fmt(v.x, 1) + ', ' + U.fmt(v.y, 1) + ')$ &nbsp;·&nbsp; ' +
            '$|\\vec{v}| = \\sqrt{' + U.fmt(v.x * v.x, 2) + ' + ' + U.fmt(v.y * v.y, 2) + '} = ' + U.fmt(m, 4) + '$' +
            ' &nbsp;·&nbsp; ángulo con el eje X: $' + U.fmt(ang < 0 ? ang + 360 : ang, 1) + '^\\circ$');
        }
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Operaciones');

  p.sub('Suma: la regla del paralelogramo');
  p.text('Para sumar dos vectores se suman sus componentes. Geométricamente, se pone uno a ' +
    'continuación del otro y el resultado va del principio del primero al final del segundo.');

  p.formula('\\vec{u} + \\vec{v} = (u_1+v_1,\\ u_2+v_2)');

  p.sub('Producto por un número');
  p.text('Multiplicar por un escalar $k$ estira o encoge el vector. Si $k$ es negativo, además le da ' +
    'la vuelta.');

  p.formula('k\\,\\vec{v} = (k\\,v_1,\\ k\\,v_2) \\qquad |k\\vec{v}| = |k|\\,|\\vec{v}|');

  p.demo({
    title: 'Sumar vectores',
    intro: 'Arrastra las puntas de los dos vectores. La flecha verde es la suma: es la diagonal del paralelogramo que forman.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -9, xmax: 9, ymin: -6, ymax: 7, height: 350,
        handles: {
          U: { x: 4, y: 1, label: 'u', color: 0, constrain: snap },
          V: { x: 1, y: 3, label: 'v', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V');
          var s = [u.x + v.x, u.y + v.y];
          g.seg(u.x, u.y, s[0], s[1], { color: 1, w: 1.6, dash: true, alpha: .7 });
          g.seg(v.x, v.y, s[0], s[1], { color: 0, w: 1.6, dash: true, alpha: .7 });
          g.vec(0, 0, u.x, u.y, { color: 0, w: 3 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 3 });
          g.vec(0, 0, s[0], s[1], { color: 2, w: 3.4 });
          g.text(s[0], s[1], 'u+v', { color: 2, dx: 10, dy: -10, box: true, size: 13 });
          out.set('$\\vec{u} = (' + u.x + ', ' + u.y + ')$, &nbsp; $\\vec{v} = (' + v.x + ', ' + v.y + ')$<br>' +
            '$\\vec{u}+\\vec{v} = (' + s[0] + ', ' + s[1] + ')$, &nbsp; módulo $' + U.fmt(Math.hypot(s[0], s[1]), 3) + '$');
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Producto escalar');

  p.text('Esta operación toma dos vectores y devuelve <strong>un número</strong> (por eso se llama ' +
    'escalar). Tiene dos fórmulas equivalentes, y de igualarlas sale el ángulo entre los vectores.');

  p.formulas([
    '\\vec{u}\\cdot\\vec{v} = u_1v_1 + u_2v_2',
    '\\vec{u}\\cdot\\vec{v} = |\\vec{u}|\\,|\\vec{v}|\\cos\\alpha',
    '\\cos\\alpha = \\frac{u_1v_1+u_2v_2}{|\\vec{u}|\\,|\\vec{v}|}'
  ]);

  p.note('Consecuencia importantísima: <strong>dos vectores son perpendiculares si y solo si su ' +
    'producto escalar vale cero</strong>, porque $\\cos 90^\\circ = 0$. Es la forma más rápida de ' +
    'comprobar un ángulo recto sin dibujar nada.', 'ok', 'La prueba de la perpendicularidad');

  p.demo({
    title: 'Producto escalar y ángulo',
    intro: 'Gira los dos vectores y observa el signo del producto escalar: positivo si el ángulo es agudo, cero si es recto, negativo si es obtuso.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -7, xmax: 7, ymin: -5, ymax: 5, height: 330,
        handles: {
          U: { x: 4, y: 0, label: 'u', color: 0, constrain: snap },
          V: { x: 1, y: 3, label: 'v', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V');
          var pe = u.x * v.x + u.y * v.y;
          var mu = Math.hypot(u.x, u.y), mv = Math.hypot(v.x, v.y);
          var cos = pe / (mu * mv);
          var ang = Math.acos(U.clamp(cos, -1, 1));
          var a1 = Math.atan2(u.y, u.x), a2 = Math.atan2(v.y, v.x);
          g.arc(0, 0, 1.2, a1, a2, { color: 2, w: 2, fill: 2, fillAlpha: .15 });
          g.vec(0, 0, u.x, u.y, { color: 0, w: 3 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 3 });
          var col = Math.abs(pe) < 1e-9 ? 'var(--ok)' : (pe > 0 ? 'var(--c1)' : 'var(--bad)');
          out.set('$\\vec{u}\\cdot\\vec{v} = ' + u.x + '\\cdot' + v.x + ' + ' + u.y + '\\cdot' + v.y +
            ' = $ <strong style="color:' + col + '">' + U.fmt(pe, 2) + '</strong>' +
            ' &nbsp;·&nbsp; $\\alpha = ' + U.fmt(ang * 180 / Math.PI, 1) + '^\\circ$' +
            (Math.abs(pe) < 1e-9 ? ' &nbsp;→ <strong style="color:var(--ok)">¡perpendiculares!</strong>' : ''));
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
      W.hint(host, 'Intenta dejar el producto escalar exactamente en 0.');
    }
  });

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Vector entre dos puntos y su módulo',
    level: 'basico',
    gen: function (r) {
      var ternas = [[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [7, 24]];
      var t = r.pick(ternas);
      var sx = r.sign(), sy = r.sign();
      var x1 = r.pm(0, 6), y1 = r.pm(0, 6);
      return {
        x1: x1, y1: y1, x2: x1 + t[0] * sx, y2: y1 + t[1] * sy,
        vx: t[0] * sx, vy: t[1] * sy, mod: Math.hypot(t[0], t[1])
      };
    },
    ask: function (d) {
      return 'Dados $A(' + d.x1 + ', ' + d.y1 + ')$ y $B(' + d.x2 + ', ' + d.y2 + ')$, calcula las ' +
        'componentes de $\\vec{AB}$ y su módulo.';
    },
    fields: [
      { name: 'a', label: '1.ª componente', w: 'tiny' },
      { name: 'b', label: '2.ª componente', w: 'tiny' },
      { name: 'm', label: 'Módulo', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.vx, b: d.vy, m: d.mod }; },
    tol: 1e-6,
    hint: function () { return 'Final menos inicial. Y el módulo es Pitágoras con las componentes.'; },
    steps: function (d) {
      return ['$\\vec{AB} = B - A = (' + d.x2 + ' - (' + d.x1 + '),\\ ' + d.y2 + ' - (' + d.y1 + ')) = (' + d.vx + ', ' + d.vy + ')$',
        '$|\\vec{AB}| = \\sqrt{(' + d.vx + ')^2 + (' + d.vy + ')^2} = \\sqrt{' + (d.vx * d.vx + d.vy * d.vy) + '} = ' + d.mod + '$'];
    },
    answer: function (d) { return '$\\vec{AB} = (' + d.vx + ', ' + d.vy + ')$, módulo $' + d.mod + '$'; }
  });

  p.exercise({
    title: 'Combinación lineal',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(1, 6), r.pm(1, 6)], v = [r.pm(1, 6), r.pm(1, 6)];
      var k1 = r.nz(-4, 4), k2 = r.nz(-4, 4);
      return { u: u, v: v, k1: k1, k2: k2, r: [k1 * u[0] + k2 * v[0], k1 * u[1] + k2 * v[1]] };
    },
    ask: function (d) {
      return 'Si $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$, calcula ' +
        '$' + ML.termTex(d.k1, '\\vec{u}', 1, true) + ML.termTex(d.k2, '\\vec{v}', 1, false) + '$.';
    },
    fields: [{ name: 'a', label: '1.ª componente', w: 'tiny' }, { name: 'b', label: '2.ª componente', w: 'tiny' }],
    sol: function (d) { return { a: d.r[0], b: d.r[1] }; },
    hint: function () { return 'Multiplica cada vector por su número y después suma componente a componente.'; },
    steps: function (d) {
      return ['$' + d.k1 + '\\vec{u} = (' + (d.k1 * d.u[0]) + ', ' + (d.k1 * d.u[1]) + ')$',
        '$' + d.k2 + '\\vec{v} = (' + (d.k2 * d.v[0]) + ', ' + (d.k2 * d.v[1]) + ')$',
        'Sumando: $(' + d.r[0] + ', ' + d.r[1] + ')$'];
    },
    answer: function (d) { return '$(' + d.r[0] + ', ' + d.r[1] + ')$'; }
  });

  p.exercise({
    title: 'Producto escalar y perpendicularidad',
    level: 'medio',
    gen: function (r) {
      var u = [r.nz(-6, 6), r.nz(-6, 6)];
      var perp = r.bool(0.4);
      var v = perp ? [-u[1], u[0]] : [r.nz(-6, 6), r.nz(-6, 6)];
      var pe = u[0] * v[0] + u[1] * v[1];
      return { u: u, v: v, pe: pe, perp: Math.abs(pe) < 1e-9 };
    },
    ask: function (d) {
      return 'Calcula $\\vec{u}\\cdot\\vec{v}$ siendo $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$. ' +
        'Escribe además <code>1</code> si son perpendiculares o <code>0</code> si no lo son.';
    },
    fields: [{ name: 'pe', label: 'Producto escalar', w: 'tiny' }, { name: 'q', label: '¿Perpendiculares?', w: 'tiny' }],
    sol: function (d) { return { pe: d.pe, q: d.perp ? 1 : 0 }; },
    hint: function () { return 'Producto escalar cero ⟺ perpendiculares.'; },
    steps: function (d) {
      return ['$\\vec{u}\\cdot\\vec{v} = ' + d.u[0] + '\\cdot(' + d.v[0] + ') + ' + d.u[1] + '\\cdot(' + d.v[1] + ')$',
        '$= ' + (d.u[0] * d.v[0]) + ' + (' + (d.u[1] * d.v[1]) + ') = ' + d.pe + '$',
        d.perp ? 'Como vale cero, los vectores <strong>son perpendiculares</strong>.'
          : 'Como no vale cero, <strong>no son perpendiculares</strong>.'];
    },
    answer: function (d) { return '$\\vec{u}\\cdot\\vec{v} = ' + d.pe + '$; ' + (d.perp ? 'sí' : 'no') + ' son perpendiculares.'; }
  });

  p.exercise({
    title: 'Ángulo entre dos vectores',
    level: 'avanzado',
    gen: function (r) {
      var u = [r.nz(-6, 6), r.nz(-6, 6)], v = [r.nz(-6, 6), r.nz(-6, 6)];
      var pe = u[0] * v[0] + u[1] * v[1];
      var mu = Math.hypot(u[0], u[1]), mv = Math.hypot(v[0], v[1]);
      var ang = Math.acos(U.clamp(pe / (mu * mv), -1, 1)) * 180 / Math.PI;
      return { u: u, v: v, pe: pe, mu: mu, mv: mv, ang: ang };
    },
    ask: function (d) {
      return 'Halla el ángulo que forman $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$, ' +
        'en grados y con un decimal.';
    },
    fields: [{ name: 'a', label: 'Ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.ang, 1) }; },
    tol: 2e-3,
    hint: function () { return 'Usa $\\cos\\alpha = \\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}||\\vec{v}|}$ y después el arco coseno.'; },
    steps: function (d) {
      return ['Producto escalar: $\\vec{u}\\cdot\\vec{v} = ' + d.pe + '$.',
        'Módulos: $|\\vec{u}| = ' + U.fmt(d.mu, 4) + '$ y $|\\vec{v}| = ' + U.fmt(d.mv, 4) + '$.',
        '$\\cos\\alpha = \\dfrac{' + d.pe + '}{' + U.fmt(d.mu * d.mv, 4) + '} = ' + U.fmt(d.pe / (d.mu * d.mv), 4) + '$',
        '$\\alpha = \\arccos(' + U.fmt(d.pe / (d.mu * d.mv), 4) + ') \\approx ' + U.fmt(d.ang, 1) + '^\\circ$'];
    },
    answer: function (d) { return U.fmt(d.ang, 1) + '°'; }
  });

  p.keys([
    'Vector = módulo + dirección + sentido. En componentes, $\\vec{v}=(v_1,v_2)$.',
    '$\\vec{AB} = B - A$: final menos inicial. Nunca al revés.',
    '$|\\vec{v}| = \\sqrt{v_1^2+v_2^2}$ — Pitágoras otra vez.',
    'Se suman componente a componente; multiplicar por $k$ estira (y si $k<0$, da la vuelta).',
    'Producto escalar $= u_1v_1+u_2v_2 = |\\vec u||\\vec v|\\cos\\alpha$.',
    '<strong>Producto escalar cero ⟺ perpendiculares.</strong>'
  ]);
});
