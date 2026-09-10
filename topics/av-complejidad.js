/* Tema: Complejidad: lo facil, lo dificil y P frente a NP */
Course.topic('av-complejidad', function (p) {

  p.text('En [[av-computabilidad]] se vio que hay problemas que ningún ordenador puede resolver, ni con todo el ' +
    'tiempo del mundo. Pero entre los problemas que sí se pueden resolver hay otra frontera, más práctica y ' +
    'igual de profunda: la que separa los que se resuelven <strong>en segundos</strong> de los que no terminarían ' +
    '<strong>antes del fin del universo</strong>, aunque el algoritmo sea correcto y el ordenador, el más rápido ' +
    'que existe.');

  /* ---------------------------------------------------------------- */
  p.section('El coste de un algoritmo y la notación O');

  p.text('Para comparar algoritmos no se mide cuántos segundos tardan, que depende del ordenador, sino ' +
    '<strong>cuántos pasos básicos</strong> dan en función del tamaño $n$ del problema: cuántos números hay que ' +
    'ordenar, cuántas ciudades hay que visitar. Y no interesa el número exacto, sino cómo crece cuando $n$ se hace ' +
    'grande.');

  p.formula('f(n) = O\\bigl(g(n)\\bigr) \\iff \\text{existen } C > 0 \\text{ y } n_0 \\text{ tales que } f(n) \\le C\\,g(n) \\text{ para todo } n \\ge n_0',
    'la notación O grande',
    'Se lee: <em>«efe de ene es o grande de ge de ene»</em>, y quiere decir que, a partir de cierto tamaño, $f$ no crece más ' +
    'deprisa que $g$, salvo por un factor constante.<br><br>Así, $3n^2 + 5n + 7 = O(n^2)$: para $n$ grande, el término ' +
    '$n^2$ manda y los demás apenas cuentan. Es la misma idea que comparar [[fn-limites|infinitos]] por su orden.');

  p.table(['Coste', 'Nombre', 'Ejemplo', 'Con $n = 1000$'], [
    ['$O(1)$', 'constante', 'mirar el primer elemento de una lista', '1 paso'],
    ['$O(\\log n)$', 'logarítmico', 'buscar en una lista ordenada partiéndola por la mitad', 'unos 10 pasos'],
    ['$O(n)$', 'lineal', 'buscar en una lista desordenada', '1000 pasos'],
    ['$O(n \\log n)$', 'casi lineal', 'ordenar bien una lista', 'unos 10 000 pasos'],
    ['$O(n^2)$', 'cuadrático', 'comparar todas las parejas', 'un millón de pasos'],
    ['$O(2^n)$', 'exponencial', 'probar todos los subconjuntos', 'un número de 302 cifras'],
    ['$O(n!)$', 'factorial', 'probar todos los órdenes', 'un número de 2568 cifras']
  ]);

  p.demo({
    title: 'Cuánto tarda cada algoritmo',
    intro: 'Pasos que da cada tipo de algoritmo según el tamaño n, en escala logarítmica: cada unidad del eje vertical es multiplicar por 10. Las líneas horizontales marcan lo que tarda un ordenador que hace mil millones de pasos por segundo en un segundo, un día, un siglo y la edad del universo. Mueve n.',
    build: function (host) {
      var n = 30;
      function logFact(x) { var s = 0, k; for (k = 2; k <= Math.floor(x); k++) s += Math.log(k) / Math.LN10; return s + (x - Math.floor(x)) * Math.log(Math.floor(x) + 1) / Math.LN10; }
      var CURVAS = [
        { t: 'n', l: function (x) { return Math.log(x) / Math.LN10; } },
        { t: 'n log₂ n', l: function (x) { return Math.log(x * Math.max(1, Math.log(x) / Math.LN2)) / Math.LN10; } },
        { t: 'n²', l: function (x) { return 2 * Math.log(x) / Math.LN10; } },
        { t: 'n³', l: function (x) { return 3 * Math.log(x) / Math.LN10; } },
        { t: '2ⁿ', l: function (x) { return x * Math.log(2) / Math.LN10; } },
        { t: 'n!', l: logFact }
      ];
      var MARCAS = [[9, 'un segundo'], [9 + Math.log(86400) / Math.LN10, 'un día'], [9 + Math.log(3.156e9) / Math.LN10, 'un siglo'], [9 + Math.log(4.35e17) / Math.LN10, 'edad del universo']];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 1, xmax: 100, ymin: 0, ymax: 40, height: 320, xlabel: 'n', ylabel: 'log₁₀ de los pasos',
        aria: 'Crecimiento del número de pasos de algoritmos lineales, cuadráticos, cúbicos, exponenciales y factoriales, en escala logarítmica',
        draw: function (g) {
          MARCAS.forEach(function (m) { g.hline(m[0], { color: 'axis', dash: [4, 4], w: 1 }); g.text(99, m[0] + 0.9, m[1], { align: 'right', size: 11, color: 'axis', box: true }); });
          CURVAS.forEach(function (c, i) { g.fn(c.l, { color: i, w: 2.2, from: 1 }); });
          g.vline(n, { color: 'ink', w: 1.2 });
        }
      });
      function tiempo(L) {
        var s = L - 9;
        if (s < -3) return 'menos de un milisegundo';
        if (s < Math.log(60) / Math.LN10) return U.fmt(Math.pow(10, s), 2) + ' s';
        if (s < Math.log(3600) / Math.LN10) return U.fmt(Math.pow(10, s) / 60, 1) + ' min';
        if (s < Math.log(86400) / Math.LN10) return U.fmt(Math.pow(10, s) / 3600, 1) + ' h';
        if (s < Math.log(3.156e7) / Math.LN10) return U.fmt(Math.pow(10, s) / 86400, 1) + ' días';
        var anios = s - Math.log(3.156e7) / Math.LN10;
        return anios < 6 ? U.miles(Math.round(Math.pow(10, anios))) + ' años' : '$10^{' + Math.floor(anios) + '}$ años';
      }
      function pinta() {
        out.set('Con $n = ' + n + '$ y mil millones de pasos por segundo: ' + CURVAS.map(function (c) { return c.t + ': <strong>' + tiempo(c.l(n)) + '</strong>'; }).join(' &nbsp;·&nbsp; '));
        plot.render();
      }
      W.slider(W.row(host), { label: 'tamaño n', min: 2, max: 100, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      W.legend(host, CURVAS.map(function (c, i) { return { c: i, t: c.t }; }));
      pinta();
    }
  });

  p.note('Un ordenador mil veces más rápido no arregla un algoritmo exponencial. Si $2^n$ pasos llevan un día, ' +
    'el ordenador nuevo en un día resuelve problemas de tamaño $n + 10$, porque $2^{10} \\approx 1000$. Con un ' +
    'algoritmo cuadrático, el mismo salto de velocidad multiplica el tamaño abarcable por 31. La mejora de verdad ' +
    'viene siempre de un algoritmo mejor.', 'warn', 'Más potencia no basta');

  /* ---------------------------------------------------------------- */
  p.section('Las clases P y NP');

  p.text('Los informáticos llaman <strong>eficientes</strong> a los algoritmos cuyo coste es un polinomio en $n$: ' +
    '$n$, $n^2$, $n^{3}$. Los problemas que tienen un algoritmo así forman la clase <strong>P</strong>. Ordenar una ' +
    'lista, encontrar el camino más corto en un [[av-grafos|grafo]] o saber si un número es primo están en P.');

  p.text('Pero hay muchísimos problemas para los que nadie conoce un algoritmo eficiente y que, sin embargo, ' +
    'tienen una propiedad curiosa: <strong>si alguien te da una solución, comprobarla es fácil</strong>. Resolver ' +
    'un sudoku gigante es difícil; comprobar uno ya relleno, inmediato. Encontrar un recorrido que pase por todas ' +
    'las ciudades con menos de 1000 km es difícil; comprobar uno que te dan, basta con sumar. Los problemas cuyas ' +
    'soluciones se comprueban en tiempo polinómico forman la clase <strong>NP</strong>.');

  p.formula('\\mathrm{P} \\subseteq \\mathrm{NP} \\qquad\\qquad \\mathrm{P} \\stackrel{?}{=} \\mathrm{NP}',
    'la pregunta abierta más famosa de la informática',
    'Todo lo que se resuelve deprisa se comprueba deprisa: basta con resolverlo. Por eso P está contenido en NP.<br><br>' +
    'La pregunta es si son iguales: si todo lo que se comprueba deprisa se puede también resolver deprisa. Casi todo ' +
    'el mundo cree que no, pero nadie lo ha demostrado. Es uno de los siete Problemas del Milenio, con un premio de un ' +
    'millón de dólares desde el año 2000.');

  p.demo({
    title: 'Comprobar es fácil; encontrar, no tanto',
    intro: 'Elige números de la lista para que sumen exactamente 100. Comprobar tu propuesta es inmediato: basta sumar. Encontrarla ya no lo es: con 12 números hay 4096 subconjuntos posibles. Pide al ordenador que los pruebe en orden y mira cuántos intentos le cuesta.',
    build: function (host) {
      var nums = [3, 34, 4, 12, 5, 2, 27, 18, 9, 41, 16, 7], objetivo = 100, elegidos = [];
      nums.forEach(function () { elegidos.push(false); });
      var out = W.readout(host, '');
      var chips = W.chips(host, nums.map(function (v) { return String(v); }), {
        toggle: false,
        on: function (v, i) { elegidos[i] = !elegidos[i]; chips.items[i].classList.toggle('is-on', elegidos[i]); chips.items[i].setAttribute('aria-pressed', elegidos[i] ? 'true' : 'false'); pinta(); }
      });
      chips.items.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      var busqueda = '';
      function pinta() {
        var s = 0, cuales = [];
        nums.forEach(function (v, i) { if (elegidos[i]) { s += v; cuales.push(v); } });
        out.set('Tu selección: ' + (cuales.length ? cuales.join(' + ') + ' = <strong>' + s + '</strong>' : 'ningún número') + ' &nbsp;·&nbsp; objetivo: 100 &nbsp;·&nbsp; ' +
          (s === objetivo ? '<strong style="color:var(--ok)">¡Correcto! Comprobarlo ha costado una suma.</strong>' : 'todavía no') + (busqueda ? '<br>' + busqueda : ''));
      }
      W.buttons(host, [{ t: 'Que lo busque el ordenador', on: function () {
        var total = 1 << nums.length;
        for (var m = 1; m < total; m++) {
          var s = 0, cuales = [];
          for (var i = 0; i < nums.length; i++) if (m & (1 << i)) { s += nums[i]; cuales.push(nums[i]); }
          if (s === objetivo) { busqueda = 'El ordenador, probando subconjuntos en orden, encontró ' + cuales.join(' + ') + ' en el intento ' + U.miles(m) + ' de ' + U.miles(total) + '. Con 60 números habría $2^{60}$ subconjuntos: más de 36 años a mil millones por segundo.'; break; }
        }
        pinta();
      } }]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Problemas NP-completos y lo que está en juego');

  p.text('En 1971, Stephen Cook demostró algo inesperado: hay problemas en NP que son <strong>los más difíciles de ' +
    'todos</strong>, en un sentido preciso. Cualquier otro problema de NP se puede traducir a ellos con un coste ' +
    'polinómico. Se llaman <strong>NP-completos</strong>. Al año siguiente, Richard Karp mostró que 21 problemas ' +
    'clásicos lo eran, y hoy se conocen miles: el sudoku generalizado, colorear un mapa con tres colores, el ' +
    'problema de la mochila, el del viajante.');

  p.list([
    'Si alguien encontrara un algoritmo eficiente para <strong>uno solo</strong> de ellos, todos los problemas de NP serían fáciles: P sería igual a NP.',
    'Si alguien demostrara que uno de ellos no tiene algoritmo eficiente, quedaría demostrado que P y NP son distintos.',
    'Mientras tanto, en la práctica se usan <strong>heurísticas</strong>: métodos que encuentran soluciones buenas, aunque no necesariamente óptimas, en un tiempo razonable.'
  ]);

  p.note('La criptografía se apoya en problemas que se creen difíciles, como factorizar números enormes o el ' +
    '[[av-cripto-curvas|logaritmo discreto]]. Ojo: no se sabe que esos problemas sean NP-completos. Están en NP, se ' +
    'cree que no están en P, pero su dificultad no está demostrada. La seguridad de internet descansa sobre una ' +
    'conjetura muy razonable, no sobre un teorema.', 'warn', 'Un matiz importante');

  p.hist('En 1956, Kurt Gödel escribió una carta a John von Neumann, que estaba ya muy enfermo, preguntándole si ' +
    'se podría decidir en un número de pasos proporcional a $n$ o a $n^2$ si un enunciado matemático tiene una ' +
    'demostración de longitud $n$. Era, con otras palabras, la pregunta de P frente a NP, quince años antes de que ' +
    'Stephen Cook la formulara y la hiciera famosa. La carta no se conoció hasta finales de los años ochenta. Leonid ' +
    'Levin, en la Unión Soviética, llegó por su cuenta a los mismos resultados que Cook casi a la vez.');

  p.util('Las empresas de transporte no calculan la ruta óptima para repartir paquetes, que es un problema ' +
    'NP-difícil: usan heurísticas que se quedan a un pocos por ciento del óptimo. Los fabricantes de chips ' +
    'verifican sus diseños con programas que resuelven el problema SAT, el primer NP-completo conocido, y que ' +
    'funcionan asombrosamente bien con los casos que aparecen en la práctica, aunque en el peor caso sean ' +
    'exponenciales.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Subconjuntos y ordenaciones',
    level: 'basico',
    gen: function (r) { var n = r.int(3, 10); return { n: n, sub: Math.pow(2, n), ord: ML.factorial(n) }; },
    ask: function (d) { return 'Con ' + d.n + ' objetos distintos, ¿cuántos subconjuntos se pueden formar (incluido el vacío)? ¿Y de cuántas maneras se pueden ordenar los ' + d.n + ' en fila?'; },
    fields: [{ name: 's', label: 'subconjuntos', w: 'wide' }, { name: 'o', label: 'ordenaciones', w: 'wide' }],
    sol: function (d) { return { s: d.sub, o: d.ord }; },
    errores: [
      { si: function (v, d) { return d.n * d.n !== d.sub && v.s === d.n * d.n; }, msg: 'Cada objeto está o no está en el subconjunto: dos opciones por objeto, que se multiplican. Eso da $2^n$, no $n^2$.' },
      { si: function (v, d) { return d.sub !== d.ord && v.o === d.sub; }, msg: 'Eso son los subconjuntos. Para ordenar, el primer puesto tiene $n$ candidatos, el segundo $n - 1$…: $n!$.' }
    ],
    hint: function () { return ['Subconjuntos: para cada objeto, ¿está o no está?', 'Ordenaciones: $n\\cdot(n - 1)\\cdots 1$, las [[pe-combinatoria|permutaciones]].']; },
    steps: function (d) { return ['Subconjuntos: $2^{' + d.n + '} = ' + U.miles(d.sub) + '$.', 'Ordenaciones: $' + d.n + '! = ' + U.miles(d.ord) + '$.', 'Probar todos los subconjuntos es exponencial; probar todos los órdenes, todavía peor.']; },
    answer: function (d) { return U.miles(d.sub) + ' y ' + U.miles(d.ord); }
  });

  p.exercise({
    title: 'Búsqueda por la mitad',
    level: 'basico',
    gen: function (r) { var N = r.pick([15, 31, 100, 1000, 1000000, 1000000000]); return { N: N, c: Math.ceil(Math.log(N + 1) / Math.LN2) }; },
    ask: function (d) { return 'En una lista ordenada de ' + U.miles(d.N) + ' elementos se busca uno mirando siempre el del medio y descartando la mitad que no puede contenerlo. ¿Cuántas comparaciones hacen falta, como máximo?'; },
    fields: [{ name: 'c', label: 'comparaciones', w: 'tiny' }],
    sol: function (d) { return { c: d.c }; },
    errores: [{ si: function (v, d) { return v.c === Math.ceil(d.N / 2) || v.c === d.N; }, msg: 'Eso es lo que costaría mirar los elementos uno a uno. Partir por la mitad cada vez reduce la lista muchísimo más deprisa.' }],
    hint: function () { return ['Cada comparación divide entre 2 los candidatos que quedan.', '¿Cuántas veces hay que dividir entre 2 para llegar a un solo elemento? Es un [[fn-exp-log|logaritmo]] en base 2.']; },
    steps: function (d) { return ['Con $k$ comparaciones se distinguen hasta $2^k - 1$ posiciones.', '$2^{' + (d.c - 1) + '} - 1 < ' + U.miles(d.N) + ' \\le 2^{' + d.c + '} - 1$, así que hacen falta <strong>' + d.c + '</strong>.', 'Es $O(\\log n)$: multiplicar el tamaño por mil solo añade unas diez comparaciones.']; },
    answer: function (d) { return String(d.c); }
  });

  p.exercise({
    title: 'Verificar una solución',
    level: 'basico',
    gen: function (r) {
      var nums = [], i;
      for (i = 0; i < 7; i++) nums.push(r.int(2, 30));
      var elige = [], s = 0;
      for (i = 0; i < 7; i++) if (r.bool(0.45)) { elige.push(i); s += nums[i]; }
      if (!elige.length) return null;
      var valida = r.bool(0.5), obj = valida ? s : s + r.pm(1, 3);
      return { nums: nums, elige: elige, s: s, obj: obj, ok: valida ? 'si' : 'no' };
    },
    ask: function (d) {
      return 'De la lista $' + d.nums.join(',\\ ') + '$ se busca un grupo de números que sume exactamente $' + d.obj + '$. Alguien propone: $' +
        d.elige.map(function (i) { return d.nums[i]; }).join(' + ') + '$. ¿Cuánto suma la propuesta? ¿Es una solución válida?';
    },
    fields: [{ name: 's', label: 'suma', w: 'tiny' }, { name: 't', label: '¿Válida?', opts: [{ t: 'Sí', v: 'si' }, { t: 'No', v: 'no' }] }],
    sol: function (d) { return { s: d.s, t: d.ok }; },
    hint: function () { return ['Solo hay que sumar y comparar: eso es lo que hace que el problema esté en NP.']; },
    steps: function (d) {
      return ['$' + d.elige.map(function (i) { return d.nums[i]; }).join(' + ') + ' = ' + d.s + '$', d.ok === 'si' ? 'Coincide con el objetivo: la propuesta es válida.' : 'No coincide con ' + d.obj + ': la propuesta no es válida.',
        'Comprobar ha costado unas pocas sumas. Encontrar una solución, en cambio, puede obligar a mirar hasta $2^7 = 128$ grupos, y con 100 números, $2^{100}$.'];
    },
    answer: function (d) { return d.s + '; ' + (d.ok === 'si' ? 'válida' : 'no válida'); }
  });

  p.exercise({
    title: '¿Cuánto tardará con un problema más grande?',
    level: 'medio',
    gen: function (r) {
      var tipo = r.pick(['n2', 'n3', '2n']), t0 = r.pick([1, 2, 5]);
      if (tipo === '2n') { var extra = r.pick([5, 10, 20]); return { tipo: tipo, t0: t0, n0: 30, n1: 30 + extra, t1: t0 * Math.pow(2, extra), mal: t0 * (30 + extra) / 30 }; }
      var k = r.pick([2, 3, 10]), e = tipo === 'n2' ? 2 : 3;
      return { tipo: tipo, t0: t0, n0: 1000, n1: 1000 * k, t1: t0 * Math.pow(k, e), mal: t0 * k };
    },
    ask: function (d) {
      var nombre = { n2: '$O(n^2)$', n3: '$O(n^3)$', '2n': '$O(2^n)$' }[d.tipo];
      return 'Un algoritmo de coste ' + nombre + ' tarda ' + d.t0 + ' segundos con un problema de tamaño $n = ' + U.miles(d.n0) + '$. ¿Cuánto tardará, aproximadamente, con $n = ' + U.miles(d.n1) + '$? (En segundos.)';
    },
    fields: [{ name: 't', label: 'segundos', w: 'wide' }],
    sol: function (d) { return { t: d.t1 }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(d.mal - d.t1) > 1e-6 && Math.abs(v.t - d.mal) < 1e-6; }, msg: 'Eso sería si el coste creciera en proporción a $n$. Aquí el tiempo crece como ' + 'el coste del algoritmo.' }],
    hint: function () { return ['Divide el coste con el tamaño nuevo entre el coste con el tamaño viejo.', 'Con $2^n$, sumar 10 al tamaño multiplica el tiempo por $2^{10}$.']; },
    steps: function (d) {
      if (d.tipo === '2n') return ['$\\dfrac{2^{' + d.n1 + '}}{2^{' + d.n0 + '}} = 2^{' + (d.n1 - d.n0) + '} = ' + U.miles(Math.pow(2, d.n1 - d.n0)) + '$', 'Tiempo: $' + d.t0 + '\\cdot ' + U.miles(Math.pow(2, d.n1 - d.n0)) + ' = ' + U.miles(d.t1) + '$ s.'];
      var k = d.n1 / d.n0, e = d.tipo === 'n2' ? 2 : 3;
      return ['El tamaño se multiplica por ' + k + ', así que el coste por $' + k + '^' + e + ' = ' + Math.pow(k, e) + '$.', 'Tiempo: $' + d.t0 + '\\cdot ' + Math.pow(k, e) + ' = ' + U.miles(d.t1) + '$ s.'];
    },
    answer: function (d) { return U.miles(d.t1) + ' s'; }
  });

  p.keys([
    'El coste de un algoritmo se mide en pasos según el tamaño $n$, y se resume con la notación O, que se queda con el término que manda.',
    'Los costes polinómicos son manejables; los exponenciales y factoriales se vuelven imposibles con tamaños modestos, por rápido que sea el ordenador.',
    'P: problemas que se resuelven en tiempo polinómico. NP: problemas cuyas soluciones se comprueban en tiempo polinómico.',
    'Los problemas NP-completos son los más difíciles de NP: si uno fuera fácil, todos lo serían. Nadie sabe si P = NP.'
  ]);
});
