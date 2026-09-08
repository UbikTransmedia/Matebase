/* Tema: Límites y continuidad */
Course.topic('fn-limites', function (p) {

  p.text('Aquí empieza el <strong>cálculo infinitesimal</strong>, y con él la parte de las matemáticas ' +
    'que describe el cambio. Todo se apoya en una sola idea: qué le pasa a una función cuando su ' +
    'entrada <em>se acerca</em> a un valor, sin llegar nunca a él.');

  p.formula('\\lim_{x \\to a} f(x) = L', 'se lee: el límite de f(x) cuando x tiende a a es L',
    'Se dice: <em>«el límite, cuando equis tiende a a, de efe de equis, es ele»</em>.<br><br>La ' +
      'flecha $\\to$ se lee «tiende a», que no es lo mismo que «es igual a»: significa «se acerca todo ' +
      'lo que quieras sin necesidad de llegar». Y esa es justo la gracia del límite: puede existir ' +
      'aunque la función ni siquiera esté definida en ese punto.');

  p.text('Significa: <em>puedo conseguir que $f(x)$ esté tan cerca de $L$ como quiera, sin más que ' +
    'coger $x$ suficientemente cerca de $a$</em>. Fíjate en que no se dice nada de $f(a)$. El límite ' +
    'no pregunta cuánto vale la función <strong>en</strong> el punto, sino a dónde <strong>se dirige</strong> ' +
    'al aproximarse.');

  p.note('Esa distinción parece una sutileza y es toda la potencia del invento. Permite hablar de ' +
    'velocidad instantánea o de pendiente en un punto, cosas que si las calculas <em>en</em> el punto ' +
    'te dan $\\frac{0}{0}$ y no significan nada.', 'ok', 'Por qué importa la distinción');

  p.hist('Newton y Leibniz construyeron el cálculo en el siglo XVII sin definir bien los límites: ' +
    'hablaban de «cantidades evanescentes» que a veces valían cero y a veces no. El obispo Berkeley ' +
    'se burló en 1734 llamándolas «fantasmas de cantidades difuntas», y tenía razón: no era riguroso. ' +
    'Funcionaba de maravilla, pero nadie sabía por qué. Hicieron falta 150 años y Cauchy y Weierstrass ' +
    'para dar la definición con épsilon y delta que hoy se estudia y cerrar el agujero.');

  p.demo({
    title: 'Acercarse a un punto que no existe',
    intro: 'Esta función no está definida en x = 2: hay un agujero. Pero al acercarse por los dos lados, los valores se aproximan claramente a un número. Ese número es el límite.',
    build: function (host, d) {
      var dist = 1;
      var f = function (x) { return (x * x - 4) / (x - 2); };   // = x+2 salvo en x=2
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1, xmax: 5, ymin: 0, ymax: 7, height: 300,
        draw: function (g) {
          g.fn(f, { color: 0, w: 2.6 });
          g.point(2, 4, { color: 0, r: 6, hollow: true });
          g.vline(2, { color: 'axis', dash: true, w: 1.2 });
          g.hline(4, { color: 2, dash: true, w: 1.2 });
          g.point(2 - dist, f(2 - dist), { color: 1, r: 5.5 });
          g.point(2 + dist, f(2 + dist), { color: 3, r: 5.5 });
          g.text(2.1, 4.35, 'L = 4', { color: 2, size: 13, box: true });
        }
      });
      function paint() {
        /* Tres decimales, que son los que el número tiene: el deslizador se
           mueve de milésima en milésima. Rellenar hasta seis con ceros hacía
           creer que el valor estaba truncado, cuando es exacto. */
        var xi = U.round(2 - dist, 3), xd = U.round(2 + dist, 3);
        out.set('$f(x) = \\dfrac{x^2-4}{x-2}$ &nbsp;·&nbsp; en $x=2$ daría $\\dfrac{0}{0}$: no está definida.<br>' +
          '<span style="color:var(--c2)">Por la izquierda</span>: $f(' + U.fmt(xi, 3) + ') = ' + U.fmt(xi + 2, 3) + '$<br>' +
          '<span style="color:var(--c4)">Por la derecha</span>: $f(' + U.fmt(xd, 3) + ') = ' + U.fmt(xd + 2, 3) + '$<br>' +
          (dist < 0.05 ? '<strong style="color:var(--ok)">Los dos lados apuntan a 4. Ese es el límite.</strong>'
            : 'Acerca más el deslizador y mira a dónde van los dos valores.'));
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'distancia al punto', min: 0.001, max: 1, step: 0.001, value: 1, dec: 3,
        on: function (v) { dist = v; paint(); }
      });
      W.hint(host, 'Aunque el agujero nunca se rellena, el límite existe y vale 4. Y fíjate en por ' +
        'qué los valores salen tan redondos: fuera de $x=2$ esta función <strong>es</strong> ' +
        'exactamente $x+2$, porque $\\frac{x^2-4}{x-2} = \\frac{(x-2)(x+2)}{x-2}$ y el $(x-2)$ se ' +
        'cancela. Los números de arriba no son aproximaciones: son exactos.');
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.note('Un apunte que parece menor y no lo es. Si le pides a un ordenador que calcule ' +
    '$\\frac{x^2-4}{x-2}$ en $x = 1{,}999$ tal cual está escrita, no obtiene $3{,}999$: obtiene ' +
    '$3{,}99899999999986\\dots$ El numerador y el denominador son los dos casi cero, y al restar ' +
    'cantidades muy parecidas se pierden cifras significativas. Con la fórmula simplificada ' +
    '$x+2$ el resultado sale exacto. Es el mismo cálculo y no da lo mismo: en [[av-numerico]] se ' +
    'estudia por qué, y qué se hace al respecto.',
    null, 'Lo exacto y lo que calcula la máquina');

  p.section('Límites laterales');

  p.text('Uno se puede acercar a $a$ por la izquierda ($x \\to a^-$) o por la derecha ($x \\to a^+$). ' +
    'El límite existe <strong>solo si los dos coinciden</strong>.');

  p.formula('\\lim_{x\\to a} f(x) = L \\iff \\lim_{x\\to a^-} f(x) = \\lim_{x\\to a^+} f(x) = L', 'el límite existe si coinciden los dos laterales',
    'El signo $\\iff$ se lee «si y solo si», es decir, «una cosa ocurre exactamente cuando ocurre la ' +
      'otra».<br><br>Los signos pequeñitos junto a la $a$ marcan por dónde te acercas: $a^-$ se dice ' +
      '«a por la izquierda» y $a^+$, «a por la derecha».<br><br>Entera: <em>«el límite de efe cuando ' +
      'equis tiende a a es ele si y solo si el límite por la izquierda y el límite por la derecha ' +
      'valen los dos ele»</em>. En cristiano: <em>«llegando por los dos lados hay que aterrizar en el ' +
      'mismo sitio»</em>.');

  p.text('Si no coinciden, la función pega un salto y el límite no existe. Es lo que pasa, por ' +
    'ejemplo, con las tarifas por tramos o con la función parte entera.');

  /* ---------------------------------------------------------------- */
  p.section('Cómo se calculan');

  p.sub('1. Sustitución directa');
  p.text('En la inmensa mayoría de los casos basta con sustituir. Si sale un número, ese es el límite.');
  p.formula('\\lim_{x\\to 3}(x^2-2x+5) = 9-6+5 = 8');

  p.sub('2. Indeterminaciones');
  p.text('A veces la sustitución da una expresión sin sentido. Se llaman <strong>indeterminaciones</strong> ' +
    'y no significan que el límite no exista: significan que hay que trabajar más.');

  p.formula('\\frac{0}{0} \\qquad \\frac{\\infty}{\\infty} \\qquad \\infty - \\infty \\qquad 0\\cdot\\infty \\qquad 1^{\\infty}');

  p.table(['Indeterminación', 'Qué se hace'],
    [['$\\frac{0}{0}$ en una racional', 'factorizar arriba y abajo y simplificar el factor común'],
     ['$\\frac{0}{0}$ con raíces', 'multiplicar por el conjugado'],
     ['$\\frac{\\infty}{\\infty}$ en una racional', 'comparar los grados del numerador y el denominador'],
     ['$\\infty - \\infty$', 'operar hasta convertirlo en un cociente']]);

  p.sub('¿Y esto no es hacer trampa?');

  p.text('Aquí conviene pararse, porque a casi todo el mundo le chirría lo mismo. Si al sustituir sale ' +
    '$\\frac{0}{0}$, simplifico un factor y vuelvo a sustituir, ahora sí sale un número. <em>¿Por qué ' +
    'vale el segundo intento y no el primero? ¿No me estoy inventando el resultado?</em>');

  p.text('No, y la razón está en algo que dijimos al empezar: <strong>el límite no mira lo que pasa ' +
    '<em>en</em> el punto, sino a dónde se dirige la función al acercarse</strong>. Míralo con ' +
    '$\\frac{x^2-1}{x-1}$ en $x=1$. Al factorizar queda $\\frac{(x-1)(x+1)}{x-1}$, y para ' +
    '<em>cualquier</em> $x$ distinto de 1 se puede tachar el factor: esa fracción y el polinomio ' +
    '$x+1$ dan exactamente el mismo valor en todos los puntos del mundo menos en uno.');

  p.text('Y ese único punto donde se diferencian es justo el que al límite no le importa. Las dos ' +
    'funciones se acercan a lo mismo, así que tienen el mismo límite; lo que ocurre es que una está ' +
    'definida allí y la otra tiene un agujero. Simplificar no cambia el límite: <strong>quita el ' +
    'agujero que impedía verlo</strong>.');

  p.note('Fíjate en que la simplificación es legal precisamente <em>porque</em> $x\\ne 1$, y en el ' +
    'límite $x$ nunca llega a valer 1: se acerca. Si en el ejercicio te preguntaran cuánto vale la ' +
    'función <em>en</em> $x=1$, la respuesta seguiría siendo «no existe». Son dos preguntas distintas ' +
    'y conviene no mezclarlas.', 'ok', 'Por qué es legal tachar');

  p.sub('3. Límites en el infinito');

  p.text('Para una función racional, todo depende de los grados. Es una regla que conviene ' +
    'entender y no memorizar: gana el de mayor grado.');

  p.formulas([
    '\\text{grado arriba} < \\text{grado abajo} \\ \\Rightarrow\\ \\lim = 0',
    '\\text{grado arriba} = \\text{grado abajo} \\ \\Rightarrow\\ \\lim = \\frac{\\text{coeficiente principal de arriba}}{\\text{coeficiente principal de abajo}}',
    '\\text{grado arriba} > \\text{grado abajo} \\ \\Rightarrow\\ \\lim = \\pm\\infty'
  ], 'los tres casos, según quién gana',
    'El <strong>coeficiente principal</strong> es el que acompaña a la potencia más alta: en ' +
    '$3x^2-7x+1$ es el 3, no el 1.<br><br>Con un ejemplo de cada caso: ' +
    '$\\lim\\frac{2x+1}{x^2}=0$ porque abajo crece más deprisa · ' +
    '$\\lim\\frac{6x^2+x}{3x^2-5}=\\frac{6}{3}=2$, los grados empatan y deciden los coeficientes · ' +
    '$\\lim\\frac{x^3}{4x}=+\\infty$ porque arriba se dispara.');

  p.text('La razón de que solo importen los grados es que, cuando $x$ se hace enorme, los términos ' +
    'pequeños dejan de contar. Con $x = 1000$, el polinomio $3x^2-7x+1$ vale 2 993 001, y de esa cifra ' +
    'el $3x^2$ aporta 3 000 000: todo lo demás es ruido. Por eso, en el infinito, cada polinomio se ' +
    'comporta como su término de mayor grado y basta con comparar esos dos.');

  p.demo({
    title: 'Comportamiento en el infinito',
    intro: 'Aleja la ventana y observa hacia dónde tiende cada función. La comparación de grados se ve directamente en el dibujo.',
    build: function (host, d) {
      var cual = 'igual';
      var fns = {
        menor: { f: function (x) { return (2 * x + 1) / (x * x + 3); }, t: '\\dfrac{2x+1}{x^2+3}', lim: 'tiende a $0$: abajo crece mucho más deprisa' },
        igual: { f: function (x) { return (3 * x * x - 1) / (2 * x * x + x + 5); }, t: '\\dfrac{3x^2-1}{2x^2+x+5}', lim: 'tiende a $\\frac{3}{2} = 1{,}5$: el cociente de los coeficientes principales' },
        mayor: { f: function (x) { return (x * x * x) / (4 * x + 1); }, t: '\\dfrac{x^3}{4x+1}', lim: 'tiende a $+\\infty$: arriba crece mucho más deprisa' }
      };
      var zoom = 10;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -10, xmax: 10, ymin: -4, ymax: 4, height: 300,
        draw: function (g) {
          g.fn(fns[cual].f, { color: 0, w: 2.6 });
          if (cual === 'igual') g.hline(1.5, { color: 2, dash: true, w: 1.6 });
          if (cual === 'menor') g.hline(0, { color: 2, dash: true, w: 1.6 });
        }
      });
      function paint() {
        plot.view(-zoom, zoom, -4, 4);
        out.set('$\\lim_{x\\to\\infty} ' + fns[cual].t + '$ &nbsp;→&nbsp; ' + fns[cual].lim +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Ventana actual: de $-' + zoom +
          '$ a $' + zoom + '$.</span>');
      }
      W.chips(host, [
        { label: 'grado arriba menor', value: 'menor' },
        { label: 'grados iguales', value: 'igual' },
        { label: 'grado arriba mayor', value: 'mayor' }
      ], { value: 'igual', on: function (v) { cual = v; paint(); } });
      W.slider(W.row(host), {
        label: 'alejar la vista', min: 5, max: 400, step: 5, value: 10, dec: 0,
        on: function (v) { zoom = v; paint(); }
      });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.note('Todo lo anterior descansa en una propiedad de los números reales que aquí se ha dado por ' +
    'buena sin nombrarla: que <strong>no tienen agujeros</strong>. Que una sucesión creciente y ' +
    'acotada tenga límite, o que una función continua que cambia de signo se anule, son falsos en ' +
    '$\\mathbb{Q}$. La propiedad que lo arregla se llama <em>completitud</em> y se estudia en el ' +
    'tema [[av-reales|<strong>La completitud de los reales</strong>]], del bloque 10. No hace falta para operar ' +
    'con límites, pero sí para creérselos.',
    null, 'La letra pequeña de los límites');

  p.section('Continuidad');

  p.text('Una función es <strong>continua</strong> en $a$ cuando se cumplen tres cosas a la vez:');

  p.formula('\\lim_{x\\to a} f(x) = f(a)', 'definición de continuidad en un punto',
    'Se lee: <em>«el límite, cuando equis tiende a a, de efe de equis, es igual a efe de ' +
      'a»</em>.<br><br>Y es más profunda de lo que parece, porque exige tres cosas a la vez: que la ' +
      'función <em>exista</em> en el punto, que el límite <em>exista</em>, y que además ' +
      '<strong>coincidan</strong>. Si falla cualquiera de las tres, hay discontinuidad.<br><br>En ' +
      'cristiano: <em>«a dónde se dirige la función y dónde está realmente son el mismo sitio»</em>. ' +
      'Es decir, se puede dibujar sin levantar el lápiz.');

  p.list([
    '$f(a)$ existe (el punto está en el dominio),',
    'el límite existe (los dos laterales coinciden),',
    'y además <strong>coinciden entre sí</strong>.'
  ], true);

  p.text('En la práctica: es continua si se puede dibujar sin levantar el lápiz. Si falla alguna de ' +
    'las tres condiciones hay una <em>discontinuidad</em>:');

  p.table(['Tipo', 'Qué falla', 'Aspecto'],
    [['Evitable', 'el límite existe pero $f(a)$ no, o no coincide', 'un agujero en la gráfica'],
     ['De salto', 'los laterales existen pero son distintos', 'un escalón'],
     ['Asintótica', 'algún lateral es infinito', 'la curva se dispara']]);

  /* ================= EJERCICIOS ================= */
  p.util('Una función discontinua es un salto, y en ingeniería los saltos rompen cosas. El perfil de una ' +
    'carretera o de una vía de tren no solo tiene que ser continuo, sino también su pendiente y su ' +
    'curvatura: por eso las curvas de las autopistas no pasan de recta a círculo de golpe, sino con ' +
    'una curva de transición, la clotoide, que evita el tirón brusco del volante. Un cambio de ' +
    'rasante mal enlazado es una discontinuidad que se nota en el estómago.');

  p.section('Practica');

  p.exercise({
    title: 'Límite por sustitución',
    level: 'basico',
    gen: function (r) {
      var c = [r.nz(-4, 4), r.pm(1, 6), r.pm(1, 9)];
      var a = r.pm(0, 4);
      return { c: c, a: a, val: ML.polyEval(c, a) };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\lim_{x\\to ' + d.a + '} \\left(' + ML.polyTex(d.c) + '\\right)$';
    },
    fields: [{ name: 'v', label: 'Límite', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Los polinomios son continuos en todas partes, así que basta con sustituir.'; },
    steps: function (d) {
      return ['Un polinomio es continuo en todo $\\mathbb{R}$, así que el límite es su valor en el punto.',
        'Sustituimos $x = ' + d.a + '$ y operamos.',
        'Resultado: $' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Indeterminación 0/0',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 6), b = r.pm(1, 6);
      if (a === b) return null;
      // (x-a)(x-b) / (x-a)  ->  limite en a vale a-b
      return { a: a, b: b, num: [1, -(a + b), a * b], val: a - b };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\lim_{x\\to ' + d.a + '} \\dfrac{' + ML.polyTex(d.num) + '}{x' +
        (d.a >= 0 ? '-' + d.a : '+' + (-d.a)) + '}$';
    },
    fields: [{ name: 'v', label: 'Límite', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return 'Al sustituir sale $\\frac{0}{0}$. Factoriza el numerador: sus raíces son $' + d.a + '$ y $' + d.b + '$.';
    },
    steps: function (d) {
      var sa = d.a >= 0 ? '-' + d.a : '+' + (-d.a);
      var sb = d.b >= 0 ? '-' + d.b : '+' + (-d.b);
      return ['Sustituyendo directamente sale $\\dfrac{0}{0}$: hay que trabajar la expresión.',
        'Factorizamos el numerador: $' + ML.polyTex(d.num) + ' = (x' + sa + ')(x' + sb + ')$.',
        'Simplificamos el factor común: $\\dfrac{(x' + sa + ')(x' + sb + ')}{x' + sa + '} = x' + sb + '$ para todo $x \\ne ' + d.a + '$.',
        'Ahora ya se puede sustituir: $' + d.a + sb + ' = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Límite en el infinito',
    level: 'medio',
    gen: function (r) {
      var caso = r.int(0, 2);
      var a = r.nz(-6, 6), b = r.nz(-6, 6);
      if (caso === 0) return { caso: 0, a: a, b: b, val: 0 };           // grado 1 / grado 2
      if (caso === 1) return { caso: 1, a: a, b: b, val: a / b };       // grado 2 / grado 2
      return { caso: 2, a: a, b: b, val: (a / b > 0) ? Infinity : -Infinity };  // grado 3 / grado 2
    },
    ask: function (d) {
      var num = d.caso === 0 ? ML.termTex(d.a, 'x', 1, true) + '+3'
        : (d.caso === 1 ? ML.termTex(d.a, 'x', 2, true) + '-x+1'
          : ML.termTex(d.a, 'x', 3, true) + '+2');
      var den = ML.termTex(d.b, 'x', 2, true) + '+x-4';
      return 'Calcula $\\displaystyle\\lim_{x\\to +\\infty} \\dfrac{' + num + '}{' + den + '}$' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Si es infinito, escribe ' +
        '<code>inf</code> o <code>-inf</code>.</span>';
    },
    fields: [{ name: 'v', label: 'Límite', w: 'tiny' }],
    sol: function (d) {
      return { v: d.val === Infinity ? 'inf' : (d.val === -Infinity ? '-inf' : d.val) };
    },
    check: function (v, d) {
      var t = v.raw.v.trim().toLowerCase().replace(/\s/g, '');
      if (d.val === Infinity) return t === 'inf' || t === '+inf' || t === 'infinito' || t === '+infinito';
      if (d.val === -Infinity) return t === '-inf' || t === '-infinito';
      return Ex.same(v.v, d.val, 1e-6);
    },
    hint: function () { return 'Compara los grados de arriba y abajo. Si son iguales, el límite es el cociente de los coeficientes principales.'; },
    steps: function (d) {
      if (d.caso === 0) return ['Grado del numerador: 1. Grado del denominador: 2.',
        'Abajo crece mucho más deprisa, así que la fracción se aplasta contra cero.',
        'El límite es $0$.'];
      if (d.caso === 1) return ['Los dos son de grado 2: están igualados.',
        'El límite es el cociente de los coeficientes principales: $\\dfrac{' + d.a + '}{' + d.b + '}$.',
        '$= ' + U.fmt(d.val, 4) + '$'];
      return ['Grado del numerador: 3. Grado del denominador: 2.',
        'Arriba crece mucho más deprisa: la fracción se dispara.',
        'El signo lo da $\\dfrac{' + d.a + '}{' + d.b + '}$, que es ' + (d.a / d.b > 0 ? 'positivo' : 'negativo') + '.',
        'El límite es $' + (d.val > 0 ? '+\\infty' : '-\\infty') + '$.'];
    },
    answer: function (d) {
      return d.val === Infinity ? '+∞' : (d.val === -Infinity ? '−∞' : U.fmt(d.val, 4));
    }
  });

  p.exercise({
    title: 'Continuidad de una función a trozos',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pm(1, 4);           // punto de corte
      var m = r.nz(-4, 4), n = r.pm(1, 8);   // primer trozo: mx+n
      var m2 = r.nz(-4, 4);         // segundo trozo: m2 x + k
      var k = (m * a + n) - m2 * a; // k que garantiza continuidad
      if (!Number.isInteger(k)) return null;
      return { a: a, m: m, n: n, m2: m2, k: k };
    },
    ask: function (d) {
      return 'Halla el valor de $k$ que hace continua a<br>' +
        '$f(x) = \\begin{cases}' +
        ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + ' & \\text{si } x \\le ' + d.a + ' \\\\ ' +
        ML.termTex(d.m2, 'x', 1, true) + ' + k & \\text{si } x > ' + d.a +
        '\\end{cases}$';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: d.a - 5, xmax: d.a + 5, ymin: (d.m * d.a + d.n) - 8, ymax: (d.m * d.a + d.n) + 8,
        height: 230,
        draw: function (g) {
          g.fn(function (x) { return d.m * x + d.n; }, { to: d.a, color: 0, w: 2.6 });
          g.fn(function (x) { return d.m2 * x + d.k; }, { from: d.a, color: 1, w: 2.6 });
          g.point(d.a, d.m * d.a + d.n, { color: 2, r: 5 });
          g.vline(d.a, { color: 'axis', dash: true, w: 1.2 });
        }
      });
    },
    fields: [{ name: 'k', label: 'k =', w: 'tiny' }],
    sol: function (d) { return { k: d.k }; },
    hint: function (d) {
      return 'Los dos trozos tienen que valer lo mismo en $x = ' + d.a + '$. Iguala y despeja $k$.';
    },
    steps: function (d) {
      var izq = d.m * d.a + d.n;
      return ['Por la izquierda: $\\lim_{x\\to ' + d.a + '^-} f(x) = ' + d.m + '\\cdot(' + d.a + ')' +
        ML.termTex(d.n, '', 0, false) + ' = ' + izq + '$.',
        'Por la derecha: $\\lim_{x\\to ' + d.a + '^+} f(x) = ' + d.m2 + '\\cdot(' + d.a + ') + k = ' + (d.m2 * d.a) + ' + k$.',
        'Para que sea continua los dos tienen que coincidir: $' + (d.m2 * d.a) + ' + k = ' + izq + '$.',
        '$k = ' + d.k + '$'];
    },
    answer: function (d) { return 'k = ' + d.k; }
  });

  p.keys([
    'El límite pregunta a dónde <strong>se dirige</strong> la función, no cuánto vale en el punto.',
    'Existe solo si los dos límites laterales coinciden.',
    'Casi siempre basta sustituir. Si sale una indeterminación, hay que transformar la expresión.',
    '$\\frac{0}{0}$ en una racional: factorizar y simplificar. $\\frac{\\infty}{\\infty}$: comparar grados.',
    'Continua en $a$ ⟺ $\\lim_{x\\to a} f(x) = f(a)$. Se dibuja sin levantar el lápiz.',
    'Discontinuidades: evitable (agujero), de salto (escalón) y asintótica (se dispara).'
  ]);
});
