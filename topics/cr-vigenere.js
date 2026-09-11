/* Tema: Vigenere y como se rompe: Kasiski y el indice de coincidencia */
Course.topic('cr-vigenere', function (p) {

  p.puente('El [[cr-frecuencias|análisis de frecuencias]] rompe cualquier cifrado en el que cada letra vaya ' +
    'siempre a la misma letra. La respuesta natural es que no vaya siempre a la misma: una clave que ' +
    'cambia de letra en letra. Romperla necesita dos ideas nuevas, y una de ellas es el ' +
    '[[ar-divisibilidad|máximo común divisor]].');

  p.text('Durante tres siglos se le llamó <em>le chiffre indéchiffrable</em>, el cifrado indescifrable. La idea ' +
    'es sencilla: en vez de un César con una clave, varios Césares que se turnan. Con la palabra ' +
    'clave LIMON, la primera letra del mensaje se desplaza 11 (la L), la segunda 8 (la I), la ' +
    'tercera 12, la cuarta 14, la quinta 13, y la sexta vuelve a 11. La misma E del mensaje sale ' +
    'unas veces como P, otras como M, otras como Q: las frecuencias se aplanan, y el método de ' +
    'Al-Kindi se queda ciego.');

  /* ---------------------------------------------------------------- */
  p.section('Varios Césares que se turnan');

  p.formula('c_i = \\bigl(m_i + k_{\\,i \\bmod L}\\bigr) \\bmod 26', 'cifrado de Vigenère con clave de L letras',
    'Se lee: <em>«ce sub i es igual a eme sub i más ka sub i módulo ele, todo módulo 26»</em>. La letra ' +
    'número $i$ del mensaje se desplaza según la letra número $i \\bmod L$ de la clave: la clave se ' +
    'repite una y otra vez debajo del mensaje.<br><br>Con $L = 1$ es un César. Con $L$ igual a la ' +
    'longitud del mensaje, y una clave sin repeticiones, es otra cosa que verás dentro de unos temas.');

  p.demo({
    title: 'La clave debajo del mensaje',
    intro: 'La clave se escribe repetida bajo el mensaje y cada columna es una suma módulo 26. Mira lo que pasa con las letras repetidas del mensaje: ya no van siempre a la misma.',
    predice: 'Cifra un mensaje con la clave A. ¿Qué sale? ¿Y con la clave AAAA? ¿Qué clave de una letra convierte Vigenère en el César de clave 3?',
    build: function (host) {
      var msg = 'ATAQUE AL AMANECER', clave = 'LIMON';
      var out = W.mono(host, '');
      function pinta() {
        var t = CR.limpia(msg), k = CR.limpia(clave);
        if (!k) { out.set('Escribe una clave con alguna letra.'); return; }
        var fila2 = '', fila3 = '';
        for (var i = 0; i < t.length; i++) { fila2 += k.charAt(i % k.length); fila3 += CR.letra(CR.num(t.charAt(i)) + CR.num(k.charAt(i % k.length))); }
        var ic = CR.ic(fila3);
        out.set('<b>mensaje:</b> ' + t + '\n<b>clave:  </b> <span class="cr-tenue">' + fila2 + '</span>\n<b>cifrado:</b> ' + fila3 +
          '\n\n<span class="cr-tenue">la clave tiene ' + k.length + ' letras: cada letra del mensaje puede salir de ' + Math.min(k.length, 26) + ' maneras distintas</span>');
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 60, on: function (v) { msg = v; pinta(); } });
      W.texto(host, { label: 'clave', value: clave, max: 12, corto: true, on: function (v) { clave = v; pinta(); } });
      pinta();
    }
  });

  p.text('Descifrar es restar la clave en vez de sumarla, y todo lo demás es igual. La debilidad del ' +
    'sistema no está en la operación, sino en la <strong>repetición</strong>: la clave vuelve a ' +
    'empezar cada $L$ letras, y eso deja una huella periódica en el cifrado.');

  /* ---------------------------------------------------------------- */
  p.section('Medir si un texto está «mezclado»');

  p.text('Con la clave cambiando, el histograma del cifrado se aplana: ya no hay una letra con el 14 % ' +
    'y otra con el 0,02 %. Hace falta un número que mida ese aplanamiento sin necesidad de saber ' +
    'qué letra es cuál. William Friedman lo propuso en 1920: la probabilidad de que dos letras ' +
    'tomadas al azar del texto sean iguales.');

  p.formula('\\text{IC} = \\frac{\\sum_{\\ell} n_\\ell\\,(n_\\ell - 1)}{N\\,(N - 1)}', 'índice de coincidencia',
    'Se lee: <em>«i ce es la suma, para cada letra, de ene sub ele por ene sub ele menos uno, partido ' +
    'por ene por ene menos uno»</em>. $n_\\ell$ es cuántas veces aparece la letra $\\ell$ y $N$ el ' +
    'total.<br><br>Para un texto en castellano vale unos $0{,}075$: las letras frecuentes se repiten ' +
    'mucho. Para letras al azar, $1/26 \\approx 0{,}038$. Un César conserva el $0{,}075$, porque ' +
    'solo cambia los nombres de las letras; un Vigenère lo hunde hacia $0{,}04$. Y aquí está el ' +
    'truco: si se separan las letras del cifrado en $L$ columnas, cada columna es un César, y su IC ' +
    'vuelve a $0{,}075$. Probando longitudes, la buena es la que devuelve el IC alto.');

  p.comprueba('Un texto cifrado tiene IC $= 0{,}074$. ¿Qué es lo más probable?', [
    { t: 'Que sea una sustitución o un César, no un Vigenère: las frecuencias siguen tan desiguales como en castellano', ok: true, por: 'Un cifrado que manda cada letra siempre a la misma conserva el IC del idioma. Solo cambia los nombres, no cuántas veces se repite cada una.' },
    { t: 'Que sea un Vigenère con clave larga', ok: false, por: 'Cuanto más larga la clave, más se aplanan las frecuencias y más baja el IC hacia 0,038. Un IC de 0,074 es el del castellano intacto.' },
    { t: 'Que el texto está en inglés', ok: false, por: 'El IC de un idioma se calcula sobre sus frecuencias: el inglés da unos 0,067 y el castellano unos 0,075. Un 0,074 es compatible con castellano cifrado sin mezclar.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Kasiski: las repeticiones delatan el periodo');

  p.text('Hay otra pista, más antigua y más visual. Si en el mensaje la palabra QUE aparece dos veces y ' +
    'las dos caen bajo las mismas letras de la clave, se cifran <strong>igual</strong>. Para que ' +
    'eso pase, la distancia entre las dos ha de ser un múltiplo de $L$. Así que basta buscar grupos ' +
    'de tres letras repetidos en el cifrado, medir las distancias y calcular su máximo común ' +
    'divisor: casi siempre es la longitud de la clave, o un múltiplo pequeño.');

  p.ejemplo({
    title: 'Del cifrado a la clave',
    enunciado: 'En un cifrado Vigenère aparecen el grupo KZR a 24 letras de distancia de sí mismo, el grupo TAP a 36 y el grupo OQK a 60. Deducir la longitud de la clave. Después, sabiendo que en la primera columna la letra más frecuente es la J, hallar la primera letra de la clave.',
    pasos: [
      { t: '<strong>Las distancias.</strong> $24$, $36$ y $60$. Cada una tiene que ser múltiplo de $L$, así que $L$ divide a su máximo común divisor.', antes: '¿Qué tienen que cumplir las distancias respecto de la longitud de la clave?' },
      { t: '<strong>El mcd.</strong> $24 = 2^3\\cdot 3$, $36 = 2^2\\cdot 3^2$, $60 = 2^2\\cdot 3\\cdot 5$: $\\operatorname{mcd} = 2^2\\cdot 3 = 12$. La clave mide 12, o un divisor de 12: 6, 4, 3, 2. Con tres coincidencias, 12 es la apuesta; el índice de coincidencia por columnas la confirma.', antes: 'Factoriza los tres números y quédate con lo común.' },
      { t: '<strong>La primera letra.</strong> La primera columna es un César. Su letra más frecuente, J $= 9$, debe ser la E $= 4$ del castellano: la clave desplaza $9 - 4 = 5$, que es la <strong>F</strong>.', antes: 'En un César, ¿qué letra del cifrado suele ser la E?' },
      { t: '<strong>Y así las doce.</strong> Cada columna da una letra de la clave. Con doce columnas de treinta letras cada una las frecuencias son ruidosas, y a veces la más frecuente es la A y no la E: se prueba, se lee, se corrige.' }
    ],
    cierre: 'Kasiski da la longitud y el análisis de frecuencias, columna a columna, da las letras. El indescifrable tardó tres siglos en caer y cae en media hora.'
  });

  p.demo({
    title: 'Romper un Vigenère entero',
    intro: 'Un texto largo cifrado con la clave que escribas. Abajo: los grupos de tres letras repetidos con sus distancias y su mcd, el índice de coincidencia según cuántas columnas se supongan, y la clave que sale de aplicar chi cuadrado a cada columna.',
    predice: 'Con una clave de 5 letras, ¿para qué número de columnas subirá el índice de coincidencia: solo para 5, o también para 10 y 15? ¿Por qué?',
    build: function (host) {
      var clave = 'LIMON';
      var out = W.mono(host, '');
      function pinta() {
        var k = CR.limpia(clave);
        if (!k) { out.set('Escribe una clave.'); return; }
        var claro = CR.limpia(CR.QUIJOTE), cif = CR.vigenere(claro, k), h = '';
        h += '<b>cifrado (' + cif.length + ' letras, IC = ' + U.fmt(CR.ic(cif), 3) + '):</b>\n' + cif.slice(0, 110) + '…\n\n';
        var kas = CR.kasiski(cif, 3).filter(function (x) { return x.posiciones.length >= 2; }).slice(0, 6), dist = [];
        h += '<b>Kasiski:</b> ';
        if (!kas.length) h += 'ningún grupo repetido.\n';
        else {
          h += kas.map(function (x) { dist = dist.concat(x.distancias); return x.grupo + ' a ' + x.distancias.join(', '); }).join(' · ') + '\n';
          h += 'mcd de las distancias: <b>' + ML.gcdList(dist) + '</b>\n';
        }
        h += '\n<b>IC por número de columnas:</b>\n';
        var mejorL = 1, mejorIC = 0;
        for (var L = 1; L <= 12; L++) {
          var suma = 0;
          for (var c = 0; c < L; c++) { var col = ''; for (var i = c; i < cif.length; i += L) col += cif.charAt(i); suma += CR.ic(col); }
          var media = suma / L;
          if (media > mejorIC + 0.004 && L <= 12) { mejorIC = media; mejorL = L; }
          h += (L < 10 ? ' ' : '') + L + ': ' + U.fmt(media, 3) + ' ' + (function () { var s = ''; for (var j = 0; j < Math.round((media - 0.03) * 400); j++) s += '█'; return s; })() + '\n';
        }
        var claveHallada = '';
        for (var c2 = 0; c2 < mejorL; c2++) {
          var col2 = ''; for (var i2 = c2; i2 < cif.length; i2 += mejorL) col2 += cif.charAt(i2);
          var mejorK = 0, mejorChi = Infinity;
          for (var kk = 0; kk < 26; kk++) { var d = CR.cesar(col2, -kk), chi = CR.chi2(CR.frecuencias(d), d.length); if (chi < mejorChi) { mejorChi = chi; mejorK = kk; } }
          claveHallada += CR.letra(mejorK);
        }
        h += '\nMejor longitud: <b>' + mejorL + '</b>. Clave deducida columna a columna: <b>' + claveHallada + '</b>' + (claveHallada === k ? ' <span class="cr-ok">✓</span>' : (CR.vigenere(cif, claveHallada, true) === claro ? ' <span class="cr-ok">(equivale a la tuya)</span>' : ' <span class="cr-dif">(no del todo: prueba una clave más corta o sin letras repetidas)</span>')) +
          '\n<span class="cr-tenue">descifrado: ' + CR.vigenere(cif, claveHallada, true).slice(0, 80) + '…</span>';
        out.set(h);
      }
      W.texto(host, { label: 'clave (hasta 12 letras)', value: clave, max: 12, corto: true, on: function (v) { clave = v; pinta(); } });
      pinta();
    }
  });

  p.text('Dos cosas que conviene ver en la demo. Primera: el IC sube en la longitud de la clave y en ' +
    'sus múltiplos, porque partir en 10 columnas una clave de 5 sigue dando columnas de un solo ' +
    'César. Segunda: con una clave larga y un texto corto, cada columna tiene pocas letras y el ' +
    'método flaquea. La seguridad de Vigenère depende de la relación entre la longitud de la clave ' +
    'y la del mensaje, y ese hilo lleva directamente al único cifrado perfecto.');

  p.util('Vigenère se usó de verdad hasta bien entrado el siglo XIX: los ejércitos confederados en la ' +
    'guerra civil estadounidense lo emplearon con tres claves fijas que el Norte conocía. Sus dos ' +
    'ataques tienen vida propia fuera de los cifrados: buscar repeticiones para encontrar un periodo ' +
    'es lo que hace un programa de compresión, y el índice de coincidencia se usa para identificar ' +
    'el idioma de un texto y para detectar si un flujo de datos está cifrado o no, porque un ' +
    'archivo cifrado tiene IC $\\approx 1/256$ y uno normal, mucho mayor.');

  p.hist('El cifrado lo describió Giovan Battista Bellaso en 1553; Blaise de Vigenère publicó en 1586 ' +
    'una variante más fuerte, la autoclave, y la historia le atribuyó la más débil. Charles Babbage ' +
    'lo rompió hacia 1854 y no lo publicó, quizá porque la inteligencia británica lo usó en la ' +
    'guerra de Crimea; el mérito público fue para Friedrich Kasiski, un oficial prusiano retirado, en ' +
    '1863. William Friedman, que había entrado en la criptografía estudiando genética, publicó el ' +
    'índice de coincidencia en 1920 y dirigió después la ruptura de los cifrados japoneses.');

  p.trampas([
    { e: 'Contar frecuencias sobre el cifrado entero', por: 'Con la clave LIMON, la E sale como P, M, Q, S o R según la posición. El histograma se aplana y no dice nada. Se cuenta por columnas.' },
    { e: 'Tomar como longitud la distancia más corta de Kasiski', por: 'Una distancia de 36 con clave de 12 es normal. La longitud es el mcd de varias distancias, no la menor.' },
    { e: 'Creer que una clave larga es segura por sí misma', por: 'Una clave de 20 letras sobre un mensaje de 2000 deja 20 columnas de 100 letras: cada una se rompe como un César. Lo que protege es una clave tan larga como el mensaje.' },
    { e: 'Fiarse de que la letra más frecuente de cada columna es la E', por: 'Con 30 letras por columna, la A gana a la E una de cada tres veces. Se toma como hipótesis y se comprueba leyendo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var PAL = ['MENSAJE', 'ATAQUE', 'PUENTE', 'SECRETO', 'CAMINO', 'CASTILLO', 'MANANA', 'SOLDADO'];
  var CLAVES = ['SOL', 'LUNA', 'MAR', 'CLAVE', 'RIO', 'ORO'];

  p.exercise({
    title: 'Cifra con Vigenère',
    level: 'basico',
    gen: function (r) { var w = r.pick(PAL), k = r.pick(CLAVES); return { w: w, k: k, c: CR.vigenere(w, k) }; },
    ask: function (d) { return 'Cifra <strong>' + d.w + '</strong> con Vigenère y la clave <strong>' + d.k + '</strong>.'; },
    fields: [{ name: 'c', label: 'cifrado', w: 'wide' }],
    sol: function (d) { return { c: d.c }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.c);
      if (!t) return { ok: false, msg: 'Escribe el cifrado.' };
      if (t === d.c) return { ok: true };
      if (t === CR.vigenere(d.w, d.k, true)) return { ok: false, msg: 'Has restado la clave: eso descifra. Para cifrar se suma.' };
      if (t === CR.cesar(d.w, CR.num(d.k.charAt(0)))) return { ok: false, msg: 'Has usado solo la primera letra de la clave para todo el mensaje. La clave avanza con cada letra.' };
      return { ok: false, msg: 'No coincide. Escribe la clave repetida debajo del mensaje y suma columna a columna, módulo 26.' };
    },
    hint: function (d) { return ['Debajo de ' + d.w + ' va ' + (function () { var s = ''; for (var i = 0; i < d.w.length; i++) s += d.k.charAt(i % d.k.length); return s; })() + '.', 'Primera letra: ' + d.w.charAt(0) + ' (' + CR.num(d.w.charAt(0)) + ') + ' + d.k.charAt(0) + ' (' + CR.num(d.k.charAt(0)) + ') = ' + CR.mod(CR.num(d.w.charAt(0)) + CR.num(d.k.charAt(0)), 26) + ', la ' + d.c.charAt(0) + '.']; },
    steps: function (d) {
      var l = [];
      for (var i = 0; i < d.w.length; i++) { var a = CR.num(d.w.charAt(i)), b = CR.num(d.k.charAt(i % d.k.length)); l.push(d.w.charAt(i) + ' + ' + d.k.charAt(i % d.k.length) + ': $' + a + ' + ' + b + ' = ' + (a + b) + (a + b >= 26 ? ' \\equiv ' + ((a + b) % 26) : '') + '$ → ' + d.c.charAt(i)); }
      return l.concat(['Cifrado: <strong>' + d.c + '</strong>.']);
    },
    answer: function (d) { return d.c; }
  });

  p.exercise({
    title: 'Descifra una letra',
    level: 'basico',
    gen: function (r) { var m = r.int(0, 25), k = r.int(1, 25); return { m: m, k: k, c: CR.mod(m + k, 26) }; },
    ask: function (d) { return 'En un cifrado Vigenère, la letra cifrada <strong>' + CR.letra(d.c) + '</strong> está bajo la letra <strong>' + CR.letra(d.k) + '</strong> de la clave. ¿Qué letra era en el mensaje?'; },
    fields: [{ name: 'l', label: 'letra', w: 'tiny' }],
    sol: function (d) { return { l: CR.letra(d.m) }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.l);
      if (t.length !== 1) return { ok: false, msg: 'Escribe una sola letra.' };
      if (t === CR.letra(d.m)) return { ok: true };
      if (t === CR.letra(d.c + d.k)) return { ok: false, msg: 'Has sumado la letra de la clave: eso cifra otra vez. Para descifrar se resta.' };
      return { ok: false, msg: 'No es esa. Resta el valor de la letra de la clave y reduce módulo 26.' };
    },
    hint: function (d) { return CR.letra(d.c) + ' = ' + d.c + ' y ' + CR.letra(d.k) + ' = ' + d.k + '. Resta.'; },
    steps: function (d) { return ['$' + d.c + ' - ' + d.k + ' = ' + (d.c - d.k) + (d.c - d.k < 0 ? ' \\equiv ' + d.m + ' \\pmod{26}' : '') + '$.', 'El ' + d.m + ' es la <strong>' + CR.letra(d.m) + '</strong>.']; },
    answer: function (d) { return CR.letra(d.m); }
  });

  p.exercise({
    title: 'Kasiski: la longitud de la clave',
    level: 'medio',
    gen: function (r) {
      var L = r.pick([3, 4, 5, 6, 7, 8]), ds = [], g;
      for (var i = 0; i < 3; i++) ds.push(L * r.int(2, 12));
      g = ML.gcdList(ds);
      if (g !== L) return null;
      ds.sort(function (a, b) { return a - b; });
      return { L: L, ds: ds };
    },
    ask: function (d) { return 'En un cifrado Vigenère se encuentran tres grupos de letras repetidos, a distancias de ' + d.ds.join(', ') + ' posiciones. ¿Cuál es la longitud más probable de la clave?'; },
    fields: [{ name: 'L', label: 'longitud', w: 'tiny' }],
    sol: function (d) { return { L: d.L }; },
    errores: [{ si: function (v, d) { return v.L === d.ds[0] && d.ds[0] !== d.L; }, msg: 'Esa es la distancia más corta, no la longitud. La clave divide a todas las distancias: es el máximo común divisor.' }],
    hint: function () { return 'Cada distancia es un múltiplo de la longitud de la clave: calcula el máximo común divisor de las tres.'; },
    steps: function (d) { return ['Factorizando: ' + d.ds.map(function (x) { return '$' + x + ' = ' + ML.factorTex(x) + '$'; }).join(', ') + '.', 'El máximo común divisor es $' + d.L + '$.', 'La clave mide ' + d.L + ' (o un divisor de ' + d.L + ', que el índice de coincidencia descartaría).']; },
    answer: function (d) { return String(d.L); }
  });

  p.exercise({
    title: 'El índice de coincidencia',
    level: 'medio',
    gen: function (r) {
      var letras = r.sample(CR.ABC.split(''), 4), cuentas = [r.int(4, 9), r.int(3, 7), r.int(2, 5), r.int(1, 4)], N = 0, s = 0;
      for (var i = 0; i < 4; i++) { N += cuentas[i]; s += cuentas[i] * (cuentas[i] - 1); }
      return { letras: letras, cuentas: cuentas, N: N, s: s, ic: s / (N * (N - 1)) };
    },
    ask: function (d) { return 'Un texto corto tiene ' + d.N + ' letras: ' + d.letras.map(function (l, i) { return d.cuentas[i] + ' ' + l; }).join(', ') + ', y ninguna otra. Calcula su índice de coincidencia. (tres decimales)'; },
    fields: [{ name: 'ic', label: 'IC', w: 'tiny' }],
    sol: function (d) { return { ic: d.ic }; },
    dec: 3,
    errores: [{ si: function (v, d) { var mal = 0; for (var i = 0; i < 4; i++) mal += d.cuentas[i] * d.cuentas[i]; mal /= d.N * d.N; return Math.abs(v.ic - mal) < 5e-4 && Math.abs(d.ic - mal) > 2e-3; }, msg: 'Has usado $n^2$ y $N^2$. Al sacar dos letras <em>distintas</em> del texto, la segunda tiene una opción menos: $n(n-1)$ y $N(N-1)$.' }],
    hint: function () { return ['Numerador: suma de $n_\\ell\\,(n_\\ell - 1)$ para cada letra.', 'Denominador: $N\\,(N - 1)$.']; },
    steps: function (d) { return ['Numerador: ' + d.cuentas.map(function (c) { return c + '\\cdot ' + (c - 1); }).join(' + ').replace(/^/, '$') + ' = ' + d.s + '$.', 'Denominador: $' + d.N + '\\cdot ' + (d.N - 1) + ' = ' + (d.N * (d.N - 1)) + '$.', '$\\text{IC} = ' + U.fmt(d.ic, 3) + '$: ' + (d.ic > 0.06 ? 'alto, como un idioma con letras muy repetidas.' : 'bajo, como letras repartidas casi al azar.')]; },
    answer: function (d) { return U.fmt(d.ic, 3); }
  });

  p.exercise({
    title: 'La clave, columna a columna',
    level: 'avanzado',
    gen: function (r) {
      var k = r.pick(CLAVES), mas = [];
      for (var i = 0; i < k.length; i++) mas.push(CR.letra(CR.num(k.charAt(i)) + 4));
      return { k: k, mas: mas, L: k.length };
    },
    ask: function (d) { return 'Kasiski dice que la clave de un Vigenère tiene ' + d.L + ' letras. Separado el cifrado en ' + d.L + ' columnas, la letra más frecuente de cada columna es, por orden, ' + d.mas.join(', ') + '. Suponiendo que en cada columna esa letra es la E del castellano, ¿cuál es la clave?'; },
    fields: [{ name: 'k', label: 'clave', w: 'wide' }],
    sol: function (d) { return { k: d.k }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.k);
      if (!t) return { ok: false, msg: 'Escribe la clave.' };
      if (t === d.k) return { ok: true };
      if (t === d.mas.join('')) return { ok: false, msg: 'Esas son las letras más frecuentes, no la clave. La clave es lo que se sumó a la E para llegar a ellas: resta 4 a cada una.' };
      if (t === d.mas.map(function (l) { return CR.letra(4 - CR.num(l)); }).join('')) return { ok: false, msg: 'Has restado al revés: la clave es la letra frecuente menos la E, no la E menos la letra.' };
      return { ok: false, msg: 'No es esa. En cada columna, la letra de la clave es la más frecuente menos 4 (la E), módulo 26.' };
    },
    hint: function () { return 'Cada columna es un César cuya E ha ido a parar a la letra más frecuente: la clave de esa columna es su número menos 4.'; },
    steps: function (d) { return d.mas.map(function (l, i) { return l + ' = ' + CR.num(l) + ': $' + CR.num(l) + ' - 4 = ' + (CR.num(l) - 4) + (CR.num(l) - 4 < 0 ? ' \\equiv ' + CR.mod(CR.num(l) - 4, 26) : '') + '$ → ' + d.k.charAt(i); }).concat(['La clave es <strong>' + d.k + '</strong>.']); },
    answer: function (d) { return d.k; }
  });

  p.keys([
    'Vigenère: $c_i = (m_i + k_{i \\bmod L}) \\bmod 26$, la clave repetida bajo el mensaje. La misma letra se cifra de $L$ maneras.',
    'Las frecuencias del cifrado entero se aplanan, pero cada columna, tomada de $L$ en $L$, es un César.',
    'Índice de coincidencia: $\\sum n(n-1) / (N(N-1))$; castellano $\\approx 0{,}075$, azar $\\approx 0{,}038$. La longitud buena de columnas devuelve el IC alto.',
    'Kasiski: las repeticiones del cifrado están a distancias múltiplo de $L$; su mcd da la longitud.',
    'Lo que protege a Vigenère es la longitud de la clave frente a la del mensaje; ese camino lleva a la libreta de un solo uso.'
  ]);
});
