/* Tema: Ritmo y secuencias: la música como función del tiempo */
Course.topic('son-secuencia', function (p) {

  p.puente('Hasta aquí cada sintetizador tocaba <em>una</em> nota. La música son muchas, una detrás de ' +
    'otra, a tiempo. Y como el sonido es una función del tiempo, la melodía también lo es: basta ' +
    'con saber en qué pulso estamos —una división entera y un resto, la [[ar-divisibilidad|aritmética]] ' +
    'de primero— y qué [[son-tono|nota]] y qué [[son-envolvente|envolvente]] le tocan a ese pulso. ' +
    'Un secuenciador cabe en tres líneas.');

  p.section('El tiempo, troceado');

  p.text('Un tempo de 120 pulsos por minuto son 2 pulsos por segundo: cada pulso dura medio segundo. ' +
    'Para saber en qué pulso está el instante $t$ se divide y se toma la parte entera; para saber ' +
    'cuánto llevamos dentro del pulso, el resto. Es la división con resto de toda la vida, con ' +
    'decimales:');

  p.formulas([
    'T_p = \\frac{60}{\\text{BPM}}, \\qquad n = \\left\\lfloor \\frac{t}{T_p} \\right\\rfloor, \\qquad u = t - n\\,T_p',
    'u \\in [0, T_p)\\quad\\text{es el tiempo dentro del pulso: la nota } n \\text{ empezó hace } u \\text{ segundos}'
  ], 'pulso y tiempo dentro del pulso',
    'Se lee: <em>«te sub pe es sesenta partido por los pulsos por minuto; ene es la parte entera de te ' +
      'partido por te sub pe; u es te menos ene por te sub pe»</em>.<br><br>$n$ es el número de pulso ' +
      '(0, 1, 2, …) y $u$ el reloj local, que vuelve a cero al empezar cada uno. Con $u$ se calcula la ' +
      'envolvente de la nota <em>como si hubiera empezado en cero</em>, y con $n$ se elige qué nota ' +
      'suena. En el sintetizador: <code>var n = floor(t / Tp); var u = t - n * Tp;</code>, o bien ' +
      '<code>u = mod(t, Tp)</code>.');

  p.demo({
    title: 'Un metrónomo de fórmula',
    intro: 'Un clic por pulso: un seno corto cuya envolvente se reinicia con $u$. Cada cuatro pulsos, el primero suena más agudo, y para saber cuál es el primero se usa el resto de $n$ entre 4. Mueve el tempo y cuenta.',
    predice: 'A 90 BPM, ¿cuánto dura un pulso? ¿Y cuántos clics caben en los dos segundos del sintetizador?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-secuencia-1', dur: 2, loop: true, ventana: 2000, fmax: 3000,
        mandos: [{ n: 'bpm', label: 'tempo (pulsos por minuto)', min: 40, max: 240, step: 1, value: 120, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    var Tp = 60 / bpm;                 // segundos por pulso\n' +
          '    var n = floor(t / Tp);             // número de pulso\n' +
          '    var u = t - n * Tp;                // tiempo dentro del pulso\n' +
          '    var f = (n % 4 == 0) ? 1320 : 880; // el primero de cada cuatro, más agudo\n' +
          '    return 0.6 * decae(u, 0.03) * sin(TAU * f * u);\n' +
          '}\n',
        nota: 'La onda de la izquierda enseña los dos segundos: cada clic es un golpe que se apaga en ' +
          'tres centésimas. A 120 BPM hay exactamente cuatro, uno por medio segundo, y el compás ' +
          'entero cabe en el bucle.'
      });
    }
  });

  p.section('Una melodía es una lista');

  p.text('Para tocar una melodía hace falta decir qué nota va en cada pulso. La forma más sencilla es ' +
    'una lista de números MIDI, y elegir el elemento $n$ (con el resto para que la lista se ' +
    'repita cuando se acaba). Cero significa silencio. La función <code>nota</code> convierte el ' +
    'número en hercios, y el resto es el sintetizador de siempre, con $u$ en lugar de $t$.');

  p.formula('\\text{nota}(n) = \\text{lista}\\bigl[\\,n \\bmod L\\,\\bigr], \\qquad f = 440\\cdot 2^{(\\text{nota} - 69)/12}', 'la melodía como función del pulso',
    'Se lee: <em>«la nota del pulso ene es el elemento ene módulo ele de la lista»</em>, con $L$ la ' +
      'longitud de la lista. El módulo hace que la melodía sea periódica: al llegar al final vuelve a ' +
      'empezar, como un bucle de una caja de ritmos. Y como una lista de $L$ pulsos a $T_p$ segundos ' +
      'dura $L\\,T_p$ segundos, un bucle de 8 corcheas a 120 BPM ($T_p = 0{,}25$) dura 2 segundos ' +
      'exactos: lo que mide el sintetizador.');

  p.demo({
    title: 'Ocho notas en bucle',
    intro: 'Una lista de ocho números MIDI a 120 BPM en corcheas: dos segundos, y vuelta a empezar. Edita la lista y suena otra melodía; cambia el tempo, y las mismas notas van más deprisa. El instrumento es una sierra filtrada con envolvente, como en los temas anteriores.',
    predice: 'La lista empieza 60, 64, 67, 72: Do, Mi, Sol, Do agudo. Si cambias el 72 por un 71, ¿la cuarta nota subirá o bajará, y cuánto?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-secuencia-2', dur: 2, loop: true, ventana: 2000, fmax: 3000,
        mandos: [
          { n: 'bpm', label: 'tempo', min: 60, max: 200, step: 1, value: 120, dec: 0 },
          { n: 'brillo', label: 'brillo (filtro)', min: 0.02, max: 1, step: 0.01, value: 0.15, dec: 2 }
        ],
        codigo:
          'var melodia = [60, 64, 67, 72, 71, 67, 64, 0];   // números MIDI; 0 es silencio\n' +
          '\n' +
          'function sonido(t) {\n' +
          '    var Tp = 60 / bpm / 2;                       // corcheas: medio pulso\n' +
          '    var n = floor(t / Tp);\n' +
          '    var u = t - n * Tp;\n' +
          '    var m = melodia[n % melodia.length];\n' +
          '    if (m == 0) return (1 - brillo) * anterior(); // silencio: solo la cola del filtro\n' +
          '    var x = 0.5 * adsr(u, 0.01, 0.1, 0.6, 0.05, Tp - 0.05) * sierra(nota(m), u);\n' +
          '    return brillo * x + (1 - brillo) * anterior();\n' +
          '}\n',
        nota: 'La lista está fuera de <code>sonido</code>, como una función auxiliar: se crea una vez y ' +
          'se lee 88 200 veces. Prueba <code>[60, 62, 64, 65, 67, 69, 71, 72]</code>: la escala mayor ' +
          'subiendo. O <code>[57, 60, 64, 67, 64, 60, 57, 0]</code>: un arpegio de La menor.'
      });
    }
  });

  p.section('Varias voces a la vez: sumar');

  p.text('Dos instrumentos tocando a la vez es la suma de las dos funciones. Un bajo en negras y una ' +
    'melodía en corcheas tienen relojes distintos —$T_p$ y $T_p/2$—, y cada uno calcula su $n$ y su ' +
    '$u$. La suma se escala para que no recorte. Es el principio de superposición de las ondas: en ' +
    'el aire, los sonidos se suman y ya está; aquí, también.');

  p.demo({
    title: 'Bajo, melodía y caja',
    intro: 'Tres voces sumadas: un bajo (un seno grave) en negras, la melodía de antes en corcheas y una caja de ruido en los pulsos 2 y 4 del compás. Cada voz tiene su reloj. Los mandos son los volúmenes: mezcla, y quita una voz poniéndola a cero para oír las otras.',
    predice: 'La caja suena en los pulsos 2 y 4 de cada compás de 4: en dos segundos a 120 BPM, ¿cuántos golpes de caja habrá?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-secuencia-3', dur: 2, loop: true, ventana: 2000, fmax: 4000,
        mandos: [
          { n: 'vBajo', label: 'bajo', min: 0, max: 1, step: 0.05, value: 0.7, dec: 2 },
          { n: 'vMel', label: 'melodía', min: 0, max: 1, step: 0.05, value: 0.5, dec: 2 },
          { n: 'vCaja', label: 'caja', min: 0, max: 1, step: 0.05, value: 0.5, dec: 2 }
        ],
        codigo:
          'var bpm = 120;\n' +
          'var bajo = [36, 36, 43, 43];                   // negras: Do, Do, Sol, Sol\n' +
          'var melodia = [60, 64, 67, 72, 71, 67, 64, 0];   // corcheas\n' +
          '\n' +
          'function voz(m, u, dur) {                       // un pitido con envolvente\n' +
          '    return adsr(u, 0.01, 0.1, 0.5, 0.05, dur - 0.05) * triangulo(nota(m), u);\n' +
          '}\n' +
          'function sonido(t, i) {\n' +
          '    var Tp = 60 / bpm;\n' +
          '    var n = floor(t / Tp), u = t - n * Tp;             // negras\n' +
          '    var Tc = Tp / 2;                                   // corcheas\n' +
          '    var n2 = floor(t / Tc), u2 = t - n2 * Tc;\n' +
          '    var y = 0;\n' +
          '    // el bajo: un seno grave con su envolvente\n' +
          '    y += vBajo * 0.6 * decae(u, 0.3) * sin(TAU * nota(bajo[n % 4]) * u);\n' +
          '    // la melodía\n' +
          '    var m = melodia[n2 % 8];\n' +
          '    if (m > 0) y += vMel * 0.35 * voz(m, u2, Tp / 2);\n' +
          '    // la caja, en los pulsos 1 y 3 (contando desde 0)\n' +
          '    if (n % 2 == 1) y += vCaja * 0.5 * decae(u, 0.06) * ruido();\n' +
          '    return y;\n' +
          '}\n',
        nota: 'Fíjate en que cada voz calcula su propio pulso: negras con $T_p$ y corcheas con $T_p/2$. ' +
          'Las tres se suman y el resultado sigue siendo una función del tiempo. Añadir una voz es ' +
          'añadir una línea.'
      });
    }
  });

  p.ejemplo({
    title: 'Cuadrar un bucle',
    enunciado: 'Se quiere un bucle de 16 semicorcheas que dure exactamente los 2 segundos del sintetizador. Hallar el tempo, la duración de cada nota y, para $t = 1{,}37$ s, en qué nota estamos y cuánto llevamos dentro de ella.',
    pasos: [
      { t: '<strong>La duración de cada nota.</strong> $2 / 16 = 0{,}125$ s: una semicorchea de 125 ms.' },
      { t: '<strong>El tempo.</strong> Cuatro semicorcheas son un pulso: $T_p = 0{,}5$ s, y $\\text{BPM} = 60 / 0{,}5 = 120$. (Cuatro pulsos por bucle: un compás de 4/4.)', antes: 'Si un pulso son cuatro semicorcheas, ¿cuánto dura?' },
      { t: '<strong>La nota en $t = 1{,}37$.</strong> $n = \\lfloor 1{,}37 / 0{,}125 \\rfloor = \\lfloor 10{,}96 \\rfloor = 10$: la undécima nota (empezando a contar en cero).', antes: 'Divide $1{,}37$ entre $0{,}125$ y quédate con la parte entera.' },
      { t: '<strong>El tiempo dentro de ella.</strong> $u = 1{,}37 - 10\\cdot 0{,}125 = 0{,}12$ s: casi al final; la envolvente ya estará en la liberación.' },
      { t: '<strong>Y si el bucle diera la vuelta.</strong> En $t = 2{,}3$ s, $n = 18$, y $18 \\bmod 16 = 2$: la tercera nota otra vez. El módulo es lo que convierte una lista finita en música que no se acaba.', antes: '¿Qué elemento de una lista de 16 toca en el pulso 18?' }
    ],
    cierre: 'Parte entera y resto: la división de primaria es el reloj de toda la música electrónica.'
  });

  p.comprueba('En el código de la melodía, ¿qué pasa si en lugar de <code>u</code> se pone <code>t</code> en la envolvente, <code>adsr(t, …)</code>?', [
    { t: 'La envolvente no se reinicia: la primera nota ataca y las demás salen ya apagadas', ok: true, por: '$t$ no vuelve a cero en cada pulso; $u$ sí. Con $t$, el ADSR ve una sola nota larguísima y a partir del segundo pulso está en el sustain o en silencio.' },
    { t: 'Nada: es lo mismo', ok: false, por: 'No es lo mismo: $u$ es el reloj local del pulso y $t$ el global. La envolvente necesita saber cuánto hace que empezó <em>esta</em> nota.' },
    { t: 'Las notas suenan al revés', ok: false, por: 'El orden lo decide la lista y $n$, que no cambian. Lo que se rompe es la envolvente.' }
  ]);

  p.hist('La idea de escribir la música como una lista y dejar que una máquina la recorra es más vieja ' +
    'que la electricidad: los carillones flamencos del siglo XVI llevaban un tambor con clavijas, y ' +
    'la caja de música y la pianola son lo mismo. Los primeros secuenciadores electrónicos de los ' +
    'años sesenta (el Moog 960) eran una fila de ocho o dieciséis mandos que un reloj leía en bucle, ' +
    'exactamente la lista de arriba con potenciómetros. La caja de ritmos TR-808 de 1980 y el ' +
    'protocolo MIDI de 1983 —que es el que numera las notas como aquí— convirtieron la lista en el ' +
    'lenguaje común de toda la música electrónica, y los <em>trackers</em> de los ordenadores de ' +
    'los ochenta escribían las canciones literalmente como columnas de números.');

  p.util('Todo lo que se repite a tiempo en un programa es este mismo cálculo: qué fotograma toca en ' +
    'un vídeo ($\\lfloor t \\cdot 25 \\rfloor$), en qué día de la semana cae una fecha (resto entre 7), ' +
    'qué turno trabaja hoy, cuándo enviar un latido de red. La <em>parte entera</em> dice en qué ' +
    'ciclo estás y el <em>resto</em> dónde dentro del ciclo. Y la programación en vivo de música ' +
    '—<em>live coding</em>, con lenguajes como Sonic Pi o TidalCycles— es escribir listas como ' +
    'estas delante del público y cambiarlas mientras suenan. En [[son-taller]] se juntan el ' +
    'secuenciador y todas las etapas anteriores en un solo instrumento.');

  p.trampas([
    { e: 'Usar $t$ donde va $u$', por: 'La envolvente y el oscilador de cada nota se calculan con el reloj local $u$, que se reinicia en cada pulso. Con $t$ la nota nunca vuelve a atacar.' },
    { e: 'Olvidar el módulo al leer la lista', por: 'Sin <code>% melodia.length</code>, al pasar del último pulso se lee fuera de la lista y sale <code>undefined</code>, que no es un número: silencio o error.' },
    { e: 'Sumar voces sin bajar el volumen', por: 'Tres voces a 0,6 pasan de 1 y recortan. La suma de amplitudes tiene que quedar por debajo de 1, o el sintetizador avisa de recorte.' },
    { e: 'Confundir BPM con hercios', por: '120 BPM son 2 pulsos por segundo: 2 Hz. Un pulso dura $60/\\text{BPM}$ segundos, no $\\text{BPM}/60$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánto dura un pulso',
    level: 'basico',
    gen: function (r) {
      var bpm = r.pick([60, 72, 80, 90, 100, 110, 120, 128, 140, 150, 160, 180]);
      return { bpm: bpm, Tp: 60 / bpm };
    },
    ask: function (d) { return 'A $' + d.bpm + '$ pulsos por minuto, ¿cuántos segundos dura un pulso? ¿Y una corchea (medio pulso)? (tres decimales)'; },
    fields: [{ name: 'Tp', label: 'pulso (s)', w: 'wide' }, { name: 'c', label: 'corchea (s)', w: 'wide' }],
    sol: function (d) { return { Tp: U.round(d.Tp, 6), c: U.round(d.Tp / 2, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return d.bpm !== 60 && Math.abs(v.Tp - d.bpm / 60) < 1e-3; }, msg: 'Eso son pulsos por segundo. Los segundos por pulso son $60/\\text{BPM}$.' }],
    hint: function () { return '$T_p = 60/\\text{BPM}$.'; },
    steps: function (d) { return ['$T_p = 60/' + d.bpm + ' = ' + U.fmt(d.Tp, 3) + '$ s; la corchea, la mitad: $' + U.fmt(d.Tp / 2, 3) + '$ s.']; },
    answer: function (d) { return U.fmt(d.Tp, 3) + ' s y ' + U.fmt(d.Tp / 2, 3) + ' s'; }
  });

  p.exercise({
    title: 'En qué pulso estamos',
    level: 'basico',
    gen: function (r) {
      var bpm = r.pick([60, 90, 100, 120, 150]), t = r.int(7, 95) / 10;
      var Tp = 60 / bpm, n = Math.floor(t / Tp), u = t - n * Tp;
      if (u < 0.02 || Tp - u < 0.02) return null;
      return { bpm: bpm, t: t, Tp: Tp, n: n, u: u };
    },
    ask: function (d) { return 'A $' + d.bpm + '$ BPM, en el instante $t = ' + U.fmt(d.t, 1) + '$ s, ¿en qué número de pulso estamos (contando desde 0) y cuánto tiempo llevamos dentro de él? (tres decimales)'; },
    fields: [{ name: 'n', label: 'pulso n', w: 'tiny' }, { name: 'u', label: 'u (s)', w: 'wide' }],
    sol: function (d) { return { n: d.n, u: U.round(d.u, 6) }; },
    dec: { n: 0, u: 3 },
    hint: function (d) { return ['Un pulso dura $' + U.fmt(d.Tp, 3) + '$ s.', '$n = \\lfloor t / T_p \\rfloor$, $u = t - n T_p$.']; },
    steps: function (d) { return ['$T_p = 60/' + d.bpm + ' = ' + U.fmt(d.Tp, 3) + '$ s.', '$n = \\lfloor ' + U.fmt(d.t, 1) + ' / ' + U.fmt(d.Tp, 3) + ' \\rfloor = \\lfloor ' + U.fmt(d.t / d.Tp, 2) + ' \\rfloor = ' + d.n + '$.', '$u = ' + U.fmt(d.t, 1) + ' - ' + d.n + '\\cdot ' + U.fmt(d.Tp, 3) + ' = ' + U.fmt(d.u, 3) + '$ s.']; },
    answer: function (d) { return 'pulso ' + d.n + ', u = ' + U.fmt(d.u, 3) + ' s'; }
  });

  p.exercise({
    title: 'Qué nota toca',
    level: 'medio',
    gen: function (r) {
      var L = r.pick([4, 6, 8]), lista = [];
      for (var i = 0; i < L; i++) lista.push(r.pick([57, 60, 62, 64, 65, 67, 69, 71, 72]));
      var n = r.int(L + 1, 4 * L), idx = n % L, m = lista[idx];
      return { L: L, lista: lista, n: n, idx: idx, m: m, f: 440 * Math.pow(2, (m - 69) / 12) };
    },
    ask: function (d) { return 'Lista de notas MIDI $[' + d.lista.join(',\\ ') + ']$ que se repite en bucle. En el pulso $n = ' + d.n + '$, ¿qué posición de la lista se lee (desde 0), qué número MIDI sale y a cuántos hercios suena? (dos decimales)'; },
    fields: [{ name: 'idx', label: 'posición', w: 'tiny' }, { name: 'm', label: 'MIDI', w: 'tiny' }, { name: 'f', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { idx: d.idx, m: d.m, f: U.round(d.f, 6) }; },
    dec: { idx: 0, m: 0, f: 2 },
    hint: function () { return ['Posición: $n \\bmod L$.', 'Hercios: $440\\cdot 2^{(m - 69)/12}$.']; },
    steps: function (d) { return ['$' + d.n + ' \\bmod ' + d.L + ' = ' + d.idx + '$: la lista ha dado ' + Math.floor(d.n / d.L) + ' vueltas enteras.', 'Nota MIDI $' + d.m + '$.', '$440\\cdot 2^{(' + d.m + ' - 69)/12} = ' + U.fmt(d.f, 2) + '$ Hz.']; },
    answer: function (d) { return 'posición ' + d.idx + ', MIDI ' + d.m + ', ' + U.fmt(d.f, 2) + ' Hz'; }
  });

  p.exercise({
    title: 'Cuadrar el bucle',
    level: 'medio',
    gen: function (r) {
      var L = r.pick([4, 8, 12, 16]), dur = r.pick([1, 1.5, 2, 3, 4]), fig = r.pick([1, 2, 4]);
      var Tn = dur / L, Tp = Tn * fig, bpm = 60 / Tp;
      if (bpm < 40 || bpm > 300) return null;
      return { L: L, dur: dur, fig: fig, Tn: Tn, Tp: Tp, bpm: bpm, nombre: { 1: 'negras', 2: 'corcheas', 4: 'semicorcheas' }[fig] };
    },
    ask: function (d) { return 'Un bucle de $' + d.L + '$ ' + d.nombre + ' tiene que durar exactamente $' + U.fmt(d.dur, 1) + '$ s. ¿Cuánto dura cada nota y a qué tempo (BPM, con la negra como pulso) hay que ponerlo? (tres y un decimal)'; },
    fields: [{ name: 'Tn', label: 'nota (s)', w: 'wide' }, { name: 'bpm', label: 'BPM', w: 'wide' }],
    sol: function (d) { return { Tn: U.round(d.Tn, 6), bpm: U.round(d.bpm, 4) }; },
    dec: { Tn: 3, bpm: 1 },
    hint: function (d) { return ['Cada nota dura $' + U.fmt(d.dur, 1) + '/' + d.L + '$ s.', 'Una negra son ' + d.fig + ' ' + d.nombre + (d.fig === 1 ? ' (es la misma)' : '') + ': $T_p = ' + d.fig + '\\,T_n$, y $\\text{BPM} = 60/T_p$.']; },
    steps: function (d) { return ['$T_n = ' + U.fmt(d.dur, 1) + '/' + d.L + ' = ' + U.fmt(d.Tn, 3) + '$ s.', '$T_p = ' + d.fig + '\\cdot ' + U.fmt(d.Tn, 3) + ' = ' + U.fmt(d.Tp, 3) + '$ s; $\\text{BPM} = 60/' + U.fmt(d.Tp, 3) + ' = ' + U.fmt(d.bpm, 1) + '$.']; },
    answer: function (d) { return U.fmt(d.Tn, 3) + ' s, ' + U.fmt(d.bpm, 1) + ' BPM'; }
  });

  p.exercise({
    title: 'Escribe el metrónomo',
    level: 'avanzado',
    gen: function (r) {
      var bpm = r.pick([100, 120, 150]), f = r.pick([880, 1000, 1200]);
      var Tp = 60 / bpm;
      return { bpm: bpm, f: f, Tp: Tp, ref: '0.6 * decae(t - floor(t / ' + Tp + ') * ' + Tp + ', 0.03) * sin(TAU * ' + f + ' * (t - floor(t / ' + Tp + ') * ' + Tp + '))' };
    },
    ask: function (d) {
      return 'Escribe un metrónomo a <strong>' + d.bpm + ' BPM</strong>: en cada pulso, un seno de <strong>' + d.f + ' Hz</strong> y amplitud 0,6 que se apaga con <code>decae(u, 0.03)</code>, donde $u$ es el tiempo dentro del pulso. Puedes escribir varias sentencias separadas por punto y coma; la última tiene que ser el <code>return</code>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    <strong>???</strong>\n}</pre>';
    },
    fields: [{ name: 'c', label: 'cuerpo de la función', w: 'wide', ph: 'var Tp = ...; var u = ...; return ...;' }],
    sol: function (d) { return { c: 'var u = mod(t, ' + d.Tp + '); return 0.6 * decae(u, 0.03) * sin(TAU * ' + d.f + ' * u);' }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe el cuerpo de la función.' };
      if (!/return/.test(texto)) return { ok: false, msg: 'Falta el <code>return</code>.' };
      function env(x) { return 'function sonido(t) { ' + x + ' }'; }
      var r = SON.iguales(env(texto), env('return ' + d.ref + ';'), { dur: 2, tolEnvolvente: 0.9 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (r.envolvente < 0.9) return { ok: false, msg: 'Suena, pero no a ' + d.bpm + ' BPM: el pulso dura ' + U.fmt(d.Tp, 3) + ' s, y el reloj local es <code>t - floor(t / Tp) * Tp</code> o <code>mod(t, Tp)</code>.' };
        if (r.espectro < 0.9) return { ok: false, msg: 'El ritmo está, pero el tono no es de ' + d.f + ' Hz.' };
        return { ok: false, msg: 'El nivel no es el pedido: amplitud 0,6.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['$T_p = 60/' + d.bpm + ' = ' + U.fmt(d.Tp, 3) + '$.', '<code>var u = mod(t, ' + U.fmt(d.Tp, 3) + ');</code> y luego el seno con la envolvente, los dos con <code>u</code>.']; },
    steps: function (d) { return ['<code>var Tp = 60 / ' + d.bpm + '; var u = t - floor(t / Tp) * Tp; return 0.6 * decae(u, 0.03) * sin(TAU * ' + d.f + ' * u);</code>']; },
    answer: function (d) { return 'var u = mod(t, ' + U.fmt(d.Tp, 3) + '); return 0.6 * decae(u, 0.03) * sin(TAU * ' + d.f + ' * u);'; }
  });

  p.keys([
    'Un pulso dura $60/\\text{BPM}$ s. El número de pulso es $\\lfloor t/T_p \\rfloor$ y el tiempo dentro del pulso, $u = t - n T_p$: parte entera y resto.',
    'La envolvente y el oscilador de cada nota se calculan con el reloj local $u$, que vuelve a cero en cada pulso.',
    'Una melodía es una lista de números MIDI leída con $n \\bmod L$: el módulo la hace repetirse.',
    'Varias voces son varias funciones sumadas, cada una con su reloj; la suma se escala para no recortar.',
    'Un bucle de $L$ notas a $T_n$ segundos dura $L\\,T_n$: para que cuadre con los 2 s del sintetizador, se despeja el tempo.'
  ]);
});
