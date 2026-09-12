/* Tema: Certificados y el candado del navegador */
Course.topic('cr-certificados', function (p) {

  p.puente('[[cr-logdiscreto|Diffie-Hellman]] acordaba una clave con quien estuviera al otro lado, y ' +
    'Mallory podía ser ese alguien. Las [[cr-firmas|firmas]] resuelven la mitad: prueban que un ' +
    'mensaje viene de una clave. Falta saber <em>de quién</em> es la clave, y eso es un ' +
    'certificado. Con él, un [[cr-mac|cifrado autenticado]] y una [[cr-hash|función hash]], se ' +
    'monta lo que pasa en los primeros milisegundos de cada conexión segura.');

  p.text('Cuando escribes la dirección de tu banco, tu navegador recibe una clave pública y con ella ' +
    'acuerda una clave de sesión. La pregunta es cómo sabe que esa clave es del banco y no de ' +
    'Mallory, que está en la wifi de la cafetería. La respuesta es un papel firmado por alguien en ' +
    'quien el navegador ya confía: un <strong>certificado</strong>. El candado es la suma de esa ' +
    'firma, un intercambio de claves y un cifrado autenticado.');

  /* ---------------------------------------------------------------- */
  p.section('Un certificado es una firma sobre una clave pública');

  p.text('Un certificado dice: «la clave pública $K$ pertenece al nombre <em>banco.es</em>, es válida ' +
    'hasta tal fecha, y lo firma tal autoridad». La autoridad certificadora comprobó antes de ' +
    'firmar que quien pedía el certificado controlaba ese dominio. Y el navegador trae de fábrica ' +
    'las claves públicas de un centenar de autoridades raíz: son la única confianza que no se ' +
    'demuestra, y todo lo demás se deduce de ella con firmas.');

  p.formula('\\text{cert} = \\bigl(\\text{nombre},\\ K,\\ \\text{fechas},\\ \\text{emisor}\\bigr),\\ \\ \\text{firma}_{\\text{emisor}}\\bigl(H(\\text{cert})\\bigr)',
    'lo que hay dentro de un certificado',
    'Se lee: <em>«un certificado es un nombre, una clave, unas fechas y un emisor, y la firma del ' +
    'emisor sobre el hash de todo eso»</em>.<br><br>Verificarlo es: calcular el hash de los datos, ' +
    'verificar la firma con la clave pública del emisor, comprobar que el nombre coincide con la web ' +
    'que se ha pedido y que la fecha no ha pasado. Y para tener la clave del emisor hace falta ' +
    '<em>su</em> certificado: así se sube por la <strong>cadena</strong> hasta una raíz que el ' +
    'navegador ya tenía.');

  p.demo({
    title: 'Una cadena de tres certificados',
    intro: 'Una raíz firma un certificado intermedio, y la intermedia firma el del servidor. Todo con RSA de juguete y hashes de verdad. Cambia el nombre del servidor después de emitido el certificado, o marca «Mallory» para que el último lo firme una clave que no es la intermedia, y mira qué comprobación falla.',
    predice: 'Si Mallory tiene un certificado válido para su propia web y lo presenta cuando pides banco.es, ¿qué comprobación lo detiene: la firma, la fecha o el nombre?',
    build: function (host) {
      var nombre = 'banco.es', presentado = 'banco.es', mallory = false;
      var r = U.rng(23);
      function par() { var pp = CR.primoAleatorio(r, 1000000, 9999999), q = CR.primoAleatorio(r, 1000000, 9999999); return { n: pp * q, e: 65537, d: CR.inv(65537, (pp - 1) * (q - 1)) }; }
      var raiz = par(), inter = par(), serv = par(), mal = par();
      var out = W.mono(host, '');
      function resumen(t, n) { var h = CR.sha256Bytes(t), v = 0; for (var i = 0; i < 6; i++) v = v * 256 + h[i]; return v % n; }
      function firma(datos, clave) { return CR.potMod(resumen(datos, clave.n), clave.d, clave.n); }
      function verifica(datos, s, clave) { return CR.potMod(s, clave.e, clave.n) === resumen(datos, clave.n); }
      function pinta() {
        var dInter = 'CN=Autoridad Intermedia; clave=' + inter.n + '; válido hasta 2030; emisor=Raíz';
        var sInter = firma(dInter, raiz);
        var dServ = 'CN=' + nombre + '; clave=' + serv.n + '; válido hasta 2027; emisor=Autoridad Intermedia';
        var sServ = firma(dServ, mallory ? mal : inter);
        var dPres = 'CN=' + presentado + '; clave=' + serv.n + '; válido hasta 2027; emisor=Autoridad Intermedia';
        var okInter = verifica(dInter, sInter, raiz), okServ = verifica(dPres, sServ, inter), okNombre = presentado === 'banco.es';
        var h = '<b>raíz</b> (en el navegador): clave pública n = ' + U.miles(raiz.n) + '\n\n';
        h += '<b>certificado intermedio:</b> ' + U.escape(dInter) + '\n  firma de la raíz: ' + U.miles(sInter) + '  →  ' + (okInter ? '<span class="cr-ok">verifica con la clave de la raíz</span>' : '<span class="cr-dif">no verifica</span>') + '\n\n';
        h += '<b>certificado del servidor</b> (tal como se presenta): ' + U.escape(dPres) + '\n  firma: ' + U.miles(sServ) + '  →  ' + (okServ ? '<span class="cr-ok">verifica con la clave de la intermedia</span>' : '<span class="cr-dif">no verifica con la clave de la intermedia</span>') + '\n';
        h += '  nombre pedido: banco.es  →  ' + (okNombre ? '<span class="cr-ok">coincide</span>' : '<span class="cr-dif">no coincide con ' + U.escape(presentado) + '</span>') + '\n\n';
        h += (okInter && okServ && okNombre ? '<span class="cr-ok">cadena válida: la clave ' + U.miles(serv.n) + ' es de banco.es</span>' : '<span class="cr-dif">el navegador muestra un aviso y no conecta</span>');
        out.set(h);
      }
      W.texto(host, { label: 'nombre presentado en el certificado del servidor', value: presentado, max: 30, on: function (v) { presentado = v; pinta(); } });
      W.chips(host, [{ label: 'firmado por la intermedia', value: false }, { label: 'firmado por Mallory', value: true }], { value: mallory, on: function (v) { mallory = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Un servidor presenta un certificado con la firma correcta de una autoridad de confianza, en fecha, pero a nombre de otro dominio. ¿Qué hace el navegador?', [
    { t: 'Rechazarlo: el certificado es auténtico, pero no dice que esa clave sea de la web que se ha pedido', ok: true, por: 'La firma prueba que la autoridad emitió ese certificado, para ese nombre. Si el nombre no es el pedido, la clave puede ser de Mallory, que tiene un certificado legítimo de su propia web.' },
    { t: 'Aceptarlo: la firma es válida y la autoridad es de confianza', ok: false, por: 'Entonces Mallory usaría el certificado de su web para hacerse pasar por el banco. El nombre es parte esencial de lo que se firma.' },
    { t: 'Pedir otro certificado a la autoridad', ok: false, por: 'El navegador no habla con la autoridad durante la conexión: comprueba lo que trae de fábrica y lo que le envía el servidor. Si no encaja, avisa.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El apretón de manos');

  p.text('Con el certificado verificado, cliente y servidor hacen un Diffie-Hellman con curvas, y el ' +
    'servidor <strong>firma</strong> su parte con la clave del certificado: así Mallory no puede ' +
    'sustituirla, porque no puede firmarla. De la clave compartida se derivan con un hash las claves ' +
    'de sesión, y a partir de ahí todo va con cifrado autenticado. En la versión actual del protocolo ' +
    'esto ocupa un viaje de ida y vuelta:');

  p.table(['Paso', 'Quién', 'Qué envía', 'Para qué'], [
    ['1', 'cliente', 'un número al azar y su parte del Diffie-Hellman, $aG$', 'empezar el acuerdo de clave'],
    ['2', 'servidor', 'su parte, $bG$; su certificado; la firma de todo lo dicho hasta aquí; un MAC de «terminado»', 'que la clave sea suya y nadie haya tocado nada'],
    ['3', 'cliente', 'verifica cadena, firma y MAC; envía su «terminado»', 'ya hay claves de sesión'],
    ['4', 'ambos', 'datos cifrados con AES-GCM o ChaCha20-Poly1305', 'la conversación']
  ]);

  p.formulas([
    'S = ab\\,G, \\qquad k_{\\text{sesión}} = \\text{HKDF}\\bigl(S,\\ \\text{transcripción}\\bigr)',
    '\\text{servidor: } \\text{firma}_{K_{\\text{cert}}}\\bigl(H(\\text{todo lo enviado})\\bigr)'
  ], 'las claves de una sesión',
    'Se lee: <em>«la clave de sesión sale de aplicar una función de derivación al secreto compartido y ' +
    'a la transcripción»</em>. HKDF es HMAC usado para estirar el secreto en tantas claves como haga ' +
    'falta.<br><br>La firma cubre la transcripción entera, incluidos los dos números al azar: una ' +
    'firma de otra sesión no sirve, y Mallory, que tendría que cambiar $bG$, no puede firmar el ' +
    'cambio. Y como $a$ y $b$ se tiran al acabar, quien robe la clave del certificado dentro de un ' +
    'año no podrá descifrar la sesión de hoy: es el <strong>secreto hacia delante</strong>.');

  p.demo({
    title: 'El apretón de manos, con y sin Mallory',
    intro: 'Un Diffie-Hellman pequeño y una firma del servidor sobre lo enviado. Activa a Mallory: sustituye la parte del servidor por la suya, pero la firma que reenvía es sobre el valor original, y el cliente lo nota.',
    predice: 'Mallory conoce todos los valores públicos. ¿Qué es lo único que no puede producir para engañar al cliente?',
    build: function (host) {
      var P = 1019, g = 4, a = 200, b = 300, m = 77, mallory = false;
      var r = U.rng(29), pp = CR.primoAleatorio(r, 1000000, 9999999), q = CR.primoAleatorio(r, 1000000, 9999999), cert = { n: pp * q, e: 65537, d: CR.inv(65537, (pp - 1) * (q - 1)) };
      var out = W.mono(host, '');
      function resumen(t) { var h = CR.sha256Bytes(t), v = 0; for (var i = 0; i < 6; i++) v = v * 256 + h[i]; return v % cert.n; }
      function pinta() {
        var A = CR.potMod(g, a, P), B = CR.potMod(g, b, P), M = CR.potMod(g, m, P);
        var transcripcionServ = 'A=' + A + ';B=' + B, s = CR.potMod(resumen(transcripcionServ), cert.d, cert.n);
        var Bvisto = mallory ? M : B, transcripcionCli = 'A=' + A + ';B=' + Bvisto, ok = CR.potMod(s, cert.e, cert.n) === resumen(transcripcionCli);
        var h = '<b>cliente</b> envía A = g^a = ' + A + '\n<b>servidor</b> envía B = g^b = ' + B + ', su certificado, y firma(H("' + transcripcionServ + '")) = ' + U.miles(s) + '\n';
        if (mallory) h += '<b>Mallory</b> sustituye B por M = g^m = ' + M + ' y reenvía la firma tal cual\n';
        h += '\n<b>cliente</b> recibe B = ' + Bvisto + ', verifica la firma sobre "' + transcripcionCli + '": ' + (ok ? '<span class="cr-ok">válida</span>' : '<span class="cr-dif">no válida: lo firmado no es lo recibido. Conexión abortada.</span>') + '\n';
        if (ok) h += 'secreto compartido: B^a = ' + CR.potMod(Bvisto, a, P) + ' = A^b = ' + CR.potMod(A, b, P) + '  →  claves de sesión con HKDF, y a cifrar con AES-GCM.';
        else h += '<span class="cr-tenue">Mallory tendría que firmar "' + transcripcionCli + '" con la clave del certificado, que no tiene.</span>';
        out.set(h);
      }
      W.chips(host, [{ label: 'sin Mallory', value: false }, { label: 'con Mallory en medio', value: true }], { value: mallory, on: function (v) { mallory = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'a del cliente', min: 2, max: 1000, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'b del servidor', min: 2, max: 1000, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Verificar un certificado a mano',
    enunciado: 'La clave pública de una autoridad raíz es $(n, e) = (3233, 17)$. Un certificado intermedio tiene como hash reducido $m = 65$ y lleva la firma $s = 588$. Verificar la firma. Después, alguien altera el certificado y su hash pasa a ser 66: ¿qué pasa?',
    pasos: [
      { t: '<strong>Verificar.</strong> $588^{17} \\bmod 3233$: por cuadrados, $17 = 10001_2$, cuatro cuadrados y un producto, y sale $65$. Coincide con el hash: la raíz firmó ese certificado.', antes: 'Eleva la firma a $e$ y compara con el hash.' },
      { t: '<strong>El certificado alterado.</strong> El hash es 66, pero $588^{17} \\bmod 3233$ sigue siendo 65. No coinciden: la firma no corresponde a este contenido. Rechazado.', antes: 'La firma no ha cambiado. ¿Sigue verificando?' },
      { t: '<strong>Lo que Eva no puede hacer.</strong> Para que verificara necesitaría $s^{*}$ con $s^{*17} \\equiv 66$: eso es descifrar con RSA sin la clave privada. Con $n = 3233$ se factoriza en un instante; con 2048 bits, no.' },
      { t: '<strong>Y después.</strong> Con la clave del intermedio verificada, se repite con el certificado del servidor, se comprueba el nombre y las fechas, y solo entonces se acepta $K$. Tres firmas y unos milisegundos.' }
    ],
    cierre: 'Toda la confianza de la web se reduce a esto: una lista de raíces en el navegador y una cadena de firmas RSA o de curva que se verifica igual que aquí.'
  });

  p.util('Cada conexión con candado hace esto; un navegador verifica miles de cadenas al día. Desde 2015 ' +
    'la autoridad Let\'s Encrypt emite certificados gratis y automáticos, y la web pasó de un tercio ' +
    'cifrada a más del 95 %. Cuando falla, falla en grande: en 2011 la autoridad DigiNotar fue ' +
    'atacada y emitió certificados falsos para dominios de correo, que se usaron para espiar a ' +
    'usuarios en Irán; los navegadores la retiraron y la empresa quebró. Desde entonces existe la ' +
    'transparencia de certificados: registros públicos donde toda emisión queda anotada y cualquiera ' +
    'puede ver si se ha emitido un certificado a su nombre.');

  p.hist('La palabra «certificado» la acuñó Loren Kohnfelder en 1978, en su trabajo de fin de carrera en ' +
    'el MIT, para resolver el problema de distribuir claves públicas. El formato X.509 es de 1988. ' +
    'Netscape creó SSL en 1994 para el comercio electrónico; su sucesor, TLS, se estandarizó en 1999, ' +
    'y la versión 1.3, de 2018, redujo el apretón de manos a un viaje y eliminó los intercambios sin ' +
    'secreto hacia delante. Cada versión anterior se retiró tras un ataque práctico.');

  p.note('Con esto ya está todo lo que hace falta para entender qué pasa cuando abres el móvil. En ' +
    '[[cr-bolsillo|la criptografía en tu bolsillo]] se recorre una mañana normal —desbloquear, ' +
    'conectarse al wifi, mandar un mensaje, pagar— y se señala qué pieza de este bloque trabaja en cada ' +
    'momento. Es el mejor sitio para comprobar cuánto has aprendido: casi todo lo que sale ya tiene ' +
    'nombre.', 'ok', 'Todo junto, un martes cualquiera');

  p.trampas([
    { e: 'Aceptar un certificado porque «la firma es válida»', por: 'Válida para qué nombre y hasta cuándo. El certificado de Mallory para su web es válido y no sirve para el banco.' },
    { e: 'Cifrar la clave de sesión con la clave del certificado', por: 'Así se hacía: quien robe esa clave descifra todo el tráfico pasado grabado. Con Diffie-Hellman efímero y firma, no. Es el secreto hacia delante.' },
    { e: 'Confiar en una raíz «porque está en la lista»', por: 'La lista es la única confianza sin demostración. Una raíz comprometida, como DigiNotar, firma lo que quiera. Por eso hay auditorías y registros públicos.' },
    { e: 'Saltarse el aviso del navegador', por: 'Un aviso de certificado en una wifi pública es exactamente la firma de Mallory que no verifica. Es el ataque, no un fallo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var PRIMOS = [11, 13, 17, 19, 23, 29, 31];
  function claves(r) { var pp = r.pick(PRIMOS), q = r.pick(PRIMOS); if (pp === q) return null; var phi = (pp - 1) * (q - 1), es = [3, 5, 7, 11, 13].filter(function (e) { return ML.gcd(e, phi) === 1; }); if (!es.length) return null; var e = r.pick(es); return { n: pp * q, e: e, d: CR.inv(e, phi) }; }

  p.exercise({
    title: 'Verificar la firma de un certificado',
    level: 'basico',
    gen: function (r) { var k = claves(r); if (!k) return null; var m = r.int(2, k.n - 1), s = CR.potMod(m, k.d, k.n), alterado = r.bool(0.5); var mv = alterado ? CR.mod(m + r.int(1, k.n - 2), k.n) : m; return { n: k.n, e: k.e, m: mv, s: s, v: CR.potMod(s, k.e, k.n), ok: !alterado }; },
    ask: function (d) { return 'La clave pública de una autoridad es $(n, e) = (' + d.n + ', ' + d.e + ')$. Un certificado tiene hash $' + d.m + '$ y firma $' + d.s + '$. Calcula $s^e \\bmod n$. ¿Es válida la firma?'; },
    fields: [{ name: 'v', label: 's^e mod n', w: 'tiny' }, { name: 'q', label: 'válida', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { v: d.v, q: d.ok ? 'si' : 'no' }; },
    hint: function () { return 'Cuadrados sucesivos, y compara con el hash.'; },
    steps: function (d) { return ['$' + d.s + '^{' + d.e + '} \\bmod ' + d.n + ' = ' + d.v + '$.', d.ok ? 'Coincide con el hash ' + d.m + ': la autoridad firmó este certificado.' : 'No coincide con ' + d.m + ': el certificado se ha alterado o la firma no es de esta autoridad. Se rechaza.']; },
    answer: function (d) { return d.v + (d.ok ? ', válida' : ', no válida'); }
  });

  p.exercise({
    title: 'Qué comprobación falla',
    level: 'basico',
    gen: function (r) { var casos = [{ t: 'El certificado es de una autoridad de confianza y está en fecha, pero está emitido a nombre de otro dominio', v: 'nombre' }, { t: 'El certificado tiene el nombre correcto pero lo firma una autoridad que no está en la lista del navegador ni tiene certificado de ninguna raíz', v: 'cadena' }, { t: 'Nombre y cadena correctos, pero la fecha de validez terminó el mes pasado', v: 'fecha' }, { t: 'Todo correcto, salvo que el hash del certificado no coincide con lo que da la firma al verificarla', v: 'firma' }, { t: 'El servidor presenta su certificado y el de la intermedia, pero la firma de la intermedia no verifica con ninguna raíz conocida', v: 'cadena' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return d.c.t + '. ¿Qué comprobación es la que falla?'; },
    fields: [{ name: 'q', label: 'Falla', opts: [{ t: 'el nombre', v: 'nombre' }, { t: 'la cadena hasta una raíz', v: 'cadena' }, { t: 'la fecha', v: 'fecha' }, { t: 'la firma sobre el contenido', v: 'firma' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Cuatro comprobaciones: firma sobre el contenido, cadena hasta una raíz, nombre pedido, fechas.'; },
    steps: function (d) { return [{ nombre: 'La firma es auténtica, pero para otro nombre: no prueba nada sobre el dominio pedido.', cadena: 'Sin un camino de firmas hasta una raíz de la lista, la clave del emisor no está respaldada por nada.', fecha: 'Un certificado caducado puede corresponder a una clave que ya se cambió o se filtró.', firma: 'Si el hash no coincide con lo que da la firma, el contenido se ha alterado o la firma no es del emisor.' }[d.c.v]]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'El secreto compartido de la sesión',
    level: 'medio',
    gen: function (r) { var P = r.pick([23, 29, 31, 37]), g = r.pick([2, 3, 5]); if (CR.orden(g, P) < P - 1) return null; var a = r.int(2, P - 2), b = r.int(2, P - 2); return { P: P, g: g, a: a, b: b, A: CR.potMod(g, a, P), B: CR.potMod(g, b, P), S: CR.potMod(g, a * b, P) }; },
    ask: function (d) { return 'En el apretón de manos, cliente y servidor usan $p = ' + d.P + '$, $g = ' + d.g + '$. El cliente envía $A = ' + d.A + '$ (su secreto es $a = ' + d.a + '$) y el servidor $B = ' + d.B + '$ (secreto $b = ' + d.b + '$), firmado. ¿Cuál es el secreto compartido $S$ del que saldrán las claves de sesión?'; },
    fields: [{ name: 'S', label: 'S', w: 'tiny' }],
    sol: function (d) { return { S: d.S }; },
    hint: function () { return '$S = B^a = A^b \\bmod p$.'; },
    steps: function (d) { return ['Cliente: $' + d.B + '^{' + d.a + '} \\bmod ' + d.P + ' = ' + d.S + '$. Servidor: $' + d.A + '^{' + d.b + '} = ' + d.S + '$.', 'De $S$ y la transcripción, HKDF deriva las claves de cifrado de cada sentido. Al terminar, $a$ y $b$ se borran: secreto hacia delante.']; },
    answer: function (d) { return String(d.S); }
  });

  p.exercise({
    title: 'Secreto hacia delante',
    level: 'medio',
    gen: function (r) { var casos = [{ t: 'Eva grabó el tráfico cifrado de una sesión con Diffie-Hellman efímero y firma; un año después roba la clave privada del certificado del servidor', v: 'no', por: 'La clave del certificado solo firmó; la clave de sesión salió de $a$ y $b$, que se borraron. Con la clave robada puede suplantar al servidor a partir de ahora, pero no leer lo grabado.' }, { t: 'Eva grabó el tráfico de una sesión antigua en la que el cliente cifró la clave de sesión con la clave pública del certificado (RSA); después roba esa clave privada', v: 'si', por: 'Descifra la clave de sesión grabada y con ella todo el tráfico. Ese modo se retiró en TLS 1.3 por esto.' }, { t: 'Eva roba el secreto $a$ del cliente durante la sesión, mientras está en memoria', v: 'si', por: 'Con $a$ y el $B$ público calcula el secreto compartido de esa sesión. El secreto hacia delante protege el pasado, no el presente.' }, { t: 'Eva obtiene la clave de sesión de ayer; hoy hay una sesión nueva con un Diffie-Hellman nuevo', v: 'no', por: 'Cada sesión tiene $a$ y $b$ nuevos: la clave de ayer no dice nada de la de hoy.' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return d.c.t + '. ¿Puede Eva leer el tráfico de esa sesión?'; },
    fields: [{ name: 'q', label: 'Puede', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return '¿De qué depende la clave de sesión, y sigue existiendo lo que Eva ha conseguido?'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'si' ? 'sí' : 'no'; }
  });

  p.exercise({
    title: 'Lo que Mallory tendría que firmar',
    level: 'avanzado',
    gen: function (r) { var k = claves(r); if (!k) return null; var A = r.int(2, 500), B = r.int(2, 500), M = r.int(2, 500); if (M === B) return null; var hOrig = CR.mod(A * 31 + B * 7, k.n), hMal = CR.mod(A * 31 + M * 7, k.n); var s = CR.potMod(hOrig, k.d, k.n); return { n: k.n, e: k.e, A: A, B: B, M: M, hOrig: hOrig, hMal: hMal, s: s, v: CR.potMod(s, k.e, k.n) }; },
    ask: function (d) { return 'El servidor, con certificado $(n, e) = (' + d.n + ', ' + d.e + ')$, firma la transcripción $A = ' + d.A + ', B = ' + d.B + '$, cuyo hash reducido es $' + d.hOrig + '$: la firma es $s = ' + d.s + '$. Mallory sustituye $B$ por $M = ' + d.M + '$, y la transcripción que ve el cliente tiene hash $' + d.hMal + '$. El cliente calcula $s^e \\bmod n$: ¿qué obtiene, y qué concluye?'; },
    fields: [{ name: 'v', label: 's^e mod n', w: 'tiny' }, { name: 'q', label: 'concluye', opts: [{ t: 'firma válida: conecta', v: 'ok' }, { t: 'firma no válida: aborta', v: 'no' }] }],
    sol: function (d) { return { v: d.v, q: 'no' }; },
    hint: function () { return 'La firma se hizo sobre el hash original. El cliente compara $s^e$ con el hash de lo que él ha visto.'; },
    steps: function (d) { return ['$' + d.s + '^{' + d.e + '} \\bmod ' + d.n + ' = ' + d.v + '$, el hash de la transcripción original.', 'El cliente ha visto $M$, y su hash es $' + d.hMal + ' \\ne ' + d.v + '$: la firma no cubre lo recibido. Aborta.', 'Para que colara, Mallory necesitaría $s^{*}$ con $s^{*e} \\equiv ' + d.hMal + '$: firmar con la clave privada del certificado, que no tiene.']; },
    answer: function (d) { return d.v + ', aborta'; }
  });

  p.keys([
    'Un certificado es una firma de una autoridad sobre «este nombre tiene esta clave pública, hasta esta fecha». Se verifica firma, cadena hasta una raíz, nombre y fechas.',
    'La lista de raíces del navegador es la única confianza sin demostración; todo lo demás son firmas.',
    'El apretón de manos: Diffie-Hellman efímero con curvas, firmado por el servidor sobre la transcripción entera, y claves de sesión derivadas con HKDF para un cifrado autenticado.',
    'La firma sobre la transcripción es lo que Mallory no puede producir: sin ella, Diffie-Hellman no identifica a nadie.',
    'Secreto hacia delante: $a$ y $b$ se borran, y robar la clave del certificado mañana no descifra la sesión de hoy.'
  ]);
});
