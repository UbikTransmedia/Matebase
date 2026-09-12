/* Tema: Comprimir para generar: autocodificadores y VAE */
Course.topic('ia-autocodificador', function (p) {

  p.puente('De [[av-pca|componentes principales]] viene la idea de comprimir quedándose con las ' +
    'direcciones que más varían; de [[av-informacion|la divergencia KL]], una forma de medir cuánto se ' +
    'parecen dos distribuciones; y de [[pe-normal|tipificar]], la fórmula que aquí se va a usar al ' +
    'revés. Con esas tres piezas sale la primera arquitectura del bloque que no clasifica: ' +
    '<strong>genera</strong>.');

  p.text('Todo lo anterior necesitaba etiquetas: alguien tenía que decir qué era cada dato. Aquí no. La ' +
    'idea es pedirle a una red que <strong>copie su entrada</strong>, lo cual sería trivial —basta con ' +
    'no hacer nada— salvo por un detalle: se la obliga a pasar por un sitio estrecho. Lo que sobreviva ' +
    'a ese estrechamiento es lo que de verdad importaba.');

  /* ---------------------------------------------------------------- */
  p.section('El cuello de botella');

  p.text('La red se parte en dos. El <strong>codificador</strong> lleva el dato a un vector pequeño, el ' +
    '<strong>código</strong>; el <strong>decodificador</strong> intenta reconstruir el original a ' +
    'partir de él. Y la pérdida compara la salida con la entrada.');

  p.formula('L = \\bigl\\Vert \\vec x - g\\bigl(f(\\vec x)\\bigr) \\bigr\\Vert^2',
    'un autocodificador, entero',
    'Se lee: <em>«ele es la norma al cuadrado de equis menos ge de efe de equis»</em>, donde $f$ es el ' +
    'codificador y $g$ el decodificador.<br><br>Fíjate en que <strong>la etiqueta es el propio dato</strong>. ' +
    'No hace falta que nadie clasifique nada: se entrena con datos en bruto, y por eso a esto se le ' +
    'llama aprendizaje autosupervisado. Si el código fuera tan grande como la entrada, la red ' +
    'aprendería a no hacer nada y la pérdida sería cero sin haber aprendido nada. El estrechamiento es ' +
    'lo que la obliga a elegir qué conservar.');

  /* ---------------------------------------------------------------- */
  p.section('Si es lineal, es exactamente PCA');

  p.text('Antes de complicarlo conviene ver el caso más simple: codificador y decodificador sin ninguna ' +
    'activación, o sea dos multiplicaciones por matrices. El resultado es un teorema, y se puede ' +
    'comprobar aquí mismo: <strong>el autocodificador lineal encuentra el mismo subespacio que ' +
    '[[av-pca|las componentes principales]]</strong>, y su error de reconstrucción es exactamente lo ' +
    'que PCA decía que se perdería.');

  p.demo({
    title: 'Entrenarlo y compararlo con el eje de PCA',
    intro: 'Una nube alargada y un autocodificador lineal 2→1→2, que tiene que hacer pasar cada punto por un único número. La recta naranja es la dirección que va aprendiendo; la gris discontinua, la primera componente principal calculada aparte. Entrena y míralas juntarse.',
    predice: 'PCA busca la dirección de máxima varianza; el autocodificador busca minimizar el error al reconstruir. ¿Crees que son el mismo problema o dos distintos que casualmente se parecen?',
    build: function (host) {
      var filas = [], i, r = U.rng(44);
      for (i = 0; i < 200; i++) {
        var a = r.real(-3, 3, 4), b = r.real(-0.5, 0.5, 4);
        filas.push([a * 0.94 - b * 0.34, a * 0.34 + b * 0.94]);
      }
      var mx = 0, my = 0;
      filas.forEach(function (q) { mx += q[0]; my += q[1]; });
      mx /= filas.length; my /= filas.length;
      filas = filas.map(function (q) { return [q[0] - mx, q[1] - my]; });
      /* La primera componente principal, por la via de av-pca. */
      var sxx = 0, syy = 0, sxy = 0;
      filas.forEach(function (q) { sxx += q[0] * q[0]; syy += q[1] * q[1]; sxy += q[0] * q[1]; });
      sxx /= filas.length; syy /= filas.length; sxy /= filas.length;
      var tr = sxx + syy, det = sxx * syy - sxy * sxy;
      var raiz = Math.sqrt(Math.max(0, tr * tr - 4 * det));
      var l1 = (tr + raiz) / 2, l2 = (tr - raiz) / 2;
      var pvx = sxy, pvy = l1 - sxx, pm = Math.sqrt(pvx * pvx + pvy * pvy);
      var pca = [pvx / pm, pvy / pm];

      var X = NN.deFilas(filas);
      var We, Wd, opt, pasos, perdida;
      function reinicia() {
        var rr = U.rng(8);
        We = NN.param([2, 1], rr, 0.5);
        Wd = NN.param([1, 2], rr, 0.5);
        opt = NN.Adam([We, Wd], { lr: 0.05 });
        pasos = 0; perdida = 0;
      }
      reinicia();
      function paso() {
        NN.limpia();
        var L = NN.ecm(NN.mm(NN.mm(X, We), Wd), X);
        NN.atras(L, [We, Wd]);
        opt.paso();
        perdida = L.v[0];
        pasos++;
      }
      function direccion() {
        var m = Math.sqrt(We.v[0] * We.v[0] + We.v[1] * We.v[1]) || 1;
        return [We.v[0] / m, We.v[1] / m];
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3.6, xmax: 3.6, ymin: -2.4, ymax: 2.4, height: 310, equal: true,
        aria: 'Una nube alargada con la dirección que aprende el autocodificador y la primera componente principal',
        draw: function (g) {
          filas.forEach(function (q) { g.point(q[0], q[1], { color: 0, r: 2.6 }); });
          g.seg(-4 * pca[0], -4 * pca[1], 4 * pca[0], 4 * pca[1], { color: 'axis', w: 2.4, dash: [6, 4] });
          var d = direccion();
          g.seg(-4 * d[0], -4 * d[1], 4 * d[0], 4 * d[1], { color: 2, w: 2.6 });
        }
      });
      function pinta() {
        var d = direccion();
        var cos = Math.abs(d[0] * pca[0] + d[1] * pca[1]);
        out.set('Paso ' + pasos + ' &nbsp;·&nbsp; error de reconstrucción <strong>' + U.fmt(perdida, 5) + '</strong><br>' +
          'Dirección aprendida $(' + U.fmt(d[0], 3) + ',\\ ' + U.fmt(d[1], 3) + ')$ &nbsp;·&nbsp; ' +
          'componente principal $(' + U.fmt(pca[0], 3) + ',\\ ' + U.fmt(pca[1], 3) + ')$<br>' +
          '<strong>Coseno entre las dos: ' + U.fmt(cos, 6) + '</strong>' +
          (cos > 0.9999 ? ' <span style="color:var(--ok)">son el mismo eje</span>' : '') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">El autovalor descartado vale ' +
          U.fmt(l2, 5) + ', y la mitad es ' + U.fmt(l2 / 2, 5) + ': ahí es donde tiene que acabar el ' +
          'error, porque se reparte entre las dos coordenadas. ' +
          (pasos === 0 ? 'Todavía sin entrenar.' : (perdida < l2 / 2 * 1.02 ? 'Ya ha llegado.' : 'Sigue bajando hacia ese valor.')) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 4, paso: paso, pinta: pinta, hasta: 800 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      pinta();
    }
  });

  p.note('El signo puede salir del revés —la dirección aprendida puede ser la opuesta— y da exactamente ' +
    'igual: una recta y la misma recta recorrida al revés son el mismo subespacio. Por eso se compara ' +
    'el <strong>valor absoluto</strong> del coseno. Y el error de reconstrucción acaba en la mitad del ' +
    'autovalor descartado, porque ese error se reparte entre las dos coordenadas del punto.',
    'ok', 'El mismo eje, quizá al revés');

  p.text('Con activaciones no lineales el cuello de botella deja de estar limitado a un plano y puede ' +
    'seguir una superficie curva. Por eso a un autocodificador se le llamó durante un tiempo ' +
    '<em>PCA no lineal</em>: hace lo mismo, pero sin obligarse a que lo que conserva sea una recta.');

  /* ---------------------------------------------------------------- */
  p.note('Ese resultado tiene un nombre y un teorema detrás. La mejor compresión lineal posible a $k$ ' +
    'dimensiones es la que dan los $k$ primeros valores singulares, y eso está demostrado en ' +
    '[[av-svd|la descomposición en valores singulares]]: la SVD no es una técnica más, es el techo ' +
    'contra el que choca cualquier autocodificador que no use funciones no lineales. Lo que aporta la ' +
    'no linealidad es pasar de ese techo.', null, 'El techo de lo lineal');

  p.section('El problema de generar');

  p.text('Hasta aquí todo es compresión. La tentación siguiente es obvia: si el decodificador convierte ' +
    'códigos en datos, <strong>¿por qué no inventarse un código y ver qué sale?</strong> Y ahí aparece ' +
    'el problema: el autocodificador solo ha aprendido a decodificar los códigos que él mismo produce. ' +
    'El resto del espacio está lleno de agujeros, y un código inventado suele decodificarse en basura.');

  p.note('Nadie le ha pedido nunca que los códigos estén <em>bien repartidos</em>. Puede dejarlos ' +
    'apelotonados en unos pocos sitios y vacío el resto, y para reconstruir le funciona igual de bien. ' +
    'Si se quiere poder muestrear, hay que pedírselo explícitamente.', 'warn', 'Los agujeros del espacio latente');

  /* ---------------------------------------------------------------- */
  p.section('El VAE: un código que es una distribución');

  p.text('La solución cambia qué produce el codificador. En vez de un punto, produce ' +
    '<strong>una campana</strong>: una media $\\mu$ y una desviación $\\sigma$ para cada componente del ' +
    'código. Después se saca una muestra al azar de esa campana y se decodifica.');

  p.formula('z = \\mu + \\sigma\\,\\varepsilon, \\qquad \\varepsilon \\sim N(0, 1)',
    'la reparametrización: tipificar al revés',
    'Se lee: <em>«zeta es mu más sigma por épsilon, donde épsilon sigue una normal estándar»</em>.<br><br>' +
    'Es literalmente [[pe-normal|la tipificación]] leída de derecha a izquierda: allí se pasaba de una ' +
    'normal cualquiera a la estándar con $z = \\frac{x-\\mu}{\\sigma}$, y aquí se hace el camino ' +
    'inverso.<br><br>Y no es un capricho de notación: es lo que permite entrenar. El azar queda ' +
    'encerrado en $\\varepsilon$, que no depende de los parámetros, así que el gradiente puede pasar ' +
    'por $\\mu$ y por $\\sigma$ como por cualquier otra cuenta. Muestrear directamente de ' +
    '$N(\\mu, \\sigma^2)$ habría cortado la cadena.');

  p.text('Falta la segunda mitad: obligar a que esas campanas llenen el espacio en vez de esconderse en ' +
    'un rincón. Se añade a la pérdida un término que mide cuánto se aleja cada campana de la normal ' +
    'estándar, y ese término ya lo conoces.');

  p.formula('D_{KL}\\bigl(N(\\mu, \\sigma^2)\\,\\Vert\\,N(0,1)\\bigr) = \\tfrac12\\bigl(\\mu^2 + \\sigma^2 - 1 - \\ln \\sigma^2\\bigr)',
    'el precio de alejarse de la normal estándar',
    'Es [[av-informacion|la divergencia KL]] entre dos normales, que tiene fórmula cerrada.<br><br>Vale ' +
    '<strong>cero exactamente cuando $\\mu = 0$ y $\\sigma = 1$</strong>, y crece en cuanto la campana ' +
    'se desplaza o se estrecha. Sumarla a la pérdida crea una tensión muy sana: la reconstrucción ' +
    'quiere códigos precisos y separados, y la KL los quiere centrados y anchos. El equilibrio es un ' +
    'espacio latente <strong>sin agujeros</strong>, del que se puede muestrear al azar y obtener algo ' +
    'con sentido.');

  p.demo({
    title: 'Las dos fuerzas del VAE',
    intro: 'Una campana del código, con su media y su desviación. La curva gris es la normal estándar a la que la KL tira. Mueve los dos mandos y mira el precio: es cero solo en el centro y con anchura uno.',
    predice: 'La KL castiga alejarse de $N(0,1)$. ¿Qué crees que sale más caro: desplazar la campana una unidad, o estrecharla hasta la mitad?',
    build: function (host) {
      var mu = 1.2, sg = 0.5;
      function kl(m, s) { return 0.5 * (m * m + s * s - 1 - 2 * Math.log(s)); }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -0.05, ymax: 1.1, height: 270,
        xlabel: 'z', ylabel: 'densidad',
        aria: 'La campana del código comparada con la normal estándar a la que la divergencia KL la empuja',
        draw: function (g) {
          g.fn(function (x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }, { color: 'axis', w: 2.2, dash: [6, 4] });
          g.fn(function (x) {
            var t = (x - mu) / sg;
            return Math.exp(-t * t / 2) / (sg * Math.sqrt(2 * Math.PI));
          }, { color: 2, w: 2.6 });
          g.vline(mu, { color: 2, w: 1.2, dash: [3, 3] });
        }
      });
      function pinta() {
        var k = kl(mu, sg);
        out.set('$\\mu = ' + U.fmt(mu, 2) + '$, $\\sigma = ' + U.fmt(sg, 2) + '$ &nbsp;·&nbsp; ' +
          '<strong>KL = ' + U.fmt(k, 4) + '</strong><br>' +
          'Desglose: $\\tfrac12(' + U.fmt(mu * mu, 3) + ' + ' + U.fmt(sg * sg, 3) + ' - 1 - ' + U.fmt(2 * Math.log(sg), 3) + ')$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (k < 0.01 ? 'Prácticamente cero: la campana ya es la normal estándar, que es justo a donde tira este término.'
            : (sg < 0.4 ? 'El término $-\\ln\\sigma^2$ se dispara cuando la campana se estrecha: un código demasiado preciso sale caro, y esa es la tensión con la reconstrucción.'
              : 'Alejarse del centro cuesta $\\mu^2/2$, que crece deprisa. Por eso los códigos acaban repartidos alrededor del origen.')) +
          '</span>');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'media μ', min: -2.5, max: 2.5, step: 0.05, value: 1.2, dec: 2, on: function (v) { mu = v; pinta(); } });
      W.slider(fila, { label: 'desviación σ', min: 0.15, max: 2.5, step: 0.05, value: 0.5, dec: 2, on: function (v) { sg = v; pinta(); } });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Una muestra y su precio',
    enunciado: 'El codificador devuelve $\\mu = 0{,}8$ y $\\sigma = 0{,}5$ para un dato. Se saca $\\varepsilon = -1{,}4$ de la normal estándar. Calcular el código, la divergencia KL de esa campana, y compararla con la de $\\mu = 0$, $\\sigma = 1$.',
    pasos: [
      { t: '<strong>El código.</strong> $z = \\mu + \\sigma\\varepsilon = 0{,}8 + 0{,}5\\cdot(-1{,}4) = 0{,}8 - 0{,}7 = 0{,}1$.', antes: 'Sustituye en $z = \\mu + \\sigma\\varepsilon$.' },
      { t: '<strong>Por qué así y no muestreando directamente.</strong> El azar está en $\\varepsilon$, que no depende de $\\mu$ ni de $\\sigma$. Así $\\frac{\\partial z}{\\partial \\mu} = 1$ y $\\frac{\\partial z}{\\partial \\sigma} = \\varepsilon$: la cadena no se corta y el gradiente llega al codificador.', antes: '¿Cuánto vale la derivada de $z$ respecto de $\\mu$?' },
      { t: '<strong>La divergencia.</strong> $\\tfrac12(\\mu^2 + \\sigma^2 - 1 - \\ln\\sigma^2) = \\tfrac12(0{,}64 + 0{,}25 - 1 - \\ln 0{,}25)$. Y $\\ln 0{,}25 = -1{,}386$, así que queda $\\tfrac12(0{,}64 + 0{,}25 - 1 + 1{,}386) = \\tfrac12(1{,}276) = 0{,}638$.', antes: 'Cuidado con el signo: se resta $\\ln\\sigma^2$, que aquí es negativo.' },
      { t: '<strong>El caso de referencia.</strong> Con $\\mu = 0$ y $\\sigma = 1$: $\\tfrac12(0 + 1 - 1 - \\ln 1) = 0$. Es el único punto en el que el término no cuesta nada.', antes: 'Sustituye $\\mu = 0$ y $\\sigma = 1$.' },
      { t: '<strong>Qué está pagando.</strong> De los $0{,}638$, una parte viene de estar desplazado ($\\mu^2/2 = 0{,}32$) y el resto de ser demasiado estrecho. Si la red quiere códigos más precisos, tendrá que compensarlo reconstruyendo mejor.' }
    ],
    cierre: 'Ese tira y afloja es todo el VAE: la reconstrucción empuja hacia códigos afilados y separados, la KL hacia campanas anchas y centradas, y del equilibrio sale un espacio del que se puede muestrear.'
  });

  p.comprueba('¿Por qué no se muestrea directamente de $N(\\mu, \\sigma^2)$ en vez de escribir $z = \\mu + \\sigma\\varepsilon$?', [
    { t: 'Porque entonces el gradiente no podría pasar hacia el codificador: el azar estaría entre medias', ok: true, por: 'Sacar una muestra no es una operación derivable respecto de los parámetros de la distribución. Al escribirlo como $\\mu + \\sigma\\varepsilon$, el azar queda en un factor que no depende de nada aprendible y la regla de la cadena funciona con normalidad.' },
    { t: 'Porque son distribuciones distintas', ok: false, por: 'Son exactamente la misma: si $\\varepsilon \\sim N(0,1)$, entonces $\\mu + \\sigma\\varepsilon \\sim N(\\mu, \\sigma^2)$. Lo que cambia no es el resultado, es que se pueda derivar.' },
    { t: 'Porque muestrear es más lento', ok: false, por: 'Cuesta lo mismo: en los dos casos hay que generar un número al azar. La diferencia es dónde queda ese azar respecto de los parámetros.' }
  ]);

  p.util('El uso más visible de los autocodificadores no es generar sino <strong>comprimir con sentido</strong>: ' +
    'los sistemas que buscan imágenes o documentos parecidos guardan el código de cada elemento y ' +
    'comparan códigos, que son mucho más pequeños que los datos. También se usan para detectar ' +
    'anomalías, con un truco elegante: se entrena solo con ejemplos normales, y cuando llega algo raro ' +
    'el autocodificador lo reconstruye mal, así que un error de reconstrucción alto es la alarma. Así ' +
    'se vigilan motores industriales y transacciones bancarias. Y la parte del VAE que se ha quedado ' +
    'para siempre es la idea de un espacio latente continuo del que se puede muestrear, que es lo que ' +
    'usan después los modelos de difusión.');

  p.hist('La versión no lineal la propuso Mark Kramer en 1991, en una revista de ingeniería química, ' +
    'llamándola directamente análisis de componentes principales no lineal. En 2006 Geoffrey Hinton y ' +
    'Ruslan Salakhutdinov publicaron en <em>Science</em> un artículo mostrando que un autocodificador ' +
    'profundo comprimía mucho mejor que PCA, y fue uno de los trabajos que reactivaron el interés por ' +
    'las redes profundas. El VAE es de 2013, de Diederik Kingma y Max Welling —el mismo Kingma que dos ' +
    'años después firmaría Adam—, y su aportación fue justamente la reparametrización: hasta entonces ' +
    'no se sabía cómo entrenar por gradiente algo que tuviera un muestreo en medio.');

  p.trampas([
    { e: 'Poner el código tan grande como la entrada', por: 'Sin estrechamiento, la red aprende la identidad: error cero y nada aprendido. El cuello de botella es lo que la obliga a elegir.' },
    { e: 'Esperar que un autocodificador normal sirva para generar', por: 'Solo sabe decodificar los códigos que él produce. Un código inventado cae en un agujero del espacio latente y sale basura.' },
    { e: 'Muestrear dentro del grafo sin reparametrizar', por: 'Se corta la cadena y el codificador deja de recibir gradiente. Hay que sacar el azar fuera, a $\\varepsilon$.' },
    { e: 'Quitar el término KL para reconstruir mejor', por: 'Se reconstruye mejor, sí, y el espacio latente vuelve a llenarse de agujeros: se pierde justo lo que se quería.' },
    { e: 'Comparar direcciones sin valor absoluto', por: 'El autocodificador lineal puede encontrar el eje de PCA recorrido al revés. Es el mismo subespacio, y el coseno sale $-1$ en vez de $+1$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánto se comprime',
    level: 'basico',
    gen: function (r) {
      var lado = r.pick([8, 16, 28, 32]), k = r.pick([2, 4, 8, 16]);
      return { lado: lado, n: lado * lado, k: k, razon: lado * lado / k };
    },
    ask: function (d) {
      return 'Un autocodificador recibe imágenes de $' + d.lado + '\\times' + d.lado + '$ en blanco y ' +
        'negro y su código tiene $' + d.k + '$ números. ¿Cuántos números entran, y cuántas veces más ' +
        'pequeño es el código?';
    },
    fields: [{ name: 'n', label: 'números de entrada', w: 'tiny' }, { name: 'r', label: 'veces menor', w: 'tiny' }],
    sol: function (d) { return { n: d.n, r: d.razon }; },
    hint: function () { return 'La entrada tiene un número por píxel. La razón es esa cantidad dividida por el tamaño del código.'; },
    steps: function (d) {
      return ['Entrada: $' + d.lado + ' \\times ' + d.lado + ' = ' + d.n + '$ números.',
        'Razón: $' + d.n + ' / ' + d.k + ' = ' + d.razon + '$.',
        'Y la red tiene que apañárselas para reconstruir los ' + d.n + ' a partir de esos ' + d.k + '.'];
    },
    answer: function (d) { return d.n + ' números, ' + d.razon + ' veces menor'; }
  });

  p.exercise({
    title: 'Reparametrizar una muestra',
    level: 'basico',
    gen: function (r) {
      var mu = r.real(-2, 2, 1), sg = r.pick([0.2, 0.5, 1, 1.5, 2]), e = r.real(-2, 2, 1);
      return { mu: mu, sg: sg, e: e, z: mu + sg * e };
    },
    ask: function (d) {
      return 'El codificador da $\\mu = ' + U.fmt(d.mu, 1) + '$ y $\\sigma = ' + U.fmt(d.sg, 1) +
        '$, y de la normal estándar sale $\\varepsilon = ' + U.fmt(d.e, 1) + '$. ¿Cuánto vale el código ' +
        '$z$? (dos decimales)';
    },
    fields: [{ name: 'z', label: 'z', w: 'tiny' }],
    sol: function (d) { return { z: U.round(d.z, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { var mal = (d.mu + d.e) / d.sg; return Math.abs(mal - d.z) > 0.005 && Math.abs(v.z - mal) < 0.005; }, msg: 'Eso se parece a tipificar hacia delante. Aquí se va al revés: se <em>multiplica</em> por $\\sigma$ y se <em>suma</em> $\\mu$.' }],
    hint: function () { return '$z = \\mu + \\sigma\\varepsilon$: la tipificación al revés.'; },
    steps: function (d) {
      return ['$z = ' + U.fmt(d.mu, 1) + ' + ' + U.fmt(d.sg, 1) + ' \\times (' + U.fmt(d.e, 1) + ') = ' + U.fmt(d.z, 2) + '$',
        'El azar está solo en $\\varepsilon$, así que el gradiente puede atravesar $\\mu$ y $\\sigma$ sin problema.'];
    },
    answer: function (d) { return U.fmt(d.z, 2); }
  });

  p.exercise({
    title: 'El precio de la campana',
    level: 'medio',
    gen: function (r) {
      var mu = r.pick([0, 0.5, 1, 1.5, 2]), sg = r.pick([0.25, 0.5, 1, 1.5, 2]);
      var kl = 0.5 * (mu * mu + sg * sg - 1 - 2 * Math.log(sg));
      return { mu: mu, sg: sg, kl: kl };
    },
    ask: function (d) {
      return 'Calcula $D_{KL}$ entre $N(' + U.fmt(d.mu, 1) + ',\\ ' + U.fmt(d.sg * d.sg, 2) + ')$ y la ' +
        'normal estándar, con $\\tfrac12(\\mu^2 + \\sigma^2 - 1 - \\ln\\sigma^2)$ y $\\sigma = ' +
        U.fmt(d.sg, 2) + '$. (cuatro decimales)';
    },
    fields: [{ name: 'k', label: 'KL', w: 'tiny' }],
    sol: function (d) { return { k: U.round(d.kl, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var sinLog = 0.5 * (d.mu * d.mu + d.sg * d.sg - 1); return Math.abs(sinLog - d.kl) > 0.0005 && Math.abs(v.k - sinLog) < 0.0005; }, msg: 'Falta el término $-\\ln\\sigma^2$, que es el que castiga que la campana sea demasiado estrecha.' }],
    hint: function (d) { return '$\\ln\\sigma^2 = 2\\ln\\sigma = ' + U.fmt(2 * Math.log(d.sg), 4) + '$. Ojo con el signo cuando $\\sigma < 1$.'; },
    steps: function (d) {
      return ['$\\mu^2 = ' + U.fmt(d.mu * d.mu, 4) + '$, $\\sigma^2 = ' + U.fmt(d.sg * d.sg, 4) + '$, $\\ln\\sigma^2 = ' + U.fmt(2 * Math.log(d.sg), 4) + '$.',
        '$\\tfrac12(' + U.fmt(d.mu * d.mu, 4) + ' + ' + U.fmt(d.sg * d.sg, 4) + ' - 1 - (' + U.fmt(2 * Math.log(d.sg), 4) + ')) = ' + U.fmt(d.kl, 4) + '$',
        d.mu === 0 && d.sg === 1 ? 'Es el único caso en que vale cero: la campana ya es la normal estándar.'
          : 'Cualquier desviación del centro o de la anchura uno se paga.'];
    },
    answer: function (d) { return U.fmt(d.kl, 4); }
  });

  p.exercise({
    title: 'Lo que se pierde al comprimir',
    level: 'medio',
    gen: function (r) {
      var l1 = r.int(6, 20), l2 = r.int(1, 5), l3 = r.int(1, 4);
      if (l3 > l2) { var t = l2; l2 = l3; l3 = t; }
      return { l: [l1, l2, l3], guardadas: r.pick([1, 2]), total: l1 + l2 + l3 };
    },
    ask: function (d) {
      var desc = d.guardadas === 1 ? (d.l[1] + d.l[2]) : d.l[2];
      return 'Los autovalores de la covarianza de unos datos de tres dimensiones son $' + d.l.join('$, $') +
        '$. Un autocodificador lineal guarda $' + d.guardadas + '$ componente' + (d.guardadas > 1 ? 's' : '') +
        '. ¿Cuánta varianza se pierde, y qué porcentaje del total es?' +
        ' (un decimal el porcentaje)';
    },
    fields: [{ name: 'p', label: 'varianza perdida', w: 'tiny' }, { name: 'q', label: '% del total', w: 'tiny' }],
    sol: function (d) {
      var desc = d.guardadas === 1 ? (d.l[1] + d.l[2]) : d.l[2];
      return { p: desc, q: U.round(100 * desc / d.total, 6) };
    },
    dec: { q: 1 },
    tol: 1e-6,
    hint: function () { return 'Se pierden los autovalores que no se guardan, y son los más pequeños porque se ordenan de mayor a menor.'; },
    steps: function (d) {
      var desc = d.guardadas === 1 ? (d.l[1] + d.l[2]) : d.l[2];
      return ['Se descartan ' + (d.guardadas === 1 ? 'los dos menores: $' + d.l[1] + ' + ' + d.l[2] + ' = ' + desc + '$.' : 'el menor: $' + desc + '$.'),
        'Total: $' + d.l.join(' + ') + ' = ' + d.total + '$.',
        'Porcentaje: $' + U.fmt(100 * desc / d.total, 1) + '\\,\\%$.',
        'Eso es exactamente lo que el autocodificador lineal no podrá reconstruir, por bien que se entrene.'];
    },
    answer: function (d) { var desc = d.guardadas === 1 ? (d.l[1] + d.l[2]) : d.l[2]; return desc + ', el ' + U.fmt(100 * desc / d.total, 1) + ' %'; }
  });

  p.exercise({
    title: 'Subir y bajar el peso de la KL',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'se quita el término KL del todo', v: 'agujeros', por: 'Sin él es un autocodificador normal: reconstruye mejor, y el espacio latente vuelve a llenarse de agujeros, así que muestrear da basura.' },
        { t: 'se multiplica el término KL por cien', v: 'borroso', por: 'La KL aplasta todas las campanas contra $N(0,1)$: los códigos dejan de distinguir unos datos de otros y el decodificador produce siempre casi lo mismo, borroso y promedio.' },
        { t: 'se deja el término KL con su peso normal', v: 'equilibrio', por: 'Es el equilibrio que busca el método: códigos lo bastante precisos para reconstruir y lo bastante repartidos para poder muestrear.' },
        { t: 'se pone el término KL a un peso diminuto, casi cero', v: 'agujeros', por: 'Casi como quitarlo: la reconstrucción manda, los códigos se apelotonan donde les conviene y el espacio deja de ser muestreable.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un VAE, ' + d.c.t + '. ¿Qué pasa?'; },
    fields: [{ name: 'q', label: 'Resultado', opts: [
      { t: 'espacio latente con agujeros: no se puede muestrear', v: 'agujeros' },
      { t: 'salidas borrosas y todas parecidas', v: 'borroso' },
      { t: 'el equilibrio que se busca', v: 'equilibrio' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Son dos fuerzas opuestas: la reconstrucción quiere códigos precisos y separados, y la KL los quiere centrados y anchos. Piensa qué pasa si una gana del todo.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Un autocodificador copia su entrada pasando por un cuello de botella: la etiqueta es el propio dato, así que no hace falta que nadie etiquete nada.',
    'Si es lineal, encuentra el mismo subespacio que PCA, y su error de reconstrucción es la varianza descartada.',
    'Con activaciones no lineales el cuello de botella puede seguir una superficie curva: es PCA sin obligarse a que sea un plano.',
    'Un autocodificador normal no sirve para generar: solo sabe decodificar los códigos que él produce, y el resto del espacio tiene agujeros.',
    'El VAE codifica una campana en vez de un punto, y muestrea con $z = \\mu + \\sigma\\varepsilon$, que es tipificar al revés y deja pasar el gradiente.',
    'El término KL empuja las campanas hacia $N(0,1)$: en tensión con la reconstrucción, produce un espacio latente sin agujeros del que se puede muestrear.'
  ]);
});
