/* Tema: Convolución: el filtro que se desliza */
Course.topic('av-convolucion', function (p) {

  p.puente('En [[cib-filtrado|predicción y filtrado]] se suavizó una señal ruidosa con una media móvil, ' +
    'y en [[av-fourier|Fourier]] se descompuso una señal en ondas puras. Este tema enseña que las dos ' +
    'cosas son la misma operación vista de dos maneras, y le pone nombre: <strong>convolución</strong>. ' +
    'Hace falta la [[fn-integral-def|integral]] para la versión continua y la ' +
    '[[fn-derivadas|derivada]] para entender por qué un núcleo detecta bordes.');

  p.text('Suavizar una curva de contagios, desenfocar una foto, encontrar los bordes de una imagen, ' +
    'poner reverberación a un sonido y la primera capa de una red que reconoce dígitos son, por ' +
    'dentro, <strong>la misma cuenta</strong>: deslizar una lista pequeña de números sobre una lista ' +
    'grande, multiplicando y sumando en cada posición. Esa lista pequeña se llama <strong>núcleo</strong>, ' +
    'y lo que hace el filtro depende solo de qué números tenga.');

  /* ---------------------------------------------------------------- */
  p.section('Deslizar un núcleo');

  p.text('Empecemos en una dimensión, con una señal que es una lista de números. Se coge el núcleo, se ' +
    'coloca encima de la señal en una posición, se multiplican los números que quedan enfrentados, se ' +
    'suman, y ese es el valor de salida en esa posición. Después se desliza el núcleo un paso y se ' +
    'repite. Nada más.');

  p.formula('(f * g)[n] = \\sum_{k} f[n - k]\\; g[k]',
    'convolución discreta',
    'Se lee: <em>«efe convolucionada con ge, en la posición ene, es el sumatorio en ka de efe de ene ' +
    'menos ka por ge de ka»</em>. El asterisco $*$ es el símbolo de la convolución, y no tiene nada ' +
    'que ver con la multiplicación.<br><br>Fíjate en el $n - k$: el núcleo se recorre <strong>al ' +
    'revés</strong> respecto de la señal. Esa vuelta es lo que distingue la convolución de su hermana ' +
    'la correlación, que usa $n + k$, y se explica más abajo.<br><br>La versión continua cambia la ' +
    'suma por una integral: $(f * g)(t) = \\int f(t - s)\\,g(s)\\,ds$.');

  p.demo({
    title: 'Un núcleo deslizándose sobre una señal',
    intro: 'Arriba, una señal con ruido; abajo, el resultado de pasarle el núcleo. Mueve la posición para ver la ventana en la que se está multiplicando y sumando ahora mismo, y cambia de núcleo para ver que la misma operación suaviza o detecta bordes según los números que lleve.',
    predice: 'El núcleo de la media móvil tiene todos los pesos positivos y suman 1. El de la derivada es $(-1, 0, 1)$ y suman 0. ¿Cuál de los dos crees que dejará la salida cerca de cero en los tramos lisos de la señal?',
    build: function (host) {
      var cual = 'media3', pos = 12;
      var r = U.rng(23), señal = [], i;
      for (i = 0; i < 40; i++) {
        var base = (i < 14 ? 1 : (i < 26 ? 3.2 : 1.8));
        señal.push(base + r.real(-0.45, 0.45, 3));
      }
      var nucleos = {
        media3: { k: [1 / 3, 1 / 3, 1 / 3], t: 'media móvil de 3', n: 'Todos los pesos iguales y suman 1: es un promedio, y suaviza.' },
        media7: { k: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7], t: 'media móvil de 7', n: 'Más ancho: suaviza más, pero también redondea los escalones de verdad. Ese es el precio.' },
        gauss: { k: [1 / 16, 4 / 16, 6 / 16, 4 / 16, 1 / 16], t: 'gaussiana', n: 'Pesa más el centro que los extremos: suaviza sin emborronar tanto como la media.' },
        deriv: { k: [-1, 0, 1], t: 'derivada (−1, 0, 1)', n: 'Los pesos suman 0: en los tramos lisos la salida es casi cero, y solo salta donde la señal cambia. Es una derivada por diferencias.' }
      };
      var out = W.readout(host, '');
      function convoluciona(k) {
        var m = k.length, res = [], j, q;
        for (j = 0; j + m <= señal.length; j++) {
          var s = 0;
          for (q = 0; q < m; q++) s += señal[j + q] * k[m - 1 - q];   // núcleo al revés
          res.push(s);
        }
        return res;
      }
      var plot = W.plot(host, {
        xmin: -1, xmax: 41, ymin: -2.6, ymax: 4.4, height: 320,
        xlabel: 'posición', ylabel: 'valor',
        aria: 'Una señal con ruido y, debajo, el resultado de convolucionarla con el núcleo elegido',
        draw: function (g) {
          var N = nucleos[cual], res = convoluciona(N.k), m = N.k.length;
          var pp = Math.min(pos, señal.length - m);
          g.hline(0, { color: 'axis', w: 1 });
          /* la ventana en la que se está operando ahora */
          g.rect(pp - 0.5, -2.6, m, 7, { color: 3, fill: 3, fillAlpha: 0.16, w: 0 });
          g.path(señal.map(function (v, j) { return [j, v]; }), { color: 0, w: 2 });
          señal.forEach(function (v, j) { g.point(j, v, { color: 0, r: 2 }); });
          g.path(res.map(function (v, j) { return [j + (m - 1) / 2, v - 1.6]; }), { color: 2, w: 2.4 });
          g.text(0.5, 4.1, 'señal', { color: 0, size: 12 });
          g.text(0.5, -2.2, 'salida (desplazada para verla)', { color: 2, size: 12 });
        }
      });
      function pinta() {
        var N = nucleos[cual], m = N.k.length, res = convoluciona(N.k);
        var pp = Math.min(pos, señal.length - m), q;
        var cuenta = [];
        for (q = 0; q < m; q++) {
          cuenta.push(U.fmt(señal[pp + q], 2) + '·' + U.fmt(N.k[m - 1 - q], 3));
        }
        out.set('<strong>' + N.t + '</strong>: núcleo $(' + N.k.map(function (v) { return U.fmt(v, 3); }).join(',\\ ') + ')$, suma ' +
          U.fmt(N.k.reduce(function (a, b) { return a + b; }, 0), 3) + '<br>' +
          'En la posición ' + pp + ': $' + cuenta.join(' + ') + ' = ' + U.fmt(res[pp], 3) + '$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' + N.n + '</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'media móvil 3', value: 'media3' }, { label: 'media móvil 7', value: 'media7' },
        { label: 'gaussiana', value: 'gauss' }, { label: 'derivada', value: 'deriv' }
      ], { value: 'media3', on: function (v) { cual = v; pinta(); } });
      W.slider(W.row(host), {
        label: 'posición del núcleo', min: 0, max: 36, step: 1, value: 12, dec: 0,
        on: function (v) { pos = v; pinta(); }
      });
      pinta();
    }
  });

  p.text('La demo enseña la regla entera del tema, y cabe en dos líneas:');

  p.list([
    'Si los pesos del núcleo <strong>suman 1</strong>, el filtro es un promedio: <strong>suaviza</strong>, y deja los tramos lisos como estaban.',
    'Si los pesos <strong>suman 0</strong>, el filtro es una diferencia: <strong>detecta cambios</strong>, y deja los tramos lisos en cero.'
  ]);

  p.text('El segundo caso es una derivada disfrazada. El núcleo $(-1, 0, 1)$ calcula $f[n+1] - f[n-1]$, ' +
    'que es justo el numerador del cociente incremental de [[fn-derivadas|la derivada]]: mide cuánto ' +
    'cambia la señal alrededor de ese punto. Por eso un filtro de bordes y una derivada son lo mismo.');

  p.ejemplo({
    title: 'Una convolución a mano',
    enunciado: 'Convolucionar la señal $f = (1,\\ 3,\\ 5,\\ 4,\\ 2)$ con el núcleo $g = (-1,\\ 0,\\ 1)$, sin salirse de la señal.',
    pasos: [
      { t: '<strong>Dar la vuelta al núcleo.</strong> La convolución recorre el núcleo al revés: $(-1, 0, 1)$ invertido es $(1, 0, -1)$. Es lo que dice el $n-k$ de la fórmula.', antes: '¿Qué le hace la fórmula al núcleo antes de multiplicar?' },
      { t: '<strong>Primera posición.</strong> El núcleo invertido se enfrenta a $(1, 3, 5)$: $1\\cdot 1 + 3\\cdot 0 + 5\\cdot(-1) = 1 - 5 = -4$.', antes: 'Multiplica uno a uno y suma. ¿Cuánto sale?' },
      { t: '<strong>Segunda posición.</strong> Ahora enfrente está $(3, 5, 4)$: $3 - 4 = -1$.', antes: 'Desliza un paso y repite.' },
      { t: '<strong>Tercera posición.</strong> Enfrente, $(5, 4, 2)$: $5 - 2 = 3$.' },
      { t: '<strong>Resultado.</strong> $f * g = (-4,\\ -1,\\ 3)$. De cinco números salen tres: con un núcleo de 3 sin salirse, la salida mide $5 - 3 + 1 = 3$. Y fíjate en el signo: negativo donde la señal sube y positivo donde baja, porque el núcleo invertido resta lo de delante.', antes: '¿Cuántos números tiene la salida, y por qué menos que la entrada?' }
    ],
    cierre: 'Los tres números dicen dónde cambia la señal y en qué sentido. Donde la señal fuera plana saldría cero, porque los pesos del núcleo suman cero.'
  });

  p.comprueba('Quieres quitarle ruido a una curva de contagios sin cambiar su nivel. ¿Qué núcleo eliges?', [
    { t: 'Uno con todos los pesos positivos y que sumen 1, como $(\\frac14, \\frac12, \\frac14)$', ok: true, por: 'Que sumen 1 garantiza que un tramo constante salga igual que entró: si la curva valiera 100 durante días, la salida también valdría 100. Y que sean positivos hace que sea un promedio, que es lo que quita ruido.' },
    { t: 'Uno cuyos pesos sumen 0, como $(-1, 0, 1)$', ok: false, por: 'Ese detecta cambios, no suaviza: un tramo constante saldría en cero. Te daría la velocidad de la curva, no la curva limpia.' },
    { t: 'Uno con un solo peso muy grande, como $(0, 5, 0)$', ok: false, por: 'No mezcla con los vecinos, así que no quita nada de ruido: solo multiplica la señal por 5, cambiando el nivel que querías conservar.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('En dos dimensiones es exactamente lo mismo');

  p.text('Sobre una imagen, el núcleo pasa de ser una lista a ser una tabla pequeña, normalmente de ' +
    '$3\\times 3$, y en vez de deslizarse a lo largo se desliza por filas y columnas. En cada posición ' +
    'se multiplican los nueve números por los nueve píxeles que tiene debajo y se suman. La regla de ' +
    'antes sigue valiendo palabra por palabra: si los pesos suman 1 desenfoca, y si suman 0 saca los ' +
    'bordes.');

  p.formula('(f * g)[i, j] = \\sum_{u}\\sum_{v} f[i - u,\\ j - v]\\; g[u, v]',
    'convolución en dos dimensiones',
    'Se lee: <em>«efe convolucionada con ge en la fila i, columna j, es la doble suma en u y en uve de ' +
    'efe de i menos u, jota menos uve, por ge de u, uve»</em>.<br><br>Es la misma fórmula de antes con ' +
    'un índice más. Y el tamaño de la salida sigue la misma regla: con una imagen de $H \\times W$ y un ' +
    'núcleo de $k \\times k$, sin salirse, salen $(H - k + 1) \\times (W - k + 1)$ píxeles.');

  p.demo({
    title: 'La ventana que recorre la imagen',
    intro: 'A la izquierda, una imagen pequeña; a la derecha, el resultado. El recuadro marca los nueve píxeles que se están multiplicando y sumando ahora mismo, y debajo aparece la cuenta entera. Mueve la posición y cambia de núcleo.',
    predice: 'La imagen tiene un cuadrado claro sobre fondo oscuro. Con el núcleo de bordes, ¿dónde saldrán los valores grandes: dentro del cuadrado, en el fondo, o solo en el contorno?',
    build: function (host) {
      var cual = 'bordes', px = 3, py = 3, N = 12;
      var img = [], i, j;
      for (i = 0; i < N; i++) {
        img.push([]);
        for (j = 0; j < N; j++) {
          var dentro = (i >= 3 && i <= 8 && j >= 3 && j <= 8);
          img[i].push(dentro ? 0.9 : 0.15);
        }
      }
      var nucleos = {
        desenfoque: { k: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]], t: 'desenfoque (suman 1)' },
        bordes: { k: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]], t: 'bordes (suman 0)' },
        nitidez: { k: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], t: 'nitidez (suman 1)' },
        sobelx: { k: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], t: 'Sobel vertical (suman 0)' }
      };
      var out = W.readout(host, '');
      function conv() {
        var k = nucleos[cual].k, res = [], a, b, u, v;
        for (a = 0; a < N - 2; a++) {
          res.push([]);
          for (b = 0; b < N - 2; b++) {
            var s = 0;
            for (u = 0; u < 3; u++) for (v = 0; v < 3; v++) s += img[a + u][b + v] * k[2 - u][2 - v];
            res[a].push(s);
          }
        }
        return res;
      }
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 25.5, ymin: -1.5, ymax: 12.5, height: 320, equal: true,
        grid: false, axes: false,
        aria: 'Una imagen pequeña y el resultado de aplicarle un núcleo de convolución, con la ventana de tres por tres marcada',
        draw: function (g) {
          var res = conv(), a, b;
          function celda(x, y, val, lim) {
            var t = U.clamp((val + lim) / (2 * lim), 0, 1);
            g.rect(x, y, 1, 1, { color: 'ink', fill: 'ink', fillAlpha: t * 0.92, w: 0.4, alpha: 0.35 });
          }
          for (a = 0; a < N; a++) for (b = 0; b < N; b++) celda(b, N - 1 - a, img[a][b], 1);
          for (a = 0; a < N - 2; a++) for (b = 0; b < N - 2; b++) celda(14 + b, N - 2 - a, res[a][b], cual === 'bordes' || cual === 'sobelx' ? 2 : 1);
          g.rect(px, N - 3 - py + 1 - 1 + 1, 3, 3, { color: 2, fill: false, w: 2.6 });
          g.rect(14 + px, N - 2 - py, 1, 1, { color: 2, fill: false, w: 2.6 });
          g.text(0, -0.9, 'imagen', { color: 'ink', size: 12.5 });
          g.text(14, -0.9, 'salida', { color: 2, size: 12.5 });
        }
      });
      function pinta() {
        var k = nucleos[cual].k, res = conv(), u, v, trozos = [];
        for (u = 0; u < 3; u++) {
          for (v = 0; v < 3; v++) {
            if (k[2 - u][2 - v] !== 0) trozos.push(U.fmt(img[py + u][px + v], 2) + '·' + U.fmt(k[2 - u][2 - v], 2));
          }
        }
        out.set('<strong>' + nucleos[cual].t + '</strong> &nbsp;·&nbsp; ventana en la fila ' + py + ', columna ' + px + '<br>' +
          '$' + trozos.join(' + ') + ' = ' + U.fmt(res[py][px], 3) + '$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">De una imagen de ' + N + '×' + N +
          ' con un núcleo de 3×3 salen ' + (N - 2) + '×' + (N - 2) + ' píxeles: el núcleo no puede ' +
          'asomarse fuera, así que se pierde un píxel por cada borde.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'desenfoque', value: 'desenfoque' }, { label: 'bordes', value: 'bordes' },
        { label: 'nitidez', value: 'nitidez' }, { label: 'Sobel vertical', value: 'sobelx' }
      ], { value: 'bordes', on: function (v) { cual = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'columna', min: 0, max: 9, step: 1, value: 3, dec: 0, on: function (v) { px = v; pinta(); } });
      W.slider(fila, { label: 'fila', min: 0, max: 9, step: 1, value: 3, dec: 0, on: function (v) { py = v; pinta(); } });
      pinta();
    }
  });

  p.note('Casi nadie da la vuelta al núcleo en la práctica. Lo que hacen las bibliotecas de imagen y las ' +
    'redes neuronales es la <strong>correlación cruzada</strong>, que es lo mismo sin invertir. Da ' +
    'igual cuando el núcleo es simétrico —un desenfoque lo es— y cambia el signo cuando no lo es, como ' +
    'en el de bordes. Y en una red da exactamente igual, porque los números del núcleo se aprenden: si ' +
    'hiciera falta invertirlos, los aprendería invertidos. Conviene saberlo para no volverse loco ' +
    'comparando fórmulas de sitios distintos.', 'warn', 'La vuelta que casi nadie da');

  /* ---------------------------------------------------------------- */
  p.section('El teorema de convolución');

  p.text('Y ahora la conexión con [[av-fourier|Fourier]], que es el resultado que hace de la convolución ' +
    'una idea grande y no solo un truco de programación. Convolucionar dos señales es una cuenta larga: ' +
    'con una señal de $n$ números y un núcleo de $m$, cuesta del orden de $n\\cdot m$ multiplicaciones. ' +
    'Pero en el mundo de las frecuencias se convierte en algo ridículamente simple.');

  p.formula('\\mathcal{F}(f * g) = \\mathcal{F}(f)\\cdot \\mathcal{F}(g)',
    'el teorema de convolución',
    'Se lee: <em>«la transformada de efe convolucionada con ge es la transformada de efe por la ' +
    'transformada de ge»</em>. La $\\mathcal{F}$ caligráfica es «la transformada de Fourier de».<br><br>' +
    'Dicho en cristiano: <strong>convolucionar en el tiempo es multiplicar en la frecuencia</strong>. ' +
    'La operación complicada se vuelve un producto número a número.');

  p.text('Eso explica de golpe por qué los filtros hacen lo que hacen. Un núcleo suavizante tiene una ' +
    'transformada que vale casi 1 en las frecuencias bajas y casi 0 en las altas: al multiplicar, deja ' +
    'pasar lo lento y borra lo rápido, que es justo el ruido. Por eso se llama <em>filtro de paso ' +
    'bajo</em>. Y el núcleo de la derivada hace lo contrario: mata las bajas y amplifica las altas.');

  p.util('Que se pueda hacer con una multiplicación tiene consecuencias muy prácticas. Una reverberación ' +
    'de audio es la convolución del sonido con la respuesta de una sala —se graba un chasquido en una ' +
    'catedral y a partir de ahí cualquier grabación puede sonar como si estuviera allí—, y se calcula ' +
    'por Fourier porque hacerlo directamente no daría tiempo real. Lo mismo pasa con el desenfoque de ' +
    'las fotos de tu móvil, con la limpieza de las curvas de una epidemia y con los telescopios, que ' +
    'recuperan la imagen real deshaciendo la convolución que introduce la atmósfera. Y la primera capa ' +
    'de una red que mira imágenes es esta operación con los números del núcleo aprendidos en vez de ' +
    'elegidos a mano.');

  p.hist('La palabra alemana original era <em>Faltung</em>, «plegado», por esa vuelta que se le da al ' +
    'núcleo, y el término inglés <em>convolution</em> no se impuso hasta los años treinta. La operación ' +
    'aparece ya en trabajos de d\'Alembert y de Laplace sobre series, en el siglo XVIII. Lo que la ' +
    'convirtió en una herramienta cotidiana fue el algoritmo de la transformada rápida de Fourier que ' +
    'Cooley y Tukey publicaron en 1965: con él, el teorema de convolución dejó de ser una curiosidad ' +
    'teórica y pasó a ser la manera normal de filtrar cualquier cosa.');

  p.trampas([
    { e: 'Olvidar normalizar un núcleo suavizante', por: 'Con la caja de nueve unos sin dividir entre 9, una zona lisa de valor 0,2 sale 1,8: blanco quemado. Los pesos de un promedio tienen que sumar 1.' },
    { e: 'Esperar que la salida mida lo mismo que la entrada', por: 'Con un núcleo de 3 sin salirse, de 40 números salen 38, y de una imagen de 12×12 salen 10×10. Para conservar el tamaño hay que rellenar los bordes, y entonces hay que decidir con qué.' },
    { e: 'Confundir convolución con correlación', por: 'La convolución invierte el núcleo y la correlación no. Con $(-1,0,1)$ los resultados salen con el signo cambiado; con un núcleo simétrico, idénticos.' },
    { e: 'Creer que suavizar más es siempre mejor', por: 'La media móvil de 7 de la demo redondea también los escalones de verdad. Se quita ruido a cambio de emborronar lo que sí era información.' },
    { e: 'Pensar que el teorema de convolución es una aproximación', por: 'Es una igualdad exacta. Lo que aproxima, y poco, es el cálculo numérico de la transformada.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El tamaño de la salida',
    level: 'basico',
    gen: function (r) {
      var n = r.int(20, 200), k = r.pick([3, 5, 7, 9, 11]);
      return { n: n, k: k, salida: n - k + 1 };
    },
    ask: function (d) {
      return 'Se convoluciona una señal de $' + d.n + '$ números con un núcleo de $' + d.k +
        '$, sin dejar que el núcleo se asome fuera. ¿Cuántos números tiene la salida?';
    },
    fields: [{ name: 's', label: 'números', w: 'tiny' }],
    sol: function (d) { return { s: d.salida }; },
    errores: [{ si: function (v, d) { return v.s === d.n; }, msg: 'La salida es más corta: el núcleo no puede salirse de la señal, así que se pierden posiciones en los dos extremos.' }],
    hint: function () { return 'El núcleo tiene que caber entero. Cuenta cuántas posiciones distintas puede ocupar.'; },
    steps: function (d) {
      return ['$' + d.n + ' - ' + d.k + ' + 1 = ' + d.salida + '$.',
        'Se pierden $' + (d.k - 1) + '$ posiciones, la mitad por cada extremo.'];
    },
    answer: function (d) { return String(d.salida); }
  });

  p.exercise({
    title: 'Un valor de la convolución',
    level: 'basico',
    gen: function (r) {
      var f = [], i;
      for (i = 0; i < 3; i++) f.push(r.int(1, 9));
      var g = r.pick([[1 / 3, 1 / 3, 1 / 3], [1 / 4, 1 / 2, 1 / 4], [0.2, 0.6, 0.2]]);
      /* Nucleo simetrico a proposito: asi la vuelta no cambia nada y el
         ejercicio mide lo que quiere medir, no un despiste de signos. */
      var s = f[0] * g[2] + f[1] * g[1] + f[2] * g[0];
      return { f: f, g: g, s: s };
    },
    ask: function (d) {
      return 'Los tres valores de la señal que quedan bajo el núcleo son $(' + d.f.join(',\\ ') +
        ')$, y el núcleo es $(' + d.g.map(function (v) { return U.fmt(v, 2); }).join(',\\ ') +
        ')$, que es simétrico. ¿Cuánto vale la salida en esa posición? (dos decimales)';
    },
    fields: [{ name: 's', label: 'salida', w: 'tiny' }],
    sol: function (d) { return { s: U.round(d.s, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { return Math.abs(v.s - (d.f[0] + d.f[1] + d.f[2])) < 0.005; }, msg: 'Has sumado la señal sin multiplicar por los pesos del núcleo.' }],
    hint: function () { return 'Multiplica uno a uno y suma. Al ser simétrico, da igual por qué extremo empieces.'; },
    steps: function (d) {
      return ['$' + d.f.map(function (v, i) { return v + '\\cdot' + U.fmt(d.g[2 - i], 2); }).join(' + ') + ' = ' + U.fmt(d.s, 2) + '$',
        'Como los pesos suman 1, la salida queda entre el menor y el mayor de los tres valores: es un promedio.'];
    },
    answer: function (d) { return U.fmt(d.s, 2); }
  });

  p.exercise({
    title: 'Convolucionar una señal corta',
    level: 'medio',
    gen: function (r) {
      var f = [], i;
      for (i = 0; i < 5; i++) f.push(r.int(1, 9));
      var g = [-1, 0, 1];
      var res = [];
      for (i = 0; i + 3 <= 5; i++) res.push(f[i] * g[2] + f[i + 1] * g[1] + f[i + 2] * g[0]);
      return { f: f, res: res };
    },
    ask: function (d) {
      return 'Convoluciona $f = (' + d.f.join(',\\ ') + ')$ con el núcleo $(-1,\\ 0,\\ 1)$, sin salirse. ' +
        'Da los tres números de la salida. <em>Acuérdate de que la convolución da la vuelta al núcleo.</em>';
    },
    fields: [
      { name: 'a', label: '1.º', w: 'tiny' }, { name: 'b', label: '2.º', w: 'tiny' }, { name: 'c', label: '3.º', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.res[0], b: d.res[1], c: d.res[2] }; },
    errores: [{ si: function (v, d) { return v.a === -d.res[0] && v.b === -d.res[1] && v.c === -d.res[2] && d.res[0] !== 0; }, msg: 'Los tres signos están cambiados: no has dado la vuelta al núcleo. Invertido, $(-1, 0, 1)$ es $(1, 0, -1)$.' }],
    hint: function () { return 'Invertido, el núcleo es $(1, 0, 1\\text{ cambiado de signo})$, o sea $(1, 0, -1)$: resta el de la derecha al de la izquierda.'; },
    steps: function (d) {
      return ['Invertido, el núcleo es $(1, 0, -1)$: cada salida es «el de la izquierda menos el de la derecha».',
        '$' + d.f[0] + ' - ' + d.f[2] + ' = ' + d.res[0] + '$',
        '$' + d.f[1] + ' - ' + d.f[3] + ' = ' + d.res[1] + '$',
        '$' + d.f[2] + ' - ' + d.f[4] + ' = ' + d.res[2] + '$',
        'Salida: $(' + d.res.join(',\\ ') + ')$. Los pesos suman cero, así que en un tramo constante saldría cero.'];
    },
    answer: function (d) { return '(' + d.res.join(', ') + ')'; }
  });

  p.exercise({
    title: 'Una capa convolucional',
    level: 'medio',
    gen: function (r) {
      var H = r.pick([28, 32, 64]), k = r.pick([3, 5]), c = r.pick([1, 3]), s = r.pick([8, 16, 32]);
      return { H: H, k: k, c: c, s: s, lado: H - k + 1, pesos: k * k * c * s };
    },
    ask: function (d) {
      return 'Una capa convolucional recibe una imagen de $' + d.H + '\\times' + d.H + '$ con $' + d.c +
        '$ canal' + (d.c > 1 ? 'es' : '') + ' y le aplica $' + d.s + '$ núcleos de $' + d.k + '\\times' +
        d.k + '$, sin relleno. ¿De qué lado es cada imagen de salida, y cuántos pesos tiene la capa ' +
        '(sin contar sesgos)?';
    },
    fields: [{ name: 'l', label: 'lado de la salida', w: 'tiny' }, { name: 'p', label: 'pesos', w: 'tiny' }],
    sol: function (d) { return { l: d.lado, p: d.pesos }; },
    /* Con un solo canal de entrada, olvidarlo da el resultado correcto:
       k·k·1·s es k·k·s. La regla solo tiene sentido si hay mas de uno. */
    errores: [{ si: function (v, d) { return d.c !== 1 && v.p === d.k * d.k * d.s; }, msg: 'Falta multiplicar por el número de canales de entrada: cada núcleo es tan profundo como la imagen que mira.' }],
    hint: function () { return 'El lado, como siempre: $H - k + 1$. Los pesos: cada núcleo tiene $k \\times k$ por cada canal de entrada, y hay tantos núcleos como canales de salida.'; },
    steps: function (d) {
      return ['Lado: $' + d.H + ' - ' + d.k + ' + 1 = ' + d.lado + '$.',
        'Pesos: $' + d.k + '\\cdot' + d.k + '\\cdot' + d.c + '\\cdot' + d.s + ' = ' + U.miles(d.pesos) + '$.',
        'Compáralo con una capa densa entre las mismas dos cosas, que necesitaría ' +
        U.miles(d.H * d.H * d.c * d.lado * d.lado * d.s) + ' pesos: los mismos números recorren toda la imagen, y ahí está el ahorro.'];
    },
    answer: function (d) { return d.lado + ' de lado, ' + U.miles(d.pesos) + ' pesos'; }
  });

  p.exercise({
    title: '¿Qué hace este núcleo?',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { k: '(\\tfrac13, \\tfrac13, \\tfrac13)', v: 'suaviza', por: 'Pesos positivos que suman 1: un promedio. Suaviza y conserva el nivel.' },
        { k: '(-1,\\ 2,\\ -1)', v: 'cambios', por: 'Suman 0, así que un tramo constante sale en cero: mide la curvatura, es decir, dónde cambia la señal.' },
        { k: '(\\tfrac14, \\tfrac12, \\tfrac14)', v: 'suaviza', por: 'Positivos y suman 1: promedio con más peso en el centro. Suaviza.' },
        { k: '(-1,\\ 0,\\ 1)', v: 'cambios', por: 'Suman 0: es una derivada por diferencias. Detecta cambios y deja los tramos lisos en cero.' },
        { k: '(0,\\ 1,\\ 0)', v: 'nada', por: 'Suma 1 pero no mezcla con los vecinos: devuelve la señal tal cual. Es el elemento neutro de la convolución.' },
        { k: '(0,\\ 3,\\ 0)', v: 'nivel', por: 'No mezcla con nadie, así que no filtra, pero suma 3 en vez de 1: multiplica la señal por 3 y le cambia el nivel.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Se aplica a una señal el núcleo $' + d.c.k + '$. ¿Qué le hace?'; },
    fields: [{ name: 'q', label: 'El núcleo', opts: [
      { t: 'la suaviza, conservando el nivel', v: 'suaviza' },
      { t: 'detecta sus cambios, y deja lo liso en cero', v: 'cambios' },
      { t: 'la deja exactamente igual', v: 'nada' },
      { t: 'no la filtra, pero le cambia el nivel', v: 'nivel' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Mira dos cosas: cuánto suman los pesos (1 conserva el nivel, 0 deja lo liso en cero) y si mezcla con los vecinos o no.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Convolucionar es deslizar un núcleo sobre una señal: multiplicar los números enfrentados y sumarlos, posición a posición.',
    'Si los pesos suman 1, el filtro suaviza y conserva el nivel. Si suman 0, detecta cambios y deja lo liso en cero.',
    'Un núcleo que suma cero es una derivada por diferencias: por eso detectar bordes y derivar son lo mismo.',
    'En dos dimensiones es idéntico con un índice más, y de $H\\times H$ con núcleo $k$ salen $(H-k+1)$ de lado.',
    'Teorema de convolución: convolucionar en el tiempo es multiplicar en la frecuencia. De ahí salen los filtros rápidos.',
    'La convolución invierte el núcleo; la correlación no. Con núcleos simétricos da igual, y en una red también, porque los pesos se aprenden.'
  ]);
});
