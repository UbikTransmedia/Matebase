/* Tema: Ataques por canales laterales: cuando el reloj habla */
Course.topic('cr-canales', function (p) {

  p.puente('Todo lo anterior daba por hecho que Eva solo ve los mensajes. Este tema quita esa hipótesis: ' +
    'un cifrado con la matemática intacta cae por <em>cómo</em> se ejecuta. Reaparecen el ' +
    '[[cr-mac|sello]] que hay que comparar bien, el [[cr-modos|relleno de CBC]] que no hay que ' +
    'revelar, y el [[cr-firmas|nonce]] que no hay que repetir, ahora como fallos de implementación, ' +
    'con la [[pe-inferencia|estadística]] que los detecta.');

  p.text('AES no se ha roto nunca por criptoanálisis, y sin embargo se han robado claves de AES. RSA ' +
    'está bien, y se han recuperado claves RSA. El ataque no entra por la matemática: entra por el ' +
    'reloj, por el consumo eléctrico, por los mensajes de error, por un generador de azar ' +
    'defectuoso. Es la diferencia entre un cifrado y un <strong>sistema</strong>, y es donde ocurren ' +
    'casi todos los desastres reales.');

  /* ---------------------------------------------------------------- */
  p.section('Comparar en tiempo constante');

  p.text('El error más sencillo y más común: comparar dos secuencias de bytes, una etiqueta MAC o una ' +
    'contraseña, con una comparación que <strong>se detiene en el primer byte distinto</strong>. ' +
    'Tarda un poco más cuantos más bytes coinciden al principio, y ese poco más es medible. Eva ' +
    'prueba el primer byte con los 256 valores, se queda con el que tarda un pelín más, pasa al ' +
    'segundo, y reconstruye la etiqueta byte a byte: 256·16 pruebas en vez de $256^{16}$.');

  p.demo({
    title: 'La comparación que habla',
    intro: 'Eva no conoce la etiqueta correcta. Prueba las 256 posibilidades del primer byte; la comparación ingenua tarda un ciclo más por cada byte que ya ha acertado, así que el byte correcto destaca. Fija ese byte y sigue con el siguiente. La demo mide los «ciclos» de la comparación.',
    predice: 'Con una comparación que para en el primer fallo, ¿cuántas pruebas necesita Eva para una etiqueta de 8 bytes: unas 2000, unos millones o $256^8$?',
    build: function (host) {
      var secreto = [0x3a, 0x91, 0x0c, 0xf5, 0x22, 0x8b, 0x40, 0xd7], modo = 'ingenua', descubierto = 0;
      var out = W.mono(host, '');
      function compara(intento) { var c = 0; for (var i = 0; i < secreto.length; i++) { c++; if (intento[i] !== secreto[i]) return modo === 'ingenua' ? c : secreto.length; } return secreto.length; }
      function pinta() {
        var base = []; for (var i = 0; i < secreto.length; i++) base.push(i < descubierto ? secreto[i] : 0);
        var mejor = -1, mejorT = -1, empates = 0;
        for (var b = 0; b < 256; b++) { base[descubierto] = b; var t = compara(base); if (t > mejorT) { mejorT = t; mejor = b; empates = 1; } else if (t === mejorT) empates++; }
        var h = '<b>etiqueta secreta:</b> ' + CR.hex(secreto) + '   <b>comparación:</b> ' + modo + '\n<b>bytes ya descubiertos:</b> ' + descubierto + ' (' + CR.hex(secreto.slice(0, descubierto)) + ')\n\n';
        if (modo === 'ingenua') h += 'Probando los 256 valores del byte ' + descubierto + ', el que más «ciclos» consume es <b>' + CR.hex([mejor]) + '</b> (' + mejorT + ' ciclos), y es único: <span class="cr-dif">ese es el byte correcto</span>.\n\n<span class="cr-tenue">Total para toda la etiqueta: 256 × ' + secreto.length + ' = ' + (256 * secreto.length) + ' pruebas.</span>';
        else h += 'Con comparación en tiempo constante, todas las pruebas consumen los mismos ' + mejorT + ' ciclos: ' + empates + ' de 256 empatan. <span class="cr-ok">El tiempo no dice nada; a Eva le quedan 256^' + secreto.length + ' pruebas.</span>';
        out.set(h);
      }
      W.chips(host, [{ label: 'comparación ingenua', value: 'ingenua' }, { label: 'tiempo constante', value: 'constante' }], { value: modo, on: function (v) { modo = v; pinta(); } });
      W.slider(W.row(host), { label: 'bytes ya descubiertos', min: 0, max: 7, step: 1, value: descubierto, on: function (v) { descubierto = v; pinta(); } });
      pinta();
    }
  });

  p.formula('\\text{recorrer siempre los } n \\text{ bytes: } \\ \\text{dif} = \\text{dif} \\lor (a_i \\oplus b_i), \\ \\text{y comprobar dif} = 0 \\text{ al final}',
    'comparar sin filtrar por el tiempo',
    'Se lee: <em>«se acumulan con un o las diferencias de todos los bytes, y al final se mira si el ' +
    'acumulado es cero»</em>. Se recorren siempre los $n$ bytes, pase lo que pase, y no hay ningún ' +
    '«salir antes». El tiempo es el mismo para cualquier par, así que no filtra nada.');

  p.comprueba('Una web comprueba el token de sesión con el operador de comparación normal de su lenguaje, que para en cuanto encuentra una diferencia. ¿Qué expone?', [
    { t: 'El tiempo de respuesta, que crece con los bytes iniciales acertados y permite reconstruir el token byte a byte', ok: true, por: 'Cada byte correcto añade una vuelta de bucle antes del fallo. Midiendo muchas peticiones y promediando el ruido de la red, la diferencia se ve, y el token cae en unos miles de intentos.' },
    { t: 'Nada: la comparación es correcta, devuelve verdadero o falso', ok: false, por: 'El resultado es correcto; lo que se filtra es el <em>tiempo</em> en darlo. La corrección lógica no implica seguridad frente a canales laterales.' },
    { t: 'Solo la longitud del token', ok: false, por: 'La longitud es lo de menos. Lo grave es que el tiempo revela cuántos bytes iniciales coinciden, y eso permite adivinar el token entero.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El oráculo de relleno');

  p.text('Un caso más sutil, que rompió sistemas reales durante años. Al descifrar CBC, el servidor quita ' +
    'el relleno y comprueba que está bien formado (los últimos $n$ bytes valen $n$). Si el relleno es ' +
    'inválido, muchos servidores devolvían un error <em>distinto</em> del error de un mensaje mal ' +
    'autenticado. Ese error es un <strong>oráculo</strong>: le dice a Eva «el relleno de lo que has ' +
    'enviado es válido». Y con eso, sin la clave, descifra el mensaje entero.');

  p.text('La idea aprovecha que en CBC $m_i = D_k(c_i) \\oplus c_{i-1}$. Eva no conoce $D_k(c_i)$, pero ' +
    'controla $c_{i-1}$: si va cambiando su último byte hasta que el servidor acepta el relleno, sabe ' +
    'que el último byte de $m_i$ ha quedado en $01$, y de ahí despeja el byte de $D_k(c_i)$. Repite ' +
    'para cada byte del bloque. Unas 256 peticiones por byte, y descifra sin tocar la clave.');

  p.demo({
    title: 'Descifrar con el oráculo',
    intro: 'Eva quiere el último byte de un bloque de mensaje. Va poniendo valores en el último byte del bloque cifrado anterior; el servidor solo le dice si el relleno resultante es válido. Cuando lo es, Eva despeja el byte. Aquí el oráculo es el chip verde; la clave nunca aparece.',
    predice: 'Para el último byte, el relleno válido más probable es $01$. ¿Cuántos valores del byte de $c_{i-1}$ tiene que probar Eva de media hasta que el servidor acepte: uno, 128 o 256?',
    build: function (host) {
      var clave = CR.deHex('2b7e151628aed2a6abf7158809cf4f3c'), iv = CR.deHex('00112233445566778899aabbccddeeff');
      var mensaje = CR.rellena(CR.bytes('Secreto de 16!!')), cif = CR.cbc(mensaje, clave, iv);
      var prueba = 0, bloque = 1;
      var out = W.mono(host, '');
      function oraculo(cAnt, cBloque) { var d = CR.xor(CR.aes.descifra(cBloque, clave), cAnt); var n = d[15]; if (n < 1 || n > 16) return false; for (var i = 16 - n; i < 16; i++) if (d[i] !== n) return false; return true; }
      function pinta() {
        var cAnt = cif.slice((bloque - 1) * 16, bloque * 16).slice(), cBloque = cif.slice(bloque * 16, (bloque + 1) * 16);
        var real = CR.aes.descifra(cBloque, clave);
        var byteReal = real[15], necesario = byteReal ^ 1;   // el c_ant que deja el ultimo byte del claro en 01
        cAnt[15] = prueba;
        var ok = oraculo(cAnt, cBloque);
        var h = '<b>Eva ataca el último byte del bloque ' + (bloque + 1) + '.</b> No conoce la clave.\n\n';
        h += 'pone en el último byte de C[' + (bloque - 1) + ']: <b>' + CR.hex([prueba]) + '</b>\nel servidor responde: ' + (ok ? '<span class="cr-ok">relleno VÁLIDO</span>' : '<span class="cr-tenue">relleno inválido</span>') + '\n\n';
        if (ok) h += 'Válido significa que el último byte del claro ha quedado en 01.\nComo m = D(C) ⊕ C[ant], el byte de D(C) es ' + CR.hex([prueba]) + ' ⊕ 01 = ' + CR.hex([prueba ^ 1]) + '.\nY el byte real del mensaje es ese ⊕ (el C[ant] verdadero ' + CR.hex([cif[(bloque - 1) * 16 + 15]]) + ') = <b>' + CR.hex([(prueba ^ 1) ^ cif[(bloque - 1) * 16 + 15]]) + '</b> = «' + (byteReal >= 32 && byteReal < 127 ? String.fromCharCode(byteReal) : '·') + '»  <span class="cr-dif">descifrado sin la clave</span>';
        else h += '<span class="cr-tenue">Eva prueba el siguiente valor. El bueno es ' + CR.hex([necesario]) + '.</span>';
        out.set(h);
      }
      W.slider(W.row(host), { label: 'valor que prueba Eva en el byte', min: 0, max: 255, step: 1, value: prueba, format: function (v) { return CR.hex([v]); }, on: function (v) { prueba = v; pinta(); } });
      W.buttons(host, [{ t: 'Saltar al valor que el servidor acepta', on: function () { var cBloque = cif.slice(bloque * 16, (bloque + 1) * 16); prueba = CR.aes.descifra(cBloque, clave)[15] ^ 1; pinta(); } }]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Otros desastres reales');

  p.table(['Fallo', 'Qué se filtró', 'Caso'], [
    ['Consumo eléctrico', 'los bits de la clave, por el pico de corriente de cada operación', 'tarjetas inteligentes, años 90'],
    ['Tiempo de la exponenciación', 'los bits de $d$ en RSA, por lo que tarda cada cuadrado y producto', 'servidores web, 2003'],
    ['Nonce repetido en ECDSA', 'la clave privada entera, con dos firmas', 'PlayStation 3, 2010'],
    ['Azar predecible', 'miles de claves con factores comunes', 'aparatos de red, 2012'],
    ['Mensaje de error del relleno', 'el mensaje entero, byte a byte', 'TLS, Lucky Thirteen, 2013']
  ]);

  p.text('El patrón es siempre el mismo: la matemática era correcta, y el sistema filtraba por un lado ' +
    'que el modelo no contemplaba. Las defensas son de ingeniería, no de teoría: comparar en tiempo ' +
    'constante, cifrar y sellar de modo que el error sea siempre el mismo, exponenciar con un camino ' +
    'que no dependa de los bits de la clave, y sacar todo el azar de un generador criptográfico bien ' +
    'sembrado. Por eso no se debe programar criptografía a mano: se usan bibliotecas que ya han ' +
    'pasado por estos golpes.');

  p.util('Estos ataques no son de laboratorio. La medición del consumo eléctrico se usa para clonar ' +
    'tarjetas y mandos; el ataque de tiempo sobre RSA de 2003 funcionaba a través de la red; el fallo ' +
    'del nonce de la PlayStation 3 permitió firmar software propio y no tuvo arreglo posible, porque ' +
    'la clave ya estaba expuesta. Por eso los chips de las tarjetas y los móviles llevan contramedidas ' +
    'físicas, y por eso el consejo unánime de los criptógrafos es: no implementes tú los algoritmos, ' +
    'usa una biblioteca revisada y mantenla actualizada.');

  p.hist('Paul Kocher abrió el campo en 1996 con el ataque de tiempo sobre RSA, y en 1999, con Jaffe y ' +
    'Jun, el del consumo eléctrico. Serge Vaudenay describió el oráculo de relleno en 2002; ' +
    'reapareció en 2013 como Lucky Thirteen y en 2014 como POODLE, y cada vez hubo que parchear la web ' +
    'entera. El fallo de azar de 2012 lo destaparon Lenstra y Heninger de forma independiente, ' +
    'recogiendo claves públicas de todo internet y buscando factores comunes con un cálculo de ' +
    'máximos comunes divisores.');

  p.trampas([
    { e: 'Comparar secretos con el «igual» del lenguaje', por: 'Para en el primer byte distinto y filtra por tiempo. Se compara acumulando diferencias con XOR y mirando el total al final.' },
    { e: 'Dar errores distintos para «relleno mal» y «autenticación mal»', por: 'El error de relleno es un oráculo que descifra el mensaje. El error tiene que ser siempre el mismo, y por eso se verifica el MAC antes de mirar el relleno.' },
    { e: 'Exponenciar saltándose los productos de los bits a cero', por: 'El tiempo y el consumo revelan qué bits de la clave son 1. Se hace siempre la misma secuencia de operaciones.' },
    { e: 'Sembrar el generador de azar con la hora o el identificador del aparato', por: 'Dos aparatos con el mismo arranque generan la misma clave, o claves con factores comunes. El azar viene de una fuente física.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El coste del ataque de tiempo',
    level: 'basico',
    gen: function (r) { var n = r.pick([8, 16, 20, 32]); return { n: n, seguro: Math.pow(256, n), timing: 256 * n }; },
    ask: function (d) { return 'Una etiqueta de ' + d.n + ' bytes. Con una comparación en tiempo constante, Eva tiene que adivinarla entera. Con una comparación que filtra por tiempo, la saca byte a byte, probando 256 valores por byte. ¿Cuántas pruebas necesita en cada caso? Da el número del ataque por tiempo, y el exponente del otro como $256^{\\,?}$.'; },
    fields: [{ name: 't', label: 'con el fallo', w: 'tiny' }, { name: 'e', label: 'sin el fallo: 256^', w: 'tiny' }],
    sol: function (d) { return { t: d.timing, e: d.n }; },
    hint: function () { return 'Con el fallo: 256 por cada byte. Sin él: $256^n$.'; },
    steps: function (d) { return ['Con el fallo: $256\\cdot ' + d.n + ' = ' + d.timing + '$ pruebas.', 'Sin él: $256^{' + d.n + '}$, un número de ' + (Math.round(d.n * 2.4)) + ' cifras.', 'La diferencia entre poder y no poder no está en la matemática, sino en cómo se compara.']; },
    answer: function (d) { return d.timing + ' frente a 256^' + d.n; }
  });

  p.exercise({
    title: 'Pruebas del oráculo de relleno',
    level: 'medio',
    gen: function (r) { var bloques = r.int(2, 8); return { bloques: bloques, bytesDescifrables: (bloques - 1) * 16, pruebas: (bloques - 1) * 16 * 128 }; },
    ask: function (d) { return 'Un mensaje cifrado en CBC ocupa ' + d.bloques + ' bloques de 16 bytes. Con un oráculo de relleno, Eva descifra byte a byte, con unas 128 peticiones de media por byte. ¿Cuántos bytes puede descifrar (todos menos el primer bloque, que no tiene anterior controlable salvo el IV) y cuántas peticiones necesita en total?'; },
    fields: [{ name: 'b', label: 'bytes', w: 'tiny' }, { name: 'p', label: 'peticiones', w: 'tiny' }],
    sol: function (d) { return { b: d.bytesDescifrables, p: d.pruebas }; },
    hint: function () { return '16 bytes por cada bloque a partir del segundo, y unas 128 peticiones por byte.'; },
    steps: function (d) { return ['Bytes: $(' + d.bloques + ' - 1)\\cdot 16 = ' + d.bytesDescifrables + '$.', 'Peticiones: $' + d.bytesDescifrables + '\\cdot 128 = ' + U.miles(d.pruebas) + '$, un ataque de minutos.', 'Y todo sin la clave: solo con un servidor que distinga «relleno mal» de «todo mal».']; },
    answer: function (d) { return d.bytesDescifrables + ' bytes, ' + U.miles(d.pruebas) + ' peticiones'; }
  });

  p.exercise({
    title: 'Detectar la fuga por tiempo',
    level: 'medio',
    gen: function (r) { var ciclosBien = r.int(40, 60), porByte = r.pick([2, 3, 5]), aciertos = r.int(1, 6); return { base: ciclosBien, porByte: porByte, aciertos: aciertos, t: ciclosBien + porByte * aciertos }; },
    ask: function (d) { return 'Una comparación ingenua tarda ' + d.base + ' ciclos de arranque más ' + d.porByte + ' ciclos por cada byte inicial que coincide, antes de encontrar el primer fallo. Si Eva mide ' + d.t + ' ciclos, ¿cuántos bytes iniciales ha acertado su intento?'; },
    fields: [{ name: 'a', label: 'bytes acertados', w: 'tiny' }],
    sol: function (d) { return { a: d.aciertos }; },
    hint: function () { return 'Resta el arranque y divide entre los ciclos por byte.'; },
    steps: function (d) { return ['$(' + d.t + ' - ' + d.base + ') / ' + d.porByte + ' = ' + d.aciertos + '$ bytes acertados.', 'Eva prueba valores del byte siguiente y se queda con el que sube el tiempo: así avanza uno más.']; },
    answer: function (d) { return String(d.aciertos); }
  });

  p.exercise({
    title: 'Claves con factores comunes',
    level: 'avanzado',
    gen: function (r) { var ps = [10007, 10009, 10037, 10039, 10061, 10067, 10069], pc = r.pick(ps), q1 = r.pick(ps), q2 = r.pick(ps); if (q1 === pc || q2 === pc || q1 === q2) return null; return { p: pc, q1: q1, q2: q2, n1: pc * q1, n2: pc * q2 }; },
    ask: function (d) { return 'Dos aparatos generaron sus claves RSA con un generador de azar defectuoso y, sin saberlo, usaron el mismo primo. Sus módulos públicos son $n_1 = ' + U.miles(d.n1) + '$ y $n_2 = ' + U.miles(d.n2) + '$. Calcula $\\operatorname{mcd}(n_1, n_2)$: ¿qué obtienes, y qué permite?'; },
    fields: [{ name: 'g', label: 'mcd', w: 'tiny' }],
    sol: function (d) { return { g: d.p }; },
    hint: function () { return 'El máximo común divisor de los dos módulos con Euclides.'; },
    steps: function (d) { return ['$\\operatorname{mcd}(' + U.miles(d.n1) + ', ' + U.miles(d.n2) + ') = ' + d.p + '$: el primo compartido.', 'Con él, $q_1 = n_1 / ' + d.p + ' = ' + d.q1 + '$ y $q_2 = n_2 / ' + d.p + ' = ' + d.q2 + '$: las dos claves quedan factorizadas.', 'En 2012 esto rompió decenas de miles de claves reales de internet, con un solo cálculo de máximos comunes divisores entre todos los módulos recogidos. La matemática de RSA estaba intacta; el azar, no.']; },
    answer: function (d) { return String(d.p); }
  });

  p.exercise({
    title: '¿Constante o no?',
    level: 'avanzado',
    gen: function (r) { var casos = [{ t: 'Recorrer los 32 bytes siempre, acumulando a |= x[i] ⊕ y[i], y comprobar a == 0 al final', v: 'si' }, { t: 'Devolver falso en cuanto x[i] ≠ y[i]', v: 'no' }, { t: 'Comparar primero las longitudes y, si son iguales, recorrer todos los bytes acumulando diferencias', v: 'si' }, { t: 'Exponenciar haciendo el producto solo en los bits del exponente que valen 1', v: 'no' }, { t: 'Buscar el mensaje en una tabla indexada por los primeros bytes del hash', v: 'no' }, { t: 'Hacer siempre la misma secuencia de cuadrado y producto, y descartar el producto cuando el bit es 0', v: 'si' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return '¿Se ejecuta en tiempo constante, es decir, independiente de los datos secretos? «' + d.c.t + '»'; },
    fields: [{ name: 'q', label: 'Constante', opts: [{ t: 'sí', v: 'si' }, { t: 'no: filtra por tiempo', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return '¿El número de operaciones depende de algún valor secreto, o del punto en que dos cosas dejan de coincidir?'; },
    steps: function (d) { return [d.c.v === 'si' ? 'El trabajo es el mismo pase lo que pase con los datos: no filtra nada.' : 'El tiempo o el patrón de operaciones depende de un secreto (dónde falla la comparación, qué bits de la clave son 1, o un acceso a memoria dependiente del dato): es un canal lateral.']; },
    answer: function (d) { return d.c.v === 'si' ? 'sí' : 'no'; }
  });

  p.keys([
    'Un cifrado correcto puede filtrar la clave por el tiempo, el consumo eléctrico, los errores o el azar: es la diferencia entre el algoritmo y el sistema.',
    'Comparar secretos en tiempo constante: recorrer siempre todos los bytes acumulando diferencias, sin salir antes.',
    'El oráculo de relleno de CBC descifra el mensaje entero sin la clave si el servidor distingue «relleno mal» de «autenticación mal».',
    'Nonce repetido, azar predecible y errores distintos han roto sistemas reales con la matemática intacta.',
    'Por eso no se implementa criptografía a mano: se usan bibliotecas revisadas.'
  ]);
});
