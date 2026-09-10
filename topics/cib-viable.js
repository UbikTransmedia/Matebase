/* Tema: El modelo de sistema viable */
Course.topic('cib-viable', function (p) {

  p.text('¿Por qué unas organizaciones sobreviven décadas a crisis, cambios de dirección y mercados que se ' +
    'hunden, y otras se desmoronan a la primera? Stafford Beer, un teórico británico de la gestión, se hizo ' +
    'esa pregunta con las herramientas de este bloque. Su respuesta fue un modelo: cinco funciones que tiene ' +
    'que cumplir <strong>todo sistema viable</strong>, es decir, todo sistema capaz de mantener su ' +
    'identidad en un entorno que cambia. Da igual que sea una empresa, un hospital, un instituto o un ' +
    'organismo vivo.');

  p.text('La base es la [[cib-variedad|ley de la variedad requerida]] de Ashby: solo la variedad puede ' +
    'absorber variedad. El entorno de una organización tiene muchísima más variedad que la organización, y ' +
    'sus operaciones tienen muchísima más que su dirección. El modelo viable es la manera de cuadrar esas ' +
    'cuentas sin que nadie se desborde.');

  /* ---------------------------------------------------------------- */
  p.section('Los cinco sistemas');

  p.table(['Sistema', 'Función', 'En un instituto'], [
    ['<strong>1. Operaciones</strong>', 'Las unidades que hacen el trabajo para el que existe la organización y tratan directamente con el entorno.', 'Los departamentos y los grupos, dando clase cada día.'],
    ['<strong>2. Coordinación</strong>', 'Evita que las unidades operativas choquen u oscilen entre ellas.', 'El horario, el calendario de exámenes, las normas de uso de aulas compartidas.'],
    ['<strong>3. Control</strong>', 'Gestiona el «aquí y ahora»: reparte recursos, fija objetivos y comprueba que se cumplen.', 'La jefatura de estudios: asigna profesores y aulas y revisa los resultados de cada evaluación.'],
    ['<strong>4. Inteligencia</strong>', 'Mira «fuera y al futuro»: qué cambia en el entorno y cómo adaptarse.', 'Quien sigue los cambios de la prueba de acceso, la demografía del barrio o las nuevas enseñanzas.'],
    ['<strong>5. Identidad</strong>', 'Decide qué es la organización y arbitra entre el presente (3) y el futuro (4).', 'El consejo escolar y el proyecto educativo del centro.']
  ]);

  p.note('Los sistemas 3 y 4 están en tensión permanente. El 3 quiere estabilidad y eficiencia hoy; el 4 ' +
    'quiere cambiar para no quedarse atrás mañana. Una organización donde gana siempre el 3 funciona como ' +
    'un reloj hasta que el mundo cambia y se queda obsoleta; una donde gana siempre el 4 vive en ' +
    'reorganización perpetua y no hace bien nada. El sistema 5 existe para mantener ese equilibrio, igual ' +
    'que el segundo nivel del [[cib-homeostasis|homeostato]] decide cuándo cambiar las reglas.', 'ok', 'La tensión que lo sostiene todo');

  p.text('Beer añadió dos piezas más. Un canal de <strong>auditoría</strong> (el 3*), para que el control ' +
    'pueda comprobar de primera mano lo que pasa en las operaciones sin fiarse solo de los informes. Y ' +
    'unas <strong>señales algedónicas</strong>, de dolor o de placer, que saltan todos los niveles y llegan ' +
    'directamente arriba cuando algo va muy mal, como el dolor avisa al cerebro sin pasar por la ' +
    'burocracia del cuerpo.');

  /* ---------------------------------------------------------------- */
  p.section('Atenuar y amplificar la variedad');

  p.text('Una dirección no puede atender todo lo que pasa en las operaciones: no tiene variedad suficiente. ' +
    'Beer propuso dos herramientas para equilibrar, a las que llamó <strong>ingeniería de la variedad</strong>. ' +
    'Los <strong>atenuadores</strong> reducen la variedad que sube: informes que resumen, indicadores, ' +
    'unidades que resuelven por sí mismas los casos corrientes. Los <strong>amplificadores</strong> ' +
    'multiplican la variedad que baja: normas generales, delegación, formación, que permiten a una sola ' +
    'decisión cubrir muchas situaciones.');

  p.formulas([
    '\\log_2 V_{\\text{operaciones}} - A \\le \\log_2 V_{\\text{dirección}}',
    '\\log_2 V_{\\text{dirección}} + B \\ge \\log_2 V_{\\text{operaciones}}'
  ], 'el balance de variedad, en bits',
    'La variedad se mide en [[av-informacion|bits]]: $\\log_2$ del número de situaciones distintas.<br><br>' +
    'La primera línea dice que la variedad que sube, una vez restados los $A$ bits de atenuación, no puede ' +
    'superar la que la dirección es capaz de manejar.<br><br>La segunda, que la variedad de la dirección, ' +
    'con los $B$ bits de amplificación, tiene que alcanzar a la de las operaciones para poder regularlas. ' +
    'Si alguna de las dos falla, algo se queda sin gobernar.');

  p.demo({
    title: '¿Da abasto la dirección?',
    intro: 'Cada día surgen en las operaciones muchos asuntos, y la dirección solo puede atender unos cuantos. Sin filtros, se desborda. Mueve qué parte de los asuntos sube a la dirección —el resto lo resuelven las propias unidades con normas y autonomía— y la capacidad de la dirección, hasta que no quede nada sin atender.',
    build: function (host) {
      var V = 400, f = 100, C = 40;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 4, ymin: 0, ymax: 880, height: 270, xlabel: null, ylabel: 'asuntos al día',
        aria: 'Barras con los asuntos que surgen, los que suben a la dirección y los que esta atiende',
        draw: function (g) {
          var sube = V * f / 100, atiende = Math.min(sube, C), sin = sube - atiende;
          g.bars([
            { x: 1, h: V, color: 3, top: U.fmt(V, 0) },
            { x: 2, h: sube, color: 0, top: U.fmt(sube, 0) },
            { x: 3, h: atiende, color: 2, top: U.fmt(atiende, 0) }
          ]);
          if (sin > 0) g.rect(2.65, atiende, 0.7, sin, { fill: true, color: 'bad', fillAlpha: 0.3, w: 1.5, dash: true });
          g.hline(C, { color: 2, dash: true, w: 1.2 });
          g.text(1, 30, 'surgen', { align: 'center', size: 12, box: true });
          g.text(2, 30, 'suben', { align: 'center', size: 12, box: true });
          g.text(3, 30, 'se atienden', { align: 'center', size: 12, box: true });
        }
      });
      function pinta() {
        var sube = V * f / 100, sin = Math.max(0, sube - C);
        out.set('Suben <strong>' + U.fmt(sube, 0) + '</strong> asuntos al día y la dirección atiende <strong>' + C + '</strong>. ' +
          (sin > 0 ? '<strong style="color:var(--bad)">Quedan ' + U.fmt(sin, 0) + ' sin atender cada día.</strong> O se atenúa más, o se amplía la capacidad de arriba.'
            : '<strong style="color:var(--ok)">La dirección da abasto.</strong>') +
          '<br>En bits: surgen $\\log_2 ' + V + ' \\approx ' + U.fmt(Math.log(V) / Math.LN2, 2) + '$ bits de variedad; la dirección maneja $\\log_2 ' + C + ' \\approx ' + U.fmt(Math.log(C) / Math.LN2, 2) + '$.');
        plot.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'asuntos que surgen al día', min: 50, max: 800, step: 10, value: V, on: function (v) { V = v; pinta(); } });
      W.slider(fila, { label: '% que sube a la dirección', min: 1, max: 100, step: 1, value: f, on: function (v) { f = v; pinta(); } });
      W.slider(fila, { label: 'capacidad de la dirección', min: 5, max: 200, step: 5, value: C, on: function (v) { C = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Recursividad: organizaciones dentro de organizaciones');

  p.text('La idea más elegante del modelo es que es <strong>recursivo</strong>. Cada unidad operativa, cada ' +
    'sistema 1, es a su vez un sistema viable completo, con sus propios cinco sistemas. Un departamento de ' +
    'un instituto tiene sus operaciones (sus profesores y grupos), su coordinación, su jefe, su mirada al ' +
    'futuro y su identidad. Y cada profesor, en su aula, también. La misma estructura se repite a todas las ' +
    'escalas, como un [[av-caos|fractal]].');

  p.text('Eso da una herramienta de diagnóstico muy práctica: en cada nivel se puede preguntar si están las ' +
    'cinco funciones. ¿Quién coordina para que los departamentos no se pisen? ¿Quién está mirando el ' +
    'futuro, o todo el mundo está apagando fuegos? ¿Hay un canal para que una alarma grave llegue arriba ' +
    'a tiempo? Muchas organizaciones enfermas lo están porque les falta una de las cinco, o porque una ' +
    'invade a las demás.');

  /* ---------------------------------------------------------------- */
  p.section('Cybersyn: Chile, 1971');

  p.text('En 1971, el gobierno de Salvador Allende había nacionalizado cientos de empresas y no tenía forma ' +
    'de coordinarlas. Fernando Flores, un joven ingeniero de la agencia estatal de fomento, invitó a Stafford ' +
    'Beer a diseñar un sistema de gestión basado en el modelo viable. El resultado fue el proyecto ' +
    '<strong>Cybersyn</strong>: una red de télex que conectaba fábricas de todo el país con Santiago, un ' +
    'programa estadístico que detectaba cuándo un indicador de producción se salía de su comportamiento ' +
    'habitual, un simulador de la economía y una sala de operaciones de diseño futurista.');

  p.text('Lo más interesante era el principio de autonomía. Cuando el programa detectaba una anomalía en ' +
    'una fábrica, avisaba primero a la propia fábrica, y la alarma solo subía de nivel si no se resolvía en ' +
    'un plazo. Es exactamente la atenuación de variedad del modelo: cada nivel resuelve lo suyo, y arriba ' +
    'solo llega lo que abajo no puede absorber. Durante la huelga de transportistas de octubre de 1972, la ' +
    'red de télex se usó para coordinar los camiones disponibles y mantener el abastecimiento.');

  p.hist('Stafford Beer publicó el modelo del sistema viable en <em>Brain of the Firm</em> (1972), inspirado ' +
    'en la organización del sistema nervioso humano. Cybersyn no llegó a estar terminado: el golpe de ' +
    'Estado del 11 de septiembre de 1973 lo interrumpió, y la sala de operaciones fue desmantelada. Durante ' +
    'años fue casi una leyenda, hasta que la historiadora Eden Medina lo reconstruyó a partir de archivos y ' +
    'entrevistas en su libro <em>Revolucionarios cibernéticos</em> (2011). Hoy se discute como uno de los ' +
    'primeros intentos de gobernar con datos en tiempo real, con sus promesas y sus riesgos.');

  p.util('El modelo viable se usa como herramienta de diagnóstico en empresas, administraciones y ' +
    'cooperativas, sobre todo cuando crecen y lo que funcionaba con veinte personas deja de funcionar con ' +
    'doscientas. Y su preocupación central —cuánta autonomía dar a cada parte para que el conjunto sea ' +
    'gobernable sin asfixiar a nadie— reaparece en el diseño de redes informáticas, de sistemas federales ' +
    'y de equipos de trabajo.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Qué sistema es?',
    level: 'basico',
    gen: function (r) {
      return r.pick([
        { t: 'En un hospital, los equipos de urgencias, quirófanos y consultas atendiendo a los pacientes.', q: '1' },
        { t: 'El cuadrante que evita que dos servicios del hospital reserven el mismo quirófano a la misma hora.', q: '2' },
        { t: 'La dirección médica que reparte el presupuesto entre servicios y revisa si se cumplen los objetivos del año.', q: '3' },
        { t: 'Un equipo que estudia cómo cambiará la población de la zona en diez años y qué especialidades harán falta.', q: '4' },
        { t: 'El patronato que decide qué clase de hospital se quiere ser y arbitra cuando las necesidades de hoy chocan con las de mañana.', q: '5' },
        { t: 'El calendario de exámenes que impide que un grupo tenga cuatro exámenes el mismo día.', q: '2' },
        { t: 'Los departamentos de un instituto dando clase cada día.', q: '1' },
        { t: 'La jefatura de estudios, que asigna profesores y aulas y revisa los resultados de cada evaluación.', q: '3' },
        { t: 'La comisión que sigue los cambios de la prueba de acceso a la universidad y propone cómo adaptar el centro.', q: '4' },
        { t: 'El consejo escolar aprobando el proyecto educativo del centro.', q: '5' }
      ]);
    },
    ask: function (d) { return '<em>«' + d.t + '»</em><br>¿Qué sistema del modelo viable es?'; },
    fields: [{
      name: 'q', label: 'Es el', opts: [
        { t: 'Sistema 1: operaciones', v: '1' }, { t: 'Sistema 2: coordinación', v: '2' }, { t: 'Sistema 3: control del aquí y ahora', v: '3' },
        { t: 'Sistema 4: inteligencia, el afuera y el futuro', v: '4' }, { t: 'Sistema 5: identidad', v: '5' }
      ]
    }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return ['¿Hace el trabajo, evita choques, reparte recursos hoy, mira al futuro o decide qué es la organización?', 'Coordinar (2) no es mandar (3): el 2 solo evita que las unidades se estorben.']; },
    steps: function (d) {
      return [{
        1: 'Hace directamente el trabajo para el que existe la organización: <strong>sistema 1</strong>.',
        2: 'No manda ni decide objetivos: solo evita que las unidades choquen entre sí. <strong>Sistema 2</strong>.',
        3: 'Gestiona los recursos y los resultados del presente: <strong>sistema 3</strong>.',
        4: 'Mira el entorno y el futuro para preparar la adaptación: <strong>sistema 4</strong>.',
        5: 'Define la identidad y arbitra entre presente y futuro: <strong>sistema 5</strong>.'
      }[d.q]];
    },
    answer: function (d) { return 'Sistema ' + d.q; }
  });

  p.exercise({
    title: 'Cuántos bits quita un informe',
    level: 'medio',
    gen: function (r) {
      var N = r.pick([64, 128, 256, 500, 1000, 1024]), k = r.pick([2, 4, 8, 10, 16]);
      var a = Math.log(N) / Math.LN2, b = Math.log(k) / Math.LN2;
      return { N: N, k: k, a: a, b: b, at: a - b };
    },
    ask: function (d) {
      return 'Una unidad operativa puede encontrarse en ' + d.N + ' situaciones distintas. Su informe semanal a la dirección las resume en ' + d.k +
        ' categorías. ¿Cuántos bits de variedad hay en las situaciones, cuántos llegan en el informe y cuántos bits atenúa el informe? (Dos decimales.)';
    },
    fields: [{ name: 'a', label: 'bits de las situaciones', w: 'tiny' }, { name: 'b', label: 'bits del informe', w: 'tiny' }, { name: 'c', label: 'bits atenuados', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.a, 4), b: U.round(d.b, 4), c: U.round(d.at, 4) }; },
    tol: 0.006,
    errores: [{ si: function (v, d) { return v.a === d.N; }, msg: 'Ese es el número de situaciones. La variedad en bits es su logaritmo en base 2.' }],
    hint: function () { return ['Variedad en bits: $\\log_2$ del número de situaciones. $\\log_2 x = \\dfrac{\\ln x}{\\ln 2}$.', 'Los bits atenuados son la diferencia.']; },
    steps: function (d) {
      return ['Situaciones: $\\log_2 ' + d.N + ' \\approx ' + U.fmt(d.a, 2) + '$ bits.', 'Informe: $\\log_2 ' + d.k + ' \\approx ' + U.fmt(d.b, 2) + '$ bits.',
        'Atenuación: $' + U.fmt(d.a, 2) + ' - ' + U.fmt(d.b, 2) + ' \\approx ' + U.fmt(d.at, 2) + '$ bits, que es $\\log_2 \\frac{' + d.N + '}{' + d.k + '}$.'];
    },
    answer: function (d) { return U.fmt(d.a, 2) + ', ' + U.fmt(d.b, 2) + ' y ' + U.fmt(d.at, 2) + ' bits'; }
  });

  p.exercise({
    title: '¿Da abasto la dirección?',
    level: 'medio',
    gen: function (r) {
      var V = r.int(2, 10) * 100, f = r.pick([5, 10, 20, 25, 50]), C = r.int(1, 10) * 10;
      var sube = V * f / 100;
      return { V: V, f: f, C: C, sube: sube, sin: Math.max(0, sube - C), fmax: 100 * C / V };
    },
    ask: function (d) {
      return 'En las operaciones de una empresa surgen ' + d.V + ' asuntos al día, y sube a la dirección el ' + d.f + ' % de ellos. La dirección puede atender ' + d.C +
        ' al día. ¿Cuántos se quedan sin atender cada día? ¿Qué porcentaje máximo de asuntos podría subir sin que la dirección se desborde? (Dos decimales.)';
    },
    fields: [{ name: 's', label: 'sin atender', w: 'tiny' }, { name: 'm', label: '% máximo', w: 'tiny' }],
    sol: function (d) { return { s: d.sin, m: U.round(d.fmax, 4) }; },
    tol: 0.006,
    errores: [{ si: function (v, d) { return Math.max(0, d.V - d.C) !== d.sin && Math.abs(v.s - Math.max(0, d.V - d.C)) < 1e-9; }, msg: 'No suben todos los asuntos: solo el ' + 'porcentaje indicado. El resto lo resuelven las propias unidades.' }],
    hint: function () { return ['Asuntos que suben: el porcentaje de los que surgen.', 'Para no desbordarse, los que suben no pueden pasar de la capacidad.']; },
    steps: function (d) {
      return ['Suben $' + d.V + '\\cdot ' + U.fmt(d.f / 100, 2) + ' = ' + d.sube + '$ asuntos.',
        d.sin ? 'Sin atender: $' + d.sube + ' - ' + d.C + ' = ' + d.sin + '$.' : 'Como $' + d.sube + ' \\le ' + d.C + '$, no queda ninguno sin atender.',
        'Porcentaje máximo: $100\\cdot\\dfrac{' + d.C + '}{' + d.V + '} \\approx ' + U.fmt(d.fmax, 2) + '$ %.'];
    },
    answer: function (d) { return d.sin + ' sin atender; como máximo ' + U.fmt(d.fmax, 2) + ' %'; }
  });

  p.exercise({
    title: 'Sistemas dentro de sistemas',
    level: 'avanzado',
    gen: function (r) {
      var k = r.int(2, 5), L = r.int(2, 4);
      return { k: k, L: L, n: (Math.pow(k, L + 1) - 1) / (k - 1) };
    },
    ask: function (d) {
      return 'Una organización viable tiene ' + d.k + ' unidades operativas. Cada una es a su vez un sistema viable con ' + d.k + ' unidades, y así sucesivamente, hasta ' +
        d.L + ' niveles por debajo de la organización completa. Contando la organización entera, ¿cuántos sistemas viables hay en total?';
    },
    fields: [{ name: 'n', label: 'sistemas viables', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    errores: [{ si: function (v, d) { return v.n === Math.pow(d.k, d.L); }, msg: 'Esas son solo las unidades del último nivel. La organización entera y cada nivel intermedio también son sistemas viables.' }],
    hint: function (d) { return ['Nivel 0: 1 sistema. Nivel 1: ' + d.k + '. Nivel 2: $' + d.k + '^2$…', 'Es la suma de una [[fn-sucesiones|progresión geométrica]] de razón ' + d.k + '.']; },
    steps: function (d) {
      var t = [];
      for (var i = 0; i <= d.L; i++) t.push(d.k + '^{' + i + '}');
      return ['$' + t.join(' + ') + '$',
        'Suma de la progresión geométrica: $\\dfrac{' + d.k + '^{' + (d.L + 1) + '} - 1}{' + d.k + ' - 1} = ' + d.n + '$.',
        'La estructura recursiva hace que el número de sistemas crezca exponencialmente con la profundidad, y por eso cada nivel tiene que resolver por sí mismo casi todo lo suyo.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.keys([
    'Un sistema viable necesita cinco funciones: operaciones, coordinación, control del presente, inteligencia del futuro e identidad.',
    'Los sistemas 3 y 4 están en tensión, y el 5 los equilibra.',
    'La dirección no puede igualar la variedad de las operaciones: se atenúa lo que sube y se amplifica lo que baja.',
    'El modelo es recursivo: cada unidad operativa es a su vez un sistema viable completo.',
    'Cybersyn (Chile, 1971-1973) intentó aplicarlo a la economía de un país con una red de télex y alarmas que subían de nivel solo si abajo no se resolvían.'
  ]);
});
