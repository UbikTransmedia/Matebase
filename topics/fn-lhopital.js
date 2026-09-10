/* Tema: La regla de L'Hôpital */
Course.topic('fn-lhopital', function (p) {

  var F = ML.F;
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function k(n) { return n === 1 ? '' : (n === -1 ? '-' : String(n)); }

  p.text('En [[fn-limites]] las indeterminaciones se deshacían con álgebra: factorizar, multiplicar por ' +
    'el conjugado, dividir por la potencia mayor. Pero hay límites que no ceden a ningún truco ' +
    'algebraico, porque mezclan funciones de familias distintas: $\\frac{\\operatorname{sen} x}{x}$, ' +
    '$\\frac{e^x - 1}{x}$, $\\frac{\\ln x}{x}$. Para ellos está la herramienta más potente del cálculo ' +
    'de límites, y usa exactamente lo que ya sabes: <strong>derivar</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('La regla');

  p.formula('\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)} \\quad \\text{si el límite es de tipo } \\frac{0}{0} \\text{ o } \\frac{\\infty}{\\infty} \\text{ y el segundo existe}',
    'regla de L\'Hôpital',
    'Se lee: <em>«el límite del cociente es el límite del cociente de las derivadas»</em>. Vale también ' +
      'cuando $a$ es $\\pm\\infty$ y para límites laterales.<br><br>Atención a lo que <strong>no</strong> ' +
      'dice: no se deriva el cociente con la regla del cociente. Se derivan el numerador y el denominador ' +
      '<em>por separado</em>, cada uno por su lado.<br><br>Y tiene dos condiciones: que haya ' +
      'indeterminación $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$, y que el límite de la derecha exista ' +
      '(finito o infinito).');

  p.text('Por qué funciona, en el caso $\\frac{0}{0}$: si $f(a) = g(a) = 0$, cerca de $a$ cada función se ' +
    'parece a su recta tangente, $f(x) \\approx f\'(a)(x - a)$ y $g(x) \\approx g\'(a)(x - a)$. Al dividir, ' +
    'el factor $(x - a)$ se cancela y queda $\\frac{f\'(a)}{g\'(a)}$. Mirado muy de cerca, el cociente de ' +
    'dos funciones que se anulan es el cociente de sus pendientes. La demostración rigurosa usa el ' +
    'teorema del valor medio de [[fn-derivadas]].');

  p.demo({
    title: 'De cerca, dos curvas que se anulan son dos rectas',
    intro: 'Numerador e^x − 1 y denominador x, los dos valen 0 en x = 0. Acércate: las dos curvas se vuelven rectas por el origen, con pendientes 1 y 1. Su cociente se acerca al cociente de las pendientes.',
    build: function (host) {
      var CASOS = {
        exp: { t: '(eˣ − 1) / x', f: function (x) { return Math.exp(x) - 1; }, g: function (x) { return x; }, df: 1, dg: 1 },
        sen: { t: 'sen 3x / x', f: function (x) { return Math.sin(3 * x); }, g: function (x) { return x; }, df: 3, dg: 1 },
        ln: { t: 'ln(1 + 2x) / sen x', f: function (x) { return Math.log(1 + 2 * x); }, g: function (x) { return Math.sin(x); }, df: 2, dg: 1 }
      };
      var cual = 'exp', zoom = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1, xmax: 1, ymin: -1, ymax: 1, height: 300, equal: false,
        draw: function (g) {
          var c = CASOS[cual];
          g.fn(c.f, { color: 0, w: 2.6 });
          g.fn(c.g, { color: 1, w: 2.6 });
        }
      });
      function pinta() {
        var c = CASOS[cual], w = 1 / zoom;
        plot.view(-w, w, -2.2 * w, 2.2 * w);
        var x = w / 3;
        out.set('Función: $' + c.t.replace('eˣ', 'e^x').replace('sen', '\\operatorname{sen}').replace('ln', '\\ln') + '$ · en $x = ' + U.fmt(x, 4) + '$ el cociente vale $' + U.fmt(c.f(x) / c.g(x), 5) + '$<br>' +
          'Cociente de las pendientes en 0: $\\frac{f\'(0)}{g\'(0)} = \\frac{' + c.df + '}{' + c.dg + '} = ' + U.fmt(c.df / c.dg, 4) + '$');
      }
      W.chips(host, Object.keys(CASOS).map(function (q) { return { label: CASOS[q].t, value: q }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      W.slider(W.row(host), { label: 'acercarse (zoom)', min: 1, max: 60, step: 1, value: zoom, on: function (v) { zoom = v; pinta(); } });
      W.legend(host, [{ c: 0, t: 'numerador f(x)' }, { c: 1, t: 'denominador g(x)' }]);
      pinta();
    }
  });

  p.note('Antes de aplicar la regla, sustituye. Si no hay indeterminación, L\'Hôpital da resultados ' +
    'falsos: $\\lim_{x \\to 1} \\frac{x + 1}{x} = 2$ sustituyendo, pero derivando arriba y abajo saldría ' +
    '$\\frac{1}{1} = 1$. Y si el límite del cociente de derivadas no existe, la regla no dice nada: ' +
    '$\\lim_{x \\to \\infty} \\frac{x + \\operatorname{sen} x}{x} = 1$, aunque $\\frac{1 + \\cos x}{1}$ ' +
    'oscile sin límite.', 'warn', 'Las dos maneras de usarla mal');

  p.hist('La regla lleva el nombre de quien la publicó, no de quien la descubrió. Guillaume de l\'Hôpital, ' +
    'un marqués francés aficionado a las matemáticas, firmó en 1694 un contrato con el joven Johann ' +
    'Bernoulli: le pagaba una pensión a cambio de que le enviara por carta sus descubrimientos y no se los ' +
    'enseñara a nadie más. Con ese material escribió en 1696 el primer libro de texto de cálculo de la ' +
    'historia, <em>Análisis de los infinitamente pequeños</em>, y ahí apareció la regla. Bernoulli ' +
    'reclamó la autoría tras la muerte del marqués, y nadie le creyó hasta que, en el siglo XX, ' +
    'aparecieron las cartas.');

  /* ---------------------------------------------------------------- */
  p.section('Aplicarla varias veces');

  p.text('Si al derivar vuelve a salir una indeterminación, se aplica otra vez. Y otra, si hace falta. ' +
    'Pero hay que comprobar la indeterminación en cada paso: en cuanto deja de haberla, se sustituye.');

  p.formulas([
    '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} \\overset{0/0}{=} \\lim_{x \\to 0} \\frac{\\operatorname{sen} x}{2x} \\overset{0/0}{=} \\lim_{x \\to 0} \\frac{\\cos x}{2} = \\frac{1}{2}',
    '\\lim_{x \\to \\infty} \\frac{x^2}{e^x} \\overset{\\infty/\\infty}{=} \\lim_{x \\to \\infty} \\frac{2x}{e^x} \\overset{\\infty/\\infty}{=} \\lim_{x \\to \\infty} \\frac{2}{e^x} = 0'
  ], 'dos límites que piden dos pasos',
    'La marca sobre el igual indica qué indeterminación justifica cada paso: es lo que conviene escribir ' +
      'en un examen para que se vea que se ha comprobado.<br><br>El segundo dice algo importante: la ' +
      'exponencial crece más deprisa que cualquier potencia. Con $x^{10}$ harían falta diez pasos, pero ' +
      'el resultado sería el mismo.');

  /* ---------------------------------------------------------------- */
  p.section('Las otras indeterminaciones');

  p.text('L\'Hôpital solo trabaja con cocientes. Las demás indeterminaciones se transforman primero en un ' +
    'cociente:');

  p.table(['Tipo', 'Cómo se convierte en cociente'],
    [['$0\\cdot\\infty$', '$f\\cdot g = \\dfrac{f}{1/g}$: se baja uno de los factores al denominador'],
     ['$\\infty - \\infty$', 'se hace denominador común, o se multiplica por el conjugado'],
     ['$1^\\infty$, $0^0$, $\\infty^0$', 'se toman logaritmos: si $L = \\lim f^g$, entonces $\\ln L = \\lim g\\,\\ln f$, que es de tipo $0\\cdot\\infty$']]);

  p.formula('\\lim_{x \\to \\infty}\\left(1 + \\frac{a}{x}\\right)^{x} = e^a',
    'la potencia indeterminada más famosa',
    'Es de tipo $1^\\infty$: la base tiende a 1 y el exponente a infinito, y el resultado no es 1.<br><br>' +
      'Tomando logaritmos: $\\ln L = \\lim x\\ln\\left(1 + \\frac{a}{x}\\right)$, que escrito como ' +
      '$\\frac{\\ln(1 + a/x)}{1/x}$ es $\\frac{0}{0}$. Derivando arriba y abajo sale $a$, así que ' +
      '$L = e^a$. Con $a = 1$ es la definición del número [[fn-exp-log|$e$]].');

  p.demo({
    title: 'Uno elevado a infinito no es uno',
    intro: 'La base (1 + a/x) se acerca a 1 y el exponente x crece sin parar. ¿Quién gana? Ninguno: el resultado se estabiliza en eᵃ.',
    build: function (host) {
      var a = 1;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 40, ymin: 0, ymax: 8, height: 280, xlabel: 'x',
        draw: function (g) {
          g.hline(Math.exp(a), { color: 3, dash: true, w: 1.8 });
          g.fn(function (x) { return x <= 0 ? NaN : Math.pow(1 + a / x, x); }, { color: 0, w: 2.6, from: 0.3 });
          g.text(39, Math.exp(a) + 0.35, 'e^a', { align: 'right', color: 3, size: 13, box: true });
        }
      });
      function pinta() {
        out.set('$a = ' + U.fmt(a, 2) + '$: en $x = 40$ vale $' + U.fmt(Math.pow(1 + a / 40, 40), 4) + '$; en $x = 10\\,000$, $' + U.fmt(Math.pow(1 + a / 1e4, 1e4), 4) + '$. Límite: $e^{' + U.fmt(a, 2) + '} \\approx ' + U.fmt(Math.exp(a), 4) + '$');
        plot.view(0, 40, 0, Math.max(3, Math.exp(a) * 1.4));
      }
      W.slider(W.row(host), { label: 'a', min: 0.2, max: 2, step: 0.1, value: a, on: function (v) { a = v; pinta(); } });
      pinta();
    }
  });

  p.util('Estos límites dicen quién gana cuando dos cosas crecen a la vez, y esa pregunta está en todas ' +
    'partes. En informática, comparar $n\\ln n$ con $n^2$ decide qué algoritmo de ordenar sigue siendo ' +
    'rápido con un millón de datos. En finanzas, $\\left(1 + \\frac{r}{n}\\right)^n \\to e^r$ es el paso ' +
    'del interés compuesto al interés continuo. Y en física, $\\frac{\\operatorname{sen} x}{x} \\to 1$ es ' +
    'la aproximación de ángulo pequeño que permite resolver el péndulo y diseñar lentes, y la función ' +
    '$\\frac{\\operatorname{sen} x}{x}$ es la forma de la onda de difracción que se ve al pasar luz por una ' +
    'rendija.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Se puede aplicar ya?',
    level: 'basico',
    gen: function (r) {
      var a = r.int(1, 4), b = r.int(2, 5);
      var casos = [
        { l: '\\lim_{x \\to 0} \\dfrac{\\operatorname{sen} ' + a + 'x}{x}', ok: 'si', por: 'sustituyendo sale $\\frac{0}{0}$' },
        { l: '\\lim_{x \\to ' + a + '} \\dfrac{x + ' + b + '}{x}', ok: 'no', por: 'sustituyendo sale $\\frac{' + (a + b) + '}{' + a + '}$, que es un número: no hay indeterminación' },
        { l: '\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x^' + b + '}', ok: 'si', por: 'es $\\frac{\\infty}{\\infty}$' },
        { l: '\\lim_{x \\to 0^+} x^' + a + '\\ln x', ok: 'antes', por: 'es $0\\cdot\\infty$: hay que escribirlo como $\\frac{\\ln x}{x^{-' + a + '}}$ antes de derivar' },
        { l: '\\lim_{x \\to 0} \\dfrac{\\cos x}{x^2 + ' + b + '}', ok: 'no', por: 'sustituyendo sale $\\frac{1}{' + b + '}$: no hay indeterminación' },
        { l: '\\lim_{x \\to \\infty} \\left(1 + \\dfrac{' + a + '}{x}\\right)^x', ok: 'antes', por: 'es $1^\\infty$: hay que tomar logaritmos antes' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return '¿Se puede aplicar L\'Hôpital directamente a $' + d.l + '$?'; },
    fields: [{
      name: 't', label: 'Respuesta', opts: [
        { t: 'Sí, hay indeterminación 0/0 o ∞/∞', v: 'si' },
        { t: 'No: no hay indeterminación, se sustituye', v: 'no' },
        { t: 'Todavía no: primero hay que convertirlo en cociente', v: 'antes' }]
    }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return ['Sustituye primero y mira qué sale.', 'La regla solo trabaja con cocientes de tipo $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$.']; },
    steps: function (d) { return ['Se observa que ' + d.por + '.']; },
    answer: function (d) { return { si: 'Sí', no: 'No, no hay indeterminación', antes: 'Todavía no' }[d.ok]; }
  });

  p.exercise({
    title: 'Un 0/0 con exponenciales o senos',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 5), b = r.pm(1, 5), fam = r.int(0, 2);
      if (Math.abs(a) === Math.abs(b)) return null;
      var tex, num, den, df, dg;
      if (fam === 0) { tex = '\\dfrac{e^{' + k(a) + 'x} - 1}{' + k(b) + 'x}'; df = a; dg = b; }
      else if (fam === 1) { tex = '\\dfrac{\\operatorname{sen}(' + k(a) + 'x)}{\\operatorname{sen}(' + k(b) + 'x)}'; df = a; dg = b; }
      else { tex = '\\dfrac{\\ln(1 + ' + k(a) + 'x)}{' + k(b) + 'x}'; df = a; dg = b; }
      return { tex: tex, fam: fam, a: a, b: b, v: F(df, dg) };
    },
    ask: function (d) { return 'Calcula $\\lim_{x \\to 0} ' + d.tex + '$. (Vale una fracción.)'; },
    fields: [{ name: 'v', label: 'límite', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{
      si: function (v, d) { return Math.abs(v.v - d.b / d.a) < 1e-9; },
      msg: 'Está dado la vuelta: el numerador derivado va arriba y el denominador derivado abajo.'
    }],
    hint: function () { return ['Sustituye: sale $\\frac{0}{0}$.', 'Deriva el numerador y el denominador por separado (regla de la cadena en cada uno) y vuelve a sustituir $x = 0$.']; },
    steps: function (d) {
      var der = ['\\dfrac{' + k(d.a) + 'e^{' + k(d.a) + 'x}}{' + d.b + '}', '\\dfrac{' + k(d.a) + '\\cos(' + k(d.a) + 'x)}{' + k(d.b) + '\\cos(' + k(d.b) + 'x)}', '\\dfrac{' + d.a + '/(1 + ' + k(d.a) + 'x)}{' + d.b + '}'][d.fam];
      return ['Es $\\frac{0}{0}$, así que se aplica L\'Hôpital: $\\lim_{x \\to 0} ' + der + '$', 'Sustituyendo $x = 0$: $\\frac{' + d.a + '}{' + d.b + '} = ' + d.v.tex() + '$'];
    },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.exercise({
    title: 'Tres veces seguidas',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick([1, 2, 3, -1, -2]), fam = r.int(0, 1);
      if (fam === 0) return { fam: 0, a: a, tex: '\\dfrac{' + k(a) + 'x - \\operatorname{sen}(' + k(a) + 'x)}{x^3}', v: F(a * a * a, 6) };
      return { fam: 1, a: a, tex: '\\dfrac{1 - \\cos(' + k(a) + 'x)}{x^2}', v: F(a * a, 2) };
    },
    ask: function (d) { return 'Calcula $\\lim_{x \\to 0} ' + d.tex + '$. (Vale una fracción.)'; },
    fields: [{ name: 'v', label: 'límite', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{
      si: function (v, d) { return d.fam === 1 && Math.abs(v.v - d.a * d.a) < 1e-9 && d.a * d.a !== 0; },
      msg: 'Casi: al derivar $x^2$ dos veces sale $2$, no $1$. Revisa el denominador en el último paso.'
    }],
    hint: function (d) {
      return d.fam === 0
        ? ['Es $\\frac{0}{0}$. Deriva: $\\frac{' + d.a + ' - ' + d.a + '\\cos(' + d.a + 'x)}{3x^2}$, otra vez $\\frac{0}{0}$.', 'Sigue derivando hasta que desaparezca la indeterminación: hacen falta tres pasos.']
        : ['Es $\\frac{0}{0}$. Deriva: $\\frac{' + d.a + '\\operatorname{sen}(' + d.a + 'x)}{2x}$, otra vez $\\frac{0}{0}$.', 'Deriva una vez más y sustituye.'];
    },
    steps: function (d) {
      if (d.fam === 0) {
        return ['$\\overset{0/0}{=} \\lim \\dfrac{' + d.a + ' - ' + d.a + '\\cos(' + k(d.a) + 'x)}{3x^2}$',
          '$\\overset{0/0}{=} \\lim \\dfrac{' + (d.a * d.a) + '\\operatorname{sen}(' + k(d.a) + 'x)}{6x}$',
          '$\\overset{0/0}{=} \\lim \\dfrac{' + (d.a * d.a * d.a) + '\\cos(' + k(d.a) + 'x)}{6} = ' + d.v.tex() + '$'];
      }
      return ['$\\overset{0/0}{=} \\lim \\dfrac{' + d.a + '\\operatorname{sen}(' + k(d.a) + 'x)}{2x}$', '$\\overset{0/0}{=} \\lim \\dfrac{' + (d.a * d.a) + '\\cos(' + k(d.a) + 'x)}{2} = ' + d.v.tex() + '$'];
    },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.problem({
    title: 'Una potencia indeterminada',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pm(1, 3), b = r.pick([1, 2, 3, -1]), fam = r.int(0, 1);
      var tex = fam === 0 ? '\\lim_{x \\to \\infty}\\left(1 + \\dfrac{' + a + '}{x}\\right)^{' + k(b) + 'x}'
        : '\\lim_{x \\to 0}\\left(1 + ' + k(a) + 'x\\right)^{' + b + '/x}';
      return { a: a, b: b, fam: fam, tex: tex, ln: a * b, L: Math.exp(a * b) };
    },
    intro: function (d) { return 'Se quiere calcular $L = ' + d.tex + '$.'; },
    partes: [
      {
        ask: function () { return '¿De qué tipo de indeterminación se trata?'; },
        fields: [{ name: 't', label: 'Tipo', opts: [{ t: '$1^\\infty$', v: '1inf' }, { t: '$\\frac{\\infty}{\\infty}$', v: 'cociente' }, { t: '$0\\cdot\\infty$', v: 'producto' }, { t: 'No es indeterminación: vale 1', v: 'uno' }] }],
        sol: function () { return { t: '1inf' }; },
        errores: [{ si: function (v) { return v.raw.t === 'uno'; }, msg: 'Una base que <em>tiende</em> a 1 no es 1: elevada a algo que crece sin fin, puede dar cualquier cosa.' }],
        hint: function () { return 'Mira por separado a qué tiende la base y a qué tiende el exponente.'; },
        steps: function () { return ['La base tiende a 1 y el exponente a $\\pm\\infty$: indeterminación $1^\\infty$.']; },
        answer: function () { return '1^∞'; }
      },
      {
        ask: function () { return 'Tomando logaritmos, calcula $\\ln L$.'; },
        fields: [{ name: 'v', label: 'ln L', w: 'tiny' }],
        sol: function (d) { return { v: d.ln }; },
        tol: 1e-9,
        hint: function (d) {
          return d.fam === 0
            ? ['$\\ln L = \\lim ' + k(d.b) + 'x\\,\\ln\\left(1 + \\frac{' + d.a + '}{x}\\right)$: es $\\infty\\cdot 0$.', 'Escríbelo como $\\frac{' + d.b + '\\ln(1 + ' + d.a + '/x)}{1/x}$ y aplica L\'Hôpital.']
            : ['$\\ln L = \\lim \\frac{' + d.b + '\\ln(1 + ' + k(d.a) + 'x)}{x}$: es $\\frac{0}{0}$.', 'Deriva arriba y abajo y sustituye $x = 0$.'];
        },
        steps: function (d) {
          return d.fam === 0
            ? ['$\\ln L = \\lim_{x \\to \\infty} \\dfrac{' + d.b + '\\ln(1 + ' + d.a + '/x)}{1/x} \\overset{0/0}{=} \\lim \\dfrac{' + d.b + '\\cdot\\frac{-' + pa(d.a) + '/x^2}{1 + ' + d.a + '/x}}{-1/x^2} = \\lim \\dfrac{' + (d.a * d.b) + '}{1 + ' + d.a + '/x} = ' + d.ln + '$']
            : ['$\\ln L = \\lim_{x \\to 0} \\dfrac{' + d.b + '\\ln(1 + ' + k(d.a) + 'x)}{x} \\overset{0/0}{=} \\lim \\dfrac{' + d.b + '\\cdot\\frac{' + d.a + '}{1 + ' + k(d.a) + 'x}}{1} = ' + d.ln + '$'];
        },
        answer: function (d) { return String(d.ln); }
      },
      {
        ask: function () { return '¿Cuánto vale $L$? (cuatro decimales, o como potencia de $e$: <em>e^2</em>)'; },
        fields: [{ name: 'v', label: 'L', w: 'wide' }],
        sol: function (d) { return { v: U.round(d.L, 6) }; },
        tol: 3e-4,
        errores: [{ si: function (v, d) { return d.ln !== 1 && Math.abs(v.v - d.ln) < 1e-6; }, msg: 'Ese es $\\ln L$. Para despejar $L$ hay que deshacer el logaritmo: $L = e^{\\ln L}$.' }],
        hint: function () { return 'Si $\\ln L = c$, entonces $L = e^c$.'; },
        steps: function (d) { return ['$L = e^{' + d.ln + '} \\approx ' + U.fmt(d.L, 4) + '$']; },
        answer: function (d) { return '$e^{' + d.ln + '}$'; }
      }
    ]
  });

  p.exercise({
    title: 'Un infinito menos infinito',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pm(1, 4);
      return { a: a, v: F(-a, 2) };
    },
    ask: function (d) { return 'Calcula $\\lim_{x \\to 1} \\left(\\dfrac{' + d.a + '}{x - 1} - \\dfrac{' + d.a + '}{\\ln x}\\right)$. (Vale una fracción.)'; },
    fields: [{ name: 'v', label: 'límite', w: 'tiny' }],
    sol: function (d) { return { v: d.v.val() }; },
    tol: 1e-9,
    errores: [{ si: function (v, d) { return Math.abs(v.v + d.v.val()) < 1e-9; }, msg: 'Revisa el signo al hacer denominador común: el numerador es $' + '\\ln x - (x - 1)$, no al revés.' }],
    hint: function () {
      return ['Es $\\infty - \\infty$: haz denominador común.', 'Queda $\\frac{a(\\ln x - x + 1)}{(x - 1)\\ln x}$, de tipo $\\frac{0}{0}$.', 'Hace falta aplicar L\'Hôpital dos veces.'];
    },
    steps: function (d) {
      return ['Denominador común: $\\dfrac{' + d.a + '(\\ln x - x + 1)}{(x - 1)\\ln x}$, que es $\\frac{0}{0}$.',
        'Derivando: $\\dfrac{' + d.a + '(1/x - 1)}{\\ln x + (x - 1)/x}$, otra vez $\\frac{0}{0}$.',
        'Derivando de nuevo: $\\dfrac{' + d.a + '(-1/x^2)}{1/x + 1/x^2}$, que en $x = 1$ vale $\\frac{' + (-d.a) + '}{2} = ' + d.v.tex() + '$'];
    },
    answer: function (d) { return '$' + d.v.tex() + '$'; }
  });

  p.keys([
    'L\'Hôpital: si hay $\\frac{0}{0}$ o $\\frac{\\infty}{\\infty}$, el límite del cociente es el de las derivadas.',
    'Se derivan numerador y denominador <strong>por separado</strong>, no con la regla del cociente.',
    'Antes de aplicarla, se sustituye: sin indeterminación, da resultados falsos.',
    'Si vuelve a salir indeterminación, se aplica otra vez, comprobando en cada paso.',
    '$0\\cdot\\infty$ y $\\infty - \\infty$ se convierten primero en un cociente.',
    '$1^\\infty$, $0^0$ e $\\infty^0$: logaritmos, $\\ln L = \\lim g\\ln f$, y al final $L = e^{\\ln L}$.',
    '$\\lim_{x \\to \\infty}(1 + a/x)^x = e^a$; la exponencial gana a cualquier potencia, y cualquier potencia gana al logaritmo.'
  ]);
});
