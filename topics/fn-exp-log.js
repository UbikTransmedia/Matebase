/* Tema: Funciones exponenciales y logarítmicas */
Course.topic('fn-exp-log', function (p) {

  p.text('En una función <em>polinómica</em> la variable está en la base. En una ' +
    '<strong>exponencial</strong> está en el <strong>exponente</strong>, y eso cambia radicalmente ' +
    'la velocidad a la que crece.');

  p.formula('f(x) = a^x \\qquad (a > 0,\\ a \\ne 1)');

  p.list([
    'Si $a > 1$: <strong>crece</strong>, y cada vez más deprisa.',
    'Si $0 < a < 1$: <strong>decrece</strong> acercándose a cero.',
    'Siempre pasa por $(0, 1)$, porque $a^0 = 1$.',
    'Siempre es positiva: nunca corta al eje X. El eje X es su asíntota horizontal.'
  ]);

  p.note('La diferencia entre crecimiento lineal y exponencial es la más difícil de intuir y la más ' +
    'importante de entender. Un folio doblado 42 veces —si se pudiera— llegaría a la Luna. Un interés ' +
    'del 7 % duplica el capital cada diez años. Una epidemia que crece un 30 % diario multiplica por ' +
    'mil en un mes. Nuestra intuición es lineal, y por eso el crecimiento exponencial siempre nos ' +
    'pilla por sorpresa.', 'warn', 'Por qué esto importa tanto');

  p.demo({
    title: 'Lineal contra exponencial',
    intro: 'Compara una recta empinada con una exponencial suave. Aleja la vista y verás que la exponencial siempre acaba ganando, por mucha ventaja que le des a la recta.',
    build: function (host, d) {
      var m = 20, a = 1.3, zoom = 10;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 10, ymin: 0, ymax: 200, height: 300,
        draw: function (g) {
          g.fn(function (x) { return m * x; }, { color: 3, w: 2.4, dash: true });
          g.fn(function (x) { return Math.pow(a, x); }, { color: 0, w: 2.8 });
        }
      });
      function paint() {
        var top = Math.max(m * zoom, Math.pow(a, zoom)) * 1.1;
        plot.view(0, zoom, 0, top);
        // instante del sorpasso
        var cruce = null;
        for (var x = 0.1; x < 500; x += 0.1) {
          if (Math.pow(a, x) > m * x) { cruce = x; break; }
        }
        out.set('Recta: $y = ' + m + 'x$ &nbsp;·&nbsp; Exponencial: $y = ' + U.fmt(a, 2) + '^x$<br>' +
          'En $x = ' + zoom + '$: recta $= ' + U.fmt(m * zoom, 1) + '$, exponencial $= ' +
          U.fmt(Math.pow(a, zoom), 1) + '$<br>' +
          (cruce ? '<span style="font-size:12.5px;color:var(--ink-faint)">La exponencial adelanta ' +
            'definitivamente a la recta a partir de $x \\approx ' + U.fmt(cruce, 1) + '$.</span>' : ''));
      }
      var row = W.row(host);
      W.slider(row, { label: 'pendiente de la recta', min: 1, max: 100, step: 1, value: 20, dec: 0, on: function (v) { m = v; paint(); } });
      W.slider(row, { label: 'base a', min: 1.05, max: 2, step: 0.05, value: 1.3, dec: 2, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'alejar la vista', min: 5, max: 60, step: 1, value: 10, dec: 0, on: function (v) { zoom = v; paint(); } });
      W.legend(host, [{ c: 3, t: 'lineal' }, { c: 0, t: 'exponencial' }]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El número e');

  p.text('Entre todas las bases posibles hay una especial. Aparece al preguntarse qué pasa si un ' +
    'interés del 100 % anual se reparte en infinitos plazos infinitamente pequeños:');

  p.formula('e = \\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^n \\approx 2{,}718281828\\dots');

  p.text('El resultado no se dispara al infinito: converge a $e$. Esta base es la «natural» porque ' +
    'la función $e^x$ tiene una propiedad única que verás en derivadas: <strong>es su propia ' +
    'derivada</strong>. Por eso aparece en todo fenómeno de crecimiento o decaimiento continuo.');

  p.demo({
    title: 'De dónde sale e',
    intro: 'Reparte el interés anual del 100 % en más y más plazos. El capital final no crece sin límite: se acerca a e.',
    build: function (host, d) {
      var n = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 52, ymin: 1.8, ymax: 2.9, height: 260,
        xlabel: 'número de plazos', ylabel: null,
        draw: function (g) {
          g.hline(Math.E, { color: 2, w: 2, dash: true });
          g.text(48, Math.E + 0.06, 'e', { color: 2, size: 15, italic: true });
          var pts = [];
          for (var k = 1; k <= 50; k++) pts.push([k, Math.pow(1 + 1 / k, k)]);
          g.path(pts, { color: 0, w: 2 });
          pts.forEach(function (q) { if (q[0] <= n) g.point(q[0], q[1], { color: 0, r: 3 }); });
          if (n <= 50) g.point(n, Math.pow(1 + 1 / n, n), { color: 1, r: 6 });
        }
      });
      function paint() {
        var v = Math.pow(1 + 1 / n, n);
        var nom = { 1: 'una vez al año', 2: 'cada 6 meses', 4: 'cada trimestre', 12: 'cada mes', 365: 'cada día' }[n];
        out.set('Con $' + n + '$ ' + U.plural(n, 'plazo', 'plazos') + (nom ? ' (' + nom + ')' : '') + ': ' +
          '$\\left(1 + \\dfrac{1}{' + n + '}\\right)^{' + n + '} = ' + U.fmt(v, 8) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Diferencia con $e$: $' +
          U.fmt(Math.E - v, 8) + '$. Por muchos plazos que pongas, nunca pasa de $e$.</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'plazos al año', min: 1, max: 50, step: 1, value: 1, dec: 0, on: function (v) { n = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La función logarítmica');

  p.text('Es la <strong>inversa</strong> de la exponencial: deshace lo que aquella hace. Su gráfica es ' +
    'la de la exponencial reflejada en la recta $y = x$.');

  p.formula('f(x) = \\log_a x \\qquad \\operatorname{Dom} f = (0, +\\infty)');

  p.list([
    'Solo existe para $x > 0$: no hay logaritmo de números negativos ni de cero.',
    'Pasa siempre por $(1, 0)$, porque $\\log_a 1 = 0$.',
    'Tiene una asíntota <strong>vertical</strong> en $x = 0$.',
    'Crece muy despacio: para que $\\log_{10} x$ llegue a 6 hace falta que $x$ llegue al millón.'
  ]);

  p.text('Ese crecimiento lentísimo es justo lo que la hace útil: convierte cantidades enormes en ' +
    'números manejables. Por eso son logarítmicas las escalas de Richter (terremotos), de decibelios ' +
    '(sonido) y de pH (acidez): en las tres, subir un punto significa multiplicar por diez.');

  /* ---------------------------------------------------------------- */
  p.section('Modelos de crecimiento y decaimiento');

  p.formulas([
    'N(t) = N_0\\,e^{kt} \\quad (k>0: \\text{crecimiento})',
    'N(t) = N_0\\,e^{-kt} \\quad (k>0: \\text{decaimiento})',
    't_{1/2} = \\frac{\\ln 2}{k} \\quad \\text{(semivida)}'
  ]);

  p.text('El decaimiento radiactivo, el enfriamiento de un café, la eliminación de un medicamento en ' +
    'sangre y la descarga de un condensador siguen todos la misma ecuación. Es uno de los patrones ' +
    'más repetidos de la naturaleza, y en el bloque avanzado verás por qué: todos vienen de la misma ' +
    'ecuación diferencial.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Valor de una exponencial',
    level: 'basico',
    gen: function (r) {
      var a = r.pick([2, 3, 5, 10, 0.5]);
      var k = r.int(1, 4), x = r.pm(0, 3);
      return { a: a, k: k, x: x, val: k * Math.pow(a, x) };
    },
    ask: function (d) {
      return 'Si $f(x) = ' + d.k + '\\cdot ' + U.fmt(d.a, 1) + '^x$, calcula $f(' + d.x + ')$ ' +
        '(cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'f(' + d.x + ') =', w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return d.x < 0 ? 'Exponente negativo: $a^{-n} = 1/a^n$.' : 'Eleva la base al exponente y multiplica por el coeficiente.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.a, 1) + '^{' + d.x + '} = ' + U.fmt(Math.pow(d.a, d.x), 6) + '$',
        'Multiplicamos por $' + d.k + '$: $' + U.fmt(d.val, 6) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Propiedades de los logaritmos',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([2, 3, 5, 10]);
      var m = r.int(1, 4), n = r.int(1, 4);
      var t = r.int(0, 2);
      if (t === 0) return { a: a, m: m, n: n, t: 0, val: m + n };            // log(a^m · a^n)
      if (t === 1) return { a: a, m: m, n: n, t: 1, val: m - n };            // log(a^m / a^n)
      return { a: a, m: m, n: n, t: 2, val: m * n };                          // log((a^m)^n)
    },
    ask: function (d) {
      var A = Math.pow(d.a, d.m), B = Math.pow(d.a, d.n);
      var e = [
        '\\log_{' + d.a + '}\\left(' + A + ' \\cdot ' + B + '\\right)',
        '\\log_{' + d.a + '}\\dfrac{' + A + '}{' + B + '}',
        '\\log_{' + d.a + '}\\left(' + A + '^{' + d.n + '}\\right)'
      ][d.t];
      return 'Calcula $' + e + '$ usando las propiedades de los logaritmos.';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return ['$\\log(xy) = \\log x + \\log y$', '$\\log\\frac{x}{y} = \\log x - \\log y$',
        '$\\log x^n = n\\log x$'][d.t];
    },
    steps: function (d) {
      var A = Math.pow(d.a, d.m), B = Math.pow(d.a, d.n);
      return ['$\\log_{' + d.a + '} ' + A + ' = ' + d.m + '$ y $\\log_{' + d.a + '} ' + B + ' = ' + d.n + '$.',
        ['El logaritmo de un producto es la suma: $' + d.m + ' + ' + d.n + '$.',
          'El logaritmo de un cociente es la resta: $' + d.m + ' - ' + d.n + '$.',
          'El exponente baja multiplicando: $' + d.n + ' \\cdot ' + d.m + '$.'][d.t],
        'Resultado: $' + d.val + '$'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Crecimiento exponencial',
    level: 'medio',
    gen: function (r) {
      var N0 = r.int(1, 20) * 100;
      var pct = r.pick([2, 3, 5, 8, 10, 15, 20]);
      var t = r.int(2, 25);
      return { N0: N0, pct: pct, t: t, val: N0 * Math.pow(1 + pct / 100, t) };
    },
    ask: function (d) {
      return 'Una población de $' + U.miles(d.N0) + '$ individuos crece un $' + d.pct +
        '\\%$ cada año. ¿Cuántos habrá al cabo de $' + d.t + '$ años? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Población', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-6,
    hint: function (d) { return 'Cada año se multiplica por $' + U.fmt(1 + d.pct / 100, 2) + '$, y eso $' + d.t + '$ veces.'; },
    steps: function (d) {
      return ['Modelo: $N(t) = N_0\\,(1+r)^t$ con $r = ' + U.fmt(d.pct / 100, 2) + '$.',
        '$N(' + d.t + ') = ' + d.N0 + ' \\cdot ' + U.fmt(1 + d.pct / 100, 2) + '^{' + d.t + '}$',
        '$= ' + U.fmt(d.val, 4) + '$',
        'Se ha multiplicado por $' + U.fmt(d.val / d.N0, 3) + '$ en $' + d.t + '$ años.'];
    },
    answer: function (d) { return U.fmt(d.val, 2); }
  });

  p.exercise({
    title: 'Semivida y decaimiento',
    level: 'avanzado',
    gen: function (r) {
      var semi = r.pick([2, 5, 8, 10, 12, 20, 30]);
      var N0 = r.int(1, 20) * 50;
      var t = semi * r.int(1, 4);
      return { semi: semi, N0: N0, t: t, val: N0 * Math.pow(0.5, t / semi) };
    },
    ask: function (d) {
      return 'Una sustancia radiactiva tiene una semivida de $' + d.semi + '$ años (cada $' + d.semi +
        '$ años queda la mitad). Si partimos de $' + d.N0 + '$ gramos, ¿cuántos quedarán al cabo de $' +
        d.t + '$ años? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Gramos', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Han pasado $' + (d.t / d.semi) + '$ semividas: hay que dividir entre 2 esas veces.'; },
    steps: function (d) {
      var k = d.t / d.semi;
      return ['Número de semividas transcurridas: $' + d.t + ' : ' + d.semi + ' = ' + k + '$.',
        'Cada una divide la cantidad entre 2: $N = ' + d.N0 + ' \\cdot \\left(\\frac{1}{2}\\right)^{' + k + '}$',
        '$= ' + d.N0 + ' \\cdot ' + U.fmt(Math.pow(0.5, k), 6) + ' = ' + U.fmt(d.val, 4) + '$ gramos.',
        'En forma continua sería $N(t) = ' + d.N0 + '\\,e^{-kt}$ con $k = \\frac{\\ln 2}{' + d.semi + '} = ' +
        U.fmt(Math.LN2 / d.semi, 5) + '$: da exactamente lo mismo.'];
    },
    answer: function (d) { return U.fmt(d.val, 4) + ' g'; }
  });

  p.keys([
    'Exponencial $a^x$: pasa por $(0,1)$, siempre positiva, con el eje X como asíntota.',
    'Crece (o decrece) mucho más deprisa que cualquier polinomio: acaba superando a todos.',
    '$e \\approx 2{,}71828$ sale de repartir un interés en infinitos plazos, y es la base «natural».',
    'El logaritmo es la inversa: solo existe para $x>0$, pasa por $(1,0)$ y crece lentísimo.',
    'Las escalas logarítmicas (Richter, decibelios, pH) comprimen magnitudes enormes.',
    'Crecimiento y decaimiento continuos: $N_0 e^{\\pm kt}$, con semivida $\\frac{\\ln 2}{k}$.'
  ]);
});
