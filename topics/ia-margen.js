/* Tema: La frontera con mas margen */
Course.topic('ia-margen', function (p) {

  p.puente('El [[cib-neurona|perceptrón]] encontraba <em>una</em> recta que separase dos clases, y ' +
    'paraba en la primera que le servía. Pero si hay una, hay infinitas, y no todas son igual de ' +
    'buenas. Este tema pide <strong>la mejor</strong>, y para definir «mejor» hace falta la ' +
    '[[ge-rectas|distancia de un punto a una recta]]. El resto es un problema de ' +
    '[[al-inecuaciones|inecuaciones]] y, al final, un producto escalar de [[av-espacios|un espacio]] ' +
    'mucho más grande.');

  p.text('Imagina dos nubes de puntos que se pueden separar con una recta. Traza una que pase rozando ' +
    'una de las nubes: separa, sí, pero un punto nuevo que caiga un pelo más allá se clasificará mal. ' +
    'Ahora traza la que deja <strong>el pasillo más ancho posible</strong> entre las dos nubes. Esa es ' +
    'la idea entera del tema, y resulta que se puede calcular exactamente.');

  /* ---------------------------------------------------------------- */
  p.section('El margen es una distancia punto-recta');

  p.text('Una recta en el plano se escribe $w_1x_1 + w_2x_2 + b = 0$, o abreviando con un producto ' +
    'escalar, $\\vec w \\cdot \\vec x + b = 0$. El vector $\\vec w$ es perpendicular a ella, y la ' +
    'distancia de un punto a la recta es la de siempre.');

  p.formula('d(\\vec x) = \\frac{\\left|\\vec w \\cdot \\vec x + b\\right|}{\\left\\Vert\\vec w\\right\\Vert}',
    'distancia de un punto a la frontera',
    'Se lee: <em>«de de equis es el valor absoluto de doble uve escalar equis más be, partido por la ' +
    'norma de doble uve»</em>.<br><br>Es exactamente la fórmula de la distancia punto-recta de ' +
    'geometría, escrita con vectores para que valga igual en dos dimensiones que en quinientas. El ' +
    'numerador dice de qué lado cae el punto y cuánto; dividir por $\\Vert\\vec w\\Vert$ convierte ese ' +
    '«cuánto» en una distancia de verdad.<br><br>El <strong>margen</strong> es la distancia del punto ' +
    '<em>más cercano</em> a la frontera. Lo que se busca es la recta que lo hace máximo.');

  p.demo({
    title: 'Buscar el pasillo más ancho',
    intro: 'Dos nubes separables. Gira la frontera y mira el ancho del pasillo que deja: las dos rectas de puntos son los bordes del pasillo, y los puntos que los tocan son los que lo sostienen. El botón busca la orientación óptima probándolas todas.',
    predice: 'De todas las rectas que separan las dos nubes, la mejor deja el pasillo más ancho. ¿Crees que ese pasillo tocará muchos puntos de cada nube, o muy pocos?',
    build: function (host) {
      var ang = 20, lejano = 0;
      var base = [], i;
      (function () {
        var r = U.rng(29);
        for (i = 0; i < 18; i++) base.push({ x: r.real(-2.6, 0.2, 3), y: r.real(-1.9, 1.1, 3), c: 0 });
        for (i = 0; i < 18; i++) base.push({ x: r.real(0.9, 3.4, 3), y: r.real(-0.6, 2.2, 3), c: 1 });
      })();
      function datos() {
        var d = base.map(function (q) { return { x: q.x, y: q.y, c: q.c }; });
        d[0].x = -2.6 - lejano;          // un punto del interior, que se aleja
        d[0].y = -1.8;
        return d;
      }
      /* Margen para una direccion dada: se proyecta todo sobre ella y se
         mide el hueco entre la clase 0 y la clase 1. Con |w| = 1, el ancho
         del pasillo es ese hueco. */
      function hueco(th, D) {
        var c = Math.cos(th), s = Math.sin(th), max0 = -Infinity, min1 = Infinity, s0 = null, s1 = null;
        D.forEach(function (q) {
          var t = q.x * c + q.y * s;
          if (q.c === 0) { if (t > max0) { max0 = t; s0 = q; } }
          else { if (t < min1) { min1 = t; s1 = q; } }
        });
        return { ancho: min1 - max0, corte: (min1 + max0) / 2, max0: max0, min1: min1, s0: s0, s1: s1 };
      }
      function mejorAngulo(D) {
        var mejor = -Infinity, th = 0, a;
        for (a = 0; a < 180; a += 0.25) {
          var h = hueco(a * Math.PI / 180, D);
          if (h.ancho > mejor) { mejor = h.ancho; th = a; }
        }
        return th;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4.4, xmax: 4.4, ymin: -3, ymax: 3, height: 330, equal: true,
        aria: 'Dos nubes de puntos separables y la frontera elegida, con las dos rectas que marcan el ancho del pasillo',
        draw: function (g) {
          var D = datos(), th = ang * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
          var h = hueco(th, D);
          function recta(t, o) { g.seg(t * c - 8 * s, t * s + 8 * c, t * c + 8 * s, t * s - 8 * c, o); }
          if (h.ancho > 0) {
            recta(h.max0, { color: 'axis', w: 1.4, dash: [5, 4] });
            recta(h.min1, { color: 'axis', w: 1.4, dash: [5, 4] });
          }
          recta(h.corte, { color: 2, w: 2.6 });
          D.forEach(function (q) {
            var sop = (q === h.s0 || q === h.s1) && h.ancho > 0;
            if (sop) g.point(q.x, q.y, { color: 4, r: 9, hollow: true });
            g.point(q.x, q.y, { color: q.c ? 1 : 0, r: 4 });
          });
        }
      });
      function pinta() {
        var D = datos(), h = hueco(ang * Math.PI / 180, D);
        var opt = mejorAngulo(D), hOpt = hueco(opt * Math.PI / 180, D);
        out.set('Ángulo de la frontera: ' + U.fmt(ang, 1) + '° &nbsp;·&nbsp; ancho del pasillo: <strong>' +
          (h.ancho > 0 ? U.fmt(h.ancho, 3) : '<span style="color:var(--bad)">no separa</span>') + '</strong><br>' +
          'El mejor posible es ' + U.fmt(hOpt.ancho, 3) + ', en ' + U.fmt(opt, 1) + '°.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (h.ancho > 0
            ? 'Los puntos con anillo son los que tocan el borde del pasillo: son los <strong>vectores soporte</strong>, y son los únicos que la sostienen.'
            : 'Con esta orientación las dos nubes se solapan al proyectarlas: no hay pasillo.') +
          '</span>');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'ángulo de la frontera', min: 0, max: 179, step: 0.5, value: 20, dec: 1, on: function (v) { ang = v; pinta(); } });
      W.slider(fila, { label: 'alejar un punto del interior', min: 0, max: 3, step: 0.1, value: 0, dec: 1, on: function (v) { lejano = v; pinta(); } });
      W.buttons(host, [{ t: 'Poner la de máximo margen', cls: 'btn--main', on: function () { ang = mejorAngulo(datos()); pinta(); } }]);
      pinta();
    }
  });

  p.text('Prueba el segundo mando: aleja todo lo que quieras un punto del interior de su nube. ' +
    '<strong>La frontera óptima no se mueve.</strong> Solo mandan los puntos que tocan el borde del ' +
    'pasillo, y a esos se les llama <strong>vectores soporte</strong>. Es una propiedad notable: el ' +
    'modelo final depende de un puñado de ejemplos y se puede tirar el resto.');

  /* ---------------------------------------------------------------- */
  p.section('Maximizar el margen es minimizar $\\Vert\\vec w\\Vert$');

  p.text('Hay un detalle molesto: multiplicar $\\vec w$ y $b$ por diez da <em>la misma recta</em> pero ' +
    'todos los números cambian. Para quitar esa ambigüedad se fija la escala pidiendo que los puntos ' +
    'más cercanos den exactamente $\\pm 1$. Con esa convención, todo se simplifica de golpe.');

  p.formulas([
    'y_i\\left(\\vec w \\cdot \\vec x_i + b\\right) \\ge 1 \\quad \\text{para todos los puntos}',
    '\\text{margen} = \\frac{1}{\\Vert\\vec w\\Vert}, \\qquad \\text{ancho del pasillo} = \\frac{2}{\\Vert\\vec w\\Vert}'
  ], 'el problema, en dos líneas',
    'La primera se lee: <em>«i griega sub i por, doble uve escalar equis sub i más be, mayor o igual ' +
    'que uno»</em>. Las etiquetas son $y_i = +1$ y $y_i = -1$, y multiplicar por ellas convierte «cada ' +
    'clase a su lado» en <strong>una sola familia de inecuaciones</strong>, de las de ' +
    '[[al-inecuaciones|inecuaciones]].<br><br>La segunda dice lo importante: con esa escala, el margen ' +
    'es $1/\\Vert\\vec w\\Vert$. Así que <strong>hacer el margen máximo es hacer $\\Vert\\vec w\\Vert$ mínimo</strong>, ' +
    'cumpliendo todas las inecuaciones. Se ha convertido un problema geométrico en uno de ' +
    'minimización con restricciones, que es justo lo que resuelven ' +
    '[[av-lagrange|los multiplicadores de Lagrange]].');

  p.ejemplo({
    title: 'La recta de máximo margen, a mano',
    enunciado: 'Cuatro puntos: $(0,0)$ y $(2,0)$ de la clase $-1$, y $(0,4)$ y $(2,4)$ de la clase $+1$. Hallar la frontera de máximo margen, su $\\vec w$ normalizado y el ancho del pasillo.',
    pasos: [
      { t: '<strong>Por simetría.</strong> Las dos nubes son dos segmentos horizontales, uno en $y = 0$ y otro en $y = 4$. La frontera que más se aleja de los dos es la horizontal de en medio: $y = 2$.', antes: '¿Qué recta deja a los cuatro puntos lo más lejos posible?' },
      { t: '<strong>Escribirla en forma vectorial.</strong> $y - 2 = 0$ es $\\vec w \\cdot \\vec x + b = 0$ con $\\vec w = (0, 1)$ y $b = -2$.', antes: 'Pasa $y = 2$ a la forma $w_1x + w_2y + b = 0$.' },
      { t: '<strong>Comprobar la escala.</strong> En $(0,4)$: $\\vec w\\cdot\\vec x + b = 4 - 2 = 2$, y su etiqueta es $+1$. En $(0,0)$: $0 - 2 = -2$, con etiqueta $-1$. El producto $y_i(\\ldots)$ vale 2, no 1: la escala no es la convenida.', antes: 'Sustituye un punto de cada clase. ¿Sale $\\pm 1$?' },
      { t: '<strong>Normalizar.</strong> Se divide todo entre 2: $\\vec w = (0,\\ 0{,}5)$ y $b = -1$. Ahora sí, cada punto da exactamente $\\pm 1$.', antes: 'Divide $\\vec w$ y $b$ por 2 y vuelve a comprobar.' },
      { t: '<strong>El margen.</strong> $\\Vert\\vec w\\Vert = 0{,}5$, así que el margen es $1/0{,}5 = 2$ y el pasillo mide $4$. Y se comprueba a ojo: de $y = 0$ a $y = 2$ hay 2, y de $y=2$ a $y=4$, otros 2.' }
    ],
    cierre: 'Los cuatro puntos son vectores soporte, porque los cuatro tocan el borde. Si añadiéramos un quinto punto de clase $-1$ en $(1, -5)$, la recta no se movería ni un milímetro.'
  });

  p.comprueba('Se entrena una frontera de máximo margen y después se borran todos los ejemplos menos los vectores soporte. ¿Qué pasa al reentrenar?', [
    { t: 'Sale exactamente la misma frontera', ok: true, por: 'La solución solo depende de los puntos que tocan el borde del pasillo. Los demás cumplen la inecuación con holgura y no intervienen: se pueden tirar sin que cambie nada.' },
    { t: 'Sale una frontera peor, porque hay muchos menos datos', ok: false, por: 'Menos datos suele ser peor, pero aquí no: los que se han quitado no estaban influyendo. Es lo que hace tan compacto a este modelo.' },
    { t: 'No se puede reentrenar con tan pocos puntos', ok: false, por: 'Basta con que haya puntos de las dos clases. En el ejemplo resuelto, con cuatro puntos ya está determinada la recta.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Cuando ninguna recta sirve: subir de dimensión');

  p.text('Todo lo anterior supone que existe una recta que separa. Muchas veces no existe, y el caso más ' +
    'claro es una nube dentro de otra: ninguna recta del plano deja los círculos interiores a un lado ' +
    'y los exteriores al otro. La salida es tan sencilla como sorprendente: <strong>añadir una ' +
    'coordenada</strong>.');

  p.demo({
    title: 'Un círculo es un plano visto desde arriba',
    intro: 'A cada punto del plano se le añade una tercera coordenada, $z = x^2 + y^2$, que es su distancia al origen al cuadrado. Los de dentro suben poco y los de fuera suben mucho, y en el espacio los separa un plano horizontal. Gira el dibujo arrastrando, o con las flechas.',
    predice: 'Los puntos interiores están a distancia 0,7 del origen y los exteriores a 1,6. Al elevar al cuadrado, ¿a qué altura quedará cada grupo, y por dónde habría que cortar?',
    build: function (host) {
      var altura = 1.5;
      var D = NN.datos.circulos(U.rng(11), 60, 0.12);
      var out = W.readout(host, '');
      var vis = W.space3d(host, {
        rango: 3, height: 340,
        aria: 'Los puntos de dos círculos concéntricos elevados a una tercera dimensión, separados por un plano horizontal',
        draw: function (v) {
          D.X.forEach(function (q, i) {
            var z = q[0] * q[0] + q[1] * q[1];
            v.punto([q[0], q[1], z], { color: D.y[i] ? 1 : 0 });
          });
          v.plano([0, 0, 1], -altura, { color: 2 });
        }
      });
      function pinta() {
        var bien = 0;
        D.X.forEach(function (q, i) {
          var z = q[0] * q[0] + q[1] * q[1];
          if ((z > altura ? 1 : 0) === D.y[i]) bien++;
        });
        out.set('Plano de corte en $z = ' + U.fmt(altura, 2) + '$, que abajo es la circunferencia de radio $' +
          U.fmt(Math.sqrt(altura), 2) + '$.<br>' +
          '<strong>Clasifica bien el ' + U.fmt(100 * bien / D.X.length, 1) + ' %</strong> de los puntos.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Un plano en el espacio de arriba es ' +
          'una circunferencia en el plano de abajo. La frontera curva no se ha dibujado: ha salido de ' +
          'cortar con algo recto en una dimensión más.</span>');
        vis.render();
      }
      W.slider(W.row(host), {
        label: 'altura del plano de corte', min: 0.2, max: 3, step: 0.05, value: 1.5, dec: 2,
        on: function (v) { altura = v; pinta(); }
      });
      pinta();
    }
  });

  p.text('Eso es un <strong>cambio de espacio</strong>: se transforma cada punto $\\vec x$ en un vector ' +
    'más largo $\\varphi(\\vec x)$ y se busca allí un hiperplano. El problema es el coste: para ' +
    'admitir todas las curvas de grado dos en quinientas variables harían falta más de cien mil ' +
    'coordenadas nuevas, y para grados mayores, infinitas.');

  /* ---------------------------------------------------------------- */
  p.section('El truco del núcleo');

  p.text('Y aquí llega la idea que hizo famoso a este método. Si se mira con cuidado cómo se resuelve el ' +
    'problema de minimizar $\\Vert\\vec w\\Vert$ con esas inecuaciones, resulta que los datos ' +
    '<strong>solo aparecen en productos escalares</strong> $\\vec x_i \\cdot \\vec x_j$. En ningún ' +
    'sitio hace falta un punto suelto: siempre aparecen de dos en dos y multiplicados.');

  p.formula('K(\\vec x, \\vec x\\,\') = \\left(\\vec x \\cdot \\vec x\\,\' + 1\\right)^2 = \\varphi(\\vec x)\\cdot\\varphi(\\vec x\\,\')',
    'el truco del núcleo',
    'Se lee: <em>«ka de equis, equis prima, es el producto escalar de equis por equis prima, más uno, ' +
    'al cuadrado»</em>.<br><br>Desarrollando el cuadrado en dos dimensiones salen seis términos, y son ' +
    'exactamente el producto escalar de ' +
    '$\\varphi(\\vec x) = \\left(x_1^2,\\ x_2^2,\\ \\sqrt2\\,x_1x_2,\\ \\sqrt2\\,x_1,\\ \\sqrt2\\,x_2,\\ 1\\right)$ ' +
    'consigo mismo.<br><br>Es decir: <strong>se obtiene el resultado de trabajar en seis dimensiones ' +
    'haciendo una cuenta de dos</strong>, un producto escalar y un cuadrado. Nunca se calcula ' +
    '$\\varphi$, y con otros núcleos el espacio implícito es de dimensión infinita y la cuenta sigue ' +
    'siendo igual de barata.');

  p.table(['Núcleo', 'Fórmula', 'Qué fronteras permite'], [
    ['lineal', '$\\vec x \\cdot \\vec x\\,\'$', 'rectas y planos: el caso de partida'],
    ['polinómico', '$(\\vec x \\cdot \\vec x\\,\' + 1)^d$', 'curvas de grado $d$: circunferencias, elipses, parábolas'],
    ['gaussiano', '$e^{-\\gamma\\Vert\\vec x - \\vec x\\,\'\\Vert^2}$', 'casi cualquier frontera; el espacio implícito es de dimensión infinita']
  ]);

  p.note('Conviene no mitificarlo. El truco del núcleo <strong>no</strong> regala capacidad de balde: ' +
    'cuanto más flexible es el núcleo, más fácil es que el modelo se aprenda los datos de memoria, y ' +
    'hay que sujetarlo. Además obliga a guardar los vectores soporte y a compararse con ellos en cada ' +
    'predicción, así que con millones de ejemplos se vuelve lento. Por eso, cuando llegaron los datos ' +
    'masivos, el testigo pasó a las redes.', 'warn', 'Lo que cuesta el truco');

  p.text('Y cuando ni con núcleo se separa —o no interesa—, se permite que algunos puntos ' +
    '<strong>invadan el pasillo</strong> pagando una multa. Un parámetro decide cuánto se castiga cada ' +
    'invasión: con multa muy alta se exige separación perfecta y la frontera se retuerce; con multa ' +
    'baja se acepta equivocarse en unos pocos a cambio de un pasillo más ancho y una frontera más ' +
    'sensata. Es el mismo dilema entre memorizar y generalizar que atraviesa el bloque.');

  p.util('Entre 1995 y 2012, esto fue el modelo de referencia para casi todo lo que no fuera imagen: ' +
    'clasificación de textos, detección de spam de segunda generación, reconocimiento de escritura, ' +
    'predicción de la estructura de proteínas y clasificación de expresión genética, donde hay ' +
    'miles de variables y muy pocas muestras y el máximo margen se porta especialmente bien. Sigue ' +
    'siendo una opción muy razonable cuando hay pocos datos y muchas columnas, que es justo el caso en ' +
    'el que una red grande no tiene nada que hacer.');

  p.hist('Vladimir Vapnik y Alexey Chervonenkis desarrollaron la teoría desde 1963 en Moscú, y durante ' +
    'décadas fue casi desconocida fuera de la Unión Soviética. El salto llegó cuando Vapnik emigró a ' +
    'los Bell Labs: en 1992, con Bernhard Boser e Isabelle Guyon, publicó el truco del núcleo, y en ' +
    '1995, con Corinna Cortes, el margen blando que permite invasiones. Ese artículo de 1995 se ' +
    'titula simplemente <em>Support-Vector Networks</em> y es uno de los más citados de la disciplina. ' +
    'La teoría que Vapnik y Chervonenkis construyeron para justificarlo intenta responder a la ' +
    'pregunta de fondo de todo el bloque: por qué un modelo que acierta en los ejemplos que ha visto ' +
    'debería acertar en los que no.');

  p.trampas([
    { e: 'Creer que cualquier recta que separe vale igual', por: 'Una que pase rozando una nube clasifica mal el primer punto nuevo que caiga un poco más allá. El margen es justo la holgura que se le deja a lo que aún no se ha visto.' },
    { e: 'Olvidar dividir por $\\Vert\\vec w\\Vert$', por: 'El numerador $|\\vec w\\cdot\\vec x + b|$ se puede hacer tan grande como se quiera multiplicando $\\vec w$ por diez, sin mover la recta. Solo el cociente es una distancia.' },
    { e: 'Pensar que todos los ejemplos influyen en la frontera', por: 'Solo los vectores soporte. Alejar un punto del interior de su nube no mueve la solución ni un milímetro, y se ve en la demo.' },
    { e: 'Creer que el truco del núcleo calcula las coordenadas nuevas', por: 'No las calcula nunca: solo el producto escalar que habrían dado. Con el núcleo gaussiano esas coordenadas son infinitas y aun así la cuenta cabe en una línea.' },
    { e: 'Usar el núcleo más flexible por si acaso', por: 'Cuanta más flexibilidad, más fácil es memorizar los datos. El núcleo y la multa por invadir el pasillo son dos mandos que hay que ajustar, no dos regalos.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Distancia a la frontera',
    level: 'basico',
    gen: function (r) {
      var w = r.pick([[3, 4], [4, 3], [6, 8], [5, 12], [8, 15]]);
      var norma = Math.sqrt(w[0] * w[0] + w[1] * w[1]);
      var x = r.int(-4, 4), y = r.int(-4, 4), b = r.int(-6, 6);
      var val = w[0] * x + w[1] * y + b;
      if (val === 0) return null;
      return { w: w, x: x, y: y, b: b, val: val, norma: norma, d: Math.abs(val) / norma };
    },
    ask: function (d) {
      return 'La frontera es $' + d.w[0] + 'x_1 + ' + d.w[1] + 'x_2 ' + (d.b >= 0 ? '+ ' + d.b : '− ' + (-d.b)) +
        ' = 0$. ¿A qué distancia está el punto $(' + d.x + ',\\ ' + d.y + ')$? (tres decimales)';
    },
    fields: [{ name: 'd', label: 'distancia', w: 'tiny' }],
    sol: function (d) { return { d: U.round(d.d, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(Math.abs(d.val) - d.d) > 0.002 && Math.abs(v.d - Math.abs(d.val)) < 0.002; }, msg: 'Te has quedado en el numerador. Sin dividir por la norma de $\\vec w$ eso no es una distancia: cambiaría al multiplicar la ecuación por 10.' }],
    hint: function (d) { return 'Sustituye el punto, toma valor absoluto, y divide por $\\sqrt{' + d.w[0] + '^2 + ' + d.w[1] + '^2} = ' + d.norma + '$.'; },
    steps: function (d) {
      return ['$' + d.w[0] + '\\cdot(' + d.x + ') + ' + d.w[1] + '\\cdot(' + d.y + ') ' + (d.b >= 0 ? '+ ' + d.b : '− ' + (-d.b)) + ' = ' + d.val + '$',
        '$\\Vert\\vec w\\Vert = \\sqrt{' + (d.w[0] * d.w[0]) + ' + ' + (d.w[1] * d.w[1]) + '} = ' + d.norma + '$',
        '$d = \\dfrac{' + Math.abs(d.val) + '}{' + d.norma + '} = ' + U.fmt(d.d, 3) + '$',
        'El signo de ' + d.val + ' dice además de qué lado cae: ' + (d.val > 0 ? 'el positivo.' : 'el negativo.')];
    },
    answer: function (d) { return U.fmt(d.d, 3); }
  });

  p.exercise({
    title: 'Del vector al margen',
    level: 'basico',
    gen: function (r) {
      var w = r.pick([[3, 4], [6, 8], [0, 2], [1, 0], [5, 12], [8, 6]]);
      var norma = Math.sqrt(w[0] * w[0] + w[1] * w[1]);
      return { w: w, norma: norma, margen: 1 / norma, ancho: 2 / norma };
    },
    ask: function (d) {
      return 'Con la escala convenida —los puntos más cercanos dan $\\pm 1$—, una frontera tiene ' +
        '$\\vec w = (' + d.w.join(',\\ ') + ')$. ¿Cuánto valen el margen y el ancho del pasillo? ' +
        '(tres decimales)';
    },
    fields: [{ name: 'm', label: 'margen', w: 'tiny' }, { name: 'a', label: 'ancho', w: 'tiny' }],
    sol: function (d) { return { m: U.round(d.margen, 6), a: U.round(d.ancho, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(d.norma - d.margen) > 0.002 && Math.abs(v.m - d.norma) < 0.002; }, msg: 'Eso es la norma de $\\vec w$, no el margen. El margen es su <em>inverso</em>: por eso maximizar el margen es minimizar la norma.' }],
    hint: function () { return 'Margen $= 1/\\Vert\\vec w\\Vert$, y el pasillo es el doble, porque se extiende a los dos lados.'; },
    steps: function (d) {
      return ['$\\Vert\\vec w\\Vert = \\sqrt{' + (d.w[0] * d.w[0]) + ' + ' + (d.w[1] * d.w[1]) + '} = ' + U.fmt(d.norma, 3) + '$',
        'Margen $= 1/' + U.fmt(d.norma, 3) + ' = ' + U.fmt(d.margen, 3) + '$, y el pasillo, el doble: $' + U.fmt(d.ancho, 3) + '$.',
        'Cuanto menor es la norma, mayor es el margen: por eso el problema se plantea como minimizar $\\Vert\\vec w\\Vert$.'];
    },
    answer: function (d) { return 'margen ' + U.fmt(d.margen, 3) + ', ancho ' + U.fmt(d.ancho, 3); }
  });

  p.exercise({
    title: '¿Cuáles son vectores soporte?',
    level: 'medio',
    gen: function (r) {
      var ds = [], i;
      var minimo = r.pick([1, 1.5, 2]);
      var cuantos = r.int(2, 3);
      for (i = 0; i < 6; i++) ds.push(i < cuantos ? minimo : U.round(minimo + r.real(0.4, 2.5, 1), 1));
      ds = r.shuffle(ds);
      var soporte = [];
      ds.forEach(function (v, j) { if (Math.abs(v - minimo) < 1e-9) soporte.push(j + 1); });
      return { ds: ds, minimo: minimo, soporte: soporte, n: soporte.length };
    },
    ask: function (d) {
      return 'Seis ejemplos están a estas distancias de la frontera: $' +
        d.ds.map(function (v) { return U.fmt(v, 1); }).join('$, $') + '$. ¿Cuántos son vectores soporte?';
    },
    fields: [{ name: 'n', label: 'cuántos', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    errores: [{ si: function (v, d) { return d.n !== 6 && v.n === 6; }, msg: 'Vectores soporte son solo los que <em>tocan</em> el borde del pasillo, es decir, los que están a la distancia mínima. Los demás sobran.' }],
    hint: function () { return 'Son los que están a la distancia mínima: los que tocan el borde del pasillo.'; },
    steps: function (d) {
      return ['La distancia mínima es $' + U.fmt(d.minimo, 1) + '$.',
        'La alcanzan ' + d.n + ' ejemplos: son los vectores soporte.',
        'Los otros ' + (6 - d.n) + ' se podrían borrar y la frontera saldría idéntica.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: 'Calcular un núcleo',
    level: 'medio',
    gen: function (r) {
      var a = [r.int(-3, 3), r.int(-3, 3)], b = [r.int(-3, 3), r.int(-3, 3)];
      var esc = a[0] * b[0] + a[1] * b[1];
      return { a: a, b: b, esc: esc, k: Math.pow(esc + 1, 2) };
    },
    ask: function (d) {
      return 'Con el núcleo polinómico $K(\\vec x, \\vec x\\,\') = (\\vec x \\cdot \\vec x\\,\' + 1)^2$, ' +
        'calcula el producto escalar y el núcleo de $\\vec x = (' + d.a.join(',\\ ') + ')$ y ' +
        '$\\vec x\\,\' = (' + d.b.join(',\\ ') + ')$.';
    },
    fields: [{ name: 'e', label: 'producto escalar', w: 'tiny' }, { name: 'k', label: 'K', w: 'tiny' }],
    sol: function (d) { return { e: d.esc, k: d.k }; },
    errores: [{ si: function (v, d) { return d.k !== d.esc * d.esc && v.k === d.esc * d.esc; }, msg: 'Falta el $+1$ antes de elevar al cuadrado. Ese uno es lo que añade los términos de grado 1 y la constante al espacio implícito.' }],
    hint: function () { return 'Primero el producto escalar componente a componente. Después súmale 1 y eleva al cuadrado.'; },
    steps: function (d) {
      return ['$\\vec x \\cdot \\vec x\\,\' = (' + d.a[0] + ')(' + d.b[0] + ') + (' + d.a[1] + ')(' + d.b[1] + ') = ' + d.esc + '$',
        '$K = (' + d.esc + ' + 1)^2 = ' + d.k + '$',
        'Ese solo número equivale al producto escalar de dos vectores de seis componentes, que no se han calculado en ningún momento.'];
    },
    answer: function (d) { return 'escalar ' + d.esc + ', K = ' + d.k; }
  });

  p.exercise({
    title: 'El núcleo, comprobado por las dos vías',
    level: 'avanzado',
    gen: function (r) {
      var a = [r.int(1, 3), r.int(1, 3)], b = [r.int(1, 3), r.int(1, 3)];
      var esc = a[0] * b[0] + a[1] * b[1];
      var k = Math.pow(esc + 1, 2);
      /* phi(x) = (x1^2, x2^2, √2 x1x2, √2 x1, √2 x2, 1) */
      var directo = a[0] * a[0] * b[0] * b[0] + a[1] * a[1] * b[1] * b[1] +
        2 * a[0] * a[1] * b[0] * b[1] + 2 * a[0] * b[0] + 2 * a[1] * b[1] + 1;
      return { a: a, b: b, esc: esc, k: k, directo: directo };
    },
    ask: function (d) {
      return 'Sea $\\varphi(\\vec x) = \\left(x_1^2,\\ x_2^2,\\ \\sqrt2\\,x_1x_2,\\ \\sqrt2\\,x_1,\\ ' +
        '\\sqrt2\\,x_2,\\ 1\\right)$, con $\\vec x = (' + d.a.join(',\\ ') + ')$ y $\\vec x\\,\' = (' +
        d.b.join(',\\ ') + ')$. Calcula $\\varphi(\\vec x)\\cdot\\varphi(\\vec x\\,\')$ sumando las seis ' +
        'componentes, y después $(\\vec x\\cdot\\vec x\\,\' + 1)^2$. ¿Salen iguales?';
    },
    fields: [
      { name: 'a', label: 'φ·φ (seis términos)', w: 'tiny' },
      { name: 'b', label: '(x·x\'+1)²', w: 'tiny' },
      { name: 'q', label: 'Coinciden', opts: [{ t: 'sí, siempre', v: 'si' }, { t: 'no, solo a veces', v: 'no' }] }
    ],
    sol: function (d) { return { a: d.directo, b: d.k, q: 'si' }; },
    hint: function (d) { return 'Los seis términos son $x_1^2x_1\'^2 + x_2^2x_2\'^2 + 2x_1x_2x_1\'x_2\' + 2x_1x_1\' + 2x_2x_2\' + 1$. El producto escalar de partida vale ' + d.esc + '.'; },
    steps: function (d) {
      return ['Por las seis componentes: $' + (d.a[0] * d.a[0] * d.b[0] * d.b[0]) + ' + ' + (d.a[1] * d.a[1] * d.b[1] * d.b[1]) +
        ' + ' + (2 * d.a[0] * d.a[1] * d.b[0] * d.b[1]) + ' + ' + (2 * d.a[0] * d.b[0]) + ' + ' + (2 * d.a[1] * d.b[1]) + ' + 1 = ' + d.directo + '$.',
        'Por el núcleo: $(' + d.esc + ' + 1)^2 = ' + d.k + '$.',
        'Coinciden, y coinciden <strong>siempre</strong>: es la identidad algebraica de desarrollar el cuadrado.',
        'Por eso el truco no es una aproximación. Se obtiene el resultado exacto de seis dimensiones con una cuenta de dos.'];
    },
    answer: function (d) { return String(d.k) + ' por las dos vías'; }
  });

  p.keys([
    'Entre todas las fronteras que separan, la mejor es la que deja el pasillo más ancho: el <strong>máximo margen</strong>.',
    'El margen es la distancia punto-recta de geometría, $|\\vec w\\cdot\\vec x + b| / \\Vert\\vec w\\Vert$.',
    'Fijando la escala para que los más cercanos den $\\pm 1$, el margen es $1/\\Vert\\vec w\\Vert$: maximizarlo es minimizar $\\Vert\\vec w\\Vert$ con inecuaciones.',
    'Solo mandan los <strong>vectores soporte</strong>, los que tocan el borde. El resto se puede tirar sin que la frontera cambie.',
    'Si ninguna recta separa, se sube de dimensión: un plano allí arriba es una curva aquí abajo.',
    'El truco del núcleo sustituye un producto escalar por otro y da el resultado de un espacio enorme sin llegar a pisarlo.'
  ]);
});
