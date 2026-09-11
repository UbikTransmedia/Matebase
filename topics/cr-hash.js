/* Tema: Funciones hash: la huella digital de los datos */
Course.topic('cr-hash', function (p) {

  p.puente('El [[cr-bloque|efecto avalancha]] de los cifrados por bloques reaparece aquí en una función ' +
    'sin clave y sin inversa. Para entender lo que promete hace falta la ' +
    '[[pe-probabilidad|probabilidad]] de una coincidencia, la misma del problema de los cumpleaños, y ' +
    'lo que sale es la herramienta más usada de todo el bloque.');

  p.text('Una función hash toma cualquier cosa, una letra o una película entera, y devuelve un número ' +
    'de tamaño fijo, 256 bits, que parece aleatorio y es siempre el mismo para la misma entrada. ' +
    'Es una <strong>huella digital</strong>: no permite reconstruir la entrada, pero identifica ' +
    'cualquier cambio en ella. No tiene clave, no cifra nada, y sin embargo está en las firmas, en ' +
    'las contraseñas, en las descargas, en el control de versiones y en las cadenas de bloques.');

  /* ---------------------------------------------------------------- */
  p.section('Qué promete una función hash');

  p.list([
    '<strong>Resistencia a la preimagen</strong>: dado un hash $h$, no se puede encontrar ningún mensaje $m$ con $H(m) = h$. La huella no se deshace.',
    '<strong>Resistencia a la segunda preimagen</strong>: dado un mensaje $m_1$, no se puede encontrar otro $m_2$ con la misma huella. Nadie puede sustituir un documento por otro con la misma huella.',
    '<strong>Resistencia a colisiones</strong>: no se puede encontrar <em>ningún</em> par $m_1 \\ne m_2$ con la misma huella, eligiendo los dos libremente. Es la más exigente, y la que cae primero.'
  ]);

  p.text('Además, un cambio de un solo bit en la entrada cambia, de media, la mitad de los bits de la ' +
    'salida: es la avalancha de los cifrados por bloques, y con ella la huella de dos documentos ' +
    'casi iguales no se parece en nada. La demo usa SHA-256, la función que se usa hoy en casi todo, ' +
    'calculada de verdad en tu navegador.');

  p.demo({
    title: 'SHA-256 en directo',
    intro: 'Escribe dos textos, aunque solo se diferencien en una coma. Las cifras hexadecimales marcadas son las que difieren, y abajo se cuentan los bits distintos de los 256.',
    predice: 'Si los dos textos se diferencian en una sola letra, ¿cuántos de los 64 dígitos hexadecimales del hash coincidirán: casi todos, la mitad, o unos 4?',
    build: function (host) {
      var t1 = 'Transfiere 100 euros a Benito', t2 = 'Transfiere 100 euros a Benita';
      var out = W.mono(host, '');
      function pinta() {
        var h1 = CR.sha256Bytes(t1), h2 = CR.sha256Bytes(t2), dif = CR.hamming(h1, h2), iguales = 0;
        var x1 = CR.hex(h1), x2 = CR.hex(h2);
        for (var i = 0; i < 64; i++) if (x1.charAt(i) === x2.charAt(i)) iguales++;
        out.set('<b>SHA-256(texto 1)</b>\n' + x1.replace(/(.{32})/, '$1\n') + '\n<b>SHA-256(texto 2)</b>\n' + x2.split('').map(function (c, i) { return c === x1.charAt(i) ? c : '<span class="cr-dif">' + c + '</span>'; }).join('').replace(/^((?:<span class="cr-dif">.<\/span>|.){32})/, '$1\n') +
          '\n\n' + (t1 === t2 ? '<span class="cr-ok">textos iguales: hashes iguales</span>' : dif + ' de 256 bits distintos (' + U.fmt(100 * dif / 256, 0) + ' %) · ' + iguales + ' de 64 cifras hexadecimales coinciden' + (iguales < 12 ? ', lo que cabe esperar del azar (1 de cada 16)' : '')));
      }
      W.texto(host, { label: 'texto 1', value: t1, on: function (v) { t1 = v; pinta(); } });
      W.texto(host, { label: 'texto 2', value: t2, on: function (v) { t2 = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Una web publica el SHA-256 de un programa junto al enlace de descarga. ¿Contra qué protege comprobarlo?', [
    { t: 'Contra descargas corruptas o alteradas por el camino, siempre que el hash publicado venga de una fuente en la que se confíe', ok: true, por: 'Cualquier cambio en el archivo cambia el hash. Pero si quien altera el archivo puede alterar también la página con el hash, la comprobación no vale nada: el hash no lleva clave y no prueba quién lo publicó. Para eso están las firmas.' },
    { t: 'Contra todo: si el hash coincide, el programa es seguro', ok: false, por: 'El hash prueba que tienes exactamente el archivo cuyo hash se publicó, no que ese archivo sea bueno. Un programa malicioso tiene un hash perfectamente válido.' },
    { t: 'Contra nada, porque el hash no está cifrado', ok: false, por: 'No hace falta que lo esté: lo que importa es que nadie pueda fabricar otro archivo con el mismo hash, y eso es la resistencia a la segunda preimagen.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('La paradoja del cumpleaños');

  p.text('Con 256 bits hay $2^{256}$ huellas posibles, más que átomos en el universo. Parecería que ' +
    'encontrar dos documentos con la misma huella exige probar del orden de $2^{256}$. Pero eso es ' +
    'lo que cuesta encontrar un documento con <em>una huella dada</em>. Encontrar dos ' +
    '<em>cualesquiera</em> que coincidan es mucho más barato, por la misma razón por la que en una ' +
    'clase de 23 personas es más probable que no que dos cumplan años el mismo día.');

  p.formula('P(\\text{alguna coincidencia entre } k) \\approx 1 - e^{-k^2 / (2N)}, \\qquad k \\approx 1{,}18\\sqrt{N} \\text{ para } P = \\tfrac12',
    'la paradoja del cumpleaños',
    'Se lee: <em>«la probabilidad de alguna coincidencia entre ka elementos es aproximadamente uno menos ' +
    'e elevado a menos ka al cuadrado partido por dos ene»</em>, donde $N$ es el número de valores ' +
    'posibles.<br><br>Con $N = 365$ días, $k = 23$ personas dan $P \\approx 0{,}5$. Con un hash de $n$ ' +
    'bits, $N = 2^n$ y hacen falta unos $2^{n/2}$ intentos: para 256 bits, $2^{128}$. Por eso las ' +
    'huellas miden el doble de lo que parecería necesario: una función de 128 bits tendría ' +
    'colisiones a $2^{64}$, y eso hoy se hace.');

  p.demo({
    title: 'Colisiones en un hash de juguete',
    intro: 'Un hash de 16 bits, los primeros 16 de SHA-256, tiene 65 536 valores. La demo genera cadenas al azar hasta que dos tienen la misma huella y cuenta cuántas ha necesitado. Repite varias veces: el promedio ronda $1{,}25\\sqrt{65\\,536} \\approx 320$, no 65 536.',
    predice: '¿Cuántas cadenas al azar harán falta, de media, para que dos tengan el mismo hash de 16 bits: unas 300, unas 30 000 o unas 65 000?',
    build: function (host) {
      var out = W.mono(host, ''), r = U.rng(99), cuentas = [];
      function busca() {
        var vistos = {}, n = 0;
        while (true) {
          var s = 'm' + r.int(0, 1e9), h = CR.hashCorto(s, 16);
          n++;
          if (vistos[h] !== undefined) { cuentas.push(n); return { a: vistos[h], b: s, h: h, n: n }; }
          vistos[h] = s;
        }
      }
      function corre() {
        var c = busca(), media = cuentas.reduce(function (a, b) { return a + b; }, 0) / cuentas.length;
        out.set('<b>colisión:</b> hash16(«' + c.a + '») = hash16(«' + c.b + '») = ' + CR.bits(c.h, 16) + '\n<b>intentos:</b> ' + c.n + '\n\n' + cuentas.length + ' búsquedas, media de <b>' + U.fmt(media, 0) + '</b> intentos   <span class="cr-tenue">(√65 536 = 256; la teoría dice 1,25 · 256 ≈ 320)</span>\nSHA-256 de «' + c.a + '»: ' + CR.sha256(c.a).slice(0, 4) + '…   SHA-256 de «' + c.b + '»: ' + CR.sha256(c.b).slice(0, 4) + '…  <span class="cr-tenue">(coinciden solo los primeros 16 bits)</span>');
      }
      W.buttons(host, [{ t: 'Buscar otra colisión', cls: 'btn--main', on: corre }]);
      corre();
    }
  });

  p.ejemplo({
    title: 'Cumpleaños, huellas y cuántos bits hacen falta',
    enunciado: 'Calcular la probabilidad de que en un grupo de 30 personas dos cumplan años el mismo día. Después, cuántos documentos hay que generar para tener un 50 % de probabilidad de colisión con un hash de 64 bits, y cuántos bits debe tener una huella para que ese ataque cueste $2^{128}$.',
    pasos: [
      { t: '<strong>Treinta personas.</strong> $N = 365$, $k = 30$: $k^2 / (2N) = 900 / 730 = 1{,}23$, y $P \\approx 1 - e^{-1{,}23} = 0{,}71$. El valor exacto, multiplicando $\\frac{364}{365}\\cdot\\frac{363}{365}\\cdots$, es $0{,}706$.', antes: 'Aplica la fórmula con $k = 30$ y $N = 365$.' },
      { t: '<strong>Un hash de 64 bits.</strong> $N = 2^{64}$, y para $P = 1/2$ hacen falta $k \\approx 1{,}18\\cdot 2^{32} \\approx 5\\cdot 10^9$ documentos. Un ordenador normal los genera en una hora.', antes: '$\\sqrt{2^{64}}$: ¿cuánto es?' },
      { t: '<strong>Para $2^{128}$.</strong> Como el coste es $2^{n/2}$, hacen falta $n = 256$ bits. Por eso SHA-256 tiene 256: no porque haga falta esa resistencia a la preimagen, sino para que las colisiones cuesten $2^{128}$.', antes: 'Si el ataque cuesta $2^{n/2}$, ¿qué $n$ da $2^{128}$?' },
      { t: '<strong>Lo que no dice la fórmula.</strong> Esto es lo que cuesta si el hash es perfecto. MD5, de 128 bits, debería costar $2^{64}$, y se rompió con $2^{24}$ por defectos de diseño: la fórmula es el mejor caso.' }
    ],
    cierre: 'Preimagen: $2^n$. Colisión: $2^{n/2}$. Esa raíz cuadrada es la que decide el tamaño de todas las huellas.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Cómo se construye');

  p.text('SHA-256 procesa el mensaje en bloques de 512 bits. Empieza con un estado de 256 bits fijado ' +
    'por el estándar, y para cada bloque aplica una <strong>función de compresión</strong> que mezcla ' +
    'el estado con el bloque en 64 rondas de sumas, rotaciones y XOR, y devuelve un estado nuevo. El ' +
    'último estado es la huella. Antes se rellena el mensaje con un 1, ceros y su longitud en bits, ' +
    'para que dos mensajes de longitudes distintas no puedan rellenarse igual.');

  p.formula('h_0 = \\text{IV}, \\qquad h_i = f(h_{i-1}, M_i), \\qquad H(M) = h_t', 'la construcción de Merkle y Damgård',
    'Se lee: <em>«hache sub i es efe de hache sub i menos uno y el bloque i»</em>. Merkle y Damgård ' +
    'demostraron que si $f$ resiste colisiones, $H$ también. Casi todas las funciones hash del siglo ' +
    'XX se construyeron así.<br><br>Tiene una peculiaridad: quien conoce $H(M)$ y la longitud de $M$ ' +
    'puede seguir calculando $H(M \\Vert \\text{relleno} \\Vert M^{*})$ sin conocer $M$, porque el hash es ' +
    'el estado. Es la <em>extensión de longitud</em>, y en el tema siguiente da un ataque.');

  p.table(['Función', 'Bits', 'Año', 'Estado'], [
    ['MD5', '128', '1991', 'colisiones en segundos desde 2004; no usar'],
    ['SHA-1', '160', '1995', 'colisión práctica en 2017 (SHAttered); retirada'],
    ['SHA-256', '256', '2001', 'en uso en casi todo; sin ataques conocidos'],
    ['SHA-3', '224 a 512', '2015', 'construcción distinta, de esponja; en uso'],
    ['BLAKE3', '256', '2020', 'muy rápida; en uso creciente']
  ]);

  p.util('Cada vez que descargas un programa, el instalador comprueba su hash. El control de versiones ' +
    'git identifica cada versión de un proyecto por el hash de su contenido, y por eso dos ' +
    'desarrolladores en dos continentes saben que tienen exactamente el mismo archivo sin ' +
    'compararlo. Los servicios de almacenamiento detectan archivos duplicados por su hash y los ' +
    'guardan una sola vez. Los certificados de las webs se identifican por su huella. Y las ' +
    'contraseñas, las firmas digitales y las cadenas de bloques, que vienen en los temas ' +
    'siguientes, son funciones hash con algo más.');

  p.hist('Ralph Merkle propuso las funciones hash criptográficas en su tesis de 1979, e Ivan Damgård ' +
    'demostró la construcción en 1989. Ron Rivest diseñó MD4 y MD5 (1990, 1991); Xiaoyun Wang y su ' +
    'equipo encontraron colisiones de MD5 en 2004 y anunciaron un ataque a SHA-1 en 2005. La colisión ' +
    'práctica de SHA-1 la publicaron Google y el CWI de Ámsterdam en 2017, tras $2^{63}$ operaciones: ' +
    'dos PDF distintos con la misma huella. SHA-2 lo publicó la NSA en 2001, y SHA-3 salió de un ' +
    'concurso público, como AES, ganado en 2012 por Keccak.');

  p.trampas([
    { e: 'Creer que 128 bits de huella bastan', por: 'Las colisiones cuestan $2^{n/2}$: con 128 bits, $2^{64}$, que hoy se calcula. Por eso las huellas tienen 256.' },
    { e: 'Usar MD5 o SHA-1 «porque es rápido»', por: 'Se fabrican colisiones en segundos (MD5) o con esfuerzo asequible (SHA-1). Dos documentos con la misma huella rompen cualquier cosa construida encima.' },
    { e: 'Tomar el hash por un cifrado', por: 'No hay clave ni inversa. El hash de una contraseña corta se «invierte» probando candidatos, y el de un documento no esconde su contenido a quien pueda adivinarlo.' },
    { e: 'Comprobar un hash publicado en el mismo sitio que el archivo', por: 'Quien cambie el archivo cambia el hash de la página. Un hash sin firma solo protege contra errores de transmisión.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El tamaño de una huella',
    level: 'basico',
    gen: function (r) { var n = r.pick([128, 160, 224, 256, 384, 512]); return { n: n, bytes: n / 8, hex: n / 4 }; },
    ask: function (d) { return 'Una función hash produce huellas de ' + d.n + ' bits. ¿Cuántos bytes son, y cuántas cifras hexadecimales ocupa la huella escrita?'; },
    fields: [{ name: 'b', label: 'bytes', w: 'tiny' }, { name: 'h', label: 'cifras hex', w: 'tiny' }],
    sol: function (d) { return { b: d.bytes, h: d.hex }; },
    hint: function () { return 'Un byte son 8 bits; una cifra hexadecimal, 4.'; },
    steps: function (d) { return ['$' + d.n + ' / 8 = ' + d.bytes + '$ bytes.', '$' + d.n + ' / 4 = ' + d.hex + '$ cifras hexadecimales.', 'Hay $2^{' + d.n + '}$ huellas posibles.']; },
    answer: function (d) { return d.bytes + ' bytes, ' + d.hex + ' cifras'; }
  });

  p.exercise({
    title: 'Cumpleaños compartidos',
    level: 'basico',
    gen: function (r) { var k = r.int(10, 50); var q = 1; for (var i = 1; i < k; i++) q *= (365 - i) / 365; return { k: k, p: 1 - q, aprox: 1 - Math.exp(-k * k / 730) }; },
    ask: function (d) { return 'En un grupo de ' + d.k + ' personas, ¿cuál es la probabilidad de que al menos dos cumplan años el mismo día? Usa la aproximación $1 - e^{-k^2/(2N)}$ con $N = 365$. (dos decimales)'; },
    fields: [{ name: 'p', label: 'probabilidad', w: 'tiny' }],
    sol: function (d) { return { p: d.aprox }; },
    dec: 2, tol: 0.02,
    hint: function (d) { return '$k^2 / (2N) = ' + d.k + '^2 / 730 = ' + U.fmt(d.k * d.k / 730, 3) + '$.'; },
    steps: function (d) { return ['$k^2 / (2N) = ' + U.fmt(d.k * d.k / 730, 3) + '$.', '$P \\approx 1 - e^{-' + U.fmt(d.k * d.k / 730, 3) + '} = ' + U.fmt(d.aprox, 2) + '$.', 'El valor exacto, con el producto $\\frac{364}{365}\\cdot\\frac{363}{365}\\cdots$, es $' + U.fmt(d.p, 2) + '$.']; },
    answer: function (d) { return U.fmt(d.aprox, 2); }
  });

  p.exercise({
    title: 'Cuánto cuesta una colisión',
    level: 'medio',
    gen: function (r) { var n = r.pick([32, 40, 48, 64, 80, 128, 160, 256]); return { n: n, col: n / 2, pre: n }; },
    ask: function (d) { return 'Una función hash perfecta de ' + d.n + ' bits. ¿Del orden de cuántos intentos cuesta encontrar una colisión, y cuántos una preimagen? Da los exponentes: $2^{\\,?}$.'; },
    fields: [{ name: 'c', label: 'colisión: 2^', w: 'tiny' }, { name: 'p', label: 'preimagen: 2^', w: 'tiny' }],
    sol: function (d) { return { c: d.col, p: d.pre }; },
    errores: [{ si: function (v, d) { return v.c === d.n; }, msg: 'Eso es la preimagen. Para una colisión cualquiera vale el cumpleaños: la raíz cuadrada, $2^{n/2}$.' }],
    hint: function () { return 'Colisión: cumpleaños, $2^{n/2}$. Preimagen: probar hasta dar con un hash concreto, $2^n$.'; },
    steps: function (d) { return ['Colisión: $\\sqrt{2^{' + d.n + '}} = 2^{' + d.col + '}$.', 'Preimagen: $2^{' + d.pre + '}$.', d.col <= 64 ? 'Con $2^{' + d.col + '}$ al alcance de un ordenador, una huella de ' + d.n + ' bits no protege contra colisiones.' : 'Con $2^{' + d.col + '}$ el ataque es impracticable: por eso las huellas actuales tienen 256 bits.']; },
    answer: function (d) { return '2^' + d.col + ' y 2^' + d.pre; }
  });

  p.exercise({
    title: 'Bits que cambian',
    level: 'medio',
    gen: function (r) { var n = r.pick([128, 160, 256, 512]), obs = r.pick([0.5, 0.5, 0.1, 0.3]); return { n: n, esp: n / 2, obs: Math.round(n * obs), bien: obs === 0.5 }; },
    ask: function (d) { return 'Se cambia un bit de la entrada de una función hash de ' + d.n + ' bits. ¿Cuántos bits de la huella deberían cambiar, de media? En una prueba cambian ' + d.obs + ': ¿es lo esperable?'; },
    fields: [{ name: 'e', label: 'esperados', w: 'tiny' }, { name: 'q', label: 'esperable', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }],
    sol: function (d) { return { e: d.esp, q: d.bien ? 'si' : 'no' }; },
    hint: function () { return 'Avalancha: cada bit de salida cambia con probabilidad 1/2.'; },
    steps: function (d) { return ['$' + d.n + ' / 2 = ' + d.esp + '$ bits.', d.bien ? 'Los ' + d.obs + ' observados encajan.' : 'Solo ' + d.obs + ': la huella conserva demasiado de la entrada. Una función así no resiste.']; },
    answer: function (d) { return d.esp + ', ' + (d.bien ? 'sí' : 'no'); }
  });

  p.exercise({
    title: 'Probabilidad de colisión',
    level: 'avanzado',
    gen: function (r) { var n = r.pick([16, 20, 24, 32]), k = r.pick([100, 200, 500, 1000, 2000, 5000]); var N = Math.pow(2, n), p = 1 - Math.exp(-k * k / (2 * N)); if (p < 0.002 || p > 0.95) return null; return { n: n, k: k, N: N, p: p }; },
    ask: function (d) { return 'Se calculan las huellas de ' + U.miles(d.k) + ' archivos distintos con un hash de ' + d.n + ' bits. ¿Qué probabilidad hay de que dos coincidan? Usa $1 - e^{-k^2/(2N)}$. (tres decimales)'; },
    fields: [{ name: 'p', label: 'probabilidad', w: 'tiny' }],
    sol: function (d) { return { p: d.p }; },
    dec: 3, tol: 5e-3,
    errores: [{ si: function (v, d) { return Math.abs(v.p - d.k / d.N) < 1e-4 && Math.abs(d.p - d.k / d.N) > 5e-3; }, msg: 'Eso es $k/N$: la probabilidad de que uno choque con un valor fijo. Entre $k$ elementos hay unos $k^2/2$ parejas, y esa es la cuenta.' }],
    hint: function (d) { return ['$N = 2^{' + d.n + '} = ' + U.miles(d.N) + '$.', '$k^2 / (2N) = ' + U.fmt(d.k * d.k / (2 * d.N), 4) + '$.']; },
    steps: function (d) { return ['$k^2 / (2N) = ' + U.miles(d.k) + '^2 / (2\\cdot ' + U.miles(d.N) + ') = ' + U.fmt(d.k * d.k / (2 * d.N), 4) + '$.', '$P \\approx 1 - e^{-' + U.fmt(d.k * d.k / (2 * d.N), 4) + '} = ' + U.fmt(d.p, 3) + '$.', d.p > 0.3 ? 'Con esa probabilidad la huella es inútil para distinguir archivos: hacen falta más bits.' : 'Pequeña, pero no nula: con más archivos crece con el cuadrado.']; },
    answer: function (d) { return U.fmt(d.p, 3); }
  });

  p.keys([
    'Una función hash da una huella de tamaño fijo, determinista y con avalancha; sin clave y sin inversa.',
    'Tres promesas: no se deshace (preimagen), no se puede sustituir un documento (segunda preimagen), no se pueden fabricar dos con la misma huella (colisión).',
    'Cumpleaños: una colisión cuesta $2^{n/2}$, no $2^n$. Por eso las huellas tienen 256 bits.',
    'SHA-256 encadena una función de compresión sobre bloques de 512 bits (Merkle-Damgård); MD5 y SHA-1 están rotas.',
    'Un hash no prueba quién publicó algo: para eso hacen falta una clave (MAC) o una firma.'
  ]);
});
