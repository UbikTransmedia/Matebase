/* Tema: Aprender a base de premios: Bellman y Q-learning */
Course.topic('ia-refuerzo', function (p) {

  p.puente('En [[cib-refuerzo|aprender jugando]] viste la idea: nadie dice cuál era la jugada buena, sólo ' +
    'llega un premio. Aquí viene la matemática que la convierte en un método. De ' +
    '[[av-markov|las cadenas de Markov]] sale la forma de describir el mundo, de ' +
    '[[fn-sucesiones|las sucesiones]] el motivo por el que el cálculo converge, y de ' +
    '[[ia-buscar|la búsqueda]] la pieza que falta para llegar a jugar al go.');

  p.text('El problema de fondo tiene nombre: <strong>la asignación del mérito</strong>. Si una partida se ' +
    'gana en la jugada cuarenta, ¿cuál de las cuarenta fue la buena? El premio llega tarde y no dice ' +
    'nada sobre quién lo merece. Todo lo que sigue es una manera de repartir ese mérito hacia atrás.');

  /* ---------------------------------------------------------------- */
  p.section('El valor de estar en un sitio');

  p.text('La idea clave es dejar de preguntar «¿qué hago?» y preguntar «¿cuánto vale estar aquí?». El ' +
    '<strong>valor</strong> de un estado es todo el premio que se espera conseguir desde él si a partir ' +
    'de ahí se juega bien.');

  p.formula('V(s) = \\max_a \\bigl[\\, r(s, a) + \\gamma\\, V(s\') \\,\\bigr]',
    'la ecuación de Bellman',
    'Se lee: <em>«el valor de un estado es, entre todas las acciones, la mejor suma del premio inmediato ' +
    'más el valor descontado de adonde te lleva»</em>.<br><br>Fíjate en que $V$ aparece a los dos lados: ' +
    'no es una fórmula que se pueda evaluar, es una <strong>condición</strong> que el valor correcto ' +
    'cumple. Y se resuelve del modo más tosco imaginable: se empieza con cualquier cosa, se aplica el ' +
    'lado derecho para obtener una estimación nueva, y se repite hasta que deje de cambiar.');

  p.text('El número $\\gamma$, entre 0 y 1, se llama <strong>factor de descuento</strong> y dice cuánto ' +
    'vale un premio que llega un paso más tarde. Con $\\gamma$ pequeño el agente es impaciente; con ' +
    '$\\gamma$ cerca de 1, paciente. No es un detalle técnico: <strong>cambia la decisión</strong>.');

  p.demo({
    title: 'Un pasillo, dos premios y un factor de descuento',
    intro: 'Diez casillas. A la izquierda del todo hay un premio de 1, a la derecha del todo uno de 10, y ambos acaban la partida. Las barras son el valor de cada casilla y las flechas la decisión que sale de él. Mueve el descuento.',
    predice: 'El premio de la derecha es diez veces mayor, pero está mucho más lejos. ¿Crees que habrá algún descuento con el que convenga ir a por el pequeño?',
    build: function (host) {
      var n = 10, gamma = 0.9;
      var R = { 0: 1, 9: 10 };
      function resuelve(gm) {
        var V = [], i;
        for (i = 0; i < n; i++) V.push(0);
        var hist = [];
        for (var t = 0; t < 300; t++) {
          var nv = V.slice(), dif = 0;
          for (i = 1; i < n - 1; i++) {
            var a = (i - 1 === 0) ? R[0] : gm * V[i - 1];
            var b = (i + 1 === 9) ? R[9] : gm * V[i + 1];
            nv[i] = Math.max(a, b);
            dif = Math.max(dif, Math.abs(nv[i] - V[i]));
          }
          V = nv;
          if (t < 40) hist.push(dif);
        }
        var pol = [];
        for (i = 1; i < n - 1; i++) {
          var a2 = (i - 1 === 0) ? R[0] : gm * V[i - 1];
          var b2 = (i + 1 === 9) ? R[9] : gm * V[i + 1];
          pol.push(b2 > a2 ? 1 : -1);
        }
        return { V: V, pol: pol, hist: hist };
      }
      var res = resuelve(gamma);
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.7, xmax: 9.7, ymin: -1.6, ymax: 10.8, height: 280, xstep: 1,
        xlabel: 'casilla', ylabel: 'valor',
        aria: 'Valor de cada casilla del pasillo y la flecha de la decisión que sale de cada una',
        draw: function (g) {
          g.bars([{ x: 0, h: R[0], color: 1 }, { x: 9, h: R[9], color: 1 }], { width: 0.6 });
          g.bars(res.V.map(function (v, i) { return { x: i, h: (i === 0 || i === 9) ? 0 : v }; }), { color: 2, width: 0.6 });
          for (var i = 1; i < n - 1; i++) {
            var d = res.pol[i - 1];
            g.vec(i, -0.7, i + 0.42 * d, -0.7, { color: d > 0 ? 3 : 0, w: 2.4 });
          }
          g.text(0, 10.3, 'premio 1', { size: 11, align: 'center', color: 'ink' });
          g.text(9, 10.3, 'premio 10', { size: 11, align: 'center', color: 'ink' });
        }
      });
      function pinta() {
        res = resuelve(gamma);
        var izq = 0;
        res.pol.forEach(function (d) { if (d < 0) izq++; });
        var v1 = res.V[1], derDesde1 = gamma * res.V[2];
        out.set('Descuento $\\gamma = ' + U.fmt(gamma, 3) + '$ &nbsp;·&nbsp; ' +
          'desde la casilla 1: ir a la izquierda vale <strong>1</strong>, ir a la derecha vale ' +
          '<strong>' + U.fmt(derDesde1, 4) + '</strong><br>' +
          (izq ? izq + (izq === 1 ? ' casilla va' : ' casillas van') + ' hacia el premio pequeño.'
            : 'Todas las casillas van hacia el premio grande.') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (gamma < 0.7197 ? 'Con este descuento el premio lejano está demasiado descontado: desde la casilla 1 sale más a cuenta el premio de 1 que tiene al lado.'
            : (gamma < 0.73 ? 'Estás justo en el cambio. El umbral exacto es $\\gamma = \\sqrt[7]{0{,}1} = 0{,}7197$, porque desde la casilla 1 el premio grande está a siete descuentos: $10\\gamma^7 = 1$.'
              : 'Con este descuento compensa cruzar el pasillo entero: $10\\gamma^7$ supera a 1.')) +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'descuento γ', min: 0.5, max: 0.98, step: 0.005, value: 0.9, dec: 3, on: function (v) { gamma = v; pinta(); } });
      pinta();
    }
  });

  p.note('El cambio de decisión ocurre en un punto que se puede calcular a mano. Desde la casilla 1, el ' +
    'premio pequeño está a un paso y vale 1; el grande está a siete pasos y vale $10\\gamma^7$. Los dos ' +
    'se igualan cuando $\\gamma^7 = 0{,}1$, o sea $\\gamma = 0{,}7197$. Y así sale: con ' +
    '$\\gamma = 0{,}715$ la casilla 1 elige la izquierda, y con $\\gamma = 0{,}72$ ya elige la derecha. ' +
    'Un solo número decide entre la recompensa inmediata y la que compensa esperar.',
    'ok', 'Dónde está exactamente el cambio');

  /* ---------------------------------------------------------------- */
  p.section('Por qué esa repetición converge');

  p.text('Aplicar una y otra vez el lado derecho de Bellman parece un procedimiento de andar por casa, y ' +
    'sin embargo tiene garantía. La razón es que esa operación <strong>acerca</strong>: si se aplica a ' +
    'dos estimaciones cualesquiera, sus diferencias se encogen al menos por un factor $\\gamma$.');

  p.formula('\\bigl\\Vert T(V_1) - T(V_2) \\bigr\\Vert \\le \\gamma \\bigl\\Vert V_1 - V_2 \\bigr\\Vert',
    'la operación de Bellman es una contracción',
    'Donde $T$ es «aplicar el lado derecho» y la norma mide la mayor diferencia en cualquier estado.<br><br>' +
    'De ahí sale todo: como $\\gamma < 1$, las estimaciones sucesivas se van juntando como los términos ' +
    'de [[fn-sucesiones|una sucesión geométrica]], hay <strong>un único</strong> valor que cumple la ' +
    'ecuación, y se llega a él desde cualquier punto de partida. Es el mismo argumento que garantiza ' +
    'que un punto fijo exista y sea único.');

  p.note('Ojo con leer la desigualdad como una igualdad: $\\gamma$ es una <strong>cota</strong>, no el ' +
    'ritmo real. En el pasillo de arriba, con $\\gamma = 0{,}9$ y transiciones resbaladizas, el error ' +
    'entre barridos se multiplica de hecho por unos $0{,}36$–$0{,}40$, bastante menos de $0{,}9$. La ' +
    'teoría garantiza <em>al menos</em> esa velocidad; la práctica suele ir más deprisa.',
    'warn', 'Una cota no es una predicción');

  /* ---------------------------------------------------------------- */
  p.section('Q-learning: aprender sin conocer el mundo');

  p.text('La ecuación de Bellman de arriba tiene una pega práctica: para aplicarla hay que saber adónde ' +
    'lleva cada acción y qué premio da, o sea <strong>tener un modelo del mundo</strong>. Casi nunca se ' +
    'tiene. Lo que sí se puede hacer es probar, mirar qué pasa, y corregir.');

  p.text('Para eso se guarda el valor de <em>cada pareja estado-acción</em>, que se llama $Q(s, a)$: ' +
    'cuánto vale hacer esta acción estando aquí. Después de cada intento se corrige un poco en la ' +
    'dirección de lo que se acaba de ver.');

  p.formula('Q(s, a) \\leftarrow Q(s, a) + \\alpha \\bigl[\\, r + \\gamma \\max_{a\'} Q(s\', a\') - Q(s, a) \\,\\bigr]',
    'la regla de Q-learning',
    'El corchete es el <strong>error de predicción</strong>: lo que ahora parece que valía menos lo que ' +
    'creíamos que valía. Si es positivo, esto salió mejor de lo esperado y se sube la estimación; si es ' +
    'negativo, se baja. El $\\alpha$ dice cuánto caso hacerle a una sola experiencia.<br><br>' +
    'Compáralo con la fórmula de Bellman: es la misma, pero usando <em>una muestra</em> de lo que pasó ' +
    'en vez de la media exacta sobre un modelo que no tenemos. Y el $\\max$ de dentro es lo que hace ' +
    'que aprenda la política buena aunque mientras tanto esté explorando a lo tonto.');

  p.demo({
    title: 'Q-learning en el mismo pasillo',
    intro: 'Ahora nadie le dice al agente cómo funciona el pasillo: sólo puede probar. Empieza en una casilla al azar, se mueve, y a veces cobra. Entrena y compara la tabla que aprende con la solución exacta calculada arriba.',
    predice: 'El agente no sabe dónde están los premios ni qué hace cada acción. ¿Crees que puede llegar a la misma decisión que sale de resolver la ecuación?',
    build: function (host) {
      var n = 10, gamma = 0.9, R = { 0: 1, 9: 10 };
      var Q, r, episodios, eps = 0.2, alfa = 0.2;
      function reinicia() {
        r = U.rng(7);
        Q = [];
        for (var i = 0; i < n; i++) Q.push([0, 0]);
        episodios = 0;
      }
      reinicia();
      function episodio() {
        var s = Math.floor(r.real(1, 8.999, 6));
        for (var t = 0; t < 200; t++) {
          var a = (r.real(0, 1, 6) < eps) ? (r.real(0, 1, 6) < 0.5 ? 0 : 1) : (Q[s][1] > Q[s][0] ? 1 : 0);
          var s2 = (a === 0) ? s - 1 : s + 1;
          var fin = (s2 === 0 || s2 === 9);
          var rec = fin ? R[s2] : 0;
          var obj = rec + (fin ? 0 : gamma * Math.max(Q[s2][0], Q[s2][1]));
          Q[s][a] += alfa * (obj - Q[s][a]);
          if (fin) break;
          s = s2;
        }
        episodios++;
      }
      function exacta(gm) {
        var V = [], i;
        for (i = 0; i < n; i++) V.push(0);
        for (var t = 0; t < 400; t++) {
          var nv = V.slice();
          for (i = 1; i < n - 1; i++) {
            var a = (i - 1 === 0) ? R[0] : gm * V[i - 1];
            var b = (i + 1 === 9) ? R[9] : gm * V[i + 1];
            nv[i] = Math.max(a, b);
          }
          V = nv;
        }
        var pol = [];
        for (i = 1; i < n - 1; i++) {
          var a2 = (i - 1 === 0) ? R[0] : gm * V[i - 1];
          var b2 = (i + 1 === 9) ? R[9] : gm * V[i + 1];
          pol.push(b2 > a2 ? 1 : -1);
        }
        return { V: V, pol: pol };
      }
      var ex = exacta(gamma);
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.7, xmax: 9.7, ymin: -1.6, ymax: 10.8, height: 270, xstep: 1,
        xlabel: 'casilla', ylabel: 'valor',
        aria: 'Comparación entre el valor exacto de cada casilla y el que ha aprendido Q-learning',
        draw: function (g) {
          g.bars(ex.V.map(function (v, i) { return { x: i - 0.16, h: (i === 0 || i === 9) ? 0 : v }; }), { color: 0, width: 0.3 });
          g.bars(Q.map(function (q, i) { return { x: i + 0.16, h: (i === 0 || i === 9) ? 0 : Math.max(q[0], q[1]) }; }), { color: 2, width: 0.3 });
          for (var i = 1; i < n - 1; i++) {
            var d = (Q[i][1] > Q[i][0]) ? 1 : -1;
            g.vec(i, -0.8, i + 0.42 * d, -0.8, { color: d > 0 ? 3 : 0, w: 2.2 });
          }
        }
      });
      W.legend(host, [{ c: 0, t: 'valor exacto' }, { c: 2, t: 'aprendido' }]);
      function pinta() {
        var pol = '', igual = 0, i;
        for (i = 1; i < n - 1; i++) {
          var d = (Q[i][1] > Q[i][0]) ? 1 : -1;
          pol += (d > 0 ? 'D' : 'I');
          if (d === ex.pol[i - 1]) igual++;
        }
        var exPol = ex.pol.map(function (d) { return d > 0 ? 'D' : 'I'; }).join('');
        out.set('Episodios: <strong>' + U.miles(episodios) + '</strong> &nbsp;·&nbsp; ' +
          'descuento $\\gamma = ' + U.fmt(gamma, 2) + '$<br>' +
          'Aprendida: <code>' + pol + '</code> &nbsp;·&nbsp; exacta: <code>' + exPol + '</code> &nbsp;·&nbsp; ' +
          'coinciden <strong>' + igual + ' de 8</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (episodios === 0 ? 'Sin entrenar: la tabla está a cero y las flechas no significan nada todavía.'
            : (igual === 8 ? 'Ha encontrado la misma política que sale de resolver la ecuación, <strong>sin conocer el pasillo</strong>: sólo probando y corrigiendo.'
              : 'Todavía no coincide del todo. Con unos pocos miles de episodios llega.')) +
          '</span>');
        plot.render();
      }
      var bucle = NN.bucle({ host: host, porFotograma: 40, paso: episodio, pinta: pinta, hasta: 4000 });
      W.buttons(host, [
        { t: '▶ Entrenar', cls: 'btn--main', on: function () { bucle.activo() ? bucle.pausa() : bucle.arranca(); } },
        { t: '500 episodios', on: function () { for (var i = 0; i < 500; i++) episodio(); pinta(); } },
        { t: '↺ Reiniciar', on: function () { bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); } }
      ]);
      W.chips(host, [{ label: 'γ = 0,6', value: '0.6' }, { label: 'γ = 0,72', value: '0.72' }, { label: 'γ = 0,9', value: '0.9' }], {
        value: '0.9', on: function (v) { gamma = parseFloat(v); ex = exacta(gamma); bucle.pausa(); bucle.reinicia(); reinicia(); pinta(); }
      });
      pinta();
    }
  });

  p.note('Con 4000 episodios y los tres descuentos del botón, la política aprendida coincide ' +
    '<strong>exactamente</strong> con la exacta: <code>DDDDDDDD</code> con $\\gamma = 0{,}9$ y con ' +
    '$0{,}72$, y <code>IIDDDDDD</code> con $\\gamma = 0{,}6$, donde las dos primeras casillas se ' +
    'vuelven hacia el premio pequeño. Y los números cuadran: con $\\gamma = 0{,}9$ el valor aprendido ' +
    'de ir a la derecha desde la casilla 1 es $4{,}783$, que es exactamente $10 \\cdot 0{,}9^7$.',
    'ok', 'Aprender el mismo resultado sin el modelo');

  /* ---------------------------------------------------------------- */
  p.section('Cuando los estados no caben en una tabla');

  p.text('Todo lo anterior guarda un número por estado. En el go hay más posiciones que átomos en el ' +
    'universo observable, así que la tabla es imposible. La salida es sustituirla por ' +
    '<strong>una red</strong> que, dado un estado, estime su valor: en vez de recordar, generalizar.');

  p.text('Y entonces encaja la última pieza. En [[ia-buscar|la búsqueda con poda]] el problema era que ' +
    'el árbol crece exponencialmente y hace falta una función de evaluación escrita a mano para cortar ' +
    'a media profundidad. Si esa función la aprende una red, y además otra red sugiere qué jugadas vale ' +
    'la pena mirar, la búsqueda deja de ser ciega.');

  p.table(['Pieza', 'Antes', 'Con red'],
    [['Evaluar una posición', 'fórmula escrita por expertos', 'una red entrenada'],
     ['Elegir qué ramas mirar', 'todas, con poda alfa-beta', 'las que sugiere la red de política'],
     ['De dónde salen los datos', 'partidas humanas', 'partidas del programa contra sí mismo']]);

  p.text('Ese tercer punto es el que más sorprende: el sistema genera sus propios datos jugando contra sí ' +
    'mismo, y cada vuelta produce partidas algo mejores con las que volver a entrenar. No hace falta ' +
    'ninguna partida humana, y de hecho <strong>no usarlas resultó dar mejor resultado</strong>.');

  p.ejemplo({
    title: 'Cuánto vale esperar',
    enunciado: 'Un agente puede cobrar 1 ahora o esperar $k$ pasos y cobrar 10, con descuento $\\gamma = 0{,}8$. Decidir qué le conviene con $k = 5$, con $k = 10$, y hallar el $k$ a partir del cual deja de compensar.',
    pasos: [
      { t: '<strong>Con $k = 5$.</strong> Esperar vale $10 \\cdot 0{,}8^5 = 10 \\cdot 0{,}3277 = 3{,}277$, bastante más que 1. Conviene esperar.', antes: 'El premio lejano se multiplica por $\\gamma$ una vez por cada paso de espera.' },
      { t: '<strong>Con $k = 10$.</strong> $10 \\cdot 0{,}8^{10} = 10 \\cdot 0{,}1074 = 1{,}074$. Sigue compensando, pero por poco.', antes: 'Vuelve a aplicar la misma cuenta con el exponente 10.' },
      { t: '<strong>El punto de equilibrio.</strong> Se busca $k$ con $10 \\cdot 0{,}8^k = 1$, o sea $0{,}8^k = 0{,}1$. Tomando logaritmos, $k = \\dfrac{\\ln 0{,}1}{\\ln 0{,}8} = \\dfrac{-2{,}303}{-0{,}223} = 10{,}32$.', antes: 'Despeja el exponente con logaritmos.' },
      { t: '<strong>La lectura.</strong> Hasta diez pasos de espera compensa; a partir de once, no. Y fíjate en lo brusco que es: un premio diez veces mayor deja de interesar por esperar once turnos.' },
      { t: '<strong>Qué pasa si se cambia $\\gamma$.</strong> Con $\\gamma = 0{,}95$ el equilibrio se va a $k = \\frac{\\ln 0{,}1}{\\ln 0{,}95} = 44{,}9$: el agente se vuelve mucho más paciente. El descuento es, literalmente, el horizonte del agente.' }
    ],
    cierre: 'Por eso $\\gamma$ no es un parámetro menor: fija cuántos pasos hacia delante le importan al agente, y con él cambia la política óptima.'
  });

  p.comprueba('¿Por qué en Q-learning aparece un $\\max$ sobre las acciones del estado siguiente?', [
    { t: 'Porque se quiere aprender el valor de jugar bien después, aunque ahora mismo se esté explorando al azar', ok: true, por: 'Es lo que permite aprender la política óptima mientras se hace otra cosa: el objetivo hacia el que se corrige supone que a partir del paso siguiente se actuará lo mejor posible, aunque la acción que se acabe de tomar haya sido exploratoria.' },
    { t: 'Para que los valores no se hagan negativos', ok: false, por: 'Los valores pueden ser negativos sin ningún problema si hay castigos. El $\\max$ no está para eso.' },
    { t: 'Porque hay que elegir la acción que se ejecuta a continuación', ok: false, por: 'La acción que se ejecuta se elige aparte, y a menudo al azar para explorar. El $\\max$ interviene en el objetivo de la corrección, no en lo que el agente hace.' }
  ]);

  p.util('El factor de descuento aparece en sitios donde no se le llama así. Un tipo de interés es ' +
    'exactamente lo mismo al revés: cien euros dentro de un año valen hoy $100/(1+i)$, y ' +
    '$\\gamma = 1/(1+i)$. Las decisiones de inversión, el precio de un bono y el agente de este tema ' +
    'resuelven el mismo problema con la misma cuenta. Y el debate sobre qué descuento aplicar a los ' +
    'daños del cambio climático es, técnicamente, una discusión sobre el valor de $\\gamma$: con uno ' +
    'pequeño, lo que ocurra dentro de cien años no cuenta casi nada.');

  p.hist('La ecuación la formuló <strong>Richard Bellman</strong> en los años cincuenta, dentro de lo que ' +
    'llamó <em>programación dinámica</em>. El nombre lo eligió, según contó él mismo, porque sonaba ' +
    'suficientemente inofensivo como para que no se lo recortaran del presupuesto. El Q-learning es de ' +
    '1989, de Christopher Watkins, que demostró que la regla converge al valor óptimo aunque el agente ' +
    'explore al azar. Y en 2017 AlphaZero mostró hasta dónde llegaba la combinación con búsqueda y ' +
    'redes: aprendió al ajedrez, al shogi y al go <em>partiendo sólo de las reglas</em> y jugando ' +
    'contra sí mismo, sin una sola partida humana.');

  p.trampas([
    { e: 'Confundir premio con valor', por: 'El premio es lo que se cobra ahora; el valor es todo lo que se espera cobrar desde aquí en adelante. Una casilla sin premio puede tener un valor altísimo si lleva a uno.' },
    { e: 'Leer la contracción como una igualdad', por: '$\\gamma$ es una cota superior del ritmo de convergencia. El ritmo real suele ser más rápido: aquí se mide entre 0,36 y 0,40 con $\\gamma = 0{,}9$.' },
    { e: 'Poner $\\gamma = 1$ sin pensarlo', por: 'Sin descuento, en un problema sin final la suma de premios puede ser infinita y la ecuación deja de tener solución única. El $\\gamma < 1$ es lo que garantiza que exista.' },
    { e: 'No explorar', por: 'Si el agente siempre hace lo que mejor le ha salido, nunca descubre lo que no ha probado. Por eso se fuerza a actuar al azar de vez en cuando, como ya se veía en [[cib-refuerzo|el tema anterior]].' },
    { e: 'Creer que hace falta saber cómo funciona el mundo', por: 'Q-learning aprende sólo de tuplas de lo que pasó. Aquí encuentra la política óptima del pasillo sin que nadie le diga dónde están los premios.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Descontar un premio lejano',
    level: 'basico',
    gen: function (r) {
      var g = r.pick([0.5, 0.8, 0.9, 0.95]), k = r.int(3, 12), premio = r.pick([10, 20, 100]);
      return { g: g, k: k, premio: premio, v: premio * Math.pow(g, k) };
    },
    ask: function (d) {
      return 'Un premio de $' + d.premio + '$ que llega dentro de $' + d.k + '$ pasos, con descuento ' +
        '$\\gamma = ' + U.fmt(d.g, 2) + '$. ¿Cuánto vale ahora? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'valor', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.v, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { var mal = d.premio * d.g * d.k; return Math.abs(mal - d.v) > 0.00005 && Math.abs(v.v - mal) < 0.00005; }, msg: 'El descuento se aplica una vez por paso <em>multiplicando</em>, así que es $\\gamma$ elevado a los pasos, no $\\gamma$ por los pasos.' }],
    hint: function (d) { return 'Se multiplica por $\\gamma$ una vez por cada paso: $' + d.premio + ' \\cdot ' + U.fmt(d.g, 2) + '^{' + d.k + '}$.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.g, 2) + '^{' + d.k + '} = ' + U.fmt(Math.pow(d.g, d.k), 6) + '$.',
        '$' + d.premio + ' \\cdot ' + U.fmt(Math.pow(d.g, d.k), 6) + ' = ' + U.fmt(d.v, 4) + '$.',
        d.v < 1 ? 'Ha quedado por debajo de 1: a esta distancia, un premio de 1 inmediato sería preferible.'
          : 'Sigue valiendo más de 1, así que compensa ir a por él antes que cobrar 1 ahora mismo.'];
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'Un paso de Q-learning',
    level: 'basico',
    gen: function (r) {
      var q = r.real(0, 3, 1), rec = r.pick([0, 1, 10]), mx = r.real(0, 5, 1);
      var g = r.pick([0.8, 0.9]), al = r.pick([0.1, 0.2, 0.5]);
      var obj = rec + g * mx;
      return { q: q, r: rec, mx: mx, g: g, al: al, obj: obj, nuevo: q + al * (obj - q) };
    },
    ask: function (d) {
      return 'Ahora mismo $Q(s,a) = ' + U.fmt(d.q, 1) + '$. Se ejecuta la acción, se cobra $' + d.r +
        '$ y en el estado nuevo el mejor valor es $' + U.fmt(d.mx, 1) + '$. Con $\\gamma = ' + U.fmt(d.g, 1) +
        '$ y $\\alpha = ' + U.fmt(d.al, 1) + '$, ¿cuál es el nuevo $Q(s,a)$? (cuatro decimales)';
    },
    fields: [{ name: 'q', label: 'Q nuevo', w: 'tiny' }],
    sol: function (d) { return { q: U.round(d.nuevo, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { return Math.abs(d.obj - d.nuevo) > 0.00005 && Math.abs(v.q - d.obj) < 0.00005; }, msg: 'Eso es el objetivo entero. La regla no salta hasta él: avanza sólo una fracción $\\alpha$ de la diferencia.' }],
    hint: function (d) { return 'Primero el objetivo $r + \\gamma\\max Q$, después $Q + \\alpha(\\text{objetivo} - Q)$.'; },
    steps: function (d) {
      return ['Objetivo: $' + d.r + ' + ' + U.fmt(d.g, 1) + ' \\cdot ' + U.fmt(d.mx, 1) + ' = ' + U.fmt(d.obj, 3) + '$.',
        'Error de predicción: $' + U.fmt(d.obj, 3) + ' - ' + U.fmt(d.q, 1) + ' = ' + U.fmt(d.obj - d.q, 3) + '$.',
        'Nuevo valor: $' + U.fmt(d.q, 1) + ' + ' + U.fmt(d.al, 1) + ' \\cdot (' + U.fmt(d.obj - d.q, 3) + ') = ' + U.fmt(d.nuevo, 4) + '$.'];
    },
    answer: function (d) { return U.fmt(d.nuevo, 4); }
  });

  p.exercise({
    title: 'Hasta cuándo compensa esperar',
    level: 'medio',
    gen: function (r) {
      var g = r.pick([0.7, 0.8, 0.9, 0.95]), grande = r.pick([5, 10, 50]), cerca = 1;
      var k = Math.log(cerca / grande) / Math.log(g);
      return { g: g, grande: grande, k: k };
    },
    ask: function (d) {
      return 'Se puede cobrar 1 ahora o $' + d.grande + '$ dentro de $k$ pasos, con $\\gamma = ' +
        U.fmt(d.g, 2) + '$. ¿Para qué $k$ se igualan las dos opciones? (dos decimales)';
    },
    fields: [{ name: 'k', label: 'k', w: 'tiny' }],
    sol: function (d) { return { k: U.round(d.k, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { var alReves = Math.log(d.grande) / Math.log(d.g); return Math.abs(alReves - d.k) > 0.005 && Math.abs(v.k - alReves) < 0.005; }, msg: 'Revisa el cociente: hay que despejar de $' + '\\gamma^k = 1/\\text{premio}$, así que arriba va el logaritmo de la fracción, que es negativo.' }],
    hint: function (d) { return 'Plantea $' + d.grande + '\\gamma^k = 1$ y despeja $k$ con logaritmos.'; },
    steps: function (d) {
      return ['$' + d.grande + ' \\cdot ' + U.fmt(d.g, 2) + '^k = 1$, o sea $' + U.fmt(d.g, 2) + '^k = ' + U.fmt(1 / d.grande, 4) + '$.',
        '$k = \\dfrac{\\ln ' + U.fmt(1 / d.grande, 4) + '}{\\ln ' + U.fmt(d.g, 2) + '} = ' + U.fmt(d.k, 2) + '$.',
        'Más allá de ahí, el premio grande está tan descontado que no compensa la espera.'];
    },
    answer: function (d) { return U.fmt(d.k, 2); }
  });

  p.exercise({
    title: 'La cota de la contracción',
    level: 'medio',
    gen: function (r) {
      var g = r.pick([0.8, 0.9, 0.95, 0.99]), e0 = r.pick([1, 10]), k = r.pick([10, 20, 50]);
      return { g: g, e0: e0, k: k, ek: e0 * Math.pow(g, k) };
    },
    ask: function (d) {
      return 'El error inicial de la estimación vale $' + d.e0 + '$ y el descuento es $\\gamma = ' +
        U.fmt(d.g, 2) + '$. ¿Qué error garantiza la teoría, como mucho, tras $' + d.k + '$ barridos? (cinco decimales)';
    },
    fields: [{ name: 'e', label: 'cota del error', w: 'tiny' }],
    sol: function (d) { return { e: U.round(d.ek, 10) }; },
    dec: 5,
    tol: 1e-5,
    hint: function (d) { return 'Cada barrido multiplica el error como mucho por $\\gamma$, así que tras $k$ barridos queda multiplicado por $\\gamma^k$.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.g, 2) + '^{' + d.k + '} = ' + U.fmt(Math.pow(d.g, d.k), 6) + '$.',
        '$' + d.e0 + ' \\cdot ' + U.fmt(Math.pow(d.g, d.k), 6) + ' = ' + U.fmt(d.ek, 5) + '$.',
        'Y es una cota: el error real suele ser bastante menor que esto.'];
    },
    answer: function (d) { return U.fmt(d.ek, 5); }
  });

  p.exercise({
    title: 'Diagnosticar un agente',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'siempre repite la primera estrategia que le funcionó y nunca prueba otra cosa', v: 'explora', por: 'Le falta exploración. Si sólo hace lo que mejor le ha salido hasta ahora, no puede descubrir nada mejor: hay que forzarle a probar al azar de vez en cuando.' },
        { t: 'prefiere un premio pequeño inmediato a uno mucho mayor unos pasos después', v: 'gamma', por: 'El descuento es demasiado pequeño: el agente es impaciente. $\\gamma$ fija cuántos pasos hacia delante le importan, y con uno bajo el futuro casi no cuenta.' },
        { t: 'en un problema sin final, sus valores crecen sin parar y no se estabilizan', v: 'uno', por: 'Con $\\gamma = 1$ y sin estado terminal, la suma de premios puede ser infinita y la ecuación pierde la solución única. El descuento menor que 1 es justo lo que lo evita.' },
        { t: 'aprende bien en un laberinto pequeño pero es inviable en uno enorme', v: 'tabla', por: 'La tabla guarda un número por estado, y el número de estados crece exponencialmente. Ahí hay que cambiar la tabla por una red que generalice de unos estados a otros.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Un agente que aprende por refuerzo ' + d.c.t + '. ¿Cuál es la causa?'; },
    fields: [{ name: 'q', label: 'Causa', opts: [
      { t: 'no explora lo suficiente', v: 'explora' },
      { t: 'el descuento es demasiado pequeño', v: 'gamma' },
      { t: 'el descuento vale 1 y no hay final', v: 'uno' },
      { t: 'la tabla no cabe: hacen falta redes', v: 'tabla' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Piensa si el problema está en cómo actúa, en cuánto le importa el futuro, o en cuántos estados hay.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'El problema es la <strong>asignación del mérito</strong>: el premio llega tarde y no dice qué acción lo causó.',
    'El valor de un estado es todo lo que se espera cobrar desde él. La ecuación de Bellman lo define consigo mismo, y se resuelve repitiendo.',
    'Repetir converge porque la operación es una <strong>contracción</strong> de factor $\\gamma < 1$: hay un único valor que la cumple y se llega desde cualquier sitio. Pero $\\gamma$ es una cota, no el ritmo real.',
    'El descuento fija el horizonte del agente, y cambia la política: en el pasillo de esta página, la decisión se invierte exactamente en $\\gamma = 0{,}7197$.',
    'Q-learning aplica la misma idea con muestras en vez de un modelo: corrige cada estimación con el error de predicción, y encuentra la política óptima sin conocer el mundo.',
    'Cuando los estados no caben en una tabla se sustituye por una red, y si además guía la búsqueda se llega a AlphaZero, que aprende jugando contra sí mismo.'
  ]);
});
