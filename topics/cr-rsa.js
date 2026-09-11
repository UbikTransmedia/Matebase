/* Tema: RSA a fondo */
Course.topic('cr-rsa', function (p) {

  p.puente('En [[av-numeros|teoría de números]] se vio RSA con $p = 3$ y $q = 11$. Ahora se tienen las ' +
    'herramientas para hacerlo de verdad: [[cr-primos|primos]] fabricados a medida, el ' +
    '[[cr-modular|inverso, las potencias y el teorema chino]]. Y se ve por qué el RSA «de libro» ' +
    'que se explica en clase no es el que se usa: le falta aleatoriedad.');

  p.text('RSA es el sistema de clave pública más famoso y el que más tiempo lleva en uso. La ' +
    'matemática cabe en tres líneas; el sistema completo, el que resiste a Eva, tiene unas cuantas ' +
    'más, y cada una está ahí por un ataque que funcionó.');

  /* ---------------------------------------------------------------- */
  p.section('Generar las claves');

  p.list([
    'Fabricar dos primos $p$ y $q$ de 1024 bits cada uno, y calcular $n = pq$.',
    'Calcular $\\varphi(n) = (p - 1)(q - 1)$, o mejor $\\lambda(n) = \\operatorname{mcm}(p - 1, q - 1)$, que es más pequeño y sirve igual.',
    'Elegir el exponente público $e$: casi siempre $65\\,537 = 2^{16} + 1$, primo, sin factores comunes con $\\varphi(n)$ casi seguro, y con solo dos unos en binario, así que cifrar cuesta 17 multiplicaciones.',
    'Calcular el exponente privado $d = e^{-1} \\bmod \\varphi(n)$ con Euclides extendido.',
    'Publicar $(n, e)$; guardar $d$, y también $p$, $q$ para descifrar deprisa con el teorema chino. Borrar todo lo demás.'
  ]);

  p.formulas([
    'c = m^{e} \\bmod n, \\qquad m = c^{d} \\bmod n',
    'm^{ed} = m^{1 + k\\varphi(n)} = m\\,\\bigl(m^{\\varphi(n)}\\bigr)^k \\equiv m \\pmod n'
  ], 'cifrar, descifrar y por qué vuelve',
    'Se lee: <em>«ce es eme elevado a e módulo ene»</em>. La segunda línea es la demostración: como ' +
    '$ed \\equiv 1$ módulo $\\varphi(n)$, $ed = 1 + k\\varphi(n)$, y $m^{\\varphi(n)} \\equiv 1$ es el ' +
    'teorema de Euler, la versión de Fermat para módulos compuestos.<br><br>El mensaje $m$ tiene que ' +
    'ser un número menor que $n$: un texto se corta en bloques de 255 bytes, cada uno un número de ' +
    '2040 bits.');

  p.demo({
    title: 'Un RSA completo con primos de siete cifras',
    intro: 'Se generan dos primos al azar, las claves, y se cifra el mensaje por bloques de dos letras. Todo con las cuentas de verdad: Miller-Rabin para los primos, Euclides para $d$, cuadrados sucesivos para las potencias. Pulsa para otras claves.',
    predice: 'Con $e = 65\\,537$, ¿cuántas multiplicaciones cuesta cifrar un bloque por cuadrados sucesivos: 17, 65 537 o unas 16 000?',
    build: function (host) {
      var msg = 'HOLA MUNDO', semilla = 1;
      var out = W.mono(host, '');
      function pinta() {
        var r = U.rng(semilla), pp = CR.primoAleatorio(r, 1000000, 9999999), q = CR.primoAleatorio(r, 1000000, 9999999);
        var n = pp * q, phi = (pp - 1) * (q - 1), e = 65537, d = CR.inv(e, phi);
        if (d === null) { semilla++; pinta(); return; }
        var t = CR.limpia(msg), bloques = [], cif = [], des = [];
        for (var i = 0; i < t.length; i += 2) { var b = CR.num(t.charAt(i)) * 26 + (i + 1 < t.length ? CR.num(t.charAt(i + 1)) : 0); bloques.push(b); }
        bloques.forEach(function (m) { var c = CR.potMod(m, e, n); cif.push(c); des.push(CR.potMod(c, d, n)); });
        out.set('<b>primos:</b> p = ' + U.miles(pp) + ', q = ' + U.miles(q) + '\n<b>n = pq</b> = ' + U.miles(n) + '   <b>φ(n)</b> = ' + U.miles(phi) + '\n<b>clave pública:</b> (n, e = 65 537)   <b>clave privada:</b> d = ' + U.miles(d) + '\n\n<b>mensaje:</b> ' + t + ' → bloques ' + bloques.join(', ') + '\n<b>cifrado:</b> ' + cif.map(function (c) { return U.miles(c); }).join(', ') + '\n<b>descifrado:</b> ' + des.join(', ') + ' → ' + des.map(function (m) { return CR.letra(Math.floor(m / 26)) + CR.letra(m % 26); }).join('') + (des.join() === bloques.join() ? ' <span class="cr-ok">✓</span>' : '') +
          '\n<span class="cr-tenue">Eva, con n y e públicos, tendría que factorizar n = ' + U.miles(n) + ' para hallar d. Con 14 cifras se hace en un instante; con 617, no.</span>');
      }
      W.texto(host, { label: 'mensaje', value: msg, max: 20, on: function (v) { msg = v; pinta(); } });
      W.buttons(host, [{ t: 'Otras claves', cls: 'btn--main', on: function () { semilla++; pinta(); } }]);
      pinta();
    }
  });

  p.text('Descifrar cuesta más que cifrar, porque $d$ es un número grande, del tamaño de $n$. Por eso ' +
    'quien tiene la clave privada guarda también $p$ y $q$ y descifra como en el ' +
    '[[cr-modular|teorema chino del resto]]: dos potencias con módulos y exponentes de la mitad de ' +
    'bits, que cuestan un cuarto en total.');

  /* ---------------------------------------------------------------- */
  p.section('El RSA de libro no basta');

  p.text('Lo anterior es el RSA que se explica, y tiene tres agujeros que no tienen que ver con ' +
    'factorizar. Primero, es <strong>determinista</strong>: el mismo mensaje da siempre el mismo ' +
    'cifrado, así que si el mensaje es «sí» o «no», Eva cifra los dos con la clave pública y ' +
    'compara. Segundo, es <strong>maleable</strong>: los cifrados se multiplican.');

  p.formula('E(m_1)\\,E(m_2) = m_1^e\\, m_2^e = (m_1 m_2)^e = E(m_1 m_2) \\pmod n', 'RSA es multiplicativo',
    'Se lee: <em>«el producto de los cifrados es el cifrado del producto»</em>. Eva no puede leer $c$, ' +
    'pero puede multiplicarlo por $E(2)$, que calcula ella misma con la clave pública, y Benito ' +
    'descifrará $2m$: un importe doblado sin haber leído nada.<br><br>Tercero: con $e = 3$ y un ' +
    'mensaje pequeño, $m^3 < n$ y el módulo no actúa: $c$ es $m^3$ a secas, y Eva saca la raíz cúbica.');

  p.demo({
    title: 'Doblar un importe sin la clave',
    intro: 'Alicia cifra un importe con la clave pública de Benito. Eva intercepta el cifrado, lo multiplica por el cifrado de 2 (que calcula ella, porque la clave es pública) y lo reenvía. Benito descifra el doble.',
    predice: 'Si Eva multiplica el cifrado por $E(3)$ en vez de por $E(2)$, ¿qué descifrará Benito?',
    build: function (host) {
      var importe = 120, factor = 2;
      var pp = 1000003, q = 1000033, n = pp * q, phi = (pp - 1) * (q - 1), e = 65537, d = CR.inv(e, phi);
      var out = W.mono(host, '');
      function pinta() {
        var c = CR.potMod(importe, e, n), ek = CR.potMod(factor, e, n), c2 = CR.mulMod(c, ek, n), m2 = CR.potMod(c2, d, n);
        out.set('<b>Alicia cifra</b> m = ' + importe + ':  c = ' + U.miles(c) + '\n<b>Eva calcula</b> E(' + factor + ') = ' + U.miles(ek) + ' con la clave pública\n<b>Eva envía</b> c · E(' + factor + ') mod n = ' + U.miles(c2) + '\n<b>Benito descifra:</b> ' + U.miles(m2) + '  <span class="cr-dif">= ' + factor + ' × ' + importe + '</span>\n\n<span class="cr-tenue">n = ' + U.miles(n) + ', e = 65 537. Eva no ha leído el importe: solo lo ha multiplicado.</span>');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'importe que cifra Alicia', min: 1, max: 999, step: 1, value: importe, on: function (v) { importe = v; pinta(); } });
      W.slider(fila, { label: 'factor de Eva', min: 2, max: 9, step: 1, value: factor, on: function (v) { factor = v; pinta(); } });
      pinta();
    }
  });

  p.text('La solución a los tres agujeros es la misma: antes de elevar a $e$, el mensaje se ' +
    '<strong>rellena con aleatoriedad</strong> hasta el tamaño de $n$ con un esquema fijo. El ' +
    'estándar actual, OAEP, mezcla el mensaje con bytes al azar a través de una función hash, de ' +
    'modo que el mismo mensaje da cifrados distintos cada vez, multiplicar cifrados produce basura ' +
    'al descifrar, y nunca hay un $m$ pequeño. El relleno antiguo, PKCS#1 v1.5, tenía un fallo ' +
    'famoso que se verá en el tema de canales laterales.');

  p.comprueba('Un sistema cifra con RSA de libro, sin relleno, las respuestas de un formulario que solo pueden ser SÍ o NO. ¿Qué hace Eva?', [
    { t: 'Cifra ella misma SÍ y NO con la clave pública y compara con el cifrado interceptado', ok: true, por: 'Sin aleatoriedad, cifrar es una función determinista y pública: para un conjunto pequeño de mensajes posibles, Eva los cifra todos. No hace falta factorizar nada.' },
    { t: 'Nada: sin la clave privada no puede descifrar', ok: false, por: 'No necesita descifrar. La clave pública le permite cifrar candidatos, y solo hay dos.' },
    { t: 'Factorizar $n$', ok: false, por: 'Eso es lo que no puede hacer. El ataque va por otro lado: la falta de aleatoriedad en el cifrado.' }
  ]);

  p.ejemplo({
    title: 'RSA con $p = 61$ y $q = 53$',
    enunciado: 'Generar las claves con $p = 61$, $q = 53$ y $e = 17$; cifrar $m = 65$; descifrar; y comprobar la maleabilidad multiplicando el cifrado por $E(2)$.',
    pasos: [
      { t: '<strong>Las claves.</strong> $n = 61\\cdot 53 = 3233$, $\\varphi(n) = 60\\cdot 52 = 3120$. $\\operatorname{mcd}(17, 3120) = 1$, y con Euclides extendido $17\\cdot 2753 = 46\\,801 = 15\\cdot 3120 + 1$: $d = 2753$.', antes: 'Calcula $n$, $\\varphi(n)$ y comprueba que 17 no comparte factores con $\\varphi(n)$.' },
      { t: '<strong>Cifrar.</strong> $c = 65^{17} \\bmod 3233$ por cuadrados: $17 = 10001_2$, cuatro cuadrados y un producto. Sale $c = 2790$.', antes: '¿Cuántos cuadrados y productos pide el exponente 17?' },
      { t: '<strong>Descifrar.</strong> $2790^{2753} \\bmod 3233 = 65$ ✓. Son doce cuadrados y siete productos, o dos potencias más cortas módulo 61 y 53 con el teorema chino.' },
      { t: '<strong>Maleabilidad.</strong> $E(2) = 2^{17} \\bmod 3233 = 131\\,072 \\bmod 3233 = 1752$. Eva envía $2790\\cdot 1752 \\bmod 3233 = 3017$, y Benito descifra $3017^{2753} \\bmod 3233 = 130 = 2\\cdot 65$.', antes: 'Multiplica el cifrado por $E(2)$ y reduce. ¿Qué descifrará Benito?' }
    ],
    cierre: 'Con relleno OAEP, el 65 se habría convertido en un número de 2040 bits con azar dentro, y el 3017 habría descifrado a basura que Benito rechaza.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Tamaños de clave');

  p.table(['Bits de $n$', 'Cifras decimales', 'Estado'], [
    ['512', '155', 'factorizado en 1999; hoy en horas'],
    ['768', '232', 'factorizado en 2009, tras dos años de cálculo'],
    ['829', '250', 'récord actual, 2020: unos 2700 años de procesador'],
    ['1024', '309', 'sin factorizar públicamente, pero retirado: demasiado cerca'],
    ['2048', '617', 'el mínimo actual; equivale a unos 112 bits simétricos'],
    ['3072', '925', 'equivale a 128 bits simétricos'],
    ['4096', '1234', 'para claves que deban durar décadas']
  ]);

  p.text('Los bits de RSA no se comparan directamente con los de AES, porque el ataque no es la fuerza ' +
    'bruta sino la factorización, que crece más despacio que $2^{\\text{bits}}$. Por eso hacen falta ' +
    '3072 bits de RSA para igualar 128 de AES, y 15 360 para igualar 256. Esa desproporción es la ' +
    'razón de que las curvas elípticas, con 256 bits, hayan ido sustituyendo a RSA.');

  p.util('RSA firma los certificados de la mayoría de las webs, los paquetes de software de los ' +
    'sistemas operativos y los documentos electrónicos; cifra los correos con PGP y las claves de ' +
    'sesión de muchos protocolos antiguos. Las tarjetas de pago con chip llevan un RSA de 1024 o ' +
    '2048 bits que firma cada operación. Y en el DNI electrónico hay dos pares de claves RSA: uno ' +
    'para identificarse y otro para firmar.');

  p.hist('Ron Rivest, Adi Shamir y Leonard Adleman lo publicaron en 1977; según cuenta Rivest, la idea ' +
    'le llegó una noche de abril tras una cena de Pascua. Martin Gardner lo divulgó en agosto en ' +
    '<em>Scientific American</em> con un desafío: un mensaje cifrado con un $n$ de 129 cifras, RSA-129, ' +
    'que se descifró en 1994 con seiscientos voluntarios por internet: decía «las palabras mágicas ' +
    'son osífraga aprensiva». En 1997 se supo que Clifford Cocks, del servicio de inteligencia ' +
    'británico, había inventado lo mismo en 1973 y lo había guardado en un cajón. La patente de RSA ' +
    'expiró en el año 2000.');

  p.trampas([
    { e: 'Cifrar directamente el mensaje, sin relleno', por: 'Determinista y maleable: los mensajes de un conjunto pequeño se adivinan cifrándolos, y los importes se multiplican. Siempre OAEP.' },
    { e: 'Elegir $e$ pequeño para ir deprisa con mensajes cortos', por: 'Con $e = 3$ y $m^3 < n$, el cifrado es $m^3$ sin módulo, y se saca la raíz cúbica. El relleno lo evita; $e = 65\\,537$ ya es rápido.' },
    { e: 'Usar el mismo $n$ con dos exponentes', por: 'Quien conoce un par $(e, d)$ factoriza $n$, y entonces conoce todos los demás $d$. Cada clave, su $n$.' },
    { e: 'Elegir $p$ y $q$ demasiado cercanos', por: 'El método de Fermat los encuentra en segundos, como se verá en el tema siguiente. Los primos se generan al azar e independientes.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var PRIMOS = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];

  function claves(r) {
    var pp = r.pick(PRIMOS), q = r.pick(PRIMOS);
    if (pp === q) return null;
    var phi = (pp - 1) * (q - 1), es = [3, 5, 7, 11, 13, 17, 19, 23].filter(function (e) { return ML.gcd(e, phi) === 1 && e < phi; });
    if (!es.length) return null;
    var e = r.pick(es);
    return { p: pp, q: q, n: pp * q, phi: phi, e: e, d: CR.inv(e, phi) };
  }

  p.exercise({
    title: 'La clave privada',
    level: 'basico',
    gen: claves,
    ask: function (d) { return 'Con $p = ' + d.p + '$, $q = ' + d.q + '$ y $e = ' + d.e + '$, calcula $n$, $\\varphi(n)$ y la clave privada $d = e^{-1} \\bmod \\varphi(n)$.'; },
    fields: [{ name: 'n', label: 'n', w: 'tiny' }, { name: 'phi', label: 'φ(n)', w: 'tiny' }, { name: 'd', label: 'd', w: 'tiny' }],
    sol: function (d) { return { n: d.n, phi: d.phi, d: d.d }; },
    errores: [{ si: function (v, d) { return Number.isInteger(v.d) && v.d !== d.d && CR.mod(v.d, d.phi) === d.d; }, msg: '$d$ es correcto módulo $\\varphi(n)$, pero se da entre 1 y $\\varphi(n) - 1$.' }],
    hint: function () { return ['$n = pq$, $\\varphi(n) = (p-1)(q-1)$.', '$d$ con Euclides extendido: el número que multiplicado por $e$ deja resto 1 módulo $\\varphi(n)$.']; },
    steps: function (d) { return ['$n = ' + d.p + '\\cdot ' + d.q + ' = ' + d.n + '$, $\\varphi(n) = ' + (d.p - 1) + '\\cdot ' + (d.q - 1) + ' = ' + d.phi + '$.', 'Euclides: $' + d.e + '\\cdot ' + d.d + ' = ' + (d.e * d.d) + ' = ' + Math.floor(d.e * d.d / d.phi) + '\\cdot ' + d.phi + ' + 1$.', 'Clave pública $(' + d.n + ', ' + d.e + ')$, privada $d = ' + d.d + '$.']; },
    answer: function (d) { return 'n = ' + d.n + ', φ = ' + d.phi + ', d = ' + d.d; }
  });

  p.exercise({
    title: 'Cifrar un bloque',
    level: 'basico',
    gen: function (r) { var k = claves(r); if (!k) return null; k.m = r.int(2, k.n - 1); k.c = CR.potMod(k.m, k.e, k.n); return k; },
    ask: function (d) { return 'Clave pública $(n, e) = (' + d.n + ', ' + d.e + ')$. Cifra el bloque $m = ' + d.m + '$ por cuadrados sucesivos.'; },
    fields: [{ name: 'c', label: 'c', w: 'tiny' }],
    sol: function (d) { return { c: d.c }; },
    hint: function (d) { return '$' + d.e + ' = ' + d.e.toString(2) + '_2$: cuadrado por bit, producto por cada 1, módulo ' + d.n + '.'; },
    steps: function (d) { var t = CR.potModTraza(d.m, d.e, d.n); return [t.pasos.map(function (ps) { return 'bit ' + ps.bit + ': ' + ps.despues; }).join(' → ') + '.', '$c = ' + d.c + '$.']; },
    answer: function (d) { return String(d.c); }
  });

  p.exercise({
    title: 'Descifrar un bloque',
    level: 'medio',
    gen: function (r) { var k = claves(r); if (!k) return null; k.m = r.int(2, k.n - 1); k.c = CR.potMod(k.m, k.e, k.n); k.dp = k.d % (k.p - 1); k.dq = k.d % (k.q - 1); return k; },
    ask: function (d) { return 'Con $n = ' + d.n + '$ ($p = ' + d.p + '$, $q = ' + d.q + '$) y $d = ' + d.d + '$, descifra $c = ' + d.c + '$. Puedes hacerlo directamente o por el teorema chino, con $d_p = ' + d.dp + '$ y $d_q = ' + d.dq + '$.'; },
    fields: [{ name: 'm', label: 'm', w: 'tiny' }],
    sol: function (d) { return { m: d.m }; },
    hint: function (d) { return ['Por el teorema chino: $m_p = ' + (d.c % d.p) + '^{' + d.dp + '} \\bmod ' + d.p + '$ y $m_q = ' + (d.c % d.q) + '^{' + d.dq + '} \\bmod ' + d.q + '$.', 'Después, el número módulo $' + d.n + '$ con esos restos.']; },
    steps: function (d) { var mp = CR.potMod(d.c, d.dp, d.p), mq = CR.potMod(d.c, d.dq, d.q); return ['$m_p = ' + mp + '$, $m_q = ' + mq + '$.', 'Teorema chino: $m = ' + d.m + '$.', 'Comprobación: $' + d.m + '^{' + d.e + '} \\bmod ' + d.n + ' = ' + CR.potMod(d.m, d.e, d.n) + '$ ✓']; },
    answer: function (d) { return String(d.m); }
  });

  p.exercise({
    title: 'Maleabilidad',
    level: 'medio',
    gen: function (r) { var k = claves(r); if (!k) return null; k.m = r.int(2, Math.floor(k.n / 4)); k.c = CR.potMod(k.m, k.e, k.n); k.f = r.int(2, 3); k.ef = CR.potMod(k.f, k.e, k.n); k.c2 = CR.mulMod(k.c, k.ef, k.n); k.m2 = CR.mod(k.f * k.m, k.n); return k; },
    ask: function (d) { return 'Con la clave pública $(' + d.n + ', ' + d.e + ')$, Alicia cifró $m$ y obtuvo $c = ' + d.c + '$. Eva no conoce $m$, pero calcula $E(' + d.f + ') = ' + d.ef + '$ y envía $c\' = c\\cdot E(' + d.f + ') \\bmod n$. ¿Qué $c\'$ envía, y qué obtendrá Benito al descifrarlo, si $m = ' + d.m + '$?'; },
    fields: [{ name: 'c2', label: 'c′', w: 'tiny' }, { name: 'm2', label: 'Benito lee', w: 'tiny' }],
    sol: function (d) { return { c2: d.c2, m2: d.m2 }; },
    hint: function () { return ['$c\' = c\\cdot E(k) \\bmod n$.', 'Como $E(m)E(k) = E(mk)$, Benito lee $k\\,m \\bmod n$.']; },
    steps: function (d) { return ['$c\' = ' + d.c + '\\cdot ' + d.ef + ' \\bmod ' + d.n + ' = ' + d.c2 + '$.', 'Benito descifra $' + d.f + '\\cdot ' + d.m + ' = ' + d.m2 + '$: el mensaje multiplicado por ' + d.f + ', sin que Eva haya leído nada.', 'Con relleno OAEP, ese $c\'$ descifraría a un bloque con el formato roto, y Benito lo rechazaría.']; },
    answer: function (d) { return 'c′ = ' + d.c2 + ', m′ = ' + d.m2; }
  });

  p.exercise({
    title: 'Exponente pequeño, mensaje pequeño',
    level: 'avanzado',
    gen: function (r) { var m = r.int(5, 40), n = r.pick([100003, 200003, 300007, 500009]); if (m * m * m >= n) return null; return { m: m, n: n, c: m * m * m }; },
    ask: function (d) { return 'Un sistema usa RSA de libro con $e = 3$ y $n = ' + U.miles(d.n) + '$, y cifra un número pequeño. Eva intercepta $c = ' + U.miles(d.c) + '$. Sin factorizar nada, ¿qué era $m$?'; },
    fields: [{ name: 'm', label: 'm', w: 'tiny' }],
    sol: function (d) { return { m: d.m }; },
    hint: function () { return 'Si $m^3 < n$, el módulo no ha hecho nada: $c = m^3$ tal cual. Raíz cúbica.'; },
    steps: function (d) { return ['$m^3 < n$, así que $c = m^3$ sin reducir.', '$\\sqrt[3]{' + U.miles(d.c) + '} = ' + d.m + '$.', 'Ni clave privada ni factorización: el relleno existe para que $m$ nunca sea pequeño.']; },
    answer: function (d) { return String(d.m); }
  });

  p.keys([
    'Claves: $n = pq$, $e = 65\\,537$, $d = e^{-1} \\bmod \\varphi(n)$. Cifrar $m^e$, descifrar $c^d$; funciona por el teorema de Euler.',
    'Descifrar se hace por el teorema chino, con $p$ y $q$ guardados: cuatro veces más rápido.',
    'RSA de libro es determinista, multiplicativo y vulnerable con $e$ pequeño: por eso el mensaje se rellena con azar (OAEP) antes de cifrar.',
    '2048 bits es el mínimo actual y equivale a unos 112 bits simétricos; 3072 equivalen a 128. La factorización crece más despacio que la fuerza bruta.',
    'Cada línea del RSA real está ahí por un ataque que funcionó contra el RSA de libro.'
  ]);
});
