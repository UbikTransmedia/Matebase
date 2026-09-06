/* Tema: Distribución binomial */
Course.topic('pe-binomial', function (p) {

  p.text('Una <strong>variable aleatoria</strong> asigna un número a cada resultado de un experimento: ' +
    'el número de caras al lanzar 10 monedas, el número de piezas defectuosas en un lote, los aciertos ' +
    'en un test. Si los valores posibles se pueden contar, la variable es <strong>discreta</strong>.');

  p.text('La distribución de una variable discreta se describe con su <em>función de probabilidad</em>: ' +
    'qué probabilidad tiene cada valor. Y hay un caso que aparece constantemente.');

  p.section('El experimento binomial');

  p.text('Se cumplen cuatro condiciones:');

  p.list([
    'Se repite $n$ veces el <strong>mismo</strong> experimento.',
    'Cada repetición tiene solo <strong>dos</strong> resultados: éxito o fracaso.',
    'La probabilidad de éxito $p$ es <strong>constante</strong>.',
    'Las repeticiones son <strong>independientes</strong>.'
  ], true);

  p.formula('X \\sim B(n, p)', 'la variable sigue una distribución binomial');

  p.formula('P(X = k) = \\binom{n}{k}\\,p^k\\,(1-p)^{n-k}', 'función de probabilidad');

  p.text('La fórmula se entiende sola si la lees por partes: $p^k$ es la probabilidad de $k$ éxitos, ' +
    '$(1-p)^{n-k}$ la de los fracasos restantes, y $\\binom{n}{k}$ cuenta <strong>de cuántas maneras ' +
    'distintas</strong> pueden repartirse esos $k$ éxitos entre las $n$ repeticiones.');

  p.formulas([
    '\\mu = n\\,p',
    '\\sigma = \\sqrt{n\\,p\\,(1-p)}'
  ], 'media y desviación típica');

  p.demo({
    title: 'La forma de la binomial',
    intro: 'Cambia el número de repeticiones y la probabilidad de éxito. Fíjate en cómo se desplaza el pico y en que con n grande la forma se parece cada vez más a una campana.',
    build: function (host, d) {
      var n = 10, prob = 0.5;
      var host2 = U.el('div');
      host.appendChild(host2);
      var out = W.readout(host, '');
      function pinta() {
        U.clear(host2);
        var labels = [], vals = [];
        for (var k = 0; k <= n; k++) {
          labels.push(String(k));
          vals.push(ML.comb(n, k) * Math.pow(prob, k) * Math.pow(1 - prob, n - k));
        }
        W.barChart(host2, {
          labels: labels, values: vals, height: 260, color: 0, dec: 3,
          xlabel: 'número de éxitos', ylabel: 'probabilidad',
          showValues: n <= 15,
          extra: function (g) {
            var mu = n * prob;
            g.vline(mu, { color: 2, w: 2, dash: true });
          }
        });
        var mu = n * prob, sd = Math.sqrt(n * prob * (1 - prob));
        var mejor = vals.indexOf(Math.max.apply(null, vals));
        out.set('$X \\sim B(' + n + ',\\ ' + U.fmt(prob, 2) + ')$<br>' +
          'Media $\\mu = np = ' + U.fmt(mu, 3) + '$ &nbsp;·&nbsp; ' +
          'desviación típica $\\sigma = \\sqrt{np(1-p)} = ' + U.fmt(sd, 4) + '$<br>' +
          'El valor más probable es $k = ' + mejor + '$, con $P = ' + U.fmt(vals[mejor], 5) + '$.' +
          (n >= 25 ? '<br><span style="font-size:12.5px;color:var(--ink-faint)">Con $n$ grande la ' +
            'silueta ya es prácticamente una campana: eso es lo que permitirá aproximarla por una normal.</span>' : ''));
      }
      var row = W.row(host);
      W.slider(row, { label: 'repeticiones n', min: 1, max: 40, step: 1, value: 10, dec: 0, on: function (v) { n = v; pinta(); } });
      W.slider(row, { label: 'probabilidad de éxito p', min: 0.05, max: 0.95, step: 0.05, value: 0.5, dec: 2, on: function (v) { prob = v; pinta(); } });
      pinta();
    }
  });

  p.hist('La distribución binomial la estudió Jacob Bernoulli en su <em>Ars Conjectandi</em>, publicado ' +
    'en 1713, ocho años después de su muerte. En ese libro aparece también la primera demostración de ' +
    'la ley de los grandes números. Bernoulli tardó veinte años en escribirlo y no llegó a terminarlo: ' +
    'le preocupaba no saber cómo aplicar la probabilidad a los asuntos «civiles y morales», que es ' +
    'exactamente el problema que la estadística sigue intentando resolver.');

  /* ---------------------------------------------------------------- */
  p.section('Probabilidades acumuladas');

  p.text('En los problemas casi nunca se pide $P(X=k)$ a secas, sino cosas como «al menos 3» o «como ' +
    'mucho 2». Hay que sumar varios términos, y conviene tener claras las equivalencias:');

  p.table(['El enunciado dice', 'Significa', 'Se calcula'],
    [['como mucho $k$', '$X \\le k$', '$P(0)+P(1)+\\dots+P(k)$'],
     ['menos de $k$', '$X < k$, o sea $X \\le k-1$', '$P(0)+\\dots+P(k-1)$'],
     ['al menos $k$', '$X \\ge k$', '$1 - P(X \\le k-1)$'],
     ['más de $k$', '$X > k$', '$1 - P(X \\le k)$']]);

  p.note('«Al menos $k$» y «más de $k$» conviene calcularlos siempre <strong>por el contrario</strong>: ' +
    'suele haber muchos menos términos que sumar.', 'ok');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Probabilidad de un valor concreto',
    level: 'medio',
    gen: function (r) {
      var n = r.int(4, 12);
      var prob = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]);
      var k = r.int(0, n);
      return { n: n, p: prob, k: k, val: ML.comb(n, k) * Math.pow(prob, k) * Math.pow(1 - prob, n - k) };
    },
    ask: function (d) {
      return 'Sea $X \\sim B(' + d.n + ',\\ ' + U.fmt(d.p, 2) + ')$. Calcula $P(X = ' + d.k + ')$ ' +
        '(cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'P(X = ' + d.k + ')', w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return '$P(X=k) = \\binom{' + d.n + '}{' + d.k + '} \\cdot ' + U.fmt(d.p, 2) + '^{' + d.k + '} \\cdot ' + U.fmt(1 - d.p, 2) + '^{' + (d.n - d.k) + '}$'; },
    steps: function (d) {
      return ['$\\dbinom{' + d.n + '}{' + d.k + '} = ' + ML.comb(d.n, d.k) + '$ — las formas de repartir los éxitos.',
        '$' + U.fmt(d.p, 2) + '^{' + d.k + '} = ' + U.fmt(Math.pow(d.p, d.k), 6) + '$ — los éxitos.',
        '$' + U.fmt(1 - d.p, 2) + '^{' + (d.n - d.k) + '} = ' + U.fmt(Math.pow(1 - d.p, d.n - d.k), 6) + '$ — los fracasos.',
        'Multiplicando los tres: $' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Media y desviación típica',
    level: 'basico',
    gen: function (r) {
      var n = r.int(5, 200);
      var prob = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]);
      return { n: n, p: prob, mu: n * prob, sd: Math.sqrt(n * prob * (1 - prob)) };
    },
    ask: function (d) {
      return 'Para $X \\sim B(' + d.n + ',\\ ' + U.fmt(d.p, 2) + ')$, calcula la media y la ' +
        'desviación típica (cuatro decimales).';
    },
    fields: [{ name: 'm', label: 'Media', w: 'wide' }, { name: 's', label: 'Desv. típica', w: 'wide' }],
    sol: function (d) { return { m: U.round(d.mu, 6), s: U.round(d.sd, 6) }; },
    tol: 3e-4,
    hint: function () { return '$\\mu = np$ y $\\sigma = \\sqrt{np(1-p)}$.'; },
    steps: function (d) {
      return ['$\\mu = np = ' + d.n + ' \\cdot ' + U.fmt(d.p, 2) + ' = ' + U.fmt(d.mu, 4) + '$',
        '$\\sigma = \\sqrt{np(1-p)} = \\sqrt{' + d.n + ' \\cdot ' + U.fmt(d.p, 2) + ' \\cdot ' + U.fmt(1 - d.p, 2) + '}$',
        '$= \\sqrt{' + U.fmt(d.n * d.p * (1 - d.p), 4) + '} = ' + U.fmt(d.sd, 4) + '$'];
    },
    answer: function (d) { return 'μ = ' + U.fmt(d.mu, 4) + ', σ = ' + U.fmt(d.sd, 4); }
  });

  p.exercise({
    title: 'Probabilidad acumulada',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(5, 10);
      var prob = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
      var k = r.int(1, n - 1);
      var tipo = r.bool();     // true: al menos k   false: como mucho k
      var acum = 0;
      for (var i = 0; i <= k; i++) acum += ML.comb(n, i) * Math.pow(prob, i) * Math.pow(1 - prob, n - i);
      var alMenos = 0;
      for (var j = k; j <= n; j++) alMenos += ML.comb(n, j) * Math.pow(prob, j) * Math.pow(1 - prob, n - j);
      return { n: n, p: prob, k: k, tipo: tipo, val: tipo ? alMenos : acum };
    },
    ask: function (d) {
      return 'Sea $X \\sim B(' + d.n + ',\\ ' + U.fmt(d.p, 2) + ')$. Calcula ' +
        (d.tipo ? '$P(X \\ge ' + d.k + ')$' : '$P(X \\le ' + d.k + ')$') + ' (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) {
      return d.tipo ? 'Es más corto calcularlo por el contrario: $1 - P(X \\le ' + (d.k - 1) + ')$.'
        : 'Suma $P(X=0) + P(X=1) + \\dots + P(X=' + d.k + ')$.';
    },
    steps: function (d) {
      var terms = [];
      var lo = d.tipo ? 0 : 0, hi = d.tipo ? d.k - 1 : d.k;
      for (var i = lo; i <= hi; i++) {
        terms.push('$P(X=' + i + ') = ' + U.fmt(ML.comb(d.n, i) * Math.pow(d.p, i) * Math.pow(1 - d.p, d.n - i), 5) + '$');
      }
      var s = [];
      if (d.tipo) {
        s.push('Calcularlo directamente exigiría sumar desde $' + d.k + '$ hasta $' + d.n + '$. Es más corto ir por el contrario.');
        s.push('$P(X \\ge ' + d.k + ') = 1 - P(X \\le ' + (d.k - 1) + ')$');
      }
      s = s.concat(terms);
      s.push(d.tipo ? 'Sumando y restando de 1: $' + U.fmt(d.val, 4) + '$'
        : 'Sumando todos: $' + U.fmt(d.val, 4) + '$');
      return s;
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Problema con enunciado',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(5, 12);
      var prob = r.pick([0.2, 0.25, 0.3, 0.5]);
      var k = r.int(1, Math.min(4, n - 1));
      var val = ML.comb(n, k) * Math.pow(prob, k) * Math.pow(1 - prob, n - k);
      return { n: n, p: prob, k: k, val: val };
    },
    ask: function (d) {
      return 'Un test tiene $' + d.n + '$ preguntas y cada una tiene varias opciones, de forma que ' +
        'contestando al azar se acierta con probabilidad $' + U.fmt(d.p, 2) + '$. ¿Cuál es la ' +
        'probabilidad de acertar exactamente $' + d.k + '$ preguntas? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Comprueba las cuatro condiciones: $' + d.n + '$ repeticiones, dos resultados, $p$ ' +
        'constante e independencia. Es binomial $B(' + d.n + ', ' + U.fmt(d.p, 2) + ')$.';
    },
    steps: function (d) {
      return ['Cada pregunta es un experimento con dos resultados (acierto o fallo), $p$ constante e independiente: es binomial.',
        '$X \\sim B(' + d.n + ',\\ ' + U.fmt(d.p, 2) + ')$',
        '$P(X = ' + d.k + ') = \\dbinom{' + d.n + '}{' + d.k + '}' + U.fmt(d.p, 2) + '^{' + d.k + '}' +
        U.fmt(1 - d.p, 2) + '^{' + (d.n - d.k) + '}$',
        '$= ' + ML.comb(d.n, d.k) + ' \\cdot ' + U.fmt(Math.pow(d.p, d.k), 5) + ' \\cdot ' +
        U.fmt(Math.pow(1 - d.p, d.n - d.k), 5) + ' = ' + U.fmt(d.val, 4) + '$',
        'De media se acertarían $np = ' + U.fmt(d.n * d.p, 2) + '$ preguntas.'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.keys([
    'Binomial: $n$ repeticiones independientes, dos resultados, $p$ constante.',
    '$P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}$: el combinatorio cuenta las formas de repartir los éxitos.',
    '$\\mu = np$ y $\\sigma = \\sqrt{np(1-p)}$.',
    '«Al menos $k$» se calcula casi siempre por el contrario.',
    'Con $n$ grande la binomial adopta forma de campana, y eso permitirá aproximarla por una normal.'
  ]);
});
