/* Tema: Aprenderse los ejemplos no es aprender */
Course.topic('ia-generalizar', function (p) {

  p.puente('Todo el bloque ha ido bajando la pérdida sobre los datos que había. Este tema dice que eso ' +
    '<strong>no es el objetivo</strong>. De [[al-polinomios|los polinomios]] viene el contraejemplo ' +
    'perfecto, de [[pe-inferencia|el muestreo]] la idea de que los datos son una muestra de algo más ' +
    'grande, y de [[pe-normal|tipificar]] la costumbre que hay que adoptar antes de entrenar nada.');

  p.text('Un modelo que acierta el 100 % de lo que ya ha visto puede ser completamente inútil. No es una ' +
    'paradoja ni una rareza: es lo que pasa por defecto si no se hace nada para evitarlo, y ' +
    'reconocerlo es lo que separa a quien entiende esto de quien solo sabe entrenar.');

  /* ---------------------------------------------------------------- */
  p.section('Un polinomio pasa por donde tú quieras');

  p.text('El contraejemplo lo tienes desde el bloque de álgebra. Por dos puntos pasa una recta; por tres, ' +
    'una parábola; y en general, <strong>por $n+1$ puntos cualesquiera pasa exactamente un polinomio ' +
    'de grado $n$</strong>. Si tienes ocho datos, un polinomio de grado siete pasa por los ocho, ' +
    'clavados.');

  p.formula('n+1 \\text{ puntos} \\;\\Longrightarrow\\; \\text{un polinomio de grado } n \\text{ con error } 0',
    'error cero, gratis y sin valor',
    'Se lee: <em>«ene más uno puntos implican un polinomio de grado ene con error cero»</em>.<br><br>' +
    'Es un teorema, no una casualidad: hay $n+1$ coeficientes por determinar y $n+1$ condiciones que ' +
    'cumplir, y el sistema tiene solución única.<br><br>La consecuencia es incómoda: ' +
    '<strong>conseguir error cero sobre los datos que tienes no demuestra absolutamente nada</strong>. ' +
    'Siempre se puede, subiendo el grado lo suficiente. La pregunta buena es otra: qué hace el modelo ' +
    'entre los puntos, que es donde de verdad se le va a usar.');

  p.demo({
    title: 'Subir el grado hasta que deje de servir',
    intro: 'Los puntos llenos son los ocho datos con los que se ajusta; los huecos, doce puntos que el modelo no ve nunca. La línea gris es la función de verdad, que en la vida real no se conoce. Sube el grado y vigila los dos errores de abajo: no hacen lo mismo.',
    predice: 'Con ocho puntos de entrenamiento y grado siete, el polinomio pasará exactamente por los ocho. ¿Crees que entonces el error sobre los puntos huecos será también el menor posible?',
    build: function (host) {
      var grado = 1;
      function verdad(x) { return Math.sin(2.2 * x) * 0.8 + 0.3 * x; }
      var ent = [], val = [], i, r = U.rng(21), r2 = U.rng(77);
      for (i = 0; i < 8; i++) {
        var x = -1 + i * 2 / 7;
        ent.push([x, verdad(x) + r.real(-0.35, 0.35, 3)]);
      }
      for (i = 0; i < 12; i++) {
        var xv = -1 + i * 2 / 11;
        val.push([xv, verdad(xv) + r2.real(-0.35, 0.35, 3)]);
      }
      var out = W.readout(host, '');
      function pinta() {
        var c = ajusta(ent.map(f0), ent.map(f1), grado, 0);
        var eEnt = emc(ent, c), eVal = emc(val, c);
        out.set('Grado <strong>' + grado + '</strong> &nbsp;·&nbsp; ' +
          'error sobre los datos de entrenamiento: <strong>' + U.fmt(eEnt, 5) + '</strong><br>' +
          'Error sobre los doce puntos que no ha visto: <strong style="color:var(--bad)">' + U.fmt(eVal, 5) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (grado <= 1 ? 'El modelo es demasiado rígido para seguir la forma: falla en los dos sitios. Eso es <strong>subajuste</strong>.'
            : (grado <= 3 ? 'Aquí está el fondo: el error sobre los no vistos es el menor de todos. Es el grado que habría que elegir.'
              : 'El error de entrenamiento sigue bajando hacia cero y el otro ha empezado a subir: el polinomio se está aprendiendo el ruido. Eso es <strong>sobreajuste</strong>.')) +
          '</span>');
        plot.render();
      }
      var plot = W.plot(host, {
        xmin: -1.25, xmax: 1.25, ymin: -1.7, ymax: 1.7, height: 320,
        xlabel: 'x', ylabel: 'y',
        aria: 'Diez puntos de entrenamiento, diez de validación y el polinomio ajustado, que oscila al subir el grado',
        draw: function (g) {
          g.fn(verdad, { color: 'axis', w: 2.6 });
          var c = ajusta(ent.map(f0), ent.map(f1), grado, 0);
          g.fn(function (x) { return evalua(c, x); }, { color: 2, w: 2.4 });
          val.forEach(function (q) { g.point(q[0], q[1], { color: 4, r: 4, hollow: true }); });
          ent.forEach(function (q) { g.point(q[0], q[1], { color: 0, r: 4 }); });
        }
      });
      W.slider(W.row(host), {
        label: 'grado del polinomio', min: 1, max: 7, step: 1, value: 1, dec: 0,
        on: function (v) { grado = v; pinta(); }
      });
      W.legend(host, [{ c: 0, t: 'entrenamiento' }, { c: 4, t: 'nunca vistos' }, { c: 2, t: 'el modelo' }]);
      pinta();
    }
  });

  p.text('Los dos errores cuentan historias distintas, y esa es la idea central del tema. El de ' +
    'entrenamiento <strong>siempre baja</strong> al dar más libertad al modelo, hasta llegar a cero. El ' +
    'otro baja, toca fondo y vuelve a subir. Ese fondo es el mejor modelo que se puede elegir, y para ' +
    'encontrarlo hay que tener datos apartados.');

  /* ---------------------------------------------------------------- */
  p.section('Los datos son una muestra');

  p.text('La razón de fondo la viste en [[pe-inferencia|muestreo e inferencia]]: los datos que tienes son ' +
    'una <strong>muestra</strong> de una población mucho mayor, y traen dos cosas mezcladas, la señal ' +
    '—lo que se repetiría en cualquier otra muestra— y el ruido, que es propio de esta y de ninguna ' +
    'más. Un modelo con demasiada libertad no sabe distinguirlos y se aprende los dos.');

  p.table(['', 'Error en entrenamiento', 'Error en datos nuevos', 'Qué pasa'], [
    ['<strong>Subajuste</strong>', 'alto', 'alto', 'el modelo es demasiado rígido para la forma de los datos'],
    ['<strong>Bien</strong>', 'bajo', 'bajo y parecido', 'ha cogido la señal y ha ignorado el ruido'],
    ['<strong>Sobreajuste</strong>', 'casi cero', 'alto', 'se ha aprendido también el ruido de esta muestra']
  ]);

  p.note('La señal de alarma no es que el error de entrenamiento sea bajo, sino que sea ' +
    '<strong>mucho más bajo que el otro</strong>. Un modelo con 0,1 % de error en entrenamiento y 12 % ' +
    'en datos nuevos está peor que uno con 6 % y 7 %, aunque el primer número impresione más.',
    'warn', 'Lo que hay que mirar es la diferencia');

  /* ---------------------------------------------------------------- */
  p.section('Tres montones, y por qué tres');

  p.text('Los datos se parten en tres. Con el primero se ajustan los parámetros. Con el segundo se toman ' +
    'las decisiones de diseño: el grado del polinomio, cuántas capas, cuánto regularizar. Y el tercero ' +
    '<strong>no se toca hasta el final</strong>.');

  p.table(['Montón', 'Para qué', 'Cuántas veces se usa'], [
    ['<strong>Entrenamiento</strong>', 'mover los parámetros con el gradiente', 'millones'],
    ['<strong>Validación</strong>', 'elegir entre modelos y ajustes', 'muchas: una por cada opción que se prueba'],
    ['<strong>Prueba</strong>', 'estimar de verdad qué tal va', '<strong>una sola vez</strong>']
  ]);

  p.text('El tercero parece un lujo y no lo es. Si pruebas cien configuraciones y te quedas con la mejor ' +
    'según la validación, esa mejor lo es <em>en parte por suerte</em>: has elegido el que mejor encaja ' +
    'con el ruido de ese montón concreto. Su error de validación ya no es una estimación honesta, ' +
    'porque lo has usado para elegir. El montón de prueba existe para tener un número que nadie ha ' +
    'mirado nunca.');

  p.comprueba('Has probado veinte modelos y eliges el de menor error de validación: un 4 %. ¿Qué esperas del error real?', [
    { t: 'Algo peor que el 4 %, porque al elegir el mejor de veinte se ha aprovechado parte del ruido de la validación', ok: true, por: 'Elegir el mínimo de veinte números con ruido devuelve un número optimista: el ganador lo es en parte por suerte. Por eso hace falta un tercer montón que no haya participado en la elección.' },
    { t: 'Exactamente un 4 %: la validación no se ha usado para entrenar', ok: false, por: 'No se ha usado para mover los parámetros, pero sí para <em>elegir</em>, y eso también la contamina. Cuantas más opciones se comparen, más optimista queda.' },
    { t: 'Mejor que el 4 %, porque el modelo final se entrena con todos los datos', ok: false, por: 'Reentrenar con más datos puede ayudar algo, pero no compensa el sesgo de haber elegido mirando ese mismo montón.' }
  ]);

  p.ejemplo({
    title: 'Grado 1 y grado 2, con números',
    enunciado: 'Los datos de entrenamiento son $(0,1)$, $(1,2)$ y $(2,2)$. Ajustar una recta por mínimos cuadrados y la parábola que pasa por los tres, comparar sus errores de entrenamiento, y evaluar las dos en el punto apartado $(3,3)$.',
    pasos: [
      { t: '<strong>La parábola.</strong> Con tres puntos y tres coeficientes el sistema es exacto: $c_0 = 1$, $c_0+c_1+c_2 = 2$ y $c_0+2c_1+4c_2 = 2$. Sale $c_2 = -0{,}5$, $c_1 = 1{,}5$: $p(x) = 1 + 1{,}5x - 0{,}5x^2$.', antes: 'Tres ecuaciones y tres incógnitas. ¿Qué coeficientes salen?' },
      { t: '<strong>Su error de entrenamiento.</strong> Pasa exactamente por los tres puntos, así que es <strong>cero</strong>. Imbatible.', antes: '¿Cuánto se equivoca en los puntos por los que pasa?' },
      { t: '<strong>La recta.</strong> Por mínimos cuadrados sale pendiente $0{,}5$ y ordenada $7/6$: $y = 1{,}1667 + 0{,}5x$. Sus errores son $\\frac16$, $-\\frac13$ y $\\frac16$, y el error cuadrático medio es $\\frac{1}{18} \\approx 0{,}0556$.', antes: 'La recta no puede pasar por los tres. ¿Cuánto falla en cada uno?' },
      { t: '<strong>El punto apartado.</strong> La parábola predice $p(3) = 1 + 4{,}5 - 4{,}5 = 1$, y el valor real es 3: se equivoca en 2, o sea 4 al cuadrado. La recta predice $1{,}1667 + 1{,}5 = 2{,}667$: se equivoca en $\\frac13$, o sea $0{,}111$ al cuadrado.', antes: 'Evalúa las dos en $x = 3$ y compara con el 3 real.' },
      { t: '<strong>El veredicto.</strong> La parábola gana por goleada en entrenamiento —cero contra $0{,}056$— y pierde por goleada fuera: $4$ contra $0{,}111$, treinta y seis veces peor. Elegir por el error de entrenamiento habría elegido justo el malo.' }
    ],
    cierre: 'Y fíjate en que la parábola no ha hecho nada raro: ha hecho exactamente lo que se le pedía, pasar por los tres puntos. El problema no es el modelo, es el criterio con el que se eligió.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Regularizar: castigar los pesos grandes');

  p.text('Hay una forma de quedarse con un modelo flexible sin que se descontrole: <strong>añadir a la ' +
    'pérdida un castigo por tener los coeficientes grandes</strong>. Es lo que permite las ' +
    'oscilaciones salvajes, así que penalizarlo las apaga.');

  p.formula('L_{\\text{total}} = L_{\\text{datos}} + \\lambda \\sum_i w_i^2',
    'regularización',
    'Se lee: <em>«ele total es ele de los datos más lambda por el sumatorio de los pesos al ' +
    'cuadrado»</em>.<br><br>El $\\lambda$ decide el precio. Con $\\lambda = 0$ no hay castigo y el ' +
    'modelo hace lo que quiere; con $\\lambda$ enorme, la única forma de no pagar es poner todos los ' +
    'pesos a cero, y el modelo se vuelve una línea plana. En medio está lo interesante, y dónde ' +
    'exactamente <strong>se decide con el montón de validación</strong>, no a ojo.');

  p.demo({
    title: 'El mismo grado siete, domado',
    intro: 'El polinomio es siempre de grado siete, el que antes se disparaba. Lo único que cambia es el precio que se le pone a tener coeficientes grandes. Súbelo poco a poco y mira cómo la curva se calma y el error sobre los puntos no vistos baja a la mitad.',
    predice: 'Con un castigo gigantesco, la única forma de no pagar sería poner todos los coeficientes a cero. ¿Qué forma tendría entonces la curva?',
    build: function (host) {
      var expo = -8;
      function verdad(x) { return Math.sin(2.2 * x) * 0.8 + 0.3 * x; }
      var ent = [], val = [], i, r = U.rng(21), r2 = U.rng(77);
      for (i = 0; i < 8; i++) {
        var x = -1 + i * 2 / 7;
        ent.push([x, verdad(x) + r.real(-0.35, 0.35, 3)]);
      }
      for (i = 0; i < 12; i++) {
        var xv = -1 + i * 2 / 11;
        val.push([xv, verdad(xv) + r2.real(-0.35, 0.35, 3)]);
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.25, xmax: 1.25, ymin: -1.7, ymax: 1.7, height: 310,
        xlabel: 'x', ylabel: 'y',
        aria: 'Un polinomio de grado nueve regularizado, cuya oscilación se calma al subir el castigo',
        draw: function (g) {
          g.fn(verdad, { color: 'axis', w: 2.6 });
          var c = ajusta(ent.map(f0), ent.map(f1), 7, Math.pow(10, expo));
          g.fn(function (x) { return evalua(c, x); }, { color: 2, w: 2.4 });
          val.forEach(function (q) { g.point(q[0], q[1], { color: 4, r: 4, hollow: true }); });
          ent.forEach(function (q) { g.point(q[0], q[1], { color: 0, r: 4 }); });
        }
      });
      function pinta() {
        var lam = Math.pow(10, expo);
        var c = ajusta(ent.map(f0), ent.map(f1), 7, lam);
        var suma = 0, j;
        for (j = 0; j < c.length; j++) suma += c[j] * c[j];
        out.set('Castigo $\\lambda = 10^{' + U.fmt(expo, 1) + '}$ &nbsp;·&nbsp; suma de los coeficientes al cuadrado: <strong>' +
          U.fmt(suma, 2) + '</strong><br>' +
          'Error en entrenamiento: <strong>' + U.fmt(emc(ent, c), 5) + '</strong> &nbsp;·&nbsp; ' +
          'en los no vistos: <strong style="color:var(--bad)">' + U.fmt(emc(val, c), 5) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (expo <= -4 ? 'Sin castigo apreciable, el grado siete hace lo que quiere: pasa por los ocho puntos, con error de entrenamiento cero, y se dispara entre ellos.'
            : (expo <= -0.5 ? 'Aquí está el punto bueno, alrededor de $\\lambda = 0{,}1$: el modelo sigue teniendo grado siete, pero ya no puede permitirse coeficientes enormes, y el error sobre los no vistos se ha reducido a la mitad.'
              : 'Castigo excesivo: los coeficientes se aplastan contra el cero y la curva se vuelve casi plana. Ahora el problema es el contrario, subajuste.')) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'exponente del castigo λ', min: -8, max: 1, step: 0.5, value: -8, dec: 1,
        on: function (v) { expo = v; pinta(); }
      });
      pinta();
    }
  });

  p.note('Fíjate en lo que <strong>no</strong> ha cambiado: el grado sigue siendo siete, o sea que el ' +
    'modelo sigue teniendo la misma capacidad teórica. Lo que se ha limitado es <em>cuánta de esa ' +
    'capacidad se atreve a usar</em>. Por eso en la práctica se prefiere poner un modelo grande y ' +
    'regularizarlo antes que buscar a mano el tamaño exacto.', 'ok', 'Capacidad y capacidad usada');

  /* ---------------------------------------------------------------- */
  p.section('Normalizar es tipificar');

  p.text('Queda una costumbre que hay que adoptar antes de entrenar nada, y es literalmente una fórmula ' +
    'que ya conoces. Si una columna está en milímetros y otra en kilómetros, sus números viven en ' +
    'escalas incomparables, y eso estropea las distancias, los gradientes y el castigo por pesos ' +
    'grandes. La solución es la de [[pe-normal|la normal]]: poner todas en la misma escala.');

  p.formula('x\' = \\frac{x - \\mu}{\\sigma}',
    'normalizar, que es tipificar',
    'Se lee: <em>«equis prima es equis menos mu, partido por sigma»</em>, y es exactamente la ' +
    'tipificación de la distribución normal.<br><br>Se aplica <strong>columna a columna</strong>: cada ' +
    'una con su propia media y su propia desviación. Después, todas tienen media 0 y desviación 1, así ' +
    'que ninguna manda sobre las demás solo por venir en unidades más grandes.<br><br>Y un detalle que ' +
    'se olvida siempre: $\\mu$ y $\\sigma$ se calculan <strong>solo con los datos de entrenamiento</strong>. ' +
    'Usar los de validación para calcularlas es dejar que el modelo se entere de algo que no debería ' +
    'saber.');

  p.util('Esto no es un tecnicismo académico: es la diferencia entre un modelo que funciona en el sitio ' +
    'donde se construyó y uno que funciona de verdad. Los modelos clínicos se publican con validación ' +
    '<em>externa</em>, en hospitales distintos del que aportó los datos, precisamente porque sin eso el ' +
    'número no significa nada. Y el caso de manual es Google Flu Trends: un modelo que predecía la ' +
    'gripe a partir de búsquedas, que encajaba muy bien con el histórico, y que a partir de 2012 empezó ' +
    'a sobrestimar la incidencia hasta que se retiró en 2015. Un análisis muy citado publicado en ' +
    '<em>Science</em> en 2014 lo usó como aviso de lo que pasa cuando se confunde ajustar con entender.');

  p.hist('La idea de apartar datos para evaluar es sorprendentemente moderna. La validación cruzada, que ' +
    'consiste en rotar qué trozo se aparta para aprovechar todos los datos, la formalizaron Mervyn ' +
    'Stone y Seymour Geisser en dos artículos de 1974 y 1975. Antes de eso lo normal era juzgar un ' +
    'modelo por lo bien que encajaba con los datos que lo habían producido, que es exactamente lo que ' +
    'este tema desaconseja. La teoría que explica <em>por qué</em> un modelo que acierta en una muestra ' +
    'debería acertar fuera de ella es la de Vapnik y Chervonenkis, la misma que hay detrás de ' +
    '[[ia-margen|las máquinas de vectores soporte]].');

  p.trampas([
    { e: 'Presumir de error cero en entrenamiento', por: 'Con un polinomio de grado suficiente siempre se consigue, y no demuestra nada. Lo que hay que enseñar es el error en datos que el modelo no ha visto.' },
    { e: 'Elegir el modelo con el montón de prueba', por: 'En cuanto se usa para elegir, deja de ser una estimación honesta. Para elegir está la validación; la prueba se mira una vez y al final.' },
    { e: 'Calcular la media y la desviación con todos los datos antes de partirlos', por: 'Las de validación se cuelan en la normalización y el modelo se entera de información que no debería tener. Se calculan solo con entrenamiento.' },
    { e: 'Confundir subajuste con sobreajuste', por: 'Los dos dan mal error fuera. Se distinguen mirando el de dentro: si también es malo, falta capacidad; si es casi cero, sobra.' },
    { e: 'Creer que regularizar reduce la capacidad del modelo', por: 'El grado sigue siendo nueve. Lo que se limita es cuánta de esa capacidad se usa, y por eso se puede poner un modelo grande sin miedo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El grado que pasa por todos',
    level: 'basico',
    gen: function (r) {
      var k = r.int(3, 25);
      return { k: k, g: k - 1 };
    },
    ask: function (d) {
      return 'Tienes $' + d.k + '$ datos. ¿De qué grado tiene que ser un polinomio para poder pasar ' +
        'exactamente por todos ellos, y cuánto valdrá entonces su error de entrenamiento?';
    },
    fields: [
      { name: 'g', label: 'grado', w: 'tiny' },
      { name: 'e', label: 'error', w: 'tiny' }
    ],
    sol: function (d) { return { g: d.g, e: 0 }; },
    errores: [{ si: function (v, d) { return v.g === d.k; }, msg: 'Un polinomio de grado $n$ tiene $n+1$ coeficientes, así que para $k$ puntos basta con grado $k-1$.' }],
    hint: function () { return 'Un polinomio de grado $n$ tiene $n+1$ coeficientes, y hacen falta tantos como puntos.'; },
    steps: function (d) {
      return ['Grado $' + d.k + ' - 1 = ' + d.g + '$: tiene $' + d.k + '$ coeficientes para $' + d.k + '$ condiciones.',
        'Pasa por todos los puntos, así que el error de entrenamiento es <strong>0</strong>.',
        'Y no significa nada: siempre se puede conseguir.'];
    },
    answer: function (d) { return 'grado ' + d.g + ', error 0'; }
  });

  p.exercise({
    title: 'Diagnosticar por los dos errores',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { a: '0,4 %', b: '11,0 %', v: 'sobre', por: 'Casi perfecto dentro y malo fuera: el modelo se ha aprendido el ruido de la muestra. Sobreajuste.' },
        { a: '14,0 %', b: '15,0 %', v: 'sub', por: 'Malo en los dos sitios y parecidos: al modelo le falta capacidad para la forma de los datos. Subajuste.' },
        { a: '5,0 %', b: '6,0 %', v: 'bien', por: 'Bajos y parecidos: ha cogido la señal sin aprenderse el ruido. Es lo que se busca.' },
        { a: '0,0 %', b: '23,0 %', v: 'sobre', por: 'Error cero dentro es la señal más clara de sobreajuste, sobre todo con un abismo así fuera.' },
        { a: '21,0 %', b: '22,0 %', v: 'sub', por: 'Los dos altos: no es que memorice, es que no llega. Hace falta más capacidad, no menos.' },
        { a: '3,0 %', b: '3,5 %', v: 'bien', por: 'Diferencia pequeña y los dos bajos: el modelo generaliza.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Un modelo comete un <strong>' + d.c.a + '</strong> de error sobre los datos de ' +
        'entrenamiento y un <strong>' + d.c.b + '</strong> sobre datos que no ha visto. ¿Qué le pasa?';
    },
    fields: [{ name: 'q', label: 'Diagnóstico', opts: [
      { t: 'sobreajuste: sobra capacidad', v: 'sobre' },
      { t: 'subajuste: falta capacidad', v: 'sub' },
      { t: 'está bien', v: 'bien' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Mira primero el de fuera: si es malo, hay problema. Después el de dentro: si también es malo, falta capacidad; si es casi cero, sobra.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Normalizar una columna',
    level: 'medio',
    gen: function (r) {
      var mu = r.int(20, 200), s = r.pick([2, 4, 5, 10, 25]);
      var k = r.pick([-2, -1.5, -0.5, 0.5, 1.5, 2, 3]);
      return { mu: mu, s: s, x: mu + k * s, z: k };
    },
    ask: function (d) {
      return 'Una columna tiene media $' + d.mu + '$ y desviación típica $' + d.s + '$, calculadas con ' +
        'los datos de entrenamiento. ¿En qué se convierte el valor $' + U.fmt(d.x, 1) + '$ al normalizar? ' +
        '(dos decimales)';
    },
    fields: [{ name: 'z', label: 'valor normalizado', w: 'tiny' }],
    sol: function (d) { return { z: U.round(d.z, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { return Math.abs(d.x - d.mu - d.z) > 0.005 && Math.abs(v.z - (d.x - d.mu)) < 0.005; }, msg: 'Has restado la media pero no has dividido por la desviación. Sin dividir, la columna sigue en sus unidades originales.' }],
    hint: function () { return 'Resta la media y divide por la desviación: es la tipificación de siempre.'; },
    steps: function (d) {
      return ['$\\dfrac{' + U.fmt(d.x, 1) + ' - ' + d.mu + '}{' + d.s + '} = \\dfrac{' + U.fmt(d.x - d.mu, 1) + '}{' + d.s + '} = ' + U.fmt(d.z, 2) + '$',
        'Ese número dice a cuántas desviaciones de la media está el dato, y ya no depende de las unidades.'];
    },
    answer: function (d) { return U.fmt(d.z, 2); }
  });

  p.exercise({
    title: 'Lo que cuesta el castigo',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 4), ws = [], i, suma = 0;
      for (i = 0; i < n; i++) { var w = r.nz(-6, 6); ws.push(w); suma += w * w; }
      var lam = r.pick([0.01, 0.1, 0.5]);
      var Ld = r.real(0.1, 2, 2);
      return { ws: ws, suma: suma, lam: lam, Ld: Ld, total: Ld + lam * suma };
    },
    ask: function (d) {
      return 'Un modelo tiene los pesos $' + d.ws.join('$, $') + '$ y su pérdida sobre los datos vale $' +
        U.fmt(d.Ld, 2) + '$. Con $\\lambda = ' + U.fmt(d.lam, 2) + '$, calcula la suma de los cuadrados ' +
        'y la pérdida total regularizada. (dos decimales)';
    },
    fields: [{ name: 's', label: 'Σw²', w: 'tiny' }, { name: 't', label: 'pérdida total', w: 'tiny' }],
    sol: function (d) { return { s: d.suma, t: U.round(d.total, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { var sinCuadrado = d.ws.reduce(function (a, w) { return a + w; }, 0); return Math.abs(sinCuadrado - d.suma) > 0.005 && Math.abs(v.s - sinCuadrado) < 0.005; }, msg: 'Has sumado los pesos sin elevarlos al cuadrado, y los negativos se han cancelado con los positivos. El castigo mira el tamaño, no el signo.' }],
    hint: function () { return 'Cada peso al cuadrado, se suman, y el resultado se multiplica por lambda antes de sumarlo a la pérdida.'; },
    steps: function (d) {
      return ['$\\sum w_i^2 = ' + d.ws.map(function (w) { return '(' + w + ')^2'; }).join(' + ') + ' = ' + d.suma + '$',
        'Castigo: $' + U.fmt(d.lam, 2) + ' \\times ' + d.suma + ' = ' + U.fmt(d.lam * d.suma, 2) + '$',
        'Total: $' + U.fmt(d.Ld, 2) + ' + ' + U.fmt(d.lam * d.suma, 2) + ' = ' + U.fmt(d.total, 2) + '$',
        'Al minimizar esto, el modelo tiene que decidir si le compensa un peso grande a cambio de ajustar mejor.'];
    },
    answer: function (d) { return 'Σw² = ' + d.suma + ', total ' + U.fmt(d.total, 2); }
  });

  p.exercise({
    title: 'Elegir el modelo con la tabla delante',
    level: 'avanzado',
    gen: function (r) {
      var mejor = r.int(1, 4);           // indice del grado optimo entre cuatro opciones
      var grados = [1, 3, 5, 9], ent = [], val = [], i;
      for (i = 0; i < 4; i++) {
        ent.push(U.round(0.32 / Math.pow(2.6, i) + r.real(0, 0.01, 3), 3));
        var d2 = Math.abs(i - (mejor - 1));
        val.push(U.round(0.09 + 0.11 * d2 * d2 + r.real(0, 0.008, 3), 3));
      }
      return { grados: grados, ent: ent, val: val, mejor: grados[mejor - 1], idx: mejor - 1 };
    },
    ask: function (d) {
      var f = d.grados.map(function (g, i) {
        return '<tr><td class="num">' + g + '</td><td class="num">' + U.fmt(d.ent[i], 3) +
          '</td><td class="num">' + U.fmt(d.val[i], 3) + '</td></tr>';
      }).join('');
      return 'Se han probado cuatro grados y estos son sus errores:' +
        '<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="num">grado</th>' +
        '<th class="num">entrenamiento</th><th class="num">validación</th></tr></thead><tbody>' + f +
        '</tbody></table></div>¿Qué grado se elige, y por qué no vale fijarse en la primera columna?';
    },
    fields: [
      { name: 'g', label: 'grado elegido', w: 'tiny' },
      { name: 'q', label: 'La primera columna', opts: [
        { t: 'siempre baja al subir el grado, así que no distingue', v: 'baja' },
        { t: 'mide el error real del modelo', v: 'real' },
        { t: 'sube al subir el grado', v: 'sube' }
      ] }
    ],
    sol: function (d) { return { g: d.mejor, q: 'baja' }; },
    errores: [{ si: function (v, d) { return d.mejor !== 9 && v.g === 9; }, msg: 'El grado 9 gana en entrenamiento, y por eso mismo no sirve como criterio: siempre gana el más flexible.' }],
    hint: function () { return 'Se elige por la columna de validación, que es la única que mide lo que pasa con datos no vistos.'; },
    steps: function (d) {
      return ['La columna de validación toca fondo en el grado <strong>' + d.mejor + '</strong>, con $' + U.fmt(d.val[d.idx], 3) + '$.',
        'La de entrenamiento baja siempre al subir el grado, así que elegir por ella llevaría siempre al grado más alto.',
        'Y después de elegir con validación, el número honesto hay que sacarlo de un tercer montón que no haya participado.'];
    },
    answer: function (d) { return 'grado ' + d.mejor; }
  });

  p.keys([
    'Error cero en entrenamiento es gratis: por $n+1$ puntos pasa un polinomio de grado $n$. No demuestra nada.',
    'Los datos son una muestra, y traen señal y ruido mezclados; un modelo con demasiada libertad se aprende los dos.',
    'La alarma no es que el error de dentro sea bajo, sino que sea mucho más bajo que el de fuera.',
    'Tres montones: entrenamiento para los parámetros, validación para elegir, y prueba una sola vez al final.',
    'Regularizar castiga los pesos grandes: no reduce la capacidad del modelo, sino cuánta se atreve a usar.',
    'Normalizar es tipificar, columna a columna, y con la media y la desviación calculadas solo con el entrenamiento.'
  ]);

  /* ---- ayudas de cálculo del tema ---- */
  function f0(q) { return q[0]; }
  function f1(q) { return q[1]; }

  /* Gauss con pivoteo parcial, que es lo que hace falta para resolver las
     ecuaciones normales de un ajuste polinomico. */
  function resuelve(A, b) {
    var n = b.length, i, j, k, M = [];
    for (i = 0; i < n; i++) { M.push(A[i].slice()); M[i].push(b[i]); }
    for (k = 0; k < n; k++) {
      var piv = k;
      for (i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
      var t = M[k]; M[k] = M[piv]; M[piv] = t;
      if (Math.abs(M[k][k]) < 1e-13) continue;
      for (i = k + 1; i < n; i++) {
        var f = M[i][k] / M[k][k];
        for (j = k; j <= n; j++) M[i][j] -= f * M[k][j];
      }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) {
      var s = M[i][n];
      for (j = i + 1; j < n; j++) s -= M[i][j] * x[j];
      x[i] = Math.abs(M[i][i]) < 1e-13 ? 0 : s / M[i][i];
    }
    return x;
  }

  /* Ajuste por minimos cuadrados con castigo lambda (cero = sin castigo). */
  function ajusta(xs, ys, grado, lam) {
    var n = grado + 1, A = [], b = [], i, j, k;
    for (i = 0; i < n; i++) {
      A.push([]);
      for (j = 0; j < n; j++) {
        var s = 0;
        for (k = 0; k < xs.length; k++) s += Math.pow(xs[k], i + j);
        A[i].push(s + (i === j ? (lam || 0) : 0));
      }
      var sb = 0;
      for (k = 0; k < xs.length; k++) sb += Math.pow(xs[k], i) * ys[k];
      b.push(sb);
    }
    return resuelve(A, b);
  }

  function evalua(c, x) {
    var s = 0, i;
    for (i = 0; i < c.length; i++) s += c[i] * Math.pow(x, i);
    return s;
  }

  function emc(pts, c) {
    var s = 0, i;
    for (i = 0; i < pts.length; i++) {
      var e = evalua(c, pts[i][0]) - pts[i][1];
      s += e * e;
    }
    return s / pts.length;
  }
});
