/* Tema: Teoría del caos y fractales */
Course.topic('av-caos', function (p) {

  p.text('Hasta aquí, casi todo lo que has visto era <em>predecible</em>: conocidas las reglas y el ' +
    'punto de partida, el resultado sale. Este tema trata del descubrimiento contrario, y es uno de ' +
    'los más importantes del siglo XX: hay sistemas <strong>completamente deterministas</strong> ' +
    '—sin ninguna aleatoriedad— cuyo comportamiento a largo plazo es <strong>imposible de predecir</strong>.');

  p.text('No es un problema de no tener buenos ordenadores. Es una propiedad matemática del sistema.');

  p.hist('En 1961 Edward Lorenz simulaba el clima con un modelo de doce ecuaciones. Para repetir una ' +
    'simulación tecleó de nuevo los datos intermedios, pero redondeados: 0,506 en vez de 0,506127. ' +
    'Esperaba una diferencia insignificante. Al cabo de dos meses simulados, la predicción no se ' +
    'parecía en nada a la anterior. Ahí nació la expresión <em>efecto mariposa</em>, del título de su ' +
    'conferencia de 1972: «¿El aleteo de una mariposa en Brasil provoca un tornado en Texas?». ' +
    'Poincaré ya lo había intuido en 1890 estudiando el problema de los tres cuerpos, pero sin ' +
    'ordenadores nadie pudo ver lo que aquello significaba.');

  /* ---------------------------------------------------------------- */
  p.section('El mapa logístico');

  p.text('Todo esto se puede ver con una fórmula que cabe en una línea. Imagina una población de ' +
    'conejos, medida como una fracción $x$ entre 0 (extinción) y 1 (el máximo que aguanta la isla). ' +
    'Cada año la población nueva se calcula así:');

  p.formula('x_{n+1} = r\\,x_n\\,(1 - x_n)', 'el mapa logístico');

  p.text('Tiene todo el sentido biológico: el factor $r\\,x_n$ dice que cuantos más conejos hay, más ' +
    'nacen; el factor $(1-x_n)$ dice que cuando la isla se llena, escasea la comida y frena el ' +
    'crecimiento. El parámetro $r$ mide la fertilidad.');

  p.text('Es una parábola. Nada más inofensivo. Y sin embargo:');

  p.demo({
    title: 'La misma fórmula, cuatro comportamientos',
    intro: 'Mueve la fertilidad r y observa la evolución año a año. Verás que el sistema pasa de estabilizarse, a oscilar entre dos valores, a oscilar entre cuatro, y finalmente a volverse impredecible.',
    build: function (host, d) {
      var r = 2.7, x0 = 0.4;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 60, ymin: 0, ymax: 1.05, height: 300,
        xlabel: 'año', ylabel: 'población',
        draw: function (g) {
          var pts = [], x = x0;
          for (var i = 0; i <= 60; i++) { pts.push([i, x]); x = r * x * (1 - x); }
          g.path(pts, { color: 0, w: 1.8, alpha: .55 });
          pts.forEach(function (q) { g.point(q[0], q[1], { color: 0, r: 3 }); });
        }
      });
      function paint() {
        var x = x0, ult = [];
        for (var i = 0; i < 400; i++) { x = r * x * (1 - x); if (i > 380) ult.push(U.round(x, 4)); }
        var distintos = [];
        ult.forEach(function (v) {
          if (!distintos.some(function (w) { return Math.abs(w - v) < 1e-3; })) distintos.push(v);
        });
        var diag;
        if (r < 1) diag = 'La población se <strong>extingue</strong>: tiende a 0.';
        else if (distintos.length === 1) diag = 'Se estabiliza en un <strong>único valor</strong> ($' + U.fmt(distintos[0], 4) + '$): equilibrio.';
        else if (distintos.length === 2) diag = 'Oscila para siempre entre <strong>dos valores</strong>: ciclo de periodo 2.';
        else if (distintos.length === 4) diag = 'Ciclo de <strong>periodo 4</strong>: el periodo se ha vuelto a duplicar.';
        else if (distintos.length <= 8) diag = 'Ciclo de periodo <strong>' + distintos.length + '</strong>.';
        else diag = '<strong style="color:var(--bad)">Caos</strong>: no se repite nunca, aunque la regla sea siempre la misma.';
        out.set('$x_{n+1} = ' + U.fmt(r, 2) + '\\,x_n(1-x_n)$, empezando en $x_0 = ' + U.fmt(x0, 2) + '$<br>' + diag);
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'fertilidad r', min: 0.5, max: 4, step: 0.01, value: r, dec: 2, on: function (v) { r = v; paint(); } });
      W.slider(row, { label: 'población inicial', min: 0.05, max: 0.95, step: 0.01, value: x0, dec: 2, on: function (v) { x0 = v; paint(); } });
      W.chips(host, [
        { label: '$r=2{,}7$ estable', value: 2.7 }, { label: '$r=3{,}2$ periodo 2', value: 3.2 },
        { label: '$r=3{,}5$ periodo 4', value: 3.5 }, { label: '$r=3{,}9$ caos', value: 3.9 }
      ], { toggle: false, on: function (v) { r = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Dependencia sensible: el efecto mariposa');

  p.text('Esta es la propiedad que define el caos. Dos poblaciones iniciales que se diferencian en una ' +
    'millonésima siguen trayectorias idénticas... durante un rato. Y después se separan por completo.');

  p.demo({
    title: 'Dos mundos que empiezan casi igual',
    intro: 'Las dos curvas parten de valores que difieren en 0,000001. Sube la fertilidad a la zona caótica y mira cuántos años tardan en no parecerse en nada.',
    build: function (host, d) {
      var r = 3.9, eps = 1e-6;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 70, ymin: 0, ymax: 1.05, height: 300,
        xlabel: 'año', ylabel: 'población',
        draw: function (g) {
          var A = [], B = [], a = 0.4, b = 0.4 + eps, sep = -1;
          for (var i = 0; i <= 70; i++) {
            A.push([i, a]); B.push([i, b]);
            if (sep < 0 && Math.abs(a - b) > 0.1) sep = i;
            a = r * a * (1 - a); b = r * b * (1 - b);
          }
          g.path(A, { color: 0, w: 2.2 });
          g.path(B, { color: 1, w: 2.2, dash: true });
          if (sep > 0) {
            g.vline(sep, { color: 2, w: 1.6, dash: true });
            g.text(sep + 0.6, 0.95, 'aquí ya son mundos distintos', { color: 2, size: 12, box: true });
          }
          out.set('Diferencia inicial: $' + eps.toExponential(0).replace('e-', ' \\cdot 10^{-') + '}$' +
            ' &nbsp;·&nbsp; $r = ' + U.fmt(r, 2) + '$<br>' +
            (sep > 0 ? 'Las dos trayectorias se separan visiblemente al cabo de <strong>' + sep +
              ' años</strong>. Ese es el horizonte de predicción: más allá, no hay forma de saber nada.'
              : 'Con esta fertilidad el sistema no es caótico: las dos trayectorias siguen juntas para siempre.'));
        }
      });
      var row = W.row(host);
      W.slider(row, { label: 'fertilidad r', min: 2.5, max: 4, step: 0.01, value: r, dec: 2, on: function (v) { r = v; plot.render(); } });
      W.slider(row, {
        label: 'diferencia inicial', min: -9, max: -2, step: 1, value: -6, dec: 0,
        format: function (v) { return '10^{' + v + '}'; },
        on: function (v) { eps = Math.pow(10, v); plot.render(); }
      });
      W.legend(host, [{ c: 0, t: 'población A' }, { c: 1, t: 'población B' }]);
      W.hint(host, 'Fíjate en que hacer la diferencia inicial mil veces más pequeña no retrasa mil años la separación: solo unos pocos. Por eso medir mejor no resuelve el problema.');
    }
  });

  p.note('Esto explica por qué el tiempo meteorológico no se puede predecir a más de unos días, ' +
    'por muchos satélites que pongamos. No es ignorancia: es que el error crece exponencialmente. ' +
    'El clima (las medias a largo plazo) sí es predecible; el tiempo de un martes concreto dentro de ' +
    'un mes, no.', null, 'Por qué no hay partes meteorológicos a un mes vista');

  /* ---------------------------------------------------------------- */
  p.util('El caos es la razón por la que el tiempo no se puede predecir a más de dos semanas, y no por ' +
    'falta de ordenadores. Lorenz lo descubrió en 1961 al reintroducir un dato con tres decimales en ' +
    'vez de seis: la simulación se separó por completo de la anterior. Como la atmósfera nunca se ' +
    'conoce con precisión infinita, el error crece hasta hacerse del tamaño de la predicción. Por ' +
    'eso los partes hablan de probabilidades y no de certezas, y por eso se ejecutan decenas de ' +
    'simulaciones con datos ligeramente distintos.');

  p.section('El diagrama de bifurcación');

  p.text('Si dibujamos, para cada valor de $r$, los valores en los que acaba la población a largo ' +
    'plazo, aparece una de las imágenes más famosas de las matemáticas. La rama única se parte en ' +
    'dos, luego en cuatro, en ocho... cada vez más deprisa, hasta que estalla en caos.');

  p.demo({
    title: 'Diagrama de bifurcación',
    intro: 'Cada línea vertical de puntos son los destinos posibles de la población para esa fertilidad. Amplía la zona con los botones y verás que dentro del caos vuelven a aparecer ventanas ordenadas.',
    build: function (host, d) {
      var r0 = 2.4, r1 = 4;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: r0, xmax: r1, ymin: 0, ymax: 1, height: 360,
        xlabel: 'r', ylabel: 'x',
        draw: function (g) {
          var W0 = g.W;
          var ctx = g.ctx;
          ctx.fillStyle = g.color(0);
          ctx.globalAlpha = 0.42;
          for (var px = 0; px < W0; px++) {
            var rr = g.iX(px + 0.5);
            var x = 0.4;
            for (var i = 0; i < 260; i++) x = rr * x * (1 - x);      // transitorio
            for (var j = 0; j < 130; j++) {
              x = rr * x * (1 - x);
              var py = g.Y(x);
              if (py >= 0 && py <= g.H) ctx.fillRect(px, py, 1, 1);
            }
          }
          ctx.globalAlpha = 1;
        }
      });
      function zoom(a, b, texto) {
        r0 = a; r1 = b;
        plot.view(a, b, 0, 1);
        out.set(texto);
      }
      W.chips(host, [
        { label: 'vista completa', value: 0 },
        { label: 'primeras bifurcaciones', value: 1 },
        { label: 'ventana de periodo 3', value: 2 },
        { label: 'zoom profundo', value: 3 }
      ], {
        value: 0, on: function (v) {
          if (v === 0) zoom(2.4, 4, 'Vista completa. A la izquierda, un único destino. Hacia $r \\approx 3$ se parte en dos, y a partir de $r \\approx 3{,}57$ empieza el caos.');
          if (v === 1) zoom(2.9, 3.6, 'Las duplicaciones de periodo: 1 → 2 → 4 → 8… Cada tramo es unas 4,669 veces más corto que el anterior. Ese número, la <strong>constante de Feigenbaum</strong>, es el mismo para infinidad de sistemas distintos.');
          if (v === 2) zoom(3.82, 3.86, 'Dentro del caos aparecen <strong>ventanas de orden</strong>. Esta es la de periodo 3: el sistema vuelve a ser perfectamente periódico durante un intervalo de $r$.');
          if (v === 3) zoom(3.847, 3.8545, 'Ampliando una ventana aparece otra copia del diagrama entero, más pequeña. Eso es <strong>autosemejanza</strong>: la marca de un fractal.');
        }
      });
      out.set('Vista completa. A la izquierda, un único destino. Hacia $r \\approx 3$ se parte en dos, y a partir de $r \\approx 3{,}57$ empieza el caos.');
    }
  });

  p.section('Fractales: figuras con dimensión fraccionaria');

  p.text('Esa autosemejanza —que un trozo ampliado se parezca al todo— es lo que define un ' +
    '<strong>fractal</strong>. Y obliga a repensar qué es la dimensión. Si escalas una figura por un ' +
    'factor $k$, su «tamaño» se multiplica por $k^D$, donde $D$ es la dimensión: una línea doblada de ' +
    'tamaño es 2 veces mayor ($2^1$), un cuadrado 4 veces ($2^2$), un cubo 8 ($2^3$). Despejando:');

  p.formula('D = \\frac{\\log N}{\\log k}', 'dimensión de autosemejanza');

  p.text('Aplícalo al copo de nieve de Koch: cada segmento se sustituye por 4 copias de un tercio de ' +
    'longitud. Entonces $N = 4$, $k = 3$ y sale $D = \\log 4/\\log 3 \\approx 1{,}262$. No es una ' +
    'línea, no es una superficie: está en medio.');

  p.demo({
    title: 'El copo de nieve de Koch',
    intro: 'Cada paso sustituye cada segmento por cuatro. El perímetro crece sin límite mientras el área se queda acotada: una curva de longitud infinita encerrando un área finita.',
    build: function (host, d) {
      var nivel = 3;
      var out = W.readout(host, '');
      function koch(p1, p2, n) {
        if (n === 0) return [p1];
        var dx = (p2[0] - p1[0]) / 3, dy = (p2[1] - p1[1]) / 3;
        var a = [p1[0] + dx, p1[1] + dy];
        var b = [p1[0] + 2 * dx, p1[1] + 2 * dy];
        var ang = Math.atan2(dy, dx) - Math.PI / 3;
        var len = Math.hypot(dx, dy);
        var c = [a[0] + len * Math.cos(ang), a[1] + len * Math.sin(ang)];
        return koch(p1, a, n - 1).concat(koch(a, c, n - 1), koch(c, b, n - 1), koch(b, p2, n - 1));
      }
      var plot = W.board(host, {
        xmin: -1.4, xmax: 1.4, ymin: -1.05, ymax: 1.15, height: 340,
        grid: false, axes: false,
        draw: function (g) {
          var R = 1;
          var v = [0, 1, 2].map(function (i) {
            var a = Math.PI / 2 + i * 2 * Math.PI / 3;
            return [R * Math.cos(a), R * Math.sin(a)];
          });
          var pts = koch(v[0], v[1], nivel).concat(koch(v[1], v[2], nivel), koch(v[2], v[0], nivel));
          g.path(pts, { color: 0, w: 1.6, close: true, fill: 0, fillAlpha: .16 });
        }
      });
      function paint() {
        var per = 3 * Math.pow(4 / 3, nivel);
        var area = 1 + (3 / 5) * (1 - Math.pow(4 / 9, nivel));
        out.set('Paso <strong>' + nivel + '</strong> &nbsp;·&nbsp; segmentos: $3\\cdot 4^{' + nivel + '} = ' +
          (3 * Math.pow(4, nivel)) + '$<br>' +
          'Perímetro (tomando 3 el del triángulo inicial): $3\\cdot\\left(\\frac{4}{3}\\right)^{' + nivel + '} = ' + U.fmt(per, 3) + '$ → tiende a <strong>infinito</strong><br>' +
          'Área (tomando 1 la del triángulo inicial): $' + U.fmt(area, 4) + '$ → tiende a <strong>1,6</strong><br>' +
          'Dimensión: $D = \\dfrac{\\log 4}{\\log 3} \\approx 1{,}2619$');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'pasos', min: 0, max: 5, step: 1, value: nivel, dec: 0,
        on: function (v) { nivel = v; paint(); }
      });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('La dimensión fraccionaria no es una excentricidad: mide rugosidad, y se usa en medicina. La ' +
    'ramificación de los vasos de una retina, la del árbol bronquial o la textura de un tejido ' +
    'tienen dimensiones fractales características, y desviarse de ellas es señal de enfermedad. En ' +
    'ingeniería, la dimensión fractal de una superficie predice cómo se desgastará o cuánta luz ' +
    'reflejará, y las antenas fractales aprovechan la repetición a distintas escalas para funcionar ' +
    'en muchas frecuencias con muy poco espacio.');

  p.hist('Casi veinte años antes de Lorenz, <strong>Mary Cartwright</strong> ya había visto el caos, aunque sin ponerle ' +
    'ese nombre. Durante la Segunda Guerra Mundial, el gobierno británico pidió ayuda a los matemáticos con unos ' +
    'amplificadores de radar que se comportaban de forma errática. Cartwright y John Littlewood estudiaron la ecuación ' +
    'que los describía, y demostraron que tenía soluciones de un comportamiento extraordinariamente irregular, muy ' +
    'sensibles a las condiciones. El físico Freeman Dyson, que asistió a una de sus conferencias, reconoció décadas ' +
    'después que no había sabido ver la importancia de lo que contaba. En 1947 fue la primera matemática elegida ' +
    'miembro de la Royal Society.');

  p.section('Practica');

  p.exercise({
    title: 'Iterar el mapa logístico',
    level: 'medio',
    gen: function (r) {
      var rr = r.pick([2, 2.5, 3, 1.5, 3.5]);
      var x0 = r.int(2, 8) / 10;
      var x = x0;
      for (var i = 0; i < 3; i++) x = rr * x * (1 - x);
      return { r: rr, x0: x0, res: x };
    },
    ask: function (d) {
      return 'Con $x_{n+1} = ' + U.fmt(d.r, 1) + '\\,x_n(1-x_n)$ y $x_0 = ' + U.fmt(d.x0, 1) + '$, ' +
        'calcula $x_3$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'x₃', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Aplica la fórmula tres veces seguidas, metiendo cada resultado en la siguiente.';
    },
    steps: function (d) {
      var s = [], x = d.x0;
      for (var i = 0; i < 3; i++) {
        var nx = d.r * x * (1 - x);
        s.push('$x_{' + (i + 1) + '} = ' + U.fmt(d.r, 1) + ' \\cdot ' + U.fmt(x, 4) + ' \\cdot (1 - ' +
          U.fmt(x, 4) + ') = ' + U.fmt(nx, 4) + '$');
        x = nx;
      }
      s.push('Resultado: $x_3 = ' + U.fmt(d.res, 4) + '$');
      return s;
    },
    answer: function (d) { return U.fmt(d.res, 4); }
  });

  p.exercise({
    title: 'Puntos de equilibrio',
    level: 'avanzado',
    gen: function (r) {
      var rr = r.int(15, 39) / 10;
      if (rr <= 1) return null;
      return { r: rr, eq: 1 - 1 / rr };
    },
    ask: function (d) {
      return 'Un punto de equilibrio cumple $x = r\\,x(1-x)$: la población se queda igual año tras año. ' +
        'Para $r = ' + U.fmt(d.r, 1) + '$, halla el equilibrio distinto de cero (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'x*', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.eq, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Divide los dos lados entre $x$ (puedes hacerlo porque buscas la solución no nula) y despeja.'; },
    steps: function (d) {
      return ['Planteamos $x = r\\,x(1-x)$.',
        'Como buscamos $x \\ne 0$, dividimos entre $x$: $1 = r(1-x)$.',
        '$1 - x = \\dfrac{1}{r} \\Rightarrow x = 1 - \\dfrac{1}{r}$',
        'Con $r = ' + U.fmt(d.r, 1) + '$: $x^* = 1 - \\dfrac{1}{' + U.fmt(d.r, 1) + '} = ' + U.fmt(d.eq, 4) + '$',
        'Ojo: que exista el equilibrio no significa que el sistema vaya a caer en él. Es estable solo si $r < 3$.'];
    },
    answer: function (d) { return U.fmt(d.eq, 4); }
  });

  p.exercise({
    title: 'Dimensión fractal',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { n: 'copo de Koch', N: 4, k: 3 },
        { n: 'triángulo de Sierpinski', N: 3, k: 2 },
        { n: 'alfombra de Sierpinski', N: 8, k: 3 },
        { n: 'polvo de Cantor', N: 2, k: 3 },
        { n: 'esponja de Menger', N: 20, k: 3 }
      ];
      var c = r.pick(casos);
      return { n: c.n, N: c.N, k: c.k, D: Math.log(c.N) / Math.log(c.k) };
    },
    ask: function (d) {
      return 'En el <strong>' + d.n + '</strong>, cada paso sustituye la figura por $' + d.N +
        '$ copias reducidas a $\\frac{1}{' + d.k + '}$ de su tamaño. Calcula su dimensión fractal ' +
        '(cuatro decimales).';
    },
    fields: [{ name: 'D', label: 'Dimensión', w: 'tiny' }],
    sol: function (d) { return { D: U.round(d.D, 4) }; },
    tol: 3e-4,
    hint: function (d) { return '$D = \\dfrac{\\log N}{\\log k}$ con $N = ' + d.N + '$ y $k = ' + d.k + '$.'; },
    steps: function (d) {
      return ['$D = \\dfrac{\\log N}{\\log k} = \\dfrac{\\log ' + d.N + '}{\\log ' + d.k + '}$',
        '$= \\dfrac{' + U.fmt(Math.log(d.N), 4) + '}{' + U.fmt(Math.log(d.k), 4) + '} = ' + U.fmt(d.D, 4) + '$',
        'Como no es un número entero, la figura no es ni una curva ni una superficie: está entre las dos.'];
    },
    answer: function (d) { return U.fmt(d.D, 4); }
  });

  p.keys([
    'Determinista no significa predecible: el caos surge de reglas simples y exactas.',
    'Mapa logístico $x_{n+1}=r\\,x_n(1-x_n)$: una parábola que produce equilibrio, ciclos y caos según $r$.',
    'Dependencia sensible: los errores iniciales crecen <strong>exponencialmente</strong>, así que medir mejor solo compra unos pocos pasos más de predicción.',
    'La ruta al caos por duplicación de periodo es universal, con la constante de Feigenbaum $\\delta \\approx 4{,}669$.',
    'Fractal = autosemejanza. Su dimensión $D = \\log N/\\log k$ no tiene por qué ser un número entero.',
    'El copo de Koch tiene perímetro infinito encerrando un área finita.'
  ]);
});
