/* Tema: Enigma: permutaciones que giran */
Course.topic('cr-enigma', function (p) {

  p.puente('La [[cr-transposicion|transposición]] presentó las permutaciones como claves y ' +
    '[[cr-vigenere|Vigenère]] enseñó que varios alfabetos que se turnan aplanan las frecuencias. ' +
    'Enigma junta las dos cosas en una máquina: permutaciones que se componen y que giran a cada ' +
    'letra, con la [[av-grupos|teoría de grupos]] detrás. Y se rompió con esa misma teoría.');

  p.text('Enigma era una máquina de escribir con bombillas. Se pulsaba una letra, una corriente ' +
    'atravesaba un tablero de clavijas, tres rotores cableados, un reflector, otra vez los tres ' +
    'rotores y el tablero, y se encendía la bombilla de la letra cifrada. Después de cada letra, un ' +
    'rotor giraba una posición. Era, en efecto, un Vigenère con un alfabeto distinto para cada letra y ' +
    'un periodo de $26^3 = 17\\,576$: el análisis de frecuencias no tenía nada que contar.');

  /* ---------------------------------------------------------------- */
  p.section('Un rotor es una permutación, y girarlo la conjuga');

  p.text('Cada rotor es un disco con 26 contactos a cada lado, unidos por cables en un orden fijo: una ' +
    'permutación $\\rho$ de las 26 letras. Si el rotor no girase, la máquina sería una sustitución ' +
    'fija. Pero gira: en la posición $i$, la señal entra $i$ contactos más arriba y sale $i$ más ' +
    'abajo. En el lenguaje de los [[av-grupos|grupos]], el rotor en la posición $i$ es el ' +
    '<strong>conjugado</strong> de $\\rho$ por el desplazamiento $\\sigma$ (la permutación que manda ' +
    'cada letra a la siguiente):');

  p.formula('\\rho_i = \\sigma^{-i}\\,\\rho\\,\\sigma^{i}, \\qquad E = P^{-1}\\rho_{3}^{-1}\\rho_{2}^{-1}\\rho_{1}^{-1}\\,U\\,\\rho_{1}\\rho_{2}\\rho_{3}\\,P',
    'la permutación de Enigma en una posición',
    'Se lee: <em>«ro sub i es sigma a la menos i, por ro, por sigma a la i»</em>: subir $i$ letras, ' +
    'pasar por el cableado, bajar $i$ letras.<br><br>La segunda fórmula es la máquina entera: el ' +
    'tablero de clavijas $P$, los tres rotores, el reflector $U$, y vuelta por los mismos rotores al ' +
    'revés y por el tablero. Se lee de derecha a izquierda, porque la señal entra por $P$. Cada ' +
    'letra pulsada cambia los $i$, así que $E$ cambia a cada letra.');

  p.demo({
    title: 'La máquina',
    intro: 'Una Enigma I con sus rotores reales. Elige el orden de los rotores, la posición inicial de tres letras y el tablero de clavijas (parejas como AB CD). Escribe el mensaje y sigue el camino de la última letra por la máquina. Para descifrar, pon los mismos ajustes y escribe el cifrado.',
    predice: 'Escribe AAAAA con los ajustes iniciales. Las cinco A dan cinco letras distintas: ¿saldrá alguna vez una A? Prueba después con cualquier ajuste.',
    build: function (host) {
      var orden = 'I II III', pos = 'AAA', clav = '', msg = 'ATAQUE AL AMANECER';
      var out = W.mono(host, '');
      function pinta() {
        var o = { rotores: orden.split(' '), posiciones: (CR.limpia(pos) + 'AAA').slice(0, 3), clavijas: clav };
        var e = CR.enigma(o), res = e.cifra(msg), t = CR.limpia(msg), h = '';
        h += '<b>rotores:</b> ' + orden + '   <b>posición inicial:</b> ' + o.posiciones + '   <b>clavijas:</b> ' + (CR.limpia(clav, true) || 'ninguna') + '\n';
        h += '<b>mensaje:</b> ' + t + '\n<b>cifrado:</b> ' + res.salida + '\n';
        if (res.traza.length) {
          var u = res.traza[res.traza.length - 1];
          h += '\n<span class="cr-tenue">camino de la última letra, con los rotores en ' + u.posiciones + ':</span>\n' +
            u.entrada + ' →clavijas→ ' + u.clavija1 + ' →rotor der.→ ' + u.r3 + ' →medio→ ' + u.r2 + ' →izq.→ ' + u.r1 + ' →reflector→ ' + u.reflector + ' →izq.→ ' + u.r1b + ' →medio→ ' + u.r2b + ' →der.→ ' + u.r3b + ' →clavijas→ <b>' + u.salida + '</b>';
        }
        var otra = CR.enigma(o).cifra(res.salida).salida;
        h += '\n<span class="cr-tenue">con los mismos ajustes, el cifrado descifrado da: ' + otra + (otra === t ? ' ✓' : '') + '</span>';
        out.set(h);
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 60, on: function (v) { msg = v; pinta(); } });
      W.chips(host, ['I II III', 'III I II', 'II V IV', 'IV I V'], { value: orden, on: function (v) { orden = v; pinta(); } });
      W.texto(host, { label: 'posición inicial', value: pos, max: 3, corto: true, on: function (v) { pos = v; pinta(); } });
      W.texto(host, { label: 'clavijas', value: clav, max: 30, corto: true, on: function (v) { clav = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El reflector: la comodidad que fue una grieta');

  p.text('El reflector $U$ une los contactos de dos en dos: la A con la Y, la B con la R… Es una ' +
    'permutación que es su propia inversa, sin ningún punto fijo. Y como la señal vuelve por los ' +
    'mismos rotores al revés, la máquina entera cumple $E^{-1} = E$: si la A se cifra como Q, la Q ' +
    'se cifra como A, con los mismos ajustes. Eso era comodísimo: descifrar era teclear el cifrado. ' +
    'Pero tenía una consecuencia matemática que los diseñadores pasaron por alto: <strong>ninguna ' +
    'letra puede cifrarse como ella misma</strong>. Si $E(x) = x$, la corriente tendría que ' +
    'atravesar el reflector y volver por el mismo camino, y el reflector no une ningún contacto ' +
    'consigo mismo.');

  p.comprueba('Un criptoanalista sospecha que un mensaje de Enigma empieza por WETTERBERICHT, el parte meteorológico. El cifrado empieza por QFZWRWIVTYRES. ¿Puede ser?', [
    { t: 'Sí: ninguna letra del cifrado coincide con la de la misma posición en WETTERBERICHT', ok: true, por: 'La regla es que ninguna letra se cifra como sí misma. Si en alguna posición coincidieran, la hipótesis sería imposible; aquí no coincide ninguna, así que es compatible. Eso no la demuestra, pero deslizando la palabra por el cifrado, las posiciones imposibles se descartan al instante.' },
    { t: 'No: la probabilidad de que trece letras no coincidan es demasiado baja', ok: false, por: 'Al revés: con Enigma la probabilidad de que coincidan es cero. Que no coincida ninguna es exactamente lo que se espera de una hipótesis correcta.' },
    { t: 'No se puede saber nada sin la clave', ok: false, por: 'Sin la clave no se lee, pero sí se descarta: cualquier alineación con una coincidencia es imposible. Esa fue una de las herramientas de Bletchley Park.' }
  ]);

  p.text('Esa restricción fue la palanca de los cribs: los alemanes enviaban partes meteorológicos y ' +
    'fórmulas fijas, y un texto probable colocado bajo el cifrado, sin ninguna coincidencia letra ' +
    'a letra, daba un puñado de ecuaciones sobre los ajustes de la máquina. La <em>bomba</em> de ' +
    'Turing y Welchman era un aparato que probaba las 17 576 posiciones de los rotores contra esas ' +
    'ecuaciones en unos veinte minutos.');

  /* ---------------------------------------------------------------- */
  p.section('Rejewski: los ciclos no cambian con las clavijas');

  p.text('Antes de la bomba hubo una idea aún más elegante. En los años treinta, cada mensaje empezaba ' +
    'con la clave del mensaje cifrada <strong>dos veces</strong>: seis letras. Marian Rejewski se ' +
    'dio cuenta de que la letra 1 y la letra 4 eran la misma letra del original cifrada en dos ' +
    'posiciones distintas, así que componiendo las dos permutaciones se obtenía una permutación ' +
    'conocida, y tras unos cuantos mensajes del día, entera. Y esa permutación tenía una propiedad ' +
    'que no dependía del tablero de clavijas: <strong>las longitudes de sus ciclos</strong>.');

  p.formula('\\text{si } \\tau = P^{-1}\\,\\pi\\,P, \\text{ entonces } \\tau \\text{ y } \\pi \\text{ tienen los mismos ciclos}',
    'conjugar conserva la estructura de ciclos',
    'Se lee: <em>«si tau es el conjugado de pi por pe, tau y pi tienen la misma estructura de ' +
    'ciclos»</em>. Conjugar por $P$ es solo cambiar los nombres de las letras: un ciclo de longitud 5 ' +
    'sigue siendo un ciclo de longitud 5 con otras letras.<br><br>El tablero de clavijas, con sus ' +
    'cientos de billones de posibilidades, era una conjugación. Rejewski lo apartó de un plumazo: ' +
    'las longitudes de los ciclos dependían solo del orden y la posición de los rotores, $6\\cdot ' +
    '17\\,576 = 105\\,456$ casos. Los catalogó todos con una máquina, el ciclómetro, y el catálogo ' +
    'devolvía la clave del día en minutos.');

  p.demo({
    title: 'Los ciclos sobreviven a las clavijas',
    intro: 'Una permutación al azar de las 26 letras, y la misma conjugada por un tablero de clavijas al azar. Las letras cambian; las longitudes de los ciclos, no. Es la «característica» que Rejewski catalogó.',
    predice: 'Si la permutación tiene ciclos de longitudes 10, 10, 3, 3, ¿qué longitudes tendrá tras conjugarla por cualquier tablero de clavijas?',
    build: function (host) {
      var r = U.rng(11), out = W.mono(host, '');
      function ciclos(perm) {
        var visto = [], res = [];
        for (var i = 0; i < 26; i++) {
          if (visto[i]) continue;
          var c = [], j = i;
          while (!visto[j]) { visto[j] = true; c.push(CR.ABC.charAt(j)); j = perm[j]; }
          res.push(c);
        }
        return res.sort(function (a, b) { return b.length - a.length; });
      }
      function pinta() {
        var perm = r.shuffle(CR.ABC.split('').map(function (_, i) { return i; }));
        var letras = r.shuffle(CR.ABC.split('')), P = [], i;
        for (i = 0; i < 26; i++) P[i] = i;
        for (i = 0; i + 1 < 20; i += 2) { P[CR.num(letras[i])] = CR.num(letras[i + 1]); P[CR.num(letras[i + 1])] = CR.num(letras[i]); }
        var conj = [];
        for (i = 0; i < 26; i++) conj[i] = P[perm[P[i]]];   // P^-1 = P: es una involucion
        var c1 = ciclos(perm), c2 = ciclos(conj);
        out.set('<b>π:</b>  ' + c1.map(function (c) { return '(' + c.join('') + ')'; }).join(' ') + '\n     longitudes ' + c1.map(function (c) { return c.length; }).join(' + ') +
          '\n\n<b>clavijas P:</b> ' + (function () { var s = []; for (var k = 0; k < 20; k += 2) s.push(letras[k] + letras[k + 1]); return s.join(' '); })() +
          '\n\n<b>P⁻¹πP:</b> ' + c2.map(function (c) { return '(' + c.join('') + ')'; }).join(' ') + '\n     longitudes ' + c2.map(function (c) { return c.length; }).join(' + ') + '  <span class="cr-ok">las mismas</span>');
      }
      W.buttons(host, [{ t: 'Otra permutación y otras clavijas', cls: 'btn--main', on: pinta }]);
      pinta();
    }
  });

  p.ejemplo({
    title: 'Componer dos rotores pequeños',
    enunciado: 'Con un alfabeto de seis letras, un rotor cableado como $\\rho$: A→C, B→F, C→A, D→E, E→B, F→D, en la posición 0. Calcular a dónde va la B si pasa primero por $\\rho$ y después por el desplazamiento $\\sigma$ (cada letra a la siguiente), y hallar los ciclos de $\\rho$.',
    pasos: [
      { t: '<strong>Componer.</strong> La B entra en $\\rho$ y sale como F; la F entra en $\\sigma$ y sale como la siguiente, que al pasar de la última vuelve al principio: A. Así que $\\sigma\\rho(B) = A$.', antes: 'Primero $\\rho$, después $\\sigma$. ¿Qué sale de la F al desplazarla?' },
      { t: '<strong>El orden importa.</strong> Al revés, $\\rho\\sigma(B)$: la B se desplaza a C, y $\\rho(C) = A$. Aquí coincide, pero con la D no: $\\sigma\\rho(D) = \\sigma(E) = F$ y $\\rho\\sigma(D) = \\rho(E) = B$. Las permutaciones no conmutan, y por eso la fórmula de Enigma tiene un orden.', antes: 'Prueba con la D en los dos órdenes.' },
      { t: '<strong>Los ciclos de $\\rho$.</strong> A→C→A: un ciclo de longitud 2. B→F→D→E→B: un ciclo de longitud 4. Estructura: $2 + 4$.', antes: 'Sigue las flechas desde la A hasta volver a la A; luego desde la B.' },
      { t: '<strong>Conjugar.</strong> Si se renombran las letras intercambiando A y B, el ciclo (AC) pasa a (BC) y el (BFDE) a (AFDE): las longitudes siguen siendo $2 + 4$. Eso es lo que Rejewski explotó.' }
    ],
    cierre: 'Toda la matemática de Enigma es esta, con 26 letras en vez de 6: componer permutaciones, conjugarlas por un desplazamiento y mirar sus ciclos.'
  });

  p.text('Las cuentas del espacio de claves de la Enigma militar dan idea de a qué se enfrentaban: ' +
    '$60$ órdenes de tres rotores elegidos entre cinco, $17\\,576$ posiciones iniciales, $676$ ' +
    'ajustes de anillo que cuentan, y unos $1{,}5\\cdot 10^{14}$ tableros de diez parejas. En total, ' +
    'alrededor de $10^{23}$ claves. La fuerza bruta era impensable; se rompió reduciendo el problema, ' +
    'primero con los ciclos y después con los cribs.');

  p.util('Las máquinas de rotores se usaron hasta los años setenta, y la lección de diseño de Enigma ' +
    'se cita todavía: una característica añadida por comodidad, el reflector, introdujo una ' +
    'regularidad matemática que el enemigo explotó. Es el mismo tipo de error que se sigue ' +
    'cometiendo con protocolos modernos, y por eso los cifrados actuales se someten a años de ' +
    'ataques públicos antes de usarse. Y la bomba de Turing es, en cierto modo, el primer ordenador ' +
    'dedicado a un problema de búsqueda.');

  p.hist('Arthur Scherbius patentó Enigma en 1918 y la vendió a bancos y ejércitos. Marian Rejewski, ' +
    'un matemático de 27 años de la Oficina de Cifras polaca, reconstruyó el cableado de los ' +
    'rotores a finales de 1932 con teoría de grupos y unos documentos comprados a un espía, y con ' +
    'Jerzy Różycki y Henryk Zygalski leyó el tráfico alemán durante años. En julio de 1939, semanas ' +
    'antes de la invasión, entregaron todo a franceses y británicos. En Bletchley Park, Alan Turing ' +
    'y Gordon Welchman diseñaron la bomba en 1940, y el descifrado de Enigma, llamado Ultra, ' +
    'acortó la guerra según los historiadores en dos años o más.');

  p.trampas([
    { e: 'Creer que $10^{23}$ claves hacían a Enigma irrompible', por: 'No se probaron claves: se redujo el problema. Las clavijas desaparecen al mirar ciclos, y quedan $105\\,456$ casos, que se catalogan.' },
    { e: 'Componer permutaciones en cualquier orden', por: '$\\sigma\\rho \\ne \\rho\\sigma$ en general: la señal atraviesa la máquina en un orden concreto, y la fórmula se lee de derecha a izquierda.' },
    { e: 'Pensar que cifrar igual que descifrar es una ventaja sin coste', por: 'Esa simetría, $E = E^{-1}$ sin puntos fijos, es la que prohíbe que una letra se cifre como sí misma, y con eso se alineaban los cribs.' },
    { e: 'Olvidar el paso del rotor', por: 'Con los rotores quietos, Enigma es una sustitución fija y cae con frecuencias. Toda su fuerza está en que la permutación cambia a cada letra.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var SEIS = 'ABCDEF';
  function permAzar(r) { return r.shuffle([0, 1, 2, 3, 4, 5]); }
  function txt(perm) { return perm.map(function (v, i) { return SEIS.charAt(i) + '→' + SEIS.charAt(v); }).join(', '); }

  p.exercise({
    title: 'Componer dos permutaciones',
    level: 'basico',
    gen: function (r) { var a = permAzar(r), b = permAzar(r), x = r.int(0, 5); return { a: a, b: b, x: x, y: b[a[x]], z: a[b[x]] }; },
    ask: function (d) { return 'Con seis letras, $\\rho$: ' + txt(d.a) + '. Y $\\sigma$: ' + txt(d.b) + '. ¿A dónde va la <strong>' + SEIS.charAt(d.x) + '</strong> si pasa primero por $\\rho$ y después por $\\sigma$?'; },
    fields: [{ name: 'l', label: 'letra', w: 'tiny' }],
    sol: function (d) { return { l: SEIS.charAt(d.y) }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.l);
      if (t.length !== 1) return { ok: false, msg: 'Una sola letra.' };
      if (t === SEIS.charAt(d.y)) return { ok: true };
      if (t === SEIS.charAt(d.z) && d.z !== d.y) return { ok: false, msg: 'Has aplicado primero $\\sigma$ y después $\\rho$. El orden importa: primero $\\rho$.' };
      return { ok: false, msg: 'No es esa. Busca la ' + SEIS.charAt(d.x) + ' en $\\rho$, y lo que salga búscalo en $\\sigma$.' };
    },
    hint: function (d) { return '$\\rho(' + SEIS.charAt(d.x) + ') = ' + SEIS.charAt(d.a[d.x]) + '$. Ahora busca esa letra en $\\sigma$.'; },
    steps: function (d) { return ['$\\rho(' + SEIS.charAt(d.x) + ') = ' + SEIS.charAt(d.a[d.x]) + '$.', '$\\sigma(' + SEIS.charAt(d.a[d.x]) + ') = ' + SEIS.charAt(d.y) + '$.', 'Así que $\\sigma\\rho(' + SEIS.charAt(d.x) + ') = ' + SEIS.charAt(d.y) + '$' + (d.z !== d.y ? '; en el otro orden habría dado ' + SEIS.charAt(d.z) + '.' : '.')]; },
    answer: function (d) { return SEIS.charAt(d.y); }
  });

  p.exercise({
    title: 'Un rotor girado',
    level: 'medio',
    gen: function (r) { var a = permAzar(r), i = r.int(1, 5), x = r.int(0, 5); var y = CR.mod(a[(x + i) % 6] - i, 6); return { a: a, i: i, x: x, y: y, sinBajar: a[(x + i) % 6] }; },
    ask: function (d) { return 'Un rotor de seis contactos tiene el cableado $\\rho$: ' + txt(d.a) + '. Está girado ' + d.i + ' ' + (d.i === 1 ? 'posición' : 'posiciones') + ': la señal entra ' + d.i + ' contactos más arriba (sumando ' + d.i + ' módulo 6), pasa por el cableado y sale ' + d.i + ' más abajo (restando ' + d.i + '). ¿En qué letra sale la <strong>' + SEIS.charAt(d.x) + '</strong>?'; },
    fields: [{ name: 'l', label: 'letra', w: 'tiny' }],
    sol: function (d) { return { l: SEIS.charAt(d.y) }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.l);
      if (t.length !== 1) return { ok: false, msg: 'Una sola letra.' };
      if (t === SEIS.charAt(d.y)) return { ok: true };
      if (t === SEIS.charAt(d.sinBajar) && d.sinBajar !== d.y) return { ok: false, msg: 'Falta el último paso: al salir del rotor la señal baja ' + d.i + ' posiciones.' };
      return { ok: false, msg: 'No es esa. Suma ' + d.i + ' módulo 6, aplica $\\rho$, resta ' + d.i + ' módulo 6.' };
    },
    hint: function (d) { return SEIS.charAt(d.x) + ' es el ' + d.x + '; sube a ' + ((d.x + d.i) % 6) + ', que es la ' + SEIS.charAt((d.x + d.i) % 6) + '. Aplica $\\rho$ y baja ' + d.i + '.'; },
    steps: function (d) { return ['Sube: $' + d.x + ' + ' + d.i + ' \\equiv ' + ((d.x + d.i) % 6) + '$, la ' + SEIS.charAt((d.x + d.i) % 6) + '.', '$\\rho(' + SEIS.charAt((d.x + d.i) % 6) + ') = ' + SEIS.charAt(d.sinBajar) + '$, el ' + d.sinBajar + '.', 'Baja: $' + d.sinBajar + ' - ' + d.i + ' \\equiv ' + d.y + '$, la <strong>' + SEIS.charAt(d.y) + '</strong>. Es $\\sigma^{-' + d.i + '}\\rho\\,\\sigma^{' + d.i + '}$ aplicado a la ' + SEIS.charAt(d.x) + '.']; },
    answer: function (d) { return SEIS.charAt(d.y); }
  });

  p.exercise({
    title: 'Contar tableros de clavijas',
    level: 'medio',
    gen: function (r) { var k = r.int(1, 4); var v = ML.comb(26, 2 * k) * ML.factorial(2 * k) / (ML.factorial(k) * Math.pow(2, k)); return { k: k, v: Math.round(v) }; },
    ask: function (d) { return '¿De cuántas maneras se pueden conectar ' + d.k + ' ' + (d.k === 1 ? 'cable' : 'cables') + ' en el tablero de clavijas de Enigma? Cada cable une dos letras distintas, ninguna letra lleva dos cables, y ni el orden de los cables ni el de los extremos importa.'; },
    fields: [{ name: 'v', label: 'tableros', w: 'wide' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{ si: function (v, d) { return d.k > 1 && v.v === Math.round(d.v * ML.factorial(d.k)); }, msg: 'Has contado los cables como si fueran distinguibles. Da igual cuál es «el primero»: divide entre $k!$.' }],
    hint: function () { return ['Elige las $2k$ letras que llevan cable, y después empareja esas $2k$ letras.', 'Parejas de $2k$ letras: $(2k)! / (k!\\,2^k)$.']; },
    steps: function (d) { return ['Letras con cable: $\\binom{26}{' + (2 * d.k) + '} = ' + U.miles(Math.round(ML.comb(26, 2 * d.k))) + '$.', 'Formas de emparejarlas: $' + (2 * d.k) + '! / (' + d.k + '!\\cdot 2^{' + d.k + '}) = ' + U.miles(Math.round(ML.factorial(2 * d.k) / (ML.factorial(d.k) * Math.pow(2, d.k)))) + '$.', 'Producto: $' + U.miles(d.v) + '$ tableros. Con diez cables son unos $1{,}5\\cdot 10^{14}$, y Rejewski los neutralizó todos a la vez.']; },
    answer: function (d) { return U.miles(d.v); }
  });

  p.exercise({
    title: 'Los ciclos de una permutación',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(7, 9), perm = r.shuffle(CR.ABC.slice(0, n).split('').map(function (_, i) { return i; })), visto = [], longs = [];
      for (var i = 0; i < n; i++) { if (visto[i]) continue; var l = 0, j = i; while (!visto[j]) { visto[j] = true; l++; j = perm[j]; } longs.push(l); }
      longs.sort(function (a, b) { return b - a; });
      return { n: n, perm: perm, longs: longs };
    },
    ask: function (d) { return 'Una permutación de ' + d.n + ' letras: ' + d.perm.map(function (v, i) { return CR.ABC.charAt(i) + '→' + CR.ABC.charAt(v); }).join(', ') + '. Escribe las longitudes de sus ciclos, de mayor a menor, separadas por espacios (un ciclo de una letra que va a sí misma cuenta como longitud 1).'; },
    fields: [{ name: 'c', label: 'longitudes', w: 'wide' }],
    sol: function (d) { return { c: d.longs.join(' ') }; },
    check: function (v, d) {
      var nums = (String(v.raw.c || '').match(/\d+/g) || []).map(Number).sort(function (a, b) { return b - a; });
      if (!nums.length) return { ok: false, msg: 'Escribe las longitudes.' };
      if (nums.join(' ') === d.longs.join(' ')) return { ok: true };
      var suma = nums.reduce(function (a, b) { return a + b; }, 0);
      if (suma !== d.n) return { ok: false, msg: 'Las longitudes tienen que sumar ' + d.n + ': cada letra está en exactamente un ciclo.' };
      return { ok: false, msg: 'Suman bien pero no son esas. Sigue las flechas desde una letra hasta volver a ella, y empieza otro ciclo con la primera letra que no hayas visitado.' };
    },
    hint: function () { return 'Desde la A sigue las flechas hasta volver a la A: ese es el primer ciclo. Repite con la primera letra sin visitar.'; },
    steps: function (d) {
      var visto = [], cs = [];
      for (var i = 0; i < d.n; i++) { if (visto[i]) continue; var c = [], j = i; while (!visto[j]) { visto[j] = true; c.push(CR.ABC.charAt(j)); j = d.perm[j]; } cs.push('(' + c.join('') + ')'); }
      return ['Ciclos: ' + cs.join(' ') + '.', 'Longitudes: <strong>' + d.longs.join(' ') + '</strong>.', 'Conjugada por cualquier tablero de clavijas, tendría estas mismas longitudes con otras letras.'];
    },
    answer: function (d) { return d.longs.join(' '); }
  });

  p.exercise({
    title: 'Dónde puede ir el crib',
    level: 'avanzado',
    gen: function (r) {
      var crib = r.pick(['WETTER', 'BERICHT', 'KEINE', 'ANGRIFF', 'OBERST']), n = 14, cif = '';
      for (var i = 0; i < n; i++) cif += CR.letra(r.int(0, 25));
      var posibles = [];
      for (var k = 0; k + crib.length <= n; k++) { var ok = true; for (var j = 0; j < crib.length; j++) if (cif.charAt(k + j) === crib.charAt(j)) { ok = false; break; } if (ok) posibles.push(k + 1); }
      if (posibles.length === n - crib.length + 1 || posibles.length === 0) return null;
      return { crib: crib, cif: cif, posibles: posibles, total: n - crib.length + 1 };
    },
    ask: function (d) { return 'Un cifrado de Enigma es <strong>' + d.cif + '</strong> y se sospecha que contiene la palabra <strong>' + d.crib + '</strong>. Como Enigma nunca cifra una letra como sí misma, algunas posiciones son imposibles. ¿En cuántas posiciones distintas (empezando en la letra 1, 2, …) puede estar el crib?'; },
    fields: [{ name: 'n', label: 'posiciones posibles', w: 'tiny' }],
    sol: function (d) { return { n: d.posibles.length }; },
    errores: [{ si: function (v, d) { return v.n === d.total; }, msg: 'Esas son todas las posiciones en las que cabe. Hay que descartar aquellas en las que alguna letra del crib coincide con la del cifrado justo debajo.' }],
    hint: function (d) { return 'Desliza ' + d.crib + ' por el cifrado, empezando en cada letra. Si en alguna columna la letra del crib y la del cifrado son iguales, esa posición es imposible.'; },
    steps: function (d) { return ['Posiciones en las que cabe: de la 1 a la ' + d.total + '.', 'Sin ninguna coincidencia letra a letra: las posiciones ' + d.posibles.join(', ') + '.', 'Son <strong>' + d.posibles.length + '</strong>. Cada una da un sistema de ecuaciones distinto para la bomba.']; },
    answer: function (d) { return String(d.posibles.length); }
  });

  p.keys([
    'Un rotor es una permutación $\\rho$; girado $i$ posiciones es el conjugado $\\sigma^{-i}\\rho\\,\\sigma^i$. La máquina compone clavijas, rotores, reflector y vuelta.',
    'El reflector hace $E = E^{-1}$: descifrar es teclear el cifrado. A cambio, ninguna letra se cifra como sí misma, y eso alinea los cribs.',
    'Conjugar conserva las longitudes de los ciclos: el tablero de clavijas, con $10^{14}$ posibilidades, desaparece del problema. Rejewski catalogó los $105\\,456$ casos restantes.',
    'Las permutaciones no conmutan: el orden en que se componen es el orden en que la señal atraviesa la máquina.',
    'Enigma se rompió con matemáticas y cribs, no con fuerza bruta: $10^{23}$ claves no sirvieron de nada.'
  ]);
});
