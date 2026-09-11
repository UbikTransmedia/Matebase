/* Tema: Firmas digitales */
Course.topic('cr-firmas', function (p) {

  p.puente('Un [[cr-mac|código de autenticación]] prueba que el mensaje viene de alguien con la clave, ' +
    'pero esa clave la tienen dos. La firma digital la tiene uno solo: sale de dar la vuelta a ' +
    '[[cr-rsa|RSA]] y de firmar una [[cr-hash|huella]] en vez del mensaje. Y con el ' +
    '[[cr-logdiscreto|logaritmo discreto]] sale otra familia de firmas, con un número al azar que, ' +
    'si se repite, lo entrega todo.');

  p.text('Una firma de tinta prueba poco: se copia. Una firma digital prueba mucho: que el documento lo ' +
    'aprobó quien tiene la clave privada, y que no ha cambiado ni una coma desde entonces. La ' +
    'diferencia con el sello del tema anterior es quién puede comprobarla: <strong>cualquiera</strong>, ' +
    'con la clave pública, y sin poder fabricarla. Eso es lo que hace posible que una actualización ' +
    'del sistema, un certificado o un contrato electrónico se acepten sin conocer a nadie.');

  /* ---------------------------------------------------------------- */
  p.section('Firmar es descifrar');

  p.text('Con RSA, cifrar es elevar a $e$ y descifrar a $d$. Como los dos exponentes se deshacen ' +
    'mutuamente, se pueden usar al revés: quien tiene $d$ eleva el mensaje a $d$, y cualquiera ' +
    'comprueba elevando a $e$, que es público.');

  p.formulas([
    's = m^{d} \\bmod n \\qquad \\text{(firma, con la clave privada)}',
    's^{e} \\bmod n \\overset{?}{=} m \\qquad \\text{(verificación, con la clave pública)}'
  ], 'firma RSA',
    'Se lee: <em>«ese es eme elevado a de, módulo ene; y se comprueba que ese elevado a e vuelve a dar ' +
    'eme»</em>. Solo quien conoce $d$ puede producir un $s$ que, elevado a $e$, dé $m$: es el mismo ' +
    'problema que descifrar sin la clave.<br><br>Frente al MAC hay dos diferencias: la clave de ' +
    'verificar es pública, y Benito no puede fabricar la firma de Alicia aunque la verifique. Por ' +
    'eso una firma se puede enseñar a un tercero, y un MAC no.');

  p.demo({
    title: 'Firmar y verificar con RSA',
    intro: 'Alicia firma un mensaje con su clave privada: en realidad firma un número sacado del hash del mensaje. Benito, o cualquiera, verifica con la clave pública. Cambia el mensaje después de firmar y mira qué pasa.',
    predice: 'Si Eva cambia una letra del mensaje ya firmado, ¿la verificación fallará por el hash, por la firma, o no fallará?',
    build: function (host) {
      var msg = 'Pago 100 euros a Benito', firmado = 'Pago 100 euros a Benito';
      var r = U.rng(17), pp = CR.primoAleatorio(r, 1000000, 9999999), q = CR.primoAleatorio(r, 1000000, 9999999), n = pp * q, e = 65537, d = CR.inv(e, (pp - 1) * (q - 1));
      var out = W.mono(host, '');
      function resumen(t) { var h = CR.sha256Bytes(t), v = 0; for (var i = 0; i < 6; i++) v = v * 256 + h[i]; return v % n; }
      function pinta() {
        var m = resumen(firmado), s = CR.potMod(m, d, n), m2 = resumen(msg), v = CR.potMod(s, e, n);
        out.set('<b>clave pública de Alicia:</b> n = ' + U.miles(n) + ', e = 65 537\n\n<b>Alicia firma</b> «' + U.escape(firmado) + '»:\n  hash reducido: m = ' + U.miles(m) + '\n  s = m^d mod n = ' + U.miles(s) + '\n\n<b>Benito recibe</b> «' + U.escape(msg) + '» con la firma s:\n  hash reducido del mensaje recibido: ' + U.miles(m2) + '\n  s^e mod n = ' + U.miles(v) + '\n  ' + (v === m2 ? '<span class="cr-ok">coinciden: firma válida</span>' : '<span class="cr-dif">no coinciden: el mensaje no es el que se firmó, o la firma no es de Alicia</span>'));
      }
      W.texto(host, { label: 'mensaje que firma Alicia', value: firmado, max: 60, on: function (v) { firmado = v; pinta(); } });
      W.texto(host, { label: 'mensaje que recibe Benito', value: msg, max: 60, on: function (v) { msg = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Por qué se firma el hash');

  p.text('La demo no firma el mensaje: firma un número sacado de su hash. Hay dos razones. La obvia es ' +
    'que un mensaje mide lo que quiera y $m$ tiene que ser menor que $n$. La importante es que firmar ' +
    'el mensaje directamente, el RSA de libro otra vez, permite <strong>falsificar</strong>: Eva ' +
    'elige una firma $s$ cualquiera, calcula $m = s^e \\bmod n$, y ya tiene un mensaje «firmado por ' +
    'Alicia». Es basura, pero es basura con firma válida. Y como RSA es multiplicativo, con dos ' +
    'firmas legítimas de $m_1$ y $m_2$ fabrica la de $m_1 m_2$.');

  p.formula('s = H(m)^{d} \\bmod n, \\qquad \\text{verificar: } s^{e} \\bmod n = H(m)',
    'firmar la huella',
    'Se lee: <em>«ese es el hash de eme elevado a de»</em>. Ahora la falsificación de Eva produce un ' +
    'valor $s^e$ que tendría que ser el hash de algún mensaje: encontrar ese mensaje es una ' +
    'preimagen, $2^{256}$. Y el producto de dos hashes no es el hash de nada.<br><br>En la práctica el ' +
    'hash se rellena hasta el tamaño de $n$ con un esquema estándar (PSS, con aleatoriedad, o el ' +
    'antiguo PKCS#1 v1.5), igual que al cifrar.');

  p.demo({
    title: 'La falsificación existencial',
    intro: 'Eva no tiene la clave privada. Elige un número $s$ al azar y calcula $m = s^e \\bmod n$: la pareja $(m, s)$ pasa la verificación del RSA de libro. Con firma sobre hash, ese $m$ tendría que ser el hash de un mensaje, y Eva no tiene ninguno.',
    predice: '¿Con qué probabilidad el $m = s^e$ que obtiene Eva será un número con sentido, por ejemplo un importe de menos de un millón, si $n$ tiene 14 cifras?',
    build: function (host) {
      var s = 123456789;
      var pp = 1000003, q = 1000033, n = pp * q, e = 65537;
      var out = W.mono(host, '');
      function pinta() {
        var m = CR.potMod(s, e, n);
        out.set('<b>Eva elige</b> s = ' + U.miles(s) + '\n<b>calcula</b> m = s^e mod n = ' + U.miles(m) + '\n\n<b>verificación del RSA de libro:</b> s^e mod n = ' + U.miles(m) + ' = m  <span class="cr-dif">válida</span>\n<span class="cr-tenue">Eva ha «firmado» el mensaje ' + U.miles(m) + ' sin la clave. No lo ha elegido ella: es lo que ha salido.</span>\n\n<b>con firma sobre hash:</b> haría falta un mensaje cuyo hash fuera ' + U.miles(m) + '. Buscarlo cuesta 2^256 intentos.  <span class="cr-ok">inútil</span>');
      }
      W.slider(W.row(host), { label: 's elegido por Eva', min: 2, max: 999999999, step: 1, value: s, on: function (v) { s = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Alicia firma dos contratos con RSA de libro: $s_1$ para el importe 100 y $s_2$ para el importe 300. ¿Qué puede hacer Eva?', [
    { t: 'Presentar $s_1 s_2 \\bmod n$ como firma válida del importe 30 000', ok: true, por: '$(s_1 s_2)^e = m_1^e m_2^e$… al revés: $s_1 s_2 = (m_1 m_2)^d$, la firma legítima de $m_1 m_2 = 30\\,000$. Firmar el hash lo impide: $H(m_1)H(m_2)$ no es el hash de nada.' },
    { t: 'Nada: sin $d$ no se firma', ok: false, por: 'No hace falta $d$: la multiplicatividad de RSA fabrica firmas nuevas a partir de firmas viejas. Por eso nunca se firma el mensaje directamente.' },
    { t: 'Sumar las firmas para firmar el importe 400', ok: false, por: 'RSA es multiplicativo, no aditivo: $s_1 + s_2$ no firma nada. El producto sí.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Firmas con el logaritmo discreto');

  p.text('La otra familia de firmas sale de Diffie-Hellman. En la firma de <strong>Schnorr</strong>, que ' +
    'es la más limpia y la que usan las curvas elípticas modernas, Alicia tiene un secreto $x$ y ' +
    'publica $y = g^x$. Para firmar elige un número al azar $k$, calcula $r = g^k$, hace el hash del ' +
    'mensaje junto con $r$, y responde a ese hash con una ecuación lineal en el exponente:');

  p.formulas([
    'r = g^{k}, \\qquad e = H(r \\,\\Vert\\, m), \\qquad s = k + x\\,e \\pmod q',
    '\\text{verificar: } g^{s} \\overset{?}{=} r\\, y^{e}'
  ], 'firma de Schnorr (g de orden q)',
    'Se lee: <em>«ese es ka más equis por e, módulo cu»</em>. La verificación funciona porque ' +
    '$g^s = g^{k + xe} = g^k (g^x)^e = r\\,y^e$.<br><br>El $k$ tiene que ser <strong>aleatorio y de un ' +
    'solo uso</strong>. Si se repite en dos firmas, Eva tiene dos ecuaciones $s_1 = k + x e_1$ y ' +
    '$s_2 = k + x e_2$ con dos incógnitas, y despeja $x = (s_1 - s_2)/(e_1 - e_2)$: la clave ' +
    'privada entera. Con ECDSA, que usa la misma idea, ese error dejó al descubierto la clave de ' +
    'firma de una consola de videojuegos en 2010.');

  p.demo({
    title: 'Schnorr, y el nonce repetido',
    intro: 'Alicia firma dos mensajes. Con $k$ distintos, las firmas no dicen nada. Con el mismo $k$, la demo hace lo que haría Eva: dos ecuaciones, dos incógnitas, y sale $x$.',
    predice: 'Con dos firmas de $k$ distinto, Eva tiene dos ecuaciones y tres incógnitas ($x$, $k_1$, $k_2$). ¿Puede despejar $x$? ¿Y con el mismo $k$?',
    build: function (host) {
      var P = 1019, q = 509, g = CR.potMod(2, 2, P), x = 123, k1 = 77, k2 = 77, m1 = 'Pagar 100', m2 = 'Pagar 900';
      var out = W.mono(host, '');
      function firma(k, m) { var r = CR.potMod(g, k, P), e = CR.hashCorto(r + '|' + m, 16) % q, s = CR.mod(k + x * e, q); return { r: r, e: e, s: s }; }
      function pinta() {
        var y = CR.potMod(g, x, P), f1 = firma(k1, m1), f2 = firma(k2, m2), h = '';
        h += '<b>público:</b> p = ' + P + ', q = ' + q + ', g = ' + g + ', y = g^x = ' + y + '   <b>secreto:</b> x = ' + x + '\n\n';
        h += '<b>firma de «' + U.escape(m1) + '»</b> con k₁ = ' + k1 + ':  r = ' + f1.r + ', e = ' + f1.e + ', s = ' + f1.s + '   verificación: g^s = ' + CR.potMod(g, f1.s, P) + ', r·y^e = ' + CR.mulMod(f1.r, CR.potMod(y, f1.e, P), P) + ' ✓\n';
        h += '<b>firma de «' + U.escape(m2) + '»</b> con k₂ = ' + k2 + ':  r = ' + f2.r + ', e = ' + f2.e + ', s = ' + f2.s + '\n\n';
        if (k1 === k2 && f1.e !== f2.e) {
          var xr = CR.mulMod(CR.mod(f1.s - f2.s, q), CR.inv(CR.mod(f1.e - f2.e, q), q), q);
          h += '<span class="cr-dif">mismo r en las dos firmas: mismo k.</span> Eva resta: s₁ − s₂ = x(e₁ − e₂), y despeja\n  x = (' + f1.s + ' − ' + f2.s + ') · (' + f1.e + ' − ' + f2.e + ')⁻¹ mod ' + q + ' = <b>' + xr + '</b>' + (xr === x ? ' <span class="cr-dif">la clave privada de Alicia</span>' : '');
        } else h += '<span class="cr-ok">k distintos: dos ecuaciones y tres incógnitas. Eva no despeja nada.</span>';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'k de la primera firma', min: 1, max: 508, step: 1, value: k1, on: function (v) { k1 = v; pinta(); } });
      W.slider(fila, { label: 'k de la segunda firma', min: 1, max: 508, step: 1, value: k2, on: function (v) { k2 = v; pinta(); } });
      W.slider(W.row(host), { label: 'x de Alicia', min: 1, max: 508, step: 1, value: x, on: function (v) { x = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Recuperar la clave de dos firmas con el mismo k',
    enunciado: 'Schnorr con $p = 23$, $g = 4$ (orden $q = 11$) y clave pública $y = 8$. Alicia firma dos mensajes con el mismo $k$: la primera firma tiene $r = 18$, $e_1 = 5$, $s_1 = 5$; la segunda, el mismo $r$, $e_2 = 9$, $s_2 = 0$. Verificar la primera y recuperar $x$ y $k$.',
    pasos: [
      { t: '<strong>Verificar.</strong> $g^{s_1} = 4^5 = 1024 = 44\\cdot 23 + 12 \\equiv 12$. Y $r\\,y^{e_1} = 18\\cdot 8^5$: $8^2 = 64 \\equiv 18$, $8^4 \\equiv 18^2 = 324 \\equiv 2$, $8^5 \\equiv 16$; $18\\cdot 16 = 288 \\equiv 12$. Coinciden: la firma es válida.', antes: 'Calcula $4^5$ y $18\\cdot 8^5$ módulo 23.' },
      { t: '<strong>Restar.</strong> $s_1 - s_2 = k + x e_1 - k - x e_2 = x(e_1 - e_2)$: $5 - 0 = x\\,(5 - 9) = -4x \\pmod{11}$.', antes: 'Si $k$ es el mismo, ¿qué queda al restar las dos $s$?' },
      { t: '<strong>Despejar.</strong> $-4 \\equiv 7 \\pmod{11}$, y el inverso de 7 es 8 ($56 = 5\\cdot 11 + 1$). $x = 5\\cdot 8 = 40 \\equiv 7$. Comprobación: $y = 4^7 \\bmod 23$: $4^2 = 16$, $4^3 = 64 \\equiv 18$, $4^4 \\equiv 72 \\equiv 3$, $4^5 \\equiv 12$, $4^6 \\equiv 48 \\equiv 2$, $4^7 \\equiv 8$ ✓.', antes: 'Multiplica por el inverso de $-4$ módulo 11.' },
      { t: '<strong>Y el $k$.</strong> $k = s_1 - x e_1 = 5 - 35 = -30 \\equiv 3 \\pmod{11}$. Comprobación: $4^3 = 64 \\equiv 18 = r$ ✓. Eva tiene la clave privada y puede firmar lo que quiera como Alicia.' }
    ],
    cierre: 'Dos firmas, cuatro cuentas. Un generador de números aleatorios que repite un valor convierte una firma segura en una clave regalada, y ha pasado en sistemas reales.'
  });

  p.util('Cada actualización de tu sistema operativo llega firmada, y el aparato la rechaza si la firma no ' +
    'es del fabricante: es lo que impide instalar un programa alterado. Los certificados del ' +
    'candado del navegador son firmas; el DNI electrónico firma con RSA; las transacciones de ' +
    'muchas criptomonedas son firmas ECDSA o Schnorr sobre curvas elípticas, y el fallo del $k$ ' +
    'repetido ha vaciado carteras reales cuando un monedero usó un generador defectuoso.');

  p.hist('Diffie y Hellman propusieron la idea de firma digital en 1976 sin saber cómo hacerla; RSA la ' +
    'hizo posible en 1977. Taher ElGamal dio la primera firma basada en el logaritmo discreto en ' +
    '1985, Claus-Peter Schnorr la simplificó en 1989 y la patentó, y por eso el estándar ' +
    'estadounidense de 1991, DSA, es una variante más enrevesada que la evita. En diciembre de 2010, ' +
    'el grupo fail0verflow mostró que la consola PlayStation 3 firmaba con ECDSA usando siempre el ' +
    'mismo $k$, y recuperó la clave privada de Sony en una charla; desde 2011, la firma EdDSA ' +
    'deriva $k$ del mensaje de forma determinista para que ese error sea imposible.');

  p.trampas([
    { e: 'Firmar el mensaje en vez de su hash', por: 'Eva elige $s$ y presenta $(s^e, s)$ como mensaje firmado, o multiplica dos firmas. Se firma el hash con relleno.' },
    { e: 'Reutilizar el $k$ de una firma de Schnorr o ECDSA', por: 'Dos firmas con el mismo $k$ dan $x = (s_1 - s_2)/(e_1 - e_2)$. Es lo que le pasó a la PlayStation 3.' },
    { e: 'Confundir firma con cifrado', por: 'La firma no oculta nada: el mensaje va en claro y cualquiera lo lee. Solo prueba quién lo aprobó y que no cambió.' },
    { e: 'Creer que una firma válida prueba que el contenido es verdad', por: 'Prueba que lo firmó el dueño de la clave. Si la clave se robó, o el dueño firmó sin leer, la firma es válida igual.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var PRIMOS = [11, 13, 17, 19, 23, 29, 31];
  function claves(r) { var pp = r.pick(PRIMOS), q = r.pick(PRIMOS); if (pp === q) return null; var phi = (pp - 1) * (q - 1), es = [3, 5, 7, 11, 13].filter(function (e) { return ML.gcd(e, phi) === 1; }); if (!es.length) return null; var e = r.pick(es); return { n: pp * q, e: e, d: CR.inv(e, phi) }; }

  p.exercise({
    title: 'Verificar una firma RSA',
    level: 'basico',
    gen: function (r) { var k = claves(r); if (!k) return null; var m = r.int(2, k.n - 1), s = CR.potMod(m, k.d, k.n); var falsa = r.bool(0.5); var sv = falsa ? CR.mod(s + r.int(1, k.n - 2), k.n) : s; var v = CR.potMod(sv, k.e, k.n); return { n: k.n, e: k.e, m: m, s: sv, v: v, valida: v === m }; },
    ask: function (d) { return 'Clave pública de Alicia: $(n, e) = (' + d.n + ', ' + d.e + ')$. Llega el mensaje $m = ' + d.m + '$ con la firma $s = ' + d.s + '$ (RSA de libro, sin hash). Calcula $s^e \\bmod n$: ¿la firma es válida?'; },
    fields: [{ name: 'v', label: 's^e mod n', w: 'tiny' }, { name: 'q', label: 'válida', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { v: d.v, q: d.valida ? 'si' : 'no' }; },
    hint: function () { return 'Por cuadrados sucesivos, y compara con $m$.'; },
    steps: function (d) { return ['$' + d.s + '^{' + d.e + '} \\bmod ' + d.n + ' = ' + d.v + '$.', d.valida ? 'Coincide con $m = ' + d.m + '$: firma <strong>válida</strong>.' : 'No coincide con $m = ' + d.m + '$: la firma <strong>no es válida</strong>, alguien ha cambiado el mensaje o la firma.']; },
    answer: function (d) { return d.v + (d.valida ? ', válida' : ', no válida'); }
  });

  p.exercise({
    title: 'MAC o firma',
    level: 'basico',
    gen: function (r) { var casos = [{ t: 'Dos servidores de la misma empresa se envían mensajes y solo ellos tienen que comprobarlos', v: 'mac' }, { t: 'Un fabricante publica una actualización que millones de aparatos deben poder comprobar', v: 'firma' }, { t: 'Un contrato que, en caso de disputa, un juez tiene que poder atribuir a quien lo aprobó', v: 'firma' }, { t: 'Una cookie de sesión que el propio servidor emite y después comprueba', v: 'mac' }, { t: 'Un certificado que acredita que una clave pública es de cierta web', v: 'firma' }, { t: 'Los paquetes de una conexión ya establecida entre dos partes con clave compartida', v: 'mac' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return d.c.t + '. ¿Qué conviene: un MAC o una firma digital?'; },
    fields: [{ name: 'q', label: 'Conviene', opts: [{ t: 'MAC (clave compartida)', v: 'mac' }, { t: 'firma digital (clave pública)', v: 'firma' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return '¿Quién tiene que verificar? Si es alguien que no debe poder fabricar el sello, o cualquiera, hace falta una firma. Si son solo las dos partes, basta un MAC, más rápido.'; },
    steps: function (d) { return [d.c.v === 'mac' ? 'Solo las partes con la clave verifican, y se fían entre sí: un MAC basta y es mucho más rápido.' : 'Verifica gente que no tiene ni debe tener la clave de firmar, o hace falta demostrar la autoría ante terceros: firma digital.']; },
    answer: function (d) { return d.c.v === 'mac' ? 'MAC' : 'firma'; }
  });

  p.exercise({
    title: 'Falsificación existencial',
    level: 'medio',
    gen: function (r) { var k = claves(r); if (!k) return null; var s = r.int(2, k.n - 1); return { n: k.n, e: k.e, s: s, m: CR.potMod(s, k.e, k.n) }; },
    ask: function (d) { return 'Eva no tiene la clave privada de Alicia, cuya clave pública es $(' + d.n + ', ' + d.e + ')$. Elige $s = ' + d.s + '$ y lo presenta como firma. ¿Qué mensaje $m$ queda «firmado» según la verificación del RSA de libro?'; },
    fields: [{ name: 'm', label: 'm', w: 'tiny' }],
    sol: function (d) { return { m: d.m }; },
    hint: function () { return 'La verificación acepta $(m, s)$ si $s^e \\bmod n = m$: basta calcular esa potencia.'; },
    steps: function (d) { return ['$m = ' + d.s + '^{' + d.e + '} \\bmod ' + d.n + ' = ' + d.m + '$.', 'La pareja $(' + d.m + ', ' + d.s + ')$ pasa la verificación sin que Alicia haya firmado nada. Eva no ha elegido el mensaje, pero ha demostrado que la verificación de libro no vale.', 'Con firma sobre hash, $' + d.m + '$ tendría que ser el hash de algún mensaje, y no lo es de ninguno conocido.']; },
    answer: function (d) { return String(d.m); }
  });

  p.exercise({
    title: 'Verificar una firma de Schnorr',
    level: 'medio',
    gen: function (r) { var P = 23, q = 11, g = 4, x = r.int(1, 10), k = r.int(1, 10), e = r.int(1, 10); var y = CR.potMod(g, x, P), rr = CR.potMod(g, k, P), s = CR.mod(k + x * e, q); return { P: P, q: q, g: g, y: y, r: rr, e: e, s: s, izq: CR.potMod(g, s, P), der: CR.mulMod(rr, CR.potMod(y, e, P), P) }; },
    ask: function (d) { return 'Schnorr con $p = 23$, $g = 4$ (orden 11) y clave pública $y = ' + d.y + '$. Una firma tiene $r = ' + d.r + '$, $e = ' + d.e + '$ y $s = ' + d.s + '$. Calcula $g^s$ y $r\\,y^e$ módulo 23. ¿Es válida?'; },
    fields: [{ name: 'a', label: 'g^s', w: 'tiny' }, { name: 'b', label: 'r·y^e', w: 'tiny' }, { name: 'q', label: 'válida', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { a: d.izq, b: d.der, q: 'si' }; },
    hint: function () { return 'Las dos potencias por cuadrados sucesivos módulo 23; la firma es válida si coinciden.'; },
    steps: function (d) { return ['$4^{' + d.s + '} \\bmod 23 = ' + d.izq + '$.', '$' + d.r + '\\cdot ' + d.y + '^{' + d.e + '} \\bmod 23 = ' + d.der + '$.', 'Coinciden: válida, porque $g^{k + xe} = g^k\\,(g^x)^e$.']; },
    answer: function (d) { return d.izq + ' = ' + d.der + ', válida'; }
  });

  p.exercise({
    title: 'El nonce repetido',
    level: 'avanzado',
    gen: function (r) { var q = 11, x = r.int(1, 10), k = r.int(1, 10), e1 = r.int(1, 10), e2 = r.int(1, 10); if (e1 === e2) return null; var s1 = CR.mod(k + x * e1, q), s2 = CR.mod(k + x * e2, q); return { q: q, x: x, k: k, e1: e1, e2: e2, s1: s1, s2: s2, inv: CR.inv(CR.mod(e1 - e2, q), q) }; },
    ask: function (d) { return 'Alicia ha firmado dos mensajes con Schnorr ($q = 11$) usando el mismo $k$: la primera con $e_1 = ' + d.e1 + '$, $s_1 = ' + d.s1 + '$; la segunda con $e_2 = ' + d.e2 + '$, $s_2 = ' + d.s2 + '$. Recupera su clave privada $x$ y el $k$.'; },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'k', label: 'k', w: 'tiny' }],
    sol: function (d) { return { x: d.x, k: d.k }; },
    hint: function (d) { return ['$s_1 - s_2 = x\\,(e_1 - e_2) \\pmod{11}$.', 'El inverso de $e_1 - e_2 = ' + CR.mod(d.e1 - d.e2, 11) + '$ módulo 11 es ' + d.inv + '. Después, $k = s_1 - x e_1$.']; },
    steps: function (d) { return ['$s_1 - s_2 \\equiv ' + CR.mod(d.s1 - d.s2, 11) + '$ y $e_1 - e_2 \\equiv ' + CR.mod(d.e1 - d.e2, 11) + '$, con inverso $' + d.inv + '$.', '$x = ' + CR.mod(d.s1 - d.s2, 11) + '\\cdot ' + d.inv + ' \\bmod 11 = ' + d.x + '$.', '$k = s_1 - x e_1 = ' + d.s1 + ' - ' + d.x + '\\cdot ' + d.e1 + ' \\equiv ' + d.k + ' \\pmod{11}$.', 'Con $x$, Eva firma lo que quiera en nombre de Alicia. Un $k$ nuevo y al azar en cada firma, o derivado del mensaje como en EdDSA, lo evita.']; },
    answer: function (d) { return 'x = ' + d.x + ', k = ' + d.k; }
  });

  p.keys([
    'Firma RSA: $s = H(m)^d \\bmod n$; verificar es $s^e = H(m)$. Cualquiera verifica, solo el dueño de $d$ firma: prueba autoría ante terceros.',
    'Se firma el hash, no el mensaje: firmar el mensaje permite falsificaciones ($s^e$ para cualquier $s$, y el producto de dos firmas).',
    'Schnorr: $r = g^k$, $e = H(r \\Vert m)$, $s = k + xe$; verificar $g^s = r\\,y^e$.',
    'El $k$ es de un solo uso: dos firmas con el mismo $k$ entregan $x = (s_1 - s_2)/(e_1 - e_2)$.',
    'Una firma válida prueba que el dueño de la clave lo firmó, no que el contenido sea cierto.'
  ]);
});
