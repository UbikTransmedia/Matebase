/* Tema: Control por error: proporcional, integral y derivativo */
Course.topic('cib-control', function (p) {

  p.text('En el primer tema del bloque corregíamos con una sola regla: <em>mira cuánto te has desviado ' +
    'y empuja en proporción</em>. Funciona, y para muchas cosas basta. Pero tiene dos defectos que ' +
    'aparecen en cuanto se prueba en el mundo real, y arreglarlos exige exactamente las dos ' +
    'herramientas que aprendiste en el bloque de análisis.');

  p.text('Este tema es, en ese sentido, el que más rendimiento le saca al curso entero: vas a ver la ' +
    '<strong>derivada</strong> y la <strong>integral</strong> trabajando juntas, en tiempo real, para ' +
    'pilotar algo. No como ejercicio, sino como las dos manos con las que se conduce.');

  /* ---------------------------------------------------------------- */
  p.section('La señal de error');

  p.text('Todo controlador vive de una sola cantidad: la diferencia entre lo que quieres y lo que hay. ' +
    'Se llama <strong>señal de error</strong> y es lo único que el controlador mira. Ni siquiera ' +
    'necesita saber qué está controlando.');

  p.formula('e(t) = r - y(t)', 'la señal de error',
    'Se lee: <em>«e de te es igual a erre menos i griega de te»</em>.<br><br>' +
    '$r$ es la <strong>referencia</strong> o consigna —lo que quieres— e $y(t)$ es la ' +
    '<strong>medida</strong> —lo que hay en el instante $t$—.<br><br>Que el error sea negativo no es ' +
    'un problema: significa que te has pasado, y el signo es justamente lo que le dice al controlador ' +
    'hacia dónde empujar.');

  p.text('A partir de esa señal se pueden hacer tres preguntas distintas, y cada una da un término del ' +
    'controlador. Son estas, y merece la pena leerlas despacio porque las tres últimas palabras ya ' +
    'las conoces:');

  p.list([
    '<strong>¿Cuánto me he desviado ahora mismo?</strong> Eso es el error, sin más. Da el término ' +
      '<em>proporcional</em>.',
    '<strong>¿Cuánto error llevo acumulado desde que empecé?</strong> Sumar el error a lo largo del ' +
      'tiempo es <strong>integrarlo</strong>. Da el término <em>integral</em>.',
    '<strong>¿Hacia dónde va el error, se está corrigiendo o empeorando?</strong> El ritmo al que ' +
      'cambia el error es su <strong>derivada</strong>. Da el término <em>derivativo</em>.'
  ]);

  p.formula('u(t) = K_p\\,e(t) \\;+\\; K_i \\int_0^{t} e(\\tau)\\,d\\tau \\;+\\; K_d\\,\\frac{de(t)}{dt}',
    'el controlador PID',
    'Se dice: <em>«u de te es igual a ka pe por e de te, más ka i por la integral entre cero y te de e ' +
    'de tau diferencial tau, más ka de por la derivada de e respecto del tiempo»</em>.<br><br>' +
    'La letra $\\tau$ es la tau griega y solo sirve para no repetir la $t$ dentro de la integral: ' +
    'recorre el tiempo desde el principio hasta ahora.<br><br>Los tres coeficientes $K_p$, $K_i$ y ' +
    '$K_d$ son los <strong>mandos</strong>: dicen cuánto caso hacer a cada término. Ajustarlos se ' +
    'llama «sintonizar el controlador», y es un oficio.<br><br>' +
    'En cristiano: <em>«corrijo según lo desviado que estoy, más lo que llevo desviado en total, más ' +
    'la prisa que lleva la desviación»</em>.');

  p.note('Fíjate en lo que acaba de pasar. La integral, que aprendiste como «el área bajo una curva», ' +
    'aquí es <strong>la memoria del controlador</strong>: recuerda todo el error que ha ido ' +
    'quedándose sin corregir. Y la derivada, que aprendiste como «la pendiente de la tangente», es ' +
    'aquí <strong>la anticipación</strong>: si el error está cayendo deprisa, avisa de que conviene ' +
    'aflojar antes de pasarse. Memoria y anticipación, con las dos operaciones del cálculo.',
    'ok', 'Para esto servían');

  /* ---------------------------------------------------------------- */
  p.section('Los tres términos del PID');

  p.text('Cada término arregla un defecto concreto, y la mejor manera de entenderlos es verlos fallar ' +
    'de uno en uno.');

  p.sub('Solo proporcional: se queda corto');

  p.text('Con únicamente el término proporcional, la corrección es proporcional al error. El problema ' +
    'aparece cuando hay una carga constante que empuja en contra —la gravedad sobre un ascensor, el ' +
    'frío que entra por la ventana, el peso de un dron—. Para compensarla hace falta una corrección ' +
    'permanente, y una corrección permanente exige un error permanente, porque el término proporcional ' +
    'no da nada si el error es cero.');

  p.text('El resultado es que el sistema se queda <em>casi</em> en el objetivo, pero nunca del todo. ' +
    'Ese hueco se llama <strong>error en régimen permanente</strong>, y es la razón número uno por la ' +
    'que un control solo proporcional no basta.');

  p.sub('El término integral: la memoria que cierra el hueco');

  p.text('La integral acumula el error. Si queda un huequito de error, por pequeño que sea, la ' +
    'acumulación va creciendo sin parar y con ella la corrección, hasta que el hueco se cierra. Es ' +
    'terca: no se conforma con estar cerca.');

  p.text('Su peligro es esa misma terquedad. Si el error se mantiene mucho tiempo —porque el sistema ' +
    'está bloqueado, por ejemplo— la integral se dispara y luego tarda muchísimo en descargarse, ' +
    'provocando un sobrepaso enorme. Los ingenieros lo llaman <em>windup</em>, y todos los ' +
    'controladores serios llevan un tope para evitarlo.');

  p.sub('El término derivativo: el freno anticipado');

  p.text('La derivada mira la <em>velocidad</em> del error. Si el error se está cerrando muy deprisa, ' +
    'el término derivativo frena antes de llegar, porque adivina que a ese ritmo nos vamos a pasar. Es ' +
    'lo que hace un conductor que levanta el pie antes del semáforo en vez de frenar encima.');

  p.text('Su peligro es el ruido. Como responde al ritmo de cambio, cualquier temblor en la medida se ' +
    'amplifica; por eso en la práctica la señal se filtra antes, que es justo el asunto de otro tema ' +
    'de este bloque.');

  p.demo({
    title: 'Sintoniza un PID',
    intro: 'Hay que llevar la barra a la línea de puntos, y hay una carga constante tirando de ella hacia abajo. Empieza con solo Kp y observa que se queda corta: ese hueco es el error en régimen permanente. Luego sube Ki y míralo cerrarse. Después sube Kp mucho y añade Kd para domar el sobrepaso.',
    build: function (host, d) {
      var Kp = 0.8, Ki = 0, Kd = 0;
      var ref = 10, carga = 2.2, N = 260, dt = 0.1;
      var out = W.readout(host, '');

      function simular() {
        var y = 0, v = 0, I = 0, ePrev = ref;
        var s = [[0, 0]], maxv = 0;
        for (var i = 1; i <= N; i++) {
          var e = ref - y;
          I += e * dt;
          if (I > 60) I = 60; if (I < -60) I = -60;      // tope contra el windup
          var D = (e - ePrev) / dt;
          ePrev = e;
          var u = Kp * e + Ki * I + Kd * D;
          v += (u - 0.9 * v - carga) * dt;               // la carga tira siempre hacia abajo
          y += v * dt;
          if (!isFinite(y) || Math.abs(y) > 1e4) { y = NaN; break; }
          if (y > maxv) maxv = y;
          s.push([i * dt, y]);
        }
        return { s: s, max: maxv, fin: s.length ? s[s.length - 1][1] : NaN };
      }

      var plot = W.plot(host, {
        xmin: 0, xmax: N * dt, ymin: -2, ymax: 20, height: 300,
        xlabel: 'segundos', ylabel: 'posición',
        draw: function (g) {
          g.hline(ref, { color: 3, dash: true, w: 1.8 });
          g.text(N * dt - 0.4, ref + 0.9, 'objetivo', { align: 'right', color: 3, size: 12, box: true });
          var r = simular();
          g.path(r.s, { color: 0, w: 2.6 });
        }
      });

      function paint() {
        var r = simular();
        var t;
        if (!isFinite(r.fin)) {
          t = '<strong style="color:var(--bad)">Se ha ido de las manos.</strong> Con esos ajustes el bucle se descontrola.';
        } else {
          var resto = ref - r.fin;
          var sobre = r.max - ref;
          t = 'Posición final: <strong>' + U.fmt(r.fin, 2) + '</strong> de ' + ref +
            ' &nbsp;·&nbsp; error que queda: <strong>' + U.fmt(resto, 2) + '</strong>' +
            ' &nbsp;·&nbsp; sobrepaso: ' + (sobre > 0.05 ? U.fmt(sobre, 2) : 'ninguno') + '<br>';
          if (Ki === 0 && Math.abs(resto) > 0.15) {
            t += '<span style="color:var(--warn)">Se queda corta y ahí se queda: eso es el <strong>error en régimen permanente</strong>. ' +
              'Sube $K_i$ y verás cómo se cierra.</span>';
          } else if (Math.abs(resto) < 0.15 && sobre > 2) {
            t += '<span style="color:var(--warn)">Llega al objetivo, pero se pasa mucho por el camino. Prueba a subir $K_d$ para frenar antes.</span>';
          } else if (Math.abs(resto) < 0.15 && sobre <= 2) {
            t += '<span style="color:var(--ok)">Buen ajuste: llega al objetivo y sin pasarse apenas.</span>';
          } else {
            t += 'Sigue probando: el objetivo es error final cero y poco sobrepaso.';
          }
        }
        out.set(t);
        plot.render();
      }

      var f1 = W.row(host);
      W.slider(f1, { label: 'Kp (proporcional)', min: 0, max: 6, step: 0.05, value: Kp, on: function (v) { Kp = v; paint(); } });
      W.slider(f1, { label: 'Ki (integral)', min: 0, max: 3, step: 0.02, value: Ki, on: function (v) { Ki = v; paint(); } });
      W.slider(f1, { label: 'Kd (derivativo)', min: 0, max: 3, step: 0.02, value: Kd, on: function (v) { Kd = v; paint(); } });
      W.hint(host, 'Un recorrido recomendado: (1) Kp=0,8 y el resto a cero. (2) Sube Ki a 0,6. (3) Sube Kp a 4 y mira el sobrepaso. (4) Añade Kd hasta domarlo.');
      paint();
    }
  });

  p.util('El PID es, con diferencia, el algoritmo de control más usado del mundo: se estima que ' +
    'gobierna la enorme mayoría de los lazos de control industriales que existen, y lleva haciéndolo ' +
    'desde los años cuarenta. Está en el control de crucero de un coche, en el horno que mantiene la ' +
    'temperatura, en el brazo de un robot, en la impresora 3D que calienta la boquilla, en el ' +
    'estabilizador de una cámara y en los cuatro motores de un dron corrigiéndose cientos de veces ' +
    'por segundo para que se quede quieto en el aire.');

  p.hist('El primer PID reconocible es de 1922 y salió de un problema muy concreto: gobernar el timón ' +
    'de un barco. Nicolas Minorsky, ingeniero ruso emigrado a Estados Unidos, estaba estudiando cómo ' +
    'pilotaban los timoneles expertos y observó que no reaccionaban solo al rumbo equivocado, sino ' +
    'también a la insistencia del desvío y a la velocidad con la que el barco giraba. Escribió eso en ' +
    'ecuaciones y obtuvo los tres términos. Es decir: el PID no se inventó en un laboratorio, se ' +
    '<em>copió</em> observando a personas que ya lo hacían bien sin saber que lo hacían.');

  p.util('Y esa historia tiene una lectura que va más allá de la ingeniería: la manera en que una ' +
    'persona regula algo con soltura suele contener, sin formular, la matemática correcta. Lo mismo ' +
    'ocurre al aprender a conducir, a servir agua sin derramarla o a mantener el equilibrio en ' +
    'bicicleta: lo que se está adquiriendo con la práctica es una sintonía de ganancias.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Calcula la acción del controlador',
    level: 'medio',
    gen: function (r) {
      var ref = r.int(20, 60);
      var y = ref - r.pm(2, 10);
      var yPrev = y - r.pm(1, 4);
      var acum = r.int(-8, 14);
      var Kp = r.pick([0.5, 1, 1.5, 2]);
      var Ki = r.pick([0.1, 0.2, 0.4]);
      var Kd = r.pick([0.5, 1, 2]);
      var dt = 1;
      return { ref: ref, y: y, yPrev: yPrev, acum: acum, Kp: Kp, Ki: Ki, Kd: Kd, dt: dt };
    },
    ask: function (d) {
      return 'Un controlador PID con $K_p = ' + U.fmt(d.Kp, 1) + '$, $K_i = ' + U.fmt(d.Ki, 1) +
        '$ y $K_d = ' + U.fmt(d.Kd, 1) + '$ trabaja con referencia $r = ' + d.ref + '$.<br><br>' +
        'En este instante mide $y = ' + d.y + '$, y en el anterior medía $y_{\\text{ant}} = ' + d.yPrev +
        '$. El error acumulado hasta ahora (sin contar el de este instante) vale $' + d.acum + '$. ' +
        'El paso de tiempo es $\\Delta t = 1$.<br><br>' +
        'Calcula el error actual, los tres términos y la acción total $u$.';
    },
    fields: [
      { name: 'e', label: 'error e =', w: 'tiny' },
      { name: 'u', label: 'acción u =', w: 'tiny' }
    ],
    sol: function (d) {
      var e = d.ref - d.y;
      var ePrev = d.ref - d.yPrev;
      var I = d.acum + e * d.dt;
      var D = (e - ePrev) / d.dt;
      return { e: e, u: d.Kp * e + d.Ki * I + d.Kd * D };
    },
    tol: 1e-6,
    hint: function () {
      return 'Ojo con la derivada: es la variación del <strong>error</strong>, no de la medida. Y el error anterior se calcula igual, con la medida anterior.';
    },
    steps: function (d) {
      var e = d.ref - d.y, ePrev = d.ref - d.yPrev;
      var I = d.acum + e * d.dt, D = (e - ePrev) / d.dt;
      return [
        'Error actual: $e = r - y = ' + d.ref + ' - ' + d.y + ' = ' + U.fmts(e, 0) + '$.',
        'Error anterior: $e_{\\text{ant}} = ' + d.ref + ' - ' + d.yPrev + ' = ' + U.fmts(ePrev, 0) + '$.',
        'Término <strong>proporcional</strong>: $K_p\\,e = ' + U.fmt(d.Kp, 1) + ' \\cdot ' + U.fmts(e, 0) + ' = ' + U.fmts(d.Kp * e, 3) + '$.',
        'Acumulado nuevo: $' + d.acum + ' + ' + U.fmts(e, 0) + ' = ' + U.fmts(I, 0) + '$, y el término <strong>integral</strong> es $K_i \\cdot ' + U.fmts(I, 0) + ' = ' + U.fmts(d.Ki * I, 3) + '$.',
        'Variación del error: $' + U.fmts(e, 0) + ' - (' + U.fmts(ePrev, 0) + ') = ' + U.fmts(D, 0) + '$, y el término <strong>derivativo</strong> es $K_d \\cdot ' + U.fmts(D, 0) + ' = ' + U.fmts(d.Kd * D, 3) + '$.',
        'Acción total: $u = ' + U.fmts(d.Kp * e, 3) + ' + ' + U.fmts(d.Ki * I, 3) + ' + ' + U.fmts(d.Kd * D, 3) + ' = ' + U.fmts(d.Kp * e + d.Ki * I + d.Kd * D, 3) + '$.'
      ];
    }
  });

  p.exercise({
    title: '¿Qué término falta?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'El horno se queda estabilizado en 178° cuando le habíamos pedido 180°, y ahí se queda para siempre.', q: 'integral',
          por: 'Queda un error permanente que nadie cierra; eso lo arregla el término que acumula.' },
        { t: 'El brazo del robot llega a la posición pedida pero pasándose y volviendo varias veces antes de quedarse quieto.', q: 'derivativo',
          por: 'Hay sobrepaso y oscilación: falta el término que frena antes de llegar.' },
        { t: 'El sistema reacciona con muchísima lentitud aunque el error sea grande.', q: 'proporcional',
          por: 'La respuesta inmediata es floja: hay que subir la ganancia proporcional.' },
        { t: 'El dron se queda un palmo por debajo de la altura pedida y no sube más.', q: 'integral',
          por: 'La carga constante (el peso) exige una corrección permanente, y eso solo la da el acumulador.' },
        { t: 'El coche del control de crucero alcanza la velocidad pero dando tirones cada vez menores.', q: 'derivativo',
          por: 'Las oscilaciones que se van apagando piden más amortiguación, es decir, más derivativo.' },
        { t: 'Al pedirle un cambio grande, el ascensor tarda una eternidad en arrancar.', q: 'proporcional',
          por: 'Con error grande debería haber acción grande: eso es el término proporcional.' }
      ];
      var c = r.pick(casos);
      return { texto: c.t, q: c.q, por: c.por };
    },
    ask: function (d) {
      return 'Observa el síntoma y di qué término del PID hay que reforzar:<br><br><em>«' + d.texto +
        '»</em><br><br>Responde <strong>proporcional</strong>, <strong>integral</strong> o ' +
        '<strong>derivativo</strong>.';
    },
    fields: [{ name: 'q', label: 'reforzar el término', w: 'wide' }],
    sol: function (d) { return { q: d.q }; },
    check: function (v, d) {
      var s = String(v.raw.q || '').toLowerCase();
      var esP = /proporcion|\bkp\b|\bp\b/.test(s);
      var esI = /integr|\bki\b|acumul/.test(s);
      var esD = /deriv|\bkd\b|amortig/.test(s);
      var n = (esP ? 1 : 0) + (esI ? 1 : 0) + (esD ? 1 : 0);
      if (n !== 1) return { ok: false, msg: 'Responde con uno solo de los tres términos.' };
      return { ok: (d.q === 'proporcional' && esP) || (d.q === 'integral' && esI) || (d.q === 'derivativo' && esD) };
    },
    hint: function () {
      return 'Error que no se cierra nunca → integral. Sobrepaso y vaivenes → derivativo. Todo demasiado lento → proporcional.';
    },
    steps: function (d) {
      return [d.por, 'El término que hay que reforzar es el <strong>' + d.q + '</strong>.'];
    },
    answer: function (d) { return d.q; }
  });

  p.keys([
    'Todo controlador trabaja sobre la <strong>señal de error</strong> $e = r - y$: la diferencia entre lo que quieres y lo que hay.',
    'El término <strong>proporcional</strong> responde al error de ahora; su defecto es dejar un error permanente cuando hay carga.',
    'El <strong>integral</strong> acumula el error y cierra ese hueco: es la memoria del controlador. Su riesgo es el <em>windup</em>.',
    'El <strong>derivativo</strong> mira el ritmo del error y frena antes de llegar: es la anticipación. Su riesgo es amplificar el ruido.',
    'La integral y la derivada del bloque de análisis son aquí, literalmente, la memoria y la anticipación de una máquina.',
    'El PID nació en 1922 copiando lo que hacían los timoneles expertos sin saber que lo hacían.'
  ]);

});
