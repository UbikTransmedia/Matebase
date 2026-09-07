/* Tema: Análisis numérico */
Course.topic('av-numerico', function (p) {

  p.text('Casi todo lo que has aprendido a resolver tiene fórmula: la ecuación de segundo grado, las ' +
    'integrales inmediatas, los sistemas lineales. Pero la inmensa mayoría de los problemas reales ' +
    '<strong>no tienen fórmula</strong>. No es que sea difícil encontrarla: es que se ha demostrado ' +
    'que no existe.');

  p.list([
    'Las ecuaciones polinómicas de grado 5 o más no tienen fórmula general con radicales (Abel y Galois, siglo XIX).',
    '$x = \\cos x$ no se puede despejar.',
    '$\\int e^{-x^2}dx$ no tiene primitiva elemental, y es la integral central de toda la estadística.',
    'El problema de los tres cuerpos no tiene solución cerrada.'
  ]);

  p.text('El <strong>análisis numérico</strong> es la disciplina que responde: si no puedo resolverlo ' +
    'exactamente, lo <em>aproximo</em> tanto como quiera, y además <strong>demuestro cuánto me estoy ' +
    'equivocando</strong>. Es lo que hace por dentro cualquier calculadora, simulador o motor de física.');

  /* ---------------------------------------------------------------- */
  p.section('Bisección: lento pero infalible');

  p.text('Si una función continua vale negativo en $a$ y positivo en $b$, en algún punto de en medio ' +
    'tiene que valer cero (teorema de Bolzano). La bisección explota esa idea de la forma más simple ' +
    'posible: partir el intervalo por la mitad y quedarse con el trozo donde sigue habiendo cambio de signo.');

  p.formula('|error| \\le \\frac{b-a}{2^n}', 'tras n pasos');

  p.demo({
    title: 'Bisección paso a paso',
    intro: 'Cada paso divide el intervalo por la mitad. Es lento pero nunca falla: el error se divide entre dos garantizado.',
    build: function (host, d) {
      var f = function (x) { return x * x * x - x - 2; };
      var a0 = 1, b0 = 2;
      var a = a0, b = b0, n = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0.8, xmax: 2.2, ymin: -3, ymax: 5, height: 300,
        draw: function (g) {
          g.fn(f, { color: 0, w: 2.6 });
          g.hline(0, { color: 'axis', w: 1.2 });
          g.rect(a, -3, b - a, 8, { color: 2, fill: 2, fillAlpha: .15, stroke: false, w: 0 });
          g.vline(a, { color: 2, w: 2, dash: true });
          g.vline(b, { color: 2, w: 2, dash: true });
          var m = (a + b) / 2;
          g.point(m, f(m), { color: 1, r: 6 });
          g.point(m, 0, { color: 1, r: 5, hollow: true });
        }
      });
      function paint() {
        var m = (a + b) / 2;
        out.set('Paso <strong>' + n + '</strong> &nbsp;·&nbsp; intervalo $[' + U.fmt(a, 8) + ',\\ ' + U.fmt(b, 8) + ']$<br>' +
          'Punto medio: $' + U.fmt(m, 8) + '$, con $f = ' + U.fmt(f(m), 8) + '$<br>' +
          'Error máximo: $\\dfrac{' + (b0 - a0) + '}{2^{' + n + '}} = ' + U.fmt((b0 - a0) / Math.pow(2, n), 10) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Raíz real: 1,5213797…</span>');
        plot.render();
      }
      W.buttons(host, [
        {
          t: 'Siguiente paso →', cls: 'btn--main', on: function () {
            var m = (a + b) / 2;
            if (f(a) * f(m) <= 0) b = m; else a = m;
            n++; paint();
          }
        },
        { t: '+10 pasos', on: function () {
            for (var i = 0; i < 10; i++) {
              var m = (a + b) / 2;
              if (f(a) * f(m) <= 0) b = m; else a = m;
              n++;
            }
            paint();
          }
        },
        { t: '↺ Reiniciar', on: function () { a = a0; b = b0; n = 0; paint(); } }
      ]);
      W.hint(host, 'La ecuación es x³ − x − 2 = 0, que no se puede resolver con radicales de forma cómoda.');
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Newton-Raphson: rapidísimo');

  p.text('En vez de partir intervalos, Newton usa la <strong>tangente</strong>: si la función se ' +
    'parece a su tangente cerca de la raíz, el corte de la tangente con el eje está muy cerca de la ' +
    'raíz. Se repite, y la aproximación mejora vertiginosamente.');

  p.formula('x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}');

  p.note('La convergencia de Newton es <strong>cuadrática</strong>: el número de decimales correctos ' +
    'se <em>duplica</em> en cada paso. Donde la bisección necesita 40 pasos para 12 decimales, Newton ' +
    'necesita 4 o 5. Es el algoritmo que usa tu calculadora para las raíces cuadradas.',
    'ok', 'Por qué se usa Newton y no bisección');

  p.demo({
    title: 'Newton-Raphson',
    intro: 'Desde el punto elegido se traza la tangente y se salta a donde corta el eje. Mira cuántos decimales se ganan en cada paso.',
    build: function (host, d) {
      var f = function (x) { return x * x * x - x - 2; };
      var fp = function (x) { return 3 * x * x - 1; };
      var x0 = 2, x = 2, n = 0;
      var hist = [2];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0.9, xmax: 2.4, ymin: -3, ymax: 6, height: 310,
        draw: function (g) {
          g.fn(f, { color: 0, w: 2.6 });
          g.hline(0, { color: 'axis', w: 1.2 });
          hist.forEach(function (xi, i) {
            if (i === hist.length - 1) return;
            g.seg(xi, f(xi), hist[i + 1], 0, { color: 3, w: 1.6, alpha: .7 });
            g.seg(hist[i + 1], 0, hist[i + 1], f(hist[i + 1]), { color: 3, w: 1.2, dash: true, alpha: .5 });
          });
          g.point(x, f(x), { color: 1, r: 6 });
          g.point(x, 0, { color: 2, r: 5 });
        }
      });
      function paint() {
        var raiz = 1.5213797068045676;
        var err = Math.abs(x - raiz);
        var dec = err > 0 ? Math.max(0, Math.floor(-Math.log(err) / Math.LN10)) : 16;
        out.set('Paso <strong>' + n + '</strong> &nbsp;·&nbsp; $x_{' + n + '} = ' + U.fmt(x, 12) + '$<br>' +
          'Error: $' + (err === 0 ? '0' : err.toExponential(3)) + '$ → unos <strong>' + dec +
          ' decimales correctos</strong><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Cada paso aproximadamente duplica ' +
          'los decimales buenos. Con bisección harían falta ' + Math.round(dec * 3.32) + ' pasos para lo mismo.</span>');
        plot.render();
      }
      W.buttons(host, [
        {
          t: 'Siguiente paso →', cls: 'btn--main', on: function () {
            if (Math.abs(fp(x)) < 1e-12) return;
            x = x - f(x) / fp(x);
            hist.push(x); n++; paint();
          }
        },
        { t: '↺ Reiniciar', on: function () { x = x0; hist = [x0]; n = 0; paint(); } }
      ]);
      W.slider(W.row(host), {
        label: 'punto de partida', min: 1.1, max: 2.4, step: 0.05, value: 2, dec: 2,
        on: function (v) { x0 = v; x = v; hist = [v]; n = 0; paint(); }
      });
      paint();
    }
  });

  p.note('Newton no siempre converge. Si la derivada se anula cerca, la tangente es casi horizontal y ' +
    'el salto se va lejísimos; y con ciertos puntos de partida el método entra en un ciclo. La ' +
    'bisección es lenta pero <strong>siempre</strong> funciona; Newton es veloz pero hay que vigilarlo. ' +
    'Ese compromiso entre velocidad y robustez recorre todo el análisis numérico.', 'warn');

  /* ---------------------------------------------------------------- */
  p.util('El método de Newton es el que ejecuta tu calculadora al pulsar la tecla de la raíz cuadrada, y ' +
    'el que resuelve por dentro casi cualquier ecuación que no tenga fórmula. Su velocidad —cada ' +
    'paso duplica las cifras correctas— es lo que permite que un simulador estructural o un programa ' +
    'de circuitos resuelva millones de ecuaciones no lineales en segundos. Su punto débil, que se ' +
    'despiste si la derivada es pequeña, es la razón de que los programas serios lo combinen con la ' +
    'bisección.');

  p.section('Integración numérica');

  p.text('Si una integral no tiene primitiva, se aproxima el área con figuras sencillas. Es ' +
    'exactamente la idea de las sumas de Riemann, refinada:');

  p.formulas([
    'T = \\frac{h}{2}\\left[f_0 + 2f_1 + \\dots + 2f_{n-1} + f_n\\right] \\quad \\text{(trapecios)}',
    'S = \\frac{h}{3}\\left[f_0 + 4f_1 + 2f_2 + \\dots + 4f_{n-1} + f_n\\right] \\quad \\text{(Simpson)}'
  ]);

  p.text('El método de los trapecios sustituye la curva por segmentos; el de Simpson, por ' +
    '<strong>parábolas</strong>, y por eso es muchísimo más preciso con el mismo esfuerzo.');

  p.demo({
    title: 'Trapecios contra Simpson',
    intro: 'Aproximaciones de la misma integral. Compara los errores con el mismo número de subintervalos: Simpson gana por goleada.',
    build: function (host, d) {
      var n = 4;
      var f = function (x) { return Math.exp(-x * x); };
      var a = 0, b = 2;
      var exacta = 0.8820813907624215;   // ∫₀² e^{-x²} dx
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.3, xmax: 2.3, ymin: -0.15, ymax: 1.2, height: 280,
        ystep: 0.25,
        draw: function (g) {
          var h = (b - a) / n;
          for (var i = 0; i < n; i++) {
            var x0 = a + i * h, x1 = x0 + h;
            g.poly([[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]],
              { color: 3, fill: 3, fillAlpha: .3, w: 1.2 });
          }
          g.fn(f, { color: 0, w: 2.8 });
        }
      });
      function paint() {
        var h = (b - a) / n;
        var T = 0;
        for (var i = 0; i <= n; i++) T += (i === 0 || i === n ? 1 : 2) * f(a + i * h);
        T *= h / 2;
        var S = null;
        if (n % 2 === 0) {
          S = 0;
          for (var j = 0; j <= n; j++) S += (j === 0 || j === n ? 1 : (j % 2 ? 4 : 2)) * f(a + j * h);
          S *= h / 3;
        }
        out.set('$\\displaystyle\\int_0^2 e^{-x^2}dx$ &nbsp;(sin primitiva elemental)<br>' +
          'Valor exacto: $' + U.fmt(exacta, 10) + '$<br>' +
          'Trapecios con $n = ' + n + '$: $' + U.fmt(T, 10) + '$ — error $' + Math.abs(T - exacta).toExponential(2) + '$<br>' +
          (S !== null
            ? 'Simpson con $n = ' + n + '$: $' + U.fmt(S, 10) + '$ — error <strong>$' + Math.abs(S - exacta).toExponential(2) + '$</strong>'
            : '<span style="color:var(--ink-faint)">Simpson necesita un número par de subintervalos.</span>'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'subintervalos', min: 2, max: 40, step: 1, value: 4, dec: 0, on: function (v) { n = v; paint(); } });
      paint();
    }
  });

  p.section('Errores: lo que de verdad estudia esta disciplina');
  p.text('Aquí llega lo que distingue al cálculo numérico de la mera programación. Un ordenador no guarda ' +
    'números exactos sino aproximaciones con unas cuantas cifras, así que cada operación introduce ' +
    'un error minúsculo. El asunto no es que exista ese error, sino <strong>cómo se comporta al ' +
    'acumularse</strong> a lo largo de millones de operaciones: si se mantiene a raya, el resultado ' +
    'sirve; si se amplifica, el resultado es basura con aspecto de número.');


  p.list([
    '<strong>Error de truncamiento</strong>: el que viene de sustituir el problema infinito por uno finito. Se controla afinando el método.',
    '<strong>Error de redondeo</strong>: el ordenador guarda unos 16 dígitos, así que cada operación redondea. Millones de operaciones acumulan error.',
    '<strong>Inestabilidad</strong>: hay algoritmos en los que un error minúsculo se amplifica hasta arruinar el resultado. Elegir un método estable es tan importante como que sea rápido.'
  ]);

  p.note('Un ejemplo célebre: restar dos números casi iguales es catastrófico en coma flotante. ' +
    'Para $x^2+bx+c=0$ con $b$ grande y positivo, la fórmula habitual pierde casi todos los decimales ' +
    'en una de las raíces por culpa de la resta $-b+\\sqrt{b^2-4c}$. La solución es calcular esa raíz ' +
    'como $\\frac{2c}{-b-\\sqrt{b^2-4c}}$, que es algebraicamente idéntico y numéricamente muchísimo ' +
    'mejor. Misma matemática, resultados distintos.', 'warn', 'La misma fórmula, mejor escrita');

  /* ================= EJERCICIOS ================= */
  p.util('El error numérico ha costado vidas. En 1991, una batería Patriot falló al interceptar un misil ' +
    'en Dhahran y murieron 28 personas: el reloj interno acumulaba un error de redondeo minúsculo ' +
    'que, tras cien horas encendido, se había convertido en un tercio de segundo, suficiente para ' +
    'errar el blanco por medio kilómetro. En 1996, el Ariane 5 se autodestruyó a los 37 segundos por ' +
    'una conversión numérica que desbordó. Estudiar el error no es pedantería académica.');

  p.section('Practica');

  p.exercise({
    title: 'Un paso de bisección',
    level: 'basico',
    gen: function (r) {
      var a = r.int(0, 5), b = a + r.int(1, 4);
      var pasos = r.int(1, 12);
      return { a: a, b: b, pasos: pasos, err: (b - a) / Math.pow(2, pasos) };
    },
    ask: function (d) {
      return 'Se aplica bisección en el intervalo $[' + d.a + ', ' + d.b + ']$. ¿Cuál es el error ' +
        'máximo garantizado después de $' + d.pasos + '$ pasos? (seis decimales)';
    },
    fields: [{ name: 'v', label: 'Error máximo', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.err, 10) }; },
    tol: 3e-5,
    hint: function (d) { return 'Cada paso divide el intervalo entre dos: $\\frac{b-a}{2^n}$.'; },
    steps: function (d) {
      return ['Longitud inicial: $' + d.b + ' - ' + d.a + ' = ' + (d.b - d.a) + '$.',
        'Cada paso la reduce a la mitad, así que tras $' + d.pasos + '$ pasos queda $\\dfrac{' + (d.b - d.a) +
        '}{2^{' + d.pasos + '}}$.',
        '$= \\dfrac{' + (d.b - d.a) + '}{' + Math.pow(2, d.pasos) + '} = ' + U.fmt(d.err, 8) + '$',
        'Para ganar un decimal más hacen falta unos 3,3 pasos adicionales.'];
    },
    answer: function (d) { return U.fmt(d.err, 8); }
  });

  p.exercise({
    title: 'Una iteración de Newton',
    level: 'medio',
    gen: function (r) {
      var c = r.int(2, 40);
      var x0 = r.int(1, 8);
      // f(x) = x^2 - c  ->  x1 = (x0 + c/x0)/2
      var x1 = (x0 + c / x0) / 2;
      return { c: c, x0: x0, x1: x1 };
    },
    ask: function (d) {
      return 'Para calcular $\\sqrt{' + d.c + '}$ se aplica Newton a $f(x) = x^2 - ' + d.c +
        '$, lo que da la iteración $x_{n+1} = \\frac{1}{2}\\left(x_n + \\frac{' + d.c +
        '}{x_n}\\right)$. Partiendo de $x_0 = ' + d.x0 + '$, calcula $x_1$ (seis decimales).';
    },
    fields: [{ name: 'v', label: 'x₁', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.x1, 8) }; },
    tol: 3e-5,
    hint: function (d) { return 'Sustituye directamente: $\\frac{1}{2}\\left(' + d.x0 + ' + \\frac{' + d.c + '}{' + d.x0 + '}\\right)$.'; },
    steps: function (d) {
      return ['$x_1 = \\dfrac{1}{2}\\left(' + d.x0 + ' + \\dfrac{' + d.c + '}{' + d.x0 + '}\\right)$',
        '$= \\dfrac{1}{2}\\left(' + d.x0 + ' + ' + U.fmt(d.c / d.x0, 6) + '\\right) = ' + U.fmt(d.x1, 6) + '$',
        'El valor real de $\\sqrt{' + d.c + '}$ es $' + U.fmt(Math.sqrt(d.c), 8) + '$: ya en un paso ' +
        'el error ha bajado a $' + Math.abs(d.x1 - Math.sqrt(d.c)).toExponential(2) + '$.',
        'Esta fórmula, por cierto, ya la usaban los babilonios hace 3800 años para extraer raíces.'];
    },
    answer: function (d) { return U.fmt(d.x1, 6); }
  });

  p.exercise({
    title: 'Regla de los trapecios',
    level: 'avanzado',
    gen: function (r) {
      var a = 0, b = r.int(1, 4), n = r.pick([2, 4]);
      var k = r.int(1, 3);
      var f = function (x) { return k * x * x; };
      var h = (b - a) / n;
      var T = 0;
      for (var i = 0; i <= n; i++) T += (i === 0 || i === n ? 1 : 2) * f(a + i * h);
      T *= h / 2;
      return { a: a, b: b, n: n, k: k, T: T, exacta: k * Math.pow(b, 3) / 3 };
    },
    ask: function (d) {
      return 'Aproxima $\\displaystyle\\int_{0}^{' + d.b + '} ' + d.k + 'x^2\\,dx$ por la regla de los ' +
        'trapecios con $n = ' + d.n + '$ subintervalos (seis decimales).';
    },
    fields: [{ name: 'v', label: 'Aproximación', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.T, 8) }; },
    tol: 3e-5,
    hint: function (d) { return 'Paso $h = \\frac{' + d.b + '}{' + d.n + '} = ' + U.fmt(d.b / d.n, 4) + '$. Los extremos pesan 1 y los interiores 2.'; },
    steps: function (d) {
      var h = (d.b - d.a) / d.n;
      var vals = [];
      for (var i = 0; i <= d.n; i++) vals.push(U.fmt(d.k * Math.pow(d.a + i * h, 2), 4));
      return ['Paso: $h = \\dfrac{' + d.b + ' - 0}{' + d.n + '} = ' + U.fmt(h, 4) + '$.',
        'Valores de la función: $' + vals.join(',\\ ') + '$.',
        '$T = \\dfrac{h}{2}\\left[f_0 + 2f_1 + \\dots + f_n\\right] = ' + U.fmt(d.T, 6) + '$',
        'Valor exacto: $' + U.fmt(d.exacta, 6) + '$. El error es $' + U.fmt(Math.abs(d.T - d.exacta), 6) +
        '$, y los trapecios <strong>siempre sobrestiman</strong> una función convexa.'];
    },
    answer: function (d) { return U.fmt(d.T, 6); }
  });

  p.exercise({
    title: 'Cuántos pasos hacen falta',
    level: 'medio',
    gen: function (r) {
      var a = 0, b = r.int(1, 8);
      var dec = r.int(3, 10);
      var tol = Math.pow(10, -dec);
      var n = Math.ceil(Math.log((b - a) / tol) / Math.LN2);
      return { a: a, b: b, dec: dec, n: n };
    },
    ask: function (d) {
      return 'Con bisección en $[0, ' + d.b + ']$, ¿cuántos pasos hacen falta como mínimo para ' +
        'garantizar un error menor que $10^{-' + d.dec + '}$?';
    },
    fields: [{ name: 'n', label: 'Pasos', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function (d) { return 'Hay que resolver $\\frac{' + d.b + '}{2^n} < 10^{-' + d.dec + '}$ tomando logaritmos, y redondear hacia arriba.'; },
    steps: function (d) {
      return ['Queremos $\\dfrac{' + d.b + '}{2^n} < 10^{-' + d.dec + '}$.',
        'Es decir, $2^n > ' + d.b + ' \\cdot 10^{' + d.dec + '}$.',
        'Tomando logaritmos: $n > \\dfrac{\\ln(' + d.b + ' \\cdot 10^{' + d.dec + '})}{\\ln 2} = ' +
        U.fmt(Math.log(d.b * Math.pow(10, d.dec)) / Math.LN2, 4) + '$.',
        'Redondeando hacia arriba: $n = ' + d.n + '$ pasos.',
        'Con Newton bastarían unos ' + Math.max(3, Math.ceil(Math.log(d.dec) / Math.LN2) + 2) + '.'];
    },
    answer: function (d) { return d.n + ' pasos'; }
  });

  p.keys([
    'La mayoría de los problemas reales <strong>no tienen solución con fórmula</strong>. Por eso existe esta disciplina.',
    'Bisección: lenta pero infalible; el error se divide entre 2 en cada paso.',
    'Newton: convergencia cuadrática (los decimales se duplican), pero puede fallar.',
    'Trapecios aproxima con rectas; Simpson con parábolas, y es mucho más preciso.',
    'Hay tres fuentes de error: truncamiento, redondeo e inestabilidad del algoritmo.',
    'Dos fórmulas algebraicamente idénticas pueden dar resultados numéricos muy distintos.'
  ]);
});
