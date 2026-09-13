/* Tema: Filtros: quitar frecuencias */
Course.topic('son-filtros', function (p) {

  p.puente('Sumar senos construye un timbre; <strong>filtrar</strong> es lo contrario: partir de un ' +
    'sonido rico y quitarle parte del [[son-espectro|espectro]]. La herramienta es sorprendentemente ' +
    'modesta: una <em>media</em>. Una media entre la muestra actual y la anterior atenúa los agudos, ' +
    'y si la media recuerda su propio resultado, se convierte en una [[fn-sucesiones|sucesión ' +
    'recurrente]] que suena. Es la primera vez en el bloque que un sonido se calcula a partir de lo que ' +
    'sonó antes.');

  p.section('Una media que quita agudos');

  p.text('Toma una lista de muestras y sustituye cada una por la media de ella y la anterior. Si la ' +
    'señal cambia despacio (un tono grave), dos muestras consecutivas son casi iguales y la media ' +
    'no la toca. Si cambia deprisa (un tono agudo), las muestras consecutivas se parecen poco, o ' +
    'incluso tienen signo contrario, y la media las aplasta. La misma cuenta trata distinto a cada ' +
    'frecuencia: eso es un <strong>filtro</strong>.');

  p.formula('y_n = \\frac{x_n + x_{n-1}}{2}', 'la media de dos: un filtro de paso bajo',
    'Se lee: <em>«i sub ene es la media de equis sub ene y equis sub ene menos uno»</em>. $x$ es la ' +
      'entrada y $y$ la salida. Se llama <strong>de paso bajo</strong> porque deja pasar las ' +
      'frecuencias bajas y frena las altas. En el sintetizador, como la entrada es una función del ' +
      'tiempo, la muestra anterior de la entrada es simplemente $x(t - 1/f_s)$: la función evaluada ' +
      'una muestra antes.');

  p.formula('|H(f)| = \\left|\\cos\\!\\left(\\frac{\\pi f}{f_s}\\right)\\right|', 'cuánto deja pasar la media de dos a cada frecuencia',
    'Se lee: <em>«módulo de hache de efe es el valor absoluto del coseno de pi efe partido por efe ' +
      'sub ese»</em>. Es la <strong>respuesta en frecuencia</strong>: por cuánto multiplica el ' +
      'filtro a un seno de frecuencia $f$. A $f = 0$ vale 1 (no toca los graves); a $f = f_s/2$ vale ' +
      '$\\cos(\\pi/2) = 0$: la frecuencia más alta posible, que va $+1, -1, +1, -1$, se anula del ' +
      'todo, porque la media de $+1$ y $-1$ es cero. Sale de la identidad de la suma de senos del ' +
      '[[son-batidos|tema de los batidos]]: dos senos desplazados una muestra suman un seno ' +
      'multiplicado por el coseno de la mitad del desfase.');

  p.demo({
    title: 'La respuesta en frecuencia de la media',
    intro: 'La curva dice cuánto deja pasar el filtro a cada frecuencia. Mueve el seno de prueba: arriba, la entrada y la salida del filtro superpuestas; el readout, la razón entre sus amplitudes, que debe coincidir con la curva.',
    predice: 'A 11 025 Hz (un cuarto de $f_s$), ¿la media de dos dejará pasar el 100 %, el 71 % o el 0 %? Calcula $\\cos(\\pi/4)$.',
    build: function (host) {
      var fs = 44100, f = 5000;
      var out = W.readout(host, '');
      var pr = W.plot(host, {
        xmin: 0, xmax: 22050, ymin: 0, ymax: 1.1, height: 170, xlabel: 'f (Hz)', ylabel: '|H|',
        aria: 'La respuesta en frecuencia de la media de dos muestras: un coseno que baja de uno a cero entre cero y la mitad de la frecuencia de muestreo',
        draw: function (g) {
          g.fn(function (x) { return Math.abs(Math.cos(Math.PI * x / fs)); }, { color: 0, w: 2 });
          g.vline(f, { color: 1, dash: true });
          g.point(f, Math.abs(Math.cos(Math.PI * f / fs)), { color: 1, r: 5 });
        }
      });
      var ps = W.plot(host, {
        xmin: 0, xmax: 12, ymin: -1.3, ymax: 1.3, height: 150, xlabel: 'muestra n',
        aria: 'Doce muestras de un seno de prueba y, encima, las muestras filtradas por la media de dos, más bajas cuanto más aguda es la frecuencia',
        draw: function (g) {
          var xs = [], ys = [];
          for (var n = 0; n <= 12; n++) xs.push(Math.sin(2 * Math.PI * f * n / fs));
          for (n = 0; n <= 12; n++) ys.push(n ? (xs[n] + xs[n - 1]) / 2 : xs[0] / 2);
          for (n = 0; n <= 12; n++) {
            g.seg(n, 0, n, xs[n], { color: 0, w: 1.4 });
            g.point(n, xs[n], { color: 0, r: 4 });
            g.point(n + 0.15, ys[n], { color: 1, r: 4 });
          }
        }
      });
      W.legend(host, [{ c: 0, t: 'entrada x' }, { c: 1, t: 'salida y (media de dos)' }]);
      function pinta() {
        var H = Math.abs(Math.cos(Math.PI * f / fs));
        out.set('A $' + U.miles(f) + '$ Hz el filtro multiplica por $|\\cos(\\pi\\cdot ' + U.miles(f) + '/44\\,100)| = ' + U.fmt(H, 3) + '$: deja pasar el ' + U.fmt(100 * H, 0) + ' %.');
        pr.render(); ps.render();
      }
      W.slider(W.row(host), { label: 'frecuencia del seno de prueba (Hz)', min: 0, max: 22050, step: 50, value: f, on: function (v) { f = v; pinta(); } });
      pinta();
    }
  });

  p.section('Un filtro que se recuerda a sí mismo');

  p.text('La media de dos es suave: para quitar la mitad de un agudo hay que subir hasta un tercio ' +
    'de $f_s$. Un filtro mucho más eficaz sale de mezclar la entrada nueva con la <em>salida</em> ' +
    'anterior, no con la entrada anterior:');

  p.formula('y_n = a\\,x_n + (1 - a)\\,y_{n-1}', 'el filtro de un polo',
    'Se lee: <em>«i sub ene es a por equis sub ene más uno menos a por i sub ene menos uno»</em>. Con ' +
      '$a$ entre 0 y 1: si $a = 1$, la salida es la entrada tal cual; si $a$ es pequeño, la salida se ' +
      'mueve solo un poco hacia cada entrada nueva, y sigue a la señal con pereza: los cambios rápidos ' +
      'no le dan tiempo. Es una sucesión recurrente, cada término definido por el anterior, y en el ' +
      'sintetizador se escribe con <code>anterior()</code>, que devuelve la última muestra ' +
      'calculada.<br><br>Su respuesta cae con la frecuencia, y la frecuencia a la que ha caído a ' +
      '$1/\\sqrt 2$, la <strong>frecuencia de corte</strong>, es aproximadamente ' +
      '$f_c \\approx \\dfrac{a\\, f_s}{2\\pi}$ para $a$ pequeño. Con $a = 0{,}05$ y $f_s = 44\\,100$: ' +
      'unos 350 Hz.');

  p.demo({
    title: 'Abrir y cerrar el filtro',
    intro: 'Una sierra de 110 Hz, con todos sus armónicos, pasa por el filtro de un polo. Con $a$ pequeño el filtro está «cerrado»: solo pasa la fundamental y suena a zumbido apagado. Ábrelo y vuelven los agudos. Mira el espectro: la altura de los armónicos cae desde la frecuencia de corte.',
    predice: 'Con $a = 0{,}02$ el corte anda por $0{,}02\\cdot 44\\,100/2\\pi \\approx 140$ Hz. ¿Se oirán los armónicos de 220 y 330 Hz con claridad o apagados?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-filtros-1', dur: 1, ventana: 20, fmax: 3000,
        mandos: [{ n: 'a', label: 'a (cuánto se mueve la salida hacia la entrada)', min: 0.005, max: 1, step: 0.005, value: 0.05, dec: 3 }],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.4 * sierra(110, t);              // la entrada: todos los armónicos\n' +
          '    return a * x + (1 - a) * anterior();       // la salida: una mezcla con la anterior\n' +
          '}\n',
        nota: 'La línea del <code>return</code> es exactamente $y_n = a x_n + (1-a) y_{n-1}$. La ' +
          'primera muestra no tiene anterior: <code>anterior()</code> devuelve 0, que es la condición ' +
          'inicial de la sucesión.'
      });
    }
  });

  p.text('Si la entrada se para (un solo golpe y luego ceros), la salida va bajando por sí sola: ' +
    '$y_n = (1-a)\\,y_{n-1}$, una <em>progresión geométrica</em> de razón $1 - a$. Es la respuesta al ' +
    'impulso del filtro, y decae como $e^{-t/\\tau}$ con $\\tau = 1/(a f_s)$: un filtro es también una ' +
    'envolvente en miniatura. Y mientras $|1 - a| < 1$ la sucesión converge; si alguien pusiera ' +
    '$a < 0$ o $a > 2$, se dispararía. El sintetizador lo vigila y recorta, pero la matemática es la de ' +
    '[[fn-sucesiones]]: una recurrencia lineal converge solo si su razón está entre $-1$ y $1$.');

  p.section('Síntesis sustractiva: el filtro que se mueve');

  p.text('El sonido clásico de los sintetizadores analógicos de los años setenta es un oscilador rico ' +
    '(sierra, cuadrada) seguido de un filtro de paso bajo cuyo corte <em>se mueve</em> con una ' +
    'envolvente: abierto al principio de la nota, cerrándose después. Se llama síntesis ' +
    '<strong>sustractiva</strong> porque esculpe quitando. Y como el corte depende de $a$, basta con ' +
    'que $a$ sea una función del tiempo.');

  p.demo({
    title: 'El bajo con el filtro que se cierra',
    intro: 'Una sierra de 55 Hz y un filtro cuyo $a$ empieza alto y cae exponencialmente: el ataque es brillante y en medio segundo queda solo el fondo grave. Es el sonido de un bajo de sintetizador. La resonancia añade un poco de la salida anterior con signo cambiado para realzar el corte.',
    predice: 'Si la caída del filtro es más lenta (más segundos), ¿la nota sonará brillante más tiempo o menos?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-filtros-2', dur: 1.5, loop: false, ventana: 40, fmax: 2000,
        mandos: [
          { n: 'caida', label: 'cuánto tarda en cerrarse el filtro (s)', min: 0.05, max: 1, step: 0.05, value: 0.25, dec: 2 },
          { n: 'apertura', label: 'apertura inicial (a máximo)', min: 0.05, max: 1, step: 0.05, value: 0.6, dec: 2 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.5 * sierra(55, t) * decae(t, 1.5);\n' +
          '    var a = 0.01 + apertura * exp(-t / caida);      // el corte baja con el tiempo\n' +
          '    return a * x + (1 - a) * anterior();\n' +
          '}\n',
        nota: 'Cambia <code>sierra(55, t)</code> por <code>cuadrada(55, t)</code> y compara: la cuadrada, ' +
          'sin armónicos pares, suena más hueca. O sube la nota a 110. La forma de la envolvente del ' +
          'filtro es lo que distingue un bajo «que golpea» de uno «que se abre».'
      });
    }
  });

  p.ejemplo({
    title: 'Filtrar a mano cuatro muestras',
    enunciado: 'La entrada es $x = (1,\\ 1,\\ 1,\\ 1,\\ 0,\\ 0,\\ 0)$: un escalón que sube y baja. Aplicar el filtro de un polo con $a = 0{,}5$ partiendo de $y_{-1} = 0$, y decir hacia qué valor se acerca la salida mientras la entrada vale 1.',
    pasos: [
      { t: '<strong>La recurrencia.</strong> $y_n = 0{,}5\\,x_n + 0{,}5\\,y_{n-1}$.' },
      { t: '<strong>Subiendo.</strong> $y_0 = 0{,}5\\cdot 1 + 0{,}5\\cdot 0 = 0{,}5$; $y_1 = 0{,}5 + 0{,}25 = 0{,}75$; $y_2 = 0{,}5 + 0{,}375 = 0{,}875$; $y_3 = 0{,}5 + 0{,}4375 = 0{,}9375$.', antes: 'Calcula $y_0$ y $y_1$ con la recurrencia.' },
      { t: '<strong>El límite.</strong> Si la entrada se quedara en 1, la salida tendería al valor fijo $L$ con $L = 0{,}5 + 0{,}5L$, o sea $L = 1$: el filtro <em>alcanza</em> la entrada, pero le cuesta. La distancia que falta se divide por 2 en cada muestra.', antes: 'Si $y_n = y_{n-1} = L$, ¿qué ecuación cumple $L$?' },
      { t: '<strong>Bajando.</strong> Ahora $x = 0$: $y_4 = 0{,}5\\cdot 0{,}9375 = 0{,}469$; $y_5 = 0{,}234$; $y_6 = 0{,}117$. Una progresión geométrica de razón 0,5.' },
      { t: '<strong>Lo que significa.</strong> El escalón, que era cuadrado, sale redondeado por los dos lados: las esquinas —los agudos— se han ido. Con $a$ más pequeño se redondearía más.', antes: '¿Qué le pasa a una esquina cuando la salida no puede cambiar de golpe?' }
    ],
    cierre: 'Un filtro no es más que una sucesión recurrente aplicada a muestras. Todo lo que se sabe de sucesiones —el límite, la razón, la convergencia— se aplica a lo que suena.'
  });

  p.comprueba('En el filtro $y_n = a x_n + (1-a) y_{n-1}$, ¿qué pasa si $a$ se hace muy pequeño, digamos 0,001?', [
    { t: 'Casi no pasa nada de la entrada: solo los graves más profundos', ok: true, por: 'La salida se mueve una milésima hacia cada entrada nueva: sigue solo los cambios lentísimos. El corte queda hacia $0{,}001\\cdot 44\\,100/2\\pi \\approx 7$ Hz: por debajo de lo audible.' },
    { t: 'Pasa todo igual', ok: false, por: 'Eso sería $a = 1$: la salida es la entrada. Cuanto menor es $a$, más cerrado el filtro.' },
    { t: 'La salida se dispara', ok: false, por: 'Se dispararía con $|1 - a| > 1$, es decir, $a < 0$ o $a > 2$. Con $a = 0{,}001$ la razón es 0,999: converge, pero muy despacio.' }
  ]);

  p.hist('Los sintetizadores de Robert Moog, a partir de 1964, se hicieron famosos por su filtro: ' +
    'cuatro etapas de un polo en cascada con parte de la salida devuelta a la entrada, la ' +
    '<em>resonancia</em>, que hace que el filtro «cante» en la frecuencia de corte. Ese circuito, ' +
    'patentado en 1969, es el sonido de <em>Switched-On Bach</em>, de la música disco y de buena ' +
    'parte del pop de los ochenta, y hoy se imita con la misma recurrencia en cualquier ordenador. ' +
    'La teoría de los filtros digitales es más vieja: viene de los años cuarenta, cuando había que ' +
    'suavizar series económicas y datos de radar con medias móviles, que son exactamente esto.');

  p.util('El ecualizador de cualquier reproductor de música es un banco de filtros como estos, uno ' +
    'por banda. Los auriculares que cancelan ruido filtran y restan. Un termostato, un sensor de ' +
    'un móvil que suaviza el acelerómetro, la media móvil de una cotización en bolsa o la de los ' +
    'contagios de una epidemia son el filtro de un polo con otros nombres: mezclar el dato nuevo ' +
    'con el resultado anterior para no creerse los cambios bruscos.');

  p.trampas([
    { e: 'Confundir <code>anterior()</code> con la entrada anterior', por: '<code>anterior()</code> es la última <em>salida</em>, lo que devolvió <code>sonido</code>. La entrada anterior, como la entrada es una función, es <code>x(t - 1/SR)</code>.' },
    { e: 'Poner $a$ mayor que 1 para «abrir más»', por: 'Con $a = 1$ el filtro ya deja pasar todo. Con $a > 1$ la razón $1 - a$ es negativa y por encima de 2 se desboca.' },
    { e: 'Esperar un corte a cuchillo', por: 'Un filtro de un polo baja suavemente, seis decibelios por octava. Para cortes más bruscos se ponen varios en cascada, como hacía Moog.' },
    { e: 'Olvidar que un filtro retrasa', por: 'La salida va con pereza detrás de la entrada: un filtro cerrado retrasa el ataque de una nota, y eso también se oye.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La media de dos, a mano',
    level: 'basico',
    gen: function (r) {
      var xs = [r.pick([0, 1, -1, 0.5]), r.pick([1, -1, 0.5, 0]), r.pick([1, -1, 0, -0.5]), r.pick([0.5, 1, -1])];
      var ys = [];
      for (var n = 0; n < 4; n++) ys.push((xs[n] + (n ? xs[n - 1] : 0)) / 2);
      return { xs: xs, ys: ys };
    },
    ask: function (d) { return 'Entrada $x = (' + d.xs.map(function (v) { return U.fmt(v, 1); }).join(',\\ ') + ')$, con $x_{-1} = 0$. Aplica $y_n = \\frac{x_n + x_{n-1}}{2}$ y da $y_1$, $y_2$ y $y_3$ (dos decimales).'; },
    fields: [{ name: 'y1', label: 'y₁', w: 'tiny' }, { name: 'y2', label: 'y₂', w: 'tiny' }, { name: 'y3', label: 'y₃', w: 'tiny' }],
    sol: function (d) { return { y1: d.ys[1], y2: d.ys[2], y3: d.ys[3] }; },
    dec: 2,
    hint: function () { return 'Cada salida es la media de la entrada actual y la anterior.'; },
    steps: function (d) { return [1, 2, 3].map(function (n) { return '$y_' + n + ' = \\frac{' + U.fmt(d.xs[n], 1) + ' + (' + U.fmt(d.xs[n - 1], 1) + ')}{2} = ' + U.fmt(d.ys[n], 2) + '$'; }); },
    answer: function (d) { return [1, 2, 3].map(function (n) { return U.fmt(d.ys[n], 2); }).join(', '); }
  });

  p.exercise({
    title: 'Cuánto deja pasar la media',
    level: 'basico',
    gen: function (r) {
      var fs = r.pick([44100, 48000]), f = r.pick([1000, 2000, 5000, 8000, 11025, 12000, 15000, 20000]);
      return { fs: fs, f: f, H: Math.abs(Math.cos(Math.PI * f / fs)) };
    },
    ask: function (d) { return 'Con $f_s = ' + U.miles(d.fs) + '$, ¿por cuánto multiplica la media de dos muestras a un seno de $' + U.miles(d.f) + '$ Hz? (tres decimales)'; },
    fields: [{ name: 'H', label: '|H|', w: 'wide' }],
    sol: function (d) { return { H: U.round(d.H, 6) }; },
    dec: 3,
    hint: function () { return '$|H(f)| = |\\cos(\\pi f / f_s)|$.'; },
    steps: function (d) { return ['$|\\cos(\\pi\\cdot ' + U.miles(d.f) + ' / ' + U.miles(d.fs) + ')| = ' + U.fmt(d.H, 3) + '$: pasa el ' + U.fmt(100 * d.H, 0) + ' %.']; },
    answer: function (d) { return U.fmt(d.H, 3); }
  });

  p.exercise({
    title: 'El filtro de un polo, a mano',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([0.2, 0.25, 0.4, 0.5, 0.8]), x = r.pick([1, 2, 0.5, -1]);
      var y = [], prev = 0;
      for (var n = 0; n < 4; n++) { prev = a * x + (1 - a) * prev; y.push(prev); }
      return { a: a, x: x, y: y };
    },
    ask: function (d) { return 'Filtro $y_n = ' + U.fmt(d.a, 2) + '\\,x_n + ' + U.fmt(1 - d.a, 2) + '\\,y_{n-1}$ con $y_{-1} = 0$ y entrada constante $x_n = ' + U.fmt(d.x, 1) + '$. Calcula $y_0$, $y_1$, $y_2$ y el límite al que tiende $y_n$. (tres decimales)'; },
    fields: [{ name: 'y0', label: 'y₀', w: 'tiny' }, { name: 'y1', label: 'y₁', w: 'tiny' }, { name: 'y2', label: 'y₂', w: 'tiny' }, { name: 'L', label: 'límite', w: 'tiny' }],
    sol: function (d) { return { y0: U.round(d.y[0], 6), y1: U.round(d.y[1], 6), y2: U.round(d.y[2], 6), L: d.x }; },
    dec: 3,
    hint: function () { return ['Aplica la recurrencia tres veces.', 'En el límite $y_n = y_{n-1} = L$: $L = aL_x + (1-a)L$, y despeja.']; },
    steps: function (d) { return ['$y_0 = ' + U.fmt(d.a, 2) + '\\cdot ' + U.fmt(d.x, 1) + ' = ' + U.fmt(d.y[0], 3) + '$', '$y_1 = ' + U.fmt(d.a * d.x, 3) + ' + ' + U.fmt(1 - d.a, 2) + '\\cdot ' + U.fmt(d.y[0], 3) + ' = ' + U.fmt(d.y[1], 3) + '$', '$y_2 = ' + U.fmt(d.a * d.x, 3) + ' + ' + U.fmt(1 - d.a, 2) + '\\cdot ' + U.fmt(d.y[1], 3) + ' = ' + U.fmt(d.y[2], 3) + '$', 'Límite: $L = ' + U.fmt(d.a, 2) + '\\cdot ' + U.fmt(d.x, 1) + ' + ' + U.fmt(1 - d.a, 2) + 'L \\Rightarrow L = ' + U.fmt(d.x, 1) + '$: el filtro llega a la entrada, con razón $' + U.fmt(1 - d.a, 2) + '$ en cada paso.']; },
    answer: function (d) { return d.y.slice(0, 3).map(function (v) { return U.fmt(v, 3); }).join(', ') + '; límite ' + U.fmt(d.x, 1); }
  });

  p.exercise({
    title: 'La frecuencia de corte',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([0.01, 0.02, 0.03, 0.05, 0.08, 0.1]), fs = r.pick([44100, 48000]);
      return { a: a, fs: fs, fc: a * fs / (2 * Math.PI) };
    },
    ask: function (d) { return 'Filtro de un polo con $a = ' + U.fmt(d.a, 2) + '$ y $f_s = ' + U.miles(d.fs) + '$. ¿Dónde está, aproximadamente, la frecuencia de corte? (un decimal)'; },
    fields: [{ name: 'fc', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { fc: U.round(d.fc, 4) }; },
    dec: 1,
    hint: function () { return '$f_c \\approx a f_s / 2\\pi$.'; },
    steps: function (d) { return ['$f_c \\approx \\dfrac{' + U.fmt(d.a, 2) + '\\cdot ' + U.miles(d.fs) + '}{2\\pi} = ' + U.fmt(d.fc, 1) + '$ Hz.']; },
    answer: function (d) { return U.fmt(d.fc, 1) + ' Hz'; }
  });

  p.exercise({
    title: 'Escribe el filtro',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick([0.05, 0.1, 0.2]), f = r.pick([110, 220]);
      return { a: a, f: f, ref: a + ' * 0.4 * sierra(' + f + ', t) + ' + (1 - a) + ' * anterior()' };
    },
    ask: function (d) {
      return 'Escribe una sierra de <strong>' + d.f + ' Hz</strong> y amplitud 0,4 que pase por el filtro de un polo con <strong>$a = ' + U.fmt(d.a, 2) + '$</strong>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: 'a * x + (1 - a) * anterior()' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 1 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (!/anterior/.test(texto)) return { ok: false, msg: 'Un filtro de un polo necesita la salida anterior: <code>anterior()</code>.' };
        if (r.espectro < 0.9) return { ok: false, msg: 'Suena, pero el espectro no es el de una sierra de ' + d.f + ' Hz filtrada con a = ' + U.fmt(d.a, 2) + '. Revisa los dos coeficientes: suman 1.' };
        return { ok: false, msg: 'El nivel no cuadra: la sierra va con amplitud 0,4.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['La entrada es <code>0.4 * sierra(' + d.f + ', t)</code>.', 'La salida es $a$ por la entrada más $(1 - a)$ por <code>anterior()</code>.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Un filtro trata distinto a cada frecuencia. La media de dos muestras deja pasar $|\\cos(\\pi f/f_s)|$: todo en los graves, nada en $f_s/2$.',
    'El filtro de un polo, $y_n = a x_n + (1-a) y_{n-1}$, es una sucesión recurrente: se escribe con <code>anterior()</code>.',
    'Su corte está hacia $a f_s / 2\\pi$; con la entrada parada decae como una geométrica de razón $1 - a$. Converge si $|1 - a| < 1$.',
    'Síntesis sustractiva: un oscilador rico y un filtro cuyo corte se mueve con una envolvente. Es el sonido de los sintetizadores analógicos.',
    'La misma cuenta suaviza cotizaciones, sensores y epidemias: mezclar el dato nuevo con el resultado anterior.'
  ]);
});
