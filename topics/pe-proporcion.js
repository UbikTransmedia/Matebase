/* Tema: Estimar una proporción */
Course.topic('pe-proporcion', function (p) {

  var Z = { 90: 1.645, 95: 1.96, 99: 2.575 };
  function pct(x) { return U.fmt(100 * x, 2) + '\\,\\%'; }

  p.text('En el tema de [[pe-inferencia|muestreo]] se estimaba una media: la estatura media, el gasto ' +
    'medio. Pero la mayoría de las cifras que se leen en un periódico no son medias sino ' +
    '<strong>porcentajes</strong>: el 34 % votaría a tal partido, el 12 % de las piezas sale defectuosa, ' +
    'el 61 % de los pacientes mejora. Y siempre con la coletilla: <em>«margen de error de ±3 puntos»</em>. ' +
    'Este tema explica de dónde sale esa coletilla.');

  /* ---------------------------------------------------------------- */
  p.section('La proporción muestral');

  p.text('Se quiere conocer la proporción $p$ de individuos de una población que tienen una ' +
    'característica. Se toma una muestra de tamaño $n$, se cuenta cuántos la tienen, $X$, y se calcula ' +
    'la <strong>proporción muestral</strong> $\\hat{p} = \\frac{X}{n}$. Cada muestra dará un $\\hat{p}$ ' +
    'distinto, y la pregunta es cómo se reparten esos valores.');

  p.formula('\\hat{p} \\sim N\\left(p,\\ \\sqrt{\\frac{p\\,(1 - p)}{n}}\\right) \\qquad \\text{si } np \\ge 5 \\text{ y } n(1-p) \\ge 5',
    'distribución de la proporción muestral',
    '$\\hat{p}$ se lee «pe gorro»: el sombrero indica que es una estimación sacada de la muestra.<br><br>' +
      'Se dice: <em>«pe gorro sigue una normal de media pe y desviación típica la raíz de pe por uno menos ' +
      'pe entre ene»</em>.<br><br>De dónde sale: el número de éxitos $X$ es una ' +
      '[[pe-binomial|binomial]] $B(n, p)$, con media $np$ y desviación $\\sqrt{np(1-p)}$. Dividir por $n$ ' +
      'divide las dos, y para $n$ grande la binomial se [[pe-normal|aproxima por una normal]].');

  p.demo({
    title: 'Mil encuestas a la vez',
    intro: 'Una población en la que el 40 % opina «sí». Se hacen muchas encuestas de n personas y se dibuja cuántas dan cada porcentaje. Sube n: la campana se estrecha alrededor del 40 % verdadero.',
    build: function (host) {
      var pv = 0.4, n = 100;
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        U.clear(caja);
        var r = U.rng(2024), bins = 30, cuenta = new Array(bins).fill(0), M = 1000;
        for (var m = 0; m < M; m++) {
          var x = 0;
          for (var i = 0; i < n; i++) if (r.next() < pv) x++;
          var ph = x / n;
          cuenta[Math.min(bins - 1, Math.floor(ph * bins))]++;
        }
        var sd = Math.sqrt(pv * (1 - pv) / n);
        W.plot(caja, {
          xmin: 0, xmax: 1, ymin: 0, ymax: Math.max.apply(null, cuenta) * 1.15 + 1, height: 240,
          xlabel: 'proporción en la muestra', ylabel: null,
          aria: 'Histograma de las proporciones obtenidas en mil muestras',
          draw: function (g) {
            g.bars(cuenta.map(function (c, i) { return { x: (i + 0.5) / bins, h: c }; }), { width: 1 / bins * 0.9, color: 0 });
            var esc = M / bins;
            g.fn(function (t) { return esc * Math.exp(-0.5 * Math.pow((t - pv) / sd, 2)) / (sd * Math.sqrt(2 * Math.PI)); }, { color: 1, w: 2.4 });
            g.vline(pv, { color: 3, dash: true, w: 1.6 });
          }
        });
        out.set('$p = ' + U.fmt(pv, 2) + '$, $n = ' + n + '$ &nbsp;·&nbsp; desviación típica de $\\hat{p}$: $\\sqrt{\\frac{' + U.fmt(pv, 2) + '\\cdot' + U.fmt(1 - pv, 2) + '}{' + n + '}} \\approx ' + U.fmt(sd, 4) + '$, es decir, unos $' + U.fmt(100 * sd, 1) + '$ puntos.');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'proporción real p', min: 0.05, max: 0.95, step: 0.05, value: pv, on: function (v) { pv = v; pinta(); } });
      W.slider(fila, { label: 'tamaño de cada encuesta n', min: 20, max: 1000, step: 20, value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El intervalo de confianza para una proporción');

  p.text('Igual que con la media: en lugar de dar un solo número, se da un intervalo centrado en ' +
    '$\\hat{p}$ con un margen a cada lado. Como $p$ no se conoce —es justo lo que se busca—, en la raíz ' +
    'se usa $\\hat{p}$ en su lugar.');

  p.formula('IC = \\left(\\hat{p} - z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}},\\ \\ \\hat{p} + z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}\\right)',
    'intervalo de confianza para la proporción',
    'Se lee: <em>«pe gorro menos zeta sub alfa medios por la raíz de pe gorro por uno menos pe gorro ' +
      'entre ene, y lo mismo con más»</em>.<br><br>El $z_{\\alpha/2}$ es el de siempre: 1,645 para el 90 %, ' +
      '1,96 para el 95 % y 2,575 para el 99 %.<br><br>El margen $E = z_{\\alpha/2}\\sqrt{\\hat{p}(1-\\hat{p})/n}$ ' +
      'es el «±» de las encuestas.');

  p.demo({
    title: 'El margen de error de una encuesta',
    intro: 'Una encuesta con n entrevistas en la que el p̂ dice «sí». Mueve el tamaño y la confianza y mira cómo se estira o se encoge el intervalo. Fíjate en cuánto cuesta ganar un solo punto de precisión.',
    build: function (host) {
      var ph = 0.34, n = 1000, conf = 95;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 1, ymin: -1, ymax: 1, height: 120, yaxis: false, ylabel: null, xlabel: 'proporción',
        aria: 'Intervalo de confianza para una proporción dibujado sobre el segmento de 0 a 1',
        draw: function (g) {
          var e = Z[conf] * Math.sqrt(ph * (1 - ph) / n);
          g.seg(Math.max(0, ph - e), 0, Math.min(1, ph + e), 0, { color: 0, w: 9, alpha: 0.45 });
          g.point(ph, 0, { color: 1, r: 6 });
          g.vline(0.5, { color: 'axis', dash: [3, 4], w: 1 });
        }
      });
      function pinta() {
        var e = Z[conf] * Math.sqrt(ph * (1 - ph) / n);
        out.set('$\\hat{p} = ' + U.fmt(ph, 2) + '$, $n = ' + n + '$, confianza $' + conf + '\\,\\%$<br>' +
          'Margen: $E = ' + Z[conf] + '\\sqrt{\\frac{' + U.fmt(ph, 2) + '\\cdot' + U.fmt(1 - ph, 2) + '}{' + n + '}} \\approx ' + U.fmt(e, 4) + '$, es decir, <strong>±' + U.fmt(100 * e, 1) + ' puntos</strong><br>' +
          'Intervalo: $(' + pct(ph - e) + ',\\ ' + pct(ph + e) + ')$');
        plot.render();
      }
      W.chips(host, [{ label: '90 %', value: 90 }, { label: '95 %', value: 95 }, { label: '99 %', value: 99 }], { value: conf, on: function (v) { conf = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'proporción muestral p̂', min: 0.02, max: 0.98, step: 0.01, value: ph, on: function (v) { ph = v; pinta(); } });
      W.slider(fila, { label: 'entrevistas n', min: 100, max: 5000, step: 50, value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('¿Cuántas entrevistas hacen falta?');

  p.formula('n \\ge \\frac{z_{\\alpha/2}^2\\ \\hat{p}\\,(1 - \\hat{p})}{E^2}',
    'tamaño de muestra para un margen E',
    'Sale de despejar $n$ en $E = z_{\\alpha/2}\\sqrt{\\hat{p}(1-\\hat{p})/n}$. Como $n$ tiene que ser un ' +
      'número entero y cumplir la desigualdad, se redondea <strong>hacia arriba</strong>.<br><br>' +
      'Y si antes de hacer la encuesta no se sabe nada de $p$, se toma $\\hat{p} = 0{,}5$: es el valor ' +
      'que hace más grande el producto $\\hat{p}(1-\\hat{p})$, así que da el tamaño que sirve en el peor ' +
      'caso.');

  p.note('Por qué 0,5 es el peor caso: $\\hat{p}(1 - \\hat{p}) = \\hat{p} - \\hat{p}^2$ es una ' +
    '[[fn-cuadraticas|parábola]] hacia abajo con vértice en $\\hat{p} = 0{,}5$, donde vale $0{,}25$. Con ' +
    'ese valor, para un margen de ±3 puntos al 95 % hacen falta $\\frac{1{,}96^2\\cdot 0{,}25}{0{,}03^2} ' +
    '\\approx 1067$ entrevistas. Por eso tantas encuestas son «de unas mil personas».', 'ok',
    'El número mágico de las encuestas');

  p.hist('Pierre-Simon Laplace hizo en 1786 lo que hoy se llamaría una encuesta por muestreo, sin ' +
    'encuestar a nadie. Quería saber cuántos habitantes tenía Francia sin hacer un censo, que costaba ' +
    'una fortuna. Contó los habitantes de unas cuantas parroquias repartidas por el país y los ' +
    'nacimientos que registraban, calculó la proporción, y la aplicó a los nacimientos de todo el reino, ' +
    'que sí estaban anotados. Estimó unos 28 millones y, lo que es más notable, calculó también la ' +
    'probabilidad de equivocarse en más de medio millón: fue la primera vez que alguien acompañó una ' +
    'estimación de su margen de error.');

  p.util('Además de las encuestas electorales, esta es la cuenta con la que se decide casi todo lo que ' +
    'se mide en porcentajes. Una fábrica revisa 500 piezas para estimar la proporción de defectuosas de ' +
    'un lote de cien mil. Una empresa de internet enseña dos versiones de una página a dos grupos de ' +
    'usuarios y compara qué proporción compra en cada una. Y un ensayo clínico estima qué proporción de ' +
    'pacientes responde a un tratamiento, con su intervalo. En todos los casos, lo que se publica sin el ' +
    'margen de error no es un dato, es una anécdota.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Desviación típica de la proporción muestral',
    level: 'basico',
    gen: function (r) {
      var pv = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]), n = r.pick([50, 100, 200, 400, 625, 1000]);
      return { p: pv, n: n, sd: Math.sqrt(pv * (1 - pv) / n) };
    },
    ask: function (d) { return 'En una población la proporción es $p = ' + U.fmt(d.p, 2) + '$. ¿Cuál es la desviación típica de $\\hat{p}$ en muestras de tamaño $' + d.n + '$? (cuatro decimales)'; },
    fields: [{ name: 'v', label: 'desviación', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.sd, 6) }; },
    tol: 3e-4,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.p * (1 - d.p) / d.n) < 1e-5; }, msg: 'Falta la <strong>raíz cuadrada</strong>: eso es la varianza.' }],
    hint: function () { return '$\\sigma_{\\hat{p}} = \\sqrt{\\frac{p(1-p)}{n}}$.'; },
    steps: function (d) { return ['$\\sqrt{\\dfrac{' + U.fmt(d.p, 2) + '\\cdot' + U.fmt(1 - d.p, 2) + '}{' + d.n + '}} = \\sqrt{' + U.fmt(d.p * (1 - d.p) / d.n, 6) + '} \\approx ' + U.fmt(d.sd, 4) + '$']; },
    answer: function (d) { return U.fmt(d.sd, 4); }
  });

  p.exercise({
    title: 'Intervalo de confianza para una proporción',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([200, 250, 400, 500, 800, 1000]), X = r.int(Math.round(0.1 * n), Math.round(0.8 * n));
      var conf = r.pick([90, 95, 99]), z = Z[conf], ph = X / n, e = z * Math.sqrt(ph * (1 - ph) / n);
      return { n: n, X: X, conf: conf, z: z, ph: ph, e: e, lo: ph - e, hi: ph + e };
    },
    ask: function (d) {
      return 'En una muestra de $' + d.n + '$ personas, $' + d.X + '$ declaran usar el transporte público. Construye el intervalo de confianza al $' + d.conf + '\\,\\%$ para la proporción de usuarios (cuatro decimales, en tanto por uno).';
    },
    fields: [{ name: 'a', label: 'extremo inferior', w: 'wide' }, { name: 'b', label: 'extremo superior', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.lo, 6), b: U.round(d.hi, 6) }; },
    tol: 3e-4,
    errores: [{
      si: function (v, d) { var e2 = d.z * d.ph * (1 - d.ph) / d.n; return Math.abs(v.a - (d.ph - e2)) < 1e-4 && Math.abs(v.b - (d.ph + e2)) < 1e-4; },
      msg: 'Te has dejado la raíz cuadrada en el margen de error.'
    }, {
      si: function (v, d) { return Math.abs(v.a - 100 * d.lo) < 0.05; },
      msg: 'Se pide en tanto por uno (entre 0 y 1), no en porcentaje.'
    }],
    hint: function (d) { return ['Primero $\\hat{p} = \\frac{' + d.X + '}{' + d.n + '}$.', 'Margen: $E = ' + d.z + '\\sqrt{\\hat{p}(1-\\hat{p})/' + d.n + '}$. El intervalo es $\\hat{p} \\pm E$.']; },
    steps: function (d) {
      return ['$\\hat{p} = \\frac{' + d.X + '}{' + d.n + '} = ' + U.fmt(d.ph, 4) + '$',
        '$E = ' + d.z + '\\sqrt{\\dfrac{' + U.fmt(d.ph, 4) + '\\cdot' + U.fmt(1 - d.ph, 4) + '}{' + d.n + '}} \\approx ' + U.fmt(d.e, 4) + '$',
        '$IC = (' + U.fmt(d.lo, 4) + ',\\ ' + U.fmt(d.hi, 4) + ')$: entre el ' + U.fmt(100 * d.lo, 1) + ' % y el ' + U.fmt(100 * d.hi, 1) + ' %.'];
    },
    answer: function (d) { return '(' + U.fmt(d.lo, 4) + ', ' + U.fmt(d.hi, 4) + ')'; }
  });

  p.exercise({
    title: 'Tamaño de muestra',
    level: 'medio',
    gen: function (r) {
      var conf = r.pick([90, 95, 99]), z = Z[conf], E = r.pick([0.02, 0.03, 0.04, 0.05]);
      var sabe = r.bool(0.5), ph = sabe ? r.pick([0.1, 0.2, 0.3, 0.4]) : 0.5;
      var exacto = z * z * ph * (1 - ph) / (E * E), n = Math.ceil(exacto - 1e-9);
      if (Math.abs(exacto - Math.round(exacto)) < 1e-6) return null;
      return { conf: conf, z: z, E: E, sabe: sabe, ph: ph, exacto: exacto, n: n };
    },
    ask: function (d) {
      return 'Se quiere estimar una proporción con un margen de error máximo de $' + U.fmt(d.E, 2) + '$ y una confianza del $' + d.conf + '\\,\\%$. ' +
        (d.sabe ? 'Un estudio previo dio $\\hat{p} = ' + U.fmt(d.ph, 2) + '$.' : 'No se tiene ninguna información previa sobre la proporción.') + ' ¿Cuál es el tamaño mínimo de la muestra?';
    },
    fields: [{ name: 'n', label: 'n mínimo', w: 'wide' }],
    sol: function (d) { return { n: d.n }; },
    errores: [{ si: function (v, d) { return v.n === Math.floor(d.exacto); }, msg: 'Con ese tamaño el margen se pasa un poco del pedido: <strong>se redondea hacia arriba</strong>.' },
      { si: function (v, d) { return !d.sabe && v.n !== d.n && Math.abs(v.n - Math.ceil(d.z * d.z / (d.E * d.E))) < 1; }, msg: 'Falta el factor $\\hat{p}(1-\\hat{p})$, que sin información previa vale $0{,}5\\cdot 0{,}5 = 0{,}25$.' }],
    hint: function (d) { return ['$n \\ge \\frac{z^2\\,\\hat{p}(1-\\hat{p})}{E^2}$ con $z = ' + d.z + '$.', d.sabe ? 'Usa el $\\hat{p}$ del estudio previo.' : 'Sin información, se toma $\\hat{p} = 0{,}5$, el peor caso.']; },
    steps: function (d) {
      return ['$n \\ge \\dfrac{' + d.z + '^2\\cdot' + U.fmt(d.ph, 2) + '\\cdot' + U.fmt(1 - d.ph, 2) + '}{' + U.fmt(d.E, 2) + '^2} \\approx ' + U.fmt(d.exacto, 3) + '$', 'Redondeando hacia arriba: $n = ' + d.n + '$.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.problem({
    title: 'Una encuesta de principio a fin',
    level: 'avanzado',
    gen: function (r) {
      var n = r.pick([400, 500, 600, 800, 1000, 1200]), conf = r.pick([90, 95, 99]), z = Z[conf];
      var X = r.int(Math.round(0.4 * n), Math.round(0.62 * n));
      var ph = X / n, e = z * Math.sqrt(ph * (1 - ph) / n);
      var dec = ph - e > 0.5 ? 'mas' : (ph + e < 0.5 ? 'menos' : 'nada');
      return { n: n, conf: conf, z: z, X: X, ph: ph, e: e, lo: ph - e, hi: ph + e, dec: dec };
    },
    intro: function (d) {
      return 'En una encuesta a $' + d.n + '$ vecinos de una ciudad, $' + d.X + '$ se declaran a favor de peatonalizar el centro. Se trabaja con un nivel de confianza del $' + d.conf + '\\,\\%$.';
    },
    partes: [
      {
        ask: function () { return 'Calcula la proporción muestral $\\hat{p}$ (cuatro decimales).'; },
        fields: [{ name: 'v', label: 'p̂', w: 'wide' }],
        sol: function (d) { return { v: U.round(d.ph, 6) }; },
        tol: 3e-4,
        hint: function () { return 'Casos favorables entre total de la muestra.'; },
        steps: function (d) { return ['$\\hat{p} = \\frac{' + d.X + '}{' + d.n + '} = ' + U.fmt(d.ph, 4) + '$']; },
        answer: function (d) { return U.fmt(d.ph, 4); }
      },
      {
        ask: function () { return 'Calcula el error máximo de la estimación (cuatro decimales).'; },
        fields: [{ name: 'v', label: 'E', w: 'wide' }],
        sol: function (d) { return { v: U.round(d.e, 6) }; },
        tol: 3e-4,
        hint: function (d) { return '$E = ' + d.z + '\\sqrt{\\hat{p}(1-\\hat{p})/n}$.'; },
        steps: function (d) { return ['$E = ' + d.z + '\\sqrt{\\dfrac{' + U.fmt(d.ph, 4) + '\\cdot' + U.fmt(1 - d.ph, 4) + '}{' + d.n + '}} \\approx ' + U.fmt(d.e, 4) + '$']; },
        answer: function (d) { return U.fmt(d.e, 4); }
      },
      {
        ask: function () { return 'Construye el intervalo de confianza (cuatro decimales).'; },
        fields: [{ name: 'a', label: 'inferior', w: 'wide' }, { name: 'b', label: 'superior', w: 'wide' }],
        sol: function (d) { return { a: U.round(d.lo, 6), b: U.round(d.hi, 6) }; },
        tol: 3e-4,
        hint: function () { return '$\\hat{p} \\pm E$.'; },
        steps: function (d) { return ['$(' + U.fmt(d.ph, 4) + ' - ' + U.fmt(d.e, 4) + ',\\ ' + U.fmt(d.ph, 4) + ' + ' + U.fmt(d.e, 4) + ') = (' + U.fmt(d.lo, 4) + ',\\ ' + U.fmt(d.hi, 4) + ')$']; },
        answer: function (d) { return '(' + U.fmt(d.lo, 4) + ', ' + U.fmt(d.hi, 4) + ')'; }
      },
      {
        ask: function (d) { return 'Con este nivel de confianza, ¿se puede afirmar que la mayoría de los vecinos está a favor?'; },
        fields: [{
          name: 't', label: 'Conclusión', opts: [
            { t: 'Sí: todo el intervalo está por encima de 0,5', v: 'mas' },
            { t: 'No: el intervalo contiene el 0,5, así que no se puede afirmar ni lo uno ni lo otro', v: 'nada' },
            { t: 'Al contrario: todo el intervalo está por debajo de 0,5', v: 'menos' }]
        }],
        sol: function (d) { return { t: d.dec }; },
        errores: [{ si: function (v, d) { return d.dec === 'nada' && v.raw.t === 'mas'; }, msg: 'Que $\\hat{p}$ pase de 0,5 no basta: con el margen de error, la proporción real podría estar por debajo.' }],
        hint: function () { return 'Mira dónde queda 0,5 respecto del intervalo.'; },
        steps: function (d) {
          return [{ mas: 'El extremo inferior, $' + U.fmt(d.lo, 4) + '$, ya supera 0,5: con esta confianza, la mayoría está a favor.', nada: 'El 0,5 cae dentro del intervalo: los datos son compatibles con que haya mayoría a favor y con que no la haya.', menos: 'El extremo superior, $' + U.fmt(d.hi, 4) + '$, no llega a 0,5: con esta confianza, la mayoría <em>no</em> está a favor.' }[d.dec]];
        },
        answer: function (d) { return { mas: 'Sí', nada: 'No se puede afirmar', menos: 'La mayoría está en contra' }[d.dec]; }
      }
    ]
  });

  p.exercise({
    title: 'Cómo cambia el margen',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'Si se multiplica por 4 el número de entrevistas, manteniendo la confianza, el margen de error…', ok: 'mitad' },
        { t: 'Si se pasa de una confianza del 95 % a una del 99 %, con la misma muestra, el intervalo…', ok: 'ancho' },
        { t: 'Si en vez de 1000 entrevistas se hacen 250, el margen de error…', ok: 'doble' },
        { t: 'Con la misma muestra, el margen de error es mayor cuando $\\hat{p}$ vale…', ok: 'medio' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return d.t; },
    fields: [{
      name: 't', label: 'Respuesta', opts: [
        { t: 'se reduce a la mitad', v: 'mitad' }, { t: 'se duplica', v: 'doble' },
        { t: 'se hace más ancho', v: 'ancho' }, { t: '0,5', v: 'medio' }]
    }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return 'El margen es $z\\sqrt{\\hat{p}(1-\\hat{p})/n}$: mira qué pasa con cada pieza.'; },
    steps: function (d) {
      return [{ mitad: 'Multiplicar $n$ por 4 divide la raíz entre $\\sqrt{4} = 2$.', ancho: 'Más confianza exige un $z$ mayor (2,575 en vez de 1,96): más margen.', doble: 'Dividir $n$ entre 4 multiplica la raíz por 2.', medio: '$\\hat{p}(1-\\hat{p})$ es máximo en $\\hat{p} = 0{,}5$.' }[d.ok]];
    },
    answer: function (d) { return { mitad: 'se reduce a la mitad', doble: 'se duplica', ancho: 'se hace más ancho', medio: '0,5' }[d.ok]; }
  });

  p.keys([
    '$\\hat{p} = X/n$ y, para $n$ grande, $\\hat{p} \\sim N\\left(p, \\sqrt{p(1-p)/n}\\right)$.',
    'Intervalo: $\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\hat{p}(1-\\hat{p})/n}$. El margen es el «±» de las encuestas.',
    'Tamaño: $n \\ge z^2\\hat{p}(1-\\hat{p})/E^2$, redondeando hacia arriba.',
    'Sin información previa se toma $\\hat{p} = 0{,}5$, que es el peor caso.',
    'Para dividir el margen entre 2 hay que multiplicar la muestra por 4.',
    'Una conclusión solo es firme si todo el intervalo cae del mismo lado del valor que se discute.'
  ]);
});
