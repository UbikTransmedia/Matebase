/* Tema: Geometría diferencial: curvatura */
Course.topic('av-geodif', function (p) {

  p.text('La geometría clásica estudia rectas, círculos y polígonos: figuras rígidas. El cálculo ' +
    'estudia funciones que cambian. La <strong>geometría diferencial</strong> junta las dos y estudia ' +
    'curvas y superficies <em>cualesquiera</em>, usando derivadas para medir cómo se doblan.');

  p.section('Curvatura de una curva plana');

  p.text('Una recta no se dobla nada. Un círculo pequeño se dobla mucho. Esa intuición se convierte en ' +
    'un número exacto con una idea preciosa: en cada punto de una curva se coloca el ' +
    '<strong>círculo que mejor la aproxima</strong>, y se mide su radio.');

  p.formulas([
    '\\kappa = \\frac{1}{R} \\quad \\text{(curvatura = inverso del radio de curvatura)}',
    '\\kappa = \\frac{|y\'\'|}{\\left(1 + (y\')^2\\right)^{3/2}} \\quad \\text{para } y = f(x)'
  ]);

  p.list([
    'Recta: $\\kappa = 0$ (radio infinito).',
    'Circunferencia de radio $R$: $\\kappa = 1/R$ en todos sus puntos.',
    'Cuanto más cerrada la curva, mayor $\\kappa$.'
  ]);

  p.demo({
    title: 'El círculo que mejor se ajusta',
    intro: 'Mueve el punto por la curva y observa el círculo osculador: el que se pega más a la curva ahí. Donde la curva es casi recta, el círculo es enorme.',
    build: function (host, d) {
      var cual = 'parabola';
      var fs = {
        parabola: { f: function (x) { return 0.35 * x * x; }, d1: function (x) { return 0.7 * x; }, d2: function () { return 0.7; }, t: 'y = 0{,}35x^2' },
        seno: { f: function (x) { return 2 * Math.sin(x); }, d1: function (x) { return 2 * Math.cos(x); }, d2: function (x) { return -2 * Math.sin(x); }, t: 'y = 2\\operatorname{sen}(x)' },
        cubica: { f: function (x) { return 0.12 * x * x * x; }, d1: function (x) { return 0.36 * x * x; }, d2: function (x) { return 0.72 * x; }, t: 'y = 0{,}12x^3' }
      };
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 350,
        handles: {
          P: {
            x: 1.5, y: 0, label: '', color: 2,
            constrain: function (h) { h.x = U.clamp(h.x, -5, 5); h.y = fs[cual].f(h.x); }
          }
        },
        draw: function (g) {
          var F = fs[cual];
          g.fn(F.f, { color: 0, w: 2.8 });
          var x = g.h('P').x, y = F.f(x);
          var yp = F.d1(x), ypp = F.d2(x);
          var kap = Math.abs(ypp) / Math.pow(1 + yp * yp, 1.5);
          if (kap > 1e-6) {
            var R = 1 / kap;
            // centro del circulo osculador, en la normal
            var norm = Math.sqrt(1 + yp * yp);
            var sgn = ypp >= 0 ? 1 : -1;
            var cx = x - sgn * yp / norm * R;
            var cy = y + sgn * 1 / norm * R;
            g.circle(cx, cy, R, { color: 3, w: 2, stroke: true, alpha: .9 });
            g.point(cx, cy, { color: 3, r: 4 });
            g.seg(x, y, cx, cy, { color: 3, w: 1.2, dash: true });
          }
          // tangente
          g.fn(function (t) { return y + yp * (t - x); }, { from: x - 2, to: x + 2, color: 1, w: 1.8, dash: true });
          g.point(x, y, { color: 2, r: 6 });
          out.set('$' + F.t + '$ &nbsp;·&nbsp; en $x = ' + U.fmt(x, 2) + '$<br>' +
            '$y\' = ' + U.fmt(yp, 3) + '$, &nbsp; $y\'\' = ' + U.fmt(ypp, 3) + '$<br>' +
            '$\\kappa = \\dfrac{|' + U.fmt(ypp, 3) + '|}{(1 + ' + U.fmt(yp * yp, 3) + ')^{3/2}} = ' + U.fmt(kap, 5) + '$ ' +
            '&nbsp;·&nbsp; radio de curvatura $R = ' + (kap > 1e-6 ? U.fmt(1 / kap, 4) : '\\infty') + '$<br>' +
            '<span style="font-size:12.5px;color:var(--ink-faint)">' +
            (kap < 0.05 ? 'Aquí la curva es casi recta: el círculo osculador es gigantesco.'
              : 'Donde la curva se cierra más, el círculo se hace pequeño y la curvatura crece.') + '</span>');
        }
      });
      W.chips(host, [
        { label: 'parábola', value: 'parabola' }, { label: 'seno', value: 'seno' }, { label: 'cúbica', value: 'cubica' }
      ], { value: 'parabola', on: function (v) { cual = v; } });
      W.hint(host, 'Arrastra el punto rojo a lo largo de la curva.');
    }
  });

  p.note('Fíjate en la fórmula: la curvatura depende de la <strong>segunda derivada</strong>, que ya ' +
    'sabías que medía la concavidad. La geometría diferencial no inventa nada nuevo aquí: le da ' +
    'significado geométrico exacto a algo que ya usabas para estudiar funciones.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Superficies: la curvatura de Gauss');

  p.text('En una superficie, en cada punto y en cada dirección hay una curvatura distinta. Gauss tuvo ' +
    'la idea de quedarse con las dos extremas —la máxima $\\kappa_1$ y la mínima $\\kappa_2$, llamadas ' +
    '<em>curvaturas principales</em>— y multiplicarlas.');

  p.formula('K = \\kappa_1 \\cdot \\kappa_2', 'curvatura de Gauss');

  p.table(['Signo de K', 'Forma', 'Ejemplos'],
    [['$K > 0$', 'de cuenco: se curva igual en todas direcciones', 'esfera, elipsoide, cima de una montaña'],
     ['$K = 0$', 'plana o desarrollable', 'plano, cilindro, cono'],
     ['$K < 0$', 'de silla de montar: sube en una dirección y baja en otra', 'hiperboloide, puerto de montaña, patata frita']]);

  p.demo({
    title: 'Los tres tipos de curvatura',
    intro: 'Corte de una superficie por dos planos perpendiculares. Cambia el tipo y mira los dos perfiles: su producto es la curvatura de Gauss.',
    build: function (host, d) {
      var tipo = 'esfera';
      var tipos = {
        esfera: { k1: 0.5, k2: 0.5, n: 'Esfera: se curva hacia el mismo lado en las dos direcciones. $K > 0$.' },
        cilindro: { k1: 0.6, k2: 0, n: 'Cilindro: se curva en una dirección y es <strong>recto</strong> en la otra. $K = 0$: se puede desenrollar sobre un plano sin estirarlo.' },
        silla: { k1: 0.5, k2: -0.5, n: 'Silla de montar: sube en una dirección y baja en la otra. $K < 0$.' },
        plano: { k1: 0, k2: 0, n: 'Plano: no se curva en ninguna dirección. $K = 0$.' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3.5, xmax: 3.5, ymin: -2.2, ymax: 2.2, height: 280,
        grid: false,
        draw: function (g) {
          var T = tipos[tipo];
          g.fn(function (x) { return 0.5 * T.k1 * x * x; }, { color: 0, w: 3 });
          g.fn(function (x) { return 0.5 * T.k2 * x * x; }, { color: 1, w: 3 });
          g.point(0, 0, { color: 2, r: 6 });
        }
      });
      function paint() {
        var T = tipos[tipo];
        var K = T.k1 * T.k2;
        out.set('<span style="color:var(--c1)">Perfil en la dirección 1</span>: $\\kappa_1 = ' + U.fmt(T.k1, 2) + '$ &nbsp;·&nbsp; ' +
          '<span style="color:var(--c2)">dirección 2</span>: $\\kappa_2 = ' + U.fmt(T.k2, 2) + '$<br>' +
          '<strong>$K = \\kappa_1\\kappa_2 = ' + U.fmt(K, 3) + '$</strong> — ' + T.n);
        plot.render();
      }
      W.chips(host, [
        { label: 'esfera (K > 0)', value: 'esfera' }, { label: 'cilindro (K = 0)', value: 'cilindro' },
        { label: 'silla (K < 0)', value: 'silla' }, { label: 'plano (K = 0)', value: 'plano' }
      ], { value: 'esfera', on: function (v) { tipo = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El teorema egregio');

  p.note('Gauss demostró en 1827 que <strong>la curvatura $K$ se puede calcular midiendo únicamente ' +
    'dentro de la superficie</strong>, sin salir de ella y sin saber nada del espacio que la rodea. Le ' +
    'llamó <em>theorema egregium</em>, «teorema notable», y con razón: es de los resultados más ' +
    'importantes de la historia de la geometría.', 'ok', 'Theorema egregium');

  p.text('¿Qué significa eso en la práctica? Que una hormiga que viva en la superficie, sin poder ' +
    'levantar la cabeza, <strong>puede averiguar si su mundo es curvo</strong>. Solo tiene que medir: ' +
    'trazar un triángulo y sumar sus ángulos, o medir la circunferencia de un círculo de radio conocido.');

  p.formula('\\alpha + \\beta + \\gamma - \\pi = \\iint_T K\\,dA', 'exceso angular = curvatura encerrada');

  p.table(['Superficie', 'Ángulos de un triángulo'],
    [['Plana ($K=0$)', 'suman exactamente $180^\\circ$'],
     ['Esférica ($K>0$)', 'suman <strong>más</strong> de $180^\\circ$'],
     ['Hiperbólica ($K<0$)', 'suman <strong>menos</strong> de $180^\\circ$']]);

  p.text('Sobre la Tierra, un triángulo con vértices en el polo norte y dos puntos del ecuador separados ' +
    '$90^\\circ$ tiene <strong>tres ángulos rectos</strong>: suman $270^\\circ$. En una esfera no vale ' +
    'la geometría de Euclides.');

  p.note('Y de ahí sale una consecuencia cotidiana: <strong>es imposible hacer un mapa plano exacto de ' +
    'la Tierra</strong>. La esfera tiene $K > 0$ y el plano $K = 0$; como $K$ es intrínseca, no hay ' +
    'forma de aplanar una sin deformarla. Todas las proyecciones cartográficas mienten en algo, y no ' +
    'por falta de habilidad: por un teorema.', null, 'Por qué todos los mapas están mal');

  p.demo({
    title: 'Triángulos en una esfera',
    intro: 'Un triángulo formado por dos meridianos y el ecuador. Abre el ángulo entre los meridianos y suma los tres ángulos del triángulo.',
    build: function (host, d) {
      var ang = 90;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.6, xmax: 1.6, ymin: -1.4, ymax: 1.4, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          g.circle(0, 0, 1, { color: 'axis', w: 2, stroke: true });
          // ecuador visto de canto (elipse)
          g.param(function (t) { return Math.cos(t); }, function (t) { return 0.25 * Math.sin(t); },
            0, 6.2832, { color: 'axis', w: 1.4, dash: true });
          // dos meridianos, elipses que pasan por los polos
          var a1 = 0, a2 = ang * Math.PI / 180;
          [a1, a2].forEach(function (a, i) {
            g.param(function (t) { return Math.cos(a) * Math.sin(t); },
              function (t) { return Math.cos(t); },
              0, Math.PI, { color: i, w: 2.6 });
          });
          // arco de ecuador entre los dos meridianos
          g.param(function (t) { return Math.cos(t); }, function (t) { return 0.25 * Math.sin(t); },
            0, a2, { color: 2, w: 3.4 });
          g.point(0, 1, { color: 3, r: 6, label: 'polo', labelDy: -12 });
        }
      });
      function paint() {
        var suma = 90 + 90 + ang;
        var exceso = suma - 180;
        out.set('Triángulo formado por dos meridianos separados $' + ang + '^\\circ$ y el ecuador.<br>' +
          'Los dos ángulos del ecuador son rectos ($90^\\circ$ cada uno) y el del polo mide $' + ang + '^\\circ$.<br>' +
          '<strong>Suma: $' + suma + '^\\circ$</strong> &nbsp;·&nbsp; exceso sobre $180^\\circ$: $' + exceso + '^\\circ$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">El exceso es proporcional al área del ' +
          'triángulo: en una esfera, cuanto más grande es un triángulo, más se pasa de $180^\\circ$. ' +
          'Una hormiga que midiera esto sabría que vive en una superficie curva sin salir de ella nunca.</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'ángulo entre meridianos', min: 10, max: 170, step: 5, value: 90, dec: 0, on: function (v) { ang = v; paint(); } });
      paint();
    }
  });

  p.util('El teorema egregio explica por qué no existe un mapa plano fiel de la Tierra: la esfera tiene ' +
    'curvatura y el papel no, y ninguna curvatura se cambia sin estirar. Toda proyección deforma ' +
    'algo —la de Mercator conserva los ángulos, que es lo que necesita un navegante, a cambio de ' +
    'convertir Groenlandia en un continente—, y por eso hay decenas de proyecciones distintas y ' +
    'ninguna es «la buena». Es también la razón de que una porción de pizza se sostenga si la ' +
    'doblas.');

  p.section('Geodésicas');

  p.text('En una superficie curva no hay rectas, pero sí <strong>geodésicas</strong>: los caminos más ' +
    'cortos entre dos puntos. En la esfera son arcos de <em>círculo máximo</em>, y por eso las rutas ' +
    'de avión entre Madrid y Nueva York suben hacia Groenlandia aunque en el mapa plano parezca un ' +
    'rodeo absurdo.');

  p.hist('Riemann generalizó estas ideas en 1854 a espacios de cualquier dimensión, en una conferencia ' +
    'que Gauss, ya anciano, escuchó admirado. Durante sesenta años fue matemática sin aplicación. ' +
    'Hasta que en 1915 Einstein la necesitó: en la relatividad general, la gravedad <strong>no es una ' +
    'fuerza</strong>, sino la curvatura del espacio-tiempo, y los planetas simplemente siguen ' +
    'geodésicas. La herramienta ya estaba construida, esperando.');

  /* ================= EJERCICIOS ================= */
  p.util('Las geodésicas son la razón de que un vuelo de Madrid a Nueva York suba hacia Groenlandia: ' +
    'sobre una esfera el camino más corto no es la línea recta del mapa, sino un arco de círculo ' +
    'máximo. Las rutas aéreas y marítimas se calculan así. Y en relatividad general la idea se lleva ' +
    'al extremo: la gravedad no es una fuerza sino curvatura del espacio-tiempo, y un planeta en ' +
    'órbita simplemente sigue su geodésica, es decir, va todo lo recto que puede en un espacio ' +
    'curvado.');

  p.section('Practica');

  p.exercise({
    title: 'Curvatura de una circunferencia',
    level: 'basico',
    gen: function (r) {
      var R = r.int(2, 40);
      return { R: R, k: 1 / R };
    },
    ask: function (d) {
      return 'Una circunferencia tiene radio $R = ' + d.R + '$. ¿Cuál es su curvatura? (seis decimales)';
    },
    fields: [{ name: 'k', label: 'κ', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.k, 8) }; },
    tol: 3e-5,
    hint: function () { return 'La curvatura de una circunferencia es el inverso de su radio.'; },
    steps: function (d) {
      return ['$\\kappa = \\dfrac{1}{R} = \\dfrac{1}{' + d.R + '} = ' + U.fmt(d.k, 6) + '$',
        'Cuanto mayor es el radio, menor la curvatura: una circunferencia enorme se parece localmente a una recta.',
        'En el límite $R \\to \\infty$ queda $\\kappa = 0$, que es exactamente la curvatura de una recta.'];
    },
    answer: function (d) { return U.fmt(d.k, 6); }
  });

  p.exercise({
    title: 'Curvatura de una parábola',
    level: 'medio',
    gen: function (r) {
      var a = r.int(1, 6) / 2;
      var x = r.pm(0, 3);
      var yp = 2 * a * x, ypp = 2 * a;
      var k = Math.abs(ypp) / Math.pow(1 + yp * yp, 1.5);
      return { a: a, x: x, yp: yp, ypp: ypp, k: k };
    },
    ask: function (d) {
      return 'Calcula la curvatura de $y = ' + U.fmt(d.a, 1) + 'x^2$ en el punto de abscisa $x = ' +
        d.x + '$ (seis decimales).<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Usa $\\kappa = \\dfrac{|y\'\'|}{(1+(y\')^2)^{3/2}}$.</span>';
    },
    fields: [{ name: 'k', label: 'κ', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.k, 8) }; },
    tol: 3e-5,
    hint: function (d) { return '$y\' = ' + U.fmt(2 * d.a, 1) + 'x = ' + U.fmt(d.yp, 3) + '$ y $y\'\' = ' + U.fmt(d.ypp, 1) + '$.'; },
    steps: function (d) {
      return ['$y\' = ' + U.fmt(2 * d.a, 1) + 'x$, que en $x = ' + d.x + '$ vale $' + U.fmt(d.yp, 3) + '$.',
        '$y\'\' = ' + U.fmt(d.ypp, 1) + '$ (constante en una parábola).',
        '$\\kappa = \\dfrac{' + U.fmt(d.ypp, 1) + '}{(1 + ' + U.fmt(d.yp * d.yp, 4) + ')^{3/2}} = ' + U.fmt(d.k, 6) + '$',
        d.x === 0 ? 'En el vértice la curvatura es máxima: ahí la parábola se cierra más.'
          : 'Al alejarse del vértice la curvatura baja: la parábola se va estirando y se parece más a una recta.'];
    },
    answer: function (d) { return U.fmt(d.k, 6); }
  });

  p.exercise({
    title: 'Signo de la curvatura de Gauss',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { s: 'una esfera', t: 1 }, { s: 'un cilindro', t: 2 }, { s: 'un plano', t: 2 },
        { s: 'una silla de montar', t: 3 }, { s: 'un cono (fuera del vértice)', t: 2 },
        { s: 'la superficie interior de un donut (la parte del agujero)', t: 3 },
        { s: 'la superficie exterior de un donut', t: 1 },
        { s: 'un elipsoide', t: 1 }, { s: 'un hiperboloide de una hoja', t: 3 }
      ];
      var c = r.pick(casos);
      return { s: c.s, t: c.t };
    },
    ask: function (d) {
      return '¿Qué signo tiene la curvatura de Gauss de <strong>' + d.s + '</strong>?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)"><code>1</code> positiva · ' +
        '<code>2</code> cero · <code>3</code> negativa</span>';
    },
    fields: [{ name: 't', label: 'Signo', w: 'tiny' }],
    sol: function (d) { return { t: d.t }; },
    hint: function () { return 'Piensa en las dos direcciones extremas: ¿se curva hacia el mismo lado (positiva), hacia lados opuestos (negativa) o es recta en alguna (cero)?'; },
    steps: function (d) {
      return ['$K = \\kappa_1 \\kappa_2$, así que su signo lo deciden las dos curvaturas principales.',
        'Si se curva hacia el mismo lado en las dos direcciones, las dos tienen el mismo signo y $K>0$.',
        'Si es recta en alguna dirección, esa curvatura es cero y $K=0$: la superficie es <em>desarrollable</em>, se puede aplanar sin estirarla.',
        'Si sube en una dirección y baja en otra, los signos son opuestos y $K<0$.',
        'Aquí la curvatura es <strong>' + ['', 'positiva', 'cero', 'negativa'][d.t] + '</strong>.'];
    },
    answer: function (d) { return ['', 'Positiva (K > 0)', 'Cero (K = 0)', 'Negativa (K < 0)'][d.t]; }
  });

  p.exercise({
    title: 'Triángulo en una esfera',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(20, 170), b = r.int(20, 170), c = r.int(20, 170);
      var suma = a + b + c;
      if (suma <= 180 || suma >= 540) return null;
      return { a: a, b: b, c: c, suma: suma, exceso: suma - 180 };
    },
    ask: function (d) {
      return 'Un triángulo dibujado sobre una esfera tiene ángulos de $' + d.a + '^\\circ$, $' + d.b +
        '^\\circ$ y $' + d.c + '^\\circ$. Calcula su <strong>exceso angular</strong>, es decir, cuánto ' +
        'se pasa de $180^\\circ$.';
    },
    fields: [{ name: 'e', label: 'Exceso (°)', w: 'tiny' }],
    sol: function (d) { return { e: d.exceso }; },
    hint: function () { return 'Suma los tres ángulos y réstale 180.'; },
    steps: function (d) {
      return ['Suma de los ángulos: $' + d.a + ' + ' + d.b + ' + ' + d.c + ' = ' + d.suma + '^\\circ$.',
        'Exceso: $' + d.suma + ' - 180 = ' + d.exceso + '^\\circ$.',
        'En un plano ese exceso sería siempre cero; aquí es positivo porque la esfera tiene $K > 0$.',
        'Por el teorema de Gauss-Bonnet, ese exceso (en radianes) es exactamente la curvatura total ' +
        'encerrada: $\\iint_T K\\,dA$. Midiendo ángulos se mide el área.'];
    },
    answer: function (d) { return d.exceso + '° de exceso'; }
  });

  p.keys([
    'Curvatura de una curva: el inverso del radio del círculo que mejor la aproxima.',
    'Se calcula con la <strong>segunda derivada</strong>: la geometría diferencial le da sentido geométrico exacto.',
    'Curvatura de Gauss $K = \\kappa_1\\kappa_2$: positiva (cuenco), cero (plano o cilindro), negativa (silla).',
    '<strong>Teorema egregio</strong>: $K$ se puede medir desde dentro, sin salir de la superficie.',
    'En una esfera los triángulos suman más de $180^\\circ$; en una silla, menos.',
    'Por eso <strong>no existe un mapa plano exacto de la Tierra</strong>.',
    'Geodésicas = caminos más cortos. En relatividad general, los planetas simplemente las siguen.'
  ]);
});
