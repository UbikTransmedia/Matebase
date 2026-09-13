/* Tema: La envolvente: el sonido en el tiempo */
Course.topic('son-envolvente', function (p) {

  p.puente('Los senos de [[son-onda]] sonaban siempre igual, de principio a fin: una nota que no ' +
    'empieza ni acaba. Ningún instrumento hace eso. Una nota de piano golpea y se apaga; una de ' +
    'flauta crece despacio; una de órgano se mantiene mientras se tiene la tecla pulsada. Ese ' +
    'perfil en el tiempo se llama <strong>envolvente</strong>, y es una [[fn-racionales|función definida ' +
    'a trozos]] con una [[fn-exp-log|exponencial]] dentro, multiplicando a la onda.');

  p.section('Una función que multiplica a otra');

  p.text('La onda dice <em>qué</em> suena: la frecuencia, la forma. La envolvente dice <em>cuánto</em> ' +
    'suena en cada instante: es un número entre 0 y 1 que va cambiando despacio —en milisegundos o ' +
    'segundos, no en fracciones de oscilación— y que multiplica a la onda.');

  p.formula('y(t) = e(t)\\cdot s(t)', 'envolvente por onda',
    'Se lee: <em>«y de te es e de te por ese de te»</em>. $s(t)$ es la onda de siempre, por ejemplo ' +
      '$\\operatorname{sen}(2\\pi f t)$, que oscila cientos de veces por segundo. $e(t)$ es la ' +
      'envolvente, que sube y baja mucho más despacio. El producto es una oscilación rápida cuyo ' +
      'tamaño lo dicta la lenta: en la gráfica, la envolvente es la línea que pasa por las crestas, y ' +
      'de ahí el nombre.');

  p.note('Multiplicar, no sumar. Si se suma la envolvente a la onda, la onda sigue con la misma ' +
    'amplitud y lo único que hace es subir y bajar de sitio: se oye igual de fuerte todo el rato, ' +
    'y encima con un golpe grave al principio. Lo que apaga una nota es <strong>multiplicarla</strong> ' +
    'por algo que tiende a cero.', 'warn', 'El error que suena raro');

  p.demo({
    title: 'Una nota que se apaga',
    intro: 'Un seno multiplicado por una exponencial decreciente. Pulsa «Tocar» (esta vez no se repite: suena una vez, dos segundos) y mueve la constante de tiempo: cuanto más pequeña, más rápido se apaga. La tira de abajo enseña la envolvente entera.',
    predice: 'Con $\\tau = 0{,}3$ s, ¿la nota se habrá apagado del todo a los dos segundos, o todavía se oirá? Calcula $e^{-2/0{,}3}$ antes de tocar.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-envolvente-1', dur: 2, loop: false, ventana: 20,
        mandos: [{ n: 'tau', label: 'constante de tiempo τ (s)', min: 0.05, max: 2, step: 0.05, value: 0.3, dec: 2 }],
        codigo:
          'function sonido(t) {\n' +
          '    var e = exp(-t / tau);          // la envolvente: 1 al empezar, cae hacia 0\n' +
          '    var s = sin(TAU * 440 * t);     // la onda\n' +
          '    return 0.6 * e * s;\n' +
          '}\n',
        nota: 'Con $\\tau = 0{,}05$ suena a golpe seco, casi a percusión; con $\\tau = 2$, a nota de ' +
          'órgano que alguien va bajando. La frecuencia no cambia: solo cómo se reparte el volumen en el tiempo.'
      });
    }
  });

  p.section('La caída exponencial');

  p.text('Casi todo lo que se apaga en la naturaleza se apaga así: una cuerda que vibra pierde en cada ' +
    'segundo la misma <em>fracción</em> de su energía, no la misma cantidad. Eso es exactamente la ' +
    '[[fn-exp-log|exponencial decreciente]].');

  p.formula('e(t) = e^{-t/\\tau}', 'la caída exponencial y su constante de tiempo',
    'Se lee: <em>«e de te es e elevado a menos te partido por tau»</em>. La letra griega $\\tau$ ' +
      '(tau) es la <strong>constante de tiempo</strong>: en $t = \\tau$ la envolvente vale ' +
      '$e^{-1} \\approx 0{,}37$, ha caído al 37 %. En $2\\tau$ queda el 13 %; en $3\\tau$, el 5 %; en ' +
      '$5\\tau$, menos del 1 %. Una regla útil: <strong>la nota deja de oírse a los cinco o seis ' +
      'tau</strong>.');

  p.formula('t_{1/2} = \\tau\\ln 2 \\approx 0{,}69\\,\\tau', 'el tiempo de bajar a la mitad',
    'Es la misma cuenta que la semivida de un isótopo radiactivo: se resuelve $e^{-t/\\tau} = ' +
      '\\frac{1}{2}$ tomando logaritmos. Y al revés: si se sabe que una nota tarda 0,4 s en bajar a ' +
      'la mitad, su constante de tiempo es $0{,}4/\\ln 2 \\approx 0{,}58$ s.');

  p.ejemplo({
    title: 'Cuánto tarda en apagarse',
    enunciado: 'Una nota se apaga con $e(t) = e^{-t/0{,}5}$. ¿Cuánto vale la envolvente a los 0,5 s y al segundo? ¿Cuándo baja a la mitad? ¿Cuándo baja del 1 %, que es cuando se deja de oír?',
    pasos: [
      { t: '<strong>En $t = \\tau = 0{,}5$.</strong> $e^{-1} \\approx 0{,}368$: queda el 37 %.', antes: 'Sustituye. ¿Qué exponente sale?' },
      { t: '<strong>En $t = 1$.</strong> $e^{-2} \\approx 0{,}135$: el 13,5 %. Cada medio segundo se multiplica por el mismo 0,368.' },
      { t: '<strong>A la mitad.</strong> $e^{-t/0{,}5} = 0{,}5 \\Rightarrow -\\dfrac{t}{0{,}5} = \\ln 0{,}5 \\Rightarrow t = 0{,}5\\ln 2 \\approx 0{,}347$ s.', antes: 'Plantea la ecuación y toma logaritmos.' },
      { t: '<strong>Al 1 %.</strong> $e^{-t/0{,}5} = 0{,}01 \\Rightarrow t = -0{,}5\\ln 0{,}01 = 0{,}5\\cdot 4{,}605 \\approx 2{,}3$ s. Son $4{,}6\\,\\tau$: la regla de «cinco tau» funciona.', antes: 'Misma ecuación con 0,01. ¿Cuántas veces $\\tau$ es?' },
      { t: '<strong>Comprobar oyendo.</strong> En el sintetizador de arriba, con $\\tau = 0{,}5$, la nota se oye claramente el primer segundo, flojo el segundo, y a los 2,3 s ya no está.' }
    ],
    cierre: 'La constante de tiempo no es «cuánto dura»: es la escala. La nota dura unas cinco veces $\\tau$, y baja a la mitad en $0{,}69\\,\\tau$.'
  });

  p.section('Ataque, caída, sostenido, liberación');

  p.text('Una caída exponencial no basta para una flauta, que empieza despacio, ni para un órgano, que ' +
    'se mantiene. Los sintetizadores usan desde 1965 una envolvente de cuatro tramos, ' +
    '<strong>ADSR</strong> por sus siglas en inglés, que es una función definida a trozos:');

  p.formula('e(t) = \\begin{cases} t/a & 0 \\le t < a \\\\ 1 - (1 - s)\\,\\dfrac{t - a}{d} & a \\le t < a + d \\\\ s & a + d \\le t < D \\\\ s\\left(1 - \\dfrac{t - D}{r}\\right) & D \\le t < D + r \\\\ 0 & \\text{después} \\end{cases}', 'ADSR: cuatro rectas',
    '<strong>Ataque</strong> ($a$): el tiempo que tarda en subir de 0 a 1. <strong>Caída</strong> ' +
      '($d$, <em>decay</em>): lo que tarda en bajar de 1 al nivel de sostenido. <strong>Sostenido</strong> ' +
      '($s$): el nivel, entre 0 y 1, que mantiene mientras la nota dura, hasta $D$. ' +
      '<strong>Liberación</strong> ($r$, <em>release</em>): lo que tarda en apagarse desde que se ' +
      'suelta la tecla.<br><br>Es una función a trozos como las de [[fn-racionales|funciones a trozos]], ' +
      'continua en los empalmes. En el código está hecha: <code>adsr(t, a, d, s, r, D)</code>.');

  p.demo({
    title: 'Cuatro mandos, cuatro tramos',
    intro: 'La nota dura un segundo y luego se suelta. Mueve los cuatro parámetros: la tira de abajo dibuja la envolvente resultante y el sonido la sigue. Prueba ataque 0 y caída corta para una percusión; ataque largo y sostenido alto para un viento.',
    predice: 'Con $a = 0{,}5$ y $d = 0{,}2$, ¿en qué instante alcanzará la envolvente su máximo? ¿Y en cuál llegará al nivel de sostenido?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-envolvente-2', dur: 2, loop: false, ventana: 20,
        mandos: [
          { n: 'a', label: 'ataque a (s)', min: 0, max: 0.8, step: 0.02, value: 0.02, dec: 2 },
          { n: 'd', label: 'caída d (s)', min: 0, max: 0.8, step: 0.02, value: 0.2, dec: 2 },
          { n: 's', label: 'sostenido s', min: 0, max: 1, step: 0.05, value: 0.6, dec: 2 },
          { n: 'r', label: 'liberación r (s)', min: 0.02, max: 1, step: 0.02, value: 0.3, dec: 2 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var e = adsr(t, a, d, s, r, 1.0);   // la nota se suelta en t = 1 s\n' +
          '    return 0.5 * e * triangulo(220, t);\n' +
          '}\n',
        nota: 'Con $a = 0$ el sonido empieza de golpe y se oye un pequeño clic: es la onda arrancando ' +
          'en mitad de una oscilación. Un ataque de 5 milésimas ya lo evita, y por eso ningún ' +
          'sintetizador permite un ataque exactamente cero.'
      });
    }
  });

  p.comprueba('Quieres un sonido de xilófono: un golpe que se apaga en medio segundo. ¿Qué envolvente?', [
    { t: 'Ataque casi cero, caída corta hasta un sostenido cero', ok: true, por: 'El golpe es instantáneo (ataque 0) y luego solo hay caída: sostenido cero, porque nadie «mantiene» un xilófono. La liberación no importa, porque ya está en cero.' },
    { t: 'Ataque de medio segundo y sostenido alto', ok: false, por: 'Eso es una flauta o un violín entrando despacio y aguantando la nota. Un golpe no crece: empieza a tope y baja.' },
    { t: 'Sostenido 1 y liberación larga', ok: false, por: 'Eso mantendría la nota al máximo mientras dure y la apagaría al soltar: un órgano. El xilófono baja desde el primer instante.' }
  ]);

  p.text('Un detalle que se aprende oyendo: el <strong>ataque es lo que más identifica un ' +
    'instrumento</strong>. Si se recorta el primer cuarto de segundo de una grabación de piano y de ' +
    'una de guitarra, cuesta distinguirlas; con el ataque, nadie las confunde. El oído decide en los ' +
    'primeros milisegundos.');

  p.hist('La envolvente ADSR la propuso el compositor Vladimir Ussachevsky en 1965 para el sintetizador ' +
    'modular de Robert Moog, como una forma de que una máquina imitara el «gesto» de un instrumento: no ' +
    'la nota, sino cómo entra y cómo sale. Antes, los primeros sintetizadores sonaban como sirenas, ' +
    'porque la nota se encendía y apagaba sin más. Los cuatro mandos siguen estando, con los mismos ' +
    'nombres, en cualquier sintetizador o programa de música de hoy, sesenta años después.');

  p.util('La misma exponencial decreciente aparece cada vez que algo se descarga a un ritmo proporcional ' +
    'a lo que le queda: un condensador, la espuma de un refresco, la temperatura de un café, la ' +
    'concentración de un fármaco en sangre o la reverberación de una sala, que se mide precisamente ' +
    'por el tiempo que tarda el sonido en caer 60 decibelios, unas $6{,}9\\,\\tau$. Y el «fundido» de ' +
    'una canción al final, o de una imagen en una película, es una envolvente aplicada a mano.');

  p.trampas([
    { e: 'Sumar la envolvente a la onda', por: 'La amplitud no cambia y aparece un golpe grave. Lo que apaga es <em>multiplicar</em>: $e(t)\\cdot s(t)$.' },
    { e: '«$\\tau$ es lo que dura la nota»', por: 'En $t = \\tau$ todavía queda el 37 %. La nota se deja de oír hacia $5\\tau$, y baja a la mitad en $0{,}69\\,\\tau$.' },
    { e: 'Una envolvente que baja de cero', por: 'Un valor negativo no apaga: invierte la onda y sigue sonando igual de fuerte. La envolvente va entre 0 y 1.' },
    { e: 'Ataque exactamente cero', por: 'La onda arranca de golpe y se oye un clic. Cinco milisegundos de ataque lo evitan sin que se note la subida.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánto queda',
    level: 'basico',
    gen: function (r) {
      var tau = r.pick([0.1, 0.2, 0.25, 0.5, 0.8, 1]), t = r.pick([0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2]);
      return { tau: tau, t: t, v: Math.exp(-t / tau) };
    },
    ask: function (d) { return 'Una envolvente cae como $e(t) = e^{-t/' + U.fmt(d.tau, 2).replace(',', '{,}') + '}$. ¿Cuánto vale en $t = ' + U.fmt(d.t, 2) + '$ s? (tres decimales)'; },
    fields: [{ name: 'v', label: 'e(t)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.v - Math.exp(-d.tau / d.t)) < 5e-4 && Math.abs(d.tau - d.t) > 1e-9; }, msg: 'Has dividido al revés: el exponente es $-t/\\tau$, el tiempo entre la constante.' }],
    hint: function () { return 'Sustituye y calcula $e^{-t/\\tau}$ con la calculadora.'; },
    steps: function (d) { return ['$e^{-' + U.fmt(d.t, 2) + '/' + U.fmt(d.tau, 2) + '} = e^{' + U.fmt(-d.t / d.tau, 3) + '} \\approx ' + U.fmt(d.v, 3) + '$: queda el ' + U.fmt(100 * d.v, 1) + ' %.']; },
    answer: function (d) { return U.fmt(d.v, 3); }
  });

  p.exercise({
    title: 'En qué tramo estamos',
    level: 'basico',
    gen: function (r) {
      var a = r.pick([0.05, 0.1, 0.2, 0.3]), d = r.pick([0.1, 0.2, 0.3]), D = r.pick([0.8, 1, 1.2]), rr = r.pick([0.2, 0.4]);
      var t = r.pick([a / 2, a + d / 2, (a + d + D) / 2, D + rr / 2, D + rr + 0.2]);
      t = Math.round(t * 100) / 100;
      var tramo = t < a ? 'ataque' : (t < a + d ? 'caida' : (t < D ? 'sostenido' : (t < D + rr ? 'liberacion' : 'silencio')));
      return { a: a, d: d, D: D, r: rr, t: t, tramo: tramo };
    },
    ask: function (d) { return 'Una envolvente ADSR tiene ataque $' + U.fmt(d.a, 2) + '$ s, caída $' + U.fmt(d.d, 2) + '$ s, y la nota se suelta en $D = ' + U.fmt(d.D, 1) + '$ s con liberación $' + U.fmt(d.r, 1) + '$ s. En $t = ' + U.fmt(d.t, 2) + '$ s, ¿en qué tramo está?'; },
    fields: [{ name: 't', label: 'Tramo', opts: [{ t: 'ataque', v: 'ataque' }, { t: 'caída', v: 'caida' }, { t: 'sostenido', v: 'sostenido' }, { t: 'liberación', v: 'liberacion' }, { t: 'ya en silencio', v: 'silencio' }] }],
    sol: function (d) { return { t: d.tramo }; },
    hint: function () { return 'Los tramos van seguidos: ataque hasta $a$, caída hasta $a + d$, sostenido hasta $D$, liberación hasta $D + r$.'; },
    steps: function (d) { return ['Fronteras: $a = ' + U.fmt(d.a, 2) + '$, $a + d = ' + U.fmt(d.a + d.d, 2) + '$, $D = ' + U.fmt(d.D, 1) + '$, $D + r = ' + U.fmt(d.D + d.r, 1) + '$.', '$t = ' + U.fmt(d.t, 2) + '$ cae en el tramo de <strong>' + { ataque: 'ataque', caida: 'caída', sostenido: 'sostenido', liberacion: 'liberación', silencio: 'silencio' }[d.tramo] + '</strong>.']; },
    answer: function (d) { return d.tramo; }
  });

  p.exercise({
    title: 'De la semivida a la constante de tiempo',
    level: 'medio',
    gen: function (r) {
      var th = r.pick([0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.7]);
      return { th: th, tau: th / Math.LN2 };
    },
    ask: function (d) { return 'Una nota tarda $' + U.fmt(d.th, 2) + '$ s en bajar a la mitad de su amplitud. ¿Cuál es la constante de tiempo $\\tau$ de su caída exponencial? (tres decimales)'; },
    fields: [{ name: 'tau', label: 'τ (s)', w: 'wide' }],
    sol: function (d) { return { tau: U.round(d.tau, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.tau - d.th * Math.LN2) < 5e-4; }, msg: 'Al revés: $t_{1/2} = \\tau\\ln 2$, así que $\\tau = t_{1/2}/\\ln 2$, que es mayor que la semivida.' }],
    hint: function () { return 'Resuelve $e^{-t/\\tau} = 1/2$: sale $t = \\tau\\ln 2$. Despeja $\\tau$.'; },
    steps: function (d) { return ['$e^{-t/\\tau} = \\tfrac{1}{2} \\Rightarrow t = \\tau\\ln 2$.', '$\\tau = \\dfrac{' + U.fmt(d.th, 2) + '}{\\ln 2} = \\dfrac{' + U.fmt(d.th, 2) + '}{0{,}6931} \\approx ' + U.fmt(d.tau, 3) + '$ s.']; },
    answer: function (d) { return U.fmt(d.tau, 3) + ' s'; }
  });

  p.exercise({
    title: 'Cuándo deja de oírse',
    level: 'medio',
    gen: function (r) {
      var tau = r.pick([0.1, 0.2, 0.3, 0.5, 0.8, 1.2]), pct = r.pick([10, 5, 1, 0.1]);
      return { tau: tau, pct: pct, t: -tau * Math.log(pct / 100) };
    },
    ask: function (d) { return 'Con $\\tau = ' + U.fmt(d.tau, 1) + '$ s, ¿en qué instante la envolvente $e^{-t/\\tau}$ baja al $' + U.fmt(d.pct, d.pct < 1 ? 1 : 0) + '\\,\\%$? (tres decimales)'; },
    fields: [{ name: 't', label: 't (s)', w: 'wide' }],
    sol: function (d) { return { t: U.round(d.t, 6) }; },
    dec: 3,
    hint: function () { return 'Resuelve $e^{-t/\\tau} = p$ tomando logaritmos: $t = -\\tau\\ln p$, con $p$ en tanto por uno.'; },
    steps: function (d) { return ['$e^{-t/' + U.fmt(d.tau, 1) + '} = ' + U.fmt(d.pct / 100, d.pct < 1 ? 3 : 2) + '$', '$t = -' + U.fmt(d.tau, 1) + '\\ln ' + U.fmt(d.pct / 100, d.pct < 1 ? 3 : 2) + ' = ' + U.fmt(d.tau, 1) + '\\cdot ' + U.fmt(-Math.log(d.pct / 100), 3) + ' \\approx ' + U.fmt(d.t, 3) + '$ s, que son $' + U.fmt(d.t / d.tau, 1) + '\\,\\tau$.']; },
    answer: function (d) { return U.fmt(d.t, 3) + ' s'; }
  });

  p.exercise({
    title: 'Lee la envolvente',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick([0.1, 0.2, 0.4]), dd = r.pick([0.2, 0.3, 0.5]), s = r.pick([0.3, 0.5, 0.6, 0.8]), D = 1.5, rr = r.pick([0.4, 0.5, 1]);
      var t = r.pick([a / 2, a + dd / 4, a + dd / 2, a + 3 * dd / 4, 1, D + rr / 4, D + rr / 2]);
      t = Math.round(t * 1000) / 1000;
      var e = SON.f.adsr(t, a, dd, s, rr, D);
      return { a: a, d: dd, s: s, D: D, r: rr, t: t, e: e };
    },
    ask: function (d) { return 'Envolvente ADSR con $a = ' + U.fmt(d.a, 1) + '$, $d = ' + U.fmt(d.d, 1) + '$, $s = ' + U.fmt(d.s, 1) + '$, $r = ' + U.fmt(d.r, 1) + '$, y la nota se suelta en $D = 1{,}5$ s. Calcula $e(' + U.fmt(d.t, 3) + ')$ (tres decimales).'; },
    fields: [{ name: 'e', label: 'e(t)', w: 'wide' }],
    sol: function (d) { return { e: U.round(d.e, 6) }; },
    dec: 3,
    hint: function () { return ['Primero decide el tramo: ataque, caída, sostenido o liberación.', 'Cada tramo es una recta: sustituye en la fórmula del tramo.']; },
    steps: function (d) {
      var t = d.t, tr;
      if (t < d.a) tr = 'Ataque: $e = t/a = ' + U.fmt(t, 3) + '/' + U.fmt(d.a, 1) + ' = ' + U.fmt(d.e, 3) + '$.';
      else if (t < d.a + d.d) tr = 'Caída: $e = 1 - (1 - s)\\dfrac{t - a}{d} = 1 - ' + U.fmt(1 - d.s, 1) + '\\cdot\\dfrac{' + U.fmt(t - d.a, 3) + '}{' + U.fmt(d.d, 1) + '} = ' + U.fmt(d.e, 3) + '$.';
      else if (t < d.D) tr = 'Sostenido: $e = s = ' + U.fmt(d.s, 1) + '$.';
      else tr = 'Liberación: $e = s\\left(1 - \\dfrac{t - D}{r}\\right) = ' + U.fmt(d.s, 1) + '\\left(1 - \\dfrac{' + U.fmt(t - d.D, 3) + '}{' + U.fmt(d.r, 1) + '}\\right) = ' + U.fmt(d.e, 3) + '$.';
      return [tr];
    },
    answer: function (d) { return U.fmt(d.e, 3); }
  });

  p.exercise({
    title: 'Escribe la nota que se apaga',
    level: 'avanzado',
    gen: function (r) {
      var f = r.pick([220, 330, 440, 660]), tau = r.pick([0.2, 0.3, 0.5]);
      return { f: f, tau: tau, ref: 'exp(-t / ' + tau + ') * 0.5 * sin(TAU * ' + f + ' * t)' };
    },
    ask: function (d) {
      return 'Completa la función: un tono de <strong>' + d.f + ' Hz</strong>, amplitud inicial 0,5, que se apaga con una caída exponencial de constante de tiempo <strong>τ = ' + U.fmt(d.tau, 1) + ' s</strong>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: 'exp(-t / tau) * A * sin(TAU * f * t)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 1.5 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (r.espectro < 0.9) return { ok: false, msg: 'La frecuencia no es ' + d.f + ' Hz. Revisa el seno.' };
        if (r.envolvente < 0.95) return { ok: false, msg: 'La nota no se apaga como se pedía. La caída es <code>exp(-t / ' + d.tau + ')</code>, y tiene que <em>multiplicar</em> al seno.' };
        return { ok: false, msg: 'La amplitud inicial tiene que ser 0,5.' };
      }
      return { ok: true };
    },
    hint: function () { return ['La envolvente es <code>exp(-t / tau)</code>.', 'Y multiplica a la onda: <code>exp(-t / tau) * 0.5 * sin(TAU * f * t)</code>.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'También vale <code>decae(t, ' + d.tau + ') * 0.5 * sin(TAU * ' + d.f + ' * t)</code>: <code>decae</code> es la misma exponencial con nombre.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'La envolvente $e(t)$ <strong>multiplica</strong> a la onda: $y = e(t)\\,s(t)$. Sumarla no apaga nada.',
    'La caída natural es exponencial, $e^{-t/\\tau}$: en $\\tau$ queda el 37 %, baja a la mitad en $0{,}69\\,\\tau$ y deja de oírse hacia $5\\tau$.',
    'ADSR es una función a trozos de cuatro rectas: ataque, caída, sostenido y liberación. En el código, <code>adsr(t, a, d, s, r, D)</code>.',
    'El ataque es lo que más identifica a un instrumento; un ataque de cero produce un clic.'
  ]);
});
