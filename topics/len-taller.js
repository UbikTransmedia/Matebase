/* Tema: Tu propio lenguaje, corriendo en tu propia máquina */
Course.topic('len-taller', function (p) {

  p.puente('Se acabó de construir. Este último tema no explica nada nuevo: es para <strong>usar</strong> ' +
    'lo que hay, ver el camino entero de una vez y, si te apetece, seguir por tu cuenta. Empieza por ' +
    'mirar lo que se ha montado en dieciocho fichas.');

  /* ---------------------------------------------------------------- */
  p.section('El camino entero, de un vistazo');

  p.text('<pre class="shd__mini">tu programa en Pizca\n' +
    '      │\n' +
    '      ▼   troceador            len-tokens\n' +
    '   tokens\n' +
    '      │\n' +
    '      ▼   descenso recursivo   len-gramatica · len-arbol\n' +
    '   árbol\n' +
    '      │\n' +
    '      ├──────────────► intérprete          len-pila · len-variables · len-funciones\n' +
    '      │                     │\n' +
    '      ▼   compilador        │               len-compilar · len-optimizar\n' +
    ' ensamblador                │\n' +
    '      │   ensamblador       │               maq-ensamblador\n' +
    '      ▼                     │\n' +
    '  números en memoria        │               maq-cpu · maq-normal · maq-memoria\n' +
    '      │                     │\n' +
    '      ▼   puertas lógicas   │               maq-puertas · maq-sumador · maq-decidir\n' +
    '  cables a 1 y a 0          │\n' +
    '      │                     │\n' +
    '      ▼                     ▼\n' +
    '   la misma salida     la misma salida</pre>');

  p.text('Las dos ramas tienen que dar lo mismo, y eso se comprueba en cada ejecución de las pruebas del ' +
    'curso. De arriba abajo no hay ni un paso que no hayas visto por dentro: ni el troceador, ni el ' +
    'árbol, ni las instrucciones, ni las puertas de las que están hechas.');

  p.note('Vale la pena decir en voz alta lo que significa ese dibujo. <strong>No queda magia en ' +
    'ninguna parte.</strong> Un ordenador no entiende nada: son tablas de verdad apiladas. Y un ' +
    'lenguaje de programación no es un idioma que la máquina hable, sino un texto que otro programa ' +
    'traduce. Las dos frases se han demostrado construyéndolo, que es la única manera en que se pueden ' +
    'demostrar.',
    'ok', 'Lo que queda demostrado');

  /* ---------------------------------------------------------------- */
  p.section('El taller');

  p.demo({
    title: 'Escribe lo que quieras',
    intro: 'Todo Pizca, con los cuatro paneles. Escribe, mira el árbol, mira el ensamblador que sale y comprueba que las dos salidas coinciden. Como referencia: sea, si/sino, mientras, fun/vuelve, muestra, las cuatro operaciones y las seis comparaciones.',
    predice: 'Antes de tocar nada: el programa de ejemplo calcula los primeros números de Fibonacci. ¿Hasta cuál crees que podrá llegar antes de que los ocho bits den la vuelta?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'taller-libre', tope: 60000,
        texto: 'sea a = 0;\nsea b = 1;\nsea i = 0;\nmientras i < 10 {\n  muestra b;\n  sea t = a + b;\n  a = b;\n  b = t;\n  i = i + 1;\n}',
        nota: 'Fibonacci se sale de los ocho bits en el término 12, que valdría 144: ahí el aviso deja de tener sentido y empiezan a salir números negativos. No es un fallo, es el rango de la máquina, y merece la pena verlo pasar.'
      });
    }
  });

  p.text('Cosas que merece la pena probar en ese taller, por si no se te ocurren:');

  p.list([
    'Escribir el mismo cálculo de dos maneras y comparar cuántas instrucciones genera cada una.',
    'Hacer que salte un desbordamiento a propósito y comprobar que las dos ramas se equivocan <em>igual</em>.',
    'Escribir una recursión y contar hasta qué profundidad llega antes de que la máquina se quede sin pila.',
    'Meter un error de sintaxis y leer el mensaje: dice la línea y qué esperaba encontrar.',
    'Escribir un bucle sin salida y comprobar que nada se cuelga.'
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Cómo se le añade una palabra al lenguaje');

  p.text('Si te has quedado con ganas, esto es lo que habría que tocar para que Pizca tuviera una palabra ' +
    'más. Pongamos <code>repite n { ... }</code>, que repite un bloque un número fijo de veces. Son ' +
    '<strong>cinco sitios</strong>, y ninguno es grande:');

  p.list([
    '<strong>La lista de palabras</strong>, en <code>LEN.PALABRAS</code>. Con eso el troceador ya la reconoce como palabra del lenguaje y no como nombre. Un sitio.',
    '<strong>La gramática</strong>: una alternativa más en la regla <code>sentencia</code>, <code>"repite" expresion bloque</code>, y su caso en la función que analiza sentencias. Diez líneas, calcadas de las del <code>mientras</code>.',
    '<strong>El intérprete</strong>: un caso más en <code>ejecuta</code>. Evaluar la expresión, y dar esas vueltas. Tres líneas.',
    '<strong>El compilador</strong>: un caso más en <code>sent</code>. Guardar el contador en un hueco, una etiqueta, restarle uno cada vuelta y un <code>SICERO</code> para salir. Diez líneas, calcadas otra vez.',
    '<strong>La batería y la prueba</strong>: un programa de ejemplo en <code>LEN.EJEMPLOS</code> que use <code>repite</code>. Eso basta: la prueba diferencial lo cogerá sola y comprobará que interpretarlo y compilarlo dan lo mismo.'
  ], true);

  p.note('Fíjate en el quinto punto, que es el que de verdad importa. No hay que escribir ninguna prueba: ' +
    'basta con <strong>meter un programa en la batería</strong> y el arnés lo corre por los dos caminos ' +
    'y compara. Eso es lo que hace que añadir cosas a un lenguaje no dé miedo, y es también el mejor ' +
    'consejo que este bloque puede dar sobre programar en general: la prueba que hay que construir no es ' +
    'la que comprueba que el código hace lo que crees, sino la que <em>compara dos caminos ' +
    'independientes</em> hacia el mismo sitio.',
    'ok', 'Lo único que hay que hacer bien');

  p.text('Los archivos, por si los quieres abrir: <code>assets/js/core/lenguaje.js</code> tiene el ' +
    'lenguaje entero —troceador, analizador, intérprete, compilador y optimizador—, ' +
    '<code>assets/js/core/maquina.js</code> tiene la CPU y su ensamblador, y ' +
    '<code>assets/js/core/logica.js</code> el banco de circuitos. Los tres están escritos para leerse.');

  /* ---------------------------------------------------------------- */
  p.section('Qué le falta a Pizca, y qué costaría');

  p.table(['lo que falta', 'qué haría falta para tenerlo', 'dificultad'],
    [['texto', 'que <code>muestra</code> supiera escribir algo que no fueran números, y un tipo de dato más en el árbol', 'media'],
     ['decimales', 'cambiar los números de la máquina; y entonces hay que decidir cuántos bits y qué se redondea', 'alta'],
     ['listas', 'sintaxis para <code>lista[i]</code>, y compilarla con <code>CARGAI</code> sobre una <code>TABLA</code>: la máquina ya sabe', 'baja'],
     ['marcos de llamada de verdad', 'un registro que apunte al marco de ahora y leer las variables con <code>CARGAI</code>; la máquina ya sabe', 'media'],
     ['números grandes', 'más de ocho bits por celda, o guardar cada número en varias celdas y sumar a mano', 'alta']]);

  p.text('Fíjate en las dos filas de dificultad baja y media: las dos piden <strong>la misma ' +
    'instrucción</strong>, y la máquina ya la tiene. Poder calcular una dirección en vez de escribirla ' +
    'es lo que convierte las direcciones en datos, y de ahí salen las listas, los marcos de pila y ' +
    '[[len-autorreferencia|los programas que se escriben a sí mismos]]. Lo que falta ahora no está en ' +
    'la máquina: está en el compilador, y es trabajo de una tarde.');

  p.ejemplo({
    title: 'El mismo cálculo, dos veces, y cuál sale más barato',
    enunciado: 'Escribir «la suma de los cinco primeros cuadrados» de dos maneras —con un bucle y con la cuenta hecha— y comparar lo que ocupan.',
    pasos: [
      { t: '<strong>Con bucle.</strong> <code>sea i = 1; sea s = 0; mientras i &lt; 6 { s = s + i * i; i = i + 1; } muestra s;</code>. Escribe 55.', antes: 'Es la forma natural: se le dice a la máquina cómo hacerlo.' },
      { t: '<strong>Con la cuenta hecha.</strong> <code>muestra 1 + 4 + 9 + 16 + 25;</code>. Escribe 55 también, y el optimizador la pliega a <code>muestra 55;</code>, que son tres instrucciones contando el <code>PARA</code>.' },
      { t: '<strong>La comparación.</strong> La segunda ocupa muchísimo menos y tarda muchísimo menos. Y sin embargo es peor, y merece la pena entender por qué.', antes: 'Si una es más corta y más rápida, ¿por qué iba a ser peor?' },
      { t: '<strong>Porque no es el mismo programa.</strong> La primera calcula la suma de los cinco primeros cuadrados; la segunda escribe un 55. Cambia el 6 por un 7 en la primera y sigue estando bien; en la segunda hay que rehacer la cuenta a mano.' },
      { t: '<strong>Y ésa es la moraleja del bloque entero.</strong> Lo que un lenguaje te da no es velocidad: te da la posibilidad de <em>decir lo que quieres</em> en vez de decir el resultado. Lo de que salga rápido es trabajo del compilador, y ya has visto cómo lo hace.' }
    ],
    cierre: 'Que las dos escriban 55 es lo de menos. La diferencia entre ellas es todo lo que separa una tabla de resultados de un programa.'
  });

  p.comprueba('Para añadirle una palabra nueva a Pizca, ¿qué es lo que de verdad no puede faltar?', [
    { t: 'Un programa de ejemplo en la batería, para que la prueba diferencial lo corra por los dos caminos y compare', ok: true, por: 'El intérprete y el compilador se tocan en sitios distintos, y es facilísimo que uno quede bien y el otro no. Como los dos tienen que dar lo mismo, comparar sus salidas caza la diferencia sola, sin escribir ninguna prueba nueva.' },
    { t: 'Documentar la palabra nueva en la guía', ok: false, por: 'Está muy bien y hay que hacerlo, pero un lenguaje bien documentado y roto sigue roto.' },
    { t: 'Elegir una palabra que no se parezca a las otras seis', ok: false, por: 'El troceador lee la palabra entera antes de mirar la lista, así que da igual en qué se parezca.' }
  ]);

  p.util('Escribir un lenguaje de juguete es uno de los mejores ejercicios que hay, y no por el lenguaje: ' +
    'por lo que enseña de todo lo demás. Después de haber escrito un analizador, los mensajes de error ' +
    'de cualquier compilador dejan de ser un muro y se leen como lo que son; después de haber escrito un ' +
    'compilador, cuesta mucho más creerse que un programa haga algo que no se pueda explicar. Y si ' +
    'alguna vez tienes que leer un archivo con un formato raro, escribir un configurador o inventar una ' +
    'notación para un problema concreto, resulta que ya has hecho esto.');

  p.hist('El consejo de construir un lenguaje pequeño para aprender es viejo y se ha dado con varias ' +
    'formas. <strong>Niklaus Wirth</strong> diseñó Pascal en 1970 explícitamente para enseñar, y su ' +
    'compilador cabía en una máquina de la época; después hizo un lenguaje detrás de otro, cada uno más ' +
    'pequeño que el anterior, con la idea de que la simplicidad era el objetivo y no el punto de ' +
    'partida. Su frase más citada resume el bloque entero mejor que cualquier resumen: ' +
    '<em>«hacer algo simple es difícil, y hacerlo complicado es fácil»</em>. Pizca tiene siete palabras ' +
    'por esa razón, y todo lo que se ha construido aquí cabe en tres archivos que se pueden leer de una ' +
    'sentada.');

  p.trampas([
    { e: 'Añadir una palabra al intérprete y olvidarse del compilador', por: 'Es el fallo clásico, y no se ve: el programa funciona al interpretarlo y calla al compilarlo. Por eso la prueba compara los dos caminos.' },
    { e: 'Escribir el resultado en vez del cálculo', por: 'Un programa que escribe 55 no calcula nada. El día que cambie un dato hay que rehacerlo a mano.' },
    { e: 'Creer que un lenguaje pequeño es un lenguaje limitado', por: 'Con decidir y repetir ya no queda nada calculable fuera de alcance. Lo que dan las palabras de más es comodidad, no potencia.' },
    { e: 'Optimizar el programa antes de que funcione', por: 'Primero correcto, después rápido, y midiendo. Un programa rápido y equivocado no sirve de nada.' },
    { e: 'Pensar que esto solo vale para hacer lenguajes', por: 'Vale para cualquier texto con estructura que haya que leer: un archivo de configuración, un formato de datos, una notación inventada para un problema concreto.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Un programa que decide',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'escriba 1 si <code>n</code> es mayor que 10, y 0 si no',
          ref: 'si n > 10 { muestra 1; } sino { muestra 0; }',
          ns: [3, 10, 11, 50] },
        { t: 'escriba <code>n</code> si es positivo, y 0 si no',
          ref: 'si n > 0 { muestra n; } sino { muestra 0; }',
          ns: [5, 0, -7, 100] },
        { t: 'escriba el doble de <code>n</code> si <code>n</code> es menor que 20, y <code>n</code> tal cual si no',
          ref: 'si n < 20 { muestra n * 2; } sino { muestra n; }',
          ns: [3, 19, 20, 60] }
      ];
      var c = r.pick(casos);
      var casosPrueba = c.ns.map(function (n) {
        return { antes: 'sea n = ' + n + ';\n', salida: LEN.corre('sea n = ' + n + ';\n' + c.ref).salida };
      });
      return { t: c.t, ref: c.ref, casos: casosPrueba };
    },
    ask: function (d) {
      return 'La variable <code>n</code> ya está declarada. Escribe un programa que ' + d.t + '.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige con cuatro valores de ' +
        '<code>n</code>: vale cualquier programa que escriba lo mismo.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea, como <code>muestra n;</code>.' };
      var r = W.programaPizcaIguales(texto, d.casos, { tope: 30000 });
      return r.ok ? { ok: true, msg: 'Correcto, con los cuatro valores.' } : { ok: false, msg: r.porQue };
    },
    hint: function () { return 'El esqueleto es <code>si CONDICIÓN { ... } sino { ... }</code>, con las llaves obligatorias y punto y coma al final de cada sentencia de dentro.'; },
    steps: function (d) {
      return ['Una solución:<pre class="shd__mini">' + d.ref.replace(/</g, '&lt;') + '</pre>',
        'Las llaves son obligatorias aunque dentro solo haya una sentencia: es lo que evita el problema del «sino colgante».'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Un bucle que acumula',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'escriba la suma de los números de 1 a <code>n</code>',
          ref: 'sea s = 0;\nsea i = 1;\nmientras i <= n {\n  s = s + i;\n  i = i + 1;\n}\nmuestra s;', ns: [1, 4, 0, 10] },
        { t: 'escriba cuántos números de 1 a <code>n</code> son múltiplos de 3 (pista: <code>x / 3 * 3 == x</code> solo cuando x es múltiplo de 3)',
          ref: 'sea c = 0;\nsea i = 1;\nmientras i <= n {\n  si i / 3 * 3 == i { c = c + 1; }\n  i = i + 1;\n}\nmuestra c;', ns: [2, 3, 9, 10] },
        { t: 'escriba los números de 1 a <code>n</code> multiplicados por 2, uno por uno',
          ref: 'sea i = 1;\nmientras i <= n {\n  muestra i * 2;\n  i = i + 1;\n}', ns: [1, 3, 0, 5] }
      ];
      var c = r.pick(casos);
      var casosPrueba = c.ns.map(function (n) {
        return { antes: 'sea n = ' + n + ';\n', salida: LEN.corre('sea n = ' + n + ';\n' + c.ref, { tope: 30000 }).salida };
      });
      return { t: c.t, ref: c.ref, casos: casosPrueba, ns: c.ns };
    },
    ask: function (d) {
      return 'La variable <code>n</code> ya está declarada. Escribe un programa que ' + d.t + '. Con ' +
        '<code>n = 0</code> tiene que portarse bien.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige con n = ' +
        d.ns.join(', ') + '.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea.' };
      var r = W.programaPizcaIguales(texto, d.casos, { tope: 30000 });
      if (!r.ok) return { ok: false, msg: r.porQue };
      var instr = MAQ.ensambla(LEN.compila(LEN.analiza('sea n = 4;\n' + texto).ast).texto).instrucciones;
      return { ok: true, msg: 'Correcto, con los cuatro valores. Compilado ocupa ' + instr + ' instrucciones de máquina.' };
    },
    hint: function () {
      return ['El esqueleto de un bucle acumulador: declarar el acumulador a 0, declarar el contador a 1, <code>mientras</code> con la condición, el cuerpo, y sumarle 1 al contador al final.',
        'Acuérdate de poner el <code>muestra</code> <strong>fuera</strong> del bucle si lo que se pide es un solo número al final.'];
    },
    steps: function (d) {
      return ['Una solución:<pre class="shd__mini">' + d.ref.replace(/</g, '&lt;') + '</pre>',
        'Con <code>n = 0</code> la condición falla en la primera comprobación, así que el cuerpo no se ejecuta ni una vez y el acumulador sale con su valor inicial. Eso es lo que hay que comprobar antes de darlo por bueno.'];
    },
    answer: function (d) { return d.ref.replace(/\n/g, ' '); }
  });

  p.exercise({
    title: 'Una función que te haga el trabajo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'una función <code>cuadrado(x)</code> que devuelva <code>x</code> por <code>x</code>, y usarla para escribir los cuadrados de 1, 2 y 3',
          ref: 'fun cuadrado(x) { vuelve x * x; }\nmuestra cuadrado(1);\nmuestra cuadrado(2);\nmuestra cuadrado(3);',
          salida: [1, 4, 9] },
        { t: 'una función <code>mayor(a, b)</code> que devuelva el mayor de los dos, y usarla para escribir el mayor de 3 y 7, y el de 9 y 2',
          ref: 'fun mayor(a, b) {\n  si a > b { vuelve a; }\n  vuelve b;\n}\nmuestra mayor(3, 7);\nmuestra mayor(9, 2);',
          salida: [7, 9] },
        { t: 'una función <code>triple(x)</code> que devuelva <code>x</code> por 3, y usarla para escribir el triple de 4 y el triple del triple de 2',
          ref: 'fun triple(x) { vuelve x * 3; }\nmuestra triple(4);\nmuestra triple(triple(2));',
          salida: [12, 18] }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe ' + d.c.t + '.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige por lo que escribe, así ' +
        'que la función tiene que llamarse como dice el enunciado para que las llamadas funcionen.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos la definición de la función.' };
      var r = W.programaPizcaIguales(texto, [{ antes: '', salida: d.c.salida }], { tope: 30000 });
      if (!r.ok) return { ok: false, msg: r.porQue };
      var c = LEN.corre(texto, { compilado: true, tope: 30000 });
      if (String(c.salida) !== String(d.c.salida)) {
        return { ok: false, msg: 'Interpretado sale bien, pero compilado escribe ' +
          (c.salida.length ? c.salida.join(', ') : 'nada') + '. Si te pasa esto, es un fallo del compilador y no tuyo.' };
      }
      return { ok: true, msg: 'Correcto por los dos caminos.' };
    },
    hint: function () { return 'Una función se define con <code>fun nombre(parámetros) { ... vuelve algo; }</code>, y se usa dentro de una expresión, como si fuera un número.'; },
    steps: function (d) {
      return ['Una solución:<pre class="shd__mini">' + d.c.ref.replace(/</g, '&lt;') + '</pre>',
        'La definición puede ir antes o después de las llamadas: el analizador apunta todas las funciones antes de ejecutar nada.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.exercise({
    title: 'Lo más barato que puedas',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'escriba los números 2, 4, 6, 8 y 10, en ese orden', salida: [2, 4, 6, 8, 10],
          ref: 'sea i = 1;\nmientras i <= 5 {\n  muestra i * 2;\n  i = i + 1;\n}', min: 11 },
        { t: 'escriba 100 dividido entre 1, entre 2, entre 4 y entre 5, en ese orden', salida: [100, 50, 25, 20],
          ref: 'muestra 100 / 1;\nmuestra 100 / 2;\nmuestra 100 / 4;\nmuestra 100 / 5;', min: 9 },
        { t: 'escriba la suma de los números de 1 a 10', salida: [55],
          ref: 'sea s = 0;\nsea i = 1;\nmientras i <= 10 {\n  s = s + i;\n  i = i + 1;\n}\nmuestra s;', min: 3 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe un programa que ' + d.c.t + ', y hazlo con <strong>las menos instrucciones de ' +
        'máquina posibles</strong>.<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se cuenta ' +
        'lo que sale de compilarlo con el optimizador puesto. Se puede con ' + d.c.min + ', y si lo ' +
        'consigues con menos, mejor.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea.' };
      var r = W.programaPizcaIguales(texto, [{ antes: '', salida: d.c.salida }], { tope: 30000 });
      if (!r.ok) return { ok: false, msg: r.porQue };
      var a = LEN.analiza(texto);
      var instr = MAQ.ensambla(LEN.compila(LEN.optimiza(LEN.copia(a.ast))).texto).instrucciones;
      return { ok: true, msg: 'Correcto, con <strong>' + instr + '</strong> instrucciones.' +
        (instr > d.c.min ? ' Se puede con ' + d.c.min + ': piensa qué parte del trabajo puede hacer el optimizador por ti.'
          : (instr < d.c.min ? ' Menos que las ' + d.c.min + ' que tenía apuntadas. Enhorabuena.' : ' Que es el mínimo que conozco.')) };
    },
    hint: function () {
      return ['El optimizador pliega cualquier cuenta que solo tenga números, así que todo lo que se pueda decir con constantes sale gratis en tiempo de ejecución.',
        'Un bucle es más elegante y ocupa más. Aquí se está midiendo tamaño, no elegancia: escribe las dos versiones y compáralas en el taller.'];
    },
    steps: function (d) {
      var pelado = MAQ.ensambla(LEN.compila(LEN.analiza(d.c.ref).ast).texto).instrucciones;
      return ['La forma natural es ésta, y ocupa ' + pelado + ' instrucciones:<pre class="shd__mini">' +
        d.c.ref.replace(/</g, '&lt;') + '</pre>',
        'Y se puede bajar a ' + d.c.min + ' escribiendo las cuentas con constantes, porque entonces el optimizador las pliega y no queda nada que ejecutar.',
        'Ojo con la moraleja: la versión corta está bien <em>aquí</em>, donde los datos son fijos y se piden por escrito. En cuanto uno de esos números dependiera de algo, la versión con bucle sería la única que sigue valiendo.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.note('Cuando quieras saber si el bloque entero se ha quedado, en [[maq-examen]] hay un examen procedimental con preguntas de todos sus temas, con reloj y corregido al entregar.', 'ok', 'Para medirte');

  p.keys([
    'El camino completo va de tu texto a cables a 1 y a 0, y no hay ni un paso que no hayas visto por dentro.',
    'Un ordenador no entiende nada: son <strong>tablas de verdad apiladas</strong>. Un lenguaje no es un idioma que la máquina hable: es un <strong>texto que otro programa traduce</strong>.',
    'Añadirle una palabra al lenguaje son cinco sitios, y el que de verdad importa es el quinto: <strong>un programa en la batería</strong>, para que la prueba diferencial lo compruebe sola.',
    'La prueba que merece la pena construir no es la que dice que el código hace lo que crees, sino la que <strong>compara dos caminos independientes</strong> hacia el mismo sitio.',
    'Dos de las cosas que le faltan a Pizca piden la misma instrucción: <strong>leer una celda cuya dirección está en otra celda</strong>. Sin ella no hay listas, ni marcos de pila, ni quines.',
    'Escribir el resultado no es programar: un programa dice <strong>cómo</strong> se calcula, y por eso sigue valiendo cuando cambian los datos.',
    'Con decidir y repetir ya no queda nada calculable fuera de alcance: las palabras de más dan comodidad, no potencia.'
  ]);
});
