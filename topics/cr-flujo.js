/* Tema: Cifrado de flujo: fabricar la libreta con un registro */
Course.topic('cr-flujo', function (p) {

  p.puente('La [[cr-vernam|libreta de un solo uso]] es perfecta y carísima, y el ' +
    '[[cr-entropia|tema anterior]] avisó de que una fórmula no es azar. Este tema construye, con ' +
    'un registro de bits y un [[al-polinomios|polinomio]], una libreta larga a partir de una clave ' +
    'corta, y ve exactamente qué se pierde en el camino.');

  p.text('La idea es tentadora: si la clave no puede ser tan larga como el mensaje, que una máquina ' +
    'la estire. Se parte de una clave corta, se genera con ella un chorro de bits que parece ' +
    'aleatorio, el <strong>flujo de clave</strong>, y se hace XOR con el mensaje, como en Vernam. ' +
    'Es el <strong>cifrado de flujo</strong>. Pierde la perfección de Shannon, porque una máquina ' +
    'determinista no produce azar, pero si el flujo es impredecible para Eva, el cifrado aguanta.');

  /* ---------------------------------------------------------------- */
  p.section('Un registro que se realimenta');

  p.text('El generador más sencillo es un <strong>registro de desplazamiento con realimentación ' +
    'lineal</strong>, LFSR por sus siglas en inglés: una fila de $n$ bits que en cada paso se ' +
    'desplaza un lugar. El bit que sale por la derecha es la salida, y el que entra por la ' +
    'izquierda es el XOR de algunos de los bits del registro, los <em>taps</em>. Qué bits se ' +
    'suman lo dice un polinomio.');

  p.formula('s_{t+n} = c_{n-1}\\,s_{t+n-1} \\oplus \\cdots \\oplus c_1\\,s_{t+1} \\oplus c_0\\,s_t, \\qquad x^n + c_{n-1}x^{n-1} + \\cdots + c_0',
    'la recurrencia y su polinomio',
    'Se lee: <em>«el bit nuevo es la suma módulo dos de los bits anteriores elegidos por los ' +
    'coeficientes»</em>. Los $c_k$ valen 0 o 1, y los que valen 1 son los taps.<br><br>El registro tiene ' +
    '$2^n$ estados, y el estado todo ceros se queda quieto para siempre, así que el periodo es como ' +
    'mucho $2^n - 1$. Se alcanza exactamente cuando el polinomio es <strong>primitivo</strong>: ' +
    'irreducible, como un primo entre los polinomios, y además de orden máximo. Con $n = 128$ eso ' +
    'son $3\\cdot 10^{38}$ bits antes de repetirse.');

  p.demo({
    title: 'El registro paso a paso',
    intro: 'Cuatro bits y un polinomio. En cada paso el bit de la derecha sale al flujo y por la izquierda entra el XOR de los taps. Con $x^4 + x^3 + 1$ se recorren los 15 estados no nulos; con $x^4 + x^2 + 1$, que no es primitivo, el ciclo es corto.',
    predice: 'Con $x^4 + x^3 + 1$ y el estado inicial 1000, ¿cuántos pasos habrá que dar para volver a 1000: 4, 15 o 16?',
    build: function (host) {
      var poli = '3,0', estado = [1, 0, 0, 0], pasos = 0;
      var out = W.mono(host, '');
      var NOMBRES = { '3,0': 'x⁴ + x³ + 1', '1,0': 'x⁴ + x + 1', '2,0': 'x⁴ + x² + 1', '3,2,1,0': 'x⁴ + x³ + x² + x + 1' };
      function pinta() {
        var taps = poli.split(',').map(Number), res = CR.lfsr(estado, taps, pasos), h = '<b>polinomio:</b> ' + NOMBRES[poli] + '   <b>taps:</b> bits ' + taps.map(function (k) { return 'x' + k; }).join(', ') + '\n';
        var ests = res.estados.map(function (e) { return e.join(''); }), vuelta = ests.indexOf(ests[0], 1);
        for (var i = 0; i < ests.length; i++) h += (i < 10 ? ' ' : '') + i + ': ' + CR.bitsHtml(ests[i]) + (i < ests.length - 1 ? '  → sale ' + res.bits[i] : '') + (i === vuelta ? '  <span class="cr-ok">vuelve al inicio: periodo ' + vuelta + '</span>' : '') + '\n';
        h += '\n<b>flujo de clave:</b> ' + CR.bitsHtml(res.bits.join(''));
        out.set(h);
      }
      W.chips(host, Object.keys(NOMBRES).map(function (k) { return { label: NOMBRES[k], value: k }; }), { value: poli, on: function (v) { poli = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'pasos', min: 0, max: 20, step: 1, value: pasos, on: function (v) { pasos = v; pinta(); } });
      W.chips(host, ['1000', '0001', '1111', '0110'], { value: '1000', on: function (v) { estado = v.split('').map(Number); pinta(); } });
      pinta();
    }
  });

  p.comprueba('Un LFSR de 8 bits tiene periodo 255 con un polinomio primitivo. ¿Qué pasa si el estado inicial, la clave, es 00000000?', [
    { t: 'Se queda en ceros para siempre: el flujo es todo ceros y el cifrado es el mensaje en claro', ok: true, por: 'El XOR de ceros es cero: el registro no sale nunca de ese estado. Por eso el periodo máximo es $2^n - 1$ y no $2^n$, y por eso la clave nunca puede ser cero.' },
    { t: 'Recorre los 256 estados', ok: false, por: 'El estado nulo es un punto fijo: nada entra que no sea cero. Los otros 255 forman el ciclo largo.' },
    { t: 'Depende del polinomio', ok: false, por: 'Con cualquier polinomio, el XOR de ceros es cero. El estado nulo es fijo siempre.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Cifrar con el flujo');

  p.text('Con el registro en marcha, cifrar es Vernam: cada bit del mensaje se combina con el bit ' +
    'siguiente del flujo. Alicia y Benito comparten la clave corta, arrancan el mismo registro y ' +
    'obtienen el mismo flujo. Para no repetir nunca el flujo entre dos mensajes se añade a la ' +
    'clave un número que cambia con cada mensaje, el <strong>nonce</strong>, que viaja en claro y ' +
    'no es secreto: solo tiene que no repetirse.');

  p.demo({
    title: 'Cifrar un texto con un registro de 16 bits',
    intro: 'La clave de 16 bits arranca el registro, con un polinomio primitivo de grado 16, y el flujo se aplica bit a bit al mensaje. Cambia una letra del mensaje: solo cambian los bits de esa letra, porque el flujo no depende del mensaje. Cambia un bit de la clave: cambia todo.',
    predice: 'Si cifras el mismo mensaje dos veces con la misma clave y el mismo nonce, ¿qué relación tendrán los dos cifrados? ¿Y si cifras dos mensajes distintos?',
    build: function (host) {
      var msg = 'Hola', clave = 'ACE1', nonce = 7;
      var out = W.mono(host, '');
      function pinta() {
        var m = CR.bytes(msg).slice(0, 6), k = parseInt(clave, 16) || 1;
        var ini = ((k ^ (nonce * 0x9E37)) & 0xffff) || 1, bits = CR.bits(ini, 16).split('').map(Number);
        var flujo = CR.lfsr(bits, [14, 13, 11, 0], m.length * 8).bits, ks = [];   // x^16 + x^14 + x^13 + x^11 + 1, primitivo
        for (var i = 0; i < m.length; i++) ks.push(parseInt(flujo.slice(8 * i, 8 * i + 8).join(''), 2));
        var c = CR.xor(m, ks);
        function fila(bs, marca) { return bs.map(function (b, i) { return CR.bitsHtml(CR.bits(b, 8), marca ? CR.bits(marca[i], 8) : null); }).join(' '); }
        out.set('<b>clave:</b> ' + clave.toUpperCase() + '   <b>nonce:</b> ' + nonce + '   <b>estado inicial:</b> ' + CR.bits(ini, 16) + '\n\n<b>mensaje </b> ' + fila(m) + '  <span class="cr-tenue">' + U.escape(CR.texto(m)) + '</span>\n<b>flujo   </b> ' + fila(ks) + '\n<b>cifrado </b> ' + fila(c, m) + '\n\n<span class="cr-tenue">Descifrar: el mismo registro, el mismo flujo, el mismo XOR.</span>');
      }
      W.texto(host, { label: 'mensaje (hasta 6 letras)', value: msg, max: 6, on: function (v) { msg = v; pinta(); } });
      W.texto(host, { label: 'clave (4 cifras hexadecimales)', value: clave, max: 4, corto: true, on: function (v) { clave = v; pinta(); } });
      W.slider(W.row(host), { label: 'nonce', min: 0, max: 99, step: 1, value: nonce, on: function (v) { nonce = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La grieta: lo lineal se despeja');

  p.text('Un LFSR solo tiene periodo largo y buena estadística. Le falta lo importante: ser ' +
    'impredecible. Como cada bit nuevo es una combinación <em>lineal</em> de los anteriores, si Eva ' +
    'conoce $2n$ bits seguidos del flujo, tiene un sistema de $n$ ecuaciones lineales módulo 2 con ' +
    '$n$ incógnitas, los taps, y lo resuelve. Y conoce bits del flujo en cuanto conoce un trozo del ' +
    'mensaje: una cabecera, un saludo, un formato. El algoritmo de Berlekamp y Massey hace todo ' +
    'esto en un instante.');

  p.formula('2n \\text{ bits de flujo conocidos} \\;\\Longrightarrow\\; \\text{polinomio y estado enteros}',
    'el ataque a un LFSR',
    'Con un registro de 128 bits, 256 bits de texto conocido, 32 letras, entregan la clave y todo ' +
    'el flujo pasado y futuro.<br><br>Por eso ningún cifrado real usa un LFSR a secas. Se combinan ' +
    'varios con una función no lineal, se filtran sus salidas, o se usa otra construcción: los ' +
    'cifrados de flujo actuales, como ChaCha20, mezclan sumas, rotaciones y XOR en rondas, igual que ' +
    'los cifrados por bloques que vienen a continuación.');

  p.ejemplo({
    title: 'Un registro de tres bits, a mano',
    enunciado: 'Un LFSR de 3 bits con el polinomio $x^3 + x + 1$: los taps son $x^1$ y $x^0$, es decir, el bit del medio y el de la derecha. Estado inicial 100. Obtener seis bits de salida y el periodo.',
    pasos: [
      { t: '<strong>La regla.</strong> Con taps en $x^1$ y $x^0$, el bit nuevo es $s_{n-2} \\oplus s_{n-1}$: el XOR de los dos bits de la derecha. En cada paso, sale el de la derecha, todo se desplaza, y el nuevo entra por la izquierda.', antes: 'Con el estado 100, ¿qué bit sale y qué bit entra?' },
      { t: '<strong>Los pasos.</strong> 100 → sale 0, entra $0 \\oplus 0 = 0$: 010. → sale 0, entra $1 \\oplus 0 = 1$: 101. → sale 1, entra $0 \\oplus 1 = 1$: 110. → sale 0, entra $1 \\oplus 0 = 1$: 111. → sale 1, entra $1 \\oplus 1 = 0$: 011. → sale 1, entra $1 \\oplus 1 = 0$: 001.', antes: 'Haz tres pasos más.' },
      { t: '<strong>Uno más y se cierra.</strong> 001 → sale 1, entra $0 \\oplus 1 = 1$: 100, el estado inicial. Siete estados, todos los no nulos: periodo $2^3 - 1 = 7$. El polinomio es primitivo.', antes: '¿Cuántos estados distintos han aparecido antes de repetirse?' },
      { t: '<strong>La salida.</strong> 0, 0, 1, 0, 1, 1, 1, y vuelta a empezar. Cualquier ventana de 3 bits seguidos aparece exactamente una vez en el periodo: es la marca de un LFSR de periodo máximo.' }
    ],
    cierre: 'Con $n = 3$ el periodo es 7 y el flujo es un juguete. Con $n = 128$ es $3\\cdot 10^{38}$, y aun así se rompe con 256 bits conocidos: la longitud no arregla la linealidad.'
  });

  p.util('Los LFSR están en el GPS: cada satélite emite una secuencia de 1023 bits generada por dos ' +
    'registros de 10 bits, y el receptor la reconoce para medir el tiempo de vuelo. También en la ' +
    'telefonía móvil, en Bluetooth y en los códigos de barras de las emisoras, siempre para ' +
    'sincronizar o dispersar, no para ocultar. Cuando se han usado para cifrar, la cosa ha ido ' +
    'mal: el A5/1 de los móviles GSM, tres LFSR combinados, se rompe en segundos, y el cifrado WEP ' +
    'de las primeras redes wifi, basado en RC4 con nonces cortos, se rompía en minutos y obligó a ' +
    'cambiar todas las redes del mundo.');

  p.hist('Solomon Golomb estudió las secuencias de registros de desplazamiento en los años cincuenta y ' +
    'publicó el libro de referencia en 1967. Elwyn Berlekamp dio en 1968 un algoritmo para descodificar ' +
    'ciertos códigos y James Massey observó en 1969 que era exactamente lo que hacía falta para ' +
    'reconstruir el LFSR más corto que produce una secuencia. Ron Rivest diseñó RC4 en 1987, un ' +
    'secreto comercial hasta que alguien lo publicó anónimamente en 1994; Daniel Bernstein presentó ' +
    'ChaCha en 2008, y hoy protege buena parte del tráfico de internet junto con AES.');

  p.trampas([
    { e: 'Repetir el nonce con la misma clave', por: 'El flujo es el mismo, y dos cifrados con el mismo flujo son la libreta reutilizada: $c_1 \\oplus c_2 = m_1 \\oplus m_2$. Fue el fallo de WEP.' },
    { e: 'Fiarse del periodo', por: 'Un LFSR de 64 bits no se repite en $10^{19}$ pasos y se rompe con 128 bits de texto conocido. Largo no es impredecible.' },
    { e: 'Arrancar el registro con ceros', por: 'El estado nulo no sale de sí mismo: flujo de ceros, cifrado igual al mensaje.' },
    { e: 'Cambiar un bit del cifrado y creer que Benito lo notará', por: 'Con XOR, cambiar un bit del cifrado cambia exactamente ese bit del mensaje, sin estropear nada más. Un cifrado de flujo no protege contra alteraciones; para eso hacen falta los códigos de autenticación.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Los bits que salen',
    level: 'basico',
    gen: function (r) { var e = [r.int(0, 1), r.int(0, 1), r.int(0, 1), r.int(0, 1)]; if (!e[0] && !e[1] && !e[2] && !e[3]) e[0] = 1; var res = CR.lfsr(e, [3, 0], 4); return { e: e, bits: res.bits.join(''), estados: res.estados.map(function (x) { return x.join(''); }) }; },
    ask: function (d) { return 'Un LFSR de 4 bits con el polinomio $x^4 + x^3 + 1$ (el bit nuevo es el XOR del primer bit por la izquierda y el último) empieza en el estado ' + d.e.join('') + '. En cada paso sale el bit de la derecha y todo se desplaza. Escribe los cuatro primeros bits que salen, en orden.'; },
    fields: [{ name: 'b', label: 'bits', w: 'tiny' }],
    sol: function (d) { return { b: d.bits }; },
    check: function (v, d) {
      var t = String(v.raw.b || '').replace(/[^01]/g, '');
      if (t.length !== 4) return { ok: false, msg: 'Son cuatro bits.' };
      if (t === d.bits) return { ok: true };
      if (t === d.bits.split('').reverse().join('')) return { ok: false, msg: 'Están al revés: el primero que sale es el primero que se escribe.' };
      return { ok: false, msg: 'No coincide. En cada paso: apunta el bit de la derecha, calcula el nuevo como XOR del primero y el último, desplaza y mete el nuevo por la izquierda.' };
    },
    hint: function (d) { return 'Primer paso: sale ' + d.e[3] + ', entra ' + d.e[0] + ' ⊕ ' + d.e[3] + ' = ' + (d.e[0] ^ d.e[3]) + '. Estado nuevo: ' + d.estados[1] + '.'; },
    steps: function (d) { return d.estados.slice(0, 4).map(function (s, i) { return s + ' → sale ' + d.bits.charAt(i) + ', entra ' + (s.charAt(0) ^ s.charAt(3)) + ' → ' + d.estados[i + 1]; }).concat(['Salida: <strong>' + d.bits + '</strong>.']); },
    answer: function (d) { return d.bits; }
  });

  p.exercise({
    title: 'El periodo máximo',
    level: 'basico',
    gen: function (r) { var n = r.pick([5, 6, 7, 8, 10, 12, 16, 20]); return { n: n, v: Math.pow(2, n) - 1 }; },
    ask: function (d) { return 'Un LFSR tiene ' + d.n + ' bits y un polinomio primitivo. ¿Cuántos bits produce antes de repetirse?'; },
    fields: [{ name: 'v', label: 'periodo', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{ si: function (v, d) { return v.v === Math.pow(2, d.n); }, msg: 'Casi: el estado todo ceros no forma parte del ciclo, porque se queda quieto. Son $2^n - 1$.' }],
    hint: function () { return 'Todos los estados menos el nulo.'; },
    steps: function (d) { return ['Estados posibles: $2^{' + d.n + '} = ' + U.miles(Math.pow(2, d.n)) + '$.', 'El nulo es fijo; los demás forman un solo ciclo si el polinomio es primitivo: periodo $' + U.miles(d.v) + '$.']; },
    answer: function (d) { return U.miles(d.v); }
  });

  p.exercise({
    title: 'Descifrar con el flujo',
    level: 'medio',
    gen: function (r) { var c = r.int(1, 255), k = r.int(1, 255); return { c: c, k: k, m: c ^ k }; },
    ask: function (d) { return 'Un byte cifrado con un cifrado de flujo es $' + CR.bits(d.c, 8) + '$ y el byte correspondiente del flujo de clave es $' + CR.bits(d.k, 8) + '$. ¿Cuál es el byte del mensaje?'; },
    fields: [{ name: 'm', label: 'mensaje', w: 'wide' }],
    sol: function (d) { return { m: CR.bits(d.m, 8) }; },
    check: function (v, d) { var t = String(v.raw.m || '').replace(/[^01]/g, ''); if (t.length !== 8) return { ok: false, msg: 'Son 8 bits.' }; return t === CR.bits(d.m, 8) ? { ok: true } : { ok: false, msg: 'No coincide: XOR bit a bit del cifrado y el flujo.' }; },
    hint: function () { return 'La misma operación que cifra: XOR.'; },
    steps: function (d) { return ['$' + CR.bits(d.c, 8) + ' \\oplus ' + CR.bits(d.k, 8) + ' = ' + CR.bits(d.m, 8) + '$.', 'Es el byte ' + d.m + (d.m >= 32 && d.m < 127 ? ', el carácter «' + String.fromCharCode(d.m) + '»' : '') + '.']; },
    answer: function (d) { return CR.bits(d.m, 8); }
  });

  p.exercise({
    title: 'Cuánto texto conocido hace falta',
    level: 'medio',
    gen: function (r) { var n = r.pick([16, 32, 64, 128, 256]); return { n: n, bits: 2 * n, letras: 2 * n / 8 }; },
    ask: function (d) { return 'Un cifrado de flujo usa un solo LFSR de ' + d.n + ' bits. ¿Cuántos bits seguidos del flujo necesita Eva para reconstruirlo con el algoritmo de Berlekamp-Massey? ¿A cuántas letras de texto conocido equivale, a 8 bits por letra?'; },
    fields: [{ name: 'b', label: 'bits', w: 'tiny' }, { name: 'l', label: 'letras', w: 'tiny' }],
    sol: function (d) { return { b: d.bits, l: d.letras }; },
    errores: [{ si: function (v, d) { return v.b === d.n; }, msg: 'Con $n$ bits se conoce el estado, pero no los taps: hacen falta $n$ ecuaciones más, $2n$ en total.' }],
    hint: function () { return '$2n$ bits: $n$ para el estado y $n$ ecuaciones para los taps.'; },
    steps: function (d) { return ['$2\\cdot ' + d.n + ' = ' + d.bits + '$ bits de flujo.', 'Son $' + d.bits + ' / 8 = ' + d.letras + '$ letras de mensaje conocido: un saludo, una cabecera.', 'Un registro de ' + d.n + ' bits tiene periodo $2^{' + d.n + '} - 1$ y cae con ' + d.letras + ' letras. La linealidad no se arregla con longitud.']; },
    answer: function (d) { return d.bits + ' bits, ' + d.letras + ' letras'; }
  });

  p.exercise({
    title: 'El periodo de un registro pequeño',
    level: 'avanzado',
    gen: function (r) {
      var polis = [{ t: 'x^3 + x + 1', taps: [1, 0] }, { t: 'x^3 + x^2 + 1', taps: [2, 0] }, { t: 'x^4 + x + 1', taps: [1, 0] }, { t: 'x^4 + x^3 + 1', taps: [3, 0] }, { t: 'x^4 + x^2 + 1', taps: [2, 0] }, { t: 'x^4 + x^3 + x^2 + x + 1', taps: [3, 2, 1, 0] }];
      var pl = r.pick(polis), n = pl.t.charAt(2) === '3' ? 3 : 4, e = [];
      for (var i = 0; i < n; i++) e.push(r.int(0, 1));
      if (e.join('') === (n === 3 ? '000' : '0000')) e[0] = 1;
      var s = CR.lfsr(e, pl.taps, 20).estados.map(function (x) { return x.join(''); }), per = s.indexOf(s[0], 1);
      return { t: pl.t, taps: pl.taps, n: n, e: e.join(''), per: per, max: Math.pow(2, n) - 1 };
    },
    ask: function (d) { return 'Un LFSR de ' + d.n + ' bits con el polinomio $' + d.t + '$ (el bit nuevo es el XOR de los bits ' + d.taps.map(function (k) { return 'de la posición ' + (d.n - k) + ' contando desde la izquierda'; }).join(' y ') + ') arranca en el estado ' + d.e + '. Simúlalo: ¿cuántos pasos tarda en volver al estado inicial? ¿Es el periodo máximo?'; },
    fields: [{ name: 'p', label: 'periodo', w: 'tiny' }, { name: 'q', label: 'máximo', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { p: d.per, q: d.per === d.max ? 'si' : 'no' }; },
    hint: function (d) { return ['El máximo posible es $2^{' + d.n + '} - 1 = ' + d.max + '$.', 'Escribe los estados uno debajo de otro hasta que reaparezca el primero.']; },
    steps: function (d) { var s = CR.lfsr(d.e.split('').map(Number), d.taps, d.per).estados.map(function (x) { return x.join(''); }); return ['Estados: ' + s.join(' → ') + '.', 'Vuelve al inicio en <strong>' + d.per + '</strong> pasos.', d.per === d.max ? 'Es el máximo, $2^{' + d.n + '} - 1$: el polinomio es primitivo.' : 'No llega a $' + d.max + '$: el polinomio no es primitivo, y el registro se queda en un ciclo corto.']; },
    answer: function (d) { return d.per + (d.per === d.max ? ', máximo' : ', no máximo'); }
  });

  p.keys([
    'Un cifrado de flujo estira una clave corta en un flujo de bits y hace XOR con el mensaje: es Vernam con una libreta fabricada.',
    'El LFSR desplaza $n$ bits y realimenta el XOR de los taps que marca un polinomio. Periodo máximo $2^n - 1$, con polinomio primitivo.',
    'Es lineal: $2n$ bits de flujo conocidos entregan el registro entero (Berlekamp-Massey). Nunca se usa solo.',
    'El nonce cambia el flujo en cada mensaje sin ser secreto; repetirlo es reutilizar la libreta.',
    'Un cifrado de flujo no detecta alteraciones: cambiar un bit del cifrado cambia ese bit del mensaje y nada más.'
  ]);
});
