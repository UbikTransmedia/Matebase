/* Tema: Cibernética de segundo orden */
Course.topic('cib-segundo-orden', function (p) {

  p.text('Este tema cierra el bloque y el curso, y conviene empezar avisando de qué clase de tema es. ' +
    'Los ocho anteriores tenían números que calcular. Este tiene <strong>un teorema demostrable y una ' +
    'consecuencia incómoda</strong>, y la consecuencia se sale del terreno donde las matemáticas ' +
    'zanjan discusiones. Lo trataremos así: primero lo que está demostrado, después lo que se ' +
    'discute, señalando claramente dónde acaba lo uno y empieza lo otro.');

  /* ---------------------------------------------------------------- */
  p.section('El teorema del buen regulador');

  p.text('En 1970, Roger Conant y Ross Ashby publicaron un artículo con un título que es ya el ' +
    'enunciado entero: <em>Every good regulator of a system must be a model of that system</em> — ' +
    '<strong>todo buen regulador de un sistema tiene que ser un modelo de ese sistema</strong>.');

  p.text('La demostración es de teoría de la información y no la haremos aquí, pero su idea se puede ' +
    'seguir con lo que ya sabes del tema de la variedad. Recuerda el montaje: hay perturbaciones, hay ' +
    'jugadas del regulador y hay resultados. Un regulador es <em>bueno</em> si consigue que el ' +
    'resultado sea siempre el deseado, y es <em>óptimo</em> si además lo hace sin complicarse: sin ' +
    'variedad de sobra, sin jugadas superfluas.');

  p.text('Impón esas dos condiciones a la vez y sale algo obligatorio: la jugada del regulador tiene ' +
    'que quedar determinada por la perturbación, de manera que a cada situación distinta le ' +
    'corresponda una respuesta distinta. Es decir, dentro del regulador hay una ' +
    '<strong>correspondencia</strong> entre lo que pasa fuera y lo que él hace. Y a eso, cuando lo ' +
    'encontramos en cualquier otro contexto, lo llamamos exactamente <em>tener un modelo</em>.');

  p.formulas([
    'R = f(D) \\quad \\text{en todo regulador óptimo}',
    'V_R \\ge V_D \\quad \\text{(ley de la variedad requerida)}'
  ], 'lo que el teorema obliga',
    'La primera línea se lee: <em>«erre es igual a efe de de»</em>, o sea, la jugada del regulador es ' +
    'una función de la perturbación.<br><br>La segunda ya la conoces del tema de la variedad: hace ' +
    'falta al menos tanta variedad en el regulador como en el entorno.<br><br>Juntas dicen algo más ' +
    'fuerte que cada una por su lado: no basta con <em>tener</em> suficientes jugadas, hay que tenerlas ' +
    '<strong>emparejadas correctamente</strong> con las situaciones. Ese emparejamiento es el modelo.');

  p.note('Conviene ser preciso con lo que el teorema dice y con lo que no. <strong>No</strong> dice ' +
    'que el regulador «entienda» nada, ni que tenga una representación consciente, ni que haya un ' +
    'dibujito del mundo en su interior. Dice algo más modesto y más sólido: que su estructura ' +
    '<em>tiene que distinguir</em> lo mismo que distingue el sistema regulado. Un termostato contiene ' +
    'un modelo de la habitación en ese sentido y solo en ese: distingue «hace frío» de «hace calor», ' +
    'que es exactamente la distinción que necesita para hacer su trabajo.',
    'ok', 'Qué dice exactamente y qué no');

  p.util('La lectura práctica de este teorema es de las que cambian cómo se diseñan las cosas: ' +
    '<strong>si tu regulador falla, mira su modelo antes que su fuerza</strong>. Un sistema de ' +
    'detección de fraude que no distingue dos tipos de operación distintos jamás podrá tratarlos de ' +
    'forma diferente, por mucha potencia de cálculo que se le eche; un protocolo de emergencias que no ' +
    'contempla un escenario no lo va a gestionar bien improvisando. Antes de pedir más recursos, hay ' +
    'que preguntar qué distinciones le faltan.');

  p.hist('Ashby había llegado a esto desde la psiquiatría, y en su cabeza el teorema apuntaba a una ' +
    'conclusión concreta: si un organismo regula su conducta en un entorno, entonces contiene ' +
    'necesariamente un modelo de ese entorno. No como metáfora ni como hipótesis psicológica, sino ' +
    'como consecuencia matemática de estar regulando bien. Es una de las pocas veces en que una ' +
    'afirmación sobre la mente se ha deducido de un argumento de teoría de la información, y por eso ' +
    'el artículo se sigue citando cincuenta años después en neurociencia y en inteligencia artificial.');

  /* ---------------------------------------------------------------- */
  p.section('El observador dentro del sistema');

  p.text('Y ahora el paso que da nombre al tema. Si regular exige modelar, y el que modela también ' +
    'forma parte del mundo, aparece un bucle nuevo, que no es el de la máquina sino el del ' +
    'observador: <strong>quien estudia el sistema está dentro del sistema que estudia</strong>.');

  p.text('Heinz von Foerster, que había sido secretario de las conferencias Macy donde se fundó la ' +
    'disciplina, propuso llamar <strong>cibernética de primer orden</strong> a la de los ocho temas ' +
    'anteriores —la de los sistemas observados— y <strong>de segundo orden</strong> a la que incluye ' +
    'al observador en el cuadro. Su formulación es una de esas frases que se recuerdan: la primera es ' +
    'la cibernética de los sistemas observados; la segunda, la de los sistemas observadores.');

  p.text('El cambio no es cosmético. En el tema de la caja negra ya apareció una versión suave de esto: ' +
    'la variedad de un sistema depende de qué distinga quien mira, de modo que las descripciones no ' +
    'son propiedades del objeto sino del par objeto-observador. Llevado hasta el final, obliga a ' +
    'reconocer que en cualquier modelo hay siempre alguien que decidió qué contaba como estado, qué ' +
    'como perturbación y qué como resultado — y esa decisión no la dicta la naturaleza.');

  p.demo({
    title: 'Un sistema que se observa a sí mismo',
    intro: 'Una máquina intenta regular una señal, y a la vez construye un modelo de ella observándola. El detalle es que sus propias correcciones cambian lo que observa. Sube el acoplamiento y verás aparecer el problema del segundo orden: cuanto más actúa sobre el mundo, menos se parece lo que mide a lo que habría pasado sin ella.',
    build: function (host, d) {
      var acopl = 0, N = 120;
      var out = W.readout(host, '');

      function simular() {
        var libre = [], observado = [], modelo = [];
        var m = 0;
        for (var i = 0; i <= N; i++) {
          var base = 6 * Math.sin(i / 14) + 2 * Math.sin(i / 4.5);
          // la accion del regulador se basa en su modelo, y altera lo observado
          var accion = -acopl * m;
          var obs = base + accion;
          m = m + 0.22 * (obs - m);              // el modelo se ajusta a lo que ve
          libre.push([i, base]);
          observado.push([i, obs]);
          modelo.push([i, m]);
        }
        return { libre: libre, obs: observado, mod: modelo };
      }

      var plot = W.plot(host, {
        xmin: 0, xmax: N, ymin: -11, ymax: 11, height: 300,
        xlabel: 'tiempo', ylabel: 'señal',
        draw: function (g) {
          var s = simular();
          g.path(s.libre, { color: 'ink-faint', w: 1.8, dash: true });
          g.path(s.obs, { color: 0, w: 2.6 });
          g.path(s.mod, { color: 2, w: 2.2 });
        }
      });
      W.legend(host, [
        { c: 'ink-faint', t: 'lo que habría pasado sin el observador' },
        { c: 0, t: 'lo que el observador mide' },
        { c: 2, t: 'el modelo que se ha construido' }
      ]);

      function paint() {
        var s = simular();
        var dif = 0;
        for (var i = 0; i <= N; i++) dif += Math.abs(s.obs[i][1] - s.libre[i][1]);
        dif /= (N + 1);
        out.set('Acoplamiento = ' + U.fmt(acopl, 2) + ' &nbsp;·&nbsp; diferencia media entre lo observado y lo que habría ocurrido sin observador: <strong>' + U.fmt(dif, 3) + '</strong><br>' +
          (acopl < 0.05
            ? 'Con acoplamiento cero el observador es un espectador puro: lo que mide es exactamente lo que habría pasado. Esta es la situación que se supone en la cibernética de primer orden.'
            : (acopl < 0.6
              ? '<span style="color:var(--warn)">El observador ya está modificando lo que observa. Su modelo describe bien lo que mide, pero lo que mide ya no es el sistema de partida.</span>'
              : '<span style="color:var(--bad)">Acoplamiento fuerte: la señal medida es en buena parte consecuencia de las propias acciones del observador. Preguntar «cómo es el sistema en realidad» ha dejado de tener una respuesta sencilla.</span>')));
        plot.render();
      }

      W.slider(W.row(host), {
        label: 'acoplamiento observador-sistema', min: 0, max: 1.2, step: 0.01, value: acopl,
        on: function (v) { acopl = v; paint(); }
      });
      W.hint(host, 'Fíjate en la línea de puntos: es la única que no cambia. Todas las demás dependen de cuánto intervenga quien mide.');
      paint();
    }
  });

  p.note('Esta demostración es una <strong>ilustración, no una prueba</strong>. Muestra un caso ' +
    'concreto en el que observar altera lo observado, que es una situación real y frecuente —un ' +
    'sondeo que influye en el voto, una evaluación que cambia la conducta evaluada, un indicador que ' +
    'se convierte en objetivo—, pero de ahí no se sigue ninguna afirmación general demostrada. Lo ' +
    'digo explícitamente porque en este terreno es fácil pasar de una gráfica sugerente a una ' +
    'conclusión grandilocuente, y ese salto no lo autoriza nadie.',
    'warn', 'Hasta dónde llega esta demostración');

  p.util('Ese fenómeno tiene un nombre en gestión y es una de las regularidades más robustas que se ' +
    'conocen: la <strong>ley de Goodhart</strong>, que suele enunciarse como <em>«cuando una medida ' +
    'se convierte en objetivo, deja de ser una buena medida»</em>. Si a un hospital se le evalúa por ' +
    'el tiempo de espera en urgencias, el tiempo de espera mejora y deja de informar sobre la calidad ' +
    'asistencial; si a un desarrollador se le mide por líneas de código, escribe más líneas. El ' +
    'indicador se acopla con lo indicado, y a partir de ahí mide sobre todo el propio acto de medir.');

  /* ---------------------------------------------------------------- */
  p.section('Del control a la conversación');

  p.text('Esta segunda mirada cambió lo que la disciplina consideraba su objeto. Si el observador no ' +
    'se puede quitar del cuadro, entonces regular a otro deja de ser un problema puramente técnico ' +
    'y se convierte en algo más parecido a un acuerdo entre dos partes que se modelan mutuamente.');

  p.text('Gordon Pask llevó esa idea a su terreno, la enseñanza, y construyó lo que llamó ' +
    '<strong>teoría de la conversación</strong>: aprender no es que un emisor transmita información a ' +
    'un receptor, sino que dos sistemas ajusten sus modelos el uno del otro hasta ponerse de acuerdo ' +
    'en el significado de algo. En su lenguaje, entenderse es alcanzar un acuerdo estable — un punto ' +
    'de equilibrio, en el sentido del bloque 8.');

  p.hist('La cibernética vivió una historia curiosa: fue enormemente influyente y a la vez se ' +
    'disolvió. Sus ideas se repartieron por disciplinas que hoy no la citan: la teoría de control se ' +
    'fue a ingeniería, la teoría de la información a telecomunicaciones, los autómatas y las redes ' +
    'neuronales a informática, la dinámica de sistemas a economía y ecología, y la parte de segundo ' +
    'orden a las ciencias sociales y a la terapia familiar. Wiener murió en 1964, Ashby en 1972, y ' +
    'para los años ochenta la palabra sonaba antigua; hoy sobrevive sobre todo como prefijo, en ' +
    '«ciberespacio» o «ciberseguridad», que es un destino algo humillante para una disciplina que ' +
    'quería explicar a la vez el termostato y el cerebro.');

  p.text('Y sin embargo, si has llegado hasta aquí desde el primer tema del curso, habrás notado que ' +
    'las piezas encajaban solas. El bucle de corrección, la entropía, los autovalores, la derivada ' +
    'como anticipación y la integral como memoria, el equilibrio de un sistema dinámico, la ' +
    'probabilidad de acertar barajando al azar: todo eso estaba disperso en once bloques y aquí se ' +
    'ha usado junto para responder a una sola pregunta. Esa capacidad de juntar cosas que parecían ' +
    'de asignaturas distintas es, seguramente, lo mejor que dejó la cibernética, y es también lo que ' +
    'este curso ha intentado enseñar desde el primer día: que las matemáticas son un idioma con el ' +
    'que se puede decir casi todo, incluido cómo se sostiene algo en pie.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Qué distinciones le faltan al regulador?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Un termostato con un solo sensor en el pasillo mantiene bien el pasillo, pero el dormitorio pasa frío y la cocina calor.',
          n: 2, por: 'No distingue entre habitaciones: para su modelo, la casa es un único sitio.' },
        { t: 'Un filtro antispam bloquea las facturas de un cliente porque contienen la palabra «oferta».',
          n: 2, por: 'No distingue el remitente conocido del desconocido: su modelo solo mira palabras.' },
        { t: 'Un semáforo con tiempos fijos genera colas enormes a las ocho de la mañana y está en verde sin coches a las cuatro de la madrugada.',
          n: 2, por: 'No distingue la hora ni el tráfico presente: su modelo del cruce no tiene variable de demanda.' },
        { t: 'Un control de crucero mantiene la velocidad en el llano pero se queda corto subiendo un puerto largo.',
          n: 2, por: 'No distingue la pendiente: su modelo no incluye la carga que le opone la cuesta.' },
        { t: 'Un sistema de riego programado por horas riega igual el día que ha llovido.',
          n: 2, por: 'No distingue si el suelo está mojado: su modelo del jardín no tiene humedad.' }
      ];
      var c = r.pick(casos);
      return { texto: c.t, por: c.por };
    },
    ask: function (d) {
      return 'Según el teorema del buen regulador, cuando un regulador falla de forma sistemática es ' +
        'que <em>su modelo no distingue</em> algo que el sistema sí distingue.<br><br>' +
        '<em>«' + d.texto + '»</em><br><br>' +
        '¿Qué distinción le falta? Descríbela con unas palabras.';
    },
    fields: [{ name: 'q', label: 'no distingue…', w: 'wide' }],
    sol: function (d) { return { q: d.por }; },
    check: function (v, d) {
      var s = String(v.raw.q || '').toLowerCase();
      if (s.length < 5) return { ok: false, msg: 'Descríbelo con unas palabras.' };
      var claves = [
        [/habitacion|estancia|cuarto|zona|sitio|dormitorio|cocina|sala/, 'No distingue entre habitaciones'],
        [/remitente|contacto|conocid|cliente|origen|quien env/, 'No distingue el remitente'],
        [/hora|tr[aá]fico|coches|demanda|momento|afluencia/, 'No distingue la hora ni el tráfico'],
        [/pendiente|cuesta|puerto|inclina|carga|subida/, 'No distingue la pendiente'],
        [/lluvia|llov|humedad|mojado|agua|suelo/, 'No distingue la humedad']
      ];
      var esperado = d.por.toLowerCase();
      for (var i = 0; i < claves.length; i++) {
        if (claves[i][0].test(esperado)) return { ok: claves[i][0].test(s) };
      }
      return { ok: false };
    },
    hint: function () {
      return 'Busca la variable que el regulador nunca mira y que sin embargo cambia lo que habría que hacer.';
    },
    steps: function (d) {
      return [
        'El fallo es sistemático, no aleatorio: se repite siempre en las mismas circunstancias.',
        'Eso apunta a que el regulador trata como iguales dos situaciones que son distintas.',
        d.por,
        'La solución no es un regulador más potente, sino uno que <strong>mida esa variable</strong>: es decir, uno con un modelo más fino.'
      ];
    },
    answer: function (d) { return d.por; }
  });

  p.exercise({
    title: 'Ley de Goodhart',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'Se evalúa a un centro de salud por el tiempo medio de espera, y empieza a citar a los pacientes complicados en otra lista.', g: true },
        { t: 'Se mide la temperatura de un horno con un termómetro para regularlo, y el termómetro no altera el horno.', g: false },
        { t: 'Se paga a los programadores por líneas de código escritas y el código se vuelve mucho más largo.', g: true },
        { t: 'Un pluviómetro registra la lluvia caída y la medición no influye en el tiempo.', g: false },
        { t: 'Se premia a los colegios por su nota media en un examen y empiezan a preparar solo ese examen.', g: true },
        { t: 'Se cuenta el número de coches que pasan por un puente para dimensionar una obra futura.', g: false }
      ];
      var c = r.pick(casos);
      return { texto: c.t, goodhart: c.g };
    },
    ask: function (d) {
      return '<em>«' + d.texto + '»</em><br><br>¿Se está produciendo el efecto de la ley de Goodhart ' +
        '—la medida se ha convertido en objetivo y ha dejado de medir lo que medía— o se trata de una ' +
        'medición que no altera lo medido?<br><br>Responde <strong>sí</strong> o <strong>no</strong>.';
    },
    fields: [{ name: 'q', label: '¿Goodhart?', w: 'tiny' }],
    sol: function (d) { return { q: d.goodhart ? 'sí' : 'no' }; },
    check: function (v, d) {
      var s = String(v.raw.q || '').toLowerCase().trim();
      var si = /^s[ií]|^yes|^y$|se produce|goodhart/.test(s);
      var no = /^no|^n$|no se produce|no altera/.test(s);
      if (si === no) return { ok: false, msg: 'Responde «sí» o «no».' };
      return { ok: d.goodhart ? si : no };
    },
    hint: function () {
      return '¿Hay alguien con un incentivo para cambiar su conducta <em>a causa</em> de que le midan? Un termómetro no tiene incentivos.';
    },
    steps: function (d) {
      return d.goodhart
        ? ['La medida se ha convertido en objetivo de alguien que puede modificar su conducta.',
           'Y esa conducta cambia de manera que mejora el indicador sin mejorar lo que el indicador pretendía representar.',
           '<strong>Sí</strong> es un caso de la ley de Goodhart: el sistema medido y el que mide están acoplados.']
        : ['Aquí lo medido no tiene manera de reaccionar al hecho de ser medido.',
           'El acoplamiento entre observador y observado es despreciable.',
           '<strong>No</strong> es un caso de Goodhart: es una medición corriente.'];
    },
    answer: function (d) { return d.goodhart ? 'sí' : 'no'; }
  });

  p.keys([
    '<strong>Teorema del buen regulador</strong> (Conant y Ashby, 1970): todo regulador óptimo de un sistema contiene un modelo de ese sistema.',
    'Modelo significa aquí <em>hacer las mismas distinciones</em>, no entender ni representar conscientemente.',
    'Cuando un regulador falla siempre en las mismas circunstancias, lo que le falta es una distinción, no potencia.',
    'La <strong>cibernética de segundo orden</strong> incluye al observador dentro del sistema observado.',
    'La <strong>ley de Goodhart</strong> es ese acoplamiento en la práctica: al convertirse en objetivo, una medida deja de medir.',
    'La cibernética se disolvió repartiéndose entre disciplinas, y lo mejor que dejó fue la costumbre de juntar herramientas de asignaturas distintas para un mismo problema.'
  ]);

});
