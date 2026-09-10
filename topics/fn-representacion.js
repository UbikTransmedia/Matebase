/* Tema: Representación gráfica de funciones */
Course.topic('fn-representacion', function (p) {

  var F = ML.F;
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }

  p.puente('Dibujar una función haciendo una tabla de valores es una lotería: entre dos puntos calculados ' +
    'puede esconderse una asíntota, un máximo o un cambio de curvatura. Con lo aprendido en ' +
    '[[fn-limites]], [[fn-derivadas]] y [[fn-aplicaciones]] se puede hacer algo mucho mejor: deducir la ' +
    'forma entera de la gráfica <strong>antes de dibujar un solo punto</strong>, y después solo hay que ' +
    'unir lo que ya se sabe.');

  p.text('Es la pregunta que más cálculo junta en todo el curso, y precisamente por eso conviene hacerla ' +
    'siempre en el mismo orden. Cada paso usa lo anterior y aporta un trozo de la gráfica.');

  /* ---------------------------------------------------------------- */
  p.section('La lista de comprobación');

  p.list([
    '<strong>Dominio</strong>: dónde existe la función. Denominadores que se anulan, raíces pares de negativos, logaritmos de números no positivos.',
    '<strong>Simetrías</strong>: par si $f(-x) = f(x)$ (simétrica respecto del eje $y$), impar si $f(-x) = -f(x)$ (respecto del origen). Ahorran la mitad del trabajo.',
    '<strong>Cortes con los ejes</strong>: con el eje $y$, $f(0)$; con el eje $x$, las soluciones de $f(x) = 0$.',
    '<strong>Signo</strong>: en qué tramos la gráfica está por encima o por debajo del eje $x$.',
    '<strong>Asíntotas</strong>: verticales en los puntos que faltan del dominio; horizontales u oblicuas en $\\pm\\infty$.',
    '<strong>Monotonía y extremos</strong>, con el signo de $f\'$.',
    '<strong>Curvatura e inflexión</strong>, con el signo de $f\'\'$.',
    '<strong>Dibujo</strong>: se colocan asíntotas, cortes y extremos, y se unen respetando la monotonía y la curvatura.'
  ], true);

  p.formulas([
    'y = mx + n \\quad\\text{con}\\quad m = \\lim_{x \\to \\infty} \\frac{f(x)}{x}, \\qquad n = \\lim_{x \\to \\infty} \\bigl(f(x) - mx\\bigr)',
    '\\text{racional: si el grado de arriba es uno más que el de abajo, la oblicua es el cociente de la división}'
  ], 'asíntota oblicua',
    'Se lee: <em>«eme es el límite de efe de equis entre equis, y ene es el límite de efe de equis menos ' +
      'eme equis»</em>.<br><br>La idea: lejos, la gráfica se parece a una recta, así que $f(x)/x$ se ' +
      'acerca a la pendiente de esa recta, y lo que sobra al restarle $mx$ se acerca a la altura.<br><br>' +
      'Hay oblicua si $m$ es un número distinto de cero y $n$ también sale finito. Por el mismo lado, ' +
      'una función no puede tener a la vez asíntota horizontal y oblicua. En las racionales, la oblicua ' +
      'es directamente el cociente de dividir los polinomios.');

  p.comprueba('¿Qué asíntota tiene $f(x) = \\dfrac{2x^2 + 1}{x}$ en el infinito?', [
    { t: 'Horizontal $y = 2$', ok: false, por: 'El grado de arriba supera en uno al de abajo: no hay horizontal. $\\frac{2x^2 + 1}{x} = 2x + \\frac{1}{x}$, y lo que sobra tiende a 0.' },
    { t: 'Oblicua $y = 2x$', ok: true, por: 'Dividiendo, $f(x) = 2x + \\frac{1}{x}$: lejos, la gráfica se pega a la recta $y = 2x$. Además, vertical en $x = 0$.' },
    { t: 'No tiene: se va a infinito', ok: false, por: 'Irse a infinito no impide tener asíntota oblicua: se va a infinito <em>pegada</em> a la recta $y = 2x$.' }
  ]);

  p.ejemplo({
    title: 'Un estudio completo de una racional',
    enunciado: 'Representar $f(x) = \\dfrac{x^2 - 1}{x}$.',
    pasos: [
      { t: '<strong>Dominio y simetría.</strong> $\\mathbb{R}\\setminus\\{0\\}$. Y $f(-x) = \\dfrac{x^2 - 1}{-x} = -f(x)$: impar, simétrica respecto del origen. Basta estudiar $x > 0$ y reflejar.', antes: '¿Qué le pasa a $f$ al cambiar $x$ por $-x$?' },
      { t: '<strong>Cortes y signo.</strong> $f(x) = 0 \\iff x^2 = 1 \\iff x = \\pm 1$. No corta al eje $y$ (el 0 no está en el dominio). Para $x > 1$ es positiva; en $(0, 1)$, negativa.' },
      { t: '<strong>Asíntotas.</strong> Vertical $x = 0$ (el numerador vale $-1$, no se anula). Oblicua: $f(x) = x - \\dfrac{1}{x}$, así que $y = x$.', antes: 'Divide $x^2 - 1$ entre $x$. ¿Cuál es la oblicua?' },
      { t: '<strong>Monotonía.</strong> $f\'(x) = 1 + \\dfrac{1}{x^2} > 0$ siempre: creciente en cada trozo del dominio, sin extremos.', antes: 'Deriva $x - \\frac{1}{x}$. ¿Puede anularse?' },
      { t: '<strong>Curvatura.</strong> $f\'\'(x) = -\\dfrac{2}{x^3}$: positiva para $x < 0$ (sonríe), negativa para $x > 0$ (cara triste). No hay inflexión, porque en $x = 0$ no existe.' },
      { t: '<strong>Dibujo.</strong> Para $x > 0$: sale de $-\\infty$ pegada a $x = 0$, cruza en $(1, 0)$ y se acerca a $y = x$ por debajo, siempre subiendo. Para $x < 0$, la imagen girada media vuelta.', antes: 'Con asíntotas, cortes, monotonía y curvatura, ¿por dónde puede pasar la curva a la derecha del eje?' }
    ],
    cierre: 'Sin una sola tabla de valores. La simetría impar ahorró la mitad del trabajo, y la oblicua salió de una división de un solo paso.'
  });

  p.demo({
    title: 'Construir la gráfica paso a paso',
    intro: 'f(x) = x² / (x − 1). Pulsa «Siguiente» y cada paso de la lista añade lo que aporta. La curva aparece al final, cuando ya no queda nada que adivinar.',
    predice: 'Antes de empezar: $\\frac{x^2}{x - 1}$ tiene grado 2 arriba y 1 abajo. ¿Tendrá asíntota horizontal u oblicua? ¿Y dónde estará la vertical?',
    build: function (host) {
      var paso = 0;
      var f = function (x) { return x * x / (x - 1); };
      var TXT = [
        'Empezamos con los ejes vacíos.',
        '<strong>Dominio</strong>: $\\mathbb{R} \\setminus \\{1\\}$. En $x = 1$ hay un hueco.',
        '<strong>Cortes</strong>: $f(0) = 0$, y $x^2 = 0$ solo en $x = 0$. Corta a los dos ejes en el origen.',
        '<strong>Asíntotas</strong>: vertical $x = 1$ (el denominador se anula y el numerador no). Oblicua: dividiendo, $\\frac{x^2}{x-1} = x + 1 + \\frac{1}{x-1}$, así que $y = x + 1$.',
        '<strong>Extremos</strong>: $f\'(x) = \\frac{x(x-2)}{(x-1)^2}$ se anula en 0 y 2. Máximo relativo en $(0, 0)$ y mínimo relativo en $(2, 4)$.',
        '<strong>Curvatura</strong>: $f\'\'(x) = \\frac{2}{(x-1)^3}$, cóncava hacia abajo si $x < 1$ y hacia arriba si $x > 1$. Sin inflexión (en $x = 1$ no está definida).',
        '<strong>Dibujo</strong>: con todo lo anterior, la curva ya solo puede ir por un sitio.'
      ];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 5, ymin: -7, ymax: 9, height: 340,
        draw: function (g) {
          if (paso >= 1) g.vline(1, { color: 'axis', dash: [3, 5], w: 1 });
          if (paso >= 2) g.point(0, 0, { color: 2, r: 5 });
          if (paso >= 3) {
            g.vline(1, { color: 3, dash: true, w: 1.8 });
            g.fn(function (x) { return x + 1; }, { color: 3, dash: true, w: 1.8 });
          }
          if (paso >= 4) { g.point(0, 0, { color: 1, r: 6, label: 'máx' }); g.point(2, 4, { color: 1, r: 6, label: 'mín' }); }
          if (paso >= 6) g.fn(f, { color: 0, w: 2.8 });
        }
      });
      function pinta() { out.set('Paso ' + paso + ' de 6. ' + TXT[paso]); plot.render(); }
      W.buttons(host, [
        { t: 'Siguiente →', cls: 'btn--main', on: function () { if (paso < 6) { paso++; pinta(); } } },
        { t: '↺ Empezar', on: function () { paso = 0; pinta(); } }
      ]);
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Con exponenciales y logaritmos');

  p.text('Las funciones que mezclan exponenciales, logaritmos y polinomios son las favoritas del examen, ' +
    'porque obligan a usar la [[fn-lhopital|regla de L\'Hôpital]] para las asíntotas y porque su ' +
    'comportamiento es distinto a cada lado. Tres reglas ahorran casi todas las cuentas:');

  p.list([
    '$e^x$ se va a 0 cuando $x \\to -\\infty$ y gana a cualquier potencia cuando $x \\to +\\infty$: $x^n e^{-x} \\to 0$.',
    '$\\ln x$ solo existe para $x > 0$, y cualquier potencia le gana: $\\frac{\\ln x}{x} \\to 0$ y $x\\ln x \\to 0$ cuando $x \\to 0^+$.',
    'La asíntota horizontal puede estar <strong>solo por un lado</strong>: $xe^{-x}$ tiene $y = 0$ hacia la derecha, pero hacia la izquierda se va a $-\\infty$.'
  ]);

  p.demo({
    title: 'Cinco gráficas que conviene reconocer',
    intro: 'Elige una función. Los puntos marcados son los extremos y las inflexiones que salen de sus derivadas; debajo, el resumen que se escribiría en un examen.',
    predice: 'Antes de pulsar «ln x / x»: ¿dónde corta al eje $x$? ¿Hacia dónde va cuando $x \\to 0^+$? ¿Y cuando $x \\to +\\infty$, quién gana, el logaritmo o la $x$?',
    build: function (host) {
      var CASOS = {
        xe: { t: 'x·e⁻ˣ', f: function (x) { return x * Math.exp(-x); }, v: [-1.5, 6, -1.5, 1], ext: [[1, Math.exp(-1), 'máx']], inf: [[2, 2 * Math.exp(-2)]], txt: 'Dominio $\\mathbb{R}$. Corta en el origen. Asíntota horizontal $y = 0$ solo hacia $+\\infty$. Máximo en $(1, 1/e)$, inflexión en $(2, 2/e^2)$.' },
        lnx: { t: 'ln x / x', f: function (x) { return x <= 0 ? NaN : Math.log(x) / x; }, v: [-0.5, 12, -2, 0.8], ext: [[Math.E, 1 / Math.E, 'máx']], inf: [[Math.pow(Math.E, 1.5), 1.5 * Math.pow(Math.E, -1.5)]], txt: 'Dominio $(0, \\infty)$. Corta el eje $x$ en $x = 1$. Asíntota vertical $x = 0$ y horizontal $y = 0$. Máximo en $(e, 1/e)$, inflexión en $x = e^{3/2}$.' },
        agnesi: { t: 'curva de Agnesi 1/(1 + x²)', f: function (x) { return 1 / (1 + x * x); }, v: [-4, 4, -0.3, 1.3], ext: [[0, 1, 'máx']], inf: [[1 / Math.sqrt(3), 0.75], [-1 / Math.sqrt(3), 0.75]], txt: 'Par. Dominio $\\mathbb{R}$, siempre positiva. Asíntota horizontal $y = 0$ por los dos lados. Máximo en $(0, 1)$ e inflexiones en $x = \\pm\\frac{1}{\\sqrt{3}}$.' },
        ex: { t: 'eˣ / x', f: function (x) { return Math.exp(x) / x; }, v: [-4, 3, -6, 8], ext: [[1, Math.E, 'mín']], inf: [], txt: 'Dominio $\\mathbb{R} \\setminus \\{0\\}$. Asíntota vertical $x = 0$, horizontal $y = 0$ hacia $-\\infty$. Mínimo relativo en $(1, e)$. Sin inflexiones.' },
        xln: { t: 'x·ln x', f: function (x) { return x <= 0 ? NaN : x * Math.log(x); }, v: [-0.3, 2.5, -0.6, 2], ext: [[1 / Math.E, -1 / Math.E, 'mín']], inf: [], txt: 'Dominio $(0, \\infty)$, pero $x\\ln x \\to 0$ al acercarse a 0: no hay asíntota vertical. Mínimo en $(1/e, -1/e)$. Siempre cóncava hacia arriba.' }
      };
      var cual = 'xe';
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.5, xmax: 6, ymin: -1.5, ymax: 1, height: 300,
        draw: function (g) {
          var c = CASOS[cual];
          g.fn(c.f, { color: 0, w: 2.8 });
          c.ext.forEach(function (e) { g.point(e[0], e[1], { color: 1, r: 5, label: e[2] }); });
          c.inf.forEach(function (e) { g.point(e[0], e[1], { color: 2, r: 4.5 }); });
        }
      });
      function pinta() { var c = CASOS[cual]; plot.view(c.v[0], c.v[1], c.v[2], c.v[3]); out.set(c.txt); }
      W.chips(host, Object.keys(CASOS).map(function (q) { return { label: CASOS[q].t, value: q }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      W.legend(host, [{ c: 1, t: 'extremos relativos' }, { c: 2, t: 'puntos de inflexión' }]);
      pinta();
    }
  });

  p.hist('La tercera curva de ese ejemplo tiene un nombre extraño en inglés, <em>witch of Agnesi</em>, «la ' +
    'bruja de Agnesi», y viene de un error de traducción. Maria Gaetana Agnesi, en Milán, publicó en 1748 ' +
    'las <em>Instituzioni analitiche</em>, uno de los primeros manuales completos de cálculo diferencial ' +
    'e integral, pensado para enseñar. Llamó a la curva <em>versiera</em>, «la que gira», y un traductor ' +
    'inglés lo confundió con <em>avversiera</em>, «bruja». El libro fue tan bueno que la Academia de ' +
    'Bolonia la nombró profesora; ella acabó dejando las matemáticas para dedicarse a cuidar a los pobres ' +
    'y a los enfermos de su ciudad.');

  /* ---------------------------------------------------------------- */
  p.section('Problemas inversos: de las propiedades a la fórmula');

  p.text('La pregunta también se hace al revés: <em>«halla $a$, $b$ y $c$ para que $f$ tenga un mínimo ' +
    'en $x = 1$, un punto de inflexión en $x = 2$ y pase por el origen»</em>. La clave es traducir cada ' +
    'frase a una ecuación, y luego resolver el sistema.');

  p.table(['Si el enunciado dice…', '…se escribe'],
    [['pasa por el punto $(x_0, y_0)$', '$f(x_0) = y_0$'],
     ['tiene un extremo (o tangente horizontal) en $x_0$', '$f\'(x_0) = 0$'],
     ['tiene un punto de inflexión en $x_0$', '$f\'\'(x_0) = 0$'],
     ['la tangente en $x_0$ tiene pendiente $m$', '$f\'(x_0) = m$'],
     ['tiene la asíntota horizontal $y = k$', '$\\lim_{x \\to \\infty} f(x) = k$']]);

  p.note('Que $f\'(x_0) = 0$ es necesario para un extremo, pero no suficiente: $x^3$ tiene derivada nula ' +
    'en 0 y ahí no hay extremo. En un problema inverso se usa la condición para plantear la ecuación, y ' +
    'al final se comprueba con $f\'\'$ o con el cambio de signo de $f\'$ que el punto es de verdad lo ' +
    'que se pedía.', 'warn', 'Necesario no es suficiente');

  p.util('Leer la forma de una gráfica es leer una historia. En farmacología, la concentración de un ' +
    'medicamento en sangre tras tomarlo sigue una curva del tipo $C(t) = a\\,t\\,e^{-bt}$, la del primer ' +
    'ejemplo: el máximo dice cuándo hace más efecto y a qué concentración, y el punto de inflexión, a ' +
    'partir de cuándo empieza a eliminarse más despacio, que es lo que decide cada cuántas horas tomar la ' +
    'siguiente dosis. En economía, las curvas de coste se leen igual: el mínimo del coste medio es el ' +
    'tamaño de producción más eficiente.');

  p.trampas([
    { e: 'Asíntota horizontal y oblicua por el mismo lado', por: 'Son excluyentes: si $f(x)/x$ tiende a un número distinto de cero hay oblicua; si $f$ tiende a un número, horizontal. Nunca las dos.' },
    { e: 'Dar por hecho que la asíntota horizontal vale por los dos lados', por: '$x e^{-x}$ tiene $y = 0$ hacia $+\\infty$ y se va a $-\\infty$ hacia la izquierda. Hay que mirar los dos límites.' },
    { e: 'Estudiar simetrías antes que el dominio', por: 'Si el dominio no es simétrico (por ejemplo $(0, +\\infty)$ para $\\ln x$), la función no puede ser par ni impar, y el cálculo sobra.' },
    { e: '«$f\'(x_0) = 0$ en un problema inverso, luego ya hay extremo»', por: 'La condición sirve para plantear la ecuación; al final hay que comprobar con $f\'\'$ o con el cambio de signo de $f\'$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Horizontal, oblicua o ninguna',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { f: '\\dfrac{3x + 1}{x - 2}', t: 'h', por: 'los grados son iguales: horizontal $y = 3$' },
        { f: '\\dfrac{x^2 + 4}{x + 1}', t: 'o', por: 'el grado de arriba supera en uno al de abajo: oblicua $y = x - 1$' },
        { f: '\\dfrac{5}{x^2 + 1}', t: 'h', por: 'el grado de abajo es mayor: horizontal $y = 0$' },
        { f: '\\dfrac{x^3}{x + 1}', t: 'n', por: 'el grado de arriba supera en dos: ni horizontal ni oblicua, se va a infinito como una parábola' },
        { f: '\\dfrac{2x^2 - x}{x^2 + 3}', t: 'h', por: 'grados iguales: horizontal $y = 2$' },
        { f: '\\dfrac{x^2 - 1}{2x}', t: 'o', por: 'un grado más arriba: oblicua $y = \\frac{x}{2}$' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return 'En el infinito, $f(x) = ' + d.f + '$ tiene…'; },
    fields: [{ name: 't', label: 'Asíntota', opts: [{ t: 'horizontal', v: 'h' }, { t: 'oblicua', v: 'o' }, { t: 'ninguna de las dos', v: 'n' }] }],
    sol: function (d) { return { t: d.t }; },
    hint: function () { return 'Compara los grados: iguales o mayor abajo, horizontal; exactamente uno más arriba, oblicua; dos o más, ninguna.'; },
    steps: function (d) { return ['Se observa que ' + d.por + '.']; },
    answer: function (d) { return { h: 'Horizontal', o: 'Oblicua', n: 'Ninguna' }[d.t]; }
  });

  p.exercise({
    title: 'La asíntota oblicua de una racional',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 3), b = r.pm(0, 5), c = r.pm(1, 6), dd = r.pm(1, 4);
      // (a x^2 + b x + c)/(x - dd) = a x + (b + a dd) + resto/(x - dd)
      var resto = a * dd * dd + b * dd + c;
      if (!resto) return null;
      return { a: a, b: b, c: c, dd: dd, m: a, n: b + a * dd };
    },
    ask: function (d) { return 'Halla la asíntota oblicua $y = mx + n$ de $f(x) = \\dfrac{' + ML.polyTex([d.a, d.b, d.c]) + '}{x - ' + pa(d.dd) + '}$.'; },
    fields: [{ name: 'm', label: 'm =', w: 'tiny' }, { name: 'n', label: 'n =', w: 'tiny' }],
    sol: function (d) { return { m: d.m, n: d.n }; },
    errores: [{
      si: function (v, d) { return v.m === d.m && v.n === d.b && d.n !== d.b; },
      msg: 'La pendiente está bien, pero $n$ no es el coeficiente de $x$ del numerador: hay que hacer la división entera (o el límite de $f(x) - mx$).'
    }],
    hint: function () { return ['Divide el numerador entre el denominador (Ruffini sirve).', 'El cociente $mx + n$ es la asíntota; el resto no importa.']; },
    steps: function (d) {
      return ['Dividiendo por Ruffini entre $x - ' + pa(d.dd) + '$: cociente $' + ML.polyTex([d.m, d.n]) + '$ y resto $' + (d.a * d.dd * d.dd + d.b * d.dd + d.c) + '$.',
        'Asíntota oblicua: $y = ' + ML.polyTex([d.m, d.n]) + '$.'];
    },
    answer: function (d) { return '$y = ' + ML.polyTex([d.m, d.n]) + '$'; }
  });

  p.exercise({
    title: 'Extremo de x·e^{ax}',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([1, 2, 3, -1, -2, -3]);
      return { a: a, x: F(-1, a), tipo: a > 0 ? 'min' : 'max' };
    },
    ask: function (d) { return 'Halla el extremo relativo de $f(x) = x\\,e^{' + (d.a === 1 ? '' : (d.a === -1 ? '-' : d.a)) + 'x}$ e indica si es máximo o mínimo.'; },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }, { name: 't', label: 'es un', opts: [{ t: 'máximo', v: 'max' }, { t: 'mínimo', v: 'min' }] }],
    sol: function (d) { return { x: d.x.val(), t: d.tipo }; },
    check: function (v, d) {
      var okx = Math.abs(v.x - d.x.val()) < 1e-9, okt = v.raw.t === d.tipo;
      if (isNaN(v.x) && !v.raw.t) return { ok: false, msg: 'Da el valor de $x$ y elige máximo o mínimo.' };
      return { ok: okx && okt, fields: { x: okx, t: okt } };
    },
    hint: function (d) { return ['Deriva con la regla del producto: $f\'(x) = e^{' + d.a + 'x}(1 + ' + d.a + 'x)$.', 'La exponencial nunca se anula: iguala a cero el paréntesis. Para la naturaleza, mira el signo de $f\'$ a cada lado.']; },
    steps: function (d) {
      return ['$f\'(x) = e^{' + d.a + 'x} + ' + d.a + 'x\\,e^{' + d.a + 'x} = e^{' + d.a + 'x}(1 + ' + d.a + 'x)$',
        '$1 + ' + d.a + 'x = 0 \\Rightarrow x = ' + d.x.tex() + '$',
        'Como $e^{' + d.a + 'x} > 0$, el signo de $f\'$ es el de $1 + ' + d.a + 'x$: ' + (d.a > 0 ? 'negativo antes y positivo después' : 'positivo antes y negativo después') + '. Es un <strong>' + (d.tipo === 'min' ? 'mínimo' : 'máximo') + '</strong>.'];
    },
    answer: function (d) { return (d.tipo === 'min' ? 'mínimo' : 'máximo') + ' en x = ' + d.x.toString(); }
  });

  p.exercise({
    title: 'Raíz doble de la derivada',
    level: 'medio',
    gen: function (r) {
      var a = r.int(-3, 3), b = r.int(-3, 3);
      if (a === b) return null;
      var preg = r.pick(['a', 'b']);
      return { a: a, b: b, preg: preg, x: preg === 'a' ? a : b, t: preg === 'a' ? 'min' : 'nada' };
    },
    ask: function (d) {
      return 'La derivada de una función es $f\'(x) = (x - ' + pa(d.a) + ')(x - ' + pa(d.b) + ')^2$. ¿Qué hay en $x = ' + d.x + '$?';
    },
    fields: [{ name: 't', label: 'En ese punto hay', opts: [{ t: 'un máximo relativo', v: 'max' }, { t: 'un mínimo relativo', v: 'min' }, { t: 'no hay extremo', v: 'nada' }] }],
    sol: function (d) { return { t: d.t }; },
    errores: [{
      si: function (v, d) { return d.t === 'nada' && v.raw.t !== 'nada'; },
      msg: 'La derivada se anula ahí, pero el factor está al cuadrado: no cambia de signo al pasar por el punto.'
    }],
    hint: function () { return ['Un extremo necesita que $f\'$ <strong>cambie de signo</strong>, no solo que se anule.', 'Un factor al cuadrado nunca es negativo: no cambia el signo del producto.']; },
    steps: function (d) {
      return d.t === 'min'
        ? ['El factor $(x - ' + pa(d.b) + ')^2$ es siempre $\\ge 0$, así que el signo de $f\'$ cerca de $x = ' + d.a + '$ es el de $x - ' + pa(d.a) + '$: negativo antes, positivo después.', 'Decrece y luego crece: <strong>mínimo relativo</strong>.']
        : ['En $x = ' + d.b + '$ se anula el factor $(x - ' + pa(d.b) + ')^2$, que no cambia de signo al pasar por él.', '$f\'$ tiene el mismo signo a los dos lados: <strong>no hay extremo</strong> (es un punto de tangente horizontal, como el de $x^3$ en 0).'];
    },
    answer: function (d) { return d.t === 'min' ? 'mínimo relativo' : 'no hay extremo'; }
  });

  p.problem({
    title: 'Hallar los coeficientes de una cúbica',
    level: 'avanzado',
    gen: function (r) {
      var x1 = r.int(-2, 3), x2 = r.int(-2, 3);
      if (x1 === x2) return null;
      var c = r.pm(0, 5);
      var a = -3 * x2, b = -3 * x1 * x1 - 2 * a * x1;
      return { x1: x1, x2: x2, c: c, a: a, b: b, tipo: x1 > x2 ? 'min' : 'max' };
    },
    intro: function (d) {
      return 'La función $f(x) = x^3 + ax^2 + bx + c$ tiene un extremo relativo en $x = ' + d.x1 + '$, un punto de inflexión en $x = ' + d.x2 + '$ y corta al eje $y$ en $(0,\\ ' + d.c + ')$.';
    },
    partes: [
      {
        ask: function () { return 'Usa la condición de inflexión: ¿cuánto vale $a$?'; },
        fields: [{ name: 'a', label: 'a =', w: 'tiny' }],
        sol: function (d) { return { a: d.a }; },
        hint: function (d) { return ['$f\'\'(x) = 6x + 2a$.', 'Inflexión en $x = ' + d.x2 + '$ significa $f\'\'(' + d.x2 + ') = 0$.']; },
        steps: function (d) { return ['$f\'\'(' + d.x2 + ') = 6\\cdot' + pa(d.x2) + ' + 2a = 0 \\Rightarrow a = ' + d.a + '$']; },
        answer: function (d) { return 'a = ' + d.a; }
      },
      {
        ask: function () { return 'Usa la condición de extremo: ¿cuánto vale $b$?'; },
        fields: [{ name: 'b', label: 'b =', w: 'tiny' }],
        sol: function (d) { return { b: d.b }; },
        hint: function (d) { return ['$f\'(x) = 3x^2 + 2ax + b$, con el $a$ que ya tienes.', 'Extremo en $x = ' + d.x1 + '$: $f\'(' + d.x1 + ') = 0$.']; },
        steps: function (d) { return ['$f\'(' + d.x1 + ') = 3\\cdot' + pa(d.x1) + '^2 + 2\\cdot' + pa(d.a) + '\\cdot' + pa(d.x1) + ' + b = 0 \\Rightarrow b = ' + d.b + '$']; },
        answer: function (d) { return 'b = ' + d.b; }
      },
      {
        ask: function () { return '¿Cuánto vale $c$?'; },
        fields: [{ name: 'c', label: 'c =', w: 'tiny' }],
        sol: function (d) { return { c: d.c }; },
        hint: function () { return 'Cortar al eje $y$ en $(0, k)$ significa $f(0) = k$.'; },
        steps: function (d) { return ['$f(0) = c = ' + d.c + '$']; },
        answer: function (d) { return 'c = ' + d.c; }
      },
      {
        ask: function (d) { return 'El extremo en $x = ' + d.x1 + '$, ¿es máximo o mínimo?'; },
        fields: [{ name: 't', label: 'Es un', opts: [{ t: 'máximo relativo', v: 'max' }, { t: 'mínimo relativo', v: 'min' }] }],
        sol: function (d) { return { t: d.tipo }; },
        hint: function (d) { return 'Mira el signo de $f\'\'(' + d.x1 + ')$.'; },
        steps: function (d) { return ['$f\'\'(' + d.x1 + ') = 6\\cdot' + pa(d.x1) + ' + 2\\cdot' + pa(d.a) + ' = ' + (6 * d.x1 + 2 * d.a) + '$, ' + (d.tipo === 'min' ? 'positivo: <strong>mínimo</strong>.' : 'negativo: <strong>máximo</strong>.')]; },
        answer: function (d) { return d.tipo === 'min' ? 'mínimo' : 'máximo'; }
      }
    ]
  });

  p.exercise({
    title: 'El punto de inflexión de x·e^{−kx}',
    level: 'avanzado',
    gen: function (r) {
      var kk = r.pick([1, 2, 3, 4]);
      return { k: kk, x: F(2, kk), y: (2 / kk) * Math.exp(-2) };
    },
    ask: function (d) { return 'Halla el punto de inflexión de $f(x) = x\\,e^{-' + (d.k === 1 ? '' : d.k) + 'x}$ (la $y$ con cuatro decimales).'; },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }, { name: 'y', label: 'y =', w: 'wide' }],
    sol: function (d) { return { x: d.x.val(), y: U.round(d.y, 6) }; },
    tol: 3e-4,
    errores: [{
      si: function (v, d) { return Math.abs(v.x - 1 / d.k) < 1e-6; },
      msg: 'Ese $x$ anula la <strong>primera</strong> derivada: es el máximo. La inflexión sale de la segunda.'
    }],
    hint: function (d) { return ['$f\'(x) = e^{-' + d.k + 'x}(1 - ' + d.k + 'x)$.', 'Deriva otra vez: $f\'\'(x) = e^{-' + d.k + 'x}(' + (d.k * d.k) + 'x - ' + (2 * d.k) + ')$, e iguala a cero.']; },
    steps: function (d) {
      return ['$f\'\'(x) = e^{-' + d.k + 'x}(' + (d.k * d.k) + 'x - ' + (2 * d.k) + ') = 0 \\Rightarrow x = ' + d.x.tex() + '$',
        'Cambia de signo ahí (el paréntesis pasa de negativo a positivo): es inflexión.',
        '$y = f(' + d.x.tex() + ') = ' + d.x.tex() + '\\,e^{-2} \\approx ' + U.fmt(d.y, 4) + '$'];
    },
    answer: function (d) { return '(' + d.x.toString() + ', ' + U.fmt(d.y, 4) + ')'; }
  });

  p.keys([
    'Orden de trabajo: dominio, simetrías, cortes, signo, asíntotas, monotonía y extremos, curvatura e inflexión, dibujo.',
    'Asíntota oblicua: $m = \\lim f(x)/x$ y $n = \\lim (f(x) - mx)$; en una racional, el cociente de la división.',
    'No puede haber a la vez asíntota horizontal y oblicua por el mismo lado.',
    'La exponencial gana a las potencias y las potencias ganan al logaritmo: así se deciden las asíntotas de las funciones mixtas.',
    'Un extremo necesita que $f\'$ cambie de signo; con una raíz doble de $f\'$ no hay extremo.',
    'Problemas inversos: cada propiedad es una ecuación ($f(x_0)=y_0$, $f\'(x_0)=0$, $f\'\'(x_0)=0$) y al final se comprueba.'
  ]);
});
