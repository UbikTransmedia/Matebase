/* Tema: Cadenas de Markov y procesos estocásticos */
Course.topic('av-markov', function (p) {

  p.text('Un <strong>proceso estocástico</strong> es un sistema que evoluciona en el tiempo con una ' +
    'componente de azar. Y hay un tipo especialmente manejable, que es además el que aparece por todas ' +
    'partes: aquel en que <strong>el futuro depende solo del presente, no de cómo se llegó a él</strong>.');

  p.note('Esa condición se llama <strong>propiedad de Markov</strong>, o «falta de memoria». Para ' +
    'predecir el tiempo de mañana basta el de hoy; no hace falta saber qué pasó el mes pasado. Es una ' +
    'simplificación brutal, y sin embargo funciona sorprendentemente bien en muchísimos casos.',
    'ok', 'Azar con memoria de un solo paso');

  p.section('La matriz de transición');

  p.text('El sistema está en uno de varios <strong>estados</strong>, y en cada paso salta a otro con ' +
    'ciertas probabilidades. Todas ellas se recogen en una matriz.');

  p.formula('P = \\begin{pmatrix} p_{11} & p_{12} \\\\ p_{21} & p_{22} \\end{pmatrix}',
    'p_ij = probabilidad de pasar del estado i al j');

  p.note('Cada <strong>fila suma 1</strong>: si estás en un estado, con probabilidad total 1 acabarás ' +
    'en alguno (quizá en el mismo). Una matriz así se llama <em>estocástica</em>.', null);

  p.formula('\\vec{x}_{n+1} = \\vec{x}_n \\cdot P \\qquad \\vec{x}_n = \\vec{x}_0 \\cdot P^{\\,n}',
    'evolución del vector de estado');

  p.text('Y ahí aparece de golpe todo el álgebra lineal: predecir el futuro lejano es ' +
    '<strong>elevar una matriz a una potencia grande</strong>, que es exactamente lo que sabes hacer ' +
    'diagonalizando.');

  p.demo({
    title: 'El tiempo de mañana',
    intro: 'Un modelo climático de juguete con dos estados. Avanza días y observa cómo la predicción se olvida del punto de partida.',
    build: function (host, d) {
      var pss = 0.8, pll = 0.4;   // P(sol|sol), P(lluvia|lluvia)
      var x = [1, 0], dia = 0;
      var hist = [[1, 0]];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 20, ymin: 0, ymax: 1.05, height: 260,
        xlabel: 'días', ylabel: 'probabilidad', ystep: 0.25,
        draw: function (g) {
          g.path(hist.map(function (h, i) { return [i, h[0]]; }), { color: 3, w: 2.6 });
          g.path(hist.map(function (h, i) { return [i, h[1]]; }), { color: 0, w: 2.6 });
          hist.forEach(function (h, i) {
            g.point(i, h[0], { color: 3, r: 3.5 });
            g.point(i, h[1], { color: 0, r: 3.5 });
          });
          // distribucion estacionaria
          var s = (1 - pll) / (2 - pss - pll);
          g.hline(s, { color: 2, w: 1.6, dash: true });
          g.text(19.5, s + 0.05, 'estacionaria', { align: 'right', size: 11.5, color: 2 });
        }
      });
      function paso() {
        var nx = [x[0] * pss + x[1] * (1 - pll), x[0] * (1 - pss) + x[1] * pll];
        x = nx; dia++;
        hist.push(x.slice());
        paint();
      }
      function paint() {
        var s = (1 - pll) / (2 - pss - pll);
        out.set('$P = \\begin{pmatrix} ' + U.fmt(pss, 2) + ' & ' + U.fmt(1 - pss, 2) + ' \\\\ ' +
          U.fmt(1 - pll, 2) + ' & ' + U.fmt(pll, 2) + '\\end{pmatrix}$ ' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">(filas: hoy sol / hoy lluvia)</span><br>' +
          'Día <strong>' + dia + '</strong>: sol $' + U.fmt(x[0], 5) + '$ &nbsp;·&nbsp; lluvia $' + U.fmt(x[1], 5) + '$<br>' +
          'Distribución <strong>estacionaria</strong>: sol $' + U.fmt(s, 5) + '$, lluvia $' + U.fmt(1 - s, 5) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (dia > 8 ? 'La predicción ya no depende de si hoy hacía sol o llovía: el sistema ha <em>olvidado</em> su punto de partida.'
            : 'Sigue avanzando días y verás que las curvas convergen, empieces donde empieces.') + '</span>');
        plot.render();
      }
      W.buttons(host, [
        { t: '+1 día', on: paso },
        { t: '+5 días', cls: 'btn--main', on: function () { for (var i = 0; i < 5; i++) paso(); } },
        { t: 'Empezar con lluvia', on: function () { x = [0, 1]; dia = 0; hist = [[0, 1]]; paint(); } },
        { t: '↺ Reiniciar con sol', on: function () { x = [1, 0]; dia = 0; hist = [[1, 0]]; paint(); } }
      ]);
      var row = W.row(host);
      W.slider(row, { label: 'P(sol mañana | sol hoy)', min: 0.05, max: 0.95, step: 0.05, value: 0.8, dec: 2, on: function (v) { pss = v; x = [1, 0]; dia = 0; hist = [[1, 0]]; paint(); } });
      W.slider(row, { label: 'P(lluvia mañana | lluvia hoy)', min: 0.05, max: 0.95, step: 0.05, value: 0.4, dec: 2, on: function (v) { pll = v; x = [1, 0]; dia = 0; hist = [[1, 0]]; paint(); } });
      W.legend(host, [{ c: 3, t: 'sol' }, { c: 0, t: 'lluvia' }]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La distribución estacionaria');

  p.text('Lo que acabas de ver no es casualidad. En una cadena razonable, la distribución converge a un ' +
    'vector $\\vec{\\pi}$ que ya no cambia al aplicar otro paso:');

  p.formula('\\vec{\\pi} \\cdot P = \\vec{\\pi}, \\qquad \\sum \\pi_i = 1', 'distribución estacionaria');

  p.note('Mira esa ecuación con los ojos del tema anterior: $\\vec{\\pi}$ es un <strong>autovector de ' +
    '$P$ con autovalor 1</strong>. Toda cadena de Markov tiene ese autovalor, y el resto tienen módulo ' +
    'menor que 1: por eso las demás componentes se apagan y solo sobrevive la estacionaria. Ese es el ' +
    'motivo matemático de que el sistema olvide su origen.', 'ok', 'Es un problema de autovalores');

  p.text('Y de ahí sale una de las aplicaciones más rentables de la historia: <strong>PageRank</strong>. ' +
    'Google modeló al internauta como un paseante aleatorio que va saltando de enlace en enlace. La ' +
    'distribución estacionaria de esa cadena dice qué porcentaje del tiempo pasa en cada página, y eso ' +
    'es exactamente la «importancia» de la página.');

  p.util('La distribución estacionaria de una cadena de Markov es, literalmente, el algoritmo que hizo ' +
    'rico a Google. PageRank modela a un internauta que salta al azar de enlace en enlace, y la ' +
    'importancia de cada página es la probabilidad de encontrarlo allí a largo plazo: el vector ' +
    'estacionario de una matriz gigantesca. La misma matemática predice cuotas de mercado, ocupación ' +
    'de camas hospitalarias y el tiempo que un servidor pasa en cada estado.');

  p.section('Estados absorbentes');

  p.text('Un estado del que ya no se sale ($p_{ii} = 1$) se llama <strong>absorbente</strong>. Si la ' +
    'cadena tiene alguno accesible desde todas partes, tarde o temprano acaba ahí, y las preguntas ' +
    'interesantes cambian: ya no es «dónde estaré a la larga» sino «cuánto tardaré» y «en cuál caeré».');

  p.demo({
    title: 'La ruina del jugador',
    intro: 'Un jugador apuesta 1 € por partida hasta arruinarse o alcanzar su objetivo. Los dos extremos son estados absorbentes. Mira cómo cambia su probabilidad de éxito.',
    build: function (host, d) {
      var N = 10, k = 5, prob = 0.5;
      var out = W.readout(host, '');
      function pGana(i) {
        if (Math.abs(prob - 0.5) < 1e-9) return i / N;
        var q = (1 - prob) / prob;
        return (1 - Math.pow(q, i)) / (1 - Math.pow(q, N));
      }
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 20.5, ymin: 0, ymax: 1.05, height: 260,
        xlabel: 'capital inicial (€)', ylabel: 'P(alcanzar el objetivo)', ystep: 0.25,
        draw: function (g) {
          var pts = [];
          for (var i = 0; i <= N; i++) pts.push([i, pGana(i)]);
          g.path(pts, { color: 0, w: 2.6 });
          pts.forEach(function (q) { g.point(q[0], q[1], { color: 0, r: 3.5 }); });
          g.point(k, pGana(k), { color: 2, r: 7 });
          g.point(0, 0, { color: 1, r: 6 });
          g.point(N, 1, { color: 3, r: 6 });
          g.text(0, 0.08, 'ruina', { align: 'left', size: 11.5, color: 1 });
          g.text(N, 0.92, 'objetivo', { align: 'right', size: 11.5, color: 3 });
        }
      });
      function paint() {
        plot.view(-0.5, N + 0.5, 0, 1.05);
        out.set('Objetivo: <strong>' + N + ' €</strong> &nbsp;·&nbsp; capital actual: <strong>' + k + ' €</strong> ' +
          '&nbsp;·&nbsp; probabilidad de ganar cada partida: <strong>' + U.fmt(prob, 2) + '</strong><br>' +
          'Probabilidad de alcanzar el objetivo antes de arruinarse: <strong>' + U.fmt(pGana(k) * 100, 2) + ' %</strong><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (prob < 0.5 ? 'Con el juego en contra (como en cualquier casino real), la probabilidad se desploma ' +
            'aunque la desventaja por partida sea mínima. Esa es toda la matemática del negocio.'
            : (prob > 0.5 ? 'Con ventaja, la ruina deja de ser casi segura, pero nunca es imposible.'
              : 'Con un juego perfectamente justo, la probabilidad es exactamente la fracción del objetivo que ya tienes.')) +
          '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'objetivo (€)', min: 4, max: 20, step: 1, value: 10, dec: 0, on: function (v) { N = v; k = Math.min(k, v - 1); paint(); } });
      W.slider(row, { label: 'capital inicial (€)', min: 1, max: 19, step: 1, value: 5, dec: 0, on: function (v) { k = Math.min(v, N - 1); paint(); } });
      W.slider(row, { label: 'P(ganar una partida)', min: 0.35, max: 0.65, step: 0.01, value: 0.5, dec: 2, on: function (v) { prob = v; paint(); } });
      paint();
    }
  });

  p.hist('Andréi Márkov introdujo estas cadenas en 1906 por una razón sorprendentemente literaria: ' +
    'quería demostrarle a otro matemático que la ley de los grandes números también vale para sucesos ' +
    '<em>dependientes</em>. Para probarlo, analizó las 20 000 primeras letras de <em>Eugenio Oneguin</em> ' +
    'de Pushkin, contando con qué probabilidad una vocal sigue a una consonante. Es, literalmente, el ' +
    'primer modelo estadístico de un texto: el tatarabuelo de los modelos de lenguaje actuales.');

  /* ================= EJERCICIOS ================= */
  p.util('Un estado absorbente es aquel del que no se sale, y por eso modela finales: un cliente que se ' +
    'da de baja, una pieza que falla, un jugador arruinado. Calcular cuántos pasos se tarda en ' +
    'llegar a él responde preguntas muy concretas —cuánto durará un cliente medio, cuándo tocará ' +
    'mantenimiento— y es la base de los modelos de fiabilidad y de la llamada «ruina del jugador», ' +
    'que demuestra que apostando contra un rival con más dinero se acaba perdiendo aunque el juego ' +
    'sea justo.');

  p.section('Practica');

  p.exercise({
    title: 'Un paso de la cadena',
    level: 'basico',
    gen: function (r) {
      var pss = r.int(50, 95) / 100, pll = r.int(20, 80) / 100;
      var x0 = r.int(0, 100) / 100;
      var x = [x0, 1 - x0];
      var nx = [x[0] * pss + x[1] * (1 - pll), x[0] * (1 - pss) + x[1] * pll];
      return { pss: pss, pll: pll, x: x, nx: nx };
    },
    ask: function (d) {
      return 'En un modelo de dos estados (sol y lluvia), $P(\\text{sol}|\\text{sol}) = ' + U.fmt(d.pss, 2) +
        '$ y $P(\\text{lluvia}|\\text{lluvia}) = ' + U.fmt(d.pll, 2) + '$. Si hoy hay un $' +
        U.fmt(d.x[0] * 100, 0) + '\\%$ de probabilidad de sol, ¿cuál es la de mañana? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'P(sol mañana)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.nx[0], 6) }; },
    tol: 3e-5,
    hint: function () { return 'Hay dos caminos hasta «sol mañana»: venir de sol o venir de lluvia. Es probabilidad total.'; },
    steps: function (d) {
      return ['Camino 1: hoy sol y sigue: $' + U.fmt(d.x[0], 2) + ' \\cdot ' + U.fmt(d.pss, 2) + ' = ' + U.fmt(d.x[0] * d.pss, 5) + '$.',
        'Camino 2: hoy lluvia y cambia: $' + U.fmt(d.x[1], 2) + ' \\cdot ' + U.fmt(1 - d.pll, 2) + ' = ' + U.fmt(d.x[1] * (1 - d.pll), 5) + '$.',
        'Sumamos los dos caminos: $' + U.fmt(d.nx[0], 5) + '$.',
        'Eso es exactamente el producto $\\vec{x}_0 \\cdot P$: la primera componente del vector fila por la primera columna.'];
    },
    answer: function (d) { return U.fmt(d.nx[0], 4); }
  });

  p.exercise({
    title: 'Distribución estacionaria',
    level: 'medio',
    gen: function (r) {
      var a = r.int(10, 90) / 100;   // P(1->2)
      var b = r.int(10, 90) / 100;   // P(2->1)
      var pi1 = b / (a + b);
      return { a: a, b: b, pi1: pi1, pi2: 1 - pi1 };
    },
    ask: function (d) {
      return 'Una cadena de dos estados tiene $P = \\begin{pmatrix} ' + U.fmt(1 - d.a, 2) + ' & ' + U.fmt(d.a, 2) +
        ' \\\\ ' + U.fmt(d.b, 2) + ' & ' + U.fmt(1 - d.b, 2) + '\\end{pmatrix}$. Halla la probabilidad ' +
        'estacionaria del <strong>primer</strong> estado (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'π₁', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.pi1, 6) }; },
    tol: 3e-5,
    hint: function (d) { return 'En equilibrio, el flujo que sale de un estado iguala al que entra: $\\pi_1 \\cdot ' + U.fmt(d.a, 2) + ' = \\pi_2 \\cdot ' + U.fmt(d.b, 2) + '$.'; },
    steps: function (d) {
      return ['La condición $\\vec{\\pi}P = \\vec{\\pi}$ equivale a que el trasiego entre los dos estados se compense.',
        'Sale de 1 hacia 2: $\\pi_1 \\cdot ' + U.fmt(d.a, 2) + '$. Sale de 2 hacia 1: $\\pi_2 \\cdot ' + U.fmt(d.b, 2) + '$.',
        'Igualando y usando $\\pi_1 + \\pi_2 = 1$: $\\pi_1 = \\dfrac{' + U.fmt(d.b, 2) + '}{' + U.fmt(d.a, 2) + ' + ' + U.fmt(d.b, 2) + '}$',
        '$= ' + U.fmt(d.pi1, 5) + '$, y por tanto $\\pi_2 = ' + U.fmt(d.pi2, 5) + '$.',
        'Fíjate: la estacionaria favorece al estado del que <em>cuesta más salir</em>.'];
    },
    answer: function (d) { return 'π₁ = ' + U.fmt(d.pi1, 4) + ', π₂ = ' + U.fmt(d.pi2, 4); }
  });

  p.exercise({
    title: 'Dos pasos',
    level: 'medio',
    gen: function (r) {
      var a = r.int(10, 90) / 100, b = r.int(10, 90) / 100;
      // P = [[1-a, a],[b, 1-b]] ; queremos (P^2)_{11}
      var p11 = (1 - a) * (1 - a) + a * b;
      return { a: a, b: b, p11: p11 };
    },
    ask: function (d) {
      return 'Con $P = \\begin{pmatrix} ' + U.fmt(1 - d.a, 2) + ' & ' + U.fmt(d.a, 2) + ' \\\\ ' +
        U.fmt(d.b, 2) + ' & ' + U.fmt(1 - d.b, 2) + '\\end{pmatrix}$, ¿cuál es la probabilidad de ' +
        'estar en el estado 1 <strong>dentro de dos pasos</strong> si ahora se está en el estado 1? ' +
        '(cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.p11, 6) }; },
    tol: 3e-5,
    hint: function () { return 'Es el elemento $(1,1)$ de $P^2$: hay dos caminos, 1→1→1 y 1→2→1.'; },
    steps: function (d) {
      return ['Para llegar de 1 a 1 en dos pasos hay dos caminos posibles.',
        'Camino 1→1→1: $' + U.fmt(1 - d.a, 2) + ' \\cdot ' + U.fmt(1 - d.a, 2) + ' = ' + U.fmt((1 - d.a) * (1 - d.a), 5) + '$.',
        'Camino 1→2→1: $' + U.fmt(d.a, 2) + ' \\cdot ' + U.fmt(d.b, 2) + ' = ' + U.fmt(d.a * d.b, 5) + '$.',
        'Sumando: $' + U.fmt(d.p11, 5) + '$.',
        'Esto es exactamente el elemento $(1,1)$ del producto $P \\cdot P$: fila 1 por columna 1.'];
    },
    answer: function (d) { return U.fmt(d.p11, 4); }
  });

  p.exercise({
    title: 'Ruina del jugador',
    level: 'avanzado',
    gen: function (r) {
      var N = r.int(5, 20);
      var k = r.int(1, N - 1);
      return { N: N, k: k, prob: k / N };
    },
    ask: function (d) {
      return 'Un jugador tiene $' + d.k + '$ € y apuesta 1 € por partida en un juego <strong>justo</strong> ' +
        '(gana o pierde con probabilidad $0{,}5$). Juega hasta arruinarse o llegar a $' + d.N + '$ €. ' +
        '¿Cuál es la probabilidad de que alcance su objetivo? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.prob, 6) }; },
    tol: 3e-5,
    hint: function (d) { return 'En un juego justo la respuesta es sorprendentemente simple: la fracción del objetivo que ya se tiene.'; },
    steps: function (d) {
      return ['Los estados $0$ y $' + d.N + '$ son <strong>absorbentes</strong>: al llegar, el juego termina.',
        'Llamando $f(i)$ a la probabilidad de éxito con capital $i$, se cumple $f(i) = \\frac{1}{2}f(i-1) + \\frac{1}{2}f(i+1)$.',
        'Esa relación obliga a que $f$ sea lineal, y con $f(0)=0$ y $f(' + d.N + ')=1$ queda $f(i) = i/' + d.N + '$.',
        '$f(' + d.k + ') = \\dfrac{' + d.k + '}{' + d.N + '} = ' + U.fmt(d.prob, 5) + '$',
        'En un casino real la probabilidad de ganar cada partida es algo menor que $0{,}5$, y entonces esta ' +
        'fórmula se desploma exponencialmente: la ruina deja de ser una posibilidad y pasa a ser casi una certeza.'];
    },
    answer: function (d) { return U.fmt(d.prob, 4) + ' (' + U.fmt(d.prob * 100, 2) + ' %)'; }
  });

  p.keys([
    'Propiedad de Markov: el futuro depende solo del presente, no de la historia.',
    'La matriz de transición recoge todas las probabilidades; cada fila suma 1.',
    'Evolucionar $n$ pasos es multiplicar por $P^n$: por eso diagonalizar es tan útil aquí.',
    'La distribución estacionaria cumple $\\vec\\pi P = \\vec\\pi$: es el <strong>autovector de autovalor 1</strong>.',
    'Como los demás autovalores tienen módulo menor que 1, la cadena olvida su punto de partida.',
    'PageRank es la distribución estacionaria de un paseante aleatorio por la web.',
    'Con estados absorbentes las preguntas cambian: no «dónde acabaré» sino «en cuál» y «cuándo».'
  ]);
});
