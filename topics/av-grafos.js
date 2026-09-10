/* Tema: Teoría de grafos */
Course.topic('av-grafos', function (p) {

  p.text('Un <strong>grafo</strong> es lo más simple que se puede imaginar: unos puntos ' +
    '(<em>vértices</em>) y unas líneas que los unen (<em>aristas</em>). Nada más. Y con eso se ' +
    'modelan las redes sociales, el metro, internet, las rutas de reparto, las moléculas, los horarios ' +
    'de un instituto y el mapa de carreteras de un país.');

  p.text('Lo único que importa es <strong>quién está conectado con quién</strong>. Dónde dibujes los ' +
    'puntos o si las líneas son rectas o curvas da exactamente igual: es topología pura.');

  p.section('Vocabulario mínimo');
  p.text('Un grafo es lo más sencillo que se puede imaginar: unos puntos y unas líneas que unen algunos ' +
    'de ellos. Nada más. Lo asombroso es cuántas cosas encajan en esa descripción —una red de metro, ' +
    'las amistades de una red social, las páginas de internet enlazadas entre sí, las tareas de una ' +
    'obra con sus dependencias— y que todas se estudian con las mismas herramientas. Antes hace ' +
    'falta media docena de palabras.');


  p.list([
    '<strong>Grado</strong> de un vértice: cuántas aristas salen de él.',
    '<strong>Camino</strong>: sucesión de aristas que lleva de un vértice a otro.',
    '<strong>Ciclo</strong>: camino que vuelve al punto de partida.',
    '<strong>Conexo</strong>: se puede llegar de cualquier vértice a cualquier otro.',
    '<strong>Árbol</strong>: grafo conexo sin ciclos. Siempre tiene exactamente $V-1$ aristas.'
  ]);

  p.formula('\\sum_{v} \\operatorname{grado}(v) = 2A', 'lema del apretón de manos',
    'Se lee: <em>«el sumatorio, extendido a todos los vértices uve, del grado de uve, es igual a dos ' +
      'por el número de aristas»</em>.<br><br>La razón es la que le da nombre: cada arista une dos ' +
      'vértices, así que al ir sumando los grados de todos, cada arista se cuenta exactamente dos ' +
      'veces. Igual que en una reunión, si todos cuentan cuántas manos han estrechado, el total es el ' +
      'doble de apretones que hubo.');

  p.note('Esa fórmula tiene una lectura graciosa: si en una fiesta se cuentan todos los apretones de ' +
    'manos que ha dado cada persona, el total es el doble del número de apretones, porque en cada uno ' +
    'participan dos. Y de ahí sale un corolario curioso: <strong>el número de personas que han dado ' +
    'un número impar de apretones es siempre par</strong>.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Los puentes de Königsberg');

  p.text('La ciudad de Königsberg tenía siete puentes sobre el río Pregel. Los vecinos se preguntaban ' +
    'si era posible dar un paseo cruzando <strong>cada puente exactamente una vez</strong>. En 1736, ' +
    'Euler demostró que no, y al hacerlo fundó la teoría de grafos y la topología.');

  p.text('Su razonamiento fue este: en cada zona de tierra por la que <em>pases</em>, tienes que entrar ' +
    'por un puente y salir por otro, así que necesitas un número <strong>par</strong> de puentes. Solo ' +
    'el punto de salida y el de llegada pueden tener un número impar. En Königsberg <em>las cuatro</em> ' +
    'zonas tenían un número impar de puentes. Imposible.');

  p.formulas([
    '\\text{recorrido euleriano cerrado} \\iff \\text{todos los grados son pares}',
    '\\text{recorrido euleriano abierto} \\iff \\text{exactamente dos grados impares}'
  ]);

  p.demo({
    title: '¿Se puede dibujar de un trazo?',
    intro: 'Un grafo se puede recorrer pasando una sola vez por cada arista si tiene cero o dos vértices de grado impar. Comprueba la regla con estos ejemplos.',
    build: function (host, d) {
      var idx = 0;
      var grafos = [
        {
          n: 'Königsberg', V: [[1, 3], [4, 5], [4, 1], [7, 3]],
          A: [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]]
        },
        {
          n: 'el sobre abierto', V: [[1, 1], [5, 1], [5, 4], [1, 4], [3, 6]],
          A: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [3, 4], [2, 4]]
        },
        {
          n: 'la casita', V: [[1, 1], [5, 1], [5, 4], [1, 4], [3, 6]],
          A: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [3, 4], [2, 4]]
        },
        {
          n: 'triángulo', V: [[2, 1], [6, 1], [4, 5]],
          A: [[0, 1], [1, 2], [2, 0]]
        },
        {
          n: 'estrella de 4 puntas', V: [[4, 3.5], [1, 1], [7, 1], [1, 6], [7, 6]],
          A: [[0, 1], [0, 2], [0, 3], [0, 4]]
        }
      ];
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: 0, xmax: 8, ymin: 0, ymax: 7, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          var G = grafos[idx];
          var contadas = {};
          G.A.forEach(function (e) {
            var clave = Math.min(e[0], e[1]) + '-' + Math.max(e[0], e[1]);
            contadas[clave] = (contadas[clave] || 0) + 1;
            var offset = (contadas[clave] - 1) * 0.45;
            var A = G.V[e[0]], B = G.V[e[1]];
            if (offset === 0) g.seg(A[0], A[1], B[0], B[1], { color: 0, w: 2.4 });
            else {
              // arista paralela: se dibuja curvada
              var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
              var dx = B[0] - A[0], dy = B[1] - A[1];
              var L = Math.hypot(dx, dy);
              var cx = mx - dy / L * offset * 2, cy = my + dx / L * offset * 2;
              g.param(function (t) { return (1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * cx + t * t * B[0]; },
                function (t) { return (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * cy + t * t * B[1]; },
                0, 1, { color: 0, w: 2.4, samples: 60 });
            }
          });
          var grados = G.V.map(function () { return 0; });
          G.A.forEach(function (e) { grados[e[0]]++; grados[e[1]]++; });
          G.V.forEach(function (P, i) {
            var impar = grados[i] % 2 === 1;
            g.point(P[0], P[1], { color: impar ? 1 : 2, r: 9 });
            g.text(P[0], P[1], String(grados[i]), { align: 'center', color: 'bg', size: 12, bold: true, baseline: 'middle' });
          });
        }
      });
      function paint() {
        var G = grafos[idx];
        var grados = G.V.map(function () { return 0; });
        G.A.forEach(function (e) { grados[e[0]]++; grados[e[1]]++; });
        var impares = grados.filter(function (x) { return x % 2 === 1; }).length;
        var veredicto;
        if (impares === 0) veredicto = '<strong style="color:var(--ok)">Sí, y además se puede terminar donde se empezó</strong> (recorrido cerrado).';
        else if (impares === 2) veredicto = '<strong style="color:var(--ok)">Sí, empezando en uno de los dos vértices impares y acabando en el otro.</strong>';
        else veredicto = '<strong style="color:var(--bad)">No se puede: hay ' + impares + ' vértices de grado impar, y solo se admiten 0 o 2.</strong>';
        out.set('<strong>' + G.n + '</strong> — $V = ' + G.V.length + '$, $A = ' + G.A.length + '$<br>' +
          'Grados: ' + grados.join(', ') + ' &nbsp;·&nbsp; vértices impares: <strong>' + impares + '</strong><br>' +
          veredicto + '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          'Suma de grados = ' + U.sum(grados) + ' = 2 · ' + G.A.length + ' ✓ (lema del apretón de manos). ' +
          'Los vértices rojos tienen grado impar.</span>');
        plot.render();
      }
      W.chips(host, grafos.map(function (G, i) { return { label: G.n, value: i }; }),
        { value: 0, on: function (v) { idx = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.hist('El problema de los siete puentes se lo planteaban los vecinos de Königsberg como pasatiempo ' +
    'dominical hasta que Euler lo resolvió en 1736 demostrando que no tenía solución. Su aportación ' +
    'fue más profunda que la respuesta: se dio cuenta de que la forma de la ciudad, las distancias y ' +
    'el tamaño de las islas eran irrelevantes, y que solo importaba qué estaba conectado con qué. ' +
    'Con esa abstracción fundó dos disciplinas de golpe, la teoría de grafos y la topología.');

  p.section('Árboles y caminos mínimos');

  p.text('Un <strong>árbol</strong> es un grafo conexo sin ciclos: la forma más barata de mantener ' +
    'todo conectado. Si quitas cualquier arista, se parte en dos; si añades cualquiera, aparece un ciclo.');

  p.formula('\\text{árbol con } V \\text{ vértices} \\ \\Longrightarrow\\ A = V - 1');

  p.text('El <strong>árbol de expansión mínimo</strong> responde a una pregunta muy práctica: si hay ' +
    'que conectar $n$ ciudades con fibra óptica y cada tramo tiene un coste, ¿cuál es la red más barata ' +
    'que las une todas? Los algoritmos de Kruskal y Prim la encuentran, y son sorprendentemente ' +
    'sencillos: ir añadiendo siempre la arista más barata que no cierre un ciclo.');

  p.text('El problema del <strong>camino mínimo</strong> (¿cuál es la ruta más corta de A a B?) lo ' +
    'resuelve el algoritmo de Dijkstra, de 1956. Es el que está por debajo de cualquier GPS y de ' +
    'cualquier aplicación de rutas que hayas usado.');

  p.demo({
    title: 'Camino más corto en una red',
    intro: 'Los números son las distancias de cada tramo. Elige el destino y se marca la ruta más corta desde A, con su longitud total.',
    build: function (host, d) {
      var destino = 5;
      var V = [[1, 3], [3.2, 5.4], [3.4, 1], [5.6, 4.4], [5.8, 1.6], [8, 3.2]];
      var nombres = ['A', 'B', 'C', 'D', 'E', 'F'];
      var E = [
        [0, 1, 4], [0, 2, 2], [1, 2, 1], [1, 3, 5], [2, 3, 8],
        [2, 4, 10], [3, 4, 2], [3, 5, 6], [4, 5, 3]
      ];
      var out = W.readout(host, '');
      function dijkstra(fin) {
        var n = V.length;
        var dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), visto = new Array(n).fill(false);
        dist[0] = 0;
        for (var it = 0; it < n; it++) {
          var u = -1, mejor = Infinity;
          for (var i = 0; i < n; i++) if (!visto[i] && dist[i] < mejor) { mejor = dist[i]; u = i; }
          if (u < 0) break;
          visto[u] = true;
          E.forEach(function (e) {
            var a = e[0], b = e[1], w = e[2];
            if (a === u && dist[u] + w < dist[b]) { dist[b] = dist[u] + w; prev[b] = u; }
            if (b === u && dist[u] + w < dist[a]) { dist[a] = dist[u] + w; prev[a] = u; }
          });
        }
        var ruta = [], x = fin;
        while (x >= 0) { ruta.unshift(x); x = prev[x]; }
        return { dist: dist[fin], ruta: ruta };
      }
      var plot = W.board(host, {
        xmin: 0, xmax: 9, ymin: 0, ymax: 6.5, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          var res = dijkstra(destino);
          var enRuta = {};
          for (var i = 0; i + 1 < res.ruta.length; i++) {
            enRuta[Math.min(res.ruta[i], res.ruta[i + 1]) + '-' + Math.max(res.ruta[i], res.ruta[i + 1])] = true;
          }
          E.forEach(function (e) {
            var A = V[e[0]], B = V[e[1]];
            var clave = Math.min(e[0], e[1]) + '-' + Math.max(e[0], e[1]);
            var on = enRuta[clave];
            g.seg(A[0], A[1], B[0], B[1], { color: on ? 2 : 'axis', w: on ? 4 : 1.8, alpha: on ? 1 : .6 });
            g.text((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, String(e[2]),
              { align: 'center', size: 12, color: on ? 2 : 'ink', box: true });
          });
          V.forEach(function (P, i) {
            var en = res.ruta.indexOf(i) >= 0;
            g.point(P[0], P[1], { color: i === 0 ? 0 : (en ? 2 : 'axis'), r: 11 });
            g.text(P[0], P[1], nombres[i], { align: 'center', baseline: 'middle', color: 'bg', size: 13, bold: true });
          });
        }
      });
      function paint() {
        var res = dijkstra(destino);
        out.set('Ruta más corta de <strong>A</strong> a <strong>' + nombres[destino] + '</strong>: ' +
          res.ruta.map(function (i) { return nombres[i]; }).join(' → ') +
          ' &nbsp;·&nbsp; longitud total <strong>' + res.dist + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Fíjate en que la ruta más corta no ' +
          'siempre es la que menos tramos tiene.</span>');
        plot.render();
      }
      W.chips(host, [1, 2, 3, 4, 5].map(function (i) { return { label: 'hasta ' + nombres[i], value: i }; }),
        { value: 5, on: function (v) { destino = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El algoritmo de caminos mínimos es el que ejecuta tu móvil cada vez que pides una ruta, con las ' +
    'calles como aristas y el tiempo de recorrido como peso. El mismo algoritmo enruta los paquetes ' +
    'de internet salto a salto, decide el tendido eléctrico más barato que conecta unos pueblos y ' +
    'organiza el orden de las tareas de una obra. Es de los algoritmos que más veces se ejecutan por ' +
    'segundo en el planeta.');

  p.section('Dos problemas parecidos y muy distintos');

  p.text('Un <strong>circuito euleriano</strong> pasa una vez por cada <em>arista</em>; un ' +
    '<strong>circuito hamiltoniano</strong> pasa una vez por cada <em>vértice</em>. Suenan casi igual, ' +
    'y sin embargo:');

  p.list([
    'Decidir si existe un circuito <strong>euleriano</strong> es trivial: se miran los grados y listo.',
    'Decidir si existe uno <strong>hamiltoniano</strong> es de los problemas más difíciles que se conocen (NP-completo): nadie sabe hacerlo rápido para grafos grandes.'
  ]);

  p.note('El problema del <em>viajante de comercio</em> (visitar $n$ ciudades por la ruta más corta) es ' +
    'la versión con pesos del circuito hamiltoniano. Con 20 ciudades hay más de $10^{17}$ rutas ' +
    'posibles. Si alguien encontrara un algoritmo rápido, resolvería de paso el problema P vs NP, uno ' +
    'de los siete Problemas del Milenio, con un premio de un millón de dólares.', null, 'Un millón de dólares');

  /* ================= EJERCICIOS ================= */
  p.util('Que un problema tenga solución eficiente y su gemelo no la tenga es el corazón de la pregunta ' +
    'abierta más importante de la informática, la de P frente a NP, con un premio de un millón de ' +
    'dólares esperando. No es filosofía: si alguien demostrara que son iguales, toda la criptografía ' +
    'actual caería en un fin de semana. Mientras tanto, los repartidores y las fábricas resuelven ' +
    'sus rutas con métodos que dan una solución buena sin garantizar que sea la mejor.');

  p.section('Practica');

  p.exercise({
    title: 'Lema del apretón de manos',
    level: 'basico',
    gen: function (r) {
      var n = r.int(4, 8);
      var grados = [];
      var suma = 0;
      for (var i = 0; i < n - 1; i++) { var g = r.int(1, 5); grados.push(g); suma += g; }
      var ultimo = suma % 2 === 0 ? r.int(1, 5) * 2 : r.int(1, 5) * 2 - 1;
      grados.push(ultimo);
      suma += ultimo;
      return { grados: grados, A: suma / 2 };
    },
    ask: function (d) {
      return 'Un grafo tiene vértices de grados $' + d.grados.join(',\\ ') + '$. ¿Cuántas aristas tiene?';
    },
    fields: [{ name: 'a', label: 'Aristas', w: 'tiny' }],
    sol: function (d) { return { a: d.A }; },
    hint: function () { return 'La suma de todos los grados es el doble del número de aristas.'; },
    steps: function (d) {
      return ['Suma de grados: $' + d.grados.join(' + ') + ' = ' + (d.A * 2) + '$.',
        'Cada arista aporta 2 al total (una unidad a cada extremo).',
        '$A = \\dfrac{' + (d.A * 2) + '}{2} = ' + d.A + '$'];
    },
    answer: function (d) { return d.A + ' aristas'; }
  });

  p.exercise({
    title: 'Aristas de un árbol',
    level: 'basico',
    gen: function (r) {
      var V = r.int(3, 40);
      return { V: V, A: V - 1 };
    },
    ask: function (d) {
      return 'Un árbol tiene $' + d.V + '$ vértices. ¿Cuántas aristas tiene?';
    },
    fields: [{ name: 'a', label: 'Aristas', w: 'tiny' }],
    sol: function (d) { return { a: d.A }; },
    hint: function () { return 'Un árbol siempre tiene una arista menos que vértices.'; },
    steps: function (d) {
      return ['Un árbol es conexo y no tiene ciclos.',
        'Empezando por un vértice suelto, cada arista nueva añade exactamente un vértice nuevo (si no, cerraría un ciclo).',
        '$A = V - 1 = ' + d.V + ' - 1 = ' + d.A + '$'];
    },
    answer: function (d) { return d.A + ' aristas'; }
  });

  p.exercise({
    title: '¿Se puede recorrer de un trazo?',
    level: 'medio',
    gen: function (r) {
      var n = r.int(4, 7);
      var impares = r.pick([0, 0, 2, 2, 3, 4]);
      if (impares > n) return null;
      var grados = [];
      for (var i = 0; i < n; i++) grados.push(i < impares ? r.int(1, 4) * 2 - 1 : r.int(1, 3) * 2);
      grados = r.shuffle(grados);
      return { grados: grados, impares: impares, ok: impares === 0 ? 1 : (impares === 2 ? 2 : 3) };
    },
    ask: function (d) {
      return 'Un grafo conexo tiene vértices de grados $' + d.grados.join(',\\ ') + '$. ' +
        '¿Admite un recorrido que pase una sola vez por cada arista?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)"><code>1</code> sí, cerrado (vuelve al ' +
        'inicio) · <code>2</code> sí, pero abierto · <code>3</code> no se puede</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny' }],
    sol: function (d) { return { r: d.ok }; },
    hint: function () { return 'Cuenta cuántos grados impares hay: cero permite recorrido cerrado, dos permiten abierto, más de dos lo impiden.'; },
    steps: function (d) {
      return ['Contamos los vértices de grado impar: hay <strong>' + d.impares + '</strong>.',
        'Regla de Euler: 0 impares → recorrido cerrado; 2 impares → abierto; cualquier otra cosa → imposible.',
        d.ok === 1 ? 'Con 0 impares: <strong>sí, y cerrado</strong>.'
          : (d.ok === 2 ? 'Con 2 impares: <strong>sí, empezando en uno y acabando en el otro</strong>.'
            : 'Con ' + d.impares + ' impares: <strong>no se puede</strong>.')];
    },
    answer: function (d) {
      return ['', 'Sí, recorrido cerrado', 'Sí, recorrido abierto', 'No se puede'][d.ok];
    }
  });

  p.exercise({
    title: 'Grafo completo',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 20);
      return { n: n, A: ML.comb(n, 2) };
    },
    ask: function (d) {
      return 'En una reunión de $' + d.n + '$ personas todas se saludan con todas exactamente una vez. ' +
        '¿Cuántos saludos se producen?';
    },
    fields: [{ name: 'a', label: 'Saludos', w: 'tiny' }],
    sol: function (d) { return { a: d.A }; },
    hint: function (d) { return 'Cada saludo es una pareja de personas: son combinaciones de $' + d.n + '$ elementos tomados de 2 en 2.'; },
    steps: function (d) {
      return ['Es el grafo completo $K_{' + d.n + '}$: todos los vértices unidos entre sí.',
        'Cada arista es una pareja, y el orden no importa.',
        '$A = \\dbinom{' + d.n + '}{2} = \\dfrac{' + d.n + ' \\cdot ' + (d.n - 1) + '}{2} = ' + d.A + '$',
        'Comprobación con el lema del apretón: cada uno saluda a $' + (d.n - 1) + '$ personas, así que ' +
        'la suma de grados es $' + d.n + ' \\cdot ' + (d.n - 1) + ' = ' + (d.n * (d.n - 1)) + ' = 2A$ ✓'];
    },
    answer: function (d) { return d.A + ' saludos'; }
  });

  p.keys([
    'Un grafo solo codifica <strong>quién se conecta con quién</strong>: la forma del dibujo da igual.',
    'Lema del apretón de manos: la suma de grados es $2A$.',
    'Recorrido euleriano (todas las aristas una vez): existe si hay 0 o 2 vértices de grado impar.',
    'Árbol: conexo y sin ciclos, con exactamente $V-1$ aristas.',
    'Dijkstra encuentra el camino mínimo: es lo que hace tu GPS.',
    'Euleriano (aristas) es fácil; hamiltoniano (vértices) es de los problemas más duros que existen.'
  ]);
});
