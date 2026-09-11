/* Tema: Guardar contrasenas: sal y lentitud */
Course.topic('cr-contrasenas', function (p) {

  p.puente('Una [[cr-hash|función hash]] no se deshace, y la [[cr-entropia|entropía]] de una ' +
    'contraseña elegida por una persona es pequeña. Juntas, las dos cosas explican cómo un servidor ' +
    'comprueba tu contraseña sin conocerla, y por qué eso, hecho a la ligera, ha provocado algunas de ' +
    'las mayores fugas de la historia.');

  p.text('Cuando te registras en un servicio, el servidor no debería guardar tu contraseña. Si la guarda ' +
    'y le roban la base de datos, el ladrón tiene tu contraseña, y probablemente la de tu correo, ' +
    'porque la gente repite. Lo que guarda es su <strong>hash</strong>: al entrar, hace el hash de lo ' +
    'que tecleas y lo compara. Eso parece resolverlo. No lo resuelve del todo, y la diferencia entre ' +
    'hacerlo bien y hacerlo mal son varias horas frente a varios siglos.');

  /* ---------------------------------------------------------------- */
  p.section('El ataque con la base de datos en la mano');

  p.text('Un hash no se invierte, pero una contraseña no es un mensaje cualquiera: es corta y ' +
    'previsible. Con la base de datos robada, el atacante no necesita invertir nada. Toma un ' +
    'diccionario de contraseñas frecuentes, decenas de millones, sacadas de fugas anteriores, ' +
    'calcula el hash de cada una y busca coincidencias. Una tarjeta gráfica hace diez mil millones ' +
    'de SHA-256 por segundo: el diccionario entero en una fracción de segundo, y todas las ' +
    'combinaciones de ocho letras minúsculas en veinte segundos.');

  p.demo({
    title: 'Romper hashes con un diccionario',
    intro: 'Cuatro usuarios con sus contraseñas guardadas como SHA-256. El atacante prueba palabras corrientes seguidas de un número de 0 a 99. Dos usuarios tienen la misma contraseña: mira sus hashes.',
    predice: 'Dos usuarios con la misma contraseña, ¿tendrán el mismo hash? ¿Qué le dice eso a un atacante antes incluso de romper nada?',
    build: function (host) {
      var PAL = ['casa', 'perro', 'gato', 'sol', 'luna', 'amor', 'hola', 'clave', 'futbol', 'madrid', 'barcelona', 'verano', 'agua', 'fuego', 'tierra', 'flor', 'coche', 'moto', 'musica', 'cine', 'libro', 'mesa', 'silla', 'puerta', 'ventana', 'cielo', 'mar', 'rio', 'monte', 'valle'];
      var usuarios = [{ u: 'ana', pw: 'casa12' }, { u: 'luis', pw: 'futbol7' }, { u: 'marta', pw: 'casa12' }, { u: 'pedro', pw: 'xk9!Tz#q' }];
      var out = W.mono(host, '');
      function pinta() {
        var h = '<b>base de datos robada:</b>\n';
        usuarios.forEach(function (x) { x.h = CR.sha256(x.pw); h += (x.u + '      ').slice(0, 7) + x.h.slice(0, 24) + '…\n'; });
        var tabla = {}, n = 0;
        PAL.forEach(function (w) { for (var k = 0; k < 100; k++) { tabla[CR.sha256(w + k)] = w + k; n++; } });
        h += '\n<b>diccionario:</b> ' + PAL.length + ' palabras × 100 números = ' + n + ' candidatos, hasheados todos\n\n';
        usuarios.forEach(function (x) { h += (x.u + '      ').slice(0, 7) + (tabla[x.h] ? '<span class="cr-dif">rota: «' + tabla[x.h] + '»</span>' : '<span class="cr-ok">no está en el diccionario</span>') + '\n'; });
        h += '\n<span class="cr-tenue">ana y marta tienen el mismo hash: el atacante lo ve sin romper nada, y una vez rota una, las dos.</span>';
        out.set(h);
      }
      pinta();
    }
  });

  p.comprueba('Un servidor guarda $H(\\text{contraseña})$ con SHA-256, sin más. Le roban la base de datos. ¿Qué contraseñas caen?', [
    { t: 'Las que estén en los diccionarios del atacante, que son la mayoría de las que elige la gente, en minutos; las largas y al azar, no', ok: true, por: 'El hash no se invierte, pero se prueba: diez mil millones de candidatos por segundo. Lo que decide es la entropía de cada contraseña. Y las repetidas se ven a simple vista.' },
    { t: 'Ninguna: SHA-256 no se puede invertir', ok: false, por: 'No hace falta invertir: se calcula el hash de cada candidato y se compara. Las contraseñas humanas tienen pocos candidatos.' },
    { t: 'Todas, porque el hash es determinista', ok: false, por: 'Una contraseña de 16 símbolos al azar tiene $2^{105}$ candidatos: el atacante no llega. Caen las previsibles.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('La sal');

  p.text('Lo primero que se corrige es que dos contraseñas iguales den el mismo hash, y que un ' +
    'diccionario hasheado una vez sirva para todos los usuarios de todos los servicios. Se añade a ' +
    'cada contraseña una <strong>sal</strong>: un valor al azar, distinto para cada usuario, que se ' +
    'guarda en claro junto al hash. La sal no es secreta; su trabajo es obligar a repetir el ' +
    'ataque para cada usuario.');

  p.formula('\\text{guardado} = (\\text{sal},\\ H(\\text{sal} \\,\\Vert\\, \\text{contraseña}))', 'hash con sal',
    'Se lee: <em>«se guarda la sal y el hash de la sal concatenada con la contraseña»</em>.<br><br>Con ' +
    'una sal de 128 bits, la misma contraseña da $2^{128}$ hashes posibles: las tablas precalculadas ' +
    'no sirven, dos usuarios con la misma contraseña tienen hashes distintos, y romper un millón de ' +
    'usuarios cuesta un millón de veces romper uno.');

  p.demo({
    title: 'La misma base de datos, con sal',
    intro: 'Los mismos cuatro usuarios, ahora con una sal de 8 bytes cada uno. El atacante tiene que hashear el diccionario entero para cada usuario, y ana y marta, con la misma contraseña, ya no se parecen.',
    predice: 'Con 4 usuarios y 3000 candidatos, ¿cuántos hashes calcula el atacante sin sal? ¿Y con sal? ¿Y con un millón de usuarios?',
    build: function (host) {
      var PAL = ['casa', 'perro', 'gato', 'sol', 'luna', 'amor', 'hola', 'clave', 'futbol', 'madrid', 'barcelona', 'verano', 'agua', 'fuego', 'tierra', 'flor', 'coche', 'moto', 'musica', 'cine', 'libro', 'mesa', 'silla', 'puerta', 'ventana', 'cielo', 'mar', 'rio', 'monte', 'valle'];
      var r = U.rng(31), usuarios = [{ u: 'ana', pw: 'casa12' }, { u: 'luis', pw: 'futbol7' }, { u: 'marta', pw: 'casa12' }, { u: 'pedro', pw: 'xk9!Tz#q' }];
      usuarios.forEach(function (x) { var s = []; for (var i = 0; i < 8; i++) s.push(r.int(0, 255)); x.sal = CR.hex(s); x.h = CR.sha256(x.sal + x.pw); });
      var out = W.mono(host, '');
      function pinta() {
        var h = '<b>base de datos robada:</b>\n', total = 0;
        usuarios.forEach(function (x) { h += (x.u + '      ').slice(0, 7) + 'sal ' + x.sal + '   hash ' + x.h.slice(0, 16) + '…\n'; });
        h += '\n<b>ataque, usuario por usuario:</b>\n';
        usuarios.forEach(function (x) {
          var hallada = null, n = 0;
          for (var i = 0; i < PAL.length && !hallada; i++) for (var k = 0; k < 100; k++) { n++; if (CR.sha256(x.sal + PAL[i] + k) === x.h) { hallada = PAL[i] + k; break; } }
          total += hallada ? n : PAL.length * 100;
          h += (x.u + '      ').slice(0, 7) + (hallada ? '<span class="cr-dif">rota tras ' + n + ' hashes: «' + hallada + '»</span>' : '<span class="cr-ok">no rota tras ' + (PAL.length * 100) + ' hashes</span>') + '\n';
        });
        h += '\n<b>hashes calculados:</b> ' + total + '   <span class="cr-tenue">(sin sal bastaban 3000 para los cuatro y para cualquier otra base de datos)</span>\n<span class="cr-tenue">La sal no salva a ana ni a luis: sus contraseñas siguen siendo malas. Multiplica el trabajo, no lo impide.</span>';
        out.set(h);
      }
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Lentitud a propósito');

  p.text('La sal multiplica el trabajo por el número de usuarios; queda multiplicarlo por algo más. La ' +
    'idea es usar un hash <strong>deliberadamente lento</strong>: en vez de un SHA-256, cien mil ' +
    'SHA-256 encadenados, o mejor, una función que además necesite mucha memoria, para que las ' +
    'tarjetas gráficas, que tienen poca por núcleo, pierdan su ventaja. Para el usuario, entrar ' +
    'tarda una décima de segundo. Para el atacante, cada candidato cuesta cien mil veces más.');

  p.formula('\\text{coste del ataque} = \\frac{\\text{candidatos} \\cdot \\text{iteraciones}}{\\text{velocidad}}', 'el factor de coste',
    'Un diccionario de $10^{10}$ candidatos, a $10^{10}$ hashes por segundo, se recorre en un segundo. ' +
    'Con $10^5$ iteraciones, en $10^5$ segundos: más de un día por usuario. Y con un millón de ' +
    'usuarios salados, tres mil años.<br><br>El número de iteraciones se sube con los años, conforme ' +
    'las máquinas mejoran: eso es el <em>factor de coste</em>, y las funciones modernas, bcrypt, ' +
    'scrypt y Argon2, lo llevan escrito en el propio hash.');

  p.demo({
    title: 'Cuánto cuesta cada intento',
    intro: 'Tu navegador calcula el hash iterado de una contraseña y mide lo que tarda. Con ese dato se estima cuánto tardaría un atacante mil veces más rápido en recorrer un diccionario de mil millones de candidatos.',
    predice: 'Si pasas de 1 000 a 100 000 iteraciones, ¿cuánto se alarga el ataque: por 10, por 100 o por 1000?',
    build: function (host) {
      var iter = 2000;
      var out = W.readout(host, '');
      function mide() {
        var t0 = performance.now(), h = CR.sha256Bytes('sal' + 'contraseña');
        for (var i = 1; i < iter; i++) h = CR.sha256Bytes(h);
        var ms = performance.now() - t0, porSeg = 1000 / ms, atacante = porSeg * 1000, cand = 1e9, seg = cand / atacante;
        out.set(U.miles(iter) + ' iteraciones: <strong>' + U.fmt(ms, 0) + ' ms</strong> por comprobación en este navegador.<br>Un atacante con mil veces más potencia probaría $' + U.fmt(atacante, 0) + '$ candidatos por segundo.<br>Diccionario de $10^9$ candidatos para un usuario: <strong>' + (seg < 3600 ? U.fmt(seg / 60, 1) + ' minutos' : (seg < 86400 * 3 ? U.fmt(seg / 3600, 1) + ' horas' : U.fmt(seg / 86400, 1) + ' días')) + '</strong>.<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Con un SHA-256 sin iterar, la misma tarjeta gráfica haría $10^{10}$ por segundo y acabaría en una décima de segundo.</span>');
      }
      W.slider(W.row(host), { label: 'iteraciones', min: 100, max: 20000, step: 100, value: iter, on: function (v) { iter = v; mide(); } });
      mide();
    }
  });

  p.ejemplo({
    title: 'Un servidor bien y mal configurado',
    enunciado: 'Un atacante con $10^{10}$ hashes por segundo roba dos bases de datos de un millón de usuarios, y prueba un diccionario de $10^8$ candidatos por usuario. La primera guarda SHA-256 sin sal; la segunda, hash con sal y $10^5$ iteraciones. ¿Cuánto tarda en cada caso en probar el diccionario contra todos?',
    pasos: [
      { t: '<strong>Sin sal.</strong> Hashea el diccionario una vez, $10^8$ hashes en $0{,}01$ segundos, y compara con el millón de hashes con una tabla: prácticamente instantáneo. Todas las contraseñas del diccionario caen a la vez.', antes: 'Sin sal, ¿hay que repetir el trabajo por usuario?' },
      { t: '<strong>Con sal.</strong> Cada usuario tiene su sal: $10^8$ candidatos por $10^6$ usuarios son $10^{14}$ hashes. A $10^{10}$ por segundo, $10^4$ segundos: casi tres horas. Mucho más, pero asequible.', antes: 'Con sal hay que rehacer el diccionario por usuario. ¿Cuántos hashes en total?' },
      { t: '<strong>Con sal y $10^5$ iteraciones.</strong> Cada candidato cuesta $10^5$ hashes: $10^{19}$ en total, $10^9$ segundos, unos 32 años. Y el usuario, al entrar, solo espera $10^5$ hashes: unos diez milisegundos.', antes: 'Multiplica por las iteraciones. ¿Cuántos segundos?' },
      { t: '<strong>La asimetría.</strong> Lo que al usuario le cuesta una vez, al atacante le cuesta una vez por candidato y por usuario. Cada iteración de más es un factor para el atacante y una fracción de milisegundo para el usuario.' }
    ],
    cierre: 'De instantáneo a décadas sin tocar ninguna contraseña: solo con cómo se guarda. Por eso las fugas de bases de datos bien configuradas casi no exponen contraseñas, y las mal configuradas exponen millones.'
  });

  p.util('Las fugas lo demuestran. En 2012 se filtraron 6,5 millones de hashes de una red profesional, ' +
    'SHA-1 sin sal: el 90 % se rompió en días. En 2009 una red social guardaba 32 millones de ' +
    'contraseñas en claro, y esa lista es hoy el diccionario de partida de cualquier atacante. En ' +
    '2013 una empresa de software cifró 150 millones con 3DES en modo ECB, y las contraseñas ' +
    'repetidas se veían como cifrados repetidos. Las guías actuales piden Argon2, scrypt o bcrypt ' +
    'con un coste ajustado a una décima de segundo, y los gestores de contraseñas y las llaves de ' +
    'acceso sin contraseña, que verás al final del bloque, hacen que nada de esto haga falta.');

  p.hist('Robert Morris y Ken Thompson describieron en 1979 cómo Unix guardaba las contraseñas: un ' +
    'hash basado en DES, con una sal de 12 bits y 25 iteraciones a propósito para frenar la fuerza ' +
    'bruta. Casi todo lo de este tema estaba ya ahí. PBKDF2 se estandarizó en 2000; bcrypt es de ' +
    'Niels Provos y David Mazières, de 1999; scrypt, de Colin Percival, de 2009, fue el primero en ' +
    'exigir memoria; y Argon2 ganó en 2015 un concurso público de funciones para contraseñas.');

  p.trampas([
    { e: 'Guardar las contraseñas cifradas', por: 'Cifradas se descifran, y la clave está en el mismo servidor. Lo que se guarda es un hash, que no se deshace.' },
    { e: 'Usar SHA-256 a secas', por: 'Diez mil millones por segundo en una tarjeta gráfica: un diccionario de todas las fugas anteriores en un segundo. Hace falta sal e iteraciones.' },
    { e: 'Usar la misma sal para todos, o guardarla en secreto', por: 'La misma sal para todos vuelve a permitir una tabla para toda la base de datos. Y la sal no necesita ser secreta: su trabajo es ser distinta, no oculta.' },
    { e: 'Creer que la sal arregla una contraseña mala', por: '«casa12» con sal se rompe tras unos cientos de hashes. La sal multiplica el trabajo por usuario; la entropía de la contraseña lo multiplica por candidato.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántos hashes distintos',
    level: 'basico',
    gen: function (r) { var s = r.pick([8, 12, 16, 32, 64, 128]); return { s: s, v: Math.pow(2, s) }; },
    ask: function (d) { return 'Un sistema usa sales de ' + d.s + ' bits. ¿Cuántos hashes distintos puede tener una misma contraseña?'; },
    fields: [{ name: 'v', label: 'hashes', w: 'wide' }],
    sol: function (d) { return { v: d.v }; },
    rel: 1e-9,
    hint: function () { return 'Uno por cada sal posible.'; },
    steps: function (d) { return ['$2^{' + d.s + '} = ' + (d.v < 1e15 ? U.miles(d.v) : d.v.toExponential(2).replace('e+', '\\cdot 10^{') + '}') + '$ sales, y cada una da un hash distinto.', d.s <= 16 ? 'Pocas: una tabla precalculada de ' + U.miles(d.v) + ' veces el diccionario sigue siendo posible. Las sales actuales tienen 128 bits.' : 'Ninguna tabla precalculada puede cubrirlas: el ataque hay que hacerlo por usuario.']; },
    answer: function (d) { return U.miles(d.v); }
  });

  p.exercise({
    title: 'El diccionario contra un hash rápido',
    level: 'basico',
    gen: function (r) { var n = r.pick([1e6, 1e8, 1e9, 1e10]), v = r.pick([1e8, 1e9, 1e10]); return { n: n, v: v, en: Math.round(Math.log(n) / Math.LN10), ev: Math.round(Math.log(v) / Math.LN10), seg: n / v }; },
    ask: function (d) { return 'Un atacante calcula $10^{' + d.ev + '}$ hashes por segundo y tiene un diccionario de $10^{' + d.en + '}$ candidatos. Sin sal ni iteraciones, ¿cuántos segundos tarda en probarlo entero contra una base de datos, sea del tamaño que sea?'; },
    fields: [{ name: 's', label: 'segundos', w: 'tiny' }],
    sol: function (d) { return { s: d.seg }; },
    rel: 1e-3,
    hint: function () { return 'Sin sal, el diccionario se hashea una sola vez y se compara con todos los usuarios.'; },
    steps: function (d) { return ['$10^{' + d.en + '} / 10^{' + d.ev + '} = ' + (d.seg >= 1 ? U.miles(d.seg) : U.fmt(d.seg, 3)) + '$ segundos.', 'Y sirve para todos los usuarios a la vez: comparar es gratis con una tabla.']; },
    answer: function (d) { return String(d.seg); }
  });

  p.exercise({
    title: 'Sal e iteraciones',
    level: 'medio',
    gen: function (r) { var u = r.pick([1e4, 1e5, 1e6]), it = r.pick([1e3, 1e4, 1e5]), n = 1e8, v = 1e10; var seg = u * n * it / v; return { u: u, it: it, seg: seg, anos: seg / 31557600, eu: Math.round(Math.log(u) / Math.LN10), ei: Math.round(Math.log(it) / Math.LN10) }; },
    ask: function (d) { return 'Base de datos de $10^{' + d.eu + '}$ usuarios, cada uno con su sal, y hash de $10^{' + d.ei + '}$ iteraciones. El atacante prueba $10^8$ candidatos por usuario a $10^{10}$ hashes por segundo. ¿Cuántos años tarda en probar el diccionario contra todos? (dos decimales, o notación científica)'; },
    fields: [{ name: 'a', label: 'años', w: 'wide' }],
    sol: function (d) { return { a: d.anos }; },
    rel: 2e-3,
    hint: function () { return 'Hashes totales: usuarios × candidatos × iteraciones. Entre la velocidad, y entre $3{,}156\\cdot 10^7$.'; },
    steps: function (d) { return ['Hashes: $10^{' + d.eu + '}\\cdot 10^{8}\\cdot 10^{' + d.ei + '} = 10^{' + (d.eu + 8 + d.ei) + '}$.', 'Segundos: $10^{' + (d.eu + 8 + d.ei - 10) + '}$.', 'Años: $' + (d.anos < 1000 ? U.fmt(d.anos, 2) : d.anos.toExponential(2).replace('e+', '\\cdot 10^{') + '}') + '$.', d.anos < 1 ? 'Poco: hay que subir las iteraciones.' : 'El usuario espera $10^{' + d.ei + '}$ hashes al entrar, unos ' + U.fmt(d.it / 1e6 * 1000, d.it < 1e5 ? 1 : 0) + ' ms. La asimetría trabaja para él.']; },
    answer: function (d) { return d.anos.toExponential(2) + ' años'; }
  });

  p.exercise({
    title: 'Qué contraseña cae',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'una palabra del diccionario con dos cifras detrás', bits: 22, cae: true },
        { t: 'ocho letras minúsculas al azar', bits: 37.6, cae: true },
        { t: 'una fecha de nacimiento', bits: 15, cae: true },
        { t: 'doce símbolos del teclado al azar', bits: 78.8, cae: false },
        { t: 'cinco palabras al azar de una lista de 7776', bits: 64.6, cae: false },
        { t: 'diez letras minúsculas al azar', bits: 47, cae: true },
        { t: 'veinte símbolos al azar de un gestor de contraseñas', bits: 131, cae: false }
      ];
      var c = r.pick(casos), it = r.pick([1, 1e4]);
      var seg = Math.pow(2, c.bits - 1) * it / 1e10;
      return { c: c, it: it, seg: seg, cae: seg < 86400 * 365 };
    },
    ask: function (d) { return 'Contraseña: ' + d.c.t + ' (unos ' + U.fmt(d.c.bits, 1) + ' bits). El servidor guarda el hash con sal y ' + (d.it === 1 ? 'sin iteraciones' : '$10^4$ iteraciones') + '; el atacante hace $10^{10}$ hashes por segundo. ¿Cae en menos de un año?'; },
    fields: [{ name: 'q', label: 'Cae', opts: [{ t: 'sí, en menos de un año', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { q: d.cae ? 'si' : 'no' }; },
    hint: function () { return '$2^{H-1}$ candidatos de media, por las iteraciones, entre $10^{10}$. Un año son $3{,}2\\cdot 10^7$ segundos.'; },
    steps: function (d) { return ['$2^{' + U.fmt(d.c.bits - 1, 1) + '}\\cdot ' + (d.it === 1 ? '1' : '10^4') + ' / 10^{10} \\approx ' + d.seg.toExponential(1).replace('e+', '\\cdot 10^{').replace('e-', '\\cdot 10^{-') + '}$ segundos' + (d.seg > 1e7 ? ', ' + U.fmt(d.seg / 31557600, 0) + ' años' : '') + '.', d.cae ? '<strong>Cae.</strong> ' + (d.c.bits < 40 ? 'Con tan pocos bits, ni las iteraciones salvan: la entropía manda.' : 'Las iteraciones no bastan para esa entropía.') : '<strong>No cae.</strong> ' + (d.c.bits > 60 ? 'La entropía de la contraseña hace el trabajo.' : 'Las iteraciones lo dejan fuera de alcance.')]; },
    answer: function (d) { return d.cae ? 'sí' : 'no'; }
  });

  p.exercise({
    title: 'Ajustar el coste',
    level: 'avanzado',
    gen: function (r) { var v = r.pick([1e5, 1e6, 2e6]), ms = r.pick([50, 100, 200, 500]); var it = Math.floor(v * ms / 1000); var itR = Math.pow(10, Math.floor(Math.log(it) / Math.LN10)); var bits = r.pick([30, 36, 40]); var seg = Math.pow(2, bits - 1) * it / 1e10; return { v: v, ms: ms, it: it, bits: bits, seg: seg, dias: seg / 86400 }; },
    ask: function (d) { return 'El servidor calcula $' + U.miles(d.v) + '$ hashes por segundo y se acepta que comprobar una contraseña tarde ' + d.ms + ' ms. ¿Cuántas iteraciones se pueden poner? Con ese número, ¿cuántos días tarda un atacante a $10^{10}$ hashes por segundo en recorrer las $2^{' + (d.bits - 1) + '}$ candidatos medios de una contraseña de ' + d.bits + ' bits? (un decimal)'; },
    fields: [{ name: 'it', label: 'iteraciones', w: 'tiny' }, { name: 'd', label: 'días', w: 'tiny' }],
    sol: function (d) { return { it: d.it, d: d.dias }; },
    dec: { d: 1 }, tol: 2e-3,
    hint: function () { return ['Iteraciones: velocidad del servidor por los segundos que se aceptan.', 'Atacante: $2^{H-1}$ por las iteraciones, entre $10^{10}$, entre 86 400.']; },
    steps: function (d) { return ['$' + U.miles(d.v) + '\\cdot ' + U.fmt(d.ms / 1000, 2) + ' = ' + U.miles(d.it) + '$ iteraciones.', 'Atacante: $2^{' + (d.bits - 1) + '}\\cdot ' + U.miles(d.it) + ' / 10^{10} = ' + U.fmt(d.seg, 0) + '$ segundos, $' + U.fmt(d.dias, 1) + '$ días.', d.dias < 30 ? 'Pocos: contra una contraseña de ' + d.bits + ' bits no basta. La solución es más entropía en la contraseña, no más milisegundos de espera.' : 'Aceptable para esa entropía; y cada año se pueden subir las iteraciones conforme el servidor mejore.']; },
    answer: function (d) { return U.miles(d.it) + ' iteraciones, ' + U.fmt(d.dias, 1) + ' días'; }
  });

  p.keys([
    'El servidor guarda un hash, no la contraseña. Pero un hash de algo previsible se rompe probando candidatos: $10^{10}$ por segundo.',
    'La <strong>sal</strong>, aleatoria y distinta por usuario, guardada en claro, obliga a repetir el ataque por usuario y anula las tablas precalculadas.',
    'El hash <strong>lento</strong> (iteraciones o memoria: PBKDF2, bcrypt, scrypt, Argon2) multiplica el coste del atacante por el factor que se elija; al usuario le cuesta una décima de segundo.',
    'Coste $=$ candidatos × usuarios × iteraciones / velocidad. La entropía de la contraseña sigue mandando: la sal y la lentitud no arreglan «casa12».',
    'Las grandes fugas de contraseñas fueron de hashes sin sal, cifrados o en claro.'
  ]);
});
