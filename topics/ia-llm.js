/* Tema: Un LLM, de principio a fin */
Course.topic('ia-llm', function (p) {

  p.puente('Ya están todas las piezas: [[ia-tokens|trocear el texto]], ' +
    '[[ia-secuencias|predecir el siguiente trozo]], [[ia-vectores-palabras|representar palabras como ' +
    'vectores]] y [[ia-atencion|la atención]]. Este tema las junta en una sola cosa que se entrena ' +
    'aquí mismo, y después mira con honestidad qué cambia cuando eso se multiplica por mil millones. ' +
    'De [[al-radicales-log|los logaritmos]] viene la forma de leer esas gráficas.');

  p.text('Un modelo de lenguaje grande no tiene ninguna pieza que no hayas visto ya. Es un ' +
    '[[ia-atencion|transformador]] apilado muchas veces, entrenado con ' +
    '[[av-informacion|entropía cruzada]] para predecir el siguiente token. Todo lo demás —lo que ' +
    'parece magia— sale de repetir eso con muchísimos más números y muchísimo más texto.');

  /* ---------------------------------------------------------------- */
  p.section('Preentrenar: una sola tarea, repetida');

  p.text('El entrenamiento base tiene un objetivo de una línea: <strong>dado un trozo de texto, acertar ' +
    'el siguiente token</strong>. Se toma texto de verdad, se corta por cualquier sitio, y se le pide ' +
    'al modelo la probabilidad de lo que venía después. La pérdida es la entropía cruzada de siempre.');

  p.formula('L = -\\frac{1}{N}\\sum_{t=1}^{N} \\log P_\\theta(x_t \\mid x_1, \\ldots, x_{t-1})',
    'la pérdida del preentrenamiento',
    'Es exactamente [[ia-secuencias|la misma fórmula]] que puntuaba a un modelo de n-gramas, con dos ' +
    'diferencias: el contexto no son los últimos $n$ símbolos sino todo lo anterior hasta el límite de ' +
    'la ventana, y la probabilidad no sale de contar sino de una red.<br><br>Lo notable es que ' +
    '<strong>la etiqueta es el propio texto</strong>. No hace falta que nadie anote nada: cualquier ' +
    'texto sirve como ejemplo de sí mismo, y por eso se pudo entrenar con cantidades de datos que ' +
    'ninguna tarea etiquetada a mano habría permitido.');

  p.demo({
    title: 'Un transformador de verdad, entrenado aquí',
    intro: 'Un transformador diminuto —una capa de atención causal, una red densa, normalización y conexiones residuales— sobre un texto de 373 letras. Entrénalo y pídele que escriba. Es el mismo motor que has usado en todo el bloque.',
    predice: 'Con unos cuatro mil números que ajustar y menos de mil letras de texto, ¿qué esperas que escriba: castellano correcto, palabras sueltas reconocibles, o ruido?',
    build: function (host) {
      var TXT = 'el gato duerme en el tejado y el perro duerme en la puerta. cuando llueve el gato entra en la casa y el perro entra en la caseta. ' +
        'por la manana el gato mira por la ventana y el perro mira por la puerta. el gato come pescado y el perro come carne. ' +
        'de noche el gato sale al tejado y el perro se queda en la puerta de la casa. llueve y el gato entra, llueve y el perro entra. ';
      var n = 16, d = 16, tau = 0.7;
      var chars = {}, i;
      for (i = 0; i < TXT.length; i++) chars[TXT[i]] = 1;
      var voc = Object.keys(chars).sort(), idx = {};
      voc.forEach(function (c, k) { idx[c] = k; });
      var V = voc.length;
      var pe = new Float32Array(n * d);
      for (var pos = 0; pos < n; pos++) {
        for (var j = 0; j < d; j++) {
          var i2 = Math.floor(j / 2), w = 1 / Math.pow(10000, 2 * i2 / d);
          pe[pos * d + j] = (j % 2 === 0) ? Math.sin(pos * w) : Math.cos(pos * w);
        }
      }
      var PE = NN.t([n, d], pe);
      var P, lista, opt, r, pasos, perdida, texto, nPar;
      function reinicia() {
        r = U.rng(1);
        P = { Emb: NN.param([V, d], r, 0.3),
          Wq: NN.param([d, d], r), Wk: NN.param([d, d], r), Wv: NN.param([d, d], r), Wo: NN.param([d, d], r),
          g1: NN.constante([1, d], 1), b1: NN.constante([1, d], 0),
          g2: NN.constante([1, d], 1), b2: NN.constante([1, d], 0),
          W1: NN.param([d, 4 * d], r), c1: NN.param([1, 4 * d], r, 0.01),
          W2: NN.param([4 * d, d], r), c2: NN.param([1, d], r, 0.01),
          Wo2: NN.param([d, V], r), co: NN.param([1, V], r, 0.01) };
        lista = [P.Emb, P.Wq, P.Wk, P.Wv, P.Wo, P.W1, P.c1, P.W2, P.c2, P.Wo2, P.co];
        nPar = 0;
        lista.forEach(function (q) { nPar += q.n; });
        opt = NN.Adam(lista, { lr: 0.014 });
        pasos = 0; perdida = 0; texto = '';
      }
      function fw(ids) {
        var x = NN.suma(NN.embedding(P.Emb, ids), PE);
        var h = NN.normaliza(x, P.g1, P.b1);
        var a = NN.atencion(NN.mm(h, P.Wq), NN.mm(h, P.Wk), NN.mm(h, P.Wv), true);
        x = NN.suma(x, NN.mm(a, P.Wo));
        var h2 = NN.normaliza(x, P.g2, P.b2);
        x = NN.suma(x, NN.suma(NN.mm(NN.relu(NN.suma(NN.mm(h2, P.W1), P.c1)), P.W2), P.c2));
        return NN.suma(NN.mm(x, P.Wo2), P.co);
      }
      reinicia();
      function paso() {
        var ini = Math.floor(r.real(0, TXT.length - n - 1.001, 6));
        var ids = [], obj = [], k;
        for (k = 0; k < n; k++) { ids.push(idx[TXT[ini + k]]); obj.push(idx[TXT[ini + k + 1]]); }
        NN.limpia();
        var L = NN.entropiaCruzada(fw(ids), obj);
        NN.atras(L, lista); opt.paso();
        perdida = L.v[0]; pasos++;
      }
      /* El muestreo lleva su propio azar con semilla fija: asi el texto que
         sale depende solo de cuanto se haya entrenado, y no de cuantas veces
         se haya repintado la pantalla. */
      function escribe() {
        var g = U.rng(77), ctx = 'el gato '.split(''), out = 'el gato ', k, j2;
        for (k = 0; k < 110; k++) {
          var ids2 = [];
          for (var q = Math.max(0, ctx.length - n); q < ctx.length; q++) ids2.push(idx[ctx[q]] !== undefined ? idx[ctx[q]] : 0);
          NN.limpia();
          var lg = fw(ids2), f = ids2.length - 1, mx = -1e9;
          for (j2 = 0; j2 < V; j2++) if (lg.v[f * V + j2] > mx) mx = lg.v[f * V + j2];
          var e = [], su = 0;
          for (j2 = 0; j2 < V; j2++) { var z = Math.exp((lg.v[f * V + j2] - mx) / tau); e.push(z); su += z; }
          var u = g.real(0, su, 6), acc = 0, el = 0;
          for (j2 = 0; j2 < V; j2++) { acc += e[j2]; if (u <= acc) { el = j2; break; } }
          out += voc[el]; ctx.push(voc[el]);
        }
        texto = out;
      }
      var out2 = W.readout(host, '');
      var caja = U.el('div');
      caja.style.cssText = 'font-family:ui-monospace,monospace;font-size:0.8125rem;line-height:1.7;' +
        'background:var(--bg-alt);border:1px solid var(--line);border-radius:4px;padding:10px;margin:8px 0;min-height:3.4em';
      host.appendChild(caja);
      var hist = [];
      var plot = W.plot(host, {
        xmin: 0, xmax: 2500, ymin: 0, ymax: 3.6, height: 170,
        xlabel: 'pasos', ylabel: 'pérdida', aria: 'Curva de la pérdida del transformador durante el entrenamiento',
        draw: function (g) { if (hist.length > 1) g.poly(hist, { color: 2, w: 2 }); }
      });
      function pinta() {
        if (pasos > 0 && (pasos % 20 === 0 || hist.length === 0)) hist.push([pasos, perdida]);
        /* El texto generado es del modelo y no se traduce; el aviso de que
           todavía no hay nada, sí: lo lee una persona, y por eso pasa por
           MathX.inline, que es la puerta del diccionario. */
        if (texto) caja.textContent = texto;
        else caja.innerHTML = MathX.inline('(todavía no ha escrito nada: entrena y pulsa «Escribir»)');
        out2.set('Paso <strong>' + U.miles(pasos) + '</strong> &nbsp;·&nbsp; pérdida <strong>' + U.fmt(perdida, 4) + '</strong> ' +
          (pasos ? '&nbsp;·&nbsp; perplejidad ' + U.fmt(Math.exp(perdida), 2) : '') + '<br>' +
          'El modelo tiene <strong>' + U.miles(nPar) + '</strong> números que ajustar, para un texto de ' +
          U.miles(TXT.length) + ' letras y un vocabulario de ' + V + ' símbolos.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (pasos === 0 ? 'Sin entrenar, la pérdida de partida ronda $\\ln ' + V + ' = ' + U.fmt(Math.log(V), 2) + '$, que es lo que da repartir por igual entre los ' + V + ' símbolos.'
            : (pasos < 400 ? 'Va aprendiendo qué letras son frecuentes y cuáles no aparecen nunca.'
              : 'Con unos 2500 pasos la pérdida baja hasta cerca de 0,90, o sea una perplejidad de 2,5: duda entre dos o tres símbolos en cada paso.')) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 8, paso: paso, pinta: pinta, hasta: 2500 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Escribir', on: function () { escribe(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); hist = []; reinicia(); pinta(); } }
      ]);
      W.chips(host, [{ label: 'τ = 0,05', value: '0.05' }, { label: 'τ = 0,7', value: '0.7' }, { label: 'τ = 1,2', value: '1.2' }], {
        value: '0.7', on: function (v) { tau = parseFloat(v); if (pasos) { escribe(); } pinta(); }
      });
      pinta();
    }
  });

  p.note('Con 2500 pasos la pérdida baja de $3{,}1$ a unos <strong>0,90</strong>, y lo que escribe son ' +
    'trozos reconocibles —«mira», «perro», «casa», «puerta»— dentro de algo que no es castellano. Es ' +
    'exactamente lo que cabe esperar de cuatro mil números y menos de cuatrocientas letras, y conviene verlo: la ' +
    'arquitectura es la misma que la de los modelos grandes, y aun así esto balbucea. ' +
    '<strong>Lo que separa una cosa de la otra no es una idea, es una diferencia de escala de muchos ' +
    'órdenes de magnitud.</strong>', 'ok', 'Qué se puede esperar de un modelo de juguete');

  p.note('Prueba las tres temperaturas después de entrenar. Con $\\tau = 0{,}05$ el modelo se atasca ' +
    'repitiendo «perro perro perro», porque elegir siempre el máximo lleva a bucles; con ' +
    '$\\tau = 1{,}2$ sale ruido. Es [[ia-secuencias|lo que ya viste]] con los n-gramas, ahora sobre ' +
    'una red.', 'ok', 'La temperatura, otra vez');

  /* ---------------------------------------------------------------- */
  p.section('La ventana de contexto');

  p.text('El modelo no ve todo el texto del mundo a la vez: ve una <strong>ventana</strong> de tantos ' +
    'tokens. Lo que queda fuera, sencillamente no existe para él en ese momento. Y ampliar la ventana ' +
    'no es gratis, por lo que ya sabes de [[ia-atencion|la atención]]: cada token se compara con todos ' +
    'los demás, así que <strong>el coste crece con el cuadrado</strong> de la longitud.');

  p.table(['Si la ventana se multiplica por', 'El trabajo de la atención se multiplica por'],
    [['2', '4'], ['4', '16'], ['10', '100'], ['100', '10 000']]);

  p.text('De ahí que las ventanas largas se anuncien como un logro: no es que nadie supiera escribir el ' +
    'código, es que el coste se dispara. Casi todas las técnicas que permiten contextos enormes ' +
    'consisten en <em>no</em> calcular la matriz entera de atención.');

  /* ---------------------------------------------------------------- */
  p.section('Leyes de escala, y cómo se leen');

  p.text('Al entrenar modelos de tamaños muy distintos se observó algo regular: la pérdida baja siguiendo ' +
    'aproximadamente una <strong>ley de potencias</strong> respecto del número de parámetros, de la ' +
    'cantidad de texto y del cómputo empleado. Lo interesante para nosotros es qué forma tiene eso, ' +
    'porque es pura matemática de [[al-radicales-log|logaritmos]].');

  p.formula('L = c\\, N^{-\\alpha} \\quad \\Longleftrightarrow \\quad \\log L = \\log c - \\alpha \\log N',
    'una ley de potencias es una recta en ejes logarítmicos',
    'Tomando logaritmos a los dos lados, una potencia se convierte en una <strong>recta</strong>: la ' +
    'pendiente es $-\\alpha$ y la ordenada en el origen es $\\log c$.<br><br>Por eso estas gráficas se ' +
    'dibujan siempre con los dos ejes logarítmicos: si los puntos caen en línea recta, hay ley de ' +
    'potencias, y <strong>la pendiente mide el exponente</strong>. Es el mismo truco que se usa para ' +
    'detectar leyes de potencias en cualquier otro sitio.');

  p.demo({
    title: 'Leer un exponente en una recta',
    intro: 'La misma ley de potencias, dibujada en ejes normales y en ejes logarítmicos. Cambia el exponente y mira qué le pasa a la pendiente de la recta de la derecha.',
    predice: 'En ejes logarítmicos, una ley de potencias sale recta. Si duplicas el exponente, ¿qué le pasará a esa recta?',
    build: function (host) {
      var alfa = 0.3, c = 4;
      var out = W.readout(host, '');
      var fila = W.row(host);
      var normal = W.plot(fila, {
        xmin: 0, xmax: 11000, ymin: 0, ymax: 4.2, height: 230,
        xlabel: 'parámetros', ylabel: 'pérdida', aria: 'La ley de potencias en ejes normales: una curva que decae',
        draw: function (g) {
          g.fn(function (x) { return x < 10 ? 4.2 : c * Math.pow(x, -alfa); }, { color: 2, w: 2.4 });
        }
      });
      var logo = W.plot(fila, {
        xmin: 1, xmax: 4, ymin: -0.8, ymax: 0.8, height: 230,
        xlabel: 'log₁₀ parámetros', ylabel: 'log₁₀ pérdida',
        aria: 'La misma ley en ejes logarítmicos: una recta cuya pendiente es el exponente cambiado de signo',
        draw: function (g) {
          g.fn(function (x) { return Math.log(c) / Math.LN10 - alfa * x; }, { color: 2, w: 2.4 });
          var x1 = 2, x2 = 3;
          var y1 = Math.log(c) / Math.LN10 - alfa * x1, y2 = Math.log(c) / Math.LN10 - alfa * x2;
          g.seg(x1, y1, x2, y1, { color: 'axis', w: 1.4, dash: [4, 3] });
          g.seg(x2, y1, x2, y2, { color: 3, w: 2 });
        }
      });
      function pinta() {
        var l1 = c * Math.pow(100, -alfa), l2 = c * Math.pow(1000, -alfa);
        out.set('$L = ' + c + ' \\cdot N^{-' + U.fmt(alfa, 2) + '}$ &nbsp;·&nbsp; ' +
          'pendiente en log-log: <strong>−' + U.fmt(alfa, 2) + '</strong><br>' +
          /* La flecha, y no « a », porque entre los dos números el pegamento
             se queda sin traducir: media frase en cada idioma se lee peor. */
          'Multiplicar los parámetros por 10 lleva la pérdida de ' + U.fmt(l1, 3) + ' → ' + U.fmt(l2, 3) +
          ', o sea la multiplica por $10^{-' + U.fmt(alfa, 2) + '} = ' + U.fmt(Math.pow(10, -alfa), 3) + '$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (alfa < 0.15 ? 'Exponente pequeño: hay que multiplicar el tamaño por muchísimo para ganar poco. Así son de hecho los exponentes reales, y por eso los modelos crecieron tanto.'
            : 'Cuanto mayor el exponente, más inclinada la recta y más se gana al crecer. El segmento naranja es la caída por cada década de la horizontal.') +
          '</span>');
        normal.render(); logo.render();
      }
      W.slider(host, { label: 'exponente α', min: 0.05, max: 0.6, step: 0.01, value: 0.3, dec: 2, on: function (v) { alfa = v; pinta(); } });
      pinta();
    }
  });

  p.note('Conviene decir qué <em>no</em> demuestra esta página. Entrenando el modelo de arriba con varios ' +
    'tamaños, la pérdida <strong>no</strong> baja en línea recta: con este texto y este presupuesto de ' +
    'entrenamiento, el mejor resultado sale con unos 4000 números, y a partir de ahí crecer lo ' +
    'empeora. Eso no refuta las leyes de escala; dice que <strong>aquí no se pueden medir</strong>. ' +
    'Para verlas hay que hacer crecer a la vez el modelo, el texto y el cómputo, y ajustar el ritmo de ' +
    'aprendizaje en cada tamaño; con menos de cuatrocientas letras y unos miles de pasos, lo que domina el ' +
    'resultado es el presupuesto, no el tamaño. Desconfía de una recta ajustada a cinco puntos ruidosos, ' +
    'aquí y en cualquier otro sitio.', 'warn', 'Lo que esta página no puede demostrar');

  /* ---------------------------------------------------------------- */
  p.section('Después del preentrenamiento');

  p.text('Un modelo recién preentrenado sabe continuar texto, y nada más. Si se le escribe una pregunta, ' +
    'lo más probable estadísticamente puede ser <em>otra pregunta parecida</em>, porque en internet las ' +
    'preguntas suelen venir en listas. Para que conteste hay que pedírselo de otra manera.');

  p.list([
    '<strong>Ajuste con ejemplos.</strong> Se sigue entrenando con la misma pérdida, pero sobre pares de instrucción y respuesta bien escritos. Es el mismo preentrenamiento sobre texto más selecto.',
    '<strong>Ajuste por preferencias.</strong> Se le muestran a una persona dos respuestas y se le pregunta cuál prefiere. Con esas comparaciones se entrena algo que puntúa respuestas, y después se ajusta el modelo para que suba esa puntuación.'
  ]);

  p.note('Ese segundo paso es donde entra [[ia-refuerzo|el aprendizaje por refuerzo]], y también donde ' +
    'aparece [[ia-limites|la ley de Goodhart]]: en cuanto la puntuación se convierte en el objetivo, el ' +
    'modelo aprende a subirla por caminos que nadie quería —respuestas largas que parecen completas, ' +
    'seguridad fingida, hablar bonito sin decir nada—. Optimizar la medida estropea la medida.',
    'warn', 'Y aquí empieza el problema siguiente');

  p.text('Conviene tener clara una consecuencia de todo lo anterior. El objetivo, de principio a fin, es ' +
    '<strong>producir texto probable</strong>. No hay en ninguna parte de la pérdida un término que ' +
    'mida si lo dicho es cierto. Que acierte tantas veces se debe a que en el texto con el que se ' +
    'entrenó lo verdadero era, casi siempre, lo más frecuente; y que invente con aplomo se debe a que ' +
    'una afirmación inventada con la forma correcta también es texto probable.');

  p.ejemplo({
    title: 'Cuántas cuentas hay detrás de una frase',
    enunciado: 'Un modelo con una ventana de 2048 tokens y 32 capas, cada una con una atención. ¿Cuántos productos escalares hace la parte de atención para procesar la ventana entera una sola vez? ¿Y si la ventana se duplica?',
    pasos: [
      { t: '<strong>Una capa.</strong> Cada uno de los 2048 tokens se compara con los 2048, así que son $2048^2 = 4\\,194\\,304$ pares.', antes: 'Cada token se compara con todos, incluido él mismo.' },
      { t: '<strong>Las 32 capas.</strong> $4\\,194\\,304 \\times 32 = 134\\,217\\,728$, unos 134 millones de productos escalares, y eso sólo la atención.', antes: 'Cada capa repite la misma operación.' },
      { t: '<strong>Al duplicar la ventana.</strong> $4096^2 = 16\\,777\\,216$ por capa: cuatro veces más, no dos.', antes: 'El coste va con el cuadrado. ¿Por cuánto se multiplica al duplicar?' },
      { t: '<strong>El total con la ventana doble.</strong> $16\\,777\\,216 \\times 32 = 536\\,870\\,912$, unos 537 millones.' },
      { t: '<strong>La lectura.</strong> Duplicar el contexto cuadruplica este coste. Por eso las ventanas grandes salen caras, y por eso hay tanto trabajo en calcular la atención sin construir la matriz entera.' }
    ],
    cierre: 'Y estos son sólo los productos escalares de la atención: faltan las redes densas de cada capa, que en los modelos reales se llevan la mayor parte de los parámetros.'
  });

  p.comprueba('Un modelo de lenguaje afirma con seguridad un dato que es falso. ¿Cuál es la explicación más ajustada?', [
    { t: 'Su objetivo es producir texto probable, y una afirmación falsa bien escrita también lo es', ok: true, por: 'En ningún punto de la pérdida hay un término que mida la verdad: se mide la probabilidad del siguiente token. Que acierte tanto se debe a que en el texto de entrenamiento lo verdadero suele ser lo más frecuente, no a que haya una comprobación de veracidad en alguna parte.' },
    { t: 'Se ha confundido al recuperar el dato de su memoria', ok: false, por: 'Presupone que hay una base de datos dentro de la que se consulta, y no la hay: no hay separación entre «recordar» y «redactar». Todo sale del mismo cálculo de probabilidades.' },
    { t: 'Le faltó entrenamiento con ese dato concreto', ok: false, por: 'Puede influir, pero no explica la seguridad con que lo dice. Aunque el dato estuviera mil veces, el objetivo seguiría siendo la probabilidad del texto y no su veracidad.' }
  ]);

  p.util('Saber que el objetivo es la probabilidad del siguiente token explica casi todo lo que ' +
    'desconcierta al usarlos. Explica que inventen referencias con formato impecable, que la misma ' +
    'pregunta formulada de dos maneras dé respuestas distintas, que se les dé mejor lo que abunda en ' +
    'internet que lo que escasea, y que pedirles «piensa paso a paso» funcione: escribir los pasos ' +
    'intermedios hace que cada token siguiente sea más fácil de acertar. Nada de eso es misterioso una ' +
    'vez que se sabe qué se está minimizando.');

  p.hist('El camino es corto y está bien documentado. El transformador es de 2017. En 2018 se vio que ' +
    'preentrenar sobre texto sin etiquetar y ajustar después para cada tarea funcionaba mucho mejor que ' +
    'entrenar cada tarea por separado. A partir de ahí, el descubrimiento con más consecuencias no fue ' +
    'una idea sino una observación empírica: <strong>que las mismas recetas seguían mejorando al ' +
    'agrandarlas</strong>, sin señales de agotarse, y que a cierta escala aparecían capacidades que no ' +
    'se habían buscado. Buena parte de lo que ha pasado desde entonces es consecuencia de tomarse esa ' +
    'observación en serio.');

  p.trampas([
    { e: 'Creer que hay una base de datos dentro', por: 'No hay nada que consultar: hay pesos que producen probabilidades. Por eso no se puede «borrar un dato» de un modelo como se borra una fila de una tabla.' },
    { e: 'Pensar que la arquitectura de los modelos grandes es distinta', por: 'Es la misma que la de esta página, repetida muchas más veces y con muchos más números. La diferencia es de escala, no de idea.' },
    { e: 'Confundir escribir con saber', por: 'La pérdida mide la probabilidad del texto, no su verdad. Una afirmación falsa con la forma correcta puntúa igual de bien.' },
    { e: 'Fiarse de una recta ajustada a pocos puntos', por: 'En log-log casi cualquier cosa parece recta en un tramo corto. Las leyes de escala se sostienen sobre muchos órdenes de magnitud, no sobre cinco medidas.' },
    { e: 'Suponer que ampliar la ventana es sólo cuestión de memoria', por: 'El coste de la atención va con el cuadrado de la longitud: duplicar el contexto cuadruplica ese trabajo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La pérdida de partida',
    level: 'basico',
    gen: function (r) {
      var V = r.pick([23, 27, 256, 1000, 50000]);
      return { V: V, L: Math.log(V) };
    },
    ask: function (d) {
      return 'Un modelo sin entrenar reparte por igual entre los ' + U.miles(d.V) + ' tokens del ' +
        'vocabulario. ¿Cuánto vale su entropía cruzada, en nats? (tres decimales)';
    },
    fields: [{ name: 'l', label: 'pérdida', w: 'tiny' }],
    sol: function (d) { return { l: U.round(d.L, 8) }; },
    dec: 3,
    errores: [{ si: function (v, d) { var base2 = Math.log(d.V) / Math.LN2; return Math.abs(base2 - d.L) > 0.0005 && Math.abs(v.l - base2) < 0.0005; }, msg: 'Eso está en bits. En nats el logaritmo es neperiano.' }],
    hint: function () { return 'Repartir por igual entre $V$ opciones da probabilidad $1/V$ a cada una, y la pérdida es $-\\ln(1/V) = \\ln V$.'; },
    steps: function (d) {
      return ['Cada token recibe probabilidad $1/' + U.miles(d.V) + '$.',
        '$-\\ln(1/' + U.miles(d.V) + ') = \\ln ' + U.miles(d.V) + ' = ' + U.fmt(d.L, 3) + '$ nats.',
        'Es el punto de partida: cualquier entrenamiento que sirva de algo tiene que bajar de ahí.'];
    },
    answer: function (d) { return U.fmt(d.L, 3); }
  });

  p.exercise({
    title: 'Duplicar la ventana',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([512, 1024, 2048, 8192]), k = r.pick([2, 3, 4]);
      return { n: n, k: k, pares: n * n, factor: k * k };
    },
    ask: function (d) {
      return 'Una ventana de ' + U.miles(d.n) + ' tokens. ¿Cuántos pares token-token hay en una capa de ' +
        'atención, y por cuánto se multiplica ese número si la ventana se hace ' + d.k + ' veces mayor?';
    },
    fields: [{ name: 'p', label: 'pares', w: 'small' }, { name: 'f', label: 'factor', w: 'tiny' }],
    sol: function (d) { return { p: d.pares, f: d.factor }; },
    dec: 0,
    errores: [{ si: function (v, d) { return Math.abs(v.f - d.k) < 0.5 && d.k !== d.factor; }, msg: 'El coste va con el cuadrado: si la ventana se multiplica por $k$, los pares se multiplican por $k^2$.' }],
    hint: function (d) { return 'Cada token se compara con los ' + U.miles(d.n) + '.'; },
    steps: function (d) {
      return ['$' + U.miles(d.n) + '^2 = ' + U.miles(d.pares) + '$ pares.',
        'Con la ventana $' + d.k + '$ veces mayor: $' + d.k + '^2 = ' + d.factor + '$ veces más.'];
    },
    answer: function (d) { return U.miles(d.pares) + ' y ' + d.factor; }
  });

  p.exercise({
    title: 'Leer una ley de potencias',
    level: 'medio',
    gen: function (r) {
      var alfa = r.pick([0.05, 0.1, 0.2, 0.3]), k = r.pick([10, 100, 1000]);
      return { alfa: alfa, k: k, factor: Math.pow(k, -alfa) };
    },
    ask: function (d) {
      return 'Una ley $L = c\\,N^{-' + U.fmt(d.alfa, 2) + '}$. Si el número de parámetros se multiplica ' +
        'por ' + U.miles(d.k) + ', ¿por cuánto queda multiplicada la pérdida? (cuatro decimales)';
    },
    fields: [{ name: 'f', label: 'factor', w: 'tiny' }],
    sol: function (d) { return { f: U.round(d.factor, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var signo = Math.pow(d.k, d.alfa); return Math.abs(signo - d.factor) > 0.00005 && Math.abs(v.f - signo) < 0.00005; }, msg: 'Cuidado con el signo del exponente: es negativo, así que la pérdida <em>baja</em> y el factor es menor que 1.' }],
    hint: function (d) { return 'La pérdida queda multiplicada por $' + U.miles(d.k) + '^{-' + U.fmt(d.alfa, 2) + '}$.'; },
    steps: function (d) {
      return ['$' + U.miles(d.k) + '^{-' + U.fmt(d.alfa, 2) + '} = ' + U.fmt(d.factor, 4) + '$.',
        'O sea que la pérdida baja un $' + U.fmt(100 * (1 - d.factor), 1) + '\\ \\%$.',
        d.alfa <= 0.1 ? 'Fíjate en lo poco que se gana: multiplicar el modelo por ' + U.miles(d.k) + ' apenas mueve la pérdida. Así son los exponentes de verdad.'
          : 'Cuanto mayor el exponente, más se gana al crecer.'];
    },
    answer: function (d) { return U.fmt(d.factor, 4); }
  });

  p.exercise({
    title: 'De la pérdida a la perplejidad',
    level: 'medio',
    gen: function (r) {
      var L = r.pick([0.9, 1.5, 2.3, 3.1]), V = r.pick([23, 256]);
      return { L: L, V: V, ppl: Math.exp(L), tope: V };
    },
    ask: function (d) {
      return 'Un modelo con vocabulario de ' + d.V + ' símbolos alcanza una pérdida de $' + U.fmt(d.L, 1) +
        '$ nats. ¿Cuál es su perplejidad, y qué fracción del máximo posible representa? (dos decimales ' +
        'la perplejidad, un decimal el porcentaje)';
    },
    fields: [{ name: 'p', label: 'perplejidad', w: 'tiny' }, { name: 'q', label: '% del máximo', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.ppl, 6), q: U.round(100 * d.ppl / d.tope, 6) }; },
    dec: { p: 2, q: 1 },
    hint: function () { return 'Perplejidad $= e^L$ con la pérdida en nats. El máximo es el tamaño del vocabulario.'; },
    steps: function (d) {
      return ['$e^{' + U.fmt(d.L, 1) + '} = ' + U.fmt(d.ppl, 2) + '$.',
        'El máximo, que es no saber nada, sería ' + d.V + '.',
        'Fracción: $' + U.fmt(d.ppl, 2) + '/' + d.V + ' = ' + U.fmt(100 * d.ppl / d.tope, 1) + '\\ \\%$.'];
    },
    answer: function (d) { return U.fmt(d.ppl, 2) + ', el ' + U.fmt(100 * d.ppl / d.tope, 1) + ' %'; }
  });

  p.exercise({
    title: 'Qué explica qué',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'inventa una cita bibliográfica con formato perfecto y autores que no existen', v: 'probable', por: 'El objetivo es la probabilidad del texto. Una cita con el formato correcto es altamente probable aunque sea falsa, y nada en la pérdida distingue una cosa de la otra.' },
        { t: 'responde mucho mejor si se le pide que razone paso a paso', v: 'pasos', por: 'Escribir los pasos intermedios convierte un salto difícil en varios fáciles: cada token siguiente es más predecible cuando el anterior ya ha hecho parte del trabajo.' },
        { t: 'después del ajuste por preferencias da respuestas más largas y seguras aunque no sean mejores', v: 'goodhart', por: 'Es la ley de Goodhart: la puntuación aprendida premiaba rasgos que se correlacionaban con calidad, y al optimizarla el modelo aprende a producir esos rasgos en vez de la calidad.' },
        { t: 'no sabe nada de un suceso ocurrido después de su entrenamiento', v: 'corte', por: 'Sus pesos se fijaron al acabar el entrenamiento. No hay ninguna base de datos que se actualice: lo que no estaba en el texto de entonces no está en ninguna parte.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Un modelo de lenguaje ' + d.c.t + '. ¿Qué lo explica?'; },
    fields: [{ name: 'q', label: 'Explicación', opts: [
      { t: 'el objetivo es texto probable, no texto verdadero', v: 'probable' },
      { t: 'los pasos intermedios hacen más fácil cada token siguiente', v: 'pasos' },
      { t: 'la ley de Goodhart: se optimizó la medida', v: 'goodhart' },
      { t: 'sus pesos quedaron fijados al acabar el entrenamiento', v: 'corte' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Casi todo se explica recordando qué se minimiza exactamente, y en qué momento se dejó de entrenar.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un LLM es un transformador apilado, entrenado con una sola tarea: <strong>acertar el siguiente token</strong>. La etiqueta es el propio texto.',
    'La arquitectura de esta página es la misma que la de los modelos grandes. Lo que cambia son muchos órdenes de magnitud de números y de texto.',
    'La ventana de contexto cuesta el <strong>cuadrado</strong> de su longitud: duplicarla cuadruplica el trabajo de la atención.',
    'Una ley de potencias es una recta en ejes logarítmicos, y la pendiente <em>es</em> el exponente. Por eso las leyes de escala se dibujan así.',
    'Con poco texto y poco presupuesto no se pueden medir leyes de escala: aquí el modelo pequeño gana al grande, y eso habla del presupuesto, no de la escala.',
    'El ajuste por preferencias da lugar a la ley de Goodhart: en cuanto la puntuación es el objetivo, se optimiza la puntuación y no la calidad.',
    'De principio a fin se minimiza la probabilidad del texto, nunca su verdad. Ahí está el origen de casi todo lo que desconcierta al usarlos.'
  ]);
});
