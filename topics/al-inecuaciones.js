/* Tema: Inecuaciones */
Course.topic('al-inecuaciones', function (p) {

  p.puente('Las ecuaciones de primer y segundo grado ya están resueltas; los intervalos de la recta ' +
    'real, también. Este tema los junta: se cambia el $=$ por un $<$ y la respuesta deja de ser un ' +
    'número para ser un intervalo. La técnica de despejar es la misma, con una sola regla nueva, y ' +
    'la parábola de segundo grado vuelve a aparecer para decidir dónde una expresión es positiva.');

  p.text('Una <strong>inecuación</strong> es como una ecuación pero con una desigualdad en vez del ' +
    'signo igual. Y eso cambia la naturaleza de la respuesta: ya no es un número, es un ' +
    '<strong>tramo entero de la recta</strong>.');

  p.formula('2x - 6 > 0 \\quad\\longrightarrow\\quad x > 3 \\quad\\longrightarrow\\quad x \\in (3, +\\infty)', 'resolver una inecuación de primer grado',
    'Se lee: <em>«dos equis menos seis mayor que cero, luego equis mayor que tres»</em>.<br><br>Los ' +
      'signos: $>$ «mayor que», $<$ «menor que», $\\ge$ «mayor o igual», $\\le$ «menor o ' +
      'igual».<br><br>La regla que hay que tener siempre presente: se opera igual que en una ecuación, ' +
      '<strong>salvo que al multiplicar o dividir por un número negativo hay que dar la vuelta al ' +
      'signo</strong>. Compruébalo: $2<3$ es cierto, pero al multiplicar por $-1$ queda $-2>-3$.');

  p.text('Se resuelven casi igual que las ecuaciones: se transponen términos hasta dejar la ' +
    'incógnita sola. Con <em>una</em> excepción, y es la única cosa importante de este tema.');

  p.note('Al multiplicar o dividir los dos lados por un número <strong>negativo</strong>, hay que ' +
    '<strong>dar la vuelta a la desigualdad</strong>. Es lógico: $3 < 5$, pero al multiplicar por $-1$ ' +
    'queda $-3 > -5$. Los negativos invierten el orden de la recta.', 'warn', 'La única regla nueva');

  p.demo({
    title: 'Por qué se da la vuelta al signo',
    intro: 'Los dos puntos están ordenados. Multiplica por un número negativo y mira cómo se cruzan al saltar al otro lado del cero.',
    predice: '$2 < 5$. Multiplica los dos por $-1$: ¿es $-2 < -5$ o $-2 > -5$? Sitúalos en la recta mentalmente antes de mover $k$.',
    build: function (host, d) {
      var k = 1, a = 2, b = 5;
      var out = W.readout(host, '');
      var plot = W.numberLine(host, {
        min: -12, max: 12, step: 2, height: 140,
        draw: function (g) {
          g.point(a, 0.35, { color: 0, r: 6, label: 'a = ' + a, labelDy: -14 });
          g.point(b, 0.35, { color: 1, r: 6, label: 'b = ' + b, labelDy: -14 });
          g.point(a * k, -0.35, { color: 0, r: 6, label: 'k·a = ' + U.fmt(a * k, 1), labelDy: 16 });
          g.point(b * k, -0.35, { color: 1, r: 6, label: 'k·b = ' + U.fmt(b * k, 1), labelDy: 16 });
          g.vec(a, 0.2, a * k, -0.2, { color: 0, w: 1.5, alpha: .5 });
          g.vec(b, 0.2, b * k, -0.2, { color: 1, w: 1.5, alpha: .5 });
        }
      });
      function paint() {
        var cruzan = k < 0;
        out.set('Arriba: $' + a + ' < ' + b + '$ &nbsp;(siempre cierto)<br>' +
          'Abajo, multiplicando por $k = ' + U.fmt(k, 1) + '$: $' + U.fmt(a * k, 1) +
          (a * k < b * k ? ' < ' : (a * k > b * k ? ' > ' : ' = ')) + U.fmt(b * k, 1) + '$<br>' +
          (cruzan ? '<strong style="color:var(--bad)">Las flechas se cruzan: el orden se ha invertido, ' +
            'así que la desigualdad cambia de sentido.</strong>'
            : (k === 0 ? 'Con $k=0$ todo se aplasta en el cero.'
              : '<strong style="color:var(--ok)">Las flechas no se cruzan: el orden se conserva.</strong>')));
        plot.render();
      }
      W.slider(W.row(host), { label: 'multiplicar por k', min: -2, max: 2, step: 0.5, value: 1, dec: 1, on: function (v) { k = v; paint(); } });
      paint();
    }
  });

  p.ejemplo({
    title: 'Despejar con un coeficiente negativo',
    enunciado: 'Resolver $-3x + 7 \\le 1$.',
    pasos: [
      { t: '<strong>Transponer.</strong> Se pasa el 7 restando, igual que en una ecuación: $-3x \\le -6$. Sumar o restar nunca cambia el sentido.', antes: 'Al pasar el 7 al otro lado, ¿cambia el signo de la desigualdad?' },
      { t: '<strong>Dividir entre $-3$.</strong> Es negativo, así que la desigualdad <strong>se da la vuelta</strong>: $x \\ge 2$.', antes: 'Ahora hay que dividir entre $-3$. ¿Qué pasa con el $\\le$?' },
      { t: '<strong>Escribir la solución.</strong> $x \\in [2, +\\infty)$. Corchete en el 2 porque el $\\le$ incluye la igualdad.' },
      { t: '<strong>Comprobar con un valor.</strong> $x = 3$: $-9 + 7 = -2 \\le 1$ ✓. Y con $x = 0$, que queda fuera: $7 \\le 1$ ✗. La solución está bien orientada.', antes: 'Elige un número dentro de la solución y otro fuera. ¿Cumplen o no cumplen la inecuación original?' }
    ],
    cierre: 'Probar un número de cada lado tarda diez segundos y detecta el error más frecuente del tema: haber olvidado dar la vuelta al signo.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Inecuaciones de segundo grado');

  p.text('Aquí no sirve transponer: hay que pensar en la <strong>parábola</strong>. El método es ' +
    'siempre el mismo y no falla:');

  p.list([
    'Pasar todo a un lado para tener $ax^2+bx+c$ comparado con $0$.',
    'Hallar las <strong>raíces</strong>: son los puntos donde la parábola corta al eje.',
    'Esas raíces parten la recta en tramos. Dentro de cada tramo el signo no cambia.',
    'Tomar un valor de prueba en cada tramo y ver qué signo sale.',
    'Quedarse con los tramos que cumplen la desigualdad.'
  ], true);

  p.demo({
    title: 'El signo de una parábola por tramos',
    intro: 'Las raíces parten la recta en zonas. Cambia los coeficientes y observa dónde la curva queda por encima del eje (positiva) y dónde por debajo (negativa).',
    predice: '$x^2 - x - 6$ tiene raíces $-2$ y $3$. Sustituye $x = 0$, que está entre las dos: ¿sale positivo o negativo? Eso ya te dice el signo de todo el tramo central.',
    build: function (host, d) {
      var a = 1, b = -1, c = -6;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -7, xmax: 7, ymin: -10, ymax: 10, height: 310,
        draw: function (g) {
          var f = function (x) { return a * x * x + b * x + c; };
          g.area(f, -7, 7, { fill: 0, fillAlpha: .12 });
          g.fn(f, { color: 0, w: 2.6 });
          var s = ML.quadratic(a, b, c);
          if (s.n === 2) {
            var lo = Math.min(s.x1, s.x2), hi = Math.max(s.x1, s.x2);
            g.point(lo, 0, { color: 2, r: 6 });
            g.point(hi, 0, { color: 2, r: 6 });
            g.seg(lo, 0, hi, 0, { color: 2, w: 5, alpha: .4 });
          } else if (s.n === 1) g.point(s.x1, 0, { color: 2, r: 6 });
        }
      });
      function paint() {
        var s = ML.quadratic(a, b, c);
        var txt = '$' + ML.polyTex([a, b, c]) + '$<br>';
        if (s.n === 2) {
          var lo = U.round(Math.min(s.x1, s.x2), 4), hi = U.round(Math.max(s.x1, s.x2), 4);
          var dentroPos = a < 0;
          txt += 'Raíces: $' + lo + '$ y $' + hi + '$.<br>' +
            (dentroPos
              ? 'Positiva <strong>entre</strong> las raíces: $(' + lo + ', ' + hi + ')$. Negativa fuera.'
              : 'Negativa <strong>entre</strong> las raíces: $(' + lo + ', ' + hi + ')$. Positiva fuera.');
        } else if (s.n === 1) {
          txt += 'Una raíz doble en $' + U.fmt(s.x1, 4) + '$: la parábola solo toca el eje y no lo cruza. ' +
            'El signo es siempre el de $a$ salvo en ese punto.';
        } else {
          txt += 'No corta al eje: la parábola es <strong>siempre ' + (a > 0 ? 'positiva' : 'negativa') +
            '</strong>, para cualquier valor de $x$.';
        }
        out.set(txt);
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a', min: -3, max: 3, step: 0.5, value: 1, dec: 1, on: function (v) { a = v || 0.5; paint(); } });
      W.slider(row, { label: 'b', min: -6, max: 6, step: 1, value: -1, dec: 0, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'c', min: -9, max: 9, step: 1, value: -6, dec: 0, on: function (v) { c = v; paint(); } });
      paint();
    }
  });

  p.note('Truco que ahorra tiempo: si $a > 0$ la parábola «sonríe», así que es <strong>negativa entre ' +
    'las raíces y positiva fuera</strong>. Si $a < 0$ es al revés. Con eso y las raíces, la solución ' +
    'sale sin probar valores.', 'ok');

  p.comprueba('¿Cuál es la solución de $x^2 - 9 > 0$?', [
    { t: '$x > 3$', ok: false, por: 'Es lo que sale al «despejar» como si fuera de primer grado, y se deja fuera medio resultado: $x = -4$ también cumple $16 - 9 > 0$.' },
    { t: '$(-3, 3)$', ok: false, por: 'Entre las raíces la parábola $x^2 - 9$ (que sonríe) es <em>negativa</em>. Prueba $x = 0$: $-9 > 0$ es falso.' },
    { t: '$(-\\infty, -3)\\cup(3, +\\infty)$', ok: true, por: 'Raíces $\\pm 3$ y $a > 0$: positiva fuera de las raíces. Los extremos van abiertos porque en $\\pm 3$ vale 0, no más que 0.' }
  ]);

  p.trampas([
    { e: '$-2x < 6 \\;\\Rightarrow\\; x < -3$', por: 'Al dividir entre $-2$ se invierte: $x > -3$. Comprueba con $x = 0$: $0 < 6$ es cierto, así que el 0 tiene que estar en la solución.' },
    { e: '$x - 5 > 2 \\;\\Rightarrow\\; x < 7$', por: 'Al sumar o restar el signo <em>no</em> cambia. Solo al multiplicar o dividir por negativo. Aquí $x > 7$.' },
    { e: '$x^2 > 4 \\;\\Rightarrow\\; x > 2$', por: 'Una inecuación de segundo grado no se despeja: se miran las raíces $\\pm 2$ y la parábola. Solución: $x < -2$ o $x > 2$.' }
  ]);

  p.section('Sistemas de inecuaciones');

  p.text('Cuando hay varias condiciones a la vez, se resuelve cada una por separado y la solución ' +
    'es la <strong>intersección</strong>: los valores que cumplen todas. Dibujar los tramos uno debajo ' +
    'de otro en la recta hace el trabajo solo.');

  /* ================= EJERCICIOS ================= */
  p.util('El mundo real casi nunca dice «exactamente»; dice «como mucho» y «al menos». El presupuesto no ' +
    'puede pasar de tanto, la viga tiene que aguantar al menos tanto, la temperatura debe quedarse ' +
    'entre dos valores. Por eso las inecuaciones describen la realidad mejor que las ecuaciones, y ' +
    'por eso el conjunto de soluciones no es un punto sino una región. Esa región tiene nombre y ' +
    'tema propio: se llama región factible y la verás en programación lineal.');

  p.hist('Los signos $<$ y $>$ los introdujo el inglés Thomas Harriot, y se publicaron en 1631, diez años ' +
    'después de su muerte. El $\\le$ tardó dos siglos más en generalizarse. Que unos símbolos tan ' +
    'simples tardaran tanto en asentarse da idea de lo despacio que se mueve la notación: durante ' +
    'generaciones, cada matemático escribía a su manera y leer a un colega extranjero era media ' +
    'traducción.');

  p.section('Practica');

  p.exercise({
    title: 'Inecuación de primer grado',
    level: 'basico',
    gen: function (r) {
      var a = r.nz(-8, 8), b = r.pm(1, 12), c = r.pm(1, 15);
      var sentido = r.pick(['<', '>', '\\le', '\\ge']);
      var frontera = (c - b) / a;
      if (!Number.isInteger(frontera)) return null;
      // al dividir entre a<0 el sentido se invierte
      var mayor = (sentido === '>' || sentido === '\\ge');
      if (a < 0) mayor = !mayor;
      return { a: a, b: b, c: c, sentido: sentido, x: frontera, mayor: mayor };
    },
    ask: function (d) {
      return 'Resuelve $' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + ' ' +
        d.sentido + ' ' + d.c + '$. Da el valor frontera y el sentido de la solución.';
    },
    fields: [
      { name: 'v', label: 'Valor frontera', w: 'tiny' },
      { name: 's', label: 'La solución es', opts: [{ t: '$x$ mayor que ese valor', v: '1' }, { t: '$x$ menor que ese valor', v: '2' }] }
    ],
    sol: function (d) { return { v: d.x, s: d.mayor ? '1' : '2' }; },
    hint: function (d) {
      return d.a < 0 ? 'Cuidado: al dividir entre $' + d.a + '$, que es negativo, hay que dar la vuelta al signo.'
        : 'Se despeja igual que una ecuación; el coeficiente es positivo, así que el signo no cambia.';
    },
    steps: function (d) {
      return ['Pasamos el término independiente: $' + ML.termTex(d.a, 'x', 1, true) + ' ' + d.sentido + ' ' + (d.c - d.b) + '$.',
        'Dividimos entre $' + d.a + '$' + (d.a < 0 ? ', que es <strong>negativo</strong>: se invierte la desigualdad.' : '.'),
        '$x ' + (d.mayor ? (d.sentido.indexOf('e') >= 0 ? '\\ge' : '>') : (d.sentido.indexOf('e') >= 0 ? '\\le' : '<')) + ' ' + d.x + '$',
        'En forma de intervalo: $' + (d.mayor ? '(' + d.x + ', +\\infty)' : '(-\\infty, ' + d.x + ')') + '$.'];
    },
    answer: function (d) { return 'x ' + (d.mayor ? '>' : '<') + ' ' + d.x; }
  });

  p.exercise({
    title: 'Inecuación de segundo grado',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pm(1, 6), x2 = r.pm(1, 6);
      if (x1 === x2) return null;
      var lo = Math.min(x1, x2), hi = Math.max(x1, x2);
      var a = r.pick([1, 1, -1]);
      var b = -a * (x1 + x2), c = a * x1 * x2;
      var sentido = r.bool() ? '<' : '>';
      // entre las raices el trinomio tiene signo contrario al de a
      var esDentro = (sentido === '<') === (a > 0);
      return { a: a, b: b, c: c, lo: lo, hi: hi, sentido: sentido, esDentro: esDentro };
    },
    ask: function (d) {
      return 'Resuelve $' + ML.polyTex([d.a, d.b, d.c]) + ' ' + d.sentido + ' 0$. Da las raíces y di qué tramos forman la solución.';
    },
    fields: [
      { name: 'a', label: 'Raíz menor', w: 'tiny' },
      { name: 'b', label: 'Raíz mayor', w: 'tiny' },
      { name: 't', label: 'Solución', opts: [{ t: 'el intervalo entre las raíces', v: '1' }, { t: 'los dos tramos de fuera', v: '2' }] }
    ],
    sol: function (d) { return { a: d.lo, b: d.hi, t: d.esDentro ? '1' : '2' }; },
    hint: function (d) {
      return 'Halla primero las raíces. Después: si $a > 0$ la parábola sonríe, así que es negativa entre las raíces.';
    },
    steps: function (d) {
      return ['Raíces de $' + ML.polyTex([d.a, d.b, d.c]) + ' = 0$: $x = ' + d.lo + '$ y $x = ' + d.hi + '$.',
        'Como $a = ' + d.a + '$, la parábola ' + (d.a > 0 ? 'se abre hacia arriba' : 'se abre hacia abajo') + '.',
        'Por tanto es ' + (d.a > 0 ? 'negativa entre las raíces y positiva fuera' : 'positiva entre las raíces y negativa fuera') + '.',
        'Como buscamos donde es $' + d.sentido + ' 0$, la solución es ' +
        (d.esDentro ? 'el intervalo $(' + d.lo + ', ' + d.hi + ')$.'
          : 'los tramos $(-\\infty, ' + d.lo + ') \\cup (' + d.hi + ', +\\infty)$.')];
    },
    answer: function (d) {
      return d.esDentro ? '$(' + d.lo + ', ' + d.hi + ')$'
        : '$(-\\infty, ' + d.lo + ') \\cup (' + d.hi + ', +\\infty)$';
    }
  });

  p.exercise({
    title: 'Sistema de inecuaciones',
    level: 'avanzado',
    gen: function (r) {
      var lo = r.int(-8, 4), hi = lo + r.int(2, 8);
      var a1 = r.pick([1, 2, 3]), a2 = r.pick([1, 2, 3]);
      // a1 x > a1 lo   y   a2 x < a2 hi
      return { lo: lo, hi: hi, a1: a1, a2: a2, c1: a1 * lo, c2: a2 * hi };
    },
    ask: function (d) {
      return 'Resuelve el sistema $\\begin{cases}' +
        ML.termTex(d.a1, 'x', 1, true) + ' > ' + d.c1 + ' \\\\ ' +
        ML.termTex(d.a2, 'x', 1, true) + ' < ' + d.c2 + '\\end{cases}$ y da los dos extremos del intervalo solución.';
    },
    show: function (d, host) {
      W.numberLine(host, {
        min: d.lo - 4, max: d.hi + 4, step: 2, height: 130,
        draw: function (g) {
          g.seg(d.lo, 0.45, d.hi + 4, 0.45, { color: 0, w: 5, alpha: .45 });
          g.seg(d.lo - 4, 0.15, d.hi, 0.15, { color: 1, w: 5, alpha: .45 });
          g.seg(d.lo, -0.3, d.hi, -0.3, { color: 2, w: 6 });
          g.point(d.lo, -0.3, { color: 2, r: 5, hollow: true });
          g.point(d.hi, -0.3, { color: 2, r: 5, hollow: true });
          g.text(d.lo - 3.5, 0.45, '1.ª', { size: 12, color: 0 });
          g.text(d.lo - 3.5, 0.15, '2.ª', { size: 12, color: 1 });
          g.text(d.lo - 3.5, -0.3, 'las dos', { size: 12, color: 2 });
        }
      });
    },
    fields: [{ name: 'a', label: 'Extremo izquierdo', w: 'tiny' }, { name: 'b', label: 'Extremo derecho', w: 'tiny' }],
    sol: function (d) { return { a: d.lo, b: d.hi }; },
    hint: function () { return 'Resuelve cada una por separado y quédate con la parte donde se solapan.'; },
    steps: function (d) {
      return ['Primera: $' + ML.termTex(d.a1, 'x', 1, true) + ' > ' + d.c1 + ' \\Rightarrow x > ' + d.lo + '$.',
        'Segunda: $' + ML.termTex(d.a2, 'x', 1, true) + ' < ' + d.c2 + ' \\Rightarrow x < ' + d.hi + '$.',
        'La solución es la <strong>intersección</strong> de los dos tramos.',
        '$x \\in (' + d.lo + ', ' + d.hi + ')$'];
    },
    answer: function (d) { return '$(' + d.lo + ', ' + d.hi + ')$'; }
  });

  p.keys([
    'La solución de una inecuación es un tramo de la recta, no un número.',
    'Se resuelve como una ecuación, <strong>salvo</strong> que al multiplicar o dividir por un negativo se invierte el signo.',
    'De segundo grado: raíces + signo de $a$. Si $a>0$, negativa entre las raíces; si $a<0$, al revés.',
    'Si la parábola no corta al eje, el trinomio tiene siempre el mismo signo.',
    'En un sistema, la solución es la intersección de todos los tramos.'
  ]);
});
