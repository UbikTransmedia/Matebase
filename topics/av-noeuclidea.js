/* Tema: Geometrías no euclídeas */
Course.topic('av-noeuclidea', function (p) {

  p.puente('Toda la [[ge-angulos|geometría del plano]] del curso daba por sentado un marco: rectas, paralelas ' +
    'y triángulos que suman 180°. Este bloque pone el marco en cuestión. No hacen falta técnicas nuevas, ' +
    'solo los ángulos, los triángulos y la esfera de siempre, y una disposición: aceptar que una ' +
    'regla que parece evidente puede cambiarse sin que nada se rompa.', 'Por dónde empezamos');

  p.text('Esta es, probablemente, la mejor historia de las matemáticas. Dura dos mil años, tiene un ' +
    'protagonista que demuestra lo contrario de lo que quería demostrar y no se da cuenta, un genio ' +
    'que se calla por miedo al ridículo, dos jóvenes que llegan a la meta a la vez y sin conocerse, ' +
    'y un final en el que todo aquello, que parecía un juego de lógicos, resulta ser la forma del ' +
    'universo.');

  p.text('Y empieza con una frase mal escrita.');

  p.note('En [[ge-angulos|el bloque de geometría del plano y del espacio]] se trabajaba dentro de un marco que nadie ' +
    'discutía: el de Euclides, con sus rectas, sus paralelas y sus distancias de siempre, y con él se ' +
    'medían figuras, se escribían ecuaciones de rectas y planos y se calculaban ángulos. Este bloque ' +
    'hace otra cosa: <strong>pone el marco en cuestión</strong>. Este tema pregunta qué pasa si se cambia ' +
    'una de sus reglas; [[av-geodif]] mide cuánto se curva una superficie usando el ' +
    '[[av-vectorial|cálculo en varias variables]]; y [[av-topologia]] se queda con lo que sobrevive cuando ' +
    'se deja de medir. No es más geometría del mismo tipo, sino la pregunta de qué es una geometría.',
    'ok', 'Qué tiene de distinto este bloque');

  p.section('El postulado incómodo');

  p.text('Hacia el 300 a. C., Euclides organizó toda la geometría conocida en los <em>Elementos</em>, ' +
    'el libro de texto más longevo de la historia. Su método sigue siendo el nuestro: unas pocas ' +
    'afirmaciones que se aceptan sin demostrar —los <strong>postulados</strong>— y todo lo demás ' +
    'deducido a partir de ellas.');

  p.text('Los cuatro primeros son de una sencillez ejemplar:');

  p.list([
    'Por dos puntos pasa una recta.',
    'Un segmento se puede prolongar indefinidamente.',
    'Dado un centro y un radio, existe la circunferencia.',
    'Todos los ángulos rectos son iguales entre sí.'
  ], true);

  p.text('Y luego está el quinto, que en el original ocupa un párrafo entero y suena a teorema ' +
    'disfrazado:');

  p.note('<em>«Si una recta al cortar a otras dos forma de un mismo lado ángulos internos menores ' +
    'que dos rectos, esas dos rectas prolongadas indefinidamente se cortan del lado en el que están ' +
    'los ángulos menores que dos rectos.»</em>', null, 'El quinto postulado, en la formulación de Euclides');

  p.text('Compáralo con «por dos puntos pasa una recta». No está en la misma liga. Habla de rectas ' +
    'prolongadas indefinidamente, o sea, de algo que nadie puede comprobar; y es tan largo que ' +
    'parece la conclusión de un razonamiento, no un punto de partida.');

  p.text('Hoy se usa una versión equivalente y más manejable, debida a Playfair:');

  p.formula('\\text{Por un punto exterior a una recta pasa }\\textbf{una y solo una}\\text{ paralela}',
    'postulado de las paralelas');

  p.text('El propio Euclides parecía incómodo: evita usarlo durante las veintiocho primeras ' +
    'proposiciones del libro I, y solo lo saca cuando ya no le queda más remedio. Esa reticencia se ' +
    'contagió a todos los que vinieron detrás.');

  p.comprueba('«Los ángulos de un triángulo suman 180°.» ¿Es un hecho independiente o depende del quinto postulado?', [
    { t: 'Es independiente: se demuestra midiendo cualquier triángulo', ok: false, por: 'Medir no demuestra nada, y menos con triángulos pequeños. Sobre la Tierra, un triángulo con vértices en el polo y en dos puntos del ecuador separados 90° tiene tres ángulos rectos: suma 270°.' },
    { t: 'Depende del quinto: es equivalente a él', ok: true, por: 'La demostración de los 180° usa una paralela por el vértice, es decir, el quinto postulado. Y al revés: si se admite que todo triángulo suma 180°, el quinto se deduce. Son la misma afirmación.' },
    { t: 'Depende de los cuatro primeros postulados', ok: false, por: 'Con solo los cuatro primeros se demuestra que la suma es <em>menor o igual</em> que 180° en el caso hiperbólico y no se puede fijar el valor. Hace falta el quinto.' }
  ]);

  p.demo({
    title: 'Lo que depende del quinto postulado',
    intro: 'Casi todo lo que aprendiste de triángulos y paralelas se cae si se toca el quinto. Recorre la lista y fíjate en cuántas cosas «evidentes» son en realidad consecuencias suyas.',
    predice: 'Antes de recorrer la lista: de estas cinco afirmaciones, ¿cuántas crees que sobreviven si se niega el quinto postulado? Apunta tu número.',
    build: function (host) {
      var cual = 0;
      var casos = [
        { t: 'Los ángulos de un triángulo suman 180°',
          d: 'Es <strong>equivalente</strong> al quinto postulado: si lo aceptas, se deduce; y si ' +
             'aceptas que la suma es 180°, se deduce el quinto. No es un hecho independiente.',
          dib: 'tri' },
        { t: 'El teorema de Pitágoras',
          d: 'Depende del quinto. En una esfera, $a^2+b^2 \\ne c^2$ para un triángulo rectángulo: ' +
             'toda la trigonometría del curso vive dentro de la geometría euclídea.',
          dib: 'pit' },
        { t: 'Existen rectángulos',
          d: 'Un cuadrilátero con cuatro ángulos rectos <strong>no existe</strong> si se niega el ' +
             'quinto. Ni un folio A4, ni una pantalla: son objetos euclídeos.',
          dib: 'rec' },
        { t: 'Dos rectas paralelas están siempre a la misma distancia',
          d: 'También depende. Sin el quinto, dos rectas que no se cortan pueden ir separándose ' +
             'indefinidamente.',
          dib: 'par' },
        { t: 'Existen triángulos semejantes de distinto tamaño',
          d: 'Sin el quinto, <strong>la forma determina el tamaño</strong>: dos triángulos con los ' +
             'mismos ángulos son idénticos. No hay escalas, no hay maquetas, no hay planos.',
          dib: 'sem' }
      ];
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -5, xmax: 5, ymin: -3, ymax: 3, height: 220,
        grid: false, axes: false, xlabel: null, ylabel: null,
        draw: function (g) {
          var k = casos[cual].dib;
          if (k === 'tri') {
            g.poly([[-3, -2], [3, -2], [0.6, 2]], { color: 0, w: 2.4, fill: 0, fillAlpha: .12 });
            g.text(0, -2.6, 'α + β + γ = 180°', { align: 'center', size: 14, color: 'ink' });
          } else if (k === 'pit') {
            g.poly([[-2.4, -1.6], [1.6, -1.6], [1.6, 1.4]], { color: 0, w: 2.4, fill: 0, fillAlpha: .12 });
            g.rightAngle(1.6, -1.6, Math.PI, Math.PI / 2, 0.45, { color: 1 });
            g.text(0, -2.4, 'a² + b² = c²', { align: 'center', size: 14, color: 'ink' });
          } else if (k === 'rec') {
            g.poly([[-2.6, -1.4], [2.6, -1.4], [2.6, 1.4], [-2.6, 1.4]], { color: 0, w: 2.4, fill: 0, fillAlpha: .12 });
            [[-2.6, -1.4], [2.6, -1.4], [2.6, 1.4], [-2.6, 1.4]].forEach(function (v, i) {
              g.point(v[0], v[1], { color: 1, r: 4 });
            });
            g.text(0, -2.3, 'cuatro ángulos rectos', { align: 'center', size: 14, color: 'ink' });
          } else if (k === 'par') {
            g.seg(-4, 1, 4, 1, { color: 0, w: 2.4 });
            g.seg(-4, -1, 4, -1, { color: 0, w: 2.4 });
            for (var x = -3; x <= 3; x += 1.5) g.seg(x, -1, x, 1, { color: 2, w: 1.4, dash: true });
            g.text(0, -2.2, 'distancia constante', { align: 'center', size: 14, color: 'ink' });
          } else {
            g.poly([[-4, -1.8], [-1.4, -1.8], [-2.4, 0.4]], { color: 0, w: 2.2, fill: 0, fillAlpha: .12 });
            g.poly([[0.4, -2], [4.4, -2], [2.9, 1.4]], { color: 1, w: 2.2, fill: 1, fillAlpha: .12 });
            g.text(0, -2.7, 'misma forma, distinto tamaño', { align: 'center', size: 14, color: 'ink' });
          }
        }
      });
      function paint() {
        out.set('<strong>' + casos[cual].t + '</strong><br>' + casos[cual].d);
        plot.render();
      }
      W.chips(host, casos.map(function (c, i) { return { label: c.t.slice(0, 26) + '…', value: String(i) }; }),
        { value: '0', on: function (v) { cual = +v; paint(); } });
      paint();
    }
  });

  p.section('Dos mil años intentando demostrarlo');

  p.text('Como el quinto no parecía un postulado, todo el mundo dio por hecho que era un teorema ' +
    'mal colocado y se lanzó a demostrarlo a partir de los otros cuatro. Lo intentaron Ptolomeo, ' +
    'Proclo, Alhacén, Omar Jayam, Nasir al-Din al-Tusi, Wallis, Legendre. Todos fracasaron, y casi ' +
    'todos de la misma manera: sin darse cuenta, en algún paso metían una hipótesis equivalente al ' +
    'quinto y demostraban que el quinto implica el quinto.');

  p.text('El intento más notable, y el más melancólico, es el del jesuita italiano Girolamo ' +
    'Saccheri. En 1733, ya moribundo, publicó <em>Euclides ab omni naevo vindicatus</em> —«Euclides ' +
    'liberado de toda mancha»—, donde intentaba una reducción al absurdo: negar el quinto y llegar a ' +
    'una contradicción.');

  p.text('Saccheri fue metódico. Negar el quinto deja dos posibilidades: que por un punto exterior no ' +
    'pase <em>ninguna</em> paralela, o que pasen <em>muchas</em>. La primera la descartó enseguida ' +
    'con los otros postulados. Y con la segunda se puso a deducir consecuencias, buscando el absurdo.');

  p.text('Dedujo decenas de teoremas: que la suma de los ángulos de un triángulo es menor que 180°, ' +
    'que el defecto es proporcional al área, que no hay rectángulos, que dos triángulos semejantes ' +
    'son iguales. Todo correcto. <strong>Nunca encontró la contradicción, porque no la hay.</strong> ' +
    'Estaba construyendo, teorema a teorema, la geometría hiperbólica.');

  p.note('Al final del libro, incapaz de rematar, Saccheri escribe que esos resultados son ' +
    '«repugnantes a la naturaleza de la línea recta» y da el asunto por zanjado. Es la única página ' +
    'floja de un libro brillante, y le costó la gloria. Tenía la respuesta escrita de su puño y ' +
    'letra y no fue capaz de creérsela.', 'warn', 'El fracaso más productivo de la historia');

  p.section('Negarlo y no romper nada');

  p.text('Un siglo después, tres personas llegaron por separado a la conclusión que Saccheri no se ' +
    'atrevió a sacar: <strong>el quinto postulado es independiente</strong>. No se puede demostrar ni ' +
    'refutar desde los otros cuatro. Y negarlo no produce contradicción, sino otra geometría, tan ' +
    'coherente como la de Euclides.');

  p.table(['Quién', 'Cuándo', 'Qué pasó'], [
    ['<strong>Carl Friedrich Gauss</strong>', 'hacia 1816', 'Lo supo el primero y no publicó nada. En una carta explica que temía «el griterío de los beocios», es decir, el ridículo.'],
    ['<strong>Nikolái Lobachevski</strong>', '1829', 'Publicó el primero, en ruso y en una revista provinciana de Kazán. Su trabajo fue ignorado o ridiculizado durante décadas.'],
    ['<strong>János Bolyai</strong>', '1832', 'Lo publicó como apéndice de un libro de su padre. «He creado de la nada un universo nuevo», le escribió.']
  ]);

  p.hist('La historia de Bolyai tiene un final amargo que conviene contar. Su padre, Farkas, había ' +
    'dedicado años al quinto postulado sin éxito y le suplicó por carta que no siguiera ese camino: ' +
    '«te lo ruego, déjalo, témelo como a los deseos sensuales, porque puede robarte todo tu tiempo, ' +
    'tu salud, tu paz y toda la felicidad de tu vida». János no le hizo caso y resolvió el problema. ' +
    'Farkas, orgulloso, envió el trabajo a su viejo amigo Gauss, que respondió que no podía elogiarlo ' +
    'porque hacerlo sería elogiarse a sí mismo: llevaba treinta años sabiéndolo. János, con ' +
    'veintinueve años, encajó tan mal la respuesta que no volvió a publicar nada. Murió en la ' +
    'oscuridad y hoy el aeropuerto de Târgu Mureș lleva su nombre.');

  p.section('Las tres geometrías');

  p.text('Según cuántas paralelas se admitan por un punto exterior, salen tres mundos distintos, y ' +
    'los tres son lógicamente impecables:');

  p.table(['', 'Elíptica', 'Euclídea', 'Hiperbólica'], [
    ['Paralelas por un punto exterior', 'ninguna', 'una', 'infinitas'],
    ['Suma de los ángulos de un triángulo', '$> 180°$', '$= 180°$', '$< 180°$'],
    ['Al crecer el triángulo, la suma…', 'aumenta', 'no cambia', 'disminuye'],
    ['Curvatura', 'positiva', 'cero', 'negativa'],
    ['Modelo intuitivo', 'la esfera', 'el plano', 'la silla de montar'],
    ['¿Hay rectángulos?', 'no', 'sí', 'no'],
    ['¿Hay semejanza sin igualdad?', 'no', 'sí', 'no']
  ]);

  p.text('La fila más desconcertante es la última. En una geometría no euclídea, dos triángulos con ' +
    'los mismos tres ángulos son <strong>congruentes</strong>: tienen que ser del mismo tamaño. Los ' +
    'ángulos determinan el área. Eso significa que no existen los planos a escala, ni las maquetas, ' +
    'ni las fotografías ampliadas. Vivimos tan dentro de la geometría euclídea que ni siquiera ' +
    'notamos que la semejanza es un privilegio.');

  p.ejemplo({
    title: 'Un triángulo sobre la Tierra, medido',
    enunciado: 'Un triángulo tiene un vértice en el polo norte y los otros dos en el ecuador, separados 90° de longitud. Hallar sus ángulos, su exceso y su área, con $R = 6371$ km.',
    pasos: [
      { t: '<strong>Los lados.</strong> Los tres son arcos de círculo máximo: dos meridianos y un cuarto de ecuador. Cada uno mide un cuarto de vuelta, $\\frac{\\pi R}{2} \\approx 10\\,000$ km. Es un triángulo equilátero.', antes: '¿Cuánto mide un meridiano del polo al ecuador? ¿Y el arco de ecuador entre los dos?' },
      { t: '<strong>Los ángulos.</strong> Los meridianos cortan al ecuador en ángulo recto: dos ángulos de 90°. En el polo, los meridianos se separan 90° de longitud: el tercero también es recto. Suma: $270°$.', antes: '¿Con qué ángulo cruza un meridiano el ecuador? ¿Y qué ángulo forman en el polo dos meridianos separados 90°?' },
      { t: '<strong>El exceso.</strong> $270° - 180° = 90°$, es decir, $\\frac{\\pi}{2}$ radianes. En el plano sería imposible: un triángulo equilátero con tres ángulos rectos.' },
      { t: '<strong>El área.</strong> $A = (\\alpha + \\beta + \\gamma - \\pi)R^2 = \\frac{\\pi}{2}\\cdot 6371^2 \\approx 6{,}4\\cdot 10^7$ km². Comprobación: es un octavo de la esfera, $\\frac{4\\pi R^2}{8} = \\frac{\\pi R^2}{2}$ ✓.', antes: '¿Qué fracción de la superficie de la esfera ocupa este triángulo? Piensa en cuántos caben.' },
      { t: '<strong>Y uno pequeño.</strong> El triángulo de Gauss en Hannover, de unos 70 km de lado, tiene área $\\approx 2000$ km²: exceso $= \\frac{2000}{6371^2} \\approx 5\\cdot 10^{-5}$ rad, unos 10 segundos de arco. Casi nada, y sin embargo Gauss lo midió.' }
    ],
    cierre: 'El exceso es proporcional al área: un triángulo de 10 000 km de lado se pasa 90°, y uno de 70 km, diez segundos. A escala humana la Tierra es euclídea con un error que ningún instrumento de aula detecta.'
  });

  p.demo({
    title: 'Un triángulo en la esfera',
    intro: 'En una esfera, la «recta» es el círculo máximo: el camino más corto entre dos puntos. Agranda el triángulo y mira cómo la suma de sus ángulos crece por encima de 180°. El exceso es proporcional al área.',
    predice: 'Con el ángulo del polo en 90°, el triángulo del ejemplo, ¿qué porcentaje de la esfera ocupará? ¿Y si abres el ángulo hasta 170°: se acerca al 25 %, al 50 % o más?',
    build: function (host) {
      var lat = 30;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, height: 300,
        grid: false, axes: false, xlabel: null, ylabel: null,
        draw: function (g) {
          g.circle(0, 0, 1, { color: 'axis', w: 1.8 });
          // ecuador visto en escorzo
          g.param(function (t) { return Math.cos(t); }, function (t) { return 0.28 * Math.sin(t); },
            0, 6.2832, { color: 'axis', w: 1.2, dash: true });
          // El angulo del polo ES la diferencia de longitud entre los dos
          // meridianos: si el deslizador dice 170 grados, hay que separarlos
          // 170 grados. Antes estaban fijos y el dibujo no obedecia al mando.
          var mitad = lat * Math.PI / 360;
          var ang1 = -mitad, ang2 = mitad;
          function pto(a, b) {   // longitud a, latitud b -> proyeccion
            return [Math.cos(b) * Math.sin(a), Math.sin(b) * 0.98 - Math.cos(b) * Math.cos(a) * 0.28];
          }
          var N = [0, 0.98];
          var A = pto(ang1, 0), B = pto(ang2, 0);
          // meridianos (geodesicas) del polo a cada punto
          function meridiano(a) {
            var pts = [];
            for (var t = Math.PI / 2; t >= 0; t -= 0.04) pts.push(pto(a, t));
            return pts;
          }
          g.path(meridiano(ang1), { color: 0, w: 2.6 });
          g.path(meridiano(ang2), { color: 0, w: 2.6 });
          var arco = [];
          for (var a = ang1; a <= ang2 + 1e-9; a += (ang2 - ang1) / 90) arco.push(pto(a, 0));
          g.path(arco, { color: 0, w: 2.6 });
          g.point(N[0], N[1], { color: 1, r: 5 });
          g.point(A[0], A[1], { color: 1, r: 5 });
          g.point(B[0], B[1], { color: 1, r: 5 });
        }
      });
      function paint() {
        // triangulo con dos angulos rectos en el ecuador y lat grados en el polo
        var suma = 90 + 90 + lat;
        var exceso = suma - 180;
        var area = exceso / 720;   // fraccion de la superficie total de la esfera
        out.set('Triángulo con dos vértices en el ecuador y uno en el polo.<br>' +
          'Ángulos: $90° + 90° + ' + lat + '° = ' + suma + '°$<br>' +
          '<strong>Exceso sobre 180°: ' + exceso + '°</strong><br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Ese triángulo ocupa el ' +
          U.fmt(area * 100, 2) + ' % de la superficie de la esfera. Exceso y área son ' +
          'proporcionales: un triángulo diminuto tiene exceso casi nulo, y por eso a escala humana la ' +
          'Tierra parece plana y Euclides parece verdad.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'ángulo en el polo', min: 10, max: 170, step: 5, value: 30, dec: 0,
        on: function (v) { lat = v; paint(); }
      });
      W.hint(host, 'Los dos ángulos del ecuador son rectos siempre, porque los meridianos cortan al ' +
        'ecuador perpendicularmente. Así que la suma ya empieza en 180° antes de contar el tercero, y ' +
        'el tercero es el que abres tú con el deslizador: fíjate en cómo se separan los meridianos.');
      paint();
    }
  });

  p.formula('\\alpha + \\beta + \\gamma - \\pi = \\frac{A}{R^2}', 'exceso esférico',
    'Se dice: <em>«alfa más beta más gamma menos pi es igual a a partido por erre al ' +
      'cuadrado»</em>.<br><br>Los ángulos van en radianes, así que $\\pi$ son los 180° de toda la ' +
      'vida. $A$ es el área del triángulo y $R$ el radio de la esfera.<br><br>Lo que dice es que ' +
      '<strong>el exceso mide el área</strong>. En un triángulo pequeño comparado con la esfera, ' +
      '$A/R^2$ es casi cero y la suma vuelve a ser 180°: por eso la geometría de tu habitación es ' +
      'euclídea aunque la Tierra sea redonda.');

  p.util('Este exceso no es teórico: los geodestas lo miden. En 1820, Gauss dirigió la triangulación ' +
    'del reino de Hannover y midió un triángulo enorme entre los montes Hoher Hagen, Brocken e ' +
    'Inselsberg, de casi setenta kilómetros de lado. La suma de sus ángulos superaba los 180° en unos ' +
    'quince segundos de arco, exactamente lo que predice la curvatura terrestre. Cualquier red ' +
    'topográfica de gran extensión —y todo sistema GPS— tiene que corregir este efecto o acumula ' +
    'errores de metros.');

  p.section('El plano hiperbólico');

  p.text('El caso hiperbólico es más difícil de visualizar porque no cabe entero en el espacio ' +
    'ordinario. Beltrami, Klein y Poincaré resolvieron el problema construyendo <strong>modelos</strong>: ' +
    'representaciones dentro de la geometría euclídea en las que se cumplen todos los axiomas ' +
    'hiperbólicos, a cambio de deformar las distancias.');

  p.text('El más famoso es el <strong>disco de Poincaré</strong>. Todo el plano hiperbólico infinito ' +
    'cabe dentro de un círculo; el borde está infinitamente lejos, y las «rectas» son arcos de ' +
    'circunferencia perpendiculares al borde.');

  p.demo({
    title: 'El disco de Poincaré',
    intro: 'Dentro del disco, las rectas son estos arcos. Arrastra los dos puntos y mira la recta que los une: se curva hacia el centro. Fíjate en cuántas rectas pasan por un punto sin cortar a otra: infinitas.',
    predice: 'Arrastra A y B hacia el borde manteniéndolos a la misma separación aparente. ¿La distancia hiperbólica se mantendrá, bajará o se disparará?',
    build: function (host) {
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.35, xmax: 1.35, ymin: -1.35, ymax: 1.35, height: 320,
        grid: false, axes: false, xlabel: null, ylabel: null,
        handles: {
          A: { x: 0.4, y: 0.35, label: 'A', color: 1, constrain: dentro },
          B: { x: -0.35, y: -0.45, label: 'B', color: 1, constrain: dentro }
        },
        draw: function (g) {
          g.circle(0, 0, 1, { color: 'axis', w: 2.4 });
          // geodesicas de fondo
          [[0.75, 0.75], [-0.75, 0.75], [0.75, -0.75], [-0.75, -0.75]].forEach(function (c) {
            dibujaGeo(g, c[0], c[1], 2);
          });
          g.seg(-1, 0, 1, 0, { color: 2, w: 1.6, alpha: .55 });
          var A = g.h('A'), B = g.h('B');
          geoPor(g, A.x, A.y, B.x, B.y);
        }
      });
      function dentro(h) {
        var d = Math.sqrt(h.x * h.x + h.y * h.y);
        if (d > 0.93) { h.x = h.x / d * 0.93; h.y = h.y / d * 0.93; }
      }
      /* Arco ortogonal al borde con centro (cx,cy): radio = sqrt(cx^2+cy^2-1) */
      function dibujaGeo(g, cx, cy, col) {
        var d2 = cx * cx + cy * cy;
        if (d2 <= 1) return;
        var r = Math.sqrt(d2 - 1);
        var pts = [];
        for (var t = 0; t <= 6.2832; t += 0.02) {
          var x = cx + r * Math.cos(t), y = cy + r * Math.sin(t);
          if (x * x + y * y < 1) pts.push([x, y]);
        }
        // el arco puede partirse: se dibuja punto a punto
        for (var i = 1; i < pts.length; i++) {
          var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
          if (dx * dx + dy * dy < 0.05) g.seg(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], { color: col, w: 1.6, alpha: .6 });
        }
      }
      /* Centro del arco ortogonal que pasa por dos puntos del disco */
      function geoPor(g, x1, y1, x2, y2) {
        var a1 = 1 + x1 * x1 + y1 * y1, a2 = 1 + x2 * x2 + y2 * y2;
        var det = 2 * (x1 * y2 - x2 * y1);
        if (Math.abs(det) < 1e-7) {           // pasan por el centro: es un diametro
          g.seg(-x1 * 3, -y1 * 3, x1 * 3, y1 * 3, { color: 0, w: 2.8 });
          return;
        }
        var cx = (a1 * y2 - a2 * y1) / det;
        var cy = (a2 * x1 - a1 * x2) / det;
        var r = Math.sqrt(cx * cx + cy * cy - 1);
        var t1 = Math.atan2(y1 - cy, x1 - cx), t2 = Math.atan2(y2 - cy, x2 - cx);
        if (t2 < t1) { var tt = t1; t1 = t2; t2 = tt; }
        if (t2 - t1 > Math.PI) { t1 += 2 * Math.PI; var s = t1; t1 = t2; t2 = s; }
        var pts = [];
        var pasos = 90;
        for (var i = 0; i <= pasos; i++) {
          var t = t1 + (t2 - t1) * i / pasos;
          pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
        }
        g.path(pts, { color: 0, w: 2.8 });
      }
      function paint() {
        var A = plot.h('A'), B = plot.h('B');
        var dA = Math.sqrt(A.x * A.x + A.y * A.y), dB = Math.sqrt(B.x * B.x + B.y * B.y);
        // distancia hiperbolica
        var num = 2 * ((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y));
        var den = (1 - dA * dA) * (1 - dB * dB);
        var dh = Math.acosh(1 + num / den);
        out.set('Distancia euclídea entre A y B: $' + U.fmt(Math.sqrt(num / 2), 4) + '$<br>' +
          'Distancia <strong>hiperbólica</strong>: $' + U.fmt(dh, 4) + '$<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Acerca los dos puntos al borde ' +
          'sin cambiar su separación aparente: la distancia hiperbólica se dispara. El borde está ' +
          'infinitamente lejos, y por eso cabe un plano infinito dentro de un círculo.</span>');
        plot.render();
      }
      plot.o.onDrag = paint;
      W.legend(host, [
        { c: 0, t: 'la recta que une A y B' },
        { c: 2, t: 'otras rectas del plano hiperbólico' }
      ]);
      W.hint(host, 'Los puntos se arrastran con el ratón y también con el teclado: Tab hasta el ' +
        'dibujo y flechas.');
      paint();
    }
  });

  p.util('El disco de Poincaré no es solo un juguete de geómetras. Es el modelo con el que se ' +
    'dibujan los grabados <em>Límite circular</em> de Escher, en los que peces idénticos parecen ' +
    'encogerse hacia el borde: no se encogen, es que allí las distancias son mayores. Y es la ' +
    'geometría natural de las redes: internet, las redes sociales y las conexiones neuronales tienen ' +
    'una estructura que se representa mucho mejor en el plano hiperbólico que en el euclídeo, porque ' +
    'en él «cabe» un crecimiento exponencial de vecinos con la distancia. Hay algoritmos de ' +
    'enrutamiento y de aprendizaje automático que trabajan directamente en coordenadas hiperbólicas.');

  p.section('De la curiosidad lógica a la forma del universo');

  p.text('Durante cuarenta años, todo esto fue considerado un ejercicio de lógica sin relación con la ' +
    'realidad. El giro llegó en 1854, cuando Bernhard Riemann, con veintiocho años y en la conferencia ' +
    'que tenía que darle plaza de profesor, propuso algo mucho más general: <strong>no hay dos o tres ' +
    'geometrías, hay infinitas</strong>, una por cada manera de asignar distancias a un espacio, y la ' +
    'curvatura puede cambiar de un punto a otro.');

  p.text('Gauss, que estaba en el tribunal y era ya un anciano, salió impresionado; murió al año ' +
    'siguiente. La conferencia no se publicó hasta 1868, y durante medio siglo fue una rareza ' +
    'admirada e inútil.');

  p.text('Hasta que en 1915 Einstein necesitó exactamente eso. La relatividad general dice que la ' +
    'gravedad no es una fuerza, sino <strong>curvatura del espacio-tiempo</strong>: los planetas no ' +
    'son empujados, siguen la trayectoria más recta posible en un espacio deformado. Para escribir ' +
    'esa idea hacía falta el lenguaje de Riemann, y estaba esperando, terminado, desde hacía sesenta ' +
    'años.');

  p.note('El siguiente tema, <em>geometría diferencial</em>, es la continuación natural de este: allí ' +
    'se define la curvatura con precisión, se demuestra el teorema egregio de Gauss —que la curvatura ' +
    'se puede medir desde dentro de la superficie, sin salir de ella— y se vuelve sobre los ' +
    'triángulos esféricos con las herramientas del cálculo.', null, 'Por dónde sigue esto');

  p.trampas([
    { e: '«La suma es 180° porque lo he medido»', por: 'A escala de aula el exceso es de millonésimas de grado. Medir no distingue las tres geometrías; solo lo hacen triángulos de cientos de kilómetros.' },
    { e: 'Creer que la geometría no euclídea es «falsa» o «imaginaria»', por: 'La esfera es un modelo perfectamente real de la elíptica: la navegación y el GPS trabajan en ella. La pregunta «¿cuál es la verdadera?» no tiene sentido sin decir de qué espacio se habla.' },
    { e: 'Pensar que en la esfera las paralelas «se curvan»', por: 'En la esfera no hay paralelas: dos círculos máximos siempre se cortan, en dos puntos. Los paralelos de latitud no son rectas de la esfera, salvo el ecuador.' },
    { e: 'Usar Pitágoras o la semejanza en una superficie curva', por: 'Las dos dependen del quinto postulado. En la esfera no hay triángulos semejantes de distinto tamaño: los ángulos fijan el área.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.hist('La geometría hiperbólica sigue viva. <strong>Maryam Mirzakhani</strong>, matemática iraní, dedicó su carrera a ' +
    'las superficies hiperbólicas: formas en las que, como en el disco de este tema, los triángulos suman menos de ' +
    '$180^\\circ$. En su tesis encontró cómo crece el número de geodésicas cerradas simples, los «caminos más cortos» que ' +
    'vuelven a su origen sin cruzarse, en esas superficies. En 2014 se convirtió en la primera mujer en recibir la ' +
    'medalla Fields, el premio más prestigioso de las matemáticas, por su trabajo sobre la geometría y la dinámica de ' +
    'estas superficies. Murió en 2017, con cuarenta años.');

  p.section('Practica');

  p.exercise({
    title: '¿En qué geometría estamos?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'Los ángulos de un triángulo suman 214°', g: 'eliptica' },
        { t: 'Los ángulos de un triángulo suman 180°', g: 'euclidea' },
        { t: 'Los ángulos de un triángulo suman 143°', g: 'hiperbolica' },
        { t: 'Por un punto exterior a una recta no pasa ninguna paralela', g: 'eliptica' },
        { t: 'Por un punto exterior a una recta pasan infinitas paralelas', g: 'hiperbolica' },
        { t: 'Existen cuadrados con cuatro ángulos rectos', g: 'euclidea' },
        { t: 'Dos triángulos con los mismos ángulos tienen siempre la misma área', g: 'noeuclidea' },
        { t: 'La superficie tiene curvatura negativa en todos sus puntos', g: 'hiperbolica' },
        { t: 'Las rectas son los círculos máximos de una esfera', g: 'eliptica' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return '«' + d.t + '»<br><br>¿A qué geometría corresponde?';
    },
    fields: [{ name: 'q', label: 'Geometría', opts: [
      { t: 'euclídea', v: 'euclidea' }, { t: 'elíptica', v: 'eliptica' },
      { t: 'hiperbólica', v: 'hiperbolica' }, { t: 'a las dos no euclídeas', v: 'noeuclidea' }
    ] }],
    sol: function (d) { return { q: d.g }; },
    hint: function () {
      return 'Suma mayor que 180° → curvatura positiva → elíptica. Menor → negativa → hiperbólica. ' +
        'Exactamente 180° → euclídea.';
    },
    steps: function (d) {
      var expl = {
        eliptica: 'Suma mayor que 180°, o ninguna paralela: es la geometría <strong>elíptica</strong>, la de la esfera.',
        euclidea: 'Suma exactamente 180°, una sola paralela, existen rectángulos: la de <strong>Euclides</strong>.',
        hiperbolica: 'Suma menor que 180°, infinitas paralelas, curvatura negativa: la <strong>hiperbólica</strong>.',
        noeuclidea: 'La ausencia de semejanza sin igualdad ocurre en las dos <strong>no euclídeas</strong>: en ellas los ángulos determinan el tamaño.'
      };
      return [expl[d.g]];
    },
    answer: function (d) {
      return { eliptica: 'Elíptica', euclidea: 'Euclídea', hiperbolica: 'Hiperbólica',
        noeuclidea: 'No euclídea (las dos)' }[d.g];
    }
  });

  p.exercise({
    title: 'Exceso esférico',
    level: 'medio',
    gen: function (r) {
      var a = r.int(60, 110), b = r.int(60, 110), c = r.int(40, 100);
      var suma = a + b + c;
      if (suma <= 181 || suma >= 500) return null;
      var R = r.pick([1, 2, 6371]);
      var exceso = (suma - 180) * Math.PI / 180;
      return { a: a, b: b, c: c, suma: suma, R: R, exceso: exceso, area: exceso * R * R };
    },
    ask: function (d) {
      return 'Un triángulo dibujado sobre una esfera de radio $R = ' + U.miles(d.R) + '$ tiene ' +
        'ángulos de $' + d.a + '°$, $' + d.b + '°$ y $' + d.c + '°$. Calcula su área usando ' +
        '$A = (\\alpha+\\beta+\\gamma-\\pi)R^2$, con los ángulos en radianes.<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Da el exceso en grados y el área ' +
        '(cuatro cifras significativas).</span>';
    },
    fields: [
      { name: 'e', label: 'exceso (grados)', w: 'tiny' },
      { name: 'A', label: 'área', w: 'wide' }
    ],
    sol: function (d) { return { e: d.suma - 180, A: U.round(d.area, 6) }; },
    tol: 1e-3,
    hint: function (d) {
      return 'El exceso en grados es $' + d.a + '+' + d.b + '+' + d.c + '-180$. Para el área hay que ' +
        'pasarlo a radianes multiplicando por $\\pi/180$ y luego por $R^2$.';
    },
    steps: function (d) {
      return ['Suma de ángulos: $' + d.a + '+' + d.b + '+' + d.c + ' = ' + d.suma + '°$',
        'Exceso: $' + d.suma + ' - 180 = ' + (d.suma - 180) + '°$',
        'En radianes: $' + (d.suma - 180) + '\\cdot\\frac{\\pi}{180} = ' + U.fmt(d.exceso, 6) + '$',
        '$A = ' + U.fmt(d.exceso, 6) + '\\cdot ' + d.R + '^2 = ' + U.fmt(d.area, 4) + '$',
        d.R === 6371 ? 'Con el radio terrestre en kilómetros, el área sale en km². Un triángulo así ' +
          'cubriría buena parte de un continente: por eso el exceso solo se nota a esas escalas.'
          : 'Fíjate en que el área no depende de los lados, solo de los ángulos. En geometría esférica ' +
            'los ángulos ya contienen la información del tamaño.'];
    },
    answer: function (d) { return 'exceso ' + (d.suma - 180) + '° · área ' + U.fmt(d.area, 4); }
  });

  p.exercise({
    title: 'Qué se conserva y qué no',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'Por dos puntos pasa una recta', dep: false, por: 'Es el primer postulado: vale en las tres geometrías.' },
        { t: 'El teorema de Pitágoras', dep: true, por: 'Es equivalente al quinto postulado: falla en la esfera y en el plano hiperbólico.' },
        { t: 'Los ángulos de un triángulo suman 180°', dep: true, por: 'Es equivalente al quinto postulado.' },
        { t: 'Un segmento se puede prolongar', dep: false, por: 'Es el segundo postulado, independiente del quinto.' },
        { t: 'Existen figuras semejantes de distinto tamaño', dep: true, por: 'Solo en la geometría euclídea: en las otras los ángulos fijan el tamaño.' },
        { t: 'Todos los ángulos rectos son iguales entre sí', dep: false, por: 'Es el cuarto postulado, y se mantiene en las tres.' },
        { t: 'Existen rectángulos', dep: true, por: 'Es otra formulación equivalente del quinto: sin él no hay cuadriláteros con cuatro ángulos rectos.' },
        { t: 'Dado un centro y un radio existe la circunferencia', dep: false, por: 'Es el tercer postulado, común a las tres geometrías.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return '«' + d.t + '»<br><br>¿Depende del quinto postulado, es decir, deja de valer en las ' +
        'geometrías no euclídeas?';
    },
    fields: [{ name: 'q', label: 'Esta afirmación', opts: [{ t: 'depende del quinto: solo vale en la euclídea', v: 'si' }, { t: 'vale en las tres geometrías', v: 'no' }] }],
    sol: function (d) { return { q: d.dep ? 'si' : 'no' }; },
    hint: function () {
      return 'Los cuatro primeros postulados y todo lo que se deduce solo de ellos —la llamada ' +
        '<em>geometría absoluta</em>— vale en las tres. Lo que habla de paralelas, de 180° o de ' +
        'proporciones, no.';
    },
    steps: function (d) {
      return [d.por, d.dep ? 'Sí, <strong>depende</strong> del quinto postulado.'
                           : 'No: vale en las <strong>tres</strong> geometrías.'];
    },
    answer: function (d) { return d.dep ? 'Sí, depende del quinto' : 'No, vale en las tres'; }
  });

  p.keys([
    'El <strong>quinto postulado</strong> de Euclides —una sola paralela por un punto exterior— es <strong>independiente</strong> de los otros cuatro: no se puede demostrar ni refutar desde ellos.',
    'Negarlo no produce contradicción, sino dos geometrías coherentes: la <strong>elíptica</strong> (ninguna paralela) y la <strong>hiperbólica</strong> (infinitas).',
    'La suma de los ángulos de un triángulo es $>180°$, $=180°$ o $<180°$ según la curvatura sea positiva, nula o negativa.',
    'En las geometrías no euclídeas <strong>no hay semejanza sin igualdad</strong>: los ángulos determinan el tamaño.',
    'El <strong>exceso esférico</strong> $\\alpha+\\beta+\\gamma-\\pi = A/R^2$ convierte los ángulos en una medida de área.',
    'Saccheri demostró en 1733 la geometría hiperbólica creyendo que la refutaba; Gauss se calló, y Lobachevski y Bolyai publicaron por separado hacia 1830.',
    'Riemann generalizó la idea en 1854 y Einstein la necesitó en 1915: la gravedad <strong>es</strong> curvatura.'
  ]);
});
