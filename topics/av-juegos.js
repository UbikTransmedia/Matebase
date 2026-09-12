/* Tema: Teoría de juegos */
Course.topic('av-juegos', function (p) {

  p.puente('Toda la [[av-optimizacion|optimización]] que has visto tiene un supuesto oculto: que el mundo no ' +
    'reacciona. Bajas la ladera y la ladera se queda quieta. Pero si enfrente hay <strong>otro que también ' +
    'decide</strong>, y que además sabe que tú decides, el problema cambia de naturaleza. Solo hace falta ' +
    'saber leer una tabla de doble entrada y comparar números.');

  p.text('La <strong>teoría de juegos</strong> estudia exactamente eso: decisiones estratégicas donde ' +
    'el resultado de cada uno depende de lo que hagan los demás.');

  p.section('Matriz de pagos');

  p.text('Un juego se describe con las estrategias de cada jugador y lo que gana cada uno en cada ' +
    'combinación. Con dos jugadores y dos opciones cabe en una tabla de cuatro casillas.');

  p.note('En cada casilla se escriben <strong>dos</strong> números: primero lo que gana el jugador de ' +
    'las filas, después lo que gana el de las columnas. Leerlos en el orden correcto es la mitad del ' +
    'trabajo.', null);

  p.sub('Estrategia dominante');

  p.text('Una estrategia es <strong>dominante</strong> si es la mejor respuesta <em>pase lo que pase</em>, ' +
    'sin necesidad de adivinar qué hará el otro. Cuando existe, la decisión es fácil.');

  /* ---------------------------------------------------------------- */
  p.section('El dilema del prisionero');

  p.text('Dos detenidos, incomunicados. Si los dos callan, poca condena para ambos. Si uno delata y el ' +
    'otro calla, el delator sale libre y el otro se lleva la pena máxima. Si los dos delatan, condena ' +
    'intermedia para los dos.');

  p.demo({
    title: 'El dilema, casilla a casilla',
    intro: 'Pulsa una casilla y razona: dado lo que hace el otro, ¿qué me conviene? El resultado al que se llega es desconcertante.',
    predice: 'Antes de pulsar: si B calla, ¿qué le conviene a A, callar o delatar? ¿Y si B delata? Si la respuesta es la misma en los dos casos, A tiene una estrategia dominante.',
    build: function (host, d) {
      var sel = [0, 0];
      // pagos (años de cárcel, en negativo): [fila, columna]
      var pagos = [
        [[-1, -1], [-10, 0]],
        [[0, -10], [-6, -6]]
      ];
      var nombres = ['callar', 'delatar'];
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var mono = 'font-family:var(--mono);text-align:center;padding:14px 10px;cursor:pointer';
        var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th>' +
          '<th style="text-align:center">B calla</th><th style="text-align:center">B delata</th></tr></thead><tbody>';
        for (var i = 0; i < 2; i++) {
          h += '<tr><th>A ' + nombres[i] + '</th>';
          for (var j = 0; j < 2; j++) {
            var on = (sel[0] === i && sel[1] === j);
            var esNash = (i === 1 && j === 1);
            // Las casillas se pulsan, asi que tienen que comportarse como
            // botones tambien para quien navega con el teclado.
            h += '<td data-i="' + i + '" data-j="' + j + '" role="button" tabindex="0"' +
              ' aria-pressed="' + (on ? 'true' : 'false') + '"' +
              ' aria-label="A ' + nombres[i] + ' y B ' + nombres[j] + '"' +
              ' style="' + mono +
              (on ? ';background:var(--accent-soft);color:var(--accent-ink);font-weight:700' : '') +
              (esNash ? ';box-shadow:inset 0 0 0 2px var(--bad)' : '') + '">' +
              '(' + pagos[i][j][0] + ', ' + pagos[i][j][1] + ')</td>';
          }
          h += '</tr>';
        }
        h += '</tbody></table></div>';
        caja.innerHTML = h;
        U.$$('td[data-i]', caja).forEach(function (td) {
          function elegir() {
            sel = [Number(td.getAttribute('data-i')), Number(td.getAttribute('data-j'))];
            pinta();
            var mismo = U.$('td[data-i="' + sel[0] + '"][data-j="' + sel[1] + '"]', caja);
            if (mismo) mismo.focus();
          }
          td.addEventListener('click', elegir);
          td.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); elegir(); }
          });
        });
        var i0 = sel[0], j0 = sel[1];
        var pa = pagos[i0][j0][0], pb = pagos[i0][j0][1];
        var mejorA = pagos[1 - i0][j0][0] > pa;
        var mejorB = pagos[i0][1 - j0][1] > pb;
        out.set('A ' + nombres[i0] + ' y B ' + nombres[j0] + ' → A cumple <strong>' + (-pa) + ' años</strong>, ' +
          'B cumple <strong>' + (-pb) + '</strong>.<br>' +
          (mejorA ? '<span style="color:var(--bad)">A mejoraría cambiando a «' + nombres[1 - i0] + '» (pasaría a ' + (-pagos[1 - i0][j0][0]) + ' años).</span>'
            : '<span style="color:var(--ok)">A no mejora cambiando.</span>') + '<br>' +
          (mejorB ? '<span style="color:var(--bad)">B mejoraría cambiando a «' + nombres[1 - j0] + '» (pasaría a ' + (-pagos[i0][1 - j0][1]) + ' años).</span>'
            : '<span style="color:var(--ok)">B no mejora cambiando.</span>') + '<br>' +
          (!mejorA && !mejorB
            ? '<strong>Ninguno mejora cambiando él solo: esto es un <span style="color:var(--bad)">equilibrio de Nash</span>.</strong>'
            : 'Esta casilla no es estable: alguien tiene incentivo para desviarse.'));
      }
      W.hint(host, 'Haz clic en cada casilla. La marcada en rojo es el equilibrio de Nash.');
      pinta();
    }
  });

  p.note('El resultado es tremendo: <strong>delatar es dominante para los dos</strong>. Si el otro ' +
    'calla, delatando salgo libre; si el otro delata, delatando me llevo 6 años en vez de 10. Así que ' +
    'los dos delatan y acaban con 6 años cada uno... cuando callando ambos habrían tenido 1. ' +
    'La decisión racional individual lleva al peor resultado colectivo.', 'warn', 'La trampa');

  p.text('Y no es un acertijo de sobremesa. Este mismo esquema describe la carrera armamentística, la ' +
    'sobreexplotación pesquera, la publicidad competitiva, el dopaje deportivo y las emisiones de CO₂. ' +
    'En todos, lo racional para cada uno produce el desastre para todos.');

  /* ---------------------------------------------------------------- */
  p.section('El equilibrio de Nash');
  p.text('Nash propuso una definición de «solución» de un juego que parece modesta y resultó ser ' +
    'enormemente fértil: una combinación de estrategias en la que <strong>nadie gana cambiando la ' +
    'suya en solitario</strong>. Fíjate en el matiz, porque es lo que da toda su fuerza y toda su ' +
    'tristeza al concepto: no dice que sea la mejor situación posible para todos, solo que nadie ' +
    'tiene incentivo individual para moverse.');


  p.formula('\\text{Nash} \\iff \\text{ningún jugador mejora cambiando su estrategia él solo}');

  p.note('Nash demostró en 1950, en una tesis doctoral de <strong>27 páginas</strong>, que ' +
    '<em>todo</em> juego finito tiene al menos un equilibrio (permitiendo estrategias mixtas, es decir, ' +
    'elegir al azar con ciertas probabilidades). Le valió el Nobel de Economía en 1994.',
    'ok', 'El teorema de Nash');

  p.text('Ojo con una confusión frecuente: un equilibrio de Nash <strong>no</strong> es necesariamente ' +
    'el mejor resultado posible. En el dilema del prisionero es el <em>peor</em> resultado colectivo. ' +
    'Equilibrio significa solo «estable», no «bueno».');

  p.comprueba('En el dilema del prisionero, (callar, callar) da 1 año a cada uno, lo mejor para los dos. ¿Es un equilibrio de Nash?', [
    { t: 'Sí: es el mejor resultado para ambos', ok: false, por: 'Ser el mejor no es el criterio. Si A cambia a delatar mientras B calla, A pasa de 1 año a 0: mejora cambiando él solo. No es estable.' },
    { t: 'No: cualquiera de los dos mejora si delata mientras el otro calla', ok: true, por: 'Un equilibrio exige que <em>nadie</em> gane desviándose en solitario. Aquí los dos ganan desviándose, y por eso la cooperación se deshace aunque sea lo mejor para todos.' },
    { t: 'Sí, porque los dos hacen lo mismo', ok: false, por: 'Que hagan lo mismo no tiene nada que ver. (Delatar, delatar) también es simétrico y ese sí es equilibrio; (callar, callar) no lo es.' }
  ]);

  p.ejemplo({
    title: 'Buscar los equilibrios en la caza del ciervo',
    enunciado: 'Dos cazadores eligen entre cazar un ciervo, que exige cooperar, o una liebre, que cada uno caza solo. Pagos (A, B): ciervo-ciervo (4, 4), ciervo-liebre (0, 3), liebre-ciervo (3, 0), liebre-liebre (3, 3). Hallar los equilibrios de Nash.',
    pasos: [
      { t: '<strong>Casilla (ciervo, ciervo).</strong> ¿Mejora A cambiando a liebre? Pasaría de 4 a 3: no. ¿Mejora B? Igual, de 4 a 3: no. Nadie gana desviándose: <strong>equilibrio</strong>.', antes: 'Fija lo que hace B (ciervo). ¿Le conviene a A cambiar?' },
      { t: '<strong>Casilla (ciervo, liebre).</strong> A tiene 0; cambiando a liebre tendría 3. Mejora: no es equilibrio. (No hace falta mirar a B.)' },
      { t: '<strong>Casilla (liebre, ciervo).</strong> Simétrica de la anterior: B mejora cambiando. No es equilibrio.' },
      { t: '<strong>Casilla (liebre, liebre).</strong> ¿Mejora A cambiando a ciervo? Pasaría de 3 a 0: no. ¿B? Tampoco. <strong>Equilibrio</strong> también.', antes: 'Con B cazando liebre, ¿le conviene a A ir a por el ciervo solo?' },
      { t: '<strong>Dos equilibrios.</strong> Uno mejor para todos (4, 4) y otro más seguro (3, 3). Cuál se alcanza depende de la confianza: si A duda de que B vaya al ciervo, la liebre le garantiza 3. Es el dilema de la cooperación cuando cooperar es arriesgado.' }
    ],
    cierre: 'El método es siempre el mismo: casilla a casilla, preguntar si alguno de los dos gana desviándose él solo. Cuatro casillas, ocho preguntas, y salen todos los equilibrios puros.'
  });

  p.demo({
    title: 'Otros juegos clásicos',
    intro: 'Cambia de juego y busca los equilibrios. Verás que algunos tienen uno, otros tienen dos y otros ninguno en estrategias puras.',
    predice: 'Elige «Pares o nones». En cada casilla, ¿hay siempre alguien que quiere cambiar? Entonces, ¿cuántos equilibrios puros tendrá?',
    build: function (host, d) {
      var cual = 'prisionero';
      var juegos = {
        prisionero: {
          n: 'Dilema del prisionero', e: ['callar', 'delatar'],
          m: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]],
          txt: 'Un único equilibrio: (delatar, delatar). Y es peor <em>para los dos</em> que (callar, callar). La cooperación es inestable.'
        },
        coordinacion: {
          n: 'Juego de coordinación', e: ['izquierda', 'derecha'],
          m: [[[2, 2], [0, 0]], [[0, 0], [2, 2]]],
          txt: '<strong>Dos</strong> equilibrios: los dos por la izquierda o los dos por la derecha. Da igual cuál, con tal de coincidir. Es el problema de por qué carril conducir.'
        },
        gallina: {
          n: 'El juego del gallina', e: ['desviarse', 'seguir'],
          m: [[[0, 0], [-1, 1]], [[1, -1], [-10, -10]]],
          txt: 'Dos equilibrios asimétricos: uno se desvía y el otro sigue. El desastre mutuo no es equilibrio, pero pasa si los dos se envalentonan.'
        },
        monedas: {
          n: 'Pares o nones', e: ['cara', 'cruz'],
          m: [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]],
          txt: '<strong>Ningún</strong> equilibrio en estrategias puras: siempre hay alguien que quiere cambiar. El equilibrio es <em>mixto</em>: elegir al azar 50/50.'
        },
        ciervo: {
          n: 'La caza del ciervo', e: ['cazar ciervo', 'cazar liebre'],
          m: [[[4, 4], [0, 3]], [[3, 0], [3, 3]]],
          txt: 'Dos equilibrios: cooperar (ciervo) es mejor para ambos, pero cazar liebre es más seguro. Es el dilema de la confianza.'
        }
      };
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function esNash(m, i, j) {
        return m[i][j][0] >= m[1 - i][j][0] && m[i][j][1] >= m[i][1 - j][1];
      }
      function pinta() {
        var J = juegos[cual];
        var mono = 'font-family:var(--mono);text-align:center;padding:12px 10px';
        var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th>' +
          '<th style="text-align:center">B: ' + J.e[0] + '</th><th style="text-align:center">B: ' + J.e[1] + '</th></tr></thead><tbody>';
        var nash = 0;
        for (var i = 0; i < 2; i++) {
          h += '<tr><th>A: ' + J.e[i] + '</th>';
          for (var j = 0; j < 2; j++) {
            var eq = esNash(J.m, i, j);
            if (eq) nash++;
            h += '<td style="' + mono + (eq ? ';background:var(--ok-soft);color:var(--ok);font-weight:700' : '') + '">' +
              '(' + J.m[i][j][0] + ', ' + J.m[i][j][1] + ')' + (eq ? ' ★' : '') + '</td>';
          }
          h += '</tr>';
        }
        h += '</tbody></table></div>';
        caja.innerHTML = h;
        out.set('<strong>' + J.n + '</strong> — equilibrios de Nash en estrategias puras: <strong>' + nash + '</strong><br>' + J.txt);
      }
      W.chips(host, Object.keys(juegos).map(function (k) { return { label: juegos[k].n, value: k }; }),
        { value: 'prisionero', on: function (v) { cual = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El equilibrio de Nash describe situaciones en las que nadie gana cambiando de estrategia por su ' +
    'cuenta, aunque todos estarían mejor cooperando. Explica las guerras de precios entre ' +
    'gasolineras, la carrera armamentística, por qué es tan difícil un acuerdo climático y por qué ' +
    'dos supermercados acaban abriendo en la misma esquina. Nash recibió el Nobel de Economía en ' +
    '1994 por una tesis doctoral de veintisiete páginas escrita a los veintiuno.');

  /* ---------------------------------------------------------------- */
  p.section('Juegos de suma cero y el minimax');

  p.text('Hay una familia de juegos en la que el conflicto es total: lo que gana uno lo pierde el otro, ' +
    'exactamente. Se llaman de <strong>suma cero</strong>, y como los dos pagos de cada casilla son el ' +
    'mismo número con signos opuestos, basta escribir uno. El ajedrez, el póquer y repartirse una tarta ' +
    'lo son; el dilema del prisionero <em>no</em>, y por eso allí podía haber un resultado mejor para ' +
    'los dos.');

  p.text('Sin acuerdo posible, cada jugador razona a la defensiva. El que elige fila se pregunta: «si ' +
    'elijo esta, ¿qué es lo peor que puede pasarme?», y se queda con la fila cuyo peor caso es mejor. ' +
    'Eso le garantiza un mínimo, pase lo que pase.');

  p.formulas([
    '\\underline{v} = \\max_{\\text{filas}} \\; \\min_{\\text{columnas}} a_{ij}',
    '\\overline{v} = \\min_{\\text{columnas}} \\; \\max_{\\text{filas}} a_{ij}'
  ], 'lo que cada uno se garantiza',
    'Se leen: <em>«uve baja es el máximo, sobre las filas, del mínimo sobre las columnas»</em> y ' +
    '<em>«uve alta es el mínimo, sobre las columnas, del máximo sobre las filas»</em>.<br><br>La ' +
    'primera es el <strong>maximin</strong>: lo que el jugador de las filas se asegura. La segunda es ' +
    'el <strong>minimax</strong>: lo máximo que el de las columnas va a permitir que le saquen. ' +
    'Siempre $\\underline{v} \\le \\overline{v}$, y cuando son iguales esa casilla es un ' +
    '<strong>punto de silla</strong>: ninguno de los dos gana nada cambiando, y el juego tiene un ' +
    'valor claro.');

  p.demo({
    title: 'Buscar el punto de silla',
    intro: 'Una matriz de pagos de suma cero: el número es lo que gana el jugador de las filas y pierde el de las columnas. A la derecha de cada fila, su peor caso; debajo de cada columna, el peor caso del otro. Mueve la casilla de arriba a la izquierda y mira cuándo el maximin y el minimax coinciden.',
    predice: 'Con la matriz de partida, el maximin y el minimax coinciden en un número. Si subes mucho esa casilla, ¿crees que seguirán coincidiendo?',
    build: function (host) {
      var a = 3;
      var out = W.readout(host, '');
      var caja = U.el('div');
      host.appendChild(caja);
      function matriz() { return [[a, -1, 2], [0, 1, -2], [-1, 2, 1]]; }
      function pinta() {
        var M = matriz(), i, j;
        var minFila = M.map(function (f) { return Math.min.apply(null, f); });
        var maxCol = [0, 1, 2].map(function (j2) { return Math.max(M[0][j2], M[1][j2], M[2][j2]); });
        var maximin = Math.max.apply(null, minFila);
        var minimax = Math.min.apply(null, maxCol);
        var fi = minFila.indexOf(maximin), ci = maxCol.indexOf(minimax);
        var hay = maximin === minimax;
        var html = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th class="num">C₁</th><th class="num">C₂</th><th class="num">C₃</th><th class="num">peor caso</th></tr></thead><tbody>';
        for (i = 0; i < 3; i++) {
          html += '<tr><td>F' + (i + 1) + '</td>';
          for (j = 0; j < 3; j++) {
            var silla = hay && i === fi && j === ci;
            html += '<td class="num"' + (silla ? ' style="background:var(--ok-soft);color:var(--ok);font-weight:700"' : '') + '>' + M[i][j] + '</td>';
          }
          html += '<td class="num"' + (i === fi ? ' style="font-weight:700"' : '') + '>' + minFila[i] + '</td></tr>';
        }
        html += '<tr><td><strong>peor caso</strong></td>';
        for (j = 0; j < 3; j++) html += '<td class="num"' + (j === ci ? ' style="font-weight:700"' : '') + '>' + maxCol[j] + '</td>';
        html += '<td></td></tr></tbody></table></div>';
        caja.innerHTML = html;
        out.set('Maximin $\\underline{v} = ' + maximin + '$ &nbsp;·&nbsp; minimax $\\overline{v} = ' + minimax + '$<br>' +
          (hay ? '<strong style="color:var(--ok)">Coinciden: hay punto de silla</strong> en la fila ' + (fi + 1) +
            ', columna ' + (ci + 1) + '. Ninguno de los dos mejora cambiando él solo, y el valor del juego es ' + maximin + '.'
            : '<strong>No coinciden</strong> (' + maximin + ' &lt; ' + minimax + '): no hay ninguna casilla estable. ' +
              'Cualquier elección fija se puede explotar, y hay que jugar al azar entre varias.'));
      }
      W.slider(W.row(host), {
        label: 'casilla F₁C₁', min: -4, max: 6, step: 1, value: 3, dec: 0,
        on: function (v) { a = v; pinta(); }
      });
      pinta();
    }
  });

  p.text('¿Y cuando no hay punto de silla? Entonces ninguna elección fija sirve, porque el rival la ' +
    'aprendería y la explotaría: hay que <strong>jugar al azar</strong>, con unas probabilidades bien ' +
    'elegidas. Eso es una <em>estrategia mixta</em>, y es lo que hace el que juega a piedra, papel o ' +
    'tijera, o el portero que se tira a un lado en un penalti.');

  p.note('El <strong>teorema minimax</strong> de von Neumann, de 1928, dice que permitiendo estrategias ' +
    'mixtas <em>todo</em> juego finito de suma cero entre dos jugadores tiene un valor: el maximin y el ' +
    'minimax coinciden siempre. Es el antepasado del equilibrio de Nash, que llegó veintiún años ' +
    'después y vale para cualquier juego, de suma cero o no.', 'ok', 'El teorema minimax');

  p.comprueba('En un juego de suma cero, el maximin vale 2 y el minimax vale 5. ¿Qué se puede decir?', [
    { t: 'No hay punto de silla, y los dos tendrán que jugar con estrategias mixtas', ok: true, por: 'Que no coincidan significa que ninguna casilla es estable: cualquier elección fija se puede explotar. Con estrategias mixtas, el teorema minimax garantiza que sí habrá un valor, y estará entre 2 y 5.' },
    { t: 'El jugador de las filas gana seguro entre 2 y 5', ok: false, por: 'Solo se garantiza el 2, que es su maximin. El 5 es lo que el otro va a evitar que le saque, no una promesa.' },
    { t: 'Los datos son imposibles: el minimax nunca es mayor', ok: false, por: 'Es al revés: el maximin nunca supera al minimax. Aquí $2 \\le 5$, que es lo normal cuando no hay punto de silla.' }
  ]);

  p.hist('John von Neumann demostró el teorema minimax en 1928, en un artículo titulado <em>Zur Theorie ' +
    'der Gesellschaftsspiele</em>, «sobre la teoría de los juegos de sociedad». Le gustaba decir que sin ' +
    'ese teorema no habría teoría de juegos en absoluto. En 1944 lo convirtió, con el economista Oskar ' +
    'Morgenstern, en el libro que fundó la disciplina, <em>Theory of Games and Economic Behavior</em>.');

  p.section('Juegos repetidos: cuando vuelve a haber mañana');

  p.text('Si el dilema del prisionero se juega <strong>una sola vez</strong>, traicionar es lo racional. ' +
    'Pero si se repite indefinidamente y hay que volver a encontrarse con el otro, la cosa cambia: ' +
    'ahora traicionar tiene consecuencias futuras.');

  p.text('En 1980 Robert Axelrod organizó un torneo: invitó a expertos a programar estrategias que se ' +
    'enfrentarían miles de veces. Ganó la más simple de todas, presentada por Anatol Rapoport, de solo ' +
    'cuatro líneas de código, llamada <strong>Tit for Tat</strong> («donde las dan, las toman»):');

  p.list([
    'En la primera ronda, <strong>coopera</strong>.',
    'En cada ronda siguiente, <strong>haz lo que el otro hizo la vez anterior</strong>.'
  ], true);

  p.note('Axelrod resumió por qué ganó en cuatro rasgos: es <strong>amable</strong> (nunca traiciona ' +
    'primero), <strong>represaliadora</strong> (responde de inmediato), <strong>indulgente</strong> ' +
    '(perdona en cuanto el otro coopera) y <strong>clara</strong> (el rival entiende enseguida cómo ' +
    'funciona). Ninguna estrategia rencorosa ni retorcida la superó.', 'ok', 'Por qué gana la más simple');

  p.hist('John Nash desarrolló su equilibrio con veintiún años. Poco después empezó a sufrir ' +
    'esquizofrenia paranoide, que le apartó de las matemáticas durante casi tres décadas. Se recuperó ' +
    'parcialmente en los años ochenta y recibió el Nobel en 1994, con la Academia sueca debatiendo si ' +
    'debía dárselo. Su historia inspiró la película <em>Una mente maravillosa</em>. Murió en un ' +
    'accidente de taxi en 2015, volviendo de recibir el premio Abel.');

  p.trampas([
    { e: 'Leer los pagos en el orden equivocado', por: 'En cada casilla, el primer número es del jugador de las filas y el segundo, del de las columnas. Cambiarlos convierte un dilema en otro juego.' },
    { e: '«Equilibrio» leído como «mejor resultado»', por: 'En el dilema del prisionero el equilibrio es el peor resultado colectivo. Equilibrio significa estable: nadie gana moviéndose solo.' },
    { e: 'Comprobar solo a un jugador', por: 'Una casilla es equilibrio si <em>ninguno</em> de los dos mejora desviándose. Hay que hacer las dos preguntas en cada casilla.' },
    { e: 'Creer que todo juego tiene un equilibrio puro', por: 'Pares o nones no tiene ninguno: siempre alguien quiere cambiar. Lo que garantiza Nash es un equilibrio <em>mixto</em>, jugando al azar.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Que la cooperación aparezca cuando el juego se repite es uno de los resultados más ' +
    'esperanzadores de esta teoría, y tiene confirmación histórica: en las trincheras de la Primera ' +
    'Guerra Mundial surgieron treguas espontáneas entre unidades que se enfrentaban día tras día. La ' +
    'estrategia ganadora en los torneos de Axelrod fue la más simple, «donde las dan las toman»: ' +
    'empieza cooperando y luego copia lo que hizo el otro. Es la base matemática de la reputación en ' +
    'el comercio y de por qué funcionan las valoraciones de vendedores.');

  p.section('Practica');

  p.exercise({
    title: 'Estrategia dominante',
    level: 'medio',
    gen: function (r) {
      // pagos del jugador de filas
      var a = r.int(0, 9), b = r.int(0, 9), c = r.int(0, 9), e = r.int(0, 9);
      var dom1 = a > c && b > e;
      var dom2 = c > a && e > b;
      return { a: a, b: b, c: c, e: e, res: dom1 ? 1 : (dom2 ? 2 : 0) };
    },
    ask: function (d) {
      return 'Los pagos del jugador A (el de las filas) son:<br>' +
        '$\\begin{array}{c|cc} & B_1 & B_2 \\\\ \\hline A_1 & ' + d.a + ' & ' + d.b + ' \\\\ A_2 & ' +
        d.c + ' & ' + d.e + ' \\end{array}$<br>' +
        '¿Tiene A alguna estrategia dominante?';
    },
    fields: [{ name: 'r', label: 'Respuesta', opts: [{ t: 'sí, $A_1$', v: '1' }, { t: 'sí, $A_2$', v: '2' }, { t: 'no tiene ninguna', v: '0' }] }],
    sol: function (d) { return { r: String(d.res) }; },
    hint: function () { return 'Una estrategia domina si es mejor en <strong>las dos</strong> columnas a la vez.'; },
    steps: function (d) {
      return ['Si B juega $B_1$: A prefiere ' + (d.a > d.c ? '$A_1$ ($' + d.a + ' > ' + d.c + '$)'
        : (d.a < d.c ? '$A_2$ ($' + d.c + ' > ' + d.a + '$)' : 'le da igual (empate)')) + '.',
        'Si B juega $B_2$: A prefiere ' + (d.b > d.e ? '$A_1$ ($' + d.b + ' > ' + d.e + '$)'
          : (d.b < d.e ? '$A_2$ ($' + d.e + ' > ' + d.b + '$)' : 'le da igual (empate)')) + '.',
        d.res === 0 ? 'No coincide en las dos columnas (o hay empates): <strong>no hay estrategia dominante</strong>. A necesita adivinar lo que hará B.'
          : 'Coincide en las dos: <strong>$A_' + d.res + '$ es dominante</strong>, la mejor haga lo que haga B.'];
    },
    answer: function (d) {
      return d.res === 0 ? 'No hay estrategia dominante.' : 'Sí: A' + d.res + ' es dominante.';
    }
  });

  p.exercise({
    title: 'El dilema en la práctica',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { s: 'Dos países deciden si aumentar su gasto militar', t: 1 },
        { s: 'Dos coches se cruzan y deciden por qué lado pasar', t: 2 },
        { s: 'Dos empresas deciden si bajar precios en una guerra comercial', t: 1 },
        { s: 'Dos flotas pesqueras deciden cuánto pescar en un caladero común', t: 1 },
        { s: 'Dos amigos eligen a qué bar ir, prefiriendo estar juntos', t: 2 },
        { s: 'Dos ciclistas deciden si doparse', t: 1 },
        { s: 'Dos programadores acuerdan qué formato de archivo usar', t: 2 }
      ];
      var c = r.pick(casos);
      return { s: c.s, t: c.t };
    },
    ask: function (d) {
      return '<em>' + d.s + '</em><br>¿Qué tipo de juego es?';
    },
    fields: [{ name: 't', label: 'Tipo', opts: [{ t: 'dilema del prisionero: lo racional individual perjudica a todos', v: '1' }, { t: 'juego de coordinación: lo importante es ponerse de acuerdo', v: '2' }] }],
    sol: function (d) { return { t: String(d.t) }; },
    hint: function () { return 'Pregúntate: ¿hay tentación de traicionar al otro para salir ganando, o simplemente hace falta coincidir?'; },
    steps: function (d) {
      return ['En un <strong>dilema del prisionero</strong> cada uno tiene incentivo para traicionar, ' +
        'y si los dos lo hacen todos pierden.',
        'En un <strong>juego de coordinación</strong> no hay traición posible: el problema es solo ' +
        'ponerse de acuerdo, y hay varios equilibrios igual de buenos.',
        'Aquí es un <strong>' + (d.t === 1 ? 'dilema del prisionero' : 'juego de coordinación') + '</strong>.',
        d.t === 1 ? 'La solución real pasa por cambiar los pagos: acuerdos vinculantes, sanciones o repetición del juego.'
          : 'Aquí basta con una convención, una señal o una norma que fije cuál de los equilibrios se elige.'];
    },
    answer: function (d) { return d.t === 1 ? 'Dilema del prisionero' : 'Juego de coordinación'; }
  });

  p.exercise({
    title: 'Encuentra el equilibrio de Nash',
    level: 'avanzado',
    gen: function (r) {
      var m = [];
      for (var i = 0; i < 2; i++) {
        m.push([]);
        for (var j = 0; j < 2; j++) m[i].push([r.int(0, 9), r.int(0, 9)]);
      }
      var eqs = [];
      for (var i2 = 0; i2 < 2; i2++) {
        for (var j2 = 0; j2 < 2; j2++) {
          if (m[i2][j2][0] >= m[1 - i2][j2][0] && m[i2][j2][1] >= m[i2][1 - j2][1]) eqs.push([i2, j2]);
        }
      }
      return { m: m, n: eqs.length, eqs: eqs };
    },
    ask: function (d) {
      var f = function (i, j) { return '(' + d.m[i][j][0] + ',\\ ' + d.m[i][j][1] + ')'; };
      return 'Dada esta matriz de pagos (A, B):<br>' +
        '$\\begin{array}{c|cc} & B_1 & B_2 \\\\ \\hline A_1 & ' + f(0, 0) + ' & ' + f(0, 1) + ' \\\\ ' +
        'A_2 & ' + f(1, 0) + ' & ' + f(1, 1) + ' \\end{array}$<br>' +
        '¿Cuántos equilibrios de Nash en estrategias <strong>puras</strong> tiene?';
    },
    fields: [{ name: 'n', label: 'Nº de equilibrios', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function () { return 'Casilla a casilla: ¿mejoraría A cambiando de fila? ¿Mejoraría B cambiando de columna? Si ninguno mejora, es equilibrio.'; },
    steps: function (d) {
      var s = ['Una casilla es equilibrio si <em>ninguno</em> de los dos gana desviándose él solo.'];
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          var okA = d.m[i][j][0] >= d.m[1 - i][j][0];
          var okB = d.m[i][j][1] >= d.m[i][1 - j][1];
          s.push('$(A_' + (i + 1) + ', B_' + (j + 1) + ')$: A ' + (okA ? 'no mejora ✓' : 'mejoraría ✗') +
            ', B ' + (okB ? 'no mejora ✓' : 'mejoraría ✗') +
            (okA && okB ? ' → <strong>equilibrio</strong>' : ''));
        }
      }
      s.push('Total: <strong>' + d.n + '</strong> ' + U.plural(d.n, 'equilibrio', 'equilibrios') + '.');
      if (d.n === 0) s.push('Sin equilibrios puros, pero el teorema de Nash garantiza que existe al menos uno <em>mixto</em>: eligiendo al azar con ciertas probabilidades.');
      return s;
    },
    answer: function (d) { return d.n + ' equilibrio(s)'; }
  });

  p.exercise({
    title: 'Juego repetido: Tit for Tat',
    level: 'avanzado',
    gen: function (r) {
      var jugadas = [];
      for (var i = 0; i < 6; i++) jugadas.push(r.bool(0.6) ? 'C' : 'T');
      // Tit for Tat: coopera la primera y luego copia la anterior del rival
      var respuestas = ['C'];
      for (var j = 0; j < 5; j++) respuestas.push(jugadas[j]);
      var n = r.int(2, 6);
      return { jugadas: jugadas, respuestas: respuestas, n: n, res: respuestas[n - 1] };
    },
    ask: function (d) {
      return 'El rival juega, ronda a ronda: <strong>' + d.jugadas.slice(0, d.n).join(' · ') + '</strong> ' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">(C = coopera, T = traiciona)</span><br>' +
        '¿Qué juega <em>Tit for Tat</em> en la ronda <strong>' + d.n + '</strong>?';
    },
    fields: [{ name: 'j', label: 'Jugada', opts: [{ t: 'C: coopera', v: 'C' }, { t: 'T: traiciona', v: 'T' }] }],
    sol: function (d) { return { j: d.res }; },
    hint: function (d) {
      return d.n === 1 ? 'En la primera ronda siempre coopera.'
        : 'Copia lo que hizo el rival en la ronda anterior, que fue la ' + (d.n - 1) + '.';
    },
    steps: function (d) {
      return ['Tit for Tat coopera en la ronda 1 y a partir de ahí <strong>copia la jugada anterior del rival</strong>.',
        d.n === 1 ? 'Es la primera ronda: coopera.'
          : 'En la ronda ' + (d.n - 1) + ' el rival jugó <strong>' + d.jugadas[d.n - 2] + '</strong>, así que ahora responde lo mismo.',
        'Respuesta: <strong>' + d.res + '</strong>.',
        'Sus respuestas completas serían: ' + d.respuestas.slice(0, d.n).join(' · '),
        'Fíjate en que perdona en cuanto el rival vuelve a cooperar: no guarda rencor. Ese detalle es lo que la hizo ganar el torneo.'];
    },
    answer: function (d) { return d.res; }
  });

  p.keys([
    'La teoría de juegos estudia decisiones donde el resultado depende de lo que hagan los demás.',
    'Estrategia dominante: la mejor pase lo que pase. Cuando existe, decidir es trivial.',
    '<strong>Equilibrio de Nash</strong>: ninguno mejora cambiando él solo. Estable no significa bueno.',
    'Dilema del prisionero: la racionalidad individual lleva al peor resultado colectivo.',
    'Todo juego finito tiene equilibrio si se permiten estrategias mixtas (elegir al azar).',
    'Repetir el juego cambia los incentivos: <em>Tit for Tat</em> —amable, represaliadora, indulgente y clara— gana.'
  ]);
});
