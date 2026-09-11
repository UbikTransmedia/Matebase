/* Tema: El píxel que se pregunta de qué color es */
Course.topic('gfx-pixel', function (p) {

  p.puente('Este bloque no demuestra: dibuja. Cada tema toma una herramienta del curso, la ' +
    '[[fn-concepto|función]], el [[ge-vectores|vector]], el seno, la matriz, el gradiente, y la pone a ' +
    'pintar píxeles. Para empezar basta con saber dividir y con leer una función como «a cada entrada, ' +
    'una salida».', 'Por dónde empezamos');

  p.text('Bienvenido al último bloque, que es distinto de todos los anteriores y por eso tiene otro ' +
    'color. Aquí ya no vamos a demostrar nada. Vamos a coger las matemáticas de todos los bloques anteriores —la distancia, el seno, las matrices, el gradiente, los complejos— y a ponerlas a ' +
    'dibujar. A sesenta imágenes por segundo, en tu pantalla, con un código que puedes tocar mientras ' +
    'se ejecuta.');

  p.text('La promesa del bloque cabe en una frase: <strong>reglas de tres líneas producen imágenes ' +
    'que no caben en la cabeza</strong>. No es una manera de hablar. Vas a escribir una raíz cuadrada ' +
    'y va a aparecer un círculo perfecto; vas a añadir un $\\operatorname{sen}$ y se va a poner a ' +
    'latir; vas a repetir una resta y va a salir un fractal infinito. Ese asombro —que unas pocas ' +
    'operaciones basten para tanto— es de lo que va esto.');

  p.section('Lo primero es desaprender a dibujar');

  p.text('Cuando piensas en «programar un dibujo» te imaginas algo así: pon el lápiz aquí, traza una ' +
    'línea hasta allá, rellena de rojo. Un procedimiento, con sus pasos, en orden. Así funciona el ' +
    'papel, y así funcionan casi todas las herramientas de dibujo.');

  p.text('Un shader <strong>no funciona así en absoluto</strong>, y hasta que eso no se asienta, nada ' +
    'de lo demás tiene sentido.');

  p.note('Un shader es una <strong>función</strong>. Recibe la posición de un píxel y devuelve el ' +
    'color de ese píxel. Eso es todo lo que hace. No sabe qué hay al lado, no recuerda lo que ha ' +
    'contestado antes, no puede dejar nada escrito para otro. Se ejecuta millones de veces, una por ' +
    'píxel, y todas esas ejecuciones ocurren <strong>a la vez</strong>.', 'ok', 'La idea del bloque entero');

  p.text('Fíjate en lo que eso implica. <strong>Nadie dibuja un círculo.</strong> Lo que ocurre es ' +
    'que dos millones de píxeles se preguntan, cada uno por su cuenta y sin hablar entre ellos, ' +
    '«¿estoy yo dentro del círculo?». Los que contestan que sí se pintan de rojo. Visto desde fuera, ' +
    'aparece un círculo. Pero no hay ningún círculo en el código: hay una <em>pregunta</em> que cada ' +
    'píxel responde solo.');

  p.text('Esto es exactamente el concepto de <strong>función</strong> de [[fn-concepto|análisis]], ' +
    'y el de <strong>campo</strong> del [[av-vectorial|cálculo vectorial]]: a cada punto del plano le corresponde un valor. Lo ' +
    'único nuevo es que el valor es un color y que el resultado se ve.');

  p.util('Que sean independientes es lo que hace posible la velocidad. Tu tarjeta gráfica tiene ' +
    'miles de procesadores diminutos, mucho más torpes que el de tu ordenador, pero que trabajan ' +
    'todos a la vez. Como ningún píxel necesita saber nada de los demás, se pueden repartir sin ' +
    'coordinarse. Ese es el truco entero de la computación gráfica moderna, y de rebote el de la ' +
    'inteligencia artificial: son las mismas tarjetas, haciendo lo mismo —muchas operaciones ' +
    'pequeñas e independientes a la vez— sobre números que en vez de colores son pesos de una red.');

  p.comprueba('Quieres que cada píxel sea un poco más claro que el de su izquierda. ¿Puede un shader hacerlo mirando el color del vecino?', [
    { t: 'No: cada píxel calcula su color solo, sin leer a los demás', ok: true, por: 'Todos se calculan a la vez, así que el de la izquierda todavía no tiene color cuando se pregunta el de la derecha. Lo que sí puede hacer es calcular su claridad a partir de su propia coordenada: <code>uv.x</code> ya crece hacia la derecha.' },
    { t: 'Sí: se lee el color del píxel de la izquierda y se le suma algo', ok: false, por: 'No hay manera de leerlo: la función solo recibe su coordenada y devuelve un color. El degradado sale, pero de la coordenada, no del vecino.' },
    { t: 'Sí, pero solo si se ejecuta de izquierda a derecha', ok: false, por: 'No hay orden: se ejecutan millones a la vez. Esa independencia es lo que hace posible la velocidad.' }
  ]);

  p.section('Las coordenadas: dónde estoy');

  p.text('La función recibe la posición del píxel en <code>fragCoord</code>, medida en píxeles desde ' +
    'la esquina inferior izquierda. En una pantalla de 800 × 400, va de $(0{,}5,\\ 0{,}5)$ a ' +
    '$(799{,}5,\\ 399{,}5)$. Ese número depende del tamaño de la ventana, así que casi nunca se usa ' +
    'tal cual: lo primero que hace cualquier shader es <strong>normalizarlo</strong>.');

  p.formula('\\mathbf{uv} = \\frac{\\text{fragCoord}}{\\text{iResolution}}', 'normalizar la coordenada',
    'Se dice: <em>«u-ve es igual a fragCoord partido por iResolution»</em>.<br><br>' +
      '<code>iResolution</code> es el tamaño de la ventana en píxeles. Al dividir uno por otro, el ' +
      'resultado va de 0 a 1 <strong>sea cual sea el tamaño de la pantalla</strong>: el 0 es el borde ' +
      'izquierdo y el 1 el derecho, siempre.<br><br>El nombre <code>uv</code> es una convención ' +
      'antiquísima de gráficos por ordenador para las coordenadas de una superficie; se usan las ' +
      'letras <em>u</em> y <em>v</em> porque <em>x</em>, <em>y</em> y <em>z</em> ya estaban ' +
      'ocupadas por el espacio.');

  p.text('Y el color se devuelve como cuatro números entre 0 y 1: rojo, verde, azul y transparencia. ' +
    'No de 0 a 255 como en el HTML, sino de 0 a 1, porque una tarjeta gráfica trabaja con decimales.');

  p.demo({
    title: 'Tu primer shader',
    intro: 'Tres líneas. La primera divide para saber dónde estás; la segunda pinta. Cambia lo que quieras y se recompila solo mientras escribes: es exactamente así como se trabaja en directo.',
    predice: 'Antes de tocar el código: si cambias <code>uv.x</code> por <code>1.0 - uv.x</code> en el rojo, ¿en qué esquina quedará el amarillo?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-pixel-1', alto: 260,
        aria: 'Un degradado: rojo creciendo hacia la derecha, verde creciendo hacia arriba, y azul constante en la mitad.',
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    // dónde estoy, de 0 a 1\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '\n' +
          '    // de qué color soy: rojo, verde, azul\n' +
          '    color = vec4(uv.x, uv.y, 0.5, 1.0);\n' +
          '}\n',
        nota: 'Prueba a poner <code>uv.y</code> en el rojo y <code>uv.x</code> en el verde, y mira ' +
          'cómo gira el degradado. O escribe <code>1.0 - uv.x</code> y verás por qué el rojo se da la ' +
          'vuelta. No hay nada que romper: si algo no compila, te lo dice y sigues.'
      });
    }
  });

  p.text('Mira el degradado con atención, porque explica el modelo entero. En la esquina de abajo a ' +
    'la izquierda, $uv = (0,0)$: sin rojo y sin verde, así que sale el azul solo. En la de abajo a la ' +
    'derecha, $uv = (1,0)$: todo rojo. Arriba a la izquierda, todo verde. Y arriba a la derecha, ' +
    'rojo y verde a tope, que sumados dan amarillo. <strong>Cada píxel ha calculado su color sin ' +
    'saber que existían los demás</strong>, y sin embargo el conjunto es un degradado continuo.');

  p.section('La estructura, línea a línea');

  p.text('El código de arriba tiene una forma fija que vas a escribir cientos de veces. Merece la ' +
    'pena desmontarla ahora:');

  p.table(['Trozo', 'Qué es'], [
    ['<code>void mainImage(...)</code>', 'La función. Se llama una vez por píxel; tú no la llamas nunca.'],
    ['<code>out vec4 color</code>', 'La salida. <code>out</code> significa «esto es lo que devuelvo». Cuatro números: R, G, B y transparencia.'],
    ['<code>in vec2 fragCoord</code>', 'La entrada. Dos números: en qué píxel estoy.'],
    ['<code>vec2</code>, <code>vec4</code>', 'Vectores de 2 y de 4 componentes. Los de [[ge-vectores|geometría]], con otro nombre.'],
    ['<code>uv.x</code>, <code>uv.y</code>', 'Sacar una componente. También valen <code>uv.r</code> y <code>uv.g</code>: es el mismo número.'],
    ['<code>iResolution</code>', 'El tamaño de la ventana. Lo pone el sistema, no tú.']
  ]);

  p.note('Un <code>vec4</code> no es una lista: es un <strong>vector</strong> de los que ya conoces, ' +
    'y se comporta como tal. Puedes sumarlos, multiplicarlos por un número o calcular su longitud, y ' +
    'la operación se aplica componente a componente. <code>vec3(0.5) * 2.0</code> vale ' +
    '<code>vec3(1.0)</code>. Esta es una de las razones de que el código de un shader sea tan corto: ' +
    'una línea opera sobre tres o cuatro números a la vez.', null, 'Los vectores, trabajando');

  p.ejemplo({
    title: 'Un píxel, de principio a fin',
    enunciado: 'Ventana de 800 × 400. Seguir el píxel $\\text{fragCoord} = (600, 100)$ por el primer shader, $\\text{color} = (uv.x,\\ uv.y,\\ 0{,}5,\\ 1)$, y por el tablero de 8 casillas.',
    pasos: [
      { t: '<strong>Normalizar.</strong> $uv = (600/800,\\ 100/400) = (0{,}75,\\ 0{,}25)$. Está a tres cuartos del ancho y a un cuarto del alto.', antes: 'Divide cada componente por el tamaño correspondiente.' },
      { t: '<strong>El color.</strong> Rojo 0,75, verde 0,25, azul 0,5: un rosa anaranjado. Ningún otro píxel ha intervenido; solo su coordenada.' },
      { t: '<strong>La casilla.</strong> $\\lfloor uv \\cdot 8 \\rfloor = \\lfloor (6,\\ 2) \\rfloor = (6,\\ 2)$: séptima columna, tercera fila, contando desde cero.', antes: 'Multiplica $uv$ por 8 y quédate con la parte entera.' },
      { t: '<strong>El tono.</strong> $6 + 2 = 8$, y $\\operatorname{mod}(8, 2) = 0$: negro. La casilla de al lado, la $(7, 2)$, suma 9 y sale blanca.', antes: 'Suma fila y columna. ¿Par o impar?' },
      { t: '<strong>El mismo píxel en otra ventana.</strong> En 1600 × 800, el píxel $(1200, 200)$ da el mismo $uv$ y el mismo color: por eso se normaliza.' }
    ],
    cierre: 'Cuatro operaciones, ninguna difícil. Lo que hay que asimilar es que el píxel las hace solo, y que dos millones de píxeles haciéndolas a la vez producen un tablero.'
  });

  p.demo({
    title: 'El píxel no sabe nada de sus vecinos',
    intro: 'Aquí se ve la independencia con los ojos. El shader decide el color solo con su propia coordenada; sube el número de casillas y aparecerá un tablero que nadie ha dibujado.',
    predice: 'Con 8 casillas, ¿de qué color será la de abajo a la izquierda, la $(0, 0)$? ¿Y la de arriba a la derecha, la $(7, 7)$? Suma y mira si es par.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-pixel-2', alto: 250,
        aria: 'Un tablero de ajedrez en blanco y negro cuyo número de casillas se puede cambiar.',
        mandos: [{ n: 'casillas', label: 'casillas', min: 1, max: 24, step: 1, value: 8, dec: 0 }],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '\n' +
          '    // ¿en qué casilla caigo?\n' +
          '    vec2 casilla = floor(uv * casillas);\n' +
          '\n' +
          '    // si la suma de fila y columna es par, blanco; si no, negro\n' +
          '    float tono = mod(casilla.x + casilla.y, 2.0);\n' +
          '\n' +
          '    color = vec4(vec3(tono), 1.0);\n' +
          '}\n',
        nota: 'Ningún píxel sabe que forma parte de un tablero. Cada uno mira su coordenada, ' +
          'calcula en qué casilla cae y decide. El tablero lo ves tú, no el código.'
      });
    }
  });

  p.text('Ese <code>mod(a, 2.0)</code> vale 0 si el número es par y 1 si es impar: es la [[av-numeros|aritmética modular]], decidiendo colores. Y <code>floor</code> es la parte entera. Con dos ' +
    'funciones que ya conocías sale un tablero de ajedrez de cualquier tamaño.');

  p.section('Cómo se lee un error');

  p.text('Vas a equivocarte constantemente, y eso está bien: la manera de aprender esto es romperlo. ' +
    'Cuando el código no compila, el visor no dibuja y aparece un mensaje en rojo con ' +
    '<strong>el número de línea</strong>. Conviene saber leerlo.');

  p.table(['Mensaje', 'Qué ha pasado'], [
    ['<code>undeclared identifier</code>', 'Has usado un nombre que no existe. Casi siempre, una errata.'],
    ['<code>syntax error</code>', 'Falta un punto y coma, o un paréntesis, o una llave.'],
    ['<code>cannot convert from float to vec3</code>', 'Le das un número donde espera tres. Prueba <code>vec3(x)</code>.'],
    ['<code>no matching overloaded function</code>', 'Le pasas a una función algo del tipo que no es.']
  ]);

  p.note('El error más frecuente al empezar no da mensaje: escribir <code>1</code> donde hace falta ' +
    '<code>1.0</code>. GLSL distingue estrictamente los enteros de los decimales y no los mezcla sin ' +
    'permiso. <strong>Regla de oro: si es un número, ponle punto.</strong> ' +
    '<code>0.5</code>, <code>1.0</code>, <code>2.0</code>.', 'warn', 'El punto que se olvida siempre');

  p.hist('La idea de escribir el color como un pequeño programa es de Rob Cook, en Lucasfilm, que en ' +
    '1984 publicó los <em>shade trees</em>: en vez de una lista fija de materiales, un árbol de ' +
    'operaciones que el artista podía montar. De ahí salió en 1988 el lenguaje de sombreado de ' +
    'RenderMan, el sistema con el que Pixar hizo <em>Toy Story</em>. Durante quince años eso fue cosa ' +
    'de estudios de cine y de granjas de ordenadores que tardaban horas por fotograma. Lo que ha ' +
    'cambiado es que ahora ocurre en tu portátil sesenta veces por segundo, mientras escribes.');

  p.util('No hay una sola imagen en una pantalla moderna que no haya pasado por un shader. El ' +
    'desenfoque del fondo cuando abres el menú del móvil es un shader. El filtro que te pone orejas ' +
    'de gato es un shader. La sombra bajo una ventana, la transición entre dos aplicaciones, el ' +
    'agua de un videojuego, el mapa que se deforma al girar, la corrección de color de una película: ' +
    'shaders. Aprender esto no es aprender un rincón: es aprender la capa por la que pasa todo lo ' +
    'que ves en un dispositivo.');

  p.section('Dónde seguir por tu cuenta');

  p.text('Esto es un curso, no una jaula. El código que escribes aquí es <strong>el mismo</strong> ' +
    'que se usa en la comunidad: mismo lenguaje, mismos nombres de variables, misma firma de la ' +
    'función. Puedes copiar cualquier shader de internet y pegarlo aquí, y puedes llevarte los tuyos ' +
    'a cualquier otro sitio.');

  p.list([
    '<strong>Shadertoy</strong> (shadertoy.com) es la plaza mayor del asunto: cientos de miles de shaders publicados, con su código a la vista, y un editor en el navegador. Es la referencia, y este visor está hecho a su medida a propósito.',
    '<strong>glslsandbox.com</strong>, más viejo y más crudo, permite bifurcar el de cualquiera con un clic.',
    '<strong>KodeLife</strong> y <strong>Bonzomatic</strong> son editores de escritorio para trabajar en directo; el segundo es el que se usa en las competiciones de <em>live coding</em> de la demoscene.',
    '<strong>The Book of Shaders</strong> (thebookofshaders.com), de Patricio González Vivo y Jen Lowe, es un libro libre y en español que cubre esto mismo con otra voz. Si algo aquí no te entra, allí puede que sí.',
    'Los artículos de <strong>Íñigo Quílez</strong> (iquilezles.org) son la fuente de casi todo lo que verás en los temas de distancia y raymarching. Están escritos por quien inventó buena parte de ello.'
  ]);

  p.trampas([
    { e: 'Escribir <code>1</code> donde va <code>1.0</code>', por: 'GLSL distingue enteros de decimales: <code>0.5 * 2</code> no compila y <code>1 / 2</code> vale 0. Regla: si es un número, punto.' },
    { e: 'Pensar el shader como un procedimiento que dibuja en orden', por: 'No hay orden ni lápiz: dos millones de funciones contestan a la vez. El tablero no se dibuja casilla a casilla; cada píxel decide su color solo.' },
    { e: 'Dar los colores de 0 a 255', por: '<code>vec4(255.0, 0.0, 0.0, 1.0)</code> se recorta a rojo puro y parece funcionar, pero <code>128.0</code> también sale rojo puro. Aquí todo va de 0 a 1.' },
    { e: 'Usar <code>fragCoord</code> sin normalizar', por: 'Un degradado con <code>fragCoord.x</code> vale más de 1 desde el segundo píxel: todo blanco. Se divide por <code>iResolution</code> para que el 1 sea el borde derecho en cualquier pantalla.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿De qué color es ese píxel?',
    level: 'basico',
    gen: function (r) {
      var w = r.pick([200, 400, 800]), h = r.pick([100, 200, 400]);
      var px = r.int(1, w - 1), py = r.int(1, h - 1);
      return { w: w, h: h, px: px, py: py, u: px / w, v: py / h };
    },
    ask: function (d) {
      return 'Un shader hace <code>vec2 uv = fragCoord / iResolution.xy;</code> y devuelve ' +
        '<code>vec4(uv.x, uv.y, 0.0, 1.0)</code>.<br><br>La ventana mide <strong>' + d.w + ' × ' +
        d.h + '</strong> píxeles. ¿Cuánto valen el rojo y el verde en el píxel ' +
        '<code>fragCoord = (' + d.px + ', ' + d.py + ')</code>? (cuatro decimales)';
    },
    fields: [
      { name: 'r', label: 'rojo', w: 'tiny' },
      { name: 'g', label: 'verde', w: 'tiny' }
    ],
    sol: function (d) { return { r: U.round(d.u, 8), g: U.round(d.v, 8) }; },
    tol: 3e-5,
    hint: function () {
      return 'Normalizar es dividir cada componente por el tamaño correspondiente: la x entre el ' +
        'ancho y la y entre el alto.';
    },
    steps: function (d) {
      return ['El rojo es $uv.x = \\dfrac{' + d.px + '}{' + d.w + '} = ' + U.fmt(d.u, 4) + '$',
        'El verde es $uv.y = \\dfrac{' + d.py + '}{' + d.h + '} = ' + U.fmt(d.v, 4) + '$',
        'Fíjate en que el resultado no depende del tamaño de la pantalla: ese píxel está al ' +
        U.fmt(d.u * 100, 1) + ' % del ancho, y ahí valdría lo mismo en cualquier ventana. Para eso ' +
        'se normaliza.'];
    },
    answer: function (d) { return 'rojo ' + U.fmt(d.u, 4) + ', verde ' + U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { c: 'vec2 uv = fragCoord / iResolution.xy;\ncolor = vec4(uv.x, 0.0, 0.0, 1.0);',
          o: ['Un degradado de negro a rojo, de izquierda a derecha', 'Un degradado de rojo a negro, de izquierda a derecha', 'Un degradado de negro a rojo, de abajo arriba', 'Toda la pantalla roja'],
          por: '<code>uv.x</code> vale 0 en el borde izquierdo y 1 en el derecho, y va al canal rojo: negro a la izquierda, rojo puro a la derecha.' },
        { c: 'vec2 uv = fragCoord / iResolution.xy;\ncolor = vec4(uv.x, uv.y, 0.0, 1.0);',
          o: ['Negro abajo a la izquierda, rojo abajo a la derecha, verde arriba a la izquierda y amarillo arriba a la derecha', 'Un degradado de rojo a verde de izquierda a derecha', 'Toda la pantalla amarilla', 'Amarillo abajo a la izquierda y negro arriba a la derecha'],
          por: 'El rojo crece hacia la derecha y el verde hacia arriba. Donde los dos valen 1, arriba a la derecha, se suman en amarillo.' },
        { c: 'float v = step(0.5, fragCoord.x / iResolution.x);\ncolor = vec4(vec3(v), 1.0);',
          o: ['La mitad izquierda negra y la derecha blanca', 'La mitad izquierda blanca y la derecha negra', 'La mitad de abajo negra y la de arriba blanca', 'Un degradado de negro a blanco'],
          por: '<code>step(0.5, x)</code> vale 0 si $x < 0{,}5$ y 1 si no: corte brusco en la mitad, negro a la izquierda y blanco a la derecha.' },
        { c: 'color = vec4(0.0, 0.0, 1.0, 1.0);',
          o: ['Toda la pantalla azul', 'Un solo píxel azul', 'Un degradado azul', 'Nada: sin fragCoord no se dibuja'],
          por: 'La respuesta no depende del píxel, así que todos los píxeles contestan lo mismo: azul.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return '¿Qué se ve con este shader?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Recuerda que <code>fragCoord</code> empieza abajo a la izquierda.', 'Pregúntate qué contesta un píxel del borde izquierdo y qué contesta uno del derecho.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Completa el degradado',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { pide: 'un degradado que va de <strong>negro a la izquierda</strong> a <strong>blanco a la derecha</strong>', ref: 'vec3(uv.x)' },
        { pide: 'un degradado que va de <strong>blanco a la izquierda</strong> a <strong>negro a la derecha</strong>', ref: 'vec3(1.0 - uv.x)' },
        { pide: 'un degradado que va de <strong>negro abajo</strong> a <strong>blanco arriba</strong>', ref: 'vec3(uv.y)' },
        { pide: 'un degradado <strong>rojo</strong> que crece hacia la derecha', ref: 'vec3(uv.x, 0.0, 0.0)' },
        { pide: 'un degradado <strong>azul</strong> que crece hacia arriba', ref: 'vec3(0.0, 0.0, uv.y)' },
        { pide: 'un <strong>gris uniforme</strong> a media luz', ref: 'vec3(0.5)' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa el shader para que pinte ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 uv = fragCoord / iResolution.xy;\ncolor = vec4( <strong>???</strong> , 1.0);</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe solo lo que va en el hueco: ' +
        'un <code>vec3</code>. Se corrige comparando el dibujo, así que vale cualquier forma de ' +
        'escribirlo que dé el mismo resultado.</span>';
    },
    fields: [{ name: 'c', label: 'el vec3', w: 'wide', ph: 'vec3(...)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe un <code>vec3</code> en la casilla.' };
      function envuelve(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = fragCoord / iResolution.xy;\n' +
          '  color = vec4(' + x + ', 1.0);\n}';
      }
      var r = W.glslIguales(envuelve(texto), envuelve(d.ref), { tam: 32, tol: 6 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'Eso no compila. Revisa los paréntesis y acuérdate de que los ' +
          'números llevan punto: <code>1.0</code>, no <code>1</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero no pinta lo que se pedía. Mira en qué dirección ' +
          'tiene que crecer el color y qué componente controla esa dirección.' };
      }
      return { ok: true };
    },
    hint: function () {
      return '<code>uv.x</code> crece hacia la derecha y <code>uv.y</code> hacia arriba. ' +
        '<code>vec3(a)</code> repite el mismo valor en las tres componentes, que es como se hace un ' +
        'gris. Y <code>1.0 - a</code> le da la vuelta.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.',
        'La respuesta es <code>' + d.ref + '</code>.',
        'Cualquier expresión que pinte lo mismo se da por buena: el corrector compara las dos ' +
        'imágenes píxel a píxel, no los dos textos.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Lee el shader',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { cod: 'color = vec4(1.0, 0.0, 0.0, 1.0);', q: 'rojo',
          por: 'Rojo a tope, nada de verde ni de azul, y en todos los píxeles igual: rojo liso.' },
        { cod: 'color = vec4(vec3(uv.x), 1.0);', q: 'degradado',
          por: 'Las tres componentes valen lo mismo y crecen con la x: un degradado de negro a blanco.' },
        { cod: 'color = vec4(0.0, 0.0, 0.0, 1.0);', q: 'negro',
          por: 'Las tres componentes a cero: negro liso.' },
        { cod: 'color = vec4(vec3(step(0.5, uv.x)), 1.0);', q: 'mitades',
          por: '<code>step</code> vale 0 antes del 0,5 y 1 después: la pantalla partida en dos mitades, negra y blanca.' },
        { cod: 'color = vec4(vec3(mod(floor(uv.x * 10.0), 2.0)), 1.0);', q: 'rayas',
          por: 'Se divide la x en diez tramos y se alternan: rayas verticales.' },
        { cod: 'color = vec4(uv.x, uv.y, 0.0, 1.0);', q: 'degradado',
          por: 'El rojo crece hacia la derecha y el verde hacia arriba: un degradado en dos direcciones.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Sabiendo que antes hay <code>vec2 uv = fragCoord / iResolution.xy;</code>, ' +
        '¿qué se ve con esta línea?<br>' +
        '<pre class="shd__mini">' + d.cod + '</pre>';
    },
    fields: [{ name: 'q', label: 'Se ve', opts: [{ t: 'rojo liso', v: 'rojo' }, { t: 'negro liso', v: 'negro' }, { t: 'un degradado', v: 'degradado' }, { t: 'dos mitades', v: 'mitades' }, { t: 'rayas', v: 'rayas' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () {
      return 'Pregúntate si el color depende de <code>uv</code> o no. Si no depende, es liso. Si ' +
        'depende de forma continua, es un degradado. Si depende a saltos —con <code>step</code>, ' +
        '<code>floor</code> o <code>mod</code>—, hay bordes.';
    },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return d.q; }
  });

  p.keys([
    'Un shader <strong>no dibuja: contesta</strong>. Es una función que recibe una coordenada y devuelve un color.',
    'Se ejecuta una vez por píxel, millones de veces <strong>a la vez</strong>, y ningún píxel sabe nada de los demás. De ahí la velocidad.',
    'Lo primero es siempre normalizar: $uv = \\text{fragCoord}/\\text{iResolution}$, y así el código no depende del tamaño de la pantalla.',
    'El color son cuatro decimales entre 0 y 1, no enteros entre 0 y 255.',
    'Los <code>vec2</code>, <code>vec3</code> y <code>vec4</code> son los vectores de geometría, y operan componente a componente.',
    'Los números llevan punto: <code>1.0</code>, no <code>1</code>. Es el error que más veces vas a cometer.'
  ]);
});
