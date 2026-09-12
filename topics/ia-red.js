/* Tema: Apilar neuronas */
Course.topic('ia-red', function (p) {

  p.puente('[[ia-sigmoide|Una neurona con sigmoide]] ya se puede entrenar, pero su frontera sigue siendo ' +
    'una recta: XOR sigue siendo imposible, como se demostró con el perceptrón. Este tema pone varias ' +
    'en fila y varias en paralelo, y para escribirlas todas a la vez hacen falta ' +
    '[[al-matrices|las matrices]]. Al final aparecerá una idea que viene de ' +
    '[[fn-integral-def|las sumas de Riemann]].');

  p.text('La palabra «capa» asusta menos de lo que parece. Una capa es <strong>varias neuronas mirando ' +
    'la misma entrada</strong>, cada una con sus propios pesos. Y como cada neurona hace un producto ' +
    'escalar, ponerlas juntas es exactamente multiplicar por una matriz.');

  /* ---------------------------------------------------------------- */
  p.section('Una capa es una matriz por un vector');

  p.formula('\\vec a = \\sigma\\bigl(W\\vec x + \\vec b\\bigr)',
    'una capa, entera',
    'Se lee: <em>«a vector es sigma de, uve doble por equis vector, más be vector»</em>.<br><br>Si la ' +
    'entrada tiene $n$ números y la capa tiene $m$ neuronas, entonces $W$ es una matriz $m \\times n$ ' +
    '—una fila por neurona, una columna por entrada—, $\\vec b$ tiene $m$ componentes y la salida ' +
    '$\\vec a$ también. La sigmoide se aplica <strong>componente a componente</strong>, no a la suma ' +
    'de todas.<br><br>Eso es todo. Una red es un puñado de estas, encadenadas: la salida de una es la ' +
    'entrada de la siguiente.');

  p.note('Aquí es donde paga el bloque de matrices. El producto $W\\vec x$ no es una notación bonita: es ' +
    'literalmente la operación que ejecuta una tarjeta gráfica miles de millones de veces por segundo. ' +
    'Cuando se dice que un modelo tiene setenta mil millones de parámetros, se está diciendo que las ' +
    'matrices $W$ de sus capas suman setenta mil millones de números.', 'ok', 'Por qué importaban las matrices');

  p.table(['Capa', 'Entradas', 'Neuronas', 'Forma de $W$', 'Parámetros con el sesgo'], [
    ['primera', '$n$', '$m$', '$m \\times n$', '$m\\,n + m$'],
    ['ejemplo: 784 → 128', '784', '128', '$128 \\times 784$', '100 480'],
    ['ejemplo: 128 → 10', '128', '10', '$10 \\times 128$', '1290']
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Sin la no linealidad, todo se derrumba');

  p.text('Antes de apilar conviene entender por qué hace falta la sigmoide en medio. Supón que la quitamos ' +
    'y encadenamos dos capas puramente lineales. Sale esto:');

  p.formula('W_2\\bigl(W_1\\vec x + \\vec b_1\\bigr) + \\vec b_2 = \\underbrace{\\bigl(W_2W_1\\bigr)}_{\\text{una sola matriz}}\\vec x + \\underbrace{\\bigl(W_2\\vec b_1 + \\vec b_2\\bigr)}_{\\text{un solo sesgo}}',
    'dos capas lineales son una capa lineal',
    'Se desarrolla con la propiedad distributiva del producto de matrices, que ya conoces.<br><br>El ' +
    'resultado es demoledor: por muchas capas lineales que se pongan, <strong>el conjunto sigue siendo ' +
    'una sola capa lineal</strong>, con matriz $W_2W_1$. Mil capas sin activación no pueden hacer nada ' +
    'que no haga una. La profundidad no aporta absolutamente nada.<br><br>La no linealidad entre capa y ' +
    'capa es lo único que impide esa simplificación, y por eso está ahí.');

  p.demo({
    title: 'Dos capas lineales, y la matriz que las resume',
    intro: 'Dos capas lineales con sus pesos a la vista. A la derecha, la matriz producto: comprueba que aplicar las dos capas y aplicar esa sola matriz dan el mismo resultado para cualquier entrada. Enciende la sigmoide y verás que la igualdad se rompe.',
    predice: 'Con la sigmoide apagada, ¿crees que la columna «dos capas» y la columna «una sola matriz» darán exactamente lo mismo, o solo parecido?',
    build: function (host) {
      var conSigmoide = false, x1 = 1, x2 = -1;
      var W1 = [[2, -1], [1, 3]], b1 = [0.5, -0.5];
      var W2 = [[1, 2], [-1, 1]], b2 = [0.2, 0.1];
      var out = W.mono(host, '');
      function sig(z) { return conSigmoide ? 1 / (1 + Math.exp(-z)) : z; }
      function porCapas(x) {
        var h = [sig(W1[0][0] * x[0] + W1[0][1] * x[1] + b1[0]),
                 sig(W1[1][0] * x[0] + W1[1][1] * x[1] + b1[1])];
        return [W2[0][0] * h[0] + W2[0][1] * h[1] + b2[0],
                W2[1][0] * h[0] + W2[1][1] * h[1] + b2[1]];
      }
      function producto() {
        var P = [[0, 0], [0, 0]], i, j, k;
        for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) {
          for (k = 0; k < 2; k++) P[i][j] += W2[i][k] * W1[k][j];
        }
        var c = [W2[0][0] * b1[0] + W2[0][1] * b1[1] + b2[0],
                 W2[1][0] * b1[0] + W2[1][1] * b1[1] + b2[1]];
        return { P: P, c: c };
      }
      function deUnaVez(x) {
        var R = producto();
        return [R.P[0][0] * x[0] + R.P[0][1] * x[1] + R.c[0],
                R.P[1][0] * x[0] + R.P[1][1] * x[1] + R.c[1]];
      }
      function pinta() {
        var R = producto(), x = [x1, x2];
        var a = porCapas(x), b = deUnaVez(x);
        var igual = Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
        var h = 'W1 = [ 2  -1 ]   b1 = ( 0,5 )      W2 = [  1  2 ]   b2 = ( 0,2 )\n' +
                '     [ 1   3 ]        ( -0,5 )          [ -1  1 ]        ( 0,1 )\n\n' +
                'producto W2·W1 = [ ' + U.fmt(R.P[0][0], 0) + '  ' + U.fmt(R.P[0][1], 0) + ' ]      sesgo combinado = ( ' + U.fmt(R.c[0], 2) + ' )\n' +
                '                 [ ' + U.fmt(R.P[1][0], 0) + '  ' + U.fmt(R.P[1][1], 0) + ' ]                        ( ' + U.fmt(R.c[1], 2) + ' )\n\n' +
                'entrada x = (' + U.fmt(x1, 2) + ', ' + U.fmt(x2, 2) + ')\n' +
                '──────────────────────────────────────────────\n' +
                'pasando por las dos capas : (' + U.fmt(a[0], 4) + ', ' + U.fmt(a[1], 4) + ')\n' +
                'con la matriz producto    : (' + U.fmt(b[0], 4) + ', ' + U.fmt(b[1], 4) + ')\n\n' +
                (igual ? '<span class="cr-ok">Idénticos. Las dos capas no hacían nada que no haga una sola matriz.</span>'
                       : '<span class="cr-dif">Ya no coinciden: la sigmoide de en medio impide juntar las dos capas en una.</span>');
        out.set(h);
      }
      W.chips(host, [{ label: 'sin sigmoide (capas lineales)', value: 0 }, { label: 'con sigmoide en medio', value: 1 }],
        { value: 0, on: function (v) { conSigmoide = !!v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'x₁', min: -3, max: 3, step: 0.1, value: 1, dec: 1, on: function (v) { x1 = v; pinta(); } });
      W.slider(fila, { label: 'x₂', min: -3, max: 3, step: 0.1, value: -1, dec: 1, on: function (v) { x2 = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Una red tiene diez capas y ninguna activación entre ellas. ¿Qué puede aprender?', [
    { t: 'Exactamente lo mismo que una sola capa lineal: la composición de diez matrices es una matriz', ok: true, por: 'El producto de matrices es asociativo, así que $W_{10}\\cdots W_1$ es una única matriz. Las diez capas tienen más parámetros, pero no más capacidad: describen el mismo conjunto de funciones.' },
    { t: 'Diez veces más cosas, porque tiene diez veces más parámetros', ok: false, por: 'Más parámetros no es más capacidad si todos ellos solo pueden producir funciones lineales. Las diez matrices se colapsan en una al multiplicarlas.' },
    { t: 'Nada: sin activación no se puede entrenar', ok: false, por: 'Se entrena perfectamente, y aprende la mejor función lineal. El problema no es entrenar, es que el techo es el de una sola capa.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('XOR, por fin');

  p.text('Con la activación puesta, dos capas bastan para el problema que derribó al perceptrón. La idea ' +
    'geométrica es sencilla: <strong>la capa oculta dibuja dos rectas</strong>, y la capa de salida ' +
    'combina de qué lado de cada una cae el punto. Una región que ninguna recta podía separar sí se ' +
    'puede describir como «a la derecha de esta y a la izquierda de aquella».');

  p.demo({
    title: 'Una red 2-2-1 aprendiendo XOR',
    intro: 'Cuatro puntos, los del XOR. Dos neuronas ocultas y una de salida, entrenadas aquí mismo. El fondo es lo que contesta la red; las dos líneas finas son las rectas que ha encontrado cada neurona oculta. Entrena y mira cómo las coloca.',
    predice: 'Una sola neurona no puede separar el XOR. Con dos rectas disponibles, ¿cómo crees que tendrán que colocarse para que la combinación funcione?',
    build: function (host) {
      var X = NN.deFilas([[0, 0], [0, 1], [1, 0], [1, 1]]);
      var Y = NN.t([4, 1], [0, 1, 1, 0]);
      var W1, b1, W2, b2, opt, pasos, perdida;
      function reinicia() {
        /* Semilla fija y elegida: con dos neuronas ocultas el XOR tiene
           minimos locales de verdad, y casi la mitad de los arranques se
           quedan atascados en 2 aciertos de 4. Este converge. */
        var r = U.rng(2);
        W1 = NN.param([2, 2], r, 1.2); b1 = NN.constante([2], 0);
        W2 = NN.param([2, 1], r, 1.2); b2 = NN.constante([1], 0);
        opt = NN.Adam([W1, b1, W2, b2], { lr: 0.12 });
        pasos = 0; perdida = 0;
      }
      reinicia();
      function paso() {
        NN.limpia();
        var h = NN.tanh(NN.suma(NN.mm(X, W1), b1));
        var pred = NN.sigmoide(NN.suma(NN.mm(h, W2), b2));
        var L = NN.entropiaCruzadaBinaria(pred, Y);
        NN.atras(L, [W1, b1, W2, b2]);
        opt.paso();
        perdida = L.v[0];
        pasos++;
      }
      function salida(x, y) {
        var h1 = Math.tanh(W1.v[0] * x + W1.v[2] * y + b1.v[0]);
        var h2 = Math.tanh(W1.v[1] * x + W1.v[3] * y + b1.v[1]);
        return 1 / (1 + Math.exp(-(W2.v[0] * h1 + W2.v[1] * h2 + b2.v[0])));
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 1.6, ymin: -0.6, ymax: 1.6, height: 320, equal: true,
        aria: 'Los cuatro puntos del XOR con la respuesta de la red al fondo y las dos rectas de las neuronas ocultas',
        draw: function (g) {
          var paso2 = 0.045, x, y;
          for (x = -0.6; x <= 1.6; x += paso2) {
            for (y = -0.6; y <= 1.6; y += paso2) {
              var q = salida(x, y);
              g.rect(x, y, paso2, paso2, { color: q > 0.5 ? 2 : 0, fill: q > 0.5 ? 2 : 0, fillAlpha: Math.abs(q - 0.5) * 0.55, w: 0 });
            }
          }
          /* las dos rectas donde cada neurona oculta vale cero */
          [0, 1].forEach(function (j) {
            var a = W1.v[j], bb = W1.v[j + 2], c = b1.v[j];
            if (Math.abs(bb) > 1e-6) g.fn(function (t) { return -(a * t + c) / bb; }, { color: 'ink', w: 1.4, dash: [5, 4] });
          });
          [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]].forEach(function (q) {
            g.point(q[0], q[1], { color: q[2] ? 2 : 0, r: 7 });
          });
        }
      });
      function pinta() {
        var bien = 0;
        [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]].forEach(function (q) {
          if ((salida(q[0], q[1]) > 0.5 ? 1 : 0) === q[2]) bien++;
        });
        out.set('Paso ' + pasos + ' &nbsp;·&nbsp; pérdida ' + U.fmt(perdida, 4) +
          ' &nbsp;·&nbsp; acierta <strong>' + bien + ' de los 4</strong><br>' +
          'Respuestas: ' + [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (q) {
            return '(' + q[0] + ',' + q[1] + ')→' + U.fmt(salida(q[0], q[1]), 2);
          }).join(' &nbsp; ') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (bien === 4 ? 'Resuelto. Las dos rectas discontinuas dejan los dos puntos de una clase en la franja de en medio y los de la otra fuera: eso es lo que ninguna recta sola podía hacer.'
            : 'Las dos rectas todavía se están colocando. Cada una es una neurona oculta, y la de salida combina de qué lado cae el punto respecto de cada una.') +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 6, paso: paso, pinta: pinta, hasta: 1200 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      pinta();
    }
  });

  p.note('Conviene saber que esta demo arranca desde unos pesos iniciales <strong>elegidos a ' +
    'propósito</strong>. Con solo dos neuronas ocultas, el XOR tiene mínimos locales reales: probando ' +
    'cuarenta arranques distintos, dieciocho se quedan atascados acertando dos de cuatro, con las dos ' +
    'rectas mal colocadas y la pérdida sin bajar de $0{,}34$. No es un defecto del entrenamiento sino ' +
    'del paisaje: hay valles de los que el gradiente no sabe salir. Con más neuronas de las justas, ' +
    'el problema prácticamente desaparece, y esa es una de las razones de que en la práctica se ' +
    'pongan de sobra.', 'warn', 'Casi la mitad de los arranques fallan');

  p.ejemplo({
    title: 'XOR a mano, sin entrenar nada',
    enunciado: 'Construir una red 2-2-1 con escalones que calcule XOR, sabiendo que $x_1 \\text{ XOR } x_2$ es «al menos uno, pero no los dos»: es decir, OR <em>y</em> NO-AND.',
    pasos: [
      { t: '<strong>La primera neurona oculta hace OR.</strong> Con $w = (1, 1)$ y $b = -0{,}5$: en $(0,0)$ da $-0{,}5$ y se apaga; en los otros tres da $0{,}5$ o $1{,}5$ y se enciende.', antes: 'Busca pesos y umbral que se enciendan salvo en el (0,0).' },
      { t: '<strong>La segunda hace NO-AND.</strong> Con $w = (-1, -1)$ y $b = 1{,}5$: en $(1,1)$ da $-0{,}5$ y se apaga; en los otros tres da $0{,}5$ o $1{,}5$ y se enciende.', antes: 'Ahora unos pesos que se apaguen solo en el (1,1).' },
      { t: '<strong>La tabla de la capa oculta.</strong> $(0,0) \\to (0,1)$, $(0,1) \\to (1,1)$, $(1,0) \\to (1,1)$, $(1,1) \\to (1,0)$. Fíjate en lo que ha pasado: los dos casos que deben dar 1 se han convertido <em>los dos</em> en $(1,1)$.', antes: 'Calcula qué sale de las dos neuronas para cada una de las cuatro entradas.' },
      { t: '<strong>Ahora sí es separable.</strong> En el nuevo plano hay que distinguir $(1,1)$ de $(0,1)$ y $(1,0)$, y eso sí lo hace una recta. La neurona de salida con $w = (1, 1)$ y $b = -1{,}5$ se enciende solo cuando las dos ocultas están a 1.', antes: 'Dibuja los tres puntos nuevos. ¿Hay una recta que los separe?' },
      { t: '<strong>Comprobación.</strong> $(0,0)\\to(0,1)\\to 0 + 1 - 1{,}5 < 0 \\to 0$ ✓. $(0,1)\\to(1,1)\\to 0{,}5 > 0 \\to 1$ ✓. $(1,0)$, igual ✓. $(1,1)\\to(1,0)\\to -0{,}5 < 0 \\to 0$ ✓.' }
    ],
    cierre: 'La capa oculta no ha «resuelto» el XOR: lo ha <strong>cambiado de sitio</strong>. Ha llevado los cuatro puntos a un plano nuevo en el que el problema ya es separable por una recta. Eso es lo que hace una capa oculta, siempre.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Con suficientes neuronas, cualquier función');

  p.text('Y ahora el resultado que da respaldo teórico a todo esto. Una red con <strong>una sola capa ' +
    'oculta</strong>, si se le permiten suficientes neuronas, puede aproximar cualquier función ' +
    'continua tanto como se quiera. Se llama teorema de aproximación universal, y su idea se entiende ' +
    'con algo que ya has hecho: <strong>aproximar un área con rectángulos</strong>.');

  p.text('Una sigmoide muy empinada es casi un escalón. Restando dos escalones desplazados sale un ' +
    'rectángulo. Y sumando rectángulos estrechos se aproxima cualquier curva, exactamente como en ' +
    '[[fn-integral-def|una suma de Riemann]]. Cada neurona oculta aporta un escalón; la capa de salida ' +
    'decide la altura de cada uno.');

  p.demo({
    title: 'Sumar escalones hasta que salga la curva',
    intro: 'La curva gris es la que hay que imitar. La red tiene una capa oculta con el número de neuronas que elijas, y se entrena aquí mismo. Con pocas se ve la escalera; con más, la escalera se afina hasta desaparecer.',
    predice: 'Cada neurona oculta aporta un escalón. Con tres neuronas, ¿cuántos tramos distintos crees que podrá tener la aproximación?',
    build: function (host) {
      var m = 3;
      var xs = [], ys = [], i;
      for (i = 0; i < 60; i++) {
        var x = -3 + i * 6 / 59;
        xs.push([x]);
        ys.push(Math.sin(x * 1.6) * 0.8 + 0.25 * x);
      }
      var X = NN.deFilas(xs), Y = NN.t([xs.length, 1], ys);
      var W1, b1, W2, b2, opt, pasos, perdida;
      function reinicia() {
        var r = U.rng(6);
        W1 = NN.param([1, m], r, 1.5); b1 = NN.param([m], r, 1.5);
        W2 = NN.param([m, 1], r, 0.7); b2 = NN.constante([1], 0);
        opt = NN.Adam([W1, b1, W2, b2], { lr: 0.06 });
        pasos = 0; perdida = 0;
      }
      reinicia();
      function paso() {
        NN.limpia();
        var h = NN.tanh(NN.suma(NN.mm(X, W1), b1));
        var pred = NN.suma(NN.mm(h, W2), b2);
        var L = NN.ecm(pred, Y);
        NN.atras(L, [W1, b1, W2, b2]);
        opt.paso();
        perdida = L.v[0];
        pasos++;
      }
      function red(x) {
        var s = b2.v[0], j;
        for (j = 0; j < m; j++) s += W2.v[j] * Math.tanh(W1.v[j] * x + b1.v[j]);
        return s;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3.2, xmax: 3.2, ymin: -2, ymax: 2, height: 300,
        xlabel: 'x', ylabel: 'y',
        aria: 'Una curva objetivo y la aproximación que construye una red con una capa oculta sumando escalones',
        draw: function (g) {
          g.fn(function (x) { return Math.sin(x * 1.6) * 0.8 + 0.25 * x; }, { color: 'axis', w: 3 });
          g.fn(red, { color: 2, w: 2.4 });
          for (var j = 0; j < m; j++) {
            (function (j) {
              g.fn(function (x) { return W2.v[j] * Math.tanh(W1.v[j] * x + b1.v[j]); }, { color: 1, w: 1, alpha: 0.5 });
            })(j);
          }
        }
      });
      function pinta() {
        out.set('Neuronas ocultas: <strong>' + m + '</strong> &nbsp;·&nbsp; paso ' + pasos +
          ' &nbsp;·&nbsp; error cuadrático medio ' + U.fmt(perdida, 5) + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          'Las líneas finas son la aportación de cada neurona por separado: cada una es un escalón suave. ' +
          'La curva naranja es su suma. ' +
          (m <= 3 ? 'Con tan pocas no hay escalones suficientes para seguir las curvas.'
            : (m <= 8 ? 'Ya se ajusta bastante: cada neurona se ha colocado donde hacía falta un cambio de pendiente.'
              : 'Con tantas, la aproximación es prácticamente exacta. Y esa es la idea del teorema.')) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 6, paso: paso, pinta: pinta, hasta: 3000 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      W.slider(W.row(host), {
        label: 'neuronas en la capa oculta', min: 1, max: 16, step: 1, value: 3, dec: 0,
        on: function (v) { m = v; bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); }
      });
      pinta();
    }
  });

  p.note('El teorema dice que <strong>existe</strong> una red que aproxima la función, no que se pueda ' +
    'encontrar entrenando, ni cuántas neuronas harán falta. Y a menudo hacen falta muchísimas: una ' +
    'capa oculta anchísima puede necesitar un número de neuronas que crece exponencialmente con la ' +
    'dimensión. En la práctica sale mucho más barato apilar varias capas estrechas que poner una sola ' +
    'inmensa, y eso —que la profundidad es más eficiente que la anchura— es lo que dio nombre al ' +
    'aprendizaje <em>profundo</em>.', 'warn', 'Lo que el teorema no promete');

  p.util('La estructura de este tema es, sin exagerar, la de cualquier modelo actual. Un modelo de ' +
    'lenguaje es una pila de bloques en los que lo que más pesa son capas densas exactamente como ' +
    'estas, con una no linealidad entre ellas. Cambian el tamaño, la activación concreta y lo que se ' +
    'pone alrededor, pero la operación que ejecuta la máquina la mayor parte del tiempo sigue siendo ' +
    'multiplicar una matriz por un vector y aplicar una función componente a componente.');

  p.hist('Que dos capas resolvían el XOR se sabía desde siempre; lo que no había era manera de ' +
    '<em>entrenarlas</em>, y ese es el motivo real del parón que siguió al libro de Minsky y Papert de ' +
    '1969. El teorema de aproximación universal lo demostró George Cybenko en 1989 para sigmoides, y ' +
    'Kurt Hornik lo generalizó en 1991 a cualquier activación no polinómica, lo que dejó claro que la ' +
    'sigmoide no tenía nada de especial: lo esencial era <strong>no ser un polinomio</strong>. Y en ' +
    'ese mismo momento ya existía desde 1986 la manera de entrenar estas redes, que es el tema ' +
    'siguiente.');

  p.trampas([
    { e: 'Apilar capas sin activación entre ellas', por: 'Se colapsan en una sola matriz: diez capas lineales no pueden hacer nada que no haga una. La activación es lo único que lo impide.' },
    { e: 'Aplicar la sigmoide a la suma de todas las neuronas', por: 'Se aplica componente a componente: cada neurona tiene su propia salida. Aplicarla a la suma tiraría toda la información de la capa.' },
    { e: 'Confundir el número de capas con el de neuronas', por: 'Una red 2-2-1 tiene dos capas de pesos y tres neuronas en total. Lo que se cuenta como «profundidad» son las capas, no las neuronas.' },
    { e: 'Leer el teorema como una promesa práctica', por: 'Dice que la red existe, no que el entrenamiento la encuentre ni que quepa en un ordenador. Con muchas variables, el número de neuronas necesario puede dispararse.' },
    { e: 'Creer que la capa oculta resuelve el problema', por: 'Lo traslada: lleva los datos a un espacio nuevo donde ya son separables por una recta. En XOR, convierte los dos casos positivos en el mismo punto.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántos parámetros tiene una capa',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([4, 10, 64, 128, 784]), m = r.pick([8, 16, 32, 128, 256]);
      return { n: n, m: m, pesos: n * m, total: n * m + m };
    },
    ask: function (d) {
      return 'Una capa densa recibe $' + d.n + '$ entradas y tiene $' + d.m + '$ neuronas. ¿Cuántos pesos ' +
        'tiene su matriz, y cuántos parámetros en total contando los sesgos?';
    },
    fields: [{ name: 'w', label: 'pesos', w: 'tiny' }, { name: 't', label: 'total', w: 'tiny' }],
    sol: function (d) { return { w: d.pesos, t: d.total }; },
    /* Si las entradas y las neuronas coinciden (128 está en las dos
       listas), sumar n en vez de m da el resultado correcto. */
    errores: [{ si: function (v, d) { return d.n !== d.m && v.t === d.pesos + d.n; }, msg: 'Hay un sesgo por <em>neurona</em>, no por entrada: se suman tantos como filas tiene la matriz.' }],
    hint: function () { return 'La matriz es de neuronas × entradas, y hay un sesgo por neurona.'; },
    steps: function (d) {
      return ['Pesos: $' + d.m + ' \\times ' + d.n + ' = ' + U.miles(d.pesos) + '$.',
        'Sesgos: uno por neurona, $' + d.m + '$.',
        'Total: $' + U.miles(d.pesos) + ' + ' + d.m + ' = ' + U.miles(d.total) + '$.'];
    },
    answer: function (d) { return U.miles(d.pesos) + ' pesos, ' + U.miles(d.total) + ' en total'; }
  });

  p.exercise({
    title: 'Una capa, a mano',
    level: 'basico',
    gen: function (r) {
      var W = [[r.nz(-3, 3), r.nz(-3, 3)], [r.nz(-3, 3), r.nz(-3, 3)]];
      var b = [r.int(-2, 2), r.int(-2, 2)];
      var x = [r.int(-3, 3), r.int(-3, 3)];
      return { W: W, b: b, x: x,
        z1: W[0][0] * x[0] + W[0][1] * x[1] + b[0],
        z2: W[1][0] * x[0] + W[1][1] * x[1] + b[1] };
    },
    ask: function (d) {
      return 'Una capa tiene $W = \\begin{pmatrix}' + d.W[0][0] + ' & ' + d.W[0][1] + ' \\\\ ' +
        d.W[1][0] + ' & ' + d.W[1][1] + '\\end{pmatrix}$ y $\\vec b = (' + d.b.join(',\\ ') +
        ')$. Calcula $W\\vec x + \\vec b$ para $\\vec x = (' + d.x.join(',\\ ') + ')$, <em>antes</em> de ' +
        'aplicar la activación.';
    },
    fields: [{ name: 'a', label: 'primera componente', w: 'tiny' }, { name: 'b', label: 'segunda', w: 'tiny' }],
    sol: function (d) { return { a: d.z1, b: d.z2 }; },
    errores: [{ si: function (v, d) { var c1 = d.W[0][0] * d.x[0] + d.W[1][0] * d.x[1] + d.b[0]; return c1 !== d.z1 && v.a === c1; }, msg: 'Has multiplicado por columnas. Cada <em>fila</em> de $W$ son los pesos de una neurona.' }],
    hint: function () { return 'Cada fila de la matriz, multiplicada escalarmente por $\\vec x$, y se le suma el sesgo de esa fila.'; },
    steps: function (d) {
      return ['Primera neurona: $' + d.W[0][0] + '\\cdot(' + d.x[0] + ') + ' + d.W[0][1] + '\\cdot(' + d.x[1] + ') + (' + d.b[0] + ') = ' + d.z1 + '$',
        'Segunda neurona: $' + d.W[1][0] + '\\cdot(' + d.x[0] + ') + ' + d.W[1][1] + '\\cdot(' + d.x[1] + ') + (' + d.b[1] + ') = ' + d.z2 + '$',
        'Después, la activación se aplica a cada una por separado.'];
    },
    answer: function (d) { return '(' + d.z1 + ', ' + d.z2 + ')'; }
  });

  p.exercise({
    title: 'Dos capas lineales, en una',
    level: 'medio',
    gen: function (r) {
      var A = [[r.nz(-3, 3), r.nz(-3, 3)], [r.nz(-3, 3), r.nz(-3, 3)]];
      var B = [[r.nz(-3, 3), r.nz(-3, 3)], [r.nz(-3, 3), r.nz(-3, 3)]];
      var P = [[0, 0], [0, 0]], i, j, k;
      for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) P[i][j] += B[i][k] * A[k][j];
      return { A: A, B: B, P: P };
    },
    ask: function (d) {
      return 'Sin activación, dos capas con $W_1 = \\begin{pmatrix}' + d.A[0][0] + ' & ' + d.A[0][1] +
        ' \\\\ ' + d.A[1][0] + ' & ' + d.A[1][1] + '\\end{pmatrix}$ y $W_2 = \\begin{pmatrix}' +
        d.B[0][0] + ' & ' + d.B[0][1] + ' \\\\ ' + d.B[1][0] + ' & ' + d.B[1][1] +
        '\\end{pmatrix}$ equivalen a una sola de matriz $W_2W_1$. Calcúlala.';
    },
    fields: [
      { name: 'a', label: 'fila 1, col 1', w: 'tiny' }, { name: 'b', label: 'fila 1, col 2', w: 'tiny' },
      { name: 'c', label: 'fila 2, col 1', w: 'tiny' }, { name: 'd', label: 'fila 2, col 2', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.P[0][0], b: d.P[0][1], c: d.P[1][0], d: d.P[1][1] }; },
    errores: [{ si: function (v, d) { var Q = d.A[0][0] * d.B[0][0] + d.A[0][1] * d.B[1][0]; return Q !== d.P[0][0] && v.a === Q; }, msg: 'Has multiplicado en el orden contrario. La segunda capa se aplica <em>después</em>, así que va a la izquierda: $W_2W_1$.' }],
    hint: function () { return 'Producto de matrices en el orden $W_2 W_1$: fila de la segunda por columna de la primera.'; },
    steps: function (d) {
      return ['$(1,1)$: $' + d.B[0][0] + '\\cdot' + d.A[0][0] + ' + ' + d.B[0][1] + '\\cdot' + d.A[1][0] + ' = ' + d.P[0][0] + '$',
        '$(1,2)$: $' + d.B[0][0] + '\\cdot' + d.A[0][1] + ' + ' + d.B[0][1] + '\\cdot' + d.A[1][1] + ' = ' + d.P[0][1] + '$',
        '$(2,1)$: $' + d.B[1][0] + '\\cdot' + d.A[0][0] + ' + ' + d.B[1][1] + '\\cdot' + d.A[1][0] + ' = ' + d.P[1][0] + '$',
        '$(2,2)$: $' + d.B[1][0] + '\\cdot' + d.A[0][1] + ' + ' + d.B[1][1] + '\\cdot' + d.A[1][1] + ' = ' + d.P[1][1] + '$',
        'Una sola matriz hace el trabajo de las dos capas: por eso sin activación la profundidad no aporta nada.'];
    },
    answer: function (d) { return '(' + d.P[0].join(', ') + '; ' + d.P[1].join(', ') + ')'; }
  });

  p.exercise({
    title: 'La capa oculta del XOR',
    level: 'medio',
    gen: function (r) {
      var casos = [[0, 0], [0, 1], [1, 0], [1, 1]];
      var x = r.pick(casos);
      var h1 = (x[0] + x[1] - 0.5) > 0 ? 1 : 0;          // OR
      var h2 = (-x[0] - x[1] + 1.5) > 0 ? 1 : 0;         // NO-AND
      var y = (h1 + h2 - 1.5) > 0 ? 1 : 0;
      return { x: x, h1: h1, h2: h2, y: y };
    },
    ask: function (d) {
      return 'En la red del ejemplo resuelto, la primera neurona oculta es $\\text{paso}(x_1 + x_2 - 0{,}5)$ ' +
        'y la segunda, $\\text{paso}(-x_1 - x_2 + 1{,}5)$; la salida es $\\text{paso}(h_1 + h_2 - 1{,}5)$. ' +
        'Calcula las tres para la entrada $(' + d.x.join(',\\ ') + ')$.';
    },
    fields: [
      { name: 'a', label: 'h₁', w: 'tiny' }, { name: 'b', label: 'h₂', w: 'tiny' }, { name: 'c', label: 'salida', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.h1, b: d.h2, c: d.y }; },
    hint: function () { return 'Cada una: sustituye, mira el signo, y contesta 1 si es positivo y 0 si no.'; },
    steps: function (d) {
      return ['$h_1 = \\text{paso}(' + d.x[0] + ' + ' + d.x[1] + ' - 0{,}5) = \\text{paso}(' + U.fmts(d.x[0] + d.x[1] - 0.5, 1) + ') = ' + d.h1 + '$',
        '$h_2 = \\text{paso}(-' + d.x[0] + ' - ' + d.x[1] + ' + 1{,}5) = \\text{paso}(' + U.fmts(-d.x[0] - d.x[1] + 1.5, 1) + ') = ' + d.h2 + '$',
        '$y = \\text{paso}(' + d.h1 + ' + ' + d.h2 + ' - 1{,}5) = ' + d.y + '$',
        'Y es lo que debe dar: XOR de $(' + d.x.join(', ') + ')$ vale ' + ((d.x[0] + d.x[1]) === 1 ? 1 : 0) + '.'];
    },
    answer: function (d) { return 'h₁ = ' + d.h1 + ', h₂ = ' + d.h2 + ', salida ' + d.y; }
  });

  p.exercise({
    title: 'Contar los parámetros de una red entera',
    level: 'avanzado',
    gen: function (r) {
      var n = r.pick([2, 4, 784]), h = r.pick([8, 16, 128]), s = r.pick([1, 3, 10]);
      return { n: n, h: h, s: s, c1: n * h + h, c2: h * s + s, total: n * h + h + h * s + s };
    },
    ask: function (d) {
      return 'Una red tiene $' + d.n + '$ entradas, una capa oculta de $' + d.h + '$ neuronas y una capa ' +
        'de salida de $' + d.s + '$. ¿Cuántos parámetros tiene cada capa y cuántos en total?';
    },
    fields: [
      { name: 'a', label: 'capa oculta', w: 'tiny' }, { name: 'b', label: 'capa de salida', w: 'tiny' },
      { name: 't', label: 'total', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.c1, b: d.c2, t: d.total }; },
    errores: [{ si: function (v, d) { return v.t === d.n * d.h + d.h * d.s; }, msg: 'Faltan los sesgos: uno por neurona en cada capa.' }],
    hint: function () { return 'Cada capa: entradas × neuronas, más un sesgo por neurona. Después se suman las dos.'; },
    steps: function (d) {
      return ['Oculta: $' + d.n + '\\times' + d.h + ' + ' + d.h + ' = ' + U.miles(d.c1) + '$.',
        'Salida: $' + d.h + '\\times' + d.s + ' + ' + d.s + ' = ' + U.miles(d.c2) + '$.',
        'Total: $' + U.miles(d.total) + '$.',
        'Todos ellos son el vector de coordenadas que el descenso de gradiente va a mover.'];
    },
    answer: function (d) { return U.miles(d.total) + ' en total'; }
  });

  p.keys([
    'Una capa es $\\sigma(W\\vec x + \\vec b)$: una matriz por un vector, más un sesgo, y la activación componente a componente.',
    'Sin activación, dos capas se multiplican en una sola matriz: la profundidad no aporta nada.',
    'Con una capa oculta cae XOR, porque la capa lleva los datos a un espacio nuevo donde ya son separables por una recta.',
    'El teorema de aproximación universal: una capa oculta suficientemente ancha aproxima cualquier función continua, sumando escalones como una suma de Riemann.',
    'El teorema dice que la red existe, no que se pueda encontrar ni que quepa: por eso en la práctica se apila en vez de ensanchar.',
    'Contar parámetros de una capa: entradas × neuronas, más un sesgo por neurona.'
  ]);
});
