/* Tema: Herramientas modulares: Euclides extendido, potencias y el teorema chino */
Course.topic('cr-modular', function (p) {

  p.puente('La segunda mitad del bloque, la de la clave pública, se apoya en tres algoritmos sobre la ' +
    '[[av-numeros|aritmética modular]]. Dos ya han aparecido: el [[cr-afin|Euclides extendido]] del ' +
    'afín y las potencias por cuadrados de [[av-cripto-curvas|Diffie-Hellman]]. Este tema los ' +
    'ordena, les cuenta el coste y añade el tercero, el teorema chino del resto, que lleva ' +
    'diecisiete siglos esperando a RSA.');

  p.text('RSA y sus parientes trabajan con números de 600 cifras. Nada de lo que viene funcionaría si ' +
    'calcular con ellos costara lo que parece: un inverso módulo un número de 600 cifras, una ' +
    'potencia con exponente de 600 cifras. La razón de que una tarjeta de crédito lo haga en un ' +
    'milisegundo son tres algoritmos, y los tres son mucho más viejos que los ordenadores.');

  /* ---------------------------------------------------------------- */
  p.section('Euclides extendido, y cuánto cuesta');

  p.text('El algoritmo del afín, otra vez: dividir, quedarse con el resto, repetir, y llevar la cuenta de ' +
    'los cocientes para escribir el mcd como $ax + ny$. Lo que ahora importa es <strong>cuántas ' +
    'divisiones</strong> hacen falta. Cada dos pasos el resto se reduce al menos a la mitad, así que ' +
    'con números de $k$ bits nunca hay más de $2k$ divisiones: para 2048 bits, unas cuatro mil. Un ' +
    'ordenador lo hace en microsegundos.');

  p.formula('\\text{divisiones} \\le 2\\log_2 n \\approx 1{,}44\\,\\log_2 n \\text{ en el peor caso}',
    'el coste de Euclides (Lamé, 1844)',
    'Se lee: <em>«el número de divisiones es como mucho dos veces el logaritmo en base dos de ene»</em>. ' +
    'El peor caso son dos números de Fibonacci consecutivos, en los que cada cociente es 1 y el ' +
    'algoritmo avanza lo más despacio posible.<br><br>Comparado con probar inversos uno a uno, que ' +
    'costaría $n$ intentos, es la diferencia entre un algoritmo que sirve y uno que no.');

  p.demo({
    title: 'Euclides con números grandes',
    intro: 'Un $a$ y un módulo $n$ de hasta un millón. Se cuentan las divisiones y se comparan con $2\\log_2 n$. Prueba con dos números de Fibonacci seguidos, 832 040 y 514 229: es el caso más lento.',
    predice: 'Para $n \\approx 10^6$, $\\log_2 n \\approx 20$. ¿Cuántas divisiones habrá: unas 20, unas 40 o unas 1000?',
    build: function (host) {
      var a = 514229, n = 832040;
      var out = W.readout(host, '');
      function pinta() {
        var e = CR.egcd(a, n), h = '$\\operatorname{mcd}(' + U.miles(a) + ', ' + U.miles(n) + ') = ' + e.g + '$ en <strong>' + e.pasos.length + '</strong> divisiones; $2\\log_2 n = ' + U.fmt(2 * Math.log(n) / Math.LN2, 1) + '$.<br>';
        h += e.g === 1 ? 'Inverso de $' + U.miles(a) + '$ módulo $' + U.miles(n) + '$: $' + U.miles(CR.mod(e.x, n)) + '$, porque $' + U.miles(a) + '\\cdot ' + U.miles(CR.mod(e.x, n)) + ' = ' + Math.floor(a * CR.mod(e.x, n) / n) + '\\cdot ' + U.miles(n) + ' + 1$.' : 'No hay inverso: comparten el factor ' + e.g + '.';
        h += '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">cocientes: ' + e.pasos.map(function (ps) { return ps.q; }).join(', ') + '</span>';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'a', min: 2, max: 999999, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'módulo n', min: 3, max: 999999, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      W.chips(host, [{ label: 'Fibonacci: 514 229 y 832 040', value: 'fib' }, { label: 'al azar', value: 'azar' }], { on: function (v) { if (v === 'fib') { a = 514229; n = 832040; } else { a = 2 + Math.floor(Math.random() * 999990); n = 3 + Math.floor(Math.random() * 999990); } pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Potencias por cuadrados sucesivos');

  p.text('Para calcular $b^e \\bmod m$ con $e$ de 600 cifras no se puede multiplicar $e$ veces: no ' +
    'acabaría nunca. El truco es escribir $e$ en binario y elevar al cuadrado una vez por bit, ' +
    'multiplicando por $b$ solo en los bits que valen 1. Todo reducido módulo $m$ en cada paso, para ' +
    'que los números no crezcan.');

  p.formula('b^{e} = \\bigl(\\cdots\\bigl((b^{e_k})^2\\, b^{e_{k-1}}\\bigr)^2 \\cdots\\bigr)^2\\, b^{e_0}, \\qquad e = e_k e_{k-1}\\cdots e_0 \\text{ en binario}',
    'exponenciación por cuadrados, de izquierda a derecha',
    'Se lee: <em>«se empieza en 1; por cada bit del exponente, de izquierda a derecha, se eleva al ' +
    'cuadrado, y si el bit es 1 se multiplica además por b»</em>.<br><br>Con un exponente de 2048 ' +
    'bits son 2048 cuadrados y, de media, 1024 productos: unas tres mil multiplicaciones modulares en ' +
    'vez de $2^{2048}$. Es la misma idea que multiplicar por doblado en la aritmética rusa, y la ' +
    'misma que se usará para «multiplicar» puntos de una curva.');

  p.demo({
    title: 'La tabla de cuadrados',
    intro: 'Cada fila es un bit del exponente: se eleva al cuadrado el acumulado y, si el bit es 1, se multiplica por la base. Todo módulo $m$. Cuenta las filas y compáralas con el exponente.',
    predice: 'Para el exponente 1000, ¿cuántas filas tendrá la tabla: 10, 100 o 1000? Piensa en cuántos bits tiene 1000.',
    build: function (host) {
      var b = 7, e = 560, m = 561;
      var out = W.readout(host, '');
      function pinta() {
        var t = CR.potModTraza(b, e, m), h = '$' + b + '^{' + e + '} \\bmod ' + m + '$, con $' + e + ' = ' + t.bits + '_2$ (' + t.bits.length + ' bits)<div class="tbl-wrap"><table class="tbl"><thead><tr><th>bit</th><th>acumulado</th><th>al cuadrado</th><th>× base si el bit es 1</th></tr></thead><tbody>';
        t.pasos.forEach(function (ps) { h += '<tr><td>' + ps.bit + '</td><td>' + ps.antes + '</td><td>' + ps.cuadrado + '</td><td>' + (ps.bit === '1' ? '<strong>' + ps.despues + '</strong>' : '—') + '</td></tr>'; });
        h += '</tbody></table></div>Resultado: <strong>$' + t.valor + '$</strong>, con ' + t.bits.length + ' cuadrados y ' + (t.bits.split('1').length - 1) + ' productos: ' + (t.bits.length + t.bits.split('1').length - 1) + ' multiplicaciones en vez de ' + (e - 1) + '.';
        out.set(h);
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'base b', min: 2, max: 99, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      W.slider(fila, { label: 'exponente e', min: 1, max: 2000, step: 1, value: e, on: function (v) { e = v; pinta(); } });
      W.slider(fila, { label: 'módulo m', min: 2, max: 999, step: 1, value: m, on: function (v) { m = v; pinta(); } });
      pinta();
    }
  });

  p.comprueba('Para calcular $b^{e} \\bmod m$ con $e = 2^{1000}$, ¿cuántas multiplicaciones hacen falta por cuadrados sucesivos?', [
    { t: 'Unas mil: un cuadrado por bit, y el exponente tiene 1001 bits, todos cero salvo el primero', ok: true, por: 'Mil cuadrados seguidos, sin ningún producto extra. Un exponente de $10^{301}$ se despacha en mil pasos: eso es lo que hace posible RSA.' },
    { t: '$2^{1000}$: hay que multiplicar tantas veces como diga el exponente', ok: false, por: 'Eso es lo que evita el método. Cada cuadrado duplica el exponente alcanzado: mil cuadrados llegan a $2^{1000}$.' },
    { t: 'Mil, pero el resultado no cabe en el ordenador', ok: false, por: 'Se reduce módulo $m$ en cada paso: ningún número intermedio pasa de $m^2$. Los números no crecen.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El teorema chino del resto');

  p.text('La tercera herramienta resuelve sistemas de congruencias: encontrar un número que deje resto 2 ' +
    'al dividir entre 3, resto 3 entre 5 y resto 2 entre 7. Si los módulos no comparten factores, ' +
    'la solución existe, es única módulo el producto, y se construye con inversos:');

  p.formulas([
    'x \\equiv a_1 \\pmod{m_1}, \\quad x \\equiv a_2 \\pmod{m_2}, \\qquad \\operatorname{mcd}(m_1, m_2) = 1',
    'x = a_1\\, M_1\\, y_1 + a_2\\, M_2\\, y_2 \\pmod{m_1 m_2}, \\qquad M_i = \\frac{m_1 m_2}{m_i},\\ y_i = M_i^{-1} \\bmod m_i'
  ], 'el teorema chino del resto',
    'Se lee: <em>«equis es a uno por eme uno por y uno, más a dos por eme dos por y dos, módulo el ' +
    'producto»</em>. $M_1 = m_2$ es múltiplo de $m_2$, así que el primer sumando desaparece módulo ' +
    '$m_2$ y vale $a_1$ módulo $m_1$ gracias al inverso $y_1$; el segundo, al revés.<br><br>Con más ' +
    'módulos, un sumando por cada uno. Y sirve al revés: <strong>trabajar módulo $pq$ es lo mismo ' +
    'que trabajar módulo $p$ y módulo $q$ por separado</strong>, con números de la mitad de cifras, ' +
    'que es cuatro veces más rápido. RSA descifra así.');

  p.demo({
    title: 'Restos que determinan un número',
    intro: 'Elige los restos módulo 3, 5 y 7. Hay un único número entre 0 y 104 que los tiene, y la demo lo construye sumando tres piezas: cada una vale lo que toca en su módulo y cero en los otros dos.',
    predice: 'Si se cambia solo el resto módulo 7, ¿cambiarán las tres piezas de la suma, o solo una?',
    build: function (host) {
      var a = [2, 3, 2], m = [3, 5, 7];
      var out = W.readout(host, '');
      function pinta() {
        var M = 105, piezas = m.map(function (mi, i) { var Mi = M / mi, yi = CR.inv(Mi % mi, mi); return { Mi: Mi, yi: yi, v: CR.mod(a[i] * Mi * yi, M) }; });
        var x = CR.crt(a, m);
        out.set(m.map(function (mi, i) { return '$x \\equiv ' + a[i] + ' \\pmod{' + mi + '}$'; }).join(', ') + '<br>' +
          piezas.map(function (pz, i) { return 'pieza ' + (i + 1) + ': $' + a[i] + '\\cdot ' + pz.Mi + '\\cdot ' + pz.yi + ' \\equiv ' + pz.v + '$ (vale $' + a[i] + '$ módulo $' + m[i] + '$ y $0$ módulo los otros)'; }).join('<br>') +
          '<br>suma módulo 105: <strong>$x = ' + x + '$</strong>. Comprobación: $' + x + ' \\bmod 3 = ' + (x % 3) + '$, $' + x + ' \\bmod 5 = ' + (x % 5) + '$, $' + x + ' \\bmod 7 = ' + (x % 7) + '$ ✓');
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'resto mód 3', min: 0, max: 2, step: 1, value: a[0], on: function (v) { a[0] = v; pinta(); } });
      W.slider(fila, { label: 'resto mód 5', min: 0, max: 4, step: 1, value: a[1], on: function (v) { a[1] = v; pinta(); } });
      W.slider(fila, { label: 'resto mód 7', min: 0, max: 6, step: 1, value: a[2], on: function (v) { a[2] = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Las tres herramientas en un caso',
    enunciado: 'Calcular $5^{13} \\bmod 23$ por cuadrados sucesivos, el inverso de 13 módulo 22 con Euclides extendido, y el número entre 0 y 34 que deja resto 2 al dividir entre 5 y resto 4 entre 7.',
    pasos: [
      { t: '<strong>La potencia.</strong> $13 = 1101_2$. Empezando en 1: bit 1: $1^2\\cdot 5 = 5$. Bit 1: $25\\cdot 5 = 125 \\equiv 10$. Bit 0: $100 \\equiv 8$. Bit 1: $64\\cdot 5 = 320 \\equiv 21$. Así que $5^{13} \\equiv 21$, con cuatro cuadrados y tres productos.', antes: 'Escribe 13 en binario y ve bit a bit: cuadrado, y producto si el bit es 1.' },
      { t: '<strong>El inverso.</strong> $22 = 1\\cdot 13 + 9$, $13 = 1\\cdot 9 + 4$, $9 = 2\\cdot 4 + 1$. Hacia atrás: $1 = 9 - 2\\cdot 4 = 9 - 2(13 - 9) = 3\\cdot 9 - 2\\cdot 13 = 3(22 - 13) - 2\\cdot 13 = 3\\cdot 22 - 5\\cdot 13$. Luego $13\\cdot(-5) \\equiv 1$, y el inverso es $-5 \\equiv 17$. Comprobación: $13\\cdot 17 = 221 = 10\\cdot 22 + 1$ ✓.', antes: 'Tres divisiones. Despeja el 1 hacia atrás.' },
      { t: '<strong>El teorema chino.</strong> $M_1 = 7$, inverso de 7 módulo 5: $7 \\equiv 2$, y $2\\cdot 3 = 6 \\equiv 1$, así que $y_1 = 3$. $M_2 = 5$, inverso de 5 módulo 7: $5\\cdot 3 = 15 \\equiv 1$, $y_2 = 3$. $x = 2\\cdot 7\\cdot 3 + 4\\cdot 5\\cdot 3 = 42 + 60 = 102 \\equiv 32 \\pmod{35}$. Comprobación: $32 = 6\\cdot 5 + 2$ y $32 = 4\\cdot 7 + 4$ ✓.', antes: 'Dos piezas: una múltiplo de 7 que valga 2 módulo 5, otra múltiplo de 5 que valga 4 módulo 7.' },
      { t: '<strong>Lo que enlaza.</strong> En RSA, $e = 13$ podría ser la clave pública, $17$ sería la privada si $\\varphi(n) = 22$, y descifrar módulo $n = 35$ se haría módulo 5 y módulo 7 por separado, recomponiendo con el teorema chino.' }
    ],
    cierre: 'Tres cuentas de un minuto. Con números de 600 cifras son las mismas tres cuentas, unos miles de pasos cada una, y un procesador las hace miles de veces por segundo.'
  });

  p.util('Estas tres operaciones se ejecutan cada vez que abres una web segura, y los procesadores y las ' +
    'tarjetas con chip llevan circuitos dedicados a la exponenciación modular. El teorema chino del ' +
    'resto tiene además vida propia: se usa para calcular con enteros enormes repartiendo el ' +
    'trabajo entre varios primos pequeños, para reconstruir un número a partir de sus restos en ' +
    'sistemas de tolerancia a fallos, y en los relojes y calendarios: los ciclos de 60 años del ' +
    'calendario chino son exactamente el teorema con módulos 10 y 12.');

  p.hist('La exponenciación binaria aparece en el <em>Chandah-sutra</em> de Pingala, en la India, hacia el ' +
    'siglo II a. C., para contar métricas poéticas. El problema de los restos está en el ' +
    '<em>Sunzi Suanjing</em>, un tratado chino de hacia el siglo III, y el método general lo dio Qin ' +
    'Jiushao en 1247; Gauss lo formuló como teorema en 1801. Gabriel Lamé demostró en 1844 la cota ' +
    'del número de divisiones de Euclides, en lo que se considera el primer análisis de la ' +
    'complejidad de un algoritmo.');

  p.trampas([
    { e: 'Multiplicar $e$ veces', por: 'Con $e$ de 600 cifras no acaba en la edad del universo. Por cuadrados son unas dos mil multiplicaciones.' },
    { e: 'Reducir solo al final', por: '$b^e$ entero tiene más cifras que átomos hay. Se reduce módulo $m$ en cada paso, y ningún número intermedio pasa de $m^2$.' },
    { e: 'Aplicar el teorema chino con módulos que comparten factores', por: 'Con módulos 4 y 6 no hay solución para restos 1 y 2 (uno impar, otro par), y cuando la hay no es única módulo 24. Los módulos tienen que ser primos entre sí.' },
    { e: 'Buscar el inverso probando', por: 'Con módulo de 600 cifras no se puede. Euclides extendido lo encuentra en unas cuatro mil divisiones.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Inverso con Euclides',
    level: 'basico',
    gen: function (r) { var n = r.int(20, 120), a = r.int(2, n - 1); if (ML.gcd(a, n) !== 1) return null; return { a: a, n: n, inv: CR.inv(a, n), pasos: CR.egcd(a, n).pasos.length }; },
    ask: function (d) { return 'Con Euclides extendido, calcula el inverso de $' + d.a + '$ módulo $' + d.n + '$.'; },
    fields: [{ name: 'i', label: 'inverso', w: 'tiny' }],
    sol: function (d) { return { i: d.inv }; },
    errores: [{ si: function (v, d) { return Number.isInteger(v.i) && v.i !== d.inv && CR.mod(v.i, d.n) === d.inv; }, msg: 'Es el número, pero fuera de rango: se da entre 0 y ' + '$n - 1$. Suma o resta el módulo.' }],
    hint: function (d) { return ['Divide ' + d.n + ' entre ' + d.a + ', apunta el cociente, y sigue con el divisor y el resto.', 'Despeja el 1 hacia atrás para escribirlo como $' + d.a + 'x + ' + d.n + 'y$.']; },
    steps: function (d) { var e = CR.egcd(d.a, d.n); return ['Divisiones: ' + e.pasos.map(function (ps) { return '$' + ps.a + ' = ' + ps.q + '\\cdot ' + ps.b + ' + ' + ps.r + '$'; }).join(', ') + '.', '$1 = ' + d.a + '\\cdot(' + e.x + ') + ' + d.n + '\\cdot(' + e.y + ')$.', 'Inverso: $' + e.x + ' \\equiv ' + d.inv + ' \\pmod{' + d.n + '}$. Comprobación: $' + d.a + '\\cdot ' + d.inv + ' = ' + (d.a * d.inv) + ' = ' + Math.floor(d.a * d.inv / d.n) + '\\cdot ' + d.n + ' + 1$.']; },
    answer: function (d) { return String(d.inv); }
  });

  p.exercise({
    title: 'Potencia por cuadrados',
    level: 'basico',
    gen: function (r) { var b = r.int(2, 12), e = r.int(9, 40), m = r.pick([23, 29, 31, 37, 41, 43, 47, 53]); return { b: b, e: e, m: m, v: CR.potMod(b, e, m), t: CR.potModTraza(b, e, m) }; },
    ask: function (d) { return 'Calcula $' + d.b + '^{' + d.e + '} \\bmod ' + d.m + '$ por cuadrados sucesivos: $' + d.e + ' = ' + d.t.bits + '_2$.'; },
    fields: [{ name: 'v', label: 'resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    hint: function () { return 'Empieza en 1. Por cada bit, de izquierda a derecha: eleva al cuadrado y reduce; si el bit es 1, multiplica por la base y reduce.'; },
    steps: function (d) { return d.t.pasos.map(function (ps) { return 'bit ' + ps.bit + ': $' + ps.antes + '^2 \\equiv ' + ps.cuadrado + '$' + (ps.bit === '1' ? ', $\\cdot ' + d.b + ' \\equiv ' + ps.despues + '$' : ''); }).concat(['Resultado: <strong>' + d.v + '</strong>, con ' + d.t.bits.length + ' cuadrados y ' + (d.t.bits.split('1').length - 1) + ' productos.']); },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'Cuántas multiplicaciones',
    level: 'medio',
    gen: function (r) { var e = r.int(100, 5000); var bits = e.toString(2); return { e: e, bits: bits, cuad: bits.length - 1, prod: bits.split('1').length - 2 }; },
    ask: function (d) { return 'Para calcular $b^{' + d.e + '} \\bmod m$ por cuadrados sucesivos (empezando con el acumulado igual a $b$ tras el primer bit), ¿cuántos cuadrados y cuántos productos por $b$ hacen falta?'; },
    fields: [{ name: 'c', label: 'cuadrados', w: 'tiny' }, { name: 'p', label: 'productos', w: 'tiny' }],
    sol: function (d) { return { c: d.cuad, p: d.prod }; },
    hint: function (d) { return ['$' + d.e + ' = ' + d.bits + '_2$: ' + d.bits.length + ' bits.', 'Un cuadrado por cada bit después del primero; un producto por cada 1 después del primero.']; },
    steps: function (d) { return ['$' + d.e + '$ tiene ' + d.bits.length + ' bits, con ' + (d.bits.split('1').length - 1) + ' unos.', 'Cuadrados: $' + d.bits.length + ' - 1 = ' + d.cuad + '$. Productos: $' + (d.bits.split('1').length - 1) + ' - 1 = ' + d.prod + '$.', 'Total ' + (d.cuad + d.prod) + ' multiplicaciones en vez de ' + (d.e - 1) + '.']; },
    answer: function (d) { return d.cuad + ' cuadrados, ' + d.prod + ' productos'; }
  });

  p.exercise({
    title: 'El teorema chino con dos módulos',
    level: 'medio',
    gen: function (r) { var pares = [[3, 5], [3, 7], [5, 7], [4, 7], [5, 8], [7, 9], [5, 11], [7, 11]]; var m = r.pick(pares), a1 = r.int(0, m[0] - 1), a2 = r.int(0, m[1] - 1); return { m1: m[0], m2: m[1], a1: a1, a2: a2, x: CR.crt([a1, a2], m), y1: CR.inv(m[1] % m[0], m[0]), y2: CR.inv(m[0] % m[1], m[1]) }; },
    ask: function (d) { return 'Encuentra el número $x$ entre 0 y ' + (d.m1 * d.m2 - 1) + ' con $x \\equiv ' + d.a1 + ' \\pmod{' + d.m1 + '}$ y $x \\equiv ' + d.a2 + ' \\pmod{' + d.m2 + '}$.'; },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }],
    sol: function (d) { return { x: d.x }; },
    errores: [{ si: function (v, d) { return Number.isInteger(v.x) && v.x !== d.x && CR.mod(v.x, d.m1 * d.m2) === d.x; }, msg: 'Es una solución, pero se pide la que está entre 0 y ' + '$m_1 m_2 - 1$.' }],
    hint: function (d) { return ['Pieza 1: múltiplo de ' + d.m2 + ' que valga ' + d.a1 + ' módulo ' + d.m1 + '. Pieza 2: múltiplo de ' + d.m1 + ' que valga ' + d.a2 + ' módulo ' + d.m2 + '.', 'Inverso de ' + d.m2 + ' módulo ' + d.m1 + ': ' + d.y1 + '. Inverso de ' + d.m1 + ' módulo ' + d.m2 + ': ' + d.y2 + '.']; },
    steps: function (d) { return ['$x = ' + d.a1 + '\\cdot ' + d.m2 + '\\cdot ' + d.y1 + ' + ' + d.a2 + '\\cdot ' + d.m1 + '\\cdot ' + d.y2 + ' = ' + (d.a1 * d.m2 * d.y1 + d.a2 * d.m1 * d.y2) + '$.', 'Módulo $' + (d.m1 * d.m2) + '$: $x = ' + d.x + '$.', 'Comprobación: $' + d.x + ' \\bmod ' + d.m1 + ' = ' + (d.x % d.m1) + '$, $' + d.x + ' \\bmod ' + d.m2 + ' = ' + (d.x % d.m2) + '$ ✓']; },
    answer: function (d) { return String(d.x); }
  });

  p.exercise({
    title: 'Descifrar por mitades',
    level: 'avanzado',
    gen: function (r) { var ps = [11, 13, 17, 19, 23, 29, 31], pp = r.pick(ps), q = r.pick(ps); if (pp === q) return null; var phi = (pp - 1) * (q - 1), e = r.pick([3, 5, 7, 11, 13, 17]); if (ML.gcd(e, phi) !== 1) return null; var d = CR.inv(e, phi), c = r.int(2, pp * q - 1); var mp = CR.potMod(c % pp, d % (pp - 1), pp), mq = CR.potMod(c % q, d % (q - 1), q); return { p: pp, q: q, e: e, d: d, dp: d % (pp - 1), dq: d % (q - 1), c: c, mp: mp, mq: mq, m: CR.crt([mp, mq], [pp, q]) }; },
    ask: function (d) { return 'En un RSA de juguete con $p = ' + d.p + '$, $q = ' + d.q + '$ y clave privada $d = ' + d.d + '$, se descifra $c = ' + d.c + '$ por el teorema chino: se calculan $d_p = d \\bmod (p - 1)$ y $d_q = d \\bmod (q - 1)$, después $m_p = c^{d_p} \\bmod p$ y $m_q = c^{d_q} \\bmod q$, y se recompone $m$ módulo $pq$. Da $d_p$, $d_q$ y $m$.'; },
    fields: [{ name: 'dp', label: 'd_p', w: 'tiny' }, { name: 'dq', label: 'd_q', w: 'tiny' }, { name: 'm', label: 'm', w: 'tiny' }],
    sol: function (d) { return { dp: d.dp, dq: d.dq, m: d.m }; },
    hint: function (d) { return ['$d_p = ' + d.d + ' \\bmod ' + (d.p - 1) + '$ y $d_q = ' + d.d + ' \\bmod ' + (d.q - 1) + '$: exponentes más pequeños, por Fermat.', 'Después, $m_p$ y $m_q$ por cuadrados, y el teorema chino con módulos ' + d.p + ' y ' + d.q + '.']; },
    steps: function (d) { return ['$d_p = ' + d.dp + '$, $d_q = ' + d.dq + '$: por el pequeño teorema de Fermat, $c^{d} \\equiv c^{d_p} \\pmod p$.', '$m_p = ' + (d.c % d.p) + '^{' + d.dp + '} \\bmod ' + d.p + ' = ' + d.mp + '$, $m_q = ' + (d.c % d.q) + '^{' + d.dq + '} \\bmod ' + d.q + ' = ' + d.mq + '$.', 'Teorema chino: $m = ' + d.m + '$. Comprobación directa: $' + d.c + '^{' + d.d + '} \\bmod ' + (d.p * d.q) + ' = ' + CR.potMod(d.c, d.d, d.p * d.q) + '$ ✓', 'Con primos de 1024 bits, las dos potencias con exponentes y módulos de la mitad de tamaño cuestan un cuarto: por eso todas las implementaciones descifran así.']; },
    answer: function (d) { return d.dp + ', ' + d.dq + ', m = ' + d.m; }
  });

  p.keys([
    '<strong>Euclides extendido</strong> da el inverso modular en como mucho $2\\log_2 n$ divisiones: microsegundos con números de 2048 bits.',
    '<strong>Cuadrados sucesivos</strong>: un cuadrado por bit del exponente y un producto por cada 1, todo reducido en cada paso. $2^{1000}$ de exponente son mil pasos.',
    '<strong>Teorema chino del resto</strong>: restos módulo primos entre sí determinan un único número módulo el producto, y se recompone con inversos.',
    'Trabajar módulo $pq$ es trabajar módulo $p$ y $q$ por separado: RSA descifra cuatro veces más rápido así.',
    'Los tres algoritmos son anteriores a los ordenadores: Pingala, Sunzi, Euclides.'
  ]);
});
