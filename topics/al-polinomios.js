/* Tema: Polinomios: operaciones y Ruffini */
Course.topic('al-polinomios', function (p) {

  p.text('Un <strong>polinomio</strong> es una suma de monomios de una misma variable. Se nombran con ' +
    'letras mayúsculas y se ordenan siempre de mayor a menor grado.');

  p.formula('P(x) = 3x^4 - 2x^2 + 5x - 1', 'grado 4, coeficiente principal 3, término independiente −1');

  p.text('Los polinomios se comportan casi como los números enteros: se suman, se restan, se ' +
    'multiplican y se dividen (con cociente y resto). Esa analogía no es casual y es la que hace ' +
    'que todo lo que sigue resulte familiar.');

  p.section('Suma, resta y producto');
  p.text('Operar con polinomios no exige aprender nada nuevo: son las mismas reglas de siempre, aplicadas ' +
    'con cuidado de no mezclar términos de distinto grado. La única novedad es la vigilancia con los ' +
    'signos al restar, que es donde se pierde la mayoría de los puntos.');


  p.list([
    '<strong>Sumar y restar</strong>: agrupar términos semejantes. Solo se suman los del mismo grado.',
    '<strong>Multiplicar</strong>: cada término del primero por cada término del segundo (distributiva), y luego reducir.',
    'El grado del producto es la <strong>suma</strong> de los grados: $\\operatorname{gr}(P\\cdot Q) = \\operatorname{gr}(P) + \\operatorname{gr}(Q)$.'
  ]);

  p.demo({
    title: 'Multiplicar polinomios en una tabla',
    intro: 'Cada casilla es el producto de un término por otro. Después solo hay que sumar las diagonales, que son los términos del mismo grado.',
    build: function (host, d) {
      var A = [1, -2, 3], B = [2, 1];      // A: x^2-2x+3, B: 2x+1
      var out = W.readout(host, '');
      var tabla = U.el('div');
      host.appendChild(tabla);
      function pinta() {
        U.clear(tabla);
        var gA = A.length - 1, gB = B.length - 1;
        var head = [''], rows = [];
        for (var i = 0; i <= gA; i++) head.push('$' + ML.termTex(A[i], 'x', gA - i, true) + '$');
        for (var j = 0; j <= gB; j++) {
          var row = ['$' + ML.termTex(B[j], 'x', gB - j, true) + '$'];
          for (var i2 = 0; i2 <= gA; i2++) {
            row.push('$' + ML.termTex(A[i2] * B[j], 'x', (gA - i2) + (gB - j), true) + '$');
          }
          rows.push(row);
        }
        var wrap = U.el('div.tbl-wrap');
        var t = U.el('table.tbl');
        t.innerHTML = '<thead><tr>' + head.map(function (h) { return '<th>' + MathX.inline(h) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + rows.map(function (rw) {
            return '<tr>' + rw.map(function (c, k) {
              return '<t' + (k === 0 ? 'h' : 'd') + '>' + MathX.inline(c) + '</t' + (k === 0 ? 'h' : 'd') + '>';
            }).join('') + '</tr>';
          }).join('') + '</tbody>';
        wrap.appendChild(t);
        tabla.appendChild(wrap);
        var prod = ML.polyMul(A, B);
        out.set('$\\left(' + ML.polyTex(A) + '\\right)\\left(' + ML.polyTex(B) + '\\right) = ' +
          ML.polyTex(prod) + '$<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Grado ' +
          (A.length - 1) + ' por grado ' + (B.length - 1) + ' da grado ' + (prod.length - 1) + '.</span>');
      }
      var row = W.row(host);
      W.slider(row, { label: 'coef. de $x^2$ en P', min: -4, max: 4, step: 1, value: 1, dec: 0, on: function (v) { A[0] = v || 1; pinta(); } });
      W.slider(row, { label: 'coef. de $x$ en P', min: -5, max: 5, step: 1, value: -2, dec: 0, on: function (v) { A[1] = v; pinta(); } });
      W.slider(row, { label: 'término indep. de P', min: -6, max: 6, step: 1, value: 3, dec: 0, on: function (v) { A[2] = v; pinta(); } });
      var row2 = W.row(host);
      W.slider(row2, { label: 'coef. de $x$ en Q', min: -4, max: 4, step: 1, value: 2, dec: 0, on: function (v) { B[0] = v || 1; pinta(); } });
      W.slider(row2, { label: 'término indep. de Q', min: -6, max: 6, step: 1, value: 1, dec: 0, on: function (v) { B[1] = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('División de polinomios');

  p.text('Funciona igual que la división entera de toda la vida, y cumple exactamente la misma ' +
    'relación fundamental:');

  p.formula('P(x) = Q(x)\\cdot C(x) + R(x), \\qquad \\operatorname{gr}(R) < \\operatorname{gr}(Q)', 'la división de polinomios',
    'Se lee: <em>«pe de equis es igual a cu de equis por ce de equis, más erre de equis»</em>, donde ' +
      '$P$ es el dividendo, $Q$ el divisor, $C$ el cociente y $R$ el resto.<br><br>Y ' +
      '$\\operatorname{grado}(R) < \\operatorname{grado}(Q)$ se dice <em>«el grado del resto es menor ' +
      'que el grado del divisor»</em>. Esa condición es la que dice cuándo parar de dividir, ' +
      'exactamente igual que con números: se para cuando el resto es más pequeño que el divisor.');

  p.text('Cuando el resto es cero se dice que la división es <strong>exacta</strong> y que $Q(x)$ es ' +
    'un <em>divisor</em> de $P(x)$. Eso es lo que buscamos al factorizar.');

  p.section('Ruffini: el atajo para dividir entre (x − a)');

  p.text('Cuando el divisor es de la forma $x - a$, hay un método mucho más rápido que la división ' +
    'larga: se trabaja solo con los coeficientes.');

  p.demo({
    title: 'La regla de Ruffini, paso a paso',
    intro: 'Se baja el primer coeficiente, se multiplica por a, se suma al siguiente, y se repite. El último número es el resto.',
    build: function (host, d) {
      var coefs = [1, -6, 11, -6], a = 1;
      var out = W.readout(host, '');
      var caja = U.el('div');
      host.appendChild(caja);
      function pinta() {
        var res = ML.ruffini(coefs, a);
        var fila2 = [''], fila3 = [coefs[0]];
        for (var i = 1; i < coefs.length; i++) {
          fila2.push(fila3[i - 1] * a);
          fila3.push(coefs[i] + fila3[i - 1] * a);
        }
        var mono = 'font-family:var(--mono);text-align:right;padding:5px 12px';
        var html = '<div class="tbl-wrap"><table class="tbl"><tbody>' +
          '<tr><td style="' + mono + '"></td>' + coefs.map(function (c) {
            return '<td style="' + mono + '"><strong>' + c + '</strong></td>';
          }).join('') + '</tr>' +
          '<tr><td style="' + mono + ';color:var(--c1)"><strong>' + a + '</strong></td>' +
          fila2.map(function (c) {
            return '<td style="' + mono + ';color:var(--c1)">' + (c === '' ? '' : c) + '</td>';
          }).join('') + '</tr>' +
          '<tr><td style="' + mono + '"></td>' + fila3.map(function (c, i) {
            var esResto = i === fila3.length - 1;
            return '<td style="' + mono + ';border-top:2px solid var(--line);' +
              (esResto ? 'color:var(--c3);' : 'color:var(--c1);') + '"><strong>' + c + '</strong></td>';
          }).join('') + '</tr>' +
          '</tbody></table></div>';
        caja.innerHTML = html;
        out.set('$' + ML.polyTex(coefs) + '$ dividido entre $x' + (a >= 0 ? '-' + a : '+' + (-a)) + '$<br>' +
          'Cociente: $' + ML.polyTex(res.q) + '$ &nbsp;·&nbsp; ' +
          '<span style="color:var(--c3)">Resto: $' + res.rest + '$</span>' +
          (res.rest === 0 ? ' → <strong style="color:var(--ok)">división exacta: $x = ' + a + '$ es raíz</strong>' : ''));
      }
      var row = W.row(host);
      W.slider(row, { label: 'valor de a', min: -4, max: 4, step: 1, value: 1, dec: 0, on: function (v) { a = v; pinta(); } });
      W.chips(host, [
        { label: '$x^3-6x^2+11x-6$', value: [1, -6, 11, -6] },
        { label: '$x^3-x^2-4x+4$', value: [1, -1, -4, 4] },
        { label: '$2x^3+x^2-8x-4$', value: [2, 1, -8, -4] }
      ], { toggle: false, on: function (v) { coefs = v; pinta(); } });
      pinta();
    }
  });

  p.hist('Paolo Ruffini publicó su método en 1804, en el mismo trabajo en el que intentó demostrar que no ' +
    'existe fórmula para las ecuaciones de quinto grado. La demostración tenía una laguna y la ' +
    'comunidad matemática la ignoró; el propio Ruffini murió sin ver reconocida su intuición. Abel ' +
    'la completó veinte años después y hoy el resultado lleva el nombre de los dos. De aquel trabajo ' +
    'incomprendido solo sobrevive en las aulas la parte pequeña: el esquema de dividir.');

  p.sub('Teorema del resto');

  p.text('El último número de Ruffini no es un número cualquiera. Es exactamente el valor del ' +
    'polinomio en $a$:');

  p.formula('R = P(a)', 'teorema del resto');

  p.text('Y de ahí sale el <strong>teorema del factor</strong>, que es el que de verdad se usa:');

  p.formula('P(a) = 0 \\iff (x-a) \\text{ divide a } P(x)', 'teorema del factor');

  p.note('Traducción práctica: <strong>las raíces son los factores</strong>. Si encuentras un valor ' +
    'que anula el polinomio, ya tienes un trozo factorizado. Y por el teorema de las raíces ' +
    'racionales, las candidatas enteras son siempre <em>divisores del término independiente</em>: ' +
    'no hay que probar al azar.', 'ok', 'La estrategia para factorizar');

  /* ================= EJERCICIOS ================= */
  p.util('Ruffini no es un truco de examen: es el algoritmo que usan las calculadoras y los programas de ' +
    'dibujo para evaluar polinomios deprisa, y ahí se llama <em>regla de Horner</em>. Evaluar ' +
    '$x^5-3x^3+2x-7$ a lo bruto exige nueve multiplicaciones; con el esquema de Ruffini, cuatro. ' +
    'Cuando un videojuego dibuja una curva suave, está evaluando polinomios miles de veces por ' +
    'segundo y ese ahorro es la diferencia entre ir fluido o a tirones.');

  p.section('Practica');

  p.exercise({
    title: 'Producto de polinomios',
    level: 'basico',
    gen: function (r) {
      var A = [r.nz(-4, 4), r.nz(-6, 6), r.pm(1, 8)];
      var B = [r.nz(-4, 4), r.pm(1, 7)];
      var prod = ML.polyMul(A, B);
      return { A: A, B: B, prod: prod };
    },
    ask: function (d) {
      return 'Multiplica $\\left(' + ML.polyTex(d.A) + '\\right)\\left(' + ML.polyTex(d.B) + '\\right)$ ' +
        'y da los coeficientes del resultado.';
    },
    fields: [
      { name: 'a', label: 'coef. $x^3$', w: 'tiny' },
      { name: 'b', label: 'coef. $x^2$', w: 'tiny' },
      { name: 'c', label: 'coef. $x$', w: 'tiny' },
      { name: 'd', label: 'indep.', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.prod[0], b: d.prod[1], c: d.prod[2], d: d.prod[3] }; },
    hint: function () { return 'Cada término del primero multiplica a cada término del segundo. Salen 6 productos que hay que agrupar por grados.'; },
    steps: function (d) {
      return ['Aplicamos la distributiva término a término.',
        'Agrupamos los del mismo grado.',
        'Resultado: $' + ML.polyTex(d.prod) + '$',
        'Comprobación de grados: $2 + 1 = 3$ ✓'];
    },
    answer: function (d) { return '$' + ML.polyTex(d.prod) + '$'; }
  });

  p.exercise({
    title: 'Teorema del resto sin dividir',
    level: 'basico',
    gen: function (r) {
      var c = [r.nz(-3, 3), r.pm(1, 6), r.pm(1, 7), r.pm(1, 9)];
      var a = r.pm(1, 3);
      return { c: c, a: a, val: ML.polyEval(c, a) };
    },
    ask: function (d) {
      return '¿Qué resto da $' + ML.polyTex(d.c) + '$ al dividirlo entre $x' +
        (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + '$? <em>No hagas la división.</em>';
    },
    fields: [{ name: 'r', label: 'Resto', w: 'tiny' }],
    sol: function (d) { return { r: d.val }; },
    hint: function (d) { return 'Teorema del resto: basta con calcular $P(' + d.a + ')$.'; },
    steps: function (d) {
      return ['El teorema del resto dice que el resto de dividir entre $x-a$ es $P(a)$.',
        'Aquí $a = ' + d.a + '$, así que sustituimos.',
        '$P(' + d.a + ') = ' + d.val + '$',
        d.val === 0 ? 'Como da cero, $x' + (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + '$ es un factor del polinomio.'
          : 'Como no da cero, la división no es exacta.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Ruffini y teorema del resto',
    level: 'medio',
    gen: function (r) {
      var c = [r.pick([1, 1, 2]), r.pm(1, 6), r.pm(1, 8), r.pm(1, 9)];
      var a = r.pm(1, 4);
      var res = ML.ruffini(c, a);
      return { c: c, a: a, q: res.q, rest: res.rest };
    },
    ask: function (d) {
      return 'Divide $' + ML.polyTex(d.c) + '$ entre $x' + (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) +
        '$ usando Ruffini. Da los coeficientes del cociente y el resto.';
    },
    fields: [
      { name: 'a', label: 'coef. $x^2$', w: 'tiny' },
      { name: 'b', label: 'coef. $x$', w: 'tiny' },
      { name: 'c', label: 'indep.', w: 'tiny' },
      { name: 'r', label: 'Resto', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.q[0], b: d.q[1], c: d.q[2], r: d.rest }; },
    hint: function (d) { return 'Baja el primer coeficiente, multiplícalo por $' + d.a + '$ y súmalo al siguiente. Repite.'; },
    steps: function (d) {
      var f = [d.c[0]];
      var s = ['Bajamos el primer coeficiente: $' + d.c[0] + '$.'];
      for (var i = 1; i < d.c.length; i++) {
        var prod = f[i - 1] * d.a;
        f.push(d.c[i] + prod);
        s.push('$' + f[i - 1] + ' \\cdot ' + d.a + ' = ' + prod + '$, y $' + d.c[i] + ' + (' + prod + ') = ' + f[i] + '$.');
      }
      s.push('Cociente: $' + ML.polyTex(d.q) + '$ &nbsp;·&nbsp; Resto: $' + d.rest + '$.');
      s.push('Comprobación con el teorema del resto: $P(' + d.a + ') = ' + ML.polyEval(d.c, d.a) + '$ ✓');
      return s;
    },
    answer: function (d) { return 'Cociente $' + ML.polyTex(d.q) + '$, resto $' + d.rest + '$.'; }
  });

  p.exercise({
    title: 'Encuentra una raíz entera',
    level: 'medio',
    gen: function (r) {
      var r1 = r.pm(1, 5), r2 = r.pm(1, 5), r3 = r.pm(1, 5);
      var c = ML.polyMul(ML.polyMul([1, -r1], [1, -r2]), [1, -r3]);
      if (Math.abs(c[3]) > 60) return null;
      var raices = [r1, r2, r3].sort(function (a, b) { return a - b; });
      return { c: c, raices: raices, menor: raices[0] };
    },
    ask: function (d) {
      return 'El polinomio $' + ML.polyTex(d.c) + '$ tiene tres raíces enteras. ' +
        'Escribe la <strong>menor</strong> de ellas.';
    },
    fields: [{ name: 'r', label: 'Raíz menor', w: 'tiny' }],
    sol: function (d) { return { r: d.menor }; },
    hint: function (d) {
      return 'Las candidatas son los divisores de $' + d.c[3] + '$ (con los dos signos). Pruébalas con Ruffini.';
    },
    steps: function (d) {
      return ['El término independiente es $' + d.c[3] + '$, así que las raíces enteras están entre sus divisores: $\\pm' +
        ML.divisors(Math.abs(d.c[3])).join(', \\pm') + '$.',
        'Probando con Ruffini (o sustituyendo) encontramos que se anulan en $' + d.raices.join('$, $') + '$.',
        'El polinomio factorizado es $' + d.c[0] + d.raices.map(function (x) {
          return '(x' + (x >= 0 ? '-' + x : '+' + (-x)) + ')';
        }).join('') + '$.',
        'La menor es $' + d.menor + '$.'];
    },
    answer: function (d) { return 'Raíces: ' + d.raices.join(', ') + '. La menor es ' + d.menor + '.'; }
  });

  p.keys([
    'Los polinomios se suman, restan, multiplican y dividen como los enteros: $P = Q\\cdot C + R$.',
    'El grado del producto es la suma de los grados.',
    'Ruffini divide entre $x-a$ trabajando solo con los coeficientes.',
    'Teorema del resto: el resto de dividir entre $x-a$ es $P(a)$.',
    'Teorema del factor: $P(a)=0 \\iff (x-a)$ divide a $P(x)$. <strong>Las raíces son los factores.</strong>',
    'Las raíces enteras están entre los divisores del término independiente.'
  ]);
});
