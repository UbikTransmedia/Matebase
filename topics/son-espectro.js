/* Tema: El espectro: ver el sonido */
Course.topic('son-espectro', function (p) {

  p.puente('Desde el primer tema del bloque hay un dibujo a la derecha de la onda, el ' +
    '<strong>espectro</strong>, con una raya por cada seno que contiene el sonido. En [[son-armonicos]] ' +
    'se usó para ver los armónicos. Este tema explica cómo se calcula ese dibujo a partir de la lista ' +
    'de muestras de [[son-muestras]]: es la serie de Fourier hecha con números en vez de con ' +
    'funciones, y es la herramienta con la que se lee cualquier sonido.');

  p.section('Preguntarle a la señal cuánto se parece a un seno');

  p.text('La idea es tan sencilla que sorprende. Para saber si una lista de muestras contiene un seno ' +
    'de cierta frecuencia, se <strong>multiplica la lista por ese seno y se suma</strong>. Si la señal ' +
    'lleva ese seno, los productos son positivos donde los dos suben y donde los dos bajan: la suma ' +
    'crece. Si no lo lleva, unos productos salen positivos y otros negativos, y se cancelan. Es un ' +
    '<em>producto escalar</em>, como el de los vectores: mide cuánto «van en la misma dirección».');

  p.formulas([
    'a_k = \\frac{2}{N}\\sum_{n=0}^{N-1} y_n\\cos\\!\\left(\\frac{2\\pi k n}{N}\\right), \\qquad b_k = \\frac{2}{N}\\sum_{n=0}^{N-1} y_n\\,\\operatorname{sen}\\!\\left(\\frac{2\\pi k n}{N}\\right)',
    'A_k = \\sqrt{a_k^2 + b_k^2}, \\qquad f_k = k\\,\\frac{f_s}{N}'
  ], 'la transformada discreta de Fourier',
    'Se lee: <em>«a sub ka es dos partido por ene por la suma de las muestras por el coseno de dos pi ' +
      'ka ene partido por ene»</em>, y lo mismo con el seno para $b_k$.<br><br>$N$ es cuántas muestras ' +
      'se analizan, y $k$ cuántas oscilaciones completas hace el seno de prueba en esas $N$ muestras: ' +
      'el «bin» $k$. Hacen falta el coseno y el seno porque el seno de la señal puede estar desplazado ' +
      '(la fase); $A_k$ junta los dos y da la <strong>amplitud</strong> a esa frecuencia, que es lo que ' +
      'se dibuja. Y la frecuencia del bin $k$ es $k$ veces $f_s/N$: la del seno que cabe exactamente ' +
      '$k$ veces en la ventana.<br><br>Con el $\\frac{2}{N}$ delante, un seno de amplitud 1 da ' +
      '$A_k = 1$ en su bin.');

  p.demo({
    title: 'Multiplicar por un seno de prueba',
    intro: 'Arriba, una señal con dos senos (150 y 400 Hz). Abajo, el producto de la señal por un seno de prueba cuya frecuencia mueves tú. Fíjate en la media del producto: solo se aleja de cero cuando la prueba coincide con algo que hay en la señal.',
    predice: 'Con el seno de prueba a 300 Hz, ¿el producto tendrá media positiva o casi cero? ¿Y a 400?',
    build: function (host) {
      var fp = 200;
      var sig = function (t) { return 0.7 * Math.sin(2 * Math.PI * 150 * t) + 0.5 * Math.sin(2 * Math.PI * 400 * t); };
      var out = W.readout(host, '');
      var p1 = W.plot(host, {
        xmin: 0, xmax: 0.04, ymin: -1.4, ymax: 1.4, height: 160, xlabel: 't (s)',
        aria: 'La señal, suma de dos senos de 150 y 400 hercios, y el seno de prueba superpuesto',
        draw: function (g) {
          g.fn(sig, { color: 0, w: 2 });
          g.fn(function (t) { return Math.sin(2 * Math.PI * fp * t); }, { color: 1, w: 1.4, dash: true });
        }
      });
      var p2 = W.plot(host, {
        xmin: 0, xmax: 0.04, ymin: -1.4, ymax: 1.4, height: 160, xlabel: 't (s)',
        aria: 'El producto de la señal por el seno de prueba, con su valor medio marcado',
        draw: function (g) {
          var m = media();
          g.area(function (t) { return sig(t) * Math.sin(2 * Math.PI * fp * t); }, 0, 0.04, { fill: 2, fillAlpha: 0.25 });
          g.fn(function (t) { return sig(t) * Math.sin(2 * Math.PI * fp * t); }, { color: 2, w: 1.8 });
          g.hline(m, { color: 3, w: 2 });
        }
      });
      function media() {
        var s = 0, n = 2000;
        for (var i = 0; i < n; i++) { var t = 0.04 * i / n; s += sig(t) * Math.sin(2 * Math.PI * fp * t); }
        return s / n;
      }
      function pinta() {
        var m = media();
        out.set('Seno de prueba a $' + fp + '$ Hz. Media del producto: $' + U.fmt(m, 3) + '$, que multiplicada por 2 da la amplitud estimada: $' + U.fmt(2 * Math.abs(m), 2) + '$.<br>' +
          (Math.abs(m) > 0.1 ? '<strong>Hay un seno de esa frecuencia en la señal.</strong> ' + (fp === 150 ? 'Amplitud real: 0,7.' : (fp === 400 ? 'Amplitud real: 0,5.' : '')) : 'Casi cero: la señal no lleva esa frecuencia, y los productos se cancelan.'));
        p1.render(); p2.render();
      }
      W.slider(W.row(host), { label: 'frecuencia del seno de prueba (Hz)', min: 50, max: 600, step: 10, value: fp, on: function (v) { fp = v; pinta(); } });
      W.hint(host, 'Para en 150 y en 400: la media se dispara. En cualquier otra frecuencia, el producto oscila alrededor de cero. Eso, repetido para cada bin, es el espectro.');
      pinta();
    }
  });

  p.text('Eso es todo lo que hace la transformada: repetir esa pregunta para cada frecuencia de ' +
    'prueba, $k = 0, 1, 2, \\ldots, N/2$, y dibujar las respuestas. Con $N = 4096$ muestras son ' +
    '2048 preguntas, cada una con 4096 productos: ocho millones de operaciones por espectro. Hecho ' +
    'a lo bruto sería lento; el algoritmo de la <strong>transformada rápida</strong> (FFT) reorganiza ' +
    'las cuentas y lo deja en unas 50 000, que es lo que permite dibujar el espectro cada vez que ' +
    'tocas una tecla.');

  p.section('Lo que se gana y lo que se pierde');

  p.formula('\\Delta f = \\frac{f_s}{N}', 'la resolución: lo que separa dos bins',
    'Con $f_s = 44\\,100$ y $N = 4096$, los bins están a $10{,}8$ Hz unos de otros: el espectro no ' +
      'distingue 440 de 445. Para separarlos haría falta $N > 8820$, un quinto de segundo de sonido. ' +
      'Y ahí está la trampa: <strong>cuanta más resolución en frecuencia, más sonido hay que mirar</strong>, ' +
      'y menos se sabe de <em>cuándo</em> sonó cada cosa. Un análisis muy fino no puede ser muy rápido; ' +
      'es la misma incertidumbre que la de la física cuántica, con la misma matemática detrás.');

  p.demo({
    title: 'Leer un espectro',
    intro: 'Un instrumento sintético: una fundamental y sus armónicos, con un mando para el «brillo» (cuánto pesan los agudos). Lee el espectro: la primera raya es la nota; la distancia entre rayas, también; la caída de las alturas, el timbre.',
    predice: 'Con brillo 1 los armónicos pesan $1/k$, como una sierra. Si pones brillo 2, ¿las rayas de la derecha subirán o bajarán? ¿Y cambiará la primera?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-espectro-1', dur: 1, ventana: 10, fmax: 4000,
        mandos: [
          { n: 'f', label: 'fundamental (Hz)', min: 110, max: 660, step: 10, value: 220, dec: 0 },
          { n: 'brillo', label: 'brillo (los armónicos pesan 1/k^brillo)', min: 0.5, max: 3, step: 0.1, value: 1, dec: 1 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var y = 0;\n' +
          '    for (var k = 1; k <= 12; k++) {\n' +
          '        y += sin(TAU * k * f * t) / pow(k, brillo);\n' +
          '    }\n' +
          '    return 0.3 * y;\n' +
          '}\n',
        nota: 'Las rayas están a $f$, $2f$, $3f$…: equiespaciadas, porque son armónicos. Un sonido cuyas ' +
          'rayas no estén equiespaciadas no es una nota. Y el panel de arriba dice «dominante»: es el ' +
          'bin más alto, que aquí coincide con la fundamental.'
      });
    }
  });

  p.section('El espectrograma: el espectro a lo largo del tiempo');

  p.text('Un espectro de un sonido entero dice qué frecuencias hubo, pero no cuándo. Para eso se parte ' +
    'el sonido en ventanas cortas —unas 20 milésimas—, se calcula el espectro de cada una y se ponen ' +
    'todos de pie, uno junto a otro, con el tiempo en horizontal y la frecuencia en vertical: el ' +
    '<strong>espectrograma</strong>. Es la forma más parecida a una partitura que tiene un sonido: cada ' +
    'nota es un trazo horizontal a la altura de su frecuencia, y sus armónicos, trazos paralelos encima.');

  p.demo({
    title: 'Una nota que sube, vista',
    intro: 'La frecuencia crece con el tiempo (un glissando) y de pronto se corta y empieza una nota fija con sus armónicos. A la derecha, en vez del espectro, el espectrograma: el tiempo va de izquierda a derecha y la frecuencia de abajo arriba. Se ve el trazo subiendo y luego las rayas horizontales.',
    predice: 'En el espectrograma, un tono que sube de frecuencia de forma constante, ¿se verá como una línea horizontal, vertical o inclinada?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-espectro-2', dur: 2, loop: false, ventana: 10, fmax: 2000, espectrograma: true,
        codigo:
          'function sonido(t) {\n' +
          '    if (t < 1) {\n' +
          '        // el primer segundo: la frecuencia sube de 200 a 800 Hz\n' +
          '        var f = 200 + 600 * t;\n' +
          '        return 0.4 * sin(TAU * (200 * t + 300 * t * t));   // la fase es la integral de f\n' +
          '    }\n' +
          '    // después: una nota fija de 330 Hz con tres armónicos\n' +
          '    var u = t - 1;\n' +
          '    return 0.3 * (sin(TAU * 330 * u) + sin(TAU * 660 * u) / 2 + sin(TAU * 990 * u) / 3);\n' +
          '}\n',
        nota: 'Fíjate en la línea de la fase: para que la frecuencia suba linealmente, dentro del seno ' +
          'no va $f\\cdot t$ sino $\\int f\\,dt = 200t + 300t^2$. La frecuencia instantánea es la ' +
          'derivada de la fase: es la [[fn-derivadas|derivada]] del bloque de análisis, sonando.'
      });
    }
  });

  p.ejemplo({
    title: 'Una transformada con cuatro muestras',
    enunciado: 'Se tienen $N = 4$ muestras, $y = (0,\\ 1,\\ 0,\\ -1)$, tomadas a $f_s = 400$ muestras por segundo. Calcular $a_1$, $b_1$, la amplitud $A_1$ y la frecuencia a la que corresponde.',
    pasos: [
      { t: '<strong>Los senos de prueba.</strong> Para $k = 1$, los ángulos $\\frac{2\\pi n}{4}$ son $0$, $\\frac{\\pi}{2}$, $\\pi$, $\\frac{3\\pi}{2}$: cosenos $(1, 0, -1, 0)$ y senos $(0, 1, 0, -1)$.', antes: 'Calcula $\\cos$ y $\\operatorname{sen}$ de $0$, $\\pi/2$, $\\pi$ y $3\\pi/2$.' },
      { t: '<strong>$a_1$.</strong> $\\frac{2}{4}(0\\cdot 1 + 1\\cdot 0 + 0\\cdot(-1) + (-1)\\cdot 0) = 0$.' },
      { t: '<strong>$b_1$.</strong> $\\frac{2}{4}(0\\cdot 0 + 1\\cdot 1 + 0\\cdot 0 + (-1)\\cdot(-1)) = \\frac{2}{4}\\cdot 2 = 1$.', antes: 'Multiplica muestra a muestra por los senos y suma.' },
      { t: '<strong>La amplitud.</strong> $A_1 = \\sqrt{0^2 + 1^2} = 1$. Tiene sentido: las muestras $(0, 1, 0, -1)$ son exactamente un seno de amplitud 1 que da una vuelta en las cuatro muestras.' },
      { t: '<strong>La frecuencia.</strong> $f_1 = 1\\cdot\\frac{400}{4} = 100$ Hz: un ciclo cada cuatro muestras, y hay cien grupos de cuatro por segundo. Y $k = 2$ daría $a_2 = b_2 = 0$: no hay nada más.', antes: '¿Cuántas oscilaciones por segundo hace un seno que da una vuelta cada cuatro muestras?' }
    ],
    cierre: 'Con cuatro muestras se ve la máquina entera: preguntar a la señal por cada seno, coseno y seno a la vez, y juntar las dos respuestas en una amplitud.'
  });

  p.comprueba('Para distinguir en un espectro dos tonos de 440 y 442 Hz, con $f_s = 44\\,100$, ¿cuántas muestras hacen falta como mínimo?', [
    { t: 'Unas 22 050: medio segundo', ok: true, por: 'La resolución es $f_s/N$; para que sea de 2 Hz, $N = 44\\,100/2 = 22\\,050$ muestras, medio segundo. Con menos sonido, las dos rayas se funden en una.' },
    { t: '4096: las de siempre', ok: false, por: 'Con 4096 los bins están a 10,8 Hz: 440 y 442 caen en el mismo. Hace falta más sonido, no más cuentas.' },
    { t: 'Da igual: la transformada es exacta', ok: false, por: 'Es exacta para las frecuencias de los bins. Lo que hay entre dos bins se reparte entre ellos, y a 2 Hz de distancia no se separan sin una ventana larga.' }
  ]);

  p.hist('La transformada rápida la publicaron James Cooley y John Tukey en 1965, y cambió la ' +
    'ingeniería de la noche a la mañana: lo que costaba $N^2$ operaciones pasó a costar $N\\log N$, y ' +
    'el análisis de espectros dejó de ser cosa de laboratorios. Después se supo que Gauss había ' +
    'usado el mismo truco en 1805 para calcular órbitas de asteroides, y no lo publicó. El ' +
    'espectrograma es anterior: los laboratorios Bell construyeron en 1946 el <em>sonógrafo</em>, ' +
    'una máquina que dibujaba la voz sobre papel, con la idea de enseñar a leer el habla a las ' +
    'personas sordas. La imagen que producía es la misma que dibuja el sintetizador de arriba.');

  p.util('Reconocer una canción por un trozo grabado en un bar se hace con el espectrograma: se ' +
    'buscan sus picos, se guardan las distancias entre ellos como una huella y se comparan con una ' +
    'base de datos. El reconocimiento de voz empieza por lo mismo. Los ornitólogos identifican ' +
    'pájaros por el dibujo de su canto, los cardiólogos analizan un electrocardiograma por su ' +
    'espectro, y los astrónomos descubren planetas en el espectro del brillo de una estrella, que ' +
    'oscila con el periodo de la órbita. Todo es el mismo cálculo: preguntar a una lista de números ' +
    'cuánto se parece a cada seno.');

  p.trampas([
    { e: 'Leer el bin $k$ como $k$ hercios', por: 'La frecuencia del bin es $k\\,f_s/N$. Con $N = 4096$ y $f_s = 44\\,100$, el bin 41 son 441 Hz.' },
    { e: 'Esperar que un espectro diga cuándo sonó cada cosa', por: 'El espectro de un sonido entero mezcla todo su tiempo. Para el «cuándo» está el espectrograma, que corta en ventanas.' },
    { e: 'Creer que más $N$ solo tiene ventajas', por: 'Más $N$ afina la frecuencia y emborrona el tiempo. Una ventana de un segundo no puede decir en qué milésima empezó una nota.' },
    { e: 'Olvidar el coseno', por: 'Con solo el seno de prueba, una señal desfasada un cuarto de periodo daría cero. Hacen falta las dos proyecciones, y la amplitud es la raíz de la suma de sus cuadrados.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La frecuencia de un bin',
    level: 'basico',
    gen: function (r) {
      var N = r.pick([256, 512, 1024, 2048, 4096, 8192]), fs = r.pick([8000, 22050, 44100, 48000]), k = r.int(3, 120);
      return { N: N, fs: fs, k: k, f: k * fs / N };
    },
    ask: function (d) { return 'Se analizan $N = ' + U.miles(d.N) + '$ muestras tomadas a $f_s = ' + U.miles(d.fs) + '$. ¿A qué frecuencia corresponde el bin $k = ' + d.k + '$? (dos decimales)'; },
    fields: [{ name: 'f', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { f: U.round(d.f, 6) }; },
    dec: 2,
    hint: function () { return '$f_k = k\\,f_s/N$.'; },
    steps: function (d) { return ['$f_k = ' + d.k + '\\cdot\\dfrac{' + U.miles(d.fs) + '}{' + U.miles(d.N) + '} = ' + U.fmt(d.f, 2) + '$ Hz.']; },
    answer: function (d) { return U.fmt(d.f, 2) + ' Hz'; }
  });

  p.exercise({
    title: 'La resolución',
    level: 'basico',
    gen: function (r) {
      var N = r.pick([512, 1024, 2048, 4096, 8192, 16384]), fs = r.pick([22050, 44100, 48000]);
      return { N: N, fs: fs, df: fs / N };
    },
    ask: function (d) { return 'Con $N = ' + U.miles(d.N) + '$ muestras a $f_s = ' + U.miles(d.fs) + '$, ¿cuántos hercios separan dos bins consecutivos? (dos decimales)'; },
    fields: [{ name: 'df', label: 'Δf (Hz)', w: 'wide' }],
    sol: function (d) { return { df: U.round(d.df, 6) }; },
    dec: 2,
    hint: function () { return '$\\Delta f = f_s / N$.'; },
    steps: function (d) { return ['$\\Delta f = \\dfrac{' + U.miles(d.fs) + '}{' + U.miles(d.N) + '} = ' + U.fmt(d.df, 2) + '$ Hz. Dos tonos más cercanos que eso salen en el mismo bin.']; },
    answer: function (d) { return U.fmt(d.df, 2) + ' Hz'; }
  });

  p.exercise({
    title: 'Cuántas muestras para separar dos tonos',
    level: 'medio',
    gen: function (r) {
      var fs = r.pick([22050, 44100, 48000]), sep = r.pick([1, 2, 3, 5, 10, 20]);
      var N = Math.ceil(fs / sep);
      return { fs: fs, sep: sep, N: N, seg: N / fs };
    },
    ask: function (d) { return 'A $f_s = ' + U.miles(d.fs) + '$, ¿cuántas muestras hacen falta, como mínimo, para que dos bins consecutivos estén a $' + d.sep + '$ Hz o menos? ¿Y cuántos segundos de sonido son?'; },
    fields: [{ name: 'N', label: 'muestras', w: 'wide' }, { name: 's', label: 'segundos', w: 'wide' }],
    sol: function (d) { return { N: d.N, s: U.round(d.seg, 6) }; },
    dec: { N: 0, s: 3 },
    hint: function () { return ['$f_s/N \\le \\Delta f \\Rightarrow N \\ge f_s/\\Delta f$, redondeando hacia arriba.', 'Los segundos son $N/f_s$.']; },
    steps: function (d) { return ['$N \\ge \\dfrac{' + U.miles(d.fs) + '}{' + d.sep + '} = ' + U.fmt(d.fs / d.sep, 1) + '$, así que $N = ' + U.miles(d.N) + '$ muestras.', 'Son $' + U.miles(d.N) + '/' + U.miles(d.fs) + ' = ' + U.fmt(d.seg, 3) + '$ s de sonido: para afinar en frecuencia hay que esperar.']; },
    answer: function (d) { return U.miles(d.N) + ' muestras, ' + U.fmt(d.seg, 3) + ' s'; }
  });

  p.exercise({
    title: 'Qué onda es',
    level: 'medio',
    gen: function (r) {
      var f = r.pick([100, 150, 200, 250]);
      var casos = [
        { t: 'seno', lista: [f], amp: ['1'] },
        { t: 'sierra', lista: [f, 2 * f, 3 * f, 4 * f], amp: ['1', '1/2', '1/3', '1/4'] },
        { t: 'cuadrada', lista: [f, 3 * f, 5 * f, 7 * f], amp: ['1', '1/3', '1/5', '1/7'] },
        { t: 'triangulo', lista: [f, 3 * f, 5 * f], amp: ['1', '1/9', '1/25'] },
        { t: 'acorde', lista: [f, Math.round(f * 1.26), Math.round(f * 1.5)], amp: ['1', '1', '1'] }
      ];
      var c = r.pick(casos);
      return { f: f, c: c };
    },
    ask: function (d) { return 'Un espectro tiene rayas en $' + d.c.lista.join('$, $') + '$ Hz con amplitudes proporcionales a $' + d.c.amp.join('$, $') + '$. ¿Qué es?'; },
    fields: [{ name: 'q', label: 'Es', opts: [{ t: 'un seno puro', v: 'seno' }, { t: 'una sierra (todos los armónicos, 1/k)', v: 'sierra' }, { t: 'una cuadrada (impares, 1/k)', v: 'cuadrada' }, { t: 'un triángulo (impares, 1/k²)', v: 'triangulo' }, { t: 'un acorde: tres notas distintas', v: 'acorde' }] }],
    sol: function (d) { return { q: d.c.t }; },
    hint: function () { return ['¿Son las rayas múltiplos de la primera? Si no, son notas distintas.', 'Si lo son: ¿están todos los múltiplos o solo los impares? ¿Bajan como $1/k$ o como $1/k^2$?']; },
    steps: function (d) { return [{ seno: 'Una sola raya: un seno puro.', sierra: 'Todos los múltiplos de ' + d.f + ' con amplitudes $1/k$: la sierra.', cuadrada: 'Solo los impares con $1/k$: la cuadrada.', triangulo: 'Solo los impares con $1/k^2$: el triángulo.', acorde: 'Las rayas no son múltiplos de ' + d.f + ' (son $\\times 1{,}26$ y $\\times 1{,}5$: tercera y quinta): tres notas, un acorde mayor.' }[d.c.t]]; },
    answer: function (d) { return d.c.t; }
  });

  p.exercise({
    title: 'Una transformada a mano',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick([0, 0.6, 0.8, 1, 1.2]), b = r.pick([0, 0.5, 0.8, 1, 1.5]);
      if (!a && !b) return null;
      return { a: a, b: b, y: [a, b, -a, -b], A: Math.sqrt(a * a + b * b) };
    },
    ask: function (d) { return 'Cuatro muestras, $y = (' + d.y.map(function (v) { return U.fmt(v, 1); }).join(',\\ ') + ')$. Calcula $a_1$, $b_1$ y la amplitud $A_1$ del bin 1 (tres decimales).'; },
    fields: [{ name: 'a', label: 'a₁', w: 'tiny' }, { name: 'b', label: 'b₁', w: 'tiny' }, { name: 'A', label: 'A₁', w: 'tiny' }],
    sol: function (d) { return { a: d.a, b: d.b, A: U.round(d.A, 6) }; },
    dec: 3,
    hint: function () { return ['Para $k = 1$ y $N = 4$: cosenos $(1, 0, -1, 0)$ y senos $(0, 1, 0, -1)$.', '$a_1 = \\frac{2}{4}\\sum y_n\\cos$, $b_1 = \\frac{2}{4}\\sum y_n\\operatorname{sen}$, $A_1 = \\sqrt{a_1^2 + b_1^2}$.']; },
    steps: function (d) { return ['$a_1 = \\tfrac{2}{4}(' + U.fmt(d.a, 1) + ' \\cdot 1 + ' + U.fmt(d.b, 1) + '\\cdot 0 + (' + U.fmt(-d.a, 1) + ')(-1) + (' + U.fmt(-d.b, 1) + ')\\cdot 0) = ' + U.fmt(d.a, 3) + '$', '$b_1 = \\tfrac{2}{4}(0 + ' + U.fmt(d.b, 1) + ' + 0 + ' + U.fmt(d.b, 1) + ') = ' + U.fmt(d.b, 3) + '$', '$A_1 = \\sqrt{' + U.fmt(d.a, 1) + '^2 + ' + U.fmt(d.b, 1) + '^2} = ' + U.fmt(d.A, 3) + '$']; },
    answer: function (d) { return 'a₁ = ' + U.fmt(d.a, 3) + ', b₁ = ' + U.fmt(d.b, 3) + ', A₁ = ' + U.fmt(d.A, 3); }
  });

  p.keys([
    'El espectro se calcula preguntando a la señal cuánto se parece a cada seno: multiplicar y sumar, con coseno y seno a la vez, y $A_k = \\sqrt{a_k^2 + b_k^2}$.',
    'El bin $k$ corresponde a $k\\,f_s/N$ hercios; la resolución es $f_s/N$.',
    'Afinar en frecuencia cuesta tiempo: para separar dos tonos a 2 Hz hace falta medio segundo de sonido.',
    'El espectrograma corta en ventanas y pone los espectros de pie: tiempo en horizontal, frecuencia en vertical. Es la partitura de un sonido.',
    'La FFT hace la misma cuenta en $N\\log N$ operaciones en vez de $N^2$: por eso el espectro sale al instante.'
  ]);
});
