/* Tema: Concepto de función */
Course.topic('fn-concepto', function (p) {

  p.text('Una <strong>función</strong> es una regla que asigna a cada valor de entrada ' +
    '<strong>un único</strong> valor de salida. Es una máquina: metes un número, sale otro, y siempre ' +
    'el mismo para la misma entrada.');

  p.formula('f: x \\longmapsto f(x) \\qquad f(x) = 2x + 1 \\ \\Rightarrow\\ f(3) = 7');

  p.text('Esa palabra, <em>único</em>, es toda la definición. Si a una entrada le pudieran corresponder ' +
    'dos salidas, no sería una función. Gráficamente eso da la prueba más rápida que existe:');

  p.note('<strong>Prueba de la recta vertical</strong>: si alguna recta vertical corta a la gráfica en ' +
    'más de un punto, eso no es una función. Por eso una circunferencia no lo es.', null, 'Cómo reconocer una función de un vistazo');

  p.hist('La idea de función tardó siglos en cuajar. Leibniz usó la palabra en 1673 para hablar de ' +
    'segmentos asociados a una curva; Euler la escribió como $f(x)$ en 1734 y la entendía como una ' +
    'fórmula. Solo en el siglo XIX, con Dirichlet, se llegó a la definición moderna: una función no ' +
    'tiene por qué venir dada por una fórmula, basta con que la correspondencia esté bien definida. ' +
    'Ese salto abrió la puerta al análisis moderno.');

  p.section('Dominio y recorrido');
  p.text('Toda función tiene dos conjuntos asociados que conviene no confundir: por dónde puede ' +
    '<em>entrar</em> y por dónde puede <em>salir</em>. El <strong>dominio</strong> son los valores ' +
    'de $x$ que la función admite; el <strong>recorrido</strong>, los valores de $y$ que llega a ' +
    'alcanzar. En la práctica el dominio se calcula buscando lo que está prohibido, que en ' +
    'Bachillerato es casi siempre una de estas tres cosas.');


  p.list([
    '<strong>Dominio</strong> $\\operatorname{Dom} f$: los valores de $x$ para los que la función existe.',
    '<strong>Recorrido</strong> (o imagen) $\\operatorname{Im} f$: todos los valores que llega a tomar $f(x)$.'
  ]);

  p.text('Casi siempre el dominio son todos los reales <em>menos</em> los puntos prohibidos. Y solo hay ' +
    'tres prohibiciones que conocemos por ahora:');

  p.table(['Prohibición', 'Aparece en', 'Ejemplo'],
    [['Dividir entre cero', 'denominadores', '$f(x)=\\dfrac{1}{x-2}$ → $x \\ne 2$'],
     ['Raíz par de un negativo', 'raíces cuadradas', '$f(x)=\\sqrt{x-3}$ → $x \\ge 3$'],
     ['Logaritmo de cero o negativo', 'logaritmos', '$f(x)=\\ln(x)$ → $x > 0$']]);

  p.demo({
    title: 'Leer una gráfica',
    intro: 'Arrastra el punto por la curva. La gráfica es un retrato completo de la función: cada altura es un valor.',
    build: function (host, d) {
      var tipo = 'cubica';
      var fns = {
        cubica: { f: function (x) { return 0.12 * x * x * x - 0.9 * x; }, t: 'f(x) = 0,12x³ − 0,9x' },
        seno: { f: function (x) { return 2.5 * Math.sin(x); }, t: 'f(x) = 2,5·sen(x)' },
        raiz: { f: function (x) { return x >= 0 ? 1.6 * Math.sqrt(x) : NaN; }, t: 'f(x) = 1,6·√x  (dominio: x ≥ 0)' },
        inversa: { f: function (x) { return Math.abs(x) < 0.12 ? NaN : 2 / x; }, t: 'f(x) = 2/x  (dominio: x ≠ 0)' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -5, ymax: 5, height: 330,
        handles: {
          P: {
            x: 2, y: 0, label: '', color: 2,
            constrain: function (h) {
              h.x = U.clamp(h.x, -6, 6);
              h.y = fns[tipo].f(h.x);
              if (isNaN(h.y)) h.y = 0;
            }
          }
        },
        draw: function (g) {
          g.fn(fns[tipo].f, { color: 0, w: 2.6 });
          var P = g.h('P');
          var y = fns[tipo].f(P.x);
          if (!isNaN(y)) {
            g.seg(P.x, 0, P.x, y, { color: 2, w: 1.6, dash: true });
            g.seg(0, y, P.x, y, { color: 2, w: 1.6, dash: true });
            g.point(P.x, y, { color: 2, r: 6 });
            out.set('$' + fns[tipo].t.replace(/,/g, '{,}') + '$<br>' +
              'Para $x = ' + U.fmt(P.x, 2) + '$ &nbsp;→&nbsp; $f(x) = ' + U.fmt(y, 3) + '$');
          } else {
            out.set('$' + fns[tipo].t.replace(/,/g, '{,}') + '$<br>' +
              '<strong style="color:var(--bad)">En $x = ' + U.fmt(P.x, 2) + '$ la función no está definida.</strong>');
          }
        }
      });
      W.chips(host, [
        { label: 'polinómica', value: 'cubica' }, { label: 'seno', value: 'seno' },
        { label: 'raíz', value: 'raiz' }, { label: '1/x', value: 'inversa' }
      ], { value: 'cubica', on: function (v) { tipo = v; plot.render(); } });
      W.hint(host, 'Arrastra el punto rojo a lo largo de la curva.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El dominio es la respuesta a «¿qué valores tienen sentido aquí?», y no considerarlo es una ' +
    'fuente clásica de disparates. Una fórmula que calcula el índice de masa corporal no significa ' +
    'nada con una altura de cero; un modelo de crecimiento de población ajustado con datos de diez ' +
    'años no vale para predecir a cien. Los formularios que rechazan una fecha de nacimiento ' +
    'imposible están comprobando un dominio.');

  p.section('Lo que se lee en una gráfica');
  p.text('Una gráfica bien mirada cuenta casi todo lo que hay que saber de una función, y aprender a ' +
    'interrogarla ahorra muchísimo cálculo. Estas son las preguntas que conviene hacerle siempre, en ' +
    'este orden.');


  p.list([
    '<strong>Cortes con los ejes</strong>: con el eje Y, el valor $f(0)$. Con el eje X, las soluciones de $f(x)=0$ (las <em>raíces</em>).',
    '<strong>Crecimiento</strong>: la función crece donde la gráfica sube al ir hacia la derecha.',
    '<strong>Máximos y mínimos</strong>: los picos y los valles.',
    '<strong>Continuidad</strong>: si se puede dibujar sin levantar el lápiz.',
    '<strong>Simetría</strong>: si es simétrica respecto al eje Y se llama <em>par</em> ($f(-x)=f(x)$); si lo es respecto al origen, <em>impar</em> ($f(-x)=-f(x)$).'
  ]);

  p.demo({
    title: 'Par, impar o ninguna de las dos',
    intro: 'Compara la curva con su reflejo. Si coinciden reflejando en el eje Y es par; si coinciden girando media vuelta alrededor del origen es impar.',
    build: function (host, d) {
      var cual = 'par';
      var fns = {
        par: { f: function (x) { return 0.25 * x * x - 2; }, t: 'f(x) = 0{,}25x^2 - 2', tipo: 'PAR: $f(-x)=f(x)$, simétrica respecto al eje Y' },
        impar: { f: function (x) { return 0.1 * x * x * x - 0.5 * x; }, t: 'f(x) = 0{,}1x^3 - 0{,}5x', tipo: 'IMPAR: $f(-x)=-f(x)$, simétrica respecto al origen' },
        ninguna: { f: function (x) { return 0.2 * x * x + 0.8 * x - 1; }, t: 'f(x) = 0{,}2x^2 + 0{,}8x - 1', tipo: 'NI PAR NI IMPAR' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -5, ymax: 5, height: 300,
        draw: function (g) {
          var f = fns[cual].f;
          g.fn(f, { color: 0, w: 2.8 });
          g.fn(function (x) { return f(-x); }, { color: 1, w: 2, dash: true });
          for (var x = -5; x <= 5; x += 2.5) {
            if (Math.abs(x) < 0.1) continue;
            g.point(x, f(x), { color: 0, r: 3.5 });
            g.point(-x, f(x), { color: 1, r: 3.5, hollow: true });
          }
        }
      });
      function paint() {
        out.set('$' + fns[cual].t + '$<br>' + fns[cual].tipo);
        plot.render();
      }
      W.chips(host, [{ label: 'ejemplo par', value: 'par' }, { label: 'ejemplo impar', value: 'impar' },
        { label: 'ninguna', value: 'ninguna' }], { value: 'par', on: function (v) { cual = v; paint(); } });
      W.legend(host, [{ c: 0, t: '$f(x)$' }, { c: 1, t: '$f(-x)$ (reflejada)' }]);
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Saber leer una gráfica es una defensa ciudadana. La mayoría de los gráficos engañosos que ' +
    'circulan no mienten en los datos: mienten en el eje. Un eje vertical que no empieza en cero ' +
    'convierte una subida del 2 % en un precipicio; un eje horizontal comprimido convierte una ' +
    'tendencia suave en una explosión. Mirar primero los ejes y después la curva es el hábito que ' +
    'distingue a quien entiende un dato de quien se lo cree.');

  p.section('Practica');

  p.exercise({
    title: 'Valor de una función',
    level: 'basico',
    gen: function (r) {
      var a = r.nz(-4, 4), b = r.pm(1, 8), c = r.pm(1, 10);
      var x = r.pm(1, 5);
      return { a: a, b: b, c: c, x: x, val: a * x * x + b * x + c };
    },
    ask: function (d) {
      return 'Si $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) + '$, calcula $f(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: 'f(' + d.x + ') =', w: 'tiny' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'Sustituye la $x$ por $' + (d.x < 0 ? '(' + d.x + ')' : d.x) + '$, con paréntesis si es negativo.'; },
    steps: function (d) {
      var xx = d.x < 0 ? '(' + d.x + ')' : String(d.x);
      return ['$f(' + d.x + ') = ' + d.a + '\\cdot' + xx + '^2 ' + ML.termTex(d.b, xx, 1, false) + ML.termTex(d.c, '', 0, false) + '$',
        '$= ' + (d.a * d.x * d.x) + ' ' + (d.b * d.x >= 0 ? '+ ' + (d.b * d.x) : '- ' + (-d.b * d.x)) +
        ' ' + (d.c >= 0 ? '+ ' + d.c : '- ' + (-d.c)) + '$',
        '$= ' + d.val + '$'];
    },
    answer: function (d) { return 'f(' + d.x + ') = ' + d.val; }
  });

  p.exercise({
    title: 'Dominio de la función',
    level: 'medio',
    gen: function (r) {
      var t = r.int(0, 2);
      var a = r.pm(1, 9);
      if (t === 0) return { t: 0, a: a, prohibido: a };                 // 1/(x-a)
      if (t === 1) return { t: 1, a: a, prohibido: a };                 // sqrt(x-a)
      var roots = [r.pm(1, 6), r.pm(1, 6)];
      if (roots[0] === roots[1]) return null;
      return { t: 2, r1: Math.min(roots[0], roots[1]), r2: Math.max(roots[0], roots[1]) };
    },
    ask: function (d) {
      if (d.t === 0) return 'Halla el dominio de $f(x) = \\dfrac{1}{x' + (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + '}$. ' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe el valor de $x$ que hay que excluir.</span>';
      if (d.t === 1) return 'Halla el dominio de $f(x) = \\sqrt{x' + (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + '}$. ' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe el menor valor de $x$ admitido.</span>';
      var b = -(d.r1 + d.r2), c = d.r1 * d.r2;
      return 'La función $f(x) = \\dfrac{x}{' + ML.polyTex([1, b, c]) + '}$ tiene dos valores prohibidos. ' +
        'Escribe el <strong>mayor</strong> de los dos.';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: d.t === 2 ? d.r2 : d.prohibido }; },
    hint: function (d) {
      if (d.t === 0) return 'El denominador no puede ser cero: resuelve la ecuación del denominador.';
      if (d.t === 1) return 'Lo de dentro de la raíz tiene que ser mayor o igual que cero.';
      return 'Factoriza el denominador y busca sus raíces.';
    },
    steps: function (d) {
      if (d.t === 0) return ['El denominador se anula cuando $x' + (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + ' = 0$.',
        'Es decir, $x = ' + d.a + '$.',
        'Dominio: $\\mathbb{R} - \\{' + d.a + '\\}$.'];
      if (d.t === 1) return ['El radicando debe cumplir $x' + (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + ' \\ge 0$.',
        '$x \\ge ' + d.a + '$.',
        'Dominio: $[' + d.a + ', +\\infty)$.'];
      var b = -(d.r1 + d.r2), c = d.r1 * d.r2;
      return ['Igualamos el denominador a cero: $' + ML.polyTex([1, b, c]) + ' = 0$.',
        'Sus raíces son $' + d.r1 + '$ y $' + d.r2 + '$.',
        'Dominio: $\\mathbb{R} - \\{' + d.r1 + ', ' + d.r2 + '\\}$.'];
    },
    answer: function (d) { return String(d.t === 2 ? d.r2 : d.prohibido); }
  });

  p.exercise({
    title: 'Par, impar o ninguna',
    level: 'medio',
    gen: function (r) {
      var t = r.int(0, 2);
      if (t === 0) return { t: 0, c: [r.nz(-4, 4), 0, r.pm(1, 8)] };            // ax^2+c → par
      if (t === 1) return { t: 1, c: [r.nz(-3, 3), 0, 0], impar: true };        // ax^3 → impar
      return { t: 2, c: [r.nz(-3, 3), r.nz(-5, 5), r.pm(1, 6)] };               // ninguna
    },
    ask: function (d) {
      var tex = d.t === 1 ? ML.termTex(d.c[0], 'x', 3, true) : ML.polyTex(d.c);
      return '¿Es $f(x) = ' + tex + '$ par, impar o ninguna de las dos cosas?' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>par</code>, ' +
        '<code>impar</code> o <code>ninguna</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny' }],
    sol: function (d) { return { r: ['par', 'impar', 'ninguna'][d.t] }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase();
      if (['par', 'impar', 'ninguna'].indexOf(t) < 0) {
        return { ok: false, msg: 'Escribe <code>par</code>, <code>impar</code> o <code>ninguna</code>.' };
      }
      return t === ['par', 'impar', 'ninguna'][d.t];
    },
    hint: function () { return 'Sustituye $x$ por $-x$. Si sale lo mismo es par; si sale todo cambiado de signo, impar.'; },
    steps: function (d) {
      if (d.t === 0) return ['Al cambiar $x$ por $-x$, el término $x^2$ no cambia (el exponente es par) y la constante tampoco.',
        'Queda $f(-x) = f(x)$: la función es <strong>par</strong>, simétrica respecto al eje Y.'];
      if (d.t === 1) return ['Al cambiar $x$ por $-x$, $(-x)^3 = -x^3$.',
        'Queda $f(-x) = -f(x)$: la función es <strong>impar</strong>, simétrica respecto al origen.'];
      return ['Aquí hay exponentes pares e impares mezclados.',
        'Al sustituir, unos términos cambian de signo y otros no, así que $f(-x)$ no es ni $f(x)$ ni $-f(x)$.',
        'No es <strong>ni par ni impar</strong>.'];
    },
    answer: function (d) { return ['Par', 'Impar', 'Ni par ni impar'][d.t]; }
  });

  p.exercise({
    title: 'Cortes con los ejes',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pm(1, 7), x2 = r.pm(1, 7);
      if (x1 === x2) return null;
      var b = -(x1 + x2), c = x1 * x2;
      return { x1: Math.min(x1, x2), x2: Math.max(x1, x2), b: b, c: c };
    },
    ask: function (d) {
      return 'Halla los cortes de $f(x) = ' + ML.polyTex([1, d.b, d.c]) + '$ con los ejes.';
    },
    fields: [
      { name: 'y', label: 'Corte con eje Y', w: 'tiny' },
      { name: 'a', label: 'Corte X menor', w: 'tiny' },
      { name: 'b', label: 'Corte X mayor', w: 'tiny' }
    ],
    sol: function (d) { return { y: d.c, a: d.x1, b: d.x2 }; },
    hint: function () { return 'Con el eje Y: haz $x=0$. Con el eje X: resuelve $f(x)=0$.'; },
    steps: function (d) {
      return ['Corte con el eje Y: $f(0) = ' + d.c + '$, o sea el punto $(0, ' + d.c + ')$.',
        'Cortes con el eje X: resolvemos $' + ML.polyTex([1, d.b, d.c]) + ' = 0$.',
        'Las raíces son $x = ' + d.x1 + '$ y $x = ' + d.x2 + '$.',
        'Puntos: $(' + d.x1 + ', 0)$ y $(' + d.x2 + ', 0)$.'];
    },
    answer: function (d) { return '(0, ' + d.c + '), (' + d.x1 + ', 0) y (' + d.x2 + ', 0)'; }
  });

  p.keys([
    'Función = a cada entrada le corresponde <strong>una sola</strong> salida.',
    'Prueba de la recta vertical: si una vertical corta dos veces, no es función.',
    'Dominio = valores permitidos. Prohibiciones: denominador cero, raíz par de negativo, logaritmo de no positivo.',
    'La gráfica cuenta todo: cortes, crecimiento, extremos, continuidad y simetrías.',
    'Par: $f(-x)=f(x)$ (simétrica respecto al eje Y). Impar: $f(-x)=-f(x)$ (respecto al origen).'
  ]);
});
