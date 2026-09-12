/* Tema: Nombres y ámbito: un entorno es una aplicación de nombres en valores */
Course.topic('len-variables', function (p) {

  p.puente('Hasta aquí, las expresiones que se han traducido eran de números pelados. En cuanto aparece ' +
    'un nombre —<code>x</code>, <code>total</code>, <code>n</code>— hace falta algo más: alguien tiene ' +
    'que saber <strong>qué vale cada nombre en cada momento</strong>. Ese algo tiene un nombre técnico y ' +
    'una definición matemática de una línea.');

  /* ---------------------------------------------------------------- */
  p.section('Un entorno es una aplicación');

  p.text('Se llama <strong>entorno</strong> a lo que el intérprete consulta cuando se encuentra un ' +
    'nombre. Y no es una metáfora decir que es una aplicación: es literalmente una ' +
    '[[lg-conjuntos|aplicación]] de un conjunto de nombres en el conjunto de los valores.');

  p.formula('E : \\text{nombres} \\longrightarrow \\text{valores}', 'el entorno, en una línea');

  p.text('Con esa lectura, cada cosa que hace un programa con las variables tiene su traducción exacta:');

  p.table(['en el programa', 'en la aplicación'],
    [['<code>sea x = 3;</code>', 'añadir el par $(x, 3)$ al entorno'],
     ['<code>x = 5;</code>', 'cambiar la imagen de $x$, que pasa a ser 5'],
     ['usar <code>x</code> en una expresión', 'evaluar $E(x)$'],
     ['usar un nombre que no está', '$x$ no está en el dominio: error']]);

  p.note('Que sea una <em>aplicación</em> y no una relación cualquiera dice algo importante: cada nombre ' +
    'tiene <strong>un solo valor</strong> en cada momento. Un programa donde <code>x</code> valiera dos ' +
    'cosas a la vez no significaría nada. Y que su dominio sea finito y vaya creciendo es lo que hace ' +
    'que se pueda guardar en una tabla, que es exactamente como se implementa.',
    'ok', 'Por qué aplicación y no otra cosa');

  /* ---------------------------------------------------------------- */
  p.section('Declarar no es asignar');

  p.text('Pizca distingue las dos cosas, y la distinción no es un capricho:');

  p.text('<pre class="shd__mini">sea x = 3;   # declarar: mete el nombre en el entorno\n' +
    'x = 5;       # asignar: cambia lo que vale un nombre que ya estaba</pre>');

  p.text('Si se asigna a un nombre que no existe, el lenguaje protesta. Y protesta a propósito, porque el ' +
    'fallo más frecuente del mundo al programar es escribir mal un nombre: sin esta regla, ' +
    '<code>totla = 5;</code> crearía tranquilamente una variable nueva y el programa daría un resultado ' +
    'equivocado sin quejarse. Con ella, salta en el acto.');

  p.demo({
    title: 'El entorno, por dentro',
    intro: 'Cada sentencia toca el entorno. Cambia el programa y mira la salida: prueba a asignar a un nombre que no has declarado, a declarar dos veces el mismo, o a usar uno antes de declararlo.',
    predice: 'Si escribes «sea x = 3; sea y = x + 1; x = 10;», ¿crees que «y» valdrá 4 u 11 al final?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'var-ent', paneles: ['maquina', 'asm'],
        texto: 'sea x = 3;\nsea y = x + 1;\nx = 10;\nmuestra x;\nmuestra y;',
        nota: '<code>y</code> se quedó con el 4. Al declararla se evaluó <code>x + 1</code> <strong>en ese momento</strong> y se guardó el número: el entorno guarda valores, no cuentas pendientes. Eso distingue a un lenguaje como éste de una hoja de cálculo, donde la celda sí recuerda la fórmula.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Ámbito: entornos encadenados');

  p.text('La cosa se pone interesante con las funciones. Si dentro de una función hay un parámetro ' +
    'llamado <code>n</code> y fuera hay una variable global también llamada <code>n</code>, ¿cuál se ' +
    'usa dentro?');

  p.text('La respuesta es la de dentro, y el mecanismo es sencillo: cada llamada crea un entorno ' +
    '<strong>nuevo</strong> que apunta al de fuera como su padre. Buscar un nombre es mirar en el ' +
    'entorno propio y, si no está, subir al padre, y así hasta arriba:');

  p.text('<pre class="shd__mini">busca(nombre, entorno) {\n' +
    '  si el entorno tiene el nombre { vuelve su valor; }\n' +
    '  si tiene padre { vuelve busca(nombre, el padre); }\n' +
    '  error: ese nombre no existe;\n' +
    '}</pre>');

  p.note('A eso se le llama <strong>ámbito</strong>, y lo que hace la variable de dentro con la de fuera ' +
    'es <em>taparla</em>: mientras dure la función, el nombre se resuelve en el entorno interior y el ' +
    'de fuera queda escondido. En cuanto la función termina, su entorno se tira entero y el de fuera ' +
    'vuelve a la vista, intacto. Por eso una función no puede estropear las variables de quien la llamó ' +
    'sin querer, y por eso se pueden escribir funciones sin saber qué nombres usa el resto del programa.',
    'ok', 'Tapar, no pisar');

  p.demo({
    title: 'El mismo nombre, dos sitios',
    intro: 'Hay una «n» global y un parámetro «n» dentro de la función. Cámbiales los valores y comprueba qué sale, y después renombra el parámetro para ver que el resultado no cambia.',
    predice: 'La función recibe 5 y la variable global vale 100. ¿Qué crees que escribirá la función: 5, 100 o 105?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'var-ambito',
        texto: 'sea n = 100;\nfun mira(n) {\n  vuelve n + 1;\n}\nmuestra mira(5);\nmuestra n;',
        nota: 'La función escribe 6, no 101: dentro, <code>n</code> es su parámetro. Y la <code>n</code> de fuera sigue valiendo 100 después de la llamada: no se ha tocado, solo estaba tapada.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Qué hace el compilador con los nombres');

  p.text('El intérprete puede permitirse entornos que nacen y mueren. El compilador no: tiene que decidir ' +
    '<strong>antes de ejecutar nada</strong> en qué celda de memoria vive cada nombre, porque las ' +
    'instrucciones <code>CARGA</code> y <code>GUARDA</code> llevan la dirección escrita dentro.');

  p.text('Lo que hace es repartir huecos: una celda por cada variable global, y una celda propia por cada ' +
    'parámetro y cada variable declarada dentro de una función. Como los nombres de dentro tienen su ' +
    'hueco aparte, el ámbito se resuelve <strong>en el momento de compilar</strong> y en tiempo de ' +
    'ejecución no queda ni rastro: la máquina solo ve direcciones.');

  p.note('Eso es una diferencia real entre interpretar y compilar, y no es de velocidad. El intérprete ' +
    'busca los nombres <em>mientras</em> el programa corre, así que puede dar un error de nombre en ' +
    'mitad de la ejecución. El compilador los resuelve antes, así que un nombre mal escrito se descubre ' +
    'al compilar y no cuando el programa lleva media hora funcionando. Es la primera de las ventajas de ' +
    'compilar que va a aparecer en [[len-compilar|el tema correspondiente]].',
    null, 'Encontrar el fallo antes o después');

  p.ejemplo({
    title: 'Seguir el entorno línea a línea',
    enunciado: 'Escribir cómo queda el entorno después de cada línea de este programa: <code>sea a = 2;</code> · <code>sea b = a * 3;</code> · <code>a = a + b;</code> · <code>muestra a;</code>',
    pasos: [
      { t: '<strong>Línea 1.</strong> <code>sea a = 2;</code> añade el par $(a, 2)$. El entorno es $\\{(a, 2)\\}$.', antes: 'Al principio el entorno está vacío: su dominio es el conjunto vacío.' },
      { t: '<strong>Línea 2.</strong> <code>sea b = a * 3;</code> primero <em>evalúa</em> la expresión con el entorno de ahora: $E(a) = 2$, así que $2 \\cdot 3 = 6$. Después añade $(b, 6)$. Entorno: $\\{(a, 2), (b, 6)\\}$.' },
      { t: '<strong>Línea 3.</strong> <code>a = a + b;</code> no añade nada: cambia la imagen de $a$. Se evalúa $2 + 6 = 8$ y el par $(a, 2)$ pasa a ser $(a, 8)$. Entorno: $\\{(a, 8), (b, 6)\\}$.', antes: 'Ojo con el orden: primero se evalúa el lado derecho entero, con los valores viejos, y después se guarda.' },
      { t: '<strong>Línea 4.</strong> <code>muestra a;</code> evalúa $E(a) = 8$ y lo escribe. El entorno no cambia.' },
      { t: '<strong>Lo que no pasó.</strong> <code>b</code> siguió valiendo 6 aunque se calculara a partir de <code>a</code> y <code>a</code> cambiara después. El entorno guardó el <em>número</em>, no la cuenta.' }
    ],
    cierre: 'Cuatro líneas, cuatro operaciones sobre una aplicación: añadir un par, añadir otro, cambiar una imagen y consultarla. No hay nada más en el manejo de variables de ningún lenguaje.'
  });

  p.comprueba('Dentro de una función hay un parámetro llamado <code>n</code> y fuera hay una variable global también llamada <code>n</code>. ¿Qué le pasa a la global mientras corre la función?', [
    { t: 'Nada: queda tapada, y vuelve a verse intacta cuando la función termina', ok: true, por: 'La llamada crea un entorno nuevo que apunta al de fuera. Buscar <code>n</code> lo encuentra en el de dentro y no llega a mirar el de fuera, que sigue ahí con su valor de siempre.' },
    { t: 'Se sobrescribe con el valor del parámetro', ok: false, por: 'Si fuera así, ninguna función sería segura: llamar a una función escrita por otra persona podría estropear cualquier variable con un nombre común. Los entornos encadenados existen justamente para que eso no pase.' },
    { t: 'Se suman las dos', ok: false, por: 'No hay ninguna operación entre ellas. Son dos pares distintos, en dos aplicaciones distintas.' }
  ]);

  p.util('El ámbito es una de esas cosas que solo se notan cuando faltan. Los primeros lenguajes con ' +
    'macros, y las primeras versiones de algunos lenguajes de scripts, tenían todas las variables ' +
    'globales: escribir una función que usara <code>i</code> como contador podía romper el bucle de ' +
    'quien la llamaba, así que la gente recurría a nombres larguísimos y feos por pura defensa. La otra ' +
    'cara es que hoy, cuando algo no funciona y «el valor no es el que debería», lo primero que hay que ' +
    'preguntarse es en qué entorno se está mirando el nombre.');

  p.hist('La idea de que un nombre valga solo dentro de un trozo de programa es de <strong>ALGOL ' +
    '60</strong>, y en su momento fue una novedad radical: en FORTRAN o en los ensambladores de ' +
    'entonces, un nombre era un sitio de memoria y punto. ALGOL introdujo los bloques, los ámbitos ' +
    'anidados y el acceso a las variables de fuera, y con ellos apareció una pregunta que tardó veinte ' +
    'años en resolverse del todo: si una función se define en un sitio y se llama en otro, ¿qué entorno ' +
    'debe ver, el de donde está escrita o el de donde se la llama? La primera opción se llama ámbito ' +
    '<em>léxico</em> y ganó por completo; la segunda, <em>dinámico</em>, sobrevive casi solo como ' +
    'ejemplo de lo que puede salir mal.');

  p.trampas([
    { e: 'Creer que el entorno guarda la fórmula', por: 'Guarda el número que salió al evaluarla. Si después cambia una de las variables que intervenían, lo ya guardado no se entera. Una hoja de cálculo sí funciona al revés, y por eso confunde.' },
    { e: 'Asignar a un nombre que no se ha declarado', por: 'En Pizca es un error, y está pensado así: si no lo fuera, una errata en un nombre crearía una variable nueva en silencio.' },
    { e: 'Pensar que un parámetro pisa la variable global del mismo nombre', por: 'La tapa mientras dura la llamada y la deja intacta. Son dos pares en dos entornos distintos.' },
    { e: 'Esperar que una variable declarada dentro de una función exista fuera', por: 'Su entorno se tira al terminar la llamada. Lo que tenga que salir, sale por el <code>vuelve</code>.' },
    { e: 'Confundir el orden en una asignación', por: 'Primero se evalúa el lado derecho <strong>entero</strong>, con los valores actuales, y luego se guarda. Por eso <code>a = a + b;</code> funciona sin dar vueltas.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cómo queda el entorno',
    level: 'basico',
    gen: function (r) {
      var a = r.int(2, 9), b = r.int(2, 5);
      var casos = [
        { t: 'sea x = ' + a + ';\nsea y = x + ' + b + ';', x: a, y: a + b },
        { t: 'sea x = ' + a + ';\nsea y = x * ' + b + ';', x: a, y: a * b },
        { t: 'sea x = ' + a + ';\nsea y = x;\nx = ' + b + ';', x: b, y: a },
        { t: 'sea x = ' + a + ';\nsea y = ' + b + ';\nx = x + y;', x: a + b, y: b }
      ];
      var c = r.pick(casos);
      return { t: c.t, x: c.x, y: c.y };
    },
    ask: function (d) {
      return 'Después de estas líneas, ¿cuánto valen <code>x</code> e <code>y</code>?' +
        '<pre class="shd__mini">' + d.t + '</pre>';
    },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: d.x, y: d.y }; },
    tol: 0.5,
    hint: function () { return 'Ve línea a línea. En cada una, evalúa primero el lado derecho con los valores que hay en ese momento, y solo después guarda.'; },
    steps: function (d) {
      var r = LEN.corre(d.t + '\nmuestra x;\nmuestra y;');
      return ['Línea a línea, evaluando siempre el lado derecho antes de guardar.',
        'Queda $x = ' + r.salida[0] + '$ e $y = ' + r.salida[1] + '$.',
        'Si alguno te ha sorprendido, casi seguro fue por esperar que el entorno recordara la fórmula. Guarda el número.'];
    },
    answer: function (d) { return 'x = ' + d.x + ', y = ' + d.y; }
  });

  p.exercise({
    title: 'Declarar o asignar',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'sea x = 3;', v: 'declara', por: 'Añade el par al entorno: el nombre <code>x</code> no estaba y ahora está.' },
        { t: 'x = 3;', v: 'asigna', por: 'Cambia la imagen de un nombre que ya tenía que estar. Si no estaba, es un error.' },
        { t: 'sea total = x + y;', v: 'declara', por: 'Evalúa la expresión y añade el par <code>(total, resultado)</code>.' },
        { t: 'i = i + 1;', v: 'asigna', por: 'Lo típico de un bucle: <code>i</code> ya existía y se le cambia el valor.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Qué hace esta línea con el entorno?<pre class="shd__mini">' + d.c.t + '</pre>'; },
    fields: [{ name: 'q', label: 'Hace', opts: [
      { t: 'añadir un par nuevo (declarar)', v: 'declara' },
      { t: 'cambiar la imagen de uno que ya estaba (asignar)', v: 'asigna' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'La palabra <code>sea</code> es la que declara. Sin ella, se está cambiando algo que ya tenía que existir.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Qué escribe con ámbitos',
    level: 'medio',
    gen: function (r) {
      var g = r.int(10, 99), a = r.int(2, 9);
      var casos = [
        { t: 'sea n = ' + g + ';\nfun f(n) { vuelve n + 1; }\nmuestra f(' + a + ');\nmuestra n;', s: [a + 1, g] },
        { t: 'sea n = ' + g + ';\nfun f(x) { vuelve x + n; }\nmuestra f(' + a + ');\nmuestra n;', s: [a + g, g] },
        { t: 'sea n = ' + g + ';\nfun f(n) { vuelve n * 2; }\nmuestra f(' + a + ');\nmuestra n;', s: [a * 2, g] }
      ];
      var c = r.pick(casos);
      return { t: c.t, s: c.s.map(function (v) { return LEN.ocho(v); }) };
    },
    ask: function (d) { return '¿Qué escribe este programa?<pre class="shd__mini">' + d.t + '</pre>'; },
    fields: [{ name: 'a', label: 'lo primero', w: 'tiny' }, { name: 'b', label: 'lo segundo', w: 'tiny' }],
    sol: function (d) { return { a: d.s[0], b: d.s[1] }; },
    tol: 0.5,
    hint: function () { return 'Dentro de la función, busca el nombre primero en su propio entorno —sus parámetros— y solo si no está, fuera. Y recuerda que la llamada no toca nada de fuera.'; },
    steps: function (d) {
      var r = LEN.corre(d.t);
      return ['Al llamar se crea un entorno nuevo con los parámetros, que apunta al de fuera.',
        'Dentro, cada nombre se busca primero ahí; solo si no está se sube al entorno de fuera.',
        'Escribe <strong>' + r.salida.join('</strong> y <strong>') + '</strong>. La variable de fuera sale intacta: estaba tapada, no pisada.'];
    },
    answer: function (d) { return d.s.join(' y '); }
  });

  p.exercise({
    title: 'Dónde está el fallo',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'x = 3;\nmuestra x;', v: 'nodecl', por: 'Se asigna a <code>x</code> sin haberla declarado. El lenguaje protesta a propósito: si lo dejara pasar, una errata en un nombre crearía una variable nueva en silencio.' },
        { t: 'sea x = 3;\nmuestra y;', v: 'nombre', por: '<code>y</code> no está en el dominio del entorno: no se puede evaluar $E(y)$ porque no hay imagen que devolver.' },
        { t: 'fun f(n) { sea t = n * 2; }\nmuestra t;', v: 'ambito', por: '<code>t</code> vive en el entorno de la función, que se tira al terminar la llamada. Fuera no existe: lo que tenga que salir, sale por el <code>vuelve</code>.' },
        { t: 'sea x = 3;\nmuestra x;', v: 'ninguno', por: 'No hay ningún fallo: se declara y se usa, en ese orden.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Qué le pasa a este programa?<pre class="shd__mini">' + d.c.t + '</pre>'; },
    fields: [{ name: 'q', label: 'El fallo es', opts: [
      { t: 'asigna a un nombre sin declararlo', v: 'nodecl' },
      { t: 'usa un nombre que no existe', v: 'nombre' },
      { t: 'usa fuera un nombre que solo vivía dentro de una función', v: 'ambito' },
      { t: 'ninguno: está bien', v: 'ninguno' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate, para cada nombre que aparece: ¿está en el dominio del entorno <em>en ese punto del programa</em>?'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un <strong>entorno</strong> es una aplicación de nombres en valores: $E : \\text{nombres} \\to \\text{valores}$.',
    'Declarar es <strong>añadir un par</strong>; asignar es <strong>cambiar una imagen</strong>; usar un nombre es <strong>evaluar la aplicación</strong>.',
    'El entorno guarda el <strong>número</strong>, no la cuenta: si después cambia lo que intervino, lo guardado no se entera.',
    'Cada llamada crea un entorno nuevo que apunta al de fuera, y buscar un nombre es mirar dentro y subir si no está.',
    'Eso es el <strong>ámbito</strong>: la variable de dentro <strong>tapa</strong> a la de fuera, no la pisa, y al terminar la llamada la de fuera aparece intacta.',
    'El compilador reparte los nombres en celdas <strong>antes de ejecutar</strong>, así que en la máquina no queda ni rastro de los nombres: solo direcciones.',
    'Por eso un nombre mal escrito lo caza el compilador al compilar, y el intérprete solo cuando llega a esa línea.'
  ]);
});
