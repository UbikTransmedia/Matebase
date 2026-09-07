/* Tema: Muestreo e inferencia */
Course.topic('pe-inferencia', function (p) {

  p.text('Aquí la estadística da su salto más ambicioso. Hasta ahora describíamos datos que teníamos ' +
    'delante. La <strong>inferencia</strong> pretende algo mucho más difícil: <em>decir cómo es toda ' +
    'la población habiendo mirado solo una parte</em>, y además <strong>medir cuánto podemos ' +
    'equivocarnos</strong>.');

  p.text('Es lo que hacen las encuestas electorales, los controles de calidad y los ensayos clínicos. ' +
    'Nadie pregunta a 47 millones de personas: se pregunta a 1000 y se cuantifica el margen de error.');

  p.section('Muestreo');
  p.text('Toda la inferencia se apoya en una apuesta: mirar una parte para hablar del todo. Preguntar a ' +
    'mil personas para describir a millones parece temerario, y sin embargo funciona, siempre que la ' +
    'parte elegida no esté sesgada. La palabra clave es <strong>representativa</strong>, y la ' +
    'historia guarda un aviso célebre: en 1936 una revista estadounidense predijo con dos millones ' +
    'de respuestas que Landon ganaría a Roosevelt. Se equivocó estrepitosamente porque preguntó por ' +
    'teléfono en plena Depresión, es decir, solo a quien podía permitirse uno.');


  p.list([
    'La <strong>muestra</strong> debe ser <strong>representativa</strong>: obtenida al azar, sin que ' +
    'ningún grupo tenga más facilidad de entrar que otro.',
    'Muestreo <strong>aleatorio simple</strong>: todos los individuos con la misma probabilidad.',
    'Muestreo <strong>estratificado</strong>: se divide la población en grupos homogéneos (edad, ' +
    'provincia) y se toma una muestra proporcional de cada uno.',
    'Muestreo <strong>sistemático</strong>: se elige uno de cada $k$ de una lista ordenada.'
  ]);

  p.note('Una muestra grande pero <em>sesgada</em> es peor que una pequeña bien tomada. El caso ' +
    'clásico: en 1936, la revista <em>Literary Digest</em> encuestó a 2,4 millones de personas y ' +
    'predijo que Landon ganaría a Roosevelt. Falló estrepitosamente porque sacó los nombres de ' +
    'listas de teléfono y de propietarios de coche, es decir, de gente rica. Gallup acertó preguntando ' +
    'a 50 000 bien elegidas.', 'warn', 'El tamaño no lo es todo');

  /* ---------------------------------------------------------------- */
  p.section('La distribución de la media muestral');

  p.text('Si de una población tomamos muchas muestras distintas, cada una dará una media distinta. ' +
    'Esas medias también se reparten, y lo hacen de forma <strong>normal</strong>, sea como sea la ' +
    'población de partida (teorema central del límite).');

  p.formula('\\overline{X} \\sim N\\left(\\mu,\\ \\frac{\\sigma}{\\sqrt{n}}\\right)',
    'distribución de la media muestral');

  p.note('El $\\sqrt{n}$ del denominador es la clave de toda la estadística aplicada. Dice que para ' +
    '<strong>reducir el error a la mitad hay que cuadruplicar la muestra</strong>. Por eso las ' +
    'encuestas se quedan en 1000-2000 personas: pasar de 1000 a 4000 solo mejora el margen de error ' +
    'a la mitad, y cuesta cuatro veces más.', 'ok', 'Por qué las encuestas son de 1000 personas');

  p.demo({
    title: 'Muchas muestras, muchas medias',
    intro: 'La población de fondo no tiene forma de campana. Aun así, las medias de sus muestras sí la tienen: eso es el teorema central del límite.',
    build: function (host, d) {
      var n = 5, muestras = 500;
      var host2 = U.el('div');
      host.appendChild(host2);
      var out = W.readout(host, '');
      // poblacion asimetrica: valores 1..6 con pesos muy desiguales
      var pesos = [40, 25, 15, 10, 6, 4];
      var totalPeso = U.sum(pesos);
      function sacar(r) {
        var x = r.real(0, totalPeso), acum = 0;
        for (var i = 0; i < pesos.length; i++) {
          acum += pesos[i];
          if (x <= acum) return i + 1;
        }
        return 6;
      }
      function pinta() {
        U.clear(host2);
        var r = U.rng(777);
        var medias = [];
        for (var m = 0; m < muestras; m++) {
          var s = 0;
          for (var i = 0; i < n; i++) s += sacar(r);
          medias.push(s / n);
        }
        // histograma de las medias
        var bins = 12, lo = 1, hi = 6;
        var cuenta = new Array(bins).fill(0);
        medias.forEach(function (v) {
          var b = Math.min(bins - 1, Math.floor((v - lo) / (hi - lo) * bins));
          cuenta[b]++;
        });
        var labels = cuenta.map(function (_, i) { return U.fmt(lo + (hi - lo) * (i + 0.5) / bins, 1); });
        W.barChart(host2, {
          labels: labels, values: cuenta, height: 250, color: 0, showValues: false,
          xlabel: 'media de la muestra', ylabel: 'nº de muestras'
        });
        var muPob = 0;
        pesos.forEach(function (w, i) { muPob += (i + 1) * w / totalPeso; });
        out.set('Población de partida: muy <strong>asimétrica</strong> (media real $' + U.fmt(muPob, 4) + '$).<br>' +
          'Tomando <strong>' + muestras + '</strong> muestras de tamaño <strong>' + n + '</strong>: ' +
          'media de las medias $' + U.fmt(ML.mean(medias), 4) + '$, dispersión $' + U.fmt(ML.sd(medias), 4) + '$.<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Sube el tamaño de muestra: el ' +
          'histograma se estrecha y se vuelve simétrico, aunque la población no lo sea.</span>');
      }
      var row = W.row(host);
      W.slider(row, { label: 'tamaño de cada muestra (n)', min: 1, max: 60, step: 1, value: 5, dec: 0, on: function (v) { n = v; pinta(); } });
      W.slider(row, { label: 'número de muestras', min: 100, max: 2000, step: 100, value: 500, dec: 0, on: function (v) { muestras = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Intervalos de confianza');

  p.text('En vez de dar una estimación puntual («la media es 172,3»), que casi seguro es falsa, se da ' +
    'un <strong>intervalo</strong> y un <strong>nivel de confianza</strong>.');

  p.formula('IC = \\left(\\overline{x} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}},\\ \\ \\overline{x} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\right)',
    'intervalo de confianza para la media');

  p.table(['Nivel de confianza', '$\\alpha$', '$z_{\\alpha/2}$'],
    [['90 %', '0,10', '1,645'],
     ['95 %', '0,05', '1,96'],
     ['99 %', '0,01', '2,575']]);

  p.note('«95 % de confianza» <strong>no</strong> significa «hay un 95 % de probabilidad de que la media ' +
    'esté aquí». La media poblacional es un número fijo: está o no está. Lo que significa es que, si ' +
    'repitiéramos el proceso muchas veces, el <em>95 % de los intervalos construidos así</em> ' +
    'contendría la media real. Es una propiedad del método, no de este intervalo concreto.',
    'warn', 'Qué significa exactamente el 95 %');

  p.formula('E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\quad\\Longrightarrow\\quad n \\ge \\left(\\frac{z_{\\alpha/2}\\,\\sigma}{E}\\right)^2',
    'error máximo y tamaño de muestra necesario');

  p.demo({
    title: 'Confianza, tamaño y amplitud',
    intro: 'Los tres factores que determinan la anchura del intervalo. Fíjate en cuánta muestra hay que añadir para estrecharlo un poco.',
    build: function (host, d) {
      var media = 170, sd = 10, n = 100, conf = 95;
      var zs = { 90: 1.645, 95: 1.96, 99: 2.575 };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 164, xmax: 176, ymin: -1, ymax: 1, height: 150,
        yticks: false, ylabel: null, xlabel: 'media (cm)',
        draw: function (g) {
          var e = zs[conf] * sd / Math.sqrt(n);
          g.seg(media - e, 0, media + e, 0, { color: 0, w: 9, alpha: .45 });
          g.point(media - e, 0, { color: 0, r: 6 });
          g.point(media + e, 0, { color: 0, r: 6 });
          g.point(media, 0, { color: 2, r: 7 });
          g.text(media, 0.45, 'media muestral', { align: 'center', size: 12, color: 2 });
        }
      });
      function paint() {
        var e = zs[conf] * sd / Math.sqrt(n);
        out.set('Muestra de $n = ' + n + '$, media $' + media + '$ cm, $\\sigma = ' + sd + '$ cm.<br>' +
          'Error máximo: $E = ' + zs[conf] + ' \\cdot \\dfrac{' + sd + '}{\\sqrt{' + n + '}} = ' + U.fmt(e, 4) + '$ cm<br>' +
          '<strong>IC al ' + conf + '%: $(' + U.fmt(media - e, 3) + ',\\ ' + U.fmt(media + e, 3) + ')$</strong><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Para reducir el error a la mitad ' +
          'harían falta $' + (n * 4) + '$ individuos, cuatro veces más.</span>');
        plot.render();
      }
      W.chips(host, [{ label: '90 %', value: 90 }, { label: '95 %', value: 95 }, { label: '99 %', value: 99 }],
        { value: 95, on: function (v) { conf = v; paint(); } });
      var row = W.row(host);
      W.slider(row, { label: 'tamaño de muestra n', min: 10, max: 1000, step: 10, value: 100, dec: 0, on: function (v) { n = v; paint(); } });
      W.slider(row, { label: 'σ de la población', min: 2, max: 25, step: 1, value: 10, dec: 0, on: function (v) { sd = v; paint(); } });
      paint();
    }
  });

  p.util('Esa coletilla de las encuestas —«margen de error de ±3 puntos»— es exactamente esto. Y explica ' +
    'algo que sorprende: para estimar bien no hace falta preguntar a mucha gente en proporción, sino ' +
    'en número absoluto. Con unas 1000 personas se estima igual de bien un país de un millón que uno ' +
    'de cincuenta millones, porque el margen depende de la raíz del tamaño de la muestra, no de la ' +
    'población. Lo que sí importa, y mucho, es que la muestra sea representativa.');

  p.section('Contraste de hipótesis');

  p.text('El otro gran instrumento de la inferencia. Se plantea una <strong>hipótesis nula</strong> ' +
    '$H_0$ (lo que se supone cierto por defecto) y se mira si los datos son tan raros bajo esa ' +
    'hipótesis como para rechazarla.');

  p.list([
    'Si el dato observado cae en la <strong>zona de rechazo</strong>, se rechaza $H_0$.',
    'Si no cae, <strong>no se rechaza</strong> — que no es lo mismo que «se demuestra que es cierta».',
    'Error de <strong>tipo I</strong>: rechazar $H_0$ siendo cierta (probabilidad $\\alpha$).',
    'Error de <strong>tipo II</strong>: no rechazarla siendo falsa (probabilidad $\\beta$).'
  ]);

  p.note('Un contraste nunca «demuestra» la hipótesis nula, igual que un juicio no demuestra la ' +
    'inocencia: solo dice que no hay pruebas suficientes para condenar. Es exactamente la misma ' +
    'lógica, y con los mismos dos tipos de error posibles.', null, 'Inocente hasta que se demuestre lo contrario');

  /* ================= EJERCICIOS ================= */
  p.util('El contraste de hipótesis es el procedimiento con el que se aprueba un medicamento, se valida ' +
    'un método industrial o se publica un resultado científico. También tiene una patología ' +
    'conocida: si se prueban veinte hipótesis al azar con un nivel del 5 %, es de esperar que una ' +
    'salga «significativa» por pura suerte. De ahí vienen buena parte de los estudios que luego ' +
    'nadie consigue reproducir, y por eso los ensayos serios se registran antes de empezar.');

  p.section('Practica');

  p.exercise({
    title: 'Error típico de la media',
    level: 'basico',
    gen: function (r) {
      var sd = r.int(2, 30);
      var n = r.pick([4, 9, 16, 25, 36, 49, 64, 100, 400]);
      return { sd: sd, n: n, err: sd / Math.sqrt(n) };
    },
    ask: function (d) {
      return 'Una población tiene $\\sigma = ' + d.sd + '$. ¿Cuál es la desviación típica de la media ' +
        'muestral para muestras de tamaño $n = ' + d.n + '$? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'σ / √n', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.err, 6) }; },
    tol: 3e-4,
    hint: function () { return 'La media muestral tiene desviación típica $\\frac{\\sigma}{\\sqrt{n}}$.'; },
    steps: function (d) {
      return ['$\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{' + d.sd + '}{\\sqrt{' + d.n + '}} = \\dfrac{' +
        d.sd + '}{' + Math.sqrt(d.n) + '} = ' + U.fmt(d.err, 4) + '$',
        'Fíjate: la media muestral es mucho menos variable que un individuo suelto. Ese es el efecto de promediar.'];
    },
    answer: function (d) { return U.fmt(d.err, 4); }
  });

  p.exercise({
    title: 'Intervalo de confianza',
    level: 'medio',
    gen: function (r) {
      var media = r.int(50, 200);
      var sd = r.int(5, 25);
      var n = r.pick([25, 36, 49, 64, 100, 144, 225, 400]);
      var conf = r.pick([90, 95, 99]);
      var z = { 90: 1.645, 95: 1.96, 99: 2.575 }[conf];
      var e = z * sd / Math.sqrt(n);
      return { media: media, sd: sd, n: n, conf: conf, z: z, e: e, lo: media - e, hi: media + e };
    },
    ask: function (d) {
      return 'De una población con $\\sigma = ' + d.sd + '$ se toma una muestra de $n = ' + d.n +
        '$ individuos y se obtiene una media de $' + d.media + '$. Construye el intervalo de ' +
        'confianza al $' + d.conf + '\\%$ (cuatro decimales).<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Usa $z = ' + d.z + '$.</span>';
    },
    fields: [{ name: 'a', label: 'Extremo inferior', w: 'wide' }, { name: 'b', label: 'Extremo superior', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.lo, 6), b: U.round(d.hi, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Calcula primero el error: $E = ' + d.z + ' \\cdot \\frac{' + d.sd + '}{\\sqrt{' + d.n + '}}$.'; },
    steps: function (d) {
      return ['Error máximo: $E = z\\dfrac{\\sigma}{\\sqrt{n}} = ' + d.z + ' \\cdot \\dfrac{' + d.sd +
        '}{' + Math.sqrt(d.n) + '} = ' + U.fmt(d.e, 5) + '$',
        'El intervalo es la media más y menos ese error:',
        '$(' + d.media + ' - ' + U.fmt(d.e, 5) + ',\\ ' + d.media + ' + ' + U.fmt(d.e, 5) + ')$',
        '$= (' + U.fmt(d.lo, 4) + ',\\ ' + U.fmt(d.hi, 4) + ')$'];
    },
    answer: function (d) { return '(' + U.fmt(d.lo, 4) + ', ' + U.fmt(d.hi, 4) + ')'; }
  });

  p.exercise({
    title: 'Tamaño de muestra necesario',
    level: 'avanzado',
    gen: function (r) {
      var sd = r.int(4, 30);
      var E = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      var conf = r.pick([90, 95, 99]);
      var z = { 90: 1.645, 95: 1.96, 99: 2.575 }[conf];
      var n = Math.ceil(Math.pow(z * sd / E, 2));
      if (n > 200000) return null;
      return { sd: sd, E: E, conf: conf, z: z, n: n };
    },
    ask: function (d) {
      return 'Queremos estimar la media de una población con $\\sigma = ' + d.sd + '$ cometiendo un ' +
        'error máximo de $' + U.fmt(d.E, 1) + '$ con un $' + d.conf + '\\%$ de confianza. ' +
        '¿Cuál es el tamaño mínimo de muestra?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Usa $z = ' + d.z + '$ y redondea hacia arriba.</span>';
    },
    fields: [{ name: 'n', label: 'n mínimo', w: 'wide' }],
    sol: function (d) { return { n: d.n }; },
    hint: function () { return 'Despeja $n$ de $E = z\\frac{\\sigma}{\\sqrt{n}}$: sale $n \\ge \\left(\\frac{z\\sigma}{E}\\right)^2$.'; },
    steps: function (d) {
      return ['Partimos de $E = z\\dfrac{\\sigma}{\\sqrt{n}}$ y despejamos $n$.',
        '$n \\ge \\left(\\dfrac{z\\,\\sigma}{E}\\right)^2 = \\left(\\dfrac{' + d.z + ' \\cdot ' + d.sd +
        '}{' + U.fmt(d.E, 1) + '}\\right)^2$',
        '$= ' + U.fmt(Math.pow(d.z * d.sd / d.E, 2), 4) + '$',
        'Como el tamaño de muestra tiene que ser entero y cumplir la desigualdad, se redondea ' +
        '<strong>hacia arriba</strong>: $n = ' + d.n + '$.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'Interpretar el intervalo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Un IC al 95 % para la media es $(168; 174)$. ¿Es correcto decir «hay un 95 % de probabilidad de que la media esté entre 168 y 174»?', ok: 2 },
        { t: 'Al pasar de un 95 % a un 99 % de confianza, manteniendo la muestra, el intervalo…', ok: 3 },
        { t: 'Al cuadruplicar el tamaño de la muestra, el error máximo…', ok: 4 },
        { t: 'Un IC al 95 % para la media es $(168; 174)$ y alguien afirma que la media vale 180. ¿Qué se puede decir?', ok: 1 }
      ];
      var c = r.pick(casos);
      return { t: c.t, ok: c.ok };
    },
    ask: function (d) {
      return d.t + '<br><span style="font-size:14px;color:var(--ink-faint)">' +
        '<code>1</code> ese valor queda fuera del intervalo, así que los datos no lo respaldan · ' +
        '<code>2</code> no, la media es un valor fijo: el 95 % se refiere al método, no a este intervalo · ' +
        '<code>3</code> se hace más ancho · ' +
        '<code>4</code> se reduce a la mitad</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny' }],
    sol: function (d) { return { r: d.ok }; },
    hint: function () { return 'Recuerda: más confianza exige más margen, y el error va con $\\sqrt{n}$.'; },
    steps: function (d) {
      return ['El nivel de confianza es una propiedad del <em>procedimiento</em>: el 95 % de los ' +
        'intervalos construidos así contendrían la media real.',
        'Más confianza ⟹ intervalo más ancho (hace falta más margen para acertar más veces).',
        'Y como $E = z\\frac{\\sigma}{\\sqrt{n}}$, multiplicar $n$ por 4 divide el error entre 2.',
        'La respuesta correcta aquí es la <strong>' + d.ok + '</strong>.'];
    },
    answer: function (d) { return 'Opción ' + d.ok; }
  });

  p.keys([
    'La inferencia estima la población a partir de una muestra, midiendo el error.',
    'Una muestra sesgada no se arregla haciéndola grande.',
    '$\\overline{X} \\sim N(\\mu, \\frac{\\sigma}{\\sqrt{n}})$ aunque la población no sea normal.',
    'El $\\sqrt{n}$ manda: para reducir el error a la mitad hay que <strong>cuadruplicar</strong> la muestra.',
    'Más confianza ⟹ intervalo más ancho. No se puede tener todo.',
    'El 95 % es una propiedad del método, no de un intervalo concreto.',
    'Un contraste nunca demuestra $H_0$: solo dice si hay pruebas suficientes para rechazarla.'
  ]);
});
