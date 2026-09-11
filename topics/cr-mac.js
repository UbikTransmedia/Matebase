/* Tema: Autenticar: que nadie cambie el mensaje */
Course.topic('cr-mac', function (p) {

  p.puente('El tema de los [[cr-modos|modos de operación]] terminó con Eva cambiando una cifra de un ' +
    'mensaje cifrado sin conocer la clave. Este tema pone remedio con una [[cr-hash|función hash]] y ' +
    'una clave: un sello que solo puede fabricar quien la tenga, y que delata cualquier cambio.');

  p.text('Durante siglos, «cifrar» y «proteger» fueron lo mismo. No lo son. Cifrar impide leer; no ' +
    'impide cambiar. Con un cifrado de flujo o el modo CTR, cambiar un bit del cifrado cambia ' +
    'exactamente ese bit del mensaje, sin ruido, sin aviso: Eva puede convertir «pagar 100» en «pagar ' +
    '900» sin saber qué decía. Hace falta otra cosa: <strong>autenticar</strong>, comprobar que el ' +
    'mensaje es el que Alicia envió.');

  /* ---------------------------------------------------------------- */
  p.section('Cambiar lo que no se puede leer');

  p.demo({
    title: 'Eva cambia el importe',
    intro: 'Alicia cifra una orden de pago en modo CTR. Eva no tiene la clave y no puede leerla, pero sabe el formato: el importe está en una posición fija. Elige qué quiere que lea Benito y la demo calcula qué bytes del cifrado hay que alterar. Con el sello activado, Benito rechaza el mensaje.',
    predice: 'Sin sello, ¿Benito notará algo raro al descifrar el mensaje alterado? ¿Y con el sello, qué comprobación falla?',
    build: function (host) {
      var importe = 100, nuevo = 900, sello = false;
      var clave = CR.deHex('2b7e151628aed2a6abf7158809cf4f3c'), nonce = CR.deHex('f0f1f2f3f4f5f6f7f8f9fafb');
      var out = W.mono(host, '');
      function texto(n) { return 'PAGAR ' + ('000' + n).slice(-3) + ' EUR A BENITO'; }
      function pinta() {
        var m = CR.bytes(texto(importe)), c = CR.ctr(m, clave, nonce), m2 = CR.bytes(texto(nuevo)), c2 = c.slice();
        for (var i = 0; i < c.length; i++) c2[i] ^= m[i] ^ m2[i];
        var d = CR.ctr(c2, clave, nonce), h = '';
        h += '<b>Alicia envía:</b>  «' + texto(importe) + '»\n<b>cifrado:</b>       ' + CR.hex(c) + '\n<b>Eva altera:</b>    ' + CR.hexHtml(c2, c) + '\n<b>Benito lee:</b>    «' + U.escape(CR.texto(d)) + '»\n\n';
        if (sello) {
          var tag = CR.hmac(clave, c).slice(0, 16), tag2 = CR.hmac(clave, c2).slice(0, 16);
          h += '<b>sello de Alicia:</b> HMAC(clave, cifrado) = ' + tag + '…\n<b>Benito recalcula:</b> HMAC(clave, cifrado recibido) = ' + tag2 + '…\n' + (tag === tag2 ? '<span class="cr-ok">coinciden: mensaje aceptado</span>' : '<span class="cr-dif">no coinciden: mensaje rechazado. Eva no puede fabricar el sello sin la clave.</span>');
        } else h += '<span class="cr-dif">Sin sello, Benito no tiene forma de saber que el importe ha cambiado.</span>';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'importe real', min: 1, max: 999, step: 1, value: importe, on: function (v) { importe = v; pinta(); } });
      W.slider(fila, { label: 'lo que Eva quiere que lea Benito', min: 1, max: 999, step: 1, value: nuevo, on: function (v) { nuevo = v; pinta(); } });
      W.chips(host, [{ label: 'sin sello', value: false }, { label: 'con sello (HMAC)', value: true }], { value: sello, on: function (v) { sello = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El código de autenticación: un sello con clave');

  p.text('Un <strong>código de autenticación de mensaje</strong>, MAC, es un número corto, la ' +
    '<em>etiqueta</em>, que se calcula a partir del mensaje y de una clave compartida. Alicia envía ' +
    'mensaje y etiqueta; Benito recalcula la etiqueta con su copia de la clave y compara. Si ' +
    'coincide, el mensaje es de alguien con la clave y no se ha tocado. La propiedad que se exige es ' +
    'que, sin la clave, nadie pueda producir una etiqueta válida para ningún mensaje nuevo, aunque ' +
    'haya visto miles de parejas mensaje-etiqueta.');

  p.formula('t = \\text{HMAC}(k, m) = H\\bigl((k \\oplus \\text{opad}) \\,\\Vert\\, H\\bigl((k \\oplus \\text{ipad}) \\,\\Vert\\, m\\bigr)\\bigr)',
    'HMAC',
    'Se lee: <em>«la etiqueta es el hash de la clave xor opad, concatenada con el hash de la clave xor ' +
    'ipad concatenada con el mensaje»</em>. ipad y opad son dos constantes (bytes 36 y 5C repetidos) ' +
    'que hacen que las dos claves internas sean distintas.<br><br>¿Por qué no simplemente $H(k \\Vert m)$? ' +
    'Por la extensión de longitud: con Merkle-Damgård, quien conoce $H(k \\Vert m)$ puede calcular ' +
    '$H(k \\Vert m \\Vert \\text{relleno} \\Vert m^{*})$ sin conocer $k$, y eso es una etiqueta válida para un ' +
    'mensaje que Alicia nunca envió. El hash exterior de HMAC cierra esa puerta.');

  p.demo({
    title: 'HMAC-SHA256 en directo',
    intro: 'Clave y mensaje. La etiqueta cambia por completo con cualquier cambio en cualquiera de los dos. Sin la clave no hay forma de calcularla, y la clave nunca viaja.',
    predice: 'Si Eva conoce el mensaje y la etiqueta, ¿puede calcular la etiqueta del mismo mensaje con una coma añadida al final?',
    build: function (host) {
      var k = 'clave secreta', m = 'Pagar 100 euros a Benito';
      var out = W.mono(host, '');
      function pinta() {
        var t = CR.hmac(k, m), t2 = CR.hmac(k, m + ',');
        out.set('<b>HMAC(clave, mensaje)</b>\n' + t.replace(/(.{32})/, '$1\n') + '\n\n<span class="cr-tenue">con una coma añadida al mensaje:</span>\n' + t2.split('').map(function (c, i) { return c === t.charAt(i) ? c : '<span class="cr-dif">' + c + '</span>'; }).join('').replace(/^((?:<span class="cr-dif">.<\/span>|.){32})/, '$1\n'));
      }
      W.texto(host, { label: 'clave', value: k, on: function (v) { k = v; pinta(); } });
      W.texto(host, { label: 'mensaje', value: m, on: function (v) { m = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Un sistema autentica sus mensajes con $t = H(m \\Vert k)$: el hash del mensaje seguido de la clave. ¿Es una buena idea?', [
    { t: 'Es mejor que $H(k \\Vert m)$, porque la clave al final impide la extensión de longitud, pero sigue siendo frágil: una colisión en $H$ da dos mensajes con la misma etiqueta. HMAC es la construcción demostrada', ok: true, por: 'Con la clave al final, extender el mensaje obligaría a conocer la clave. Pero si Eva encuentra $m_1$ y $m_2$ con $H(m_1) = H(m_2)$, el estado interno coincide y las etiquetas también. HMAC resiste incluso con funciones con colisiones conocidas.' },
    { t: 'Es perfecto: nadie puede calcularlo sin la clave', ok: false, por: 'Depende de la resistencia a colisiones del hash, y las colisiones son lo primero que cae en un hash. HMAC no depende de eso.' },
    { t: 'Es igual de malo que $H(k \\Vert m)$', ok: false, por: 'No: $H(k \\Vert m)$ cae por la extensión de longitud, que aquí no funciona. Es más débil que HMAC, no equivalente a la construcción rota.' }
  ]);

  p.ejemplo({
    title: 'Adivinar una etiqueta',
    enunciado: 'Un servidor acepta mensajes con una etiqueta de 32 bits y responde a mil intentos por segundo. Eva quiere colar un mensaje falso probando etiquetas al azar. ¿Cuánto tarda de media? ¿Y con 128 bits?',
    pasos: [
      { t: '<strong>Las etiquetas posibles.</strong> $2^{32} \\approx 4{,}3\\cdot 10^9$. Una etiqueta al azar es válida con probabilidad $2^{-32}$.', antes: '¿Cuántas etiquetas de 32 bits hay?' },
      { t: '<strong>Intentos de media.</strong> La mitad: $2^{31} \\approx 2{,}1\\cdot 10^9$. A mil por segundo, $2{,}1\\cdot 10^6$ segundos: unos 25 días. Poco, para algo que se puede automatizar.', antes: 'De media, ¿cuántos intentos hasta acertar?' },
      { t: '<strong>Con 128 bits.</strong> $2^{127} / 1000$ segundos $\\approx 1{,}7\\cdot 10^{35}$ segundos, $5\\cdot 10^{27}$ años. Y a diferencia de un cifrado, Eva no puede probar en su casa: cada intento tiene que pasar por el servidor, que puede además limitar los intentos.', antes: '¿Cuánto cambia con 128 bits?' },
      { t: '<strong>La moraleja.</strong> La etiqueta se puede acortar, porque el atacante no puede verificar por su cuenta, pero no tanto: 64 bits es el mínimo razonable, y HMAC-SHA256 da 256.' }
    ],
    cierre: 'Adivinar es la única opción de Eva si el MAC es bueno: la clave no viaja y la construcción no se despeja.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Cifrar y sellar: en qué orden');

  p.text('Cifrado y autenticación se combinan, y el orden importa. Lo que ha resistido en la práctica es ' +
    '<strong>cifrar y después sellar</strong>: la etiqueta se calcula sobre el cifrado, Benito la ' +
    'comprueba <em>antes</em> de descifrar nada, y si no coincide, no toca el mensaje. Sellar primero ' +
    'y cifrar después obliga a descifrar para comprobar, y ese descifrado de datos no verificados ' +
    'es la puerta por la que entraron varios ataques reales contra conexiones seguras.');

  p.table(['Combinación', 'Qué se hace', 'Veredicto'], [
    ['Cifrar y luego sellar', '$c = E_k(m)$, $t = \\text{MAC}_{k\'}(c)$; se verifica $t$ antes de descifrar', 'la buena: nada sin verificar toca el descifrador'],
    ['Sellar y luego cifrar', '$t = \\text{MAC}(m)$, $c = E(m \\Vert t)$', 'frágil: hay que descifrar para comprobar; oráculos de relleno'],
    ['Cifrar y sellar por separado', '$c = E(m)$, $t = \\text{MAC}(m)$', 'la etiqueta del mensaje en claro puede filtrar información sobre él'],
    ['Cifrado autenticado (GCM, ChaCha20-Poly1305)', 'una sola primitiva hace las dos cosas con una clave y un nonce', 'lo que se usa hoy: sin decisiones que tomar']
  ]);

  p.text('Los modos de <strong>cifrado autenticado</strong> hacen todo en una operación y además ' +
    'permiten sellar <em>datos asociados</em> que viajan en claro, como una cabecera con el ' +
    'destinatario: no se cifran, pero si cambian, la etiqueta falla. AES-GCM, que es CTR más un ' +
    'MAC calculado con productos en $\\text{GF}(2^{128})$, protege hoy la mayoría de las conexiones ' +
    'seguras; ChaCha20-Poly1305 hace lo mismo en los móviles sin instrucciones de AES.');

  p.util('Casi todo lo que llega a tu navegador o a tu móvil viene con etiqueta: cada paquete de una ' +
    'conexión segura, cada mensaje de una aplicación de chat, cada actualización del sistema. Las ' +
    'cookies de sesión de las webs llevan un HMAC para que no se puedan editar, y los tokens de ' +
    'acceso a las aplicaciones también. En 2009 una API de fotos muy usada autenticaba con ' +
    '$H(k \\Vert m)$ y se rompió por extensión de longitud: se podían añadir permisos a un token ' +
    'válido sin conocer la clave. Desde entonces «usa HMAC» es una regla, no un consejo.');

  p.hist('Mark Wegman y Larry Carter definieron en 1981 los códigos de autenticación con seguridad ' +
    'demostrable, con una idea que reaparece en Poly1305. Mihir Bellare, Ran Canetti y Hugo ' +
    'Krawczyk publicaron HMAC en 1996, con una demostración de que su seguridad se apoya en ' +
    'propiedades débiles del hash, y se estandarizó al año siguiente. Los modos de cifrado ' +
    'autenticado llegaron a partir de 2000; GCM, de David McGrew y John Viega, es de 2004, y ' +
    'Poly1305, de Daniel Bernstein, de 2005.');

  p.trampas([
    { e: 'Creer que cifrar protege contra cambios', por: 'En CTR, un bit del cifrado es un bit del mensaje: Eva cambia el importe sin leerlo. Cifrar no autentica.' },
    { e: 'Autenticar con $H(k \\Vert m)$', por: 'Extensión de longitud: de la etiqueta de $m$ sale la de $m \\Vert \\text{relleno} \\Vert m^{*}$ sin la clave. Se usa HMAC.' },
    { e: 'Descifrar antes de comprobar la etiqueta', por: 'Datos no verificados pasan por el descifrador, y cualquier error que este dé, de relleno o de formato, es una fuga. Primero se verifica.' },
    { e: 'Comparar etiquetas con un «igual» normal', por: 'Una comparación que se detiene en el primer byte distinto tarda distinto según cuántos bytes acierten, y ese tiempo delata la etiqueta byte a byte. Se compara en tiempo constante.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cambiar una letra sin la clave',
    level: 'basico',
    gen: function (r) { var a = CR.bytes(r.pick(['A', 'B', 'S', 'N']))[0], b = CR.bytes(r.pick(['C', 'D', 'T', 'M']))[0], c = r.int(0, 255); return { a: a, b: b, c: c, delta: a ^ b, c2: c ^ a ^ b }; },
    ask: function (d) { return 'Un mensaje en CTR contiene la letra «' + String.fromCharCode(d.a) + '» (byte $' + CR.bits(d.a, 8) + '$) y su byte cifrado es $' + CR.bits(d.c, 8) + '$. Eva quiere que Benito lea «' + String.fromCharCode(d.b) + '» ($' + CR.bits(d.b, 8) + '$). ¿Qué byte cifrado envía?'; },
    fields: [{ name: 'c', label: 'byte enviado', w: 'wide' }],
    sol: function (d) { return { c: CR.bits(d.c2, 8) }; },
    check: function (v, d) { var t = String(v.raw.c || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; return t === CR.bits(d.c2, 8) ? { ok: true } : { ok: false, msg: 'XOR del byte cifrado con la diferencia entre las dos letras: $c \\oplus a \\oplus b$.' }; },
    hint: function () { return 'Benito calcula $c \\oplus s = m$. Si recibe $c \\oplus \\Delta$, obtiene $m \\oplus \\Delta$: elige $\\Delta = a \\oplus b$.'; },
    steps: function (d) { return ['$\\Delta = ' + CR.bits(d.a, 8) + ' \\oplus ' + CR.bits(d.b, 8) + ' = ' + CR.bits(d.delta, 8) + '$.', 'Envía $' + CR.bits(d.c, 8) + ' \\oplus ' + CR.bits(d.delta, 8) + ' = ' + CR.bits(d.c2, 8) + '$.', 'Sin etiqueta, Benito lee «' + String.fromCharCode(d.b) + '» sin sospechar nada.']; },
    answer: function (d) { return CR.bits(d.c2, 8); }
  });

  p.exercise({
    title: 'Probabilidad de colar una etiqueta',
    level: 'basico',
    gen: function (r) { var t = r.pick([8, 16, 24, 32, 64]); return { t: t, p: Math.pow(2, -t) }; },
    ask: function (d) { return 'Una etiqueta MAC tiene ' + d.t + ' bits. Eva envía un mensaje falso con una etiqueta al azar. ¿Qué probabilidad tiene de que sea aceptado? Escríbela como potencia de 2 (solo el exponente, con signo) o como decimal.'; },
    fields: [{ name: 'p', label: 'probabilidad', w: 'wide' }],
    sol: function (d) { return { p: d.p }; },
    rel: 1e-3,
    check: function (v, d) {
      var raw = String(v.raw.p || '').trim().replace(',', '.');
      if (/^-?\d+$/.test(raw) && +raw === -d.t) return { ok: true };
      if (Math.abs(v.p - d.p) <= 1e-3 * d.p) return { ok: true };
      if (/^-?\d+$/.test(raw) && +raw === d.t) return { ok: false, msg: 'El exponente es negativo: una entre $2^{' + d.t + '}$ es $2^{-' + d.t + '}$.' };
      return { ok: false, msg: 'Hay $2^{' + d.t + '}$ etiquetas y solo una es válida.' };
    },
    hint: function () { return 'Una etiqueta válida entre $2^t$ posibles.'; },
    steps: function (d) { return ['$2^{' + d.t + '} = ' + U.miles(Math.pow(2, d.t)) + '$ etiquetas posibles.', 'Probabilidad: $2^{-' + d.t + '} \\approx ' + d.p.toExponential(2).replace('e-', '\\cdot 10^{-') + '}$.', d.t <= 16 ? 'Demasiado alta: con unos miles de intentos cuela. Las etiquetas cortas solo valen si el servidor limita los intentos.' : 'Como Eva no puede comprobar en su casa, cada intento pasa por Benito: con esa probabilidad, no llegará.']; },
    answer: function (d) { return '2^-' + d.t; }
  });

  p.exercise({
    title: 'Intentos hasta colar una',
    level: 'medio',
    gen: function (r) { var t = r.pick([16, 20, 24, 32]), v = r.pick([10, 100, 1000, 10000]); var n = Math.pow(2, t - 1); return { t: t, v: v, n: n, seg: n / v }; },
    ask: function (d) { return 'Etiquetas de ' + d.t + ' bits, y un servidor que responde a ' + U.miles(d.v) + ' intentos por segundo. ¿Cuántos intentos necesita Eva de media, y cuántos segundos son?'; },
    fields: [{ name: 'n', label: 'intentos', w: 'wide' }, { name: 's', label: 'segundos', w: 'tiny' }],
    sol: function (d) { return { n: d.n, s: d.seg }; },
    rel: 1e-3,
    errores: [{ si: function (v, d) { return v.n === 2 * d.n; }, msg: 'Eso es probarlas todas. De media, la buena aparece a mitad de camino.' }],
    hint: function () { return 'La mitad de $2^t$, y entre la velocidad.'; },
    steps: function (d) { return ['$2^{' + (d.t - 1) + '} = ' + U.miles(d.n) + '$ intentos de media.', 'Entre ' + U.miles(d.v) + ' por segundo: $' + U.fmt(d.seg, 0) + '$ segundos' + (d.seg > 86400 ? ' (' + U.fmt(d.seg / 86400, 1) + ' días).' : '.'), 'Un servidor que bloquee tras unos cuantos intentos fallidos lo convierte en imposible; sin ese límite, ' + d.t + ' bits ' + (d.seg < 1e6 ? 'son pocos.' : 'aguantan de sobra.')]; },
    answer: function (d) { return U.miles(d.n) + ' intentos, ' + U.fmt(d.seg, 0) + ' s'; }
  });

  p.exercise({
    title: 'Construcciones que valen y que no',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: '$t = H(k \\Vert m)$ con SHA-256', v: 'ext', por: 'Merkle-Damgård permite la extensión de longitud: de $t$ sale la etiqueta de $m \\Vert \\text{relleno} \\Vert m^{*}$ sin conocer $k$.' },
        { t: '$t = \\text{HMAC}(k, m)$', v: 'bien', por: 'Es la construcción demostrada: el hash exterior cierra la extensión de longitud y no depende de la resistencia a colisiones.' },
        { t: '$t = H(m)$, sin clave, enviado junto al mensaje', v: 'sinclave', por: 'Eva cambia $m$ y recalcula $H(m)$: sin clave, cualquiera fabrica la etiqueta.' },
        { t: '$t = E_k(H(m))$: cifrar el hash del mensaje', v: 'bien', por: 'Sin la clave no se puede producir el cifrado del hash de un mensaje nuevo, y cualquier cambio en $m$ cambia $H(m)$. Es una construcción válida, aunque hoy se prefiere HMAC.' },
        { t: '$t =$ los 8 primeros bits de $\\text{HMAC}(k, m)$', v: 'corto', por: 'La construcción es buena pero 8 bits son 256 etiquetas: Eva acierta en unos 128 intentos.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Se propone autenticar mensajes con ' + d.c.t + '. ¿Qué opinas?'; },
    fields: [{ name: 'q', label: 'Veredicto', opts: [{ t: 'válida', v: 'bien' }, { t: 'rota por extensión de longitud', v: 'ext' }, { t: 'rota: no hay clave', v: 'sinclave' }, { t: 'construcción válida pero etiqueta demasiado corta', v: 'corto' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return ['¿Hay clave? ¿Se puede extender el hash? ¿Cuántas etiquetas posibles hay?']; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return { bien: 'válida', ext: 'extensión de longitud', sinclave: 'sin clave', corto: 'etiqueta corta' }[d.c.v]; }
  });

  p.exercise({
    title: 'Cuánto aguanta un servidor',
    level: 'avanzado',
    gen: function (r) { var t = r.pick([32, 48, 64, 96]), v = r.pick([1e3, 1e4, 1e5, 1e6]); var seg = Math.pow(2, t - 1) / v; return { t: t, v: v, exp: Math.round(Math.log(v) / Math.LN10), seg: seg, anos: seg / 31557600 }; },
    ask: function (d) { return 'Un servicio acepta etiquetas de ' + d.t + ' bits y puede verificar $10^{' + d.exp + '}$ mensajes por segundo. Si Eva usa toda esa capacidad para probar etiquetas al azar, ¿cuántos años tarda de media en colar un mensaje? (un año son $3{,}156\\cdot 10^7$ s; da el resultado con notación científica o dos decimales)'; },
    fields: [{ name: 'a', label: 'años', w: 'wide' }],
    sol: function (d) { return { a: d.anos }; },
    rel: 2e-3,
    hint: function () { return ['$2^{t-1}$ intentos de media.', 'Entre la velocidad y entre los segundos de un año.']; },
    steps: function (d) { return ['$2^{' + (d.t - 1) + '} \\approx ' + Math.pow(2, d.t - 1).toExponential(2).replace('e+', '\\cdot 10^{') + '}$ intentos.', 'Entre $10^{' + d.exp + '}$: $' + d.seg.toExponential(2).replace('e+', '\\cdot 10^{') + '}$ segundos.', 'Entre $3{,}156\\cdot 10^7$: $' + (d.anos < 1000 ? U.fmt(d.anos, 2) : d.anos.toExponential(2).replace('e+', '\\cdot 10^{') + '}') + '$ años.', d.anos < 100 ? 'Demasiado poco para un servicio sin límite de intentos: hacen falta más bits o bloquear tras unos fallos.' : 'De sobra: y con un límite de intentos, ni eso hace falta.']; },
    answer: function (d) { return d.anos.toExponential(2) + ' años'; }
  });

  p.keys([
    'Cifrar no autentica: en CTR, un bit del cifrado es un bit del mensaje, y Eva cambia importes sin leerlos.',
    'Un MAC es una etiqueta calculada con el mensaje y una clave compartida; sin la clave no se fabrica ninguna válida.',
    'HMAC $= H((k \\oplus \\text{opad}) \\Vert H((k \\oplus \\text{ipad}) \\Vert m))$. $H(k \\Vert m)$ cae por extensión de longitud.',
    'Cifrar y después sellar, y verificar antes de descifrar. O mejor: cifrado autenticado (AES-GCM, ChaCha20-Poly1305).',
    'La etiqueta se adivina con $2^{t-1}$ intentos de media, y cada intento pasa por el servidor: 64 bits como mínimo, y límite de intentos.'
  ]);
});
