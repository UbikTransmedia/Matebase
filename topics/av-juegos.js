/* Tema: Teoría de juegos */
Course.topic('av-juegos', function (p) {

  p.text('Toda la optimización que has visto tiene un supuesto oculto: que el mundo no reacciona. Bajas ' +
    'la ladera y la ladera se queda quieta. Pero si enfrente hay <strong>otro que también decide</strong> ' +
    '—y que además sabe que tú decides—, el problema cambia de naturaleza.');

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

  p.demo({
    title: 'Otros juegos clásicos',
    intro: 'Cambia de juego y busca los equilibrios. Verás que algunos tienen uno, otros tienen dos y otros ninguno en estrategias puras.',
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
        '¿Tiene A alguna estrategia dominante?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)"><code>1</code> sí, $A_1$ · ' +
        '<code>2</code> sí, $A_2$ · <code>0</code> no tiene ninguna</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny' }],
    sol: function (d) { return { r: d.res }; },
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
      return '<em>' + d.s + '</em><br>¿Qué tipo de juego es?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)"><code>1</code> dilema del prisionero ' +
        '(lo racional individual perjudica a todos) · <code>2</code> juego de coordinación ' +
        '(lo importante es ponerse de acuerdo, da igual en qué)</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.t }; },
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
        '¿Qué juega <em>Tit for Tat</em> en la ronda <strong>' + d.n + '</strong>?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>C</code> o <code>T</code>.</span>';
    },
    fields: [{ name: 'j', label: 'Jugada', w: 'tiny', ph: 'C / T' }],
    sol: function (d) { return { j: d.res }; },
    check: function (v, d) {
      var t = v.raw.j.trim().toUpperCase();
      if (t !== 'C' && t !== 'T') return { ok: false, msg: 'Escribe <code>C</code> o <code>T</code>.' };
      return t === d.res;
    },
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
