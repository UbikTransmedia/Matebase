/* Tema: Ecuaciones exponenciales y logarítmicas */
Course.topic('al-radicales-log', function (p) {

  p.text('Hasta ahora la incógnita siempre estaba en la base: $x^2$, $3x$. ¿Y si está ' +
    '<strong>en el exponente</strong>? $2^x = 8$ se resuelve a ojo ($x=3$), pero $2^x = 10$ no. ' +
    'Hace falta una operación nueva que deshaga la exponencial: el <strong>logaritmo</strong>.');

  p.formula('\\log_a b = c \\iff a^c = b', 'definición de logaritmo');

  p.text('En palabras: <em>el logaritmo en base $a$ de $b$ es el exponente al que hay que elevar $a$ ' +
    'para obtener $b$</em>. Es literalmente «el exponente que falta».');

  p.formulas([
    '\\log_2 8 = 3 \\quad\\text{porque}\\quad 2^3 = 8',
    '\\log_{10} 1000 = 3 \\quad\\text{porque}\\quad 10^3 = 1000',
    '\\log_5 1 = 0 \\quad\\text{porque}\\quad 5^0 = 1'
  ]);

  p.note('Dos bases tienen nombre propio: $\\log x$ (sin base) significa base 10, y $\\ln x$ es el ' +
    '<em>logaritmo neperiano</em>, de base $e \\approx 2{,}71828$. En matemáticas superiores «log» ' +
    'casi siempre quiere decir «ln».', null, 'Notación');

  p.hist('John Napier publicó las primeras tablas de logaritmos en 1614 con un objetivo puramente ' +
    'práctico: convertir multiplicaciones en sumas, que son mucho más rápidas de hacer a mano. Para ' +
    'los astrónomos fue una revolución; se dice que «duplicó la vida del astrónomo». De ahí salió la ' +
    'regla de cálculo, que llevó al hombre a la Luna y no se jubiló hasta que llegaron las ' +
    'calculadoras de bolsillo, en los años setenta.');

  p.demo({
    title: 'Exponencial y logaritmo son la misma curva reflejada',
    intro: 'Una función deshace lo que hace la otra. Sus gráficas son simétricas respecto de la recta y = x.',
    build: function (host, d) {
      var base = 2;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 8, ymin: -4, ymax: 8, height: 350, equal: true,
        handles: {
          P: { x: 2, y: 0, label: '', color: 2, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, -3.5, 7.5); } }
        },
        draw: function (g) {
          g.fn(function (x) { return Math.pow(base, x); }, { color: 0, w: 2.6 });
          g.fn(function (x) { return x > 0.001 ? Math.log(x) / Math.log(base) : NaN; }, { color: 1, w: 2.6 });
          g.fn(function (x) { return x; }, { color: 'axis', w: 1.4, dash: true });
          var x = g.h('P').x;
          var y = Math.pow(base, x);
          if (y < 8 && y > -4) {
            g.point(x, y, { color: 0, r: 5.5 });
            g.point(y, x, { color: 1, r: 5.5 });
            g.seg(x, y, y, x, { color: 2, w: 1.3, dash: true });
          }
          out.set('$' + base + '^{' + U.fmt(x, 2) + '} = ' + U.fmt(y, 4) + '$ &nbsp;⟺&nbsp; ' +
            '$\\log_{' + base + '} ' + U.fmt(y, 4) + ' = ' + U.fmt(x, 2) + '$<br>' +
            '<span style="font-size:12.5px;color:var(--ink-faint)">El punto $(' + U.fmt(x, 2) + ', ' +
            U.fmt(y, 2) + ')$ de la exponencial se convierte en $(' + U.fmt(y, 2) + ', ' + U.fmt(x, 2) +
            ')$ del logaritmo: se intercambian las coordenadas.</span>');
        }
      });
      W.slider(W.row(host), { label: 'base a', min: 1.5, max: 5, step: 0.5, value: 2, dec: 1, on: function (v) { base = v; plot.render(); } });
      W.legend(host, [{ c: 0, t: '$a^x$' }, { c: 1, t: '$\\log_a x$' }]);
      W.hint(host, 'Arrastra el punto rojo por el eje horizontal.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Propiedades de los logaritmos');

  p.text('Cada propiedad del logaritmo es una propiedad de las potencias vista del revés. Por eso no ' +
    'hay que memorizarlas por separado:');

  p.formulas([
    '\\log_a (x\\cdot y) = \\log_a x + \\log_a y',
    '\\log_a \\frac{x}{y} = \\log_a x - \\log_a y',
    '\\log_a x^n = n \\log_a x',
    '\\log_a a = 1 \\qquad \\log_a 1 = 0'
  ], 'las cuatro propiedades');

  p.text('La tercera es la más útil de todas: <strong>baja el exponente</strong>, y es exactamente lo ' +
    'que necesitamos para despejar una incógnita que está arriba.');

  p.sub('Cambio de base');

  p.text('La calculadora solo tiene $\\log$ y $\\ln$. Para cualquier otra base:');

  p.formula('\\log_a b = \\frac{\\ln b}{\\ln a} = \\frac{\\log b}{\\log a}');

  p.note('El logaritmo <strong>no</strong> reparte sobre las sumas: $\\log(x+y) \\ne \\log x + \\log y$. ' +
    'Lo que convierte productos en sumas, no sumas en nada.', 'warn');

  /* ---------------------------------------------------------------- */
  p.util('La propiedad de que el logaritmo convierte productos en sumas cambió la historia de la ciencia: ' +
    'durante trescientos años, astrónomos y navegantes multiplicaban números enormes buscándolos en ' +
    'tablas de logaritmos, sumando y deshaciendo, porque sumar es muchísimo más rápido que ' +
    'multiplicar a mano. La regla de cálculo, que llevó al hombre a la Luna, no era más que dos ' +
    'logaritmos deslizando uno sobre otro.');

  p.section('Resolver ecuaciones exponenciales');

  p.list([
    '<strong>Si se pueden igualar las bases</strong>, se igualan los exponentes: $2^{x+1} = 8 = 2^3 \\Rightarrow x+1 = 3$.',
    '<strong>Si no</strong>, se toman logaritmos en los dos lados y se baja el exponente.',
    'Si aparece $a^{2x}$ junto a $a^x$, el truco es el <strong>cambio de variable</strong> $t = a^x$: queda una ecuación de segundo grado.'
  ], true);

  p.formula('3^{2x} - 4\\cdot 3^x + 3 = 0 \\ \\xrightarrow{\\ t = 3^x\\ } \\ t^2 - 4t + 3 = 0');

  p.sub('Y las logarítmicas');

  p.text('Se juntan todos los logaritmos en uno solo usando las propiedades, y se aplica la ' +
    'definición para quitarlo.');

  p.note('En las ecuaciones logarítmicas es <strong>obligatorio comprobar</strong> las soluciones al ' +
    'final: el logaritmo solo existe para números positivos, así que puede salir una solución ' +
    'algebraicamente correcta pero imposible. Se descarta.', 'warn', 'No te saltes la comprobación');

  /* ================= EJERCICIOS ================= */
  p.util('Estas ecuaciones responden a «¿cuánto tiempo hace falta?». Cuánto tarda una inversión en ' +
    'duplicarse, cuánto tarda un fármaco en bajar a la mitad en sangre —la vida media que viene en ' +
    'el prospecto—, cuántos años tiene un hueso según el carbono 14 que le queda. En los tres casos ' +
    'se conoce el resultado y se busca el exponente, y despejar un exponente es exactamente para lo ' +
    'que se inventó el logaritmo.');

  p.section('Practica');

  p.exercise({
    title: 'Calcula el logaritmo',
    level: 'basico',
    gen: function (r) {
      var a = r.pick([2, 3, 5, 10]);
      var n = r.int(0, 5);
      return { a: a, n: n, b: Math.pow(a, n) };
    },
    ask: function (d) { return 'Calcula $\\log_{' + d.a + '} ' + d.b + '$'; },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.n }; },
    hint: function (d) { return 'Pregúntate: ¿a qué exponente hay que elevar $' + d.a + '$ para obtener $' + d.b + '$?'; },
    steps: function (d) {
      return ['Por definición, $\\log_{' + d.a + '} ' + d.b + ' = c$ significa $' + d.a + '^c = ' + d.b + '$.',
        'Descomponemos: $' + d.b + ' = ' + d.a + '^{' + d.n + '}$.',
        'Por tanto el logaritmo vale $' + d.n + '$.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'Exponencial con bases igualables',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([2, 3, 5]);
      var m = r.nz(-3, 3), n = r.pm(1, 6);
      var x = r.pm(0, 4);
      var exp = m * x + n;
      if (exp < 0 || exp > 8) return null;
      return { a: a, m: m, n: n, x: x, res: Math.pow(a, exp), exp: exp };
    },
    ask: function (d) {
      return 'Resuelve $' + d.a + '^{' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) +
        '} = ' + d.res + '$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    hint: function (d) { return 'Escribe $' + d.res + '$ como potencia de $' + d.a + '$ y después iguala los exponentes.'; },
    steps: function (d) {
      return ['Ponemos el segundo miembro como potencia de la misma base: $' + d.res + ' = ' + d.a + '^{' + d.exp + '}$.',
        'Si las bases son iguales, los exponentes tienen que serlo: $' +
        ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + ' = ' + d.exp + '$.',
        'Resolviendo: $x = ' + d.x + '$.'];
    },
    answer: function (d) { return 'x = ' + d.x; }
  });

  p.exercise({
    title: 'Exponencial con logaritmos',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([2, 3, 5, 7]);
      var b = r.int(11, 200);
      if (Math.abs(Math.log(b) / Math.log(a) - Math.round(Math.log(b) / Math.log(a))) < 1e-9) return null;
      return { a: a, b: b, x: Math.log(b) / Math.log(a) };
    },
    ask: function (d) {
      return 'Resuelve $' + d.a + '^x = ' + d.b + '$ (cuatro decimales).';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.x, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Toma logaritmos en los dos lados. El exponente baja multiplicando.'; },
    steps: function (d) {
      return ['Aplicamos logaritmos a los dos miembros: $\\ln(' + d.a + '^x) = \\ln ' + d.b + '$.',
        'La propiedad del exponente lo baja: $x \\ln ' + d.a + ' = \\ln ' + d.b + '$.',
        '$x = \\dfrac{\\ln ' + d.b + '}{\\ln ' + d.a + '} = \\dfrac{' + U.fmt(Math.log(d.b), 4) + '}{' +
        U.fmt(Math.log(d.a), 4) + '} = ' + U.fmt(d.x, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.x, 4); }
  });

  p.exercise({
    title: 'Ecuación logarítmica',
    level: 'avanzado',
    gen: function (r) {
      // log(x) + log(x - k) = log(m)  con  x(x-k) = m
      var x = r.int(4, 15), k = r.int(1, x - 2);
      var m = x * (x - k);
      return { x: x, k: k, m: m, otra: k - x };
    },
    ask: function (d) {
      return 'Resuelve $\\log x + \\log(x - ' + d.k + ') = \\log ' + d.m + '$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    hint: function () { return 'Junta los dos logaritmos en uno usando $\\log A + \\log B = \\log(AB)$; después quita los logaritmos.'; },
    steps: function (d) {
      var suma = d.k, prod = -d.m;
      return ['Agrupamos: $\\log\\left[x(x-' + d.k + ')\\right] = \\log ' + d.m + '$.',
        'Si los logaritmos son iguales, sus argumentos también: $x(x-' + d.k + ') = ' + d.m + '$.',
        'Queda la ecuación de segundo grado $' + ML.polyTex([1, -d.k, -d.m]) + ' = 0$.',
        'Sus soluciones son $x = ' + d.x + '$ y $x = ' + d.otra + '$.',
        '<strong>Comprobación:</strong> $x = ' + d.otra + '$ es negativa, así que $\\log x$ no existe. Se descarta.',
        'Solución válida: $x = ' + d.x + '$.'];
    },
    answer: function (d) { return 'x = ' + d.x + ' (la otra raíz se descarta por ser negativa).'; }
  });

  p.keys([
    'El logaritmo es el exponente que falta: $\\log_a b = c \\iff a^c = b$.',
    'Exponencial y logaritmo son funciones inversas: sus gráficas son simétricas respecto a $y=x$.',
    '$\\log(xy) = \\log x + \\log y$; $\\log x^n = n\\log x$. Convierte productos en sumas y potencias en productos.',
    '$\\log(x+y) \\ne \\log x + \\log y$.',
    'Bases igualables → igualar exponentes. Si no, tomar logaritmos.',
    'Con $a^{2x}$ y $a^x$ a la vez: cambio de variable $t = a^x$.',
    'En las logarítmicas, <strong>comprobar siempre</strong>: el argumento tiene que ser positivo.'
  ]);
});
