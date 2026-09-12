/* Tema: La máquina mínima: buscar, decodificar, ejecutar */
Course.topic('maq-cpu', function (p) {

  p.puente('Con lo que hay hasta aquí ya se puede construir cualquier cosa que quepa en una tabla de ' +
    'verdad, y además guardarla. Pero un circuito sigue haciendo <strong>una sola cosa</strong>: el ' +
    '[[maq-sumador|sumador]] suma y no sabe hacer nada más. Lo que falta para llegar a un ordenador es ' +
    'la última vuelta de tuerca, y es sorprendentemente pequeña.');

  p.text('La idea es ésta: en vez de construir un circuito por tarea, se construye <strong>uno solo que ' +
    'obedece órdenes</strong>, y las órdenes se guardan en la memoria como números. Cambiar lo que hace ' +
    'la máquina deja de ser cuestión de soldar y pasa a ser cuestión de escribir otros números. Eso es ' +
    'un ordenador, y no hay nada más.');

  /* ---------------------------------------------------------------- */
  p.section('El ciclo, que son tres tiempos');

  p.text('La máquina no hace más que repetir tres pasos, para siempre, hasta que le dicen que pare:');

  p.list([
    '<strong>Buscar.</strong> Ir a la celda de memoria que marca el <em>contador de programa</em> y traerse el número que hay ahí.',
    '<strong>Decodificar.</strong> Mirar qué instrucción es ese número y encender los cables que hagan falta.',
    '<strong>Ejecutar.</strong> Hacerlo, y dejar el contador apuntando a la siguiente.'
  ], true);

  p.note('Cada uno de esos tres pasos está hecho con piezas que ya has construido, y merece la pena ver ' +
    'el inventario completo, porque el bloque entero cabe aquí:<br>' +
    '· el <strong>contador de programa</strong> es un [[maq-memoria|registro]] —biestables— con un ' +
    '[[maq-sumador|sumador]] que le añade uno;<br>' +
    '· <strong>decodificar</strong> es convertir un número en «este cable y ningún otro», que es un ' +
    'montón de [[maq-normal|detectores de fila]];<br>' +
    '· <strong>ejecutar</strong> una suma es el sumador, y elegir qué operación se usa es un ' +
    '[[maq-decidir|multiplexor]].<br>' +
    'No hay ninguna pieza nueva. Un procesador es todo lo anterior <strong>metido en un bucle</strong>.',
    'ok', 'El inventario está completo');

  p.demo({
    title: 'La máquina, paso a paso',
    intro: 'Éste es un programa que suma dos números. Pulsa «Un paso» y mira tres cosas a la vez: qué dice el aviso que acaba de hacer, cómo se mueven el contador y el acumulador, y por dónde va la flecha en la memoria. Con «Corre» va hasta el final de un tirón.',
    predice: 'El programa tiene seis instrucciones. ¿Cuántas celdas de memoria crees que ocupa: seis, ocho o diez?',
    build: function (host) {
      W.maquina(host, {
        id: 'cpu-suma',
        texto: MAQ.EJEMPLOS.suma.texto,
        datos: { x: 20, y: 22 },
        nota: 'Fíjate en que <code>CARGA</code> ocupa <strong>dos</strong> celdas: una para decir «carga» y otra para decir de dónde. Por eso el contador a veces avanza de uno en uno y a veces de dos en dos.'
      });
    }
  });

  p.text('Ese aviso que va cantando lo que pasa es una comodidad de este curso; la máquina de verdad no ' +
    'dice nada. Lo único que hay por dentro son cables encendiéndose y apagándose, exactamente como en ' +
    'los circuitos de los temas anteriores.');

  /* ---------------------------------------------------------------- */
  p.section('Decodificar es encender un cable');

  p.text('El paso del medio es el que suena más misterioso, y es el más tonto de los tres. La máquina ' +
    'tiene un número —pongamos un 6, que aquí significa <code>SUMA</code>— y necesita que se active el ' +
    'circuito de sumar y ninguno de los otros. Eso es un <strong>decodificador</strong>: un circuito con ' +
    '$n$ entradas y $2^n$ salidas, del que siempre hay exactamente una encendida.');

  p.demo({
    title: 'Un decodificador de dos a cuatro',
    intro: 'Dos entradas, cuatro salidas, y siempre una sola encendida: la que corresponde al número que forman a y b. Mueve los conmutadores y mira la tabla completa.',
    predice: 'Con dos entradas hay cuatro combinaciones y hay cuatro salidas. ¿Cuántas salidas crees que estarán encendidas a la vez?',
    build: function (host) {
      W.circuito(host, {
        id: 'cpu-deco', alto: 250,
        texto: 'na = not(a);\nnb = not(b);\nd0 = and(na, nb);\nd1 = and(na, b);\nd2 = and(a, nb);\nd3 = and(a, b);',
        aria: 'Un decodificador: dos entradas, dos negaciones y cuatro puertas and, una por combinación.',
        nota: 'Cada línea es un <strong>detector de fila</strong> de los de [[maq-normal|la forma normal]]. Un decodificador no es más que todos los detectores posibles puestos juntos. Para las dieciocho instrucciones de esta máquina harían falta <strong>cinco</strong> entradas y treinta y dos salidas, de las que catorce no se usarían: los tamaños redondos salen en potencias de dos, y un juego de instrucciones casi nunca cae justo.'
      });
    }
  });

  p.text('Con las cuatro salidas del decodificador ya se puede gobernar el resto del circuito: la salida ' +
    'de «suma» se lleva al cable que le dice al [[maq-decidir|multiplexor]] que deje pasar el resultado ' +
    'del sumador, y así con todas. A esos cables se les llama <strong>señales de control</strong>, y son ' +
    'literalmente eso: cables que están a 1 o a 0.');

  /* ---------------------------------------------------------------- */
  p.section('Todo son números, y nada dice cuál es cuál');

  p.text('Vuelve a la memoria de la demo de arriba y mira la columna del medio. El programa entero es ' +
    'esto:');

  p.table(['celda', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    [['<strong>valor</strong>', '2', '8', '4', '2', '9', '6', '15', '0', '20', '22']]);

  p.text('Diez números. Ocho son el programa y dos son los datos, pero <strong>en la memoria no hay nada ' +
    'que lo diga</strong>. El 2 de la celda 0 es un <code>CARGA</code> porque el contador pasa por ahí, ' +
    'y el 20 de la celda 8 es un dato porque el contador no pasa nunca. La misma celda, leída en otro ' +
    'momento, sería otra cosa.');

  p.note('Esto no es un detalle de implementación, es <strong>la</strong> idea. Se llama ' +
    '<em>arquitectura de programa almacenado</em>, y tiene tres consecuencias enormes. La primera es que ' +
    'cambiar de programa es escribir en memoria, no recablear. La segunda es que un programa puede ' +
    'tratar a otro programa como dato, y de ahí salen los compiladores —la segunda mitad de este ' +
    'bloque—. Y la tercera es que si el contador se pierde y cae en una celda de datos, la máquina ' +
    'intenta ejecutar un número que no es una instrucción; aquí eso se para con un aviso, y en un ' +
    'ordenador de verdad es la mitad de los fallos de seguridad que has leído en el periódico.',
    'ok', 'Programa almacenado');

  p.ejemplo({
    title: 'Seguir el ciclo tres vueltas',
    enunciado: 'Con el programa de arriba en memoria y el contador a 0, escribir qué hace la máquina en cada una de las tres primeras vueltas del ciclo.',
    pasos: [
      { t: '<strong>Primera vuelta.</strong> <em>Buscar:</em> en la celda 0 hay un 2. <em>Decodificar:</em> el 2 es <code>CARGA</code>, y lleva argumento, así que se busca también la celda 1, donde hay un 8. <em>Ejecutar:</em> el acumulador toma lo que haya en la celda 8, que es 20. El contador pasa a 2.', antes: 'El contador empieza en 0 porque es donde empieza el programa, y nada más.' },
      { t: '<strong>Segunda vuelta.</strong> En la celda 2 hay un 4, que es <code>METE</code> y no lleva argumento. Se mete el acumulador —20— en la pila. El contador pasa a 3.' },
      { t: '<strong>Tercera vuelta.</strong> En la celda 3 hay otro 2: <code>CARGA</code>, y su argumento está en la 4, que dice 9. El acumulador toma lo que haya en la celda 9, que es 22. El contador pasa a 5.' },
      { t: '<strong>Y lo que viene.</strong> En la 5 hay un 6, que es <code>SUMA</code>: saca de la pila el 20, le suma el acumulador —22— y deja 42. Las tres vueltas siguientes escriben el 42 y paran.' }
    ],
    cierre: 'Seis instrucciones, ocho celdas y nueve vueltas del ciclo. Un procesador de verdad hace esto mismo unos tres mil millones de veces por segundo, y por eso da la impresión de que entiende algo.'
  });

  p.comprueba('En la memoria de la máquina, ¿qué distingue a una celda que contiene una instrucción de una que contiene un dato?', [
    { t: 'Nada: son números iguales, y solo el recorrido del contador decide cómo se lee cada uno', ok: true, por: 'Ésa es exactamente la arquitectura de programa almacenado. La memoria no sabe nada; el significado se lo da el momento en que se lee. Si el contador cae en una celda de datos, la máquina intentará ejecutarla.' },
    { t: 'Las instrucciones se guardan en una memoria aparte, separada de los datos', ok: false, por: 'Hay máquinas así —se llaman de arquitectura Harvard y se usan en sitios concretos—, pero la de este bloque, como casi todos los ordenadores, guarda las dos cosas juntas.' },
    { t: 'Las instrucciones son números pequeños y los datos pueden ser grandes', ok: false, por: 'Los códigos de instrucción van del 0 al 15, sí, pero un dato también puede valer 3. No hay forma de distinguirlos mirando el número.' }
  ]);

  p.util('El ciclo de tres tiempos es tan universal que la palabra «gigahercio» significa justo eso: ' +
    'cuántas veces por segundo se repite. Lo que ha cambiado en setenta años no es el ciclo, sino ' +
    'cuántos van a la vez: un procesador moderno tiene varias unidades haciendo distintas fases de ' +
    'instrucciones distintas al mismo tiempo —eso se llama <em>segmentación</em>—, y además adivina por ' +
    'dónde va a seguir un salto antes de saberlo. Cuando adivina mal, tira lo hecho y vuelve atrás. Un ' +
    'fallo célebre de 2018, <em>Spectre</em>, consistió en darse cuenta de que lo que la máquina había ' +
    'hecho «de más» mientras adivinaba dejaba rastro, y que ese rastro se podía leer.');

  p.hist('El informe que fijó todo esto tiene fecha de junio de 1945, lo firmaba <strong>John von ' +
    'Neumann</strong> él solo, y describía la máquina EDVAC. El detalle incómodo es que las ideas ' +
    'venían del equipo entero —<strong>J. Presper Eckert</strong> y <strong>John Mauchly</strong> las ' +
    'habían trabajado antes—, pero el borrador circuló con un solo nombre y así se quedó: todavía hoy se ' +
    'dice «arquitectura de von Neumann». La primera máquina que llegó a ejecutar un programa guardado en ' +
    'su propia memoria fue el <em>Baby</em> de Mánchester, el 21 de junio de 1948: corrió diecisiete ' +
    'instrucciones durante cincuenta y dos minutos para buscar el mayor divisor de un número. Y la idea ' +
    'de que un programa pueda ser dato de otro programa es anterior a todas las máquinas: está en el ' +
    'artículo de Turing de 1936, donde la máquina universal lee la descripción de otra máquina.');

  p.note('Que la máquina tarde distinto según lo que calcula parece inofensivo y no lo es. Si una ' +
    'comparación de contraseñas se detiene en la primera letra que falla, el <em>tiempo</em> que tarda ' +
    'dice cuántas letras eran correctas, y con eso se adivina la contraseña letra a letra sin romper ' +
    'nada. Eso es un ataque por canal lateral, y está en ' +
    '[[cr-canales|cuando el reloj habla]]: el mismo reloj que aquí es un lujo de diseño, allí es una ' +
    'fuga de información.', null, 'El reloj, como filtración');

  p.trampas([
    { e: 'Pensar que el contador avanza siempre de uno en uno', por: 'Avanza lo que ocupe la instrucción: una celda, o dos si lleva argumento. Y un salto lo pone donde le dé la gana.' },
    { e: 'Creer que la máquina «entiende» la instrucción', por: 'Decodificar es encender un cable. El 6 no significa sumar: el 6 enciende la salida número 6 del decodificador, y a esa salida hay un sumador enchufado.' },
    { e: 'Buscar en la memoria una marca que diga «esto es un dato»', por: 'No existe. Un ordenador se pasa el día distinguiendo instrucciones de datos únicamente por dónde pasa el contador.' },
    { e: 'Confundir el acumulador con la memoria', por: 'El acumulador es un solo registro, el sitio donde se está operando ahora mismo. La memoria son 256 celdas y hay que ir a buscar cada una.' },
    { e: 'Pensar que hace falta una instrucción por cada cosa que se quiera hacer', por: 'Con las de esta máquina se puede calcular cualquier cosa calculable. Lo que cambia con más instrucciones suele ser la comodidad y la velocidad… salvo una excepción que verás en [[maq-ensamblador|el tema siguiente]]: poder <em>calcular</em> una dirección, y no solo escribirla, sí cambia lo que se puede hacer.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántas celdas ocupa',
    level: 'basico',
    gen: function (r) {
      var conArg = r.int(1, 5), sinArg = r.int(1, 5);
      return { conArg: conArg, sinArg: sinArg, tot: 2 * conArg + sinArg, instr: conArg + sinArg };
    },
    ask: function (d) {
      return 'Un programa tiene <strong>' + d.conArg + '</strong> ' +
        U.plural(d.conArg, 'instrucción con argumento', 'instrucciones con argumento') +
        ' (como <code>CARGA</code> o <code>SALTA</code>) y <strong>' + d.sinArg + '</strong> ' +
        U.plural(d.sinArg, 'sin argumento', 'sin argumento') + ' (como <code>SUMA</code> o ' +
        '<code>PARA</code>). ¿Cuántas celdas de memoria ocupa?';
    },
    fields: [{ name: 'c', label: 'celdas', w: 'tiny' }],
    sol: function (d) { return { c: d.tot }; },
    dec: 0,
    errores: [{ si: function (v, d) { return Math.abs(v.c - d.instr) < 0.5 && d.conArg > 0; },
      msg: 'Has contado una celda por instrucción. Las que llevan argumento ocupan <strong>dos</strong>: una para la orden y otra para lo que va detrás.' }],
    hint: function () { return 'Una celda por instrucción, y una más por cada argumento.'; },
    steps: function (d) {
      return ['Las ' + d.conArg + ' con argumento ocupan dos celdas cada una: $2 \\times ' + d.conArg + ' = ' + (2 * d.conArg) + '$.',
        'Las ' + d.sinArg + ' sin argumento ocupan una: $' + d.sinArg + '$.',
        'En total $' + (2 * d.conArg) + ' + ' + d.sinArg + ' = ' + d.tot + '$ celdas.'];
    },
    answer: function (d) { return String(d.tot); }
  });

  p.exercise({
    title: 'Una vuelta del ciclo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'CARGA', arg: true, q: 'el acumulador toma lo que hay en la celda que dice el argumento' },
        { c: 'GUARDA', arg: true, q: 'el acumulador se copia en la celda que dice el argumento' },
        { c: 'NUM', arg: true, q: 'el acumulador toma el número que viene detrás' },
        { c: 'METE', arg: false, q: 'el acumulador se copia encima de la pila' },
        { c: 'SUMA', arg: false, q: 'se saca un valor de la pila y se le suma el acumulador' },
        { c: 'MUESTRA', arg: false, q: 'el acumulador se escribe en la salida' }
      ];
      var c = r.pick(casos), dir = r.int(0, 9);
      return { c: c, dir: dir, sig: dir + (c.arg ? 2 : 1) };
    },
    ask: function (d) {
      return 'El contador vale <strong>' + d.dir + '</strong> y en esa celda hay un <code>' + d.c.c +
        '</code>. ¿En qué celda quedará el contador cuando termine esta vuelta del ciclo?';
    },
    fields: [{ name: 'c', label: 'contador', w: 'tiny' }],
    sol: function (d) { return { c: d.sig }; },
    dec: 0,
    errores: [{ si: function (v, d) { return d.c.arg && Math.abs(v.c - (d.dir + 1)) < 0.5; },
      msg: 'Has avanzado una sola celda, y esa instrucción lleva argumento: el argumento ocupa <strong>otra celda</strong>.' }],
    hint: function () { return '<code>CARGA</code>, <code>GUARDA</code>, <code>NUM</code>, <code>SALTA</code>, <code>SICERO</code> y <code>LLAMA</code> llevan argumento y ocupan dos celdas. Las demás, una.'; },
    steps: function (d) {
      return ['<code>' + d.c.c + '</code>: ' + d.c.q + '.',
        d.c.arg
          ? 'Lleva argumento, así que ocupa dos celdas: la de la orden y la del argumento.'
          : 'No lleva argumento, así que ocupa una sola celda.',
        'El contador pasa de $' + d.dir + '$ a $' + d.sig + '$.'];
    },
    answer: function (d) { return String(d.sig); }
  });

  p.exercise({
    title: 'Leer la memoria',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { prog: 'NUM 7\nMUESTRA\nPARA', mira: 0, val: 1, q: 'la instrucción NUM' },
        { prog: 'NUM 7\nMUESTRA\nPARA', mira: 1, val: 7, q: 'el argumento de NUM' },
        { prog: 'NUM 7\nMUESTRA\nPARA', mira: 2, val: 15, q: 'la instrucción MUESTRA' },
        { prog: 'NUM 7\nMUESTRA\nPARA', mira: 3, val: 0, q: 'la instrucción PARA' },
        { prog: 'NUM 3\nMETE\nNUM 4\nSUMA\nPARA', mira: 2, val: 4, q: 'la instrucción METE' },
        { prog: 'NUM 3\nMETE\nNUM 4\nSUMA\nPARA', mira: 5, val: 6, q: 'la instrucción SUMA' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Se ensambla este programa:<pre class="shd__mini">' + d.c.prog + '</pre>' +
        '¿Qué número queda en la <strong>celda ' + d.c.mira + '</strong>? Los códigos, por orden desde ' +
        'el cero, son: <code>' + MAQ.NOMBRES.join('</code>, <code>') + '</code>.';
    },
    fields: [{ name: 'v', label: 'el número', w: 'tiny' }],
    sol: function (d) { return { v: d.c.val }; },
    dec: 0,
    hint: function () { return 'Ve colocando las instrucciones desde la celda 0, recordando que las que llevan argumento ocupan dos celdas. Después mira qué cae justo en la que se pregunta.'; },
    steps: function (d) {
      var asm = MAQ.ensambla(d.c.prog);
      return ['Colocado desde la celda 0, el programa queda así: $' + asm.imagen.join(',\\ ') + '$.',
        'En la celda ' + d.c.mira + ' cae ' + d.c.q + '.',
        'Y su número es el <strong>' + d.c.val + '</strong>.'];
    },
    answer: function (d) { return String(d.c.val); }
  });

  p.exercise({
    title: 'Qué pasa si el contador se pierde',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'el contador acaba en una celda donde hay un dato que vale 20', v: 'para', por: 'Los códigos de instrucción van del 0 al 15. Un 20 no es ninguna instrucción, así que la máquina se detiene y lo dice. En un procesador de verdad el efecto va desde un fallo hasta cosas mucho peores.' },
        { t: 'el contador acaba en una celda donde hay un dato que vale 0', v: 'ejecuta', por: 'El 0 es el código de <code>PARA</code>. La máquina no tiene forma de saber que eso era un dato: lo ejecuta tan tranquila, y aquí da la casualidad de que para.' },
        { t: 'el contador acaba en la celda del argumento de un CARGA, saltándose la instrucción', v: 'ejecuta', por: 'Ese argumento es un número como cualquier otro. Si vale entre 0 y 15, la máquina lo toma por instrucción y la ejecuta. No hay ninguna marca que diga «esto era un argumento».' },
        { t: 'el contador pasa de la última celda del programa a una celda que nunca se ha tocado', v: 'ejecuta', por: 'Las celdas sin usar valen 0, y el 0 es <code>PARA</code>. La máquina ejecuta eso y se detiene, pero no porque sepa que el programa se acabó: porque se encontró un cero.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Si ' + d.c.t + ', ¿qué hace la máquina?'; },
    fields: [{ name: 'q', label: 'La máquina', opts: [
      { t: 'se detiene avisando de que eso no es una instrucción', v: 'para' },
      { t: 'lo ejecuta como si fuera una instrucción', v: 'ejecuta' },
      { t: 'se salta la celda porque sabe que ahí hay un dato', v: 'sabe' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'La máquina no sabe nada de nada: mira el número y busca si hay una instrucción con ese código. Los hay del 0 al 15.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return { para: 'se detiene avisando', ejecuta: 'lo ejecuta', sabe: 'lo esquiva' }[d.c.v]; }
  });

  p.keys([
    'Un ordenador es un circuito que <strong>obedece órdenes guardadas en memoria</strong>, en vez de un circuito por tarea.',
    'El ciclo son tres tiempos que se repiten: <strong>buscar</strong> la instrucción que marca el contador, <strong>decodificarla</strong> y <strong>ejecutarla</strong>.',
    'Ninguna pieza es nueva: el contador es un registro con un sumador, decodificar son detectores de fila, y elegir la operación es un multiplexor.',
    'Un <strong>decodificador</strong> convierte un número de $n$ bits en $2^n$ cables de los que siempre hay uno encendido. Eso es «entender» una instrucción.',
    'Programa y datos viven en la misma memoria y <strong>nada los distingue</strong>: el significado de una celda lo decide por dónde pasa el contador.',
    'De ahí salen el poder de la máquina —cambiar de programa es escribir números— y sus peores fallos de seguridad.',
    'La arquitectura se fijó en el informe del EDVAC de 1945, y el primer programa guardado corrió en el <em>Baby</em> de Mánchester en 1948.'
  ]);
});
