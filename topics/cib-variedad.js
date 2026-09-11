/* Tema: Variedad y la ley de la variedad requerida */
Course.topic('cib-variedad', function (p) {

  p.puente('El tema anterior contaba estados: cuántos tiene una caja y cuántas observaciones hacen falta. ' +
    'Este cuenta estados de dos cosas a la vez, el mundo y quien lo regula, y compara. Solo hace falta ' +
    'contar y, para medir en bits, el logaritmo en base 2 que ya apareció en ' +
    '[[av-informacion|teoría de la información]].');

  p.text('Este tema contiene, en mi opinión, el resultado más útil de toda la cibernética, y tiene la ' +
    'virtud de las cosas grandes: se enuncia en una frase, se demuestra casi contando con los dedos y ' +
    'una vez entendido no se puede dejar de ver. Ashby lo llamó la <strong>ley de la variedad ' +
    'requerida</strong>, y suele citarse así:');

  p.note('<strong>Solo la variedad puede absorber variedad.</strong><br>' +
    '<span style="font-size:0.8125rem;color:var(--ink-faint)">Ashby, <em>An Introduction to Cybernetics</em>, 1956</span>',
    'ok', 'La ley, en siete palabras');

  p.text('Dicho sin misterio: <strong>un regulador que tiene menos jugadas que el entorno pierde ' +
    'siempre</strong>. No por torpeza, ni por falta de esfuerzo, ni por mala suerte. Por aritmética. Y ' +
    'como tantas veces, lo que parece una obviedad al enunciarlo resulta que se incumple a diario en ' +
    'sitios donde hay mucho dinero en juego.');

  /* ---------------------------------------------------------------- */
  p.section('Medir la variedad');

  p.text('Antes de la ley hace falta la medida. La <strong>variedad</strong> de algo es, sencillamente, ' +
    '<em>el número de estados distintos que puede presentar</em>. Un interruptor tiene variedad 2. Un ' +
    'semáforo, 3. Un dado, 6. Una letra del alfabeto, 27. Nada más.');

  p.text('Ashby insistía en un matiz que parece pedante y no lo es: la variedad <strong>no es una ' +
    'propiedad del objeto, sino del observador</strong>. Un coche tiene variedad 2 para quien solo ' +
    'distingue si arranca o no; variedad 12 para el que distingue el color; variedad enorme para el ' +
    'mecánico. Antes de contar hay que decir qué se está mirando.');

  p.text('A menudo conviene medir la variedad en <strong>bits</strong>, tomando su logaritmo en base ' +
    'dos. La razón es cómoda: así las variedades se suman en vez de multiplicarse, y además queda ' +
    'claro cuántas preguntas de sí o no hacen falta para identificar un estado.');

  p.formulas([
    'V = \\text{número de estados distintos}',
    'V_{\\text{bits}} = \\log_2 V'
  ], 'las dos maneras de medir la variedad',
    'Se leen: <em>«uve es el número de estados distintos»</em> y <em>«uve en bits es el logaritmo en ' +
    'base dos de uve»</em>.<br><br>Con un ejemplo: un dado tiene variedad 6, y en bits ' +
    '$\\log_2 6 \\approx 2{,}58$. Eso significa que con tres preguntas de sí o no bien elegidas se ' +
    'puede averiguar siempre el resultado, y con dos no siempre.<br><br>Y aquí conviene detenerse: ' +
    'esa fórmula ya la has visto. Es la [[av-informacion|<strong>entropía</strong>]] de la teoría de la información cuando todos los ' +
    'casos son igual de probables. Variedad y entropía son la misma medida con dos nombres, uno de ' +
    'Ashby y otro de Shannon.');

  p.note('Que la variedad de Ashby y la entropía de Shannon coincidan no es una casualidad ni una ' +
    'analogía floja: los dos estaban midiendo lo mismo desde problemas distintos. Shannon preguntaba ' +
    'cuánta información hace falta para transmitir un mensaje; Ashby, cuántas jugadas hacen falta para ' +
    'controlar una situación. La respuesta resultó ser el mismo logaritmo, y ese descubrimiento es una ' +
    'de las razones de que la cibernética y la teoría de la información nacieran de la mano.',
    null, 'La misma medida, dos veces');

  p.util('Contar variedad es lo primero que hace cualquiera que diseñe un sistema de control. Un mando ' +
    'a distancia necesita al menos tantos botones como funciones distintas quieras poder pedir; un ' +
    'menú con cuatro opciones no puede gobernar un aparato con veinte comportamientos sin recurrir a ' +
    'submenús, que son variedad conseguida encadenando pulsaciones. Cuando un panel de control ' +
    'resulta insuficiente, casi siempre es que alguien contó mal la variedad del problema.');

  /* ---------------------------------------------------------------- */
  p.section('La ley de Ashby');

  p.text('Ahora el montaje. Hay un <strong>entorno</strong> que juega perturbaciones —llamémoslo $D$, ' +
    'de <em>disturbance</em>— y un <strong>regulador</strong> $R$ que responde a cada una con una ' +
    'jugada. De la combinación de ambas sale un <strong>resultado</strong>, y el regulador quiere que ' +
    'el resultado sea siempre el bueno.');

  p.text('Ashby lo dispuso como una tabla: las columnas son las perturbaciones, las filas son las ' +
    'jugadas del regulador, y cada casilla dice qué pasa. El regulador ve la perturbación y elige ' +
    'fila. La pregunta es: <em>¿cuándo puede garantizar que siempre acaba en la casilla buena?</em>');

  p.text('La respuesta salta a la vista en cuanto se piensa en las columnas. Cada perturbación ' +
    'necesita <strong>al menos una fila que la neutralice</strong>. Si hay más columnas que filas, ' +
    'por fuerza alguna columna se queda sin fila propia, y ahí el regulador no puede hacer nada. De ' +
    'ahí la ley:');

  p.formula('V_R \\ \\ge\\ V_D \\quad\\text{para poder regular del todo}',
    'la variedad requerida',
    'Se lee: <em>«uve sub erre mayor o igual que uve sub de»</em>, es decir, ' +
    '<em>«la variedad del regulador tiene que ser al menos la variedad de las perturbaciones»</em>.' +
    '<br><br>En la versión que se cita más, con logaritmos y en términos de lo que queda sin ' +
    'controlar: <strong>la variedad del resultado no puede bajar de $V_D - V_R$</strong>. Es decir, ' +
    'lo que el regulador no tiene en jugadas se lo queda el mundo en desorden.');

  p.comprueba('Un servicio de atención recibe 12 tipos de incidencia distintos y el operador solo puede dar 4 respuestas. Se le envía a un curso para que sea más rápido y amable. ¿Mejorará el porcentaje de incidencias resueltas?', [
    { t: 'Sí: con más habilidad resolverá más', ok: false, por: 'La habilidad no añade respuestas. Con 4 respuestas para 12 tipos, en el caso exigente el techo es $4/12 = 33\\,\\%$, sea quien sea el operador.' },
    { t: 'No: el techo lo fija la variedad, $4/12$, y el curso no la cambia', ok: true, por: 'Solo hay dos salidas: darle más respuestas (amplificar $V_R$) o reducir los tipos de incidencia que le llegan (atenuar $V_D$). El curso no hace ninguna de las dos.' },
    { t: 'Depende de cuánto se esfuerce', ok: false, por: 'El esfuerzo tampoco añade jugadas. Es la parte más incómoda de la ley: el fallo es aritmético, no de actitud.' }
  ]);

  p.ejemplo({
    title: 'Un mando a distancia con pocos botones',
    enunciado: 'Un aparato tiene 10 funciones distintas y el mando solo tiene 3 botones. ¿Se puede gobernar? ¿Cuántos bits de variedad tiene el problema y cuántas pulsaciones hacen falta?',
    pasos: [
      { t: '<strong>Variedades.</strong> $V_D = 10$ funciones a pedir. Con una pulsación, $V_R = 3$. Como $3 < 10$, una pulsación no basta: hay 7 funciones que ningún botón puede pedir.', antes: 'Compara $V_R$ con $V_D$. ¿Cumple la ley?' },
      { t: '<strong>Encadenar.</strong> Con dos pulsaciones hay $3\\cdot 3 = 9$ secuencias distintas. Todavía falta una. Con tres pulsaciones, $27 \\ge 10$: sobra.', antes: 'Las variedades de piezas independientes se multiplican. ¿Cuántas secuencias de dos pulsaciones hay?' },
      { t: '<strong>En bits.</strong> $\\log_2 10 \\approx 3{,}32$ bits de variedad en el problema. Cada botón aporta $\\log_2 3 \\approx 1{,}58$ bits por pulsación. Hacen falta $3{,}32 / 1{,}58 \\approx 2{,}1$ pulsaciones: es decir, 3, porque 2 no llegan.', antes: 'En bits, ¿cuánto aporta cada pulsación y cuántas hacen falta para cubrir 3,32?' },
      { t: '<strong>La otra salida.</strong> Si en vez de amplificar (más pulsaciones) se atenúa, el fabricante quita funciones: con 9 funciones bastan dos pulsaciones; con 3, una. Los submenús son amplificación; el «modo simple», atenuación.' }
    ],
    cierre: 'La ley no dice cómo conseguir la variedad, solo cuánta hace falta. Encadenar pulsaciones, añadir botones o quitar funciones son tres maneras de cerrar la misma cuenta.'
  });

  p.demo({
    title: 'El juego de la regulación',
    intro: 'El entorno tiene cuatro perturbaciones y tú tienes un regulador. Elige cuántas jugadas le permites y ponte a jugar: en cada ronda ves la perturbación, eliges tu respuesta y sale un resultado. Tu objetivo es que salga siempre «a». Con menos jugadas que perturbaciones, prueba todo lo que quieras: no hay manera.',
    predice: 'Con 3 jugadas, ¿cuál será tu techo de aciertos: el 75 %, el 100 % o algo intermedio según lo bien que juegues?',
    build: function (host, d) {
      var TABLA = [               // filas = jugadas del regulador, columnas = perturbaciones
        ['a', 'b', 'c', 'd'],
        ['b', 'a', 'd', 'c'],
        ['c', 'd', 'a', 'b'],
        ['d', 'c', 'b', 'a']
      ];
      var nR = 2;                 // jugadas permitidas al regulador
      var pert = 0, rondas = 0, aciertos = 0, ultimo = null;
      var rng = U.rng(20250101);

      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.9, xmax: 4.6, ymin: -4.7, ymax: 1.1, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          for (var c = 0; c < 4; c++) {
            g.text(c + 0.5, 0.45, 'D' + (c + 1), {
              align: 'center', size: 13,
              color: c === pert ? 2 : 'ink-faint', bold: c === pert
            });
          }
          for (var f = 0; f < nR; f++) {
            g.text(-0.45, -f - 0.62, 'R' + (f + 1), { align: 'center', size: 13, color: 'ink-faint' });
            for (var c2 = 0; c2 < 4; c2++) {
              var buena = TABLA[f][c2] === 'a';
              var elegida = ultimo && ultimo.f === f && ultimo.c === c2;
              g.rect(c2 + 0.06, -f - 0.94, 0.88, 0.88, {
                color: elegida ? 2 : (buena ? 'ok' : 'line'),
                w: elegida ? 3 : 1.4,
                fill: elegida ? 2 : (buena ? 'ok' : null),
                fillAlpha: elegida ? .3 : (buena ? .14 : 0)
              });
              g.text(c2 + 0.5, -f - 0.58, TABLA[f][c2], {
                align: 'center', size: 16,
                color: buena ? 'ok' : 'ink', bold: buena
              });
            }
          }
        }
      });

      function paint() {
        var cubiertas = 0;
        for (var c = 0; c < 4; c++) {
          for (var f = 0; f < nR; f++) if (TABLA[f][c] === 'a') { cubiertas++; break; }
        }
        var techo = cubiertas / 4;
        var txt = 'Perturbación en juego: <strong>D' + (pert + 1) + '</strong>' +
          (ultimo ? ' &nbsp;·&nbsp; jugaste R' + (ultimo.f + 1) + ' y salió <strong>' +
            TABLA[ultimo.f][ultimo.c] + '</strong>' +
            (TABLA[ultimo.f][ultimo.c] === 'a'
              ? ' <span style="color:var(--ok)">✓</span>'
              : ' <span style="color:var(--bad)">✗</span>') : '');
        txt += '<br>Rondas jugadas: ' + rondas + ' &nbsp;·&nbsp; acertadas: ' + aciertos +
          (rondas ? ' (' + U.fmt(100 * aciertos / rondas, 0) + '%)' : '');
        txt += '<br><br>Variedad del entorno: $V_D = 4$ &nbsp;·&nbsp; variedad del regulador: $V_R = ' + nR + '$.<br>';
        txt += nR >= 4
          ? '<strong style="color:var(--ok)">Con cuatro jugadas cubres las cuatro perturbaciones: puedes acertar el 100 % de las veces, siempre.</strong>'
          : '<strong style="color:var(--bad)">Solo ' + cubiertas + ' de las 4 perturbaciones tienen respuesta.</strong> ' +
            'Hagas lo que hagas, tu techo es el ' + U.fmt(techo * 100, 0) + ' %. No es cuestión de jugar mejor.';
        out.set(txt);
        plot.render();
      }

      var fila = W.row(host);
      W.slider(fila, {
        label: 'jugadas del regulador', min: 1, max: 4, step: 1, value: nR, dec: 0,
        on: function (v) { nR = v; rondas = 0; aciertos = 0; ultimo = null; paint(); }
      });

      var acciones = [];
      for (var i = 0; i < 4; i++) {
        (function (f) {
          acciones.push({ t: 'Jugar R' + (f + 1), cls: 'btn--main', on: function () {
            if (f >= nR) return;
            ultimo = { f: f, c: pert };
            rondas++;
            if (TABLA[f][pert] === 'a') aciertos++;
            pert = rng.int(0, 3);
            paint();
          } });
        })(i);
      }
      acciones.push({ t: 'Reiniciar cuenta', cls: 'btn--ghost', on: function () {
        rondas = 0; aciertos = 0; ultimo = null; paint();
      } });
      W.buttons(W.row(host), acciones);
      W.hint(host, 'Empieza con 2 jugadas e intenta llegar al 100 %. Cuando te convenzas de que es imposible, sube el mando a 4.');
      paint();
    }
  });

  p.text('Lo que el juego enseña, y cuesta aceptar, es que <strong>el fallo no está en la habilidad ' +
    'sino en el repertorio</strong>. Un regulador con dos jugadas frente a cuatro perturbaciones ' +
    'tiene un techo del 50 %, y ninguna astucia, ningún entrenamiento y ningún esfuerzo lo suben. ' +
    'La única salida es conseguir más jugadas.');

  p.util('Aquí está la razón de que los organigramas fallen. Si un sistema tiene que responder a mil ' +
    'situaciones distintas y quien decide solo dispone de diez respuestas, el sistema será ' +
    'ingobernable por mucho talento que tenga esa persona; la solución no es un jefe mejor sino ' +
    'repartir la decisión, que es exactamente añadir variedad al regulador. Lo mismo explica por qué ' +
    'una atención al cliente con un guion cerrado enfurece a la gente: el guion tiene menos variedad ' +
    'que los problemas que le llegan, y el porcentaje de casos que no encajan está fijado de antemano.');

  p.util('Y la versión inversa también se usa a propósito: si no puedes subir tu variedad, ' +
    '<strong>baja la del entorno</strong>. Es lo que hace un formulario con opciones cerradas, un ' +
    'aeropuerto que canaliza a la gente por pasillos estrechos o un fabricante que reduce su catálogo ' +
    'a tres modelos. Reducir la variedad del problema es tan válido como aumentar la del regulador, y ' +
    'suele ser más barato. Ashby llamaba a esto <em>atenuar</em> la variedad.');

  p.hist('Stafford Beer llevó esta ley a su extremo práctico. En 1971 el gobierno de Salvador Allende ' +
    'lo llamó para diseñar un sistema de gestión de la economía chilena, y Beer construyó ' +
    '<em>Cybersyn</em>: una red de télex —no había internet— que recogía a diario datos de las ' +
    'fábricas del país y los llevaba a una sala de operaciones con sillones y pantallas, diseñada para ' +
    'que un puñado de personas pudiera regular un sistema enormemente más variado que ellas. Toda la ' +
    'arquitectura estaba pensada en términos de variedad: qué se atenúa, qué se amplifica y en qué ' +
    'nivel se decide cada cosa. El proyecto murió con el golpe de Estado de 1973, y hoy se estudia ' +
    'como el intento más ambicioso de aplicar cibernética a un país entero.');

  /* ---------------------------------------------------------------- */
  p.sub('¿Y no podría una jugada valer para dos perturbaciones?');

  p.text('Es la objeción correcta, y conviene responderla con precisión porque la respuesta afina la ' +
    'ley. Sí, podría. Nada impide que una misma fila dé la casilla buena en dos columnas distintas: ' +
    'basta con mirar la tabla y comprobarlo. Si eso ocurre, ese regulador se apaña con menos jugadas ' +
    'de las que había supuesto.');

  p.text('Lo que pasa es que <strong>eso depende de la tabla, y la tabla no la elige el ' +
    'regulador</strong>. La tabla dice cómo responde el mundo a cada combinación, y ahí hay dos ' +
    'situaciones muy distintas:');

  p.list([
    'Si el mundo es <em>benévolo</em> —una misma respuesta sirve para varias situaciones— entonces ' +
      'hace falta menos variedad. Es el caso de un paraguas: vale igual para lluvia fina que para ' +
      'chaparrón.',
    'Si el mundo es <em>exigente</em> —cada situación anula lo que servía para la anterior— entonces ' +
      'cada perturbación necesita su propia respuesta, y la variedad requerida es la máxima posible. ' +
      'Es el caso de una llave: una por cerradura.'
  ]);

  p.text('La forma <strong>fuerte</strong> de la ley, la que se cita, se refiere al segundo caso: es ' +
    'una <em>cota</em>, la peor situación posible, y por tanto la que hay que suponer cuando no se ' +
    'conoce la tabla. En la tabla del juego de arriba, por ejemplo, cada fila da la casilla buena ' +
    'exactamente una vez, y por eso hacen falta las cuatro jugadas.');

  p.note('Que sea una cota y no una igualdad no le quita fuerza, le da otra distinta. Como cota, ' +
    'permite afirmar cosas <strong>sin conocer los detalles</strong>: sin saber nada de tu problema, ' +
    'si me dices que el entorno tiene mil situaciones y tu regulador diez respuestas, puedo asegurarte ' +
    'que hay casos que no vas a poder atender. Eso es exactamente lo que se le pide a un resultado ' +
    'general.', null, 'Por qué una cota vale tanto como una igualdad');

  /* ---------------------------------------------------------------- */
  p.section('El teorema del buen regulador');

  p.text('Hay un corolario de esta línea de pensamiento que es más profundo todavía y que Ashby ' +
    'publicó en 1970 junto a Roger Conant, con un título que lo dice todo: <em>Todo buen regulador de ' +
    'un sistema tiene que ser un modelo de ese sistema</em>.');

  p.text('La idea, sin la demostración: para que un regulador acierte con la jugada correcta ante cada ' +
    'perturbación, tiene que estar <strong>haciendo distinciones equivalentes a las del sistema que ' +
    'regula</strong>. Su repertorio de respuestas se corresponde con el repertorio de situaciones, y ' +
    'esa correspondencia es, ni más ni menos, lo que llamamos tener un modelo.');

  p.text('La consecuencia es fuerte y algo vertiginosa: <em>todo el que regula bien algo lleva dentro, ' +
    'lo sepa o no, una representación de lo que regula</em>. Un termostato contiene un modelo ' +
    'minúsculo de la habitación. Un cuerpo que mantiene su temperatura contiene un modelo de lo que le ' +
    'puede pasar. Y si un cerebro regula la conducta de un organismo en su entorno, entonces ese ' +
    'cerebro contiene necesariamente un modelo del entorno — que es una manera de llegar, desde la ' +
    'ingeniería, a una afirmación que parecía de filosofía.');

  p.note('Este teorema es la puerta al último tema del bloque. Si regular exige modelar, y el que ' +
    'modela forma parte del mundo que modela, aparece un bucle nuevo: el observador dentro del ' +
    'sistema observado. Eso es la cibernética de segundo orden.', null, 'Hacia dónde lleva esto');

  p.trampas([
    { e: 'Culpar a la habilidad de lo que es falta de repertorio', por: 'Con 2 jugadas frente a 4 perturbaciones el techo es el 50 %. No lo sube el mejor jugador del mundo; lo sube una tercera jugada.' },
    { e: 'Contar la variedad sin decir qué se distingue', por: 'Un coche tiene variedad 2, 12 o millones según quién mire. La variedad es del observador; antes de contar hay que fijar qué estados se consideran distintos.' },
    { e: 'Sumar variedades de piezas independientes', por: 'Se multiplican: dos interruptores dan $2\\cdot 2 = 4$ estados, no 4 sumando. En bits sí se suman, porque el logaritmo convierte el producto en suma.' },
    { e: 'Leer la ley como una igualdad', por: 'Es una cota: en el caso exigente hace falta $V_R \\ge V_D$. En un mundo benévolo, donde una jugada sirve para varias perturbaciones, se necesita menos.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Contar variedad',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'un interruptor de la luz', v: 2 },
        { t: 'un semáforo de tres luces', v: 3 },
        { t: 'la tirada de un dado', v: 6 },
        { t: 'una moneda lanzada tres veces seguidas', v: 8 },
        { t: 'los días de la semana', v: 7 },
        { t: 'dos interruptores independientes', v: 4 },
        { t: 'una cifra decimal', v: 10 },
        { t: 'un byte de 8 bits', v: 256 },
        { t: 'las horas de un reloj analógico', v: 12 },
        { t: 'tres interruptores independientes', v: 8 }
      ];
      var c = r.pick(casos);
      return { texto: c.t, v: c.v };
    },
    ask: function (d) {
      return '¿Cuál es la variedad de <strong>' + d.texto + '</strong>, es decir, cuántos estados ' +
        'distintos puede presentar?<br><br>Da también su medida en bits, $\\log_2 V$, con dos decimales.';
    },
    fields: [
      { name: 'v', label: 'V =', w: 'tiny' },
      { name: 'b', label: 'en bits =', w: 'tiny' }
    ],
    sol: function (d) { return { v: d.v, b: Math.log(d.v) / Math.LN2 }; },
    tol: 0.01,
    hint: function () { return 'Si hay varias piezas independientes, sus variedades se multiplican: dos interruptores dan 2·2 = 4 combinaciones.'; },
    steps: function (d) {
      return [
        'Se cuentan los estados distinguibles: <strong>' + d.v + '</strong>.',
        'En bits: $\\log_2 ' + d.v + ' = ' + U.fmt(Math.log(d.v) / Math.LN2, 3) + '$.',
        'Interpretación: hacen falta unas ' + U.fmt(Math.log(d.v) / Math.LN2, 2) + ' preguntas de sí o no ' +
          'para identificar el estado, o sea ' + Math.ceil(Math.log(d.v) / Math.LN2) + ' preguntas enteras.'
      ];
    }
  });

  p.exercise({
    title: '¿Alcanza el regulador?',
    level: 'medio',
    gen: function (r) {
      var vd = r.int(3, 12);
      var vr = r.int(2, 12);
      return { vd: vd, vr: vr };
    },
    ask: function (d) {
      return 'Un entorno puede presentar <strong>' + d.vd + ' perturbaciones</strong> distintas y el ' +
        'regulador dispone de <strong>' + d.vr + ' jugadas</strong>. Supón el caso exigente: cada ' +
        'perturbación necesita su propia respuesta.<br><br>' +
        '¿Cuántas perturbaciones puede neutralizar como máximo, y qué porcentaje de casos queda fuera ' +
        'de su alcance en el mejor de los casos?';
    },
    fields: [
      { name: 'n', label: 'neutraliza como máximo', w: 'tiny' },
      { name: 'pc', label: '% fuera de alcance', w: 'tiny' }
    ],
    sol: function (d) {
      var n = Math.min(d.vr, d.vd);
      return { n: n, pc: 100 * (d.vd - n) / d.vd };
    },
    tol: 0.01,
    hint: function () {
      return 'En el caso exigente, cada jugada se hace cargo de una sola perturbación. Si sobran ' +
        'jugadas no hacen daño, pero tampoco sirven de nada.';
    },
    steps: function (d) {
      var n = Math.min(d.vr, d.vd);
      return [
        'En el caso exigente cada jugada neutraliza una sola perturbación, así que cubre como mucho ' +
          '$\\min(' + d.vr + ', ' + d.vd + ') = ' + n + '$. Con una tabla más benévola podría cubrir ' +
          'más, pero eso no se puede dar por supuesto.',
        d.vr >= d.vd
          ? 'Como $V_R \\ge V_D$, le llega para todas: la ley de la variedad requerida se cumple y puede regular del todo.'
          : 'Como $V_R < V_D$, quedan $' + d.vd + ' - ' + n + ' = ' + (d.vd - n) + '$ perturbaciones sin respuesta posible.',
        'Porcentaje fuera de alcance: $\\dfrac{' + (d.vd - n) + '}{' + d.vd + '} = ' + U.fmt(100 * (d.vd - n) / d.vd, 2) + '\\%$.',
        d.vr >= d.vd ? 'Con jugadas de sobra el techo es el 100 %.' : 'Ese porcentaje es un <strong>techo</strong>: no lo mejora jugar mejor, solo tener más jugadas o reducir las perturbaciones.'
      ];
    }
  });

  p.exercise({
    title: 'Atenuar o amplificar',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Un restaurante cambia su carta de 40 platos por un menú de 4.', at: true },
        { t: 'Una empresa da a cada técnico autonomía para resolver sin consultar.', at: false },
        { t: 'Un formulario web sustituye el campo de texto libre por una lista de opciones.', at: true },
        { t: 'Un hospital amplía la plantilla de urgencias en un turno saturado.', at: false },
        { t: 'Un aeropuerto canaliza a los pasajeros por pasillos de sentido único.', at: true },
        { t: 'Una tienda añade un chat con personas al servicio automático.', at: false },
        { t: 'Un fabricante reduce su catálogo de veinte modelos a tres.', at: true },
        { t: 'Una central eléctrica instala baterías para responder a picos imprevistos.', at: false }
      ];
      var c = r.pick(casos);
      return { texto: c.t, at: c.at };
    },
    ask: function (d) {
      return 'Ante un problema de variedad hay dos salidas: <strong>atenuar</strong> la del entorno o ' +
        '<strong>amplificar</strong> la del regulador.<br><br><em>«' + d.texto + '»</em><br><br>' +
        '¿Cuál de las dos se está aplicando?';
    },
    fields: [{ name: 'q', label: 'Se está', opts: [{ t: 'atenuando la variedad del entorno', v: 'atenuando' }, { t: 'amplificando la variedad del regulador', v: 'amplificando' }] }],
    sol: function (d) { return { q: d.at ? 'atenuando' : 'amplificando' }; },
    hint: function () { return '¿Se están recortando las situaciones que pueden presentarse, o se están añadiendo respuestas posibles?'; },
    steps: function (d) {
      return d.at
        ? ['La medida recorta el número de situaciones distintas que pueden llegar.',
           'Es decir, baja $V_D$, la variedad del entorno.',
           'Eso es <strong>atenuar</strong>: suele ser lo más barato, a costa de dar menos opciones.']
        : ['La medida aumenta el número de respuestas distintas que el sistema puede dar.',
           'Es decir, sube $V_R$, la variedad del regulador.',
           'Eso es <strong>amplificar</strong>: cuesta más, pero no empobrece lo que se ofrece.'];
    },
    answer: function (d) { return d.at ? 'atenuando la variedad del entorno' : 'amplificando la del regulador'; }
  });

  p.keys([
    'La <strong>variedad</strong> de algo es el número de estados distintos que puede presentar, y depende de lo que el observador distinga.',
    'Medida en bits es $\\log_2 V$: exactamente la entropía de Shannon cuando todos los casos son igual de probables.',
    '<strong>Ley de la variedad requerida</strong>: para regular del todo hace falta $V_R \\ge V_D$.',
    'Si el regulador tiene menos jugadas que el entorno, su porcentaje de fallo está fijado de antemano y no lo arregla esforzarse más.',
    'Hay dos salidas: <strong>amplificar</strong> la variedad del regulador o <strong>atenuar</strong> la del entorno.',
    'Teorema del buen regulador: quien regula bien un sistema contiene necesariamente un modelo de ese sistema.'
  ]);

});
