/* Tema: Concepto de función */
Course.topic('fn-concepto', function (p) {

  p.puente('En álgebra, una expresión con $x$ era una máquina: entraba un número y salía otro. En ' +
    'geometría, una ecuación en $x$ e $y$ era un dibujo. Este bloque junta las dos cosas bajo un ' +
    'nombre, <strong>función</strong>, y las mira a la vez: la fórmula y su gráfica. Casi todo lo que ' +
    'sigue —límites, derivadas, integrales— son preguntas sobre esa gráfica.', 'Por dónde empezamos');

  p.text('Una <strong>función</strong> es una regla que asigna a cada valor de entrada ' +
    '<strong>un único</strong> valor de salida. Es una máquina: metes un número, sale otro, y siempre ' +
    'el mismo para la misma entrada.');

  p.formula('f: x \\longmapsto f(x) \\qquad f(x) = 2x + 1 \\ \\Rightarrow\\ f(3) = 7');

  p.text('Esa palabra, <em>único</em>, es toda la definición. Si a una entrada le pudieran corresponder ' +
    'dos salidas, no sería una función. Gráficamente eso da la prueba más rápida que existe:');

  p.note('<strong>Prueba de la recta vertical</strong>: si alguna recta vertical corta a la gráfica en ' +
    'más de un punto, eso no es una función. Por eso una circunferencia no lo es.', null, 'Cómo reconocer una función de un vistazo');

  p.comprueba('¿Define $y^2 = x$ una función $y$ de $x$?', [
    { t: 'Sí: es una ecuación con $x$ e $y$', ok: false, por: 'Tener ecuación no basta. Para $x = 4$ salen dos valores, $y = 2$ e $y = -2$: dos salidas para una entrada.' },
    { t: 'No: a $x = 4$ le corresponden dos valores de $y$', ok: true, por: 'La recta vertical $x = 4$ corta la curva en $(4, 2)$ y $(4, -2)$. Sí sería función $y = \\sqrt{x}$, quedándose con una sola rama.' }
  ]);

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

  p.ejemplo({
    title: 'Un dominio con dos prohibiciones a la vez',
    enunciado: 'Hallar el dominio de $f(x) = \\dfrac{\\sqrt{x + 2}}{x - 3}$.',
    pasos: [
      { t: '<strong>Localizar las prohibiciones.</strong> Hay una raíz cuadrada (el radicando no puede ser negativo) y un denominador (no puede ser cero). Dos condiciones, y las dos tienen que cumplirse.', antes: '¿Cuántas cosas prohibidas ves en la fórmula?' },
      { t: '<strong>La raíz.</strong> $x + 2 \\ge 0 \\Rightarrow x \\ge -2$. El $-2$ sí vale: $\\sqrt 0 = 0$ existe.', antes: '¿Vale $x = -2$? ¿Qué sale en la raíz?' },
      { t: '<strong>El denominador.</strong> $x - 3 \\ne 0 \\Rightarrow x \\ne 3$.' },
      { t: '<strong>Juntar.</strong> Desde $-2$ (incluido) en adelante, quitando el 3: $\\operatorname{Dom} f = [-2, 3)\\cup(3, +\\infty)$.', antes: 'Escribe en forma de intervalo «$x \\ge -2$ pero $x \\ne 3$».' }
    ],
    cierre: 'Corchete en $-2$ porque la raíz admite el cero; paréntesis en 3 porque el denominador no. Los dos símbolos dicen cosas distintas y ninguno es un adorno.'
  });

  p.demo({
    title: 'Leer una gráfica',
    intro: 'Arrastra el punto por la curva. La gráfica es un retrato completo de la función: cada altura es un valor.',
    predice: 'Elige $1/x$ y arrastra el punto hacia $x = 0$. Antes de hacerlo: ¿qué le pasará a la altura? ¿Y habrá algún valor exactamente en $x = 0$?',
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
    predice: 'Antes de pulsar «ninguna»: $f(x) = 0{,}2x^2 + 0{,}8x - 1$ mezcla un exponente par y uno impar. ¿Coincidirá con su reflejo? ¿Por qué no?',
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

  p.section('Composición y función inversa');

  p.text('Dos funciones se pueden <strong>encadenar</strong>: la salida de una se usa como entrada de la ' +
    'otra, como dos máquinas puestas en fila. Es la idea que hay detrás de la ' +
    '[[fn-derivadas|regla de la cadena]], y la que permite construir funciones complicadas a partir de ' +
    'otras sencillas.');

  p.formulas([
    '(g\\circ f)(x) = g\\bigl(f(x)\\bigr)',
    'y = f(x) \\iff x = f^{-1}(y), \\qquad f^{-1}\\bigl(f(x)\\bigr) = x'
  ], 'composición y función inversa',
    'El círculo $\\circ$ se lee «compuesta con»: $g\\circ f$ es <em>«ge compuesta con efe»</em> y se aplica ' +
      'de derecha a izquierda, primero $f$ y después $g$. En general $g\\circ f \\ne f\\circ g$: ponerse los ' +
      'calcetines y luego los zapatos no es lo mismo que al revés.<br><br>$f^{-1}$ se lee «efe inversa» ' +
      '—no «efe elevado a menos uno», y no es $\\frac{1}{f}$— y es la función que deshace lo que hace $f$.');

  p.comprueba('Con $f(x) = x + 1$ y $g(x) = x^2$, ¿cuánto vale $(g\\circ f)(2)$?', [
    { t: '$5$', ok: false, por: 'Eso es $f(g(2)) = 4 + 1$: primero el cuadrado y luego sumar. En $g\\circ f$ se aplica <em>primero</em> $f$.' },
    { t: '$9$', ok: true, por: 'Primero $f(2) = 3$, después $g(3) = 9$. La función de la derecha actúa primero.' },
    { t: '$3$', ok: false, por: '$3$ es solo $f(2)$. Falta aplicar $g$ al resultado.' }
  ]);

  p.text('Para calcular la inversa se escribe $y = f(x)$, se <strong>intercambian</strong> $x$ e $y$ y se ' +
    'despeja la $y$. Solo existe si $f$ no repite valores (si es [[lg-conjuntos|inyectiva]]): si dos entradas ' +
    'dieran la misma salida, la inversa no sabría a cuál volver. Y su gráfica es la de $f$ reflejada en la ' +
    'recta $y = x$, porque intercambiar $x$ e $y$ es exactamente esa simetría.');

  p.demo({
    title: 'Una función y su inversa, reflejadas',
    predice: 'Si una función y su inversa se cortan, ¿dónde tiene que estar el punto de corte? Piensa en qué puntos quedan fijos al reflejar en la diagonal.',
    intro: 'Elige una función. Su inversa, a trazos, es su reflejo en la diagonal y = x: cada punto (a, b) de una se convierte en el punto (b, a) de la otra.',
    build: function (host) {
      var FN = {
        afin: { t: 'f(x) = 2x + 1', f: function (x) { return 2 * x + 1; }, g: function (x) { return (x - 1) / 2; }, ti: 'f^{-1}(x) = \\frac{x - 1}{2}' },
        cubo: { t: 'f(x) = x³', f: function (x) { return x * x * x; }, g: function (x) { return Math.cbrt(x); }, ti: 'f^{-1}(x) = \\sqrt[3]{x}' },
        exp: { t: 'f(x) = eˣ', f: function (x) { return Math.exp(x); }, g: function (x) { return x > 0 ? Math.log(x) : NaN; }, ti: 'f^{-1}(x) = \\ln x' }
      };
      var cual = 'afin', a = 1;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -4, xmax: 4, ymin: -4, ymax: 4, height: 320,
        draw: function (g) {
          var c = FN[cual], b = c.f(a);
          g.fn(function (x) { return x; }, { color: 'axis', w: 1.2, dash: [3, 4] });
          g.fn(c.f, { color: 0, w: 2.8 });
          g.fn(c.g, { color: 1, w: 2.4, dash: true });
          if (Math.abs(b) < 4) {
            g.seg(a, b, b, a, { color: 'axis', w: 1, dash: true });
            g.point(a, b, { color: 0, r: 5 });
            g.point(b, a, { color: 1, r: 5 });
          }
        }
      });
      function pinta() {
        var c = FN[cual], b = c.f(a);
        out.set('$' + c.ti + '$ &nbsp;·&nbsp; con $a = ' + U.fmt(a, 2) + '$: $f(a) = ' + U.fmt(b, 3) + '$ y $f^{-1}(' + U.fmt(b, 3) + ') = ' + U.fmt(a, 2) + '$');
        plot.render();
      }
      W.chips(host, Object.keys(FN).map(function (k) { return { label: FN[k].t, value: k }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      W.slider(W.row(host), { label: 'punto a', min: -1.5, max: 1.3, step: 0.05, value: a, on: function (v) { a = v; pinta(); } });
      W.legend(host, [{ c: 0, t: 'f' }, { c: 1, t: 'su inversa' }]);
      pinta();
    }
  });

  p.trampas([
    { e: 'Usar la recta <em>horizontal</em> para decidir si es función', por: 'Una horizontal puede cortar muchas veces (el seno la corta infinitas) y sigue siendo función. La prueba es con verticales.' },
    { e: 'Confundir dominio y recorrido', por: 'Dominio: valores de $x$ que entran. Recorrido: valores de $y$ que salen. $f(x) = x^2$ tiene dominio $\\mathbb{R}$ y recorrido $[0, +\\infty)$.' },
    { e: '$f^{-1}(x) = \\dfrac{1}{f(x)}$', por: 'La inversa deshace la función. Para $f(x) = 2x$, $f^{-1}(x) = \\frac{x}{2}$, no $\\frac{1}{2x}$.' },
    { e: '$g\\circ f = f\\circ g$', por: 'Con $f(x) = x + 1$ y $g(x) = x^2$: $g(f(2)) = 9$ y $f(g(2)) = 5$. El orden cambia el resultado.' }
  ]);

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
      return '¿Es $f(x) = ' + tex + '$ par, impar o ninguna de las dos cosas?';
    },
    fields: [{ name: 'r', label: 'La función es', opts: [{ t: 'par', v: 'par' }, { t: 'impar', v: 'impar' }, { t: 'ninguna de las dos', v: 'ninguna' }] }],
    sol: function (d) { return { r: ['par', 'impar', 'ninguna'][d.t] }; },
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

  p.exercise({
    title: 'Componer dos funciones',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 4), b = r.pm(0, 5), c = r.pm(0, 5), x0 = r.pm(0, 3);
      var bien = Math.pow(a * x0 + b, 2) + c, mal = a * (x0 * x0 + c) + b;
      return { a: a, b: b, c: c, x0: x0, bien: bien, mal: mal };
    },
    ask: function (d) {
      return 'Con $f(x) = ' + ML.polyTex([d.a, d.b]) + '$ y $g(x) = ' + ML.polyTex([1, 0, d.c]) + '$, calcula $(g\\circ f)(' + d.x0 + ')$.';
    },
    fields: [{ name: 'v', label: 'valor', w: 'tiny' }],
    sol: function (d) { return { v: d.bien }; },
    errores: [{ si: function (v, d) { return d.mal !== d.bien && v.v === d.mal; }, msg: 'Has calculado $f(g(x))$: en $g\\circ f$ se aplica <strong>primero $f$</strong> y al resultado se le aplica $g$.' }],
    hint: function (d) { return ['Primero $f(' + d.x0 + ')$.', 'Después aplica $g$ a ese resultado.']; },
    steps: function (d) { var fx = d.a * d.x0 + d.b; return ['$f(' + d.x0 + ') = ' + fx + '$', '$g(' + fx + ') = ' + (fx < 0 ? '(' + fx + ')' : fx) + '^2 ' + (d.c < 0 ? '- ' + (-d.c) : '+ ' + d.c) + ' = ' + d.bien + '$']; },
    answer: function (d) { return String(d.bien); }
  });

  p.exercise({
    title: 'La función inversa',
    level: 'avanzado',
    gen: function (r) {
      var b = r.pm(0, 5), c = r.pm(0, 4), y0 = r.pm(2, 6);
      if (b === -c) return null;
      return { b: b, c: c, y0: y0, v: ML.F(b + c * y0, y0 - 1), mal: y0 !== -b ? ML.F(y0 - c, y0 + b) : null };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\dfrac{' + ML.polyTex([1, d.b]) + '}{' + ML.polyTex([1, -d.c]) + '}$. Calcula $f^{-1}(' + d.y0 + ')$. (Vale una fracción.)';
    },
    fields: [{ name: 'v', label: 'valor', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return d.mal && !d.mal.eq(d.v) && Math.abs(v.v - d.mal.val()) < 1e-9; }, msg: '$f^{-1}$ no es $\\frac{1}{f}$: la inversa deshace la función, no la invierte como fracción.' }],
    hint: function () { return ['Escribe $y = f(x)$ y despeja $x$ en función de $y$.', 'O más directo: busca el $x$ tal que $f(x)$ valga el número dado.']; },
    steps: function (d) {
      return ['$' + d.y0 + ' = \\dfrac{' + ML.polyTex([1, d.b]) + '}{' + ML.polyTex([1, -d.c]) + '} \\Rightarrow ' + d.y0 + '(' + ML.polyTex([1, -d.c]) + ') = ' + ML.polyTex([1, d.b]) + '$',
        '$' + d.y0 + 'x' + ML.termTex(-d.y0 * d.c, '', 0, false) + ' = x' + ML.termTex(d.b, '', 0, false) + ' \\Rightarrow ' + (d.y0 - 1) + 'x = ' + (d.b + d.c * d.y0) + '$',
        '$x = ' + d.v.tex() + '$, así que $f^{-1}(' + d.y0 + ') = ' + d.v.tex() + '$.'];
    },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.keys([
    '$(g\\circ f)(x) = g(f(x))$: primero $f$ y después $g$. El orden importa.',
    'La inversa deshace la función: se intercambian $x$ e $y$ y se despeja. Solo existe si la función no repite valores, y su gráfica es la simétrica respecto de $y = x$.',
    'Función = a cada entrada le corresponde <strong>una sola</strong> salida.',
    'Prueba de la recta vertical: si una vertical corta dos veces, no es función.',
    'Dominio = valores permitidos. Prohibiciones: denominador cero, raíz par de negativo, logaritmo de no positivo.',
    'La gráfica cuenta todo: cortes, crecimiento, extremos, continuidad y simetrías.',
    'Par: $f(-x)=f(x)$ (simétrica respecto al eje Y). Impar: $f(-x)=-f(x)$ (respecto al origen).'
  ]);
});
