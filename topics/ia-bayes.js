/* Tema: Bayes ingenuo: el filtro de spam */
Course.topic('ia-bayes', function (p) {

  p.puente('Las dos piezas están ya en el curso. De [[pe-condicionada|probabilidad condicionada]] viene ' +
    'el teorema de Bayes, que da la vuelta al condicionamiento: de «probabilidad del síntoma dada la ' +
    'causa» a «probabilidad de la causa dado el síntoma». Y de [[al-radicales-log|los logaritmos]] ' +
    'viene la propiedad que convierte un producto en una suma, sin la cual esto no funcionaría en un ' +
    'ordenador.');

  p.text('Este fue el primer sistema de aprendizaje automático que usaron millones de personas todos los ' +
    'días sin saberlo. A principios de los años dos mil el correo basura era un problema serio y sin ' +
    'solución; en 2002 se popularizó la idea de dejar de escribir reglas y ponerse a ' +
    '<strong>contar palabras</strong>, y el problema quedó, si no resuelto, sí domesticado en un par ' +
    'de años. La matemática que hay detrás cabe en esta página.');

  /* ---------------------------------------------------------------- */
  p.section('Dar la vuelta a la pregunta');

  p.text('Lo que queremos saber es $P(\\text{basura} \\mid \\text{el texto})$, y eso no se puede contar ' +
    'directamente: no hay dos correos iguales, así que no hay estadística de «este texto exacto». Lo ' +
    'que <strong>sí</strong> se puede contar, sobre un montón de correos ya clasificados, es lo ' +
    'contrario: con qué frecuencia aparece cada palabra en los de basura y en los buenos. Bayes ' +
    'convierte lo segundo en lo primero.');

  p.formula('P(B \\mid t) = \\frac{P(t \\mid B)\\;P(B)}{P(t)}',
    'Bayes, aplicado a un texto',
    'Se lee: <em>«la probabilidad de be dado te es igual a la probabilidad de te dado be, por la de be, ' +
    'partido por la de te»</em>. Aquí $B$ es «es basura» y $t$ es «el texto es este».<br><br>El ' +
    'denominador $P(t)$ es el mismo para las dos clases, así que para <strong>decidir cuál gana no ' +
    'hace falta calcularlo</strong>: basta comparar los numeradores. Eso ahorra la parte más difícil ' +
    'de la cuenta, y es la razón de que el método sea tan barato.');

  /* ---------------------------------------------------------------- */
  p.section('La suposición ingenua');

  p.text('Queda el problema de calcular $P(t \\mid B)$, la probabilidad de que un correo de basura sea ' +
    '<em>exactamente</em> este texto. Sigue sin poderse contar. Aquí entra la idea que le da nombre al ' +
    'método: hacer como si cada palabra apareciera <strong>independientemente de las demás</strong>, y ' +
    'multiplicar.');

  p.formula('P(t \\mid B) \\approx \\prod_{i} P(w_i \\mid B)',
    'la suposición ingenua de independencia',
    'Se lee: <em>«la probabilidad del texto dado be es aproximadamente el productorio, sobre las ' +
    'palabras, de la probabilidad de la palabra i dado be»</em>. El símbolo $\\prod$ es un producto de ' +
    'muchos factores, como $\\sum$ es una suma.<br><br>Es la condición de independencia de ' +
    '[[pe-condicionada|probabilidad condicionada]], $P(A\\cap B) = P(A)P(B)$, aplicada a todas las ' +
    'palabras a la vez. Y ahora cada factor <strong>sí</strong> se puede contar: cuántas veces sale ' +
    'esa palabra en los correos de basura, dividido entre el total.');

  p.note('La suposición es <strong>falsa</strong>, y no un poco: en cualquier idioma las palabras van ' +
    'juntas. Si aparece «cuenta», es mucho más probable que aparezca «bancaria». Pero el método no ' +
    'necesita que las probabilidades salgan bien: solo necesita que la de una clase salga ' +
    '<em>mayor</em> que la de la otra. Los errores se cometen en las dos y a menudo se compensan, y ' +
    'por eso un modelo con una hipótesis descaradamente falsa acierta tanto. Es un buen momento para ' +
    'recordar que un modelo no aspira a ser verdad, sino a ser útil.', 'warn', 'Falsa, y funciona igual');

  /* ---------------------------------------------------------------- */
  p.section('Por qué se suman logaritmos');

  p.text('Multiplicar cien números menores que uno da un número tan pequeño que el ordenador lo redondea ' +
    'a cero, y entonces las dos clases empatan a cero y no se puede decidir nada. La salida es la ' +
    'propiedad que convierte productos en sumas.');

  p.formulas([
    '\\log(a\\cdot b) = \\log a + \\log b',
    '\\text{puntuación}(B) = \\log P(B) + \\sum_i \\log P(w_i \\mid B)'
  ], 'de multiplicar a sumar',
    'Se lee la segunda: <em>«la puntuación de be es el logaritmo de pe de be, más el sumatorio de los ' +
    'logaritmos de pe de doble uve sub i dado be»</em>.<br><br>Como el logaritmo es creciente, ' +
    '<strong>comparar puntuaciones equivale a comparar probabilidades</strong>: la clase que gane en ' +
    'logaritmos gana también sin ellos. Y de propina, cada palabra aporta un sumando, así que se puede ' +
    'ver cuánto empuja cada una hacia cada lado. Los logaritmos de números menores que 1 son ' +
    'negativos, así que las puntuaciones salen negativas y gana la <em>menos</em> negativa.');

  p.demo({
    title: 'Un filtro de spam de verdad',
    intro: 'Abajo hay dieciséis correos ya clasificados: ocho de basura y ocho buenos. Con ellos se cuentan las palabras. Escribe un mensaje o elige uno de los de prueba, y verás la aportación de cada palabra y la decisión final.',
    predice: 'La palabra «reunión» aparece varias veces en los correos buenos y ninguna en los de basura. ¿Su aportación empujará hacia la basura o hacia lo bueno, y crees que mucho o poco?',
    build: function (host) {
      var SPAM = [
        'gana dinero rapido desde casa sin esfuerzo',
        'oferta unica gana premios gratis hoy',
        'dinero gratis urgente pincha aqui',
        'premio urgente reclama tu dinero ahora',
        'gratis gratis oferta limitada pincha ya',
        'trabaja desde casa y gana dinero facil',
        'reclama tu premio antes de hoy gratis',
        'oferta urgente dinero facil sin esfuerzo'
      ];
      var BUENO = [
        'te espero en la reunion de mañana',
        'adjunto el informe de la reunion',
        'mañana hay clase de matematicas a las nueve',
        'la reunion se pasa al jueves por la tarde',
        'he revisado el informe y esta bien',
        'quedamos mañana antes de la clase',
        'el examen de matematicas es el jueves',
        'gracias por el informe te contesto mañana'
      ];
      var texto = 'gana dinero gratis';

      function normaliza(s) {
        return String(s).toLowerCase()
          .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i')
          .replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u')
          .replace(/[^a-zñ\s]/g, ' ');
      }
      function palabras(s) {
        return normaliza(s).split(/\s+/).filter(function (w) { return w.length > 1; });
      }
      /* Se cuenta una vez, al construir: el vocabulario y los totales. */
      var cS = {}, cB = {}, nS = 0, nB = 0, vocab = {};
      SPAM.forEach(function (m) { palabras(m).forEach(function (w) { cS[w] = (cS[w] || 0) + 1; nS++; vocab[w] = 1; }); });
      BUENO.forEach(function (m) { palabras(m).forEach(function (w) { cB[w] = (cB[w] || 0) + 1; nB++; vocab[w] = 1; }); });
      var V = Object.keys(vocab).length;

      /* Suavizado de Laplace: un +1 a cada cuenta y el vocabulario en el
         denominador, para que ninguna palabra valga cero y anule el
         producto entero. */
      function pS(w) { return ((cS[w] || 0) + 1) / (nS + V); }
      function pB(w) { return ((cB[w] || 0) + 1) / (nB + V); }

      var out = W.readout(host, '');
      var panel = W.mono(host, '');

      function calcula() {
        var ws = palabras(texto);
        var sS = Math.log(0.5), sB = Math.log(0.5), filas = [];
        ws.forEach(function (w) {
          var a = Math.log(pS(w)), b = Math.log(pB(w));
          sS += a; sB += b;
          filas.push({ w: w, a: a, b: b, dif: a - b, vistoS: cS[w] || 0, vistoB: cB[w] || 0 });
        });
        return { ws: ws, sS: sS, sB: sB, filas: filas };
      }
      function pinta() {
        var R = calcula();
        var h = 'palabra        en basura  en buenos   aportación\n';
        h += '─────────────────────────────────────────────────\n';
        R.filas.forEach(function (f) {
          var flecha = f.dif > 0.01 ? '→ basura' : (f.dif < -0.01 ? '→ bueno ' : '  neutra');
          h += (f.w + '              ').slice(0, 14) +
               ('   ' + f.vistoS + '      ').slice(0, 10) +
               ('  ' + f.vistoB + '      ').slice(0, 10) +
               (f.dif >= 0 ? '+' : '') + U.fmt(f.dif, 2) + '  ' + flecha + '\n';
        });
        if (!R.filas.length) h += '(escribe algo)\n';
        panel.set(h);
        var gana = R.sS > R.sB;
        out.set('Puntuación como <strong>basura</strong>: ' + U.fmt(R.sS, 2) +
          ' &nbsp;·&nbsp; como <strong>bueno</strong>: ' + U.fmt(R.sB, 2) + '<br>' +
          '<strong style="color:var(--' + (gana ? 'bad' : 'ok') + ')">Veredicto: ' +
          (gana ? 'correo basura' : 'correo legítimo') + '</strong> ' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">(gana la puntuación menos negativa, ' +
          'por ' + U.fmt(Math.abs(R.sS - R.sB), 2) + ')</span><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Vocabulario de ' + V + ' palabras. ' +
          'Una palabra que nunca ha salido en una clase no puntúa cero gracias al suavizado: aporta el ' +
          'mínimo, pero no anula el resto.</span>');
      }
      W.texto(host, {
        label: 'mensaje a clasificar', value: texto, multilinea: false,
        on: function (v) { texto = v; pinta(); }
      });
      W.chips(host, [
        { label: 'gana dinero gratis', value: 'gana dinero gratis' },
        { label: 'te espero en la reunion', value: 'te espero en la reunion' },
        { label: 'oferta de la reunion de mañana', value: 'oferta de la reunion de mañana' },
        { label: 'urgente pincha aqui', value: 'urgente pincha aqui' }
      ], { value: texto, on: function (v) { texto = v; pinta(); } });
      pinta();
    }
  });

  p.text('Mira la columna de la derecha. Cada palabra aporta un número: positivo si empuja hacia la ' +
    'basura y negativo si empuja hacia lo bueno. El veredicto es la suma, y por eso este modelo, como ' +
    'el árbol del tema anterior, <strong>se puede explicar</strong>: se señala la palabra que más ha ' +
    'pesado y ya está.');

  /* ---------------------------------------------------------------- */
  p.section('La palabra que nunca se ha visto');

  p.text('Hay un accidente que hay que evitar. Si una palabra no aparece <em>ninguna vez</em> en los ' +
    'correos de basura, su probabilidad contada sería $0$, y al multiplicar, <strong>todo el producto ' +
    'se hace cero</strong>: una sola palabra desconocida vetaría la clase entera. En logaritmos es ' +
    'peor todavía, porque $\\log 0$ es menos infinito.');

  p.formula('P(w \\mid B) = \\frac{\\text{veces que sale } w \\text{ en } B + 1}{\\text{total de palabras de } B + V}',
    'suavizado de Laplace',
    'Se lee: <em>«pe de doble uve dado be es las veces que sale más uno, partido por el total más uve»</em>, ' +
    'donde $V$ es el tamaño del vocabulario.<br><br>Se le regala <strong>una aparición a cada ' +
    'palabra</strong>, incluso a las que no salieron nunca. Así ninguna probabilidad es cero, el ' +
    'denominador se ajusta para que todas sigan sumando 1, y una palabra desconocida pesa poco en vez ' +
    'de vetarlo todo. Es la misma idea que usó Laplace para estimar la probabilidad de que salga el ' +
    'sol mañana.');

  p.ejemplo({
    title: 'Clasificar un mensaje a mano',
    enunciado: 'En los correos de basura hay 40 palabras en total, y en los buenos, 60. El vocabulario tiene 20 palabras distintas. «Gratis» sale 8 veces en basura y 0 en buenos; «reunión», 0 y 6. Las dos clases son igual de probables a priori. Clasificar el mensaje «gratis reunión».',
    pasos: [
      { t: '<strong>Probabilidad de «gratis».</strong> En basura: $\\frac{8+1}{40+20} = \\frac{9}{60} = 0{,}15$. En buenos: $\\frac{0+1}{60+20} = \\frac{1}{80} = 0{,}0125$.', antes: 'Aplica el suavizado: suma 1 arriba y el vocabulario abajo.' },
      { t: '<strong>Probabilidad de «reunión».</strong> En basura: $\\frac{0+1}{60} = 0{,}01667$. En buenos: $\\frac{6+1}{80} = \\frac{7}{80} = 0{,}0875$.', antes: 'Lo mismo con la otra palabra. Fíjate en que ninguna sale cero.' },
      { t: '<strong>Las dos puntuaciones.</strong> Como las clases son igual de probables, el $P(B)$ inicial da lo mismo a las dos y se puede omitir. Basura: $0{,}15 \\times 0{,}01667 = 0{,}0025$. Buenos: $0{,}0125 \\times 0{,}0875 = 0{,}00109$.', antes: 'Multiplica las dos probabilidades dentro de cada clase.' },
      { t: '<strong>El veredicto.</strong> $0{,}0025 > 0{,}00109$: gana <strong>basura</strong>, por poco más del doble. La palabra «gratis» es tan característica que arrastra a «reunión».', antes: 'Compara los dos números. ¿Cuál es mayor?' },
      { t: '<strong>Sin suavizado habría sido un desastre.</strong> «Gratis» tendría probabilidad 0 en buenos y «reunión» 0 en basura, así que las dos clases valdrían exactamente 0 y el filtro no sabría qué contestar.' }
    ],
    cierre: 'Con dos palabras se puede multiplicar; con doscientas, el producto se hace tan pequeño que el ordenador lo redondea a cero. Por eso en la práctica se suman logaritmos, que es la misma comparación escrita de otra manera.'
  });

  p.comprueba('La suposición de que las palabras son independientes es claramente falsa. ¿Por qué se usa igual?', [
    { t: 'Porque para decidir solo hace falta saber qué clase puntúa más alto, y el error afecta parecido a las dos', ok: true, por: 'Las probabilidades que salen están mal calibradas —suelen salir pegadas a 0 o a 1—, pero el <em>orden</em> entre las dos clases se conserva casi siempre, y el orden es lo único que se usa para decidir.' },
    { t: 'Porque en los correos las palabras sí son independientes', ok: false, por: 'No lo son en ningún texto: si aparece «cuenta» sube mucho la probabilidad de «bancaria». La suposición es falsa y se asume a sabiendas.' },
    { t: 'Porque con suficientes datos la suposición acaba siendo cierta', ok: false, por: 'Más datos dan mejores <em>estimaciones</em> de cada $P(w\\mid B)$, pero no cambian que las palabras estén relacionadas entre sí. La dependencia es del idioma, no de la muestra.' }
  ]);

  p.util('Los filtros de correo modernos son mucho más complicados, pero este método sigue vivo donde hace ' +
    'falta algo rapidísimo y explicable: detección del idioma de un texto, clasificación de avisos por ' +
    'departamento, primer cribado de documentos legales, análisis de opiniones. Se entrena en segundos ' +
    'sobre un portátil, funciona con pocos ejemplos y siempre puede señalar qué palabras han decidido. ' +
    'En la práctica se usa además como referencia: un modelo caro que no le gane a Bayes ingenuo no ' +
    'está justificando su precio.');

  p.hist('La clasificación automática de textos por probabilidades la propuso Melvin Maron en 1961, en un ' +
    'artículo sobre indexación automática de documentos. La aplicación al correo basura llegó en 1998 ' +
    'con un trabajo de Mehran Sahami y sus colaboradores, pero lo que la hizo universal fue un ensayo ' +
    'de Paul Graham de agosto de 2002, <em>A Plan for Spam</em>, que contaba el método en lenguaje ' +
    'llano y provocó que se implementara en casi todos los clientes de correo en cuestión de meses. ' +
    'Es uno de los pocos casos en los que se puede fechar con precisión el momento en que un método ' +
    'estadístico cambió la vida diaria de mucha gente.');

  p.trampas([
    { e: 'Olvidar el suavizado', por: 'Una sola palabra nunca vista en una clase pone su producto a cero y veta la clase entera, por muchas pistas que hubiera en sentido contrario.' },
    { e: 'Multiplicar cien probabilidades en vez de sumar logaritmos', por: 'Cien factores de 0,01 dan $10^{-200}$, que el ordenador redondea a cero. Las dos clases empatan a cero y no se decide nada.' },
    { e: 'Leer la probabilidad que sale como si fuera de fiar', por: 'Bayes ingenuo suele dar 0,999 o 0,001 y muy poco en medio, porque al multiplicar pistas correlacionadas cuenta la misma evidencia varias veces. Sirve para ordenar, no para apostar.' },
    { e: 'Calcular el denominador $P(t)$', por: 'Es el mismo para las dos clases, así que no cambia cuál gana. Calcularlo es trabajo tirado.' },
    { e: 'Confundir $P(B\\mid t)$ con $P(t\\mid B)$', por: 'Es la falacia del fiscal otra vez. Lo que se cuenta en los datos es la segunda; la que interesa es la primera, y Bayes es el puente entre ellas.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Suavizar una probabilidad',
    level: 'basico',
    gen: function (r) {
      var veces = r.int(0, 9), total = r.pick([40, 50, 60, 80]), V = r.pick([10, 20, 25]);
      return { veces: veces, total: total, V: V, p: (veces + 1) / (total + V) };
    },
    ask: function (d) {
      return 'La palabra «oferta» aparece $' + d.veces + '$ veces entre las $' + d.total + '$ palabras de ' +
        'los correos de basura, y el vocabulario tiene $' + d.V + '$ palabras distintas. Calcula ' +
        '$P(\\text{oferta} \\mid \\text{basura})$ con suavizado de Laplace. (cuatro decimales)';
    },
    fields: [{ name: 'p', label: 'P', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.p, 8) }; },
    dec: 4,
    /* Sin suavizar sale lo mismo que suavizando siempre que el total sea
       veces·V (40 = 4·10, 60 = 3·20...), y eso ocurre a menudo con estos
       datos. Se compara con la solución, que es la guarda general. */
    errores: [{ si: function (v, d) { var crudo = d.veces / d.total; return Math.abs(crudo - d.p) > 0.0005 && Math.abs(v.p - crudo) < 0.0005; }, msg: 'Esa es la proporción sin suavizar. El suavizado suma 1 arriba y el tamaño del vocabulario abajo.' }],
    hint: function () { return 'Numerador: las veces más 1. Denominador: el total más el vocabulario.'; },
    steps: function (d) {
      return ['$\\dfrac{' + d.veces + ' + 1}{' + d.total + ' + ' + d.V + '} = \\dfrac{' + (d.veces + 1) + '}{' + (d.total + d.V) + '} = ' + U.fmt(d.p, 4) + '$',
        d.veces === 0
          ? 'Sin suavizar habría salido 0, y ese cero habría anulado el producto entero.'
          : 'El suavizado la baja un poco, y a cambio ninguna palabra puede vetar una clase.'];
    },
    answer: function (d) { return U.fmt(d.p, 4); }
  });

  p.exercise({
    title: 'Por qué no se multiplica',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([50, 100, 150, 200]), p = r.pick([0.01, 0.001]);
      var exp = n * Math.log(p) / Math.LN10;
      return { n: n, p: p, exp: Math.round(exp) };
    },
    ask: function (d) {
      return 'Un correo tiene $' + d.n + '$ palabras y cada una tiene una probabilidad de alrededor de $' +
        U.fmt(d.p, 3) + '$. Si se multiplican todas, el resultado es del orden de $10^{?}$. ¿Cuál es ' +
        'ese exponente?';
    },
    fields: [{ name: 'e', label: 'exponente', w: 'tiny' }],
    sol: function (d) { return { e: d.exp }; },
    errores: [{ si: function (v, d) { return v.e === -d.exp; }, msg: 'El resultado es un número muy pequeño, así que el exponente es negativo.' }],
    hint: function (d) { return '$' + U.fmt(d.p, 3) + ' = 10^{' + Math.round(Math.log(d.p) / Math.LN10) + '}$, y multiplicar ' + d.n + ' de esos suma los exponentes.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.p, 3) + ' = 10^{' + Math.round(Math.log(d.p) / Math.LN10) + '}$.',
        'Multiplicar $' + d.n + '$ de ellos suma los exponentes: $10^{' + d.exp + '}$.',
        'Un ordenador con números normales se queda sin precisión mucho antes y lo redondea a cero: por eso se suman logaritmos.'];
    },
    answer: function (d) { return String(d.exp); }
  });

  p.exercise({
    title: 'Decidir con dos palabras',
    level: 'medio',
    gen: function (r) {
      var a1 = r.int(1, 9) / 10, a2 = r.int(1, 9) / 10;
      var b1 = r.int(1, 9) / 10, b2 = r.int(1, 9) / 10;
      var sB = a1 * a2, sG = b1 * b2;
      if (Math.abs(sB - sG) < 0.02) return null;
      return { a1: a1, a2: a2, b1: b1, b2: b2, sB: sB, sG: sG, gana: sB > sG ? 'basura' : 'bueno' };
    },
    ask: function (d) {
      return 'Un mensaje tiene dos palabras. La primera tiene probabilidad $' + U.fmt(d.a1, 1) +
        '$ en basura y $' + U.fmt(d.b1, 1) + '$ en buenos; la segunda, $' + U.fmt(d.a2, 1) + '$ y $' +
        U.fmt(d.b2, 1) + '$. Las dos clases son igual de probables de partida. Da los dos productos y ' +
        'el veredicto. (tres decimales)';
    },
    fields: [
      { name: 'x', label: 'producto basura', w: 'tiny' }, { name: 'y', label: 'producto bueno', w: 'tiny' },
      { name: 'q', label: 'Veredicto', opts: [{ t: 'basura', v: 'basura' }, { t: 'bueno', v: 'bueno' }] }
    ],
    sol: function (d) { return { x: U.round(d.sB, 6), y: U.round(d.sG, 6), q: d.gana }; },
    dec: 3,
    hint: function () { return 'Como las dos clases son igual de probables, ese factor común se puede omitir: basta multiplicar las dos probabilidades dentro de cada clase y comparar.'; },
    steps: function (d) {
      return ['Basura: $' + U.fmt(d.a1, 1) + ' \\times ' + U.fmt(d.a2, 1) + ' = ' + U.fmt(d.sB, 3) + '$.',
        'Buenos: $' + U.fmt(d.b1, 1) + ' \\times ' + U.fmt(d.b2, 1) + ' = ' + U.fmt(d.sG, 3) + '$.',
        'Gana <strong>' + d.gana + '</strong>. El denominador $P(t)$ ni se ha calculado: es el mismo para los dos y no cambia quién gana.'];
    },
    answer: function (d) { return d.gana; }
  });

  p.exercise({
    title: 'La aportación de una palabra',
    level: 'medio',
    gen: function (r) {
      var pb = r.pick([0.02, 0.05, 0.1, 0.2]), pg = r.pick([0.01, 0.04, 0.08, 0.16]);
      if (pb === pg) return null;
      var dif = Math.log(pb) - Math.log(pg);
      return { pb: pb, pg: pg, dif: dif, lado: dif > 0 ? 'basura' : 'bueno' };
    },
    ask: function (d) {
      return 'Una palabra tiene probabilidad $' + U.fmt(d.pb, 2) + '$ en los correos de basura y $' +
        U.fmt(d.pg, 2) + '$ en los buenos. Su aportación a la puntuación es ' +
        '$\\ln P(w \\mid B) - \\ln P(w \\mid G)$. Calcúlala y di hacia qué lado empuja. (tres decimales)';
    },
    fields: [
      { name: 'a', label: 'aportación', w: 'tiny' },
      { name: 'q', label: 'Empuja hacia', opts: [{ t: 'basura', v: 'basura' }, { t: 'bueno', v: 'bueno' }] }
    ],
    sol: function (d) { return { a: U.round(d.dif, 6), q: d.lado }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.a + d.dif) < 0.002; }, msg: 'Has restado al revés. El primer término es el de la clase basura.' }],
    hint: function () { return 'La resta de dos logaritmos es el logaritmo del cociente: $\\ln\\frac{P(w\\mid B)}{P(w\\mid G)}$. Si el cociente pasa de 1, el logaritmo es positivo.'; },
    steps: function (d) {
      return ['$\\ln\\dfrac{' + U.fmt(d.pb, 2) + '}{' + U.fmt(d.pg, 2) + '} = \\ln ' + U.fmt(d.pb / d.pg, 3) + ' = ' + U.fmt(d.dif, 3) + '$',
        d.dif > 0
          ? 'Positiva: la palabra es más típica de la basura y empuja hacia allí.'
          : 'Negativa: la palabra es más típica de los correos buenos y empuja hacia allí.',
        'La puntuación final es la suma de todas estas aportaciones, y por eso siempre se puede decir qué palabra ha decidido.'];
    },
    answer: function (d) { return U.fmt(d.dif, 3) + ', hacia ' + d.lado; }
  });

  p.exercise({
    title: 'Qué promete y qué no',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'el filtro dice que un correo es basura con probabilidad 0,999', v: 'no', por: 'Bayes ingenuo da probabilidades mal calibradas: al multiplicar pistas relacionadas cuenta la misma evidencia varias veces y se va a los extremos. El orden entre clases sí es de fiar; el número, no.' },
        { t: 'el filtro ordena cien correos de más a menos sospechosos', v: 'si', por: 'Ordenar es justo lo que el método hace bien, porque solo necesita que la puntuación de una clase supere a la de la otra.' },
        { t: 'el filtro señala qué palabras han pesado más en la decisión', v: 'si', por: 'Cada palabra aporta un sumando a la puntuación, así que basta ordenarlos. Es de los pocos modelos que explican su decisión sin esfuerzo.' },
        { t: 'el filtro captará que «cuenta bancaria» es más sospechoso que «cuenta» y «bancaria» por separado', v: 'no', por: 'La suposición ingenua trata cada palabra por su cuenta: por construcción, no puede ver que dos palabras juntas signifiquen algo distinto.' },
        { t: 'el filtro funcionará con unos pocos cientos de ejemplos', v: 'si', por: 'Solo tiene que estimar una probabilidad por palabra y clase, así que necesita muchísimos menos datos que un modelo con parámetros.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Es razonable esperar esto de un clasificador de Bayes ingenuo? «' + d.c.t + '»'; },
    fields: [{ name: 'q', label: 'Respuesta', opts: [{ t: 'sí, es razonable', v: 'si' }, { t: 'no, promete de más', v: 'no' }] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate si lo que se pide depende solo del <em>orden</em> entre las dos clases, o si hace falta que el número esté bien o que el modelo vea relaciones entre palabras.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'si' ? 'sí' : 'no'; }
  });

  p.keys([
    'Bayes da la vuelta a la pregunta: lo que se puede contar es $P(\\text{palabras} \\mid \\text{clase})$, y lo que interesa es al revés.',
    'El denominador $P(t)$ es el mismo para las dos clases: no hace falta calcularlo para decidir.',
    'La suposición ingenua multiplica las palabras como si fueran independientes. Es falsa, y funciona porque solo se necesita el orden entre clases.',
    'Se suman logaritmos en vez de multiplicar, porque cien factores pequeños se redondean a cero.',
    'El suavizado de Laplace regala una aparición a cada palabra para que ninguna probabilidad sea cero y vete una clase entera.',
    'Da un orden fiable y una explicación —qué palabra pesó—, pero probabilidades mal calibradas: sirve para ordenar, no para apostar.'
  ]);
});
