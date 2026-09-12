/* Tema: Hablarle a la máquina: saltos, bucles y pila */
Course.topic('maq-ensamblador', function (p) {

  p.puente('La [[maq-cpu|máquina]] ya funciona, pero hablarle en números es inhumano: nadie quiere ' +
    'escribir «2, 8, 4, 2, 9, 6». Este tema es el primer traductor del bloque, y es el más sencillo de ' +
    'todos: convierte <code>CARGA x</code> en un 2 seguido de un 8. Se llama <strong>ensamblador</strong>, ' +
    'y con él se puede ya escribir de verdad.');

  p.text('Un ensamblador no inventa nada: hay <strong>una instrucción de máquina por cada línea</strong>. ' +
    'Lo único que aporta son nombres. Nombres para las instrucciones, en vez de códigos; nombres para ' +
    'las celdas donde se guardan los datos, en vez de direcciones; y nombres para los sitios a los que ' +
    'se salta, en vez de números de celda. Es poco, y cambia todo.');

  /* ---------------------------------------------------------------- */
  p.section('Etiquetas, y por qué hacen falta dos pasadas');

  p.text('Una <strong>etiqueta</strong> es un nombre puesto delante de una instrucción, con dos puntos. ' +
    'Marca el sitio, y a partir de ahí se puede saltar ahí sin saber en qué celda cayó:');

  p.text('<pre class="shd__mini">      SALTA fin\n      NUM 9        ; esto no se ejecuta nunca\nfin:  NUM 1\n      MUESTRA\n      PARA</pre>');

  p.text('Aquí aparece un problema pequeño y muy instructivo. Cuando el ensamblador lee la primera línea ' +
    'y encuentra <code>SALTA fin</code>, <strong>todavía no sabe dónde está <code>fin</code></strong>: ' +
    'aparece tres líneas más abajo. No puede rellenar el hueco.');

  p.note('La solución es leer el programa <strong>dos veces</strong>. En la primera pasada solo se cuenta ' +
    'cuánto ocupa cada instrucción y se apunta en qué celda cae cada etiqueta; en la segunda ya se ' +
    'pueden rellenar todos los huecos, porque el mapa está completo. Los ensambladores de verdad hacen ' +
    'exactamente eso, y por el mismo motivo. Es la primera vez en el bloque que aparece una idea que va ' +
    'a repetirse mucho en el tramo del lenguaje: <strong>para traducir algo hay que haberlo recorrido ' +
    'entero antes</strong>.',
    'ok', 'Dos pasadas');

  p.text('Con los nombres de datos pasa algo parecido, y aquí el ensamblador de este curso toma un ' +
    'atajo cómodo: cualquier nombre que aparezca detrás de <code>CARGA</code> o <code>GUARDA</code> se ' +
    'convierte en una celda propia, colocada <strong>justo detrás del programa</strong>. No hay que ' +
    'declarar nada.');

  /* ---------------------------------------------------------------- */
  p.section('Decidir: el salto condicional');

  p.text('En la máquina no hay ningún <code>si</code>. Hay una sola instrucción que mira el acumulador: ' +
    '<code>SICERO</code>, que salta <em>solo si vale 0</em>. Con eso se construye todo lo demás.');

  p.text('El truco para comparar es restar. Si <code>a - b</code> da cero, es que eran iguales; y para ' +
    'saber si uno es menor está <code>MENOR</code>, que deja un 1 o un 0 en el acumulador. Entonces un ' +
    '«si x es menor que y, haz esto» se escribe así:');

  p.text('<pre class="shd__mini">      CARGA x\n      METE\n      CARGA y\n      MENOR        ; 1 si x &lt; y, 0 si no\n      SICERO otro  ; si NO era menor, vete a la otra rama\n      ; ... aquí va lo que se hace si x &lt; y\n      SALTA sigue\notro: ; ... y aquí lo otro\nsigue: PARA</pre>');

  p.note('Fíjate en que el salto va <strong>al revés</strong> de como se lee la condición: ' +
    '<code>SICERO</code> se lleva el caso en que la condición era <em>falsa</em>. Es el error más ' +
    'frecuente de todo el tema, y también la razón de que un compilador se equivoque tan poco: ' +
    'la máquina siempre hace la vuelta del revés, y no se cansa.',
    'warn', 'La condición se escribe al revés');

  p.demo({
    title: 'El mayor de dos números',
    intro: 'Cambia el 9 y el 4 de las cuatro primeras líneas y pulsa «Corre». Con «Un paso» se ve qué rama toma y por qué. Prueba también a poner los dos iguales.',
    predice: 'Con x = 9 e y = 4, ¿por qué rama crees que se irá: la de SICERO o la de seguir?',
    build: function (host) {
      W.maquina(host, {
        id: 'ens-mayor', tope: 400,
        texto: 'NUM 9\nGUARDA x\nNUM 4\nGUARDA y\n' + MAQ.EJEMPLOS.mayor.texto,
        nota: 'Las cuatro primeras líneas son solo para dejar los datos en su celda. Al final de la tabla de memoria se ven <code>x</code> e <code>y</code>, en las celdas que el ensamblador les reservó detrás del programa.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Repetir: el bucle es un salto hacia atrás');

  p.text('Un bucle no necesita ninguna instrucción nueva. Es un <strong>salto hacia atrás</strong>, a una ' +
    'etiqueta que quedó más arriba, con una condición que decide cuándo dejar de dar vueltas:');

  p.demo({
    title: 'Contar de 1 a n',
    intro: 'Un bucle completo, con su contador, su cuerpo y su condición de salida. Ve paso a paso una vuelta entera y fíjate en que el contador de programa retrocede al llegar al SICERO. Cambia el 5 de la primera línea por otro número y vuelve a correr.',
    predice: 'El programa escribe los números del 1 al n. ¿Cuántas vueltas al bucle crees que dará con n = 5: cuatro, cinco o seis?',
    build: function (host) {
      W.maquina(host, {
        id: 'ens-cuenta', tope: 800,
        texto: 'NUM 5\nGUARDA n\n' + MAQ.EJEMPLOS.cuenta.texto,
        nota: 'La condición de salida está escrita como «¿ya nos hemos pasado?», que es la forma natural cuando lo único que hay es <code>MENOR</code> y <code>SICERO</code>. Compárala con la manera en que lo dirías en voz alta y verás cuánto trabajo hace un lenguaje.'
      });
    }
  });

  p.text('Ahí está ya todo lo que hace falta para programar: se puede <strong>decidir</strong> y se puede ' +
    '<strong>repetir</strong>. Con esas dos cosas y un poco de memoria no hay cálculo que se resista, y ' +
    'eso es un resultado con nombre: lo verás en [[av-computabilidad|qué se puede calcular]].');

  /* ---------------------------------------------------------------- */
  p.section('La pila y las subrutinas');

  p.text('Queda la última pieza, y es la más elegante. Si un trozo de programa se usa desde varios sitios ' +
    'conviene escribirlo una sola vez y llamarlo. El problema es la vuelta: la subrutina tiene que saber ' +
    '<strong>a dónde volver</strong>, y eso cambia en cada llamada.');

  p.text('La solución es la <strong>pila</strong>. <code>LLAMA</code> mete en la pila la dirección de la ' +
    'instrucción siguiente y salta; <code>VUELVE</code> saca esa dirección y se va a ella. Como la pila ' +
    'es lo último en entrar, lo primero en salir, las llamadas anidadas se deshacen solas en el orden ' +
    'correcto.');

  p.demo({
    title: 'Una subrutina que duplica',
    intro: 'La subrutina «dup» duplica lo que traiga el acumulador. Da pasos y mira la pila: en el LLAMA aparece un número —la dirección de vuelta—, y en el VUELVE desaparece.',
    predice: 'Cuando se ejecuta LLAMA, ¿qué número crees que aparecerá en la pila?',
    build: function (host) {
      W.maquina(host, {
        id: 'ens-dup', tope: 300,
        texto: 'NUM 7\nGUARDA x\n' + MAQ.EJEMPLOS.doble.texto,
        nota: 'La subrutina usa la misma pila que la dirección de vuelta, y por eso tiene que dejarla como la encontró. Si se le olvidara sacar lo que metió, <code>VUELVE</code> saltaría a un sitio equivocado, y la máquina se volvería loca sin avisar.'
      });
    }
  });

  p.note('Una pila es una lista de la que solo se puede tocar el último elemento. Aquí sirve para dos ' +
    'cosas a la vez —guardar direcciones de vuelta y guardar resultados intermedios— y eso no es ' +
    'casualidad ni ahorro: las dos son la misma necesidad, que es <em>acordarse de lo que estaba ' +
    'haciendo antes de meterme aquí</em>. Vuelve a salir, con ese mismo sentido, cuando el lenguaje ' +
    'tenga [[len-funciones|funciones]].',
    null, 'Para qué sirve exactamente una pila');

  /* ---------------------------------------------------------------- */
  p.section('Calcular una dirección, no solo escribirla');

  p.text('Queda una limitación que hasta aquí no se ha notado, y que es más grave de lo que parece. En ' +
    '<code>CARGA x</code>, la dirección está <strong>escrita en el programa</strong>. Se puede nombrar ' +
    'una celda, pero no calcularla: no hay forma de decir «la celda número lo-que-valga-esto».');

  p.text('Y sin eso no hay listas. Con veinte variables sueltas se puede guardar veinte cosas, pero no ' +
    'recorrerlas con un bucle: habría que escribir veinte <code>CARGA</code> distintos, uno por nombre. ' +
    'Una lista no es «muchas variables»: es un trozo de memoria por el que se puede <em>avanzar</em>.');

  p.text('Se arregla con dos instrucciones que hacen un salto de más:');

  p.table(['instrucción', 'qué hace'],
    [['<code>CARGA p</code>', 'el acumulador toma <strong>lo que hay</strong> en la celda <code>p</code>'],
     ['<code>CARGAI p</code>', 'mira qué <strong>dirección</strong> hay en <code>p</code> y trae lo que haya <em>ahí</em>'],
     ['<code>GUARDAI p</code>', 'lo mismo para escribir: guarda el acumulador en la celda que apunta <code>p</code>'],
     ['<code>NUM x</code>', 'con un nombre en vez de un número, pone en el acumulador la <strong>dirección</strong> de <code>x</code>']]);

  p.note('Esa distinción entre <em>la dirección</em> y <em>lo que hay en ella</em> es el escalón que más ' +
    'cuesta de todo el bloque, y no porque sea difícil: porque en la vida diaria no se separan. Una ' +
    'forma de tenerlo claro: <code>NUM x</code> te da el número del portal; <code>CARGA x</code> te da ' +
    'quién vive dentro. <code>CARGAI p</code> es: «en el papel <code>p</code> hay escrito un número de ' +
    'portal; ve a ese portal y dime quién vive».',
    'ok', 'La dirección y lo que hay en ella');

  p.text('Con esas dos, una lista es una tabla de celdas seguidas y un puntero que avanza. Para reservar ' +
    'las celdas seguidas hay una palabra que no es una instrucción —no se ejecuta, no ocupa sitio en el ' +
    'programa—: <code>TABLA nombre tamaño</code>.');

  p.demo({
    title: 'Una lista, rellenada y recorrida',
    intro: 'Cuatro números escritos en una tabla con GUARDAI, y después sumados recorriéndola con CARGAI y un puntero que avanza. Fíjate en la tabla de memoria: las cuatro celdas de la lista están seguidas, al final. Cambia los números y vuelve a correr.',
    predice: 'El bucle de la suma tiene una sola instrucción que lee de la lista. ¿Cómo sabe, en cada vuelta, de qué celda leer?',
    build: function (host) {
      W.maquina(host, {
        id: 'ens-lista', tope: 3000,
        texto: MAQ.EJEMPLOS.tabla.texto,
        nota: 'El puntero <code>p</code> es una celda que guarda un número de celda. Sumarle uno es «pasar al siguiente», y ahí está toda la idea de una lista. Lo que hace un lenguaje cuando escribes <code>lista[i]</code> es exactamente esto.'
      });
    }
  });

  p.note('Este par de instrucciones no es comodidad: <strong>cambia lo que la máquina puede hacer</strong>. ' +
    'Sin ellas no hay listas, no hay marcos de pila de verdad —no se puede decir «la variable de ' +
    '<em>esta</em> llamada»— y no hay programas que se escriban a sí mismos, que es lo que se ve en ' +
    '[[len-autorreferencia|el último tema del bloque]]. Con ellas el juego pasa de dieciséis ' +
    'instrucciones a dieciocho, y el código de operación deja de caber en cuatro bits: hacen falta ' +
    'cinco. Ese bit de más es el precio, y está bien pagado.',
    'ok', 'Lo que se compra con un bit');

  p.ejemplo({
    title: 'Traducir un «mientras» a saltos',
    enunciado: 'Escribir en ensamblador la idea «mientras i sea menor que 3, escribe i y súmale 1», empezando con i valiendo 0.',
    pasos: [
      { t: '<strong>Poner el contador a cero.</strong> <code>NUM 0</code> y <code>GUARDA i</code>. Con eso queda una celda llamada <code>i</code> detrás del programa, valiendo 0.', antes: 'Todo lo que se guarde entre vueltas tiene que vivir en una celda: el acumulador se pisa constantemente.' },
      { t: '<strong>Marcar dónde empieza la vuelta.</strong> Una etiqueta, <code>bucle:</code>. Ahí es donde volverá el salto de abajo.' },
      { t: '<strong>La condición, al revés.</strong> <code>CARGA i</code>, <code>METE</code>, <code>NUM 3</code>, <code>MENOR</code>: el acumulador queda a 1 mientras $i &lt; 3$. Y entonces <code>SICERO fin</code>, que se va <em>cuando deja de cumplirse</em>.', antes: 'La máquina solo sabe saltar si algo vale cero, así que la condición se escribe del revés.' },
      { t: '<strong>El cuerpo.</strong> <code>CARGA i</code>, <code>MUESTRA</code>; y para sumar uno, <code>CARGA i</code>, <code>METE</code>, <code>NUM 1</code>, <code>SUMA</code>, <code>GUARDA i</code>.' },
      { t: '<strong>Cerrar el bucle.</strong> <code>SALTA bucle</code>, y detrás <code>fin:</code> con <code>PARA</code>. Escribe 0, 1 y 2, que es lo que se pedía.' }
    ],
    cierre: 'Trece instrucciones para una frase de nueve palabras. Ésa es exactamente la distancia que un lenguaje de programación se ofrece a recorrer por ti, y la segunda mitad de este bloque consiste en construir quien la recorra.'
  });

  p.comprueba('En <code>CARGA x · METE · CARGA y · MENOR · SICERO otro</code>, ¿cuándo se va el programa a la etiqueta <code>otro</code>?', [
    { t: 'Cuando x NO es menor que y, porque entonces MENOR deja un 0 y SICERO salta', ok: true, por: 'El salto se lleva el caso falso. <code>MENOR</code> deja 1 si se cumple y 0 si no, y <code>SICERO</code> salta con el 0: por eso la rama a la que va la etiqueta es la del «no».' },
    { t: 'Cuando x es menor que y, porque es lo que dice MENOR', ok: false, por: 'Al revés: si x es menor, <code>MENOR</code> deja un 1, y <code>SICERO</code> no salta con un 1. La ejecución sigue por la línea de abajo.' },
    { t: 'Siempre, porque SICERO es un salto como SALTA', ok: false, por: '<code>SALTA</code> va siempre; <code>SICERO</code> mira antes el acumulador y solo va si vale 0. Si fuera siempre, no se podría decidir nada.' }
  ]);

  p.util('Casi nadie escribe ensamblador hoy, y aun así hay tres sitios donde sigue siendo insustituible: ' +
    'el trozo de código que arranca un ordenador antes de que exista nada más, los rincones de un ' +
    'sistema donde hace falta exprimir el último ciclo —un códec de vídeo, una función criptográfica—, y ' +
    'el análisis de programas de los que no se tiene el fuente, que es a lo que se dedica media ' +
    'seguridad informática: se desensambla el binario y se lee esto mismo. Y leerlo se parece mucho más ' +
    'a lo que acabas de hacer de lo que suena.');

  p.hist('La palabra viene de <strong>Kathleen Booth</strong>, que en 1947 escribió el primer ensamblador ' +
    'conocido para la máquina ARC del Birkbeck College. Poco después, <strong>Grace Hopper</strong> ' +
    'sostuvo que se podía ir mucho más lejos —que una máquina podía traducir palabras normales a código ' +
    'máquina— y se encontró con la respuesta de que los ordenadores solo sabían hacer aritmética. Su ' +
    'compilador A-0, de 1952, demostró que no; el argumento de fondo, que quien programa no tendría por ' +
    'qué hablar como la máquina, es la tesis de la segunda mitad de este bloque.');

  p.trampas([
    { e: 'Escribir la condición del derecho', por: '<code>SICERO</code> salta cuando el acumulador vale <strong>0</strong>, o sea, cuando la condición NO se cumple. La etiqueta se lleva el caso falso.' },
    { e: 'Olvidar que el acumulador se pisa', por: 'Cualquier <code>CARGA</code> o <code>NUM</code> borra lo que hubiera. Lo que tenga que sobrevivir hay que meterlo en la pila o guardarlo en una celda.' },
    { e: 'Poner el argumento de un salto a mano', por: 'Se puede —<code>SALTA 6</code> es válido—, pero en cuanto se añada una instrucción arriba, todos los números cambian. Para eso están las etiquetas.' },
    { e: 'Que una subrutina deje algo suyo en la pila', por: '<code>VUELVE</code> saca lo que haya encima y se va ahí. Si eso no es la dirección de vuelta, el programa se descarrila sin ningún aviso.' },
    { e: 'Un bucle sin condición de salida', por: 'La máquina lo ejecuta felizmente para siempre. Aquí se para al llegar al tope de pasos y se dice; un ordenador de verdad, no.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Dónde cae cada etiqueta',
    level: 'basico',
    gen: function (r) {
      var antes = r.int(1, 3), conArg = r.int(0, 2);
      var lineas = [];
      for (var i = 0; i < antes; i++) lineas.push('METE');
      for (var j = 0; j < conArg; j++) lineas.push('NUM ' + r.int(1, 9));
      var dir = antes + 2 * conArg;
      return { prog: lineas.join('\n') + '\naqui:\nPARA', dir: dir, antes: antes, conArg: conArg };
    },
    ask: function (d) {
      return 'Se ensambla este programa:<pre class="shd__mini">' + d.prog + '</pre>' +
        '¿En qué celda cae la etiqueta <code>aqui</code>?';
    },
    fields: [{ name: 'c', label: 'celda', w: 'tiny' }],
    sol: function (d) { return { c: d.dir }; },
    tol: 0.5,
    hint: function () { return 'Una etiqueta no ocupa ninguna celda: marca dónde cae la instrucción siguiente. Ve sumando: una celda por instrucción, y otra más por cada argumento.'; },
    steps: function (d) {
      return ['Las ' + d.antes + ' ' + U.plural(d.antes, 'instrucción', 'instrucciones') + ' sin argumento ocupan ' + d.antes + '.',
        (d.conArg ? 'Los ' + d.conArg + ' <code>NUM</code> ocupan dos cada uno: ' + (2 * d.conArg) + '.' : 'No hay ninguna instrucción con argumento.'),
        'La etiqueta no ocupa nada, así que cae en la celda $' + d.dir + '$.'];
    },
    answer: function (d) { return String(d.dir); }
  });

  p.exercise({
    title: 'Hacia dónde salta',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { a: 5, cond: 'MENOR ha dejado un 1', v: 'sigue', por: '<code>SICERO</code> solo salta si el acumulador vale 0. Con un 1, la ejecución sigue por la línea de abajo.' },
        { a: 0, cond: 'MENOR ha dejado un 0', v: 'salta', por: 'El acumulador vale 0, que es justo lo que <code>SICERO</code> espera: se va a la etiqueta.' },
        { a: 0, cond: 'la resta de dos números iguales ha dado 0', v: 'salta', por: 'Restar es la forma de comparar: si da 0, eran iguales, y <code>SICERO</code> salta.' },
        { a: -3, cond: 'la resta ha dado -3', v: 'sigue', por: 'Un −3 no es 0, así que no salta. <code>SICERO</code> mira si vale exactamente cero, no si es positivo o negativo.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'La máquina llega a un <code>SICERO fin</code> y ' + d.c.cond + ', o sea, el acumulador vale ' +
        '<strong>' + d.c.a + '</strong>. ¿Qué hace?';
    },
    fields: [{ name: 'q', label: 'El programa', opts: [
      { t: 'se va a la etiqueta fin', v: 'salta' },
      { t: 'sigue por la instrucción de abajo', v: 'sigue' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return '<code>SICERO</code> salta <strong>solo</strong> si el acumulador vale exactamente 0.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'salta' ? 'se va a fin' : 'sigue abajo'; }
  });

  p.exercise({
    title: 'Escribir un programa que calcule',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'escriba la suma de las celdas <code>x</code> e <code>y</code>',
          ref: 'CARGA x\nMETE\nCARGA y\nSUMA\nMUESTRA\nPARA', min: 6,
          casos: [{ datos: { x: 3, y: 4 }, salida: [7] }, { datos: { x: -2, y: 2 }, salida: [0] }, { datos: { x: 50, y: 11 }, salida: [61] }] },
        { t: 'escriba la resta <code>x - y</code>',
          ref: 'CARGA x\nMETE\nCARGA y\nRESTA\nMUESTRA\nPARA', min: 6,
          casos: [{ datos: { x: 9, y: 4 }, salida: [5] }, { datos: { x: 1, y: 6 }, salida: [-5] }, { datos: { x: 0, y: 0 }, salida: [0] }] },
        { t: 'escriba el doble de <code>x</code>',
          ref: 'CARGA x\nMETE\nCARGA x\nSUMA\nMUESTRA\nPARA', min: 6,
          casos: [{ datos: { x: 5 }, salida: [10] }, { datos: { x: 0 }, salida: [0] }, { datos: { x: -7 }, salida: [-14] }] },
        { t: 'escriba primero <code>x</code> y después <code>y</code>',
          ref: 'CARGA x\nMUESTRA\nCARGA y\nMUESTRA\nPARA', min: 5,
          casos: [{ datos: { x: 1, y: 2 }, salida: [1, 2] }, { datos: { x: 9, y: 9 }, salida: [9, 9] }] },
        { t: 'escriba <code>x</code> multiplicado por <code>y</code>',
          ref: 'CARGA x\nMETE\nCARGA y\nMULT\nMUESTRA\nPARA', min: 6,
          casos: [{ datos: { x: 3, y: 5 }, salida: [15] }, { datos: { x: 0, y: 9 }, salida: [0] }, { datos: { x: -4, y: 3 }, salida: [-12] }] }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe un programa que ' + d.c.t + ' y después pare. Usa esos nombres de celda tal cual: ' +
        'los valores se ponen desde fuera.<br><span style="font-size:0.875rem;color:var(--ink-faint)">' +
        'Se corrige ejecutándolo con varios valores: vale cualquier programa que dé lo mismo. Acuérdate ' +
        'de que las operaciones sacan el operando izquierdo de la pila.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea, como <code>CARGA x</code>.' };
      var r = W.programaIguales(texto, d.c.casos);
      if (!r.ok) return { ok: false, msg: r.porQue };
      return { ok: true, msg: 'Correcto.' + (r.instrucciones > d.c.min
        ? ' Lo has hecho con ' + r.instrucciones + ' instrucciones; se puede con ' + d.c.min + '.'
        : ' Y con el mínimo conocido: ' + r.instrucciones + '.') };
    },
    hint: function () { return 'El esquema de una operación es siempre el mismo: cargar el operando izquierdo, <code>METE</code>, cargar el derecho, y la operación. Y no te dejes el <code>PARA</code>.'; },
    steps: function (d) {
      return ['Una solución:<pre class="shd__mini">' + d.c.ref + '</pre>',
        'El <code>METE</code> del medio es lo que deja el primer valor a salvo mientras se carga el segundo.',
        'Cualquier programa que escriba lo mismo con esos datos vale, aunque lo haga de otra manera.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' · '); }
  });

  p.exercise({
    title: 'Un bucle que suma',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'escriba la suma de todos los números de 1 a <code>n</code>', min: 12, gauss: true,
          ref: 'NUM 0\nGUARDA s\nCARGA n\nGUARDA i\nbucle:\nCARGA i\nSICERO fin\nCARGA s\nMETE\nCARGA i\nSUMA\nGUARDA s\nCARGA i\nMETE\nNUM 1\nRESTA\nGUARDA i\nSALTA bucle\nfin:\nCARGA s\nMUESTRA\nPARA',
          casos: [{ datos: { n: 4 }, salida: [10] }, { datos: { n: 1 }, salida: [1] }, { datos: { n: 0 }, salida: [0] }, { datos: { n: 10 }, salida: [55] }] },
        { t: 'escriba los números de <code>n</code> a 1, en ese orden', min: 13,
          ref: 'CARGA n\nGUARDA i\nbucle:\nCARGA i\nSICERO fin\nCARGA i\nMUESTRA\nCARGA i\nMETE\nNUM 1\nRESTA\nGUARDA i\nSALTA bucle\nfin:\nPARA',
          casos: [{ datos: { n: 3 }, salida: [3, 2, 1] }, { datos: { n: 1 }, salida: [1] }, { datos: { n: 0 }, salida: [] }] },
        { t: 'escriba <code>n</code> veces el número 7', min: 13,
          ref: 'CARGA n\nGUARDA i\nbucle:\nCARGA i\nSICERO fin\nNUM 7\nMUESTRA\nCARGA i\nMETE\nNUM 1\nRESTA\nGUARDA i\nSALTA bucle\nfin:\nPARA',
          casos: [{ datos: { n: 3 }, salida: [7, 7, 7] }, { datos: { n: 0 }, salida: [] }, { datos: { n: 1 }, salida: [7] }] }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe un programa que ' + d.c.t + '. Con <code>n = 0</code> tiene que portarse bien: ' +
        'piensa qué debería escribir en ese caso antes de empezar.' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige ejecutándolo con varios ' +
        'valores de n. Si se te va en un bucle sin fin, la máquina se para sola y te lo dice.</span>';
    },
    fields: [{ name: 'n', label: 'el programa', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea.' };
      var r = W.programaIguales(texto, d.c.casos, { tope: 3000 });
      if (!r.ok) return { ok: false, msg: r.porQue };
      return { ok: true, msg: 'Correcto, y con los cuatro casos.' + (r.instrucciones > d.c.min
        ? ' Lo has hecho con ' + r.instrucciones + ' instrucciones; se puede con ' + d.c.min + '.'
        : ' Y con el mínimo conocido: ' + r.instrucciones + '.') };
    },
    hint: function () {
      return ['Necesitas una celda que cuente y, si el enunciado pide acumular, otra donde ir sumando. Empieza por darles su valor de partida.',
        'El esqueleto es: etiqueta · cargar el contador · <code>SICERO fin</code> · cuerpo · restar uno al contador · <code>SALTA</code> a la etiqueta · <code>fin:</code> · lo que quede · <code>PARA</code>.'];
    },
    steps: function (d) {
      var ps = ['Una solución:<pre class="shd__mini">' + d.c.ref + '</pre>',
        'La condición está escrita como «si el contador ha llegado a cero, sal», que es lo natural cuando solo se tiene <code>SICERO</code>.',
        'Y con $n = 0$ funciona sin tocar nada: el <code>SICERO</code> está <strong>antes</strong> del cuerpo, así que no da ni una vuelta.'];
      /* El atajo de Gauss es mas corto y desborda antes: merece contarse. */
      if (d.c.gauss) {
        ps.push('Hay un camino mucho más corto, y es la fórmula que se demuestra por inducción en [[lg-demostracion|los métodos de demostración]]: la suma de 1 a $n$ vale ' +
          '$\\frac{n(n+1)}{2}$, y eso son <strong>12 instrucciones sin ningún bucle</strong>:' +
          '<pre class="shd__mini">CARGA n\nMETE\nCARGA n\nMETE\nNUM 1\nSUMA\nMULT\nMETE\nNUM 2\nDIV\nMUESTRA\nPARA</pre>');
        ps.push('Pero tiene una pega preciosa: multiplica <em>antes</em> de dividir, así que con $n = 15$ ' +
          'calcula $15 \\times 16 = 240$, que no cabe en ocho bits, y da la vuelta. El bucle, que nunca ' +
          'pasa del resultado final, aguanta hasta $n = 15$. <strong>Dos caminos al mismo número no ' +
          'desbordan a la vez.</strong>');
      }
      return ps;
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' · '); }
  });

  p.keys([
    'Un <strong>ensamblador</strong> no inventa nada: una línea, una instrucción de máquina. Lo que aporta son nombres.',
    'Hace <strong>dos pasadas</strong> porque un salto hacia delante nombra una etiqueta que aún no ha visto: primero mide y apunta, después rellena.',
    'No hay ningún «si»: hay <code>SICERO</code>, que salta solo si el acumulador vale 0, y por eso <strong>la condición se escribe al revés</strong>.',
    'No hay ningún «mientras»: un bucle es un salto hacia atrás con una condición que decide cuándo parar.',
    'Con decidir y repetir ya está todo: no hay cálculo que no se pueda escribir así.',
    '<code>LLAMA</code> mete en la <strong>pila</strong> la dirección de vuelta y <code>VUELVE</code> la saca; por eso las llamadas anidadas se deshacen solas en el orden correcto.',
    'Una subrutina tiene que dejar la pila como la encontró, o <code>VUELVE</code> saltará a cualquier sitio sin avisar.'
  ]);
});
