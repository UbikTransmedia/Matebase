/* Tema: Medir el error y bajar la ladera */
Course.topic('ia-perdida', function (p) {

  p.puente('[[ia-sigmoide|El tema anterior]] dejó una neurona entrenable, pero con una pérdida prestada ' +
    'que no es la buena para clasificar. Aquí se arregla con [[av-informacion|la entropía cruzada]], y ' +
    'se completa el paso con [[av-optimizacion|los minilotes y el momento]] y con una pieza que viene ' +
    'de un sitio inesperado: [[cib-filtrado|la media móvil exponencial]] de los filtros.');

  p.text('Entrenar son dos decisiones, y las dos tienen respuestas concretas. La primera es ' +
    '<strong>qué número se minimiza</strong>, y resulta que elegirlo mal frena el aprendizaje justo ' +
    'cuando más falta hace. La segunda es <strong>cómo se da cada paso</strong>, y ahí está el ' +
    'algoritmo que hoy entrena casi todo.');

  /* ---------------------------------------------------------------- */
  p.section('El error cuadrático se apaga cuando más falta hace');

  p.text('Imagina lo peor que le puede pasar a un clasificador: la etiqueta es $y = 1$ y el modelo ' +
    'contesta $p = 0{,}01$. Está equivocado con toda su seguridad, así que debería corregirse con ' +
    'fuerza. Mira lo que hace cada pérdida en ese momento.');

  p.formulas([
    '\\text{cuadrática:}\\quad \\frac{\\partial L}{\\partial z} = 2\\,(p - y)\\,p\\,(1-p)',
    '\\text{entropía cruzada:}\\quad \\frac{\\partial L}{\\partial z} = p - y'
  ], 'lo que llega a los pesos, con cada pérdida',
    'La $z$ es la suma ponderada antes de la sigmoide, que es por donde entra la corrección a los ' +
    'pesos.<br><br>Las dos empiezan por $p - y$, el error de siempre. La diferencia es el ' +
    '$p(1-p)$ de la primera, que es $\\sigma\'$: cuando el modelo está muy seguro, $p$ vale casi 0 o ' +
    'casi 1 y ese factor <strong>se hace diminuto</strong>. Con $p = 0{,}01$ vale $0{,}0099$, así que ' +
    'la corrección se divide por cien. La entropía cruzada no lo lleva, y corrige en proporción al ' +
    'error y nada más.');

  p.demo({
    title: 'La corrección que llega, según la pérdida',
    intro: 'La etiqueta es la que elijas y el modelo contesta la probabilidad del mando. Las dos curvas son la fuerza con la que cada pérdida corrige los pesos. Lleva el mando al extremo equivocado y compara: ahí es donde se decide cuál de las dos sirve.',
    predice: 'Con etiqueta 1, el peor error posible es contestar 0. ¿Cuál de las dos pérdidas crees que corregirá más fuerte justo ahí?',
    build: function (host) {
      var pv = 0.5, y = 1;
      var out = W.readout(host, '');
      function gEcm(q) { return Math.abs(2 * (q - y) * q * (1 - q)); }
      function gEnt(q) { return Math.abs(q - y); }
      var plot = W.plot(host, {
        xmin: -0.04, xmax: 1.04, ymin: -0.06, ymax: 1.15, height: 300,
        xlabel: 'p, lo que contesta el modelo', ylabel: 'fuerza de la corrección',
        aria: 'Dos curvas que comparan la fuerza con la que corrigen el error cuadrático y la entropía cruzada',
        draw: function (g) {
          g.fn(gEnt, { color: 2, w: 2.6 });
          g.fn(gEcm, { color: 1, w: 2.4 });
          g.vline(pv, { color: 'ink', w: 1.6, dash: [5, 4] });
          g.point(pv, gEnt(pv), { color: 2, r: 5 });
          g.point(pv, gEcm(pv), { color: 1, r: 5 });
          g.text(0.04, 1.08, 'entropía cruzada', { color: 2, size: 12 });
          g.text(0.04, 0.95, 'error cuadrático', { color: 1, size: 12 });
        }
      });
      function pinta() {
        var a = gEnt(pv), b = gEcm(pv);
        out.set('Etiqueta $y = ' + y + '$, el modelo contesta $p = ' + U.fmt(pv, 2) + '$.<br>' +
          'Corrección con <strong style="color:var(--c3)">entropía cruzada</strong>: ' + U.fmt(a, 4) +
          ' &nbsp;·&nbsp; con <strong style="color:var(--c2)">error cuadrático</strong>: ' + U.fmt(b, 4) +
          (b > 1e-9 ? ' &nbsp;·&nbsp; <strong>' + U.fmt(a / b, 1) + ' veces más fuerte</strong>' : '') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          ((y === 1 && pv < 0.12) || (y === 0 && pv > 0.88)
            ? 'Equivocado y seguro: es el peor caso, y el error cuadrático es justo aquí donde casi no corrige. La entropía cruzada empuja con todo.'
            : ((y === 1 && pv > 0.9) || (y === 0 && pv < 0.1)
              ? 'Acertando con seguridad: las dos corrigen poco, que es lo correcto. No hay nada que arreglar.'
              : 'En la zona de duda las dos se parecen. La diferencia gorda está en los extremos.')) +
          '</span>');
        plot.render();
      }
      W.chips(host, [{ label: 'etiqueta y = 1', value: 1 }, { label: 'etiqueta y = 0', value: 0 }],
        { value: 1, on: function (v) { y = v; pinta(); } });
      W.slider(W.row(host), {
        label: 'p que contesta el modelo', min: 0.01, max: 0.99, step: 0.01, value: 0.5, dec: 2,
        on: function (v) { pv = v; pinta(); }
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La pérdida correcta, y por qué se simplifica');

  p.text('La pérdida que arregla esto no hay que inventarla: es [[av-informacion|la entropía cruzada]] ' +
    'del bloque de información, aplicada a dos clases. La distribución real reparte toda la ' +
    'probabilidad en la etiqueta verdadera, y la del modelo es $p$.');

  p.formula('L = -\\bigl[\\,y\\ln p + (1-y)\\ln(1-p)\\,\\bigr]',
    'entropía cruzada binaria',
    'Se lee: <em>«ele es menos, corchete, i griega por logaritmo neperiano de pe, más uno menos i ' +
    'griega por logaritmo neperiano de uno menos pe»</em>.<br><br>Como $y$ vale 0 o 1, uno de los dos ' +
    'sumandos se anula siempre: si $y = 1$ queda $-\\ln p$, y si $y = 0$ queda $-\\ln(1-p)$. En los dos ' +
    'casos es <strong>menos el logaritmo de la probabilidad que el modelo le dio a la respuesta ' +
    'correcta</strong>. Acertar con seguridad cuesta casi 0; equivocarse con seguridad cuesta ' +
    'muchísimo, porque el logaritmo se dispara cerca de cero.');

  p.text('Y ahora la cuenta que lo justifica todo, que son tres líneas y merece la pena hacerlas:');

  p.formulas([
    '\\frac{\\partial L}{\\partial p} = -\\frac{y}{p} + \\frac{1-y}{1-p} = \\frac{p-y}{p\\,(1-p)}',
    '\\frac{\\partial p}{\\partial z} = p\\,(1-p)',
    '\\frac{\\partial L}{\\partial z} = \\frac{p-y}{p(1-p)}\\cdot p(1-p) = p - y'
  ], 'la cancelación',
    'La primera línea es derivar la entropía cruzada respecto de $p$ y poner las dos fracciones sobre ' +
    'el mismo denominador. La segunda es la derivada de la sigmoide, $\\sigma(1-\\sigma)$, que ya ' +
    'conoces.<br><br>Y al multiplicarlas por la regla de la cadena, <strong>el $p(1-p)$ se ' +
    'cancela</strong>. Ese factor era justo el que apagaba el gradiente en los extremos, y desaparece. ' +
    'No es una casualidad afortunada: la entropía cruzada es la pérdida diseñada para acompañar a la ' +
    'sigmoide, y esta cancelación es la razón.');

  p.ejemplo({
    title: 'Las dos pérdidas en el peor caso',
    enunciado: 'La etiqueta es $y = 1$ y el modelo contesta $p = 0{,}02$. Calcular, para cada pérdida, la corrección que llega a los pesos, y compararlas.',
    pasos: [
      { t: '<strong>El error.</strong> $p - y = 0{,}02 - 1 = -0{,}98$. Casi el máximo posible: el modelo no puede estar mucho más equivocado.', antes: 'Resta la etiqueta a lo que contesta el modelo.' },
      { t: '<strong>La derivada de la sigmoide.</strong> $p(1-p) = 0{,}02 \\cdot 0{,}98 = 0{,}0196$. Muy pequeña, porque el modelo está muy seguro.', antes: 'Calcula $p(1-p)$ con ese valor.' },
      { t: '<strong>Con error cuadrático.</strong> $2(p-y)\\,p(1-p) = 2 \\cdot (-0{,}98) \\cdot 0{,}0196 = -0{,}0384$. Una corrección minúscula, en el peor error posible.', antes: 'Multiplica los dos resultados por 2.' },
      { t: '<strong>Con entropía cruzada.</strong> $p - y = -0{,}98$, y ya está: el $p(1-p)$ se ha cancelado.', antes: '¿Qué queda tras la cancelación de la cuenta de arriba?' },
      { t: '<strong>La comparación.</strong> $0{,}98 / 0{,}0384 \\approx 25{,}5$: la entropía cruzada corrige veinticinco veces más fuerte en el momento en que hay que corregir. Y cuanto más seguro y más equivocado esté el modelo, mayor es la diferencia.' }
    ],
    cierre: 'Comprueba el caso opuesto: con $p = 0{,}98$ y $y = 1$ las dos corrigen casi nada, que es lo correcto. La entropía cruzada no corrige siempre más: corrige más <em>cuando hace falta</em>.'
  });

  p.comprueba('¿Por qué la entropía cruzada evita que el gradiente se apague?', [
    { t: 'Porque su derivada respecto de $p$ lleva un $p(1-p)$ en el denominador que cancela exactamente el de la sigmoide', ok: true, por: 'La cadena multiplica $\\frac{p-y}{p(1-p)}$ por $p(1-p)$ y queda $p-y$. El factor que apagaba la corrección desaparece por construcción.' },
    { t: 'Porque el logaritmo hace los números más grandes', ok: false, por: 'El logaritmo de un número entre 0 y 1 es negativo y de módulo grande, sí, pero lo que importa no es el valor de la pérdida sino su <em>derivada</em>. Lo decisivo es la cancelación.' },
    { t: 'Porque no usa la sigmoide', ok: false, por: 'La usa: $p$ es la salida de la sigmoide. Lo que hace es compensar exactamente su derivada.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Dar el paso con lo que se tiene a mano');

  p.text('Con la pérdida elegida queda cómo dar el paso. De [[av-optimizacion|optimización]] traemos ya ' +
    'dos ideas: el gradiente se calcula sobre un <strong>minilote</strong> al azar en vez de sobre ' +
    'todos los datos, y se le da <strong>momento</strong> para que la bola atraviese las irregularidades.');

  p.note('Una consecuencia práctica del minilote que conviene saber leer: <strong>la curva de pérdida ' +
    'sale con dientes de sierra</strong>. No es que el entrenamiento vaya mal; es que cada paso mide el ' +
    'error sobre una muestra distinta. Lo que hay que mirar es la tendencia, no los saltos. Una pasada ' +
    'completa por todos los datos se llama <em>época</em>, y es la unidad en la que se cuenta el ' +
    'entrenamiento.', null, 'Los dientes de sierra son normales');

  /* ---------------------------------------------------------------- */
  p.section('Adam: dos medias móviles y poco más');

  p.text('Y llegamos al algoritmo que entrena hoy casi todo. Su idea es que <strong>cada parámetro ' +
    'necesita un paso distinto</strong>: si una entrada está medida en milímetros y otra en kilómetros, ' +
    'sus gradientes tienen tamaños incomparables y una sola tasa de aprendizaje no puede servir para ' +
    'los dos. Para arreglarlo hace falta saber «de qué tamaño suele ser» el gradiente de cada ' +
    'parámetro, y eso es exactamente lo que mide [[cib-filtrado|una media móvil exponencial]].');

  p.formulas([
    'm_t = \\beta_1 m_{t-1} + (1-\\beta_1)\\,g_t',
    'v_t = \\beta_2 v_{t-1} + (1-\\beta_2)\\,g_t^2',
    '\\theta \\leftarrow \\theta - \\eta\\,\\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\varepsilon}'
  ], 'Adam, entero',
    'Las dos primeras líneas son <strong>la misma media móvil exponencial de los filtros</strong>, ' +
    'aplicada dos veces: $m$ suaviza el gradiente —eso es el momento— y $v$ suaviza su ' +
    '<em>cuadrado</em>, es decir, mide el tamaño típico que tiene.<br><br>La tercera divide una por la ' +
    'raíz de la otra. Ese cociente es aproximadamente «cuántos tamaños típicos mide el gradiente ' +
    'ahora», un número sin unidades, así que <strong>el paso ya no depende de la escala</strong>: un ' +
    'parámetro con gradientes enormes y otro con gradientes minúsculos avanzan igual. Los valores ' +
    'habituales son $\\beta_1 = 0{,}9$ y $\\beta_2 = 0{,}999$, y $\\varepsilon$ es un número diminuto ' +
    'que solo está para no dividir entre cero.');

  p.text('Falta explicar los sombreros. Las dos medias empiezan valiendo cero, así que en los primeros ' +
    'pasos están <strong>sesgadas hacia abajo</strong>: la media de un solo valor $g$ sale ' +
    '$(1-\\beta_1)g$, que con $\\beta_1 = 0{,}9$ es solo la décima parte de $g$. La corrección deshace ' +
    'exactamente ese arranque frío.');

  p.formula('\\hat m_t = \\frac{m_t}{1 - \\beta_1^{\\,t}}, \\qquad \\hat v_t = \\frac{v_t}{1 - \\beta_2^{\\,t}}',
    'corrección del arranque',
    'Se lee: <em>«eme sombrero sub te es eme sub te partido por uno menos beta uno elevado a te»</em>. ' +
    'El exponente es el número de paso.<br><br>En el primer paso, $1 - \\beta_1 = 0{,}1$ y dividir por ' +
    'él multiplica por diez, que es justo lo que se había perdido. Conforme $t$ crece, $\\beta^t$ se va ' +
    'a cero y la corrección deja de hacer nada. Solo arregla el principio.');

  p.demo({
    title: 'Tres formas de dar el paso, en el mismo problema',
    intro: 'Una neurona logística sobre datos con las dos columnas en escalas muy distintas: una vale unas veinte veces más que la otra. Las tres copias entrenan a la vez con el mismo dato y la misma tasa, y solo cambia cómo dan el paso. Mira las tres curvas de pérdida.',
    predice: 'Con una columna veinte veces mayor que la otra, sus gradientes también lo serán. ¿Cuál de los tres crees que sufrirá más: el que usa un paso igual para todos los parámetros, o el que lo divide por el tamaño típico de cada uno?',
    build: function (host) {
      var D = NN.datos.nubes(U.rng(31), 90, 1.3);
      /* Una columna se escala x20: asi los dos gradientes viven en
         magnitudes distintas, que es el caso que Adam resuelve. */
      var filas = D.X.map(function (q) { return [q[0] * 20, q[1]]; });
      var X = NN.deFilas(filas);
      var Y = NN.t([filas.length, 1], D.y);
      var corredores = [];
      function nuevo(nombre, hacer, color) {
        var r = U.rng(9);
        var Wp = NN.param([2, 1], r, 0.02), bp = NN.constante([1], 0);
        return { nombre: nombre, W: Wp, b: bp, opt: hacer([Wp, bp]), hist: [], color: color, L: 0 };
      }
      function reinicia() {
        corredores = [
          nuevo('SGD', function (ps) { return NN.SGD(ps, { lr: 0.05, momento: 0 }); }, 0),
          nuevo('con momento', function (ps) { return NN.SGD(ps, { lr: 0.05, momento: 0.9 }); }, 1),
          nuevo('Adam', function (ps) { return NN.Adam(ps, { lr: 0.05 }); }, 2)
        ];
      }
      reinicia();
      function paso() {
        corredores.forEach(function (c) {
          NN.limpia();
          var pred = NN.sigmoide(NN.suma(NN.mm(X, c.W), c.b));
          var L = NN.entropiaCruzadaBinaria(pred, Y);
          NN.atras(L, [c.W, c.b]);
          c.opt.paso();
          c.L = L.v[0];
          c.hist.push(c.L);
          if (c.hist.length > 300) c.hist.shift();
        });
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 300, ymin: 0, ymax: 0.35, height: 300,
        xlabel: 'pasos', ylabel: 'pérdida',
        aria: 'Tres curvas de pérdida comparando descenso simple, descenso con momento y Adam',
        draw: function (g) {
          corredores.forEach(function (c) {
            if (c.hist.length > 1) g.path(c.hist.map(function (v, i) { return [i, v]; }), { color: c.color, w: 2.2 });
          });
        }
      });
      function pinta() {
        out.set(corredores.map(function (c) {
          return '<strong style="color:var(--c' + (c.color + 1) + ')">' + c.nombre + '</strong>: ' + U.fmt(c.L, 5);
        }).join(' &nbsp;·&nbsp; ') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Con las escalas descompensadas, el ' +
          'paso único tiene que ser pequeño para no dispararse en la columna grande, y entonces la ' +
          'pequeña avanza a paso de tortuga. Adam le da a cada parámetro su propio tamaño de paso.</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 3, paso: paso, pinta: pinta, hasta: 300 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      pinta();
    }
  });

  p.ejemplo({
    title: 'El primer paso de Adam, y por qué siempre mide lo mismo',
    enunciado: 'Un parámetro empieza en 0 y su primer gradiente vale $g = 5$. Con $\\eta = 0{,}1$, $\\beta_1 = 0{,}9$ y $\\beta_2 = 0{,}999$, calcular dónde queda. Repetir con $g = 500$.',
    pasos: [
      { t: '<strong>Las dos medias.</strong> Partiendo de cero: $m_1 = 0{,}1 \\cdot 5 = 0{,}5$ y $v_1 = 0{,}001 \\cdot 25 = 0{,}025$.', antes: 'Aplica las dos recurrencias con $m_0 = v_0 = 0$.' },
      { t: '<strong>La corrección del arranque.</strong> $\\hat m = 0{,}5 / 0{,}1 = 5$ y $\\hat v = 0{,}025 / 0{,}001 = 25$. Fíjate: $\\hat m$ ha vuelto a ser exactamente $g$, y $\\hat v$, exactamente $g^2$.', antes: 'Divide cada una por $1-\\beta^1$, que son $0{,}1$ y $0{,}001$.' },
      { t: '<strong>El paso.</strong> $\\eta\\,\\frac{\\hat m}{\\sqrt{\\hat v}} = 0{,}1 \\cdot \\frac{5}{5} = 0{,}1$. El parámetro queda en $-0{,}1$.', antes: 'Sustituye en la fórmula del paso. ¿Cuánto vale el cociente?' },
      { t: '<strong>Ahora con $g = 500$.</strong> $\\hat m = 500$, $\\hat v = 250\\,000$, $\\sqrt{\\hat v} = 500$, y el cociente vuelve a valer 1. El paso es otra vez $0{,}1$.', antes: 'Rehaz la cuenta con el gradiente cien veces mayor.' },
      { t: '<strong>Lo que significa.</strong> El primer paso de Adam mide exactamente $\\eta$, sea cual sea el gradiente. Eso es lo que quiere decir que el método sea insensible a la escala: la tasa de aprendizaje deja de depender de en qué unidades estén los datos.' }
    ],
    cierre: 'Es también el motivo de que $\\eta = 0{,}001$ funcione razonablemente en casi cualquier problema con Adam, mientras que con descenso simple hay que buscarla a mano cada vez.'
  });

  p.util('Adam es hoy el ajuste por defecto de prácticamente todo lo que se entrena, desde un modelo de ' +
    'lenguaje hasta una red que clasifica radiografías, y la razón es muy práctica: funciona ' +
    'razonablemente bien sin ajustarle casi nada. Eso no lo hace mágico —en problemas bien escalados el ' +
    'descenso con momento y una tasa bien elegida suele igualarlo o mejorarlo— pero ahorra la parte más ' +
    'ingrata del trabajo. Y la entropía cruzada es la pérdida de cualquier clasificador, incluido el ' +
    'preentrenamiento de un modelo de lenguaje, que no es más que clasificar cuál es la palabra ' +
    'siguiente entre decenas de miles.');

  p.hist('Cada pieza tiene su fecha. El descenso con gradientes estimados sobre muestras lo formalizaron ' +
    'Herbert Robbins y Sutton Monro en 1951, con el nombre de aproximación estocástica. El momento es ' +
    'de Boris Polyak, en 1964, y su imagen era literalmente una bola pesada. Adam lo presentaron ' +
    'Diederik Kingma y Jimmy Ba en 2015, y el nombre viene de <em>adaptive moment estimation</em>, ' +
    'estimación adaptativa de momentos, porque las dos medias móviles son estimaciones del primer y del ' +
    'segundo momento del gradiente. Es uno de los artículos más citados de la historia de la ' +
    'informática, y lo que propone son dos medias móviles y una división.');

  p.trampas([
    { e: 'Usar error cuadrático para clasificar', por: 'Cuando el modelo está muy seguro y muy equivocado, el factor $p(1-p)$ apaga la corrección justo cuando hace falta. Con $p = 0{,}02$ y $y = 1$, corrige veinticinco veces menos.' },
    { e: 'Pensar que la entropía cruzada corrige siempre más', por: 'Cuando el modelo acierta con seguridad, las dos corrigen casi nada, y eso está bien. La diferencia está solo en los extremos equivocados.' },
    { e: 'Alarmarse por los dientes de sierra de la pérdida', por: 'Cada paso mide sobre un minilote distinto, así que la curva oscila por construcción. Lo que importa es la tendencia.' },
    { e: 'Olvidar la corrección del arranque de Adam', por: 'Las medias empiezan en cero, así que sin corregir el primer paso sería diez veces menor de lo debido y el entrenamiento arrancaría en falso.' },
    { e: 'Creer que Adam quita la necesidad de elegir la tasa', por: 'La hace mucho menos delicada, no innecesaria. Sigue habiendo tasas que no convergen y tasas que van demasiado despacio.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Lo que cuesta una respuesta',
    level: 'basico',
    gen: function (r) {
      var pv = r.pick([0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99]);
      var y = r.int(0, 1);
      var L = y === 1 ? -Math.log(pv) : -Math.log(1 - pv);
      return { p: pv, y: y, L: L };
    },
    ask: function (d) {
      return 'La etiqueta es $y = ' + d.y + '$ y el modelo contesta $p = ' + U.fmt(d.p, 2) + '$. ¿Cuánto ' +
        'vale la entropía cruzada $L = -[y\\ln p + (1-y)\\ln(1-p)]$? (cuatro decimales)';
    },
    fields: [{ name: 'l', label: 'L', w: 'tiny' }],
    sol: function (d) { return { l: U.round(d.L, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var otro = d.y === 1 ? -Math.log(1 - d.p) : -Math.log(d.p); return Math.abs(otro - d.L) > 0.001 && Math.abs(v.l - otro) < 0.0005; }, msg: 'Has usado la rama equivocada. Con $y = 1$ queda $-\\ln p$; con $y = 0$, $-\\ln(1-p)$.' }],
    hint: function (d) { return d.y === 1 ? 'Con $y = 1$ el segundo sumando se anula y queda $-\\ln p$.' : 'Con $y = 0$ el primer sumando se anula y queda $-\\ln(1-p)$.'; },
    steps: function (d) {
      return [d.y === 1 ? '$L = -\\ln(' + U.fmt(d.p, 2) + ') = ' + U.fmt(d.L, 4) + '$'
        : '$L = -\\ln(1 - ' + U.fmt(d.p, 2) + ') = -\\ln(' + U.fmt(1 - d.p, 2) + ') = ' + U.fmt(d.L, 4) + '$',
        d.L < 0.3 ? 'Poca pérdida: el modelo le dio buena probabilidad a la respuesta correcta.'
          : 'Mucha pérdida: el modelo apostó por la otra, y el logaritmo castiga eso con dureza.'];
    },
    answer: function (d) { return U.fmt(d.L, 4); }
  });

  p.exercise({
    title: 'Las dos correcciones, comparadas',
    level: 'basico',
    gen: function (r) {
      var pv = r.pick([0.02, 0.05, 0.1, 0.2, 0.8, 0.9, 0.95]);
      var y = pv < 0.5 ? 1 : 0;
      var ent = Math.abs(pv - y), ecm = Math.abs(2 * (pv - y) * pv * (1 - pv));
      return { p: pv, y: y, ent: ent, ecm: ecm };
    },
    ask: function (d) {
      return 'Etiqueta $y = ' + d.y + '$ y el modelo contesta $p = ' + U.fmt(d.p, 2) + '$: está equivocado ' +
        'y seguro. Calcula el tamaño de la corrección con entropía cruzada, $|p-y|$, y con error ' +
        'cuadrático, $|2(p-y)p(1-p)|$. (cuatro decimales)';
    },
    fields: [{ name: 'a', label: 'entropía cruzada', w: 'tiny' }, { name: 'b', label: 'error cuadrático', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.ent, 8), b: U.round(d.ecm, 8) }; },
    dec: 4,
    hint: function (d) { return 'La primera es solo el error. La segunda es ese error por $2p(1-p) = ' + U.fmt(2 * d.p * (1 - d.p), 4) + '$.'; },
    steps: function (d) {
      return ['Entropía cruzada: $|' + U.fmt(d.p, 2) + ' - ' + d.y + '| = ' + U.fmt(d.ent, 4) + '$.',
        'Error cuadrático: $' + U.fmt(d.ent, 4) + ' \\times 2 \\times ' + U.fmt(d.p, 2) + ' \\times ' + U.fmt(1 - d.p, 2) + ' = ' + U.fmt(d.ecm, 4) + '$.',
        'La primera corrige <strong>' + U.fmt(d.ent / d.ecm, 1) + ' veces</strong> más fuerte, y justo en el caso en que hay que corregir.'];
    },
    answer: function (d) { return U.fmt(d.ent, 4) + ' frente a ' + U.fmt(d.ecm, 4); }
  });

  p.exercise({
    title: 'Un paso de la media móvil',
    level: 'medio',
    gen: function (r) {
      var b = r.pick([0.5, 0.8, 0.9, 0.95]);
      var m = r.int(-8, 8), g = r.nz(-9, 9);
      return { b: b, m: m, g: g, nuevo: b * m + (1 - b) * g };
    },
    ask: function (d) {
      return 'Una media móvil exponencial con $\\beta = ' + U.fmt(d.b, 2) + '$ vale ahora $m = ' + d.m +
        '$ y llega un valor nuevo $g = ' + d.g + '$. ¿Cuánto vale después? (cuatro decimales)';
    },
    fields: [{ name: 'm', label: 'm nueva', w: 'tiny' }],
    sol: function (d) { return { m: U.round(d.nuevo, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var alreves = (1 - d.b) * d.m + d.b * d.g; return Math.abs(alreves - d.nuevo) > 0.0005 && Math.abs(v.m - alreves) < 0.0005; }, msg: 'Has cambiado los pesos de sitio: $\\beta$ multiplica a lo viejo y $1-\\beta$ a lo nuevo. Con $\\beta$ grande, la media es perezosa.' }],
    hint: function () { return '$m \\leftarrow \\beta m + (1-\\beta)g$: lo viejo pesa $\\beta$ y lo nuevo, el resto.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.b, 2) + ' \\cdot ' + d.m + ' + ' + U.fmt(1 - d.b, 2) + ' \\cdot (' + d.g + ') = ' + U.fmt(d.nuevo, 4) + '$',
        'Con $\\beta = ' + U.fmt(d.b, 2) + '$ la memoria efectiva es de unos ' + Math.round(1 / (1 - d.b)) + ' valores.'];
    },
    answer: function (d) { return U.fmt(d.nuevo, 4); }
  });

  p.exercise({
    title: 'El primer paso de Adam',
    level: 'medio',
    gen: function (r) {
      var g = r.pick([0.5, 2, 5, 40, 300, -3, -120]);
      var eta = r.pick([0.01, 0.05, 0.1]);
      return { g: g, eta: eta, paso: eta * (g > 0 ? 1 : -1), nuevo: -eta * (g > 0 ? 1 : -1) };
    },
    ask: function (d) {
      return 'Un parámetro vale 0 y su primer gradiente es $g = ' + d.g + '$. Con Adam, $\\eta = ' +
        U.fmt(d.eta, 2) + '$, $\\beta_1 = 0{,}9$ y $\\beta_2 = 0{,}999$, ¿dónde queda tras el primer ' +
        'paso? (cuatro decimales)';
    },
    fields: [{ name: 'w', label: 'valor nuevo', w: 'tiny' }],
    sol: function (d) { return { w: U.round(d.nuevo, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { return Math.abs(v.w + d.eta * d.g) < 0.0005 && Math.abs(d.eta * d.g - d.eta) > 0.0005; }, msg: 'Eso es lo que haría el descenso normal, $-\\eta g$. Adam divide por la raíz de la media del cuadrado, y en el primer paso ese cociente vale exactamente 1.' }],
    hint: function () { return 'Con la corrección del arranque, $\\hat m = g$ y $\\hat v = g^2$, así que el cociente es $g/|g|$: vale 1 o −1.'; },
    steps: function (d) {
      return ['$\\hat m = g = ' + d.g + '$ y $\\hat v = g^2 = ' + (d.g * d.g) + '$, luego $\\sqrt{\\hat v} = ' + Math.abs(d.g) + '$.',
        'El cociente vale $' + d.g + ' / ' + Math.abs(d.g) + ' = ' + (d.g > 0 ? '1' : '-1') + '$.',
        'Paso: $-' + U.fmt(d.eta, 2) + ' \\cdot (' + (d.g > 0 ? '1' : '-1') + ') = ' + U.fmt(d.nuevo, 4) + '$.',
        'Sea el gradiente 0,5 o 300, el primer paso mide siempre $\\eta$. Esa es la insensibilidad a la escala.'];
    },
    answer: function (d) { return U.fmt(d.nuevo, 4); }
  });

  p.exercise({
    title: 'La cancelación, comprobada',
    level: 'avanzado',
    gen: function (r) {
      var pv = r.pick([0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9]);
      var y = r.int(0, 1);
      return { p: pv, y: y, dLdp: (pv - y) / (pv * (1 - pv)), dpdz: pv * (1 - pv), dLdz: pv - y };
    },
    ask: function (d) {
      return 'Con $p = ' + U.fmt(d.p, 1) + '$ y $y = ' + d.y + '$, calcula $\\frac{\\partial L}{\\partial p} = ' +
        '\\frac{p-y}{p(1-p)}$, después $\\frac{\\partial p}{\\partial z} = p(1-p)$, y por último su ' +
        'producto. (cuatro decimales)';
    },
    fields: [
      { name: 'a', label: '∂L/∂p', w: 'tiny' }, { name: 'b', label: '∂p/∂z', w: 'tiny' },
      { name: 'c', label: 'producto', w: 'tiny' }
    ],
    sol: function (d) { return { a: U.round(d.dLdp, 8), b: U.round(d.dpdz, 8), c: U.round(d.dLdz, 8) }; },
    dec: 4,
    hint: function () { return 'Calcula los dos por separado y multiplícalos. Fíjate en qué le pasa al denominador del primero.'; },
    steps: function (d) {
      return ['$\\frac{\\partial L}{\\partial p} = \\frac{' + U.fmt(d.p, 1) + ' - ' + d.y + '}{' + U.fmt(d.p, 1) + ' \\cdot ' + U.fmt(1 - d.p, 1) + '} = ' + U.fmt(d.dLdp, 4) + '$',
        '$\\frac{\\partial p}{\\partial z} = ' + U.fmt(d.p, 1) + ' \\cdot ' + U.fmt(1 - d.p, 1) + ' = ' + U.fmt(d.dpdz, 4) + '$',
        'Producto: $' + U.fmt(d.dLdz, 4) + '$, que es exactamente $p - y$.',
        'El $p(1-p)$ estaba dividiendo en el primero y multiplicando en el segundo: se cancela siempre, no solo con estos números.'];
    },
    answer: function (d) { return U.fmt(d.dLdz, 4) + ', que es p − y'; }
  });

  p.keys([
    'El error cuadrático multiplica la corrección por $p(1-p)$, que se apaga cuando el modelo está seguro y equivocado: justo cuando hace falta corregir.',
    'La entropía cruzada es la pérdida de clasificar: menos el logaritmo de la probabilidad que el modelo dio a la respuesta correcta.',
    'Su gradiente respecto de $z$ es exactamente $p - y$, porque el $p(1-p)$ se cancela con el de la sigmoide.',
    'El gradiente se estima sobre minilotes, así que la curva de pérdida sale con dientes de sierra por construcción.',
    'Adam son dos medias móviles exponenciales: una del gradiente y otra de su cuadrado, y se divide una por la raíz de la otra.',
    'Eso hace el paso insensible a la escala: el primero mide exactamente $\\eta$, valga el gradiente 0,5 o 300.'
  ]);
});
