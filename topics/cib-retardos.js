/* Tema: Retardos y oscilación */
Course.topic('cib-retardos', function (p) {

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

  p.demo({
    title: 'El mismo bucle, con y sin retardo',
    intro: 'Empieza con retardo cero y una ganancia razonable: el sistema se estabiliza sin problema. Ahora sube el retardo sin tocar nada más. Verás aparecer una oscilación que antes no existía, y con retardo suficiente el sistema se vuelve incontrolable con esa misma ganancia que antes era buena.',
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
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">Prueba: con retardo 0 aguanta hasta K≈1. Con retardo 4, la misma K de antes ya oscila.</span>');
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
    'según lo que veías. Esa segunda idea, llevada a las matemáticas, es el tema siguiente.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

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
      return 'Identifica qué domina en esta situación:<br><br><em>«' + d.texto + '»</em><br><br>' +
        'Responde <strong>negativa</strong> (bucle estabilizador sin más), <strong>positiva</strong> ' +
        '(bucle amplificador) o <strong>retardo</strong> (bucle estabilizador que oscila porque la ' +
        'información llega tarde).';
    },
    fields: [{ name: 'q', label: 'domina…', w: 'wide' }],
    sol: function (d) { return { q: d.q }; },
    check: function (v, d) {
      var q = U.eligeOpcion(v.raw.q, {
        retardo: /retard|demora|tarda|desfas|retras|llega tarde/,
        positiva: /positiv|amplific|refuerz/,
        negativa: /negativ|estabiliz|corrig|compens/
      });
      if (!q) return { ok: false, msg: 'Responde con una de las tres: negativa, positiva o retardo.' };
      return { ok: q === d.q };
    },
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

  p.keys([
    'Un <strong>retardo</strong> es el tiempo entre una acción correctora y su efecto observable.',
    'Con retardo se corrige mirando información vieja, y por eso se acumulan correcciones que aún están en camino.',
    'El retardo consume margen de estabilidad: una ganancia segura sin demora puede oscilar o descontrolarse con ella.',
    'La respuesta correcta es contraintuitiva: <strong>corregir menos y esperar</strong>, no corregir más fuerte.',
    'La oscilación no viene de decidir mal, sino de la estructura del bucle; no se arregla con alguien más listo a los mandos.',
    'El <strong>efecto látigo</strong> de las cadenas de suministro es este fenómeno a escala industrial.'
  ]);

});
