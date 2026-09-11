/* Tema: Identidades notables y factorización */
Course.topic('al-identidades', function (p) {

  p.puente('Ya sabes multiplicar dos polinomios: cada término por cada término y luego reducir. Este ' +
    'tema no añade ninguna regla; señala tres productos que salen tan a menudo que merece la pena ' +
    'tenerlos hechos de antemano. Y les da la vuelta: reconocer un producto ya desarrollado es ' +
    'factorizar, que es la herramienta con la que Ruffini y las ecuaciones trabajan.');

  p.text('Hay tres productos que aparecen tantas veces que conviene reconocerlos de un vistazo. No ' +
    'tienen nada de especial: si los desarrollas a mano, término a término, salen solos. Lo que pasa ' +
    'es que aparecen <em>constantemente</em>, y quien los reconoce se ahorra media hoja de cuentas ' +
    'cada vez.');

  p.text('Y hay algo más importante que desarrollarlos, que es saber leerlos <strong>al revés</strong>. ' +
    'Desarrollar es fácil y mecánico; lo difícil, y lo que de verdad se pide en los ejercicios, es ver ' +
    'un $x^2+6x+9$ y reconocer que eso <em>es</em> $(x+3)^2$. Eso se llama factorizar y es la mitad ' +
    'del tema.');

  p.formulas([
    '(a+b)^2 = a^2 + 2ab + b^2',
    '(a-b)^2 = a^2 - 2ab + b^2',
    '(a+b)(a-b) = a^2 - b^2'
  ], 'las tres identidades notables',
    'Se leen: <em>«a más be, al cuadrado, es igual a a al cuadrado, más dos a be, más be al ' +
    'cuadrado»</em> · <em>«a menos be, al cuadrado, es igual a a al cuadrado, menos dos a be, más be ' +
    'al cuadrado»</em> · <em>«a más be, por a menos be, es igual a a al cuadrado menos be al ' +
    'cuadrado»</em>.<br><br>Fíjate en dos detalles que se preguntan mucho: en la segunda, el último ' +
    'término es <strong>positivo</strong>, porque menos por menos da más. Y en la tercera <strong>no ' +
    'hay término del medio</strong>: los dos productos cruzados se cancelan, y por eso el resultado ' +
    'es tan limpio.');

  p.text('La tercera merece una mirada aparte, porque es la que más se usa y la única que hace ' +
    'desaparecer un término. Si desarrollas $(a+b)(a-b)$ multiplicando todo con todo salen cuatro ' +
    'sumandos: $a^2$, $-ab$, $+ab$ y $-b^2$. Los dos del medio son iguales y de signo contrario, así ' +
    'que se anulan y queda solo la diferencia de cuadrados. Ese detalle es el que la convierte en un ' +
    'atajo para multiplicar de cabeza.');

  p.note('El error clásico, y hay que quitárselo de encima ya: $(a+b)^2$ <strong>no</strong> es ' +
    '$a^2+b^2$. Falta el doble producto $2ab$. Compruébalo con números: $(3+4)^2 = 49$, mientras que ' +
    '$3^2+4^2 = 25$.', 'warn', 'El error más caro del álgebra');

  p.comprueba('Desarrolla $(x - 5)^2$.', [
    { t: '$x^2 - 25$', ok: false, por: 'Falta el doble producto. $x^2 - 25$ es $(x-5)(x+5)$, otra identidad distinta.' },
    { t: '$x^2 - 10x + 25$', ok: true, por: 'Cuadrado del primero, menos el doble producto $2\\cdot x\\cdot 5$, más el cuadrado del segundo. El último término siempre es positivo.' },
    { t: '$x^2 - 10x - 25$', ok: false, por: 'El último término es $(-5)^2 = +25$: menos por menos da más.' }
  ]);

  p.demo({
    title: 'Por qué sobra ese 2ab',
    intro: 'Un cuadrado de lado $a+b$ se parte en cuatro trozos. Dos son cuadrados y dos son rectángulos iguales: ahí está el doble producto.',
    predice: 'Con $a = 3$ y $b = 2$: ¿cuánto vale $(a+b)^2$? ¿Y $a^2 + b^2$? La diferencia entre los dos números tiene que estar en algún sitio del dibujo.',
    build: function (host, d) {
      var a = 3, b = 2;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -0.9, xmax: 8.2, ymin: -0.9, ymax: 7.5, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          g.rect(0, 0, a, a, { fill: 0, color: 0, fillAlpha: .35, w: 1.5 });
          g.rect(a, 0, b, a, { fill: 3, color: 3, fillAlpha: .35, w: 1.5 });
          g.rect(0, a, a, b, { fill: 3, color: 3, fillAlpha: .35, w: 1.5 });
          g.rect(a, a, b, b, { fill: 1, color: 1, fillAlpha: .35, w: 1.5 });
          g.text(a / 2, a / 2, 'a² = ' + (a * a), { align: 'center', color: 0, bold: true });
          g.text(a + b / 2, a / 2, 'ab = ' + (a * b), { align: 'center', color: 3, size: 12 });
          g.text(a / 2, a + b / 2, 'ab = ' + (a * b), { align: 'center', color: 3, size: 12 });
          g.text(a + b / 2, a + b / 2, 'b² = ' + (b * b), { align: 'center', color: 1, size: 12 });
          g.text(a / 2, -0.45, 'a = ' + a, { align: 'center', size: 12, color: 'ink' });
          g.text(a + b / 2, -0.45, 'b = ' + b, { align: 'center', size: 12, color: 'ink' });
          g.seg(0, -0.15, a + b, -0.15, { color: 'axis', w: 1.2 });
        }
      });
      function paint() {
        out.set('$(a+b)^2 = (' + a + '+' + b + ')^2 = ' + Math.pow(a + b, 2) + '$<br>' +
          '$a^2 + 2ab + b^2 = ' + (a * a) + ' + 2\\cdot' + (a * b) + ' + ' + (b * b) + ' = ' +
          (a * a + 2 * a * b + b * b) + '$ ✓<br>' +
          '<span style="color:var(--bad)">$a^2 + b^2 = ' + (a * a + b * b) + '$ ✗ — se dejan fuera los dos rectángulos</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a', min: 1, max: 5, step: 1, value: a, dec: 0, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'b', min: 1, max: 3, step: 1, value: b, dec: 0, on: function (v) { b = v; paint(); } });
      paint();
    }
  });

  p.section('Suma por diferencia');

  p.text('$(a+b)(a-b) = a^2-b^2$ es la más útil de las tres, porque los términos cruzados se ' +
    'cancelan. Sirve para calcular de cabeza:');

  p.formula('97 \\cdot 103 = (100-3)(100+3) = 100^2 - 3^2 = 10000 - 9 = 9991');

  /* ---------------------------------------------------------------- */
  p.util('La identidad $a^2-b^2=(a+b)(a-b)$ sirve para multiplicar de cabeza. ¿Cuánto es $53 \\times 47$? ' +
    'Son $50+3$ y $50-3$, así que el resultado es $50^2-3^2 = 2500-9 = 2491$, sin papel. Lo mismo ' +
    'con $98\\times102 = 100^2-4 = 9996$. Los mercaderes hacían esto siglos antes de que existiera ' +
    'la calculadora, y sigue funcionando.');

  p.section('Factorizar');

  p.text('<strong>Factorizar</strong> es escribir una suma como un producto. Es la operación inversa ' +
    'de quitar paréntesis, y es fundamental: un producto vale cero cuando alguno de sus factores vale ' +
    'cero, y en eso se apoyará todo lo que viene después (ecuaciones, límites, integrales...).');

  p.list([
    '<strong>1.º Factor común</strong>: mira si todos los términos comparten algo. $6x^3-9x^2 = 3x^2(2x-3)$.',
    '<strong>2.º Identidad notable</strong>: ¿es una diferencia de cuadrados? ¿un cuadrado perfecto?',
    '<strong>3.º Raíces</strong>: si es de segundo grado, resuélvela y escribe $a(x-x_1)(x-x_2)$.'
  ], true);

  p.formula('x^2 - 5x + 6 = (x-2)(x-3)', 'factorizar usando las raíces');

  p.ejemplo({
    title: 'Factorizar del todo, en el orden correcto',
    enunciado: 'Factorizar $2x^3 - 8x$.',
    pasos: [
      { t: '<strong>Factor común.</strong> Los dos términos comparten un $2$ y una $x$: $2x^3 - 8x = 2x(x^2 - 4)$.', antes: '¿Qué tienen en común $2x^3$ y $8x$?' },
      { t: '<strong>Identidad notable.</strong> Lo que queda dentro, $x^2 - 4$, es una diferencia de cuadrados: $x^2 - 2^2 = (x-2)(x+2)$.', antes: '$x^2 - 4$: ¿te recuerda a alguna de las tres identidades?' },
      { t: '<strong>Resultado.</strong> $2x^3 - 8x = 2x(x-2)(x+2)$. Ya no se puede seguir: cada factor es de grado 1.' },
      { t: '<strong>Comprobar.</strong> Con $x = 3$: la expresión original da $54 - 24 = 30$ y la factorizada $6\\cdot 1\\cdot 5 = 30$ ✓.', antes: '¿Cómo comprobarías que no te has dejado nada, sin volver a multiplicar todo?' }
    ],
    cierre: 'Si se intenta la identidad antes que el factor común, $2x^3 - 8x$ no se parece a nada. El orden de la lista no es un capricho: el factor común destapa lo demás.'
  });

  p.demo({
    title: 'De las raíces a los factores',
    predice: 'Pon las raíces en $2$ y en $-2$. ¿Qué polinomio saldrá desarrollado? ¿Tendrá término en $x$?',
    intro: 'Mueve las dos raíces y observa cómo la parábola corta el eje justo ahí, y cómo cambia el polinomio desarrollado.',
    build: function (host, d) {
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -7, xmax: 7, ymin: -8, ymax: 12, height: 300,
        handles: {
          r1: { x: -2, y: 0, label: 'x₁', color: 1, constrain: snap },
          r2: { x: 3, y: 0, label: 'x₂', color: 1, constrain: snap }
        },
        draw: function (g) {
          var a = g.h('r1').x, b = g.h('r2').x;
          g.fn(function (x) { return (x - a) * (x - b); }, { color: 0, w: 2.6 });
          var v = (a + b) / 2;
          g.point(v, (v - a) * (v - b), { color: 2, r: 4.5, label: 'vértice', labelDy: 14, labelDx: -22 });
          out.set('$(x' + (a >= 0 ? '-' + a : '+' + (-a)) + ')(x' + (b >= 0 ? '-' + b : '+' + (-b)) + ') = ' +
            ML.polyTex([1, -(a + b), a * b]) + '$' +
            '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">La suma de las raíces es ' +
            (a + b) + ' y su producto ' + (a * b) + ': justo $-b$ y $c$ del polinomio.</span>');
        }
      });
      function snap(h) { h.y = 0; h.x = U.clamp(Math.round(h.x), -6, 6); }
      W.hint(host, 'Arrastra los puntos rojos sobre el eje horizontal.');
    }
  });

  p.trampas([
    { e: '$(a+b)^2 = a^2 + b^2$', por: 'Falta $2ab$. Con $a = 3$, $b = 4$: $49 \\ne 25$.' },
    { e: '$x^2 + 9 = (x+3)^2$', por: 'Un cuadrado perfecto necesita el término del medio: $(x+3)^2 = x^2 + 6x + 9$. Y $x^2 + 9$, suma de cuadrados, no se factoriza con números reales.' },
    { e: 'Empezar por la identidad y olvidar el factor común', por: '$3x^2 - 12$ no es ninguna identidad hasta que sacas el 3: $3(x^2 - 4) = 3(x-2)(x+2)$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Factorizar es la operación que sostiene la criptografía moderna, precisamente porque con ' +
    'números grandes <strong>nadie sabe hacerla deprisa</strong>. Multiplicar dos primos de 300 ' +
    'cifras es instantáneo; recuperar los factores a partir del producto llevaría más años que la ' +
    'edad del universo con los ordenadores actuales. Esa asimetría —fácil en un sentido, imposible ' +
    'en el otro— es lo que protege tu cuenta del banco.');

  p.hist('Los griegos no escribían identidades, las dibujaban. El Libro II de los <em>Elementos</em> de ' +
    'Euclides, hacia el 300 a. C., contiene lo que hoy llamamos identidades notables enunciadas como ' +
    'teoremas sobre áreas de rectángulos, porque para ellos $a\\cdot b$ <em>era</em> un rectángulo y ' +
    '$a^2$ <em>era</em> un cuadrado. Esa es la razón de que sigamos diciendo «al cuadrado» y «al ' +
    'cubo», y también de que la demostración con el cuadrado partido en cuatro trozos siga siendo la ' +
    'más convincente.');

  p.section('Practica');

  p.exercise({
    title: 'Desarrolla la identidad notable',
    level: 'basico',
    gen: function (r) {
      var a = r.int(1, 6), b = r.int(1, 9);
      var t = r.int(0, 2);
      var lit = r.pick(['x', 'a', 'm']);
      var coefs;
      if (t === 0) coefs = [a * a, 2 * a * b, b * b];
      else if (t === 1) coefs = [a * a, -2 * a * b, b * b];
      else coefs = [a * a, 0, -b * b];
      return { a: a, b: b, t: t, lit: lit, coefs: coefs };
    },
    ask: function (d) {
      var A = (d.a === 1 ? '' : d.a) + d.lit;
      if (d.t === 0) return 'Desarrolla $\\left(' + A + ' + ' + d.b + '\\right)^2$';
      if (d.t === 1) return 'Desarrolla $\\left(' + A + ' - ' + d.b + '\\right)^2$';
      return 'Desarrolla $\\left(' + A + ' + ' + d.b + '\\right)\\left(' + A + ' - ' + d.b + '\\right)$';
    },
    fields: function (d) {
      return [
        { name: 'a', label: 'coef. de $' + d.lit + '^2$', w: 'tiny' },
        { name: 'b', label: 'coef. de $' + d.lit + '$', w: 'tiny' },
        { name: 'c', label: 'término indep.', w: 'tiny' }
      ];
    },
    sol: function (d) { return { a: d.coefs[0], b: d.coefs[1], c: d.coefs[2] }; },
    hint: function (d) {
      if (d.t === 2) return 'Suma por diferencia: los términos cruzados se van y queda $a^2-b^2$.';
      return 'Cuadrado del primero, más (o menos) el doble producto, más el cuadrado del segundo.';
    },
    steps: function (d) {
      var A = (d.a === 1 ? '' : d.a) + d.lit;
      if (d.t === 2) {
        return ['Es una suma por diferencia: $(A+B)(A-B) = A^2 - B^2$.',
          '$A = ' + A + ' \\Rightarrow A^2 = ' + d.coefs[0] + d.lit + '^2$; &nbsp; $B = ' + d.b + ' \\Rightarrow B^2 = ' + (d.b * d.b) + '$.',
          'Resultado: $' + ML.polyTex(d.coefs, d.lit) + '$'];
      }
      return ['Cuadrado del primero: $(' + A + ')^2 = ' + d.coefs[0] + d.lit + '^2$.',
        'Doble producto: $2 \\cdot ' + (d.a === 1 ? '' : d.a) + ' \\cdot ' + d.b + ' = ' + Math.abs(d.coefs[1]) + '$, con signo ' +
        (d.t === 0 ? 'más' : 'menos') + '.',
        'Cuadrado del segundo: $' + d.b + '^2 = ' + d.coefs[2] + '$.',
        'Resultado: $' + ML.polyTex(d.coefs, d.lit) + '$'];
    },
    answer: function (d) { return '$' + ML.polyTex(d.coefs, d.lit) + '$'; }
  });

  p.exercise({
    title: 'Saca factor común',
    level: 'basico',
    gen: function (r) {
      var k = r.int(2, 9), e = r.int(1, 2);
      var a = r.nz(-6, 6), b = r.nz(-6, 6), c = r.nz(-6, 6);
      if (ML.gcd(ML.gcd(a, b), c) !== 1) return null;
      return { k: k, e: e, a: a, b: b, c: c };
    },
    ask: function (d) {
      var t = function (co, ex) { return ML.termTex(d.k * co, 'x', ex + d.e, false); };
      var s = ML.termTex(d.k * d.a, 'x', 2 + d.e, true) + t(d.b, 1) + t(d.c, 0);
      return 'Saca todo el factor común que puedas de $' + s + '$ e indica el coeficiente y el ' +
        'exponente del factor extraído.';
    },
    fields: [{ name: 'c', label: 'Coeficiente', w: 'tiny' }, { name: 'e', label: 'Exponente de x', w: 'tiny' }],
    sol: function (d) { return { c: d.k, e: d.e }; },
    hint: function () { return 'El coeficiente es el m.c.d. de los tres números; el exponente, el menor de los tres.'; },
    steps: function (d) {
      return ['Coeficientes: $' + (d.k * d.a) + '$, $' + (d.k * d.b) + '$, $' + (d.k * d.c) + '$. Su m.c.d. es $' + d.k + '$.',
        'Exponentes de $x$: $' + (2 + d.e) + '$, $' + (1 + d.e) + '$, $' + d.e + '$. El menor es $' + d.e + '$.',
        'Se saca $' + d.k + 'x^{' + d.e + '}$ y dentro queda $(' + ML.polyTex([d.a, d.b, d.c]) + ')$.'];
    },
    answer: function (d) {
      return '$' + d.k + 'x^{' + d.e + '}\\left(' + ML.polyTex([d.a, d.b, d.c]) + '\\right)$';
    }
  });

  p.exercise({
    title: 'Reconoce la identidad al revés',
    level: 'medio',
    gen: function (r) {
      var a = r.int(1, 5), b = r.int(1, 9), t = r.int(0, 2);
      var coefs = t === 0 ? [a * a, 2 * a * b, b * b] : (t === 1 ? [a * a, -2 * a * b, b * b] : [a * a, 0, -b * b]);
      return { a: a, b: b, t: t, coefs: coefs };
    },
    ask: function (d) {
      return 'Factoriza $' + ML.polyTex(d.coefs) + '$ usando una identidad notable. ' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe la expresión factorizada, por ejemplo <code>(2x-3)^2</code> o <code>(x-3)(x+3)</code>.</span>';
    },
    sol: function (d) {
      var A = (d.a === 1 ? '' : d.a) + 'x';
      if (d.t === 2) return { f: '(' + A + '+' + d.b + ')(' + A + '-' + d.b + ')' };
      return { f: '(' + A + (d.t === 0 ? '+' : '-') + d.b + ')^2' };
    },
    check: function (v, d) {
      var raw = v.raw.f;
      if (!raw) return false;
      var orig = ML.polyTex(d.coefs).replace(/\^\{(\d+)\}/g, '^$1');
      if (!ML.equivalent(raw, orig, ['x'])) {
        return { ok: false, msg: '<strong>No es correcto.</strong> Esa expresión no vale lo mismo que la de partida.' };
      }
      if (!/\(/.test(raw)) {
        return { ok: false, msg: 'El valor es correcto, pero <strong>no está factorizado</strong>: tiene que quedar como un producto, con paréntesis.' };
      }
      return true;
    },
    hint: function (d) {
      if (d.t === 2) return 'Dos cuadrados restándose: es una suma por diferencia.';
      return 'Comprueba si el término del medio es el doble producto de las raíces de los extremos.';
    },
    steps: function (d) {
      var A = (d.a === 1 ? '' : d.a) + 'x';
      if (d.t === 2) return ['$' + d.coefs[0] + 'x^2$ es el cuadrado de $' + A + '$ y $' + (d.b * d.b) + '$ el de $' + d.b + '$.',
        'Como se restan, es suma por diferencia.',
        'Queda $(' + A + '+' + d.b + ')(' + A + '-' + d.b + ')$.'];
      return ['Los extremos son cuadrados: $' + A + '$ y $' + d.b + '$.',
        'Comprobamos el doble producto: $2\\cdot' + d.a + '\\cdot' + d.b + ' = ' + (2 * d.a * d.b) + '$ ✓',
        'Es un cuadrado perfecto: $(' + A + (d.t === 0 ? '+' : '-') + d.b + ')^2$.'];
    },
    answer: function (d) {
      var A = (d.a === 1 ? '' : d.a) + 'x';
      if (d.t === 2) return '$(' + A + '+' + d.b + ')(' + A + '-' + d.b + ')$';
      return '$(' + A + (d.t === 0 ? '+' : '-') + d.b + ')^2$';
    }
  });

  p.exercise({
    title: 'Multiplica de cabeza con la identidad',
    level: 'medio',
    gen: function (r) {
      var base = r.pick([20, 30, 40, 50, 60, 70, 100]);
      var k = r.int(1, 9);
      return { base: base, k: k, res: base * base - k * k };
    },
    ask: function (d) {
      return 'Calcula $' + (d.base - d.k) + ' \\cdot ' + (d.base + d.k) + '$ sin hacer la multiplicación ' +
        'larga, usando una identidad notable.';
    },
    fields: [{ name: 'v', label: 'Producto', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    hint: function (d) { return 'Los dos números están a la misma distancia de $' + d.base + '$.'; },
    steps: function (d) {
      return ['Escribimos los factores como $(' + d.base + ' - ' + d.k + ')(' + d.base + ' + ' + d.k + ')$.',
        'Es una suma por diferencia: $' + d.base + '^2 - ' + d.k + '^2$.',
        '$' + (d.base * d.base) + ' - ' + (d.k * d.k) + ' = ' + d.res + '$.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.keys([
    '$(a\\pm b)^2 = a^2 \\pm 2ab + b^2$ — el doble producto nunca se olvida.',
    '$(a+b)(a-b) = a^2-b^2$ — la más útil para calcular y para factorizar.',
    'Factorizar = escribir una suma como producto. Orden: factor común → identidad notable → raíces.',
    'Si conoces las raíces $x_1$ y $x_2$: $ax^2+bx+c = a(x-x_1)(x-x_2)$.',
    'Un producto es cero solo si algún factor es cero. Por eso factorizar resuelve ecuaciones.'
  ]);
});
