/* Tema: El filtro de Kalman en una dimension */
Course.topic('cib-kalman', function (p) {

  p.text('Imagina que vas en coche por un túnel sin cobertura. Sabes a qué velocidad ibas y cuánto tiempo ' +
    'ha pasado, así que puedes <strong>predecir</strong> dónde estás; pero la predicción se va ' +
    'equivocando un poco más a cada minuto. Al salir del túnel, el GPS te da una <strong>medida</strong>; ' +
    'pero el GPS también se equivoca unos metros. ¿Con cuál te quedas?');

  p.text('La respuesta correcta es: con ninguna de las dos. Con una mezcla de ambas, en la que cada una ' +
    'pesa según lo que te fías de ella. Hacer esa mezcla de la mejor manera posible, una y otra vez, a ' +
    'medida que llegan medidas nuevas, es lo que hace el <strong>filtro de Kalman</strong>. Es el ' +
    'heredero directo del problema de [[cib-filtrado|separar la señal del ruido]] con el que empezó la ' +
    'cibernética, y uno de los algoritmos más útiles del siglo XX.');

  /* ---------------------------------------------------------------- */
  p.section('Predicción y medida: dos campanas');

  p.text('Toda la idea descansa en la [[pe-normal|distribución normal]]. La predicción no es un número, ' +
    'sino una campana: un valor central $x_p$ y una desviación típica $\\sigma_p$ que dice cuánto puede ' +
    'equivocarse. La medida es otra campana, centrada en el valor medido $z$ y con desviación $\\sigma_m$, ' +
    'la del sensor. Si las dos informaciones son independientes, la mejor estimación combinada es otra ' +
    'campana, más estrecha que las dos.');

  p.formulas([
    'x_e = \\frac{\\sigma_m^2\\,x_p + \\sigma_p^2\\,z}{\\sigma_p^2 + \\sigma_m^2}',
    '\\frac{1}{\\sigma_e^2} = \\frac{1}{\\sigma_p^2} + \\frac{1}{\\sigma_m^2}'
  ], 'fundir dos estimaciones',
    'La primera es una <strong>media ponderada</strong>. Fíjate en el cruce: la predicción va multiplicada por ' +
    'la varianza de la <em>medida</em>, y la medida por la de la <em>predicción</em>. Así, cuanto peor es una ' +
    'fuente, más peso recibe la otra.<br><br>La segunda dice que las <strong>precisiones</strong>, los inversos ' +
    'de las varianzas, se suman. Por eso la estimación fundida es siempre más precisa que cualquiera de ' +
    'las dos por separado: dos informaciones imperfectas valen más que la mejor de ellas.');

  p.demo({
    title: 'Dos campanas y una tercera',
    intro: 'La campana azul es la predicción; la naranja, la medida. La rellena es la estimación fundida. Estrecha una de las dos y verás cómo la estimación se va hacia ella; ensánchalas y verás que la fundida siempre es más estrecha que las dos.',
    build: function (host) {
      var xp = 8, sp = 2, z = 12, sm = 1.5;
      var out = W.readout(host, '');
      function campana(mu, s) {
        return function (x) { return Math.exp(-(x - mu) * (x - mu) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); };
      }
      function funde() {
        var vp = sp * sp, vm = sm * sm, K = vp / (vp + vm);
        return { vp: vp, vm: vm, K: K, xe: xp + K * (z - xp), se: Math.sqrt((1 - K) * vp) };
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 20, ymin: 0, ymax: 0.6, height: 280, xlabel: 'posición', ylabel: 'densidad',
        draw: function (g) {
          var f = funde();
          g.fn(campana(xp, sp), { color: 0, w: 2.2 });
          g.fn(campana(z, sm), { color: 1, w: 2.2 });
          g.area(campana(f.xe, f.se), 0, 20, { color: 2, fillAlpha: 0.22 });
          g.fn(campana(f.xe, f.se), { color: 2, w: 3 });
          g.vline(f.xe, { color: 2, dash: true, w: 1.2 });
        }
      });
      function pinta() {
        var f = funde();
        out.set('Ganancia de Kalman: $K = \\frac{' + U.fmt(f.vp, 2) + '}{' + U.fmt(f.vp, 2) + ' + ' + U.fmt(f.vm, 2) + '} = ' + U.fmt(f.K, 3) +
          '$ &nbsp;·&nbsp; estimación: $x_e = ' + U.fmt(f.xe, 2) + '$ &nbsp;·&nbsp; $\\sigma_e = ' + U.fmt(f.se, 2) + '$, menor que $' + U.fmt(Math.min(sp, sm), 2) + '$');
        plot.render();
      }
      var f1 = W.row(host);
      W.slider(f1, { label: 'predicción $x_p$', min: 0, max: 20, step: 0.1, value: xp, on: function (v) { xp = v; pinta(); } });
      W.slider(f1, { label: '$\\sigma_p$', min: 1, max: 5, step: 0.05, value: sp, on: function (v) { sp = v; pinta(); } });
      var f2 = W.row(host);
      W.slider(f2, { label: 'medida $z$', min: 0, max: 20, step: 0.1, value: z, on: function (v) { z = v; pinta(); } });
      W.slider(f2, { label: '$\\sigma_m$', min: 1, max: 5, step: 0.05, value: sm, on: function (v) { sm = v; pinta(); } });
      W.legend(host, [{ c: 0, t: 'predicción' }, { c: 1, t: 'medida' }, { c: 2, t: 'estimación fundida' }]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La ganancia de Kalman');

  p.text('La fórmula de la media ponderada se puede reescribir de una forma que cuenta mejor lo que pasa. ' +
    'Se parte de la predicción y se mueve hacia la medida una fracción $K$ del camino:');

  p.formula('K = \\frac{\\sigma_p^2}{\\sigma_p^2 + \\sigma_m^2}, \\qquad x_e = x_p + K\\,(z - x_p), \\qquad \\sigma_e^2 = (1 - K)\\,\\sigma_p^2',
    'la corrección de Kalman',
    '$K$ es la <strong>ganancia de Kalman</strong>, un número entre 0 y 1.<br><br>La diferencia $z - x_p$ se ' +
    'llama <strong>innovación</strong>: lo que la medida trae de nuevo respecto de lo esperado.<br><br>' +
    'Si el sensor es malísimo, $\\sigma_m$ es enorme, $K \\approx 0$ y la medida casi se ignora. Si la ' +
    'predicción es malísima, $K \\approx 1$ y se hace caso a la medida. Es un controlador proporcional ' +
    'como los de [[cib-control]], con una ganancia que se calcula sola.');

  p.sub('El ciclo: predecir y corregir');

  p.text('Un objeto que se mueve no se queda quieto esperando a la medida siguiente. Entre medida y medida, ' +
    'el filtro <strong>predice</strong> dónde estará con lo que sabe de su movimiento, y esa predicción ' +
    'pierde precisión: a la varianza se le suma una cantidad $q$, el ruido del proceso, que representa ' +
    'todo lo que el modelo no sabe (un golpe de viento, un frenazo). Luego llega la medida y ' +
    '<strong>corrige</strong>. Y vuelta a empezar.');

  p.formula('\\text{predicción:}\\quad x_p = x_e + v\\,\\Delta t, \\qquad \\sigma_p^2 = \\sigma_e^2 + q',
    'el paso de predicción',
    'Se usa la estimación anterior y la velocidad conocida $v$ para adelantar la posición un paso $\\Delta t$.<br><br>' +
    'Al predecir, la incertidumbre <strong>crece</strong>: se suma $q$. Al corregir con la medida, ' +
    '<strong>baja</strong>. El filtro alterna para siempre entre esos dos movimientos, y enseguida se asienta ' +
    'en un equilibrio entre lo que pierde y lo que gana.');

  p.demo({
    title: 'Seguir algo que se mide mal',
    intro: 'La línea fina es la posición real de un objeto que deambula; los puntos, lo que mide un sensor muy ruidoso. Compara la media móvil de las cinco últimas medidas con el filtro de Kalman. Luego desajusta el filtro: dile que el sensor es perfecto, o que miente muchísimo, y mira qué le pasa.',
    build: function (host) {
      var q = 0.3, R = 4, semilla = 7, N = 120, Q_REAL = 0.3, R_REAL = 4;
      var out = W.readout(host, '');
      function datos() {
        var rng = U.rng(semilla), x = 0, real = [], med = [];
        function gauss() {
          var u = Math.max(1e-12, rng.real(0, 1)), w = rng.real(0, 1);
          return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w);
        }
        for (var i = 0; i < N; i++) {
          x += Math.sqrt(Q_REAL) * gauss();
          real.push(x);
          med.push(x + Math.sqrt(R_REAL) * gauss());
        }
        return { real: real, med: med };
      }
      function calcula(D) {
        var xe = D.med[0], P = R, est = [xe], mm = [], K = 0;
        for (var i = 1; i < N; i++) {
          var Pp = P + q;
          K = Pp / (Pp + R);
          xe = xe + K * (D.med[i] - xe);
          P = (1 - K) * Pp;
          est.push(xe);
        }
        for (var j = 0; j < N; j++) {
          var s = 0, n = 0;
          for (var m = Math.max(0, j - 4); m <= j; m++) { s += D.med[m]; n++; }
          mm.push(s / n);
        }
        function rms(a) { var t = 0; for (var i2 = 0; i2 < N; i2++) t += (a[i2] - D.real[i2]) * (a[i2] - D.real[i2]); return Math.sqrt(t / N); }
        return { est: est, mm: mm, K: K, eMed: rms(D.med), eMm: rms(mm), eKal: rms(est) };
      }
      function rango(D) {
        var lo = Infinity, hi = -Infinity;
        D.med.forEach(function (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); });
        return [lo - 1, hi + 1];
      }
      function aPuntos(a) { return a.map(function (v, i) { return [i, v]; }); }
      var D = datos(), ry = rango(D);
      var plot = W.plot(host, {
        xmin: 0, xmax: N - 1, ymin: ry[0], ymax: ry[1], height: 300, xlabel: 'instante', ylabel: 'posición',
        draw: function (g) {
          var c = calcula(D);
          D.med.forEach(function (v, i) { g.point(i, v, { color: 3, r: 2, w: 1 }); });
          g.path(aPuntos(D.real), { color: 'ink', w: 1.3 });
          g.path(aPuntos(c.mm), { color: 1, w: 2 });
          g.path(aPuntos(c.est), { color: 0, w: 2.8 });
        }
      });
      function pinta() {
        var c = calcula(D);
        out.set('Error típico respecto de la posición real &nbsp;·&nbsp; medidas sueltas: <strong>' + U.fmt(c.eMed, 2) + '</strong> &nbsp;·&nbsp; media móvil: <strong>' +
          U.fmt(c.eMm, 2) + '</strong> &nbsp;·&nbsp; Kalman: <strong>' + U.fmt(c.eKal, 2) + '</strong><br>El filtro se ha asentado en una ganancia $K \\approx ' + U.fmt(c.K, 3) + '$.');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'q: cuánto crees que se mueve', min: 0.01, max: 5, step: 0.01, value: q, on: function (v) { q = v; pinta(); } });
      W.slider(fila, { label: 'R: cuánto crees que miente el sensor', min: 0.1, max: 20, step: 0.1, value: R, on: function (v) { R = v; pinta(); } });
      W.buttons(host, [{ t: 'Otra trayectoria', on: function () { semilla++; D = datos(); ry = rango(D); plot.view(0, N - 1, ry[0], ry[1]); pinta(); } }]);
      W.legend(host, [{ c: U.palette().ink, t: 'posición real' }, { c: 3, t: 'medidas' }, { c: 1, t: 'media móvil de 5' }, { c: 0, t: 'Kalman' }]);
      W.hint(host, 'Los valores reales del ruido son q = 0,3 y R = 4. Con ellos el filtro da su mejor resultado; con R muy pequeño persigue cada medida, y con R muy grande se queda atrás.');
      pinta();
    }
  });

  p.hist('Rudolf Kálmán, un ingeniero nacido en Budapest en 1930 y emigrado a Estados Unidos, publicó el ' +
    'filtro en 1960. Al principio muchos ingenieros desconfiaron de él. Uno de los primeros en ver su ' +
    'alcance fue Stanley Schmidt, del centro Ames de la NASA, que buscaba cómo estimar la trayectoria de ' +
    'una nave hacia la Luna con medidas escasas y un ordenador de a bordo diminuto. Lo adaptó al problema ' +
    'y el filtro acabó volando en los ordenadores de navegación del programa Apolo. Desde entonces no ha ' +
    'dejado de volar.');

  p.util('El teléfono que llevas en el bolsillo funde con filtros de este tipo el GPS, que es preciso pero ' +
    'lento y se pierde entre edificios, con los acelerómetros y giróscopos, que son rápidos pero van ' +
    'acumulando error. Lo mismo hacen los drones, los coches autónomos y los robots para saber dónde ' +
    'están. Y las predicciones del tiempo corrigen cada pocas horas sus simulaciones de la atmósfera con ' +
    'medidas reales usando versiones del mismo principio, con millones de variables en lugar de una.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La ganancia de Kalman',
    level: 'basico',
    gen: function (r) {
      var vp = r.pick([1, 2, 4, 9]), vm = r.pick([1, 2, 4, 9]);
      return { vp: vp, vm: vm, K: ML.F(vp, vp + vm), lado: vp > vm ? 'medida' : (vp < vm ? 'prediccion' : 'medio') };
    },
    ask: function (d) {
      return 'La predicción tiene varianza $\\sigma_p^2 = ' + d.vp + '$ y la medida, $\\sigma_m^2 = ' + d.vm + '$. Calcula la ganancia de Kalman $K$ ' +
        '(fracción o tres decimales). ¿La estimación quedará más cerca de la predicción, de la medida o justo en medio?';
    },
    fields: [
      { name: 'k', label: 'K =', w: 'tiny' },
      { name: 'l', label: 'La estimación queda', opts: [{ t: 'más cerca de la predicción', v: 'prediccion' }, { t: 'más cerca de la medida', v: 'medida' }, { t: 'justo en medio', v: 'medio' }] }
    ],
    sol: function (d) { return { k: d.K.val(), l: d.lado }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return d.vp !== d.vm && Math.abs(v.k - d.vm / (d.vp + d.vm)) < 5e-4; }, msg: 'Está al revés: $K$ es la parte de la varianza total que corresponde a la <strong>predicción</strong>. Si la predicción es mala, $K$ es grande y se hace más caso a la medida.' }],
    hint: function () { return ['$K = \\dfrac{\\sigma_p^2}{\\sigma_p^2 + \\sigma_m^2}$.', 'La estimación recorre una fracción $K$ del camino desde la predicción hasta la medida.']; },
    steps: function (d) {
      return ['$K = \\dfrac{' + d.vp + '}{' + d.vp + ' + ' + d.vm + '} = ' + d.K.tex() + ' \\approx ' + U.fmt(d.K.val(), 3) + '$',
        { medida: 'Como $K > \\frac{1}{2}$, se recorre más de la mitad del camino: la estimación queda más cerca de la medida, que es la fuente más fiable.',
          prediccion: 'Como $K < \\frac{1}{2}$, se recorre menos de la mitad del camino: la estimación queda más cerca de la predicción, que es la fuente más fiable.',
          medio: 'Con $K = \\frac{1}{2}$ las dos fuentes valen lo mismo y la estimación queda justo en medio.' }[d.lado]];
    },
    answer: function (d) { return 'K = ' + U.fmt(d.K.val(), 3); }
  });

  p.exercise({
    title: '¿En quién confía el filtro?',
    level: 'basico',
    gen: function (r) {
      return r.pick([
        { t: 'El sensor se estropea y empieza a dar medidas con muchísimo ruido, y el filtro está configurado con ese ruido enorme.', q: 'prediccion', por: 'Con $\\sigma_m$ enorme, $K = \\frac{\\sigma_p^2}{\\sigma_p^2 + \\sigma_m^2}$ se acerca a 0.' },
        { t: 'El objeto cambia de dirección de forma imprevisible a cada instante, y el filtro lo sabe: su ruido de proceso $q$ es muy grande.', q: 'medida', por: 'Con $q$ muy grande, la predicción es muy incierta: $\\sigma_p^2$ crece y $K$ se acerca a 1.' },
        { t: 'Se instala un sensor casi perfecto, con una varianza diminuta.', q: 'medida', por: 'Con $\\sigma_m^2 \\approx 0$, $K \\approx 1$: la medida manda.' },
        { t: 'El objeto está quieto, el filtro lo sabe ($q = 0$) y ya ha procesado cientos de medidas.', q: 'prediccion', por: 'Cada corrección reduce $\\sigma_e^2$ y, sin ruido de proceso, nada la vuelve a aumentar: la predicción se vuelve muy precisa y $K$ tiende a 0.' },
        { t: 'La predicción y la medida tienen exactamente la misma varianza.', q: 'medio', por: 'Con varianzas iguales, $K = \\frac{1}{2}$.' }
      ]);
    },
    ask: function (d) { return '<em>«' + d.t + '»</em><br>¿Cómo será la ganancia de Kalman?'; },
    fields: [{ name: 'q', label: 'El filtro se fía', opts: [{ t: 'casi solo de la predicción (K cerca de 0)', v: 'prediccion' }, { t: 'casi solo de la medida (K cerca de 1)', v: 'medida' }, { t: 'de las dos por igual (K = 0,5)', v: 'medio' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return ['¿Qué fuente tiene menos varianza en esa situación?', 'La ganancia se acerca a 1 cuando la predicción es la que peor está.']; },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return { prediccion: 'K cerca de 0', medida: 'K cerca de 1', medio: 'K = 0,5' }[d.q]; }
  });

  p.exercise({
    title: 'Fundir predicción y medida',
    level: 'medio',
    gen: function (r) {
      var xp = r.int(10, 30), sp = r.pick([1, 2, 3]), sm = r.pick([1, 2, 3, 4]), z = xp + r.pm(1, 6);
      if (sp === sm) return null;
      var vp = sp * sp, vm = sm * sm;
      return {
        xp: xp, sp: sp, sm: sm, z: z, vp: vp, vm: vm,
        xe: ML.F(vm * xp + vp * z, vp + vm), ve: ML.F(vp * vm, vp + vm), cruzado: ML.F(vp * xp + vm * z, vp + vm)
      };
    },
    ask: function (d) {
      return 'Un robot predice que está en la posición $x_p = ' + d.xp + '$ con desviación típica $\\sigma_p = ' + d.sp + '$. Su sensor ' +
        'mide $z = ' + d.z + '$ con desviación típica $\\sigma_m = ' + d.sm + '$. Calcula la estimación fundida $x_e$ y su varianza ' +
        '$\\sigma_e^2$ (fracción o tres decimales).';
    },
    fields: [{ name: 'x', label: '$x_e$', w: 'wide' }, { name: 'v', label: '$\\sigma_e^2$', w: 'wide' }],
    sol: function (d) { return { x: d.xe.val(), v: d.ve.val() }; },
    tol: 1e-3,
    errores: [
      { si: function (v, d) { return Math.abs(v.x - (d.xp + d.z) / 2) < 5e-4; }, msg: 'Esa es la media sin ponderar. Las dos fuentes no son igual de fiables: la de menor varianza debe pesar más.' },
      { si: function (v, d) { return Math.abs(v.x - d.cruzado.val()) < 5e-4; }, msg: 'Los pesos están al revés: la predicción se multiplica por la varianza de la <strong>medida</strong>, y viceversa. Así pesa más la fuente que menos se equivoca.' },
      { si: function (v, d) { return Math.abs(v.v - (d.vp + d.vm)) < 5e-4; }, msg: 'Al fundir dos fuentes la incertidumbre baja, no sube: se suman las precisiones, $\\frac{1}{\\sigma_e^2} = \\frac{1}{\\sigma_p^2} + \\frac{1}{\\sigma_m^2}$.' }
    ],
    hint: function () {
      return ['Pasa primero a varianzas: eleva al cuadrado las desviaciones típicas.',
        '$x_e = \\dfrac{\\sigma_m^2\\,x_p + \\sigma_p^2\\,z}{\\sigma_p^2 + \\sigma_m^2}$ y $\\sigma_e^2 = \\dfrac{\\sigma_p^2\\,\\sigma_m^2}{\\sigma_p^2 + \\sigma_m^2}$.'];
    },
    steps: function (d) {
      return ['Varianzas: $\\sigma_p^2 = ' + d.vp + '$ y $\\sigma_m^2 = ' + d.vm + '$.',
        '$x_e = \\dfrac{' + d.vm + '\\cdot ' + d.xp + ' + ' + d.vp + '\\cdot ' + d.z + '}{' + (d.vp + d.vm) + '} = ' + d.xe.tex() + ' \\approx ' + U.fmt(d.xe.val(), 3) + '$',
        '$\\sigma_e^2 = \\dfrac{' + d.vp + '\\cdot ' + d.vm + '}{' + (d.vp + d.vm) + '} = ' + d.ve.tex() + ' \\approx ' + U.fmt(d.ve.val(), 3) + '$, menor que ' + Math.min(d.vp, d.vm) + '.'];
    },
    answer: function (d) { return 'x_e = ' + U.fmt(d.xe.val(), 3) + ', σ_e² = ' + U.fmt(d.ve.val(), 3); }
  });

  p.problem({
    title: 'Un ciclo completo del filtro',
    level: 'avanzado',
    gen: function (r) {
      var xe0 = r.int(0, 20), ve0 = r.pick([1, 2, 3]), vel = r.pm(1, 3), q = r.pick([1, 2]), vm = r.pick([1, 2, 3, 4, 6]);
      var xp = xe0 + vel, vp = ve0 + q, z = xp + r.pm(1, 5);
      var K = ML.F(vp, vp + vm);
      return { xe0: xe0, ve0: ve0, vel: vel, q: q, vm: vm, xp: xp, vp: vp, z: z, K: K, xe: K.mul(z - xp).add(xp), ve: ML.F(vp * vm, vp + vm) };
    },
    intro: function (d) {
      return 'Un carrito avanza por un raíl. Tras el último paso del filtro, su posición estimada es $x_e = ' + d.xe0 + '$ con varianza $' + d.ve0 +
        '$. Su velocidad es $v = ' + d.vel + '$ unidades por segundo, pero no es exacta: en cada segundo la varianza de la predicción aumenta en $q = ' + d.q +
        '$. Un segundo después, el sensor mide $z = ' + d.z + '$ con varianza $\\sigma_m^2 = ' + d.vm + '$.';
    },
    partes: [
      {
        ask: function () { return 'Predicción: ¿dónde debería estar el carrito un segundo después, y con qué varianza?'; },
        fields: [{ name: 'p', label: '$x_p$', w: 'tiny' }, { name: 's', label: '$\\sigma_p^2$', w: 'tiny' }],
        sol: function (d) { return { p: d.xp, s: d.vp }; },
        tol: 1e-6,
        errores: [{ si: function (v, d) { return Math.abs(v.s - d.ve0) < 1e-6; }, msg: 'Al predecir, la incertidumbre crece: a la varianza anterior hay que sumarle $q$.' }],
        hint: function () { return '$x_p = x_e + v\\,\\Delta t$ y $\\sigma_p^2 = \\sigma_e^2 + q$.'; },
        steps: function (d) { return ['$x_p = ' + d.xe0 + ' + (' + d.vel + ')\\cdot 1 = ' + d.xp + '$', '$\\sigma_p^2 = ' + d.ve0 + ' + ' + d.q + ' = ' + d.vp + '$']; },
        answer: function (d) { return 'x_p = ' + d.xp + ', σ_p² = ' + d.vp; }
      },
      {
        ask: function () { return 'Calcula la ganancia de Kalman (fracción o tres decimales).'; },
        fields: [{ name: 'k', label: 'K =', w: 'tiny' }],
        sol: function (d) { return { k: d.K.val() }; },
        tol: 1e-3,
        errores: [{ si: function (v, d) { return d.vp !== d.vm && Math.abs(v.k - d.vm / (d.vp + d.vm)) < 5e-4; }, msg: 'Al revés: en el numerador va la varianza de la <strong>predicción</strong>.' }],
        hint: function () { return '$K = \\dfrac{\\sigma_p^2}{\\sigma_p^2 + \\sigma_m^2}$, con la varianza de la predicción que acabas de calcular.'; },
        steps: function (d) { return ['$K = \\dfrac{' + d.vp + '}{' + d.vp + ' + ' + d.vm + '} = ' + d.K.tex() + '$']; },
        answer: function (d) { return '$' + d.K.tex() + '$'; }
      },
      {
        ask: function () { return 'Corrección: calcula la nueva estimación $x_e$ y su varianza $\\sigma_e^2$ (fracción o tres decimales).'; },
        fields: [{ name: 'x', label: '$x_e$', w: 'wide' }, { name: 'v', label: '$\\sigma_e^2$', w: 'wide' }],
        sol: function (d) { return { x: d.xe.val(), v: d.ve.val() }; },
        tol: 1e-3,
        errores: [{ si: function (v, d) { return Math.abs(v.x - d.z) < 5e-4; }, msg: 'Esa es la medida tal cual. La estimación se mueve desde la predicción hacia la medida solo una fracción $K$ del camino.' }],
        hint: function () { return '$x_e = x_p + K\\,(z - x_p)$ y $\\sigma_e^2 = (1 - K)\\,\\sigma_p^2$.'; },
        steps: function (d) {
          return ['Innovación: $z - x_p = ' + d.z + ' - ' + (d.xp < 0 ? '(' + d.xp + ')' : d.xp) + ' = ' + (d.z - d.xp) + '$',
            '$x_e = ' + d.xp + ' + ' + d.K.tex() + '\\cdot(' + (d.z - d.xp) + ') = ' + d.xe.tex() + ' \\approx ' + U.fmt(d.xe.val(), 3) + '$',
            '$\\sigma_e^2 = \\left(1 - ' + d.K.tex() + '\\right)\\cdot ' + d.vp + ' = ' + d.ve.tex() + ' \\approx ' + U.fmt(d.ve.val(), 3) + '$'];
        },
        answer: function (d) { return 'x_e = ' + U.fmt(d.xe.val(), 3) + ', σ_e² = ' + U.fmt(d.ve.val(), 3); }
      }
    ]
  });

  p.keys([
    'Predicción y medida son dos campanas; la mejor estimación es su media ponderada por los inversos de las varianzas.',
    'Las precisiones se suman: la estimación fundida es más precisa que cualquiera de las dos fuentes.',
    'Ganancia de Kalman: $K = \\frac{\\sigma_p^2}{\\sigma_p^2 + \\sigma_m^2}$; la estimación es $x_p + K(z - x_p)$ y su varianza $(1 - K)\\sigma_p^2$.',
    'El filtro alterna predecir, que suma incertidumbre $q$, y corregir, que la reduce.'
  ]);
});
