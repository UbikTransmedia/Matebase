/* Tema: El «si» no existe: multiplexor y comparador */
Course.topic('maq-decidir', function (p) {

  p.puente('Con [[maq-puertas|las puertas]] se construye cualquier tabla, y en ' +
    '[[lg-proposiciones|la lógica]] ya viste que una condición es una proposición. Falta lo que parece ' +
    'imposible en un circuito: <strong>decidir</strong>. Un programa escribe «si pasa esto, haz esto ' +
    'otro», y aquí no hay nada parecido.');

  p.text('Un circuito no tiene instrucciones ni orden. Todas sus puertas están encendidas a la vez, ' +
    'siempre, y cada cable tiene el valor que le toque. No se puede «saltar» un trozo ni «no ' +
    'ejecutar» una puerta. Y sin embargo un ordenador decide continuamente. La manera de conseguirlo ' +
    'es la misma que usa un ilusionista: <strong>calcularlo todo, y luego enseñar solo una cosa</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('El multiplexor');

  p.text('El circuito que elige se llama <strong>multiplexor</strong>. Tiene dos entradas de datos, una ' +
    'entrada de control y una salida, y hace exactamente esto: si el control vale 0 saca la primera ' +
    'entrada, y si vale 1 saca la segunda.');

  p.formula('m = (x \\text{ y no } s) \\ \\text{o} \\ (y \\text{ y } s)',
    'el multiplexor, en una línea',
    'Se lee: <em>«eme es x-y-no-ese, o y-y-ese»</em>.<br><br>Cada rama se apaga sola cuando no le toca: ' +
    'si $s = 0$, el segundo paréntesis vale 0 pase lo que pase con $y$, y el primero deja pasar $x$. ' +
    'Con $s = 1$ ocurre al revés.<br><br>Fíjate en lo que <em>no</em> pasa: <strong>las dos ramas se ' +
    'calculan siempre</strong>. Si $y$ fuera el resultado de un cálculo carísimo, ese cálculo se haría ' +
    'igual, aunque $s$ valga 0 y su resultado se tire. Un circuito no se ahorra trabajo.');

  p.demo({
    title: 'Elegir entre dos cables',
    intro: 'El multiplexor montado con cuatro puertas. Pon sel a 0 y cambia x e y: la salida sigue a x. Pon sel a 1 y seguirá a y.',
    predice: 'Con sel a 0, ¿crees que el valor de y afecta de alguna manera a la salida?',
    build: function (host) {
      W.circuito(host, {
        id: 'dec-mux', alto: 250,
        texto: 'ns = not(sel);\n' +
               'va = and(x, ns);\n' +
               'vb = and(y, sel);\n' +
               'm = or(va, vb);',
        aria: 'Multiplexor: dos and, un not y un or eligen entre dos entradas según el cable de control.',
        nota: 'Mira los cables encendidos en el dibujo: la rama que no toca está siempre apagada, pero sigue estando ahí y consumiendo.'
      });
    }
  });

  p.note('Esto no es un truco de circuitos: es el mismo que se usa en ' +
    '[[gfx-decidir|los shaders]], donde conviene evitar el <code>if</code> porque miles de píxeles ' +
    'ejecutan la misma instrucción a la vez. Allí se escribe <code>mix(x, y, s)</code>, que con $s$ ' +
    'valiendo 0 o 1 hace exactamente lo que este circuito. El motivo de fondo es idéntico: ' +
    '<strong>es más barato calcular las dos ramas y tirar una que decidir cuál calcular.</strong>',
    'ok', 'Lo mismo, en otro sitio del curso');

  /* ---------------------------------------------------------------- */
  p.section('Comparar');

  p.text('La otra mitad de decidir es <strong>de dónde sale la condición</strong>. Casi siempre de una ' +
    'comparación, y comparar también son puertas.');

  p.text('Lo más fácil es la igualdad. Dos bits son iguales cuando su <code>xnor</code> vale 1, así que ' +
    'para saber si dos números son iguales basta con comparar bit a bit y exigir que ' +
    '<strong>todas</strong> las comparaciones den 1, que es un <code>and</code> de todas.');

  p.demo({
    title: '¿Son iguales estos dos números?',
    intro: 'Dos números de dos bits, a1a0 y b1b0. Un xnor por cada par de bits y un and que exige que coincidan todos. Prueba a cambiar un solo bit y verás caer la salida.',
    predice: 'Con cuatro entradas hay dieciséis combinaciones. ¿En cuántas crees que la salida valdrá 1?',
    build: function (host) {
      W.circuito(host, {
        id: 'dec-igual', alto: 230,
        texto: 'e1 = xnor(a1, b1);\n' +
               'e0 = xnor(a0, b0);\n' +
               'ig = and(e1, e0);',
        aria: 'Comparador de igualdad de dos números de dos bits, con un xnor por posición y un and final.',
        nota: 'Tres puertas para dos bits. Para números de <em>n</em> bits harían falta <em>n</em> xnor y un and de <em>n</em> entradas.'
      });
    }
  });

  p.text('Comparar cuál es <strong>mayor</strong> cuesta más, y la idea es la de siempre: se mira primero ' +
    'el bit de más peso. Si son distintos, ya está decidido. Si son iguales, se pasa al siguiente. Es ' +
    'exactamente cómo se comparan dos números en la recta numérica, cifra a cifra de izquierda a ' +
    'derecha.');

  p.demo({
    title: 'Cuál de los dos es mayor',
    intro: 'El comparador «a mayor que b» para dos bits. Gana si el bit alto de a es 1 y el de b es 0; y si los bits altos empatan, decide el bajo.',
    predice: 'Si los dos bits altos son iguales, ¿en qué se tiene que fijar el circuito?',
    build: function (host) {
      W.circuito(host, {
        id: 'dec-mayor', alto: 300,
        texto: 'nb1 = not(b1);\n' +
               'nb0 = not(b0);\n' +
               'alto = and(a1, nb1);\n' +
               'empatan = xnor(a1, b1);\n' +
               'bajo = and(a0, nb0);\n' +
               'desempate = and(empatan, bajo);\n' +
               'may = or(alto, desempate);',
        aria: 'Comparador de mayor que para dos números de dos bits, con la decisión por el bit alto y el desempate por el bajo.',
        nota: 'Siete puertas para comparar dos bits. La cadena de desempates es lo que hace crecer el circuito con el tamaño de los números.'
      });
    }
  });

  p.ejemplo({
    title: 'El valor absoluto, sin bifurcar',
    enunciado: 'Un programa escribiría «si el número es negativo, cámbiale el signo». Explicar cómo se hace eso en un circuito, sabiendo que los negativos están en [[maq-bits|complemento a dos]] y que el primer bit vale 1 en todos ellos.',
    pasos: [
      { t: '<strong>La condición.</strong> No hace falta comparar con nada: el bit de más peso ya vale 1 exactamente en los negativos. Ese bit <em>es</em> la condición.', antes: '¿Cómo se sabe si un número en complemento a dos es negativo?' },
      { t: '<strong>Las dos ramas.</strong> Una es el número tal cual. La otra es su opuesto, que en complemento a dos se calcula invirtiendo los bits y sumando uno; los dos circuitos ya existen.', antes: 'Las dos ramas hay que calcularlas las dos. ¿Cuáles son?' },
      { t: '<strong>La elección.</strong> Un multiplexor por cada bit del resultado, todos con el mismo cable de control: el bit de signo.' },
      { t: '<strong>El coste.</strong> Se hacen las dos cosas siempre: se calcula el opuesto incluso de los números positivos, y se tira. A cambio, no hay ninguna decisión que tomar y el circuito tarda lo mismo con cualquier entrada.' },
      { t: '<strong>La lectura.</strong> Esto explica una cosa que sorprende al programar: en una tarjeta gráfica, y en muchos procesadores, <em>evitar</em> un cálculo puede salir más caro que hacerlo, porque decidir cuesta más que calcular.' }
    ],
    cierre: 'Un circuito no ahorra trabajo: reparte. Y por eso su tiempo es predecible, que es justo lo que hace falta para que un reloj pueda marcar el ritmo.'
  });

  p.comprueba('En un circuito, ¿qué le pasa a la rama de un multiplexor que no se selecciona?', [
    { t: 'Se calcula igual, y su resultado se tira', ok: true, por: 'Todas las puertas están encendidas a la vez y no hay forma de apagar un trozo. La rama no elegida se calcula entera y el multiplexor simplemente no la deja pasar. Por eso decidir no ahorra tiempo en un circuito: lo único que hace es elegir qué mirar.' },
    { t: 'No se calcula, y por eso el circuito va más rápido', ok: false, por: 'Eso es lo que hace un programa con un <code>if</code>, saltándose instrucciones. Un circuito no tiene instrucciones que saltarse: sus puertas están siempre activas.' },
    { t: 'Se calcula solo si su resultado no es cero', ok: false, por: 'Una puerta no sabe si su resultado va a usarse ni puede decidir nada: saca lo que le corresponde por sus entradas, siempre.' }
  ]);

  p.util('El multiplexor es la pieza que hace posible que un procesador tenga instrucciones. Dentro de ' +
    'la máquina hay un solo sumador, un solo comparador y una sola unidad lógica, y lo que decide ' +
    '<em>cuál</em> de sus resultados sale por el cable de salida es un multiplexor gobernado por el ' +
    'código de la instrucción. Cambiar de instrucción no cambia el circuito: cambia el cable de ' +
    'control. Eso se verá montado en [[maq-cpu|la máquina mínima]], y es lo que permite que el mismo ' +
    'trozo de silicio sume, reste o compare según lo que diga la orden.');

  p.hist('La idea de calcularlo todo y elegir después es más vieja que la electrónica. Las centrales ' +
    'telefónicas de relés de principios del siglo XX ya tenían circuitos selectores que conectaban una ' +
    'línea entre varias, y de hecho fue trabajando con relés telefónicos donde ' +
    '<strong>Claude Shannon</strong> se dio cuenta de que aquello era álgebra de Boole. El nombre ' +
    '<em>multiplexor</em> viene precisamente de las telecomunicaciones, donde multiplexar es meter ' +
    'varias señales por un mismo hilo; en un circuito lógico es lo mismo, con un cable de control que ' +
    'decide a quién le toca pasar.');

  p.trampas([
    { e: 'Creer que la rama no elegida se ahorra', por: 'Se calcula entera y se tira. En un circuito no hay instrucciones que saltar: decidir es elegir qué mirar, no qué hacer.' },
    { e: 'Confundir el cable de control con un dato', por: 'El control no se suma ni se compara con nada: solo elige. Que sea un bit como los demás no significa que haga el mismo papel.' },
    { e: 'Comparar dos números mirando el bit de menos peso primero', por: 'Decide el de <em>más</em> peso, y solo si empata se pasa al siguiente. Es el mismo orden con el que se comparan dos números decimales.' },
    { e: 'Suponer que comparar es tan barato como sumar', por: 'La igualdad sí es barata, un xnor por bit. El «mayor que» arrastra una cadena de desempates que crece con el tamaño, como el acarreo de [[maq-sumador|el sumador]].' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Qué saca el multiplexor',
    level: 'basico',
    gen: function (r) {
      var s = r.int(0, 1), x = r.int(0, 1), y = r.int(0, 1);
      return { s: s, x: x, y: y, m: s ? y : x };
    },
    ask: function (d) {
      return 'Un multiplexor con <code>x = ' + d.x + '</code>, <code>y = ' + d.y + '</code> y control ' +
        '<code>sel = ' + d.s + '</code>. ¿Qué sale?';
    },
    fields: [{ name: 'm', label: 'salida', w: 'tiny' }],
    sol: function (d) { return { m: d.m }; },
    tol: 0.1,
    errores: [{ si: function (v, d) { return d.x !== d.y && Math.abs(v.m - (d.s ? d.x : d.y)) < 0.1; }, msg: 'Has elegido la rama contraria: con <code>sel = 0</code> sale <code>x</code>, y con <code>sel = 1</code> sale <code>y</code>.' }],
    hint: function () { return 'El control a 0 deja pasar la primera entrada; a 1, la segunda.'; },
    steps: function (d) {
      return ['Con <code>sel = ' + d.s + '</code> pasa <code>' + (d.s ? 'y' : 'x') + '</code>, que vale $' + d.m + '$.',
        'La otra rama valía $' + (d.s ? d.x : d.y) + '$ y se ha calculado igual, pero no ha salido.'];
    },
    answer: function (d) { return String(d.m); }
  });

  p.exercise({
    title: 'Montar el multiplexor',
    level: 'medio',
    gen: function (r) {
      var alReves = r.bool(0.5);
      return {
        alReves: alReves,
        tabla: alReves
          ? [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 0, 0], [0, 1, 1, 1], [1, 0, 0, 0], [1, 0, 1, 0], [1, 1, 0, 1], [1, 1, 1, 1]]
          : [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 1], [1, 0, 0, 0], [1, 0, 1, 1], [1, 1, 0, 0], [1, 1, 1, 1]],
        ref: alReves
          ? 'ns = not(sel);\nva = and(x, sel);\nvb = and(y, ns);\nm = or(va, vb);'
          : 'ns = not(sel);\nva = and(x, ns);\nvb = and(y, sel);\nm = or(va, vb);'
      };
    },
    ask: function (d) {
      return 'Escribe un multiplexor con entradas <code>sel</code>, <code>x</code> e <code>y</code> y ' +
        'salida <code>m</code>, que saque <strong><code>' + (d.alReves ? 'x' : 'y') + '</code> cuando ' +
        '<code>sel</code> vale 1</strong> y la otra cuando vale 0.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige comparando la tabla.</span>';
    },
    fields: [{ name: 'n', label: 'la netlist', w: 'wide' }],
    sol: function (d) { return { n: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe la netlist.' };
      var r = W.circuitoIguales(texto, { entradas: ['sel', 'x', 'y'], salidas: ['m'], filas: d.tabla });
      if (!r.ok) return { ok: false, msg: r.porQue };
      var extra = r.puertas > 4 ? ' Lo has resuelto con ' + r.puertas + ' puertas; se puede con 4.' : ' Con ' + r.puertas + ' puertas.';
      return { ok: true, msg: 'Correcto.' + extra };
    },
    hint: function () { return 'Una rama por cada valor del control: cada una es un <code>and</code> del dato con el control (o con su negación), y al final un <code>or</code> que las junta.'; },
    steps: function (d) {
      return ['Una solución: <code>' + d.ref.replace(/\n/g, '</code>, <code>') + '</code>.',
        'Cada <code>and</code> apaga su rama cuando no le toca, y el <code>or</code> deja pasar la que quede encendida.'];
    },
    answer: function (d) { return d.ref.replace(/\n/g, ' '); }
  });

  p.exercise({
    title: 'Comparar dos números',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([4, 8, 16, 32]);
      return { n: n, xnor: n, and: 1, total: n + 1 };
    },
    ask: function (d) {
      return 'Para comprobar si dos números de $' + d.n + '$ bits son iguales, con un <code>xnor</code> ' +
        'por posición y un <code>and</code> que junte todas las comparaciones: ¿cuántas puertas hacen ' +
        'falta en total?';
    },
    fields: [{ name: 'p', label: 'puertas', w: 'tiny' }],
    sol: function (d) { return { p: d.total }; },
    dec: 0,
    errores: [{ si: function (v, d) { return Math.abs(v.p - d.n) < 0.5; }, msg: 'Te falta el <code>and</code> final, que es el que exige que coincidan <em>todas</em> las posiciones.' }],
    hint: function (d) { return 'Un <code>xnor</code> por cada uno de los ' + d.n + ' bits, y uno más que los junta.'; },
    steps: function (d) {
      return ['$' + d.n + '$ xnor, uno por posición.',
        'Más un <code>and</code> de $' + d.n + '$ entradas que exige que todas den 1.',
        'Total: $' + d.total + '$ puertas. Comparar por igualdad es barato; el «mayor que» no lo es tanto.'];
    },
    answer: function (d) { return String(d.total); }
  });

  p.exercise({
    title: 'Por qué el circuito no se ahorra nada',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'una rama del multiplexor contiene un cálculo muy caro y el control no la selecciona', v: 'igual', por: 'Se calcula igual. Las puertas están todas encendidas a la vez y no hay manera de apagar un trozo: el multiplexor solo decide qué deja pasar, no qué se calcula.' },
        { t: 'se quiere que el circuito tarde menos cuando la condición es falsa', v: 'imposible', por: 'No se puede: un circuito combinacional tarda siempre lo que tarda su camino más largo, con independencia de los datos. Esa previsibilidad es justo lo que permite que un reloj marque el ritmo.' },
        { t: 'se sustituye el multiplexor por un cable que va directo a una de las dos ramas', v: 'nodecide', por: 'Entonces ya no hay decisión ninguna: el circuito hace siempre lo mismo. El multiplexor es precisamente lo único que aporta la posibilidad de elegir.' },
        { t: 'se usa el mismo cable de control para varios multiplexores a la vez', v: 'vale', por: 'Es lo normal y lo deseable: así se elige entre dos números enteros de golpe, un multiplexor por bit y el mismo control para todos.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un circuito, ' + d.c.t + '. ¿Qué ocurre?'; },
    fields: [{ name: 'q', label: 'Ocurre que', opts: [
      { t: 'se calcula igual y se tira el resultado', v: 'igual' },
      { t: 'no se puede: el tiempo no depende de los datos', v: 'imposible' },
      { t: 'deja de haber decisión', v: 'nodecide' },
      { t: 'funciona, y es lo habitual', v: 'vale' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Recuerda lo que un circuito no puede hacer: saltarse puertas, tardar distinto según los datos o decidir qué calcular.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un circuito no tiene instrucciones que saltarse: todas sus puertas están encendidas siempre.',
    'Decidir se consigue <strong>calculándolo todo y eligiendo después</strong>, con un multiplexor: cada rama se apaga sola cuando el control no la selecciona.',
    'La rama no elegida se calcula igual y su resultado se tira. Decidir no ahorra trabajo: lo reparte.',
    'Es la misma idea que evitar el <code>if</code> en un shader con <code>mix</code>, y por el mismo motivo.',
    'Comparar por igualdad es barato: un <code>xnor</code> por bit y un <code>and</code> que los junte.',
    'El «mayor que» decide por el bit de más peso y arrastra una cadena de desempates, como el acarreo del sumador.'
  ]);
});
