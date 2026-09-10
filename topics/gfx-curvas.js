/* Tema: Curvas: segmentos, Bezier y suavizado */
Course.topic('gfx-curvas', function (p) {

  p.text('Hasta ahora el shader sabía dibujar lo que tiene una distancia fácil: círculos, rectángulos, ' +
    'anillos. Pero casi todo lo que se ve en una pantalla —letras, iconos, trazos— está hecho de ' +
    '<strong>curvas</strong>. Este tema añade tres piezas: la distancia a un segmento, las curvas de Bézier ' +
    'con las que se diseñan todas las tipografías, y las funciones de suavizado que hacen que una animación ' +
    'parezca natural en lugar de mecánica.');

  p.text('Las tres son matemáticas de Bachillerato disfrazadas: una [[ge-vectores|proyección de un vector ' +
    'sobre otro]], una interpolación repetida y un polinomio de tercer grado con la ' +
    '[[fn-derivadas|derivada]] nula en los extremos.');

  /* ---------------------------------------------------------------- */
  p.section('La distancia a un segmento');

  p.text('Para saber a qué distancia está un punto $\\vec p$ del segmento que va de $\\vec a$ a $\\vec b$, se ' +
    'busca el punto del segmento más cercano. Se proyecta $\\vec p - \\vec a$ sobre la dirección del segmento, ' +
    '$\\vec b - \\vec a$, y se mide qué fracción $h$ del segmento se ha recorrido. Si $h$ se sale del intervalo ' +
    '$[0, 1]$, el más cercano es un extremo, así que se recorta. La distancia es la que hay hasta ese punto.');

  p.formula('h = \\operatorname{clamp}\\left(\\frac{(\\vec p - \\vec a)\\cdot(\\vec b - \\vec a)}{(\\vec b - \\vec a)\\cdot(\\vec b - \\vec a)},\\ 0,\\ 1\\right), \\qquad d = |\\vec p - \\vec a - h\\,(\\vec b - \\vec a)|',
    'distancia de un punto a un segmento',
    'El cociente es el coeficiente de la proyección: qué fracción del segmento ocupa la sombra de $\\vec p - \\vec a$.<br><br>' +
    '$\\operatorname{clamp}(x, 0, 1)$ deja $x$ tal cual si está entre 0 y 1, y si no lo recorta al extremo más cercano.<br><br>' +
    'En GLSL son tres líneas: <code>vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h);</code>');

  p.demo({
    title: 'El punto más cercano del segmento',
    intro: 'Mueve los extremos A y B y el punto P. La sombra de P sobre la recta marca la fracción h del segmento. Cuando h se sale de 0 a 1, el punto más cercano ya no es la sombra, sino un extremo: por eso hay que recortar.',
    build: function (host) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -5, xmax: 5, ymin: -3.5, ymax: 3.5, height: 320,
        handles: { A: { x: -3, y: -1, label: 'A', color: 0 }, B: { x: 2, y: 1.5, label: 'B', color: 0 }, P: { x: 3.5, y: -2, label: 'P', color: 1 } },
        draw: function (g) {
          var a = g.h('A'), b = g.h('B'), q = g.h('P');
          var bax = b.x - a.x, bay = b.y - a.y, bb = bax * bax + bay * bay;
          if (bb < 1e-9) { out.set('A y B coinciden: el segmento se ha quedado en un punto.'); return; }
          var hr = ((q.x - a.x) * bax + (q.y - a.y) * bay) / bb, h = Math.max(0, Math.min(1, hr));
          var cx = a.x + h * bax, cy = a.y + h * bay, sx = a.x + hr * bax, sy = a.y + hr * bay;
          g.seg(a.x - 3 * bax, a.y - 3 * bay, a.x + 4 * bax, a.y + 4 * bay, { color: 'axis', w: 1, dash: [4, 4] });
          if (h !== hr) g.seg(q.x, q.y, sx, sy, { color: 'axis', w: 1, dash: true });
          g.seg(a.x, a.y, b.x, b.y, { color: 0, w: 4 });
          g.seg(q.x, q.y, cx, cy, { color: 1, w: 2.2 });
          g.point(cx, cy, { color: 2, r: 5 });
          out.set('$h$ sin recortar $= ' + U.fmt(hr, 3) + '$ &nbsp;·&nbsp; recortado $= ' + U.fmt(h, 3) + '$ &nbsp;·&nbsp; distancia $d = ' + U.fmt(Math.hypot(q.x - cx, q.y - cy), 3) + '$' +
            (hr < 0 ? ' &nbsp;(el más cercano es A)' : (hr > 1 ? ' &nbsp;(el más cercano es B)' : '')));
        }
      });
    }
  });

  p.text('Con la distancia a un segmento se dibuja cualquier figura hecha de trazos rectos: basta con quedarse ' +
    'con el <code>min</code> de las distancias a todos sus lados. Y como es una distancia de verdad, sirve ' +
    'para todo lo que ya sabes hacer con distancias: grosor, bordes suaves y halos.');

  p.demo({
    title: 'Una estrella de segmentos',
    intro: 'Cada punta de la estrella son dos segmentos, y la figura entera es el mínimo de todas sus distancias. El halo sale gratis: es un brillo que decrece con la distancia. Cambia el número de puntas, cuánto se hunden los vértices interiores y el grosor.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-curvas-1', alto: 300,
        aria: 'Una estrella de trazo luminoso que gira despacio, con un halo alrededor del trazo.',
        mandos: [
          { n: 'puntas', label: 'puntas', min: 3, max: 12, step: 1, value: 5, dec: 0 },
          { n: 'hundido', label: 'hundimiento', min: 0.2, max: 1.0, step: 0.01, value: 0.45, dec: 2 },
          { n: 'grosor', label: 'grosor', min: 0.002, max: 0.03, step: 0.001, value: 0.006, dec: 3 },
          { n: 'giro', label: 'velocidad de giro', min: -1.0, max: 1.0, step: 0.05, value: 0.2, dec: 2 }
        ],
        codigo:
          'float sdSegmento(vec2 p, vec2 a, vec2 b)\n' +
          '{\n' +
          '    vec2 pa = p - a, ba = b - a;\n' +
          '    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\n' +
          '    return length(pa - ba * h);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float n = floor(puntas);\n' +
          '    float d = 10.0;\n' +
          '\n' +
          '    // 2n vertices alternando radio grande y pequeno; un segmento entre cada dos seguidos\n' +
          '    for (int i = 0; i < 24; i++) {\n' +
          '        float k = float(i);\n' +
          '        if (k >= 2.0 * n) break;\n' +
          '        float t0 = 0.5 * PI + k * PI / n + iTime * giro;\n' +
          '        float t1 = t0 + PI / n;\n' +
          '        float par = step(0.5, mod(k, 2.0));          // 0 en los vertices pares, 1 en los impares\n' +
          '        float r0 = 0.42 * mix(1.0, hundido, par);\n' +
          '        float r1 = 0.42 * mix(hundido, 1.0, par);\n' +
          '        d = min(d, sdSegmento(p, r0 * vec2(cos(t0), sin(t0)), r1 * vec2(cos(t1), sin(t1))));\n' +
          '    }\n' +
          '\n' +
          '    float v = 1.0 - smoothstep(grosor, grosor + 0.006, d);\n' +
          '    vec3 c = mix(vec3(0.06, 0.07, 0.12), vec3(1.0, 0.85, 0.4), v);\n' +
          '    c += vec3(1.0, 0.55, 0.2) * 0.01 / (d + 0.02);   // el halo: brillo que cae con la distancia\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Con el hundimiento a 1 los vértices interiores se van hasta fuera y la estrella se convierte en un polígono regular de 2n lados.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Curvas de Bézier');

  p.text('Una curva de Bézier se define con unos pocos <strong>puntos de control</strong>. La curva empieza ' +
    'en el primero y acaba en el último, pero no pasa por los de en medio: estos solo tiran de ella, como ' +
    'imanes. Y la manera de calcularla es la más sencilla imaginable: interpolar, y volver a interpolar.');

  p.formulas([
    '\\vec B(t) = (1 - t)^2\\,\\vec P_0 + 2(1 - t)\\,t\\,\\vec P_1 + t^2\\,\\vec P_2',
    '\\vec B(t) = (1 - t)^3\\,\\vec P_0 + 3(1 - t)^2 t\\,\\vec P_1 + 3(1 - t)\\,t^2\\,\\vec P_2 + t^3\\,\\vec P_3'
  ], 'curvas de Bézier cuadrática y cúbica, con t de 0 a 1',
    'Los coeficientes de la cuadrática son los términos de $\\bigl((1 - t) + t\\bigr)^2$, el [[al-identidades|cuadrado de un binomio]], y los ' +
    'de la cúbica, los de su cubo: 1, 3, 3, 1. Como $(1 - t) + t = 1$, <strong>suman siempre 1</strong>: el punto de la ' +
    'curva es una media ponderada de los puntos de control, y por eso la curva queda dentro del polígono que forman.<br><br>' +
    'En GLSL, la cuadrática es <code>mix(mix(P0, P1, t), mix(P1, P2, t), t)</code>: dos rondas de interpolación.');

  p.demo({
    title: 'La construcción de De Casteljau',
    intro: 'Arrastra los puntos de control. Para cada t se interpola en cada lado del polígono de control; luego entre los puntos obtenidos; y así hasta que queda uno solo, que es el punto de la curva. Mueve t y mira cómo ese punto recorre la curva.',
    build: function (host) {
      var t = 0.4, grado = 2;
      var out = W.readout(host, '');
      function lerp(A, B, s) { return [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]; }
      function niveles(pts, s) {
        var res = [pts];
        while (res[res.length - 1].length > 1) {
          var prev = res[res.length - 1], sig = [];
          for (var i = 0; i < prev.length - 1; i++) sig.push(lerp(prev[i], prev[i + 1], s));
          res.push(sig);
        }
        return res;
      }
      var plot = W.board(host, {
        xmin: -5, xmax: 5, ymin: -3.2, ymax: 3.2, height: 330,
        handles: {
          P0: { x: -4, y: -2, label: 'P₀', color: 0 }, P1: { x: -1.5, y: 2.6, label: 'P₁', color: 0 },
          P2: { x: 1.5, y: -2.4, label: 'P₂', color: 0 }, P3: { x: 4, y: 2, label: 'P₃', color: 0, hidden: true }
        },
        draw: function (g) {
          g.h('P3').o.hidden = grado === 2;
          var nombres = grado === 2 ? ['P0', 'P1', 'P2'] : ['P0', 'P1', 'P2', 'P3'];
          var pts = nombres.map(function (k) { var h = g.h(k); return [h.x, h.y]; });
          g.path(pts, { color: 'axis', w: 1.2, dash: [4, 4] });
          var curva = [];
          for (var i = 0; i <= 80; i++) { var nv = niveles(pts, i / 80); curva.push(nv[nv.length - 1][0]); }
          g.path(curva, { color: 0, w: 3 });
          var niv = niveles(pts, t);
          for (var k = 1; k < niv.length - 1; k++) {
            g.path(niv[k], { color: k, w: 1.8 });
            niv[k].forEach(function (q) { g.point(q[0], q[1], { color: k, r: 3.5 }); });
          }
          var B = niv[niv.length - 1][0];
          g.point(B[0], B[1], { color: 'bad', r: 6 });
          out.set('$t = ' + U.fmt(t, 2) + '$ &nbsp;·&nbsp; $\\vec B(t) = (' + U.fmt(B[0], 2) + ',\\ ' + U.fmt(B[1], 2) + ')$ &nbsp;·&nbsp; ' +
            (grado === 2 ? 'cuadrática: dos rondas de interpolación' : 'cúbica: tres rondas de interpolación'));
        }
      });
      W.chips(host, [{ label: 'cuadrática (3 puntos)', value: 2 }, { label: 'cúbica (4 puntos)', value: 3 }], { value: grado, on: function (v) { grado = v; plot.render(); } });
      W.slider(W.row(host), { label: 'parámetro t', min: 0, max: 1, step: 0.01, value: t, on: function (v) { t = v; plot.render(); } });
    }
  });

  p.hist('Las curvas de Bézier llevan el nombre de Pierre Bézier, un ingeniero de Renault que las usó y ' +
    'popularizó en los años sesenta para diseñar carrocerías con los primeros ordenadores. Pero Paul de ' +
    'Casteljau, un matemático de Citroën, había llegado a lo mismo en 1959, con el algoritmo de interpolar ' +
    'y volver a interpolar que lleva su nombre. Citroën lo mantuvo en secreto industrial durante años, y ' +
    'por eso la fama se la llevó el de la competencia.');

  p.util('Todas las letras que estás leyendo son curvas de Bézier: las tipografías TrueType usan ' +
    'cuadráticas y las OpenType con contornos PostScript, cúbicas. Los trazados de los programas de ' +
    'ilustración, los caminos de un archivo SVG y la función <code>cubic-bezier</code> con la que se ' +
    'definen las animaciones de una página web son la misma fórmula.');

  /* ---------------------------------------------------------------- */
  p.section('Suavizar el movimiento');

  p.text('Una animación en la que algo se mueve a velocidad constante y se para de golpe parece de robot. ' +
    'Los objetos reales arrancan poco a poco y frenan poco a poco. Para imitarlo, en lugar de mover algo en ' +
    'proporción al tiempo $x$, se mueve según una función $f(x)$ que va de 0 a 1 con otra forma. La más ' +
    'usada es <code>smoothstep</code>, y no es magia: es un polinomio.');

  p.formula('\\operatorname{smoothstep}(0, 1, x) = 3x^2 - 2x^3, \\qquad f\'(x) = 6x - 6x^2', 'el polinomio de smoothstep',
    'Vale 0 en $x = 0$ y 1 en $x = 1$, igual que la recta $f(x) = x$. La diferencia está en la ' +
    '[[fn-derivadas|derivada]]: $f\'(0) = f\'(1) = 0$. La velocidad es nula al salir y al llegar, y máxima en ' +
    'medio, donde $f\'(\\frac{1}{2}) = \\frac{3}{2}$.<br><br>Con otros bordes, primero se lleva $x$ al intervalo ' +
    '$[0, 1]$: <code>smoothstep(e0, e1, x)</code> usa $t = \\operatorname{clamp}\\left(\\frac{x - e_0}{e_1 - e_0}, 0, 1\\right)$ y devuelve $3t^2 - 2t^3$.');

  p.table(['Nombre', 'Fórmula', 'Cómo se mueve'], [
    ['Lineal', '$x$', 'velocidad constante, arranque y frenazo bruscos'],
    ['Entrada suave', '$x^2$', 'arranca despacio y llega deprisa'],
    ['Salida suave', '$1 - (1 - x)^2$', 'arranca deprisa y frena al llegar'],
    ['Entrada y salida', '$3x^2 - 2x^3$', 'arranca y frena con suavidad']
  ]);

  p.demo({
    title: 'Cuatro formas de llegar',
    intro: 'Las cuatro bolas hacen el mismo recorrido en el mismo tiempo, de ida y vuelta. De arriba abajo: lineal, entrada suave, salida suave y smoothstep. Fíjate en cómo cambia la sensación de peso aunque todas tarden lo mismo.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-curvas-2', alto: 280,
        aria: 'Cuatro bolas que van y vienen de lado a lado con distintas funciones de suavizado.',
        mandos: [{ n: 'velocidad', label: 'velocidad', min: 0.1, max: 2.0, step: 0.05, value: 0.6, dec: 2 }],
        codigo:
          'float bola(vec2 p, vec2 c) { return length(p - c) - 0.035; }\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float ancho = 0.5 * iResolution.x / iResolution.y - 0.12;\n' +
          '\n' +
          '    // un reloj que sube de 0 a 1 y vuelve a bajar\n' +
          '    float s = fract(iTime * velocidad * 0.5);\n' +
          '    float x = 1.0 - abs(2.0 * s - 1.0);\n' +
          '\n' +
          '    float lineal = x;\n' +
          '    float entra  = x * x;\n' +
          '    float sale   = 1.0 - (1.0 - x) * (1.0 - x);\n' +
          '    float suave  = x * x * (3.0 - 2.0 * x);\n' +
          '\n' +
          '    vec3 c = vec3(0.07, 0.08, 0.12);\n' +
          '    c += 0.06 * (1.0 - smoothstep(0.0, 0.003, abs(abs(p.y) - 0.2)));   // separadores\n' +
          '    float d = bola(p, vec2(mix(-ancho, ancho, lineal), 0.3));\n' +
          '    c = mix(c, vec3(0.7, 0.7, 0.75), 1.0 - smoothstep(0.0, 0.004, d));\n' +
          '    d = bola(p, vec2(mix(-ancho, ancho, entra), 0.1));\n' +
          '    c = mix(c, vec3(0.35, 0.7, 1.0), 1.0 - smoothstep(0.0, 0.004, d));\n' +
          '    d = bola(p, vec2(mix(-ancho, ancho, sale), -0.1));\n' +
          '    c = mix(c, vec3(1.0, 0.6, 0.3), 1.0 - smoothstep(0.0, 0.004, d));\n' +
          '    d = bola(p, vec2(mix(-ancho, ancho, suave), -0.3));\n' +
          '    c = mix(c, vec3(0.5, 1.0, 0.6), 1.0 - smoothstep(0.0, 0.004, d));\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Prueba a cambiar la bola de abajo por <code>suave * suave * (3.0 - 2.0 * suave)</code>: aplicar smoothstep dos veces suaviza todavía más.'
      });
    }
  });

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El punto más cercano del segmento',
    level: 'medio',
    gen: function (r) {
      var a = [r.int(-3, 3), r.int(-3, 3)], b = [r.int(-3, 3), r.int(-3, 3)], q = [r.int(-4, 4), r.int(-4, 4)];
      var ba = [b[0] - a[0], b[1] - a[1]], bb = ba[0] * ba[0] + ba[1] * ba[1];
      if (!bb) return null;
      var hr = ML.F((q[0] - a[0]) * ba[0] + (q[1] - a[1]) * ba[1], bb);
      var h = hr.val() < 0 ? ML.F(0) : (hr.val() > 1 ? ML.F(1) : hr);
      var cx = a[0] + h.val() * ba[0], cy = a[1] + h.val() * ba[1];
      var sx = a[0] + hr.val() * ba[0], sy = a[1] + hr.val() * ba[1];
      return { a: a, b: b, q: q, bb: bb, hr: hr, h: h, cx: cx, cy: cy, d: Math.hypot(q[0] - cx, q[1] - cy), dRecta: Math.hypot(q[0] - sx, q[1] - sy) };
    },
    ask: function (d) {
      return 'Se quiere la distancia del punto $\\vec p = (' + d.q.join(',\\ ') + ')$ al segmento que va de $\\vec a = (' + d.a.join(',\\ ') + ')$ a $\\vec b = (' + d.b.join(',\\ ') +
        ')$. ¿Cuánto vale $h$, ya recortado entre 0 y 1, y cuál es la distancia? (Fracción o tres decimales.)';
    },
    fields: [{ name: 'h', label: '$h$', w: 'tiny' }, { name: 'd', label: 'distancia', w: 'wide' }],
    sol: function (d) { return { h: d.h.val(), d: U.round(d.d, 6) }; },
    tol: 1e-3,
    errores: [
      { si: function (v, d) { return !d.hr.eq(d.h) && Math.abs(v.h - d.hr.val()) < 5e-4; }, msg: 'Falta recortar: $h$ se sale de $[0, 1]$, y eso quiere decir que el punto más cercano es un extremo del segmento.' },
      { si: function (v, d) { return !d.hr.eq(d.h) && Math.abs(d.dRecta - d.d) > 2e-3 && Math.abs(v.d - d.dRecta) < 5e-4; }, msg: 'Esa es la distancia a la recta entera, no al segmento: el pie de la perpendicular cae fuera del segmento.' }
    ],
    hint: function () { return ['$h = \\dfrac{(\\vec p - \\vec a)\\cdot(\\vec b - \\vec a)}{|\\vec b - \\vec a|^2}$, y después se recorta a $[0, 1]$.', 'El punto más cercano es $\\vec a + h\\,(\\vec b - \\vec a)$.']; },
    steps: function (d) {
      return ['$\\vec p - \\vec a = (' + (d.q[0] - d.a[0]) + ',\\ ' + (d.q[1] - d.a[1]) + ')$, $\\vec b - \\vec a = (' + (d.b[0] - d.a[0]) + ',\\ ' + (d.b[1] - d.a[1]) + ')$, $|\\vec b - \\vec a|^2 = ' + d.bb + '$.',
        '$h = ' + d.hr.tex() + '$' + (d.hr.eq(d.h) ? ', que ya está entre 0 y 1.' : ', que se sale: recortado, $h = ' + d.h.tex() + '$.'),
        'Punto más cercano: $(' + U.fmt(d.cx, 3) + ',\\ ' + U.fmt(d.cy, 3) + ')$; distancia $\\approx ' + U.fmt(d.d, 3) + '$.'];
    },
    answer: function (d) { return 'h = ' + U.fmt(d.h.val(), 3) + ', d ≈ ' + U.fmt(d.d, 3); }
  });

  p.exercise({
    title: 'Un punto de una curva de Bézier',
    level: 'medio',
    gen: function (r) {
      var P = [[r.int(-4, 4), r.int(-4, 4)], [r.int(-4, 4), r.int(-4, 4)], [r.int(-4, 4), r.int(-4, 4)]], t = r.pick([0.25, 0.5, 0.75]), u = 1 - t;
      var B = [0, 1].map(function (k) { return u * u * P[0][k] + 2 * u * t * P[1][k] + t * t * P[2][k]; });
      var L = [0, 1].map(function (k) { return u * P[0][k] + t * P[2][k]; });
      if (Math.abs(B[0] - L[0]) < 1e-9 && Math.abs(B[1] - L[1]) < 1e-9) return null;
      return { P: P, t: t, B: B, L: L };
    },
    ask: function (d) {
      return 'Una curva de Bézier cuadrática tiene los puntos de control $P_0 = (' + d.P[0].join(',\\ ') + ')$, $P_1 = (' + d.P[1].join(',\\ ') + ')$ y $P_2 = (' + d.P[2].join(',\\ ') +
        ')$. ¿Qué punto de la curva corresponde a $t = ' + U.fmt(d.t, 2) + '$?';
    },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: d.B[0], y: d.B[1] }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.x - d.L[0]) < 1e-9 && Math.abs(v.y - d.L[1]) < 1e-9; }, msg: 'Ese punto está en la recta de $P_0$ a $P_2$: has ignorado $P_1$, que es justo el que curva el camino.' }],
    hint: function () { return ['Interpola primero en cada lado: $Q_0$ entre $P_0$ y $P_1$, $Q_1$ entre $P_1$ y $P_2$.', 'Después interpola entre $Q_0$ y $Q_1$ con el mismo $t$.']; },
    steps: function (d) {
      var t = d.t, Q0 = [0, 1].map(function (k) { return d.P[0][k] + t * (d.P[1][k] - d.P[0][k]); }), Q1 = [0, 1].map(function (k) { return d.P[1][k] + t * (d.P[2][k] - d.P[1][k]); });
      return ['$Q_0 = P_0 + ' + U.fmt(t, 2) + '\\,(P_1 - P_0) = (' + U.fmt(Q0[0], 3) + ',\\ ' + U.fmt(Q0[1], 3) + ')$',
        '$Q_1 = P_1 + ' + U.fmt(t, 2) + '\\,(P_2 - P_1) = (' + U.fmt(Q1[0], 3) + ',\\ ' + U.fmt(Q1[1], 3) + ')$',
        '$B = Q_0 + ' + U.fmt(t, 2) + '\\,(Q_1 - Q_0) = (' + U.fmt(d.B[0], 4) + ',\\ ' + U.fmt(d.B[1], 4) + ')$. Lo mismo sale con la fórmula $(1 - t)^2P_0 + 2(1 - t)tP_1 + t^2P_2$.'];
    },
    answer: function (d) { return '(' + U.fmt(d.B[0], 4) + ', ' + U.fmt(d.B[1], 4) + ')'; }
  });

  p.exercise({
    title: 'Calcula un smoothstep',
    level: 'basico',
    gen: function (r) {
      var e0 = r.pick([0, 0.2, 0.3, 0.5]), e1 = U.round(e0 + r.pick([0.2, 0.4, 0.5]), 4), x = U.round(e0 + (e1 - e0) * r.pick([0.25, 0.5, 0.75]), 4);
      var t = (x - e0) / (e1 - e0), s = t * t * (3 - 2 * t), m = Math.max(0, Math.min(1, x));
      return { e0: e0, e1: e1, x: x, t: t, s: s, sinNormalizar: m * m * (3 - 2 * m) };
    },
    ask: function (d) { return '¿Cuánto vale <code>smoothstep(' + U.fmt(d.e0, 1) + ', ' + U.fmt(d.e1, 1) + ', ' + U.fmt(d.x, 2) + ')</code>? (Cuatro decimales; escribe los números con coma o con punto.)'; },
    fields: [{ name: 's', label: 'resultado', w: 'wide' }],
    sol: function (d) { return { s: U.round(d.s, 6) }; },
    tol: 1e-4,
    errores: [
      { si: function (v, d) { return Math.abs(d.sinNormalizar - d.s) > 1e-4 && Math.abs(v.s - d.sinNormalizar) < 1e-4; }, msg: 'Antes del polinomio hay que llevar $x$ al intervalo $[0, 1]$: $t = \\frac{x - e_0}{e_1 - e_0}$.' },
      { si: function (v, d) { return Math.abs(d.t - d.s) > 1e-4 && Math.abs(v.s - d.t) < 1e-4; }, msg: 'Eso es $t$, la interpolación lineal. smoothstep le aplica además el polinomio $3t^2 - 2t^3$.' }
    ],
    hint: function () { return ['Primero $t = \\operatorname{clamp}\\left(\\frac{x - e_0}{e_1 - e_0}, 0, 1\\right)$.', 'Después $3t^2 - 2t^3$.']; },
    steps: function (d) {
      return ['$t = \\dfrac{' + U.fmt(d.x, 2) + ' - ' + U.fmt(d.e0, 1) + '}{' + U.fmt(d.e1, 1) + ' - ' + U.fmt(d.e0, 1) + '} = ' + U.fmt(d.t, 2) + '$',
        '$3\\cdot ' + U.fmt(d.t, 2) + '^2 - 2\\cdot ' + U.fmt(d.t, 2) + '^3 = ' + U.fmt(d.s, 5) + '$'];
    },
    answer: function (d) { return U.fmt(d.s, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float d = sdSegmento(p, vec2(-0.4, 0.0), vec2(0.4, 0.0));\nfloat v = 1.0 - smoothstep(0.05, 0.055, d);',
          o: ['Una barra horizontal gruesa con los extremos redondeados', 'Una barra horizontal con los extremos cuadrados', 'Una línea vertical fina', 'Un círculo de radio 0,4'],
          por: 'Los puntos a menos de 0,05 del segmento forman una barra; cerca de los extremos la distancia se mide al propio extremo, así que las puntas son semicírculos.' },
        { c: 'float d = min(sdSegmento(p, vec2(-0.3), vec2(0.3)),\n            sdSegmento(p, vec2(-0.3, 0.3), vec2(0.3, -0.3)));\nfloat v = 1.0 - smoothstep(0.02, 0.025, d);',
          o: ['Una X formada por las dos diagonales', 'Una cruz con un trazo horizontal y otro vertical', 'El contorno de un cuadrado', 'Dos rayas paralelas'],
          por: '<code>vec2(-0.3)</code> es $(-0{,}3, -0{,}3)$: el primer segmento es una diagonal y el segundo la otra. El mínimo dibuja las dos a la vez.' },
        { c: 'vec2 q = mix(mix(a, c, t), mix(c, b, t), t);',
          o: ['El punto de parámetro t de una curva de Bézier cuadrática que va de a hasta b', 'El punto medio entre a y b', 'Un punto del segmento que va de a a b', 'El centro del triángulo de vértices a, b y c'],
          por: 'Dos rondas de interpolación con el mismo $t$: es la construcción de De Casteljau con $a$ y $b$ como extremos y $c$ como punto de control.' },
        { c: 'float x = smoothstep(0.0, 1.0, fract(iTime));\nvec2 centro = vec2(mix(-0.5, 0.5, x), 0.0);',
          o: ['Un punto que cruza de izquierda a derecha arrancando y frenando con suavidad, y cada segundo salta de golpe al principio', 'Un punto que va y vuelve a velocidad constante', 'Un punto quieto en el centro', 'Un punto que va y vuelve frenando en los extremos, sin saltos'],
          por: '<code>fract(iTime)</code> sube de 0 a 1 cada segundo y vuelve a 0 de golpe; smoothstep suaviza la subida pero no puede evitar el salto.' },
        { c: 'float d = abs(length(p) - 0.3);\nfloat v = 1.0 - smoothstep(0.01, 0.015, d);',
          o: ['Un anillo fino de radio 0,3', 'Un círculo relleno de radio 0,3', 'Un anillo de radio 0,01', 'El contorno de un cuadrado'],
          por: '$|\\,|\\vec p| - 0{,}3\\,|$ es la distancia a la circunferencia de radio 0,3, así que se pintan los puntos muy cerca de ella: un anillo.' }
      ];
      var c = r.pick(casos), orden = r.shuffle([0, 1, 2, 3]);
      return { codigo: c.c, textos: c.o, orden: orden, por: c.por };
    },
    ask: function (d) {
      return 'Con <code>p</code> centrada en la pantalla y <code>sdSegmento</code> como en el tema, ¿qué se ve o qué se calcula?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Resultado', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Lee de dentro afuera: primero qué distancia se calcula, luego qué hace el smoothstep con ella.', 'Pregúntate qué puntos dan $v$ cerca de 1.']; },
    steps: function (d) { return [d.por, 'Respuesta: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'La distancia a un segmento es una proyección recortada: $h = \\operatorname{clamp}\\left(\\frac{(\\vec p - \\vec a)\\cdot(\\vec b - \\vec a)}{|\\vec b - \\vec a|^2}, 0, 1\\right)$ y $d = |\\vec p - \\vec a - h(\\vec b - \\vec a)|$.',
    'Una figura de trazos rectos es el mínimo de las distancias a sus segmentos.',
    'Una curva de Bézier es interpolar y volver a interpolar (De Casteljau); sus coeficientes suman 1 y la curva queda dentro de su polígono de control.',
    'smoothstep es el polinomio $3t^2 - 2t^3$, con derivada nula en los extremos: por eso arranca y frena con suavidad.'
  ]);
});
