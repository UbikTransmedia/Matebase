/* Tema: Ecuaciones diferenciales ordinarias */
Course.topic('av-edo', function (p) {

  p.text('En una ecuación normal la incógnita es un <em>número</em>. En una <strong>ecuación ' +
    'diferencial</strong> la incógnita es una <strong>función entera</strong>, y lo que se conoce es ' +
    'una relación entre esa función y sus derivadas.');

  p.formula('y\' = 2y \\quad\\longrightarrow\\quad y(x) = C\\,e^{2x}');

  p.text('Y esto no es una curiosidad académica: es <strong>el lenguaje en el que está escrita la ' +
    'física</strong>. Las leyes de la naturaleza casi nunca dicen cuánto vale una magnitud; dicen ' +
    'cómo <em>cambia</em>. Newton no escribió «la posición del planeta es esta»: escribió «la ' +
    'aceleración es proporcional a la fuerza», que es una ecuación diferencial.');

  p.table(['Fenómeno', 'Ecuación', 'Se lee'],
    [['Desintegración radiactiva', '$N\' = -kN$', 'decrece proporcionalmente a lo que queda'],
     ['Crecimiento de población', '$P\' = kP$', 'crece proporcionalmente a lo que hay'],
     ['Enfriamiento (Newton)', '$T\' = -k(T - T_a)$', 'se enfría según se aparte del ambiente'],
     ['Caída con rozamiento', '$v\' = g - kv$', 'acelera menos cuanto más rápido va'],
     ['Muelle', '$x\'\' = -\\omega^2 x$', 'la aceleración apunta hacia el equilibrio']]);

  p.section('El campo de pendientes');

  p.text('Antes de resolver nada se puede <strong>ver</strong> la solución. La ecuación $y\' = f(x,y)$ ' +
    'dice, en cada punto del plano, qué pendiente debe tener la curva que pasa por ahí. Si dibujamos ' +
    'un segmentito con esa pendiente en muchos puntos, las soluciones aparecen solas: son las curvas ' +
    'que van «peinando» el campo.');

  p.demo({
    title: 'El campo de pendientes y sus soluciones',
    intro: 'Cada rayita es la pendiente que impone la ecuación en ese punto. Haz clic en cualquier sitio del plano para lanzar una solución desde ahí.',
    build: function (host, d) {
      var tipo = 'exp';
      var curvas = [];
      var eqs = {
        exp: { f: function (x, y) { return 0.6 * y; }, t: 'y\' = 0{,}6\\,y', sol: 'y = C e^{0{,}6x}', txt: 'Crecimiento exponencial: la pendiente es proporcional a la altura.' },
        log: { f: function (x, y) { return 0.9 * y * (1 - y / 4); }, t: 'y\' = 0{,}9\\,y\\left(1 - \\frac{y}{4}\\right)', sol: 'curva logística', txt: 'Crecimiento logístico: crece deprisa al principio y se frena al acercarse al techo $y=4$.' },
        enf: { f: function (x, y) { return -0.8 * (y - 2); }, t: 'y\' = -0{,}8\\,(y - 2)', sol: 'y = 2 + Ce^{-0{,}8x}', txt: 'Enfriamiento: todas las soluciones tienden al ambiente $y=2$, vengan de donde vengan.' },
        lin: { f: function (x, y) { return x - y; }, t: 'y\' = x - y', sol: 'y = x - 1 + Ce^{-x}', txt: 'Todas las soluciones acaban acercándose a la recta $y = x-1$.' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1, xmax: 7, ymin: -1, ymax: 6, height: 340,
        onClick: function (x, y) { curvas.push([x, y]); plot.render(); },
        draw: function (g) {
          var f = eqs[tipo].f;
          // campo de pendientes
          for (var i = 0; i <= 24; i++) {
            for (var j = 0; j <= 18; j++) {
              var x = -1 + 8 * i / 24, y = -1 + 7 * j / 18;
              var m = f(x, y);
              if (!isFinite(m)) continue;
              var ang = Math.atan(m);
              var L = 0.14;
              g.seg(x - L * Math.cos(ang), y - L * Math.sin(ang),
                x + L * Math.cos(ang), y + L * Math.sin(ang),
                { color: 'axis', w: 1.4, alpha: .55 });
            }
          }
          // soluciones lanzadas por el alumno (Runge-Kutta sencillo)
          curvas.forEach(function (P, idx) {
            [1, -1].forEach(function (dir) {
              var pts = [[P[0], P[1]]];
              var x = P[0], y = P[1], h = 0.02 * dir;
              for (var s = 0; s < 500; s++) {
                var k1 = f(x, y);
                var k2 = f(x + h / 2, y + h * k1 / 2);
                var k3 = f(x + h / 2, y + h * k2 / 2);
                var k4 = f(x + h, y + h * k3);
                y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
                x += h;
                if (!isFinite(y) || y < -4 || y > 10 || x < -2 || x > 8) break;
                pts.push([x, y]);
              }
              g.path(pts, { color: idx % 6, w: 2.4 });
            });
            g.point(P[0], P[1], { color: idx % 6, r: 5 });
          });
        }
      });
      function paint() {
        curvas = [];
        out.set('$' + eqs[tipo].t + '$ &nbsp;→&nbsp; solución general: $' + eqs[tipo].sol + '$<br>' +
          eqs[tipo].txt + '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          'Haz clic en el gráfico para lanzar una solución desde ese punto.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'exponencial', value: 'exp' }, { label: 'logística', value: 'log' },
        { label: 'enfriamiento', value: 'enf' }, { label: '$y\' = x - y$', value: 'lin' }
      ], { value: 'exp', on: function (v) { tipo = v; paint(); } });
      W.buttons(host, [{ t: '↺ Borrar soluciones', on: function () { curvas = []; plot.render(); } }]);
      paint();
    }
  });

  p.note('Fíjate en algo importante: por cada punto pasa <strong>una única</strong> solución. La ' +
    'ecuación diferencial define una familia infinita de curvas, y hace falta un dato extra —una ' +
    '<em>condición inicial</em> $y(x_0)=y_0$— para elegir una concreta. Es el mismo papel que jugaba ' +
    'el $+C$ de las integrales.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Variables separables');

  p.text('El método más sencillo. Si se puede escribir la ecuación como algo que solo depende de $y$ ' +
    'a un lado y algo que solo depende de $x$ al otro, se integran los dos lados por separado.');

  p.formula('\\frac{dy}{dx} = g(x)\\,h(y) \\ \\Longrightarrow\\ \\int \\frac{dy}{h(y)} = \\int g(x)\\,dx');

  p.formula('\\begin{aligned} y\' &= ky \\\\ \\frac{dy}{y} &= k\\,dx \\\\ \\ln|y| &= kx + C \\\\ y &= C\\,e^{kx} \\end{aligned}',
    'el caso más famoso, paso a paso');

  p.text('Ese resultado explica de golpe la desintegración radiactiva, el interés compuesto continuo, ' +
    'el crecimiento de bacterias y la descarga de un condensador: todos obedecen «la variación es ' +
    'proporcional a lo que hay».');

  p.util('Una ecuación diferencial dice «cómo cambia esto» y su solución dice «cómo es esto», que es el ' +
    'salto más útil de la ciencia aplicada. La ley de enfriamiento de Newton, separable, es la que ' +
    'usa un forense para estimar la hora de la muerte a partir de la temperatura del cuerpo; la ' +
    'misma ecuación describe cómo se enfría un motor y cuánto tarda una casa en perder el calor. La ' +
    'desintegración radiactiva y la eliminación de un fármaco en sangre son idénticas en forma.');

  p.hist('Las ecuaciones diferenciales nacieron a la vez que el cálculo, porque eran su razón de ser: ' +
    'Newton escribió las leyes del movimiento como ecuaciones diferenciales, no como fórmulas. La ' +
    'segunda ley, esa $F=ma$ que parece una multiplicación inocente, es en realidad una ecuación ' +
    'diferencial de segundo orden, porque la aceleración es la derivada segunda de la posición. Toda ' +
    'la física posterior está escrita en este idioma.');

  p.section('Lineales de primer orden');
  p.text('No todas las ecuaciones se dejan separar. La siguiente familia en dificultad son las lineales, ' +
    'que tienen la incógnita y su derivada apareciendo solo en primer grado. También estas se dejan ' +
    'resolver siempre, mediante un truco que a primera vista parece sacado de la manga.');


  p.formula('y\' + P(x)\\,y = Q(x)');

  p.text('Se resuelven multiplicando por un <strong>factor integrante</strong> $\\mu = e^{\\int P dx}$, ' +
    'que convierte el lado izquierdo en la derivada de un producto y permite integrar directamente.');

  p.formula('y = \\frac{1}{\\mu}\\left(\\int \\mu\\,Q\\,dx + C\\right), \\qquad \\mu = e^{\\int P\\,dx}');

  /* ================= EJERCICIOS ================= */
  p.util('El circuito eléctrico más común —una resistencia y una bobina, o una resistencia y un ' +
    'condensador— obedece exactamente a una lineal de primer orden, y su solución explica la ' +
    '«constante de tiempo» que aparece en cualquier hoja de características. Es también el modelo de ' +
    'un depósito que se llena y se vacía a la vez, de la deuda con pagos e intereses simultáneos y ' +
    'del nivel de un fármaco con dosis repetidas.');

  p.section('Practica');

  p.exercise({
    title: 'Comprobar una solución',
    level: 'basico',
    gen: function (r) {
      var k = r.nz(-4, 4);
      var C = r.nz(1, 6);
      var x = r.int(0, 2);
      return { k: k, C: C, x: x, val: C * Math.exp(k * x) };
    },
    ask: function (d) {
      return 'La solución general de $y\' = ' + d.k + 'y$ es $y = C e^{' + d.k + 'x}$. Si además ' +
        '$y(0) = ' + d.C + '$, calcula $y(' + d.x + ')$ (cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'y(' + d.x + ')', w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'La condición inicial fija $C$: al sustituir $x=0$ queda $y(0) = C$, así que $C = ' + d.C + '$.'; },
    steps: function (d) {
      return ['En $x = 0$: $y(0) = Ce^{0} = C$, así que $C = ' + d.C + '$.',
        'La solución particular es $y = ' + d.C + 'e^{' + d.k + 'x}$.',
        '$y(' + d.x + ') = ' + d.C + 'e^{' + (d.k * d.x) + '} = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Desintegración radiactiva',
    level: 'medio',
    gen: function (r) {
      var semi = r.pick([5, 8, 10, 12, 20, 24, 30]);
      var N0 = r.int(1, 20) * 10;
      var t = r.int(1, 60);
      var k = Math.LN2 / semi;
      return { semi: semi, N0: N0, t: t, k: k, val: N0 * Math.exp(-k * t) };
    },
    ask: function (d) {
      return 'Una sustancia cumple $N\' = -kN$ con semivida de $' + d.semi + '$ años. Si al principio ' +
        'hay $' + d.N0 + '$ gramos, ¿cuántos quedan a los $' + d.t + '$ años? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Gramos', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'La constante sale de la semivida: $k = \\frac{\\ln 2}{' + d.semi + '} = ' + U.fmt(d.k, 5) + '$.'; },
    steps: function (d) {
      return ['La ecuación $N\' = -kN$ es de variables separables y su solución es $N = N_0 e^{-kt}$.',
        'La semivida cumple $N_0/2 = N_0 e^{-k\\cdot' + d.semi + '}$, de donde $k = \\dfrac{\\ln 2}{' + d.semi + '} = ' + U.fmt(d.k, 5) + '$.',
        '$N(' + d.t + ') = ' + d.N0 + '\\,e^{-' + U.fmt(d.k, 5) + ' \\cdot ' + d.t + '} = ' + U.fmt(d.val, 4) + '$ gramos.'];
    },
    answer: function (d) { return U.fmt(d.val, 4) + ' g'; }
  });

  p.exercise({
    title: 'Ley de enfriamiento de Newton',
    level: 'avanzado',
    gen: function (r) {
      var Ta = r.int(15, 25);
      var T0 = Ta + r.int(40, 70);
      var k = r.int(5, 30) / 100;
      var t = r.int(1, 20);
      return { Ta: Ta, T0: T0, k: k, t: t, val: Ta + (T0 - Ta) * Math.exp(-k * t) };
    },
    ask: function (d) {
      return 'Un café a $' + d.T0 + '^\\circ$C se deja en una habitación a $' + d.Ta + '^\\circ$C. ' +
        'Cumple $T\' = -k(T - T_a)$ con $k = ' + U.fmt(d.k, 2) + '$ (minutos$^{-1}$). ' +
        '¿Qué temperatura tendrá a los $' + d.t + '$ minutos? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Temperatura (°C)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'La solución es $T(t) = T_a + (T_0 - T_a)e^{-kt}$. Aquí $T_0 - T_a = ' + (d.T0 - d.Ta) + '$.'; },
    steps: function (d) {
      return ['Llamamos $u = T - T_a$: entonces $u\' = -ku$, que ya sabemos resolver.',
        '$u = u_0 e^{-kt}$, y deshaciendo el cambio: $T = T_a + (T_0-T_a)e^{-kt}$.',
        '$T(' + d.t + ') = ' + d.Ta + ' + ' + (d.T0 - d.Ta) + '\\,e^{-' + U.fmt(d.k, 2) + ' \\cdot ' + d.t + '}$',
        '$= ' + d.Ta + ' + ' + U.fmt((d.T0 - d.Ta) * Math.exp(-d.k * d.t), 4) + ' = ' + U.fmt(d.val, 4) + '^\\circ$C',
        'Con el tiempo tiende a $' + d.Ta + '^\\circ$C, la temperatura ambiente: nunca baja de ahí.'];
    },
    answer: function (d) { return U.fmt(d.val, 4) + ' °C'; }
  });

  p.exercise({
    title: 'Variables separables',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(1, 3);
      var C = r.int(1, 6);
      var x = r.int(1, 3);
      // y' = x^n  ->  y = x^(n+1)/(n+1) + C
      return { n: n, C: C, x: x, val: Math.pow(x, n + 1) / (n + 1) + C };
    },
    ask: function (d) {
      return 'Resuelve $y\' = x^{' + d.n + '}$ con la condición $y(0) = ' + d.C + '$, y evalúa la ' +
        'solución en $x = ' + d.x + '$ (cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'y(' + d.x + ')', w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Separa: $dy = x^n dx$ e integra los dos lados.'; },
    steps: function (d) {
      return ['Separamos variables: $dy = x^{' + d.n + '}dx$.',
        'Integramos los dos lados: $y = \\dfrac{x^{' + (d.n + 1) + '}}{' + (d.n + 1) + '} + C$.',
        'Con $y(0) = ' + d.C + '$ sale $C = ' + d.C + '$.',
        '$y(' + d.x + ') = \\dfrac{' + Math.pow(d.x, d.n + 1) + '}{' + (d.n + 1) + '} + ' + d.C + ' = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.keys([
    'En una ecuación diferencial la incógnita es una <strong>función</strong>.',
    'Las leyes de la naturaleza casi siempre describen cómo cambian las cosas, no cuánto valen.',
    'El campo de pendientes deja ver las soluciones antes de resolver nada.',
    'La solución general es una familia; una condición inicial elige una curva concreta.',
    'Variables separables: se separan e integran los dos lados.',
    '$y\' = ky$ da $y = Ce^{kx}$, y de ahí salen media docena de fenómenos distintos.',
    'Lineales de primer orden: factor integrante $\\mu = e^{\\int P dx}$.'
  ]);
});
