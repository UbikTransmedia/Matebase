/* Tema: Armónicos y timbre: sumar senos */
Course.topic('son-armonicos', function (p) {

  p.puente('Un La de 440 Hz en un piano y el mismo La en una flauta tienen la misma frecuencia y la ' +
    'misma nota, y nadie los confunde. Lo que los distingue es el <strong>timbre</strong>, y el ' +
    'timbre son otros senos montados encima del primero. La [[av-fourier|serie de Fourier]] dijo que ' +
    'cualquier onda periódica es una suma de senos de frecuencias múltiplos; aquí se oye. Y ' +
    '[[son-tono]] explicó por qué un múltiplo de 2 es una octava, que es lo que hace que esos senos ' +
    'suenen a la misma nota y no a un acorde.');

  p.section('Una nota son muchos senos');

  p.text('Casi ningún sonido real es un seno. Una cuerda, una columna de aire o una voz vibran de ' +
    'varias maneras a la vez, y cada manera es un seno. Lo que llega al oído es la suma. Lo que hace ' +
    'que suene a <em>una</em> nota y no a un montón de pitidos es que esas frecuencias son ' +
    '<strong>múltiplos enteros</strong> de una fundamental:');

  p.formula('y(t) = \\sum_{k=1}^{N} a_k\\,\\operatorname{sen}(2\\pi\\,k f\\,t + \\varphi_k)', 'una nota: la fundamental y sus armónicos',
    'Se lee: <em>«y de te es la suma, de ka igual a uno hasta ene, de a sub ka por seno de dos pi ka ' +
      'efe te más fi sub ka»</em>.<br><br>El término $k = 1$ es la <strong>fundamental</strong>, a $f$ ' +
      'hercios: es la nota que se oye. El $k = 2$ está a $2f$, una octava arriba; el $k = 3$ a $3f$, ' +
      'una octava y una quinta; el $k = 4$ a $4f$, dos octavas. Son los <strong>armónicos</strong>. Las ' +
      'amplitudes $a_k$ —cuánto pesa cada uno— son el timbre.<br><br>Por qué suena a una sola nota: cada ' +
      'armónico repite su ciclo cada $\\frac{1}{kf}$ segundos, y por tanto también cada $\\frac{1}{f}$. ' +
      'La suma entera se repite con el periodo de la fundamental, y el oído reconoce ese periodo como ' +
      'la altura.');

  p.demo({
    title: 'Sumar armónicos, uno a uno',
    intro: 'Un bucle suma N senos con frecuencias 220, 440, 660… y amplitudes 1, 1/2, 1/3… Empieza con N = 1 (un seno puro) y ve subiendo mientras suena. La nota no cambia; el timbre, sí. Y mira la onda: va tomando forma de sierra.',
    predice: 'Con $N = 1$ la onda es un seno. Con $N = 20$, ¿qué forma tendrá: seguirá siendo redondeada, o tendrá esquinas? Y la nota que se oye, ¿subirá al añadir senos más agudos, o seguirá siendo la misma?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-armonicos-1', dur: 1, ventana: 10, fmax: 5000,
        mandos: [{ n: 'N', label: 'número de armónicos N', min: 1, max: 30, step: 1, value: 1, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    var y = 0;\n' +
          '    for (var k = 1; k <= N; k++) {\n' +
          '        y += sin(TAU * k * 220 * t) / k;   // el armónico k, con amplitud 1/k\n' +
          '    }\n' +
          '    return 0.35 * y;\n' +
          '}\n',
        nota: 'Con amplitudes $1/k$ la suma tiende al diente de sierra: es la serie de Fourier de la ' +
          'sierra. En el espectro, cada armónico es una raya a $220k$ Hz, cada vez más baja. Cambia ' +
          '<code>/ k</code> por <code>/ (k * k)</code> y la suma se suaviza: pesan menos los agudos.'
      });
    }
  });

  p.section('Las tres formas clásicas');

  p.text('Tres ondas tienen nombre propio en todos los sintetizadores, y las tres son sumas de senos con ' +
    'una regla sencilla para las amplitudes. Son las series de Fourier que se calcularon en ' +
    '[[av-fourier|el tema de Fourier]], ahora con altavoz:');

  p.table(['Onda', 'Armónicos', 'Amplitud del armónico $k$', 'Cómo suena'], [
    ['Sierra', 'todos', '$\\dfrac{2}{\\pi k}$', 'brillante, con cuerpo: la base de los sintetizadores de cuerdas y metales'],
    ['Cuadrada', 'solo los impares', '$\\dfrac{4}{\\pi k}$', 'hueca, a clarinete o a videojuego antiguo'],
    ['Triángulo', 'solo los impares', '$\\dfrac{8}{\\pi^2 k^2}$', 'suave, casi un seno con un poco de brillo']
  ]);

  p.text('Fíjate en el $k^2$ del triángulo: sus armónicos se apagan mucho más deprisa que los de la ' +
    'cuadrada, y por eso suena más redondo aunque tenga los mismos. Y fíjate en que la cuadrada y el ' +
    'triángulo no tienen armónicos pares: eso es lo que les da ese carácter «hueco» que se reconoce ' +
    'en un clarinete, que tampoco los tiene, por razones que cuenta [[son-cuerda|el tema de la cuerda ' +
    'y el tubo]].');

  p.demo({
    title: 'El mismo La, cuatro timbres',
    intro: 'Cuatro mandos, uno por armónico del 2 al 5. La fundamental está siempre. Sube y baja cada armónico mientras suena: la nota no se mueve, el color sí. Prueba a poner solo los impares (el 3 y el 5) y compáralo con solo los pares.',
    predice: 'Si subes el armónico 2 y dejas los demás a cero, ¿oirás dos notas, o una sola más brillante? El armónico 2 está una octava por encima: piensa qué pasa con dos notas a distancia de octava.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-armonicos-2', dur: 1, ventana: 10, fmax: 3000,
        mandos: [
          { n: 'a2', label: 'armónico 2', min: 0, max: 1, step: 0.05, value: 0.5, dec: 2 },
          { n: 'a3', label: 'armónico 3', min: 0, max: 1, step: 0.05, value: 0.3, dec: 2 },
          { n: 'a4', label: 'armónico 4', min: 0, max: 1, step: 0.05, value: 0, dec: 2 },
          { n: 'a5', label: 'armónico 5', min: 0, max: 1, step: 0.05, value: 0.2, dec: 2 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var f = 440;\n' +
          '    var y = sin(TAU * f * t)             // la fundamental\n' +
          '          + a2 * sin(TAU * 2 * f * t)    // octava\n' +
          '          + a3 * sin(TAU * 3 * f * t)    // octava + quinta\n' +
          '          + a4 * sin(TAU * 4 * f * t)    // dos octavas\n' +
          '          + a5 * sin(TAU * 5 * f * t);   // dos octavas + tercera\n' +
          '    return 0.25 * y;\n' +
          '}\n',
        nota: 'Esto es <em>síntesis aditiva</em>: el instrumento se construye armónico a armónico. Un ' +
          'órgano Hammond hace exactamente esto con nueve tiradores, uno por armónico.'
      });
    }
  });

  p.comprueba('Un sonido tiene componentes a 300, 600, 900 y 1200 Hz. ¿A qué nota suena?', [
    { t: 'A 300 Hz: la fundamental, de la que los demás son múltiplos', ok: true, por: 'Todas son múltiplos de 300: la onda se repite 300 veces por segundo, y eso es lo que el oído toma como altura. Los demás son los armónicos 2, 3 y 4, y solo cambian el timbre.' },
    { t: 'A cuatro notas a la vez: un acorde', ok: false, por: 'Serían cuatro notas si no fueran múltiplos de una misma frecuencia. Al serlo, la onda tiene un solo periodo, $1/300$ s, y se oye una sola nota con timbre.' },
    { t: 'A 750 Hz: la media', ok: false, por: 'La altura no es una media de las componentes: es el periodo común, que es el de la más grave, 300 Hz.' }
  ]);

  p.ejemplo({
    title: 'Los primeros términos de una cuadrada',
    enunciado: 'Escribir los tres primeros armónicos no nulos de una onda cuadrada de 100 Hz y amplitud 1, y comprobar la suma en $t = \\frac{1}{400}$ s, que es un cuarto de periodo.',
    pasos: [
      { t: '<strong>Qué armónicos hay.</strong> Solo los impares: $k = 1, 3, 5$, a 100, 300 y 500 Hz. Los pares no aparecen en la cuadrada.', antes: '¿Qué armónicos tiene una cuadrada? Mira la tabla.' },
      { t: '<strong>Las amplitudes.</strong> $a_k = \\dfrac{4}{\\pi k}$: $a_1 = \\dfrac{4}{\\pi} = 1{,}273$, $a_3 = \\dfrac{4}{3\\pi} = 0{,}424$, $a_5 = \\dfrac{4}{5\\pi} = 0{,}255$.', antes: 'Aplica la fórmula con $k = 1, 3, 5$.' },
      { t: '<strong>La suma.</strong> $y(t) \\approx 1{,}273\\operatorname{sen}(2\\pi 100 t) + 0{,}424\\operatorname{sen}(2\\pi 300 t) + 0{,}255\\operatorname{sen}(2\\pi 500 t)$.' },
      { t: '<strong>En un cuarto de periodo.</strong> $t = \\frac{1}{400}$: los argumentos son $\\frac{\\pi}{2}$, $\\frac{3\\pi}{2}$ y $\\frac{5\\pi}{2}$, con senos $1$, $-1$ y $1$. Suma: $1{,}273 - 0{,}424 + 0{,}255 = 1{,}104$.', antes: 'Calcula cada seno en $t = 1/400$. Ojo con el signo del segundo.' },
      { t: '<strong>Qué significa ese 1,104.</strong> La cuadrada vale exactamente 1 ahí. Con tres términos ya se pasa un 10 %, y con más términos no mejora en las esquinas: es el fenómeno de Gibbs, que se ve en la onda del primer sintetizador como unos «cuernos» junto a cada salto.' }
    ],
    cierre: 'La fórmula de la tabla da directamente el código: <code>4/PI * (sin(w*t) + sin(3*w*t)/3 + sin(5*w*t)/5)</code>. Con veinte términos suena a cuadrada; con infinitos, lo es.'
  });

  p.section('Gibbs, a la escucha');

  p.text('Al sumar armónicos de la sierra o de la cuadrada, la onda se acerca a la forma con esquinas, ' +
    'pero en cada salto aparece un pico que sobresale un 9 % y que no desaparece por muchos términos ' +
    'que se añadan: solo se estrecha. Es el <strong>fenómeno de Gibbs</strong>, y no es un error de ' +
    'cálculo: es la manera en que una suma de curvas suaves se acerca a algo que no lo es. En el ' +
    'sintetizador de arriba, con $N = 30$, se ve a los dos lados de cada salto. Y no se oye: el oído ' +
    'atiende al espectro, no a la forma.');

  p.note('Esa última frase es una de las ideas centrales del bloque. Dos ondas con la misma lista de ' +
    'armónicos y amplitudes <strong>suenan igual</strong> aunque su dibujo sea distinto, porque cambiar ' +
    'las fases $\\varphi_k$ cambia la forma y no el espectro. Es la ley de Ohm acústica, que enunció ' +
    'Helmholtz: el oído es un analizador de Fourier, no un osciloscopio. Por eso el corrector de los ' +
    'ejercicios de código de este bloque compara espectros y no muestras.', 'ok', 'El oído oye espectros');

  p.hist('Joseph Fourier presentó en 1807 la idea de que cualquier función periódica es una suma de ' +
    'senos, para resolver cómo se propaga el calor; la Academia de Ciencias de París tardó quince años ' +
    'en aceptarlo. Georg Ohm, el de la ley eléctrica, propuso en 1843 que el oído descompone el sonido ' +
    'en esas mismas componentes, y Hermann von Helmholtz lo demostró en 1863 con resonadores de vidrio ' +
    'sintonizados a cada armónico. Josiah Gibbs describió los picos de las esquinas en 1899, en una carta ' +
    'a la revista <em>Nature</em>, aunque Henry Wilbraham los había calculado ya en 1848 sin que nadie ' +
    'se fijara.');

  p.util('La síntesis aditiva es la de los órganos, desde los de tubos hasta el Hammond, y la que hace ' +
    'un programa de afinación al buscar la fundamental entre los armónicos de una voz. Y hay un uso ' +
    'que llevas en el bolsillo: el altavoz de un teléfono no puede reproducir las frecuencias graves de ' +
    'una voz masculina, pero el oído las «rellena» a partir de los armónicos que sí llegan —la ' +
    '<em>fundamental ausente</em>—, y por eso se entiende a quien habla. Los reproductores de música ' +
    'pequeños explotan ese truco a propósito.');

  p.trampas([
    { e: '«El armónico 3 está dos octavas arriba»', por: 'Dos octavas es $\\times 4$: el armónico 4. El 3 está a $\\times 3 = \\times 2 \\times 1{,}5$: una octava y una quinta.' },
    { e: 'Sumar senos de frecuencias cualesquiera y esperar una nota', por: 'Si no son múltiplos de una misma fundamental, la suma no es periódica: se oye un acorde o una campana, no una nota.' },
    { e: 'Sumar los armónicos con amplitud 1 todos', por: 'La suma pasa de 1 y recorta. Las amplitudes bajan con $k$: $1/k$ en la sierra, $1/k^2$ en el triángulo.' },
    { e: 'Tomar los picos de Gibbs por un fallo del ordenador', por: 'Están en las matemáticas: la suma parcial de la serie sobrepasa el salto un 9 % por muchos términos que se sumen. Y no se oyen.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La frecuencia de un armónico',
    level: 'basico',
    gen: function (r) {
      var f = r.pick([55, 82.41, 110, 130.81, 196, 220, 261.63, 330, 440]), k = r.int(2, 8);
      return { f: f, k: k, v: f * k };
    },
    ask: function (d) { return 'La fundamental de una nota es $' + U.fmt(d.f, 2) + '$ Hz. ¿A qué frecuencia está su armónico $' + d.k + '$? (dos decimales)'; },
    fields: [{ name: 'v', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.f * d.k, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.f * Math.pow(2, d.k - 1)) < 0.01 && d.k > 2; }, msg: function (v, d) { return 'Los armónicos son múltiplos, $k \\cdot f$, no potencias de 2. El armónico ' + d.k + ' está a ' + d.k + ' veces la fundamental.'; } }],
    hint: function () { return 'El armónico $k$ está a $k$ veces la fundamental.'; },
    steps: function (d) { return ['$' + d.k + ' \\cdot ' + U.fmt(d.f, 2) + ' = ' + U.fmt(d.v, 2) + '$ Hz.']; },
    answer: function (d) { return U.fmt(d.v, 2) + ' Hz'; }
  });

  p.exercise({
    title: 'Qué intervalo es',
    level: 'basico',
    gen: function (r) {
      var k = r.pick([2, 3, 4, 5, 6, 8]);
      var res = { 2: 'oct', 3: 'oct5', 4: 'oct2', 5: 'oct2m3', 6: 'oct2q', 8: 'oct3' }[k];
      return { k: k, res: res };
    },
    ask: function (d) { return '¿Qué intervalo hay entre la fundamental y su armónico $' + d.k + '$?'; },
    fields: [{ name: 'q', label: 'Intervalo', opts: [{ t: 'una octava', v: 'oct' }, { t: 'una octava y una quinta', v: 'oct5' }, { t: 'dos octavas', v: 'oct2' }, { t: 'dos octavas y una tercera mayor', v: 'oct2m3' }, { t: 'dos octavas y una quinta', v: 'oct2q' }, { t: 'tres octavas', v: 'oct3' }] }],
    sol: function (d) { return { q: d.res }; },
    hint: function () { return 'Descompón $k$ en factores 2 (octavas) y lo que quede: $3/2$ es una quinta, $5/4$ una tercera mayor.'; },
    steps: function (d) { return [{ 2: '$2 = 2$: una octava.', 3: '$3 = 2 \\cdot \\frac{3}{2}$: una octava y una quinta.', 4: '$4 = 2^2$: dos octavas.', 5: '$5 = 4 \\cdot \\frac{5}{4}$: dos octavas y una tercera mayor.', 6: '$6 = 4 \\cdot \\frac{3}{2}$: dos octavas y una quinta.', 8: '$8 = 2^3$: tres octavas.' }[d.k]]; },
    answer: function (d) { return { oct: 'una octava', oct5: 'octava y quinta', oct2: 'dos octavas', oct2m3: 'dos octavas y tercera mayor', oct2q: 'dos octavas y quinta', oct3: 'tres octavas' }[d.res]; }
  });

  p.exercise({
    title: 'La amplitud de un término',
    level: 'medio',
    gen: function (r) {
      var forma = r.pick(['sierra', 'cuadrada', 'triangulo']), k = forma === 'sierra' ? r.int(2, 9) : r.pick([3, 5, 7, 9]);
      var a = forma === 'sierra' ? 2 / (Math.PI * k) : (forma === 'cuadrada' ? 4 / (Math.PI * k) : 8 / (Math.PI * Math.PI * k * k));
      return { forma: forma, k: k, a: a };
    },
    ask: function (d) { return 'En la serie de Fourier de una onda ' + (d.forma === 'triangulo' ? 'triángulo' : d.forma) + ' de amplitud 1, ¿cuánto vale la amplitud del armónico $' + d.k + '$? (cuatro decimales)'; },
    fields: [{ name: 'a', label: 'amplitud', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.a, 8) }; },
    dec: 4,
    hint: function () { return 'Sierra: $\\frac{2}{\\pi k}$. Cuadrada: $\\frac{4}{\\pi k}$ (solo impares). Triángulo: $\\frac{8}{\\pi^2 k^2}$ (solo impares).'; },
    steps: function (d) { return [{ sierra: '$\\dfrac{2}{\\pi\\cdot ' + d.k + '} = ' + U.fmt(d.a, 4) + '$', cuadrada: '$\\dfrac{4}{\\pi\\cdot ' + d.k + '} = ' + U.fmt(d.a, 4) + '$', triangulo: '$\\dfrac{8}{\\pi^2\\cdot ' + d.k + '^2} = ' + U.fmt(d.a, 4) + '$' }[d.forma]]; },
    answer: function (d) { return U.fmt(d.a, 4); }
  });

  p.exercise({
    title: 'Encontrar la fundamental',
    level: 'medio',
    gen: function (r) {
      var f = r.pick([100, 110, 150, 200, 220, 250, 300]), ks = r.shuffle([2, 3, 4, 5, 6]).slice(0, 3).sort(function (a, b) { return a - b; });
      return { f: f, lista: ks.map(function (k) { return k * f; }) };
    },
    ask: function (d) { return 'Un sonido tiene armónicos a $' + d.lista.join('$, $') + '$ Hz, y se sabe que son armónicos consecutivos o no de una misma fundamental, que no está en la lista. ¿Cuál es la fundamental más alta posible?'; },
    fields: [{ name: 'f', label: 'Hz', w: 'tiny' }],
    sol: function (d) { return { f: d.f }; },
    dec: 0,
    hint: function () { return 'La fundamental divide a todas las frecuencias de la lista: es su máximo común divisor.'; },
    steps: function (d) { return ['$\\operatorname{mcd}(' + d.lista.join(', ') + ') = ' + d.f + '$.', 'Los armónicos de la lista son el ' + d.lista.map(function (x) { return x / d.f; }).join(', el ') + '. Es la fundamental ausente: el oído la oye aunque no esté.']; },
    answer: function (d) { return d.f + ' Hz'; }
  });

  p.exercise({
    title: 'Escribe la cuadrada',
    level: 'avanzado',
    gen: function (r) {
      var f = r.pick([110, 165, 220, 330]);
      return { f: f, ref: '0.4 * (sin(TAU * ' + f + ' * t) + sin(TAU * 3 * ' + f + ' * t) / 3 + sin(TAU * 5 * ' + f + ' * t) / 5)' };
    },
    ask: function (d) {
      return 'Escribe la suma de los <strong>tres primeros armónicos impares</strong> de una cuadrada de <strong>' + d.f + ' Hz</strong>, con amplitudes $1$, $\\frac{1}{3}$ y $\\frac{1}{5}$, todo multiplicado por 0,4:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: '0.4 * (sin(...) + sin(...) / 3 + sin(...) / 5)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 0.6 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (r.espectro < 0.9) return { ok: false, msg: 'El espectro no es el pedido: tiene que haber rayas en ' + d.f + ', ' + (3 * d.f) + ' y ' + (5 * d.f) + ' Hz, con amplitudes 1, 1/3 y 1/5.' };
        return { ok: false, msg: 'Las frecuencias están, pero el nivel no: multiplica toda la suma por 0,4.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['Los armónicos impares están a $' + d.f + '$, $' + (3 * d.f) + '$ y $' + (5 * d.f) + '$ Hz.', 'Cada uno se divide por su $k$, y la suma entera se multiplica por 0,4.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'Con un bucle sale más corto: <code>var y = 0; for (var k = 1; k <= 5; k += 2) y += sin(TAU * k * ' + d.f + ' * t) / k; return 0.4 * y;</code>']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Una nota es una suma de senos a $f, 2f, 3f, \\ldots$: la fundamental y sus armónicos. Las amplitudes son el timbre; la fundamental, la altura.',
    'Sierra: todos los armónicos, $\\frac{2}{\\pi k}$. Cuadrada: impares, $\\frac{4}{\\pi k}$. Triángulo: impares, $\\frac{8}{\\pi^2 k^2}$.',
    'El armónico 2 es la octava; el 3, octava y quinta; el 4, dos octavas; el 5, dos octavas y tercera mayor.',
    'El oído oye el espectro, no la forma: cambiar las fases cambia el dibujo y no el sonido.',
    'Gibbs: la suma de armónicos sobrepasa las esquinas un 9 % por muchos términos que se añadan, y no se oye.'
  ]);
});
