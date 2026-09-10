/* Tema: Derivabilidad y funciones a trozos */
Course.topic('fn-derivabilidad', function (p) {

  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function polTex(c) { return ML.polyTex(c); }

  p.text('En [[fn-derivadas]] se derivaba sin preguntar si se podía. Casi siempre se puede: los ' +
    'polinomios, las exponenciales, los senos y los logaritmos son derivables en todo su dominio. ' +
    'Pero hay puntos donde la derivada no existe, y no por un problema de cálculo, sino porque la ' +
    'gráfica tiene un <strong>pico</strong>: llega con una pendiente y sale con otra.');

  p.text('Donde más se ve es en las funciones <strong>definidas a trozos</strong>, que es donde cae ' +
    'la pregunta de examen: <em>«halla $a$ y $b$ para que la función sea derivable»</em>. Este tema ' +
    'da la herramienta —las derivadas laterales— y la receta para resolverla sin dudar.');

  /* ---------------------------------------------------------------- */
  p.section('Derivadas laterales');

  p.formulas([
    'f\'(a^-) = \\lim_{h \\to 0^-} \\frac{f(a + h) - f(a)}{h} \\qquad f\'(a^+) = \\lim_{h \\to 0^+} \\frac{f(a + h) - f(a)}{h}',
    'f \\text{ es derivable en } a \\iff f\'(a^-) \\text{ y } f\'(a^+) \\text{ existen, son finitas y son iguales}'
  ], 'derivada por la izquierda y por la derecha',
    '$f\'(a^-)$ se lee «efe prima de a por la izquierda»: la pendiente con la que la gráfica ' +
      '<strong>llega</strong> al punto. $f\'(a^+)$, «por la derecha»: la pendiente con la que ' +
      '<strong>sale</strong>.<br><br>Son el mismo cociente incremental de siempre, con $h$ acercándose a ' +
      'cero solo por un lado. La derivada existe cuando las dos coinciden: la gráfica entra y sale con la ' +
      'misma inclinación, sin quiebro.');

  p.text('El ejemplo de siempre es $f(x) = |x|$ en $x = 0$. Por la izquierda la gráfica es $-x$, con ' +
    'pendiente $-1$; por la derecha es $x$, con pendiente $1$. Las dos derivadas laterales existen pero ' +
    'no coinciden: en el cero hay un pico y $|x|$ <strong>no es derivable</strong> ahí, aunque sí es ' +
    'continua.');

  p.demo({
    title: 'Un empalme con pico o sin pico',
    intro: 'A la izquierda de x = 1 la función es x²; a la derecha, una recta que sale del mismo punto con la pendiente m que elijas. Siempre es continua. Solo es derivable cuando la pendiente de salida coincide con la de llegada.',
    build: function (host) {
      var m = 0.5;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 2.5, ymin: -1, ymax: 4, height: 300,
        draw: function (g) {
          g.fn(function (x) { return x * x; }, { color: 0, w: 2.8, to: 1 });
          g.fn(function (x) { return 1 + m * (x - 1); }, { color: 1, w: 2.8, from: 1 });
          g.fn(function (x) { return 1 + 2 * (x - 1); }, { color: 0, w: 1.3, dash: true, from: 0.4, to: 1.6 });
          g.fn(function (x) { return 1 + m * (x - 1); }, { color: 1, w: 1.3, dash: true, from: 0.4, to: 1 });
          g.point(1, 1, { color: 'ink', r: 5 });
        }
      });
      function pinta() {
        var ok = Math.abs(m - 2) < 1e-9;
        out.set('$f\'(1^-) = 2 \\cdot 1 = 2$ &nbsp;·&nbsp; $f\'(1^+) = ' + U.fmt(m, 2) + '$<br>' +
          (ok ? '<strong style="color:var(--ok)">Las dos pendientes coinciden: el empalme es suave y la función es derivable en x = 1.</strong>'
            : 'Las pendientes son distintas: hay un pico en $x = 1$ y la función <strong>no es derivable</strong> ahí, aunque sea continua.'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'pendiente m del tramo derecho', min: -1, max: 4, step: 0.5, value: m, on: function (x) { m = x; pinta(); } });
      W.hint(host, 'Lleva m hasta 2: las dos rectas de puntos, las tangentes por cada lado, pasan a ser la misma.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Derivable implica continua, y no al revés');

  p.formula('f \\text{ derivable en } a \\ \\Longrightarrow\\ f \\text{ continua en } a',
    'la relación entre las dos propiedades',
    'Se lee: <em>«si efe es derivable en a, entonces es continua en a»</em>.<br><br>La razón cabe en una ' +
      'línea: $f(a+h) - f(a) = h \\cdot \\frac{f(a+h) - f(a)}{h}$. Si el cociente tiende a un número ' +
      'finito y $h$ tiende a cero, el producto tiende a cero, así que $f(a+h)$ se acerca a $f(a)$.<br><br>' +
      'Lo contrario es falso: $|x|$ es continua en 0 y no es derivable.');

  p.text('La consecuencia práctica es un orden de trabajo que ahorra tiempo y errores: <strong>primero se ' +
    'estudia la continuidad</strong>. Si una función no es continua en un punto, ya se sabe que no es ' +
    'derivable ahí, y no hace falta calcular ninguna derivada lateral.');

  p.list([
    '<strong>Pico</strong>: derivadas laterales finitas y distintas, como $|x|$ en 0.',
    '<strong>Tangente vertical</strong>: la derivada se va a infinito, como $\\sqrt[3]{x}$ en 0. Continua, pero no derivable.',
    '<strong>Salto o asíntota</strong>: ni siquiera es continua, así que tampoco derivable.'
  ]);

  p.hist('Durante siglos se dio por hecho que una curva continua tenía que ser derivable salvo en unos ' +
    'pocos picos sueltos: nadie sabía dibujar otra cosa. En 1872 Karl Weierstrass presentó en la ' +
    'Academia de Berlín una función, hecha con una suma infinita de cosenos cada vez más apretados, que ' +
    'es continua en todas partes y <strong>no es derivable en ningún punto</strong>: toda ella es pico. ' +
    'La reacción fue de escándalo. Charles Hermite llegó a escribir que se apartaba con horror de esas ' +
    'funciones sin derivada. Hoy se sabe que, en un sentido preciso, casi todas las funciones continuas ' +
    'son así, y que las derivables son la excepción amable.');

  /* ---------------------------------------------------------------- */
  p.section('Funciones a trozos: la receta del examen');

  p.text('Una función como $f(x) = \\begin{cases} g(x) & x < a \\\\ h(x) & x \\ge a \\end{cases}$, con $g$ y ' +
    '$h$ derivables, lo es en todas partes salvo, quizá, en el punto de empalme $x = a$. Allí se estudia ' +
    'así:');

  p.list([
    '<strong>Continuidad en $a$</strong>: los límites laterales tienen que coincidir con el valor: $g(a) = h(a)$. Si hay parámetros, sale una ecuación.',
    '<strong>Derivadas de cada trozo</strong>, por separado, en su intervalo abierto: $g\'(x)$ y $h\'(x)$.',
    '<strong>Derivadas laterales en $a$</strong>: si la función es continua en $a$, se pueden calcular como $f\'(a^-) = g\'(a)$ y $f\'(a^+) = h\'(a)$. Igualarlas da otra ecuación.',
    '<strong>Resolver el sistema</strong> con las dos ecuaciones para hallar los parámetros.'
  ], true);

  p.note('El paso 3 tiene una letra pequeña que el examen valora: sustituir en las derivadas de los trozos ' +
    'solo es legítimo <strong>si la función es continua en el punto</strong>. Si no lo es, las derivadas ' +
    'de los trozos pueden coincidir y la función no ser derivable, porque hay un salto. Por eso la ' +
    'continuidad va siempre primero.', 'warn', 'Continuidad antes que derivabilidad, siempre');

  p.demo({
    title: 'Encontrar los parámetros que sueldan los trozos',
    intro: 'f(x) = ax² + 1 si x ≤ 1, y bx − 1 si x > 1. Mueve a y b. La continuidad pide que los dos trozos lleguen al mismo punto; la derivabilidad, que lleguen con la misma pendiente. Solo un par de valores consigue las dos cosas.',
    build: function (host) {
      var a = 1, b = 2;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.5, xmax: 2.5, ymin: -2, ymax: 6, height: 300,
        draw: function (g) {
          g.fn(function (x) { return a * x * x + 1; }, { color: 0, w: 2.8, to: 1 });
          g.fn(function (x) { return b * x - 1; }, { color: 1, w: 2.8, from: 1 });
          g.point(1, a + 1, { color: 0, r: 5 });
          g.point(1, b - 1, { color: 1, r: 5, hollow: true });
        }
      });
      function pinta() {
        var cont = Math.abs((a + 1) - (b - 1)) < 1e-9, der = cont && Math.abs(2 * a - b) < 1e-9;
        out.set('Continuidad en $x = 1$: $a + 1 = ' + U.fmt(a + 1, 2) + '$ y $b - 1 = ' + U.fmt(b - 1, 2) + '$ → ' + (cont ? '<strong>continua</strong>' : 'no continua') + '<br>' +
          'Pendientes en $x = 1$: $f\'(1^-) = 2a = ' + U.fmt(2 * a, 2) + '$, $f\'(1^+) = b = ' + U.fmt(b, 2) + '$' +
          (cont ? (der ? ' → <strong style="color:var(--ok)">derivable</strong>' : ' → iguales solo si $2a = b$') : '') + '<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Sistema: $b = a + 2$ y $b = 2a$. Solución: $a = 2$, $b = 4$.</span>');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'a', min: -1, max: 3, step: 0.5, value: a, on: function (x) { a = x; pinta(); } });
      W.slider(fila, { label: 'b', min: -1, max: 5, step: 0.5, value: b, on: function (x) { b = x; pinta(); } });
      pinta();
    }
  });

  p.util('En ingeniería, «derivable» se dice «suave», y la diferencia se nota con el cuerpo. Una carretera ' +
    'que pasa de una recta a una curva circular sin transición es continua pero no derivable en la ' +
    'curvatura: obligaría a girar el volante de golpe. Por eso las autopistas y las vías de tren meten ' +
    'entre recta y curva una clotoide, un tramo en el que la curvatura crece poco a poco. Lo mismo pasa en ' +
    'el diseño de carrocerías y de tipografías: las curvas se construyen a trozos, con polinomios, y se ' +
    'exige que en cada empalme coincidan el valor y la derivada, a veces también la segunda, para que ' +
    'el reflejo de la luz no se quiebre.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Derivadas laterales en un empalme',
    level: 'basico',
    gen: function (r) {
      var x0 = r.pick([-1, 1, 2]), b = r.pm(0, 4), c0 = r.pm(0, 3), m = r.pm(0, 5);
      // izquierda: x^2 + b x + c0 ; derecha: m x + q con continuidad
      var yl = x0 * x0 + b * x0 + c0, q = yl - m * x0;
      return { x0: x0, b: b, c0: c0, m: m, q: q, izq: 2 * x0 + b };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\begin{cases} ' + polTex([1, d.b, d.c0]) + ' & x \\le ' + d.x0 + ' \\\\ ' + polTex([d.m, d.q]) + ' & x > ' + d.x0 + '\\end{cases}$, que es continua. Calcula sus derivadas laterales en $x = ' + d.x0 + '$.';
    },
    fields: [{ name: 'i', label: "$f'(" + 'a^-)$', w: 'tiny' }, { name: 'd', label: "$f'(" + 'a^+)$', w: 'tiny' }],
    sol: function (d) { return { i: d.izq, d: d.m }; },
    hint: function () { return ['Deriva cada trozo por separado.', 'Como es continua, sustituye $x = a$ en la derivada de cada trozo: la de la izquierda da $f\'(a^-)$ y la de la derecha $f\'(a^+)$.']; },
    steps: function (d) {
      return ['Trozo izquierdo: $(' + polTex([1, d.b, d.c0]) + ')\' = ' + polTex([2, d.b]) + '$, en $x = ' + d.x0 + '$ vale $' + d.izq + '$.',
        'Trozo derecho: $(' + polTex([d.m, d.q]) + ')\' = ' + d.m + '$.',
        d.izq === d.m ? 'Coinciden: la función es derivable en $x = ' + d.x0 + '$.' : 'No coinciden: hay un pico y no es derivable en $x = ' + d.x0 + '$.'];
    },
    answer: function (d) { return "f'(a⁻) = " + d.izq + ", f'(a⁺) = " + d.m; }
  });

  p.exercise({
    title: '¿Continua? ¿Derivable?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        function () { return { f: '|x - ' + r.int(1, 4) + '|', en: 'el punto donde se anula lo de dentro', t: 'pico', por: 'por la izquierda la pendiente es $-1$ y por la derecha $1$' }; },
        function () { var a = r.int(1, 3); return { f: '\\begin{cases} x^2 & x \\le ' + a + ' \\\\ ' + (2 * a) + 'x - ' + (a * a) + ' & x > ' + a + ' \\end{cases}', en: 'x = ' + a, t: 'derivable', por: 'los dos trozos valen $' + (a * a) + '$ y los dos tienen pendiente $' + (2 * a) + '$' }; },
        function () { var a = r.int(1, 3); return { f: '\\begin{cases} x^2 & x \\le ' + a + ' \\\\ ' + (2 * a) + 'x & x > ' + a + ' \\end{cases}', en: 'x = ' + a, t: 'discontinua', por: 'por la izquierda llega a $' + (a * a) + '$ y por la derecha a $' + (2 * a * a) + '$: hay un salto' }; },
        function () { return { f: '\\sqrt[3]{x}', en: 'x = 0', t: 'vertical', por: 'la derivada $\\frac{1}{3\\sqrt[3]{x^2}}$ se va a infinito: tangente vertical' }; },
        function () { var a = r.int(1, 3); return { f: '\\begin{cases} x^2 + 1 & x \\le 0 \\\\ ' + a + 'x + 1 & x > 0 \\end{cases}', en: 'x = 0', t: 'pico', por: 'los dos trozos valen 1, pero las pendientes son $0$ y $' + a + '$' }; }
      ];
      return r.pick(casos)();
    },
    ask: function (d) { return 'Estudia $f(x) = ' + d.f + '$ en ' + (d.en.indexOf('=') >= 0 ? '$' + d.en + '$' : d.en) + '.'; },
    fields: [{
      name: 't', label: 'En ese punto la función es', opts: [
        { t: 'continua y derivable', v: 'derivable' },
        { t: 'continua, no derivable: tiene un pico', v: 'pico' },
        { t: 'continua, no derivable: tangente vertical', v: 'vertical' },
        { t: 'no continua (y por tanto no derivable)', v: 'discontinua' }]
    }],
    sol: function (d) { return { t: d.t }; },
    hint: function () { return ['Primero la continuidad: ¿llegan los dos lados al mismo valor?', 'Si es continua, compara las pendientes por cada lado.']; },
    steps: function (d) { return ['Se observa que ' + d.por + '.', { derivable: 'Continua y con la misma pendiente por los dos lados: derivable.', pico: 'Continua, pero con pendientes distintas: no derivable.', vertical: 'Continua, pero con tangente vertical: no derivable.', discontinua: 'No es continua, así que no puede ser derivable.' }[d.t]]; },
    answer: function (d) { return { derivable: 'Continua y derivable', pico: 'Continua, con pico', vertical: 'Continua, tangente vertical', discontinua: 'No continua' }[d.t]; }
  });

  p.problem({
    title: 'Los parámetros que hacen derivable la función',
    level: 'avanzado',
    gen: function (r) {
      var x0 = r.pick([1, 2, -1]), a = r.pm(1, 3), rr = r.pm(0, 4);
      var pp = 2 * a * x0;            // pendiente del tramo derecho
      var b = a * x0 * x0 + rr;       // para que sea continua
      return { x0: x0, a: a, b: b, p: pp, r: rr, der: pp };
    },
    intro: function (d) {
      return 'Se considera $f(x) = \\begin{cases} ax^2 + b & x < ' + d.x0 + ' \\\\ ' + polTex([d.p, d.r]) + ' & x \\ge ' + d.x0 + '\\end{cases}$. ' +
        'Se quiere hallar $a$ y $b$ para que $f$ sea derivable en $x = ' + d.x0 + '$.';
    },
    partes: [
      {
        ask: function (d) { return 'Iguala las derivadas laterales en $x = ' + d.x0 + '$ (la función tendrá que ser continua, así que puedes derivar los trozos). ¿Cuánto vale $a$?'; },
        fields: [{ name: 'a', label: 'a =', w: 'tiny' }],
        sol: function (d) { return { a: d.a }; },
        tol: 1e-9,
        hint: function (d) { return ['Derivada del trozo izquierdo: $2ax$. En $x = ' + d.x0 + '$ vale $' + (2 * d.x0) + 'a$.', 'Derivada del derecho: $' + d.p + '$. Iguala.']; },
        steps: function (d) { return ['$f\'(' + d.x0 + '^-) = 2a\\cdot' + pa(d.x0) + ' = ' + (2 * d.x0) + 'a$ y $f\'(' + d.x0 + '^+) = ' + d.p + '$.', '$' + (2 * d.x0) + 'a = ' + d.p + ' \\Rightarrow a = ' + d.a + '$']; },
        answer: function (d) { return 'a = ' + d.a; }
      },
      {
        ask: function (d) { return 'Ahora impón la continuidad en $x = ' + d.x0 + '$. ¿Cuánto vale $b$?'; },
        fields: [{ name: 'b', label: 'b =', w: 'tiny' }],
        sol: function (d) { return { b: d.b }; },
        tol: 1e-9,
        errores: [{
          si: function (v, d) { return d.b !== d.r && v.b === d.r; },
          msg: function (v, d) { return 'Te has olvidado del término $ax^2$ del trozo izquierdo al sustituir: con $a = ' + d.a + '$ también cuenta.'; }
        }],
        hint: function (d) { return ['Los dos trozos tienen que valer lo mismo en $x = ' + d.x0 + '$.', 'Izquierda: $a\\cdot' + pa(d.x0) + '^2 + b$, con el $a$ que acabas de hallar. Derecha: sustituye en la recta.']; },
        steps: function (d) {
          var yr = d.p * d.x0 + d.r;
          return ['Trozo izquierdo en $x = ' + d.x0 + '$: $' + d.a + '\\cdot' + pa(d.x0) + '^2 + b = ' + (d.a * d.x0 * d.x0) + ' + b$.', 'Trozo derecho: $' + d.p + '\\cdot' + pa(d.x0) + ' + ' + pa(d.r) + ' = ' + yr + '$.', '$' + (d.a * d.x0 * d.x0) + ' + b = ' + yr + ' \\Rightarrow b = ' + d.b + '$'];
        },
        answer: function (d) { return 'b = ' + d.b; }
      },
      {
        ask: function (d) { return 'Con esos valores, ¿cuánto vale $f\'(' + d.x0 + ')$?'; },
        fields: [{ name: 'v', label: "f'(a)", w: 'tiny' }],
        sol: function (d) { return { v: d.der }; },
        hint: function () { return 'Es la pendiente común de los dos trozos en el empalme.'; },
        steps: function (d) { return ['Las dos derivadas laterales valen $' + d.der + '$, así que $f\'(' + d.x0 + ') = ' + d.der + '$.']; },
        answer: function (d) { return String(d.der); }
      }
    ]
  });

  p.exercise({
    title: 'Un valor absoluto que no deja derivar',
    level: 'medio',
    gen: function (r) {
      var c = r.int(1, 4), lado = r.pick([1, -1]);
      return { c: c, x0: lado * c, lado: lado };
    },
    ask: function (d) {
      return 'Calcula las derivadas laterales de $f(x) = |x^2 - ' + (d.c * d.c) + '|$ en $x = ' + d.x0 + '$.';
    },
    fields: [{ name: 'i', label: "f'(a⁻)", w: 'tiny' }, { name: 'd', label: "f'(a⁺)", w: 'tiny' }],
    sol: function (d) {
      // en x = c: a la izquierda (−c<x<c) f = c²−x², derivada −2x → −2c; a la derecha f = x²−c² → 2c
      // en x = −c: a la izquierda (x<−c) f = x²−c², derivada 2x → −2c; a la derecha f = c²−x² → 2c
      return { i: -2 * d.c, d: 2 * d.c };
    },
    errores: [{
      si: function (v, d) { return v.i === 2 * d.c && v.d === -2 * d.c; },
      msg: function (v, d) { return 'Están cambiadas de lado: estudia el signo de $x^2 - ' + (d.c * d.c) + '$ a la izquierda y a la derecha del punto antes de quitar el valor absoluto.'; }
    }],
    hint: function (d) {
      return ['Quita el valor absoluto: $x^2 - ' + (d.c * d.c) + '$ es negativo entre $-' + d.c + '$ y $' + d.c + '$ y positivo fuera.',
        'Donde es negativo, $f(x) = ' + (d.c * d.c) + ' - x^2$; donde es positivo, $f(x) = x^2 - ' + (d.c * d.c) + '$. Deriva cada uno.'];
    },
    steps: function (d) {
      if (d.lado > 0) {
        return ['A la izquierda de $' + d.c + '$ (dentro del intervalo) $f(x) = ' + (d.c * d.c) + ' - x^2$ y $f\'(x) = -2x$: $f\'(' + d.c + '^-) = ' + (-2 * d.c) + '$.',
          'A la derecha, $f(x) = x^2 - ' + (d.c * d.c) + '$ y $f\'(x) = 2x$: $f\'(' + d.c + '^+) = ' + (2 * d.c) + '$.', 'Distintas: no es derivable en $x = ' + d.c + '$ (hay un pico).'];
      }
      return ['A la izquierda de $-' + d.c + '$ (fuera) $f(x) = x^2 - ' + (d.c * d.c) + '$ y $f\'(x) = 2x$: $f\'(-' + d.c + '^-) = ' + (-2 * d.c) + '$.',
        'A la derecha (dentro), $f(x) = ' + (d.c * d.c) + ' - x^2$ y $f\'(x) = -2x$: $f\'(-' + d.c + '^+) = ' + (2 * d.c) + '$.', 'Distintas: no es derivable en $x = -' + d.c + '$.'];
    },
    answer: function (d) { return "f'(a⁻) = " + (-2 * d.c) + ", f'(a⁺) = " + (2 * d.c); }
  });

  p.keys([
    'Derivable en $a$ ⟺ las dos derivadas laterales existen, son finitas y coinciden.',
    'Derivable ⟹ continua. Continua no implica derivable: picos ($|x|$) y tangentes verticales ($\\sqrt[3]{x}$).',
    'Si no es continua, no es derivable: por eso la continuidad se estudia primero.',
    'A trozos: continuidad en el empalme (una ecuación) + igualdad de derivadas laterales (otra) = sistema para los parámetros.',
    'Calcular $f\'(a^\\pm)$ derivando los trozos solo vale si la función es continua en $a$.',
    'Con valores absolutos, se quita el valor absoluto estudiando el signo de lo de dentro a cada lado.'
  ]);
});
