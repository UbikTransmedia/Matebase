/* Tema: Fracciones algebraicas */
Course.topic('al-fracciones-alg', function (p) {

  p.text('Una <strong>fracción algebraica</strong> es un cociente de polinomios. Se manejan ' +
    'exactamente igual que las fracciones numéricas: lo único nuevo es que ahora, para simplificar, ' +
    'hay que <strong>factorizar</strong> antes.');

  p.formula('\\frac{x^2-9}{x^2+5x+6} = \\frac{(x-3)(x+3)}{(x+2)(x+3)} = \\frac{x-3}{x+2}');

  p.note('Solo se pueden simplificar <strong>factores</strong>, nunca sumandos. En ' +
    '$\\frac{x+3}{x+5}$ no se puede tachar el $x$: no es un factor común, es un sumando. ' +
    'Este es, con diferencia, el error más repetido del tema.', 'warn', 'La regla de oro');

  p.text('Merece la pena entender <em>por qué</em>, porque quien lo entiende deja de cometer el error. ' +
    'Simplificar una fracción es dividir arriba y abajo por lo mismo, y para poder dividir todo el ' +
    'numerador entre algo, ese algo tiene que estar multiplicando a <strong>todo</strong> el ' +
    'numerador. Un factor multiplica al conjunto; un sumando solo es una parte.');

  p.text('Con números se ve enseguida y nadie se equivoca. En $\\frac{6}{9}$ puedes dividir entre 3 ' +
    'porque $6=3\\cdot 2$ y $9=3\\cdot 3$: el 3 multiplica a todo. Pero a nadie se le ocurre ' +
    'simplificar $\\frac{3+4}{3+5}$ tachando los treses para dejar $\\frac{4}{5}$, porque saltaría a ' +
    'la vista que $\\frac{7}{8}$ no es $\\frac{4}{5}$. Con letras el error se cuela porque no se ve ' +
    'el resultado, pero es exactamente el mismo disparate.');

  p.text('De ahí sale la regla práctica del tema: <strong>antes de simplificar, factoriza</strong>. ' +
    'Mientras haya sumas a la vista no se puede tachar nada; en cuanto todo esté escrito como ' +
    'producto, se tacha sin miedo.');

  p.demo({
    title: 'Simplificar: lo que se puede y lo que no',
    intro: 'Compara las dos expresiones evaluándolas en varios valores. Si la simplificación fuera legítima, las dos columnas coincidirían siempre.',
    build: function (host, d) {
      var caso = 'bien';
      var casos = {
        bien: {
          a: '\\dfrac{x^2-9}{x^2+5x+6}', b: '\\dfrac{x-3}{x+2}',
          fa: function (x) { return (x * x - 9) / (x * x + 5 * x + 6); },
          fb: function (x) { return (x - 3) / (x + 2); },
          ok: true, txt: 'Se han cancelado <strong>factores</strong> comunes: la simplificación es correcta (salvo en $x=-3$, donde la original no existe).'
        },
        mal: {
          a: '\\dfrac{x+3}{x+5}', b: '\\dfrac{3}{5}',
          fa: function (x) { return (x + 3) / (x + 5); },
          fb: function () { return 3 / 5; },
          ok: false, txt: '<strong style="color:var(--bad)">Mal.</strong> Se han tachado sumandos, no factores. Los valores no coinciden.'
        },
        mal2: {
          a: '\\dfrac{x^2+x}{x}', b: 'x^2',
          fa: function (x) { return (x * x + x) / x; },
          fb: function (x) { return x * x; },
          ok: false, txt: '<strong style="color:var(--bad)">Mal.</strong> Al sacar factor común queda $\\frac{x(x+1)}{x} = x+1$, no $x^2$.'
        }
      };
      var tabla = U.el('div');
      host.appendChild(tabla);
      var out = W.readout(host, '');
      function pinta() {
        var c = casos[caso];
        var xs = [-1, 0, 1, 2, 4, 10];
        var filas = xs.map(function (x) {
          var va = c.fa(x), vb = c.fb(x);
          var igual = (isFinite(va) && isFinite(vb) && Math.abs(va - vb) < 1e-9);
          return '<tr><td>' + x + '</td>' +
            '<td class="num">' + (isFinite(va) ? U.fmt(va, 4) : '—') + '</td>' +
            '<td class="num">' + (isFinite(vb) ? U.fmt(vb, 4) : '—') + '</td>' +
            '<td style="color:' + (igual ? 'var(--ok)' : 'var(--bad)') + '">' + (igual ? '✓' : '✗') + '</td></tr>';
        }).join('');
        tabla.innerHTML = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>x</th>' +
          '<th class="num">' + MathX.render(c.a) + '</th>' +
          '<th class="num">' + MathX.render(c.b) + '</th><th></th></tr></thead><tbody>' +
          filas + '</tbody></table></div>';
        out.set(c.txt);
      }
      W.chips(host, [
        { label: 'simplificación correcta', value: 'bien' },
        { label: 'tachar sumandos', value: 'mal' },
        { label: 'otro error típico', value: 'mal2' }
      ], { value: 'bien', on: function (v) { caso = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Valores prohibidos');

  p.text('Antes de nada hay que localizar los valores que anulan el denominador: ahí la fracción ' +
    'no existe. Y hay que buscarlos en el denominador <strong>original</strong>, no en el simplificado.');

  p.formula('\\frac{x^2-9}{x^2+5x+6}: \\quad x \\ne -2 \\ \\text{ y } \\ x \\ne -3');

  p.text('Aunque después de simplificar el $-3$ ya no aparezca, la expresión de partida seguía sin ' +
    'estar definida ahí. Es un agujero: exactamente la discontinuidad evitable que verás en límites.');

  p.util('Los valores prohibidos son la causa de una buena parte de los fallos de software. Cuando una ' +
    'aplicación se cierra sola o muestra un error incomprensible, muy a menudo es que algo ha ' +
    'acabado dividiendo entre cero: un promedio calculado sobre una lista vacía, un porcentaje sobre ' +
    'un total que resultó ser nulo. Localizar de antemano qué valores rompen una expresión es ' +
    'exactamente lo que hace un programador cuidadoso antes de publicar.');

  p.hist('La prohibición de dividir entre cero costó mucho asentarla. El matemático indio Brahmagupta, en ' +
    'el año 628, fue el primero en tratar el cero como un número con derecho propio, pero se ' +
    'equivocó justamente aquí: escribió que cero dividido entre cero es cero. Quinientos años ' +
    'después, Bhaskara propuso que dividir entre cero daba infinito, lo que tampoco funciona. Hizo ' +
    'falta el rigor del siglo XIX para aceptar la respuesta correcta, que es más humilde: esa ' +
    'operación sencillamente no está definida.');

  p.section('Operar');
  p.text('Buena noticia: no hay reglas nuevas que aprender. Las fracciones algebraicas se suman, restan, ' +
    'multiplican y dividen <strong>exactamente igual</strong> que las de números que ya manejas; lo ' +
    'único que cambia es que ahora en el numerador y el denominador hay polinomios en vez de cifras. ' +
    'Si dudas de un paso, hazlo primero con números pequeños y luego repítelo con letras: funciona ' +
    'igual.');


  p.formulas([
    '\\frac{A}{B} \\pm \\frac{C}{D} = \\frac{A D \\pm C B}{B D}',
    '\\frac{A}{B}\\cdot\\frac{C}{D} = \\frac{AC}{BD} \\qquad \\frac{A}{B}:\\frac{C}{D} = \\frac{AD}{BC}'
  ]);

  p.text('Para sumar conviene usar el <strong>mínimo común denominador</strong>, que se calcula ' +
    'factorizando los denominadores igual que con números: factores comunes y no comunes con el ' +
    'mayor exponente.');

  p.formula('\\frac{1}{x-2} + \\frac{3}{x+1} = \\frac{(x+1) + 3(x-2)}{(x-2)(x+1)} = \\frac{4x-5}{(x-2)(x+1)}');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Simplifica la fracción algebraica',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 6), b = r.pm(1, 6), c = r.pm(1, 6);
      if (a === b || b === c || a === c) return null;
      // (x-a)(x-b) / ((x-c)(x-b))  ->  (x-a)/(x-c)
      var num = ML.polyMul([1, -a], [1, -b]);
      var den = ML.polyMul([1, -c], [1, -b]);
      return { a: a, b: b, c: c, num: num, den: den };
    },
    ask: function (d) {
      return 'Simplifica $\\dfrac{' + ML.polyTex(d.num) + '}{' + ML.polyTex(d.den) + '}$ y escribe ' +
        'las raíces que quedan en el numerador y en el denominador de la fracción simplificada.';
    },
    fields: [
      { name: 'n', label: 'Raíz del numerador', w: 'tiny' },
      { name: 'd', label: 'Raíz del denominador', w: 'tiny' }
    ],
    sol: function (d) { return { n: d.a, d: d.c }; },
    hint: function (d) { return 'Factoriza arriba y abajo. Verás que comparten el factor $(x' + (d.b >= 0 ? '-' + d.b : '+' + (-d.b)) + ')$.'; },
    steps: function (d) {
      var f = function (x) { return '(x' + (x >= 0 ? '-' + x : '+' + (-x)) + ')'; };
      return ['Numerador: $' + ML.polyTex(d.num) + ' = ' + f(d.a) + f(d.b) + '$.',
        'Denominador: $' + ML.polyTex(d.den) + ' = ' + f(d.c) + f(d.b) + '$.',
        'Cancelamos el factor común $' + f(d.b) + '$ (válido siempre que $x \\ne ' + d.b + '$).',
        'Queda $\\dfrac{' + f(d.a) + '}{' + f(d.c) + '}$, con raíces $' + d.a + '$ arriba y $' + d.c + '$ abajo.'];
    },
    answer: function (d) {
      var f = function (x) { return '(x' + (x >= 0 ? '-' + x : '+' + (-x)) + ')'; };
      return '$\\dfrac{' + f(d.a) + '}{' + f(d.c) + '}$';
    }
  });

  p.exercise({
    title: 'Valores prohibidos',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(1, 7), b = r.pm(1, 7);
      if (a === b) return null;
      var den = ML.polyMul([1, -a], [1, -b]);
      return { a: Math.min(a, b), b: Math.max(a, b), den: den };
    },
    ask: function (d) {
      return '¿Para qué valores de $x$ <strong>no existe</strong> la fracción ' +
        '$\\dfrac{3x+1}{' + ML.polyTex(d.den) + '}$? Escríbelos en orden.';
    },
    fields: [{ name: 'a', label: 'Menor', w: 'tiny' }, { name: 'b', label: 'Mayor', w: 'tiny' }],
    sol: function (d) { return { a: d.a, b: d.b }; },
    hint: function () { return 'Los valores prohibidos son los que anulan el denominador: resuelve la ecuación de segundo grado.'; },
    steps: function (d) {
      return ['Igualamos el denominador a cero: $' + ML.polyTex(d.den) + ' = 0$.',
        'Sus raíces son $' + d.a + '$ y $' + d.b + '$.',
        'Ahí el denominador vale cero, así que la fracción no está definida.',
        'Dominio: $\\mathbb{R} - \\{' + d.a + ', ' + d.b + '\\}$.'];
    },
    answer: function (d) { return 'x ≠ ' + d.a + ' y x ≠ ' + d.b; }
  });

  p.exercise({
    title: 'Suma de fracciones algebraicas',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pm(1, 5), b = r.pm(1, 5), k1 = r.nz(-4, 4), k2 = r.nz(-4, 4);
      if (a === b) return null;
      // k1/(x-a) + k2/(x-b) = ((k1+k2)x - k1 b - k2 a) / ((x-a)(x-b))
      return { a: a, b: b, k1: k1, k2: k2, cx: k1 + k2, c0: -k1 * b - k2 * a };
    },
    ask: function (d) {
      var f = function (x) { return 'x' + (x >= 0 ? '-' + x : '+' + (-x)); };
      return 'Suma y simplifica: $\\dfrac{' + d.k1 + '}{' + f(d.a) + '} + \\dfrac{' + d.k2 + '}{' + f(d.b) + '}$<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Da los coeficientes del numerador resultante ' +
        '(en la forma $mx+n$).</span>';
    },
    fields: [{ name: 'm', label: 'Coef. de x', w: 'tiny' }, { name: 'n', label: 'Término indep.', w: 'tiny' }],
    sol: function (d) { return { m: d.cx, n: d.c0 }; },
    hint: function (d) {
      return 'El denominador común es el producto de los dos. Multiplica cada numerador por el denominador del otro.';
    },
    steps: function (d) {
      var f = function (x) { return '(x' + (x >= 0 ? '-' + x : '+' + (-x)) + ')'; };
      return ['Denominador común: $' + f(d.a) + f(d.b) + '$.',
        'Primer numerador: $' + d.k1 + f(d.b) + ' = ' + ML.termTex(d.k1, 'x', 1, true) + ML.termTex(-d.k1 * d.b, '', 0, false) + '$.',
        'Segundo numerador: $' + d.k2 + f(d.a) + ' = ' + ML.termTex(d.k2, 'x', 1, true) + ML.termTex(-d.k2 * d.a, '', 0, false) + '$.',
        'Sumando: $' + ML.polyTex([d.cx, d.c0]) + '$.',
        'Resultado: $\\dfrac{' + ML.polyTex([d.cx, d.c0]) + '}{' + f(d.a) + f(d.b) + '}$'];
    },
    answer: function (d) { return '$' + ML.polyTex([d.cx, d.c0]) + '$ en el numerador.'; }
  });

  p.keys([
    'Fracción algebraica = cociente de polinomios. Se opera igual que con números.',
    'Para simplificar hay que <strong>factorizar</strong> primero.',
    'Solo se cancelan <strong>factores</strong>, jamás sumandos.',
    'Los valores prohibidos se buscan en el denominador original, antes de simplificar.',
    'Para sumar, denominador común; para multiplicar y dividir, directo.'
  ]);
});
