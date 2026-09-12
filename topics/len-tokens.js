/* Tema: Trocear el texto: el analizador léxico es un autómata */
Course.topic('len-tokens', function (p) {

  p.puente('Empieza la segunda mitad del bloque, y el cambio de bando es completo: hasta aquí has ' +
    'construido la máquina; a partir de aquí vas a construir <strong>quien le habla</strong>. El ' +
    '[[maq-ensamblador|ensamblador]] ya era un traductor, pero uno tan modesto que casi no se nota: una ' +
    'línea, una instrucción. Un lenguaje de programación es otra cosa.');

  p.text('La diferencia se ve con un ejemplo. Esto es una sola línea:');

  p.text('<pre class="shd__mini">muestra (x + 3) * 2;</pre>');

  p.text('y para la máquina son ocho instrucciones que hay que <em>deducir</em>, en un orden que no es ' +
    'el de izquierda a derecha. Entre ese texto y esas instrucciones hay tres pasos, y los tres ocupan ' +
    'un tema cada uno. El primero es el más humilde y el más necesario: <strong>trocear</strong>.');

  p.note('El lenguaje que se construye en esta segunda mitad se llama <strong>Pizca</strong>, que es lo ' +
    'que tiene: siete palabras, cuatro operaciones y seis comparaciones. Con eso basta para escribir ' +
    'cualquier cálculo, y que baste con tan poco es en sí mismo parte de lo que hay que aprender.',
    'ok', 'El lenguaje se llama Pizca');

  /* ---------------------------------------------------------------- */
  p.section('Una pieza con nombre');

  p.text('Un programa llega como una ristra de caracteres: <code>m</code>, <code>u</code>, ' +
    '<code>e</code>, <code>s</code>… Nadie puede trabajar así. Lo primero es agrupar los caracteres en ' +
    '<strong>piezas con nombre</strong>, que se llaman <em>tokens</em>. Cada una dice qué es y qué ' +
    'texto la formaba:');

  p.table(['pieza', 'qué es', 'ejemplos'],
    [['<code>num</code>', 'un número', '<code>0</code>, <code>42</code>'],
     ['<code>nombre</code>', 'algo que el programa bautiza', '<code>x</code>, <code>doble</code>'],
     ['<code>palabra</code>', 'una de las siete del lenguaje', '<code>sea</code>, <code>mientras</code>'],
     ['<code>op</code>', 'un símbolo', '<code>+</code>, <code>&lt;=</code>, <code>;</code>, <code>{</code>']]);

  p.text('Fíjate en lo que <strong>desaparece</strong> al trocear: los espacios, los saltos de línea y ' +
    'los comentarios. No son piezas, son separadores; una vez hecho el corte no vuelven a hacer falta. ' +
    'Por eso da igual escribir el programa apretado o con sangría bonita: para las piezas es el mismo.');

  p.demo({
    title: 'El troceador, en marcha',
    intro: 'Escribe lo que quieras en el editor y mira abajo en qué piezas se parte. Prueba a meter espacios de más, saltos de línea o un comentario con # y comprueba que la lista no cambia.',
    predice: '¿Cuántas piezas crees que salen de «sea x = 12;»? Cuéntalas antes de mirar.',
    build: function (host) {
      W.lenguaje(host, {
        id: 'len-tok', paneles: ['tokens'], avisa: 'poco',
        texto: 'sea x = 12;\nmuestra x >= 3;   # un comentario',
        nota: 'Una cosa a la que merece la pena jugar: escribe <code>&gt;=</code> y luego <code>&gt; =</code> con un espacio en medio. En el primer caso sale <strong>una</strong> pieza y en el segundo <strong>dos</strong>, porque el troceador siempre coge el trozo más largo que puede.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Por dentro es un autómata');

  p.text('El troceador no necesita entender nada. Va carácter a carácter con un <strong>estado</strong> ' +
    'y una regla por estado, que es exactamente la definición de autómata que viste en ' +
    '[[lg-algoritmos|los algoritmos]]:');

  p.list([
    'Si está <em>parado</em> y llega un espacio, lo tira y sigue parado.',
    'Si está parado y llega una cifra, pasa a <em>leyendo número</em>.',
    'Si está leyendo número y llega otra cifra, la añade y sigue igual; si llega cualquier otra cosa, cierra la pieza y vuelve a parado <strong>sin consumir</strong> ese carácter.',
    'Lo mismo con las letras, que llevan a <em>leyendo nombre</em>.'
  ], true);

  p.note('Eso de «cierra la pieza sin consumir el carácter» es la única sutileza del asunto, y tiene ' +
    'nombre: <strong>mirar sin comer</strong>. El troceador necesita ver el carácter siguiente para ' +
    'saber que el número se ha acabado, pero no puede quedárselo, porque es el principio de la pieza ' +
    'siguiente. Un analizador que se coma ese carácter se deja piezas por el camino, y es el fallo ' +
    'clásico de quien escribe su primer troceador.',
    'warn', 'Mirar sin comer');

  p.text('¿Y cómo distingue <code>sea</code> —que es una palabra del lenguaje— de <code>seat</code> —que ' +
    'sería un nombre cualquiera? No lo distingue mientras lee: lee <strong>letras hasta que se acaban</strong> ' +
    'y solo entonces mira si lo leído está en la lista de las siete. Intentar decidirlo antes lleva a un ' +
    'lío considerable, y a que un programa con una variable llamada <code>seamos</code> deje de compilar.');

  p.demo({
    title: 'Piezas que se parecen',
    intro: 'Cuatro casos escogidos para pillar al troceador. Míralos uno a uno y después cámbialos: quita el espacio de «> =», pon «seamos» en vez de «sea», parte un número en dos.',
    predice: '¿Crees que «sea» y «seamos» se trocean igual? ¿Y «12» frente a «1 2»?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'len-tok2', paneles: ['tokens'], avisa: 'poco',
        texto: 'sea seamos = 12;\nsea otro = 1;\nmuestra seamos >= otro;',
        nota: 'El estado del autómata no se ve, pero se deduce: cada vez que aparece una pieza nueva en la lista es que volvió a «parado».'
      });
    }
  });

  p.ejemplo({
    title: 'Trocear a mano',
    enunciado: 'Escribir las piezas que salen de <code>sea n12 = 3+4;</code>, diciendo de cada una qué es.',
    pasos: [
      { t: '<strong>Las tres primeras letras.</strong> Se leen letras mientras las haya: sale <code>sea</code>, y como está en la lista de las siete, es una <code>palabra</code>. El espacio se tira.', antes: 'Ojo: no se decide que es «sea» hasta que se acaban las letras.' },
      { t: '<strong>Un nombre con cifras dentro.</strong> Empieza por letra, así que se leen letras <em>y cifras</em>: sale <code>n12</code>, que no está en la lista, luego es un <code>nombre</code>. Fíjate en que un nombre puede llevar cifras, pero no empezar por una.' },
      { t: '<strong>Los símbolos.</strong> <code>=</code> es un <code>op</code>. El troceador mira si con el siguiente carácter forma uno de los dobles —<code>==</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>!=</code>— y como no, lo deja en uno solo.' },
      { t: '<strong>Los números y el resto.</strong> <code>3</code> es un <code>num</code>: se leen cifras hasta que aparece el <code>+</code>, que no es cifra, así que cierra la pieza sin consumirlo. Luego <code>+</code> (op), <code>4</code> (num) y <code>;</code> (op).' },
      { t: '<strong>El recuento.</strong> Siete piezas: <code>sea</code>, <code>n12</code>, <code>=</code>, <code>3</code>, <code>+</code>, <code>4</code>, <code>;</code>. Los dos espacios no aparecen por ninguna parte.' }
    ],
    cierre: 'Siete piezas de una línea de catorce caracteres. Y a partir de aquí, el resto del traductor ya no vuelve a mirar el texto: trabaja solo con la lista.'
  });

  p.comprueba('¿Por qué el troceador necesita mirar el carácter siguiente sin quedárselo?', [
    { t: 'Porque solo sabe que una pieza ha terminado cuando ve algo que ya no le pertenece, y ese algo empieza la pieza siguiente', ok: true, por: 'Leyendo <code>12+</code>, el <code>+</code> es lo que le avisa de que el número se acabó. Si se lo comiera, la pieza siguiente empezaría sin su primer carácter y el <code>+</code> se perdería.' },
    { t: 'Porque hay que comprobar que el programa no tiene faltas de ortografía', ok: false, por: 'El troceador no juzga nada: agrupa caracteres. Si algo está mal escrito, lo dirá el paso siguiente, el que monta el árbol.' },
    { t: 'Porque los comentarios pueden aparecer en cualquier sitio', ok: false, por: 'Los comentarios se tiran en cuanto se reconoce el <code>#</code>, y no obligan a mirar hacia delante más allá de eso.' }
  ]);

  p.util('Esto no es solo cosa de compiladores. Cada vez que un programa lee un archivo de ' +
    'configuración, una hoja de cálculo en CSV, una fecha escrita a mano o una consulta de búsqueda, ' +
    'lo primero que hace es esto mismo. Y cuando algo falla al leer datos, el fallo está casi siempre ' +
    'aquí: en un separador que aparecía dentro de un dato, en un número con coma donde se esperaba un ' +
    'punto, en un espacio de más. Media informática práctica es trocear texto ajeno con cuidado.');

  p.hist('El primer compilador, el A-0 de <strong>Grace Hopper</strong> (1952), no troceaba gran cosa: ' +
    'funcionaba juntando trozos de código ya escritos. La idea de separar el troceo del resto llegó ' +
    'con FORTRAN y se volvió técnica formal en los sesenta, cuando se demostró que los tokens de ' +
    'cualquier lenguaje razonable se pueden describir con <strong>expresiones regulares</strong> y ' +
    'reconocer con un autómata finito. De ahí salió <em>lex</em>, un programa de 1975 al que se le da ' +
    'la lista de expresiones y devuelve el troceador escrito. Que se pudiera automatizar es lo que ' +
    'convirtió escribir un compilador en algo que cabe en un curso.');

  p.trampas([
    { e: 'Creer que el troceador entiende el programa', por: 'No entiende nada. <code>+ ; sea } 3</code> se trocea perfectamente y no significa nada: eso lo dirá el analizador del tema siguiente.' },
    { e: 'Decidir que algo es una palabra del lenguaje antes de acabar de leerla', por: 'Hay que leer letras hasta que se acaben y <em>después</em> mirar la lista. Si no, una variable llamada <code>seamos</code> rompería el troceador.' },
    { e: 'Comerse el carácter que cierra una pieza', por: 'Es el primero de la pieza siguiente. Hay que mirarlo y dejarlo donde está.' },
    { e: 'Pensar que los espacios importan', por: 'Desaparecen al trocear, igual que los comentarios. Un programa apretado y otro con sangría dan exactamente la misma lista de piezas.' },
    { e: 'Coger el trozo corto pudiendo coger el largo', por: 'Ante <code>&lt;=</code>, un troceador que se conforme con el <code>&lt;</code> deja un <code>=</code> suelto y estropea el programa. La regla es siempre la pieza más larga posible.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántas piezas salen',
    level: 'basico',
    gen: function (r) {
      var casos = [
        'sea x = 3;', 'muestra x + 1;', 'sea y = x * 2;', 'x = x - 1;',
        'muestra 12;', 'sea a = (1 + 2) * 3;', 'muestra x >= 10;'
      ];
      var t = r.pick(casos);
      return { t: t, n: LEN.tokeniza(t).tokens.length - 1 };
    },
    ask: function (d) {
      return '¿En cuántas piezas trocea el analizador léxico esta línea?<pre class="shd__mini">' + d.t + '</pre>';
    },
    fields: [{ name: 'n', label: 'piezas', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    dec: 0,
    hint: function () { return 'Los espacios no cuentan. Un número entero es una sola pieza aunque tenga varias cifras, y cada símbolo suelto —incluido el punto y coma— es una.'; },
    steps: function (d) {
      var ts = LEN.tokeniza(d.t).tokens.filter(function (x) { return x.t !== 'fin'; });
      return ['Las piezas son: <code>' + ts.map(function (x) { return x.texto; }).join('</code> · <code>') + '</code>.',
        'Sus tipos: ' + ts.map(function (x) { return x.t; }).join(', ') + '.',
        'Son <strong>' + d.n + '</strong>.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'De qué tipo es cada una',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'sea', v: 'palabra' }, { t: 'mientras', v: 'palabra' }, { t: 'vuelve', v: 'palabra' },
        { t: 'x', v: 'nombre' }, { t: 'doble', v: 'nombre' }, { t: 'seamos', v: 'nombre' },
        { t: '42', v: 'num' }, { t: '0', v: 'num' },
        { t: '&lt;=', v: 'op', real: '<=' }, { t: ';', v: 'op' }, { t: '{', v: 'op' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'El troceador se encuentra <code>' + d.c.t + '</code>. ¿Qué clase de pieza es?'; },
    fields: [{ name: 'q', label: 'Es', opts: [
      { t: 'palabra del lenguaje', v: 'palabra' },
      { t: 'nombre', v: 'nombre' },
      { t: 'número', v: 'num' },
      { t: 'símbolo', v: 'op' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Las siete palabras de Pizca son <code>sea, si, sino, mientras, fun, vuelve, muestra</code>. Todo lo demás que empiece por letra es un nombre.'; },
    steps: function (d) {
      return [{
        palabra: '<code>' + d.c.t + '</code> está en la lista de las siete palabras del lenguaje.',
        nombre: '<code>' + d.c.t + '</code> empieza por letra y NO está en la lista de las siete, así que es un nombre corriente. Que empiece igual que una palabra del lenguaje no cambia nada: se lee entera antes de decidir.',
        num: '<code>' + d.c.t + '</code> son solo cifras: es un número.',
        op: '<code>' + d.c.t + '</code> no empieza por letra ni por cifra: es un símbolo.'
      }[d.c.v]];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Lo que desaparece al trocear',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { a: 'sea x=3;', b: 'sea   x  =  3 ;', v: 'igual', por: 'Los espacios son separadores: se tiran. Las dos líneas dan exactamente las mismas piezas.' },
        { a: 'muestra x;', b: 'muestra x; # nota', v: 'igual', por: 'Los comentarios desaparecen con los espacios. El resto del traductor no llega a saber que existían.' },
        { a: 'sea x = 12;', b: 'sea x = 1 2;', v: 'distinto', por: 'En el primero hay una pieza <code>12</code>; en el segundo, dos piezas <code>1</code> y <code>2</code>. El espacio parte el número, y el analizador del tema siguiente protestará.' },
        { a: 'muestra x >= 1;', b: 'muestra x > = 1;', v: 'distinto', por: 'El primero da una sola pieza <code>&gt;=</code>; el segundo, dos piezas sueltas. El troceador coge siempre el trozo más largo que puede, pero no puede saltarse un espacio.' },
        { a: 'sea x = 3;', b: 'sea\nx\n=\n3;', v: 'igual', por: 'Un salto de línea es un separador como cualquier otro. Las piezas son las mismas; lo único que cambia es el número de línea que llevan apuntado.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return '¿Salen las mismas piezas de estas dos líneas?<pre class="shd__mini">' +
        d.c.a.replace(/</g, '&lt;') + '\n' + d.c.b.replace(/</g, '&lt;') + '</pre>';
    },
    fields: [{ name: 'q', label: 'Las piezas son', opts: [
      { t: 'las mismas', v: 'igual' },
      { t: 'distintas', v: 'distinto' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Trocea las dos a mano y compara las listas. Acuérdate de qué cosas no llegan a ser pieza.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'igual' ? 'las mismas' : 'distintas'; }
  });

  p.exercise({
    title: 'El autómata, paso a paso',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'está leyendo un número y llega una letra', v: 'cierra', por: 'Un número se acaba en cuanto llega algo que no es cifra. Cierra la pieza y vuelve a parado <strong>sin consumir</strong> la letra, que será el principio de la siguiente.' },
        { t: 'está leyendo un nombre y llega una cifra', v: 'sigue', por: 'Un nombre admite cifras a partir del segundo carácter: <code>n12</code> es un solo nombre. El autómata se queda en el mismo estado y la añade.' },
        { t: 'está parado y llega un espacio', v: 'tira', por: 'Los separadores se tiran y el autómata se queda como estaba. Por eso la sangría no cambia nada.' },
        { t: 'está leyendo un número y llega otra cifra', v: 'sigue', por: 'Sigue en el mismo estado, añadiendo cifras, hasta que aparezca algo que no lo sea.' },
        { t: 'está parado y llega el carácter #', v: 'tira', por: 'Se tira todo hasta el final de la línea. Un comentario no llega a ser pieza.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'El troceador ' + d.c.t + '. ¿Qué hace?'; },
    fields: [{ name: 'q', label: 'Hace', opts: [
      { t: 'cerrar la pieza sin consumir el carácter', v: 'cierra' },
      { t: 'seguir en el mismo estado y añadirlo', v: 'sigue' },
      { t: 'tirarlo y quedarse como estaba', v: 'tira' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate dos cosas: ¿ese carácter puede formar parte de la pieza que está leyendo?, y si no, ¿es un separador o es el principio de otra pieza?'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return { cierra: 'cierra sin consumir', sigue: 'sigue y lo añade', tira: 'lo tira' }[d.c.v]; }
  });

  p.keys([
    'Un <strong>token</strong> es un trozo de texto con un nombre: número, nombre, palabra del lenguaje o símbolo.',
    'Trocear es lo primero que hace cualquier traductor, y a partir de ahí <strong>el texto original ya no se vuelve a mirar</strong>.',
    'Los espacios, los saltos de línea y los comentarios <strong>desaparecen</strong>: son separadores, no piezas.',
    'Por dentro es un <strong>autómata</strong>: un estado y una regla por estado, carácter a carácter.',
    'Hay que <strong>mirar sin comer</strong>: el carácter que cierra una pieza es el primero de la siguiente.',
    'Se coge siempre la pieza más larga posible, y solo se decide si algo es palabra del lenguaje <strong>después</strong> de haberlo leído entero.',
    'El troceador no entiende nada: <code>+ ; sea } 3</code> se trocea igual de bien y no significa nada.'
  ]);
});
