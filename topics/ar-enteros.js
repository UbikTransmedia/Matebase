/* Tema: Números enteros */
Course.topic('ar-enteros', function (p) {

  p.text('Si solo tienes naturales, la resta $3 - 7$ no tiene respuesta. Y sin embargo tiene sentido ' +
    'preguntarla: son siete grados menos que tres, o deber cuatro euros. Los <strong>números enteros</strong> ' +
    'son la solución: se añaden los negativos y el cero.');

  p.formula('\\mathbb{Z} = \\{\\dots,\\ -3,\\ -2,\\ -1,\\ 0,\\ 1,\\ 2,\\ 3,\\ \\dots\\}');

  p.text('En $\\mathbb{Z}$ la resta <em>siempre</em> se puede hacer. Eso es lo que se gana. La recta ' +
    'numérica se prolonga hacia la izquierda y el cero deja de ser el principio para pasar a ser el centro.');

  p.hist('Los negativos costaron muchísimo de aceptar. Los griegos los rechazaban («no hay nada menos ' +
    'que nada»); los matemáticos chinos ya los usaban en el siglo II con varillas rojas y negras para ' +
    'contabilidad; en India, Brahmagupta (siglo VII) fue el primero en dar reglas completas de cálculo ' +
    'hablando de <em>fortunas</em> y <em>deudas</em>. En Europa se les llamó «números absurdos» hasta ' +
    'bien entrado el siglo XVII.');

  /* ---------------------------------------------------------------- */
  p.section('Orden y valor absoluto');

  p.text('En la recta, <strong>mayor significa más a la derecha</strong>. Y eso da la sorpresa clásica: ' +
    '$-7 < -3$, aunque el 7 sea «más grande» que el 3. Cuidado con eso; es la trampa favorita de los exámenes.');

  p.text('El <strong>valor absoluto</strong> $|a|$ es la distancia del número al cero, sin mirar el signo. ' +
    'Siempre es positivo o cero.');

  p.formula('|{-7}| = 7 \\qquad |7| = 7 \\qquad |0| = 0');

  p.demo({
    title: 'La recta de los enteros',
    intro: 'Arrastra los dos puntos. Observa el orden, el valor absoluto y la distancia entre ellos.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.numberLine(host, {
        min: -10.5, max: 10.5, step: 1, height: 135,
        handles: {
          a: { x: -6, y: 0, label: 'a', color: 0, constrain: snap },
          b: { x: 3, y: 0, label: 'b', color: 1, constrain: snap }
        },
        draw: function (g) {
          var a = g.h('a').x, b = g.h('b').x;
          g.seg(a, 0.42, b, 0.42, { color: 2, w: 3, dash: true });
          g.text((a + b) / 2, 0.62, 'distancia = ' + Math.abs(a - b), { align: 'center', color: 2, size: 12.5, box: true });
          g.seg(0, -0.42, a, -0.42, { color: 0, w: 2.5, alpha: .5 });
          g.point(0, 0, { color: 'axis', r: 4 });
          out.set('$a = ' + a + '$, &nbsp; $b = ' + b + '$ &nbsp;→&nbsp; ' +
            '$' + Math.min(a, b) + ' < ' + Math.max(a, b) + '$<br>' +
            '$|a| = ' + Math.abs(a) + '$, &nbsp; $|b| = ' + Math.abs(b) + '$, &nbsp; ' +
            'distancia $= |a-b| = ' + Math.abs(a - b) + '$');
        }
      });
      function snap(h) { h.y = 0; h.x = U.clamp(Math.round(h.x), -10, 10); }
      W.hint(host, 'El valor absoluto de a es la longitud del trazo que va del 0 hasta a.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Sumar y restar');

  p.text('La forma más segura de no equivocarse es pensar en <em>dinero</em>: los positivos son ingresos ' +
    'y los negativos, deudas.');

  p.list([
    '<strong>Mismo signo</strong>: se suman las cantidades y se conserva el signo. $(-5)+(-3) = -8$ (dos deudas se acumulan).',
    '<strong>Distinto signo</strong>: se resta la pequeña de la grande y se pone el signo del mayor en valor absoluto. $(-5)+3 = -2$ (debo 5, pago 3, aún debo 2).',
    '<strong>Restar</strong> es sumar el opuesto: $a - b = a + (-b)$. Quitar una deuda es ganar dinero: $5-(-3) = 5+3 = 8$.'
  ]);

  p.note('Dos signos seguidos se juntan: $+(+) = +$, $-(-) = +$, $+(-) = -$, $-(+) = -$. ' +
    'Menos delante de menos da más.', null, 'Signos pegados');

  p.section('Multiplicar y dividir: la regla de los signos');

  p.formula('\\begin{array}{cc} (+)\\cdot(+) = + & (+)\\cdot(-) = - \\\\ (-)\\cdot(+) = - & (-)\\cdot(-) = + \\end{array}');

  p.text('¿Por qué menos por menos da más? Porque multiplicar por $-1$ significa «dar la vuelta en la ' +
    'recta». Si das la vuelta dos veces, vuelves a mirar hacia donde estabas.');

  p.demo({
    title: 'Multiplicar es girar y estirar',
    intro: 'Multiplicar por un número negativo lleva el punto al otro lado del cero. Multiplicar dos veces por negativo lo devuelve al lado de partida.',
    build: function (host, d) {
      var a = 3, b = -2;
      var out = W.readout(host, '');
      var plot = W.numberLine(host, {
        min: -13, max: 13, step: 2, height: 140,
        draw: function (g) {
          g.point(a, 0, { color: 0, r: 6, label: 'a = ' + a, labelDy: -16 });
          g.point(a * b, 0, { color: 1, r: 6, label: 'a·b = ' + (a * b), labelDy: 16 });
          g.vec(a, 0.38, a * b, 0.38, { color: 2, w: 2.4 });
          g.point(0, 0, { color: 'axis', r: 4 });
        }
      });
      function paint() {
        out.set('$' + a + ' \\cdot ' + (b < 0 ? '(' + b + ')' : b) + ' = ' + (a * b) + '$ &nbsp;→&nbsp; ' +
          (b < 0 ? 'el signo negativo <strong>cruza el cero</strong>' : 'se queda en el mismo lado') +
          ' y el factor $' + Math.abs(b) + '$ estira la distancia.');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a', min: -6, max: 6, step: 1, value: a, dec: 0, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'b', min: -4, max: 4, step: 1, value: b, dec: 0, on: function (v) { b = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Sumas y restas con signos',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(1, 15), b = r.pm(1, 15), c = r.pm(1, 12);
      var op1 = r.bool() ? 1 : -1, op2 = r.bool() ? 1 : -1;
      var val = a + op1 * b + op2 * c;
      var tex = a + (op1 > 0 ? ' + ' : ' - ') + (b < 0 ? '(' + b + ')' : b) +
        (op2 > 0 ? ' + ' : ' - ') + (c < 0 ? '(' + c + ')' : c);
      return { tex: tex, val: val };
    },
    ask: function (d) { return 'Calcula: $' + d.tex + '$'; },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Primero junta los signos pegados: $-(-3)$ es $+3$. Después suma.'; },
    steps: function (d) {
      return ['Junta los signos dobles: menos por menos da más.',
        'Suma primero todos los positivos y por otro lado todos los negativos.',
        'Resta el total negativo del total positivo.',
        'Resultado: $' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Regla de los signos',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(2, 12), b = r.pm(2, 9);
      var mult = r.bool();
      if (!mult) { a = a * b; }              // para que la division sea exacta
      return { a: a, b: b, mult: mult, val: mult ? a * b : a / b };
    },
    ask: function (d) {
      return 'Calcula: $' + (d.a < 0 ? '(' + d.a + ')' : d.a) + (d.mult ? ' \\cdot ' : ' : ') +
        (d.b < 0 ? '(' + d.b + ')' : d.b) + '$';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Calcula primero el número sin signos y decide el signo al final.'; },
    steps: function (d) {
      var neg = (d.a < 0) !== (d.b < 0);
      return ['Sin signos: $' + Math.abs(d.a) + (d.mult ? '\\cdot' : ':') + Math.abs(d.b) + ' = ' + Math.abs(d.val) + '$.',
        'Los signos son ' + (neg ? 'distintos, así que el resultado es negativo.' : 'iguales, así que el resultado es positivo.'),
        'Resultado: $' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Operación combinada con paréntesis',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(2, 9), b = r.pm(2, 9), c = r.pm(2, 6), e = r.pm(2, 8);
      var val = a - b * (c + e);
      if (Math.abs(val) > 300) return null;
      return {
        a: a, b: b, c: c, e: e, val: val,
        tex: a + ' - ' + (b < 0 ? '(' + b + ')' : b) + '\\cdot\\left(' + c +
          (e < 0 ? ' + (' + e + ')' : ' + ' + e) + '\\right)'
      };
    },
    ask: function (d) { return 'Calcula: $' + d.tex + '$'; },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'Empieza por el paréntesis: vale $' + (d.c + d.e) + '$.'; },
    steps: function (d) {
      return ['Paréntesis: $' + d.c + ' + (' + d.e + ') = ' + (d.c + d.e) + '$.',
        'Multiplicación: $' + d.b + '\\cdot(' + (d.c + d.e) + ') = ' + (d.b * (d.c + d.e)) + '$.',
        'Resta final: $' + d.a + ' - (' + (d.b * (d.c + d.e)) + ') = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Ordenar de menor a mayor',
    level: 'basico',
    gen: function (r) {
      var s = [];
      while (s.length < 4) {
        var v = r.pm(0, 14);
        if (s.indexOf(v) < 0) s.push(v);
      }
      return { s: s, orden: s.slice().sort(function (x, y) { return x - y; }) };
    },
    ask: function (d) {
      return 'Ordena de menor a mayor: $' + d.s.join(',\\quad ') + '$<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escríbelos separados por punto y coma.</span>';
    },
    fields: [{ name: 'o', label: 'Ordenados', w: 'wide', ph: '-3; -1; 0; 5' }],
    check: function (v, d) {
      var got = v.raw.o.split(';').map(function (s) { return ML.tryEval(s); });
      if (got.length !== 4 || got.some(isNaN)) {
        return { ok: false, msg: 'Escribe los cuatro números separados por punto y coma.' };
      }
      for (var i = 0; i < 4; i++) if (got[i] !== d.orden[i]) return false;
      return true;
    },
    hint: function () { return 'Cuanto más a la izquierda en la recta, menor. Los negativos «grandes» son los más pequeños.'; },
    steps: function (d) {
      return ['Coloca mentalmente los cuatro sobre la recta.',
        'Los negativos van a la izquierda del cero; cuanto mayor es su valor absoluto, más a la izquierda.',
        'Orden correcto: $' + d.orden.join(' < ') + '$.'];
    },
    answer: function (d) { return d.orden.join(' ; '); }
  });

  p.keys([
    '$\\mathbb{Z}$ existe para que la resta siempre se pueda hacer.',
    'Mayor = más a la derecha en la recta. Por eso $-7 < -3$.',
    '$|a|$ es la distancia al cero; la distancia entre $a$ y $b$ es $|a-b|$.',
    'Restar es sumar el opuesto. Menos delante de menos da más.',
    'Regla de los signos: iguales → $+$; distintos → $-$.'
  ]);
});
