/* Tema: Mosaicos: Truchet, hexagonos y teselados */
Course.topic('gfx-mosaicos', function (p) {

  p.text('Cubrir el suelo con baldosas sin dejar huecos ni montar unas sobre otras es uno de los problemas ' +
    'geométricos más antiguos y más decorativos que existen. En un shader es además uno de los más ' +
    'agradecidos: con [[gfx-repetir|fract y floor]] se reparte el plano en celdas, con un ' +
    '[[gfx-ruido|hash]] se decide algo distinto en cada una, y con unas pocas líneas sale un mosaico ' +
    'infinito.');

  p.text('Detrás hay combinatoria, ángulos de polígonos regulares y la [[av-grupos|teoría de grupos]] de la ' +
    'simetría. Este tema recorre tres escalones: baldosas que se giran al azar, rejillas de hexágonos y la ' +
    'pregunta de qué formas pueden cubrir el plano.');

  /* ---------------------------------------------------------------- */
  p.section('Mosaicos de Truchet: una moneda por celda');

  p.text('Una <strong>baldosa de Truchet</strong> es un cuadrado con un dibujo que no tiene la simetría del ' +
    'cuadrado: por ejemplo, dos cuartos de circunferencia centrados en dos esquinas opuestas. Esa baldosa se ' +
    'puede colocar de dos maneras, girada o sin girar. Si en cada celda se tira una moneda para decidirlo, los ' +
    'arcos de celdas vecinas empalman siempre, porque todos llegan al punto medio de los lados, y el resultado ' +
    'es una red de caminos que serpentean sin fin.');

  p.formula('\\text{celda} = \\lfloor k\\,\\vec p\\,\\rfloor, \\qquad \\vec q = \\operatorname{fract}(k\\,\\vec p) - \\tfrac{1}{2}, \\qquad \\text{si moneda} < \\tfrac{1}{2}:\\ q_x \\to -q_x',
    'el esquema de un mosaico por celdas',
    '$\\lfloor\\ \\rfloor$ es la parte entera por abajo, <code>floor</code>: numera la celda. $\\operatorname{fract}$ es la parte decimal: da la ' +
    'posición dentro de la celda, que al restar $\\frac{1}{2}$ va de $-\\frac{1}{2}$ a $\\frac{1}{2}$ con el centro en 0.<br><br>' +
    'Cambiar el signo de $q_x$ refleja la baldosa, que para estos dibujos es lo mismo que girarla un cuarto de vuelta.<br><br>' +
    'Con $n$ celdas y dos posiciones por celda hay $2^n$ mosaicos distintos: una cuadrícula de 10 por 10 ya da más ' +
    'de $10^{30}$.');

  p.demo({
    title: 'Truchet: arcos o diagonales',
    intro: 'Cada celda tira su moneda y coloca la baldosa girada o no. Con arcos salen caminos curvos que nunca se cortan; con diagonales, un laberinto. Cambia la semilla: es otro sorteo, otro mosaico.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-mosaicos-1', alto: 300,
        aria: 'Un mosaico de baldosas de Truchet que forma caminos curvos entrelazados, desplazándose despacio hacia arriba.',
        mandos: [
          { n: 'celdas', label: 'celdas por unidad', min: 3, max: 20, step: 1, value: 8, dec: 0 },
          { n: 'grosor', label: 'grosor', min: 0.02, max: 0.25, step: 0.01, value: 0.1, dec: 2 },
          { n: 'recta', label: 'arcos ↔ diagonales', min: 0, max: 1, step: 1, value: 0, dec: 0 },
          { n: 'semilla', label: 'semilla', min: 0, max: 50, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'float hash(vec2 c)\n' +
          '{\n' +
          '    return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    p = p * celdas + vec2(0.0, iTime * 0.3);\n' +
          '\n' +
          '    vec2 celda = floor(p);\n' +
          '    vec2 q = fract(p) - 0.5;                 // de -0,5 a 0,5 dentro de la celda\n' +
          '\n' +
          '    // la moneda: si sale menos de 0,5 se refleja la baldosa\n' +
          '    q.x *= 1.0 - 2.0 * step(0.5, hash(celda + semilla));\n' +
          '\n' +
          '    // dos cuartos de circunferencia centrados en esquinas opuestas\n' +
          '    float arcos = min(abs(length(q - vec2(0.5)) - 0.5),\n' +
          '                      abs(length(q + vec2(0.5)) - 0.5));\n' +
          '    // o una sola diagonal\n' +
          '    float diag = abs(q.x - q.y) / 1.41421356;\n' +
          '\n' +
          '    float d = mix(arcos, diag, recta);\n' +
          '    float v = 1.0 - smoothstep(grosor, grosor + 0.04, d);\n' +
          '\n' +
          '    vec3 fondo = vec3(0.08, 0.09, 0.14);\n' +
          '    vec3 tinta = 0.55 + 0.45 * cos(TAU * (vec3(0.0, 0.33, 0.67) + 0.05 * celda.x + 0.03 * celda.y));\n' +
          '    color = vec4(mix(fondo, tinta, v), 1.0);\n' +
          '}\n',
        nota: 'Pon «celdas por unidad» al mínimo para ver cada baldosa por separado y comprobar que los arcos siempre llegan al centro de los lados.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Rejillas hexagonales');

  p.text('La cuadrícula es la rejilla más fácil de programar, pero no la única ni la mejor. Los hexágonos ' +
    'tienen una propiedad especial: <strong>de todas las formas de dividir el plano en piezas de la misma ' +
    'área, la de hexágonos regulares es la que usa menos borde</strong>. Por eso los panales de las abejas son ' +
    'hexagonales: menos cera para el mismo espacio.');

  p.text('Para programarlos hay un truco: los centros de los hexágonos forman dos cuadrículas ' +
    'rectangulares desplazadas media celda. Se calcula el centro más cercano en cada una de las dos y ' +
    'se queda el que esté más cerca. Es un [[gfx-voronoi|diagrama de Voronoi]] con los puntos colocados en ' +
    'orden, en lugar de al azar.');

  p.demo({
    title: 'Un panal que late',
    intro: 'Cada hexágono sabe cuál es su centro y cuánto le falta para el borde. Con el centro se sortea su color; con la distancia al borde se dibuja la junta. Sube el latido para que cada celda palpite con su propio desfase.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-mosaicos-2', alto: 300,
        aria: 'Una rejilla de hexágonos de colores separados por juntas oscuras, cada uno con un brillo que palpita.',
        mandos: [
          { n: 'escala', label: 'tamaño (hexágonos por unidad)', min: 2, max: 14, step: 0.5, value: 6, dec: 1 },
          { n: 'junta', label: 'grosor de la junta', min: 0.0, max: 0.2, step: 0.005, value: 0.04, dec: 3 },
          { n: 'latido', label: 'latido', min: 0.0, max: 1.0, step: 0.01, value: 0.5, dec: 2 }
        ],
        codigo:
          'const vec2 S = vec2(1.0, 1.7320508);        // separacion de los centros: 1 y raiz de 3\n' +
          '\n' +
          'float hash(vec2 c)\n' +
          '{\n' +
          '    return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          '// devuelve la posicion respecto al centro mas cercano (xy) y ese centro (zw)\n' +
          'vec4 celdaHex(vec2 p)\n' +
          '{\n' +
          '    vec4 c = floor(vec4(p, p - vec2(0.5, 1.0)) / S.xyxy) + 0.5;\n' +
          '    vec4 h = vec4(p - c.xy * S, p - (c.zw + 0.5) * S);\n' +
          '    return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? vec4(h.xy, c.xy) : vec4(h.zw, c.zw + 0.5);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y * escala;\n' +
          '    vec4 h = celdaHex(p);\n' +
          '\n' +
          '    // distancia al borde: 0 en la junta, 0,5 en el centro\n' +
          '    vec2 q = abs(h.xy);\n' +
          '    float borde = 0.5 - max(q.x, dot(q, vec2(0.5, 0.8660254)));\n' +
          '\n' +
          '    float azar = hash(h.zw);\n' +
          '    vec3 relleno = 0.55 + 0.45 * cos(TAU * (azar + vec3(0.0, 0.33, 0.67)));\n' +
          '    relleno *= mix(1.0, 0.5 + 0.5 * sin(2.0 * iTime + TAU * azar), latido);\n' +
          '\n' +
          '    float v = smoothstep(junta, junta + 0.02, borde);\n' +
          '    color = vec4(mix(vec3(0.05), relleno, v), 1.0);\n' +
          '}\n',
        nota: 'Cambia el cálculo del color por <code>vec3(borde * 2.0)</code> y verás el campo de distancias al borde de cada celda: una pirámide hexagonal por baldosa.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('¿Qué formas cubren el plano?');

  p.text('Con polígonos regulares iguales, la respuesta es sorprendentemente corta. En cada vértice del ' +
    'mosaico se juntan varias copias, y sus ángulos interiores tienen que sumar exactamente $360^\\circ$: ni ' +
    'menos, que dejaría un hueco, ni más, que las haría montarse.');

  p.formula('\\alpha_n = \\frac{(n - 2)\\cdot 180^\\circ}{n}, \\qquad k = \\frac{360^\\circ}{\\alpha_n} = \\frac{2n}{n - 2} = 2 + \\frac{4}{n - 2}',
    'el ángulo interior y cuántas copias caben en un vértice',
    '$\\alpha_n$ es el [[ge-angulos|ángulo interior]] de un polígono regular de $n$ lados: sus ángulos suman ' +
    '$(n - 2)\\cdot 180^\\circ$ y hay $n$ iguales.<br><br>$k$ tiene que ser entero, y $2 + \\frac{4}{n - 2}$ solo lo es ' +
    'cuando $n - 2$ divide a 4: $n - 2 = 1, 2, 4$. <strong>Solo triángulos, cuadrados y hexágonos</strong> ' +
    'teselan el plano, con 6, 4 y 3 copias por vértice.');

  p.demo({
    title: 'Polígonos alrededor de un vértice',
    intro: 'Se colocan copias de un polígono regular alrededor de un vértice común, una detrás de otra. Solo cierran sin hueco ni solape si el ángulo interior cabe un número exacto de veces en 360°. La copia que se monta sale en rojo. Recorre n.',
    build: function (host) {
      var n = 5;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -2.8, xmax: 2.8, ymin: -2.4, ymax: 2.4, height: 320, grid: false, axes: false,
        aria: 'Copias de un polígono regular colocadas alrededor de un vértice común',
        draw: function (g) {
          var ang = (n - 2) * Math.PI / n, cabe = 2 * Math.PI / ang, exacto = Math.abs(cabe - Math.round(cabe)) < 1e-9;
          var copias = exacto ? Math.round(cabe) : Math.floor(cabe) + 1, L = 1.25;
          for (var c = 0; c < copias; c++) {
            var dir = c * ang, x = 0, y = 0, pts = [[0, 0]];
            for (var j = 0; j < n - 1; j++) { x += L * Math.cos(dir); y += L * Math.sin(dir); pts.push([x, y]); dir += Math.PI - ang; }
            g.poly(pts, { color: (!exacto && c === copias - 1) ? 'bad' : c % 5, fillAlpha: 0.22, w: 1.8 });
          }
          g.point(0, 0, { color: 'ink', r: 4 });
        }
      });
      function pinta() {
        var ang = 180 * (n - 2) / n, k = 360 / ang, exacto = Math.abs(k - Math.round(k)) < 1e-9;
        out.set('$n = ' + n + '$ &nbsp;·&nbsp; ángulo interior $\\alpha = ' + U.fmt(ang, 2) + '^\\circ$ &nbsp;·&nbsp; $\\frac{360^\\circ}{\\alpha} = ' + U.fmt(k, 3) + '$ &nbsp;→&nbsp; ' +
          (exacto ? '<strong style="color:var(--ok)">caben exactamente ' + Math.round(k) + ': teselan el plano</strong>' : '<strong style="color:var(--bad)">no es entero: no teselan</strong>'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'número de lados n', min: 3, max: 12, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  p.text('Si se permiten formas no regulares, o varios tipos de pieza, las posibilidades se disparan. Pero ' +
    'las <strong>simetrías</strong> que puede tener un mosaico periódico del plano siguen siendo pocas: se ' +
    'demostró en 1891 que hay exactamente <strong>17 grupos de simetría</strong> posibles, los llamados grupos ' +
    'cristalográficos planos. Cualquier papel pintado, cualquier azulejo repetido, pertenece a uno de ellos.');

  p.hist('Sébastien Truchet, un fraile dominico francés aficionado a la mecánica, publicó en 1704 un estudio ' +
    'sobre las combinaciones de una baldosa partida en dos triángulos de colores. La versión con arcos la ' +
    'popularizó el metalúrgico Cyril Stanley Smith en 1987. Los 17 grupos de simetría los clasificó el ' +
    'cristalógrafo ruso Yevgraf Fiódorov en 1891, y en la Alhambra de Granada se han identificado ejemplos de ' +
    'buena parte de ellos, construidos siglos antes. M. C. Escher la visitó en 1922 y en 1936, y salió de allí ' +
    'con la idea de sus mosaicos de animales. Y en 2023, David Smith, un aficionado inglés, descubrió el ' +
    '«sombrero», la primera pieza única que cubre el plano sin repetirse nunca de forma periódica.');

  p.util('En 1982, el manual del ordenador Commodore 64 incluía un programa de una sola línea que llenaba la ' +
    'pantalla de barras diagonales elegidas al azar: un Truchet de diagonales, y su laberinto se hizo famoso. ' +
    'Los mosaicos generados por celdas se usan hoy para crear niveles de videojuegos, estampados textiles y ' +
    'texturas de materiales, y los hexágonos para los mapas de juegos de estrategia, donde las seis casillas ' +
    'vecinas están todas a la misma distancia.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Tesela el plano?',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
      return { n: n, a: ML.F(180 * (n - 2), n), ok: [3, 4, 6].indexOf(n) >= 0 ? 'si' : 'no' };
    },
    ask: function (d) {
      return 'Un polígono regular tiene ' + d.n + ' lados. ¿Cuánto mide su ángulo interior, en grados (fracción o tres decimales)? ¿Pueden copias iguales de él cubrir el plano, encontrándose en los vértices sin huecos ni solapes?';
    },
    fields: [{ name: 'a', label: 'ángulo (°)', w: 'wide' }, { name: 't', label: '¿Teselan?', opts: [{ t: 'Sí', v: 'si' }, { t: 'No', v: 'no' }] }],
    sol: function (d) { return { a: d.a.val(), t: d.ok }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(360 / d.n - d.a.val()) > 1e-3 && Math.abs(v.a - 360 / d.n) < 5e-4; }, msg: 'Eso es el ángulo <strong>exterior</strong>, lo que se gira al recorrer el borde. El interior es su suplementario: $180^\\circ$ menos eso.' }],
    hint: function () { return ['Los ángulos de un polígono de $n$ lados suman $(n - 2)\\cdot 180^\\circ$.', 'Teselan si $360^\\circ$ entre el ángulo interior da un número entero.']; },
    steps: function (d) {
      var k = 360 / d.a.val();
      return ['$\\alpha = \\dfrac{(' + d.n + ' - 2)\\cdot 180^\\circ}{' + d.n + '} = ' + d.a.tex() + '^\\circ' + (d.a.isInt() ? '' : ' \\approx ' + U.fmt(d.a.val(), 3) + '^\\circ') + '$',
        '$\\dfrac{360^\\circ}{\\alpha} = ' + U.fmt(k, 3) + '$' + (d.ok === 'si' ? ', entero: caben ' + Math.round(k) + ' copias en cada vértice. <strong>Sí teselan.</strong>' : ', no es entero. <strong>No teselan.</strong>')];
    },
    answer: function (d) { return U.fmt(d.a.val(), 3) + '°, ' + (d.ok === 'si' ? 'sí' : 'no'); }
  });

  p.exercise({
    title: 'Cuántos mosaicos de Truchet',
    level: 'medio',
    gen: function (r) {
      var a = r.int(2, 4), b = r.int(2, 4), o = r.pick([2, 4]);
      return { a: a, b: b, o: o, n: Math.pow(o, a * b) };
    },
    ask: function (d) {
      return 'Una cuadrícula tiene ' + d.a + ' filas y ' + d.b + ' columnas. En cada celda se pone una baldosa que admite ' + d.o +
        ' orientaciones distintas, elegida con independencia de las demás. ¿Cuántos mosaicos distintos se pueden formar?';
    },
    fields: [{ name: 'n', label: 'mosaicos', w: 'wide' }],
    sol: function (d) { return { n: d.n }; },
    errores: [
      { si: function (v, d) { return v.n === d.o * d.a * d.b; }, msg: 'Las elecciones de cada celda se combinan con las de todas las demás: se <strong>multiplican</strong> tantas veces como celdas hay, no se suman.' },
      { si: function (v, d) { return Math.pow(d.a * d.b, d.o) !== d.n && v.n === Math.pow(d.a * d.b, d.o); }, msg: 'Al revés: la base es el número de orientaciones y el exponente, el número de celdas.' }
    ],
    hint: function () { return ['¿Cuántas celdas hay?', 'Cada celda multiplica las posibilidades por el número de orientaciones: principio multiplicativo de la [[pe-combinatoria|combinatoria]].']; },
    steps: function (d) { return ['Hay $' + d.a + '\\cdot ' + d.b + ' = ' + (d.a * d.b) + '$ celdas, cada una con ' + d.o + ' opciones.', '$' + d.o + '^{' + (d.a * d.b) + '} = ' + U.miles(d.n) + '$ mosaicos distintos.']; },
    answer: function (d) { return U.miles(d.n); }
  });

  p.exercise({
    title: 'La celda y la coordenada local',
    level: 'medio',
    gen: function (r) {
      var N = r.pick([4, 5, 8, 10]), x = U.round(r.real(-0.5, 0.5), 3), y = U.round(r.real(-0.5, 0.5), 3);
      var px = x * N, py = y * N;
      if (Math.abs(px - Math.round(px)) < 1e-6 || Math.abs(py - Math.round(py)) < 1e-6) return null;
      return { N: N, x: x, y: y, px: px, py: py, cx: Math.floor(px), cy: Math.floor(py), qx: px - Math.floor(px) - 0.5, qy: py - Math.floor(py) - 0.5 };
    },
    ask: function (d) {
      return 'Un shader hace <code>vec2 celda = floor(p * ' + d.N + '.0);</code> y <code>vec2 q = fract(p * ' + d.N + '.0) - 0.5;</code> ¿Qué valen <code>celda</code> y <code>q</code> para <code>p = (' +
        U.fmt(d.x, 3) + ', ' + U.fmt(d.y, 3) + ')</code>? (Tres decimales.)';
    },
    fields: [{ name: 'cx', label: 'celda.x', w: 'tiny' }, { name: 'cy', label: 'celda.y', w: 'tiny' }, { name: 'qx', label: 'q.x', w: 'tiny' }, { name: 'qy', label: 'q.y', w: 'tiny' }],
    sol: function (d) { return { cx: d.cx, cy: d.cy, qx: U.round(d.qx, 6), qy: U.round(d.qy, 6) }; },
    tol: 1e-3,
    errores: [
      { si: function (v, d) { return (d.px < 0 && v.cx === Math.trunc(d.px) && Math.trunc(d.px) !== d.cx) || (d.py < 0 && v.cy === Math.trunc(d.py) && Math.trunc(d.py) !== d.cy); }, msg: '<code>floor</code> redondea siempre hacia abajo, también con negativos: $\\lfloor -1{,}3 \\rfloor = -2$, no $-1$.' },
      { si: function (v, d) { return Math.abs(v.qx - (d.qx + 0.5)) < 5e-4 && Math.abs(v.qy - (d.qy + 0.5)) < 5e-4; }, msg: 'Eso es <code>fract</code> sin centrar: falta restar 0,5 para que la coordenada local vaya de −0,5 a 0,5.' }
    ],
    hint: function () { return ['Multiplica primero por el número de celdas.', '<code>floor</code> es la parte entera por abajo y <code>fract(x) = x - floor(x)</code>, que siempre queda entre 0 y 1.']; },
    steps: function (d) {
      return ['$p \\cdot ' + d.N + ' = (' + U.fmt(d.px, 3) + ',\\ ' + U.fmt(d.py, 3) + ')$',
        'celda $= (\\lfloor ' + U.fmt(d.px, 3) + ' \\rfloor,\\ \\lfloor ' + U.fmt(d.py, 3) + ' \\rfloor) = (' + d.cx + ',\\ ' + d.cy + ')$',
        'fract $= (' + U.fmt(d.px - d.cx, 3) + ',\\ ' + U.fmt(d.py - d.cy, 3) + ')$, y restando 0,5: $q = (' + U.fmt(d.qx, 3) + ',\\ ' + U.fmt(d.qy, 3) + ')$'];
    },
    answer: function (d) { return 'celda (' + d.cx + ', ' + d.cy + '), q (' + U.fmt(d.qx, 3) + ', ' + U.fmt(d.qy, 3) + ')'; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec2 q = fract(p * 4.0) - 0.5;\nfloat v = step(length(q), 0.3);',
          o: ['Una cuadrícula de círculos iguales, uno por celda', 'Un solo círculo grande en el centro', 'Rayas verticales', 'Un tablero de ajedrez'],
          por: '<code>q</code> es la posición dentro de cada celda, centrada; el <code>step</code> pinta un círculo de radio 0,3 alrededor del centro de cada una.' },
        { c: 'vec2 c = floor(p * 6.0);\nfloat v = mod(c.x + c.y, 2.0);',
          o: ['Un tablero de ajedrez', 'Rayas diagonales finas', 'Círculos repetidos', 'Un degradado de izquierda a derecha'],
          por: 'La suma de los índices de celda cambia de paridad al pasar a cualquier celda vecina, así que las celdas se alternan: 0, 1, 0, 1… en las dos direcciones.' },
        { c: 'vec2 c = floor(p * 10.0);\nvec2 q = fract(p * 10.0) - 0.5;\nq.x *= 1.0 - 2.0 * step(0.5, hash(c));\nfloat v = 1.0 - smoothstep(0.05, 0.1, abs(q.x - q.y));',
          o: ['Un laberinto de diagonales que cambian de sentido al azar en cada celda', 'Diagonales todas paralelas', 'Una cuadrícula de líneas horizontales y verticales', 'Círculos concéntricos'],
          por: 'En cada celda se dibuja la diagonal $q_x = q_y$, pero la mitad de las celdas, según su hash, reflejan $q_x$ y la diagonal cambia de sentido: es el laberinto de Truchet.' },
        { c: 'vec2 q = abs(fract(p * 3.0) - 0.5);\nfloat v = step(max(q.x, q.y), 0.4);',
          o: ['Baldosas cuadradas separadas por juntas finas', 'Rombos separados por juntas', 'Círculos en cuadrícula', 'Una sola cruz en el centro'],
          por: '$\\max(|q_x|, |q_y|) < 0{,}4$ es un cuadrado centrado en cada celda, un poco más pequeño que la celda: queda una junta de anchura 0,2 entre baldosas.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>p</code> centrada en la pantalla, <code>hash</code> como en el tema y el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Qué calcula cada celda por su cuenta?', '¿Qué valores de <code>p</code> dan <code>v</code> igual a 1?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'Un mosaico por celdas: <code>floor</code> numera la celda, <code>fract(…) - 0.5</code> da la posición local centrada y un hash decide algo distinto en cada una.',
    'Las baldosas de Truchet se colocan al azar en dos posiciones y aun así empalman: con $n$ celdas hay $2^n$ mosaicos.',
    'Una rejilla hexagonal se programa con dos cuadrículas desplazadas, quedándose con el centro más cercano.',
    'Solo triángulos, cuadrados y hexágonos regulares teselan el plano, porque $\\frac{360^\\circ}{\\alpha_n} = 2 + \\frac{4}{n - 2}$ solo es entero para $n = 3, 4, 6$.',
    'Los mosaicos periódicos del plano tienen solo 17 grupos de simetría posibles.'
  ]);
});
