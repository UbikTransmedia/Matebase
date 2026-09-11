/* Tema: Transposicion: desordenar en vez de sustituir */
Course.topic('cr-transposicion', function (p) {

  p.puente('Hasta aquí todos los cifrados cambiaban las letras por otras. Este las deja como están y ' +
    'cambia su orden, y la clave es una [[pe-combinatoria|permutación]]. Se distingue del ' +
    '[[cr-cesar|César]] y de la sustitución con la misma estadística que los rompe, y al juntarlo con ' +
    'ellos aparece la idea de la que salen los cifrados modernos.');

  p.text('Un anagrama es un cifrado: ROMA y AMOR tienen las mismas letras. Si en vez de barajar cuatro ' +
    'letras se barajan trescientas según una regla que solo conocen Alicia y Benito, el resultado ' +
    'parece una sopa de letras. Es la <strong>transposición</strong>, tan antigua como la ' +
    'sustitución, y con una propiedad que la delata: el cifrado tiene exactamente las mismas letras ' +
    'que el mensaje.');

  /* ---------------------------------------------------------------- */
  p.section('La escítala: escribir en filas, leer en columnas');

  p.text('Los espartanos enrollaban una tira de cuero en un bastón, escribían a lo largo y desenrollaban: ' +
    'la tira, sola, mostraba las letras salteadas. Quien tuviera un bastón del mismo grosor volvía ' +
    'a enrollarla y leía. El grosor del bastón es la clave, y en el papel se convierte en una ' +
    'rejilla: se escribe por filas y se lee por columnas.');

  p.demo({
    title: 'La rejilla',
    intro: 'El mensaje se escribe en filas de tantas letras como diga el mando, y el cifrado se lee bajando por las columnas. Cambia el ancho y mira cómo se recoloca todo.',
    predice: 'Con un mensaje de 20 letras y un ancho de 4, ¿cuántas filas hay? ¿Y qué letras del cifrado salen de la primera columna?',
    build: function (host) {
      var msg = 'NOS VEMOS EN EL PUENTE AL AMANECER', ancho = 5;
      var out = W.mono(host, '');
      function pinta() {
        var t = CR.limpia(msg), filas = Math.ceil(t.length / ancho), h = '<b>rejilla de ' + ancho + ' columnas:</b>\n';
        var relleno = t; while (relleno.length < filas * ancho) relleno += '<span class="cr-tenue">X</span>';
        var celdas = relleno.match(/(<span class="cr-tenue">X<\/span>|.)/g) || [];
        for (var f = 0; f < filas; f++) h += '  ' + celdas.slice(f * ancho, (f + 1) * ancho).join(' ') + '\n';
        var c = '';
        for (var col = 0; col < ancho; col++) for (var f2 = 0; f2 < filas; f2++) c += (t.charAt(f2 * ancho + col) || 'X');
        h += '\n<b>cifrado (leído por columnas):</b>\n' + c + '\n<span class="cr-tenue">' + t.length + ' letras, ' + filas + ' filas. Las mismas letras, en otro orden.</span>';
        out.set(h);
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 80, on: function (v) { msg = v; pinta(); } });
      W.slider(W.row(host), { label: 'ancho de la rejilla', min: 2, max: 10, step: 1, value: ancho, on: function (v) { ancho = v; pinta(); } });
      pinta();
    }
  });

  p.text('Esta versión tiene muy pocas claves: el ancho, un número entre 2 y unas decenas. Eva prueba ' +
    'todos los anchos y lee. Para tener claves de verdad hay que decidir además <strong>en qué ' +
    'orden</strong> se leen las columnas, y ahí entra una palabra clave.');

  /* ---------------------------------------------------------------- */
  p.section('Columnas con palabra clave');

  p.text('Se escribe la palabra clave encima de la rejilla, una letra por columna, y se leen las columnas ' +
    'en el orden alfabético de esas letras. Con la clave CLAVE, las columnas se leen en el orden A, ' +
    'C, E, L, V: la tercera primero, luego la primera, la quinta, la segunda y la cuarta. Una palabra ' +
    'de $n$ letras distintas es una forma de escribir una permutación de $n$ columnas, y hay $n!$.');

  p.formula('\\sigma = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 3 & 1 & 5 & 2 & 4 \\end{pmatrix}', 'la clave CLAVE como permutación',
    'Se lee: <em>«sigma manda el 1 al 3, el 2 al 1, el 3 al 5, el 4 al 2 y el 5 al 4»</em>: la primera ' +
    'columna que se lee es la tercera, la segunda que se lee es la primera, y así.<br><br>Descifrar ' +
    'es aplicar la permutación inversa: saber que el primer bloque del cifrado es la columna 3, el ' +
    'segundo la columna 1, y volver a colocarlos.');

  p.demo({
    title: 'Transposición por columnas',
    intro: 'Escribe la clave y mira los números que recibe cada columna: el orden alfabético de sus letras. El cifrado es la lectura de las columnas en ese orden. Si el mensaje no llena la rejilla, se completa con X.',
    predice: 'Con la clave AAAA, ¿en qué orden se leen las columnas? ¿Cuántas claves distintas de cuatro letras hay de verdad, si dos palabras con el mismo orden alfabético dan el mismo cifrado?',
    build: function (host) {
      var msg = 'NOS VEMOS EN EL PUENTE AL AMANECER', clave = 'CLAVE';
      var out = W.mono(host, '');
      function pinta() {
        var t = CR.limpia(msg), k = CR.limpia(clave);
        if (k.length < 2) { out.set('La clave necesita al menos dos letras.'); return; }
        var orden = CR.ordenClave(k), n = k.length, filas = Math.ceil(t.length / n), num = [];
        orden.forEach(function (col, i) { num[col] = i + 1; });
        var h = '<b>clave:  </b> ' + k.split('').join(' ') + '\n<b>orden:  </b> <span class="cr-tenue">' + num.join(' ') + '</span>\n';
        var relleno = t; while (relleno.length < filas * n) relleno += 'X';
        for (var f = 0; f < filas; f++) h += '         ' + relleno.slice(f * n, (f + 1) * n).split('').join(' ') + '\n';
        var c = CR.columnas(t, k), trozos = [];
        for (var i = 0; i < n; i++) trozos.push(c.slice(i * filas, (i + 1) * filas));
        h += '\n<b>cifrado:</b> ' + trozos.join(' ') + '\n<span class="cr-tenue">columnas leídas en el orden ' + orden.map(function (x) { return x + 1; }).join(', ') + '</span>';
        out.set(h);
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 80, on: function (v) { msg = v; pinta(); } });
      W.texto(host, { label: 'clave', value: clave, max: 10, corto: true, on: function (v) { clave = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Cifrar y descifrar con la clave RIO',
    enunciado: 'Cifrar el mensaje ATAQUE AL ALBA con transposición por columnas y la clave RIO. Después, descifrar el resultado.',
    pasos: [
      { t: '<strong>El orden.</strong> Las letras de RIO, por orden alfabético, son I, O, R: la columna de la I (la segunda) se lee primero, luego la de la O (la tercera) y por último la de la R (la primera). Orden de lectura: 2, 3, 1.', antes: '¿En qué orden alfabético quedan R, I, O?' },
      { t: '<strong>La rejilla.</strong> ATAQUEALALBA tiene 12 letras, que caben justas en 4 filas de 3: ATA / QUE / ALA / LBA.', antes: '¿Cuántas filas de 3 letras salen de 12 letras?' },
      { t: '<strong>Leer.</strong> Columna 2: T, U, L, B. Columna 3: A, E, A, A. Columna 1: A, Q, A, L. Cifrado: <strong>TULB AEAA AQAL</strong>.' },
      { t: '<strong>Descifrar.</strong> Benito sabe que hay 12 letras y 3 columnas: 4 filas. Parte el cifrado en tres trozos de 4 y sabe que el primero es la columna 2, el segundo la 3 y el tercero la 1. Rellena la rejilla por columnas y lee por filas: ATAQUEALALBA ✓.', antes: 'Benito recibe 12 letras y conoce la clave. ¿Qué tamaño tiene cada columna?' }
    ],
    cierre: 'Las cinco A del mensaje siguen siendo cinco A: la transposición no toca las frecuencias, y eso es lo primero que Eva comprueba.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Sustitución o transposición: la estadística lo dice');

  p.text('Si Eva intercepta un texto que parece un galimatías, lo primero que hace es contar. Una ' +
    'sustitución cambia las frecuencias de sitio: el chi cuadrado frente al castellano es enorme. ' +
    'Una transposición no las toca: el chi cuadrado es el de un texto normal, y el índice de ' +
    'coincidencia también. Un galimatías con las frecuencias del castellano es una transposición, ' +
    'y se ataca de otra manera: probando anchos y buscando pares de letras frecuentes, como QU, ' +
    'DE, EN, ES.');

  p.comprueba('Un texto cifrado tiene un 13 % de E, un 12 % de A y $\\chi^2$ pequeño frente al castellano, pero no se entiende nada. ¿Qué es?', [
    { t: 'Una transposición: las letras son las del castellano, en otro orden', ok: true, por: 'Las frecuencias intactas descartan la sustitución y el Vigenère. Solo un cifrado que mueve las letras sin cambiarlas deja el histograma igual.' },
    { t: 'Un Vigenère con clave corta', ok: false, por: 'Vigenère aplana las frecuencias: la E se reparte entre varias letras del cifrado. Un 13 % de E en el cifrado es incompatible.' },
    { t: 'Una sustitución en la que, por casualidad, la E va a la E', ok: false, por: 'Tendría que pasar con todas las letras a la vez. La probabilidad de que una permutación al azar conserve todas las frecuencias es una entre $26!$.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Cifrados producto');

  p.text('Sustituir se rompe con frecuencias; transponer, con anagramas. Y si se hacen las dos cosas? Una ' +
    'sustitución seguida de una transposición ya no es ni una ni otra: las frecuencias están ' +
    'cambiadas <em>y</em> desordenadas, y los dos ataques se estorban. A esto se le llama ' +
    '<strong>cifrado producto</strong>, y es la idea central de todos los cifrados modernos: ' +
    'alternar muchas veces una operación que confunde con otra que dispersa. El más famoso de la ' +
    'primera guerra mundial, el ADFGVX alemán, era exactamente eso: una sustitución por pares de ' +
    'letras y una transposición por columnas.');

  p.note('Dos Césares seguidos eran un César, y encadenarlos no servía de nada. Dos operaciones ' +
    '<em>distintas</em>, en cambio, se refuerzan. Cuando llegues a los cifrados por bloques verás la ' +
    'versión madura de esta idea: rondas de sustitución y permutación, una tras otra.', 'ok', 'Lo que se lleva de aquí');

  p.util('La transposición pura sigue en los pasatiempos, pero su idea está en todas partes. Los cifrados ' +
    'por bloques actuales mezclan sustituciones y permutaciones de bits, como se verá; los ' +
    'sistemas que reparten datos entre discos los «transponen» para que la pérdida de uno no se ' +
    'lleve un archivo entero; y los códigos correctores de errores entrelazan los bits de un CD ' +
    'igual que una rejilla, para que un arañazo, que destruye bits seguidos, se reparta en errores ' +
    'sueltos que sí se pueden corregir.');

  p.hist('La escítala espartana la describe Plutarco, y se usó hacia el 400 a. C. La transposición por ' +
    'columnas con palabra clave fue habitual en los ejércitos del siglo XIX y en la primera guerra ' +
    'mundial; el ADFGVX, introducido por Alemania en marzo de 1918, lo rompió el francés Georges ' +
    'Painvin en junio, tras semanas de trabajo que le costaron quince kilos, a tiempo para que ' +
    'Francia conociera el punto de la ofensiva alemana sobre París.');

  p.trampas([
    { e: 'Creer que un texto ilegible con las frecuencias del castellano está bien cifrado', por: 'Frecuencias intactas significan transposición, y una transposición por columnas se ataca probando anchos: para un mensaje de 200 letras hay menos de veinte.' },
    { e: 'Leer las columnas en el orden en que están', por: 'Sin permutación la clave es solo el ancho. El orden lo da la palabra clave: A antes que C, C antes que L.' },
    { e: 'Olvidar el relleno', por: 'Si el mensaje no llena la última fila, unas columnas son más largas que otras y Benito no sabe dónde cortar. Se rellena con X hasta completar la rejilla.' },
    { e: 'Pensar que sustituir y transponer es lo mismo que sustituir dos veces', por: 'Dos sustituciones son una sustitución. Una sustitución y una transposición son un cifrado producto, que ninguno de los dos ataques rompe por separado.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var CLAVES = ['RIO', 'SOL', 'MAR', 'LUNA', 'PLAZA', 'CLAVE', 'ROMA', 'TIGRE', 'BOSQUE'];
  var FRASES = ['ATAQUE AL ALBA', 'NOS VEMOS EN EL PUENTE', 'EL TREN SALE A LAS SIETE', 'LA CLAVE ESTA EN EL LIBRO', 'VOLVEMOS AL AMANECER'];

  p.exercise({
    title: 'El orden de las columnas',
    level: 'basico',
    gen: function (r) { var k = r.pick(CLAVES); var orden = CR.ordenClave(k), num = []; orden.forEach(function (c, i) { num[c] = i + 1; }); return { k: k, num: num }; },
    ask: function (d) { return 'Con la clave <strong>' + d.k + '</strong>, ¿qué número de lectura recibe cada columna? Escribe los ' + d.k.length + ' números en el orden de las columnas, separados por espacios (por ejemplo, para RIO sería «3 1 2»).'; },
    fields: [{ name: 'o', label: 'números', w: 'wide' }],
    sol: function (d) { return { o: d.num.join(' ') }; },
    check: function (v, d) {
      var nums = String(v.raw.o || '').match(/\d+/g) || [];
      if (nums.length !== d.k.length) return { ok: false, msg: 'Hacen falta ' + d.k.length + ' números, uno por columna.' };
      var bien = nums.every(function (x, i) { return +x === d.num[i]; });
      if (bien) return { ok: true };
      var orden = CR.ordenClave(d.k).map(function (c) { return c + 1; });
      if (nums.every(function (x, i) { return +x === orden[i]; })) return { ok: false, msg: 'Eso es la lista de columnas en orden de lectura. Se pide, para cada columna, en qué turno se lee: la inversa.' };
      return { ok: false, msg: 'No coincide. Ordena las letras de la clave alfabéticamente: la primera recibe el 1, la segunda el 2…' };
    },
    hint: function (d) { return 'Las letras de ' + d.k + ' ordenadas son ' + d.k.split('').sort().join(', ') + '. La columna de la primera recibe el 1.'; },
    steps: function (d) { return ['Orden alfabético de las letras: ' + d.k.split('').sort().join(', ') + '.', 'Cada columna recibe el puesto de su letra: <strong>' + d.num.join(' ') + '</strong>.', 'Se leen primero la columna con el 1, luego la del 2, y así.']; },
    answer: function (d) { return d.num.join(' '); }
  });

  p.exercise({
    title: 'La rejilla',
    level: 'basico',
    gen: function (r) { var n = r.int(14, 40), c = r.int(3, 7); var filas = Math.ceil(n / c); return { n: n, c: c, filas: filas, x: filas * c - n }; },
    ask: function (d) { return 'Un mensaje de ' + d.n + ' letras se cifra por columnas con una clave de ' + d.c + ' letras. ¿Cuántas filas tiene la rejilla y cuántas X de relleno hacen falta?'; },
    fields: [{ name: 'f', label: 'filas', w: 'tiny' }, { name: 'x', label: 'X de relleno', w: 'tiny' }],
    sol: function (d) { return { f: d.filas, x: d.x }; },
    errores: [{ si: function (v, d) { return d.x > 0 && v.f === Math.floor(d.n / d.c); }, msg: 'Las letras que sobran necesitan una fila más, aunque no la llenen.' }],
    hint: function () { return 'Filas: letras entre columnas, redondeando hacia arriba. Relleno: lo que falta para completar la última fila.'; },
    steps: function (d) { return ['$' + d.n + ' / ' + d.c + ' = ' + U.fmt(d.n / d.c, 2) + '$: hacen falta $' + d.filas + '$ filas.', 'La rejilla tiene $' + d.filas + '\\cdot ' + d.c + ' = ' + (d.filas * d.c) + '$ casillas: sobran $' + d.x + '$, que se rellenan con X.']; },
    answer: function (d) { return d.filas + ' filas, ' + d.x + ' X'; }
  });

  p.exercise({
    title: 'Cifra por columnas',
    level: 'medio',
    gen: function (r) { var f = r.pick(FRASES), k = r.pick(['RIO', 'SOL', 'MAR', 'LUNA', 'ROMA']); return { f: f, k: k, c: CR.columnas(f, k), t: CR.limpia(f) }; },
    ask: function (d) { return 'Cifra <strong>' + d.f + '</strong> por transposición de columnas con la clave <strong>' + d.k + '</strong>, rellenando con X si hace falta.'; },
    fields: [{ name: 'c', label: 'cifrado', w: 'wide' }],
    sol: function (d) { return { c: d.c }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.c);
      if (!t) return { ok: false, msg: 'Escribe el cifrado.' };
      if (t === d.c) return { ok: true };
      var sinOrden = (function () { var s = '', n = d.k.length, filas = Math.ceil(d.t.length / n), rel = d.t; while (rel.length < filas * n) rel += 'X'; for (var col = 0; col < n; col++) for (var f = 0; f < filas; f++) s += rel.charAt(f * n + col); return s; })();
      if (t === sinOrden) return { ok: false, msg: 'Has leído las columnas de izquierda a derecha. La clave dice el orden: primero la columna de la letra alfabéticamente menor.' };
      if (t.split('').sort().join('') !== d.c.split('').sort().join('')) return { ok: false, msg: 'Las letras no son las del mensaje: una transposición no cambia ninguna, solo su orden (más las X de relleno).' };
      return { ok: false, msg: 'Las letras son las correctas pero el orden no. Revisa el orden de lectura de las columnas y el relleno.' };
    },
    hint: function (d) { var o = CR.ordenClave(d.k).map(function (c) { return c + 1; }); return ['Escribe el mensaje en filas de ' + d.k.length + ' letras.', 'Lee las columnas en el orden ' + o.join(', ') + '.']; },
    steps: function (d) {
      var n = d.k.length, filas = Math.ceil(d.t.length / n), rel = d.t; while (rel.length < filas * n) rel += 'X';
      var rej = []; for (var f = 0; f < filas; f++) rej.push(rel.slice(f * n, (f + 1) * n));
      return ['Rejilla: ' + rej.join(' / ') + '.', 'Orden de lectura: ' + CR.ordenClave(d.k).map(function (c) { return c + 1; }).join(', ') + '.', 'Cifrado: <strong>' + d.c + '</strong>.'];
    },
    answer: function (d) { return d.c; }
  });

  p.exercise({
    title: 'Descifra por columnas',
    level: 'avanzado',
    gen: function (r) { var f = r.pick(FRASES), k = r.pick(['RIO', 'SOL', 'MAR', 'LUNA', 'ROMA']); var t = CR.limpia(f); return { f: f, k: k, c: CR.columnas(t, k), t: t }; },
    ask: function (d) { return 'El texto <strong>' + d.c + '</strong> se cifró por columnas con la clave <strong>' + d.k + '</strong>. Recupera el mensaje (las X del final son relleno).'; },
    fields: [{ name: 'm', label: 'mensaje', w: 'wide' }],
    sol: function (d) { return { m: d.t }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.m).replace(/X+$/, '');
      if (!t) return { ok: false, msg: 'Escribe el mensaje.' };
      if (t === d.t) return { ok: true };
      if (t.split('').sort().join('') !== d.t.split('').sort().join('')) return { ok: false, msg: 'Las letras no son las del cifrado. Descifrar solo las reordena.' };
      return { ok: false, msg: 'Las letras son esas, pero no en ese orden. Parte el cifrado en columnas de igual longitud, colócalas según la clave y lee por filas.' };
    },
    hint: function (d) { var filas = d.c.length / d.k.length; return ['Hay ' + d.c.length + ' letras y ' + d.k.length + ' columnas: cada columna tiene ' + filas + ' letras.', 'El primer trozo es la columna de la letra alfabéticamente menor de la clave.']; },
    steps: function (d) {
      var n = d.k.length, filas = d.c.length / n, orden = CR.ordenClave(d.k), trozos = [];
      for (var i = 0; i < n; i++) trozos.push('columna ' + (orden[i] + 1) + ' = ' + d.c.slice(i * filas, (i + 1) * filas));
      return ['Trozos de ' + filas + ' letras: ' + trozos.join(', ') + '.', 'Colocadas en su sitio y leídas por filas: <strong>' + d.t + '</strong>' + (d.c.length > d.t.length ? ' (más ' + (d.c.length - d.t.length) + ' X de relleno).' : '.')];
    },
    answer: function (d) { return d.t; }
  });

  p.exercise({
    title: '¿Qué cifrado es?',
    level: 'avanzado',
    gen: function (r) {
      var tipo = r.pick(['sust', 'trans', 'vig']), ic, chi;
      if (tipo === 'trans') { ic = r.real(0.07, 0.08, 3); chi = r.int(15, 40); }
      else if (tipo === 'sust') { ic = r.real(0.07, 0.08, 3); chi = r.int(900, 4000); }
      else { ic = r.real(0.04, 0.048, 3); chi = r.int(300, 900); }
      return { tipo: tipo, ic: ic, chi: chi };
    },
    ask: function (d) { return 'Un texto cifrado de 500 letras tiene índice de coincidencia $' + U.fmt(d.ic, 3) + '$ y $\\chi^2 = ' + d.chi + '$ frente a las frecuencias del castellano. ¿Qué tipo de cifrado es, con más probabilidad?'; },
    fields: [{ name: 'q', label: 'Es', opts: [{ t: 'transposición', v: 'trans' }, { t: 'sustitución monoalfabética', v: 'sust' }, { t: 'Vigenère', v: 'vig' }] }],
    sol: function (d) { return { q: d.tipo }; },
    hint: function () { return ['IC alto (0,075): cada letra va siempre a la misma, o no se ha cambiado. IC bajo (0,04): varias claves se turnan.', '$\\chi^2$ pequeño: las frecuencias son las del castellano, letra por letra. Grande: están cambiadas de sitio.']; },
    steps: function (d) {
      var por = { trans: 'IC alto y $\\chi^2$ pequeño: las frecuencias son exactamente las del castellano. Las letras son las mismas, en otro orden: <strong>transposición</strong>.', sust: 'IC alto pero $\\chi^2$ enorme: las letras se repiten como en castellano, pero no son las que deberían. Cada letra va siempre a la misma otra: <strong>sustitución</strong>.', vig: 'IC bajo: las frecuencias están aplanadas, porque la misma letra se cifra de varias maneras: <strong>Vigenère</strong>.' };
      return [por[d.tipo], 'Este es el primer paso de cualquier criptoanálisis: identificar el sistema antes de buscar la clave.'];
    },
    answer: function (d) { return { trans: 'transposición', sust: 'sustitución', vig: 'Vigenère' }[d.tipo]; }
  });

  p.keys([
    'La transposición no cambia las letras, solo su orden: el cifrado tiene las frecuencias exactas del castellano.',
    'Escítala y rejilla: escribir por filas, leer por columnas. La palabra clave fija el orden de las columnas: es una permutación, y hay $n!$.',
    'IC alto con $\\chi^2$ pequeño delata una transposición; se ataca probando anchos y buscando pares de letras frecuentes.',
    'Sustituir y transponer a la vez da un <strong>cifrado producto</strong>, que ninguno de los dos ataques rompe por separado: es la idea de los cifrados modernos.'
  ]);
});
