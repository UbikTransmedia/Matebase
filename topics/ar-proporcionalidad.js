/* Tema: Proporcionalidad y porcentajes */
Course.topic('ar-proporcionalidad', function (p) {

  p.text('Una <strong>razón</strong> entre dos cantidades es su cociente: $\\frac{a}{b}$. Una ' +
    '<strong>proporción</strong> es la igualdad de dos razones. Y de ahí sale la herramienta más ' +
    'utilizada de todas las matemáticas escolares: la regla de tres.');

  p.formula('\\frac{a}{b} = \\frac{c}{d} \\quad\\Longleftrightarrow\\quad a\\cdot d = b\\cdot c',
    'propiedad fundamental de las proporciones');

  p.section('Directa o inversa');

  p.text('Dos magnitudes son <strong>directamente proporcionales</strong> si al multiplicar una por un ' +
    'número, la otra queda multiplicada por el mismo número. El cociente entre ellas es constante: ' +
    'esa constante se llama <em>razón de proporcionalidad</em>.');

  p.formula('\\frac{y}{x} = k \\quad\\Longrightarrow\\quad y = k\\,x', 'proporcionalidad directa');

  p.text('Son <strong>inversamente proporcionales</strong> si al multiplicar una por un número, la otra ' +
    'queda dividida por él. Ahora lo constante es el <em>producto</em>.');

  p.formula('x\\cdot y = k \\quad\\Longrightarrow\\quad y = \\frac{k}{x}', 'proporcionalidad inversa');

  p.note('Antes de aplicar ninguna regla, pregúntate: <em>si una magnitud aumenta, ¿la otra aumenta ' +
    'o disminuye?</em> Más kilos de fruta, más precio → directa. Más obreros, menos tiempo → inversa. ' +
    'Equivocarse aquí es equivocarse en todo el problema.', 'warn', 'El paso que hay que pensar');

  p.demo({
    title: 'Directa frente a inversa',
    intro: 'La proporcionalidad directa es una recta que pasa por el origen. La inversa es una hipérbola: cuando una crece, la otra se hunde.',
    build: function (host, d) {
      var k = 6, modo = 'directa';
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 10, ymin: 0, ymax: 12, height: 300,
        xlabel: 'x', ylabel: 'y',
        draw: function (g) {
          if (modo === 'directa') {
            g.fn(function (x) { return k * x / 3; }, { color: 0, w: 2.6 });
            for (var i = 1; i <= 5; i++) g.point(i, k * i / 3, { color: 0, r: 4 });
          } else {
            g.fn(function (x) { return x > 0.05 ? k * 2 / x : NaN; }, { color: 1, w: 2.6 });
            for (var j = 2; j <= 9; j++) g.point(j, k * 2 / j, { color: 1, r: 4 });
          }
        }
      });
      function paint() {
        if (modo === 'directa') {
          var kk = U.fmt(k / 3, 2);
          out.set('$y = ' + kk + '\\,x$ &nbsp;·&nbsp; el <strong>cociente</strong> $y/x$ vale siempre $' + kk + '$.' +
            '<br>x = 1, 2, 3, 4 → y = ' + [1, 2, 3, 4].map(function (i) { return U.fmt(k * i / 3, 2); }).join(', '));
        } else {
          out.set('$y = \\dfrac{' + (k * 2) + '}{x}$ &nbsp;·&nbsp; el <strong>producto</strong> $x\\cdot y$ vale siempre $' + (k * 2) + '$.' +
            '<br>x = 2, 3, 4, 6 → y = ' + [2, 3, 4, 6].map(function (i) { return U.fmt(k * 2 / i, 2); }).join(', '));
        }
        plot.render();
      }
      W.chips(host, [{ label: 'Directa', value: 'directa' }, { label: 'Inversa', value: 'inversa' }],
        { value: 'directa', on: function (v) { modo = v; paint(); } });
      W.slider(W.row(host), {
        label: 'constante k', min: 1, max: 12, step: 1, value: k, dec: 0,
        on: function (v) { k = v; paint(); }
      });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El precio por kilo del supermercado es proporcionalidad hecha ley: la etiqueta está obligada a ' +
    'mostrarlo justamente para que puedas comparar envases distintos sin echar cuentas. La escala de ' +
    'un mapa, la dosis de un medicamento según el peso, el cambio de divisa y las recetas al doble ' +
    'son el mismo cálculo. La inversa aparece cuando algo se reparte: al doble de trabajadores, la ' +
    'mitad de tiempo; al doble de velocidad, la mitad de duración del viaje.');

  p.section('Porcentajes');

  p.text('Un porcentaje es una fracción de denominador 100. $\\;35\\% = \\frac{35}{100} = 0{,}35$. ' +
    'Calcular el $35\\%$ de una cantidad es multiplicarla por $0{,}35$; no hay nada más.');

  p.formula('35\\%\\ \\text{de}\\ 240 = 0{,}35 \\cdot 240 = 84');

  p.sub('Aumentos y descuentos: el índice de variación');

  p.text('En vez de calcular el descuento y restarlo, se hace en un solo paso multiplicando por el ' +
    '<strong>índice de variación</strong>. Es más rápido, y sobre todo es lo que permite encadenar ' +
    'varios cambios seguidos.');

  p.table(['Cambio', 'Índice', 'Ejemplo sobre 200 €'],
    [['Sube un 20 %', '$1 + 0{,}20 = 1{,}2$', '$200 \\cdot 1{,}2 = 240$'],
     ['Baja un 20 %', '$1 - 0{,}20 = 0{,}8$', '$200 \\cdot 0{,}8 = 160$'],
     ['Sube un 7 %', '$1{,}07$', '$200 \\cdot 1{,}07 = 214$'],
     ['Baja un 35 %', '$0{,}65$', '$200 \\cdot 0{,}65 = 130$']]);

  p.demo({
    title: 'Subir un 20 % y bajar un 20 % no te deja igual',
    intro: 'Encadena dos variaciones y comprueba en qué acaba el precio. La sorpresa es que el orden da igual, pero el resultado nunca vuelve al punto de partida.',
    build: function (host, d) {
      var p0 = 200, v1 = 20, v2 = -20;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 2.6, ymin: 0, ymax: 340, height: 250,
        xlabel: null, ylabel: '€', xstep: 1,
        xtickLabel: function (i) { return ['inicio', 'tras el 1.º', 'tras el 2.º'][Math.round(i)] || ''; },
        draw: function (g) {
          var i1 = 1 + v1 / 100, i2 = 1 + v2 / 100;
          var vals = [p0, p0 * i1, p0 * i1 * i2];
          g.bars(vals.map(function (v, i) {
            return { x: i, h: v, color: i === 2 ? 2 : 0, top: U.fmt(v, 2) + ' €' };
          }), { width: 0.5 });
          g.hline(p0, { color: 'axis', dash: true, w: 1.4 });
        }
      });
      function paint() {
        var i1 = 1 + v1 / 100, i2 = 1 + v2 / 100;
        var fin = p0 * i1 * i2;
        var total = (i1 * i2 - 1) * 100;
        out.set('$' + p0 + ' \\cdot ' + U.fmt(i1, 2) + ' \\cdot ' + U.fmt(i2, 2) + ' = ' + U.fmt(fin, 2) + '$ €' +
          '<br>Índice total: $' + U.fmt(i1 * i2, 4) + '$ → variación global del <strong>' +
          U.fmts(total, 2) + ' %</strong>' +
          (Math.abs(total) < 0.001 ? '' : '<br><span style="font-size:12.5px;color:var(--ink-faint)">' +
            'No es la suma de los dos porcentajes: los índices se <em>multiplican</em>, no se suman.</span>'));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'precio inicial (€)', min: 50, max: 300, step: 10, value: p0, dec: 0, on: function (v) { p0 = v; paint(); } });
      W.slider(row, { label: '1.ª variación (%)', min: -50, max: 50, step: 5, value: v1, dec: 0, on: function (v) { v1 = v; paint(); } });
      W.slider(row, { label: '2.ª variación (%)', min: -50, max: 50, step: 5, value: v2, dec: 0, on: function (v) { v2 = v; paint(); } });
      paint();
    }
  });

  p.util('Aquí vive una trampa que aparece en rebajas y en nóminas: <strong>subir un 10 % y luego bajar ' +
    'un 10 % no devuelve al punto de partida</strong>. Cien euros suben a 110 y bajan a 99, porque ' +
    'cada porcentaje se aplica sobre una cantidad distinta. Por eso una acción que cae un 50 % ' +
    'necesita subir un 100 % para recuperarse. Y ojo con las noticias: pasar del 4 % al 6 % de paro ' +
    'es subir <em>dos puntos</em>, pero un 50 % en términos relativos; ambas cifras son ciertas y ' +
    'cuentan historias muy distintas.');

  p.section('Interés');

  p.text('El dinero en un banco crece aplicando un porcentaje cada periodo. Si los intereses se ' +
    'guardan aparte, el interés es <strong>simple</strong>; si se suman al capital y a partir de ahí ' +
    'también generan intereses, es <strong>compuesto</strong>, y entonces el crecimiento es exponencial.');

  p.formulas([
    'C_{\\text{simple}} = C_0\\,(1 + r\\,t)',
    'C_{\\text{compuesto}} = C_0\\,(1 + r)^{t}'
  ], 'r en tantos por uno, t en periodos');

  /* ================= EJERCICIOS ================= */
  p.util('El interés compuesto es la razón de que una hipoteca a 30 años cueste mucho más que el dinero ' +
    'prestado, y de que una tarjeta de crédito aplazada sea tan cara: un 20 % anual no significa ' +
    'pagar un 20 % más, porque los intereses generan intereses. La misma fórmula, mirada al revés, ' +
    'es la que explica por qué empezar a ahorrar diez años antes cambia el resultado más que ahorrar ' +
    'el doble. Cuando llegues a exponenciales verás que es la misma curva.');

  p.hist('El interés compuesto es más antiguo que casi todo lo demás de este curso: hay tablillas ' +
    'babilónicas de hace casi cuatro mil años que calculan en cuánto tiempo se duplica un capital ' +
    'prestado, y la respuesta que dan coincide con la que daría hoy una calculadora. Durante siglos, ' +
    'sin embargo, cobrar interés estuvo prohibido o mal visto en el cristianismo y el islam, y buena ' +
    'parte de la ingeniería financiera medieval consistió en inventar contratos que hicieran lo ' +
    'mismo sin llamarlo así.');

  p.section('Practica');

  p.exercise({
    title: 'Regla de tres directa',
    level: 'basico',
    gen: function (r) {
      var precioUnit = r.int(2, 9) * 0.5;
      var a = r.int(2, 9), c = r.int(3, 15);
      if (a === c) return null;
      return { a: a, pa: U.round(a * precioUnit, 2), c: c, res: U.round(c * precioUnit, 2) };
    },
    ask: function (d) {
      return 'Si $' + d.a + '$ kg de manzanas cuestan $' + U.fmt(d.pa, 2) + '$ €, ' +
        '¿cuánto cuestan $' + d.c + '$ kg?';
    },
    fields: [{ name: 'v', label: 'Precio (€)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-4,
    hint: function (d) { return 'Más kilos, más precio: es directa. Calcula primero el precio de 1 kg.'; },
    steps: function (d) {
      return ['Más kilos cuestan más dinero, así que la proporcionalidad es <strong>directa</strong>.',
        'Precio de 1 kg: $' + U.fmt(d.pa, 2) + ' : ' + d.a + ' = ' + U.fmt(d.pa / d.a, 4) + '$ €.',
        'Para $' + d.c + '$ kg: $' + U.fmt(d.pa / d.a, 4) + ' \\cdot ' + d.c + ' = ' + U.fmt(d.res, 2) + '$ €.',
        'En forma de proporción: $\\dfrac{' + d.a + '}{' + U.fmt(d.pa, 2) + '} = \\dfrac{' + d.c + '}{x}$.'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' €'; }
  });

  p.exercise({
    title: 'Regla de tres inversa',
    level: 'medio',
    gen: function (r) {
      var k = r.pick([24, 36, 48, 60, 72, 120]);
      var a = r.pick([2, 3, 4, 6]), c = r.pick([2, 3, 4, 5, 6, 8]);
      if (a === c || k % a || k % c) return null;
      return { a: a, ta: k / a, c: c, res: k / c, k: k };
    },
    ask: function (d) {
      return '$' + d.a + '$ obreros tardan $' + d.ta + '$ días en hacer una obra. ' +
        'Trabajando al mismo ritmo, ¿cuántos días tardarán $' + d.c + '$ obreros?';
    },
    fields: [{ name: 'v', label: 'Días', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    hint: function () { return 'Más obreros, menos días: es inversa. Lo que se conserva es el producto obreros × días.'; },
    steps: function (d) {
      return ['Más obreros significa menos días: la proporcionalidad es <strong>inversa</strong>.',
        'Lo constante es el trabajo total: $' + d.a + ' \\cdot ' + d.ta + ' = ' + d.k + '$ jornadas.',
        'Con $' + d.c + '$ obreros: $' + d.k + ' : ' + d.c + ' = ' + d.res + '$ días.'];
    },
    answer: function (d) { return d.res + ' días.'; }
  });

  p.exercise({
    title: 'Descuentos y subidas',
    level: 'basico',
    gen: function (r) {
      var precio = r.int(4, 60) * 5;
      var pct = r.pick([5, 10, 12, 15, 20, 25, 30, 40]);
      var sube = r.bool();
      var idx = sube ? 1 + pct / 100 : 1 - pct / 100;
      return { precio: precio, pct: pct, sube: sube, idx: idx, res: U.round(precio * idx, 2) };
    },
    ask: function (d) {
      return 'Un artículo cuesta $' + d.precio + '$ € y ' + (d.sube ? 'sube' : 'baja') +
        ' un $' + d.pct + '\\%$. ¿Cuál es el precio final?';
    },
    fields: [{ name: 'v', label: 'Precio (€)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-4,
    hint: function (d) {
      return 'Multiplica directamente por el índice de variación: $' + U.fmt(d.idx, 2) + '$.';
    },
    steps: function (d) {
      return ['Índice de variación: $1 ' + (d.sube ? '+' : '-') + ' ' + U.fmt(d.pct / 100, 2) + ' = ' + U.fmt(d.idx, 2) + '$.',
        'Precio final: $' + d.precio + ' \\cdot ' + U.fmt(d.idx, 2) + ' = ' + U.fmt(d.res, 2) + '$ €.',
        'Comprobación: el ' + d.pct + ' % de ' + d.precio + ' es ' + U.fmt(d.precio * d.pct / 100, 2) +
        ' €, que se ' + (d.sube ? 'suman' : 'restan') + '.'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' €'; }
  });

  p.exercise({
    title: 'Dos variaciones encadenadas',
    level: 'avanzado',
    gen: function (r) {
      var precio = r.int(10, 50) * 10;
      var a = r.pick([10, 15, 20, 25, 30]) * (r.bool() ? 1 : -1);
      var b = r.pick([10, 15, 20, 25, 30]) * (r.bool() ? 1 : -1);
      var i1 = 1 + a / 100, i2 = 1 + b / 100;
      return { precio: precio, a: a, b: b, i1: i1, i2: i2, res: U.round(precio * i1 * i2, 2), glob: U.round((i1 * i2 - 1) * 100, 4) };
    },
    ask: function (d) {
      return 'Un producto de $' + d.precio + '$ € ' + (d.a > 0 ? 'sube un $' + d.a : 'baja un $' + (-d.a)) +
        '\\%$ y después ' + (d.b > 0 ? 'sube un $' + d.b : 'baja un $' + (-d.b)) +
        '\\%$. ¿Cuál es el precio final?';
    },
    fields: [{ name: 'v', label: 'Precio (€)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-4,
    hint: function (d) { return 'Los índices se multiplican: $' + U.fmt(d.i1, 2) + ' \\cdot ' + U.fmt(d.i2, 2) + '$. No sumes los porcentajes.'; },
    steps: function (d) {
      return ['Primer índice: $' + U.fmt(d.i1, 2) + '$. Segundo índice: $' + U.fmt(d.i2, 2) + '$.',
        'Se aplican uno detrás de otro, así que se multiplican: $' + U.fmt(d.i1 * d.i2, 4) + '$.',
        'Precio final: $' + d.precio + ' \\cdot ' + U.fmt(d.i1 * d.i2, 4) + ' = ' + U.fmt(d.res, 2) + '$ €.',
        'La variación global no es $' + (d.a + d.b) + '\\%$ sino $' + U.fmt(d.glob, 2) + '\\%$.'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' € (variación global del ' + U.fmt(d.glob, 2) + ' %)'; }
  });

  p.exercise({
    title: 'Interés compuesto',
    level: 'avanzado',
    gen: function (r) {
      var c0 = r.int(1, 20) * 500;
      var rr = r.pick([1, 1.5, 2, 2.5, 3, 4, 5]);
      var t = r.int(2, 12);
      return { c0: c0, r: rr, t: t, res: U.round(c0 * Math.pow(1 + rr / 100, t), 2) };
    },
    ask: function (d) {
      return 'Ingresas $' + U.miles(d.c0) + '$ € al $' + U.fmt(d.r, 1) + '\\%$ anual de interés compuesto. ' +
        '¿Cuánto tendrás al cabo de $' + d.t + '$ años? (redondea a los céntimos)';
    },
    fields: [{ name: 'v', label: 'Capital (€)', w: 'wide' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-5,
    hint: function (d) { return 'Cada año se multiplica por $' + U.fmt(1 + d.r / 100, 4) + '$, y eso $' + d.t + '$ veces.'; },
    steps: function (d) {
      return ['Índice anual: $1 + ' + U.fmt(d.r / 100, 4) + ' = ' + U.fmt(1 + d.r / 100, 4) + '$.',
        'Al aplicarlo $' + d.t + '$ años seguidos se eleva a $' + d.t + '$:',
        '$C = ' + d.c0 + ' \\cdot ' + U.fmt(1 + d.r / 100, 4) + '^{' + d.t + '} = ' + U.fmt(d.res, 2) + '$ €.',
        'Con interés simple habrían sido solo $' + U.fmt(d.c0 * (1 + d.r / 100 * d.t), 2) + '$ €.'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' €'; }
  });

  p.keys([
    'Directa: el cociente $y/x$ es constante. Inversa: el producto $x\\cdot y$ es constante.',
    'Antes de calcular, decide si es directa o inversa. Ese es el paso que se falla.',
    'Un porcentaje es solo una fracción de denominador 100: $p\\%$ de $N$ es $\\frac{p}{100}\\cdot N$.',
    'Índice de variación: subir $p\\%$ → $\\times(1+p/100)$; bajar $p\\%$ → $\\times(1-p/100)$.',
    'Variaciones encadenadas: los índices <strong>se multiplican</strong>. Por eso $+20\\%$ y $-20\\%$ deja un $-4\\%$.',
    'Interés compuesto: $C_0(1+r)^t$ — crecimiento exponencial, no lineal.'
  ]);
});
