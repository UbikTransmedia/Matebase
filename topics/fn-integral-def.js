/* Tema: Integral definida y áreas */
Course.topic('fn-integral-def', function (p) {

  p.text('¿Cuánta superficie hay debajo de una curva? Para un rectángulo o un triángulo es fácil. ' +
    'Para una curva cualquiera, la idea que funciona es de una sencillez brutal: <strong>rellenarla ' +
    'con rectángulos</strong> y hacerlos cada vez más finos.');

  p.demo({
    title: 'Sumas de Riemann',
    intro: 'Aumenta el número de rectángulos y mira cómo el error se desploma. En el límite, la suma de infinitos rectángulos infinitamente finos es exactamente el área.',
    build: function (host, d) {
      var n = 6, modo = 'medio';
      var f = function (x) { return 0.35 * x * x + 0.4; };
      var a = 0, b = 4;
      var exacta = 0.35 * Math.pow(b, 3) / 3 + 0.4 * b;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 4.8, ymin: 0, ymax: 7, height: 310,
        draw: function (g) {
          var h = (b - a) / n;
          for (var i = 0; i < n; i++) {
            var x0 = a + i * h;
            var xs = modo === 'izq' ? x0 : (modo === 'der' ? x0 + h : x0 + h / 2);
            g.rect(x0, 0, h, f(xs), { color: 3, fill: 3, fillAlpha: .35, w: 1 });
          }
          g.fn(f, { color: 0, w: 2.8 });
        }
      });
      function paint() {
        var h = (b - a) / n, S = 0;
        for (var i = 0; i < n; i++) {
          var x0 = a + i * h;
          var xs = modo === 'izq' ? x0 : (modo === 'der' ? x0 + h : x0 + h / 2);
          S += f(xs) * h;
        }
        out.set('$' + n + '$ ' + U.plural(n, 'rectángulo', 'rectángulos') + ' de anchura $' + U.fmt(h, 4) + '$<br>' +
          'Suma de sus áreas: <strong>' + U.fmt(S, 6) + '</strong><br>' +
          'Área exacta: $' + U.fmt(exacta, 6) + '$ &nbsp;·&nbsp; error: $' + U.fmt(Math.abs(S - exacta), 6) + '$');
        plot.render();
      }
      W.chips(host, [
        { label: 'altura por la izquierda', value: 'izq' },
        { label: 'por el punto medio', value: 'medio' },
        { label: 'por la derecha', value: 'der' }
      ], { value: 'medio', on: function (v) { modo = v; paint(); } });
      W.slider(W.row(host), { label: 'número de rectángulos', min: 1, max: 120, step: 1, value: 6, dec: 0, on: function (v) { n = v; paint(); } });
      paint();
    }
  });

  p.formula('\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty} \\sum_{i=1}^{n} f(x_i)\\,\\Delta x',
    'definición como suma de Riemann');

  p.text('El símbolo $\\int$ es una «S» alargada de <em>summa</em>, y el $dx$ es la anchura ' +
    'infinitesimal de cada rectángulo. La notación, de Leibniz, describe literalmente lo que se está ' +
    'haciendo.');

  /* ---------------------------------------------------------------- */
  p.section('La regla de Barrow');

  p.text('Calcular ese límite a mano es horroroso. Y aquí llega el resultado que hace que todo el ' +
    'cálculo funcione, el <strong>teorema fundamental del cálculo</strong>: para hallar un área no ' +
    'hace falta sumar nada. Basta con encontrar una primitiva.');

  p.formula('\\int_a^b f(x)\\,dx = F(b) - F(a) \\qquad \\text{donde } F\' = f', 'regla de Barrow');

  p.note('Esto es asombroso y conviene detenerse un segundo. El <strong>área</strong> bajo una curva ' +
    'y la <strong>pendiente</strong> de su tangente parecen dos problemas sin nada que ver: uno es ' +
    'geométrico y global, el otro es local. El teorema fundamental dice que son operaciones ' +
    '<em>inversas</em>. Newton y Leibniz lo descubrieron a la vez y por caminos distintos, y es la ' +
    'razón de que se les considere los creadores del cálculo: los problemas sueltos ya se conocían; ' +
    'lo que faltaba era ver que eran el mismo.', 'ok', 'El teorema que unió dos mundos');

  p.formula('\\int_0^2 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{8}{3} - 0 = \\frac{8}{3}');

  /* ---------------------------------------------------------------- */
  p.section('Cuidado con los signos');

  p.text('La integral definida no es exactamente «el área»: es un <strong>área con signo</strong>. Lo ' +
    'que queda por debajo del eje X cuenta en negativo.');

  p.demo({
    title: 'Área con signo',
    intro: 'Mueve los límites de integración. Cuando el tramo cruza el eje, las dos partes se restan entre sí.',
    build: function (host, d) {
      var a = -1, b = 2.5;
      var f = function (x) { return x * x * x / 3 - x; };
      var F = function (x) { return Math.pow(x, 4) / 12 - x * x / 2; };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3, xmax: 3.2, ymin: -2.5, ymax: 3, height: 300,
        draw: function (g) {
          var lo = Math.min(a, b), hi = Math.max(a, b);
          var pasos = 200;
          for (var i = 0; i < pasos; i++) {
            var x0 = lo + (hi - lo) * i / pasos;
            var x1 = lo + (hi - lo) * (i + 1) / pasos;
            var y = f((x0 + x1) / 2);
            g.rect(x0, 0, x1 - x0, y, { color: y >= 0 ? 2 : 1, fill: y >= 0 ? 2 : 1, fillAlpha: .3, stroke: false, w: 0 });
          }
          g.fn(f, { color: 0, w: 2.8 });
          g.vline(a, { color: 'axis', w: 1.4, dash: true });
          g.vline(b, { color: 'axis', w: 1.4, dash: true });
        }
      });
      function paint() {
        var I = F(b) - F(a);
        out.set('$\\displaystyle\\int_{' + U.fmt(a, 2) + '}^{' + U.fmt(b, 2) + '} \\left(\\frac{x^3}{3}-x\\right)dx = ' +
          U.fmt(I, 5) + '$<br>' +
          '<span style="color:var(--c3)">verde: cuenta positivo</span> &nbsp;·&nbsp; ' +
          '<span style="color:var(--c2)">rojo: cuenta negativo</span><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Si lo que quieres es el área ' +
          'geométrica de verdad, hay que partir la integral por los cortes con el eje y sumar los ' +
          'valores absolutos.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'límite inferior a', min: -3, max: 3, step: 0.1, value: -1, dec: 2, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'límite superior b', min: -3, max: 3, step: 0.1, value: 2.5, dec: 2, on: function (v) { b = v; paint(); } });
      paint();
    }
  });

  p.text('Por eso, para calcular el <strong>área encerrada</strong> (siempre positiva) hay que:');

  p.list([
    'Hallar los <strong>cortes con el eje X</strong> dentro del intervalo.',
    'Partir la integral en esos puntos.',
    'Calcular cada trozo y sumar sus <strong>valores absolutos</strong>.'
  ], true);

  p.section('Área entre dos curvas');

  p.formula('A = \\int_a^b \\left[f(x) - g(x)\\right]dx', 'con f por encima de g');

  p.text('Los límites $a$ y $b$ son los puntos donde las dos curvas se cortan: se obtienen resolviendo ' +
    '$f(x) = g(x)$.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Integral definida de un polinomio',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-4, 4), b = r.pm(0, 6), c = r.pm(0, 8);
      var lo = r.pm(0, 3), hi = lo + r.int(1, 4);
      var F = function (x) { return a * Math.pow(x, 3) / 3 + b * x * x / 2 + c * x; };
      return { a: a, b: b, c: c, lo: lo, hi: hi, val: F(hi) - F(lo) };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\int_{' + d.lo + '}^{' + d.hi + '} \\left(' +
        ML.polyTex([d.a, d.b, d.c]) + '\\right)dx$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Halla la primitiva y aplica Barrow: $F(b) - F(a)$. La constante $C$ se cancela, así que no hace falta.'; },
    steps: function (d) {
      var F = function (x) { return d.a * Math.pow(x, 3) / 3 + d.b * x * x / 2 + d.c * x; };
      return ['Primitiva: $F(x) = \\dfrac{' + d.a + 'x^3}{3} + \\dfrac{' + d.b + 'x^2}{2} + ' + d.c + 'x$.',
        '$F(' + d.hi + ') = ' + U.fmt(F(d.hi), 5) + '$',
        '$F(' + d.lo + ') = ' + U.fmt(F(d.lo), 5) + '$',
        'Barrow: $' + U.fmt(F(d.hi), 5) + ' - (' + U.fmt(F(d.lo), 5) + ') = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Área bajo una parábola',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pm(0, 4), x2 = x1 + r.int(2, 6);
      // f(x) = (x-x1)(x2-x)  ->  positiva entre las raices
      var a = -1, b = x1 + x2, c = -x1 * x2;
      var F = function (x) { return a * Math.pow(x, 3) / 3 + b * x * x / 2 + c * x; };
      return { x1: x1, x2: x2, a: a, b: b, c: c, val: F(x2) - F(x1) };
    },
    ask: function (d) {
      return 'Calcula el área encerrada entre la curva $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) +
        '$ y el eje X (cuatro decimales).';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: d.x1 - 2, xmax: d.x2 + 2,
        ymin: -1, ymax: Math.pow((d.x2 - d.x1) / 2, 2) + 2, height: 230,
        draw: function (g) {
          var f = function (x) { return d.a * x * x + d.b * x + d.c; };
          g.area(f, d.x1, d.x2, { fill: 2, fillAlpha: .3 });
          g.fn(f, { color: 0, w: 2.6 });
          g.point(d.x1, 0, { color: 1, r: 5 });
          g.point(d.x2, 0, { color: 1, r: 5 });
        }
      });
    },
    fields: [{ name: 'v', label: 'Área', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Los límites de integración son los cortes con el eje: $' + d.x1 + '$ y $' + d.x2 + '$.'; },
    steps: function (d) {
      var F = function (x) { return d.a * Math.pow(x, 3) / 3 + d.b * x * x / 2 + d.c * x; };
      return ['Cortes con el eje X: resolvemos $' + ML.polyTex([d.a, d.b, d.c]) + ' = 0$ → $x = ' + d.x1 + '$ y $x = ' + d.x2 + '$.',
        'Entre esos dos puntos la curva está por encima del eje, así que la integral ya da el área directamente.',
        '$A = \\displaystyle\\int_{' + d.x1 + '}^{' + d.x2 + '} f(x)\\,dx = F(' + d.x2 + ') - F(' + d.x1 + ')$',
        '$= ' + U.fmt(F(d.x2), 5) + ' - (' + U.fmt(F(d.x1), 5) + ') = ' + U.fmt(d.val, 4) + '$',
        'Curiosidad: esta área es siempre $\\frac{(x_2-x_1)^3}{6} = ' + U.fmt(Math.pow(d.x2 - d.x1, 3) / 6, 4) + '$.'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Área entre dos curvas',
    level: 'avanzado',
    gen: function (r) {
      var x1 = r.pm(0, 3), x2 = x1 + r.int(2, 5);
      // parabola x^2 + m x + n  y recta:  la diferencia es -(x-x1)(x-x2)
      var m = r.pm(0, 4);
      return { x1: x1, x2: x2, m: m, val: Math.pow(x2 - x1, 3) / 6 };
    },
    ask: function (d) {
      // f(x) = -x^2 + (x1+x2) x - x1 x2 + (m x)   ,  g(x) = m x
      var b = d.x1 + d.x2, c = -d.x1 * d.x2;
      return 'Calcula el área encerrada entre la parábola $f(x) = ' +
        ML.polyTex([-1, b + d.m, c]) + '$ y la recta $g(x) = ' + ML.termTex(d.m, 'x', 1, true) +
        '$ (cuatro decimales).';
    },
    show: function (d, host) {
      var b = d.x1 + d.x2, c = -d.x1 * d.x2;
      var f = function (x) { return -x * x + (b + d.m) * x + c; };
      var g2 = function (x) { return d.m * x; };
      W.plot(host, {
        xmin: d.x1 - 2, xmax: d.x2 + 2,
        ymin: Math.min(g2(d.x1 - 2), g2(d.x2 + 2), 0) - 3,
        ymax: Math.max(f((d.x1 + d.x2) / 2), g2(d.x2 + 2)) + 3,
        height: 240,
        draw: function (gg) {
          var pasos = 120;
          for (var i = 0; i < pasos; i++) {
            var xa = d.x1 + (d.x2 - d.x1) * i / pasos;
            var xb = d.x1 + (d.x2 - d.x1) * (i + 1) / pasos;
            var xm = (xa + xb) / 2;
            gg.rect(xa, g2(xm), xb - xa, f(xm) - g2(xm), { color: 2, fill: 2, fillAlpha: .28, stroke: false, w: 0 });
          }
          gg.fn(f, { color: 0, w: 2.6 });
          gg.fn(g2, { color: 1, w: 2.4 });
          gg.point(d.x1, g2(d.x1), { color: 3, r: 5 });
          gg.point(d.x2, g2(d.x2), { color: 3, r: 5 });
        }
      });
    },
    fields: [{ name: 'v', label: 'Área', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Iguala las dos funciones para hallar los cortes: salen $x = ' + d.x1 + '$ y $x = ' + d.x2 + '$. Después integra la diferencia.'; },
    steps: function (d) {
      return ['Cortes: resolvemos $f(x) = g(x)$, y salen $x = ' + d.x1 + '$ y $x = ' + d.x2 + '$.',
        'Entre ellos la parábola va por encima de la recta.',
        '$f(x) - g(x) = -(x - ' + d.x1 + ')(x - ' + d.x2 + ')$',
        '$A = \\displaystyle\\int_{' + d.x1 + '}^{' + d.x2 + '} \\left[f(x)-g(x)\\right]dx = ' + U.fmt(d.val, 4) + '$',
        'De nuevo sale $\\frac{(x_2-x_1)^3}{6}$: el área entre una parábola y una recta solo depende de la distancia entre los cortes.'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Área con signo',
    level: 'avanzado',
    gen: function (r) {
      var k = r.int(1, 5);
      var lo = -k, hi = r.int(1, k);
      // f(x) = x  ->  integral = (hi^2 - lo^2)/2 ,  area = (lo^2 + hi^2)/2
      return { k: k, lo: lo, hi: hi, integral: (hi * hi - lo * lo) / 2, area: (lo * lo + hi * hi) / 2 };
    },
    ask: function (d) {
      return 'Para $f(x) = x$ entre $x = ' + d.lo + '$ y $x = ' + d.hi + '$, calcula por separado ' +
        'el <strong>valor de la integral</strong> y el <strong>área geométrica</strong> encerrada.';
    },
    fields: [{ name: 'i', label: 'Integral', w: 'tiny' }, { name: 'a', label: 'Área', w: 'tiny' }],
    sol: function (d) { return { i: d.integral, a: d.area }; },
    tol: 1e-6,
    hint: function () { return 'La parte que está por debajo del eje cuenta negativa en la integral, pero para el área hay que tomar su valor absoluto.'; },
    steps: function (d) {
      return ['La función corta al eje en $x = 0$, dentro del intervalo: hay que partir en dos.',
        'De $' + d.lo + '$ a $0$ la función es negativa: $\\int = ' + U.fmt(-d.lo * d.lo / 2, 3) + '$.',
        'De $0$ a $' + d.hi + '$ es positiva: $\\int = ' + U.fmt(d.hi * d.hi / 2, 3) + '$.',
        'La <strong>integral</strong> los suma con su signo: $' + U.fmt(d.integral, 4) + '$.',
        'El <strong>área</strong> suma los valores absolutos: $' + U.fmt(d.area, 4) + '$.'];
    },
    answer: function (d) { return 'Integral ' + U.fmt(d.integral, 4) + ', área ' + U.fmt(d.area, 4) + '.'; }
  });

  p.keys([
    'La integral definida nace de llenar el área con rectángulos y afinarlos hasta el límite.',
    '<strong>Regla de Barrow</strong>: $\\int_a^b f = F(b)-F(a)$. No hace falta sumar nada, solo una primitiva.',
    'El teorema fundamental dice que derivar e integrar son operaciones inversas: es la piedra angular del cálculo.',
    'La integral da un <strong>área con signo</strong>: lo que está bajo el eje resta.',
    'Para el área geométrica: partir por los cortes con el eje y sumar valores absolutos.',
    'Entre dos curvas: $\\int_a^b (f-g)$, con $a$ y $b$ los puntos de corte.'
  ]);
});
