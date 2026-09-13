/* Tema: Batidos, acordes y consonancia */
Course.topic('son-batidos', function (p) {

  p.puente('Al final de [[son-tono]] sonaban dos notas a la vez, la quinta justa y la temperada, y se ' +
    'avisaba de que menos de un hercio de diferencia «se oye». Este tema explica ese fenómeno con ' +
    'una de las [[tr-identidades|identidades trigonométricas]] que parecían no servir para nada: la ' +
    'que convierte una suma de senos en un producto. Y de ahí sale por qué unas notas suenan bien ' +
    'juntas y otras no.');

  p.section('Dos senos casi iguales');

  p.text('Suma dos tonos de 440 y 444 Hz. Lo que se oye no son dos notas: es <em>una</em> nota, de ' +
    'unos 442 Hz, cuyo volumen sube y baja cuatro veces por segundo, como una sirena lenta. Ese vaivén ' +
    'se llama <strong>batido</strong>, y sale de una identidad de primero:');

  p.formula('\\operatorname{sen}(2\\pi f_1 t) + \\operatorname{sen}(2\\pi f_2 t) = 2\\cos\\!\\left(2\\pi\\frac{f_1 - f_2}{2}t\\right)\\operatorname{sen}\\!\\left(2\\pi\\frac{f_1 + f_2}{2}t\\right)', 'la suma de dos senos es un producto',
    'Se lee: <em>«seno de a más seno de be es dos coseno de la semidiferencia por seno de la ' +
      'semisuma»</em>.<br><br>El seno de la derecha oscila a la frecuencia <strong>media</strong>, ' +
      '$\\frac{f_1 + f_2}{2}$: es la nota que se oye. El coseno de delante oscila mucho más despacio, a ' +
      '$\\frac{f_1 - f_2}{2}$, y hace de <strong>envolvente</strong>: multiplica a la nota y la hace ' +
      'subir y bajar de volumen. Como el volumen es el valor absoluto del coseno, que tiene dos máximos ' +
      'por vuelta, el sonido late $f_1 - f_2$ veces por segundo.');

  p.formula('f_{\\text{batido}} = |f_1 - f_2|', 'cuántas veces por segundo late',
    'Con 440 y 444: cuatro batidos por segundo, uno cada cuarto de segundo. Con 440 y 441, uno por ' +
      'segundo. Con 440 y 440,1, uno cada diez segundos: casi no se nota. Y con 440 y 470, treinta por ' +
      'segundo, que ya no se oyen como latidos sino como una aspereza.');

  p.demo({
    title: 'Oír un batido',
    intro: 'Dos senos: uno fijo a 440 Hz y otro que tú mueves. Cerca de 440 se oyen los latidos y la tira de abajo enseña la envolvente subiendo y bajando. Cuenta los latidos por segundo y compáralos con la diferencia de frecuencias.',
    predice: 'Con $f_2 = 443$, ¿cuántos latidos habrá en un segundo? Y si pones $f_2 = 440$ exactamente, ¿qué pasará con el volumen?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-batidos-1', dur: 2, ventana: 50, fmax: 1000,
        mandos: [{ n: 'f2', label: 'segunda frecuencia f2 (Hz)', min: 430, max: 470, step: 0.5, value: 443, dec: 1 }],
        codigo:
          'function sonido(t) {\n' +
          '    return 0.3 * sin(TAU * 440 * t) + 0.3 * sin(TAU * f2 * t);\n' +
          '}\n',
        nota: 'La onda de la izquierda enseña 50 ms: ahí se ve cómo la amplitud va cambiando. En el ' +
          'espectro hay dos rayas tan juntas que casi se tocan. Con $f_2 = 440$ las dos ondas van a la ' +
          'par y el volumen es constante: los batidos han desaparecido, y así se afina.'
      });
    }
  });

  p.text('De ahí sale la manera clásica de afinar: se toca la nota de referencia y la que se quiere ' +
    'afinar a la vez, y se gira la clavija hasta que los latidos se hacen cada vez más lentos y ' +
    'desaparecen. El oído no sabría decir si una cuerda está a 441 o a 440; pero un batido por ' +
    'segundo lo oye cualquiera.');

  p.ejemplo({
    title: 'Dos flautas casi afinadas',
    enunciado: 'Dos flautas tocan un La: una a 440 Hz y otra a 444 Hz, las dos con amplitud 0,5. Escribir el sonido resultante como un producto, decir qué nota se oye, cuántos batidos por segundo hay y cuántos habrá en 5 segundos.',
    pasos: [
      { t: '<strong>La identidad.</strong> $0{,}5\\operatorname{sen}(2\\pi 440 t) + 0{,}5\\operatorname{sen}(2\\pi 444 t) = 2\\cdot 0{,}5\\cos(2\\pi\\cdot 2t)\\operatorname{sen}(2\\pi\\cdot 442t)$.', antes: 'Semisuma y semidiferencia de 440 y 444: ¿cuánto valen?' },
      { t: '<strong>La nota.</strong> El seno oscila a 442 Hz: se oye un La ligeramente alto, entre las dos flautas. Ninguna de las dos frecuencias originales se oye por separado.' },
      { t: '<strong>La envolvente.</strong> $\\cos(2\\pi\\cdot 2t)$ da una vuelta por cada medio segundo, pero el volumen es su valor absoluto, que tiene dos máximos por vuelta: <strong>4 batidos por segundo</strong>, igual a $444 - 440$.', antes: '¿Cuántos máximos tiene $|\\cos|$ en cada vuelta del coseno?' },
      { t: '<strong>En cinco segundos.</strong> $4\\cdot 5 = 20$ batidos, uno cada 0,25 s.' },
      { t: '<strong>Y si afinan.</strong> Si la segunda flauta baja a 441, quedará un batido por segundo; a 440,2, uno cada cinco segundos. En una orquesta, eso es «estar afinado».' }
    ],
    cierre: 'Una identidad que en primero era un ejercicio de manipulación resulta ser exactamente lo que hace el aire cuando dos instrumentos casi coinciden.'
  });

  p.section('Consonancia: por qué unas notas encajan');

  p.text('Dos notas que no están casi iguales, sino a distancia de quinta o de tercera, no laten: cada ' +
    'una se oye por separado. Pero unas combinaciones suenan «limpias» y otras «ásperas», y Helmholtz ' +
    'dio la explicación en 1863 con la misma idea de los batidos: hay que mirar los ' +
    '<strong>armónicos</strong>. Cada nota trae su serie $f, 2f, 3f, \\ldots$, y los armónicos de una ' +
    'nota baten con los de la otra si quedan cerca sin coincidir.');

  p.table(['Intervalo', 'Razón', 'Armónicos que coinciden', 'Cómo suena'], [
    ['Unísono', '1:1', 'todos', 'la misma nota'],
    ['Octava', '2:1', 'todos los de la aguda con los pares de la grave', 'casi la misma nota'],
    ['Quinta', '3:2', '$2f_2 = 3f_1$, $4f_2 = 6f_1$…', 'la consonancia más limpia después de la octava'],
    ['Cuarta', '4:3', '$3f_2 = 4f_1$…', 'limpia, algo más hueca'],
    ['Tercera mayor', '5:4', '$4f_2 = 5f_1$…', 'dulce, algo más rica'],
    ['Tritono', '$\\sqrt 2$:1', 'ninguno', 'áspero: los armónicos baten sin coincidir']
  ]);

  p.text('Cuando la razón de frecuencias es un cociente de números <strong>pequeños</strong>, muchos ' +
    'armónicos de una nota caen exactamente sobre armónicos de la otra —refuerzo, sin batido— y los ' +
    'que no coinciden quedan lejos. Cuando la razón es «complicada», como el tritono, cada armónico ' +
    'tiene cerca uno ajeno con el que late a decenas de hercios: aspereza. La consonancia es ' +
    'aritmética: los batidos entre armónicos, contados.');

  p.demo({
    title: 'Construir un acorde',
    intro: 'Una nota base de 220 Hz con sus armónicos y, encima, dos notas más a n1 y n2 semitonos. Con (4, 7) es un acorde mayor; con (3, 7), menor; con (6, 0) un tritono. Escucha la aspereza y mira el espectro: en el mayor, muchas rayas se superponen.',
    predice: 'El acorde mayor es 4:5:6, o sea, $220$, $275$ y $330$ Hz. ¿Con qué semitonos sale? Pista: la tercera mayor son 4 y la quinta son 7. Ponlos y compara con 6 y 0.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-batidos-2', dur: 2, ventana: 20, fmax: 2500,
        mandos: [
          { n: 'n1', label: 'segunda nota (semitonos sobre la base)', min: 0, max: 12, step: 1, value: 4, dec: 0 },
          { n: 'n2', label: 'tercera nota (semitonos)', min: 0, max: 12, step: 1, value: 7, dec: 0 }
        ],
        codigo:
          '// una nota con cuatro armónicos, para que la consonancia se oiga\n' +
          'function nota4(f, t) {\n' +
          '    return sin(TAU * f * t) + sin(TAU * 2 * f * t) / 2 + sin(TAU * 3 * f * t) / 3 + sin(TAU * 4 * f * t) / 4;\n' +
          '}\n' +
          'function sonido(t) {\n' +
          '    var f0 = 220;\n' +
          '    var y = nota4(f0, t) + nota4(f0 * pow(2, n1 / 12), t) + nota4(f0 * pow(2, n2 / 12), t);\n' +
          '    return 0.12 * y;\n' +
          '}\n',
        nota: 'Fíjate en que aquí hay una función auxiliar, <code>nota4</code>, escrita por encima de ' +
          '<code>sonido</code>: se pueden definir todas las que hagan falta. Prueba (4, 7), (3, 7), (5, 7), ' +
          '(2, 7) y (6, 0), y ordena los acordes de más limpio a más áspero.'
      });
    }
  });

  p.comprueba('¿Qué par de notas late más despacio?', [
    { t: '440 y 441 Hz', ok: true, por: 'Un hercio de diferencia: un batido por segundo. Es el par más cercano y por tanto el más lento.' },
    { t: '440 y 445 Hz', ok: false, por: 'Cinco batidos por segundo: bastante más rápido que un hercio.' },
    { t: '440 y 880 Hz', ok: false, por: 'Están a una octava: no laten, se oyen como la misma nota a dos alturas. Los batidos son cosa de frecuencias casi iguales.' }
  ]);

  p.hist('Joseph Sauveur, un físico francés sordo desde niño, usó los batidos hacia 1700 para medir ' +
    'frecuencias absolutas por primera vez: contaba los latidos entre dos tubos de órgano y, sabiendo ' +
    'la razón de sus longitudes, despejaba los hercios de cada uno. Fue quien acuñó la palabra ' +
    '<em>acústica</em>. Helmholtz explicó la consonancia por los batidos entre armónicos en 1863, y ' +
    'la idea se confirmó en los años sesenta con experimentos de Plomp y Levelt sobre la «aspereza» ' +
    'de dos tonos puros según su distancia: la máxima está hacia un cuarto de tono, y por debajo de ' +
    'unos 15 Hz de diferencia se oye como batido y no como aspereza.');

  p.util('El efecto <em>chorus</em> de una guitarra o de un teclado es un batido a propósito: se ' +
    'suma la señal con una copia desafinada unos pocos cents, y el resultado late despacio y suena ' +
    '«más ancho», como si tocaran varios instrumentos. Un piano lleva tres cuerdas por nota afinadas ' +
    'casi iguales por la misma razón. Y los afinadores electrónicos hacen justo lo contrario: miden ' +
    'la frecuencia para que no haya batido con la referencia.');

  p.trampas([
    { e: '«Se oyen dos notas, una a 440 y otra a 444»', por: 'Se oye una, a 442, latiendo. El oído no separa dos tonos tan cercanos: los funde y oye la envolvente.' },
    { e: 'Contar el batido a $\\frac{f_1 - f_2}{2}$', por: 'Esa es la frecuencia del coseno de la envolvente, pero el volumen es su valor absoluto y tiene dos máximos por vuelta: los batidos van a $f_1 - f_2$.' },
    { e: '$\\operatorname{sen} a + \\operatorname{sen} b = \\operatorname{sen}(a + b)$', por: 'La suma de senos no es el seno de la suma. Es $2\\operatorname{sen}\\frac{a+b}{2}\\cos\\frac{a-b}{2}$, y de ahí sale todo el tema.' },
    { e: '«Dos notas cercanas son las que mejor suenan juntas»', por: 'Al revés: las muy cercanas laten o rascan. Lo que suena limpio son las razones simples, 3:2, 4:3, 5:4, cuyos armónicos coinciden.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántos batidos',
    level: 'basico',
    gen: function (r) {
      var f1 = r.pick([220, 261.6, 330, 440, 523.3]), d = r.pick([0.5, 1, 1.5, 2, 3, 4, 5, 6]) * r.pick([1, -1]);
      return { f1: f1, f2: f1 + d, b: Math.abs(d) };
    },
    ask: function (d) { return 'Suenan a la vez $' + U.fmt(d.f1, 1) + '$ Hz y $' + U.fmt(d.f2, 1) + '$ Hz. ¿Cuántos batidos por segundo se oyen?'; },
    fields: [{ name: 'b', label: 'batidos/s', w: 'tiny' }],
    sol: function (d) { return { b: d.b }; },
    dec: 1,
    errores: [{ si: function (v, d) { return Math.abs(v.b - d.b / 2) < 0.01; }, msg: 'Esa es la frecuencia del coseno de la envolvente. El volumen late el doble de veces: $|f_1 - f_2|$.' }],
    hint: function () { return '$f_{\\text{batido}} = |f_1 - f_2|$.'; },
    steps: function (d) { return ['$|' + U.fmt(d.f1, 1) + ' - ' + U.fmt(d.f2, 1) + '| = ' + U.fmt(d.b, 1) + '$ batidos por segundo.']; },
    answer: function (d) { return U.fmt(d.b, 1) + ' batidos/s'; }
  });

  p.exercise({
    title: 'La nota que se oye',
    level: 'basico',
    gen: function (r) {
      var f1 = r.pick([220, 330, 440, 660]), d = r.pick([1, 2, 3, 4, 6, 8]);
      return { f1: f1, f2: f1 + d, m: f1 + d / 2, T: 1 / d };
    },
    ask: function (d) { return 'Al sumar $' + d.f1 + '$ Hz y $' + d.f2 + '$ Hz, ¿a qué frecuencia suena la nota que se oye, y cuánto tiempo pasa entre un batido y el siguiente? (dos y tres decimales)'; },
    fields: [{ name: 'm', label: 'nota (Hz)', w: 'wide' }, { name: 'T', label: 'entre batidos (s)', w: 'wide' }],
    sol: function (d) { return { m: d.m, T: U.round(d.T, 6) }; },
    dec: { m: 2, T: 3 },
    hint: function () { return ['La nota es la frecuencia media, $\\frac{f_1 + f_2}{2}$.', 'Entre batidos pasa $1/|f_1 - f_2|$ segundos.']; },
    steps: function (d) { return ['Nota: $\\dfrac{' + d.f1 + ' + ' + d.f2 + '}{2} = ' + U.fmt(d.m, 2) + '$ Hz.', 'Batidos a $' + (d.f2 - d.f1) + '$ por segundo: uno cada $' + U.fmt(d.T, 3) + '$ s.']; },
    answer: function (d) { return U.fmt(d.m, 2) + ' Hz, cada ' + U.fmt(d.T, 3) + ' s'; }
  });

  p.exercise({
    title: 'El primer armónico común',
    level: 'medio',
    gen: function (r) {
      var casos = [{ p: 3, q: 2, n: 'quinta' }, { p: 4, q: 3, n: 'cuarta' }, { p: 5, q: 4, n: 'tercera mayor' }, { p: 6, q: 5, n: 'tercera menor' }, { p: 5, q: 3, n: 'sexta mayor' }];
      var c = r.pick(casos), f1 = r.pick([100, 120, 200, 220, 240, 300]);
      return { c: c, f1: f1, f2: f1 * c.p / c.q, comun: f1 * c.p };
    },
    ask: function (d) { return 'Una nota de $' + d.f1 + '$ Hz y, encima, su ' + d.c.n + ' justa (razón $' + d.c.p + ':' + d.c.q + '$). ¿Cuál es la frecuencia más baja en la que coincide un armónico de cada una?'; },
    fields: [{ name: 'f', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { f: d.comun }; },
    dec: 0,
    hint: function (d) { return ['La segunda nota está a $' + U.fmt(d.f2, 1) + '$ Hz.', 'Busca el mínimo común múltiplo de las dos series de armónicos: el armónico $' + d.c.p + '$ de la grave es el $' + d.c.q + '$ de la aguda.']; },
    steps: function (d) { return ['$f_2 = ' + d.f1 + '\\cdot\\frac{' + d.c.p + '}{' + d.c.q + '} = ' + U.fmt(d.f2, 1) + '$ Hz.', '$' + d.c.p + ' f_1 = ' + d.c.q + ' f_2 = ' + d.comun + '$ Hz: ahí se refuerzan en vez de batir. Cuanto más pequeños son $' + d.c.p + '$ y $' + d.c.q + '$, antes ocurre y más consonante suena.']; },
    answer: function (d) { return d.comun + ' Hz'; }
  });

  p.exercise({
    title: 'Afinar por batidos',
    level: 'medio',
    gen: function (r) {
      var b = r.pick([1, 2, 3, 4, 5]), t = r.pick([2, 3, 4, 5, 8, 10]);
      return { b: b, t: t, n: b * t };
    },
    ask: function (d) { return 'Al tocar la cuerda de referencia (440 Hz) con la que se está afinando se cuentan $' + d.n + '$ batidos en $' + d.t + '$ segundos. ¿A cuántos hercios está la cuerda de la referencia?'; },
    fields: [{ name: 'b', label: 'Hz de diferencia', w: 'tiny' }],
    sol: function (d) { return { b: d.b }; },
    dec: 1,
    hint: function () { return 'Batidos por segundo $= |f_1 - f_2|$.'; },
    steps: function (d) { return ['$' + d.n + ' / ' + d.t + ' = ' + d.b + '$ batidos por segundo: la cuerda está a $' + d.b + '$ Hz de 440, por arriba o por abajo. Los batidos no dicen hacia dónde: hay que girar la clavija y ver si se hacen más lentos.']; },
    answer: function (d) { return d.b + ' Hz'; }
  });

  p.exercise({
    title: 'Escribe el batido',
    level: 'avanzado',
    gen: function (r) {
      var f1 = r.pick([220, 330, 440]), b = r.pick([2, 3, 4, 5]);
      return { f1: f1, f2: f1 + b, b: b, ref: '0.3 * sin(TAU * ' + f1 + ' * t) + 0.3 * sin(TAU * ' + (f1 + b) + ' * t)' };
    },
    ask: function (d) {
      return 'Escribe un sonido con dos senos de amplitud 0,3 cada uno, a <strong>' + d.f1 + ' Hz</strong> y a la frecuencia que haga que se oigan <strong>' + d.b + ' batidos por segundo</strong>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: '0.3 * sin(...) + 0.3 * sin(...)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 2, tolEnvolvente: 0.9 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (r.envolvente < 0.9) return { ok: false, msg: 'Suena, pero no late ' + d.b + ' veces por segundo: la segunda frecuencia tiene que estar a ' + d.b + ' Hz de la primera (por arriba o por abajo).' };
        if (r.espectro < 0.9) return { ok: false, msg: 'La frecuencia base no es ' + d.f1 + ' Hz.' };
        return { ok: false, msg: 'Las amplitudes tienen que ser 0,3 cada una.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['Los batidos van a $|f_1 - f_2|$: la segunda frecuencia es $' + d.f1 + ' \\pm ' + d.b + '$.', 'Dos senos sumados, cada uno con su amplitud.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'También vale con $' + (d.f1 - d.b) + '$ Hz: late igual, un poco más grave. Y por la identidad, es lo mismo que <code>0.6 * cos(TAU * ' + (d.b / 2) + ' * t) * sin(TAU * ' + (d.f1 + d.b / 2) + ' * t)</code>.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Dos senos casi iguales se oyen como uno solo, a la frecuencia media, que late $|f_1 - f_2|$ veces por segundo.',
    'Sale de $\\operatorname{sen} a + \\operatorname{sen} b = 2\\operatorname{sen}\\frac{a+b}{2}\\cos\\frac{a-b}{2}$: el coseno lento es la envolvente.',
    'Se afina eliminando los batidos: cuando desaparecen, las frecuencias coinciden.',
    'Consonancia: razones de números pequeños (3:2, 4:3, 5:4) hacen coincidir armónicos y evitan que baten. El acorde mayor es 4:5:6.',
    'Un acorde no late: la aspereza viene de armónicos ajenos cercanos, y desaparece cuando coinciden.'
  ]);
});
