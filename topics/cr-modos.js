/* Tema: Modos de operacion: el pinguino que se veia a traves del cifrado */
Course.topic('cr-modos', function (p) {

  p.puente('[[cr-aes|AES]] cifra 16 bytes. Un mensaje tiene miles, y cómo se encadenan los bloques ' +
    'decide si el cifrado protege algo: el [[cr-vernam|XOR]] y el [[cr-flujo|nonce]] del cifrado de ' +
    'flujo vuelven a aparecer, y el error más famoso de la criptografía práctica se ve en una ' +
    'imagen.');

  p.text('Un cifrado por bloques es una pieza, no un sistema. Aplicarlo bloque a bloque a un mensaje ' +
    'parece lo natural, y es un error tan conocido que tiene un icono: una imagen de un pingüino ' +
    'cifrada así, en la que el pingüino se sigue viendo. Los <strong>modos de operación</strong> son ' +
    'las formas correctas de usar la pieza, y cada una tiene sus reglas.');

  /* ---------------------------------------------------------------- */
  p.section('El relleno y el modo directo');

  p.text('Lo primero es que el mensaje rara vez mide un múltiplo de 16 bytes. Se completa con un ' +
    '<strong>relleno</strong> que se pueda quitar sin ambigüedad: si faltan $n$ bytes, se añaden $n$ ' +
    'bytes con el valor $n$; y si no falta ninguno, se añade un bloque entero de dieciséis 16, para ' +
    'que el último byte siempre diga cuánto sobra.');

  p.text('Lo segundo es cómo cifrar los bloques. El modo directo, <strong>ECB</strong> (libro de ' +
    'códigos electrónico), cifra cada uno por separado con la misma clave. Y ahí está el problema: ' +
    'dos bloques iguales del mensaje dan dos bloques iguales del cifrado. En un texto pasa poco; en ' +
    'una imagen, donde hay zonas enteras del mismo color, pasa todo el rato.');

  p.demo({
    title: 'El pingüino de ECB',
    intro: 'Una imagen de 48 × 48 píxeles en gris, cifrada con AES de verdad. Cada fila son tres bloques de 16 bytes. En ECB, las zonas lisas dan bloques idénticos y la forma se ve; en CBC y CTR cada bloque depende de su posición y de los anteriores, y no queda nada.',
    predice: 'En la imagen ECB, ¿qué partes se verán y cuáles no: el fondo liso, los bordes de la figura, o los dos?',
    build: function (host) {
      var N = 48, clave = CR.deHex('2b7e151628aed2a6abf7158809cf4f3c'), iv = CR.deHex('000102030405060708090a0b0c0d0e0f');
      var fig = 'circulo';
      var caja = U.el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px', margin: '10px 0' } });
      host.appendChild(caja);
      function lienzo(titulo, aria) {
        /* El nombre del dibujo lo lee un lector de pantalla: pasa por la
           puerta del diccionario, igual que el texto que se ve. */
        var c = U.el('canvas', { width: N, height: N, role: 'img', 'aria-label': MathX.inline(aria), style: { width: '144px', height: '144px', imageRendering: 'pixelated', border: '1px solid var(--line)', borderRadius: '6px' } });
        var w = U.el('div', { style: { textAlign: 'center', fontSize: '0.8125rem', color: 'var(--ink-soft)' } }, [c, U.el('div', { text: titulo })]);
        caja.appendChild(w);
        return c;
      }
      var cv = { orig: lienzo('original', 'La imagen original: una figura oscura sobre fondo claro'), ecb: lienzo('ECB', 'La imagen cifrada en modo ECB: la figura sigue reconociéndose'), cbc: lienzo('CBC', 'La imagen cifrada en modo CBC: ruido sin ninguna forma'), ctr: lienzo('CTR', 'La imagen cifrada en modo CTR: ruido sin ninguna forma') };
      function pinta(c, bytes) {
        var ctx = c.getContext('2d'), img = ctx.createImageData(N, N);
        for (var i = 0; i < N * N; i++) { var v = bytes[i]; img.data[4 * i] = v; img.data[4 * i + 1] = v; img.data[4 * i + 2] = v; img.data[4 * i + 3] = 255; }
        ctx.putImageData(img, 0, 0);
      }
      function imagen() {
        var b = [];
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
          var v = 0xE0;
          if (fig === 'circulo') { var dx = x - 24, dy = y - 24; if (dx * dx + dy * dy < 300) v = 0x40; if (dx * dx + dy * dy < 60) v = 0xA0; }
          else if (fig === 'letra') { if ((x >= 8 && x < 16 && y >= 8 && y < 40) || (x >= 32 && x < 40 && y >= 8 && y < 40) || (y >= 8 && y < 16 && x >= 8 && x < 40) || (y >= 22 && y < 28 && x >= 8 && x < 40)) v = 0x30; }
          else { if (((x >> 3) + (y >> 3)) % 2 === 0) v = 0x50; }
          b.push(v);
        }
        return b;
      }
      function todo() {
        var m = imagen();
        pinta(cv.orig, m);
        pinta(cv.ecb, CR.ecb(m, clave));
        pinta(cv.cbc, CR.cbc(m, clave, iv));
        pinta(cv.ctr, CR.ctr(m, clave, iv));
      }
      W.chips(host, [{ label: 'círculo', value: 'circulo' }, { label: 'una letra', value: 'letra' }, { label: 'tablero', value: 'tablero' }], { value: fig, on: function (v) { fig = v; todo(); } });
      W.hint(host, 'Los 2304 bytes de la imagen se cifran con AES-128; cada píxel es un byte, y el byte cifrado se pinta como gris.');
      todo();
    }
  });

  p.comprueba('Un archivo cifrado en ECB tiene dos bloques de cifrado idénticos. ¿Qué sabe Eva?', [
    { t: 'Que los dos bloques del mensaje eran idénticos, sin saber qué contenían', ok: true, por: 'Misma clave, mismo bloque de entrada, mismo bloque de salida. No lee el contenido, pero sabe que se repite, y eso ya es información: dónde hay ceros, qué registros comparten un campo, la forma de una imagen.' },
    { t: 'Nada: AES es seguro', ok: false, por: 'AES es seguro como permutación de un bloque. La fuga no está en AES, sino en usarlo igual para cada bloque: el modo delata la estructura del mensaje.' },
    { t: 'La clave, porque dos bloques iguales la determinan', ok: false, por: 'La clave sigue a salvo. Lo que se pierde es la confidencialidad de la <em>estructura</em>: qué se repite y dónde.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('CBC: encadenar con el bloque anterior');

  p.text('La solución clásica es que cada bloque, antes de cifrarse, se combine con el cifrado del ' +
    'anterior: dos bloques iguales del mensaje llegan al cifrador con vecinos distintos y salen ' +
    'distintos. Para el primero, que no tiene anterior, se usa un bloque al azar, el <strong>vector ' +
    'de inicialización</strong>, que viaja en claro junto al cifrado.');

  p.formulas([
    'c_i = E_k(m_i \\oplus c_{i-1}), \\qquad c_0 = \\text{IV}',
    'm_i = D_k(c_i) \\oplus c_{i-1}'
  ], 'modo CBC',
    'Se lee: <em>«el bloque cifrado i es el cifrado de eme sub i xor ce sub i menos uno»</em>.<br><br>' +
    'Al descifrar, el XOR se deshace con el bloque cifrado anterior, que Benito tiene. Fíjate en la ' +
    'consecuencia: si un bit de $c_i$ llega cambiado, $m_i$ sale destrozado entero, porque pasa por ' +
    'el descifrador, y $m_{i+1}$ sale con <strong>exactamente ese bit cambiado</strong>, porque solo ' +
    'entra en un XOR. Los demás bloques no se enteran. Esa segunda parte es una grieta, y se verá en ' +
    'el tema de autenticación.');

  p.demo({
    title: 'CBC y un bit cambiado',
    intro: 'Un mensaje cifrado en CBC. Elige un byte del cifrado y cámbiale un bit; abajo, lo que Benito obtiene al descifrar: el bloque de ese byte se convierte en ruido, y en el bloque siguiente cambia solo el byte correspondiente.',
    predice: 'Si se cambia un bit del segundo bloque cifrado, ¿qué bloques del mensaje descifrado saldrán mal: solo el segundo, el segundo y el tercero, o todos desde el segundo?',
    build: function (host) {
      var msg = 'Nos vemos en el puente a las siete. Trae los planos.', pos = 20, bit = 0;
      var clave = CR.deHex('2b7e151628aed2a6abf7158809cf4f3c'), iv = CR.deHex('0f1e2d3c4b5a69788796a5b4c3d2e1f0');
      var out = W.mono(host, '');
      function pinta() {
        var m = CR.rellena(CR.bytes(msg)), c = CR.cbc(m, clave, iv), c2 = c.slice();
        pos = Math.min(pos, c.length - 1);
        c2[pos] ^= 1 << bit;
        var d = CR.cbcDescifra(c2, clave, iv), h = '<b>mensaje:</b> ' + U.escape(msg) + '\n<b>cifrado:</b> ' + CR.hexHtml(c, c2).replace(/(.{35,36})/g, '$1\n         ') + '\n\n';
        h += '<b>descifrado tras cambiar el bit ' + bit + ' del byte ' + pos + ' (bloque ' + Math.floor(pos / 16) + '):</b>\n';
        for (var i = 0; i < d.length; i += 16) {
          var trozo = d.slice(i, i + 16), orig = m.slice(i, i + 16), texto = CR.texto(trozo).replace(/[^\x20-\x7e -ÿ]/g, '·');
          var nDif = trozo.filter(function (b, j) { return b !== orig[j]; }).length;
          h += 'bloque ' + (i / 16) + ': ' + U.escape(texto) + '   <span class="' + (nDif === 0 ? 'cr-ok' : 'cr-dif') + '">' + (nDif === 0 ? 'intacto' : nDif + ' byte' + (nDif > 1 ? 's' : '') + ' distinto' + (nDif > 1 ? 's' : '')) + '</span>\n';
        }
        out.set(h);
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 60, on: function (v) { msg = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'byte del cifrado que se altera', min: 0, max: 63, step: 1, value: pos, on: function (v) { pos = v; pinta(); } });
      W.slider(fila, { label: 'bit', min: 0, max: 7, step: 1, value: bit, on: function (v) { bit = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('CTR: el cifrado de bloque como cifrado de flujo');

  p.text('La otra solución es no cifrar el mensaje en absoluto, sino fabricar con AES un flujo de clave: ' +
    'se cifra un contador, nonce más número de bloque, y el resultado se combina con el mensaje ' +
    'con XOR, como en Vernam. Cada bloque se puede cifrar en paralelo, se puede descifrar cualquier ' +
    'trozo sin tocar el resto, y no hace falta relleno.');

  p.formula('c_i = m_i \\oplus E_k(\\text{nonce} \\,\\Vert\\, i)', 'modo CTR',
    'Se lee: <em>«ce sub i es eme sub i xor el cifrado del nonce concatenado con i»</em>. Descifrar ' +
    'es la misma línea, porque XOR se deshace a sí mismo; el cifrador solo se usa en un sentido.<br><br>' +
    'Las reglas son las del cifrado de flujo: el nonce no puede repetirse nunca con la misma clave, ' +
    'porque dos mensajes con el mismo flujo son la libreta reutilizada. Y cambiar un bit del ' +
    'cifrado cambia exactamente ese bit del mensaje, sin ruido que lo delate: CTR necesita, aún más ' +
    'que CBC, que alguien compruebe que nada se ha tocado.');

  p.ejemplo({
    title: 'Relleno y descifrado en CBC',
    enunciado: 'Un mensaje de 21 bytes se cifra en CBC. ¿Cómo se rellena, cuántos bloques salen? Después, un byte del segundo bloque descifrado por AES vale $\\text{5A}$ y el byte correspondiente del primer bloque cifrado vale $\\text{3C}$: ¿qué byte del mensaje es?',
    pasos: [
      { t: '<strong>El relleno.</strong> 21 bytes son un bloque y 5 bytes; faltan 11 para el segundo: se añaden once bytes con el valor 11 ($\\text{0B}$). Total 32 bytes, dos bloques. Con 32 bytes exactos se habrían añadido dieciséis $\\text{10}$, y serían tres.', antes: '¿Cuántos bytes faltan para completar el segundo bloque?' },
      { t: '<strong>Descifrar.</strong> $m_2 = D_k(c_2) \\oplus c_1$: $\\text{5A} \\oplus \\text{3C} = 0101\\,1010 \\oplus 0011\\,1100 = 0110\\,0110 = \\text{66}$, la letra f.', antes: 'XOR de 5A y 3C, en binario.' },
      { t: '<strong>Si $c_1$ llegara alterado.</strong> Ese mismo byte de $m_2$ saldría con los bits cambiados que tuviera $c_1$, y ningún otro byte de $m_2$ se enteraría. En cambio $m_1$, que sale de descifrar $c_1$, sería ruido.', antes: '¿Qué le pasa a este byte si un bit de $c_1$ cambia?' },
      { t: '<strong>El relleno al descifrar.</strong> Benito mira el último byte: si vale $\\text{0B}$, quita once bytes y comprueba que todos eran $\\text{0B}$. Si no lo son, algo se ha alterado, y lo que haga con ese error importa: es el oráculo de relleno, que se verá más adelante.' }
    ],
    cierre: 'Rellenar, encadenar, descifrar con XOR: tres detalles que parecen menores y en los que se han apoyado ataques reales contra sistemas con AES intacto.'
  });

  p.util('Casi todo lo que ves cifrado usa CTR con un sello de autenticidad encima: el modo GCM de las ' +
    'conexiones seguras es CTR más una comprobación de integridad. Los discos duros cifrados usan ' +
    'una variante que mezcla el número del sector, para que dos sectores iguales no se vean iguales. ' +
    'Y ECB sigue apareciendo donde no debe: en 2013 se filtraron 150 millones de contraseñas de una ' +
    'gran empresa de software cifradas en ECB con la misma clave, y bastó agrupar los cifrados ' +
    'iguales y leer las pistas de recuperación de contraseña para adivinar los más comunes.');

  p.hist('Los cuatro modos originales, ECB, CBC, CFB y OFB, se estandarizaron en 1980 junto con DES. El ' +
    'modo contador lo propusieron Whitfield Diffie y Martin Hellman en 1979, y tardó dos décadas en ' +
    'imponerse. La imagen del pingüino cifrado en ECB la hizo un usuario de Wikipedia en 2004 para ' +
    'ilustrar el artículo sobre modos de operación, y se ha convertido en el ejemplo canónico. El ' +
    'modo GCM, que combina CTR con autenticación, es de 2004 y se adoptó en las conexiones seguras ' +
    'a partir de 2008.');

  p.trampas([
    { e: 'Cifrar bloque a bloque sin más', por: 'Es ECB: bloques iguales del mensaje dan cifrados iguales, y la estructura se ve. El pingüino.' },
    { e: 'Reutilizar el vector de inicialización en CBC', por: 'Dos mensajes con el mismo IV y el mismo primer bloque dan el mismo primer cifrado: Eva sabe que empiezan igual. El IV debe ser impredecible y nuevo cada vez.' },
    { e: 'Repetir el nonce en CTR', por: 'El flujo se repite y los dos cifrados son la libreta reutilizada: $c_1 \\oplus c_2 = m_1 \\oplus m_2$. Es el fallo más grave que se puede cometer con CTR.' },
    { e: 'Creer que el cifrado detecta alteraciones', por: 'En CTR un bit cambiado cambia un bit del mensaje, limpiamente. En CBC, un bloque de ruido y un bit. Ninguno avisa: hace falta autenticar.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  function hex(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }

  p.exercise({
    title: 'El relleno',
    level: 'basico',
    gen: function (r) { var n = r.int(1, 70); var falta = 16 - (n % 16); return { n: n, falta: falta, bloques: (n + falta) / 16 }; },
    ask: function (d) { return 'Un mensaje de ' + d.n + ' bytes se cifra con AES en modo CBC con el relleno del tema. ¿Cuántos bytes de relleno se añaden, qué valor tiene cada uno y cuántos bloques resultan?'; },
    fields: [{ name: 'f', label: 'bytes de relleno', w: 'tiny' }, { name: 'v', label: 'valor', w: 'tiny' }, { name: 'b', label: 'bloques', w: 'tiny' }],
    sol: function (d) { return { f: d.falta, v: d.falta, b: d.bloques }; },
    errores: [{ si: function (v, d) { return d.n % 16 === 0 && v.f === 0; }, msg: 'Cuando el mensaje llena justo los bloques, se añade un bloque entero de relleno: si no, el último byte del mensaje se confundiría con relleno.' }],
    hint: function () { return 'Lo que falta hasta el múltiplo de 16 siguiente; si no falta nada, 16. Cada byte lleva ese número.'; },
    steps: function (d) { return ['$' + d.n + ' = ' + Math.floor(d.n / 16) + '\\cdot 16 + ' + (d.n % 16) + '$: ' + (d.n % 16 ? 'faltan $' + d.falta + '$ bytes.' : 'no falta ninguno, así que se añaden 16.'), 'Se añaden ' + d.falta + ' bytes con el valor ' + d.falta + ' ($\\text{' + hex(d.falta) + '}$).', 'Total ' + (d.n + d.falta) + ' bytes: <strong>' + d.bloques + '</strong> bloques.']; },
    answer: function (d) { return d.falta + ' bytes de valor ' + d.falta + ', ' + d.bloques + ' bloques'; }
  });

  p.exercise({
    title: 'Descifrar un byte en CBC',
    level: 'basico',
    gen: function (r) { var dk = r.int(0, 255), prev = r.int(0, 255); return { dk: dk, prev: prev, m: dk ^ prev }; },
    ask: function (d) { return 'En CBC, un byte de $D_k(c_i)$ vale $\\text{' + hex(d.dk) + '}$ y el byte correspondiente de $c_{i-1}$ vale $\\text{' + hex(d.prev) + '}$. ¿Qué byte del mensaje es? Escribe los 8 bits.'; },
    fields: [{ name: 'm', label: 'byte del mensaje', w: 'wide' }],
    sol: function (d) { return { m: CR.bits(d.m, 8) }; },
    check: function (v, d) { var t = String(v.raw.m || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; return t === CR.bits(d.m, 8) ? { ok: true } : { ok: false, msg: '$m_i = D_k(c_i) \\oplus c_{i-1}$: XOR bit a bit.' }; },
    hint: function (d) { return '$\\text{' + hex(d.dk) + '} = ' + CR.bits(d.dk, 8) + '$, $\\text{' + hex(d.prev) + '} = ' + CR.bits(d.prev, 8) + '$.'; },
    steps: function (d) { return ['$' + CR.bits(d.dk, 8) + ' \\oplus ' + CR.bits(d.prev, 8) + ' = ' + CR.bits(d.m, 8) + '$.', 'Es el byte $\\text{' + hex(d.m) + '}$' + (d.m >= 32 && d.m < 127 ? ', el carácter «' + String.fromCharCode(d.m) + '»' : '') + '.']; },
    answer: function (d) { return CR.bits(d.m, 8); }
  });

  p.exercise({
    title: 'Hasta dónde llega un error',
    level: 'medio',
    gen: function (r) { var N = r.int(4, 9), i = r.int(1, N - 1), modo = r.pick(['CBC', 'CTR', 'ECB']); var bloques = modo === 'CBC' ? (i < N ? 2 : 1) : 1; var bits = modo === 'CBC' ? 'ruido' : (modo === 'CTR' ? '1' : 'ruido'); return { N: N, i: i, modo: modo, bloques: modo === 'CBC' && i < N ? 2 : 1, tipo: modo === 'CTR' ? 'bit' : 'ruido' }; },
    ask: function (d) { return 'Un mensaje de ' + d.N + ' bloques va cifrado en modo ' + d.modo + '. Por el camino se cambia un bit del bloque cifrado número ' + d.i + ' (de 1 a ' + d.N + '). Al descifrar, ¿cuántos bloques del mensaje salen alterados? ¿Y cómo sale el bloque ' + d.i + ': como ruido entero o con un solo bit cambiado?'; },
    fields: [{ name: 'n', label: 'bloques alterados', w: 'tiny' }, { name: 't', label: 'el bloque ' + 'afectado', opts: [{ t: 'ruido entero', v: 'ruido' }, { t: 'un solo bit', v: 'bit' }] }],
    sol: function (d) { return { n: d.bloques, t: d.tipo }; },
    hint: function () { return ['ECB: cada bloque va solo. CBC: el bloque pasa por el descifrador y su vecino siguiente por un XOR. CTR: solo un XOR.']; },
    steps: function (d) { var por = { ECB: 'En ECB cada bloque se descifra por separado: solo el ' + d.i + ' sale mal, y como pasa por AES, sale como ruido.', CBC: 'En CBC el bloque ' + d.i + ' sale como ruido (pasa por AES) y el ' + (d.i + 1) + ' sale con exactamente ese bit cambiado (solo entra en un XOR)' + (d.i < d.N ? ': dos bloques.' : '. Aquí es el último, así que solo uno.'), CTR: 'En CTR el cifrado solo entra en un XOR: el bloque ' + d.i + ' sale con ese único bit cambiado, y nada más.' }; return [por[d.modo], 'Bloques alterados: <strong>' + d.bloques + '</strong>.']; },
    answer: function (d) { return d.bloques + ', ' + (d.tipo === 'bit' ? 'un bit' : 'ruido'); }
  });

  p.exercise({
    title: 'El contador',
    level: 'medio',
    gen: function (r) { var bytes = r.int(20, 4000); return { bytes: bytes, bloques: Math.ceil(bytes / 16), ultimo: bytes % 16 || 16 }; },
    ask: function (d) { return 'Un mensaje de ' + d.bytes + ' bytes se cifra en modo CTR. ¿Cuántas veces hay que cifrar el contador con AES? ¿Cuántos bytes del último bloque de flujo se usan? ¿Hace falta relleno?'; },
    fields: [{ name: 'n', label: 'cifrados de AES', w: 'tiny' }, { name: 'u', label: 'bytes usados del último', w: 'tiny' }, { name: 'r', label: 'relleno', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { n: d.bloques, u: d.ultimo, r: 'no' }; },
    hint: function () { return 'Un cifrado por cada 16 bytes de flujo, redondeando hacia arriba; del último se usa lo que haga falta y el resto se tira.'; },
    steps: function (d) { return ['$' + d.bytes + ' / 16 = ' + U.fmt(d.bytes / 16, 2) + '$: hacen falta $' + d.bloques + '$ bloques de flujo.', 'Del último se usan ' + d.ultimo + ' bytes; los demás se descartan.', 'No hay relleno: el cifrado mide exactamente ' + d.bytes + ' bytes, como el mensaje.']; },
    answer: function (d) { return d.bloques + ', ' + d.ultimo + ', no'; }
  });

  p.exercise({
    title: 'Cambiar un mensaje sin la clave',
    level: 'avanzado',
    gen: function (r) { var a = r.int(48, 57), b = r.int(48, 57); if (a === b) return null; var c = r.int(0, 255); return { a: a, b: b, c: c, delta: a ^ b, c2: c ^ a ^ b }; },
    ask: function (d) { return 'Un mensaje cifrado en CTR contiene la cifra «' + String.fromCharCode(d.a) + '» (byte $\\text{' + hex(d.a) + '}$) en cierta posición, y el byte cifrado en esa posición es $\\text{' + hex(d.c) + '}$. Eva quiere que Benito lea «' + String.fromCharCode(d.b) + '» (byte $\\text{' + hex(d.b) + '}$) sin conocer la clave. ¿Con qué byte tiene que hacer XOR al byte cifrado, y qué byte cifrado envía? Escribe los dos en 8 bits.'; },
    fields: [{ name: 'd', label: 'XOR con', w: 'wide' }, { name: 'c', label: 'byte enviado', w: 'wide' }],
    sol: function (d) { return { d: CR.bits(d.delta, 8), c: CR.bits(d.c2, 8) }; },
    check: function (v, d) {
      function lee(s) { return String(s || '').replace(/[^01]/g, ''); }
      var a = lee(v.raw.d) === CR.bits(d.delta, 8), b = lee(v.raw.c) === CR.bits(d.c2, 8);
      if (a && b) return { ok: true };
      return { ok: false, msg: 'En CTR, $c = m \\oplus s$. Si se envía $c \\oplus \\Delta$, Benito obtiene $m \\oplus \\Delta$: basta con $\\Delta = m \\oplus m^{*}$, el XOR de la cifra vieja y la nueva.', fields: { d: a, c: b } };
    },
    hint: function (d) { return ['$\\Delta = \\text{' + hex(d.a) + '} \\oplus \\text{' + hex(d.b) + '}$.', 'Byte enviado: $\\text{' + hex(d.c) + '} \\oplus \\Delta$.']; },
    steps: function (d) { return ['$\\Delta = ' + CR.bits(d.a, 8) + ' \\oplus ' + CR.bits(d.b, 8) + ' = ' + CR.bits(d.delta, 8) + '$.', 'Envía $' + CR.bits(d.c, 8) + ' \\oplus ' + CR.bits(d.delta, 8) + ' = ' + CR.bits(d.c2, 8) + '$.', 'Benito descifra $c^{*} \\oplus s = m \\oplus \\Delta = \\text{' + hex(d.b) + '}$, la cifra «' + String.fromCharCode(d.b) + '», sin ninguna señal de que algo se haya tocado. Eva no ha leído nada y ha cambiado una cantidad. Por eso el cifrado necesita autenticación.']; },
    answer: function (d) { return CR.bits(d.delta, 8) + ' · ' + CR.bits(d.c2, 8); }
  });

  p.keys([
    'Un cifrado por bloques necesita un modo para un mensaje: cómo se rellena y cómo se encadenan los bloques.',
    '<strong>ECB</strong> cifra cada bloque igual: bloques iguales dan cifrados iguales y la estructura se ve. Nunca.',
    '<strong>CBC</strong>: $c_i = E_k(m_i \\oplus c_{i-1})$ con un IV nuevo e impredecible. Un bit alterado destroza un bloque y cambia un bit del siguiente.',
    '<strong>CTR</strong>: $c_i = m_i \\oplus E_k(\\text{nonce}\\,\\Vert\\,i)$, paralelo y sin relleno. El nonce no se repite jamás; un bit alterado cambia exactamente un bit.',
    'Ningún modo detecta alteraciones: cifrar no es autenticar.'
  ]);
});
