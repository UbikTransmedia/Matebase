/* Tema: Control por error: proporcional, integral y derivativo */
Course.topic('cib-control', function (p) {

  p.puente('En [[cib-realimentacion|el primer tema del bloque]] corregíamos con una sola regla: <em>mira cuánto te has desviado ' +
    'y empuja en proporción</em>. Funciona, y para muchas cosas basta. Pero tiene dos defectos que ' +
    'aparecen en cuanto se prueba en el mundo real, y arreglarlos exige exactamente las dos ' +
    'herramientas que aprendiste en análisis: la [[fn-integral-def|integral]] como acumulación y la ' +
    '[[fn-derivadas|derivada]] como ritmo de cambio.');

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

  p.sub('Cómo se calcula esto de verdad');

  p.text('Hay una pregunta que conviene resolver antes de seguir, porque si no la fórmula y la ' +
    'práctica parecen dos cosas distintas. La fórmula del PID lleva una <em>integral</em> y una ' +
    '<em>derivada</em>, que son operaciones sobre funciones continuas. Pero un controlador real es ' +
    'un aparato que se despierta cada pocos milisegundos, toma <strong>una</strong> medida y decide. ' +
    'No tiene la función entera delante. <em>¿Cómo integra y deriva algo que solo conoce a trocitos?</em>');

  p.text('La respuesta es que no lo hace: lo <strong>aproxima</strong>, y con las dos aproximaciones ' +
    'más naturales que existen. Llamemos $\\Delta t$ al tiempo entre dos medidas —el <em>paso</em>— y ' +
    '$e_n$ al error medido en el paso $n$.');

  p.formulas([
    '\\int_0^{t} e\\,d\\tau \\ \\approx\\ \\sum_{k} e_k\\,\\Delta t',
    '\\frac{de}{dt} \\ \\approx\\ \\frac{e_n - e_{n-1}}{\\Delta t}'
  ], 'la integral y la derivada, tal como las calcula una máquina',
    'La primera dice: <em>«la integral del error se aproxima por la suma de todos los errores medidos, ' +
    'cada uno multiplicado por el paso»</em>. Es exactamente la definición de [[fn-integral-def|la integral definida]]: el área bajo ' +
    'la curva como suma de rectangulitos de anchura $\\Delta t$.<br><br>' +
    'La segunda: <em>«la derivada se aproxima por el error de ahora menos el anterior, partido por el ' +
    'paso»</em>. Es el cociente incremental, el mismo con el que se definió la derivada, pero sin ' +
    'llegar a hacer el límite: parándose en un $\\Delta t$ pequeño pero real.');

  p.note('Merece la pena apreciar lo que esto significa. Un controlador PID <strong>no sabe cálculo ' +
    'infinitesimal</strong>: solo suma y resta. Lo que ocurre es que sumar muchos trocitos se parece ' +
    'a integrar, y restar dos valores seguidos se parece a derivar, y con un paso lo bastante pequeño ' +
    'ese parecido es suficiente. Toda la computación científica funciona así: la máquina no calcula ' +
    'límites, calcula aproximaciones con pasos finitos.', 'ok', 'Por qué en el ejercicio se suma y se resta');

  p.text('En los ejercicios de este tema el paso vale $\\Delta t = 1$ para no arrastrar decimales, ' +
    'con lo que la integral se queda en «suma de los errores» y la derivada en «error de ahora menos ' +
    'el anterior». En un aparato real ese paso suele ser de milisegundos, y entonces sí hay que ' +
    'multiplicar y dividir por él.');

  p.sub('Solo proporcional: se queda corto');

  p.text('Con únicamente el término proporcional, la corrección es proporcional al error. El problema ' +
    'aparece cuando hay una carga constante que empuja en contra —la gravedad sobre un ascensor, el ' +
    'frío que entra por la ventana, el peso de un dron—. Para compensarla hace falta una corrección ' +
    'permanente, y una corrección permanente exige un error permanente, porque el término proporcional ' +
    'no da nada si el error es cero.');

  p.text('El resultado es que el sistema se queda <em>casi</em> en el objetivo, pero nunca del todo. ' +
    'Ese hueco se llama <strong>error en régimen permanente</strong>, y es la razón número uno por la ' +
    'que un control solo proporcional no basta.');

  p.comprueba('Un dron con control solo proporcional se queda un palmo por debajo de la altura pedida y ahí se queda quieto. ¿Por qué no sube el último palmo?', [
    { t: 'Porque el controlador tiene poca ganancia; con más $K_p$ subiría del todo', ok: false, por: 'Con más $K_p$ el hueco se hace más pequeño, pero nunca cero: para sostener el peso hace falta una acción permanente, y la acción proporcional es cero cuando el error es cero.' },
    { t: 'Porque sostener el peso exige una acción constante, y sin error no hay acción proporcional', ok: true, por: 'El dron encuentra el punto donde $K_p\\,e$ compensa justo su peso. Ese $e$ no puede ser cero. Solo el término integral, que acumula, puede dar acción con error nulo.' },
    { t: 'Porque el sensor de altura está mal calibrado', ok: false, por: 'Puede pasar, pero no es esto: el fenómeno aparece con un sensor perfecto. Es estructural del control proporcional frente a una carga constante.' }
  ]);

  p.ejemplo({
    title: 'Un paso de PID con números',
    enunciado: 'Referencia $r = 50$. Ahora se mide $y = 44$; en el paso anterior, $41$. El error acumulado hasta ahora es 10. Con $K_p = 2$, $K_i = 0{,}2$, $K_d = 1$ y $\\Delta t = 1$, calcular la acción $u$.',
    pasos: [
      { t: '<strong>Errores.</strong> Ahora: $e = 50 - 44 = 6$. Antes: $e_{\\text{ant}} = 50 - 41 = 9$. El error está bajando: de 9 a 6.', antes: 'Calcula el error de ahora y el del paso anterior. ¿Sube o baja?' },
      { t: '<strong>Proporcional.</strong> $K_p\\,e = 2\\cdot 6 = 12$. Cuanto más lejos, más empuja.' },
      { t: '<strong>Integral.</strong> Acumulado nuevo: $10 + 6\\cdot 1 = 16$. Término: $K_i\\cdot 16 = 3{,}2$. Es la memoria: lleva 16 unidades de error sin corregir.', antes: 'Suma el error de ahora al acumulado. ¿Cuánto aporta el término integral?' },
      { t: '<strong>Derivativo.</strong> Variación del error: $(6 - 9)/1 = -3$. Término: $K_d\\cdot(-3) = -3$. Negativo: el error ya está bajando deprisa, así que frena.', antes: 'El error pasa de 9 a 6. ¿Qué signo tiene la derivada y qué hace el término?' },
      { t: '<strong>Total.</strong> $u = 12 + 3{,}2 - 3 = 12{,}2$. El proporcional empuja, el integral añade lo que falta por lo acumulado, el derivativo resta porque ya va bien encaminado.' }
    ],
    cierre: 'Tres preguntas sobre la misma señal: cuánto, cuánto llevo, hacia dónde va. Y ninguna operación más difícil que sumar y restar: la integral es una suma y la derivada, una resta.'
  });

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
    predice: 'Con $K_p = 0{,}8$ y carga 2,2, ¿cuánto error quedará en régimen permanente? Calcula $\\text{carga}/K_p$. Y al subir $K_p$ a 4, ¿desaparecerá el hueco o solo se reducirá?',
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

  p.sub('Saturación y windup');

  p.text('Hay un detalle que la fórmula del PID no dice: los actuadores tienen tope. Un motor no da más ' +
    'fuerza que la que da, una válvula no se abre más del cien por cien y un radiador no calienta más que ' +
    'a plena potencia. Cuando el controlador pide más de lo que el actuador puede dar, el actuador se ' +
    '<strong>satura</strong>: entrega su máximo y el resto de la orden se pierde.');

  p.text('La saturación en sí no es grave. Lo grave es lo que le hace al término integral. Mientras el ' +
    'actuador está al máximo y el error no baja, la integral sigue acumulando error como si sirviera de ' +
    'algo. Cuando por fin el sistema responde, la integral está tan cargada que mantiene el actuador al ' +
    'máximo mucho después de llegar al objetivo, y el sistema se pasa de largo. Eso es el ' +
    '<strong>windup</strong>: la integral se «da cuerda» sola. El remedio más sencillo, el ' +
    '<strong>antiwindup</strong>, consiste en dejar de integrar mientras el actuador está saturado y el ' +
    'error empuja en la misma dirección.');

  p.demo({
    title: 'La integral que no se calla',
    intro: 'El sistema está bloqueado al principio —una válvula atascada, una puerta que no abre— y no puede moverse aunque el controlador empuje con todo. Alarga el bloqueo y compara las dos curvas: sin antiwindup, la integral acumula todo ese error y el sistema se pasa muchísimo al soltarse; con antiwindup, llega casi limpio.',
    predice: 'Si el bloqueo dura el doble, ¿el sobrepaso sin antiwindup será el doble, más del doble o igual? Piensa en cuánto error acumula la integral mientras tanto.',
    build: function (host) {
      var tb = 6, Kp = 3, Ki = 0.8, umax = 20, ref = 8, dt = 0.02, T = 40;
      var out = W.readout(host, '');

      function simula(anti) {
        var y = 0, I = 0, s = [[0, 0]], max = 0;
        for (var i = 1; i * dt <= T + 1e-9; i++) {
          var t = i * dt, e = ref - y;
          var bruto = Kp * e + Ki * I;
          // antiwindup: no se integra si el actuador ya esta al tope y el error empuja hacia ese tope
          var parado = anti && ((bruto >= umax && e > 0) || (bruto <= 0 && e < 0));
          if (!parado) I += e * dt;
          var u = Math.max(0, Math.min(umax, Kp * e + Ki * I));
          if (t >= tb) y += (u - y) / 1.5 * dt;          // mientras dura el bloqueo, no se mueve
          if (y > max) max = y;
          if (i % 10 === 0) s.push([t, y]);
        }
        return { s: s, max: max };
      }

      var plot = W.plot(host, {
        xmin: 0, xmax: T, ymin: -1, ymax: 22, height: 290, xlabel: 'segundos', ylabel: 'posición',
        draw: function (g) {
          if (tb > 0) g.rect(0, -1, tb, 23, { fill: true, color: 'axis', fillAlpha: 0.12, stroke: false });
          g.hline(ref, { color: 3, dash: true, w: 1.6 });
          g.path(simula(false).s, { color: 'bad', w: 2.4 });
          g.path(simula(true).s, { color: 0, w: 2.8 });
        }
      });

      function pinta() {
        var sin = simula(false), con = simula(true);
        out.set('Bloqueado durante $' + U.fmt(tb, 1) + '$ s &nbsp;·&nbsp; sin antiwindup llega hasta <strong>' + U.fmt(sin.max, 2) +
          '</strong> (se pasa $' + U.fmt(Math.max(0, sin.max - ref), 2) + '$) &nbsp;·&nbsp; con antiwindup, hasta <strong>' + U.fmt(con.max, 2) +
          '</strong> (se pasa $' + U.fmt(Math.max(0, con.max - ref), 2) + '$)');
        plot.render();
      }

      var fila = W.row(host);
      W.slider(fila, { label: 'duración del bloqueo (s)', min: 0, max: 15, step: 0.5, value: tb, on: function (v) { tb = v; pinta(); } });
      W.slider(fila, { label: 'Ki (integral)', min: 0.2, max: 1.5, step: 0.05, value: Ki, on: function (v) { Ki = v; pinta(); } });
      W.legend(host, [{ c: U.palette().bad, t: 'sin antiwindup' }, { c: 0, t: 'con antiwindup' }]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Sintonizar sin conocer el sistema: Ziegler-Nichols');

  p.text('Para ajustar $K_p$, $K_i$ y $K_d$ con cuentas hace falta un modelo matemático del sistema, y ' +
    'muchas veces no se tiene: una fábrica tiene cientos de lazos de control, cada uno con su horno, su ' +
    'tubería y su motor. En 1942, John Ziegler y Nathaniel Nichols, dos ingenieros de una empresa de ' +
    'instrumentos de medida, publicaron una receta que no necesita ningún modelo, solo un experimento con ' +
    'el sistema real:');

  p.list([
    'Se quitan los términos integral y derivativo y se deja solo el proporcional.',
    'Se sube $K_p$ poco a poco hasta que el sistema oscila de forma sostenida, sin crecer ni apagarse. Ese valor es la <strong>ganancia última</strong> $K_u$.',
    'Se mide el periodo de esa oscilación: el <strong>periodo último</strong> $T_u$.',
    'Con esos dos números se leen los ajustes en la tabla.'
  ], true);

  p.table(['Controlador', '$K_p$', '$T_i$', '$T_d$'], [
    ['P', '$0{,}5\\,K_u$', '—', '—'],
    ['PI', '$0{,}45\\,K_u$', '$T_u / 1{,}2$', '—'],
    ['PID', '$0{,}6\\,K_u$', '$T_u / 2$', '$T_u / 8$']
  ]);

  p.formula('K_i = \\frac{K_p}{T_i}, \\qquad K_d = K_p\\,T_d', 'de los tiempos a las ganancias',
    'La tabla da el <strong>tiempo integral</strong> $T_i$ y el <strong>tiempo derivativo</strong> $T_d$, ' +
    'que es como prefieren pensar los ingenieros: $T_i$ es lo que tarda la integral en igualar al término ' +
    'proporcional si el error se mantiene constante, y $T_d$ es cuánto tiempo se adelanta el derivativo.<br><br>' +
    'Para pasar a las ganancias de la fórmula del PID, $K_i$ <strong>divide</strong> y $K_d$ <strong>multiplica</strong>.');

  p.note('Ziegler-Nichols da un punto de partida agresivo, con bastante sobrepaso, no un ajuste final. Y ' +
    'el experimento de llevar el sistema al borde de la inestabilidad no se puede hacer con cualquier ' +
    'cosa: con un reactor químico o con un avión no se prueba. Para esos casos se sintoniza sobre un ' +
    'modelo, en simulación.', 'warn', 'Un punto de partida, no el final');

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

  p.trampas([
    { e: 'Subir $K_p$ para eliminar el error permanente', por: 'Lo reduce a $\\text{carga}/K_p$, pero nunca lo anula, y una $K_p$ muy alta oscila. El hueco lo cierra el término integral.' },
    { e: 'Derivar la medida en vez del error', por: 'El término derivativo usa $e_n - e_{n-1}$. Con referencia constante coincide con $-(y_n - y_{n-1})$, pero el signo cambia: hay que fijarse.' },
    { e: 'Dejar integrar mientras el actuador está saturado', por: 'La integral se carga con error que no puede corregir y luego provoca un sobrepaso enorme. Es el windup, y todo PID serio lleva un tope.' },
    { e: 'Tomar Ziegler-Nichols como ajuste final', por: 'Da un punto de partida agresivo, con sobrepaso. Y el experimento de llevar el sistema al borde de la oscilación no se puede hacer con un reactor o un avión.' }
  ]);

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
      return 'Observa el síntoma y di qué término del PID hay que reforzar:<br><br><em>«' + d.texto + '»</em>';
    },
    fields: [{ name: 'q', label: 'reforzar el término', opts: [{ t: 'proporcional', v: 'proporcional' }, { t: 'integral', v: 'integral' }, { t: 'derivativo', v: 'derivativo' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () {
      return 'Fíjate en QUÉ falla, no en cuánto. ¿Se queda un hueco que nadie cierra? ¿Llega pero ' +
        'pasándose y volviendo? ¿O simplemente reacciona con desgana? Cada síntoma señala a un ' +
        'término distinto, y ya has visto cuál arregla cada cosa.';
    },
    steps: function (d) {
      return [d.por, 'El término que hay que reforzar es el <strong>' + d.q + '</strong>.'];
    },
    answer: function (d) { return d.q; }
  });

  p.exercise({
    title: 'El error que deja un control proporcional',
    level: 'medio',
    gen: function (r) {
      var carga = r.int(1, 6), Kp = r.pick([0.5, 2, 4, 5, 8]), emax = r.pick([0.1, 0.2, 0.25, 0.5]);
      if (carga / Kp <= emax) return null;
      return { carga: carga, Kp: Kp, emax: emax, e: carga / Kp, kmin: carga / emax };
    },
    ask: function (d) {
      return 'Una carga constante de valor $' + d.carga + '$ tira en contra de un sistema controlado solo con el término ' +
        'proporcional. En régimen permanente el sistema está quieto, así que la acción del controlador compensa ' +
        'exactamente la carga: $K_p\\,e = ' + d.carga + '$.<br><br>¿Qué error queda con $K_p = ' + U.fmt(d.Kp, 1) + '$? ' +
        '¿Qué $K_p$ haría falta, como mínimo, para que el error no pasara de $' + U.fmt(d.emax, 2) + '$?';
    },
    fields: [{ name: 'e', label: 'error permanente', w: 'tiny' }, { name: 'k', label: '$K_p$ mínimo', w: 'tiny' }],
    sol: function (d) { return { e: d.e, k: d.kmin }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.e - d.carga * d.Kp) < 1e-6; }, msg: 'El error no crece con la ganancia, baja: de $K_p\\,e = \\text{carga}$ se despeja $e = \\dfrac{\\text{carga}}{K_p}$.' }],
    hint: function () { return ['Despeja $e$ en $K_p\\,e = \\text{carga}$.', 'Para la segunda pregunta, despeja $K_p$ poniendo como $e$ el error máximo permitido.']; },
    steps: function (d) {
      return ['$e = \\dfrac{' + d.carga + '}{' + U.fmt(d.Kp, 1) + '} = ' + U.fmt(d.e, 3) + '$',
        '$K_p \\ge \\dfrac{' + d.carga + '}{' + U.fmt(d.emax, 2) + '} = ' + U.fmt(d.kmin, 2) + '$',
        'Subir $K_p$ reduce el error permanente pero nunca lo anula, y una ganancia muy alta acaba provocando oscilaciones. Por eso se añade el término integral.'];
    },
    answer: function (d) { return 'e = ' + U.fmt(d.e, 3) + ', Kp ≥ ' + U.fmt(d.kmin, 2); }
  });

  p.exercise({
    title: 'Sintonía de Ziegler-Nichols',
    level: 'medio',
    gen: function (r) {
      var Ku = r.pick([2, 4, 5, 8, 10]), Tu = r.pick([1, 2, 4, 8]);
      return { Ku: Ku, Tu: Tu, Kp: 0.6 * Ku, Ti: Tu / 2, Td: Tu / 8, Ki: 1.2 * Ku / Tu, Kd: 0.075 * Ku * Tu };
    },
    ask: function (d) {
      return 'Al subir la ganancia proporcional del control de un horno, el horno empieza a oscilar de forma sostenida con ' +
        '$K_u = ' + d.Ku + '$, y la oscilación tiene un periodo $T_u = ' + d.Tu + '$ minutos. Con la tabla de ' +
        'Ziegler-Nichols para un PID, calcula $K_p$, $K_i$ y $K_d$.';
    },
    fields: [{ name: 'kp', label: '$K_p$', w: 'tiny' }, { name: 'ki', label: '$K_i$', w: 'tiny' }, { name: 'kd', label: '$K_d$', w: 'tiny' }],
    sol: function (d) { return { kp: d.Kp, ki: d.Ki, kd: d.Kd }; },
    tol: 1e-6,
    errores: [
      { si: function (v, d) { return d.Tu !== 2 && Math.abs(v.ki - d.Kp * d.Ti) < 1e-6; }, msg: 'Para pasar del tiempo integral a la ganancia se <strong>divide</strong>: $K_i = K_p / T_i$.' },
      { si: function (v, d) { return d.Tu !== 8 && Math.abs(v.kd - d.Kp / d.Td) < 1e-6; }, msg: 'Para el derivativo se <strong>multiplica</strong>: $K_d = K_p\\,T_d$.' }
    ],
    hint: function () { return ['Fila del PID: $K_p = 0{,}6\\,K_u$, $T_i = T_u/2$, $T_d = T_u/8$.', 'Después: $K_i = K_p/T_i$ y $K_d = K_p\\,T_d$.']; },
    steps: function (d) {
      return ['$K_p = 0{,}6\\cdot ' + d.Ku + ' = ' + U.fmt(d.Kp, 2) + '$',
        '$T_i = \\dfrac{' + d.Tu + '}{2} = ' + U.fmt(d.Ti, 2) + '$, así que $K_i = \\dfrac{' + U.fmt(d.Kp, 2) + '}{' + U.fmt(d.Ti, 2) + '} = ' + U.fmt(d.Ki, 4) + '$',
        '$T_d = \\dfrac{' + d.Tu + '}{8} = ' + U.fmt(d.Td, 3) + '$, así que $K_d = ' + U.fmt(d.Kp, 2) + '\\cdot ' + U.fmt(d.Td, 3) + ' = ' + U.fmt(d.Kd, 4) + '$'];
    },
    answer: function (d) { return 'Kp = ' + U.fmt(d.Kp, 2) + ', Ki = ' + U.fmt(d.Ki, 4) + ', Kd = ' + U.fmt(d.Kd, 4); }
  });

  p.keys([
    'Con solo el término proporcional, el error permanente frente a una carga es $\\frac{\\text{carga}}{K_p}$: baja al subir $K_p$, pero no desaparece.',
    'Los actuadores saturan. Sin antiwindup, la integral sigue acumulando mientras tanto y provoca sobrepasos enormes.',
    'Ziegler-Nichols sintoniza sin modelo: con $K_u$ y $T_u$, un PID lleva $K_p = 0{,}6K_u$, $T_i = T_u/2$ y $T_d = T_u/8$.',
    'Todo controlador trabaja sobre la <strong>señal de error</strong> $e = r - y$: la diferencia entre lo que quieres y lo que hay.',
    'El término <strong>proporcional</strong> responde al error de ahora; su defecto es dejar un error permanente cuando hay carga.',
    'El <strong>integral</strong> acumula el error y cierra ese hueco: es la memoria del controlador. Su riesgo es el <em>windup</em>.',
    'El <strong>derivativo</strong> mira el ritmo del error y frena antes de llegar: es la anticipación. Su riesgo es amplificar el ruido.',
    'La integral y la derivada del bloque de análisis son aquí, literalmente, la memoria y la anticipación de una máquina.',
    'El PID nació en 1922 copiando lo que hacían los timoneles expertos sin saber que lo hacían.'
  ]);

});
