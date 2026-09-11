/* Tema: Calcular sobre datos cifrados: cifrado homomorfico */
Course.topic('cr-homomorfico', function (p) {

  p.puente('La maleabilidad de [[cr-rsa|RSA]] era un defecto: multiplicar cifrados multiplicaba mensajes. ' +
    'Este tema convierte ese defecto en una herramienta. Con la [[cr-modular|aritmética modular]] de ' +
    'siempre, un cifrado en el que sumar los cifrados suma los mensajes permite contar votos sin ' +
    'abrir ningún sobre.');

  p.text('Hasta ahora, para hacer algo con un dato cifrado había que descifrarlo, y eso obliga a confiar ' +
    'en quien tiene la clave. El <strong>cifrado homomórfico</strong> rompe esa regla: permite ' +
    'operar sobre los cifrados de modo que el resultado, al descifrarlo, es la operación sobre los ' +
    'mensajes. Un servidor puede sumar, o incluso calcular cualquier cosa, sobre datos que no puede ' +
    'leer.');

  /* ---------------------------------------------------------------- */
  p.section('RSA multiplica, sin querer');

  p.text('Ya se vio: en RSA de libro, $E(m_1)\\,E(m_2) = (m_1 m_2)^e = E(m_1 m_2)$. Multiplicar dos ' +
    'cifrados da el cifrado del producto. Es <strong>parcialmente homomórfico</strong>: sabe hacer ' +
    'una operación, la multiplicación, y solo esa. Sirve de poco por sí mismo, pero enseña la idea: ' +
    'la estructura de la operación de cifrado se traslada a los mensajes.');

  p.formula('E(m_1)\\cdot E(m_2) = E(m_1 \\cdot m_2), \\qquad \\text{pero } E(m_1) + E(m_2) \\ne E(m_1 + m_2)',
    'RSA es homomórfico para el producto, no para la suma',
    'Se lee: <em>«el producto de los cifrados es el cifrado del producto»</em>. Para votar hace falta ' +
    'lo contrario: <strong>sumar</strong>. Y eso lo da otro sistema.');

  /* ---------------------------------------------------------------- */
  p.section('Paillier suma');

  p.text('El cifrado de Paillier, de 1999, es homomórfico para la <strong>suma</strong>: el producto de ' +
    'dos cifrados es el cifrado de la suma de los mensajes. Trabaja módulo $n^2$, con $n = pq$ como ' +
    'en RSA, y tiene otra propiedad clave para votar: es <strong>probabilista</strong>, cada cifrado ' +
    'lleva un número al azar, así que dos votos iguales dan cifrados distintos y nadie puede saber ' +
    'quién votó qué comparando sobres.');

  p.formulas([
    'E(m) = (n+1)^{m}\\,r^{n} \\bmod n^2, \\qquad E(m_1)\\,E(m_2) \\bmod n^2 = E(m_1 + m_2)',
    'E(m)^{k} \\bmod n^2 = E(k\\,m)'
  ], 'el homomorfismo de Paillier',
    'Se lee: <em>«el cifrado de eme es ene más uno elevado a eme, por erre elevado a ene, módulo ene ' +
    'al cuadrado»</em>, con $r$ al azar.<br><br>Multiplicar dos cifrados suma los exponentes de ' +
    '$(n+1)$, que son los mensajes: por eso suma. Y elevar un cifrado a $k$ multiplica el mensaje ' +
    'por $k$. Con esas dos operaciones se calcula cualquier combinación lineal sobre datos cifrados.');

  p.demo({
    title: 'Sumar sin descifrar',
    intro: 'Con $p = 61$ y $q = 53$. Cifra dos números; el servidor, que no tiene la clave, multiplica los dos cifrados módulo $n^2$. Al descifrar el producto sale la suma. Cambia los números y comprueba.',
    predice: 'Si ciframos 17 y 25 y el servidor multiplica los dos cifrados, ¿qué saldrá al descifrar el resultado: 425, 42 o basura?',
    build: function (host) {
      var P = CR.paillier(61, 53), m1 = 17, m2 = 25, r1 = 7, r2 = 9;
      var out = W.mono(host, '');
      function pinta() {
        var c1 = P.cifra(m1, r1), c2 = P.cifra(m2, r2), suma = P.suma(c1, c2), desc = P.descifra(suma);
        var h = '<b>n = 61 x 53 = ' + P.n + '</b>, se trabaja modulo n cuadrado = ' + P.n2 + '\n\n';
        h += '<b>cifra ' + m1 + ':</b> c1 = ' + c1 + '\n';
        h += '<b>cifra ' + m2 + ':</b> c2 = ' + c2 + '\n';
        h += '<span class="cr-tenue">(cada uno con su r al azar: dos cifrados de un mismo numero serian distintos)</span>\n\n';
        h += '<b>el servidor</b> (sin la clave) calcula c1 x c2 mod n cuadrado = ' + suma + '\n';
        h += '<b>al descifrar:</b> ' + desc + '  <span class="cr-ok">= ' + m1 + ' + ' + m2 + '</span>';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'primer número', min: 0, max: 500, step: 1, value: m1, on: function (v) { m1 = v; pinta(); } });
      W.slider(fila, { label: 'segundo número', min: 0, max: 500, step: 1, value: m2, on: function (v) { m2 = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Un recuento electoral cifrado');

  p.text('Con esto se hace una votación verificable. Cada votante cifra su voto, 0 o 1, con la clave ' +
    'pública de la mesa. Cualquiera puede multiplicar todos los cifrados y obtener el cifrado de la ' +
    'suma, es decir, del número de síes, <strong>sin descifrar ni un voto</strong>. Solo al final la ' +
    'mesa, con la clave privada, descifra ese único resultado: el recuento. Ningún voto individual ' +
    'se abre nunca.');

  p.demo({
    title: 'Una urna homomórfica',
    intro: 'Diez votantes emiten un 0 o un 1 cifrado con Paillier. La urna multiplica todos los cifrados; el resultado, al descifrarlo, es el número de síes. Cambia los votos: los cifrados individuales cambian por completo, pero la suma sigue cuadrando.',
    predice: 'Los cifrados de los votos parecen números enormes sin relación con 0 o 1. Al multiplicarlos todos y descifrar, ¿saldrá el número de síes, o algo ilegible?',
    build: function (host) {
      var P = CR.paillier(61, 53), votos = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1], r = U.rng(5);
      var out = W.mono(host, '');
      function pinta() {
        var cifrados = votos.map(function (v) { return P.cifra(v, r.int(2, P.n - 1)); });
        var urna = cifrados.reduce(function (acc, c) { return P.suma(acc, c); }, P.cifra(0, r.int(2, P.n - 1)));
        var recuento = P.descifra(urna), reales = votos.reduce(function (a, b) { return a + b; }, 0);
        out.set('<b>votos (secretos):</b> ' + votos.join(' ') + '\n<b>cifrados que ve la urna:</b>\n' + cifrados.map(function (c) { return String(c); }).join(', ') + '\n\n<b>producto de todos módulo n²:</b> ' + urna + '\n<b>la mesa descifra el total:</b> <strong>' + recuento + ' síes</strong> de 10  <span class="cr-ok">= ' + reales + ' ✓</span>\n<span class="cr-tenue">Ningún voto se ha descifrado; solo el recuento. Y dos «síes» distintos tienen cifrados distintos.</span>');
      }
      var caja = U.el('div.chips'); host.appendChild(caja);
      votos.forEach(function (v, i) { (function (i) { var b = U.el('button.chip' + (votos[i] ? '.is-on' : ''), { type: 'button', text: 'votante ' + (i + 1) }); b.addEventListener('click', function () { votos[i] = votos[i] ? 0 : 1; b.classList.toggle('is-on'); pinta(); }); caja.appendChild(b); })(i); });
      pinta();
    }
  });

  p.comprueba('¿Por qué un cifrado homomórfico para votaciones tiene que ser probabilista, con un número al azar en cada cifrado?', [
    { t: 'Para que dos votos iguales no den el mismo cifrado: si no, cualquiera vería quién votó lo mismo y, sabiendo un voto, todos', ok: true, por: 'Un voto solo puede ser 0 o 1. Sin aleatoriedad, todos los «sí» tendrían el mismo cifrado y todos los «no» otro, y el secreto del voto se perdería aunque no se descifrara nada.' },
    { t: 'Para que la suma funcione', ok: false, por: 'El homomorfismo funciona con cualquier $r$; el azar no es para que sume, sino para ocultar votos iguales.' },
    { t: 'Para que la mesa pueda descifrar', ok: false, por: 'La mesa descifra con la clave privada; el $r$ se cancela en el descifrado. Su papel es solo ocultar.' }
  ]);

  p.ejemplo({
    title: 'Sumar dos votos a mano, con n pequeño',
    enunciado: 'Paillier con $p = 5$, $q = 7$, así que $n = 35$ y se trabaja módulo $n^2 = 1225$; se usa $g = n + 1 = 36$. Cifrar el voto $m_1 = 1$ con azar $r_1 = 2$ y el voto $m_2 = 1$ con $r_2 = 3$, multiplicar los cifrados y comprobar que el recuento da 2.',
    pasos: [
      { t: '<strong>Cifrar el primero.</strong> $E(1) = 36^1\\cdot 2^{35} \\bmod 1225$. $36^1 = 36$; $2^{35} \\bmod 1225 = 1018$ (por cuadrados sucesivos); $36\\cdot 1018 = 36\\,648 \\equiv 673 \\pmod{1225}$.', antes: '$g^m\\cdot r^n$: aquí $36^1\\cdot 2^{35}$.' },
      { t: '<strong>Cifrar el segundo.</strong> $E(1) = 36\\cdot 3^{35} \\bmod 1225$. $3^{35} \\bmod 1225 = 843$; $36\\cdot 843 = 30\\,348 \\equiv 973$.', antes: 'Lo mismo con $r = 3$.' },
      { t: '<strong>Sumar (multiplicar los cifrados).</strong> $673\\cdot 973 \\bmod 1225 = 654\\,829 \\bmod 1225 = 129$. Ese es $E(1 + 1) = E(2)$, con un azar que es $2\\cdot 3 = 6$.', antes: 'El producto de los dos cifrados, módulo 1225.' },
      { t: '<strong>Descifrar.</strong> Con la clave privada $\\lambda = \\operatorname{mcm}(4, 6) = 12$ y la fórmula de Paillier, $129$ descifra a $2$: el recuento. Los dos votos «sí» tenían cifrados distintos (673 y 973) y nadie los abrió.' }
    ],
    cierre: 'La urna solo hizo una multiplicación módulo $n^2$. No supo nunca que sumaba dos unos: para ella eran dos números enormes.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Hasta dónde llega hoy');

  p.text('Paillier suma; RSA multiplica. Cada uno sabe una operación. Durante treinta años se buscó un ' +
    'cifrado que supiera <strong>las dos a la vez</strong>, sumar y multiplicar cualquier número de ' +
    'veces, porque con suma y producto se calcula <em>cualquier</em> función. Sería poder ejecutar ' +
    'un programa entero sobre datos cifrados. Craig Gentry lo consiguió en 2009: el cifrado ' +
    '<strong>totalmente homomórfico</strong>.');

  p.text('La idea usa retículos, como la criptografía poscuántica del tema siguiente, y tiene un problema: ' +
    'cada operación añade «ruido» al cifrado, y pasado un punto el ruido impide descifrar. Gentry ' +
    'añadió un paso genial, el <em>refrescado</em>, que reduce el ruido cifrando el propio ' +
    'descifrado. Funciona, pero es lento: millones de veces más que calcular en claro. Hoy se usa en ' +
    'casos concretos, análisis médicos o financieros sobre datos que no se pueden ver, y mejora año ' +
    'a año.');

  p.util('El voto electrónico verificable usa cifrado homomórfico en experiencias reales, como algunas ' +
    'consultas en Estonia y Suiza: se publica la urna cifrada y cualquiera comprueba el recuento sin ' +
    'ver los votos. Empresas de análisis ofrecen procesar datos médicos o genéticos cifrados sin ' +
    'descifrarlos, de modo que ni ellas ni un atacante que las asalte vean los datos. Y los sistemas ' +
    'que entrenan modelos sobre datos de varios hospitales sin juntarlos en claro se apoyan en estas ' +
    'técnicas junto con el reparto de secretos de Shamir.');

  p.hist('Ronald Rivest, Leonard Adleman y Michael Dertouzos plantearon la pregunta en 1978, el año ' +
    'siguiente a RSA: ¿se puede calcular sobre datos cifrados? Pascal Paillier dio en 1999 el cifrado ' +
    'aditivo que lleva su nombre. La pregunta completa siguió abierta hasta 2009, cuando Craig ' +
    'Gentry, en su tesis en Stanford, construyó el primer esquema totalmente homomórfico; fue uno de ' +
    'los grandes resultados de la criptografía del siglo, y desde entonces se ha hecho miles de veces ' +
    'más rápido.');

  p.trampas([
    { e: 'Esperar que RSA sume', por: 'RSA multiplica cifrados y mensajes; para sumar hace falta Paillier. Cada cifrado parcial sabe una sola operación.' },
    { e: 'Usar un cifrado determinista para votar', por: 'Todos los «sí» tendrían el mismo cifrado: el voto dejaría de ser secreto sin necesidad de descifrar nada. Paillier lleva azar en cada cifrado.' },
    { e: 'Creer que homomórfico significa que el servidor lo ve todo', por: 'Es al revés: el servidor opera sin poder leer. Solo quien tiene la clave privada descifra, y en una votación se descifra únicamente el total.' },
    { e: 'Pensar que el totalmente homomórfico ya sustituye al cálculo normal', por: 'Funciona desde 2009, pero es lentísimo: se usa en nichos donde la privacidad compensa el coste, no para todo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Suma o producto?',
    level: 'basico',
    gen: function (r) { var casos = [{ t: 'RSA de libro: $E(m_1)\\cdot E(m_2)$', v: 'prod' }, { t: 'Paillier: $E(m_1)\\cdot E(m_2)$', v: 'suma' }, { t: 'Paillier: $E(m)^k$', v: 'kmul' }, { t: 'RSA de libro: $E(m)^k$', v: 'pot' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return 'En el cifrado indicado, multiplicar (o elevar) los cifrados equivale a qué operación sobre los mensajes? «' + d.c.t + '»'; },
    fields: [{ name: 'q', label: 'equivale a', opts: [{ t: 'sumar los mensajes', v: 'suma' }, { t: 'multiplicar los mensajes', v: 'prod' }, { t: 'multiplicar el mensaje por k', v: 'kmul' }, { t: 'elevar el mensaje a k', v: 'pot' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'RSA traslada el producto; Paillier, la suma. Elevar un cifrado repite su operación: en Paillier, sumar k veces es multiplicar por k.'; },
    steps: function (d) { var por = { prod: 'RSA es multiplicativo: el producto de los cifrados cifra el producto.', suma: 'Paillier es aditivo: el producto de los cifrados cifra la suma.', kmul: 'En Paillier, elevar a k repite k veces la suma: multiplica el mensaje por k.', pot: 'En RSA, elevar a k repite k veces el producto: eleva el mensaje a k.' }; return [por[d.c.v]]; },
    answer: function (d) { return { suma: 'sumar', prod: 'multiplicar', kmul: 'multiplicar por k', pot: 'elevar a k' }[d.c.v]; }
  });

  p.exercise({
    title: 'El recuento cifrado',
    level: 'basico',
    gen: function (r) { var n = r.int(8, 30), si = r.int(0, n); return { n: n, si: si }; },
    ask: function (d) { return d.n + ' votantes emiten un 0 o un 1 cifrado con Paillier, y ' + d.si + ' votan que sí. La urna multiplica los ' + d.n + ' cifrados módulo $n^2$. Al descifrar ese único producto, ¿qué número sale, y cuántos votos individuales se han descifrado?'; },
    fields: [{ name: 'r', label: 'número', w: 'tiny' }, { name: 'd', label: 'votos descifrados', w: 'tiny' }],
    sol: function (d) { return { r: d.si, d: 0 }; },
    hint: function () { return 'El producto de los cifrados cifra la suma de los votos; solo se descifra el total.'; },
    steps: function (d) { return ['El producto cifra $0 + 1 + \\cdots = ' + d.si + '$: sale el recuento.', 'Se descifra <strong>un</strong> valor, el total, y <strong>cero</strong> votos individuales.']; },
    answer: function (d) { return d.si + ', y 0 votos'; }
  });

  p.exercise({
    title: 'Sumar cifrados de Paillier',
    level: 'medio',
    gen: function (r) { var P = CR.paillier(5, 7), m1 = r.int(0, 15), m2 = r.int(0, 15), r1 = r.int(2, 30), r2 = r.int(2, 30); if (ML.gcd(r1, 35) !== 1 || ML.gcd(r2, 35) !== 1) return null; return { n: P.n, n2: P.n2, m1: m1, m2: m2, c1: P.cifra(m1, r1), c2: P.cifra(m2, r2), prod: P.suma(P.cifra(m1, r1), P.cifra(m2, r2)), suma: m1 + m2, P: P }; },
    ask: function (d) { return 'Paillier con $n = 35$, $n^2 = 1225$. Dos cifrados: $c_1 = ' + d.c1 + '$ (de $m_1 = ' + d.m1 + '$) y $c_2 = ' + d.c2 + '$ (de $m_2 = ' + d.m2 + '$). Calcula $c_1\\cdot c_2 \\bmod 1225$, y di qué mensaje cifra.'; },
    fields: [{ name: 'p', label: 'c₁·c₂ mod 1225', w: 'tiny' }, { name: 'm', label: 'cifra el número', w: 'tiny' }],
    sol: function (d) { return { p: d.prod, m: d.suma }; },
    hint: function () { return 'Multiplica los dos cifrados y reduce módulo 1225. El resultado cifra la suma de los mensajes.'; },
    steps: function (d) { return ['$' + d.c1 + '\\cdot ' + d.c2 + ' = ' + (d.c1 * d.c2) + ' \\equiv ' + d.prod + ' \\pmod{1225}$.', 'Ese cifrado corresponde a $m_1 + m_2 = ' + d.m1 + ' + ' + d.m2 + ' = ' + d.suma + '$.', 'Comprobación: descifrando ' + d.prod + ' con la clave privada sale ' + d.P.descifra(d.prod) + '.']; },
    answer: function (d) { return d.prod + ', cifra ' + d.suma; }
  });

  p.exercise({
    title: 'Multiplicar un voto por un peso',
    level: 'medio',
    gen: function (r) { var P = CR.paillier(5, 7), m = r.int(1, 8), k = r.int(2, 5), rr = r.int(2, 30); if (ML.gcd(rr, 35) !== 1 || m * k >= 35) return null; var c = P.cifra(m, rr); return { m: m, k: k, c: c, pot: CR.potMod(c, k, P.n2), km: m * k, P: P }; },
    ask: function (d) { return 'En Paillier ($n = 35$, $n^2 = 1225$), un cifrado de $m = ' + d.m + '$ es $c = ' + d.c + '$. Para multiplicar el mensaje por ' + d.k + ' sin descifrarlo, se calcula $c^{' + d.k + '} \\bmod 1225$. ¿Cuánto vale, y qué mensaje cifra?'; },
    fields: [{ name: 'p', label: 'c^k mod 1225', w: 'tiny' }, { name: 'm', label: 'cifra', w: 'tiny' }],
    sol: function (d) { return { p: d.pot, m: d.km }; },
    hint: function () { return '$c^k \\bmod n^2$ por cuadrados sucesivos; cifra $k\\cdot m$.'; },
    steps: function (d) { return ['$' + d.c + '^{' + d.k + '} \\bmod 1225 = ' + d.pot + '$.', 'Cifra $' + d.k + '\\cdot ' + d.m + ' = ' + d.km + '$: comprobación, descifra ' + d.P.descifra(d.pot) + '.', 'Con sumas y multiplicaciones por constantes se hace cualquier combinación lineal sobre datos cifrados: medias, ponderaciones, recuentos por región.']; },
    answer: function (d) { return d.pot + ', cifra ' + d.km; }
  });

  p.exercise({
    title: 'Qué se puede calcular',
    level: 'avanzado',
    gen: function (r) { var casos = [{ t: 'Sumar mil salarios cifrados para publicar solo el total', v: 'paillier', por: 'Solo hace falta sumar: Paillier basta, y es rápido.' }, { t: 'Contar los votos afirmativos de una elección', v: 'paillier', por: 'Es una suma de ceros y unos: Paillier, aditivo y probabilista.' }, { t: 'Ejecutar un programa cualquiera, con sumas y productos entremezclados, sobre datos cifrados', v: 'gentry', por: 'Suma y producto arbitrarios: hace falta cifrado totalmente homomórfico (Gentry), lento pero posible.' }, { t: 'Multiplicar dos números cifrados y nada más', v: 'rsa', por: 'Un solo producto: RSA de libro ya lo hace, es parcialmente homomórfico para el producto.' }, { t: 'Calcular la media de unas notas cifradas (suma y división por una constante pública)', v: 'paillier', por: 'Suma de cifrados y multiplicación por una constante: las dos las tiene Paillier.' }]; return { c: r.pick(casos) }; },
    ask: function (d) { return '¿Qué cifrado hace falta para: ' + d.c.t + '?'; },
    fields: [{ name: 'q', label: 'Hace falta', opts: [{ t: 'RSA (solo un producto)', v: 'rsa' }, { t: 'Paillier (sumas y por constantes)', v: 'paillier' }, { t: 'totalmente homomórfico (todo)', v: 'gentry' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return '¿Basta sumar? Paillier. ¿Un solo producto? RSA. ¿Sumas y productos arbitrarios entremezclados? Gentry.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return { rsa: 'RSA', paillier: 'Paillier', gentry: 'totalmente homomórfico' }[d.c.v]; }
  });

  p.keys([
    'Un cifrado homomórfico permite operar sobre los cifrados de modo que el resultado descifra a la operación sobre los mensajes.',
    'RSA es parcialmente homomórfico para el producto; Paillier, para la suma: $E(m_1)E(m_2) = E(m_1 + m_2)$.',
    'Paillier es probabilista, y por eso sirve para votar: dos votos iguales dan cifrados distintos, y solo se descifra el recuento total.',
    'Elevar un cifrado de Paillier a $k$ multiplica el mensaje por $k$: con eso se hace cualquier combinación lineal.',
    'El cifrado totalmente homomórfico (Gentry, 2009) suma y multiplica sin límite: calcula cualquier función sobre datos cifrados, aún despacio.'
  ]);
});
