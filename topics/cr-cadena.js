/* Tema: Cadenas de bloques y arboles de Merkle */
Course.topic('cr-cadena', function (p) {

  p.puente('Una [[cr-hash|huella]] identifica un documento; un [[cr-conocimiento-cero|compromiso]] fija ' +
    'una elección. Este tema encadena huellas para que el pasado no se pueda reescribir sin que se ' +
    'note, y las organiza en un árbol para demostrar que un dato está entre un millón con veinte ' +
    'hashes. Son dos estructuras de datos, y valen mucho más allá de las monedas.');

  p.text('La palabra «cadena de bloques» arrastra tanto ruido que conviene reducirla a lo que es: una ' +
    'lista en la que cada elemento lleva el hash del anterior. Nada más. Esa idea, de 1991, sirve ' +
    'para que un registro de cualquier cosa, transacciones, certificados, versiones de un archivo, ' +
    'no se pueda alterar hacia atrás sin dejar rastro. Lo que las monedas añaden encima es un ' +
    'mecanismo para decidir quién escribe el siguiente elemento, y ahí entra la prueba de trabajo.');

  /* ---------------------------------------------------------------- */
  p.section('Encadenar huellas');

  p.formula('h_i = H\\bigl(h_{i-1} \\,\\Vert\\, \\text{datos}_i\\bigr)', 'una cadena de hashes',
    'Se lee: <em>«el hash del bloque i es el hash del hash anterior concatenado con sus datos»</em>. ' +
    'Cambiar los datos de un bloque cambia su hash, y con él el del siguiente, y el del siguiente: ' +
    'para alterar el bloque 3 de 1000 hay que rehacer los 998 posteriores, y el último hash, que ' +
    'todo el mundo tiene apuntado, ya no coincide.<br><br>La cadena no impide alterar: <strong>delata</strong>. ' +
    'Es evidencia de alteración, no protección. Lo que impide reescribir es que rehacer los ' +
    'bloques cueste algo, o que muchos tengan copias.');

  p.demo({
    title: 'Una cadena de cinco bloques',
    intro: 'Cada bloque guarda unos datos y el hash del bloque anterior. Edita los datos del bloque que quieras: su hash cambia, y todos los siguientes dejan de encajar con lo que guardaban.',
    predice: 'Si se cambia el bloque 2, ¿qué bloques quedan inválidos: solo el 2, del 2 en adelante, o todos?',
    build: function (host) {
      var datos = ['Alicia paga 5 a Benito', 'Benito paga 2 a Carla', 'Carla paga 1 a Alicia', 'Alicia paga 3 a Dani', 'Dani paga 4 a Benito'];
      var hashes = [];
      var out = W.mono(host, '');
      function recalcula() { var prev = '0000000000000000'; hashes = datos.map(function (d) { var h = CR.sha256(prev + '|' + d).slice(0, 16); prev = h; return h; }); }
      recalcula();
      var guardados = hashes.slice();
      function pinta() {
        var h = '', prev = '0000000000000000', roto = false;
        datos.forEach(function (d, i) {
          var hi = CR.sha256(prev + '|' + d).slice(0, 16);
          var ok = hi === guardados[i] && !roto;
          if (!ok) roto = true;
          h += '<b>bloque ' + (i + 1) + '</b>  anterior: ' + prev + '\n  datos: ' + U.escape(d) + '\n  hash:  ' + hi + '  ' + (ok ? '<span class="cr-ok">coincide con el apuntado</span>' : '<span class="cr-dif">no es el hash apuntado ' + guardados[i] + '</span>') + '\n\n';
          prev = hi;
        });
        h += roto ? '<span class="cr-dif">La cadena no cuadra desde el primer bloque alterado. Para ocultarlo habría que rehacer todos los siguientes y cambiar el hash final que todos guardan.</span>' : '<span class="cr-ok">Cadena íntegra: cada hash es el que se apuntó.</span>';
        out.set(h);
      }
      var campos = datos.map(function (d, i) { return W.texto(host, { label: 'datos del bloque ' + (i + 1), value: d, max: 40, on: function (v) { datos[i] = v; pinta(); } }); });
      W.buttons(host, [{ t: 'Volver a apuntar los hashes actuales', on: function () { recalcula(); guardados = hashes.slice(); pinta(); } }]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La prueba de trabajo');

  p.text('Si cualquiera puede rehacer los bloques, la cadena solo delata a quien no se moleste. La idea ' +
    'de Bitcoin es que añadir un bloque cueste: el bloque tiene que llevar un número, el ' +
    '<em>nonce</em>, tal que su hash empiece por $d$ ceros. Como el hash es impredecible, la única ' +
    'forma de encontrarlo es probar nonces, y de media hacen falta $2^d$. Reescribir el pasado ' +
    'exige rehacer ese trabajo para cada bloque posterior, más deprisa que todos los demás juntos ' +
    'añaden bloques nuevos.');

  p.formula('H(\\text{bloque} \\,\\Vert\\, \\text{nonce}) < 2^{256 - d}, \\qquad \\mathbb{E}[\\text{intentos}] = 2^{d}',
    'prueba de trabajo con dificultad d',
    'Se lee: <em>«el hash del bloque con el nonce tiene que ser menor que dos elevado a doscientos ' +
    'cincuenta y seis menos de»</em>: empezar por $d$ ceros. Cada intento acierta con probabilidad ' +
    '$2^{-d}$, así que los intentos siguen una distribución geométrica de media $2^d$.<br><br>' +
    'Comprobarlo cuesta un solo hash: el trabajo es caro de hacer y barato de verificar. La ' +
    'dificultad se ajusta cada cierto tiempo para que el ritmo de bloques se mantenga aunque cambie ' +
    'la potencia total.');

  p.demo({
    title: 'Minar un bloque',
    intro: 'Tu navegador busca un nonce cuyo SHA-256 empiece por $d$ bits a cero. Mira los intentos que ha necesitado y compáralos con $2^d$; repite varias veces, porque la suerte manda en cada intento.',
    predice: 'Con $d = 16$, ¿cuántos intentos harán falta de media: unos 16, unos 65 000 o unos $10^{9}$?',
    build: function (host) {
      var d = 12, datos = 'bloque 42 | Alicia paga 5 a Benito', r = U.rng(3);
      var out = W.mono(host, ''), historial = [];
      function mina() {
        var t0 = performance.now(), nonce = r.int(0, 1e9), n = 0, h;
        while (true) {
          h = CR.sha256Bytes(datos + '|' + nonce); n++;
          var ceros = 0;
          for (var i = 0; i < 32 && ceros < d; i++) { var b = h[i]; for (var k = 7; k >= 0 && ceros < d; k--) { if (b & (1 << k)) { i = 99; break; } ceros++; } }
          if (ceros >= d) break;
          nonce++;
          if (n > 3000000) break;
        }
        var ms = performance.now() - t0;
        historial.push(n);
        var media = historial.reduce(function (a, b) { return a + b; }, 0) / historial.length;
        out.set('<b>dificultad:</b> ' + d + ' bits a cero (2^' + d + ' = ' + U.miles(Math.pow(2, d)) + ' intentos esperados)\n<b>nonce encontrado:</b> ' + nonce + '\n<b>hash:</b> ' + CR.hex(h).slice(0, 32) + '…  ' + CR.bitsHtml(CR.bits(h[0], 8) + CR.bits(h[1], 8) + CR.bits(h[2], 8)) + '…\n<b>intentos:</b> ' + U.miles(n) + ' en ' + U.fmt(ms, 0) + ' ms  (' + U.miles(Math.round(n / Math.max(ms, 1) * 1000)) + ' hashes/s)\n\n' + historial.length + ' bloques minados, media de ' + U.miles(Math.round(media)) + ' intentos\n<span class="cr-tenue">Bitcoin exige unos 78 bits a cero: 10^23 intentos por bloque, cada diez minutos, con máquinas dedicadas.</span>');
      }
      W.texto(host, { label: 'datos del bloque', value: datos, max: 60, on: function (v) { datos = v; historial = []; } });
      W.slider(W.row(host), { label: 'dificultad d (bits a cero)', min: 4, max: 20, step: 1, value: d, on: function (v) { d = v; historial = []; } });
      W.buttons(host, [{ t: 'Minar', cls: 'btn--main', on: mina }]);
      mina();
    }
  });

  p.comprueba('La potencia total de los mineros de una cadena se duplica. Para que los bloques sigan saliendo cada diez minutos, ¿qué hay que hacer con la dificultad?', [
    { t: 'Subirla un bit: $2^{d+1}$ intentos esperados, el doble', ok: true, por: 'Cada bit de dificultad duplica los intentos esperados. Con el doble de potencia y el doble de intentos, el tiempo se mantiene. Bitcoin lo ajusta cada 2016 bloques.' },
    { t: 'Duplicar $d$', ok: false, por: 'Duplicar $d$ elevaría al cuadrado los intentos: con $d = 78$, pasar a 156 haría que un bloque tardara más que la edad del universo.' },
    { t: 'Nada: la dificultad es fija', ok: false, por: 'Si fuera fija, más potencia daría bloques más rápidos y la cadena crecería sin control. El ajuste es parte del diseño.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Árboles de Merkle');

  p.text('Un bloque puede llevar miles de transacciones. Para no hashear todo cada vez que alguien ' +
    'quiere comprobar una, se organizan en un <strong>árbol</strong>: se hashean las transacciones, ' +
    'los hashes se emparejan y se hashea cada pareja, y así hasta llegar a una sola raíz. La raíz ' +
    'resume todo. Y para demostrar que una transacción está en el árbol basta con dar los hashes ' +
    'de los «hermanos» en el camino hasta la raíz: $\\log_2 n$ hashes, no $n$.');

  p.formula('\\text{prueba de pertenencia: } \\lceil\\log_2 n\\rceil \\text{ hashes}, \\qquad 10^6 \\text{ hojas} \\Rightarrow 20 \\text{ hashes}',
    'el tamaño de una prueba de Merkle',
    'Con un millón de transacciones, veinte hashes de 32 bytes, 640 bytes, demuestran que una de ellas ' +
    'está en el bloque cuya raíz todos conocen. Quien verifica no necesita el bloque entero.');

  p.demo({
    title: 'Un árbol de ocho hojas y una prueba',
    intro: 'Ocho datos, sus hashes, las parejas y la raíz. Elige una hoja: la prueba son los tres hashes marcados, los hermanos en el camino hacia arriba. Con la hoja y esos tres hashes se recalcula la raíz, y si coincide, la hoja estaba en el árbol.',
    predice: 'Para demostrar que una hoja está entre 8, ¿cuántos hashes hacen falta: 3, 7 u 8? ¿Y entre 1024?',
    build: function (host) {
      var hojas = ['tx1', 'tx2', 'tx3', 'tx4', 'tx5', 'tx6', 'tx7', 'tx8'], sel = 2;
      var out = W.mono(host, '');
      function H(s) { return CR.sha256(s).slice(0, 8); }
      function pinta() {
        var n0 = hojas.map(H), n1 = [], n2 = [], i;
        for (i = 0; i < 8; i += 2) n1.push(H(n0[i] + n0[i + 1]));
        for (i = 0; i < 4; i += 2) n2.push(H(n1[i] + n1[i + 1]));
        var raiz = H(n2[0] + n2[1]);
        var prueba = [], idx = sel, niveles = [n0, n1, n2], camino = [];
        for (var l = 0; l < 3; l++) { var hermano = idx ^ 1; prueba.push({ nivel: l, idx: hermano, h: niveles[l][hermano], lado: hermano < idx ? 'izq' : 'dcha' }); camino.push(idx); idx >>= 1; }
        function marca(l, i) { return prueba.some(function (pz) { return pz.nivel === l && pz.idx === i; }) ? '<span class="cr-dif">' + niveles[l][i] + '</span>' : (camino[l] === i ? '<b>' + niveles[l][i] + '</b>' : '<span class="cr-tenue">' + niveles[l][i] + '</span>'); }
        var h = '<b>raíz:</b>     ' + raiz + '\n<b>nivel 2:</b>  ' + [0, 1].map(function (i) { return marca(2, i); }).join('   ') + '\n<b>nivel 1:</b>  ' + [0, 1, 2, 3].map(function (i) { return marca(1, i); }).join('   ') + '\n<b>hojas:</b>    ' + n0.map(function (x, i) { return marca(0, i); }).join(' ') + '\n           ' + hojas.map(function (x) { return (x + '        ').slice(0, 9); }).join('') + '\n\n';
        h += '<b>prueba de que «' + hojas[sel] + '» está en el árbol:</b> ' + prueba.map(function (pz) { return pz.h + ' (' + pz.lado + ')'; }).join(', ') + '\n';
        var acc = n0[sel];
        prueba.forEach(function (pz) { acc = pz.lado === 'izq' ? H(pz.h + acc) : H(acc + pz.h); });
        h += '<b>recalculando desde la hoja:</b> ' + acc + (acc === raiz ? '  <span class="cr-ok">= la raíz</span>' : '');
        out.set(h);
      }
      W.chips(host, hojas.map(function (x, i) { return { label: x, value: i }; }), { value: sel, on: function (v) { sel = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Cuánto cuesta minar y cuánto cuesta probar',
    enunciado: 'Una cadena exige 20 bits a cero y un ordenador hace $10^6$ hashes por segundo. ¿Cuánto tarda de media en minar un bloque? Si un bloque tiene 4096 transacciones, ¿de cuántos hashes es la prueba de que una está incluida, y cuánto ocupa?',
    pasos: [
      { t: '<strong>Intentos esperados.</strong> $2^{20} = 1\\,048\\,576$. A $10^6$ por segundo, algo más de un segundo de media, con mucha variación: unas veces sale al primer intento y otras tarda cinco segundos.', antes: '¿Cuántos intentos esperados con 20 bits?' },
      { t: '<strong>Verificar.</strong> Un solo hash: quien recibe el bloque comprueba en un microsegundo lo que costó un segundo producir. Con los 78 bits de Bitcoin, un segundo frente a $10^{23}$ intentos.', antes: '¿Cuánto cuesta comprobar que el nonce es válido?' },
      { t: '<strong>La prueba de Merkle.</strong> $4096 = 2^{12}$: doce niveles, doce hashes hermanos. A 32 bytes cada uno, 384 bytes, frente a los cientos de kilobytes del bloque entero.', antes: '$\\log_2 4096$: ¿cuántos hashes?' },
      { t: '<strong>Lo que enseña.</strong> Las dos ideas son asimétricas a propósito: minar cuesta y verificar no; el bloque es grande y la prueba es pequeña. Esa asimetría es lo que permite que un móvil compruebe sin confiar en nadie.' }
    ],
    cierre: 'Un hash, una lista y un árbol. Todo el resto de una criptomoneda es economía y consenso; la criptografía es esto.'
  });

  p.util('Git guarda cada versión de un proyecto como un árbol de Merkle y cada versión apunta al hash ' +
    'de la anterior: es una cadena de bloques desde 2005, y por eso dos copias se sincronizan ' +
    'comparando hashes. Los registros de transparencia de certificados son árboles de Merkle ' +
    'públicos con pruebas de pertenencia. Los sistemas de archivos distribuidos y las copias de ' +
    'seguridad detectan qué cambió comparando raíces. Y los sistemas de sellado de tiempo publican ' +
    'cada día una raíz en un periódico, que es exactamente lo que hacían Haber y Stornetta en 1991.');

  p.hist('Ralph Merkle patentó el árbol de hashes en 1979, para firmas basadas en hash. Stuart Haber y ' +
    'Scott Stornetta publicaron en 1991 la cadena de hashes para sellar documentos en el tiempo, y ' +
    'desde 1995 publican la raíz semanal en el <em>New York Times</em>. Adam Back propuso en 1997 la ' +
    'prueba de trabajo, Hashcash, contra el correo basura. Satoshi Nakamoto juntó las tres cosas en ' +
    '2008 en el artículo de Bitcoin, cuya bibliografía cita a Haber, Stornetta y Back.');

  p.trampas([
    { e: 'Creer que la cadena impide alterar los datos', por: 'Solo delata: alterar un bloque rompe los siguientes. Sin coste de rehacer, o sin copias en muchas manos, se rehace todo y nadie lo nota.' },
    { e: 'Tomar «dificultad doble» por «bits dobles»', por: 'Cada bit duplica los intentos. Doblar $d$ los eleva al cuadrado.' },
    { e: 'Enviar el bloque entero para probar una transacción', por: 'La prueba de Merkle son $\\log_2 n$ hashes: veinte para un millón. Es lo que permite verificar desde un móvil.' },
    { e: 'Pensar que una cadena necesita una moneda', por: 'Git, los registros de certificados y el sellado de tiempo son cadenas de hashes sin moneda ni minería. La prueba de trabajo solo hace falta cuando nadie manda.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Intentos esperados',
    level: 'basico',
    gen: function (r) { var d = r.int(8, 40); return { d: d, v: Math.pow(2, d) }; },
    ask: function (d) { return 'Una prueba de trabajo exige ' + d.d + ' bits a cero al principio del hash. ¿Cuántos intentos hacen falta de media?'; },
    fields: [{ name: 'v', label: 'intentos', w: 'wide' }],
    sol: function (d) { return { v: d.v }; },
    rel: 1e-9,
    hint: function () { return 'Cada intento acierta con probabilidad $2^{-d}$.'; },
    steps: function (d) { return ['$2^{' + d.d + '} = ' + U.miles(d.v) + '$ intentos de media.', 'Comprobar el resultado cuesta un solo hash.']; },
    answer: function (d) { return U.miles(d.v); }
  });

  p.exercise({
    title: 'Qué bloques se rompen',
    level: 'basico',
    gen: function (r) { var n = r.int(20, 500), k = r.int(2, n - 1); return { n: n, k: k, rotos: n - k + 1 }; },
    ask: function (d) { return 'Una cadena tiene ' + d.n + ' bloques y alguien altera los datos del bloque ' + d.k + '. ¿Cuántos bloques dejan de cuadrar con el hash apuntado en el siguiente (contando el alterado)? ¿Y cuántos hay que rehacer para que todo vuelva a cuadrar, si el hash del último bloque no lo conoce nadie más?'; },
    fields: [{ name: 'r', label: 'no cuadran', w: 'tiny' }, { name: 'h', label: 'hay que rehacer', w: 'tiny' }],
    sol: function (d) { return { r: d.rotos, h: d.rotos }; },
    hint: function () { return 'Del alterado hasta el último, ambos incluidos.'; },
    steps: function (d) { return ['Del bloque ' + d.k + ' al ' + d.n + ': $' + d.n + ' - ' + d.k + ' + 1 = ' + d.rotos + '$.', 'Rehacerlos cuesta ' + d.rotos + ' pruebas de trabajo; y si otros conocen el hash final, no hay nada que hacer.']; },
    answer: function (d) { return d.rotos + ' y ' + d.rotos; }
  });

  p.exercise({
    title: 'Tiempo de minado',
    level: 'medio',
    gen: function (r) { var d = r.int(20, 60), v = r.pick([1e6, 1e9, 1e12, 1e15]); var seg = Math.pow(2, d) / v; return { d: d, v: v, ev: Math.round(Math.log(v) / Math.LN10), seg: seg }; },
    ask: function (d) { return 'Dificultad de ' + d.d + ' bits y una máquina de $10^{' + d.ev + '}$ hashes por segundo. ¿Cuántos segundos tarda de media en minar un bloque? (notación científica o dos decimales)'; },
    fields: [{ name: 's', label: 'segundos', w: 'wide' }],
    sol: function (d) { return { s: d.seg }; },
    rel: 2e-3,
    hint: function () { return '$2^d$ intentos entre los hashes por segundo.'; },
    steps: function (d) { return ['$2^{' + d.d + '} \\approx ' + Math.pow(2, d.d).toExponential(2).replace('e+', '\\cdot 10^{') + '}$ intentos.', 'Entre $10^{' + d.ev + '}$: $' + (d.seg < 1000 ? U.fmt(d.seg, 2) : d.seg.toExponential(2).replace('e+', '\\cdot 10^{') + '}') + '$ segundos' + (d.seg > 3600 ? ', ' + U.fmt(d.seg / 3600, 1) + ' horas' : '') + '.']; },
    answer: function (d) { return d.seg.toExponential(2) + ' s'; }
  });

  p.exercise({
    title: 'El tamaño de una prueba de Merkle',
    level: 'medio',
    gen: function (r) { var n = r.pick([256, 1000, 4096, 10000, 65536, 1e6, 1e7]); var h = Math.ceil(Math.log(n) / Math.LN2); return { n: n, h: h, bytes: 32 * h }; },
    ask: function (d) { return 'Un bloque tiene ' + U.miles(d.n) + ' transacciones en un árbol de Merkle con SHA-256. ¿Cuántos hashes tiene la prueba de que una transacción concreta está incluida, y cuántos bytes ocupa?'; },
    fields: [{ name: 'h', label: 'hashes', w: 'tiny' }, { name: 'b', label: 'bytes', w: 'tiny' }],
    sol: function (d) { return { h: d.h, b: d.bytes }; },
    hint: function () { return '$\\lceil\\log_2 n\\rceil$ hashes de 32 bytes.'; },
    steps: function (d) { return ['$\\log_2 ' + U.miles(d.n) + ' = ' + U.fmt(Math.log(d.n) / Math.LN2, 2) + '$: ' + d.h + ' niveles, ' + d.h + ' hashes hermanos.', '$' + d.h + '\\cdot 32 = ' + d.bytes + '$ bytes, frente a los ' + U.miles(d.n * 250) + ' bytes que ocuparía el bloque entero a 250 bytes por transacción.']; },
    answer: function (d) { return d.h + ' hashes, ' + d.bytes + ' bytes'; }
  });

  p.exercise({
    title: 'Ajustar la dificultad',
    level: 'avanzado',
    gen: function (r) { var d = r.int(30, 80), f = r.pick([2, 4, 8, 16, 0.5, 0.25]); var nuevo = d + Math.log(f) / Math.LN2; return { d: d, f: f, nuevo: nuevo }; },
    ask: function (d) { return 'Una cadena ajusta la dificultad para mantener un bloque cada diez minutos. Con dificultad ' + d.d + ' bits, la potencia total de minado ' + (d.f >= 1 ? 'se multiplica por ' + d.f : 'se reduce a ' + (d.f === 0.5 ? 'la mitad' : 'la cuarta parte')) + '. ¿Qué dificultad hay que fijar?'; },
    fields: [{ name: 'n', label: 'bits', w: 'tiny' }],
    sol: function (d) { return { n: d.nuevo }; },
    hint: function () { return 'Los intentos esperados deben multiplicarse por el mismo factor que la potencia: $2^{d\'} = f\\cdot 2^{d}$, es decir, $d\' = d + \\log_2 f$.'; },
    steps: function (d) { return ['$\\log_2 ' + d.f + ' = ' + U.fmt(Math.log(d.f) / Math.LN2, 0) + '$.', '$d\' = ' + d.d + ' ' + (d.f >= 1 ? '+' : '-') + ' ' + Math.abs(Math.round(Math.log(d.f) / Math.LN2)) + ' = ' + d.nuevo + '$ bits.', 'En Bitcoin el ajuste es cada 2016 bloques, unas dos semanas, y la dificultad se expresa como un número real, pero la idea es esta: un bit por cada doblado.']; },
    answer: function (d) { return String(d.nuevo); }
  });

  p.keys([
    'Cadena de hashes: $h_i = H(h_{i-1} \\Vert \\text{datos}_i)$. Alterar un bloque rompe todos los siguientes: delata, no impide.',
    'Prueba de trabajo: un nonce que dé $d$ ceros cuesta $2^d$ intentos de media y un hash de verificar. Cada bit dobla el coste.',
    'Árbol de Merkle: hashes emparejados hasta una raíz; probar que una hoja está entre $n$ cuesta $\\lceil\\log_2 n\\rceil$ hashes.',
    'Git, la transparencia de certificados y el sellado de tiempo son cadenas y árboles de hashes sin moneda.',
    'La prueba de trabajo solo hace falta cuando nadie manda: es un mecanismo de consenso, no de integridad.'
  ]);
});
