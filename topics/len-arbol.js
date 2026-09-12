/* Tema: Del texto al árbol: precedencia, asociatividad y descenso recursivo */
Course.topic('len-arbol', function (p) {

  p.puente('Hay [[len-tokens|piezas]] y hay [[len-gramatica|reglas]]. Falta el paso que las junta: coger ' +
    'la lista de piezas y averiguar <strong>qué forma tiene</strong> el programa. El resultado no es ' +
    'otra lista: es un <strong>árbol</strong>, y es el objeto central de todo el tramo.');

  p.note('Antes de empezar, algo que conviene saber. Desde la primera ficha de este curso, cuando ' +
    'escribes <code>120/7</code> o <code>sqrt(2)</code> en la casilla de un ejercicio, alguien tiene que ' +
    'leer ese texto y sacar un número. Ese alguien se llama <code>ML.evalExpr</code> y vive en ' +
    '<code>assets/js/core/mathlib.js</code>. Por dentro tiene un troceador y tres funciones llamadas ' +
    '<code>expr</code>, <code>term</code> y <code>unary</code>: <strong>exactamente lo que vas a ' +
    'construir en esta ficha</strong>. Lo que has estado usando doscientas veces sin mirar es esto.',
    'ok', 'Ya lo has usado, sin saberlo');

  /* ---------------------------------------------------------------- */
  p.section('El árbol de una expresión');

  p.text('Un árbol de expresión se lee así: cada nudo es una operación, y sus ramas son las cosas sobre ' +
    'las que opera. Las hojas son números y nombres. <code>2 + 3 * 4</code> tiene esta forma:');

  p.text('<pre class="shd__mini">+\n  2\n  *\n    3\n    4</pre>');

  p.text('y no ésta, que sería la de <code>(2 + 3) * 4</code>:');

  p.text('<pre class="shd__mini">*\n  +\n    2\n    3\n  4</pre>');

  p.text('Los dos tienen las mismas piezas, en el mismo orden. Lo que cambia es <strong>quién cuelga de ' +
    'quién</strong>, y eso lo decide todo: el primero vale 14 y el segundo 20.');

  p.note('Aquí hay una idea que compensa entender de una vez. En el árbol <strong>no hay ' +
    'paréntesis</strong>. Tampoco hace falta acordarse de que el producto ata más que la suma. Toda esa ' +
    'información, que en el texto estaba repartida entre símbolos y convenciones, se ha convertido en ' +
    '<em>forma</em>. Por eso el árbol es el objeto con el que trabaja el resto del traductor: en él ya ' +
    'no queda nada que interpretar.',
    'ok', 'El árbol no necesita paréntesis');

  p.demo({
    title: 'Del texto al árbol',
    intro: 'Escribe expresiones en el editor y mira el árbol que sale. Prueba «2 + 3 * 4» y «(2 + 3) * 4», y después mete paréntesis en sitios raros para ver cómo cambia la forma.',
    predice: '¿Qué crees que saldrá arriba del todo en el árbol de «2 * 3 + 4»: el + o el *?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'arb-uno', paneles: ['arbol', 'tokens'], avisa: 'poco',
        texto: 'muestra 2 + 3 * 4;',
        nota: 'La operación que queda <strong>arriba del todo</strong> es la que se hace <em>la última</em>, porque necesita que sus dos ramas estén resueltas. La que ata más fuerte acaba abajo.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Descenso recursivo: una función por regla');

  p.text('Y ahora lo bueno. Construir ese árbol a partir de las piezas parece difícil y no lo es, porque ' +
    'ya está hecho el trabajo duro: <strong>la gramática por capas es el programa</strong>. Se escribe ' +
    'una función por regla, y cada una llama a la de la capa de abajo:');

  p.text('<pre class="shd__mini">suma() {\n' +
    '  izquierda = producto();          // baja una capa\n' +
    '  mientras la pieza siguiente sea + o - {\n' +
    '    op = coger la pieza;\n' +
    '    derecha = producto();          // otra vez\n' +
    '    izquierda = nudo(op, izquierda, derecha);\n' +
    '  }\n' +
    '  vuelve izquierda;\n' +
    '}</pre>');

  p.text('Léelo despacio y compáralo con la regla: <code>suma → producto (("+"|"-") producto)*</code>. Es ' +
    'una transcripción línea a línea. La llamada a <code>producto()</code> es «baja a la capa de abajo», ' +
    'el <code>mientras</code> es el asterisco, y lo único que se añade es construir el nudo. A esto se ' +
    'le llama <strong>descenso recursivo</strong>, y es el método que usan casi todos los lenguajes que ' +
    'se escriben a mano.');

  p.note('Fíjate en el detalle del bucle: el nudo nuevo se construye poniendo <strong>lo acumulado a la ' +
    'izquierda</strong>. Con <code>10 - 3 - 2</code>, la primera vuelta hace <code>(10-3)</code> y la ' +
    'segunda cuelga ese nudo entero a la izquierda del segundo menos, dando <code>((10-3)-2) = 5</code>. ' +
    'Si el bucle se hubiera escrito al revés, saldría <code>10-(3-2) = 9</code>. Eso es la ' +
    '<strong>asociatividad</strong>, y no es una regla aparte que haya que recordar: es dónde se pone el ' +
    'resultado dentro del bucle.',
    'ok', 'La asociatividad, en una línea de código');

  p.demo({
    title: 'Asociatividad: dónde se cuelga lo acumulado',
    intro: 'Mira el árbol de «10 - 3 - 2»: el menos de arriba tiene otro menos en su rama izquierda, no en la derecha. Prueba también con divisiones, que es donde más se nota, y con sumas, donde da igual.',
    predice: 'Sin mirar: ¿cuánto vale «20 / 4 / 5», agrupando por la izquierda? ¿Y si se agrupara por la derecha?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'arb-asoc', paneles: ['arbol', 'maquina'],
        texto: 'muestra 10 - 3 - 2;\nmuestra 20 / 4 / 5;',
        nota: 'Con la suma y el producto la asociatividad no cambia el resultado, y por eso pasa desapercibida. Con la resta y la división sí, y entonces se nota que alguien tuvo que decidirlo.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Una sola pieza por delante');

  p.text('Queda una pregunta razonable: ¿cómo sabe cada función qué regla aplicar sin probar y ' +
    'arrepentirse? La respuesta es que la gramática está escrita para que <strong>la pieza siguiente ' +
    'baste</strong>. Si la primera pieza de una sentencia es <code>mientras</code>, solo hay una ' +
    'alternativa posible; si en <code>atomo</code> viene un número, es un número y no hay nada que ' +
    'decidir.');

  p.text('A esa propiedad se le llama ser <strong>predictiva</strong>, y no la tienen todas las ' +
    'gramáticas. Cuando no la tienen, hay que dar marcha atrás y probar otra cosa —y entonces el ' +
    'analizador se complica y se vuelve lento—, o usar métodos distintos. Los lenguajes que se diseñan ' +
    'con cabeza se escriben adrede para que una pieza por delante sea suficiente.');

  p.ejemplo({
    title: 'Montar el árbol de 2 + 3 * 4 a mano',
    enunciado: 'Aplicar el descenso recursivo pieza a pieza y decir qué árbol sale.',
    pasos: [
      { t: '<strong>Entra en suma.</strong> Lo primero que hace es llamar a <code>producto()</code>, que llama a <code>unario()</code> y éste a <code>atomo()</code>, que coge el <code>2</code>. Vuelve hacia arriba: <code>producto</code> mira la pieza siguiente, ve un <code>+</code> que no es suyo, y devuelve el 2 pelado.', antes: 'Toda expresión empieza bajando hasta el fondo, aunque sea un solo número.' },
      { t: '<strong>El bucle de suma.</strong> Ahora <code>suma</code> mira la pieza siguiente: es un <code>+</code>, que sí es suyo. Se lo queda y llama otra vez a <code>producto()</code> para la parte derecha.' },
      { t: '<strong>Y ahí está la gracia.</strong> Ese <code>producto()</code> coge el <code>3</code>, mira la pieza siguiente, ve un <code>*</code> —que <em>sí</em> es suyo—, se lo queda y coge el <code>4</code>. Devuelve el nudo <code>3 * 4</code> entero.', antes: '¿Por qué se lleva el producto el 3 y el 4, en vez de dejar el 3 para la suma?' },
      { t: '<strong>Se monta el nudo.</strong> <code>suma</code> tenía el 2 y ahora recibe el nudo <code>3*4</code>: construye <code>+(2, *(3,4))</code>. Mira la pieza siguiente, que es el punto y coma, y como no es suya, termina.' },
      { t: '<strong>El resultado.</strong> El producto ha quedado <em>debajo</em> de la suma sin que nadie comparase prioridades. Pasó porque la función del producto se ejecuta dentro de la de la suma, y se lleva todo lo que le pertenece antes de devolver el control.' }
    ],
    cierre: 'Ni una comparación de prioridades en todo el proceso. La jerarquía de operaciones está en el orden en que las funciones se llaman unas a otras, y eso es lo que hace que este método sea tan corto de escribir.'
  });

  p.comprueba('En el árbol de <code>2 + 3 * 4</code>, ¿por qué el <code>*</code> queda debajo del <code>+</code>?', [
    { t: 'Porque la función de la suma llama a la del producto, y ésta se lleva todo lo suyo antes de devolver', ok: true, por: 'El producto está en una capa más profunda de la gramática, así que su función se ejecuta dentro de la de la suma y termina antes. Lo que devuelve ya es un nudo completo, y la suma solo puede colgárselo.' },
    { t: 'Porque el analizador compara las prioridades de los dos operadores', ok: false, por: 'No compara nada: no hay ninguna tabla de prioridades en el código. La prioridad está en la forma de la gramática y en el orden de las llamadas.' },
    { t: 'Porque el * aparece después en el texto', ok: false, por: 'El orden en el texto no decide: en <code>2 * 3 + 4</code> el <code>*</code> aparece antes y sigue quedando debajo.' }
  ]);

  p.util('Esta técnica está por todas partes, y suele estar donde menos se espera. La barra de fórmulas ' +
    'de una hoja de cálculo hace esto con cada fórmula que escribes. Los buscadores lo hacen con las ' +
    'consultas que llevan comillas y paréntesis. Y en este curso, el corrector de ejercicios lo hace ' +
    'cada vez que respondes: por eso acepta <code>120/7</code>, <code>2(3+1)</code> o ' +
    '<code>sqrt(2)</code> y los compara con la solución como números. Puedes comprobarlo ahora mismo en ' +
    'cualquier ejercicio del curso.');

  p.hist('El primer analizador de expresiones con prioridades fue un problema de verdad, no un ejercicio. ' +
    'El equipo de FORTRAN, entre 1954 y 1957, tardó dos años y medio y usó un método que ' +
    '<strong>John Backus</strong> describió como poner paréntesis de más alrededor de cada operador, ' +
    'muchos, y luego quitarlos: funcionaba y nadie lo entendía bien. El descenso recursivo se fue ' +
    'destilando después, con ALGOL, cuando se vio que si la gramática se escribía en capas el ' +
    'analizador salía solo. Que un problema de dos años y medio se convierta en veinte líneas cuando se ' +
    'escribe bien la gramática es una de las mejores historias de la informática.');

  p.trampas([
    { e: 'Creer que hay una tabla de prioridades en algún sitio', por: 'No la hay. La prioridad está en qué función llama a cuál, y nada más.' },
    { e: 'Pensar que los paréntesis siguen en el árbol', por: 'Desaparecen, como los espacios. Su efecto se queda en la forma del árbol, que es para lo que servían.' },
    { e: 'Confundir el orden del texto con el orden de evaluación', por: 'En el árbol se evalúa de abajo arriba: primero las hojas, y la operación de arriba del todo es la última en hacerse.' },
    { e: 'Escribir el bucle colgando lo acumulado a la derecha', por: 'Sale asociatividad por la derecha, y entonces <code>10 - 3 - 2</code> vale 9 en vez de 5. Es un fallo que no se nota hasta que alguien usa una resta encadenada.' },
    { e: 'Dar marcha atrás cuando no hace falta', por: 'Si la gramática está bien escrita, con mirar una pieza por delante basta siempre. Un analizador que prueba y se arrepiente suele estar arreglando un problema que estaba en la gramática.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Quién manda arriba del todo',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: '2 + 3 * 4', v: '+' }, { t: '2 * 3 + 4', v: '+' },
        { t: '(2 + 3) * 4', v: '*' }, { t: '2 * (3 + 4)', v: '*' },
        { t: '1 + 2 - 3', v: '-' }, { t: '8 / 2 * 3', v: '*' },
        { t: '1 + 2 < 5', v: '<' }
      ];
      var c = r.pick(casos);
      return { c: c };
    },
    ask: function (d) {
      return '¿Qué operación queda <strong>arriba del todo</strong> en el árbol de ' +
        '<code>' + d.c.t.replace(/</g, '&lt;') + '</code>? (Es la última en hacerse.)';
    },
    fields: [{ name: 'q', label: 'Arriba va', opts: [
      { t: '+', v: '+' }, { t: '-', v: '-' }, { t: '*', v: '*' }, { t: '<', v: '<' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Arriba queda la operación que ata <strong>menos</strong>, porque es la que necesita a las otras ya resueltas. Los paréntesis pueden darle la vuelta a eso, y la comparación ata menos que todo lo demás.'; },
    steps: function (d) {
      var a = LEN.analiza('muestra ' + d.c.t + ';').ast.ss[0].e;
      return ['El árbol es:<pre class="shd__mini">' + LEN.arbolTexto(a).replace(/</g, '&lt;') + '</pre>',
        'Arriba del todo queda <code>' + d.c.v.replace(/</g, '&lt;') + '</code>, que es la última operación en hacerse.'];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Cuánto vale',
    level: 'basico',
    gen: function (r) {
      var a = r.int(2, 9), b = r.int(2, 6), c = r.int(2, 6);
      var forma = r.pick([
        { t: a + ' + ' + b + ' * ' + c, v: a + b * c },
        { t: '(' + a + ' + ' + b + ') * ' + c, v: (a + b) * c },
        { t: a + ' * ' + b + ' - ' + c, v: a * b - c },
        { t: a + ' - ' + b + ' - ' + c, v: a - b - c },
        { t: a + ' + ' + b + ' - ' + c, v: a + b - c }
      ]);
      return { t: forma.t, v: LEN.ocho(forma.v) };
    },
    ask: function (d) { return 'Según el árbol que monta el analizador, ¿cuánto vale <code>' + d.t + '</code>?'; },
    fields: [{ name: 'v', label: 'vale', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    tol: 0.5,
    hint: function () { return 'El producto ata más que la suma, y la resta se agrupa por la izquierda: <code>a - b - c</code> es <code>(a - b) - c</code>.'; },
    steps: function (d) {
      var a = LEN.analiza('muestra ' + d.t + ';').ast.ss[0].e;
      return ['El árbol:<pre class="shd__mini">' + LEN.arbolTexto(a) + '</pre>',
        'Se evalúa de abajo arriba: primero las hojas y por último la operación de arriba.',
        'Sale <strong>' + d.v + '</strong>.'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'Asociatividad',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: '10 - 3 - 2', izq: 5, der: 9 },
        { t: '20 / 4 / 5', izq: 1, der: 25 },
        { t: '12 - 5 - 4', izq: 3, der: 11 },
        { t: '24 / 6 / 2', izq: 2, der: 8 },
        { t: '9 - 4 - 1', izq: 4, der: 6 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'La expresión <code>' + d.c.t + '</code> vale una cosa si se agrupa por la izquierda y otra ' +
        'si se agrupa por la derecha. Escribe los dos valores.';
    },
    fields: [
      { name: 'i', label: 'agrupando por la izquierda', w: 'tiny' },
      { name: 'd', label: 'por la derecha', w: 'tiny' }
    ],
    sol: function (d) { return { i: d.c.izq, d: d.c.der }; },
    tol: 0.5,
    hint: function (d) { return 'Por la izquierda es poner el paréntesis en las dos primeras: <code>(' + d.c.t.split(' ').slice(0, 3).join(' ') + ') ...</code>. Por la derecha, en las dos últimas.'; },
    steps: function (d) {
      var ts = d.c.t.split(' ');
      return ['Por la izquierda: $(' + ts[0] + ' ' + ts[1] + ' ' + ts[2] + ') ' + ts[3] + ' ' + ts[4] + ' = ' + d.c.izq + '$.',
        'Por la derecha: $' + ts[0] + ' ' + ts[1] + ' (' + ts[2] + ' ' + ts[3] + ' ' + ts[4] + ') = ' + d.c.der + '$.',
        'El analizador agrupa por la <strong>izquierda</strong>, así que vale ' + d.c.izq + '. Y no lo decide ninguna regla escrita aparte: lo decide dónde se cuelga lo acumulado dentro del bucle.'];
    },
    answer: function (d) { return d.c.izq + ' y ' + d.c.der; }
  });

  p.exercise({
    title: 'Reconocer el árbol',
    level: 'avanzado',
    gen: function (r) {
      var opciones = ['2 + 3 * 4', '(2 + 3) * 4', '2 * 3 + 4', '2 * (3 + 4)'];
      return { t: r.pick(opciones), opciones: opciones };
    },
    ask: function (d) {
      var a = LEN.analiza('muestra ' + d.t + ';').ast.ss[0].e;
      return 'Éste es el árbol que ha montado el analizador:<pre class="shd__mini">' +
        LEN.arbolTexto(a) + '</pre>¿De cuál de estas expresiones es?';
    },
    fields: function (d) {
      return [{ name: 'q', label: 'Es el de', opts: d.opciones.map(function (x) { return { t: x, v: x }; }) }];
    },
    sol: function (d) { return { q: d.t }; },
    hint: function () { return 'Mira qué operación está arriba del todo —ésa es la última en hacerse— y de qué lado cuelga el nudo que no es una hoja.'; },
    steps: function (d) {
      var a = LEN.analiza('muestra ' + d.t + ';').ast.ss[0].e;
      return ['Arriba del todo está <code>' + a.op + '</code>, así que es la última operación en hacerse.',
        'El nudo que no es hoja cuelga ' + (a.i.t === 'bin' ? 'a la <strong>izquierda</strong>' : 'a la <strong>derecha</strong>') + ', o sea que esa parte se resuelve antes.',
        'La expresión es <code>' + d.t + '</code>, y vale ' + LEN.corre('muestra ' + d.t + ';').salida[0] + '.'];
    },
    answer: function (d) { return d.t; }
  });

  p.keys([
    'El analizador convierte la lista de piezas en un <strong>árbol</strong>: los nudos son operaciones y las hojas, números y nombres.',
    'En el árbol <strong>no hay paréntesis ni prioridades</strong>: toda esa información se ha convertido en forma.',
    'El <strong>descenso recursivo</strong> escribe una función por regla de la gramática, y cada una llama a la de la capa de abajo. Es casi una transcripción.',
    'La <strong>prioridad</strong> sale del orden en que las funciones se llaman; la <strong>asociatividad</strong>, de dónde se cuelga lo acumulado dentro del bucle.',
    'Con mirar <strong>una pieza por delante</strong> basta, si la gramática está escrita para eso. A esa propiedad se le llama ser predictiva.',
    'La operación que queda arriba del todo es la <strong>última</strong> en hacerse, porque necesita sus dos ramas ya resueltas.',
    'El corrector de ejercicios de este curso, <code>ML.evalExpr</code>, es exactamente esto: por eso acepta <code>120/7</code> o <code>2(3+1)</code>.'
  ]);
});
