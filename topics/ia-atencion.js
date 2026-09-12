/* Tema: Atención y el transformador */
Course.topic('ia-atencion', function (p) {

  p.puente('De [[ge-vectores|el producto escalar]] viene la forma de medir parecido; de ' +
    '[[al-matrices|las matrices]], la manera de hacer todas esas cuentas a la vez; de ' +
    '[[tr-funciones|senos y cosenos]], el truco para decirle a la red en qué orden venían las ' +
    'palabras; y de [[pe-normal|la normal]], el motivo de una raíz cuadrada que parece sacada de la ' +
    'manga. Con eso se construye la arquitectura que está debajo de todo lo que se usa hoy.');

  p.text('[[ia-recurrentes|Las redes recurrentes]] tenían un problema de fondo: toda la frase leída hasta ' +
    'el momento se resume en un único vector de estado. Sea cual sea su tamaño, es un cuello de ' +
    'botella, y lo que quedó lejos se diluye. La atención lo resuelve por la vía directa: ' +
    '<strong>que cada posición pueda mirar a todas las demás, sin intermediarios</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Consultas, claves y valores');

  p.text('El mecanismo se explica con un diccionario. Para buscar algo se lleva una <strong>consulta</strong>, ' +
    'se compara con las <strong>claves</strong> de todas las entradas, y se devuelve el ' +
    '<strong>valor</strong> de la que encaja. La diferencia es que aquí no gana una sola: se devuelve ' +
    '<em>una mezcla</em> de todos los valores, pesada por lo bien que encajó cada clave.');

  p.text('Cada token produce sus tres vectores multiplicando su representación por tres matrices que se ' +
    'aprenden: $\\vec q = \\vec x W_Q$, $\\vec k = \\vec x W_K$, $\\vec v = \\vec x W_V$. La misma ' +
    'palabra hace de las tres cosas según le toque: pregunta cuando es ella la que mira, y ofrece clave ' +
    'y valor cuando la miran a ella.');

  p.formula('\\text{Atención}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^t}{\\sqrt{d}}\\right) V',
    'la atención, entera',
    'Se lee de dentro afuera. $QK^t$ son <strong>todos los productos escalares</strong> de cada ' +
    'consulta con cada clave, de golpe: la fila $i$, columna $j$ es cuánto encaja la consulta $i$ con ' +
    'la clave $j$.<br><br>El softmax convierte cada fila en pesos que suman uno, y al multiplicar por ' +
    '$V$ cada posición recibe <strong>la media ponderada de todos los valores</strong>. Eso es todo: ' +
    'una media ponderada cuyos pesos se calculan con productos escalares.<br><br>Lo del ' +
    '$\\sqrt{d}$ tiene su motivo, y se ve en la sección siguiente.');

  p.demo({
    title: 'El mapa de atención',
    intro: 'Cinco tokens con vectores pequeños. La rejilla muestra, para cada fila, cuánto peso le da esa posición a cada una de las demás: cuanto más oscuro, más peso. Cada fila suma 1. El interruptor pone la máscara causal.',
    predice: 'Con la máscara causal, una posición sólo puede mirar hacia atrás. ¿Qué aspecto crees que tendrá entonces la rejilla?',
    build: function (host) {
      var n = 5, d = 4;
      var palabras = ['el', 'gato', 'que', 'duerme', 'come'];
      var causal = false, sel = 3;
      var r = U.rng(12);
      var Q = [], K = [], V = [], i, j;
      for (i = 0; i < n; i++) {
        var q = [], k = [], v = [];
        for (j = 0; j < d; j++) { q.push(r.real(-1.2, 1.2, 3)); k.push(r.real(-1.2, 1.2, 3)); v.push(r.real(-1, 1, 3)); }
        Q.push(q); K.push(k); V.push(v);
      }
      function calcula() {
        NN.limpia();
        var salida = NN.atencion(NN.deFilas(Q), NN.deFilas(K), NN.deFilas(V), causal);
        var W = [];
        for (i = 0; i < n; i++) { var f = []; for (j = 0; j < n; j++) f.push(salida.pesos.v[i * n + j]); W.push(f); }
        return { W: W, salida: salida };
      }
      var res = calcula();
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.4, xmax: n + 0.2, ymin: -n - 0.2, ymax: 1.4, height: 300, equal: true,
        axes: false, grid: false,
        aria: 'Rejilla con los pesos de atención de cada posición sobre las demás, más oscuro cuanto mayor el peso',
        draw: function (g) {
          for (i = 0; i < n; i++) {
            g.text(-0.2, -i - 0.5, palabras[i], { size: 12, align: 'right', color: 'ink' });
            g.text(i + 0.5, 0.35, palabras[i], { size: 12, align: 'center', color: 'ink' });
            for (j = 0; j < n; j++) {
              var w = res.W[i][j];
              g.rect(j, -i - 1, 1, 1, { fill: 2, fillAlpha: Math.max(0.03, w), color: 'axis', w: 0.8 });
              if (w > 0.005) g.text(j + 0.5, -i - 0.5, U.fmt(w, 2), { size: 11, align: 'center', color: 'ink' });
            }
          }
          g.rect(0, -sel - 1, n, 1, { color: 3, w: 2.4 });
        }
      });
      function pinta() {
        res = calcula();
        var fila = res.W[sel], suma = 0, mx = 0, arg = 0;
        fila.forEach(function (w, k2) { suma += w; if (w > mx) { mx = w; arg = k2; } });
        out.set('Fila marcada: <strong>«' + palabras[sel] + '»</strong> &nbsp;·&nbsp; ' +
          'sus pesos suman <strong>' + U.fmt(suma, 4) + '</strong><br>' +
          'Mira sobre todo a <strong>«' + palabras[arg] + '»</strong>, con peso ' + U.fmt(mx, 3) + '.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (causal ? 'Con máscara causal la mitad de arriba está a cero: la posición ' + (sel + 1) +
            ' sólo puede mirarse a sí misma y a las anteriores. Es lo que permite entrenar prediciendo el siguiente token sin hacer trampa.'
            : 'Sin máscara, cada posición mira a toda la frase, incluida la parte que viene después. Vale para clasificar un texto entero, pero no para escribirlo.') +
          ' Las filas suman 1 siempre, porque son un softmax.</span>');
        plot.render();
      }
      var f1 = W.row(host);
      W.chips(f1, [{ label: 'sin máscara', value: 'no' }, { label: 'máscara causal', value: 'si' }], {
        value: 'no', on: function (v) { causal = (v === 'si'); pinta(); }
      });
      W.slider(host, { label: 'fila que se mira', min: 0, max: n - 1, step: 1, value: 3, dec: 0, on: function (v) { sel = v; pinta(); } });
      pinta();
    }
  });

  p.note('Fíjate en lo que <em>no</em> hay aquí: ningún bucle sobre la frase. Todos los productos ' +
    'escalares se calculan a la vez con una multiplicación de matrices, y por eso esto corre en una ' +
    'tarjeta gráfica mientras que [[ia-recurrentes|una recurrente]] tiene que ir token a token. Buena ' +
    'parte del éxito de la arquitectura es esa, y no un mérito matemático.', 'ok', 'Todo a la vez');

  /* ---------------------------------------------------------------- */
  p.section('Por qué se divide por la raíz de d');

  p.text('Esa raíz no es un ajuste empírico: sale de una cuenta de varianzas. Si las componentes de ' +
    '$\\vec q$ y $\\vec k$ son independientes con media 0 y varianza 1, su producto escalar es una suma ' +
    'de $d$ términos independientes, así que <strong>su varianza es $d$</strong> y su desviación típica ' +
    '$\\sqrt{d}$.');

  p.formula('\\operatorname{Var}\\!\\left(\\sum_{i=1}^{d} q_i k_i\\right) = \\sum_{i=1}^{d} \\operatorname{Var}(q_i k_i) = d',
    'de dónde sale la raíz',
    'Es [[pe-normal|la suma de varianzas]] de siempre: las varianzas de términos independientes se ' +
    'suman. Con $d$ términos de varianza 1 sale $d$, y por tanto una desviación típica de ' +
    '$\\sqrt{d}$.<br><br>Sin dividir, los productos escalares crecen con la dimensión, el softmax ' +
    'recibe números enormes y <strong>se satura</strong>: uno de los pesos se lleva prácticamente todo ' +
    'y los demás se van a cero. Y donde el softmax está saturado, su derivada es casi nula, así que ' +
    'deja de llegar gradiente.');

  p.demo({
    title: 'Lo que pasa al no dividir',
    intro: 'Una consulta y ocho claves al azar, en dimensión variable. Arriba, los pesos del softmax sin dividir; abajo, dividiendo por la raíz de d. Sube la dimensión y observa el reparto de arriba.',
    predice: 'Al subir la dimensión, los productos escalares se hacen más grandes. ¿Qué le pasará al reparto de pesos del softmax?',
    build: function (host) {
      var d = 64, n = 8;
      function calcula(dim) {
        var r = U.rng(5), q = [], K = [], i, k;
        function nrm() { var u1 = Math.max(1e-9, r.real(0, 1, 6)), u2 = r.real(0, 1, 6); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
        for (k = 0; k < dim; k++) q.push(nrm());
        for (i = 0; i < n; i++) { var f = []; for (k = 0; k < dim; k++) f.push(nrm()); K.push(f); }
        var bruto = K.map(function (f) { var s = 0; for (k = 0; k < dim; k++) s += q[k] * f[k]; return s; });
        function soft(a) {
          var mx = Math.max.apply(null, a), e = a.map(function (z) { return Math.exp(z - mx); });
          var su = e.reduce(function (x, y) { return x + y; }, 0);
          return e.map(function (x) { return x / su; });
        }
        function ent(pp) { var H = 0; pp.forEach(function (x) { if (x > 1e-12) H -= x * Math.log(x) / Math.LN2; }); return H; }
        var sin = soft(bruto), con = soft(bruto.map(function (z) { return z / Math.sqrt(dim); }));
        return { sin: sin, con: con, Hsin: ent(sin), Hcon: ent(con), bruto: bruto };
      }
      var res = calcula(d);
      var out = W.readout(host, '');
      var arriba = W.plot(host, {
        xmin: -0.6, xmax: n - 0.4, ymin: 0, ymax: 1.05, height: 130, xstep: 1, ylabel: 'sin dividir',
        aria: 'Pesos del softmax sin dividir por la raíz de d',
        draw: function (g) { g.bars(res.sin.map(function (w, i) { return { x: i, h: w }; }), { color: 1, width: 0.6 }); }
      });
      var abajo = W.plot(host, {
        xmin: -0.6, xmax: n - 0.4, ymin: 0, ymax: 1.05, height: 130, xstep: 1, ylabel: 'dividiendo',
        aria: 'Pesos del softmax dividiendo por la raíz de d',
        draw: function (g) { g.bars(res.con.map(function (w, i) { return { x: i, h: w }; }), { color: 2, width: 0.6 }); }
      });
      function pinta() {
        res = calcula(d);
        var mxSin = Math.max.apply(null, res.sin), mxCon = Math.max.apply(null, res.con);
        var sd = 0, m = res.bruto.reduce(function (a, b) { return a + b; }, 0) / n;
        res.bruto.forEach(function (z) { sd += (z - m) * (z - m); });
        sd = Math.sqrt(sd / n);
        out.set('Dimensión $d = ' + d + '$, con $\\sqrt{d} = ' + U.fmt(Math.sqrt(d), 2) + '$ &nbsp;·&nbsp; ' +
          'los productos escalares tienen desviación <strong>' + U.fmt(sd, 2) + '</strong><br>' +
          'Sin dividir: el mayor peso se lleva <strong>' + U.fmt(100 * mxSin, 1) + ' %</strong>, entropía ' +
          U.fmt(res.Hsin, 3) + ' bits.<br>' +
          'Dividiendo: el mayor se lleva <strong>' + U.fmt(100 * mxCon, 1) + ' %</strong>, entropía ' +
          U.fmt(res.Hcon, 3) + ' bits &nbsp;<span style="color:var(--ink-faint)">(el máximo con ocho opciones es 3)</span><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (d >= 128 ? 'A esta dimensión, sin dividir el softmax está <strong>completamente saturado</strong>: un peso vale prácticamente 1 y el resto 0. Ahí la derivada del softmax es casi cero y el entrenamiento se para.'
            : (d <= 8 ? 'Con dimensión pequeña apenas se nota la diferencia: por eso el problema no aparece en los ejemplos de juguete y sí en los modelos de verdad.'
              : 'Ya se ve la diferencia: sin dividir, el reparto se concentra mucho más de lo que debería.')) +
          '</span>');
        arriba.render(); abajo.render();
      }
      W.chips(host, [4, 8, 16, 64, 128, 256].map(function (x) { return { label: 'd = ' + x, value: String(x) }; }), {
        value: '64', on: function (v) { d = parseInt(v, 10); pinta(); }
      });
      pinta();
    }
  });

  p.note('Con $d = 256$ y sin dividir, en la medición que trae esta página el peso mayor se lleva el ' +
    '<strong>100 %</strong> y la entropía del reparto cae a <strong>0 bits</strong>, cuando el máximo ' +
    'con ocho opciones es 3. Dividiendo por $\\sqrt{d}$ se queda en torno a 2,3 bits para cualquier ' +
    'dimensión. Una raíz cuadrada bien puesta es la diferencia entre que la cosa entrene o no entrene.',
    'ok', 'La medida, por si queda duda');

  /* ---------------------------------------------------------------- */
  p.section('Varias cabezas');

  p.text('Una sola atención obliga a resumir en un único reparto de pesos todo lo que una palabra ' +
    'necesita mirar. Pero una palabra puede necesitar mirar cosas distintas a la vez: a quién se ' +
    'refiere un pronombre, con qué verbo concuerda, de qué va la frase. La solución es hacer ' +
    '<strong>varias atenciones en paralelo</strong>, cada una con sus propias matrices, y pegar los ' +
    'resultados.');

  p.formula('\\text{MultiCabeza}(X) = \\bigl[\\text{cabeza}_1; \\ldots; \\text{cabeza}_h\\bigr]\\, W_O',
    'varias cabezas, concatenadas',
    'Cada cabeza trabaja en una dimensión más pequeña —si el modelo tiene $d$ y hay $h$ cabezas, cada ' +
    'una usa $d/h$— así que <strong>el coste total es el mismo</strong> que el de una cabeza grande. ' +
    'Lo que cambia es que ahora hay $h$ repartos de atención distintos en vez de uno, y una matriz ' +
    'final $W_O$ que mezcla lo que han traído todas.');

  p.note('Se ha popularizado la idea de que cada cabeza «aprende» una función lingüística concreta —una ' +
    'la sintaxis, otra las referencias—. Al examinarlas se encuentra algo de eso en algunas, y en ' +
    'muchas otras nada interpretable. Conviene quedarse con lo que sí se sostiene: varias cabezas ' +
    'permiten varios repartos simultáneos, y eso funciona mejor que uno solo.',
    'warn', 'Cuidado con la historia bonita');

  /* ---------------------------------------------------------------- */
  p.section('¿Y el orden de las palabras?');

  p.text('Aquí hay un agujero que conviene ver. Si se barajan los tokens de la entrada, todos los ' +
    'productos escalares son los mismos y los pesos también: <strong>la atención no distingue el ' +
    'orden</strong>. «El perro muerde al hombre» y «el hombre muerde al perro» le darían exactamente ' +
    'lo mismo. Hay que meter la posición a mano.');

  p.text('La forma original fue sumar a cada token un vector que depende sólo de su posición, construido ' +
    'con [[tr-funciones|senos y cosenos]] de frecuencias distintas.');

  p.formulas([
    'PE(\\text{pos}, 2i) = \\operatorname{sen}\\!\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right)',
    'PE(\\text{pos}, 2i+1) = \\cos\\!\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right)'
  ], 'codificación posicional con senos');

  p.demo({
    title: 'La huella de cada posición',
    intro: 'Cada fila es la codificación de una posición: componentes pares con senos, impares con cosenos, y frecuencias que bajan de izquierda a derecha. Abajo, el parecido entre dos posiciones según lo lejos que estén.',
    predice: 'Las columnas de la izquierda oscilan deprisa y las de la derecha despacio. ¿Cuáles crees que sirven para distinguir posiciones vecinas, y cuáles para situarse en la frase entera?',
    build: function (host) {
      var d = 32, nPos = 40, sep = 3;
      function PE(pos) {
        var v = [], i;
        for (i = 0; i < d / 2; i++) {
          var w = 1 / Math.pow(10000, 2 * i / d);
          v.push(Math.sin(pos * w)); v.push(Math.cos(pos * w));
        }
        return v;
      }
      function cos(a, b) {
        var s = 0, na = 0, nb = 0;
        for (var k = 0; k < a.length; k++) { s += a[k] * b[k]; na += a[k] * a[k]; nb += b[k] * b[k]; }
        return s / Math.sqrt(na * nb);
      }
      var out = W.readout(host, '');
      var mapa = W.plot(host, {
        xmin: 0, xmax: d, ymin: -18, ymax: 0, height: 200, axes: false, grid: false,
        xlabel: 'componente', aria: 'Mapa de la codificación posicional: cada fila una posición, cada columna una componente',
        draw: function (g) {
          for (var pos = 0; pos < 18; pos++) {
            var v = PE(pos);
            for (var c = 0; c < d; c++) {
              var t = (v[c] + 1) / 2;
              g.rect(c, -pos - 1, 1, 1, { fill: 2, fillAlpha: 0.06 + 0.9 * t, stroke: false });
            }
          }
        }
      });
      var curva = W.plot(host, {
        xmin: 0, xmax: 30, ymin: -0.1, ymax: 1.05, height: 170,
        xlabel: 'separación entre posiciones', ylabel: 'coseno',
        aria: 'Parecido entre dos codificaciones posicionales según su separación',
        draw: function (g) {
          var pts = [];
          for (var k = 0; k <= 30; k++) pts.push([k, cos(PE(10), PE(10 + k))]);
          g.poly(pts, { color: 2, w: 2.4 });
          g.point(sep, cos(PE(10), PE(10 + sep)), { color: 3, r: 5 });
        }
      });
      function pinta() {
        var a = cos(PE(5), PE(5 + sep)), b = cos(PE(20), PE(20 + sep)), c = cos(PE(40), PE(40 + sep));
        out.set('Separación <strong>' + sep + '</strong>:<br>' +
          'entre las posiciones 5 y ' + (5 + sep) + ' &rarr; <strong>' + U.fmt(a, 4) + '</strong> &nbsp;·&nbsp; ' +
          '20 y ' + (20 + sep) + ' &rarr; <strong>' + U.fmt(b, 4) + '</strong> &nbsp;·&nbsp; ' +
          '40 y ' + (40 + sep) + ' &rarr; <strong>' + U.fmt(c, 4) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (Math.abs(a - b) < 0.0005 && Math.abs(b - c) < 0.0005
            ? 'Los tres son <strong>el mismo número</strong>, y ahí está la gracia: el parecido depende de la <em>separación</em>, no de dónde se esté en la frase. Eso es lo que permite a la red representar «tres posiciones más allá» de forma uniforme.'
            : 'Los tres se parecen mucho, aunque estén en sitios distintos de la frase.') +
          ' El parecido baja con la distancia, aunque no de forma perfectamente monótona: con esta $d$, ' +
          'la separación 20 da 0,654 y la 10 daba 0,629.</span>');
        mapa.render(); curva.render();
      }
      W.slider(host, { label: 'separación', min: 0, max: 30, step: 1, value: 3, dec: 0, on: function (v) { sep = v; pinta(); } });
      pinta();
    }
  });

  p.note('La propiedad que justifica los senos es esa: <strong>la misma separación da el mismo ' +
    'parecido</strong> esté donde esté en la frase. Medido con $d = 32$, las parejas 5→8, 20→23 y ' +
    '40→43 dan las tres exactamente <strong>0,7670</strong>. Los modelos actuales usan variantes ' +
    'distintas —posiciones relativas, rotaciones—, pero todas persiguen lo mismo: que lo que importe ' +
    'sea la distancia entre dos tokens y no su número absoluto.', 'ok', 'Lo que hace especiales a los senos');

  /* ---------------------------------------------------------------- */
  p.section('El bloque del transformador');

  p.text('Un transformador apila muchas veces el mismo bloque, y el bloque tiene sólo cuatro piezas, ' +
    'todas ya conocidas.');

  p.table(['Pieza', 'Qué hace', 'De dónde sale'],
    [['Atención multicabeza', 'cada posición mezcla información de las demás', 'lo de esta página'],
     ['Red densa por posición', 'transforma cada posición por separado, con una capa oculta', '[[ia-red|las redes densas]]'],
     ['Conexión residual', 'suma la entrada a la salida de cada pieza', '[[ia-red|el atajo que evita que el gradiente se apague]]'],
     ['Normalización', 'recentra y reescala cada vector antes de cada pieza', 'mantener los números en un rango razonable']]);

  p.text('Y no hay más. La profundidad se consigue apilando ese bloque decenas de veces, y el tamaño ' +
    'creciendo $d$ y el número de cabezas. <strong>No hay ninguna idea nueva por encima de esto</strong>: ' +
    'lo que cambia entre un modelo de juguete y uno enorme es cuántas veces se repite y con cuántos ' +
    'números.');

  p.ejemplo({
    title: 'Una atención de tres tokens, a mano',
    enunciado: 'Tres tokens en dimensión 2. La consulta del tercero es $\\vec q = (1, 1)$, y las claves son $\\vec k_1 = (1, 0)$, $\\vec k_2 = (0, 1)$ y $\\vec k_3 = (1, 1)$. Calcular los pesos de atención del tercer token, con y sin dividir por $\\sqrt{d}$.',
    pasos: [
      { t: '<strong>Los productos escalares.</strong> $\\vec q\\cdot\\vec k_1 = 1$, $\\vec q\\cdot\\vec k_2 = 1$, $\\vec q\\cdot\\vec k_3 = 2$.', antes: 'Multiplica componente a componente y suma, para cada clave.' },
      { t: '<strong>Dividir por $\\sqrt{d}$.</strong> Aquí $d = 2$, así que $\\sqrt{2} = 1{,}414$ y quedan $0{,}707$, $0{,}707$ y $1{,}414$.', antes: '¿Cuánto vale $\\sqrt{d}$ con $d = 2$?' },
      { t: '<strong>El softmax.</strong> $e^{0{,}707} = 2{,}028$ dos veces y $e^{1{,}414} = 4{,}113$. Suman $8{,}169$, así que los pesos son $0{,}248$, $0{,}248$ y $0{,}504$.', antes: 'Exponencia cada uno y divide por la suma.' },
      { t: '<strong>Sin dividir.</strong> $e^1 = 2{,}718$ dos veces y $e^2 = 7{,}389$, que suman $12{,}825$: los pesos serían $0{,}212$, $0{,}212$ y $0{,}576$. Más concentrado.', antes: 'Repite el softmax con 1, 1 y 2.' },
      { t: '<strong>La lectura.</strong> Con $d = 2$ la diferencia es pequeña, pero crece con la dimensión: es exactamente el efecto que mide la demo de arriba. La salida del tercer token sería $0{,}248\\vec v_1 + 0{,}248\\vec v_2 + 0{,}504\\vec v_3$.' }
    ],
    cierre: 'Fíjate en que los pesos suman 1 en los dos casos: eso lo garantiza el softmax, y por eso la salida es siempre una media ponderada de los valores.'
  });

  p.comprueba('¿Por qué la atención necesita que se le añada información de posición?', [
    { t: 'Porque si se barajan los tokens, los productos escalares son los mismos y la salida no cambia', ok: true, por: 'La atención trata la entrada como un conjunto, no como una secuencia: cada peso depende sólo de los dos vectores implicados, no de dónde estén. Sin añadir la posición, «el perro muerde al hombre» y «el hombre muerde al perro» darían lo mismo.' },
    { t: 'Porque el softmax necesita saber cuántos tokens hay', ok: false, por: 'El softmax se adapta a cualquier número de tokens sin problema. El agujero no está en cuántos son, sino en que no se sabe cuál va antes.' },
    { t: 'Porque la máscara causal necesita conocer el orden', ok: false, por: 'La máscara usa el índice de la posición en la matriz, que sí existe. Pero eso sólo impide mirar hacia delante; no le dice al modelo <em>a qué distancia</em> está cada token.' }
  ]);

  p.util('Casi todo lo que hoy se usa con lenguaje —traducir, resumir, responder, programar— es una pila ' +
    'de estos bloques. Y conviene saber una consecuencia práctica de la fórmula: como cada posición se ' +
    'compara con todas, el coste crece con <strong>el cuadrado</strong> de la longitud del texto. ' +
    'Duplicar el contexto cuadruplica el trabajo de la atención. Por eso las ventanas de contexto ' +
    'grandes son caras, y por eso hay tanta investigación en versiones aproximadas que no tengan que ' +
    'calcular la matriz entera.');

  p.hist('La atención se inventó en 2014 para traducción automática, como un parche a las redes ' +
    'recurrentes: Dzmitry Bahdanau, Kyunghyun Cho y Yoshua Bengio propusieron dejar que el decodificador ' +
    'mirase todos los estados del codificador en vez de un único resumen. En 2017 un equipo de Google ' +
    'publicó <em>Attention Is All You Need</em>, cuya tesis era la del título: quitando la recurrencia y ' +
    'dejando sólo la atención, no sólo no se perdía calidad sino que se ganaba, y además se podía ' +
    'entrenar en paralelo. Ese artículo define la arquitectura que sigue usándose hoy.');

  p.trampas([
    { e: 'Creer que la atención «entiende» a qué se refiere cada palabra', por: 'Calcula productos escalares y hace una media ponderada. Que el reparto a veces coincida con lo que un lingüista señalaría no significa que haya comprensión detrás.' },
    { e: 'Olvidar el $\\sqrt{d}$', por: 'Con dimensiones grandes el softmax se satura, un peso se lleva todo y el gradiente desaparece. Medido aquí: entropía 0 bits con $d = 256$.' },
    { e: 'Pensar que varias cabezas cuestan más que una', por: 'Cada cabeza trabaja en $d/h$ dimensiones, así que el total es el mismo. Lo que se gana es tener varios repartos a la vez.' },
    { e: 'Suponer que la atención conoce el orden', por: 'Es invariante a permutaciones. El orden entra por la codificación posicional, que se suma aparte.' },
    { e: 'Ignorar el coste cuadrático', por: 'Cada posición se compara con todas: duplicar la longitud cuadruplica el trabajo. Es la razón de que el contexto largo sea caro.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Pesos de atención',
    level: 'basico',
    gen: function (r) {
      var a = r.int(0, 3), b = r.int(0, 3);
      if (a === b) b = a + 1;
      var ea = Math.exp(a), eb = Math.exp(b);
      return { a: a, b: b, pa: ea / (ea + eb) };
    },
    ask: function (d) {
      return 'Una consulta se compara con dos claves y los productos escalares ya divididos por ' +
        '$\\sqrt{d}$ valen $' + d.a + '$ y $' + d.b + '$. ¿Qué peso de atención recibe la primera? ' +
        '(cuatro decimales)';
    },
    fields: [{ name: 'p', label: 'peso', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.pa, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var sinExp = d.a / (d.a + d.b); return Math.abs(sinExp - d.pa) > 0.00005 && Math.abs(v.p - sinExp) < 0.00005; }, msg: 'Has repartido proporcionalmente sin exponenciar. El softmax exponencia primero, y por eso una diferencia de 1 se convierte en un factor $e$.' }],
    hint: function (d) { return '$e^{' + d.a + '} = ' + U.fmt(Math.exp(d.a), 3) + '$ y $e^{' + d.b + '} = ' + U.fmt(Math.exp(d.b), 3) + '$.'; },
    steps: function (d) {
      return ['$e^{' + d.a + '} = ' + U.fmt(Math.exp(d.a), 3) + '$, $e^{' + d.b + '} = ' + U.fmt(Math.exp(d.b), 3) + '$.',
        'Suma: $' + U.fmt(Math.exp(d.a) + Math.exp(d.b), 3) + '$.',
        'Peso de la primera: $' + U.fmt(Math.exp(d.a), 3) + ' / ' + U.fmt(Math.exp(d.a) + Math.exp(d.b), 3) + ' = ' + U.fmt(d.pa, 4) + '$.',
        'El otro peso es $' + U.fmt(1 - d.pa, 4) + '$, y entre los dos suman 1.'];
    },
    answer: function (d) { return U.fmt(d.pa, 4); }
  });

  p.exercise({
    title: 'La raíz de la dimensión',
    level: 'basico',
    gen: function (r) {
      var d = r.pick([16, 64, 144, 256, 1024]);
      return { d: d, raiz: Math.sqrt(d) };
    },
    ask: function (d) {
      return 'Un modelo con vectores de dimensión $' + d.d + '$. Si las componentes tienen varianza 1, ' +
        '¿cuánto valen la varianza y la desviación típica del producto escalar de dos de ellos?';
    },
    fields: [{ name: 'v', label: 'varianza', w: 'tiny' }, { name: 's', label: 'desviación', w: 'tiny' }],
    sol: function (d) { return { v: d.d, s: d.raiz }; },
    tol: 0.01,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.raiz) < 0.01 && Math.abs(d.raiz - d.d) > 0.01; }, msg: 'Has intercambiado las dos: la varianza es $d$ y la desviación su raíz, no al revés.' }],
    hint: function () { return 'Las varianzas de términos independientes se suman: hay $d$ términos de varianza 1.'; },
    steps: function (d) {
      return ['Varianza: $d = ' + d.d + '$, porque se suman $' + d.d + '$ términos independientes de varianza 1.',
        'Desviación típica: $\\sqrt{' + d.d + '} = ' + U.fmt(d.raiz, 0) + '$.',
        'Y por eso se divide por $\\sqrt{d}$: para devolver los productos escalares a varianza 1 antes del softmax.'];
    },
    answer: function (d) { return d.d + ' y ' + U.fmt(d.raiz, 0); }
  });

  p.exercise({
    title: 'El coste cuadrático',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([512, 1024, 2048, 4096]), k = r.pick([2, 4, 8]);
      return { n: n, k: k, pares: n * n, nuevos: (n * k) * (n * k), factor: k * k };
    },
    ask: function (d) {
      return 'Un modelo procesa ' + U.miles(d.n) + ' tokens de contexto. ¿Cuántos productos escalares ' +
        'calcula una cabeza de atención, y por cuánto se multiplica esa cifra si el contexto se hace ' +
        d.k + ' veces más largo?';
    },
    fields: [{ name: 'p', label: 'productos', w: 'small' }, { name: 'f', label: 'factor', w: 'tiny' }],
    sol: function (d) { return { p: d.pares, f: d.factor }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { return Math.abs(v.f - d.k) < 0.5 && d.k !== d.factor; }, msg: 'El coste no crece como la longitud sino como su cuadrado: si el contexto se multiplica por $k$, el trabajo se multiplica por $k^2$.' }],
    hint: function (d) { return 'Cada uno de los ' + U.miles(d.n) + ' tokens se compara con todos los demás, incluido él mismo.'; },
    steps: function (d) {
      return ['$' + U.miles(d.n) + ' \\times ' + U.miles(d.n) + ' = ' + U.miles(d.pares) + '$ productos escalares.',
        'Con el contexto $' + d.k + '$ veces mayor: $(' + d.k + 'n)^2 = ' + d.k + '^2 n^2$, o sea $' + d.factor + '$ veces más.',
        'Por eso ampliar la ventana de contexto sale tan caro.'];
    },
    answer: function (d) { return U.miles(d.pares) + ' y ' + d.factor; }
  });

  p.exercise({
    title: 'Repartir las cabezas',
    level: 'medio',
    gen: function (r) {
      var d = r.pick([256, 512, 768]), h = r.pick([4, 8, 12, 16]);
      if (d % h !== 0) h = 8;
      return { d: d, h: h, dk: d / h };
    },
    ask: function (d) {
      return 'Un modelo de dimensión $' + d.d + '$ usa $' + d.h + '$ cabezas de atención. ¿Qué dimensión ' +
        'tiene cada cabeza, y cuántos productos escalares por par de tokens se hacen en total, sumando ' +
        'todas las cabezas?';
    },
    fields: [{ name: 'k', label: 'dimensión por cabeza', w: 'tiny' }, { name: 't', label: 'multiplicaciones', w: 'tiny' }],
    sol: function (d) { return { k: d.dk, t: d.d }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { return Math.abs(v.t - d.dk * d.h * d.h) < 0.5 && d.h !== 1; }, msg: 'Cada cabeza hace $d/h$ multiplicaciones por par, y hay $h$ cabezas: el total es $h \\cdot d/h = d$, el mismo que tendría una sola cabeza grande.' }],
    hint: function () { return 'Las cabezas se reparten la dimensión, no la multiplican.'; },
    steps: function (d) {
      return ['Dimensión por cabeza: $' + d.d + ' / ' + d.h + ' = ' + d.dk + '$.',
        'Cada cabeza hace $' + d.dk + '$ multiplicaciones por cada par de tokens, y hay $' + d.h + '$ cabezas.',
        'Total: $' + d.h + ' \\times ' + d.dk + ' = ' + d.d + '$, exactamente lo mismo que una sola cabeza de dimensión $' + d.d + '$.',
        'Por eso varias cabezas salen gratis: lo que cambia es que hay varios repartos en vez de uno.'];
    },
    answer: function (d) { return d.dk + ' y ' + d.d; }
  });

  p.exercise({
    title: 'Qué se rompe si se quita una pieza',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'se quita la codificación posicional', v: 'orden', por: 'La atención es invariante a permutaciones: sin posición, cualquier reordenación de la frase da exactamente la misma salida. El modelo trataría el texto como una bolsa de palabras.' },
        { t: 'se quita la máscara causal al entrenar un modelo que debe escribir texto', v: 'trampa', por: 'Cada posición vería el token que tiene que predecir, así que el entrenamiento sería trivial y el modelo no serviría para generar: al escribir de verdad no hay futuro que mirar.' },
        { t: 'se quita la división por la raíz de d con vectores grandes', v: 'satura', por: 'Los productos escalares tienen desviación típica $\\sqrt{d}$, el softmax se satura, un peso se lleva todo y el gradiente se apaga.' },
        { t: 'se quitan las conexiones residuales de un modelo muy profundo', v: 'gradiente', por: 'Sin el atajo, el gradiente tiene que atravesar decenas de bloques multiplicándose por el camino y se apaga antes de llegar a las primeras capas. Es el mismo problema que ya aparecía en las redes profundas.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un transformador, ' + d.c.t + '. ¿Qué ocurre?'; },
    fields: [{ name: 'q', label: 'Consecuencia', opts: [
      { t: 'el modelo deja de distinguir el orden de las palabras', v: 'orden' },
      { t: 'el entrenamiento hace trampa mirando el futuro', v: 'trampa' },
      { t: 'el softmax se satura y se apaga el gradiente', v: 'satura' },
      { t: 'el gradiente no llega a las primeras capas', v: 'gradiente' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Cada pieza del bloque resuelve un problema concreto. Piensa cuál queda sin resolver en cada caso.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'La atención es una <strong>media ponderada de valores</strong>, con pesos que salen de un softmax de productos escalares entre consultas y claves.',
    'Se divide por $\\sqrt{d}$ porque la varianza de un producto escalar de dimensión $d$ es $d$: sin eso el softmax se satura y el gradiente se apaga.',
    'La máscara causal pone a $-\\infty$ lo que está por delante, y es lo que permite entrenar prediciendo el siguiente token sin hacer trampa.',
    'Varias cabezas dan varios repartos simultáneos y salen gratis, porque cada una trabaja en $d/h$ dimensiones.',
    'La atención no distingue el orden: la posición se añade aparte, y los senos consiguen que la misma separación dé el mismo parecido esté donde esté.',
    'Un transformador es ese bloque —atención, red densa, residual y normalización— repetido muchas veces. No hay ninguna idea nueva por encima.',
    'El coste crece con el <strong>cuadrado</strong> de la longitud: duplicar el contexto cuadruplica el trabajo.'
  ]);
});
