/* Tema: Pruebas de conocimiento cero y compromisos */
Course.topic('cr-conocimiento-cero', function (p) {

  p.puente('La [[cr-firmas|firma de Schnorr]] era un protocolo de tres mensajes convertido en firma. Aquí ' +
    'se mira ese protocolo tal cual, y resulta ser algo más raro que una firma: una forma de demostrar ' +
    'que se conoce un [[cr-logdiscreto|logaritmo discreto]] sin revelar nada de él. Hacen falta la ' +
    '[[pe-probabilidad|probabilidad]] de engañar y las [[cr-hash|funciones hash]] para comprometerse.');

  p.text('Peggy dice que conoce la contraseña de una cueva mágica. Víctor no se fía, y Peggy no quiere ' +
    'decírsela. ¿Puede convencerlo sin que él aprenda nada, ni siquiera algo que le sirva para ' +
    'convencer a un tercero? Puede, y la idea, que parece un acertijo, está hoy en sistemas de ' +
    'identificación, en cadenas de bloques y en la forma de demostrar que uno es mayor de edad sin ' +
    'enseñar el carné.');

  /* ---------------------------------------------------------------- */
  p.section('La cueva de Alí Babá');

  p.text('La cueva tiene forma de anillo con una puerta al fondo que solo se abre con la contraseña. ' +
    'Peggy entra y elige un lado al azar; Víctor, que espera fuera sin verla, grita después «sal por ' +
    'la izquierda» o «sal por la derecha», también al azar. Si Peggy conoce la contraseña, sale por ' +
    'donde le pidan, cruzando la puerta si hace falta. Si no la conoce, solo acierta cuando Víctor ' +
    'pide el lado por el que entró: la mitad de las veces.');

  p.formula('P(\\text{engañar en } n \\text{ rondas}) = 2^{-n}', 'la probabilidad de un impostor',
    'Se lee: <em>«la probabilidad de engañar en ene rondas es dos elevado a menos ene»</em>. Con 20 ' +
    'rondas, una entre un millón; con 40, una entre un billón.<br><br>Y Víctor no aprende la ' +
    'contraseña: solo ve a Peggy salir por donde él pidió. Si grabara todo en vídeo, el vídeo no ' +
    'convencería a nadie, porque Peggy y Víctor podrían haberlo pactado de antemano. Eso es ' +
    '<strong>conocimiento cero</strong>: lo que Víctor ve, podría haberlo fabricado él solo.');

  p.demo({
    title: 'Rondas en la cueva',
    intro: 'Elige si Peggy conoce la contraseña y cuántas rondas exige Víctor. Un impostor tiene que adivinar cada vez el lado que Víctor pedirá. La demo juega las rondas y cuenta cuántas veces, de muchas repeticiones, el impostor consigue pasarlas todas.',
    predice: 'Con 10 rondas, ¿qué fracción de los impostores pasará: la mitad, una de cada diez, o una de cada mil?',
    build: function (host) {
      var sabe = false, rondas = 10, r = U.rng(8);
      var out = W.mono(host, '');
      function juega() {
        var h = '<b>' + (sabe ? 'Peggy conoce la contraseña' : 'Peggy es una impostora') + '</b>, ' + rondas + ' rondas:\n';
        var pasa = true;
        for (var i = 0; i < rondas; i++) {
          var entra = r.int(0, 1), pide = r.int(0, 1), ok = sabe || entra === pide;
          if (i < 8) h += 'ronda ' + (i + 1) + ': entra por ' + (entra ? 'dcha' : 'izq') + ', Víctor pide ' + (pide ? 'dcha' : 'izq') + ' → ' + (ok ? '<span class="cr-ok">sale</span>' : '<span class="cr-dif">no puede</span>') + '\n';
          if (!ok) { pasa = false; break; }
        }
        h += (rondas > 8 && pasa ? '…\n' : '') + (pasa ? '<span class="cr-ok">Víctor queda convencido.</span>' : '<span class="cr-dif">descubierta en la ronda ' + (i + 1) + '.</span>') + '\n\n';
        if (!sabe) {
          var N = 2000, exitos = 0;
          for (var t = 0; t < N; t++) { var bien = true; for (var j = 0; j < rondas; j++) if (r.int(0, 1) !== r.int(0, 1)) { bien = false; break; } if (bien) exitos++; }
          h += '<b>' + U.miles(N) + ' impostores</b> intentándolo: pasan ' + exitos + ' (' + U.fmt(100 * exitos / N, 2) + ' %). Teoría: 2^−' + rondas + ' = ' + U.fmt(100 * Math.pow(2, -rondas), rondas > 6 ? 4 : 2) + ' %.';
        } else h += 'Con la contraseña, Peggy pasa siempre, y Víctor no ha visto nada que un impostor con suerte no hubiera producido igual.';
        out.set(h);
      }
      W.chips(host, [{ label: 'Peggy impostora', value: false }, { label: 'Peggy conoce la contraseña', value: true }], { value: sabe, on: function (v) { sabe = v; juega(); } });
      W.slider(W.row(host), { label: 'rondas', min: 1, max: 20, step: 1, value: rondas, on: function (v) { rondas = v; juega(); } });
      W.buttons(host, [{ t: 'Jugar otra vez', cls: 'btn--main', on: juega }]);
      juega();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Schnorr: demostrar que sabes x');

  p.text('La cueva de verdad es el logaritmo discreto. Peggy tiene $x$ y ha publicado $y = g^x$. Quiere ' +
    'convencer a Víctor de que conoce $x$ sin decírselo. El protocolo son tres mensajes:');

  p.table(['Paso', 'Quién', 'Qué', 'Papel'], [
    ['1', 'Peggy', 'elige $k$ al azar y envía $r = g^k$', 'el <strong>compromiso</strong>: entrar en la cueva por un lado'],
    ['2', 'Víctor', 'elige un reto $c$ al azar y lo envía', 'gritar «por la derecha»'],
    ['3', 'Peggy', 'envía $s = k + c\\,x \\bmod q$', 'salir por donde se pidió'],
    ['4', 'Víctor', 'comprueba $g^{s} = r\\,y^{c}$', 'ver por dónde sale']
  ]);

  p.text('Si Peggy no conoce $x$ pero adivina el reto $c$ antes de comprometerse, hace trampa: elige $s$ al ' +
    'azar y calcula $r = g^s y^{-c}$, que pasará la comprobación. Por eso $c$ tiene que ser ' +
    'impredecible y llegar después de $r$. Y si una impostora pudiera responder a <em>dos</em> retos ' +
    'distintos con el mismo $r$, tendría $s_1 - s_2 = x(c_1 - c_2)$ y conocería $x$: luego no era ' +
    'impostora. Ese argumento se llama <strong>extracción</strong>, y es la prueba de que el ' +
    'protocolo es sólido.');

  p.formula('\\text{simulador: elegir } s, c \\text{ al azar}, \\ r = g^{s}\\,y^{-c} \\quad\\Longrightarrow\\quad (r, c, s) \\text{ pasa la verificación}',
    'por qué es conocimiento cero',
    'Se lee: <em>«eligiendo primero la respuesta y el reto, y calculando el compromiso a partir de ' +
    'ellos, se fabrica una conversación válida sin conocer x»</em>. Las conversaciones fabricadas así ' +
    'tienen exactamente la misma distribución que las reales: lo que Víctor ve no le enseña nada, ' +
    'porque podría haberlo generado él mismo. Solo el <em>orden</em> en que ocurrió, con $c$ después ' +
    'de $r$, le convence a él, y a nadie más.');

  p.demo({
    title: 'Peggy honesta y Peggy tramposa',
    intro: 'Con $p = 1019$, $g$ de orden 509, y $y = g^x$ público. La Peggy honesta responde con $s = k + cx$. La tramposa no tiene $x$: apuesta por un reto $c$ y prepara $r$ para ese reto; acierta si Víctor pide justo ese $c$. Juega varias rondas y compara.',
    predice: 'Si los retos van de 0 a 508, ¿qué probabilidad tiene la tramposa de pasar una ronda? ¿Y si los retos fueran solo 0 o 1?',
    build: function (host) {
      var P = 1019, q = 509, g = 4, x = 123, tramposa = false, retos = 509, r = U.rng(12);
      var out = W.mono(host, '');
      function ronda() {
        var y = CR.potMod(g, x, P), h = '<b>y = g^x = ' + y + '</b>, retos de 0 a ' + (retos - 1) + '\n\n', rr, s, c, apuesta;
        if (!tramposa) { var k = r.int(1, q - 1); rr = CR.potMod(g, k, P); c = r.int(0, retos - 1); s = CR.mod(k + c * x, q); h += 'Peggy: k = ' + k + ', r = g^k = ' + rr + '\nVíctor: c = ' + c + '\nPeggy: s = k + c·x mod q = ' + s + '\n'; }
        else { apuesta = r.int(0, retos - 1); s = r.int(0, q - 1); rr = CR.mulMod(CR.potMod(g, s, P), CR.inv(CR.potMod(y, apuesta, P), P), P); c = r.int(0, retos - 1); h += 'Peggy (sin x) apuesta a que el reto será ' + apuesta + ': elige s = ' + s + ' y calcula r = g^s · y^(−' + apuesta + ') = ' + rr + '\nVíctor: c = ' + c + '\nPeggy responde el s preparado: ' + s + '\n'; }
        var ok = CR.potMod(g, s, P) === CR.mulMod(rr, CR.potMod(y, c, P), P);
        h += 'Víctor comprueba g^s = ' + CR.potMod(g, s, P) + ' y r·y^c = ' + CR.mulMod(rr, CR.potMod(y, c, P), P) + ': ' + (ok ? '<span class="cr-ok">acepta</span>' : '<span class="cr-dif">rechaza</span>') + (tramposa ? (ok ? '  (ha acertado el reto: 1 entre ' + retos + ')' : '  (apostó ' + apuesta + ', salió ' + c + ')') : '');
        out.set(h);
      }
      W.chips(host, [{ label: 'Peggy honesta', value: false }, { label: 'Peggy tramposa', value: true }], { value: tramposa, on: function (v) { tramposa = v; ronda(); } });
      W.chips(host, [{ label: 'retos 0 o 1', value: 2 }, { label: 'retos de 0 a 15', value: 16 }, { label: 'retos de 0 a 508', value: 509 }], { value: retos, on: function (v) { retos = v; ronda(); } });
      W.buttons(host, [{ t: 'Otra ronda', cls: 'btn--main', on: ronda }]);
      ronda();
    }
  });

  p.ejemplo({
    title: 'Una ronda de Schnorr con p = 23',
    enunciado: 'Con $p = 23$, $g = 4$ de orden $q = 11$, Peggy tiene $x = 7$ y ha publicado $y = 8$. Hacer una ronda con $k = 3$ y reto $c = 5$, verificar, y después mostrar cómo una impostora fabricaría una conversación válida sabiendo el reto de antemano.',
    pasos: [
      { t: '<strong>Compromiso.</strong> $r = 4^3 = 64 = 2\\cdot 23 + 18 \\equiv 18$.', antes: '¿Cuánto es $4^3$ módulo 23?' },
      { t: '<strong>Respuesta.</strong> $s = k + cx = 3 + 5\\cdot 7 = 38 \\equiv 5 \\pmod{11}$.', antes: 'Ojo: $s$ se reduce módulo el orden $q = 11$, no módulo 23.' },
      { t: '<strong>Verificación.</strong> $g^s = 4^5 = 1024 \\equiv 12$. $r\\,y^c = 18\\cdot 8^5$: $8^2 \\equiv 18$, $8^4 \\equiv 2$, $8^5 \\equiv 16$, y $18\\cdot 16 = 288 \\equiv 12$. Coinciden: Víctor acepta.', antes: 'Calcula $4^5$ y $18\\cdot 8^5$ módulo 23.' },
      { t: '<strong>La impostora.</strong> Si supiera que el reto será $c = 5$, elegiría $s = 9$ y calcularía $r = g^s y^{-c} = 4^9\\cdot 8^{-5}$. $4^9 = 4^5\\cdot 4^4 \\equiv 12\\cdot 3 = 36 \\equiv 13$; $8^{-5} = 16^{-1}$, y $16\\cdot 13 = 208 = 9\\cdot 23 + 1$, así que es 13. $r = 13\\cdot 13 = 169 \\equiv 8$. La conversación $(8, 5, 9)$ pasa: $4^9 \\equiv 13$ y $8\\cdot 8^5 = 8\\cdot 16 = 128 \\equiv 13$ ✓. Sin $x$.' }
    ],
    cierre: 'Con el reto elegido después del compromiso, la impostora solo acierta una de cada 11 veces; con retos de 256 bits, nunca. Y las conversaciones válidas se fabrican sin $x$: por eso no revelan nada.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Compromisos: un sobre cerrado');

  p.text('El primer mensaje de Schnorr es un <strong>compromiso</strong>: fija una elección sin ' +
    'revelarla. Con una función hash se hace con cualquier cosa: para comprometerse con un valor ' +
    '$v$ se publica $H(n \\Vert v)$, donde $n$ es un número al azar grande. Nadie puede saber $v$ ' +
    '(la función no se invierte, y el $n$ evita probar candidatos), y nadie puede abrir el sobre ' +
    'con otro valor (habría que encontrar una colisión). Es un sobre lacrado que se puede enviar ' +
    'por internet.');

  p.formulas([
    'C = H(n \\,\\Vert\\, v) \\quad \\text{(comprometerse)}, \\qquad \\text{revelar } (n, v) \\text{ y comprobar } H(n \\Vert v) = C',
    '\\text{moneda: } A \\text{ envía } C = H(n \\Vert a);\\ B \\text{ envía } b;\\ A \\text{ revela } (n, a);\\ \\text{resultado } a \\oplus b'
  ], 'compromiso con hash, y lanzar una moneda por teléfono',
    'Se lee: <em>«el compromiso es el hash del nonce concatenado con el valor»</em>. Dos propiedades: ' +
    '<strong>oculta</strong> (no se sabe $v$ hasta que se abre) y <strong>ata</strong> (no se puede ' +
    'abrir con otro $v$).<br><br>La moneda: Alicia se compromete con un bit, Benito dice el suyo en ' +
    'claro, Alicia abre el sobre, y el resultado es el XOR. Ninguno de los dos puede sesgarlo: ' +
    'Alicia ya estaba atada cuando Benito habló, y Benito no sabía qué había en el sobre.');

  p.demo({
    title: 'Una moneda por teléfono',
    intro: 'Alicia elige un bit y un nonce y publica el hash. Benito elige su bit. Alicia abre el compromiso y el resultado es el XOR. Intenta hacer trampa: cambia el bit de Alicia después de que Benito haya hablado y mira si el hash cuadra.',
    predice: 'Si Alicia intenta cambiar su bit al abrir el sobre, ¿qué comprobación falla? ¿Y qué tendría que encontrar para que no fallara?',
    build: function (host) {
      var a = 1, b = 0, nonce = 'k7Qz19', abreCon = 1;
      var out = W.mono(host, '');
      function pinta() {
        var C = CR.sha256(nonce + '|' + a), ok = CR.sha256(nonce + '|' + abreCon) === C;
        out.set('<b>1. Alicia se compromete:</b> C = SHA-256("' + U.escape(nonce) + '|' + a + '") = ' + C.slice(0, 24) + '…\n<b>2. Benito dice:</b> b = ' + b + '\n<b>3. Alicia abre:</b> nonce = "' + U.escape(nonce) + '", bit = ' + abreCon + '\n<b>4. Benito comprueba:</b> SHA-256("' + U.escape(nonce) + '|' + abreCon + '") ' + (ok ? '= C  <span class="cr-ok">cuadra</span>' : '≠ C  <span class="cr-dif">no cuadra: Alicia ha cambiado el bit</span>') + '\n\n' + (ok ? '<b>resultado:</b> ' + abreCon + ' ⊕ ' + b + ' = <b>' + (abreCon ^ b) + '</b>' : 'Para abrir con el otro bit, Alicia necesitaría un nonce n′ con SHA-256(n′|' + abreCon + ') = C: una preimagen, 2^256 intentos.'));
      }
      W.chips(host, [{ label: 'Alicia elige 0', value: 0 }, { label: 'Alicia elige 1', value: 1 }], { value: a, on: function (v) { a = v; abreCon = v; pinta(); } });
      W.chips(host, [{ label: 'Benito dice 0', value: 0 }, { label: 'Benito dice 1', value: 1 }], { value: b, on: function (v) { b = v; pinta(); } });
      W.chips(host, [{ label: 'Alicia abre con 0', value: 0 }, { label: 'Alicia abre con 1', value: 1 }], { value: abreCon, on: function (v) { abreCon = v; pinta(); } });
      W.texto(host, { label: 'nonce de Alicia', value: nonce, max: 20, corto: true, on: function (v) { nonce = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Alicia se compromete con un bit publicando $H(v)$, sin nonce. ¿Qué falla?', [
    { t: 'Que no oculta nada: Benito calcula $H(0)$ y $H(1)$ y ve cuál coincide', ok: true, por: 'Con pocos valores posibles, un hash sin aleatoriedad se «invierte» probando. El nonce hace que las preimágenes posibles sean $2^{256}$ por cada valor.' },
    { t: 'Que no ata: Alicia puede abrir con el otro bit', ok: false, por: 'Atar sí ata: abrir con otro bit exigiría $H(0) = H(1)$, una colisión. Lo que se pierde es la ocultación.' },
    { t: 'Nada: un hash no se invierte', ok: false, por: 'No se invierte en general, pero con dos candidatos no hace falta invertir: se prueban.' }
  ]);

  p.util('El protocolo de Schnorr convertido en firma con el truco de Fiat y Shamir, sustituir el reto ' +
    'de Víctor por un hash, es la firma de las curvas modernas. Las pruebas de conocimiento cero ' +
    'generales, que demuestran cualquier afirmación calculable, se usan desde 2016 en cadenas de ' +
    'bloques para validar transacciones sin revelarlas, y empiezan a usarse para acreditar la edad ' +
    'o la nacionalidad sin enseñar el documento entero. Los compromisos están en las subastas ' +
    'electrónicas de sobre cerrado, en los juegos en línea que sortean sin árbitro y en todo ' +
    'protocolo en que alguien tiene que elegir antes de saber.');

  p.hist('Shafi Goldwasser, Silvio Micali y Charles Rackoff definieron las pruebas de conocimiento cero ' +
    'en 1985; la cueva de Alí Babá la contó Jean-Jacques Quisquater con su familia en un artículo de ' +
    '1989 titulado «cómo explicar los protocolos de conocimiento cero a tus hijos». Amos Fiat y Adi ' +
    'Shamir mostraron en 1986 cómo quitar la interacción con un hash, y Claus Schnorr dio su ' +
    'protocolo en 1989. Manuel Blum planteó la moneda por teléfono en 1981. Goldwasser y Micali ' +
    'recibieron el premio Turing en 2012.');

  p.trampas([
    { e: 'Dejar que Peggy vea el reto antes de comprometerse', por: 'Con el reto conocido fabrica $r = g^s y^{-c}$ y pasa sin conocer $x$. El compromiso va primero, siempre.' },
    { e: 'Reutilizar el $k$ del compromiso', por: 'Dos rondas con el mismo $r$ y retos distintos dan $x = (s_1 - s_2)/(c_1 - c_2)$: es la extracción, hecha por Eva.' },
    { e: 'Comprometerse con $H(v)$ sin nonce', por: 'Con pocos valores posibles se prueban todos. El nonce al azar es lo que oculta.' },
    { e: 'Creer que una grabación de la prueba convence a un tercero', por: 'Una conversación válida se fabrica sin el secreto eligiendo el reto primero. Solo quien eligió el reto después del compromiso tiene motivos para creer.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La probabilidad de la impostora',
    level: 'basico',
    gen: function (r) { var n = r.int(3, 12), retos = r.pick([2, 2, 4, 16]); return { n: n, retos: retos, p: Math.pow(retos, -n) }; },
    ask: function (d) { return 'En cada ronda Víctor elige uno de ' + d.retos + ' retos posibles, y una impostora solo pasa si adivina cuál. ¿Qué probabilidad tiene de pasar ' + d.n + ' rondas seguidas? Da el valor con notación científica o como fracción.'; },
    fields: [{ name: 'p', label: 'probabilidad', w: 'wide' }],
    sol: function (d) { return { p: d.p }; },
    rel: 1e-3,
    hint: function () { return 'Rondas independientes: la probabilidad de cada una, elevada al número de rondas.'; },
    steps: function (d) { return ['Cada ronda: $1/' + d.retos + '$.', '$(1/' + d.retos + ')^{' + d.n + '} = ' + d.p.toExponential(2).replace('e-', '\\cdot 10^{-') + '}$.', 'Con retos de 256 bits, una sola ronda ya es $2^{-256}$.']; },
    answer: function (d) { return d.p.toExponential(2); }
  });

  p.exercise({
    title: 'Cuántas rondas',
    level: 'basico',
    gen: function (r) { var e = r.pick([3, 6, 9, 12, 20]); return { e: e, n: Math.ceil(e * Math.LN10 / Math.LN2) }; },
    ask: function (d) { return 'Con retos de dos posibilidades, ¿cuántas rondas hacen falta para que la probabilidad de que una impostora pase sea menor que $10^{-' + d.e + '}$?'; },
    fields: [{ name: 'n', label: 'rondas', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function () { return '$2^{-n} < 10^{-e}$: $n > e\\,\\log_2 10 \\approx 3{,}32\\,e$, redondeando hacia arriba.'; },
    steps: function (d) { return ['$n > ' + d.e + '\\cdot 3{,}32 = ' + U.fmt(d.e * Math.LN10 / Math.LN2, 2) + '$.', 'Hacen falta $' + d.n + '$ rondas: $2^{-' + d.n + '} \\approx ' + Math.pow(2, -d.n).toExponential(1).replace('e-', '\\cdot 10^{-') + '}$.']; },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'La respuesta de Peggy',
    level: 'medio',
    gen: function (r) { var q = 11, P = 23, g = 4, x = r.int(1, 10), k = r.int(1, 10), c = r.int(1, 10); return { q: q, P: P, g: g, x: x, k: k, c: c, y: CR.potMod(g, x, P), r: CR.potMod(g, k, P), s: CR.mod(k + c * x, q), izq: CR.potMod(g, CR.mod(k + c * x, q), P) }; },
    ask: function (d) { return 'Schnorr con $p = 23$, $g = 4$ de orden 11. Peggy tiene $x = ' + d.x + '$ ($y = ' + d.y + '$) y ha enviado $r = g^{' + d.k + '} = ' + d.r + '$. Víctor pide $c = ' + d.c + '$. ¿Qué $s$ envía Peggy, y cuánto vale $g^s \\bmod 23$, que Víctor comparará con $r\\,y^c$?'; },
    fields: [{ name: 's', label: 's', w: 'tiny' }, { name: 'g', label: 'g^s mod 23', w: 'tiny' }],
    sol: function (d) { return { s: d.s, g: d.izq }; },
    errores: [{ si: function (v, d) { return v.s === CR.mod(d.k + d.c * d.x, 23) && CR.mod(d.k + d.c * d.x, 23) !== d.s; }, msg: '$s$ se reduce módulo el orden de $g$, que es 11, no módulo 23.' }],
    hint: function () { return '$s = k + c\\,x \\bmod 11$, y después $4^s \\bmod 23$.'; },
    steps: function (d) { return ['$s = ' + d.k + ' + ' + d.c + '\\cdot ' + d.x + ' = ' + (d.k + d.c * d.x) + ' \\equiv ' + d.s + ' \\pmod{11}$.', '$4^{' + d.s + '} \\bmod 23 = ' + d.izq + '$, y $r\\,y^c = ' + d.r + '\\cdot ' + d.y + '^{' + d.c + '} \\bmod 23 = ' + CR.mulMod(d.r, CR.potMod(d.y, d.c, 23), 23) + '$: coinciden.']; },
    answer: function (d) { return 's = ' + d.s + ', g^s = ' + d.izq; }
  });

  p.exercise({
    title: 'Abrir un compromiso',
    level: 'medio',
    gen: function (r) { var bits = r.pick([8, 16, 20, 32, 64]), valores = r.pick([2, 10, 100]); return { bits: bits, valores: valores, sin: valores, con: valores * Math.pow(2, bits) }; },
    ask: function (d) { return 'Alicia se compromete con uno de ' + d.valores + ' valores posibles publicando $H(n \\Vert v)$ con un nonce $n$ de ' + d.bits + ' bits. Para descubrir $v$ probando, ¿cuántos hashes tiene que calcular Benito como máximo? ¿Y si no hubiera nonce?'; },
    fields: [{ name: 'c', label: 'con nonce', w: 'wide' }, { name: 's', label: 'sin nonce', w: 'tiny' }],
    sol: function (d) { return { c: d.con, s: d.sin }; },
    rel: 1e-6,
    hint: function () { return 'Cada valor con cada nonce posible.'; },
    steps: function (d) { return ['Sin nonce: ' + d.valores + ' hashes, uno por valor. No oculta nada.', 'Con nonce: $' + d.valores + '\\cdot 2^{' + d.bits + '} = ' + (d.con < 1e15 ? U.miles(d.con) : d.con.toExponential(2).replace('e+', '\\cdot 10^{') + '}') + '$.', d.bits < 32 ? 'Pocos: un nonce de ' + d.bits + ' bits no basta. Se usan 128 o 256.' : 'Fuera de alcance: el compromiso oculta.']; },
    answer: function (d) { return U.miles(d.con) + ' y ' + d.sin; }
  });

  p.exercise({
    title: 'Extraer el secreto',
    level: 'avanzado',
    gen: function (r) { var q = 11, x = r.int(1, 10), k = r.int(1, 10), c1 = r.int(1, 10), c2 = r.int(1, 10); if (c1 === c2) return null; return { q: q, x: x, k: k, c1: c1, c2: c2, s1: CR.mod(k + c1 * x, q), s2: CR.mod(k + c2 * x, q), inv: CR.inv(CR.mod(c1 - c2, q), q) }; },
    ask: function (d) { return 'Una supuesta impostora responde a dos retos distintos con el mismo compromiso $r$ (orden $q = 11$): al reto $c_1 = ' + d.c1 + '$ con $s_1 = ' + d.s1 + '$, y al reto $c_2 = ' + d.c2 + '$ con $s_2 = ' + d.s2 + '$. Extrae $x$ de las dos respuestas. ¿Era impostora?'; },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'q', label: 'era impostora', opts: [{ t: 'sí', v: 'si' }, { t: 'no: conocía x', v: 'no' }] }],
    sol: function (d) { return { x: d.x, q: 'no' }; },
    hint: function (d) { return ['$s_1 - s_2 = x\\,(c_1 - c_2) \\pmod{11}$.', 'El inverso de $c_1 - c_2 \\equiv ' + CR.mod(d.c1 - d.c2, 11) + '$ es ' + d.inv + '.']; },
    steps: function (d) { return ['$x = (s_1 - s_2)(c_1 - c_2)^{-1} = ' + CR.mod(d.s1 - d.s2, 11) + '\\cdot ' + d.inv + ' \\equiv ' + d.x + ' \\pmod{11}$.', 'Quien puede responder a dos retos con el mismo compromiso conoce $x$: no era impostora. Eso es lo que hace sólido el protocolo, y también lo que castiga reutilizar $k$.']; },
    answer: function (d) { return 'x = ' + d.x + ', conocía x'; }
  });

  p.keys([
    'Una prueba de conocimiento cero convence de que se sabe un secreto sin revelar nada: lo que ve el verificador podría haberlo fabricado él.',
    'La cueva: un impostor pasa $n$ rondas con probabilidad $2^{-n}$. Schnorr: compromiso $r = g^k$, reto $c$, respuesta $s = k + cx$, verificación $g^s = r\\,y^c$.',
    'Sólido porque dos respuestas al mismo compromiso extraen $x$; de conocimiento cero porque $(r, c, s)$ se simula eligiendo $s$ y $c$ primero.',
    'Fiat-Shamir: el reto como hash convierte la prueba en una firma.',
    'Un compromiso $H(n \\Vert v)$ oculta (por el nonce) y ata (por las colisiones): un sobre lacrado, que sirve para lanzar una moneda por teléfono.'
  ]);
});
