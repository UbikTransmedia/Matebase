/* Tema: Compilar en vez de interpretar: generar el ensamblador del tramo A */
Course.topic('len-compilar', function (p) {

  p.puente('Ya está todo: [[len-tokens|piezas]], [[len-arbol|árbol]], [[len-variables|entornos]] y ' +
    '[[len-funciones|llamadas]]. Y hasta aquí el árbol se ha <em>ejecutado</em>: alguien lo recorre y va ' +
    'haciendo lo que dice. Ahora viene la otra opción, y es la que cierra el bloque sobre sí mismo.');

  p.text('En vez de recorrer el árbol haciendo cosas, se recorre <strong>escribiendo instrucciones</strong> ' +
    'para [[maq-cpu|la máquina del tramo A]]. Después se ejecutan esas instrucciones y ya no hace falta ' +
    'ni el árbol, ni el analizador, ni nada de esto. Eso es un <strong>compilador</strong>.');

  p.note('Las dos cosas son el mismo recorrido. Compáralas:<br>' +
    '· <strong>Intérprete:</strong> llego a un nudo <code>+</code>, calculo la rama izquierda, calculo la ' +
    'derecha, <em>sumo</em>.<br>' +
    '· <strong>Compilador:</strong> llego a un nudo <code>+</code>, compilo la rama izquierda, escribo ' +
    '<code>METE</code>, compilo la derecha, <em>escribo <code>SUMA</code></em>.<br>' +
    'Mismo paseo, distinta acción al pasar. Todo el compilador de este curso son treinta líneas de esa ' +
    'idea repetida.',
    'ok', 'El mismo paseo, otra acción');

  /* ---------------------------------------------------------------- */
  p.section('Compilar un «si»');

  p.text('Las expresiones ya están hechas en [[len-pila|el tema de la pila]]. Lo nuevo son las sentencias ' +
    'que deciden y repiten, y el patrón es el que se vio a mano en ' +
    '[[maq-ensamblador|el ensamblador]], ahora generado solo:');

  p.text('<pre class="shd__mini">si CONDICIÓN { A } sino { B }\n\n' +
    '   ─── se convierte en ───\n\n' +
    '  &lt;código de CONDICIÓN&gt;\n' +
    '  SICERO otra        ; si NO se cumple, a la otra rama\n' +
    '  &lt;código de A&gt;\n' +
    '  SALTA fin\n' +
    'otra:\n' +
    '  &lt;código de B&gt;\n' +
    'fin:</pre>');

  p.text('Dos cosas que merecen mirarse. La primera: el salto se lleva el caso <strong>falso</strong>, ' +
    'porque <code>SICERO</code> es lo único que la máquina sabe hacer. La segunda: hay dos etiquetas ' +
    'inventadas, <code>otra</code> y <code>fin</code>, que el compilador tiene que fabricar ' +
    '<strong>distintas cada vez</strong>, porque un programa puede tener cien <code>si</code> anidados. ' +
    'Se llaman <code>L0</code>, <code>L1</code>, <code>L2</code>… y un contador las va sirviendo.');

  p.text('El <code>mientras</code> es el mismo truco con una etiqueta más al principio y un salto hacia ' +
    'atrás al final:');

  p.text('<pre class="shd__mini">mientras CONDICIÓN { A }\n\n' +
    '   ─── se convierte en ───\n\n' +
    'ini:\n' +
    '  &lt;código de CONDICIÓN&gt;\n' +
    '  SICERO fin\n' +
    '  &lt;código de A&gt;\n' +
    '  SALTA ini\n' +
    'fin:</pre>');

  p.demo({
    title: 'Un programa y su traducción',
    intro: 'Mira los dos paneles: el árbol a la izquierda y las instrucciones a la derecha. Ve cambiando el programa —mete un «sino», anida un «si» dentro del bucle— y busca en el ensamblador las etiquetas que aparecen y de dónde salen.',
    predice: 'El programa tiene un «mientras» con un «si» dentro. ¿Cuántas etiquetas distintas crees que hará falta inventar?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'comp-uno', paneles: ['asm', 'arbol'],
        texto: 'sea i = 1;\nmientras i <= 4 {\n  si i < 3 { muestra i; } sino { muestra 0; }\n  i = i + 1;\n}',
        nota: 'Las etiquetas no tienen ningún significado: son sitios. Y como se generan con un contador, no pueden repetirse nunca, que es justo lo que hace falta para poder anidar sin pensar.'
      });
    }
  });

  p.demo({
    title: 'El recorrido, dibujado',
    intro: 'El mismo paseo del tema de la pila, para tenerlo delante mientras se lee el ensamblador de arriba. Cada vez que se enciende una hoja, el compilador escribe una instrucción que carga algo; cada vez que se enciende un nudo, escribe la operación.',
    predice: 'Si el compilador escribe las instrucciones en el orden en que se encienden los nudos, ¿cuál es la última instrucción de una expresión?',
    build: function (host) {
      W.arbol(host, {
        texto: '2 + 3 * 4', alto: 220,
        nota: 'Interpretar es hacer la operación al encender el nudo; compilar es escribirla. Mismo paseo, distinta acción, y por eso los dos programas del curso tienen la misma forma.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Las dos tienen que dar lo mismo');

  p.text('Aquí hay un compromiso serio que conviene enunciar: un compilador que genera instrucciones ' +
    'plausibles pero equivocadas <strong>no se distingue leyéndolo</strong>. El código sale bonito, pasa ' +
    'la vista, y el programa hace otra cosa.');

  p.note('La única forma de saberlo es correr el programa por los dos caminos y comparar lo que escriben. ' +
    'Este curso lo hace: hay una batería de once programas —con bucles, funciones, recursión y recursión ' +
    'mutua— que en cada ejecución de las pruebas se <strong>interpretan</strong> y se ' +
    '<strong>compilan y ejecutan en la máquina</strong>, y las dos salidas se comparan. A eso se le ' +
    'llama <em>prueba diferencial</em>, y no es un adorno: la primera versión de este compilador pasaba ' +
    'la vista perfectamente y se equivocaba al compilar <code>suma(1, suma(2, 3))</code>. Lo cazó esta ' +
    'prueba con un programa de tres líneas.',
    'ok', 'Cómo se sabe que un compilador no miente');

  p.demo({
    title: 'Las dos salidas, a la vez',
    intro: 'El aviso de arriba dice lo que escribe el programa interpretado y lo que escribe compilado y ejecutado en la máquina, y si coinciden. Escribe lo que quieras y trata de encontrar un programa donde no coincidan.',
    predice: '¿Crees que existe algún programa de Pizca en el que las dos salidas no coincidan? ¿Qué habría que concluir si lo encontraras?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'comp-dif', tope: 40000,
        texto: 'fun suma(a, b) { vuelve a + b; }\nmuestra suma(1, suma(2, 3));\nsea i = 1;\nmientras i < 4 {\n  muestra i * i;\n  i = i + 1;\n}',
        nota: 'Si alguna vez encuentras un programa donde no coincidan, no has encontrado una curiosidad: has encontrado un fallo. Uno de los dos está mal, y hay que averiguar cuál.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Qué se gana y qué se pierde');

  p.table(['', 'interpretar', 'compilar'],
    [['cuándo se analiza el texto', 'cada vez que se ejecuta', 'una sola vez'],
     ['un nombre mal escrito', 'salta al llegar a esa línea', 'salta al compilar, antes de ejecutar nada'],
     ['velocidad', 'más lento: se recorre el árbol siempre', 'más rápido: la máquina ejecuta y ya está'],
     ['para probar algo rápido', 'cómodo: se escribe y se corre', 'hay que compilar primero'],
     ['qué hace falta para ejecutar', 'el intérprete entero', 'solo la máquina']]);

  p.text('La diferencia grande no es la velocidad: es <strong>cuándo se entera uno de los fallos</strong>. ' +
    'Un intérprete puede llevar media hora funcionando y morirse al llegar por primera vez a una línea ' +
    'con un nombre mal escrito. Un compilador lo habría dicho antes de empezar.');

  p.util('Casi ningún lenguaje de hoy es puramente una cosa o la otra. Java y C# compilan a las ' +
    'instrucciones de una máquina inventada, parecida a la de este bloque, y esa máquina se ejecuta ' +
    'sobre la de verdad; además, los trozos que más se usan se compilan otra vez <em>mientras el ' +
    'programa corre</em>, a instrucciones del procesador real, porque entonces ya se sabe qué merece la ' +
    'pena optimizar. Python compila a su propio código de máquina virtual sin decírselo a nadie. Y los ' +
    'navegadores hacen las tres cosas a la vez con el mismo JavaScript, según lo caliente que esté cada ' +
    'función.');

  p.hist('La palabra <em>compilador</em> es de <strong>Grace Hopper</strong>, y en su origen significaba ' +
    'algo bastante distinto de lo que significa hoy: su A-0 de 1952 <em>compilaba</em> en el sentido de ' +
    'recopilar, juntando trozos de código ya escritos que estaban en una cinta. Le costó convencer a ' +
    'nadie: la respuesta habitual era que los ordenadores solo sabían hacer aritmética y que traducir ' +
    'palabras era cosa de personas. El primer compilador en el sentido moderno fue el de FORTRAN, y su ' +
    'objetivo declarado era que el código generado fuera tan bueno como el que escribiría a mano un ' +
    'programador competente, porque si no, nadie lo usaría. Lo consiguieron, y por eso hoy casi nadie ' +
    'escribe ensamblador.');

  p.trampas([
    { e: 'Usar la misma etiqueta dos veces', por: 'En cuanto haya dos <code>si</code> en el programa, los saltos se cruzan. Por eso las etiquetas las genera un contador, y no se repiten jamás.' },
    { e: 'Compilar la condición del derecho', por: '<code>SICERO</code> salta cuando <strong>no</strong> se cumple. La etiqueta se lleva la rama del «si no».' },
    { e: 'Olvidar el salto que se salta la rama «sino»', por: 'Sin él, después de ejecutar la rama del «sí» la ejecución seguiría de frente y ejecutaría también la del «no».' },
    { e: 'Creer que compilar es más rápido siempre', por: 'Lo que es más rápido es <em>ejecutar</em> lo compilado. Compilar cuesta tiempo, y para un programa de tres líneas que se corre una vez, no compensa.' },
    { e: 'Confiar en que el código generado es correcto porque se lee bien', por: 'Un compilador equivocado genera código perfectamente legible. La única prueba es ejecutar por los dos caminos y comparar.' }
  ]);

  p.ejemplo({
    title: 'Compilar un «mientras» a mano',
    enunciado: 'Escribir las instrucciones que salen de <code>sea i = 1; mientras i < 3 { muestra i; i = i + 1; }</code>, con las etiquetas que haga falta inventar.',
    pasos: [
      { t: '<strong>La declaración.</strong> <code>sea i = 1;</code> es una expresión y un guardado: <code>NUM 1</code> y <code>GUARDA g_i</code>.', antes: 'Las variables globales van a huecos con nombre propio, repartidos al compilar.' },
      { t: '<strong>La etiqueta de la vuelta.</strong> Antes de nada, <code>L0:</code>. Ahí es donde volverá el salto del final, y tiene que estar <em>antes</em> de la condición para que ésta se compruebe en cada vuelta.' },
      { t: '<strong>La condición.</strong> <code>i &lt; 3</code> se compila como una expresión cualquiera: <code>CARGA g_i</code>, <code>METE</code>, <code>NUM 3</code>, <code>MENOR</code>. Y detrás, <code>SICERO L1</code>, que se lleva el caso de que ya no se cumpla.', antes: 'Recuerda que el salto se lleva el caso falso.' },
      { t: '<strong>El cuerpo.</strong> <code>muestra i;</code> es <code>CARGA g_i</code> y <code>MUESTRA</code>. Y <code>i = i + 1;</code> es <code>CARGA g_i</code>, <code>METE</code>, <code>NUM 1</code>, <code>SUMA</code>, <code>GUARDA g_i</code>.' },
      { t: '<strong>Cerrar.</strong> <code>SALTA L0</code> para volver a comprobar, y después <code>L1:</code>, que es donde se sale. Catorce instrucciones en total para tres líneas de Pizca.' }
    ],
    cierre: 'Fíjate en que no ha hecho falta ninguna idea: cada trozo del programa tiene su patrón y se rellena. Eso es exactamente lo que hace que un compilador se pueda escribir, y que no se equivoque cuando el programa se complica.'
  });

  p.comprueba('¿Por qué el compilador tiene que inventar etiquetas con nombres distintos cada vez?', [
    { t: 'Porque un programa puede tener muchos «si» y «mientras», y si dos usaran la misma etiqueta los saltos irían al sitio equivocado', ok: true, por: 'Cada estructura necesita sus propios sitios a los que saltar. Con un contador que va dando <code>L0</code>, <code>L1</code>, <code>L2</code>… no hay forma de que se repitan, y por eso se pueden anidar sin pensar.' },
    { t: 'Porque a la máquina no le gusta repetir nombres', ok: false, por: 'El ensamblador sí protestaría por una etiqueta repetida, pero eso es la consecuencia, no la razón. La razón es que son sitios distintos.' },
    { t: 'Porque así el programa generado es más legible', ok: false, por: '<code>L7</code> no es precisamente legible. Se generan así por necesidad, no por estilo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántas etiquetas hacen falta',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'un <code>si</code> sin <code>sino</code>', n: 1, por: 'Solo hace falta el sitio donde continuar si la condición no se cumple.' },
        { t: 'un <code>si</code> con <code>sino</code>', n: 2, por: 'Una para el comienzo de la otra rama y otra para el final de las dos.' },
        { t: 'un <code>mientras</code>', n: 2, por: 'Una al principio, para volver a comprobar la condición, y otra al final, para salir.' },
        { t: 'dos <code>mientras</code> uno dentro de otro', n: 4, por: 'Dos por cada uno, y todas distintas: si el de dentro reutilizara las del de fuera, los saltos se cruzarían.' },
        { t: 'un <code>mientras</code> con un <code>si</code> sin <code>sino</code> dentro', n: 3, por: 'Dos del bucle más una del <code>si</code>.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Cuántas etiquetas hay que inventar para compilar ' + d.c.t + '?'; },
    fields: [{ name: 'n', label: 'etiquetas', w: 'tiny' }],
    sol: function (d) { return { n: d.c.n }; },
    tol: 0.5,
    hint: function () { return 'Un <code>si</code> pelado necesita una; con <code>sino</code>, dos. Un <code>mientras</code>, dos siempre. Y las de dentro nunca se comparten con las de fuera.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return String(d.c.n); }
  });

  p.exercise({
    title: 'Cuántas instrucciones salen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        'muestra 5;', 'sea x = 3;', 'muestra 2 + 3;',
        'sea x = 1;\nmuestra x + 1;', 'si 1 { muestra 7; }',
        'sea i = 0;\nmientras i < 2 { i = i + 1; }'
      ];
      var t = r.pick(casos);
      var asm = LEN.compila(LEN.analiza(t).ast).texto;
      return { t: t, n: MAQ.ensambla(asm).instrucciones };
    },
    ask: function (d) {
      return '¿Cuántas instrucciones de máquina genera este programa, contando el <code>PARA</code> del ' +
        'final?<pre class="shd__mini">' + d.t.replace(/</g, '&lt;') + '</pre>';
    },
    fields: [{ name: 'n', label: 'instrucciones', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    tol: 0.5,
    hint: function () { return 'Ve trozo a trozo: un número es <code>NUM</code>; una variable, <code>CARGA</code>; guardar, <code>GUARDA</code>; una operación, un <code>METE</code> más la operación; y cada <code>si</code> o <code>mientras</code> añade sus saltos. Las etiquetas no cuentan: no son instrucciones.'; },
    steps: function (d) {
      var asm = LEN.compila(LEN.analiza(d.t).ast).texto;
      return ['El ensamblador que sale:<pre class="shd__mini">' + asm + '</pre>',
        'Las etiquetas —las líneas que acaban en dos puntos— no son instrucciones: solo marcan sitios.',
        'Quedan <strong>' + d.n + '</strong> instrucciones.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'Interpretar o compilar',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'un nombre mal escrito en una línea a la que casi nunca se llega', v: 'compilar', por: 'El compilador reparte todos los nombres en celdas antes de ejecutar nada, así que lo caza al compilar. El intérprete no se entera hasta que la ejecución llega a esa línea, que puede ser dentro de media hora o nunca.' },
        { t: 'probar tres líneas sueltas para ver qué hacen', v: 'interpretar', por: 'Compilar cuesta un rato y para tres líneas no compensa. Por eso los lenguajes pensados para explorar suelen interpretarse.' },
        { t: 'un programa que se va a ejecutar millones de veces', v: 'compilar', por: 'El análisis se hace una sola vez y después la máquina ejecuta sin volver a mirar el texto. Interpretando se recorre el árbol en cada ejecución.' },
        { t: 'ejecutar el programa en un aparato pequeño donde no cabe el traductor entero', v: 'compilar', por: 'Lo compilado solo necesita la máquina. El intérprete tiene que llevarse consigo el troceador, el analizador y el evaluador.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Para ' + d.c.t + ', ¿qué conviene más?'; },
    fields: [{ name: 'q', label: 'Conviene', opts: [
      { t: 'compilar', v: 'compilar' }, { t: 'interpretar', v: 'interpretar' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Piensa en dos cosas: <em>cuándo</em> se hace el análisis, y cuántas veces se va a ejecutar el programa.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Escribir un programa que compile a lo pedido',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'escriba los números del 1 al 4, en ese orden', salida: [1, 2, 3, 4],
          ref: 'sea i = 1;\nmientras i < 5 {\n  muestra i;\n  i = i + 1;\n}' },
        { t: 'escriba los cuadrados de 1, 2 y 3', salida: [1, 4, 9],
          ref: 'sea i = 1;\nmientras i < 4 {\n  muestra i * i;\n  i = i + 1;\n}' },
        { t: 'escriba 1 si 7 es mayor que 5, y 0 si no', salida: [1],
          ref: 'si 7 > 5 { muestra 1; } sino { muestra 0; }' },
        { t: 'escriba la suma de los números de 1 a 5, y nada más', salida: [15],
          ref: 'sea i = 1;\nsea s = 0;\nmientras i < 6 {\n  s = s + i;\n  i = i + 1;\n}\nmuestra s;' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe un programa de Pizca que ' + d.c.t + '.<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige de las ' +
        'dos maneras: interpretándolo <strong>y</strong> compilándolo y ejecutándolo en la máquina. Las ' +
        'dos tienen que dar lo pedido.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea, como <code>muestra 1;</code>.' };
      var i = LEN.corre(texto, { tope: 30000 });
      if (i.errores.length) return { ok: false, msg: 'Línea ' + i.errores[0].linea + ': ' + i.errores[0].msg };
      if (String(i.salida) !== String(d.c.salida)) {
        return { ok: false, msg: 'Interpretado escribe ' + (i.salida.length ? i.salida.join(', ') : 'nada') +
          ' y hacía falta ' + d.c.salida.join(', ') + '.' };
      }
      var c = LEN.corre(texto, { compilado: true, tope: 20000 });
      if (c.errores.length) return { ok: false, msg: 'Al compilarlo: ' + c.errores[0].msg };
      if (String(c.salida) !== String(d.c.salida)) {
        return { ok: false, msg: 'Interpretado sale bien, pero compilado escribe ' +
          (c.salida.length ? c.salida.join(', ') : 'nada') + '. Si te pasa esto, avisa: es un fallo del compilador, no tuyo.' };
      }
      return { ok: true, msg: 'Correcto por los dos caminos, con ' +
        MAQ.ensambla(LEN.compila(LEN.analiza(texto).ast).texto).instrucciones + ' instrucciones de máquina.' };
    },
    hint: function () { return 'Para repetir, un <code>mientras</code> con un contador que empiece en 1 y se le sume 1 al final del cuerpo. Y acuérdate del punto y coma al final de cada sentencia.'; },
    steps: function (d) {
      var asm = LEN.compila(LEN.analiza(d.c.ref).ast).texto;
      return ['Una solución:<pre class="shd__mini">' + d.c.ref.replace(/</g, '&lt;') + '</pre>',
        'Y esto es lo que genera el compilador:<pre class="shd__mini">' + asm + '</pre>',
        'Vale cualquier programa que escriba lo mismo, y el número de instrucciones puede ser otro.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.keys([
    'Interpretar y compilar son <strong>el mismo recorrido del árbol</strong>: uno hace cosas y el otro escribe instrucciones.',
    'Un <code>si</code> se compila con un <code>SICERO</code> que se lleva el caso <strong>falso</strong> y un salto que se salta la otra rama.',
    'Un <code>mientras</code> es una etiqueta al principio, la condición, un salto de salida y un salto hacia atrás al final.',
    'Las etiquetas las fabrica un <strong>contador</strong>, para que no se repitan nunca y se pueda anidar sin pensar.',
    'Un compilador equivocado genera código que se lee perfectamente: la única prueba es <strong>correr por los dos caminos y comparar</strong>.',
    'Compilar analiza una sola vez, encuentra los fallos de nombres <strong>antes</strong> de ejecutar y no necesita el traductor para correr.',
    'Casi ningún lenguaje de hoy es puramente una cosa: compilan a la máquina de una máquina virtual, y recompilan lo más usado mientras el programa corre.'
  ]);
});
