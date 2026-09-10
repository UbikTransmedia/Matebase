/* Tema: Teoremas del seno y del coseno */
Course.topic('tr-teoremas', function (p) {

  p.puente('Las razones trigonométricas se definieron en el triángulo <em>rectángulo</em>. ¿Y si el ' +
    'triángulo no tiene ningún ángulo recto? Hay dos teoremas que resuelven cualquier triángulo, ' +
    'tenga la forma que tenga. Uno generaliza Pitágoras; el otro sale de la fórmula del área con el ' +
    'seno. Y la regla de que los tres ángulos suman $180^\\circ$ vuelve a ser el dato gratis.');

  p.section('Teorema del seno');
  p.text('Hasta ahora todo lo que sabes de trigonometría exige un ángulo recto. El problema es que la ' +
    'mayoría de los triángulos del mundo no lo tienen: una parcela, la vela de un barco, tres ' +
    'antenas de telefonía. Los dos teoremas de este tema son los que quitan esa restricción, y con ' +
    'ellos se puede resolver <strong>cualquier</strong> triángulo. El primero relaciona cada lado ' +
    'con el ángulo que tiene enfrente, y dice algo muy razonable: a mayor ángulo, mayor lado ' +
    'opuesto, y además la proporción entre ambos es la misma para los tres.');


  p.formula('\\frac{a}{\\operatorname{sen} A} = \\frac{b}{\\operatorname{sen} B} = \\frac{c}{\\operatorname{sen} C} = 2R',
    'a, b, c son los lados opuestos a los ángulos A, B, C');

  p.text('Cada lado es proporcional al seno de su ángulo opuesto, y la constante de proporcionalidad ' +
    'es el diámetro de la circunferencia que pasa por los tres vértices. Se usa cuando conoces ' +
    '<strong>un lado con su ángulo opuesto</strong>.');

  p.comprueba('En un triángulo, $A = 30^\\circ$, $B = 90^\\circ$ y $a = 5$. ¿Cuánto mide $b$?', [
    { t: '$2{,}5$', ok: false, por: 'Al revés: $b$ está frente al ángulo mayor, así que es el lado mayor. $b = \\dfrac{5\\cdot\\operatorname{sen} 90^\\circ}{\\operatorname{sen} 30^\\circ} = \\dfrac{5}{0{,}5} = 10$.' },
    { t: '$10$', ok: true, por: '$\\dfrac{5}{\\operatorname{sen} 30^\\circ} = \\dfrac{b}{\\operatorname{sen} 90^\\circ} \\Rightarrow b = 10$. Es el triángulo rectángulo de $30^\\circ$: el cateto opuesto es la mitad de la hipotenusa.' },
    { t: '$5$', ok: false, por: 'Lados iguales exigirían ángulos iguales. $B = 90^\\circ$ es mucho mayor que $A$, así que $b > a$.' }
  ]);

  p.section('Teorema del coseno');
  p.text('El teorema del seno falla cuando no conoces ningún par «lado con su ángulo opuesto»; por ' +
    'ejemplo, si te dan dos lados y el ángulo que forman entre ellos. Para ese caso está el segundo ' +
    'teorema, y conviene mirarlo con atención porque es un viejo conocido disfrazado: es el ' +
    '<strong>teorema de Pitágoras con un término de corrección</strong>. Si el ángulo mide 90°, su ' +
    'coseno vale cero, ese término desaparece y queda exactamente $a^2=b^2+c^2$.');


  p.formula('a^2 = b^2 + c^2 - 2bc\\cos A', 'teorema del coseno');

  p.note('Mira bien esa fórmula: si $A = 90^\\circ$, entonces $\\cos A = 0$ y queda $a^2 = b^2+c^2$. ' +
    'Es <strong>Pitágoras</strong>. El teorema del coseno es la generalización de Pitágoras a ' +
    'triángulos cualesquiera, y el término $-2bc\\cos A$ es exactamente la corrección que hace falta ' +
    'cuando el ángulo no es recto.', 'ok', 'Pitágoras es un caso particular');

  p.demo({
    title: 'Del triángulo rectángulo al general',
    intro: 'Cambia el ángulo A y mira cómo el teorema del coseno corrige a Pitágoras. Cuando A vale 90°, la corrección desaparece.',
    predice: 'Con $b = 4$ y $c = 3$, Pitágoras daría $a = 5$. Si abres el ángulo $A$ por encima de $90^\\circ$, ¿el lado $a$ será mayor o menor que 5? ¿Qué signo tendrá $\\cos A$?',
    build: function (host, d) {
      var A = 90, b = 4, c = 3;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -5.5, xmax: 6, ymin: -1.5, ymax: 5.5, height: 330,
        grid: true, axes: false,
        draw: function (g) {
          var ra = A * Math.PI / 180;
          var V = [0, 0], C = [c, 0], B = [b * Math.cos(ra), b * Math.sin(ra)];
          g.poly([V, C, B], { color: 0, fill: 0, fillAlpha: .14, w: 2.4 });
          g.arc(0, 0, 0.8, 0, ra, { color: 2, w: 2.2, fill: 2, fillAlpha: .2 });
          g.text(1.15 * Math.cos(ra / 2), 1.15 * Math.sin(ra / 2), U.fmt(A, 0) + '°',
            { align: 'center', color: 2, size: 13 });
          g.text(c / 2, -0.35, 'c = ' + c, { align: 'center', size: 12, color: 'ink' });
          g.text(B[0] / 2 - 0.35, B[1] / 2, 'b = ' + b, { align: 'right', size: 12, color: 'ink' });
          var a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(ra));
          g.text((B[0] + c) / 2 + 0.3, B[1] / 2, 'a = ' + U.fmt(a, 3), { align: 'left', size: 12, color: 1, box: true });
        }
      });
      function paint() {
        var ra = A * Math.PI / 180;
        var a2 = b * b + c * c - 2 * b * c * Math.cos(ra);
        var pit = b * b + c * c;
        out.set('$a^2 = b^2 + c^2 - 2bc\\cos A = ' + pit + ' - ' + U.fmt(2 * b * c * Math.cos(ra), 4) +
          ' = ' + U.fmt(a2, 4) + '$<br>' +
          '$a = ' + U.fmt(Math.sqrt(a2), 4) + '$ &nbsp;·&nbsp; ' +
          (Math.abs(A - 90) < 0.01
            ? '<strong style="color:var(--ok)">Con $A = 90^\\circ$ la corrección vale cero: esto es Pitágoras.</strong>'
            : 'Pitágoras daría $' + U.fmt(Math.sqrt(pit), 4) + '$: se equivocaría en $' +
              U.fmt(Math.abs(Math.sqrt(pit) - Math.sqrt(a2)), 4) + '$.'));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'ángulo A', min: 15, max: 165, step: 5, value: A, dec: 0, on: function (v) { A = v; paint(); } });
      W.slider(row, { label: 'lado b', min: 1, max: 5, step: 0.5, value: b, dec: 1, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'lado c', min: 1, max: 5, step: 0.5, value: c, dec: 1, on: function (v) { c = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.hist('El teorema del coseno aparece, sin trigonometría y en forma puramente geométrica, en las ' +
    'proposiciones 12 y 13 del Libro II de los <em>Elementos</em> de Euclides. Euclides no tenía la ' +
    'palabra coseno ni el concepto de función, así que lo enunció como una relación entre áreas de ' +
    'rectángulos. Hicieron falta mil ochocientos años y la trigonometría árabe y persa para ' +
    'escribirlo en la línea que hoy cabe en un renglón.');

  p.section('¿Cuál de los dos uso?');
  p.text('Con dos teoremas disponibles, la duda ya no es cómo aplicarlos sino cuál toca. La regla es ' +
    'sencilla y depende solo de los datos que te den: si entre ellos hay <strong>un lado y el ángulo ' +
    'que tiene enfrente</strong>, el del seno resuelve; si no lo hay, el del coseno. Esta tabla ' +
    'recoge los cuatro casos que pueden aparecer.');


  p.table(['Datos que tengo', 'Teorema', 'Nombre del caso'],
    [['Dos ángulos y un lado', 'del <strong>seno</strong>', 'AAL'],
     ['Dos lados y el ángulo opuesto a uno', 'del <strong>seno</strong> (ojo, caso ambiguo)', 'LLA'],
     ['Dos lados y el ángulo entre ellos', 'del <strong>coseno</strong>', 'LAL'],
     ['Los tres lados', 'del <strong>coseno</strong> (despejando el coseno)', 'LLL']]);

  p.note('En el caso LLA puede haber <strong>dos triángulos distintos</strong> que cumplan los datos, ' +
    'porque un seno positivo corresponde a dos ángulos ($\\alpha$ y $180^\\circ-\\alpha$). Siempre hay ' +
    'que comprobar si la segunda opción es compatible con que los tres ángulos sumen $180^\\circ$.',
    'warn', 'El caso ambiguo');

  p.ejemplo({
    title: 'Resolver un triángulo LAL de principio a fin',
    enunciado: 'Un triángulo tiene $b = 5$, $c = 7$ y el ángulo entre ellos $A = 60^\\circ$. Hallar $a$, $B$ y $C$.',
    pasos: [
      { t: '<strong>Elegir teorema.</strong> Dos lados y el ángulo <em>entre</em> ellos: no hay ningún lado con su ángulo opuesto, así que empieza el del coseno.', antes: 'Con dos lados y el ángulo que forman, ¿seno o coseno?' },
      { t: '<strong>El lado $a$.</strong> $a^2 = 25 + 49 - 2\\cdot 5\\cdot 7\\cdot\\cos 60^\\circ = 74 - 35 = 39$, luego $a = \\sqrt{39} \\approx 6{,}245$.' },
      { t: '<strong>Un segundo ángulo.</strong> Ahora sí hay un lado con su opuesto ($a$ y $A$): teorema del seno. Conviene buscar el ángulo opuesto al lado <em>menor</em>, $b = 5$, porque seguro que es agudo y no hay ambigüedad: $\\operatorname{sen} B = \\dfrac{5\\cdot\\operatorname{sen} 60^\\circ}{6{,}245} = 0{,}6934 \\Rightarrow B \\approx 43{,}9^\\circ$.', antes: 'Para el segundo ángulo, ¿cuál conviene buscar primero para evitar el caso ambiguo: el opuesto al lado 5 o al lado 7?' },
      { t: '<strong>El tercero, gratis.</strong> $C = 180^\\circ - 60^\\circ - 43{,}9^\\circ = 76{,}1^\\circ$.' },
      { t: '<strong>Comprobar.</strong> $\\dfrac{c}{\\operatorname{sen} C} = \\dfrac{7}{0{,}9707} = 7{,}21$ y $\\dfrac{a}{\\operatorname{sen} A} = \\dfrac{6{,}245}{0{,}866} = 7{,}21$ ✓. El lado mayor ($c = 7$) está frente al ángulo mayor ($C$) ✓.', antes: '¿Cómo comprobarías el resultado con un dato que no hayas usado?' }
    ],
    cierre: 'El orden importa: coseno para el lado, seno para el ángulo opuesto al lado más corto, y la suma de $180^\\circ$ para el último. Así nunca aparece el caso ambiguo.'
  });

  p.util('Estos dos teoremas son la triangulación, y la triangulación es cómo sabe tu móvil dónde está ' +
    'cuando no hay GPS: mide la señal de tres antenas y resuelve el triángulo. Es también como se ' +
    'localiza el epicentro de un terremoto con tres sismógrafos, como aterriza un avión guiado por ' +
    'radiobalizas y como los barcos navegaban antes del satélite. Saber cuál de los dos aplicar ' +
    'según los datos que tengas es exactamente la decisión que toma el sistema.');

  p.section('Área de un triángulo cualquiera');
  p.text('La fórmula del área que aprendiste —base por altura partido por dos— tiene un inconveniente ' +
    'práctico: la altura casi nunca es un dato, hay que construirla. Si en vez de la altura conoces ' +
    'dos lados y el ángulo que forman, hay una fórmula que va directa, y sale de sustituir esa ' +
    'altura por lo que vale en función del seno.');


  p.formulas([
    'S = \\frac{1}{2}\\,b\\,c\\,\\operatorname{sen} A',
    's = \\frac{a+b+c}{2}, \\qquad S = \\sqrt{s(s-a)(s-b)(s-c)}'
  ], 'con dos lados y el ángulo · fórmula de Herón, solo con los lados',
    'Se lee: <em>«ese es igual a un medio por be por ce por seno de alfa»</em>, donde $\\alpha$ es ' +
      'el ángulo que forman los lados $b$ y $c$.<br><br>De dónde sale: en la fórmula de siempre, base ' +
      'por altura entre dos, la altura vale $c\\operatorname{sen}\\alpha$. Sustituyendo, aparece esta. ' +
      'No hay que aprenderla aparte: es la de siempre con la altura despejada.');

  p.text('La primera es la de siempre ($\\frac{base \\times altura}{2}$) con la altura escrita como ' +
    '$c\\operatorname{sen}A$. La segunda, de Herón de Alejandría (siglo I), es asombrosa: da el área ' +
    'sin necesidad de conocer ningún ángulo ni ninguna altura.');

  p.trampas([
    { e: 'Teorema del seno con un lado y un ángulo que no son opuestos', por: 'La proporción une cada lado con el ángulo de <em>enfrente</em>. Si no tienes ningún par así, toca el coseno.' },
    { e: 'Con $A$ obtuso, restar $2bc\\cos A$ como si fuera positivo', por: '$\\cos A$ es negativo: $-2bc\\cos A$ se convierte en una suma y el lado $a$ sale <em>mayor</em> que con Pitágoras.' },
    { e: '$S = \\frac{1}{2}bc\\operatorname{sen} A$ con un ángulo que no está entre $b$ y $c$', por: 'El ángulo de la fórmula es el que forman los dos lados que se multiplican. Si no, la altura no es $c\\operatorname{sen} A$.' },
    { e: 'Dar por único el triángulo en el caso LLA', por: 'Un seno tiene dos ángulos posibles. Hay que probar $180^\\circ - \\alpha$ y ver si la suma de ángulos aún deja sitio.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('La fórmula del área con el seno es la que usan los programas de catastro y los GPS agrícolas ' +
    'para calcular la superficie de una finca de forma irregular: se descompone en triángulos a ' +
    'partir de las coordenadas de sus esquinas y se suman. Un tractor autónomo hace esa cuenta para ' +
    'saber cuánta semilla cargar.');

  p.section('Practica');

  p.exercise({
    title: '¿Qué teorema toca?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'dos ángulos y un lado', v: 'seno', por: 'Con dos ángulos sale el tercero, y entonces hay un lado con su ángulo opuesto.' },
        { t: 'dos lados y el ángulo que forman', v: 'coseno', por: 'No hay ningún lado con su ángulo opuesto: el coseno da el tercer lado.' },
        { t: 'los tres lados', v: 'coseno', por: 'Sin ningún ángulo, solo el coseno puede empezar: se despeja $\\cos A$.' },
        { t: 'dos lados y el ángulo opuesto a uno de ellos', v: 'seno', por: 'Hay un lado con su ángulo opuesto. Es el caso ambiguo: puede haber dos triángulos.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return 'De un triángulo se conocen <strong>' + d.t + '</strong>. ¿Con qué teorema se empieza a resolverlo?'; },
    fields: [{ name: 'r', label: 'Teorema', opts: [{ t: 'del seno', v: 'seno' }, { t: 'del coseno', v: 'coseno' }] }],
    sol: function (d) { return { r: d.v }; },
    hint: function () { return '¿Hay entre los datos un lado y el ángulo que tiene enfrente? Si sí, seno; si no, coseno.'; },
    steps: function (d) { return [d.por, 'Teorema del <strong>' + d.v + '</strong>.']; },
    answer: function (d) { return 'Teorema del ' + d.v + '.'; }
  });

  p.exercise({
    title: 'Teorema del seno',
    level: 'medio',
    gen: function (r) {
      var A = r.int(25, 90), B = r.int(25, 150 - A);
      var a = r.int(4, 30);
      var b = a * Math.sin(B * Math.PI / 180) / Math.sin(A * Math.PI / 180);
      return { A: A, B: B, C: 180 - A - B, a: a, b: b };
    },
    ask: function (d) {
      return 'En un triángulo, $A = ' + d.A + '^\\circ$, $B = ' + d.B + '^\\circ$ y el lado $a = ' +
        d.a + '$ cm. Calcula el lado $b$ (cuatro decimales).';
    },
    fields: [{ name: 'b', label: 'Lado b (cm)', w: 'wide' }],
    sol: function (d) { return { b: U.round(d.b, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Tienes un lado con su ángulo opuesto: teorema del seno. $\\frac{a}{\\operatorname{sen}A} = \\frac{b}{\\operatorname{sen}B}$.'; },
    steps: function (d) {
      return ['$\\dfrac{a}{\\operatorname{sen} A} = \\dfrac{b}{\\operatorname{sen} B}$',
        '$\\dfrac{' + d.a + '}{\\operatorname{sen} ' + d.A + '^\\circ} = \\dfrac{b}{\\operatorname{sen} ' + d.B + '^\\circ}$',
        '$b = ' + d.a + ' \\cdot \\dfrac{\\operatorname{sen} ' + d.B + '^\\circ}{\\operatorname{sen} ' + d.A + '^\\circ} = ' +
        d.a + ' \\cdot \\dfrac{' + U.fmt(Math.sin(d.B * Math.PI / 180), 4) + '}{' + U.fmt(Math.sin(d.A * Math.PI / 180), 4) + '}$',
        '$= ' + U.fmt(d.b, 4) + '$ cm',
        'De paso, el tercer ángulo es $C = ' + d.C + '^\\circ$.'];
    },
    answer: function (d) { return U.fmt(d.b, 4) + ' cm'; }
  });

  p.exercise({
    title: 'Teorema del coseno: hallar un lado',
    level: 'medio',
    gen: function (r) {
      var b = r.int(3, 20), c = r.int(3, 20), A = r.int(20, 160);
      var a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * Math.PI / 180));
      return { b: b, c: c, A: A, a: a };
    },
    ask: function (d) {
      return 'Un triángulo tiene lados $b = ' + d.b + '$ y $c = ' + d.c + '$ cm, con un ángulo de $' +
        d.A + '^\\circ$ entre ellos. Calcula el tercer lado (cuatro decimales).';
    },
    fields: [{ name: 'a', label: 'Lado a (cm)', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.a, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Dos lados y el ángulo <em>entre</em> ellos: teorema del coseno.'; },
    steps: function (d) {
      return ['$a^2 = b^2 + c^2 - 2bc\\cos A$',
        '$a^2 = ' + (d.b * d.b) + ' + ' + (d.c * d.c) + ' - 2\\cdot' + d.b + '\\cdot' + d.c +
        '\\cdot\\cos ' + d.A + '^\\circ$',
        '$a^2 = ' + (d.b * d.b + d.c * d.c) + ' - ' + U.fmt(2 * d.b * d.c * Math.cos(d.A * Math.PI / 180), 4) +
        ' = ' + U.fmt(d.a * d.a, 4) + '$',
        '$a = ' + U.fmt(d.a, 4) + '$ cm'];
    },
    answer: function (d) { return U.fmt(d.a, 4) + ' cm'; }
  });

  p.exercise({
    title: 'Área de un triángulo cualquiera',
    level: 'medio',
    gen: function (r) {
      var b = r.int(4, 20), c = r.int(4, 20), A = r.int(20, 160);
      return { b: b, c: c, A: A, S: 0.5 * b * c * Math.sin(A * Math.PI / 180) };
    },
    ask: function (d) {
      return 'Calcula el área de un triángulo con lados $b = ' + d.b + '$ y $c = ' + d.c +
        '$ cm y un ángulo de $' + d.A + '^\\circ$ entre ellos (cuatro decimales).';
    },
    fields: [{ name: 'S', label: 'Área (cm²)', w: 'wide' }],
    sol: function (d) { return { S: U.round(d.S, 4) }; },
    tol: 3e-4,
    hint: function () { return '$S = \\frac{1}{2}bc\\operatorname{sen}A$: es la fórmula de siempre con la altura escrita como $c\\operatorname{sen}A$.'; },
    steps: function (d) {
      return ['$S = \\dfrac{1}{2}\\,b\\,c\\,\\operatorname{sen} A$',
        '$= \\dfrac{1}{2} \\cdot ' + d.b + ' \\cdot ' + d.c + ' \\cdot \\operatorname{sen} ' + d.A + '^\\circ$',
        '$= ' + U.fmt(0.5 * d.b * d.c, 3) + ' \\cdot ' + U.fmt(Math.sin(d.A * Math.PI / 180), 4) + ' = ' + U.fmt(d.S, 4) + '$ cm²',
        'Fíjate en que con $A = 90^\\circ$ saldría simplemente $\\frac{bc}{2}$: la fórmula del triángulo rectángulo.'];
    },
    answer: function (d) { return U.fmt(d.S, 4) + ' cm²'; }
  });

  p.exercise({
    title: 'Teorema del coseno: hallar un ángulo',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(4, 20), b = r.int(4, 20), c = r.int(4, 20);
      var l = [a, b, c].sort(function (x, y) { return x - y; });
      if (l[0] + l[1] <= l[2]) return null;
      var A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI;
      return { a: a, b: b, c: c, A: A };
    },
    ask: function (d) {
      return 'Un triángulo tiene lados $a = ' + d.a + '$, $b = ' + d.b + '$ y $c = ' + d.c +
        '$ cm. Calcula el ángulo $A$ (opuesto al lado $a$), en grados y con dos decimales.';
    },
    fields: [{ name: 'A', label: 'Ángulo A (°)', w: 'wide' }],
    sol: function (d) { return { A: U.round(d.A, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Despeja el coseno de la fórmula: $\\cos A = \\frac{b^2+c^2-a^2}{2bc}$.'; },
    steps: function (d) {
      var num = d.b * d.b + d.c * d.c - d.a * d.a;
      return ['Despejamos de $a^2 = b^2+c^2-2bc\\cos A$:',
        '$\\cos A = \\dfrac{b^2+c^2-a^2}{2bc} = \\dfrac{' + (d.b * d.b) + ' + ' + (d.c * d.c) + ' - ' + (d.a * d.a) +
        '}{2\\cdot' + d.b + '\\cdot' + d.c + '} = \\dfrac{' + num + '}{' + (2 * d.b * d.c) + '} = ' +
        U.fmt(num / (2 * d.b * d.c), 4) + '$',
        '$A = \\arccos(' + U.fmt(num / (2 * d.b * d.c), 4) + ') = ' + U.fmt(d.A, 4) + '^\\circ$',
        num < 0 ? 'El coseno sale negativo, así que el ángulo es <strong>obtuso</strong>.'
          : 'El coseno sale positivo, así que el ángulo es agudo.'];
    },
    answer: function (d) { return U.fmt(d.A, 2) + '°'; }
  });

  p.keys([
    'Teorema del seno: $\\frac{a}{\\operatorname{sen}A} = \\frac{b}{\\operatorname{sen}B} = \\frac{c}{\\operatorname{sen}C}$. Se usa con un lado y su ángulo opuesto.',
    'Teorema del coseno: $a^2 = b^2+c^2-2bc\\cos A$. Se usa con dos lados y el ángulo entre ellos, o con los tres lados.',
    'El teorema del coseno <strong>contiene</strong> a Pitágoras como caso particular ($A=90^\\circ$).',
    'Caso LLA: cuidado, puede haber dos triángulos válidos.',
    'Área: $S = \\frac{1}{2}bc\\operatorname{sen}A$, o la fórmula de Herón si solo tienes los lados.'
  ]);
});
