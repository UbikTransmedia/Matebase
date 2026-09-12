/* Tema: Redes convolucionales */
Course.topic('ia-cnn', function (p) {

  p.puente('Empieza el bloque de las arquitecturas, y cada una entra por <strong>la idea matemática ' +
    'nueva que aporta</strong>. Esta trae la primera: aprovechar una simetría. De ' +
    '[[av-convolucion|la convolución]] viene el núcleo que se desliza, de [[av-grupos|los grupos]] la ' +
    'idea de que las transformaciones que dejan algo igual forman una estructura, y de ' +
    '[[ia-red|las capas densas]] viene justo lo que hay que arreglar.', 'Por dónde empezamos');

  p.text('La frase que resume el tema, y que conviene poder repetir: <strong>una red convolucional es ' +
    'una red densa que comparte pesos, porque una imagen no cambia de significado al desplazarla</strong>. ' +
    'Todo lo demás son consecuencias de eso.');

  /* ---------------------------------------------------------------- */
  p.section('Una capa densa desperdicia lo que sabe');

  p.text('Prueba a conectar una imagen pequeña, de $28\\times 28$ píxeles, a una capa densa de 128 ' +
    'neuronas. Son $784$ entradas, así que la matriz tiene $784 \\times 128 = 100\\,352$ pesos, más los ' +
    'sesgos. Y eso es solo la primera capa de la red más modesta imaginable.');

  p.text('Pero el problema gordo no es el tamaño: es que esos pesos <strong>no se enteran de que están ' +
    'mirando una imagen</strong>. Para una capa densa, el píxel de arriba a la izquierda y el de al ' +
    'lado son dos entradas cualesquiera, sin más relación entre ellas que la que tengan con cualquier ' +
    'otra. Si desplazas el dibujo un píxel a la derecha, <em>todas</em> las entradas cambian de sitio y ' +
    'lo aprendido no sirve: habría que volver a aprenderlo, desplazado.');

  p.note('Dicho de otra manera: una capa densa tendría que aprender por separado a reconocer un trazo ' +
    'vertical en cada una de las 784 posiciones posibles. Sabe tan poco del problema que ni siquiera ' +
    'sabe que son la misma cosa en sitios distintos.', 'warn', 'Aprenderlo todo, una vez por sitio');

  /* ---------------------------------------------------------------- */
  p.section('La simetría que estábamos tirando');

  p.text('Un tres desplazado un píxel sigue siendo un tres. Eso, que parece una obviedad, es una ' +
    '<strong>simetría</strong> en el sentido preciso de [[av-grupos|la teoría de grupos]]: hay un ' +
    'conjunto de transformaciones —las traslaciones— que se pueden componer, que tienen inversa y que ' +
    '<em>dejan invariante</em> lo que nos importa, que es el significado de la imagen.');

  p.text('Y una simetría del problema debería ser una simetría del modelo. Lo que se le pide a la capa es ' +
    'que si la entrada se desplaza, su respuesta se desplace igual. A eso se le llama ' +
    '<strong>equivariancia</strong>, y hay exactamente una manera de conseguirla: usar ' +
    '<strong>los mismos pesos en todas las posiciones</strong>.');

  p.formula('\\text{desplazar y luego filtrar} \\;=\\; \\text{filtrar y luego desplazar}',
    'equivariancia a la traslación',
    'Es la propiedad que define una convolución, y se puede comprobar con la fórmula de ' +
    '[[av-convolucion|la convolución]]: como el núcleo es el mismo en todas las posiciones, mover la ' +
    'señal antes o después de filtrarla da el mismo resultado.<br><br>Una capa densa <strong>no</strong> ' +
    'cumple esto, porque cada posición tiene sus propios pesos. Una capa convolucional lo cumple por ' +
    'construcción, y ese es todo el invento.');

  p.demo({
    title: 'Mover la imagen y ver moverse la respuesta',
    intro: 'A la izquierda, una imagen con un trazo; a la derecha, el resultado de pasarle un núcleo detector de bordes verticales. Desplaza el trazo y fíjate en que el mapa de la derecha se desplaza exactamente igual, sin que nada haya tenido que reaprenderse.',
    predice: 'El núcleo es el mismo en todas las posiciones. Si muevo el trazo tres columnas a la derecha, ¿qué le pasará a la mancha de la derecha?',
    build: function (host) {
      var desp = 0, N = 12;
      var nucleo = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
      var out = W.readout(host, '');
      function imagen() {
        var im = [], i, j;
        for (i = 0; i < N; i++) {
          im.push([]);
          for (j = 0; j < N; j++) {
            var esTrazo = (j === 3 + desp || j === 4 + desp) && i >= 2 && i <= 9;
            im[i].push(esTrazo ? 1 : 0.08);
          }
        }
        return im;
      }
      function filtra(im) {
        var res = [], a, b, u, v;
        for (a = 0; a < N - 2; a++) {
          res.push([]);
          for (b = 0; b < N - 2; b++) {
            var s = 0;
            for (u = 0; u < 3; u++) for (v = 0; v < 3; v++) s += im[a + u][b + v] * nucleo[2 - u][2 - v];
            res[a].push(s);
          }
        }
        return res;
      }
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 26.5, ymin: -1.5, ymax: 12.5, height: 300, equal: true,
        grid: false, axes: false,
        aria: 'Una imagen con un trazo vertical y el mapa que produce un detector de bordes, que se desplaza con ella',
        draw: function (g) {
          var im = imagen(), res = filtra(im), a, b;
          for (a = 0; a < N; a++) for (b = 0; b < N; b++) {
            g.rect(b, N - 1 - a, 1, 1, { color: 'ink', fill: 'ink', fillAlpha: im[a][b] * 0.85, w: 0.3, alpha: 0.3 });
          }
          for (a = 0; a < N - 2; a++) for (b = 0; b < N - 2; b++) {
            var t = U.clamp(Math.abs(res[a][b]) / 4, 0, 1);
            g.rect(14 + b, N - 2 - a, 1, 1, { color: 2, fill: 2, fillAlpha: t * 0.9, w: 0.3, alpha: 0.3 });
          }
          g.text(0, -1, 'imagen', { color: 'ink', size: 12.5 });
          g.text(14, -1, 'respuesta del núcleo', { color: 2, size: 12.5 });
        }
      });
      function pinta() {
        out.set('Trazo desplazado <strong>' + desp + '</strong> columna' + (desp === 1 ? '' : 's') +
          ' &nbsp;·&nbsp; la respuesta aparece en las columnas ' + (2 + desp) + ' y ' + (3 + desp) + ' del mapa.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Los nueve números del núcleo no han ' +
          'cambiado: son los mismos en todas las posiciones. Por eso la respuesta acompaña al trazo en ' +
          'vez de tener que aprenderse otra vez en cada sitio.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'desplazar el trazo', min: 0, max: 6, step: 1, value: 0, dec: 0,
        on: function (v) { desp = v; pinta(); }
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cuánto se ahorra');

  p.text('Compartir pesos tiene una consecuencia aritmética espectacular. Una capa densa necesita un peso ' +
    'por cada par (entrada, neurona). Una capa convolucional necesita un peso por cada casilla del ' +
    'núcleo, <strong>y ya está</strong>: los mismos sirven para toda la imagen.');

  p.formulas([
    '\\text{densa: } (H\\cdot W\\cdot C)\\times(H\\cdot W\\cdot S) \\text{ pesos}',
    '\\text{convolucional: } k \\cdot k \\cdot C \\cdot S \\text{ pesos}'
  ], 'el ahorro de compartir',
    'Con una imagen de $28\\times28$ en blanco y negro ($C = 1$) y $S = 8$ mapas de salida, la densa ' +
    'necesitaría $784 \\times 6272 \\approx 4{,}9$ millones de pesos, y la convolucional con núcleo ' +
    '$3\\times3$ necesita $3\\cdot3\\cdot1\\cdot8 = 72$.<br><br>No son unas pocas veces menos: son ' +
    '<strong>cinco órdenes de magnitud</strong>. Y el ahorro no cuesta capacidad útil, porque lo que se ' +
    'ha eliminado es la posibilidad de tratar cada posición de forma distinta, que era precisamente lo ' +
    'que no queríamos.');

  p.text('A cada núcleo se le llama <strong>filtro</strong>, y lo importante es que sus números ' +
    '<strong>no se eligen: se aprenden</strong>. En [[av-convolucion|convolución]] escribíamos a mano ' +
    'un detector de bordes; aquí el descenso de gradiente decide qué conviene detectar, y lo decide a ' +
    'partir de los datos.');

  p.demo({
    title: 'Una red convolucional, entrenada aquí',
    intro: 'Imágenes de 8×8 con un trazo horizontal, vertical o diagonal. La red tiene cuatro filtros de 3×3 que empiezan valiendo cualquier cosa. Entrena y mira dos cosas: cómo sube el acierto y en qué se convierten los cuatro filtros, abajo. Después dibuja tú en la rejilla de la izquierda.',
    predice: 'Los cuatro filtros empiezan siendo ruido. Para distinguir trazos horizontales de verticales, ¿qué crees que tendrán que acabar detectando?',
    build: function (host) {
      var lienzo = [], i, j;
      for (i = 0; i < 8; i++) { lienzo.push([]); for (j = 0; j < 8; j++) lienzo[i].push(0); }
      /* Datos por formula: un trazo de tres orientaciones, en posicion
         aleatoria y con algo de ruido. Nada viene de fuera. */
      function ejemplo(r) {
        var im = [], a, b, c = r.int(0, 2), off = r.int(1, 4), off2 = r.int(1, 4);
        for (a = 0; a < 8; a++) { im.push([]); for (b = 0; b < 8; b++) im[a].push(r.real(0, 0.12, 3)); }
        for (a = 0; a < 5; a++) {
          if (c === 0) im[off][off2 + a - 1 < 0 ? 0 : Math.min(7, off2 + a - 1)] = 1;
          else if (c === 1) im[Math.min(7, off + a - 1 < 0 ? 0 : off + a - 1)][off2] = 1;
          else im[Math.min(7, off + a)][Math.min(7, off2 + a)] = 1;
        }
        return { im: im, c: c };
      }
      var datos = [], rd = U.rng(5);
      for (i = 0; i < 48; i++) datos.push(ejemplo(rd));

      var K, bK, Wd, bd, opt, pasos, perdida;
      function reinicia() {
        var r = U.rng(3);
        K = NN.param([4, 3, 3, 1], r, 0.6);
        bK = NN.constante([4], 0);
        Wd = NN.param([36, 3], r, 0.4);
        bd = NN.constante([3], 0);
        opt = NN.Adam([K, bK, Wd, bd], { lr: 0.06 });
        pasos = 0; perdida = 0;
      }
      reinicia();
      function aTensor(im) {
        var t = NN.t([8, 8, 1]), a, b;
        for (a = 0; a < 8; a++) for (b = 0; b < 8; b++) t.v[a * 8 + b] = im[a][b];
        return t;
      }
      function adelante(im) {
        var x = aTensor(im);
        var c = NN.relu(NN.suma(NN.conv2d(x, K), bK));   // [6,6,4]
        var pl = NN.agrupa(c, 2);                        // [3,3,4]
        var pla = NN.reforma(pl, [1, 36]);
        return NN.suma(NN.mm(pla, Wd), bd);              // [1,3]
      }
      function paso() {
        NN.limpia();
        var total = null, r = U.rng(100 + pasos), k;
        for (k = 0; k < 8; k++) {
          var d = datos[r.int(0, datos.length - 1)];
          var L = NN.entropiaCruzada(adelante(d.im), [d.c]);
          total = total ? NN.suma(total, L) : L;
        }
        total = NN.escala(total, 1 / 8);
        NN.atras(total, [K, bK, Wd, bd]);
        opt.paso();
        perdida = total.v[0];
        pasos++;
      }
      function clasifica(im) {
        NN.limpia();
        var z = adelante(im), mejor = 0, k;
        for (k = 1; k < 3; k++) if (z.v[k] > z.v[mejor]) mejor = k;
        return mejor;
      }
      function acierto() {
        var bien = 0, k;
        for (k = 0; k < datos.length; k++) if (clasifica(datos[k].im) === datos[k].c) bien++;
        return 100 * bien / datos.length;
      }
      var NOMBRES = ['horizontal', 'vertical', 'diagonal'];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 22.5, ymin: -3.5, ymax: 8.5, height: 300, equal: true,
        grid: false, axes: false,
        aria: 'Una rejilla de ocho por ocho para dibujar, un ejemplo de entrenamiento y los cuatro filtros que la red va aprendiendo',
        onClick: function (x, y) {
          var b = Math.floor(x), a = 7 - Math.floor(y);
          if (b >= 0 && b < 8 && a >= 0 && a < 8) { lienzo[a][b] = lienzo[a][b] > 0.5 ? 0 : 1; pinta(); }
        },
        draw: function (g) {
          var a, b, f;
          for (a = 0; a < 8; a++) for (b = 0; b < 8; b++) {
            g.rect(b, 7 - a, 1, 1, { color: 'ink', fill: 'ink', fillAlpha: lienzo[a][b] * 0.85, w: 0.4, alpha: 0.35 });
          }
          g.text(0, -0.9, 'dibuja aquí', { color: 'ink', size: 12 });
          var ej = datos[0].im;
          for (a = 0; a < 8; a++) for (b = 0; b < 8; b++) {
            g.rect(10 + b, 7 - a, 1, 1, { color: 0, fill: 0, fillAlpha: ej[a][b] * 0.8, w: 0.4, alpha: 0.3 });
          }
          g.text(10, -0.9, 'un ejemplo (' + NOMBRES[datos[0].c] + ')', { color: 0, size: 12 });
          /* los cuatro filtros aprendidos */
          for (f = 0; f < 4; f++) {
            var max = 1e-6;
            for (a = 0; a < 9; a++) max = Math.max(max, Math.abs(K.v[f * 9 + a]));
            for (a = 0; a < 3; a++) for (b = 0; b < 3; b++) {
              var w = K.v[f * 9 + a * 3 + b] / max;
              g.rect(f * 5 + b, -3 + (2 - a), 1, 1, {
                color: w > 0 ? 2 : 1, fill: w > 0 ? 2 : 1, fillAlpha: Math.abs(w) * 0.9, w: 0.3, alpha: 0.3
              });
            }
          }
          g.text(0, -3.3, 'los cuatro filtros aprendidos', { color: 2, size: 11.5 });
        }
      });
      function pinta() {
        var dibujado = false, a, b;
        for (a = 0; a < 8; a++) for (b = 0; b < 8; b++) if (lienzo[a][b] > 0.5) dibujado = true;
        out.set('Paso ' + pasos + ' &nbsp;·&nbsp; pérdida ' + U.fmt(perdida, 4) +
          ' &nbsp;·&nbsp; acierta el <strong>' + U.fmt(acierto(), 1) + ' %</strong> de los 48 ejemplos<br>' +
          (dibujado ? 'Lo que has dibujado lo clasifica como <strong>' + NOMBRES[clasifica(lienzo)] + '</strong>.'
            : 'Haz clic en la rejilla de la izquierda para dibujar un trazo y ver qué contesta.') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Cuatro filtros de 3×3 son ' +
          '<strong>36 pesos</strong>. Una capa densa de 8×8 a cuatro mapas de 6×6 habría necesitado ' +
          '$' + U.miles(64 * 144) + '$.</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 2, paso: paso, pinta: pinta, hasta: 600 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } },
        { t: 'Borrar el dibujo', on: function () { var a, b; for (a = 0; a < 8; a++) for (b = 0; b < 8; b++) lienzo[a][b] = 0; pinta(); } }
      ]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Agrupar, y el campo receptivo');

  p.text('Detrás de cada convolución suele ir una <strong>agrupación</strong>: quedarse con el máximo de ' +
    'cada cuadrado de $2\\times2$ y tirar el resto. Encoge la imagen a la mitad de lado, y eso hace dos ' +
    'cosas a la vez.');

  p.list([
    'Aporta una <strong>tolerancia a pequeños desplazamientos</strong>: si el trazo se mueve un píxel dentro del mismo cuadrado, el máximo no cambia.',
    'Amplía el <strong>campo receptivo</strong>: tras agrupar, cada píxel resume una zona mayor del original, así que la convolución siguiente ve más lejos con el mismo núcleo de 3×3.'
  ]);

  p.note('El campo receptivo es la clave de por qué estas redes son <em>profundas</em>. Con núcleos de ' +
    '$3\\times3$, la primera capa ve 3 píxeles de lado; la segunda, 5; la tercera, 7. Pero si entre ' +
    'ellas se agrupa, el alcance se <strong>duplica</strong> en cada paso en vez de crecer de dos en ' +
    'dos. Por eso unas pocas capas bastan para que la última vea la imagen entera, y por eso las ' +
    'primeras capas aprenden bordes y las últimas, formas completas.', 'ok', 'Por qué hacen falta capas');

  p.ejemplo({
    title: 'Contar parámetros y tamaños',
    enunciado: 'Una imagen de $32\\times32$ en color (3 canales) pasa por: una convolución de $3\\times3$ con 16 filtros, una agrupación de $2\\times2$, otra convolución de $3\\times3$ con 32 filtros y otra agrupación. Calcular el tamaño después de cada paso y los pesos de las dos convoluciones.',
    pasos: [
      { t: '<strong>Primera convolución.</strong> Sin relleno, el lado pasa de 32 a $32 - 3 + 1 = 30$. Salida: $30\\times30\\times16$.', antes: 'Con núcleo $k$, el lado pasa de $H$ a $H - k + 1$.' },
      { t: '<strong>Sus pesos.</strong> Cada filtro es $3\\times3$ y tan profundo como la entrada, o sea 3 canales: $3\\cdot3\\cdot3 = 27$ pesos por filtro, por 16 filtros, $432$ pesos.', antes: 'Cada filtro mira los tres canales a la vez. ¿Cuántos números tiene uno?' },
      { t: '<strong>Primera agrupación.</strong> Divide el lado entre dos: $15\\times15\\times16$. No tiene ningún peso: solo elige máximos.', antes: 'Agrupar de dos en dos, ¿qué le hace al lado?' },
      { t: '<strong>Segunda convolución.</strong> Lado $15 - 3 + 1 = 13$, con 32 filtros: $13\\times13\\times32$. Pesos: $3\\cdot3\\cdot16\\cdot32 = 4608$.', antes: 'Ahora la entrada tiene 16 canales. ¿Cuántos pesos por filtro?' },
      { t: '<strong>Segunda agrupación.</strong> $6\\times6\\times32$, porque 13 entre 2 son 6 y sobra uno, que se descarta.' },
      { t: '<strong>El total.</strong> $432 + 4608 = 5040$ pesos en toda la parte convolucional. Una sola capa densa de $32\\times32\\times3 = 3072$ entradas a 128 neuronas habría necesitado $393\\,216$: casi ochenta veces más para hacer mucho menos.' }
    ],
    cierre: 'Fíjate en que el segundo filtro tiene más pesos que el primero aunque sea del mismo tamaño: es porque su entrada tiene 16 canales en vez de 3. La profundidad de un filtro la fija siempre lo que mira, no lo que produce.'
  });

  p.comprueba('¿Por qué una capa convolucional tiene muchísimos menos parámetros que una densa equivalente?', [
    { t: 'Porque los mismos pesos se usan en todas las posiciones, en vez de tener unos distintos para cada una', ok: true, por: 'Es compartir, no recortar: el núcleo recorre la imagen entera. Y lo que se ha perdido —poder tratar cada posición de forma distinta— es justo lo que no queríamos, porque una imagen no cambia de significado al desplazarla.' },
    { t: 'Porque mira menos píxeles: solo una ventanita de 3×3', ok: false, por: 'Los mira todos, pasando la ventana por encima. Y apilando capas, cada salida acaba dependiendo de una zona grande del original.' },
    { t: 'Porque los píxeles se comprimen antes de entrar', ok: false, por: 'La imagen entra entera. Lo que encoge es el mapa de salida, y por la agrupación, no por la convolución.' }
  ]);

  p.util('La demostración de que esto funcionaba a gran escala llegó con <strong>ImageNet</strong>, la ' +
    'base de datos de millones de imágenes etiquetadas que impulsó Fei-Fei Li a partir de 2007 y que ' +
    'nadie le pedía: por entonces se pensaba que lo que faltaban eran mejores algoritmos, no más datos. ' +
    'Su competición anual se convirtió en el termómetro del campo, y en 2012 una red convolucional ' +
    'ganó con una diferencia tan grande sobre los métodos clásicos que reorientó la disciplina entera ' +
    'en cuestión de meses. Hoy la misma arquitectura lee matrículas, clasifica radiografías, detecta ' +
    'defectos en cadenas de montaje y es lo que mira por la cámara de tu móvil cuando enfoca una cara.');

  p.hist('La idea no nació en informática sino en neurofisiología. En los años sesenta David Hubel y ' +
    'Torsten Wiesel descubrieron, midiendo neuronas de la corteza visual de un gato, que había células ' +
    'que respondían a bordes con una orientación concreta <em>en una zona pequeña</em> del campo ' +
    'visual, y que otras más arriba combinaban esas respuestas; les valió el Nobel de Medicina en 1981. ' +
    'Kunihiko Fukushima construyó en 1980 el Neocognitron siguiendo esa jerarquía. Y Yann LeCun le ' +
    'añadió a finales de los ochenta lo que faltaba, entrenar los filtros con retropropagación en vez ' +
    'de diseñarlos: su red LeNet leía los códigos postales del correo estadounidense y los importes de ' +
    'los cheques mucho antes de que nadie hablara de aprendizaje profundo.');

  p.trampas([
    { e: 'Creer que la convolución ahorra mirando menos', por: 'Mira toda la imagen. Lo que ahorra es tener un juego de pesos por posición: usa el mismo en todas.' },
    { e: 'Olvidar que un filtro es tan profundo como su entrada', por: 'Sobre una imagen en color, un filtro $3\\times3$ tiene 27 pesos, no 9. Es el error de cuenta más habitual del tema.' },
    { e: 'Pensar que la agrupación tiene parámetros', por: 'Solo elige el máximo de cada cuadrado: no hay nada que aprender en ella, y por eso no aparece en el recuento de pesos.' },
    { e: 'Usar una red convolucional porque sí', por: 'Su ventaja viene de una simetría del problema. En datos de tabla, donde las columnas no tienen orden ni vecindad, esa simetría no existe y compartir pesos no significa nada.' },
    { e: 'Confundir equivariancia con invariancia', por: 'La convolución es equivariante: si la entrada se mueve, la salida se mueve igual. La invariancia —que la respuesta no cambie— la aportan la agrupación y, al final, la capa que resume.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El tamaño tras una convolución',
    level: 'basico',
    gen: function (r) {
      var H = r.pick([28, 32, 64, 128]), k = r.pick([3, 5, 7]);
      return { H: H, k: k, lado: H - k + 1, traspool: Math.floor((H - k + 1) / 2) };
    },
    ask: function (d) {
      return 'Una imagen de $' + d.H + '\\times' + d.H + '$ pasa por una convolución de $' + d.k +
        '\\times' + d.k + '$ sin relleno y después por una agrupación de $2\\times2$. ¿De qué lado es ' +
        'el resultado en cada paso?';
    },
    fields: [{ name: 'a', label: 'tras la convolución', w: 'tiny' }, { name: 'b', label: 'tras agrupar', w: 'tiny' }],
    sol: function (d) { return { a: d.lado, b: d.traspool }; },
    errores: [{ si: function (v, d) { return v.a === d.H; }, msg: 'Sin relleno el lado encoge: el núcleo no puede asomarse fuera de la imagen.' }],
    hint: function () { return 'Convolución: $H - k + 1$. Agrupación de dos en dos: la mitad, descartando lo que sobre.'; },
    steps: function (d) {
      return ['Convolución: $' + d.H + ' - ' + d.k + ' + 1 = ' + d.lado + '$.',
        'Agrupación: $' + d.lado + ' / 2 = ' + d.traspool + '$' + (d.lado % 2 ? ', descartando la fila y la columna que sobran.' : '.')];
    },
    answer: function (d) { return d.lado + ' y después ' + d.traspool; }
  });

  p.exercise({
    title: 'Los pesos de un filtro',
    level: 'basico',
    gen: function (r) {
      var k = r.pick([3, 5]), C = r.pick([1, 3, 8, 16]), S = r.pick([4, 8, 16, 32]);
      return { k: k, C: C, S: S, porFiltro: k * k * C, total: k * k * C * S };
    },
    ask: function (d) {
      return 'Una capa convolucional usa núcleos de $' + d.k + '\\times' + d.k + '$ sobre una entrada de ' +
        '$' + d.C + '$ canal' + (d.C > 1 ? 'es' : '') + ' y produce $' + d.S + '$ mapas de salida. ' +
        '¿Cuántos pesos tiene cada filtro y cuántos la capa entera? (sin contar sesgos)';
    },
    fields: [{ name: 'a', label: 'por filtro', w: 'tiny' }, { name: 'b', label: 'la capa', w: 'tiny' }],
    sol: function (d) { return { a: d.porFiltro, b: d.total }; },
    errores: [{ si: function (v, d) { return d.C !== 1 && v.a === d.k * d.k; }, msg: 'Falta la profundidad: un filtro mira todos los canales de la entrada a la vez, así que tiene $k \\times k \\times C$ pesos.' }],
    hint: function () { return 'Cada filtro es $k\\times k$ por cada canal de entrada. Y hay tantos filtros como mapas de salida.'; },
    steps: function (d) {
      return ['Por filtro: $' + d.k + '\\cdot' + d.k + '\\cdot' + d.C + ' = ' + d.porFiltro + '$.',
        'La capa: $' + d.porFiltro + ' \\times ' + d.S + ' = ' + U.miles(d.total) + '$.',
        'La profundidad de un filtro la fija lo que <em>mira</em>, no lo que produce.'];
    },
    answer: function (d) { return d.porFiltro + ' y $' + U.miles(d.total) + '$'; }
  });

  p.exercise({
    title: 'Densa contra convolucional',
    level: 'medio',
    gen: function (r) {
      var H = r.pick([8, 16, 28]), S = r.pick([4, 8]);
      var lado = H - 2;
      return { H: H, S: S, lado: lado, conv: 9 * S, densa: H * H * lado * lado * S };
    },
    ask: function (d) {
      return 'Una imagen de $' + d.H + '\\times' + d.H + '$ en blanco y negro produce $' + d.S +
        '$ mapas de $' + d.lado + '\\times' + d.lado + '$. ¿Cuántos pesos hacen falta con núcleos de ' +
        '$3\\times3$ compartidos, y cuántos si cada salida tuviera sus propios pesos hacia toda la entrada?';
    },
    fields: [{ name: 'a', label: 'compartiendo', w: 'tiny' }, { name: 'b', label: 'sin compartir', w: 'tiny' }],
    sol: function (d) { return { a: d.conv, b: d.densa }; },
    hint: function (d) { return 'Compartiendo: $3\\cdot3\\cdot1\\cdot' + d.S + '$. Sin compartir: cada una de las $' + d.lado + '\\cdot' + d.lado + '\\cdot' + d.S + '$ salidas con un peso por cada uno de los $' + (d.H * d.H) + '$ píxeles.'; },
    steps: function (d) {
      return ['Compartiendo: $9 \\times ' + d.S + ' = ' + d.conv + '$ pesos.',
        'Sin compartir: $' + (d.H * d.H) + ' \\times ' + (d.lado * d.lado * d.S) + ' = ' + U.miles(d.densa) + '$.',
        'La razón entre los dos es de $' + U.miles(Math.round(d.densa / d.conv)) + '$ a 1, y todo ese ahorro sale de una sola idea: la imagen no cambia de significado al desplazarla.'];
    },
    answer: function (d) { return d.conv + ' frente a $' + U.miles(d.densa) + '$'; }
  });

  p.exercise({
    title: 'Hasta dónde ve una capa',
    level: 'medio',
    gen: function (r) {
      var capas = r.int(2, 5), conPool = r.bool(0.5);
      var campo = conPool ? (Math.pow(2, capas) + Math.pow(2, capas) - 1) : (1 + 2 * capas);
      /* sin agrupar: 1 + 2n. Con una agrupacion tras cada capa, el alcance
         se duplica en cada paso. */
      var v = conPool ? (function () { var c = 1, i; for (i = 0; i < capas; i++) { c = c + 2; c = c * 2; } return c / 2; })() : 1 + 2 * capas;
      return { capas: capas, conPool: conPool, v: v };
    },
    ask: function (d) {
      return 'Se apilan $' + d.capas + '$ convoluciones de $3\\times3$' +
        (d.conPool ? ', con una agrupación de $2\\times2$ después de cada una' : ', sin ninguna agrupación') +
        '. ¿Cuántos píxeles de lado del original influyen en una salida de la última capa?';
    },
    fields: [{ name: 'c', label: 'píxeles de lado', w: 'tiny' }],
    sol: function (d) { return { c: d.v }; },
    hint: function (d) { return d.conPool ? 'Cada convolución suma 2 al alcance, y cada agrupación lo duplica. Ve aplicando las dos cosas por turnos desde 1.' : 'Cada convolución de $3\\times3$ añade 2 al alcance, empezando en 1.'; },
    steps: function (d) {
      if (!d.conPool) return ['$1 + 2 \\times ' + d.capas + ' = ' + d.v + '$: crece de dos en dos, muy despacio.'];
      var pasos = [], c = 1, i;
      for (i = 0; i < d.capas; i++) { c += 2; pasos.push('tras la convolución ' + (i + 1) + ': ' + c); c *= 2; if (i < d.capas - 1) pasos.push('tras agrupar: ' + c); }
      pasos.push('Alcance final: <strong>' + d.v + '</strong> píxeles de lado, frente a los ' + (1 + 2 * d.capas) + ' que daría sin agrupar.');
      return pasos;
    },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: '¿Conviene una convolucional?',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'clasificar radiografías de tórax', v: 'si', por: 'Son imágenes: una lesión significa lo mismo esté donde esté, así que la simetría de traslación existe y compartir pesos la aprovecha.' },
        { t: 'predecir el impago de un préstamo a partir de edad, ingresos y antigüedad laboral', v: 'no', por: 'Las columnas no tienen vecindad ni orden: desplazarlas no significa nada. Sin esa simetría, compartir pesos no tiene sentido.' },
        { t: 'detectar una palabra clave en una señal de audio', v: 'si', por: 'La señal es una secuencia y la palabra significa lo mismo en cualquier instante: es exactamente la misma simetría, en una dimensión.' },
        { t: 'decidir a partir de una tabla con el resultado de veinte análisis de sangre', v: 'no', por: 'Reordenar las columnas no cambia el problema, así que no hay estructura espacial que explotar. Aquí suele ganar un bosque.' },
        { t: 'encontrar defectos en fotos de una cadena de montaje', v: 'si', por: 'Un defecto es un defecto aparezca en la esquina o en el centro: la traslación deja el significado intacto.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Para este problema, ¿tiene sentido una red convolucional? «' + d.c.t + '»'; },
    fields: [{ name: 'q', label: 'Respuesta', opts: [
      { t: 'sí: hay simetría de traslación que aprovechar', v: 'si' },
      { t: 'no: los datos no tienen esa estructura', v: 'no' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'La pregunta es siempre la misma: ¿significa lo mismo el dato si lo desplazo? Si sí, compartir pesos gana; si las columnas son intercambiables, no.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'si' ? 'sí' : 'no'; }
  });

  p.keys([
    'Una red convolucional es una red densa que <strong>comparte pesos</strong>, porque una imagen no cambia de significado al desplazarla.',
    'Esa simetría de traslación se respeta con equivariancia: desplazar y filtrar da lo mismo que filtrar y desplazar.',
    'Compartir pesos baja el recuento en órdenes de magnitud, y lo que se pierde —tratar cada posición distinto— es lo que no queríamos.',
    'Los filtros no se diseñan: se aprenden con el mismo descenso de gradiente de siempre.',
    'Un filtro es tan profundo como su entrada: sobre color, un $3\\times3$ tiene 27 pesos, no 9.',
    'La agrupación no tiene parámetros, da tolerancia a desplazamientos pequeños y duplica el campo receptivo en cada paso.'
  ]);
});
