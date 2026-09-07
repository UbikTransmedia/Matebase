/* Tema: Identidades y ecuaciones trigonométricas */
Course.topic('tr-identidades', function (p) {

  p.text('Ya sabes calcular las razones de un ángulo. La pregunta ahora es: si conoces las de ' +
    '$\\alpha$ y las de $\\beta$, ¿puedes obtener las de $\\alpha+\\beta$? La respuesta es que sí, ' +
    'pero <strong>no como uno esperaría</strong>.');

  p.note('$\\operatorname{sen}(\\alpha+\\beta) \\ne \\operatorname{sen}\\alpha + \\operatorname{sen}\\beta$. ' +
    'Compruébalo: $\\operatorname{sen}(30^\\circ+60^\\circ) = \\operatorname{sen} 90^\\circ = 1$, pero ' +
    '$\\operatorname{sen}30^\\circ + \\operatorname{sen}60^\\circ = 0{,}5 + 0{,}866 = 1{,}366$. El seno ' +
    'no reparte sobre la suma.', 'warn', 'El error que hay que matar primero');

  p.section('Fórmulas de adición');

  p.formulas([
    '\\operatorname{sen}(\\alpha \\pm \\beta) = \\operatorname{sen}\\alpha\\cos\\beta \\pm \\cos\\alpha\\operatorname{sen}\\beta',
    '\\cos(\\alpha \\pm \\beta) = \\cos\\alpha\\cos\\beta \\mp \\operatorname{sen}\\alpha\\operatorname{sen}\\beta',
    '\\operatorname{tg}(\\alpha \\pm \\beta) = \\frac{\\operatorname{tg}\\alpha \\pm \\operatorname{tg}\\beta}{1 \\mp \\operatorname{tg}\\alpha\\operatorname{tg}\\beta}'
  ], 'suma y diferencia de ángulos');

  p.text('Fíjate en el detalle traicionero: en el coseno los signos van <strong>al revés</strong> ' +
    '(suma de ángulos → resta de productos). Es el fallo más habitual del tema.');

  p.demo({
    title: 'Comprobar la fórmula de adición',
    intro: 'Mueve los dos ángulos y compara: la fórmula da siempre el valor correcto, mientras que «sumar los senos» casi nunca acierta.',
    build: function (host, d) {
      var a = 30, b = 45;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.4, xmax: 1.4, ymin: -1.3, ymax: 1.3, height: 300,
        grid: false,
        draw: function (g) {
          var ra = a * Math.PI / 180, rb = b * Math.PI / 180;
          g.circle(0, 0, 1, { color: 'axis', w: 1.6, stroke: true });
          g.arc(0, 0, 0.32, 0, ra, { color: 0, w: 2.2, fill: 0, fillAlpha: .2 });
          g.arc(0, 0, 0.48, ra, ra + rb, { color: 1, w: 2.2, fill: 1, fillAlpha: .2 });
          g.seg(0, 0, Math.cos(ra), Math.sin(ra), { color: 0, w: 2 });
          g.seg(0, 0, Math.cos(ra + rb), Math.sin(ra + rb), { color: 2, w: 2.6 });
          g.seg(Math.cos(ra + rb), 0, Math.cos(ra + rb), Math.sin(ra + rb), { color: 2, w: 2, dash: true });
          g.point(Math.cos(ra + rb), Math.sin(ra + rb), { color: 2, r: 5 });
        }
      });
      function paint() {
        var ra = a * Math.PI / 180, rb = b * Math.PI / 180;
        var real = Math.sin(ra + rb);
        var formula = Math.sin(ra) * Math.cos(rb) + Math.cos(ra) * Math.sin(rb);
        var malo = Math.sin(ra) + Math.sin(rb);
        out.set('$\\operatorname{sen}(' + a + '^\\circ + ' + b + '^\\circ) = \\operatorname{sen} ' + (a + b) + '^\\circ = ' + U.fmt(real, 6) + '$<br>' +
          '<span style="color:var(--ok)">Con la fórmula: $\\operatorname{sen}\\alpha\\cos\\beta + \\cos\\alpha\\operatorname{sen}\\beta = ' +
          U.fmt(formula, 6) + '$ ✓</span><br>' +
          '<span style="color:var(--bad)">Sumando los senos: $' + U.fmt(malo, 6) + '$ ' +
          (Math.abs(malo - real) < 1e-9 ? '(aquí coincide por casualidad)' : '✗ — se equivoca en ' + U.fmt(Math.abs(malo - real), 4)) + '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'α', min: 0, max: 90, step: 5, value: a, dec: 0, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'β', min: 0, max: 90, step: 5, value: b, dec: 0, on: function (v) { b = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Estas fórmulas son las que permiten a un móvil separar conversaciones. Cuando dos señales de ' +
    'distinta frecuencia se multiplican, las fórmulas de adición las convierten en suma y diferencia ' +
    'de frecuencias, y ese es literalmente el mecanismo con el que una radio sintoniza una emisora y ' +
    'descarta las demás. Se llama modulación, y sin ella no habría radio, ni televisión, ni ' +
    'telefonía móvil.');

  p.section('Ángulo doble y ángulo mitad');

  p.text('Salen de las anteriores haciendo $\\beta = \\alpha$. No hay nada nuevo que memorizar: si ' +
    'te acuerdas de las de adición, estas las deduces en diez segundos.');

  p.formulas([
    '\\operatorname{sen} 2\\alpha = 2\\operatorname{sen}\\alpha\\cos\\alpha',
    '\\cos 2\\alpha = \\cos^2\\alpha - \\operatorname{sen}^2\\alpha = 1 - 2\\operatorname{sen}^2\\alpha = 2\\cos^2\\alpha - 1',
    '\\operatorname{sen}\\frac{\\alpha}{2} = \\pm\\sqrt{\\frac{1-\\cos\\alpha}{2}} \\qquad \\cos\\frac{\\alpha}{2} = \\pm\\sqrt{\\frac{1+\\cos\\alpha}{2}}'
  ]);

  p.text('Las tres versiones del coseno del ángulo doble se obtienen sustituyendo la relación ' +
    'fundamental. Cada una es útil en un contexto distinto: la segunda y la tercera son las que ' +
    'permiten «bajar el cuadrado» al integrar, algo que agradecerás en el bloque de análisis.');

  /* ---------------------------------------------------------------- */
  p.section('Ecuaciones trigonométricas');

  p.text('Resolver $\\operatorname{sen} x = \\frac{1}{2}$ no es como resolver $2x = 1$. Aquí hay ' +
    '<strong>infinitas soluciones</strong>, porque las funciones trigonométricas son periódicas.');

  p.list([
    'Se busca primero la solución del <strong>primer cuadrante</strong>.',
    'Se localiza la <strong>otra</strong> solución de la vuelta usando las simetrías. Para el seno, $180^\\circ - \\alpha$; para el coseno, $360^\\circ - \\alpha$.',
    'Se añade la periodicidad: $+360^\\circ k$ (y para la tangente, $+180^\\circ k$).'
  ], true);

  p.formula('\\operatorname{sen} x = \\tfrac{1}{2} \\Rightarrow x = 30^\\circ + 360^\\circ k \\ \\text{ o } \\ x = 150^\\circ + 360^\\circ k');

  p.text('Cuando la ecuación mezcla senos y cosenos, la estrategia es <strong>dejar una sola razón</strong>: ' +
    'se usa la relación fundamental o las fórmulas del ángulo doble hasta que todo esté en función de ' +
    'la misma, y entonces suele quedar una ecuación de segundo grado.');

  p.demo({
    title: 'Todas las soluciones de una ecuación',
    intro: 'Mueve el valor del seno y verás dónde corta la recta horizontal a la onda: cada corte es una solución.',
    build: function (host, d) {
      var k = 0.5;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -30, xmax: 750, ymin: -1.4, ymax: 1.4, height: 280,
        xstep: 90, ystep: 0.5, xlabel: 'grados',
        draw: function (g) {
          g.fn(function (x) { return Math.sin(x * Math.PI / 180); }, { color: 0, w: 2.6 });
          g.hline(k, { color: 2, w: 2, dash: true });
          if (Math.abs(k) <= 1) {
            var base = Math.asin(k) * 180 / Math.PI;
            var sols = [];
            for (var n = -1; n <= 2; n++) {
              sols.push(base + 360 * n, 180 - base + 360 * n);
            }
            sols.forEach(function (s) {
              if (s > -30 && s < 750) g.point(s, k, { color: 2, r: 5 });
            });
          }
        }
      });
      function paint() {
        if (Math.abs(k) > 1) {
          out.set('$\\operatorname{sen} x = ' + U.fmt(k, 2) + '$ &nbsp;→&nbsp; ' +
            '<strong style="color:var(--bad)">no tiene solución</strong>: el seno nunca sale del intervalo $[-1, 1]$.');
        } else {
          var base = Math.asin(k) * 180 / Math.PI;
          out.set('$\\operatorname{sen} x = ' + U.fmt(k, 2) + '$<br>' +
            'Soluciones: $x = ' + U.fmt(base, 2) + '^\\circ + 360^\\circ k$ &nbsp;o&nbsp; ' +
            '$x = ' + U.fmt(180 - base, 2) + '^\\circ + 360^\\circ k$<br>' +
            '<span style="font-size:12.5px;color:var(--ink-faint)">Dos por cada vuelta, infinitas en total.</span>');
        }
        plot.render();
      }
      W.slider(W.row(host), { label: 'valor del seno', min: -1.3, max: 1.3, step: 0.05, value: k, dec: 2, on: function (v) { k = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Que estas ecuaciones tengan infinitas soluciones no es una molestia, es lo que las hace útiles: ' +
    'describen cosas que se repiten. ¿A qué horas del año amanece antes de las siete? ¿Cuándo vuelve ' +
    'a haber marea alta? ¿En qué instantes la corriente alterna pasa por cero? Todas esas preguntas ' +
    'tienen infinitas respuestas separadas por un periodo, y lo que se busca en la práctica son las ' +
    'que caen dentro de un intervalo concreto.');

  p.section('Practica');

  p.exercise({
    title: 'Fórmula de adición',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([30, 45, 60]), b = r.pick([30, 45, 60]);
      var cual = r.bool();
      var op = r.bool() ? 1 : -1;
      var ang = (a + op * b) * Math.PI / 180;
      return { a: a, b: b, op: op, cual: cual, val: cual ? Math.sin(ang) : Math.cos(ang) };
    },
    ask: function (d) {
      var f = d.cual ? '\\operatorname{sen}' : '\\cos';
      return 'Usando las fórmulas de adición, calcula $' + f + '(' + d.a + '^\\circ ' +
        (d.op > 0 ? '+' : '-') + ' ' + d.b + '^\\circ)$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-4,
    hint: function (d) {
      return d.cual ? '$\\operatorname{sen}(\\alpha\\pm\\beta) = \\operatorname{sen}\\alpha\\cos\\beta \\pm \\cos\\alpha\\operatorname{sen}\\beta$'
        : '$\\cos(\\alpha\\pm\\beta) = \\cos\\alpha\\cos\\beta \\mp \\operatorname{sen}\\alpha\\operatorname{sen}\\beta$ — ojo, los signos se invierten.';
    },
    steps: function (d) {
      var ra = d.a * Math.PI / 180, rb = d.b * Math.PI / 180;
      if (d.cual) {
        return ['$\\operatorname{sen}\\alpha\\cos\\beta ' + (d.op > 0 ? '+' : '-') + ' \\cos\\alpha\\operatorname{sen}\\beta$',
          '$= ' + U.fmt(Math.sin(ra), 4) + ' \\cdot ' + U.fmt(Math.cos(rb), 4) + ' ' + (d.op > 0 ? '+' : '-') +
          ' ' + U.fmt(Math.cos(ra), 4) + ' \\cdot ' + U.fmt(Math.sin(rb), 4) + '$',
          '$= ' + U.fmt(d.val, 4) + '$',
          'Comprobación directa: $\\operatorname{sen} ' + (d.a + d.op * d.b) + '^\\circ = ' + U.fmt(d.val, 4) + '$ ✓'];
      }
      return ['$\\cos\\alpha\\cos\\beta ' + (d.op > 0 ? '-' : '+') + ' \\operatorname{sen}\\alpha\\operatorname{sen}\\beta$ ' +
        '<em>(fíjate en el cambio de signo)</em>',
        '$= ' + U.fmt(Math.cos(ra), 4) + ' \\cdot ' + U.fmt(Math.cos(rb), 4) + ' ' + (d.op > 0 ? '-' : '+') +
        ' ' + U.fmt(Math.sin(ra), 4) + ' \\cdot ' + U.fmt(Math.sin(rb), 4) + '$',
        '$= ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Ángulo doble',
    level: 'medio',
    gen: function (r) {
      var pares = [[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17]];
      var pr = r.pick(pares);
      var s = pr[0] / pr[1], c = Math.sqrt(1 - s * s);
      var cual = r.bool();
      return { num: pr[0], den: pr[1], s: s, c: c, cual: cual, val: cual ? 2 * s * c : c * c - s * s };
    },
    ask: function (d) {
      return 'Si $\\operatorname{sen}\\alpha = \\dfrac{' + d.num + '}{' + d.den + '}$ y $\\alpha$ es ' +
        'agudo, calcula $' + (d.cual ? '\\operatorname{sen}' : '\\cos') + ' 2\\alpha$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Primero saca $\\cos\\alpha$ con la relación fundamental. Después usa $' +
        (d.cual ? '\\operatorname{sen}2\\alpha = 2\\operatorname{sen}\\alpha\\cos\\alpha' : '\\cos2\\alpha = \\cos^2\\alpha - \\operatorname{sen}^2\\alpha') + '$.';
    },
    steps: function (d) {
      return ['$\\cos\\alpha = \\sqrt{1 - \\left(\\frac{' + d.num + '}{' + d.den + '}\\right)^2} = ' + U.fmt(d.c, 4) + '$ (positivo porque $\\alpha$ es agudo).',
        d.cual
          ? '$\\operatorname{sen}2\\alpha = 2 \\cdot ' + U.fmt(d.s, 4) + ' \\cdot ' + U.fmt(d.c, 4) + ' = ' + U.fmt(d.val, 4) + '$'
          : '$\\cos2\\alpha = ' + U.fmt(d.c, 4) + '^2 - ' + U.fmt(d.s, 4) + '^2 = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Ecuación trigonométrica sencilla',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { v: 0.5, s1: 30, s2: 150 }, { v: -0.5, s1: 210, s2: 330 },
        { v: Math.SQRT1_2, s1: 45, s2: 135 }, { v: Math.sqrt(3) / 2, s1: 60, s2: 120 },
        { v: 1, s1: 90, s2: 90 }, { v: 0, s1: 0, s2: 180 }
      ];
      var c = r.pick(casos);
      return { v: c.v, s1: Math.min(c.s1, c.s2), s2: Math.max(c.s1, c.s2) };
    },
    ask: function (d) {
      return 'Resuelve $\\operatorname{sen} x = ' + U.fmt(d.v, 4) + '$ en el intervalo ' +
        '$[0^\\circ, 360^\\circ)$. Da las dos soluciones en grados (si solo hay una, repítela).';
    },
    fields: [{ name: 'a', label: 'Menor (°)', w: 'tiny' }, { name: 'b', label: 'Mayor (°)', w: 'tiny' }],
    sol: function (d) { return { a: d.s1, b: d.s2 }; },
    tol: 1e-6,
    hint: function () { return 'Busca la solución del primer cuadrante y usa la simetría del seno: la otra es $180^\\circ - \\alpha$.'; },
    steps: function (d) {
      return ['Buscamos los ángulos cuyo seno vale $' + U.fmt(d.v, 4) + '$.',
        'El seno es la altura del punto en la circunferencia: hay dos posiciones con la misma altura.',
        'Soluciones en una vuelta: $x = ' + d.s1 + '^\\circ$ y $x = ' + d.s2 + '^\\circ$.',
        'En general habría que añadir $+360^\\circ k$, pero aquí solo pedimos la primera vuelta.'];
    },
    answer: function (d) { return d.s1 + '° y ' + d.s2 + '°'; }
  });

  p.exercise({
    title: 'Ecuación con cambio a una sola razón',
    level: 'avanzado',
    gen: function (r) {
      // 2 sen^2 x + k cos x - m = 0  ->  usando sen^2 = 1 - cos^2
      var casos = [
        { txt: '2\\operatorname{sen}^2 x + 3\\cos x - 3 = 0', sols: [0, 60, 300], cos: [1, 0.5] },
        { txt: '2\\cos^2 x + \\operatorname{sen} x - 1 = 0', sols: [210, 330], cos: null },
        { txt: '\\cos 2x + \\cos x = 0', sols: [60, 180, 300], cos: null }
      ];
      var c = r.pick(casos);
      return { txt: c.txt, sols: c.sols, menor: Math.min.apply(null, c.sols) };
    },
    ask: function (d) {
      return 'Resuelve $' + d.txt + '$ en $[0^\\circ, 360^\\circ)$ y escribe la ' +
        '<strong>menor</strong> de las soluciones (en grados).';
    },
    fields: [{ name: 'v', label: 'Solución menor (°)', w: 'tiny' }],
    sol: function (d) { return { v: d.menor }; },
    hint: function () { return 'Usa $\\operatorname{sen}^2 x + \\cos^2 x = 1$ (o la fórmula del ángulo doble) para dejar todo en una sola razón; queda una ecuación de segundo grado.'; },
    steps: function (d) {
      return ['La ecuación mezcla dos razones distintas, así que primero hay que unificarlas.',
        'Con la relación fundamental (o el ángulo doble) todo queda en función de una sola.',
        'Sale una ecuación de segundo grado en esa razón; se resuelve normalmente.',
        'Después se deshace el cambio buscando <em>todos</em> los ángulos de la vuelta con ese valor.',
        'Soluciones: $' + d.sols.join('^\\circ$, $') + '^\\circ$. La menor es $' + d.menor + '^\\circ$.'];
    },
    answer: function (d) { return d.sols.join('°, ') + '°'; }
  });

  p.keys([
    'El seno y el coseno <strong>no reparten</strong> sobre la suma de ángulos.',
    '$\\operatorname{sen}(\\alpha\\pm\\beta) = \\operatorname{sen}\\alpha\\cos\\beta \\pm \\cos\\alpha\\operatorname{sen}\\beta$.',
    '$\\cos(\\alpha\\pm\\beta) = \\cos\\alpha\\cos\\beta \\mp \\operatorname{sen}\\alpha\\operatorname{sen}\\beta$: los signos se invierten.',
    'Ángulo doble: se deduce haciendo $\\beta=\\alpha$. No hay que memorizarlo aparte.',
    'Las ecuaciones trigonométricas tienen infinitas soluciones: hay que añadir la periodicidad.',
    'Si mezcla razones distintas, el primer paso es siempre dejar una sola.'
  ]);
});
