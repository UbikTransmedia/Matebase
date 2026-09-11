/* Tema: El ordenador cuantico y el algoritmo de Shor */
Course.topic('cr-cuantico', function (p) {

  p.puente('[[cr-factorizar|Factorizar]] con las cribas cuesta un tiempo subexponencial, y en eso se apoya ' +
    '[[cr-rsa|RSA]]. Este tema muestra cómo un ordenador cuántico convierte la factorización en un ' +
    'problema de <strong>periodos</strong>, que sabe resolver, usando el [[cr-modular|orden de un ' +
    'número]] y, al fondo, una [[av-fourier|transformada de Fourier]]. Y qué queda en pie cuando ese ' +
    'ordenador exista.');

  p.text('Un ordenador cuántico no es un ordenador más rápido: es una máquina que, para ciertos ' +
    'problemas, prueba muchos caminos «a la vez» y hace que las respuestas malas se cancelen entre ' +
    'sí, dejando la buena. No sirve para casi nada, pero sí para dos cosas que rompen la ' +
    'criptografía: encontrar periodos, y buscar en una lista. Lo primero mata RSA y las curvas; lo ' +
    'segundo solo araña a AES.');

  /* ---------------------------------------------------------------- */
  p.section('Factorizar es encontrar un periodo');

  p.text('La parte que no necesita física es esta: factorizar $n$ se reduce a calcular el ' +
    '<strong>orden</strong> de un número. Se elige un $a$ al azar sin factores comunes con $n$, y se ' +
    'busca el menor $r$ con $a^r \\equiv 1 \\pmod n$: el orden, que es el periodo de la sucesión ' +
    '$a^1, a^2, a^3, \\dots$ módulo $n$. Si $r$ es par y $a^{r/2} \\ne -1$, entonces ' +
    '$a^{r/2} - 1$ y $a^{r/2} + 1$ comparten factores con $n$, y el máximo común divisor los ' +
    'entrega.');

  p.formula('a^{r} \\equiv 1 \\Rightarrow (a^{r/2} - 1)(a^{r/2} + 1) \\equiv 0 \\pmod n \\Rightarrow \\gcd(a^{r/2} \\pm 1,\\ n) \\text{ es un factor}',
    'de la factorización al orden',
    'Se lee: <em>«si a a la erre es uno, entonces a a la erre medios menos uno por a a la erre medios ' +
    'más uno es múltiplo de ene»</em>. El producto es $a^r - 1 \\equiv 0$; como $n$ divide al ' +
    'producto pero (con suerte) no a cada factor, reparte sus primos entre los dos, y el mcd los ' +
    'separa.<br><br>Todo esto es aritmética clásica. Lo único que un ordenador normal no sabe hacer ' +
    'deprisa es encontrar el periodo $r$: la sucesión salta sin orden, como en el logaritmo ' +
    'discreto. Eso es lo que hace el ordenador cuántico.');

  p.demo({
    title: 'Factorizar por el orden',
    intro: 'Elige $n$ y una base $a$. La demo calcula el periodo $r$ de las potencias de $a$ (lo que el ordenador cuántico haría), y con él intenta partir $n$. Prueba varias bases: algunas dan un $r$ impar o un $a^{r/2} \\equiv -1$ y no sirven; se cambia de base.',
    predice: 'Para $n = 15$ y $a = 2$: las potencias son 2, 4, 8, 1, 2, 4… ¿Cuál es el periodo, y qué factores salen de $2^{r/2} \\pm 1$?',
    build: function (host) {
      var n = 15, a = 2;
      var out = W.mono(host, '');
      function pinta() {
        a = Math.min(a, n - 1);
        var g0 = ML.gcd(a, n);
        if (g0 !== 1) { out.set('$a = ' + a + '$ ya comparte el factor ' + g0 + ' con $n = ' + n + '$: factor gratis, sin periodo. Elige un $a$ primo con $n$.'); return; }
        var r = CR.orden(a, n), pot = [], v = 1;
        for (var i = 1; i <= Math.min(r, 12); i++) { v = v * a % n; pot.push(v); }
        var h = '<b>n = ' + n + '</b>, a = ' + a + '\npotencias de a mod n: ' + pot.join(', ') + (r > 12 ? ', …' : '') + '\n<b>periodo r = ' + r + '</b>\n\n';
        if (r % 2 !== 0) h += '<span class="cr-dif">r es impar: esta base no sirve. Se prueba otra.</span>';
        else {
          var x = CR.potMod(a, r / 2, n);
          if (x === n - 1) h += 'a^(r/2) = ' + x + ' ≡ −1: <span class="cr-dif">esta base no sirve.</span>';
          else { var f1 = ML.gcd(x - 1, n), f2 = ML.gcd(x + 1, n); h += 'a^(r/2) = ' + x + '\ngcd(' + (x - 1) + ', ' + n + ') = <b>' + f1 + '</b>,  gcd(' + (x + 1) + ', ' + n + ') = <b>' + f2 + '</b>\n<span class="cr-ok">' + n + ' = ' + f1 + ' × ' + f2 + '</span>'; }
        }
        out.set(h);
      }
      W.chips(host, [{ label: 'n = 15', value: 15 }, { label: 'n = 21', value: 21 }, { label: 'n = 33', value: 33 }, { label: 'n = 55', value: 55 }, { label: 'n = 77', value: 77 }], { value: n, on: function (v) { n = v; a = 2; pinta(); } });
      W.slider(W.row(host), { label: 'base a', min: 2, max: 76, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Factorizar 21 con el orden',
    enunciado: 'Factorizar $n = 21$ eligiendo $a = 2$: encontrar el periodo, y partir $n$.',
    pasos: [
      { t: '<strong>Las potencias.</strong> $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 16$, $2^5 = 32 \\equiv 11$, $2^6 = 64 \\equiv 1$. Vuelve al 1 en el paso 6.', antes: 'Multiplica por 2 módulo 21 hasta volver a 1.' },
      { t: '<strong>El periodo.</strong> $r = 6$, que es par. Buena señal.', antes: '¿Es par el periodo?' },
      { t: '<strong>El punto medio.</strong> $a^{r/2} = 2^3 = 8$, que no es $\\pm 1$ módulo 21. Otra buena señal.', antes: '¿Vale $2^3$ módulo 21? ¿Es 1 o 20?' },
      { t: '<strong>Los factores.</strong> $\\gcd(8 - 1, 21) = \\gcd(7, 21) = 7$ y $\\gcd(8 + 1, 21) = \\gcd(9, 21) = 3$. $21 = 3\\cdot 7$ ✓.', antes: 'Máximo común divisor de $8 \\pm 1$ con 21.' }
    ],
    cierre: 'Todo el trabajo, salvo encontrar el 6, lo hace un ordenador normal. El 6 es lo que el ordenador cuántico saca de un golpe, y con $n$ de 600 cifras es lo único que separa a RSA de estar roto.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Cómo encuentra el periodo: interferencia');

  p.text('El ordenador cuántico prepara un estado que contiene <em>todas</em> las potencias ' +
    '$a^0, a^1, a^2, \\dots$ a la vez, y les aplica una <strong>transformada de Fourier</strong>. La ' +
    'sucesión de potencias es periódica de periodo $r$, y la transformada de Fourier de algo ' +
    'periódico se concentra en las frecuencias múltiplos de $1/r$: al medir, sale con altísima ' +
    'probabilidad un número del que se despeja $r$. Es la misma idea por la que un afinador detecta ' +
    'la frecuencia de una cuerda: Fourier convierte «se repite cada $r$» en «un pico en $1/r$».');

  p.demo({
    title: 'Fourier ve el periodo',
    intro: 'La sucesión $a^k \\bmod n$ es periódica. Abajo, la magnitud de su transformada de Fourier: en vez de estar repartida, se concentra en picos separados por $N/r$. Ahí es donde el ordenador cuántico «mide» y lee el periodo. Cambia $a$ y $n$ y mira cómo se mueven los picos.',
    predice: 'Si el periodo es $r = 6$ sobre una ventana de $N = 64$ valores, ¿cuántos picos aparecerán, y a qué distancia unos de otros?',
    build: function (host) {
      var n = 21, a = 2, N = 64;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: 0, ymax: 1.1, height: 260, xlabel: 'frecuencia', ylabel: '|transformada|',
        aria: 'La transformada de Fourier de una sucesión periódica, concentrada en picos igualmente espaciados',
        draw: function (g) {
          var seq = []; var v = 1; for (var k = 0; k < N; k++) { seq.push(v === 1 ? 1 : 0); v = v * a % n; }
          var mag = [], max = 0;
          for (var f = 0; f < N; f++) { var re = 0, im = 0; for (var t = 0; t < N; t++) { var ang = -2 * Math.PI * f * t / N; re += seq[t] * Math.cos(ang); im += seq[t] * Math.sin(ang); } var m = Math.sqrt(re * re + im * im); mag.push(m); if (m > max) max = m; }
          for (f = 0; f < N; f++) g.bars([{ x: f, h: mag[f] / max, color: 0 }], { width: 0.5 });
        }
      });
      function pinta() { var r = CR.orden(a, n); plot.render(); out.set('$n = ' + n + '$, $a = ' + a + '$, periodo $r = ' + r + '$. Los picos aparecen cada $N/r = ' + U.fmt(N / r, 1) + '$ posiciones: de un pico se despeja $r$.'); }
      W.chips(host, [{ label: 'n=21, a=2', value: '21,2' }, { label: 'n=33, a=2', value: '33,2' }, { label: 'n=35, a=3', value: '35,3' }, { label: 'n=55, a=2', value: '55,2' }], { value: '21,2', on: function (v) { var p = v.split(','); n = +p[0]; a = +p[1]; pinta(); } });
      pinta();
    }
  });

  p.comprueba('¿Por qué un ordenador cuántico no rompe AES-256 tan a fondo como RSA?', [
    { t: 'Porque contra una clave simétrica solo tiene el algoritmo de Grover, que da la raíz cuadrada: $2^{128}$, aún inalcanzable. Contra RSA, Shor factoriza en tiempo polinómico', ok: true, por: 'Grover reduce $2^{256}$ a $2^{128}$: molesto pero seguro, y basta doblar la clave. Shor, en cambio, convierte la factorización de subexponencial a polinómica: RSA cae del todo.' },
    { t: 'Porque AES no usa números primos', ok: false, por: 'El motivo no es ese, sino que el ataque cuántico contra lo simétrico (Grover) es mucho más débil que el que hay contra lo asimétrico (Shor).' },
    { t: 'Porque AES es más nuevo', ok: false, por: 'La antigüedad no interviene. Lo que cuenta es qué algoritmo cuántico se aplica: Grover, que solo da raíz cuadrada, o Shor, que da tiempo polinómico.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Qué rompe y qué no');

  p.table(['Sistema', 'Ataque cuántico', 'Efecto'], [
    ['RSA', 'Shor (factorizar)', 'roto: tiempo polinómico'],
    ['Diffie-Hellman, ElGamal', 'Shor (logaritmo discreto)', 'roto'],
    ['Curvas elípticas', 'Shor (logaritmo en la curva)', 'roto, y antes que RSA por ser claves más cortas'],
    ['AES-128', 'Grover', 'seguridad efectiva 64 bits: se pasa a AES-256'],
    ['AES-256', 'Grover', 'seguridad efectiva 128 bits: sigue seguro'],
    ['SHA-256', 'Grover (colisiones y preimágenes)', 'se reduce a la mitad: sigue seguro con margen']
  ]);

  p.text('La conclusión es nítida: toda la <strong>clave pública</strong> de hoy cae, y lo ' +
    '<strong>simétrico</strong> aguanta doblando tamaños. El problema no es solo del futuro: un ' +
    'adversario puede grabar hoy el tráfico cifrado y descifrarlo el día que tenga la máquina, ' +
    '«cosechar ahora, descifrar después». Por eso la migración a criptografía poscuántica, el tema ' +
    'siguiente, ya ha empezado, aunque el ordenador cuántico capaz de romper RSA-2048 todavía no ' +
    'exista: haría falta uno con millones de cúbits estables, y los mayores de hoy tienen unos ' +
    'pocos cientos ruidosos.');

  p.util('En 2016, un ordenador cuántico factorizó 15 con el algoritmo de Shor; en 2019, 21, con enorme ' +
    'esfuerzo. De ahí a los 617 dígitos de RSA-2048 hay un abismo de ingeniería. Aun así, los ' +
    'gobiernos y las grandes empresas ya migran: los navegadores prueban desde 2023 un intercambio de ' +
    'claves híbrido, curva elíptica clásica más un sistema poscuántico, para que grabar hoy no sirva ' +
    'mañana. Y las agencias han fijado plazos: la clave pública clásica debe estar retirada de los ' +
    'sistemas críticos antes de 2035.');

  p.hist('Peter Shor, en los laboratorios Bell, publicó su algoritmo en 1994: factorización y logaritmo ' +
    'discreto en tiempo polinómico en un ordenador cuántico. Fue el resultado que convirtió la ' +
    'computación cuántica de curiosidad en amenaza, y disparó su financiación. Lov Grover dio en 1996 ' +
    'la búsqueda con raíz cuadrada. En 2001, IBM factorizó 15 en $3\\cdot 5$ con siete cúbits; en ' +
    '2016, el NIST abrió el concurso de criptografía poscuántica, cuyos primeros estándares salieron ' +
    'en 2024.');

  p.trampas([
    { e: 'Creer que un ordenador cuántico es un ordenador rápido', por: 'Solo acelera problemas con la estructura adecuada, como los periodos. Para la mayoría de las tareas no aporta nada.' },
    { e: 'Pensar que rompe AES igual que RSA', por: 'A RSA lo mata (Shor, polinómico); a AES solo le quita la mitad de bits (Grover). AES-256 sigue seguro.' },
    { e: 'Confiar en que «aún no existe la máquina»', por: 'El tráfico grabado hoy se descifra el día que exista: cosechar ahora, descifrar después. Por eso la migración ya corre.' },
    { e: 'Olvidar el factor par y el $-1$', por: 'El truco del orden solo sirve si $r$ es par y $a^{r/2} \\ne -1$. Si no, se cambia de base $a$; la mayoría funcionan.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El periodo de una base',
    level: 'basico',
    gen: function (r) { var n = r.pick([15, 21, 33, 35, 39, 55]), a = r.int(2, n - 1); if (ML.gcd(a, n) !== 1) return null; return { n: n, a: a, r: CR.orden(a, n) }; },
    ask: function (d) { return 'Calcula el orden de $' + d.a + '$ módulo $' + d.n + '$, es decir, el periodo de la sucesión $' + d.a + '^1, ' + d.a + '^2, \\dots$ módulo $' + d.n + '$: el menor $r$ con $' + d.a + '^r \\equiv 1$.'; },
    fields: [{ name: 'r', label: 'periodo r', w: 'tiny' }],
    sol: function (d) { return { r: d.r }; },
    hint: function (d) { return 'Ve multiplicando por ' + d.a + ' módulo ' + d.n + ' y cuenta hasta volver a 1.'; },
    steps: function (d) { var v = 1, l = []; for (var k = 1; k <= d.r; k++) { v = v * d.a % d.n; l.push(d.a + '^' + k + '≡' + v); } return ['$' + l.join(',\\ ') + '$.', 'Vuelve a 1 en $r = ' + d.r + '$.']; },
    answer: function (d) { return String(d.r); }
  });

  p.exercise({
    title: '¿Sirve esta base?',
    level: 'medio',
    gen: function (r) { var n = r.pick([15, 21, 33, 35, 39, 55, 77]), a = r.int(2, n - 1); if (ML.gcd(a, n) !== 1) return null; var rr = CR.orden(a, n), x = CR.potMod(a, Math.floor(rr / 2), n); var sirve = rr % 2 === 0 && x !== n - 1; return { n: n, a: a, r: rr, par: rr % 2 === 0, x: x, sirve: sirve }; },
    ask: function (d) { return 'Para factorizar $n = ' + d.n + '$ con la base $a = ' + d.a + '$, el periodo es $r = ' + d.r + '$. ¿Sirve esta base? Una base sirve si $r$ es par y $a^{r/2} \\ne -1 \\pmod n$.'; },
    fields: [{ name: 'q', label: 'sirve', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { q: d.sirve ? 'si' : 'no' }; },
    hint: function (d) { return d.par ? 'Es par: calcula $a^{r/2} = ' + d.a + '^{' + (d.r / 2) + '} \\bmod ' + d.n + '$ y mira si es ' + (d.n - 1) + ' (que es −1).' : 'El periodo es impar.'; },
    steps: function (d) { if (!d.par) return ['$r = ' + d.r + '$ es impar: <strong>no sirve</strong>, se cambia de base.']; return ['$r = ' + d.r + '$ es par, y $a^{r/2} = ' + d.x + '$' + (d.x === d.n - 1 ? ' ≡ −1: <strong>no sirve</strong>.' : ' ≠ −1: <strong>sí sirve</strong>, y da los factores $\\gcd(' + d.x + '\\pm 1, ' + d.n + ')$.')]; },
    answer: function (d) { return d.sirve ? 'sí' : 'no'; }
  });

  p.exercise({
    title: 'De periodo a factores',
    level: 'medio',
    gen: function (r) { var casos = [[15, 2], [15, 7], [21, 2], [33, 2], [35, 3], [55, 2], [77, 2]]; var c = r.pick(casos), n = c[0], a = c[1], rr = CR.orden(a, n); if (rr % 2 !== 0) return null; var x = CR.potMod(a, rr / 2, n); if (x === n - 1) return null; return { n: n, a: a, r: rr, x: x, f1: ML.gcd(x - 1, n), f2: ML.gcd(x + 1, n) }; },
    ask: function (d) { return 'Se sabe que $' + d.a + '^{' + d.r + '} \\equiv 1 \\pmod{' + d.n + '}$, con periodo $r = ' + d.r + '$. Calcula $' + d.a + '^{r/2} \\bmod ' + d.n + '$ y, con él, los dos factores de $' + d.n + '$ mediante los máximos comunes divisores.'; },
    fields: [{ name: 'x', label: 'a^(r/2)', w: 'tiny' }, { name: 'f1', label: 'un factor', w: 'tiny' }, { name: 'f2', label: 'el otro', w: 'tiny' }],
    sol: function (d) { return { x: d.x, f1: Math.min(d.f1, d.f2), f2: Math.max(d.f1, d.f2) }; },
    check: function (v, d) { var okX = v.x === d.x, fs = [d.f1, d.f2].sort(function (a, b) { return a - b; }); var okF = (v.f1 === fs[0] && v.f2 === fs[1]) || (v.f1 === fs[1] && v.f2 === fs[0]); if (okX && okF) return { ok: true }; if (okX && v.f1 * v.f2 === d.n && v.f1 > 1 && v.f2 > 1) return { ok: true }; return { ok: false, msg: '$a^{r/2} = ' + d.x + '$, y los factores son $\\gcd(' + d.x + '\\pm 1, ' + d.n + ')$.', fields: { x: okX, f1: okF, f2: okF } }; },
    hint: function (d) { return ['$r/2 = ' + (d.r / 2) + '$: calcula $' + d.a + '^{' + (d.r / 2) + '} \\bmod ' + d.n + '$.', 'Los factores: $\\gcd(a^{r/2} - 1, n)$ y $\\gcd(a^{r/2} + 1, n)$.']; },
    steps: function (d) { return ['$' + d.a + '^{' + (d.r / 2) + '} \\bmod ' + d.n + ' = ' + d.x + '$.', '$\\gcd(' + (d.x - 1) + ', ' + d.n + ') = ' + d.f1 + '$, $\\gcd(' + (d.x + 1) + ', ' + d.n + ') = ' + d.f2 + '$.', '$' + d.n + ' = ' + d.f1 + '\\cdot ' + d.f2 + '$.']; },
    answer: function (d) { return d.x + ' → ' + Math.min(d.f1, d.f2) + '·' + Math.max(d.f1, d.f2); }
  });

  p.exercise({
    title: 'Tamaños poscuánticos',
    level: 'medio',
    gen: function (r) { var casos = [{ s: 'AES-128', v: 'grover', r: '64 bits: se dobla la clave a AES-256' }, { s: 'RSA-2048', v: 'shor', r: 'roto: hay que cambiar de familia' }, { s: 'una curva elíptica P-256', v: 'shor', r: 'roto: hay que cambiar de familia' }, { s: 'AES-256', v: 'grover-ok', r: '128 bits: sigue seguro' }, { s: 'SHA-256', v: 'grover-ok', r: '128 bits contra colisiones: sigue seguro' }, { s: 'Diffie-Hellman clásico', v: 'shor', r: 'roto: hay que cambiar de familia' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return '¿Qué le hace un ordenador cuántico grande a ' + d.c.s + '?'; },
    fields: [{ name: 'q', label: 'Efecto', opts: [{ t: 'roto por Shor', v: 'shor' }, { t: 'Grover le quita la mitad de bits, hay que doblar', v: 'grover' }, { t: 'Grover le quita la mitad, pero sigue seguro', v: 'grover-ok' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Clave pública (RSA, Diffie-Hellman, curvas): Shor la rompe. Simétrico y hash: Grover solo da la raíz cuadrada.'; },
    steps: function (d) { return [d.c.r]; },
    answer: function (d) { return d.c.r; }
  });

  p.exercise({
    title: 'Grover contra una clave',
    level: 'avanzado',
    gen: function (r) { var b = r.pick([128, 192, 256]); return { b: b, clasico: b, cuantico: b / 2 }; },
    ask: function (d) { return 'Una clave simétrica de ' + d.b + ' bits. La fuerza bruta clásica cuesta $2^{' + d.b + '}$ (de media $2^{' + (d.b - 1) + '}$). El algoritmo de Grover da la raíz cuadrada del número de claves. ¿A cuántos bits de seguridad equivale contra un ordenador cuántico?'; },
    fields: [{ name: 'q', label: 'bits efectivos', w: 'tiny' }],
    sol: function (d) { return { q: d.cuantico }; },
    hint: function () { return 'Raíz cuadrada de $2^b$ es $2^{b/2}$: la mitad de los bits.'; },
    steps: function (d) { return ['Grover: $\\sqrt{2^{' + d.b + '}} = 2^{' + d.cuantico + '}$ operaciones.', 'Equivale a <strong>' + d.cuantico + '</strong> bits.', d.cuantico >= 128 ? 'Sigue por encima de 128: seguro. Por eso AES-256 basta contra lo cuántico.' : 'Por debajo de 128: se recomienda subir a una clave mayor.']; },
    answer: function (d) { return d.cuantico + ' bits'; }
  });

  p.keys([
    'Factorizar $n$ se reduce a hallar el orden $r$ de un $a$: si $r$ es par y $a^{r/2} \\ne -1$, $\\gcd(a^{r/2} \\pm 1, n)$ da un factor.',
    'Lo único que el ordenador clásico no sabe hacer deprisa es encontrar el periodo; el cuántico lo saca con una transformada de Fourier.',
    'Shor rompe RSA, Diffie-Hellman y las curvas en tiempo polinómico: toda la clave pública de hoy cae.',
    'Grover solo da la raíz cuadrada: AES-256 y SHA-256 aguantan; AES-128 se dobla.',
    '«Cosechar ahora, descifrar después» obliga a migrar ya, aunque la máquina capaz de romper RSA-2048 no exista todavía.'
  ]);
});
