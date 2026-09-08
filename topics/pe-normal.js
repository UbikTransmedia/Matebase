/* Tema: Distribución normal */
Course.topic('pe-normal', function (p) {

  p.text('Muchísimas magnitudes del mundo real —alturas, errores de medida, notas, presión arterial— ' +
    'se reparten con la misma forma: la mayoría de los valores agrupados alrededor de un centro y ' +
    'cada vez menos casos a medida que nos alejamos. Esa forma de campana es la ' +
    '<strong>distribución normal</strong>.');

  p.formula('X \\sim N(\\mu, \\sigma)', 'normal de media μ y desviación típica σ');

  p.text('Aquí la variable es <strong>continua</strong>: puede tomar cualquier valor de un intervalo, ' +
    'y por eso la probabilidad ya no se lee en barras sino en <strong>áreas bajo la curva</strong>.');

  p.note('Con una variable continua, $P(X = 1{,}7000\\dots) = 0$. No es que sea imposible medir 1,70: ' +
    'es que la probabilidad de un punto exacto entre infinitos posibles es cero. Solo tienen ' +
    'probabilidad los <em>intervalos</em>, y por eso $P(X \\le a)$ y $P(X < a)$ son lo mismo.',
    'warn', 'Un cambio importante respecto a la binomial');

  p.demo({
    title: 'La campana y sus dos parámetros',
    intro: 'μ mueve la campana; σ la ensancha o la estrecha. El área total bajo la curva es siempre 1.',
    build: function (host, d) {
      var mu = 0, sd = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -8, xmax: 8, ymin: -0.05, ymax: 0.9, height: 300,
        ystep: 0.2,
        draw: function (g) {
          var f = function (x) {
            return Math.exp(-Math.pow(x - mu, 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
          };
          g.area(f, mu - sd, mu + sd, { fill: 2, fillAlpha: .35 });
          g.area(f, mu - 2 * sd, mu - sd, { fill: 3, fillAlpha: .25 });
          g.area(f, mu + sd, mu + 2 * sd, { fill: 3, fillAlpha: .25 });
          g.fn(f, { color: 0, w: 2.8 });
          g.vline(mu, { color: 1, w: 1.6, dash: true });
          g.text(mu, 0.85, 'μ', { align: 'center', color: 1, size: 15, italic: true });
        }
      });
      function paint() {
        out.set('$X \\sim N(' + U.fmt(mu, 1) + ',\\ ' + U.fmt(sd, 1) + ')$<br>' +
          '<span style="color:var(--c3)">Entre $\\mu-\\sigma$ y $\\mu+\\sigma$ está el <strong>68,3 %</strong></span> ' +
          'de los datos &nbsp;·&nbsp; ' +
          '<span style="color:var(--c4)">hasta $2\\sigma$, el <strong>95,4 %</strong></span> &nbsp;·&nbsp; ' +
          'hasta $3\\sigma$, el <strong>99,7 %</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Esos porcentajes son los mismos ' +
          'siempre, valgan lo que valgan μ y σ. Por eso basta con una única tabla.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'media μ', min: -4, max: 4, step: 0.5, value: 0, dec: 1, on: function (v) { mu = v; paint(); } });
      W.slider(row, { label: 'desviación típica σ', min: 0.4, max: 3, step: 0.1, value: 1, dec: 1, on: function (v) { sd = v; paint(); } });
      paint();
    }
  });

  p.hist('La campana apareció primero como aproximación de la binomial (De Moivre, 1733) y después en ' +
    'el estudio de los errores de medida astronómica, de la mano de Gauss y Laplace: de ahí que se la ' +
    'llame también <em>gaussiana</em>. El teorema central del límite explica por qué sale tan a menudo: ' +
    'cuando una magnitud es la <strong>suma de muchos efectos pequeños e independientes</strong>, su ' +
    'distribución tiende a ser normal, sea cual sea la distribución de cada efecto. La altura depende ' +
    'de muchos genes y de la alimentación; el error de una medida, de muchas imprecisiones minúsculas. ' +
    'Por eso la campana está en todas partes.');

  /* ---------------------------------------------------------------- */
  p.section('Tipificar: la normal estándar');

  p.text('Hay infinitas normales, una por cada par $(\\mu, \\sigma)$. Sería imposible tabularlas todas. ' +
    'La solución es <strong>tipificar</strong>: convertir cualquier normal en la estándar $N(0,1)$.');

  p.formula('Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)');

  p.text('El valor $z$ dice <strong>a cuántas desviaciones típicas del centro</strong> está un dato. ' +
    'Un $z=2$ significa «dos sigmas por encima de la media», y eso significa lo mismo en cualquier ' +
    'contexto: en alturas, en notas o en presión arterial.');

  p.demo({
    title: 'Área bajo la campana',
    intro: 'Mueve los límites y lee la probabilidad como el área sombreada. Esto es exactamente lo que hace la tabla de la N(0,1).',
    build: function (host, d) {
      var a = -1, b = 1;
      var out = W.readout(host, '');
      var f = function (x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); };
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -0.03, ymax: 0.5, height: 290,
        ystep: 0.1,
        draw: function (g) {
          g.area(f, Math.min(a, b), Math.max(a, b), { fill: 2, fillAlpha: .4 });
          g.fn(f, { color: 0, w: 2.8 });
          g.vline(a, { color: 1, w: 1.6, dash: true });
          g.vline(b, { color: 1, w: 1.6, dash: true });
        }
      });
      function paint() {
        var lo = Math.min(a, b), hi = Math.max(a, b);
        var P = ML.normalCdf(hi) - ML.normalCdf(lo);
        out.set('$P(' + U.fmt(lo, 2) + ' \\le Z \\le ' + U.fmt(hi, 2) + ') = ' +
          '\\Phi(' + U.fmt(hi, 2) + ') - \\Phi(' + U.fmt(lo, 2) + ')$<br>' +
          '$= ' + U.fmt(ML.normalCdf(hi), 5) + ' - ' + U.fmt(ML.normalCdf(lo), 5) + ' = ' +
          '<strong>' + U.fmt(P, 5) + '</strong>$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">$\\Phi(z)$ es el área acumulada hasta $z$: ' +
          'lo que da directamente la tabla.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'límite inferior', min: -4, max: 4, step: 0.05, value: -1, dec: 2, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'límite superior', min: -4, max: 4, step: 0.05, value: 1, dec: 2, on: function (v) { b = v; paint(); } });
      paint();
    }
  });

  p.sub('Propiedades que ahorran trabajo');
  p.text('La campana es simétrica respecto a su centro, y de esa simetría salen dos atajos que evitan la ' +
    'mitad de las consultas a la tabla. Conviene tenerlos a mano desde el principio, porque cubren ' +
    'justo los casos que la tabla no trae impresos.');


  p.formulas([
    'P(Z \\le z) = \\Phi(z)',
    'P(Z > z) = 1 - \\Phi(z)',
    '\\Phi(-z) = 1 - \\Phi(z) \\quad \\text{(por simetría)}',
    'P(a \\le Z \\le b) = \\Phi(b) - \\Phi(a)'
  ]);

  p.text('La tercera es la que permite que las tablas solo tengan valores positivos: la campana es ' +
    'simétrica, así que el área a la izquierda de $-z$ es igual al área a la derecha de $z$.');

  /* ---------------------------------------------------------------- */
  p.util('Tipificar es poner en una escala común cosas medidas en unidades distintas, y eso lo hace ' +
    'posible comparar lo incomparable: si tu nota de Matemáticas está a 1,5 desviaciones por encima ' +
    'de la media y la de Lengua a 0,8, has ido mejor en Matemáticas aunque el número de Lengua fuera ' +
    'más alto. Con esa misma idea se construyen las tablas de percentiles del pediatra y las ' +
    'puntuaciones estandarizadas de las pruebas internacionales.');

  p.section('Aproximación de la binomial');

  p.text('Cuando $n$ es grande, calcular una binomial a mano es inviable. Pero ya has visto que su ' +
    'forma se parece a una campana, así que se puede aproximar:');

  p.formula('B(n,p) \\approx N\\left(np,\\ \\sqrt{np(1-p)}\\right) \\quad \\text{si } np > 5 \\text{ y } n(1-p) > 5');

  p.note('Al pasar de una variable discreta a una continua conviene aplicar la <strong>corrección de ' +
    'continuidad</strong>: $P(X = 12)$ se traduce en $P(11{,}5 \\le X \\le 12{,}5)$, porque el 12 ' +
    'discreto ocupa una barra de anchura 1.', null, 'Corrección de continuidad');

  /* ================= EJERCICIOS ================= */
  p.util('La campana de Gauss aparece en todas partes por una razón profunda: cuando muchos efectos ' +
    'pequeños e independientes se suman, el resultado tiende a ser normal, digan lo que digan las ' +
    'causas por separado. Por eso son normales las alturas de una población, los errores de una ' +
    'medida repetida y las variaciones de una pieza fabricada en serie. La «regla del 68-95-99,7» ' +
    '—el porcentaje que cae a una, dos y tres desviaciones— es lo que hace que un control de calidad ' +
    'hable de «seis sigmas».');

  p.section('Practica');

  p.exercise({
    title: 'Tipificar',
    level: 'basico',
    gen: function (r) {
      var mu = r.int(10, 200);
      var sd = r.int(2, 25);
      var x = mu + r.pm(1, 3) * sd + r.int(-2, 2);
      return { mu: mu, sd: sd, x: x, z: (x - mu) / sd };
    },
    ask: function (d) {
      return 'Si $X \\sim N(' + d.mu + ',\\ ' + d.sd + ')$, tipifica el valor $x = ' + d.x +
        '$ (cuatro decimales).';
    },
    fields: [{ name: 'z', label: 'z', w: 'wide' }],
    sol: function (d) { return { z: U.round(d.z, 6) }; },
    tol: 3e-4,
    hint: function () { return '$z = \\frac{x-\\mu}{\\sigma}$.'; },
    steps: function (d) {
      return ['$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{' + d.x + ' - ' + d.mu + '}{' + d.sd + '}$',
        '$= \\dfrac{' + (d.x - d.mu) + '}{' + d.sd + '} = ' + U.fmt(d.z, 4) + '$',
        'Interpretación: el valor está a $' + U.fmt(Math.abs(d.z), 3) + '$ desviaciones típicas ' +
        (d.z >= 0 ? 'por <strong>encima</strong>' : 'por <strong>debajo</strong>') + ' de la media.'];
    },
    answer: function (d) { return U.fmt(d.z, 4); }
  });

  p.exercise({
    title: 'Probabilidad en la normal estándar',
    level: 'medio',
    gen: function (r) {
      var z = r.int(-250, 250) / 100;
      var tipo = r.int(0, 2);
      var val = tipo === 0 ? ML.normalCdf(z)
        : (tipo === 1 ? 1 - ML.normalCdf(z) : ML.normalCdf(Math.abs(z)) - ML.normalCdf(-Math.abs(z)));
      return { z: z, tipo: tipo, val: val };
    },
    ask: function (d) {
      var e = [
        '$P(Z \\le ' + U.fmt(d.z, 2) + ')$',
        '$P(Z > ' + U.fmt(d.z, 2) + ')$',
        '$P(-' + U.fmt(Math.abs(d.z), 2) + ' \\le Z \\le ' + U.fmt(Math.abs(d.z), 2) + ')$'
      ][d.tipo];
      return 'Siendo $Z \\sim N(0,1)$, calcula ' + e + ' (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 2e-3,
    hint: function (d) {
      return ['Es directamente $\\Phi(z)$, el área acumulada.',
        'Es $1 - \\Phi(z)$: el área que queda a la derecha.',
        'Por simetría es $2\\Phi(z) - 1$.'][d.tipo];
    },
    steps: function (d) {
      if (d.tipo === 0) return ['$P(Z \\le ' + U.fmt(d.z, 2) + ') = \\Phi(' + U.fmt(d.z, 2) + ') = ' + U.fmt(d.val, 4) + '$',
        d.z < 0 ? 'Como $z$ es negativo, en la tabla se usa $\\Phi(-z) = 1 - \\Phi(z)$.' : ''].filter(function (x) { return x; });
      if (d.tipo === 1) return ['El área total bajo la campana vale 1.',
        '$P(Z > ' + U.fmt(d.z, 2) + ') = 1 - \\Phi(' + U.fmt(d.z, 2) + ') = 1 - ' +
        U.fmt(ML.normalCdf(d.z), 5) + ' = ' + U.fmt(d.val, 4) + '$'];
      return ['Por la simetría de la campana, $P(-z \\le Z \\le z) = 2\\Phi(z) - 1$.',
        '$= 2 \\cdot ' + U.fmt(ML.normalCdf(Math.abs(d.z)), 5) + ' - 1 = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Problema con una normal cualquiera',
    level: 'avanzado',
    gen: function (r) {
      var mu = r.int(150, 190);
      var sd = r.int(5, 12);
      var x = mu + r.pm(1, 20);
      var z = (x - mu) / sd;
      var tipo = r.bool();
      return { mu: mu, sd: sd, x: x, z: z, tipo: tipo, val: tipo ? ML.normalCdf(z) : 1 - ML.normalCdf(z) };
    },
    ask: function (d) {
      return 'La altura de una población sigue una $N(' + d.mu + ',\\ ' + d.sd + ')$ cm. ¿Qué ' +
        'proporción de personas mide ' + (d.tipo ? '<strong>menos</strong>' : '<strong>más</strong>') +
        ' de $' + d.x + '$ cm? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Proporción', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 2e-3,
    hint: function (d) { return 'Tipifica primero: $z = \\frac{' + d.x + ' - ' + d.mu + '}{' + d.sd + '} = ' + U.fmt(d.z, 4) + '$.'; },
    steps: function (d) {
      return ['Tipificamos: $z = \\dfrac{' + d.x + ' - ' + d.mu + '}{' + d.sd + '} = ' + U.fmt(d.z, 4) + '$.',
        'El problema se convierte en uno sobre la normal estándar.',
        (d.tipo ? '$P(X < ' + d.x + ') = P(Z < ' + U.fmt(d.z, 3) + ') = \\Phi(' + U.fmt(d.z, 3) + ')$'
          : '$P(X > ' + d.x + ') = P(Z > ' + U.fmt(d.z, 3) + ') = 1 - \\Phi(' + U.fmt(d.z, 3) + ')$'),
        '$= ' + U.fmt(d.val, 4) + '$, es decir el $' + U.fmt(d.val * 100, 2) + '\\%$ de la población.'];
    },
    answer: function (d) { return U.fmt(d.val, 4) + ' (' + U.fmt(d.val * 100, 2) + ' %)'; }
  });

  p.exercise({
    title: 'Aproximar una binomial',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(60, 400);
      var prob = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
      if (n * prob <= 5 || n * (1 - prob) <= 5) return null;
      var mu = n * prob, sd = Math.sqrt(n * prob * (1 - prob));
      var k = Math.round(mu + r.pm(1, 2) * sd);
      var z = (k + 0.5 - mu) / sd;
      return { n: n, p: prob, mu: mu, sd: sd, k: k, z: z, val: ML.normalCdf(z) };
    },
    ask: function (d) {
      return 'Sea $X \\sim B(' + d.n + ',\\ ' + U.fmt(d.p, 2) + ')$. Aproxima $P(X \\le ' + d.k +
        ')$ mediante una normal, con corrección de continuidad (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 2e-3,
    hint: function (d) {
      return 'La normal es $N(' + U.fmt(d.mu, 3) + ', ' + U.fmt(d.sd, 4) + ')$. Con la corrección, ' +
        '$P(X \\le ' + d.k + ')$ pasa a ser $P(X \\le ' + U.fmt(d.k + 0.5, 1) + ')$.';
    },
    steps: function (d) {
      return ['Comprobamos que se puede aproximar: $np = ' + U.fmt(d.mu, 2) + ' > 5$ y $n(1-p) = ' +
        U.fmt(d.n * (1 - d.p), 2) + ' > 5$ ✓',
        'La normal correspondiente es $N(' + U.fmt(d.mu, 3) + ',\\ ' + U.fmt(d.sd, 4) + ')$.',
        'Corrección de continuidad: $P(X \\le ' + d.k + ')$ se convierte en $P(X \\le ' + U.fmt(d.k + 0.5, 1) + ')$.',
        'Tipificamos: $z = \\dfrac{' + U.fmt(d.k + 0.5, 1) + ' - ' + U.fmt(d.mu, 3) + '}{' + U.fmt(d.sd, 4) + '} = ' + U.fmt(d.z, 4) + '$.',
        '$P \\approx \\Phi(' + U.fmt(d.z, 4) + ') = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.keys([
    'La normal describe magnitudes continuas agrupadas alrededor de un centro.',
    'En una variable continua, la probabilidad es <strong>área</strong>, y la de un punto exacto es cero.',
    'Regla 68-95-99,7: dentro de $1\\sigma$, $2\\sigma$ y $3\\sigma$ de la media.',
    'Tipificar $z = \\frac{x-\\mu}{\\sigma}$ convierte cualquier normal en la $N(0,1)$ tabulada.',
    '$\\Phi(-z) = 1-\\Phi(z)$: por eso las tablas solo traen valores positivos.',
    'Con $np>5$ y $n(1-p)>5$, la binomial se aproxima por una normal (con corrección de continuidad).',
    'El teorema central del límite explica por qué la campana aparece por todas partes.'
  ]);
});
