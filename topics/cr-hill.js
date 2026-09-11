/* Tema: El cifrado de Hill: matrices modulo 26 */
Course.topic('cr-hill', function (p) {

  p.puente('El [[cr-afin|afín]] multiplicaba cada letra por un número. Este tema multiplica pares de letras ' +
    'por una [[al-matrices|matriz]], y la condición para descifrar es la misma que tenía la ' +
    '[[al-inversa|matriz inversa]] en álgebra, con un giro: el determinante no tiene que ser distinto ' +
    'de cero, sino tener inverso módulo 26.');

  p.text('Todos los cifrados anteriores trataban cada letra por separado, y por eso el análisis de ' +
    'frecuencias los alcanzaba. En 1929 Lester Hill propuso cifrar <strong>varias letras a la vez</strong>: ' +
    'un par de letras es un vector de dos números, y multiplicarlo por una matriz mezcla los dos. ' +
    'Cambiar una letra del mensaje cambia las dos del cifrado. A esa propiedad, que aquí aparece ' +
    'por primera vez, se le llamará <em>difusión</em>, y es una de las dos ideas que sostienen los ' +
    'cifrados modernos.');

  /* ---------------------------------------------------------------- */
  p.section('Dos letras a la vez');

  p.formula('\\begin{pmatrix} y_1 \\\\ y_2 \\end{pmatrix} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix} \\pmod{26}',
    'el cifrado de Hill de tamaño 2',
    'Se lee: <em>«el vector y es la matriz clave por el vector x, módulo 26»</em>. Es decir, ' +
    '$y_1 = a x_1 + b x_2$ e $y_2 = c x_1 + d x_2$, reducidos módulo 26.<br><br>Cada letra del cifrado ' +
    'depende de las dos del mensaje. Con matrices $3\\times 3$ se cifran tríos, y así en adelante.');

  p.demo({
    title: 'La matriz clave',
    intro: 'El mensaje se parte en pares y cada par se multiplica por la matriz. Mueve una entrada y mira cómo cambian las dos letras de cada par. Si el determinante no tiene inverso módulo 26, el cifrado no se puede deshacer y la demo lo avisa.',
    predice: 'Cambia solo la primera letra del mensaje. ¿Cuántas letras del cifrado cambiarán: una, dos o todas?',
    build: function (host) {
      var K = [[3, 3], [2, 5]], msg = 'HELP ME';
      var out = W.mono(host, '');
      function pinta() {
        var t = CR.limpia(msg); if (t.length % 2) t += 'X';
        var c = CR.hill(t, K), det = CR.mod(K[0][0] * K[1][1] - K[0][1] * K[1][0], 26), inv = CR.inv(det, 26);
        var pares = [];
        for (var i = 0; i < t.length; i += 2) pares.push(t.substr(i, 2) + '→' + c.substr(i, 2));
        out.set('<b>K =</b> [' + K[0].join(' ') + '; ' + K[1].join(' ') + ']   det = ' + det + ' (mod 26)\n<b>pares:</b> ' + pares.join('  ') + '\n<b>cifrado:</b> ' + c + '\n' +
          (inv === null ? '<span class="cr-dif">mcd(' + det + ', 26) ≠ 1: la matriz no tiene inversa módulo 26. Dos pares distintos pueden dar el mismo cifrado.</span>' : '<span class="cr-ok">det tiene inverso (' + inv + '): se puede descifrar.</span>'));
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 30, on: function (v) { msg = v; pinta(); } });
      var fila = W.row(host);
      [[0, 0, 'a'], [0, 1, 'b'], [1, 0, 'c'], [1, 1, 'd']].forEach(function (e) {
        W.slider(fila, { label: e[2], min: 0, max: 25, step: 1, value: K[e[0]][e[1]], on: function (v) { K[e[0]][e[1]] = v; pinta(); } });
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cuándo se puede descifrar');

  p.text('Descifrar es multiplicar por la matriz inversa, y en álgebra la inversa existe cuando el ' +
    'determinante no es cero. Aquí hay que «dividir entre el determinante» módulo 26, y eso solo ' +
    'se puede si el determinante tiene inverso: si $\\operatorname{mcd}(\\det K, 26) = 1$.');

  p.formula('K^{-1} = (\\det K)^{-1} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} \\pmod{26}',
    'la inversa módulo 26',
    'Se lee: <em>«ka inversa es el inverso del determinante por la matriz adjunta»</em>. La adjunta de ' +
    'una $2\\times 2$ intercambia la diagonal y cambia de signo la otra, como en ' +
    '[[al-inversa|álgebra]]. La diferencia está en el $(\\det K)^{-1}$: no es $1/\\det K$, sino el ' +
    'inverso modular, el que se calcula con Euclides extendido. Y los signos negativos se ' +
    'convierten en restos: $-3 \\equiv 23$.');

  p.comprueba('Una matriz clave tiene determinante 4 módulo 26. ¿Sirve para cifrar con Hill?', [
    { t: 'No: $\\operatorname{mcd}(4, 26) = 2$, y 4 no tiene inverso módulo 26', ok: true, por: 'Sin inverso del determinante no hay matriz inversa, y sin ella hay pares de letras distintos que van al mismo cifrado. Benito no podría descifrar.' },
    { t: 'Sí: el determinante no es cero', ok: false, por: 'En los reales bastaría. Módulo 26 hace falta más: que el determinante no comparta factores con 26. Los determinantes pares y el 13 no valen.' },
    { t: 'Sí, si se cifra de tres en tres letras', ok: false, por: 'El tamaño del bloque no cambia la condición: la matriz, del tamaño que sea, tiene que tener determinante invertible módulo 26.' }
  ]);

  p.ejemplo({
    title: 'Cifrar HELP y volver',
    enunciado: 'Con la clave $K = \\begin{pmatrix} 3 & 3 \\\\ 2 & 5 \\end{pmatrix}$, cifrar HELP, calcular $K^{-1}$ módulo 26 y descifrar.',
    pasos: [
      { t: '<strong>Primer par.</strong> HE $= (7, 4)$: $y_1 = 3\\cdot 7 + 3\\cdot 4 = 33 \\equiv 7$, $y_2 = 2\\cdot 7 + 5\\cdot 4 = 34 \\equiv 8$. Es HI.', antes: 'Multiplica la matriz por el vector $(7, 4)$ y reduce.' },
      { t: '<strong>Segundo par.</strong> LP $= (11, 15)$: $y_1 = 33 + 45 = 78 \\equiv 0$, $y_2 = 22 + 75 = 97 \\equiv 19$. Es AT. Cifrado: <strong>HIAT</strong>.' },
      { t: '<strong>El determinante.</strong> $3\\cdot 5 - 3\\cdot 2 = 9$. $\\operatorname{mcd}(9, 26) = 1$, y su inverso es 3, porque $9\\cdot 3 = 27 \\equiv 1$.', antes: '¿Qué número multiplicado por 9 da resto 1 módulo 26?' },
      { t: '<strong>La inversa.</strong> Adjunta: $\\begin{pmatrix} 5 & -3 \\\\ -2 & 3 \\end{pmatrix}$. Por 3: $\\begin{pmatrix} 15 & -9 \\\\ -6 & 9 \\end{pmatrix} \\equiv \\begin{pmatrix} 15 & 17 \\\\ 20 & 9 \\end{pmatrix}$.', antes: 'Multiplica la adjunta por 3 y pasa los negativos a restos entre 0 y 25.' },
      { t: '<strong>Descifrar HI.</strong> $(7, 8)$: $15\\cdot 7 + 17\\cdot 8 = 241 \\equiv 7$, $20\\cdot 7 + 9\\cdot 8 = 212 \\equiv 4$. Es $(7, 4)$ = HE ✓.' }
    ],
    cierre: 'Son las cuentas de la matriz inversa de siempre, con dos cambios: el inverso del determinante es modular, y todo se reduce módulo 26.'
  });

  p.demo({
    title: 'La inversa, paso a paso',
    intro: 'Elige las cuatro entradas y mira el determinante, su inverso modular, la adjunta y la matriz inversa. Se comprueba multiplicando: $K\\,K^{-1}$ tiene que dar la identidad módulo 26.',
    predice: '¿Cuántos de los 26 determinantes posibles tienen inverso? Piensa en cuáles comparten factor con $26 = 2\\cdot 13$.',
    build: function (host) {
      var K = [[3, 3], [2, 5]];
      var out = W.readout(host, '');
      function pinta() {
        var det = CR.mod(K[0][0] * K[1][1] - K[0][1] * K[1][0], 26), inv = CR.inv(det, 26), h;
        h = '$\\det K = ' + K[0][0] + '\\cdot ' + K[1][1] + ' - ' + K[0][1] + '\\cdot ' + K[1][0] + ' = ' + (K[0][0] * K[1][1] - K[0][1] * K[1][0]) + ' \\equiv ' + det + ' \\pmod{26}$';
        if (inv === null) { out.set(h + '<br>$\\operatorname{mcd}(' + det + ', 26) = ' + ML.gcd(det, 26) + '$: sin inverso. <strong>Esta matriz no vale como clave.</strong>'); return; }
        var Ki = CR.hillInv(K);
        h += '<br>inverso del determinante: $' + det + '^{-1} \\equiv ' + inv + '$, porque $' + det + '\\cdot ' + inv + ' = ' + (det * inv) + ' \\equiv 1$';
        h += '<br>adjunta: $\\begin{pmatrix} ' + K[1][1] + ' & ' + (-K[0][1]) + ' \\\\ ' + (-K[1][0]) + ' & ' + K[0][0] + ' \\end{pmatrix}$, por $' + inv + '$: $K^{-1} = \\begin{pmatrix} ' + Ki[0][0] + ' & ' + Ki[0][1] + ' \\\\ ' + Ki[1][0] + ' & ' + Ki[1][1] + ' \\end{pmatrix}$';
        var P = [[CR.mod(K[0][0] * Ki[0][0] + K[0][1] * Ki[1][0], 26), CR.mod(K[0][0] * Ki[0][1] + K[0][1] * Ki[1][1], 26)], [CR.mod(K[1][0] * Ki[0][0] + K[1][1] * Ki[1][0], 26), CR.mod(K[1][0] * Ki[0][1] + K[1][1] * Ki[1][1], 26)]];
        h += '<br>comprobación: $K\\,K^{-1} = \\begin{pmatrix} ' + P[0][0] + ' & ' + P[0][1] + ' \\\\ ' + P[1][0] + ' & ' + P[1][1] + ' \\end{pmatrix}$ ✓';
        out.set(h);
      }
      var fila = W.row(host);
      [[0, 0, 'a'], [0, 1, 'b'], [1, 0, 'c'], [1, 1, 'd']].forEach(function (e) {
        W.slider(fila, { label: e[2], min: 0, max: 25, step: 1, value: K[e[0]][e[1]], on: function (v) { K[e[0]][e[1]] = v; pinta(); } });
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Difusión, y la grieta que queda');

  p.text('Con Hill, la E del mensaje ya no va siempre a la misma letra: depende de su vecina. Las ' +
    'frecuencias de letras sueltas se aplanan, como con Vigenère, pero por otro motivo: no porque ' +
    'la clave cambie, sino porque cada letra cifrada mezcla dos letras del mensaje. Eso es la ' +
    '<strong>difusión</strong>: repartir la influencia de cada letra entre varias.');

  p.text('La grieta es que el cifrado es <strong>lineal</strong>. Si Eva conoce dos pares del mensaje y ' +
    'sus cifrados, tiene cuatro ecuaciones con las cuatro incógnitas de la matriz, y las resuelve ' +
    'con la misma inversa modular: $K = Y X^{-1}$, donde $X$ tiene los dos pares del mensaje en ' +
    'columnas e $Y$ los del cifrado. Un ataque con texto conocido de cuatro letras rompe una clave ' +
    'de $26^4$ posibilidades. Los cifrados modernos aprenden de esto: mezclan, como Hill, pero ' +
    'meten en medio algo que <em>no</em> es lineal.');

  p.util('Multiplicar un bloque de datos por una matriz módulo algo es hoy una operación de cada día, no ' +
    'para ocultar sino para mezclar: el paso MixColumns de AES, que verás en su tema, es exactamente ' +
    'un Hill sobre columnas de cuatro bytes, con una aritmética distinta. Y los códigos correctores ' +
    'de errores que protegen un disco duro o una transmisión desde una sonda espacial multiplican ' +
    'los datos por una matriz por la misma razón: que cada símbolo que sale dependa de muchos que ' +
    'entran.');

  p.hist('Lester Hill, profesor en el Hunter College de Nueva York, publicó el método en 1929 en la ' +
    'revista <em>American Mathematical Monthly</em>, y patentó en 1932 una máquina de engranajes que ' +
    'lo hacía con bloques de seis letras. Nunca se usó a gran escala: era pesado de calcular a mano ' +
    'y vulnerable con texto conocido. Su importancia es de otro tipo: fue el primer cifrado ' +
    'diseñado con álgebra en vez de con ingenio, y el primero en cifrar bloques.');

  p.trampas([
    { e: 'Exigir solo que el determinante no sea cero', por: 'Módulo 26, $\\det K = 2$ no es cero y no tiene inverso: la clave no vale. La condición es $\\operatorname{mcd}(\\det K, 26) = 1$.' },
    { e: 'Dividir entre el determinante', por: '$1/9$ no significa nada módulo 26. Se multiplica por el inverso modular, 3, que se calcula con Euclides extendido.' },
    { e: 'Dejar entradas negativas en la inversa', por: '$-9$ no es un resto. Se le suma 26: $17$. La matriz inversa tiene todas sus entradas entre 0 y 25.' },
    { e: 'Creer que difundir basta para ser seguro', por: 'Hill difunde y es lineal: cuatro letras conocidas lo rompen. Los cifrados modernos difunden <em>y</em> añaden pasos no lineales.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  function matVal(r) {
    for (var k = 0; k < 100; k++) {
      var K = [[r.int(0, 25), r.int(0, 25)], [r.int(0, 25), r.int(0, 25)]];
      if (CR.hillInv(K)) return K;
    }
    return [[3, 3], [2, 5]];
  }
  var PARES = ['HO', 'LA', 'ME', 'SA', 'TE', 'NO', 'SI', 'DE', 'EN', 'AR', 'OS', 'UN'];

  p.exercise({
    title: 'Cifra un par de letras',
    level: 'basico',
    gen: function (r) { var K = matVal(r), par = r.pick(PARES); return { K: K, par: par, c: CR.hill(par, K) }; },
    ask: function (d) { return 'Con la clave $K = \\begin{pmatrix} ' + d.K[0][0] + ' & ' + d.K[0][1] + ' \\\\ ' + d.K[1][0] + ' & ' + d.K[1][1] + ' \\end{pmatrix}$, cifra el par <strong>' + d.par + '</strong> con el cifrado de Hill.'; },
    fields: [{ name: 'c', label: 'cifrado', w: 'tiny' }],
    sol: function (d) { return { c: d.c }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.c);
      if (t.length !== 2) return { ok: false, msg: 'El cifrado de un par son dos letras.' };
      if (t === d.c) return { ok: true };
      var x1 = CR.num(d.par.charAt(0)), x2 = CR.num(d.par.charAt(1));
      var traspuesta = CR.letra(d.K[0][0] * x1 + d.K[1][0] * x2) + CR.letra(d.K[0][1] * x1 + d.K[1][1] * x2);
      if (t === traspuesta && traspuesta !== d.c) return { ok: false, msg: 'Has multiplicado por columnas en vez de por filas: $y_1 = a x_1 + b x_2$, con la primera fila de la matriz.' };
      return { ok: false, msg: 'No coincide. $y_1 = ' + d.K[0][0] + ' x_1 + ' + d.K[0][1] + ' x_2$ e $y_2 = ' + d.K[1][0] + ' x_1 + ' + d.K[1][1] + ' x_2$, módulo 26.' };
    },
    hint: function (d) { return 'El par es el vector $(' + CR.num(d.par.charAt(0)) + ', ' + CR.num(d.par.charAt(1)) + ')$. Primera fila por el vector para $y_1$, segunda fila para $y_2$.'; },
    steps: function (d) {
      var x1 = CR.num(d.par.charAt(0)), x2 = CR.num(d.par.charAt(1));
      return ['$' + d.par + ' = (' + x1 + ', ' + x2 + ')$.', '$y_1 = ' + d.K[0][0] + '\\cdot ' + x1 + ' + ' + d.K[0][1] + '\\cdot ' + x2 + ' = ' + (d.K[0][0] * x1 + d.K[0][1] * x2) + ' \\equiv ' + CR.mod(d.K[0][0] * x1 + d.K[0][1] * x2, 26) + '$.', '$y_2 = ' + d.K[1][0] + '\\cdot ' + x1 + ' + ' + d.K[1][1] + '\\cdot ' + x2 + ' = ' + (d.K[1][0] * x1 + d.K[1][1] * x2) + ' \\equiv ' + CR.mod(d.K[1][0] * x1 + d.K[1][1] * x2, 26) + '$.', 'Cifrado: <strong>' + d.c + '</strong>.'];
    },
    answer: function (d) { return d.c; }
  });

  p.exercise({
    title: '¿Vale como clave?',
    level: 'medio',
    gen: function (r) { var K = [[r.int(0, 25), r.int(0, 25)], [r.int(0, 25), r.int(0, 25)]]; var det = CR.mod(K[0][0] * K[1][1] - K[0][1] * K[1][0], 26); return { K: K, det: det, vale: CR.inv(det, 26) !== null }; },
    ask: function (d) { return '¿Cuánto vale, módulo 26, el determinante de $\\begin{pmatrix} ' + d.K[0][0] + ' & ' + d.K[0][1] + ' \\\\ ' + d.K[1][0] + ' & ' + d.K[1][1] + ' \\end{pmatrix}$? ¿Sirve como clave de Hill?'; },
    fields: [{ name: 'det', label: 'det mod 26', w: 'tiny' }, { name: 'q', label: 'sirve', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { det: d.det, q: d.vale ? 'si' : 'no' }; },
    errores: [{ si: function (v, d) { var bruto = d.K[0][0] * d.K[1][1] - d.K[0][1] * d.K[1][0]; return bruto !== d.det && v.det === bruto; }, msg: 'Es el determinante, pero falta reducirlo módulo 26 a un número entre 0 y 25.' }],
    hint: function () { return ['$ad - bc$, reducido módulo 26.', 'Sirve si el resultado no comparte factores con 26: ni par ni 13.']; },
    steps: function (d) { return ['$' + d.K[0][0] + '\\cdot ' + d.K[1][1] + ' - ' + d.K[0][1] + '\\cdot ' + d.K[1][0] + ' = ' + (d.K[0][0] * d.K[1][1] - d.K[0][1] * d.K[1][0]) + ' \\equiv ' + d.det + '$.', '$\\operatorname{mcd}(' + d.det + ', 26) = ' + ML.gcd(d.det, 26) + '$: ' + (d.vale ? 'tiene inverso, la matriz <strong>sirve</strong>.' : 'no tiene inverso, la matriz <strong>no sirve</strong>.')]; },
    answer: function (d) { return d.det + ', ' + (d.vale ? 'sí' : 'no'); }
  });

  p.exercise({
    title: 'La matriz inversa',
    level: 'medio',
    gen: function (r) { var K = matVal(r); var Ki = CR.hillInv(K), det = CR.mod(K[0][0] * K[1][1] - K[0][1] * K[1][0], 26); return { K: K, Ki: Ki, det: det, inv: CR.inv(det, 26) }; },
    ask: function (d) { return 'Calcula la inversa módulo 26 de $K = \\begin{pmatrix} ' + d.K[0][0] + ' & ' + d.K[0][1] + ' \\\\ ' + d.K[1][0] + ' & ' + d.K[1][1] + ' \\end{pmatrix}$. Da las cuatro entradas entre 0 y 25.'; },
    fields: [{ name: 'a', label: 'fila 1, col 1', w: 'tiny' }, { name: 'b', label: 'fila 1, col 2', w: 'tiny' }, { name: 'c', label: 'fila 2, col 1', w: 'tiny' }, { name: 'd', label: 'fila 2, col 2', w: 'tiny' }],
    sol: function (d) { return { a: d.Ki[0][0], b: d.Ki[0][1], c: d.Ki[1][0], d: d.Ki[1][1] }; },
    errores: [{ si: function (v, d) { var adj = [d.K[1][1], CR.mod(-d.K[0][1], 26), CR.mod(-d.K[1][0], 26), d.K[0][0]]; return d.inv !== 1 && v.a === adj[0] && v.b === adj[1] && v.c === adj[2] && v.d === adj[3]; }, msg: 'Esa es la adjunta. Falta multiplicarla por el inverso del determinante módulo 26.' }],
    hint: function (d) { return ['Determinante módulo 26: ' + d.det + '; su inverso es ' + d.inv + '.', 'Adjunta: intercambia la diagonal y cambia de signo los otros dos. Multiplica por ' + d.inv + ' y reduce.']; },
    steps: function (d) { return ['$\\det K \\equiv ' + d.det + '$, con inverso $' + d.inv + '$.', 'Adjunta: $\\begin{pmatrix} ' + d.K[1][1] + ' & ' + (-d.K[0][1]) + ' \\\\ ' + (-d.K[1][0]) + ' & ' + d.K[0][0] + ' \\end{pmatrix}$.', 'Por $' + d.inv + '$ y módulo 26: $K^{-1} = \\begin{pmatrix} ' + d.Ki[0][0] + ' & ' + d.Ki[0][1] + ' \\\\ ' + d.Ki[1][0] + ' & ' + d.Ki[1][1] + ' \\end{pmatrix}$.']; },
    answer: function (d) { return '[' + d.Ki[0].join(' ') + '; ' + d.Ki[1].join(' ') + ']'; }
  });

  p.exercise({
    title: 'Descifra un par',
    level: 'avanzado',
    gen: function (r) { var K = matVal(r), par = r.pick(PARES); return { K: K, Ki: CR.hillInv(K), par: par, c: CR.hill(par, K) }; },
    ask: function (d) { return 'El par <strong>' + d.c + '</strong> se cifró con Hill y la clave $K = \\begin{pmatrix} ' + d.K[0][0] + ' & ' + d.K[0][1] + ' \\\\ ' + d.K[1][0] + ' & ' + d.K[1][1] + ' \\end{pmatrix}$. ¿Qué par era en el mensaje?'; },
    fields: [{ name: 'm', label: 'par original', w: 'tiny' }],
    sol: function (d) { return { m: d.par }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.m);
      if (t.length !== 2) return { ok: false, msg: 'Son dos letras.' };
      if (t === d.par) return { ok: true };
      if (t === CR.hill(d.c, d.K)) return { ok: false, msg: 'Has vuelto a cifrar con $K$. Para descifrar se multiplica por la inversa.' };
      return { ok: false, msg: 'No es ese. Calcula $K^{-1}$ módulo 26 y multiplícala por el vector del par cifrado.' };
    },
    hint: function (d) { return ['Primero la inversa: $K^{-1} = \\begin{pmatrix} ' + d.Ki[0][0] + ' & ' + d.Ki[0][1] + ' \\\\ ' + d.Ki[1][0] + ' & ' + d.Ki[1][1] + ' \\end{pmatrix}$.', 'Después, $K^{-1}$ por el vector $(' + CR.num(d.c.charAt(0)) + ', ' + CR.num(d.c.charAt(1)) + ')$, módulo 26.']; },
    steps: function (d) {
      var y1 = CR.num(d.c.charAt(0)), y2 = CR.num(d.c.charAt(1));
      return ['$K^{-1} = \\begin{pmatrix} ' + d.Ki[0][0] + ' & ' + d.Ki[0][1] + ' \\\\ ' + d.Ki[1][0] + ' & ' + d.Ki[1][1] + ' \\end{pmatrix}$.', '$x_1 = ' + d.Ki[0][0] + '\\cdot ' + y1 + ' + ' + d.Ki[0][1] + '\\cdot ' + y2 + ' \\equiv ' + CR.mod(d.Ki[0][0] * y1 + d.Ki[0][1] * y2, 26) + '$, $x_2 = ' + d.Ki[1][0] + '\\cdot ' + y1 + ' + ' + d.Ki[1][1] + '\\cdot ' + y2 + ' \\equiv ' + CR.mod(d.Ki[1][0] * y1 + d.Ki[1][1] * y2, 26) + '$.', 'El par es <strong>' + d.par + '</strong>.'];
    },
    answer: function (d) { return d.par; }
  });

  p.exercise({
    title: 'Ataque con texto conocido',
    level: 'avanzado',
    gen: function (r) {
      var K = matVal(r), p1 = r.pick(PARES), p2 = r.pick(PARES);
      var X = [[CR.num(p1.charAt(0)), CR.num(p2.charAt(0))], [CR.num(p1.charAt(1)), CR.num(p2.charAt(1))]];
      var Xi = CR.hillInv(X);
      if (!Xi) return null;
      var c1 = CR.hill(p1, K), c2 = CR.hill(p2, K);
      return { K: K, p1: p1, p2: p2, c1: c1, c2: c2, Xi: Xi };
    },
    ask: function (d) { return 'Eva sabe que un mensaje va cifrado con Hill de tamaño 2, y que el par <strong>' + d.p1 + '</strong> se cifró como <strong>' + d.c1 + '</strong> y el par <strong>' + d.p2 + '</strong> como <strong>' + d.c2 + '</strong>. Recupera la matriz clave $K$.'; },
    fields: [{ name: 'a', label: 'fila 1, col 1', w: 'tiny' }, { name: 'b', label: 'fila 1, col 2', w: 'tiny' }, { name: 'c', label: 'fila 2, col 1', w: 'tiny' }, { name: 'd', label: 'fila 2, col 2', w: 'tiny' }],
    sol: function (d) { return { a: d.K[0][0], b: d.K[0][1], c: d.K[1][0], d: d.K[1][1] }; },
    hint: function (d) { return ['Pon los dos pares del mensaje como columnas de una matriz $X$, y los cifrados como columnas de $Y$: entonces $Y = K X$.', 'Así que $K = Y X^{-1}$. La inversa de $X$ módulo 26 es $\\begin{pmatrix} ' + d.Xi[0][0] + ' & ' + d.Xi[0][1] + ' \\\\ ' + d.Xi[1][0] + ' & ' + d.Xi[1][1] + ' \\end{pmatrix}$.']; },
    steps: function (d) {
      var Y = [[CR.num(d.c1.charAt(0)), CR.num(d.c2.charAt(0))], [CR.num(d.c1.charAt(1)), CR.num(d.c2.charAt(1))]];
      return ['$X = \\begin{pmatrix} ' + CR.num(d.p1.charAt(0)) + ' & ' + CR.num(d.p2.charAt(0)) + ' \\\\ ' + CR.num(d.p1.charAt(1)) + ' & ' + CR.num(d.p2.charAt(1)) + ' \\end{pmatrix}$, $Y = \\begin{pmatrix} ' + Y[0][0] + ' & ' + Y[0][1] + ' \\\\ ' + Y[1][0] + ' & ' + Y[1][1] + ' \\end{pmatrix}$, y $Y = KX$.',
        '$X^{-1} \\equiv \\begin{pmatrix} ' + d.Xi[0][0] + ' & ' + d.Xi[0][1] + ' \\\\ ' + d.Xi[1][0] + ' & ' + d.Xi[1][1] + ' \\end{pmatrix}$.',
        '$K = Y X^{-1} = \\begin{pmatrix} ' + d.K[0][0] + ' & ' + d.K[0][1] + ' \\\\ ' + d.K[1][0] + ' & ' + d.K[1][1] + ' \\end{pmatrix}$.',
        'Cuatro letras conocidas bastan: la linealidad del cifrado lo entrega entero.'];
    },
    answer: function (d) { return '[' + d.K[0].join(' ') + '; ' + d.K[1].join(' ') + ']'; }
  });

  p.keys([
    'Hill cifra bloques: un par de letras es un vector, y la clave una matriz. $y = Kx \\bmod 26$.',
    'Se puede descifrar solo si $\\operatorname{mcd}(\\det K, 26) = 1$: la inversa es $(\\det K)^{-1}$ por la adjunta, con el inverso modular.',
    'Cada letra cifrada depende de varias del mensaje: eso es la <strong>difusión</strong>, que aplana las frecuencias de letras sueltas.',
    'Hill es lineal, y por eso dos pares conocidos lo rompen: $K = Y X^{-1}$. Los cifrados modernos difunden y añaden pasos no lineales.'
  ]);
});
