/* Tema: Retardos y oscilación */
Course.topic('cib-retardos', function (p) {

  p.puente('El bucle de [[cib-realimentacion|realimentación]] suponía que la corrección actúa al instante. ' +
    'Este tema le añade una sola cosa, una demora, y todo cambia. Las cuentas siguen siendo las de una ' +
    'sucesión por recurrencia, pero ahora cada término mira dos posiciones atrás, y eso basta para que ' +
    'una ganancia segura empiece a oscilar.');

  p.text('Todo el mundo ha peleado con la ducha de un hotel. Sale fría, giras el grifo hacia el rojo, ' +
    'no pasa nada, giras más, sigue sin pasar nada, giras más todavía — y de pronto sale hirviendo. ' +
    'Giras hacia el azul con la misma decisión y a los pocos segundos estás otra vez helado. Puedes ' +
    'estar así un buen rato.');

  p.text('La reacción natural es culpar al grifo, y el grifo no tiene la culpa. Tampoco tú: has hecho ' +
    'exactamente lo razonable, que es corregir en proporción al error. Lo que falla es otra cosa, y ' +
    'es el asunto de este tema: <strong>entre tu acción y su efecto hay un retardo</strong>, porque ' +
    'el agua tarda en recorrer la tubería. Y un bucle con retardo se comporta de manera radicalmente ' +
    'distinta a uno sin él.');

  p.note('La lección práctica se puede enunciar ya, aunque cueste creerla: <strong>en un sistema con ' +
    'retardo, corregir con energía empeora las cosas</strong>. La respuesta correcta es hacer ' +
    'correcciones pequeñas y esperar, que es justo lo que la impaciencia impide.',
    'warn', 'La regla contraintuitiva del tema');

  /* ---------------------------------------------------------------- */
  p.section('El retardo en el bucle');

  p.text('En el primer tema del bloque, la corrección actuaba de inmediato: medías el error y el ' +
    'sistema respondía en el mismo instante. Ahora vamos a introducir una demora: lo que decidas ' +
    'ahora no tendrá efecto hasta dentro de $d$ pasos.');

  p.formula('y_{n+1} = y_n + K\\,\\bigl(r - y_{n-d}\\bigr)',
    'el mismo bucle, corrigiendo con información vieja',
    'Se lee: <em>«i griega sub ene más uno es igual a i griega sub ene, más ka por, erre menos i ' +
    'griega sub ene menos de»</em>.<br><br>Todo es igual que antes salvo un detalle: el error se ' +
    'calcula con $y_{n-d}$, es decir, con lo que valía la medida <strong>hace $d$ pasos</strong>, no ' +
    'con lo que vale ahora.<br><br>En cristiano: <em>«corrijo según lo que veía hace un rato, porque ' +
    'es lo único que tengo»</em>. Y mientras tanto el sistema ha seguido moviéndose.');

  p.text('El problema es fácil de ver dicho así: <strong>sigues corrigiendo un error que quizá ya ' +
    'esté arreglado</strong>. En la ducha, cuando por fin llega el agua caliente que pediste, ya has ' +
    'pedido tres veces más. Todas esas peticiones están en camino y van a llegar.');

  p.note('Hay un detalle práctico que conviene señalar antes de calcular nada, porque si no despista: ' +
    '<strong>un bucle con retardo necesita más de un valor para arrancar</strong>. Con retardo cero ' +
    'basta con saber dónde estás; con retardo 1, para dar el primer paso hace falta además el valor ' +
    'anterior, que todavía no existe. Por eso los ejercicios dan dos valores de partida, y por eso un ' +
    'controlador real guarda un pequeño historial de medidas: <em>el retardo obliga al sistema a ' +
    'tener memoria</em>. Con retardo $d$ hacen falta $d+1$ valores iniciales.',
    null, 'Por qué hacen falta dos valores para empezar');

  p.comprueba('En la ducha, giras hacia el caliente y el agua sigue fría tres segundos después. ¿Qué conviene hacer?', [
    { t: 'Girar más: la primera corrección no ha sido suficiente', ok: false, por: 'Ha sido suficiente, pero está en camino. Girar más añade una segunda corrección que llegará junto a la primera: agua hirviendo.' },
    { t: 'Esperar sin tocar: la corrección ya viaja por la tubería', ok: true, por: 'Con retardo, la información de ahora refleja la acción de hace un rato. Corregir menos y esperar es la regla, aunque la impaciencia diga lo contrario.' },
    { t: 'Girar hacia el frío para compensar por adelantado', ok: false, por: 'Eso anula la corrección buena antes de que llegue. Lo que hace falta no es adivinar el signo, sino dejar tiempo a que el efecto aparezca.' }
  ]);

  p.ejemplo({
    title: 'El mismo bucle, con y sin retardo, a mano',
    enunciado: 'Referencia $r = 20$, ganancia $K = 0{,}5$, partiendo de $y = 10$. Calcular cinco pasos sin retardo y cinco con retardo de un paso, $y_{n+1} = y_n + K(r - y_{n-1})$, arrancando con $y_0 = y_1 = 10$.',
    pasos: [
      { t: '<strong>Sin retardo.</strong> $15,\\ 17{,}5,\\ 18{,}75,\\ 19{,}375,\\ 19{,}69$. Cada paso cierra la mitad del hueco: se acerca sin pasarse.', antes: 'Error 10, corrección 5. ¿Y el siguiente?' },
      { t: '<strong>Con retardo, primeros pasos.</strong> $y_2 = 10 + 0{,}5(20 - y_0) = 15$. $y_3 = 15 + 0{,}5(20 - y_1) = 20$. Ya está en el objetivo... pero sigue corrigiendo con el error de hace un paso.', antes: 'Para $y_3$ el error se calcula con $y_1$, no con $y_2$. ¿Cuánto sale?' },
      { t: '<strong>Se pasa.</strong> $y_4 = 20 + 0{,}5(20 - y_2) = 20 + 2{,}5 = 22{,}5$. Y $y_5 = 22{,}5 + 0{,}5(20 - y_3) = 22{,}5 + 0 = 22{,}5$. $y_6 = 22{,}5 + 0{,}5(20 - 22{,}5) = 21{,}25$.', antes: 'En $y_3$ el sistema ya vale 20. ¿Qué error usa para calcular $y_4$? ¿Hacia dónde se mueve?' },
      { t: '<strong>Comparar.</strong> Sin retardo, a los cinco pasos está en 19,7 y sigue acercándose. Con retardo, ha pasado por 22,5 y vuelve oscilando. Misma $K$, mismo objetivo: la única diferencia es que la información llega un paso tarde.' },
      { t: '<strong>Qué ayudaría.</strong> Con $K = 0{,}25$ y retardo, la secuencia es $12{,}5,\\ 15,\\ 16{,}9,\\ 18{,}1,\\ 18{,}9$: más lenta, sin pasarse. Corregir menos funciona mejor que corregir más.', antes: 'Prueba con $K = 0{,}25$ y retardo. ¿Se pasa?' }
    ],
    cierre: 'Nadie ha decidido mal en ningún paso: cada corrección era proporcional al error visible. La oscilación está en la estructura, y por eso no la arregla un operario más listo sino una ganancia más baja o un retardo más corto.'
  });

  p.demo({
    title: 'El mismo bucle, con y sin retardo',
    intro: 'Empieza con retardo cero y una ganancia razonable: el sistema se estabiliza sin problema. Ahora sube el retardo sin tocar nada más. Verás aparecer una oscilación que antes no existía, y con retardo suficiente el sistema se vuelve incontrolable con esa misma ganancia que antes era buena.',
    predice: 'Con $K = 0{,}5$ y retardo 0 se estabiliza. Según el ejemplo, con retardo 1 oscila y se calma. ¿Con retardo 4 y la misma $K$: se calmará, oscilará para siempre o se disparará?',
    build: function (host, d) {
      var K = 0.5, ret = 0, ref = 20, N = 120;
      var out = W.readout(host, '');

      function simular() {
        var hist = [], y = 5;
        for (var i = 0; i <= N; i++) {
          hist.push(y);
          var visto = hist[Math.max(0, i - ret)];
          y = y + K * (ref - visto);
          if (!isFinite(y) || Math.abs(y) > 1e5) { hist.push(NaN); break; }
        }
        return hist.map(function (v, i) { return [i, v]; });
      }

      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: -12, ymax: 52, height: 310,
        xlabel: 'pasos', ylabel: 'temperatura',
        draw: function (g) {
          g.hline(ref, { color: 3, dash: true, w: 1.8 });
          g.text(N - 2, ref + 1.8, 'la que quieres', { align: 'right', color: 3, size: 12, box: true });
          g.path(simular().filter(function (q) { return isFinite(q[1]); }), { color: 0, w: 2.5 });
        }
      });

      function paint() {
        var s = simular().filter(function (q) { return isFinite(q[1]); });
        var cola = s.slice(-30).map(function (q) { return q[1]; });
        var amp = cola.length ? Math.max.apply(null, cola) - Math.min.apply(null, cola) : 0;
        var estable = s.length > N && amp < 0.5;
        var msg;
        if (s.length <= N) msg = '<strong style="color:var(--bad)">Se descontrola.</strong> Con este retardo, esa ganancia ya no vale.';
        else if (estable) msg = '<strong style="color:var(--ok)">Se estabiliza.</strong> La corrección llega a tiempo de servir de algo.';
        else if (amp < 6) msg = '<strong style="color:var(--warn)">Oscila.</strong> Las correcciones llegan tarde y se van cruzando con las siguientes.';
        else msg = '<strong style="color:var(--bad)">Oscila con fuerza.</strong> Cada vaivén es mayor que el anterior.';
        out.set('Ganancia $K = ' + U.fmt(K, 2) + '$ &nbsp;·&nbsp; retardo = <strong>' + ret + ' pasos</strong>' +
          ' &nbsp;·&nbsp; oscilación al final: ' + (s.length <= N ? '—' : U.fmt(amp, 2)) + '<br>' + msg +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Prueba: con retardo 0 aguanta hasta K≈1. Con retardo 4, la misma K de antes ya oscila.</span>');
        plot.render();
      }

      var fila = W.row(host);
      W.slider(fila, { label: 'ganancia K', min: 0.05, max: 1.2, step: 0.01, value: K, on: function (v) { K = v; paint(); } });
      W.slider(fila, { label: 'retardo (pasos)', min: 0, max: 10, step: 1, value: ret, dec: 0, on: function (v) { ret = v; paint(); } });
      W.hint(host, 'Con retardo alto, prueba a BAJAR la ganancia en vez de subirla. Es lo contrario de lo que apetece hacer y es lo que funciona.');
      paint();
    }
  });

  p.text('La conclusión de la gráfica se resume en una frase: <strong>el retardo consume margen de ' +
    'estabilidad</strong>. Una ganancia que era perfectamente segura sin demora deja de serlo con ' +
    'ella, y no porque el sistema haya cambiado, sino porque la información con la que se decide ha ' +
    'envejecido.');

  p.util('Por eso los ingenieros de control se preocupan tanto por el retardo de un lazo, y por eso un ' +
    'sensor lento puede arruinar un sistema con actuadores excelentes. En un coche autónomo, entre ' +
    'que la cámara ve un obstáculo y las ruedas giran hay un retardo de proceso; todo el diseño ' +
    'consiste en que ese retardo sea pequeño comparado con lo que tarda la situación en cambiar. Es ' +
    'también la razón de que conducir con sueño sea tan peligroso: no es que decidas mal, es que ' +
    'decides tarde, y eso basta.');

  p.note('Los retardos de esta ficha son de escala humana: semanas entre el pedido y la entrega, ' +
    'décimas de segundo entre la cámara y las ruedas. Pero el fenómeno no desaparece al bajar de ' +
    'escala. Una puerta lógica tarda unos picosegundos en que su salida responda a lo que le llega, y ' +
    'un cable tarda en transmitir; es poquísimo, pero no es cero, y basta para que un circuito con un ' +
    'bucle pueda quedarse oscilando en vez de asentarse. En ' +
    '[[maq-memoria|el bloque de máquinas y lenguajes]] los circuitos se simulan avanzando por ' +
    'instantes justamente por eso: sin retardo, un anillo de dos puertas no tendría solución y no se ' +
    'podría hablar de él; con retardo, el mismo anillo o se estabiliza en un valor —y entonces ' +
    'recuerda— o oscila para siempre, y el simulador lo avisa.', null,
    'El mismo efecto, a picosegundos');

  /* ---------------------------------------------------------------- */
  p.section('Sobrecorrección y oscilación');

  p.text('Vale la pena poner nombre a la secuencia completa, porque una vez identificada se reconoce ' +
    'en todas partes:');

  p.list([
    'Aparece una desviación y se corrige.',
    'La corrección tarda en hacer efecto, así que <em>parece</em> que no ha servido.',
    'Se corrige más, creyendo que la primera vez fue insuficiente.',
    'Llegan las dos correcciones juntas y el sistema se pasa al otro lado.',
    'Se corrige en sentido contrario, con la misma energía, y vuelve a empezar.'
  ], true);

  p.text('Fíjate en que nadie se ha equivocado en ningún paso: cada decisión era razonable con la ' +
    'información disponible. La oscilación no viene de un error de juicio sino de <strong>la ' +
    'estructura del bucle</strong>. Por eso no se arregla poniendo a alguien más listo a los mandos.');

  p.util('El caso más estudiado de esto tiene nombre propio: el <strong>efecto látigo</strong> de las ' +
    'cadenas de suministro. Una subida pequeña de la demanda en las tiendas provoca un pedido mayor ' +
    'al mayorista, que a su vez pide más al fabricante, que amplía producción; y como todo eso tarda ' +
    'semanas, cuando la mercancía llega la demanda ya bajó, y sigue un vaivén de almacenes llenos y ' +
    'vacíos que puede durar años. Se documentó midiendo pedidos reales y las oscilaciones se ' +
    'amplifican a cada eslabón: cuanto más lejos del cliente, más violento el látigo. La pandemia de ' +
    '2020 hizo de esto un experimento a escala mundial.');

  p.demo({
    title: 'El efecto látigo en una cadena de cuatro eslabones',
    intro: 'Una tienda, un mayorista, un distribuidor y una fábrica. Cada uno pide al siguiente lo que le piden a él, más una corrección para rehacer su almacén, y lo pedido tarda unas semanas en llegar. En la semana 5 la demanda de los clientes pasa de 4 a 8 cajas y ya no cambia más. Mira lo que hacen los pedidos río arriba; luego activa «contar lo que ya viene de camino».',
    predice: 'La demanda real solo sube de 4 a 8, una vez. ¿Hasta cuánto crees que llegará el pedido máximo de la fábrica: 8, 12, más de 20?',
    build: function (host) {
      var L = 2, alfa = 0.5, cuenta = false, T = 40, OBJ = 12;
      var NOM = ['tienda', 'mayorista', 'distribuidor', 'fábrica'];
      var out = W.readout(host, '');
      function cliente(t) { return t < 5 ? 4 : 8; }

      function simula() {
        var O = [[], [], [], []], I = [OBJ, OBJ, OBJ, OBJ], tubo = [];
        for (var i = 0; i < 4; i++) { tubo.push([]); for (var j = 0; j < L; j++) tubo[i].push(4); }
        for (var t = 0; t < T; t++) {
          for (var k = 0; k < 4; k++) {
            var dem = k === 0 ? cliente(t) : O[k - 1][t];
            I[k] += tubo[k].shift() - dem;                    // llega lo pedido hace L semanas y se sirve lo pedido ahora
            var enCamino = tubo[k].reduce(function (a, b) { return a + b; }, 0);
            var pide = dem + alfa * (OBJ - I[k]) + (cuenta ? alfa * ((L - 1) * dem - enCamino) : 0);
            pide = Math.max(0, pide);
            tubo[k].push(pide);
            O[k].push(pide);
          }
        }
        return O;
      }

      var plot = W.plot(host, {
        xmin: 0, xmax: T - 1, ymin: 0, ymax: 40, height: 300, xlabel: 'semanas', ylabel: 'cajas pedidas',
        draw: function (g) {
          var O = simula(), cl = [];
          for (var t = 0; t < T; t++) cl.push([t, cliente(t)]);
          g.path(cl, { color: 'ink', w: 1.6, dash: true });
          for (var k = 0; k < 4; k++) g.path(O[k].map(function (v, t2) { return [t2, v]; }), { color: k, w: k === 3 ? 2.8 : 2 });
        }
      });

      function pinta() {
        var O = simula(), maxs = O.map(function (s) { return Math.max.apply(null, s); });
        plot.view(0, T - 1, 0, Math.max(12, Math.max.apply(null, maxs) * 1.1));
        out.set('Pedido máximo &nbsp;·&nbsp; clientes: <strong>8</strong>' + NOM.map(function (n, k) {
          return ' &nbsp;·&nbsp; ' + n + ': <strong>' + U.fmt(maxs[k], 1) + '</strong>';
        }).join('') + '<br>' + (cuenta
          ? 'Contando lo que ya viene de camino, nadie pide dos veces lo mismo y el látigo se amansa.'
          : 'Cuanto más lejos del cliente, más violento el vaivén, aunque la demanda real solo cambió una vez.'));
      }

      W.chips(host, [{ label: 'solo miran su almacén', value: false }, { label: 'contar lo que ya viene de camino', value: true }], { value: cuenta, on: function (v) { cuenta = v; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'semanas de retardo', min: 1, max: 4, step: 1, value: L, on: function (v) { L = v; pinta(); } });
      W.slider(fila, { label: 'energía de la corrección', min: 0.1, max: 1, step: 0.05, value: alfa, on: function (v) { alfa = v; pinta(); } });
      W.legend(host, [{ c: U.palette().ink, t: 'clientes' }, { c: 0, t: 'tienda' }, { c: 1, t: 'mayorista' }, { c: 2, t: 'distribuidor' }, { c: 3, t: 'fábrica' }]);
      pinta();
    }
  });

  p.hist('El estudio sistemático de estos bucles con retardo lo empezó Jay Forrester en el MIT en los ' +
    'años cincuenta, y fundó lo que se llamó <em>dinámica de sistemas</em>. Venía de la ingeniería ' +
    'eléctrica —había dirigido el desarrollo de la memoria de núcleos magnéticos, que fue la memoria ' +
    'de los ordenadores durante dos décadas— y aplicó las mismas herramientas de los circuitos ' +
    'realimentados a las empresas, a las ciudades y, en 1971, al planeta entero. Aquel último modelo ' +
    'dio lugar al informe <em>Los límites del crecimiento</em>, que provocó una polémica que todavía ' +
    'colea. Sus alumnos crearon además el <em>beer game</em>, un juego de mesa donde los participantes ' +
    'gestionan una cadena de distribución y generan sin falta un efecto látigo espectacular, ' +
    'convencidos cada uno de que la culpa es del de al lado.');

  p.util('La solución práctica en sistemas con retardo no suele ser un control más agresivo, sino ' +
    '<strong>acortar el retardo o predecir</strong>. Acortar: que la información viaje antes, que es ' +
    'la razón de que un supermercado comparta en tiempo real sus ventas con sus proveedores. Predecir: ' +
    'corregir según lo que <em>estimas</em> que estará pasando cuando llegue tu acción, en lugar de ' +
    'según lo que veías. Esa segunda idea, llevada a las matemáticas, es el asunto de ' +
    '[[cib-filtrado|predicción y filtrado]] y del [[cib-kalman|filtro de Kalman]].');

  p.trampas([
    { e: 'Corregir más fuerte cuando «no pasa nada»', por: 'Sí pasa: la corrección está en camino. Añadir otra encima es la receta de la ducha hirviendo y del efecto látigo.' },
    { e: 'Culpar al grifo o al operario', por: 'En un bucle con retardo, cada decisión es razonable con la información visible y aun así el conjunto oscila. Es la estructura, no el juicio.' },
    { e: 'Usar la ganancia que era segura sin retardo', por: 'El retardo consume margen de estabilidad. Con $K = 0{,}5$ y retardo 4, lo que antes convergía ahora oscila con fuerza. Hay que bajar $K$.' },
    { e: 'Calcular el error con el último valor cuando hay retardo', por: 'La fórmula es $y_{n+1} = y_n + K(r - y_{n-d})$: el error se mide con el valor de hace $d$ pasos. Ese es todo el problema, y hay que reproducirlo en la cuenta.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Diagnostica el sistema',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'Un país sube los tipos de interés y la inflación no baja hasta dieciocho meses después.', q: 'retardo' },
        { t: 'Un altavoz cerca de su micrófono produce un pitido que crece hasta saturar.', q: 'positiva' },
        { t: 'El nivel de la cisterna sube y el flotador va cerrando la entrada de agua.', q: 'negativa' },
        { t: 'Los ganaderos crían más terneros porque la carne está cara; cuando crecen, hay exceso y el precio se hunde.', q: 'retardo' },
        { t: 'El regulador de Watt cierra la válvula cuando la máquina se acelera.', q: 'negativa' },
        { t: 'Cuanto más se derrite el hielo polar, menos luz refleja el planeta y más se calienta.', q: 'positiva' },
        { t: 'Un almacén repone según las ventas del mes pasado y acaba alternando entre desabastecido y abarrotado.', q: 'retardo' },
        { t: 'El cuerpo suda al subir la temperatura interna y eso la hace bajar.', q: 'negativa' }
      ];
      var c = r.pick(casos);
      return { texto: c.t, q: c.q };
    },
    ask: function (d) {
      return 'Identifica qué domina en esta situación:<br><br><em>«' + d.texto + '»</em>';
    },
    fields: [{ name: 'q', label: 'Domina', opts: [{ t: 'realimentación negativa: estabiliza sin más', v: 'negativa' }, { t: 'realimentación positiva: amplifica', v: 'positiva' }, { t: 'el retardo: estabiliza, pero oscila porque la información llega tarde', v: 'retardo' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return '¿Hay oscilación o vaivén en el tiempo? Entonces sospecha del retardo, aunque el bucle sea estabilizador.'; },
    steps: function (d) {
      var m = {
        retardo: ['La corrección va en el sentido correcto: el bucle es estabilizador.',
                  'Pero entre la acción y su efecto pasa mucho tiempo, y mientras tanto se sigue corrigiendo.',
                  'El resultado es el vaivén característico: aquí domina el <strong>retardo</strong>.'],
        positiva: ['La desviación provoca algo que la agranda todavía más.',
                   'Cada vuelta del bucle deja el sistema más lejos de donde partió.',
                   'Es realimentación <strong>positiva</strong>.'],
        negativa: ['La desviación provoca una respuesta que se opone a ella.',
                   'El efecto llega enseguida, sin demora apreciable, y el sistema vuelve a su sitio.',
                   'Es realimentación <strong>negativa</strong> limpia.']
      };
      return m[d.q];
    },
    answer: function (d) { return d.q; }
  });

  p.exercise({
    title: 'Un bucle con memoria',
    level: 'medio',
    gen: function (r) {
      var ref = r.int(10, 24);
      var y0 = ref - r.int(6, 14);
      var K = r.pick([0.4, 0.5, 0.6]);
      var pasos = r.int(3, 5);
      return { ref: ref, y0: y0, K: K, pasos: pasos };
    },
    ask: function (d) {
      return 'Un bucle con <strong>retardo de 1 paso</strong> sigue la regla ' +
        '$y_{n+1} = y_n + K\\,(r - y_{n-1})$, con $K = ' + U.fmt(d.K, 1) + '$ y $r = ' + d.ref + '$.<br><br>' +
        'Empieza en $y_0 = y_1 = ' + d.y0 + '$ (los dos primeros valores son iguales). ' +
        '¿Cuánto vale $y_{' + (d.pasos + 1) + '}$?';
    },
    fields: [{ name: 'y', label: 'y =', w: 'tiny' }],
    sol: function (d) {
      var y = [d.y0, d.y0];
      for (var n = 1; n <= d.pasos; n++) y.push(y[n] + d.K * (d.ref - y[n - 1]));
      return { y: y[d.pasos + 1] };
    },
    tol: 1e-6,
    hint: function () { return 'En cada paso, el error se calcula con el valor de <strong>dos posiciones atrás</strong> en la lista, no con el último.'; },
    steps: function (d) {
      var y = [d.y0, d.y0], l = ['Arrancamos con $y_0 = y_1 = ' + d.y0 + '$.'];
      for (var n = 1; n <= d.pasos; n++) {
        var nuevo = y[n] + d.K * (d.ref - y[n - 1]);
        l.push('$y_{' + (n + 1) + '} = ' + U.fmt(y[n], 3) + ' + ' + U.fmt(d.K, 1) + '\\,(' + d.ref +
          ' - ' + U.fmt(y[n - 1], 3) + ') = ' + U.fmt(nuevo, 3) + '$');
        y.push(nuevo);
      }
      l.push('Fíjate en que sigue corrigiendo con fuerza aunque ya se esté acercando: está mirando información vieja.');
      return l;
    }
  });

  p.exercise({
    title: 'El látigo, eslabón a eslabón',
    level: 'medio',
    gen: function (r) {
      var a = r.int(2, 6), f = r.pick([1.5, 2, 2.5, 3]), k = r.int(2, 4);
      return { a: a, f: f, k: k, v: a * Math.pow(f, k) };
    },
    ask: function (d) {
      return 'La demanda de los clientes de una tienda oscila $\\pm' + d.a + '$ cajas por semana alrededor de su media. En esta cadena, ' +
        'cada eslabón multiplica por $' + U.fmt(d.f, 1) + '$ la oscilación de lo que le piden al hacer sus propios pedidos. La tienda es el ' +
        'eslabón 1. ¿Cuántas cajas oscilan los pedidos del eslabón ' + d.k + '?';
    },
    fields: [{ name: 'v', label: '± cajas', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    tol: 1e-6,
    errores: [
      { si: function (v, d) { return Math.abs(d.a * d.f * d.k - d.v) > 1e-6 && Math.abs(v.v - d.a * d.f * d.k) < 1e-6; }, msg: 'La amplificación no se suma eslabón a eslabón: se <strong>multiplica</strong>. Cada eslabón amplifica lo que ya viene amplificado.' },
      { si: function (v, d) { return Math.abs(v.v - d.a * Math.pow(d.f, d.k - 1)) < 1e-6; }, msg: 'Cuidado con la cuenta: la tienda, que es el eslabón 1, ya amplifica una vez.' }
    ],
    hint: function () { return ['La tienda pide con una oscilación $\\pm a\\cdot f$.', 'El eslabón siguiente vuelve a multiplicar por $f$ lo que recibe.']; },
    steps: function (d) {
      var l = [], v = d.a;
      for (var i = 1; i <= d.k; i++) { v *= d.f; l.push('Eslabón ' + i + ': $\\pm' + U.fmt(v, 3) + '$'); }
      l.push('En general: $\\pm a\\,f^k = ' + d.a + '\\cdot ' + U.fmt(d.f, 1) + '^{' + d.k + '} = ' + U.fmt(d.v, 3) + '$ cajas. El crecimiento es exponencial con la distancia al cliente.');
      return l;
    },
    answer: function (d) { return '±' + U.fmt(d.v, 3); }
  });

  p.exercise({
    title: '¿Se corrige, oscila o se descontrola?',
    level: 'avanzado',
    gen: function (r) {
      var ret = r.int(0, 1);
      var K = ret === 0 ? r.pick([0.3, 0.6, 0.9, 1.3, 1.6, 2.4]) : r.pick([0.1, 0.2, 0.4, 0.7, 1.3, 1.6]);
      var q = ret === 0 ? (K < 1 ? 'suave' : (K < 2 ? 'oscila' : 'explota')) : (K <= 0.25 ? 'suave' : (K < 1 ? 'oscila' : 'explota'));
      var y = [1, 1];                                     // y_{-1} e y_0, con r = 0
      for (var i = 0; i < 8; i++) { var n = y.length - 1; y.push(y[n] - K * y[n - ret]); }
      return { ret: ret, K: K, q: q, y: y };
    },
    ask: function (d) {
      return 'En el bucle $y_{n+1} = y_n + K\\,(r - y_{n-d})$, con retardo $d = ' + d.ret + '$ y ganancia $K = ' + U.fmt(d.K, 1) +
        '$, se produce una desviación respecto de la referencia. ¿Qué le pasa a esa desviación con el tiempo?';
    },
    fields: [{ name: 'q', label: 'La desviación', opts: [{ t: 'se corrige sin pasarse', v: 'suave' }, { t: 'oscila, pero se va apagando', v: 'oscila' }, { t: 'crece sin control', v: 'explota' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return ['Pon $r = 0$, así $y$ es directamente la desviación. Empieza con $y = 1$ (y también 1 el valor anterior) y calcula cinco o seis pasos a mano.', '¿Cambia de signo? ¿Crece o mengua su tamaño?']; },
    steps: function (d) {
      return ['Con $r = 0$ y partiendo de $1$, los valores siguientes son: $' + d.y.slice(2).map(function (v) { return U.fmt(v, 3); }).join(',\\ ') + '$',
        d.ret === 0
          ? 'Sin retardo, cada paso multiplica la desviación por $1 - K = ' + U.fmt(1 - d.K, 1) + '$. Si ese número está entre 0 y 1 se corrige sin pasarse; entre −1 y 0, cambia de signo en cada paso pero mengua; por debajo de −1, crece.'
          : 'Con retardo 1 la ganancia segura se reduce a la mitad: el bucle solo es estable si $K < 1$, y en cuanto $K > \\frac{1}{4}$ empieza a oscilar. Sin retardo, eso ocurría con $K < 2$ y $K > 1$.',
        { suave: 'La desviación <strong>se corrige sin pasarse</strong>.', oscila: 'La desviación <strong>oscila y se apaga</strong>.', explota: 'La desviación <strong>crece sin control</strong>.' }[d.q]];
    },
    answer: function (d) { return { suave: 'Se corrige sin pasarse', oscila: 'Oscila y se apaga', explota: 'Se descontrola' }[d.q]; }
  });

  p.keys([
    'El <strong>efecto látigo</strong> crece de forma exponencial con la distancia al cliente; se amansa contando lo que ya viene de camino.',
    'Con retardo, la ganancia que antes era segura empieza a oscilar o se vuelve inestable: el retardo consume margen de estabilidad.',
    'Un <strong>retardo</strong> es el tiempo entre una acción correctora y su efecto observable.',
    'Con retardo se corrige mirando información vieja, y por eso se acumulan correcciones que aún están en camino.',
    'El retardo consume margen de estabilidad: una ganancia segura sin demora puede oscilar o descontrolarse con ella.',
    'La respuesta correcta es contraintuitiva: <strong>corregir menos y esperar</strong>, no corregir más fuerte.',
    'La oscilación no viene de decidir mal, sino de la estructura del bucle; no se arregla con alguien más listo a los mandos.',
    'El <strong>efecto látigo</strong> de las cadenas de suministro es este fenómeno a escala industrial.'
  ]);

});
