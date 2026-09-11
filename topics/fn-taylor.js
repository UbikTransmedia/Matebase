/* Tema: Polinomios de Taylor */
Course.topic('fn-taylor', function (p) {

  p.puente('La recta tangente de [[fn-derivadas]] sustituía una curva por una recta cerca de un ' +
    'punto. Las series de [[fn-series]] enseñaron cuándo una suma infinita converge. Este tema junta ' +
    'las dos cosas: sustituye una función por un polinomio cada vez mejor, y pregunta hasta dónde se ' +
    'puede confiar en él.');

  p.text('Coge una calculadora y pide $\\operatorname{sen}(0{,}3)$. Responde en un parpadeo: ' +
    '$0{,}29552020666\\dots$ Ahora piensa qué acaba de hacer. No tiene dentro un triángulo que medir, ' +
    'ni una tabla con todos los senos posibles —son infinitos—. Lo único que una máquina sabe hacer ' +
    'es sumar y multiplicar. Así que lo que hay dentro tiene que ser, por fuerza, un polinomio.');

  p.text('Este tema explica de dónde sale ese polinomio, y resulta ser la aplicación más rentable de ' +
    'todo lo que has aprendido derivando. Con ella se calcula $\\operatorname{sen} x$, $e^x$ y ' +
    '$\\ln x$; se justifica la aproximación $\\operatorname{sen}x \\approx x$ que la física usa en ' +
    'cada péndulo; y se entiende por qué $e^{i\\pi}+1=0$, que hasta ahora ha sido un truco de ' +
    'prestidigitación.');

  p.section('Ya lo hiciste una vez: la recta tangente');

  p.text('En [[fn-derivadas|el tema de derivadas]] construiste la recta tangente a una función en un punto. Ahí no lo ' +
    'llamamos así, pero lo que hacías era <strong>sustituir la función por algo más simple que se le ' +
    'parece cerca de ese punto</strong>:');

  p.formula('f(x) \\approx f(a) + f\'(a)\\,(x-a)', 'aproximación lineal',
    'Se dice: <em>«efe de equis es aproximadamente efe de a, más efe prima de a por equis menos ' +
      'a»</em>.<br><br>El símbolo $\\approx$ es «aproximadamente igual»: dos rayas onduladas en vez de ' +
      'dos rectas.<br><br>Lo que dice es sencillo: para saber cuánto vale $f$ cerca de $a$, parte de ' +
      'lo que vale <em>en</em> $a$ y añade la pendiente por lo que te has desplazado. Es exactamente ' +
      'lo que haces cuando dices «voy a 90 por hora, así que en dos horas habré hecho 180 km»: ' +
      'sustituyes el movimiento real por uno de velocidad constante.');

  p.text('Esa recta tiene dos virtudes que conviene nombrar, porque son la semilla de todo lo demás: ' +
    '<strong>pasa por el mismo punto</strong> que $f$ y <strong>tiene la misma pendiente</strong>. En ' +
    'lenguaje de derivadas: coincide con $f$ en el valor y en la primera derivada.');

  p.text('Y ahora la pregunta que abre el tema: si obligar a que coincidan el valor y la primera ' +
    'derivada da una recta que se parece a $f$ cerca de $a$, ¿qué pasa si además obligamos a que ' +
    'coincida la segunda? ¿Y la tercera? ¿Y las diez primeras?');

  p.section('Subir de grado: el polinomio de Taylor');

  p.text('Buscamos un polinomio $P$ de grado $n$ que en el punto $a$ tenga <strong>exactamente las ' +
    'mismas derivadas</strong> que $f$, desde la de orden cero (el valor) hasta la de orden $n$. La ' +
    'condición es esta, y no hay nada más:');

  p.formula('P(a) = f(a), \\quad P\'(a) = f\'(a), \\quad P\'\'(a) = f\'\'(a), \\ \\dots\\ , \\quad P^{(n)}(a) = f^{(n)}(a)',
    'las condiciones que se imponen',
    'Se dice: <em>«pe de a igual a efe de a, pe prima de a igual a efe prima de a, pe segunda de a ' +
      'igual a efe segunda de a…»</em>.<br><br>La notación $f^{(n)}$, con el número entre paréntesis ' +
      'arriba, es «la derivada $n$-ésima»: derivar $n$ veces seguidas. Se usa el paréntesis para que ' +
      'no se confunda con una potencia: $f^{(3)}$ es la tercera derivada, mientras que $f^3$ sería ' +
      '$f$ al cubo. Para las primeras se siguen usando las comillas, $f\'$ y $f\'\'$, porque tres ' +
      'comillas ya empiezan a no verse.');

  p.sub('Hagámoslo con el grado 2');

  p.text('Antes de escribir la fórmula general conviene sacarla una vez a mano, porque así se ve de ' +
    'dónde sale cada trozo —y de dónde sale, sobre todo, ese factorial que parece caído del cielo—. ' +
    'Tomemos $a=0$ para no arrastrar paréntesis y busquemos un polinomio de grado 2:');

  p.formula('P(x) = c_0 + c_1 x + c_2 x^2', 'tres coeficientes por determinar');

  p.text('Tenemos tres incógnitas y vamos a imponer tres condiciones. La primera es que $P$ y $f$ ' +
    'valgan lo mismo en $0$. Sustituyendo $x=0$ en $P$ desaparece todo menos el primer término:');

  p.formulas([
    'P(0) = c_0 \\quad\\Longrightarrow\\quad c_0 = f(0)'
  ], 'primera condición');

  p.text('La segunda es que tengan la misma pendiente. Derivamos $P$ una vez y volvemos a sustituir ' +
    '$x=0$; ahora desaparece el término cuadrático y sobrevive el coeficiente $c_1$:');

  p.formulas([
    'P\'(x) = c_1 + 2c_2 x',
    'P\'(0) = c_1 \\quad\\Longrightarrow\\quad c_1 = f\'(0)'
  ], 'segunda condición');

  p.text('Y la tercera es que se curven igual. Derivamos otra vez. Aquí está la sorpresa: al derivar ' +
    'dos veces $c_2x^2$ <strong>aparece un 2 multiplicando</strong>, y ese 2 hay que quitarlo:');

  p.formulas([
    'P\'\'(x) = 2c_2',
    'P\'\'(0) = 2c_2 \\quad\\Longrightarrow\\quad c_2 = \\frac{f\'\'(0)}{2}'
  ], 'tercera condición');

  p.note('Ese 2 del denominador no es un capricho: es <strong>el número que aparece al derivar dos ' +
    'veces una potencia</strong>. Si siguiéramos con el término $c_3x^3$, derivando tres veces ' +
    'saldría $3\\cdot2\\cdot1 = 6$; con $c_4x^4$ saldría $4\\cdot3\\cdot2\\cdot1 = 24$. Ese producto ' +
    'es exactamente el factorial, y por eso la fórmula general lleva un $n!$ debajo: está ' +
    'deshaciendo lo que la derivada acaba de multiplicar.', 'ok', 'De dónde sale el factorial');

  p.comprueba('Para $f(x) = e^x$ en $a = 0$, ¿cuánto vale el coeficiente $c_2$ del término en $x^2$?', [
    { t: '$1$', ok: false, por: '$f\'\'(0) = e^0 = 1$, sí, pero el coeficiente lleva el $2!$ debajo: $c_2 = \\frac{1}{2}$. El 2 deshace lo que la derivada multiplicó.' },
    { t: '$\\dfrac{1}{2}$', ok: true, por: '$c_2 = \\dfrac{f\'\'(0)}{2!} = \\dfrac{1}{2}$. Por eso $e^x \\approx 1 + x + \\frac{x^2}{2}$.' },
    { t: '$2$', ok: false, por: 'El 2 divide, no multiplica: al derivar dos veces $c_2 x^2$ sale $2c_2$, y eso tiene que valer $f\'\'(0) = 1$.' }
  ]);

  p.text('Repitiendo el mismo razonamiento para cada grado —derivar $k$ veces, sustituir en $a$, ' +
    'despejar— sale la fórmula general, que ya no debería sorprender:');

  p.formula('P_n(x) = f(a) + f\'(a)(x-a) + \\frac{f\'\'(a)}{2!}(x-a)^2 + \\dots + \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    'polinomio de Taylor de orden n en el punto a',
    'Se dice: <em>«pe sub ene de equis es igual a efe de a, más efe prima de a por equis menos a, más ' +
      'efe segunda de a partido por dos factorial por equis menos a al cuadrado, y así ' +
      'sucesivamente»</em>.<br><br>El $n!$ del denominador es el <strong>factorial</strong>: ' +
      '$3! = 3\\cdot2\\cdot1 = 6$. Aparece porque al derivar $n$ veces una potencia $(x-a)^n$ sale ' +
      'precisamente ese número, y hay que dividir para cancelarlo.<br><br>En una frase: <strong>cada ' +
      'término nuevo añade una información más sobre cómo se curva la función</strong>. El primero da ' +
      'la altura, el segundo la inclinación, el tercero la curvatura, el cuarto cómo cambia la ' +
      'curvatura…');

  p.text('Cuando el punto de partida es $a = 0$ la fórmula se simplifica bastante y se le llama ' +
    '<strong>polinomio de Maclaurin</strong>. Es el caso que se usa el noventa por ciento de las ' +
    'veces, porque cerca de cero casi todo es más fácil:');

  p.formula('P_n(x) = f(0) + f\'(0)\\,x + \\frac{f\'\'(0)}{2!}x^2 + \\frac{f\'\'\'(0)}{3!}x^3 + \\dots + \\frac{f^{(n)}(0)}{n!}x^n',
    'el caso a = 0');

  p.ejemplo({
    title: 'Un polinomio de Taylor de grado 3, con sus factoriales',
    enunciado: 'Hallar el polinomio de Taylor de grado 3 de $f(x) = \\ln(1 + x)$ en $a = 0$ y usarlo para aproximar $\\ln(1{,}1)$.',
    pasos: [
      { t: '<strong>Las derivadas en 0.</strong> $f(x) = \\ln(1+x) \\Rightarrow f(0) = 0$. $f\'(x) = \\dfrac{1}{1+x} \\Rightarrow f\'(0) = 1$. $f\'\'(x) = -\\dfrac{1}{(1+x)^2} \\Rightarrow f\'\'(0) = -1$. $f\'\'\'(x) = \\dfrac{2}{(1+x)^3} \\Rightarrow f\'\'\'(0) = 2$.', antes: 'Deriva tres veces y sustituye $x = 0$ en cada una.' },
      { t: '<strong>Los coeficientes, con el factorial.</strong> $c_0 = 0$, $c_1 = 1$, $c_2 = \\dfrac{-1}{2!} = -\\dfrac{1}{2}$, $c_3 = \\dfrac{2}{3!} = \\dfrac{2}{6} = \\dfrac{1}{3}$.', antes: '$f\'\'\'(0) = 2$. ¿Por qué el coeficiente del $x^3$ no es 2 sino $\\frac{1}{3}$?' },
      { t: '<strong>El polinomio.</strong> $P_3(x) = x - \\dfrac{x^2}{2} + \\dfrac{x^3}{3}$. Fíjate en el patrón: los signos se alternan y los denominadores son $1, 2, 3$, no factoriales, porque las derivadas ya traían $(k-1)!$ que se cancela con el $k!$.' },
      { t: '<strong>Aproximar.</strong> $\\ln(1{,}1) = f(0{,}1) \\approx 0{,}1 - \\dfrac{0{,}01}{2} + \\dfrac{0{,}001}{3} = 0{,}1 - 0{,}005 + 0{,}000333 = 0{,}095333$.', antes: 'Sustituye $x = 0{,}1$. ¿Cuántas cifras esperas acertar?' },
      { t: '<strong>Comparar.</strong> El valor real es $\\ln(1{,}1) = 0{,}095310$. Error: $0{,}000023$, menor que el siguiente término, $\\dfrac{0{,}1^4}{4} = 0{,}000025$.' }
    ],
    cierre: 'Cuatro cifras correctas con tres términos, a una décima del punto de apoyo. Y la cota del error salió gratis: el primer término omitido, porque la serie alterna.'
  });

  p.demo({
    title: 'El polinomio abrazando a la función',
    intro: 'La curva negra es la función; la de color, su polinomio de Taylor. Sube el grado y mira cómo el polinomio se va pegando a la curva, primero cerquita del punto y luego cada vez más lejos. Mueve también el punto donde se apoya.',
    predice: 'Con $\\operatorname{sen} x$ y grado 3, el polinomio es $x - \\frac{x^3}{6}$. ¿Hasta qué $x$ crees que se mantendrá pegado a la curva: hasta 1, hasta 2, hasta 3?',
    build: function (host) {
      var grado = 1, a = 0, cual = 'sen';
      var fns = {
        sen: { t: '\\operatorname{sen} x', f: Math.sin, d: function (k, x) { return Math.sin(x + k * Math.PI / 2); } },
        exp: { t: 'e^x', f: Math.exp, d: function (k, x) { return Math.exp(x); } },
        cos: { t: '\\cos x', f: Math.cos, d: function (k, x) { return Math.cos(x + k * Math.PI / 2); } },
        log: { t: '\\ln(1+x)', f: function (x) { return Math.log(1 + x); },
               d: function (k, x) {
                 if (k === 0) return Math.log(1 + x);
                 var s = (k % 2 === 1) ? 1 : -1;
                 return s * ML.factorial(k - 1) / Math.pow(1 + x, k);
               } }
      };
      function poli(x) {
        var F = fns[cual], s = 0, fact = 1;
        for (var k = 0; k <= grado; k++) {
          if (k > 0) fact *= k;
          s += F.d(k, a) / fact * Math.pow(x - a, k);
        }
        return s;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -3.2, ymax: 3.2, height: 300,
        draw: function (g) {
          var F = fns[cual];
          g.fn(F.f, { color: 'ink', w: 2.6 });
          g.fn(poli, { color: 1, w: 2.4 });
          g.vline(a, { color: 2, w: 1.2, dash: true });
          g.point(a, F.f(a), { color: 2, r: 6 });
        }
      });
      function paint() {
        var F = fns[cual];
        // error en un punto a distancia fija del apoyo
        var x1 = a + 1, x2 = a + 2;
        var lim = cual === 'exp' ? [-3, 3, -1, 12] : (cual === 'log' ? [-0.9, 5, -4, 3] : [-6, 6, -3.2, 3.2]);
        plot.view(lim[0], lim[1], lim[2], lim[3]);
        out.set('Función: $' + F.t + '$ &nbsp;·&nbsp; apoyo en $a = ' + U.fmt(a, 2) +
          '$ &nbsp;·&nbsp; grado <strong>' + grado + '</strong><br>' +
          'A una unidad del apoyo: error $' + U.fmt(Math.abs(F.f(x1) - poli(x1)), 6) + '$<br>' +
          'A dos unidades: error $' + U.fmt(Math.abs(F.f(x2) - poli(x2)), 6) + '$<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Cerca del apoyo el error es ' +
          'diminuto y mejora muy deprisa con el grado; lejos, tarda mucho más en arreglarse. El ' +
          'polinomio es local por naturaleza.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'sen x', value: 'sen' },
        { label: 'cos x', value: 'cos' },
        { label: 'eˣ', value: 'exp' },
        { label: 'ln(1+x)', value: 'log' }
      ], { value: 'sen', on: function (v) { cual = v; if (cual === 'log' && a <= -0.9) a = 0; paint(); } });
      var row = W.row(host);
      W.slider(row, {
        label: 'grado n', min: 0, max: 14, step: 1, value: 1, dec: 0,
        on: function (v) { grado = v; paint(); }
      });
      W.slider(row, {
        label: 'punto de apoyo a', min: -3, max: 3, step: 0.25, value: 0, dec: 2,
        on: function (v) { a = v; paint(); }
      });
      W.legend(host, [
        { c: 'ink', t: 'la función $f$' },
        { c: 1, t: 'el polinomio $P_n$' },
        { c: 2, t: 'el punto de apoyo $a$' }
      ]);
      W.hint(host, 'Prueba $\\operatorname{sen} x$ con grado 1: sale la recta $y = x$. Ahí tienes, ' +
        'dibujada, la aproximación que usa toda la física de bachillerato.');
      paint();
    }
  });

  p.section('Cuánto me estoy equivocando');

  p.text('Una aproximación sin control del error no vale para nada: sirve para dibujar, no para ' +
    'calcular. Si tu calculadora te da diez cifras de $\\operatorname{sen}(0{,}3)$, alguien ha tenido ' +
    'que garantizar que las diez son correctas. Ese alguien es el <strong>resto de Lagrange</strong>.');

  p.formula('f(x) = P_n(x) + \\underbrace{\\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}}_{\\text{resto } R_n(x)}',
    'la fórmula de Taylor con resto',
    'Se dice: <em>«efe de equis es igual a pe sub ene de equis, más efe sub ene más uno de ce, ' +
      'partido por ene más uno factorial, por equis menos a elevado a ene más uno»</em>.<br><br>Lo ' +
      'importante es que esto es una <strong>igualdad exacta</strong>, no una aproximación: el resto ' +
      'recoge <em>todo</em> lo que el polinomio se deja.<br><br>Ese $c$ misterioso es un punto ' +
      'concreto que está entre $a$ y $x$. Nadie sabe cuál —y da igual, porque para acotar el error ' +
      'basta con saber lo grande que puede llegar a ser $f^{(n+1)}$ en ese tramo.');

  p.text('De dónde sale ese punto $c$ no es magia: es el <strong>teorema del valor medio</strong> que ' +
    'viste al final d[[fn-derivadas|el tema de derivadas]], aplicado con más cuidado. Aquel decía que en algún punto ' +
    'del intervalo la pendiente instantánea coincide con la media; esto es la misma idea llevada a ' +
    'las derivadas de orden superior.');

  p.note('La receta práctica es: <strong>acota $|f^{(n+1)}|$ en el intervalo, multiplica por ' +
    '$\\frac{|x-a|^{n+1}}{(n+1)!}$ y ya tienes una garantía</strong>. Con el seno y el coseno es ' +
    'especialmente cómodo, porque todas sus derivadas valen como mucho 1, y entonces el error es ' +
    'menor que $\\frac{|x|^{n+1}}{(n+1)!}$ sin más trámite.', 'ok', 'Cómo se usa en la práctica');

  p.text('Y ese factorial del denominador es la razón de que todo esto funcione tan bien. El ' +
    'factorial crece más deprisa que cualquier potencia: $10! $ ya son más de tres millones. Por eso ' +
    'unos pocos términos bastan.');

  p.demo({
    title: 'Tu calculadora por dentro',
    intro: 'Esto es, literalmente, lo que ocurre cuando pides un seno. Elige el ángulo, añade términos y mira cómo el resultado se clava en el valor real mientras la cota del error se desploma.',
    predice: 'Con $x = 0{,}3$ y dos términos, el primer término omitido es $\\frac{0{,}3^5}{120} \\approx 2\\cdot 10^{-5}$. ¿Cuántos términos crees que hacen falta para diez cifras correctas: 3, 5 u 8?',
    build: function (host) {
      var x = 0.3, n = 1;
      var out = W.readout(host, '');
      function parcial(m) {
        var s = 0;
        for (var k = 0; k <= m; k++) {
          var e = 2 * k + 1;
          s += (k % 2 ? -1 : 1) * Math.pow(x, e) / ML.factorial(e);
        }
        return s;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 8, ymin: -18, ymax: 2, height: 220,
        xlabel: 'términos usados', ylabel: 'log₁₀ del error', xstep: 1,
        draw: function (g) {
          var pts = [];
          for (var m = 0; m <= 7; m++) {
            var err = Math.abs(Math.sin(x) - parcial(m));
            pts.push([m + 1, Math.log(Math.max(err, 1e-17)) / Math.LN10]);
          }
          g.path(pts, { color: 0, w: 2.2 });
          for (var i = 0; i < pts.length; i++) g.point(pts[i][0], pts[i][1], { color: 0, r: 4 });
          g.hline(-10, { color: 2, w: 1.4, dash: true });
          g.text(7.8, -9.3, '10 cifras', { align: 'right', size: 12, color: 2 });
        }
      });
      function paint() {
        var v = parcial(n - 1);
        var real = Math.sin(x);
        var e = 2 * n + 1;
        var cota = Math.pow(Math.abs(x), e) / ML.factorial(e);
        var trozos = [];
        for (var k = 0; k < n && k < 5; k++) {
          var ex = 2 * k + 1;
          trozos.push((k === 0 ? '' : (k % 2 ? '- ' : '+ ')) +
            (k === 0 ? U.fmt(x, 3) : '\\dfrac{' + U.fmt(x, 3) + '^{' + ex + '}}{' + ex + '!}'));
        }
        out.set('$\\operatorname{sen}(' + U.fmt(x, 3) + ') \\approx ' + trozos.join(' ') +
          (n > 5 ? ' \\dots' : '') + '$<br>' +
          'Con <strong>' + n + '</strong> término' + (n > 1 ? 's' : '') + ': $' + U.fmt(v, 12) + '$<br>' +
          'Valor real: &nbsp;$' + U.fmt(real, 12) + '$<br>' +
          'Error real: $' + Math.abs(real - v).toExponential(2).replace('.', ',') + '$ · ' +
          'cota garantizada: $' + cota.toExponential(2).replace('.', ',') + '$');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, {
        label: 'ángulo x (radianes)', min: 0.1, max: 3, step: 0.05, value: 0.3, dec: 2,
        on: function (v) { x = v; paint(); }
      });
      W.slider(row, {
        label: 'términos', min: 1, max: 8, step: 1, value: 1, dec: 0,
        on: function (v) { n = v; paint(); }
      });
      W.hint(host, 'Con x = 0,3 bastan tres términos para las diez cifras que muestra una ' +
        'calculadora de bolsillo. Sube el ángulo a 3 radianes y verás que hacen falta bastantes más: ' +
        'por eso las calculadoras reducen primero el ángulo al primer cuadrante.');
      paint();
    }
  });

  p.util('El chip que llevas en el móvil no calcula el seno con esta serie tal cual, pero sí con la ' +
    'misma idea: reduce el ángulo a un intervalo pequeño usando las identidades de trigonometría, y ' +
    'ahí aplica un polinomio de grado bajo cuyos coeficientes están afinados para minimizar el peor ' +
    'error posible. La biblioteca matemática de cualquier lenguaje de programación es, en el fondo, ' +
    'una colección de polinomios con sus cotas de error demostradas.');

  p.section('Los desarrollos que conviene reconocer');

  p.text('Con tres o cuatro desarrollos memorizados se resuelve casi todo, porque los demás salen de ' +
    'estos sustituyendo, derivando o multiplicando. Todos están centrados en $a=0$:');

  p.formulas([
    'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\dots',
    '\\operatorname{sen} x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\dots',
    '\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\dots',
    '\\frac{1}{1-x} = 1 + x + x^2 + x^3 + \\dots \\quad (|x|<1)'
  ], 'los cuatro imprescindibles');

  p.text('Míralos con atención un momento. El seno solo tiene potencias impares —como debe ser, ' +
    'porque es una función impar— y el coseno solo pares. Y el último no es una novedad: es la suma ' +
    'de la serie geométrica del tema anterior, escrita del revés.');

  p.note('Ese último desarrollo enseña algo que hay que tener presente siempre: $\\frac{1}{1-x}$ es ' +
    'una función perfectamente respetable en $x=3$, donde vale $-\\frac12$. Pero su serie en $x=3$ ' +
    'da $1+3+9+27+\\dots$, que no converge a nada. <strong>El desarrollo solo vale dentro de un ' +
    'radio</strong>, y fuera de él no es que sea impreciso: es que no significa nada.',
    'warn', 'Hasta dónde llega el desarrollo');

  p.text('A ese radio se le llama <strong>radio de convergencia</strong>, y decidir cuánto vale es ' +
    'exactamente el problema d[[fn-series|el tema de series]]: dado $x$, ¿converge $\\sum \\frac{f^{(n)}(0)}{n!}x^n$? ' +
    'Para $e^x$, el seno y el coseno la respuesta es que converge para todo $x$, gracias al factorial ' +
    'del denominador. Para $\\frac{1}{1-x}$ y para $\\ln(1+x)$ el radio es 1.');

  p.util('La aproximación $\\operatorname{sen}\\theta \\approx \\theta$ —el polinomio de Taylor de ' +
    'grado 1— es la razón de que un péndulo tenga periodo constante. La ecuación exacta del péndulo ' +
    'no se puede resolver con funciones elementales; sustituyendo el seno por el ángulo se convierte ' +
    'en la del muelle, que sí, y de ahí sale $T = 2\\pi\\sqrt{L/g}$. Para $\\theta = 10°$ el error de ' +
    'esa sustitución es del 0,05 %, así que un reloj de péndulo funciona. Para oscilaciones grandes ' +
    'deja de valer, y el péndulo se retrasa: es la misma aproximación fallando.');

  p.hist('Brook Taylor publicó la fórmula en 1715, aunque casos particulares ya circulaban desde ' +
    'Newton, Gregory y el matemático indio Madhava de Sangamagrama, que hacia 1400 conocía las ' +
    'series del seno y del coseno tres siglos antes que Europa. Taylor no se preocupó de la ' +
    'convergencia —nadie lo hacía entonces— y la fórmula pasó cincuenta años casi inadvertida hasta ' +
    'que Lagrange la señaló como el fundamento del cálculo diferencial y le añadió el resto que hoy ' +
    'lleva su nombre. El rigor sobre cuándo la serie converge de verdad no llegó hasta Cauchy, ya ' +
    'entrado el siglo XIX.');

  p.section('Un regalo: de dónde sale eiπ + 1 = 0');

  p.text('En [[al-complejos|el tema de números complejos]] apareció la fórmula de Euler como un hecho consumado. Con ' +
    'Taylor deja de serlo. Escribe la serie de $e^x$ y sustituye $x$ por $i\\theta$, recordando que ' +
    '$i^2=-1$, $i^3=-i$, $i^4=1$ y vuelta a empezar:');

  p.formulas([
    'e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + \\dots',
    'e^{i\\theta} = \\underbrace{\\left(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\dots\\right)}_{\\cos\\theta} + i\\underbrace{\\left(\\theta - \\frac{\\theta^3}{3!} + \\dots\\right)}_{\\operatorname{sen}\\theta}'
  ], 'la fórmula de Euler, deducida');

  p.text('Separando los términos con $i$ de los que no lo llevan aparecen, sin que nadie los haya ' +
    'llamado, las series del coseno y del seno. De ahí $e^{i\\theta} = \\cos\\theta + ' +
    'i\\operatorname{sen}\\theta$, y con $\\theta = \\pi$ sale la identidad famosa. La conexión entre ' +
    'la exponencial y la trigonometría, que parecía una coincidencia, es que sus tres series están ' +
    'hechas de las mismas piezas.');

  p.trampas([
    { e: '$c_k = f^{(k)}(a)$, sin el factorial', por: 'Al derivar $k$ veces $x^k$ sale $k!$; para compensarlo, $c_k = \\frac{f^{(k)}(a)}{k!}$. Sin él, el polinomio de $e^x$ sería $1 + x + x^2 + \\cdots$, que crece mucho más deprisa.' },
    { e: 'Usar la serie de $\\frac{1}{1-x}$ en $x = 2$', por: 'Fuera del radio de convergencia (aquí $|x| < 1$) la serie no aproxima mal: no converge a nada. $1 + 2 + 4 + \\cdots$ no es $-1$.' },
    { e: '«Grado 5 del seno son cinco términos»', por: 'El seno solo tiene potencias impares: el polinomio de grado 5 es $x - \\frac{x^3}{6} + \\frac{x^5}{120}$, tres términos.' },
    { e: 'Creer que lejos del punto de apoyo la aproximación es igual de buena', por: 'El error crece como $|x - a|^{n+1}$. A distancia 3 es $3^{n+1}$ veces peor que a distancia 1.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Polinomio de Taylor de grado 2',
    level: 'basico',
    gen: function (r) {
      var cual = r.int(0, 3);
      var a = r.pick([0, 0, 0, 1]);
      var fs = [
        { t: 'e^x', f: Math.exp, d1: Math.exp, d2: Math.exp },
        { t: '\\operatorname{sen} x', f: Math.sin, d1: Math.cos, d2: function (x) { return -Math.sin(x); } },
        { t: '\\cos x', f: Math.cos, d1: function (x) { return -Math.sin(x); }, d2: function (x) { return -Math.cos(x); } },
        { t: '\\ln(1+x)', f: function (x) { return Math.log(1 + x); },
          d1: function (x) { return 1 / (1 + x); }, d2: function (x) { return -1 / ((1 + x) * (1 + x)); } }
      ];
      var F = fs[cual];
      var x0 = r.real(-0.6, 0.6, 2);
      if (Math.abs(x0) < 0.08) return null;
      var c0 = F.f(a), c1 = F.d1(a), c2 = F.d2(a) / 2;
      var val = c0 + c1 * (x0 - a) + c2 * (x0 - a) * (x0 - a);
      return { t: F.t, a: a, c0: c0, c1: c1, c2: c2, x0: x0, val: val, real: F.f(x0) };
    },
    ask: function (d) {
      return 'Escribe el polinomio de Taylor de grado 2 de $f(x) = ' + d.t + '$ en $a = ' + d.a +
        '$ y úsalo para aproximar $f(' + U.fmt(d.x0, 2) + ')$.<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Da los tres coeficientes ' +
        '$c_0, c_1, c_2$ de $P_2(x) = c_0 + c_1(x-' + d.a + ') + c_2(x-' + d.a + ')^2$ y el valor ' +
        'aproximado.</span>';
    },
    fields: [
      { name: 'c0', label: 'c₀', w: 'tiny' },
      { name: 'c1', label: 'c₁', w: 'tiny' },
      { name: 'c2', label: 'c₂', w: 'tiny' },
      { name: 'v', label: 'P₂ del punto', w: 'tiny' }
    ],
    sol: function (d) {
      return { c0: U.round(d.c0, 8), c1: U.round(d.c1, 8), c2: U.round(d.c2, 8), v: U.round(d.val, 8) };
    },
    tol: 3e-4,
    hint: function (d) {
      return 'Los coeficientes son $c_0=f(' + d.a + ')$, $c_1=f\'(' + d.a + ')$ y ' +
        '$c_2=\\frac{f\'\'(' + d.a + ')}{2}$. Ojo al 2 del denominador, que es donde falla todo el mundo.';
    },
    steps: function (d) {
      return ['$c_0 = f(' + d.a + ') = ' + U.fmt(d.c0, 6) + '$',
        '$c_1 = f\'(' + d.a + ') = ' + U.fmt(d.c1, 6) + '$',
        '$c_2 = \\dfrac{f\'\'(' + d.a + ')}{2!} = ' + U.fmt(d.c2, 6) + '$',
        'Sustituyendo $x = ' + U.fmt(d.x0, 2) + '$: $P_2 = ' + U.fmt(d.val, 6) + '$',
        'El valor exacto es $' + U.fmt(d.real, 6) + '$, así que el error es ' +
        U.fmt(Math.abs(d.real - d.val), 6) + '.'];
    },
    answer: function (d) {
      return 'c₀ = ' + U.fmt(d.c0, 4) + ', c₁ = ' + U.fmt(d.c1, 4) + ', c₂ = ' + U.fmt(d.c2, 4) +
        ' · P₂ = ' + U.fmt(d.val, 6);
    }
  });

  p.exercise({
    title: 'Aproximar con la serie del seno',
    level: 'medio',
    gen: function (r) {
      var x = r.real(0.1, 1.2, 2);
      var n = r.int(2, 4);
      var s = 0;
      for (var k = 0; k < n; k++) {
        var e = 2 * k + 1;
        s += (k % 2 ? -1 : 1) * Math.pow(x, e) / ML.factorial(e);
      }
      return { x: x, n: n, val: s, real: Math.sin(x) };
    },
    ask: function (d) {
      return 'Aproxima $\\operatorname{sen}(' + U.fmt(d.x, 2) + ')$ usando los <strong>' + d.n +
        ' primeros términos</strong> de $\\operatorname{sen} x = x - \\frac{x^3}{3!} + ' +
        '\\frac{x^5}{5!} - \\dots$ (seis decimales).';
    },
    fields: [{ name: 'v', label: 'Aproximación', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 9) }; },
    tol: 3e-6,
    hint: function (d) {
      return 'Recuerda que $3! = 6$, $5! = 120$ y $7! = 5040$. Puedes escribir la cuenta entera en la ' +
        'casilla, sin resolverla: acepta expresiones.';
    },
    steps: function (d) {
      var t = [], s = 0;
      for (var k = 0; k < d.n; k++) {
        var e = 2 * k + 1;
        var term = (k % 2 ? -1 : 1) * Math.pow(d.x, e) / ML.factorial(e);
        s += term;
        t.push('Término ' + (k + 1) + ': $' + (k % 2 ? '-' : '+') + '\\dfrac{' + U.fmt(d.x, 2) + '^{' +
          e + '}}{' + e + '!} = ' + U.fmt(term, 8) + '$ &nbsp;→&nbsp; acumulado ' + U.fmt(s, 8));
      }
      t.push('Aproximación: $' + U.fmt(d.val, 6) + '$. El valor real es $' + U.fmt(d.real, 6) +
        '$: el error es ' + U.fmt(Math.abs(d.real - d.val), 8) + ', menor que el primer término omitido.');
      return t;
    },
    answer: function (d) { return U.fmt(d.val, 6); }
  });

  p.exercise({
    title: 'Acotar el error',
    level: 'avanzado',
    gen: function (r) {
      var x = r.real(0.2, 1.4, 1);
      var n = r.int(2, 6);
      var cota = Math.pow(Math.abs(x), n + 1) / ML.factorial(n + 1);
      return { x: x, n: n, cota: cota };
    },
    ask: function (d) {
      return 'Aproximas $\\operatorname{sen}(' + U.fmt(d.x, 1) + ')$ por su polinomio de Taylor de ' +
        'grado ' + d.n + ' en $a=0$. Acota el error usando el resto de Lagrange.<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Todas las derivadas del seno están ' +
        'acotadas por 1, así que $|R_n| \\le \\dfrac{|x|^{n+1}}{(n+1)!}$. Da esa cota.</span>';
    },
    fields: [{ name: 'e', label: 'Cota del error', w: 'wide' }],
    sol: function (d) { return { e: U.round(d.cota, 12) }; },
    rel: 1e-3,
    hint: function (d) {
      return 'Sustituye sin más: $\\dfrac{' + U.fmt(d.x, 1) + '^{' + (d.n + 1) + '}}{' + (d.n + 1) +
        '!}$. Puedes escribirlo tal cual en la casilla.';
    },
    steps: function (d) {
      return ['El resto de Lagrange es $R_n = \\dfrac{f^{(n+1)}(c)}{(n+1)!}x^{n+1}$ para algún $c$ ' +
        'entre 0 y $x$.',
        'Las derivadas del seno son $\\pm\\operatorname{sen}$ y $\\pm\\cos$, todas acotadas por 1: ' +
        '$|f^{(n+1)}(c)| \\le 1$.',
        'Por tanto $|R_{' + d.n + '}| \\le \\dfrac{' + U.fmt(d.x, 1) + '^{' + (d.n + 1) + '}}{' +
        (d.n + 1) + '!} = ' + d.cota.toExponential(3).replace('.', ',') + '$',
        'Fíjate en que la cota no depende de saber cuánto vale $c$: por eso el truco funciona.'];
    },
    answer: function (d) { return d.cota.toExponential(3).replace('.', ','); }
  });

  p.exercise({
    title: 'Grado suficiente',
    level: 'avanzado',
    gen: function (r) {
      var x = r.pick([0.5, 1, 1.5, 2]);
      var cifras = r.int(4, 8);
      var eps = Math.pow(10, -cifras);
      for (var n = 1; n <= 40; n++) {
        if (Math.pow(x, n + 1) / ML.factorial(n + 1) < eps) return { x: x, cifras: cifras, n: n };
      }
      return null;
    },
    ask: function (d) {
      return '¿Qué grado $n$ hace falta como mínimo para que el polinomio de Taylor del seno en ' +
        '$a=0$ aproxime $\\operatorname{sen}(' + U.fmt(d.x, 1) + ')$ con error menor que $10^{-' +
        d.cifras + '}$?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Usa la cota ' +
        '$\\dfrac{|x|^{n+1}}{(n+1)!} < 10^{-' + d.cifras + '}$ y prueba valores de $n$.</span>';
    },
    fields: [{ name: 'n', label: 'Grado n', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    tol: 1e-9,
    hint: function () {
      return 'No hay fórmula: se tantea. Ve subiendo $n$ y calculando $\\frac{x^{n+1}}{(n+1)!}$ hasta ' +
        'bajar del umbral. El factorial hace que baste con muy pocos pasos.';
    },
    steps: function (d) {
      var t = ['Hay que encontrar el primer $n$ con $\\dfrac{' + U.fmt(d.x, 1) + '^{n+1}}{(n+1)!} < 10^{-' +
        d.cifras + '}$.'];
      for (var n = Math.max(1, d.n - 2); n <= d.n; n++) {
        var c = Math.pow(d.x, n + 1) / ML.factorial(n + 1);
        t.push('$n = ' + n + '$: cota $= ' + c.toExponential(2).replace('.', ',') + '$' +
          (n === d.n ? ' &nbsp;← ya baja del umbral' : ' — todavía no basta'));
      }
      t.push('Hace falta grado <strong>' + d.n + '</strong>. Como el seno solo tiene potencias ' +
        'impares, varios de esos términos son cero: en la práctica se suman muy pocos.');
      return t;
    },
    answer: function (d) { return 'n = ' + d.n; }
  });

  p.keys([
    'El polinomio de Taylor de orden $n$ en $a$ es el único polinomio de grado $n$ cuyas $n$ primeras derivadas en $a$ coinciden con las de $f$.',
    '$P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x-a)^k$. Cada término añade una información más sobre cómo se curva la función.',
    'El resto de Lagrange $R_n = \\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ convierte la aproximación en igualdad y permite <strong>garantizar</strong> cifras.',
    'Los cuatro de memoria: $e^x$, $\\operatorname{sen}x$, $\\cos x$ y $\\frac{1}{1-x}$, todos en $a=0$.',
    'La serie solo vale dentro de su <strong>radio de convergencia</strong>: fuera no aproxima mal, es que no converge.',
    '$\\operatorname{sen}x \\approx x$ es Taylor de grado 1, y es por lo que un péndulo tiene periodo constante.'
  ]);
});
