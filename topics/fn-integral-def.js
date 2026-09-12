/* Tema: Integral definida y áreas */
Course.topic('fn-integral-def', function (p) {

  p.puente('En geometría, las áreas salían de contar cuadraditos y de recortar figuras hasta llegar ' +
    'al rectángulo. Con una curva no se puede recortar, pero sí rellenar con rectángulos finísimos y ' +
    'pasar al límite, que es la herramienta del bloque. Y la sorpresa es que ese límite se calcula ' +
    'con la primitiva del tema anterior: el área y la derivada resultan ser inversas.');

  p.text('¿Cuánta superficie hay debajo de una curva? Para un rectángulo o un triángulo es fácil. ' +
    'Para una curva cualquiera, la idea que funciona es de una sencillez brutal: <strong>rellenarla ' +
    'con rectángulos</strong> y hacerlos cada vez más finos.');

  p.demo({
    title: 'Sumas de Riemann',
    intro: 'Aumenta el número de rectángulos y mira cómo el error se desploma. En el límite, la suma de infinitos rectángulos infinitamente finos es exactamente el área.',
    predice: 'La función es creciente. Con 6 rectángulos tomando la altura por la izquierda, ¿la suma quedará por encima o por debajo del área real? ¿Y por la derecha?',
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
    'definición como suma de Riemann',
    'Se dice: <em>«la integral, entre a y b, de efe de equis, diferencial de equis, es el límite ' +
      'cuando ene tiende a infinito del sumatorio»</em>.<br><br>El signo $\\int$ es una ese alargada, ' +
      'de «suma», y lo eligió Leibniz por eso. El $\\sum$ es la sigma griega y también significa ' +
      '«suma», pero de una cantidad finita de términos.<br><br>La idea entera: <em>«parto el intervalo ' +
      'en ene rectangulitos, sumo sus áreas, y miro a qué se acerca esa suma cuando los hago ' +
      'infinitamente finos»</em>.');

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

  p.comprueba('¿Cuánto vale $\\displaystyle\\int_0^3 2x\\,dx$?', [
    { t: '$6$', ok: false, por: '$6$ es $f(3)$, la altura en el extremo. La integral es el área: $[x^2]_0^3 = 9 - 0 = 9$. Es el triángulo de base 3 y altura 6: $\\frac{3\\cdot 6}{2} = 9$ ✓.' },
    { t: '$9$', ok: true, por: 'Primitiva $x^2$; Barrow: $3^2 - 0^2 = 9$. Y geométricamente es un triángulo de base 3 y altura 6: $\\frac{18}{2} = 9$. Las dos cuentas coinciden.' },
    { t: '$3$', ok: false, por: 'Es $F(3) - F(0)$ con $F = x^2$: $9 - 0 = 9$. Comprueba con el triángulo de base 3 y altura $f(3) = 6$.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.util('La regla de Barrow es probablemente el atajo más rentable de las matemáticas: convierte «sumar ' +
    'infinitos trocitos» en «restar dos valores». Gracias a ella se calculan volúmenes de depósitos ' +
    'de forma irregular, el centro de gravedad de una pieza —que decide si un mueble vuelca—, el ' +
    'trabajo de una fuerza variable y el área bajo una curva de consumo. Sin ella, cada uno de esos ' +
    'cálculos exigiría una suma infinita.');

  p.hist('Isaac Barrow fue el profesor de Newton en Cambridge y quien vio antes que nadie que derivar e ' +
    'integrar son operaciones inversas. En 1669 renunció a su cátedra para que se la dieran a su ' +
    'alumno, que tenía veintiséis años, y se dedicó a la teología. Es uno de los pocos casos ' +
    'documentados de un maestro apartándose voluntariamente para dejar sitio a alguien mejor.');

  p.note('Fíjate en lo que acaba de pasar con las áreas de siempre. En ' +
    '[[ge-areas|perímetros, áreas y el número π]] cada figura traía su fórmula, y había que fiarse: el ' +
    'círculo, $\\pi r^2$; el triángulo, base por altura partido por dos. La integral las produce ' +
    'todas desde un solo principio —sumar rectángulos y afinar—, y de paso da las de las figuras que ' +
    'no tienen fórmula porque nadie las ha bautizado.', null, 'Las fórmulas de área, de una sola idea');

  p.section('Cuidado con los signos');

  p.text('La integral definida no es exactamente «el área»: es un <strong>área con signo</strong>. Lo ' +
    'que queda por debajo del eje X cuenta en negativo.');

  p.ejemplo({
    title: 'Integral y área no son lo mismo',
    enunciado: 'Para $f(x) = x^2 - 4$ en $[0, 3]$, calcular la integral definida y el área encerrada con el eje X.',
    pasos: [
      { t: '<strong>Dónde corta al eje.</strong> $x^2 - 4 = 0 \\Rightarrow x = \\pm 2$. Dentro de $[0, 3]$ está el 2: la función es negativa en $[0, 2]$ y positiva en $[2, 3]$.', antes: '¿Cambia de signo la función dentro del intervalo? ¿Dónde?' },
      { t: '<strong>La integral entera.</strong> $\\displaystyle\\int_0^3 (x^2 - 4)\\,dx = \\left[\\frac{x^3}{3} - 4x\\right]_0^3 = (9 - 12) - 0 = -3$. Sale negativa: la parte de abajo pesa más.' },
      { t: '<strong>Trozo a trozo.</strong> $\\displaystyle\\int_0^2 = \\left(\\frac{8}{3} - 8\\right) - 0 = -\\frac{16}{3}$ y $\\displaystyle\\int_2^3 = (9 - 12) - \\left(\\frac{8}{3} - 8\\right) = -3 + \\frac{16}{3} = \\frac{7}{3}$.', antes: 'Calcula la integral en $[0, 2]$ y en $[2, 3]$ por separado. ¿Qué signo tiene cada una?' },
      { t: '<strong>El área.</strong> Se suman los valores absolutos: $\\dfrac{16}{3} + \\dfrac{7}{3} = \\dfrac{23}{3} \\approx 7{,}67$.', antes: 'Para el área geométrica, ¿qué se hace con el trozo negativo?' },
      { t: '<strong>Comprobar la coherencia.</strong> $-\\dfrac{16}{3} + \\dfrac{7}{3} = -3$, la integral entera ✓. Integral $-3$, área $\\frac{23}{3}$: dos números distintos para dos preguntas distintas.' }
    ],
    cierre: 'Si la pregunta dice «área», hay que buscar los cortes con el eje y partir. Si dice «integral», se aplica Barrow de un tirón. Leer bien el enunciado vale tanto como saber integrar.'
  });

  p.demo({
    title: 'Área con signo',
    intro: 'Mueve los límites de integración. Cuando el tramo cruza el eje, las dos partes se restan entre sí.',
    predice: 'La función $\\frac{x^3}{3} - x$ es impar. Si pones los límites simétricos, $a = -2$ y $b = 2$, ¿cuánto crees que dará la integral? ¿Y el área?',
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
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Si lo que quieres es el área ' +
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

  p.note('Esta misma integral es, sin cambiar una letra, la que da las probabilidades del bloque ' +
    'siguiente: en una variable aleatoria continua, la probabilidad de caer entre dos valores ' +
    '<em>es</em> el área bajo una curva entre esos dos valores. Lo verás en [[pe-continuas|<strong>Variables ' +
    'aleatorias continuas</strong>]].',
    null, 'Dónde reaparece esto');

  p.section('Área entre dos curvas');
  p.text('Si la integral de una función da el área que hay entre ella y el eje, el área encerrada entre ' +
    'dos curvas sale de una resta: se calcula la de arriba y se le quita la de abajo. Lo único ' +
    'delicado es saber cuál va arriba, y eso puede cambiar a lo largo del intervalo, así que ' +
    'conviene localizar antes los puntos donde se cruzan.');


  p.formula('A = \\int_a^b \\left[f(x) - g(x)\\right]dx', 'con f por encima de g');

  p.text('Los límites $a$ y $b$ son los puntos donde las dos curvas se cortan: se obtienen resolviendo ' +
    '$f(x) = g(x)$.');

  p.sub('Áreas con parámetro y con la recta tangente');

  p.text('Dos variantes que el examen repite. En la primera el área se conoce y lo que falta es un ' +
    'número de la función: se calcula el área en función de ese parámetro y se <strong>iguala</strong> ' +
    'al valor dado, lo que deja una ecuación. En la segunda, una de las dos curvas es la ' +
    '[[fn-derivadas|recta tangente]] a la otra en un punto: primero se escribe la tangente, y después ' +
    'es un área entre dos curvas como cualquier otra, con la particularidad de que en el punto de ' +
    'tangencia las dos se tocan sin cruzarse.');

  p.formula('\\int_{-k}^{k}\\left(k^2 - x^2\\right)dx = \\frac{4k^3}{3} = 36 \\ \\Rightarrow\\ k^3 = 27 \\ \\Rightarrow\\ k = 3',
    'un área con parámetro',
    'Es el área encerrada entre la parábola $y = x^2$ y la recta horizontal $y = k^2$. Los cortes son ' +
      '$x = \\pm k$, la recta va por encima, y la integral de la diferencia da $\\frac{4k^3}{3}$. Si se ' +
      'pide que el área valga 36, basta resolver la ecuación.');

  p.trampas([
    { e: '«La integral ha salido negativa: el área es negativa»', por: 'Un área nunca es negativa. El signo dice que el tramo está bajo el eje; el área es el valor absoluto.' },
    { e: 'Integrar de un tirón cuando piden área y la función cruza el eje', por: 'Las partes positivas y negativas se cancelan. Hay que partir por los cortes con el eje y sumar valores absolutos.' },
    { e: 'Escribir $F(b)$ y olvidar restar $F(a)$', por: 'Barrow es $F(b) - F(a)$. Solo cuando $F(a) = 0$ se puede omitir, y hay que decirlo.' },
    { e: 'Área entre dos curvas sin saber cuál va arriba', por: 'Si se integra $g - f$ con $f$ por encima, sale negativo. Se localizan los cortes y se comprueba con un punto intermedio quién está arriba.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('El área entre dos curvas es una medida de diferencia acumulada, y con ese nombre aparece en ' +
    'economía: entre la curva de ingresos y la de costes está el beneficio total del periodo; entre ' +
    'la recta de reparto perfecto y la curva real de rentas está la desigualdad de un país, que es ' +
    'como se calcula el índice de Gini. También es el consumo extra de un motor frente a otro a lo ' +
    'largo de un trayecto.');

  p.section('Practica');

  p.exercise({
    title: 'La integral de una recta es un trapecio',
    level: 'basico',
    gen: function (r) {
      var m = r.nz(-3, 3), n = r.int(1, 8), a = r.int(0, 3), b = a + r.int(1, 5);
      var ya = m * a + n, yb = m * b + n;
      if (ya <= 0 || yb <= 0) return null;
      var val = (ya + yb) * (b - a) / 2;
      return { m: m, n: n, a: a, b: b, ya: ya, yb: yb, val: val };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\int_{' + d.a + '}^{' + d.b + '} (' + ML.polyTex([d.m, d.n]) + ')\\,dx$ con Barrow, y comprueba el resultado con la fórmula del trapecio.';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: d.a - 1, xmax: d.b + 1, ymin: 0, ymax: Math.max(d.ya, d.yb) + 2, height: 200,
        draw: function (g) {
          var f = function (x) { return d.m * x + d.n; };
          g.area(f, d.a, d.b, { fill: 2, fillAlpha: .3 });
          g.fn(f, { color: 0, w: 2.4 });
          g.point(d.a, d.ya, { color: 1, r: 4.5 });
          g.point(d.b, d.yb, { color: 1, r: 4.5 });
        }
      });
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    tol: 1e-6,
    hint: function () { return 'Primitiva de $mx + n$: $\\frac{m x^2}{2} + nx$. O directamente: el trapecio tiene bases $f(a)$ y $f(b)$ y altura $b - a$.'; },
    steps: function (d) {
      var F = function (x) { return d.m * x * x / 2 + d.n * x; };
      return ['Barrow: $\\left[\\frac{' + d.m + 'x^2}{2} + ' + d.n + 'x\\right]_{' + d.a + '}^{' + d.b + '} = ' + U.fmt(F(d.b), 3) + ' - ' + U.fmt(F(d.a), 3) + ' = ' + U.fmt(d.val, 3) + '$.',
        'Trapecio: bases $f(' + d.a + ') = ' + d.ya + '$ y $f(' + d.b + ') = ' + d.yb + '$, altura $' + (d.b - d.a) + '$: $\\frac{(' + d.ya + ' + ' + d.yb + ')\\cdot ' + (d.b - d.a) + '}{2} = ' + U.fmt(d.val, 3) + '$ ✓.',
        'Los dos caminos coinciden: la integral definida es, de verdad, el área.'];
    },
    answer: function (d) { return U.fmt(d.val, 3); }
  });

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

  p.exercise({
    title: 'El parámetro que da un área',
    level: 'avanzado',
    gen: function (r) {
      var k = r.int(1, 4), c = r.pick([1, 2, 3]);
      // area entre y = c x^2 e y = c k^2 : 4 c k^3 / 3
      return { k: k, c: c, A: ML.F(4 * c * k * k * k, 3) };
    },
    ask: function (d) {
      return 'Halla $k > 0$ para que el área encerrada entre la parábola $y = ' + (d.c === 1 ? '' : d.c) + 'x^2$ y la recta $y = ' + (d.c === 1 ? '' : d.c) + 'k^2$ valga $' + d.A.tex() + '$.';
    },
    fields: [{ name: 'k', label: 'k =', w: 'tiny' }],
    sol: function (d) { return { k: d.k }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return v.k === -d.k; }, msg: 'El enunciado pide $k > 0$.' }],
    hint: function (d) {
      return ['Los cortes son $x = \\pm k$ y entre ellos la recta va por encima.',
        'El área es $\\int_{-k}^{k} ' + (d.c === 1 ? '' : d.c) + '(k^2 - x^2)\\,dx = \\frac{' + (4 * d.c) + 'k^3}{3}$. Iguala y despeja.'];
    },
    steps: function (d) {
      return ['Cortes: $' + (d.c === 1 ? '' : d.c) + 'x^2 = ' + (d.c === 1 ? '' : d.c) + 'k^2 \\Rightarrow x = \\pm k$.',
        'Área: $\\displaystyle\\int_{-k}^{k} ' + (d.c === 1 ? '' : d.c) + '(k^2 - x^2)\\,dx = ' + (d.c === 1 ? '' : d.c) + '\\left[k^2x - \\frac{x^3}{3}\\right]_{-k}^{k} = \\frac{' + (4 * d.c) + 'k^3}{3}$',
        '$\\frac{' + (4 * d.c) + 'k^3}{3} = ' + d.A.tex() + ' \\Rightarrow k^3 = ' + (d.k * d.k * d.k) + ' \\Rightarrow k = ' + d.k + '$'];
    },
    answer: function (d) { return 'k = ' + d.k; }
  });

  p.exercise({
    title: 'Área entre una parábola, su tangente y el eje Y',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(1, 4), c = r.pick([1, 2, 3]);
      return { a: a, c: c, A: ML.F(c * a * a * a, 3) };
    },
    ask: function (d) {
      return 'Calcula el área de la región limitada por $f(x) = ' + (d.c === 1 ? '' : d.c) + 'x^2$, su recta tangente en $x = ' + d.a + '$ y el eje $Y$. (Vale una fracción.)';
    },
    fields: [{ name: 'A', label: 'área', w: 'tiny' }],
    sol: function (d) { return { A: d.A.val() }; },
    tol: 1e-9,
    hint: function (d) {
      return ['Tangente en $x = ' + d.a + '$: $y = f(' + d.a + ') + f\'(' + d.a + ')(x - ' + d.a + ')$.',
        'La parábola queda por encima de su tangente. Integra la diferencia entre $x = 0$ (el eje $Y$) y $x = ' + d.a + '$.',
        'La diferencia es $' + (d.c === 1 ? '' : d.c) + '(x - ' + d.a + ')^2$.'];
    },
    steps: function (d) {
      var c = d.c === 1 ? '' : String(d.c);
      return ['$f(' + d.a + ') = ' + (d.c * d.a * d.a) + '$ y $f\'(' + d.a + ') = ' + (2 * d.c * d.a) + '$: la tangente es $y = ' + ML.polyTex([2 * d.c * d.a, -d.c * d.a * d.a]) + '$.',
        '$f(x) - \\text{tangente} = ' + c + 'x^2 - ' + (2 * d.c * d.a) + 'x + ' + (d.c * d.a * d.a) + ' = ' + c + '(x - ' + d.a + ')^2 \\ge 0$',
        '$A = \\displaystyle\\int_0^{' + d.a + '} ' + c + '(x - ' + d.a + ')^2\\,dx = ' + c + '\\left[\\frac{(x - ' + d.a + ')^3}{3}\\right]_0^{' + d.a + '} = ' + d.A.tex() + '$'];
    },
    answer: function (d) { return '$' + d.A.tex() + '$'; }
  });

  p.keys([
    'La integral definida nace de llenar el área con rectángulos y afinarlos hasta el límite.',
    'Si el área es un dato, se calcula en función del parámetro y se iguala: sale una ecuación.',
    '<strong>Regla de Barrow</strong>: $\\int_a^b f = F(b)-F(a)$. No hace falta sumar nada, solo una primitiva.',
    'El teorema fundamental dice que derivar e integrar son operaciones inversas: es la piedra angular del cálculo.',
    'La integral da un <strong>área con signo</strong>: lo que está bajo el eje resta.',
    'Para el área geométrica: partir por los cortes con el eje y sumar valores absolutos.',
    'Entre dos curvas: $\\int_a^b (f-g)$, con $a$ y $b$ los puntos de corte.'
  ]);
});
