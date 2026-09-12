/* Tema: Gramáticas: reglas que generan frases */
Course.topic('len-gramatica', function (p) {

  p.puente('Con [[len-tokens|el troceador]] ya hay una lista de piezas, pero una lista no es un programa. ' +
    '<code>sea x = 3;</code> y <code>= x 3 sea;</code> tienen exactamente las mismas piezas y solo una de ' +
    'las dos significa algo. Falta decir <strong>en qué orden pueden ir</strong>, y eso es una gramática.');

  p.text('Una <strong>gramática</strong> es un puñado de reglas que dicen cómo se construye una frase ' +
    'válida a partir de trozos más pequeños. Se escriben con una flecha: a la izquierda el nombre de lo ' +
    'que se está definiendo, y a la derecha de qué se compone.');

  p.text('<pre class="shd__mini">sentencia  →  "sea" nombre "=" expresion ";"\n' +
    'sentencia  →  "muestra" expresion ";"\n' +
    'sentencia  →  "mientras" expresion bloque\n' +
    'bloque     →  "{" sentencia* "}"</pre>');

  p.text('Lo que va entre comillas es una pieza que aparece tal cual; lo que va suelto es otra regla, que ' +
    'habrá que mirar a su vez. El asterisco quiere decir «cero o más veces». Con cuatro líneas ya está ' +
    'dicho qué forma tiene un <code>mientras</code> y qué forma no tiene.');

  /* ---------------------------------------------------------------- */
  p.section('Pocas reglas, infinitos programas');

  p.text('El truco que hace que esto valga la pena es que <strong>una regla puede nombrarse a sí ' +
    'misma</strong>. Mira la de los bloques: dentro de un bloque van sentencias, y una sentencia puede ' +
    'ser un <code>mientras</code>, que lleva un bloque dentro, que lleva sentencias… Con cuatro reglas ' +
    'quedan definidos programas de cualquier tamaño y de cualquier profundidad.');

  p.note('Eso de definir algo nombrándolo dentro de su propia definición ya lo has visto, y con el mismo ' +
    'nombre: es una <strong>definición recursiva</strong>, como las de ' +
    '[[lg-demostracion|la inducción]]. Y el parecido llega hasta el final: para demostrar que <em>todos ' +
    'los programas</em> cumplen algo —que todos acaban, que todos se traducen bien— se hace igual que ' +
    'con los naturales, comprobándolo en los casos base y suponiéndolo cierto en las partes al ' +
    'demostrarlo para el todo. Se llama <strong>inducción estructural</strong>, y es literalmente la ' +
    'inducción de siempre con los programas ordenados por tamaño en vez de los números.',
    'ok', 'Recursión: lo mismo que la inducción');

  p.demo({
    title: 'La gramática, generando',
    intro: 'Aquí hay una gramática mínima de expresiones: un número, o dos expresiones con una operación en medio, o una expresión entre paréntesis. Pulsa y sale una frase nueva, construida aplicando reglas al azar. Ninguna se ha escrito a mano.',
    predice: 'Con solo tres reglas, ¿cuántas expresiones distintas crees que se pueden generar: unas pocas decenas, unos miles, o infinitas?',
    build: function (host) {
      var r = U.rng(20260912);
      var out = W.readout(host, '');

      function frase(prof) {
        if (prof <= 0 || r.int(0, 3) === 0) return String(r.int(0, 9));
        var op = r.pick(['+', '-', '*']);
        var izq = frase(prof - 1), der = frase(prof - 1);
        var cruda = izq + ' ' + op + ' ' + der;
        return r.bool(0.35) ? '(' + cruda + ')' : cruda;
      }

      function pinta() {
        var f = frase(3);
        var a = LEN.analiza('muestra ' + f + ';');
        var v = LEN.corre('muestra ' + f + ';');
        out.set('<span style="font-family:var(--mono)">' + f + '</span><br>' +
          (a.errores.length
            ? '<span style="color:var(--bad)">el analizador NO la entiende: ' + a.errores[0].msg + '</span>'
            : 'El analizador la entiende, y vale <strong>' + v.salida[0] + '</strong>.'));
      }

      W.buttons(host, [{ t: '↻ Otra frase', on: pinta }]);
      W.hint(host, 'Lo interesante no es cada frase suelta: es que todas salen de tres reglas, y que el analizador entiende todas las que la gramática genera, sin excepción.');
      pinta();
    }
  });

  p.text('Ese último detalle no es casualidad ni suerte: <strong>el analizador está construido a partir ' +
    'de la gramática</strong>, regla por regla. En [[len-arbol|el tema siguiente]] se verá cómo, y ' +
    'resulta ser casi una transcripción.');

  /* ---------------------------------------------------------------- */
  p.section('La gramática de Pizca, entera');

  p.text('Cabe en media pantalla, y a estas alturas se puede leer sin explicación:');

  p.text('<pre class="shd__mini">programa    →  sentencia*\n\n' +
    'sentencia   →  "sea" nombre "=" expresion ";"\n' +
    '            |  nombre "=" expresion ";"\n' +
    '            |  "muestra" expresion ";"\n' +
    '            |  "vuelve" expresion ";"\n' +
    '            |  "si" expresion bloque ("sino" bloque)?\n' +
    '            |  "mientras" expresion bloque\n' +
    '            |  "fun" nombre "(" nombres? ")" bloque\n' +
    '            |  llamada ";"\n\n' +
    'bloque      →  "{" sentencia* "}"\n\n' +
    'expresion   →  comparacion\n' +
    'comparacion →  suma ( ("&lt;"|"&gt;"|"&lt;="|"&gt;="|"=="|"!=") suma )*\n' +
    'suma        →  producto ( ("+"|"-") producto )*\n' +
    'producto    →  unario ( ("*"|"/") unario )*\n' +
    'unario      →  "-" unario  |  atomo\n' +
    'atomo       →  numero  |  nombre  |  llamada  |  "(" expresion ")"\n' +
    'llamada     →  nombre "(" ( expresion ("," expresion)* )? ")"</pre>');

  p.text('La barra vertical quiere decir «o»; la interrogación, «esto puede estar o no estar». Diecisiete ' +
    'líneas, y con ellas queda decidido si cualquier texto del mundo es o no es un programa de Pizca.');

  /* ---------------------------------------------------------------- */
  p.section('Por qué las expresiones van en capas');

  p.text('Hay una cosa rara en esa gramática que merece explicación. Las expresiones podrían haberse ' +
    'escrito de la forma obvia, que es más corta:');

  p.text('<pre class="shd__mini">expresion  →  numero\n           |  expresion operador expresion\n           |  "(" expresion ")"</pre>');

  p.text('Y esa gramática genera exactamente las mismas frases. El problema es otro, y es grave: hay ' +
    'frases que se pueden construir <strong>de dos maneras distintas</strong>. Con ' +
    '<code>2 + 3 * 4</code>, una derivación agrupa primero el <code>+</code> y otra agrupa primero el ' +
    '<code>*</code>. La gramática no dice cuál, así que un traductor podría dar 20 y otro 14, y los dos ' +
    'estarían siguiendo las reglas.');

  p.note('A una gramática con ese defecto se le llama <strong>ambigua</strong>, y no sirve para definir ' +
    'un lenguaje de programación: un programa tiene que significar una sola cosa. La solución es la que ' +
    'está arriba: <strong>partir la regla en capas</strong>, una por nivel de prioridad. Como ' +
    '<em>suma</em> solo puede estar hecha de <em>productos</em> y no al revés, el producto queda ' +
    'obligatoriamente por debajo, y la jerarquía de operaciones deja de ser una regla aparte que hay ' +
    'que recordar: <strong>está dentro de la forma de la gramática</strong>.',
    'ok', 'La prioridad, escrita en las reglas');

  p.ejemplo({
    title: 'Derivar una frase desde las reglas',
    enunciado: 'Partiendo de <code>sentencia</code>, aplicar reglas de la gramática de Pizca hasta llegar a <code>muestra 2 + 3;</code>, anotando qué regla se usa en cada paso.',
    pasos: [
      { t: '<strong>Elegir la regla de sentencia.</strong> De las ocho alternativas, la que empieza por <code>"muestra"</code>. Queda: <code>"muestra" expresion ";"</code>.', antes: 'La primera pieza suele bastar para saber qué regla toca. Eso no es casualidad, y tiene consecuencias en el tema siguiente.' },
      { t: '<strong>Bajar por las capas.</strong> <code>expresion</code> es <code>comparacion</code>, que es <code>suma</code> seguida de cero comparaciones; aquí no hay ninguna, así que se queda en <code>suma</code>.' },
      { t: '<strong>La suma de verdad.</strong> <code>suma → producto ("+" producto)*</code>, y esta vez el asterisco se usa una vez: <code>producto "+" producto</code>.' },
      { t: '<strong>Y hasta el fondo.</strong> Cada <code>producto</code> es un <code>unario</code> sin nada detrás, que es un <code>atomo</code>, que es un <code>numero</code>. Quedan el 2 y el 3.' },
      { t: '<strong>Lo obtenido.</strong> <code>"muestra" 2 "+" 3 ";"</code>, que es exactamente la frase pedida. Cinco pasos, y en ninguno hubo elección posible una vez vistas las piezas.' }
    ],
    cierre: 'Fíjate en el camino: se ha bajado por cuatro capas de expresión para acabar en un número. Eso parece burocracia, y es justo lo que codifica que el producto ate más fuerte que la suma.'
  });

  p.comprueba('¿Qué problema tiene una gramática ambigua para un lenguaje de programación?', [
    { t: 'Que la misma frase se puede construir de dos maneras, y entonces no está decidido qué significa', ok: true, por: 'Con <code>2 + 3 * 4</code>, una derivación da 20 y otra 14, y las dos siguen las reglas. Un programa tiene que significar una sola cosa, así que la gramática tiene que dejar una sola forma de construir cada frase.' },
    { t: 'Que acepta frases que no deberían valer', ok: false, por: 'No: la gramática ambigua de la que se habla aquí genera exactamente las mismas frases que la buena. El problema no es qué acepta, sino de cuántas maneras.' },
    { t: 'Que el analizador tarda más en leerla', ok: false, por: 'La velocidad no tiene nada que ver. El problema es de significado, no de tiempo.' }
  ]);

  p.util('Las gramáticas están en muchos más sitios que los lenguajes de programación. Cada vez que un ' +
    'programa lee un archivo con estructura —una página web, un archivo de configuración, un mensaje ' +
    'entre dos servidores, un archivo de música— hay una gramática detrás, escrita o no. Y cuando no ' +
    'está escrita, aparecen los problemas: buena parte de la incompatibilidad entre navegadores de los ' +
    'años noventa venía de que nadie había escrito la gramática del HTML mal formado, así que cada uno ' +
    'adivinaba distinto. La lección se aprendió: los formatos nuevos se publican con su gramática.');

  p.hist('La idea la trajo <strong>Noam Chomsky</strong> en 1956, y no pensaba en ordenadores sino en ' +
    'lenguas humanas: buscaba explicar cómo un niño produce frases que nunca ha oído. Clasificó las ' +
    'gramáticas en cuatro niveles por su potencia, y el segundo de ellos —las <em>independientes del ' +
    'contexto</em>— resultó ser exactamente lo que hacía falta para los lenguajes de programación. En ' +
    '1959 <strong>John Backus</strong> y <strong>Peter Naur</strong> usaron una notación de ese estilo ' +
    'para definir ALGOL 60, y desde entonces se llama <em>forma de Backus-Naur</em>. Es de las pocas ' +
    'veces en que una teoría lingüística encontró su aplicación en otro campo y se quedó.');

  p.trampas([
    { e: 'Confundir la gramática con el significado', por: 'La gramática solo dice qué frases están bien formadas. <code>muestra x;</code> es gramaticalmente perfecta aunque <code>x</code> no exista: eso lo dirá quien la ejecute.' },
    { e: 'Escribir la regla de las expresiones de una sola capa', por: 'Sale ambigua, y entonces <code>2 + 3 * 4</code> puede valer 14 o 20 según por dónde se derive. Las capas son lo que decide la prioridad.' },
    { e: 'Creer que una gramática pequeña genera pocas frases', por: 'Basta con que una regla se nombre a sí misma para que genere infinitas. Tres reglas dan todas las expresiones aritméticas que existen.' },
    { e: 'Pensar que las reglas se aplican de izquierda a derecha por el texto', por: 'Se aplican de arriba abajo por la <em>estructura</em>. Derivar es ir sustituyendo nombres de reglas por sus contenidos, no recorrer el texto.' },
    { e: 'Olvidar que el asterisco puede ser cero veces', por: 'Un bloque vacío <code>{}</code> es válido, y una suma «de cero sumas» es sencillamente un producto. Muchos fallos de analizador salen de no contemplar el caso vacío.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Esto, ¿lo genera la gramática?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'sea x = 3;', v: 'si' },
        { t: 'muestra x + 1;', v: 'si' },
        { t: 'mientras x { muestra x; }', v: 'si' },
        { t: 'si x { } sino { }', v: 'si' },
        { t: 'sea x = 3', v: 'no' },
        { t: 'sea 3 = x;', v: 'no' },
        { t: 'muestra;', v: 'no' },
        { t: 'mientras x muestra x;', v: 'no' },
        { t: 'sea x = ;', v: 'no' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return '¿Es esto un programa de Pizca según la gramática?<pre class="shd__mini">' +
        d.c.t.replace(/</g, '&lt;') + '</pre>';
    },
    fields: [{ name: 'q', label: 'Lo genera', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Repasa la regla de <code>sentencia</code>: qué palabra la empieza, qué va detrás y si termina en punto y coma o en bloque.'; },
    steps: function (d) {
      var a = LEN.analiza(d.c.t);
      return [d.c.v === 'si'
        ? 'Sí: encaja con una de las alternativas de <code>sentencia</code>, entera y sin sobrar nada.'
        : 'No: el analizador protesta con «' + (a.errores[0] ? a.errores[0].msg : 'algo no encaja') + '».',
      d.c.v === 'si'
        ? 'Compruébalo escribiéndolo en cualquiera de los talleres del bloque: no dará error.'
        : 'Una frase sobra o falta justo donde la regla exigía otra cosa.'];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Qué regla toca',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'sea', v: 'sea', por: 'La alternativa que empieza por <code>"sea"</code>: declara una variable nueva.' },
        { t: 'muestra', v: 'muestra', por: 'La alternativa de <code>"muestra"</code>, que lleva una expresión y un punto y coma.' },
        { t: 'mientras', v: 'mientras', por: 'La del bucle: <code>"mientras" expresion bloque</code>. No lleva punto y coma, porque termina en llave.' },
        { t: 'fun', v: 'fun', por: 'La de la definición de función, que lleva el nombre, los paréntesis con los parámetros y un bloque.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'El analizador está empezando una sentencia y la primera pieza que ve es <code>' + d.c.t +
        '</code>. ¿Cuál de las alternativas de la regla <code>sentencia</code> tiene que usar?';
    },
    fields: [{ name: 'q', label: 'La de', opts: [
      { t: 'declarar con sea', v: 'sea' }, { t: 'mostrar', v: 'muestra' },
      { t: 'el bucle mientras', v: 'mientras' }, { t: 'definir una función', v: 'fun' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'En Pizca, la primera pieza de una sentencia basta para saber qué alternativa toca. No hay dos que empiecen igual.'; },
    steps: function (d) {
      return [d.c.por,
        'Que la primera pieza baste para decidir no es casualidad: la gramática está escrita así a propósito, y es lo que permite escribir el analizador del tema siguiente sin dar marcha atrás nunca.'];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Cuántas capas hay que bajar',
    level: 'medio',
    gen: function (r) {
      /* De `expresion` a un numero pelado hay cinco reglas; cada operacion
         que aparezca obliga a parar en su capa. */
      var casos = [
        { t: '7', n: 5, por: 'expresion → comparacion → suma → producto → unario → atomo, y ahí está el número. Cinco pasos para nada, que es el precio de tener la prioridad escrita en las reglas.' },
        { t: '7 * 2', n: 3, por: 'Se baja hasta <code>producto</code>, que es donde vive el <code>*</code>: expresion → comparacion → suma → producto. Tres pasos.' },
        { t: '7 + 2', n: 2, por: 'El <code>+</code> vive en <code>suma</code>: expresion → comparacion → suma. Dos pasos.' },
        { t: '7 < 2', n: 1, por: 'La comparación es la capa de arriba del todo: expresion → comparacion. Un solo paso.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Partiendo de <code>expresion</code>, ¿cuántas reglas hay que aplicar para llegar a la capa ' +
        'donde vive la operación de <code>' + d.c.t + '</code>? (Si no hay operación, cuenta hasta ' +
        '<code>atomo</code>.)';
    },
    fields: [{ name: 'n', label: 'reglas', w: 'tiny' }],
    sol: function (d) { return { n: d.c.n }; },
    dec: 0,
    hint: function () { return 'El orden de las capas, de fuera adentro: expresion, comparacion, suma, producto, unario, atomo.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return String(d.c.n); }
  });

  p.exercise({
    title: 'Ambigua o no',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '<code>E → numero | E "+" E</code>', v: 'ambigua', por: 'Con <code>1 + 2 + 3</code> hay dos derivaciones: la que agrupa <code>(1+2)+3</code> y la que agrupa <code>1+(2+3)</code>. Aquí da igual el resultado porque la suma es asociativa, pero con la resta no daría igual: <code>(5-3)-1</code> vale 1 y <code>5-(3-1)</code> vale 3.' },
        { t: '<code>E → T | E "+" T</code> &nbsp;·&nbsp; <code>T → numero</code>', v: 'no', por: 'El lado derecho del <code>+</code> tiene que ser un <code>T</code>, o sea un número pelado, así que la única forma de construir <code>1 + 2 + 3</code> es agrupando por la izquierda. Una sola derivación: no es ambigua. Y de paso queda decidida la asociatividad.' },
        { t: '<code>S → "si" E S | "si" E S "sino" S | otra</code>', v: 'ambigua', por: 'Es el famoso «<em>sino</em> colgante»: con dos «si» seguidos y un solo «sino», no está dicho a cuál de los dos pertenece. Pizca lo esquiva obligando a poner llaves siempre, que es por lo que su gramática no tiene este problema.' },
        { t: '<code>B → "{" S* "}"</code> &nbsp;·&nbsp; <code>S → "muestra" numero ";"</code>', v: 'no', por: 'Las llaves marcan dónde empieza y acaba cada cosa, y cada sentencia termina en punto y coma. No hay ningún sitio donde quepan dos interpretaciones.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Es ambigua esta gramática?<br>' + d.c.t; },
    fields: [{ name: 'q', label: 'Es', opts: [
      { t: 'ambigua: alguna frase se construye de dos maneras', v: 'ambigua' },
      { t: 'no ambigua: cada frase, una sola forma', v: 'no' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Busca una frase corta y pregúntate si se puede agrupar de dos maneras. Los sospechosos habituales son las reglas que se nombran a sí mismas <strong>por los dos lados</strong>.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'ambigua' ? 'ambigua' : 'no ambigua'; }
  });

  p.keys([
    'Una <strong>gramática</strong> es un puñado de reglas que dicen cómo se construye una frase válida a partir de piezas.',
    'Una regla puede <strong>nombrarse a sí misma</strong>, y por eso unas pocas reglas generan infinitos programas.',
    'Es una definición recursiva, así que demostrar algo sobre todos los programas es <strong>inducción estructural</strong>: la misma inducción de siempre.',
    'Una gramática es <strong>ambigua</strong> si alguna frase se puede construir de dos maneras. Para un lenguaje de programación eso no vale: un programa significa una sola cosa.',
    'Las expresiones se escriben <strong>en capas</strong>, una por nivel de prioridad, y así la jerarquía de operaciones queda dentro de la forma de la gramática.',
    'La gramática dice qué está bien formado, <strong>no qué significa</strong>: <code>muestra x;</code> es válida aunque <code>x</code> no exista.',
    'La notación es de Backus y Naur, 1959, sobre la clasificación de gramáticas que Chomsky hizo en 1956 pensando en lenguas humanas.'
  ]);
});
