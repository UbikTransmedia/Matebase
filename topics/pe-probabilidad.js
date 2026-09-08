/* Tema: Probabilidad */
Course.topic('pe-probabilidad', function (p) {

  p.text('Un <strong>experimento aleatorio</strong> es aquel cuyo resultado no se puede predecir aunque ' +
    'se repita en las mismas condiciones: lanzar un dado, sacar una carta, medir cuántos coches pasan ' +
    'en un minuto. La probabilidad es la rama que pone números a esa incertidumbre.');

  p.list([
    '<strong>Espacio muestral</strong> $E$: todos los resultados posibles. Al lanzar un dado, $E=\\{1,2,3,4,5,6\\}$.',
    '<strong>Suceso</strong>: cualquier subconjunto de $E$. «Salir par» es $\\{2,4,6\\}$.',
    '<strong>Suceso elemental</strong>: uno solo de los resultados.',
    '<strong>Suceso seguro</strong> ($E$) y <strong>suceso imposible</strong> ($\\emptyset$).'
  ]);

  p.section('La regla de Laplace');
  p.text('La probabilidad tiene una definición sorprendentemente sencilla cuando todos los resultados ' +
    'posibles son igual de probables: se cuentan los que te interesan, se cuentan todos, y se ' +
    'dividen. Laplace la escribió así, con dos palabras que hay que tomarse en serio: casos ' +
    '<em>favorables</em> entre casos <em>posibles</em>.');


  p.formula('P(A) = \\frac{\\text{casos favorables}}{\\text{casos posibles}}');

  p.note('Esta fórmula tan famosa tiene una condición que casi siempre se olvida: solo vale si todos ' +
    'los casos son <strong>equiprobables</strong>. Con un dado trucado no funciona, y con la pregunta ' +
    '«¿lloverá mañana?» tampoco: no hay dos casos igualmente probables ahí.', 'warn', 'La letra pequeña de Laplace');

  p.demo({
    title: 'La frecuencia se acerca a la probabilidad',
    intro: 'Lanza el dado muchas veces. Al principio las barras están desiguales; con miles de tiradas se van igualando. Eso es la ley de los grandes números.',
    build: function (host, d) {
      var caras = [0, 0, 0, 0, 0, 0];
      var total = 0;
      var rng = U.rng();
      var host2 = U.el('div');
      host.appendChild(host2);
      var out = W.readout(host, '');
      function pinta() {
        U.clear(host2);
        var frec = caras.map(function (c) { return total ? c / total : 0; });
        W.barChart(host2, {
          labels: ['1', '2', '3', '4', '5', '6'],
          values: frec,
          height: 240, xlabel: 'cara', ylabel: 'frecuencia relativa', dec: 4,
          extra: function (g) { g.hline(1 / 6, { color: 2, w: 2, dash: true }); }
        });
        var maxDesv = Math.max.apply(null, frec.map(function (f) { return Math.abs(f - 1 / 6); }));
        out.set('Tiradas: <strong>' + U.miles(total) + '</strong><br>' +
          'Probabilidad teórica de cada cara: $\\frac{1}{6} = ' + U.fmt(1 / 6, 6) + '$<br>' +
          'Mayor desviación observada: $' + U.fmt(maxDesv, 5) + '$' +
          (total > 2000 ? ' — <strong style="color:var(--ok)">las frecuencias ya están muy cerca del valor teórico.</strong>' : ''));
      }
      function tirar(n) {
        for (var i = 0; i < n; i++) { caras[rng.int(0, 5)]++; total++; }
        pinta();
      }
      W.buttons(host, [
        { t: '+1 tirada', on: function () { tirar(1); } },
        { t: '+100', on: function () { tirar(100); } },
        { t: '+1000', cls: 'btn--main', on: function () { tirar(1000); } },
        { t: '↺ Reiniciar', on: function () { caras = [0, 0, 0, 0, 0, 0]; total = 0; pinta(); } }
      ]);
      pinta();
    }
  });

  p.text('Eso que acabas de ver es la <strong>ley de los grandes números</strong>: la frecuencia ' +
    'relativa de un suceso, al repetir muchas veces el experimento, se acerca a su probabilidad. Es lo ' +
    'que conecta la teoría con el mundo real, y también la definición <em>frecuentista</em> de ' +
    'probabilidad, la que se usa cuando no hay equiprobabilidad.');

  /* ---------------------------------------------------------------- */
  p.util('La regla de Laplace solo vale si todos los casos son igual de probables, y olvidar esa ' +
    'condición es el error que explota la industria del juego. En una ruleta hay 37 casillas y el ' +
    'premio se paga como si hubiera 36: esa casilla de diferencia es todo el negocio del casino. ' +
    'Comprobar si los casos son realmente equiprobables antes de dividir es la mitad del trabajo.');

  p.hist('El cálculo de probabilidades nació en 1654 de una consulta muy poco académica: el caballero de ' +
    'Méré, jugador empedernido, escribió a Pascal preguntándole cómo repartir el dinero de una ' +
    'partida de dados interrumpida a mitad. Pascal se lo consultó a Fermat, y de aquella ' +
    'correspondencia de unas pocas cartas salió una rama entera de las matemáticas. Durante dos ' +
    'siglos se la consideró una curiosidad de tahúres.');

  p.section('Álgebra de sucesos');
  p.text('Un suceso no es más que un conjunto de resultados —«sacar par» es el conjunto $\\{2,4,6\\}$—, y ' +
    'por eso todo lo que aprendiste sobre conjuntos vale aquí sin cambiar nada, solo con otro ' +
    'vocabulario. Esta tabla es el diccionario entre las dos formas de hablar; si te suena a lo que ' +
    'ya viste en el bloque 0, es exactamente eso.');


  p.table(['Notación', 'Nombre', 'Significa'],
    [['$A \\cup B$', 'unión', 'ocurre $A$ <strong>o</strong> $B$ (o los dos)'],
     ['$A \\cap B$', 'intersección', 'ocurren $A$ <strong>y</strong> $B$ a la vez'],
     ['$\\overline{A}$', 'contrario', '<strong>no</strong> ocurre $A$'],
     ['$A \\cap B = \\emptyset$', 'incompatibles', 'no pueden ocurrir a la vez']]);

  p.section('Propiedades');
  p.text('De la definición salen unas cuantas consecuencias que ahorran muchísimo trabajo. La más ' +
    'rentable de todas es la del suceso contrario: cuando calcular «al menos uno» es un lío, casi ' +
    'siempre es más fácil calcular «ninguno» y restarlo de 1. Recuérdala, porque resuelve la mitad ' +
    'de los problemas de probabilidad que caen en un examen.');


  p.formulas([
    '0 \\le P(A) \\le 1, \\qquad P(E) = 1, \\qquad P(\\emptyset) = 0',
    'P(\\overline{A}) = 1 - P(A)',
    'P(A \\cup B) = P(A) + P(B) - P(A\\cap B)'
  ], 'las tres propiedades básicas',
    'El símbolo $\\le$ se lee «menor o igual que», y $\\overline{A}$ se dice «A barra» o «contrario ' +
      'de A».<br><br>Las tres dicen: <em>«toda probabilidad está entre cero y uno»</em> · <em>«la ' +
      'probabilidad del suceso seguro es uno»</em> · <em>«la probabilidad del contrario de A es uno ' +
      'menos la de A»</em>.<br><br>La tercera es la más rentable: si te cuesta calcular algo, calcula ' +
      'lo contrario y réstalo de 1.');

  p.note('En la fórmula de la unión se resta la intersección porque, si no, los casos que están en ' +
    'los dos sucesos se contarían <strong>dos veces</strong>. Si los sucesos son incompatibles, esa ' +
    'intersección es cero y la fórmula se simplifica.', null, 'Por qué se resta');

  p.note('El truco más rentable de todo el tema: cuando el enunciado dice «<em>al menos uno</em>», casi ' +
    'siempre es más rápido calcular la probabilidad de «<em>ninguno</em>» y restar de 1. ' +
    '$P(\\text{al menos uno}) = 1 - P(\\text{ninguno})$.', 'ok', 'El paso al contrario');

  p.demo({
    title: 'La paradoja de los cumpleaños',
    intro: '¿Cuánta gente hace falta en una sala para que sea más probable que no que dos compartan cumpleaños? La respuesta sorprende a casi todo el mundo.',
    build: function (host, d) {
      var n = 23;
      var out = W.readout(host, '');
      function prob(k) {
        var q = 1;
        for (var i = 0; i < k; i++) q *= (365 - i) / 365;
        return 1 - q;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 70, ymin: 0, ymax: 1.05, height: 280,
        xlabel: 'personas en la sala', ylabel: 'probabilidad',
        draw: function (g) {
          g.fn(function (x) { return prob(Math.round(x)); }, { color: 0, w: 2.6, samples: 300 });
          g.hline(0.5, { color: 'axis', w: 1.4, dash: true });
          g.point(n, prob(n), { color: 2, r: 6 });
          g.seg(n, 0, n, prob(n), { color: 2, w: 1.4, dash: true });
        }
      });
      function paint() {
        out.set('Con <strong>' + n + ' personas</strong>, la probabilidad de que al menos dos ' +
          'compartan cumpleaños es <strong>' + U.fmt(prob(n) * 100, 2) + '%</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Se calcula por el contrario: ' +
          '$1 - \\frac{365}{365}\\cdot\\frac{364}{365}\\cdots$. Con 23 personas ya se pasa del 50 %, ' +
          'y con 50 se llega al 97 %. La intuición falla porque no comparamos cada uno con el resto, ' +
          'sino <em>todas las parejas posibles</em>: con 23 personas hay 253 parejas.</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'personas', min: 2, max: 70, step: 1, value: 23, dec: 0, on: function (v) { n = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Estas propiedades son la base del cálculo de riesgos, que es una industria entera. Una ' +
    'aseguradora fija el precio de una póliza a partir de la probabilidad de cada siniestro; una ' +
    'central nuclear calcula la de un fallo combinado multiplicando las de sus sistemas ' +
    'independientes; una empresa decide si le compensa un proyecto ponderando ganancias por sus ' +
    'probabilidades. Cuando oigas «riesgo de uno entre un millón», detrás hay estas cuentas.');

  p.section('Practica');

  p.exercise({
    title: 'Regla de Laplace',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'sacar un número par al lanzar un dado', f: 3, p: 6 },
        { t: 'sacar un número mayor que 4 al lanzar un dado', f: 2, p: 6 },
        { t: 'sacar una figura de una baraja española de 40 cartas', f: 12, p: 40 },
        { t: 'sacar oros de una baraja española de 40 cartas', f: 10, p: 40 },
        { t: 'sacar bola roja de una urna con 5 rojas y 7 azules', f: 5, p: 12 },
        { t: 'sacar un múltiplo de 3 al lanzar un dado', f: 2, p: 6 },
        { t: 'que salgan dos caras al lanzar dos monedas', f: 1, p: 4 },
        { t: 'sacar un as de una baraja de 52 cartas', f: 4, p: 52 }
      ];
      var c = r.pick(casos);
      return { t: c.t, f: c.f, p: c.p, prob: c.f / c.p };
    },
    ask: function (d) {
      return 'Calcula la probabilidad de ' + d.t + ' (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.prob, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Cuenta los casos favorables y divide entre los posibles.'; },
    steps: function (d) {
      var f = ML.F(d.f, d.p);
      return ['Casos favorables: $' + d.f + '$.',
        'Casos posibles: $' + d.p + '$.',
        '$P = \\dfrac{' + d.f + '}{' + d.p + '} = ' + f.tex() + ' = ' + U.fmt(d.prob, 4) + '$'];
    },
    answer: function (d) { return ML.F(d.f, d.p).toString() + ' = ' + U.fmt(d.prob, 4); }
  });

  p.exercise({
    title: 'Probabilidad de la unión',
    level: 'medio',
    gen: function (r) {
      var den = r.pick([10, 20, 25, 50, 100]);
      var pa = r.int(2, den / 2) / den;
      var pb = r.int(2, den / 2) / den;
      var pab = r.int(1, Math.min(pa, pb) * den) / den;
      return { pa: pa, pb: pb, pab: pab, union: pa + pb - pab };
    },
    ask: function (d) {
      return 'Si $P(A) = ' + U.fmt(d.pa, 4) + '$, $P(B) = ' + U.fmt(d.pb, 4) + '$ y ' +
        '$P(A \\cap B) = ' + U.fmt(d.pab, 4) + '$, calcula $P(A \\cup B)$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'P(A ∪ B)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.union, 6) }; },
    tol: 3e-4,
    hint: function () { return '$P(A\\cup B) = P(A)+P(B)-P(A\\cap B)$. La resta evita contar dos veces lo común.'; },
    steps: function (d) {
      return ['$P(A\\cup B) = P(A) + P(B) - P(A\\cap B)$',
        '$= ' + U.fmt(d.pa, 4) + ' + ' + U.fmt(d.pb, 4) + ' - ' + U.fmt(d.pab, 4) + '$',
        '$= ' + U.fmt(d.union, 4) + '$',
        'Si no restáramos la intersección, los casos comunes se contarían dos veces.'];
    },
    answer: function (d) { return U.fmt(d.union, 4); }
  });

  p.exercise({
    title: 'Al menos uno',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(2, 6);
      var pfallo = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      return { n: n, p: pfallo, ninguno: Math.pow(1 - pfallo, n), alMenos: 1 - Math.pow(1 - pfallo, n) };
    },
    ask: function (d) {
      return 'Un tirador acierta en la diana con probabilidad $' + U.fmt(d.p, 2) + '$ en cada intento. ' +
        'Si dispara $' + d.n + '$ veces, ¿cuál es la probabilidad de que acierte <strong>al menos ' +
        'una vez</strong>? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.alMenos, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Calcula primero la probabilidad de <strong>fallar todas</strong>: es $' + U.fmt(1 - d.p, 2) + '^{' + d.n + '}$.'; },
    steps: function (d) {
      return ['El contrario de «acertar al menos una vez» es «fallar todas las veces».',
        'Probabilidad de fallar una: $1 - ' + U.fmt(d.p, 2) + ' = ' + U.fmt(1 - d.p, 2) + '$.',
        'Fallar las $' + d.n + '$: $' + U.fmt(1 - d.p, 2) + '^{' + d.n + '} = ' + U.fmt(d.ninguno, 6) + '$.',
        '$P(\\text{al menos una}) = 1 - ' + U.fmt(d.ninguno, 6) + ' = ' + U.fmt(d.alMenos, 4) + '$',
        'Calcularlo directamente exigiría sumar los casos de 1, 2, 3… aciertos: mucho más largo.'];
    },
    answer: function (d) { return U.fmt(d.alMenos, 4); }
  });

  p.exercise({
    title: 'Con combinatoria',
    level: 'avanzado',
    gen: function (r) {
      var rojas = r.int(3, 8), azules = r.int(3, 8);
      var sacar = r.int(2, 3);
      var total = rojas + azules;
      if (sacar > rojas) return null;
      var fav = ML.comb(rojas, sacar);
      var pos = ML.comb(total, sacar);
      return { rojas: rojas, azules: azules, sacar: sacar, total: total, fav: fav, pos: pos, prob: fav / pos };
    },
    ask: function (d) {
      return 'Una urna contiene $' + d.rojas + '$ bolas rojas y $' + d.azules + '$ azules. Se sacan $' +
        d.sacar + '$ bolas <strong>a la vez</strong>. ¿Cuál es la probabilidad de que todas sean rojas? ' +
        '(cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.prob, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Como se sacan a la vez, el orden no importa: son combinaciones. Favorables $\\binom{' + d.rojas + '}{' + d.sacar + '}$, posibles $\\binom{' + d.total + '}{' + d.sacar + '}$.'; },
    steps: function (d) {
      return ['Sacar varias bolas a la vez significa que el orden no importa: <strong>combinaciones</strong>.',
        'Casos posibles: $\\dbinom{' + d.total + '}{' + d.sacar + '} = ' + d.pos + '$.',
        'Casos favorables (todas rojas): $\\dbinom{' + d.rojas + '}{' + d.sacar + '} = ' + d.fav + '$.',
        '$P = \\dfrac{' + d.fav + '}{' + d.pos + '} = ' + U.fmt(d.prob, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.prob, 4); }
  });

  p.keys([
    'La regla de Laplace exige que todos los casos sean <strong>equiprobables</strong>.',
    'Ley de los grandes números: la frecuencia relativa se acerca a la probabilidad al repetir mucho.',
    '$P(\\overline{A}) = 1 - P(A)$; $P(A\\cup B) = P(A)+P(B)-P(A\\cap B)$.',
    'La intersección se resta para no contar dos veces lo común.',
    'Ante un «al menos uno», calcula el contrario: «ninguno».',
    'Contar casos favorables y posibles suele ser un problema de combinatoria.'
  ]);
});
