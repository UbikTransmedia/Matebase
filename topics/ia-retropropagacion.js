/* Tema: La regla de la cadena, en cadena */
Course.topic('ia-retropropagacion', function (p) {

  p.puente('Las demos de [[ia-red|el tema anterior]] ya entrenaban redes, pero sin abrir la caja: se ' +
    'daba por hecho que el gradiente aparecía. Aquí se abre. No hace falta nada nuevo: solo ' +
    '[[fn-derivadas|la regla de la cadena]], aplicada muchas veces y en el orden adecuado. Y para ' +
    'comprobar que no nos hemos equivocado, [[av-numerico|las diferencias finitas]].');

  p.text('La retropropagación tiene fama de difícil y no lo es. Es la regla de la cadena, la misma de ' +
    'derivar $f(g(x))$, organizada de manera que no se repita ni una cuenta. Lo único que hay que ' +
    'entender es <strong>por qué se recorre hacia atrás</strong>, y eso tiene una respuesta ' +
    'cuantitativa muy clara.');

  /* ---------------------------------------------------------------- */
  p.section('Una fórmula es un grafo');

  p.text('Cualquier expresión se puede dibujar como una red de operaciones elementales. La pérdida de ' +
    'una sola neurona, $L = (\\sigma(wx + b) - y)^2$, no es un bloque monolítico: es una cadena de ' +
    'cinco pasos, y cada uno sabe derivarse a sí mismo sin saber nada de los demás.');

  p.formula('x \\xrightarrow{\\;\\cdot\\,w\\;} u \\xrightarrow{\\;+\\,b\\;} z \\xrightarrow{\\;\\sigma\\;} p \\xrightarrow{\\;-\\,y\\;} e \\xrightarrow{\\;(\\;)^2\\;} L',
    'el grafo de cómputo de una neurona',
    'Cada flecha es una operación elemental. Recorrerlo de izquierda a derecha —la <strong>pasada hacia ' +
    'delante</strong>— calcula la predicción y la pérdida. Recorrerlo de derecha a izquierda calcula ' +
    'las derivadas.<br><br>Lo importante es que <strong>cada nodo solo necesita saber dos cosas</strong>: ' +
    'su propia derivada local y el número que le llega desde su derecha. No necesita saber qué red ' +
    'hay alrededor, ni cuántas capas quedan. Por eso el método vale igual para cinco operaciones que ' +
    'para cinco millones.');

  p.formula('\\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial y}\\cdot\\frac{\\partial y}{\\partial x}',
    'la regla de la cadena, y nada más',
    'Se lee: <em>«la derivada de ele respecto de equis es la de ele respecto de i griega, por la de i ' +
    'griega respecto de equis»</em>.<br><br>Retropropagar es aplicarla nodo a nodo: cada uno coge lo ' +
    'que le llega por detrás, lo multiplica por su derivada local, y se lo pasa al anterior. La ' +
    'derivada local de $+b$ es 1; la de $\\cdot w$ respecto de $x$ es $w$ y respecto de $w$ es $x$; la ' +
    'de $\\sigma$ es $\\sigma(1-\\sigma)$; la de $(\\,)^2$ es $2e$. Todas de primero de Bachillerato.');

  p.demo({
    title: 'El grafo, hacia delante y hacia atrás',
    intro: 'Los números de arriba de cada caja son los valores que se calculan al ir hacia delante. Los de abajo, en naranja, son las derivadas que vuelven hacia atrás. Mueve los mandos y fíjate en cómo cada derivada es la de su derecha multiplicada por la derivada local de su caja.',
    predice: 'La derivada local de «sumar $b$» es 1. ¿Qué le pasará entonces al número naranja al atravesar esa caja: crecerá, menguará o pasará igual?',
    build: function (host) {
      var w = 1.5, x = 2, b = -1, y = 1;
      var out = W.mono(host, '');
      function todo() {
        var u = w * x, z = u + b, pr = 1 / (1 + Math.exp(-z)), e = pr - y, L = e * e;
        var dL = 1;                       // dL/dL
        var de = dL * 2 * e;              // por la derivada de ( )^2
        var dp = de * 1;                  // restar y no cambia nada
        var dz = dp * pr * (1 - pr);      // derivada de la sigmoide
        var du = dz * 1, db = dz * 1;     // sumar b: derivada local 1
        var dw = du * x, dx = du * w;     // producto
        return { u: u, z: z, p: pr, e: e, L: L, de: de, dp: dp, dz: dz, du: du, db: db, dw: dw, dx: dx };
      }
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 11.5, ymin: -1.6, ymax: 1.8, height: 250,
        grid: false, axes: false,
        aria: 'El grafo de cómputo de una neurona con los valores de la pasada hacia delante y las derivadas de la pasada hacia atrás',
        draw: function (g) {
          var T = todo();
          var cajas = [
            { x: 0.4, t: 'x', v: x, d: T.dx },
            { x: 2.4, t: '·w', v: T.u, d: T.du },
            { x: 4.4, t: '+b', v: T.z, d: T.dz },
            { x: 6.4, t: 'σ', v: T.p, d: T.dp },
            { x: 8.4, t: '−y', v: T.e, d: T.de },
            { x: 10.4, t: '( )²', v: T.L, d: 1 }
          ];
          cajas.forEach(function (c, i) {
            g.rect(c.x - 0.55, -0.32, 1.1, 0.64, { color: 'axis', fill: 'bg', fillAlpha: 1, w: 1.6 });
            g.text(c.x, -0.12, c.t, { align: 'center', size: 17, color: 'ink' });
            g.text(c.x, 0.75, U.fmt(c.v, 3), { align: 'center', size: 13, color: 0 });
            g.text(c.x, -0.95, U.fmt(c.d, 3), { align: 'center', size: 13, color: 4 });
            if (i < cajas.length - 1) {
              g.vec(c.x + 0.58, 0.14, cajas[i + 1].x - 0.58, 0.14, { color: 0, w: 1.6 });
              g.vec(cajas[i + 1].x - 0.58, -0.16, c.x + 0.58, -0.16, { color: 4, w: 1.6 });
            }
          });
          g.text(0.4, 1.35, 'hacia delante: valores', { color: 0, size: 12.5 });
          g.text(0.4, -1.4, 'hacia atrás: derivadas', { color: 4, size: 12.5 });
        }
      });
      function pinta() {
        var T = todo();
        out.set('pasada hacia delante   u = w·x = ' + U.fmt(T.u, 3) + '   z = u+b = ' + U.fmt(T.z, 3) +
          '   p = σ(z) = ' + U.fmt(T.p, 4) + '   e = p−y = ' + U.fmt(T.e, 4) + '   L = e² = ' + U.fmt(T.L, 5) + '\n\n' +
          'pasada hacia atrás\n' +
          '  ∂L/∂e = 2e             = ' + U.fmt(T.de, 4) + '\n' +
          '  ∂L/∂p = ∂L/∂e · 1      = ' + U.fmt(T.dp, 4) + '\n' +
          '  ∂L/∂z = ∂L/∂p · p(1−p) = ' + U.fmt(T.dp, 4) + ' · ' + U.fmt(T.p * (1 - T.p), 4) + ' = ' + U.fmt(T.dz, 4) + '\n' +
          '  ∂L/∂b = ∂L/∂z · 1      = ' + U.fmt(T.db, 4) + '\n' +
          '  ∂L/∂w = ∂L/∂z · x      = ' + U.fmt(T.dz, 4) + ' · ' + U.fmt(x, 2) + ' = ' + U.fmt(T.dw, 4) + '\n\n' +
          'Los dos últimos son los que mueven los pesos. Todo lo demás son escalas por el camino.');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'peso w', min: -3, max: 3, step: 0.1, value: 1.5, dec: 1, on: function (v) { w = v; pinta(); } });
      W.slider(fila, { label: 'entrada x', min: -3, max: 3, step: 0.1, value: 2, dec: 1, on: function (v) { x = v; pinta(); } });
      var fila2 = W.row(host);
      W.slider(fila2, { label: 'sesgo b', min: -3, max: 3, step: 0.1, value: -1, dec: 1, on: function (v) { b = v; pinta(); } });
      W.chips(host, [{ label: 'etiqueta y = 1', value: 1 }, { label: 'etiqueta y = 0', value: 0 }],
        { value: 1, on: function (v) { y = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Por qué hacia atrás, y no hacia delante');

  p.text('La regla de la cadena se puede aplicar en los dos sentidos, y los dos dan el resultado correcto. ' +
    'Lo que cambia es <strong>cuánto cuesta</strong>, y la diferencia no es pequeña: es la razón de que ' +
    'entrenar redes grandes sea posible.');

  p.text('Hacia delante se elige <em>una entrada</em> y se propaga cómo afecta a todo: una pasada da ' +
    'la derivada de la pérdida respecto de <strong>un solo parámetro</strong>. Hacia atrás se parte de ' +
    '<em>la salida</em>: una pasada da la derivada respecto de <strong>todos</strong> a la vez.');

  p.table(['', 'Hacia delante', 'Hacia atrás (retropropagación)'], [
    ['Una pasada da', 'la derivada respecto de 1 parámetro', 'la derivada respecto de <strong>todos</strong>'],
    ['Pasadas necesarias', '$n$, una por parámetro', '<strong>1</strong>'],
    ['Con $n = 1000$', '1000 pasadas', '1 pasada'],
    ['Con $n = 10^{11}$', 'inviable', '1 pasada'],
    ['Cuándo conviene', 'muchas salidas, pocas entradas', 'muchas entradas, <strong>una</strong> salida']
  ]);

  p.note('El caso de una red es el mejor posible para el modo inverso: millones de parámetros y ' +
    '<strong>un solo número</strong> de salida, la pérdida. Por eso el coste de calcular el gradiente ' +
    'completo es, aproximadamente, el de una pasada hacia delante más otra hacia atrás: unas dos o tres ' +
    'veces lo que cuesta evaluar la red. Que el gradiente de mil millones de números cueste lo mismo ' +
    'que evaluar la función una vez es, seguramente, el hecho más importante de todo el bloque.',
    'ok', 'El hecho que lo hace posible');

  p.ejemplo({
    title: 'Retropropagar a mano en una red 2-2-1',
    enunciado: 'Una red con dos entradas, dos neuronas ocultas con sigmoide y una de salida lineal. Entrada $\\vec x = (1, 0)$, etiqueta $y = 1$. Pesos: la primera oculta tiene $\\vec w = (1, -1)$ y $b = 0$; la segunda, $\\vec w = (0, 2)$ y $b = 0$. La de salida tiene $\\vec v = (2, -1)$ y $c = 0$. Calcular el gradiente respecto de $v_1$ y respecto del primer peso de la primera oculta.',
    pasos: [
      { t: '<strong>Hacia delante, capa oculta.</strong> $z_1 = 1\\cdot 1 + (-1)\\cdot 0 = 1$, así que $h_1 = \\sigma(1) = 0{,}731$. Y $z_2 = 0\\cdot 1 + 2\\cdot 0 = 0$, así que $h_2 = \\sigma(0) = 0{,}5$.', antes: 'Calcula las dos sumas ponderadas y pásalas por la sigmoide.' },
      { t: '<strong>Hacia delante, salida y pérdida.</strong> $\\hat y = 2\\cdot 0{,}731 + (-1)\\cdot 0{,}5 = 0{,}962$. Con $L = (\\hat y - y)^2$: el error es $-0{,}038$ y $L = 0{,}00146$.', antes: 'Combina las dos ocultas con los pesos de salida.' },
      { t: '<strong>Empieza la vuelta.</strong> $\\frac{\\partial L}{\\partial \\hat y} = 2(\\hat y - y) = 2(-0{,}038) = -0{,}076$. Este número es el que va a viajar hacia atrás por toda la red.', antes: 'Deriva la pérdida respecto de la salida.' },
      { t: '<strong>El gradiente de $v_1$.</strong> Como $\\hat y = v_1h_1 + v_2h_2 + c$, la derivada local es $h_1$. Así que $\\frac{\\partial L}{\\partial v_1} = -0{,}076 \\cdot 0{,}731 = -0{,}0556$.', antes: '¿Cuánto vale $\\partial\\hat y/\\partial v_1$?' },
      { t: '<strong>Seguir bajando hasta la capa oculta.</strong> Hacia $h_1$ la derivada local es $v_1 = 2$, luego $\\frac{\\partial L}{\\partial h_1} = -0{,}076\\cdot 2 = -0{,}152$. Atravesando la sigmoide se multiplica por $h_1(1-h_1) = 0{,}731\\cdot 0{,}269 = 0{,}1966$: queda $\\frac{\\partial L}{\\partial z_1} = -0{,}0299$.', antes: 'Dos factores: el peso de salida y la derivada de la sigmoide.' },
      { t: '<strong>Y por fin el peso de entrada.</strong> Como $z_1 = w_{11}x_1 + w_{12}x_2 + b_1$, la derivada local respecto de $w_{11}$ es $x_1 = 1$. Total: $\\frac{\\partial L}{\\partial w_{11}} = -0{,}0299 \\cdot 1 = -0{,}0299$.', antes: '¿Cuánto vale $\\partial z_1/\\partial w_{11}$?' }
    ],
    cierre: 'Fíjate en que el $-0{,}076$ del principio se ha reutilizado para todo. Esa reutilización es exactamente lo que hace barata la retropropagación: cada número intermedio se calcula una sola vez y sirve para todos los parámetros que cuelgan de él.'
  });

  p.comprueba('Una red tiene un millón de parámetros y su pérdida es un solo número. ¿Cuántas pasadas hacen falta para el gradiente completo?', [
    { t: 'Una hacia delante y una hacia atrás, en total', ok: true, por: 'El modo inverso parte de la salida, así que una sola vuelta reparte la derivada entre todos los parámetros a la vez. El coste es de dos o tres evaluaciones de la red, sea cual sea el número de parámetros.' },
    { t: 'Un millón, una por parámetro', ok: false, por: 'Eso es lo que costaría en modo directo, o estimándolo con diferencias finitas. Es justo lo que la retropropagación evita, y por eso existe.' },
    { t: 'Depende de la profundidad de la red, no del número de parámetros', ok: false, por: 'La profundidad afecta a lo que cuesta <em>una</em> pasada, pero no al número de pasadas: sigue siendo una hacia delante y otra hacia atrás.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Comprobar que no te has equivocado');

  p.text('Una vuelta atrás mal escrita no da error: da una red que entrena mal, o despacio, sin decir ' +
    'por qué. Por eso existe una comprobación obligatoria, y usa ' +
    '[[av-numerico|las diferencias finitas]]: se mueve un parámetro un poquito, se mira cuánto cambia ' +
    'la pérdida, y se compara con lo que dice el gradiente.');

  p.formula('\\frac{\\partial L}{\\partial \\theta} \\approx \\frac{L(\\theta + h) - L(\\theta - h)}{2h}',
    'diferencia centrada',
    'Se lee: <em>«la derivada parcial de ele respecto de zeta es aproximadamente ele de zeta más hache, ' +
    'menos ele de zeta menos hache, partido por dos hache»</em>.<br><br>Se usa la versión ' +
    '<strong>centrada</strong> —mirando a los dos lados— y no la de un solo lado, porque su error es ' +
    'del orden de $h^2$ en vez de $h$: con $h$ pequeño, muchísimo más precisa.<br><br>Es carísima: una ' +
    'evaluación por cada parámetro y por cada lado. Sirve para comprobar, nunca para entrenar.');

  p.demo({
    title: 'La hache no puede ser ni grande ni pequeña',
    intro: 'Se compara la derivada exacta con la estimada por diferencias, para distintos valores de h, en escala logarítmica. Mueve el mando y mira el error: baja, toca fondo y vuelve a subir. Entender esa uve es entender el cálculo numérico entero.',
    predice: 'La fórmula es una aproximación que mejora cuanto menor es h. ¿Crees entonces que el error bajará indefinidamente al hacer h pequeñísimo?',
    build: function (host) {
      var expo = -5;
      var w0 = 1.3, x0 = 2, b0 = -0.4, y0 = 1;
      function L(w) {
        var pr = 1 / (1 + Math.exp(-(w * x0 + b0)));
        return (pr - y0) * (pr - y0);
      }
      function exacta() {
        var pr = 1 / (1 + Math.exp(-(w0 * x0 + b0)));
        return 2 * (pr - y0) * pr * (1 - pr) * x0;
      }
      function errorCon(h) {
        var num = (L(w0 + h) - L(w0 - h)) / (2 * h);
        return Math.abs(num - exacta()) / Math.abs(exacta());
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -13, xmax: 0, ymin: -12, ymax: 1, height: 300,
        xlabel: 'log₁₀ de h', ylabel: 'log₁₀ del error relativo',
        aria: 'Curva en forma de uve del error de la diferencia finita frente al tamaño del paso, en escala logarítmica',
        draw: function (g) {
          var pts = [], t;
          for (t = -13; t <= 0; t += 0.12) {
            var e = errorCon(Math.pow(10, t));
            pts.push([t, Math.log(Math.max(e, 1e-18)) / Math.LN10]);
          }
          g.path(pts, { color: 2, w: 2.4 });
          g.vline(expo, { color: 'ink', w: 1.8, dash: [5, 4] });
          g.text(-12.6, 0.4, 'redondeo manda', { color: 'ink-soft', size: 11.5 });
          g.text(-3.2, 0.4, 'truncamiento manda', { color: 'ink-soft', size: 11.5 });
        }
      });
      function pinta() {
        var h = Math.pow(10, expo), e = errorCon(h);
        out.set('$h = 10^{' + U.fmt(expo, 1) + '}$ &nbsp;·&nbsp; derivada exacta ' + U.fmt(exacta(), 8) +
          ' &nbsp;·&nbsp; estimada ' + U.fmt((L(w0 + h) - L(w0 - h)) / (2 * h), 8) + '<br>' +
          '<strong>Error relativo: ' + e.toExponential(2) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (expo > -3 ? 'Con h grande la fórmula es una aproximación burda: domina el error de truncamiento, que va como h².'
            : (expo < -9 ? 'Con h diminuto, las dos pérdidas son casi el mismo número y al restarlas se pierden casi todas las cifras significativas: domina el redondeo.'
              : 'Aquí está el punto dulce, alrededor de 10⁻⁵ o 10⁻⁶: los dos errores están equilibrados.')) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'exponente de h', min: -13, max: 0, step: 0.5, value: -5, dec: 1,
        on: function (v) { expo = v; pinta(); }
      });
      pinta();
    }
  });

  p.note('Esa uve es la razón de que la comprobación se haga con $h \\approx 10^{-4}$ o $10^{-5}$ y no ' +
    'con $10^{-12}$. Y también explica un detalle del propio curso: las pruebas de este motor comparan ' +
    'cada operación contra diferencias finitas con una tolerancia del 5 %, no del 0,001 %, porque por ' +
    'debajo de eso lo que se estaría midiendo es el redondeo y no un error de programación. Un fallo de ' +
    'verdad —un signo cambiado, un índice al revés— no da un 5 %: da un error de orden 1.',
    null, 'Por qué la tolerancia no es minúscula');

  p.util('Todo esto lo hacen hoy las bibliotecas solas, y a la técnica se la llama <strong>diferenciación ' +
    'automática en modo inverso</strong>. No es derivación simbólica —no se manipulan fórmulas— ni ' +
    'numérica —no se aproxima nada—: se derivan las operaciones elementales exactamente y se ' +
    'multiplican siguiendo el grafo. Y sirve para mucho más que redes: se usa en física computacional, ' +
    'en finanzas para calcular sensibilidades de carteras, en astronomía para ajustar modelos ' +
    'orbitales y en diseño de estructuras, en cualquier sitio donde haya que derivar algo respecto de ' +
    'muchísimos parámetros a la vez.');

  p.hist('La historia tiene una injusticia célebre. El método lo publicó en 1970 el finlandés Seppo ' +
    'Linnainmaa, en su tesis de máster, como una forma general de acumular errores de redondeo; no ' +
    'hablaba de redes neuronales. Paul Werbos lo aplicó explícitamente a redes en su tesis de 1974, y ' +
    'tampoco se le hizo caso. El trabajo que lo hizo famoso es el de David Rumelhart, Geoffrey Hinton y ' +
    'Ronald Williams en 1986, en la revista <em>Nature</em>, que demostró que con él se entrenaban ' +
    'redes de varias capas y desató el interés que había muerto con el libro de Minsky y Papert. Hinton ' +
    'ha dicho muchas veces que no fueron los primeros y que lo redescubrieron sin saberlo.');

  p.trampas([
    { e: 'Creer que la retropropagación es un algoritmo de aprendizaje', por: 'Solo calcula el gradiente. Quien aprende es el optimizador, que decide qué hacer con él. Son dos piezas distintas y se pueden cambiar por separado.' },
    { e: 'Estimar el gradiente con diferencias finitas para entrenar', por: 'Costaría dos evaluaciones por parámetro: con un millón de parámetros, dos millones de pasadas por paso. La retropropagación hace lo mismo con una.' },
    { e: 'Usar una $h$ minúscula al comprobar', por: 'Con $h = 10^{-12}$ las dos pérdidas son casi iguales y al restarlas se pierden todas las cifras: el resultado es ruido. El punto dulce está hacia $10^{-5}$.' },
    { e: 'Olvidar poner los gradientes a cero entre pasos', por: 'Se acumulan por construcción, porque un parámetro puede recibir derivada por varios caminos. Si no se limpian, el paso siguiente arrastra el anterior.' },
    { e: 'Pensar que hace falta guardar la fórmula entera', por: 'Cada nodo solo necesita su derivada local y lo que le llega por detrás. Nadie tiene en ningún momento la expresión completa de la red.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La cadena, en dos eslabones',
    level: 'basico',
    gen: function (r) {
      var dLdy = r.nz(-6, 6), dydx = r.nz(-6, 6);
      return { a: dLdy, b: dydx, r: dLdy * dydx };
    },
    ask: function (d) {
      return 'Por un nodo del grafo llega, desde su derecha, $\\frac{\\partial L}{\\partial y} = ' + d.a +
        '$. La derivada local de ese nodo es $\\frac{\\partial y}{\\partial x} = ' + d.b +
        '$. ¿Qué número pasa hacia la izquierda?';
    },
    fields: [{ name: 'r', label: '∂L/∂x', w: 'tiny' }],
    sol: function (d) { return { r: d.r }; },
    errores: [{ si: function (v, d) { return d.a + d.b !== d.r && v.r === d.a + d.b; }, msg: 'La regla de la cadena <em>multiplica</em>, no suma: cada nodo escala lo que le llega por su derivada local.' }],
    hint: function () { return 'Lo que llega, por la derivada local.'; },
    steps: function (d) { return ['$' + d.a + ' \\times ' + d.b + ' = ' + d.r + '$.', 'Eso es todo lo que hace un nodo al retropropagar.']; },
    answer: function (d) { return String(d.r); }
  });

  p.exercise({
    title: 'Atravesar una sigmoide',
    level: 'basico',
    gen: function (r) {
      var pr = r.pick([0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9]);
      var dp = r.nz(-4, 4);
      return { p: pr, dp: dp, loc: pr * (1 - pr), dz: dp * pr * (1 - pr) };
    },
    ask: function (d) {
      return 'A una sigmoide cuya salida vale $p = ' + U.fmt(d.p, 1) + '$ le llega, desde la derecha, ' +
        '$\\frac{\\partial L}{\\partial p} = ' + d.dp + '$. ¿Cuánto vale $\\frac{\\partial L}{\\partial z}$? ' +
        '(cuatro decimales)';
    },
    fields: [{ name: 'r', label: '∂L/∂z', w: 'tiny' }],
    sol: function (d) { return { r: U.round(d.dz, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { return Math.abs(d.dp * d.p - d.dz) > 0.0005 && Math.abs(v.r - d.dp * d.p) < 0.0005; }, msg: 'La derivada de la sigmoide es $p(1-p)$, no $p$. Falta el factor $1-p$.' }],
    hint: function (d) { return 'La derivada local de la sigmoide es $p(1-p) = ' + U.fmt(d.loc, 4) + '$.'; },
    steps: function (d) {
      return ['Derivada local: $' + U.fmt(d.p, 1) + '\\cdot(1 - ' + U.fmt(d.p, 1) + ') = ' + U.fmt(d.loc, 4) + '$.',
        '$' + d.dp + ' \\times ' + U.fmt(d.loc, 4) + ' = ' + U.fmt(d.dz, 4) + '$.',
        d.loc < 0.15 ? 'Fíjate en lo pequeña que es la derivada local: la sigmoide saturada estrangula lo que pasa por ella.' : 'Cerca de $p = 0{,}5$ la sigmoide deja pasar lo máximo, que es $0{,}25$.'];
    },
    answer: function (d) { return U.fmt(d.dz, 4); }
  });

  p.exercise({
    title: 'Hasta el peso de entrada',
    level: 'medio',
    gen: function (r) {
      var dz = r.nz(-3, 3) / 2, x = r.nz(-4, 4);
      return { dz: dz, x: x, dw: dz * x, db: dz };
    },
    ask: function (d) {
      return 'En una neurona $z = w x + b$ con $x = ' + d.x + '$, la vuelta atrás ha llegado a ' +
        '$\\frac{\\partial L}{\\partial z} = ' + U.fmt(d.dz, 1) + '$. Calcula el gradiente respecto de ' +
        '$w$ y respecto de $b$.';
    },
    fields: [{ name: 'w', label: '∂L/∂w', w: 'tiny' }, { name: 'b', label: '∂L/∂b', w: 'tiny' }],
    sol: function (d) { return { w: U.round(d.dw, 6), b: U.round(d.db, 6) }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return d.dw !== d.db && Math.abs(v.w - d.db) < 1e-6 && Math.abs(v.b - d.dw) < 1e-6; }, msg: 'Los has intercambiado. La derivada local respecto de $w$ es $x$; respecto de $b$ es 1.' }],
    hint: function () { return '$\\partial z/\\partial w = x$ y $\\partial z/\\partial b = 1$.'; },
    steps: function (d) {
      return ['$\\frac{\\partial L}{\\partial w} = ' + U.fmt(d.dz, 1) + ' \\times ' + d.x + ' = ' + U.fmt(d.dw, 3) + '$',
        '$\\frac{\\partial L}{\\partial b} = ' + U.fmt(d.dz, 1) + ' \\times 1 = ' + U.fmt(d.db, 3) + '$',
        'El sesgo siempre recibe lo mismo que llega a $z$: su derivada local es 1.'];
    },
    answer: function (d) { return '∂w = ' + U.fmt(d.dw, 3) + ', ∂b = ' + U.fmt(d.db, 3); }
  });

  p.exercise({
    title: 'Comprobar con diferencias',
    level: 'medio',
    gen: function (r) {
      var mas = r.real(1, 9, 4), h = r.pick([0.001, 0.01, 0.1]);
      var menos = mas - r.real(0.05, 2, 4);
      return { mas: mas, menos: menos, h: h, est: (mas - menos) / (2 * h) };
    },
    ask: function (d) {
      return 'Para comprobar un gradiente se calcula la pérdida moviendo un parámetro: $L(\\theta + h) = ' +
        U.fmt(d.mas, 4) + '$ y $L(\\theta - h) = ' + U.fmt(d.menos, 4) + '$, con $h = ' + U.fmt(d.h, 3) +
        '$. ¿Qué derivada estiman las diferencias centradas? (tres decimales)';
    },
    fields: [{ name: 'e', label: 'estimación', w: 'tiny' }],
    sol: function (d) { return { e: U.round(d.est, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.e - (d.mas - d.menos) / d.h) < 0.002; }, msg: 'Falta el 2 del denominador: la diferencia centrada recorre $2h$, de $\\theta-h$ a $\\theta+h$.' }],
    hint: function () { return 'Resta las dos pérdidas y divide por $2h$, que es la distancia total entre los dos puntos.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.mas, 4) + ' - ' + U.fmt(d.menos, 4) + ' = ' + U.fmt(d.mas - d.menos, 4) + '$',
        '$\\dfrac{' + U.fmt(d.mas - d.menos, 4) + '}{2 \\times ' + U.fmt(d.h, 3) + '} = ' + U.fmt(d.est, 3) + '$',
        'Si la retropropagación no da aproximadamente esto, hay un error en alguna vuelta atrás.'];
    },
    answer: function (d) { return U.fmt(d.est, 3); }
  });

  p.exercise({
    title: 'Lo que costaría hacerlo mal',
    level: 'avanzado',
    gen: function (r) {
      var n = r.pick([1000, 50000, 1000000, 175000000]);
      var ms = r.pick([2, 5, 10]);
      return { n: n, ms: ms, difs: 2 * n, segDif: 2 * n * ms / 1000, retro: 3, segRetro: 3 * ms / 1000 };
    },
    ask: function (d) {
      return 'Una red tiene $' + U.miles(d.n) + '$ parámetros y evaluarla cuesta $' + d.ms +
        '$ ms. ¿Cuántas evaluaciones hacen falta para un gradiente por diferencias centradas, y cuántos ' +
        'segundos serían? Compáralo con las 3 evaluaciones que cuesta la retropropagación. (tres decimales los segundos)';
    },
    fields: [{ name: 'e', label: 'evaluaciones', w: 'tiny' }, { name: 's', label: 'segundos', w: 'tiny' }],
    sol: function (d) { return { e: d.difs, s: U.round(d.segDif, 6) }; },
    dec: { s: 3 },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return v.e === d.n; }, msg: 'Con diferencias <em>centradas</em> hacen falta dos evaluaciones por parámetro, una a cada lado.' }],
    hint: function () { return 'Dos evaluaciones por parámetro. Después pasa los milisegundos a segundos dividiendo entre mil.'; },
    steps: function (d) {
      return ['Evaluaciones: $2 \\times ' + U.miles(d.n) + ' = ' + U.miles(d.difs) + '$.',
        'Tiempo: $' + U.miles(d.difs) + ' \\times ' + d.ms + '$ ms $= ' + U.fmt(d.segDif, 3) + '$ s.',
        'La retropropagación cuesta unas 3 evaluaciones: $' + U.fmt(d.segRetro, 3) + '$ s, unas <strong>' +
        U.miles(Math.round(d.difs / 3)) + ' veces menos</strong>, y eso por <em>cada</em> paso de entrenamiento.'];
    },
    answer: function (d) { return U.miles(d.difs) + ' evaluaciones, ' + U.fmt(d.segDif, 3) + ' s'; }
  });

  p.keys([
    'Una fórmula es un grafo de operaciones elementales, y cada nodo sabe derivarse a sí mismo sin saber nada del resto.',
    'Retropropagar es la regla de la cadena nodo a nodo: lo que llega por detrás, por la derivada local, hacia la izquierda.',
    'Se recorre hacia atrás porque hay muchos parámetros y una sola salida: una pasada da el gradiente de todos a la vez.',
    'El gradiente completo cuesta unas dos o tres evaluaciones de la red, sea cual sea el número de parámetros.',
    'Se comprueba con diferencias centradas, cuyo error tiene forma de uve: truncamiento con $h$ grande, redondeo con $h$ diminuto.',
    'La retropropagación calcula el gradiente; quien aprende es el optimizador. Son dos piezas separables.'
  ]);
});
