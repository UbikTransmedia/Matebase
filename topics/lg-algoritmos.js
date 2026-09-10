/* Tema: Pensamiento computacional y algoritmos */
Course.topic('lg-algoritmos', function (p) {

  function mcdPasos(a, b) {
    var pasos = [];
    while (b !== 0) { var r = a % b; pasos.push([a, b, Math.floor(a / b), r]); a = b; b = r; }
    return { mcd: a, pasos: pasos };
  }

  p.puente('En [[lg-problemas]] se buscaba un plan para resolver un problema nuevo. Un algoritmo es lo ' +
    'que queda cuando ese plan se afina tanto que ya no hace falta pensar para ejecutarlo: sirve para ' +
    'todos los problemas del mismo tipo, y lo puede seguir una máquina. Aquí se aprende a leerlos, a ' +
    'ejecutarlos a mano y a compararlos.');

  p.text('Un <strong>algoritmo</strong> es una receta tan precisa que la puede seguir alguien —o algo— ' +
    'que no entiende lo que está haciendo. La división larga que aprendiste en primaria es un algoritmo: ' +
    'se sigue paso a paso sin pensar y siempre da el cociente. El método de [[al-gauss|Gauss]] para ' +
    'resolver sistemas, también. Y el que usa tu móvil para encontrar la ruta más corta.');

  p.text('El <strong>pensamiento computacional</strong> es la manera de mirar un problema que lleva a ' +
    'escribir algoritmos: <em>descomponerlo</em> en partes, <em>reconocer patrones</em> que se repiten, ' +
    '<em>abstraer</em> lo que importa y dejar el resto, y escribir los pasos de forma que no haya ninguna ' +
    'duda. No hace falta un ordenador para practicarlo, y es una de las destrezas que más se piden hoy ' +
    'fuera del aula.');

  /* ---------------------------------------------------------------- */
  p.section('Qué hace falta para que algo sea un algoritmo');

  p.list([
    '<strong>Entrada</strong>: los datos con los que empieza.',
    '<strong>Pasos precisos</strong>: cada instrucción dice exactamente qué hacer, sin interpretación. «Añade sal al gusto» no vale.',
    '<strong>Terminación</strong>: tiene que acabar, para cualquier entrada válida, después de un número finito de pasos.',
    '<strong>Salida</strong>: el resultado que se buscaba.',
    '<strong>Corrección</strong>: que la salida sea de verdad la respuesta. Esto hay que <em>demostrarlo</em>, no basta con probarlo unas cuantas veces.'
  ]);

  p.text('Para escribirlos sin depender de ningún lenguaje de programación se usa el ' +
    '<strong>pseudocódigo</strong>: instrucciones en castellano con cuatro palabras fijas. La flecha ' +
    '$\\leftarrow$ significa «guarda en»: $s \\leftarrow s + 1$ quiere decir «calcula $s + 1$ y guárdalo ' +
    'en $s$», no que $s$ sea igual a $s + 1$, que sería absurdo.');

  p.formula('\\begin{aligned} &s \\leftarrow 0 \\\\ &\\textbf{para } i \\textbf{ desde } 1 \\textbf{ hasta } n: \\\\ &\\quad s \\leftarrow s + i \\\\ &\\textbf{devolver } s \\end{aligned}',
    'un algoritmo en pseudocódigo: la suma de 1 a n',
    'Se lee: <em>«pon s a cero; para cada i desde uno hasta ene, suma i a lo que haya en s; al terminar, ' +
      'devuelve s»</em>.<br><br><strong>Seguir la traza</strong> es ejecutarlo a mano apuntando el valor ' +
      'de cada variable en cada vuelta. Con $n = 4$: $s$ vale 0, 1, 3, 6 y 10. Es la forma de entender un ' +
      'algoritmo, y la forma de encontrar sus errores.');

  p.ejemplo({
    title: 'Seguir una traza con una tabla',
    enunciado: '¿Qué devuelve este algoritmo? $\\begin{aligned} &s \\leftarrow 1 \\\\ &\\textbf{para } i \\textbf{ desde } 1 \\textbf{ hasta } 3: \\\\ &\\quad s \\leftarrow 2s + i \\\\ &\\textbf{devolver } s \\end{aligned}$',
    pasos: [
      { t: 'Se hace una tabla con una columna por variable, $i$ y $s$, y una fila por vuelta. Antes de empezar el bucle, $s = 1$.', antes: '¿Cuánto vale $s$ antes de la primera vuelta?' },
      { t: 'Vuelta $i = 1$: $s \\leftarrow 2\\cdot 1 + 1 = 3$. Se calcula con el $s$ viejo y se guarda el nuevo.', antes: 'Con $s = 1$ e $i = 1$, ¿qué valor se guarda en $s$?' },
      { t: 'Vuelta $i = 2$: $s \\leftarrow 2\\cdot 3 + 2 = 8$.', antes: 'Ahora $s = 3$ e $i = 2$. ¿Qué sale?' },
      { t: 'Vuelta $i = 3$: $s \\leftarrow 2\\cdot 8 + 3 = 19$. El bucle termina porque $i$ ha llegado a 3.' },
      { t: 'Se ejecuta «devolver $s$»: el algoritmo devuelve <strong>19</strong>.' }
    ],
    cierre: 'La tabla es el método: nunca «adivines» qué hace un bucle sin seguir un par de vueltas. Y fíjate en que $s \\leftarrow 2s + i$ no es una ecuación, es una orden: «calcula $2s + i$ con lo que hay y guárdalo en $s$».'
  });

  p.comprueba('En un pseudocódigo aparece la línea $x \\leftarrow x + 1$. ¿Qué significa?', [
    { t: 'Que $x$ es igual a $x + 1$, lo cual es imposible', ok: false, por: 'La flecha no es un igual. Nadie afirma que $x$ sea igual a $x + 1$.' },
    { t: 'Que se calcula $x + 1$ y el resultado se guarda en $x$: $x$ aumenta en uno', ok: true, por: 'Eso es. Es una instrucción, no una ecuación: después de ejecutarla, $x$ vale uno más que antes.' },
    { t: 'Que hay que resolver la ecuación $x = x + 1$', ok: false, por: 'No hay nada que resolver: la flecha ordena, no pregunta.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El algoritmo de Euclides');

  p.text('El algoritmo más antiguo que se sigue usando tal cual. Calcula el [[ar-divisibilidad|máximo ' +
    'común divisor]] de dos números sin descomponerlos en factores, y es tan rápido que funciona con ' +
    'números de cientos de cifras, que es justo lo que necesita la criptografía.');

  p.formula('\\begin{aligned} &\\textbf{mientras } b \\ne 0: \\\\ &\\quad r \\leftarrow a \\bmod b \\\\ &\\quad a \\leftarrow b \\\\ &\\quad b \\leftarrow r \\\\ &\\textbf{devolver } a \\end{aligned}',
    'algoritmo de Euclides',
    '$a \\bmod b$ se lee «a módulo be» y es el resto de dividir $a$ entre $b$.<br><br>Por qué es ' +
      '<strong>correcto</strong>: todo divisor común de $a$ y $b$ lo es también del resto, porque ' +
      '$r = a - q\\,b$. Así que $\\operatorname{mcd}(a, b) = \\operatorname{mcd}(b, r)$, y el problema se ' +
      'va haciendo más pequeño sin cambiar la respuesta.<br><br>Por qué <strong>termina</strong>: el resto ' +
      'es siempre menor que $b$, así que $b$ baja en cada vuelta, y un número natural no puede bajar para ' +
      'siempre. Llega a 0, y entonces el mcd es lo que hay en $a$.');

  p.demo({
    title: 'La traza de Euclides',
    intro: 'Elige dos números y mira cada vuelta del bucle. Fíjate en lo pocas que hacen falta incluso con números grandes.',
    predice: 'Para $a = 1071$ y $b = 462$, ¿cuántas vueltas crees que da el bucle: unas 3, unas 30 o unas 300?',
    build: function (host) {
      var a = 1071, b = 462;
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var r = mcdPasos(a, b);
        var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>vuelta</th><th class="num">a</th><th class="num">b</th><th class="num">cociente</th><th class="num">resto</th></tr></thead><tbody>';
        r.pasos.forEach(function (f, i) {
          h += '<tr><td>' + (i + 1) + '</td><td class="num">' + f[0] + '</td><td class="num">' + f[1] + '</td><td class="num">' + f[2] + '</td><td class="num">' + f[3] + '</td></tr>';
        });
        caja.innerHTML = h + '</tbody></table></div>';
        out.set('$\\operatorname{mcd}(' + a + ',\\ ' + b + ') = ' + r.mcd + '$ en <strong>' + r.pasos.length + '</strong> ' + U.plural(r.pasos.length, 'vuelta', 'vueltas') + '.');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'a', min: 10, max: 5000, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'b', min: 1, max: 5000, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      W.hint(host, 'Prueba dos números seguidos de Fibonacci, como 1597 y 987: son el peor caso posible, y aun así el bucle da muy pocas vueltas.');
      pinta();
    }
  });

  p.comprueba('¿Por qué es seguro que el algoritmo de Euclides termina, sean cuales sean $a$ y $b$?', [
    { t: 'Porque el resto de cada división es menor que el divisor, así que $b$ baja en cada vuelta y no puede bajar para siempre', ok: true, por: 'Un número natural que decrece estrictamente llega a 0 en un número finito de pasos. Ese es todo el argumento.' },
    { t: 'Porque siempre da como mucho tres vueltas', ok: false, por: 'No hay un tope fijo: con dos números de Fibonacci seguidos da muchas vueltas. Lo que garantiza que termina es que $b$ baja siempre.' },
    { t: 'Porque se ha probado con muchos números', ok: false, por: 'Probar casos no demuestra que termine con todos. Hace falta el argumento de que $b$ decrece.' }
  ]);

  p.hist('La palabra <em>algoritmo</em> es el nombre de una persona. Muhammad ibn Musa al-Juarismi fue ' +
    'un matemático persa que trabajó en la Casa de la Sabiduría de Bagdad hacia el año 820. Escribió un ' +
    'libro sobre cómo calcular con las cifras indias, las del cero, que se tradujo al latín con el título ' +
    '<em>Algoritmi de numero Indorum</em>: «Al-Juarismi sobre los números de los indios». Los europeos ' +
    'acabaron llamando «algoritmos» a los procedimientos de cálculo de ese libro. De otro libro suyo, ' +
    '<em>al-jabr</em>, viene la palabra álgebra.');

  /* ---------------------------------------------------------------- */
  p.section('Búsqueda binaria: partir por la mitad');

  p.text('Para encontrar una palabra en un diccionario no se lee página por página: se abre por la mitad, ' +
    'se mira si la palabra está antes o después, y se descarta la mitad que sobra. Esa idea, repetida, ' +
    'encuentra cualquier cosa entre mil en diez preguntas y entre un millón en veinte. Es la misma de la ' +
    'bisección que aparece en [[fn-continuidad]].');

  p.demo({
    title: 'Te adivino el número',
    intro: 'Piensa un número entero del 1 al 100, sin decirlo. Contesta a cada propuesta y el algoritmo lo encontrará en 7 preguntas como mucho.',
    build: function (host) {
      var lo, hi, g, n;
      var out = W.readout(host, '');
      function nueva() { lo = 1; hi = 100; n = 0; propone(); }
      function propone() {
        if (lo > hi) { out.set('<strong style="color:var(--bad)">Alguna respuesta no cuadra:</strong> no queda ningún número posible. Vuelve a empezar.'); return; }
        g = Math.floor((lo + hi) / 2); n++;
        out.set('Pregunta ' + n + ': ¿es <strong>' + g + '</strong>? &nbsp;<span style="color:var(--ink-faint)">(quedan posibles los números del ' + lo + ' al ' + hi + ': ' + (hi - lo + 1) + ')</span>');
      }
      W.buttons(host, [
        { t: 'Es mayor', on: function () { lo = g + 1; propone(); } },
        { t: 'Es menor', on: function () { hi = g - 1; propone(); } },
        { t: '¡Es ese!', cls: 'btn--main', on: function () { out.set('Encontrado en <strong>' + n + '</strong> ' + U.plural(n, 'pregunta', 'preguntas') + '. Con 100 números nunca hacen falta más de 7, porque $2^7 = 128 \\ge 100$.'); } },
        { t: '↺ Otra vez', on: nueva }
      ]);
      nueva();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El coste de un algoritmo');

  p.text('Dos algoritmos correctos pueden ser muy distintos en rapidez, y la diferencia no se nota con ' +
    'datos pequeños sino con datos grandes. Por eso se mide el coste contando cuántas operaciones hace ' +
    'en función del tamaño $n$ de la entrada:');

  p.table(['$n$', 'búsqueda de uno en uno ($n$)', 'búsqueda binaria ($\\approx\\log_2 n$)', 'comparar todos con todos ($\\approx n^2$)'],
    [['10', '10', '4', '100'],
     ['1000', '1000', '10', '1 000 000'],
     ['1 000 000', '1 000 000', '20', '$10^{12}$']], { num: [0, 1, 2, 3] });

  p.text('Con un millón de datos, un algoritmo de coste $n^2$ hace un billón de operaciones, y uno ' +
    'logarítmico, veinte. Ninguna mejora del ordenador compensa elegir mal el algoritmo. La pregunta de ' +
    'qué problemas tienen algoritmos rápidos y cuáles no es uno de los grandes misterios abiertos de las ' +
    'matemáticas, y se cuenta en [[av-complejidad]].');

  p.util('Cuando buscas un contacto en el móvil, el teléfono no mira los mil nombres uno a uno: están ' +
    'ordenados y hace una búsqueda binaria. Los navegadores GPS calculan la ruta más corta entre ' +
    'millones de cruces con el algoritmo de Dijkstra, que se ve en [[av-grafos]]. Las fotos se comprimen ' +
    'con algoritmos que se basan en las ondas de [[av-fourier]], y cada conexión segura de internet ' +
    'ejecuta el algoritmo de Euclides con números de cientos de cifras. En el examen, lo que se pide es ' +
    'más modesto pero es lo mismo: leer un algoritmo, seguir su traza y decir qué hace.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Seguir la traza de un bucle',
    level: 'basico',
    gen: function (r) {
      var fam = r.int(0, 2), n = r.int(4, 8), k = r.int(2, 5), s = 0, i, cod;
      if (fam === 0) {
        for (i = 1; i <= n; i++) s = s + k * i;
        cod = '\\begin{aligned} &s \\leftarrow 0 \\\\ &\\textbf{para } i \\textbf{ desde } 1 \\textbf{ hasta } ' + n + ': \\\\ &\\quad s \\leftarrow s + ' + k + '\\cdot i \\\\ &\\textbf{devolver } s \\end{aligned}';
      } else if (fam === 1) {
        s = 1;
        for (i = 1; i <= n; i++) s = s * 2 + (i % 2);
        cod = '\\begin{aligned} &s \\leftarrow 1 \\\\ &\\textbf{para } i \\textbf{ desde } 1 \\textbf{ hasta } ' + n + ': \\\\ &\\quad s \\leftarrow 2s + (i \\bmod 2) \\\\ &\\textbf{devolver } s \\end{aligned}';
      } else {
        s = 0; var x = k * 10 + n;
        while (x > 0) { s = s + (x % 10); x = Math.floor(x / 10); }
        var ent = k * 10 + n;
        cod = '\\begin{aligned} &x \\leftarrow ' + ent + ',\\ s \\leftarrow 0 \\\\ &\\textbf{mientras } x > 0: \\\\ &\\quad s \\leftarrow s + (x \\bmod 10) \\\\ &\\quad x \\leftarrow \\lfloor x / 10 \\rfloor \\\\ &\\textbf{devolver } s \\end{aligned}';
      }
      return { fam: fam, cod: cod, s: s, n: n, k: k };
    },
    ask: function (d) { return '¿Qué valor devuelve este algoritmo?<br>$' + d.cod + '$'; },
    fields: [{ name: 's', label: 'devuelve', w: 'tiny' }],
    sol: function (d) { return { s: d.s }; },
    hint: function () { return ['Haz una tabla con una columna por variable y apunta su valor al final de cada vuelta.', 'Recuerda que $\\leftarrow$ guarda en la variable el valor calculado con lo que tenía antes.']; },
    steps: function (d) {
      return [['Se van sumando $' + d.k + '\\cdot 1, ' + d.k + '\\cdot 2, \\ldots, ' + d.k + '\\cdot ' + d.n + '$: total $' + d.k + '\\cdot\\frac{' + d.n + '\\cdot' + (d.n + 1) + '}{2} = ' + d.s + '$.',
        'En cada vuelta se duplica y se suma 1 si la vuelta es impar. Siguiendo la traza sale $' + d.s + '$.',
        'Suma las cifras del número: $' + d.s + '$.'][d.fam]];
    },
    answer: function (d) { return String(d.s); }
  });

  p.exercise({
    title: 'Euclides a mano',
    level: 'medio',
    gen: function (r) {
      var g = r.int(2, 15), a = g * r.int(5, 40), b = g * r.int(3, 30);
      if (a === b) return null;
      if (a < b) { var t = a; a = b; b = t; }
      var res = mcdPasos(a, b);
      return { a: a, b: b, mcd: res.mcd, vueltas: res.pasos.length, pasos: res.pasos };
    },
    ask: function (d) { return 'Aplica el algoritmo de Euclides a $a = ' + d.a + '$ y $b = ' + d.b + '$. ¿Cuál es el mcd y cuántas divisiones hacen falta?'; },
    fields: [{ name: 'm', label: 'mcd', w: 'tiny' }, { name: 'n', label: 'divisiones', w: 'tiny' }],
    sol: function (d) { return { m: d.mcd, n: d.vueltas }; },
    hint: function () { return ['Divide $a$ entre $b$ y quédate con el resto.', 'Ahora el divisor pasa a ser el dividendo y el resto el divisor. Repite hasta que el resto sea 0: el último divisor es el mcd.']; },
    steps: function (d) {
      return d.pasos.map(function (f) { return '$' + f[0] + ' = ' + f[2] + '\\cdot ' + f[1] + ' + ' + f[3] + '$'; })
        .concat(['El último resto no nulo, y por tanto el mcd, es $' + d.mcd + '$, tras ' + d.vueltas + ' divisiones.']);
    },
    answer: function (d) { return 'mcd = ' + d.mcd + ', ' + d.vueltas + ' divisiones'; }
  });

  p.exercise({
    title: 'Cuántas preguntas como mucho',
    level: 'medio',
    gen: function (r) {
      var N = r.pick([50, 100, 200, 500, 1000, 5000, 100000, 1000000]);
      return { N: N, v: Math.floor(Math.log(N) / Math.LN2) + 1 };
    },
    ask: function (d) { return 'Con búsqueda binaria en una lista ordenada de $' + U.miles(d.N) + '$ elementos, ¿cuántas comparaciones hacen falta, como máximo, para encontrar uno?'; },
    fields: [{ name: 'v', label: 'comparaciones', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{ si: function (v, d) { return v.v === d.N || v.v === Math.round(d.N / 2); }, msg: 'Eso sería buscar de uno en uno. La binaria descarta la mitad en cada comparación.' }],
    hint: function (d) { return ['Cada comparación divide por dos lo que queda.', 'Busca la menor potencia de 2 que supera a $' + U.miles(d.N) + '$.']; },
    steps: function (d) { return ['$2^{' + (d.v - 1) + '} = ' + U.miles(Math.pow(2, d.v - 1)) + '$ y $2^{' + d.v + '} = ' + U.miles(Math.pow(2, d.v)) + '$.', 'Hacen falta como mucho $' + d.v + '$ comparaciones.']; },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: '¿Termina?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        function () { var x = 2 * r.int(2, 9) + 1; return { cod: '\\begin{aligned} &x \\leftarrow ' + x + ' \\\\ &\\textbf{mientras } x \\ne 0: \\\\ &\\quad x \\leftarrow x - 2 \\end{aligned}', ok: 'no', por: 'Empieza en impar y resta de 2 en 2: pasa por 1, −1, −3… y nunca vale 0 exactamente.' }; },
        function () { var x = 2 * r.int(2, 9); return { cod: '\\begin{aligned} &x \\leftarrow ' + x + ' \\\\ &\\textbf{mientras } x \\ne 0: \\\\ &\\quad x \\leftarrow x - 2 \\end{aligned}', ok: 'si', por: 'Empieza en par y resta de 2 en 2: llega a 0 en ' + (x / 2) + ' vueltas.' }; },
        function () { var x = r.int(20, 90); return { cod: '\\begin{aligned} &x \\leftarrow ' + x + ' \\\\ &\\textbf{mientras } x > 1: \\\\ &\\quad x \\leftarrow \\lfloor x / 2 \\rfloor \\end{aligned}', ok: 'si', por: 'Cada vuelta divide por 2 (redondeando hacia abajo): un natural que no para de bajar llega a 1.' }; },
        function () { var x = r.int(2, 9); return { cod: '\\begin{aligned} &x \\leftarrow ' + x + ' \\\\ &\\textbf{mientras } x > 0: \\\\ &\\quad x \\leftarrow x + 1 \\end{aligned}', ok: 'no', por: '$x$ empieza positivo y crece: la condición se cumple siempre.' }; }
      ];
      return r.pick(casos)();
    },
    ask: function (d) { return '¿Termina este algoritmo?<br>$' + d.cod + '$'; },
    fields: [{ name: 't', label: 'Respuesta', opts: [{ t: 'Sí, termina', v: 'si' }, { t: 'No, se queda dando vueltas para siempre', v: 'no' }] }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return ['Sigue la traza unas cuantas vueltas.', 'Pregúntate: ¿hay alguna cantidad que se acerque a la condición de parada en cada vuelta, sin poder saltársela?']; },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return d.ok === 'si' ? 'Termina' : 'No termina'; }
  });

  p.problem({
    title: 'Un algoritmo misterioso',
    level: 'avanzado',
    gen: function (r) {
      var x = r.int(6, 60), s = 0, y = x, cifras = [];
      while (y > 0) { cifras.push(y % 2); s++; y = Math.floor(y / 2); }
      return { x: x, s: s, bin: cifras.reverse().join('') };
    },
    intro: function () {
      return 'Se considera el algoritmo: $\\begin{aligned} &s \\leftarrow 0 \\\\ &\\textbf{mientras } x > 0: \\\\ &\\quad x \\leftarrow \\lfloor x / 2 \\rfloor \\\\ &\\quad s \\leftarrow s + 1 \\\\ &\\textbf{devolver } s \\end{aligned}$';
    },
    partes: [
      {
        ask: function (d) { return 'Sigue la traza con $x = ' + d.x + '$. ¿Qué devuelve?'; },
        fields: [{ name: 's', label: 'devuelve', w: 'tiny' }],
        sol: function (d) { return { s: d.s }; },
        hint: function () { return 'Apunta $x$ y $s$ en cada vuelta hasta que $x$ llegue a 0.'; },
        steps: function (d) {
          var y = d.x, t = [];
          while (y > 0) { var z = Math.floor(y / 2); t.push(y + ' \\to ' + z); y = z; }
          return ['$x$: $' + t.join(',\\ ') + '$', 'Da $' + d.s + '$ vueltas: devuelve $' + d.s + '$.'];
        },
        answer: function (d) { return String(d.s); }
      },
      {
        ask: function () { return '¿Qué calcula en general este algoritmo?'; },
        fields: [{
          name: 't', label: 'Calcula', opts: [
            { t: 'el número de cifras de x escrito en binario', v: 'bin' },
            { t: 'la mitad de x', v: 'mitad' },
            { t: 'el número de cifras de x en base 10', v: 'dec' },
            { t: 'cuántas veces es x divisible entre 2', v: 'div' }]
        }],
        sol: function () { return { t: 'bin' }; },
        errores: [{ si: function (v) { return v.raw.t === 'div'; }, msg: 'No mira si la división es exacta: sigue dividiendo aunque haya resto, hasta llegar a 0.' }],
        hint: function (d) { return ['Dividir entre 2 y quedarse con la parte entera es quitar la última cifra en binario.', 'En binario, ' + d.x + ' se escribe ' + d.bin + '.']; },
        steps: function (d) { return ['Cada división entera entre 2 borra la última cifra binaria.', 'Se cuentan las vueltas hasta borrarlas todas: es el número de cifras en binario. $' + d.x + ' = ' + d.bin + '_2$, con $' + d.s + '$ cifras.']; },
        answer: function () { return 'Cifras en binario'; }
      }
    ]
  });

  p.keys([
    'Un algoritmo tiene entrada, pasos precisos, salida, y además tiene que <strong>terminar</strong> y ser <strong>correcto</strong>.',
    'En pseudocódigo, $\\leftarrow$ significa «guarda en»: $s \\leftarrow s + 1$ no es una ecuación.',
    'Seguir la traza es ejecutarlo a mano con una tabla: así se entiende y así se depura.',
    'Euclides: $\\operatorname{mcd}(a, b) = \\operatorname{mcd}(b, a \\bmod b)$; termina porque el resto siempre baja.',
    'Búsqueda binaria: partir por la mitad; $n$ elementos se recorren en unas $\\log_2 n$ comparaciones.',
    'El coste importa más que la potencia del ordenador: $n^2$ frente a $\\log_2 n$ es un billón frente a veinte.'
  ]);
});
