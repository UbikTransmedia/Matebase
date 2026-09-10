/* Tema: Sistemas de ecuaciones lineales */
Course.topic('al-sistemas', function (p) {

  p.puente('Una ecuación de primer grado con una incógnita tiene una solución. Si aparece una segunda ' +
    'incógnita, una sola ecuación ya no basta: $x + y = 5$ la cumplen infinitos pares. Hace falta una ' +
    'segunda condición, y la técnica de este tema es convertir dos ecuaciones con dos incógnitas en una ' +
    'ecuación con una, que ya sabes resolver.');

  p.text('Un <strong>sistema</strong> es un conjunto de ecuaciones que tienen que cumplirse ' +
    '<em>a la vez</em>. Con dos incógnitas hace falta, en general, dos condiciones.');

  p.formula('\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}', 'un sistema de dos ecuaciones',
    'La llave grande que abraza las dos líneas se lee <strong>«sistema»</strong>, y significa que ' +
      'las dos ecuaciones tienen que cumplirse <em>a la vez</em>, no una u otra.<br><br>Se dice: ' +
      '<em>«sistema: dos equis más i griega igual a siete; equis menos i griega igual a ' +
      'dos»</em>.<br><br>Ese matiz de «a la vez» es todo el tema: una sola ecuación con dos incógnitas ' +
      'tiene infinitas soluciones, y lo que las reduce a una es tener que satisfacer las dos.');

  p.text('Cada ecuación de primer grado con dos incógnitas representa una <strong>recta</strong>: ' +
    'infinitos pares $(x,y)$ la cumplen. Resolver el sistema es encontrar el punto (o los puntos) que ' +
    'están en las dos rectas a la vez.');

  p.demo({
    title: 'Dos rectas buscándose',
    intro: 'Cada ecuación es una recta. La solución es el punto donde se cortan. Mueve los coeficientes y mira qué pasa cuando las rectas se vuelven paralelas.',
    predice: 'El sistema de partida es $2x + y = 7$, $x - y = 2$. Prueba $x = 3$ en las dos: ¿qué $y$ sale en cada una? Si coincide, ya sabes dónde se cortan.',
    build: function (host, d) {
      var a1 = 2, b1 = 1, c1 = 7;
      var a2 = 1, b2 = -1, c2 = 2;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -6, xmax: 8, ymin: -6, ymax: 8, height: 330, equal: true,
        draw: function (g) {
          recta(g, a1, b1, c1, 0);
          recta(g, a2, b2, c2, 1);
          var s = ML.solve2(a1, b1, c1, a2, b2, c2);
          if (s.type === 'unica') {
            g.point(s.x, s.y, {
              color: 2, r: 7,
              label: '(' + U.fmt(s.x, 2) + ', ' + U.fmt(s.y, 2) + ')', labelDy: -14
            });
          }
        }
      });
      function recta(g, a, b, c, col) {
        if (Math.abs(b) > 1e-9) g.fn(function (x) { return (c - a * x) / b; }, { color: col, w: 2.4 });
        else if (Math.abs(a) > 1e-9) g.vline(c / a, { color: col, w: 2.4 });
      }
      function paint() {
        var s = ML.solve2(a1, b1, c1, a2, b2, c2);
        var eq = '$\\begin{cases}' +
          ML.termTex(a1, 'x', 1, true) + ML.termTex(b1, 'y', 1, false) + ' = ' + c1 + '\\\\' +
          ML.termTex(a2, 'x', 1, true) + ML.termTex(b2, 'y', 1, false) + ' = ' + c2 + '\\end{cases}$';
        var txt;
        if (s.type === 'unica') {
          txt = '<strong style="color:var(--ok)">Compatible determinado</strong>: las rectas se cortan en ' +
            'un punto. &nbsp; $x = ' + U.fmt(s.x, 4) + '$, &nbsp; $y = ' + U.fmt(s.y, 4) + '$';
        } else if (s.type === 'infinitas') {
          txt = '<strong style="color:var(--warn)">Compatible indeterminado</strong>: son la misma recta. ' +
            'Infinitas soluciones.';
        } else {
          txt = '<strong style="color:var(--bad)">Incompatible</strong>: rectas paralelas. No hay ningún ' +
            'punto que cumpla las dos.';
        }
        out.set(eq + '<br>' + txt);
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a₁', min: -4, max: 4, step: 1, value: a1, dec: 0, on: function (v) { a1 = v; paint(); } });
      W.slider(row, { label: 'b₁', min: -4, max: 4, step: 1, value: b1, dec: 0, on: function (v) { b1 = v; paint(); } });
      W.slider(row, { label: 'c₁', min: -8, max: 8, step: 1, value: c1, dec: 0, on: function (v) { c1 = v; paint(); } });
      var row2 = W.row(host);
      W.slider(row2, { label: 'a₂', min: -4, max: 4, step: 1, value: a2, dec: 0, on: function (v) { a2 = v; paint(); } });
      W.slider(row2, { label: 'b₂', min: -4, max: 4, step: 1, value: b2, dec: 0, on: function (v) { b2 = v; paint(); } });
      W.slider(row2, { label: 'c₂', min: -8, max: 8, step: 1, value: c2, dec: 0, on: function (v) { c2 = v; paint(); } });
      W.hint(host, 'Prueba a poner a₂ = 4, b₂ = 2 con a₁ = 2, b₁ = 1: misma pendiente, rectas paralelas.');
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Los tres métodos');

  p.text('Los tres llegan al mismo sitio. Elegir bien el método ahorra la mitad del trabajo.');

  p.sub('1. Sustitución — cuando hay una incógnita ya despejada o fácil de despejar');
  p.text('Despeja una incógnita en una ecuación y mete esa expresión en la otra. Te queda una sola ' +
    'ecuación con una sola incógnita.');
  p.formula('\\begin{aligned} x - y &= 2 &&\\Rightarrow\\ x = y + 2 \\\\ 2(y+2) + y &= 7 &&\\Rightarrow\\ 3y = 3 \\Rightarrow y = 1 \\\\ x &= 1 + 2 = 3 \\end{aligned}');

  p.sub('2. Igualación — cuando la misma incógnita se despeja fácil en las dos');
  p.text('Despeja la <em>misma</em> incógnita en ambas ecuaciones e iguala las dos expresiones.');

  p.sub('3. Reducción — casi siempre el más rápido');
  p.text('Multiplica las ecuaciones por números adecuados para que una incógnita tenga coeficientes ' +
    'opuestos, y súmalas: esa incógnita desaparece.');
  p.formula('\\begin{aligned} 2x + y &= 7 \\\\ x - y &= 2 \\\\ \\hline 3x\\ \\ \\ \\ &= 9 \\ \\Rightarrow\\ x = 3 \\end{aligned}', 'método de reducción',
    'Las dos ecuaciones van una debajo de otra porque forman un sistema: hay que resolverlas a la vez, ' +
      'no por separado. La raya horizontal indica que lo de abajo es el resultado de sumarlas, igual ' +
      'que en una suma de toda la vida.<br><br>La idea del método: multiplicar las ecuaciones ' +
      'por lo que haga falta para que una incógnita tenga coeficientes opuestos, y entonces sumarlas ' +
      'para que desaparezca. Es la balanza otra vez: si sumas dos igualdades verdaderas, obtienes otra ' +
      'igualdad verdadera.');

  p.note('Aquí la $y$ se ha ido sola porque los coeficientes ya eran $+1$ y $-1$. Cuando no lo son, ' +
    'multiplica cada ecuación por lo que haga falta. Si no hay nada evidente, reducción sigue siendo ' +
    'la apuesta segura.', null, 'Por qué reducción suele ganar');

  p.ejemplo({
    title: 'Reducción cuando nada se va solo',
    enunciado: 'Resolver $\\begin{cases} 3x + 2y = 12 \\\\ 2x - 3y = -5 \\end{cases}$',
    pasos: [
      { t: '<strong>Elegir qué eliminar.</strong> Los coeficientes de $y$ son $2$ y $-3$, ya de signos opuestos. Multiplicando la primera por 3 y la segunda por 2 quedarán $6y$ y $-6y$.', antes: '¿Por qué números multiplicarías cada ecuación para que la $y$ desaparezca al sumar?' },
      { t: '<strong>Multiplicar y sumar.</strong> $9x + 6y = 36$ y $4x - 6y = -10$. Sumando: $13x = 26$, luego $x = 2$.', antes: 'Suma las dos ecuaciones nuevas. ¿Qué queda?' },
      { t: '<strong>Recuperar la otra.</strong> En la primera original: $3\\cdot 2 + 2y = 12 \\Rightarrow 2y = 6 \\Rightarrow y = 3$.', antes: 'Ya tienes $x = 2$. ¿Cómo sacas $y$ sin volver a empezar?' },
      { t: '<strong>Comprobar en la otra ecuación.</strong> Segunda: $2\\cdot 2 - 3\\cdot 3 = 4 - 9 = -5$ ✓. Se comprueba en la que <em>no</em> se usó para despejar; si no, la comprobación no aporta nada.' }
    ],
    cierre: 'Solución $(2, 3)$: el punto donde se cortan las dos rectas. Si te hubieras equivocado en un signo al multiplicar, la comprobación en la segunda ecuación habría fallado.'
  });

  p.util('Un sistema de ecuaciones es lo que resuelve un GPS cada segundo. Tu móvil recibe la señal de ' +
    'varios satélites y de cada uno deduce una distancia; cruzar esas distancias para averiguar ' +
    'dónde estás es exactamente resolver un sistema. Con dos satélites hay dos posiciones posibles, ' +
    'con tres queda una: es el mismo «cortar rectas para encontrar el punto» que estás haciendo ' +
    'aquí, pero en el espacio.');

  p.section('Clasificar un sistema');
  p.text('Antes de resolver conviene saber qué esperas encontrar, porque un sistema no siempre tiene una ' +
    'solución. Geométricamente la respuesta es muy visual: dos rectas en un plano o se cortan en un ' +
    'punto, o son paralelas y no se cortan nunca, o son la misma recta dibujada dos veces. Esos tres ' +
    'dibujos son exactamente los tres casos de la tabla.');


  p.table(['Comparando coeficientes', 'Tipo', 'Geometría'],
    [['$\\dfrac{a_1}{a_2} \\ne \\dfrac{b_1}{b_2}$', 'compatible determinado', 'se cortan en un punto'],
     ['$\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} = \\dfrac{c_1}{c_2}$', 'compatible indeterminado', 'la misma recta'],
     ['$\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\ne \\dfrac{c_1}{c_2}$', 'incompatible', 'paralelas']]);

  p.comprueba('$\\begin{cases} x + y = 3 \\\\ 2x + 2y = 8 \\end{cases}$ ¿De qué tipo es?', [
    { t: 'Compatible determinado', ok: false, por: 'La segunda ecuación es la primera multiplicada por 2 en el lado izquierdo: misma pendiente. No pueden cortarse en un punto.' },
    { t: 'Compatible indeterminado', ok: false, por: 'Serían la misma recta si también $8 = 2\\cdot 3$. Pero $2\\cdot 3 = 6 \\ne 8$.' },
    { t: 'Incompatible', ok: true, por: '$\\frac{1}{2} = \\frac{1}{2} \\ne \\frac{3}{8}$: rectas paralelas distintas. Dicho en palabras: si $x + y = 3$, entonces $2x + 2y = 6$, nunca 8.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Clasificar antes de resolver ahorra trabajo y evita disparates. Un sistema incompatible en una ' +
    'mezcla química significa que la receta pedida es imposible con esos ingredientes; uno ' +
    'indeterminado significa que hay varias mezclas válidas y se puede elegir la más barata. En los ' +
    'dos casos, la respuesta útil aparece <em>antes</em> de ponerse a calcular.');

  p.hist('El método de eliminación aparece resuelto en <em>Los nueve capítulos del arte matemático</em>, ' +
    'un texto chino compilado hace unos dos mil años, mil ochocientos antes de que Gauss naciera. ' +
    'Sus autores colocaban los coeficientes en columnas sobre un tablero de cálculo y los iban ' +
    'restando exactamente como se hace hoy con las filas de una matriz. Es uno de los casos más ' +
    'claros de una misma idea descubierta dos veces, con veinte siglos de diferencia.');

  p.section('Practica');

  p.exercise({
    title: '¿Es solución?',
    level: 'basico',
    gen: function (r) {
      var x = r.pm(1, 6), y = r.pm(1, 6);
      var a1 = r.nz(-4, 4), b1 = r.nz(-4, 4), a2 = r.nz(-4, 4), b2 = r.nz(-4, 4);
      if (Math.abs(a1 * b2 - a2 * b1) < 1e-9) return null;
      var es = r.bool();
      var c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y + (es ? 0 : r.nz(-3, 3));
      return { x: x, y: y, a1: a1, b1: b1, c1: c1, a2: a2, b2: b2, c2: c2, es: es, v2: a2 * x + b2 * y };
    },
    ask: function (d) {
      return '¿Es el par $(x, y) = (' + d.x + ', ' + d.y + ')$ solución del sistema $\\begin{cases}' +
        ML.termTex(d.a1, 'x', 1, true) + ML.termTex(d.b1, 'y', 1, false) + ' = ' + d.c1 + '\\\\' +
        ML.termTex(d.a2, 'x', 1, true) + ML.termTex(d.b2, 'y', 1, false) + ' = ' + d.c2 + '\\end{cases}$?';
    },
    fields: [{ name: 'r', label: 'Respuesta', opts: [{ t: 'Sí, cumple las dos ecuaciones', v: 'si' }, { t: 'No', v: 'no' }] }],
    sol: function (d) { return { r: d.es ? 'si' : 'no' }; },
    hint: function () { return 'Sustituye $x$ e $y$ en las dos ecuaciones. Tiene que cumplir <strong>las dos</strong>, no solo una.'; },
    steps: function (d) {
      return ['Primera: $' + d.a1 + '\\cdot(' + d.x + ') + (' + d.b1 + ')\\cdot(' + d.y + ') = ' + d.c1 + '$ ✓.',
        'Segunda: $' + d.a2 + '\\cdot(' + d.x + ') + (' + d.b2 + ')\\cdot(' + d.y + ') = ' + d.v2 + '$' +
        (d.es ? ' ✓.' : ', y la ecuación pide $' + d.c2 + '$ ✗.'),
        d.es ? 'Cumple las dos: es solución.' : 'Solo cumple la primera: no es solución del sistema. Un sistema exige las dos a la vez.'];
    },
    answer: function (d) { return d.es ? 'Sí, es solución.' : 'No: cumple la primera pero no la segunda.'; }
  });

  p.exercise({
    title: 'Resuelve el sistema',
    level: 'medio',
    gen: function (r) {
      var x = r.pm(1, 8), y = r.pm(1, 8);
      var a1 = r.nz(-5, 5), b1 = r.nz(-5, 5), a2 = r.nz(-5, 5), b2 = r.nz(-5, 5);
      if (Math.abs(a1 * b2 - a2 * b1) < 1e-9) return null;
      return {
        a1: a1, b1: b1, c1: a1 * x + b1 * y,
        a2: a2, b2: b2, c2: a2 * x + b2 * y, x: x, y: y
      };
    },
    ask: function (d) {
      return 'Resuelve: $\\begin{cases}' +
        ML.termTex(d.a1, 'x', 1, true) + ML.termTex(d.b1, 'y', 1, false) + ' = ' + d.c1 + '\\\\' +
        ML.termTex(d.a2, 'x', 1, true) + ML.termTex(d.b2, 'y', 1, false) + ' = ' + d.c2 + '\\end{cases}$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }, { name: 'y', label: 'y =', w: 'tiny' }],
    sol: function (d) { return { x: d.x, y: d.y }; },
    hint: function (d) {
      return 'Por reducción: multiplica la primera por $' + d.a2 + '$ y la segunda por $' + (-d.a1) +
        '$, y súmalas para que desaparezca la $x$.';
    },
    steps: function (d) {
      var k1 = d.a2, k2 = -d.a1;
      var by = k1 * d.b1 + k2 * d.b2, cy = k1 * d.c1 + k2 * d.c2;
      return ['Multiplicamos la 1.ª por $' + k1 + '$ y la 2.ª por $' + k2 + '$ para que los términos en $x$ se anulen.',
        'Sumando: $' + ML.termTex(by, 'y', 1, true) + ' = ' + cy + '$, luego $y = ' + d.y + '$.',
        'Sustituimos en la primera: $' + ML.termTex(d.a1, 'x', 1, true) + ' = ' + d.c1 + ' - (' + d.b1 + ')\\cdot(' + d.y + ') = ' + (d.c1 - d.b1 * d.y) + '$.',
        '$x = ' + d.x + '$.',
        'Comprobación en la 2.ª: $' + d.a2 + '\\cdot(' + d.x + ') + ' + d.b2 + '\\cdot(' + d.y + ') = ' + d.c2 + '$ ✓'];
    },
    answer: function (d) { return 'x = ' + d.x + ', y = ' + d.y; }
  });

  p.exercise({
    title: 'Clasifica sin resolver',
    level: 'medio',
    gen: function (r) {
      var tipo = r.int(0, 2);
      var a1 = r.nz(-5, 5), b1 = r.nz(-5, 5), c1 = r.pm(1, 9);
      var k = r.pick([-3, -2, 2, 3]);
      if (tipo === 0) {
        var a2 = r.nz(-5, 5), b2 = r.nz(-5, 5);
        if (Math.abs(a1 * b2 - a2 * b1) < 1e-9) return null;
        return { a1: a1, b1: b1, c1: c1, a2: a2, b2: b2, c2: r.pm(1, 9), tipo: 0 };
      }
      if (tipo === 1) return { a1: a1, b1: b1, c1: c1, a2: k * a1, b2: k * b1, c2: k * c1, tipo: 1 };
      return { a1: a1, b1: b1, c1: c1, a2: k * a1, b2: k * b1, c2: k * c1 + r.nz(1, 5), tipo: 2 };
    },
    ask: function (d) {
      return 'Clasifica sin resolver: $\\begin{cases}' +
        ML.termTex(d.a1, 'x', 1, true) + ML.termTex(d.b1, 'y', 1, false) + ' = ' + d.c1 + '\\\\' +
        ML.termTex(d.a2, 'x', 1, true) + ML.termTex(d.b2, 'y', 1, false) + ' = ' + d.c2 + '\\end{cases}$';
    },
    fields: [{ name: 't', label: 'Tipo', opts: [
      { t: 'compatible determinado', v: '1' },
      { t: 'compatible indeterminado', v: '2' },
      { t: 'incompatible', v: '3' }
    ] }],
    sol: function (d) { return { t: String(d.tipo + 1) }; },
    hint: function () { return 'Compara $a_1/a_2$ con $b_1/b_2$. Si coinciden, mira también $c_1/c_2$.'; },
    steps: function (d) {
      var r1 = d.a1 / d.a2, r2 = d.b1 / d.b2, r3 = d.c1 / d.c2;
      return ['$\\dfrac{a_1}{a_2} = ' + U.fmt(r1, 3) + '$ &nbsp; y &nbsp; $\\dfrac{b_1}{b_2} = ' + U.fmt(r2, 3) + '$',
        d.tipo === 0 ? 'Son distintos: las rectas tienen pendientes diferentes y se cortan en un punto.'
          : 'Coinciden, así que las rectas son paralelas. Miramos $\\dfrac{c_1}{c_2} = ' + U.fmt(r3, 3) + '$.',
        d.tipo === 0 ? 'Sistema <strong>compatible determinado</strong>.'
          : (d.tipo === 1 ? 'También coincide: es la misma recta escrita dos veces → <strong>compatible indeterminado</strong>.'
            : 'No coincide: rectas paralelas distintas → <strong>incompatible</strong>.')];
    },
    answer: function (d) {
      return ['Compatible determinado (1)', 'Compatible indeterminado (2)', 'Incompatible (3)'][d.tipo];
    }
  });

  p.exercise({
    title: 'Problema de dos incógnitas',
    level: 'avanzado',
    gen: function (r) {
      var t = r.int(0, 1);
      if (t === 0) {
        var pa = r.int(4, 12), pn = r.int(2, pa - 1);
        var na = r.int(2, 9), nn = r.int(2, 9);
        return { t: 0, pa: pa, pn: pn, na: na, nn: nn, tot: na + nn, dinero: na * pa + nn * pn, res: na };
      }
      var x = r.int(10, 60), y = r.int(5, 50);
      return { t: 1, suma: x + y, dif: Math.abs(x - y), res: Math.max(x, y) };
    },
    ask: function (d) {
      if (d.t === 0) {
        return 'En un cine, la entrada de adulto cuesta $' + d.pa + '$ € y la de niño $' + d.pn + '$ €. ' +
          'Han entrado $' + d.tot + '$ personas y se han recaudado $' + d.dinero + '$ €. ' +
          '¿Cuántos <strong>adultos</strong> han entrado?';
      }
      return 'Dos números suman $' + d.suma + '$ y su diferencia es $' + d.dif + '$. ' +
        '¿Cuál es el <strong>mayor</strong>?';
    },
    fields: [{ name: 'v', label: 'Respuesta', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    hint: function (d) {
      if (d.t === 0) return 'Llama $x$ a los adultos e $y$ a los niños: $x+y = ' + d.tot + '$ y $' + d.pa + 'x + ' + d.pn + 'y = ' + d.dinero + '$.';
      return 'Llama $x$ al mayor e $y$ al menor: $x+y = ' + d.suma + '$ y $x-y = ' + d.dif + '$.';
    },
    steps: function (d) {
      if (d.t === 0) {
        return ['Incógnitas: $x$ = adultos, $y$ = niños.',
          'Personas: $x + y = ' + d.tot + '$.',
          'Dinero: $' + d.pa + 'x + ' + d.pn + 'y = ' + d.dinero + '$.',
          'Sustituyendo $y = ' + d.tot + ' - x$: $' + d.pa + 'x + ' + d.pn + '(' + d.tot + ' - x) = ' + d.dinero + '$.',
          '$' + (d.pa - d.pn) + 'x = ' + (d.dinero - d.pn * d.tot) + ' \\Rightarrow x = ' + d.res + '$ adultos (y ' + d.nn + ' niños).'];
      }
      return ['$x + y = ' + d.suma + '$ y $x - y = ' + d.dif + '$.',
        'Sumando las dos ecuaciones se va la $y$: $2x = ' + (d.suma + d.dif) + '$.',
        '$x = ' + d.res + '$, y por tanto $y = ' + (d.suma - d.res) + '$.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.keys([
    'Un sistema pide que se cumplan varias ecuaciones <strong>a la vez</strong>.',
    'Cada ecuación lineal es una recta; la solución es la intersección.',
    'Tres métodos equivalentes: sustitución, igualación y reducción. Reducción suele ser el más rápido.',
    'Determinado (un punto), indeterminado (la misma recta), incompatible (paralelas).',
    'Se clasifica comparando $a_1/a_2$, $b_1/b_2$ y $c_1/c_2$, sin resolver nada.'
  ]);
});
