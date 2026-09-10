/* Tema: La función integral y el teorema fundamental */
Course.topic('fn-funcion-integral', function (p) {

  var F = ML.F;
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }

  p.text('En [[fn-integral-def]] la integral definida era un número: el área entre $a$ y $b$. Aquí se ' +
    'da un paso que parece pequeño y lo cambia todo: se deja fijo el extremo de la izquierda y se ' +
    'deja <strong>moverse</strong> el de la derecha. El área deja de ser un número y se convierte en una ' +
    'función, que va acumulando superficie a medida que avanza.');

  p.text('Con esa función se entiende por fin por qué la regla de Barrow funciona, y aparece un tipo de ' +
    'pregunta de examen que desconcierta la primera vez: derivar algo que está escrito como una ' +
    'integral.');

  /* ---------------------------------------------------------------- */
  p.section('La función integral');

  p.formula('F(x) = \\int_a^x f(t)\\,dt',
    'función integral o función área',
    'Se lee: <em>«efe mayúscula de equis es la integral entre a y equis de efe de te, diferencial de ' +
      'te»</em>.<br><br>Dentro de la integral la variable se llama $t$ solo para no confundirla con la ' +
      '$x$ del extremo: es una variable muda, que recorre el intervalo y desaparece al integrar.<br><br>' +
      'Algunas propiedades salen solas: $F(a) = 0$, porque no se ha acumulado nada todavía; donde $f$ es ' +
      'positiva, $F$ crece; donde $f$ es negativa, $F$ decrece.');

  p.demo({
    title: 'El área que se va acumulando',
    intro: 'Arriba, f(t) y el área entre 0 y x. Abajo, F(x), la cantidad de área acumulada. Mueve x: cuando el trozo que añades es positivo, F sube; cuando es negativo, baja; y donde f corta el eje, F tiene un máximo o un mínimo.',
    build: function (host) {
      var x = 1.5;
      var f = function (t) { return 1.5 * Math.sin(t) + 0.2 * t; };
      var Fx = function (s) { return 1.5 * (1 - Math.cos(s)) + 0.1 * s * s; };
      var out = W.readout(host, '');
      var arriba = W.plot(host, {
        xmin: -0.3, xmax: 7, ymin: -2, ymax: 2.8, height: 210, xlabel: 't',
        draw: function (g) {
          var pasos = 140;
          for (var i = 0; i < pasos; i++) {
            var t0 = x * i / pasos, t1 = x * (i + 1) / pasos, y = f((t0 + t1) / 2);
            g.rect(t0, 0, t1 - t0, y, { fill: y >= 0 ? 2 : 1, fillAlpha: 0.3, stroke: false });
          }
          g.fn(f, { color: 0, w: 2.6 });
          g.vline(x, { color: 'axis', dash: true, w: 1.4 });
        }
      });
      var abajo = W.plot(host, {
        xmin: -0.3, xmax: 7, ymin: -0.5, ymax: 7.5, height: 200, ylabel: 'F(x)',
        draw: function (g) {
          g.fn(Fx, { color: 'axis', w: 1.2, alpha: 0.5 });
          g.fn(Fx, { color: 4, w: 3, to: x });
          g.point(x, Fx(x), { color: 4, r: 5 });
        }
      });
      function pinta() {
        out.set('$x = ' + U.fmt(x, 2) + '$: &nbsp;$f(x) = ' + U.fmt(f(x), 3) + '$ &nbsp;·&nbsp; $F(x) = \\int_0^x f(t)\\,dt = ' + U.fmt(Fx(x), 3) + '$<br>' +
          (f(x) > 0.05 ? 'Se está añadiendo área positiva: $F$ crece.' : (f(x) < -0.05 ? 'Se está añadiendo área negativa: $F$ decrece.' : '$f$ vale casi cero: $F$ está en un extremo.')) +
          ' La pendiente de $F$ en cada punto es, exactamente, la altura de $f$.');
        arriba.render(); abajo.render();
      }
      W.slider(W.row(host), { label: 'extremo superior x', min: 0, max: 7, step: 0.05, value: x, on: function (v) { x = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El teorema fundamental del cálculo');

  p.formula('f \\text{ continua} \\ \\Longrightarrow\\ F(x) = \\int_a^x f(t)\\,dt \\text{ es derivable y } F\'(x) = f(x)',
    'teorema fundamental del cálculo',
    'Se lee: <em>«si efe es continua, la función integral es derivable y su derivada es efe»</em>.<br><br>' +
      'Por qué: al pasar de $x$ a $x + h$, el área acumulada crece en una franja de anchura $h$ y ' +
      'altura aproximadamente $f(x)$. Así que $\\frac{F(x+h) - F(x)}{h} \\approx f(x)$, y en el límite ' +
      'es exactamente $f(x)$.<br><br>Dicho de otro modo: integrar y derivar son operaciones inversas. ' +
      'La función integral es una primitiva de $f$, y de ahí sale Barrow: $\\int_a^b f = F(b) - F(a)$.');

  p.text('Cuando el extremo superior no es $x$ sino una función de $x$, se añade la regla de la cadena. ' +
    'Y si los dos extremos se mueven, se resta lo que aporta el de abajo:');

  p.formulas([
    '\\frac{d}{dx}\\int_a^{g(x)} f(t)\\,dt = f\\bigl(g(x)\\bigr)\\cdot g\'(x)',
    '\\frac{d}{dx}\\int_{h(x)}^{g(x)} f(t)\\,dt = f\\bigl(g(x)\\bigr)\\,g\'(x) - f\\bigl(h(x)\\bigr)\\,h\'(x)'
  ], 'con extremos variables',
    'La primera se lee: <em>«la derivada de la integral entre a y ge de equis es efe de ge de equis por ' +
      'la derivada de ge»</em>.<br><br>Receta: se sustituye el extremo en la función de dentro y se ' +
      'multiplica por la derivada del extremo. Olvidar ese último factor es el error típico.');

  p.note('Con el teorema fundamental aparecen dos preguntas de examen. Una: <strong>extremos de una ' +
    'función integral</strong>, sin calcular la integral, porque $F\'(x) = f(x)$ y basta estudiar $f$. ' +
    'Otra: <strong>límites con una integral dentro</strong>, como $\\lim_{x\\to 0}\\frac{1}{x^3}\\int_0^x ' +
    '\\operatorname{sen}(t^2)\\,dt$, que es $\\frac{0}{0}$ y se resuelve con [[fn-lhopital|L\'Hôpital]] ' +
    'derivando la integral con el teorema.', 'ok', 'Lo que se pregunta con esto');

  p.hist('La idea de que el área y la tangente son problemas inversos la intuyeron varios matemáticos ' +
    'del siglo XVII —James Gregory y el propio Isaac Barrow la dejaron escrita en forma geométrica—, ' +
    'pero fueron Newton y Leibniz quienes la convirtieron en un método de cálculo. Newton pensaba en ' +
    '<em>fluentes</em> y <em>fluxiones</em>: cantidades que fluyen con el tiempo y la velocidad a la que ' +
    'lo hacen, que es exactamente la función integral y su derivada. Ese «fluir» es la imagen del ' +
    'ejemplo de arriba: el área que se va acumulando mientras $x$ avanza.');

  /* ---------------------------------------------------------------- */
  p.section('El teorema del valor medio integral');

  p.formula('f \\text{ continua en } [a, b] \\ \\Longrightarrow\\ \\exists\\, c \\in [a, b] : \\int_a^b f(x)\\,dx = f(c)\\,(b - a)',
    'teorema del valor medio integral',
    'Se lee: <em>«existe un punto ce en el que el área bajo la curva es igual a la de un rectángulo de ' +
      'base be menos a y altura efe de ce»</em>.<br><br>Esa altura, $\\frac{1}{b-a}\\int_a^b f$, es el ' +
      '<strong>valor medio</strong> de $f$ en el intervalo: la altura a la que habría que «allanar» la ' +
      'curva para que encerrara la misma área.<br><br>Que exista el punto $c$ lo garantizan los ' +
      '[[fn-continuidad|teoremas de las funciones continuas]]: el valor medio está entre el mínimo y el ' +
      'máximo de $f$, y $f$ pasa por todos los valores intermedios.');

  p.demo({
    title: 'Allanar la curva',
    intro: 'La curva y un rectángulo con la misma área. Mueve el extremo b: la altura del rectángulo es el valor medio de f, y siempre hay algún punto c donde la curva pasa exactamente por esa altura.',
    build: function (host) {
      var b = 3;
      var f = function (x) { return 0.3 * x * x + 0.5; };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.4, xmax: 4.6, ymin: 0, ymax: 7, height: 290,
        draw: function (g) {
          var media = (0.1 * b * b * b + 0.5 * b) / b;
          var c = Math.sqrt((media - 0.5) / 0.3);
          g.area(f, 0, b, { fill: 2, fillAlpha: 0.25 });
          g.rect(0, 0, b, media, { color: 4, fill: false, w: 2, dash: true });
          g.fn(f, { color: 0, w: 2.6 });
          g.hline(media, { color: 4, w: 1, alpha: 0.4 });
          g.point(c, media, { color: 4, r: 5, label: 'c' });
        }
      });
      function pinta() {
        var I = 0.1 * b * b * b + 0.5 * b, media = I / b, c = Math.sqrt((media - 0.5) / 0.3);
        out.set('$\\int_0^{' + U.fmt(b, 2) + '} f = ' + U.fmt(I, 4) + '$ &nbsp;·&nbsp; valor medio $= ' + U.fmt(media, 4) + '$ &nbsp;·&nbsp; se alcanza en $c \\approx ' + U.fmt(c, 4) + '$');
        plot.render();
      }
      W.slider(W.row(host), { label: 'extremo b', min: 0.5, max: 4.2, step: 0.05, value: b, on: function (v) { b = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Volúmenes de revolución');

  p.text('Si una curva $y = f(x)$ gira alrededor del eje $x$, barre un cuerpo de revolución: un jarrón, ' +
    'un cono, una esfera. Cortado en rodajas perpendiculares al eje, cada rodaja es un disco de radio ' +
    '$f(x)$ y grosor $dx$. Sumar todos esos discos es integrar.');

  p.formula('V = \\pi\\int_a^b f(x)^2\\,dx',
    'volumen de un cuerpo de revolución (método de los discos)',
    'Se lee: <em>«el volumen es pi por la integral entre a y be de efe de equis al cuadrado»</em>.<br><br>' +
      'Cada disco tiene área $\\pi\\,r^2 = \\pi f(x)^2$ y grosor $dx$. Olvidar el cuadrado, o el $\\pi$, ' +
      'son los dos errores de siempre.');

  p.demo({
    title: 'Girar una curva',
    intro: 'Elige la curva y gira el dibujo arrastrándolo. Los anillos son algunos de los discos de los que está hecho el cuerpo; el volumen es la suma de todos ellos.',
    build: function (host) {
      var CASOS = {
        cono: { t: 'cono', f: function (x) { return 0.6 * x; }, a: 0, b: 4, V: 'V = \\pi\\int_0^4 (0{,}6x)^2dx = \\pi\\cdot 0{,}36\\cdot\\frac{64}{3} \\approx 24{,}13' },
        esfera: { t: 'esfera', f: function (x) { return Math.sqrt(Math.max(0, 4 - x * x)); }, a: -2, b: 2, V: 'V = \\pi\\int_{-2}^{2}(4 - x^2)\\,dx = \\frac{32\\pi}{3} \\approx 33{,}51' },
        parab: { t: 'paraboloide', f: function (x) { return Math.sqrt(Math.max(0, x)); }, a: 0, b: 4, V: 'V = \\pi\\int_0^4 x\\,dx = 8\\pi \\approx 25{,}13' }
      };
      var cual = 'cono';
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 4, height: 360, rejilla: false, yaw: -0.5, pitch: 0.35,
        aria: 'Un cuerpo de revolución obtenido al girar una curva alrededor del eje x, dibujado con anillos',
        draw: function (g) {
          var c = CASOS[cual], n = 14, i, j;
          for (i = 0; i <= n; i++) {
            var x = c.a + (c.b - c.a) * i / n, r = c.f(x), pts = [];
            for (j = 0; j <= 40; j++) {
              var th = 2 * Math.PI * j / 40;
              pts.push([x, r * Math.cos(th), r * Math.sin(th)]);
            }
            g.camino(pts, { color: 0, w: 1.2, alpha: 0.55 });
          }
          var perfil = [];
          for (i = 0; i <= 60; i++) { var xx = c.a + (c.b - c.a) * i / 60; perfil.push([xx, 0, c.f(xx)]); }
          g.camino(perfil, { color: 1, w: 3 });
        }
      });
      function pinta() { out.set('$' + CASOS[cual].V + '$'); vista.render(); }
      W.chips(host, Object.keys(CASOS).map(function (k) { return { label: CASOS[k].t, value: k }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      pinta();
    }
  });

  p.util('La función integral es la forma matemática de «llevar la cuenta». Si $f$ es la velocidad de un ' +
    'coche, $F$ es la distancia recorrida hasta cada instante; si $f$ es la potencia que consume una ' +
    'casa, $F$ es la energía gastada, que es lo que marca el contador. En medicina, el área bajo la ' +
    'curva de concentración de un fármaco —el <em>AUC</em>, que se calcula exactamente así— mide la ' +
    'exposición total del cuerpo al medicamento, y es el dato con el que se comparan dos formulaciones. ' +
    'Y en probabilidad, la función de distribución de una [[pe-continuas|variable continua]] es la ' +
    'función integral de su densidad.');

  p.hist('Evangelista Torricelli encontró hacia 1641 un cuerpo que parecía imposible: la «trompeta» que se ' +
    'obtiene al girar $y = \\frac{1}{x}$ desde $x = 1$ hasta el infinito. Su volumen es finito, ' +
    '$\\pi\\int_1^\\infty \\frac{dx}{x^2} = \\pi$, pero su superficie es infinita. Se podría llenar de pintura, ' +
    'pero no pintar por fuera. El resultado escandalizó a los filósofos de la época, porque parecía ' +
    'demostrar que algo infinito cabe en algo finito, y todavía se usa como ejemplo de lo contraria a la ' +
    'intuición que puede ser una integral.', 'La trompeta de Torricelli');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Evaluar una función integral',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(1, 6), b = r.pm(0, 6), x = r.pm(1, 4);
      return { a: a, b: b, x: x, v: F(a * x * x, 2).add(F(b * x)) };
    },
    ask: function (d) { return 'Sea $F(x) = \\displaystyle\\int_0^x (' + ML.polyTex([d.a, d.b], 't') + ')\\,dt$. Calcula $F(' + d.x + ')$. (Vale una fracción.)'; },
    fields: [{ name: 'v', label: 'F(x) =', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    hint: function () { return ['Integra en $t$ y aplica Barrow entre $0$ y el valor pedido.']; },
    steps: function (d) { return ['$F(x) = \\left[\\frac{' + d.a + 't^2}{2} + ' + pa(d.b) + 't\\right]_0^x = \\frac{' + d.a + 'x^2}{2} + ' + pa(d.b) + 'x$', '$F(' + d.x + ') = ' + d.v.tex() + '$']; },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.exercise({
    title: 'Derivar una integral con extremo variable',
    level: 'medio',
    gen: function (r) {
      var x0 = r.pm(1, 2), c = r.pm(1, 5), n = r.pick([2, 3]);
      // F(x) = ∫_1^{x^2} (t^n + c) dt  ->  F'(x) = (x^{2n} + c)·2x
      var g = x0 * x0, fg = Math.pow(g, n) + c;
      return { x0: x0, c: c, n: n, fg: fg, v: fg * 2 * x0 };
    },
    ask: function (d) { return 'Sea $F(x) = \\displaystyle\\int_1^{x^2} (t^' + d.n + ' + ' + d.c + ')\\,dt$. Calcula $F\'(' + d.x0 + ')$.'; },
    fields: [{ name: 'v', label: "F'(x₀) =", w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{
      si: function (v, d) { return d.fg !== 0 && 2 * d.x0 !== 1 && v.v === d.fg; },
      msg: 'Falta multiplicar por la derivada del extremo: el extremo es $x^2$, y su derivada es $2x$.'
    }],
    hint: function () { return ['Teorema fundamental con regla de la cadena: $F\'(x) = f(g(x))\\cdot g\'(x)$.', 'Aquí $g(x) = x^2$ y $g\'(x) = 2x$.']; },
    steps: function (d) {
      return ['$F\'(x) = \\left((x^2)^' + d.n + ' + ' + d.c + '\\right)\\cdot 2x$',
        '$F\'(' + d.x0 + ') = (' + (d.x0 * d.x0) + '^' + d.n + ' + ' + d.c + ')\\cdot 2\\cdot' + pa(d.x0) + ' = ' + d.fg + '\\cdot' + (2 * d.x0) + ' = ' + d.v + '$'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'Extremos de una función integral',
    level: 'medio',
    gen: function (r) {
      var a = r.int(-3, 2), b = r.int(a + 1, 4);
      return { a: a, b: b };
    },
    ask: function (d) {
      return 'Sin calcular la integral, halla dónde tiene un <strong>máximo relativo</strong> $F(x) = \\displaystyle\\int_0^x (t - ' + pa(d.a) + ')(t - ' + pa(d.b) + ')\\,dt$.';
    },
    fields: [{ name: 'x', label: 'máximo en x =', w: 'tiny' }],
    sol: function (d) { return { x: d.a }; },
    errores: [{ si: function (v, d) { return v.x === d.b; }, msg: 'En ese punto $F\'$ pasa de negativa a positiva: es el mínimo, no el máximo.' }],
    hint: function () { return ['Por el teorema fundamental, $F\'(x) = (x - a)(x - b)$.', 'Mira dónde $F\'$ cambia de positiva a negativa.']; },
    steps: function (d) {
      return ['$F\'(x) = (x - ' + pa(d.a) + ')(x - ' + pa(d.b) + ')$, que se anula en $' + d.a + '$ y $' + d.b + '$.',
        'Es positiva antes de $' + d.a + '$, negativa entre las dos raíces y positiva después.',
        'En $x = ' + d.a + '$ pasa de crecer a decrecer: <strong>máximo</strong>. En $x = ' + d.b + '$, mínimo.'];
    },
    answer: function (d) { return 'x = ' + d.a; }
  });

  p.exercise({
    title: 'Valor medio y el punto donde se alcanza',
    level: 'medio',
    gen: function (r) {
      var b = r.int(1, 6);
      return { b: b, media: F(b * b, 3), c: b / Math.sqrt(3) };
    },
    ask: function (d) { return 'Halla el valor medio de $f(x) = x^2$ en $[0,\\ ' + d.b + ']$ y el punto $c$ de ese intervalo en el que se alcanza (cuatro decimales).'; },
    fields: [{ name: 'm', label: 'valor medio', w: 'tiny' }, { name: 'c', label: 'c =', w: 'wide' }],
    sol: function (d) { return { m: d.media.val(), c: U.round(d.c, 6) }; },
    tol: 3e-4,
    errores: [{ si: function (v, d) { return d.b !== 1 && Math.abs(v.m - Math.pow(d.b, 3) / 3) < 1e-6; }, msg: 'Eso es la integral. El valor medio es la integral <strong>dividida por la longitud</strong> del intervalo.' }],
    hint: function (d) { return ['Valor medio $= \\frac{1}{b - a}\\int_a^b f$.', 'Luego resuelve $c^2 = $ valor medio, con $c$ en $[0, ' + d.b + ']$.']; },
    steps: function (d) {
      return ['$\\int_0^{' + d.b + '} x^2\\,dx = \\frac{' + (d.b * d.b * d.b) + '}{3}$', 'Valor medio: $\\frac{1}{' + d.b + '}\\cdot\\frac{' + (d.b * d.b * d.b) + '}{3} = ' + d.media.tex() + '$',
        '$c^2 = ' + d.media.tex() + ' \\Rightarrow c = \\frac{' + d.b + '}{\\sqrt{3}} \\approx ' + U.fmt(d.c, 4) + '$'];
    },
    answer: function (d) { return 'media ' + d.media.toString() + ', c ≈ ' + U.fmt(d.c, 4); }
  });

  p.exercise({
    title: 'Un límite con una integral dentro',
    level: 'avanzado',
    gen: function (r) {
      var kk = r.int(1, 6);
      return { k: kk, v: F(kk, 3) };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\lim_{x \\to 0} \\frac{1}{x^3}\\int_0^x \\operatorname{sen}(' + (d.k === 1 ? '' : d.k) + 't^2)\\,dt$. (Vale una fracción.)';
    },
    fields: [{ name: 'v', label: 'límite', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.k) < 1e-9 && d.k !== 0; }, msg: 'Casi: la derivada de $x^3$ es $3x^2$, y ese 3 no desaparece.' }],
    hint: function () {
      return ['Es $\\frac{0}{0}$: aplica L\'Hôpital.', 'La derivada del numerador, por el teorema fundamental, es $\\operatorname{sen}(kx^2)$; la del denominador, $3x^2$.', 'Y $\\operatorname{sen}(kx^2) \\approx kx^2$ cuando $x \\to 0$ (o aplica L\'Hôpital otra vez).'];
    },
    steps: function (d) {
      return ['$\\overset{0/0}{=} \\lim_{x \\to 0} \\dfrac{\\operatorname{sen}(' + d.k + 'x^2)}{3x^2}$',
        '$\\overset{0/0}{=} \\lim_{x \\to 0} \\dfrac{' + (2 * d.k) + 'x\\cos(' + d.k + 'x^2)}{6x} = \\dfrac{' + (2 * d.k) + '}{6} = ' + d.v.tex() + '$'];
    },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.exercise({
    title: 'Volumen de un paraboloide',
    level: 'avanzado',
    gen: function (r) {
      var kk = r.int(1, 4), h = r.int(1, 5);
      return { k: kk, h: h, V: Math.PI * kk * h * h / 2 };
    },
    ask: function (d) {
      return 'Calcula el volumen del cuerpo que se obtiene al girar alrededor del eje $x$ la curva $y = \\sqrt{' + (d.k === 1 ? '' : d.k) + 'x}$ entre $x = 0$ y $x = ' + d.h + '$ (cuatro decimales, o con <em>pi</em>).';
    },
    fields: [{ name: 'v', label: 'volumen', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.V, 6) }; },
    tol: 3e-4,
    errores: [
      { si: function (v, d) { return Math.abs(v.v - d.k * d.h * d.h / 2) < 1e-3; }, msg: 'Falta el factor $\\pi$: cada disco tiene área $\\pi r^2$.' },
      { si: function (v, d) { return Math.abs(v.v - Math.PI * (2 / 3) * Math.sqrt(d.k) * Math.pow(d.h, 1.5)) < 1e-3; }, msg: 'Has integrado $f(x)$ en vez de $f(x)^2$: el radio de cada disco va al cuadrado.' }
    ],
    hint: function () { return ['$V = \\pi\\int_a^b f(x)^2\\,dx$.', 'Aquí $f(x)^2 = kx$, que se integra enseguida.']; },
    steps: function (d) {
      return ['$V = \\pi\\displaystyle\\int_0^{' + d.h + '} ' + (d.k === 1 ? '' : d.k) + 'x\\,dx = \\pi\\left[\\frac{' + d.k + 'x^2}{2}\\right]_0^{' + d.h + '} = \\frac{' + (d.k * d.h * d.h) + '\\pi}{2} \\approx ' + U.fmt(d.V, 4) + '$'];
    },
    answer: function (d) { return '$\\frac{' + (d.k * d.h * d.h) + '\\pi}{2} \\approx ' + U.fmt(d.V, 4) + '$'; }
  });

  p.keys([
    'La función integral $F(x) = \\int_a^x f(t)\\,dt$ acumula área: $F(a) = 0$, crece donde $f > 0$ y decrece donde $f < 0$.',
    '<strong>Teorema fundamental</strong>: si $f$ es continua, $F\'(x) = f(x)$. Integrar y derivar son inversas.',
    'Con extremo variable: $\\frac{d}{dx}\\int_a^{g(x)} f = f(g(x))\\,g\'(x)$. No olvidar $g\'$.',
    'Extremos de $F$: se estudia el signo de $f$, sin calcular la integral.',
    'Límites con integrales: L\'Hôpital, derivando la integral con el teorema fundamental.',
    'Valor medio de $f$ en $[a,b]$: $\\frac{1}{b-a}\\int_a^b f$, y se alcanza en algún $c$ del intervalo.',
    'Volumen de revolución: $V = \\pi\\int_a^b f(x)^2\\,dx$.'
  ]);
});
