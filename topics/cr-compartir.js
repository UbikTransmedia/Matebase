/* Tema: Compartir un secreto: el esquema de Shamir */
Course.topic('cr-compartir', function (p) {

  p.puente('Un [[al-polinomios|polinomio]] de grado dos queda fijado por tres puntos, y dos puntos no ' +
    'lo fijan. Con esa idea de la [[fn-cuadraticas|parábola]], llevada a la aritmética ' +
    '[[cr-modular|módulo un primo]], se reparte un secreto entre varias personas de modo que ' +
    'algunas juntas lo recuperen y menos no sepan nada, en el mismo sentido fuerte que la ' +
    '[[cr-vernam|libreta de un solo uso]].');

  p.text('La clave que firma las actualizaciones de un sistema, o la que protege la raíz del sistema de ' +
    'nombres de internet, no puede estar en manos de una sola persona: se pierde, se roba, se ' +
    'muere. Tampoco puede estar copiada en manos de siete, porque cualquiera de ellas la usaría. Lo ' +
    'que se quiere es que hagan falta, por ejemplo, cinco de las siete, y que cuatro juntas no sepan ' +
    'absolutamente nada. Adi Shamir lo resolvió en 1979 con un polinomio.');

  /* ---------------------------------------------------------------- */
  p.section('Un polinomio que pasa por k puntos');

  p.text('Dos puntos determinan una recta, tres una parábola, $k$ puntos un polinomio de grado $k - 1$. ' +
    'Shamir esconde el secreto en el término independiente: elige al azar los otros coeficientes, y ' +
    'da a cada persona un punto de la curva. Con $k$ puntos se reconstruye el polinomio y se lee el ' +
    'secreto en $x = 0$; con $k - 1$, por ellos pasan infinitos polinomios, uno por cada valor ' +
    'posible del secreto.');

  p.formula('f(x) = s + a_1 x + a_2 x^2 + \\cdots + a_{k-1} x^{k-1}, \\qquad \\text{parte } i = (i, f(i))',
    'el reparto de Shamir con umbral k',
    'Se lee: <em>«efe de equis es el secreto más términos al azar hasta el grado ka menos uno; la parte ' +
    'i es el punto i, efe de i»</em>. Se reparten $n$ partes, con $n \\ge k$; cualesquiera $k$ ' +
    'recuperan $s = f(0)$.');

  p.demo({
    title: 'Tres puntos fijan la parábola; dos, no',
    intro: 'Un secreto escondido en la ordenada en el origen de una parábola, y cinco partes. Con tres cualesquiera se dibuja la única parábola que pasa por ellas y se lee el secreto. Con dos, la demo dibuja varias parábolas posibles: cada una corta el eje en un sitio distinto.',
    predice: 'Con dos partes, ¿qué valores del secreto son compatibles: unos pocos, o cualquiera?',
    build: function (host) {
      var s = 7, a1 = 2, a2 = -0.5, cuantas = 3, elegidas = [1, 3, 5];
      var out = W.readout(host, '');
      function f(x) { return s + a1 * x + a2 * x * x; }
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 6, ymin: -6, ymax: 16, height: 300, xlabel: 'x', ylabel: 'f(x)',
        aria: 'Una parábola con cinco puntos marcados; con tres se dibuja la parábola única y con dos, varias parábolas posibles',
        draw: function (g) {
          var pts = elegidas.slice(0, cuantas).map(function (i) { return [i, f(i)]; });
          if (cuantas >= 3) {
            g.fn(f, { color: 0, w: 2.4 });
            g.point(0, s, { color: 1, r: 7, label: 's = ' + U.fmt(s, 1) });
          } else {
            [-6, -2, 2, 6, 10, 14].forEach(function (s2, j) {
              // parabola por los dos puntos con f(0) = s2
              var x1 = pts[0][0], y1 = pts[0][1], x2 = pts[1][0], y2 = pts[1][1];
              var det = x1 * x2 * x2 - x2 * x1 * x1, b1 = ((y1 - s2) * x2 * x2 - (y2 - s2) * x1 * x1) / det, b2 = (x1 * (y2 - s2) - x2 * (y1 - s2)) / det;
              g.fn(function (x) { return s2 + b1 * x + b2 * x * x; }, { color: j % 6, w: 1.4, alpha: .6 });
              g.point(0, s2, { color: j % 6, r: 4 });
            });
          }
          for (var i = 1; i <= 5; i++) g.point(i, f(i), { color: elegidas.slice(0, cuantas).indexOf(i) >= 0 ? 1 : 'axis', r: elegidas.slice(0, cuantas).indexOf(i) >= 0 ? 6 : 4, label: 'parte ' + i });
        }
      });
      function pinta() {
        plot.render();
        out.set(cuantas >= 3 ? 'Con las partes ' + elegidas.slice(0, 3).join(', ') + ' hay una sola parábola: corta el eje en <strong>' + U.fmt(s, 1) + '</strong>, el secreto.' : 'Con las partes ' + elegidas.slice(0, 2).join(' y ') + ' pasan parábolas con cualquier ordenada en el origen: el secreto puede ser cualquier número. Dos partes no dicen nada.');
      }
      W.chips(host, [{ label: 'tres partes (1, 3, 5)', value: 3 }, { label: 'solo dos (1, 3)', value: 2 }], { value: 3, on: function (v) { cuantas = v; pinta(); } });
      W.slider(W.row(host), { label: 'secreto s', min: -5, max: 15, step: 1, value: s, on: function (v) { s = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Módulo un primo: ni una pista');

  p.text('Sobre los reales, dos puntos ya restringen: las parábolas posibles tienen que pasar por ellos, ' +
    'y un secreto absurdo, como un número negativo enorme, queda descartado. Módulo un primo $p$ ' +
    'no hay «absurdos»: para cada uno de los $p$ valores del secreto existe exactamente un polinomio ' +
    'compatible con las $k - 1$ partes. Es el secreto perfecto de Shannon otra vez: las partes no ' +
    'cambian la probabilidad de nada.');

  p.formula('s = f(0) = \\sum_{i \\in I} y_i\\,\\ell_i, \\qquad \\ell_i = \\prod_{j \\in I,\\ j \\ne i} \\frac{-x_j}{x_i - x_j} \\pmod p',
    'reconstrucción con los coeficientes de Lagrange',
    'Se lee: <em>«el secreto es la suma de cada y sub i por su coeficiente ele sub i, y ele sub i es el ' +
    'producto de menos equis sub j partido por equis sub i menos equis sub j»</em>. Es la fórmula de ' +
    'interpolación de Lagrange evaluada en $x = 0$, con las divisiones hechas como inversos ' +
    'modulares.<br><br>No hace falta reconstruir el polinomio entero: solo su valor en 0. Y los ' +
    'coeficientes $\\ell_i$ dependen solo de <em>qué</em> partes se juntan, no de sus valores.');

  p.demo({
    title: 'Shamir módulo 257',
    intro: 'Un secreto de un byte (0 a 255) repartido en $n$ partes con umbral $k$, módulo el primo 257. Elige qué partes se juntan: con $k$ o más se recupera; con menos, la demo enseña que cualquier secreto es compatible.',
    predice: 'Con umbral 3 y solo las partes 2 y 5, ¿cuántos valores del secreto son compatibles con ellas: 1, unos pocos, o los 257?',
    build: function (host) {
      var P = 257, secreto = 42, k = 3, n = 5, r = U.rng(41), coefs, partes, juntas = [1, 2, 3];
      var out = W.mono(host, '');
      function reparte() {
        coefs = [secreto];
        for (var i = 1; i < k; i++) coefs.push(r.int(1, P - 1));
        partes = [];
        for (var x = 1; x <= n; x++) partes.push([x, CR.polinomioMod(coefs, x, P)]);
      }
      function pinta() {
        var h = '<b>secreto:</b> ' + secreto + '   <b>umbral:</b> ' + k + ' de ' + n + '   <b>polinomio:</b> f(x) = ' + coefs.map(function (c, i) { return c + (i ? 'x' + (i > 1 ? '^' + i : '') : ''); }).join(' + ') + ' mod 257\n<b>partes:</b> ' + partes.map(function (pt) { return '(' + pt[0] + ', ' + pt[1] + ')'; }).join('  ') + '\n\n';
        var sel = partes.filter(function (pt) { return juntas.indexOf(pt[0]) >= 0; });
        if (sel.length >= k) {
          var usadas = sel.slice(0, k), coef = CR.coefLagrange(usadas.map(function (pt) { return pt[0]; }), P), rec = CR.lagrange(usadas, 0, P);
          h += '<b>se juntan</b> ' + usadas.map(function (pt) { return pt[0]; }).join(', ') + ':\n  coeficientes de Lagrange en 0: ' + coef.join(', ') + '\n  secreto = ' + usadas.map(function (pt, i) { return pt[1] + '·' + coef[i]; }).join(' + ') + ' mod 257 = <b>' + rec + '</b>' + (rec === secreto ? ' <span class="cr-ok">✓</span>' : '');
        } else if (sel.length) {
          var compatibles = 0;
          for (var s2 = 0; s2 < P; s2++) { compatibles++; }
          h += '<b>se juntan</b> ' + sel.map(function (pt) { return pt[0]; }).join(', ') + ' (menos de ' + k + '):\n  para cada secreto posible, del 0 al 256, existe exactamente un polinomio de grado ' + (k - 1) + ' que pasa por estas partes y vale ese secreto en 0.\n  <span class="cr-dif">' + compatibles + ' secretos compatibles: no se ha aprendido nada.</span>';
        } else h += 'Elige alguna parte.';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'secreto', min: 0, max: 255, step: 1, value: secreto, on: function (v) { secreto = v; reparte(); pinta(); } });
      W.slider(fila, { label: 'umbral k', min: 2, max: 5, step: 1, value: k, on: function (v) { k = v; reparte(); pinta(); } });
      var caja = U.el('div.chips'); host.appendChild(caja);
      for (var i = 1; i <= n; i++) (function (i) {
        var b = U.el('button.chip' + (juntas.indexOf(i) >= 0 ? '.is-on' : ''), { type: 'button', text: 'parte ' + i });
        b.addEventListener('click', function () { var j = juntas.indexOf(i); if (j >= 0) juntas.splice(j, 1); else juntas.push(i); juntas.sort(); b.classList.toggle('is-on'); pinta(); });
        caja.appendChild(b);
      })(i);
      reparte(); pinta();
    }
  });

  p.ejemplo({
    title: 'Un secreto entre tres, módulo 17',
    enunciado: 'Secreto $s = 5$, umbral $k = 3$, módulo 17, con el polinomio $f(x) = 5 + 3x + 2x^2$. Calcular las partes 1, 2 y 3, y recuperar el secreto a partir de ellas con Lagrange.',
    pasos: [
      { t: '<strong>Las partes.</strong> $f(1) = 5 + 3 + 2 = 10$. $f(2) = 5 + 6 + 8 = 19 \\equiv 2$. $f(3) = 5 + 9 + 18 = 32 \\equiv 15$. Partes: $(1, 10)$, $(2, 2)$, $(3, 15)$.', antes: 'Evalúa el polinomio en 1, 2 y 3, y reduce módulo 17.' },
      { t: '<strong>Los coeficientes en 0.</strong> $\\ell_1 = \\frac{(0-2)(0-3)}{(1-2)(1-3)} = \\frac{6}{2} = 3$. $\\ell_2 = \\frac{(0-1)(0-3)}{(2-1)(2-3)} = \\frac{3}{-1} = -3 \\equiv 14$. $\\ell_3 = \\frac{(0-1)(0-2)}{(3-1)(3-2)} = \\frac{2}{2} = 1$. Comprobación: suman $18 \\equiv 1$, como deben.', antes: 'Para cada parte, el producto de $-x_j$ entre $x_i - x_j$ sobre las otras dos.' },
      { t: '<strong>Recuperar.</strong> $s = 10\\cdot 3 + 2\\cdot 14 + 15\\cdot 1 = 30 + 28 + 15 = 73 = 4\\cdot 17 + 5 \\equiv 5$ ✓.', antes: 'Suma cada $y_i$ por su coeficiente.' },
      { t: '<strong>Con solo dos partes.</strong> Con $(1, 10)$ y $(2, 2)$, para cualquier $s$ entre 0 y 16 hay un polinomio $s + a_1 x + a_2 x^2$ que pasa por las dos: dos ecuaciones lineales con dos incógnitas $a_1, a_2$, siempre con solución módulo un primo. Dos partes no descartan ningún secreto.' }
    ],
    cierre: 'Los coeficientes de Lagrange se calculan una vez para cada combinación de partes y sirven para cualquier secreto: recuperar es una suma ponderada.'
  });

  p.comprueba('Un secreto se reparte con umbral 3 entre 5 personas. Dos de ellas se confabulan. ¿Cuánto saben del secreto?', [
    { t: 'Nada: cada valor posible del secreto es compatible con sus dos partes, con exactamente un polinomio', ok: true, por: 'Es secreto perfecto, como la libreta de un solo uso: las dos partes no cambian la probabilidad de ningún valor. Hace falta la tercera.' },
    { t: 'Dos tercios del secreto', ok: false, por: 'El secreto no se reparte a trozos: cada parte es un punto de un polinomio que lo esconde entero. Con menos del umbral no hay ni un bit.' },
    { t: 'Pueden reducirlo a unos pocos candidatos', ok: false, por: 'Módulo un primo no hay candidatos «raros» que descartar: los $p$ valores son igual de posibles.' }
  ]);

  p.util('La clave que firma la raíz del sistema de nombres de internet está repartida entre siete ' +
    'personas de distintos países, y hacen falta cinco para usarla en una ceremonia pública que se ' +
    'graba. Los gestores de contraseñas y los monederos de criptomonedas ofrecen repartir la clave ' +
    'de recuperación entre familiares o dispositivos. Y como el reparto es lineal, sumar las partes ' +
    'de dos secretos da partes de la suma: es la base de las firmas con umbral, en las que varias ' +
    'partes firman sin que la clave se junte nunca en ningún sitio, y del cálculo entre varias ' +
    'partes que no se fían entre sí.');

  p.hist('Adi Shamir, la S de RSA, publicó <em>How to Share a Secret</em> en 1979, en dos páginas. El mismo ' +
    'año, George Blakley propuso otra solución con hiperplanos que se cortan en un punto. La ' +
    'interpolación de Lagrange es de 1795, y la idea de que $k$ puntos fijan un polinomio de grado ' +
    '$k - 1$ es aún más antigua; lo nuevo fue llevarla a un cuerpo finito y darse cuenta de que ' +
    'entonces $k - 1$ puntos no dicen nada.');

  p.trampas([
    { e: 'Repartir el secreto cortándolo en trozos', por: 'Con tres trozos de una clave de 24 letras, cada persona conoce ocho, y dos juntas dejan solo $26^8$ por probar. Shamir no da ni un bit con menos del umbral.' },
    { e: 'Elegir los coeficientes al azar «a ojo»', por: 'Si los $a_i$ son predecibles, las partes sí dicen algo. Salen del generador criptográfico, como una clave.' },
    { e: 'Trabajar con enteros en vez de módulo un primo', por: 'Sobre los enteros, las partes acotan el secreto: con dos puntos de una parábola de coeficientes «razonables» se descartan muchos valores. Módulo $p$, ninguno.' },
    { e: 'Dar la parte $x = 0$', por: '$f(0)$ es el propio secreto. Las partes se evalúan en $x = 1, 2, \\dots, n$, nunca en 0.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Calcular las partes',
    level: 'basico',
    gen: function (r) { var P = r.pick([17, 19, 23]), s = r.int(1, P - 1), a1 = r.int(1, P - 1), a2 = r.int(1, P - 1), i = r.int(1, 5), j = r.int(1, 5); if (i === j) return null; return { P: P, s: s, a1: a1, a2: a2, i: i, j: j, yi: CR.polinomioMod([s, a1, a2], i, P), yj: CR.polinomioMod([s, a1, a2], j, P) }; },
    ask: function (d) { return 'Secreto $s = ' + d.s + '$ repartido con $f(x) = ' + d.s + ' + ' + d.a1 + 'x + ' + d.a2 + 'x^2$ módulo $' + d.P + '$. Calcula las partes ' + d.i + ' y ' + d.j + ', es decir, $f(' + d.i + ')$ y $f(' + d.j + ')$.'; },
    fields: [{ name: 'a', label: 'f(' + '·)', w: 'tiny' }, { name: 'b', label: 'segunda', w: 'tiny' }],
    sol: function (d) { return { a: d.yi, b: d.yj }; },
    hint: function () { return 'Sustituye y reduce módulo el primo.'; },
    steps: function (d) { return ['$f(' + d.i + ') = ' + d.s + ' + ' + (d.a1 * d.i) + ' + ' + (d.a2 * d.i * d.i) + ' = ' + (d.s + d.a1 * d.i + d.a2 * d.i * d.i) + ' \\equiv ' + d.yi + '$.', '$f(' + d.j + ') = ' + (d.s + d.a1 * d.j + d.a2 * d.j * d.j) + ' \\equiv ' + d.yj + '$.', 'Las partes son $(' + d.i + ', ' + d.yi + ')$ y $(' + d.j + ', ' + d.yj + ')$.']; },
    answer: function (d) { return d.yi + ' y ' + d.yj; }
  });

  p.exercise({
    title: 'Cuántas partes caben',
    level: 'basico',
    gen: function (r) { var P = r.pick([17, 101, 257, 65537]), k = r.int(2, 6); return { P: P, k: k, max: P - 1 }; },
    ask: function (d) { return 'Un reparto de Shamir módulo $p = ' + U.miles(d.P) + '$ con umbral ' + d.k + '. ¿Cuántas partes distintas se pueden emitir como máximo? ¿Y cuál es el menor número de personas que, juntándose, recuperan el secreto?'; },
    fields: [{ name: 'n', label: 'partes máximas', w: 'tiny' }, { name: 'k', label: 'mínimo para recuperar', w: 'tiny' }],
    sol: function (d) { return { n: d.max, k: d.k }; },
    errores: [{ si: function (v, d) { return v.n === d.P; }, msg: 'La $x = 0$ no vale como parte: sería el propio secreto. Quedan $p - 1$.' }],
    hint: function () { return 'Una parte por cada $x$ distinto de 0 módulo $p$.'; },
    steps: function (d) { return ['Las abscisas van de 1 a $' + U.miles(d.max) + '$: $' + U.miles(d.max) + '$ partes posibles.', 'Con el umbral ' + d.k + ', cualesquiera ' + d.k + ' recuperan el secreto, y ' + (d.k - 1) + ' no saben nada.']; },
    answer: function (d) { return U.miles(d.max) + ' partes, ' + d.k + ' para recuperar'; }
  });

  p.exercise({
    title: 'Dos partes de una recta',
    level: 'medio',
    gen: function (r) { var P = r.pick([17, 19, 23, 29]), s = r.int(1, P - 1), a = r.int(1, P - 1), x1 = r.int(1, 6), x2 = r.int(1, 6); if (x1 === x2) return null; return { P: P, s: s, a: a, x1: x1, y1: CR.mod(s + a * x1, P), x2: x2, y2: CR.mod(s + a * x2, P) }; },
    ask: function (d) { return 'Umbral 2, módulo $' + d.P + '$: el polinomio es una recta $f(x) = s + ax$. Dos partes: $(' + d.x1 + ', ' + d.y1 + ')$ y $(' + d.x2 + ', ' + d.y2 + ')$. Recupera el secreto $s$.'; },
    fields: [{ name: 's', label: 's', w: 'tiny' }],
    sol: function (d) { return { s: d.s }; },
    hint: function (d) { return ['Pendiente: $a = (y_2 - y_1)(x_2 - x_1)^{-1} \\bmod ' + d.P + '$.', 'Después, $s = y_1 - a x_1 \\bmod ' + d.P + '$.']; },
    steps: function (d) { var inv = CR.inv(CR.mod(d.x2 - d.x1, d.P), d.P); return ['$a \\equiv (' + d.y2 + ' - ' + d.y1 + ')\\cdot(' + d.x2 + ' - ' + d.x1 + ')^{-1} \\equiv ' + CR.mod(d.y2 - d.y1, d.P) + '\\cdot ' + inv + ' \\equiv ' + d.a + '$.', '$s \\equiv ' + d.y1 + ' - ' + d.a + '\\cdot ' + d.x1 + ' \\equiv ' + d.s + '$.', 'Con una sola parte, $s$ podría ser cualquiera: hay una recta por $(' + d.x1 + ', ' + d.y1 + ')$ con cada ordenada en el origen.']; },
    answer: function (d) { return String(d.s); }
  });

  p.exercise({
    title: 'Los coeficientes de Lagrange',
    level: 'medio',
    gen: function (r) { var P = r.pick([17, 19, 23]), xs = r.sample([1, 2, 3, 4, 5, 6], 3).sort(function (a, b) { return a - b; }); var l = CR.coefLagrange(xs, P); return { P: P, xs: xs, l: l }; },
    ask: function (d) { return 'Módulo $' + d.P + '$, se juntan las partes con $x = ' + d.xs.join(', ') + '$. Calcula los tres coeficientes de Lagrange en $x = 0$, $\\ell_i = \\prod_{j \\ne i} \\frac{-x_j}{x_i - x_j}$, entre 0 y ' + (d.P - 1) + '.'; },
    fields: [{ name: 'a', label: 'ℓ₁', w: 'tiny' }, { name: 'b', label: 'ℓ₂', w: 'tiny' }, { name: 'c', label: 'ℓ₃', w: 'tiny' }],
    sol: function (d) { return { a: d.l[0], b: d.l[1], c: d.l[2] }; },
    hint: function () { return ['Numerador: producto de los $-x_j$ de las otras dos. Denominador: producto de $x_i - x_j$. Divide multiplicando por el inverso modular.', 'Comprobación: los tres suman 1 módulo $p$.']; },
    steps: function (d) { return d.xs.map(function (xi, i) { var otros = d.xs.filter(function (x) { return x !== xi; }); var num = otros.reduce(function (acc, xj) { return acc * (-xj); }, 1), den = otros.reduce(function (acc, xj) { return acc * (xi - xj); }, 1); return '$\\ell_{' + (i + 1) + '} = \\frac{' + num + '}{' + den + '} \\equiv ' + CR.mod(num, d.P) + '\\cdot ' + CR.inv(den, d.P) + ' \\equiv ' + d.l[i] + '$'; }).concat(['Suman $' + (d.l[0] + d.l[1] + d.l[2]) + ' \\equiv 1$ ✓. Con ellos, el secreto es $\\sum y_i \\ell_i$.']); },
    answer: function (d) { return d.l.join(', '); }
  });

  p.exercise({
    title: 'Recuperar el secreto',
    level: 'avanzado',
    gen: function (r) { var P = r.pick([17, 19, 23]), s = r.int(1, P - 1), a1 = r.int(1, P - 1), a2 = r.int(1, P - 1), xs = r.sample([1, 2, 3, 4, 5], 3).sort(function (a, b) { return a - b; }); var pts = xs.map(function (x) { return [x, CR.polinomioMod([s, a1, a2], x, P)]; }); return { P: P, s: s, pts: pts, l: CR.coefLagrange(xs, P) }; },
    ask: function (d) { return 'Umbral 3, módulo $' + d.P + '$. Tres partes: ' + d.pts.map(function (pt) { return '$(' + pt[0] + ', ' + pt[1] + ')$'; }).join(', ') + '. Recupera el secreto con los coeficientes de Lagrange.'; },
    fields: [{ name: 's', label: 's', w: 'tiny' }],
    sol: function (d) { return { s: d.s }; },
    hint: function (d) { return ['Coeficientes en 0 para $x = ' + d.pts.map(function (pt) { return pt[0]; }).join(', ') + '$: $' + d.l.join(', ') + '$.', '$s = \\sum y_i \\ell_i \\bmod ' + d.P + '$.']; },
    steps: function (d) { return ['$s = ' + d.pts.map(function (pt, i) { return pt[1] + '\\cdot ' + d.l[i]; }).join(' + ') + ' = ' + d.pts.reduce(function (acc, pt, i) { return acc + pt[1] * d.l[i]; }, 0) + ' \\equiv ' + d.s + ' \\pmod{' + d.P + '}$.', 'Con dos de las tres partes, $s$ podría ser cualquiera de los ' + d.P + ' valores.']; },
    answer: function (d) { return String(d.s); }
  });

  p.keys([
    'Shamir esconde el secreto en $f(0)$ de un polinomio de grado $k - 1$ con coeficientes al azar, y reparte puntos $(i, f(i))$.',
    'Cualesquiera $k$ partes reconstruyen $f(0)$ con los coeficientes de Lagrange: $s = \\sum y_i \\ell_i$, con $\\ell_i = \\prod_{j \\ne i} \\frac{-x_j}{x_i - x_j}$.',
    'Módulo un primo, $k - 1$ partes son compatibles con todos los secretos por igual: secreto perfecto.',
    'Nunca se da la parte $x = 0$, y los coeficientes salen del generador criptográfico.',
    'El reparto es lineal: sumar partes da partes de la suma, y de ahí salen las firmas con umbral.'
  ]);
});
