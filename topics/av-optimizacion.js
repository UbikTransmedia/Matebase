/* Tema: Optimización y descenso de gradiente */
Course.topic('av-optimizacion', function (p) {

  p.puente('De [[fn-aplicaciones|una variable]] viene la receta: derivar, igualar a cero, comprobar. Del tema ' +
    'anterior, el gradiente y su propiedad clave: apunta cuesta arriba. Con las dos cosas se optimiza ' +
    'en varias variables, y cuando las ecuaciones no se dejan resolver, con la segunda sola se ' +
    'construye el algoritmo que entrena a las redes neuronales.');

  p.text('Ya sabes optimizar funciones de una variable: derivar, igualar a cero, comprobar. Con ' +
    '<strong>varias</strong> variables el planteamiento es el mismo, pero aparece un problema nuevo: ' +
    'las ecuaciones que salen suelen ser imposibles de resolver a mano. Y de esa dificultad nació el ' +
    'algoritmo que hoy entrena a todas las inteligencias artificiales del planeta.');

  p.section('Extremos con varias variables');

  p.text('En un máximo o un mínimo, la superficie está <strong>horizontal en todas las direcciones</strong>. ' +
    'Es decir, el gradiente se anula.');

  p.formula('\\nabla f(a,b) = \\vec{0} \\iff \\frac{\\partial f}{\\partial x} = 0 \\ \\text{ y } \\ \\frac{\\partial f}{\\partial y} = 0',
    'condición necesaria: punto crítico',
    'El $\\iff$ es «si y solo si» y $\\vec{0}$ es «el vector cero», el que tiene todas sus ' +
      'componentes nulas.<br><br>Se lee: <em>«el gradiente de efe en el punto a, be es el vector cero ' +
      'si y solo si la derivada parcial respecto de equis y la derivada parcial respecto de i griega ' +
      'valen las dos cero»</em>.<br><br>Es la versión con dos variables de «la derivada se anula»: en ' +
      'un máximo o un mínimo el terreno está llano <strong>en todas las direcciones a la vez</strong>, ' +
      'no solo en una.');

  p.text('Pero, igual que en una variable, que el gradiente se anule no basta. Aquí hay ' +
    '<strong>tres</strong> posibilidades en vez de dos, y la nueva es la interesante:');

  p.table(['Tipo', 'Cómo es', 'Ejemplo'],
    [['Mínimo', 'sube en todas las direcciones', '$x^2+y^2$'],
     ['Máximo', 'baja en todas las direcciones', '$-x^2-y^2$'],
     ['<strong>Punto de silla</strong>', 'sube en unas y baja en otras', '$x^2-y^2$']]);

  p.note('El punto de silla no tiene equivalente en una variable, y es la razón de que optimizar en ' +
    'muchas dimensiones sea difícil. En espacios de millones de dimensiones —como los de una red ' +
    'neuronal— los puntos de silla son muchísimo más abundantes que los mínimos.', 'warn');

  p.comprueba('En $f(x, y) = x^2 - y^2$ el gradiente se anula en $(0, 0)$, y $f(0, 0) = 0$. ¿Es un mínimo?', [
    { t: 'Sí: el gradiente es cero y en $x$ la función sube', ok: false, por: 'Sube por el eje $x$, pero por el eje $y$ baja: $f(0, 1) = -1 < 0$. Un mínimo tiene que subir en <em>todas</em> las direcciones.' },
    { t: 'No: es un punto de silla', ok: true, por: 'Sube en unas direcciones y baja en otras. Gradiente cero es condición necesaria, no suficiente, igual que $f\'(a) = 0$ en una variable.' },
    { t: 'No se puede saber sin la segunda derivada', ok: false, por: 'Aquí se puede saber probando dos direcciones: $f(1, 0) = 1 > 0$ y $f(0, 1) = -1 < 0$. Con eso ya no puede ser ni mínimo ni máximo.' }
  ]);

  p.ejemplo({
    title: 'Un mínimo a mano y después a pasitos',
    enunciado: 'Hallar el mínimo de $f(x, y) = x^2 + y^2 - 2x - 4y + 5$. Después, aplicar dos pasos de descenso de gradiente desde $(0, 0)$ con $\\eta = 0{,}25$.',
    pasos: [
      { t: '<strong>Punto crítico.</strong> $f_x = 2x - 2 = 0$ y $f_y = 2y - 4 = 0$: el único candidato es $(1, 2)$.', antes: 'Dos parciales, dos ecuaciones. ¿Qué punto sale?' },
      { t: '<strong>Tipo.</strong> Completando cuadrados, $f = (x - 1)^2 + (y - 2)^2$: suma de dos cuadrados, sube en todas las direcciones. Mínimo, con valor $f(1, 2) = 0$.', antes: 'Escribe $f$ como suma de cuadrados. ¿Qué signo tiene cada uno?' },
      { t: '<strong>Primer paso.</strong> En $(0, 0)$, $\\nabla f = (-2, -4)$. Nuevo punto: $(0, 0) - 0{,}25\\cdot(-2, -4) = (0{,}5,\\ 1)$. Se ha movido hacia el mínimo: contra el gradiente.', antes: 'El gradiente en el origen apunta hacia fuera del cuenco. ¿Hacia dónde da el paso?' },
      { t: '<strong>Segundo paso.</strong> En $(0{,}5, 1)$, $\\nabla f = (-1, -2)$. Nuevo punto: $(0{,}5, 1) + 0{,}25\\cdot(1, 2) = (0{,}75,\\ 1{,}5)$. La distancia a $(1, 2)$ se ha vuelto a reducir a la mitad.' },
      { t: '<strong>Por qué a la mitad.</strong> Cada componente hace $x_{n+1} - 1 = (1 - 2\\eta)(x_n - 1) = \\frac{1}{2}(x_n - 1)$. Con $\\eta = 0{,}5$ llegaría en un paso; con $\\eta = 1$, el factor sería $-1$: oscilaría sin acercarse nunca.', antes: '¿Qué $\\eta$ llevaría al mínimo en un solo paso? ¿Y cuál haría que el punto oscilara?' }
    ],
    cierre: 'Con la fórmula, el mínimo sale exacto. Con los pasitos, sale aproximado pero sin resolver ninguna ecuación: es lo que se hace cuando hay un millón de variables y las ecuaciones no se dejan.'
  });

  /* ---------------------------------------------------------------- */
  p.section('El descenso de gradiente');

  p.text('Si no se puede resolver $\\nabla f = \\vec 0$, se hace lo siguiente: se empieza en un punto ' +
    'cualquiera y se <strong>baja</strong>. ¿Hacia dónde? Hacia donde más se baja, que es justo la ' +
    'dirección contraria al gradiente.');

  p.formula('\\vec{x}_{n+1} = \\vec{x}_n - \\eta\\,\\nabla f(\\vec{x}_n)', 'descenso de gradiente',
    'La letra $\\eta$ es la eta griega y aquí se lee «tasa de aprendizaje»: es lo largo que das cada ' +
      'paso.<br><br>Se dice: <em>«equis sub ene más uno es igual a equis sub ene menos eta por el ' +
      'gradiente de efe evaluado en equis sub ene»</em>.<br><br>Traducido: <em>«mi próxima posición es ' +
      'la actual, dando un paso de tamaño eta en sentido contrario al gradiente»</em>. En sentido ' +
      'contrario porque el gradiente apunta hacia donde <em>sube</em>, y aquí queremos bajar.');

  p.text('El número $\\eta$ es la <strong>tasa de aprendizaje</strong>: el tamaño del paso. Y elegirla ' +
    'bien es todo el arte del método.');

  p.demo({
    title: 'Bajar la ladera a pasitos',
    intro: 'Haz clic en cualquier punto para soltar la bola. Cambia el tamaño del paso y observa qué pasa cuando es demasiado pequeño o demasiado grande.',
    predice: 'En el cuenco alargado, ¿la bola irá recta al centro o hará zigzag? Y si subes $\\eta$ a 1,8, ¿llegará más rápido o dejará de llegar?',
    build: function (host, d) {
      var eta = 0.15, superficie = 'cuenco';
      var trayectorias = [];
      var sup = {
        cuenco: {
          f: function (x, y) { return 0.25 * x * x + 0.6 * y * y; },
          gx: function (x) { return 0.5 * x; }, gy: function (x, y) { return 1.2 * y; },
          t: 'f = 0{,}25x^2 + 0{,}6y^2', n: 'Un cuenco alargado. Con un solo mínimo, el descenso siempre acaba encontrándolo.'
        },
        silla: {
          f: function (x, y) { return 0.3 * (x * x - y * y); },
          gx: function (x) { return 0.6 * x; }, gy: function (x, y) { return -0.6 * y; },
          t: 'f = 0{,}3(x^2 - y^2)', n: 'Punto de silla en el origen: sube en una dirección y baja en la otra. El descenso lo esquiva y se va por el valle.'
        },
        doble: {
          f: function (x, y) { return 0.05 * Math.pow(x * x - 4, 2) + 0.4 * y * y; },
          gx: function (x) { return 0.2 * x * (x * x - 4); }, gy: function (x, y) { return 0.8 * y; },
          t: 'f = 0{,}05(x^2-4)^2 + 0{,}4y^2', n: 'Dos mínimos separados por una loma. A cuál se llega depende <em>solo</em> de dónde empieces: eso es un mínimo local.'
        }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -5, xmax: 5, ymin: -4, ymax: 4, height: 340, equal: true,
        onClick: function (x, y) { trayectorias.push([x, y]); plot.render(); },
        draw: function (g) {
          var S = sup[superficie];
          // curvas de nivel
          var ctx = g.ctx;
          var niveles = [];
          for (var k = 1; k <= 14; k++) niveles.push(k * 0.6);
          for (var px = 0; px < g.W; px += 3) {
            for (var py = 0; py < g.H; py += 3) {
              var x = g.iX(px), y = g.iY(py);
              var v = S.f(x, y);
              if (niveles.some(function (n) { return Math.abs(v - n) < 0.09; })) {
                ctx.fillStyle = g.color('axis'); ctx.globalAlpha = .35;
                ctx.fillRect(px, py, 3, 3); ctx.globalAlpha = 1;
              }
            }
          }
          trayectorias.forEach(function (P, idx) {
            var x = P[0], y = P[1], pts = [[x, y]];
            for (var s = 0; s < 60; s++) {
              var nx = x - eta * S.gx(x, y);
              var ny = y - eta * S.gy(x, y);
              if (!isFinite(nx) || Math.abs(nx) > 20 || Math.abs(ny) > 20) break;
              x = nx; y = ny;
              pts.push([x, y]);
            }
            g.path(pts, { color: idx % 6, w: 2 });
            pts.forEach(function (q, i) { if (i % 3 === 0) g.point(q[0], q[1], { color: idx % 6, r: 2.5 }); });
            g.point(P[0], P[1], { color: idx % 6, r: 5.5 });
            g.point(pts[pts.length - 1][0], pts[pts.length - 1][1], { color: idx % 6, r: 6, hollow: true });
          });
        }
      });
      function paint() {
        var S = sup[superficie];
        out.set('$' + S.t + '$ — ' + S.n + '<br>' +
          'Tasa de aprendizaje $\\eta = ' + U.fmt(eta, 3) + '$: ' +
          (eta < 0.05 ? '<strong>muy pequeña</strong>, avanza a paso de tortuga y necesita muchísimas iteraciones.'
            : (eta > 1.5 ? '<strong style="color:var(--bad)">demasiado grande</strong>: los pasos se pasan de largo y la trayectoria oscila o se dispara.'
              : 'razonable: converge en pocos pasos.')) +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Haz clic en el gráfico para soltar una bola.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'cuenco', value: 'cuenco' }, { label: 'punto de silla', value: 'silla' },
        { label: 'dos mínimos', value: 'doble' }
      ], { value: 'cuenco', on: function (v) { superficie = v; trayectorias = []; paint(); } });
      W.slider(W.row(host), { label: 'tasa de aprendizaje η', min: 0.01, max: 2, step: 0.01, value: 0.15, dec: 2, on: function (v) { eta = v; paint(); } });
      W.buttons(host, [{ t: '↺ Borrar trayectorias', on: function () { trayectorias = []; plot.render(); } }]);
      paint();
    }
  });

  p.table(['Si η es…', 'Qué pasa'],
    [['demasiado pequeña', 'converge, pero tarda una eternidad'],
     ['adecuada', 'baja rápido y se asienta en el mínimo'],
     ['demasiado grande', 'se pasa de largo, oscila y puede <strong>divergir</strong>']]);

  p.note('Ajustar $\\eta$ es el problema práctico número uno del aprendizaje automático. Hay métodos ' +
    'que la van cambiando sobre la marcha (Adam, RMSprop), pero la idea de fondo sigue siendo esta ' +
    'misma fórmula de dos líneas.', null);

  /* ---------------------------------------------------------------- */
  p.util('El descenso de gradiente es el algoritmo que entrena a todos los modelos de inteligencia ' +
    'artificial que existen, sin excepción. La idea es exactamente la de bajar una montaña con ' +
    'niebla: mirar la pendiente bajo los pies y dar un paso hacia abajo. Lo que cambia entre un ' +
    'modelo y otro es el tamaño del paso, que es el mismo dilema que ves aquí: demasiado corto y no ' +
    'llegas nunca, demasiado largo y te pasas de largo dando saltos.');

  p.section('Mínimos locales');

  p.text('El descenso de gradiente es <strong>ciego</strong>: solo ve la pendiente que tiene debajo. Si ' +
    'cae en un valle, se queda ahí aunque exista otro valle más profundo al otro lado de la loma.');

  p.text('En una variable esto se arregla estudiando la función entera. Con un millón de variables no ' +
    'se puede, así que se recurre a trucos: empezar en varios sitios distintos, añadir ruido aleatorio ' +
    '(<em>descenso estocástico</em>) o darle «inercia» a la bola para que atraviese lomas pequeñas.');

  /* ---------------------------------------------------------------- */
  p.section('Dónde está esto funcionando');

  p.text('Entrenar una red neuronal es exactamente esto y nada más que esto:');

  p.list([
    'Los <strong>parámetros</strong> de la red (pueden ser miles de millones) son las coordenadas del punto.',
    'La <strong>función de pérdida</strong> mide lo mal que la red predice: es la superficie que hay que bajar.',
    'El <strong>gradiente</strong> se calcula con la regla de la cadena, aplicada capa a capa. A eso se le llama <em>retropropagación</em>.',
    'Y se dan pasitos, millones de veces, hasta que la pérdida deja de bajar.'
  ]);

  p.note('Merece la pena detenerse aquí. Todo el aprendizaje profundo —los modelos de lenguaje, el ' +
    'reconocimiento de imágenes, los coches autónomos— se apoya en dos cosas que ya conoces: la ' +
    '<strong>regla de la cadena</strong> y la idea de que el gradiente apunta a la máxima pendiente. ' +
    'La potencia no viene de matemáticas más sofisticadas, sino de aplicar estas a una escala enorme.',
    'ok', 'De la regla de la cadena a la IA');

  p.hist('Cauchy propuso el método en 1847 para resolver sistemas de ecuaciones en astronomía. Durante ' +
    'más de un siglo fue una técnica numérica más, honesta y poco llamativa. En 1986 Rumelhart, Hinton ' +
    'y Williams lo combinaron con la retropropagación para entrenar redes neuronales, y aun así hicieron ' +
    'falta otros veinticinco años —y tarjetas gráficas— para que el método enseñara de lo que era capaz.');

  p.trampas([
    { e: '«Gradiente cero, luego mínimo»', por: 'Puede ser máximo o punto de silla. En $x^2 - y^2$ el gradiente se anula en el origen y no hay extremo.' },
    { e: 'Dar el paso <em>a favor</em> del gradiente', por: 'El gradiente apunta cuesta arriba. Sin el signo menos, el método sube en vez de bajar.' },
    { e: 'Subir $\\eta$ para ir más rápido', por: 'Hasta cierto punto sí; pasado el umbral, cada paso se pasa de largo y la trayectoria oscila o se dispara. En $ax^2$, el límite es $\\eta < 1/a$.' },
    { e: 'Creer que el descenso encuentra el mínimo global', por: 'Solo ve la pendiente bajo los pies: se queda en el primer valle. Con dos mínimos, a cuál llega depende de dónde empieza.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La dirección del paso',
    level: 'basico',
    gen: function (r) {
      var gx = r.nz(-6, 6), gy = r.nz(-6, 6), eta = r.pick([0.1, 0.2, 0.5]);
      return { gx: gx, gy: gy, eta: eta, dx: -eta * gx, dy: -eta * gy };
    },
    ask: function (d) { return 'En un punto, el gradiente de la función de pérdida vale $\\nabla f = (' + d.gx + ', ' + d.gy + ')$ y la tasa de aprendizaje es $\\eta = ' + U.fmt(d.eta, 1) + '$. ¿Cuánto se mueve cada coordenada en un paso de descenso de gradiente?'; },
    fields: [{ name: 'x', label: 'Δx', w: 'tiny' }, { name: 'y', label: 'Δy', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.dx, 6), y: U.round(d.dy, 6) }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.x + d.dx) < 1e-6 && Math.abs(v.y + d.dy) < 1e-6; }, msg: 'Eso es a favor del gradiente: cuesta arriba. Para bajar, el paso lleva signo menos.' }],
    hint: function () { return 'El paso es $-\\eta\\,\\nabla f$: en sentido contrario al gradiente y de tamaño proporcional a $\\eta$.'; },
    steps: function (d) { return ['$\\Delta\\vec x = -\\eta\\,\\nabla f = -' + U.fmt(d.eta, 1) + '\\cdot(' + d.gx + ', ' + d.gy + ') = (' + U.fmt(d.dx, 2) + ', ' + U.fmt(d.dy, 2) + ')$', 'Signo contrario al gradiente en cada componente: se baja por donde más se baja.']; },
    answer: function (d) { return '(' + U.fmt(d.dx, 2) + ', ' + U.fmt(d.dy, 2) + ')'; }
  });

  p.exercise({
    title: 'Punto crítico',
    level: 'medio',
    gen: function (r) {
      // f = a(x-p)^2 + b(y-q)^2  ->  critico en (p,q)
      var a = r.nz(-3, 3), b = r.nz(-3, 3);
      var pp = r.pm(0, 5), q = r.pm(0, 5);
      return { a: a, b: b, p: pp, q: q, tipo: (a > 0 && b > 0) ? 1 : ((a < 0 && b < 0) ? 2 : 3) };
    },
    ask: function (d) {
      return 'Halla el punto crítico de $f(x,y) = ' + d.a + '(x' + (d.p >= 0 ? '-' + d.p : '+' + (-d.p)) +
        ')^2 ' + (d.b >= 0 ? '+ ' + d.b : '- ' + (-d.b)) + '(y' + (d.q >= 0 ? '-' + d.q : '+' + (-d.q)) + ')^2$ ' +
        'y di de qué tipo es.';
    },
    fields: [
      { name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' },
      { name: 't', label: 'Tipo', opts: [{ t: 'mínimo', v: '1' }, { t: 'máximo', v: '2' }, { t: 'punto de silla', v: '3' }] }
    ],
    sol: function (d) { return { x: d.p, y: d.q, t: String(d.tipo) }; },
    tol: 1e-6,
    hint: function () { return 'Deriva parcialmente respecto a cada variable e iguala a cero. El tipo lo deciden los signos de los dos coeficientes.'; },
    steps: function (d) {
      return ['$\\dfrac{\\partial f}{\\partial x} = 2\\cdot' + d.a + '(x' + (d.p >= 0 ? '-' + d.p : '+' + (-d.p)) + ') = 0 \\Rightarrow x = ' + d.p + '$',
        '$\\dfrac{\\partial f}{\\partial y} = 2\\cdot' + d.b + '(y' + (d.q >= 0 ? '-' + d.q : '+' + (-d.q)) + ') = 0 \\Rightarrow y = ' + d.q + '$',
        'Punto crítico: $(' + d.p + ', ' + d.q + ')$.',
        d.tipo === 1 ? 'Los dos coeficientes son positivos: sube en las dos direcciones, es un <strong>mínimo</strong>.'
          : (d.tipo === 2 ? 'Los dos son negativos: baja en las dos direcciones, es un <strong>máximo</strong>.'
            : 'Tienen signos distintos: sube en una dirección y baja en la otra. Es un <strong>punto de silla</strong>.')];
    },
    answer: function (d) {
      return '(' + d.p + ', ' + d.q + '), ' + ['', 'mínimo', 'máximo', 'punto de silla'][d.tipo];
    }
  });

  p.exercise({
    title: 'Un paso de descenso de gradiente',
    level: 'medio',
    gen: function (r) {
      var eta = r.pick([0.1, 0.2, 0.25, 0.5]);
      var x = r.pm(1, 6), y = r.pm(1, 6);
      // f = x^2 + y^2  ->  grad = (2x, 2y)
      return { eta: eta, x: x, y: y, nx: x - eta * 2 * x, ny: y - eta * 2 * y };
    },
    ask: function (d) {
      return 'Para $f(x,y) = x^2 + y^2$, se parte del punto $(' + d.x + ', ' + d.y + ')$ con tasa de ' +
        'aprendizaje $\\eta = ' + U.fmt(d.eta, 2) + '$. ¿Dónde se cae tras <strong>un</strong> paso de ' +
        'descenso de gradiente? (cuatro decimales)';
    },
    fields: [{ name: 'x', label: 'x nueva', w: 'wide' }, { name: 'y', label: 'y nueva', w: 'wide' }],
    sol: function (d) { return { x: U.round(d.nx, 6), y: U.round(d.ny, 6) }; },
    tol: 3e-5,
    hint: function (d) { return 'El gradiente es $(2x, 2y) = (' + (2 * d.x) + ', ' + (2 * d.y) + ')$. Se resta $\\eta$ veces eso.'; },
    steps: function (d) {
      return ['$\\nabla f = (2x, 2y) = (' + (2 * d.x) + ', ' + (2 * d.y) + ')$',
        '$x_{1} = ' + d.x + ' - ' + U.fmt(d.eta, 2) + ' \\cdot ' + (2 * d.x) + ' = ' + U.fmt(d.nx, 4) + '$',
        '$y_{1} = ' + d.y + ' - ' + U.fmt(d.eta, 2) + ' \\cdot ' + (2 * d.y) + ' = ' + U.fmt(d.ny, 4) + '$',
        d.eta === 0.5 ? 'Con $\\eta = 0{,}5$ se llega al mínimo <em>en un solo paso</em>: es la tasa perfecta para esta función.'
          : (d.eta > 0.5 ? 'Con $\\eta > 0{,}5$ el paso se pasaría de largo y empezaría a oscilar.'
            : 'El punto se ha acercado al origen, que es el mínimo. Repitiendo, se acerca cada vez más.')];
    },
    answer: function (d) { return '(' + U.fmt(d.nx, 4) + ', ' + U.fmt(d.ny, 4) + ')'; }
  });

  p.exercise({
    title: '¿Converge o se dispara?',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick([1, 2, 3, 5]);        // f = a x^2 -> grad = 2a x -> x_{n+1} = (1-2a eta) x
      var eta = r.pick([0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.2]);
      var factor = Math.abs(1 - 2 * a * eta);
      return { a: a, eta: eta, factor: factor, converge: factor < 1 };
    },
    ask: function (d) {
      return 'Aplicamos descenso de gradiente a $f(x) = ' + d.a + 'x^2$ con $\\eta = ' + U.fmt(d.eta, 2) +
        '$. ¿Converge al mínimo o se dispara?';
    },
    fields: [{ name: 'r', label: 'El método', opts: [{ t: 'converge', v: 'si' }, { t: 'diverge', v: 'no' }] }],
    sol: function (d) { return { r: d.converge ? 'si' : 'no' }; },
    hint: function (d) { return 'Cada paso multiplica $x$ por $1 - 2a\\eta$. Converge si ese factor tiene valor absoluto menor que 1.'; },
    steps: function (d) {
      return ['$f\'(x) = ' + (2 * d.a) + 'x$, así que el paso es $x_{n+1} = x_n - ' + U.fmt(d.eta, 2) +
        ' \\cdot ' + (2 * d.a) + 'x_n = (1 - ' + U.fmt(2 * d.a * d.eta, 3) + ')\\,x_n$.',
        'El factor de contracción es $|1 - ' + U.fmt(2 * d.a * d.eta, 3) + '| = ' + U.fmt(d.factor, 4) + '$.',
        d.converge
          ? 'Es menor que 1: cada paso encoge $x$, así que <strong>converge</strong> al mínimo.'
          : 'Es mayor o igual que 1: cada paso <em>agranda</em> $x$, así que <strong>diverge</strong>. La tasa es demasiado grande.',
        'La condición general aquí es $\\eta < \\dfrac{1}{' + d.a + '} = ' + U.fmt(1 / d.a, 4) + '$.'];
    },
    answer: function (d) {
      return (d.converge ? 'Converge' : 'Diverge') + ' (factor ' + U.fmt(d.factor, 4) + ')';
    }
  });

  p.exercise({
    title: 'Ajustar una recta minimizando el error',
    level: 'avanzado',
    gen: function (r) {
      var m = r.int(1, 5), n = r.int(0, 5);
      var xs = [1, 2, 3, 4];
      var ys = xs.map(function (x) { return m * x + n; });
      var mm = r.int(1, 6), nn = r.int(0, 6);
      var err = 0;
      xs.forEach(function (x, i) { err += Math.pow(mm * x + nn - ys[i], 2); });
      return { m: m, n: n, xs: xs, ys: ys, mm: mm, nn: nn, err: err };
    },
    ask: function (d) {
      return 'Tenemos los datos $(1,' + d.ys[0] + ')$, $(2,' + d.ys[1] + ')$, $(3,' + d.ys[2] + ')$, ' +
        '$(4,' + d.ys[3] + ')$. La función de pérdida de una recta $y = mx+n$ es la suma de los ' +
        'errores al cuadrado. ¿Cuánto vale la pérdida para $m = ' + d.mm + '$ y $n = ' + d.nn + '$?';
    },
    fields: [{ name: 'e', label: 'Pérdida', w: 'wide' }],
    sol: function (d) { return { e: d.err }; },
    tol: 1e-6,
    hint: function () { return 'Para cada punto, calcula la predicción, réstale el valor real, eleva al cuadrado y suma.'; },
    steps: function (d) {
      var s = ['Para cada dato calculamos predicción menos valor real, al cuadrado:'];
      d.xs.forEach(function (x, i) {
        var pred = d.mm * x + d.nn;
        s.push('$x = ' + x + '$: predice $' + pred + '$, real $' + d.ys[i] + '$ → error² $= ' +
          Math.pow(pred - d.ys[i], 2) + '$');
      });
      s.push('Pérdida total: $' + d.err + '$.');
      s.push(d.err === 0
        ? 'La pérdida es cero: esa recta pasa exactamente por todos los puntos. Es el mínimo global.'
        : 'El descenso de gradiente iría ajustando $m$ y $n$ paso a paso hasta llegar a $m = ' + d.m +
          '$, $n = ' + d.n + '$, donde la pérdida vale 0.');
      return s;
    },
    answer: function (d) { return String(d.err); }
  });

  p.keys([
    'Punto crítico con varias variables: <strong>todas</strong> las derivadas parciales se anulan.',
    'Tres tipos: mínimo, máximo y <strong>punto de silla</strong> (esto último es nuevo).',
    'Descenso de gradiente: $\\vec{x}_{n+1} = \\vec{x}_n - \\eta\\nabla f$. Bajar por donde más se baja.',
    'La tasa $\\eta$ lo decide todo: pequeña es lenta, grande diverge.',
    'El método es ciego: puede quedarse en un mínimo local.',
    'Entrenar una red neuronal es esto aplicado a millones de parámetros, con la regla de la cadena calculando el gradiente.'
  ]);
});
