/* Tema: El cifrado afin y el inverso modular */
Course.topic('cr-afin', function (p) {

  p.puente('El [[cr-cesar|César]] sumaba una clave. Este tema también multiplica, y con eso aparece una ' +
    'pregunta nueva: ¿cuándo se puede deshacer una multiplicación módulo 26? La respuesta está en ' +
    'el [[ar-divisibilidad|máximo común divisor]], y la herramienta para calcularla, el algoritmo de ' +
    'Euclides extendido, va a acompañarte hasta el final del bloque: es la misma que descifra RSA.');

  p.text('Sumar módulo 26 siempre se puede deshacer: se resta. Multiplicar, no siempre. Si se ' +
    'multiplica cada letra por 2, la A ($0$) y la N ($13$) van las dos a parar al $0$, y Benito ' +
    'no sabe cuál de las dos le han enviado. El cifrado afín es el primero en el que hay claves ' +
    '<strong>que no valen</strong>, y averiguar cuáles es el corazón del tema.');

  /* ---------------------------------------------------------------- */
  p.section('Multiplicar y sumar');

  p.formula('y = (a\\,x + b) \\bmod 26', 'el cifrado afín con clave (a, b)',
    'Se lee: <em>«y es igual a a por x más b, módulo 26»</em>. La letra $x$ se multiplica por $a$, se ' +
    'le suma $b$ y se reduce. Con $a = 1$ es el César de clave $b$.<br><br>Se llama afín porque ' +
    '$ax + b$ es la ecuación de una recta, como las [[fn-lineales|funciones lineales]]; solo que aquí ' +
    'la recta vive en un reloj de 26 horas y va dando saltos.');

  p.demo({
    title: 'La tabla del afín',
    intro: 'Cada letra de arriba va a la de abajo. Mueve $a$: con algunos valores, dos letras distintas van a la misma, y esas quedan marcadas. Con esos $a$ el cifrado no se puede deshacer.',
    predice: 'Con $a = 2$ hay choques. ¿Los habrá con $a = 3$? ¿Y con $a = 13$? ¿Qué tienen en común los $a$ que chocan? Piensa en los divisores de 26.',
    build: function (host) {
      var a = 5, b = 8, msg = 'CIFRADO AFIN';
      var tabla = U.el('div.cr-letras');
      host.appendChild(tabla);
      var out = W.mono(host, '');
      function pinta() {
        tabla.innerHTML = '';
        var destinos = {}, choques = 0;
        for (var i = 0; i < 26; i++) { var y = CR.mod(a * i + b, 26); destinos[y] = (destinos[y] || 0) + 1; }
        for (i = 0; i < 26; i++) {
          var y2 = CR.mod(a * i + b, 26), rep = destinos[y2] > 1;
          if (rep) choques++;
          tabla.appendChild(U.el('span' + (rep ? '.is-on' : ''), { html: '<i>' + CR.ABC.charAt(i) + '</i><b>' + CR.letra(y2) + '</b>' }));
        }
        var g = ML.gcd(a, 26), t = CR.limpia(msg, true);
        var c = t.split('').map(function (ch) { return ch === ' ' ? ' ' : CR.letra(a * CR.num(ch) + b); }).join('');
        out.set('<b>mensaje:</b>  ' + U.escape(t) + '\n<b>cifrado:</b>  ' + U.escape(c) + '\n' +
          (g === 1 ? '<span class="cr-ok">mcd(' + a + ', 26) = 1: las 26 letras van a 26 destinos distintos. Se puede descifrar: el inverso de ' + a + ' es ' + CR.inv(a, 26) + '.</span>'
            : '<span class="cr-dif">mcd(' + a + ', 26) = ' + g + ': ' + choques + ' letras comparten destino. Este cifrado no se puede deshacer.</span>'));
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 40, on: function (v) { msg = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'a', min: 1, max: 25, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'b', min: 0, max: 25, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cuándo se puede deshacer');

  p.text('Para descifrar hay que despejar $x$ de $y = ax + b$: restar $b$ es fácil, pero después hay ' +
    'que «dividir entre $a$», y en el reloj no hay divisiones. Lo que hay es <strong>inversos</strong>: ' +
    'un número $a^{-1}$ que multiplicado por $a$ dé 1. Si existe, dividir entre $a$ es multiplicar ' +
    'por $a^{-1}$.');

  p.formulas([
    'a\\,a^{-1} \\equiv 1 \\pmod{26}',
    'x = a^{-1}\\,(y - b) \\bmod 26'
  ], 'el inverso modular y el descifrado',
    'Se lee: <em>«a por a inverso es congruente con uno módulo veintiséis»</em>.<br><br>Por ejemplo, ' +
    '$5\\cdot 21 = 105 = 4\\cdot 26 + 1$, así que $21$ es el inverso de $5$. Y el inverso existe ' +
    '<strong>exactamente cuando $\\operatorname{mcd}(a, 26) = 1$</strong>: si $a$ comparte un factor ' +
    'con 26, todos los múltiplos de $a$ lo comparten, y ninguno puede dejar resto 1.');

  p.text('Los números del 1 al 25 sin factores comunes con $26 = 2\\cdot 13$ son los impares menos el ' +
    '13: $1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25$. Doce valores de $a$ por 26 de $b$: el afín tiene ' +
    '<strong>312 claves</strong>. Más que el César, y aun así una tarde de fuerza bruta a mano.');

  p.comprueba('¿Por qué $a = 13$ no vale, si 13 es primo?', [
    { t: 'Porque comparte el factor 13 con 26: $\\operatorname{mcd}(13, 26) = 13$, y $13x$ solo puede valer 0 o 13', ok: true, por: 'Que $a$ sea primo no importa; lo que importa es que no comparta factores con el módulo. Con $a = 13$, todas las letras pares van al 0 y todas las impares al 13.' },
    { t: 'Sí vale: 13 es primo y los primos siempre tienen inverso', ok: false, por: 'Tienen inverso módulo $n$ los números primos <em>con</em> $n$, no los que son primos. 13 divide a 26, así que $13x \\bmod 26$ nunca es 1.' },
    { t: 'No vale porque es mayor que la mitad de 26', ok: false, por: 'El tamaño no importa: $25$ vale (es $-1$) y $2$ no. Lo que decide es el máximo común divisor con 26.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Encontrar el inverso: Euclides extendido');

  p.text('Con módulo 26 el inverso se encuentra probando: doce multiplicaciones. Con módulos de ' +
    'trescientas cifras, como en RSA, hace falta un método, y es el más antiguo de todos: el ' +
    'algoritmo de Euclides para el [[ar-divisibilidad|máximo común divisor]], llevando la cuenta ' +
    'de los cocientes. Al terminar, además del mcd, da dos números $x$ e $y$ con:');

  p.formula('a\\,x + n\\,y = \\operatorname{mcd}(a, n)', 'identidad de Bézout',
    'Se lee: <em>«a por x más ene por y es el máximo común divisor de a y ene»</em>. Cuando el mcd es ' +
    '1, reducir módulo $n$ deja $ax \\equiv 1$: <strong>$x$ es el inverso de $a$</strong>. Si sale ' +
    'negativo, se le suma $n$.<br><br>Se hace así: se divide como en Euclides, $n = q\\,a + r$, y ' +
    'cada resto se escribe como combinación de $a$ y $n$. El último resto no nulo es el mcd, y su ' +
    'combinación es la identidad.');

  p.demo({
    title: 'La tabla de Euclides extendido',
    intro: 'Elige $a$ y el módulo. Cada fila divide el número de arriba entre el de abajo; las columnas $x$ e $y$ llevan la cuenta de cómo se escribe cada resto como $a\\,x + n\\,y$. La última fila con resto distinto de cero da el mcd y el inverso.',
    predice: 'Para $a = 7$ y $n = 26$, ¿cuántas divisiones harán falta? ¿Y para $a = 25$? Piensa en cuál se acerca antes a un resto 1.',
    build: function (host) {
      var a = 7, n = 26;
      var out = W.readout(host, '');
      function pinta() {
        var e = CR.egcd(a, n), h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>dividendo</th><th>divisor</th><th>cociente</th><th>resto</th><th>resto = $a\\,x + n\\,y$</th></tr></thead><tbody>';
        // la primera division es n entre a: se muestra en ese orden
        var r0 = n, r1 = a, x0 = 0, y0 = 1, x1 = 1, y1 = 0, filas = [];
        while (r1 !== 0) {
          var q = Math.floor(r0 / r1), r2 = r0 - q * r1, x2 = x0 - q * x1, y2 = y0 - q * y1;
          filas.push({ a: r0, b: r1, q: q, r: r2, x: x2, y: y2 });
          r0 = r1; r1 = r2; x0 = x1; x1 = x2; y0 = y1; y1 = y2;
        }
        filas.forEach(function (f) {
          h += '<tr><td>' + f.a + '</td><td>' + f.b + '</td><td>' + f.q + '</td><td><strong>' + f.r + '</strong></td><td>' + (f.r === 0 ? '—' : f.r + ' = ' + a + '·(' + f.x + ') + ' + n + '·(' + f.y + ')') + '</td></tr>';
        });
        h += '</tbody></table></div>';
        var g = e.g;
        h += g === 1 ? 'mcd$(' + a + ', ' + n + ') = 1$, y $' + a + '\\cdot(' + e.x + ') \\equiv 1$: el inverso de $' + a + '$ es $' + CR.mod(e.x, n) + '$. Comprobación: $' + a + '\\cdot ' + CR.mod(e.x, n) + ' = ' + (a * CR.mod(e.x, n)) + ' = ' + Math.floor(a * CR.mod(e.x, n) / n) + '\\cdot ' + n + ' + 1$.'
          : 'mcd$(' + a + ', ' + n + ') = ' + g + ' \\ne 1$: no hay inverso. Ningún múltiplo de ' + a + ' deja resto 1 al dividir entre ' + n + '.';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'a', min: 1, max: 99, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'módulo n', min: 2, max: 100, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Cifrar y descifrar con (5, 8)',
    enunciado: 'Con la clave $a = 5$, $b = 8$, cifrar la palabra HOLA, encontrar el inverso de 5 módulo 26 con Euclides extendido, y descifrar.',
    pasos: [
      { t: '<strong>Cifrar.</strong> H = 7: $5\\cdot 7 + 8 = 43 \\equiv 17$, R. O = 14: $78 \\equiv 0$, A. L = 11: $63 \\equiv 11$, L. A = 0: $8$, I. Cifrado: <strong>RALI</strong>.', antes: 'Aplica $5x + 8$ a cada letra y reduce.' },
      { t: '<strong>Euclides.</strong> $26 = 5\\cdot 5 + 1$. Un solo paso: el resto es 1, así que $1 = 26 - 5\\cdot 5$.', antes: 'Divide 26 entre 5. ¿Qué resto queda?' },
      { t: '<strong>El inverso.</strong> Módulo 26, $26 - 5\\cdot 5 \\equiv -5\\cdot 5$, luego $5\\cdot(-5) \\equiv 1$ y el inverso es $-5 \\equiv 21$. Comprobación: $5\\cdot 21 = 105 = 4\\cdot 26 + 1$ ✓.', antes: 'De $1 = 26 - 5\\cdot 5$, ¿qué número multiplicado por 5 da 1 módulo 26?' },
      { t: '<strong>Descifrar.</strong> $x = 21\\,(y - 8)$. R = 17: $21\\cdot 9 = 189 \\equiv 7$, H. A = 0: $21\\cdot(-8) = -168 \\equiv 14$, O. L = 11: $21\\cdot 3 = 63 \\equiv 11$, L. I = 8: $0$, A. HOLA ✓.', antes: 'Resta 8 a cada letra cifrada y multiplica por 21.' }
    ],
    cierre: 'El mismo esquema, restar y multiplicar por el inverso, es el que descifra RSA. Solo cambian el 26 por un número de 600 cifras y el 5 por una potencia.'
  });

  p.util('El inverso modular está en más sitios de los que parece. El dígito de control del DNI, la ' +
    'letra, se calcula con el resto módulo 23; el del ISBN de diez cifras, con el módulo 11, y ' +
    'para corregir un error en una cifra hace falta un inverso módulo 11. Y en todo el resto de ' +
    'este bloque: cada vez que un cifrado moderno «divide», está multiplicando por un inverso ' +
    'calculado con Euclides extendido, exactamente como en la demo.');

  p.hist('El algoritmo de Euclides está en los <em>Elementos</em>, hacia el 300 a. C., y es el algoritmo ' +
    'más antiguo que sigue en uso sin cambios. La idea de llevar la cuenta de los cocientes para ' +
    'escribir el mcd como combinación aparece en Claude Gaspard Bachet de Méziriac en 1624, en un ' +
    'libro de problemas recreativos, y lleva el nombre de Étienne Bézout, que la extendió a ' +
    'polinomios en 1779. El cifrado afín no tuvo nunca uso militar: es un ejercicio de aula, pero ' +
    'uno que enseña justo lo que hace falta.');

  p.trampas([
    { e: 'Elegir cualquier $a$', por: 'Con $a = 4$, la A y la N van las dos a la I. Solo valen los $a$ con $\\operatorname{mcd}(a, 26) = 1$: doce en total.' },
    { e: 'Confundir «primo» con «primo con 26»', por: '$13$ es primo y no vale; $25 = 5^2$ no es primo y vale. Lo que cuenta es no compartir factores con el módulo.' },
    { e: 'Descifrar dividiendo entre $a$', por: 'En el reloj no hay división. $y - b$ se multiplica por el inverso: para $a = 5$, por 21, no «entre 5».' },
    { e: 'Dejar el inverso negativo', por: 'Euclides da $x = -5$. El inverso es un número entre 0 y 25: $-5 + 26 = 21$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var AS = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  p.exercise({
    title: 'Cifra una letra',
    level: 'basico',
    gen: function (r) { var a = r.pick(AS.slice(1)), b = r.int(1, 25), x = r.int(0, 25); return { a: a, b: b, x: x, y: CR.mod(a * x + b, 26) }; },
    ask: function (d) { return 'Con el cifrado afín de clave $a = ' + d.a + '$, $b = ' + d.b + '$, ¿en qué letra se convierte la <strong>' + CR.letra(d.x) + '</strong>?'; },
    fields: [{ name: 'l', label: 'letra', w: 'tiny' }],
    sol: function (d) { return { l: CR.letra(d.y) }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.l);
      if (t.length !== 1) return { ok: false, msg: 'Escribe una sola letra.' };
      if (t === CR.letra(d.y)) return { ok: true };
      if (t === CR.letra(d.a * d.x + d.b + d.a)) return { ok: false, msg: 'Te has pasado en $a$: seguramente has numerado la A como 1. La A es el 0.' };
      return { ok: false, msg: 'No coincide. Calcula $' + d.a + '\\cdot ' + d.x + ' + ' + d.b + '$ y reduce módulo 26.' };
    },
    hint: function (d) { return 'La ' + CR.letra(d.x) + ' es el ' + d.x + '. Multiplica por ' + d.a + ', suma ' + d.b + ' y quédate con el resto al dividir entre 26.'; },
    steps: function (d) { return [CR.letra(d.x) + ' = ' + d.x + '.', '$' + d.a + '\\cdot ' + d.x + ' + ' + d.b + ' = ' + (d.a * d.x + d.b) + ' \\equiv ' + d.y + ' \\pmod{26}$.', 'El ' + d.y + ' es la <strong>' + CR.letra(d.y) + '</strong>.']; },
    answer: function (d) { return CR.letra(d.y); }
  });

  p.exercise({
    title: '¿Tiene inverso?',
    level: 'medio',
    gen: function (r) { var a = r.int(2, 25); var inv = CR.inv(a, 26); return { a: a, inv: inv === null ? 0 : inv, g: ML.gcd(a, 26) }; },
    ask: function (d) { return '¿Tiene $' + d.a + '$ inverso módulo 26? Si lo tiene, ¿cuál es? Escribe 0 si no existe.'; },
    fields: [{ name: 'q', label: 'inverso', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }, { name: 'i', label: 'valor (0 si no hay)', w: 'tiny' }],
    sol: function (d) { return { q: d.inv ? 'si' : 'no', i: d.inv }; },
    errores: [{ si: function (v, d) { return d.inv > 0 && Number.isInteger(v.i) && v.i !== d.inv && CR.mod(v.i, 26) === d.inv; }, msg: 'Es el número correcto, pero el inverso se da entre 0 y 25: suma o resta 26.' }],
    hint: function (d) { return ['Hay inverso si y solo si $\\operatorname{mcd}(' + d.a + ', 26) = 1$.', 'Si lo hay, busca el número entre 1 y 25 que multiplicado por ' + d.a + ' da resto 1, o usa Euclides extendido.']; },
    steps: function (d) {
      if (!d.inv) return ['$\\operatorname{mcd}(' + d.a + ', 26) = ' + d.g + ' \\ne 1$.', 'Ningún múltiplo de ' + d.a + ' deja resto 1 módulo 26: <strong>no hay inverso</strong>.', 'Como clave $a$ de un afín, ' + d.a + ' no vale.'];
      return ['$\\operatorname{mcd}(' + d.a + ', 26) = 1$: sí hay inverso.', '$' + d.a + '\\cdot ' + d.inv + ' = ' + (d.a * d.inv) + ' = ' + Math.floor(d.a * d.inv / 26) + '\\cdot 26 + 1$.', 'El inverso es <strong>' + d.inv + '</strong>.'];
    },
    answer: function (d) { return d.inv ? 'sí, ' + d.inv : 'no'; }
  });

  p.exercise({
    title: 'Descifra una letra',
    level: 'medio',
    gen: function (r) { var a = r.pick(AS.slice(1)), b = r.int(1, 25), x = r.int(0, 25); return { a: a, b: b, x: x, y: CR.mod(a * x + b, 26), inv: CR.inv(a, 26) }; },
    ask: function (d) { return 'Un texto cifrado con el afín de clave $a = ' + d.a + '$, $b = ' + d.b + '$ contiene la letra <strong>' + CR.letra(d.y) + '</strong>. ¿Qué letra era en el original?'; },
    fields: [{ name: 'l', label: 'letra', w: 'tiny' }],
    sol: function (d) { return { l: CR.letra(d.x) }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.l);
      if (t.length !== 1) return { ok: false, msg: 'Escribe una sola letra.' };
      if (t === CR.letra(d.x)) return { ok: true };
      if (t === CR.letra(d.a * (d.y - d.b))) return { ok: false, msg: 'Has multiplicado por $a$ en vez de por su inverso. Descifrar es $a^{-1}(y - b)$.' };
      return { ok: false, msg: 'No es esa. Resta ' + d.b + ', multiplica por el inverso de ' + d.a + ', que es ' + d.inv + ', y reduce.' };
    },
    hint: function (d) { return ['El inverso de ' + d.a + ' módulo 26 es ' + d.inv + '.', '$x = ' + d.inv + '\\,(y - ' + d.b + ') \\bmod 26$.']; },
    steps: function (d) { return [CR.letra(d.y) + ' = ' + d.y + '.', '$' + d.y + ' - ' + d.b + ' = ' + (d.y - d.b) + '$, y $' + d.inv + '\\cdot(' + (d.y - d.b) + ') = ' + (d.inv * (d.y - d.b)) + ' \\equiv ' + d.x + ' \\pmod{26}$.', 'El ' + d.x + ' es la <strong>' + CR.letra(d.x) + '</strong>.']; },
    answer: function (d) { return CR.letra(d.x); }
  });

  p.exercise({
    title: 'La identidad de Bézout',
    level: 'avanzado',
    gen: function (r) { var n = r.pick([26, 27, 29, 31, 35, 37, 40, 41]), a = r.int(2, n - 1); if (ML.gcd(a, n) !== 1) return null; var e = CR.egcd(a, n); return { a: a, n: n, x: e.x, y: e.y }; },
    ask: function (d) { return 'Encuentra dos enteros $x$ e $y$ tales que $' + d.a + '\\,x + ' + d.n + '\\,y = 1$. Vale cualquier pareja que cumpla la igualdad.'; },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: d.x, y: d.y }; },
    check: function (v, d) {
      if (!Number.isInteger(v.x) || !Number.isInteger(v.y)) return { ok: false, msg: 'Tienen que ser dos enteros.' };
      if (d.a * v.x + d.n * v.y === 1) return { ok: true };
      if (CR.mod(d.a * v.x, d.n) === 1) return { ok: false, msg: 'Tu $x$ es el inverso, bien. Pero la $y$ tiene que hacer que la suma dé exactamente 1, no solo módulo ' + d.n + '.', fields: { x: true, y: false } };
      return { ok: false, msg: 'Con esos valores, $' + d.a + '\\cdot ' + v.x + ' + ' + d.n + '\\cdot ' + v.y + ' = ' + (d.a * v.x + d.n * v.y) + '$, no 1.' };
    },
    hint: function () { return ['Haz Euclides con ' + 'los dos números y apunta los cocientes.', 'Despeja los restos hacia atrás hasta escribir el 1 como combinación de los dos.']; },
    steps: function (d) {
      var e = CR.egcd(d.a, d.n), l = e.pasos.map(function (f) { return '$' + f.a + ' = ' + f.q + '\\cdot ' + f.b + ' + ' + f.r + '$'; });
      return ['Euclides: ' + l.join(', ') + '.', 'Escribiendo cada resto como combinación: $1 = ' + d.a + '\\cdot(' + d.x + ') + ' + d.n + '\\cdot(' + d.y + ')$.', 'Así que el inverso de ' + d.a + ' módulo ' + d.n + ' es $' + CR.mod(d.x, d.n) + '$. Hay infinitas parejas: sumar ' + d.n + ' a $x$ y restar ' + d.a + ' a $y$ da otra.'];
    },
    answer: function (d) { return 'x = ' + d.x + ', y = ' + d.y; }
  });

  p.exercise({
    title: 'Ataque con texto conocido',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick(AS.slice(1)), b = r.int(1, 25), x1 = r.int(0, 25), x2 = r.int(0, 25);
      if (x1 === x2 || ML.gcd(CR.mod(x1 - x2, 26), 26) !== 1) return null;
      return { a: a, b: b, x1: x1, x2: x2, y1: CR.mod(a * x1 + b, 26), y2: CR.mod(a * x2 + b, 26), inv: CR.inv(CR.mod(x1 - x2, 26), 26) };
    },
    ask: function (d) { return 'Eva sabe que un mensaje va cifrado con un afín, y que la <strong>' + CR.letra(d.x1) + '</strong> del original aparece como <strong>' + CR.letra(d.y1) + '</strong> y la <strong>' + CR.letra(d.x2) + '</strong> como <strong>' + CR.letra(d.y2) + '</strong>. ¿Cuál es la clave $(a, b)$?'; },
    fields: [{ name: 'a', label: 'a', w: 'tiny' }, { name: 'b', label: 'b', w: 'tiny' }],
    sol: function (d) { return { a: d.a, b: d.b }; },
    hint: function (d) { return ['Restando las dos ecuaciones $y = ax + b$ desaparece $b$: $y_1 - y_2 \\equiv a\\,(x_1 - x_2)$.', 'Multiplica por el inverso de $x_1 - x_2$, que es ' + d.inv + ', para despejar $a$. Después, $b = y_1 - a\\,x_1$.']; },
    steps: function (d) {
      return ['$' + d.y1 + ' \\equiv a\\cdot ' + d.x1 + ' + b$ y $' + d.y2 + ' \\equiv a\\cdot ' + d.x2 + ' + b$.',
        'Restando: $' + CR.mod(d.y1 - d.y2, 26) + ' \\equiv a\\cdot ' + CR.mod(d.x1 - d.x2, 26) + '$. El inverso de $' + CR.mod(d.x1 - d.x2, 26) + '$ es $' + d.inv + '$, así que $a \\equiv ' + CR.mod(d.y1 - d.y2, 26) + '\\cdot ' + d.inv + ' \\equiv ' + d.a + '$.',
        '$b \\equiv ' + d.y1 + ' - ' + d.a + '\\cdot ' + d.x1 + ' \\equiv ' + d.b + '$.',
        'Dos letras conocidas bastan para romper el afín entero: 312 claves no aguantan un ataque con texto conocido.'];
    },
    answer: function (d) { return 'a = ' + d.a + ', b = ' + d.b; }
  });

  p.keys([
    'Afín: $y = (ax + b) \\bmod 26$. Con $a = 1$ es el César.',
    'Se puede deshacer solo si $\\operatorname{mcd}(a, 26) = 1$: entonces existe $a^{-1}$ con $a\\,a^{-1} \\equiv 1$, y $x = a^{-1}(y - b)$.',
    'Doce valores válidos de $a$ por 26 de $b$: 312 claves. Dos letras conocidas lo rompen.',
    '<strong>Euclides extendido</strong> da $ax + ny = \\operatorname{mcd}(a, n)$; cuando el mcd es 1, $x$ es el inverso. Es la herramienta de todo el bloque.',
    '«Dividir» en aritmética modular es multiplicar por el inverso.'
  ]);
});
