/* Tema: Operaciones y jerarquía */
Course.topic('ar-operaciones', function (p) {

  p.text('Con los números se pueden hacer cuatro cosas básicas. Conviene saber qué significa cada una, ' +
    'porque más adelante todo el álgebra consiste en manipularlas sin miedo.');

  p.table(['Operación', 'Se escribe', 'Nombres de las partes', 'Qué hace'],
    [['Suma', '$a + b$', 'sumandos → suma', 'juntar cantidades'],
     ['Resta', '$a - b$', 'minuendo − sustraendo → diferencia', 'quitar, comparar'],
     ['Multiplicación', '$a \\cdot b$', 'factores → producto', 'sumar $a$ consigo mismo $b$ veces'],
     ['División', '$a : b$', 'dividendo : divisor → cociente', 'repartir en partes iguales']]);

  p.section('Propiedades: por qué se puede hacer trampa');

  p.text('Estas propiedades parecen obviedades, pero son exactamente las reglas que te permitirán ' +
    'reordenar una expresión algebraica sin equivocarte. Merece la pena tenerlas claras.');

  p.formulas([
    'a + b = b + a \\qquad a\\cdot b = b\\cdot a',
    '(a+b)+c = a+(b+c) \\qquad (a\\cdot b)\\cdot c = a\\cdot(b\\cdot c)',
    'a\\cdot(b+c) = a\\cdot b + a\\cdot c'
  ], 'conmutativa · asociativa · distributiva');

  p.note('La resta y la división <strong>no</strong> son conmutativas: $7-3 \\ne 3-7$ y $10:2 \\ne 2:10$. ' +
    'Es el error más repetido de toda la ESO.', 'warn', 'Ojo');

  p.demo({
    title: 'La propiedad distributiva, vista',
    intro: 'Un rectángulo de base $b+c$ y altura $a$ se puede medir de dos maneras: entera, o partida en dos trozos. Mueve los deslizadores.',
    build: function (host, d) {
      var a = 3, b = 4, c = 2;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1, xmax: 11, ymin: -1.2, ymax: 6, height: 260,
        grid: true, xlabel: null, ylabel: null,
        draw: function (g) {
          g.rect(0, 0, b, a, { fill: 0, color: 0, fillAlpha: .3 });
          g.rect(b, 0, c, a, { fill: 1, color: 1, fillAlpha: .3 });
          g.text(b / 2, a / 2, 'a·b = ' + (a * b), { align: 'center', color: 0, bold: true });
          g.text(b + c / 2, a / 2, 'a·c = ' + (a * c), { align: 'center', color: 1, bold: true });
          g.text(b / 2, -0.45, 'b = ' + b, { align: 'center', color: 0, size: 12 });
          g.text(b + c / 2, -0.45, 'c = ' + c, { align: 'center', color: 1, size: 12 });
          g.text(-0.35, a / 2, 'a = ' + a, { align: 'right', color: 'ink', size: 12 });
          out.set('$' + a + '\\cdot(' + b + '+' + c + ') = ' + a + '\\cdot' + (b + c) + ' = ' + (a * (b + c)) + '$' +
            '<br>$' + a + '\\cdot' + b + ' + ' + a + '\\cdot' + c + ' = ' + (a * b) + ' + ' + (a * c) + ' = ' + (a * b + a * c) + '$');
        }
      });
      var row = W.row(host);
      W.slider(row, { label: 'a (altura)', min: 1, max: 5, step: 1, value: a, dec: 0, on: function (v) { a = v; plot.render(); } });
      W.slider(row, { label: 'b', min: 1, max: 6, step: 1, value: b, dec: 0, on: function (v) { b = v; plot.render(); } });
      W.slider(row, { label: 'c', min: 1, max: 5, step: 1, value: c, dec: 0, on: function (v) { c = v; plot.render(); } });
      plot.render();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Que sumar se pueda hacer en cualquier orden es lo que permite repartir un cálculo enorme entre ' +
    'muchos procesadores: cada uno suma su trozo y luego se juntan. Ahora la letra pequeña, que ' +
    'sorprende a mucho ingeniero: con decimales guardados en un ordenador la asociativa <strong>deja ' +
    'de cumplirse exactamente</strong>. Sumar un millón de datos en distinto orden puede dar ' +
    'resultados distintos en las últimas cifras, y en simulaciones de clima o de estructuras eso ' +
    'obliga a fijar el orden para que los resultados sean reproducibles.');

  p.section('La jerarquía: en qué orden se opera');

  p.text('Una expresión como $12 + 3\\cdot 4$ no significa lo mismo si se lee de izquierda a derecha ' +
    '($15\\cdot 4 = 60$) que respetando la jerarquía ($12+12 = 24$). Para que todo el mundo obtenga el ' +
    'mismo resultado, hay un acuerdo universal:');

  p.list([
    '<strong>1.º Paréntesis</strong>, de dentro hacia fuera.',
    '<strong>2.º Potencias y raíces</strong>.',
    '<strong>3.º Multiplicaciones y divisiones</strong>, de izquierda a derecha.',
    '<strong>4.º Sumas y restas</strong>, de izquierda a derecha.'
  ], true);

  p.note('«De izquierda a derecha» importa: $12 : 3 \\cdot 2$ vale $8$, no $2$. Primero se divide ' +
    'porque está antes.', 'warn');

  p.demo({
    title: 'Desmontar una expresión paso a paso',
    intro: 'Pulsa «Siguiente paso» y ve cómo se deshace la expresión respetando la jerarquía.',
    build: function (host, d) {
      var pasos = [
        '20 + 3\\cdot(8-6)^2 : 4 - 5',
        '20 + 3\\cdot \\underline{2}^2 : 4 - 5',
        '20 + 3\\cdot \\underline{4} : 4 - 5',
        '20 + \\underline{12} : 4 - 5',
        '20 + \\underline{3} - 5',
        '\\underline{23} - 5',
        '18'
      ];
      var notas = [
        'Expresión de partida.',
        'Primero el paréntesis: $8-6=2$.',
        'Ahora la potencia: $2^2=4$.',
        'Multiplicaciones y divisiones, de izquierda a derecha: $3\\cdot 4=12$.',
        'Seguimos con la división: $12:4=3$.',
        'Ya solo quedan sumas y restas: $20+3=23$.',
        'Y por fin: $23-5=18$.'
      ];
      var i = 0;
      var out = W.readout(host, '');
      function paint() {
        out.innerHTML = MathX.display(pasos[i]) +
          '<div style="text-align:center;font-family:var(--sans);font-size:13.5px;color:var(--ink-faint);margin-top:8px">' +
          MathX.inline(notas[i]) + '</div>';
      }
      W.buttons(host, [
        { t: '← Anterior', on: function () { i = Math.max(0, i - 1); paint(); } },
        { t: 'Siguiente paso →', cls: 'btn--main', on: function () { i = Math.min(pasos.length - 1, i + 1); paint(); } },
        { t: '↺ Reiniciar', on: function () { i = 0; paint(); } }
      ]);
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Esta prioridad no es un capricho escolar: es exactamente la que aplican la hoja de cálculo, la ' +
    'calculadora y cualquier lenguaje de programación al leer una fórmula. Por eso una celda mal ' +
    'escrita da un resultado plausible pero equivocado, sin avisar. Y las peleas que circulan por ' +
    'redes con expresiones tipo $8 \\div 2(2+2)$ no son un problema de matemáticas sino de notación ' +
    'ambigua: con un paréntesis más, la discusión desaparece.');

  p.hist('El orden de las operaciones no lo dictó ningún matemático: se fue asentando con la imprenta ' +
    'entre los siglos XVI y XVII, por comodidad tipográfica. Como los polinomios se escribían ' +
    'constantemente, resultaba práctico que $3x^2$ significara «tres por equis al cuadrado» sin ' +
    'necesidad de paréntesis. Es decir, la jerarquía que hoy se enseña como si fuera una ley natural ' +
    'es en realidad un convenio de impresores que se quedó.');

  p.section('Practica');

  p.exercise({
    title: 'Respeta la jerarquía',
    level: 'basico',
    gen: function (r) {
      var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), e = r.int(2, 12);
      var t = r.int(0, 3), tex, val;
      if (t === 0) { tex = e + ' + ' + a + '\\cdot ' + b; val = e + a * b; }
      else if (t === 1) { tex = a + '\\cdot ' + b + ' - ' + c + '\\cdot ' + 2; val = a * b - 2 * c; }
      else if (t === 2) { tex = '(' + a + ' + ' + b + ')\\cdot ' + c + ' - ' + e; val = (a + b) * c - e; }
      else {
        var d2 = r.pick([2, 3, 4]); var num = d2 * r.int(2, 9);
        tex = e + ' + ' + num + ' : ' + d2 + ' - ' + a; val = e + num / d2 - a;
      }
      return { tex: tex, val: val };
    },
    ask: function (d) { return 'Calcula: $' + d.tex + '$'; },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Paréntesis → potencias → por y entre → más y menos.'; },
    steps: function (d) {
      return ['Localiza primero los paréntesis, si los hay.',
        'Después haz todas las multiplicaciones y divisiones, de izquierda a derecha.',
        'Y al final las sumas y restas, también de izquierda a derecha.',
        'Resultado: $' + d.val + '$.'];
    },
    answer: function (d) { return 'El resultado es ' + d.val + '.'; }
  });

  p.exercise({
    title: 'Con potencias y paréntesis anidados',
    level: 'medio',
    gen: function (r) {
      var a = r.int(2, 6), b = r.int(1, 5), c = r.int(2, 4), e = r.int(3, 20);
      var val = e + c * Math.pow(a - b, 2);
      if (val > 500) return null;
      return { a: a, b: b, c: c, e: e, val: val };
    },
    ask: function (d) { return 'Calcula: $' + d.e + ' + ' + d.c + '\\cdot(' + d.a + ' - ' + d.b + ')^2$'; },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'El paréntesis vale $' + (d.a - d.b) + '$. No eleves antes de restar.'; },
    steps: function (d) {
      return ['Paréntesis: $' + d.a + ' - ' + d.b + ' = ' + (d.a - d.b) + '$.',
        'Potencia: $' + (d.a - d.b) + '^2 = ' + Math.pow(d.a - d.b, 2) + '$.',
        'Multiplicación: $' + d.c + '\\cdot ' + Math.pow(d.a - d.b, 2) + ' = ' + (d.c * Math.pow(d.a - d.b, 2)) + '$.',
        'Suma: $' + d.e + ' + ' + (d.c * Math.pow(d.a - d.b, 2)) + ' = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Usa la distributiva para calcular de cabeza',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([3, 4, 6, 7, 8, 9, 11, 12]);
      var b = r.pick([10, 20, 30, 40, 50, 100]);
      var c = r.int(1, 9) * r.sign();
      var n = b + c;
      return { a: a, b: b, c: c, n: n, val: a * n };
    },
    ask: function (d) {
      return 'Calcula mentalmente $' + d.a + ' \\cdot ' + d.n + '$ descomponiendo el segundo factor ' +
        'como $' + d.b + (d.c < 0 ? ' - ' + (-d.c) : ' + ' + d.c) + '$.';
    },
    fields: [{ name: 'v', label: 'Producto', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return '$' + d.a + '\\cdot' + d.b + ' = ' + (d.a * d.b) + '$. Solo falta ajustar.'; },
    steps: function (d) {
      return ['$' + d.a + '\\cdot(' + d.b + (d.c < 0 ? ' - ' + (-d.c) : ' + ' + d.c) + ')$',
        '$= ' + d.a + '\\cdot' + d.b + (d.c < 0 ? ' - ' + d.a + '\\cdot' + (-d.c) : ' + ' + d.a + '\\cdot' + d.c) + '$',
        '$= ' + (d.a * d.b) + (d.c < 0 ? ' - ' + (d.a * -d.c) : ' + ' + (d.a * d.c)) + ' = ' + d.val + '$'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'División entera: cociente y resto',
    level: 'basico',
    gen: function (r) {
      var b = r.int(3, 19), q = r.int(4, 40), rr = r.int(0, b - 1);
      return { a: b * q + rr, b: b, q: q, r: rr };
    },
    ask: function (d) { return 'Divide $' + d.a + '$ entre $' + d.b + '$ y da el cociente y el resto.'; },
    fields: [{ name: 'q', label: 'Cociente', w: 'tiny' }, { name: 'r', label: 'Resto', w: 'tiny' }],
    sol: function (d) { return { q: d.q, r: d.r }; },
    hint: function (d) { return 'Se cumple siempre $D = d\\cdot c + r$ con $0 \\le r < d$.'; },
    steps: function (d) {
      return ['Buscamos el mayor múltiplo de $' + d.b + '$ que no pase de $' + d.a + '$.',
        'Es $' + d.b + '\\cdot ' + d.q + ' = ' + (d.b * d.q) + '$.',
        'Lo que sobra es el resto: $' + d.a + ' - ' + (d.b * d.q) + ' = ' + d.r + '$.',
        'Comprobación: $' + d.b + '\\cdot' + d.q + ' + ' + d.r + ' = ' + d.a + '$ ✓'];
    },
    answer: function (d) { return 'Cociente ' + d.q + ', resto ' + d.r + '.'; }
  });

  p.keys([
    'Conmutativa y asociativa valen para $+$ y $\\cdot$, <strong>no</strong> para $-$ ni $:$.',
    'La distributiva $a(b+c)=ab+ac$ es la propiedad más rentable de todas: sirve para sacar factor común, para las identidades notables y para multiplicar de cabeza.',
    'Jerarquía: paréntesis, potencias, por/entre, más/menos. A igual nivel, de izquierda a derecha.',
    'División entera: $D = d\\cdot c + r$, siempre con $0 \\le r < d$.'
  ]);
});
