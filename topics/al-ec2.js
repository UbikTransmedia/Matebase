/* Tema: Ecuaciones de segundo grado */
Course.topic('al-ec2', function (p) {

  p.text('Una ecuación de <strong>segundo grado</strong> es la que se puede escribir así, con $a \\ne 0$:');

  p.formula('ax^2 + bx + c = 0', 'forma general');

  p.text('A diferencia de las de primer grado, estas pueden tener <strong>dos</strong> soluciones, una ' +
    'o ninguna. Y hay una fórmula que las da todas de golpe.');

  p.formula('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', 'la fórmula general',
    'Probablemente la fórmula más famosa que vas a aprender. Se dice: <em>«equis es igual a menos ' +
      'be, más menos raíz de be al cuadrado menos cuatro a ce, partido por dos a»</em>.<br><br>El ' +
      'signo $\\pm$ se lee «más menos» y es la clave de todo: <strong>no es una fórmula, son ' +
      'dos</strong>. Una con el más y otra con el menos, y por eso salen dos soluciones.<br><br>Las ' +
      'letras $a$, $b$ y $c$ son los coeficientes de la ecuación escrita como $ax^2+bx+c=0$; $a$ es el ' +
      'que acompaña al cuadrado, $b$ el de la equis sola y $c$ el número suelto.<br><br>Cuidado con ' +
      'dos cosas al leerla: la raíz cubre <em>todo</em> $b^2-4ac$, y el $2a$ de abajo divide a ' +
      '<em>toda</em> la parte de arriba, no solo a la raíz.');

  p.hist('Los babilonios ya resolvían problemas equivalentes a ecuaciones de segundo grado hace 4000 años, ' +
    'con procedimientos geométricos: «completar el cuadrado» era literalmente completar un cuadrado. ' +
    'Al-Juarismi los sistematizó en el siglo IX, aunque solo aceptaba soluciones positivas (una raíz ' +
    'negativa no era una longitud posible). La fórmula tal y como la escribimos hoy, con letras y con el ' +
    'símbolo $\\pm$, es del siglo XVII.');

  /* ---------------------------------------------------------------- */
  p.section('El discriminante manda');

  p.text('Todo depende de lo que hay dentro de la raíz. Se le llama <strong>discriminante</strong>:');

  p.formula('\\Delta = b^2 - 4ac', 'el discriminante',
    'La letra $\\Delta$ es la delta griega mayúscula, y aquí se lee <strong>«discriminante»</strong> ' +
      '—viene de «discriminar», que aquí significa distinguir unos casos de otros—.<br><br>Se dice: ' +
      '<em>«delta es igual a be al cuadrado menos cuatro a ce»</em>.<br><br>Es exactamente lo que hay ' +
      'debajo de la raíz en la fórmula de arriba, y por eso su signo decide todo: si es negativo, la ' +
      'raíz de un número negativo no existe entre los reales y no hay solución.');

  p.table(['Discriminante', 'Soluciones reales', 'La parábola…'],
    [['$\\Delta > 0$', 'dos distintas', 'corta el eje X en dos puntos'],
     ['$\\Delta = 0$', 'una (doble)', 'toca el eje X en un solo punto'],
     ['$\\Delta < 0$', 'ninguna real', 'no llega a tocar el eje X']]);

  p.demo({
    title: 'La parábola y el discriminante',
    intro: 'Mueve los tres coeficientes. Las soluciones de la ecuación son exactamente los puntos donde la curva cruza el eje horizontal.',
    build: function (host, d) {
      var a = 1, b = -1, c = -6;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -8, xmax: 8, ymin: -12, ymax: 12, height: 320,
        draw: function (g) {
          g.fn(function (x) { return a * x * x + b * x + c; }, { color: 0, w: 2.6 });
          var s = ML.quadratic(a, b, c);
          if (s.n >= 1) {
            g.point(s.x1, 0, { color: 2, r: 6, label: 'x₁ = ' + U.fmt(s.x1, 3), labelDy: -14 });
            if (s.n === 2) g.point(s.x2, 0, { color: 2, r: 6, label: 'x₂ = ' + U.fmt(s.x2, 3), labelDy: 16 });
          }
          var xv = -b / (2 * a);
          g.point(xv, a * xv * xv + b * xv + c, { color: 4, r: 4.5 });
          g.vline(xv, { color: 4, dash: true, w: 1.2, alpha: .6 });
        }
      });
      function paint() {
        var D = b * b - 4 * a * c;
        var s = ML.quadratic(a, b, c);
        var txt = '$' + ML.polyTex([a, b, c]) + ' = 0$<br>' +
          '$\\Delta = ' + b + '^2 - 4\\cdot' + a + '\\cdot(' + c + ') = ' + D + '$ → ';
        if (D > 0) txt += '<strong style="color:var(--ok)">dos soluciones</strong>: $x_1 = ' +
          U.fmt(s.x1, 4) + '$, &nbsp; $x_2 = ' + U.fmt(s.x2, 4) + '$';
        else if (D === 0) txt += '<strong style="color:var(--warn)">una solución doble</strong>: $x = ' + U.fmt(s.x1, 4) + '$';
        else txt += '<strong style="color:var(--bad)">ninguna solución real</strong> (la parábola no toca el eje)';
        out.set(txt);
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a', min: -3, max: 3, step: 0.5, value: a, dec: 1, on: function (v) { a = v || 0.5; paint(); } });
      W.slider(row, { label: 'b', min: -8, max: 8, step: 0.5, value: b, dec: 1, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'c', min: -10, max: 10, step: 0.5, value: c, dec: 1, on: function (v) { c = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El discriminante responde a «¿llega o no llega?» sin necesidad de resolver nada. La trayectoria ' +
    'de un balón es una parábola: preguntar si entra por la escuadra es preguntar si esa parábola ' +
    'corta cierta altura, y el signo de $b^2-4ac$ lo dice de un vistazo. Los simuladores de física ' +
    'de los videojuegos lo calculan miles de veces por segundo para decidir si dos objetos van a ' +
    'chocar, precisamente porque es mucho más barato que resolver la ecuación entera.');

  p.section('Ecuaciones incompletas: no uses la fórmula');

  p.text('Si falta un término, hay atajos mucho más rápidos (y con menos posibilidades de error):');

  p.table(['Tipo', 'Método', 'Ejemplo'],
    [['$ax^2 + c = 0$ &nbsp;(falta $b$)', 'despejar y hacer la raíz', '$2x^2-18=0 \\Rightarrow x^2=9 \\Rightarrow x=\\pm 3$'],
     ['$ax^2 + bx = 0$ &nbsp;(falta $c$)', 'sacar factor común $x$', '$x(3x-6)=0 \\Rightarrow x=0$ o $x=2$'],
     ['$ax^2 = 0$', 'solución doble $x=0$', '$5x^2=0 \\Rightarrow x=0$']]);

  p.note('En el caso $ax^2+bx=0$ <strong>jamás</strong> dividas los dos lados entre $x$: estarías ' +
    'perdiendo la solución $x=0$. Saca factor común y usa que un producto es cero si lo es alguno ' +
    'de sus factores.', 'warn', 'La solución que todo el mundo pierde');

  p.section('Suma y producto de las raíces');

  p.text('Si $x_1$ y $x_2$ son las soluciones de $x^2+bx+c=0$, entonces:');

  p.formulas(['x_1 + x_2 = -b', 'x_1 \\cdot x_2 = c'], 'relaciones de Cardano-Vieta');

  p.text('Sirve para resolver de cabeza y, sobre todo, para comprobar: si has obtenido $x_1=2$ y ' +
    '$x_2=3$ en $x^2-5x+6=0$, mira que suman 5 y multiplican 6. También sirve para factorizar: ' +
    '$x^2-5x+6 = (x-2)(x-3)$.');

  /* ================= EJERCICIOS ================= */
  p.util('Estas dos relaciones permiten reconstruir una ecuación a partir de sus soluciones, que es lo ' +
    'que hace un ingeniero al diseñar: sabe qué comportamiento quiere y necesita la ecuación que lo ' +
    'produce. En control de sistemas —el piloto automático de un avión, la suspensión de un coche— ' +
    'se eligen primero las raíces, porque son las que deciden si el sistema oscila o se estabiliza, ' +
    'y después se construye la ecuación que las tiene.');

  p.section('Practica');

  p.exercise({
    title: 'Ecuación completa con la fórmula',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pm(1, 8), x2 = r.pm(1, 8);
      var a = r.pick([1, 1, 1, 2]);
      var b = -a * (x1 + x2), c = a * x1 * x2;
      if (Math.abs(b) > 40 || Math.abs(c) > 90) return null;
      return { a: a, b: b, c: c, x1: Math.min(x1, x2), x2: Math.max(x1, x2) };
    },
    ask: function (d) {
      return 'Resuelve $' + ML.polyTex([d.a, d.b, d.c]) + ' = 0$.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Escribe las dos soluciones ' +
        'separadas por punto y coma, en cualquier orden.</span>';
    },
    fields: [{ name: 's', label: 'Soluciones', w: 'wide', ph: '2; -3' }],
    sol: function (d) { return { s: d.x1 + '; ' + d.x2 }; },
    check: function (v, d) {
      if (Ex.sameSet(v.raw.s, [d.x1, d.x2], 1e-6)) return true;
      if (Ex.same(ML.tryEval(v.raw.s), d.x1) || Ex.same(ML.tryEval(v.raw.s), d.x2)) {
        return { ok: false, msg: 'Esa solución está bien, pero <strong>falta la otra</strong>. Escribe las dos separadas por punto y coma.' };
      }
      return false;
    },
    hint: function (d) { return 'Discriminante: $\\Delta = ' + d.b + '^2 - 4\\cdot' + d.a + '\\cdot(' + d.c + ') = ' + (d.b * d.b - 4 * d.a * d.c) + '$.'; },
    steps: function (d) {
      var D = d.b * d.b - 4 * d.a * d.c;
      return ['Identificamos $a = ' + d.a + '$, $b = ' + d.b + '$, $c = ' + d.c + '$.',
        '$\\Delta = b^2-4ac = ' + (d.b * d.b) + ' - ' + (4 * d.a * d.c) + ' = ' + D + '$',
        'Como $\\Delta > 0$ hay dos soluciones distintas.',
        '$x = \\dfrac{' + (-d.b) + ' \\pm \\sqrt{' + D + '}}{' + (2 * d.a) + '} = \\dfrac{' + (-d.b) + ' \\pm ' + U.fmt(Math.sqrt(D), 4) + '}{' + (2 * d.a) + '}$',
        '$x_1 = ' + d.x1 + '$ &nbsp;y&nbsp; $x_2 = ' + d.x2 + '$',
        'Comprobación: suman $' + (d.x1 + d.x2) + ' = -b/a$ y multiplican $' + (d.x1 * d.x2) + ' = c/a$ ✓'];
    },
    answer: function (d) { return '$x_1 = ' + d.x1 + '$, &nbsp; $x_2 = ' + d.x2 + '$'; }
  });

  p.exercise({
    title: 'Ecuación incompleta',
    level: 'basico',
    gen: function (r) {
      var tipo = r.bool();
      if (tipo) {                        // ax^2 + c = 0
        var k = r.int(1, 9), a = r.pick([1, 2, 3, 4]);
        return { tipo: 1, a: a, c: -a * k * k, sols: [-k, k] };
      }
      var a2 = r.nz(-5, 5), b2 = r.nz(-9, 9);   // ax^2 + bx = 0
      return { tipo: 0, a: a2, b: b2, sols: [Math.min(0, -b2 / a2), Math.max(0, -b2 / a2)] };
    },
    ask: function (d) {
      var tex = d.tipo === 1
        ? ML.polyTex([d.a, 0, d.c])
        : ML.polyTex([d.a, d.b, 0]);
      return 'Resuelve sin usar la fórmula general: $' + tex + ' = 0$' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Las dos soluciones, separadas por punto y coma.</span>';
    },
    fields: [{ name: 's', label: 'Soluciones', w: 'wide', ph: '0; 3' }],
    sol: function (d) { return { s: d.sols.join('; ') }; },
    check: function (v, d) { return Ex.sameSet(v.raw.s, d.sols, 1e-6); },
    hint: function (d) {
      return d.tipo === 1 ? 'Despeja $x^2$ y saca la raíz. No olvides el $\\pm$.'
        : 'Saca factor común $x$. Después, producto igual a cero.';
    },
    steps: function (d) {
      if (d.tipo === 1) {
        return ['Pasamos el término independiente: $' + d.a + 'x^2 = ' + (-d.c) + '$.',
          'Dividimos: $x^2 = ' + (-d.c / d.a) + '$.',
          'Raíz cuadrada en los dos lados, con doble signo: $x = \\pm' + Math.sqrt(-d.c / d.a) + '$.'];
      }
      return ['Sacamos factor común: $x\\left(' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + '\\right) = 0$.',
        'Un producto vale cero si alguno de los factores vale cero.',
        'Primer factor: $x = 0$.',
        'Segundo factor: $' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + ' = 0 \\Rightarrow x = ' + U.fmt(-d.b / d.a, 4) + '$.'];
    },
    answer: function (d) { return d.sols.map(function (s) { return U.fmt(s, 4); }).join(' y '); }
  });

  p.exercise({
    title: '¿Cuántas soluciones tiene?',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-4, 4), b = r.pm(0, 9), c = r.pm(0, 12);
      var D = b * b - 4 * a * c;
      return { a: a, b: b, c: c, D: D, n: D > 0 ? 2 : (D === 0 ? 1 : 0) };
    },
    ask: function (d) {
      return 'Sin resolverla, di cuántas soluciones <strong>reales</strong> tiene ' +
        '$' + ML.polyTex([d.a, d.b, d.c]) + ' = 0$. Responde 0, 1 o 2.';
    },
    fields: [{ name: 'n', label: 'Nº de soluciones', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function () { return 'Calcula solo el discriminante $\\Delta = b^2-4ac$ y mira su signo.'; },
    steps: function (d) {
      return ['$a = ' + d.a + '$, $b = ' + d.b + '$, $c = ' + d.c + '$.',
        '$\\Delta = (' + d.b + ')^2 - 4\\cdot(' + d.a + ')\\cdot(' + d.c + ') = ' + (d.b * d.b) + ' - (' + (4 * d.a * d.c) + ') = ' + d.D + '$',
        d.D > 0 ? 'Positivo → dos soluciones distintas.'
          : (d.D === 0 ? 'Cero → una solución doble.' : 'Negativo → ninguna solución real.')];
    },
    answer: function (d) { return d.n + ' (Δ = ' + d.D + ')'; }
  });

  p.exercise({
    title: 'Reconstruye la ecuación',
    level: 'avanzado',
    gen: function (r) {
      var x1 = r.pm(1, 9), x2 = r.pm(1, 9);
      if (x1 === x2) return null;
      return { x1: x1, x2: x2, b: -(x1 + x2), c: x1 * x2 };
    },
    ask: function (d) {
      return 'Escribe la ecuación de segundo grado $x^2 + bx + c = 0$ cuyas soluciones sean ' +
        '$' + d.x1 + '$ y $' + d.x2 + '$.';
    },
    fields: [{ name: 'b', label: 'b', w: 'tiny' }, { name: 'c', label: 'c', w: 'tiny' }],
    sol: function (d) { return { b: d.b, c: d.c }; },
    hint: function () { return 'La suma de las raíces es $-b$ y su producto es $c$.'; },
    steps: function (d) {
      return ['Suma de raíces: $' + d.x1 + ' + (' + d.x2 + ') = ' + (d.x1 + d.x2) + '$, y eso es $-b$, así que $b = ' + d.b + '$.',
        'Producto: $' + d.x1 + ' \\cdot (' + d.x2 + ') = ' + d.c + '$, que es directamente $c$.',
        'La ecuación es $' + ML.polyTex([1, d.b, d.c]) + ' = 0$.',
        'Factorizada: $(x' + (d.x1 >= 0 ? '-' + d.x1 : '+' + (-d.x1)) + ')(x' + (d.x2 >= 0 ? '-' + d.x2 : '+' + (-d.x2)) + ') = 0$.'];
    },
    answer: function (d) { return '$' + ML.polyTex([1, d.b, d.c]) + ' = 0$'; }
  });

  p.keys([
    'Forma general $ax^2+bx+c=0$ con $a\\ne0$; fórmula $x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.',
    'El discriminante $\\Delta = b^2-4ac$ decide: dos, una o ninguna solución real.',
    'Las soluciones son los cortes de la parábola con el eje X.',
    'Incompletas: atajo. Y en $ax^2+bx=0$ nunca dividas entre $x$ — perderías $x=0$.',
    '$x_1+x_2 = -b/a$ y $x_1x_2 = c/a$: para comprobar y para factorizar.'
  ]);
});
