/* Tema: Proposiciones y cuantificadores */
Course.topic('lg-proposiciones', function (p) {

  p.puente('Este es el primer tema del curso y no da nada por sabido. En él se aprende a decir con ' +
    'precisión cuándo una frase es cierta, a combinar frases con «y», «o», «no» y «si… entonces», y a ' +
    'negarlas sin equivocarse. Todo lo que viene después —conjuntos, demostraciones, y hasta la ' +
    'probabilidad— usa exactamente estas piezas.', 'Por dónde empezamos');

  p.text('Antes de contar, antes de sumar, antes de cualquier número: ¿qué significa que algo sea ' +
    '<strong>cierto</strong>? Las matemáticas no son un montón de fórmulas, son un edificio de ' +
    'afirmaciones que se sostienen unas a otras. Este bloque trata del cemento.');

  p.text('Una <strong>proposición</strong> es una frase que es verdadera o falsa, pero no las dos ni ' +
    'ninguna de las dos.');

  p.table(['Es proposición', 'No es proposición'],
    [['«7 es primo» (verdadera)', '«¿Qué hora es?» — es una pregunta'],
     ['«2 + 2 = 5» (falsa)', '«¡Cierra la puerta!» — es una orden'],
     ['«Todo par mayor que 2 es suma de dos primos»', '«$x + 1 = 3$» — depende de $x$'],
     ['(no sabemos si es cierta, pero lo es o no lo es)', '«Esta frase es falsa» — se contradice']]);

  p.note('Esa última fila es la <em>paradoja del mentiroso</em>, y no es un juego: paradojas de ese ' +
    'tipo obligaron a refundar las matemáticas a principios del siglo XX. Volverás a encontrarla en ' +
    '[[av-infinito|el tema del infinito]].', null, 'Una frase que rompe el sistema');

  /* ---------------------------------------------------------------- */
  p.section('Conectivas y tablas de verdad');

  p.text('Con proposiciones simples se construyen otras más complejas usando <strong>conectivas</strong>. ' +
    'Lo bueno es que el valor de verdad del resultado depende <em>solo</em> de los valores de las ' +
    'partes, y eso se puede tabular exhaustivamente.');

  p.table(['Símbolo', 'Nombre', 'Se lee', 'Es verdadera cuando…'],
    [['$\\neg p$', 'negación', 'no p', '$p$ es falsa'],
     ['$p \\land q$', 'conjunción', 'p y q', 'las dos lo son'],
     ['$p \\lor q$', 'disyunción', 'p o q', 'al menos una lo es'],
     ['$p \\to q$', 'implicación', 'si p, entonces q', 'salvo si $p$ es verdadera y $q$ falsa'],
     ['$p \\leftrightarrow q$', 'bicondicional', 'p si y solo si q', 'las dos valen lo mismo']]);

  p.note('El «o» de las matemáticas es <strong>inclusivo</strong>: «$p \\lor q$» es verdadera también ' +
    'cuando se cumplen las dos. En castellano decimos «o café o té» excluyendo, pero en lógica hay que ' +
    'decirlo explícitamente.', 'warn');

  p.text('Una <strong>tabla de verdad</strong> recorre todas las combinaciones posibles de las ' +
    'proposiciones simples —con $p$ y $q$ son cuatro filas— y dice qué sale en cada una. Según lo que ' +
    'salga, la fórmula recibe un nombre: si es verdadera en <em>todas</em> las filas es una ' +
    '<strong>tautología</strong> (una ley lógica), si es falsa en todas es una ' +
    '<strong>contradicción</strong>, y si depende de la fila es una <strong>contingencia</strong>.');

  p.demo({
    title: 'Constructor de tablas de verdad',
    intro: 'Elige una fórmula y mira su tabla completa. Las filas verdaderas se marcan en verde: si lo son todas, la fórmula es una tautología.',
    predice: 'De las cuatro filas de $p \\to q$, ¿cuántas crees que saldrán verdaderas? ¿Y de $p \\lor \\neg p$? Apuesta un número antes de mirar.',
    build: function (host, d) {
      var idx = 0;
      var fs = [
        { t: 'p \\land q', f: function (a, b) { return a && b; }, n: 'conjunción' },
        { t: 'p \\lor q', f: function (a, b) { return a || b; }, n: 'disyunción' },
        { t: 'p \\to q', f: function (a, b) { return !a || b; }, n: 'implicación' },
        { t: 'p \\leftrightarrow q', f: function (a, b) { return a === b; }, n: 'bicondicional' },
        { t: '\\neg(p \\land q)', f: function (a, b) { return !(a && b); }, n: 'negación de la conjunción' },
        { t: '\\neg p \\lor \\neg q', f: function (a, b) { return !a || !b; }, n: 'De Morgan: coincide con la anterior' },
        { t: 'p \\lor \\neg p', f: function (a) { return a || !a; }, n: 'tercio excluso: siempre verdadera' },
        { t: 'p \\land \\neg p', f: function (a) { return a && !a; }, n: 'contradicción: siempre falsa' },
        { t: '(p \\to q) \\land (q \\to p)', f: function (a, b) { return (!a || b) && (!b || a); }, n: 'equivale al bicondicional' }
      ];
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var F = fs[idx];
        var filas = [[true, true], [true, false], [false, true], [false, false]];
        var ciertas = 0;
        var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr>' +
          '<th>' + MathX.render('p') + '</th><th>' + MathX.render('q') + '</th>' +
          '<th>' + MathX.render(F.t) + '</th></tr></thead><tbody>';
        filas.forEach(function (r) {
          var v = F.f(r[0], r[1]);
          if (v) ciertas++;
          h += '<tr>' +
            '<td style="font-family:var(--mono)">' + (r[0] ? 'V' : 'F') + '</td>' +
            '<td style="font-family:var(--mono)">' + (r[1] ? 'V' : 'F') + '</td>' +
            '<td style="font-family:var(--mono);font-weight:700;color:' +
            (v ? 'var(--ok)' : 'var(--bad)') + '">' + (v ? 'V' : 'F') + '</td></tr>';
        });
        h += '</tbody></table></div>';
        caja.innerHTML = h;
        out.set('<strong>' + F.n + '</strong> — verdadera en <strong>' + ciertas + '</strong> de las 4 ' +
          'combinaciones posibles.<br>' +
          (ciertas === 4 ? '<span style="color:var(--ok)">Verdadera siempre: es una <strong>tautología</strong>.</span>'
            : (ciertas === 0 ? '<span style="color:var(--bad)">Falsa siempre: es una <strong>contradicción</strong>.</span>'
              : 'Ni tautología ni contradicción: su verdad depende de $p$ y $q$.')));
      }
      W.chips(host, fs.map(function (F, i) { return { label: '$' + F.t + '$', value: i }; }),
        { value: 0, on: function (v) { idx = v; pinta(); } });
      pinta();
    }
  });

  p.sub('Leyes de De Morgan');
  p.text('Hay dos reglas para negar que se usan constantemente y que casi todo el mundo aplica mal en el ' +
    'lenguaje corriente. Piensa en la frase «llueve y hace frío». ¿Cómo se niega? Mucha gente ' +
    'responde «no llueve y no hace frío», y es falso: para que la frase original sea mentira basta ' +
    'con que falle <em>una</em> de las dos cosas. La negación correcta es «no llueve ' +
    '<strong>o</strong> no hace frío». Al negar, la «y» se convierte en «o» y viceversa.');


  p.formulas([
    '\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q',
    '\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q'
  ]);

  p.text('En palabras: <em>«no es cierto que llueva y haga frío»</em> equivale a <em>«o no llueve o no ' +
    'hace frío»</em>. Al negar, la «y» se convierte en «o» y viceversa. Es de las reglas más útiles ' +
    'que existen, y volverá a aparecer en conjuntos y en probabilidad.');

  p.comprueba('¿Cuál es la negación de «he aprobado matemáticas <strong>y</strong> he aprobado física»?', [
    { t: 'He suspendido matemáticas y he suspendido física', ok: false, por: 'Eso es más de lo necesario. Para que la frase original sea mentira basta con que falle <em>una</em> de las dos asignaturas.' },
    { t: 'He suspendido matemáticas o he suspendido física', ok: true, por: 'De Morgan: al negar una «y» sale una «o». Con un solo suspenso la frase original ya es falsa.' },
    { t: 'No he aprobado ninguna de las dos', ok: false, por: 'Es lo mismo que la primera opción, dicho de otra forma: exige dos suspensos, cuando con uno basta.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.util('Una tabla de verdad no es un ejercicio de clase: es el plano de un circuito. Dentro de ' +
    'cualquier procesador hay miles de millones de puertas <strong>Y</strong>, <strong>O</strong> y ' +
    '<strong>NO</strong> hechas de transistores, y lo que hacen es exactamente lo que acabas de ' +
    'rellenar en esas tablas. Lo mismo ocurre cada vez que filtras: al buscar <em>«piso Y (Madrid O ' +
    'Barcelona) Y NO planta baja»</em> estás escribiendo una proposición compuesta, y el buscador la ' +
    'evalúa igual que tú.');

  p.note('Ese plano se puede montar. En [[maq-puertas|el bloque de máquinas y lenguajes]] las mismas ' +
    'conectivas se escriben como circuito y se prueban con conmutadores, y aparece un resultado que ' +
    'no se ve desde aquí: <strong>una sola puerta basta para todas</strong>. Con «no (a y b)» repetida ' +
    'se construyen el «no», el «y» y el «o», y por eso los chips se fabrican con una única pieza ' +
    'repetida mil millones de veces.', null, 'De la tabla al circuito');

  p.section('La implicación y sus parientes');

  p.text('$p \\to q$ es la conectiva más importante y la que peor se entiende. Solo es <strong>falsa ' +
    'en un caso</strong>: cuando $p$ es verdadera y $q$ falsa. Si $p$ es falsa, la implicación es ' +
    'verdadera pase lo que pase.');

  p.demo({
    title: '¿Cuándo miente una promesa?',
    intro: '«Si apruebas, te regalo la bici». Cambia lo que ha pasado de verdad y decide si la promesa se ha roto.',
    predice: 'Si <em>no</em> aprueba y aun así le regalan la bici, ¿se ha roto la promesa? Decide antes de pulsar.',
    build: function (host, d) {
      var apruebo = true, regalo = true;
      var out = W.readout(host, '');
      function paint() {
        var cumplida = !apruebo || regalo;
        out.innerHTML =
          '<div style="font-size:0.9375rem;margin-bottom:8px">Promesa: <em>«si apruebas ($p$), te regalo la bici ($q$)»</em></div>' +
          '<div>Ha aprobado: <strong>' + (apruebo ? 'SÍ' : 'NO') + '</strong> &nbsp;·&nbsp; ' +
          'Le he regalado la bici: <strong>' + (regalo ? 'SÍ' : 'NO') + '</strong></div>' +
          '<div style="margin-top:8px;font-size:1rem;color:' + (cumplida ? 'var(--ok)' : 'var(--bad)') + '">' +
          '<strong>' + (cumplida ? 'La promesa NO se ha roto' : 'La promesa SE HA ROTO') + '</strong> → ' +
          MathX.inline('$p \\to q$') + ' es <strong>' + (cumplida ? 'verdadera' : 'falsa') + '</strong></div>' +
          '<div style="margin-top:6px;font-size:0.7812rem;color:var(--ink-faint)">' +
          (!apruebo
            ? 'Si no aprueba, la promesa no dice nada sobre lo que debe pasar: no puede haberse roto, ' +
              'le regale la bici o no. Por eso una implicación con premisa falsa es <em>siempre</em> verdadera.'
            : (regalo ? 'Aprobó y recibió la bici: promesa cumplida.'
              : 'Este es el <strong>único</strong> caso en que la promesa se rompe.')) + '</div>';
      }
      W.chips(host, [{ label: 'aprueba', value: 'p' }, { label: 'recibe la bici', value: 'q' }],
        {
          toggle: false, on: function (v) {
            if (v === 'p') apruebo = !apruebo; else regalo = !regalo;
            paint();
          }
        });
      W.hint(host, 'Pulsa los botones para cambiar cada hecho.');
      paint();
    }
  });

  p.text('A partir de $p \\to q$ se forman otras tres proposiciones, y distinguirlas es fundamental:');

  p.table(['Nombre', 'Fórmula', '¿Equivale a la original?'],
    [['Directa', '$p \\to q$', '—'],
     ['Recíproca', '$q \\to p$', '<strong style="color:var(--bad)">NO</strong>'],
     ['Contraria', '$\\neg p \\to \\neg q$', '<strong style="color:var(--bad)">NO</strong>'],
     ['Contrarrecíproca', '$\\neg q \\to \\neg p$', '<strong style="color:var(--ok)">SÍ, siempre</strong>']]);

  p.note('«Si llueve, la calle está mojada» es cierto. Su recíproco, «si la calle está mojada, ' +
    'llueve», <strong>no lo es</strong> (pudo pasar el camión de riego). En cambio, su ' +
    'contrarrecíproco, «si la calle no está mojada, no llueve», es <strong>necesariamente</strong> ' +
    'cierto. Esa equivalencia es lo que hace posible el método de demostración por contrarrecíproco.',
    'ok', 'Confundir una implicación con su recíproca es el error lógico más común');

  p.ejemplo({
    title: 'Evaluar una fórmula compuesta',
    enunciado: 'Con $p$ verdadera y $q$ falsa, ¿qué valor tiene $(p \\to q) \\lor \\neg p$? Se resuelve de dentro afuera, una conectiva cada vez.',
    pasos: [
      'Primero lo de dentro del paréntesis: $p \\to q$ con $p = V$ y $q = F$. Es justo el único caso en que una implicación falla: $p \\to q = F$.',
      { t: 'Después la negación: $\\neg p$ con $p = V$ da $F$.', antes: '¿Qué vale $\\neg p$ si $p$ es verdadera?' },
      { t: 'Por último, la conectiva de fuera: $F \\lor F$. Una disyunción solo es verdadera si al menos una parte lo es, así que da $F$.', antes: 'Ya tienes $F \\lor F$. ¿Verdadero o falso?' }
    ],
    cierre: 'El orden importa: se evalúa lo más interior primero, como en una operación con paréntesis. Con $p = F$ el resultado habría sido $V$, porque $\\neg p$ sería verdadera.'
  });

  p.comprueba('«Si un número es múltiplo de 4, entonces es par.» ¿Cuál de estas frases equivale a ella?', [
    { t: 'Si un número es par, entonces es múltiplo de 4', ok: false, por: 'Es la recíproca, y aquí es falsa: el 6 es par y no es múltiplo de 4.' },
    { t: 'Si un número no es par, entonces no es múltiplo de 4', ok: true, por: 'Es la contrarrecíproca: se niegan las dos partes <em>y</em> se intercambian. Siempre equivale a la original.' },
    { t: 'Si un número no es múltiplo de 4, entonces no es par', ok: false, por: 'Es la contraria: se niegan las dos partes sin intercambiarlas. No equivale, y de hecho es falsa (el 6).' }
  ]);

  /* ---------------------------------------------------------------- */
  p.util('Confundir una implicación con su recíproca es el error que más caro sale fuera del aula. Una ' +
    'prueba médica cumple <em>«si estás enfermo, da positivo»</em>; eso <strong>no</strong> ' +
    'significa <em>«si da positivo, estás enfermo»</em>. Con una enfermedad rara, la mayoría de los ' +
    'positivos pueden ser falsos aunque la prueba sea buenísima. Lo que sí es siempre válido es la ' +
    'contrarrecíproca: <em>«si da negativo, no estás enfermo»</em>. Volverás a esto, con números, en ' +
    'probabilidad condicionada.');

  p.section('Cuantificadores');

  p.text('«$x + 1 = 3$» no es una proposición: depende de $x$. Se llama <em>predicado</em>, y se ' +
    'convierte en proposición cuantificándolo, es decir, diciendo <strong>de cuántos</strong> objetos ' +
    'se afirma.');

  p.formulas([
    '\\forall x \\in A : P(x) \\quad \\text{para todo } x \\text{ de } A \\text{ se cumple } P',
    '\\exists x \\in A : P(x) \\quad \\text{existe algún } x \\text{ de } A \\text{ que cumple } P'
  ], 'los dos cuantificadores',
    'La A del revés, $\\forall$, se dice «para todo»; la E del revés, $\\exists$, se dice «existe». ' +
      'Vienen del inglés <em>All</em> y <em>Exists</em>, y por eso están giradas.<br><br>Se leen: ' +
      '<em>«para todo equis perteneciente a A se cumple pe de equis»</em> y <em>«existe algún equis de ' +
      'A tal que pe de equis»</em>.<br><br>$P(x)$ es simplemente «la propiedad que se afirma de ' +
      'equis»: puede ser «es par», «aprueba» o lo que haga falta.');

  p.hist('Aristóteles fundó la lógica en el siglo IV a. C. y durante más de dos mil años nadie la mejoró ' +
    'de forma sustancial; Kant llegó a escribir que estaba acabada y cerrada. Se equivocó. En 1847 ' +
    'George Boole publicó un libro con un título revelador, <em>El análisis matemático del ' +
    'pensamiento</em>, donde convirtió el razonamiento en álgebra: verdadero era 1, falso era 0, y ' +
    'las conectivas eran operaciones. Nadie le vio aplicación práctica. Noventa años después, un ' +
    'estudiante llamado Claude Shannon se dio cuenta de que aquellos ceros y unos describían ' +
    'exactamente los circuitos de interruptores, y escribió con esa idea la tesis de máster más ' +
    'influyente de la historia.');

  p.sub('Negar un cuantificador');
  p.text('Con los cuantificadores pasa lo mismo y es igual de práctico. Para tumbar la afirmación «todos ' +
    'los alumnos han aprobado» no hace falta demostrar que ha suspendido todo el mundo: basta con ' +
    'encontrar <strong>uno</strong> que haya suspendido. Y para tumbar «existe algún alumno que ha ' +
    'copiado» sí hay que garantizar que <em>ninguno</em> lo ha hecho. Negar cambia el cuantificador ' +
    'por el otro y niega lo de dentro.');


  p.formulas([
    '\\neg\\left(\\forall x : P(x)\\right) \\equiv \\exists x : \\neg P(x)',
    '\\neg\\left(\\exists x : P(x)\\right) \\equiv \\forall x : \\neg P(x)'
  ], 'la negación intercambia los cuantificadores',
    'El símbolo $\\neg$ se lee «no» y $\\equiv$ se lee «es equivalente a», es decir, «significa ' +
      'exactamente lo mismo».<br><br>Se dice: <em>«no, para todo equis, pe de equis, es equivalente a: ' +
      'existe un equis tal que no pe de equis»</em>.<br><br>Con un ejemplo: negar <em>«todos han ' +
      'aprobado»</em> no es <em>«todos han suspendido»</em>, sino <em>«hay alguien que ha ' +
      'suspendido»</em>. Al negar, el «para todo» se convierte en «existe» y la propiedad de dentro se ' +
      'niega.');

  p.text('Para negar «<em>todos los cisnes son blancos</em>» no hace falta decir que ninguno lo es: ' +
    'basta con <strong>un solo cisne negro</strong>. Esa asimetría es enorme y estructura toda la ' +
    'práctica matemática: para tumbar un «para todo» basta un contraejemplo; para demostrarlo hace ' +
    'falta un argumento general.');

  p.note('El <strong>orden importa</strong>. «$\\forall x\\, \\exists y : y > x$» es cierto en ' +
    '$\\mathbb{N}$ (todo número tiene otro mayor). «$\\exists y\\, \\forall x : y > x$» dice que hay ' +
    'un número mayor que todos, y es falso. Las mismas palabras en distinto orden significan cosas ' +
    'muy distintas.', 'warn', 'Cuantificadores anidados');

  p.trampas([
    { e: 'Negar «todos» con «ninguno»', por: 'La negación de «todos los números son pares» es «alguno no es par», no «ninguno es par». Basta un contraejemplo para negar un «todos».' },
    { e: 'Leer una implicación como equivalencia', por: '«Si llueve, me mojo» no dice que si me mojo, llueva: puede ser la ducha. El recíproco es otra afirmación, y hay que demostrarlo aparte.' },
    { e: 'Dar por falsa una implicación con antecedente falso', por: '«Si 2 es impar, entonces 3 es par» es verdadera: de algo falso se sigue cualquier cosa. La implicación solo falla con antecedente verdadero y consecuente falso.' },
    { e: 'Leer «o» como exclusivo', por: 'En matemáticas «p o q» es verdadero también cuando lo son las dos. «$x < 5$ o $x > 2$» lo cumplen todos los números.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Los cuantificadores son la letra pequeña de los contratos y de los programas. <em>«Todos los ' +
    'pedidos se entregan en 24 h»</em> se rompe con <strong>un</strong> contraejemplo; <em>«existe ' +
    'algún envío gratuito»</em> se cumple con <strong>uno</strong>. Por eso negar bien un ' +
    'cuantificador es la herramienta diaria de quien prueba software: para tumbar un «para todo» no ' +
    'hace falta demostrar nada, basta con encontrar el caso que falla.');

  p.section('Practica');

  p.exercise({
    title: 'Valor de verdad de una fórmula',
    level: 'basico',
    gen: function (r) {
      var pv = r.bool(), qv = r.bool();
      var fs = [
        { t: 'p \\land q', f: function (a, b) { return a && b; } },
        { t: 'p \\lor q', f: function (a, b) { return a || b; } },
        { t: 'p \\to q', f: function (a, b) { return !a || b; } },
        { t: 'q \\to p', f: function (a, b) { return !b || a; } },
        { t: '\\neg p \\lor q', f: function (a, b) { return !a || b; } },
        { t: '\\neg(p \\land q)', f: function (a, b) { return !(a && b); } },
        { t: 'p \\leftrightarrow q', f: function (a, b) { return a === b; } },
        { t: '(p \\lor q) \\land \\neg p', f: function (a, b) { return (a || b) && !a; } }
      ];
      var F = r.pick(fs);
      return { pv: pv, qv: qv, t: F.t, val: F.f(pv, qv) };
    },
    ask: function (d) {
      return 'Si $p$ es <strong>' + (d.pv ? 'verdadera' : 'falsa') + '</strong> y $q$ es ' +
        '<strong>' + (d.qv ? 'verdadera' : 'falsa') + '</strong>, ¿qué valor tiene $' + d.t + '$?';
    },
    fields: [{ name: 'v', label: 'Valor', opts: [{ t: 'Verdadera', v: 'V' }, { t: 'Falsa', v: 'F' }] }],
    sol: function (d) { return { v: d.val ? 'V' : 'F' }; },
    hint: function () { return ['Evalúa primero lo de dentro de los paréntesis y las negaciones, y al final la conectiva de fuera.', 'La implicación solo es falsa cuando la premisa es verdadera y la conclusión falsa.']; },
    steps: function (d) {
      return ['$p$ vale ' + (d.pv ? 'V' : 'F') + ' y $q$ vale ' + (d.qv ? 'V' : 'F') + '.',
        'Sustituimos en la fórmula y aplicamos las reglas de cada conectiva.',
        'Resultado: <strong>' + (d.val ? 'verdadera' : 'falsa') + '</strong>.'];
    },
    answer: function (d) { return d.val ? 'Verdadera (V)' : 'Falsa (F)'; }
  });

  p.exercise({
    title: 'Recíproco y contrarrecíproco',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { p: 'llueve', q: 'la calle está mojada' },
        { p: 'un número acaba en 0', q: 'es múltiplo de 5' },
        { p: 'un número es múltiplo de 4', q: 'es par' },
        { p: 'un triángulo es equilátero', q: 'es isósceles' },
        { p: 'hace sol', q: 'salgo a pasear' },
        { p: 'un polígono es un cuadrado', q: 'tiene cuatro lados' }
      ];
      var c = r.pick(casos);
      var cual = r.int(0, 2);
      return { p: c.p, q: c.q, cual: cual };
    },
    ask: function (d) {
      var nom = ['<strong>recíproca</strong>', '<strong>contraria</strong>', '<strong>contrarrecíproca</strong>'][d.cual];
      return 'Dada la implicación «si ' + d.p + ', entonces ' + d.q + '», ¿cuál es su ' + nom + '?';
    },
    fields: function (d) {
      return [{ name: 'r', label: 'Es', opts: [
        { t: 'si ' + d.q + ', entonces ' + d.p, v: '1' },
        { t: 'si no ' + d.p + ', entonces no ' + d.q, v: '2' },
        { t: 'si no ' + d.q + ', entonces no ' + d.p, v: '3' }] }];
    },
    sol: function (d) { return { r: String(d.cual + 1) }; },
    hint: function () { return ['Recíproca: se le da la vuelta. Contraria: se niegan las dos partes.', 'Contrarrecíproca: se niegan las dos partes <em>y</em> se le da la vuelta.']; },
    steps: function (d) {
      return ['Recíproca: se intercambian premisa y conclusión → «si ' + d.q + ', entonces ' + d.p + '».',
        'Contraria: se niegan las dos, sin intercambiar → «si no ' + d.p + ', entonces no ' + d.q + '».',
        'Contrarrecíproca: se niegan las dos <em>y</em> se intercambian → «si no ' + d.q + ', entonces no ' + d.p + '».',
        'Recuerda: solo la <strong>contrarrecíproca</strong> equivale siempre a la original.'];
    },
    answer: function (d) { return [ 'si ' + d.q + ', entonces ' + d.p, 'si no ' + d.p + ', entonces no ' + d.q, 'si no ' + d.q + ', entonces no ' + d.p][d.cual]; }
  });

  p.exercise({
    title: 'Negar una proposición cuantificada',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Todos los alumnos han aprobado', n: 'Existe algún alumno que no ha aprobado', mal: 'Ningún alumno ha aprobado', tipo: 0 },
        { t: 'Algún número primo es par', n: 'Ningún número primo es par', mal: 'Algún número primo es impar', tipo: 1 },
        { t: 'Todo número real tiene raíz cuadrada real', n: 'Existe un número real sin raíz cuadrada real', mal: 'Ningún número real tiene raíz cuadrada real', tipo: 0 },
        { t: 'Existe un triángulo con dos ángulos rectos', n: 'Ningún triángulo tiene dos ángulos rectos', mal: 'Existe un triángulo sin dos ángulos rectos', tipo: 1 },
        { t: 'Todas las funciones continuas son derivables', n: 'Existe una función continua que no es derivable', mal: 'Ninguna función continua es derivable', tipo: 0 },
        { t: 'Algún cuadrilátero tiene los lados iguales', n: 'Ningún cuadrilátero tiene los lados iguales', mal: 'Algún cuadrilátero no tiene los lados iguales', tipo: 1 }
      ];
      var c = r.pick(casos);
      var correcta = r.bool() ? 1 : 2;
      return { t: c.t, n: c.n, mal: c.mal, tipo: c.tipo, correcta: correcta };
    },
    ask: function (d) { return '¿Cuál es la negación de «<em>' + d.t + '</em>»?'; },
    fields: function (d) {
      var op1 = d.correcta === 1 ? d.n : d.mal;
      var op2 = d.correcta === 1 ? d.mal : d.n;
      return [{ name: 'r', label: 'Negación', opts: [{ t: op1, v: '1' }, { t: op2, v: '2' }] }];
    },
    sol: function (d) { return { r: String(d.correcta) }; },
    errores: [{ si: function (v, d) { return v.raw.r && v.raw.r !== String(d.correcta); }, msg: 'Esa es la trampa habitual: negar «todos» con «ninguno», o «alguno» con «alguno no». La negación de «todos» es «alguno no»; la de «alguno» es «ninguno».' }],
    hint: function (d) {
      return d.tipo === 0
        ? 'Para negar un «para todo» basta con <strong>un</strong> contraejemplo: se convierte en «existe alguno que no».'
        : 'Negar un «existe» sí obliga a hablar de todos: se convierte en «ninguno».';
    },
    steps: function (d) {
      return ['$\\neg(\\forall x: P) \\equiv \\exists x: \\neg P$ &nbsp;y&nbsp; $\\neg(\\exists x: P) \\equiv \\forall x: \\neg P$.',
        d.tipo === 0
          ? 'La frase es un «para todo», así que su negación es un «existe alguno que no».'
          : 'La frase es un «existe», así que su negación es un «ninguno», es decir, «todos cumplen lo contrario».',
        'Negación correcta: <strong>' + d.n + '</strong>.',
        'Fíjate en que la negación de «todos aprueban» <em>no</em> es «todos suspenden»: con uno basta.'];
    },
    answer: function (d) { return d.n; }
  });

  p.exercise({
    title: '¿Tautología, contradicción o contingencia?',
    level: 'avanzado',
    gen: function (r) {
      var fs = [
        { t: 'p \\lor \\neg p', f: function (a) { return a || !a; } },
        { t: 'p \\land \\neg p', f: function (a) { return a && !a; } },
        { t: '(p \\to q) \\lor (q \\to p)', f: function (a, b) { return (!a || b) || (!b || a); } },
        { t: 'p \\to (p \\lor q)', f: function (a, b) { return !a || (a || b); } },
        { t: '(p \\land q) \\to p', f: function (a, b) { return !(a && b) || a; } },
        { t: 'p \\land q', f: function (a, b) { return a && b; } },
        { t: 'p \\to q', f: function (a, b) { return !a || b; } },
        { t: '\\neg(p \\to p)', f: function (a) { return !(!a || a); } },
        { t: '(p \\to q) \\leftrightarrow (\\neg q \\to \\neg p)', f: function (a, b) { return (!a || b) === (b || !a); } }
      ];
      var F = r.pick(fs);
      var n = 0;
      [[true, true], [true, false], [false, true], [false, false]].forEach(function (c) {
        if (F.f(c[0], c[1])) n++;
      });
      return { t: F.t, n: n, tipo: n === 4 ? 1 : (n === 0 ? 2 : 3) };
    },
    ask: function (d) { return 'Clasifica la fórmula $' + d.t + '$ construyendo su tabla de verdad.'; },
    fields: [{ name: 't', label: 'Es una', opts: [{ t: 'tautología (siempre V)', v: '1' }, { t: 'contradicción (siempre F)', v: '2' }, { t: 'contingencia (depende)', v: '3' }] }],
    sol: function (d) { return { t: String(d.tipo) }; },
    hint: function () { return 'Hay 4 combinaciones posibles de $p$ y $q$. Evalúa la fórmula en cada una y cuenta cuántas dan verdadero.'; },
    steps: function (d) {
      return ['Construimos la tabla con las 4 combinaciones de $p$ y $q$.',
        'La fórmula resulta verdadera en <strong>' + d.n + '</strong> de las 4 filas.',
        d.tipo === 1 ? 'Verdadera en todas: es una <strong>tautología</strong>. Las tautologías son las leyes lógicas: valen siempre.'
          : (d.tipo === 2 ? 'Falsa en todas: es una <strong>contradicción</strong>.'
            : 'Ni siempre ni nunca: es una <strong>contingencia</strong>, su verdad depende de los datos.')];
    },
    answer: function (d) {
      return ['', 'Tautología', 'Contradicción', 'Contingencia'][d.tipo] + ' (' + d.n + ' de 4 filas verdaderas)';
    }
  });

  p.keys([
    'Proposición = frase que es verdadera o falsa, sin ambigüedad.',
    'El «o» matemático es inclusivo.',
    '$p \\to q$ solo es falsa cuando $p$ es verdadera y $q$ falsa. Premisa falsa ⟹ implicación verdadera.',
    'La <strong>contrarrecíproca</strong> equivale siempre a la original; la recíproca <strong>no</strong>.',
    'De Morgan: al negar, «y» se convierte en «o» y viceversa.',
    'Negar un «para todo» da un «existe alguno que no»: por eso un contraejemplo tumba una afirmación general.',
    'El orden de los cuantificadores cambia el significado.'
  ]);
});
