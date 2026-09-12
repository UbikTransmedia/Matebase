/* Tema: Predecir el siguiente token */
Course.topic('ia-secuencias', function (p) {

  p.puente('Con [[ia-tokens|el texto ya troceado]], toca la pregunta que lo organiza todo: ¿qué viene ' +
    'después? De [[av-markov|las cadenas de Markov]] viene la forma de plantearla, de ' +
    '[[av-informacion|la entropía]] la forma de puntuar la respuesta, y de ' +
    '[[fn-exp-log|la exponencial]] la manera de leer esa puntuación en unidades que signifiquen algo.');

  p.text('Todo modelo de lenguaje, por grande que sea, hace una sola cosa: recibe un trozo de texto y ' +
    'devuelve <strong>una probabilidad para cada token posible</strong> como continuación. Escribir un ' +
    'texto largo es repetir eso, pegando cada token elegido al final y volviendo a preguntar. Lo demás ' +
    'son detalles de cómo se calculan esas probabilidades.');

  /* ---------------------------------------------------------------- */
  p.section('Contar: el modelo más simple que funciona');

  p.text('La forma más tonta de estimar esas probabilidades es contar. Se mira un texto grande, se apunta ' +
    'qué suele venir detrás de cada contexto, y se divide. Si detrás de «el gat» aparece 9 veces una ' +
    '«o» y una vez una «a», se estima $0{,}9$ y $0{,}1$.');

  p.formula('P(x_t \\mid x_{t-n}, \\ldots, x_{t-1}) = \\frac{\\text{veces que ese contexto va seguido de } x_t}{\\text{veces que aparece ese contexto}}',
    'un modelo de n-gramas',
    'Se lee: <em>«la probabilidad de equis sub te dado lo anterior»</em>. El número $n$ dice cuántos ' +
    'símbolos de contexto se miran.<br><br>Y fíjate en lo que es esto: si sólo importan los últimos $n$ ' +
    'símbolos y no toda la historia anterior, <strong>es exactamente ' +
    '[[av-markov|una cadena de Markov]]</strong>, donde el estado es «los últimos $n$ símbolos». La ' +
    'matriz de transición es enorme, pero es una matriz de transición.');

  p.demo({
    title: 'Escribir contando',
    intro: 'Un texto de ejemplo de 451 letras. Elige cuántas letras de contexto se miran y genera: con una, sale ruido con la estadística correcta; con tres o cuatro, empieza a parecer castellano. La semilla está fija, así que el mismo botón da siempre lo mismo.',
    predice: 'Al aumentar el contexto el texto se parecerá cada vez más al original. ¿Crees que eso significa que el modelo es cada vez mejor?',
    build: function (host) {
      var TEXTO = 'el gato duerme en el tejado y el perro duerme en la puerta. cuando llueve el gato entra en la casa y el perro entra en la caseta. ' +
        'por la manana el gato mira por la ventana y el perro mira por la puerta. el gato come pescado y el perro come carne. ' +
        'de noche el gato sale al tejado y el perro se queda en la puerta de la casa. llueve y el gato entra, llueve y el perro entra. ' +
        'el tejado, la ventana, la puerta y la casa son el mundo del gato y del perro. ';
      var orden = 2, generado = '';
      function modelo(texto, n) {
        var c = {}, ctx = {};
        for (var i = n; i < texto.length; i++) {
          var k = texto.slice(i - n, i), ch = texto[i];
          if (!c[k]) c[k] = {};
          c[k][ch] = (c[k][ch] || 0) + 1;
          ctx[k] = (ctx[k] || 0) + 1;
        }
        return { c: c, ctx: ctx, n: n };
      }
      function genera(n, cuantas) {
        var m = modelo(TEXTO, n), r = U.rng(4);
        var pos = 0, ctx = TEXTO.slice(pos, pos + n), salida = ctx;
        for (var i = 0; i < cuantas; i++) {
          var opciones = m.c[ctx];
          if (!opciones) { ctx = TEXTO.slice(0, n); opciones = m.c[ctx]; }
          var total = m.ctx[ctx], u = r.real(0, total, 6), acc = 0, elegido = ' ';
          var claves = Object.keys(opciones);
          for (var j = 0; j < claves.length; j++) {
            acc += opciones[claves[j]];
            if (u <= acc) { elegido = claves[j]; break; }
          }
          salida += elegido;
          ctx = (salida.slice(-n));
        }
        return salida;
      }
      var out = W.readout(host, '');
      var caja = U.el('div', { html: '' });
      caja.style.cssText = 'font-family:ui-monospace,monospace;font-size:0.8125rem;line-height:1.7;' +
        'background:var(--bg-alt);border:1px solid var(--line);border-radius:4px;padding:10px;margin:8px 0';
      host.appendChild(caja);
      function pinta() {
        generado = genera(orden, 180);
        caja.textContent = generado;
        var V = {}; for (var i = 0; i < TEXTO.length; i++) V[TEXTO[i]] = 1;
        var nv = Object.keys(V).length;
        out.set('Contexto de <strong>' + orden + '</strong> ' + U.plural(orden, 'letra', 'letras') +
          ' &nbsp;·&nbsp; el modelo tendría $' + nv + '^{' + (orden + 1) + '} = ' +
          U.miles(Math.pow(nv, orden + 1)) + '$ probabilidades que estimar, con 451 letras de texto.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (orden === 1 ? 'Con una sola letra de contexto sale una sopa de letras: tiene la estadística correcta y ningún sentido.'
            : (orden === 2 ? 'Ya salen sílabas y alguna palabra suelta. Este es, con este texto, el que mejor generaliza.'
              : (orden === 3 ? 'Se reconocen palabras enteras del texto original.'
                : 'Con tanto contexto casi no hay elección posible: está copiando trozos literales del original. Eso no es escribir, es recordar.'))) +
          '</span>');
      }
      W.chips(host, [1, 2, 3, 4].map(function (n) { return { label: n + (n === 1 ? ' letra' : ' letras'), value: String(n) }; }), {
        value: '2',
        on: function (v) { orden = parseInt(v, 10); pinta(); }
      });
      pinta();
    }
  });

  p.note('Cuanto más contexto, más se parece lo generado al original, y eso <strong>no</strong> quiere ' +
    'decir que el modelo sea mejor: quiere decir que está copiando. Con 4 letras de contexto y un ' +
    'alfabeto de 23, hay $23^5 = 6\\,436\\,343$ probabilidades que estimar a partir de 451 letras. Es ' +
    '[[ia-generalizar|el sobreajuste]] de siempre, y se mide igual: con datos que el modelo no ha visto.',
    'warn', 'Parecerse al original no es una virtud');

  /* ---------------------------------------------------------------- */
  p.section('Perplejidad: la entropía, exponenciada');

  p.text('Para puntuar un modelo se le da un texto que no ha visto y se mira qué probabilidad le asigna. ' +
    'Cuanto más alta, mejor ha predicho. Se promedia en logaritmos —que es ' +
    '[[av-informacion|la entropía cruzada]]— y después se deshace el logaritmo.');

  p.formulas([
    'H = -\\frac{1}{N}\\sum_{t=1}^{N} \\log_2 P(x_t \\mid \\text{contexto})',
    '\\text{perplejidad} = 2^{H}'
  ], 'la entropía cruzada y su exponencial');

  p.text('La perplejidad tiene una lectura muy concreta: es <strong>entre cuántas opciones está dudando ' +
    'el modelo, de media</strong>, como si en cada paso tirara un dado de tantas caras. Perplejidad 1 ' +
    'es certeza absoluta; perplejidad igual al tamaño del vocabulario es no tener ni idea.');

  p.demo({
    title: 'La curva de la perplejidad',
    intro: 'El mismo texto, partido en tres cuartos para entrenar y un cuarto para evaluar. Se mide la perplejidad de los dos trozos según cuánto contexto se mire. Las dos curvas hacen cosas distintas, y ahí está todo.',
    predice: 'La perplejidad sobre el texto de entrenamiento bajará al aumentar el contexto. ¿Crees que la del texto de evaluación hará lo mismo?',
    build: function (host) {
      var TEXTO = 'el gato duerme en el tejado y el perro duerme en la puerta. cuando llueve el gato entra en la casa y el perro entra en la caseta. ' +
        'por la manana el gato mira por la ventana y el perro mira por la puerta. el gato come pescado y el perro come carne. ' +
        'de noche el gato sale al tejado y el perro se queda en la puerta de la casa. llueve y el gato entra, llueve y el perro entra. ' +
        'el tejado, la ventana, la puerta y la casa son el mundo del gato y del perro. ';
      var corte = Math.floor(TEXTO.length * 0.75);
      var tren = TEXTO.slice(0, corte), prueba = TEXTO.slice(corte);
      var V = {}; for (var i = 0; i < TEXTO.length; i++) V[TEXTO[i]] = 1;
      var nv = Object.keys(V).length;
      function modelo(texto, n) {
        var c = {}, ctx = {};
        for (var j = n; j < texto.length; j++) {
          var k = texto.slice(j - n, j), ch = texto[j];
          if (!c[k]) c[k] = {};
          c[k][ch] = (c[k][ch] || 0) + 1;
          ctx[k] = (ctx[k] || 0) + 1;
        }
        return { c: c, ctx: ctx, n: n };
      }
      /* Suavizado: sin sumar ese alfa, un solo caso nunca visto daria
         probabilidad cero y la perplejidad se iria a infinito. */
      function ppl(m, texto, alfa) {
        var s = 0, cu = 0;
        for (var j = m.n; j < texto.length; j++) {
          var k = texto.slice(j - m.n, j), ch = texto[j];
          var num = ((m.c[k] && m.c[k][ch]) || 0) + alfa;
          var den = (m.ctx[k] || 0) + alfa * nv;
          s += Math.log(num / den); cu++;
        }
        return Math.exp(-s / cu);
      }
      var datos = [];
      for (var n = 1; n <= 5; n++) {
        var m = modelo(tren, n);
        datos.push({ n: n, tren: ppl(m, tren, 0.1), prueba: ppl(m, prueba, 0.1) });
      }
      var mejor = datos[0], k;
      for (k = 1; k < datos.length; k++) if (datos[k].prueba < mejor.prueba) mejor = datos[k];
      var sel = 2;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0.6, xmax: 5.4, ymin: 0, ymax: 9.5, height: 260,
        xlabel: 'letras de contexto', ylabel: 'perplejidad', xstep: 1,
        aria: 'Perplejidad de entrenamiento y de evaluación según el contexto: una baja siempre y la otra sube a partir del segundo orden',
        draw: function (g) {
          g.poly(datos.map(function (d) { return [d.n, d.tren]; }), { color: 0, w: 2.4 });
          g.poly(datos.map(function (d) { return [d.n, d.prueba]; }), { color: 2, w: 2.4 });
          datos.forEach(function (d) {
            g.point(d.n, d.tren, { color: 0, r: 3 });
            g.point(d.n, d.prueba, { color: 2, r: 3 });
          });
          g.vline(sel, { color: 'axis', w: 1.2, dash: [4, 3] });
          g.point(mejor.n, mejor.prueba, { color: 3, r: 6 });
        }
      });
      W.legend(host, [{ c: 0, t: 'entrenamiento' }, { c: 2, t: 'evaluación' }]);
      function pinta() {
        var d = datos[sel - 1];
        out.set('Con <strong>' + sel + '</strong> ' + U.plural(sel, 'letra', 'letras') + ' de contexto: ' +
          'perplejidad <strong>' + U.fmt(d.tren, 2) + '</strong> en entrenamiento y ' +
          '<strong>' + U.fmt(d.prueba, 2) + '</strong> en evaluación.<br>' +
          'Parámetros por estimar: $' + nv + '^{' + (sel + 1) + '} = ' + U.miles(Math.pow(nv, sel + 1)) +
          '$, con 451 letras disponibles.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (sel === mejor.n ? 'Este es el mínimo de la curva de evaluación: el mejor compromiso con este texto.'
            : (sel < mejor.n ? 'Mira demasiado poco contexto: las dos perplejidades son altas.'
              : 'Aquí la de entrenamiento ya casi no baja y la de evaluación sube: está memorizando en vez de aprender.')) +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'letras de contexto', min: 1, max: 5, step: 1, value: 2, dec: 0, on: function (v) { sel = v; pinta(); } });
      pinta();
    }
  });

  p.note('Con este texto el mínimo está en <strong>2 letras de contexto</strong>, con perplejidad ' +
    '<strong>4,65</strong> sobre el trozo no visto. A partir de ahí la de entrenamiento se queda ' +
    'plana alrededor de 2,3 y la de evaluación sube hasta 8,19 con 5 letras. Es la misma curva en U de ' +
    '[[ia-generalizar|el tema de generalizar]], y por el mismo motivo: hay muchísimos más parámetros ' +
    'que datos. Con un corpus grande el mínimo se desplaza a contextos más largos, que es justamente ' +
    'lo que permite que los modelos actuales miren miles de tokens hacia atrás.',
    'ok', 'Dónde está el mínimo, y por qué se mueve');

  /* ---------------------------------------------------------------- */
  p.section('La temperatura');

  p.text('El modelo entrega una lista de números sin normalizar, los <em>logits</em>, y para convertirlos ' +
    'en probabilidades se usa el softmax. Entre medias cabe una manipulación de una sola letra que ' +
    'cambia por completo el carácter de lo que escribe: <strong>dividir por una temperatura</strong>.');

  p.formula('P_i = \\frac{e^{z_i / \\tau}}{\\sum_j e^{z_j / \\tau}}',
    'softmax con temperatura',
    'Con $\\tau = 1$ es el softmax de siempre. Con $\\tau$ pequeño, las diferencias entre logits se ' +
    'agrandan y la mayor se lo lleva casi todo: el modelo se vuelve <strong>previsible y repetitivo</strong>. ' +
    'Con $\\tau$ grande, las diferencias se aplanan y todo tiende a ser igual de probable: el modelo se ' +
    'vuelve <strong>disparatado</strong>.<br><br>En el límite $\\tau \\to 0$ queda escoger siempre el ' +
    'máximo, y en el límite $\\tau \\to \\infty$, elegir al azar entre todos por igual.');

  p.demo({
    title: 'Subir y bajar la temperatura',
    intro: 'Cinco tokens candidatos con sus logits. Mueve la temperatura y mira cómo se reparte la probabilidad, y cómo cambia la entropía de ese reparto.',
    predice: 'Con temperatura muy baja el modelo elige siempre lo mismo. ¿Cuánto valdrá entonces la entropía del reparto?',
    build: function (host) {
      var lg = [3.2, 1.8, 1.1, 0.4, -0.6];
      var nombres = ['casa', 'puerta', 'perro', 'tejado', 'zapato'];
      var tau = 1;
      function probs(t) {
        var m = Math.max.apply(null, lg);
        var e = lg.map(function (z) { return Math.exp((z - m) / t); });
        var s = e.reduce(function (a, b) { return a + b; }, 0);
        return e.map(function (x) { return x / s; });
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 4.6, ymin: 0, ymax: 1.05, height: 230,
        ylabel: 'probabilidad', xstep: 1,
        xtickLabel: function (v) { return nombres[v] || ''; },
        aria: 'Barras con la probabilidad de cada token candidato según la temperatura',
        draw: function (g) {
          var p2 = probs(tau);
          g.bars(p2.map(function (q, i) { return { x: i, h: q }; }), { color: 2, width: 0.55 });
        }
      });
      function pinta() {
        var p2 = probs(tau), H = 0;
        p2.forEach(function (q) { if (q > 1e-12) H -= q * Math.log(q) / Math.LN2; });
        out.set('Temperatura $\\tau = ' + U.fmt(tau, 2) + '$ &nbsp;·&nbsp; ' +
          'la más probable se lleva <strong>' + U.fmt(100 * Math.max.apply(null, p2), 1) + ' %</strong><br>' +
          'Entropía del reparto: <strong>' + U.fmt(H, 3) + '</strong> bits, o sea una perplejidad de ' +
          U.fmt(Math.pow(2, H), 2) + ' sobre cinco opciones.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (tau < 0.4 ? 'Casi cero: elige siempre el mismo token. Un texto generado así se repite en bucle enseguida.'
            : (tau > 2.2 ? 'Se acerca al reparto uniforme, cuya entropía sería $\\log_2 5 = 2{,}322$ bits: a esta temperatura el modelo dice cualquier cosa.'
              : 'Zona razonable: la opción buena manda, pero las demás conservan opciones de salir, y por eso el texto no se repite.')) +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'temperatura τ', min: 0.1, max: 3, step: 0.05, value: 1, dec: 2, on: function (v) { tau = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'De la entropía a la perplejidad y vuelta',
    enunciado: 'Un modelo evalúa un texto y obtiene una entropía cruzada de $2{,}5$ bits por token. Calcular su perplejidad, decir qué significa, y compararla con un modelo que acierta siempre y con otro que no sabe nada, sobre un vocabulario de 50 000 tokens.',
    pasos: [
      { t: '<strong>La perplejidad.</strong> $2^{2{,}5} = 5{,}66$. De media, el modelo duda como si eligiera entre unas 5,66 opciones.', antes: 'La perplejidad es 2 elevado a la entropía cruzada en bits.' },
      { t: '<strong>El modelo perfecto.</strong> Si acierta siempre con probabilidad 1, entonces $\\log_2 1 = 0$ y la entropía es 0, así que la perplejidad es $2^0 = 1$: no duda entre nada.', antes: '¿Cuánto vale $\\log_2 1$?' },
      { t: '<strong>El que no sabe nada.</strong> Reparte por igual entre los 50 000: cada uno con probabilidad $1/50\\,000$, y la entropía es $\\log_2 50\\,000 = 15{,}6$ bits. Perplejidad $2^{15{,}6} = 50\\,000$, el vocabulario entero.', antes: 'Con un reparto uniforme entre $V$ opciones, ¿cuánto vale la entropía?' },
      { t: '<strong>Situar el modelo.</strong> Con perplejidad 5,66 sobre un recorrido que va de 1 a 50 000, el modelo ha reducido la incertidumbre enormemente: de dudar entre cincuenta mil a dudar entre menos de seis.' },
      { t: '<strong>Por qué se usa la perplejidad y no la entropía.</strong> Son la misma información, pero «5,66 opciones» se entiende y «2,5 bits» no tanto. La exponencial sólo deshace el logaritmo para poder hablar en opciones en vez de en bits.' }
    ],
    cierre: 'Por eso la perplejidad siempre está entre 1 y el tamaño del vocabulario: son los dos extremos de saberlo todo y no saber nada.'
  });

  p.comprueba('Un modelo de n-gramas con contexto muy largo reproduce el texto de entrenamiento casi palabra por palabra. ¿Qué está pasando?', [
    { t: 'Está memorizando: con tanto contexto casi cada situación aparece una sola vez y no hay nada que promediar', ok: true, por: 'Es sobreajuste puro. Con contexto largo el número de contextos posibles crece exponencialmente, así que casi todos se han visto una única vez y el modelo se limita a devolver lo que venía después aquella vez. Sobre texto nuevo lo hace mucho peor.' },
    { t: 'Está funcionando muy bien: reproducir el texto es la señal de un buen modelo', ok: false, por: 'Reproducir el entrenamiento no es la meta. La meta es asignar alta probabilidad a texto que no se ha visto, y eso se mide con la perplejidad sobre un trozo reservado.' },
    { t: 'Le falta suavizado', ok: false, por: 'El suavizado evita las probabilidades cero, que es otro problema. No arregla que haya muchísimos más parámetros que datos.' }
  ]);

  p.util('La temperatura es el mando que asoma en casi todas las herramientas que usan modelos de ' +
    'lenguaje, y ahora sabes qué hace exactamente: divide los logits antes del softmax. Para tareas ' +
    'donde hay una respuesta correcta —extraer un dato, clasificar, programar— interesa baja, porque ' +
    'no se quiere azar. Para escribir algo variado interesa más alta. Y conviene saber que subirla no ' +
    'añade ninguna creatividad: sólo hace más probables las opciones que el modelo consideraba peores.');

  p.hist('En 1951 <strong>Claude Shannon</strong> publicó un experimento precioso para medir la entropía ' +
    'del inglés: le daba a una persona un texto cortado y le pedía adivinar la siguiente letra, ' +
    'anotando cuántos intentos necesitaba. De esas cuentas dedujo que cada letra del inglés lleva ' +
    'aproximadamente un bit de información, mucho menos que los 4,7 bits que harían falta si las ' +
    'veintiséis letras fueran igual de probables. Aquel artículo, <em>Prediction and Entropy of ' +
    'Printed English</em>, es el antepasado directo de la perplejidad: medir un modelo de lenguaje es ' +
    'exactamente repetir el experimento de Shannon con una máquina en lugar de una persona.');

  p.trampas([
    { e: 'Comparar perplejidades de vocabularios distintos', por: 'La perplejidad depende de en qué se trocea el texto. Dos modelos con tokenizadores distintos no se pueden comparar por su perplejidad, aunque el número salga del mismo modo.' },
    { e: 'Medir la perplejidad sobre el texto de entrenamiento', por: 'Baja siempre al aumentar el contexto, así que no dice nada. Hay que reservar un trozo que el modelo no haya visto.' },
    { e: 'Olvidar el suavizado', por: 'Un solo token jamás visto en su contexto da probabilidad cero, su logaritmo es menos infinito y la perplejidad se va a infinito entera.' },
    { e: 'Creer que la temperatura alta da creatividad', por: 'Sólo aplana el reparto: hace más probables las opciones que el modelo puntuaba peor. Lo que se gana en variedad se pierde en acierto.' },
    { e: 'Pensar que perplejidad baja es siempre mejor modelo', por: 'Un modelo que memoriza el texto de evaluación tendría perplejidad casi 1 y sería inútil. Sólo vale si el texto es de verdad nuevo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'De entropía a perplejidad',
    level: 'basico',
    gen: function (r) {
      var H = r.pick([1, 2, 2.5, 3, 4, 5]);
      return { H: H, ppl: Math.pow(2, H) };
    },
    ask: function (d) {
      return 'Un modelo obtiene una entropía cruzada de $' + U.fmt(d.H, 1) + '$ bits por token. ' +
        '¿Cuál es su perplejidad? (dos decimales)';
    },
    fields: [{ name: 'p', label: 'perplejidad', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.ppl, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { var base10 = Math.pow(10, d.H); return Math.abs(base10 - d.ppl) > 0.005 && Math.abs(v.p - base10) < 0.005; }, msg: 'La entropía está en bits, así que la base es 2, no 10.' }],
    hint: function () { return 'Perplejidad $= 2^H$, con $H$ en bits.'; },
    steps: function (d) {
      return ['$2^{' + U.fmt(d.H, 1) + '} = ' + U.fmt(d.ppl, 2) + '$',
        'O sea que de media duda como si eligiera entre ' + U.fmt(d.ppl, 2) + ' opciones.'];
    },
    answer: function (d) { return U.fmt(d.ppl, 2); }
  });

  p.exercise({
    title: 'Contar para predecir',
    level: 'basico',
    gen: function (r) {
      var a = r.int(3, 12), b = r.int(1, 6), c = r.int(1, 4);
      return { a: a, b: b, c: c, tot: a + b + c, p: a / (a + b + c) };
    },
    ask: function (d) {
      return 'Detrás del contexto «el gat» se ha visto ' + d.a + ' veces una «o», ' + d.b + ' veces una ' +
        '«a» y ' + d.c + ' veces un espacio. ¿Qué probabilidad estima el modelo para la «o»? (cuatro decimales)';
    },
    fields: [{ name: 'p', label: 'P(o)', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.p, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var malDen = d.a / (d.b + d.c); return Math.abs(malDen - d.p) > 0.00005 && Math.abs(v.p - malDen) < 0.00005; }, msg: 'En el denominador va el total de veces que aparece el contexto, incluyendo las de la propia «o».' }],
    hint: function (d) { return 'El contexto aparece $' + d.a + ' + ' + d.b + ' + ' + d.c + '$ veces en total.'; },
    steps: function (d) {
      return ['Total del contexto: $' + d.a + ' + ' + d.b + ' + ' + d.c + ' = ' + d.tot + '$.',
        '$P(\\text{o}) = ' + d.a + '/' + d.tot + ' = ' + U.fmt(d.p, 4) + '$.',
        'Las tres probabilidades suman 1, como debe ser.'];
    },
    answer: function (d) { return U.fmt(d.p, 4); }
  });

  p.exercise({
    title: 'Cuántos parámetros tiene un n-grama',
    level: 'medio',
    gen: function (r) {
      var V = r.pick([23, 27, 30]), n = r.int(1, 4);
      return { V: V, n: n, par: Math.pow(V, n + 1) };
    },
    ask: function (d) {
      return 'Un modelo de n-gramas sobre un alfabeto de $' + d.V + '$ símbolos mira $' + d.n + '$ ' +
        U.plural(d.n, 'símbolo', 'símbolos') + ' de contexto. ¿Cuántas probabilidades tendría que ' +
        'estimar como máximo?';
    },
    fields: [{ name: 'p', label: 'probabilidades', w: 'small' }],
    sol: function (d) { return { p: d.par }; },
    dec: 0,
    errores: [{ si: function (v, d) { var soloCtx = Math.pow(d.V, d.n); return Math.abs(soloCtx - d.par) > 0.5 && Math.abs(v.p - soloCtx) < 0.5; }, msg: 'Eso es el número de contextos posibles. Cada contexto necesita además una probabilidad por cada símbolo del alfabeto, así que hay que multiplicar otra vez por el tamaño del alfabeto.' }],
    hint: function (d) { return 'Hay $' + d.V + '^{' + d.n + '}$ contextos posibles, y cada uno necesita una probabilidad por cada uno de los $' + d.V + '$ símbolos.'; },
    steps: function (d) {
      return ['Contextos posibles: $' + d.V + '^{' + d.n + '} = ' + U.miles(Math.pow(d.V, d.n)) + '$.',
        'Cada contexto necesita $' + d.V + '$ probabilidades: $' + d.V + '^{' + d.n + '} \\times ' + d.V + ' = ' + d.V + '^{' + (d.n + 1) + '} = ' + U.miles(d.par) + '$.',
        'Crece exponencialmente con el contexto, y por eso el modelo se queda sin datos enseguida.'];
    },
    answer: function (d) { return U.miles(d.par); }
  });

  p.exercise({
    title: 'El efecto de la temperatura',
    level: 'medio',
    gen: function (r) {
      var z = [r.real(2, 3, 1), r.real(0.5, 1.5, 1)];
      var tau = r.pick([0.5, 1, 2]);
      var e0 = Math.exp(z[0] / tau), e1 = Math.exp(z[1] / tau);
      return { z: z, tau: tau, p: e0 / (e0 + e1) };
    },
    ask: function (d) {
      return 'Dos tokens con logits $' + U.fmt(d.z[0], 1) + '$ y $' + U.fmt(d.z[1], 1) + '$, con ' +
        'temperatura $\\tau = ' + U.fmt(d.tau, 1) + '$. ¿Qué probabilidad se lleva el primero? (cuatro decimales)';
    },
    fields: [{ name: 'p', label: 'P(primero)', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.p, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var sinTau = Math.exp(d.z[0]) / (Math.exp(d.z[0]) + Math.exp(d.z[1])); return Math.abs(sinTau - d.p) > 0.00005 && Math.abs(v.p - sinTau) < 0.00005; }, msg: 'Has olvidado dividir los logits por la temperatura antes de exponenciar.' }],
    hint: function (d) { return 'Divide cada logit por $' + U.fmt(d.tau, 1) + '$, exponencia, y normaliza.'; },
    steps: function (d) {
      return ['$z_1/\\tau = ' + U.fmt(d.z[0] / d.tau, 3) + '$ y $z_2/\\tau = ' + U.fmt(d.z[1] / d.tau, 3) + '$.',
        '$e^{' + U.fmt(d.z[0] / d.tau, 3) + '} = ' + U.fmt(Math.exp(d.z[0] / d.tau), 3) + '$, $e^{' + U.fmt(d.z[1] / d.tau, 3) + '} = ' + U.fmt(Math.exp(d.z[1] / d.tau), 3) + '$.',
        '$P = ' + U.fmt(d.p, 4) + '$.',
        d.tau < 1 ? 'Con temperatura baja la diferencia se agranda y el primero se lo lleva casi todo.'
          : (d.tau > 1 ? 'Con temperatura alta la diferencia se aplana y el segundo gana opciones.'
            : 'Con $\\tau = 1$ es el softmax de siempre.')];
    },
    answer: function (d) { return U.fmt(d.p, 4); }
  });

  p.exercise({
    title: 'Interpretar una perplejidad',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'la perplejidad sobre el texto de evaluación sube mientras la de entrenamiento baja', v: 'sobreajuste', por: 'Es la firma del sobreajuste: el modelo memoriza lo que ha visto y empeora en lo que no. Hay que mirar menos contexto o conseguir más datos.' },
        { t: 'la perplejidad vale exactamente el tamaño del vocabulario', v: 'nada', por: 'Es lo que da un modelo que reparte por igual entre todos los tokens: no ha aprendido absolutamente nada del texto.' },
        { t: 'la perplejidad sale infinita', v: 'cero', por: 'Algún token recibió probabilidad exactamente cero, y su logaritmo es menos infinito. Es lo que arregla el suavizado.' },
        { t: 'la perplejidad vale 1,02 sobre el texto de evaluación', v: 'visto', por: 'Es sospechosamente perfecta: casi seguro que ese texto estaba también en el entrenamiento. Un modelo honesto no predice texto nuevo con esa certeza.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Al evaluar un modelo de lenguaje se observa que ' + d.c.t + '. ¿Qué se deduce?'; },
    fields: [{ name: 'q', label: 'Diagnóstico', opts: [
      { t: 'sobreajuste: memoriza en vez de generalizar', v: 'sobreajuste' },
      { t: 'el modelo no ha aprendido nada', v: 'nada' },
      { t: 'hay alguna probabilidad cero: falta suavizado', v: 'cero' },
      { t: 'el texto de evaluación estaba en el entrenamiento', v: 'visto' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Recuerda el recorrido: la perplejidad va de 1 (certeza total) al tamaño del vocabulario (no saber nada), y se dispara a infinito si alguna probabilidad es cero.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un modelo de lenguaje sólo hace una cosa: dar una probabilidad a cada token posible como continuación.',
    'Un modelo de n-gramas es <strong>una cadena de Markov</strong> cuyo estado son los últimos $n$ símbolos, y se estima contando.',
    'Los parámetros crecen como $V^{n+1}$: con poco contexto ya hay más parámetros que datos, y por eso aparece el sobreajuste.',
    'La perplejidad es $2^H$: entre cuántas opciones duda el modelo de media. Va de 1 a $V$, y sólo dice algo sobre texto no visto.',
    'La temperatura divide los logits antes del softmax: baja lo vuelve repetitivo, alta lo vuelve disparatado.',
    'Shannon midió en 1951 la entropía del inglés pidiendo a personas que adivinaran la letra siguiente: medir un modelo es repetir ese experimento con una máquina.'
  ]);
});
