/* Tema: El cifrado de Cesar: sumar en un reloj de 26 horas */
Course.topic('cr-cesar', function (p) {

  p.puente('El tema anterior fijó las reglas: método público, clave secreta, y contar cuántas claves hay. ' +
    'Este pone el primer cifrado de la historia sobre la [[av-numeros|aritmética del reloj]]: las ' +
    'letras son números del 0 al 25, cifrar es sumar y el reloj tiene 26 horas.');

  p.text('Julio César, según cuenta Suetonio, escribía sus cartas privadas sustituyendo cada letra por la ' +
    'que estaba tres puestos más allá en el alfabeto. Es un cifrado tan débil que hoy sirve de ' +
    'juego, y sin embargo contiene, en pequeño, todo lo que hará falta después: una regla que ' +
    'transforma, una clave que la ajusta, una operación que la deshace y un ataque que la rompe.');

  /* ---------------------------------------------------------------- */
  p.section('Las letras como números');

  p.text('Para hacer cuentas con letras hay que numerarlas: $A = 0$, $B = 1$, …, $Z = 25$. Empezar en 0 ' +
    'y no en 1 no es un capricho: es lo que hace que «sumar 26» sea dar una vuelta entera y volver ' +
    'a la misma letra, exactamente como las 12 horas del reloj. Desplazar el alfabeto $k$ puestos ' +
    'es sumar $k$ y quedarse con el resto módulo 26.');

  p.formulas([
    'c = (m + k) \\bmod 26',
    'm = (c - k) \\bmod 26'
  ], 'cifrado de César con clave k',
    'Se lee: <em>«ce es igual a eme más ka, módulo veintiséis»</em>: la letra cifrada es la letra del ' +
    'mensaje desplazada $k$ puestos, dando la vuelta al llegar a la Z.<br><br>' +
    'La segunda línea descifra: se resta la misma clave. Si sale negativo, se suman 26. Por ejemplo, ' +
    'con $k = 3$ la Y ($24$) se cifra como $27 \\bmod 26 = 1$, la B; y la B se descifra como ' +
    '$1 - 3 = -2 \\equiv 24$, la Y.');

  p.demo({
    title: 'El disco de César',
    intro: 'Escribe un mensaje y mueve la clave. La tabla muestra a qué letra va cada una; fíjate en que las últimas letras dan la vuelta y aparecen al principio.',
    predice: 'Con $k = 13$, cifra la palabra HOLA y vuelve a cifrar el resultado con el mismo $k = 13$. ¿Qué sale? ¿Pasa lo mismo con $k = 5$?',
    build: function (host) {
      var k = 3, msg = 'ATAQUE AL AMANECER';
      var tabla = U.el('div.cr-letras');
      host.appendChild(tabla);
      var out = W.mono(host, '');
      function pinta() {
        tabla.innerHTML = '';
        for (var i = 0; i < 26; i++) tabla.appendChild(U.el('span', { html: '<i>' + CR.ABC.charAt(i) + '</i><b>' + CR.letra(i + k) + '</b>' }));
        var t = CR.limpia(msg, true);
        var c = t.split('').map(function (ch) { return ch === ' ' ? ' ' : CR.letra(CR.num(ch) + k); }).join('');
        out.set('<b>mensaje:</b>  ' + U.escape(t) + '\n<b>cifrado:</b>  ' + U.escape(c) + '\n<span class="cr-tenue">descifrar es restar ' + k + ', o lo que es lo mismo, sumar ' + (26 - k) % 26 + '</span>');
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 60, on: function (v) { msg = v; pinta(); } });
      W.slider(W.row(host), { label: 'clave k', min: 0, max: 25, step: 1, value: k, on: function (v) { k = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Con la clave $k = 3$, ¿cómo se cifra la letra X?', [
    { t: 'A: $X = 23$, $23 + 3 = 26$, y $26 \\bmod 26 = 0$, que es la A', ok: true, por: 'Al pasar de la Z se vuelve a empezar. Por eso las letras se numeran desde 0: así 26 es «una vuelta entera».' },
    { t: 'No se puede: después de la Z no hay letras', ok: false, por: 'El alfabeto se cierra en círculo, como el reloj. Después de las 12 vienen la 1; después de la Z, la A.' },
    { t: 'Z: se llega hasta el final y se para ahí', ok: false, por: 'Entonces X, Y y Z darían todas Z y el cifrado no se podría deshacer. Cifrar tiene que ser biyectivo.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Descifrar es cifrar');

  p.text('Restar $k$ módulo 26 es lo mismo que sumar $26 - k$. Así que descifrar un César de clave 3 es ' +
    'cifrar con clave 23: la misma máquina sirve para las dos cosas, solo cambia el número que se ' +
    'le pone. Y hay una clave especial: con $k = 13$, cifrar dos veces devuelve el original, porque ' +
    '$13 + 13 = 26$. Es el <strong>ROT13</strong> de los foros de internet, que se usa no para ' +
    'esconder sino para que el lector tenga que querer leer: la solución de un acertijo, el final ' +
    'de una película.');

  p.text('Dos Césares seguidos son otro César: cifrar con $k_1$ y luego con $k_2$ es sumar $k_1 + k_2$, ' +
    'reducido módulo 26. Encadenar el mismo cifrado no lo hace más fuerte, y esa observación, que aquí ' +
    'es trivial, será importante cuando aparezcan cifrados que sí ganan al componerse.');

  p.ejemplo({
    title: 'Cifrar y descifrar ZORRO',
    enunciado: 'Cifrar la palabra ZORRO con $k = 5$, y descifrar después el resultado.',
    pasos: [
      { t: '<strong>A números.</strong> Z = 25, O = 14, R = 17, R = 17, O = 14.', antes: '¿Qué número le toca a cada letra, empezando en A = 0?' },
      { t: '<strong>Sumar 5 y reducir.</strong> $25 + 5 = 30 \\equiv 4$, que es la E. $14 + 5 = 19$, T. $17 + 5 = 22$, W. Y otra vez W y T. Cifrado: <strong>ETWWT</strong>.', antes: 'La Z se pasa de 25: ¿qué queda al restar 26?' },
      { t: '<strong>Descifrar.</strong> Restar 5: E = 4, $4 - 5 = -1 \\equiv 25$, Z. T = 19, $19 - 5 = 14$, O. W = 22, $22 - 5 = 17$, R. Recuperado ZORRO ✓.', antes: 'Con la E sale un número negativo. ¿Cómo se vuelve al rango 0 a 25?' },
      { t: '<strong>Lo que ya se ve.</strong> Las dos R se cifran igual, como W. Un cifrado que manda cada letra siempre a la misma letra conserva la forma de las palabras, y eso es una pista para quien quiera romperlo.' }
    ],
    cierre: 'Restar 5 es sumar 21: se podría haber descifrado con la máquina de cifrar puesta en 21.'
  });

  /* ---------------------------------------------------------------- */
  p.section('La fuerza bruta');

  p.text('El método es público, así que Eva sabe que es un César. Solo le faltan 25 claves por probar, ' +
    'y no le hace falta ni saber cuál es la buena: la reconoce porque es la única que produce ' +
    'castellano. La demo hace las 25 pruebas y las ordena por lo que se parecen al castellano, ' +
    'con la medida que verás en el tema siguiente.');

  p.demo({
    title: 'Las 25 llaves',
    intro: 'Pega un texto cifrado con César, o cifra tú uno con el botón. La lista prueba todas las claves y marca la que da un texto con las frecuencias de letras del castellano.',
    predice: '¿Cuántas de las 25 pruebas darán un texto que parezca castellano? ¿Podría haber dos claves que dieran las dos texto con sentido?',
    build: function (host) {
      var cifrado = CR.cesar('El mensaje llega al puente al amanecer', 17);
      var out = W.mono(host, '');
      var campo = W.texto(host, { label: 'texto cifrado', value: cifrado, max: 120, on: function (v) { cifrado = v; pinta(); } });
      function pinta() {
        var t = CR.limpia(cifrado), lista = [];
        if (t.length < 3) { out.set('Escribe algo más largo.'); return; }
        for (var k = 0; k < 26; k++) {
          var m = CR.cesar(t, -k);
          lista.push({ k: k, m: m, chi: CR.chi2(CR.frecuencias(m), m.length) });
        }
        var mejor = lista.slice().sort(function (a, b) { return a.chi - b.chi; })[0];
        var h = '';
        lista.forEach(function (x) {
          var es = x.k === mejor.k;
          h += (es ? '<span class="cr-ok">' : '<span class="cr-tenue">') + (x.k < 10 ? ' ' : '') + 'k = ' + x.k + '  χ² = ' + (x.chi < 100 ? ' ' : '') + Math.round(x.chi) + '  ' + (es ? '<b>' + x.m.slice(0, 44) + '</b>' : x.m.slice(0, 44)) + '</span>\n';
        });
        out.set(h);
      }
      W.buttons(host, [{ t: 'Cifrar otro mensaje con una clave al azar', on: function () {
        var frases = ['Nos vemos en la plaza a las cinco', 'La clave esta debajo de la maceta', 'Todo secreto acaba por saberse', 'El tren sale a las siete y media'];
        var k = 1 + Math.floor(Math.random() * 25);
        cifrado = CR.cesar(frases[Math.floor(Math.random() * frases.length)], k);
        campo.set(cifrado, false); pinta();
      } }]);
      pinta();
    }
  });

  p.text('Veinticinco pruebas son pocas incluso a mano. La conclusión no es que el César sea malo por ' +
    'antiguo, sino por un motivo concreto que se puede medir: <strong>su espacio de claves es ' +
    '25</strong>. Todo cifrado con pocas claves cae así, por muy ingenioso que sea el método.');

  p.util('El ROT13 sigue en uso en foros y en algunos programas para que un texto no se lea por ' +
    'accidente. Y la idea de «sumar una clave letra a letra» es exactamente lo que hacen los ' +
    'cifrados modernos, con dos cambios: el alfabeto son los 256 valores de un byte, y la clave ' +
    'no es un número sino un chorro de números distintos para cada posición, tan largo como el ' +
    'mensaje. Ese cifrado, que llegará en unos temas, es el único del que se sabe que es ' +
    'irrompible.');

  p.hist('Suetonio, en su <em>Vida de los doce césares</em>, cuenta que Julio César cifraba con un ' +
    'desplazamiento de tres y que Augusto, su sobrino, usaba uno, y además no daba la vuelta: ' +
    'escribía AA en lugar de la Z. El sistema era seguro en su época sencillamente porque casi ' +
    'nadie sabía leer, y menos aún en latín. Quince siglos después, Leon Battista Alberti construyó ' +
    'en 1467 el primer disco de cifrar, dos ruedas concéntricas con alfabetos que se giran: la ' +
    'demo de arriba es ese disco.');

  p.trampas([
    { e: 'Numerar las letras desde 1', por: 'Con A = 1, sumar 26 no devuelve la misma letra y el reloj se desajusta. La A tiene que ser el 0, como las 12 del reloj son el 0.' },
    { e: 'Dar un resultado negativo o mayor que 25', por: 'Descifrar la B con $k = 3$ da $-2$, que no es una letra. Se suman 26: $24$, la Y.' },
    { e: 'Creer que cifrar dos veces protege más', por: 'Dos Césares de claves 7 y 9 son un César de clave 16. Eva sigue teniendo 25 pruebas.' },
    { e: 'Esperar que Eva no sepa que es un César', por: 'Kerckhoffs: el método es público. Lo que le falta es la clave, y son 25.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var PALABRAS = ['AMIGO', 'CASA', 'LIBRO', 'ESCUELA', 'PUENTE', 'SECRETO', 'MENSAJE', 'CLAVE', 'NUMERO', 'CIUDAD', 'VERANO', 'CAMINO', 'PUERTA', 'FUEGO', 'NOCHE', 'TIEMPO'];

  p.exercise({
    title: 'Cifra una palabra',
    level: 'basico',
    gen: function (r) { var w = r.pick(PALABRAS), k = r.int(1, 25); return { w: w, k: k, c: CR.cesar(w, k) }; },
    ask: function (d) { return 'Cifra la palabra <strong>' + d.w + '</strong> con el cifrado de César de clave $k = ' + d.k + '$.'; },
    fields: [{ name: 'c', label: 'cifrado', w: 'wide' }],
    sol: function (d) { return { c: d.c }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.c);
      if (!t) return { ok: false, msg: 'Escribe la palabra cifrada.' };
      if (t === d.c) return { ok: true };
      if (t === CR.cesar(d.w, -d.k)) return { ok: false, msg: 'Has restado la clave: eso es descifrar. Para cifrar se suma.' };
      if (t === CR.cesar(d.w, d.k + 1)) return { ok: false, msg: 'Te has pasado en uno: seguramente has numerado la A como 1. La A es el 0.' };
      return { ok: false, msg: 'No coincide. Suma ' + d.k + ' a cada letra, y si te pasas de la Z, resta 26.' };
    },
    hint: function (d) { return ['Pasa cada letra a número (A = 0), suma ' + d.k + ' y reduce módulo 26.', 'La ' + d.w.charAt(0) + ' es el ' + CR.num(d.w.charAt(0)) + ': se convierte en el ' + CR.mod(CR.num(d.w.charAt(0)) + d.k, 26) + ', que es la ' + d.c.charAt(0) + '.']; },
    steps: function (d) {
      return d.w.split('').map(function (ch) { var n = CR.num(ch); return ch + ' = ' + n + ' → $' + n + ' + ' + d.k + ' = ' + (n + d.k) + (n + d.k >= 26 ? ' \\equiv ' + ((n + d.k) % 26) : '') + '$ → ' + CR.letra(n + d.k); }).concat(['Cifrado: <strong>' + d.c + '</strong>.']);
    },
    answer: function (d) { return d.c; }
  });

  p.exercise({
    title: 'Descifra una letra',
    level: 'basico',
    gen: function (r) { var m = r.int(0, 25), k = r.int(1, 25); return { m: m, k: k, c: CR.mod(m + k, 26) }; },
    ask: function (d) { return 'Un mensaje cifrado con César de clave $k = ' + d.k + '$ contiene la letra <strong>' + CR.letra(d.c) + '</strong>. ¿Qué letra era en el original?'; },
    fields: [{ name: 'l', label: 'letra', w: 'tiny' }],
    sol: function (d) { return { l: CR.letra(d.m) }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.l);
      if (t.length !== 1) return { ok: false, msg: 'Escribe una sola letra.' };
      if (t === CR.letra(d.m)) return { ok: true };
      if (t === CR.letra(d.c + d.k)) return { ok: false, msg: 'Has sumado la clave: eso cifra otra vez. Para descifrar se resta.' };
      return { ok: false, msg: 'No es esa. Resta ' + d.k + ' al número de la letra; si sale negativo, suma 26.' };
    },
    hint: function (d) { return 'La ' + CR.letra(d.c) + ' es el ' + d.c + '. Réstale ' + d.k + (d.c - d.k < 0 ? ' y, como sale negativo, suma 26' : '') + '.'; },
    steps: function (d) {
      return [CR.letra(d.c) + ' = ' + d.c + '.', '$' + d.c + ' - ' + d.k + ' = ' + (d.c - d.k) + (d.c - d.k < 0 ? ' \\equiv ' + d.m + ' \\pmod{26}' : '') + '$.', 'El ' + d.m + ' es la <strong>' + CR.letra(d.m) + '</strong>.'];
    },
    answer: function (d) { return CR.letra(d.m); }
  });

  p.exercise({
    title: 'Encuentra la clave',
    level: 'medio',
    gen: function (r) { var m = r.int(0, 25), k = r.int(1, 25); return { m: m, k: k, c: CR.mod(m + k, 26) }; },
    ask: function (d) { return 'Se sabe que en un mensaje cifrado con César la letra <strong>' + CR.letra(d.m) + '</strong> del original aparece como <strong>' + CR.letra(d.c) + '</strong>. ¿Cuál es la clave $k$, entre 1 y 25?'; },
    fields: [{ name: 'k', label: 'k', w: 'tiny' }],
    sol: function (d) { return { k: d.k }; },
    errores: [{ si: function (v, d) { return d.k !== 13 && v.k === 26 - d.k; }, msg: 'Esa es la clave para pasar del cifrado al original, es decir, la de descifrar. La de cifrar es la opuesta módulo 26.' }],
    hint: function () { return 'La clave es la diferencia entre el número de la letra cifrada y el de la original, módulo 26.'; },
    steps: function (d) {
      return [CR.letra(d.m) + ' = ' + d.m + ' y ' + CR.letra(d.c) + ' = ' + d.c + '.', '$k = ' + d.c + ' - ' + d.m + ' = ' + (d.c - d.m) + (d.c - d.m < 0 ? ' \\equiv ' + d.k + ' \\pmod{26}' : '') + '$.', 'Una sola pareja de letras basta para romper un César: eso es lo que se llama un ataque con texto conocido.'];
    },
    answer: function (d) { return 'k = ' + d.k; }
  });

  p.exercise({
    title: 'Claves equivalentes',
    level: 'medio',
    gen: function (r) {
      var tipo = r.int(0, 1), k1 = r.int(1, 25), k2 = r.int(1, 25), K = r.int(27, 120);
      return { tipo: tipo, k1: k1, k2: k2, K: K, suma: CR.mod(k1 + k2, 26), red: K % 26 };
    },
    ask: function (d) {
      if (d.tipo === 0) return 'Un mensaje se cifra con César de clave ' + d.k1 + ' y el resultado se vuelve a cifrar con clave ' + d.k2 + '. ¿A qué clave única, entre 0 y 25, equivale hacer las dos cosas?';
      return 'Alguien cifra con «clave ' + d.K + '», sumando ' + d.K + ' a cada letra y reduciendo módulo 26. ¿Qué clave entre 0 y 25 hace exactamente lo mismo?';
    },
    fields: [{ name: 'k', label: 'clave', w: 'tiny' }],
    sol: function (d) { return { k: d.tipo === 0 ? d.suma : d.red }; },
    errores: [{ si: function (v, d) { return d.tipo === 0 && d.k1 + d.k2 >= 26 && v.k === d.k1 + d.k2; }, msg: 'Falta reducir: esa clave da más de una vuelta al alfabeto. Resta 26.' }],
    hint: function () { return 'Sumar dos veces es sumar la suma, y sumar 26 es no hacer nada.'; },
    steps: function (d) {
      if (d.tipo === 0) return ['Cifrar dos veces suma $' + d.k1 + ' + ' + d.k2 + ' = ' + (d.k1 + d.k2) + '$ a cada letra.', 'Módulo 26: $' + d.suma + '$.', 'Dos Césares son un César: encadenarlos no añade seguridad.'];
      return ['$' + d.K + ' = ' + Math.floor(d.K / 26) + '\\cdot 26 + ' + d.red + '$.', 'Las vueltas completas no cambian nada: equivale a la clave $' + d.red + '$.', 'Por eso el espacio de claves es 26 y no infinito.'];
    },
    answer: function (d) { return String(d.tipo === 0 ? d.suma : d.red); }
  });

  p.exercise({
    title: 'Fuerza bruta',
    level: 'avanzado',
    gen: function (r) {
      var w = r.pick(PALABRAS), k = r.int(1, 25), c = CR.cesar(w, k);
      // que ninguna otra clave de otra palabra de la lista: si no, la respuesta no seria unica
      for (var j = 0; j < 26; j++) { if (j === k) continue; if (PALABRAS.indexOf(CR.cesar(c, -j)) >= 0) return null; }
      return { w: w, k: k, c: c };
    },
    ask: function (d) { return 'El texto <strong>' + d.c + '</strong> es una palabra castellana cifrada con César. Encuentra la clave y la palabra.'; },
    fields: [{ name: 'k', label: 'clave', w: 'tiny' }, { name: 'w', label: 'palabra', w: 'wide' }],
    sol: function (d) { return { k: d.k, w: d.w }; },
    check: function (v, d) {
      var w = CR.limpia(v.raw.w), okW = w === d.w, okK = v.k === d.k;
      if (okW && okK) return { ok: true };
      if (okW && !okK) return { ok: false, msg: 'La palabra es esa. La clave es lo que se suma al original para llegar al cifrado, no al revés.', fields: { k: false, w: true } };
      if (!w) return { ok: false, msg: 'Prueba las 25 claves: solo una da una palabra.' };
      return { ok: false, msg: 'No es esa palabra. Descifra con cada clave del 1 al 25 y busca la que da castellano.', fields: { k: okK, w: false } };
    },
    hint: function (d) { return ['No hay atajo: resta 1, 2, 3… a todas las letras hasta que salga una palabra.', 'La primera letra, ' + d.c.charAt(0) + ', es el ' + CR.num(d.c.charAt(0)) + '. Con la clave buena se convierte en la ' + d.w.charAt(0) + '.']; },
    steps: function (d) {
      return ['Probando claves, con $k = ' + d.k + '$ sale <strong>' + d.w + '</strong>: ' + d.c.split('').map(function (ch) { return ch + '→' + CR.letra(CR.num(ch) - d.k); }).join(', ') + '.',
        'Las demás claves dan grupos de letras sin sentido.',
        'Veinticinco pruebas a mano: por eso el César solo vale como juego.'];
    },
    answer: function (d) { return 'k = ' + d.k + ', ' + d.w; }
  });

  p.keys([
    'Las letras se numeran desde $A = 0$ hasta $Z = 25$, y el alfabeto se cierra en círculo: es aritmética módulo 26.',
    'César: $c = (m + k) \\bmod 26$. Descifrar es restar $k$, o sumar $26 - k$.',
    'Dos Césares seguidos son un César: encadenar el mismo cifrado no añade seguridad.',
    'Con 25 claves, la fuerza bruta lo rompe al instante, y la clave buena se reconoce porque produce castellano.',
    'El motivo de la debilidad se mide: el espacio de claves es 25.'
  ]);
});
