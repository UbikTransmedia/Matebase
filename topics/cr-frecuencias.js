/* Tema: Analisis de frecuencias: el idioma delata la clave */
Course.topic('cr-frecuencias', function (p) {

  p.puente('El [[cr-cesar|César]] cayó por tener 25 claves. Este tema pasa a un cifrado con más claves ' +
    'que átomos tiene un grano de arena, y lo rompe igual, con la herramienta de ' +
    '[[pe-descriptiva|estadística descriptiva]] más sencilla que hay: contar cuántas veces aparece ' +
    'cada letra.');

  p.text('Si en vez de desplazar el alfabeto se baraja entero, cada letra del mensaje va a parar a otra ' +
    'cualquiera, sin ningún orden. Es la <strong>sustitución monoalfabética</strong>, y durante ' +
    'siglos pareció el final de la historia: nadie puede probar todas las claves. Y sin embargo ' +
    'tiene una grieta que no está en el método sino en el mensaje: los mensajes están escritos en ' +
    'un idioma, y los idiomas tienen costumbres.');

  /* ---------------------------------------------------------------- */
  p.section('Cuatrocientos mil cuatrillones de alfabetos');

  p.text('Una clave de sustitución es un alfabeto desordenado: la A va a la K, la B a la X, y así. Para la ' +
    'primera letra hay 26 destinos, para la segunda 25, y el total es el [[pe-combinatoria|factorial]]:');

  p.formula('|K| = 26! = 403\\,291\\,461\\,126\\,605\\,635\\,584\\,000\\,000 \\approx 4\\cdot 10^{26}',
    'el espacio de claves de la sustitución',
    'Se lee: <em>«veintiséis factorial»</em>: $26\\cdot 25\\cdot 24 \\cdots 2\\cdot 1$.<br><br>Probando ' +
    'mil millones por segundo, la fuerza bruta tardaría trece mil millones de años, la edad del ' +
    'universo. Y aun así el cifrado se rompe en una tarde. El espacio de claves es necesario, no ' +
    'suficiente.');

  p.text('La grieta es esta: la sustitución cambia <em>qué</em> letra se escribe, pero no <em>cuántas ' +
    'veces</em> se escribe. Si en el mensaje la E aparece el 14 % de las veces, la letra que la ' +
    'sustituye aparecerá el 14 % de las veces en el cifrado. Y en castellano, la E y la A aparecen ' +
    'muchísimo más que la K o la W.');

  p.table(['Letra', 'Frecuencia en castellano', 'Letra', 'Frecuencia'], [
    ['E', '13,7 %', 'C', '4,7 %'],
    ['A', '12,5 %', 'T', '4,6 %'],
    ['O', '8,7 %', 'U', '3,9 %'],
    ['S', '8,0 %', 'M', '3,2 %'],
    ['N', '7,0 %', 'P', '2,5 %'],
    ['R', '6,9 %', 'B, G, V, Y, Q, H, F, Z, J, X', 'menos del 1,5 % cada una'],
    ['I', '6,3 %', 'K, W', 'casi nunca'],
    ['D', '5,9 %', '', ''],
    ['L', '5,0 %', '', '']
  ]);

  p.demo({
    title: 'Las frecuencias de un texto',
    intro: 'Las barras claras son las frecuencias del castellano; las oscuras, las del texto que escribas. Empieza con el arranque del Quijote y prueba después con un texto tuyo, corto o largo.',
    predice: 'Con un texto de 30 letras, ¿las barras se parecerán mucho o poco a las del castellano? ¿Y con 300? Piensa en lo que pasa al lanzar una moneda 10 veces o 1000.',
    build: function (host) {
      var texto = CR.QUIJOTE.slice(0, 420), cuentas = CR.frecuencias(texto), n = CR.limpia(texto).length;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.7, xmax: 25.7, ymin: 0, ymax: 16, height: 280, xstep: 1, ylabel: '%', xlabel: null,
        aria: 'Diagrama de barras con la frecuencia de cada letra en castellano y en el texto escrito',
        xtickLabel: function (i) { return CR.ABC.charAt(Math.round(i)) || ''; },
        draw: function (g) {
          for (var i = 0; i < 26; i++) {
            g.rect(i - 0.42, 0, 0.42, CR.FREC_ES[i], { fill: 'axis', color: 'axis', fillAlpha: .35, w: 1 });
            g.rect(i, 0, 0.42, n ? 100 * cuentas[i] / n : 0, { fill: 0, color: 0, fillAlpha: .7, w: 1 });
          }
        }
      });
      function pinta() {
        cuentas = CR.frecuencias(texto); n = CR.limpia(texto).length;
        var orden = CR.ABC.split('').map(function (c, i) { return { c: c, f: cuentas[i] }; }).sort(function (a, b) { return b.f - a.f; });
        plot.render();
        out.set(n + ' letras. Las más frecuentes: ' + orden.slice(0, 5).map(function (x) { return '<strong>' + x.c + '</strong> ' + U.fmt(n ? 100 * x.f / n : 0, 1) + ' %'; }).join(' · ') +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">χ² frente al castellano: ' + U.fmt(CR.chi2(cuentas, n), 1) + ' (cuanto más bajo, más parecido)</span>');
      }
      W.texto(host, { label: 'texto', value: texto, multilinea: true, on: function (v) { texto = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Medir cuánto se parece a castellano');

  p.text('Para que un ordenador reconozca castellano sin entenderlo hace falta un número que diga cuánto ' +
    'se parecen unas frecuencias a otras. El más usado es el mismo de la ' +
    '[[pe-contraste|estadística]]: para cada letra, la diferencia entre lo observado y lo esperado, ' +
    'al cuadrado, dividida entre lo esperado.');

  p.formula('\\chi^2 = \\sum_{\\ell = A}^{Z} \\frac{(O_\\ell - E_\\ell)^2}{E_\\ell}, \\qquad E_\\ell = n\\,p_\\ell',
    'chi cuadrado frente al castellano',
    'Se lee: <em>«chi cuadrado es la suma, para cada letra, del cuadrado de observado menos esperado ' +
    'partido por esperado»</em>. $O_\\ell$ es cuántas veces aparece la letra en el texto, $n$ es el ' +
    'total de letras y $p_\\ell$ la frecuencia de esa letra en castellano.<br><br>' +
    'Un texto en castellano da valores bajos; un texto cifrado, o en otro idioma, altos. No hace ' +
    'falta entender nada: solo contar. Con esa medida, romper un César es calcular $\\chi^2$ para ' +
    'las 25 claves y quedarse con la menor, que es lo que hacía la demo del tema anterior.');

  p.ejemplo({
    title: 'Chi cuadrado de un texto corto',
    enunciado: 'Un texto de 100 letras tiene 20 E, 10 A y 8 K, entre otras. Calcular la aportación de esas tres letras al $\\chi^2$ frente al castellano, con $p_E = 13{,}7\\,\\%$, $p_A = 12{,}5\\,\\%$ y $p_K = 0{,}02\\,\\%$.',
    pasos: [
      { t: '<strong>Lo esperado.</strong> Con $n = 100$: $E_E = 13{,}7$, $E_A = 12{,}5$ y $E_K = 0{,}02$.', antes: 'Esperado es total por frecuencia. ¿Cuántas K se esperan en 100 letras?' },
      { t: '<strong>La E.</strong> $(20 - 13{,}7)^2 / 13{,}7 = 39{,}69 / 13{,}7 = 2{,}90$. Algo más de lo normal, pero poco.', antes: 'Observado 20, esperado 13,7. ¿Cuánto aporta?' },
      { t: '<strong>La A.</strong> $(10 - 12{,}5)^2 / 12{,}5 = 6{,}25 / 12{,}5 = 0{,}50$. Casi nada.' },
      { t: '<strong>La K.</strong> $(8 - 0{,}02)^2 / 0{,}02 = 63{,}68 / 0{,}02 = 3184$. Ocho K donde se esperaba ninguna disparan el valor: una letra rara que aparece mucho es la señal más clara de que el texto no es castellano.', antes: '¿Por qué crees que la K va a pesar tanto más que la E?' }
    ],
    cierre: 'Las letras raras mandan en el chi cuadrado, porque el denominador es minúsculo. Por eso el método distingue tan bien un texto cifrado: en el cifrado, alguna letra rara ocupa el sitio de la E.'
  });

  p.comprueba('Un texto cifrado por sustitución tiene la letra Q el 14 % de las veces, más que ninguna otra. ¿Qué es lo más probable?', [
    { t: 'Que la Q sustituye a la E, la letra más frecuente del castellano', ok: true, por: 'La sustitución conserva las frecuencias. La letra que más aparece en el cifrado ocupa el sitio de la que más aparece en el idioma: la E, y si no, la A.' },
    { t: 'Que el mensaje tiene muchas palabras con Q', ok: false, por: 'La Q del cifrado no es la Q del mensaje: es la letra que la clave ha puesto en su lugar. Las frecuencias hablan del original, no del cifrado.' },
    { t: 'Nada: con $26!$ claves no se puede saber nada', ok: false, por: 'El número de claves protege contra la fuerza bruta, no contra la estadística. Aquí no se prueban claves: se deduce la clave letra a letra.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Romper una sustitución a mano');

  p.text('Con las frecuencias se empieza; con el idioma se termina. Las letras más frecuentes del ' +
    'cifrado se asignan a E, A, O, S; con eso ya se leen trozos de palabras, y cada palabra ' +
    'reconocida da dos o tres letras nuevas. Es un puzle en el que cada pieza colocada facilita ' +
    'la siguiente. Pruébalo.');

  p.demo({
    title: 'El puzle de la sustitución',
    intro: 'El texto está cifrado con un alfabeto barajado. Escribe parejas como <code>K=E, P=A</code> para proponer que la K del cifrado es una E del original. Las letras sin asignar se muestran en minúscula. El botón propone las asignaciones por frecuencia; después toca afinar leyendo.',
    predice: 'Si asignas solo las cuatro letras más frecuentes del cifrado a E, A, O y S, ¿cuántas acertarás? ¿Bastará para leer alguna palabra?',
    build: function (host) {
      var r = U.rng(2024), alfabeto = r.shuffle(CR.ABC.split('')).join('');
      var claro = CR.limpia(CR.QUIJOTE.slice(0, 330), true), cifrado = claro.split('').map(function (c) { return c === ' ' ? ' ' : alfabeto.charAt(CR.num(c)); }).join('');
      var mapa = {}, out = W.mono(host, '');
      var campo;
      function pinta() {
        var h = '', aciertos = 0, total = 0;
        for (var k in mapa) if (Object.prototype.hasOwnProperty.call(mapa, k)) { total++; if (alfabeto.charAt(CR.num(mapa[k])) === k) aciertos++; }
        var texto = cifrado.split('').map(function (c) { return c === ' ' ? ' ' : (mapa[c] ? '<b>' + mapa[c] + '</b>' : c.toLowerCase()); }).join('');
        h += '<span class="cr-tenue">cifrado:</span>\n' + cifrado + '\n\n<span class="cr-tenue">propuesta:</span>\n' + texto + '\n\n' + total + ' letras asignadas, ' + aciertos + ' correctas.';
        out.set(h);
      }
      function lee(v) {
        mapa = {};
        String(v).toUpperCase().split(/[,;\s]+/).forEach(function (par) {
          var m = /^([A-Z])=([A-Z])$/.exec(par.trim());
          if (m) mapa[m[1]] = m[2];
        });
        pinta();
      }
      campo = W.texto(host, { label: 'asignaciones (cifrada=original)', value: '', on: lee });
      W.buttons(host, [{ t: 'Proponer por frecuencias', on: function () {
        var c = CR.frecuencias(cifrado), orden = CR.ABC.split('').sort(function (a, b) { return c[CR.num(b)] - c[CR.num(a)]; });
        var es = CR.ABC.split('').sort(function (a, b) { return CR.FREC_ES[CR.num(b)] - CR.FREC_ES[CR.num(a)]; });
        var s = [];
        for (var i = 0; i < 8; i++) s.push(orden[i] + '=' + es[i]);
        campo.set(s.join(', '), true);
      } }, { t: 'Ver la clave', on: function () {
        var s = [];
        for (var i = 0; i < 26; i++) s.push(alfabeto.charAt(i) + '=' + CR.ABC.charAt(i));
        campo.set(s.join(', '), true);
      } }]);
      pinta();
    }
  });

  p.text('Fíjate en lo que ha pasado: las cuatro o cinco letras más frecuentes salen bien casi siempre, ' +
    'las de en medio se confunden entre sí, y a partir de ahí lo que rompe el cifrado no es la ' +
    'estadística sino la lectura. Un ordenador hace lo mismo con un diccionario: propone, comprueba ' +
    'cuántas palabras salen, corrige. Con doscientas letras basta.');

  p.util('El análisis de frecuencias es la primera técnica de la historia que rompió un cifrado sin ' +
    'conocer la clave, y sigue vivo en cosas que no tienen que ver con espías: los programas que ' +
    'detectan en qué idioma está escrito un texto miran las frecuencias de letras y de pares de ' +
    'letras; los que reconocen un autor cuentan palabras; y los compresores de archivos, como el ' +
    'zip, se basan en exactamente lo mismo, que unas letras aparecen mucho más que otras, para ' +
    'darles códigos más cortos, como viste en [[av-informacion|teoría de la información]].');

  p.hist('El primer tratado de criptoanálisis que se conserva es de Al-Kindi, un sabio de Bagdad del ' +
    'siglo IX, y explica el método de las frecuencias con un ejemplo en árabe; se redescubrió en ' +
    'un manuscrito en 1987. En Europa el método reapareció en el Renacimiento. En 1586 sirvió para ' +
    'leer las cartas cifradas de María Estuardo, reina de Escocia, que conspiraba contra Isabel I; ' +
    'los descifradores de Walsingham no solo las leyeron: añadieron una posdata falsa en el mismo ' +
    'cifrado pidiendo los nombres de los conspiradores. María fue ejecutada al año siguiente.');

  p.trampas([
    { e: 'Creer que $26!$ claves hacen el cifrado seguro', por: 'La fuerza bruta es imposible y da igual: la clave se deduce letra a letra contando. El espacio de claves es necesario, no suficiente.' },
    { e: 'Asignar E, A, O, S en orden y darlas por buenas', por: 'Las frecuencias de A y E están muy cerca, y las de O, S, N, R también. En un texto de 200 letras se intercambian a menudo. Se proponen y se comprueban leyendo.' },
    { e: 'Usar un texto corto para decidir', por: 'Con 20 letras las frecuencias son ruido: una sola palabra rara cambia todo el reparto. El método necesita del orden de un centenar de letras.' },
    { e: 'Olvidar que las letras raras pesan mucho en $\\chi^2$', por: 'Ocho K en cien letras aportan más de 3000 al chi cuadrado; veinte E, menos de 3. El denominador pequeño manda.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Frecuencia relativa',
    level: 'basico',
    gen: function (r) { var n = r.pick([120, 150, 200, 250, 300, 400]), l = r.pick(['E', 'A', 'O', 'S', 'N']), k = Math.round(n * (CR.FREC_ES[CR.num(l)] / 100) * r.real(0.7, 1.3, 2)); return { n: n, l: l, k: k, f: 100 * k / n }; },
    ask: function (d) { return 'Un texto tiene ' + d.n + ' letras, y ' + d.k + ' de ellas son ' + d.l + '. ¿Qué porcentaje del texto es la letra ' + d.l + '? (un decimal)'; },
    fields: [{ name: 'f', label: '%', w: 'tiny' }],
    sol: function (d) { return { f: d.f }; },
    dec: 1,
    hint: function () { return 'Cuenta entre total, por cien.'; },
    steps: function (d) { return ['$' + d.k + ' / ' + d.n + ' = ' + U.fmt(d.k / d.n, 4) + '$.', 'Por cien: $' + U.fmt(d.f, 1) + '\\,\\%$.', 'En castellano la ' + d.l + ' ronda el ' + U.fmt(CR.FREC_ES[CR.num(d.l)], 1) + ' %: ' + (Math.abs(d.f - CR.FREC_ES[CR.num(d.l)]) < 2 ? 'este texto encaja.' : 'este texto se desvía, como pasa con textos cortos o de tema muy concreto.')]; },
    answer: function (d) { return U.fmt(d.f, 1) + ' %'; }
  });

  p.exercise({
    title: 'Cuántos alfabetos',
    level: 'basico',
    gen: function (r) { var n = r.int(5, 9); return { n: n, v: ML.factorial(n) }; },
    ask: function (d) { return 'Un idioma imaginario tiene solo ' + d.n + ' letras. ¿Cuántas claves distintas tiene el cifrado por sustitución, es decir, cuántas formas hay de barajar su alfabeto?'; },
    fields: [{ name: 'v', label: 'claves', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    errores: [{ si: function (v, d) { return v.v === Math.pow(d.n, d.n); }, msg: 'Eso permite que dos letras vayan a la misma: no sería descifrable. Cada letra ocupa un destino distinto: es una permutación, $n!$.' }, { si: function (v, d) { return v.v === d.n * (d.n - 1); }, msg: 'Eso es solo para las dos primeras letras. Sigue: $n\\cdot(n-1)\\cdot(n-2)\\cdots 1$.' }],
    hint: function () { return 'La primera letra tiene $n$ destinos, la segunda $n - 1$, y así hasta 1: es el factorial.'; },
    steps: function (d) { return ['$' + d.n + '! = ' + (function () { var s = []; for (var i = d.n; i >= 1; i--) s.push(i); return s.join('\\cdot '); })() + '$.', '$= ' + U.miles(d.v) + '$ claves.', 'Con 26 letras son $26! \\approx 4\\cdot 10^{26}$.']; },
    answer: function (d) { return U.miles(d.v); }
  });

  p.exercise({
    title: 'La letra que más aparece',
    level: 'medio',
    gen: function (r) {
      var abc = r.shuffle(CR.ABC.split('')), c1 = abc[0], c2 = abc[1], c3 = abc[2];
      var f1 = r.real(12.8, 15, 1), f2 = r.real(10.5, 12.4, 1), f3 = r.real(8.3, 9.3, 1);
      return { c1: c1, c2: c2, c3: c3, f1: f1, f2: f2, f3: f3 };
    },
    ask: function (d) { return 'En un texto largo cifrado por sustitución, las letras más frecuentes del cifrado son ' + d.c1 + ' (' + U.fmt(d.f1, 1) + ' %), ' + d.c2 + ' (' + U.fmt(d.f2, 1) + ' %) y ' + d.c3 + ' (' + U.fmt(d.f3, 1) + ' %). ¿Qué letra del original es, con más probabilidad, la ' + d.c1 + '? ¿Y la ' + d.c3 + '?'; },
    fields: [{ name: 'a', label: 'la primera es', opts: [{ t: 'E', v: 'E' }, { t: 'A', v: 'A' }, { t: 'O', v: 'O' }, { t: 'S', v: 'S' }] }, { name: 'b', label: 'y la tercera', opts: [{ t: 'E', v: 'E' }, { t: 'A', v: 'A' }, { t: 'O', v: 'O' }, { t: 'S', v: 'S' }] }],
    sol: function () { return { a: 'E', b: 'O' }; },
    hint: function () { return 'Las frecuencias del castellano, de mayor a menor: E, A, O, S, N, R…'; },
    steps: function (d) { return ['La sustitución conserva las frecuencias: la letra más frecuente del cifrado ocupa el sitio de la más frecuente del castellano.', 'Con un ' + U.fmt(d.f1, 1) + ' %, la ' + d.c1 + ' es casi seguro la <strong>E</strong> (13,7 %); la ' + d.c2 + ', la A (12,5 %); y la ' + d.c3 + ', con un ' + U.fmt(d.f3, 1) + ' %, la <strong>O</strong> (8,7 %).', 'Casi seguro, no seguro: E y A están muy cerca. Se confirma leyendo.']; },
    answer: function () { return 'E y O'; }
  });

  p.exercise({
    title: 'Chi cuadrado de una letra',
    level: 'avanzado',
    gen: function (r) {
      var l = r.pick(['E', 'A', 'O', 'S', 'K', 'X', 'Z', 'J']), n = r.pick([100, 200, 500]), pl = CR.FREC_ES[CR.num(l)];
      var esp = n * pl / 100, obs = Math.max(0, Math.round(esp * r.real(0.3, 2.5, 2) + (pl < 1 ? r.int(0, 5) : 0)));
      if (Math.abs(obs - esp) < 0.05) return null;
      return { l: l, n: n, pl: pl, esp: esp, obs: obs, chi: (obs - esp) * (obs - esp) / esp };
    },
    ask: function (d) { return 'Un texto de ' + d.n + ' letras contiene ' + d.obs + ' veces la letra ' + d.l + ', cuya frecuencia en castellano es del ' + U.fmt(d.pl, 2) + ' %. ¿Cuánto aporta esa letra al $\\chi^2$, es decir, cuánto vale $(O - E)^2 / E$? (dos decimales)'; },
    fields: [{ name: 'chi', label: 'aportación', w: 'tiny' }],
    sol: function (d) { return { chi: d.chi }; },
    dec: 2, tol: 5e-3,
    errores: [{ si: function (v, d) { return Math.abs(v.chi - Math.abs(d.obs - d.esp)) < 0.01 && Math.abs(d.chi - Math.abs(d.obs - d.esp)) > 0.05; }, msg: 'Eso es la diferencia sin elevar al cuadrado ni dividir. La fórmula es $(O - E)^2 / E$.' }],
    hint: function (d) { return ['Esperado: $E = n\\,p = ' + d.n + '\\cdot ' + U.fmt(d.pl / 100, 4) + '$.', 'Después, $(O - E)^2 / E$.']; },
    steps: function (d) { return ['$E = ' + d.n + '\\cdot ' + U.fmt(d.pl, 2) + '\\,\\% = ' + U.fmt(d.esp, 2) + '$.', '$(' + d.obs + ' - ' + U.fmt(d.esp, 2) + ')^2 / ' + U.fmt(d.esp, 2) + ' = ' + U.fmt(d.chi, 2) + '$.', d.pl < 1 ? 'Una letra rara que aparece más de la cuenta dispara el valor: es la señal típica de un texto cifrado.' : 'Una desviación en una letra frecuente aporta poco: el denominador es grande.']; },
    answer: function (d) { return U.fmt(d.chi, 2); }
  });

  p.exercise({
    title: 'Descifra con el mapa',
    level: 'avanzado',
    gen: function (r) {
      var palabras = ['SECRETO', 'MENSAJE', 'ESPIA', 'CLAVE', 'ENIGMA', 'PUENTE', 'CAMINO', 'CASTILLO', 'SOLDADO'];
      var w = r.pick(palabras), alfabeto = r.shuffle(CR.ABC.split('')).join('');
      var c = CR.sustituye(w, alfabeto), pares = [], vistos = {};
      for (var i = 0; i < w.length; i++) { if (!vistos[c.charAt(i)]) { vistos[c.charAt(i)] = 1; pares.push(c.charAt(i) + ' = ' + w.charAt(i)); } }
      return { w: w, c: c, pares: r.shuffle(pares) };
    },
    ask: function (d) { return 'Analizando un texto cifrado por sustitución se han deducido estas parejas (letra del cifrado = letra del original): <strong>' + d.pares.join(', ') + '</strong>. ¿Qué palabra del original es <strong>' + d.c + '</strong>?'; },
    fields: [{ name: 'w', label: 'palabra', w: 'wide' }],
    sol: function (d) { return { w: d.w }; },
    check: function (v, d) {
      var t = CR.limpia(v.raw.w);
      if (!t) return { ok: false, msg: 'Escribe la palabra.' };
      return t === d.w ? { ok: true } : { ok: false, msg: 'No es esa. Sustituye cada letra del cifrado por su pareja, en orden.' };
    },
    hint: function () { return 'Cada letra del cifrado se cambia por la que dice su pareja. El orden de las letras no cambia.'; },
    steps: function (d) { return [d.c.split('').map(function (ch, i) { return ch + '→' + d.w.charAt(i); }).join(', ') + '.', 'La palabra es <strong>' + d.w + '</strong>.', 'Así avanza el puzle: cada palabra reconocida confirma parejas y sugiere otras.']; },
    answer: function (d) { return d.w; }
  });

  p.keys([
    'La sustitución monoalfabética tiene $26! \\approx 4\\cdot 10^{26}$ claves y aun así se rompe: el espacio de claves es necesario, no suficiente.',
    'La sustitución cambia qué letra se escribe, no cuántas veces: las frecuencias del idioma se conservan.',
    'En castellano mandan E, A, O, S, N, R; K y W casi no existen.',
    '$\\chi^2 = \\sum (O - E)^2 / E$ mide cuánto se parece un texto a castellano sin entenderlo; las letras raras pesan mucho.',
    'Con frecuencias se empieza y leyendo se termina: cada palabra reconocida da letras nuevas.'
  ]);
});
