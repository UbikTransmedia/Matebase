/* Tema: El programa que se escribe a sí mismo */
Course.topic('len-autorreferencia', function (p) {

  p.puente('Queda una consecuencia del bloque que todavía no se ha cobrado. En [[maq-cpu|la máquina]] se ' +
    'vio que un programa son números en celdas, indistinguibles de los datos. Y en ' +
    '[[len-compilar|el compilador]] se ha escrito un programa que lee otro programa y escribe un ' +
    'tercero. Junta las dos cosas y aparece un terreno raro: <strong>los programas que hablan de ' +
    'programas, incluido de sí mismos</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Un programa que se mira');

  p.text('Empecemos por lo pequeño. El compilador guarda el programa en la memoria desde la celda 0, así ' +
    'que un programa puede <strong>leerse a sí mismo</strong> con un <code>CARGA 0</code>: eso trae el ' +
    'número que hay en la celda 0, que resulta ser su propia primera instrucción.');

  p.demo({
    title: 'Un programa mirándose el ombligo',
    intro: 'Este programa escribe el contenido de sus tres primeras celdas. Corre y compara lo que sale con la columna de valores de la tabla de memoria: son los mismos números. El programa se está leyendo a sí mismo.',
    predice: 'La primera instrucción es un CARGA. ¿Qué número crees que hay en la celda 0, y por tanto qué escribirá primero?',
    build: function (host) {
      W.maquina(host, {
        id: 'auto-mira',
        texto: 'CARGA 0\nMUESTRA\nCARGA 1\nMUESTRA\nCARGA 2\nMUESTRA\nPARA',
        nota: 'Escribe <strong>2, 0, 15</strong>: el código de <code>CARGA</code>, su argumento y el código de <code>MUESTRA</code>. Nada de esto es un truco: es la consecuencia directa de que programa y datos vivan en la misma memoria.'
      });
    }
  });

  p.text('La pregunta natural es la siguiente: si puede escribir tres celdas, ¿podría escribirse ' +
    '<strong>entero</strong>? A un programa que escribe su propio texto se le llama <em>quine</em>. La ' +
    'respuesta corta es que sí, y que cabe en veintiséis celdas; la larga es más interesante, porque ' +
    'durante buena parte de este bloque la respuesta era que no, y la razón de que ahora sea que sí ' +
    'cabe en una sola instrucción.');

  /* ---------------------------------------------------------------- */
  p.section('Por qué con dieciséis instrucciones no se podía');

  p.text('Hasta que la máquina tuvo <code>CARGAI</code>, la respuesta era que no, y la razón era una ' +
    'cuenta de una línea. Para escribir una celda hacían falta dos instrucciones, <code>CARGA d</code> ' +
    'y <code>MUESTRA</code>, que ocupan <strong>tres celdas</strong>: dos la primera —orden y ' +
    'argumento— y una la segunda. Un programa que quisiera escribir $k$ celdas de esa manera ocuparía ' +
    '$3k$, más una del <code>PARA</code>.');

  p.formula('\\text{para escribir } k \\text{ celdas ocupa } 3k + 1', 'y necesitaría escribir esas 3k+1');

  p.text('Para escribirse entero haría falta $k = 3k + 1$, o sea $k = -\\tfrac{1}{2}$. No hay ningún ' +
    'tamaño que funcione: <strong>crece tres veces más deprisa de lo que alcanza</strong>. Con tres ' +
    'pares ocupa 10 celdas y escribe 3; con siete pares ocupa 22 y escribe 7. La distancia no se ' +
    'cierra, se agranda.');

  p.note('Y fíjate en <em>por qué</em> crecía. Cada celda que quería imprimir obligaba a escribir su ' +
    'dirección en el programa, porque no había forma de calcularla. El fallo no era el tamaño: era que ' +
    '<strong>una dirección no podía ser un dato</strong>.',
    'warn', 'Dónde estaba el nudo');

  /* ---------------------------------------------------------------- */
  p.section('Y por qué con dieciocho sí');

  p.text('En [[maq-ensamblador|el tema del ensamblador]] aparecieron <code>CARGAI</code> y ' +
    '<code>GUARDAI</code>, que leen y escriben en la celda cuya dirección está guardada en otra celda. ' +
    'Con eso, imprimir la memoria deja de ser una lista de órdenes y pasa a ser un <strong>bucle</strong>: ' +
    'un contador que sube y un <code>CARGAI</code> que lee por donde va.');

  p.text('Y entonces el programa <strong>ya no crece con lo que imprime</strong>. Ocupa lo que ocupe el ' +
    'bucle, imprima tres celdas o trescientas. La ecuación imposible de antes se convierte en otra que ' +
    'sí tiene solución: basta con que el número que lleva escrito coincida con el tamaño del programa.');

  p.demo({
    title: 'El quine, corriendo',
    intro: 'Veintiséis celdas, y escribe exactamente esas veintiséis. Compara la salida con la columna de valores de la tabla de memoria, celda a celda: son la misma lista. Después cambia el 26 por otro número y mira cómo deja de coincidir.',
    predice: 'El programa lleva un 26 escrito dentro. ¿Qué crees que pasaría si ocupara 27 celdas y siguiera diciendo 26?',
    build: function (host) {
      W.maquina(host, {
        id: 'auto-quine', tope: 3000,
        texto: MAQ.EJEMPLOS.quine.texto,
        nota: 'El <code>26</code> de la sexta celda es el tamaño del propio programa, y es lo único que hay que acertar. La variable <code>i</code> vive en la celda 26, justo detrás: por eso no se imprime a sí misma, y por eso el programa no es un blanco móvil.'
      });
    }
  });

  p.note('Eso que acaba de pasar tiene nombre: es un <strong>punto fijo</strong>. El programa se ha ' +
    'escrito de forma que una cantidad —su tamaño— sea a la vez un dato que lleva dentro y una ' +
    'propiedad de sí mismo, y el trabajo consiste en hacer que las dos coincidan. No es una casualidad ' +
    'afortunada de esta máquina: el <strong>teorema de recursión</strong> de Kleene dice que en ' +
    'cualquier lenguaje suficientemente potente ese punto fijo <em>siempre</em> existe.',
    'ok', 'Un punto fijo');

  p.text('Los quines de los lenguajes con texto hacen lo mismo por otro camino, porque ahí no se puede ' +
    'leer la propia memoria: guardan el texto <strong>una vez</strong> y lo usan <strong>dos</strong>, ' +
    'una como dato que se escribe y otra como instrucciones que se ejecutan. Ese doble uso es la misma ' +
    'idea, y es lo que hace una célula con su ADN.');

  /* ---------------------------------------------------------------- */
  p.section('El compilador que se compila a sí mismo');

  p.text('La autorreferencia más útil de la informática no es un juego: es cómo se construye un ' +
    'compilador de verdad. Si quieres un compilador para un lenguaje nuevo, lo escribes primero en otro ' +
    'lenguaje; después <strong>reescribes el compilador en el lenguaje nuevo</strong> y lo compilas con ' +
    'el viejo. A partir de ahí, el compilador se compila a sí mismo y el primero se puede tirar.');

  p.text('Se llama <em>bootstrapping</em>, por lo de tirarse de los cordones de las botas para ' +
    'levantarse, y es como están hechos casi todos los compiladores en uso. Tiene una consecuencia ' +
    'inquietante que descubrió Ken Thompson y que merece contarse entera.');

  p.note('Imagina un compilador al que alguien le añade dos trampas. La primera: cuando detecta que está ' +
    'compilando el programa de entrada al sistema, le mete una contraseña secreta. La segunda, y aquí ' +
    'está el truco: cuando detecta que está compilando <strong>un compilador</strong>, le mete las dos ' +
    'trampas. Ahora quítalas del código fuente del compilador y compílalo con la versión ' +
    'anterior. El compilador nuevo <em>tiene</em> las trampas, y su código fuente está limpio. Puedes ' +
    'leerte el fuente entero, línea por línea, y no encontrarás nada.',
    'warn', 'Confiar en la confianza');

  p.text('Thompson lo contó en 1984 al recibir el premio Turing, y la moraleja que sacó es de las que ' +
    'no se olvidan: <em>ninguna cantidad de revisión del código fuente te protege de usar herramientas ' +
    'que no has construido tú</em>. La respuesta práctica que se encontró treinta años después tiene ' +
    'que ver con compilar el mismo compilador con varios compiladores distintos y comprobar que salen ' +
    'binarios idénticos; se llama <em>compilación reproducible</em>, y hoy es un requisito serio en el ' +
    'software crítico.');

  /* ---------------------------------------------------------------- */
  p.section('La autorreferencia como herramienta de demostración');

  p.text('Hay una tercera cara, y es la más profunda. Cuando un programa puede recibir programas como ' +
    'datos, se puede construir el programa incómodo: el que <strong>hace lo contrario de lo que otro ' +
    'predice sobre él</strong>.');

  p.text('Ése es exactamente el argumento del [[av-computabilidad|problema de la parada]]: si existiera ' +
    'un programa capaz de decidir si otro acaba, se podría escribir uno que le preguntara por sí mismo ' +
    'y luego hiciera lo contrario. Y es también el argumento diagonal de [[av-infinito|Cantor]], y el de ' +
    'Gödel con su «esta afirmación no es demostrable». Las tres son la misma jugada, y el bloque entero ' +
    'ha estado construyendo las piezas que la hacen posible: un programa es un dato, y un programa puede ' +
    'leer programas.');

  p.note('Por eso este tema está aquí y no al principio. La autorreferencia suena a acertijo mientras no ' +
    'se ha visto la máquina por dentro; en cuanto se ha visto que un programa son números en una ' +
    'memoria, deja de ser un juego de palabras y pasa a ser una cosa que se puede hacer, con ' +
    'consecuencias que se pueden demostrar. Y esa es, seguramente, la mejor razón para haber construido ' +
    'un ordenador desde las puertas lógicas.',
    'ok', 'Por qué este tema va al final');

  p.ejemplo({
    title: 'Cuánto tendría que ocupar un quine por copia',
    enunciado: 'Comprobar con números que un programa que escribe sus celdas una a una nunca puede escribirse entero, y ver a qué distancia se queda.',
    pasos: [
      { t: '<strong>Lo que cuesta escribir una celda.</strong> <code>CARGA d</code> ocupa dos celdas y <code>MUESTRA</code> una: tres celdas por cada celda escrita.', antes: 'Cuenta las celdas, no las instrucciones: las que llevan argumento ocupan dos.' },
      { t: '<strong>Con tres pares.</strong> $3 \\times 3 = 9$ celdas, más una del <code>PARA</code>: diez. Y escribe tres. Se queda a siete.' },
      { t: '<strong>Con siete pares.</strong> $3 \\times 7 = 21$, más una: veintidós celdas. Y escribe siete. Ahora se queda a quince.', antes: '¿La distancia se acorta o se agranda al añadir pares?' },
      { t: '<strong>La cuenta general.</strong> Escribe $k$ y ocupa $3k + 1$: la distancia es $2k + 1$, que <strong>crece</strong> con $k$. Cuantos más pares se añaden, más lejos queda.' },
      { t: '<strong>La conclusión.</strong> No hay ningún $k$ que valga, así que por este camino no hay quine. Lo que falla no es el tamaño: es la idea de guardar una copia, porque una copia más el mecanismo de copiarla siempre es mayor que el original.' }
    ],
    cierre: 'Todo ese crecimiento venía de tener que escribir cada dirección en el programa. En cuanto una dirección se puede calcular —y eso es lo único que añaden <code>CARGAI</code> y <code>GUARDAI</code>—, el programa deja de crecer con lo que imprime y la ecuación imposible se vuelve posible. Un bucle, y ya está.'
  });

  p.comprueba('¿Por qué un programa que escribe sus celdas de una en una no puede llegar a escribirse entero?', [
    { t: 'Porque cada celda que quiere escribir le cuesta tres celdas de programa, así que crece más deprisa de lo que alcanza', ok: true, por: 'Escribe $k$ y ocupa $3k+1$. La distancia, $2k+1$, aumenta con cada par que se añade: perseguirse a sí mismo así es imposible.' },
    { t: 'Porque un programa no puede leer su propia memoria', ok: false, por: 'Sí puede, y la demo lo hace: en esta máquina programa y datos comparten memoria, así que <code>CARGA 0</code> trae la primera instrucción.' },
    { t: 'Porque la memoria de la máquina es demasiado pequeña', ok: false, por: 'No es cuestión de tamaño: con mil celdas o con un millón pasaría lo mismo, porque el problema es la proporción, no el límite.' }
  ]);

  p.util('Lo de «guardarlo una vez y usarlo dos» no es solo cosa de acertijos informáticos: es lo que hace ' +
    'una célula. El ADN se copia —se usa como dato— y se lee —se usa como instrucciones—, y la misma ' +
    'molécula hace las dos cosas. John von Neumann describió la estructura lógica que hacía falta para ' +
    'que algo se reprodujera a sí mismo en 1948, antes de que se supiera cómo era el ADN, y cuando se ' +
    'descubrió resultó tener exactamente esa forma. También es lo que hace un virus informático, por las ' +
    'mismas razones y con peor intención.');

  p.hist('La palabra <em>quine</em> se la puso Douglas Hofstadter en honor a <strong>Willard van Orman ' +
    'Quine</strong>, el mismo filósofo que aparece en [[maq-normal|la simplificación de circuitos]]: ' +
    'Quine estudió frases que se refieren a sí mismas, como «<em>precedida de su propia cita, produce ' +
    'una falsedad</em>, precedida de su propia cita, produce una falsedad». El resultado matemático de ' +
    'fondo es el <strong>teorema de recursión</strong> de Stephen Kleene, de 1938: en cualquier lenguaje ' +
    'suficientemente potente <em>siempre</em> existe un programa que se escribe a sí mismo, y además se ' +
    'puede construir. No es un truco de cada lenguaje: es una propiedad de la computación.');

  p.trampas([
    { e: 'Creer que un quine guarda una copia de su texto', por: 'Sería más grande que él mismo. Lo que hace es guardar el texto una vez y usarlo dos veces, como dato y como instrucciones.' },
    { e: 'Pensar que leer la propia memoria es un truco raro', por: 'Es la consecuencia directa de que programa y datos compartan memoria. Lo raro sería que no se pudiera.' },
    { e: 'Confundir «no se puede así» con «no se puede»', por: 'Lo que era imposible era hacerlo copiando, y en una máquina sin direccionamiento indirecto. En cualquier lenguaje razonable hay quines, y el teorema de recursión de Kleene garantiza que existen siempre.' },
    { e: 'Creer que leer el código fuente basta para confiar en un programa', por: 'Es justamente lo que desmontó Thompson: la trampa puede estar en el compilador, y no aparecer en ningún fuente.' },
    { e: 'Tratar la autorreferencia como un juego de palabras', por: 'Es la herramienta con la que se demuestran los límites de lo calculable. Cantor, Gödel y Turing usan la misma jugada.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánto ocupa y cuánto escribe',
    level: 'basico',
    gen: function (r) {
      var k = r.int(2, 8);
      return { k: k, ocupa: 3 * k + 1, falta: 2 * k + 1 };
    },
    ask: function (d) {
      return 'Un programa escribe sus <strong>' + d.k + '</strong> primeras celdas con pares de ' +
        '<code>CARGA d</code> y <code>MUESTRA</code>, y termina en <code>PARA</code>. ¿Cuántas celdas ' +
        'ocupa, y cuántas le faltan para llegar a escribirse entero?';
    },
    fields: [{ name: 'o', label: 'ocupa', w: 'tiny' }, { name: 'f', label: 'le faltan', w: 'tiny' }],
    sol: function (d) { return { o: d.ocupa, f: d.falta }; },
    tol: 0.5,
    hint: function () { return '<code>CARGA d</code> ocupa dos celdas y <code>MUESTRA</code> una: tres por cada celda escrita. Y el <code>PARA</code>, una más.'; },
    steps: function (d) {
      return ['Cada par ocupa 3 celdas: $3 \\times ' + d.k + ' = ' + (3 * d.k) + '$.',
        'Más el <code>PARA</code>: $' + (3 * d.k) + ' + 1 = ' + d.ocupa + '$ celdas.',
        'Escribe ' + d.k + ' y ocupa ' + d.ocupa + ', así que le faltan $' + d.ocupa + ' - ' + d.k + ' = ' + d.falta + '$. Y esa distancia crece con $k$: por eso no hay forma.'];
    },
    answer: function (d) { return 'ocupa ' + d.ocupa + ' y le faltan ' + d.falta; }
  });

  p.exercise({
    title: 'Qué escribe el que se mira',
    level: 'medio',
    gen: function (r) {
      var celda = r.int(0, 5);
      var prog = 'CARGA 0\nMUESTRA\nCARGA 1\nMUESTRA\nCARGA 2\nMUESTRA\nPARA';
      var img = MAQ.ensambla(prog).imagen;
      return { celda: celda, v: img[celda], prog: prog, img: img };
    },
    ask: function (d) {
      return 'Se ensambla este programa:<pre class="shd__mini">' + d.prog + '</pre>' +
        '¿Qué número hay en la <strong>celda ' + d.celda + '</strong>? Los códigos van por orden desde ' +
        'el cero: <code>' + MAQ.NOMBRES.join('</code>, <code>') + '</code>.';
    },
    fields: [{ name: 'v', label: 'el número', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    tol: 0.5,
    hint: function () { return 'Coloca el programa desde la celda 0: <code>CARGA</code> ocupa dos celdas —la orden y su argumento— y <code>MUESTRA</code> una.'; },
    steps: function (d) {
      return ['Colocado desde la celda 0, el programa queda: $' + d.img.join(',\\ ') + '$.',
        'En la celda ' + d.celda + ' hay un <strong>' + d.v + '</strong>.',
        'Y fíjate en que el propio programa, al correr, escribe los tres primeros de esa lista: se está leyendo a sí mismo.'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'Autorreferencia por todas partes',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'un compilador escrito en el propio lenguaje que compila', v: 'boot', por: 'Es el <em>bootstrapping</em>: se escribe primero en otro lenguaje, se reescribe en el nuevo y a partir de ahí se compila a sí mismo.' },
        { t: 'un programa que escribe su propio texto y nada más', v: 'quine', por: 'Eso es un <em>quine</em>. Existe en cualquier lenguaje razonable, y el teorema de recursión de Kleene lo garantiza.' },
        { t: 'suponer que existe un programa que decide si otro acaba, y construir uno que le pregunte por sí mismo y haga lo contrario', v: 'diagonal', por: 'Es el argumento diagonal, el mismo de Cantor y de Gödel: construir el caso que contradice a quien lo predice.' },
        { t: 'un trozo de código que se copia a sí mismo dentro de otros programas', v: 'virus', por: 'Un virus informático. Estructuralmente es lo mismo que una célula copiando su ADN, y por las mismas razones lógicas.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Cómo se llama esto?<br><strong>' + d.c.t + '</strong>'; },
    fields: [{ name: 'q', label: 'Se llama', opts: [
      { t: 'bootstrapping', v: 'boot' },
      { t: 'un quine', v: 'quine' },
      { t: 'el argumento diagonal', v: 'diagonal' },
      { t: 'un virus', v: 'virus' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Las cuatro son autorreferencia, pero con propósitos distintos: construir una herramienta, escribirse, demostrar un límite o propagarse.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Qué era lo que faltaba',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'una instrucción que cargue lo que hay en la celda <strong>cuya dirección está guardada en otra celda</strong>', v: 'si', por: 'Eso era exactamente lo que faltaba, y es <code>CARGAI</code>. Con ella el recorrido de la memoria se escribe como un bucle, y entonces el programa deja de crecer con el número de celdas que imprime: ocupa lo mismo escriba tres o trescientas.' },
        { t: 'más memoria: 1024 celdas en vez de 256', v: 'no', por: 'No serviría de nada. El problema no es el límite sino la proporción: ocupar $3k+1$ para escribir $k$ falla con cualquier memoria, por grande que sea.' },
        { t: 'una instrucción que escriba varias celdas de golpe', v: 'no', por: 'Ayudaría con la constante, pero no cambia el fondo: seguiría haciendo falta nombrar cada celda en el programa, y eso sigue creciendo con lo que se quiere escribir.' },
        { t: 'un tope de pasos más alto', v: 'no', por: 'El tope no tiene nada que ver: el programa no se queda sin tiempo, es que no existe ningún tamaño que cuadre.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Con las dieciséis instrucciones que la máquina tenía al principio no había forma de escribir un programa que se imprimiera entero. ¿Bastaría esto para conseguirlo?<br><strong>' + d.c.t + '</strong>'; },
    fields: [{ name: 'q', label: 'Bastaría', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'La pregunta clave es: ¿con eso deja el programa de crecer cuando crece el número de celdas que quiere escribir?'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Como programa y datos comparten memoria, un programa puede <strong>leerse a sí mismo</strong>: <code>CARGA 0</code> trae su primera instrucción.',
    'Copiando no se puede: escribir $k$ celdas cuesta $3k+1$, así que el programa crece tres veces más deprisa de lo que alcanza.',
    'Lo que falla es guardar una copia. Un quine de verdad guarda el texto <strong>una vez y lo usa dos</strong>: como dato y como instrucciones, igual que una célula con su ADN.',
    'Lo que lo hace posible es poder leer una celda cuya <strong>dirección esté en otra celda</strong>: con eso el bucle no crece con lo que imprime, y el punto fijo se cierra en 26 celdas.',
    'Un compilador se construye por <strong>bootstrapping</strong>: se reescribe en su propio lenguaje y a partir de ahí se compila a sí mismo.',
    'De ahí sale el aviso de Thompson: una trampa metida en un compilador <strong>puede no aparecer en ningún código fuente</strong>.',
    'La autorreferencia es la herramienta con la que se demuestran los límites: Cantor, Gödel y Turing usan la misma jugada, y el teorema de recursión de Kleene garantiza que los quines existen.'
  ]);
});
