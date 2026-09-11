/* Tema: Redes de Feistel y DES */
Course.topic('cr-feistel', function (p) {

  p.puente('La [[cr-bloque|red de sustitución y permutación]] necesita que cada paso tenga inversa, y ' +
    'diseñar S-boxes invertibles limita. Este tema presenta una estructura que se deshace sola ' +
    'aunque su función interna no tenga inversa, con la [[cr-vernam|propiedad de XOR]] de anularse a ' +
    'sí misma. Con ella se construyó el cifrado que protegió el mundo durante veinte años, y con ' +
    'ella se entiende por qué dejó de valer.');

  p.text('Horst Feistel tuvo en IBM una idea que parece un truco de magia: partir el bloque en dos ' +
    'mitades, hacer con una de ellas <em>cualquier</em> cosa, por complicada e irreversible que ' +
    'sea, y usar el resultado para modificar la otra con XOR. Como XOR se deshace a sí mismo, la ' +
    'ronda tiene inversa sin que la «cualquier cosa» la tenga. Se puede meter dentro la función ' +
    'más enrevesada que se quiera.');

  /* ---------------------------------------------------------------- */
  p.section('La ronda de Feistel');

  p.formulas([
    'L_{i+1} = R_i, \\qquad R_{i+1} = L_i \\oplus f(R_i, K_i)',
    'R_i = L_{i+1}, \\qquad L_i = R_{i+1} \\oplus f(L_{i+1}, K_i)'
  ], 'una ronda y su inversa',
    'Se lee: <em>«la mitad izquierda nueva es la derecha vieja, y la derecha nueva es la izquierda ' +
    'vieja xor efe de la derecha vieja y la clave»</em>.<br><br>La segunda línea la deshace: como ' +
    '$R_i$ se ha copiado sin tocar en $L_{i+1}$, se puede volver a calcular $f(R_i, K_i)$ y ' +
    'cancelarlo con XOR. En ningún momento se invierte $f$. Descifrar es aplicar las mismas rondas ' +
    'con las claves en orden inverso.');

  p.demo({
    title: 'Una red de Feistel de 16 bits',
    intro: 'Dos mitades de 8 bits y hasta cuatro rondas con sus claves. La función $f$ pasa la mitad derecha, XOR con la clave, por una S-box de bytes y la gira tres bits. Abajo, el mismo cifrado con las claves en orden inverso, aplicado al resultado: vuelve el bloque original.',
    predice: 'Si se usa una sola ronda, ¿la mitad izquierda del cifrado esconde algo del mensaje? Mira qué es $L_1$.',
    build: function (host) {
      var bloque = 0xBEEF, claves = [0x12, 0x34, 0x56, 0x78], rondas = 4;
      var out = W.mono(host, '');
      function pinta() {
        var ks = claves.slice(0, rondas), e = CR.feistel.cifra(bloque, ks), h = '';
        h += '<b>bloque:</b> L = ' + CR.bits(bloque >> 8, 8) + '  R = ' + CR.bits(bloque & 255, 8) + '\n';
        e.traza.forEach(function (t, i) {
          if (i === 0) return;
          h += 'ronda ' + i + ' (K = ' + CR.bits(ks[i - 1], 8) + '): f(R, K) = ' + CR.bits(t.f, 8) + '   →  L = ' + CR.bits(t.L, 8) + '  R = ' + CR.bits(t.R, 8) + '\n';
        });
        h += '<b>cifrado:</b> ' + CR.bits(e.salida, 16) + ' <span class="cr-tenue">(mitades intercambiadas al final)</span>\n\n';
        var d = CR.feistel.descifra(e.salida, ks);
        h += '<b>descifrar con las claves al revés:</b> ' + CR.bits(d.salida, 16) + (d.salida === bloque ? ' <span class="cr-ok">= el bloque original</span>' : '');
        out.set(h);
      }
      W.texto(host, { label: 'bloque (4 cifras hexadecimales)', value: 'BEEF', max: 4, corto: true, on: function (v) { bloque = parseInt(v, 16) || 0; pinta(); } });
      W.slider(W.row(host), { label: 'rondas', min: 1, max: 4, step: 1, value: rondas, on: function (v) { rondas = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('En una red de Feistel, ¿qué tiene que cumplir la función $f$ para que el cifrado se pueda descifrar?', [
    { t: 'Nada: cualquier función vale, porque nunca se invierte', ok: true, por: 'La mitad que entra en $f$ se copia intacta a la ronda siguiente, así que al descifrar se puede recalcular $f$ y cancelarla con XOR. Eso libera al diseñador para meter en $f$ lo que quiera.' },
    { t: 'Tiene que ser biyectiva', ok: false, por: 'Esa es la exigencia de una S-box en una red de sustitución y permutación. La gracia de Feistel es precisamente no necesitarla.' },
    { t: 'Tiene que ser lineal', ok: false, por: 'Lineal la haría rompible con texto conocido, como Hill. Se busca lo contrario: cuanto más no lineal, mejor, y Feistel lo permite.' }
  ]);

  p.ejemplo({
    title: 'Una ronda a mano, con mitades de 4 bits',
    enunciado: 'Bloque $L_0 = 1010$, $R_0 = 0110$, clave $K = 0011$, y $f(R, K)$ = pasar $R \\oplus K$ por la S-box del tema anterior. Hacer una ronda, y deshacerla sabiendo solo el resultado y $K$.',
    pasos: [
      { t: '<strong>Calcular $f$.</strong> $R_0 \\oplus K = 0110 \\oplus 0011 = 0101 = 5$. La S-box manda el 5 al F: $f = 1111$.', antes: 'XOR de $R_0$ con $K$, y después la tabla.' },
      { t: '<strong>La ronda.</strong> $L_1 = R_0 = 0110$. $R_1 = L_0 \\oplus f = 1010 \\oplus 1111 = 0101$. Resultado: $0110\\,0101$.', antes: 'La izquierda nueva es la derecha vieja. ¿Y la derecha nueva?' },
      { t: '<strong>Deshacer.</strong> Se conoce $L_1 = 0110$, que es $R_0$. Se recalcula $f(R_0, K) = 1111$ igual que antes, y $L_0 = R_1 \\oplus f = 0101 \\oplus 1111 = 1010$ ✓.', antes: 'Con $L_1$ y $K$ se puede volver a calcular $f$. ¿Cómo se recupera $L_0$?' },
      { t: '<strong>Lo que no ha hecho falta.</strong> Invertir la S-box. Podría haber sido cualquier tabla, incluso una que mandara varios valores al mismo: la ronda seguiría teniendo inversa.' }
    ],
    cierre: 'Con 16 rondas y una $f$ que mezcla 48 bits de clave con expansiones y ocho S-boxes distintas, esto es DES.'
  });

  /* ---------------------------------------------------------------- */
  p.section('DES: el cifrado del mundo, de 1977 a 2001');

  p.text('El <em>Data Encryption Standard</em> es una red de Feistel de 16 rondas sobre bloques de 64 ' +
    'bits, con una clave de <strong>56 bits</strong>. Su función $f$ expande los 32 bits de la mitad ' +
    'derecha a 48, los mezcla con 48 bits de la clave de ronda, los pasa por ocho S-boxes de 6 bits ' +
    'a 4 y permuta el resultado. Se publicó con todos los detalles, se examinó durante décadas, y ' +
    'nadie encontró un atajo práctico: el criptoanálisis diferencial necesita $2^{47}$ textos ' +
    'elegidos, y el lineal $2^{43}$ conocidos. Su único defecto era el que se veía desde el primer ' +
    'día: 56 bits son $7\\cdot 10^{16}$ claves, y las máquinas fueron a más.');

  p.table(['Año', 'Quién', 'Cuánto tardó en romper un DES por fuerza bruta'], [
    ['1977', 'Diffie y Hellman, sobre el papel', 'un día, con una máquina de 20 millones de dólares que nadie construyó'],
    ['1998', 'Electronic Frontier Foundation, «Deep Crack»', '56 horas, con 250 000 dólares'],
    ['1999', 'Deep Crack más 100 000 ordenadores en red', '22 horas'],
    ['2008', 'COPACOBANA, 120 chips reprogramables', 'menos de un día, con 10 000 dólares'],
    ['hoy', 'una granja de tarjetas gráficas', 'horas']
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Cifrar dos veces no duplica los bits: el encuentro a medio camino');

  p.text('La solución obvia para una clave corta es cifrar dos veces con dos claves: $c = E_{k_2}(E_{k_1}(m))$, ' +
    'y se diría que son 112 bits. No lo son. Con una pareja mensaje-cifrado conocida, Eva calcula ' +
    '$E_{k_1}(m)$ para todas las $k_1$ y lo guarda en una tabla; después calcula $D_{k_2}(c)$ para ' +
    'cada $k_2$ y busca en la tabla. Cuando encuentra una coincidencia tiene las dos claves. El ' +
    'coste es de $2\\cdot 2^{56}$ operaciones y una tabla de $2^{56}$ entradas: 57 bits de trabajo, ' +
    'no 112.');

  p.formula('E_{k_1}(m) = D_{k_2}(c) \\quad\\Longrightarrow\\quad \\text{coste } 2^{k+1} \\text{ en vez de } 2^{2k}',
    'el encuentro a medio camino',
    'Se lee: <em>«cifrar eme con la primera clave es lo mismo que descifrar ce con la segunda»</em>: ' +
    'el punto intermedio se puede alcanzar desde los dos lados.<br><br>Por eso el sucesor provisional ' +
    'de DES fue el <strong>triple DES</strong>: cifrar, descifrar y cifrar con tres claves (o dos, ' +
    'repitiendo la primera). Tres pasos dan, contra este ataque, unos 112 bits efectivos. Y es tres ' +
    'veces más lento, lo que empujó a buscar un cifrado nuevo.');

  p.demo({
    title: 'Encuentro a medio camino con claves de 8 bits',
    intro: 'La red de Feistel de arriba con una sola clave de 8 bits por «cifrado», aplicada dos veces con dos claves. Se conoce una pareja bloque-cifrado. La fuerza bruta directa prueba $256\\cdot 256$ parejas; el encuentro a medio camino, unas $256 + 256$. Pulsa y compara.',
    predice: 'Con claves de 8 bits, la fuerza bruta sobre las dos claves prueba 65 536 parejas. ¿Cuántas operaciones necesitará el encuentro a medio camino: unas 65 536, unas 512, o unas 16?',
    build: function (host) {
      var out = W.mono(host, ''), r = U.rng(5);
      function unCifrado(b, k) { return CR.feistel.cifra(b, [k, k ^ 0xA5, k ^ 0x3C]).salida; }
      function unDescifrado(b, k) { return CR.feistel.descifra(b, [k, k ^ 0xA5, k ^ 0x3C]).salida; }
      function corre() {
        var k1 = r.int(0, 255), k2 = r.int(0, 255), m = r.int(0, 65535), c = unCifrado(unCifrado(m, k1), k2);
        var tabla = {}, ops = 0, hallados = [];
        for (var a = 0; a < 256; a++) { tabla[unCifrado(m, a)] = a; ops++; }
        for (var b = 0; b < 256; b++) { var mitad = unDescifrado(c, b); ops++; if (tabla[mitad] !== undefined) hallados.push([tabla[mitad], b]); }
        out.set('<b>conocido:</b> m = ' + CR.bits(m, 16) + ', c = ' + CR.bits(c, 16) + '\n<b>claves reales:</b> k₁ = ' + CR.bits(k1, 8) + ', k₂ = ' + CR.bits(k2, 8) + '\n\n' +
          'tabla de E(m, k₁) para las 256 claves: 256 cifrados\nbúsqueda de D(c, k₂) en la tabla: 256 descifrados\n<b>operaciones:</b> ' + ops + '   <span class="cr-tenue">(fuerza bruta directa: 65 536 parejas)</span>\n' +
          '<b>parejas que coinciden:</b> ' + hallados.map(function (h) { return '(' + CR.bits(h[0], 8) + ', ' + CR.bits(h[1], 8) + ')'; }).join(' ') + (hallados.length > 1 ? '\n<span class="cr-tenue">varias parejas encajan con un solo bloque conocido; una segunda pareja conocida deja solo la buena</span>' : ''));
      }
      W.buttons(host, [{ t: 'Otras claves, otro ataque', cls: 'btn--main', on: corre }]);
      corre();
    }
  });

  p.util('DES protegió durante veinte años cajeros automáticos, transferencias bancarias y tarjetas, y el ' +
    'triple DES siguió en las tarjetas de pago hasta bien entrada la década de 2010; su retirada ' +
    'definitiva se fijó para 2023. La estructura de Feistel sigue viva en muchos cifrados, y el ' +
    'encuentro a medio camino es hoy una herramienta general: cualquier problema que se pueda ' +
    'partir en dos mitades se ataca en la raíz cuadrada del tiempo, a cambio de memoria, y eso ' +
    'aparece desde la búsqueda de colisiones hasta la resolución de puzles.');

  p.hist('Horst Feistel, un físico alemán emigrado a Estados Unidos, diseñó Lucifer en IBM hacia 1971. ' +
    'El gobierno estadounidense pidió un estándar en 1973, IBM presentó una versión modificada, y la ' +
    'NSA redujo la clave de 128 a 56 bits y cambió las S-boxes sin explicar por qué; la sospecha de ' +
    'una puerta trasera duró hasta 1990, cuando se supo que las S-boxes resistían el criptoanálisis ' +
    'diferencial, que la agencia conocía en secreto. Whitfield Diffie y Martin Hellman publicaron en ' +
    '1977 el diseño de la máquina de fuerza bruta y el ataque del encuentro a medio camino. En 1997 ' +
    'se convocó el concurso para sustituirlo.');

  p.trampas([
    { e: 'Cifrar dos veces para «duplicar la clave»', por: 'El encuentro a medio camino lo deja en un bit más: $2^{57}$ en vez de $2^{112}$. Hace falta cifrar tres veces, y aun así con pérdida.' },
    { e: 'Confundir clave de 56 bits con clave de 64', por: 'DES recibe 64 bits, pero 8 son de paridad y no cuentan. El espacio de claves es $2^{56}$, y ese fue su final.' },
    { e: 'Creer que el cifrado se rompió por un fallo del diseño', por: 'En cuarenta años no apareció ningún atajo práctico. Se rompió porque la clave era corta: el diseño aguantó, la aritmética no.' },
    { e: 'Olvidar el intercambio final de mitades', por: 'Sin él, descifrar con las claves al revés no devuelve el bloque. El intercambio hace que la última ronda y la primera del descifrado encajen.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Una ronda de Feistel',
    level: 'basico',
    gen: function (r) { var L = r.int(0, 15), R = r.int(0, 15), f = r.int(0, 15); return { L: L, R: R, f: f, L1: R, R1: L ^ f }; },
    ask: function (d) { return 'Mitades $L_0 = ' + CR.bits(d.L, 4) + '$ y $R_0 = ' + CR.bits(d.R, 4) + '$, y ya calculado $f(R_0, K) = ' + CR.bits(d.f, 4) + '$. ¿Qué mitades salen de la ronda?'; },
    fields: [{ name: 'L', label: 'L₁', w: 'tiny' }, { name: 'R', label: 'R₁', w: 'tiny' }],
    sol: function (d) { return { L: CR.bits(d.L1, 4), R: CR.bits(d.R1, 4) }; },
    check: function (v, d) {
      function lee(s) { return String(s || '').replace(/[^01]/g, ''); }
      var a = lee(v.raw.L) === CR.bits(d.L1, 4), b = lee(v.raw.R) === CR.bits(d.R1, 4);
      if (a && b) return { ok: true };
      if (lee(v.raw.L) === CR.bits(d.R1, 4) && lee(v.raw.R) === CR.bits(d.L1, 4)) return { ok: false, msg: 'Las tienes cruzadas: la izquierda nueva es la derecha vieja tal cual, y la derecha nueva lleva el XOR.' };
      if (lee(v.raw.R) === CR.bits(d.R ^ d.f, 4) && d.R !== d.L) return { ok: false, msg: 'El XOR es con la mitad <em>izquierda</em>: $R_1 = L_0 \\oplus f$.', fields: { L: a, R: false } };
      return { ok: false, msg: '$L_1 = R_0$ y $R_1 = L_0 \\oplus f$.', fields: { L: a, R: b } };
    },
    hint: function () { return 'La derecha pasa a la izquierda sin cambios. La izquierda vieja se combina con $f$ por XOR y pasa a la derecha.'; },
    steps: function (d) { return ['$L_1 = R_0 = ' + CR.bits(d.L1, 4) + '$.', '$R_1 = L_0 \\oplus f = ' + CR.bits(d.L, 4) + ' \\oplus ' + CR.bits(d.f, 4) + ' = ' + CR.bits(d.R1, 4) + '$.']; },
    answer: function (d) { return CR.bits(d.L1, 4) + ' ' + CR.bits(d.R1, 4); }
  });

  p.exercise({
    title: 'Deshacer una ronda',
    level: 'medio',
    gen: function (r) { var L = r.int(0, 15), R = r.int(0, 15), f = r.int(0, 15); return { L: L, R: R, f: f, L1: R, R1: L ^ f }; },
    ask: function (d) { return 'Tras una ronda de Feistel salen $L_1 = ' + CR.bits(d.L1, 4) + '$ y $R_1 = ' + CR.bits(d.R1, 4) + '$. Se sabe que $f(L_1, K) = ' + CR.bits(d.f, 4) + '$. ¿Cuáles eran $L_0$ y $R_0$?'; },
    fields: [{ name: 'L', label: 'L₀', w: 'tiny' }, { name: 'R', label: 'R₀', w: 'tiny' }],
    sol: function (d) { return { L: CR.bits(d.L, 4), R: CR.bits(d.R, 4) }; },
    check: function (v, d) {
      function lee(s) { return String(s || '').replace(/[^01]/g, ''); }
      var a = lee(v.raw.L) === CR.bits(d.L, 4), b = lee(v.raw.R) === CR.bits(d.R, 4);
      if (a && b) return { ok: true };
      return { ok: false, msg: '$R_0 = L_1$ tal cual, y $L_0 = R_1 \\oplus f$: el XOR se cancela con el mismo $f$.', fields: { L: a, R: b } };
    },
    hint: function () { return 'Lo que se copió sin tocar vuelve sin tocar; lo que llevaba XOR se le vuelve a aplicar el mismo XOR.'; },
    steps: function (d) { return ['$R_0 = L_1 = ' + CR.bits(d.R, 4) + '$.', '$L_0 = R_1 \\oplus f = ' + CR.bits(d.R1, 4) + ' \\oplus ' + CR.bits(d.f, 4) + ' = ' + CR.bits(d.L, 4) + '$.', 'No se ha invertido $f$: solo se ha vuelto a calcular.']; },
    answer: function (d) { return CR.bits(d.L, 4) + ' ' + CR.bits(d.R, 4); }
  });

  p.exercise({
    title: 'La clave de DES contra las máquinas',
    level: 'medio',
    gen: function (r) { var v = r.pick([1e6, 1e9, 1e12, 1e14]); var seg = Math.pow(2, 55) / v; return { v: v, exp: Math.round(Math.log(v) / Math.LN10), seg: seg, dias: seg / 86400 }; },
    ask: function (d) { return 'DES tiene $2^{56}$ claves. Un atacante prueba $10^{' + d.exp + '}$ por segundo. ¿Cuántos días tarda, de media, en encontrar la clave? (dos decimales)'; },
    fields: [{ name: 'd', label: 'días', w: 'tiny' }],
    sol: function (d) { return { d: d.dias }; },
    dec: 2, tol: 2e-3,
    hint: function () { return 'De media se prueba la mitad: $2^{55}$. Entre la velocidad, y entre 86 400 segundos por día.'; },
    steps: function (d) { return ['$2^{55} \\approx 3{,}6\\cdot 10^{16}$ claves de media.', 'Entre $10^{' + d.exp + '}$: $' + d.seg.toExponential(2).replace('e+', '\\cdot 10^{') + '}$ segundos.', 'Entre 86 400: $' + U.fmt(d.dias, 2) + '$ días.' + (d.dias < 30 ? ' Con esa velocidad, DES no protege nada.' : '')]; },
    answer: function (d) { return U.fmt(d.dias, 2) + ' días'; }
  });

  p.exercise({
    title: 'Encuentro a medio camino',
    level: 'avanzado',
    gen: function (r) { var k = r.pick([8, 16, 32, 40, 56, 64]); return { k: k, bruta: 2 * k, mitm: k + 1 }; },
    ask: function (d) { return 'Se cifra dos veces con dos claves independientes de ' + d.k + ' bits. ¿Cuántos bits de trabajo exige la fuerza bruta sobre las dos claves a la vez (el logaritmo en base 2 del número de parejas)? ¿Y el encuentro a medio camino, contando que hay que hacer $2\\cdot 2^{k}$ operaciones?'; },
    fields: [{ name: 'b', label: 'fuerza bruta (bits)', w: 'tiny' }, { name: 'm', label: 'a medio camino (bits)', w: 'tiny' }],
    sol: function (d) { return { b: d.bruta, m: d.mitm }; },
    errores: [{ si: function (v, d) { return v.m === d.k; }, msg: 'Casi: son $2^k$ cifrados más $2^k$ descifrados, $2\\cdot 2^k = 2^{k+1}$. Un bit más.' }],
    hint: function () { return ['Parejas de claves: $2^k\\cdot 2^k = 2^{2k}$.', 'Encuentro: $2^k + 2^k = 2^{k+1}$ operaciones, más una tabla de $2^k$ entradas.']; },
    steps: function (d) { return ['Fuerza bruta: $2^{' + d.k + '}\\cdot 2^{' + d.k + '} = 2^{' + d.bruta + '}$ parejas.', 'Encuentro a medio camino: $2^{' + d.k + '} + 2^{' + d.k + '} = 2^{' + d.mitm + '}$ operaciones.', 'Cifrar dos veces ha ganado un bit, no ' + d.k + '. Por eso se cifra tres veces: entonces el encuentro cuesta $2^{2k}$ contra $2^{3k}$.']; },
    answer: function (d) { return d.bruta + ' y ' + d.mitm; }
  });

  p.exercise({
    title: 'La memoria del ataque',
    level: 'avanzado',
    gen: function (r) { var k = r.pick([32, 40, 48, 56]), bytes = r.pick([8, 16]); var entradas = Math.pow(2, k), total = entradas * bytes; return { k: k, bytes: bytes, entradas: entradas, total: total, tb: total / Math.pow(2, 40) }; },
    ask: function (d) { return 'El encuentro a medio camino contra un doble cifrado con claves de ' + d.k + ' bits guarda una tabla con una entrada por clave, de ' + d.bytes + ' bytes cada una. ¿Cuántos terabytes ocupa la tabla? (un terabyte son $2^{40}$ bytes; da el resultado con un decimal, o sin decimales si es grande)'; },
    fields: [{ name: 't', label: 'terabytes', w: 'tiny' }],
    sol: function (d) { return { t: d.tb }; },
    rel: 1e-3,
    hint: function () { return '$2^k$ entradas por los bytes de cada una, entre $2^{40}$.'; },
    steps: function (d) { return ['$2^{' + d.k + '}\\cdot ' + d.bytes + ' = 2^{' + (d.k + Math.log(d.bytes) / Math.LN2) + '}$ bytes.', 'Entre $2^{40}$: $2^{' + (d.k + Math.log(d.bytes) / Math.LN2 - 40) + '} = ' + U.fmt(d.tb, d.tb < 10 ? 1 : 0) + '$ terabytes.', d.tb > 1000 ? 'Es mucha memoria: el ataque cambia tiempo por espacio, y con 56 bits el espacio también cuesta. Aun así, hay variantes que reducen la tabla.' : 'Cabe en unos pocos discos: contra claves de ese tamaño el ataque es práctico.']; },
    answer: function (d) { return U.fmt(d.tb, d.tb < 10 ? 1 : 0) + ' TB'; }
  });

  p.keys([
    'Ronda de Feistel: $L_{i+1} = R_i$, $R_{i+1} = L_i \\oplus f(R_i, K_i)$. Se deshace con las claves al revés, sin invertir nunca $f$.',
    'Por eso $f$ puede ser cualquier cosa: cuanto más no lineal, mejor.',
    'DES: Feistel de 16 rondas, bloque de 64 bits, clave de 56. Aguantó cuarenta años de criptoanálisis y cayó por fuerza bruta en 1998.',
    'Cifrar dos veces no duplica los bits: el encuentro a medio camino lo rompe con $2^{k+1}$ operaciones y una tabla de $2^k$. Por eso existe el triple DES.',
    'Un cifrado muere cuando su clave se queda corta frente a las máquinas, aunque su diseño siga intacto.'
  ]);
});
