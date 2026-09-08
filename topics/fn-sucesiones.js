/* Tema: Sucesiones y progresiones */
Course.topic('fn-sucesiones', function (p) {

  p.text('Una <strong>sucesión</strong> es una lista ordenada e infinita de números. Es una función ' +
    'cuyo dominio son los naturales: a cada posición $n$ le corresponde un término $a_n$.');

  p.formula('a_n = 3n - 1 \\ \\longrightarrow\\ 2,\\ 5,\\ 8,\\ 11,\\ 14,\\ \\dots', 'término general');

  p.text('El <strong>término general</strong> es la fórmula que permite calcular cualquier término sin ' +
    'recorrer los anteriores. Encontrarlo es la mitad del trabajo con sucesiones.');

  p.section('Progresiones aritméticas');

  p.text('Cada término se obtiene <strong>sumando</strong> siempre la misma cantidad $d$ (la ' +
    '<em>diferencia</em>).');

  p.formulas([
    'a_n = a_1 + (n-1)\\,d',
    'S_n = \\frac{(a_1 + a_n)\\,n}{2}'
  ], 'término general y suma de los n primeros');

  p.hist('Cuenta la anécdota que a Gauss, con nueve años, le mandaron sumar los números del 1 al 100 ' +
    'para tenerlo entretenido. Respondió en segundos: 5050. Se había dado cuenta de que emparejando ' +
    '1+100, 2+99, 3+98… salen 50 parejas que suman 101 cada una. De ahí sale exactamente la fórmula ' +
    'de arriba.');

  p.note('Ese emparejamiento convence, pero no es una demostración: solo enseña que funciona en un ' +
    'caso. La herramienta para demostrar de verdad una fórmula que afirma algo sobre <em>todos</em> ' +
    'los naturales es la <strong>inducción</strong>, que viste en el bloque 0. Todas las fórmulas de ' +
    'este tema se demuestran así, y merece la pena volver allí y rehacer el ejemplo de la suma de los ' +
    '$n$ primeros naturales con lo que ya sabes de progresiones.', null, 'Cómo se demuestran estas fórmulas');

  p.section('Progresiones geométricas');

  p.text('Cada término se obtiene <strong>multiplicando</strong> siempre por la misma cantidad $r$ ' +
    '(la <em>razón</em>).');

  p.formulas([
    'a_n = a_1 \\cdot r^{\\,n-1}',
    'S_n = a_1\\,\\frac{r^n - 1}{r - 1}',
    'S_\\infty = \\frac{a_1}{1-r} \\quad \\text{si } |r| < 1'
  ]);

  p.note('Esa última fórmula dice algo extraordinario: <strong>se pueden sumar infinitos números y ' +
    'obtener un resultado finito</strong>. $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\dots = 1$. Cada ' +
    'sumando es la mitad de lo que falta, así que nunca se pasa de 1, pero se acerca tanto como se ' +
    'quiera. Es la resolución de la paradoja de Aquiles y la tortuga, que tuvo bloqueados a los ' +
    'griegos durante siglos.', 'ok', 'Sumar infinitos números');

  p.note('Aquí se está afirmando algo gordo sin demostrarlo, y conviene que quede dicho: que la suma ' +
    'de infinitos términos <em>valga</em> un número exige definir primero qué significa sumar ' +
    'infinitas cosas, porque literalmente no se puede hacer. Esa definición, y la sorpresa de que ' +
    'hay sumas cuyos términos tienden a cero y aun así se van al infinito, están en el tema ' +
    'siguiente, [[fn-series|<strong>Series numéricas y convergencia</strong>]]. Aquí basta con quedarse con la ' +
    'fórmula; allí se justifica.',
    null, 'Esto se demuestra en el tema siguiente');

  p.demo({
    title: 'Aritmética o geométrica',
    intro: 'Compara las dos: una sube en escalones iguales, la otra se multiplica. Al principio se parecen; al cabo de pocos términos, no tienen nada que ver.',
    build: function (host, d) {
      var a1 = 2, dif = 3, raz = 1.5;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 13, ymin: 0, ymax: 60, height: 290,
        xlabel: 'n', ylabel: null, xstep: 1,
        draw: function (g) {
          for (var n = 1; n <= 12; n++) {
            g.point(n, a1 + (n - 1) * dif, { color: 0, r: 4.5 });
            var geo = a1 * Math.pow(raz, n - 1);
            if (geo < 60) g.point(n, geo, { color: 1, r: 4.5 });
          }
          g.fn(function (x) { return a1 + (x - 1) * dif; }, { color: 0, w: 1.5, alpha: .5 });
          g.fn(function (x) { return a1 * Math.pow(raz, x - 1); }, { color: 1, w: 1.5, alpha: .5 });
        }
      });
      function paint() {
        var ar = [], ge = [];
        for (var n = 1; n <= 8; n++) {
          ar.push(U.fmt(a1 + (n - 1) * dif, 2));
          ge.push(U.fmt(a1 * Math.pow(raz, n - 1), 2));
        }
        out.set('<span style="color:var(--c1)"><strong>Aritmética</strong> ($d = ' + U.fmt(dif, 1) + '$)</span>: ' +
          ar.join(', ') + ', …<br>' +
          '<span style="color:var(--c2)"><strong>Geométrica</strong> ($r = ' + U.fmt(raz, 2) + '$)</span>: ' +
          ge.join(', ') + ', …<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Suma de los 10 primeros: aritmética $' +
          U.fmt((2 * a1 + 9 * dif) * 10 / 2, 2) + '$ · geométrica $' +
          U.fmt(a1 * (Math.pow(raz, 10) - 1) / (raz - 1), 2) + '$</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'primer término', min: 1, max: 8, step: 1, value: 2, dec: 0, on: function (v) { a1 = v; paint(); } });
      W.slider(row, { label: 'diferencia d', min: 1, max: 8, step: 0.5, value: 3, dec: 1, on: function (v) { dif = v; paint(); } });
      W.slider(row, { label: 'razón r', min: 1.05, max: 2.2, step: 0.05, value: 1.5, dec: 2, on: function (v) { raz = v; paint(); } });
      paint();
    }
  });

  p.demo({
    title: 'Sumar infinitos términos',
    intro: 'Cada barra es la mitad de la anterior. Añade términos y verás que la suma nunca supera el 1: se acerca sin llegar.',
    build: function (host, d) {
      var n = 5, r0 = 0.5;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 1.05, ymin: -0.35, ymax: 0.9, height: 190,
        grid: false, axes: false,
        draw: function (g) {
          var x = 0;
          for (var k = 0; k < n; k++) {
            var w = Math.pow(r0, k) * (1 - r0);
            g.rect(x, 0, w, 0.55, { color: k % 6, fill: k % 6, fillAlpha: .5, w: 1.2 });
            x += w;
          }
          g.seg(0, -0.12, 1, -0.12, { color: 'axis', w: 2 });
          g.text(1, -0.28, 'total = 1', { align: 'right', size: 12.5, color: 'ink' });
          g.point(x, -0.12, { color: 2, r: 5 });
        }
      });
      function paint() {
        var suma = 1 - Math.pow(r0, n);
        var terms = [];
        for (var k = 0; k < Math.min(n, 6); k++) terms.push(U.fmt(Math.pow(r0, k) * (1 - r0), 5));
        out.set('$' + terms.join(' + ') + (n > 6 ? ' + \\dots' : '') + ' = ' + U.fmt(suma, 8) + '$<br>' +
          'Falta para llegar a 1: $' + U.fmt(1 - suma, 8) + '$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Con infinitos términos: ' +
          '$S_\\infty = \\frac{a_1}{1-r} = \\frac{' + U.fmt(1 - r0, 2) + '}{' + U.fmt(1 - r0, 2) + '} = 1$ exactamente.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'número de términos', min: 1, max: 20, step: 1, value: 5, dec: 0, on: function (v) { n = v; paint(); } });
      W.slider(row, { label: 'razón r', min: 0.2, max: 0.85, step: 0.05, value: 0.5, dec: 2, on: function (v) { r0 = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('La suma de una progresión geométrica es la fórmula de la cuota de una hipoteca. Cada ' +
    'mensualidad futura vale hoy un poco menos, y ese «poco menos» es una razón constante, así que ' +
    'el total es una progresión geométrica; el banco despeja de ahí la cuota. La misma fórmula da el ' +
    'valor de un plan de pensiones y el alcance de una campaña que se propaga por recomendación. ' +
    'Esa deducción, con la cuota despejada y una tabla de amortización que se puede manosear, ' +
    'está en el tema [[fn-finanzas|<strong>Matemática financiera</strong>]], dos más adelante.');

  p.section('Límite de una sucesión');

  p.text('Igual que con las funciones, se puede preguntar a dónde se dirigen los términos cuando $n$ ' +
    'crece sin parar. Una sucesión es <strong>convergente</strong> si se acerca a un número, ' +
    '<strong>divergente</strong> si se va al infinito y <strong>oscilante</strong> si no se decide.');

  p.formulas([
    '\\lim_{n\\to\\infty}\\frac{1}{n} = 0',
    '\\lim_{n\\to\\infty}\\frac{3n+1}{2n-5} = \\frac{3}{2}',
    '\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n = e'
  ], 'la sucesión 1/n tiende a cero',
    'Se dice: <em>«el límite, cuando ene tiende a infinito, de uno partido por ene, es ' +
      'cero»</em>.<br><br>En cristiano: <em>«al repartir una tarta entre cada vez más gente, a cada ' +
      'uno le toca cada vez menos, y se puede acercar a cero tanto como se quiera»</em>. Ojo: nunca ' +
      'llega a valer cero, por grande que sea ene. El límite es a lo que se acerca, no un valor que ' +
      'alcance.');

  p.text('Se calculan igual que los límites en el infinito de las funciones: comparando grados.');

  /* ================= EJERCICIOS ================= */
  p.util('Que una suma de infinitos términos pueda dar un número finito es lo que hace posible la ' +
    'compresión digital. Un sonido o una imagen se representan como suma de infinitas componentes, ' +
    'pero como los términos decrecen deprisa, quedarse con unos pocos basta: eso es un MP3 y eso es ' +
    'un JPEG. Lo que tiras es la cola de la serie, y la razón de que no se note es precisamente que ' +
    'converge.');

  p.section('Practica');

  p.exercise({
    title: 'Progresión aritmética',
    level: 'basico',
    gen: function (r) {
      var a1 = r.pm(1, 12), dif = r.nz(-8, 8), n = r.int(5, 30);
      return { a1: a1, d: dif, n: n, an: a1 + (n - 1) * dif, S: (2 * a1 + (n - 1) * dif) * n / 2 };
    },
    ask: function (d) {
      return 'En una progresión aritmética, $a_1 = ' + d.a1 + '$ y la diferencia es $d = ' + d.d +
        '$. Calcula $a_{' + d.n + '}$ y la suma de los $' + d.n + '$ primeros términos.';
    },
    fields: function (d) {
      return [{ name: 'a', label: 'a₍' + d.n + '₎', w: 'tiny' }, { name: 's', label: 'Suma', w: 'tiny' }];
    },
    sol: function (d) { return { a: d.an, s: d.S }; },
    tol: 1e-6,
    hint: function () { return '$a_n = a_1 + (n-1)d$ y $S_n = \\frac{(a_1+a_n)n}{2}$.'; },
    steps: function (d) {
      return ['$a_{' + d.n + '} = ' + d.a1 + ' + (' + d.n + '-1)\\cdot(' + d.d + ') = ' + d.a1 + ' + ' +
        ((d.n - 1) * d.d) + ' = ' + d.an + '$',
        '$S_{' + d.n + '} = \\dfrac{(' + d.a1 + ' + ' + d.an + ')\\cdot ' + d.n + '}{2} = \\dfrac{' +
        ((d.a1 + d.an) * d.n) + '}{2} = ' + d.S + '$'];
    },
    answer: function (d) { return 'a₍' + d.n + '₎ = ' + d.an + ', suma = ' + d.S; }
  });

  p.exercise({
    title: 'Progresión geométrica',
    level: 'medio',
    gen: function (r) {
      var a1 = r.int(1, 8), raz = r.pick([2, 3, -2, 0.5]);
      var n = r.int(4, 10);
      var an = a1 * Math.pow(raz, n - 1);
      if (Math.abs(an) > 1e7) return null;
      return { a1: a1, r: raz, n: n, an: an, S: a1 * (Math.pow(raz, n) - 1) / (raz - 1) };
    },
    ask: function (d) {
      return 'En una progresión geométrica, $a_1 = ' + d.a1 + '$ y la razón es $r = ' + U.fmt(d.r, 1) +
        '$. Calcula $a_{' + d.n + '}$ y la suma de los $' + d.n + '$ primeros (cuatro decimales).';
    },
    fields: function (d) {
      return [{ name: 'a', label: 'a₍' + d.n + '₎', w: 'wide' }, { name: 's', label: 'Suma', w: 'wide' }];
    },
    sol: function (d) { return { a: U.round(d.an, 6), s: U.round(d.S, 6) }; },
    tol: 3e-5,
    hint: function () { return '$a_n = a_1 r^{n-1}$ y $S_n = a_1\\frac{r^n-1}{r-1}$.'; },
    steps: function (d) {
      return ['$a_{' + d.n + '} = ' + d.a1 + ' \\cdot ' + U.fmt(d.r, 1) + '^{' + (d.n - 1) + '} = ' + U.fmt(d.an, 4) + '$',
        '$S_{' + d.n + '} = ' + d.a1 + ' \\cdot \\dfrac{' + U.fmt(d.r, 1) + '^{' + d.n + '} - 1}{' + U.fmt(d.r, 1) + ' - 1}$',
        '$= ' + U.fmt(d.S, 4) + '$'];
    },
    answer: function (d) { return 'a₍' + d.n + '₎ = ' + U.fmt(d.an, 4) + ', suma = ' + U.fmt(d.S, 4); }
  });

  p.exercise({
    title: 'Suma de infinitos términos',
    level: 'avanzado',
    gen: function (r) {
      var a1 = r.int(1, 12);
      var den = r.pick([2, 3, 4, 5, 10]);
      var raz = 1 / den;
      return { a1: a1, den: den, r: raz, S: a1 / (1 - raz) };
    },
    ask: function (d) {
      return 'Calcula la suma de <strong>todos</strong> los infinitos términos de la progresión ' +
        'geométrica que empieza en $a_1 = ' + d.a1 + '$ y tiene razón $r = \\dfrac{1}{' + d.den +
        '}$ (cuatro decimales).';
    },
    fields: [{ name: 'S', label: 'Suma total', w: 'wide' }],
    sol: function (d) { return { S: U.round(d.S, 6) }; },
    tol: 3e-5,
    hint: function () { return 'Como $|r| < 1$, la suma infinita converge: $S_\\infty = \\frac{a_1}{1-r}$.'; },
    steps: function (d) {
      return ['La razón cumple $|r| = \\frac{1}{' + d.den + '} < 1$, así que la suma infinita existe.',
        '$S_\\infty = \\dfrac{a_1}{1-r} = \\dfrac{' + d.a1 + '}{1 - \\frac{1}{' + d.den + '}} = ' +
        '\\dfrac{' + d.a1 + '}{\\frac{' + (d.den - 1) + '}{' + d.den + '}}$',
        '$= ' + U.fmt(d.S, 4) + '$',
        'Los términos son cada vez más pequeños, así que aunque sean infinitos su suma es finita.'];
    },
    answer: function (d) { return U.fmt(d.S, 4); }
  });

  p.exercise({
    title: 'Límite de una sucesión',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-6, 6), b = r.pm(1, 8), c = r.nz(-6, 6), e = r.pm(1, 8);
      var caso = r.int(0, 2);
      if (caso === 0) return { caso: 0, a: a, b: b, c: c, e: e, val: a / c };
      if (caso === 1) return { caso: 1, a: a, b: b, c: c, e: e, val: 0 };
      return { caso: 2, a: a, b: b, c: c, e: e, val: (a / c > 0 ? Infinity : -Infinity) };
    },
    ask: function (d) {
      var num = d.caso === 0 ? ML.termTex(d.a, 'n', 1, true) + ML.termTex(d.b, '', 0, false)
        : (d.caso === 1 ? ML.termTex(d.a, 'n', 1, true) + ML.termTex(d.b, '', 0, false)
          : ML.termTex(d.a, 'n', 2, true) + ML.termTex(d.b, '', 0, false));
      var den = d.caso === 1 ? ML.termTex(d.c, 'n', 2, true) + ML.termTex(d.e, '', 0, false)
        : ML.termTex(d.c, 'n', 1, true) + ML.termTex(d.e, '', 0, false);
      return 'Calcula $\\displaystyle\\lim_{n\\to\\infty} \\dfrac{' + num + '}{' + den + '}$<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Si es infinito escribe <code>inf</code> ' +
        'o <code>-inf</code>; si no, el valor con cuatro decimales.</span>';
    },
    fields: [{ name: 'v', label: 'Límite', w: 'wide' }],
    sol: function (d) {
      return { v: d.val === Infinity ? 'inf' : (d.val === -Infinity ? '-inf' : U.round(d.val, 6)) };
    },
    check: function (v, d) {
      var t = v.raw.v.trim().toLowerCase().replace(/\s/g, '');
      if (d.val === Infinity) return t === 'inf' || t === '+inf' || t === 'infinito';
      if (d.val === -Infinity) return t === '-inf' || t === '-infinito';
      return Ex.same(v.v, d.val, 3e-5);
    },
    hint: function () { return 'Compara los grados de numerador y denominador, igual que con las funciones.'; },
    steps: function (d) {
      if (d.caso === 0) return ['Numerador y denominador son los dos de grado 1.',
        'El límite es el cociente de los coeficientes principales: $\\dfrac{' + d.a + '}{' + d.c + '} = ' + U.fmt(d.val, 4) + '$.'];
      if (d.caso === 1) return ['El numerador es de grado 1 y el denominador de grado 2.',
        'El denominador crece mucho más deprisa, así que la fracción se aplasta contra cero.',
        'El límite es $0$.'];
      return ['El numerador es de grado 2 y el denominador de grado 1.',
        'El numerador gana, así que la sucesión se dispara.',
        'El signo lo da $\\frac{' + d.a + '}{' + d.c + '}$: el límite es $' + (d.val > 0 ? '+\\infty' : '-\\infty') + '$.'];
    },
    answer: function (d) {
      return d.val === Infinity ? '+∞' : (d.val === -Infinity ? '−∞' : U.fmt(d.val, 4));
    }
  });

  p.keys([
    'Una sucesión es una función de dominio $\\mathbb{N}$; el término general la describe entera.',
    'Aritmética: se <strong>suma</strong> $d$. $a_n = a_1+(n-1)d$, $S_n = \\frac{(a_1+a_n)n}{2}$.',
    'Geométrica: se <strong>multiplica</strong> por $r$. $a_n = a_1 r^{n-1}$, $S_n = a_1\\frac{r^n-1}{r-1}$.',
    'Si $|r|<1$ se puede sumar la sucesión entera: $S_\\infty = \\frac{a_1}{1-r}$. Qué significa eso exactamente se ve en [[fn-series|el tema de series]].',
    'Los límites de sucesiones se calculan comparando grados, igual que en las funciones.'
  ]);
});
