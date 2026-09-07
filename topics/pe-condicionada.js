/* Tema: Probabilidad condicionada y Bayes */
Course.topic('pe-condicionada', function (p) {

  p.text('¿Cambia la probabilidad de algo si te dan información nueva? Casi siempre sí. La ' +
    '<strong>probabilidad condicionada</strong> $P(A|B)$ es la probabilidad de $A$ <em>sabiendo que ' +
    'ha ocurrido $B$</em>.');

  p.formula('P(A|B) = \\frac{P(A \\cap B)}{P(B)}', 'probabilidad de A condicionada a B');

  p.text('La idea es sencilla: saber que ha ocurrido $B$ <strong>reduce el espacio muestral</strong>. ' +
    'Ya no cuentan todos los casos posibles, solo los que están dentro de $B$. Por eso se divide ' +
    'entre $P(B)$: es la nueva «totalidad».');

  p.demo({
    title: 'Condicionar es reducir el mundo',
    intro: 'La caja entera son todos los casos. Al saber que ha ocurrido B, el mundo se reduce a la franja azul, y A pasa a medirse solo dentro de ella.',
    build: function (host, d) {
      var pa = 0.4, pb = 0.5;
      var condicionado = false;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.1, xmax: 1.1, ymin: -0.1, ymax: 1.1, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          if (!condicionado) {
            g.rect(0, 0, 1, 1, { color: 'axis', fill: false, w: 2 });
            g.rect(0, 0, pb, 1, { color: 1, fill: 1, fillAlpha: .22, w: 1.6 });
            g.rect(0, 1 - pa, 1, pa, { color: 0, fill: 0, fillAlpha: .22, w: 1.6 });
            g.rect(0, 1 - pa, pb, pa, { color: 2, fill: 2, fillAlpha: .4, w: 1.8 });
            g.text(pb / 2, 0.06, 'B', { align: 'center', color: 1, size: 16, bold: true });
            g.text(0.94, 1 - pa / 2, 'A', { align: 'right', color: 0, size: 16, bold: true });
            g.text(pb / 2, 1 - pa / 2, 'A∩B', { align: 'center', color: 2, size: 13 });
          } else {
            g.rect(0, 0, pb, 1, { color: 1, fill: 1, fillAlpha: .22, w: 2.4 });
            g.rect(0, 1 - pa, pb, pa, { color: 2, fill: 2, fillAlpha: .45, w: 2 });
            g.text(pb / 2, 0.06, 'nuevo mundo: solo B', { align: 'center', color: 1, size: 13 });
            g.text(pb / 2, 1 - pa / 2, 'A∩B', { align: 'center', color: 2, size: 13 });
          }
        }
      });
      function paint() {
        var inter = pa * pb;
        out.set('$P(A) = ' + U.fmt(pa, 2) + '$, &nbsp; $P(B) = ' + U.fmt(pb, 2) + '$, &nbsp; ' +
          '$P(A\\cap B) = ' + U.fmt(inter, 3) + '$<br>' +
          '$P(A|B) = \\dfrac{P(A\\cap B)}{P(B)} = \\dfrac{' + U.fmt(inter, 3) + '}{' + U.fmt(pb, 2) + '} = ' +
          U.fmt(inter / pb, 4) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Aquí $P(A|B) = P(A)$: los sucesos son ' +
          '<strong>independientes</strong>, saber que ocurrió $B$ no cambia nada sobre $A$.</span>');
        plot.render();
      }
      W.chips(host, [{ label: 'mundo completo', value: 0 }, { label: 'sabiendo que ocurrió B', value: 1 }],
        { value: 0, on: function (v) { condicionado = !!v; plot.render(); } });
      var row = W.row(host);
      W.slider(row, { label: 'P(A)', min: 0.1, max: 0.9, step: 0.05, value: 0.4, dec: 2, on: function (v) { pa = v; paint(); } });
      W.slider(row, { label: 'P(B)', min: 0.1, max: 0.9, step: 0.05, value: 0.5, dec: 2, on: function (v) { pb = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Independencia');

  p.text('Dos sucesos son <strong>independientes</strong> cuando saber que ha ocurrido uno no cambia ' +
    'la probabilidad del otro.');

  p.formulas([
    'P(A|B) = P(A)',
    'P(A \\cap B) = P(A)\\cdot P(B)'
  ], 'las dos condiciones equivalen');

  p.note('No confundas <strong>independientes</strong> con <strong>incompatibles</strong>. ' +
    'Incompatibles significa que no pueden ocurrir a la vez ($P(A\\cap B)=0$), y eso los hace ' +
    'máximamente <em>dependientes</em>: si ocurre uno, sabes con certeza que el otro no ha ocurrido. ' +
    'Son conceptos casi opuestos.', 'warn', 'Independiente ≠ incompatible');

  p.sub('Con y sin reemplazamiento');

  p.text('Si sacas una bola de una urna y <strong>la devuelves</strong>, la segunda extracción es ' +
    'independiente de la primera. Si <strong>no la devuelves</strong>, no lo es, y hay que usar ' +
    'probabilidades condicionadas. Es la distinción que más aparece en los exámenes.');

  /* ---------------------------------------------------------------- */
  p.section('Probabilidad total');

  p.text('Cuando un suceso puede llegar por varios caminos incompatibles, su probabilidad es la ' +
    '<strong>suma de todos los caminos</strong>, cada uno pesado por lo probable que es.');

  p.formula('P(B) = P(A_1)P(B|A_1) + P(A_2)P(B|A_2) + \\dots + P(A_n)P(B|A_n)');

  p.text('En un diagrama de árbol, esto es literalmente: recorres cada rama que lleva a $B$, ' +
    'multiplicas las probabilidades a lo largo del camino, y sumas los caminos.');

  p.demo({
    title: 'Diagrama de árbol',
    intro: 'Dos fábricas producen la misma pieza con distinta tasa de defectos. Mueve los mandos y sigue las ramas.',
    build: function (host, d) {
      var pf1 = 0.6, d1 = 0.02, d2 = 0.05;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 10, ymin: 0, ymax: 6, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          function rama(x1, y1, x2, y2, txt, col) {
            g.seg(x1, y1, x2, y2, { color: col, w: 2 });
            g.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.25, txt, { align: 'center', size: 11.5, color: col, box: true });
          }
          g.point(1, 3, { color: 'ink', r: 5 });
          rama(1, 3, 4, 4.6, U.fmt(pf1, 2), 0);
          rama(1, 3, 4, 1.4, U.fmt(1 - pf1, 2), 1);
          g.text(4.25, 4.6, 'Fábrica 1', { size: 13, color: 0 });
          g.text(4.25, 1.4, 'Fábrica 2', { size: 13, color: 1 });
          rama(4.1, 4.6, 7.5, 5.4, U.fmt(d1, 3), 2);
          rama(4.1, 4.6, 7.5, 3.9, U.fmt(1 - d1, 3), 'axis');
          rama(4.1, 1.4, 7.5, 2.1, U.fmt(d2, 3), 2);
          rama(4.1, 1.4, 7.5, 0.6, U.fmt(1 - d2, 3), 'axis');
          g.text(7.7, 5.4, 'defectuosa', { size: 12, color: 2 });
          g.text(7.7, 3.9, 'correcta', { size: 12, color: 'axis' });
          g.text(7.7, 2.1, 'defectuosa', { size: 12, color: 2 });
          g.text(7.7, 0.6, 'correcta', { size: 12, color: 'axis' });
        }
      });
      function paint() {
        var pd = pf1 * d1 + (1 - pf1) * d2;
        var bayes = pf1 * d1 / pd;
        out.set('$P(\\text{defectuosa}) = ' + U.fmt(pf1, 2) + '\\cdot' + U.fmt(d1, 3) + ' + ' +
          U.fmt(1 - pf1, 2) + '\\cdot' + U.fmt(d2, 3) + ' = ' + U.fmt(pd, 5) + '$<br>' +
          'Y al revés (Bayes): si una pieza <em>es</em> defectuosa, la probabilidad de que venga de la ' +
          'fábrica 1 es<br>$P(F_1|D) = \\dfrac{' + U.fmt(pf1 * d1, 5) + '}{' + U.fmt(pd, 5) + '} = ' +
          U.fmt(bayes, 4) + '$');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'producción fábrica 1', min: 0.1, max: 0.9, step: 0.05, value: 0.6, dec: 2, on: function (v) { pf1 = v; paint(); } });
      W.slider(row, { label: 'defectos fábrica 1', min: 0.005, max: 0.15, step: 0.005, value: 0.02, dec: 3, on: function (v) { d1 = v; paint(); } });
      W.slider(row, { label: 'defectos fábrica 2', min: 0.005, max: 0.15, step: 0.005, value: 0.05, dec: 3, on: function (v) { d2 = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El teorema de Bayes');
  p.text('Llegamos al resultado más útil y peor entendido de toda la probabilidad. La idea es esta: ' +
    'normalmente sabes la probabilidad del <em>efecto dada la causa</em> —«si estás enfermo, la ' +
    'prueba da positivo el 99 % de las veces»— y lo que de verdad quieres saber es la contraria, la ' +
    'de la <em>causa dado el efecto</em>: «he dado positivo, ¿estoy enfermo?». Bayes es la fórmula ' +
    'que le da la vuelta, y su conclusión desconcierta a casi todo el mundo la primera vez.');


  p.formula('P(A_i|B) = \\frac{P(A_i)\\,P(B|A_i)}{P(B)} = \\frac{P(A_i)\\,P(B|A_i)}{\\sum_j P(A_j)P(B|A_j)}');

  p.text('Bayes permite <strong>invertir el condicionamiento</strong>: si sabes $P(B|A)$, te da ' +
    '$P(A|B)$. Es «razonar hacia atrás»: observo un efecto y estimo la probabilidad de cada causa.');

  p.note('Cuidado, porque $P(A|B)$ y $P(B|A)$ <strong>no son lo mismo</strong> y confundirlos es un ' +
    'error con consecuencias reales. La probabilidad de que un test dé positivo estando enfermo puede ' +
    'ser del 99 %, y la probabilidad de estar enfermo habiendo dado positivo, del 16 %. No es magia: ' +
    'depende de cuánta gente sana hay, que son muchísimos más.', 'warn', 'La falacia del fiscal');

  p.demo({
    title: 'El test médico que engaña',
    intro: 'Un test muy fiable aplicado a una enfermedad rara produce muchos más falsos positivos que verdaderos. Mueve la prevalencia y compruébalo.',
    build: function (host, d) {
      var prev = 0.01, sens = 0.99, esp = 0.95;
      var out = W.readout(host, '');
      var host2 = U.el('div');
      host.appendChild(host2);
      function paint() {
        U.clear(host2);
        var N = 10000;
        var enfermos = N * prev;
        var vp = enfermos * sens;
        var sanos = N - enfermos;
        var fp = sanos * (1 - esp);            // falsos positivos
        W.barChart(host2, {
          labels: ['verdaderos +', 'falsos +'],
          values: [vp, fp], height: 220, color: 0, dec: 0,
          ylabel: 'personas de cada 10 000'
        });
        var ppv = vp / (vp + fp);
        out.set('De cada $10\\,000$ personas: <strong>' + U.fmt(enfermos, 0) + '</strong> enfermas y <strong>' +
          U.fmt(sanos, 0) + '</strong> sanas.<br>' +
          'Positivos verdaderos: $' + U.fmt(vp, 1) + '$ &nbsp;·&nbsp; falsos positivos: $' + U.fmt(fp, 1) + '$<br>' +
          '<strong>Si el test da positivo, la probabilidad de estar realmente enfermo es solo del ' +
          U.fmt(ppv * 100, 2) + ' %.</strong><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Y eso con un test que acierta el ' +
          U.fmt(sens * 100, 0) + ' % de los enfermos. El problema es que los sanos son tantísimos que ' +
          'incluso un porcentaje pequeño de error genera muchos positivos falsos.</span>');
      }
      var row = W.row(host);
      W.slider(row, { label: 'prevalencia de la enfermedad', min: 0.001, max: 0.3, step: 0.001, value: 0.01, dec: 3, on: function (v) { prev = v; paint(); } });
      W.slider(row, { label: 'sensibilidad', min: 0.8, max: 0.999, step: 0.005, value: 0.99, dec: 3, on: function (v) { sens = v; paint(); } });
      W.slider(row, { label: 'especificidad', min: 0.8, max: 0.999, step: 0.005, value: 0.95, dec: 3, on: function (v) { esp = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Bayes es el teorema que más malentendidos evita, y aquí se cierra el aviso que quedó abierto en ' +
    'el primer tema del curso. Imagina una prueba que acierta el 99 % de las veces para una ' +
    'enfermedad que tiene 1 persona de cada 10 000. Si das positivo, la probabilidad de estar ' +
    'enfermo no es del 99 %: es de alrededor del 1 %, porque los falsos positivos de las 9999 ' +
    'personas sanas superan con mucho a los verdaderos. Los tribunales han condenado a inocentes por ' +
    'ignorar esto, y por eso los filtros de spam, los diagnósticos médicos y los sistemas de ' +
    'detección de fraude se construyen sobre esta fórmula.');

  p.hist('Thomas Bayes era un pastor presbiteriano y su teorema se publicó en 1763, dos años después de ' +
    'su muerte, porque un amigo encontró el manuscrito entre sus papeles y lo envió a la Royal ' +
    'Society. Estuvo olvidado o directamente despreciado durante buena parte del siglo XX; se le ' +
    'acusaba de poco riguroso por incorporar creencias previas. Hoy es la base de los filtros de ' +
    'spam, del diagnóstico automático y de buena parte del aprendizaje automático.');

  p.section('Practica');

  p.exercise({
    title: 'Probabilidad condicionada',
    level: 'medio',
    gen: function (r) {
      var den = r.pick([20, 25, 50, 100]);
      var pb = r.int(4, den / 2) / den;
      var pab = r.int(1, pb * den) / den;
      return { pb: pb, pab: pab, cond: pab / pb };
    },
    ask: function (d) {
      return 'Si $P(B) = ' + U.fmt(d.pb, 4) + '$ y $P(A\\cap B) = ' + U.fmt(d.pab, 4) + '$, ' +
        'calcula $P(A|B)$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'P(A|B)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.cond, 6) }; },
    tol: 3e-4,
    hint: function () { return '$P(A|B) = \\frac{P(A\\cap B)}{P(B)}$.'; },
    steps: function (d) {
      return ['$P(A|B) = \\dfrac{P(A\\cap B)}{P(B)}$',
        '$= \\dfrac{' + U.fmt(d.pab, 4) + '}{' + U.fmt(d.pb, 4) + '} = ' + U.fmt(d.cond, 4) + '$',
        'Saber que ha ocurrido $B$ reduce el espacio muestral: ahora $B$ es el nuevo «todo».'];
    },
    answer: function (d) { return U.fmt(d.cond, 4); }
  });

  p.exercise({
    title: 'Extracción sin reemplazamiento',
    level: 'medio',
    gen: function (r) {
      var rojas = r.int(3, 9), azules = r.int(3, 9);
      var total = rojas + azules;
      return {
        rojas: rojas, azules: azules, total: total,
        prob: (rojas / total) * ((rojas - 1) / (total - 1))
      };
    },
    ask: function (d) {
      return 'Una urna tiene $' + d.rojas + '$ bolas rojas y $' + d.azules + '$ azules. Se sacan dos ' +
        'bolas <strong>sin devolver la primera</strong>. ¿Cuál es la probabilidad de que las dos sean ' +
        'rojas? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.prob, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Después de sacar una roja quedan $' + (d.rojas - 1) + '$ rojas de $' + (d.total - 1) + '$ bolas.'; },
    steps: function (d) {
      return ['Primera roja: $P = \\dfrac{' + d.rojas + '}{' + d.total + '}$.',
        'Ya sacada esa bola, quedan $' + (d.rojas - 1) + '$ rojas entre $' + (d.total - 1) + '$ bolas.',
        'Segunda roja sabiendo que la primera lo fue: $P = \\dfrac{' + (d.rojas - 1) + '}{' + (d.total - 1) + '}$.',
        '$P(\\text{dos rojas}) = \\dfrac{' + d.rojas + '}{' + d.total + '} \\cdot \\dfrac{' + (d.rojas - 1) + '}{' + (d.total - 1) + '} = ' + U.fmt(d.prob, 4) + '$',
        'Con reemplazamiento habría salido $' + U.fmt(Math.pow(d.rojas / d.total, 2), 4) + '$: los sucesos serían independientes.'];
    },
    answer: function (d) { return U.fmt(d.prob, 4); }
  });

  p.exercise({
    title: 'Probabilidad total',
    level: 'avanzado',
    gen: function (r) {
      var p1 = r.int(20, 80) / 100;
      var d1 = r.int(1, 15) / 100, d2 = r.int(1, 15) / 100;
      if (Math.abs(d1 - d2) < 0.01) return null;
      return { p1: p1, p2: 1 - p1, d1: d1, d2: d2, total: p1 * d1 + (1 - p1) * d2 };
    },
    ask: function (d) {
      return 'Dos máquinas fabrican tornillos. La primera produce el $' + U.fmt(d.p1 * 100, 0) +
        '\\%$ del total y tiene un $' + U.fmt(d.d1 * 100, 0) + '\\%$ de piezas defectuosas; la segunda ' +
        'produce el resto con un $' + U.fmt(d.d2 * 100, 0) + '\\%$ de defectuosas. Si se coge un ' +
        'tornillo al azar, ¿cuál es la probabilidad de que sea defectuoso? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.total, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Hay dos caminos hasta «defectuoso». Multiplica a lo largo de cada rama y suma las ramas.'; },
    steps: function (d) {
      return ['Camino 1: viene de la máquina 1 <em>y</em> es defectuoso: $' + U.fmt(d.p1, 2) + ' \\cdot ' +
        U.fmt(d.d1, 2) + ' = ' + U.fmt(d.p1 * d.d1, 5) + '$.',
        'Camino 2: viene de la máquina 2 <em>y</em> es defectuoso: $' + U.fmt(d.p2, 2) + ' \\cdot ' +
        U.fmt(d.d2, 2) + ' = ' + U.fmt(d.p2 * d.d2, 5) + '$.',
        'Los dos caminos son incompatibles, así que se suman:',
        '$P(D) = ' + U.fmt(d.total, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.total, 4); }
  });

  p.exercise({
    title: 'Teorema de Bayes',
    level: 'avanzado',
    gen: function (r) {
      var p1 = r.int(30, 70) / 100;
      var d1 = r.int(1, 12) / 100, d2 = r.int(1, 12) / 100;
      if (Math.abs(d1 - d2) < 0.01) return null;
      var total = p1 * d1 + (1 - p1) * d2;
      return { p1: p1, d1: d1, d2: d2, total: total, bayes: p1 * d1 / total };
    },
    ask: function (d) {
      return 'La máquina 1 produce el $' + U.fmt(d.p1 * 100, 0) + '\\%$ de las piezas con un $' +
        U.fmt(d.d1 * 100, 0) + '\\%$ de defectos; la máquina 2, el resto con un $' +
        U.fmt(d.d2 * 100, 0) + '\\%$. Se coge una pieza y <strong>resulta defectuosa</strong>. ' +
        '¿Cuál es la probabilidad de que la haya fabricado la máquina 1? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.bayes, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Numerador: la rama que va por la máquina 1 y acaba en defectuosa. Denominador: la probabilidad total de defectuosa, que vale $' + U.fmt(d.total, 5) + '$.'; },
    steps: function (d) {
      return ['Nos dan el efecto (es defectuosa) y preguntan por la causa (qué máquina): es Bayes.',
        'Numerador: $P(M_1)\\cdot P(D|M_1) = ' + U.fmt(d.p1, 2) + ' \\cdot ' + U.fmt(d.d1, 2) + ' = ' + U.fmt(d.p1 * d.d1, 5) + '$.',
        'Denominador (probabilidad total de defectuosa): $' + U.fmt(d.total, 5) + '$.',
        '$P(M_1|D) = \\dfrac{' + U.fmt(d.p1 * d.d1, 5) + '}{' + U.fmt(d.total, 5) + '} = ' + U.fmt(d.bayes, 4) + '$',
        'Fíjate en que esto es muy distinto de $P(D|M_1) = ' + U.fmt(d.d1, 2) + '$: invertir el condicionamiento cambia el resultado.'];
    },
    answer: function (d) { return U.fmt(d.bayes, 4); }
  });

  p.keys([
    '$P(A|B) = \\frac{P(A\\cap B)}{P(B)}$: condicionar es reducir el espacio muestral a $B$.',
    'Independientes: $P(A\\cap B) = P(A)P(B)$. <strong>No</strong> es lo mismo que incompatibles.',
    'Sin reemplazamiento las extracciones dependen unas de otras; con reemplazamiento, no.',
    'Probabilidad total: sumar todos los caminos del árbol, multiplicando a lo largo de cada rama.',
    'Bayes invierte el condicionamiento: del efecto a la causa.',
    '$P(A|B) \\ne P(B|A)$. Confundirlos lleva a conclusiones gravemente equivocadas.'
  ]);
});
