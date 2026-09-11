/* Tema: Distribución normal */
Course.topic('pe-normal', function (p) {

  p.puente('El tema anterior dejó la herramienta: en una variable continua la probabilidad es el área ' +
    'bajo la densidad, y $F$ acumula por la izquierda. Aquí se aplica a la densidad más importante de ' +
    'todas, la campana. Como no tiene primitiva elemental, las áreas se leen en una tabla; y para que ' +
    'baste una sola tabla se usa un truco de aritmética elemental: restar la media y dividir por la ' +
    'desviación típica.');

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
    predice: 'Si duplicas $\\sigma$ de 1 a 2, ¿la campana se hará el doble de alta o la mitad? Piensa en que el área total tiene que seguir valiendo 1.',
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
  p.note('Todo lo que sigue son <strong>áreas bajo una curva</strong>, es decir, integrales. La ' +
    'campana es una función de densidad: la probabilidad de caer entre dos valores es el área que ' +
    'encierra entre ellos, y el área total vale 1. Si esa idea no te resulta familiar, el tema ' +
    'anterior, [[pe-continuas|<strong>Variables aleatorias continuas</strong>]], la construye desde el histograma. ' +
    'Y si te preguntas por qué hace falta una tabla en vez de una fórmula: porque esta curva no ' +
    'tiene primitiva elemental, así que no hay manera de escribir su integral con funciones ' +
    'conocidas.',
    null, 'De dónde sale la campana');

  p.section('Tipificar: la normal estándar');

  p.text('Hay infinitas normales, una por cada par $(\\mu, \\sigma)$. Sería imposible tabularlas todas. ' +
    'La solución es <strong>tipificar</strong>: convertir cualquier normal en la estándar $N(0,1)$.');

  p.formula('Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)');

  p.text('El valor $z$ dice <strong>a cuántas desviaciones típicas del centro</strong> está un dato. ' +
    'Un $z=2$ significa «dos sigmas por encima de la media», y eso significa lo mismo en cualquier ' +
    'contexto: en alturas, en notas o en presión arterial.');

  p.comprueba('Ana saca un 7 en un examen con media 5 y $\\sigma = 2$. Bruno saca un 8 en otro con media 7 y $\\sigma = 0{,}5$. ¿Quién ha hecho un examen relativamente mejor?', [
    { t: 'Bruno: su nota está a 2 desviaciones típicas por encima de la media', ok: true, por: '$z_{\\text{Bruno}} = \\frac{8 - 7}{0{,}5} = 2$ frente a $z_{\\text{Ana}} = \\frac{7 - 5}{2} = 1$. En su grupo, un 8 es excepcional; en el de Ana, un 7 es bueno sin más.' },
    { t: 'Ana: supera la media en 2 puntos y Bruno solo en 1', ok: false, por: 'Los puntos brutos no comparan exámenes distintos. En unidades de $\\sigma$, Ana está a 1 y Bruno a 2: para eso se tipifica.' },
    { t: 'Los dos igual: ambos superan la media', ok: false, por: 'Superar la media es lo de menos; la pregunta es por cuánto en relación con la dispersión. Ahí Bruno gana con claridad.' }
  ]);

  p.demo({
    title: 'Área bajo la campana',
    intro: 'Mueve los límites y lee la probabilidad como el área sombreada. Esto es exactamente lo que hace la tabla de la N(0,1).',
    predice: 'Con límites $-1$ y $1$ el área es 0,683. Si pones $-2$ y $2$, ¿cuánto crees que saldrá? ¿Y de 0 a 4?',
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

  p.sub('Al revés: de la probabilidad al valor');

  p.text('Muchas preguntas van en sentido contrario: se conoce la probabilidad y se pide el valor. <em>«¿Qué ' +
    'nota hay que sacar para estar en el 10 % mejor?»</em> Se busca la probabilidad <strong>dentro</strong> ' +
    'de la tabla, se lee el $z$ que le corresponde en el margen y se deshace la tipificación.');

  p.formula('P(X \\le k) = p \\ \\Rightarrow\\ \\Phi\\!\\left(\\frac{k - \\mu}{\\sigma}\\right) = p \\ \\Rightarrow\\ k = \\mu + z_p\\,\\sigma',
    'el valor que deja por debajo una probabilidad',
    '$z_p$ es el valor de la $N(0,1)$ que deja por debajo una probabilidad $p$.<br><br>Si $p < 0{,}5$, el ' +
      '$z$ es negativo y se usa la simetría: por ejemplo, $z_{0{,}1} = -z_{0{,}9} \\approx -1{,}28$.<br><br>' +
      'Y si lo que se desconoce es $\\mu$ o $\\sigma$, la misma igualdad $\\frac{k - \\mu}{\\sigma} = z_p$ ' +
      'sirve para despejarlos; con dos datos se plantea un sistema de dos ecuaciones.');

  p.table(['$p$', '0,75', '0,80', '0,90', '0,95', '0,975', '0,99'],
    [['$z_p$', '0,67', '0,84', '1,28', '1,645', '1,96', '2,33']]);

  p.ejemplo({
    title: 'Una normal de la vida real, en tres preguntas',
    enunciado: 'La estatura de una población sigue una $N(170,\\ 8)$ cm. (a) ¿Qué proporción mide más de 180 cm? (b) ¿Y entre 160 y 180? (c) ¿Qué estatura deja por debajo al 90 % de la población?',
    pasos: [
      { t: '<strong>(a) Tipificar.</strong> $z = \\dfrac{180 - 170}{8} = 1{,}25$. Entonces $P(X > 180) = P(Z > 1{,}25) = 1 - \\Phi(1{,}25) = 1 - 0{,}8944 = 0{,}1056$: un 10,6 %.', antes: 'Tipifica primero. ¿A cuántas sigmas por encima de la media está 180?' },
      { t: '<strong>(b) Dos límites.</strong> $z_1 = \\dfrac{160 - 170}{8} = -1{,}25$ y $z_2 = 1{,}25$. $P = \\Phi(1{,}25) - \\Phi(-1{,}25) = 0{,}8944 - (1 - 0{,}8944) = 0{,}7888$: un 78,9 %.', antes: '$\\Phi(-1{,}25)$ no viene en la tabla. ¿Cómo lo sacas?' },
      { t: '<strong>(c) Al revés.</strong> Se busca $0{,}90$ <em>dentro</em> de la tabla: le corresponde $z = 1{,}28$. Se deshace la tipificación: $k = 170 + 1{,}28\\cdot 8 = 180{,}2$ cm.', antes: 'Ahora te dan la probabilidad y piden el valor. ¿Qué se busca en la tabla y dónde?' },
      { t: '<strong>Comprobar el sentido.</strong> (a) dice que un 10,6 % supera 180; (c) dice que 180,2 deja al 10 % por encima. Coinciden casi exactamente ✓.' }
    ],
    cierre: 'Tres preguntas, un solo movimiento: pasar de $X$ a $Z$, o de $Z$ a $X$, con $z = (x - \\mu)/\\sigma$. La tabla hace el resto, y la simetría cubre los $z$ negativos.'
  });

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

  p.trampas([
    { e: 'Buscar $\\Phi(-1{,}3)$ en la tabla y no encontrarlo', por: 'La tabla solo trae $z$ positivos. Por simetría, $\\Phi(-1{,}3) = 1 - \\Phi(1{,}3) = 1 - 0{,}9032 = 0{,}0968$.' },
    { e: 'Dar $\\Phi(z)$ cuando piden $P(X > k)$', por: 'La tabla acumula por la <em>izquierda</em>. Lo que queda a la derecha es $1 - \\Phi(z)$.' },
    { e: 'Comparar resultados de grupos distintos por los puntos brutos', por: 'Un 7 con $\\sigma = 2$ y un 8 con $\\sigma = 0{,}5$ no se comparan hasta tipificar: $z = 1$ frente a $z = 2$.' },
    { e: 'Aproximar la binomial sin corrección de continuidad', por: 'El 12 discreto ocupa una barra de 11,5 a 12,5. $P(X \\le 12)$ se traduce en $P(X \\le 12{,}5)$ en la normal.' }
  ]);

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
      var val = tipo ? ML.normalCdf(z) : 1 - ML.normalCdf(z);
      // por debajo del 1 % la tolerancia de la tabla es mayor que la respuesta
      if (val < 0.01) return null;
      return { mu: mu, sd: sd, x: x, z: z, tipo: tipo, val: val };
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

  var ZP = { 0.75: 0.67, 0.8: 0.84, 0.9: 1.28, 0.95: 1.645, 0.975: 1.96, 0.99: 2.33 };
  function zDe(pp) { return pp >= 0.5 ? ZP[pp] : -ZP[U.round(1 - pp, 3)]; }

  p.exercise({
    title: 'El valor que deja una probabilidad',
    level: 'avanzado',
    gen: function (r) {
      var mu = r.pick([60, 100, 170, 500]), sigma = r.pick([5, 8, 10, 15, 20]);
      var pp = r.pick([0.9, 0.95, 0.975, 0.99, 0.8, 0.75, 0.1, 0.05, 0.25]);
      var z = zDe(pp);
      return { mu: mu, sigma: sigma, p: pp, z: z, k: mu + z * sigma };
    },
    ask: function (d) {
      return 'Una variable sigue una $N(' + d.mu + ',\\ ' + d.sigma + ')$. Halla el valor $k$ tal que $P(X \\le k) = ' + U.fmt(d.p, 3) + '$ (usa la tabla; dos decimales).';
    },
    fields: [{ name: 'k', label: 'k =', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.k, 4) }; },
    check: function (v, d) {
      if (isNaN(v.k)) return { ok: false, msg: 'Escribe un número.' };
      return Math.abs(v.k - d.k) <= 0.02 * d.sigma + 0.01;
    },
    errores: [{ si: function (v, d) { return d.p < 0.5 && Math.abs(v.k - (d.mu - d.z * d.sigma)) <= 0.02 * d.sigma + 0.01; }, msg: 'Con una probabilidad menor que 0,5 el valor está <strong>por debajo</strong> de la media: el $z$ es negativo.' }],
    hint: function (d) { return ['Busca en la tabla el $z$ con $\\Phi(z) = ' + U.fmt(d.p >= 0.5 ? d.p : 1 - d.p, 3) + '$' + (d.p < 0.5 ? ' y cámbiale el signo, por simetría.' : '.'), 'Deshaz la tipificación: $k = \\mu + z\\sigma$.']; },
    steps: function (d) { return ['$z \\approx ' + U.fmt(d.z, 3) + '$', '$k = ' + d.mu + ' + (' + U.fmt(d.z, 3) + ')\\cdot' + d.sigma + ' \\approx ' + U.fmt(d.k, 2) + '$']; },
    answer: function (d) { return U.fmt(d.k, 2); }
  });

  p.exercise({
    title: 'Hallar la media conociendo una probabilidad',
    level: 'avanzado',
    gen: function (r) {
      var sigma = r.pick([4, 5, 10, 12]), k = r.pick([80, 120, 200, 250]), pp = r.pick([0.1, 0.05, 0.2, 0.25]);
      var z = ZP[U.round(1 - pp, 3)];
      return { sigma: sigma, k: k, p: pp, z: z, mu: k - z * sigma };
    },
    ask: function (d) {
      return 'Una variable normal tiene $\\sigma = ' + d.sigma + '$ y cumple $P(X > ' + d.k + ') = ' + U.fmt(d.p, 2) + '$. ¿Cuánto vale su media $\\mu$? (dos decimales)';
    },
    fields: [{ name: 'm', label: 'μ =', w: 'wide' }],
    sol: function (d) { return { m: U.round(d.mu, 4) }; },
    check: function (v, d) {
      if (isNaN(v.m)) return { ok: false, msg: 'Escribe un número.' };
      return Math.abs(v.m - d.mu) <= 0.02 * d.sigma + 0.01;
    },
    errores: [{ si: function (v, d) { return Math.abs(v.m - (d.k + d.z * d.sigma)) <= 0.02 * d.sigma + 0.01; }, msg: 'Revisa el signo: si solo una parte pequeña de los valores queda por encima de ese número, la media está <strong>por debajo</strong> de él.' }],
    hint: function (d) { return ['$P(X > ' + d.k + ') = ' + U.fmt(d.p, 2) + '$ es lo mismo que $P(X \\le ' + d.k + ') = ' + U.fmt(1 - d.p, 2) + '$.', 'Busca ese $z$ y despeja $\\mu$ en $\\frac{' + d.k + ' - \\mu}{' + d.sigma + '} = z$.']; },
    steps: function (d) { return ['$P(X \\le ' + d.k + ') = ' + U.fmt(1 - d.p, 2) + ' \\Rightarrow z = ' + d.z + '$', '$\\frac{' + d.k + ' - \\mu}{' + d.sigma + '} = ' + d.z + ' \\Rightarrow \\mu = ' + d.k + ' - ' + d.z + '\\cdot' + d.sigma + ' = ' + U.fmt(d.mu, 2) + '$']; },
    answer: function (d) { return U.fmt(d.mu, 2); }
  });

  p.keys([
    'Problemas inversos: se busca la probabilidad dentro de la tabla, se lee $z$ y se despeja $k = \\mu + z\\sigma$ (o $\\mu$, o $\\sigma$).',
    'La normal describe magnitudes continuas agrupadas alrededor de un centro.',
    'En una variable continua, la probabilidad es <strong>área</strong>, y la de un punto exacto es cero.',
    'Regla 68-95-99,7: dentro de $1\\sigma$, $2\\sigma$ y $3\\sigma$ de la media.',
    'Tipificar $z = \\frac{x-\\mu}{\\sigma}$ convierte cualquier normal en la $N(0,1)$ tabulada.',
    '$\\Phi(-z) = 1-\\Phi(z)$: por eso las tablas solo traen valores positivos.',
    'Con $np>5$ y $n(1-p)>5$, la binomial se aproxima por una normal (con corrección de continuidad).',
    'El teorema central del límite explica por qué la campana aparece por todas partes.'
  ]);
});
