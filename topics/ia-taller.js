/* Tema: El taller */
Course.topic('ia-taller', function (p) {

  p.puente('Último tema del bloque, y no trae ninguna idea nueva: trae todos los mandos a la vez. Un ' +
    'banco de pruebas donde cambiar datos, arquitectura y optimizador y ver qué pasa; una red entera ' +
    'escrita línea a línea, sin nada escondido; y el mapa de qué matemática hay debajo de cada ' +
    'arquitectura que has visto.');

  p.text('Si algo debería quedar de estos dos bloques es esto: <strong>no hay magia</strong>. Hay un ' +
    'producto escalar, un gradiente y una regla de Bayes, repetidos muchísimas veces. Todo lo demás son ' +
    'maneras de organizar esas tres cosas para que encajen con la forma de un problema concreto.');

  /* ---------------------------------------------------------------- */
  p.section('El banco de pruebas');

  p.text('Aquí están juntos los elementos que has ido viendo por separado. Cambia uno y observa: casi ' +
    'todo lo que pasa tiene una explicación en algún tema anterior.');

  p.demo({
    title: 'Datos, arquitectura y optimizador',
    intro: 'Elige un conjunto de puntos, cuántas capas y neuronas, qué activación y qué optimizador. Entrena y mira la frontera que aprende. El fondo coloreado es lo que el modelo contestaría en cada punto del plano.',
    predice: 'Las espirales son el caso difícil. ¿Crees que se arreglan con más neuronas en una capa, con más capas, o con otra activación?',
    build: function (host) {
      var conjunto = 'lunas', capas = 2, ocultas = 12, act = 'relu', optim = 'adam', lr = 0.03;
      /* Ojo con el nombre: `W` es el espacio de los widgets, así que las
         matrices de pesos se llaman Ws y Bs para no taparlo. */
      var datos, X, Y, Ws, Bs, lista, opt, pasos, perdida, acierto, r;
      function crea() {
        r = U.rng(5);
        var N = 200;
        datos = (conjunto === 'nubes') ? NN.datos.nubes(r, N, 1.2) : NN.datos[conjunto](r, N, 0.12);
        X = NN.deFilas(datos.X);
        Y = NN.deFilas(datos.y.map(function (v) { return [v]; }));
        var dims = [2], i;
        for (i = 0; i < capas; i++) dims.push(ocultas);
        dims.push(1);
        Ws = []; Bs = [];
        for (i = 0; i < dims.length - 1; i++) {
          Ws.push(NN.param([dims[i], dims[i + 1]], r));
          Bs.push(NN.param([1, dims[i + 1]], r, 0.01));
        }
        lista = [];
        Ws.forEach(function (w) { lista.push(w); });
        Bs.forEach(function (b) { lista.push(b); });
        opt = (optim === 'adam') ? NN.Adam(lista, { lr: lr })
          : (optim === 'momento' ? NN.SGD(lista, { lr: lr, momento: 0.9 }) : NN.SGD(lista, { lr: lr }));
        pasos = 0; perdida = 0; acierto = 0;
      }
      function fw(x) {
        var h = x;
        for (var k = 0; k < Ws.length; k++) {
          h = NN.suma(NN.mm(h, Ws[k]), Bs[k]);
          if (k < Ws.length - 1) h = (act === 'relu') ? NN.relu(h) : (act === 'tanh' ? NN.tanh(h) : NN.sigmoide(h));
        }
        return h;
      }
      crea();
      function paso() {
        NN.limpia();
        var L = NN.entropiaCruzadaBinaria(NN.sigmoide(fw(X)), Y);
        NN.atras(L, lista); opt.paso();
        perdida = L.v[0]; pasos++;
      }
      function mide() {
        NN.limpia();
        var pr = NN.sigmoide(fw(X)), ok = 0;
        for (var i = 0; i < datos.y.length; i++) if ((pr.v[i] > 0.5 ? 1 : 0) === datos.y[i]) ok++;
        acierto = 100 * ok / datos.y.length;
      }
      /* La frontera se pinta evaluando la red en una rejilla: una sola pasada
         hacia delante con todos los puntos de la malla como si fueran datos. */
      var M = 26, rejilla = null;
      function calculaRejilla() {
        var filas = [], i, j;
        for (i = 0; i < M; i++) {
          for (j = 0; j < M; j++) filas.push([-2.6 + 5.2 * j / (M - 1), -2.6 + 5.2 * i / (M - 1)]);
        }
        NN.limpia();
        var s = NN.sigmoide(fw(NN.deFilas(filas)));
        rejilla = [];
        for (i = 0; i < M * M; i++) rejilla.push(s.v[i]);
      }
      calculaRejilla();
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -2.6, xmax: 2.6, ymin: -2.6, ymax: 2.6, height: 330, equal: true,
        aria: 'Los puntos de los dos grupos y el fondo coloreado con lo que el modelo contesta en cada zona del plano',
        draw: function (g) {
          var paso2 = 5.2 / (M - 1), i, j;
          for (i = 0; i < M; i++) {
            for (j = 0; j < M; j++) {
              var v = rejilla[i * M + j];
              g.rect(-2.6 + 5.2 * j / (M - 1) - paso2 / 2, -2.6 + 5.2 * i / (M - 1) - paso2 / 2, paso2, paso2,
                { fill: v > 0.5 ? 2 : 0, fillAlpha: 0.06 + 0.4 * Math.abs(v - 0.5) * 2, stroke: false });
            }
          }
          datos.X.forEach(function (q, k) { g.point(q[0], q[1], { color: datos.y[k] ? 2 : 0, r: 3 }); });
        }
      });
      function pinta() {
        mide(); calculaRejilla();
        out.set('Paso <strong>' + U.miles(pasos) + '</strong> &nbsp;·&nbsp; pérdida <strong>' + U.fmt(perdida, 4) +
          '</strong> &nbsp;·&nbsp; acierto <strong>' + U.fmt(acierto, 1) + ' %</strong><br>' +
          capas + (capas === 1 ? ' capa oculta de ' : ' capas ocultas de ') + ocultas + ' neuronas &nbsp;·&nbsp; ' +
          act + ' &nbsp;·&nbsp; ' + optim + ' con ritmo ' + U.fmt(lr, 3) + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (pasos === 0 ? 'Sin entrenar: la frontera es la que salió del azar inicial.'
            : (acierto > 98 ? 'Separa los dos grupos. Fíjate en la <em>forma</em> de la frontera: con ReLU sale hecha de trozos rectos, y con tanh sale curva.'
              : (conjunto === 'espirales' ? 'Las espirales necesitan más profundidad que anchura: una capa muy ancha no basta, y tanh suele ir mejor que ReLU aquí.'
                : 'Todavía no separa bien. Prueba a añadir una capa, cambiar la activación o subir el ritmo.'))) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 4, paso: paso, pinta: pinta, hasta: 1200 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: '100 pasos', on: function () { for (var i = 0; i < 100; i++) paso(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); crea(); pinta(); } }
      ]);
      function reinicia() { bucle.pausa(); bucle.reinicia(); crea(); pinta(); }
      var f1 = W.row(host);
      W.chips(f1, ['lunas', 'circulos', 'espirales', 'xor', 'nubes'].map(function (c) { return { label: c, value: c }; }), {
        value: 'lunas', on: function (v) { conjunto = v; reinicia(); }
      });
      var f2 = W.row(host);
      W.chips(f2, [{ label: 'ReLU', value: 'relu' }, { label: 'tanh', value: 'tanh' }, { label: 'sigmoide', value: 'sigmoide' }], {
        value: 'relu', on: function (v) { act = v; reinicia(); }
      });
      W.chips(f2, [{ label: 'Adam', value: 'adam' }, { label: 'momento', value: 'momento' }, { label: 'SGD', value: 'sgd' }], {
        value: 'adam', on: function (v) { optim = v; reinicia(); }
      });
      var f3 = W.row(host);
      W.slider(f3, { label: 'capas ocultas', min: 1, max: 4, step: 1, value: 2, dec: 0, on: function (v) { capas = v; reinicia(); } });
      W.slider(f3, { label: 'neuronas por capa', min: 2, max: 24, step: 1, value: 12, dec: 0, on: function (v) { ocultas = v; reinicia(); } });
      W.slider(host, { label: 'ritmo de aprendizaje', min: 0.003, max: 0.2, step: 0.003, value: 0.03, dec: 3, on: function (v) { lr = v; reinicia(); } });
      pinta();
    }
  });

  p.note('Cosas que merece la pena probar, todas con explicación en algún tema: poner ' +
    '<strong>sigmoide</strong> con cuatro capas y ver cómo se atasca —es ' +
    '[[ia-retropropagacion|el gradiente que se apaga]]—; poner el ritmo al máximo y ver la pérdida ' +
    'rebotar —[[av-optimizacion|paso demasiado grande]]—; comparar Adam con SGD en las espirales; y ' +
    'ver que las espirales piden <strong>profundidad</strong> más que anchura, porque cada capa dobla ' +
    'el espacio una vez más.', 'ok', 'Experimentos que vale la pena hacer');

  /* ---------------------------------------------------------------- */
  p.section('Una red entera, línea a línea');

  p.text('Esto es lo que hay dentro del botón «Entrenar» de arriba, sin nada omitido. Son las mismas ' +
    'operaciones que has usado en todo el bloque, y caben en una pantalla.');

  p.text('<strong>Construir los parámetros.</strong> Una matriz y un sesgo por capa. El tamaño de cada ' +
    'matriz es «cuántas entradas por cuántas salidas».');

  p.text('<pre class="shd__mini">var W1 = NN.param([2, 12], r);      // 2 entradas  -&gt; 12 neuronas\n' +
    'var b1 = NN.param([1, 12], r, 0.01);\n' +
    'var W2 = NN.param([12, 1], r);      // 12 entradas -&gt;  1 salida\n' +
    'var b2 = NN.param([1, 1], r, 0.01);\n' +
    'var params = [W1, b1, W2, b2];</pre>');

  p.text('<strong>La pasada hacia delante.</strong> Multiplicar, sumar el sesgo, doblar con una ' +
    'activación, y otra vez. Nada más.');

  p.text('<pre class="shd__mini">function haciaDelante(x) {\n' +
    '  var h = NN.relu(NN.suma(NN.mm(x, W1), b1));\n' +
    '  return NN.suma(NN.mm(h, W2), b2);      // logits, sin sigmoide\n' +
    '}</pre>');

  p.text('<strong>El entrenamiento.</strong> Borrar la cinta, calcular la pérdida, volver hacia atrás y ' +
    'dar un paso. Cinco líneas repetidas mil veces.');

  p.text('<pre class="shd__mini">var opt = NN.Adam(params, { lr: 0.03 });\n' +
    'for (var t = 0; t &lt; 1000; t++) {\n' +
    '  NN.limpia();                                 // vaciar la cinta\n' +
    '  var p = NN.sigmoide(haciaDelante(X));        // predicciones\n' +
    '  var L = NN.entropiaCruzadaBinaria(p, Y);     // cuánto se falla\n' +
    '  NN.atras(L, params);                         // derivadas de todo\n' +
    '  opt.paso();                                  // corregir los pesos\n' +
    '}</pre>');

  p.note('Las dos líneas que hacen el trabajo son <code>NN.atras</code> y <code>opt.paso()</code>. La ' +
    'primera recorre hacia atrás la lista de operaciones que se acaban de hacer, aplicando ' +
    '[[ia-retropropagacion|la regla de la cadena]] en cada una; la segunda mueve cada número un poco ' +
    'en contra de su derivada. Todo el bloque, desde el perceptrón hasta el transformador, es esto con ' +
    'operaciones distintas en medio.', 'ok', 'Dónde está de verdad el aprendizaje');

  /* ---------------------------------------------------------------- */
  p.section('El mapa: qué aporta cada arquitectura');

  p.text('Esta tabla es el resumen del bloque. Cada arquitectura no es un invento suelto: es ' +
    '<strong>una idea matemática concreta</strong> añadida a la anterior, casi siempre traída de otro ' +
    'sitio del curso.');

  p.table(['Arquitectura', 'La idea que aporta', 'De dónde viene'],
    [['[[cib-neurona|Neurona]] y [[ia-red|red densa]]', 'producto escalar y una no linealidad; apilarlas dobla el espacio', '[[ge-vectores|vectores]]'],
     ['[[ia-retropropagacion|Retropropagación]]', 'la regla de la cadena sobre un grafo de operaciones', '[[fn-derivadas|derivadas]]'],
     ['[[ia-cnn|Convolucional]]', 'compartir pesos: la imagen no cambia de significado al desplazarla', '[[av-convolucion|convolución]]'],
     ['[[ia-hopfield|Hopfield]]', 'recordar es caer al fondo de un valle de energía', '[[av-optimizacion|mínimos]]'],
     ['[[ia-recurrentes|Recurrente y LSTM]]', 'un estado que se realimenta, y puertas que deciden qué olvidar', '[[cib-realimentacion|realimentación]]'],
     ['[[ia-autocodificador|Autocodificador]]', 'un cuello de botella obliga a quedarse con lo que importa', '[[av-pca|componentes principales]]'],
     ['[[ia-gan|GAN]]', 'aprender la pérdida en vez de escribirla: un juego de suma cero', '[[av-juegos|juegos]]'],
     ['[[ia-difusion|Difusión]]', 'destruir despacio y aprender a deshacer un paso', '[[av-edp|ecuación del calor]]'],
     ['[[ia-atencion|Atención]]', 'una media ponderada cuyos pesos salen de productos escalares', '[[ge-vectores|vectores]]'],
     ['[[ia-refuerzo|Refuerzo]]', 'el valor como punto fijo de una contracción', '[[fn-sucesiones|sucesiones]]']]);

  p.note('Mira la columna de la derecha. Casi todo lo que sostiene a la inteligencia artificial estaba ' +
    'inventado <strong>antes</strong> y para otra cosa: la convolución venía del tratamiento de ' +
    'señales, la ecuación del calor de la física del siglo XIX, la teoría de juegos de la economía, la ' +
    'divergencia KL de las telecomunicaciones, BPE de la compresión de ficheros. Lo nuevo no fue ' +
    'inventar la matemática: fue darse cuenta de qué herramienta encajaba en qué problema, y tener ' +
    'máquinas capaces de repetirla millones de veces.', 'ok', 'Casi nada de esto se inventó para esto');

  p.ejemplo({
    title: 'Contar los parámetros de una red del banco de pruebas',
    enunciado: 'Una red del taller con 2 entradas, 3 capas ocultas de 12 neuronas y 1 salida. Contar los números que hay que ajustar, y decir cuántos vendrían de las matrices y cuántos de los sesgos.',
    pasos: [
      { t: '<strong>Las matrices.</strong> Hay cuatro saltos: $2\\times12$, $12\\times12$, $12\\times12$ y $12\\times1$. Eso da $24 + 144 + 144 + 12 = 324$ pesos.', antes: 'Cada salto entre capas es una matriz de «entradas por salidas».' },
      { t: '<strong>Los sesgos.</strong> Uno por neurona de cada capa de llegada: $12 + 12 + 12 + 1 = 37$.', antes: '¿Cuántos sesgos hay en una capa de 12 neuronas?' },
      { t: '<strong>El total.</strong> $324 + 37 = 361$ números.' },
      { t: '<strong>La proporción.</strong> Los sesgos son el $10{,}2\\ \\%$ del total. En redes grandes esa proporción se hace minúscula: con capas de mil neuronas, una matriz tiene un millón de pesos y sólo mil sesgos.' },
      { t: '<strong>La comparación.</strong> El transformador de [[ia-llm|el tema del LLM]] tenía 3 911 números, unas once veces esto, y hacía algo muchísimo más complicado. Contar parámetros dice bastante poco por sí solo.' }
    ],
    cierre: 'Saber contar parámetros sirve para estimar memoria y coste, no para predecir si una red funcionará: eso depende de si su estructura encaja con la forma del problema.'
  });

  p.comprueba('En el banco de pruebas, las espirales se resuelven mejor con tres capas de 12 neuronas que con una de 36, aunque la segunda tenga más parámetros. ¿Por qué?', [
    { t: 'Porque cada capa transforma el espacio una vez más, y hace falta doblarlo varias veces para desenrollar una espiral', ok: true, por: 'Una capa oculta ancha puede aproximar cualquier función, pero puede necesitar una cantidad enorme de neuronas. Apilar capas compone transformaciones: cada una dobla el espacio sobre el resultado de la anterior, y eso es mucho más eficiente para una forma enrollada.' },
    { t: 'Porque más capas siempre es mejor que más neuronas', ok: false, por: 'No siempre: con demasiadas capas y sin conexiones residuales el gradiente se apaga, y en problemas sencillos una sola capa basta y entrena antes.' },
    { t: 'Porque una capa de 36 neuronas no puede representar una espiral', ok: false, por: 'Sí puede, en teoría: el teorema de aproximación universal lo garantiza. Lo que no garantiza es que haga falta un número razonable de neuronas ni que el entrenamiento la encuentre.' }
  ]);

  p.util('Lo que has visto en estos dos bloques es suficiente para leer con criterio casi cualquier cosa ' +
    'que se publique sobre el tema. Cuando leas que un sistema «entiende» algo, ya sabes que minimiza ' +
    'una pérdida; cuando veas una cifra de parámetros, sabes que no dice por sí sola lo que el sistema ' +
    'hace; cuando alguien prometa que un modelo no discrimina porque no mira cierta variable, sabes ' +
    'que hay que pedir el desglose por grupos. Y sobre todo sabes qué preguntar: con qué datos se ' +
    'entrenó, qué se minimizó exactamente, y cómo se midió el resultado.');

  p.hist('Conviene acabar con una fecha que ordena el resto. El perceptrón es de 1958; la ' +
    'retropropagación, tal como se usa hoy, se popularizó en 1986; las convolucionales aplicadas a ' +
    'reconocer dígitos, en 1989. Es decir: las ideas centrales de este bloque tienen entre treinta y ' +
    'setenta años. Lo que cambió a partir de 2012 no fue la matemática sino tres cosas a la vez: ' +
    'aparecieron conjuntos de datos enormes, las tarjetas gráficas hicieron baratas las ' +
    'multiplicaciones de matrices, y unos cuantos detalles prácticos —ReLU, mejores inicializaciones, ' +
    'Adam— hicieron entrenable lo que antes se atascaba. Es una historia de escala y de oficio, más ' +
    'que de descubrimientos.');

  p.trampas([
    { e: 'Buscar la arquitectura «mejor»', por: 'Cada una codifica una suposición sobre la forma del problema. Una convolucional es mejor en imágenes porque asume que trasladar no cambia el significado; en datos donde eso es falso, es peor que una red densa.' },
    { e: 'Contar parámetros como si midiera capacidad', por: 'Una capa ancha puede tener más parámetros que una red profunda y resolver peor el mismo problema. Lo que importa es la estructura, no el recuento.' },
    { e: 'Creer que el bloque enseña a construir un modelo grande', por: 'Enseña qué hay dentro. Construir uno de verdad es un problema de ingeniería de datos y de cómputo que no cabe en un navegador.' },
    { e: 'Pensar que la matemática de esto es nueva', por: 'Casi toda venía de otras disciplinas y de bastante antes. Lo nuevo fue el encaje y la escala.' },
    { e: 'Quedarse con «es sólo estadística»', por: 'Es igual de equivocado que decir que es magia. Son unas pocas operaciones matemáticas muy bien elegidas, repetidas a una escala que cambia lo que se puede hacer con ellas.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Parámetros de una red del taller',
    level: 'basico',
    gen: function (r) {
      var capas = r.int(1, 4), oc = r.pick([8, 12, 16, 24]);
      var dims = [2], i;
      for (i = 0; i < capas; i++) dims.push(oc);
      dims.push(1);
      var pesos = 0, sesgos = 0;
      for (i = 0; i < dims.length - 1; i++) { pesos += dims[i] * dims[i + 1]; sesgos += dims[i + 1]; }
      return { capas: capas, oc: oc, pesos: pesos, sesgos: sesgos, total: pesos + sesgos };
    },
    ask: function (d) {
      return 'Una red con 2 entradas, $' + d.capas + '$ ' + U.plural(d.capas, 'capa oculta', 'capas ocultas') +
        ' de $' + d.oc + '$ neuronas y 1 salida. ¿Cuántos pesos y cuántos sesgos tiene?';
    },
    fields: [{ name: 'p', label: 'pesos', w: 'tiny' }, { name: 's', label: 'sesgos', w: 'tiny' }],
    sol: function (d) { return { p: d.pesos, s: d.sesgos }; },
    dec: 0,
    errores: [{ si: function (v, d) { return Math.abs(v.s - d.sesgos - 2) < 0.5 && d.sesgos !== d.sesgos + 2; }, msg: 'La capa de entrada no tiene sesgos: sólo las de llegada.' }],
    hint: function (d) { return 'Cada salto es una matriz «entradas × salidas», y hay un sesgo por cada neurona de llegada.'; },
    steps: function (d) {
      var dims = [2], i, det = [];
      for (i = 0; i < d.capas; i++) dims.push(d.oc);
      dims.push(1);
      for (i = 0; i < dims.length - 1; i++) det.push(dims[i] + '\\times' + dims[i + 1]);
      return ['Matrices: $' + det.join(' + ') + ' = ' + U.miles(d.pesos) + '$ pesos.',
        'Sesgos: uno por neurona de llegada, $' + U.miles(d.sesgos) + '$.',
        'Total: $' + U.miles(d.total) + '$ números que ajustar.'];
    },
    answer: function (d) { return U.miles(d.pesos) + ' pesos y ' + U.miles(d.sesgos) + ' sesgos'; }
  });

  p.exercise({
    title: 'Qué arquitectura para qué problema',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'clasificar fotografías, donde un objeto significa lo mismo esté en el centro o en una esquina', v: 'cnn', por: 'La suposición que codifica una convolucional es exactamente esa: compartir pesos porque trasladar no cambia el significado.' },
        { t: 'predecir la siguiente palabra de un texto largo, donde importa lo que se dijo mucho antes', v: 'atencion', por: 'La atención deja que cada posición mire directamente a cualquier otra, sin el cuello de botella de un estado que se va diluyendo.' },
        { t: 'generar caras nuevas parecidas a las de un archivo de fotos', v: 'generativo', por: 'Es una tarea generativa: se quiere muestrear de una distribución, que es lo que hacen los autocodificadores variacionales, las GAN y la difusión.' },
        { t: 'aprender a jugar sin que nadie diga cuál era la jugada buena, sólo si se ganó', v: 'refuerzo', por: 'No hay etiquetas por jugada, sólo un premio al final: es exactamente el planteamiento del aprendizaje por refuerzo.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Para ' + d.c.t + ', ¿qué familia encaja mejor?'; },
    fields: [{ name: 'q', label: 'Familia', opts: [
      { t: 'convolucional', v: 'cnn' },
      { t: 'atención / transformador', v: 'atencion' },
      { t: 'modelo generativo', v: 'generativo' },
      { t: 'aprendizaje por refuerzo', v: 'refuerzo' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate qué suposición sobre el problema codifica cada arquitectura.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Coste de una pasada',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([100, 200, 500]), oc = r.pick([12, 24, 48]), capas = r.int(1, 3);
      var porDato = 2 * oc + (capas - 1) * oc * oc + oc;
      return { n: n, oc: oc, capas: capas, porDato: porDato, total: n * porDato };
    },
    ask: function (d) {
      return 'Una red con 2 entradas, $' + d.capas + '$ ' + U.plural(d.capas, 'capa', 'capas') + ' de $' +
        d.oc + '$ neuronas y 1 salida procesa $' + d.n + '$ puntos de golpe. ¿Cuántas multiplicaciones ' +
        'hace una pasada hacia delante, contando sólo las de las matrices?';
    },
    fields: [{ name: 'm', label: 'multiplicaciones', w: 'small' }],
    sol: function (d) { return { m: d.total }; },
    dec: 0,
    hint: function (d) { return 'Por cada dato: $2\\times' + d.oc + '$ en la primera matriz, luego las intermedias, y $' + d.oc + '\\times1$ al final. Después multiplica por los $' + d.n + '$ datos.'; },
    steps: function (d) {
      return ['Por dato: $2\\cdot' + d.oc + (d.capas > 1 ? ' + ' + (d.capas - 1) + '\\cdot' + d.oc + '^2' : '') + ' + ' + d.oc + ' = ' + U.miles(d.porDato) + '$.',
        'Por los $' + d.n + '$ datos: $' + U.miles(d.porDato) + ' \\times ' + d.n + ' = ' + U.miles(d.total) + '$.',
        'Y la pasada hacia atrás cuesta aproximadamente el doble que esta.'];
    },
    answer: function (d) { return U.miles(d.total); }
  });

  p.exercise({
    title: 'Diagnosticar el banco de pruebas',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'con sigmoide y cuatro capas la pérdida casi no se mueve', v: 'apaga', por: 'La derivada de la sigmoide no pasa de 0,25, así que al multiplicarse por cada capa el gradiente llega a las primeras convertido en casi nada. Es el gradiente que se apaga, y es la razón por la que se usa ReLU.' },
        { t: 'con el ritmo de aprendizaje al máximo la pérdida sube y baja sin estabilizarse', v: 'paso', por: 'El paso es demasiado grande y el descenso salta por encima del mínimo, rebotando entre las paredes del valle en vez de bajar por él.' },
        { t: 'el acierto sobre los puntos dibujados es perfecto pero la frontera tiene una forma rarísima', v: 'sobre', por: 'Ha memorizado esos puntos concretos en vez de la regla que los separa. Con puntos nuevos fallaría, y por eso la evaluación se hace con datos reservados.' },
        { t: 'las espirales no salen con una sola capa por muchas neuronas que se pongan', v: 'profundidad', por: 'Desenrollar una espiral exige componer varias transformaciones. Una capa muy ancha puede hacerlo en teoría, pero necesita una cantidad de neuronas poco razonable.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En el banco de pruebas se observa que ' + d.c.t + '. ¿Cuál es la causa?'; },
    fields: [{ name: 'q', label: 'Causa', opts: [
      { t: 'el gradiente se apaga al atravesar capas', v: 'apaga' },
      { t: 'el paso es demasiado grande', v: 'paso' },
      { t: 'está memorizando los puntos', v: 'sobre' },
      { t: 'hace falta profundidad, no anchura', v: 'profundidad' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Cada síntoma corresponde a un tema concreto del bloque: activaciones, optimización, generalización o profundidad.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'De dónde viene cada idea',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'una red convolucional comparte los mismos pesos por toda la imagen', v: 'convolucion', por: 'Es la convolución del tratamiento de señales: deslizar un núcleo por la señal. La red no inventó la operación, sólo aprendió el núcleo en vez de escribirlo a mano.' },
        { t: 'un modelo de difusión añade ruido normal hasta destruir el dato', v: 'calor', por: 'Añadir ruido normal a una densidad es convolucionarla con una campana, que es exactamente la solución de la ecuación del calor: la varianza crece como $\\sigma_0^2 + 2kt$.' },
        { t: 'una GAN enfrenta dos redes con objetivos opuestos', v: 'juegos', por: 'Es un juego de suma cero de la teoría de juegos, con su equilibrio y su minimax, y por eso hereda también la inestabilidad del descenso-ascenso simultáneo.' },
        { t: 'el valor de un estado se calcula repitiendo una ecuación hasta que deja de cambiar', v: 'sucesiones', por: 'Es un punto fijo alcanzado por una contracción: converge porque los errores sucesivos están acotados por una geométrica de razón menor que uno.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Cuando ' + d.c.t + ', ¿de qué matemática anterior está tirando?'; },
    fields: [{ name: 'q', label: 'Viene de', opts: [
      { t: 'la convolución del tratamiento de señales', v: 'convolucion' },
      { t: 'la ecuación del calor', v: 'calor' },
      { t: 'la teoría de juegos', v: 'juegos' },
      { t: 'las sucesiones y su convergencia', v: 'sucesiones' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Casi todas estas herramientas existían antes y para otra cosa. Piensa en qué disciplina.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.note('Cuando quieras saber si el bloque entero se ha quedado, en [[ia-examen-arquitecturas]] hay un examen procedimental con preguntas de todos sus temas, con reloj y corregido al entregar.', 'ok', 'Para medirte');

  p.keys([
    'No hay magia: hay un producto escalar, un gradiente y una regla de Bayes, repetidos muchísimas veces.',
    'Una red entera cabe en una pantalla: construir parámetros, multiplicar y doblar, calcular la pérdida, volver hacia atrás y dar un paso.',
    'Cada arquitectura es una <strong>suposición sobre la forma del problema</strong>: compartir pesos, realimentar un estado, estrechar un cuello de botella, mirar a todas las posiciones.',
    'Casi toda la matemática de debajo se inventó antes y para otra cosa: señales, física, economía, telecomunicaciones, compresión.',
    'Contar parámetros no mide capacidad: lo que decide es si la estructura encaja con el problema.',
    'Lo que cambió a partir de 2012 no fue la matemática, sino los datos, el cómputo y unos cuantos detalles que hicieron entrenable lo que se atascaba.'
  ]);
});
