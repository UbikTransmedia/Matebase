/* Tema: Integrales racionales y otras técnicas */
Course.topic('fn-integral-racional', function (p) {

  var F = ML.F;
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function menos(a) { return a === 0 ? 'x' : (a > 0 ? 'x - ' + a : 'x + ' + (-a)); }

  p.text('Una función racional es un cociente de polinomios, como $\\frac{3x + 1}{x^2 - 1}$. Casi ' +
    'ninguna es inmediata, y sin embargo <strong>todas se pueden integrar</strong>: hay un método que ' +
    'funciona siempre, y consiste en partir la fracción en trozos que sí se saben integrar. Es el ' +
    'mismo tipo de trabajo que las [[al-fracciones-alg|fracciones algebraicas]], hecho al revés: en ' +
    'vez de sumar fracciones, se descompone una.');

  p.text('Antes de la receta, conviene tener a mano las cuatro primitivas en las que termina siempre:');

  p.formulas([
    '\\int \\frac{f\'(x)}{f(x)}\\,dx = \\ln|f(x)| + C \\qquad \\int \\frac{dx}{x - a} = \\ln|x - a| + C',
    '\\int \\frac{dx}{(x - a)^2} = -\\frac{1}{x - a} + C \\qquad \\int \\frac{dx}{x^2 + k^2} = \\frac{1}{k}\\arctan\\frac{x}{k} + C'
  ], 'las cuatro piezas de toda integral racional',
    'La primera es la clave de todo el tema: si arriba está exactamente la derivada de lo de abajo, el ' +
      'resultado es el logaritmo de lo de abajo. Se reconoce comprobando si el numerador es la derivada ' +
      'del denominador, o un múltiplo suyo.<br><br>El valor absoluto dentro del logaritmo no es un ' +
      'adorno: $\\frac{1}{x}$ existe también para $x$ negativo, y su primitiva tiene que existir ahí.<br><br>' +
      '$\\arctan$ se lee «arcotangente»: el ángulo cuya tangente es ese número.');

  /* ---------------------------------------------------------------- */
  p.section('Primer paso: ¿hay que dividir?');

  p.text('Si el grado del numerador es <strong>mayor o igual</strong> que el del denominador, se divide ' +
    'primero. La división da un polinomio, que se integra directamente, más una fracción en la que el ' +
    'numerador ya tiene menos grado que el denominador.');

  p.formula('\\frac{P(x)}{Q(x)} = C(x) + \\frac{R(x)}{Q(x)}, \\qquad \\text{grado de } R < \\text{grado de } Q',
    'dividir antes de descomponer',
    '$C(x)$ es el cociente y $R(x)$ el resto de dividir $P$ entre $Q$, como en la división entera: ' +
      '$\\frac{17}{5} = 3 + \\frac{2}{5}$.<br><br>Ejemplo: $\\frac{x^2 + 1}{x - 1} = x + 1 + \\frac{2}{x - 1}$, ' +
      'así que su integral es $\\frac{x^2}{2} + x + 2\\ln|x - 1| + C$.');

  /* ---------------------------------------------------------------- */
  p.section('Segundo paso: descomponer en fracciones simples');

  p.text('Con el grado de arriba ya menor, se factoriza el denominador y cada factor aporta unos ' +
    'sumandos con coeficientes por determinar:');

  p.table(['El denominador tiene…', 'aporta los sumandos', 'que se integran como'],
    [['una raíz real simple $a$', '$\\dfrac{A}{x - a}$', '$A\\ln|x - a|$'],
     ['una raíz real doble $a$', '$\\dfrac{A}{x - a} + \\dfrac{B}{(x - a)^2}$', '$A\\ln|x - a| - \\dfrac{B}{x - a}$'],
     ['un factor $x^2 + px + q$ sin raíces reales', '$\\dfrac{Mx + N}{x^2 + px + q}$', 'un logaritmo más una arcotangente']]);

  p.text('Para hallar los coeficientes se escribe la igualdad, se quitan denominadores y se usa el ' +
    'atajo más rápido: <strong>dar a $x$ el valor de cada raíz</strong>. Al sustituir $x = a$, todos ' +
    'los términos que llevan el factor $(x - a)$ se anulan y queda despejado un coeficiente de golpe. ' +
    'Si hay raíces dobles o factores irreducibles, se completa igualando coeficientes.');

  p.formula('\\frac{3x + 1}{(x - 1)(x + 1)} = \\frac{A}{x - 1} + \\frac{B}{x + 1} \\ \\Rightarrow\\ 3x + 1 = A(x + 1) + B(x - 1)',
    'un ejemplo de principio a fin',
    'Quitados los denominadores, se sustituye $x = 1$: $4 = 2A$, así que $A = 2$. Se sustituye ' +
      '$x = -1$: $-2 = -2B$, así que $B = 1$.<br><br>Por tanto $\\int \\frac{3x + 1}{x^2 - 1}\\,dx = ' +
      '2\\ln|x - 1| + \\ln|x + 1| + C$.<br><br>Comprobarlo es fácil y conviene hacerlo: $\\frac{2}{x-1} + ' +
      '\\frac{1}{x+1}$ con denominador común vuelve a dar la fracción de partida.');

  p.demo({
    title: 'Dos fracciones simples que suman una',
    intro: 'La curva gruesa es f(x) = (px + q) / ((x − a)(x − b)). Las dos de trazos son A/(x − a) y B/(x − b). Cambia los números: los coeficientes se recalculan y la suma de las dos de trazos coincide siempre con la gruesa.',
    build: function (host) {
      var a = 1, b = -2, pp = 3, q = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -5, xmax: 5, ymin: -6, ymax: 6, height: 320,
        draw: function (g) {
          if (a === b) return;
          var A = (pp * a + q) / (a - b), B = (pp * b + q) / (b - a);
          g.fn(function (x) { return A / (x - a); }, { color: 1, w: 1.8, dash: true });
          g.fn(function (x) { return B / (x - b); }, { color: 2, w: 1.8, dash: true });
          g.fn(function (x) { return (pp * x + q) / ((x - a) * (x - b)); }, { color: 0, w: 3 });
          g.vline(a, { color: 'axis', w: 1, dash: [3, 5] });
          g.vline(b, { color: 'axis', w: 1, dash: [3, 5] });
        }
      });
      function pinta() {
        if (a === b) { out.set('<strong style="color:var(--bad)">Con a = b la raíz es doble:</strong> hace falta otra forma de descomponer, con $\\frac{A}{x-a} + \\frac{B}{(x-a)^2}$.'); plot.render(); return; }
        var A = F(pp * a + q, a - b), B = F(pp * b + q, b - a);
        out.set('$\\dfrac{' + ML.polyTex([pp, q]) + '}{(' + menos(a) + ')(' + menos(b) + ')} = \\dfrac{' + A.tex() + '}{' + menos(a) + '} + \\dfrac{' + B.tex() + '}{' + menos(b) + '}$<br>' +
          'Primitiva: $' + A.tex() + '\\ln|' + menos(a) + '| ' + (B.n < 0 ? '' : '+ ') + B.tex() + '\\ln|' + menos(b) + '| + C$');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'raíz a', min: -3, max: 3, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'raíz b', min: -3, max: 3, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      var fila2 = W.row(host);
      W.slider(fila2, { label: 'p (numerador)', min: -4, max: 4, step: 1, value: pp, on: function (v) { pp = v; pinta(); } });
      W.slider(fila2, { label: 'q (numerador)', min: -4, max: 4, step: 1, value: q, on: function (v) { q = v; pinta(); } });
      pinta();
    }
  });

  p.sub('El caso sin raíces reales: completar el cuadrado');

  p.text('Si el denominador es $x^2 + px + q$ con discriminante negativo, no se puede factorizar. Se ' +
    'completa el cuadrado para llevarlo a la forma $(x + \\frac{p}{2})^2 + k^2$, y con el cambio ' +
    '$t = x + \\frac{p}{2}$ la integral se convierte en la arcotangente de la tabla. Si además hay una ' +
    '$x$ en el numerador, primero se separa la parte que es la derivada del denominador, que da un ' +
    'logaritmo.');

  p.formula('\\int \\frac{dx}{x^2 + 2x + 5} = \\int \\frac{dx}{(x + 1)^2 + 2^2} = \\frac{1}{2}\\arctan\\frac{x + 1}{2} + C',
    'completar el cuadrado',
    '$x^2 + 2x + 5 = (x^2 + 2x + 1) + 4 = (x+1)^2 + 4$: se suma y se resta lo que hace falta para ' +
      'tener un cuadrado perfecto.<br><br>Con $t = x + 1$ queda $\\int \\frac{dt}{t^2 + 2^2}$, que es ' +
      '$\\frac{1}{2}\\arctan\\frac{t}{2}$.');

  p.hist('La descomposición en fracciones simples la propusieron a la vez, en 1702, Gottfried Leibniz y ' +
    'Johann Bernoulli, que buscaban una manera de integrar cualquier función racional. En seguida ' +
    'tropezaron con una pregunta incómoda: si $\\int \\frac{dx}{x}$ es un logaritmo, ¿qué es el logaritmo ' +
    'de un número negativo? Se escribieron cartas durante años sin ponerse de acuerdo. Leibniz decía que ' +
    'no existía; Bernoulli, que era igual que el del positivo. Lo resolvió Euler en 1749, con los ' +
    'números complejos, y por el camino dejó la razón de ese valor absoluto que hoy se escribe sin ' +
    'pensar.');

  /* ---------------------------------------------------------------- */
  p.section('Por partes, dos veces: la integral que vuelve');

  p.text('Algunas integrales por partes, como $\\int e^x \\operatorname{sen} x\\,dx$, parecen no acabar ' +
    'nunca: al integrar por partes dos veces vuelve a aparecer la integral de partida. Lejos de ser un ' +
    'fracaso, es la solución: se llama $I$ a la integral, se escribe la igualdad y se <strong>despeja ' +
    '$I$</strong> como en una ecuación.');

  p.formula('I = e^x\\operatorname{sen} x - e^x\\cos x - I \\ \\Rightarrow\\ 2I = e^x(\\operatorname{sen} x - \\cos x) \\ \\Rightarrow\\ I = \\frac{e^x(\\operatorname{sen} x - \\cos x)}{2} + C',
    'integración por partes cíclica',
    'Primera vuelta, con $u = \\operatorname{sen} x$ y $dv = e^x dx$: $I = e^x\\operatorname{sen} x - \\int e^x\\cos x\\,dx$.<br><br>' +
      'Segunda vuelta sobre esa nueva integral, con $u = \\cos x$: $\\int e^x\\cos x\\,dx = e^x\\cos x + ' +
      '\\int e^x\\operatorname{sen} x\\,dx = e^x\\cos x + I$.<br><br>Sustituyendo, $I$ aparece a los dos lados ' +
      'y se despeja. La clave es mantener en las dos vueltas la misma elección: la exponencial siempre ' +
      'como $dv$.');

  p.util('Las fracciones simples son una de las herramientas más usadas de la ingeniería de control. ' +
    'Para saber cómo responde un sistema —un amortiguador, un circuito, un termostato— se trabaja con ' +
    'su <em>función de transferencia</em>, que es una fracción de polinomios, y para volver al tiempo ' +
    'real se descompone en fracciones simples: cada raíz del denominador es un modo de comportamiento, ' +
    'que se apaga o se dispara según su signo. En biología, la ecuación logística del crecimiento de ' +
    'una población se resuelve exactamente con esta descomposición.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El numerador es la derivada del denominador',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(1, 3), b = r.pm(0, 6), c = r.pm(1, 9), kk = r.pick([1, 2, 3, -1]);
      var x1 = r.int(0, 3);
      var den = a * x1 * x1 + b * x1 + c;
      if (den === 0) return null;
      return { a: a, b: b, c: c, k: kk, x1: x1, den: den, v: kk * Math.log(Math.abs(den)) };
    },
    ask: function (d) {
      var num = ML.polyTex([d.k * 2 * d.a, d.k * d.b]);
      return 'Calcula $\\displaystyle\\int \\frac{' + num + '}{' + ML.polyTex([d.a, d.b, d.c]) + '}\\,dx$ tomando $C = 0$, y evalúa la primitiva en $x = ' + d.x1 + '$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'valor', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 3e-4,
    hint: function (d) {
      return ['Deriva el denominador: $(' + ML.polyTex([d.a, d.b, d.c]) + ')\' = ' + ML.polyTex([2 * d.a, d.b]) + '$.',
        'El numerador es ' + (d.k === 1 ? 'exactamente eso' : '$' + d.k + '$ veces eso') + ': la integral es $' + (d.k === 1 ? '' : d.k) + '\\ln|\\text{denominador}|$.'];
    },
    steps: function (d) {
      return ['El numerador es $' + d.k + '$ veces la derivada del denominador.',
        '$\\displaystyle\\int = ' + d.k + '\\ln|' + ML.polyTex([d.a, d.b, d.c]) + '| + C$',
        'En $x = ' + d.x1 + '$: $' + d.k + '\\ln|' + d.den + '| \\approx ' + U.fmt(d.v, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'Descomponer en fracciones simples',
    level: 'medio',
    gen: function (r) {
      var a = r.int(-4, 4), b = r.int(-4, 4);
      if (a === b) return null;
      var pp = r.pm(0, 5), q = r.pm(0, 6);
      if (pp * a + q === 0 || pp * b + q === 0) return null;
      return { a: a, b: b, p: pp, q: q, A: F(pp * a + q, a - b), B: F(pp * b + q, b - a) };
    },
    ask: function (d) {
      return 'Halla $A$ y $B$ tales que $\\dfrac{' + ML.polyTex([d.p, d.q]) + '}{(' + menos(d.a) + ')(' + menos(d.b) + ')} = \\dfrac{A}{' + menos(d.a) + '} + \\dfrac{B}{' + menos(d.b) + '}$. (Valen fracciones.)';
    },
    fields: [{ name: 'A', label: 'A =', w: 'tiny' }, { name: 'B', label: 'B =', w: 'tiny' }],
    sol: function (d) { return { A: d.A.val(), B: d.B.val() }; },
    tol: 1e-9,
    errores: [{
      si: function (v, d) { return !d.A.eq(d.B) && Math.abs(v.A - d.B.val()) < 1e-9 && Math.abs(v.B - d.A.val()) < 1e-9; },
      msg: 'Están intercambiados: al sustituir $x$ por la raíz de un factor, el coeficiente que se despeja es el de <em>ese</em> factor.'
    }],
    hint: function (d) {
      return ['Quita denominadores: $' + ML.polyTex([d.p, d.q]) + ' = A(' + menos(d.b) + ') + B(' + menos(d.a) + ')$.',
        'Sustituye $x = ' + d.a + '$: se anula el término de $B$ y queda $A$ despejada. Luego $x = ' + d.b + '$.'];
    },
    steps: function (d) {
      return ['$' + ML.polyTex([d.p, d.q]) + ' = A(' + menos(d.b) + ') + B(' + menos(d.a) + ')$',
        '$x = ' + d.a + '$: $' + (d.p * d.a + d.q) + ' = ' + (d.a - d.b) + 'A \\Rightarrow A = ' + d.A.tex() + '$',
        '$x = ' + d.b + '$: $' + (d.p * d.b + d.q) + ' = ' + (d.b - d.a) + 'B \\Rightarrow B = ' + d.B.tex() + '$'];
    },
    answer: function (d) { return '$A = ' + d.A.tex() + '$, $B = ' + d.B.tex() + '$'; }
  });

  p.exercise({
    title: 'Una arcotangente',
    level: 'medio',
    gen: function (r) {
      var kk = r.int(1, 5), m = r.pick([1, 2, 3]);
      return { k: kk, m: m, v: m * Math.PI / (4 * kk) };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\int_0^{' + d.k + '} \\frac{' + d.m + '}{x^2 + ' + (d.k * d.k) + '}\\,dx$ (cuatro decimales, o con <em>pi</em>).';
    },
    fields: [{ name: 'v', label: 'valor', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 3e-4,
    errores: [{
      si: function (v, d) { return d.k !== 1 && Math.abs(v.v - d.m * Math.PI / 4) < 1e-3; },
      msg: 'Falta el factor $\\frac{1}{k}$: $\\int \\frac{dx}{x^2 + k^2} = \\frac{1}{k}\\arctan\\frac{x}{k}$.'
    }],
    hint: function (d) { return ['$\\int \\frac{dx}{x^2 + k^2} = \\frac{1}{k}\\arctan\\frac{x}{k}$, con $k = ' + d.k + '$.', 'Recuerda que $\\arctan 1 = \\frac{\\pi}{4}$ y $\\arctan 0 = 0$.']; },
    steps: function (d) {
      return ['Primitiva: $' + d.m + '\\cdot\\frac{1}{' + d.k + '}\\arctan\\frac{x}{' + d.k + '}$',
        'Barrow: $\\frac{' + d.m + '}{' + d.k + '}\\left(\\arctan 1 - \\arctan 0\\right) = \\frac{' + d.m + '\\pi}{' + (4 * d.k) + '} \\approx ' + U.fmt(d.v, 4) + '$'];
    },
    answer: function (d) { return '$\\frac{' + d.m + '\\pi}{' + (4 * d.k) + '}$'; }
  });

  p.problem({
    title: 'Integral racional de principio a fin',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(-3, 3), b = r.int(-3, 3);
      if (a === b) return null;
      var pp = r.pm(1, 4), q = r.pm(0, 5);
      var A = F(pp * a + q, a - b), B = F(pp * b + q, b - a);
      if (A.n === 0 || B.n === 0) return null;
      var x1 = r.pick([4, 5, 6]);
      var v = A.val() * Math.log(Math.abs(x1 - a)) + B.val() * Math.log(Math.abs(x1 - b));
      return { a: a, b: b, p: pp, q: q, A: A, B: B, x1: x1, v: v };
    },
    intro: function (d) {
      return 'Se quiere calcular $\\displaystyle\\int \\frac{' + ML.polyTex([d.p, d.q]) + '}{' + ML.polyTex([1, -(d.a + d.b), d.a * d.b]) + '}\\,dx$.';
    },
    partes: [
      {
        ask: function () { return 'Factoriza el denominador: ¿cuáles son sus raíces? Sepáralas con punto y coma.'; },
        fields: [{ name: 'r', label: 'raíces', w: 'wide' }],
        sol: function (d) { return { r: d.a + '; ' + d.b }; },
        check: function (v, d) {
          if (!String(v.raw.r || '').trim()) return { ok: false, msg: 'Escribe las dos raíces separadas por punto y coma.' };
          return Ex.sameSet(v.raw.r, [d.a, d.b]);
        },
        hint: function () { return 'Resuelve la ecuación de segundo grado del denominador.'; },
        steps: function (d) { return ['$' + ML.polyTex([1, -(d.a + d.b), d.a * d.b]) + ' = (' + menos(d.a) + ')(' + menos(d.b) + ')$']; },
        answer: function (d) { return d.a + ' y ' + d.b; }
      },
      {
        ask: function (d) { return 'Descompón: ¿cuánto valen $A$ (el de $' + menos(d.a) + '$) y $B$ (el de $' + menos(d.b) + '$)?'; },
        fields: [{ name: 'A', label: 'A =', w: 'tiny' }, { name: 'B', label: 'B =', w: 'tiny' }],
        sol: function (d) { return { A: d.A.val(), B: d.B.val() }; },
        tol: 1e-9,
        hint: function () { return 'Quita denominadores y da a $x$ el valor de cada raíz.'; },
        steps: function (d) { return ['$A = \\frac{' + (d.p * d.a + d.q) + '}{' + (d.a - d.b) + '} = ' + d.A.tex() + '$ y $B = \\frac{' + (d.p * d.b + d.q) + '}{' + (d.b - d.a) + '} = ' + d.B.tex() + '$']; },
        answer: function (d) { return '$A = ' + d.A.tex() + '$, $B = ' + d.B.tex() + '$'; }
      },
      {
        ask: function (d) { return 'Con $C = 0$, evalúa la primitiva en $x = ' + d.x1 + '$ (cuatro decimales).'; },
        fields: [{ name: 'v', label: 'valor', w: 'wide' }],
        sol: function (d) { return { v: U.round(d.v, 6) }; },
        tol: 3e-4,
        hint: function () { return 'La primitiva es $A\\ln|x - a| + B\\ln|x - b|$.'; },
        steps: function (d) {
          return ['$F(x) = ' + d.A.tex() + '\\ln|' + menos(d.a) + '| + ' + d.B.texp() + '\\ln|' + menos(d.b) + '|$',
            '$F(' + d.x1 + ') = ' + d.A.tex() + '\\ln ' + Math.abs(d.x1 - d.a) + ' + ' + d.B.texp() + '\\ln ' + Math.abs(d.x1 - d.b) + ' \\approx ' + U.fmt(d.v, 4) + '$'];
        },
        answer: function (d) { return U.fmt(d.v, 4); }
      }
    ]
  });

  p.exercise({
    title: 'Por partes, dos veces',
    level: 'avanzado',
    gen: function (r) {
      var kk = r.pick([1, 2, -1]);
      return { k: kk, v: (Math.exp(kk * Math.PI) + 1) / (kk * kk + 1) };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\int_0^{\\pi} e^{' + (d.k === 1 ? '' : (d.k === -1 ? '-' : d.k)) + 'x}\\operatorname{sen} x\\,dx$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'valor', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 3e-4,
    hint: function (d) {
      return ['Por partes con $dv = e^{' + d.k + 'x}dx$ dos veces: vuelve a aparecer la integral de partida.',
        'Despejando, $\\int e^{kx}\\operatorname{sen} x\\,dx = \\frac{e^{kx}(k\\operatorname{sen} x - \\cos x)}{k^2 + 1}$.',
        'Aplica Barrow entre $0$ y $\\pi$: $\\operatorname{sen}\\pi = 0$ y $\\cos\\pi = -1$.'];
    },
    steps: function (d) {
      return ['Por partes cíclica: $\\displaystyle\\int e^{' + d.k + 'x}\\operatorname{sen} x\\,dx = \\frac{e^{' + d.k + 'x}(' + d.k + '\\operatorname{sen} x - \\cos x)}{' + (d.k * d.k + 1) + '} + C$',
        'Barrow: $\\frac{e^{' + d.k + '\\pi}(0 + 1)}{' + (d.k * d.k + 1) + '} - \\frac{1\\cdot(0 - 1)}{' + (d.k * d.k + 1) + '} = \\frac{e^{' + d.k + '\\pi} + 1}{' + (d.k * d.k + 1) + '} \\approx ' + U.fmt(d.v, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.keys([
    'Si el numerador es la derivada del denominador: $\\int \\frac{f\'}{f} = \\ln|f| + C$.',
    'Si el grado de arriba es mayor o igual que el de abajo, primero se divide.',
    'Raíces simples: $\\frac{A}{x-a}$; dobles: $\\frac{A}{x-a} + \\frac{B}{(x-a)^2}$; factor sin raíces: $\\frac{Mx+N}{x^2+px+q}$.',
    'Los coeficientes salen quitando denominadores y dando a $x$ el valor de cada raíz.',
    'Sin raíces reales: completar el cuadrado y llegar a $\\frac{1}{k}\\arctan\\frac{x}{k}$.',
    'Por partes cíclica: cuando vuelve la integral de partida, se llama $I$ y se despeja.'
  ]);
});
