/* Tema: Redes con memoria: RNN y LSTM */
Course.topic('ia-recurrentes', function (p) {

  p.puente('De [[cib-realimentacion|la realimentación]] viene el bucle en el que la salida vuelve a la ' +
    'entrada, y de [[cib-retardos|los retardos]], lo que pasa cuando la información tarda en llegar. ' +
    'De [[av-lineal|los autovalores]] viene la herramienta que lo explica todo: qué le ocurre a una ' +
    'matriz elevada a una potencia grande.');

  p.text('Las redes de los temas anteriores no tienen memoria: se les da una imagen, contestan, y lo que ' +
    'vieron antes no existe. Para texto, audio o cualquier serie temporal eso no vale, porque el ' +
    'significado de lo que llega ahora depende de lo que llegó antes. La solución es la más antigua ' +
    'del bloque de cibernética: <strong>un bucle</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Una red que se llama a sí misma');

  p.text('Se añade un <strong>estado</strong> $\\vec h$ que la red se pasa a sí misma de un instante al ' +
    'siguiente. En cada paso se combina lo que llega ahora con lo que se venía arrastrando, y el ' +
    'resultado es el estado nuevo.');

  p.formula('\\vec h_t = \\tanh\\bigl(W_h\\,\\vec h_{t-1} + W_x\\,\\vec x_t + \\vec b\\bigr)',
    'una red recurrente, entera',
    'Se lee: <em>«hache sub te es la tangente hiperbólica de, uve doble sub hache por hache sub te menos ' +
    'uno, más uve doble sub equis por equis sub te, más be»</em>.<br><br>$\\vec x_t$ es lo que entra en ' +
    'el instante $t$ y $\\vec h_{t-1}$ es lo que la red se traía. Y lo importante: ' +
    '<strong>$W_h$ y $W_x$ son las mismas en todos los instantes</strong>. Es el mismo truco de ' +
    '[[ia-cnn|la convolucional]] —compartir pesos por una simetría— pero en el tiempo en vez de en el ' +
    'espacio: lo que significa una palabra no cambia por aparecer tres posiciones más allá.');

  p.note('Desplegar el bucle en el tiempo convierte la red en una <strong>red profunda</strong> con tantas ' +
    'capas como instantes tenga la secuencia, solo que todas comparten los mismos pesos. Entrenarla es ' +
    'retropropagar por esa pila, y a eso se le llama retropropagación en el tiempo. No hay ninguna idea ' +
    'nueva: es [[ia-retropropagacion|la regla de la cadena]] otra vez.', 'ok', 'Un bucle desplegado es una red profunda');

  /* ---------------------------------------------------------------- */
  p.section('El gradiente es una potencia de una matriz');

  p.text('Y aquí aparece el problema, que es puramente de álgebra lineal. Al retropropagar desde el final ' +
    'de la secuencia hasta el principio, hay que atravesar $W_h$ una vez por cada instante. El ' +
    'gradiente que llega al primer paso lleva multiplicada la matriz <strong>elevada a la longitud de ' +
    'la secuencia</strong>.');

  p.formula('\\frac{\\partial \\vec h_T}{\\partial \\vec h_0} \\;\\sim\\; W_h^{\\,T} \\;=\\; P\\,D^{T}P^{-1}',
    'por qué la longitud decide el destino',
    'Se lee: <em>«la derivada de hache sub te mayúscula respecto de hache sub cero se comporta como uve ' +
    'doble sub hache elevada a te»</em>.<br><br>Y eso ya sabes diagonalizarlo: elevar la matriz es ' +
    'elevar sus autovalores. Si el mayor cumple $|\\lambda| < 1$, entonces $\\lambda^{T}$ tiende a cero ' +
    'y <strong>el gradiente se desvanece</strong>; si $|\\lambda| > 1$, se dispara. El caso intermedio, ' +
    '$|\\lambda| = 1$ exacto, es un filo en el que no se puede vivir.<br><br>Con $\\lambda = 0{,}9$ y ' +
    'cincuenta pasos, el factor es $0{,}9^{50} \\approx 0{,}005$: lo que pasó al principio de la frase ' +
    'llega al final multiplicado por cinco milésimas.');

  p.demo({
    title: 'Elevar a la potencia de la longitud',
    intro: 'La curva es el factor por el que queda multiplicado el gradiente al recorrer la secuencia hacia atrás. Mueve el autovalor alrededor de 1 y fíjate en lo estrecha que es la zona en la que no se aplasta ni se dispara. El eje vertical es logarítmico.',
    predice: 'Con un autovalor de 0,9 y cien pasos, ¿cuánto crees que quedará del gradiente: la mitad, una centésima, o algo muchísimo menor?',
    build: function (host) {
      var lam = 0.9, T = 50;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 100, ymin: -12, ymax: 8, height: 300,
        xlabel: 'pasos hacia atrás', ylabel: 'log₁₀ del factor',
        aria: 'El factor que multiplica al gradiente según los pasos recorridos, en escala logarítmica, para el autovalor elegido',
        draw: function (g) {
          g.hline(0, { color: 'axis', w: 1.4 });
          [0.7, 0.9, 1, 1.1, 1.3].forEach(function (v, i) {
            g.fn(function (t) {
              return U.clamp(t * Math.log(v) / Math.LN10, -13, 9);
            }, { color: 'axis', w: 1, alpha: 0.35 });
          });
          g.fn(function (t) {
            return U.clamp(t * Math.log(lam) / Math.LN10, -13, 9);
          }, { color: lam > 1 ? 'bad' : (lam < 1 ? 1 : 'ok'), w: 2.8 });
          g.vline(T, { color: 'ink', w: 1.6, dash: [5, 4] });
        }
      });
      function pinta() {
        var f = Math.pow(lam, T);
        out.set('Autovalor $|\\lambda| = ' + U.fmt(lam, 2) + '$ &nbsp;·&nbsp; secuencia de <strong>' + T + '</strong> pasos<br>' +
          'Factor sobre el gradiente: <strong>' + (f > 1e6 || f < 1e-6 ? f.toExponential(2) : U.fmt(f, 6)) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (lam < 0.98 ? 'Se desvanece: lo que ocurrió hace ' + T + ' pasos apenas influye en el gradiente, así que la red no puede aprender esa dependencia.'
            : (lam > 1.02 ? 'Se dispara: el gradiente crece sin control y el entrenamiento se rompe. Se ataja recortándolo a mano, pero es un parche.'
              : 'Justo en el filo. Aquí el gradiente se conserva, pero mantenerse exactamente en 1 mientras se entrena es imposible.')) +
          '</span>');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'autovalor mayor |λ|', min: 0.6, max: 1.4, step: 0.01, value: 0.9, dec: 2, on: function (v) { lam = v; pinta(); } });
      W.slider(fila, { label: 'longitud de la secuencia', min: 5, max: 100, step: 5, value: 50, dec: 0, on: function (v) { T = v; pinta(); } });
      pinta();
    }
  });

  p.text('Esto explica un fracaso histórico. Durante años las redes recurrentes funcionaban con secuencias ' +
    'de cinco o diez pasos y no había manera de que aprendieran nada más largo. No era falta de datos ' +
    'ni de potencia: era que el gradiente <strong>no llegaba</strong>, y no llegaba por una razón ' +
    'aritmética que no se arregla con un ordenador mejor.');

  /* ---------------------------------------------------------------- */
  p.section('La solución: un camino sin multiplicaciones');

  p.text('La LSTM cambia una cosa, y es una cosa muy concreta. Además del estado $\\vec h$ mantiene una ' +
    '<strong>celda de memoria</strong> $\\vec c$ que se actualiza <em>sumando</em>, no multiplicando por ' +
    'una matriz.');

  p.formula('\\vec c_t = \\vec f_t \\odot \\vec c_{t-1} \\; + \\; \\vec i_t \\odot \\vec g_t',
    'la celda de memoria de una LSTM',
    'El símbolo $\\odot$ es el producto <strong>componente a componente</strong>, no el de matrices.<br><br>' +
    '$\\vec f_t$ es la <strong>puerta de olvido</strong>: una sigmoide, o sea un número entre 0 y 1 para ' +
    'cada componente, que decide cuánto del pasado se conserva. $\\vec i_t$ es la puerta de entrada y ' +
    '$\\vec g_t$ lo que se propone añadir.<br><br>Lo decisivo: al retropropagar por esta línea, el ' +
    'factor que aparece no es una matriz sino <strong>$\\vec f_t$</strong>. Si la red aprende a poner ' +
    'la puerta de olvido cerca de 1, el gradiente atraviesa cien pasos multiplicándose por ' +
    'aproximadamente 1 cada vez, y llega entero.');

  p.note('Las tres puertas —olvidar, entrar y salir— son sigmoides, así que la red <strong>aprende ' +
    'cuándo recordar y cuándo olvidar</strong> en vez de tenerlo fijado. Y como son sigmoides, todo ' +
    'sigue siendo derivable y se entrena con el mismo gradiente de siempre. No hay ninguna maquinaria ' +
    'nueva: hay una autopista aditiva junto a la carretera multiplicativa.', 'ok', 'Puertas que se aprenden');

  p.demo({
    title: 'Hasta dónde llega el gradiente, medido',
    intro: 'Se construye una cadena de la longitud que elijas y se mide el gradiente que llega al primer paso, con autodiferenciación de verdad. A la izquierda, una recurrente normal; a la derecha, la celda aditiva con la puerta de olvido que elijas.',
    predice: 'En la recurrente el factor por paso es menor que 1 y se multiplica. En la celda aditiva es la puerta de olvido. Con la puerta a 0,99 y cincuenta pasos, ¿llegará más o menos gradiente que con una recurrente de factor 0,9?',
    build: function (host) {
      var T = 30, puerta = 0.95;
      var out = W.readout(host, '');
      /* Se mide el gradiente de verdad recorriendo el grafo: se encadena T
         veces la operacion y se pregunta cuanto le llega al estado inicial. */
      function alcance(pasos, aditiva) {
        NN.limpia();
        var h0 = NN.t([1, 2], [0.5, -0.3]);
        h0.entrena = true;
        var h = h0;
        var Wh = NN.t([2, 2], [0.62, -0.28, 0.28, 0.62]);
        var t;
        if (aditiva) {
          var f = NN.t([1, 2], [puerta, puerta]);
          for (t = 0; t < pasos; t++) h = NN.suma(NN.prod(h, f), NN.escala(NN.tanh(NN.mm(h, Wh)), 0.02));
        } else {
          for (t = 0; t < pasos; t++) h = NN.tanh(NN.mm(h, Wh));
        }
        var L = NN.media(h);
        NN.atras(L, [h0]);
        return Math.sqrt(h0.g[0] * h0.g[0] + h0.g[1] * h0.g[1]);
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 60, ymin: -14, ymax: 2, height: 300,
        xlabel: 'longitud de la secuencia', ylabel: 'log₁₀ del gradiente que llega',
        aria: 'Comparación del gradiente que alcanza el primer paso en una red recurrente y en una celda aditiva',
        draw: function (g) {
          var a = [], b = [], k;
          for (k = 1; k <= 60; k += 2) {
            a.push([k, Math.log(Math.max(alcance(k, false), 1e-15)) / Math.LN10]);
            b.push([k, Math.log(Math.max(alcance(k, true), 1e-15)) / Math.LN10]);
          }
          g.path(a, { color: 1, w: 2.6 });
          g.path(b, { color: 2, w: 2.6 });
          g.vline(T, { color: 'ink', w: 1.6, dash: [5, 4] });
          g.text(1, 1.2, 'recurrente normal', { color: 1, size: 12 });
          g.text(1, 0.2, 'celda aditiva (LSTM)', { color: 2, size: 12 });
        }
      });
      function pinta() {
        var r = alcance(T, false), l = alcance(T, true);
        var razon = r > 0 ? l / r : Infinity;
        out.set('Secuencia de <strong>' + T + '</strong> pasos &nbsp;·&nbsp; puerta de olvido $f = ' + U.fmt(puerta, 3) + '$<br>' +
          'Gradiente que llega al primer paso: <span style="color:var(--c2)">recurrente ' + r.toExponential(2) +
          '</span> &nbsp;·&nbsp; <span style="color:var(--c3)">aditiva ' + l.toExponential(2) + '</span><br>' +
          '<strong>' + (!isFinite(razon) ? 'la recurrente ya no deja pasar nada'
            : (razon >= 1 ? 'La vía aditiva deja pasar $' + U.miles(Math.round(razon)) + '$ veces más'
              : 'Aquí la vía aditiva deja pasar ' + U.fmt(razon, 3) + ' veces lo de la recurrente: con la puerta tan cerrada, es peor')) + '.</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (puerta > 0.97 ? 'Con la puerta casi abierta, el gradiente atraviesa la secuencia entera casi intacto: esa es toda la idea de la LSTM.'
            : (puerta < 0.8 ? 'Con la puerta bastante cerrada, la celda también olvida: la ventaja se reduce, porque multiplicar por 0,7 cincuenta veces tampoco deja nada.'
              : 'La puerta decide cuántos pasos hacia atrás alcanza el gradiente, y la red la aprende.')) +
          '</span>');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'longitud', min: 4, max: 60, step: 2, value: 30, dec: 0, on: function (v) { T = v; pinta(); } });
      W.slider(fila, { label: 'puerta de olvido f', min: 0.6, max: 0.995, step: 0.005, value: 0.95, dec: 3, on: function (v) { puerta = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Cuánto queda del principio de la frase',
    enunciado: 'Una red recurrente tiene autovalor mayor $|\\lambda| = 0{,}8$. Calcular el factor que llega al primer paso en secuencias de 10, 30 y 60 pasos, y cuántos pasos hacen falta para que el gradiente baje de la milésima parte.',
    pasos: [
      { t: '<strong>Diez pasos.</strong> $0{,}8^{10} = 0{,}107$: queda un 11 %. Molesto pero utilizable.', antes: 'Eleva 0,8 a la décima.' },
      { t: '<strong>Treinta pasos.</strong> $0{,}8^{30} = 0{,}00124$: poco más de una milésima. La dependencia larga ya es casi invisible para el entrenamiento.', antes: '¿Y a la treinta? Fíjate en que no es tres veces menos, sino muchísimo menos.' },
      { t: '<strong>Sesenta pasos.</strong> $0{,}8^{60} \\approx 1{,}5\\cdot 10^{-6}$: una millonésima. A efectos prácticos, cero.', antes: 'El factor de 30 pasos, al cuadrado.' },
      { t: '<strong>Cuándo se pierde.</strong> Se busca $0{,}8^{T} < 0{,}001$, es decir $T\\log 0{,}8 < \\log 0{,}001$. Como $\\log 0{,}8$ es negativo, al despejar se da la vuelta a la desigualdad: $T > \\frac{\\log 0{,}001}{\\log 0{,}8} = \\frac{-3}{-0{,}0969} \\approx 31$.', antes: 'Toma logaritmos en los dos lados. Cuidado con el sentido de la desigualdad.' },
      { t: '<strong>Lo que significa.</strong> A partir de unos treinta pasos, esta red es incapaz de aprender que algo del principio importa al final. Y treinta palabras es una frase corta.' }
    ],
    cierre: 'Con la puerta de olvido de una LSTM a $0{,}99$, el factor a los sesenta pasos es $0{,}99^{60} = 0{,}55$: todavía queda la mitad. Esa es la diferencia entre poder aprender una dependencia larga y no poder.'
  });

  p.comprueba('¿Por qué la celda de una LSTM conserva el gradiente mucho mejor que una recurrente normal?', [
    { t: 'Porque su camino principal es una suma con un factor multiplicativo cercano a 1, en vez de una matriz que se eleva a la longitud de la secuencia', ok: true, por: 'Al retropropagar por $\\vec c_t = \\vec f_t \\odot \\vec c_{t-1} + \\ldots$, el factor por paso es $\\vec f_t$. Con la puerta cerca de 1, cien pasos multiplican por casi 1; con una matriz de autovalor 0,8, la aplastan.' },
    { t: 'Porque tiene más parámetros y por eso aprende más', ok: false, por: 'Tiene más parámetros, sí, pero eso no arreglaría nada: el problema no era de capacidad sino de que el gradiente no llegaba. Una recurrente con el cuádruple de neuronas seguiría teniendo el mismo problema.' },
    { t: 'Porque usa sigmoides en vez de tangentes hiperbólicas', ok: false, por: 'La sigmoide tiene una derivada aún más pequeña que la tangente hiperbólica. Lo que importa no es qué activación, sino que exista un camino aditivo por el que el gradiente pase sin multiplicarse por una matriz.' }
  ]);

  p.util('Entre 1997 y aproximadamente 2017, las LSTM fueron lo que había para todo lo que fuera una ' +
    'secuencia: reconocimiento de voz en los móviles, traducción automática, predicción de series ' +
    'temporales, generación de texto. Google las puso en su traductor en 2016 con una mejora muy ' +
    'visible sobre lo anterior. Hoy en texto las han desplazado los transformadores, pero siguen vivas ' +
    'donde la secuencia llega dato a dato y hay que responder sobre la marcha sin poder mirar el ' +
    'futuro: sensores, control, señales en tiempo real y dispositivos pequeños donde no cabe nada ' +
    'mayor.');

  p.hist('El diagnóstico es anterior a la cura. En 1991 Sepp Hochreiter analizó en su tesis de diploma, ' +
    'en alemán y sin mucha repercusión, por qué las redes recurrentes no aprendían dependencias largas, ' +
    'y dio con la respuesta exacta: el producto de factores que se desvanece. Seis años después, en ' +
    '1997, publicó con Jürgen Schmidhuber la arquitectura que lo esquivaba, la LSTM, cuyo nombre ' +
    'significa <em>memoria larga a corto plazo</em>. Tardó otra década larga en imponerse, porque hacían ' +
    'falta datos y máquinas que entonces no había. Es un caso claro de que entender bien por qué algo ' +
    'falla es la mitad del trabajo.');

  p.trampas([
    { e: 'Creer que el problema se arregla con más neuronas', por: 'No es falta de capacidad: es que el gradiente llega multiplicado por $\\lambda^T$. Con más neuronas, el mismo cero.' },
    { e: 'Pensar que basta con recortar el gradiente', por: 'Recortar arregla el caso que se dispara, y es lo que se hace. Pero no arregla el que se desvanece: multiplicar por cero y recortarlo sigue siendo cero.' },
    { e: 'Confundir el producto $\\odot$ con el de matrices', por: 'Las puertas multiplican componente a componente: cada neurona de la celda tiene su propia puerta, con su propio valor entre 0 y 1.' },
    { e: 'Olvidar que los pesos son los mismos en todos los instantes', por: 'Al desplegar parece una red profunda con muchas capas, pero todas comparten $W_h$. Por eso el gradiente acumula la <em>misma</em> matriz elevada, y no un producto de matrices distintas.' },
    { e: 'Creer que una LSTM recuerda indefinidamente', por: 'Solo si aprende a mantener la puerta de olvido cerca de 1. Si la cierra, olvida igual que una recurrente normal, y a veces es justo lo que conviene.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Lo que queda tras la secuencia',
    level: 'basico',
    gen: function (r) {
      var lam = r.pick([0.5, 0.7, 0.8, 0.9, 0.95]);
      var T = r.pick([10, 20, 30, 50]);
      return { lam: lam, T: T, f: Math.pow(lam, T) };
    },
    ask: function (d) {
      return 'Una red recurrente tiene autovalor mayor $|\\lambda| = ' + U.fmt(d.lam, 2) + '$ y la ' +
        'secuencia dura $' + d.T + '$ pasos. ¿Por qué factor queda multiplicado el gradiente que llega ' +
        'al primer paso? (cuatro cifras significativas, o notación científica)';
    },
    fields: [{ name: 'f', label: 'factor', w: 'wide' }],
    sol: function (d) { return { f: d.f }; },
    rel: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(v.f - d.lam * d.T) < 1e-9; }, msg: 'Se multiplica una vez por paso, así que es una <em>potencia</em>, no un producto por el número de pasos.' }],
    hint: function (d) { return 'Una vez por cada paso: $' + U.fmt(d.lam, 2) + '^{' + d.T + '}$.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.lam, 2) + '^{' + d.T + '} = ' + (d.f < 0.001 ? d.f.toExponential(3) : U.fmt(d.f, 6)) + '$',
        d.f < 0.001 ? 'Prácticamente cero: la red no puede aprender ninguna dependencia de esa longitud.'
          : 'Todavía queda algo, pero fíjate en lo deprisa que cae al alargar la secuencia.'];
    },
    answer: function (d) { return d.f < 0.001 ? d.f.toExponential(3) : U.fmt(d.f, 6); }
  });

  p.exercise({
    title: 'Aplastarse o dispararse',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { l: 0.6, v: 'desvanece' }, { l: 0.95, v: 'desvanece' }, { l: 1, v: 'conserva' },
        { l: 1.05, v: 'dispara' }, { l: 1.4, v: 'dispara' }, { l: 0.99, v: 'desvanece' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'El autovalor mayor de $W_h$ vale $' + U.fmt(d.c.l, 2) + '$. Con una secuencia muy larga, ' +
        '¿qué le pasa al gradiente?';
    },
    fields: [{ name: 'q', label: 'El gradiente', opts: [
      { t: 'se desvanece', v: 'desvanece' }, { t: 'se conserva', v: 'conserva' }, { t: 'se dispara', v: 'dispara' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Lo único que importa es si el módulo es menor, igual o mayor que 1, porque se eleva a la longitud.'; },
    steps: function (d) {
      return [d.c.v === 'desvanece' ? 'Menor que 1: elevado a una potencia grande tiende a cero. Se <strong>desvanece</strong>.'
        : (d.c.v === 'dispara' ? 'Mayor que 1: elevado a una potencia grande crece sin límite. Se <strong>dispara</strong>.'
          : 'Exactamente 1: se conserva, pero es un filo en el que no se puede permanecer mientras se entrena.'),
        d.c.l === 0.99 ? 'Y ojo con el 0,99: parece inofensivo, pero $0{,}99^{500} \\approx 0{,}007$.' : ''];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Cuántos pasos aguanta',
    level: 'medio',
    gen: function (r) {
      var lam = r.pick([0.7, 0.8, 0.9, 0.95]);
      var umbral = r.pick([0.01, 0.001]);
      var T = Math.log(umbral) / Math.log(lam);
      return { lam: lam, umbral: umbral, T: T };
    },
    ask: function (d) {
      return 'Con $|\\lambda| = ' + U.fmt(d.lam, 2) + '$, ¿a partir de cuántos pasos el factor baja de $' +
        U.fmt(d.umbral, 3) + '$? (dos decimales)';
    },
    fields: [{ name: 't', label: 'pasos', w: 'tiny' }],
    sol: function (d) { return { t: U.round(d.T, 6) }; },
    dec: 2,
    hint: function () { return 'Toma logaritmos en $\\lambda^T < u$ y despeja $T$. Como $\\log\\lambda$ es negativo, al dividir se da la vuelta a la desigualdad.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.lam, 2) + '^T < ' + U.fmt(d.umbral, 3) + '$, y tomando logaritmos, $T\\log ' + U.fmt(d.lam, 2) + ' < \\log ' + U.fmt(d.umbral, 3) + '$.',
        'Al dividir entre $\\log ' + U.fmt(d.lam, 2) + ' = ' + U.fmt(Math.log(d.lam) / Math.LN10, 4) + '$, que es negativo, la desigualdad se invierte:',
        '$T > ' + U.fmt(d.T, 2) + '$.'];
    },
    answer: function (d) { return U.fmt(d.T, 2); }
  });

  p.exercise({
    title: 'Un paso de la celda',
    level: 'medio',
    gen: function (r) {
      var c = r.real(-2, 2, 2), f = r.pick([0.1, 0.5, 0.9, 0.99]);
      var iP = r.pick([0.2, 0.6, 1]), g = r.real(-1.5, 1.5, 2);
      return { c: c, f: f, i: iP, g: g, nuevo: f * c + iP * g };
    },
    ask: function (d) {
      return 'La celda vale $c_{t-1} = ' + U.fmt(d.c, 2) + '$. La puerta de olvido da $f = ' + U.fmt(d.f, 2) +
        '$, la de entrada $i = ' + U.fmt(d.i, 2) + '$ y el candidato es $g = ' + U.fmt(d.g, 2) +
        '$. Calcula $c_t = f\\,c_{t-1} + i\\,g$. (cuatro decimales)';
    },
    fields: [{ name: 'c', label: 'c_t', w: 'tiny' }],
    sol: function (d) { return { c: U.round(d.nuevo, 8) }; },
    dec: 4,
    /* Olvidar la puerta da el resultado correcto cuando f = 1 y tambien
       cuando la celda venia a cero. Se compara con la solucion, que cubre
       los dos casos y cualquier otro. */
    errores: [{ si: function (v, d) { var sinPuerta = d.c + d.i * d.g; return Math.abs(sinPuerta - d.nuevo) > 0.0005 && Math.abs(v.c - sinPuerta) < 0.0005; }, msg: 'Falta multiplicar el valor anterior por la puerta de olvido: es ella la que decide cuánto del pasado sobrevive.' }],
    hint: function () { return 'Dos productos y una suma: lo que sobrevive del pasado, más lo que entra de nuevo.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.f, 2) + ' \\times ' + U.fmt(d.c, 2) + ' = ' + U.fmt(d.f * d.c, 4) + '$ es lo que queda del pasado.',
        '$' + U.fmt(d.i, 2) + ' \\times ' + U.fmt(d.g, 2) + ' = ' + U.fmt(d.i * d.g, 4) + '$ es lo que entra.',
        '$c_t = ' + U.fmt(d.nuevo, 4) + '$.',
        d.f > 0.95 ? 'Con la puerta casi abierta, la celda conserva casi todo: así es como el gradiente atraviesa cien pasos.'
          : 'Con la puerta bastante cerrada, la celda se olvida deprisa de lo anterior.'];
    },
    answer: function (d) { return U.fmt(d.nuevo, 4); }
  });

  p.exercise({
    title: 'Recurrente contra celda aditiva',
    level: 'avanzado',
    gen: function (r) {
      var lam = r.pick([0.7, 0.8, 0.9]);
      var f = r.pick([0.98, 0.99, 0.995]);
      var T = r.pick([50, 100, 200]);
      var a = Math.pow(lam, T), b = Math.pow(f, T);
      return { lam: lam, f: f, T: T, a: a, b: b, razon: b / a };
    },
    ask: function (d) {
      return 'En una secuencia de $' + d.T + '$ pasos, una recurrente con $|\\lambda| = ' + U.fmt(d.lam, 2) +
        '$ y una celda con puerta de olvido $f = ' + U.fmt(d.f, 3) + '$. Calcula el factor de cada una y ' +
        'cuántas veces mayor es el de la celda. (notación científica para los factores)';
    },
    fields: [
      { name: 'a', label: 'factor recurrente', w: 'wide' },
      { name: 'b', label: 'factor celda', w: 'wide' },
      { name: 'r', label: 'cuántas veces mayor', w: 'wide' }
    ],
    sol: function (d) { return { a: d.a, b: d.b, r: d.razon }; },
    rel: 1e-3,
    hint: function () { return 'Las dos son potencias: $\\lambda^T$ y $f^T$. La razón entre ellas es $(f/\\lambda)^T$.'; },
    steps: function (d) {
      return ['Recurrente: $' + U.fmt(d.lam, 2) + '^{' + d.T + '} = ' + d.a.toExponential(3) + '$.',
        'Celda: $' + U.fmt(d.f, 3) + '^{' + d.T + '} = ' + d.b.toExponential(3) + '$.',
        'Razón: $\\left(\\frac{' + U.fmt(d.f, 3) + '}{' + U.fmt(d.lam, 2) + '}\\right)^{' + d.T + '} = ' + d.razon.toExponential(3) + '$.',
        'Una diferencia de unas centésimas en el factor por paso se convierte, elevada a cientos de pasos, en muchos órdenes de magnitud. Ahí está todo.'];
    },
    answer: function (d) { return d.razon.toExponential(3) + ' veces mayor'; }
  });

  p.keys([
    'Una red recurrente añade un estado que se pasa a sí misma, con los <strong>mismos pesos en todos los instantes</strong>: compartir pesos en el tiempo.',
    'Desplegada, es una red profunda con tantas capas como pasos, y se entrena con la regla de la cadena de siempre.',
    'El gradiente que llega al principio lleva $W_h$ elevada a la longitud: con $|\\lambda|<1$ se desvanece y con $|\\lambda|>1$ se dispara.',
    'Con $\\lambda = 0{,}8$, a los treinta pasos queda una milésima: por eso no se aprendían dependencias largas.',
    'La LSTM añade una celda que se actualiza <strong>sumando</strong>, y el factor por paso pasa a ser la puerta de olvido.',
    'Con la puerta cerca de 1 el gradiente atraviesa cien pasos casi intacto, y la red aprende sola cuándo abrirla y cerrarla.'
  ]);
});
