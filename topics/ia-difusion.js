/* Tema: Generar quitando ruido: difusión */
Course.topic('ia-difusion', function (p) {

  p.puente('De [[pe-normal|la normal]] viene que al sumar ruido las varianzas se suman; de ' +
    '[[av-edp|la ecuación del calor]], qué significa difundir; de [[av-markov|las cadenas de Markov]], ' +
    'un proceso en el que cada paso sólo mira al anterior; y de [[av-vectorial|el gradiente]], la ' +
    'dirección en la que algo crece más deprisa. El método que sale de juntarlo es, hoy, el que ' +
    'genera casi todas las imágenes que ves por ahí.');

  p.text('[[ia-gan|El GAN]] dejaba un problema: es un juego, y los juegos oscilan. La difusión cambia la ' +
    'estrategia por completo. En vez de enfrentar dos redes, define un camino <strong>de ida</strong> ' +
    'que destruye los datos poco a poco, y entrena una sola red para deshacer <strong>un solo paso</strong> ' +
    'de ese camino. No hay adversario, no hay juego, y por eso no oscila.');

  /* ---------------------------------------------------------------- */
  p.section('El camino de ida: romper despacio');

  p.text('Se coge un dato y se le añade un poco de ruido normal. Al resultado, otro poco. Y otra vez, ' +
    'unos cientos de veces, hasta que no queda nada del original: sólo ruido. Cada paso es minúsculo ' +
    'y perfectamente conocido, porque lo estamos haciendo nosotros.');

  p.formula('x_t = \\sqrt{1 - \\beta_t}\\; x_{t-1} + \\sqrt{\\beta_t}\\; \\varepsilon, \\qquad \\varepsilon \\sim N(0,1)',
    'un paso de ida',
    'Se lee: <em>«equis sub te es raíz de uno menos beta por equis sub te menos uno, más raíz de beta ' +
    'por épsilon»</em>.<br><br>El $\\beta_t$ es pequeño y dice cuánto ruido se mete en ese paso. Los dos ' +
    'coeficientes no son caprichosos: están elegidos para que <strong>la varianza total se mantenga en ' +
    'uno</strong>. Si $x_{t-1}$ tenía varianza 1, entonces $x_t$ tiene $(1-\\beta_t) + \\beta_t = 1$. Por ' +
    'eso uno lleva raíz de $1-\\beta$ y el otro raíz de $\\beta$.');

  p.text('Y ahora lo que hace práctico el método. Como sumar normales independientes da otra normal ' +
    'cuyas varianzas se suman, <strong>no hace falta recorrer el camino paso a paso</strong>: se puede ' +
    'saltar directamente al paso que se quiera.');

  p.formula('x_t = \\sqrt{\\overline{\\alpha}_t}\\; x_0 + \\sqrt{1 - \\overline{\\alpha}_t}\\; \\varepsilon, \\qquad \\overline{\\alpha}_t = \\prod_{s=1}^{t}(1-\\beta_s)',
    'el camino de ida entero, de un salto',
    'Donde $\\overline{\\alpha}_t$ es el producto de todos los $1-\\beta$ hasta ese momento.<br><br>' +
    'Esto es [[pe-normal|la suma de normales]] aplicada en cadena, y es lo que permite entrenar: para ' +
    'enseñarle a la red el paso 300 no hay que simular 300 pasos, se calcula directamente. Fíjate en ' +
    'que $\\overline{\\alpha}_t$ baja de 1 hacia 0: al principio queda casi todo el dato, al final casi ' +
    'sólo ruido.');

  p.demo({
    title: 'Romper una distribución poco a poco',
    intro: 'En azul, los datos originales: dos jorobas. Mueve el tiempo y mira cómo se convierten en una sola campana centrada. A la derecha del mando, cuánto queda del dato y cuánto es ya ruido.',
    predice: 'Al final del camino la distribución será una normal estándar, la misma para cualquier conjunto de datos. Si el final es siempre igual, ¿qué es lo que la red tendrá que aprender?',
    build: function (host) {
      var T = 50, betas = [], ab = [], acc = 1, i;
      for (i = 0; i < T; i++) { var b = 0.001 + (0.15 - 0.001) * i / (T - 1); betas.push(b); acc *= (1 - b); ab.push(acc); }
      var t = 0;
      var r = U.rng(31), N = 3000, datos = [];
      for (i = 0; i < N; i++) {
        var g = (r.real(-1, 1, 4) + r.real(-1, 1, 4) + r.real(-1, 1, 4));
        datos.push(r.bool(0.5) ? -1.2 + 0.3 * g : 1.4 + 0.35 * g);
      }
      /* El ruido de dibujo se saca una vez: si se sacara en cada repintado, lo
         que se ve dependeria de cuantas veces se haya repintado la pantalla. */
      var ruidoFijo = [];
      for (i = 0; i < N; i++) {
        var u1 = Math.max(1e-9, r.real(0, 1, 6)), u2 = r.real(0, 1, 6);
        ruidoFijo.push(Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
      }
      function histo(a, lo, hi, nb) {
        var b = [], k;
        for (k = 0; k < nb; k++) b[k] = 0;
        a.forEach(function (v) { var j = Math.floor((v - lo) / (hi - lo) * nb); if (j >= 0 && j < nb) b[j]++; });
        var m = Math.max.apply(null, b) || 1, paso = (hi - lo) / nb, s = [];
        for (k = 0; k < nb; k++) s.push({ x: lo + (k + 0.5) * paso, h: b[k] / m });
        return s;
      }
      function actual() {
        var a = Math.sqrt(ab[t]), c = Math.sqrt(1 - ab[t]);
        return datos.map(function (v, i) { return a * v + c * ruidoFijo[i]; });
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: 0, ymax: 1.15, height: 250, xlabel: 'x',
        aria: 'Histograma de los datos según avanza el camino de ida, de dos jorobas a una sola campana',
        draw: function (g) {
          g.bars(histo(actual(), -4, 4, 64), { color: 2, width: 0.125 });
          g.fn(function (x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) / 0.4; }, { color: 'axis', w: 2, dash: [6, 4] });
        }
      });
      function pinta() {
        var a = ab[t];
        out.set('Paso <strong>' + (t + 1) + '</strong> de ' + T + ' &nbsp;·&nbsp; ' +
          '$\\overline{\\alpha}_t = ' + U.fmt(a, 4) + '$<br>' +
          'Del dato queda $\\sqrt{\\overline{\\alpha}_t} = ' + U.fmt(Math.sqrt(a), 3) + '$ y de ruido hay ' +
          '$\\sqrt{1-\\overline{\\alpha}_t} = ' + U.fmt(Math.sqrt(1 - a), 3) + '$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (t < 8 ? 'Todavía se distinguen las dos jorobas: el ruido aún no las ha juntado.'
            : (t < 30 ? 'El valle entre las dos se está rellenando. Aquí es donde la red tiene más trabajo que hacer.'
              : 'Ya es prácticamente la normal estándar de la línea discontinua. De aquí no se puede sacar qué dato había: esa información se ha destruido.')) +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'paso del camino', min: 0, max: T - 1, step: 1, value: 0, dec: 0, on: function (v) { t = v; pinta(); } });
      pinta();
    }
  });

  p.note('Con los 50 pasos de la demo, $\\overline{\\alpha}$ acaba valiendo $0{,}0187$, así que del dato ' +
    'original sobrevive $\\sqrt{0{,}0187} = 0{,}137$: menos del 14 %. Los modelos de verdad usan del ' +
    'orden de mil pasos y lo dejan en prácticamente cero.', 'ok', 'Cuánto queda al final');

  /* ---------------------------------------------------------------- */
  p.section('Difundir es, literalmente, la ecuación del calor');

  p.text('Esto no es una analogía floja: es la misma ecuación. Añadir ruido normal a una variable ' +
    'equivale a <strong>convolucionar su densidad con una campana</strong>, y convolucionar con una ' +
    'campana que se ensancha es exactamente lo que hace ' +
    '[[av-edp|la solución de la ecuación del calor]].');

  p.formula('\\frac{\\partial p}{\\partial t} = k\\,\\frac{\\partial^2 p}{\\partial x^2} \\qquad \\Longleftrightarrow \\qquad \\sigma^2(t) = \\sigma_0^2 + 2kt',
    'la misma cosa, dicha de dos maneras',
    'Si se parte de una campana de anchura $\\sigma_0$ y se deja actuar la ecuación del calor un tiempo ' +
    '$t$, sale otra campana de anchura $\\sqrt{\\sigma_0^2 + 2kt}$. Y eso es lo mismo que haberle sumado ' +
    'ruido normal de varianza $2kt$.<br><br>Por eso la densidad de los datos se va <em>alisando</em> ' +
    'mientras avanza el camino de ida: los picos se aplanan y los valles se rellenan, que es lo que ' +
    '[[av-edp|allí]] hacía el calor con la temperatura de una barra.');

  p.demo({
    title: 'La misma curva por dos caminos',
    intro: 'La línea gruesa resuelve la ecuación del calor por diferencias finitas, sin saber nada de probabilidad. Los puntos son la campana que predice la fórmula de las varianzas. Avanza el tiempo: no se separan nunca.',
    predice: 'Una la calcula una EDP sobre una malla y la otra una fórmula de estadística. ¿Crees que coincidirán aproximadamente o exactamente?',
    build: function (host) {
      var n = 241, L = 12, dx = L / (n - 1), k = 0.5, s0 = 0.5;
      var tObjetivo = 0.4;
      function resuelve(tf) {
        var u = [], i, x;
        for (i = 0; i < n; i++) { x = -L / 2 + i * dx; u.push(Math.exp(-x * x / (2 * s0 * s0)) / (s0 * Math.sqrt(2 * Math.PI))); }
        var dt = 0.2 * dx * dx / k, pasos = Math.round(tf / dt), t;
        for (t = 0; t < pasos; t++) {
          var v = u.slice();
          for (i = 1; i < n - 1; i++) v[i] = u[i] + k * dt / (dx * dx) * (u[i + 1] - 2 * u[i] + u[i - 1]);
          u = v;
        }
        return { u: u, tf: pasos * dt };
      }
      var sol = resuelve(tObjetivo);
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -5, xmax: 5, ymin: 0, ymax: 0.9, height: 260, xlabel: 'x', ylabel: 'densidad',
        aria: 'La solución numérica de la ecuación del calor y la campana que predice la suma de varianzas, superpuestas',
        draw: function (g) {
          var i, pts = [];
          for (i = 0; i < n; i++) pts.push([-L / 2 + i * dx, sol.u[i]]);
          g.poly(pts, { color: 2, w: 3 });
          var s = Math.sqrt(s0 * s0 + 2 * k * sol.tf);
          for (i = 0; i < n; i += 8) {
            var x = -L / 2 + i * dx;
            g.point(x, Math.exp(-x * x / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)), { color: 0, r: 3 });
          }
        }
      });
      function pinta() {
        var s2 = s0 * s0 + 2 * k * sol.tf, s = Math.sqrt(s2), i, err = 0, pico = 0;
        for (i = 0; i < n; i++) {
          var x = -L / 2 + i * dx;
          var teo = Math.exp(-x * x / (2 * s2)) / (s * Math.sqrt(2 * Math.PI));
          if (teo > pico) pico = teo;
          err = Math.max(err, Math.abs(sol.u[i] - teo));
        }
        out.set('Tiempo $t = ' + U.fmt(sol.tf, 3) + '$ &nbsp;·&nbsp; ' +
          '$\\sigma^2 = ' + U.fmt(s0 * s0, 2) + ' + 2\\cdot' + U.fmt(k, 1) + '\\cdot' + U.fmt(sol.tf, 3) + ' = ' + U.fmt(s2, 4) + '$, ' +
          'o sea $\\sigma = ' + U.fmt(s, 4) + '$<br>' +
          '<strong>Diferencia máxima entre las dos curvas: ' + U.fmt(100 * err / pico, 3) + ' %</strong>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)"> — y lo poco que hay es error de la ' +
          'malla, no de la teoría: son la misma curva.</span>');
        plot.render();
      }
      W.slider(host, { label: 'tiempo', min: 0.05, max: 1.2, step: 0.05, value: 0.4, dec: 2, on: function (v) { sol = resuelve(v); pinta(); } });
      pinta();
    }
  });

  p.note('En [[av-edp|el tema de la ecuación del calor]] hay una trampa que dice que <em>no se puede ' +
    'rebobinar</em>: los modos altos se apagan a casi cero y recuperarlos exigiría amplificar ' +
    'cualquier ruido una barbaridad. Sigue siendo verdad, y no es una contradicción con lo que viene ' +
    'ahora. Un modelo de difusión <strong>no invierte la ecuación</strong>: no toma una imagen borrosa ' +
    'y calcula cuál era la nítida. Lo que hace es <strong>aprender de muchos ejemplos</strong> qué ' +
    'datos son plausibles, y usar eso para elegir una salida razonable entre las infinitas compatibles ' +
    'con el ruido que recibe. Por eso dos ejecuciones dan imágenes distintas: la información perdida ' +
    'no se recupera, <em>se inventa de forma verosímil</em>.', 'warn', 'Pero ¿no habíamos dicho que el calor no se rebobina?');

  /* ---------------------------------------------------------------- */
  p.section('Lo que se aprende: hacia dónde crece la densidad');

  p.text('Si no se puede invertir, ¿qué se entrena? Aquí aparece la idea que da nombre a toda una ' +
    'familia de métodos: en vez de aprender los datos, se aprende <strong>el gradiente del logaritmo ' +
    'de su densidad</strong>, que se llama <em>score</em>. Dicho en cristiano: en cada punto, hacia ' +
    'dónde habría que moverse para que el dato fuera más plausible.');

  p.formula('s(x) = \\nabla_x \\log p(x)',
    'el score: la cuesta arriba de la densidad',
    'Para una normal $N(\\mu, \\sigma^2)$ sale una fórmula que se puede escribir de memoria: ' +
    '$\\log p = -\\frac{(x-\\mu)^2}{2\\sigma^2} + \\text{cte}$, así que ' +
    '$s(x) = -\\frac{x-\\mu}{\\sigma^2}$.<br><br>Mira lo que dice: <strong>apunta siempre hacia la ' +
    'media</strong>, y con más fuerza cuanto más lejos estés. Seguir el score es subir la cuesta de la ' +
    'densidad, o sea, moverse hacia donde hay datos.');

  p.demo({
    title: 'El score de una distribución con dos jorobas',
    intro: 'Arriba la densidad, abajo su score. Mueve el punto y mira la flecha: dice hacia dónde hay que empujarlo para que sea más plausible. Fíjate en qué pasa justo en el valle entre las dos jorobas.',
    predice: 'En la cima de una joroba, ¿cuánto crees que valdrá el score: máximo, mínimo o cero?',
    build: function (host) {
      var x0 = 0.1;
      function dens(x) {
        return 0.5 * Math.exp(-(x + 1.2) * (x + 1.2) / (2 * 0.09)) / (0.3 * Math.sqrt(2 * Math.PI)) +
          0.5 * Math.exp(-(x - 1.4) * (x - 1.4) / (2 * 0.1225)) / (0.35 * Math.sqrt(2 * Math.PI));
      }
      function score(x) { var h = 1e-4; return (Math.log(dens(x + h) + 1e-300) - Math.log(dens(x - h) + 1e-300)) / (2 * h); }
      var out = W.readout(host, '');
      var arriba = W.plot(host, {
        xmin: -3, xmax: 3, ymin: 0, ymax: 1.3, height: 150, ylabel: 'p(x)',
        aria: 'La densidad de la mezcla de dos campanas con el punto elegido marcado',
        draw: function (g) {
          g.fn(dens, { color: 0, w: 2.6 });
          g.vline(x0, { color: 2, w: 1.6, dash: [4, 3] });
          g.point(x0, dens(x0), { color: 2, r: 4 });
        }
      });
      var abajo = W.plot(host, {
        xmin: -3, xmax: 3, ymin: -18, ymax: 18, height: 170, xlabel: 'x', ylabel: 'score',
        aria: 'El score, que es la derivada del logaritmo de la densidad, con su signo',
        draw: function (g) {
          g.hline(0, { color: 'axis', w: 1 });
          g.fn(score, { color: 3, w: 2.6 });
          var s = U.clamp(score(x0), -18, 18);
          g.vec(x0, 0, x0 + U.clamp(s / 9, -1.2, 1.2), 0, { color: 2, w: 3 });
        }
      });
      function pinta() {
        var s = score(x0);
        out.set('$x = ' + U.fmt(x0, 2) + '$ &nbsp;·&nbsp; densidad $' + U.fmt(dens(x0), 4) + '$ &nbsp;·&nbsp; ' +
          '<strong>score $' + U.fmt(s, 2) + '$</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (Math.abs(s) < 0.6 ? 'Prácticamente cero: o estás en la cima de una joroba, donde ya no se puede subir más, o en el punto muerto del valle.'
            : (s > 0 ? 'Positivo: empuja hacia la derecha, que es donde la densidad crece.'
              : 'Negativo: empuja hacia la izquierda.')) +
          ' El score se hace enorme en las colas, porque allí la densidad cae en picado y la cuesta es muy pronunciada.</span>');
        arriba.render(); abajo.render();
      }
      W.slider(host, { label: 'punto x', min: -3, max: 3, step: 0.05, value: 0.1, dec: 2, on: function (v) { x0 = v; pinta(); } });
      pinta();
    }
  });

  p.text('¿Y cómo se aprende el score sin conocer la densidad? Con un truco precioso: <strong>se le pide ' +
    'a la red que adivine el ruido que se añadió</strong>. Como nosotros hemos fabricado el camino de ' +
    'ida, sabemos exactamente cuál era ese ruido, así que hay etiqueta gratis para cada ejemplo. Y ' +
    'resulta que adivinar el ruido y calcular el score son la misma cosa cambiada de escala.');

  p.formulas([
    'L = \\bigl\\Vert \\varepsilon - \\varepsilon_\\theta(x_t, t) \\bigr\\Vert^2',
    '\\nabla_x \\log p_t(x_t) = -\\frac{\\varepsilon_\\theta(x_t, t)}{\\sqrt{1 - \\overline{\\alpha}_t}}'
  ], 'la pérdida, y por qué equivale al score');

  p.text('La primera línea es un error cuadrático corriente y molente: se entrena como cualquier otra ' +
    'red, sin adversario y sin juego. La segunda dice que lo aprendido <em>es</em> el score, dividido ' +
    'por lo que se ensanchó el ruido. Por eso a esto se le llama indistintamente «modelo de difusión» ' +
    'o «modelo basado en score».');

  /* ---------------------------------------------------------------- */
  p.section('El camino de vuelta');

  p.text('Con el score en la mano, generar es empezar en ruido puro y dar pasitos hacia arriba de la ' +
    'densidad, deshaciendo un escalón cada vez. A cada paso se le añade un poco de azar nuevo, y eso ' +
    'es lo que hace que cada ejecución dé un resultado distinto.');

  p.formula('x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}}\\left(x_t - \\frac{\\beta_t}{\\sqrt{1-\\overline{\\alpha}_t}}\\, \\varepsilon_\\theta(x_t, t)\\right) + \\sqrt{\\beta_t}\\, z',
    'un paso de vuelta',
    'El paréntesis quita la parte de ruido que la red ha detectado; el $\\frac{1}{\\sqrt{\\alpha_t}}$ ' +
    'reajusta la escala, y el último sumando vuelve a meter un poco de azar $z$.<br><br>Ese último ' +
    'término sorprende —¿por qué añadir ruido si lo que queremos es quitarlo?— y es justo lo que ' +
    'convierte el método en un muestreo de verdad: sin él, todas las ejecuciones caerían al mismo ' +
    'sitio, la joroba más alta, y volveríamos a tener el colapso de modas de [[ia-gan|las GAN]].');

  p.demo({
    title: 'Entrenar y muestrear de verdad',
    intro: 'Las dos jorobas en azul. Entrena la red unos cuantos pasos y pulsa «Muestrear» para recorrer el camino de vuelta desde ruido puro: lo generado sale en naranja. Prueba a muestrear antes de entrenar, y otra vez después.',
    predice: 'El GAN del tema anterior se quedaba con una sola joroba casi siempre. Esta red no tiene adversario. ¿Crees que cogerá las dos?',
    build: function (host) {
      var T = 50, N = 128, oc = 32, M, opt, pasos, perdida, generado, r, datos, semilla = 1;
      var betas = [], al = [], ab = [], i;
      for (i = 0; i < T; i++) { var b = 0.001 + (0.15 - 0.001) * i / (T - 1); betas.push(b); al.push(1 - b); }
      var acc = 1;
      for (i = 0; i < T; i++) { acc *= al[i]; ab.push(acc); }
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
      function nrm(g) { var u1 = Math.max(1e-9, g.real(0, 1, 6)), u2 = g.real(0, 1, 6); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
      function reinicia() {
        r = U.rng(semilla);
        datos = [];
        for (var j = 0; j < 2000; j++) { var g = nrm(r); datos.push(r.bool(0.5) ? -1.2 + 0.3 * g : 1.4 + 0.35 * g); }
        M = mlp(2, oc, 1); opt = NN.Adam(pr(M), { lr: 0.005 });
        pasos = 0; perdida = 0; generado = [];
      }
      reinicia();
      function paso() {
        var ent = [], obj = [], j;
        for (j = 0; j < N; j++) {
          var x0 = datos[Math.floor(r.real(0, datos.length - 0.001, 6))];
          var t = Math.floor(r.real(0, T - 0.001, 6)), e = nrm(r);
          ent.push([Math.sqrt(ab[t]) * x0 + Math.sqrt(1 - ab[t]) * e, t / T]);
          obj.push([e]);
        }
        NN.limpia();
        var L = NN.ecm(fw(M, NN.deFilas(ent)), NN.deFilas(obj));
        NN.atras(L, pr(M)); opt.paso();
        perdida = L.v[0]; pasos++;
      }
      /* El muestreo usa SU PROPIO generador de azar, con semilla fija: asi dos
         alumnos en el mismo paso de entrenamiento ven exactamente lo mismo. */
      function muestrea() {
        var g = U.rng(99), m = 300, out = [], j, t;
        for (j = 0; j < m; j++) out.push(nrm(g));
        for (t = T - 1; t >= 0; t--) {
          var ent = [];
          for (j = 0; j < m; j++) ent.push([out[j], t / T]);
          NN.limpia();
          var ep = fw(M, NN.deFilas(ent));
          for (j = 0; j < m; j++) {
            var z = t > 0 ? nrm(g) : 0;
            out[j] = (out[j] - betas[t] / Math.sqrt(1 - ab[t]) * ep.v[j]) / Math.sqrt(al[t]) + (t > 0 ? Math.sqrt(betas[t]) * z : 0);
          }
        }
        generado = out;
      }
      function histo(a, lo, hi, nb) {
        var b = [], k;
        for (k = 0; k < nb; k++) b[k] = 0;
        a.forEach(function (v) { var j = Math.floor((v - lo) / (hi - lo) * nb); if (j >= 0 && j < nb) b[j]++; });
        var mx = Math.max.apply(null, b) || 1, pa = (hi - lo) / nb, s = [];
        for (k = 0; k < nb; k++) s.push({ x: lo + (k + 0.5) * pa, h: b[k] / mx });
        return s;
      }
      var out2 = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: 0, ymax: 1.15, height: 250, xlabel: 'x',
        aria: 'Histograma de los datos reales y de lo que genera el modelo de difusión',
        draw: function (g) {
          g.bars(histo(datos, -4, 4, 48), { color: 0, width: 0.1667, fillAlpha: 0.45 });
          if (generado.length) g.bars(histo(generado, -4, 4, 48), { color: 2, width: 0.1667, fillAlpha: 0.45 });
        }
      });
      function pinta() {
        var txt = 'Paso ' + pasos + ' &nbsp;·&nbsp; pérdida $' + U.fmt(perdida, 4) + '$';
        if (generado.length) {
          var m = U.sum(generado) / generado.length;
          var sd = Math.sqrt(U.sum(generado.map(function (v) { return (v - m) * (v - m); })) / generado.length);
          var izq = Math.round(100 * generado.filter(function (v) { return v < 0; }).length / generado.length);
          txt += '<br>Generado: desviación <strong>' + U.fmt(sd, 3) + '</strong> &nbsp;·&nbsp; ' +
            '<strong>' + izq + ' %</strong> en la joroba izquierda, <strong>' + (100 - izq) + ' %</strong> en la derecha' +
            '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' +
            (pasos < 50 ? 'Casi sin entrenar: el camino de vuelta no sabe hacia dónde empujar, así que cada paso amplifica en vez de corregir y las muestras se van lejísimos. Fíjate en la desviación: sale del orden de 5 o 10, cuando la de los datos es 1,34.'
              : (izq > 25 && izq < 75 ? 'Ha cogido <strong>las dos jorobas</strong>, y en una proporción parecida a la real. Compara con el colapso del tema anterior.'
                : 'De momento se está inclinando por una de las dos. Entrena más pasos y vuelve a muestrear.')) +
            '</span>';
        } else {
          txt += '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Pulsa «Muestrear» para recorrer el camino de vuelta desde ruido puro.</span>';
        }
        out2.set(txt);
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 4, paso: paso, pinta: pinta, hasta: 1500 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: 'Muestrear', on: function () { muestrea(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      W.chips(host, [1, 2, 3, 4, 5, 6].map(function (s) { return { label: 'semilla ' + s, value: String(s) }; }), {
        value: '1',
        on: function (v) { semilla = parseInt(v, 10); bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); }
      });
      pinta();
    }
  });

  p.note('Con 1500 pasos de entrenamiento, esta red coge <strong>las dos jorobas con las seis semillas ' +
    'del botón</strong>, sin fallar ninguna: deja entre el 44 % y el 52 % a la izquierda, cuando lo ' +
    'ideal es el 50 %, y la desviación de lo generado queda entre 1,31 y 1,40 frente al 1,34 de los ' +
    'datos de verdad. Compáralo con [[ia-gan|el GAN del tema anterior]], que con ocho semillas no cogió ' +
    'las dos <em>ni una sola vez</em>. La diferencia no está en el tamaño de las redes, que son casi ' +
    'iguales: está en que aquí no hay ningún juego que pueda oscilar.', 'ok', 'Esta sí coge las dos');

  p.ejemplo({
    title: 'Cuánto dato queda a mitad de camino',
    enunciado: 'Un camino de ida con $\\beta$ constante e igual a $0{,}02$. Calcular $\\overline{\\alpha}_t$ tras 10, 50 y 100 pasos, y decir cuánto queda del dato original en cada caso.',
    pasos: [
      { t: '<strong>La fórmula.</strong> Con $\\beta$ constante, $\\overline{\\alpha}_t = (1-\\beta)^t = 0{,}98^t$.', antes: 'Es un producto de factores todos iguales. ¿Qué operación sale?' },
      { t: '<strong>A los 10 pasos.</strong> $0{,}98^{10} = 0{,}8171$, y del dato queda $\\sqrt{0{,}8171} = 0{,}904$: más del 90 %. Apenas se ha roto nada.', antes: 'Calcula la potencia y después su raíz.' },
      { t: '<strong>A los 50.</strong> $0{,}98^{50} = 0{,}3642$, y $\\sqrt{0{,}3642} = 0{,}604$. Ya queda sólo un 60 %, y las dos jorobas empiezan a mezclarse.' },
      { t: '<strong>A los 100.</strong> $0{,}98^{100} = 0{,}1326$, y $\\sqrt{0{,}1326} = 0{,}364$. Menos de un 37 %: el ruido manda.' },
      { t: '<strong>Qué enseña el patrón.</strong> Como es una potencia, el dato se va <em>exponencialmente</em>. Por eso los modelos reales usan del orden de mil pasos con $\\beta$ pequeñísimos: se quiere que la destrucción sea lenta y suave, para que cada paso sea fácil de deshacer.' }
    ],
    cierre: 'Elegir los $\\beta$ —lo que se llama el <em>calendario de ruido</em>— es una de las decisiones que más afecta a la calidad, precisamente por esto.'
  });

  p.comprueba('¿Por qué se le añade ruido nuevo en cada paso del camino de vuelta, si de lo que se trata es de quitarlo?', [
    { t: 'Porque sin él todas las ejecuciones acabarían en el mismo sitio y no habría variedad', ok: true, por: 'El camino de vuelta es un muestreo, no un cálculo. Ese azar es lo que hace que dos ejecuciones den resultados distintos, y lo que evita que todo caiga en la moda más alta, que es exactamente el colapso que sufrían las GAN.' },
    { t: 'Para compensar errores de la red y que no se acumulen', ok: false, por: 'Los errores de la red existen, pero el ruido no los corrige: si acaso los añade. Su papel es otro, y es estadístico.' },
    { t: 'Porque la ecuación del calor exige ruido para ser reversible', ok: false, por: 'La ecuación del calor no se hace reversible con nada: sigue destruyendo información. Lo que ocurre es que el modelo no la invierte, sino que elige una salida plausible entre muchas.' }
  ]);

  p.util('Casi todo lo que hoy genera imágenes a partir de texto funciona así. Dos detalles cambian ' +
    'respecto de lo que has visto: el ruido se quita sobre una imagen entera en vez de sobre un ' +
    'número, y para eso se usa una red con la estructura de ' +
    '[[ia-cnn|una convolucional]]; y para que obedezca a una frase se le pasa además el texto ' +
    'codificado, de modo que el score aprendido no es el de «imágenes plausibles» sino el de ' +
    '«imágenes plausibles dado este texto». Muchos sistemas, además, no difunden sobre los píxeles ' +
    'sino sobre el código comprimido de [[ia-autocodificador|un autocodificador]], que es mucho más ' +
    'barato: de ahí el nombre de <em>difusión latente</em>.');

  p.hist('La idea la publicaron en 2015 Jascha Sohl-Dickstein, Eric Weiss, Niru Maheswaranathan y Surya ' +
    'Ganguli, inspirándose explícitamente en la termodinámica del no equilibrio: de ahí el vocabulario ' +
    'de difusión. Durante cinco años apenas se usó. En 2019 Yang Song y Stefano Ermon desarrollaron la ' +
    'versión basada en el score, y en 2020 Jonathan Ho, Ajay Jain y Pieter Abbeel publicaron el ' +
    'trabajo que la hizo competitiva con las GAN en calidad de imagen. A partir de ahí el cambio fue ' +
    'rápido: la difusión desplazó a las GAN en generación de imágenes en poco más de dos años, en ' +
    'buena medida porque se entrena sin sobresaltos.');

  p.trampas([
    { e: 'Creer que el modelo invierte la ecuación del calor', por: 'No la invierte: la información destruida no vuelve. Aprende qué es plausible y elige una salida compatible con el ruido que recibe.' },
    { e: 'Pensar que hay que simular los mil pasos para entrenar', por: 'La forma cerrada $x_t = \\sqrt{\\overline{\\alpha}_t}x_0 + \\sqrt{1-\\overline{\\alpha}_t}\\varepsilon$ permite saltar a cualquier paso de golpe. Es lo que hace el método viable.' },
    { e: 'Confundir el score con la densidad', por: 'El score es la <em>derivada del logaritmo</em> de la densidad: dice hacia dónde crece, no cuánto vale. En la cima de una joroba la densidad es máxima y el score es cero.' },
    { e: 'Quitar el ruido del camino de vuelta', por: 'Se pierde la variedad: sin él el muestreo deja de ser muestreo y todo cae en la misma moda.' },
    { e: 'Suponer que hace falta una red enorme', por: 'La de esta página tiene dos capas de 32 neuronas y coge las dos jorobas. Lo que escala con el problema es el tamaño del dato, no la idea.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánto queda del dato',
    level: 'basico',
    gen: function (r) {
      var b = r.pick([0.01, 0.02, 0.05]), t = r.pick([10, 20, 50, 100]);
      var ab = Math.pow(1 - b, t);
      return { b: b, t: t, ab: ab, q: Math.sqrt(ab) };
    },
    ask: function (d) {
      return 'Un camino de ida con $\\beta = ' + U.fmt(d.b, 2) + '$ constante, tras $' + d.t + '$ pasos. ' +
        '¿Cuánto vale $\\overline{\\alpha}_t$, y qué fracción del dato original sobrevive? (cuatro y tres decimales)';
    },
    fields: [{ name: 'a', label: 'ᾱ', w: 'tiny' }, { name: 'q', label: 'fracción del dato', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.ab, 8), q: U.round(d.q, 8) }; },
    dec: { a: 4, q: 3 },
    errores: [{ si: function (v, d) { return Math.abs(v.q - d.ab) < 0.0005 && Math.abs(d.ab - d.q) > 0.0005; }, msg: 'La fracción que sobrevive es $\\sqrt{\\overline{\\alpha}_t}$, no $\\overline{\\alpha}_t$: en la fórmula el dato va multiplicado por la raíz.' }],
    hint: function () { return 'Con $\\beta$ constante, $\\overline{\\alpha}_t = (1-\\beta)^t$. Y el dato aparece multiplicado por su raíz cuadrada.'; },
    steps: function (d) {
      return ['$\\overline{\\alpha}_t = (1 - ' + U.fmt(d.b, 2) + ')^{' + d.t + '} = ' + U.fmt(1 - d.b, 2) + '^{' + d.t + '} = ' + U.fmt(d.ab, 4) + '$',
        'Fracción del dato: $\\sqrt{' + U.fmt(d.ab, 4) + '} = ' + U.fmt(d.q, 3) + '$',
        'Y de ruido hay $\\sqrt{1 - ' + U.fmt(d.ab, 4) + '} = ' + U.fmt(Math.sqrt(1 - d.ab), 3) + '$.'];
    },
    answer: function (d) { return U.fmt(d.ab, 4) + ' y ' + U.fmt(d.q, 3); }
  });

  p.exercise({
    title: 'El score de una normal',
    level: 'basico',
    gen: function (r) {
      var mu = r.int(-2, 2), sg = r.pick([0.5, 1, 2]), x = r.int(-3, 3);
      return { mu: mu, sg: sg, x: x, s: -(x - mu) / (sg * sg) };
    },
    ask: function (d) {
      return 'Para una normal de media $' + d.mu + '$ y desviación $' + U.fmt(d.sg, 1) + '$, ¿cuánto vale ' +
        'el score $s(x) = \\nabla_x \\log p(x)$ en $x = ' + d.x + '$? (dos decimales)';
    },
    fields: [{ name: 's', label: 's(x)', w: 'tiny' }],
    sol: function (d) { return { s: U.round(d.s, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { var sinSigno = (d.x - d.mu) / (d.sg * d.sg); return Math.abs(sinSigno - d.s) > 0.005 && Math.abs(v.s - sinSigno) < 0.005; }, msg: 'Te falta el signo menos. El score apunta <em>hacia</em> la media, así que si $x$ está a la derecha de $\\mu$ tiene que salir negativo.' }],
    hint: function () { return '$s(x) = -\\dfrac{x-\\mu}{\\sigma^2}$.'; },
    steps: function (d) {
      return ['$s(x) = -\\dfrac{' + d.x + ' - (' + d.mu + ')}{' + U.fmt(d.sg, 1) + '^2} = -\\dfrac{' + (d.x - d.mu) + '}{' + U.fmt(d.sg * d.sg, 2) + '} = ' + U.fmt(d.s, 2) + '$',
        d.x === d.mu ? 'Justo en la media el score es cero: es la cima, no hay cuesta que subir.'
          : (d.s > 0 ? 'Sale positivo porque $x$ está a la izquierda de la media: hay que empujar hacia la derecha.'
            : 'Sale negativo porque $x$ está a la derecha de la media: hay que empujar hacia la izquierda.')];
    },
    answer: function (d) { return U.fmt(d.s, 2); }
  });

  p.exercise({
    title: 'Las varianzas se suman',
    level: 'medio',
    gen: function (r) {
      var s0 = r.pick([0.5, 1, 1.5]), k = r.pick([0.5, 1, 2]), t = r.pick([0.2, 0.5, 1]);
      var s2 = s0 * s0 + 2 * k * t;
      return { s0: s0, k: k, t: t, s2: s2, s: Math.sqrt(s2) };
    },
    ask: function (d) {
      return 'Una campana de anchura $\\sigma_0 = ' + U.fmt(d.s0, 1) + '$ se deja difundir con $k = ' +
        U.fmt(d.k, 1) + '$ durante un tiempo $t = ' + U.fmt(d.t, 1) + '$. ¿Cuánto valen $\\sigma^2$ y ' +
        '$\\sigma$ al final? (tres decimales)';
    },
    fields: [{ name: 'v', label: 'σ²', w: 'tiny' }, { name: 's', label: 'σ', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.s2, 8), s: U.round(d.s, 8) }; },
    dec: 3,
    errores: [{ si: function (v, d) { var sinDoble = d.s0 * d.s0 + d.k * d.t; return Math.abs(sinDoble - d.s2) > 0.0005 && Math.abs(v.v - sinDoble) < 0.0005; }, msg: 'Falta el factor 2: la varianza que añade la difusión es $2kt$, no $kt$.' }],
    hint: function () { return '$\\sigma^2 = \\sigma_0^2 + 2kt$, y después la raíz.'; },
    steps: function (d) {
      return ['$\\sigma^2 = ' + U.fmt(d.s0, 1) + '^2 + 2\\cdot' + U.fmt(d.k, 1) + '\\cdot' + U.fmt(d.t, 1) + ' = ' + U.fmt(d.s0 * d.s0, 2) + ' + ' + U.fmt(2 * d.k * d.t, 2) + ' = ' + U.fmt(d.s2, 3) + '$',
        '$\\sigma = \\sqrt{' + U.fmt(d.s2, 3) + '} = ' + U.fmt(d.s, 3) + '$',
        'Las <em>varianzas</em> se suman, no las desviaciones: por eso hay que elevar al cuadrado antes y sacar la raíz después.'];
    },
    answer: function (d) { return U.fmt(d.s2, 3) + ' y ' + U.fmt(d.s, 3); }
  });

  p.exercise({
    title: 'Un paso de ida concreto',
    level: 'medio',
    gen: function (r) {
      var ab = r.pick([0.9, 0.64, 0.36, 0.16]), x0 = r.real(-2, 2, 1), e = r.real(-2, 2, 1);
      return { ab: ab, x0: x0, e: e, xt: Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * e };
    },
    ask: function (d) {
      return 'Con $\\overline{\\alpha}_t = ' + U.fmt(d.ab, 2) + '$, un dato $x_0 = ' + U.fmt(d.x0, 1) +
        '$ y un ruido $\\varepsilon = ' + U.fmt(d.e, 1) + '$, ¿cuánto vale $x_t$? (tres decimales)';
    },
    fields: [{ name: 'x', label: 'x_t', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.xt, 8) }; },
    dec: 3,
    errores: [{ si: function (v, d) { var sinRaiz = d.ab * d.x0 + (1 - d.ab) * d.e; return Math.abs(sinRaiz - d.xt) > 0.0005 && Math.abs(v.x - sinRaiz) < 0.0005; }, msg: 'Los coeficientes llevan raíz cuadrada: son $\\sqrt{\\overline{\\alpha}_t}$ y $\\sqrt{1-\\overline{\\alpha}_t}$, no $\\overline{\\alpha}_t$ y $1-\\overline{\\alpha}_t$.' }],
    hint: function (d) { return '$\\sqrt{' + U.fmt(d.ab, 2) + '} = ' + U.fmt(Math.sqrt(d.ab), 3) + '$ y $\\sqrt{1-' + U.fmt(d.ab, 2) + '} = ' + U.fmt(Math.sqrt(1 - d.ab), 3) + '$.'; },
    steps: function (d) {
      return ['$x_t = ' + U.fmt(Math.sqrt(d.ab), 3) + '\\cdot(' + U.fmt(d.x0, 1) + ') + ' + U.fmt(Math.sqrt(1 - d.ab), 3) + '\\cdot(' + U.fmt(d.e, 1) + ')$',
        '$= ' + U.fmt(Math.sqrt(d.ab) * d.x0, 3) + ' + ' + U.fmt(Math.sqrt(1 - d.ab) * d.e, 3) + ' = ' + U.fmt(d.xt, 3) + '$',
        'Comprueba que los cuadrados de los dos coeficientes suman uno: así la varianza se mantiene.'];
    },
    answer: function (d) { return U.fmt(d.xt, 3); }
  });

  p.exercise({
    title: 'Qué se rompe si se cambia algo',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'se quita el ruido $z$ del camino de vuelta', v: 'variedad', por: 'El muestreo deja de serlo: todas las ejecuciones siguen la misma trayectoria y caen en la misma moda. Es volver al colapso que tenían las GAN.' },
        { t: 'se ponen los $\\beta$ tan grandes que en dos pasos ya es ruido puro', v: 'dificil', por: 'Cada paso pasa a ser un salto enorme, y deshacerlo es tan difícil como generar de cero. La gracia del método es que cada escalón sea pequeño.' },
        { t: 'se entrena la red para predecir $x_0$ en vez de $\\varepsilon$', v: 'vale', por: 'Es una reformulación equivalente y se usa en la práctica: conocidos $x_t$ y $\\overline{\\alpha}_t$, se pasa de una a otra despejando. Cambia el condicionamiento numérico, no el método.' },
        { t: 'se usa el mismo $t$ para todos los ejemplos de cada lote', v: 'vale', por: 'Se puede: sólo hace falta que a lo largo del entrenamiento se cubran todos los pasos. Mezclar $t$ dentro del lote reduce la varianza del gradiente, pero no es imprescindible.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un modelo de difusión, ' + d.c.t + '. ¿Qué pasa?'; },
    fields: [{ name: 'q', label: 'Consecuencia', opts: [
      { t: 'se pierde la variedad: todo cae en la misma moda', v: 'variedad' },
      { t: 'cada paso se vuelve tan difícil como generar de cero', v: 'dificil' },
      { t: 'sigue funcionando: es una variante legítima', v: 'vale' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate si lo que cambia afecta a <em>lo que se aprende</em> o sólo a <em>cómo se escribe</em>.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'El camino de ida añade ruido normal poco a poco hasta dejar ruido puro, y lo hacemos nosotros: cada paso es conocido.',
    'Como las varianzas se suman, se puede saltar a cualquier paso de golpe con $x_t = \\sqrt{\\overline{\\alpha}_t}x_0 + \\sqrt{1-\\overline{\\alpha}_t}\\varepsilon$. Eso es lo que hace el método entrenable.',
    'Difundir con ruido gaussiano <strong>es</strong> la ecuación del calor: la varianza crece como $\\sigma_0^2 + 2kt$.',
    'No se invierte esa ecuación: la información destruida no vuelve. Se aprende qué es plausible y se elige una salida compatible.',
    'Lo que se aprende es el score, $\\nabla_x \\log p(x)$: hacia dónde moverse para que el dato sea más plausible. Adivinar el ruido añadido es lo mismo, cambiado de escala.',
    'El camino de vuelta añade azar en cada paso, y eso es lo que da variedad y evita el colapso de modas.',
    'Se entrena con un error cuadrático corriente, sin adversario: por eso no oscila como una GAN.'
  ]);
});
