/* Tema: Lenguaje algebraico y monomios */
Course.topic('al-lenguaje', function (p) {

  p.text('El álgebra empieza con una idea sencilla y enorme: usar una <strong>letra</strong> para ' +
    'representar un número que no conocemos, o que puede ser cualquiera. Con eso se pasa de resolver ' +
    '<em>un</em> problema a resolver <em>todos los problemas de ese tipo a la vez</em>.');

  p.text('«El área de un rectángulo de base 5 y altura 3 es 15» es un caso. ' +
    '$A = b\\cdot h$ es todos los casos.');

  p.hist('La palabra <em>álgebra</em> viene del título del libro de al-Juarismi (Bagdad, hacia el 820): ' +
    '<em>al-yabr wa-l-muqabala</em>, que significa «restauración y comparación», es decir, pasar términos ' +
    'de un lado a otro de la igualdad. Durante siglos todo se escribía con palabras. Las letras para las ' +
    'incógnitas las introdujo François Viète a finales del siglo XVI, y Descartes fijó la costumbre que ' +
    'seguimos: las últimas letras del abecedario ($x, y, z$) para lo desconocido y las primeras ' +
    '($a, b, c$) para lo conocido.');

  p.section('Traducir del castellano al álgebra');

  p.table(['En palabras', 'En álgebra'],
    [['un número cualquiera', '$x$'],
     ['el doble de un número', '$2x$'],
     ['la mitad de un número', '$\\dfrac{x}{2}$'],
     ['un número menos 7', '$x - 7$'],
     ['el siguiente de un número', '$x + 1$'],
     ['el cuadrado de un número', '$x^2$'],
     ['el doble de un número, más 5', '$2x + 5$'],
     ['el doble de (un número más 5)', '$2(x + 5)$'],
     ['dos números que suman 20', '$x$ y $20 - x$'],
     ['dos números consecutivos', '$x$ y $x+1$'],
     ['el $20\\%$ de un número', '$0{,}2\\,x$']]);

  p.note('Fíjate en las dos últimas filas de la mitad: <em>el doble de un número más 5</em> es ambiguo ' +
    'en castellano y no lo es en álgebra. $2x+5$ y $2(x+5)$ son cosas distintas. Esa precisión es ' +
    'justamente para lo que sirven los paréntesis.', null, 'Por qué el álgebra es más clara que el idioma');

  p.section('Valor numérico');

  p.text('Una expresión algebraica es una <strong>máquina</strong>: le metes un número por la letra y ' +
    'te devuelve otro. Sustituir la letra por un valor concreto y operar se llama hallar el ' +
    '<em>valor numérico</em>.');

  p.demo({
    title: 'La expresión como máquina',
    intro: 'Mueve el valor de x y mira lo que devuelve cada expresión. Observa que expresiones distintas pueden coincidir para un valor concreto y separarse en todos los demás.',
    build: function (host, d) {
      var x = 3;
      var exprs = [
        { t: '2x+5', f: function (x) { return 2 * x + 5; }, c: 0 },
        { t: '2(x+5)', f: function (x) { return 2 * (x + 5); }, c: 1 },
        { t: 'x^2-1', f: function (x) { return x * x - 1; }, c: 2 }
      ];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -8, ymax: 24, height: 290,
        draw: function (g) {
          exprs.forEach(function (e) { g.fn(e.f, { color: e.c, w: 2.3 }); });
          g.vline(x, { color: 'axis', dash: true, w: 1.4 });
          exprs.forEach(function (e) { g.point(x, e.f(x), { color: e.c, r: 5 }); });
        }
      });
      function paint() {
        out.set('Para $x = ' + U.fmt(x, 1) + '$:<br>' +
          exprs.map(function (e) {
            return '<span style="color:var(--c' + (e.c + 1) + ')">$' + e.t + ' = ' + U.fmt(e.f(x), 2) + '$</span>';
          }).join(' &nbsp;·&nbsp; '));
        plot.render();
      }
      W.slider(W.row(host), { label: 'x', min: -5, max: 5, step: 0.5, value: x, dec: 1, on: function (v) { x = v; paint(); } });
      W.legend(host, [{ c: 0, t: '$2x+5$' }, { c: 1, t: '$2(x+5)$' }, { c: 2, t: '$x^2-1$' }]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Monomios');

  p.text('Un <strong>monomio</strong> es el ladrillo del álgebra: un número (el <em>coeficiente</em>) ' +
    'multiplicado por letras elevadas a exponentes naturales (la <em>parte literal</em>). ' +
    'El <em>grado</em> es la suma de los exponentes.');

  p.formula('\\underbrace{-5}_{\\text{coeficiente}}\\ \\underbrace{x^3y^2}_{\\text{parte literal}} \\qquad \\text{grado } 3+2=5');

  p.sub('Semejantes: la regla que lo gobierna todo');

  p.text('Dos monomios son <strong>semejantes</strong> si tienen exactamente la misma parte literal. ' +
    'Y solo los semejantes se pueden sumar o restar. Es la misma idea de siempre: puedes sumar ' +
    '3 manzanas + 5 manzanas, pero no 3 manzanas + 5 peras.');

  p.formulas([
    '3x^2 + 5x^2 = 8x^2 \\quad \\checkmark',
    '3x^2 + 5x \\;\\longrightarrow\\; \\text{no se puede reducir}'
  ]);

  p.text('Para <strong>multiplicar</strong> monomios no hace falta que sean semejantes: se multiplican ' +
    'los coeficientes y se suman los exponentes de cada letra.');

  p.formula('(-5x^3y)\\cdot(2x^2y^4) = -10\\,x^{5}y^{5}');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Traduce y calcula',
    level: 'basico',
    gen: function (r) {
      var x = r.int(2, 12);
      var t = r.int(0, 5), frase, val;
      var a = r.int(2, 6), b = r.int(1, 15);
      if (t === 0) { frase = 'el <strong>doble</strong> de un número, <strong>más</strong> ' + b; val = 2 * x + b; }
      else if (t === 1) { frase = 'el <strong>doble</strong> de (un número <strong>más</strong> ' + b + ')'; val = 2 * (x + b); }
      else if (t === 2) { frase = 'el <strong>triple</strong> de un número, <strong>menos</strong> ' + b; val = 3 * x - b; }
      else if (t === 3) { frase = 'el <strong>cuadrado</strong> de un número, menos su <strong>doble</strong>'; val = x * x - 2 * x; }
      else if (t === 4) { frase = 'la <strong>suma</strong> de un número y su <strong>siguiente</strong>'; val = x + (x + 1); }
      else { frase = a + ' veces un número, <strong>más</strong> el propio número'; val = a * x + x; }
      return { x: x, frase: frase, val: val };
    },
    ask: function (d) {
      return 'Escribe con álgebra «' + d.frase + '» y calcula su valor para $x = ' + d.x + '$.';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Traduce primero la frase entera y sustituye después. Cuidado con dónde van los paréntesis.'; },
    steps: function (d) {
      return ['Traduce la frase palabra por palabra, poniendo paréntesis donde el castellano agrupa.',
        'Sustituye la letra por $' + d.x + '$.',
        'Opera respetando la jerarquía.',
        'Valor numérico: $' + d.val + '$.'];
    },
    answer: function (d) { return 'Vale ' + d.val + '.'; }
  });

  p.exercise({
    title: 'Reduce los términos semejantes',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 8), b = r.pm(1, 8), c = r.pm(1, 9), e = r.pm(1, 9), f = r.pm(1, 7);
      var cx2 = a + b, cx = c + e, ind = f;
      if (cx2 === 0 || cx === 0) return null;
      return {
        tex: ML.termTex(a, 'x', 2, true) + ML.termTex(c, 'x', 1, false) + ML.termTex(f, '', 0, false) +
          ML.termTex(b, 'x', 2, false) + ML.termTex(e, 'x', 1, false),
        cx2: cx2, cx: cx, ind: ind
      };
    },
    ask: function (d) { return 'Reduce: $' + d.tex + '$'; },
    fields: [
      { name: 'a', label: 'coef. de $x^2$', w: 'tiny' },
      { name: 'b', label: 'coef. de $x$', w: 'tiny' },
      { name: 'c', label: 'término indep.', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.cx2, b: d.cx, c: d.ind }; },
    hint: function () { return 'Agrupa por un lado todos los $x^2$, por otro todos los $x$ y por otro los números sueltos.'; },
    steps: function (d) {
      return ['Los términos en $x^2$ son semejantes entre sí: se suman sus coeficientes → $' + d.cx2 + 'x^2$.',
        'Los términos en $x$, igual → $' + ML.termTex(d.cx, 'x', 1, true) + '$.',
        'Los números sueltos se suman aparte → $' + d.ind + '$.',
        'Resultado: $' + ML.polyTex([d.cx2, d.cx, d.ind]) + '$.'];
    },
    answer: function (d) { return '$' + ML.polyTex([d.cx2, d.cx, d.ind]) + '$'; }
  });

  p.exercise({
    title: 'Producto de monomios',
    level: 'medio',
    gen: function (r) {
      var c1 = r.pm(2, 7), c2 = r.pm(2, 7);
      var a1 = r.int(1, 4), a2 = r.int(1, 4), b1 = r.int(0, 3), b2 = r.int(0, 3);
      return {
        c1: c1, c2: c2, a1: a1, a2: a2, b1: b1, b2: b2,
        c: c1 * c2, a: a1 + a2, b: b1 + b2
      };
    },
    ask: function (d) {
      function m(c, a, b) {
        return (c < 0 ? '(' + c + ')' : c) + 'x^{' + a + '}' + (b ? 'y^{' + b + '}' : '');
      }
      return 'Multiplica $' + m(d.c1, d.a1, d.b1) + ' \\cdot ' + m(d.c2, d.a2, d.b2) + '$ e indica el ' +
        'coeficiente y el grado del resultado.';
    },
    fields: [{ name: 'c', label: 'Coeficiente', w: 'tiny' }, { name: 'g', label: 'Grado', w: 'tiny' }],
    sol: function (d) { return { c: d.c, g: d.a + d.b }; },
    hint: function () { return 'Coeficientes: se multiplican (ojo al signo). Exponentes de cada letra: se suman.'; },
    steps: function (d) {
      return ['Coeficiente: $' + d.c1 + ' \\cdot ' + d.c2 + ' = ' + d.c + '$.',
        'Exponente de $x$: $' + d.a1 + ' + ' + d.a2 + ' = ' + d.a + '$.',
        'Exponente de $y$: $' + d.b1 + ' + ' + d.b2 + ' = ' + d.b + '$.',
        'Resultado: $' + d.c + 'x^{' + d.a + '}' + (d.b ? 'y^{' + d.b + '}' : '') + '$, de grado $' + (d.a + d.b) + '$.'];
    },
    answer: function (d) {
      return 'Coeficiente ' + d.c + ', grado ' + (d.a + d.b) + '.';
    }
  });

  p.exercise({
    title: 'Valor numérico de un polinomio',
    level: 'basico',
    gen: function (r) {
      var c = [r.pm(1, 4), r.pm(1, 6), r.pm(1, 9)];
      var x = r.pm(1, 5);
      return { c: c, x: x, val: ML.polyEval(c, x) };
    },
    ask: function (d) {
      return 'Si $P(x) = ' + ML.polyTex(d.c) + '$, calcula $P(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: 'P(' + d.x + ') =', w: 'tiny' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'Sustituye $x$ por $' + (d.x < 0 ? '(' + d.x + ')' : d.x) + '$ — con paréntesis si es negativo — y opera.'; },
    steps: function (d) {
      var xx = d.x < 0 ? '(' + d.x + ')' : String(d.x);
      return ['Sustituimos: $' + d.c[0] + '\\cdot' + xx + '^2 ' + ML.termTex(d.c[1], xx, 1, false) + ML.termTex(d.c[2], '', 0, false) + '$',
        'Primero la potencia: $' + xx + '^2 = ' + (d.x * d.x) + '$.',
        'Después los productos y por último las sumas.',
        '$P(' + d.x + ') = ' + d.val + '$'];
    },
    answer: function (d) { return 'P(' + d.x + ') = ' + d.val; }
  });

  p.keys([
    'Una letra representa un número desconocido o cualquiera: sirve para razonar sobre todos los casos a la vez.',
    'Los paréntesis marcan lo que el castellano deja ambiguo: $2x+5 \\ne 2(x+5)$.',
    'Valor numérico = sustituir la letra y operar.',
    'Monomio: coeficiente · parte literal. Grado = suma de exponentes.',
    'Solo se suman monomios <strong>semejantes</strong> (misma parte literal).',
    'Al multiplicar monomios: coeficientes se multiplican, exponentes se suman.'
  ]);
});
