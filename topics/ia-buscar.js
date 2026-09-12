/* Tema: Antes de aprender: buscar */
Course.topic('ia-buscar', function (p) {

  p.puente('En [[ia-que-es|el tema anterior]] había parámetros que se movían hasta que la pérdida bajaba. ' +
    'Aquí no se mueve nada y no se aprende nada: se <strong>explora</strong>. De ' +
    '[[av-juegos|los juegos de suma cero]] viene el minimax, que ya sabes calcular en una tabla; de ' +
    '[[av-grafos|los grafos]], la idea de buscar el camino más corto. Lo nuevo es qué hacer cuando el ' +
    'árbol de posibilidades no cabe en ningún ordenador.');

  p.text('Conviene saber que durante cuarenta años la inteligencia artificial que funcionaba no aprendía ' +
    'absolutamente nada. Deep Blue ganó a Kaspárov en 1997 sin haber aprendido una sola cosa de ' +
    'ninguna partida: miraba doscientos millones de posiciones por segundo y elegía. Sigue siendo así ' +
    'en tu GPS, en el reparto de paquetes y en los horarios de un hospital. <strong>Buscar bien es ' +
    'una alternativa a aprender</strong>, y además es lo que un modelo moderno acaba usando como ' +
    'muleta.');

  /* ---------------------------------------------------------------- */
  p.section('El árbol de un juego');

  p.text('Un juego por turnos se dibuja como un árbol: la raíz es la posición actual, y cada rama es una ' +
    'jugada posible. Desde cada posición nueva salen otras tantas ramas, y así hasta que alguien gana ' +
    'o se acaban las casillas. El problema salta a la vista enseguida.');

  p.formula('\\text{hojas} \\approx b^{\\,d}',
    'cuánto ocupa mirar hasta profundidad d',
    'Se lee: <em>«el número de hojas es aproximadamente be elevado a de»</em>. La $b$ es el ' +
    '<strong>factor de ramificación</strong>, cuántas jugadas hay de media en cada turno, y la $d$ es ' +
    'la <strong>profundidad</strong>, cuántos turnos se miran hacia delante.<br><br>Es una ' +
    '[[fn-exp-log|exponencial]], y por eso el problema no es de ordenadores más rápidos. En el tres en ' +
    'raya $b \\approx 4$ y el árbol entero tiene unas 550 000 posiciones: cabe. En el ajedrez ' +
    '$b \\approx 35$ y una partida dura unos 80 turnos, así que el árbol completo tiene del orden de ' +
    '$35^{80}$ hojas, más que átomos hay en el universo observable. No cabe, y no cabrá nunca.');

  /* ---------------------------------------------------------------- */
  p.section('Minimax: suponer que el otro juega bien');

  p.text('Si el árbol cabe, el juego está resuelto, y la regla para resolverlo ya la viste en ' +
    '[[av-juegos|teoría de juegos]]. Se evalúan las hojas —gano, pierdo, empate— y los valores suben ' +
    'hacia la raíz alternando: en mi turno me quedo con el <strong>máximo</strong>, porque elijo yo; ' +
    'en el turno del rival, con el <strong>mínimo</strong>, porque elige él y hay que suponer que ' +
    'juega bien.');

  p.note('Suponer que el rival juega perfectamente no es pesimismo: es lo único que da una garantía. Si ' +
    'juega peor, el resultado solo puede ser mejor que el calculado. Es exactamente el razonamiento ' +
    'del maximin, que asegura un mínimo pase lo que pase.', 'ok', 'Por qué se supone lo peor');

  p.demo({
    title: 'El tres en raya, resuelto',
    intro: 'Juegas con las equis y empiezas tú. En cada casilla libre aparece el valor minimax de jugar ahí, calculado mirando el árbol entero hasta el final: +1 significa que ganas con juego perfecto, 0 que empatas y −1 que pierdes. La máquina responde siempre con la mejor jugada.',
    predice: 'El tres en raya está completamente resuelto. Si los dos juegan perfecto, ¿cómo acaba siempre: gana el que empieza, gana el segundo, o empate?',
    build: function (host) {
      var tab = [0, 0, 0, 0, 0, 0, 0, 0, 0], fin = null, memo = {};
      var LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      var out = W.readout(host, '');

      function gana(b, j) {
        for (var i = 0; i < 8; i++) {
          var L = LINEAS[i];
          if (b[L[0]] === j && b[L[1]] === j && b[L[2]] === j) return true;
        }
        return false;
      }
      function lleno(b) { for (var i = 0; i < 9; i++) if (!b[i]) return false; return true; }

      /* Minimax con memoria. +1 gana X (el alumno), -1 gana O (la maquina).
         Se resta la profundidad para preferir ganar pronto y perder tarde. */
      function minimax(b, turno, prof) {
        if (gana(b, 1)) return 10 - prof;
        if (gana(b, 2)) return prof - 10;
        if (lleno(b)) return 0;
        var clave = b.join('') + turno;
        if (memo[clave] !== undefined) return memo[clave];
        var mejor = turno === 1 ? -99 : 99, i;
        for (i = 0; i < 9; i++) {
          if (b[i]) continue;
          b[i] = turno;
          var v = minimax(b, turno === 1 ? 2 : 1, prof + 1);
          b[i] = 0;
          mejor = turno === 1 ? Math.max(mejor, v) : Math.min(mejor, v);
        }
        memo[clave] = mejor;
        return mejor;
      }
      function valores() {
        var vs = [], i;
        for (i = 0; i < 9; i++) {
          if (tab[i]) { vs.push(null); continue; }
          tab[i] = 1;
          vs.push(minimax(tab, 2, 1));
          tab[i] = 0;
        }
        return vs;
      }
      function jugadaMaquina() {
        var mejor = 99, donde = -1, i;
        for (i = 0; i < 9; i++) {
          if (tab[i]) continue;
          tab[i] = 2;
          var v = minimax(tab, 1, 1);
          tab[i] = 0;
          if (v < mejor) { mejor = v; donde = i; }
        }
        if (donde >= 0) tab[donde] = 2;
      }
      function estado() {
        if (gana(tab, 1)) return 'has ganado';
        if (gana(tab, 2)) return 'has perdido';
        if (lleno(tab)) return 'empate';
        return null;
      }

      var plot = W.plot(host, {
        xmin: -0.2, xmax: 3.2, ymin: -0.2, ymax: 3.2, height: 320, equal: true,
        grid: false, axes: false,
        aria: 'Un tablero de tres en raya con el valor minimax de cada casilla libre',
        onClick: function (x, y) {
          if (fin) return;
          var c = Math.floor(x), f = 2 - Math.floor(y);
          if (c < 0 || c > 2 || f < 0 || f > 2) return;
          var i = f * 3 + c;
          if (tab[i]) return;
          tab[i] = 1;
          if (!estado()) jugadaMaquina();
          fin = estado();
          pinta();
        },
        draw: function (g) {
          var vs = fin ? [] : valores(), i;
          for (i = 0; i < 9; i++) {
            var c = i % 3, f = Math.floor(i / 3), x = c, y = 2 - f;
            g.rect(x, y, 1, 1, { color: 'axis', fill: false, w: 1.4 });
            if (tab[i] === 1) g.text(x + 0.5, y + 0.32, 'X', { align: 'center', size: 40, color: 0, bold: true });
            else if (tab[i] === 2) g.text(x + 0.5, y + 0.32, 'O', { align: 'center', size: 40, color: 2, bold: true });
            else if (!fin && vs[i] !== null && vs[i] !== undefined) {
              var v = vs[i] > 0 ? 1 : (vs[i] < 0 ? -1 : 0);
              g.text(x + 0.5, y + 0.42, v > 0 ? '+1' : (v < 0 ? '−1' : '0'), {
                align: 'center', size: 19, color: v > 0 ? 'ok' : (v < 0 ? 'bad' : 'axis')
              });
            }
          }
        }
      });
      function pinta() {
        out.set(fin
          ? '<strong>' + fin.charAt(0).toUpperCase() + fin.slice(1) + '.</strong> ' +
            (fin === 'empate' ? 'Con juego perfecto por los dos lados, el tres en raya siempre acaba en tablas: su valor minimax es 0.'
              : 'Pulsa «otra partida» para volver a intentarlo.')
          : 'Haz clic en una casilla. Los números son el valor minimax de jugar ahí, mirando el árbol ' +
            'hasta el final: <span style="color:var(--ok)">+1</span> ganas, <span style="color:var(--ink-soft)">0</span> ' +
            'empatas, <span style="color:var(--bad)">−1</span> pierdes.<br>' +
            '<span style="font-size:0.7812rem;color:var(--ink-faint)">Si no hay ningún +1, no existe ninguna ' +
            'jugada que gane contra un rival que no falla. Lo mejor posible es el 0.</span>');
        plot.render();
      }
      W.buttons(host, [{ t: '↺ Otra partida', cls: 'btn--main', on: function () { tab = [0, 0, 0, 0, 0, 0, 0, 0, 0]; fin = null; pinta(); } }]);
      pinta();
    }
  });

  p.text('Si has jugado un rato habrás visto que nunca aparece un $+1$ contra la máquina: no hay manera ' +
    'de ganarle. El tres en raya está <strong>resuelto</strong>, y su valor es el empate. Las damas ' +
    'también se resolvieron, en 2007, tras dieciocho años de cálculo: también son tablas. El ajedrez y ' +
    'el go no se resolverán nunca por este camino, y por eso hizo falta inventar otra cosa.');

  /* ---------------------------------------------------------------- */
  p.section('La poda alfa-beta: mirar menos sin perder nada');

  p.text('Antes de rendirse ante el tamaño del árbol hay un truco que no cuesta nada y que es, ' +
    'sorprendentemente, <strong>exacto</strong>: da el mismo resultado que mirarlo todo, pero mirando ' +
    'mucho menos. La idea cabe en una frase de andar por casa.');

  p.note('Estás eligiendo entre dos jugadas. La primera la has estudiado entera y te asegura un empate. ' +
    'Empiezas a estudiar la segunda y, a la primera respuesta del rival, ves que pierdes. ' +
    '<strong>¿Hace falta mirar las demás respuestas del rival?</strong> No: el rival elegirá esa o ' +
    'algo aún peor para ti, así que esa jugada ya no puede superar al empate que tenías. Se abandona ' +
    'la rama entera sin terminarla.', 'ok', 'La idea, sin fórmulas');

  p.formulas([
    '\\alpha = \\text{lo mejor que tengo asegurado hasta ahora}',
    '\\beta = \\text{lo mejor que el rival tiene asegurado}'
  ], 'los dos números de la poda',
    'Se leen <em>«alfa»</em> y <em>«beta»</em>.<br><br>Se van pasando hacia abajo mientras se recorre ' +
    'el árbol. En cuanto en algún nodo ocurre que $\\alpha \\ge \\beta$, lo que quede por mirar ahí no ' +
    'puede cambiar la decisión de la raíz, y se corta. Es un corte <strong>demostrablemente ' +
    'inofensivo</strong>: el valor que sale al final es exactamente el mismo que sin podar.');

  p.demo({
    title: 'Cuánto se ahorra podando',
    intro: 'Un árbol de profundidad 3 con ocho hojas. Se recorre de izquierda a derecha calculando el minimax; las hojas que la poda alfa-beta no llega a mirar salen tachadas. Cambia los valores y fíjate en que el resultado de la raíz nunca cambia: solo cambia cuánto hay que mirar.',
    predice: 'La poda depende del orden en que se miran las ramas. Si las mejores jugadas se probaran siempre primero, ¿crees que se podaría más o menos que si se prueban en un orden cualquiera?',
    build: function (host) {
      var semilla = 5, hojas = [];
      var out = W.readout(host, '');
      function genera() {
        var r = U.rng(semilla);
        hojas = [];
        for (var i = 0; i < 8; i++) hojas.push(r.int(-9, 9));
      }
      /* Alfa-beta sobre el arbol fijo de 8 hojas, apuntando cuales se
         llegan a evaluar. Profundidad 3: raiz MAX, luego MIN, luego MAX. */
      function ab() {
        var vistas = [];
        function rec(nodo, prof, alfa, beta, maxi) {
          /* Las hojas son los nodos 7 a 14 del monticulo, y el array tiene
             ocho posiciones: hay que restar el indice del primer nodo. */
          if (prof === 3) { vistas.push(nodo); return hojas[nodo - 7]; }
          var mejor = maxi ? -99 : 99;
          for (var k = 0; k < 2; k++) {
            var v = rec(nodo * 2 + 1 + k, prof + 1, alfa, beta, !maxi);
            if (maxi) { mejor = Math.max(mejor, v); alfa = Math.max(alfa, mejor); }
            else { mejor = Math.min(mejor, v); beta = Math.min(beta, mejor); }
            if (alfa >= beta) break;              // poda
          }
          return mejor;
        }
        var raiz = rec(0, 0, -99, 99, true);
        return { raiz: raiz, vistas: vistas };
      }
      function completo() {
        function rec(nodo, prof, maxi) {
          if (prof === 3) return hojas[nodo - 7];
          var a = rec(nodo * 2 + 1, prof + 1, !maxi), b = rec(nodo * 2 + 2, prof + 1, !maxi);
          return maxi ? Math.max(a, b) : Math.min(a, b);
        }
        return rec(0, 0, true);
      }
      genera();
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 8.5, ymin: -0.5, ymax: 3.5, height: 300,
        grid: false, axes: false,
        aria: 'Un árbol de juego de profundidad tres con ocho hojas, marcando las que la poda alfa-beta no necesita mirar',
        draw: function (g) {
          var res = ab(), i, k;
          function pos(nodo, prof) {
            var primero = Math.pow(2, prof) - 1, idx = nodo - primero;
            var ancho = Math.pow(2, prof);
            return { x: (idx + 0.5) * 8 / ancho, y: 3 - prof };
          }
          var prof, primero, cuantos, nodo, P;
          /* Las aristas: cada nodo se une con sus dos hijos, que en un
             monticulo 0-indexado son 2n+1 y 2n+2. */
          for (prof = 0; prof < 3; prof++) {
            primero = Math.pow(2, prof) - 1;
            cuantos = Math.pow(2, prof);
            for (i = 0; i < cuantos; i++) {
              nodo = primero + i;
              P = pos(nodo, prof);
              for (k = 0; k < 2; k++) {
                var H = pos(nodo * 2 + 1 + k, prof + 1);
                g.seg(P.x, P.y, H.x, H.y, { color: 'axis', w: 1.2 });
              }
            }
          }
          /* Y la etiqueta de a quién le toca elegir en cada nivel. */
          for (prof = 0; prof < 3; prof++) {
            primero = Math.pow(2, prof) - 1;
            cuantos = Math.pow(2, prof);
            for (i = 0; i < cuantos; i++) {
              P = pos(primero + i, prof);
              g.text(P.x, P.y - 0.14, prof % 2 === 0 ? 'MAX' : 'MIN', {
                align: 'center', size: 11.5, color: prof % 2 === 0 ? 0 : 2, box: true
              });
            }
          }
          for (i = 0; i < 8; i++) {
            var P3 = pos(7 + i, 3), mirada = res.vistas.indexOf(7 + i) >= 0;
            g.text(P3.x, P3.y - 0.16, String(hojas[i]), {
              align: 'center', size: 17, color: mirada ? 'ink' : 'bad', bold: mirada
            });
            if (!mirada) g.seg(P3.x - 0.28, P3.y + 0.02, P3.x + 0.28, P3.y + 0.02, { color: 'bad', w: 2 });
          }
        }
      });
      function pinta() {
        var res = ab(), total = completo();
        out.set('Valor de la raíz: <strong>' + res.raiz + '</strong> &nbsp;·&nbsp; ' +
          'sin podar también sale <strong>' + total + '</strong>' +
          (res.raiz === total ? ' <span style="color:var(--ok)">✓ idéntico</span>' : '') + '<br>' +
          'Hojas miradas: <strong>' + res.vistas.length + ' de 8</strong>' +
          (res.vistas.length < 8 ? ' &nbsp;·&nbsp; ahorro del ' + U.fmt(100 * (8 - res.vistas.length) / 8, 0) + ' %' : ' &nbsp;·&nbsp; esta vez no se ha podado nada') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Las tachadas en rojo no se han llegado ' +
          'a evaluar, y da igual lo que valgan: no pueden cambiar la decisión de la raíz.</span>');
        plot.render();
      }
      W.buttons(host, [{ t: 'Otros valores', cls: 'btn--main', on: function () { semilla++; genera(); pinta(); } }]);
      pinta();
    }
  });

  p.text('Con el mejor orden posible de las ramas, la poda reduce el número de hojas de $b^d$ a ' +
    'aproximadamente $b^{d/2}$. Eso <strong>duplica la profundidad</strong> que se puede mirar con el ' +
    'mismo tiempo, y en ajedrez la diferencia entre mirar seis jugadas y mirar doce es la diferencia ' +
    'entre un aficionado y un campeón. Por eso los programas dedican tanto esfuerzo a probar primero ' +
    'las jugadas que parecen buenas: no para acertar, sino para poder podar antes.');

  p.ejemplo({
    title: 'Minimax y poda, a mano',
    enunciado: 'La raíz es un nodo MAX con dos hijos MIN. El primero tiene las hojas $3$ y $5$; el segundo, $2$ y $8$. Calcular el valor de la raíz, y decidir si hace falta mirar el $8$.',
    pasos: [
      { t: '<strong>Primer hijo.</strong> Es un nodo MIN, así que se queda con el menor de $3$ y $5$: vale $3$.', antes: 'En un nodo MIN elige el rival. ¿Con cuál de los dos se queda?' },
      { t: '<strong>Lo que ya tengo asegurado.</strong> La raíz es MAX y ya ha visto un $3$, así que $\\alpha = 3$: pase lo que pase, no se conformará con menos.', antes: '¿Qué se lleva la raíz garantizado después de estudiar el primer hijo?' },
      { t: '<strong>Segundo hijo, primera hoja.</strong> Vale $2$. Como ese nodo es MIN, su valor final será $2$ o menos, nunca más.', antes: 'Un nodo MIN que ya ha visto un 2, ¿puede acabar valiendo más de 2?' },
      { t: '<strong>La poda.</strong> Ese hijo va a valer como mucho $2$, y la raíz ya tiene asegurado $3$. Sea lo que sea la otra hoja, la raíz no la va a elegir. <strong>No hace falta mirar el 8.</strong>', antes: 'Compara ese «2 o menos» con el 3 que ya tenías. ¿Puede el segundo hijo ganar?' },
      { t: '<strong>El valor.</strong> La raíz vale $3$. Y fíjate en que habría valido $3$ igualmente si la hoja oculta fuera $8$, $100$ o $-100$: por eso podar no cambia nada.' }
    ],
    cierre: 'Tres hojas miradas de cuatro. Parece poco ahorro, pero el corte se produce en todos los niveles a la vez, y en un árbol de profundidad 10 eso es la diferencia entre terminar y no terminar.'
  });

  p.comprueba('¿Qué le pasa al resultado del minimax cuando se añade la poda alfa-beta?', [
    { t: 'Nada: sale exactamente el mismo valor, solo que mirando menos nodos', ok: true, por: 'La poda solo corta ramas que ya no pueden influir en la decisión de la raíz, y eso se demuestra. Es una optimización exacta, no una aproximación.' },
    { t: 'Sale un valor aproximado, a cambio de ir más rápido', ok: false, por: 'Eso sería una heurística, y las hay, pero la poda alfa-beta no es una de ellas: su resultado es idéntico al de mirar el árbol entero.' },
    { t: 'Puede fallar si el rival no juega perfectamente', ok: false, por: 'El minimax ya supone juego perfecto del rival, con poda o sin ella. Si el rival falla, el resultado real solo puede ser mejor que el calculado.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Buscar un camino: A*');

  p.text('El otro gran problema de búsqueda no tiene rival: es encontrar el camino más corto de un sitio ' +
    'a otro. En [[av-grafos|grafos]] viste el algoritmo de Dijkstra, que va abriendo en abanico desde ' +
    'el origen hasta topar con el destino. Funciona siempre, pero explora en todas las direcciones por ' +
    'igual, incluso en la contraria a donde vamos.');

  p.text('A* le añade una sola cosa: una <strong>pista</strong> sobre lo que falta. En vez de ordenar ' +
    'los candidatos por lo que ya has recorrido, se ordenan por lo recorrido <em>más una estimación</em> ' +
    'de lo que queda.');

  p.formula('f(n) = g(n) + h(n)',
    'la prioridad de A*',
    'Se lee: <em>«efe de ene es ge de ene más hache de ene»</em>.<br><br>$g(n)$ es el coste ' +
    '<strong>real</strong> desde el origen hasta $n$, que ya se conoce. $h(n)$ es la ' +
    '<strong>heurística</strong>: una estimación de lo que falta de $n$ al destino, que se inventa ' +
    'quien programa. Y $f(n)$ es la estimación del coste total del camino que pase por ahí. Se explora ' +
    'siempre el candidato con la $f$ más pequeña.<br><br>Con $h = 0$ no hay pista y A* se convierte ' +
    'exactamente en Dijkstra.');

  p.note('La heurística tiene que ser <strong>admisible</strong>: no puede pasarse nunca, es decir, ' +
    'nunca puede estimar más de lo que de verdad falta. Si se pasa, A* puede dar un camino que no es ' +
    'el más corto. En una cuadrícula donde solo se puede ir en cruz, la distancia en manzanas ' +
    '—$|\\Delta x| + |\\Delta y|$— es admisible, porque ignorar los muros solo puede hacer el camino ' +
    'más fácil, nunca más difícil.', 'warn', 'No pasarse: heurística admisible');

  p.demo({
    title: 'Dijkstra y A*, en la misma cuadrícula',
    intro: 'De la casilla verde a la naranja, rodeando los muros. Las casillas sombreadas son las que el algoritmo ha tenido que examinar. Mueve el mando de la heurística: a la izquierda es Dijkstra puro y a la derecha, A* con la distancia en manzanas.',
    predice: 'Las dos versiones encuentran el mismo camino más corto. ¿En qué crees que se van a diferenciar entonces los dos dibujos?',
    build: function (host) {
      var peso = 1, W_ = 19, H_ = 13;
      var muros = {};
      (function () {
        var i;
        for (i = 2; i <= 9; i++) muros[i + ',' + 4] = 1;
        for (i = 4; i <= 11; i++) muros[9 + ',' + i] = 1;
        for (i = 11; i <= 16; i++) muros[i + ',' + 8] = 1;
        for (i = 1; i <= 6; i++) muros[14 + ',' + i] = 1;
      })();
      var ini = [1, 1], meta = [17, 11];
      var out = W.readout(host, '');
      function clave(x, y) { return x + ',' + y; }
      function busca() {
        var g = {}, vino = {}, abierto = [{ x: ini[0], y: ini[1], f: 0 }], cerrado = {}, orden = [];
        g[clave(ini[0], ini[1])] = 0;
        while (abierto.length) {
          var mejor = 0, i;
          for (i = 1; i < abierto.length; i++) if (abierto[i].f < abierto[mejor].f) mejor = i;
          var n = abierto.splice(mejor, 1)[0], k = clave(n.x, n.y);
          if (cerrado[k]) continue;
          cerrado[k] = 1; orden.push([n.x, n.y]);
          if (n.x === meta[0] && n.y === meta[1]) break;
          var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          for (i = 0; i < 4; i++) {
            var nx = n.x + dirs[i][0], ny = n.y + dirs[i][1], nk = clave(nx, ny);
            if (nx < 0 || ny < 0 || nx >= W_ || ny >= H_ || muros[nk] || cerrado[nk]) continue;
            var ng = g[k] + 1;
            if (g[nk] === undefined || ng < g[nk]) {
              g[nk] = ng; vino[nk] = k;
              var h = Math.abs(nx - meta[0]) + Math.abs(ny - meta[1]);
              abierto.push({ x: nx, y: ny, f: ng + peso * h });
            }
          }
        }
        var camino = [], cur = clave(meta[0], meta[1]);
        while (cur && g[cur] !== undefined) {
          var pp = cur.split(',');
          camino.push([+pp[0], +pp[1]]);
          cur = vino[cur];
        }
        return { orden: orden, camino: camino, coste: g[clave(meta[0], meta[1])] };
      }
      var plot = W.plot(host, {
        xmin: -0.3, xmax: W_ + 0.3, ymin: -0.3, ymax: H_ + 0.3, height: 300, equal: true,
        grid: false, axes: false,
        aria: 'Una cuadrícula con muros, mostrando las casillas que explora el algoritmo y el camino que encuentra',
        draw: function (g2) {
          var res = busca(), i;
          for (i = 0; i < res.orden.length; i++) {
            g2.rect(res.orden[i][0], res.orden[i][1], 1, 1, { color: 1, fill: 1, fillAlpha: 0.28, w: 0 });
          }
          for (var k in muros) {
            var pp = k.split(',');
            g2.rect(+pp[0], +pp[1], 1, 1, { color: 'ink', fill: 'ink', fillAlpha: 0.75, w: 0 });
          }
          if (res.camino.length > 1) {
            g2.path(res.camino.map(function (q) { return [q[0] + 0.5, q[1] + 0.5]; }), { color: 2, w: 3 });
          }
          g2.rect(ini[0], ini[1], 1, 1, { color: 'ok', fill: 'ok', fillAlpha: 0.85, w: 0 });
          g2.rect(meta[0], meta[1], 1, 1, { color: 4, fill: 4, fillAlpha: 0.85, w: 0 });
        }
      });
      function pinta() {
        var res = busca();
        out.set((peso < 0.05 ? '<strong>Dijkstra</strong> ($h = 0$, sin pista)' : '<strong>A*</strong> con heurística al ' + U.fmt(peso * 100, 0) + ' %') +
          ' &nbsp;·&nbsp; casillas examinadas: <strong>' + res.orden.length + '</strong>' +
          ' &nbsp;·&nbsp; camino encontrado: <strong>' + (res.coste !== undefined ? res.coste + ' pasos' : 'ninguno') + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">El camino mide lo mismo en los dos casos: ' +
          'lo que cambia es cuánto hay que mirar para encontrarlo. La pista no mejora la respuesta, ' +
          'mejora el trabajo.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'cuánto se hace caso a la pista', min: 0, max: 1, step: 0.05, value: 1, dec: 2,
        on: function (v) { peso = v; pinta(); }
      });
      pinta();
    }
  });

  p.util('A* es, probablemente, el algoritmo de inteligencia artificial que más veces se ejecuta al día ' +
    'en el mundo. Está dentro de cualquier navegador de mapas —con heurísticas mucho más finas que la ' +
    'distancia en manzanas—, en el movimiento de los personajes de casi todos los videojuegos, en la ' +
    'planificación de rutas de reparto y en los robots de almacén. Y no aprende nada: se lo calcula ' +
    'todo cada vez.');

  p.hist('Claude Shannon escribió en 1950 el artículo que fundó el ajedrez por ordenador, ' +
    '<em>Programming a Computer for Playing Chess</em>, donde ya estaban el árbol, el minimax y la ' +
    'idea de cortar la profundidad con una función de evaluación. La poda alfa-beta la fueron ' +
    'descubriendo varios grupos por separado durante los años cincuenta y sesenta. A* lo publicaron ' +
    'Peter Hart, Nils Nilsson y Bertram Raphael en 1968, trabajando en Shakey, el primer robot que ' +
    'razonaba sobre sus propios movimientos. Y en 1997 Deep Blue ganó a Kaspárov con esta caja de ' +
    'herramientas y ni un gramo de aprendizaje.');

  p.trampas([
    { e: 'Creer que la poda alfa-beta da un resultado aproximado', por: 'Da el mismo valor exacto que mirar el árbol entero. Lo que se poda son ramas que ya no pueden cambiar la decisión.' },
    { e: 'Usar una heurística que se pasa', por: 'Si $h$ estima 10 donde de verdad faltan 6, A* puede dar por bueno un camino peor. La admisibilidad no es un detalle técnico: es lo que garantiza que la respuesta sea la óptima.' },
    { e: 'Pensar que más profundidad siempre es mejor', por: 'Con el árbol cortado hay que evaluar posiciones a medias, y una evaluación mala vista muy profunda puede ser peor que una buena vista poco.' },
    { e: 'Confundir buscar con aprender', por: 'Deep Blue no sabía nada de ajedrez al terminar la partida que no supiera al empezarla. Buscar no deja poso; entrenar sí.' },
    { e: 'Creer que $b^d$ se arregla con ordenadores más rápidos', por: 'Multiplicar por mil la velocidad, en ajedrez, añade menos de dos jugadas de profundidad. Contra una exponencial no se corre: se cambia de método.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El tamaño del árbol',
    level: 'basico',
    gen: function (r) {
      var b = r.pick([2, 3, 4, 5, 6]), d = r.int(2, 6);
      return { b: b, d: d, hojas: Math.pow(b, d) };
    },
    ask: function (d) {
      return 'Un juego tiene un factor de ramificación de $' + d.b + '$ jugadas por turno. ¿Cuántas hojas ' +
        'tiene el árbol si se miran $' + d.d + '$ turnos hacia delante?';
    },
    fields: [{ name: 'h', label: 'hojas', w: 'tiny' }],
    sol: function (d) { return { h: d.hojas }; },
    errores: [{ si: function (v, d) { return d.b !== d.d && v.h === d.d * d.b; }, msg: 'Has multiplicado en vez de elevar. Cada turno multiplica por $b$ las posiciones del anterior, así que se acumula como una potencia.' }],
    hint: function () { return 'Cada turno multiplica por $b$ lo que había. Repetido $d$ veces, eso es $b^d$.'; },
    steps: function (d) {
      return ['$' + d.b + '^{' + d.d + '} = ' + U.miles(d.hojas) + '$ hojas.',
        'Añadir un turno más lo multiplicaría por ' + d.b + ': eso es lo que hace inviable mirar hasta el final en un juego de verdad.'];
    },
    answer: function (d) { return U.miles(d.hojas); }
  });

  p.exercise({
    title: 'Subir los valores por el árbol',
    level: 'basico',
    gen: function (r) {
      var h = [], i;
      for (i = 0; i < 6; i++) h.push(r.int(-9, 9));
      var mins = [Math.min(h[0], h[1]), Math.min(h[2], h[3]), Math.min(h[4], h[5])];
      return { h: h, mins: mins, raiz: Math.max(mins[0], mins[1], mins[2]) };
    },
    ask: function (d) {
      return 'La raíz es un nodo <strong>MAX</strong> con tres hijos <strong>MIN</strong>. Las hojas del ' +
        'primer hijo son $' + d.h[0] + '$ y $' + d.h[1] + '$; las del segundo, $' + d.h[2] + '$ y $' +
        d.h[3] + '$; las del tercero, $' + d.h[4] + '$ y $' + d.h[5] + '$. ¿Cuánto vale la raíz?';
    },
    fields: [{ name: 'v', label: 'valor de la raíz', w: 'tiny' }],
    sol: function (d) { return { v: d.raiz }; },
    errores: [{ si: function (v, d) { var todo = Math.max.apply(null, d.h); return todo !== d.raiz && v.v === todo; }, msg: 'Te has quedado con la mejor hoja del árbol, pero el rival no te va a dejar llegar a ella: en su turno elige él, y elige el mínimo.' }],
    hint: function () { return 'Primero cada hijo MIN se queda con el menor de sus dos hojas. Después la raíz MAX se queda con el mayor de los tres resultados.'; },
    steps: function (d) {
      return ['Hijos MIN: $\\min(' + d.h[0] + ', ' + d.h[1] + ') = ' + d.mins[0] + '$, $\\min(' + d.h[2] + ', ' + d.h[3] + ') = ' + d.mins[1] + '$, $\\min(' + d.h[4] + ', ' + d.h[5] + ') = ' + d.mins[2] + '$.',
        'Raíz MAX: $\\max(' + d.mins.join(', ') + ') = ' + d.raiz + '$.'];
    },
    answer: function (d) { return String(d.raiz); }
  });

  p.exercise({
    title: '¿Qué casilla abre A* primero?',
    level: 'medio',
    gen: function (r) {
      var n = [], i;
      for (i = 0; i < 3; i++) n.push({ g: r.int(1, 9), h: r.int(0, 9) });
      var fs = n.map(function (q) { return q.g + q.h; });
      var min = Math.min.apply(null, fs);
      if (fs.filter(function (f) { return f === min; }).length > 1) return null;
      return { n: n, fs: fs, cual: fs.indexOf(min), min: min };
    },
    ask: function (d) {
      return 'A* tiene tres casillas candidatas: la <strong>A</strong> con $g = ' + d.n[0].g + '$ y $h = ' +
        d.n[0].h + '$, la <strong>B</strong> con $g = ' + d.n[1].g + '$ y $h = ' + d.n[1].h +
        '$, y la <strong>C</strong> con $g = ' + d.n[2].g + '$ y $h = ' + d.n[2].h +
        '$. ¿Cuál se abre primero, y con qué $f$?';
    },
    fields: [
      { name: 'q', label: 'Casilla', opts: [{ t: 'la A', v: '0' }, { t: 'la B', v: '1' }, { t: 'la C', v: '2' }] },
      { name: 'f', label: 'su f', w: 'tiny' }
    ],
    sol: function (d) { return { q: String(d.cual), f: d.min }; },
    errores: [{ si: function (v, d) { var gmin = Math.min(d.n[0].g, d.n[1].g, d.n[2].g); var i = [d.n[0].g, d.n[1].g, d.n[2].g].indexOf(gmin); return i !== d.cual && v.q === String(i); }, msg: 'Has mirado solo lo ya recorrido, que es lo que haría Dijkstra. A* ordena por lo recorrido <em>más</em> la estimación de lo que queda.' }],
    hint: function () { return 'Suma $g + h$ en cada una y abre la de suma más pequeña.'; },
    steps: function (d) {
      return ['$f_A = ' + d.n[0].g + ' + ' + d.n[0].h + ' = ' + d.fs[0] + '$, $f_B = ' + d.n[1].g + ' + ' + d.n[1].h + ' = ' + d.fs[1] + '$, $f_C = ' + d.n[2].g + ' + ' + d.n[2].h + ' = ' + d.fs[2] + '$.',
        'La menor es $' + d.min + '$: se abre la <strong>' + 'ABC'.charAt(d.cual) + '</strong>.'];
    },
    answer: function (d) { return 'ABC'.charAt(d.cual) + ', con f = ' + d.min; }
  });

  p.exercise({
    title: '¿Es admisible esta pista?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'la distancia en manzanas, $|\\Delta x| + |\\Delta y|$, en una cuadrícula en la que solo se puede ir en cruz', v: 'si', por: 'Es exactamente el coste si no hubiera muros, y los muros solo pueden alargar el camino. Nunca se pasa: admisible.' },
        { t: 'el doble de la distancia en manzanas', v: 'no', por: 'Puede estimar 20 donde de verdad faltan 10, así que se pasa. A* podría devolver un camino que no es el más corto.' },
        { t: 'la distancia en línea recta, en una cuadrícula en la que solo se puede ir en cruz', v: 'si', por: 'La línea recta es siempre menor o igual que el recorrido en cruz, así que nunca se pasa. Es admisible, aunque más floja que la distancia en manzanas.' },
        { t: 'la constante cero', v: 'si', por: 'Nunca se pasa, trivialmente. Es admisible, y con ella A* se convierte exactamente en Dijkstra: explora sin ninguna pista.' },
        { t: 'el número de muros que hay en el mapa', v: 'no', por: 'No tiene ninguna relación con lo que falta: en un mapa con cien muros estimaría 100 aunque el destino esté en la casilla de al lado. Se pasa, y mucho.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Como heurística $h$ para A* se propone ' + d.c.t + '. ¿Es admisible?'; },
    fields: [{ name: 'q', label: 'Es', opts: [{ t: 'admisible: nunca se pasa', v: 'si' }, { t: 'no admisible: puede pasarse', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Admisible significa que $h$ nunca estima <em>más</em> de lo que de verdad falta. Quedarse corto siempre vale; pasarse, nunca.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'si' ? 'admisible' : 'no admisible'; }
  });

  p.exercise({
    title: 'Podar o no podar',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(-8, 8), b = r.int(-8, 8);
      var primero = Math.min(a, b);          // valor del primer hijo MIN
      var c = r.int(-8, 8);                  // primera hoja del segundo hijo
      var poda = c <= primero;
      return { a: a, b: b, c: c, alfa: primero, poda: poda };
    },
    ask: function (d) {
      return 'Raíz MAX con dos hijos MIN. Del primero ya se han visto las dos hojas: $' + d.a + '$ y $' +
        d.b + '$. Del segundo se acaba de ver la primera hoja: $' + d.c + '$. ¿Hace falta mirar la ' +
        'segunda hoja del segundo hijo?';
    },
    fields: [
      { name: 'al', label: 'α tras el primer hijo', w: 'tiny' },
      { name: 'q', label: 'La última hoja', opts: [{ t: 'se poda: no hace falta mirarla', v: 'poda' }, { t: 'hay que mirarla', v: 'mirar' }] }
    ],
    sol: function (d) { return { al: d.alfa, q: d.poda ? 'poda' : 'mirar' }; },
    errores: [{ si: function (v, d) { return d.a !== d.b && v.al === Math.max(d.a, d.b); }, msg: 'El primer hijo es un nodo MIN: se queda con el menor de sus hojas, no con el mayor.' }],
    hint: function () { return 'Primero, cuánto asegura el primer hijo: es un MIN. Después, el segundo hijo va a valer como mucho su primera hoja, porque también es MIN. Compara.'; },
    steps: function (d) {
      return ['El primer hijo es MIN: vale $\\min(' + d.a + ', ' + d.b + ') = ' + d.alfa + '$, así que $\\alpha = ' + d.alfa + '$.',
        'El segundo hijo es MIN y ya ha visto un $' + d.c + '$: acabará valiendo $' + d.c + '$ o menos.',
        d.poda
          ? 'Como $' + d.c + ' \\le ' + d.alfa + '$, ese hijo no puede superar lo que la raíz ya tiene. <strong>Se poda</strong>: la última hoja da igual.'
          : 'Como $' + d.c + ' > ' + d.alfa + '$, ese hijo todavía podría ganar. <strong>Hay que mirarla</strong>.'];
    },
    answer: function (d) { return 'α = ' + d.alfa + ', ' + (d.poda ? 'se poda' : 'hay que mirarla'); }
  });

  p.keys([
    'Buscar es una alternativa a aprender: se explora el espacio de posibilidades y no queda ningún poso.',
    'El árbol de un juego crece como $b^d$, y contra una exponencial no sirve tener un ordenador más rápido.',
    'Minimax: los valores suben alternando máximo en mi turno y mínimo en el del rival, que se supone perfecto.',
    'La poda alfa-beta corta ramas que ya no pueden cambiar la decisión. Es exacta, y con buen orden pasa de $b^d$ a $b^{d/2}$.',
    'A* ordena los candidatos por $f = g + h$: lo ya recorrido más una estimación de lo que falta. Con $h = 0$ es Dijkstra.',
    'La heurística debe ser admisible —nunca pasarse— o A* puede devolver un camino que no es el más corto.'
  ]);
});
