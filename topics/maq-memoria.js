/* Tema: Un bit que se acuerda: el biestable es un bucle con retardo */
Course.topic('maq-memoria', function (p) {

  p.puente('Todo lo que se ha montado hasta ahora tiene un defecto enorme: <strong>no se acuerda de ' +
    'nada</strong>. Un [[maq-sumador|sumador]] no sabe qué sumó hace un instante. Para arreglarlo hace ' +
    'falta traer dos ideas de [[cib-realimentacion|la cibernética]]: que un sistema puede alimentarse ' +
    'con su propia salida, y que [[cib-retardos|un retardo]] cambia por completo lo que ocurre.');

  p.text('Hasta aquí, cada circuito ha sido una función: se le ponen unas entradas y sale lo que tenga ' +
    'que salir. Cambia la entrada y cambia la salida, sin pasado. Eso se llama ' +
    '<strong>combinacional</strong>, y con eso no se hace un ordenador, porque un ordenador tiene que ' +
    'guardar dónde iba.');

  /* ---------------------------------------------------------------- */
  p.section('Morderse la cola');

  p.text('La idea es de una simplicidad que asusta: <strong>conectar la salida de una puerta a su propia ' +
    'entrada</strong>. Con dos puertas <code>nor</code> cruzadas, cada una alimentando a la otra, sale ' +
    'un circuito que ya no es una función de sus entradas: es una función de sus entradas ' +
    '<em>y de lo que tenía antes</em>.');

  p.text('Se le llama <strong>cerrojo</strong> o biestable, y tiene dos entradas con nombres que dicen lo ' +
    'que hacen: <code>s</code> de poner a uno y <code>r</code> de devolver a cero.');

  p.demo({
    title: 'El cerrojo que recuerda',
    intro: 'Dos nor cruzadas. Pon s a 1 y vuelve a ponerla a 0: q se queda en 1. Pon r a 1 y vuelve a 0: q se queda en 0. Con las dos entradas a cero el circuito no hace nada, y eso es exactamente lo que se le pide: que conserve. Recién cargado no viene de ningún sitio y avisa de que oscila; en cuanto le des una orden, deja de hacerlo.',
    predice: 'Con las dos entradas a 0, el circuito no recibe ninguna orden. ¿De qué crees que dependerá entonces su salida?',
    build: function (host) {
      W.circuito(host, {
        id: 'mem-cerrojo', alto: 220, tope: 60, salidas: ['q', 'qn'], memoria: true,
        texto: 'q = nor(r, qn);\nqn = nor(s, q);',
        aria: 'Dos puertas nor cruzadas: la salida de cada una entra en la otra, formando un bucle.',
        nota: 'Fíjate en que ningún cable entra «desde fuera» a <code>q</code> más que a través de la otra puerta. Ese bucle es toda la memoria.'
      });
    }
  });

  p.text('Mira ahora la tabla de verdad de ese banco, porque dice algo insólito. La fila de $s = 0$, ' +
    '$r = 0$ no trae un 0 ni un 1: pone <strong>oscila</strong>. No es que el programa no sepa ' +
    'calcularla; es que <em>esa fila no tiene respuesta</em>. Una tabla de verdad contesta «con estas ' +
    'entradas, esta salida», y aquí la salida depende de lo que pasó antes. Es la primera vez en el ' +
    'bloque que la tabla se queda corta, y es exactamente la señal de que este circuito ya no es una ' +
    'función.');

  p.note('Lo que acaba de pasar merece pararse. Este circuito tiene <strong>dos estados estables</strong> ' +
    'con las mismas entradas: con $s = 0$ y $r = 0$ puede estar en $q = 1$ o en $q = 0$, y los dos se ' +
    'sostienen solos indefinidamente. Por eso se llama <em>biestable</em>. Y como el estado depende de ' +
    'lo que pasó antes, <strong>el circuito tiene historia</strong>: es memoria, con dos puertas.',
    'ok', 'Dos estados, los dos estables');

  /* ---------------------------------------------------------------- */
  p.section('Por qué hace falta el retardo');

  p.text('Aquí hay algo que no cuadra si uno lo piensa como una fórmula. La primera puerta dice que $q$ ' +
    'depende de $qn$; la segunda, que $qn$ depende de $q$. Resolver eso como un sistema de ecuaciones ' +
    'no lleva a ninguna parte, porque cada una necesita a la otra ya resuelta.');

  p.text('Lo que falta es el <strong>tiempo</strong>. Un cable no transmite instantáneamente: tarda. ' +
    'Así que la lectura correcta no es «$q$ es igual a…» sino <strong>«$q$ dentro de un instante será ' +
    'lo que dicten las entradas de ahora»</strong>. Y con esa lectura, el bucle deja de ser una ' +
    'paradoja y pasa a ser una sucesión.');

  p.formulas([
    'q_{t+1} = \\text{nor}(r_t,\\ qn_t)',
    'qn_{t+1} = \\text{nor}(s_t,\\ q_t)'
  ], 'el cerrojo, leído como una sucesión');

  p.note('Esto es exactamente lo que hace el simulador de este curso, y es la razón de que avance ' +
    '<strong>por instantes</strong> en vez de resolver el circuito de un tirón. Un circuito sin bucles ' +
    'se podría resolver de golpe, ordenando las puertas de las entradas hacia la salida; pero entonces ' +
    'este tema sería imposible, porque aquí no hay ningún orden que valga. Todas las puertas calculan ' +
    'a la vez con los valores del instante anterior, que es lo que hace un cable de verdad.',
    'ok', 'Por qué el simulador va como va');

  p.demo({
    title: 'Instante a instante',
    intro: 'El mismo cerrojo, pero mirándolo despacio. Éste arranca con un 0 ya guardado (q = 0, qn = 1) y sus conmutadores no resuelven el circuito: solo cambian las entradas y dejan los cables como estaban. Pon s a 1 —no pasará nada todavía— y ve pulsando «Un instante» para ver el cambio dar la vuelta al bucle en vez de aparecer de golpe. Con «Estabilizar» se llega al final de una vez.',
    predice: 'El cambio tiene que dar la vuelta al bucle entero. ¿Crees que tardará uno, dos o muchos instantes?',
    build: function (host) {
      W.circuito(host, {
        id: 'mem-instantes', alto: 220, tope: 60, salidas: ['q', 'qn'],
        memoria: true, pausa: true, inicial: { q: 0, qn: 1 },
        texto: 'q = nor(r, qn);\nqn = nor(s, q);',
        aria: 'El mismo cerrojo, para recorrerlo instante a instante con el botón.',
        nota: 'Fíjate en el instante intermedio: hay un momento en que <code>q</code> y <code>qn</code> valen 0 las dos, algo que «no debería» poder pasar. Es el cambio dando la vuelta al bucle.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cuando no se decide');

  p.text('El bucle tiene un precio, y es honesto enseñarlo. Si las dos entradas están a cero y el ' +
    'circuito <strong>no viene de ningún sitio</strong> —si arranca con todo apagado—, ocurre algo ' +
    'curioso: las dos puertas se persiguen y el circuito nunca se queda quieto. Se enciende, se apaga, ' +
    'se enciende.');

  p.text('El simulador lo detecta y lo dice: <strong>oscila</strong>. No es un fallo del programa ni una ' +
    'trampa; es lo que de verdad le pasa a un cerrojo ideal sin historia previa. En un circuito real ' +
    'las dos puertas nunca son exactamente iguales, y la más rápida acaba ganando: el cerrojo cae a ' +
    'un lado u otro por puro azar de fabricación. A ese momento de indecisión se le llama ' +
    '<strong>metaestabilidad</strong>, y es un problema real que los diseñadores tienen que tener en ' +
    'cuenta de verdad.');

  p.note('Para verlo cuando quieras hay un botón, <strong>«⏻ Apagar y encender»</strong>: borra lo que el ' +
    'circuito tuviera guardado y lo deja como sale de fábrica, con todos los cables a cero. Púlsalo con ' +
    'las dos entradas a 0 y el aviso dirá que oscila. Después pon <code>s</code> a 1, suéltala, y vuelve ' +
    'a dejar las dos a 0: ahora se queda quieto, porque ya tiene pasado.',
    'warn', 'Cómo provocar la oscilación');

  p.text('Y ese botón enseña de paso algo que todo el mundo ha sufrido: esta memoria es ' +
    '<strong>volátil</strong>. Lo que guarda lo guarda mientras haya corriente, porque lo que lo ' +
    'sostiene es el propio bucle funcionando. Quita la alimentación y no queda nada que recordar. Por ' +
    'eso un ordenador pierde lo que no habías guardado en cuanto se va la luz, y por eso el disco, que ' +
    'sí conserva sin corriente, está hecho con otra cosa —imanes o cargas atrapadas—, no con puertas.');

  p.text('Y hay una segunda combinación incómoda: poner <code>s</code> y <code>r</code> a 1 a la vez. El ' +
    'circuito responde poniendo las dos salidas a 0, lo cual contradice sus nombres —se supone que ' +
    '<code>q</code> y <code>qn</code> son contrarias— y, peor aún, al soltar las dos a la vez el ' +
    'cerrojo queda otra vez indeciso. Por eso esa combinación se declara prohibida y los circuitos de ' +
    'verdad llevan puertas de más para que no pueda darse.');

  /* ---------------------------------------------------------------- */
  p.section('El reloj');

  p.text('Un cerrojo suelto tiene un problema práctico: hace caso a sus entradas <em>en cuanto cambian</em>. ' +
    'Si varias partes del circuito van a distinta velocidad —y van, como se vio con ' +
    '[[maq-sumador|el acarreo]]—, unas leerían el valor viejo y otras el nuevo.');

  p.text('La solución es poner a todo el mundo de acuerdo con una señal común que va marcando el compás: ' +
    'el <strong>reloj</strong>. Se añade una puerta que solo deja entrar las órdenes cuando el reloj ' +
    'está a 1, de modo que el cerrojo cambia en momentos concretos y no cuando le llegue la gana.');

  p.demo({
    title: 'Un cerrojo con permiso',
    intro: 'Igual que antes, pero las órdenes solo pasan si el reloj está a 1. Pon reloj a 0 y cambia dato: no ocurre nada. Súbelo a 1 y el cambio entra.',
    predice: 'Con el reloj a 0, ¿crees que el dato de entrada tiene algún efecto sobre lo guardado?',
    build: function (host) {
      W.circuito(host, {
        id: 'mem-reloj', alto: 280, tope: 60, salidas: ['q', 'qn'], memoria: true, inicial: { q: 0, qn: 1 },
        texto: 'ndato = not(dato);\n' +
               'pon = and(dato, reloj);\n' +
               'borra = and(ndato, reloj);\n' +
               'q = nor(borra, qn);\n' +
               'qn = nor(pon, q);',
        aria: 'Un cerrojo con una puerta de permiso: las órdenes solo pasan cuando el reloj vale 1.',
        nota: 'Un solo cable de datos en vez de dos órdenes: así es imposible pedirle poner y borrar a la vez, que era la combinación prohibida.'
      });
    }
  });

  p.text('Con esto ya está todo lo que hace falta para una memoria: poniendo ocho de estos en fila, con ' +
    'el mismo reloj, se guarda un byte entero. A eso se le llama <strong>registro</strong>, y es lo que ' +
    'hay dentro de un procesador en los sitios donde guarda lo que está usando ahora mismo.');

  p.ejemplo({
    title: 'Seguir el cerrojo instante a instante',
    enunciado: 'Partiendo de $q = 0$, $qn = 1$, y con $s = 1$, $r = 0$, escribir qué valen $q$ y $qn$ en los instantes siguientes hasta que se estabilice.',
    pasos: [
      { t: '<strong>El punto de partida.</strong> $q = 0$, $qn = 1$, con $s = 1$ y $r = 0$.', antes: 'Anota el estado de los dos cables antes de empezar.' },
      { t: '<strong>Primer instante.</strong> Las dos puertas calculan a la vez con los valores de ahora: $q$ será $\\text{nor}(r{=}0,\\ qn{=}1) = 0$, y $qn$ será $\\text{nor}(s{=}1,\\ q{=}0) = 0$. Queda $q = 0$, $qn = 0$.', antes: 'Cuidado: las dos usan los valores VIEJOS, no el que acaba de calcular la otra.' },
      { t: '<strong>Segundo instante.</strong> Ahora $q = \\text{nor}(0,\\ 0) = 1$ y $qn = \\text{nor}(1,\\ 0) = 0$. Queda $q = 1$, $qn = 0$.' },
      { t: '<strong>Tercer instante.</strong> $q = \\text{nor}(0,\\ 0) = 1$ y $qn = \\text{nor}(1,\\ 1) = 0$. No ha cambiado nada: <strong>estable</strong>.' },
      { t: '<strong>Y ahora lo importante.</strong> Si se baja $s$ a 0, en el instante siguiente $q = \\text{nor}(0, 0) = 1$ y $qn = \\text{nor}(0, 1) = 0$: sigue igual. La orden ha desaparecido y el 1 se ha quedado. Eso es recordar.' }
    ],
    cierre: 'Fíjate en que en el primer instante los dos cables valieron 0 a la vez, algo que «no debería» pasar. Es un estado de paso, y existe porque la señal tarda en dar la vuelta al bucle. Sin ese retardo no habría memoria. Es exactamente lo que va enseñando el banco de «Instante a instante» si lo pulsas paso a paso: 0 y 1, luego 0 y 0, luego 1 y 0, y ahí se queda.'
  });

  p.comprueba('¿Por qué un circuito con un bucle no se puede resolver como un sistema de ecuaciones, ordenando las puertas de la entrada a la salida?', [
    { t: 'Porque cada puerta del bucle necesita el valor de la otra, y no hay ninguna por la que empezar', ok: true, por: 'En un circuito sin bucles siempre hay un orden: cada puerta depende de otras que ya están resueltas. En cuanto hay un bucle ese orden no existe, y la única lectura que tiene sentido es la temporal: cada puerta calcula con lo que había un instante antes.' },
    { t: 'Porque las puertas nor no tienen solución algebraica', ok: false, por: 'Las nor son tan resolubles como cualquier otra puerta. El problema no es la puerta sino la forma del circuito: el bucle.' },
    { t: 'Porque hay dos salidas en vez de una', ok: false, por: 'Un circuito puede tener todas las salidas que quiera sin ningún problema. Lo que impide ordenarlo es que una salida vuelve a entrar.' }
  ]);

  p.util('Todo lo que un ordenador «sabe» ahora mismo está guardado en circuitos como éste. Los registros ' +
    'del procesador, que es donde viven los números con los que está operando en este instante, son ' +
    'filas de biestables; y la memoria caché, que es la rápida y la cara, también. La memoria principal ' +
    'usa otra técnica más barata y más lenta —un condensador diminuto que se va descargando y hay que ' +
    'refrescar miles de veces por segundo—, y esa diferencia de tecnología es exactamente la razón de ' +
    'que un ordenador tenga poca memoria rápida y mucha memoria lenta. La metaestabilidad tampoco es ' +
    'teórica: cuando dos partes de un sistema van con relojes distintos, el dato que cruza de una a ' +
    'otra puede pillar al biestable en mitad de la duda, y por eso se encadenan dos o tres seguidos ' +
    'para darle tiempo a decidirse.');

  p.hist('El circuito lo publicaron en 1919 <strong>William Eccles</strong> y <strong>Frank Jordan</strong>, ' +
    'con válvulas de vacío y sin la menor intención de guardar datos: buscaban un contador para ' +
    'experimentos de física. Lo llamaron <em>trigger relay</em>, y en inglés todavía se le dice ' +
    '<em>flip-flop</em> por el sonido de bascular de un lado a otro. Que aquello servía para ' +
    '<em>recordar</em> se entendió después, y es lo que convirtió una calculadora en un ordenador: una ' +
    'máquina que no solo opera, sino que guarda dónde iba.');

  p.trampas([
    { e: 'Resolver el bucle como una ecuación', por: 'No tiene solución por ese camino: cada puerta necesita a la otra. Hay que leerlo en el tiempo, con el valor del instante anterior.' },
    { e: 'Creer que la oscilación es un fallo del simulador', por: 'Es lo que de verdad le pasa a un cerrojo ideal sin historia previa. En un circuito real gana la puerta más rápida, y eso tiene nombre: metaestabilidad.' },
    { e: 'Poner <code>s</code> y <code>r</code> a 1 a la vez', por: 'Las dos salidas se van a 0, que contradice sus nombres, y al soltarlas el cerrojo queda indeciso. Por eso se prohíbe y se añaden puertas para que no pueda ocurrir.' },
    { e: 'Pensar que el reloj hace el circuito más rápido', por: 'Lo hace más lento, y a propósito: obliga a esperar a que todo el mundo esté listo. Lo que gana es que los cambios ocurran en momentos conocidos.' },
    { e: 'Confundir memoria con el biestable de este tema', por: 'Los registros y la caché sí son biestables. La memoria principal usa condensadores, que son más baratos y más lentos, y hay que refrescarlos constantemente.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Qué recuerda el cerrojo',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { s: 1, r: 0, q0: 0, q: 1, por: 'La orden de poner a uno hace su trabajo: $q$ sube a 1 y se queda.' },
        { s: 0, r: 1, q0: 1, q: 0, por: 'La orden de borrar hace su trabajo: $q$ baja a 0.' },
        { s: 0, r: 0, q0: 1, q: 1, por: 'Sin órdenes, el cerrojo conserva lo que tenía: seguía valiendo 1.' },
        { s: 0, r: 0, q0: 0, q: 0, por: 'Sin órdenes, conserva: seguía valiendo 0.' },
        { s: 1, r: 0, q0: 1, q: 1, por: 'Ya valía 1 y se le pide poner a 1: no cambia nada.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Un cerrojo guardaba <code>q = ' + d.c.q0 + '</code>. Se le ponen las entradas ' +
        '<code>s = ' + d.c.s + '</code> y <code>r = ' + d.c.r + '</code>. ¿Cuánto vale <code>q</code> ' +
        'cuando se estabiliza?';
    },
    fields: [{ name: 'q', label: 'q', w: 'tiny' }],
    sol: function (d) { return { q: d.c.q }; },
    tol: 0.1,
    hint: function () { return '<code>s</code> pone a 1, <code>r</code> pone a 0, y con las dos a 0 el cerrojo conserva lo que tuviera.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return String(d.c.q); }
  });

  p.exercise({
    title: 'Un instante del bucle',
    level: 'medio',
    gen: function (r) {
      var s = r.int(0, 1), rr = r.int(0, 1), q = r.int(0, 1), qn = r.int(0, 1);
      return { s: s, r: rr, q: q, qn: qn, nq: (rr || qn) ? 0 : 1, nqn: (s || q) ? 0 : 1 };
    },
    ask: function (d) {
      return 'En un cerrojo de dos <code>nor</code> cruzadas, ahora mismo <code>q = ' + d.q + '</code> y ' +
        '<code>qn = ' + d.qn + '</code>, con <code>s = ' + d.s + '</code> y <code>r = ' + d.r + '</code>. ' +
        'Las dos puertas calculan <strong>a la vez</strong> con estos valores. ¿Qué valdrán en el instante siguiente?';
    },
    fields: [{ name: 'a', label: 'q siguiente', w: 'tiny' }, { name: 'b', label: 'qn siguiente', w: 'tiny' }],
    sol: function (d) { return { a: d.nq, b: d.nqn }; },
    tol: 0.1,
    errores: [{ si: function (v, d) {
      var enCadena = (d.r || ((d.s || d.q) ? 0 : 1)) ? 0 : 1;
      return enCadena !== d.nq && Math.abs(v.a - enCadena) < 0.1;
    }, msg: 'Has usado el <code>qn</code> recién calculado para hallar <code>q</code>. Las dos puertas calculan a la vez, cada una con los valores <em>viejos</em>: ahí está el retardo.' }],
    hint: function (d) { return '<code>q</code> nueva es <code>nor(r, qn)</code> con la <code>qn</code> de ahora, que vale ' + d.qn + '. Y <code>qn</code> nueva es <code>nor(s, q)</code> con la <code>q</code> de ahora, que vale ' + d.q + '.'; },
    steps: function (d) {
      return ['$q$ siguiente $= \\text{nor}(' + d.r + ',\\ ' + d.qn + ') = ' + d.nq + '$.',
        '$qn$ siguiente $= \\text{nor}(' + d.s + ',\\ ' + d.q + ') = ' + d.nqn + '$.',
        'Las dos han usado los valores del instante actual, no los que acaban de salir.'];
    },
    answer: function (d) { return d.nq + ' y ' + d.nqn; }
  });

  p.exercise({
    title: 'Cuántos biestables hacen falta',
    level: 'medio',
    gen: function (r) {
      var cosa = r.pick([
        { t: 'un registro que guarde un byte', bits: 8 },
        { t: 'un contador de programa que llegue hasta la dirección 255', bits: 8 },
        { t: 'un registro de 16 bits', bits: 16 },
        { t: 'una memoria de 4 palabras de 8 bits', bits: 32 }
      ]);
      return { t: cosa.t, bits: cosa.bits, puertas: cosa.bits * 2 };
    },
    ask: function (d) {
      return 'Para ' + d.t + ', ¿cuántos biestables hacen falta, y cuántas puertas <code>nor</code> ' +
        'serían si cada biestable se montara con dos?';
    },
    fields: [{ name: 'b', label: 'biestables', w: 'tiny' }, { name: 'p', label: 'puertas nor', w: 'tiny' }],
    sol: function (d) { return { b: d.bits, p: d.puertas }; },
    tol: 0.5,
    hint: function () { return 'Un biestable guarda exactamente un bit. Y cada uno son dos <code>nor</code> cruzadas.'; },
    steps: function (d) {
      return ['Un bit por biestable: hacen falta $' + d.bits + '$.',
        'Dos <code>nor</code> cada uno: $2 \\times ' + d.bits + ' = ' + d.puertas + '$ puertas.',
        'Y eso sin contar las puertas del reloj, que en la práctica añaden unas cuantas más por bit.'];
    },
    answer: function (d) { return d.bits + ' biestables y ' + d.puertas + ' puertas'; }
  });

  p.exercise({
    title: 'Qué pasa en cada situación',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'las dos entradas están a 0 y el circuito acaba de encenderse, sin ningún pasado', v: 'oscila', por: 'No hay nada que conservar, y las dos puertas se persiguen: el simulador anuncia que oscila. En un circuito real gana la puerta que sea un poco más rápida, y el cerrojo cae a un lado por azar de fabricación. Eso es la metaestabilidad.' },
        { t: 'se ponen <code>s</code> y <code>r</code> a 1 al mismo tiempo', v: 'prohibida', por: 'Las dos salidas se van a 0, lo que contradice que <code>q</code> y <code>qn</code> sean contrarias; y al soltar las dos a la vez el cerrojo queda indeciso. Por eso esa combinación se declara prohibida.' },
        { t: 'se pone <code>s</code> a 1, se suelta, y luego se dejan las dos entradas a 0', v: 'recuerda', por: 'El 1 se queda guardado. La orden ha desaparecido y el estado permanece: eso es exactamente lo que significa recordar, y es para lo que sirve el bucle.' },
        { t: 'el reloj está a 0 y cambia el cable de datos', v: 'nopasa', por: 'No ocurre nada: la puerta de permiso no deja pasar la orden. Eso es lo que aporta el reloj, que los cambios ocurran en momentos conocidos y no cuando lleguen.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un cerrojo, ' + d.c.t + '. ¿Qué ocurre?'; },
    fields: [{ name: 'q', label: 'Ocurre que', opts: [
      { t: 'oscila: no se queda quieto', v: 'oscila' },
      { t: 'es la combinación prohibida', v: 'prohibida' },
      { t: 'conserva lo que se le puso', v: 'recuerda' },
      { t: 'no pasa nada: falta el permiso', v: 'nopasa' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Piensa si hay orden o no, si hay pasado o no, y si el reloj deja pasar.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un circuito sin bucles no recuerda nada: su salida depende solo de sus entradas de ahora.',
    'Conectando la salida de una puerta a su propia entrada aparece un <strong>biestable</strong>: dos estados que se sostienen solos con las mismas entradas.',
    'El bucle no se puede resolver como ecuación porque no hay por dónde empezar. Se lee en el tiempo: cada puerta calcula con lo que había un instante antes.',
    'Ese retardo del cable <strong>es</strong> la memoria. Sin él no habría estado que conservar.',
    'Sin historia previa y sin órdenes, el cerrojo oscila: es la metaestabilidad, y en un circuito real la resuelve por azar la puerta más rápida.',
    'El reloj añade una puerta de permiso para que los cambios ocurran en momentos conocidos, y ocho cerrojos con el mismo reloj son un registro.'
  ]);
});
