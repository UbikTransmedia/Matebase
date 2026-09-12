/* Tema: Predicción y filtrado: separar la señal del ruido */
Course.topic('cib-filtrado', function (p) {

  p.puente('Los bucles anteriores suponían que el sensor dice la verdad. Este tema empieza cuando no: ' +
    'lo medido es la señal más un ruido que no se conoce. Las herramientas son la media aritmética y el ' +
    'cociente incremental de [[fn-derivadas|derivadas]], y el resultado es un compromiso nuevo: cuanto ' +
    'más se limpia, más tarde se llega.');

  p.text('En 1940, con Europa en guerra y los bombardeos sobre Londres, se le encargó a Norbert Wiener ' +
    'un problema muy concreto: mejorar la puntería de los cañones antiaéreos. Un proyectil tarda ' +
    'unos segundos en llegar a la altura del avión, así que no hay que disparar a donde está el ' +
    'avión, sino <strong>a donde estará</strong>. Y lo único disponible para adivinarlo es una traza ' +
    'de radar temblorosa, llena de errores de medida.');

  p.text('Wiener no resolvió el problema del cañón —el sistema que salió de allí no llegó a usarse en ' +
    'combate—, pero al intentarlo formuló otro mucho más general, que resultó ser fundamental: ' +
    '<strong>dada una señal contaminada por ruido, ¿cuál es la mejor estimación posible de la señal ' +
    'verdadera, y de sus valores futuros?</strong> De ahí salió el filtro que lleva su nombre, y de ' +
    'ahí, unos años después, la cibernética entera.');

  p.hist('Aquel encargo tuvo una consecuencia que Wiener no buscaba. Trabajando en el problema se dio ' +
    'cuenta de que el artillero, el cañón y el avión formaban un solo sistema con un bucle, y de que ' +
    'ese bucle era <em>del mismo tipo</em> que el de una persona alargando la mano hacia un vaso: ver ' +
    'la desviación, corregirla, volver a ver. Ese salto —de la balística a la fisiología— es ' +
    'literalmente el momento en que nació la cibernética. Wiener contaba que la idea se afianzó ' +
    'discutiendo con Arturo Rosenblueth, un fisiólogo mexicano del Instituto de Cardiología, en las ' +
    'tertulias científicas que este organizaba en Harvard.');

  /* ---------------------------------------------------------------- */
  p.section('Señal y ruido');

  p.text('El punto de partida es una descomposición sencilla de enunciar y difícil de deshacer: lo que ' +
    'medimos es la suma de dos cosas.');

  p.formula('x(t) = s(t) + n(t)',
    'lo medido = lo verdadero + el ruido',
    'Se lee: <em>«equis de te es igual a ese de te más ene de te»</em>.<br><br>' +
    '$x(t)$ es lo que <strong>mide el aparato</strong>, $s(t)$ es la <strong>señal</strong> ' +
    'verdadera que nos interesa y $n(t)$ es el <strong>ruido</strong>: todo lo que se ha colado por el ' +
    'camino.<br><br>El problema tiene la pinta engañosa de un despeje: $s = x - n$. Pero el ruido no ' +
    'se conoce —si se conociera, no sería ruido—, así que no se puede restar. Hay que ' +
    '<em>estimarlo</em>, y ahí es donde empieza la matemática.');

  p.text('Lo que hace tratable el problema es que señal y ruido suelen comportarse de manera distinta. ' +
    'La señal que interesa —la posición de un avión, la temperatura de una habitación, el precio de ' +
    'algo— <strong>cambia despacio y con continuidad</strong>. El ruido, en cambio, salta arriba y ' +
    'abajo sin memoria: lo que valga ahora no dice nada de lo que valdrá al instante siguiente.');

  p.note('Esa diferencia es la palanca de todo el tema. Si la señal es suave y el ruido es brusco, ' +
    'entonces <strong>promediar destruye el ruido y respeta la señal</strong>: al sumar varios valores ' +
    'consecutivos, los saltos del ruido se cancelan entre sí —unos hacia arriba, otros hacia abajo— ' +
    'mientras que la señal, que apenas ha cambiado, sobrevive al promedio casi intacta.',
    'ok', 'Por qué promediar funciona');

  /* ---------------------------------------------------------------- */
  p.section('Suavizado y media móvil');

  p.text('El filtro más sencillo que existe es exactamente eso: sustituir cada valor por el promedio ' +
    'de los últimos. Se llama <strong>media móvil</strong>, y pese a su simpleza es probablemente el ' +
    'filtro más usado del mundo.');

  p.formula('\\hat{s}_n = \\frac{1}{k}\\sum_{j=0}^{k-1} x_{n-j}',
    'media móvil de ventana k',
    'El sombrero, $\\hat{s}$, se dice «ese estimada»: no es la señal verdadera, es nuestra ' +
    'aproximación de ella.<br><br>Se lee: <em>«ese estimada sub ene es igual a uno partido por ka, por ' +
    'el sumatorio, desde jota igual a cero hasta ka menos uno, de equis sub ene menos jota»</em>.' +
    '<br><br>En cristiano: <em>«mi estimación de ahora es el promedio de los últimos $k$ valores ' +
    'medidos»</em>. La $k$ es la <strong>ventana</strong>, y es el único mando del filtro.');

  p.text('Y aquí aparece el dilema que da sentido al tema. Cuanto más grande es la ventana, más ruido ' +
    'se cancela y más limpia sale la curva. Pero también <strong>más vieja</strong>: el promedio de ' +
    'los últimos veinte valores es, en realidad, una estimación de cómo estaban las cosas hace diez ' +
    'instantes. Suavizar cuesta retraso, y el retraso, como viste en [[cib-retardos|el tema de los retardos]], es lo que ' +
    'desestabiliza los bucles.');

  p.comprueba('Un informe usa la media móvil de 7 días de los casos diarios. El dato de hoy, ¿de qué día habla en realidad?', [
    { t: 'De hoy: es la media de hoy', ok: false, por: 'La media de los últimos 7 días mezcla hoy con los seis anteriores: su centro está hace tres días. Lo que se publica el sábado describe el miércoles.' },
    { t: 'De hace unos tres días: el centro de la ventana', ok: true, por: 'Con ventana $k$ el retraso es $(k-1)/2$; con $k = 7$, tres días. Es el precio de quitar el diente de sierra de los fines de semana.' },
    { t: 'De hace siete días: el más antiguo de la ventana', ok: false, por: 'El dato más antiguo pesa lo mismo que el más reciente; el promedio queda en medio, no en el extremo.' }
  ]);

  p.ejemplo({
    title: 'La media móvil se queda atrás',
    enunciado: 'Una señal sube un punto por instante: $10, 11, 12, 13, 14, 15$. Calcular la media móvil de ventana 3 en cada instante a partir del tercero y comparar con la señal.',
    pasos: [
      { t: '<strong>Instante 3.</strong> Ventana $10, 11, 12$: media 11. La señal vale 12. Va un punto por detrás.', antes: 'Promedia los tres primeros valores. ¿Cuánto vale la señal en ese momento?' },
      { t: '<strong>Instantes 4, 5 y 6.</strong> $(11+12+13)/3 = 12$, $(12+13+14)/3 = 13$, $(13+14+15)/3 = 14$. La señal vale 13, 14 y 15: siempre un punto por detrás.' },
      { t: '<strong>Por qué uno.</strong> El promedio de tres valores consecutivos es el del medio, que es de hace un instante: $(k-1)/2 = 1$. Con ventana 7 sería de hace 3.', antes: '¿Cuál de los tres valores de la ventana coincide con la media? ¿De cuándo es?' },
      { t: '<strong>Con ruido.</strong> Si la señal fuera $10, 12, 11, 14, 13, 16$, la misma subida con saltos de $\\pm 1$, las medias serían $11,\\ 12{,}3,\\ 12{,}7,\\ 14{,}3$: los saltos se han reducido a un tercio y el retraso sigue siendo uno. Ese es el compromiso: se paga el mismo retraso, se cobra menos ruido.' }
    ],
    cierre: 'En una señal que sube, la media móvil siempre marca menos de lo que hay; en una que baja, siempre más. No es un defecto del cálculo: es que promedia el pasado.'
  });

  p.demo({
    title: 'El compromiso entre suavidad y retraso',
    intro: 'La línea de puntos es la señal verdadera, que tú no puedes ver en la vida real. Los puntos sueltos son lo que mide tu sensor, con ruido. La línea gruesa es lo que sale del filtro. Sube la ventana y observa las dos cosas a la vez: la curva se limpia, y se va quedando atrás.',
    predice: 'Con ventana $k = 7$, ¿cuántos instantes irá por detrás la curva filtrada? Y con $k = 21$, ¿el error medio será menor o mayor que sin filtrar?',
    build: function (host, d) {
      var k = 1, ruido = 1.6, N = 130;
      var rng = U.rng(31415);
      var medidas = null;

      function verdadera(i) {
        return 10 + 7 * Math.sin(i / 16) + 2.2 * Math.sin(i / 5.5);
      }
      function generar() {
        var r = U.rng(31415);
        medidas = [];
        for (var i = 0; i <= N; i++) medidas.push(verdadera(i) + r.real(-ruido, ruido, 4) + r.real(-ruido, ruido, 4));
      }
      generar();

      function filtrar() {
        var out = [];
        for (var i = 0; i <= N; i++) {
          var s = 0, c = 0;
          for (var j = 0; j < k; j++) { if (i - j >= 0) { s += medidas[i - j]; c++; } }
          out.push([i, s / c]);
        }
        return out;
      }

      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: -2, ymax: 26, height: 320,
        xlabel: 'tiempo', ylabel: 'valor',
        draw: function (g) {
          var v = [];
          for (var i = 0; i <= N; i++) v.push([i, verdadera(i)]);
          g.path(v, { color: 3, w: 2, dash: true });
          for (var j = 0; j <= N; j += 1) g.point(j, medidas[j], { color: 'ink-faint', r: 1.9 });
          g.path(filtrar(), { color: 0, w: 3 });
        }
      });

      function paint() {
        // error frente a la verdad, y retraso estimado por correlacion
        var f = filtrar(), err = 0;
        for (var i = 0; i <= N; i++) err += Math.abs(f[i][1] - verdadera(i));
        err /= (N + 1);
        var errCrudo = 0;
        for (var j = 0; j <= N; j++) errCrudo += Math.abs(medidas[j] - verdadera(j));
        errCrudo /= (N + 1);
        var retraso = (k - 1) / 2;
        out.set('Ventana $k = ' + k + '$ &nbsp;·&nbsp; error medio del filtro: <strong>' + U.fmt(err, 3) +
          '</strong> (sin filtrar era ' + U.fmt(errCrudo, 3) + ')' +
          ' &nbsp;·&nbsp; retraso introducido: <strong>' + U.fmt(retraso, 1) + ' instantes</strong><br>' +
          (k === 1 ? 'Sin filtrar: ves el ruido entero, pero sin ningún retraso.'
            : (err < errCrudo * 0.55
              ? '<span style="color:var(--ok)">Buen compromiso: mucho menos ruido y el retraso todavía es asumible.</span>'
              : '<span style="color:var(--warn)">La curva sale muy limpia, pero fíjate en cómo va por detrás de la verdadera. En un bucle de control, eso desestabiliza.</span>')));
        plot.render();
      }

      var fila = W.row(host);
      W.slider(fila, { label: 'ventana k', min: 1, max: 30, step: 1, value: k, dec: 0, on: function (v) { k = v; paint(); } });
      W.slider(fila, { label: 'ruido del sensor', min: 0, max: 4, step: 0.05, value: ruido, on: function (v) { ruido = v; generar(); paint(); } });
      W.hint(host, 'Mira los picos y los valles: con ventana grande, la curva filtrada llega a ellos claramente después que la verdadera.');
      paint();
    }
  });

  p.util('Ese mando de ventana lo has usado sin saberlo. Las medias móviles de 7 días de los datos de ' +
    'una epidemia existen para quitar el diente de sierra de los fines de semana, y son la razón de ' +
    'que las curvas de los informes fueran suaves mientras los datos diarios daban saltos. En bolsa, ' +
    'las medias de 50 y 200 sesiones son exactamente esto. Y el podómetro del móvil filtra la señal ' +
    'del acelerómetro antes de contar un paso, porque si no contaría cada temblor.');

  p.util('El compromiso también explica un dilema muy real en salud pública y en gestión: <strong>los ' +
    'datos suavizados son más fiables y llegan más tarde</strong>. Quien decide con la media de siete ' +
    'días está viendo una foto de hace tres o cuatro; quien decide con el dato de ayer está viendo ' +
    'mucho ruido. No hay una respuesta correcta universal: depende de cuánto cueste equivocarse en ' +
    'cada sentido.');

  /* ---------------------------------------------------------------- */
  p.sub('La media móvil que no olvida de golpe');

  p.text('La media móvil de ventana $k$ tiene dos inconvenientes prácticos. Hay que guardar los últimos ' +
    '$k$ valores, y el que sale por detrás <strong>desaparece de golpe</strong>: un dato influye todo ' +
    'lo mismo durante $k$ pasos y después nada. Existe una variante que no guarda nada y que olvida ' +
    'poco a poco, y es la que más se usa.');

  p.formula('s_n = \\beta\\,s_{n-1} + (1-\\beta)\\,x_n',
    'media móvil exponencial',
    'Se lee: <em>«ese sub ene es beta por ese sub ene menos uno, más uno menos beta por equis sub ' +
    'ene»</em>.<br><br>Cada valor nuevo entra con peso $1-\\beta$ y todo lo anterior se encoge ' +
    'multiplicándose por $\\beta$. Desplegando la recurrencia, el dato de hace $k$ pasos pesa ' +
    '$(1-\\beta)\\beta^k$: una [[fn-sucesiones|progresión geométrica]] de razón $\\beta$, cuyos pesos ' +
    'suman exactamente 1.<br><br>No hay ventana que guardar: basta un número, $s_{n-1}$. La memoria ' +
    'efectiva es de unos $\\frac{1}{1-\\beta}$ valores, así que $\\beta = 0{,}9$ recuerda unos diez y ' +
    '$\\beta = 0{,}99$, unos cien.');

  p.note('Fíjate en que esto es <strong>el bucle del primer tema</strong> otra vez: escrito como ' +
    '$s_n = s_{n-1} + (1-\\beta)(x_n - s_{n-1})$, es una corrección proporcional al error con ganancia ' +
    '$K = 1-\\beta$, exactamente la de [[cib-realimentacion|la realimentación]]. Un filtro y un ' +
    'regulador son la misma ecuación mirada desde dos sitios.', 'ok', 'Otra vez el mismo bucle');

  p.note('Esa media móvil tiene un nombre general y una familia entera detrás. Deslizar una lista de ' +
    'pesos sobre una señal, multiplicando y sumando en cada posición, es una ' +
    '<strong>[[av-convolucion|convolución]]</strong>: con los pesos iguales sale esta media, con otros ' +
    'pesos sale un suavizado que respeta mejor los escalones, y con pesos que sumen cero sale un ' +
    'detector de cambios en vez de un suavizador.', 'ok', 'Esto tiene un nombre: convolución');

  p.section('De filtrar a predecir');

  p.text('El paso siguiente, y el que de verdad interesaba a Wiener, es el más ambicioso. Si el filtro ' +
    'sirve para estimar dónde <em>está</em> algo, ¿por qué no usar la misma información para estimar ' +
    'dónde <strong>estará</strong>?');

  p.text('La idea básica es sorprendentemente accesible con lo que ya sabes: si a la posición estimada ' +
    'le sumas la <em>velocidad</em> estimada multiplicada por el tiempo que va a tardar tu acción, ' +
    'obtienes una previsión. Y estimar la velocidad a partir de las medidas es calcular una derivada, ' +
    'que es justo lo que sabes hacer.');

  p.formula('\\hat{s}(t + \\Delta) \\approx \\hat{s}(t) + \\hat{s}\\,\'(t)\\cdot\\Delta',
    'predecir es extrapolar con la derivada',
    'El símbolo $\\approx$ se lee «aproximadamente igual». $\\Delta$ es la letra griega delta ' +
    'mayúscula y aquí es el tiempo que quieres adelantarte.<br><br>Se dice: <em>«ese estimada de te ' +
    'más delta es aproximadamente ese estimada de te, más la derivada de ese estimada en te, por ' +
    'delta»</em>.<br><br>Reconocerás la fórmula: es la <strong>recta tangente</strong> de ' +
    '[[fn-derivadas|derivadas]], usada como bola de cristal. Se supone que durante un ratito la señal seguirá con la ' +
    'misma pendiente que lleva.');

  p.sub('Por qué derivar es peligroso con datos ruidosos');

  p.text('Antes de seguir hace falta justificar algo que suele soltarse como si fuera evidente: que ' +
    '<strong>la derivada amplifica el ruido</strong>. Con un número se ve enseguida.');

  p.text('Supón que mides cada centésima de segundo, o sea $\\Delta t = 0{,}01$, y que tu sensor tiene ' +
    'un error de apenas una décima de unidad. Dos medidas seguidas pueden diferir en $0{,}2$ solo por ' +
    'el ruido —una se desvía hacia arriba y la siguiente hacia abajo—. Al estimar la derivada como ' +
    'cociente incremental, ese error se divide por el paso:');

  p.formula('\\frac{0{,}2}{0{,}01} = 20',
    'una décima de ruido, veinte de derivada falsa',
    'La cuenta es la del cociente incremental: variación partido por tiempo transcurrido.<br><br>' +
    'Lo importante es de dónde sale el desastre: <strong>el ruido no se divide, se multiplica por ' +
    '$1/\\Delta t$</strong>. Y $\\Delta t$ es pequeño precisamente porque queremos medir a menudo. ' +
    'Cuanto más rápido midas, peor: con paso de un milisegundo, esa misma décima de ruido produce una ' +
    'derivada falsa de 200.');

  p.text('Fíjate en la ironía: medir más a menudo <em>mejora</em> la estimación de la posición y ' +
    '<em>empeora</em> la de la velocidad. La señal verdadera apenas cambia en una centésima de ' +
    'segundo, así que su contribución al numerador es minúscula; el ruido, en cambio, salta lo mismo ' +
    'sin importar el paso. En el cociente, el ruido gana por goleada.');

  p.note('Y aquí está la tensión que hace difícil el problema, y la razón de que hiciera falta un ' +
    'Wiener. Para predecir necesitas la <strong>derivada</strong> de la señal; pero la derivada ' +
    'amplifica el ruido, como acabas de ver, así que antes tienes que <strong>suavizar</strong>; y ' +
    'suavizar introduce retraso, que es precisamente lo que querías compensar prediciendo. Las tres ' +
    'cosas tiran unas de otras, y el filtro de Wiener es la respuesta óptima a ese tira y afloja ' +
    'cuando se conocen las propiedades estadísticas de la señal y del ruido.',
    'warn', 'La pescadilla que se muerde la cola');

  p.hist('Wiener publicó su solución en 1942 en un informe militar de tapas amarillas que los ' +
    'ingenieros apodaron <em>the yellow peril</em> —«el peligro amarillo»— por lo arduo de sus ' +
    'matemáticas. Fue desclasificado en 1949. Poco después, en 1960, Rudolf Kálmán publicó una ' +
    'formulación distinta y mucho más práctica, que se podía calcular paso a paso y funcionaba en ' +
    'sistemas cambiantes: el <strong>filtro de Kalman</strong>. La NASA lo adoptó para el programa ' +
    'Apolo, y la navegación de las misiones a la Luna se hizo con él. Hoy va dentro de cada GPS, de ' +
    'cada dron y de cada coche que se sitúa en un carril.');

  p.util('Cuando el GPS de tu móvil te sitúa en la calle correcta pese a que la señal de los satélites ' +
    'llega con errores de varios metros, lo que está pasando es exactamente esto: un filtro combina ' +
    'las medidas ruidosas con un modelo de cómo te mueves —que no puedes teletransportarte, que ' +
    'llevas una velocidad— y produce una estimación mejor que cualquiera de las dos por separado. Por ' +
    'eso el punto azul sigue avanzando de forma razonable durante unos segundos aunque entres en un ' +
    'túnel: está prediciendo.');

  p.trampas([
    { e: 'Despejar $s = x - n$', por: 'El ruido no se conoce; si se conociera no sería ruido. Solo se puede estimar, y toda estimación es un compromiso.' },
    { e: 'Creer que la ventana grande es «más precisa» sin coste', por: 'Es más limpia y más vieja: con $k = 21$ describe lo que pasaba hace diez instantes. En un bucle de control, ese retraso desestabiliza.' },
    { e: 'Derivar datos crudos', por: 'Una décima de ruido con paso $0{,}01$ da una derivada falsa de 20. Antes de derivar hay que suavizar, y suavizar retrasa.' },
    { e: 'Medir más a menudo para estimar mejor la velocidad', por: 'Mejora la posición y empeora la velocidad: el ruido no se divide, se multiplica por $1/\\Delta t$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Aplica la media móvil',
    level: 'basico',
    gen: function (r) {
      var n = 7;
      var base = r.int(10, 30);
      var datos = [];
      for (var i = 0; i < n; i++) datos.push(base + r.int(-4, 4));
      var k = r.pick([2, 3]);
      return { datos: datos, k: k };
    },
    ask: function (d) {
      return 'Un sensor ha dado estas lecturas consecutivas:<br><br>$' + d.datos.join(', \\ ') + '$<br><br>' +
        'Calcula la media móvil de ventana $k = ' + d.k + '$ en el <strong>último</strong> instante, ' +
        'es decir, el promedio de las ' + d.k + ' últimas lecturas. (Dos decimales si no es exacta.)';
    },
    fields: [{ name: 'm', label: 'media =', w: 'tiny' }],
    sol: function (d) {
      var s = 0;
      for (var i = d.datos.length - d.k; i < d.datos.length; i++) s += d.datos[i];
      return { m: s / d.k };
    },
    dec: 2,
    hint: function (d) {
      return 'Solo intervienen las últimas ' + d.k + ' lecturas: las anteriores ya han salido de la ventana.';
    },
    steps: function (d) {
      var ult = d.datos.slice(d.datos.length - d.k);
      var s = ult.reduce(function (a, b) { return a + b; }, 0);
      return [
        'La ventana se queda con las últimas ' + d.k + ' lecturas: $' + ult.join(', ') + '$.',
        'Suma: $' + ult.join(' + ') + ' = ' + s + '$.',
        'Media: $' + s + ' / ' + d.k + ' = ' + U.fmt(s / d.k, 4) + '$.',
        'Fíjate en que el resultado se parece más a la media de la zona que a la última lectura suelta: eso es exactamente lo que queríamos.'
      ];
    }
  });

  p.exercise({
    title: 'Predice con la tangente',
    level: 'medio',
    gen: function (r) {
      var s = r.int(40, 200);
      var v = r.pm(2, 25);
      var dt = r.pick([2, 3, 4, 5]);
      return { s: s, v: v, dt: dt };
    },
    ask: function (d) {
      return 'Un objeto está en la posición $' + d.s + '$ m y su velocidad estimada es $' + d.v +
        '$ m/s.<br><br>Tu acción tardará <strong>' + d.dt + ' segundos</strong> en hacer efecto. ' +
        '¿A qué posición debes apuntar, suponiendo que la velocidad se mantenga?';
    },
    fields: [{ name: 'x', label: 'posición prevista', w: 'tiny' }],
    sol: function (d) { return { x: d.s + d.v * d.dt }; },
    tol: 1e-6,
    hint: function () { return 'Es la recta tangente: posición de ahora más velocidad por tiempo.'; },
    steps: function (d) {
      return [
        'Extrapolación lineal: $\\hat{s}(t+\\Delta) = s + v\\cdot\\Delta$.',
        'Sustituyendo: $' + d.s + ' + (' + d.v + ')\\cdot' + d.dt + ' = ' + (d.s + d.v * d.dt) + '$ m.',
        'Este es el cálculo que hacía el director de tiro antiaéreo, y el que hace hoy un sistema de ' +
          'seguimiento cuando la señal se pierde un instante.',
        'Su límite es claro: solo vale mientras la velocidad no cambie mucho. Si el objeto acelera o ' +
          'gira, la previsión falla, y por eso los filtros buenos estiman también la aceleración.'
      ];
    }
  });

  p.exercise({
    title: 'Elige la ventana',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Contar los pasos de una persona a partir de un acelerómetro que vibra mucho.', g: true },
        { t: 'Detectar el instante exacto en que un sensor de choque supera el umbral para disparar un airbag.', g: false },
        { t: 'Publicar la evolución semanal de casos de una enfermedad.', g: true },
        { t: 'Cortar la corriente en cuanto se detecta un cortocircuito.', g: false },
        { t: 'Mostrar la tendencia mensual del precio de la vivienda.', g: true },
        { t: 'Frenar un coche automáticamente al aparecer un obstáculo.', g: false }
      ];
      var c = r.pick(casos);
      return { texto: c.t, grande: c.g };
    },
    ask: function (d) {
      return 'Recuerda el compromiso: ventana grande da más suavidad y más retraso; ventana pequeña, ' +
        'menos retraso y más ruido.<br><br><em>«' + d.texto + '»</em><br><br>¿Qué conviene aquí, ' +
        'ventana <strong>grande</strong> o <strong>pequeña</strong>?';
    },
    fields: [{ name: 'q', label: 'Conviene una ventana', opts: [{ t: 'grande: más suavidad, más retraso', v: 'grande' }, { t: 'pequeña: menos retraso, más ruido', v: 'pequena' }] }],
    sol: function (d) { return { q: d.grande ? 'grande' : 'pequena' }; },
    hint: function () { return 'La pregunta clave es: ¿qué cuesta más caro aquí, equivocarse por ruido o llegar tarde?'; },
    steps: function (d) {
      return d.grande
        ? ['Aquí lo importante es ver bien la tendencia, y unos segundos o unos días de retraso no cambian ninguna decisión.',
           'Interesa cancelar el ruido todo lo posible.',
           'Conviene una ventana <strong>grande</strong>.']
        : ['Aquí llegar tarde es lo grave: la decisión tiene que tomarse en el instante.',
           'Se prefiere aguantar algo de ruido antes que retrasar la respuesta.',
           'Conviene una ventana <strong>pequeña</strong>, y a veces ninguna.'];
    },
    answer: function (d) { return d.grande ? 'grande' : 'pequeña'; }
  });

  p.keys([
    'Lo medido es señal más ruido, y el ruido no se puede restar porque no se conoce: hay que estimarlo.',
    'Promediar funciona porque la señal cambia despacio y el ruido salta sin memoria, de modo que se cancela solo.',
    'La <strong>media móvil</strong> sustituye cada valor por el promedio de los $k$ últimos; $k$ es su único mando.',
    'Ventana grande da más suavidad y <strong>más retraso</strong>: no hay filtro gratis.',
    'Predecir es extrapolar con la derivada, es decir, usar la recta tangente como bola de cristal.',
    'Wiener planteó este problema en 1940 para la artillería antiaérea; el filtro de Kalman de 1960 lo hizo práctico y llevó al hombre a la Luna.'
  ]);

});
