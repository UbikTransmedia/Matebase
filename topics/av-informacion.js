/* Tema: Teoría de la información y entropía */
Course.topic('av-informacion', function (p) {

  p.puente('Aquí se juntan dos cosas ya vistas: la [[pe-probabilidad|probabilidad]] de un suceso y el ' +
    '[[fn-exp-log|logaritmo]], en base 2. Con ellas se define una medida de la información que resulta ' +
    'ser un límite físico, y que explica por qué un archivo comprimido no se comprime más.');

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

  p.comprueba('Una moneda trucada sale cara el 90 % de las veces. ¿Su entropía es mayor o menor que la de una moneda justa?', [
    { t: 'Menor: casi siempre se sabe lo que va a salir', ok: true, por: '$H = -0{,}9\\log_2 0{,}9 - 0{,}1\\log_2 0{,}1 \\approx 0{,}47$ bits, frente a 1 bit de la justa. Menos incertidumbre, menos información por lanzamiento, más fácil de comprimir.' },
    { t: 'Mayor: la cruz, cuando sale, informa muchísimo', ok: false, por: 'La cruz aporta $\\log_2 10 \\approx 3{,}3$ bits, pero sale una vez de diez. La entropía es la <em>media</em>, y la media está dominada por las caras, que aportan casi nada.' },
    { t: 'Igual: sigue habiendo dos resultados', ok: false, por: 'El número de resultados no basta; importan sus probabilidades. Con dos resultados la entropía va de 0 (seguro) a 1 bit (equiprobables).' }
  ]);

  p.ejemplo({
    title: 'Entropía y código óptimo de una fuente de cuatro símbolos',
    enunciado: 'Una fuente emite A, B, C y D con probabilidades $\\frac{1}{2}$, $\\frac{1}{4}$, $\\frac{1}{8}$ y $\\frac{1}{8}$. Calcular su entropía, proponer un código y codificar el mensaje ABAC.',
    pasos: [
      { t: '<strong>Información de cada símbolo.</strong> $I(A) = \\log_2 2 = 1$ bit, $I(B) = \\log_2 4 = 2$, $I(C) = I(D) = \\log_2 8 = 3$. Lo raro informa más.', antes: '$I = \\log_2(1/p)$. ¿Cuántos bits aporta cada símbolo?' },
      { t: '<strong>Entropía.</strong> Media ponderada: $H = \\frac{1}{2}\\cdot 1 + \\frac{1}{4}\\cdot 2 + \\frac{1}{8}\\cdot 3 + \\frac{1}{8}\\cdot 3 = 0{,}5 + 0{,}5 + 0{,}375 + 0{,}375 = 1{,}75$ bits por símbolo.', antes: 'Pesa cada información por su probabilidad y suma.' },
      { t: '<strong>Un código.</strong> Corto para lo frecuente: A = 0, B = 10, C = 110, D = 111. Ningún código es el principio de otro, así que se decodifica sin separadores.' },
      { t: '<strong>Longitud media.</strong> $\\frac{1}{2}\\cdot 1 + \\frac{1}{4}\\cdot 2 + \\frac{1}{8}\\cdot 3 + \\frac{1}{8}\\cdot 3 = 1{,}75$ bits: exactamente la entropía. El código es óptimo; Shannon dice que no se puede bajar de ahí.', antes: 'Calcula la longitud media del código. ¿Cómo se compara con $H$?' },
      { t: '<strong>ABAC.</strong> $0\\,10\\,0\\,110$: 7 bits. Con un código fijo de 2 bits por símbolo serían 8. Y leyendo $0100110$ de izquierda a derecha se recupera ABAC sin ambigüedad.' }
    ],
    cierre: 'La entropía sale exacta porque las probabilidades son potencias de 2. Con otras probabilidades el mejor código se queda un poco por encima de $H$, pero nunca por debajo: ese es el teorema.'
  });

  p.demo({
    title: 'Entropía de una moneda trucada',
    intro: 'Cambia la probabilidad de cara. La entropía es máxima cuando la moneda es justa, y cae a cero cuando el resultado es seguro.',
    predice: 'Con $p = 0{,}9$ la entropía es unos 0,47 bits. ¿Con $p = 0{,}1$ será la misma, mayor o menor? Piensa en la simetría del problema.',
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
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
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

  p.note('La forma habitual de puntuar un modelo de lenguaje es esta misma entropía, exponenciada: se ' +
    'llama <strong>perplejidad</strong> y vale $2^H$. Deshacer el logaritmo la convierte en algo que ' +
    'se entiende sin pensar —entre cuántas opciones está dudando el modelo, de media— en vez de en ' +
    'bits. Vale 1 si acierta con total seguridad y el tamaño del vocabulario si no tiene ni idea; en ' +
    '[[ia-secuencias|el tema de predecir el siguiente token]] se mide sobre un texto de verdad.',
    null, 'La entropía, exponenciada');

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
    predice: 'Con el deslizador en 1 los cuatro símbolos son equiprobables. ¿La entropía será 2 bits, más o menos? ¿Y el código variable mejorará al fijo, o lo empeorará?',
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
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
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

  /* ---------------------------------------------------------------- */
  p.note('Un algoritmo de compresión de 1994 acabó, veintidós años después, decidiendo cómo leen el ' +
    'texto los modelos de lenguaje. Consiste en buscar el par de símbolos vecinos más frecuente y ' +
    'sustituirlo por uno nuevo, una y otra vez: exactamente la idea de que comprimir es quedarse con ' +
    'lo que se repite. En [[ia-tokens|el tema de los tokens]] se ve funcionando, y se ve también que ' +
    'el tamaño del diccionario que produce es un compromiso entre cuánto ocupa el texto y cuánto ocupa ' +
    'el propio diccionario.', null, 'Comprimir para poder leer');

  p.section('Codificar con la distribución equivocada');

  p.text('El teorema anterior dice cuánto ocupa un mensaje codificado <em>bien</em>, o sea, sabiendo las ' +
    'probabilidades de verdad. ¿Y si no se saben? Si crees que las probabilidades son $q$ cuando en ' +
    'realidad son $p$, construirás el código pensando en $q$: darás los códigos cortos a lo que ' +
    '<em>tú</em> crees frecuente. El mensaje seguirá siendo legible, pero ocupará de más, y se puede ' +
    'calcular exactamente cuánto de más.');

  p.formula('H(p, q) = -\\sum_i p_i \\log_2 q_i',
    'entropía cruzada de p respecto de q',
    'Se lee: <em>«hache de pe, cu, es menos el sumatorio en i de pe sub i por el logaritmo en base dos ' +
    'de cu sub i»</em>.<br><br>Fíjate en que aparecen las dos distribuciones y en qué papel hace cada ' +
    'una: el código lo dicta $q$, porque es lo que crees, y por eso el símbolo $i$ ocupa ' +
    '$\\log_2(1/q_i)$ bits. Pero lo que <strong>pesa</strong> cada símbolo es $p_i$, porque es lo que ' +
    'de verdad va a salir. La entropía de siempre es el caso $q = p$: acertar del todo.');

  p.text('Como la entropía $H(p)$ es lo mínimo que se puede ocupar, la diferencia entre lo que gastas y ' +
    'ese mínimo es <strong>lo que te cuesta tu error</strong>. Ese exceso tiene nombre propio.');

  p.formula('D_{KL}(p \\Vert q) = H(p, q) - H(p) = \\sum_i p_i \\log_2 \\frac{p_i}{q_i}',
    'divergencia de Kullback-Leibler',
    'Se lee: <em>«de ka ele de pe respecto de cu»</em>. La doble barra $\\Vert$ separa las dos ' +
    'distribuciones y no significa división.<br><br>Es el <strong>número de bits que desperdicias por ' +
    'símbolo</strong> por creer $q$ en vez de $p$. Nunca es negativa, porque no se puede gastar menos ' +
    'que el mínimo, y vale cero exactamente cuando $q = p$. Por eso se usa como una «distancia» entre ' +
    'distribuciones, aunque no lo sea del todo: no es simétrica.');

  p.demo({
    title: 'Lo que cuesta creerse otra cosa',
    intro: 'La distribución real $p$ es fija y tiene entropía exacta de 1,75 bits. Mueve el mando para acercar tu creencia $q$ a la realidad y mira las tres cantidades: lo mínimo que se podría ocupar, lo que ocupas de verdad, y la diferencia.',
    predice: 'Cuando $q$ coincida exactamente con $p$, ¿cuánto valdrá la divergencia, y qué le pasará a la entropía cruzada?',
    build: function (host) {
      var t = 0, extremo = false;
      var pReal = [0.5, 0.25, 0.125, 0.125];
      var nombres = ['A', 'B', 'C', 'D'];
      var out = W.readout(host, '');
      function qActual() {
        var partida = extremo ? [0.05, 0.05, 0.4, 0.5] : [0.25, 0.25, 0.25, 0.25];
        return partida.map(function (v, i) { return v + t * (pReal[i] - v); });
      }
      function bits(q) {
        var hc = 0, i;
        for (i = 0; i < 4; i++) hc += -pReal[i] * Math.log(Math.max(q[i], 1e-12)) / Math.LN2;
        return hc;
      }
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 3.9, ymin: 0, ymax: 0.62, height: 250,
        xlabel: 'símbolo', ylabel: 'probabilidad', xstep: 1,
        xtickLabel: function (i) { return nombres[Math.round(i)] || ''; },
        aria: 'Dos distribuciones de probabilidad sobre cuatro símbolos, la real y la que se cree, en barras enfrentadas',
        draw: function (g) {
          var q = qActual();
          pReal.forEach(function (v, i) { g.bars([{ x: i - 0.17, h: v, color: 0 }], { width: 0.3 }); });
          q.forEach(function (v, i) { g.bars([{ x: i + 0.17, h: v, color: 2 }], { width: 0.3 }); });
        }
      });
      W.legend(host, [{ c: 0, t: 'p, la realidad' }, { c: 2, t: 'q, lo que crees' }]);
      function pinta() {
        var q = qActual(), hc = bits(q), h = 1.75, kl = hc - h;
        out.set('Entropía real $H(p) = ' + U.fmt(h, 3) + '$ bits &nbsp;·&nbsp; ' +
          'entropía cruzada $H(p, q) = ' + U.fmt(hc, 3) + '$ bits<br>' +
          '<strong>Divergencia $D_{KL}(p \\Vert q) = ' + U.fmt(kl, 3) + '$ bits desperdiciados por símbolo.</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (kl < 0.001 ? 'Creencia exacta: no se desperdicia nada, y la entropía cruzada baja hasta la entropía. Por debajo no se puede bajar.'
            : 'En un mensaje de mil símbolos, eso son ' + U.fmt(kl * 1000, 0) + ' bits de más por haberte equivocado de código.') +
          '</span>');
        plot.render();
      }
      W.chips(host, [{ label: 'partir de una creencia uniforme', value: 0 }, { label: 'partir de una creencia muy mala', value: 1 }],
        { value: 0, on: function (v) { extremo = !!v; pinta(); } });
      W.slider(W.row(host), {
        label: 'acercar q a la realidad', min: 0, max: 1, step: 0.01, value: 0, dec: 2,
        on: function (v) { t = v; pinta(); }
      });
      pinta();
    }
  });

  p.comprueba('¿Puede la divergencia $D_{KL}(p \\Vert q)$ ser negativa?', [
    { t: 'No: sería ocupar menos que la entropía, y el teorema de codificación lo prohíbe', ok: true, por: 'La entropía es el mínimo alcanzable con cualquier código. Creerse otra cosa solo puede costar igual (si $q = p$) o más, nunca menos.' },
    { t: 'Sí, si $q$ es más concentrada que $p$', ok: false, por: 'Concentrar mal la creencia sale caro, no barato: se le dan códigos cortos a símbolos que apenas salen, y los frecuentes acaban con códigos largos.' },
    { t: 'Sí, cuando las dos distribuciones son muy parecidas', ok: false, por: 'Cuanto más se parecen, más se acerca a cero, pero siempre por arriba. Llega a cero justo cuando son iguales.' }
  ]);

  p.note('No es simétrica, y no es un detalle: $D_{KL}(p \\Vert q)$ y $D_{KL}(q \\Vert p)$ son números ' +
    'distintos. Se ve en el caso extremo: si $q$ da probabilidad cero a algo que $p$ sí produce, el ' +
    'término correspondiente se dispara a infinito —tu código no tiene ni siquiera un símbolo para eso—, ' +
    'mientras que al revés no pasa nada. Por eso conviene leerla como «bits desperdiciados» y no como ' +
    'una distancia.', 'warn', 'El orden importa');

  p.util('La entropía cruzada es, literalmente, la función que se minimiza al entrenar casi cualquier ' +
    'clasificador —está desarrollado en [[ia-perdida|medir el error y bajar la ladera]]—: el modelo ' +
    'propone una distribución $q$ sobre las respuestas posibles, la realidad es ' +
    'una $p$ que vale 1 en la correcta, y entrenar es acercar una a otra. Y la divergencia KL aparece ' +
    'en compresión, en el criterio de selección de modelos de Akaike y en la comparación de secuencias ' +
    'genéticas.');

  p.note('El bit de Shannon es una unidad de sorpresa, y es abstracto a propósito: no dice de qué está ' +
    'hecho. En [[maq-bits|el bloque de máquinas y lenguajes]] se le pone cuerpo, y resulta ser un ' +
    'cable con tensión o sin ella. Merece la pena ver las dos caras: aquí un bit es cuánto se aprende ' +
    'al resolver una duda entre dos opciones igual de probables, y allí es lo que cabe en un hilo de ' +
    'cobre.', null, 'El bit, con cuerpo');

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

  p.trampas([
    { e: 'Confundir información con importancia', por: '«Mañana saldrá el sol» es importante y aporta 0 bits. La información mide sorpresa, no valor.' },
    { e: 'Usar el logaritmo en base 10 o natural', por: 'La unidad bit exige base 2: una moneda justa da $\\log_2 2 = 1$ bit. Con $\\ln$ saldría 0,69, que no es un bit.' },
    { e: '«Más símbolos, más entropía»', por: 'Una fuente de 100 símbolos en la que uno sale el 99 % de las veces tiene menos entropía que una moneda justa. Cuentan las probabilidades, no el alfabeto.' },
    { e: 'Creer que un archivo se puede comprimir indefinidamente', por: 'Un ZIP ya está cerca de la entropía; volver a comprimirlo no gana nada. Y un compresor que redujera <em>todo</em> archivo es imposible: dos archivos distintos acabarían iguales.' }
  ]);

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
    dec: 4,
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
    dec: 4,
    tol: 1e-4,      // los dos sumandos se redondean por separado
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
    answer: function (d) { return U.miles(d.bits) + ' bits'; }
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
    dec: 4,
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

  p.note('Este resultado reaparece en el bloque de cibernética, en [[cib-variedad]], con otro nombre y desde otro problema. Ross Ashby, estudiando cómo se regula un sistema, definió la <strong>variedad</strong> de algo como el número de estados distintos que puede presentar, y la midió tomando su logaritmo en base dos. Es decir, la misma cuenta que acabas de hacer aquí. Shannon preguntaba cuánta información hace falta para transmitir un mensaje y Ashby cuántas jugadas hacen falta para controlar una situación, y la respuesta resultó ser el mismo logaritmo: por eso la teoría de la información y la cibernética nacieron de la mano.', null, 'La misma medida, otra vez');

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
