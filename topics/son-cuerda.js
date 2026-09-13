/* Tema: La cuerda y el tubo: de dónde salen los armónicos */
Course.topic('son-cuerda', function (p) {

  p.puente('En [[son-armonicos]] los armónicos aparecían como un hecho: una cuerda vibra a $f$, $2f$, ' +
    '$3f$… Este tema explica por qué son múltiplos exactos, y la explicación es geometría de ondas: ' +
    'una que va y otra que vuelve, sumadas con una de las [[tr-identidades|identidades ' +
    'trigonométricas]], dan una onda que no se mueve. Y una onda que no se mueve entre dos puntos ' +
    'fijos solo puede tener unas longitudes concretas.');

  p.section('Dos ondas que viajan, una que se queda');

  p.text('Al pulsar una cuerda se produce una deformación que viaja hacia los extremos a una velocidad ' +
    '$v$ que depende de la cuerda. En cada extremo, que está fijo, la onda <strong>rebota</strong> ' +
    'invertida y vuelve. Así que en la cuerda hay siempre dos ondas iguales viajando en sentidos ' +
    'contrarios. Lo que se ve es la suma, y para sumarlas basta una identidad de [[tr-identidades|primero]]:');

  p.formula('\\operatorname{sen}(kx - \\omega t) + \\operatorname{sen}(kx + \\omega t) = 2\\,\\operatorname{sen}(kx)\\cos(\\omega t)', 'la onda estacionaria',
    'Se lee: <em>«seno de ka equis menos omega te, más seno de ka equis más omega te, es dos por seno ' +
      'de ka equis por coseno de omega te»</em>.<br><br>Es la identidad de la suma de senos como ' +
      'producto, y lo que dice es asombroso: el resultado ya no tiene $x$ y $t$ mezclados. Su forma en ' +
      'el espacio es $\\operatorname{sen}(kx)$, <strong>siempre la misma</strong>, y lo único que hace ' +
      'el tiempo es multiplicarla por $\\cos(\\omega t)$: la curva se hincha y se deshincha sin ' +
      'desplazarse. Por eso se llama <em>estacionaria</em>. Hay puntos que no se mueven nunca, donde ' +
      '$\\operatorname{sen}(kx) = 0$ —los <strong>nodos</strong>—, y puntos que oscilan al máximo, los ' +
      '<strong>vientres</strong>.');

  p.demo({
    title: 'La cuerda, modo a modo',
    intro: 'Una cuerda fija en los dos extremos vibrando en su modo n. Las curvas finas son la cuerda en distintos instantes de la oscilación; la gruesa, en el instante que marca el mando. Los nodos no se mueven nunca.',
    predice: 'En el modo $n = 3$, ¿cuántos puntos de la cuerda, sin contar los extremos, se quedan quietos? ¿Y cuántas «jorobas» hay?',
    build: function (host) {
      var n = 1, fase = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.05, xmax: 1.05, ymin: -1.3, ymax: 1.3, height: 260, xlabel: 'x / L',
        aria: 'Una cuerda fija en sus dos extremos vibrando en un modo: n semiondas, con nodos quietos y vientres que oscilan',
        draw: function (g) {
          for (var k = 0; k < 8; k++) {
            var ph = k / 8 * Math.PI;
            g.fn(function (x) { return x < 0 || x > 1 ? NaN : Math.sin(n * Math.PI * x) * Math.cos(ph); }, { color: 'axis', w: 1, alpha: 0.25, from: 0, to: 1 });
          }
          g.fn(function (x) { return x < 0 || x > 1 ? NaN : Math.sin(n * Math.PI * x) * Math.cos(fase); }, { color: 0, w: 3, from: 0, to: 1 });
          for (var j = 0; j <= n; j++) g.point(j / n, 0, { color: 2, r: 5 });
          g.point(0, 0, { color: 'ink', r: 6 }); g.point(1, 0, { color: 'ink', r: 6 });
        }
      });
      function pinta() {
        out.set('Modo $n = ' + n + '$: $y(x, t) = \\operatorname{sen}\\left(' + (n === 1 ? '' : n) + '\\pi\\dfrac{x}{L}\\right)\\cos(\\omega_' + n + ' t)$, con $' + (n - 1) + '$ nodo' + (n === 2 ? '' : 's') + ' interior' + (n === 2 ? '' : 'es') + ', $' + n + '$ vientre' + (n === 1 ? '' : 's') + ', longitud de onda $\\lambda = \\dfrac{2L}{' + n + '}$ y frecuencia $f_' + n + ' = ' + n + ' f_1$.');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'modo n', min: 1, max: 6, step: 1, value: n, on: function (v) { n = v; pinta(); } });
      W.slider(fila, { label: 'instante (fase)', min: 0, max: 6.28, step: 0.1, value: fase, dec: 1, on: function (v) { fase = v; pinta(); } });
      W.legend(host, [{ c: 0, t: 'la cuerda ahora' }, { c: 2, t: 'nodos: nunca se mueven' }]);
      pinta();
    }
  });

  p.section('Los extremos fijos deciden las frecuencias');

  p.text('La cuerda mide $L$ y sus extremos no se mueven: $y(0) = y(L) = 0$ en todo instante. Con ' +
    '$\\operatorname{sen}(kx)$ el extremo $x = 0$ ya vale cero. El otro exige $\\operatorname{sen}(kL) = 0$, ' +
    'y eso solo pasa cuando $kL$ es un múltiplo de $\\pi$. No vale cualquier onda: <strong>tiene que caber ' +
    'un número entero de medias longitudes de onda</strong>.');

  p.formulas([
    '\\lambda_n = \\frac{2L}{n}, \\qquad f_n = \\frac{v}{\\lambda_n} = n\\,\\frac{v}{2L}, \\qquad n = 1, 2, 3, \\ldots',
    'v = \\sqrt{\\frac{T}{\\mu}}'
  ], 'los modos de una cuerda, y la velocidad de la onda en ella',
    'La primera línea es todo el tema: las frecuencias posibles son <strong>múltiplos enteros</strong> ' +
      'de $f_1 = \\frac{v}{2L}$. Esa es la razón de que una cuerda produzca armónicos y no cualquier ' +
      'mezcla: la geometría de los extremos fijos no deja otra opción.<br><br>La segunda dice de qué ' +
      'depende la velocidad: de la tensión $T$ (newtons) y de la <em>densidad lineal</em> $\\mu$ ' +
      '(kilogramos por metro). Cuerda más tensa, onda más rápida, nota más aguda; cuerda más gorda, ' +
      'más lenta, más grave. Y la raíz cuadrada importa: para doblar la frecuencia hace falta ' +
      '<strong>cuadruplicar</strong> la tensión, no doblarla.');

  p.text('Cuando se pulsa una cuerda no vibra en un solo modo: vibra en muchos a la vez, cada uno con ' +
    'su amplitud, y esa mezcla es exactamente la suma de armónicos del tema anterior. Dónde se pulsa ' +
    'decide qué modos se excitan más: cerca del puente, muchos armónicos y sonido brillante; en el ' +
    'centro, pocos y sonido dulce. Un modo que tenga un nodo justo donde se pulsa no suena.');

  p.demo({
    title: 'Los trastes de una guitarra',
    intro: 'Una cuerda afinada en La (110 Hz) con sus primeros armónicos. El mando acorta la cuerda como lo hace un traste: la longitud útil baja y la frecuencia sube en la misma proporción. En el traste 12 la cuerda mide la mitad y suena la octava.',
    predice: 'Si la cuerda se acorta a $0{,}75\\,L$, ¿la frecuencia se multiplicará por 0,75 o por $\\frac{1}{0{,}75} = 1{,}333$? Piensa en $f = v/(2L)$: $L$ está abajo.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-cuerda-1', dur: 1.5, loop: false, ventana: 20, fmax: 2500,
        mandos: [{ n: 'L', label: 'longitud útil (fracción de la cuerda)', min: 0.5, max: 1, step: 0.01, value: 1, dec: 2 }],
        codigo:
          'function sonido(t) {\n' +
          '    var f = 110 / L;                    // f = v / (2L): acortar sube\n' +
          '    var y = 0;\n' +
          '    for (var k = 1; k <= 8; k++) {\n' +
          '        y += sin(TAU * k * f * t) / k;  // los modos, con menos peso los agudos\n' +
          '    }\n' +
          '    return 0.3 * y * exp(-t / 0.8);\n' +
          '}\n',
        nota: 'Los trastes de una guitarra están donde $L$ vale $2^{-1/12}$, $2^{-2/12}$, …: cada uno ' +
          'acorta la cuerda un 5,9 % respecto del anterior, y por eso se van juntando hacia el puente. ' +
          'Es el semitono del tema del tono, en madera.'
      });
    }
  });

  p.ejemplo({
    title: 'Una cuerda de guitarra, con números',
    enunciado: 'La sexta cuerda de una guitarra mide 65 cm y está afinada en Mi (82,41 Hz). Hallar la velocidad de la onda en ella, la frecuencia de su tercer modo y a qué distancia del puente hay que pisarla para que suene un La (110 Hz).',
    pasos: [
      { t: '<strong>La velocidad.</strong> $f_1 = \\dfrac{v}{2L} \\Rightarrow v = 2Lf_1 = 2\\cdot 0{,}65\\cdot 82{,}41 = 107{,}1$ m/s. Lenta comparada con el sonido en el aire (343 m/s): es la onda <em>en la cuerda</em>.', antes: 'Despeja $v$ de $f_1 = v/(2L)$.' },
      { t: '<strong>El tercer modo.</strong> $f_3 = 3 f_1 = 247{,}2$ Hz: una octava y una quinta por encima, un Si. Es lo que se oye si se roza la cuerda a un tercio de su longitud, donde el modo 3 tiene un vientre y el 1 y el 2 no.' },
      { t: '<strong>Cuánta cuerda hace falta para un La.</strong> $f$ es inversamente proporcional a $L$: $L\' = L\\dfrac{f_1}{f\'} = 0{,}65\\cdot\\dfrac{82{,}41}{110} = 0{,}487$ m.', antes: 'Si $f = v/(2L)$ con $v$ fijo, ¿cómo depende $L$ de $f$?' },
      { t: '<strong>Comprobar con la escala.</strong> De Mi a La hay cinco semitonos, y $0{,}65\\cdot 2^{-5/12} = 0{,}65\\cdot 0{,}749 = 0{,}487$ m. El quinto traste está exactamente ahí, y la guitarra se afina cuerda a cuerda con ese traste.', antes: 'Cuenta semitonos de Mi a La y usa $2^{-n/12}$.' }
    ],
    cierre: 'Tres fórmulas —$f = v/(2L)$, $f_n = nf_1$ y $2^{n/12}$— explican dónde están los trastes, por qué suena un armónico al rozar y cómo se afina el instrumento.'
  });

  p.section('Los tubos: por qué el clarinete no tiene armónicos pares');

  p.text('En un instrumento de viento lo que vibra es la columna de aire de un tubo, y las condiciones ' +
    'en los extremos son otras. Un extremo <strong>abierto</strong> tiene la presión fija (la del ' +
    'exterior) y el aire se mueve libremente: es un vientre de movimiento. Un extremo ' +
    '<strong>cerrado</strong> tiene el aire quieto: un nodo. De ahí salen dos familias:');

  p.formulas([
    '\\text{tubo abierto por los dos lados:}\\quad f_n = n\\,\\frac{v}{2L}, \\quad n = 1, 2, 3, \\ldots',
    '\\text{tubo cerrado por un lado:}\\quad f_n = (2n - 1)\\,\\frac{v}{4L}, \\quad n = 1, 2, 3, \\ldots'
  ], 'los modos de un tubo (v = 343 m/s en el aire)',
    'La flauta es un tubo abierto por los dos extremos: tiene todos los armónicos, como la cuerda. El ' +
      'clarinete se comporta como un tubo <strong>cerrado</strong> por el lado de la boquilla, y en ' +
      'un tubo así tiene que caber un cuarto de longitud de onda, tres cuartos, cinco cuartos…: ' +
      '<strong>solo los armónicos impares</strong>. Es exactamente el espectro de la onda cuadrada ' +
      'del tema anterior, y por eso la cuadrada suena a clarinete.<br><br>Y un tubo cerrado suena ' +
      'una octava más grave que uno abierto de la misma longitud: $\\frac{v}{4L}$ frente a ' +
      '$\\frac{v}{2L}$. Por eso los tubos tapados de un órgano dan graves con la mitad de madera.');

  p.comprueba('Un tubo cerrado por un extremo mide 50 cm. ¿Cuáles son sus dos primeras frecuencias?', [
    { t: '171,5 Hz y 514,5 Hz', ok: true, por: '$f_1 = \\frac{343}{4\\cdot 0{,}5} = 171{,}5$ Hz, y el siguiente modo es el triple, no el doble: $3 f_1 = 514{,}5$ Hz. Solo los impares.' },
    { t: '343 Hz y 686 Hz', ok: false, por: 'Eso sería el tubo abierto por los dos lados: $\\frac{v}{2L}$ y su doble. Cerrado por uno, cabe un cuarto de onda y la fundamental baja una octava.' },
    { t: '171,5 Hz y 343 Hz', ok: false, por: 'La fundamental está bien, pero el segundo modo de un tubo cerrado no es el doble: es el triple. Los armónicos pares no existen en él.' }
  ]);

  p.hist('Pitágoras estudió la cuerda con un monocordio y encontró que las consonancias eran razones ' +
    'de longitudes. Mersenne midió en 1636 cómo depende la frecuencia de la longitud, la tensión y el ' +
    'grosor: sus tres leyes son la fórmula $f = \\frac{1}{2L}\\sqrt{T/\\mu}$ repartida en tres frases. ' +
    'Brook Taylor —el de los polinomios— calculó la fundamental en 1713, y Jean le Rond d\'Alembert ' +
    'escribió en 1747 la ecuación de ondas, la primera ecuación en derivadas parciales de la historia, ' +
    'cuya solución general son justamente dos ondas viajando en sentidos contrarios. Daniel Bernoulli ' +
    'propuso que la solución era una suma de modos, y Euler no le creyó: fue la primera versión de la ' +
    'discusión que Fourier zanjaría medio siglo después.');

  p.util('Diseñar un instrumento es elegir $L$, $T$ y $\\mu$. El piano usa cuerdas gruesas y muy tensas ' +
    'para los graves porque, a $v$ igual, doblar $L$ no cabía en el mueble: un piano de cola es un ' +
    'compromiso entre la fórmula y la habitación. Los mismos modos aparecen en un puente, que también ' +
    'tiene frecuencias propias y puede entrar en resonancia con el viento o con el paso de la gente; ' +
    'en las cuerdas de un tenis, en las tuberías de un edificio y en la caja de resonancia de una ' +
    'guitarra, que se ajusta para reforzar los modos que interesan.');

  p.trampas([
    { e: 'Creer que la onda estacionaria se desplaza', por: 'Su forma $\\operatorname{sen}(kx)$ no cambia: solo se multiplica por $\\cos(\\omega t)$. Los nodos no se mueven jamás.' },
    { e: '«Doblar la tensión dobla la frecuencia»', por: 'La velocidad va con la raíz de la tensión: doblar $T$ multiplica $f$ por $\\sqrt 2$, que son seis semitonos. Para la octava hace falta el cuádruple.' },
    { e: 'Dar todos los armónicos a un tubo cerrado', por: 'Cerrado por un lado solo tiene los impares: $f_1, 3f_1, 5f_1$. Por eso suena hueco, como una cuadrada.' },
    { e: 'Usar 343 m/s para la onda en la cuerda', por: 'Esa es la velocidad del sonido en el aire. En la cuerda la onda va a $\\sqrt{T/\\mu}$, que suele ser mucho más lenta: unos 100 m/s en una guitarra.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Los modos de una cuerda',
    level: 'basico',
    gen: function (r) {
      var v = r.pick([80, 100, 120, 150, 200]), L = r.pick([0.4, 0.5, 0.65, 0.8, 1]), n = r.int(1, 5);
      return { v: v, L: L, n: n, f: n * v / (2 * L) };
    },
    ask: function (d) { return 'En una cuerda de $' + U.fmt(d.L, 2) + '$ m la onda viaja a $' + d.v + '$ m/s. ¿Cuál es la frecuencia de su modo $n = ' + d.n + '$? (un decimal)'; },
    fields: [{ name: 'f', label: 'Hz', w: 'wide' }],
    sol: function (d) { return { f: U.round(d.f, 4) }; },
    dec: 1,
    errores: [{ si: function (v, d) { return Math.abs(v.f - d.n * d.v / d.L) < 0.05; }, msg: 'Falta el 2: en la cuerda cabe <em>media</em> longitud de onda, así que $\\lambda_1 = 2L$ y $f_1 = v/(2L)$.' }],
    hint: function () { return '$f_n = n\\,\\dfrac{v}{2L}$.'; },
    steps: function (d) { return ['$f_1 = \\dfrac{' + d.v + '}{2\\cdot ' + U.fmt(d.L, 2) + '} = ' + U.fmt(d.v / (2 * d.L), 2) + '$ Hz', '$f_' + d.n + ' = ' + d.n + '\\cdot ' + U.fmt(d.v / (2 * d.L), 2) + ' = ' + U.fmt(d.f, 1) + '$ Hz.']; },
    answer: function (d) { return U.fmt(d.f, 1) + ' Hz'; }
  });

  p.exercise({
    title: 'La longitud para una nota',
    level: 'basico',
    gen: function (r) {
      var v = r.pick([90, 100, 110, 120, 130]), f = r.pick([82.41, 110, 146.83, 196, 246.94, 329.63]);
      return { v: v, f: f, L: v / (2 * f) };
    },
    ask: function (d) { return 'La onda viaja a $' + d.v + '$ m/s por una cuerda. ¿Qué longitud tiene que tener para que su fundamental sea $' + U.fmt(d.f, 2) + '$ Hz? (tres decimales, en metros)'; },
    fields: [{ name: 'L', label: 'L (m)', w: 'wide' }],
    sol: function (d) { return { L: U.round(d.L, 6) }; },
    dec: 3,
    hint: function () { return 'Despeja $L$ en $f_1 = \\dfrac{v}{2L}$.'; },
    steps: function (d) { return ['$L = \\dfrac{v}{2f_1} = \\dfrac{' + d.v + '}{2\\cdot ' + U.fmt(d.f, 2) + '} = ' + U.fmt(d.L, 3) + '$ m.']; },
    answer: function (d) { return U.fmt(d.L, 3) + ' m'; }
  });

  p.exercise({
    title: 'Tensar la cuerda',
    level: 'medio',
    gen: function (r) {
      var k = r.pick([1.1, 1.2, 1.5, 2, 3, 4]);
      var semis = 12 * Math.log(Math.sqrt(k)) / Math.LN2;
      return { k: k, factor: Math.sqrt(k), semis: semis };
    },
    ask: function (d) { return 'La tensión de una cuerda se multiplica por $' + U.fmt(d.k, 1) + '$, sin cambiar nada más. ¿Por qué factor se multiplica su frecuencia, y cuántos semitonos sube? (factor con tres decimales, semitonos con uno)'; },
    fields: [{ name: 'k', label: 'factor', w: 'wide' }, { name: 's', label: 'semitonos', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.factor, 6), s: U.round(d.semis, 4) }; },
    dec: { k: 3, s: 1 },
    errores: [{ si: function (v, d) { return Math.abs(v.k - d.k) < 0.005; }, msg: 'La frecuencia va con la <em>raíz</em> de la tensión: $v = \\sqrt{T/\\mu}$.' }],
    hint: function () { return ['$f \\propto v = \\sqrt{T/\\mu}$: el factor es $\\sqrt{' + '}$ del de la tensión.', 'Semitonos $= 12\\log_2(\\text{factor})$.']; },
    steps: function (d) { return ['Factor: $\\sqrt{' + U.fmt(d.k, 1) + '} = ' + U.fmt(d.factor, 3) + '$.', 'Semitonos: $12\\log_2 ' + U.fmt(d.factor, 3) + ' = ' + U.fmt(d.semis, 1) + '$.' + (d.k === 4 ? ' Cuadruplicar la tensión es justo una octava.' : (d.k === 2 ? ' Doblar la tensión son seis semitonos, media octava.' : ''))]; },
    answer: function (d) { return 'factor ' + U.fmt(d.factor, 3) + ', ' + U.fmt(d.semis, 1) + ' semitonos'; }
  });

  p.exercise({
    title: 'Abierto o cerrado',
    level: 'medio',
    gen: function (r) {
      var L = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]), cerrado = r.bool();
      var f1 = cerrado ? 343 / (4 * L) : 343 / (2 * L), f2 = cerrado ? 3 * f1 : 2 * f1;
      return { L: L, cerrado: cerrado, f1: f1, f2: f2 };
    },
    ask: function (d) { return 'Un tubo de $' + U.fmt(d.L, 2) + '$ m, ' + (d.cerrado ? '<strong>cerrado por un extremo</strong>' : '<strong>abierto por los dos</strong>') + ', con el sonido a 343 m/s. Calcula su fundamental y su siguiente modo (un decimal).'; },
    fields: [{ name: 'a', label: 'fundamental (Hz)', w: 'wide' }, { name: 'b', label: 'siguiente (Hz)', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.f1, 4), b: U.round(d.f2, 4) }; },
    dec: 1,
    errores: [
      { si: function (v, d) { return d.cerrado && Math.abs(v.b - 2 * d.f1) < 0.1; }, msg: 'En un tubo cerrado no hay armónicos pares: el siguiente modo es el triple de la fundamental.' },
      { si: function (v, d) { return d.cerrado && Math.abs(v.a - 343 / (2 * d.L)) < 0.1; }, msg: 'Cerrado por un lado cabe un cuarto de onda, no media: $f_1 = v/(4L)$.' }
    ],
    hint: function (d) { return d.cerrado ? 'Cerrado: $f_n = (2n - 1)\\frac{v}{4L}$: fundamental $v/(4L)$ y luego el triple.' : 'Abierto: $f_n = n\\frac{v}{2L}$: fundamental $v/(2L)$ y luego el doble.'; },
    steps: function (d) { return [d.cerrado ? '$f_1 = \\dfrac{343}{4\\cdot ' + U.fmt(d.L, 2) + '} = ' + U.fmt(d.f1, 1) + '$ Hz; siguiente, $3f_1 = ' + U.fmt(d.f2, 1) + '$ Hz.' : '$f_1 = \\dfrac{343}{2\\cdot ' + U.fmt(d.L, 2) + '} = ' + U.fmt(d.f1, 1) + '$ Hz; siguiente, $2f_1 = ' + U.fmt(d.f2, 1) + '$ Hz.']; },
    answer: function (d) { return U.fmt(d.f1, 1) + ' Hz y ' + U.fmt(d.f2, 1) + ' Hz'; }
  });

  p.exercise({
    title: 'Dónde va el traste',
    level: 'avanzado',
    gen: function (r) {
      var L = r.pick([0.628, 0.648, 0.65, 0.65, 0.864]), k = r.int(1, 12);
      return { L: L, k: k, d: L * (1 - Math.pow(2, -k / 12)) };
    },
    ask: function (d) { return 'Una cuerda de $' + U.fmt(d.L, 3) + '$ m. ¿A qué distancia de la cejuela (el extremo por donde se pisa) va el traste $' + d.k + '$, el que sube $' + d.k + '$ semitono' + (d.k === 1 ? '' : 's') + '? (tres decimales, en metros)'; },
    fields: [{ name: 'd', label: 'distancia (m)', w: 'wide' }],
    sol: function (d) { return { d: U.round(d.d, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return d.k !== 12 && Math.abs(v.d - d.L * Math.pow(2, -d.k / 12)) < 5e-4; }, msg: 'Eso es la longitud que <em>queda</em> de cuerda, medida desde el puente. Desde la cejuela es lo que se ha quitado: $L - L\\cdot 2^{-k/12}$.' }],
    hint: function () { return ['La cuerda útil tiene que medir $L\\cdot 2^{-k/12}$.', 'La distancia desde la cejuela es lo que se recorta: $L(1 - 2^{-k/12})$.']; },
    steps: function (d) { return ['Cuerda útil: $' + U.fmt(d.L, 3) + '\\cdot 2^{-' + d.k + '/12} = ' + U.fmt(d.L * Math.pow(2, -d.k / 12), 3) + '$ m.', 'Distancia desde la cejuela: $' + U.fmt(d.L, 3) + ' - ' + U.fmt(d.L * Math.pow(2, -d.k / 12), 3) + ' = ' + U.fmt(d.d, 3) + '$ m.' + (d.k === 12 ? ' El traste 12 está justo en la mitad.' : '')]; },
    answer: function (d) { return U.fmt(d.d, 3) + ' m'; }
  });

  p.keys([
    'Dos ondas iguales en sentidos contrarios suman una estacionaria: $2\\operatorname{sen}(kx)\\cos(\\omega t)$, con nodos que no se mueven.',
    'Los extremos fijos obligan a que quepan medias longitudes de onda enteras: $f_n = n\\,\\frac{v}{2L}$. De ahí salen los armónicos.',
    '$v = \\sqrt{T/\\mu}$: más tensa, más aguda; más gorda, más grave; y para la octava hace falta el cuádruple de tensión.',
    'Tubo abierto: todos los armónicos, $n\\frac{v}{2L}$. Cerrado por un lado: solo impares, $(2n-1)\\frac{v}{4L}$, y una octava más grave.',
    'Los trastes están a $L(1 - 2^{-k/12})$ de la cejuela: el semitono, en madera.'
  ]);
});
