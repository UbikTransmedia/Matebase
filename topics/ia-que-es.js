/* Tema: Aprender es ajustar numeros */
Course.topic('ia-que-es', function (p) {

  p.puente('Este bloque no trae matemáticas nuevas: trae una pregunta nueva. Las herramientas ya están ' +
    'todas. De [[fn-lineales|las funciones lineales]] viene la recta con sus dos parámetros; de ' +
    '[[pe-bidimensional|regresión y correlación]], la nube de puntos y la idea de ajustar algo a ' +
    'ella; y de [[av-optimizacion|el descenso de gradiente]], la manera de encontrar el mínimo de una ' +
    'función bajando a pasitos.', 'Por dónde empezamos');

  p.text('La tesis del bloque entero, y conviene decirla en la primera página para que no se pierda ' +
    'después entre nombres raros: <strong>no hay magia</strong>. Lo que hay es el producto escalar, el ' +
    'gradiente y Bayes, repetidos millones de veces. Cada arquitectura que veremos aporta ' +
    '<em>una</em> idea matemática nueva, y todas ellas están explicadas antes en este curso.');

  p.text('Empecemos por la palabra que más se usa y menos se explica: <strong>aprender</strong>. En una ' +
    'máquina no significa entender nada. Significa algo mucho más modesto y perfectamente definible: ' +
    'tener unos números que se pueden mover, una manera de medir lo mal que van, y moverlos hasta que ' +
    'esa medida baje.');

  /* ---------------------------------------------------------------- */
  p.section('De escribir reglas a ajustar números');

  p.text('Imagina que quieres decidir si un correo es basura. La forma antigua es escribir reglas a ' +
    'mano: <em>si contiene «oferta», es basura</em>. Enseguida aparece un correo legítimo de tu ' +
    'trabajo con esa palabra, añades una excepción, aparece otro, añades otra, y al cabo de un año ' +
    'tienes mil reglas que se contradicen y nadie se atreve a tocar.');

  p.text('La otra forma es no escribir ninguna regla. Se escribe una <strong>fórmula con huecos</strong> ' +
    '—unos números que todavía no sabemos cuánto valen—, se consiguen ejemplos ya clasificados, y se ' +
    'buscan los números que hacen que la fórmula acierte en esos ejemplos. Esos números son los ' +
    '<strong>parámetros</strong>, y encontrarlos es todo lo que quiere decir «entrenar».');

  p.table(['Palabra', 'Qué es', 'En el ejemplo de la recta'], [
    ['<strong>Dato</strong>', 'lo que entra', 'la $x$ de un punto'],
    ['<strong>Etiqueta</strong>', 'la respuesta correcta, que alguien ya sabe', 'la $y$ de ese punto'],
    ['<strong>Modelo</strong>', 'la fórmula con huecos', '$\\hat{y} = mx + n$'],
    ['<strong>Parámetros</strong>', 'los huecos que se pueden mover', '$m$ y $n$'],
    ['<strong>Pérdida</strong>', 'un número que mide lo mal que va', 'el error cuadrático medio'],
    ['<strong>Entrenar</strong>', 'mover los parámetros para bajar la pérdida', 'descenso de gradiente']
  ]);

  p.note('El sombrero de $\\hat{y}$ significa «lo que el modelo predice», para distinguirlo de la $y$ ' +
    'de verdad. Cuando los dos coinciden, el modelo ha acertado en ese dato. La pérdida no es más que ' +
    'una forma de resumir en un solo número lo lejos que están todas las $\\hat{y}$ de todas las $y$.',
    null, 'La $y$ con sombrero');

  /* ---------------------------------------------------------------- */
  p.section('La pérdida: un número que resume el fracaso');

  p.text('Hace falta poder comparar dos modelos y decir cuál es mejor, y para eso hace falta un número. ' +
    'El más usado cuando la respuesta es una cantidad es el <strong>error cuadrático medio</strong>: ' +
    'para cada dato se mira cuánto se ha fallado, se eleva al cuadrado, y se promedia.');

  p.formula('L(m, n) = \\frac{1}{N}\\sum_{i=1}^{N} \\left(m x_i + n - y_i\\right)^2',
    'la pérdida de una recta',
    'Se lee: <em>«ele de eme, ene, es uno partido por ene, por el sumatorio desde i igual a uno hasta ' +
    'ene, de eme por equis sub i más ene, menos i griega sub i, al cuadrado»</em>.<br><br>El ' +
    'paréntesis es el <strong>error</strong> de un dato: lo que el modelo dice menos lo que debería ' +
    'decir. Se eleva al cuadrado por dos razones: para que los errores por arriba y por abajo no se ' +
    'cancelen, y para que fallar mucho pese mucho más que fallar poco.<br><br>Y lo importante: ' +
    '$L$ es una función <strong>de los parámetros</strong>, no de los datos. Los datos están fijos; lo ' +
    'que se mueve es $m$ y $n$. Por eso se puede derivar respecto de ellos y aplicar todo lo que ya ' +
    'sabes de optimización.');

  p.demo({
    title: 'Haz tú de algoritmo',
    intro: 'Arrastra los dos puntos de la recta y mira el número de abajo. Los segmentos rojos son los errores, y la pérdida es la media de sus cuadrados. Intenta bajarla todo lo que puedas a ojo, y fíjate en cuándo dejas de saber hacia dónde mover.',
    predice: 'Los errores se elevan al cuadrado antes de promediar. ¿Qué bajará más la pérdida: arreglar un punto que falla mucho, o dos que fallan poquito?',
    build: function (host) {
      var r = U.rng(41), datos = [], i;
      for (i = 0; i < 12; i++) {
        var x = 0.4 + i * 0.42;
        datos.push([x, 1.4 * x + 0.6 + r.real(-0.9, 0.9, 3)]);
      }
      var out = W.readout(host, '');
      function param(g) {
        var A = g.h('A'), B = g.h('B');
        var m = (B.y - A.y) / (B.x - A.x), n = A.y - m * A.x;
        return { m: m, n: n };
      }
      function perdida(m, n) {
        var s = 0;
        datos.forEach(function (q) { var e = m * q[0] + n - q[1]; s += e * e; });
        return s / datos.length;
      }
      var plot = W.plot(host, {
        xmin: -0.4, xmax: 5.8, ymin: -1, ymax: 9, height: 330,
        xlabel: 'x', ylabel: 'y',
        aria: 'Una nube de doce puntos y una recta que se puede arrastrar, con los errores marcados en rojo',
        handles: { A: { x: 0.2, y: 4.5, label: 'A', color: 2 }, B: { x: 5.4, y: 4.5, label: 'B', color: 2 } },
        draw: function (g) {
          var P = param(g);
          g.fn(function (x) { return P.m * x + P.n; }, { color: 2, w: 2.4 });
          datos.forEach(function (q) {
            var pred = P.m * q[0] + P.n;
            g.seg(q[0], q[1], q[0], pred, { color: 'bad', w: 1.6 });
            g.point(q[0], q[1], { color: 0, r: 3.4 });
          });
        },
        onDrag: function () { pinta(); }
      });
      function pinta() {
        var P = param(plot);
        var L = perdida(P.m, P.n);
        out.set('Modelo: $\\hat{y} = ' + U.fmt(P.m, 2) + 'x ' + (P.n >= 0 ? '+ ' : '− ') + U.fmt(Math.abs(P.n), 2) + '$<br>' +
          '<strong>Pérdida $L = ' + U.fmt(L, 4) + '$</strong>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)"> &nbsp;·&nbsp; la mejor posible con una recta es 0,2245.</span><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (L < 0.26 ? 'Prácticamente el óptimo. A partir de aquí, moverla a ojo ya no mejora nada.'
            : (L < 0.6 ? 'Vas bien. Fíjate en que ya no está claro hacia dónde mover: eso es lo que resuelve el gradiente.'
              : 'Todavía lejos. Mira qué segmentos rojos son más largos: son los que más pesan, porque van al cuadrado.')) +
          '</span>');
      }
      pinta();
    }
  });

  p.text('Lo que acabas de hacer es exactamente lo que hace un algoritmo de aprendizaje, con una ' +
    'diferencia: tú movías dos números mirando un dibujo, y cuando la recta estaba casi bien ya no ' +
    'sabías hacia dónde seguir. Un modelo de verdad mueve millones de números y no tiene ningún dibujo ' +
    'que mirar. Necesita una regla que le diga hacia dónde, y esa regla ya la conoces.');

  /* ---------------------------------------------------------------- */
  p.section('Y ahora, que lo haga la máquina');

  p.text('La pérdida es una función de dos variables, $m$ y $n$. Tiene, por tanto, un ' +
    '[[av-vectorial|gradiente]], y el gradiente apunta cuesta arriba. Para bajar, se da un paso en ' +
    'sentido contrario. Es [[av-optimizacion|el descenso de gradiente]] tal cual, sin un solo cambio.');

  p.formulas([
    '\\frac{\\partial L}{\\partial m} = \\frac{2}{N}\\sum_i (m x_i + n - y_i)\\,x_i',
    '\\frac{\\partial L}{\\partial n} = \\frac{2}{N}\\sum_i (m x_i + n - y_i)'
  ], 'las dos derivadas parciales de la pérdida',
    'Se leen: <em>«derivada parcial de ele respecto de eme»</em> y <em>«respecto de ene»</em>.<br><br>' +
    'Salen de derivar el cuadrado con la regla de la cadena: la derivada de $(\\ldots)^2$ es ' +
    '$2(\\ldots)$ por la derivada de lo de dentro, que respecto de $m$ es $x_i$ y respecto de $n$ es ' +
    '$1$.<br><br>Fíjate en lo que dicen: cada dato empuja los parámetros en proporción a ' +
    '<strong>cuánto se ha fallado en él</strong>. Los datos en los que el modelo acierta no empujan ' +
    'nada, porque su error es cero.');

  p.demo({
    title: 'El mismo problema, resuelto por gradiente',
    intro: 'La misma nube. Ahora la recta se mueve sola: cada paso calcula las dos derivadas y resta un poquito. Da pasos de uno en uno para ver la cuenta, o pulsa «entrenar» y míralo bajar. Cambia la tasa de aprendizaje y verás reaparecer el dilema de siempre.',
    predice: 'Antes has movido la recta a mano hasta una pérdida que no bajaba más. ¿Crees que el gradiente se quedará en el mismo sitio, o encontrará algo mejor?',
    build: function (host) {
      var r = U.rng(41), datos = [], i;
      for (i = 0; i < 12; i++) {
        var x = 0.4 + i * 0.42;
        datos.push([x, 1.4 * x + 0.6 + r.real(-0.9, 0.9, 3)]);
      }
      var m = 0, n = 4.5, eta = 0.02, pasos = 0, hist = [];
      var out = W.readout(host, '');
      function perdida(mm, nn) {
        var s = 0;
        datos.forEach(function (q) { var e = mm * q[0] + nn - q[1]; s += e * e; });
        return s / datos.length;
      }
      function grad() {
        var gm = 0, gn = 0, N = datos.length;
        datos.forEach(function (q) {
          var e = m * q[0] + n - q[1];
          gm += e * q[0]; gn += e;
        });
        return { gm: 2 * gm / N, gn: 2 * gn / N };
      }
      function paso() {
        var g = grad();
        m -= eta * g.gm; n -= eta * g.gn;
        pasos++;
        hist.push(perdida(m, n));
        if (hist.length > 200) hist.shift();
      }
      var plot = W.plot(host, {
        xmin: -0.4, xmax: 5.8, ymin: -1, ymax: 9, height: 300,
        xlabel: 'x', ylabel: 'y',
        aria: 'La misma nube de puntos con la recta que el descenso de gradiente va ajustando paso a paso',
        draw: function (g) {
          g.fn(function (x) { return m * x + n; }, { color: 2, w: 2.4 });
          datos.forEach(function (q) {
            g.seg(q[0], q[1], q[0], m * q[0] + n, { color: 'bad', w: 1.4 });
            g.point(q[0], q[1], { color: 0, r: 3.2 });
          });
        }
      });
      function pinta() {
        var g = grad(), L = perdida(m, n);
        out.set('Paso ' + pasos + ' &nbsp;·&nbsp; $\\hat{y} = ' + U.fmt(m, 3) + 'x ' +
          (n >= 0 ? '+ ' : '− ') + U.fmt(Math.abs(n), 3) + '$<br>' +
          '<strong>$L = ' + U.fmt(L, 4) + '$</strong> &nbsp;·&nbsp; ' +
          'gradiente $\\left(' + U.fmt(g.gm, 3) + ',\\ ' + U.fmt(g.gn, 3) + '\\right)$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (!isFinite(L) ? 'Se ha disparado: la tasa es demasiado grande. Reinicia y bájala.'
            : (L < 0.2246 ? 'Ha llegado al mínimo: ninguna recta lo hace mejor con estos datos.'
              : 'Cada paso mueve los parámetros en contra del gradiente, y la pérdida baja.')) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({
        host: host, porFotograma: 3,
        paso: function () { paso(); },
        pinta: pinta
      });
      W.buttons(host, [
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); m = 0; n = 4.5; pasos = 0; hist = []; pinta(); } }
      ]);
      W.slider(W.row(host), {
        label: 'tasa de aprendizaje η', min: 0.002, max: 0.09, step: 0.002, value: 0.02, dec: 3,
        on: function (v) { eta = v; pinta(); }
      });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Un paso de entrenamiento, a mano',
    enunciado: 'Con los datos $(1, 1)$, $(2, 3)$ y $(3, 4)$, el modelo $\\hat{y} = mx + n$ empieza en $m = 1$, $n = 0$. Calcular la pérdida, las dos derivadas y dar un paso con $\\eta = 0{,}1$.',
    pasos: [
      { t: '<strong>Predecir y medir el error.</strong> Con $m = 1$ y $n = 0$: $\\hat{y} = 1, 2, 3$. Los errores $\\hat{y} - y$ son $0$, $-1$ y $-1$.', antes: 'Calcula las tres predicciones y réstales la etiqueta.' },
      { t: '<strong>La pérdida.</strong> $L = \\frac{0^2 + (-1)^2 + (-1)^2}{3} = \\frac{2}{3} \\approx 0{,}667$.', antes: 'Eleva los tres errores al cuadrado y promedia.' },
      { t: '<strong>Derivada respecto de $m$.</strong> $\\frac{2}{3}\\left[0\\cdot 1 + (-1)\\cdot 2 + (-1)\\cdot 3\\right] = \\frac{2}{3}(-5) = -\\frac{10}{3}$. Cada error se pesa por su $x$.', antes: 'Multiplica cada error por su $x$, suma, y multiplica por $2/N$.' },
      { t: '<strong>Derivada respecto de $n$.</strong> $\\frac{2}{3}\\left[0 + (-1) + (-1)\\right] = -\\frac{4}{3}$. Aquí los errores se suman tal cual.', antes: 'Lo mismo, pero sin multiplicar por $x$.' },
      { t: '<strong>El paso.</strong> $m \\leftarrow 1 - 0{,}1\\cdot\\left(-\\frac{10}{3}\\right) = 1 + \\frac{1}{3} = \\frac{4}{3}$ y $n \\leftarrow 0 - 0{,}1\\cdot\\left(-\\frac{4}{3}\\right) = \\frac{2}{15}$.', antes: 'Resta $\\eta$ por la derivada. Cuidado con los signos: las dos derivadas son negativas.' },
      { t: '<strong>Comprobar que ha servido.</strong> Con $m = \\frac43$ y $n = \\frac{2}{15}$ las predicciones son $1{,}47$, $2{,}80$ y $4{,}13$, y la pérdida baja a $\\frac{62}{675} \\approx 0{,}092$. De $0{,}667$ a $0{,}092$ en un solo paso.' }
    ],
    cierre: 'Fíjate en que $n$ ha subido aunque su valor óptimo sea negativo. El gradiente no promete que cada parámetro vaya directo a su destino: promete que <em>la pérdida</em> baja. Y baja.'
  });

  p.comprueba('Durante el entrenamiento, ¿qué es exactamente lo que cambia?', [
    { t: 'Los parámetros del modelo. Los datos y la fórmula se quedan como están', ok: true, por: 'La pérdida es una función de los parámetros: los datos están fijos y la forma del modelo también. Entrenar es recorrer el espacio de los parámetros buscando el punto más bajo.' },
    { t: 'Los datos, que se van corrigiendo hasta encajar en el modelo', ok: false, por: 'Al revés: los datos son lo único intocable. Si se cambiaran para que encajen, el modelo no habría aprendido nada de la realidad.' },
    { t: 'La fórmula del modelo, que se va reescribiendo sola', ok: false, por: 'La fórmula la elige quien construye el modelo y no cambia durante el entrenamiento. Lo único que se mueve son los números que lleva dentro.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Qué cambia cuando esto se hace grande');

  p.text('Todo lo que acabas de ver son dos parámetros, doce datos y una fórmula de primero de ' +
    'Bachillerato. Un modelo de los que salen en las noticias tiene cientos de miles de millones de ' +
    'parámetros. Conviene saber desde el principio qué es lo que cambia al escalar y qué no, porque ' +
    'es menos de lo que parece.');

  p.table(['', 'Aquí', 'En un modelo grande'], [
    ['Parámetros', '2', 'de millones a cientos de miles de millones'],
    ['La idea', 'pérdida y gradiente', '<strong>exactamente la misma</strong>'],
    ['Calcular el gradiente', 'dos derivadas a mano', 'regla de la cadena capa a capa, automática'],
    ['Los datos de cada paso', 'los doce', 'una muestra al azar, un minilote'],
    ['Dónde está la dificultad', 'en ninguna parte', 'en que quepa en memoria y termine en un tiempo razonable']
  ]);

  p.note('La fila que importa es la segunda. Nada de lo que viene en el resto del bloque sustituye a ' +
    'esta idea: la amplían. Una red convolucional, un transformador o un modelo de difusión son ' +
    'maneras distintas de escribir la fórmula con huecos, pero el hueco sigue siendo un número, la ' +
    'pérdida sigue siendo un número, y entrenar sigue siendo bajar.', 'ok', 'Lo que no cambia');

  p.util('Esta misma cuenta, con dos parámetros, es lo que hay detrás de la recta de regresión que usan ' +
    'un epidemiólogo para estimar la tendencia de una curva, un agrónomo para relacionar lluvia y ' +
    'cosecha y un tasador para poner precio a un piso por sus metros cuadrados. La diferencia entre ' +
    'eso y un modelo moderno no es de tipo de matemáticas, sino de cuántos huecos tiene la fórmula y ' +
    'de cuántos ejemplos hacen falta para rellenarlos.');

  p.hist('La idea de elegir los parámetros que minimizan la suma de los errores al cuadrado es de ' +
    'principios del siglo XIX: Adrien-Marie Legendre la publicó en 1805 y Carl Friedrich Gauss ' +
    'afirmó haberla usado desde 1795, lo que provocó una disputa de prioridad bastante fea. El ' +
    'término <em>machine learning</em> lo acuñó Arthur Samuel en 1959, en un artículo del ' +
    '<em>IBM Journal</em> sobre un programa que jugaba a las damas y mejoraba jugando contra sí ' +
    'mismo. Entre una cosa y la otra hay siglo y medio, y la matemática de fondo apenas cambió: lo ' +
    'que cambió fue la cantidad de datos y la velocidad de las máquinas.');

  p.trampas([
    { e: 'Creer que el modelo «entiende» los datos', por: 'Con $m$ y $n$ no hay nada que entender: hay dos números que minimizan una suma de cuadrados. Lo mismo vale con mil millones de números, y conviene no olvidarlo al leer titulares.' },
    { e: 'Confundir el modelo con la pérdida', por: 'El modelo es $\\hat{y} = mx + n$ y contesta preguntas. La pérdida es $L(m,n)$ y solo sirve para entrenar: cuando el modelo se usa, la pérdida ya no aparece por ninguna parte.' },
    { e: 'Pensar que la pérdida depende de los datos', por: 'Depende de los <em>parámetros</em>. Los datos son constantes dentro de $L$, y por eso se puede derivar respecto de $m$ y de $n$ y aplicarle el descenso de gradiente.' },
    { e: 'Olvidar el cuadrado y sumar los errores tal cual', por: 'Con errores $+3$ y $-3$ la suma es cero y el modelo parecería perfecto. El cuadrado impide que se cancelen, y además castiga más un fallo grande que dos pequeños.' },
    { e: 'Esperar que cada parámetro vaya directo a su valor final', por: 'En el ejemplo resuelto, $n$ sube en el primer paso aunque su óptimo sea negativo. Lo que baja seguro, paso a paso, es la pérdida.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Predecir y medir el fallo',
    level: 'basico',
    gen: function (r) {
      var m = r.int(1, 5), n = r.pm(0, 4), x = r.int(1, 7), e = r.nz(-4, 4);
      return { m: m, n: n, x: x, pred: m * x + n, y: m * x + n - e, e: e };
    },
    ask: function (d) {
      return 'Un modelo es $\\hat{y} = ' + d.m + 'x ' + (d.n >= 0 ? '+ ' + d.n : '− ' + (-d.n)) +
        '$. Para el dato $x = ' + d.x + '$, cuya etiqueta es $y = ' + d.y + '$, calcula la predicción ' +
        '$\\hat{y}$ y el error $\\hat{y} - y$.';
    },
    fields: [{ name: 'p', label: 'ŷ', w: 'tiny' }, { name: 'e', label: 'error', w: 'tiny' }],
    sol: function (d) { return { p: d.pred, e: d.e }; },
    errores: [{ si: function (v, d) { return v.e === -d.e; }, msg: 'El error es la predicción menos la etiqueta, en ese orden. Lo has calculado al revés.' }],
    hint: function () { return 'Sustituye la $x$ en la fórmula, y después resta la etiqueta a lo que te ha salido.'; },
    steps: function (d) {
      return ['$\\hat{y} = ' + d.m + '\\cdot' + d.x + ' ' + (d.n >= 0 ? '+ ' + d.n : '− ' + (-d.n)) + ' = ' + d.pred + '$',
        'Error $= \\hat{y} - y = ' + d.pred + ' - ' + d.y + ' = ' + U.fmts(d.e, 0) + '$',
        d.e > 0 ? 'Positivo: el modelo se ha pasado por arriba.' : 'Negativo: el modelo se ha quedado corto.'];
    },
    answer: function (d) { return 'ŷ = ' + d.pred + ', error = ' + U.fmts(d.e, 0); }
  });

  p.exercise({
    title: 'La pérdida de un modelo',
    level: 'basico',
    gen: function (r) {
      var es = [], i;
      for (i = 0; i < 4; i++) es.push(r.int(-3, 3));
      if (es.every(function (e) { return e === 0; })) return null;
      var suma = es.reduce(function (a, e) { return a + e * e; }, 0);
      return { es: es, suma: suma, L: suma / 4 };
    },
    ask: function (d) {
      return 'Un modelo comete, en cuatro datos, los errores $' + d.es.map(function (e) { return U.fmts(e, 0); }).join('$, $') +
        '$. ¿Cuánto vale el error cuadrático medio? (dos decimales)';
    },
    fields: [{ name: 'l', label: 'L', w: 'tiny' }],
    sol: function (d) { return { l: U.round(d.L, 6) }; },
    dec: 2,
    /* Promediar sin elevar al cuadrado da lo mismo que hacerlo bien
       cuando la suma de los errores coincide con la de sus cuadrados
       (por ejemplo, los cuatro iguales a 1). El guarda compara con la
       solucion, que es la forma general de no acusar a quien acierta. */
    errores: [{ si: function (v, d) { var s = d.es.reduce(function (a, e) { return a + e; }, 0) / 4; return Math.abs(s - d.L) > 0.001 && Math.abs(v.l - s) < 0.005; }, msg: 'Has promediado los errores sin elevarlos al cuadrado, y los positivos se han cancelado con los negativos. Eso es justo lo que el cuadrado evita.' }],
    hint: function () { return 'Eleva cada error al cuadrado, súmalos y divide entre cuántos son.'; },
    steps: function (d) {
      return ['$' + d.es.map(function (e) { return '(' + U.fmts(e, 0) + ')^2'; }).join(' + ') + ' = ' + d.suma + '$',
        '$L = \\dfrac{' + d.suma + '}{4} = ' + U.fmt(d.L, 2) + '$',
        'Al cuadrado, un error de 3 pesa nueve veces más que uno de 1: por eso el ajuste se preocupa sobre todo de los fallos gordos.'];
    },
    answer: function (d) { return U.fmt(d.L, 2); }
  });

  p.exercise({
    title: 'Cada cosa por su nombre',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'los metros cuadrados de un piso, que entran en el modelo', v: 'dato' },
        { t: 'el precio real al que se vendió ese piso', v: 'etiqueta' },
        { t: 'la fórmula $\\hat{y} = mx + n$', v: 'modelo' },
        { t: 'los números $m$ y $n$', v: 'parametros' },
        { t: 'el error cuadrático medio sobre todos los pisos', v: 'perdida' },
        { t: 'el precio que el modelo predice para un piso nuevo', v: 'prediccion' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un modelo que estima el precio de un piso, ¿qué es esto: ' + d.c.t + '?'; },
    fields: [{ name: 'q', label: 'Es', opts: [
      { t: 'un dato', v: 'dato' }, { t: 'una etiqueta', v: 'etiqueta' },
      { t: 'el modelo', v: 'modelo' }, { t: 'los parámetros', v: 'parametros' },
      { t: 'la pérdida', v: 'perdida' }, { t: 'una predicción', v: 'prediccion' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Lo que entra es el dato; lo que alguien ya sabía, la etiqueta; la fórmula, el modelo; sus huecos, los parámetros; lo que mide el fracaso, la pérdida.'; },
    steps: function (d) {
      var por = {
        dato: 'Es lo que entra en el modelo: el dato.',
        etiqueta: 'Es la respuesta correcta que alguien ya conocía: la etiqueta. Sin ellas no se puede entrenar así.',
        modelo: 'Es la fórmula con huecos: el modelo.',
        parametros: 'Son los huecos que el entrenamiento mueve: los parámetros.',
        perdida: 'Es el número que resume lo mal que va: la pérdida. Solo se usa para entrenar.',
        prediccion: 'Es lo que el modelo contesta: una predicción, la $\\hat{y}$.'
      };
      return [por[d.c.v]];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Un paso de entrenamiento',
    level: 'medio',
    gen: function (r) {
      var m = r.int(1, 4), n = r.pm(0, 3);
      var e1 = r.int(-2, 2), e2 = r.int(-2, 2);
      if (e1 === 0 && e2 === 0) return null;
      /* Con dos datos en x = 1 y x = 2, el factor 2/N vale 1 y las dos
         derivadas salen enteras. */
      var y1 = m * 1 + n - e1, y2 = m * 2 + n - e2;
      var gm = e1 * 1 + e2 * 2, gn = e1 + e2;
      return { m: m, n: n, y1: y1, y2: y2, gm: gm, gn: gn, nm: m - 0.1 * gm, nn: n - 0.1 * gn };
    },
    ask: function (d) {
      return 'El modelo $\\hat{y} = ' + d.m + 'x ' + (d.n >= 0 ? '+ ' + d.n : '− ' + (-d.n)) +
        '$ se entrena con dos datos: $(1,\\ ' + d.y1 + ')$ y $(2,\\ ' + d.y2 + ')$. Con $N = 2$ el ' +
        'factor $\\frac{2}{N}$ vale 1, así que $\\frac{\\partial L}{\\partial m} = \\sum e_i x_i$ y ' +
        '$\\frac{\\partial L}{\\partial n} = \\sum e_i$. Da un paso con $\\eta = 0{,}1$ y di dónde ' +
        'quedan los dos parámetros. (Dos decimales.)';
    },
    fields: [{ name: 'm', label: 'm nueva', w: 'tiny' }, { name: 'n', label: 'n nueva', w: 'tiny' }],
    sol: function (d) { return { m: U.round(d.nm, 6), n: U.round(d.nn, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { return (d.gm !== 0 || d.gn !== 0) && Math.abs(v.m - (d.m + 0.1 * d.gm)) < 0.005 && Math.abs(v.n - (d.n + 0.1 * d.gn)) < 0.005; }, msg: 'Has sumado el gradiente en vez de restarlo. El gradiente apunta cuesta arriba, y aquí se quiere bajar.' }],
    hint: function (d) { return 'Primero los dos errores: $\\hat{y} - y$ en cada dato. Después las dos sumas, y por último restar $0{,}1$ por cada una.'; },
    steps: function (d) {
      var e1 = d.m + d.n - d.y1, e2 = 2 * d.m + d.n - d.y2;
      return ['Errores: $' + (d.m + d.n) + ' - ' + d.y1 + ' = ' + U.fmts(e1, 0) + '$ y $' + (2 * d.m + d.n) + ' - ' + d.y2 + ' = ' + U.fmts(e2, 0) + '$.',
        '$\\frac{\\partial L}{\\partial m} = ' + U.fmts(e1, 0) + '\\cdot 1 + ' + U.fmts(e2, 0) + '\\cdot 2 = ' + U.fmts(d.gm, 0) + '$',
        '$\\frac{\\partial L}{\\partial n} = ' + U.fmts(e1, 0) + ' + ' + U.fmts(e2, 0) + ' = ' + U.fmts(d.gn, 0) + '$',
        '$m = ' + d.m + ' - 0{,}1\\cdot(' + U.fmts(d.gm, 0) + ') = ' + U.fmt(d.nm, 2) + '$ y $n = ' + d.n + ' - 0{,}1\\cdot(' + U.fmts(d.gn, 0) + ') = ' + U.fmt(d.nn, 2) + '$'];
    },
    answer: function (d) { return 'm = ' + U.fmt(d.nm, 2) + ', n = ' + U.fmt(d.nn, 2); }
  });

  p.exercise({
    title: '¿Cuál de los dos modelos es mejor?',
    level: 'avanzado',
    gen: function (r) {
      var datos = [[1, r.int(2, 5)], [2, r.int(4, 8)], [3, r.int(6, 11)]];
      function L(m, n) {
        var s = 0;
        datos.forEach(function (q) { var e = m * q[0] + n - q[1]; s += e * e; });
        return s / 3;
      }
      var A = { m: r.int(1, 3), n: r.pm(0, 2) }, B = { m: r.int(1, 3), n: r.pm(0, 2) };
      var la = L(A.m, A.n), lb = L(B.m, B.n);
      if (Math.abs(la - lb) < 0.2) return null;
      return { datos: datos, A: A, B: B, la: la, lb: lb, mejor: la < lb ? 'A' : 'B' };
    },
    ask: function (d) {
      return 'Los datos son $(1,\\ ' + d.datos[0][1] + ')$, $(2,\\ ' + d.datos[1][1] + ')$ y $(3,\\ ' +
        d.datos[2][1] + ')$. El modelo <strong>A</strong> es $\\hat{y} = ' + d.A.m + 'x ' +
        (d.A.n >= 0 ? '+ ' + d.A.n : '− ' + (-d.A.n)) + '$ y el <strong>B</strong> es $\\hat{y} = ' +
        d.B.m + 'x ' + (d.B.n >= 0 ? '+ ' + d.B.n : '− ' + (-d.B.n)) + '$. ¿Cuál tiene menos pérdida, ' +
        'y cuánto vale la del mejor? (dos decimales)';
    },
    fields: [
      { name: 'q', label: 'El mejor', opts: [{ t: 'el modelo A', v: 'A' }, { t: 'el modelo B', v: 'B' }] },
      { name: 'l', label: 'su pérdida', w: 'tiny' }
    ],
    sol: function (d) { return { q: d.mejor, l: U.round(Math.min(d.la, d.lb), 6) }; },
    dec: 2,
    hint: function () { return 'Calcula las tres predicciones de cada modelo, sus errores, elévalos al cuadrado y promedia. Gana el que dé el número más pequeño.'; },
    steps: function (d) {
      return ['Pérdida de A: $' + U.fmt(d.la, 2) + '$.',
        'Pérdida de B: $' + U.fmt(d.lb, 2) + '$.',
        'Gana el <strong>' + d.mejor + '</strong>, con $' + U.fmt(Math.min(d.la, d.lb), 2) + '$.',
        'Comparar modelos es exactamente esto: un solo número por modelo. Entrenar es buscar el que lo hace mínimo.'];
    },
    answer: function (d) { return 'el ' + d.mejor + ', con ' + U.fmt(Math.min(d.la, d.lb), 2); }
  });

  p.keys([
    'Aprender, en una máquina, es tener parámetros que se pueden mover, una pérdida que mide lo mal que van, y moverlos para que baje.',
    'Vocabulario: dato, etiqueta, modelo, parámetros, pérdida y predicción. Todo el bloque usa estas seis palabras.',
    'La pérdida es función <strong>de los parámetros</strong>, no de los datos: por eso se puede derivar y aplicarle el descenso de gradiente.',
    'El error cuadrático medio eleva al cuadrado para que los fallos no se cancelen y para que los grandes pesen más.',
    'Cada dato empuja los parámetros en proporción a cuánto se ha fallado en él; donde el modelo acierta, no empuja nada.',
    'Al escalar a miles de millones de parámetros la idea no cambia: cambian el tamaño y la dificultad de hacerlo caber.'
  ]);
});
