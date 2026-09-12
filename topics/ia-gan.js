/* Tema: Dos redes jugando: GAN */
Course.topic('ia-gan', function (p) {

  p.puente('De [[ia-autocodificador|el autocodificador]] viene la idea de fabricar datos con una red que ' +
    'recibe un código; de [[pe-continuas|las variables continuas]], que todas las distribuciones se ' +
    'fabrican transformando uniformes; de [[av-juegos|los juegos de suma cero]], el maximin; y de ' +
    '[[av-sistemas-dinamicos|los sistemas dinámicos]], qué le pasa a un equilibrio cuando los ' +
    'autovalores son complejos. Aquí se juntan las cuatro cosas en una sola idea.');

  p.text('El VAE necesitaba una pérdida que comparase la salida con la entrada, y eso obliga a decir ' +
    '<em>en qué se parecen</em> dos imágenes. Con el error cuadrático, la respuesta es «píxel a píxel», ' +
    'que es una medida malísima: una imagen movida un píxel es casi idéntica para un ojo y lejísimos ' +
    'para esa fórmula. La idea de 2014 fue quitar la fórmula y poner <strong>una segunda red que ' +
    'aprenda a juzgar</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('El generador: ruido que se deforma');

  p.text('El generador no inventa de la nada. Recibe un vector de números al azar —ruido, normalmente ' +
    'uniforme o normal— y lo deforma hasta que la nube de salida se parezca a la nube de los datos. ' +
    'Eso no es un truco de las redes: es [[pe-continuas|exactamente lo que hace tu ordenador]] cada ' +
    'vez que te da un número de una distribución cualquiera.');

  p.formula('G : \\mathbb{R}^k \\to \\mathbb{R}^n, \\qquad \\vec z \\sim U(-1, 1) \\ \\Longrightarrow \\ G(\\vec z) \\approx \\text{datos}',
    'el generador, como cambio de variable',
    'Se lee: <em>«ge lleva vectores de ka números a vectores de ene números»</em>.<br><br>Lo único que ' +
    'se le pide es que, cuando la entrada sea ruido, <strong>la distribución de la salida</strong> se ' +
    'parezca a la de los datos. Fíjate en que no se le pide nada de cada salida por separado: no hay ' +
    'una respuesta correcta para un ruido concreto. Lo que se juzga es el conjunto.');

  p.demo({
    title: 'Deformar una uniforme hasta obtener la campana que quieras',
    intro: 'Arriba, ruido uniforme entre −1 y 1. Abajo, lo que sale al pasarlo por una función. Cambia la función y mira cómo el histograma de abajo cambia de forma sin que el de arriba se toque. Ninguna de las dos redes ha aprendido nada todavía: esto es solo el cambio de variable.',
    predice: 'Si estiras mucho una zona de la función y aplastas otra, ¿dónde se acumularán los puntos de salida: donde la función es empinada o donde es plana?',
    build: function (host) {
      var r = U.rng(21), N = 4000, z = [], i;
      for (i = 0; i < N; i++) z.push(r.real(-1, 1, 5));
      var funcs = [
        { t: 'identidad', f: function (u) { return 2 * u; }, d: 'Una uniforme estirada sigue siendo uniforme: una recta no concentra nada.' },
        { t: 'cúbica', f: function (u) { return 2.4 * u * u * u; }, d: 'La cúbica es plana cerca del cero, así que amontona muchísimo ahí, y empinada en los extremos, que quedan despoblados.' },
        { t: 'dos jorobas', f: function (u) { return u < 0 ? -1.3 + 0.7 * (u + 0.5) * 2 : 1.3 + 0.7 * (u - 0.5) * 2; }, d: 'Partiendo el recorrido en dos tramos separados salen dos modas de una sola uniforme. Un generador hace esto, pero con la función aprendida.' },
        { t: 'tangente', f: function (u) { return 1.1 * Math.tan(1.1 * u); }, d: 'La tangente se dispara en los bordes: produce colas largas a partir de una entrada acotada.' }
      ];
      var sel = funcs[1];
      /* g.bars quiere [{x, h}], con x en unidades del eje: el centro de cada
         casilla. La altura se normaliza para que la mas alta valga 1. */
      function histo(datos, lo, hi, nb) {
        var b = [], k;
        for (k = 0; k < nb; k++) b[k] = 0;
        datos.forEach(function (v) { var j = Math.floor((v - lo) / (hi - lo) * nb); if (j >= 0 && j < nb) b[j]++; });
        var m = Math.max.apply(null, b) || 1;
        var paso = (hi - lo) / nb, salida = [];
        for (k = 0; k < nb; k++) salida.push({ x: lo + (k + 0.5) * paso, h: b[k] / m });
        return salida;
      }
      var out = W.readout(host, '');
      var arriba = W.plot(host, {
        xmin: -3.2, xmax: 3.2, ymin: 0, ymax: 1.15, height: 110, xlabel: 'z (ruido de entrada)',
        aria: 'Histograma del ruido uniforme de entrada, que es plano',
        draw: function (g) { g.bars(histo(z, -3.2, 3.2, 64), { color: 0, width: 0.1 }); }
      });
      var abajo = W.plot(host, {
        xmin: -3.2, xmax: 3.2, ymin: 0, ymax: 1.15, height: 140, xlabel: 'G(z) (salida)',
        aria: 'Histograma de la salida tras deformar el ruido con la función elegida',
        draw: function (g) { g.bars(histo(z.map(sel.f), -3.2, 3.2, 64), { color: 2, width: 0.1 }); }
      });
      function pinta() {
        var s = z.map(sel.f);
        var m = U.sum(s) / N;
        var sd = Math.sqrt(U.sum(s.map(function (v) { return (v - m) * (v - m); })) / N);
        out.set('<strong>' + sel.t + '</strong> &nbsp;·&nbsp; la entrada sigue siendo la misma uniforme, ' +
          'con media $0$ y anchura fija.<br>Salida: media $' + U.fmt(m, 3) + '$, desviación $' + U.fmt(sd, 3) + '$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' + sel.d + '</span>');
        arriba.render(); abajo.render();
      }
      W.chips(host, funcs.map(function (f) { return { label: f.t, value: f.t }; }), {
        value: 'cúbica',
        on: function (v) { sel = funcs.filter(function (f) { return f.t === v; })[0]; pinta(); }
      });
      pinta();
    }
  });

  p.note('Esto explica por qué un generador puede producir variedad sin tener ninguna aleatoriedad ' +
    'propia: <strong>todo el azar entra por $\\vec z$</strong>. La red es una función determinista; ' +
    'dos ruidos distintos dan dos salidas distintas, y el mismo ruido da siempre lo mismo.',
    'ok', 'De dónde sale la variedad');

  /* ---------------------------------------------------------------- */
  p.section('El discriminador y su forma óptima');

  p.text('La segunda red recibe un dato y devuelve un número entre 0 y 1: su apuesta de que ese dato sea ' +
    'real y no fabricado. Es [[ia-sigmoide|una clasificación binaria]] corriente, entrenada con ' +
    '[[av-informacion|entropía cruzada]], donde los ejemplos positivos son los datos y los negativos ' +
    'salen del generador.');

  p.text('Y aquí aparece el primer resultado bonito: si se congela el generador, <strong>se puede ' +
    'calcular exactamente qué discriminador es el mejor posible</strong>, sin entrenar nada.');

  p.formula('D^*(x) = \\frac{p(x)}{p(x) + q(x)}',
    'el discriminador óptimo',
    'Se lee: <em>«de estrella de equis es pe de equis partido por pe de equis más cu de equis»</em>, ' +
    'donde $p$ es la densidad de los datos reales y $q$ la de los fabricados.<br><br>Sale de una cuenta ' +
    'de una línea: en cada punto por separado hay que maximizar $p\\log D + q\\log(1 - D)$, y derivando ' +
    'respecto de $D$ queda $\\frac{p}{D} - \\frac{q}{1-D} = 0$, o sea $D = \\frac{p}{p+q}$.<br><br>' +
    'Fíjate en lo que dice: <strong>donde los datos reales y los falsos son igual de frecuentes, el ' +
    'mejor juez posible contesta $0{,}5$</strong>. No porque sea malo, sino porque ahí no hay nada que ' +
    'distinguir.');

  p.demo({
    title: 'El mejor juez posible, sin entrenar a nadie',
    intro: 'La curva azul es la distribución de los datos reales; la naranja, la del generador. La curva gruesa es el discriminador óptimo, calculado con la fórmula punto a punto. Mueve el generador y mira qué le pasa al juez donde las dos se solapan.',
    predice: 'Si consigues que las dos campanas se superpongan exactamente, ¿qué crees que dibujará la curva del discriminador óptimo?',
    build: function (host) {
      var mq = 1.4, sq = 0.5;
      function dp(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
      function dq(x) { var t = (x - mq) / sq; return Math.exp(-t * t / 2) / (sq * Math.sqrt(2 * Math.PI)); }
      function dstar(x) { var a = dp(x), b = dq(x); return (a + b) < 1e-12 ? 0.5 : a / (a + b); }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -0.05, ymax: 1.1, height: 300, xlabel: 'x',
        aria: 'Las densidades real y generada con la curva del discriminador óptimo encima',
        draw: function (g) {
          g.hline(0.5, { color: 'axis', w: 1, dash: [3, 3] });
          g.fn(dp, { color: 0, w: 2.4 });
          g.fn(dq, { color: 2, w: 2.4 });
          g.fn(dstar, { color: 3, w: 3 });
        }
      });
      function pinta() {
        var solape = 0, x;
        for (x = -6; x < 6; x += 0.01) solape += Math.min(dp(x), dq(x)) * 0.01;
        var d0 = dstar(0), dm = dstar(mq);
        out.set('Generador en $\\mu = ' + U.fmt(mq, 2) + '$, $\\sigma = ' + U.fmt(sq, 2) + '$ &nbsp;·&nbsp; ' +
          'solapamiento <strong>' + U.fmt(100 * solape, 1) + ' %</strong><br>' +
          'El juez óptimo dice $' + U.fmt(d0, 3) + '$ donde están los reales y $' + U.fmt(dm, 3) + '$ ' +
          'donde están los falsos.<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (solape > 0.95 ? 'Las dos distribuciones casi coinciden: el discriminador óptimo es prácticamente la recta $0{,}5$. Ha perdido, y ha perdido porque el generador ha ganado.'
            : (solape < 0.2 ? 'Apenas se solapan: el juez acierta casi siempre, y es fácil saber de qué lado está cada punto.'
              : 'Donde las dos curvas se cruzan, el óptimo vale exactamente $0{,}5$: ahí un dato real y uno falso son igual de probables.')) +
          '</span>');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'media del generador', min: -3, max: 3, step: 0.05, value: 1.4, dec: 2, on: function (v) { mq = v; pinta(); } });
      W.slider(fila, { label: 'anchura del generador', min: 0.3, max: 2.5, step: 0.05, value: 0.5, dec: 2, on: function (v) { sq = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Qué se está minimizando de verdad');

  p.text('Sustituyendo ese $D^*$ dentro del objetivo del juego sale el segundo resultado, y es el que ' +
    'explica de qué va todo esto. Lo que el generador minimiza, cuando el juez es óptimo, es una ' +
    '<strong>distancia entre distribuciones</strong>.');

  p.formula('V(D^*, G) = -\\log 4 + 2\\, D_{JS}(p \\Vert q)',
    'el valor del juego con el juez óptimo',
    'Donde $D_{JS}$ es la <strong>divergencia de Jensen-Shannon</strong>, que es ' +
    '[[av-informacion|la divergencia KL]] arreglada para que sea simétrica: se toma la mezcla ' +
    '$m = \\frac{p+q}{2}$ y se promedian las dos divergencias contra ella, ' +
    '$D_{JS} = \\tfrac12 D_{KL}(p \\Vert m) + \\tfrac12 D_{KL}(q \\Vert m)$.<br><br>' +
    'Vale $0$ cuando $p = q$ y como mucho $\\log 2$ cuando no comparten nada. Así que el juego tiene ' +
    'su mínimo, $-\\log 4 \\approx -1{,}386$, <strong>exactamente cuando el generador reproduce la ' +
    'distribución de los datos</strong>. No se parece a los datos: es que su distribución es la misma.');

  p.note('Esta es la aportación matemática del método, y conviene decirla entera: entrenar dos redes ' +
    'una contra otra <em>no</em> es una heurística con buena pinta. Es <strong>descenso de gradiente ' +
    'sobre una distancia entre distribuciones que nadie ha tenido que escribir</strong>. El ' +
    'discriminador es la forma de estimar esa distancia, y su gradiente es la forma de bajarla.',
    'ok', 'Por qué funciona, cuando funciona');

  p.ejemplo({
    title: 'El valor del juego en tres situaciones',
    enunciado: 'Comprobar cuánto vale $V(D^*, G)$ cuando el generador clava la distribución, cuando no comparte nada con ella, y en un caso intermedio con $D_{JS} = 0{,}2913$.',
    pasos: [
      { t: '<strong>Si $p = q$.</strong> La divergencia de Jensen-Shannon vale $0$, así que $V = -\\log 4 + 0 = -1{,}386$. Y el discriminador óptimo es $\\frac{p}{p+p} = 0{,}5$ en todas partes: no distingue nada.', antes: '¿Cuánto vale $D_{JS}$ cuando las dos distribuciones son la misma?' },
      { t: '<strong>Si no comparten nada.</strong> Entonces $D_{JS}$ alcanza su máximo, $\\log 2 = 0{,}693$, y $V = -\\log 4 + 2\\cdot 0{,}693 = -1{,}386 + 1{,}386 = 0$.', antes: 'El máximo de $D_{JS}$ es $\\log 2$. Sustituye.' },
      { t: '<strong>El caso intermedio.</strong> $V = -1{,}386 + 2\\cdot 0{,}2913 = -1{,}386 + 0{,}583 = -0{,}804$.', antes: 'Misma fórmula, con $D_{JS} = 0{,}2913$.' },
      { t: '<strong>Qué significa el recorrido.</strong> $V$ va de $-1{,}386$ (generador perfecto) a $0$ (generador inútil). El generador empuja hacia abajo y el discriminador hacia arriba, y por eso es un juego de suma cero como los de [[av-juegos|el bloque de juegos]].' }
    ],
    cierre: 'Todo el método cabe en esa fórmula: bajar $V$ es bajar la distancia entre la distribución que fabrica el generador y la de los datos.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Por qué oscila: el descenso-ascenso gira');

  p.text('Y ahora el problema. En un juego de suma cero, uno minimiza lo que el otro maximiza, y los dos ' +
    'dan su paso <strong>a la vez</strong>. Eso no es descenso de gradiente, y no se comporta como el ' +
    'descenso de gradiente: no baja hacia un mínimo, <strong>gira</strong>.');

  p.text('El ejemplo más pequeño posible ya lo enseña. Sea $V(x, y) = xy$, donde el primer jugador ' +
    'mueve $x$ para minimizar y el segundo mueve $y$ para maximizar. El equilibrio es obvio: el ' +
    'origen. Mira lo que pasa al aplicar los dos pasos simultáneamente.');

  p.formulas([
    'x_{n+1} = x_n - \\eta\\, y_n, \\qquad y_{n+1} = y_n + \\eta\\, x_n',
    'x_{n+1}^2 + y_{n+1}^2 = (1 + \\eta^2)\\,(x_n^2 + y_n^2)'
  ], 'el paso simultáneo, y lo que le pasa al radio');

  p.text('La segunda línea sale de desarrollar los cuadrados de la primera: los términos cruzados se ' +
    'cancelan y queda ese factor. Así que la distancia al equilibrio se multiplica por ' +
    '$\\sqrt{1 + \\eta^2}$ <strong>en cada paso, siempre, para cualquier $\\eta > 0$</strong>. No hay ' +
    'un paso pequeño que salve la situación: sólo lo hace más lento.');

  p.demo({
    title: 'La espiral del paso simultáneo',
    intro: 'El punto empieza en (1, 0) y se le aplican los dos pasos a la vez. La cruz es el equilibrio. Cambia el tamaño del paso y mira que la espiral se abre siempre, por pequeño que lo pongas.',
    predice: 'En descenso de gradiente normal, un paso más pequeño acaba convergiendo. Aquí, ¿crees que un paso más pequeño llegará a converger, o sólo tardará más en escaparse?',
    build: function (host) {
      var eta = 0.2, pasos = 40;
      function orbita() {
        var x = 1, y = 0, pts = [[x, y]], i;
        for (i = 0; i < pasos; i++) {
          var nx = x - eta * y, ny = y + eta * x;
          x = nx; y = ny; pts.push([x, y]);
        }
        return pts;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3, xmax: 3, ymin: -3, ymax: 3, height: 320, equal: true,
        aria: 'La trayectoria del paso simultáneo, que se aleja del equilibrio en espiral',
        draw: function (g) {
          var pts = orbita();
          g.point(0, 0, { color: 'axis', r: 4 });
          g.poly(pts, { color: 2, w: 2 });
          pts.forEach(function (q, i) { if (i % 4 === 0) g.point(q[0], q[1], { color: 2, r: 2.2 }); });
        }
      });
      function pinta() {
        var pts = orbita(), n = pts.length - 1;
        var r0 = 1, rn = Math.sqrt(pts[n][0] * pts[n][0] + pts[n][1] * pts[n][1]);
        var factor = Math.sqrt(1 + eta * eta);
        out.set('Paso $\\eta = ' + U.fmt(eta, 3) + '$ &nbsp;·&nbsp; el radio se multiplica por ' +
          '$\\sqrt{1 + \\eta^2} = ' + U.fmt(factor, 6) + '$ en cada paso.<br>' +
          'Tras ' + pasos + ' pasos: radio <strong>' + U.fmt(rn, 4) + '</strong>, y ' +
          '$' + U.fmt(factor, 6) + '^{' + pasos + '} = ' + U.fmt(Math.pow(factor, pasos), 4) + '$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (eta < 0.05 ? 'Con un paso diminuto la espiral se abre despacio, pero se abre: el factor es mayor que uno en cuanto $\\eta > 0$.'
            : 'Nunca es menor que uno. El equilibrio del origen es inestable para el paso simultáneo, por pequeño que sea.') +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'tamaño del paso η', min: 0.01, max: 0.6, step: 0.01, value: 0.2, dec: 2, on: function (v) { eta = v; pinta(); } });
      pinta();
    }
  });

  p.note('En [[av-sistemas-dinamicos|el lenguaje de los sistemas dinámicos]] esto es un ' +
    '<strong>foco inestable</strong>: la matriz del paso tiene autovalores complejos ' +
    '$1 \\pm i\\eta$, de módulo $\\sqrt{1 + \\eta^2} > 1$. La parte imaginaria es la que hace girar y ' +
    'el módulo mayor que uno es el que aleja. Un mínimo atrae; <strong>un punto de silla al que se ' +
    'llega jugando no</strong>.', null, 'Es un foco inestable');

  /* ---------------------------------------------------------------- */
  p.section('Entrenar uno de verdad');

  p.text('Con todo lo anterior se puede entrenar un GAN pequeño aquí mismo. El objetivo es una ' +
    'distribución con <strong>dos jorobas</strong>, y la pregunta honesta es si el generador ' +
    'aprenderá las dos.');

  p.demo({
    title: 'Un GAN de verdad, con dos modas que capturar',
    intro: 'En azul, la distribución que hay que imitar: dos campanas separadas. En naranja, lo que produce el generador. Las dos redes son diminutas y se entrenan de verdad, aquí, en unos segundos. Prueba varias semillas antes de sacar conclusiones.',
    predice: 'El generador tiene que repartir su salida entre dos jorobas separadas. ¿Crees que aprenderá las dos, o que le puede salir más barato quedarse con una?',
    build: function (host) {
      var N = 120, zd = 4, oc = 24, semilla = 1;
      var r, reales, Xr, G, D, oG, oD, unos, ceros, pasos, ld, lg, zFijo;
      function mlp(e, o, s) {
        return { W1: NN.param([e, o], r), b1: NN.param([1, o], r, 0.01),
          W2: NN.param([o, o], r), b2: NN.param([1, o], r, 0.01),
          W3: NN.param([o, s], r), b3: NN.param([1, s], r, 0.01) };
      }
      function pr(m) { return [m.W1, m.b1, m.W2, m.b2, m.W3, m.b3]; }
      function fw(m, x) {
        var h = NN.relu(NN.suma(NN.mm(x, m.W1), m.b1));
        h = NN.relu(NN.suma(NN.mm(h, m.W2), m.b2));
        return NN.suma(NN.mm(h, m.W3), m.b3);
      }
      function ruido() {
        var f = [], j, k;
        for (j = 0; j < N; j++) { var q = []; for (k = 0; k < zd; k++) q.push(r.real(-1, 1, 4)); f.push(q); }
        return NN.deFilas(f);
      }
      function reinicia() {
        r = U.rng(semilla);
        reales = [];
        for (var i = 0; i < N; i++) {
          var g = r.real(-1, 1, 4) + r.real(-1, 1, 4) + r.real(-1, 1, 4);
          reales.push([r.bool(0.5) ? -1.2 + 0.3 * g : 1.4 + 0.35 * g]);
        }
        Xr = NN.deFilas(reales);
        G = mlp(zd, oc, 1); D = mlp(1, oc, 1);
        oG = NN.Adam(pr(G), { lr: 0.012 }); oD = NN.Adam(pr(D), { lr: 0.004 });
        unos = NN.constante([N, 1], 1); ceros = NN.constante([N, 1], 0);
        /* El ruido que se dibuja se saca UNA vez y no se vuelve a tocar. Si se
           sacara en cada repintado saldría del mismo generador de azar que el
           entrenamiento, y entonces el resultado dependería de cuántas veces
           se haya repintado la pantalla: dos alumnos con la misma semilla
           verían cosas distintas. Además así se ve cómo se mueven los mismos
           puntos, que es lo que interesa. */
        zFijo = ruido();
        pasos = 0; ld = 0; lg = 0;
      }
      reinicia();
      function paso() {
        NN.limpia();
        var Ld = NN.suma(NN.entropiaCruzadaBinaria(NN.sigmoide(fw(D, Xr)), unos),
          NN.entropiaCruzadaBinaria(NN.sigmoide(fw(D, fw(G, ruido()))), ceros));
        NN.atras(Ld, pr(D)); oD.paso(); ld = Ld.v[0];
        NN.limpia();
        var Lg = NN.entropiaCruzadaBinaria(NN.sigmoide(fw(D, fw(G, ruido()))), unos);
        NN.atras(Lg, pr(G)); oG.paso(); lg = Lg.v[0];
        pasos++;
      }
      function muestra() {
        NN.limpia();
        var s = fw(G, zFijo), g = [], i;
        for (i = 0; i < N; i++) g.push(s.v[i]);
        return g;
      }
      function histo(datos) {
        var b = [], k;
        for (k = 0; k < 40; k++) b[k] = 0;
        datos.forEach(function (v) { var j = Math.floor((v + 3.5) / 7 * 40); if (j >= 0 && j < 40) b[j]++; });
        var m = Math.max.apply(null, b) || 1;
        var salida = [];
        for (k = 0; k < 40; k++) salida.push({ x: -3.5 + (k + 0.5) * 0.175, h: b[k] / m });
        return salida;
      }
      var gen = muestra();
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3.5, xmax: 3.5, ymin: 0, ymax: 1.15, height: 250, xlabel: 'x',
        aria: 'Histogramas de la distribución real de dos jorobas y de la que produce el generador',
        draw: function (g) {
          g.bars(histo(reales.map(function (q) { return q[0]; })), { color: 0, width: 0.175, fillAlpha: 0.45 });
          g.bars(histo(gen), { color: 2, width: 0.175, fillAlpha: 0.45 });
        }
      });
      function pinta() {
        gen = muestra();
        var m = U.sum(gen) / N;
        var sd = Math.sqrt(U.sum(gen.map(function (v) { return (v - m) * (v - m); })) / N);
        var izq = Math.round(100 * gen.filter(function (v) { return v < 0; }).length / N);
        out.set('Semilla ' + semilla + ' &nbsp;·&nbsp; paso ' + pasos + ' &nbsp;·&nbsp; ' +
          'pérdida del juez $' + U.fmt(ld, 3) + '$, del generador $' + U.fmt(lg, 3) + '$<br>' +
          'Salida: desviación <strong>' + U.fmt(sd, 3) + '</strong> &nbsp;·&nbsp; ' +
          '<strong>' + izq + ' %</strong> en la joroba izquierda, <strong>' + (100 - izq) + ' %</strong> en la derecha ' +
          '<span style="color:var(--ink-faint)">(lo suyo sería mitad y mitad)</span><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (pasos === 0 ? 'Sin entrenar todavía.'
            : (sd < 0.05 ? 'Colapso de modas: el generador produce prácticamente <strong>el mismo número siempre</strong>. Ha encontrado un punto que engaña al juez y se ha quedado ahí.'
              : (izq > 85 || izq < 15 ? 'Se ha quedado con una sola joroba y ha abandonado la otra: colapso parcial.'
                : 'Está repartiendo entre las dos jorobas, que es lo que se busca.'))) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 4, paso: paso, pinta: pinta, hasta: 800 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      W.chips(host, [1, 2, 3, 4, 5, 6, 7, 8].map(function (s) { return { label: 'semilla ' + s, value: String(s) }; }), {
        value: '1',
        on: function (v) { semilla = parseInt(v, 10); bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); }
      });
      pinta();
    }
  });

  p.note('Si has probado varias semillas habrás visto que <strong>lo normal es que salga mal</strong>. ' +
    'Recorriendo las ocho semillas del botón con 800 pasos cada una, <strong>siete acaban produciendo ' +
    'casi siempre el mismo número</strong>: dos se quedan en la joroba izquierda y cinco en la derecha. ' +
    'La octava conserva algo de anchura, pero coloca igualmente toda su salida en una sola joroba. ' +
    '<strong>Ninguna de las ocho aprende las dos.</strong> No es un fallo de esta implementación: es ' +
    '<strong>el colapso de modas</strong>, el problema característico del método.', 'warn', 'Lo normal es que salga mal');

  p.text('La razón se ve en la fórmula del juez: al generador le basta con encontrar <em>un</em> sitio ' +
    'donde el discriminador se equivoque. Nada en el objetivo le pide cubrir toda la distribución; ' +
    'cubrirla es lo que sale si el juego llega a su equilibrio, y el juego casi nunca llega.');

  p.comprueba('El discriminador de un GAN entrenado acaba contestando $0{,}5$ a casi todo. ¿Qué significa?', [
    { t: 'Que el generador va bien: sus datos son indistinguibles de los reales para ese juez', ok: true, por: 'Es justo lo que dice $D^* = \\frac{p}{p+q}$: si $p = q$, el mejor juez posible contesta $0{,}5$. Un discriminador confundido es la señal de que el generador ha alcanzado la distribución, no de que el juez sea malo.' },
    { t: 'Que el discriminador está mal entrenado y hay que entrenarlo más', ok: false, por: 'Puede pasar, pero no es lo que indica ese valor por sí solo. Si $p = q$, ningún discriminador, por bien entrenado que esté, puede pasar de $0{,}5$: la información para distinguir no existe.' },
    { t: 'Que el generador ha colapsado a un solo punto', ok: false, por: 'El colapso da lo contrario: si el generador produce siempre el mismo número, al juez le resulta facilísimo separarlo de los datos reales y su salida se aleja mucho de $0{,}5$.' }
  ]);

  p.util('Durante unos años los GAN fueron lo mejor que había para generar caras e imágenes, y de ahí ' +
    'salieron las primeras fotografías convincentes de personas que no existen. Hoy la mayor parte de ' +
    'la generación de imágenes usa [[ia-difusion|difusión]], que es mucho más estable de entrenar, ' +
    'pero la idea de la pérdida aprendida se ha quedado: se sigue usando un discriminador como parte ' +
    'de la pérdida en compresión de vídeo, en superresolución y en síntesis de voz, donde decir a ' +
    'mano en qué se parecen dos señales es igual de difícil que con las imágenes.');

  p.hist('El método lo publicaron en 2014 Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, ' +
    'David Warde-Farley, Sherjil Ozair, Aaron Courville y Yoshua Bengio, con el título ' +
    '<em>Generative Adversarial Nets</em>. La demostración de que el óptimo se alcanza cuando las dos ' +
    'distribuciones coinciden, y de que lo que se minimiza es la divergencia de Jensen-Shannon, está ' +
    'en el propio artículo: es de los pocos casos en que un método de aprendizaje profundo nació con ' +
    'su teoría hecha. La inestabilidad, en cambio, tardó años en entenderse, y buena parte de la ' +
    'investigación posterior consistió en cambiar la divergencia por otra que se portara mejor.');

  p.trampas([
    { e: 'Creer que el generador copia datos de entrenamiento', por: 'No los ve nunca. El generador sólo recibe ruido y el gradiente que le llega a través del discriminador; los datos reales los ve el juez, no él.' },
    { e: 'Pensar que un discriminador confundido es un discriminador malo', por: 'Si $p = q$, el óptimo <em>es</em> $0{,}5$ en todas partes. La confusión es la meta del juego, no un fallo.' },
    { e: 'Bajar el ritmo de aprendizaje esperando que converja', por: 'En el juego $xy$ el radio se multiplica por $\\sqrt{1+\\eta^2}$, que es mayor que uno para cualquier $\\eta > 0$. Un paso más pequeño sólo hace la espiral más lenta.' },
    { e: 'Juzgar un GAN por la pérdida', por: 'Las dos pérdidas suben y bajan mientras las redes se persiguen, y no miden la calidad: se puede tener una pérdida preciosa y un colapso total. Hay que mirar lo que produce.' },
    { e: 'Confundir el colapso de modas con un error de programación', por: 'Es una propiedad del objetivo: al generador le basta un punto que engañe al juez. Aquí se ve con siete de las ocho semillas, y el código está bien.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El mejor juez posible',
    level: 'basico',
    gen: function (r) {
      var pp = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), qq = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      return { p: pp, q: qq, d: pp / (pp + qq) };
    },
    ask: function (d) {
      return 'En un punto $x$, la densidad de los datos reales vale $' + U.fmt(d.p, 1) + '$ y la de los ' +
        'generados $' + U.fmt(d.q, 1) + '$. ¿Qué contesta ahí el discriminador óptimo? (tres decimales)';
    },
    fields: [{ name: 'd', label: 'D*(x)', w: 'tiny' }],
    sol: function (d) { return { d: U.round(d.d, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { var alReves = d.q / (d.p + d.q); return Math.abs(alReves - d.d) > 0.0005 && Math.abs(v.d - alReves) < 0.0005; }, msg: 'Has puesto la densidad de los falsos arriba. El discriminador estima la probabilidad de ser <em>real</em>, así que arriba va $p$.' }],
    hint: function () { return '$D^*(x) = \\frac{p(x)}{p(x)+q(x)}$: la proporción de real sobre el total en ese punto.'; },
    steps: function (d) {
      return ['$D^* = \\dfrac{' + U.fmt(d.p, 1) + '}{' + U.fmt(d.p, 1) + ' + ' + U.fmt(d.q, 1) + '} = \\dfrac{' + U.fmt(d.p, 1) + '}{' + U.fmt(d.p + d.q, 1) + '} = ' + U.fmt(d.d, 3) + '$',
        d.p === d.q ? 'Al ser iguales las dos densidades, sale exactamente $0{,}5$: ahí no hay nada que distinguir.'
          : (d.p > d.q ? 'Sale por encima de $0{,}5$ porque en ese punto hay más datos reales que falsos.'
            : 'Sale por debajo de $0{,}5$ porque en ese punto abundan los falsos.')];
    },
    answer: function (d) { return U.fmt(d.d, 3); }
  });

  p.exercise({
    title: 'El valor del juego',
    level: 'basico',
    gen: function (r) {
      var js = r.pick([0, 0.1, 0.2, 0.3, 0.5, 0.693]);
      return { js: js, v: -Math.log(4) + 2 * js };
    },
    ask: function (d) {
      return 'La divergencia de Jensen-Shannon entre los datos y lo que produce el generador vale $' +
        U.fmt(d.js, 3) + '$. Usando $V = -\\log 4 + 2 D_{JS}$, ¿cuánto vale el juego con el juez ' +
        'óptimo? (tres decimales)';
    },
    fields: [{ name: 'v', label: 'V', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { var sinDoble = -Math.log(4) + d.js; return Math.abs(sinDoble - d.v) > 0.0005 && Math.abs(v.v - sinDoble) < 0.0005; }, msg: 'Falta el factor 2 que multiplica a la divergencia.' }],
    hint: function () { return '$\\log 4 = 1{,}386$. Sustituye directamente.'; },
    steps: function (d) {
      return ['$V = -1{,}386 + 2\\cdot ' + U.fmt(d.js, 3) + ' = -1{,}386 + ' + U.fmt(2 * d.js, 3) + ' = ' + U.fmt(d.v, 3) + '$',
        d.js === 0 ? 'Con $D_{JS} = 0$ el generador ha clavado la distribución: es el mínimo posible del juego.'
          : (d.js > 0.69 ? 'Con $D_{JS} = \\log 2$ las dos distribuciones no comparten nada y $V$ llega a su máximo, $0$.'
            : 'Queda entre $-1{,}386$ y $0$, que es todo el recorrido posible del juego.')];
    },
    answer: function (d) { return U.fmt(d.v, 3); }
  });

  p.exercise({
    title: 'Cuánto se abre la espiral',
    level: 'medio',
    gen: function (r) {
      var eta = r.pick([0.05, 0.1, 0.2, 0.3, 0.5]), n = r.pick([10, 20, 50, 100]);
      var f = Math.sqrt(1 + eta * eta);
      return { eta: eta, n: n, f: f, radio: Math.pow(f, n) };
    },
    ask: function (d) {
      return 'En el juego $V(x,y) = xy$ con paso simultáneo y $\\eta = ' + U.fmt(d.eta, 2) + '$, el punto ' +
        'sale de una distancia $1$ del equilibrio. ¿Por cuánto se multiplica el radio en cada paso, y ' +
        'a qué distancia está tras ' + d.n + ' pasos? (cuatro decimales el factor, dos la distancia)';
    },
    fields: [{ name: 'f', label: 'factor por paso', w: 'tiny' }, { name: 'r', label: 'distancia final', w: 'tiny' }],
    sol: function (d) { return { f: U.round(d.f, 8), r: U.round(d.radio, 8) }; },
    dec: { f: 4, r: 2 },
    errores: [{ si: function (v, d) { var mal = 1 + d.eta * d.eta; return Math.abs(mal - d.f) > 0.00005 && Math.abs(v.f - mal) < 0.00005; }, msg: 'Ese es el factor del radio <em>al cuadrado</em>. El radio se multiplica por su raíz.' }],
    hint: function (d) { return 'El cuadrado del radio se multiplica por $1 + \\eta^2 = ' + U.fmt(1 + d.eta * d.eta, 4) + '$ en cada paso.'; },
    steps: function (d) {
      return ['Factor por paso: $\\sqrt{1 + ' + U.fmt(d.eta, 2) + '^2} = \\sqrt{' + U.fmt(1 + d.eta * d.eta, 4) + '} = ' + U.fmt(d.f, 4) + '$.',
        'Tras ' + d.n + ' pasos: $' + U.fmt(d.f, 4) + '^{' + d.n + '} = ' + U.fmt(d.radio, 2) + '$.',
        'Y como el factor es mayor que uno para cualquier $\\eta > 0$, esto se aleja siempre: no hay paso pequeño que lo arregle.'];
    },
    answer: function (d) { return U.fmt(d.f, 4) + ' y ' + U.fmt(d.radio, 2); }
  });

  p.exercise({
    title: 'Jensen-Shannon a mano',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([0.5, 0.6, 0.7, 0.8]);
      var pp = [a, 1 - a], qq = [1 - a, a];
      var m = [(pp[0] + qq[0]) / 2, (pp[1] + qq[1]) / 2], js = 0, i;
      for (i = 0; i < 2; i++) {
        js += 0.5 * pp[i] * Math.log(pp[i] / m[i]) + 0.5 * qq[i] * Math.log(qq[i] / m[i]);
      }
      return { a: a, js: js };
    },
    ask: function (d) {
      return 'Dos distribuciones sobre dos casos: $p = (' + U.fmt(d.a, 1) + ',\\ ' + U.fmt(1 - d.a, 1) +
        ')$ y $q = (' + U.fmt(1 - d.a, 1) + ',\\ ' + U.fmt(d.a, 1) + ')$. Calcula $D_{JS}(p \\Vert q)$ ' +
        'en nats, con $m$ la mezcla y logaritmos naturales. (cuatro decimales)';
    },
    fields: [{ name: 'j', label: 'D_JS', w: 'tiny' }],
    sol: function (d) { return { j: U.round(d.js, 8) }; },
    dec: 4,
    tol: 1e-4,
    hint: function () { return 'La mezcla es $m = \\frac{p+q}{2}$, que aquí sale $(0{,}5,\\ 0{,}5)$ por la simetría. Después, $\\tfrac12 D_{KL}(p\\Vert m) + \\tfrac12 D_{KL}(q\\Vert m)$.'; },
    steps: function (d) {
      return ['La mezcla es $m = (0{,}5,\\ 0{,}5)$: las dos distribuciones son simétricas.',
        '$D_{KL}(p \\Vert m) = ' + U.fmt(d.a, 1) + '\\ln\\frac{' + U.fmt(d.a, 1) + '}{0{,}5} + ' + U.fmt(1 - d.a, 1) + '\\ln\\frac{' + U.fmt(1 - d.a, 1) + '}{0{,}5}$, y por simetría $D_{KL}(q \\Vert m)$ vale lo mismo.',
        'Así que $D_{JS}$ coincide con ese valor: $' + U.fmt(d.js, 4) + '$ nats.',
        d.a === 0.5 ? 'Con $p = q$ sale exactamente $0$.' : 'Nunca pasa de $\\ln 2 = 0{,}6931$, que es el caso de distribuciones sin nada en común.'];
    },
    answer: function (d) { return U.fmt(d.js, 4); }
  });

  p.exercise({
    title: 'Diagnosticar un entrenamiento',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'el generador produce siempre casi el mismo dato, y el discriminador lo separa sin fallar', v: 'colapso', por: 'Es el colapso de modas: el generador encontró un punto que en su momento engañaba al juez y se quedó ahí. El juez aprende a separarlo enseguida, y su pérdida se hunde.' },
        { t: 'el discriminador contesta $0{,}5$ a casi todo y las muestras se parecen a los datos', v: 'bien', por: 'Es el equilibrio que se busca: si $p = q$, el óptimo es $0{,}5$ en todas partes. Un juez confundido con muestras buenas es la señal de éxito.' },
        { t: 'las dos pérdidas suben y bajan sin parar y las muestras cambian de aspecto cada pocos pasos', v: 'oscila', por: 'Es la espiral del paso simultáneo: el equilibrio es un punto de silla y el descenso-ascenso gira alrededor en vez de caer dentro.' },
        { t: 'el discriminador acierta casi siempre y el generador apenas mejora', v: 'juez', por: 'El juez ha ganado demasiado pronto: cuando separa perfectamente, el gradiente que le llega al generador se queda casi plano y deja de haber señal que seguir.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Durante el entrenamiento de un GAN se observa que ' + d.c.t + '. ¿Qué está pasando?'; },
    fields: [{ name: 'q', label: 'Diagnóstico', opts: [
      { t: 'colapso de modas', v: 'colapso' },
      { t: 'el equilibrio que se busca', v: 'bien' },
      { t: 'oscilación por el paso simultáneo', v: 'oscila' },
      { t: 'el discriminador ha ganado demasiado pronto', v: 'juez' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Piensa en qué dice $D^* = \\frac{p}{p+q}$ sobre lo que debería contestar el juez en cada situación.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un GAN sustituye la fórmula que mide el parecido por <strong>una segunda red que aprende a juzgar</strong>.',
    'El generador es un cambio de variable: deforma ruido hasta que la distribución de salida se parezca a la de los datos. Todo el azar entra por el ruido.',
    'Con el generador congelado, el mejor discriminador posible es $D^* = \\frac{p}{p+q}$, que vale $0{,}5$ donde real y falso son igual de probables.',
    'Sustituyéndolo, lo que se minimiza es $-\\log 4 + 2 D_{JS}(p \\Vert q)$: una distancia entre distribuciones que nadie escribió a mano.',
    'El paso simultáneo de descenso-ascenso no converge: en el juego $xy$ el radio se multiplica por $\\sqrt{1+\\eta^2}$, siempre mayor que uno. Es un foco inestable.',
    'El colapso de modas es lo normal, no la excepción: al generador le basta encontrar un punto que engañe al juez.'
  ]);
});
