/* Tema: Oscilaciones: la ecuacion de segundo orden */
Course.topic('av-oscilador', function (p) {

  p.text('Un peso colgado de un muelle, un columpio, la suspensión de un coche, la cuerda de una guitarra, un ' +
    'circuito eléctrico con una bobina y un condensador. Todos oscilan, y todos siguen <strong>la misma ecuación ' +
    'diferencial</strong>. Es probablemente la ecuación más importante de la física, y resolverla necesita algo ' +
    'que parece no tener nada que ver: los [[al-complejos|números complejos]].');

  /* ---------------------------------------------------------------- */
  p.section('La ecuación del muelle');

  p.text('Un cuerpo de masa $m$ está unido a un muelle. Si se aparta una distancia $x$ de su posición de ' +
    'reposo, el muelle tira de él hacia atrás con una fuerza proporcional, $-kx$: la ley de Hooke. Además, el aire ' +
    'o el aceite de un amortiguador frenan con una fuerza proporcional a la velocidad, $-c\\,x\'$. Y la segunda ley ' +
    'de Newton dice que la fuerza total es la masa por la aceleración, $m\\,x\'\'$:');

  p.formula('m\\,x\'\' + c\\,x\' + k\\,x = 0', 'el oscilador amortiguado',
    'Se lee: <em>«eme por la derivada segunda de equis, más ce por la derivada de equis, más ka por equis, igual a cero»</em>.<br><br>' +
    '$m$ es la masa, $c$ el <strong>amortiguamiento</strong> y $k$ la <strong>rigidez</strong> del muelle.<br><br>' +
    'Es una ecuación de <strong>segundo orden</strong>, porque aparece la derivada segunda, y <strong>lineal</strong>, ' +
    'porque $x$ y sus derivadas aparecen sin multiplicarse entre sí. Un circuito con resistencia $R$, bobina $L$ y ' +
    'condensador $C$ cumple $L\\,q\'\' + R\\,q\' + \\frac{1}{C}\\,q = 0$: la misma ecuación con otras letras.');

  p.text('Para resolverla se prueba una solución exponencial, $x = e^{rt}$, porque sus derivadas son ella misma ' +
    'multiplicada por $r$. Sustituyendo, $e^{rt}$ sale factor común y queda una ecuación de segundo grado para $r$, ' +
    'la <strong>ecuación característica</strong>. Y como toda ecuación de segundo grado, su discriminante decide.');

  p.formulas([
    'm\\,r^2 + c\\,r + k = 0 \\qquad\\Rightarrow\\qquad r = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2}',
    '\\gamma = \\frac{c}{2m}, \\qquad \\omega_0 = \\sqrt{\\frac{k}{m}}'
  ], 'la ecuación característica',
    '$\\gamma$, gamma, mide cuánto frena el amortiguamiento. $\\omega_0$, omega cero, es la <strong>frecuencia ' +
    'natural</strong>: la frecuencia a la que oscilaría el muelle sin rozamiento, con periodo $T = \\frac{2\\pi}{\\omega_0}$.<br><br>' +
    'Si $\\gamma < \\omega_0$, la raíz es de un número negativo y $r$ es complejo: $r = -\\gamma \\pm i\\,\\omega_d$, con ' +
    '$\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2}$. Por la fórmula de Euler, $e^{i\\omega_d t} = \\cos\\omega_d t + i\\operatorname{sen}\\omega_d t$: ' +
    '<strong>la parte imaginaria de la raíz es la oscilación, y la parte real, el apagado</strong>.');

  p.table(['Discriminante', 'Nombre', 'Qué hace', 'Solución'], [
    ['$\\gamma < \\omega_0$', 'subamortiguado', 'oscila y se va apagando', '$e^{-\\gamma t}(A\\cos\\omega_d t + B\\operatorname{sen}\\omega_d t)$'],
    ['$\\gamma = \\omega_0$', 'amortiguamiento crítico', 'vuelve al reposo lo más rápido posible sin pasarse', '$(A + Bt)\\,e^{-\\gamma t}$'],
    ['$\\gamma > \\omega_0$', 'sobreamortiguado', 'vuelve despacio, sin oscilar', '$A\\,e^{r_1 t} + B\\,e^{r_2 t}$, con $r_1, r_2 < 0$']
  ]);

  p.demo({
    title: 'Tres maneras de volver al reposo',
    intro: 'El cuerpo se suelta desde x = 1 sin velocidad. Sube el amortiguamiento desde cero: primero oscila cada vez menos, luego llega al punto crítico, en el que vuelve lo más rápido posible sin pasarse, y después se vuelve perezoso. Las curvas de puntos son la envolvente e^(−γt).',
    build: function (host) {
      var m = 1, c = 0.4, k = 4;
      var out = W.readout(host, '');
      function x(t) {
        var g = c / (2 * m), w0 = Math.sqrt(k / m);
        if (Math.abs(g - w0) < 1e-6) return (1 + g * t) * Math.exp(-g * t);
        if (g < w0) { var wd = Math.sqrt(w0 * w0 - g * g); return Math.exp(-g * t) * (Math.cos(wd * t) + g / wd * Math.sin(wd * t)); }
        var s = Math.sqrt(g * g - w0 * w0), r1 = -g + s, r2 = -g - s;
        return (-r2 * Math.exp(r1 * t) + r1 * Math.exp(r2 * t)) / (r1 - r2);
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 12, ymin: -1.1, ymax: 1.1, height: 280, xlabel: 't', ylabel: 'x',
        draw: function (g) {
          var gam = c / (2 * m), w0 = Math.sqrt(k / m);
          if (gam < w0 && gam > 0) {
            g.fn(function (t) { return Math.exp(-gam * t); }, { color: 'axis', w: 1.2, dash: [4, 4] });
            g.fn(function (t) { return -Math.exp(-gam * t); }, { color: 'axis', w: 1.2, dash: [4, 4] });
          }
          g.fn(x, { color: 0, w: 2.8, samples: 600 });
        }
      });
      function pinta() {
        var gam = c / (2 * m), w0 = Math.sqrt(k / m), crit = 2 * Math.sqrt(m * k), regimen;
        if (Math.abs(c - crit) < 0.05) regimen = '<strong style="color:var(--ok)">prácticamente crítico</strong>';
        else if (gam < w0) regimen = '<strong>subamortiguado</strong>: oscila con $\\omega_d = ' + U.fmt(Math.sqrt(w0 * w0 - gam * gam), 3) + '$';
        else regimen = '<strong>sobreamortiguado</strong>: no oscila';
        out.set('$\\gamma = ' + U.fmt(gam, 3) + '$, $\\omega_0 = ' + U.fmt(w0, 3) + '$ &nbsp;·&nbsp; ' + regimen + ' &nbsp;·&nbsp; amortiguamiento crítico: $c = 2\\sqrt{mk} = ' + U.fmt(crit, 3) + '$');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'masa m', min: 0.2, max: 4, step: 0.05, value: m, on: function (v) { m = v; pinta(); } });
      W.slider(fila, { label: 'amortiguamiento c', min: 0, max: 10, step: 0.05, value: c, on: function (v) { c = v; pinta(); } });
      W.slider(fila, { label: 'rigidez k', min: 0.5, max: 10, step: 0.1, value: k, on: function (v) { k = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Oscilaciones forzadas y resonancia');

  p.text('Si además se empuja el sistema con una fuerza periódica —un niño en un columpio al que empujan, un ' +
    'edificio al que sacude un terremoto, un circuito conectado a una antena—, la ecuación gana un segundo ' +
    'miembro. Pasado el arranque, el sistema acaba oscilando <strong>a la frecuencia del empuje</strong>, no a la ' +
    'suya, con una amplitud que depende de lo cerca que estén las dos:');

  p.formulas([
    'm\\,x\'\' + c\\,x\' + k\\,x = F\\cos(\\Omega t)',
    'A(\\Omega) = \\frac{F}{\\sqrt{(k - m\\Omega^2)^2 + (c\\,\\Omega)^2}}'
  ], 'el oscilador forzado y su amplitud',
    '$\\Omega$, omega mayúscula, es la frecuencia del empuje y $F$ su intensidad.<br><br>Si $\\Omega$ es muy pequeña, ' +
    '$A \\approx \\frac{F}{k}$: el muelle se estira como si la fuerza fuera constante.<br><br>Si $\\Omega$ se acerca a ' +
    '$\\omega_0$, el primer paréntesis se anula, $k - m\\omega_0^2 = 0$, y solo queda el rozamiento en el denominador: ' +
    '$A \\approx \\frac{F}{c\\,\\omega_0}$. Con poco rozamiento, la amplitud se dispara. Eso es la ' +
    '<strong>resonancia</strong>.');

  p.demo({
    title: 'La curva de resonancia',
    intro: 'Amplitud de la oscilación según la frecuencia con la que se empuja, para un muelle con ω₀ = 2. Baja el amortiguamiento: el pico se hace más alto y más estrecho. Mueve la frecuencia del empuje y compara la amplitud con la que tendría con una fuerza constante, F/k.',
    build: function (host) {
      var c = 0.5, W0 = 2, m = 1, k = 4, F = 1, Om = 1.5;
      var out = W.readout(host, '');
      function A(w) { return F / Math.sqrt(Math.pow(k - m * w * w, 2) + Math.pow(c * w, 2)); }
      var plot = W.plot(host, {
        xmin: 0, xmax: 5, ymin: 0, ymax: 3, height: 280, xlabel: 'Ω (frecuencia del empuje)', ylabel: 'amplitud',
        draw: function (g) {
          g.vline(W0, { color: 'axis', dash: [4, 4], w: 1.2 });
          g.hline(F / k, { color: 3, dash: [4, 4], w: 1.2 });
          g.fn(A, { color: 0, w: 2.8, samples: 500 });
          g.point(Om, A(Om), { color: 1, r: 6 });
        }
      });
      function pinta() {
        var tope = Math.min(12, Math.max(1.2, 1.15 * A(Math.sqrt(Math.max(0, W0 * W0 - c * c / 2)))));
        plot.view(0, 5, 0, tope);
        out.set('Con $\\Omega = ' + U.fmt(Om, 2) + '$: amplitud $' + U.fmt(A(Om), 3) + '$, que es ' + U.fmt(A(Om) / (F / k), 2) + ' veces la estática $\\frac{F}{k} = ' + U.fmt(F / k, 2) + '$' +
          ' &nbsp;·&nbsp; en resonancia, $\\frac{F}{c\\,\\omega_0} = ' + U.fmt(F / (c * W0), 2) + '$');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'amortiguamiento c', min: 0.08, max: 3, step: 0.01, value: c, on: function (v) { c = v; pinta(); } });
      W.slider(fila, { label: 'frecuencia del empuje Ω', min: 0.05, max: 5, step: 0.01, value: Om, on: function (v) { Om = v; pinta(); } });
      pinta();
    }
  });

  p.hist('En junio del año 2000 se inauguró en Londres el puente del Milenio, una pasarela peatonal sobre el ' +
    'Támesis. El primer día cruzaron miles de personas y el puente empezó a balancearse de lado. Al notarlo, los ' +
    'peatones ajustaban el paso para no caerse, sin darse cuenta, al ritmo del balanceo, y con ello lo empujaban ' +
    'todavía más a su frecuencia: una resonancia alimentada por las propias personas. El puente se cerró a los dos ' +
    'días y se reabrió en 2002 con amortiguadores añadidos. Galileo ya había observado en el siglo XVII que un ' +
    'péndulo oscila siempre con el mismo periodo, y Christiaan Huygens usó esa regularidad en 1656 para construir ' +
    'el primer reloj de péndulo.');

  p.util('Las suspensiones de los coches se diseñan cerca del amortiguamiento crítico, para que el coche no ' +
    'rebote después de un bache ni tarde en recuperarse. Los edificios altos en zonas sísmicas llevan grandes masas ' +
    'con muelles que oscilan en contra. Una radio sintoniza una emisora ajustando un circuito para que resuene a su ' +
    'frecuencia y apenas responda a las demás. Y los relojes de cuarzo cuentan el tiempo con un cristal que resuena ' +
    '32 768 veces por segundo.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Oscila o no oscila?',
    level: 'basico',
    gen: function (r) {
      var m = r.pick([1, 2]), k = r.pick([2, 4, 8, 9, 18]), c = r.pick([1, 2, 4, 6, 8, 12]);
      var disc = c * c - 4 * m * k;
      return { m: m, k: k, c: c, disc: disc, tipo: disc < 0 ? 'sub' : (disc === 0 ? 'crit' : 'sobre') };
    },
    ask: function (d) { return 'Un oscilador cumple $' + d.m + 'x\'\' + ' + d.c + 'x\' + ' + d.k + 'x = 0$. Calcula el discriminante de su ecuación característica y di cómo vuelve al reposo.'; },
    fields: [{ name: 'd', label: 'discriminante', w: 'tiny' }, { name: 't', label: 'Vuelve', opts: [{ t: 'oscilando y apagándose (subamortiguado)', v: 'sub' }, { t: 'lo más rápido posible sin pasarse (crítico)', v: 'crit' }, { t: 'despacio y sin oscilar (sobreamortiguado)', v: 'sobre' }] }],
    sol: function (d) { return { d: d.disc, t: d.tipo }; },
    errores: [{ si: function (v, d) { return v.d === d.c * d.c - d.m * d.k && d.m * d.k !== 4 * d.m * d.k; }, msg: 'El discriminante de $mr^2 + cr + k = 0$ es $c^2 - 4mk$: falta el 4.' }],
    hint: function () { return ['La ecuación característica es $mr^2 + cr + k = 0$.', 'Discriminante negativo: raíces complejas, oscilación.']; },
    steps: function (d) {
      return ['Ecuación característica: $' + d.m + 'r^2 + ' + d.c + 'r + ' + d.k + ' = 0$.', 'Discriminante: $' + d.c + '^2 - 4\\cdot ' + d.m + '\\cdot ' + d.k + ' = ' + d.disc + '$.',
        { sub: 'Negativo: raíces complejas. La parte imaginaria hace oscilar y la real apaga: <strong>subamortiguado</strong>.', crit: 'Cero: raíz doble. <strong>Amortiguamiento crítico</strong>.', sobre: 'Positivo: dos raíces reales negativas. Vuelve sin oscilar: <strong>sobreamortiguado</strong>.' }[d.tipo]];
    },
    answer: function (d) { return 'discriminante ' + d.disc + ': ' + { sub: 'subamortiguado', crit: 'crítico', sobre: 'sobreamortiguado' }[d.tipo]; }
  });

  p.exercise({
    title: 'Frecuencia natural y periodo',
    level: 'basico',
    gen: function (r) {
      var m = r.pick([0.5, 1, 2, 4]), k = r.pick([2, 8, 16, 32, 50]);
      var w = Math.sqrt(k / m);
      return { m: m, k: k, w: w, T: 2 * Math.PI / w, malT: 2 * Math.PI * w };
    },
    ask: function (d) { return 'Un cuerpo de $' + U.fmt(d.m, 1) + '$ kg cuelga de un muelle de rigidez $k = ' + d.k + '$ N/m, sin rozamiento. ¿Cuál es su frecuencia natural $\\omega_0$ y su periodo? (Tres decimales.)'; },
    fields: [{ name: 'w', label: '$\\omega_0$ (rad/s)', w: 'tiny' }, { name: 'T', label: 'periodo (s)', w: 'tiny' }],
    sol: function (d) { return { w: U.round(d.w, 6), T: U.round(d.T, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.malT - d.T) > 2e-3 && Math.abs(v.T - d.malT) < 5e-4; }, msg: 'El periodo es $\\frac{2\\pi}{\\omega_0}$: cuanto mayor la frecuencia, más corto el periodo.' }],
    hint: function () { return ['$\\omega_0 = \\sqrt{\\frac{k}{m}}$.', '$T = \\frac{2\\pi}{\\omega_0}$.']; },
    steps: function (d) {
      return ['$\\omega_0 = \\sqrt{\\dfrac{' + d.k + '}{' + U.fmt(d.m, 1) + '}} \\approx ' + U.fmt(d.w, 3) + '$ rad/s', '$T = \\dfrac{2\\pi}{' + U.fmt(d.w, 3) + '} \\approx ' + U.fmt(d.T, 3) + '$ s',
        'Un muelle más rígido oscila más deprisa; una masa mayor, más despacio.'];
    },
    answer: function (d) { return 'ω₀ ≈ ' + U.fmt(d.w, 3) + ', T ≈ ' + U.fmt(d.T, 3) + ' s'; }
  });

  p.exercise({
    title: 'El amortiguamiento crítico',
    level: 'medio',
    gen: function (r) {
      var m = r.pick([1, 2, 4, 1200]), k = r.pick([1, 9, 16, 25, 100]);
      if (m === 1200) k = r.pick([30000, 48000, 75000]);
      return { m: m, k: k, c: 2 * Math.sqrt(m * k), mal: Math.sqrt(m * k) };
    },
    ask: function (d) {
      return d.m === 1200
        ? 'Un coche de 1200 kg se apoya en una suspensión de rigidez total $k = ' + U.miles(d.k) + '$ N/m. ¿Qué amortiguamiento $c$ hace falta para que el amortiguamiento sea crítico? (Unidades del SI, dos decimales.)'
        : 'Un oscilador tiene $m = ' + d.m + '$ y $k = ' + d.k + '$. ¿Qué valor de $c$ da amortiguamiento crítico? (Dos decimales.)';
    },
    fields: [{ name: 'c', label: '$c$', w: 'wide' }],
    sol: function (d) { return { c: U.round(d.c, 4) }; },
    tol: 0.01,
    errores: [{ si: function (v, d) { return Math.abs(v.c - d.mal) < 0.01; }, msg: 'El discriminante $c^2 - 4mk$ se anula con $c = \\sqrt{4mk} = 2\\sqrt{mk}$: falta el factor 2.' }],
    hint: function () { return ['Crítico significa discriminante nulo: $c^2 - 4mk = 0$.']; },
    steps: function (d) { return ['$c^2 = 4\\cdot ' + U.miles(d.m) + '\\cdot ' + U.miles(d.k) + '$', '$c = 2\\sqrt{' + U.miles(d.m * d.k) + '} \\approx ' + U.fmt(d.c, 2) + '$']; },
    answer: function (d) { return U.fmt(d.c, 2); }
  });

  p.exercise({
    title: 'La amplitud en resonancia',
    level: 'avanzado',
    gen: function (r) {
      var m = r.pick([1, 2]), k = r.pick([4, 8, 18, 32]), c = r.pick([0.1, 0.2, 0.5]), F = r.pick([1, 2, 5]);
      var w0 = Math.sqrt(k / m);
      return { m: m, k: k, c: c, F: F, w0: w0, A: F / (c * w0), est: F / k };
    },
    ask: function (d) {
      return 'El oscilador $' + d.m + 'x\'\' + ' + U.fmt(d.c, 1) + 'x\' + ' + d.k + 'x = ' + d.F + '\\cos(\\Omega t)$ se empuja justo a su frecuencia natural, $\\Omega = \\omega_0$. ' +
        '¿Qué amplitud alcanza? ¿Cuántas veces es mayor que la estática, $\\frac{F}{k}$? (Dos decimales.)';
    },
    fields: [{ name: 'a', label: 'amplitud', w: 'tiny' }, { name: 'v', label: 'veces la estática', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.A, 4), v: U.round(d.A / d.est, 4) }; },
    tol: 0.01,
    errores: [{ si: function (v, d) { return Math.abs(v.a - d.est) < 0.01; }, msg: 'Esa es la amplitud con una fuerza constante. En resonancia, $k - m\\Omega^2 = 0$ y solo queda el rozamiento: $A = \\frac{F}{c\\,\\omega_0}$.' }],
    hint: function () { return ['Con $\\Omega = \\omega_0$, $k - m\\Omega^2 = 0$.', 'Queda $A = \\dfrac{F}{c\\,\\omega_0}$.']; },
    steps: function (d) {
      return ['$\\omega_0 = \\sqrt{' + d.k + '/' + d.m + '} \\approx ' + U.fmt(d.w0, 3) + '$', '$A = \\dfrac{' + d.F + '}{' + U.fmt(d.c, 1) + '\\cdot ' + U.fmt(d.w0, 3) + '} \\approx ' + U.fmt(d.A, 2) + '$',
        'Estática: $\\frac{' + d.F + '}{' + d.k + '} = ' + U.fmt(d.est, 3) + '$. La resonancia la multiplica por $\\approx ' + U.fmt(d.A / d.est, 2) + '$: cuanto menor el rozamiento, mayor el factor.'];
    },
    answer: function (d) { return U.fmt(d.A, 2) + ', ' + U.fmt(d.A / d.est, 2) + ' veces'; }
  });

  p.keys([
    'Muelles, péndulos y circuitos cumplen $m\\,x\'\' + c\\,x\' + k\\,x = 0$.',
    'Probando $x = e^{rt}$ sale la ecuación característica $mr^2 + cr + k = 0$; su discriminante decide si el sistema oscila.',
    'Con raíces complejas $-\\gamma \\pm i\\omega_d$, la parte imaginaria es la oscilación y la real, el apagado.',
    'Frecuencia natural $\\omega_0 = \\sqrt{k/m}$; amortiguamiento crítico $c = 2\\sqrt{mk}$.',
    'Empujando a la frecuencia natural, la amplitud es $\\frac{F}{c\\,\\omega_0}$: con poco rozamiento, resonancia.'
  ]);
});
