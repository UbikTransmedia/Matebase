/* Tema: Resolver problemas y modelizar */
Course.topic('lg-problemas', function (p) {

  p.puente('Los tres temas anteriores dieron el idioma: proposiciones, conjuntos y ' +
    '[[lg-demostracion|demostraciones]]. Este da el método para cuando el problema no viene con etiqueta, ' +
    'y sirve para todo el curso: las heurísticas no dependen de ninguna técnica concreta.');

  p.text('Casi todo lo que se estudia en matemáticas son técnicas para resolver problemas que ya tienen ' +
    'nombre: ecuaciones de segundo grado, sistemas, derivadas. Pero en un examen, y fuera de él, los ' +
    'problemas no llegan con la etiqueta puesta. Llegan como un párrafo que no se parece a ninguno de los ' +
    'que has hecho, y la sensación es la de estar delante de una pared lisa.');

  p.text('La buena noticia es que para esa pared también hay método. No es un algoritmo que garantice ' +
    'la solución, sino una colección de preguntas y estrategias —las <strong>heurísticas</strong>— que ' +
    'los matemáticos usan sin decirlo. Este tema las dice. Y como no dependen de ninguna técnica en ' +
    'particular, sirven para todo el curso: conviene volver a él cada vez que un problema se atasque.');

  /* ---------------------------------------------------------------- */
  p.section('Las cuatro fases');

  p.list([
    '<strong>Comprender el problema.</strong> ¿Cuáles son los datos? ¿Qué se pide exactamente? ¿Qué condiciones hay? Hacer un dibujo, poner nombre a las cosas, contarlo con tus palabras. Una parte enorme de los atascos es no haber entendido qué se pregunta.',
    '<strong>Concebir un plan.</strong> ¿Has visto un problema parecido? ¿Conoces uno con la misma incógnita? Si no se te ocurre nada, prueba una heurística de la lista de abajo.',
    '<strong>Ejecutar el plan.</strong> Con cuidado, comprobando cada paso. Si el plan no funciona, se vuelve a la fase anterior: eso no es fracasar, es la forma normal de trabajar.',
    '<strong>Examinar la solución.</strong> ¿Tiene sentido el resultado? ¿Las unidades cuadran? ¿Qué pasa en un caso extremo? ¿Se podría haber hecho de otra forma? Esta fase es la que más se salta y la que más errores caza.'
  ], true);

  p.note('Una respuesta que dice que un coche recorre 3000 km en una hora, que una probabilidad vale 1,4 o ' +
    'que un depósito tiene −5 litros está mal, aunque las cuentas parezcan correctas. Detenerse diez ' +
    'segundos a mirar el resultado con sentido común es la comprobación más barata que existe. El ' +
    '[[ar-magnitudes|análisis dimensional]] es su versión con unidades.', 'warn', 'La cuarta fase caza errores');

  p.ejemplo({
    title: 'Las cuatro fases, aplicadas a un problema',
    enunciado: 'Un depósito se llena en 3 horas con un grifo y en 6 horas con otro. ¿Cuánto tarda en llenarse con los dos abiertos a la vez?',
    pasos: [
      { t: '<strong>Comprender.</strong> Datos: un grifo tarda 3 h, el otro 6 h. Se pide: el tiempo con los dos. Una primera intuición: tiene que ser <em>menos</em> de 3 h, porque el segundo grifo ayuda. La tentación de sumar (9 h) o promediar (4,5 h) ya no cuadra con eso.', antes: 'Antes de calcular nada: ¿el resultado será mayor o menor que 3 horas?' },
      { t: '<strong>Plan.</strong> Los tiempos no se suman, pero lo que llena cada grifo <em>por hora</em> sí. En una hora, el primero llena $\\frac{1}{3}$ del depósito y el segundo $\\frac{1}{6}$. Ponemos nombre a la incógnita: con los dos, se llena $\\frac{1}{t}$ por hora.', antes: '¿Qué cantidad sí se puede sumar entre los dos grifos?' },
      { t: '<strong>Ejecutar.</strong> $\\frac{1}{3} + \\frac{1}{6} = \\frac{2}{6} + \\frac{1}{6} = \\frac{3}{6} = \\frac{1}{2}$. Así que $\\frac{1}{t} = \\frac{1}{2}$ y $t = 2$ horas.' },
      { t: '<strong>Examinar.</strong> Dos horas es menos que 3, como se había previsto, y más que la mitad de 3 (si los dos grifos fueran iguales tardarían 1,5 h; el segundo es más lento, así que algo más). Cuadra. Comprobación directa: en 2 h el primero llena $\\frac{2}{3}$ y el segundo $\\frac{2}{6} = \\frac{1}{3}$; total, 1 depósito. ✓', antes: '¿Cómo comprobarías el resultado sin repetir el mismo cálculo?' }
    ],
    cierre: 'La cuarta fase no es un adorno: es la que habría cazado el 9 o el 4,5 si nos hubiéramos precipitado.'
  });

  p.hist('Estas cuatro fases las escribió George Pólya, un matemático húngaro que enseñaba en Stanford, ' +
    'en un libro de 1945 titulado <em>Cómo plantear y resolver problemas</em>. Pólya había notado que sus ' +
    'alumnos sabían muchas técnicas pero no sabían cuándo usarlas, y que los buenos matemáticos se hacen ' +
    'siempre las mismas preguntas sin darse cuenta. Decidió escribirlas. El libro ha vendido más de un ' +
    'millón de ejemplares y sigue siendo el punto de partida de cualquier curso de resolución de ' +
    'problemas.');

  /* ---------------------------------------------------------------- */
  p.section('Heurísticas: qué probar cuando no se te ocurre nada');

  p.sub('Empezar por casos pequeños');
  p.text('Si el problema habla de $n$ objetos, prueba con 1, con 2, con 3. Se ve el mecanismo, a veces ' +
    'aparece un patrón y, sobre todo, se entiende de qué va. ¿Cuántos apretones de manos hay en una ' +
    'reunión de 20 personas si todos se saludan? Con 2 personas hay 1; con 3, 3; con 4, 6. Cada persona ' +
    'saluda a las otras $n - 1$, y así cada apretón se cuenta dos veces: $\\frac{n(n-1)}{2}$, que para 20 ' +
    'da 190.');

  p.text('Pero un patrón es una sospecha, no una prueba. El ejemplo de abajo lo enseña de la manera más ' +
    'contundente, y por eso existe el [[lg-demostracion|método de demostración]]: para convertir la ' +
    'sospecha en certeza.');

  p.demo({
    title: 'Un patrón que miente: las regiones del círculo',
    intro: 'Se colocan n puntos en una circunferencia y se unen todos con todos. ¿En cuántas regiones queda dividido el círculo? Sube n despacio y apunta los números antes de mirar el sexto.',
    predice: 'Con 1, 2, 3, 4 y 5 puntos salen 1, 2, 4, 8 y 16 regiones. Apunta cuántas crees que saldrán con 6 puntos antes de mover el deslizador.',
    build: function (host) {
      var n = 3;
      var out = W.readout(host, '');
      function regiones(k) { return ML.comb(k, 4) + ML.comb(k, 2) + 1; }
      var plot = W.board(host, {
        xmin: -1.25, xmax: 1.25, ymin: -1.25, ymax: 1.25, height: 320, grid: false, axes: false,
        aria: 'Una circunferencia con n puntos unidos por todas las cuerdas posibles',
        draw: function (g) {
          g.circle(0, 0, 1, { color: 'axis', w: 1.6 });
          var pts = [];
          for (var i = 0; i < n; i++) {
            // separacion irregular para que no coincidan tres cuerdas en un punto
            var a = 2 * Math.PI * i / n + 0.21 * Math.sin(i * 1.7);
            pts.push([Math.cos(a), Math.sin(a)]);
          }
          for (var i2 = 0; i2 < n; i2++) for (var j = i2 + 1; j < n; j++) g.seg(pts[i2][0], pts[i2][1], pts[j][0], pts[j][1], { color: 0, w: 1.3, alpha: 0.75 });
          pts.forEach(function (q) { g.point(q[0], q[1], { color: 1, r: 4.5 }); });
        }
      });
      function pinta() {
        var lista = [];
        for (var k = 1; k <= n; k++) lista.push(regiones(k));
        out.set('Con $n = ' + n + '$ puntos: <strong>' + regiones(n) + ' regiones</strong><br>Secuencia hasta aquí: ' + lista.join(', ') +
          (n >= 6 ? '<br><strong style="color:var(--bad)">¡31, no 32!</strong> Los cinco primeros casos parecían duplicarse, y el sexto rompe el patrón. La fórmula de verdad es $\\binom{n}{4} + \\binom{n}{2} + 1$.' : (n === 5 ? '<br>1, 2, 4, 8, 16… ¿Cuántas saldrán con 6?' : '')));
        plot.render();
      }
      W.slider(W.row(host), { label: 'puntos en la circunferencia', min: 1, max: 9, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  p.sub('Trabajar hacia atrás');
  p.text('Si se conoce el final y se pide el principio, se recorre el problema al revés deshaciendo cada ' +
    'paso. «Gasté la mitad de mi dinero y 3 € más, y me quedan 5 €». Hacia atrás: antes de gastar los ' +
    '3 € tenía 8; como eso era la mitad, al principio tenía 16. Es también la estrategia de las ' +
    'demostraciones: se mira qué haría falta para llegar a la conclusión, y qué haría falta para eso.');

  p.sub('Buscar un invariante');
  p.text('Un <strong>invariante</strong> es algo que no cambia por muchas operaciones que se hagan: una ' +
    'paridad, una suma, un color. Si al principio vale una cosa y en la situación deseada vale otra, esa ' +
    'situación es imposible, sin necesidad de probar todos los caminos. Es la heurística más elegante, y ' +
    'la que demuestra que algo <em>no</em> se puede hacer.');

  p.demo({
    title: 'El tablero de ajedrez mutilado',
    predice: 'Quita las dos esquinas opuestas, que son del mismo color. ¿Se podrá cubrir el resto con dominós? ¿Y si quitas dos casillas vecinas?',
    intro: 'Se quitan dos casillas de un tablero de 8×8. ¿Se puede cubrir el resto con fichas de dominó, cada una de dos casillas? Elige qué casillas quitar y cuenta los colores: cada ficha tapa siempre una blanca y una negra.',
    build: function (host) {
      var CASOS = {
        opuestas: { t: 'dos esquinas opuestas', q: [[0, 0], [7, 7]] },
        contiguas: { t: 'dos casillas contiguas', q: [[3, 3], [3, 4]] },
        distintas: { t: 'una blanca y una negra lejanas', q: [[0, 0], [6, 7]] }
      };
      var cual = 'opuestas';
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -0.3, xmax: 8.3, ymin: -0.3, ymax: 8.3, height: 320, grid: false, axes: false,
        aria: 'Un tablero de ajedrez de ocho por ocho con dos casillas marcadas como quitadas',
        draw: function (g) {
          var quit = CASOS[cual].q;
          for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++) {
            var fuera = quit.some(function (c) { return c[0] === i && c[1] === j; });
            var oscura = (i + j) % 2 === 0;
            g.rect(i, j, 1, 1, { fill: fuera ? 'bad' : (oscura ? 'ink' : 'bg'), fillAlpha: fuera ? 0.55 : (oscura ? 0.75 : 1), color: 'axis', w: 0.6 });
          }
        }
      });
      function pinta() {
        var quit = CASOS[cual].q, osc = 32, cla = 32;
        quit.forEach(function (c) { if ((c[0] + c[1]) % 2 === 0) osc--; else cla--; });
        out.set('Quedan <strong>' + osc + ' oscuras</strong> y <strong>' + cla + ' claras</strong>. Cada dominó tapa una de cada, así que 31 fichas tapan 31 y 31.<br>' +
          (osc !== cla ? '<strong style="color:var(--bad)">Imposible</strong>, sin necesidad de probar ninguna colocación: los colores no están equilibrados.'
            : 'Los colores están equilibrados: el invariante no lo impide. (Y en este caso, de hecho, se puede.)'));
        plot.render();
      }
      W.chips(host, Object.keys(CASOS).map(function (k) { return { label: CASOS[k].t, value: k }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('En una pizarra están escritos los números del 1 al 10. Se borran dos cualesquiera, $a$ y $b$, y se escribe su <em>diferencia</em> $a - b$. Se repite hasta que queda un solo número. ¿Qué no cambia en ningún paso?', [
    { t: 'La suma de los números de la pizarra', ok: false, por: 'Cambia: se quitan $a + b$ y se pone $a - b$, así que la suma baja en $2b$.' },
    { t: 'La paridad de la suma (si es par o impar)', ok: true, por: 'La suma baja en $2b$, que es par, así que su paridad no cambia nunca. Empieza en 55, impar: el último número será impar.' },
    { t: 'El número de números impares que hay', ok: false, por: 'Puede cambiar: si $a$ y $b$ son impares, desaparecen dos impares y aparece un par.' }
  ]);

  p.sub('El principio del palomar');
  p.text('Si hay más palomas que agujeros, algún agujero tiene al menos dos palomas. Parece una tontería ' +
    'y es una herramienta seria: en cualquier grupo de 13 personas, dos cumplen años el mismo mes; en ' +
    'Madrid hay al menos dos personas con exactamente el mismo número de pelos en la cabeza, porque hay ' +
    'más habitantes que pelos puede tener una cabeza.');

  p.sub('Ponerle nombre a lo que no sabes');
  p.text('Llamar $x$ a la incógnita y escribir las condiciones como si ya se conociera es la heurística ' +
    'que dio origen al [[al-lenguaje|álgebra]]. Y tiene variantes: dibujar la figura ya terminada, ' +
    'suponer el problema resuelto y ver qué propiedades tendría la solución.');

  /* ---------------------------------------------------------------- */
  p.section('Modelizar: del mundo a las matemáticas y vuelta');

  p.text('Un problema de la vida real no viene escrito en fórmulas. <strong>Modelizar</strong> es ' +
    'traducirlo, y es un ciclo, no una línea recta:');

  p.list([
    '<strong>Simplificar</strong> la situación: decidir qué importa y qué se puede despreciar, y hacer supuestos explícitos.',
    '<strong>Matematizar</strong>: poner nombre a las variables y escribir las relaciones entre ellas.',
    '<strong>Resolver</strong> el problema matemático, con las técnicas del curso.',
    '<strong>Interpretar</strong> el resultado en el contexto: qué significa ese número.',
    '<strong>Validar</strong>: ¿se parece a la realidad? Si no, se revisan los supuestos y se vuelve a empezar.'
  ], true);

  p.util('Enrico Fermi, premio Nobel de Física, preguntaba a sus alumnos cosas como «¿cuántos afinadores ' +
    'de pianos hay en Chicago?». No había datos: había que estimar cuántos habitantes, cuántos pianos por ' +
    'hogar, cada cuánto se afina uno y cuántos puede afinar un profesional al año, y multiplicar. Los ' +
    'errores de cada supuesto tienden a compensarse y el resultado suele acertar el orden de magnitud. Ese ' +
    'tipo de estimación rápida es una destreza muy buscada en ingeniería, en consultoría y en ciencia: ' +
    'antes de un cálculo largo, saber qué resultado sería razonable.');

  p.trampas([
    { e: 'Empezar a calcular antes de entender', por: 'Releer, dibujar y decir con tus palabras qué se pide cuesta un minuto y evita resolver otro problema distinto del que hay.' },
    { e: 'Dar un patrón por demostrado', por: 'Las regiones del círculo dan 1, 2, 4, 8, 16… y luego 31. Cinco casos que encajan no demuestran nada; solo sugieren qué demostrar.' },
    { e: 'No comprobar el resultado con el enunciado', por: '3,5 personas, una longitud negativa o una probabilidad de 1,4 avisan de un error antes que cualquier revisión de las cuentas.' },
    { e: 'Cerrar el problema en cuanto sale', por: 'La mirada atrás es la fase que más enseña: ¿se podía hacer de otra manera? ¿Sirve el método para otros problemas? Ahí es donde el problema se convierte en técnica.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Qué estrategia probarías?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: '«Demuestra que, en un grupo de 367 personas, al menos dos cumplen años el mismo día.»', ok: 'palomar', por: 'Hay más personas (palomas) que días del año (agujeros), contando el 29 de febrero.' },
        { t: '«¿Cuántas diagonales tiene un polígono de 50 lados?»', ok: 'pequenos', por: 'Con un cuadrado, un pentágono y un hexágono se ve el mecanismo: desde cada vértice salen $n - 3$ diagonales, y cada una se cuenta dos veces.' },
        { t: '«Un número se multiplica por 3, se le suma 5 y se divide entre 2, y sale 13. ¿Qué número era?»', ok: 'atras', por: 'Se deshace cada paso en orden inverso: $13\\cdot 2 = 26$, $26 - 5 = 21$, $21 : 3 = 7$.' },
        { t: '«En una pizarra están los números del 1 al 10. Se borran dos cualesquiera y se escribe su suma. Se repite hasta que queda uno. ¿Puede quedar un número impar?»', ok: 'invariante', por: 'La suma total no cambia nunca: vale 55, que es impar, así que el último número es siempre 55.' },
        { t: '«Un depósito se llena en 3 horas con un grifo y en 6 con otro. ¿Cuánto tarda con los dos?»', ok: 'nombre', por: 'Se llama $t$ al tiempo y se escribe qué fracción llena cada grifo por hora: $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{t}$.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return d.t + ' ¿Qué heurística es la más prometedora para empezar?'; },
    fields: [{
      name: 'h', label: 'Estrategia', opts: [
        { t: 'casos pequeños', v: 'pequenos' }, { t: 'trabajar hacia atrás', v: 'atras' },
        { t: 'buscar un invariante', v: 'invariante' }, { t: 'principio del palomar', v: 'palomar' },
        { t: 'ponerle nombre a la incógnita', v: 'nombre' }]
    }],
    sol: function (d) { return { h: d.ok }; },
    hint: function () { return ['¿Se conoce el final y se pide el principio? ¿Se pregunta si algo es imposible? ¿Hay un $n$ grande? ¿Hay más objetos que casillas?', 'Cada tipo de pregunta pide una heurística distinta.']; },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return { pequenos: 'Casos pequeños', atras: 'Hacia atrás', invariante: 'Invariante', palomar: 'Palomar', nombre: 'Nombrar la incógnita' }[d.ok]; }
  });

  p.exercise({
    title: 'Hacia atrás',
    level: 'medio',
    gen: function (r) {
      var a = r.int(1, 6), b = r.int(1, 6), c = r.int(2, 12);
      var x = 2 * (2 * (c + b) + a);
      return { a: a, b: b, c: c, x: x };
    },
    ask: function (d) {
      return 'Salgo de casa con cierto dinero. En la primera tienda gasto la mitad de lo que llevo y $' + d.a + '$ € más. En la segunda, la mitad de lo que me queda y $' + d.b + '$ € más. Vuelvo con $' + d.c + '$ €. ¿Cuánto llevaba al salir?';
    },
    fields: [{ name: 'x', label: 'euros', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    errores: [{ si: function (v, d) { return v.x === 2 * d.c + 2 * d.b + 2 * d.a || v.x === 2 * (d.c + d.b) + d.a; }, msg: 'Deshaz los pasos en el orden exacto: primero se suman los euros extra y <em>después</em> se multiplica por 2, en cada tienda.' }],
    hint: function (d) { return ['Empieza por el final: antes de gastar los $' + d.b + '$ € extra de la segunda tienda tenía $' + d.c + ' + ' + d.b + '$.', 'Eso era la mitad de lo que llevaba al entrar en la segunda tienda: multiplica por 2. Repite con la primera.']; },
    steps: function (d) {
      var t2 = 2 * (d.c + d.b);
      return ['Al salir de la segunda tienda: $' + d.c + '$ €. Antes de los $' + d.b + '$ € extra: $' + (d.c + d.b) + '$ €, que era la mitad: al entrar tenía $' + t2 + '$ €.',
        'Al salir de la primera: $' + t2 + '$ €. Antes de los $' + d.a + '$ € extra: $' + (t2 + d.a) + '$ €, la mitad: al salir de casa llevaba $' + d.x + '$ €.',
        'Comprobación: $' + d.x + ' \\to ' + (d.x / 2 - d.a) + ' \\to ' + ((d.x / 2 - d.a) / 2 - d.b) + '$ ✓'];
    },
    answer: function (d) { return d.x + ' €'; }
  });

  p.exercise({
    title: 'De los casos pequeños a la fórmula',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'apretones de manos entre $n$ personas que se saludan todas', f: function (n) { return n * (n - 1) / 2; }, formula: '\\frac{n(n-1)}{2}' },
        { t: 'diagonales de un polígono convexo de $n$ lados', f: function (n) { return n * (n - 3) / 2; }, formula: '\\frac{n(n-3)}{2}' },
        { t: 'partidos de una liga de $n$ equipos a doble vuelta (ida y vuelta)', f: function (n) { return n * (n - 1); }, formula: 'n(n-1)' }
      ];
      var c = r.pick(casos), n = r.int(12, 40);
      return { c: c, n: n, v: c.f(n), peq: [3, 4, 5].map(function (k) { return c.f(k); }) };
    },
    ask: function (d) { return 'Calcula el número de ' + d.c.t + ' para $n = ' + d.n + '$.'; },
    fields: [{ name: 'v', label: 'número', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    hint: function (d) { return ['Haz los casos $n = 3, 4, 5$ a mano: salen ' + d.peq.join(', ') + '.', 'Piensa cuántos «le tocan» a cada elemento y si cada cosa se cuenta dos veces.']; },
    steps: function (d) { return ['Casos pequeños: ' + d.peq.join(', ') + '.', 'Razonando el mecanismo: $' + d.c.formula + '$.', 'Para $n = ' + d.n + '$: $' + d.v + '$.']; },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'El principio del palomar',
    level: 'medio',
    gen: function (r) {
      var col = r.int(2, 6), k = r.int(2, 4);
      return { col: col, k: k, v: col * (k - 1) + 1 };
    },
    ask: function (d) {
      return 'En un cajón a oscuras hay muchos calcetines de $' + d.col + '$ colores distintos. ¿Cuántos hay que sacar como mínimo para estar <strong>seguro</strong> de tener ' + d.k + ' del mismo color?';
    },
    fields: [{ name: 'v', label: 'calcetines', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{ si: function (v, d) { return v.v === d.col * (d.k - 1); }, msg: 'Con ese número todavía podrías tener exactamente ' + '$k-1$' + ' de cada color sin completar ninguno. Hace falta uno más.' }],
    hint: function (d) { return ['Piensa en el peor caso: ¿cuántos puedes sacar sin tener todavía ' + d.k + ' de ningún color?', 'Como mucho $' + (d.k - 1) + '$ de cada uno de los $' + d.col + '$ colores. El siguiente calcetín completa uno.']; },
    steps: function (d) { return ['En el peor caso se sacan $' + (d.k - 1) + '$ de cada color: $' + d.col + '\\cdot' + (d.k - 1) + ' = ' + (d.col * (d.k - 1)) + '$ calcetines sin conseguirlo.', 'El siguiente cae en algún color que ya tiene $' + (d.k - 1) + '$: hacen falta $' + d.v + '$.']; },
    answer: function (d) { return String(d.v); }
  });

  p.problem({
    title: 'Una estimación de Fermi',
    level: 'avanzado',
    gen: function (r) {
      var hab = r.pick([150000, 250000, 400000, 800000]), litros = r.pick([1.5, 2, 2.5]), fraccion = r.pick([0.4, 0.5, 0.6]);
      var dia = hab * litros * fraccion, anio = dia * 365, botellas = anio / 1.5;
      var mag = Math.floor(Math.log(botellas) / Math.LN10);
      return { hab: hab, litros: litros, fraccion: fraccion, dia: dia, anio: anio, botellas: botellas, mag: mag };
    },
    intro: function (d) {
      return 'Se quiere estimar cuántas botellas de agua de 1,5 litros se consumen en un año en una ciudad de $' + U.miles(d.hab) + '$ habitantes. Supuestos: cada persona bebe unos $' + U.fmt(d.litros, 1) + '$ litros de agua al día, y el $' + U.fmt(100 * d.fraccion, 0) + '\\,\\%$ de esa agua sale de botellas.';
    },
    partes: [
      {
        ask: function () { return '¿Cuántos litros de agua embotellada se beben al día en la ciudad?'; },
        fields: [{ name: 'v', label: 'litros al día', w: 'wide' }],
        sol: function (d) { return { v: d.dia }; },
        tol: 1e-6,
        hint: function () { return 'Habitantes por litros por persona por la fracción embotellada.'; },
        steps: function (d) { return ['$' + U.miles(d.hab) + '\\cdot' + U.fmt(d.litros, 1) + '\\cdot' + U.fmt(d.fraccion, 1) + ' = ' + U.miles(d.dia) + '$ litros al día.']; },
        answer: function (d) { return U.fmt(d.dia, 0); }
      },
      {
        ask: function () { return '¿Cuántas botellas al año?'; },
        fields: [{ name: 'v', label: 'botellas al año', w: 'wide' }],
        sol: function (d) { return { v: d.botellas }; },
        tol: 0.002,
        errores: [{ si: function (v, d) { return Math.abs(v.v - d.anio) / d.anio < 0.01; }, msg: 'Esos son litros. Cada botella tiene 1,5 litros: falta dividir.' },
          { si: function (v, d) { return Math.abs(v.v - d.dia / 1.5) / d.botellas < 0.01; }, msg: 'Eso es por día. Se pide al año: multiplica por 365.' }],
        hint: function () { return 'Multiplica por 365 días y divide entre 1,5 litros por botella.'; },
        steps: function (d) { return ['$' + U.miles(d.dia) + '\\cdot 365 = ' + U.miles(d.anio) + '$ litros al año.', '$' + U.miles(d.anio) + ' : 1{,}5 \\approx ' + U.miles(Math.round(d.botellas)) + '$ botellas.']; },
        answer: function (d) { return U.fmt(Math.round(d.botellas), 0); }
      },
      {
        ask: function () { return '¿De qué orden de magnitud es el resultado?'; },
        fields: [{ name: 'm', label: 'orden', opts: [{ t: 'decenas de millones', v: '7' }, { t: 'cientos de millones', v: '8' }, { t: 'millones', v: '6' }, { t: 'miles de millones', v: '9' }] }],
        sol: function (d) { return { m: String(d.mag) }; },
        hint: function () { return 'Escribe el número en notación científica y mira el exponente.'; },
        steps: function (d) { return ['$' + U.miles(Math.round(d.botellas)) + ' \\approx ' + U.fmt(d.botellas / Math.pow(10, d.mag), 1) + '\\cdot 10^{' + d.mag + '}$.', 'Validación: si cada supuesto estuviera equivocado en un 30 %, el orden de magnitud seguiría siendo el mismo. Eso es lo que hace útil una estimación de Fermi.']; },
        answer: function (d) { return '10^' + d.mag; }
      }
    ]
  });

  p.keys([
    'Cuatro fases: comprender, planear, ejecutar y <strong>examinar la solución</strong>, que es la que más errores caza.',
    'Casos pequeños: se ve el mecanismo; pero un patrón es una sospecha, no una prueba.',
    'Hacia atrás: si se conoce el final, se deshacen los pasos en orden inverso.',
    'Invariante: algo que no cambia; si no coincide con lo que se quiere lograr, es imposible.',
    'Palomar: más objetos que casillas obliga a que alguna casilla se repita.',
    'Modelizar es un ciclo: simplificar, matematizar, resolver, interpretar y validar.'
  ]);
});
