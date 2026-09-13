/* Tema: El sonido es una función */
Course.topic('son-onda', function (p) {

  p.puente('En [[tr-funciones|funciones trigonométricas y ondas]] el seno dejó de ser una razón de un ' +
    'triángulo para convertirse en una curva que sube y baja, y en [[fn-concepto|concepto de función]] ' +
    'una función era «a cada entrada, una salida». Este bloque junta las dos cosas y les pone ' +
    'altavoz: un sonido es una función del tiempo, y una función del tiempo, escrita con tres líneas ' +
    'de código, <strong>se oye</strong>.', 'Por dónde empezamos');

  p.text('Este bloque es distinto de los de matemáticas y por eso tiene otro color. Aquí no se ' +
    'demuestra nada: se escucha. Vas a coger el seno, el logaritmo, la exponencial, la serie de ' +
    'Fourier y las sucesiones recurrentes y a ponerlas a sonar, en tu ordenador, con un código que ' +
    'puedes tocar mientras suena. Y la promesa es la misma que la del bloque de programación ' +
    'gráfica: <strong>fórmulas de tres líneas producen sonidos que parecen instrumentos</strong>.');

  p.section('Qué es un sonido');

  p.text('Un altavoz es una membrana que se mueve hacia delante y hacia atrás. Al moverse empuja el ' +
    'aire, y ese empujón viaja hasta tu tímpano, que se mueve igual. Lo único que llega a tu oído es, ' +
    'por tanto, <strong>una presión que cambia con el tiempo</strong>: un poco más que la del aire ' +
    'en reposo, un poco menos, un poco más… varios cientos de veces por segundo.');

  p.note('Un sonido es una <strong>función del tiempo</strong>: a cada instante $t$ le corresponde un ' +
    'número, la posición de la membrana. Aquí ese número va de $-1$ (la membrana todo lo atrás que ' +
    'puede) a $1$ (todo lo adelante), y $0$ es el reposo. Eso es <em>todo</em> lo que hay que saber ' +
    'para empezar: escribir $y = f(t)$, y el ordenador hace el resto.', 'ok', 'La idea del bloque entero');

  p.text('Fíjate en la analogía con el bloque de gráficos, si lo has hecho: allí una función recibía ' +
    'un píxel y devolvía un color; aquí recibe un instante y devuelve una presión. Allí el resultado se ' +
    'veía; aquí se oye. La matemática de debajo es la misma idea de función.');

  p.section('El seno: el sonido más simple que existe');

  p.formula('y(t) = A\\,\\operatorname{sen}(2\\pi f\\,t + \\varphi)', 'un tono puro',
    'Se lee: <em>«y de te es igual a a por seno de dos pi efe te más fi»</em>.<br><br>Tres números ' +
      'lo fijan todo. $A$ es la <strong>amplitud</strong>: cuánto se mueve la membrana, o sea, lo ' +
      '<strong>fuerte</strong> que suena; aquí va de 0 a 1. $f$ es la <strong>frecuencia</strong>: ' +
      'cuántas oscilaciones completas caben en un segundo, en <strong>hercios</strong> (Hz), y es lo ' +
      '<strong>agudo</strong> que suena. $\\varphi$ es la fase: por dónde empieza la oscilación, y ' +
      'el oído no la nota.<br><br>El $2\\pi$ está ahí porque el seno da una vuelta entera cada $2\\pi$: ' +
      'con $2\\pi f t$, cuando $t$ avanza un segundo el argumento avanza $f$ vueltas, que es lo que ' +
      'significa «$f$ oscilaciones por segundo».');

  p.text('Un seno puro suena a diapasón, o a silbido limpio, o al pitido de una máquina. Casi ningún ' +
    'sonido real es un seno solo —de eso va el tema de los armónicos—, pero todos están hechos de ' +
    'senos, y por eso se empieza por él.');

  p.demo({
    title: 'Tu primer sonido',
    intro: 'Tres líneas: una función que recibe el tiempo y devuelve un seno. Pulsa «Tocar». Mueve la frecuencia y la amplitud mientras suena, y cambia lo que quieras en el código: se vuelve a calcular solo.',
    predice: 'Antes de pulsar nada: si subes $f$ de 440 a 880, ¿el sonido será más fuerte, más agudo o más largo? ¿Y si bajas $A$ a 0,1?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-onda-1', dur: 1, ventana: 10,
        mandos: [
          { n: 'f', label: 'frecuencia f (Hz)', min: 50, max: 2000, step: 10, value: 440, dec: 0 },
          { n: 'A', label: 'amplitud A', min: 0, max: 1, step: 0.05, value: 0.5, dec: 2 }
        ],
        codigo:
          '// t es el tiempo en segundos. Devuelve un número entre -1 y 1.\n' +
          'function sonido(t) {\n' +
          '    return A * sin(TAU * f * t);\n' +
          '}\n',
        nota: 'La onda de la izquierda enseña los primeros 10 milisegundos: cuenta cuántas oscilaciones ' +
          'caben y multiplica por 100, y saldrá la frecuencia. El espectro de la derecha tiene una sola ' +
          'raya, porque un seno es una sola frecuencia.'
      });
    }
  });

  p.section('El código, línea a línea');

  p.text('Lo que acabas de escribir es JavaScript, el idioma en el que están programadas las páginas ' +
    'web, y también este curso. No hace falta saberlo: hay una forma fija que vas a repetir en todos ' +
    'los temas, y dentro de ella solo se escriben fórmulas.');

  p.table(['Trozo', 'Qué es'], [
    ['<code>function sonido(t) { … }</code>', 'La función. El motor la llama 44 100 veces por segundo de sonido, cada vez con un $t$ un poco mayor. Tú no la llamas nunca.'],
    ['<code>return …;</code>', 'Lo que devuelve: el valor de la onda en ese instante. Tiene que ser un número entre $-1$ y $1$.'],
    ['<code>sin(x)</code>, <code>cos(x)</code>', 'El seno y el coseno, en radianes. Se escriben en inglés porque así los llama el lenguaje.'],
    ['<code>TAU</code>, <code>PI</code>', '$2\\pi$ y $\\pi$. Escribir <code>TAU * f * t</code> ahorra el <code>2 *</code> y se lee igual que la fórmula.'],
    ['<code>*</code>, <code>/</code>, <code>+</code>, <code>-</code>', 'Las operaciones de siempre. La multiplicación hay que escribirla: <code>2 * t</code>, no <code>2t</code>.'],
    ['<code>// …</code>', 'Un comentario: el motor no lo lee. Sirve para dejarte notas.'],
    ['<code>f</code>, <code>A</code>', 'Los mandos. Aparecen como deslizadores y dentro del código son números que cambian al moverlos.']
  ]);

  p.note('A diferencia de los shaders, aquí los números <strong>no</strong> necesitan punto decimal: ' +
    '<code>440</code> y <code>440.0</code> son lo mismo. Lo que sí hace falta es el punto y coma al ' +
    'final de cada línea y los paréntesis bien cerrados. Si algo falla, debajo del código sale el ' +
    'mensaje en rojo y, cuando se puede, la línea.', null, 'Lo que perdona y lo que no');

  p.comprueba('En <code>return A * sin(TAU * f * t);</code>, si duplicas $f$ y dejas $A$ como estaba, ¿qué cambia en el sonido?', [
    { t: 'Suena el doble de fuerte', ok: false, por: 'Lo fuerte lo decide $A$, que no ha cambiado. La onda sigue llegando a la misma altura; lo que cambia es cuántas veces sube y baja por segundo.' },
    { t: 'Suena una octava más agudo', ok: true, por: 'Duplicar la frecuencia es subir una octava: es la relación que hay entre un La de 440 Hz y el La de 880. La amplitud, y con ella el volumen, no cambian.' },
    { t: 'Dura la mitad', ok: false, por: 'La duración la fija el motor, no la fórmula. Con $f$ doble hay el doble de oscilaciones en el mismo tiempo, no el mismo número en la mitad de tiempo.' }
  ]);

  p.section('Amplitud: lo fuerte. Frecuencia: lo agudo');

  p.text('El oído distingue dos cosas de un tono puro, y las dos están en la fórmula. La ' +
    '<strong>amplitud</strong> es el volumen: cuanto más se mueve la membrana, más aire empuja y más ' +
    'fuerte se oye. La <strong>frecuencia</strong> es la altura: más oscilaciones por segundo, más ' +
    'agudo. Y hay un tercer parámetro, la fase, que el oído sencillamente no percibe: empezar la ' +
    'oscilación un poco antes o después no cambia el sonido.');

  p.formula('T = \\frac{1}{f}', 'el periodo: lo que dura una oscilación',
    'Se lee: <em>«te es igual a uno partido por efe»</em>. Si un sonido oscila 440 veces por segundo, ' +
      'cada oscilación dura $\\frac{1}{440}$ de segundo, unos $2{,}27$ milisegundos. En la onda de arriba, ' +
      'es la anchura de una «joroba» completa, de subida y bajada.');

  p.text('El oído humano oye, más o menos, desde <strong>20 Hz hasta 20 000 Hz</strong>. Por debajo el ' +
    'aire se mueve pero se nota como una vibración, no como un sonido; por encima, sencillamente no hay ' +
    'nada. Con la edad el techo baja: a los cuarenta años pocas personas pasan de 15 000 Hz.');

  p.demo({
    title: 'Lo que se oye y lo que no',
    intro: 'La misma fórmula, con la frecuencia de 1 Hz a 20 000 Hz. Sube despacio desde abajo: hay un momento en que la vibración se convierte en tono, y otro, arriba, en que el tono desaparece aunque la onda siga ahí.',
    predice: 'Con $f = 5$ Hz, ¿oirás un sonido grave o no oirás nada? Mira la onda antes de tocar: son cinco jorobas por segundo.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-onda-2', dur: 1, ventana: 50, fmax: 20000,
        mandos: [{ n: 'f', label: 'frecuencia f (Hz)', min: 1, max: 20000, step: 1, value: 5, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    return 0.5 * sin(TAU * f * t);\n' +
          '}\n',
        nota: 'Por debajo de unos 20 Hz el altavoz se mueve pero no hay tono: es una vibración. Por ' +
          'encima de los 15 000 o 18 000, según la edad y el altavoz, tampoco. El espectro sigue ' +
          'mostrando la raya: el sonido existe, aunque tú no lo oigas.'
      });
    }
  });

  p.ejemplo({
    title: 'Un tono, de la fórmula al código y a un instante concreto',
    enunciado: 'Escribir la función de un tono de 220 Hz y amplitud 0,3, hallar su periodo y calcular cuánto vale la onda en $t = \\frac{1}{880}$ s.',
    pasos: [
      { t: '<strong>La fórmula.</strong> $y(t) = 0{,}3\\,\\operatorname{sen}(2\\pi\\cdot 220\\,t)$. La amplitud va delante y la frecuencia dentro, multiplicada por $2\\pi$.', antes: '¿Dónde va cada número: el 220 y el 0,3?' },
      { t: '<strong>El código.</strong> <code>function sonido(t) { return 0.3 * sin(TAU * 220 * t); }</code>. Es la fórmula escrita con las palabras del lenguaje: <code>TAU</code> es $2\\pi$ y <code>sin</code> el seno.' },
      { t: '<strong>El periodo.</strong> $T = \\frac{1}{220} \\approx 0{,}004545$ s, unos 4,5 milisegundos. En 10 ms caben algo más de dos oscilaciones.', antes: '¿Cuánto dura una oscilación?' },
      { t: '<strong>El instante pedido.</strong> $t = \\frac{1}{880} = \\frac{1}{4}\\cdot\\frac{1}{220} = \\frac{T}{4}$: un cuarto de oscilación. El argumento vale $2\\pi\\cdot 220\\cdot\\frac{1}{880} = \\frac{\\pi}{2}$, y $\\operatorname{sen}\\frac{\\pi}{2} = 1$.', antes: '¿Qué fracción del periodo es $\\frac{1}{880}$? Calcula el argumento del seno.' },
      { t: '<strong>El valor.</strong> $y = 0{,}3\\cdot 1 = 0{,}3$: la membrana está en su punto más adelantado. Un cuarto de periodo después estará en $0$, y otro cuarto después en $-0{,}3$.' }
    ],
    cierre: 'Todo el tema en un ejemplo: la amplitud es hasta dónde llega, la frecuencia cuántas veces por segundo, y el valor en un instante se calcula como cualquier función.'
  });

  p.hist('La idea de que un sonido es una vibración y de que la altura es su frecuencia es de ' +
    'Pitágoras en lo cualitativo, pero la primera medición es de Marin Mersenne, en 1636: contó las ' +
    'vibraciones de una cuerda larguísima de cáñamo, tan lenta que se veía moverse, y dedujo las de las ' +
    'cuerdas cortas por proporción. Hermann von Helmholtz, en 1863, demostró con resonadores de vidrio que ' +
    'el oído descompone cualquier sonido en tonos puros, que es lo que hace este bloque con senos y ' +
    'código. Y el primer sonido sintetizado por un ordenador lo generó Max Mathews en 1957, en los ' +
    'laboratorios Bell, con un programa que hacía exactamente esto: calcular una función del tiempo, ' +
    'muestra a muestra.');

  p.util('Todo lo que suena en un dispositivo pasa por aquí. El tono de llamada, la voz por el ' +
    'teléfono, la música de una plataforma, la alarma del despertador: listas de números entre $-1$ y ' +
    '$1$, calculadas o grabadas, que un chip convierte en el movimiento de una membrana. Los ' +
    'sintetizadores de los estudios de música hacen literalmente lo que hace este código, con más ' +
    'osciladores y mejor interfaz; y una ecografía o un sonar son la misma idea con frecuencias que no ' +
    'se oyen.');

  p.trampas([
    { e: 'Escribir <code>sin(440 * t)</code> sin el <code>TAU</code>', por: 'El seno da una vuelta cada $2\\pi$, no cada 1. Sin el $2\\pi$ el sonido tiene $\\frac{440}{2\\pi} \\approx 70$ Hz: dos octavas y media más grave de lo que se pretendía.' },
    { e: 'Amplitud mayor que 1', por: 'La membrana no puede ir más allá de su tope. Lo que pasa de $1$ se recorta, la onda se aplana por arriba y el sonido se ensucia. El motor avisa: «recorta».' },
    { e: '«Más amplitud, más agudo»', por: 'La amplitud es el volumen. Lo agudo es la frecuencia: cuántas oscilaciones por segundo, no cuánto sube cada una.' },
    { e: 'Escribir <code>sen</code>, <code>2t</code> o <code>2π</code> en el código', por: 'El lenguaje solo entiende <code>sin</code>, <code>2 * t</code> y <code>TAU</code>. La fórmula y el código dicen lo mismo con palabras distintas.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Periodo y frecuencia',
    level: 'basico',
    gen: function (r) {
      var f = r.pick([50, 100, 125, 200, 250, 400, 440, 500, 800, 1000, 2000]);
      return { f: f, T: 1000 / f };
    },
    ask: function (d) { return 'Un tono tiene frecuencia $f = ' + d.f + '$ Hz. ¿Cuánto dura una oscilación completa, en milisegundos? (tres decimales)'; },
    fields: [{ name: 'T', label: 'T (ms)', w: 'wide' }],
    sol: function (d) { return { T: U.round(d.T, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.T - 1 / d.f) < 1e-6 && d.f !== 1000; }, msg: 'Eso son segundos. Se pedía en milisegundos: multiplica por 1000.' }],
    hint: function () { return '$T = \\frac{1}{f}$ segundos. Para pasar a milisegundos, multiplica por 1000.'; },
    steps: function (d) { return ['$T = \\dfrac{1}{' + d.f + '} = ' + U.fmt(1 / d.f, 6) + '$ s', 'En milisegundos: $' + U.fmt(d.T, 3) + '$ ms. En 10 ms de onda caben $' + U.fmt(10 / d.T, 1) + '$ oscilaciones.']; },
    answer: function (d) { return U.fmt(d.T, 3) + ' ms'; }
  });

  p.exercise({
    title: 'Lee la fórmula',
    level: 'basico',
    gen: function (r) {
      var A = r.pick([0.2, 0.25, 0.4, 0.5, 0.8]), f = r.pick([110, 220, 330, 440, 660, 880, 1000]);
      var forma = r.int(0, 2);
      var tex = [A + '\\,\\operatorname{sen}(2\\pi\\cdot ' + f + '\\,t)', A + '\\,\\operatorname{sen}(' + (2 * f) + '\\pi\\,t)', A + '\\cos(2\\pi\\cdot ' + f + '\\,t)'][forma];
      return { A: A, f: f, forma: forma, tex: tex.replace(/0\.(\d+)/g, '0{,}$1') };
    },
    ask: function (d) { return 'Un sonido viene dado por $y(t) = ' + d.tex + '$. ¿Cuánto valen su amplitud y su frecuencia en hercios?'; },
    fields: [{ name: 'A', label: 'amplitud', w: 'tiny' }, { name: 'f', label: 'f (Hz)', w: 'tiny' }],
    sol: function (d) { return { A: d.A, f: d.f }; },
    dec: { A: 2, f: 0 },
    errores: [{ si: function (v, d) { return d.forma === 1 && Math.abs(v.f - 2 * d.f) < 0.5; }, msg: 'El coeficiente de $t$ es $2\\pi f$, no $f$: hay que dividir entre $2\\pi$. $' + '2f\\pi$ corresponde a $f$ hercios.' }],
    hint: function () { return ['El número que multiplica al seno es la amplitud.', 'Dentro del seno va $2\\pi f t$: la frecuencia es lo que multiplica a $t$ dividido entre $2\\pi$. Que sea coseno en vez de seno no cambia nada: es un cambio de fase.']; },
    steps: function (d) { return ['Amplitud: el factor de delante, $A = ' + U.fmt(d.A, 2) + '$.', 'Frecuencia: el coeficiente de $t$ es $2\\pi\\cdot ' + d.f + '$, así que $f = ' + d.f + '$ Hz.' + (d.forma === 2 ? ' El coseno es un seno desplazado un cuarto de periodo: misma frecuencia, misma amplitud, y el oído no nota la diferencia.' : '')]; },
    answer: function (d) { return 'A = ' + U.fmt(d.A, 2) + ', f = ' + d.f + ' Hz'; }
  });

  p.exercise({
    title: 'El valor en un instante',
    level: 'medio',
    gen: function (r) {
      var A = r.pick([0.2, 0.4, 0.5, 0.6, 0.8]), f = r.pick([100, 200, 250, 400, 500, 1000]);
      var k = r.pick([1, 2, 3, 5, 6]);            // t = k / (4 f): cuartos de periodo
      var arg = k * Math.PI / 2, v = A * Math.sin(arg);
      return { A: A, f: f, k: k, v: Math.abs(v) < 1e-9 ? 0 : v, den: 4 * f };
    },
    ask: function (d) { return 'Para $y(t) = ' + U.fmt(d.A, 1) + '\\,\\operatorname{sen}(2\\pi\\cdot ' + d.f + '\\,t)$, calcula $y$ en $t = \\dfrac{' + d.k + '}{' + d.den + '}$ s.'; },
    fields: [{ name: 'v', label: 'y =', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.A * Math.sin(d.k * d.f / d.den)) < 0.01 && Math.abs(d.v - d.A * Math.sin(d.k * d.f / d.den)) > 0.02; }, msg: 'Te has dejado el $2\\pi$ al calcular el argumento del seno.' }],
    hint: function (d) { return ['Calcula el argumento: $2\\pi\\cdot ' + d.f + '\\cdot\\frac{' + d.k + '}{' + d.den + '}$. Simplifica antes de multiplicar.', 'Sale un múltiplo de $\\frac{\\pi}{2}$: el seno vale $0$, $1$ o $-1$.']; },
    steps: function (d) { return ['Argumento: $2\\pi\\cdot ' + d.f + '\\cdot\\dfrac{' + d.k + '}{' + d.den + '} = \\dfrac{' + d.k + '\\pi}{2}$.', '$\\operatorname{sen}\\dfrac{' + d.k + '\\pi}{2} = ' + (d.v === 0 ? '0' : (d.v > 0 ? '1' : '-1')) + '$, así que $y = ' + U.fmt(d.v, 2) + '$.', 'El instante es $\\frac{' + d.k + '}{4}$ del periodo: ' + (d.v === 0 ? 'la membrana pasa por el reposo.' : (d.v > 0 ? 'la membrana está en su punto más adelantado.' : 'la membrana está en su punto más atrasado.'))]; },
    answer: function (d) { return U.fmt(d.v, 2); }
  });

  p.exercise({
    title: 'Escribe el sonido',
    level: 'medio',
    gen: function (r) {
      var A = r.pick([0.2, 0.3, 0.5, 0.7]), f = r.pick([110, 220, 330, 440, 550, 660, 880]);
      return { A: A, f: f, ref: A + ' * sin(TAU * ' + f + ' * t)' };
    },
    ask: function (d) {
      return 'Completa la función para que suene un tono puro de <strong>' + d.f + ' Hz</strong> con amplitud <strong>' + U.fmt(d.A, 1) + '</strong>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe solo lo que va en el hueco. Se corrige comparando el sonido, así que vale cualquier forma de escribirlo que suene igual.</span>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: 'A * sin(TAU * f * t)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión que va detrás de <code>return</code>.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 0.6 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis y los nombres.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio: la función devuelve cero. ¿Falta el seno?' };
        if (r.espectro < 0.9) return { ok: false, msg: 'Suena, pero no a ' + d.f + ' Hz. Recuerda que dentro del seno va <code>TAU * f * t</code>, con el <code>TAU</code>.' };
        return { ok: false, msg: 'La frecuencia está bien pero el volumen no: la amplitud es el número que multiplica al seno.' };
      }
      return { ok: true };
    },
    hint: function () { return '$y = A\\,\\operatorname{sen}(2\\pi f t)$ se escribe <code>A * sin(TAU * f * t)</code>, con los números en el sitio de $A$ y de $f$.'; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'Cualquier escritura equivalente vale: <code>' + d.A + ' * cos(TAU * ' + d.f + ' * t)</code> suena exactamente igual, porque la fase no se oye.']; },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Lee el código',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        function () { var f = r.pick([220, 440, 660]); return { cod: 'return 0.5 * sin(TAU * ' + f + ' * t);', f: f, por: 'Dentro del seno va $2\\pi\\cdot ' + f + '\\cdot t$: ' + f + ' oscilaciones por segundo.' }; },
        function () { var f = r.pick([110, 220, 330]); return { cod: 'return 0.4 * sin(TAU * 2 * ' + f + ' * t);', f: 2 * f, por: 'El coeficiente de $t$ dentro del seno es $2\\pi\\cdot 2\\cdot ' + f + ' = 2\\pi\\cdot ' + (2 * f) + '$: suena a ' + (2 * f) + ' Hz, una octava por encima de ' + f + '.' }; },
        function () { var f = r.pick([440, 880, 1000]); return { cod: 'return 0.5 * sin(' + f + ' * t);', f: f / (2 * Math.PI), por: 'Falta el $2\\pi$: el argumento es $' + f + 't$, así que $2\\pi f = ' + f + '$ y $f = \\frac{' + f + '}{2\\pi} \\approx ' + U.fmt(f / (2 * Math.PI), 1) + '$ Hz. Un error clásico, y suena mucho más grave de lo previsto.' }; },
        function () { var f = r.pick([200, 300, 500]); return { cod: 'return 0.5 * sin(' + (2 * f) + ' * PI * t);', f: f, por: '$' + (2 * f) + '\\pi t = 2\\pi\\cdot ' + f + '\\cdot t$: son ' + f + ' Hz.' }; },
        function () { var f = r.pick([250, 400, 500]); return { cod: 'var w = TAU * ' + f + ';\n    return 0.3 * cos(w * t);', f: f, por: 'Se ha guardado $\\omega = 2\\pi\\cdot ' + f + '$ en una variable y luego se usa. El coseno no cambia la frecuencia: ' + f + ' Hz.' }; }
      ];
      return r.pick(casos)();
    },
    ask: function (d) { return '¿A qué frecuencia, en hercios, suena este código? (un decimal)<pre class="shd__mini">function sonido(t) {\n    ' + d.cod + '\n}</pre>'; },
    fields: [{ name: 'f', label: 'f (Hz)', w: 'wide' }],
    sol: function (d) { return { f: U.round(d.f, 4) }; },
    dec: 1,
    hint: function () { return ['Busca el coeficiente que multiplica a $t$ dentro del seno o el coseno: es $2\\pi f$.', 'Si no hay <code>TAU</code> ni <code>PI</code>, el coeficiente es $2\\pi f$ igualmente: divide entre $2\\pi$.']; },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return U.fmt(d.f, 1) + ' Hz'; }
  });

  p.keys([
    'Un sonido es una <strong>función del tiempo</strong>: a cada instante, una presión entre $-1$ y $1$.',
    'El tono puro es $y = A\\,\\operatorname{sen}(2\\pi f t)$: $A$ es lo fuerte, $f$ lo agudo, y la fase no se oye.',
    'El periodo es $T = 1/f$; el oído va de unos 20 Hz a unos 20 000 Hz.',
    'En el código: <code>function sonido(t) { return A * sin(TAU * f * t); }</code>. <code>TAU</code> es $2\\pi$ y sin él el sonido sale $2\\pi$ veces más grave.',
    'La amplitud no puede pasar de 1: lo que sobra se recorta.'
  ]);
});
