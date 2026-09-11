/* Tema: Aleatoriedad, entropia y contrasenas */
Course.topic('cr-entropia', function (p) {

  p.puente('La [[cr-vernam|libreta de un solo uso]] exigía una clave «de verdad aleatoria», y desde el ' +
    'primer tema se cuentan claves para medir la fuerza de un sistema. Este tema junta las dos cosas ' +
    'con el [[fn-exp-log|logaritmo en base 2]] y la [[av-informacion|entropía]] de Shannon: cuántos ' +
    'bits de sorpresa tiene una clave, y de dónde salen.');

  p.text('Una clave de 128 bits elegida al azar es inatacable. La misma clave, si la ha elegido una ' +
    'persona, casi nunca lo es: la gente elige fechas, nombres, «123456». La fuerza de una clave no ' +
    'está en la clave, sino en el <strong>proceso</strong> que la produjo: en cuánto no podía saber ' +
    'Eva de antemano. Eso se mide en bits, y tiene un nombre: entropía.');

  /* ---------------------------------------------------------------- */
  p.section('Bits de sorpresa');

  p.formula('H = \\log_2 N', 'entropía de una elección uniforme entre N posibilidades',
    'Se lee: <em>«hache es el logaritmo en base dos de ene»</em>. Es el número de bits que hacen falta ' +
    'para escribir cuál de las $N$ se ha elegido, y también cuántas preguntas de sí o no necesita ' +
    'Eva, en el mejor de los casos, para adivinarla.<br><br>Un dado tiene $\\log_2 6 = 2{,}58$ bits; ' +
    'un PIN de cuatro cifras, $\\log_2 10\\,000 = 13{,}3$; una clave de 128 bits al azar, 128. Y la ' +
    'fuerza bruta necesita, de media, $2^{H - 1}$ intentos.');

  p.table(['Cómo se eligió', 'Posibilidades', 'Bits'], [
    ['PIN de 4 cifras', '$10^4$', '13,3'],
    ['8 letras minúsculas al azar', '$26^8$', '37,6'],
    ['8 símbolos del teclado al azar', '$95^8$', '52,6'],
    ['12 símbolos del teclado al azar', '$95^{12}$', '78,8'],
    ['5 palabras al azar de una lista de 7776', '$7776^5$', '64,6'],
    ['Una palabra del diccionario con un número detrás', '$\\approx 80\\,000\\cdot 100$', '23'],
    ['Clave de AES', '$2^{128}$', '128']
  ]);

  p.demo({
    title: 'Cuánto vale una contraseña',
    intro: 'Escribe una contraseña. La demo mira qué tipos de carácter usa y calcula los bits que tendría si cada símbolo se hubiera elegido al azar entre los de esos tipos; después estima lo que tardaría un atacante con $10^{10}$ intentos por segundo, que es lo que hace una tarjeta gráfica contra un hash débil.',
    predice: 'Una contraseña de 8 símbolos variados y otra de 16 letras minúsculas: ¿cuál tiene más bits? Calcula antes $8\\cdot\\log_2 95$ y $16\\cdot\\log_2 26$.',
    build: function (host) {
      var pw = 'Tr4v3s1a!';
      var out = W.readout(host, '');
      function tiempo(seg) {
        if (seg < 1) return 'menos de un segundo';
        if (seg < 3600) return U.fmt(seg / 60, 1) + ' minutos';
        if (seg < 86400 * 2) return U.fmt(seg / 3600, 1) + ' horas';
        var a = seg / 31557600;
        if (a < 1) return U.fmt(seg / 86400, 0) + ' días';
        if (a < 1e6) return U.miles(Math.round(a)) + ' años';
        return a.toExponential(1).replace('e+', '·10^') + ' años';
      }
      function pinta() {
        var L = pw.length, A = 0, tipos = [];
        if (/[a-z]/.test(pw)) { A += 26; tipos.push('minúsculas'); }
        if (/[A-Z]/.test(pw)) { A += 26; tipos.push('mayúsculas'); }
        if (/[0-9]/.test(pw)) { A += 10; tipos.push('cifras'); }
        if (/[^a-zA-Z0-9]/.test(pw)) { A += 33; tipos.push('símbolos'); }
        if (!L || !A) { out.set('Escribe algo.'); return; }
        var bits = L * Math.log(A) / Math.LN2, seg = Math.pow(2, bits - 1) / 1e10;
        var aviso = /^[a-zA-Z]+[0-9]{0,4}[^a-zA-Z0-9]?$/.test(pw) ? '<br><span style="color:var(--warn)">Ojo: «palabra, quizá con números detrás» es lo primero que prueba un diccionario. Si la palabra existe, los bits reales rondan los 20 o 30, no los de arriba.</span>' : '';
        out.set(L + ' símbolos de un alfabeto de ' + A + ' (' + tipos.join(', ') + ').<br>Si cada uno fuera al azar: $' + L + '\\cdot\\log_2 ' + A + ' = ' + U.fmt(bits, 1) + '$ bits.<br>Fuerza bruta a $10^{10}$ por segundo: <strong>' + tiempo(seg) + '</strong>.' + aviso);
      }
      W.texto(host, { label: 'contraseña', value: pw, max: 40, on: function (v) { pw = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La entropía está en el proceso, no en la cadena');

  p.text('La demo calcula lo que valdría la contraseña <em>si</em> cada símbolo fuera al azar. Pero la ' +
    'gente no elige al azar: «Barcelona1992!» tiene catorce símbolos de cuatro tipos, unos 90 bits ' +
    'según la fórmula, y un atacante con una lista de ciudades y años la encuentra en segundos. Su ' +
    'entropía real es la del proceso que la generó: una ciudad entre unos miles, un año entre cien ' +
    'y un signo entre diez, unos 25 bits.');

  p.text('Por eso las recomendaciones actuales no piden símbolos raros sino <strong>azar de ' +
    'verdad</strong>: cinco o seis palabras elegidas con dados de una lista de 7776, el método ' +
    '<em>diceware</em>, dan 65 o 78 bits que se recuerdan; o mejor aún, un gestor de contraseñas que ' +
    'genere 20 símbolos al azar y los recuerde por ti.');

  p.comprueba('Dos contraseñas: «jK8#pQ2v» generada al azar, y «Valencia2024*» elegida por su dueño. ¿Cuál es más difícil de adivinar?', [
    { t: 'La primera: tiene 52 bits de azar. La segunda es una ciudad, un año y un signo, unos 25 bits, aunque sea más larga', ok: true, por: 'La longitud engaña. Lo que cuenta es cuántas posibilidades tenía que probar Eva sabiendo cómo se eligió, y «ciudad + año + signo» es un patrón con pocas posibilidades.' },
    { t: 'La segunda: es más larga y mezcla más tipos de símbolos', ok: false, por: 'Los tipos de símbolos solo valen si se eligieron al azar. Un diccionario de ciudades y años la recorre en un instante.' },
    { t: 'Las dos igual: lo único que importa es la longitud', ok: false, por: 'La longitud multiplica la entropía solo si cada símbolo aporta sorpresa. En «Valencia» la segunda letra no sorprende a nadie.' }
  ]);

  p.ejemplo({
    title: 'Diceware contra el teclado',
    enunciado: 'Comparar una contraseña de 10 símbolos del teclado (95 posibles) elegidos al azar con una frase de 6 palabras sacadas con dados de una lista de 7776. ¿Cuántos bits tiene cada una? ¿Cuántas palabras harían falta para llegar a 100 bits?',
    pasos: [
      { t: '<strong>El teclado.</strong> $10\\cdot\\log_2 95 = 10\\cdot 6{,}57 = 65{,}7$ bits.', antes: 'Bits por símbolo: $\\log_2 95$. ¿Cuánto es?' },
      { t: '<strong>Las palabras.</strong> $\\log_2 7776 = 12{,}92$ bits por palabra, porque $7776 = 6^5$: cinco tiradas de dado. Seis palabras: $77{,}5$ bits, más que los diez símbolos, y se recuerdan.', antes: '$7776 = 6^5$. ¿Cuántos bits da una palabra?' },
      { t: '<strong>Para 100 bits.</strong> $100 / 12{,}92 = 7{,}7$: hacen falta 8 palabras.', antes: 'Divide 100 entre los bits de una palabra y redondea hacia arriba.' },
      { t: '<strong>La condición.</strong> Todo esto vale si las palabras salen de los dados. Si las elige la persona, «casa perro sol luna» tiene la entropía de un poema de niño, no de $7776^4$.' }
    ],
    cierre: 'Los bits se suman: cada símbolo o palabra al azar aporta los suyos. Y se esfuman si alguien los elige.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Fabricar azar con una fórmula');

  p.text('Un ordenador es una máquina determinista: la misma entrada da la misma salida. Para producir ' +
    'números «al azar» usa una fórmula que, a partir de un valor inicial, la <strong>semilla</strong>, ' +
    'genera una sucesión que parece aleatoria. El generador clásico es el <strong>congruencial ' +
    'lineal</strong>:');

  p.formula('x_{n+1} = (a\\,x_n + c) \\bmod m', 'generador congruencial lineal',
    'Se lee: <em>«equis sub ene más uno es a por equis sub ene más ce, módulo eme»</em>. Cada número ' +
    'sale del anterior con una multiplicación, una suma y un resto.<br><br>Con buenos $a$, $c$, $m$ ' +
    'la sucesión pasa muchas pruebas estadísticas y sirve para simulaciones y juegos. Pero es una ' +
    'fórmula: quien conozca $a$, $c$, $m$ y un solo $x_n$ conoce todos los siguientes, y quien vea ' +
    'unos pocos valores puede deducirlos. Para una clave no sirve.');

  p.demo({
    title: 'Los puntos del generador',
    intro: 'Cada par de números consecutivos $(x_n, x_{n+1})$ es un punto. Con un generador perfecto los puntos cubrirían el cuadrado sin ningún orden; con un congruencial lineal se alinean en rectas, más o menos según los parámetros. Es lo que se llama la estructura de retículo, y en la primera regla de este bloque, es un patrón.',
    predice: 'Con $a = 5$, $c = 3$, $m = 256$, ¿los puntos parecerán una nube al azar o se colocarán en unas pocas rectas? ¿Y con $a = 137$?',
    build: function (host) {
      var a = 5, c = 3, m = 256, semilla = 1, puntos = [];
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -10, xmax: 266, ymin: -10, ymax: 266, height: 300, grid: false, xlabel: 'xₙ', ylabel: 'xₙ₊₁',
        aria: 'Nube de puntos formada por parejas de valores consecutivos de un generador congruencial lineal',
        draw: function (g) { puntos.forEach(function (pt) { g.point(pt[0], pt[1], { color: 0, r: 2.6 }); }); }
      });
      function pinta() {
        var l = CR.lcg(semilla, a, c, m, 400);
        puntos = [];
        for (var i = 0; i + 1 < l.length; i++) puntos.push([l[i], l[i + 1]]);
        var vistos = {}, periodo = 0;
        for (i = 0; i < l.length; i++) { if (vistos[l[i]] !== undefined) { periodo = i - vistos[l[i]]; break; } vistos[l[i]] = i; }
        plot.render();
        out.set('$x_{n+1} = (' + a + ' x_n + ' + c + ') \\bmod ' + m + '$, desde $x_0 = ' + semilla + '$: ' + l.slice(0, 8).join(', ') + ', …<br>periodo: <strong>' + (periodo || 'más de 400') + '</strong> de ' + m + ' posibles' +
          (periodo && periodo < m ? ' <span style="color:var(--warn)">(se repite antes de recorrerlos todos)</span>' : ''));
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'multiplicador a', min: 1, max: 255, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'incremento c', min: 0, max: 255, step: 1, value: c, on: function (v) { c = v; pinta(); } });
      W.slider(W.row(host), { label: 'semilla', min: 0, max: 255, step: 1, value: semilla, on: function (v) { semilla = v; pinta(); } });
      pinta();
    }
  });

  p.text('Para la criptografía hace falta otra cosa: un generador cuya salida sea <strong>impredecible</strong> ' +
    'aunque se conozca el algoritmo entero, y que se alimente de azar físico: el ruido térmico de un ' +
    'circuito, los microsegundos entre pulsaciones de teclado, el temblor de un sensor. Los sistemas ' +
    'operativos lo tienen incorporado, y todo lo que sea una clave debe salir de ahí. La lección ' +
    'del bloque, otra vez: aleatorio no significa impredecible.');

  p.util('En 2008 se descubrió que una distribución de Linux llevaba dos años generando claves con un ' +
    'generador al que se le había quitado, por error, casi toda la fuente de azar: solo quedaban ' +
    'unos 15 bits de entropía, unas 32 000 claves posibles en total, y todas se recalcularon en ' +
    'horas. En 2012 un estudio de millones de claves públicas en internet encontró decenas de miles ' +
    'que compartían factores, porque los aparatos que las generaron arrancaban con casi la misma ' +
    'semilla. Y en los casinos, más de un jugador ha vaciado máquinas tragaperras prediciendo su ' +
    'generador congruencial. El azar malo es la causa más frecuente de fallo en sistemas cuya ' +
    'matemática era impecable.');

  p.hist('John von Neumann, que propuso en 1946 uno de los primeros generadores, dijo que quien intenta ' +
    'producir azar con métodos aritméticos «vive, por supuesto, en pecado». Derrick Lehmer publicó el ' +
    'congruencial lineal en 1949, y George Marsaglia demostró en 1968 que sus puntos caen en unos ' +
    'pocos planos, el resultado que la demo enseña. Arnold Reinhold publicó la lista de diceware en ' +
    '1995. Y las guías oficiales de contraseñas, que durante veinte años exigieron símbolos raros y ' +
    'cambios frecuentes, cambiaron en 2017 a pedir longitud y azar, tras comprobar que las reglas ' +
    'antiguas producían contraseñas peores.');

  p.trampas([
    { e: 'Medir la contraseña por su aspecto', por: '«P@ssw0rd!» parece fuerte y está en todas las listas de ataque. La entropía es la del proceso: una palabra conocida con sustituciones previsibles son unos 15 bits.' },
    { e: 'Generar claves con un congruencial lineal', por: 'Con tres valores consecutivos se despejan $a$ y $c$, y con ellos toda la sucesión. Las claves salen del generador criptográfico del sistema.' },
    { e: 'Confundir un periodo largo con impredecibilidad', por: 'Un generador puede tardar $2^{19937}$ pasos en repetirse y predecirse tras ver 624 valores, como le pasa al Mersenne Twister. Largo no es lo mismo que secreto.' },
    { e: 'Exigir cambios de contraseña cada mes', por: 'La gente responde con «Marzo2024», «Abril2024». Cada cambio le quita entropía. Una contraseña larga y al azar se cambia solo si hay sospecha de fuga.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Bits de una elección',
    level: 'basico',
    gen: function (r) { var casos = [{ t: 'un dado de 20 caras', n: 20 }, { t: 'una carta de una baraja de 40', n: 40 }, { t: 'un PIN de 6 cifras', n: 1e6 }, { t: 'una palabra de una lista de 7776', n: 7776 }, { t: 'una letra del alfabeto de 26', n: 26 }, { t: 'un día del año', n: 365 }, { t: 'una combinación de un candado de 3 ruedas de 10', n: 1000 }]; var c = r.pick(casos); return { t: c.t, n: c.n, h: Math.log(c.n) / Math.LN2 }; },
    ask: function (d) { return 'Se elige al azar ' + d.t + '. ¿Cuántos bits de entropía tiene la elección? (un decimal)'; },
    fields: [{ name: 'h', label: 'bits', w: 'tiny' }],
    sol: function (d) { return { h: d.h }; },
    dec: 1,
    hint: function () { return '$\\log_2 N$. Si la calculadora no tiene logaritmo en base 2: $\\ln N / \\ln 2$.'; },
    steps: function (d) { return ['$N = ' + U.miles(d.n) + '$.', '$\\log_2 ' + U.miles(d.n) + ' = ' + U.fmt(d.h, 2) + '$ bits.', 'Es el número de preguntas de sí o no que, bien elegidas, adivinan el resultado.']; },
    answer: function (d) { return U.fmt(d.h, 1) + ' bits'; }
  });

  p.exercise({
    title: 'Bits de una contraseña al azar',
    level: 'basico',
    gen: function (r) { var casos = [{ t: 'cifras', a: 10 }, { t: 'letras minúsculas', a: 26 }, { t: 'letras y cifras', a: 36 }, { t: 'mayúsculas, minúsculas y cifras', a: 62 }, { t: 'símbolos cualesquiera del teclado', a: 95 }]; var c = r.pick(casos), L = r.int(6, 16); return { t: c.t, a: c.a, L: L, h: L * Math.log(c.a) / Math.LN2 }; },
    ask: function (d) { return 'Una contraseña de ' + d.L + ' caracteres, cada uno elegido al azar entre ' + d.t + ' (' + d.a + ' posibles). ¿Cuántos bits de entropía tiene? (un decimal)'; },
    fields: [{ name: 'h', label: 'bits', w: 'tiny' }],
    sol: function (d) { return { h: d.h }; },
    dec: 1,
    errores: [{ si: function (v, d) { return Math.abs(v.h - Math.log(d.a) / Math.LN2) < 0.06; }, msg: 'Eso es un solo carácter. Hay ' + '$L$ independientes: los bits se suman, $L\\cdot\\log_2 A$.' }],
    hint: function () { return 'Cada carácter aporta $\\log_2 A$ bits, y son independientes: se multiplica por la longitud.'; },
    steps: function (d) { return ['Por carácter: $\\log_2 ' + d.a + ' = ' + U.fmt(Math.log(d.a) / Math.LN2, 2) + '$ bits.', 'Por ' + d.L + ': $' + U.fmt(d.h, 1) + '$ bits.', 'Equivale a $2^{' + U.fmt(d.h, 1) + '} \\approx ' + Math.pow(2, d.h).toExponential(1).replace('e+', '\\cdot 10^{') + '}$ contraseñas posibles.']; },
    answer: function (d) { return U.fmt(d.h, 1) + ' bits'; }
  });

  p.exercise({
    title: 'Cuánto aguanta',
    level: 'medio',
    gen: function (r) { var h = r.pick([30, 36, 40, 44, 48, 52, 56, 60]), v = r.pick([1e6, 1e9, 1e10, 1e12]); var seg = Math.pow(2, h - 1) / v; return { h: h, v: v, exp: Math.round(Math.log(v) / Math.LN10), seg: seg, anos: seg / 31557600 }; },
    ask: function (d) { return 'Una clave tiene ' + d.h + ' bits de entropía y el atacante prueba $10^{' + d.exp + '}$ por segundo. ¿Cuántos años tarda, de media, en encontrarla? (un año son $3{,}156\\cdot 10^7$ segundos; da el resultado con dos decimales, aunque sea una fracción de año)'; },
    fields: [{ name: 'a', label: 'años', w: 'tiny' }],
    sol: function (d) { return { a: d.anos }; },
    dec: 2, tol: 2e-3,
    hint: function () { return ['Intentos medios: $2^{H-1}$.', 'Segundos: intentos entre velocidad. Años: entre $3{,}156\\cdot 10^7$.']; },
    steps: function (d) { return ['$2^{' + (d.h - 1) + '} = ' + Math.pow(2, d.h - 1).toExponential(2).replace('e+', '\\cdot 10^{') + '}$ intentos de media.', 'Entre $10^{' + d.exp + '}$: $' + d.seg.toExponential(2).replace('e+', '\\cdot 10^{') + '}$ segundos.', 'Entre $3{,}156\\cdot 10^7$: $' + U.fmt(d.anos, 2) + '$ años.' + (d.anos < 1 ? ' Menos de un año: esa clave no vale contra ese atacante.' : '')]; },
    answer: function (d) { return U.fmt(d.anos, 2) + ' años'; }
  });

  p.exercise({
    title: 'El siguiente número del generador',
    level: 'medio',
    gen: function (r) { var m = r.pick([100, 128, 256, 1000]), a = r.int(3, 99), c = r.int(1, 99), x = r.int(0, m - 1); var l = CR.lcg(x, a, c, m, 2); return { m: m, a: a, c: c, x: x, x1: l[0], x2: l[1] }; },
    ask: function (d) { return 'Un generador congruencial lineal tiene $a = ' + d.a + '$, $c = ' + d.c + '$, $m = ' + d.m + '$ y acaba de producir $x_n = ' + d.x + '$. ¿Cuáles son los dos números siguientes?'; },
    fields: [{ name: 'x1', label: 'x₍ₙ₊₁₎', w: 'tiny' }, { name: 'x2', label: 'x₍ₙ₊₂₎', w: 'tiny' }],
    sol: function (d) { return { x1: d.x1, x2: d.x2 }; },
    errores: [{ si: function (v, d) { return v.x1 === d.a * d.x + d.c && d.a * d.x + d.c >= d.m; }, msg: 'Falta el resto módulo $m$.' }],
    hint: function () { return 'Multiplica por $a$, suma $c$, quédate con el resto. Y otra vez con el resultado.'; },
    steps: function (d) { return ['$' + d.a + '\\cdot ' + d.x + ' + ' + d.c + ' = ' + (d.a * d.x + d.c) + ' \\equiv ' + d.x1 + ' \\pmod{' + d.m + '}$.', '$' + d.a + '\\cdot ' + d.x1 + ' + ' + d.c + ' = ' + (d.a * d.x1 + d.c) + ' \\equiv ' + d.x2 + '$.', 'Quien conoce la fórmula y un valor conoce todos los siguientes: por eso no sirve para claves.']; },
    answer: function (d) { return d.x1 + ', ' + d.x2; }
  });

  p.exercise({
    title: 'Despejar el generador',
    level: 'avanzado',
    gen: function (r) {
      var m = r.pick([101, 103, 107, 109, 113]), a = r.int(2, m - 1), c = r.int(0, m - 1), x0 = r.int(1, m - 1);
      var l = CR.lcg(x0, a, c, m, 3), x1 = l[0], x2 = l[1], x3 = l[2];
      var d1 = CR.mod(x1 - x0, m), d2 = CR.mod(x2 - x1, m);
      if (d1 === 0 || CR.inv(d1, m) === null) return null;
      return { m: m, a: a, c: c, x0: x0, x1: x1, x2: x2, x3: x3, d1: d1, d2: d2, inv: CR.inv(d1, m) };
    },
    ask: function (d) { return 'Eva ve tres valores consecutivos de un generador congruencial lineal con $m = ' + d.m + '$ (primo): $' + d.x0 + ',\\ ' + d.x1 + ',\\ ' + d.x2 + '$. No conoce $a$ ni $c$. Recupéralos y predice el siguiente valor.'; },
    fields: [{ name: 'a', label: 'a', w: 'tiny' }, { name: 'c', label: 'c', w: 'tiny' }, { name: 'x', label: 'siguiente', w: 'tiny' }],
    sol: function (d) { return { a: d.a, c: d.c, x: d.x3 }; },
    hint: function (d) { return ['Restando dos ecuaciones desaparece $c$: $x_2 - x_1 \\equiv a\\,(x_1 - x_0)$.', 'El inverso de $' + d.d1 + '$ módulo $' + d.m + '$ es $' + d.inv + '$: con él se despeja $a$, y después $c = x_1 - a\\,x_0$.']; },
    steps: function (d) { return ['$x_1 - x_0 \\equiv ' + d.d1 + '$ y $x_2 - x_1 \\equiv ' + d.d2 + '$, así que $a \\equiv ' + d.d2 + '\\cdot ' + d.d1 + '^{-1} \\equiv ' + d.d2 + '\\cdot ' + d.inv + ' \\equiv ' + d.a + '$.', '$c \\equiv x_1 - a\\,x_0 \\equiv ' + d.x1 + ' - ' + d.a + '\\cdot ' + d.x0 + ' \\equiv ' + d.c + '$.', 'Siguiente: $' + d.a + '\\cdot ' + d.x2 + ' + ' + d.c + ' \\equiv ' + d.x3 + '$.', 'Tres valores han bastado. Un generador criptográfico tiene que resistir esto aunque Eva vea millones de valores.']; },
    answer: function (d) { return 'a = ' + d.a + ', c = ' + d.c + ', siguiente ' + d.x3; }
  });

  p.keys([
    'Entropía: $H = \\log_2 N$ bits para una elección uniforme entre $N$. La fuerza bruta necesita $2^{H-1}$ intentos de media.',
    'Los bits se suman símbolo a símbolo solo si cada símbolo es al azar: la entropía es del proceso, no de la cadena.',
    'Una contraseña elegida por una persona vale lo que el patrón con que la eligió: «ciudad + año» son unos 25 bits, por larga que sea.',
    'Un generador congruencial lineal es una fórmula: tres valores consecutivos lo delatan. Las claves salen del generador criptográfico del sistema, alimentado con azar físico.',
    'Aleatorio no es lo mismo que impredecible; el azar malo es la causa más común de fallo real.'
  ]);
});
