/* Tema: Sumar con cables: semisumador, sumador completo y el acarreo */
Course.topic('maq-sumador', function (p) {

  p.puente('Con [[maq-puertas|las puertas]] ya se puede construir cualquier tabla, y con ' +
    '[[ar-operaciones|la suma de toda la vida]] ya sabes el procedimiento: sumar columna a columna y ' +
    'llevarse una. Este tema junta las dos cosas y monta el primer circuito que hace algo reconocible.');

  p.text('Sumar en binario es más fácil que en decimal, porque solo hay cuatro casos: $0+0$, $0+1$, ' +
    '$1+0$ y $1+1$. Los tres primeros dan lo que uno espera. El cuarto da $10$: <strong>cero, y me ' +
    'llevo una</strong>. Todo el circuito sale de ahí.');

  /* ---------------------------------------------------------------- */
  p.section('El semisumador');

  p.text('Mira la tabla de esos cuatro casos separando lo que se escribe de lo que se lleva:');

  p.table(['a', 'b', 'suma', 'me llevo'],
    [['0', '0', '0', '0'],
     ['0', '1', '1', '0'],
     ['1', '0', '1', '0'],
     ['1', '1', '0', '1']]);

  p.text('La columna de la <strong>suma</strong> vale 1 cuando las entradas son distintas: eso es un ' +
    '<code>xor</code>. La del <strong>acarreo</strong> vale 1 solo cuando las dos son 1: eso es un ' +
    '<code>and</code>. Dos puertas, y la suma de un bit está hecha.');

  p.demo({
    title: 'El semisumador, entero',
    intro: 'Dos puertas y ya suma. Prueba las cuatro combinaciones con los conmutadores y compáralas con la tabla de arriba: son la misma.',
    predice: 'Con a y b a 1, la suma escribe 0 y se lleva 1. ¿Qué puerta hace cada una de las dos cosas?',
    build: function (host) {
      W.circuito(host, {
        id: 'sum-medio', alto: 190,
        texto: 's = xor(a, b);\nllevo = and(a, b);',
        aria: 'Semisumador: un xor para la suma y un and para el acarreo.',
        nota: 'Se llama <em>semi</em>sumador porque le falta algo: no sabe recibir un acarreo de la columna anterior.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Por qué no basta');

  p.text('Ese circuito sirve para la columna de la derecha del todo y para ninguna más. En cuanto se ' +
    'suman números de varios bits, cada columna recibe <strong>tres</strong> cosas: los dos bits que ' +
    'le tocan y el acarreo que le llega de la columna anterior. Hace falta un sumador que acepte tres ' +
    'entradas, y se le llama <strong>sumador completo</strong>.');

  p.text('Se construye con dos semisumadores encadenados: el primero suma $a$ y $b$, el segundo suma a ' +
    'ese resultado el acarreo que entra, y el acarreo de salida es 1 si <em>cualquiera</em> de los dos ' +
    'pasos se llevó una.');

  p.demo({
    title: 'El sumador completo',
    intro: 'Tres entradas: los dos bits y el acarreo que llega. Comprueba en la tabla que con tres unos la suma es 1 y se lleva 1, que es lo que dice la aritmética: tres son «uno y me llevo uno».',
    predice: 'Con a=1, b=1 y cin=1 se están sumando tres unos. ¿Qué debería escribir y qué debería llevarse?',
    build: function (host) {
      W.circuito(host, {
        id: 'sum-completo', alto: 250,
        texto: 'p = xor(a, b);\n' +
               's = xor(p, cin);\n' +
               'g = and(a, b);\n' +
               'h = and(p, cin);\n' +
               'cout = or(g, h);',
        aria: 'Sumador completo: dos xor para la suma, dos and y un or para el acarreo de salida.',
        nota: 'Cinco puertas. El cable <code>g</code> es «los dos bits eran 1, así que se genera acarreo»; el cable <code>h</code> es «pasaba uno y lo dejo pasar».'
      });
    }
  });

  p.note('Esos dos cables tienen nombre propio y explican lo que viene después. El acarreo se ' +
    '<strong>genera</strong> cuando $a$ y $b$ valen los dos 1, sin depender de nada anterior; y se ' +
    '<strong>propaga</strong> cuando uno de los dos vale 1 y el otro no, en cuyo caso la columna deja ' +
    'pasar el acarreo que le llegue. Generar es instantáneo. Propagar es lo que cuesta tiempo.',
    'ok', 'Generar y propagar');

  /* ---------------------------------------------------------------- */
  p.section('Encadenarlos, y el precio de hacerlo');

  p.text('Para sumar números de $n$ bits se ponen $n$ sumadores completos en fila, y el acarreo de ' +
    'salida de cada uno entra en el siguiente. Eso funciona y es lo que se hizo durante décadas. Pero ' +
    'tiene un problema que se puede <em>ver</em>, y es la razón de que este simulador avance por ' +
    'instantes en vez de resolverlo todo de golpe.');

  p.demo({
    title: 'Ver viajar el acarreo',
    intro: 'Un sumador de cuatro bits sumando 0001 + 1111. Pulsa «Un instante» varias veces y mira el aviso: el resultado no aparece de golpe, va apareciendo de derecha a izquierda según el acarreo se abre paso. Pulsa «Estabilizar» para ver cuántos instantes ha tardado en total.',
    predice: 'Esa suma da 10000: todos los bits del resultado cambian. ¿Crees que el circuito lo calcula de una vez o que tarda más que sumando 0000 + 0000?',
    build: function (host) {
      var L = [], i;
      for (i = 0; i < 4; i++) {
        var cin = (i === 0) ? 'c0' : ('c' + i);
        L.push('p' + i + ' = xor(a' + i + ', b' + i + ');');
        L.push('s' + i + ' = xor(p' + i + ', ' + cin + ');');
        L.push('g' + i + ' = and(a' + i + ', b' + i + ');');
        L.push('h' + i + ' = and(p' + i + ', ' + cin + ');');
        L.push('c' + (i + 1) + ' = or(g' + i + ', h' + i + ');');
      }
      W.circuito(host, {
        id: 'sum-cadena', alto: 330, tope: 120,
        texto: L.join('\n'),
        aria: 'Sumador de cuatro bits con el acarreo encadenado de una etapa a la siguiente.',
        nota: 'Pon <code>a0</code> a 1 y los cuatro <code>b</code> a 1, con <code>c0</code> a 0: es el peor caso, el que obliga al acarreo a cruzar el circuito entero.'
      });
    }
  });

  p.note('La medida, hecha sobre este mismo circuito: sumando el peor caso —$0\\ldots01 + 1\\ldots11$, ' +
    'donde el acarreo tiene que cruzarlo todo— tarda <strong>2 instantes por bit</strong>. Con 1 bit, ' +
    '2 instantes; con 4, 8; con 8, 16; con 12, 24. <strong>Doblar el ancho dobla la espera.</strong> Y ' +
    'con las dos entradas a cero se estabiliza en 0 instantes: el acarreo solo cuesta cuando tiene que ' +
    'viajar.', 'ok', 'Lo que tarda, medido');

  p.text('Esa es la razón de que el acarreo sea el cuello de botella de un procesador. El reloj no puede ' +
    'ir más rápido que el camino más lento del circuito, y en un sumador encadenado ese camino crece ' +
    'con el número de bits. Por eso los procesadores de verdad no encadenan: usan circuitos que ' +
    '<strong>calculan por adelantado</strong> si cada columna va a recibir acarreo, mirando a la vez ' +
    'todas las anteriores. Cuestan muchas más puertas y son mucho más rápidos, que es el intercambio ' +
    'de siempre.');

  p.ejemplo({
    title: 'Sumar dos números de cuatro bits a mano',
    enunciado: 'Sumar $0110$ y $1011$ con el método de las columnas, anotando el acarreo de cada paso, y decir cuántos sumadores completos harían falta.',
    pasos: [
      { t: '<strong>Columna 0 (la derecha).</strong> $0 + 1$ sin acarreo de entrada: escribe 1, no se lleva nada.', antes: 'Empieza por la derecha, como siempre.' },
      { t: '<strong>Columna 1.</strong> $1 + 1 + 0 = 10$: escribe 0 y se lleva 1.', antes: 'Dos unos son «cero y me llevo una».' },
      { t: '<strong>Columna 2.</strong> $1 + 0 + 1$ (el acarreo que llega) $= 10$: escribe 0 y se lleva 1.' },
      { t: '<strong>Columna 3.</strong> $0 + 1 + 1 = 10$: escribe 0 y se lleva 1.' },
      { t: '<strong>El resultado.</strong> Queda $10001$, con el acarreo final como quinto bit. En decimal: $6 + 11 = 17$, y $10001_2 = 17$.' },
      { t: '<strong>El circuito.</strong> Cuatro columnas, cuatro sumadores completos, cinco puertas cada uno: <strong>20 puertas</strong>. Y en el peor caso, 8 instantes de espera.' }
    ],
    cierre: 'Si los cuatro bits del resultado hubieran salido a la vez, la suma habría sido instantánea. No lo es porque la columna 3 no puede decidir nada hasta que la 2 le diga qué acarreo le llega.'
  });

  p.comprueba('¿Por qué un sumador encadenado de 32 bits es más lento que uno de 8, si las puertas son las mismas?', [
    { t: 'Porque el acarreo tiene que atravesar más etapas, y cada una espera a la anterior', ok: true, por: 'El número de puertas crece proporcionalmente, pero lo que fija la velocidad es la <em>profundidad</em>: el camino más largo que tiene que recorrer una señal. En el peor caso el acarreo cruza las 32 etapas una detrás de otra, y ninguna puede decidir antes que la anterior.' },
    { t: 'Porque tiene cuatro veces más puertas y cada puerta tarda', ok: false, por: 'Las puertas que no dependen unas de otras trabajan a la vez, así que tener más no tiene por qué tardar más. Lo que cuenta es la cadena más larga, no el total.' },
    { t: 'Porque los números de 32 bits son más grandes y hay más que sumar', ok: false, por: 'El tamaño del número no cansa al circuito: cada columna hace exactamente el mismo trabajo. El problema es el orden en que pueden hacerlo.' }
  ]);

  p.util('Este circuito está dentro de todo lo que cuenta. Y su retardo es una de las cosas que fija la ' +
    'frecuencia de reloj de un procesador: el reloj tiene que ser lo bastante lento para que la señal ' +
    'más lenta llegue a tiempo, así que <strong>el camino crítico decide los gigahercios</strong>. Por ' +
    'eso se invierten tantas puertas en anticipar el acarreo en vez de encadenarlo: no se gana en lo ' +
    'que cuesta el chip, se gana en lo rápido que puede ir el reloj. Es el mismo intercambio que ' +
    'aparece en cualquier optimización: más espacio a cambio de menos tiempo.');

  p.hist('Que el acarreo era el problema se sabía antes de que existieran los circuitos. ' +
    '<strong>Charles Babbage</strong>, diseñando su máquina analítica en el siglo XIX, se dio cuenta ' +
    'de que llevarse una cifra de rueda en rueda era lo que más frenaba la máquina, y diseñó un ' +
    'mecanismo que llamó <em>anticipating carriage</em>, el carro anticipador, para resolver todos los ' +
    'acarreos de una pasada en vez de uno detrás de otro. Es exactamente la misma idea que hoy se ' +
    'llama anticipación de acarreo y que llevan los procesadores, pensada con engranajes y un siglo ' +
    'antes de que hubiera un transistor.');

  p.trampas([
    { e: 'Usar un semisumador para todas las columnas', por: 'Solo vale para la de más a la derecha. Las demás reciben un acarreo de entrada, y sin él la suma sale mal desde la segunda columna.' },
    { e: 'Creer que más puertas es siempre más lento', por: 'Las puertas independientes trabajan a la vez. Lo que fija la velocidad es la profundidad del camino más largo, no cuántas hay.' },
    { e: 'Olvidar el acarreo final', por: 'Sumar dos números de $n$ bits puede dar $n+1$ bits. Si no se guarda ese último acarreo, el resultado se desborda en silencio, como en [[maq-bits|el tema anterior]].' },
    { e: 'Pensar que el sumador resta también', por: 'Resta, pero no por sí solo: hay que negar el segundo número en [[maq-bits|complemento a dos]] y sumarlo. El circuito de sumar es el mismo; lo que se añade es la inversión.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Una columna del sumador',
    level: 'basico',
    gen: function (r) {
      var a = r.int(0, 1), b = r.int(0, 1), c = r.int(0, 1);
      var t = a + b + c;
      return { a: a, b: b, c: c, s: t % 2, co: t >= 2 ? 1 : 0, t: t };
    },
    ask: function (d) {
      return 'Un sumador completo recibe <code>a = ' + d.a + '</code>, <code>b = ' + d.b + '</code> y un ' +
        'acarreo de entrada <code>cin = ' + d.c + '</code>. ¿Qué escribe y qué se lleva?';
    },
    fields: [{ name: 's', label: 'suma', w: 'tiny' }, { name: 'c', label: 'se lleva', w: 'tiny' }],
    sol: function (d) { return { s: d.s, c: d.co }; },
    tol: 0.1,
    errores: [{ si: function (v, d) { return d.t !== d.s && Math.abs(v.s - d.t) < 0.1; }, msg: 'Has escrito el total sin separarlo. En una columna solo cabe un bit: el resto se lleva a la siguiente.' }],
    hint: function () { return 'Suma los tres y escribe el resultado en binario: la cifra de la derecha es la suma y la otra es lo que te llevas.'; },
    steps: function (d) {
      return ['$' + d.a + ' + ' + d.b + ' + ' + d.c + ' = ' + d.t + '$, que en binario es $' + d.t.toString(2) + '$.',
        'Se escribe $' + d.s + '$ y se lleva $' + d.co + '$.',
        d.t === 3 ? 'Tres unos son «uno y me llevo uno»: por eso hacen falta las dos salidas.'
          : 'La suma es el xor de los tres, y el acarreo sale si hay al menos dos unos.'];
    },
    answer: function (d) { return d.s + ' y se lleva ' + d.co; }
  });

  p.exercise({
    title: 'Sumar dos números',
    level: 'basico',
    gen: function (r) {
      var n = r.int(3, 4);
      var a = r.int(1, Math.pow(2, n) - 1), b = r.int(1, Math.pow(2, n) - 1);
      function bin(x, k) { var s = x.toString(2); while (s.length < k) s = '0' + s; return s; }
      return { n: n, a: a, b: b, sa: bin(a, n), sb: bin(b, n), suma: a + b, sres: bin(a + b, n + 1) };
    },
    ask: function (d) {
      return 'Suma en binario <code>' + d.sa + '</code> y <code>' + d.sb + '</code>. Escribe el ' +
        'resultado con ' + (d.n + 1) + ' bits, incluyendo el acarreo final.';
    },
    fields: [{ name: 'r', label: 'resultado', w: 'small' }],
    sol: function (d) { return { r: d.sres }; },
    check: function (v, d) {
      var t = String(v.raw.r || '').replace(/[^01]/g, '');
      if (!t) return { ok: false, msg: 'Escribe el resultado en binario.' };
      if (parseInt(t, 2) === d.suma) return { ok: true };
      return { ok: false, msg: 'En decimal sería $' + d.a + ' + ' + d.b + ' = ' + d.suma + '$, y te sale $' + parseInt(t, 2) + '$.' };
    },
    hint: function (d) { return 'Columna a columna de derecha a izquierda, llevándote una cuando la columna da 2 o 3. En decimal es $' + d.a + ' + ' + d.b + '$.'; },
    steps: function (d) {
      return ['$' + d.sa + '$ es $' + d.a + '$ y $' + d.sb + '$ es $' + d.b + '$.',
        'La suma es $' + d.suma + '$, que en binario con ' + (d.n + 1) + ' bits es $' + d.sres + '$.',
        'El bit de más a la izquierda es el acarreo que sale de la última columna.'];
    },
    answer: function (d) { return d.sres; }
  });

  p.exercise({
    title: 'Montar el semisumador',
    level: 'medio',
    gen: function (r) {
      var cual = r.pick(['suma', 'acarreo']);
      return {
        cual: cual,
        tabla: cual === 'suma'
          ? [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]]
          : [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]],
        ref: cual === 'suma' ? 'y = xor(a, b);' : 'y = and(a, b);'
      };
    },
    ask: function (d) {
      return 'Escribe la netlist de la salida <strong>' + (d.cual === 'suma' ? 'de suma' : 'de acarreo') +
        '</strong> de un semisumador, con entradas <code>a</code> y <code>b</code> y salida <code>y</code>.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige comparando la tabla: ' +
        'vale cualquier circuito equivalente.</span>';
    },
    fields: [{ name: 'n', label: 'la netlist', w: 'wide' }],
    sol: function (d) { return { n: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe la netlist, por ejemplo <code>y = and(a, b);</code>.' };
      var r = W.circuitoIguales(texto, { entradas: ['a', 'b'], salidas: ['y'], filas: d.tabla });
      if (!r.ok) return { ok: false, msg: r.porQue };
      return { ok: true, msg: 'Correcto, con ' + r.puertas + ' ' + U.plural(r.puertas, 'puerta', 'puertas') + '.' };
    },
    hint: function (d) {
      return d.cual === 'suma'
        ? 'La suma vale 1 cuando las entradas son <em>distintas</em>.'
        : 'El acarreo vale 1 solo cuando las <em>dos</em> valen 1.';
    },
    steps: function (d) {
      return ['La respuesta es <code>' + d.ref + '</code>.',
        d.cual === 'suma' ? 'Distintas: eso es exactamente el xor.' : 'Las dos a 1: eso es el and.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Cuánto cuesta y cuánto tarda',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([4, 8, 16, 32, 64]);
      return { n: n, puertas: 5 * n, instantes: 2 * n };
    },
    ask: function (d) {
      return 'Un sumador encadenado de $' + d.n + '$ bits, con cinco puertas por columna. ¿Cuántas ' +
        'puertas tiene en total, y cuántos instantes tarda en el peor caso, si cada columna añade dos?';
    },
    fields: [{ name: 'p', label: 'puertas', w: 'tiny' }, { name: 'i', label: 'instantes', w: 'tiny' }],
    sol: function (d) { return { p: d.puertas, i: d.instantes }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { return Math.abs(v.i - d.puertas) < 0.5 && d.puertas !== d.instantes; }, msg: 'Has contado puertas donde se pedían instantes. Las puertas que no dependen unas de otras trabajan a la vez: lo que tarda es la cadena más larga, no el total.' }],
    hint: function (d) { return 'Las puertas son cinco por columna. El retardo es el que impone el acarreo, que atraviesa una columna detrás de otra.'; },
    steps: function (d) {
      return ['Puertas: $5 \\times ' + d.n + ' = ' + d.puertas + '$.',
        'Instantes en el peor caso: $2 \\times ' + d.n + ' = ' + d.instantes + '$.',
        'Fíjate en que las dos crecen con $n$, pero por motivos distintos: las puertas por cantidad y los instantes por profundidad. Lo que limita el reloj es lo segundo.'];
    },
    answer: function (d) { return d.puertas + ' puertas y ' + d.instantes + ' instantes'; }
  });

  p.exercise({
    title: 'Generar, propagar o nada',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(0, 1), b = r.int(0, 1);
      var v = (a && b) ? 'genera' : ((a !== b) ? 'propaga' : 'nada');
      var por = {
        genera: 'Con las dos entradas a 1 la columna produce acarreo ella sola, llegue lo que llegue de la anterior. No tiene que esperar a nadie.',
        propaga: 'Con una a 1 y otra a 0, la columna no genera acarreo pero deja pasar el que le llegue. Es el caso que obliga a esperar, y el que hace lento al sumador encadenado.',
        nada: 'Con las dos a 0 no sale acarreo pase lo que pase: la cadena se corta aquí y las columnas siguientes no tienen que esperar a esta.'
      };
      return { a: a, b: b, v: v, por: por[v] };
    },
    ask: function (d) {
      return 'En una columna del sumador, <code>a = ' + d.a + '</code> y <code>b = ' + d.b + '</code>. ' +
        '¿Esa columna genera acarreo, lo propaga, o ni una cosa ni otra?';
    },
    fields: [{ name: 'q', label: 'Esa columna', opts: [
      { t: 'genera acarreo por sí sola', v: 'genera' },
      { t: 'propaga el que le llegue', v: 'propaga' },
      { t: 'no saca acarreo pase lo que pase', v: 'nada' }
    ] }],
    sol: function (d) { return { q: d.v }; },
    hint: function () { return 'Genera si las dos valen 1; propaga si una vale 1 y la otra 0; y con las dos a 0 no sale acarreo de ninguna manera.'; },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return d.v; }
  });

  p.keys([
    'Sumar un bit son dos puertas: la suma es un <code>xor</code> y el acarreo un <code>and</code>. Eso es el semisumador.',
    'Solo sirve para la columna de la derecha: las demás reciben acarreo, y para eso hace falta el sumador completo, de cinco puertas.',
    'Una columna <strong>genera</strong> acarreo si sus dos bits son 1, y lo <strong>propaga</strong> si uno vale 1 y el otro 0. Generar es instantáneo; propagar es lo que cuesta.',
    'Encadenando sumadores, el peor caso tarda <strong>dos instantes por bit</strong>: doblar el ancho dobla la espera.',
    'Lo que fija la velocidad de un circuito es la profundidad del camino más largo, no el número de puertas: las independientes trabajan a la vez.',
    'Por eso los procesadores anticipan el acarreo en vez de encadenarlo: muchas más puertas a cambio de un reloj más rápido.'
  ]);
});
