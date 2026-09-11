/* Tema: Diagramas de bloques: el algebra de los bucles */
Course.topic('cib-bloques', function (p) {

  p.puente('El tema anterior dejó el bucle escrito como una sucesión. Este lo escribe como un dibujo de ' +
    'cajas y flechas, y descubre que el dibujo se simplifica con álgebra de primer grado: despejar una ' +
    'incógnita que aparece a los dos lados. Con eso sale la fórmula más importante del control, y para ' +
    'leerla al final hace falta la derivada de un cociente.');

  p.text('Un ingeniero de control casi nunca empieza por las ecuaciones. Empieza por un dibujo: cajas que ' +
    'representan las partes del sistema —un motor, un sensor, un controlador— y flechas que dicen qué ' +
    'señal va de una a otra. Ese dibujo se llama <strong>diagrama de bloques</strong>, y tiene una virtud ' +
    'enorme: se puede <em>reducir</em> con un puñado de reglas, igual que se simplifica una expresión ' +
    'algebraica, hasta dejar una sola caja con una sola fórmula.');

  p.text('En este tema cada caja hace lo más sencillo posible: multiplicar su entrada por un número, su ' +
    '<strong>ganancia</strong>. Con eso basta para descubrir el resultado más importante de toda la teoría ' +
    'del control: por qué un bucle de [[cib-realimentacion|realimentación negativa]] convierte piezas ' +
    'imprecisas en un sistema preciso.');

  /* ---------------------------------------------------------------- */
  p.section('Cajas, flechas y sumadores');

  p.list([
    '<strong>Un bloque</strong> es una caja con una entrada $x$ y una salida $y$. Si su ganancia es $G$, entonces $y = G\\,x$. Un amplificador de ganancia 100 convierte una señal de $0{,}01$ voltios en una de 1 voltio.',
    '<strong>Una flecha</strong> lleva una señal de un sitio a otro sin cambiarla. Puede ramificarse: la misma señal llega a dos sitios a la vez.',
    '<strong>Un sumador</strong> es un círculo al que llegan varias flechas, cada una con su signo, y del que sale la suma. El sumador con un $+$ y un $-$ es el que calcula el error: referencia menos medida.'
  ]);

  p.formulas([
    'y = G_2\\,(G_1\\,x) = (G_1\\,G_2)\\,x \\quad \\text{(en serie)}',
    'y = G_1\\,x + G_2\\,x = (G_1 + G_2)\\,x \\quad \\text{(en paralelo)}'
  ], 'bloques en serie y en paralelo',
    'En serie, la salida de un bloque es la entrada del siguiente: las ganancias se <strong>multiplican</strong>.<br><br>' +
    'En paralelo, la misma señal entra en los dos bloques y las salidas se juntan en un sumador: las ' +
    'ganancias se <strong>suman</strong>, o se restan si el sumador lleva un signo menos.');

  /* ---------------------------------------------------------------- */
  p.section('El bucle cerrado');

  p.text('La tercera forma de conectar es la que da sentido a todo el bloque de cibernética. La salida $y$ ' +
    'se mide con un sensor de ganancia $H$, la medida vuelve hacia atrás y se <em>resta</em> de la ' +
    'referencia $r$. Lo que queda, el error $e = r - H\\,y$, entra en el bloque $G$ y produce la salida. ' +
    'Hay una señal que se persigue la cola: $y$ depende de $e$, y $e$ depende de $y$. Parece un círculo ' +
    'vicioso, pero es solo una [[al-ec1|ecuación de primer grado]].');

  p.formula('y = G\\,(r - H\\,y) \\ \\Rightarrow\\ y\\,(1 + GH) = G\\,r \\ \\Rightarrow\\ T = \\frac{y}{r} = \\frac{G}{1 + GH}',
    'la ganancia en bucle cerrado',
    'Se lee: <em>«la ganancia en bucle cerrado es ge partido por uno más ge hache»</em>.<br><br>' +
    'El producto $GH$ es la <strong>ganancia del bucle</strong>: lo que se amplifica una señal al dar una ' +
    'vuelta completa.<br><br>Si la realimentación fuera <strong>positiva</strong> —la medida se suma en ' +
    'lugar de restarse—, el denominador sería $1 - GH$, y al acercarse $GH$ a 1 la ganancia se dispararía: ' +
    'es el pitido de un micrófono delante de su propio altavoz.');

  p.text('Ahora viene lo sorprendente. Si la ganancia del bucle es grande, el 1 del denominador apenas ' +
    'cuenta y la fórmula se simplifica: $T \\approx \\frac{G}{GH} = \\frac{1}{H}$. <strong>La $G$ ha ' +
    'desaparecido.</strong> El comportamiento del sistema entero ya no depende del bloque potente, ' +
    'impreciso y caro, sino solo del sensor, que puede ser una pieza pequeña, barata y exacta.');

  p.comprueba('Un amplificador de ganancia $G = 1000$ se cierra en bucle con un sensor de $H = 0{,}01$. ¿Qué ganancia tiene el conjunto, aproximadamente?', [
    { t: 'Unos 1000: el sensor apenas cuenta', ok: false, por: 'Al revés: $GH = 10$, el denominador es 11 y $T = 1000/11 \\approx 91$. La realimentación ha «tirado» el 91 % de la ganancia a cambio de precisión.' },
    { t: 'Unos 91, cerca de $1/H = 100$', ok: true, por: '$T = \\frac{1000}{1 + 10} = 90{,}9$. Y si $G$ fuera 10 000, $T = 99$: se acerca al techo $1/H$ y deja de depender de $G$.' },
    { t: 'Unos 10: el producto $GH$', ok: false, por: '$GH = 10$ es la ganancia del <em>bucle</em>, lo que se amplifica una señal al dar la vuelta. La del conjunto es $G/(1 + GH)$.' }
  ]);

  p.ejemplo({
    title: 'Un amplificador que pierde el 20 %',
    enunciado: 'Un bloque tiene $G = 100$ y se realimenta con $H = 0{,}1$. Calcular la ganancia en bucle cerrado. Después, $G$ cae a 80 por desgaste: ¿cuánto cae la ganancia total?',
    pasos: [
      { t: '<strong>Bucle cerrado, nuevo.</strong> $GH = 10$: $T = \\dfrac{100}{1 + 10} = 9{,}09$.', antes: 'Aplica $T = G/(1 + GH)$. ¿Cuánto vale $GH$?' },
      { t: '<strong>Bucle cerrado, desgastado.</strong> $GH = 8$: $T = \\dfrac{80}{1 + 8} = 8{,}89$.' },
      { t: '<strong>La caída.</strong> De 9,09 a 8,89: un $2{,}2\\,\\%$. El bloque ha perdido un 20 % y el sistema entero, un 2 %.', antes: '¿Qué porcentaje de 9,09 es la diferencia $9{,}09 - 8{,}89$?' },
      { t: '<strong>Con la fórmula de la sensibilidad.</strong> $S = \\dfrac{1}{1 + GH} = \\dfrac{1}{11} \\approx 0{,}09$: cada 1 % de cambio en $G$ se nota como un 0,09 % en $T$. Para un 20 %, unos 1,8 %; el 2,2 % exacto difiere un poco porque la fórmula vale para cambios pequeños.' },
      { t: '<strong>El precio.</strong> Sin realimentación la ganancia sería 100; con ella, 9. Se han gastado once veces la ganancia para dividir por once la sensibilidad. Es la misma cuenta.' }
    ],
    cierre: 'Con $H = 0{,}1$ el techo es $1/H = 10$, y $T = 9{,}09$ ya está al 91 % del techo. Si $G$ fuera $10\\,000$, $T$ sería 9,99 y un desgaste del 20 % se notaría como un 0,02 %.'
  });

  p.demo({
    title: 'Un bucle con dos mandos',
    intro: 'Mueve la ganancia G del bloque directo y la del sensor H. Abajo, la ganancia en bucle cerrado según G: por grande que sea G, nunca pasa de 1/H. A partir de cierto punto, lo que decide la salida ya no es G, sino el sensor.',
    predice: 'Con $H = 0{,}2$ el techo es 5. Con $G = 10$, ¿a qué fracción del techo estará $T$: al 50 %, al 67 %, al 90 %? Calcula $10/(1 + 2)$.',
    build: function (host) {
      var G = 10, H = 0.2;
      var out = W.readout(host, '');
      var dib = W.board(host, {
        xmin: 0, xmax: 14, ymin: 0.2, ymax: 5.2, height: 190, grid: false, axes: false,
        aria: 'Diagrama de bloques de un bucle de realimentación negativa, con el bloque G en el camino directo y el sensor H en el de vuelta',
        draw: function (g) {
          g.vec(0.3, 4, 2.55, 4, { color: 'ink', w: 2 });
          g.text(0.35, 4.45, 'r', { italic: true, size: 15 });
          g.circle(3, 4, 0.42, { color: 'ink', w: 2 });
          g.text(2.25, 4.6, '+', { size: 14 });
          g.text(3.3, 3.2, '−', { size: 16 });
          g.vec(3.42, 4, 5, 4, { color: 'ink', w: 2 });
          g.text(4.05, 4.45, 'e', { italic: true, size: 15 });
          g.rect(5, 3.3, 2.8, 1.4, { fill: true, color: 0, fillAlpha: 0.15, w: 2 });
          g.text(6.4, 4, 'G = ' + U.fmt(G, 0), { align: 'center', size: 14 });
          g.vec(7.8, 4, 13.4, 4, { color: 'ink', w: 2 });
          g.text(13.1, 4.45, 'y', { italic: true, size: 15 });
          g.seg(10.5, 4, 10.5, 1.5, { color: 'ink', w: 2 });
          g.point(10.5, 4, { color: 'ink', r: 3 });
          g.vec(10.5, 1.5, 7.85, 1.5, { color: 'ink', w: 2 });
          g.rect(5, 0.8, 2.8, 1.4, { fill: true, color: 1, fillAlpha: 0.15, w: 2 });
          g.text(6.4, 1.5, 'H = ' + U.fmt(H, 2), { align: 'center', size: 14 });
          g.seg(5, 1.5, 3, 1.5, { color: 'ink', w: 2 });
          g.vec(3, 1.5, 3, 3.55, { color: 'ink', w: 2 });
        }
      });
      var curva = W.plot(host, {
        xmin: 0, xmax: 200, ymin: 0, ymax: 6.5, height: 240, xlabel: 'G', ylabel: 'T',
        aria: 'Ganancia en bucle cerrado T en función de la ganancia G del bloque directo',
        draw: function (g) {
          g.hline(1 / H, { color: 1, dash: true, w: 1.6 });
          g.text(196, 1.08 / H, 'techo 1/H', { align: 'right', color: 1, size: 12, box: true });
          g.fn(function (x) { return x / (1 + x * H); }, { color: 0, w: 2.6 });
          g.point(G, G / (1 + G * H), { color: 0, r: 5 });
        }
      });
      function pinta() {
        var T = G / (1 + G * H);
        curva.view(0, 200, 0, 1.3 / H);
        dib.render();
        out.set('Ganancia del bucle: $GH = ' + U.fmt(G * H, 2) + '$ &nbsp;·&nbsp; en bucle cerrado: $T = \\frac{' + U.fmt(G, 0) + '}{1 + ' + U.fmt(G * H, 2) + '} \\approx ' + U.fmt(T, 3) + '$<br>' +
          'Techo: $\\frac{1}{H} = ' + U.fmt(1 / H, 3) + '$ &nbsp;·&nbsp; $T$ ya es el ' + U.fmt(100 * T * H, 1) + ' % del techo.');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'G (bloque directo)', min: 1, max: 200, step: 1, value: G, on: function (v) { G = v; pinta(); } });
      W.slider(fila, { label: 'H (sensor)', min: 0.05, max: 1, step: 0.01, value: H, on: function (v) { H = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Sensibilidad: por qué la realimentación hace robusto un sistema');

  p.text('Las piezas reales cambian: se calientan, envejecen, salen de fábrica cada una un poco distinta. ' +
    'La pregunta práctica es cuánto se nota en la salida un cambio en $G$. Se mide con la ' +
    '<strong>sensibilidad</strong>: el cambio relativo de $T$ dividido entre el cambio relativo de $G$. ' +
    'Derivando la fórmula del bucle cerrado sale algo muy limpio:');

  p.formula('S = \\frac{\\Delta T / T}{\\Delta G / G} \\approx \\frac{G}{T}\\,\\frac{dT}{dG} = \\frac{1}{1 + GH}',
    'la sensibilidad del bucle cerrado',
    'Se lee: <em>«la sensibilidad es uno partido por uno más ge hache»</em>.<br><br>' +
    'Sin realimentación, $T = G$ y la sensibilidad vale 1: un 10 % menos de $G$ es un 10 % menos de salida.<br><br>' +
    'Con una ganancia de bucle $GH = 99$, la sensibilidad es $\\frac{1}{100}$: ese mismo 10 % de desgaste se ' +
    'nota en la salida como un $0{,}1$ %. La cuenta usa la [[fn-derivadas|derivada]] de un cociente, y vale ' +
    'para cambios pequeños; para cambios grandes se calculan las dos ganancias y se comparan.');

  p.note('La realimentación no sale gratis: la ganancia total $T$ es mucho menor que $G$. Lo que se hace es ' +
    '<strong>gastar ganancia para comprar precisión</strong>. Por eso los amplificadores con ' +
    'realimentación se construyen con ganancias directas enormes, de cien mil o más: sobra ganancia para ' +
    'gastar.', 'ok', 'El precio');

  p.demo({
    title: 'Un amplificador que envejece',
    intro: 'Un amplificador tiene ganancia G = 1000 cuando es nuevo, pero con el calor y los años pierde parte de ella. Compara cuánto cae la salida sin realimentación y con ella. Cuanto mayor es la ganancia del bucle GH, menos se nota el desgaste.',
    predice: 'Con $H = 0{,}1$ y una pérdida del 30 %, ¿la barra de la derecha caerá un 3 %, un 0,3 % o menos? Piensa en $GH = 100$.',
    build: function (host) {
      var perdida = 30, H = 0.1, G0 = 1000;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 3, ymin: 0, ymax: 112, height: 260, xlabel: null, ylabel: '% de la salida original',
        aria: 'Barras con el porcentaje de salida que se conserva sin realimentación y con realimentación',
        draw: function (g) {
          var G1 = G0 * (1 - perdida / 100), T0 = G0 / (1 + G0 * H), T1 = G1 / (1 + G1 * H);
          g.hline(100, { color: 'axis', dash: true, w: 1 });
          g.bars([
            { x: 1, h: 100 * G1 / G0, color: 3, top: U.fmt(100 * G1 / G0, 1) + ' %' },
            { x: 2, h: 100 * T1 / T0, color: 0, top: U.fmt(100 * T1 / T0, 2) + ' %' }
          ]);
          g.text(1, 7, 'sin realimentación', { align: 'center', size: 12, box: true });
          g.text(2, 7, 'con realimentación', { align: 'center', size: 12, box: true });
        }
      });
      function pinta() {
        var G1 = G0 * (1 - perdida / 100), T0 = G0 / (1 + G0 * H), T1 = G1 / (1 + G1 * H);
        out.set('Sin realimentación la salida cae un <strong>' + U.fmt(perdida, 0) + ' %</strong>. Con $H = ' + U.fmt(H, 3) +
          '$, la ganancia del bucle pasa de $' + U.fmt(G0 * H, 1) + '$ a $' + U.fmt(G1 * H, 1) + '$ y la salida cae solo un <strong>' +
          U.fmt(100 * (1 - T1 / T0), 2) + ' %</strong>.');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'pérdida de ganancia (%)', min: 0, max: 80, step: 1, value: perdida, on: function (v) { perdida = v; pinta(); } });
      W.slider(fila, { label: 'H (sensor)', min: 0, max: 0.5, step: 0.001, value: H, dec: 3, on: function (v) { H = v; pinta(); } });
      W.hint(host, 'Con H = 0 no hay realimentación y las dos barras coinciden.');
      pinta();
    }
  });

  p.hist('En agosto de 1927, Harold Black, un ingeniero de veintinueve años de los Laboratorios Bell, iba ' +
    'en el ferry que cruzaba el río Hudson camino del trabajo. Llevaba años peleándose con los ' +
    'amplificadores de las líneas telefónicas de larga distancia, que distorsionaban la voz y cambiaban ' +
    'de ganancia con cualquier cosa. Allí se le ocurrió la solución: sacrificar ganancia restando a la ' +
    'entrada una parte de la salida. Lo anotó en el único papel que tenía a mano, un hueco de una página ' +
    'del <em>New York Times</em>. La patente tardó casi una década en concederse: la idea de tirar ' +
    'ganancia a propósito para obtener algo mejor parecía, a quien la leía, un disparate.');

  p.util('El amplificador operacional, el componente analógico más usado de la electrónica, es la idea de ' +
    'Black convertida en pieza: tiene una ganancia directa gigantesca y poco fiable, y se usa siempre con ' +
    'dos resistencias que forman el bucle. La ganancia del circuito depende solo de la razón entre esas ' +
    'resistencias. El mismo diagrama describe el control de crucero de un coche, la regulación del azúcar ' +
    'en sangre y el piloto automático de un avión: cambian las cajas, no el álgebra.');

  p.trampas([
    { e: 'Multiplicar los bloques en paralelo', por: 'En paralelo la misma señal entra en los dos y las salidas se suman: $G_1 + G_2$. Se multiplican los que van en serie.' },
    { e: 'Escribir $1 - GH$ con realimentación negativa', por: 'El signo menos del sumador da $1 + GH$ en el denominador. Con $1 - GH$ sería positiva, y se dispara al acercarse $GH$ a 1.' },
    { e: 'Creer que la realimentación aumenta la ganancia', por: 'La reduce: de $G$ a $G/(1 + GH)$. Lo que compra con esa pérdida es precisión y estabilidad frente al desgaste.' },
    { e: 'Usar $T \\approx 1/H$ con $GH$ pequeño', por: 'La aproximación exige $GH \\gg 1$. Con $G = 5$ y $H = 0{,}1$, $T = 3{,}3$, lejos de $1/H = 10$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Positiva o negativa?',
    level: 'basico',
    gen: function (r) {
      return r.pick([
        { t: 'Un termostato enciende la calefacción cuando la temperatura baja de la consigna y la apaga cuando la supera.', q: 'neg' },
        { t: 'Un micrófono capta el sonido de su propio altavoz, lo amplifica y lo vuelve a emitir, hasta que suena un pitido.', q: 'pos' },
        { t: 'La pupila se cierra cuando entra mucha luz y se abre cuando entra poca.', q: 'neg' },
        { t: 'Un vídeo con muchas visitas aparece más en las recomendaciones, y eso le da todavía más visitas.', q: 'pos' },
        { t: 'Los intereses de una cuenta se suman al saldo, y un saldo mayor genera más intereses.', q: 'pos' },
        { t: 'Cuando sube el azúcar en sangre, el páncreas segrega insulina, que lo hace bajar.', q: 'neg' },
        { t: 'El rumor de que un banco va a quebrar hace que la gente saque su dinero, y eso debilita al banco y hace más creíble el rumor.', q: 'pos' },
        { t: 'Un ciclista que se inclina hacia un lado gira el manillar hacia ese mismo lado y recupera el equilibrio.', q: 'neg' }
      ]);
    },
    ask: function (d) { return '<em>«' + d.t + '»</em><br>¿Qué tipo de realimentación hay en este bucle?'; },
    fields: [{ name: 'q', label: 'Realimentación', opts: [{ t: 'Negativa: tiende a corregir la desviación', v: 'neg' }, { t: 'Positiva: amplifica la desviación', v: 'pos' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return ['Imagina que la variable se desvía un poco hacia arriba.', 'Sigue el bucle: ¿lo que ocurre después la empuja de vuelta o todavía más arriba?']; },
    steps: function (d) {
      return [d.q === 'neg'
        ? 'Una desviación provoca una reacción que la contrarresta: <strong>realimentación negativa</strong>. Estabiliza.'
        : 'Una desviación provoca una reacción que la agranda: <strong>realimentación positiva</strong>. Amplifica, y sin un límite acaba en crecimiento desbocado o en colapso.'];
    },
    answer: function (d) { return d.q === 'neg' ? 'Negativa' : 'Positiva'; }
  });

  p.exercise({
    title: 'Reduce el diagrama',
    level: 'medio',
    gen: function (r) {
      var G1 = r.int(2, 5), G2 = r.int(1, 6), G3 = r.int(1, 4), hd = r.pick([10, 5, 2, 1]);
      var F = G1 * (G2 + G3), Fmal = G1 * G2 * G3;
      return {
        G1: G1, G2: G2, G3: G3, hd: hd, F: F, T: ML.F(F * hd, hd + F),
        Fmal: Fmal, Tmal: Fmal * hd / (hd + Fmal), pos: hd !== F ? F / (1 - F / hd) : null
      };
    },
    ask: function (d) {
      return 'La referencia $r$ entra en un sumador que le resta la medida. El error pasa por un bloque de ganancia ' +
        '$G_1 = ' + d.G1 + '$, y su salida se reparte entre dos bloques en paralelo, $G_2 = ' + d.G2 + '$ y $G_3 = ' + d.G3 +
        '$, cuyas salidas se suman para dar $y$. La salida se mide con un sensor de ganancia $H = ' +
        (d.hd === 1 ? '1' : '\\frac{1}{' + d.hd + '}') + '$, y esa medida es la que se resta al principio.<br><br>' +
        '¿Cuánto vale la ganancia total $T = \\frac{y}{r}$? (Fracción o cuatro decimales.)';
    },
    fields: [{ name: 't', label: 'T =', w: 'wide' }],
    sol: function (d) { return { t: d.T.val() }; },
    tol: 1e-4,
    errores: [
      { si: function (v, d) { return Math.abs(v.t - d.F) < 5e-5; }, msg: 'Esa es la ganancia del camino directo, $G_1(G_2 + G_3)$. Falta cerrar el bucle con $\\frac{G}{1 + GH}$.' },
      { si: function (v, d) { return d.Fmal !== d.F && Math.abs(v.t - d.Tmal) < 5e-5; }, msg: 'Los bloques en paralelo se <strong>suman</strong>; son los bloques en serie los que se multiplican.' },
      { si: function (v, d) { return d.pos !== null && Math.abs(v.t - d.pos) < 5e-5; }, msg: 'Con realimentación negativa el denominador es $1 + GH$. Con $1 - GH$ sería realimentación positiva.' },
      { si: function (v, d) { return Math.abs(v.t - d.hd) < 5e-5; }, msg: 'Eso es $\\frac{1}{H}$, el techo al que se acerca $T$ cuando la ganancia del bucle es enorme. Aquí hay que calcularla exacta.' }
    ],
    hint: function () { return ['Primero reduce el camino directo: la serie multiplica y el paralelo suma.', 'Después cierra el bucle: $T = \\dfrac{G}{1 + GH}$.']; },
    steps: function (d) {
      var GH = ML.F(d.F, d.hd);
      return ['Camino directo: $G = G_1\\,(G_2 + G_3) = ' + d.G1 + '\\cdot ' + (d.G2 + d.G3) + ' = ' + d.F + '$.',
        'Ganancia del bucle: $GH = ' + GH.tex() + '$.',
        '$T = \\dfrac{' + d.F + '}{1 + ' + GH.tex() + '} = ' + d.T.tex() + ' \\approx ' + U.fmt(d.T.val(), 4) + '$'];
    },
    answer: function (d) { return '$' + d.T.tex() + '$'; }
  });

  p.exercise({
    title: 'El sensor que hay que poner',
    level: 'medio',
    gen: function (r) {
      var G = r.pick([10, 20, 50, 100, 200]), T = r.pick([2, 4, 5, 8]);
      return { G: G, T: T, H: ML.F(G - T, G * T) };
    },
    ask: function (d) {
      return 'Un bloque directo tiene ganancia $G = ' + d.G + '$. ¿Qué ganancia $H$ debe tener el sensor para que el bucle ' +
        'cerrado tenga ganancia $T = ' + d.T + '$? (Fracción o cuatro decimales.)';
    },
    fields: [{ name: 'h', label: 'H =', w: 'wide' }],
    sol: function (d) { return { h: d.H.val() }; },
    tol: 1e-4,
    errores: [{ si: function (v, d) { return Math.abs(v.h - 1 / d.T) < 5e-5; }, msg: 'Eso sería si $G$ fuera infinitamente grande, porque entonces $T \\approx \\frac{1}{H}$. Con una $G$ concreta hay que despejar $H$ en la fórmula exacta.' }],
    hint: function (d) { return ['Plantea $' + d.T + ' = \\dfrac{' + d.G + '}{1 + ' + d.G + 'H}$.', 'Multiplica en cruz y despeja $H$.']; },
    steps: function (d) {
      return ['$' + d.T + '\\,(1 + ' + d.G + 'H) = ' + d.G + '$',
        '$' + (d.T * d.G) + 'H = ' + (d.G - d.T) + '$',
        '$H = ' + d.H.tex() + ' = ' + U.fmt(d.H.val(), 4) + '$',
        'Comprobación: $GH = ' + ML.F(d.G - d.T, d.T).tex() + '$ y $\\dfrac{' + d.G + '}{1 + ' + ML.F(d.G - d.T, d.T).tex() + '} = ' + d.T + '$ ✓'];
    },
    answer: function (d) { return '$' + d.H.tex() + '$'; }
  });

  p.exercise({
    title: 'El desgaste que se nota',
    level: 'avanzado',
    gen: function (r) {
      var G = r.pick([50, 100, 500, 1000]), H = r.pick([0.01, 0.05, 0.1, 0.5]), pc = r.pick([10, 20, 30, 50]);
      var T1 = G / (1 + G * H), G2 = G * (1 - pc / 100), T2 = G2 / (1 + G2 * H);
      return { G: G, H: H, pc: pc, T1: T1, T2: T2, caida: 100 * (1 - T2 / T1) };
    },
    ask: function (d) {
      return 'Un bucle tiene $G = ' + d.G + '$ y $H = ' + U.fmt(d.H, 2) + '$. Con el tiempo, $G$ pierde un ' + d.pc +
        ' % de su valor. ¿En qué porcentaje baja la ganancia del bucle cerrado? (Dos decimales.)';
    },
    fields: [{ name: 'c', label: 'baja un (%)', w: 'tiny' }],
    sol: function (d) { return { c: U.round(d.caida, 4) }; },
    tol: 0.006,
    errores: [{ si: function (v, d) { return Math.abs(v.c - d.pc) < 0.006; }, msg: 'Ese es el desgaste de $G$, que es lo que caería la salida <strong>sin</strong> realimentación. Calcula $T$ antes y después.' }],
    hint: function () { return ['Calcula $T = \\dfrac{G}{1 + GH}$ con la $G$ de antes y con la de después.', 'Porcentaje de caída: $100\\left(1 - \\dfrac{T_{\\text{después}}}{T_{\\text{antes}}}\\right)$.']; },
    steps: function (d) {
      var G2 = d.G * (1 - d.pc / 100);
      return ['Antes: $T = \\dfrac{' + d.G + '}{1 + ' + U.fmt(d.G * d.H, 2) + '} \\approx ' + U.fmt(d.T1, 4) + '$',
        'Después, con $G = ' + U.fmt(G2, 1) + '$: $T = \\dfrac{' + U.fmt(G2, 1) + '}{1 + ' + U.fmt(G2 * d.H, 2) + '} \\approx ' + U.fmt(d.T2, 4) + '$',
        'Caída: $100\\left(1 - \\dfrac{' + U.fmt(d.T2, 4) + '}{' + U.fmt(d.T1, 4) + '}\\right) \\approx ' + U.fmt(d.caida, 2) + '$ %, frente al ' + d.pc + ' % sin realimentación.'];
    },
    answer: function (d) { return U.fmt(d.caida, 2) + ' %'; }
  });

  p.keys([
    'En serie las ganancias se multiplican; en paralelo, se suman.',
    'Un bucle de realimentación negativa tiene ganancia $T = \\frac{G}{1 + GH}$; con $GH$ grande, $T \\approx \\frac{1}{H}$ y el resultado depende solo del sensor.',
    'La sensibilidad a los cambios de $G$ se divide por $1 + GH$: la realimentación gasta ganancia para comprar precisión.',
    'La realimentación positiva tiene denominador $1 - GH$ y se dispara cuando $GH$ se acerca a 1.'
  ]);
});
