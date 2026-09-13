/* Tema: Eco, retardo y reverberación */
Course.topic('son-eco', function (p) {

  p.puente('Un [[son-filtros|filtro]] recordaba la muestra anterior. Un <strong>eco</strong> recuerda ' +
    'lo que sonó hace medio segundo y lo suma, más bajo. Repetido, es un eco de eco de eco: una ' +
    '[[fn-series|serie geométrica]] que se oye, con la misma condición de convergencia que en el ' +
    'bloque de análisis. Y miles de ecos diminutos y desordenados son la reverberación de una sala: ' +
    'el sonido del espacio.');

  p.section('Un eco: sumar el pasado');

  p.text('Grita en un valle y el sonido vuelve medio segundo después, más débil. En fórmula: la salida ' +
    'es la entrada más una copia de la <em>salida</em> retrasada $d$ segundos y multiplicada por una ' +
    'ganancia $g$. Como la copia es de la salida, y la salida ya contenía un eco, el eco tiene eco:');

  p.formula('y(t) = x(t) + g\\,y(t - d)', 'el eco con realimentación',
    'Se lee: <em>«i de te es equis de te más ge por i de te menos de»</em>. En el sintetizador, ' +
      '<code>antes(d)</code> devuelve la salida de hace $d$ segundos, así que la línea es literalmente ' +
      '<code>x + g * antes(d)</code>. Cuando la entrada es un golpe único en $t = 0$, la salida es una ' +
      'sucesión de golpes en $0, d, 2d, 3d, \\ldots$ con alturas $1, g, g^2, g^3, \\ldots$: una progresión ' +
      'geométrica en el tiempo.');

  p.formula('1 + g + g^2 + g^3 + \\cdots = \\frac{1}{1 - g}, \\qquad |g| < 1', 'la energía total de los ecos',
    'Es la serie geométrica de [[fn-series]]. Con $g = 0{,}5$, la suma de todos los ecos es el ' +
      'doble del golpe original; con $g = 0{,}9$, diez veces. Y con $g \\ge 1$ la serie diverge: cada ' +
      'eco es tan alto o más que el anterior, la sala «se acopla» y el sonido crece sin parar. El ' +
      'sintetizador recorta, pero un equipo de verdad pita. <strong>La condición de convergencia de ' +
      'una serie es la condición para que un eco se apague.</strong>');

  p.demo({
    title: 'Oír una serie geométrica',
    intro: 'Un golpe corto (una nota de 20 ms) y un eco con retardo $d$ y ganancia $g$. Cada repetición es $g$ veces la anterior. Con $g$ cerca de 1 los ecos duran los dos segundos enteros; pasa de 1 y verás cómo se desboca (el sintetizador lo recorta a un volumen seguro).',
    predice: 'Con $d = 0{,}25$ y $g = 0{,}5$, ¿cuántos ecos audibles habrá en un segundo, y qué altura tendrá el cuarto respecto al golpe original?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-eco-1', dur: 2, loop: false, ventana: 2000, fmax: 2000,
        mandos: [
          { n: 'd', label: 'retardo d (s)', min: 0.05, max: 0.6, step: 0.01, value: 0.25, dec: 2 },
          { n: 'g', label: 'ganancia g', min: 0, max: 1.1, step: 0.01, value: 0.5, dec: 2 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.6 * decae(t, 0.02) * sin(TAU * 660 * t);   // un golpe de 20 ms\n' +
          '    return x + g * antes(d);                            // más el eco del eco\n' +
          '}\n',
        nota: 'La onda de la izquierda enseña los dos segundos enteros: se ven los golpes bajando como ' +
          'una geométrica. Con $g = 1$ no bajan, y con $g = 1{,}1$ suben, hasta que el límite de ' +
          'seguridad los aplasta: la serie no converge.'
      });
    }
  });

  p.section('Retardos cortos: cuando el eco es un filtro');

  p.text('Si el retardo baja de unas 30 milésimas, el oído ya no separa el eco del original: los ' +
    'funde. Y lo que se oye entonces es un cambio de <em>timbre</em>, porque sumar una señal con ' +
    'ella misma retrasada refuerza unas frecuencias y cancela otras. Un seno con periodo igual al ' +
    'retardo se suma en fase consigo mismo: se dobla. Uno con periodo doble llega invertido: se anula.');

  p.formula('|H(f)| = \\left|1 + g\\,e^{-2\\pi i f d}\\right| \\quad\\Longrightarrow\\quad \\text{picos en } f = \\frac{k}{d},\\ \\text{huecos en } f = \\frac{k + \\frac{1}{2}}{d}', 'el filtro de peine',
    'No hace falta la exponencial compleja para entenderlo: un seno de frecuencia $k/d$ da $k$ vueltas ' +
      'exactas en $d$ segundos, así que su copia retrasada coincide con él y se refuerza; uno de ' +
      'frecuencia $(k + \\frac{1}{2})/d$ llega media vuelta desfasado y se resta. El espectro queda con ' +
      'dientes equiespaciados cada $1/d$ hercios: un <strong>peine</strong>. Con $d = 1$ ms, dientes ' +
      'cada 1000 Hz; y como los dientes están a $f, 2f, 3f\\ldots$, el peine <em>suena a nota</em> ' +
      'de frecuencia $1/d$. Es lo que hace Karplus-Strong en [[son-ruido]]: un peine muy resonante.');

  p.demo({
    title: 'Del eco al peine',
    intro: 'Ruido blanco (espectro plano) con un eco de retardo muy corto. Mira el espectro: aparecen dientes cada $1/d$ hercios. Con $d$ de 1 o 2 ms el ruido se convierte en una nota; con $d$ de 10 ms, en un zumbido grave; y si subes $g$ los dientes se afilan.',
    predice: 'Con $d = 2$ ms, ¿a cuántos hercios estará el primer diente del peine? ¿Y con 0,5 ms?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-eco-2', dur: 1, ventana: 10, fmax: 8000,
        mandos: [
          { n: 'ms', label: 'retardo (milisegundos)', min: 0.2, max: 12, step: 0.1, value: 2, dec: 1 },
          { n: 'g', label: 'ganancia g', min: 0, max: 0.97, step: 0.01, value: 0.8, dec: 2 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.2 * ruido();\n' +
          '    return x + g * antes(ms / 1000);\n' +
          '}\n',
        nota: 'El efecto <em>flanger</em> de las guitarras es este peine con el retardo moviéndose ' +
          'despacio arriba y abajo: los dientes se desplazan y se oye ese «avión» característico. ' +
          'Prueba <code>antes((2 + sin(TAU * 0.3 * t)) / 1000)</code>.'
      });
    }
  });

  p.section('Reverberación: mil ecos que no se pueden contar');

  p.text('En una sala, el sonido no vuelve una vez: rebota en cada pared, en el techo, en el suelo, y ' +
    'llega al oído por miles de caminos de distinta longitud, cada uno con su retardo y su ' +
    'atenuación. Ningún eco se distingue; la suma es una cola de sonido que se apaga suavemente, la ' +
    '<strong>reverberación</strong>. Se mide con el <strong>tiempo de reverberación</strong> $T_{60}$: lo ' +
    'que tarda la cola en bajar 60 decibelios, una milésima de la amplitud. Una habitación tiene ' +
    '0,4 s; una sala de conciertos, 2; una catedral, 8.');

  p.formula('T_{60} = 0{,}161\\,\\frac{V}{A}', 'la fórmula de Sabine',
    'Se lee: <em>«te sesenta es cero coma ciento sesenta y uno por volumen partido por absorción»</em>. ' +
      '$V$ es el volumen de la sala en metros cúbicos y $A$ la absorción total, la suma de cada ' +
      'superficie por su coeficiente (0 refleja todo, 1 absorbe todo: una ventana abierta). Más volumen, ' +
      'más cola; más alfombras y butacas, menos. Con ella se diseñan auditorios desde 1900.');

  p.demo({
    title: 'Una sala de tres ecos',
    intro: 'Una reverberación de juguete: tres ecos realimentados con retardos que no son múltiplos entre sí (29,7, 37,1 y 41,1 ms), para que sus repeticiones no coincidan y no suene a peine. La nota es corta; lo que se oye después es la sala. El mando controla cuánto sobrevive en cada rebote, y de ahí sale el $T_{60}$.',
    predice: 'Si $g$ sube de 0,7 a 0,9, ¿la cola durará el doble, más del doble o menos?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-eco-3', dur: 2.5, loop: false, ventana: 2500, fmax: 3000,
        mandos: [{ n: 'g', label: 'g: cuánto sobrevive cada rebote', min: 0.3, max: 0.95, step: 0.01, value: 0.75, dec: 2 }],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.5 * adsr(t, 0.005, 0.05, 0.5, 0.05, 0.15) * (sin(TAU * 440 * t) + 0.5 * sin(TAU * 880 * t));\n' +
          '    var sala = antes(0.0297) + antes(0.0371) + antes(0.0411);   // tres caminos\n' +
          '    return x + g * sala / 3;\n' +
          '}\n',
        nota: 'Los retardos son números «feos» a propósito: si fueran 30, 40 y 50 ms, sus múltiplos ' +
          'coincidirían cada 600 ms y se oiría un eco periódico. Las reverberaciones de verdad usan ' +
          'ocho o doce retardos primos entre sí, más filtros para que los agudos mueran antes, como en ' +
          'una sala con cortinas.'
      });
    }
  });

  p.ejemplo({
    title: 'Cuánto dura un eco',
    enunciado: 'Un eco con $d = 0{,}3$ s y $g = 0{,}6$. Hallar la altura del quinto eco respecto al original, la suma de todos los ecos, y cuánto tarda la cola en bajar por debajo de la milésima (los 60 dB del $T_{60}$).',
    pasos: [
      { t: '<strong>El quinto eco.</strong> Las alturas son $1, g, g^2, \\ldots$: el quinto es $0{,}6^5 = 0{,}078$, un 8 % del original, y suena en $t = 5\\cdot 0{,}3 = 1{,}5$ s.', antes: 'Es una progresión geométrica: ¿cuál es el término quinto?' },
      { t: '<strong>La suma.</strong> $\\dfrac{1}{1 - 0{,}6} = 2{,}5$: todos los ecos juntos valen dos veces y media el original. Converge porque $0{,}6 < 1$.' },
      { t: '<strong>Bajar a la milésima.</strong> $0{,}6^k < 0{,}001 \\Rightarrow k > \\dfrac{\\ln 0{,}001}{\\ln 0{,}6} = \\dfrac{-6{,}91}{-0{,}511} = 13{,}5$. Hace falta el eco 14.', antes: 'Toma logaritmos en $g^k = 10^{-3}$.' },
      { t: '<strong>En segundos.</strong> $T_{60} = 14\\cdot 0{,}3 = 4{,}2$ s. Una cola larguísima: con $g = 0{,}6$ y tres décimas de retardo suena a cañón. Para una habitación normal, $g$ tendría que ser mucho menor o $d$ mucho más corto.' },
      { t: '<strong>En general.</strong> $T_{60} \\approx d\\cdot\\dfrac{\\ln 0{,}001}{\\ln g} = \\dfrac{6{,}91\\,d}{-\\ln g}$: proporcional al retardo, e inversamente proporcional a $-\\ln g$. Con $g \\to 1$, $-\\ln g \\to 0$ y la cola tiende a infinito.', antes: 'Escribe la fórmula general para $k$ en función de $g$.' }
    ],
    cierre: 'Un eco es una progresión geométrica en el tiempo, y todo lo que se le puede preguntar —un término, la suma, cuándo se hace pequeño— se responde con potencias y logaritmos.'
  });

  p.comprueba('Un eco con $g = 1$ exacto: ¿qué pasa?', [
    { t: 'Los ecos no bajan nunca: el golpe se repite igual para siempre', ok: true, por: '$1 + 1 + 1 + \\cdots$ no converge. Cada eco es idéntico al anterior y la cola no se apaga. Con $g > 1$, además, crecen.' },
    { t: 'Se apaga, pero despacio', ok: false, por: 'Se apaga solo si $g < 1$, aunque sea $0{,}999$. Con 1 exacto la razón es 1 y la progresión es constante.' },
    { t: 'Suena un solo eco', ok: false, por: 'La realimentación produce eco del eco: con $g = 1$, infinitos ecos de la misma altura.' }
  ]);

  p.hist('Wallace Sabine, un físico joven de Harvard, recibió en 1895 el encargo de arreglar la ' +
    'acústica de una sala de conferencias donde no se entendía nada. Pasó dos años midiendo con un ' +
    'tubo de órgano y un cronómetro cuánto tardaba en apagarse una nota mientras cambiaba cojines ' +
    'de sitio, y descubrió que el tiempo era proporcional al volumen e inversamente proporcional a ' +
    'la absorción. Con esa fórmula diseñó el Symphony Hall de Boston (1900), todavía una de las ' +
    'mejores salas del mundo, y fundó la acústica arquitectónica. La reverberación artificial llegó ' +
    'en los años cincuenta con placas de acero y muelles, y en 1961 Manfred Schroeder publicó cómo ' +
    'hacerla con retardos y ganancias en un ordenador: esencialmente, el tercer sintetizador de arriba.');

  p.util('Casi todo lo grabado lleva reverberación añadida; sin ella, una voz suena «en una caja». ' +
    'Los estudios usan salas que la tienen medida, y los programas la imitan grabando el eco de un ' +
    'disparo en una catedral real y aplicándoselo a cualquier sonido (la <em>respuesta al impulso</em>). ' +
    'El sonar y la ecografía son ecos usados para medir: el tiempo de vuelta multiplicado por la ' +
    'velocidad del sonido, dividido por dos. Y el acople que pita en un concierto es un eco entre el ' +
    'micrófono y el altavoz con $g > 1$: la serie que diverge.');

  p.trampas([
    { e: 'Poner $g = 1$ «para que el eco se oiga bien»', por: 'Con $g = 1$ nunca se apaga; con $g > 1$ se desboca. El eco natural tiene $g$ bastante menor que 1, y la reverberación, retardos cortos con $g$ alto.' },
    { e: 'Retrasar la entrada en vez de la salida', por: '<code>x + g * x(t - d)</code> da un solo eco. El eco del eco sale de retrasar la <em>salida</em>: <code>antes(d)</code>.' },
    { e: 'Retardos múltiplos entre sí en una reverberación', por: 'Coinciden periódicamente y se oye un eco, o un peine. Los retardos se eligen primos entre sí o «feos».' },
    { e: 'Creer que un retardo de 1 ms no se oye', por: 'No se oye como eco, pero se oye como timbre: un peine con dientes cada 1000 Hz. Lo corto se convierte en filtro.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La altura de un eco',
    level: 'basico',
    gen: function (r) {
      var g = r.pick([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]), k = r.int(2, 6), d = r.pick([0.1, 0.2, 0.25, 0.3, 0.5]);
      return { g: g, k: k, d: d, h: Math.pow(g, k), t: k * d };
    },
    ask: function (d) { return 'Eco con $g = ' + U.fmt(d.g, 1) + '$ y $d = ' + U.fmt(d.d, 2) + '$ s. ¿Qué altura tiene el eco número $' + d.k + '$ respecto al original, y en qué instante suena? (tres y dos decimales)'; },
    fields: [{ name: 'h', label: 'altura', w: 'wide' }, { name: 't', label: 't (s)', w: 'wide' }],
    sol: function (d) { return { h: U.round(d.h, 6), t: U.round(d.t, 6) }; },
    dec: { h: 3, t: 2 },
    hint: function () { return 'Altura $g^k$, instante $k\\,d$.'; },
    steps: function (d) { return ['$' + U.fmt(d.g, 1) + '^{' + d.k + '} = ' + U.fmt(d.h, 3) + '$, en $t = ' + d.k + '\\cdot ' + U.fmt(d.d, 2) + ' = ' + U.fmt(d.t, 2) + '$ s.']; },
    answer: function (d) { return U.fmt(d.h, 3) + ' en t = ' + U.fmt(d.t, 2) + ' s'; }
  });

  p.exercise({
    title: 'La suma de todos los ecos',
    level: 'basico',
    gen: function (r) {
      var g = r.pick([0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9]);
      return { g: g, S: 1 / (1 - g) };
    },
    ask: function (d) { return 'Con $g = ' + U.fmt(d.g, 2) + '$, ¿cuánto suman el original y todos sus ecos, $1 + g + g^2 + \\cdots$? (dos decimales)'; },
    fields: [{ name: 'S', label: 'suma', w: 'tiny' }],
    sol: function (d) { return { S: U.round(d.S, 6) }; },
    dec: 2,
    hint: function () { return 'Serie geométrica: $\\frac{1}{1 - g}$ si $|g| < 1$.'; },
    steps: function (d) { return ['$\\dfrac{1}{1 - ' + U.fmt(d.g, 2) + '} = ' + U.fmt(d.S, 2) + '$.']; },
    answer: function (d) { return U.fmt(d.S, 2); }
  });

  p.exercise({
    title: 'Los dientes del peine',
    level: 'medio',
    gen: function (r) {
      var ms = r.pick([0.5, 1, 1.25, 2, 2.5, 4, 5, 10]);
      return { ms: ms, f1: 1000 / ms, hueco: 500 / ms };
    },
    ask: function (d) { return 'Una señal se suma con ella misma retrasada $' + U.fmt(d.ms, 2) + '$ ms. ¿A qué frecuencia está el primer refuerzo (diente) y a cuál el primer hueco? (un decimal)'; },
    fields: [{ name: 'f1', label: 'diente (Hz)', w: 'wide' }, { name: 'h', label: 'hueco (Hz)', w: 'wide' }],
    sol: function (d) { return { f1: U.round(d.f1, 4), h: U.round(d.hueco, 4) }; },
    dec: 1,
    hint: function () { return ['Refuerzo cuando cabe un periodo entero en el retardo: $f = 1/d$.', 'Hueco cuando cabe medio: $f = \\frac{1}{2d}$.']; },
    steps: function (d) { return ['Diente: $1/' + U.fmt(d.ms / 1000, 4) + ' = ' + U.fmt(d.f1, 1) + '$ Hz (y sus múltiplos).', 'Hueco: $\\frac{1}{2\\cdot ' + U.fmt(d.ms / 1000, 4) + '} = ' + U.fmt(d.hueco, 1) + '$ Hz (y luego cada $' + U.fmt(d.f1, 1) + '$ Hz más).']; },
    answer: function (d) { return 'diente ' + U.fmt(d.f1, 1) + ' Hz, hueco ' + U.fmt(d.hueco, 1) + ' Hz'; }
  });

  p.exercise({
    title: 'El tiempo de reverberación',
    level: 'medio',
    gen: function (r) {
      var d = r.pick([0.02, 0.03, 0.04, 0.05, 0.08, 0.1]), g = r.pick([0.5, 0.6, 0.7, 0.8, 0.9, 0.95]);
      var k = Math.log(0.001) / Math.log(g);
      return { d: d, g: g, k: k, T: k * d };
    },
    ask: function (d) { return 'Eco realimentado con $d = ' + U.fmt(d.d, 2) + '$ s y $g = ' + U.fmt(d.g, 2) + '$. ¿Cuántos ecos hacen falta para bajar a la milésima (60 dB), y cuánto vale entonces $T_{60}$? (un decimal, dos decimales)'; },
    fields: [{ name: 'k', label: 'ecos', w: 'tiny' }, { name: 'T', label: 'T₆₀ (s)', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.k, 4), T: U.round(d.T, 6) }; },
    dec: { k: 1, T: 2 },
    hint: function () { return ['$g^k = 0{,}001 \\Rightarrow k = \\ln 0{,}001 / \\ln g$.', '$T_{60} = k\\,d$.']; },
    steps: function (d) { return ['$k = \\dfrac{\\ln 0{,}001}{\\ln ' + U.fmt(d.g, 2) + '} = ' + U.fmt(d.k, 1) + '$ ecos.', '$T_{60} = ' + U.fmt(d.k, 1) + '\\cdot ' + U.fmt(d.d, 2) + ' = ' + U.fmt(d.T, 2) + '$ s' + (d.T < 0.6 ? ': una habitación.' : (d.T < 2.5 ? ': una sala.' : ': una catedral.'))]; },
    answer: function (d) { return U.fmt(d.k, 1) + ' ecos, ' + U.fmt(d.T, 2) + ' s'; }
  });

  p.exercise({
    title: 'Sabine',
    level: 'medio',
    gen: function (r) {
      var V = r.pick([60, 150, 400, 2000, 8000, 15000]), A = r.pick([5, 10, 20, 50, 100, 300]);
      var T = 0.161 * V / A;
      if (T > 12 || T < 0.05) return null;
      return { V: V, A: A, T: T };
    },
    ask: function (d) { return 'Una sala de $' + U.miles(d.V) + '$ m³ con absorción total $A = ' + d.A + '$ m². ¿Cuál es su tiempo de reverberación según Sabine? (dos decimales)'; },
    fields: [{ name: 'T', label: 'T₆₀ (s)', w: 'wide' }],
    sol: function (d) { return { T: U.round(d.T, 6) }; },
    dec: 2,
    hint: function () { return '$T_{60} = 0{,}161\\,V/A$.'; },
    steps: function (d) { return ['$0{,}161\\cdot ' + U.miles(d.V) + ' / ' + d.A + ' = ' + U.fmt(d.T, 2) + '$ s.']; },
    answer: function (d) { return U.fmt(d.T, 2) + ' s'; }
  });

  p.exercise({
    title: 'Escribe el eco',
    level: 'avanzado',
    gen: function (r) {
      var d = r.pick([0.2, 0.25, 0.3, 0.4]), g = r.pick([0.4, 0.5, 0.6]);
      return { d: d, g: g, ref: '0.5 * decae(t, 0.03) * sin(TAU * 550 * t) + ' + g + ' * antes(' + d + ')' };
    },
    ask: function (d) {
      return 'Un golpe, <code>0.5 * decae(t, 0.03) * sin(TAU * 550 * t)</code>, con un <strong>eco realimentado</strong> de retardo <strong>' + U.fmt(d.d, 2) + ' s</strong> y ganancia <strong>' + U.fmt(d.g, 1) + '</strong>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: 'golpe + g * antes(d)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 2, tolEnvolvente: 0.9 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (!/antes|anterior/.test(texto)) return { ok: false, msg: 'Un eco necesita el pasado: <code>antes(' + d.d + ')</code>.' };
        if (r.envolvente < 0.9) return { ok: false, msg: 'Hay eco, pero no con ese retardo o esa ganancia: los golpes tienen que caer cada ' + U.fmt(d.d, 2) + ' s, cada uno ' + U.fmt(d.g, 1) + ' veces el anterior.' };
        return { ok: false, msg: 'El golpe no es el pedido: cópialo tal cual del enunciado.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['El golpe tal cual, más la ganancia por la salida de hace $' + U.fmt(d.d, 2) + '$ s.', '<code>antes(' + d.d + ')</code> es esa salida.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'Con $g = ' + U.fmt(d.g, 1) + '$ el eco $k$ vale $' + U.fmt(d.g, 1) + '^k$: la serie suma $' + U.fmt(1 / (1 - d.g), 2) + '$ veces el golpe.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Eco realimentado: $y(t) = x(t) + g\\,y(t - d)$, en el sintetizador <code>x + g * antes(d)</code>. Un golpe se convierte en la sucesión $1, g, g^2, \\ldots$',
    'La suma de todos los ecos es $\\frac{1}{1-g}$ si $|g| < 1$; con $g \\ge 1$ la serie diverge y el sonido se desboca (el acople).',
    'Retardos por debajo de 30 ms no se oyen como eco sino como timbre: un peine con dientes cada $1/d$ Hz, que suena a nota.',
    'La reverberación son miles de ecos con retardos «feos»; se mide con $T_{60}$, el tiempo en bajar 60 dB, y Sabine lo da como $0{,}161\\,V/A$.',
    'Para bajar a la milésima hacen falta $\\ln 0{,}001/\\ln g$ ecos: potencias y logaritmos, otra vez.'
  ]);
});
