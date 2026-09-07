/* Tema: Teoría de la información y entropía */
Course.topic('av-informacion', function (p) {

  p.text('¿Se puede <strong>medir</strong> la información? ¿Cuánta hay en un mensaje? En 1948, Claude ' +
    'Shannon publicó un artículo que respondía a esas preguntas con una precisión asombrosa, y de él ' +
    'salió la era digital entera: internet, el móvil, los códigos correctores, la compresión de datos.');

  p.section('Información es sorpresa');

  p.text('La idea de partida es contraintuitiva y luminosa: <strong>la información de un mensaje es ' +
    'lo inesperado que resulta</strong>. «Mañana saldrá el sol» no informa de casi nada, porque ya se ' +
    'sabía. «Mañana nevará en Sevilla» informa muchísimo.');

  p.formula('I(x) = \\log_2\\frac{1}{p(x)} = -\\log_2 p(x)', 'información de un suceso, en bits');

  p.list([
    'Un suceso seguro ($p = 1$) aporta $0$ bits: no informa de nada.',
    'Un suceso con $p = 1/2$ aporta exactamente $1$ bit.',
    'Cuanto más improbable, más bits aporta.',
    'El logaritmo hace que las informaciones de sucesos independientes se <strong>sumen</strong>, que es lo que uno espera de una medida.'
  ]);

  p.note('Un <strong>bit</strong> es la información de una respuesta sí/no con las dos opciones ' +
    'igual de probables. Es la unidad natural, y el nombre lo propuso John Tukey: <em>binary digit</em>.',
    null);

  /* ---------------------------------------------------------------- */
  p.section('La entropía');

  p.text('Si un mensaje puede ser uno de varios símbolos, la <strong>entropía</strong> es la ' +
    'información <em>media</em> por símbolo: cada uno pesa según su probabilidad.');

  p.formula('H = -\\sum_i p_i \\log_2 p_i', 'entropía de Shannon, en bits por símbolo');

  p.demo({
    title: 'Entropía de una moneda trucada',
    intro: 'Cambia la probabilidad de cara. La entropía es máxima cuando la moneda es justa, y cae a cero cuando el resultado es seguro.',
    build: function (host, d) {
      var prob = 0.5;
      var out = W.readout(host, '');
      function H(q) {
        if (q <= 0 || q >= 1) return 0;
        return -(q * Math.log(q) / Math.LN2 + (1 - q) * Math.log(1 - q) / Math.LN2);
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 1, ymin: 0, ymax: 1.15, height: 280,
        xlabel: 'probabilidad de cara', ylabel: 'entropía (bits)', ystep: 0.25,
        draw: function (g) {
          g.fn(H, { color: 0, w: 2.8, samples: 400 });
          g.point(prob, H(prob), { color: 2, r: 7 });
          g.seg(prob, 0, prob, H(prob), { color: 2, w: 1.4, dash: true });
          g.hline(1, { color: 'axis', w: 1.2, dash: true });
        }
      });
      function paint() {
        var h = H(prob);
        out.set('$p(\\text{cara}) = ' + U.fmt(prob, 2) + '$, $p(\\text{cruz}) = ' + U.fmt(1 - prob, 2) + '$<br>' +
          '<strong>Entropía: $H = ' + U.fmt(h, 5) + '$ bits por lanzamiento</strong><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (Math.abs(prob - 0.5) < 0.01
            ? 'Moneda justa: máxima incertidumbre, exactamente 1 bit. No se puede comprimir.'
            : (prob < 0.05 || prob > 0.95
              ? 'Resultado casi seguro: apenas hay incertidumbre, así que casi no hace falta información para transmitirlo. Se comprime muchísimo.'
              : 'Con la moneda sesgada hace falta menos de 1 bit de media: esa diferencia es exactamente lo que aprovecha un compresor.')) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'probabilidad de cara', min: 0.01, max: 0.99, step: 0.01, value: 0.5, dec: 2, on: function (v) { prob = v; paint(); } });
      paint();
    }
  });

  p.note('La entropía es <strong>máxima cuando todo es igual de probable</strong> y cae a cero cuando ' +
    'un resultado es seguro. Mide exactamente la <em>incertidumbre</em> que hay antes de conocer el ' +
    'mensaje, que es lo mismo que la información que se obtiene al conocerlo.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('El teorema de codificación');

  p.text('Y aquí llega el resultado central, que convierte todo esto en ingeniería:');

  p.formula('\\text{longitud media mínima} \\ \\ge \\ H', 'primer teorema de Shannon');

  p.text('Ninguna codificación puede usar, de media, menos bits por símbolo que la entropía de la ' +
    'fuente. Es un <strong>límite físico</strong>, como la velocidad de la luz: no se puede comprimir ' +
    'más allá de ahí, por muy listo que sea el algoritmo. Y además ese límite se puede alcanzar tanto ' +
    'como se quiera.');

  p.text('La idea práctica es asignar <strong>códigos cortos a los símbolos frecuentes</strong> y ' +
    'largos a los raros. Exactamente lo que hace el código Morse: la E, la letra más común en inglés, ' +
    'es un solo punto; la Q es «raya-raya-punto-raya».');

  p.demo({
    title: 'Codificar según la frecuencia',
    intro: 'Compara un código de longitud fija con uno que da códigos cortos a lo frecuente. Cambia lo desigual que es la fuente y mira el ahorro.',
    build: function (host, d) {
      var sesgo = 0.6;
      var out = W.readout(host, '');
      var caja = U.el('div');
      host.appendChild(caja);
      function probs() {
        // cuatro simbolos con reparto controlado por 'sesgo'
        var base = [1, 1, 1, 1];
        var p = base.map(function (_, i) { return Math.pow(sesgo, i); });
        var s = U.sum(p);
        return p.map(function (x) { return x / s; });
      }
      function pinta() {
        var p = probs();
        var H = -U.sum(p.map(function (q) { return q * Math.log(q) / Math.LN2; }));
        // codigo tipo Huffman sencillo para 4 simbolos ordenados
        var codigos = ['0', '10', '110', '111'];
        var medio = U.sum(p.map(function (q, i) { return q * codigos[i].length; }));
        var simbolos = ['A', 'B', 'C', 'D'];
        var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr>' +
          '<th>Símbolo</th><th class="num">Probabilidad</th><th>Código fijo</th><th>Código variable</th>' +
          '</tr></thead><tbody>';
        simbolos.forEach(function (s2, i) {
          h += '<tr><td><strong>' + s2 + '</strong></td>' +
            '<td class="num">' + U.fmt(p[i], 4) + '</td>' +
            '<td style="font-family:var(--mono)">' + ['00', '01', '10', '11'][i] + '</td>' +
            '<td style="font-family:var(--mono);color:var(--ok);font-weight:600">' + codigos[i] + '</td></tr>';
        });
        h += '</tbody></table></div>';
        caja.innerHTML = h;
        out.set('<strong>Entropía de la fuente: $H = ' + U.fmt(H, 4) + '$ bits/símbolo</strong> (el mínimo teórico)<br>' +
          'Código de longitud fija: <strong>2,0000</strong> bits/símbolo<br>' +
          'Código de longitud variable: <strong>' + U.fmt(medio, 4) + '</strong> bits/símbolo<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (medio < 2
            ? 'Ahorro del <strong>' + U.fmt((2 - medio) / 2 * 100, 1) + ' %</strong> frente al código fijo. ' +
              'Y todavía queda un margen de ' + U.fmt(medio - H, 4) + ' bits hasta el límite de Shannon.'
            : 'Con símbolos casi equiprobables no hay nada que ganar: el código variable no mejora al fijo. ' +
              'Una fuente sin sesgo es incompresible.') +
          '</span>');
      }
      W.slider(W.row(host), { label: 'desigualdad entre símbolos', min: 0.25, max: 1, step: 0.05, value: 0.6, dec: 2, on: function (v) { sesgo = v; pinta(); } });
      W.hint(host, 'Pon el deslizador en 1 (todos igual de probables) y verás que ya no se puede comprimir.');
      pinta();
    }
  });

  p.note('Esto explica por qué un archivo ZIP no se puede volver a comprimir: la primera compresión ya ' +
    'ha eliminado la redundancia y ha dejado algo que se parece a ruido, con entropía casi máxima. Y ' +
    'también por qué <strong>no existe un compresor universal</strong> que reduzca cualquier archivo: ' +
    'si redujera todos, dos archivos distintos acabarían dando lo mismo.', 'warn',
    'Por qué no se puede comprimir infinitamente');

  /* ---------------------------------------------------------------- */
  p.util('Shannon puso un límite exacto a cuánto se puede comprimir algo sin perder nada, y ese límite ' +
    'explica por qué un archivo ZIP no se puede volver a comprimir: la primera pasada ya ha ' +
    'exprimido la redundancia, y lo que queda es indistinguible del azar. Es también el motivo de ' +
    'que una foto ya guardada en JPEG apenas encoja al meterla en un ZIP. Cuando alguien anuncia un ' +
    'compresor que reduce cualquier archivo a la mitad, está anunciando algo demostradamente ' +
    'imposible.');

  p.section('Redundancia y corrección de errores');

  p.text('El idioma castellano tiene una entropía de aproximadamente <strong>1,5 bits por letra</strong>, ' +
    'muy por debajo de los 4,7 que harían falta si las 27 letras fueran equiprobables. Sobra un ' +
    '<strong>70 % de redundancia</strong>.');

  p.text('Eso parece un desperdicio y es justo lo contrario: la redundancia es lo que permite entender ' +
    'a alguien en una habitación ruidosa, o leer un texto con erratas. Pdms lr est frs sn vcls.');

  p.text('Shannon convirtió esa idea en un segundo teorema: <strong>añadiendo redundancia de forma ' +
    'inteligente se puede transmitir sin errores por un canal ruidoso</strong>, hasta un límite llamado ' +
    'capacidad del canal.');

  p.formula('C = B\\log_2\\left(1 + \\frac{S}{N}\\right)', 'capacidad de un canal con ruido');

  p.note('Esa fórmula es la que decide cuántos megas por segundo puede dar tu wifi. $B$ es el ancho de ' +
    'banda y $S/N$ la relación señal-ruido. Cada vez que una operadora anuncia más velocidad, está ' +
    'peleando contra este límite: o más ancho de banda, o mejor señal. No hay tercera opción.',
    'ok', 'Tu conexión a internet, en una fórmula');

  /* ---------------------------------------------------------------- */
  p.util('Añadir redundancia a propósito es lo que permite que las cosas funcionen en un mundo con ruido. ' +
    'Un CD rayado sigue sonando, un código QR medio tapado se lee igual, y las sondas Voyager siguen ' +
    'enviando datos legibles desde fuera del sistema solar con la potencia de una bombilla de ' +
    'nevera. En los tres casos hay códigos correctores que reconstruyen lo que se perdió, y el ' +
    'margen de cuánto se puede reconstruir lo fija esta teoría.');

  p.section('Entropía y desorden');

  p.text('El nombre no es casual. La fórmula de Shannon es prácticamente idéntica a la entropía de la ' +
    'termodinámica de Boltzmann, formulada setenta años antes:');

  p.formulas([
    'S = -k_B \\sum p_i \\ln p_i \\quad \\text{(Boltzmann, física)}',
    'H = -\\sum p_i \\log_2 p_i \\quad \\text{(Shannon, información)}'
  ]);

  p.hist('Cuenta Shannon que no sabía cómo llamar a su magnitud, y que fue von Neumann quien le sugirió ' +
    '«entropía», con dos argumentos: «primero, tu función ya se usa en mecánica estadística con ese ' +
    'nombre; y segundo, y más importante, nadie sabe realmente qué es la entropía, así que en una ' +
    'discusión siempre llevarás ventaja». La coincidencia, sin embargo, es profunda: información y ' +
    'desorden son la misma magnitud vista desde dos sitios.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Información de un suceso',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'sacar cara al lanzar una moneda', p: 1 / 2 },
        { t: 'sacar un 6 al lanzar un dado', p: 1 / 6 },
        { t: 'acertar un número del 1 al 100', p: 1 / 100 },
        { t: 'sacar oros de una baraja de 40 cartas', p: 1 / 4 },
        { t: 'sacar el as de oros de una baraja de 40 cartas', p: 1 / 40 },
        { t: 'que salga par al lanzar un dado', p: 1 / 2 },
        { t: 'acertar una quiniela de 3 partidos', p: 1 / 27 }
      ];
      var c = r.pick(casos);
      return { t: c.t, p: c.p, bits: -Math.log(c.p) / Math.LN2 };
    },
    ask: function (d) {
      return '¿Cuánta información (en bits) aporta el suceso «' + d.t + '»? (cuatro decimales)';
    },
    fields: [{ name: 'b', label: 'Bits', w: 'wide' }],
    sol: function (d) { return { b: U.round(d.bits, 6) }; },
    tol: 3e-5,
    hint: function (d) { return '$I = \\log_2\\frac{1}{p}$, con $p = ' + U.fmt(d.p, 6) + '$.'; },
    steps: function (d) {
      return ['La probabilidad del suceso es $p = ' + U.fmt(d.p, 6) + '$.',
        '$I = \\log_2\\dfrac{1}{' + U.fmt(d.p, 6) + '} = \\log_2 ' + U.fmt(1 / d.p, 4) + '$',
        '$= ' + U.fmt(d.bits, 4) + '$ bits',
        'Interpretación: harían falta unas ' + U.fmt(d.bits, 2) + ' preguntas de sí/no bien elegidas para ' +
        'identificar este resultado.'];
    },
    answer: function (d) { return U.fmt(d.bits, 4) + ' bits'; }
  });

  p.exercise({
    title: 'Entropía de una fuente',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([2, 4, 8, 16, 32]);
      var equi = r.bool();
      if (equi) return { equi: true, n: n, H: Math.log(n) / Math.LN2 };
      // fuente sesgada de dos simbolos
      var q = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.7, 0.8, 0.9]);
      var H = -(q * Math.log(q) / Math.LN2 + (1 - q) * Math.log(1 - q) / Math.LN2);
      return { equi: false, q: q, H: H };
    },
    ask: function (d) {
      if (d.equi) {
        return 'Una fuente emite $' + d.n + '$ símbolos <strong>equiprobables</strong>. ¿Cuál es su ' +
          'entropía en bits por símbolo?';
      }
      return 'Una fuente emite dos símbolos con probabilidades $' + U.fmt(d.q, 2) + '$ y $' +
        U.fmt(1 - d.q, 2) + '$. ¿Cuál es su entropía? (cuatro decimales)';
    },
    fields: [{ name: 'h', label: 'H (bits)', w: 'wide' }],
    sol: function (d) { return { h: U.round(d.H, 6) }; },
    tol: 3e-5,
    hint: function (d) {
      return d.equi ? 'Con $n$ símbolos equiprobables, $H = \\log_2 n$.'
        : '$H = -p\\log_2 p - (1-p)\\log_2(1-p)$.';
    },
    steps: function (d) {
      if (d.equi) {
        return ['Con todos los símbolos igual de probables, $p_i = 1/' + d.n + '$ para todos.',
          '$H = \\log_2 ' + d.n + ' = ' + U.fmt(d.H, 4) + '$ bits por símbolo.',
          'Es el máximo posible con ' + d.n + ' símbolos: cualquier sesgo bajaría la entropía.'];
      }
      return ['$H = -' + U.fmt(d.q, 2) + '\\log_2 ' + U.fmt(d.q, 2) + ' - ' + U.fmt(1 - d.q, 2) +
        '\\log_2 ' + U.fmt(1 - d.q, 2) + '$',
        '$= ' + U.fmt(-d.q * Math.log(d.q) / Math.LN2, 5) + ' + ' +
        U.fmt(-(1 - d.q) * Math.log(1 - d.q) / Math.LN2, 5) + '$',
        '$= ' + U.fmt(d.H, 4) + '$ bits por símbolo.',
        'Menos de 1 bit: al estar sesgada, la fuente se puede comprimir por debajo de un bit por símbolo.'];
    },
    answer: function (d) { return U.fmt(d.H, 4) + ' bits/símbolo'; }
  });

  p.exercise({
    title: 'Longitud mínima de un mensaje',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([2, 4, 8, 16, 32, 64]);
      var largo = r.int(100, 5000);
      var H = Math.log(n) / Math.LN2;
      return { n: n, largo: largo, H: H, bits: largo * H };
    },
    ask: function (d) {
      return 'Un mensaje de $' + U.miles(d.largo) + '$ símbolos procede de un alfabeto de $' + d.n +
        '$ símbolos equiprobables. ¿Cuál es el número mínimo de bits necesarios para transmitirlo?';
    },
    fields: [{ name: 'b', label: 'Bits', w: 'wide' }],
    sol: function (d) { return { b: d.bits }; },
    tol: 1e-6,
    hint: function (d) { return 'Cada símbolo aporta $\\log_2 ' + d.n + ' = ' + U.fmt(d.H, 0) + '$ bits. Multiplica por el número de símbolos.'; },
    steps: function (d) {
      return ['Entropía por símbolo: $\\log_2 ' + d.n + ' = ' + U.fmt(d.H, 0) + '$ bits.',
        'Por el teorema de Shannon, el mínimo es $H$ por símbolo, y aquí se alcanza exactamente.',
        '$' + U.miles(d.largo) + ' \\cdot ' + U.fmt(d.H, 0) + ' = ' + U.miles(d.bits) + '$ bits',
        'Equivalen a $' + U.fmt(d.bits / 8, 2) + '$ bytes. Ningún compresor puede bajar de ahí con esta fuente.'];
    },
    answer: function (d) { return U.miles(d.bits).replace(/\\,/g, ' ') + ' bits'; }
  });

  p.exercise({
    title: 'Ahorro de un código variable',
    level: 'avanzado',
    gen: function (r) {
      var p = [0.5, 0.25, 0.125, 0.125];
      var codigos = [1, 2, 3, 3];
      var medio = 0;
      for (var i = 0; i < 4; i++) medio += p[i] * codigos[i];
      var largo = r.int(100, 2000);
      return { p: p, codigos: codigos, medio: medio, largo: largo, fijo: 2 * largo, var_: medio * largo };
    },
    ask: function (d) {
      return 'Cuatro símbolos con probabilidades $0{,}5$, $0{,}25$, $0{,}125$ y $0{,}125$ se codifican ' +
        'con $1$, $2$, $3$ y $3$ bits respectivamente. Para un mensaje de $' + U.miles(d.largo) +
        '$ símbolos, ¿cuántos bits ocupa en total? (cuatro decimales)';
    },
    fields: [{ name: 'b', label: 'Bits totales', w: 'wide' }],
    sol: function (d) { return { b: U.round(d.var_, 6) }; },
    tol: 3e-5,
    hint: function () { return 'Calcula primero la longitud media: cada longitud pesada por su probabilidad.'; },
    steps: function (d) {
      return ['Longitud media: $0{,}5 \\cdot 1 + 0{,}25 \\cdot 2 + 0{,}125 \\cdot 3 + 0{,}125 \\cdot 3 = ' +
        U.fmt(d.medio, 4) + '$ bits/símbolo.',
        'Total: $' + U.miles(d.largo) + ' \\cdot ' + U.fmt(d.medio, 4) + ' = ' + U.fmt(d.var_, 4) + '$ bits.',
        'Con código fijo de 2 bits harían falta $' + U.miles(d.fijo) + '$: el ahorro es del $' +
        U.fmt((d.fijo - d.var_) / d.fijo * 100, 2) + '\\%$.',
        'Y la entropía de esta fuente vale exactamente $1{,}75$ bits, que coincide con la longitud media: ' +
        'este código es <strong>óptimo</strong>, no se puede hacer mejor.'];
    },
    answer: function (d) { return U.fmt(d.var_, 4) + ' bits'; }
  });

  p.keys([
    'Información = sorpresa: $I = \\log_2(1/p)$. Un suceso seguro no informa de nada.',
    'La <strong>entropía</strong> $H = -\\sum p_i\\log_2 p_i$ es la información media por símbolo.',
    'Es máxima cuando todo es equiprobable y cero cuando el resultado es seguro.',
    'Teorema de Shannon: no se puede comprimir por debajo de $H$ bits por símbolo. Es un límite, no una dificultad técnica.',
    'Códigos cortos para lo frecuente: eso es Morse, Huffman y toda la compresión sin pérdida.',
    'La redundancia del lenguaje no es un defecto: permite entenderse pese al ruido.',
    'La capacidad de un canal ruidoso es $C = B\\log_2(1+S/N)$: la fórmula que limita tu wifi.'
  ]);
});
