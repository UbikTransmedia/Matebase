/* Tema: Racionales, radicales y funciones a trozos */
Course.topic('fn-racionales', function (p) {

  p.text('Hasta ahora las funciones se podían dibujar sin levantar el lápiz y existían para cualquier ' +
    '$x$. Aquí llegan las tres familias que rompen eso: las que tienen <strong>agujeros</strong>, las ' +
    'que tienen <strong>zonas prohibidas</strong> y las que dan <strong>saltos</strong>.');

  p.section('Funciones racionales');
  p.text('Una función racional es un cociente de polinomios, y todo lo interesante que le ocurre pasa ' +
    'donde el denominador se acerca a cero. Ahí la función se dispara, y esa es la novedad respecto ' +
    'a todo lo que has visto hasta ahora: aparecen rectas a las que la curva se aproxima sin llegar ' +
    'a tocarlas nunca.');


  p.formula('f(x) = \\frac{P(x)}{Q(x)}', 'cociente de dos polinomios');

  p.text('Su dominio excluye los valores que anulan el denominador. Y cerca de esos valores pasa algo ' +
    'espectacular: la función se dispara. Esas rectas a las que se acerca sin tocarlas nunca se llaman ' +
    '<strong>asíntotas</strong>.');

  p.table(['Tipo de asíntota', 'Cuándo aparece', 'Ecuación'],
    [['Vertical', 'donde se anula el denominador (y no el numerador)', '$x = a$'],
     ['Horizontal', 'si $\\operatorname{gr}(P) \\le \\operatorname{gr}(Q)$', '$y = \\lim_{x\\to\\infty} f(x)$'],
     ['Oblicua', 'si $\\operatorname{gr}(P) = \\operatorname{gr}(Q)+1$', '$y = mx+n$, con la división entera']]);

  p.note('Nunca hay asíntota horizontal <em>y</em> oblicua a la vez: o el numerador gana por un grado ' +
    '(oblicua) o no gana (horizontal). Son excluyentes.', null);

  p.demo({
    title: 'La función más famosa con asíntotas',
    intro: 'Mueve los parámetros de una hipérbola desplazada y observa dónde quedan las dos asíntotas.',
    build: function (host, d) {
      var k = 1, a = 0, b = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -8, xmax: 8, ymin: -6, ymax: 6, height: 330,
        draw: function (g) {
          var f = function (x) { return Math.abs(x - a) < 1e-6 ? NaN : k / (x - a) + b; };
          g.fn(f, { color: 0, w: 2.6, samples: 1200 });
          g.vline(a, { color: 2, w: 1.8, dash: true });
          g.hline(b, { color: 3, w: 1.8, dash: true });
          g.text(a + 0.25, 5.4, 'x = ' + U.fmt(a, 1), { color: 2, size: 12, box: true });
          g.text(7.6, b + 0.4, 'y = ' + U.fmt(b, 1), { color: 3, size: 12, align: 'right', box: true });
        }
      });
      function paint() {
        out.set('$f(x) = \\dfrac{' + U.fmt(k, 1) + '}{x' + (a >= 0 ? ' - ' + U.fmt(a, 1) : ' + ' + U.fmt(-a, 1)) + '}' +
          (b >= 0 ? ' + ' + U.fmt(b, 1) : ' - ' + U.fmt(-b, 1)) + '$<br>' +
          'Dominio: $\\mathbb{R} - \\{' + U.fmt(a, 1) + '\\}$<br>' +
          '<span style="color:var(--c3)">Asíntota vertical: $x = ' + U.fmt(a, 1) + '$</span> &nbsp;·&nbsp; ' +
          '<span style="color:var(--c4)">Asíntota horizontal: $y = ' + U.fmt(b, 1) + '$</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'k', min: -6, max: 6, step: 0.5, value: 1, dec: 1, on: function (v) { k = v || 0.5; paint(); } });
      W.slider(row, { label: 'desplazamiento horizontal a', min: -5, max: 5, step: 0.5, value: 0, dec: 1, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'desplazamiento vertical b', min: -4, max: 4, step: 0.5, value: 0, dec: 1, on: function (v) { b = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Las asíntotas son límites físicos, no adornos del dibujo. La velocidad de una reacción química ' +
    'crece con la concentración pero se estanca en un techo; la eficacia de un fármaco sube con la ' +
    'dosis hasta saturarse; el rendimiento de un equipo mejora al añadir gente pero cada vez menos. ' +
    'Todas esas curvas son racionales y su asíntota horizontal es el techo real del sistema, el ' +
    'número que de verdad interesa.');

  p.section('Funciones con radicales');

  p.text('Una raíz de índice <strong>par</strong> exige que el radicando no sea negativo. Eso convierte ' +
    'el cálculo del dominio en resolver una <em>inecuación</em>.');

  p.formulas([
    'f(x) = \\sqrt{x-3} \\ \\Rightarrow\\ x - 3 \\ge 0 \\ \\Rightarrow\\ \\operatorname{Dom} f = [3, +\\infty)',
    'f(x) = \\sqrt{x^2-4} \\ \\Rightarrow\\ x^2-4 \\ge 0 \\ \\Rightarrow\\ \\operatorname{Dom} f = (-\\infty,-2] \\cup [2,+\\infty)'
  ]);

  p.text('Con índice <strong>impar</strong> no hay problema: $\\sqrt[3]{-8} = -2$ existe perfectamente. ' +
    'El dominio es todo $\\mathbb{R}$.');

  /* ---------------------------------------------------------------- */
  p.section('Funciones definidas a trozos');

  p.text('Son las que usan una fórmula distinta en cada tramo. No son un caso raro de examen: son ' +
    'las funciones de casi cualquier tarifa real (el IRPF, la factura de la luz, el precio del ' +
    'aparcamiento).');

  p.formula('f(x) = \\begin{cases} 2x+1 & \\text{si } x < 1 \\\\ x^2 & \\text{si } x \\ge 1 \\end{cases}');

  p.text('Lo interesante ocurre en los <strong>puntos de empalme</strong>: hay que comprobar si los ' +
    'dos trozos se encuentran (función continua) o si hay un salto.');

  p.demo({
    title: 'El salto en el empalme',
    intro: 'Mueve el segundo trozo hasta que encaje con el primero. Cuando los dos valores coinciden, la función es continua.',
    build: function (host, d) {
      var k = 0;
      var corte = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 5, ymin: -3, ymax: 8, height: 300,
        draw: function (g) {
          g.fn(function (x) { return 2 * x + 1; }, { to: corte, color: 0, w: 2.8 });
          g.fn(function (x) { return x * x + k; }, { from: corte, color: 1, w: 2.8 });
          var y1 = 2 * corte + 1, y2 = corte * corte + k;
          g.point(corte, y1, { color: 0, r: 5.5 });
          g.point(corte, y2, { color: 1, r: 5.5, hollow: Math.abs(y1 - y2) > 1e-9 });
          g.vline(corte, { color: 'axis', w: 1.2, dash: true });
          if (Math.abs(y1 - y2) > 1e-9) g.seg(corte, y1, corte, y2, { color: 2, w: 2.5, dash: true });
        }
      });
      function paint() {
        var y1 = 2 * corte + 1, y2 = corte * corte + k;
        out.set('$f(x) = \\begin{cases} 2x+1 & x < 1 \\\\ x^2 ' +
          (k >= 0 ? '+ ' + U.fmt(k, 1) : '- ' + U.fmt(-k, 1)) + ' & x \\ge 1\\end{cases}$<br>' +
          'Por la izquierda: $' + y1 + '$ &nbsp;·&nbsp; por la derecha: $' + U.fmt(y2, 2) + '$<br>' +
          (Math.abs(y1 - y2) < 1e-9
            ? '<strong style="color:var(--ok)">Coinciden: la función es continua en $x=1$.</strong>'
            : '<strong style="color:var(--bad)">Salto de ' + U.fmt(Math.abs(y1 - y2), 2) +
              ': discontinuidad de salto en $x=1$.</strong>'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'ajuste del segundo trozo', min: -3, max: 5, step: 0.5, value: 0, dec: 1, on: function (v) { k = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Casi todas las tarifas del mundo son funciones a trozos: el IRPF por tramos, la factura de la ' +
    'luz por franjas, el precio de un envío por peso, el aparcamiento por horas. Entender el punto ' +
    'donde cambia de tramo es lo que evita el error de creer que subir de tramo te hace ganar menos: ' +
    'en un impuesto progresivo bien diseñado solo tributa al tipo alto la parte que supera el ' +
    'umbral, y eso se ve leyendo la función.');

  p.hist('La idea de que una función pueda definirse con reglas distintas en trozos distintos escandalizó ' +
    'al siglo XVIII: se esperaba que una función fuera una única expresión, y lo demás se ' +
    'consideraba un artificio. Dirichlet zanjó la discusión en 1829 con un ejemplo provocador, la ' +
    'función que vale 1 en los racionales y 0 en los irracionales, imposible de dibujar y ' +
    'perfectamente legítima. Aquello obligó a redefinir qué es una función.');

  p.section('Practica');

  p.exercise({
    title: 'Asíntota vertical y horizontal',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-6, 6), b = r.nz(-6, 6), c = r.pm(1, 8);
      // f(x) = (a x + c) / (x - b)  ->  AV: x = b   AH: y = a
      return { a: a, b: b, c: c };
    },
    ask: function (d) {
      return 'Halla las asíntotas vertical y horizontal de ' +
        '$f(x) = \\dfrac{' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.c, '', 0, false) + '}{x' +
        (d.b >= 0 ? ' - ' + d.b : ' + ' + (-d.b)) + '}$';
    },
    fields: [{ name: 'v', label: 'Vertical: x =', w: 'tiny' }, { name: 'h', label: 'Horizontal: y =', w: 'tiny' }],
    sol: function (d) { return { v: d.b, h: d.a }; },
    tol: 1e-6,
    hint: function () { return 'La vertical, donde se anula el denominador. La horizontal, mirando el límite en el infinito: los grados coinciden, así que es el cociente de los coeficientes principales.'; },
    steps: function (d) {
      return ['Denominador cero: $x ' + (d.b >= 0 ? '- ' + d.b : '+ ' + (-d.b)) + ' = 0 \\Rightarrow x = ' + d.b + '$. Ahí hay una <strong>asíntota vertical</strong>.',
        'Para la horizontal, calculamos $\\lim_{x\\to\\infty} f(x)$.',
        'Numerador y denominador son los dos de grado 1, así que el límite es el cociente de los coeficientes principales: $\\dfrac{' + d.a + '}{1} = ' + d.a + '$.',
        '<strong>Asíntota horizontal</strong>: $y = ' + d.a + '$.'];
    },
    answer: function (d) { return 'Vertical $x = ' + d.b + '$, horizontal $y = ' + d.a + '$.'; }
  });

  p.exercise({
    title: 'Dominio de una función con raíz',
    level: 'medio',
    gen: function (r) {
      var t = r.bool();
      var a = r.pm(1, 9);
      if (t) return { t: 0, a: a };                     // sqrt(x - a):  x >= a
      var k = r.int(1, 7);
      return { t: 1, k: k };                            // sqrt(x^2 - k^2): |x| >= k
    },
    ask: function (d) {
      if (d.t === 0) {
        return 'Halla el dominio de $f(x) = \\sqrt{x' + (d.a >= 0 ? ' - ' + d.a : ' + ' + (-d.a)) + '}$. ' +
          '<span style="font-size:14px;color:var(--ink-faint)">Escribe el menor valor admitido.</span>';
      }
      return 'Halla el dominio de $f(x) = \\sqrt{x^2 - ' + (d.k * d.k) + '}$. ' +
        '<span style="font-size:14px;color:var(--ink-faint)">Es $(-\\infty, -k] \\cup [k, +\\infty)$: ' +
        'escribe el valor de $k$ (positivo).</span>';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: d.t === 0 ? d.a : d.k }; },
    hint: function () { return 'Lo de dentro de una raíz cuadrada tiene que ser mayor o igual que cero: plantea la inecuación.'; },
    steps: function (d) {
      if (d.t === 0) {
        return ['Exigimos $x ' + (d.a >= 0 ? '- ' + d.a : '+ ' + (-d.a)) + ' \\ge 0$.',
          '$x \\ge ' + d.a + '$',
          'Dominio: $[' + d.a + ', +\\infty)$.'];
      }
      return ['Exigimos $x^2 - ' + (d.k * d.k) + ' \\ge 0$.',
        'Las raíces del trinomio son $\\pm' + d.k + '$, y como $a>0$ la parábola es positiva <strong>fuera</strong> de ellas.',
        'Dominio: $(-\\infty, -' + d.k + '] \\cup [' + d.k + ', +\\infty)$.'];
    },
    answer: function (d) {
      return d.t === 0 ? '$[' + d.a + ', +\\infty)$'
        : '$(-\\infty, -' + d.k + '] \\cup [' + d.k + ', +\\infty)$';
    }
  });

  p.exercise({
    title: 'Función a trozos: ¿continua?',
    level: 'medio',
    gen: function (r) {
      var c = r.pm(0, 4);
      var m = r.nz(-4, 4), n = r.pm(0, 8);
      var k = r.pm(0, 6);
      var izq = m * c + n, der = c * c + k;
      return { c: c, m: m, n: n, k: k, izq: izq, der: der, salto: der - izq };
    },
    ask: function (d) {
      return 'Estudia la continuidad en $x = ' + d.c + '$ de<br>' +
        '$f(x) = \\begin{cases}' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) +
        ' & \\text{si } x \\le ' + d.c + ' \\\\ x^2' + ML.termTex(d.k, '', 0, false) +
        ' & \\text{si } x > ' + d.c + '\\end{cases}$<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe el tamaño del salto ' +
        '(límite por la derecha menos límite por la izquierda). Si es continua, escribe 0.</span>';
    },
    fields: [{ name: 's', label: 'Salto', w: 'tiny' }],
    sol: function (d) { return { s: d.salto }; },
    hint: function (d) { return 'Calcula los dos límites laterales sustituyendo $x = ' + d.c + '$ en cada trozo.'; },
    steps: function (d) {
      return ['Por la izquierda: $' + d.m + '\\cdot(' + d.c + ')' + ML.termTex(d.n, '', 0, false) + ' = ' + d.izq + '$.',
        'Por la derecha: $(' + d.c + ')^2' + ML.termTex(d.k, '', 0, false) + ' = ' + d.der + '$.',
        'Salto: $' + d.der + ' - (' + d.izq + ') = ' + d.salto + '$.',
        d.salto === 0 ? 'Los dos coinciden: la función es <strong>continua</strong> en ese punto.'
          : 'No coinciden: hay una <strong>discontinuidad de salto</strong>.'];
    },
    answer: function (d) {
      return d.salto === 0 ? 'Continua (salto 0).' : 'Salto de ' + d.salto + ': discontinuidad de salto.';
    }
  });

  p.exercise({
    title: 'Valor que hace continua la función',
    level: 'avanzado',
    gen: function (r) {
      var c = r.pm(1, 4);
      var m = r.nz(-4, 4);
      var k = r.pm(0, 8);
      // trozo 1: m x + n   trozo 2: x^2 + k    con n a determinar
      var n = c * c + k - m * c;
      return { c: c, m: m, k: k, n: n };
    },
    ask: function (d) {
      return 'Halla el valor de $n$ que hace continua a<br>' +
        '$f(x) = \\begin{cases}' + ML.termTex(d.m, 'x', 1, true) + ' + n & \\text{si } x < ' + d.c +
        ' \\\\ x^2' + ML.termTex(d.k, '', 0, false) + ' & \\text{si } x \\ge ' + d.c + '\\end{cases}$';
    },
    fields: [{ name: 'n', label: 'n =', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function (d) { return 'Los dos trozos tienen que dar el mismo valor en $x = ' + d.c + '$.'; },
    steps: function (d) {
      return ['Límite por la derecha: $(' + d.c + ')^2' + ML.termTex(d.k, '', 0, false) + ' = ' + (d.c * d.c + d.k) + '$.',
        'Límite por la izquierda: $' + d.m + '\\cdot(' + d.c + ') + n = ' + (d.m * d.c) + ' + n$.',
        'Para que sea continua, los dos tienen que coincidir:',
        '$' + (d.m * d.c) + ' + n = ' + (d.c * d.c + d.k) + ' \\Rightarrow n = ' + d.n + '$'];
    },
    answer: function (d) { return 'n = ' + d.n; }
  });

  p.keys([
    'Racionales: el dominio excluye las raíces del denominador, y ahí aparecen asíntotas verticales.',
    'Asíntota horizontal si el grado de arriba no supera al de abajo; oblicua si lo supera en uno. Nunca las dos.',
    'Raíz de índice par: el radicando debe ser $\\ge 0$, así que el dominio sale de una inecuación.',
    'Raíz de índice impar: dominio todo $\\mathbb{R}$.',
    'En una función a trozos, lo importante son los empalmes: se comparan los límites laterales.',
    'Muchas tarifas reales (impuestos, luz, parking) son funciones a trozos.'
  ]);
});
