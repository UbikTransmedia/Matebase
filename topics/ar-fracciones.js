/* Tema: Fracciones */
Course.topic('ar-fracciones', function (p) {

  p.text('Con los naturales no se puede repartir una pizza entre tres. Hace falta un número nuevo: ' +
    'la <strong>fracción</strong>. El de abajo (<em>denominador</em>) dice en cuántas partes iguales ' +
    'se divide la unidad; el de arriba (<em>numerador</em>), cuántas de esas partes tomamos.');

  p.formula('\\frac{3}{4} \\quad\\longrightarrow\\quad \\text{parto en 4, cojo 3}');

  p.text('Una fracción es además, y esto es lo que la hace potente, <strong>tres cosas a la vez</strong>: ' +
    'una parte de un todo, una división sin terminar ($3:4$) y un punto concreto de la recta ' +
    'numérica ($0{,}75$).');

  p.hist('Los egipcios, hace 4000 años, solo admitían fracciones de numerador 1 (llamadas <em>unitarias</em>): ' +
    'para escribir $\\frac{3}{4}$ ponían $\\frac{1}{2}+\\frac{1}{4}$. El papiro Rhind es básicamente una ' +
    'tabla para convertir fracciones a esa forma. Nuestra manera de escribirlas, con la raya en medio, ' +
    'viene de los matemáticos árabes del siglo XII.');

  p.demo({
    title: 'Ver una fracción',
    intro: 'Mueve el numerador y el denominador. Fíjate en qué pasa cuando el numerador supera al denominador.',
    build: function (host, d) {
      var n = 3, den = 4;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.1, xmax: 2.6, ymin: -0.35, ymax: 1.15, height: 170,
        grid: false, axes: false,
        draw: function (g) {
          var enteros = Math.ceil(Math.max(1, n / den));
          for (var u = 0; u < enteros; u++) {
            for (var i = 0; i < den; i++) {
              var idx = u * den + i;
              var x0 = u * 1.15 + i / den;
              var pintado = idx < n;
              g.rect(x0, 0, 1 / den, 1, {
                fill: pintado ? 0 : false, color: pintado ? 0 : 'axis',
                fillAlpha: 0.55, w: 1.3, stroke: true
              });
            }
            g.text(u * 1.15 + 0.5, -0.18, u === 0 ? '1 unidad' : 'otra unidad',
              { align: 'center', size: 11.5, color: 'ink' });
          }
        }
      });
      function paint() {
        var f = ML.F(n, den);
        out.set('$\\dfrac{' + n + '}{' + den + '}' +
          (f.toString() !== n + '/' + den ? ' = ' + f.tex() : '') +
          ' = ' + U.fmt(n / den, 4) + '$' +
          (n > den ? ' &nbsp;→ fracción <strong>impropia</strong>: vale más de una unidad'
            : (n === den ? ' &nbsp;→ es exactamente la unidad' : ' &nbsp;→ fracción <strong>propia</strong>')));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'numerador', min: 0, max: 12, step: 1, value: n, dec: 0, on: function (v) { n = v; paint(); } });
      W.slider(row, { label: 'denominador', min: 1, max: 12, step: 1, value: den, dec: 0, on: function (v) { den = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Fracciones equivalentes');

  p.text('$\\frac{1}{2}$, $\\frac{2}{4}$, $\\frac{3}{6}$ y $\\frac{50}{100}$ son <strong>la misma cantidad</strong> ' +
    'escrita de cuatro formas. Se obtienen multiplicando (o dividiendo) arriba y abajo por el mismo número.');

  p.formula('\\frac{a}{b} = \\frac{a\\cdot k}{b\\cdot k} \\qquad (k \\ne 0)', 'amplificar y simplificar');

  p.text('<strong>Simplificar</strong> es dividir arriba y abajo por su m.c.d. Cuando ya no se puede más, ' +
    'la fracción es <strong>irreducible</strong>, y esa es la forma en que hay que dar siempre el resultado.');

  p.formula('\\frac{84}{120} = \\frac{84:12}{120:12} = \\frac{7}{10}');

  p.note('Dos fracciones son equivalentes si sus <em>productos cruzados</em> coinciden: ' +
    '$\\frac{a}{b}=\\frac{c}{d} \\iff a\\cdot d = b\\cdot c$. Es la forma más rápida de comprobarlo.', null, 'Atajo');

  /* ---------------------------------------------------------------- */
  p.util('Una pantalla 16:9 y otra de 1920×1080 tienen la misma forma porque $\\frac{1920}{1080}$ ' +
    'simplifica a $\\frac{16}{9}$. Toda la maquetación de páginas web, el recorte de fotos y el ' +
    'formato de cine se hablan en fracciones equivalentes, y las bandas negras de una película en ' +
    'televisión son justamente el precio de mezclar dos fracciones que no lo son.');

  p.section('Operar con fracciones');

  p.sub('Suma y resta');
  p.text('Solo se pueden sumar trozos <em>del mismo tamaño</em>. Por eso hay que poner el mismo ' +
    'denominador antes de sumar: se usa el m.c.m. de los denominadores.');

  p.formula('\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{a\\cdot d \\pm c\\cdot b}{b\\cdot d}');

  p.sub('Producto y cociente');
  p.text('Aquí es al revés: son <em>más fáciles</em> que la suma. El producto se hace en línea recta; ' +
    'la división, multiplicando por la inversa (se le llama «multiplicar en cruz»).');

  p.formulas([
    '\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a\\cdot c}{b\\cdot d}',
    '\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a\\cdot d}{b\\cdot c}'
  ]);

  p.demo({
    title: 'Sumar fracciones con dibujo',
    intro: 'Los dos primeros rectángulos tienen trozos de distinto tamaño; el tercero los reparte a todos igual, y por eso ya se pueden juntar.',
    build: function (host, d) {
      var a = 1, b = 2, c = 1, e = 3;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.16, xmax: 1.03, ymin: -0.15, ymax: 3.3, height: 250,
        grid: false, axes: false,
        draw: function (g) {
          function barra(y, num, den, col, etiqueta) {
            for (var i = 0; i < den; i++) {
              g.rect(i / den, y, 1 / den, 0.72, {
                fill: i < num ? col : false, color: i < num ? col : 'axis',
                fillAlpha: 0.5, w: 1.2
              });
            }
            g.text(-0.02, y + 0.36, etiqueta, { align: 'right', size: 12.5, color: 'ink' });
          }
          var m = ML.lcm(b, e);
          barra(2.4, a, b, 0, a + '/' + b);
          barra(1.3, c, e, 1, c + '/' + e);
          barra(0.1, a * (m / b) + c * (m / e), m, 2, 'suma');
        }
      });
      function paint() {
        var m = ML.lcm(b, e);
        var num = a * (m / b) + c * (m / e);
        var f = ML.F(num, m);
        out.set('$\\dfrac{' + a + '}{' + b + '} + \\dfrac{' + c + '}{' + e + '} = ' +
          '\\dfrac{' + (a * (m / b)) + '}{' + m + '} + \\dfrac{' + (c * (m / e)) + '}{' + m + '} = ' +
          '\\dfrac{' + num + '}{' + m + '}' + (f.toString() !== num + '/' + m ? ' = ' + f.tex() : '') + '$' +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">m.c.m.(' + b + ', ' + e + ') = ' + m + '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a', min: 1, max: 5, step: 1, value: a, dec: 0, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'b', min: 2, max: 8, step: 1, value: b, dec: 0, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'c', min: 1, max: 5, step: 1, value: c, dec: 0, on: function (v) { c = v; paint(); } });
      W.slider(row, { label: 'd', min: 2, max: 8, step: 1, value: e, dec: 0, on: function (v) { e = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('La música occidental es aritmética de fracciones. Dos notas suenan bien juntas cuando sus ' +
    'frecuencias están en razón sencilla: $2/1$ es la octava, $3/2$ la quinta, $4/3$ la cuarta. ' +
    'Pitágoras construyó una escala entera encadenando quintas, y se topó con que doce quintas no ' +
    'caen exactamente en siete octavas —$(3/2)^{12}$ no es $2^7$—; ese desajuste, la coma ' +
    'pitagórica, es la razón de que los pianos se afinen con un pequeño apaño en cada nota.');

  p.section('Practica');

  /* corrector reutilizable: exige la fraccion irreducible */
  function checkFrac(want) {
    return function (v, d) {
      var n = v.n, dd = v.d;
      if (isNaN(n) || isNaN(dd)) return { ok: false, msg: 'Escribe los dos números, numerador y denominador.' };
      if (dd === 0) return { ok: false, msg: 'El denominador no puede ser cero.' };
      if (!Number.isInteger(n) || !Number.isInteger(dd)) return { ok: false, msg: 'Numerador y denominador tienen que ser enteros.' };
      var w = want(d);
      if (Math.abs(n / dd - w.val()) > 1e-9) return { ok: false, msg: '<strong>No es correcto.</strong> Ese valor no coincide.' };
      if (ML.gcd(n, dd) !== 1 || dd < 0) {
        return { ok: false, msg: 'El valor está bien, pero <strong>falta simplificar</strong>: la respuesta se da siempre como fracción irreducible con denominador positivo.' };
      }
      return true;
    };
  }

  p.exercise({
    title: 'Simplificar hasta la fracción irreducible',
    level: 'basico',
    gen: function (r) {
      var n = r.int(2, 12), d0 = r.int(2, 12);
      if (d0 === 1) return null;
      var g = ML.gcd(n, d0);
      n /= g; d0 /= g;
      if (d0 === 1) return null;          // saldría un entero, no una fracción
      var k = r.int(2, 9);
      return { n: n * k, d: d0 * k, rn: n, rd: d0, k: k };
    },
    ask: function (d) { return 'Simplifica $\\dfrac{' + d.n + '}{' + d.d + '}$ todo lo que se pueda.'; },
    fields: [{ name: 'n', label: 'Numerador', w: 'tiny' }, { name: 'd', label: 'Denominador', w: 'tiny' }],
    sol: function (d) { return { n: d.rn, d: d.rd }; },
    check: checkFrac(function (d) { return ML.F(d.rn, d.rd); }),
    hint: function (d) { return 'Calcula $\\operatorname{mcd}(' + d.n + ', ' + d.d + ')$ y divide arriba y abajo por él.'; },
    steps: function (d) {
      var g = ML.gcd(d.n, d.d);
      return ['$' + d.n + ' = ' + ML.factorTex(d.n) + '$ y $' + d.d + ' = ' + ML.factorTex(d.d) + '$.',
        'El máximo común divisor es $' + g + '$.',
        'Dividimos arriba y abajo: $\\dfrac{' + d.n + ':' + g + '}{' + d.d + ':' + g + '} = \\dfrac{' + d.rn + '}{' + d.rd + '}$.'];
    },
    answer: function (d) { return '$\\dfrac{' + d.rn + '}{' + d.rd + '}$'; }
  });

  p.exercise({
    title: 'Suma y resta de fracciones',
    level: 'medio',
    gen: function (r) {
      var b = r.int(2, 9), e = r.int(2, 9);
      var a = r.int(1, 9), c = r.int(1, 9);
      var op = r.bool() ? '+' : '-';
      var res = op === '+' ? ML.F(a, b).add(ML.F(c, e)) : ML.F(a, b).sub(ML.F(c, e));
      if (res.n === 0) return null;
      return { a: a, b: b, c: c, e: e, op: op, res: res };
    },
    ask: function (d) {
      return 'Calcula y simplifica: $\\dfrac{' + d.a + '}{' + d.b + '} ' + d.op +
        ' \\dfrac{' + d.c + '}{' + d.e + '}$';
    },
    fields: [{ name: 'n', label: 'Numerador', w: 'tiny' }, { name: 'd', label: 'Denominador', w: 'tiny' }],
    sol: function (d) { return { n: d.res.n, d: d.res.d }; },
    check: checkFrac(function (d) { return d.res; }),
    hint: function (d) { return 'Denominador común: $\\operatorname{mcm}(' + d.b + ',' + d.e + ') = ' + ML.lcm(d.b, d.e) + '$.'; },
    steps: function (d) {
      var m = ML.lcm(d.b, d.e);
      var n1 = d.a * (m / d.b), n2 = d.c * (m / d.e);
      var bruto = d.op === '+' ? n1 + n2 : n1 - n2;
      return ['Denominador común: $\\operatorname{mcm}(' + d.b + ',' + d.e + ') = ' + m + '$.',
        '$\\dfrac{' + d.a + '}{' + d.b + '} = \\dfrac{' + n1 + '}{' + m + '}$ y $\\dfrac{' + d.c + '}{' + d.e + '} = \\dfrac{' + n2 + '}{' + m + '}$.',
        'Ahora ya se pueden juntar: $\\dfrac{' + n1 + ' ' + d.op + ' ' + n2 + '}{' + m + '} = \\dfrac{' + bruto + '}{' + m + '}$.',
        'Y se simplifica: $\\dfrac{' + bruto + '}{' + m + '} = ' + d.res.tex() + '$.'];
    },
    answer: function (d) { return '$' + d.res.tex() + ' = ' + U.fmt(d.res.val(), 4) + '$'; }
  });

  p.exercise({
    title: 'Producto y cociente',
    level: 'medio',
    gen: function (r) {
      var a = r.int(1, 9), b = r.int(2, 9), c = r.int(1, 9), e = r.int(2, 9);
      var op = r.bool() ? '\\cdot' : ':';
      var res = op === '\\cdot' ? ML.F(a, b).mul(ML.F(c, e)) : ML.F(a, b).div(ML.F(c, e));
      return { a: a, b: b, c: c, e: e, op: op, res: res };
    },
    ask: function (d) {
      return 'Calcula y simplifica: $\\dfrac{' + d.a + '}{' + d.b + '} ' + d.op +
        ' \\dfrac{' + d.c + '}{' + d.e + '}$';
    },
    fields: [{ name: 'n', label: 'Numerador', w: 'tiny' }, { name: 'd', label: 'Denominador', w: 'tiny' }],
    sol: function (d) { return { n: d.res.n, d: d.res.d }; },
    check: checkFrac(function (d) { return d.res; }),
    hint: function (d) {
      return d.op === ':' ? 'Dividir es multiplicar por la inversa: dale la vuelta a la segunda fracción.'
        : 'Numerador por numerador, denominador por denominador. Puedes simplificar antes de multiplicar.';
    },
    steps: function (d) {
      if (d.op === ':') {
        return ['Dividir entre $\\dfrac{' + d.c + '}{' + d.e + '}$ es multiplicar por $\\dfrac{' + d.e + '}{' + d.c + '}$.',
          '$\\dfrac{' + d.a + '}{' + d.b + '} \\cdot \\dfrac{' + d.e + '}{' + d.c + '} = \\dfrac{' + (d.a * d.e) + '}{' + (d.b * d.c) + '}$',
          'Simplificando: $' + d.res.tex() + '$.'];
      }
      return ['Multiplicamos en línea: $\\dfrac{' + d.a + '\\cdot' + d.c + '}{' + d.b + '\\cdot' + d.e + '} = \\dfrac{' + (d.a * d.c) + '}{' + (d.b * d.e) + '}$.',
        'Simplificando: $' + d.res.tex() + '$.'];
    },
    answer: function (d) { return '$' + d.res.tex() + '$'; }
  });

  p.exercise({
    title: 'Fracción de una cantidad',
    level: 'basico',
    gen: function (r) {
      var b = r.pick([2, 3, 4, 5, 6, 8]);
      var a = r.int(1, b - 1);
      var total = b * r.int(3, 30);
      return { a: a, b: b, total: total, res: total * a / b };
    },
    ask: function (d) {
      return 'En una clase hay $' + d.total + '$ alumnos y $\\dfrac{' + d.a + '}{' + d.b +
        '}$ de ellos han ido de excursión. ¿Cuántos han ido?';
    },
    fields: [{ name: 'r', label: 'Alumnos', w: 'tiny' }],
    sol: function (d) { return { r: d.res }; },
    hint: function (d) { return 'Divide entre $' + d.b + '$ (una parte) y multiplica por $' + d.a + '$.'; },
    steps: function (d) {
      return ['Partimos el total en $' + d.b + '$ partes: $' + d.total + ' : ' + d.b + ' = ' + (d.total / d.b) + '$.',
        'Tomamos $' + d.a + '$ de esas partes: $' + (d.total / d.b) + ' \\cdot ' + d.a + ' = ' + d.res + '$.',
        'En una sola operación: $\\dfrac{' + d.a + '}{' + d.b + '}\\cdot ' + d.total + ' = ' + d.res + '$.'];
    },
    answer: function (d) { return d.res + ' alumnos.'; }
  });

  p.exercise({
    title: 'Comparar dos fracciones',
    level: 'medio',
    gen: function (r) {
      var b = r.int(2, 11), e = r.int(2, 11);
      var a = r.int(1, b), c = r.int(1, e);
      if (a * e === c * b) return null;
      return { a: a, b: b, c: c, e: e, mayor: (a / b > c / e) ? 1 : 2 };
    },
    ask: function (d) {
      return '¿Cuál es mayor, $\\dfrac{' + d.a + '}{' + d.b + '}$ (la <strong>1</strong>) o ' +
        '$\\dfrac{' + d.c + '}{' + d.e + '}$ (la <strong>2</strong>)? Escribe 1 o 2.';
    },
    fields: [{ name: 'm', label: 'La mayor es la', w: 'tiny' }],
    sol: function (d) { return { m: d.mayor }; },
    hint: function () { return 'Multiplica en cruz: compara $a\\cdot d$ con $c\\cdot b$.'; },
    steps: function (d) {
      return ['Multiplicamos en cruz: $' + d.a + '\\cdot' + d.e + ' = ' + (d.a * d.e) +
        '$ y $' + d.c + '\\cdot' + d.b + ' = ' + (d.c * d.b) + '$.',
        'Como $' + (d.a * d.e) + (d.a * d.e > d.c * d.b ? ' > ' : ' < ') + (d.c * d.b) +
        '$, gana la fracción ' + d.mayor + '.',
        'En decimales: $' + U.fmt(d.a / d.b, 3) + '$ frente a $' + U.fmt(d.c / d.e, 3) + '$.'];
    },
    answer: function (d) { return 'La ' + d.mayor + '.'; }
  });

  p.keys([
    'El denominador dice en cuántas partes se corta; el numerador, cuántas se toman.',
    'Una fracción es a la vez una parte, una división y un punto de la recta.',
    'Multiplicar arriba y abajo por lo mismo no cambia el valor: fracciones equivalentes.',
    'La respuesta se da siempre <strong>simplificada</strong> (irreducible).',
    'Para sumar hay que igualar denominadores; para multiplicar, no.',
    'Dividir entre una fracción = multiplicar por su inversa.'
  ]);
});
