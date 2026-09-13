/* Tema: Tono, escala y logaritmo */
Course.topic('son-tono', function (p) {

  p.puente('En [[son-onda]] la frecuencia era lo agudo, y el sonido de 880 Hz sonaba «una octava» por ' +
    'encima del de 440. Este tema explica esa palabra, y de paso por qué las notas están donde están. ' +
    'La herramienta es el [[fn-exp-log|logaritmo]]: el oído no mide diferencias de hercios sino ' +
    '<strong>cocientes</strong>, y una escala que se oye igual de espaciada es una escala exponencial. ' +
    'Las [[al-radicales-log|raíces y las ecuaciones exponenciales]] hacen el resto.');

  p.section('El oído multiplica');

  p.text('Toca un La de 220 Hz y luego uno de 440: el salto se oye como «la misma nota, más aguda». ' +
    'Toca 440 y luego 880: se oye <em>exactamente el mismo salto</em>. Y sin embargo el primero son 220 Hz ' +
    'de diferencia y el segundo 440. Lo que el oído reconoce como igual no es la diferencia, sino el ' +
    '<strong>cociente</strong>: en los dos casos, $\\times 2$.');

  p.note('Multiplicar la frecuencia por 2 sube una <strong>octava</strong>, siempre, esté donde esté. ' +
    'Dividirla por 2 la baja. La altura de un sonido se percibe en escala <em>logarítmica</em>: lo que ' +
    'suena «a la misma distancia» es lo que tiene el mismo cociente de frecuencias. Toda la música ' +
    'occidental está construida encima de esta propiedad del oído.', 'ok', 'La idea del tema');

  p.section('Doce pasos iguales hasta la octava');

  p.text('Entre una nota y su octava, la música occidental pone doce escalones, los ' +
    '<strong>semitonos</strong>: son las doce teclas, blancas y negras, que hay entre un Do y el Do ' +
    'siguiente en un piano. Si los doce tienen que sonar igual de grandes, cada uno tiene que ' +
    'multiplicar la frecuencia por el mismo número $r$, y doce de ellos tienen que dar la octava:');

  p.formula('r^{12} = 2 \\ \\Longrightarrow\\ r = \\sqrt[12]{2} = 2^{1/12} \\approx 1{,}05946', 'el semitono',
    'Se lee: <em>«erre a la doce es igual a dos, luego erre es la raíz duodécima de dos»</em>.<br><br>' +
      'Un semitono sube la frecuencia un $5{,}9\\,\\%$. No es «sumar tantos hercios»: entre 100 y 105,9 hay ' +
      'un semitono, y entre 1000 y 1059,5 también. Es la misma [[fn-exp-log|exponencial]] del interés ' +
      'compuesto: cada paso multiplica por el mismo factor.');

  p.formula('f(n) = 440 \\cdot 2^{\\frac{n - 69}{12}}, \\qquad n = 69 + 12\\log_2\\frac{f}{440}', 'de la nota al hercio, y vuelta',
    'A cada tecla se le da un número entero $n$; es el convenio MIDI, el que usan todos los ' +
      'instrumentos electrónicos. El 69 es el La de 440 Hz, y cada unidad es un semitono. La primera ' +
      'fórmula da los hercios de la nota $n$; la segunda, despejada con el logaritmo en base 2, da la ' +
      'nota de una frecuencia. En el código es <code>nota(n)</code>.');

  p.table(['Nota', 'MIDI $n$', 'Hz', 'Nota', 'MIDI $n$', 'Hz'], [
    ['Do (C4)', '60', '261,63', 'Sol (G4)', '67', '392,00'],
    ['Re (D4)', '62', '293,66', 'La (A4)', '69', '440,00'],
    ['Mi (E4)', '64', '329,63', 'Si (B4)', '71', '493,88'],
    ['Fa (F4)', '65', '349,23', 'Do (C5)', '72', '523,25']
  ], { num: [1, 2, 4, 5] });

  p.demo({
    title: 'La escala, tecla a tecla',
    intro: 'La nota MIDI n, convertida en hercios con la fórmula. Sube n de uno en uno y oirás semitonos; de doce en doce, octavas. Fíjate en el espectro: la raya se desplaza cada vez más deprisa hacia la derecha, porque cada paso multiplica en vez de sumar.',
    predice: 'De $n = 60$ a $n = 72$ hay doce semitonos. ¿La frecuencia se duplicará, o subirá 12 hercios? Mira la tabla de arriba antes de mover el mando.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-tono-1', dur: 1, ventana: 10,
        mandos: [{ n: 'n', label: 'nota MIDI n', min: 36, max: 96, step: 1, value: 60, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    var f = nota(n);          // 440 * 2^((n - 69) / 12)\n' +
          '    return 0.4 * sin(TAU * f * t);\n' +
          '}\n',
        nota: 'Prueba a escribir <code>var f = 440 * pow(2, (n - 69) / 12);</code> en lugar de <code>nota(n)</code>: ' +
          'es lo mismo, y verás la fórmula funcionando. En el panel de arriba está el «dominante» en hercios: ' +
          'compáralo con la tabla.'
      });
    }
  });

  p.comprueba('Un sonido de 880 Hz y otro de 220 Hz. ¿A cuántas octavas están?', [
    { t: 'A dos octavas: $220 \\cdot 2 \\cdot 2 = 880$', ok: true, por: 'Cada octava multiplica por 2, y hacen falta dos para pasar de 220 a 880: $\\log_2\\frac{880}{220} = \\log_2 4 = 2$.' },
    { t: 'A cuatro octavas: $880 / 220 = 4$', ok: false, por: 'El cociente es 4, sí, pero una octava es $\\times 2$, y $4 = 2^2$: son dos octavas, no cuatro.' },
    { t: 'A 660 octavas: la diferencia de hercios', ok: false, por: 'La altura no se mide en hercios de diferencia sino en cocientes. 660 Hz de diferencia entre 220 y 880 son dos octavas; entre 10 000 y 10 660 no llegan ni a un semitono.' }
  ]);

  p.ejemplo({
    title: 'Dos cálculos con la escala',
    enunciado: 'Hallar la frecuencia del Do 5 (nota MIDI 72) y cuántos semitonos hay entre 330 Hz y 440 Hz.',
    pasos: [
      { t: '<strong>El Do 5.</strong> $f(72) = 440 \\cdot 2^{(72 - 69)/12} = 440 \\cdot 2^{3/12} = 440 \\cdot 2^{1/4}$.', antes: 'Sustituye $n = 72$ en la fórmula. ¿Cuánto vale el exponente?' },
      { t: '<strong>La raíz cuarta de 2.</strong> $2^{1/4} = \\sqrt[4]{2} \\approx 1{,}1892$, así que $f \\approx 440 \\cdot 1{,}1892 = 523{,}25$ Hz. Coincide con la tabla.' },
      { t: '<strong>Los semitonos.</strong> Se despeja con el logaritmo: $12\\log_2\\frac{440}{330} = 12\\log_2\\frac{4}{3}$.', antes: '¿Qué fórmula da el número de semitonos a partir del cociente?' },
      { t: '<strong>Calcular el logaritmo.</strong> $\\log_2\\frac{4}{3} = \\dfrac{\\ln(4/3)}{\\ln 2} = \\dfrac{0{,}2877}{0{,}6931} \\approx 0{,}415$. Y $12 \\cdot 0{,}415 \\approx 4{,}98$: cinco semitonos.', antes: 'La calculadora no tiene $\\log_2$: usa el cambio de base.' },
      { t: '<strong>Comprobar.</strong> Cinco semitonos son $2^{5/12} \\approx 1{,}3348$, y $330 \\cdot 1{,}3348 = 440{,}5$: casi exacto. El intervalo de Mi a La se llama <em>cuarta</em>, y su cociente es casi $4/3$.' }
    ],
    cierre: 'De la nota a los hercios: exponencial. De los hercios a la nota: logaritmo. Las dos operaciones del tema de exponenciales, con un piano delante.'
  });

  p.section('Por qué doce, y por qué «casi»');

  p.text('Los griegos ya sabían que dos cuerdas suenan bien juntas cuando sus longitudes están en ' +
    '<strong>razón simple</strong>: 2:1 es la octava, 3:2 la quinta, 4:3 la cuarta. Son los intervalos ' +
    '<em>justos</em>. El problema es que con cocientes como $3/2$ nunca se vuelve al punto de partida: ' +
    'doce quintas seguidas dan $(3/2)^{12} = 129{,}75$, y siete octavas dan $2^7 = 128$. Casi lo mismo, ' +
    'pero no lo mismo, y ese «casi» —la <em>coma pitagórica</em>— hizo que durante siglos un instrumento ' +
    'afinado para una tonalidad sonara mal en otra.');

  p.text('La solución fue repartir el error: el <strong>temperamento igual</strong>, doce semitonos ' +
    'idénticos de $2^{1/12}$. Ningún intervalo queda perfecto, pero todos quedan casi, y se puede tocar ' +
    'en cualquier tonalidad. Lo que se pierde se mide en <strong>cents</strong>, centésimas de semitono:');

  p.formula('\\text{cents} = 1200\\,\\log_2 r', 'un intervalo, medido en centésimas de semitono',
    'Un semitono son 100 cents y una octava 1200. La quinta justa, $r = 3/2$, mide $1200\\log_2 1{,}5 ' +
      '= 701{,}96$ cents; la temperada, $2^{7/12}$, mide exactamente 700. Dos cents de diferencia: el oído ' +
      'empieza a distinguir a partir de cinco o diez, así que la quinta temperada pasa. La tercera mayor ' +
      'es otra historia: la justa, $5/4$, mide 386,3 cents y la temperada 400. Catorce cents que un oído ' +
      'entrenado nota.');

  p.table(['Intervalo', 'Semitonos', 'Razón justa', 'Justa (cents)', 'Temperada (cents)'], [
    ['Octava', '12', '2/1', '1200', '1200'],
    ['Quinta', '7', '3/2', '702,0', '700'],
    ['Cuarta', '5', '4/3', '498,0', '500'],
    ['Tercera mayor', '4', '5/4', '386,3', '400'],
    ['Tercera menor', '3', '6/5', '315,6', '300']
  ], { num: [1, 3, 4] });

  p.demo({
    title: 'La quinta justa y la temperada',
    intro: 'Un La de 440 y, encima, su quinta: justa (razón exacta 3/2, 660 Hz) o temperada (2 elevado a 7/12, 659,26 Hz). Alterna y escucha. Con el mando puedes desafinar la segunda nota en cents para oír a partir de cuándo se nota.',
    predice: 'La diferencia entre 660 y 659,26 Hz es de menos de un hercio. ¿Crees que se oirá? Pista: dos senos que se llevan menos de un hercio hacen algo que se llama batido, y se cuenta en el tema de los acordes.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-tono-2', dur: 2, ventana: 20, fmax: 1500,
        mandos: [{ n: 'c', label: 'desafinar la quinta (cents)', min: -50, max: 50, step: 1, value: 0, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    var f1 = 440;\n' +
          '    var f2 = 440 * 3 / 2 * pow(2, c / 1200);   // quinta justa, movida c cents\n' +
          '    return 0.3 * sin(TAU * f1 * t) + 0.3 * sin(TAU * f2 * t);\n' +
          '}\n',
        nota: 'Con $c = -2$ tienes la quinta temperada, la del piano. Con $c = 20$ ya se oye «sucio»: las dos ' +
          'ondas laten. Cambia el <code>3 / 2</code> por <code>5 / 4</code> y tendrás la tercera mayor justa; ' +
          'la temperada está a $+14$ cents.'
      });
    }
  });

  p.hist('La escuela de Pitágoras, en el siglo VI a. C., descubrió que las consonancias eran razones ' +
    'de números pequeños y construyó con ellas la primera teoría musical. El temperamento igual lo ' +
    'calculó Zhu Zaiyu en China en 1584 con ábacos de 81 columnas —dio $2^{1/12}$ con veinticinco cifras—, ' +
    'y en Europa lo defendió Simon Stevin poco después. Se impuso despacio: <em>El clave bien temperado</em> ' +
    'de Bach (1722), con una pieza en cada una de las 24 tonalidades, es su manifiesto, aunque el ' +
    'temperamento de Bach no era todavía exactamente el igual. El piano lo hizo universal en el siglo XIX.');

  p.util('Todo lo que afina o transporta hace estas cuentas. El afinador del móvil mide la frecuencia, ' +
    'calcula $12\\log_2(f/440)$ y te dice a cuántos cents estás de la nota más cercana. Un pedal de ' +
    'guitarra que sube la canción un tono multiplica todas las frecuencias por $2^{2/12}$. Y la ' +
    'corrección automática de voz de los estudios —el <em>autotune</em>— hace lo que hace este tema: ' +
    'medir la nota que se cantó, buscar la tecla más cercana y multiplicar por el cociente que falta.');

  p.trampas([
    { e: 'Sumar hercios para subir una nota', por: 'Un semitono es multiplicar por $2^{1/12}$. Sumar 26 Hz sube un semitono desde 440, pero desde 880 sube solo medio: la escala es exponencial.' },
    { e: '«Un semitono son 440/12 hercios»', por: 'Ese es el error de repartir linealmente. La octava se reparte en doce <em>factores</em> iguales, no en doce sumandos: $2^{1/12}$, no $440/12$.' },
    { e: 'Leer la nota MIDI como hercios', por: 'La nota 60 no suena a 60 Hz sino a 261,63. El número es una tecla, y los hercios salen de la fórmula exponencial.' },
    { e: 'Calcular $\\log_2$ con $\\log_{10}$ sin cambio de base', por: '$\\log_{10} 2 = 0{,}301$, no 1. Para pasar de hercios a semitonos hace falta $\\log_2 r = \\ln r / \\ln 2$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Octavas arriba y abajo',
    level: 'basico',
    gen: function (r) {
      var f = r.pick([55, 110, 220, 261.63, 330, 440, 523.25, 880]), k = r.pick([-2, -1, 1, 2, 3]);
      return { f: f, k: k, v: f * Math.pow(2, k) };
    },
    ask: function (d) { return 'Un tono de $' + U.fmt(d.f, 2) + '$ Hz. ¿Qué frecuencia tiene el que está $' + Math.abs(d.k) + '$ octava' + (Math.abs(d.k) === 1 ? '' : 's') + ' por ' + (d.k > 0 ? 'encima' : 'debajo') + '? (dos decimales)'; },
    fields: [{ name: 'v', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { return Math.abs(v.v - (d.f + d.k * d.f)) < 0.01 && Math.abs(d.k) > 1; }, msg: 'Cada octava <em>multiplica</em> por 2: dos octavas son $\\times 4$, no $\\times 3$.' }],
    hint: function () { return 'Cada octava arriba multiplica por 2; cada una abajo divide por 2.'; },
    steps: function (d) { return ['$' + U.fmt(d.f, 2) + ' \\cdot 2^{' + d.k + '} = ' + U.fmt(d.v, 2) + '$ Hz.']; },
    answer: function (d) { return U.fmt(d.v, 2) + ' Hz'; }
  });

  p.exercise({
    title: 'De la nota MIDI a los hercios',
    level: 'basico',
    gen: function (r) {
      var n = r.int(45, 90);
      return { n: n, f: 440 * Math.pow(2, (n - 69) / 12) };
    },
    ask: function (d) { return '¿Qué frecuencia tiene la nota MIDI $n = ' + d.n + '$? (dos decimales)'; },
    fields: [{ name: 'f', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { f: U.round(d.f, 6) }; },
    dec: 2,
    tol: 5e-5,
    errores: [{ si: function (v, d) { return Math.abs(v.f - d.n) < 0.5; }, msg: 'El número MIDI es una tecla, no una frecuencia: hay que pasarlo por la fórmula exponencial.' }],
    hint: function () { return '$f = 440 \\cdot 2^{(n - 69)/12}$.'; },
    steps: function (d) { return ['$f = 440 \\cdot 2^{(' + d.n + ' - 69)/12} = 440 \\cdot 2^{' + (d.n - 69) + '/12} \\approx ' + U.fmt(d.f, 2) + '$ Hz.', 'Está $' + Math.abs(d.n - 69) + '$ semitonos ' + (d.n >= 69 ? 'por encima' : 'por debajo') + ' del La de 440.']; },
    answer: function (d) { return U.fmt(d.f, 2) + ' Hz'; }
  });

  p.exercise({
    title: 'De los hercios a la nota',
    level: 'medio',
    gen: function (r) {
      var n = r.int(40, 95), f = 440 * Math.pow(2, (n - 69) / 12);
      var fr = Math.round(f * 10) / 10;
      return { n: n, f: fr };
    },
    ask: function (d) { return 'Un afinador mide $' + U.fmt(d.f, 1) + '$ Hz. ¿A qué nota MIDI corresponde (redondeando al entero más cercano)?'; },
    fields: [{ name: 'n', label: 'nota MIDI', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    dec: 0,
    hint: function () { return ['$n = 69 + 12\\log_2(f/440)$.', 'Para $\\log_2$ usa el cambio de base: $\\ln(f/440)/\\ln 2$.']; },
    steps: function (d) { return ['$\\log_2\\dfrac{' + U.fmt(d.f, 1) + '}{440} = ' + U.fmt(Math.log(d.f / 440) / Math.LN2, 4) + '$', '$n = 69 + 12 \\cdot ' + U.fmt(Math.log(d.f / 440) / Math.LN2, 4) + ' = ' + U.fmt(69 + 12 * Math.log(d.f / 440) / Math.LN2, 2) + ' \\approx ' + d.n + '$.']; },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'Semitonos entre dos frecuencias',
    level: 'medio',
    gen: function (r) {
      var n1 = r.int(48, 80), k = r.pick([1, 2, 3, 4, 5, 7, 9, 12, 19, 24]);
      var f1 = 440 * Math.pow(2, (n1 - 69) / 12), f2 = f1 * Math.pow(2, k / 12);
      return { f1: Math.round(f1 * 100) / 100, f2: Math.round(f2 * 100) / 100, k: k };
    },
    ask: function (d) { return '¿Cuántos semitonos hay entre $' + U.fmt(d.f1, 2) + '$ Hz y $' + U.fmt(d.f2, 2) + '$ Hz? (redondea al entero)'; },
    fields: [{ name: 'k', label: 'semitonos', w: 'tiny' }],
    sol: function (d) { return { k: d.k }; },
    dec: 0,
    errores: [{ si: function (v, d) { return Math.abs(v.k - Math.round(d.f2 - d.f1)) < 0.5 && Math.abs(d.f2 - d.f1 - d.k) > 1; }, msg: 'Los hercios de diferencia no son semitonos: el semitono es un cociente, $2^{1/12}$. Usa el logaritmo del cociente.' }],
    hint: function () { return 'Semitonos $= 12\\log_2(f_2/f_1)$.'; },
    steps: function (d) { return ['$\\dfrac{f_2}{f_1} = ' + U.fmt(d.f2 / d.f1, 4) + '$', '$12\\log_2 ' + U.fmt(d.f2 / d.f1, 4) + ' = ' + U.fmt(12 * Math.log(d.f2 / d.f1) / Math.LN2, 2) + ' \\approx ' + d.k + '$ semitonos' + (d.k === 12 ? ' (una octava)' : (d.k === 7 ? ' (una quinta)' : (d.k === 5 ? ' (una cuarta)' : ''))) + '.']; },
    answer: function (d) { return d.k + ' semitonos'; }
  });

  p.exercise({
    title: 'Justa contra temperada',
    level: 'avanzado',
    gen: function (r) {
      var casos = [{ nombre: 'quinta', p: 3, q: 2, k: 7 }, { nombre: 'cuarta', p: 4, q: 3, k: 5 }, { nombre: 'tercera mayor', p: 5, q: 4, k: 4 }, { nombre: 'tercera menor', p: 6, q: 5, k: 3 }, { nombre: 'sexta mayor', p: 5, q: 3, k: 9 }, { nombre: 'tono', p: 9, q: 8, k: 2 }];
      var c = r.pick(casos);
      var justa = 1200 * Math.log(c.p / c.q) / Math.LN2, temp = 100 * c.k;
      return { c: c, justa: justa, temp: temp, dif: justa - temp };
    },
    ask: function (d) { return 'La ' + d.c.nombre + ' justa tiene razón $' + d.c.p + '/' + d.c.q + '$ y la temperada son $' + d.c.k + '$ semitonos. ¿Cuántos cents mide la justa, y cuántos cents se desvía la temperada de ella? (un decimal; la desviación con signo, temperada menos justa)'; },
    fields: [{ name: 'j', label: 'justa (cents)', w: 'wide' }, { name: 'd', label: 'desviación', w: 'wide' }],
    sol: function (d) { return { j: U.round(d.justa, 4), d: U.round(-d.dif, 4) }; },
    dec: 1,
    hint: function () { return ['Cents $= 1200\\log_2 r$.', 'La temperada mide exactamente 100 cents por semitono.']; },
    steps: function (d) { return ['Justa: $1200\\log_2\\dfrac{' + d.c.p + '}{' + d.c.q + '} = ' + U.fmt(d.justa, 1) + '$ cents.', 'Temperada: $' + d.c.k + ' \\cdot 100 = ' + d.temp + '$ cents.', 'Desviación: $' + d.temp + ' - ' + U.fmt(d.justa, 1) + ' = ' + U.fmt(-d.dif, 1) + '$ cents' + (Math.abs(d.dif) < 5 ? ': no se nota.' : ': un oído entrenado lo oye.')]; },
    answer: function (d) { return U.fmt(d.justa, 1) + ' cents; desviación ' + U.fmt(-d.dif, 1); }
  });

  p.exercise({
    title: 'Escribe la nota',
    level: 'avanzado',
    gen: function (r) {
      var n = r.pick([57, 60, 62, 64, 65, 67, 69, 72, 74, 76]);
      var f = 440 * Math.pow(2, (n - 69) / 12);
      return { n: n, f: f, ref: '0.4 * sin(TAU * nota(' + n + ') * t)' };
    },
    ask: function (d) {
      return 'Completa la función para que suene la nota MIDI <strong>' + d.n + '</strong> con amplitud 0,4, usando la fórmula de la nota o la función <code>nota</code>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: '0.4 * sin(TAU * nota(n) * t)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 0.6 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (r.espectro < 0.9) return { ok: false, msg: 'Suena, pero no a la nota ' + d.n + ' (' + U.fmt(d.f, 2) + ' Hz). ¿Has puesto el número MIDI directamente como hercios?' };
        return { ok: false, msg: 'La nota está bien; el volumen no. La amplitud pedida es 0,4.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['<code>nota(' + d.n + ')</code> da los hercios; o escríbelos a mano: $' + U.fmt(d.f, 2) + '$.', 'Y luego el seno de siempre: <code>0.4 * sin(TAU * f * t)</code>.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'O con la fórmula escrita: <code>0.4 * sin(TAU * 440 * pow(2, (' + d.n + ' - 69) / 12) * t)</code>, o directamente <code>0.4 * sin(TAU * ' + U.fmt(d.f, 2).replace(',', '.') + ' * t)</code>. Las tres suenan igual.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'El oído mide <strong>cocientes</strong>: doblar la frecuencia sube una octava, esté donde esté.',
    'El semitono es $2^{1/12} \\approx 1{,}059$: doce factores iguales hasta la octava, no doce sumandos.',
    'Nota MIDI a hercios: $f = 440 \\cdot 2^{(n-69)/12}$; hercios a nota: $n = 69 + 12\\log_2(f/440)$. En el código, <code>nota(n)</code>.',
    'Los intervalos justos son razones simples (3/2, 4/3, 5/4); el temperamento igual los desafina unos cents para poder tocar en cualquier tonalidad.',
    'Cents $= 1200\\log_2 r$: la quinta temperada está a 2 cents de la justa; la tercera mayor, a 14.'
  ]);
});
