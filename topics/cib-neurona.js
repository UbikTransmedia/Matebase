/* Tema: La neurona de McCulloch-Pitts y el perceptron */
Course.topic('cib-neurona', function (p) {

  p.puente('Los temas anteriores regulaban con números: ganancias, integrales, varianzas. Este regula ' +
    'con un sí o un no. Una neurona artificial es un [[ge-vectores|producto escalar]] seguido de una ' +
    'comparación, y aprender es un bucle de corrección como el de [[cib-realimentacion|la realimentación]], ' +
    'aplicado a los pesos en vez de a la temperatura.');

  p.text('En 1943, un neurofisiólogo de cuarenta y cinco años, Warren McCulloch, y un lógico de ' +
    'diecinueve, Walter Pitts, publicaron un artículo con un título de lo más árido: <em>Un cálculo lógico ' +
    'de las ideas inmanentes en la actividad nerviosa</em>. Dentro había una idea que iba a cambiar el ' +
    'siglo: una neurona se puede describir como un pequeño aparato que suma lo que le llega y decide si ' +
    'dispararse. Y con aparatos así, bien conectados, se puede calcular cualquier cosa que calcule la ' +
    '[[lg-proposiciones|lógica]].');

  p.text('Quince años después, Frank Rosenblatt le añadió lo que faltaba: una regla para que la neurona ' +
    '<strong>aprenda de sus errores</strong>. Esa regla es un bucle de [[cib-realimentacion|realimentación]] ' +
    'como los de todo este bloque, y es el antepasado directo de las redes neuronales que hoy reconocen ' +
    'caras, traducen idiomas y escriben textos.');

  /* ---------------------------------------------------------------- */
  p.section('La neurona como puerta lógica');

  p.text('La neurona de McCulloch y Pitts recibe varias entradas $x_1, x_2, \\dots$ que valen 0 o 1. Cada ' +
    'entrada llega por una conexión con un <strong>peso</strong>: positivo si excita, negativo si inhibe. ' +
    'La neurona suma las entradas multiplicadas por sus pesos y compara con un <strong>umbral</strong>.');

  p.formula('y = \\begin{cases} 1 & \\text{si } w_1x_1 + w_2x_2 + \\dots + w_nx_n \\ge \\theta \\\\ 0 & \\text{si no} \\end{cases}',
    'la neurona de McCulloch-Pitts',
    'Se lee: <em>«i griega vale uno si la suma de las entradas por sus pesos es mayor o igual que theta, y cero si no»</em>.<br><br>' +
    'La suma $w_1x_1 + \\dots + w_nx_n$ es el [[ge-vectores|producto escalar]] $\\vec w\\cdot\\vec x$ del vector de pesos y el de entradas.<br><br>' +
    '$\\theta$ es la letra griega theta, el umbral. La neurona «se dispara» cuando la suma lo alcanza.');

  p.text('Con dos entradas y los pesos adecuados, una sola neurona imita las puertas lógicas:');

  p.table(['Puerta', 'Pesos', 'Umbral', 'Se dispara cuando…'], [
    ['AND', '$1,\\ 1$', '$2$', 'las dos entradas valen 1'],
    ['OR', '$1,\\ 1$', '$1$', 'alguna entrada vale 1'],
    ['NOT (una entrada)', '$-1$', '$0$', 'la entrada vale 0'],
    ['NAND', '$-1,\\ -1$', '$-1$', 'no valen 1 las dos']
  ]);

  p.text('Hay una manera geométrica de verlo que lo explica todo. Las cuatro entradas posibles, $(0,0)$, ' +
    '$(0,1)$, $(1,0)$ y $(1,1)$, son las esquinas de un cuadrado. La igualdad $w_1x_1 + w_2x_2 = \\theta$ es ' +
    'una [[ge-rectas|recta]], y la neurona se dispara en uno de los dos semiplanos que deja. Diseñar una ' +
    'neurona es, literalmente, <strong>trazar una recta</strong> que separe las esquinas que deben dar 1 de ' +
    'las que deben dar 0.');

  p.comprueba('Con pesos $(1, 1)$, ¿qué umbral hace que la neurona se comporte como OR y cuál como AND?', [
    { t: 'OR con $\\theta = 1$, AND con $\\theta = 2$', ok: true, por: 'Las sumas posibles son 0, 1, 1 y 2. Con $\\theta = 1$ se dispara en cuanto una entrada vale 1; con $\\theta = 2$ solo cuando valen 1 las dos. El umbral es la única diferencia entre las dos puertas.' },
    { t: 'OR con $\\theta = 2$, AND con $\\theta = 1$', ok: false, por: 'Al revés: un umbral alto exige más, y eso es AND. Con $\\theta = 1$ basta con una entrada activa: OR.' },
    { t: 'No se puede: hacen falta pesos distintos', ok: false, por: 'Con pesos iguales salen las dos, solo cambia el umbral. Lo que no sale con ningún peso ni umbral es XOR.' }
  ]);

  p.demo({
    title: 'Una neurona que parte el plano',
    intro: 'Las dos entradas son las coordenadas de un punto; la neurona se dispara en la zona coloreada, donde w₁x₁ + w₂x₂ ≥ θ. Elige una puerta y busca pesos y umbral que la imiten en las cuatro esquinas: una esquina con aro rojo está mal. Con XOR no lo vas a conseguir, y no es por falta de paciencia.',
    predice: 'Con $w = (1,1)$ y $\\theta = 1{,}5$ la neurona hace AND. Si bajas el umbral a $0{,}5$ sin tocar los pesos, ¿qué puerta saldrá?',
    build: function (host) {
      var w1 = 1, w2 = 1, th = 1.5, puerta = 'AND';
      var TABLAS = { AND: [0, 0, 0, 1], OR: [0, 1, 1, 1], NAND: [1, 1, 1, 0], XOR: [0, 1, 1, 0] };
      var PTS = [[0, 0], [0, 1], [1, 0], [1, 1]];
      var out = W.readout(host, '');
      function dispara(q) { return w1 * q[0] + w2 * q[1] >= th ? 1 : 0; }
      function semiplano(g) {
        var R = [[g.xmin, g.ymin], [g.xmax, g.ymin], [g.xmax, g.ymax], [g.xmin, g.ymax]], res = [];
        for (var i = 0; i < 4; i++) {
          var A = R[i], B = R[(i + 1) % 4], fa = w1 * A[0] + w2 * A[1] - th, fb = w1 * B[0] + w2 * B[1] - th;
          if (fa >= 0) res.push(A);
          if ((fa >= 0) !== (fb >= 0)) { var t = fa / (fa - fb); res.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); }
        }
        return res;
      }
      var plot = W.board(host, {
        xmin: -0.6, xmax: 1.6, ymin: -0.6, ymax: 1.6, height: 320, xlabel: 'x₁', ylabel: 'x₂',
        aria: 'Plano de entradas de una neurona con dos entradas, con la recta de disparo y las cuatro esquinas del cuadrado unidad',
        draw: function (g) {
          var zona = semiplano(g);
          if (zona.length >= 3) g.poly(zona, { color: 2, fillAlpha: 0.16, stroke: false });
          if (Math.abs(w2) > 1e-9) g.fn(function (x) { return (th - w1 * x) / w2; }, { color: 2, w: 2.4 });
          else if (Math.abs(w1) > 1e-9) g.vline(th / w1, { color: 2, w: 2.4 });
          PTS.forEach(function (q, i) {
            var y = dispara(q), bien = y === TABLAS[puerta][i];
            g.point(q[0], q[1], { color: y ? 0 : 'axis', r: 7, hollow: !y, label: String(TABLAS[puerta][i]) });
            if (!bien) g.circle(q[0], q[1], 0.11, { color: 'bad', w: 2.6 });
          });
        }
      });
      function pinta() {
        var ys = PTS.map(dispara), ok = ys.every(function (y, i) { return y === TABLAS[puerta][i]; });
        out.set('La neurona da, en $(0,0)$, $(0,1)$, $(1,0)$ y $(1,1)$: <strong>' + ys.join(', ') + '</strong> &nbsp;·&nbsp; ' + puerta + ' pide: ' + TABLAS[puerta].join(', ') +
          ' &nbsp;·&nbsp; ' + (ok ? '<strong style="color:var(--ok)">¡La imita!</strong>' : 'todavía no') +
          (puerta === 'XOR' ? '<br>XOR pide 1 en dos esquinas opuestas y 0 en las otras dos. Ninguna recta deja a un lado dos esquinas opuestas y al otro las otras dos.' : ''));
        plot.render();
      }
      W.chips(host, ['AND', 'OR', 'NAND', 'XOR'], { value: puerta, on: function (v) { puerta = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: '$w_1$', min: -2, max: 2, step: 0.05, value: w1, on: function (v) { w1 = v; pinta(); } });
      W.slider(fila, { label: '$w_2$', min: -2, max: 2, step: 0.05, value: w2, on: function (v) { w2 = v; pinta(); } });
      W.slider(fila, { label: 'umbral $\\theta$', min: -2.5, max: 3, step: 0.05, value: th, on: function (v) { th = v; pinta(); } });
      W.hint(host, 'El número junto a cada esquina es lo que pide la puerta; el punto relleno, que la neurona se dispara.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El perceptrón: aprender del error');

  p.text('McCulloch y Pitts elegían los pesos a mano. En 1958, Frank Rosenblatt propuso que la neurona los ' +
    'encontrara sola a base de ejemplos, y la llamó <strong>perceptrón</strong>. Se le enseña una entrada ' +
    'junto con la respuesta correcta $t$; si acierta, no se toca nada; si se equivoca, cada peso se mueve ' +
    'un poco en la dirección que habría evitado el error. Por comodidad, el umbral se pasa al otro lado ' +
    'como un <strong>sesgo</strong> $b = -\\theta$, y la neurona se dispara cuando $\\vec w\\cdot\\vec x + b \\ge 0$.');

  p.formulas([
    'w_i^{\\text{nuevo}} = w_i + \\eta\\,(t - y)\\,x_i',
    'b^{\\text{nuevo}} = b + \\eta\\,(t - y)'
  ], 'la regla del perceptrón',
    'Se lee: <em>«el peso nuevo es el viejo más eta por el error por la entrada»</em>.<br><br>' +
    '$t - y$ es la <strong>señal de error</strong>: vale $0$ si acierta, $+1$ si debía dispararse y no lo hizo, ' +
    'y $-1$ si se disparó sin deber.<br><br>$\\eta$, la letra griega eta, es la <strong>tasa de aprendizaje</strong>: ' +
    'cuánto se corrige en cada error. Es la ganancia de este bucle, igual que $K$ en un control ' +
    '[[cib-control|proporcional]]: si es pequeña aprende despacio, si es grande da bandazos.');

  p.demo({
    title: 'Un perceptrón que aprende',
    intro: 'Dos nubes de puntos: los azules deben quedar a un lado de la recta y los naranjas al otro. Cada paso presenta un punto; si está mal clasificado (punto hueco y más grande), la regla del perceptrón mueve la recta. Con nubes separables acaba encontrando una recta buena; con nubes mezcladas, no para nunca.',
    predice: 'Con nubes separables y $\\eta = 0{,}2$, ¿cuántas pasadas crees que harán falta hasta cero errores: una, unas pocas, cientos? Y con nubes mezcladas, ¿se parará alguna vez?',
    build: function (host) {
      var sep = true, eta = 0.2, semilla = 3, datos, w, b, pasos, idx;
      var out = W.readout(host, '');
      function genera() {
        var rng = U.rng(semilla);
        datos = [];
        for (var i = 0; i < 40; i++) {
          var clase = i % 2 === 0 ? 1 : 0, cx = clase ? 1.2 : -1.2, cy = clase ? 0.8 : -0.8;
          if (!sep) { cx *= 0.2; cy *= 0.2; }
          datos.push({ x: cx + (rng.real(0, 1) - 0.5) * 2.2, y: cy + (rng.real(0, 1) - 0.5) * 2.2, t: clase });
        }
        w = [0.1, -0.4]; b = 0.3; pasos = 0; idx = 0;
      }
      function salida(q) { return w[0] * q.x + w[1] * q.y + b >= 0 ? 1 : 0; }
      function fallos() { return datos.filter(function (q) { return salida(q) !== q.t; }).length; }
      function paso() {
        var q = datos[idx % datos.length], e = q.t - salida(q);
        idx++; pasos++;
        if (e !== 0) { w[0] += eta * e * q.x; w[1] += eta * e * q.y; b += eta * e; }
      }
      genera();
      var plot = W.board(host, {
        xmin: -3, xmax: 3, ymin: -3, ymax: 3, height: 330,
        aria: 'Dos nubes de puntos de dos clases y la recta con la que el perceptrón intenta separarlas',
        draw: function (g) {
          if (Math.abs(w[1]) > 1e-9) g.fn(function (x) { return -(w[0] * x + b) / w[1]; }, { color: 'ink', w: 2.4 });
          else if (Math.abs(w[0]) > 1e-9) g.vline(-b / w[0], { color: 'ink', w: 2.4 });
          datos.forEach(function (q) {
            var bien = salida(q) === q.t;
            g.point(q.x, q.y, { color: q.t ? 1 : 0, r: bien ? 4 : 6, hollow: !bien });
          });
        }
      });
      function pinta() {
        var e = fallos();
        out.set('Pasos: ' + pasos + ' &nbsp;·&nbsp; $\\vec w = (' + U.fmt(w[0], 2) + ',\\ ' + U.fmt(w[1], 2) + ')$, $b = ' + U.fmt(b, 2) +
          '$ &nbsp;·&nbsp; mal clasificados: <strong>' + e + '</strong>' + (e === 0 ? ' &nbsp;<strong style="color:var(--ok)">Todos bien: ha aprendido.</strong>' : ''));
        plot.render();
      }
      W.chips(host, [{ label: 'nubes separables', value: true }, { label: 'nubes mezcladas', value: false }], { value: sep, on: function (v) { sep = v; genera(); pinta(); } });
      W.buttons(host, [
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: 'Una pasada (40 pasos)', on: function () { for (var i = 0; i < 40; i++) paso(); pinta(); } },
        { t: 'Otros datos', on: function () { semilla++; genera(); pinta(); } }
      ]);
      W.slider(W.row(host), { label: 'tasa de aprendizaje $\\eta$', min: 0.02, max: 1, step: 0.01, value: eta, on: function (v) { eta = v; } });
      pinta();
    }
  });

  p.note('Rosenblatt demostró, y Albert Novikoff lo dejó bien atado en 1962, que <strong>si existe una recta ' +
    'que separe los ejemplos, el perceptrón la encuentra en un número finito de pasos</strong>. Es un ' +
    'teorema de convergencia: la realimentación del error no da vueltas para siempre, llega.', 'ok', 'El teorema del perceptrón');

  /* ---------------------------------------------------------------- */
  p.section('Lo que un perceptrón no puede aprender');

  p.text('La otra cara del teorema es igual de tajante: si no existe esa recta, el perceptrón no aprenderá ' +
    'nunca, por muchos ejemplos que vea. Y la función más sencilla que no admite recta es la ' +
    '<strong>O exclusiva</strong>, XOR: vale 1 cuando las dos entradas son distintas. Sus unos están en ' +
    'esquinas opuestas del cuadrado, y ninguna recta separa dos esquinas opuestas de las otras dos.');

  p.text('La salida es añadir <strong>capas</strong>: una neurona calcula OR, otra NAND, y una tercera hace ' +
    'el AND de las dos. Eso es XOR. Cada neurona sigue trazando una recta, pero combinando varias se pueden ' +
    'recortar regiones de cualquier forma. El problema pasa a ser otro: cómo repartir la culpa del error ' +
    'entre neuronas que no están en la salida.');

  p.ejemplo({
    title: 'Diseñar NAND y comprobar que XOR no sale',
    enunciado: 'Encontrar pesos y umbral para una neurona NAND, que da 0 solo cuando las dos entradas valen 1, y explicar por qué ninguna neurona de este tipo hace XOR.',
    pasos: [
      { t: '<strong>Qué pide NAND.</strong> Salidas 1, 1, 1, 0 para $(0,0)$, $(0,1)$, $(1,0)$, $(1,1)$. Hay que dispararse «casi siempre»: solo la esquina $(1,1)$ debe quedar fuera.', antes: 'Escribe la tabla de NAND. ¿Cuántas esquinas deben dar 1?' },
      { t: '<strong>Pesos negativos.</strong> Con $w = (-1, -1)$ las sumas son $0, -1, -1, -2$. La única que debe quedar por debajo del umbral es $-2$, así que $\\theta$ tiene que estar entre $-2$ (excluido) y $-1$ (incluido): $\\theta = -1$ sirve.', antes: 'Con pesos $(-1,-1)$, ¿qué suma sale en cada esquina? ¿Dónde tiene que caer el umbral?' },
      { t: '<strong>Comprobar.</strong> $0 \\ge -1$: 1. $-1 \\ge -1$: 1. $-1 \\ge -1$: 1. $-2 \\ge -1$: no, 0. Es NAND. La recta $-x_1 - x_2 = -1$, o sea $x_1 + x_2 = 1$, deja $(1,1)$ sola a un lado.' },
      { t: '<strong>Ahora XOR.</strong> Pide 1 en $(0,1)$ y $(1,0)$, y 0 en $(0,0)$ y $(1,1)$. Dispararse en $(0,1)$ exige $w_2 \\ge \\theta$; en $(1,0)$, $w_1 \\ge \\theta$. No dispararse en $(0,0)$ exige $0 < \\theta$. Sumando las dos primeras: $w_1 + w_2 \\ge 2\\theta > \\theta$. Luego en $(1,1)$ la suma supera el umbral y la neurona se dispara. Pero XOR pedía 0.', antes: 'Escribe las desigualdades que impone XOR. ¿Se pueden cumplir a la vez?' },
      { t: '<strong>Lo que enseña.</strong> No es que no se haya encontrado la recta: es que las desigualdades se contradicen. Ninguna búsqueda, por larga que sea, la va a encontrar. Con dos neuronas (OR y NAND) y una tercera que haga AND de ambas, sí.' }
    ],
    cierre: 'El argumento de XOR cabe en tres líneas y es del mismo tipo que Minsky y Papert desarrollaron en 1969 para funciones mucho más complicadas: hay cosas que una sola recta no puede separar.'
  });

  p.hist('Walter Pitts fue un autodidacta que nunca llegó a tener un título universitario; con doce años ya ' +
    'discutía por carta con Bertrand Russell. En 1969, Marvin Minsky y Seymour Papert publicaron ' +
    '<em>Perceptrons</em>, un libro que demostraba con rigor los límites de una sola capa, empezando por ' +
    'XOR. Contribuyó a que el interés y la financiación de las redes neuronales cayeran durante más de una ' +
    'década. Volvieron con fuerza en 1986, cuando David Rumelhart, Geoffrey Hinton y Ronald Williams ' +
    'popularizaron la <em>retropropagación</em>, el método para repartir la culpa entre capas, que no es ' +
    'más que la [[fn-derivadas|regla de la cadena]] aplicada muchas veces.');

  p.util('Una red neuronal moderna es exactamente esto, repetido millones de veces: cada neurona hace un ' +
    'producto escalar, le suma un sesgo y aplica una función que decide cuánto se dispara, suave en lugar ' +
    'de todo o nada para poder derivar. Aprender sigue siendo mover los pesos en la dirección que reduce ' +
    'el error, con el [[av-optimizacion|descenso de gradiente]].');

  p.trampas([
    { e: 'Leer «mayor que» donde dice «mayor o igual»', por: 'Con suma igual al umbral, la neurona se dispara. En el diseño de puertas ese caso límite decide si sale AND o falla.' },
    { e: 'Actualizar los pesos cuando la neurona acierta', por: 'El error $t - y$ vale 0 y la regla no toca nada. Solo se aprende de los fallos.' },
    { e: 'Creer que XOR saldrá con más paciencia', por: 'Las desigualdades se contradicen: no hay recta. El perceptrón no para nunca, y es porque no existe la solución, no porque no la encuentre.' },
    { e: 'Subir $\\eta$ para aprender antes', por: 'Es la ganancia del bucle: grande da bandazos, cada error mueve mucho la recta y estropea lo que ya iba bien. Igual que $K$ en el termostato.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Se dispara la neurona?',
    level: 'basico',
    gen: function (r) {
      var w = [], x = [], s = 0;
      for (var i = 0; i < 3; i++) { w.push(r.pm(1, 3)); x.push(r.int(0, 1)); s += w[i] * x[i]; }
      var th = s + r.pick([-1, 0, 1, 1]);
      return { w: w, x: x, s: s, th: th, y: s >= th ? 1 : 0 };
    },
    ask: function (d) {
      return 'Una neurona de McCulloch-Pitts tiene pesos $\\vec w = (' + d.w.join(',\\ ') + ')$ y umbral $\\theta = ' + d.th + '$. Recibe las entradas $\\vec x = (' +
        d.x.join(',\\ ') + ')$. Calcula la suma ponderada y di si se dispara.';
    },
    fields: [{ name: 's', label: 'suma ponderada', w: 'tiny' }, { name: 'y', label: 'Salida', opts: [{ t: '1: se dispara', v: '1' }, { t: '0: no se dispara', v: '0' }] }],
    sol: function (d) { return { s: d.s, y: String(d.y) }; },
    errores: [{ si: function (v, d) { return d.s === d.th && v.s === d.s && v.raw.y === '0'; }, msg: 'La condición es «mayor <strong>o igual</strong>»: si la suma alcanza justo el umbral, la neurona se dispara.' }],
    hint: function () { return ['Multiplica cada entrada por su peso y suma.', 'Se dispara si la suma es mayor o igual que el umbral.']; },
    steps: function (d) {
      return ['$' + d.w.map(function (wi, i) { return (wi < 0 ? '(' + wi + ')' : wi) + '\\cdot ' + d.x[i]; }).join(' + ') + ' = ' + d.s + '$',
        '$' + d.s + (d.y ? ' \\ge ' : ' < ') + d.th + '$, así que la salida es <strong>' + d.y + '</strong>.'];
    },
    answer: function (d) { return 'suma ' + d.s + ', salida ' + d.y; }
  });

  p.exercise({
    title: 'Diseña la puerta',
    level: 'medio',
    gen: function (r) {
      var a = r.int(1, 3), q = r.pick(['AND', 'OR', 'NAND']);
      return { a: a, q: q, w: q === 'NAND' ? -a : a, th: q === 'AND' ? 2 * a : (q === 'OR' ? a : -a), tabla: { AND: [0, 0, 0, 1], OR: [0, 1, 1, 1], NAND: [1, 1, 1, 0] }[q] };
    },
    ask: function (d) {
      return 'Una neurona con dos entradas binarias tiene los dos pesos iguales a $' + d.w + '$. ¿Cuál es el umbral <strong>entero más grande</strong> con el que ' +
        'funciona como una puerta ' + d.q + '?<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="num">$x_1$</th><th class="num">$x_2$</th><th class="num">' + d.q + '</th></tr></thead><tbody>' +
        [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (e, i) { return '<tr><td class="num">' + e[0] + '</td><td class="num">' + e[1] + '</td><td class="num">' + d.tabla[i] + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    },
    fields: [{ name: 't', label: 'umbral θ =', w: 'tiny' }],
    sol: function (d) { return { t: d.th }; },
    errores: [
      { si: function (v, d) { return d.q === 'AND' && v.t === d.a; }, msg: 'Con ese umbral también se dispara con una sola entrada activa: eso es OR, no AND.' },
      { si: function (v, d) { return d.q === 'OR' && v.t === 2 * d.a; }, msg: 'Con ese umbral solo se dispara con las dos entradas activas: eso es AND, no OR.' },
      { si: function (v, d) { return d.q === 'NAND' && v.t === -2 * d.a; }, msg: 'Con ese umbral se dispara siempre, también con las dos entradas a 1.' }
    ],
    hint: function (d) { return ['Calcula la suma ponderada en las cuatro filas: con pesos $' + d.w + '$ salen $0$, $' + d.w + '$, $' + d.w + '$ y $' + (2 * d.w) + '$.', 'El umbral tiene que quedar por encima de las sumas que deben dar 0 y no por encima de las que deben dar 1.']; },
    steps: function (d) {
      var sumas = [0, d.w, d.w, 2 * d.w], unos = [], ceros = [];
      sumas.forEach(function (s, i) { (d.tabla[i] ? unos : ceros).push(s); });
      return ['Sumas en las cuatro filas: $' + sumas.join(',\\ ') + '$.',
        'Deben disparar las sumas $' + unos.join(',\\ ') + '$: el umbral no puede superar la menor, $' + Math.min.apply(null, unos) + '$.',
        'No deben disparar $' + ceros.join(',\\ ') + '$: el umbral tiene que superar la mayor, $' + Math.max.apply(null, ceros) + '$.',
        'El entero más grande que cumple las dos cosas es $\\theta = ' + d.th + '$.'];
    },
    answer: function (d) { return 'θ = ' + d.th; }
  });

  p.exercise({
    title: 'Un paso del perceptrón',
    level: 'medio',
    gen: function (r) {
      var w = [r.int(-3, 3), r.int(-3, 3)], b = r.int(-2, 2), eta = r.pick([0.5, 1]), x = [r.int(-3, 3), r.int(-3, 3)];
      if (!x[0] && !x[1]) return null;
      var y = w[0] * x[0] + w[1] * x[1] + b >= 0 ? 1 : 0, t = r.bool(0.75) ? 1 - y : y, e = t - y;
      return { w: w, b: b, eta: eta, x: x, y: y, t: t, e: e, nw: [w[0] + eta * e * x[0], w[1] + eta * e * x[1]], nb: b + eta * e };
    },
    ask: function (d) {
      return 'Un perceptrón tiene pesos $\\vec w = (' + d.w.join(',\\ ') + ')$, sesgo $b = ' + d.b + '$ y tasa de aprendizaje $\\eta = ' + U.fmt(d.eta, 1) +
        '$. Da salida 1 si $w_1x_1 + w_2x_2 + b \\ge 0$, y 0 si no. Se le presenta el ejemplo $\\vec x = (' + d.x.join(',\\ ') + ')$, cuya respuesta correcta es $t = ' + d.t +
        '$. Aplica una vez la regla de aprendizaje: ¿cómo quedan los pesos y el sesgo?';
    },
    fields: [{ name: 'w1', label: '$w_1$', w: 'tiny' }, { name: 'w2', label: '$w_2$', w: 'tiny' }, { name: 'b', label: '$b$', w: 'tiny' }],
    sol: function (d) { return { w1: d.nw[0], w2: d.nw[1], b: d.nb }; },
    tol: 1e-9,
    errores: [
      { si: function (v, d) { return d.e === 0 && (v.w1 !== d.w[0] || v.w2 !== d.w[1] || v.b !== d.b); }, msg: 'La neurona ya acierta: el error $t - y$ vale 0 y la regla no cambia nada.' },
      { si: function (v, d) { return d.e !== 0 && v.w1 === d.w[0] - d.eta * d.e * d.x[0] && v.w2 === d.w[1] - d.eta * d.e * d.x[1]; }, msg: 'El signo está al revés: se suma $\\eta\\,(t - y)\\,x_i$. Si debía dispararse y no lo hizo, el error es $+1$ y los pesos se acercan a la entrada.' }
    ],
    hint: function () { return ['Primero calcula la salida $y$ con los pesos actuales.', 'Error: $t - y$. Si es 0, no cambia nada; si no, suma $\\eta\\,(t - y)\\,x_i$ a cada peso y $\\eta\\,(t - y)$ al sesgo.']; },
    steps: function (d) {
      var s = d.w[0] * d.x[0] + d.w[1] * d.x[1] + d.b;
      var l = ['Suma: $' + d.w[0] + '\\cdot ' + (d.x[0] < 0 ? '(' + d.x[0] + ')' : d.x[0]) + ' + ' + (d.w[1] < 0 ? '(' + d.w[1] + ')' : d.w[1]) + '\\cdot ' + (d.x[1] < 0 ? '(' + d.x[1] + ')' : d.x[1]) +
        ' + ' + (d.b < 0 ? '(' + d.b + ')' : d.b) + ' = ' + s + '$, así que $y = ' + d.y + '$.', 'Error: $t - y = ' + d.t + ' - ' + d.y + ' = ' + d.e + '$.'];
      if (d.e === 0) l.push('Acierta: los pesos y el sesgo no cambian.');
      else l.push('$w_1 = ' + d.w[0] + ' + ' + U.fmt(d.eta, 1) + '\\cdot(' + d.e + ')\\cdot(' + d.x[0] + ') = ' + U.fmt(d.nw[0], 1) + '$, $w_2 = ' + d.w[1] + ' + ' + U.fmt(d.eta, 1) + '\\cdot(' + d.e + ')\\cdot(' + d.x[1] + ') = ' + U.fmt(d.nw[1], 1) +
        '$, $b = ' + d.b + ' + ' + U.fmt(d.eta, 1) + '\\cdot(' + d.e + ') = ' + U.fmt(d.nb, 1) + '$');
      return l;
    },
    answer: function (d) { return 'w = (' + U.fmt(d.nw[0], 1) + ', ' + U.fmt(d.nw[1], 1) + '), b = ' + U.fmt(d.nb, 1); }
  });

  p.exercise({
    title: '¿Lo puede aprender un perceptrón?',
    level: 'medio',
    gen: function (r) {
      var F = [
        { n: 'AND', t: [0, 0, 0, 1], s: true }, { n: 'OR', t: [0, 1, 1, 1], s: true }, { n: 'NAND', t: [1, 1, 1, 0], s: true },
        { n: 'NOR', t: [1, 0, 0, 0], s: true }, { n: '«x₁ y no x₂»', t: [0, 0, 1, 0], s: true }, { n: '«solo x₂»', t: [0, 1, 0, 1], s: true },
        { n: 'XOR', t: [0, 1, 1, 0], s: false }, { n: 'XNOR (igualdad)', t: [1, 0, 0, 1], s: false }
      ];
      var f = r.bool(0.4) ? r.pick(F.slice(6)) : r.pick(F.slice(0, 6));
      return { n: f.n, t: f.t.slice(), s: f.s };
    },
    ask: function (d) {
      return 'Esta es la tabla de verdad de la función ' + d.n + ':<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="num">$x_1$</th><th class="num">$x_2$</th><th class="num">salida</th></tr></thead><tbody>' +
        [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (e, i) { return '<tr><td class="num">' + e[0] + '</td><td class="num">' + e[1] + '</td><td class="num">' + d.t[i] + '</td></tr>'; }).join('') +
        '</tbody></table></div>¿Puede aprenderla un perceptrón de una sola neurona?';
    },
    fields: [{ name: 'q', label: 'Respuesta', opts: [{ t: 'Sí: existe una recta que separa los unos de los ceros', v: 'si' }, { t: 'No: ninguna recta los separa', v: 'no' }] }],
    sol: function (d) { return { q: d.s ? 'si' : 'no' }; },
    hint: function () { return ['Dibuja las cuatro esquinas del cuadrado y marca cuáles deben dar 1.', '¿Puedes trazar una recta con todos los unos a un lado y todos los ceros al otro?']; },
    steps: function (d) {
      return [d.s
        ? 'Los unos no ocupan dos esquinas opuestas sin las otras: se puede trazar una recta que los separe de los ceros. Un perceptrón la encontrará, por el teorema de convergencia.'
        : 'Los unos están en dos esquinas opuestas del cuadrado, y los ceros en las otras dos. Ninguna recta las separa: un perceptrón de una capa no puede aprenderla. Hacen falta dos capas.'];
    },
    answer: function (d) { return d.s ? 'Sí' : 'No'; }
  });

  p.keys([
    'Una neurona de McCulloch-Pitts suma sus entradas por sus pesos y se dispara si alcanza el umbral: $\\vec w\\cdot\\vec x \\ge \\theta$.',
    'Con dos entradas, la neurona traza una recta en el plano de entradas: puede imitar AND, OR o NAND, pero no XOR.',
    'El perceptrón aprende con realimentación del error: $w_i \\to w_i + \\eta\\,(t - y)\\,x_i$.',
    'Si los ejemplos son separables por una recta, el perceptrón converge en un número finito de pasos; si no, no aprende nunca.',
    'Varias capas de neuronas superan ese límite. Las redes neuronales actuales son esta misma idea, a gran escala.'
  ]);
});
