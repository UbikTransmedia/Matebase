/* Tema: Realimentación: el bucle que se corrige solo */
Course.topic('cib-realimentacion', function (p) {

  p.text('Llevas todo el curso aprendiendo a describir cosas: cuánto vale algo, cómo cambia, qué forma ' +
    'tiene, con qué probabilidad ocurre. Este bloque hace una pregunta distinta y más ambiciosa: ' +
    '<strong>¿cómo consigue algo mantenerse en su sitio en un mundo que no deja de empujarlo?</strong>');

  p.text('La respuesta cabe en una palabra, y es la idea más productiva de todo el siglo XX en ' +
    'ingeniería: <strong>realimentación</strong>. Un sistema mide su propio resultado, lo compara con ' +
    'lo que quería, y usa la diferencia para corregirse. Nada más. Con eso se explica un termostato, ' +
    'una cisterna, un piloto automático, la temperatura de tu cuerpo, el precio de un mercado y buena ' +
    'parte de lo que hace tu cerebro cuando alargas la mano hacia un vaso.');

  p.text('Fíjate en lo raro que es esto comparado con todo lo anterior. Hasta ahora las causas iban en ' +
    'una dirección: metes datos, sale un resultado. Aquí <em>el resultado vuelve a la entrada</em>, y ' +
    'el sistema se muerde la cola. Esa circularidad rompe la manera habitual de razonar —¿quién es la ' +
    'causa y quién el efecto, si cada uno es el del otro?— y por eso hizo falta inventar un lenguaje ' +
    'nuevo para hablar de ella.');

  p.hist('El nombre de esta disciplina, <strong>cibernética</strong>, lo puso Norbert Wiener en 1948 ' +
    'en un libro titulado <em>Cybernetics, or Control ' +
    'and Communication in the Animal and the Machine</em>. Lo tomó del griego <em>kybernetes</em>, ' +
    'el timonel de un barco, que es exactamente la imagen: alguien que mira a dónde va, ve que se ' +
    'desvía y mueve el timón. La palabra «gobernar» viene de esa misma raíz, y también «governor», ' +
    'que es como se llama en inglés al regulador de una máquina de vapor. El vocabulario de la ' +
    'política y el de la ingeniería de control son literalmente la misma palabra.');

  p.text('Wiener llegó a esto por un encargo de guerra. En 1940 le pidieron que mejorara la puntería ' +
    'de los cañones antiaéreos, y se dio cuenta de que el problema no era balística: era que el ' +
    'artillero, el cañón y el avión formaban <strong>un solo sistema con un bucle</strong>, y que el ' +
    'mismo bucle aparecía en un servomotor y en una persona alargando la mano. De ahí salió la tesis ' +
    'que da título al libro: control y comunicación son la misma cosa, y funcionan igual en el animal ' +
    'y en la máquina.');

  /* ---------------------------------------------------------------- */
  p.section('Los dos signos del bucle');

  p.text('Un bucle de realimentación puede hacer dos cosas opuestas, y distinguirlas es lo primero.');

  p.text('En la <strong>realimentación negativa</strong>, la corrección va en contra de la desviación: ' +
    'si el resultado se pasa, el sistema empuja hacia abajo; si se queda corto, empuja hacia arriba. ' +
    'El efecto es <em>estabilizar</em>. Se llama negativa por el signo de la corrección, no porque ' +
    'sea mala; de hecho es la que sostiene tu temperatura corporal, la que mantiene el agua de la ' +
    'cisterna a su nivel y la que impide que un coche con control de crucero se despeñe cuesta abajo.');

  p.text('En la <strong>realimentación positiva</strong>, la corrección va a favor: cuanto más se ' +
    'desvía, más se empuja en esa misma dirección. El efecto es <em>amplificar</em>. Es el chirrido de ' +
    'un micrófono apuntando a su altavoz, el pánico bancario en el que la gente retira dinero porque ' +
    'otros lo retiran, el interés compuesto y la reacción en cadena. No es «mala» tampoco: es la que ' +
    'permite que una decisión pequeña se convierta en un cambio grande.');

  p.formulas([
    'e(t) = r - y(t) \\quad \\text{(error)}',
    'u(t) = K\\,e(t) \\quad \\text{(corrección)}'
  ], 'el bucle más sencillo que existe',
    'Se leen: <em>«e de te es igual a erre menos i griega de te»</em> y <em>«u de te es igual a ka por ' +
    'e de te»</em>.<br><br>Qué es cada letra: $r$ es la <strong>referencia</strong>, lo que quieres ' +
    'que valga la cosa · $y(t)$ es lo que <strong>vale de verdad</strong> en el instante $t$ · ' +
    '$e(t)$ es el <strong>error</strong>, la diferencia entre ambas · $u(t)$ es la ' +
    '<strong>acción</strong> con la que corriges · y $K$ es la <strong>ganancia</strong>, cuánto de ' +
    'fuerte corriges por cada unidad de error.<br><br>En cristiano: <em>«mira cuánto te has desviado y ' +
    'empuja en proporción»</em>.');

  p.note('La ganancia $K$ es el mando que lo decide todo, y su efecto no es el que la intuición ' +
    'sugiere. Corregir <em>más fuerte</em> no significa llegar antes y mejor: pasado cierto punto, el ' +
    'sistema se pasa de largo, tiene que volver, se vuelve a pasar, y acaba oscilando o ' +
    'descontrolándose. Es contraintuitivo y es la lección práctica más importante del tema.',
    'warn', 'Más fuerza no es mejor control');

  p.demo({
    title: 'Un termostato con el mando de la ganancia',
    intro: 'La habitación está a 12° y quieres 21°. Sube la ganancia poco a poco y observa el cambio de comportamiento: primero lento pero seguro, después rápido y limpio, luego oscilante y por fin descontrolado. En ningún momento se ha tocado nada más que la fuerza de la corrección.',
    build: function (host, d) {
      var K = 0.35, ref = 21, y0 = 12, N = 90;
      var out = W.readout(host, '');

      function simular() {
        var y = y0, s = [[0, y]];
        for (var i = 1; i <= N; i++) {
          var e = ref - y;
          y = y + K * e;                 // corrección proporcional, un paso por minuto
          s.push([i, y]);
        }
        return s;
      }

      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: -4, ymax: 46, height: 320,
        xlabel: 'minutos', ylabel: '°C',
        draw: function (g) {
          g.hline(ref, { color: 3, dash: true, w: 1.8 });
          g.text(N - 2, ref + 1.6, 'objetivo 21°', { align: 'right', color: 3, size: 12, box: true });
          var s = simular();
          g.path(s, { color: 0, w: 2.6 });
          for (var i = 0; i < s.length; i += 3) g.point(s[i][0], s[i][1], { color: 0, r: 2.6 });
        }
      });

      function paint() {
        var s = simular();
        var fin = s[s.length - 1][1];
        var maxv = Math.max.apply(null, s.map(function (q) { return q[1]; }));
        var sobre = maxv - ref;
        var diag, col;
        if (K <= 0) { diag = 'Sin corrección: la habitación se queda como estaba.'; col = 'ink-faint'; }
        else if (K < 0.5) { diag = '<strong>Estable y lento.</strong> Llega al objetivo sin pasarse, pero tarda.'; col = 'ok'; }
        else if (K < 1) { diag = '<strong>Estable y rápido.</strong> Este es el buen ajuste: llega pronto y sin sobresaltos.'; col = 'ok'; }
        else if (K < 2) { diag = '<strong>Oscila.</strong> Se pasa, vuelve, se vuelve a pasar. Acaba centrándose, pero con vaivenes.'; col = 'warn'; }
        else if (K === 2) { diag = '<strong>Oscilación sostenida.</strong> Justo en el filo: ni se calma ni se dispara.'; col = 'warn'; }
        else { diag = '<strong>Descontrolado.</strong> Cada corrección es mayor que el error que quería arreglar.'; col = 'bad'; }
        out.set('Ganancia $K = ' + U.fmt(K, 2) + '$ &nbsp;·&nbsp; sobrepaso máximo: ' +
          (sobre > 0.05 ? U.fmt(sobre, 1) + ' °C' : 'ninguno') +
          ' &nbsp;·&nbsp; temperatura final: ' + (Math.abs(fin) > 1e4 ? 'se dispara' : U.fmt(fin, 1) + ' °C') +
          '<br><span style="color:var(--' + col + ')">' + diag + '</span>');
        plot.render();
      }

      W.slider(W.row(host), {
        label: 'ganancia K', min: 0, max: 2.4, step: 0.01, value: K,
        on: function (v) { K = v; paint(); }
      });
      W.hint(host, 'Prueba K = 0,2 · K = 0,8 · K = 1,5 · K = 2,1. Son cuatro mundos distintos con la misma ecuación.');
      paint();
    }
  });

  p.util('Ese mando de ganancia es un ajuste real que alguien tiene que hacer en casi cualquier ' +
    'aparato con motor. Un ascensor que se pasa de planta y vuelve, una impresora 3D cuyo cabezal ' +
    'vibra y deja ondas en la pieza, un dron que se bambolea en vez de quedarse quieto: en los tres ' +
    'casos el problema suele ser exactamente el de la gráfica de arriba, ganancia demasiado alta. ' +
    'Y al revés, un termostato de casa con ganancia baja es el que te deja pasar frío media hora ' +
    'antes de reaccionar.');

  /* ---------------------------------------------------------------- */
  p.section('El bucle escrito como una fórmula');

  p.text('Antes de seguir conviene atar un cabo que ha quedado suelto. Definimos la corrección como ' +
    '$u = K\\,e$, pero en la simulación de arriba lo que se hace es $y_{\\text{nuevo}} = y + K\\,e$. ' +
    '<em>¿Dónde ha ido a parar la $u$?</em>');

  p.text('Está ahí: <strong>la acción $u$ es lo que se le suma al sistema</strong>. En el termostato, ' +
    '$u$ es el calor que aporta la caldera durante ese minuto, y el efecto de aportarlo es que la ' +
    'temperatura sube en esa cantidad. Escribirlo junto da la regla completa del bucle, paso a paso:');

  p.formula('y_{n+1} = y_n + K\\,(r - y_n)',
    'el bucle proporcional, en una línea',
    'Se lee: <em>«i griega sub ene más uno es igual a i griega sub ene, más ka por, erre menos i ' +
    'griega sub ene»</em>.<br><br>El subíndice $n$ numera los pasos: $y_n$ es el valor ahora e ' +
    '$y_{n+1}$ el del instante siguiente. Es una <strong>sucesión definida por recurrencia</strong>, ' +
    'de las del bloque 5: cada término se calcula a partir del anterior.<br><br>' +
    'Y aquí está el puente con la simulación: el paréntesis es el error $e_n$, y $K$ por ese ' +
    'paréntesis es exactamente la acción $u_n$.');

  p.sub('De dónde sale que la desviación se multiplica por $1-K$');

  p.text('Con esa fórmula se puede predecir el comportamiento sin simular nada, y merece la pena ' +
    'verlo porque son tres líneas y explican las cuatro zonas de la gráfica de antes.');

  p.text('Lo que interesa no es $y$ sino <strong>cuánto se aparta de la referencia</strong>. Llamemos ' +
    '$d_n = y_n - r$ a esa desviación. Restando $r$ a los dos lados de la fórmula del bucle:');

  p.formulas([
    'y_{n+1} - r = y_n - r + K\\,(r - y_n)',
    'd_{n+1} = d_n - K\\,d_n',
    'd_{n+1} = (1-K)\\,d_n'
  ], 'tres pasos y sale sola',
    'El truco del segundo paso es fijarse en que $r - y_n$ es justo $-d_n$, la desviación cambiada de ' +
    'signo. Sustituyendo, queda $d_n - K d_n$, y sacando $d_n$ factor común aparece la última línea.' +
    '<br><br>Lo que dice es contundente: <em>la desviación de cada paso es la anterior multiplicada ' +
    'por $1-K$</em>. Nada más. Es una progresión geométrica de razón $1-K$, de las del bloque 5.');

  p.text('Y con eso se entiende toda la gráfica de antes, sin simular. Como es una progresión ' +
    'geométrica, lo que decide su destino es el <strong>valor absoluto de la razón</strong>:');

  p.table(['Valor de $K$', 'Razón $1-K$', 'Qué pasa con la desviación'],
    [['$0 < K < 1$', 'entre 0 y 1, positiva', 'encoge en cada paso sin cambiar de lado: se acerca por abajo'],
     ['$K = 1$', 'cero', 'desaparece de golpe: llega al objetivo en un solo paso'],
     ['$1 < K < 2$', 'entre −1 y 0', 'encoge pero cambiando de signo: oscila y se calma'],
     ['$K = 2$', 'exactamente −1', 'cambia de signo sin encoger: oscila para siempre'],
     ['$K > 2$', 'menor que −1', 'crece en cada paso: se descontrola']]);

  p.note('Esta es la misma condición de estabilidad de la que hablábamos con Maxwell, en su versión ' +
    'más simple: el sistema es estable <strong>si y solo si $|1-K| < 1$</strong>. En sistemas más ' +
    'complicados ese número se convierte en varios —los autovalores— y la condición pasa a ser que ' +
    'todos ellos queden dentro de cierto límite. Pero la idea es exactamente la que acabas de ' +
    'deducir en tres líneas.', 'ok', 'Estabilidad, en su versión mínima');

  /* ---------------------------------------------------------------- */
  p.section('El regulador de Watt');

  p.text('El ejemplo clásico es anterior a la palabra en siglo y medio. En 1788, James Watt puso a su ' +
    'máquina de vapor un <strong>regulador de bolas</strong>: dos esferas colgadas de un eje que gira ' +
    'con la máquina. Si la máquina acelera, la fuerza centrífuga abre las bolas; al abrirse, tiran de ' +
    'una palanca que <em>cierra</em> la válvula de vapor; al entrar menos vapor, la máquina frena. Y ' +
    'al revés si va lenta.');

  p.text('Léelo otra vez y verás el bucle completo: la velocidad determina la posición de las bolas, ' +
    'la posición determina el vapor, y el vapor determina la velocidad. <strong>La máquina se regula ' +
    'a sí misma</strong>, sin que nadie mire. Ningún operario decide nada.');

  p.hist('El regulador de Watt tiene un papel curioso en la historia de las matemáticas: fue el ' +
    'primero en resistirse al análisis. Funcionaba, pero a veces las máquinas empezaban a dar tirones ' +
    'sin motivo aparente, y nadie sabía por qué. En 1868, James Clerk Maxwell —el mismo de las ' +
    'ecuaciones del electromagnetismo— publicó <em>On Governors</em>, donde planteó el problema como ' +
    'una ecuación diferencial y demostró que la estabilidad dependía de los signos de las raíces de ' +
    'una ecuación asociada. Es el nacimiento de la teoría de control, y salió de intentar entender ' +
    'por qué una máquina de vapor se ponía nerviosa.');

  p.note('Ese trabajo de Maxwell conecta directamente con lo que ya sabes. La condición de ' +
    'estabilidad que encontró es, en el lenguaje del [[av-lineal|álgebra lineal]], una condición sobre los ' +
    '<strong>autovalores</strong> del sistema: si su parte real es negativa, las perturbaciones se ' +
    'apagan; si es positiva, crecen. El puente del Milenio y la máquina de vapor de Watt fallan por ' +
    'la misma razón matemática.', 'ok', 'Dónde has visto esto antes');

  p.util('La realimentación negativa es la razón de que existan los aparatos de precisión. Un motor ' +
    'no gira a velocidad constante por sí solo: gira a la velocidad que le impone un bucle que mide y ' +
    'corrige mil veces por segundo. Lo mismo mantiene la frecuencia de la red eléctrica en 50 hercios ' +
    'pese a que millones de personas encienden y apagan cosas sin avisar, y lo mismo hace que el ' +
    'cursor llegue exactamente donde apuntas aunque tu mano tiemble.');

  /* ---------------------------------------------------------------- */
  p.section('Cuando el bucle amplifica');

  p.text('La realimentación positiva se estudia menos y explica más titulares. Su firma es el ' +
    'crecimiento explosivo, y ya la conoces con otro nombre: es la exponencial del bloque 5, vista ' +
    'desde el lado de las causas.');

  p.demo({
    title: 'El mismo bucle, cambiando el signo',
    intro: 'Con corrección negativa la desviación se apaga; con corrección positiva se dispara. Mueve el mando por debajo de cero para ver el otro lado.',
    build: function (host, d) {
      var K = 0.3, N = 40;
      var out = W.readout(host, '');
      function serie() {
        var x = 1, s = [[0, 1]];
        for (var i = 1; i <= N; i++) { x = x - K * x; s.push([i, x]); }
        return s;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: -6, ymax: 14, height: 280,
        xlabel: 'pasos', ylabel: 'desviación',
        draw: function (g) {
          g.hline(0, { color: 'axis', w: 1.4 });
          g.path(serie(), { color: K >= 0 ? 2 : 1, w: 2.6 });
        }
      });
      function paint() {
        var s = serie(), fin = s[s.length - 1][1];
        out.set((K > 0
          ? '<strong style="color:var(--ok)">Realimentación negativa</strong> ($K>0$): la corrección se opone a la desviación, que se va apagando.'
          : (K < 0
            ? '<strong style="color:var(--bad)">Realimentación positiva</strong> ($K<0$): la corrección va a favor, y la desviación crece sola.'
            : 'Sin bucle: la desviación se queda como estaba.')) +
          '<br>Desviación tras ' + N + ' pasos: ' + (Math.abs(fin) > 1e5 ? 'enorme' : U.fmt(fin, 3)));
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'K (negativo = bucle amplificador)', min: -0.2, max: 0.6, step: 0.01, value: K,
        on: function (v) { K = v; paint(); }
      });
      paint();
    }
  });

  p.util('Casi todos los sistemas reales tienen los dos bucles a la vez, y entender cuál manda en cada ' +
    'momento es la clave para leer una crisis. Una epidemia empieza con realimentación positiva —cada ' +
    'contagiado produce varios— y termina cuando los bucles negativos —inmunidad, cambios de ' +
    'comportamiento, medidas— se hacen más fuertes que el positivo. El punto en que se invierte la ' +
    'dominancia es el pico, y por eso el pico llega antes de que empiecen a bajar los casos totales.');

  p.hist('Wiener era un personaje improbable para fundar una disciplina de ingeniería. Niño prodigio ' +
    'empujado sin piedad por su padre, se doctoró en Harvard a los dieciocho años en lógica ' +
    'matemática. Después de la guerra se negó en redondo a seguir colaborando con los militares: en ' +
    '1947 publicó una carta abierta, <em>A Scientist Rebels</em>, rechazando trabajar en nada que ' +
    'pudiera usarse para matar, y dedicó su última etapa a advertir de que las máquinas de decidir ' +
    'iban a destruir empleos y a exigir que alguien pensara en ello antes. Su segundo libro se titula ' +
    '<em>El uso humano de los seres humanos</em>, y se lee hoy con una actualidad incómoda.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Estabiliza o amplifica?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'Un termostato enciende la calefacción cuando la temperatura baja del objetivo.', neg: true },
        { t: 'La gente retira dinero de un banco porque ve que otros lo están retirando.', neg: false },
        { t: 'La cisterna cierra la entrada de agua a medida que sube el flotador.', neg: true },
        { t: 'Un micrófono recoge el sonido de su propio altavoz y lo vuelve a amplificar.', neg: false },
        { t: 'El cuerpo suda cuando la temperatura interna sube por encima de 37°.', neg: true },
        { t: 'Cuanto más hielo se derrite, menos luz refleja el planeta y más se calienta.', neg: false },
        { t: 'El control de crucero da más gas al detectar que el coche pierde velocidad en una cuesta.', neg: true },
        { t: 'Un vídeo que ya tiene muchas visitas es recomendado a más gente, que lo ve.', neg: false },
        { t: 'El precio sube cuando escasea un producto, y esa subida reduce la demanda.', neg: true },
        { t: 'Una grieta en una pieza concentra la tensión justo en su punta, lo que la agranda.', neg: false }
      ];
      var c = r.pick(casos);
      return { texto: c.t, neg: c.neg };
    },
    ask: function (d) {
      return 'Lee la situación y decide qué tipo de bucle es:<br><br><em>«' + d.texto + '»</em><br><br>' +
        'Escribe <strong>negativa</strong> si el bucle estabiliza, o <strong>positiva</strong> si amplifica.';
    },
    fields: [{ name: 'tipo', label: 'El bucle es', w: 'wide' }],
    sol: function (d) { return { tipo: d.neg ? 'negativa' : 'positiva' }; },
    check: function (v, d) {
      var q = U.eligeOpcion(v.raw.tipo, {
        negativa: /negativ|estabiliz|corrig|compens|amortigu|frena/,
        positiva: /positiv|amplific|refuerz|dispara|crece|a favor/
      });
      if (!q) return { ok: false, msg: 'Responde «negativa» o «positiva».' };
      return { ok: q === (d.neg ? 'negativa' : 'positiva') };
    },
    hint: function () {
      return 'Pregúntate: cuando la cosa se desvía, ¿lo que ocurre después la trae de vuelta o la ' +
        'empuja más lejos?';
    },
    steps: function (d) {
      return d.neg
        ? ['La desviación provoca una respuesta que <strong>se opone</strong> a ella.',
           'El resultado es que el sistema vuelve hacia su valor de referencia.',
           'Eso es realimentación <strong>negativa</strong>: estabiliza.']
        : ['La desviación provoca una respuesta que <strong>va en el mismo sentido</strong>.',
           'Cada vuelta del bucle deja la desviación más grande que la anterior.',
           'Eso es realimentación <strong>positiva</strong>: amplifica.'];
    },
    answer: function (d) { return d.neg ? 'negativa (estabiliza)' : 'positiva (amplifica)'; }
  });

  p.exercise({
    title: 'Un paso del bucle',
    level: 'basico',
    gen: function (r) {
      var ref = r.int(15, 30);
      var y = ref + r.pm(3, 12);
      var K = r.pick([0.2, 0.25, 0.4, 0.5, 0.8]);
      return { ref: ref, y: y, K: K };
    },
    ask: function (d) {
      return 'Un regulador proporcional tiene la referencia en $r = ' + d.ref + '$ y mide ' +
        '$y = ' + d.y + '$. Su ganancia es $K = ' + U.fmt(d.K, 2) + '$.<br><br>' +
        'Calcula el error $e = r - y$ y el valor tras aplicar una corrección $y_{\\text{nuevo}} = y + K\\,e$.';
    },
    fields: [
      { name: 'e', label: 'e =', w: 'tiny' },
      { name: 'yn', label: 'y nuevo =', w: 'tiny' }
    ],
    sol: function (d) {
      var e = d.ref - d.y;
      return { e: e, yn: d.y + d.K * e };
    },
    tol: 1e-6,
    hint: function () { return 'El error puede ser negativo: significa que te has pasado.'; },
    steps: function (d) {
      var e = d.ref - d.y;
      return [
        'Error: $e = r - y = ' + d.ref + ' - ' + d.y + ' = ' + U.fmts(e, 0) + '$.',
        'Corrección: $K\\,e = ' + U.fmt(d.K, 2) + ' \\cdot ' + U.fmts(e, 0) + ' = ' + U.fmts(d.K * e, 3) + '$.',
        'Nuevo valor: $y + K e = ' + d.y + ' + (' + U.fmts(d.K * e, 3) + ') = ' + U.fmt(d.y + d.K * e, 3) + '$.',
        'Fíjate en que se ha acercado a la referencia sin llegar del todo: eso es lo normal con $K<1$.'
      ];
    }
  });

  p.exercise({
    title: '¿Se estabiliza o se descontrola?',
    level: 'medio',
    gen: function (r) {
      var K = r.pick([0.3, 0.5, 0.9, 1.2, 1.6, 2.3, 2.8]);
      return { K: K };
    },
    ask: function (d) {
      return 'En el bucle $y_{n+1} = y_n + K\\,(r - y_n)$, la desviación respecto a la referencia se ' +
        'multiplica en cada paso por el factor $1-K$.<br><br>Con $K = ' + U.fmt(d.K, 1) + '$, calcula ' +
        'ese factor y di si el sistema <strong>converge</strong>, <strong>oscila creciendo</strong> ' +
        'o se mantiene en <strong>oscilación sostenida</strong>.';
    },
    fields: [
      { name: 'f', label: '1 − K =', w: 'tiny' },
      { name: 'q', label: 'comportamiento', w: 'wide' }
    ],
    sol: function (d) {
      var f = 1 - d.K;
      var a = Math.abs(f);
      return { f: f, q: a < 1 ? 'converge' : (a > 1 ? 'oscila creciendo' : 'oscilación sostenida') };
    },
    check: function (v, d) {
      var f = 1 - d.K, a = Math.abs(f);
      var okF = Math.abs(v.f - f) < 1e-6;
      var q = U.eligeOpcion(v.raw.q, {
        converge: /converg|estabil|se apaga|calm|tiende a|se acerca|desaparece|encoge/,
        crece: /crec|dispara|descontrol|diverg|se va de|explota/,
        sostenida: /sosten|constante|se mantiene|siempre igual|misma amplitud|ni se calma/
      });
      var esperada = a < 1 ? 'converge' : (a > 1 ? 'crece' : 'sostenida');
      var okQ = q === esperada;
      return { ok: okF && okQ, fields: { f: okF, q: okQ } };
    },
    hint: function () {
      return 'Lo que decide es el <strong>valor absoluto</strong> del factor. Si es menor que 1, la ' +
        'desviación encoge en cada paso; si es mayor, crece.';
    },
    steps: function (d) {
      var f = 1 - d.K, a = Math.abs(f);
      return [
        'Factor: $1 - K = 1 - ' + U.fmt(d.K, 1) + ' = ' + U.fmts(f, 2) + '$.',
        'Su valor absoluto es $' + U.fmt(a, 2) + '$.',
        a < 1 ? 'Como es menor que 1, cada paso deja la desviación más pequeña: <strong>converge</strong>.'
          : (a > 1 ? 'Como es mayor que 1, cada paso la agranda: <strong>oscila creciendo</strong> y se descontrola.'
            : 'Como vale exactamente 1, la desviación cambia de signo pero no de tamaño: <strong>oscilación sostenida</strong>.'),
        f < 0 ? 'Además, al ser el factor negativo, la desviación cambia de signo en cada paso: por eso se ve oscilar.'
          : 'Al ser el factor positivo, la desviación se acerca sin cambiar de lado.'
      ];
    }
  });

  p.keys([
    'La <strong>realimentación</strong> es medir el propio resultado y usar la diferencia con el objetivo para corregirse.',
    'La <strong>negativa</strong> se opone a la desviación y estabiliza; la <strong>positiva</strong> va a favor y amplifica.',
    'El error es $e = r - y$ y la corrección proporcional es $u = K\\,e$.',
    'Subir la ganancia no mejora indefinidamente: pasado cierto punto aparece sobrepaso, luego oscilación y luego descontrol.',
    'La estabilidad de un bucle es una condición sobre los autovalores: es el mismo criterio que ya viste en sistemas dinámicos.',
    'Wiener lo bautizó en 1948 tomando la palabra griega para <em>timonel</em>: control y comunicación son la misma cosa.'
  ]);

});
