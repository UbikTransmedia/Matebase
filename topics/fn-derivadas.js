/* Tema: Derivadas */
Course.topic('fn-derivadas', function (p) {

  p.text('Ya sabes calcular la pendiente de una recta: $m = \\frac{\\Delta y}{\\Delta x}$. Pero una ' +
    'curva no tiene una pendiente, tiene una <em>distinta en cada punto</em>. La <strong>derivada</strong> ' +
    'es la respuesta a la pregunta: ¿cuál es la pendiente exacta <em>aquí</em>?');

  p.section('De la secante a la tangente');

  p.text('La idea es un truco magnífico. La pendiente entre dos puntos sí sabemos calcularla: es la ' +
    'de la recta <strong>secante</strong>. Si acercamos el segundo punto al primero, la secante se va ' +
    'pareciendo cada vez más a la <strong>tangente</strong>. Y «acercar hasta el límite» es justo lo ' +
    'que sabemos hacer desde el tema anterior.');

  p.formula('f\'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}', 'definición de derivada');

  p.text('El cociente de dentro es la pendiente de la secante entre $a$ y $a+h$. Al hacer $h \\to 0$ ' +
    'da $\\frac{0}{0}$ si lo sustituyes a lo bruto, y por eso hacía falta la maquinaria de los límites.');

  p.demo({
    title: 'La secante se convierte en tangente',
    intro: 'Acerca el segundo punto al primero con el deslizador. Mira cómo la recta secante gira hasta apoyarse en la curva.',
    build: function (host, d) {
      var h = 2, a = 1;
      var f = function (x) { return 0.5 * x * x; };
      var fp = function (x) { return x; };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3, xmax: 5, ymin: -1.5, ymax: 8, height: 330,
        draw: function (g) {
          g.fn(f, { color: 0, w: 2.6 });
          var x1 = a, y1 = f(a), x2 = a + h, y2 = f(a + h);
          var msec = (y2 - y1) / h;
          // secante
          g.fn(function (x) { return y1 + msec * (x - x1); }, { color: 1, w: 2, dash: true });
          // tangente
          g.fn(function (x) { return y1 + fp(a) * (x - x1); }, { color: 2, w: 2.2, alpha: .85 });
          // triangulo del cociente incremental
          g.seg(x1, y1, x2, y1, { color: 3, w: 1.8 });
          g.seg(x2, y1, x2, y2, { color: 3, w: 1.8 });
          g.text((x1 + x2) / 2, y1 - 0.35, 'h = ' + U.fmt(h, 3), { align: 'center', color: 3, size: 12, box: true });
          g.text(x2 + 0.15, (y1 + y2) / 2, 'Δy = ' + U.fmt(y2 - y1, 3), { align: 'left', color: 3, size: 12, box: true });
          g.point(x1, y1, { color: 0, r: 6 });
          g.point(x2, y2, { color: 1, r: 5 });
        }
      });
      function paint() {
        var msec = (f(a + h) - f(a)) / h;
        out.set('Pendiente de la <span style="color:var(--c2)">secante</span>: ' +
          '$\\dfrac{f(' + U.fmt(a + h, 3) + ') - f(' + a + ')}{' + U.fmt(h, 3) + '} = ' + U.fmt(msec, 5) + '$<br>' +
          'Pendiente de la <span style="color:var(--c3)">tangente</span> (la derivada): $f\'(' + a + ') = ' + U.fmt(fp(a), 3) + '$<br>' +
          (Math.abs(h) < 0.05 ? '<strong style="color:var(--ok)">Prácticamente iguales: la secante ya es la tangente.</strong>'
            : 'Diferencia: $' + U.fmt(Math.abs(msec - fp(a)), 5) + '$. Sigue acercando $h$ a cero.'));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'separación h', min: 0.01, max: 3, step: 0.01, value: h, dec: 2, on: function (v) { h = v; paint(); } });
      W.slider(row, { label: 'punto a', min: -2, max: 3, step: 0.25, value: a, dec: 2, on: function (v) { a = v; paint(); } });
      W.legend(host, [{ c: 0, t: '$f(x)=\\frac{1}{2}x^2$' }, { c: 1, t: 'secante' }, { c: 2, t: 'tangente' }]);
      paint();
    }
  });

  p.note('La derivada tiene dos lecturas y las dos importan: geométricamente es la <strong>pendiente ' +
    'de la tangente</strong>; físicamente es el <strong>ritmo instantáneo de cambio</strong>. Si $f$ es ' +
    'la posición, $f\'$ es la velocidad. Si $f$ es el número de contagiados, $f\'$ es la velocidad de ' +
    'contagio. Es la misma operación matemática.', 'ok', 'Dos caras de lo mismo');

  p.hist('Newton y Leibniz llegaron a esto de forma independiente hacia 1670, y se pasaron el resto ' +
    'de sus vidas discutiendo quién había sido primero. Newton lo llamaba <em>fluxiones</em> y pensaba ' +
    'en movimiento; Leibniz lo llamaba <em>cálculo diferencial</em> y pensaba en incrementos infinitamente ' +
    'pequeños. La notación que usamos hoy —$dy/dx$, el signo de integral— es toda de Leibniz, porque ' +
    'era mejor; la de Newton (el puntito encima) solo sobrevive en física.');

  /* ---------------------------------------------------------------- */
  p.section('Reglas de derivación');

  p.text('Nadie calcula derivadas con el límite: se hace una vez para cada tipo de función y luego ' +
    'se usa la tabla. Estas son las que hacen falta en Bachillerato:');

  p.table(['Función', 'Derivada'],
    [['$k$ (constante)', '$0$'],
     ['$x$', '$1$'],
     ['$x^n$', '$n\\,x^{n-1}$'],
     ['$\\sqrt{x}$', '$\\dfrac{1}{2\\sqrt{x}}$'],
     ['$e^x$', '$e^x$'],
     ['$a^x$', '$a^x \\ln a$'],
     ['$\\ln x$', '$\\dfrac{1}{x}$'],
     ['$\\operatorname{sen} x$', '$\\cos x$'],
     ['$\\cos x$', '$-\\operatorname{sen} x$'],
     ['$\\operatorname{tg} x$', '$1 + \\operatorname{tg}^2 x = \\dfrac{1}{\\cos^2 x}$']]);

  p.sub('Y las reglas para combinarlas');

  p.formulas([
    '(f \\pm g)\' = f\' \\pm g\'',
    '(k\\,f)\' = k\\,f\'',
    '(f\\cdot g)\' = f\'g + fg\'',
    '\\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}',
    '(f \\circ g)\' = f\'(g(x))\\cdot g\'(x)'
  ], 'suma · constante · producto · cociente · cadena');

  p.note('La derivada de un producto <strong>no</strong> es el producto de las derivadas. Compruébalo ' +
    'con $f=g=x$: $(x\\cdot x)\' = (x^2)\' = 2x$, mientras que $1\\cdot 1 = 1$. La regla del producto ' +
    'tiene esos dos sumandos por una razón.', 'warn');

  p.text('La <strong>regla de la cadena</strong> es la que más cuesta y la más importante. Dice: ' +
    'deriva la función de fuera dejando lo de dentro tal cual, y multiplica por la derivada de lo de dentro.');

  p.formula('\\left[(3x^2+1)^5\\right]\' = 5(3x^2+1)^4 \\cdot 6x = 30x(3x^2+1)^4');

  p.demo({
    title: 'Una función y su derivada, a la vez',
    intro: 'Arriba la función, abajo su derivada. Fíjate en la relación: donde la función tiene un máximo o un mínimo, la derivada vale cero.',
    build: function (host, d) {
      var cual = 'cubica';
      var fns = {
        cubica: { f: function (x) { return 0.15 * x * x * x - 0.9 * x; }, d: function (x) { return 0.45 * x * x - 0.9; }, t: 'f(x)=0{,}15x^3-0{,}9x', dt: 'f\'(x)=0{,}45x^2-0{,}9' },
        seno: { f: Math.sin, d: Math.cos, t: 'f(x)=\\operatorname{sen} x', dt: 'f\'(x)=\\cos x' },
        cuad: { f: function (x) { return 0.4 * x * x - 1; }, d: function (x) { return 0.8 * x; }, t: 'f(x)=0{,}4x^2-1', dt: 'f\'(x)=0{,}8x' },
        exp: { f: function (x) { return Math.exp(0.5 * x) - 2; }, d: function (x) { return 0.5 * Math.exp(0.5 * x); }, t: 'f(x)=e^{0{,}5x}-2', dt: 'f\'(x)=0{,}5\\,e^{0{,}5x}' }
      };
      var out = W.readout(host, '');
      var p1 = W.plot(host, {
        xmin: -5, xmax: 5, ymin: -3.5, ymax: 3.5, height: 210,
        ylabel: 'f',
        handles: { X: { x: 1.5, y: 0, label: '', color: 2, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, -5, 5); } } },
        draw: function (g) {
          var F = fns[cual];
          g.fn(F.f, { color: 0, w: 2.6 });
          var x = g.h('X').x;
          g.vline(x, { color: 2, dash: true, w: 1.3 });
          g.point(x, F.f(x), { color: 0, r: 5.5 });
          g.fn(function (t) { return F.f(x) + F.d(x) * (t - x); }, { color: 2, w: 1.8, from: x - 2, to: x + 2 });
        }
      });
      var p2 = W.plot(host, {
        xmin: -5, xmax: 5, ymin: -3.5, ymax: 3.5, height: 210,
        ylabel: "f'",
        draw: function (g) {
          var F = fns[cual];
          g.fn(F.d, { color: 1, w: 2.6 });
          var x = p1.h('X').x;
          g.vline(x, { color: 2, dash: true, w: 1.3 });
          g.point(x, F.d(x), { color: 1, r: 5.5 });
          g.hline(0, { color: 'axis', w: 1 });
        }
      });
      p1.o.onDrag = function () { p2.render(); paint(); };
      function paint() {
        var F = fns[cual], x = p1.h('X').x;
        out.set('$' + F.t + '$ &nbsp;·&nbsp; $' + F.dt + '$<br>' +
          'En $x = ' + U.fmt(x, 2) + '$: &nbsp; $f(x) = ' + U.fmt(F.f(x), 3) + '$ &nbsp;·&nbsp; ' +
          '$f\'(x) = ' + U.fmt(F.d(x), 3) + '$ → la curva ' +
          (Math.abs(F.d(x)) < 0.05 ? '<strong>está horizontal</strong> (posible máximo o mínimo)'
            : (F.d(x) > 0 ? '<strong>sube</strong>' : '<strong>baja</strong>')));
      }
      W.chips(host, [
        { label: 'cúbica', value: 'cubica' }, { label: 'parábola', value: 'cuad' },
        { label: 'seno', value: 'seno' }, { label: 'exponencial', value: 'exp' }
      ], { value: 'cubica', on: function (v) { cual = v; p1.render(); p2.render(); paint(); } });
      W.hint(host, 'Arrastra el punto rojo del gráfico de arriba.');
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La recta tangente');

  p.text('Con la derivada ya se puede escribir la ecuación de la tangente en un punto: es una recta ' +
    'que pasa por $(a, f(a))$ con pendiente $f\'(a)$. Es la fórmula punto-pendiente de siempre.');

  p.formula('y = f(a) + f\'(a)\\,(x - a)', 'recta tangente en x = a');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Deriva un polinomio',
    level: 'basico',
    gen: function (r) {
      var c = [r.nz(-5, 5), r.nz(-6, 6), r.nz(-6, 6), r.pm(1, 9)];
      var x = r.pm(1, 4);
      var der = [3 * c[0], 2 * c[1], c[2]];
      return { c: c, der: der, x: x, val: ML.polyEval(der, x) };
    },
    ask: function (d) {
      return 'Si $f(x) = ' + ML.polyTex(d.c) + '$, calcula $f\'(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: "f'(" + d.x + ') =', w: 'tiny' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Cada $x^n$ pasa a $n\\,x^{n-1}$, y la constante desaparece. Después sustituye.'; },
    steps: function (d) {
      return ['Derivamos término a término: $f\'(x) = ' + ML.polyTex(d.der) + '$.',
        'La constante $' + d.c[3] + '$ desaparece: su derivada es cero.',
        'Sustituimos $x = ' + d.x + '$.',
        '$f\'(' + d.x + ') = ' + d.val + '$'];
    },
    answer: function (d) { return "f'(x) = " + '$' + ML.polyTex(d.der) + '$, y $f\'(' + d.x + ') = ' + d.val + '$'; }
  });

  p.exercise({
    title: 'Regla del producto',
    level: 'medio',
    gen: function (r) {
      // f = (ax+b)(cx+d)  ->  f' = a(cx+d) + c(ax+b)
      var a = r.nz(-5, 5), b = r.pm(1, 7), c = r.nz(-5, 5), e = r.pm(1, 7);
      var x = r.pm(0, 4);
      var val = a * (c * x + e) + c * (a * x + b);
      return { a: a, b: b, c: c, e: e, x: x, val: val };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\left(' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) +
        '\\right)\\left(' + ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.e, '', 0, false) +
        '\\right)$. Calcula $f\'(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: "f'(" + d.x + ') =', w: 'tiny' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function () { return '$(u\\cdot v)\' = u\'v + uv\'$. También puedes multiplicar primero y derivar después: sale lo mismo.'; },
    steps: function (d) {
      return ['Llamamos $u = ' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) +
        '$ y $v = ' + ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.e, '', 0, false) + '$.',
        '$u\' = ' + d.a + '$ y $v\' = ' + d.c + '$.',
        '$f\' = u\'v + uv\' = ' + d.a + '\\left(' + ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.e, '', 0, false) +
        '\\right) + ' + d.c + '\\left(' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + '\\right)$',
        'Sustituyendo $x = ' + d.x + '$: $f\'(' + d.x + ') = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Regla de la cadena',
    level: 'avanzado',
    gen: function (r) {
      // f = (ax^2 + b)^n  ->  f' = n(ax^2+b)^(n-1) * 2ax
      var a = r.nz(-4, 4), b = r.pm(1, 6), n = r.int(2, 4);
      var x = r.pm(1, 3);
      var inner = a * x * x + b;
      if (inner === 0) return null;
      var val = n * Math.pow(inner, n - 1) * 2 * a * x;
      if (Math.abs(val) > 1e7) return null;
      return { a: a, b: b, n: n, x: x, inner: inner, val: val };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\left(' + ML.termTex(d.a, 'x', 2, true) + ML.termTex(d.b, '', 0, false) +
        '\\right)^{' + d.n + '}$. Calcula $f\'(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: "f'(" + d.x + ') =', w: 'wide' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return 'Deriva la potencia dejando el paréntesis tal cual, y multiplica por la derivada de dentro, que es $' +
        ML.termTex(2 * d.a, 'x', 1, true) + '$.';
    },
    steps: function (d) {
      var dentro = ML.termTex(d.a, 'x', 2, true) + ML.termTex(d.b, '', 0, false);
      return ['Función de fuera: elevar a $' + d.n + '$. Función de dentro: $' + dentro + '$.',
        'Derivada de fuera dejando lo de dentro quieto: $' + d.n + '\\left(' + dentro + '\\right)^{' + (d.n - 1) + '}$.',
        'Derivada de dentro: $' + ML.termTex(2 * d.a, 'x', 1, true) + '$.',
        'Se multiplican: $f\'(x) = ' + d.n + '\\left(' + dentro + '\\right)^{' + (d.n - 1) + '} \\cdot ' +
        ML.termTex(2 * d.a, 'x', 1, true) + '$.',
        'En $x = ' + d.x + '$: el paréntesis vale $' + d.inner + '$, así que ' +
        '$f\' = ' + d.n + '\\cdot ' + d.inner + '^{' + (d.n - 1) + '} \\cdot ' + (2 * d.a * d.x) + ' = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Recta tangente',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-3, 3), b = r.pm(1, 6), c = r.pm(1, 8);
      var x = r.pm(0, 4);
      var fa = a * x * x + b * x + c;
      var m = 2 * a * x + b;
      return { a: a, b: b, c: c, x: x, fa: fa, m: m, n: fa - m * x };
    },
    ask: function (d) {
      return 'Halla la recta tangente a $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) + '$ en $x = ' + d.x +
        '$. Da su pendiente y su ordenada en el origen.';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: d.x - 5, xmax: d.x + 5, ymin: d.fa - 12, ymax: d.fa + 12, height: 230,
        draw: function (g) {
          g.fn(function (t) { return d.a * t * t + d.b * t + d.c; }, { color: 0, w: 2.6 });
          g.fn(function (t) { return d.m * t + d.n; }, { color: 2, w: 2 });
          g.point(d.x, d.fa, { color: 1, r: 5.5 });
        }
      });
    },
    fields: [{ name: 'm', label: 'Pendiente', w: 'tiny' }, { name: 'n', label: 'Ordenada', w: 'tiny' }],
    sol: function (d) { return { m: d.m, n: d.n }; },
    hint: function (d) { return 'La pendiente es $f\'(' + d.x + ')$ y el punto de paso es $(' + d.x + ', ' + d.fa + ')$.'; },
    steps: function (d) {
      return ['$f\'(x) = ' + ML.termTex(2 * d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + '$',
        'Pendiente: $f\'(' + d.x + ') = ' + d.m + '$.',
        'Punto de paso: $f(' + d.x + ') = ' + d.fa + '$.',
        'Recta: $y = ' + d.fa + ' + ' + d.m + '(x - (' + d.x + '))$',
        'Desarrollando: $y = ' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + '$.'];
    },
    answer: function (d) { return '$y = ' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + '$'; }
  });

  p.keys([
    'La derivada es el límite del cociente incremental: la pendiente de la tangente.',
    'Dos lecturas de lo mismo: pendiente (geometría) y ritmo de cambio instantáneo (física).',
    '$(x^n)\' = n\\,x^{n-1}$ resuelve casi todo lo polinómico.',
    'Producto: $u\'v + uv\'$. Cociente: $\\frac{u\'v - uv\'}{v^2}$. No son el producto ni el cociente de las derivadas.',
    'Cadena: deriva lo de fuera dejando lo de dentro, y multiplica por la derivada de dentro.',
    'Tangente en $a$: $y = f(a) + f\'(a)(x-a)$.',
    'Donde hay máximo o mínimo, la derivada vale cero.'
  ]);
});
