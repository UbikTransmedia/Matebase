/* Tema: Autoorganización: autómatas celulares */
Course.topic('cib-autoorganizacion', function (p) {

  p.text('Hasta aquí, en todos los sistemas del bloque había algo parecido a un gobernante: un ' +
    'controlador que mide, decide y actúa. Este tema quita esa figura y hace una pregunta molesta: ' +
    '<strong>¿puede aparecer orden sin que nadie lo organice?</strong>');

  p.text('La respuesta es que sí, y de forma tan clara que resulta desconcertante la primera vez que se ' +
    've. Basta con muchas piezas idénticas, cada una siguiendo una regla tonta que solo mira a sus ' +
    'vecinas inmediatas. Ninguna sabe qué está haciendo el conjunto; ninguna tiene un plan. Y sin ' +
    'embargo del conjunto sale estructura: rayas, ondas, figuras que se desplazan, formas que se ' +
    'reproducen.');

  p.text('A esto se le llama <strong>autoorganización</strong>, y las herramientas más limpias para ' +
    'estudiarlo son los <strong>autómatas celulares</strong>: una cuadrícula de celdas que solo ' +
    'pueden estar encendidas o apagadas, y una regla que dice cómo cambia cada una según sus vecinas.');

  p.hist('Ashby escribió sobre esto en 1947 en un artículo titulado <em>Principles of the ' +
    'Self-Organizing Dynamic System</em>, y volvió sobre ello en 1962 con una advertencia célebre: ' +
    'que la expresión «sistema autoorganizado» es tramposa, porque ningún sistema se organiza ' +
    'realmente a sí mismo <em>desde dentro de la nada</em> — siempre hay una regla, y esa regla vino ' +
    'de fuera. Lo que sí ocurre, y es asombroso, es que la organización que emerge no estaba escrita ' +
    'en la regla de forma reconocible. Su frase resume el tema: el diseñador pone la regla, pero no ' +
    'ha diseñado lo que va a salir.');

  /* ---------------------------------------------------------------- */
  p.section('Autómatas de una dimensión');

  p.text('Empecemos por lo más pequeño posible. Una fila de celdas, cada una encendida o apagada. Para ' +
    'calcular la fila siguiente, cada celda mira <strong>tres casillas</strong>: la de encima y sus ' +
    'dos vecinas. Con tres casillas binarias hay ocho combinaciones posibles, y la regla no es más ' +
    'que decidir, para cada una de esas ocho, si la celda queda encendida o apagada.');

  p.text('Como cada una de las ocho respuestas es un sí o un no, hay $2^8 = 256$ reglas distintas, ni ' +
    'una más. Con ese universo minúsculo y completamente catalogado se puede hacer un experimento ' +
    'honesto: <em>probarlas todas y ver qué sale</em>.');

  p.sub('De dónde sale el número de una regla');

  p.text('Se habla de «la regla 30» o «la regla 110», y conviene entender qué significa ese número, ' +
    'porque no es una etiqueta arbitraria: <strong>es la regla entera, comprimida</strong>. La idea ' +
    'es la del valor posicional que viste en el primer bloque, pero contando con dos símbolos en vez ' +
    'de diez.');

  p.text('Escribe las ocho respuestas en fila, de la vecindad 7 a la 0, y léelas como un número en ' +
    'base 2. En base 10 cada posición vale una potencia de diez; en base 2 vale una potencia de dos: ' +
    '128, 64, 32, 16, 8, 4, 2 y 1. Se suman las posiciones que llevan un 1 y ya está.');

  p.formula('110 = 64 + 32 + 8 + 4 = 01101110_2',
    'la regla 110, desmontada',
    'El subíndice 2 avisa de que ese número está escrito en <strong>base 2</strong>, no en la de ' +
    'siempre. Se lee cifra a cifra: «cero, uno, uno, cero, uno, uno, uno, cero», nunca «un millón ' +
    'ciento un mil…».<br><br>Cómo se obtiene: se va restando la mayor potencia de dos que quepa. ' +
    '¿Cabe 128 en 110? No, así que primera cifra 0. ¿Cabe 64? Sí, queda 46, cifra 1. ¿Cabe 32? Sí, ' +
    'queda 14, cifra 1. ¿16? No, cifra 0. ¿8? Sí, queda 6, cifra 1. ¿4? Sí, queda 2, cifra 1. ¿2? Sí, ' +
    'queda 0, cifra 1. ¿1? No, cifra 0.<br><br>Y esas ocho cifras <em>son</em> la regla: dicen si la ' +
    'celda queda encendida ante cada una de las ocho vecindades posibles.');

  p.note('Las posiciones se cuentan <strong>desde la derecha y empezando en cero</strong>, que es el ' +
    'convenio universal en informática y despista al principio. La cifra de más a la derecha ' +
    'corresponde a la vecindad 0 —las tres celdas apagadas— y la de más a la izquierda, a la vecindad ' +
    '7, con las tres encendidas.', null, 'Cómo se numeran las posiciones');

  p.demo({
    title: 'Las 256 reglas, una por una',
    intro: 'Cada fila se calcula a partir de la anterior mirando solo tres casillas. Se empieza con una única celda encendida en el centro. Recorre las reglas y fíjate en lo distintas que son: unas mueren, otras hacen rayas periódicas, otras dibujan triángulos anidados, y unas pocas producen algo que parece azar puro sin serlo.',
    build: function (host, d) {
      var regla = 30, filas = 60, ancho = 121;

      function generar() {
        var fila = [];
        for (var i = 0; i < ancho; i++) fila.push(i === (ancho - 1) / 2 ? 1 : 0);
        var todas = [fila];
        for (var f = 1; f < filas; f++) {
          var nueva = [];
          for (var c = 0; c < ancho; c++) {
            var izq = fila[(c - 1 + ancho) % ancho];
            var cen = fila[c];
            var der = fila[(c + 1) % ancho];
            var idx = izq * 4 + cen * 2 + der;
            nueva.push((regla >> idx) & 1);
          }
          fila = nueva;
          todas.push(fila);
        }
        return todas;
      }

      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: ancho, ymin: -filas, ymax: 0, height: 330,
        grid: false, axes: false,
        draw: function (g) {
          var t = generar();
          for (var f = 0; f < t.length; f++) {
            for (var c = 0; c < ancho; c++) {
              if (t[f][c]) g.rect(c, -f - 1, 1, 1, { color: 0, fill: 0, fillAlpha: 1, w: 0 });
            }
          }
        }
      });

      var FAMOSAS = {
        0: 'Muere en el primer paso: la regla apaga todo.',
        30: 'Caos a partir de un solo punto. Wolfram la usó como generador de números aleatorios, y así se implementó en el software Mathematica.',
        90: 'Dibuja el triángulo de Sierpinski, el mismo fractal que aparece en el tema de caos y fractales, sin que nadie lo haya programado.',
        110: 'La más asombrosa: se demostró que es capaz de computar cualquier cosa que compute un ordenador. Con esta regla tonta.',
        150: 'Simetría intrincada, periódica en el tiempo.',
        184: 'Modela el tráfico de coches en una carretera de un carril: las celdas encendidas son vehículos.',
        250: 'Un triángulo relleno, orden puro y aburrido.',
        255: 'Lo enciende todo de inmediato.'
      };

      function paint() {
        var bits = [];
        for (var i = 7; i >= 0; i--) bits.push((regla >> i) & 1);
        out.set('<strong>Regla ' + regla + '</strong> &nbsp;·&nbsp; en binario: ' + bits.join('') +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Esos ocho bits son la regla entera: ' +
          'dicen qué hacer ante cada una de las ocho vecindades posibles.</span>' +
          (FAMOSAS[regla] ? '<br><strong style="color:var(--accent-ink)">' + FAMOSAS[regla] + '</strong>' : ''));
        plot.render();
      }

      W.slider(W.row(host), {
        label: 'número de regla', min: 0, max: 255, step: 1, value: regla, dec: 0,
        on: function (v) { regla = v; paint(); }
      });
      W.buttons(W.row(host), [
        { t: 'Regla 30', on: function () { regla = 30; paint(); } },
        { t: 'Regla 90', on: function () { regla = 90; paint(); } },
        { t: 'Regla 110', cls: 'btn--main', on: function () { regla = 110; paint(); } },
        { t: 'Regla 184', on: function () { regla = 184; paint(); } }
      ]);
      W.hint(host, 'Mira la 90: aparece el triángulo de Sierpinski. Nadie ha dibujado un fractal; ha salido de que cada celda mire a dos vecinas.');
      paint();
    }
  });

  p.note('La regla 110 merece un párrafo aparte. En 2004 se demostró que es <strong>computacionalmente ' +
    'universal</strong>: cualquier cálculo que pueda hacer un ordenador se puede hacer con esa regla ' +
    'de ocho bits, dándole la entrada adecuada. Es decir, una máquina capaz de todo lo que hace tu ' +
    'portátil cabe en la frase «mira tus dos vecinas y aplica esta tabla». La frontera entre lo ' +
    'trivial y lo universal está muchísimo más cerca de lo que la intuición sugiere.',
    'ok', 'Ocho bits que lo pueden todo');

  /* ---------------------------------------------------------------- */
  p.section('El Juego de la Vida');

  p.text('El autómata más famoso vive en dos dimensiones y lo inventó el matemático John Conway en ' +
    '1970. Sus reglas caben en dos líneas y no hay ninguna más:');

  p.list([
    'Una celda <strong>viva</strong> sigue viva si tiene 2 o 3 vecinas vivas. Con menos muere de ' +
      'soledad; con más, de agobio.',
    'Una celda <strong>muerta</strong> revive si tiene exactamente 3 vecinas vivas.'
  ], true);

  p.text('Eso es todo. No hay más reglas, no hay azar, no hay objetivo. Y sin embargo, de ahí salen ' +
    'estructuras con nombre propio que la gente lleva cincuenta años catalogando: bloques que no se ' +
    'mueven, osciladores que laten, <em>planeadores</em> que se desplazan por el tablero, cañones que ' +
    'los disparan cada treinta pasos, y configuraciones capaces de construir copias de sí mismas.');

  p.demo({
    title: 'El Juego de la Vida',
    intro: 'Pon una figura y déjala correr. El planeador se desplaza en diagonal, indefinidamente. La «rana» late. Y la configuración al azar suele acabar en un revoltijo de restos quietos y osciladores, tras un rato de actividad sorprendente.',
    build: function (host, d) {
      var W2 = 42, H2 = 26;
      var g0 = [];
      function vaciar() {
        g0 = [];
        for (var y = 0; y < H2; y++) { var f = []; for (var x = 0; x < W2; x++) f.push(0); g0.push(f); }
      }
      vaciar();

      function poner(pts, ox, oy) {
        pts.forEach(function (q) { g0[(q[1] + oy + H2) % H2][(q[0] + ox + W2) % W2] = 1; });
      }
      var PLANEADOR = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      var RANA = [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]];
      var PENTA = [[1, 0], [1, 1], [0, 1], [2, 1], [1, 2], [1, 3], [1, 4], [0, 5], [2, 5], [1, 6], [1, 7]];

      var gen = 0, vivas = 0, corriendo = null;
      poner(PLANEADOR, 4, 4);

      function paso() {
        var n = [];
        for (var y = 0; y < H2; y++) {
          var f = [];
          for (var x = 0; x < W2; x++) {
            var c = 0;
            for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              c += g0[(y + dy + H2) % H2][(x + dx + W2) % W2];
            }
            f.push(g0[y][x] ? ((c === 2 || c === 3) ? 1 : 0) : (c === 3 ? 1 : 0));
          }
          n.push(f);
        }
        g0 = n; gen++;
      }

      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: W2, ymin: -H2, ymax: 0, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          vivas = 0;
          for (var y = 0; y < H2; y++) for (var x = 0; x < W2; x++) {
            if (g0[y][x]) { vivas++; g.rect(x, -y - 1, 1, 1, { color: 2, fill: 2, fillAlpha: 1, w: 0 }); }
          }
        }
      });

      function paint() {
        out.set('Generación <strong>' + gen + '</strong> &nbsp;·&nbsp; celdas vivas: <strong>' + vivas + '</strong>' +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Las dos reglas no cambian nunca. ' +
          'Todo lo que ves sale de contar vecinas.</span>');
        plot.render();
      }

      function avanzar(n) { for (var i = 0; i < n; i++) paso(); paint(); }

      W.buttons(W.row(host), [
        { t: 'Un paso', on: function () { avanzar(1); } },
        { t: 'Avanzar 20', cls: 'btn--main', on: function () { avanzar(20); } },
        { t: 'Planeador', on: function () { vaciar(); gen = 0; poner(PLANEADOR, 4, 4); paint(); } },
        { t: 'Rana', on: function () { vaciar(); gen = 0; poner(RANA, 18, 12); paint(); } },
        { t: 'Pentadecatlón', on: function () { vaciar(); gen = 0; poner(PENTA, 20, 9); paint(); } },
        { t: 'Al azar', cls: 'btn--ghost', on: function () {
          vaciar(); gen = 0;
          var r = U.rng(Date.now() % 100000);
          for (var y = 0; y < H2; y++) for (var x = 0; x < W2; x++) g0[y][x] = r.bool(0.32) ? 1 : 0;
          paint();
        } }
      ]);
      W.hint(host, 'Empieza con el planeador y avanza de veinte en veinte: se desplaza en diagonal sin deformarse. Después prueba «al azar» varias veces y observa cuánto tarda en calmarse.');
      paint();
    }
  });

  p.hist('Conway diseñó las reglas a mano durante meses, con tablero y fichas, buscando un equilibrio ' +
    'muy concreto: que no muriera todo enseguida, que no creciera sin control y que fuera imposible ' +
    'saber a simple vista qué haría una configuración dada. Se publicó en 1970 en la columna de ' +
    'Martin Gardner en <em>Scientific American</em> y provocó una pequeña fiebre: se calcula que ' +
    'durante un tiempo consumió una cantidad notable del tiempo de computación disponible en las ' +
    'universidades, con gente dejando programas corriendo toda la noche para ver qué pasaba. Conway, ' +
    'que hizo matemáticas mucho más profundas en teoría de grupos y de nudos, acabó algo harto de que ' +
    'se le conociera sobre todo por esto.');

  p.util('Los autómatas celulares no se quedaron en juego. Se usan para simular la propagación de ' +
    'incendios forestales, donde cada celda es una parcela que puede arder y contagiar a sus vecinas; ' +
    'para modelar tráfico —la regla 184 es literalmente un modelo de coches en un carril— y para ' +
    'entender cómo se forman los patrones de las conchas de algunos moluscos, que reproducen figuras ' +
    'de autómatas de una dimensión con una fidelidad asombrosa: el borde de la concha va escribiendo ' +
    'fila a fila, igual que la pantalla de arriba.');

  /* ---------------------------------------------------------------- */
  p.section('Emergencia');

  p.text('Conviene poner nombre a lo que estamos viendo. Se llama <strong>emergencia</strong> a que ' +
    'aparezcan en el conjunto propiedades que <em>no están</em> en las piezas ni en las reglas.');

  p.text('El planeador es el ejemplo perfecto. Se desplaza por el tablero, mantiene su forma, choca ' +
    'con otras figuras; tiene, en todos los sentidos prácticos, entidad propia. Y sin embargo ' +
    '<strong>en las reglas del Juego de la Vida no aparece la palabra «planeador» ni la idea de ' +
    'movimiento</strong>. Ninguna celda se mueve nunca: solo se encienden y se apagan. El movimiento ' +
    'es una interpretación nuestra de un patrón que se reconstruye un poco más allá en cada paso.');

  p.note('Esa es exactamente la advertencia de Ashby de la que hablábamos al principio. La regla la ' +
    'puso alguien; lo que <em>no</em> puso nadie es el planeador, y sin embargo ahí está, deducible ' +
    'de la regla pero imposible de anticipar leyéndola. Por eso la emergencia no es magia ni ' +
    'misticismo: es que <strong>saber las reglas no es lo mismo que saber las consecuencias</strong>.',
    null, 'Qué significa y qué no');

  p.util('Esa distinción tiene consecuencias muy prácticas fuera de la pantalla. Un atasco de tráfico ' +
    'que se desplaza hacia atrás mientras los coches avanzan hacia delante es un planeador: nadie lo ' +
    'ha creado y ningún coche «es» el atasco. Una burbuja de precios, un rumor que se propaga o el ' +
    'patrón de aplausos que se sincroniza solo en un teatro son de la misma familia. En todos ellos, ' +
    'buscar al culpable individual es un error de nivel: el fenómeno vive en el conjunto, no en las ' +
    'piezas.');

  p.sub('Patrones de Turing: manchas y rayas sin plano');

  p.text('En 1952, dos años antes de morir, Alan Turing publicó un artículo que no tenía nada que ver con ' +
    'ordenadores: <em>Las bases químicas de la morfogénesis</em>. Se preguntaba cómo un embrión, que al ' +
    'principio es una bola casi uniforme de células, llega a tener rayas, manchas o dedos. Su respuesta fue ' +
    'que bastan dos sustancias que reaccionan entre sí y se <strong>difunden a velocidades distintas</strong>.');

  p.text('Donde una de ellas gana un poco de terreno, se refuerza a sí misma: realimentación positiva, ' +
    'local. Pero a la vez provoca un efecto contrario que se extiende más deprisa por los alrededores e ' +
    'impide que allí aparezca otro foco: realimentación negativa, a distancia. El resultado es un reparto ' +
    'regular de focos, un patrón, sin que ninguna célula conozca el dibujo. Es la misma lección del Juego ' +
    'de la Vida, ahora con cantidades continuas en lugar de celdas encendidas y apagadas.');

  p.formulas([
    '\\frac{du}{dt} = D_u\\,\\Delta u - u\\,v^2 + F\\,(1 - u)',
    '\\frac{dv}{dt} = D_v\\,\\Delta v + u\\,v^2 - (F + k)\\,v'
  ], 'reacción y difusión (modelo de Gray-Scott)',
    'Cada celda de una cuadrícula lleva dos cantidades, $u$ y $v$.<br><br>$\\Delta u$ mide cuánto se ' +
    'diferencia $u$ de la media de sus vecinas: es la <strong>difusión</strong>, que tiende a igualarlo todo.<br><br>' +
    'El término $u\\,v^2$ es la <strong>reacción</strong>: $v$ se fabrica a costa de $u$, y cuanto más $v$ hay, ' +
    'más deprisa. $F$ repone $u$ desde fuera y $k$ retira $v$.<br><br>Con $v$ difundiéndose la mitad de rápido ' +
    'que $u$, cambios pequeños en $F$ y $k$ dan laberintos, manchas o manchas que se dividen como células.');

  p.demo({
    title: 'Reacción y difusión',
    intro: 'Cada píxel es una celda con dos sustancias que reaccionan y se difunden a sus vecinas. Nadie dibuja nada: las formas salen solas de unas gotas iniciales. Elige una receta, o mueve F y k con cuidado, y reinicia.',
    build: function (host) {
      var N = 110, u, v, u2, v2, F = 0.0545, K = 0.062, vivo = true, PASOS = 10, intentos = 0;
      var RECETAS = { coral: [0.0545, 0.062], mitosis: [0.0367, 0.0649] };
      var quieto = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (quieto) vivo = false;
      var cv = U.el('canvas', { width: N, height: N, role: 'img', 'aria-label': 'Simulación de reacción-difusión: una cuadrícula en la que aparecen manchas y laberintos a partir de unas gotas iniciales' });
      cv.style.cssText = 'width:min(100%,440px);aspect-ratio:1;image-rendering:pixelated;display:block;margin:0 auto;border-radius:6px';
      var caja = U.el('div.stage');
      caja.appendChild(cv);
      host.appendChild(caja);
      var ctx = cv.getContext('2d'), img = ctx.createImageData(N, N);
      var out = W.readout(host, '');

      function siembra() {
        u = new Float32Array(N * N).fill(1); v = new Float32Array(N * N);
        u2 = new Float32Array(N * N); v2 = new Float32Array(N * N);
        var rng = U.rng(Date.now() % 100000);
        for (var s = 0; s < 12; s++) {
          var cx = rng.int(8, N - 9), cy = rng.int(8, N - 9);
          for (var y = -3; y <= 3; y++) for (var x = -3; x <= 3; x++) {
            var i = (cy + y) * N + cx + x;
            u[i] = 0.5; v[i] = 0.25 + rng.real(0, 0.1);
          }
        }
      }
      function paso() {
        for (var y = 0; y < N; y++) {
          var ym = ((y - 1 + N) % N) * N, y0 = y * N, yp = ((y + 1) % N) * N;
          for (var x = 0; x < N; x++) {
            var xm = (x - 1 + N) % N, xp = (x + 1) % N, i = y0 + x;
            var lu = 0.2 * (u[y0 + xm] + u[y0 + xp] + u[ym + x] + u[yp + x]) + 0.05 * (u[ym + xm] + u[ym + xp] + u[yp + xm] + u[yp + xp]) - u[i];
            var lv = 0.2 * (v[y0 + xm] + v[y0 + xp] + v[ym + x] + v[yp + x]) + 0.05 * (v[ym + xm] + v[ym + xp] + v[yp + xm] + v[yp + xp]) - v[i];
            var reac = u[i] * v[i] * v[i];
            u2[i] = u[i] + (lu - reac + F * (1 - u[i]));
            v2[i] = v[i] + (0.5 * lv + reac - (F + K) * v[i]);
          }
        }
        var t = u; u = u2; u2 = t; t = v; v = v2; v2 = t;
      }
      function dibuja() {
        var px = img.data;
        for (var i = 0; i < N * N; i++) {
          var c = Math.max(0, Math.min(1, u[i] - v[i]));
          px[4 * i] = 24 + c * 220; px[4 * i + 1] = 32 + c * 200; px[4 * i + 2] = 70 + c * 150; px[4 * i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      function bucle() {
        if (!cv.isConnected) { if (++intentos > 300) return; }        // la pagina ya no esta: se para
        else { intentos = 0; if (vivo) { for (var s = 0; s < PASOS; s++) paso(); dibuja(); } }
        requestAnimationFrame(bucle);
      }
      function cuenta() {
        out.set('$F = ' + U.fmt(F, 4) + '$, $k = ' + U.fmt(K, 4) + '$ &nbsp;·&nbsp; cada fotograma calcula ' + PASOS + ' pasos de ' + U.miles(N * N) + ' celdas' +
          (vivo ? '' : ' &nbsp;·&nbsp; <strong>en pausa</strong>'));
      }

      W.chips(host, [{ label: 'laberinto de coral', value: 'coral' }, { label: 'manchas que se dividen', value: 'mitosis' }], {
        value: 'coral', on: function (k) { F = RECETAS[k][0]; K = RECETAS[k][1]; sF.set(F); sK.set(K); siembra(); dibuja(); cuenta(); }
      });
      var fila = W.row(host);
      var sF = W.slider(fila, { label: 'F (reposición)', min: 0.02, max: 0.07, step: 0.0005, value: F, dec: 4, on: function (x) { F = x; cuenta(); } });
      var sK = W.slider(fila, { label: 'k (retirada)', min: 0.05, max: 0.07, step: 0.0005, value: K, dec: 4, on: function (x) { K = x; cuenta(); } });
      var botones = W.buttons(host, [
        { t: vivo ? 'Pausa' : 'Seguir', on: function () { vivo = !vivo; botones.children[0].textContent = vivo ? 'Pausa' : 'Seguir'; cuenta(); } },
        { t: 'Reiniciar', on: function () { siembra(); dibuja(); } }
      ]);
      if (quieto) W.hint(host, 'Tu sistema pide reducir el movimiento, así que la simulación empieza en pausa. Pulsa «Seguir» para verla crecer.');
      siembra(); dibuja(); cuenta();
      requestAnimationFrame(bucle);
    }
  });

  p.hist('Turing no llegó a ver confirmada su idea. Durante décadas se consideró una curiosidad matemática, ' +
    'hasta que en 1990 un grupo de químicos de Burdeos obtuvo por primera vez manchas de Turing estables en ' +
    'una reacción química real. En 1995, Shigeru Kondo mostró que las rayas del pez ángel <em>Pomacanthus</em> ' +
    'se desplazan, se bifurcan y se reorganizan a medida que el pez crece, tal como predicen las ecuaciones ' +
    'de reacción-difusión. Hoy se estudian con ellas las rayas de las cebras, la separación de los dedos en ' +
    'el embrión y la disposición de los folículos del pelo.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Aplica las reglas de la Vida',
    level: 'basico',
    gen: function (r) {
      // Sorteando viva/muerta y vecinas al azar, el resultado salia «muerta»
      // el 83% de las veces y bastaba responder eso siempre. Se sortea primero
      // el desenlace y despues un caso que lo produzca.
      var sobrevive = r.bool(0.5);
      var viva = r.bool(0.5);
      var vecinas;
      if (sobrevive) vecinas = viva ? r.pick([2, 3]) : 3;
      else vecinas = viva ? r.pick([0, 1, 4, 5, 6]) : r.pick([0, 1, 2, 4, 5, 6]);
      return { viva: viva, vecinas: vecinas };
    },
    ask: function (d) {
      return 'Una celda está <strong>' + (d.viva ? 'viva' : 'muerta') + '</strong> y tiene ' +
        '<strong>' + d.vecinas + ' vecinas vivas</strong>.<br><br>' +
        'Recuerda las reglas: una viva sobrevive con 2 o 3 vecinas; una muerta revive con exactamente 3.' +
        '<br><br>¿Cómo estará en la generación siguiente?';
    },
    fields: [{ name: 'q', label: 'quedará', w: 'tiny' }],
    sol: function (d) {
      var r = d.viva ? (d.vecinas === 2 || d.vecinas === 3) : (d.vecinas === 3);
      return { q: r ? 'viva' : 'muerta' };
    },
    check: function (v, d) {
      var r = d.viva ? (d.vecinas === 2 || d.vecinas === 3) : (d.vecinas === 3);
      var bruto = U.llano(v.raw.q).trim();
      if (bruto === '1') return { ok: r };          // notacion binaria, respuesta entera
      if (bruto === '0') return { ok: !r };
      var q = U.eligeOpcion(bruto, {
        viva: /viva|vive|nace|encend|sobreviv|revive/,
        muerta: /muert|muere|apag|desaparec/
      });
      if (!q) return { ok: false, msg: 'Responde «viva» o «muerta».' };
      return { ok: r ? q === 'viva' : q === 'muerta' };
    },
    hint: function () { return 'Con 0 o 1 vecinas siempre se muere; con 4 o más también. La franja buena es estrecha.'; },
    steps: function (d) {
      var r = d.viva ? (d.vecinas === 2 || d.vecinas === 3) : (d.vecinas === 3);
      var l = ['La celda está ' + (d.viva ? 'viva' : 'muerta') + ' y tiene ' + d.vecinas + ' vecinas vivas.'];
      if (d.viva) {
        l.push(r ? 'Como tiene 2 o 3 vecinas, sobrevive.'
          : (d.vecinas < 2 ? 'Con menos de 2 vecinas muere de soledad.' : 'Con más de 3 vecinas muere de agobio.'));
      } else {
        l.push(r ? 'Una celda muerta con exactamente 3 vecinas nace.'
          : 'Para nacer harían falta exactamente 3 vecinas, y tiene ' + d.vecinas + '.');
      }
      l.push('Quedará <strong>' + (r ? 'viva' : 'muerta') + '</strong>.');
      return l;
    },
    answer: function (d) {
      return (d.viva ? (d.vecinas === 2 || d.vecinas === 3) : (d.vecinas === 3)) ? 'viva' : 'muerta';
    }
  });

  p.exercise({
    title: '¿Dónde estará el planeador?',
    level: 'basico',
    gen: function (r) {
      var x = r.int(0, 20), y = r.int(3, 20), k = r.int(2, 12);
      var dd = r.pick([['derecha', 'abajo', 1, 1], ['izquierda', 'abajo', -1, 1], ['derecha', 'arriba', 1, -1], ['izquierda', 'arriba', -1, -1]]);
      if (x - k < 0 && dd[2] < 0) return null;
      if (y - k < 0 && dd[3] < 0) return null;
      return { x: x, y: y, k: k, g: 4 * k, dx: dd[2], dy: dd[3], txt: dd[1] + ' y a la ' + dd[0] };
    },
    ask: function (d) {
      return 'Un planeador del Juego de la Vida recupera su forma cada 4 generaciones, desplazado una celda en diagonal. Uno que avanza ' +
        'hacia ' + d.txt + ' ocupa ahora un cuadro de 3×3 cuya esquina superior izquierda está en la columna $' + d.x + '$ y la fila $' + d.y +
        '$ (las filas crecen hacia abajo). ¿Dónde estará esa esquina dentro de ' + d.g + ' generaciones?';
    },
    fields: [{ name: 'c', label: 'columna', w: 'tiny' }, { name: 'f', label: 'fila', w: 'tiny' }],
    sol: function (d) { return { c: d.x + d.k * d.dx, f: d.y + d.k * d.dy }; },
    errores: [{ si: function (v, d) { return v.c === d.x + d.g * d.dx && v.f === d.y + d.g * d.dy; }, msg: 'El planeador no avanza una celda por generación: tarda 4 generaciones en recorrer una.' }],
    hint: function () { return ['¿Cuántas veces completa su ciclo de 4 generaciones?', 'En cada ciclo se mueve una columna y una fila.']; },
    steps: function (d) {
      return ['$' + d.g + ' : 4 = ' + d.k + '$ ciclos completos.',
        'Columna: $' + d.x + (d.dx > 0 ? ' + ' : ' - ') + d.k + ' = ' + (d.x + d.k * d.dx) + '$; fila: $' + d.y + (d.dy > 0 ? ' + ' : ' - ') + d.k + ' = ' + (d.y + d.k * d.dy) + '$.',
        'Por eso se dice que el planeador viaja a «$c/4$»: la velocidad máxima posible en el tablero, la «velocidad de la luz» $c$, es una celda por generación.'];
    },
    answer: function (d) { return 'columna ' + (d.x + d.k * d.dx) + ', fila ' + (d.y + d.k * d.dy); }
  });

  p.exercise({
    title: 'Descifra una regla elemental',
    level: 'medio',
    gen: function (r) {
      var n = r.int(1, 254);
      var vecindad = r.int(0, 7);
      return { n: n, v: vecindad };
    },
    ask: function (d) {
      var bits = [(d.v >> 2) & 1, (d.v >> 1) & 1, d.v & 1];
      return 'En un autómata elemental, la regla <strong>' + d.n + '</strong> se lee escribiendo el ' +
        'número en binario con 8 bits: el bit de la posición $i$ dice qué sale cuando la vecindad ' +
        '(izquierda, centro, derecha) vale $i$ leído en binario.<br><br>' +
        'La vecindad es <strong>' + bits.join('') + '</strong>, es decir, $i = ' + d.v + '$.<br><br>' +
        '¿Qué valor tendrá la celda en la fila siguiente, 0 o 1?';
    },
    fields: [{ name: 'b', label: 'sale un', w: 'tiny' }],
    sol: function (d) { return { b: (d.n >> d.v) & 1 }; },
    hint: function () {
      return 'Escribe el número de la regla en binario y cuenta las posiciones <strong>desde la derecha</strong>, empezando en cero.';
    },
    steps: function (d) {
      var bits = [];
      for (var i = 7; i >= 0; i--) bits.push((d.n >> i) & 1);
      return [
        'La regla ' + d.n + ' en binario con 8 bits es <strong>' + bits.join('') + '</strong>.',
        'Las posiciones se cuentan desde la derecha empezando en 0, así que la posición ' + d.v +
          ' es el bit número ' + (8 - d.v) + ' contando desde la izquierda.',
        'Ese bit vale <strong>' + ((d.n >> d.v) & 1) + '</strong>.',
        'Con ocho decisiones como esta queda completamente definida la regla, y por eso solo hay $2^8 = 256$.'
      ];
    }
  });

  p.exercise({
    title: '¿Cuántas reglas hay?',
    level: 'medio',
    gen: function (r) {
      var s = r.pick([2, 3]), m = s === 2 ? r.pick([3, 5, 7]) : r.pick([2, 3]);
      return { s: s, m: m, vec: Math.pow(s, m) };
    },
    ask: function (d) {
      return 'Un autómata celular de una dimensión tiene celdas con <strong>' + d.s + ' estados</strong> posibles, y cada celda decide su ' +
        'estado siguiente mirando una vecindad de <strong>' + d.m + ' celdas</strong>, ella incluida.<br><br>¿Cuántas vecindades distintas ' +
        'puede haber? El número de reglas posibles es $' + d.s + '$ elevado a un exponente: ¿cuál?';
    },
    fields: [{ name: 'n', label: 'vecindades', w: 'tiny' }, { name: 'e', label: 'exponente', w: 'tiny' }],
    sol: function (d) { return { n: d.vec, e: d.vec }; },
    errores: [
      { si: function (v, d) { return Math.pow(d.m, d.s) !== d.vec && v.n === Math.pow(d.m, d.s); }, msg: 'Al revés: cada una de las ' + 'celdas de la vecindad puede estar en cualquiera de los estados, así que se multiplican tantos factores iguales al número de estados como celdas haya.' },
      { si: function (v, d) { return v.e === d.m; }, msg: 'Ese exponente cuenta las celdas de la vecindad. Pero una regla tiene que decidir una salida para <strong>cada vecindad posible</strong>: el exponente es el número de vecindades.' }
    ],
    hint: function () { return ['Vecindades: cada celda de la vecindad puede estar en cualquiera de los estados, de forma independiente.', 'Una regla es una tabla con una fila por vecindad, y en cada fila se elige uno de los estados.']; },
    steps: function (d) {
      return ['Vecindades: $' + d.s + '^{' + d.m + '} = ' + d.vec + '$.',
        'Una regla elige una salida entre ' + d.s + ' para cada una de las ' + d.vec + ' vecindades: $' + d.s + '^{' + d.vec + '}$ reglas.',
        d.s === 2 && d.m === 3 ? 'Es el caso de los autómatas elementales: $2^8 = 256$.' : 'Con vecindades algo mayores ya no se pueden explorar todas: $' + d.s + '^{' + d.vec + '}$ es un número astronómico.'];
    },
    answer: function (d) { return d.vec + ' vecindades, ' + d.s + '^' + d.vec + ' reglas'; }
  });

  p.keys([
    'Los <strong>patrones de Turing</strong> salen de dos sustancias que reaccionan y se difunden a distinta velocidad: refuerzo local e inhibición a distancia.',
    '<strong>Autoorganización</strong>: aparece estructura global sin que ninguna pieza la conozca ni la dirija.',
    'Un <strong>autómata celular</strong> es una cuadrícula de celdas binarias con una regla que solo mira a las vecinas.',
    'Con vecindad de tres celdas hay exactamente $2^8 = 256$ reglas posibles, y se pueden explorar todas.',
    'La regla 110 es <strong>computacionalmente universal</strong>: puede calcular cualquier cosa que calcule un ordenador.',
    'El <strong>Juego de la Vida</strong> tiene dos reglas y produce figuras que se desplazan, laten y se reproducen.',
    '<strong>Emergencia</strong> es que el conjunto tenga propiedades que no están en las reglas: saberlas no es saber sus consecuencias.'
  ]);

});
