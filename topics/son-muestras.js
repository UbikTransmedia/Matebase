/* Tema: Muestrear: de la curva a la lista de números */
Course.topic('son-muestras', function (p) {

  p.puente('En [[son-onda]] el sonido era una función continua $y(t)$, con un valor en cada instante. ' +
    'Un ordenador no puede guardar eso: guarda listas de números. La [[fn-sucesiones|sucesión]] es la ' +
    'herramienta, y el [[ar-decimales|redondeo]] la trampa. Este tema cuenta cómo se pasa de la curva ' +
    'a la lista, cuántos números hacen falta y qué se oye cuando faltan.');

  p.section('Una función hecha lista');

  p.text('El motor de este bloque no evalúa la función en todos los instantes, porque son infinitos. ' +
    'La evalúa en instantes igualmente espaciados, <strong>44 100 veces por segundo</strong>, y ' +
    'guarda los resultados en una lista. Cada número de esa lista es una <strong>muestra</strong>, y el ' +
    'número de muestras por segundo es la <strong>frecuencia de muestreo</strong> $f_s$.');

  p.formula('y_n = y\\!\\left(\\frac{n}{f_s}\\right), \\qquad n = 0, 1, 2, \\ldots', 'muestrear es evaluar en una sucesión de instantes',
    'Se lee: <em>«la muestra ene es el valor de la función en el instante ene partido por efe sub ' +
      'ese»</em>.<br><br>Con $f_s = 44\\,100$, la muestra 0 es $y(0)$, la muestra 1 es ' +
      '$y(0{,}0000227)$, la 44 100 es $y(1)$. Es una [[fn-sucesiones|sucesión]] de las de siempre, ' +
      '$y_n$, definida a partir de una función. Y en el código, el segundo argumento de ' +
      '<code>function sonido(t, i)</code> es justo ese $n$: el número de muestra.');

  p.demo({
    title: 'Los puntos y la curva',
    intro: 'Un seno y sus muestras. Baja la frecuencia de muestreo y mira cómo los puntos van perdiendo la forma de la curva; sube la del seno y verás que, con pocos puntos por oscilación, la curva que se dibuja entre ellos ya no es la que había.',
    predice: 'Con $f = 1000$ Hz y $f_s = 8000$ muestras/s hay 8 puntos por oscilación. Si dejas $f_s$ y subes $f$ a 7000, ¿qué dibujarán los puntos: un seno de 7000 Hz o algo mucho más lento?',
    build: function (host) {
      var f = 1000, fs = 8000;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 0.004, ymin: -1.3, ymax: 1.3, height: 280, xlabel: 't (s)',
        aria: 'Un seno continuo y, encima, los puntos en los que se muestrea; con pocas muestras por oscilación los puntos dibujan otra curva más lenta',
        draw: function (g) {
          g.fn(function (t) { return Math.sin(2 * Math.PI * f * t); }, { color: 0, w: 1.6, alpha: 0.55 });
          var n = Math.floor(0.004 * fs), pts = [];
          for (var i = 0; i <= n; i++) pts.push([i / fs, Math.sin(2 * Math.PI * f * i / fs)]);
          // la curva que "se ve" entre los puntos: el alias
          var fa = f - fs * Math.round(f / fs);
          g.fn(function (t) { return Math.sin(2 * Math.PI * fa * t); }, { color: 2, w: 2.2, dash: true });
          pts.forEach(function (q) { g.seg(q[0], 0, q[0], q[1], { color: 1, w: 1.2, alpha: 0.6 }); g.point(q[0], q[1], { color: 1, r: 4 }); });
        }
      });
      function pinta() {
        var porOsc = fs / f, fa = Math.abs(f - fs * Math.round(f / fs));
        out.set('$f = ' + f + '$ Hz, $f_s = ' + fs + '$ muestras/s: <strong>' + U.fmt(porOsc, 2) + '</strong> muestras por oscilación.<br>' +
          (f < fs / 2 ? 'Más de dos por oscilación: los puntos bastan para reconstruir el seno.'
            : '<strong style="color:var(--bad)">Menos de dos por oscilación:</strong> los puntos dibujan un seno de $' + U.fmt(fa, 0) + '$ Hz que no estaba ahí. Es el <em>aliasing</em>.'));
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'frecuencia del seno f (Hz)', min: 100, max: 9000, step: 100, value: f, on: function (v) { f = v; pinta(); } });
      W.slider(fila, { label: 'muestras por segundo fs', min: 1000, max: 16000, step: 500, value: fs, on: function (v) { fs = v; pinta(); } });
      W.legend(host, [{ c: 0, t: 'el seno de verdad' }, { c: 1, t: 'las muestras' }, { c: 2, t: 'lo que los puntos dibujan' }]);
      pinta();
    }
  });

  p.section('Cuántas hacen falta: el teorema del muestreo');

  p.formula('f < \\frac{f_s}{2}', 'la condición de Nyquist',
    'Se lee: <em>«la frecuencia del sonido tiene que ser menor que la mitad de la frecuencia de ' +
      'muestreo»</em>. Dicho al revés: para guardar un tono de $f$ hercios hacen falta más de $2f$ ' +
      'muestras por segundo, <strong>más de dos por oscilación</strong>.<br><br>Por eso los discos ' +
      'compactos usan 44 100: el oído llega a 20 000 Hz, el doble son 40 000, y el resto es margen. ' +
      'Con 44 100 muestras por segundo, cualquier sonido audible cabe en la lista sin perder nada.');

  p.text('Lo sorprendente es la palabra «nada». No es que con muchas muestras la curva se aproxime bien: ' +
    'es que, si se cumple la condición, <strong>la curva se reconstruye exactamente</strong> a partir ' +
    'de los puntos. Entre dos muestras solo cabe una curva hecha de senos por debajo de $f_s/2$, y el ' +
    'reproductor la recupera entera. Es el teorema de Nyquist-Shannon, y es la razón de que el sonido ' +
    'digital funcione.');

  p.text('Y lo que pasa cuando no se cumple tiene nombre: <strong>aliasing</strong>, «suplantación». Un ' +
    'tono por encima de $f_s/2$ no desaparece: <em>se disfraza</em> de otro más grave, el que dibujan los ' +
    'puntos. Un seno de 30 000 Hz muestreado a 44 100 aparece como uno de $44\\,100 - 30\\,000 = 14\\,100$ Hz, ' +
    'y no hay manera de distinguirlo después de un seno de 14 100 de verdad.');

  p.demo({
    title: 'El tono que se disfraza',
    intro: 'El motor calcula 44 100 muestras por segundo. Sube la frecuencia más allá de 22 050 y escucha: el tono, en vez de seguir subiendo hasta desaparecer, vuelve a bajar. Mira dónde aparece la raya en el espectro.',
    predice: 'Con $f = 30\\,000$ Hz, ¿en qué frecuencia saldrá la raya del espectro? Calcula $44\\,100 - 30\\,000$ antes de mover el mando.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-muestras-1', dur: 1, ventana: 5, fmax: 22050,
        mandos: [{ n: 'f', label: 'frecuencia pedida f (Hz)', min: 1000, max: 44000, step: 100, value: 18000, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    return 0.4 * sin(TAU * f * t);\n' +
          '}\n',
        nota: 'Entre 22 050 y 44 100 el tono que se oye es $44\\,100 - f$: baja mientras el mando sube. ' +
          'Cerca de 44 100 se oye casi grave, porque las muestras caen siempre casi en el mismo punto ' +
          'de cada oscilación. El sonido de 44 000 Hz existe en la fórmula, pero la lista no lo puede guardar.'
      });
    }
  });

  p.comprueba('Se muestrea a 44 100 muestras por segundo un tono de 26 100 Hz. ¿Qué se oye?', [
    { t: 'Nada: está por encima del límite del oído', ok: false, por: 'Estaría fuera del oído si se guardara bien, pero no se guarda bien: 26 100 supera $f_s/2 = 22\\,050$, así que se disfraza de otro tono, y ese sí se oye.' },
    { t: 'Un tono de 18 000 Hz', ok: true, por: 'Es el alias: $44\\,100 - 26\\,100 = 18\\,000$ Hz. Los puntos dibujan esa curva, y el reproductor reconstruye esa, no la original.' },
    { t: 'Un tono de 26 100 Hz, pero más flojo', ok: false, por: 'La lista no puede contener nada por encima de 22 050 Hz: no es que se atenúe, es que cambia de frecuencia.' }
  ]);

  p.hist('Harry Nyquist enunció la condición en 1928 en los laboratorios Bell, pensando en cuántos ' +
    'pulsos por segundo cabían en una línea de telégrafo, y Claude Shannon la demostró en 1949 dentro ' +
    'de su teoría de la información. El disco compacto, que la puso en cada casa, se fijó en 44 100 ' +
    'por una razón de fontanería: en 1979 la única manera de grabar tantos números por segundo era en ' +
    'cinta de vídeo, y 44 100 era el número que encajaba en las líneas de la imagen de televisión. Cuarenta ' +
    'años después, el estándar sigue siendo el que cabía en un vídeo.');

  p.section('Cuántos decimales: la cuantización');

  p.text('Cada muestra tampoco es un número real: se guarda con un número fijo de <strong>bits</strong>. ' +
    'Con $b$ bits hay $2^b$ valores posibles entre $-1$ y $1$, y la muestra se redondea al más cercano. ' +
    'Un CD usa 16 bits: 65 536 escalones, cada uno de $\\frac{2}{65\\,536} \\approx 0{,}00003$. El error ' +
    'de redondear es como mucho medio escalón, y ese error, que cambia en cada muestra, <strong>se oye ' +
    'como un ruido</strong> de fondo.');

  p.formula('\\text{escalón} = \\frac{2}{2^{b}}, \\qquad \\text{relación señal-ruido} \\approx 6\\,b \\text{ decibelios}', 'lo que cuesta cada bit',
    'Con cada bit de más los escalones se parten por la mitad y el ruido de redondeo baja unos 6 ' +
      'decibelios, la mitad de amplitud. A 16 bits el ruido está unos 96 dB por debajo de la señal: no ' +
      'se oye. A 8 bits, 48 dB: se oye como un siseo. A 4 bits, el sonido está hecho de escalones que ' +
      'se notan.');

  p.demo({
    title: 'Oír los escalones',
    intro: 'El mismo seno, redondeado a b bits antes de salir. Baja los bits y escucha aparecer el ruido; mira en la onda cómo la curva se vuelve una escalera.',
    predice: 'Con 3 bits hay $2^3 = 8$ valores posibles. ¿Cuántos escalones distintos verás en la onda? ¿Y crees que seguirá sonando a la misma nota?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-muestras-2', dur: 1, ventana: 10,
        mandos: [{ n: 'b', label: 'bits por muestra', min: 2, max: 16, step: 1, value: 4, dec: 0 }],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.8 * sin(TAU * 440 * t);\n' +
          '    // 2^(b-1) escalones a cada lado del cero: se redondea al más cercano\n' +
          '    var n = pow(2, b - 1);\n' +
          '    return round(x * n) / n;\n' +
          '}\n',
        nota: 'La nota no cambia: los escalones añaden ruido, no altura. En el espectro se ve como una ' +
          'alfombra de rayitas pequeñas debajo de la raya grande. Con 16 bits la alfombra desaparece.'
      });
    }
  });

  p.ejemplo({
    title: 'Cuánto ocupa una canción',
    enunciado: 'Una canción de 3 minutos en calidad de CD: 44 100 muestras por segundo, 16 bits por muestra, dos canales (estéreo). ¿Cuántas muestras tiene y cuántos megabytes ocupa sin comprimir?',
    pasos: [
      { t: '<strong>Segundos.</strong> $3 \\cdot 60 = 180$ s.' },
      { t: '<strong>Muestras por canal.</strong> $180 \\cdot 44\\,100 = 7\\,938\\,000$.', antes: '¿Cuántas muestras por segundo, y cuántos segundos?' },
      { t: '<strong>Los dos canales.</strong> $2 \\cdot 7\\,938\\,000 = 15\\,876\\,000$ muestras: casi dieciséis millones de números.' },
      { t: '<strong>Bytes.</strong> 16 bits son 2 bytes por muestra: $15\\,876\\,000 \\cdot 2 = 31\\,752\\,000$ bytes.', antes: '¿Cuántos bytes ocupa cada muestra de 16 bits?' },
      { t: '<strong>Megabytes.</strong> $\\frac{31\\,752\\,000}{1\\,000\\,000} \\approx 31{,}8$ MB. Por eso un CD de 700 MB cabe unos 70 minutos, y por eso existen el MP3 y sus sucesores: para que esos 32 MB se queden en 3.' }
    ],
    cierre: 'Tres minutos de música son dieciséis millones de números. El motor de este bloque calcula 44 100 por segundo de sonido, exactamente como un CD, y la fórmula del tema anterior los produce uno a uno.'
  });

  p.util('Muestrear no es cosa solo del sonido. Una foto digital es una función de dos variables ' +
    'muestreada en píxeles, y las rayas raras que aparecen al fotografiar una camisa de cuadros finos ' +
    'son aliasing: el patrón tiene más detalle del que caben en los píxeles. Un electrocardiograma, la ' +
    'cotización de una acción cada segundo, la temperatura cada hora en una estación meteorológica: ' +
    'listas de muestras de una función continua, con la misma pregunta de siempre, ¿son bastantes? La ' +
    'condición de Nyquist es la respuesta en todos los casos.');

  p.trampas([
    { e: '«Con más muestras se oye mejor, sin límite»', por: 'Por encima de $2f$ ya no se gana nada: la curva se reconstruye exacta. Lo que mejora el sonido a partir de ahí son los bits, no las muestras.' },
    { e: 'Confundir bits con muestras por segundo', por: 'Son dos cosas distintas: cuántos números por segundo (frecuencia de muestreo, decide hasta qué agudo se guarda) y cuántos decimales tiene cada número (bits, decide el ruido de fondo).' },
    { e: 'Creer que un tono por encima de $f_s/2$ desaparece', por: 'Se disfraza de uno más grave, $f_s - f$, y ese sí se oye. El aliasing no quita: cambia.' },
    { e: 'Dar por hecho que la muestra $n$ es el segundo $n$', por: 'La muestra $n$ es el instante $n / f_s$. La muestra 44 100 es el segundo 1.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántas muestras',
    level: 'basico',
    gen: function (r) {
      var dur = r.pick([0.5, 1, 1.5, 2, 3, 5, 10]), fs = r.pick([8000, 22050, 44100, 48000]);
      return { dur: dur, fs: fs, n: dur * fs };
    },
    ask: function (d) { return 'Un sonido de $' + U.fmt(d.dur, 1) + '$ segundos se guarda con $' + U.miles(d.fs) + '$ muestras por segundo. ¿Cuántas muestras tiene la lista?'; },
    fields: [{ name: 'n', label: 'muestras', w: 'wide' }],
    sol: function (d) { return { n: d.n }; },
    dec: 0,
    hint: function () { return 'Muestras por segundo por segundos.'; },
    steps: function (d) { return ['$' + U.fmt(d.dur, 1) + ' \\cdot ' + U.miles(d.fs) + ' = ' + U.miles(d.n) + '$ muestras.']; },
    answer: function (d) { return U.miles(d.n); }
  });

  p.exercise({
    title: 'En qué instante cae una muestra',
    level: 'basico',
    gen: function (r) {
      var fs = r.pick([8000, 44100, 48000]), n = r.pick([100, 441, 1000, 2205, 4410, 8000, 22050, 24000]);
      return { fs: fs, n: n, t: 1000 * n / fs };
    },
    ask: function (d) { return 'Con $f_s = ' + U.miles(d.fs) + '$ muestras por segundo, ¿en qué instante, en milisegundos, se toma la muestra número $' + U.miles(d.n) + '$? (tres decimales)'; },
    fields: [{ name: 't', label: 't (ms)', w: 'wide' }],
    sol: function (d) { return { t: U.round(d.t, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.t - d.n / d.fs) < 1e-6 && d.t !== d.n / d.fs; }, msg: 'Eso son segundos: multiplica por 1000 para tener milisegundos.' }],
    hint: function () { return '$t = n / f_s$ segundos, y luego a milisegundos.'; },
    steps: function (d) { return ['$t = \\dfrac{' + U.miles(d.n) + '}{' + U.miles(d.fs) + '} = ' + U.fmt(d.n / d.fs, 6) + '$ s $= ' + U.fmt(d.t, 3) + '$ ms.']; },
    answer: function (d) { return U.fmt(d.t, 3) + ' ms'; }
  });

  p.exercise({
    title: 'El alias',
    level: 'medio',
    gen: function (r) {
      var fs = r.pick([8000, 22050, 44100, 48000]);
      var f = fs / 2 + r.int(1, 40) * (fs / 100);
      f = Math.round(f);
      if (f >= fs) return null;
      if (Math.abs((fs - f) - (f - fs / 2)) < 1) return null;   // a 3fs/4 el alias coincide con el error tipico
      return { fs: fs, f: f, alias: fs - f };
    },
    ask: function (d) { return 'Se muestrea a $f_s = ' + U.miles(d.fs) + '$ muestras por segundo un tono de $' + U.miles(d.f) + '$ Hz, que supera $f_s/2$. ¿A qué frecuencia, en hercios, se oirá?'; },
    fields: [{ name: 'a', label: 'frecuencia oída (Hz)', w: 'wide' }],
    sol: function (d) { return { a: d.alias }; },
    dec: 0,
    errores: [
      { si: function (v, d) { return Math.abs(v.a - d.f) < 0.5; }, msg: 'Con menos de dos muestras por oscilación no se guarda esa frecuencia: los puntos dibujan otra.' },
      { si: function (v, d) { return Math.abs(v.a - (d.f - d.fs / 2)) < 0.5; }, msg: 'El tono se refleja en $f_s/2$, no se mide desde ahí: el alias es $f_s - f$.' }
    ],
    hint: function () { return 'Entre $f_s/2$ y $f_s$, el tono que dibujan las muestras es $f_s - f$.'; },
    steps: function (d) { return ['$f = ' + U.miles(d.f) + ' > f_s/2 = ' + U.miles(d.fs / 2) + '$: hay menos de dos muestras por oscilación.', 'Alias: $' + U.miles(d.fs) + ' - ' + U.miles(d.f) + ' = ' + U.miles(d.alias) + '$ Hz.']; },
    answer: function (d) { return U.miles(d.alias) + ' Hz'; }
  });

  p.exercise({
    title: 'Escalones y bits',
    level: 'medio',
    gen: function (r) {
      var b = r.pick([3, 4, 5, 6, 8, 10, 12]);
      return { b: b, niveles: Math.pow(2, b), paso: 2 / Math.pow(2, b) };
    },
    ask: function (d) { return 'Las muestras se guardan con $' + d.b + '$ bits. ¿Cuántos valores distintos puede tomar una muestra, y cuánto mide cada escalón entre $-1$ y $1$? (el escalón con cuatro decimales)'; },
    fields: [{ name: 'n', label: 'valores', w: 'tiny' }, { name: 'p', label: 'escalón', w: 'wide' }],
    sol: function (d) { return { n: d.niveles, p: U.round(d.paso, 8) }; },
    dec: { n: 0, p: 4 },
    errores: [{ si: function (v, d) { return Math.abs(v.n - 2 * d.b) < 0.5; }, msg: 'Con $b$ bits hay $2^b$ combinaciones, no $2b$: cada bit dobla las posibilidades.' }],
    hint: function () { return ['$b$ bits dan $2^b$ valores.', 'El intervalo de $-1$ a $1$ mide 2, y se reparte en $2^b$ escalones.']; },
    steps: function (d) { return ['$2^{' + d.b + '} = ' + U.miles(d.niveles) + '$ valores.', 'Escalón: $\\dfrac{2}{' + U.miles(d.niveles) + '} = ' + U.fmt(d.paso, 4) + '$.', 'El error de redondeo es como mucho la mitad: $' + U.fmt(d.paso / 2, 4) + '$.']; },
    answer: function (d) { return U.miles(d.niveles) + ' valores, escalón ' + U.fmt(d.paso, 4); }
  });

  p.exercise({
    title: 'El tamaño de un archivo',
    level: 'avanzado',
    gen: function (r) {
      var min = r.int(1, 6), seg = r.pick([0, 15, 30, 45]), fs = r.pick([44100, 48000]), bits = r.pick([16, 24]), can = r.pick([1, 2]);
      var dur = min * 60 + seg, muestras = dur * fs * can, bytes = muestras * bits / 8;
      return { min: min, seg: seg, fs: fs, bits: bits, can: can, dur: dur, muestras: muestras, MB: bytes / 1e6 };
    },
    ask: function (d) {
      return 'Una grabación de $' + d.min + '$ min $' + d.seg + '$ s, a $' + U.miles(d.fs) + '$ muestras por segundo, $' + d.bits + '$ bits por muestra y ' + (d.can === 2 ? 'dos canales (estéreo)' : 'un canal (mono)') + '. ¿Cuántos megabytes ocupa sin comprimir? (un megabyte son 1 000 000 de bytes; dos decimales)';
    },
    fields: [{ name: 'mb', label: 'MB', w: 'wide' }],
    sol: function (d) { return { mb: U.round(d.MB, 6) }; },
    dec: 2,
    errores: [
      { si: function (v, d) { return Math.abs(v.mb - d.MB * 8) < 0.02; }, msg: 'Eso son megabits. Un byte son 8 bits: divide entre 8.' },
      { si: function (v, d) { return d.can === 2 && Math.abs(v.mb - d.MB / 2) < 0.02; }, msg: 'Falta el segundo canal: el estéreo guarda dos listas.' }
    ],
    hint: function () { return ['Muestras = segundos × muestras por segundo × canales.', 'Bytes = muestras × bits / 8. Y un MB son un millón de bytes.']; },
    steps: function (d) { return ['Duración: $' + d.dur + '$ s. Muestras: $' + d.dur + ' \\cdot ' + U.miles(d.fs) + ' \\cdot ' + d.can + ' = ' + U.miles(d.muestras) + '$.', 'Bytes: $' + U.miles(d.muestras) + ' \\cdot ' + d.bits + ' / 8 = ' + U.miles(d.muestras * d.bits / 8) + '$.', '$\\approx ' + U.fmt(d.MB, 2) + '$ MB.']; },
    answer: function (d) { return U.fmt(d.MB, 2) + ' MB'; }
  });

  p.keys([
    'Muestrear es evaluar la función en una sucesión de instantes: $y_n = y(n/f_s)$, con $f_s = 44\\,100$ en un CD.',
    'Condición de Nyquist: hacen falta más de dos muestras por oscilación, $f < f_s/2$; con eso la curva se reconstruye <strong>exacta</strong>.',
    'Por encima de $f_s/2$ el tono no desaparece: se disfraza de $f_s - f$. Es el aliasing.',
    'Los bits son los decimales de cada muestra: $2^b$ valores, y el error de redondeo suena como un ruido que baja 6 dB por bit.',
    'Tres minutos de CD son dieciséis millones de números: 32 MB.'
  ]);
});
