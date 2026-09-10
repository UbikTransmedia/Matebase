/* Tema: Resolver ecuaciones diferenciales con el ordenador */
Course.topic('av-edo-numerico', function (p) {

  p.text('En [[av-edo]] se resolvían ecuaciones diferenciales con fórmulas: separar variables, integrar, ' +
    'despejar. Es la parte bonita, pero engaña: la inmensa mayoría de las ecuaciones que aparecen en física, ' +
    'biología o ingeniería <strong>no tienen solución en forma de fórmula</strong>. El péndulo sin aproximar, tres ' +
    'planetas que se atraen, el tiempo atmosférico. Y sin embargo se predicen órbitas y tormentas todos los días.');

  p.text('La idea que lo permite es muy sencilla. Una ecuación $y\' = f(t, y)$ dice, en cada punto, hacia dónde ' +
    'apunta la solución: es el campo de pendientes. Si no se puede seguir la curva entera, se avanza a pasitos, ' +
    'mirando la pendiente en cada uno. El ordenador no resuelve la ecuación: <strong>la recorre</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('El método de Euler');

  p.formula('y_{n+1} = y_n + h\\,f(t_n, y_n), \\qquad t_{n+1} = t_n + h',
    'un paso del método de Euler',
    'Se lee: <em>«i griega del paso siguiente es la de ahora más hache por la pendiente de ahora»</em>.<br><br>' +
    '$h$ es el <strong>paso</strong>: cuánto avanza el tiempo en cada salto.<br><br>Geométricamente, se sigue la ' +
    '[[fn-derivadas|recta tangente]] durante un tiempo $h$ y se vuelve a mirar la pendiente. Es la misma idea que ' +
    'aproximar una función por su tangente, repetida muchas veces.');

  p.text('Un ejemplo que se puede hacer a mano y que esconde una sorpresa. Con $y\' = y$ e $y(0) = 1$, la solución ' +
    'exacta es $y = e^t$. Euler con paso $h$ da $y_{n+1} = y_n + h\\,y_n = (1 + h)\\,y_n$, así que $y_n = (1 + h)^n$. ' +
    'Para llegar a $t = 1$ en $n$ pasos, $h = \\frac{1}{n}$, y el método da $\\left(1 + \\frac{1}{n}\\right)^n$: ' +
    'exactamente la sucesión cuyo [[fn-limites|límite]] es el número $e$. Euler con pasos cada vez más pequeños ' +
    '<em>es</em> la definición de $e$.');

  p.demo({
    title: 'Euler sobre el campo de pendientes',
    intro: 'Las rayitas son el campo de pendientes: la dirección que marca la ecuación en cada punto. La curva gruesa es la solución exacta, y la poligonal, el método de Euler. Reduce el paso y mira cómo la poligonal se pega a la curva; auméntalo y verás cómo se despega.',
    build: function (host) {
      var cual = 'crece', h = 0.25;
      var EQ = {
        crece: { t: "y' = y", f: function (t, y) { return y; }, y0: 1, ex: function (t) { return Math.exp(t); }, T: 2, ymin: -0.5, ymax: 8 },
        campana: { t: "y' = −2ty", f: function (t, y) { return -2 * t * y; }, y0: 1, ex: function (t) { return Math.exp(-t * t); }, T: 2.5, ymin: -0.3, ymax: 1.3 },
        ola: { t: "y' = cos t − y", f: function (t, y) { return Math.cos(t) - y; }, y0: 0, ex: function (t) { return 0.5 * (Math.cos(t) + Math.sin(t) - Math.exp(-t)); }, T: 8, ymin: -1, ymax: 1.2 }
      };
      var out = W.readout(host, '');
      function euler(e) {
        var t = 0, y = e.y0, pts = [[0, y]];
        while (t < e.T - 1e-9) { y += h * e.f(t, y); t += h; pts.push([t, y]); }
        return pts;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 2, ymin: -0.5, ymax: 8, height: 300, xlabel: 't', ylabel: 'y',
        draw: function (g) {
          var e = EQ[cual], nx = 16, ny = 10;
          for (var i = 0; i <= nx; i++) for (var j = 0; j <= ny; j++) {
            var t = e.T * i / nx, y = e.ymin + (e.ymax - e.ymin) * j / ny, m = e.f(t, y);
            var dt = 0.35 * e.T / nx, sx = dt, sy = m * dt, esc = (e.ymax - e.ymin) / e.T;
            var L = Math.hypot(sx * esc, sy) / (0.35 * (e.ymax - e.ymin) / ny);
            if (L > 1) { sx /= L; sy /= L; }
            g.seg(t - sx / 2, y - sy / 2, t + sx / 2, y + sy / 2, { color: 'axis', w: 1.2 });
          }
          g.fn(e.ex, { color: 0, w: 3 });
          var pts = euler(e);
          g.path(pts, { color: 1, w: 2.2 });
          pts.forEach(function (q) { g.point(q[0], q[1], { color: 1, r: 3 }); });
        }
      });
      function pinta() {
        var e = EQ[cual], pts = euler(e), fin = pts[pts.length - 1];
        plot.view(0, e.T, e.ymin, e.ymax);
        out.set('$' + e.t.replace('−', '-') + '$ &nbsp;·&nbsp; paso $h = ' + U.fmt(h, 3) + '$ (' + (pts.length - 1) + ' pasos) &nbsp;·&nbsp; en $t = ' + U.fmt(fin[0], 2) + '$: Euler da $' + U.fmt(fin[1], 4) +
          '$ y la solución exacta es $' + U.fmt(e.ex(fin[0]), 4) + '$ &nbsp;·&nbsp; error: <strong>' + U.fmt(Math.abs(fin[1] - e.ex(fin[0])), 4) + '</strong>');
      }
      W.chips(host, Object.keys(EQ).map(function (k) { return { label: EQ[k].t, value: k }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      W.slider(W.row(host), { label: 'paso h', min: 0.02, max: 1, step: 0.01, value: h, on: function (v) { h = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Error y tamaño de paso');

  p.text('Cada paso de Euler comete un pequeño error, porque la pendiente cambia a lo largo del paso y el método ' +
    'solo la mira al principio. Ese error de un paso es del orden de $h^2$. Para llegar a un tiempo fijo hacen ' +
    'falta $\\frac{T}{h}$ pasos, así que el error total es del orden de $h^2\\cdot\\frac{T}{h}$, es decir, de ' +
    '$h$. Se dice que Euler es un método de <strong>orden 1</strong>: si el paso se reduce a la mitad, el error ' +
    'también, más o menos, y el trabajo se duplica.');

  p.table(['Paso $h$', 'Euler en $t = 1$', 'Error de Euler', 'Error de Runge-Kutta 4'], [
    ['$0{,}1$', '$2{,}59374$', '$0{,}12454$', '$2{,}1\\cdot 10^{-6}$'],
    ['$0{,}05$', '$2{,}65330$', '$0{,}06498$', '$1{,}4\\cdot 10^{-7}$'],
    ['$0{,}025$', '$2{,}68506$', '$0{,}03322$', '$8{,}7\\cdot 10^{-9}$']
  ]);

  p.note('La tabla es para $y\' = y$, cuya solución en $t = 1$ vale $e \\approx 2{,}71828$. Fíjate en las dos ' +
    'últimas columnas al reducir el paso a la mitad: el error de Euler se divide por 2, y el de Runge-Kutta, por ' +
    '16. Con el mismo trabajo, uno gana una cifra correcta cada tres veces que se reduce el paso; el otro, más de ' +
    'una cifra cada vez.', 'ok', 'Cómo leer la tabla');

  /* ---------------------------------------------------------------- */
  p.section('Runge-Kutta de orden 4');

  p.text('El defecto de Euler es mirar la pendiente solo al principio del paso. La solución es mirarla en ' +
    'varios puntos del paso y promediar con cuidado. El método más usado del mundo mira cuatro veces:');

  p.formulas([
    'k_1 = f(t_n,\\ y_n), \\qquad k_2 = f\\left(t_n + \\tfrac{h}{2},\\ y_n + \\tfrac{h}{2}k_1\\right)',
    'k_3 = f\\left(t_n + \\tfrac{h}{2},\\ y_n + \\tfrac{h}{2}k_2\\right), \\qquad k_4 = f(t_n + h,\\ y_n + h\\,k_3)',
    'y_{n+1} = y_n + \\frac{h}{6}\\,(k_1 + 2k_2 + 2k_3 + k_4)'
  ], 'el método de Runge-Kutta de orden 4',
    '$k_1$ es la pendiente al principio; $k_2$ y $k_3$, dos estimaciones de la pendiente a mitad de paso; $k_4$, la ' +
    'pendiente al final.<br><br>Los pesos $1, 2, 2, 1$ entre 6 son los de la regla de Simpson para aproximar una ' +
    '[[fn-integral-def|integral]]: el método estima la integral de la pendiente a lo largo del paso.<br><br>Su error ' +
    'total es del orden de $h^4$: <strong>orden 4</strong>.');

  p.demo({
    title: 'Una órbita que Euler no sabe cerrar',
    intro: 'El sistema x′ = −y, y′ = x describe un punto que gira en círculo: su solución exacta es la circunferencia de radio 1. Euler, en cada paso, sale por la tangente y cae un poco fuera, así que la órbita se abre en espiral. Runge-Kutta 4, con el mismo paso, se mantiene sobre el círculo durante muchas vueltas.',
    build: function (host) {
      var h = 0.2, vueltas = 3;
      var out = W.readout(host, '');
      function orbita(rk) {
        var x = 1, y = 0, pts = [[1, 0]], N = Math.round(vueltas * 2 * Math.PI / h);
        for (var i = 0; i < N; i++) {
          if (!rk) { var nx = x - h * y, ny = y + h * x; x = nx; y = ny; }
          else {
            var k1x = -y, k1y = x;
            var k2x = -(y + h / 2 * k1y), k2y = x + h / 2 * k1x;
            var k3x = -(y + h / 2 * k2y), k3y = x + h / 2 * k2x;
            var k4x = -(y + h * k3y), k4y = x + h * k3x;
            x += h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x); y += h / 6 * (k1y + 2 * k2y + 2 * k3y + k4y);
          }
          pts.push([x, y]);
        }
        return pts;
      }
      var plot = W.board(host, {
        xmin: -3, xmax: 3, ymin: -3, ymax: 3, height: 320, xlabel: 'x', ylabel: 'y',
        aria: 'Trayectorias en el plano de fases: la circunferencia exacta, la espiral de Euler y la órbita de Runge-Kutta',
        draw: function (g) {
          g.circle(0, 0, 1, { color: 'axis', w: 1.5, dash: [4, 4] });
          g.path(orbita(false), { color: 1, w: 2 });
          g.path(orbita(true), { color: 0, w: 2.6 });
        }
      });
      function pinta() {
        var e = orbita(false), r = orbita(true), fe = e[e.length - 1], fr = r[r.length - 1];
        out.set('Tras ' + vueltas + ' vueltas con $h = ' + U.fmt(h, 2) + '$ &nbsp;·&nbsp; distancia al centro con Euler: <strong>' + U.fmt(Math.hypot(fe[0], fe[1]), 3) + '</strong> &nbsp;·&nbsp; con Runge-Kutta 4: <strong>' +
          U.fmt(Math.hypot(fr[0], fr[1]), 6) + '</strong> &nbsp;·&nbsp; exacta: 1<br>En cada paso, Euler multiplica el radio por $\\sqrt{1 + h^2} = ' + U.fmt(Math.sqrt(1 + h * h), 4) + '$.');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'paso h', min: 0.02, max: 0.5, step: 0.01, value: h, on: function (v) { h = v; pinta(); } });
      W.slider(fila, { label: 'vueltas', min: 1, max: 10, step: 1, value: vueltas, on: function (v) { vueltas = v; pinta(); } });
      W.legend(host, [{ c: 1, t: 'Euler' }, { c: 0, t: 'Runge-Kutta 4' }]);
      pinta();
    }
  });

  p.hist('Leonhard Euler publicó su método en 1768, en sus <em>Institutiones calculi integralis</em>. Carl Runge ' +
    'y Martin Kutta lo refinaron hacia 1900 hasta dar con los métodos que llevan su nombre. Durante décadas se ' +
    'calcularon a mano, por equipos de personas llamadas literalmente «computadoras». Una de ellas, ' +
    '<strong>Katherine Johnson</strong>, matemática de la NASA, calculó en 1962 la trayectoria del vuelo orbital de ' +
    'John Glenn, y John Glenn se negó a despegar hasta que ella comprobara a mano los números de la máquina ' +
    'electrónica. Para el tramo en que la nave pasaba de la órbita a la caída hacia el océano, donde ninguna ' +
    'fórmula servía, usó métodos numéricos como el de Euler.');

  p.util('Los modelos del tiempo dividen la atmósfera en millones de celdas y avanzan sus ecuaciones a pasos de ' +
    'unos minutos. Los videojuegos mueven cada objeto con un paso de Euler por fotograma, en una variante que ' +
    'no deja que las órbitas se abran. Y cuando una misión espacial corrige su rumbo, los ordenadores de control ' +
    'integran numéricamente las ecuaciones de la gravedad del Sol, la Tierra y la Luna a la vez.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Dos pasos de Euler',
    level: 'basico',
    gen: function (r) {
      var y0 = r.int(0, 3), h = r.pick([0.1, 0.2, 0.5]);
      var y1 = y0 + h * (0 + y0), y2 = y1 + h * (h + y1);
      return { y0: y0, h: h, y1: y1, y2: y2, sinH: y0 + (0 + y0) };
    },
    ask: function (d) { return 'Para $y\' = t + y$ con $y(0) = ' + d.y0 + '$, aplica dos pasos del método de Euler con $h = ' + U.fmt(d.h, 1) + '$. ¿Cuánto valen $y_1$ e $y_2$? (Tres decimales.)'; },
    fields: [{ name: 'a', label: '$y_1$', w: 'tiny' }, { name: 'b', label: '$y_2$', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.y1, 6), b: U.round(d.y2, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.sinH - d.y1) > 1e-3 && Math.abs(v.a - d.sinH) < 5e-4; }, msg: 'Falta multiplicar la pendiente por el paso $h$: se avanza durante un tiempo $h$, no durante una unidad.' }],
    hint: function () { return ['$y_1 = y_0 + h\\,f(t_0, y_0)$, con $t_0 = 0$.', 'Para el segundo paso, $t_1 = h$ y la pendiente es $t_1 + y_1$.']; },
    steps: function (d) {
      return ['$f(0, ' + d.y0 + ') = 0 + ' + d.y0 + ' = ' + d.y0 + '$, así que $y_1 = ' + d.y0 + ' + ' + U.fmt(d.h, 1) + '\\cdot ' + d.y0 + ' = ' + U.fmt(d.y1, 3) + '$',
        '$f(' + U.fmt(d.h, 1) + ', ' + U.fmt(d.y1, 3) + ') = ' + U.fmt(d.h + d.y1, 3) + '$, así que $y_2 = ' + U.fmt(d.y1, 3) + ' + ' + U.fmt(d.h, 1) + '\\cdot ' + U.fmt(d.h + d.y1, 3) + ' = ' + U.fmt(d.y2, 3) + '$'];
    },
    answer: function (d) { return 'y₁ = ' + U.fmt(d.y1, 3) + ', y₂ = ' + U.fmt(d.y2, 3); }
  });

  p.exercise({
    title: 'Euler y el número e',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([2, 4, 5, 10, 20]);
      var v = Math.pow(1 + 1 / n, n);
      return { n: n, v: v, err: Math.E - v };
    },
    ask: function (d) {
      return 'Para $y\' = y$ con $y(0) = 1$, se llega a $t = 1$ con ' + d.n + ' pasos de Euler. ¿Qué valor da el método para $y(1)$, y cuánto se queda por debajo del exacto, $e$? (Cuatro decimales.)';
    },
    fields: [{ name: 'v', label: 'Euler da', w: 'wide' }, { name: 'e', label: 'error', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6), e: U.round(d.err, 6) }; },
    tol: 2e-4,
    errores: [{ si: function (v, d) { return Math.abs(v.v - (1 + 1 / d.n) * d.n) < 2e-4; }, msg: 'Cada paso <strong>multiplica</strong> por $1 + h$: después de $n$ pasos, $(1 + h)^n$, una potencia, no un producto por $n$.' }],
    hint: function (d) { return ['Con $y\' = y$, un paso es $y_{n+1} = (1 + h)\\,y_n$.', '$h = \\frac{1}{' + d.n + '}$, y hay ' + d.n + ' pasos.']; },
    steps: function (d) {
      return ['$h = \\frac{1}{' + d.n + '}$ y cada paso multiplica por $1 + h$.', '$y(1) \\approx \\left(1 + \\frac{1}{' + d.n + '}\\right)^{' + d.n + '} \\approx ' + U.fmt(d.v, 4) + '$',
        'Error: $e - ' + U.fmt(d.v, 4) + ' \\approx ' + U.fmt(d.err, 4) + '$. Al hacer $n \\to \\infty$, esa potencia tiende a $e$: es su definición.'];
    },
    answer: function (d) { return U.fmt(d.v, 4) + ', error ' + U.fmt(d.err, 4); }
  });

  p.exercise({
    title: '¿Cuánto baja el error?',
    level: 'medio',
    gen: function (r) {
      var ord = r.pick([1, 2, 4]), k = r.int(1, 3), E = r.pick([0.08, 0.02, 0.5, 0.16]);
      return { ord: ord, k: k, E: E, nuevo: E / Math.pow(2, ord * k), lineal: E / Math.pow(2, k) };
    },
    ask: function (d) {
      var nombre = { 1: 'Euler, de orden 1', 2: 'un método de orden 2', 4: 'Runge-Kutta 4' }[d.ord];
      return 'Con ' + nombre + ' y paso $h$, el error al llegar a un tiempo fijo es $' + U.fmt(d.E, 2) + '$. Si el paso se divide entre $' + Math.pow(2, d.k) +
        '$, ¿qué error cabe esperar? (Fracción o notación decimal.)';
    },
    fields: [{ name: 'e', label: 'error esperado', w: 'wide' }],
    sol: function (d) { return { e: d.nuevo }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return d.ord !== 1 && Math.abs(v.e - d.lineal) < 1e-9; }, msg: 'Así bajaría con un método de orden 1. Con orden $p$, el error es proporcional a $h^p$: dividir el paso entre 2 divide el error entre $2^p$.' }],
    hint: function () { return ['Un método de orden $p$ tiene un error proporcional a $h^p$.', 'Si $h$ se divide entre $m$, el error se divide entre $m^p$.']; },
    steps: function (d) {
      var m = Math.pow(2, d.k);
      return ['El paso se divide entre ' + m + ' y el orden es ' + d.ord + ': el error se divide entre $' + m + '^{' + d.ord + '} = ' + Math.pow(m, d.ord) + '$.',
        'Error esperado: $\\dfrac{' + U.fmt(d.E, 2) + '}{' + Math.pow(m, d.ord) + '} \\approx ' + U.fmt(d.nuevo, 8) + '$'];
    },
    answer: function (d) { return U.fmt(d.nuevo, 8); }
  });

  p.exercise({
    title: 'Un paso de Runge-Kutta',
    level: 'avanzado',
    gen: function (r) {
      var h = r.pick([0.1, 0.2, 0.5, 1]);
      var k1 = 1, k2 = 1 + h / 2 * k1, k3 = 1 + h / 2 * k2, k4 = 1 + h * k3;
      return { h: h, k1: k1, k2: k2, k3: k3, k4: k4, y1: 1 + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4), euler: 1 + h };
    },
    ask: function (d) {
      return 'Aplica un paso de Runge-Kutta 4 a $y\' = y$ con $y(0) = 1$ y $h = ' + U.fmt(d.h, 1) + '$. ¿Cuánto valen $k_2$ e $y_1$? Compara con $e^{' + U.fmt(d.h, 1) + '}$. (Cinco decimales.)';
    },
    fields: [{ name: 'k', label: '$k_2$', w: 'tiny' }, { name: 'y', label: '$y_1$', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.k2, 8), y: U.round(d.y1, 8) }; },
    tol: 2e-5,
    errores: [{ si: function (v, d) { return Math.abs(v.y - d.euler) < 2e-5; }, msg: 'Eso es un paso de Euler, que solo usa $k_1$. Runge-Kutta combina las cuatro pendientes con pesos $\\frac{1}{6}, \\frac{2}{6}, \\frac{2}{6}, \\frac{1}{6}$.' }],
    hint: function () { return ['Con $f(t, y) = y$, cada $k$ es simplemente el valor de $y$ donde se evalúa: $k_2 = y_0 + \\frac{h}{2}k_1$.', 'Después, $y_1 = y_0 + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$.']; },
    steps: function (d) {
      return ['$k_1 = 1$, $k_2 = 1 + \\frac{' + U.fmt(d.h, 1) + '}{2}\\cdot 1 = ' + U.fmt(d.k2, 5) + '$, $k_3 = 1 + \\frac{' + U.fmt(d.h, 1) + '}{2}\\cdot ' + U.fmt(d.k2, 5) + ' = ' + U.fmt(d.k3, 5) + '$, $k_4 = 1 + ' + U.fmt(d.h, 1) + '\\cdot ' + U.fmt(d.k3, 5) + ' = ' + U.fmt(d.k4, 5) + '$',
        '$y_1 = 1 + \\frac{' + U.fmt(d.h, 1) + '}{6}(' + U.fmt(d.k1, 0) + ' + 2\\cdot ' + U.fmt(d.k2, 5) + ' + 2\\cdot ' + U.fmt(d.k3, 5) + ' + ' + U.fmt(d.k4, 5) + ') \\approx ' + U.fmt(d.y1, 5) + '$',
        'El valor exacto es $e^{' + U.fmt(d.h, 1) + '} \\approx ' + U.fmt(Math.exp(d.h), 5) + '$. De hecho, $y_1 = 1 + h + \\frac{h^2}{2} + \\frac{h^3}{6} + \\frac{h^4}{24}$: los cinco primeros términos del [[fn-taylor|polinomio de Taylor]] de $e^h$.'];
    },
    answer: function (d) { return 'k₂ = ' + U.fmt(d.k2, 5) + ', y₁ = ' + U.fmt(d.y1, 5); }
  });

  p.keys([
    'Casi ninguna ecuación diferencial tiene fórmula, pero todas se pueden recorrer a pasos.',
    'Euler: $y_{n+1} = y_n + h\\,f(t_n, y_n)$, siguiendo la tangente. Es de orden 1: su error es proporcional a $h$.',
    'Con $y\' = y$, Euler da $(1 + \\frac{1}{n})^n$, cuyo límite es $e$.',
    'Runge-Kutta 4 promedia cuatro pendientes con los pesos de Simpson y tiene un error proporcional a $h^4$.',
    'Un método de orden $p$ divide su error entre $2^p$ al dividir el paso entre 2.'
  ]);
});
