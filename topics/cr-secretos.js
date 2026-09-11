/* Tema: Que es un secreto: mensaje, clave y adversario */
Course.topic('cr-secretos', function (p) {

  p.puente('Este bloque pone a trabajar la aritmética del curso para guardar secretos. Empieza con ' +
    'las reglas del juego, y para eso bastan dos herramientas que ya tienes: las ' +
    '[[lg-conjuntos|aplicaciones biyectivas]], porque cifrar tiene que poder deshacerse, y el ' +
    '[[pe-combinatoria|recuento]], porque la fuerza de un secreto se mide contando cuántas llaves hay.',
    'Por dónde empezamos');

  p.text('Hay tres personajes que van a acompañarte durante todo el bloque. <strong>Alicia</strong> quiere ' +
    'enviar un mensaje a <strong>Benito</strong>, y <strong>Eva</strong> escucha todo lo que pasa por el ' +
    'canal. No se puede evitar que Eva escuche: el canal es una carta que pasa por muchas manos, una ' +
    'onda de radio, un cable de internet. Lo que sí se puede es conseguir que lo que oiga no le sirva ' +
    'de nada. A eso, y solo a eso, se dedica la criptografía.');

  /* ---------------------------------------------------------------- */
  p.section('Cifrar, codificar y esconder no son lo mismo');

  p.text('Tres cosas que se confunden y que conviene separar desde el primer día. <strong>Codificar</strong> ' +
    'es cambiar la forma de un mensaje con una tabla que todo el mundo conoce: el morse, el ASCII de ' +
    'los ordenadores, el braille. No esconde nada; solo lo adapta a un medio. <strong>Esconder</strong> ' +
    'es que Eva no sepa siquiera que hay mensaje: tinta invisible, un texto dentro de una foto. Es la ' +
    '<em>esteganografía</em>, y falla en cuanto alguien mira bien. <strong>Cifrar</strong> es transformar ' +
    'el mensaje de modo que hasta quien lo tenga entero no pueda leerlo, salvo que conozca un dato ' +
    'pequeño y secreto: la <strong>clave</strong>.');

  p.formulas([
    'c = E_k(m), \\qquad m = D_k(c)',
    'D_k\\bigl(E_k(m)\\bigr) = m \\quad \\text{para todo } m'
  ], 'cifrar y descifrar',
    'Se lee: <em>«ce es igual a e sub ka de eme»</em>: el texto cifrado $c$ sale de aplicar al mensaje $m$ ' +
    'la función de cifrado $E$ con la clave $k$. Y $D_k$ es la función que lo deshace.<br><br>' +
    'La segunda línea es la condición que lo sostiene todo: con la misma clave, descifrar lo cifrado ' +
    'devuelve el original, sea cual sea el mensaje. Es decir, para cada clave $k$, $E_k$ tiene que ser ' +
    'una [[lg-conjuntos|aplicación biyectiva]]: dos mensajes distintos no pueden dar el mismo cifrado, ' +
    'porque entonces Benito no sabría cuál de los dos le han enviado.');

  p.demo({
    title: 'Lo que ve Eva',
    intro: 'Escribe un mensaje y elige qué le hace Alicia antes de enviarlo. La columna de Eva muestra lo que pasa por el canal y si ella, que conoce todas las tablas públicas pero ninguna clave, puede leerlo.',
    predice: 'Si Alicia codifica el mensaje en números (A = 0, B = 1…) y Eva conoce esa tabla, ¿podrá leerlo? ¿Y si además Alicia le suma a cada número una clave secreta?',
    build: function (host) {
      var modo = 'codificar', clave = 7, mensaje = 'NOS VEMOS EN EL PUENTE';
      var out = W.mono(host, '');
      function pinta() {
        var t = CR.limpia(mensaje, true), canal, eva;
        if (modo === 'codificar') {
          canal = t.split('').map(function (c) { return c === ' ' ? '/' : CR.num(c); }).join(' ');
          eva = '<span class="cr-ok">lo lee</span>: la tabla A = 0, B = 1… es pública. Codificar no protege.';
        } else if (modo === 'esconder') {
          var pal = ['Nada', 'Otra', 'Sola', 'Vale', 'Esta', 'Mira', 'Osos', 'Sale'];
          canal = t.replace(/ /g, '').split('').map(function (c, i) { return c + pal[i % pal.length].slice(1); }).join(' ');
          eva = '<span class="cr-tenue">no ve nada raro… hasta que lee las iniciales</span>. Esconder solo aguanta mientras nadie sospeche.';
        } else {
          canal = t.split('').map(function (c) { return c === ' ' ? '/' : CR.mod(CR.num(c) + clave, 26); }).join(' ');
          eva = '<span class="cr-dif">no lo lee</span>: conoce el método, sumar una clave, pero no la clave. Y con 25 posibles la probará enseguida. Eso viene en el tema siguiente.';
        }
        out.set('<b>Alicia envía:</b> ' + U.escape(t) + '\n<b>Por el canal pasa:</b> ' + U.escape(canal) + '\n<b>Eva</b> ' + eva);
      }
      W.texto(host, { label: 'mensaje de Alicia', value: mensaje, max: 40, on: function (v) { mensaje = v; pinta(); } });
      W.chips(host, [{ label: 'codificar en números', value: 'codificar' }, { label: 'esconder en un acróstico', value: 'esconder' }, { label: 'cifrar con una clave', value: 'cifrar' }], { value: modo, on: function (v) { modo = v; pinta(); } });
      W.slider(W.row(host), { label: 'clave secreta (solo al cifrar)', min: 1, max: 25, step: 1, value: clave, on: function (v) { clave = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Un banco envía los números de cuenta «protegidos» escribiéndolos en base 2. ¿Están cifrados?', [
    { t: 'No: es una codificación. Cualquiera que conozca el sistema binario los lee, y el sistema binario es público', ok: true, por: 'No hay clave. Lo que decide si algo está cifrado no es que parezca ilegible, sino que haga falta un dato secreto para leerlo.' },
    { t: 'Sí, porque un humano no los entiende a simple vista', ok: false, por: 'Eva no es un humano con prisa: es alguien con un ordenador y todo el tiempo del mundo. Pasar de base 2 a base 10 le cuesta nada.' },
    { t: 'Sí, si el banco no dice que están en base 2', ok: false, por: 'Eso es esconder, no cifrar, y aguanta hasta la primera persona que reconozca una ristra de ceros y unos. La seguridad no puede depender de que nadie se fije.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El principio de Kerckhoffs: el secreto está en la clave');

  p.text('Parece natural pensar que un sistema es más seguro si nadie sabe cómo funciona. La historia ' +
    'dice lo contrario, una y otra vez. Un método se comparte con muchas personas, se escribe en ' +
    'manuales, se construye en máquinas que se capturan; antes o después se conoce. En 1883 Auguste ' +
    'Kerckhoffs lo dejó por escrito: un sistema tiene que seguir siendo seguro <strong>aunque todo ' +
    'lo que no sea la clave caiga en manos del enemigo</strong>. Claude Shannon lo resumió en 1949 ' +
    'con más crudeza: <em>el enemigo conoce el sistema</em>.');

  p.list([
    'La clave es pequeña, se cambia a menudo y se puede guardar en la cabeza. El método es grande y se queda.',
    'Un método público lo examinan miles de personas que quieren romperlo. Un método secreto lo ha examinado solo su autor.',
    'Cuando cae una clave, se cambia la clave. Cuando cae un método secreto, hay que cambiarlo todo.'
  ]);

  p.note('En este bloque, todo lo que se explica es público: cómo funciona el cifrado de César, el ' +
    'AES de tu navegador o las firmas de tu tarjeta. Lo único que Eva no tiene es la clave. Si ' +
    'alguna vez un sistema te pide confiar en que «el algoritmo es secreto», ya sabes qué pensar.',
    'ok', 'La regla del bloque');

  p.comprueba('Una empresa vende un cifrado «tan seguro que ni siquiera revelamos cómo funciona». ¿Qué dice eso de él?', [
    { t: 'Que no ha pasado por el escrutinio público, y que su seguridad se apoya en que nadie lo haya mirado: es una mala señal', ok: true, por: 'Los cifrados en los que se confía son los que llevan años publicados y atacados sin éxito. Un método secreto tiene, como mucho, la garantía de su autor.' },
    { t: 'Que es más seguro, porque el atacante tiene que descubrir el método antes de atacar la clave', ok: false, por: 'Descubrir el método es cuestión de tiempo: se filtra, se compra, se desmonta el aparato. Kerckhoffs pide que eso no importe.' },
    { t: 'Nada: la seguridad solo depende de la longitud de la clave', ok: false, por: 'Una clave larga en un método débil no protege nada. La longitud de la clave cuenta solo si el método no tiene atajos, y eso solo se sabe cuando muchos lo han buscado.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Contar claves');

  p.text('Si el método es público, el ataque más simple es probar todas las claves: la <strong>fuerza ' +
    'bruta</strong>. Su coste se mide con una sola pregunta: ¿cuántas claves hay? A ese número se le ' +
    'llama el <strong>espacio de claves</strong>, y contarlo es [[pe-combinatoria|combinatoria]] pura.');

  p.formula('T \\approx \\frac{|K|}{2\\,v}', 'el tiempo de la fuerza bruta',
    'Se lee: <em>«te es aproximadamente el número de claves partido por dos veces uve»</em>. $|K|$ es ' +
    'cuántas claves hay y $v$ cuántas se prueban por segundo. El 2 está porque, de media, la clave ' +
    'buena aparece a mitad de camino.<br><br>Lo que importa no son los segundos exactos, sino el ' +
    'orden de magnitud: si sale un minuto, el sistema no vale; si sale más que la edad del universo, ' +
    'la fuerza bruta no es el problema.');

  p.table(['Sistema', 'Claves', 'Con $10^9$ pruebas por segundo'], [
    ['PIN de 4 cifras', '$10^4$', 'una millonésima de segundo'],
    ['César (desplazar el alfabeto)', '$25$', 'nada'],
    ['Sustitución de 26 letras', '$26! \\approx 4\\cdot 10^{26}$', 'unos $6\\cdot 10^9$ años'],
    ['Clave de 56 bits (DES)', '$2^{56} \\approx 7\\cdot 10^{16}$', 'poco más de un año'],
    ['Clave de 128 bits (AES)', '$2^{128} \\approx 3\\cdot 10^{38}$', '$5\\cdot 10^{21}$ años']
  ]);

  p.text('La tabla enseña algo que va a repetirse en todo el bloque: <strong>contar claves no es lo ' +
    'mismo que ser seguro</strong>. La sustitución tiene más claves que un DES y se rompe en una tarde ' +
    'con lápiz y papel, como verás dos temas más adelante. El espacio de claves es una condición ' +
    'necesaria: si es pequeño, el sistema cae seguro; si es grande, todavía hay que ver si tiene ' +
    'atajos.');

  p.demo({
    title: 'Cuánto tarda la fuerza bruta',
    intro: 'La clave tiene tantos bits como marca el mando, así que hay $2^{\\text{bits}}$ claves. El otro mando es la velocidad del atacante: un portátil prueba millones por segundo; una granja de tarjetas gráficas, billones.',
    predice: 'Con 40 bits y mil millones de pruebas por segundo la fuerza bruta tarda unos minutos. ¿Cuántos bits más hacen falta para que tarde mil veces más: 3, 10 o 1000?',
    build: function (host) {
      var bits = 40, vel = 9;
      var out = W.readout(host, '');
      function tiempo(seg) {
        if (seg < 1e-3) return 'menos de una milésima de segundo';
        if (seg < 1) return U.fmt(seg * 1000, 1) + ' milisegundos';
        if (seg < 60) return U.fmt(seg, 1) + ' segundos';
        if (seg < 3600) return U.fmt(seg / 60, 1) + ' minutos';
        if (seg < 86400) return U.fmt(seg / 3600, 1) + ' horas';
        var a = seg / 31557600;
        if (a < 1000) return U.fmt(a, 1) + ' años';
        if (a < 1.4e10) return U.fmt(a / 1e6, 2) + ' millones de años';
        return U.fmt(a / 1.38e10, 1) + ' veces la edad del universo';
      }
      function pinta() {
        var claves = Math.pow(2, bits), v = Math.pow(10, vel), seg = claves / (2 * v);
        out.set('$2^{' + bits + '} \\approx ' + claves.toExponential(1).replace('e+', '\\cdot 10^{') + '}$ claves, a $10^{' + vel + '}$ por segundo.<br>' +
          'Tiempo medio hasta dar con la buena: <strong>' + tiempo(seg) + '</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Cada bit de más duplica el tiempo; cada 10 bits lo multiplican por 1024. Ir mil veces más deprisa solo descuenta unos 10 bits.</span>');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'bits de la clave', min: 8, max: 256, step: 1, value: bits, on: function (v) { bits = v; pinta(); } });
      W.slider(fila, { label: 'pruebas por segundo, $10^{n}$', min: 3, max: 15, step: 1, value: vel, on: function (v) { vel = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Un candado y una tarjeta',
    enunciado: 'Un candado de bicicleta tiene cuatro ruedas con las cifras del 0 al 9. Una tarjeta tiene un PIN de 4 cifras y se bloquea al tercer fallo. ¿Cuántas combinaciones tiene cada uno, cuánto tarda un ladrón que prueba una combinación cada 2 segundos en abrir el candado, y qué probabilidad tiene de acertar el PIN?',
    pasos: [
      { t: '<strong>El espacio de claves.</strong> Cuatro ruedas independientes con 10 posiciones cada una: $10\\cdot 10\\cdot 10\\cdot 10 = 10^4 = 10\\,000$ combinaciones. El PIN, igual: $10^4$.', antes: '¿Cuántas combinaciones da cada rueda, y cómo se combinan las cuatro?' },
      { t: '<strong>El candado.</strong> De media, la combinación buena aparece a mitad de camino: $5000$ pruebas a 2 segundos son $10\\,000$ segundos, unas 2 horas y 47 minutos. Con paciencia, se abre.', antes: 'Si prueba en orden, ¿cuántas combinaciones prueba de media antes de acertar?' },
      { t: '<strong>El PIN.</strong> Mismo espacio de claves, pero solo tres intentos: la probabilidad de acertar es $3/10\\,000 = 0{,}0003$. El mismo número de claves protege mucho o nada según cuántas veces se pueda probar.' },
      { t: '<strong>La lección.</strong> Un espacio de claves se defiende de dos maneras: haciéndolo enorme, o limitando los intentos. Los cifrados no pueden limitar los intentos, porque Eva prueba en su propio ordenador; por eso necesitan claves de $2^{128}$ y no de $10^4$.' }
    ],
    cierre: 'Contar es la primera pregunta que hay que hacerle a cualquier sistema. Si el número sale pequeño, no hace falta seguir mirando.'
  });

  p.util('Este vocabulario aparece en el manual de cualquier aparato que uses. El candado de una página ' +
    'web es un cifrado; el código de barras y el QR son codificaciones, y no protegen nada; la marca ' +
    'de agua invisible de un billete es esteganografía. Y cuando una aplicación te pide una contraseña ' +
    '«de al menos 12 caracteres», está pidiendo que el espacio de claves sea grande: con letras, cifras ' +
    'y signos hay unos 95 símbolos por posición, y $95^{12}$ es un número de 24 cifras. Con 6 ' +
    'caracteres, $95^6$ es de 12, y una tarjeta gráfica lo recorre en una tarde.');

  p.hist('Heródoto cuenta que Histieo tatuó un mensaje en la cabeza afeitada de un esclavo, esperó a que ' +
    'le creciera el pelo y lo envió: esteganografía del siglo V a. C. Auguste Kerckhoffs, un lingüista ' +
    'holandés afincado en París, publicó en 1883 <em>La cryptographie militaire</em> con seis ' +
    'requisitos para un cifrado; el segundo, que el sistema no exija secreto y pueda caer en manos ' +
    'del enemigo sin daño, es el que lleva su nombre. Claude Shannon fundó en 1949 la teoría matemática ' +
    'de los cifrados con un artículo que había sido secreto durante la guerra.');

  p.trampas([
    { e: 'Confundir «ilegible» con «cifrado»', por: 'Un texto en base 64 parece un galimatías y cualquiera lo decodifica en un segundo con una tabla pública. Sin clave no hay cifrado.' },
    { e: 'Fiarse de un método secreto', por: 'Los rotores de Enigma se consideraban un secreto militar: los polacos reconstruyeron su cableado en 1932 con matemáticas y un manual filtrado, sin ver una máquina.' },
    { e: 'Creer que más claves es siempre más seguro', por: 'La sustitución tiene $26!$ claves, más que un DES de 56 bits, y se rompe con lápiz y papel contando letras. El espacio de claves es necesario, no suficiente.' },
    { e: 'Olvidar que Eva prueba en su casa', por: 'Un PIN aguanta con 10 000 claves porque el cajero bloquea al tercer fallo. Un archivo cifrado no bloquea nada: Eva prueba las 10 000 en un milisegundo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var ESCENAS = [
    { t: 'Un mensaje escrito en morse, con la tabla de puntos y rayas que viene en cualquier libro', v: 'cod' },
    { t: 'Una carta con las letras en un orden cambiado según una palabra que solo conocen el remitente y el destinatario', v: 'cif' },
    { t: 'Una foto en la que se han cambiado los últimos bits de algunos píxeles para guardar un texto', v: 'esc' },
    { t: 'Un número de cuenta escrito en base 16', v: 'cod' },
    { t: 'Un texto en el que cada letra se ha sustituido por otra según una tabla que se cambia cada semana y no se publica', v: 'cif' },
    { t: 'Una nota escrita con zumo de limón, que solo aparece al calentar el papel', v: 'esc' },
    { t: 'Un fichero comprimido en formato zip, sin contraseña', v: 'cod' },
    { t: 'El PIN de una tarjeta, transformado con una clave que solo tiene el banco', v: 'cif' }
  ];

  p.exercise({
    title: '¿Codificar, cifrar o esconder?',
    level: 'basico',
    gen: function (r) { return { e: r.pick(ESCENAS) }; },
    ask: function (d) { return d.e.t + '. ¿Qué es?'; },
    fields: [{ name: 'q', label: 'Es', opts: [{ t: 'codificar', v: 'cod' }, { t: 'cifrar', v: 'cif' }, { t: 'esconder', v: 'esc' }] }],
    sol: function (d) { return { q: d.e.v }; },
    hint: function () { return ['¿Hace falta un dato secreto para leerlo? Entonces es cifrar.', '¿Se ve que hay un mensaje? Si no, es esconder. Si se ve y se lee con una tabla pública, es codificar.']; },
    steps: function (d) {
      var por = { cod: 'La tabla es pública: cualquiera que la conozca lo lee. Cambia la forma, no protege.', cif: 'Hace falta un dato secreto, la clave, para recuperar el mensaje: es un cifrado.', esc: 'Lo que se oculta es la existencia del mensaje: es esteganografía, y aguanta mientras nadie sospeche.' };
      return [por[d.e.v], 'Es <strong>' + { cod: 'codificar', cif: 'cifrar', esc: 'esconder' }[d.e.v] + '</strong>.'];
    },
    answer: function (d) { return { cod: 'codificar', cif: 'cifrar', esc: 'esconder' }[d.e.v]; }
  });

  p.exercise({
    title: 'Cuántas claves',
    level: 'basico',
    gen: function (r) {
      var tipo = r.int(0, 2);
      if (tipo === 0) { var n = r.int(3, 6), b = r.pick([6, 8, 10, 12]); return { tipo: 0, n: n, b: b, v: Math.pow(b, n) }; }
      if (tipo === 1) { var L = r.int(2, 5); return { tipo: 1, L: L, v: Math.pow(26, L) }; }
      var bits = r.int(4, 20); return { tipo: 2, bits: bits, v: Math.pow(2, bits) };
    },
    ask: function (d) {
      if (d.tipo === 0) return 'Un candado tiene ' + d.n + ' ruedas y cada una puede marcar ' + d.b + ' símbolos distintos. ¿Cuántas combinaciones tiene?';
      if (d.tipo === 1) return 'La clave de un cifrado es una palabra de ' + d.L + ' letras, cualesquiera de las 26, que no tiene por qué existir en el diccionario. ¿Cuántas claves hay?';
      return 'Una clave tiene ' + d.bits + ' bits. ¿Cuántas claves distintas hay?';
    },
    fields: [{ name: 'v', label: 'claves', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [
      { si: function (v, d) { return d.tipo === 0 && v.v === d.n * d.b; }, msg: 'Las ruedas no se suman: cada combinación de la primera se combina con cada una de la segunda. Se multiplican.' },
      { si: function (v, d) { return d.tipo === 2 && v.v === 2 * d.bits; }, msg: 'Cada bit duplica las posibilidades: son $2^{\\text{bits}}$, no $2\\cdot\\text{bits}$.' }
    ],
    hint: function () { return 'Posiciones independientes: se multiplica el número de opciones de cada una.'; },
    steps: function (d) {
      if (d.tipo === 0) return ['Cada rueda tiene ' + d.b + ' opciones y hay ' + d.n + ' ruedas independientes.', '$' + d.b + '^{' + d.n + '} = ' + U.miles(d.v) + '$ combinaciones.'];
      if (d.tipo === 1) return ['Cada una de las ' + d.L + ' posiciones admite 26 letras.', '$26^{' + d.L + '} = ' + U.miles(d.v) + '$ claves.'];
      return ['Cada bit puede ser 0 o 1, y hay ' + d.bits + '.', '$2^{' + d.bits + '} = ' + U.miles(d.v) + '$ claves.'];
    },
    answer: function (d) { return U.miles(d.v); }
  });

  p.exercise({
    title: 'El tiempo de la fuerza bruta',
    level: 'medio',
    gen: function (r) {
      var bits = r.pick([20, 24, 28, 32, 36, 40]), vel = r.pick([1e6, 1e7, 1e8, 1e9]);
      var seg = Math.pow(2, bits) / (2 * vel);
      return { bits: bits, vel: vel, seg: seg, exp: Math.round(Math.log(vel) / Math.LN10), sinMitad: Math.pow(2, bits) / vel };
    },
    ask: function (d) {
      return 'Una clave tiene ' + d.bits + ' bits y el atacante prueba $10^{' + d.exp + '}$ claves por segundo. ¿Cuántos segundos tarda, de media, en dar con la clave? (con dos decimales)';
    },
    fields: [{ name: 's', label: 'segundos', w: 'tiny' }],
    sol: function (d) { return { s: d.seg }; },
    dec: 2, tol: 2e-3,
    errores: [{ si: function (v, d) { return Math.abs(v.s - d.sinMitad) < 0.01 * d.sinMitad && Math.abs(v.s - d.seg) > 0.01 * d.seg; }, msg: 'Eso es lo que tarda en probarlas todas. De media, la buena aparece a mitad de camino: se divide entre 2.' }],
    hint: function () { return ['Hay $2^{\\text{bits}}$ claves.', 'Tiempo medio: la mitad de las claves, entre la velocidad.']; },
    steps: function (d) {
      return ['$2^{' + d.bits + '} = ' + U.miles(Math.pow(2, d.bits)) + '$ claves.',
        'De media se prueba la mitad: $' + U.miles(Math.pow(2, d.bits) / 2) + '$.',
        'Entre $10^{' + d.exp + '}$ por segundo: $' + U.fmt(d.seg, 2) + '$ segundos' + (d.seg > 3600 ? ', unas ' + U.fmt(d.seg / 3600, 1) + ' horas.' : '.'),
        'Con ' + d.bits + ' bits la fuerza bruta es cuestión de ' + (d.seg < 60 ? 'segundos' : (d.seg < 86400 ? 'horas' : 'días')) + '. Por eso las claves modernas tienen 128 o más.'];
    },
    answer: function (d) { return U.fmt(d.seg, 2) + ' s'; }
  });

  p.exercise({
    title: 'Contraseñas: alfabeto y longitud',
    level: 'medio',
    gen: function (r) {
      var casos = [{ n: 'solo cifras', a: 10 }, { n: 'letras minúsculas', a: 26 }, { n: 'minúsculas y cifras', a: 36 }, { n: 'mayúsculas, minúsculas y cifras', a: 62 }, { n: 'cualquier símbolo del teclado', a: 95 }];
      var c = r.pick(casos), L = r.int(4, 10), c2 = r.pick(casos);
      if (c2.a === c.a) return null;
      var L2 = r.int(4, 10);
      var v1 = Math.pow(c.a, L), v2 = Math.pow(c2.a, L2);
      if (Math.abs(Math.log(v1) - Math.log(v2)) < 0.3) return null;
      return { c: c, L: L, c2: c2, L2: L2, v1: v1, v2: v2, mejor: v1 > v2 ? 'A' : 'B' };
    },
    ask: function (d) {
      return 'Contraseña A: ' + d.L + ' caracteres, ' + d.c.n + ' (' + d.c.a + ' símbolos posibles). Contraseña B: ' + d.L2 + ' caracteres, ' + d.c2.n + ' (' + d.c2.a + ' símbolos). ¿Cuántas contraseñas posibles tiene A, y cuál de las dos tiene el espacio de claves más grande?';
    },
    fields: [{ name: 'v', label: 'posibles de A', w: 'wide' }, { name: 'm', label: 'mayor espacio', opts: [{ t: 'A', v: 'A' }, { t: 'B', v: 'B' }] }],
    sol: function (d) { return { v: d.v1, m: d.mejor }; },
    rel: { v: 1e-6 },
    hint: function () { return ['Símbolos elevado a la longitud.', 'Compara los dos números: la longitud pesa más que el alfabeto, porque va en el exponente.']; },
    steps: function (d) {
      return ['A: $' + d.c.a + '^{' + d.L + '} \\approx ' + d.v1.toExponential(2).replace('e+', '\\cdot 10^{') + '}$.',
        'B: $' + d.c2.a + '^{' + d.L2 + '} \\approx ' + d.v2.toExponential(2).replace('e+', '\\cdot 10^{') + '}$.',
        'Tiene más claves la <strong>' + d.mejor + '</strong>. Fíjate en que añadir un carácter multiplica por el tamaño del alfabeto: la longitud manda.'];
    },
    answer: function (d) { return d.v1.toExponential(2) + ' · ' + d.mejor; }
  });

  p.exercise({
    title: 'Cuántos bits hacen falta',
    level: 'avanzado',
    gen: function (r) {
      var anos = r.pick([1, 10, 100, 1000, 1e6]), vel = r.pick([1e9, 1e12, 1e15]);
      var seg = anos * 31557600, pruebas = 2 * vel * seg, bits = Math.ceil(Math.log(pruebas) / Math.LN2);
      return { anos: anos, vel: vel, exp: Math.round(Math.log(vel) / Math.LN10), pruebas: pruebas, bits: bits, sinMitad: Math.ceil(Math.log(vel * seg) / Math.LN2) };
    },
    ask: function (d) {
      return 'Se quiere que una clave resista, de media, ' + U.miles(d.anos) + ' ' + U.plural(d.anos, 'año', 'años') + ' de fuerza bruta contra un atacante que prueba $10^{' + d.exp + '}$ claves por segundo (un año son $3{,}156\\cdot 10^7$ segundos). ¿Cuántos bits necesita como mínimo?';
    },
    fields: [{ name: 'b', label: 'bits', w: 'tiny' }],
    sol: function (d) { return { b: d.bits }; },
    errores: [{ si: function (v, d) { return d.sinMitad !== d.bits && v.b === d.sinMitad; }, msg: 'Casi: la fuerza bruta acierta de media a mitad de camino, así que el espacio de claves tiene que ser el doble de las pruebas que puede hacer.' }],
    hint: function () { return ['Pruebas que hará el atacante: velocidad por segundos. El espacio de claves tiene que ser el doble, porque de media acierta a la mitad.', 'Bits: el logaritmo en base 2 de ese número, redondeado hacia arriba.']; },
    steps: function (d) {
      return ['Pruebas en ese tiempo: $10^{' + d.exp + '}\\cdot ' + U.miles(d.anos) + '\\cdot 3{,}156\\cdot 10^{7} \\approx ' + (d.pruebas / 2).toExponential(2).replace('e+', '\\cdot 10^{') + '}$.',
        'El espacio de claves debe ser el doble: $' + d.pruebas.toExponential(2).replace('e+', '\\cdot 10^{') + '}$.',
        '$\\log_2$ de eso es $' + U.fmt(Math.log(d.pruebas) / Math.LN2, 2) + '$: hacen falta <strong>' + d.bits + '</strong> bits.',
        'Cada 10 bits multiplican el tiempo por 1024: por eso pasar de un atacante mil veces más rápido a otro solo cuesta unos 10 bits más.'];
    },
    answer: function (d) { return d.bits + ' bits'; }
  });

  p.keys([
    '<strong>Codificar</strong> cambia la forma con una tabla pública; <strong>esconder</strong> oculta que hay mensaje; <strong>cifrar</strong> exige una clave para leer.',
    'Cifrar con una clave tiene que ser una aplicación biyectiva: $D_k(E_k(m)) = m$.',
    '<strong>Kerckhoffs</strong>: el sistema debe seguir siendo seguro aunque todo, menos la clave, sea público.',
    'El <strong>espacio de claves</strong> se cuenta con combinatoria, y la fuerza bruta tarda $|K| / (2v)$.',
    'Un espacio de claves grande es necesario, no suficiente: la sustitución tiene $26!$ claves y se rompe contando letras.'
  ]);
});
