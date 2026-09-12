/* Tema: De decidir a dudar */
Course.topic('ia-sigmoide', function (p) {

  p.puente('La neurona ya la conoces: en [[cib-neurona|McCulloch-Pitts y el perceptrón]] se vio que suma ' +
    'sus entradas multiplicadas por pesos y se dispara si pasa de un umbral, y que aprende corrigiendo ' +
    'los pesos cuando falla. Este tema cambia <strong>una sola pieza</strong> de aquella neurona, la ' +
    'del umbral, usando [[fn-exp-log|la exponencial]]. Y hay que cambiarla por un motivo que solo se ' +
    've mirando [[fn-derivadas|su derivada]].');

  p.text('El perceptrón funciona, pero su regla de aprendizaje es un apaño: solo actúa cuando se ha ' +
    'equivocado, y no se deduce de ningún principio. Nos gustaría entrenarlo como en ' +
    '[[ia-que-es|el primer tema]] —escribir una pérdida y bajar por su gradiente—, y resulta que ' +
    '<strong>no se puede</strong>. El culpable es el escalón.');

  /* ---------------------------------------------------------------- */
  p.section('El escalón mata el gradiente');

  p.text('La neurona clásica calcula $z = \\vec w \\cdot \\vec x + b$ y después aplica un escalón: ' +
    'contesta 1 si $z > 0$ y 0 si no. Pregúntate cuánto vale la derivada de esa función. En todos los ' +
    'puntos menos uno, la respuesta es <strong>cero</strong>: la función es plana a la izquierda y ' +
    'plana a la derecha. Y en el cero mismo, no existe.');

  p.note('Un gradiente de cero significa que la pérdida no cambia si muevo un poco los pesos, así que ' +
    'el descenso de gradiente <strong>no sabe hacia dónde ir</strong>: da un paso de tamaño cero y se ' +
    'queda donde estaba, para siempre. No es que converja despacio; es que no se mueve. Con una sola ' +
    'neurona aún se puede usar la regla del perceptrón, pero con varias capas no hay nada que hacer.',
    'warn', 'Por qué el escalón bloquea el aprendizaje');

  p.text('La salida es sustituirlo por una curva que haga <em>casi</em> lo mismo pero que tenga ' +
    'pendiente en todas partes. La más usada es la <strong>sigmoide</strong>.');

  p.formula('\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    'la función sigmoide (o logística)',
    'Se lee: <em>«sigma de zeta es uno partido por uno más e elevado a menos zeta»</em>. La letra ' +
    '$\\sigma$ es la sigma griega minúscula.<br><br>Vale $0{,}5$ en $z = 0$, tiende a 1 cuando $z$ ' +
    'crece y a 0 cuando decrece, y nunca llega del todo a ninguno de los dos. Es un escalón al que le ' +
    'han limado la esquina: parece un escalón visto de lejos, pero de cerca es una curva suave, y esa ' +
    'suavidad es exactamente lo que hacía falta.');

  p.demo({
    title: 'El escalón, la sigmoide y sus pendientes',
    intro: 'Arriba, las dos funciones; abajo, sus derivadas. Sube la pendiente de la sigmoide y verás que se acerca al escalón todo lo que quieras. Mira lo que le pasa entonces a la derivada, que es lo que usa el entrenamiento.',
    predice: 'Al hacer la sigmoide cada vez más empinada se parecerá más al escalón. ¿Qué crees que le pasará a su derivada: se hará más grande, más pequeña, o más estrecha?',
    build: function (host) {
      var k = 1;
      var out = W.readout(host, '');
      function sig(z) { return 1 / (1 + Math.exp(-k * z)); }
      var plot = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -0.9, ymax: 1.35, height: 320,
        xlabel: 'z', ylabel: null,
        aria: 'La función escalón y la sigmoide con sus derivadas dibujadas debajo del eje',
        draw: function (g) {
          g.hline(0, { color: 'axis', w: 1 });
          g.hline(1, { color: 'axis', w: 0.8, dash: [4, 4] });
          /* el escalón, en dos tramos para que no se dibuje la vertical */
          g.seg(-6, 0, 0, 0, { color: 1, w: 2.4 });
          g.seg(0, 1, 6, 1, { color: 1, w: 2.4 });
          g.point(0, 0, { color: 1, r: 3.5, hollow: true });
          g.point(0, 1, { color: 1, r: 3.5 });
          g.fn(sig, { color: 2, w: 2.6 });
          /* las derivadas, desplazadas hacia abajo para poder compararlas */
          g.hline(-0.75, { color: 'axis', w: 0.8, dash: [3, 3] });
          g.seg(-6, -0.75, 6, -0.75, { color: 1, w: 2.2 });
          g.fn(function (z) { var s = sig(z); return -0.75 + k * s * (1 - s); }, { color: 2, w: 2.4 });
          g.text(-5.7, 1.18, 'escalón', { color: 1, size: 12 });
          g.text(-5.7, 1.02, 'sigmoide', { color: 2, size: 12 });
          g.text(-5.7, -0.55, 'sus derivadas', { color: 'ink-soft', size: 12 });
        }
      });
      function pinta() {
        var maxDer = k / 4;
        out.set('Pendiente $k = ' + U.fmt(k, 1) + '$ &nbsp;·&nbsp; la derivada de la sigmoide vale como ' +
          'mucho <strong>' + U.fmt(maxDer, 3) + '</strong>, en $z = 0$.<br>' +
          'La del escalón vale <strong>0</strong> en todas partes (y en $z = 0$ ni existe).<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (k > 7 ? 'Ya casi es un escalón: la derivada se ha vuelto un pico altísimo y estrechísimo, y fuera de él es prácticamente cero. El entrenamiento se queda sin señal en casi todo el eje.'
            : 'Cuanto más suave, más ancha es la zona en la que la derivada dice algo. Ahí es donde el gradiente puede trabajar.') +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'pendiente k de la sigmoide', min: 0.4, max: 12, step: 0.2, value: 1, dec: 1,
        on: function (v) { k = v; pinta(); }
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Su derivada se escribe con ella misma');

  p.text('La sigmoide tiene una propiedad que la ha hecho famosa y que vale la pena deducir, porque es ' +
    'un ejercicio de derivadas de los de toda la vida: su derivada se expresa con la propia función, ' +
    'sin exponenciales a la vista.');

  p.formula('\\sigma\'(z) = \\sigma(z)\\,\\bigl(1 - \\sigma(z)\\bigr)',
    'la derivada de la sigmoide',
    'Se lee: <em>«sigma prima de zeta es sigma de zeta por, uno menos sigma de zeta»</em>.<br><br>' +
    'Sale derivando $\\sigma = (1 + e^{-z})^{-1}$ con la regla de la cadena: ' +
    '$\\sigma\' = -(1+e^{-z})^{-2}\\cdot(-e^{-z}) = \\frac{e^{-z}}{(1+e^{-z})^2}$, y ese cociente se ' +
    'reordena como $\\frac{1}{1+e^{-z}}\\cdot\\frac{e^{-z}}{1+e^{-z}} = \\sigma\\,(1-\\sigma)$.<br><br>' +
    'Lo práctico: al entrenar ya se ha calculado $\\sigma(z)$ para dar la respuesta, así que la ' +
    'derivada sale <strong>gratis</strong>, sin volver a tocar la exponencial. Vale como mucho ' +
    '$0{,}25$, en $z = 0$.');

  p.note('Esa cota de $0{,}25$ tiene una consecuencia que reaparecerá: si se encadenan muchas capas de ' +
    'sigmoides, el gradiente se multiplica por un número menor que $0{,}25$ en cada una, y tras diez ' +
    'capas queda multiplicado por menos de $10^{-6}$. Es el <em>desvanecimiento del gradiente</em>, y ' +
    'es la razón de que hoy se use casi siempre otra activación en las capas interiores.', null,
    'Una cota que traerá cola');

  /* ---------------------------------------------------------------- */
  p.section('Y además, la respuesta significa algo');

  p.text('El escalón contestaba «sí» o «no». La sigmoide contesta un número entre 0 y 1, y ese número se ' +
    'puede leer como una <strong>probabilidad</strong>: cuánta confianza tiene el modelo en que el ' +
    'dato sea de la clase 1. A una neurona con sigmoide entrenada así se le llama ' +
    '<strong>regresión logística</strong>, y es uno de los modelos más usados que existen.');

  p.formula('P(y = 1 \\mid \\vec x) = \\sigma\\bigl(\\vec w \\cdot \\vec x + b\\bigr)',
    'regresión logística',
    'Se lee: <em>«la probabilidad de que i griega valga uno, dado equis, es sigma de doble uve escalar ' +
    'equis más be»</em>.<br><br>Fíjate en que <strong>la frontera sigue siendo una recta</strong>: ' +
    'decidir con umbral $0{,}5$ es lo mismo que pedir $\\sigma(z) > 0{,}5$, o sea $z > 0$, o sea ' +
    '$\\vec w\\cdot\\vec x + b > 0$. Lo que se ha ganado no es una frontera mejor: es ' +
    '<em>graduación</em>. El modelo ya no dice solo de qué lado cae, sino con cuánta seguridad.');

  p.demo({
    title: 'Entrenar una neurona de verdad',
    intro: 'Dos nubes y una sola neurona con sigmoide. El fondo es la probabilidad que da el modelo en cada punto: cuanto más intenso, más seguro. Pulsa entrenar y mira bajar la pérdida mientras la frontera se coloca sola, con descenso de gradiente y nada más.',
    predice: 'La neurona empieza con los pesos casi a cero, así que contesta ~0,5 en todas partes. ¿Qué esperas ver primero: que la frontera gire hasta orientarse bien, o que el degradado se vuelva más nítido?',
    build: function (host) {
      var D = NN.datos.nubes(U.rng(23), 80, 1.5);
      var X = NN.deFilas(D.X);
      var Y = NN.t([D.X.length, 1], D.y);
      var r = U.rng(2);
      var Wp = NN.param([2, 1], r, 0.05), bp = NN.constante([1], 0);
      var opt = NN.SGD([Wp, bp], { lr: 0.5, momento: 0.9 });
      var pasos = 0, perdida = 0, hist = [];

      function paso() {
        NN.limpia();
        var z = NN.suma(NN.mm(X, Wp), bp);
        var pred = NN.sigmoide(z);
        var L = NN.ecm(pred, Y);
        NN.atras(L, [Wp, bp]);
        opt.paso();
        perdida = L.v[0];
        pasos++;
        if (pasos % 2 === 0) { hist.push(perdida); if (hist.length > 120) hist.shift(); }
      }
      function prob(x, y) {
        return 1 / (1 + Math.exp(-(Wp.v[0] * x + Wp.v[1] * y + bp.v[0])));
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -5.5, xmax: 5.5, ymin: -4.5, ymax: 4.5, height: 330, equal: true,
        aria: 'Dos nubes de puntos con el fondo coloreado según la probabilidad que asigna la neurona, y la frontera del cincuenta por ciento',
        draw: function (g) {
          var paso2 = 0.22, x, y;
          for (x = -5.5; x <= 5.5; x += paso2) {
            for (y = -4.5; y <= 4.5; y += paso2) {
              var q = prob(x, y);
              g.rect(x, y, paso2, paso2, { color: q > 0.5 ? 2 : 0, fill: q > 0.5 ? 2 : 0, fillAlpha: Math.abs(q - 0.5) * 0.5, w: 0 });
            }
          }
          if (Math.abs(Wp.v[1]) > 1e-6) {
            g.fn(function (x2) { return -(Wp.v[0] * x2 + bp.v[0]) / Wp.v[1]; }, { color: 'ink', w: 2.4 });
          }
          D.X.forEach(function (q, i) { g.point(q[0], q[1], { color: D.y[i] ? 2 : 0, r: 3.6 }); });
        }
      });
      function aciertos() {
        var bien = 0;
        D.X.forEach(function (q, i) { if ((prob(q[0], q[1]) > 0.5 ? 1 : 0) === D.y[i]) bien++; });
        return 100 * bien / D.X.length;
      }
      function pinta() {
        out.set('Paso ' + pasos + ' &nbsp;·&nbsp; pérdida ' + U.fmt(perdida, 4) +
          ' &nbsp;·&nbsp; acierta el <strong>' + U.fmt(aciertos(), 1) + ' %</strong><br>' +
          '$\\vec w = (' + U.fmt(Wp.v[0], 3) + ',\\ ' + U.fmt(Wp.v[1], 3) + ')$, $b = ' + U.fmt(bp.v[0], 3) + '$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (pasos === 0 ? 'Los pesos empiezan casi a cero: la neurona contesta 0,5 en todas partes y no se moja.'
            : 'El degradado mide la confianza: pálido junto a la frontera, intenso lejos. Los pesos crecen en módulo a medida que el modelo se convence.') +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 4, paso: paso, pinta: pinta });
      W.buttons(host, [
        { t: 'Un paso', on: function () { paso(); pinta(); } },
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: '↺ Reiniciar', on: function () {
          bucle.pausa();
          var r2 = U.rng(2);
          var nuevo = NN.param([2, 1], r2, 0.05);
          Wp.v[0] = nuevo.v[0]; Wp.v[1] = nuevo.v[1]; bp.v[0] = 0;
          opt = NN.SGD([Wp, bp], { lr: 0.5, momento: 0.9 });
          pasos = 0; perdida = 0; hist = [];
          pinta();
        } }
      ]);
      pinta();
    }
  });

  p.ejemplo({
    title: 'Una neurona logística, número a número',
    enunciado: 'Una neurona tiene $\\vec w = (2, -1)$ y $b = -1$. Para el dato $\\vec x = (1, 1)$, cuya etiqueta es $y = 1$, calcular $z$, la probabilidad, la derivada de la sigmoide y el gradiente respecto de $w_1$ con pérdida cuadrática.',
    pasos: [
      { t: '<strong>La suma ponderada.</strong> $z = 2\\cdot 1 + (-1)\\cdot 1 + (-1) = 0$. Justo en la frontera.', antes: 'Producto escalar más el sesgo.' },
      { t: '<strong>La probabilidad.</strong> $\\sigma(0) = \\frac{1}{1 + e^{0}} = \\frac{1}{2} = 0{,}5$. El modelo no se moja: está exactamente en la frontera.', antes: '¿Cuánto vale la sigmoide en cero?' },
      { t: '<strong>La derivada.</strong> $\\sigma\'(0) = 0{,}5\\cdot(1 - 0{,}5) = 0{,}25$, que es su valor máximo. En la frontera es donde el gradiente tiene más fuerza.', antes: 'Usa $\\sigma(1-\\sigma)$ con el valor que acabas de calcular.' },
      { t: '<strong>El gradiente.</strong> Con $L = (\\sigma(z) - y)^2$, la regla de la cadena da $\\frac{\\partial L}{\\partial w_1} = 2(\\sigma - y)\\cdot\\sigma\'\\cdot x_1 = 2(0{,}5 - 1)\\cdot 0{,}25\\cdot 1 = -0{,}25$.', antes: 'Tres factores: la derivada de la pérdida, la de la sigmoide y la de $z$ respecto de $w_1$, que es $x_1$.' },
      { t: '<strong>El paso.</strong> Con $\\eta = 0{,}4$: $w_1 \\leftarrow 2 - 0{,}4\\cdot(-0{,}25) = 2{,}1$. Ha subido, que es lo que hace falta para que $z$ crezca y la probabilidad se acerque a 1, que es la etiqueta.' }
    ],
    cierre: 'Compara esto con el perceptrón: allí la corrección era una regla dada, que solo actuaba al fallar. Aquí sale de derivar una pérdida, funciona aunque la respuesta ya sea casi correcta, y —lo importante— se puede encadenar por muchas capas.'
  });

  p.comprueba('Al cambiar el escalón por la sigmoide, ¿qué tipos de datos puede separar ahora la neurona?', [
    { t: 'Los mismos: la frontera sigue siendo una recta, y XOR sigue siendo imposible', ok: true, por: 'Decidir con umbral 0,5 equivale a $\\vec w\\cdot\\vec x + b > 0$, que es exactamente la misma recta del perceptrón. Lo que se gana es poder entrenar con gradiente y dar una confianza, no una frontera nueva.' },
    { t: 'Cualquiera, porque la sigmoide es una curva', ok: false, por: 'La curva está en cómo se pasa de un lado al otro, no en la forma de la frontera. El conjunto donde $\\sigma = 0{,}5$ sigue siendo el conjunto donde $z = 0$: una recta.' },
    { t: 'Ninguno: la sigmoide solo sirve para dar probabilidades', ok: false, por: 'Separa exactamente igual de bien que el perceptrón, y además se puede entrenar por gradiente, que es lo que abre la puerta a apilar capas.' }
  ]);

  p.text('Esa es la clave para entender lo que viene. La sigmoide <strong>no</strong> ha ampliado lo que ' +
    'una neurona puede separar: XOR sigue siendo imposible, exactamente como se demostró con el ' +
    'perceptrón. Lo que ha hecho es volverla <strong>derivable</strong>, y por tanto apilable. En ' +
    'cuanto se puedan poner varias capas y propagar el gradiente por todas, el límite desaparecerá.');

  p.util('La regresión logística es, con diferencia, el modelo estadístico más usado en medicina. Las ' +
    'escalas de riesgo cardiovascular, los modelos que estiman la probabilidad de que un tumor sea ' +
    'maligno a partir de unas medidas y buena parte de la epidemiología están construidos con esto: ' +
    'unos pocos pesos, una sigmoide, y una salida que se lee como probabilidad y se puede discutir ' +
    'coeficiente a coeficiente. En banca calcula la probabilidad de impago, y en cualquier empresa, la ' +
    'de que un cliente se marche. Cuando alguien dice «el modelo da un 30 % de riesgo», casi siempre ' +
    'hay una sigmoide debajo.');

  p.hist('La curva la introdujo el matemático belga Pierre-François Verhulst entre 1838 y 1845 para ' +
    'modelar el crecimiento de una población que encuentra un límite, y la llamó <em>logística</em>. ' +
    'Tardó un siglo en volver: Joseph Berkson propuso en 1944 usarla para modelar probabilidades y ' +
    'acuñó el término <em>logit</em>, en abierta polémica con los partidarios de la curva normal. ' +
    'David Cox consolidó el método en 1958. Que la misma función describa una población de bacterias, ' +
    'la probabilidad de un diagnóstico y la salida de una neurona artificial no es casualidad: es lo ' +
    'que sale siempre que algo crece en proporción a lo que tiene y a lo que le falta.');

  p.trampas([
    { e: 'Creer que la sigmoide permite fronteras curvas', por: 'El conjunto donde vale $0{,}5$ es donde $z = 0$: una recta. La curvatura está en la confianza, no en la frontera.' },
    { e: 'Intentar entrenar el escalón con descenso de gradiente', por: 'Su derivada es cero en todas partes, así que el paso es de tamaño cero y los pesos no se mueven nunca. Es el motivo entero de este tema.' },
    { e: 'Usar sigmoides en todas las capas de una red profunda', por: 'La derivada no pasa de $0{,}25$, así que diez capas multiplican el gradiente por menos de $10^{-6}$ y las primeras capas dejan de aprender.' },
    { e: 'Leer la salida como una probabilidad bien calibrada sin comprobarlo', por: 'Se puede leer como probabilidad, pero que un 0,8 signifique de verdad «ocurre 8 de cada 10 veces» hay que verificarlo aparte: depende de cómo se haya entrenado.' },
    { e: 'Derivar la sigmoide desde cero cada vez', por: 'Si ya has calculado $\\sigma(z)$ para responder, la derivada es $\\sigma(1-\\sigma)$ y no cuesta nada. Volver a la exponencial es trabajo tirado.' }
  ]);

  p.note('Una última cosa, que es la que enlaza con el tema siguiente. Para entrenar la demo se ha usado ' +
    'el <strong>error cuadrático</strong>, que es el que ya conocíamos. Funciona, pero no es el mejor ' +
    'para clasificar: cuando el modelo se equivoca con mucha seguridad, $\\sigma\'$ vale casi cero y ' +
    'el gradiente casi se apaga justo cuando más falta hacía. El tema siguiente cambia la pérdida por ' +
    'una que arregla eso.', 'ok', 'Lo que queda cojo');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Calcular una sigmoide',
    level: 'basico',
    gen: function (r) {
      var z = r.pick([-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3]);
      return { z: z, s: 1 / (1 + Math.exp(-z)) };
    },
    ask: function (d) {
      return 'Una neurona calcula $z = ' + U.fmt(d.z, 1) + '$. ¿Qué probabilidad devuelve, es decir, ' +
        'cuánto vale $\\sigma(z)$? (cuatro decimales)';
    },
    fields: [{ name: 's', label: 'σ(z)', w: 'tiny' }],
    sol: function (d) { return { s: U.round(d.s, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var otro = 1 - d.s; return Math.abs(otro - d.s) > 0.001 && Math.abs(v.s - otro) < 0.0005; }, msg: 'Ese es $\\sigma(-z)$: se te ha ido un signo en el exponente. Recuerda que la sigmoide lleva $e^{-z}$ en el denominador.' }],
    hint: function (d) { return '$\\sigma(z) = \\frac{1}{1 + e^{-z}}$. Con $z = ' + U.fmt(d.z, 1) + '$, el exponente es $' + U.fmt(-d.z, 1) + '$.'; },
    steps: function (d) {
      return ['$e^{' + U.fmt(-d.z, 1) + '} = ' + U.fmt(Math.exp(-d.z), 4) + '$',
        '$\\sigma = \\dfrac{1}{1 + ' + U.fmt(Math.exp(-d.z), 4) + '} = ' + U.fmt(d.s, 4) + '$',
        d.z === 0 ? 'En cero vale exactamente 0,5: la neurona está en la frontera y no se moja.'
          : (d.z > 0 ? 'Positivo: pasa de 0,5, así que el modelo apuesta por la clase 1.' : 'Negativo: queda por debajo de 0,5, así que el modelo apuesta por la clase 0.')];
    },
    answer: function (d) { return U.fmt(d.s, 4); }
  });

  p.exercise({
    title: 'La derivada, sin exponenciales',
    level: 'basico',
    gen: function (r) {
      var s = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 0.95]);
      return { s: s, d: s * (1 - s) };
    },
    ask: function (d) {
      return 'Una neurona ya ha calculado $\\sigma(z) = ' + U.fmt(d.s, 2) + '$. ¿Cuánto vale ' +
        '$\\sigma\'(z)$, sin volver a tocar la exponencial? (cuatro decimales)';
    },
    fields: [{ name: 'd', label: 'σ\'(z)', w: 'tiny' }],
    sol: function (d) { return { d: U.round(d.d, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { return Math.abs(d.s - d.d) > 0.001 && Math.abs(v.d - d.s) < 0.0005; }, msg: 'Eso es $\\sigma$, no su derivada. Falta multiplicar por $1 - \\sigma$.' }],
    hint: function () { return '$\\sigma\' = \\sigma(1-\\sigma)$: el valor que ya tienes, por su complementario.'; },
    steps: function (d) {
      return ['$\\sigma\' = ' + U.fmt(d.s, 2) + '\\cdot(1 - ' + U.fmt(d.s, 2) + ') = ' + U.fmt(d.s, 2) + '\\cdot' + U.fmt(1 - d.s, 2) + ' = ' + U.fmt(d.d, 4) + '$',
        d.s === 0.5 ? 'Es el máximo posible, 0,25: en la frontera es donde el gradiente empuja más fuerte.'
          : 'Lejos de la frontera la derivada se hace pequeña, y el aprendizaje se frena. Por eso importa la pérdida que se elija.'];
    },
    answer: function (d) { return U.fmt(d.d, 4); }
  });

  p.exercise({
    title: 'De los pesos a la decisión',
    level: 'medio',
    gen: function (r) {
      var w = [r.nz(-3, 3), r.nz(-3, 3)], b = r.int(-3, 3);
      var x = [r.int(-3, 3), r.int(-3, 3)];
      var z = w[0] * x[0] + w[1] * x[1] + b;
      if (z === 0) return null;
      return { w: w, b: b, x: x, z: z, s: 1 / (1 + Math.exp(-z)), clase: z > 0 ? '1' : '0' };
    },
    ask: function (d) {
      return 'Una neurona logística tiene $\\vec w = (' + d.w.join(',\\ ') + ')$ y $b = ' + d.b +
        '$. Para el dato $\\vec x = (' + d.x.join(',\\ ') + ')$, calcula $z$, la probabilidad y la ' +
        'clase que predice con umbral $0{,}5$. (cuatro decimales la probabilidad)';
    },
    fields: [
      { name: 'z', label: 'z', w: 'tiny' }, { name: 's', label: 'σ(z)', w: 'tiny' },
      { name: 'c', label: 'Clase', opts: [{ t: 'clase 0', v: '0' }, { t: 'clase 1', v: '1' }] }
    ],
    sol: function (d) { return { z: d.z, s: U.round(d.s, 8), c: d.clase }; },
    dec: { s: 4 },
    tol: 1e-6,
    hint: function () { return 'Producto escalar más sesgo, después la sigmoide. Y el umbral 0,5 en la probabilidad es lo mismo que el signo de $z$.'; },
    steps: function (d) {
      return ['$z = (' + d.w[0] + ')(' + d.x[0] + ') + (' + d.w[1] + ')(' + d.x[1] + ') + (' + d.b + ') = ' + d.z + '$',
        '$\\sigma(' + d.z + ') = ' + U.fmt(d.s, 4) + '$',
        'Como $z$ es ' + (d.z > 0 ? 'positivo, la probabilidad pasa de 0,5: <strong>clase 1</strong>.' : 'negativo, la probabilidad no llega a 0,5: <strong>clase 0</strong>.'),
        'Decidir por el signo de $z$ o por el umbral 0,5 es exactamente lo mismo: por eso la frontera sigue siendo una recta.'];
    },
    answer: function (d) { return 'z = ' + d.z + ', σ = ' + U.fmt(d.s, 4) + ', clase ' + d.clase; }
  });

  p.exercise({
    title: 'Por qué el escalón no entrena',
    level: 'medio',
    gen: function (r) {
      var eta = r.pick([0.1, 0.25, 0.5, 1]), w = r.int(-4, 4), grad = r.nz(-5, 5);
      return { eta: eta, w: w, grad: grad, nuevo: w };
    },
    ask: function (d) {
      return 'Una neurona con <strong>escalón</strong> tiene $w_1 = ' + d.w + '$. La pérdida respecto de ' +
        'la salida vale $' + d.grad + '$, pero la derivada del escalón es $0$. Con $\\eta = ' +
        U.fmt(d.eta, 2) + '$, ¿dónde queda $w_1$ tras un paso de descenso de gradiente?';
    },
    fields: [{ name: 'w', label: 'w₁ nuevo', w: 'tiny' }],
    sol: function (d) { return { w: d.nuevo }; },
    errores: [{ si: function (v, d) { return Math.abs(v.w - (d.w - d.eta * d.grad)) < 1e-6 && d.grad !== 0; }, msg: 'Has usado la derivada de la pérdida sin multiplicarla por la del escalón. La regla de la cadena multiplica los tres factores, y uno de ellos es cero.' }],
    hint: function () { return 'La regla de la cadena multiplica: derivada de la pérdida × derivada de la activación × entrada. Si un factor es cero, el producto es cero.'; },
    steps: function (d) {
      return ['El gradiente respecto de $w_1$ es $' + d.grad + ' \\times 0 \\times x_1 = 0$.',
        '$w_1 \\leftarrow ' + d.w + ' - ' + U.fmt(d.eta, 2) + '\\cdot 0 = ' + d.w + '$: no se mueve.',
        'Y no se moverá nunca, con ningún $\\eta$ y ningún dato. Ese es el motivo de cambiar el escalón por la sigmoide.'];
    },
    answer: function (d) { return String(d.nuevo); }
  });

  p.exercise({
    title: 'Un paso completo por la cadena',
    level: 'avanzado',
    gen: function (r) {
      var s = r.pick([0.2, 0.3, 0.5, 0.7, 0.8]);
      var y = r.int(0, 1), x1 = r.nz(-3, 3), eta = r.pick([0.1, 0.5, 1]);
      var w1 = r.int(-2, 2);
      var g = 2 * (s - y) * s * (1 - s) * x1;
      if (Math.abs(g) < 1e-9) return null;
      return { s: s, y: y, x1: x1, eta: eta, w1: w1, g: g, nuevo: w1 - eta * g };
    },
    ask: function (d) {
      return 'Con pérdida cuadrática $L = (\\sigma - y)^2$, una neurona da $\\sigma = ' + U.fmt(d.s, 1) +
        '$ para un dato de etiqueta $y = ' + d.y + '$ y entrada $x_1 = ' + d.x1 + '$. El peso vale ' +
        '$w_1 = ' + d.w1 + '$ y $\\eta = ' + U.fmt(d.eta, 1) + '$. Calcula el gradiente y el peso nuevo. ' +
        '(cuatro decimales)';
    },
    fields: [{ name: 'g', label: '∂L/∂w₁', w: 'tiny' }, { name: 'w', label: 'w₁ nuevo', w: 'tiny' }],
    sol: function (d) { return { g: U.round(d.g, 8), w: U.round(d.nuevo, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var sin = 2 * (d.s - d.y) * d.x1; return Math.abs(sin - d.g) > 0.0005 && Math.abs(v.g - sin) < 0.0005; }, msg: 'Falta el factor $\\sigma(1-\\sigma)$: la derivada de la sigmoide es el eslabón del medio de la cadena.' }],
    hint: function (d) { return 'Tres factores: $2(\\sigma - y)$, después $\\sigma(1-\\sigma) = ' + U.fmt(d.s * (1 - d.s), 4) + '$, y por último $x_1$.'; },
    steps: function (d) {
      return ['$2(\\sigma - y) = 2(' + U.fmt(d.s, 1) + ' - ' + d.y + ') = ' + U.fmt(2 * (d.s - d.y), 2) + '$',
        '$\\sigma(1-\\sigma) = ' + U.fmt(d.s * (1 - d.s), 4) + '$',
        '$\\frac{\\partial L}{\\partial w_1} = ' + U.fmt(2 * (d.s - d.y), 2) + ' \\times ' + U.fmt(d.s * (1 - d.s), 4) + ' \\times ' + d.x1 + ' = ' + U.fmt(d.g, 4) + '$',
        '$w_1 \\leftarrow ' + d.w1 + ' - ' + U.fmt(d.eta, 1) + '\\cdot(' + U.fmt(d.g, 4) + ') = ' + U.fmt(d.nuevo, 4) + '$'];
    },
    answer: function (d) { return 'gradiente ' + U.fmt(d.g, 4) + ', w₁ = ' + U.fmt(d.nuevo, 4); }
  });

  p.keys([
    'El escalón tiene derivada cero en todas partes: con él, el descenso de gradiente da pasos de tamaño cero y no aprende nada.',
    'La sigmoide $\\sigma(z) = 1/(1+e^{-z})$ es un escalón con la esquina limada: suave, derivable y con salida entre 0 y 1.',
    'Su derivada es $\\sigma(1-\\sigma)$, sale gratis del valor ya calculado, y no pasa de $0{,}25$.',
    'La salida se lee como probabilidad: eso es la regresión logística, el modelo más usado en medicina.',
    'La frontera sigue siendo una recta: la sigmoide no amplía lo que una neurona separa, la vuelve entrenable y apilable.',
    'Esa cota de $0{,}25$ anticipa el desvanecimiento del gradiente en redes profundas.'
  ]);
});
