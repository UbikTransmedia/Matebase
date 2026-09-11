/* Tema: Aprender jugando: MENACE y el refuerzo */
Course.topic('cib-refuerzo', function (p) {

  p.puente('El perceptrón aprendía porque alguien le decía la respuesta correcta en cada ejemplo. Este ' +
    'tema quita esa ayuda: solo llega, al final, un premio o un castigo. Las herramientas son la ' +
    '[[pe-probabilidad|regla de Laplace]], la esperanza de una variable aleatoria y la probabilidad total.');

  p.text('En 1961, Donald Michie quería demostrar que una máquina podía aprender a jugar sin que nadie le ' +
    'explicara la estrategia. No tenía un ordenador a mano, así que construyó uno con lo que había: ' +
    '<strong>287 cajas de cerillas</strong>, una por cada posición distinta del tres en raya, y un saco de ' +
    'cuentas de colores. La llamó MENACE, y aprendía a jugar muy bien con un mecanismo que cabe en tres ' +
    'líneas: premiar lo que acaba bien y castigar lo que acaba mal.');

  p.text('Ese mecanismo es el <strong>aprendizaje por refuerzo</strong>. A diferencia del ' +
    '[[cib-neurona|perceptrón]], aquí nadie dice cuál era la jugada correcta: solo llega, al final, una ' +
    'señal de premio o de castigo. Y con esa señal, repetida muchas veces, se ajusta la conducta. Es otro ' +
    'bucle de [[cib-realimentacion|realimentación]], esta vez sobre probabilidades.');

  /* ---------------------------------------------------------------- */
  p.section('Premio y castigo como realimentación');

  p.list([
    'Cada caja corresponde a una posición del tablero, y dentro hay cuentas de colores: cada color es una jugada posible desde esa posición.',
    'Cuando le toca, MENACE abre la caja de la posición actual, saca una cuenta al azar y hace esa jugada.',
    'Al acabar la partida, repasa las cuentas que ha usado: si ha ganado, añade <strong>3</strong> cuentas de cada color jugado; si ha empatado, <strong>1</strong>; si ha perdido, <strong>retira</strong> la cuenta usada.'
  ], true);

  p.formula('P(\\text{jugada } i) = \\frac{n_i}{n_1 + n_2 + \\dots + n_k}', 'la probabilidad de cada jugada',
    'Se lee: <em>«la probabilidad de la jugada i es el número de cuentas de su color partido por el total de ' +
    'cuentas de la caja»</em>. Es la [[pe-probabilidad|regla de Laplace]]: todas las cuentas son igual de ' +
    'probables al sacar una al azar.<br><br>Premiar una jugada no solo sube su numerador: sube también el ' +
    'total, y con él baja la probabilidad de todas las demás.');

  p.text('Lo notable es que MENACE no sabe nada del tres en raya. No sabe qué es una línea, ni que el centro ' +
    'es buena casilla. Solo cambia probabilidades según los resultados, y las jugadas que llevan a perder ' +
    'se van quedando sin cuentas hasta desaparecer.');

  p.comprueba('Una jugada de MENACE pierde el 60 % de las veces y gana el 40 %. Con premio de 3 cuentas y castigo de 1, ¿acabará desapareciendo de la caja?', [
    { t: 'Sí: pierde más veces de las que gana', ok: false, por: 'Las veces no cuentan igual: cada victoria suma 3 y cada derrota resta 1. De media, $3\\cdot 0{,}4 - 1\\cdot 0{,}6 = 0{,}6$ cuentas por partida: crece.' },
    { t: 'No: de media gana 0,6 cuentas por partida', ok: true, por: 'Es una esperanza. Una jugada puede perder la mayoría de las veces y aun así reforzarse, porque el premio es mayor que el castigo. Para desaparecer tendría que ganar menos del 25 %.' },
    { t: 'Depende del azar de cada partida', ok: false, por: 'Cada partida sí es azar, pero en muchas partidas manda la media. Con esperanza positiva, la tendencia es a crecer.' }
  ]);

  p.ejemplo({
    title: 'Tres partidas de una caja',
    enunciado: 'Una caja tiene 2 cuentas rojas, 2 verdes y 2 azules. MENACE saca roja y gana; luego saca roja y pierde; luego saca verde y pierde. Seguir la probabilidad de la jugada roja.',
    pasos: [
      { t: '<strong>Al principio.</strong> $P(\\text{roja}) = 2/6 = 1/3$. Las tres jugadas son igual de probables.' },
      { t: '<strong>Gana con roja.</strong> Se añaden 3 rojas: 5 rojas de 9. $P(\\text{roja}) = 5/9 \\approx 0{,}56$. Verde y azul han bajado a $2/9$ cada una sin que nadie las tocara.', antes: 'Añade 3 cuentas rojas. ¿Cuántas hay en total ahora?' },
      { t: '<strong>Pierde con roja.</strong> Se quita 1 roja: 4 de 8. $P(\\text{roja}) = 1/2$. Ha bajado, pero sigue muy por encima del tercio inicial: el castigo es más suave que el premio.', antes: 'Quita una roja. ¿Baja mucho?' },
      { t: '<strong>Pierde con verde.</strong> Se quita 1 verde: 4 rojas de 7. $P(\\text{roja}) = 4/7 \\approx 0{,}57$. La roja ha subido sin haber jugado: el castigo a otra la favorece.', antes: 'Ahora la que pierde es la verde. ¿Qué le pasa a la probabilidad de la roja?' },
      { t: '<strong>Balance.</strong> Tres partidas, una ganada, y la roja ha pasado de $0{,}33$ a $0{,}57$. Así de rápido se sesga una caja pequeña; en las cajas grandes el cambio es más lento.' }
    ],
    cierre: 'La probabilidad de una jugada depende de su numerador y del total: subir o bajar las otras también la mueve. Por eso una caja converge tan deprisa hacia lo que funciona.'
  });

  p.demo({
    title: 'MENACE aprende a jugar al Nim',
    intro: 'Hay 13 palillos. Por turnos, cada jugador coge 1, 2 o 3, y gana quien coge el último. MENACE juega primero y tiene una caja para cada número de palillos, con cuentas de tres colores: coger 1, 2 o 3. Si gana, añade 3 cuentas a cada jugada que hizo; si pierde, le quita una. Hazle jugar y mira cómo cambian sus cajas y su porcentaje de victorias.',
    predice: 'Con 13 palillos la jugada ganadora es coger 1, que deja 12. ¿Cuántas partidas crees que tardará MENACE en preferirla claramente contra un rival al azar: 10, 50, 500?',
    build: function (host) {
      var N = 13, rival = 'azar', cajas, partidas, ganadas, historial, rng;
      var out = W.readout(host, '');
      function olvida() {
        cajas = [];
        for (var s = 0; s <= N; s++) cajas.push([0, 3, 3, 3]);          // indices 1..3: cuentas de cada jugada
        partidas = 0; ganadas = 0; historial = []; rng = U.rng(11);
      }
      function elige(s) {
        var c = cajas[s], tot = 0, a;
        for (a = 1; a <= Math.min(3, s); a++) tot += c[a];
        if (tot <= 0) return 0;                                         // caja vacia: se rinde
        var u = rng.real(0, tot);
        for (a = 1; a <= Math.min(3, s); a++) { u -= c[a]; if (u < 0) return a; }
        return Math.min(3, s);
      }
      function juega() {
        var s = N, usadas = [], gana = false;
        for (;;) {
          var a = elige(s);
          if (!a) break;
          usadas.push([s, a]); s -= a;
          if (s === 0) { gana = true; break; }
          s -= (rival === 'perfecto' && s % 4) ? s % 4 : rng.int(1, Math.min(3, s));
          if (s === 0) break;
        }
        usadas.forEach(function (j) { cajas[j[0]][j[1]] = Math.max(0, cajas[j[0]][j[1]] + (gana ? 3 : -1)); });
        partidas++; if (gana) ganadas++;
        historial.push(gana ? 1 : 0);
      }
      olvida();
      var curva = W.plot(host, {
        xmin: 0, xmax: 50, ymin: 0, ymax: 1.05, height: 200, xlabel: 'partidas', ylabel: 'victorias',
        aria: 'Porcentaje de victorias de MENACE en las últimas 20 partidas, según avanza el aprendizaje',
        draw: function (g) {
          var pts = [];
          for (var i = 0; i < historial.length; i++) {
            var a0 = Math.max(0, i - 19), s = 0;
            for (var j = a0; j <= i; j++) s += historial[j];
            pts.push([i + 1, s / (i - a0 + 1)]);
          }
          if (pts.length > 1) g.path(pts, { color: 0, w: 2.4 });
        }
      });
      var cajasPlot = W.plot(host, {
        xmin: 0.3, xmax: N + 0.7, ymin: 0, ymax: 1.12, height: 220, xlabel: 'palillos que quedan', ylabel: 'probabilidad',
        aria: 'Probabilidad con la que MENACE coge 1, 2 o 3 palillos en cada situación',
        draw: function (g) {
          for (var s = 1; s <= N; s++) {
            var c = cajas[s], tot = 0, a, y0 = 0;
            for (a = 1; a <= Math.min(3, s); a++) tot += c[a];
            if (!tot) continue;
            for (a = 1; a <= Math.min(3, s); a++) {
              var h = c[a] / tot;
              if (h > 0) g.rect(s - 0.35, y0, 0.7, h, { fill: true, color: a - 1, fillAlpha: 0.75, w: 1 });
              y0 += h;
            }
            if (s % 4) g.text(s, 1.07, '★', { align: 'center', size: 11, color: s % 4 - 1 });
          }
        }
      });
      function pinta() {
        var ult = historial.slice(-20), media = ult.length ? ult.reduce(function (x, y) { return x + y; }, 0) / ult.length : 0;
        curva.view(0, Math.max(50, partidas), 0, 1.05);
        cajasPlot.render();
        out.set('Partidas: <strong>' + partidas + '</strong> &nbsp;·&nbsp; ganadas: ' + ganadas + (partidas ? ' (' + U.fmt(100 * ganadas / partidas, 0) + ' %)' : '') +
          ' &nbsp;·&nbsp; en las últimas 20: <strong>' + U.fmt(100 * media, 0) + ' %</strong><br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">La estrella marca en cada caja, con su color, la jugada que deja un múltiplo de 4 palillos: la que asegura la victoria. Nadie se lo ha dicho a MENACE.</span>');
      }
      W.chips(host, [{ label: 'rival que juega al azar', value: 'azar' }, { label: 'rival perfecto', value: 'perfecto' }], { value: rival, on: function (v) { rival = v; } });
      W.buttons(host, [
        { t: 'Jugar 1 partida', on: function () { juega(); pinta(); } },
        { t: 'Jugar 50 partidas', on: function () { for (var i = 0; i < 50; i++) juega(); pinta(); } },
        { t: 'Olvidar todo', on: function () { olvida(); pinta(); } }
      ]);
      W.legend(host, [{ c: 0, t: 'coger 1' }, { c: 1, t: 'coger 2' }, { c: 2, t: 'coger 3' }]);
      pinta();
    }
  });

  p.hist('Donald Michie había trabajado durante la Segunda Guerra Mundial en Bletchley Park, descifrando ' +
    'comunicaciones alemanas junto a Alan Turing, con quien discutía a menudo si una máquina podría llegar ' +
    'a aprender. Después fue biólogo y, más tarde, fundó en Edimburgo uno de los primeros grupos de ' +
    'inteligencia artificial de Europa. MENACE, cuyo nombre juega con la palabra inglesa para «amenaza», se ' +
    'ha reconstruido muchas veces en aulas y museos, porque enseña con cajas de cerillas lo mismo que hacen ' +
    'por dentro programas mucho más complejos.');

  /* ---------------------------------------------------------------- */
  p.section('Explorar o aprovechar');

  p.text('Todo el que aprende por refuerzo se topa con el mismo dilema. Si siempre hace lo que mejor le ha ' +
    'ido hasta ahora, <strong>aprovecha</strong> lo aprendido, pero nunca descubrirá si había algo mejor. Si ' +
    'prueba cosas nuevas, <strong>explora</strong>, pero pierde parte de lo que podría ganar ya. Es el ' +
    'dilema de quien elige restaurante: volver al bueno de siempre o probar el nuevo.');

  p.text('La receta más sencilla se llama <strong>ε-voraz</strong> (épsilon-voraz). Se elige un número ' +
    'pequeño, ε: en cada decisión, con probabilidad ε se prueba una opción al azar, y el resto de las ' +
    'veces se elige la que mejor ha ido hasta ahora.');

  p.formula('P(\\text{mejor opción}) = (1 - \\varepsilon) + \\frac{\\varepsilon}{n}, \\qquad P(\\text{otra concreta}) = \\frac{\\varepsilon}{n}',
    'la estrategia ε-voraz con n opciones',
    'La letra $\\varepsilon$ es la épsilon griega.<br><br>La mejor opción se elige de dos maneras: cuando no se ' +
    'explora, con probabilidad $1 - \\varepsilon$, y cuando se explora y el azar cae precisamente en ella, ' +
    'con probabilidad $\\varepsilon \\cdot \\frac{1}{n}$. Se suman porque son casos incompatibles: es la ' +
    '[[pe-condicionada|probabilidad total]].');

  p.demo({
    title: 'Tres tragaperras: explorar o aprovechar',
    intro: 'Tres máquinas dan premio con probabilidades 0,3, 0,5 y 0,7, pero el jugador no lo sabe. Con probabilidad ε prueba una al azar; el resto de las veces juega la que mejor le ha ido. La curva gruesa es el premio medio conseguido, promediado sobre 60 jugadores. Compara con no explorar nunca (ε = 0) y con explorar siempre (ε = 1).',
    predice: 'Con $\\varepsilon = 1$ se elige siempre al azar: el premio medio será la media de $0{,}3$, $0{,}5$ y $0{,}7$. Calcúlala. ¿Y con $\\varepsilon = 0$, crees que quedará por encima o por debajo de esa cifra?',
    build: function (host) {
      var eps = 0.1, P = [0.3, 0.5, 0.7], N = 1000, REPS = 60;
      var out = W.readout(host, '');
      function simula(e, semilla) {
        var rng = U.rng(semilla), n = [0, 0, 0], s = [0, 0, 0], total = 0, curva = [];
        for (var t = 1; t <= N; t++) {
          var m = 0;
          if (rng.real(0, 1) < e) m = rng.int(0, 2);
          else {
            var mejor = -1;
            for (var k = 0; k < 3; k++) { var est = n[k] ? s[k] / n[k] : 1; if (est > mejor) { mejor = est; m = k; } }
          }
          var premio = rng.real(0, 1) < P[m] ? 1 : 0;
          n[m]++; s[m] += premio; total += premio;
          if (t % 10 === 0) curva.push([t, total / t]);
        }
        return { curva: curva, total: total };
      }
      function media(e) {
        var acc = null, tot = 0;
        for (var r = 0; r < REPS; r++) {
          var res = simula(e, 1000 + r);
          tot += res.total;
          if (!acc) acc = res.curva.map(function (q) { return [q[0], q[1] / REPS]; });
          else res.curva.forEach(function (q, i) { acc[i][1] += q[1] / REPS; });
        }
        return { curva: acc, total: tot / REPS };
      }
      var cache = {};
      function mediaCache(e) { var k = U.fmt(e, 2); if (!cache[k]) cache[k] = media(e); return cache[k]; }
      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: 0.25, ymax: 0.75, height: 260, xlabel: 'tiradas', ylabel: 'premio medio',
        draw: function (g) {
          g.hline(0.7, { color: 2, dash: true, w: 1.2 });
          g.text(N - 10, 0.72, 'lo máximo posible', { align: 'right', color: 2, size: 12, box: true });
          g.path(mediaCache(0).curva, { color: 'axis', w: 1.6, dash: [5, 4] });
          g.path(mediaCache(1).curva, { color: 3, w: 1.6, dash: [5, 4] });
          g.path(mediaCache(eps).curva, { color: 0, w: 2.8 });
        }
      });
      function pinta() {
        var m = mediaCache(eps);
        out.set('Con ε = ' + U.fmt(eps, 2) + ', premio medio en ' + N + ' tiradas: <strong>' + U.fmt(m.total / N, 3) + '</strong> &nbsp;·&nbsp; sin explorar nunca: ' +
          U.fmt(mediaCache(0).total / N, 3) + ' &nbsp;·&nbsp; explorando siempre: ' + U.fmt(mediaCache(1).total / N, 3));
        plot.render();
      }
      W.slider(W.row(host), { label: 'ε: probabilidad de explorar', min: 0, max: 1, step: 0.01, value: eps, on: function (v) { eps = v; pinta(); } });
      W.legend(host, [{ c: 0, t: 'tu ε' }, { c: U.palette().axis, t: 'ε = 0' }, { c: 3, t: 'ε = 1' }]);
      pinta();
    }
  });

  p.util('En 1992, Gerald Tesauro entrenó con refuerzo un programa de backgammon que aprendió jugando millones ' +
    'de partidas contra sí mismo, hasta el nivel de los mejores jugadores humanos. En 2016, AlphaGo venció al ' +
    'campeón Lee Sedol al go combinando redes neuronales con aprendizaje por refuerzo, y su sucesor ' +
    'AlphaZero aprendió ajedrez, go y shogi partiendo solo de las reglas. Fuera de los juegos, el mismo ' +
    'dilema de explorar o aprovechar decide qué anuncio mostrar, qué versión de una web probar o cómo ' +
    'repartir pacientes entre tratamientos en un ensayo adaptativo.');

  p.trampas([
    { e: 'Sumar solo al numerador al premiar', por: 'Las cuentas nuevas también entran en el total: de $2/6$ se pasa a $5/9$, no a $5/6$.' },
    { e: 'Contar victorias en vez de cuentas', por: 'Una jugada que pierde el 60 % de las veces crece igual, porque cada victoria vale 3 y cada derrota 1. Lo que decide es la esperanza.' },
    { e: 'Creer que MENACE «sabe» que hay que dejar múltiplos de 4', por: 'No sabe nada del Nim. Las jugadas que llevan a perder se quedan sin cuentas; lo que queda parece una estrategia, y lo es, sin que nadie la haya escrito.' },
    { e: 'No explorar nunca', por: 'Con $\\varepsilon = 0$ el jugador se casa con la primera máquina que le dio premio, y puede ser la peor. Explorar un poco cuesta algo hoy y evita quedarse atrapado.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La caja de cerillas',
    level: 'basico',
    gen: function (r) {
      var c = [r.int(1, 6), r.int(1, 6), r.int(1, 6)], k = r.int(0, 2), tot = c[0] + c[1] + c[2];
      return { c: c, k: k, tot: tot, p1: ML.F(c[k], tot), p2: ML.F(c[k] + 3, tot + 3), mal: ML.F(c[k] + 3, tot), col: ['roja', 'verde', 'azul'][k] };
    },
    ask: function (d) {
      return 'En una caja de MENACE hay ' + d.c[0] + ' cuentas rojas, ' + d.c[1] + ' verdes y ' + d.c[2] + ' azules; cada color es una jugada. ' +
        '¿Qué probabilidad tiene de elegir la jugada ' + d.col + '? Si la juega y gana la partida, se añaden 3 cuentas de ese color: ¿qué probabilidad tendrá entonces? (Fracciones.)';
    },
    fields: [{ name: 'p', label: 'antes', w: 'tiny' }, { name: 'q', label: 'después de ganar', w: 'tiny' }],
    sol: function (d) { return { p: d.p1.val(), q: d.p2.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return Math.abs(v.q - d.mal.val()) < 1e-9; }, msg: 'Las 3 cuentas nuevas también están en la caja: crece el número de cuentas de ese color y crece el total.' }],
    hint: function () { return ['Probabilidad: cuentas de ese color entre cuentas totales.', 'Después de ganar hay 3 cuentas más de ese color y 3 más en total.']; },
    steps: function (d) {
      return ['Antes: $\\dfrac{' + d.c[d.k] + '}{' + d.tot + '}' + (d.p1.d !== d.tot ? ' = ' + d.p1.tex() : '') + '$',
        'Después: $\\dfrac{' + d.c[d.k] + ' + 3}{' + d.tot + ' + 3} = \\dfrac{' + (d.c[d.k] + 3) + '}{' + (d.tot + 3) + '}' + (d.p2.d !== d.tot + 3 ? ' = ' + d.p2.tex() : '') + '$',
        'La jugada premiada sube de probabilidad, y todas las demás de esa caja bajan.'];
    },
    answer: function (d) { return '$' + d.p1.tex() + '$ y $' + d.p2.tex() + '$'; }
  });

  p.exercise({
    title: 'Nim: la jugada ganadora',
    level: 'basico',
    gen: function (r) { var s = r.int(5, 30); return { s: s, a: s % 4 }; },
    ask: function (d) {
      return 'Quedan <strong>' + d.s + ' palillos</strong> y te toca. Cada jugador coge 1, 2 o 3, y gana quien coge el último. ¿Cuántos debes coger para asegurarte la victoria? ' +
        '(Si no hay ninguna jugada que la asegure, escribe 0.)';
    },
    fields: [{ name: 'a', label: 'coger', w: 'tiny' }],
    sol: function (d) { return { a: d.a }; },
    errores: [{ si: function (v, d) { return d.a !== 0 && 4 - d.a !== d.a && v.a === 4 - d.a; }, msg: 'Así el rival recibe un número de palillos que no es múltiplo de 4, y puede ser él quien lo deje en múltiplo de 4. La clave es dejárselo tú.' }],
    hint: function () { return ['Empieza por el final: si quedan 4 y te toca, pierdes, cojas lo que cojas.', 'Intenta dejar siempre al rival un múltiplo de 4.']; },
    steps: function (d) {
      return ['Si al rival le quedan 4, 8, 12… palillos, coja lo que coja (1, 2 o 3), tú puedes coger lo que falte hasta 4 y volver a dejarle un múltiplo de 4. Al final le dejas 0.',
        d.a ? '$' + d.s + ' = 4\\cdot ' + Math.floor(d.s / 4) + ' + ' + d.a + '$: coge <strong>' + d.a + '</strong> y déjale ' + (d.s - d.a) + '.'
          : d.s + ' ya es múltiplo de 4: no hay jugada que asegure la victoria. Te toca esperar a que el rival se equivoque.',
        'Esto es lo que MENACE descubre solo, a fuerza de premios y castigos, en el ejemplo de arriba.'];
    },
    answer: function (d) { return String(d.a); }
  });

  p.exercise({
    title: '¿Crecerán sus cuentas?',
    level: 'medio',
    gen: function (r) {
      var pw = r.int(1, 7) / 10, pd = r.int(0, 3) / 10;
      if (pw + pd > 1) return null;
      var pl = U.round(1 - pw - pd, 2), E = U.round(3 * pw + pd - pl, 4), plano = U.round(pw + pd - pl, 4);
      if (Math.abs(E) < 1e-9) return null;
      return { pw: pw, pd: pd, pl: pl, E: E, plano: plano, tend: E > 0 ? 'crece' : 'mengua' };
    },
    ask: function (d) {
      return 'Con una jugada concreta, MENACE gana el ' + U.fmt(100 * d.pw, 0) + ' % de las partidas, empata el ' + U.fmt(100 * d.pd, 0) + ' % y pierde el ' + U.fmt(100 * d.pl, 0) +
        ' %. Recuerda: si gana se añaden 3 cuentas, si empata 1, y si pierde se quita 1. ¿Cuántas cuentas gana esa jugada, de media, cada vez que se usa? ¿Tenderá a jugarse cada vez más o cada vez menos?';
    },
    fields: [{ name: 'e', label: 'cuentas de media', w: 'tiny' }, { name: 't', label: 'La jugada', opts: [{ t: 'se jugará cada vez más', v: 'crece' }, { t: 'se jugará cada vez menos', v: 'mengua' }] }],
    sol: function (d) { return { e: d.E, t: d.tend }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(d.plano - d.E) > 1e-6 && Math.abs(v.e - d.plano) < 1e-6; }, msg: 'Cada resultado pesa lo que cambian las cuentas: una victoria suma 3, no 1.' }],
    hint: function () { return ['Es una [[pe-binomial|esperanza]]: cada cambio de cuentas por su probabilidad, y se suma.', '$3\\cdot P(\\text{ganar}) + 1\\cdot P(\\text{empatar}) - 1\\cdot P(\\text{perder})$.']; },
    steps: function (d) {
      return ['$3\\cdot ' + U.fmt(d.pw, 1) + ' + 1\\cdot ' + U.fmt(d.pd, 1) + ' - 1\\cdot ' + U.fmt(d.pl, 1) + ' = ' + U.fmt(d.E, 2) + '$',
        d.E > 0 ? 'Es positivo: en promedio la jugada gana cuentas, así que su probabilidad irá subiendo.' : 'Es negativo: en promedio la jugada pierde cuentas, así que irá desapareciendo de la caja.',
        'Fíjate en que una jugada puede perder más de lo que gana y aun así crecer, porque el premio por ganar es mayor que el castigo por perder.'];
    },
    answer: function (d) { return U.fmt(d.E, 2) + ' cuentas; ' + (d.tend === 'crece' ? 'crece' : 'mengua'); }
  });

  p.exercise({
    title: 'La estrategia ε-voraz',
    level: 'medio',
    gen: function (r) {
      var eps = r.pick([0.1, 0.2, 0.3, 0.5]), n = r.pick([3, 4, 5]);
      return { eps: eps, n: n, pb: 1 - eps + eps / n, po: eps / n };
    },
    ask: function (d) {
      return 'Hay ' + d.n + ' máquinas. Con probabilidad ε = ' + U.fmt(d.eps, 1) + ' se elige una al azar entre todas, incluida la mejor; el resto de las veces se juega la que mejor ha ido hasta ahora. ' +
        '¿Con qué probabilidad se juega la mejor? ¿Y una concreta de las otras? (Fracción o cuatro decimales.)';
    },
    fields: [{ name: 'b', label: 'la mejor', w: 'wide' }, { name: 'o', label: 'otra concreta', w: 'wide' }],
    sol: function (d) { return { b: d.pb, o: d.po }; },
    tol: 1e-4,
    errores: [{ si: function (v, d) { return Math.abs(v.b - (1 - d.eps)) < 5e-5; }, msg: 'Al explorar también puede tocar la mejor: a $1 - \\varepsilon$ hay que sumarle $\\frac{\\varepsilon}{n}$.' }],
    hint: function () { return ['La mejor sale cuando no se explora, y también cuando se explora y el azar la elige.', 'Una de las otras solo sale explorando, y entonces con probabilidad $\\frac{1}{n}$.']; },
    steps: function (d) {
      return ['Mejor: $(1 - ' + U.fmt(d.eps, 1) + ') + \\dfrac{' + U.fmt(d.eps, 1) + '}{' + d.n + '} \\approx ' + U.fmt(d.pb, 4) + '$',
        'Otra concreta: $\\dfrac{' + U.fmt(d.eps, 1) + '}{' + d.n + '} \\approx ' + U.fmt(d.po, 4) + '$',
        'Comprobación: $' + U.fmt(d.pb, 4) + ' + ' + (d.n - 1) + '\\cdot ' + U.fmt(d.po, 4) + ' = 1$ ✓'];
    },
    answer: function (d) { return U.fmt(d.pb, 4) + ' y ' + U.fmt(d.po, 4); }
  });

  p.keys([
    'En el aprendizaje por refuerzo no se dice la respuesta correcta: solo llega un premio o un castigo al final.',
    'MENACE guarda en cada caja cuentas por jugada: $P(\\text{jugada}) = \\frac{n_i}{\\sum n_j}$. Premiar añade cuentas; castigar las quita.',
    'Una jugada tiende a crecer si el cambio medio de cuentas, su esperanza, es positivo.',
    'Explorar o aprovechar: con la estrategia ε-voraz, la mejor opción se elige con probabilidad $1 - \\varepsilon + \\frac{\\varepsilon}{n}$.'
  ]);
});
