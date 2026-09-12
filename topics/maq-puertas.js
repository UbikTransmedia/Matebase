/* Tema: La puerta lógica: una tabla de verdad hecha de cables */
Course.topic('maq-puertas', function (p) {

  p.puente('En [[lg-proposiciones|el primer tema del curso]] rellenaste tablas de verdad, y allí se decía ' +
    'de pasada que una tabla de verdad es el plano de un circuito. Este tema es el cobro de esa ' +
    'promesa: las mismas conectivas, ahora con corriente, y un banco donde montarlas. De ' +
    '[[maq-bits|los bits]] viene lo único que hace falta saber: que un cable está a 1 o a 0.');

  p.text('Una <strong>puerta lógica</strong> es un trozo de circuito con unas entradas y una salida, y ' +
    'lo único que hay que saber de ella es qué saca para cada combinación de entradas. Eso es una ' +
    'tabla de verdad. No hay ninguna diferencia entre la conectiva de la lógica y la puerta del ' +
    'circuito: <strong>son el mismo objeto</strong>, una escrita con símbolos y otra con cables.');

  /* ---------------------------------------------------------------- */
  p.section('El banco de pruebas');

  p.text('En este bloque los circuitos se escriben, no se dibujan a mano. Cada línea es una puerta, con ' +
    'el nombre del cable que sale a la izquierda del igual. Los nombres que se usan y nunca se ' +
    'definen son las <strong>entradas</strong>; los que se definen y nadie consume, las ' +
    '<strong>salidas</strong>.');

  p.demo({
    title: 'Una puerta, y su tabla',
    intro: 'Cambia la puerta de la primera línea por and, or, nand, nor, xor o xnor, y mira cómo cambia la tabla. Los conmutadores de debajo prueban una combinación concreta, y el dibujo enciende los cables que están a 1.',
    predice: 'La puerta «or» saca 1 si alguna entrada vale 1. ¿En cuántas de las cuatro filas de su tabla crees que saldrá 1?',
    build: function (host) {
      W.circuito(host, {
        id: 'puertas-una', alto: 190,
        texto: 'y = and(a, b);',
        aria: 'Una puerta con dos entradas, a y b, y una salida y.',
        nota: 'Prueba también <code>not</code>, que lleva una sola entrada: <code>y = not(a);</code>.'
      });
    }
  });

  p.table(['Puerta', 'Saca 1 cuando', 'Se lee'],
    [['<code>and</code>', 'todas las entradas valen 1', '«y»'],
     ['<code>or</code>', 'alguna entrada vale 1', '«o», y es el o inclusivo: con las dos también'],
     ['<code>not</code>', 'la entrada vale 0', '«no»'],
     ['<code>xor</code>', 'las entradas son distintas', '«o exclusivo»: una o la otra, pero no las dos'],
     ['<code>nand</code>', 'no todas valen 1', '«no y»: el and negado'],
     ['<code>nor</code>', 'ninguna vale 1', '«no o»: el or negado']]);

  p.note('El <code>xor</code> merece un párrafo porque es el que más aparece: saca 1 cuando las entradas ' +
    '<strong>son distintas</strong>. Visto de otra forma, es <em>la suma sin acarreo</em>: ' +
    '$0+0=0$, $0+1=1$, $1+0=1$ y $1+1=0$ llevándose una. Esa lectura es la que hará falta en ' +
    '[[maq-sumador|el tema siguiente]].', 'ok', 'Qué es de verdad el o exclusivo');

  /* ---------------------------------------------------------------- */
  p.section('Con una sola basta');

  p.text('Y aquí llega el resultado que sorprende. No hacen falta seis puertas distintas, ni tres: ' +
    '<strong>con la <code>nand</code> sola se construyen todas las demás</strong>. Y no es un juego de ' +
    'ingenio, es la razón de que los chips se fabriquen así: una sola pieza repetida sale más barata ' +
    'que seis piezas distintas.');

  p.formulas([
    '\\text{no } a = \\text{nand}(a, a)',
    'a \\text{ y } b = \\text{nand}\\bigl(\\text{nand}(a,b),\\ \\text{nand}(a,b)\\bigr)',
    'a \\text{ o } b = \\text{nand}\\bigl(\\text{nand}(a,a),\\ \\text{nand}(b,b)\\bigr)'
  ], 'las tres puertas de siempre, hechas solo con nand');

  p.text('La primera se entiende sola: darle a la <code>nand</code> el mismo cable dos veces la convierte ' +
    'en una negación, porque «no (a y a)» es «no a». La segunda es negar la negación. Y la tercera es ' +
    '[[lg-proposiciones|la ley de De Morgan]] escrita con cables: «a o b» es «no (no a y no b)».');

  p.demo({
    title: 'Todo con nand',
    intro: 'Las tres construcciones, montadas. Comprueba en la tabla que la columna «no_a» es la negación de a, que «a_y_b» coincide con and y que «a_o_b» coincide con or.',
    predice: 'Si «nand» es «and negado», ¿qué crees que hace darle el mismo cable por las dos entradas?',
    build: function (host) {
      W.circuito(host, {
        id: 'puertas-nand', alto: 260,
        texto: 'no_a = nand(a, a);\n' +
               'p = nand(a, b);\n' +
               'a_y_b = nand(p, p);\n' +
               'na = nand(a, a);\n' +
               'nb = nand(b, b);\n' +
               'a_o_b = nand(na, nb);',
        aria: 'Tres circuitos hechos solo con puertas nand: una negación, un and y un or.',
        nota: 'Seis nand para tres puertas. Un chip de verdad hace exactamente esto, millones de veces.'
      });
    }
  });

  p.note('Que una sola puerta baste tiene nombre: se dice que la <code>nand</code> es ' +
    '<strong>funcionalmente completa</strong>. La <code>nor</code> también lo es, ella sola. Ninguna ' +
    'otra de la tabla lo consigue: con <code>and</code>, <code>or</code> y <code>xor</code> por ' +
    'separado no se puede fabricar una negación, y sin negación no se llega a todas las tablas.',
    'ok', 'Cómo se llama eso');

  p.ejemplo({
    title: 'Un xor a partir de nand',
    enunciado: 'Construir un <code>xor</code> usando solo puertas <code>nand</code>, y contar cuántas hacen falta.',
    pasos: [
      { t: '<strong>Qué hay que conseguir.</strong> El xor saca 1 cuando las entradas son distintas: la tabla es $00\\to0$, $01\\to1$, $10\\to1$, $11\\to0$.', antes: 'Escribe la tabla que hay que reproducir antes de montar nada.' },
      { t: '<strong>La pieza central.</strong> Se empieza por $p = \\text{nand}(a,b)$, que vale 0 solo cuando las dos son 1.', antes: '¿Qué combinación distingue $p$ de las demás?' },
      { t: '<strong>Las dos ramas.</strong> $q = \\text{nand}(a,p)$ y $r = \\text{nand}(b,p)$. Cada una mira una entrada junto a esa pieza central.' },
      { t: '<strong>El remate.</strong> $y = \\text{nand}(q,r)$. En total, <strong>cuatro nand</strong>.' },
      { t: '<strong>La comprobación.</strong> Con $a=1, b=1$: $p=0$, luego $q=\\text{nand}(1,0)=1$ y $r=\\text{nand}(1,0)=1$, y $y=\\text{nand}(1,1)=0$. Con $a=1, b=0$: $p=1$, $q=\\text{nand}(1,1)=0$, $r=\\text{nand}(0,1)=1$, y $y=\\text{nand}(0,1)=1$. Las dos filas salen.' }
    ],
    cierre: 'Cuatro puertas para algo que en la tabla ocupa una línea. Contar puertas es la manera de comparar dos circuitos que hacen lo mismo, y en este bloque se hace a menudo.'
  });

  p.comprueba('¿Por qué con puertas <code>and</code> y <code>or</code> solamente, sin negación, no se pueden construir todas las tablas de verdad?', [
    { t: 'Porque con las dos entradas a 0 siempre sale 0, y hay tablas que piden 1 ahí', ok: true, por: 'Tanto <code>and</code> como <code>or</code> devuelven 0 si todas sus entradas son 0. Encadenándolas, un circuito hecho solo con ellas sacará siempre 0 cuando todas las entradas valgan 0, así que jamás podrá reproducir una tabla que pida 1 en esa fila.' },
    { t: 'Porque no se pueden encadenar más de dos niveles', ok: false, por: 'Se pueden encadenar cuantos niveles se quiera: el problema no es la profundidad sino que ninguna de las dos sabe convertir un 0 en un 1.' },
    { t: 'Porque el <code>or</code> es inclusivo y haría falta el exclusivo', ok: false, por: 'El xor tampoco lo arregla: también saca 0 con todas las entradas a 0. Lo que falta es exactamente la negación.' }
  ]);

  p.util('El <code>xor</code> es el que detecta errores en casi todo lo que transmite datos. Se añade a ' +
    'cada grupo de bits uno más, el <strong>bit de paridad</strong>, que es el xor de todos los ' +
    'demás; así el número de unos queda siempre par. Si por el camino se estropea un bit, la cuenta ' +
    'deja de cuadrar y el receptor sabe que ese dato viene mal. Es un circuito de xores encadenados y ' +
    'nada más, y va dentro de memorias, discos y líneas de comunicación. Con un solo bit de paridad se ' +
    'detecta un error, pero no se sabe cuál: para corregir hacen falta más, que es de lo que trata ' +
    '[[av-informacion|la corrección de errores]].');

  p.hist('Que una sola puerta bastara para todo lo demostró <strong>Henry Sheffer</strong> en 1913, en ' +
    'un artículo sobre los postulados del álgebra de Boole: por eso a la <code>nand</code> se la llama ' +
    'a veces «barra de Sheffer». Charles Sanders Peirce había llegado a lo mismo unos treinta años ' +
    'antes, pero su trabajo se quedó sin publicar hasta 1933 y nadie se enteró a tiempo. Ninguno de ' +
    'los dos pensaba en circuitos: eran resultados sobre lógica pura, hechos décadas antes de que ' +
    'existiera algo donde enchufarlos. Cuando llegó el momento de fabricar chips, aquella rareza ' +
    'resultó ser la manera más barata de hacerlos.');

  p.trampas([
    { e: 'Leer el <code>or</code> como «uno u otro pero no los dos»', por: 'Ese es el <code>xor</code>. El <code>or</code> de la lógica y el de los circuitos es inclusivo: con las dos entradas a 1 también saca 1.' },
    { e: 'Creer que <code>nand</code> es «and, y luego ya negaré»', por: 'Es una sola puerta, no dos. Y justamente por ser una sola es la que se fabrica: negar después costaría otra.' },
    { e: 'Pensar que hacen falta las seis puertas', por: 'Con <code>nand</code> sola se construyen todas. Las otras existen porque escribir con ellas es más cómodo, no porque sean necesarias.' },
    { e: 'Contar las puertas mirando las líneas de la netlist', por: 'Una línea puede ser solo un cable con nombre nuevo, que no cuesta nada. Lo que se cuenta son las puertas.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Leer la salida de un circuito',
    level: 'basico',
    gen: function (r) {
      var g = r.pick(['and', 'or', 'nand', 'nor', 'xor', 'xnor']);
      var a = r.int(0, 1), b = r.int(0, 1);
      var f = {
        and: (a && b) ? 1 : 0, or: (a || b) ? 1 : 0,
        nand: (a && b) ? 0 : 1, nor: (a || b) ? 0 : 1,
        xor: (a !== b) ? 1 : 0, xnor: (a === b) ? 1 : 0
      };
      return { g: g, a: a, b: b, y: f[g] };
    },
    ask: function (d) {
      return 'El circuito es <code>y = ' + d.g + '(a, b);</code> y las entradas valen ' +
        '<code>a = ' + d.a + '</code> y <code>b = ' + d.b + '</code>. ¿Cuánto vale <code>y</code>?';
    },
    fields: [{ name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { y: d.y }; },
    tol: 0.1,
    hint: function (d) {
      var t = { and: 'saca 1 solo si las dos valen 1', or: 'saca 1 si alguna vale 1',
        nand: 'es el and negado', nor: 'es el or negado',
        xor: 'saca 1 si son distintas', xnor: 'saca 1 si son iguales' };
      return 'La puerta <code>' + d.g + '</code> ' + t[d.g] + '.';
    },
    steps: function (d) {
      return ['Con $a = ' + d.a + '$ y $b = ' + d.b + '$, la puerta <code>' + d.g + '</code> saca $' + d.y + '$.',
        d.g === 'xor' || d.g === 'xnor'
          ? 'Estas dos solo miran si las entradas son iguales o distintas, no cuántos unos hay.'
          : 'Y su versión negada sacaría $' + (d.y ? 0 : 1) + '$.'];
    },
    answer: function (d) { return String(d.y); }
  });

  p.exercise({
    title: 'Construir una tabla con puertas',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'saque 1 solo cuando las dos entradas valgan 1', tabla: [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]], ref: 'y = and(a, b);', min: 1 },
        { t: 'saque 1 cuando las entradas sean distintas', tabla: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]], ref: 'y = xor(a, b);', min: 1 },
        { t: 'saque 1 solo cuando las dos valgan 0', tabla: [[0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 0]], ref: 'y = nor(a, b);', min: 1 },
        { t: 'saque 1 cuando a valga 1 y b valga 0', tabla: [[0, 0, 0], [0, 1, 0], [1, 0, 1], [1, 1, 0]], ref: 'nb = not(b);\ny = and(a, nb);', min: 2 },
        { t: 'saque 1 cuando las entradas sean iguales', tabla: [[0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1]], ref: 'y = xnor(a, b);', min: 1 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe una netlist con entradas <code>a</code> y <code>b</code> y una salida, que ' +
        d.c.t + '.<br><pre class="shd__mini">y = ???;</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige comparando la tabla de ' +
        'verdad: vale cualquier circuito equivalente.</span>';
    },
    fields: [{ name: 'n', label: 'la netlist', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea, como <code>y = and(a, b);</code>.' };
      var r = W.circuitoIguales(texto, { entradas: ['a', 'b'], salidas: ['y'], filas: d.c.tabla });
      if (!r.ok) return { ok: false, msg: r.porQue };
      var extra = r.puertas > d.c.min
        ? ' Lo has resuelto con ' + r.puertas + ' puertas; se puede con ' + d.c.min + '.'
        : ' Y con el mínimo de puertas: ' + r.puertas + '.';
      return { ok: true, msg: 'Correcto.' + extra };
    },
    hint: function () { return 'Las puertas disponibles son <code>not and or xor nand nor xnor</code>. Si hace falta negar una entrada, dale nombre en una línea aparte: <code>nb = not(b);</code>.'; },
    steps: function (d) {
      return ['Una solución: <code>' + d.c.ref.replace(/\n/g, '</code> y <code>') + '</code>.',
        'Cuesta ' + d.c.min + ' ' + U.plural(d.c.min, 'puerta', 'puertas') + '.',
        'Cualquier circuito con la misma tabla vale, aunque use otras puertas.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.exercise({
    title: 'Solo con nand',
    level: 'medio',
    gen: function (r) {
      /* Cada caso declara SUS entradas: la negación usa sólo `a`, y exigirle
         que aparezca `b` haría imposible la propia solución de referencia. */
      var casos = [
        { t: 'una negación de <code>a</code>', ent: ['a'], tabla: [[0, 1], [1, 0]], ref: 'y = nand(a, a);', min: 1 },
        { t: 'un <code>and</code> de <code>a</code> y <code>b</code>', ent: ['a', 'b'], tabla: [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]], ref: 'p = nand(a, b);\ny = nand(p, p);', min: 2 },
        { t: 'un <code>or</code> de <code>a</code> y <code>b</code>', ent: ['a', 'b'], tabla: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]], ref: 'na = nand(a, a);\nnb = nand(b, b);\ny = nand(na, nb);', min: 3 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Construye ' + d.c.t + ' <strong>usando solo puertas <code>nand</code></strong>, con la ' +
        'salida llamada <code>y</code> y ' +
        (d.c.ent.length === 1 ? 'una única entrada <code>a</code>.' : 'las entradas <code>a</code> y <code>b</code>.') +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige comparando la tabla.</span>';
    },
    fields: [{ name: 'n', label: 'la netlist', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe la netlist.' };
      if (/\b(and|or|not|xor|nor|xnor)\s*\(/i.test(texto.replace(/nand\s*\(/gi, ''))) {
        return { ok: false, msg: 'Aquí solo vale <code>nand</code>. Recuerda que <code>nand(a, a)</code> niega.' };
      }
      var r = W.circuitoIguales(texto, { entradas: d.c.ent, salidas: ['y'], filas: d.c.tabla });
      if (!r.ok) return { ok: false, msg: r.porQue };
      return { ok: true, msg: 'Correcto, con ' + r.puertas + ' ' + U.plural(r.puertas, 'nand', 'nand') + '.' };
    },
    hint: function () { return '<code>nand(x, x)</code> es la negación de <code>x</code>. Con eso y una nand más se llega a casi todo.'; },
    steps: function (d) {
      return ['Solución: <code>' + d.c.ref.replace(/\n/g, '</code>, <code>') + '</code>.',
        'Son ' + d.c.min + ' ' + U.plural(d.c.min, 'puerta', 'puertas') + '.',
        'La clave siempre es la misma: <code>nand(x, x)</code> hace de negación.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.exercise({
    title: 'Cuántas filas y cuántas tablas',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(2, 5);
      return { n: n, filas: Math.pow(2, n), tablas: Math.pow(2, Math.pow(2, n)) };
    },
    ask: function (d) {
      return 'Un circuito con $' + d.n + '$ entradas y una salida. ¿Cuántas filas tiene su tabla de ' +
        'verdad, y cuántas tablas distintas podrían escribirse con esas entradas?';
    },
    fields: [{ name: 'f', label: 'filas', w: 'tiny' }, { name: 't', label: 'tablas posibles', w: 'small' }],
    sol: function (d) { return { f: d.filas, t: d.tablas }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { return Math.abs(v.t - Math.pow(2, d.n)) < 0.5 && d.n > 1; }, msg: 'Eso son las filas, no las tablas. Cada fila puede sacar 0 o 1 independientemente, así que hay dos opciones por fila.' }],
    hint: function (d) { return 'Cada entrada puede valer 0 o 1, así que hay $2^{' + d.n + '}$ filas. Y luego cada fila puede sacar 0 o 1.'; },
    steps: function (d) {
      return ['Filas: $2^{' + d.n + '} = ' + d.filas + '$.',
        'Cada una de esas ' + d.filas + ' filas puede sacar 0 o 1 por su cuenta, así que hay $2^{' + d.filas + '} = ' + U.miles(d.tablas) + '$ tablas distintas.',
        'Y todas ellas se pueden construir con puertas: es lo que se ve en [[maq-normal|la forma normal]].'];
    },
    answer: function (d) { return d.filas + ' y ' + U.miles(d.tablas); }
  });

  p.keys([
    'Una puerta lógica es una tabla de verdad hecha de cables: la conectiva de la lógica y la puerta del circuito son el mismo objeto.',
    'Los circuitos se escriben como netlist, una puerta por línea; lo que se usa y no se define son las entradas, y lo que se define y nadie consume, las salidas.',
    'El <code>xor</code> saca 1 cuando las entradas son distintas, que es <em>la suma sin acarreo</em>.',
    'Con <code>nand</code> sola se construyen todas las demás: <code>nand(a, a)</code> niega, y de ahí salen el and y el or. Se dice que es funcionalmente completa.',
    'Sin negación no se llega a todo: cualquier circuito de <code>and</code> y <code>or</code> saca 0 cuando todas las entradas valen 0.',
    'Contar puertas es la manera de comparar dos circuitos que hacen lo mismo.'
  ]);
});
