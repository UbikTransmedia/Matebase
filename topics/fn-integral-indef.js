/* Tema: Integral indefinida */
Course.topic('fn-integral-indef', function (p) {

  p.puente('Toda operación matemática tiene su inversa: sumar y restar, multiplicar y dividir, elevar y ' +
    'extraer raíces. La derivada también tiene la suya, y se llama <strong>integración</strong>. Toda ' +
    'la tabla de derivadas vale aquí leída al revés, y las dos reglas que más costaron —la de la ' +
    'cadena y la del producto— reaparecen como los dos métodos de integración.');

  p.text('Una <strong>primitiva</strong> de $f$ es una función $F$ cuya derivada es $f$. El conjunto de ' +
    'todas ellas es la <strong>integral indefinida</strong>.');

  p.formula('\\int f(x)\\,dx = F(x) + C \\quad \\text{si} \\quad F\'(x) = f(x)');

  p.note('Ese $+C$ no es una manía de los profesores. Como la derivada de una constante es cero, ' +
    '<strong>infinitas funciones</strong> tienen la misma derivada: $x^2$, $x^2+1$, $x^2-7$… Todas ' +
    'son primitivas de $2x$. Son la misma curva desplazada arriba y abajo, y por eso la integral ' +
    'indefinida no es una función, sino una <em>familia</em> de funciones.', 'warn', 'Por qué el +C es obligatorio');

  p.demo({
    title: 'La familia de primitivas',
    intro: 'Todas estas curvas tienen exactamente la misma derivada. Cambia C y verás que la forma no cambia: solo sube o baja.',
    predice: 'Todas las curvas $x^2 + C$ tienen la misma derivada. Si te piden la primitiva de $2x$ que pasa por $(1, 5)$, ¿cuánto tiene que valer $C$? Busca esa curva con el deslizador.',
    build: function (host, d) {
      var C = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -6, ymax: 8, height: 320,
        draw: function (g) {
          for (var k = -4; k <= 6; k += 2) {
            g.fn(function (x) { return x * x + k; }, { color: 'axis', w: 1.3, alpha: .5 });
          }
          g.fn(function (x) { return x * x + C; }, { color: 0, w: 3 });
          // tangentes iguales en x = 1 para dos primitivas distintas
          var m = 2;
          g.seg(0.2, 1 + C - m * 0.8, 1.8, 1 + C + m * 0.8, { color: 2, w: 2 });
          g.point(1, 1 + C, { color: 2, r: 5 });
        }
      });
      function paint() {
        out.set('$\\displaystyle\\int 2x\\,dx = x^2 + C$ &nbsp;·&nbsp; ahora $C = ' + U.fmt(C, 1) + '$<br>' +
          'La pendiente en $x=1$ vale $2$ <strong>en todas ellas</strong>, valga lo que valga $C$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Por eso hace falta un dato extra ' +
          '(un punto por el que pase) para determinar una primitiva concreta.</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'constante C', min: -4, max: 6, step: 0.5, value: 0, dec: 1, on: function (v) { C = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Integrales inmediatas');

  p.text('Se obtienen leyendo la tabla de derivadas del revés. Estas son las que hay que reconocer ' +
    'al instante:');

  p.table(['Integral', 'Resultado'],
    [['$\\int k\\,dx$', '$kx + C$'],
     ['$\\int x^n\\,dx$ &nbsp;($n \\ne -1$)', '$\\dfrac{x^{n+1}}{n+1} + C$'],
     ['$\\int \\dfrac{1}{x}\\,dx$', '$\\ln|x| + C$'],
     ['$\\int e^x\\,dx$', '$e^x + C$'],
     ['$\\int a^x\\,dx$', '$\\dfrac{a^x}{\\ln a} + C$'],
     ['$\\int \\operatorname{sen} x\\,dx$', '$-\\cos x + C$'],
     ['$\\int \\cos x\\,dx$', '$\\operatorname{sen} x + C$'],
     ['$\\int \\dfrac{1}{1+x^2}\\,dx$', '$\\arctan x + C$']]);

  p.note('La regla de la potencia falla justo en $n=-1$, porque dividiría entre cero. Ese hueco lo ' +
    'tapa el logaritmo: $\\int x^{-1}dx = \\ln|x|+C$. Es una de esas casualidades preciosas que ' +
    'conectan dos mundos aparentemente distintos.', null, 'El agujero de la regla de la potencia');

  p.comprueba('¿Cuánto vale $\\displaystyle\\int \\frac{1}{x^2}\\,dx$?', [
    { t: '$\\ln|x| + C$', ok: false, por: 'El logaritmo es la primitiva de $\\frac{1}{x}$, no de $\\frac{1}{x^2}$. Aquí el exponente es $-2$, no $-1$, y la regla de la potencia sí vale.' },
    { t: '$-\\dfrac{1}{x} + C$', ok: true, por: '$\\int x^{-2}\\,dx = \\dfrac{x^{-1}}{-1} = -\\dfrac{1}{x}$. Comprobación: la derivada de $-\\frac{1}{x}$ es $\\frac{1}{x^2}$ ✓.' },
    { t: '$\\dfrac{1}{x} + C$', ok: false, por: 'Deriva para comprobar: $\\left(\\frac{1}{x}\\right)\' = -\\frac{1}{x^2}$, con signo menos. Falta cambiar el signo.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.util('Integrar es deshacer una derivada, y eso responde a la pregunta inversa de la del tema ' +
    'anterior: si sé el ritmo, ¿cuánto se ha acumulado? Un caudalímetro mide litros por segundo e ' +
    'integra para facturarte el agua del mes; un contador de la luz mide potencia e integra para dar ' +
    'kilovatios hora; el navegador de un avión mide aceleración con sensores e integra dos veces ' +
    'para saber dónde está sin necesidad de señal exterior.');

  p.section('Inmediatas de tipo compuesto');

  p.text('La tabla de arriba vale también cuando en lugar de $x$ hay una función, <strong>siempre que ' +
    'venga acompañada de su derivada</strong>. Es la regla de la cadena leída al revés, y reconocer ' +
    'estos patrones de un vistazo ahorra la mitad de los cambios de variable del examen.');

  p.formulas([
    '\\int f\'(x)\\,f(x)^n\\,dx = \\frac{f(x)^{n+1}}{n+1} + C \\qquad \\int \\frac{f\'(x)}{f(x)}\\,dx = \\ln|f(x)| + C',
    '\\int f\'(x)\\,e^{f(x)}\\,dx = e^{f(x)} + C \\qquad \\int f\'(x)\\cos f(x)\\,dx = \\operatorname{sen} f(x) + C'
  ], 'la tabla de inmediatas, con una función dentro',
    'Se leen igual que las simples, con $f(x)$ en el papel de $x$. Por ejemplo, la segunda: <em>«la ' +
      'integral de efe prima partido por efe es el logaritmo del valor absoluto de efe»</em>.<br><br>' +
      'La prueba de fuego es buscar la derivada: en $\\int \\frac{2x}{x^2 + 1}\\,dx$, el numerador $2x$ ' +
      'es la derivada del denominador, así que sale $\\ln(x^2 + 1) + C$ sin más.<br><br>Si la derivada ' +
      'está pero le falta una constante, se ajusta multiplicando y dividiendo: ' +
      '$\\int x\\,e^{x^2}dx = \\frac{1}{2}\\int 2x\\,e^{x^2}dx = \\frac{1}{2}e^{x^2} + C$.');

  p.ejemplo({
    title: 'Ajustar la constante que falta',
    enunciado: 'Calcular $\\displaystyle\\int \\frac{x}{x^2 + 1}\\,dx$.',
    pasos: [
      { t: '<strong>Buscar el patrón.</strong> El denominador es $x^2 + 1$ y su derivada es $2x$. En el numerador hay $x$: la derivada está, pero le falta un 2.', antes: '¿Cuál es la derivada del denominador? ¿Aparece en el numerador?' },
      { t: '<strong>Ajustar.</strong> Se multiplica y se divide por 2, sacando fuera el que divide: $\\displaystyle\\frac{1}{2}\\int\\frac{2x}{x^2 + 1}\\,dx$. Ahora el numerador es exactamente la derivada del denominador.', antes: 'Se puede meter un 2 dentro si se compensa fuera. ¿Con qué?' },
      { t: '<strong>Integrar.</strong> $\\dfrac{1}{2}\\ln|x^2 + 1| + C = \\dfrac{1}{2}\\ln(x^2 + 1) + C$. El valor absoluto sobra porque $x^2 + 1$ es siempre positivo.' },
      { t: '<strong>Comprobar derivando.</strong> $\\left(\\dfrac{1}{2}\\ln(x^2 + 1)\\right)\' = \\dfrac{1}{2}\\cdot\\dfrac{2x}{x^2 + 1} = \\dfrac{x}{x^2 + 1}$ ✓.', antes: 'Deriva el resultado. ¿Vuelve a salir el integrando?' }
    ],
    cierre: 'Comprobar derivando tarda diez segundos y es la única garantía. Integrar es reconocer patrones; derivar es mecánico, así que la comprobación siempre es más fiable que el cálculo.'
  });

  p.section('Cambio de variable');

  p.text('Es la regla de la cadena leída al revés. Si dentro de la integral aparece una función ' +
    '<em>y también su derivada</em>, se sustituye esa función por una letra nueva.');

  p.formula('\\int f(g(x))\\,g\'(x)\\,dx = \\int f(t)\\,dt \\quad \\text{con } t = g(x)');

  p.sub('El paso que nadie explica: de dónde sale $dt = 2x\\,dx$');

  p.text('Aquí es donde casi todo el mundo se pierde, porque de pronto el $dx$ —que hasta ahora era un ' +
    'adorno al final de la integral— se pone a multiplicar y a moverse de sitio como si fuera un ' +
    'número. Conviene decir qué está pasando, porque no es magia y tampoco es del todo lo que parece.');

  p.text('Si llamamos $t = x^2$, la derivada de $t$ respecto de $x$ es $\\frac{dt}{dx} = 2x$. Leibniz ' +
    'escribió la derivada como una fracción precisamente porque, en el fondo, es un cociente entre dos ' +
    'incrementos diminutos. Y si es un cociente, se puede pasar el de abajo multiplicando: ' +
    '$dt = 2x\\,dx$. Ese es todo el truco.');

  p.note('En rigor, $dx$ no es un número y esa manipulación es una <em>notación cómoda</em>, no una ' +
    'división de verdad. Está perfectamente justificada —hay teoría detrás que la respalda—, pero es ' +
    'honesto decir que en Bachillerato se usa como una regla que funciona. Si en algún momento te ha ' +
    'parecido que ahí faltaba una explicación, tenías razón: faltaba.', null, 'Por qué chirría');

  p.text('Con eso, el cambio de variable consiste en tres movimientos mecánicos: <strong>elegir</strong> ' +
    'qué llamas $t$, <strong>derivar</strong> para obtener la relación entre $dt$ y $dx$, y ' +
    '<strong>sustituir</strong> hasta que en la integral no quede ni rastro de la $x$. Si queda alguna ' +
    '$x$ suelta, el cambio elegido no era el bueno.');

  p.formula('\\int 2x\\,e^{x^2}dx \\ \\xrightarrow{t=x^2,\\ dt=2x\\,dx} \\ \\int e^t dt = e^t + C = e^{x^2}+C',
    'el cambio, paso a paso',
    'La flecha con letras encima se lee «haciendo el cambio».<br><br>Seguimiento del ejemplo: llamamos ' +
    '$t=x^2$; derivando, $dt = 2x\\,dx$. En la integral original hay un $2x\\,dx$ <em>entero</em>, así ' +
    'que se sustituye por $dt$ de golpe, y el $e^{x^2}$ se convierte en $e^t$. Queda $\\int e^t dt$, ' +
    'que es inmediata.<br><br><strong>Y no te olvides del último paso</strong>: deshacer el cambio. La ' +
    'respuesta tiene que estar en la variable de la pregunta, así que donde ponga $t$ se vuelve a ' +
    'escribir $x^2$.');

  p.section('Integración por partes');

  p.text('Es la regla del producto leída al revés. Sirve cuando el integrando es un producto de dos ' +
    'funciones de distinta naturaleza (un polinomio por una exponencial, por ejemplo).');

  p.formula('\\int u\\,dv = u\\,v - \\int v\\,du');

  p.note('Para elegir quién es $u$ hay una regla mnemotécnica: <strong>ALPES</strong> — ' +
    'Arcos, Logaritmos, Polinomios, Exponenciales, Senos. Se elige como $u$ el que aparezca antes en ' +
    'esa lista, porque es el que más se simplifica al derivarlo.', 'ok', 'Cómo elegir u');

  p.comprueba('Para $\\displaystyle\\int x\\cos x\\,dx$ por partes, ¿qué conviene tomar como $u$?', [
    { t: '$u = x$', ok: true, por: 'Por ALPES, el polinomio va antes que el seno/coseno. Al derivarlo desaparece ($du = dx$) y la integral que queda, $\\int \\operatorname{sen} x\\,dx$, es inmediata.' },
    { t: '$u = \\cos x$', ok: false, por: 'Entonces $dv = x\\,dx$ y $v = \\frac{x^2}{2}$: la nueva integral, $\\int \\frac{x^2}{2}\\operatorname{sen} x\\,dx$, es <em>peor</em> que la original. La elección va al revés.' },
    { t: 'Da igual: por partes sale siempre', ok: false, por: 'Sale siempre una igualdad válida, pero solo con la elección buena la integral nueva es más fácil. Con la mala, se complica en cada vuelta.' }
  ]);

  p.formula('\\int x\\,e^x dx = x\\,e^x - \\int e^x dx = x\\,e^x - e^x + C = e^x(x-1)+C');

  p.text('Integrar es mucho más difícil que derivar. Derivar es mecánico: cualquier función elemental ' +
    'se deriva siguiendo reglas. Integrar requiere reconocer patrones y a veces ni siquiera es ' +
    'posible: $\\int e^{-x^2}dx$ no tiene ninguna expresión con funciones elementales, y sin embargo ' +
    'es la integral más importante de toda la estadística.');

  p.trampas([
    { e: 'Olvidar el $+C$', por: 'Sin él se está dando una sola primitiva de las infinitas. Y en un problema con condición inicial, el $C$ es justo lo que hay que calcular.' },
    { e: '$\\int f\\cdot g = \\int f\\cdot\\int g$', por: 'Falso, igual que la derivada del producto no era el producto de derivadas. $\\int x\\cdot x\\,dx = \\frac{x^3}{3}$, pero $\\frac{x^2}{2}\\cdot\\frac{x^2}{2} = \\frac{x^4}{4}$.' },
    { e: '$\\int \\dfrac{1}{x}\\,dx = -\\dfrac{1}{x^2}$', por: 'Eso es la <em>derivada</em> de $\\frac{1}{x}$, en sentido contrario. La primitiva es $\\ln|x|$.' },
    { e: 'Dejar la respuesta en $t$ tras un cambio de variable', por: 'La pregunta estaba en $x$: el último paso es deshacer el cambio. $e^t + C$ no es respuesta; $e^{x^2} + C$ sí.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('La constante de integración, esa $+C$ que tanto se olvida, es lo que hace falta un dato más: ' +
    'saber el ritmo no basta para saber dónde estás, hay que saber además de dónde saliste. Un GPS ' +
    'inercial que integre aceleraciones necesita una posición inicial; un depósito del que se conoce ' +
    'el caudal necesita el nivel de partida. La $C$ no es un formalismo: es el dato que falta.');

  p.hist('El símbolo de la integral es una ese alargada, de <em>summa</em>, y lo escribió Leibniz por ' +
    'primera vez el 29 de octubre de 1675, en un manuscrito privado. Ese mismo día inventó también ' +
    'la notación $dx$. Newton, que había llegado a los mismos resultados antes, usaba puntitos sobre ' +
    'las letras; el pleito por la prioridad entre ambos envenenó las matemáticas británicas durante ' +
    'un siglo, porque Inglaterra se aferró por patriotismo a una notación peor.');

  p.section('Practica');

  p.exercise({
    title: 'Integral de un polinomio',
    level: 'basico',
    gen: function (r) {
      var a = r.nz(-6, 6), b = r.nz(-8, 8), c = r.pm(1, 9);
      var x = r.pm(1, 3);
      // F(x) = a x^3/3 + b x^2/2 + c x   ->  evaluamos en x
      var val = a * Math.pow(x, 3) / 3 + b * x * x / 2 + c * x;
      return { a: a, b: b, c: c, x: x, val: val };
    },
    ask: function (d) {
      return 'Calcula una primitiva $F$ de $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) + '$ con $F(0)=0$, ' +
        'y evalúala en $x = ' + d.x + '$ (cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'F(' + d.x + ') =', w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Cada $x^n$ se convierte en $\\frac{x^{n+1}}{n+1}$. Con $F(0)=0$ la constante es cero.'; },
    steps: function (d) {
      return ['$\\displaystyle\\int \\left(' + ML.polyTex([d.a, d.b, d.c]) + '\\right)dx = ' +
        '\\dfrac{' + d.a + 'x^3}{3} + \\dfrac{' + d.b + 'x^2}{2} + ' + d.c + 'x + C$',
        'Como $F(0)=0$, la constante vale $C=0$.',
        'Sustituimos $x = ' + d.x + '$: $F(' + d.x + ') = ' + U.fmt(d.val, 4) + '$.',
        'Comprobación: al derivar $F$ tiene que salir $f$ ✓'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Regla de la potencia',
    level: 'medio',
    gen: function (r) {
      var k = r.nz(-8, 8);
      var n = r.pick([2, 3, 4, 5, -2, -3, 0.5]);
      if (n === -1) return null;
      return { k: k, n: n, coef: k / (n + 1), exp: n + 1 };
    },
    ask: function (d) {
      var pot = d.n === 0.5 ? '\\sqrt{x}' : 'x^{' + d.n + '}';
      return 'Calcula $\\displaystyle\\int ' + d.k + pot + '\\,dx$. Da el coeficiente y el exponente ' +
        'del resultado (cuatro decimales el coeficiente).';
    },
    fields: [{ name: 'c', label: 'Coeficiente', w: 'wide' }, { name: 'e', label: 'Exponente', w: 'tiny' }],
    sol: function (d) { return { c: U.round(d.coef, 6), e: d.exp }; },
    tol: 3e-4,
    hint: function (d) { return 'Se sube uno al exponente y se divide entre el nuevo exponente: $\\frac{x^{n+1}}{n+1}$.'; },
    steps: function (d) {
      return ['Regla: $\\displaystyle\\int x^n dx = \\dfrac{x^{n+1}}{n+1} + C$.',
        'Aquí $n = ' + U.fmt(d.n, 2) + '$, así que el nuevo exponente es $' + U.fmt(d.exp, 2) + '$.',
        'Y el coeficiente queda $\\dfrac{' + d.k + '}{' + U.fmt(d.exp, 2) + '} = ' + U.fmt(d.coef, 4) + '$.',
        'Resultado: $' + U.fmt(d.coef, 4) + 'x^{' + U.fmt(d.exp, 2) + '} + C$'];
    },
    answer: function (d) { return '$' + U.fmt(d.coef, 4) + 'x^{' + U.fmt(d.exp, 2) + '} + C$'; }
  });

  p.exercise({
    title: 'Inmediata de tipo compuesto',
    level: 'medio',
    gen: function (r) {
      var fam = r.int(0, 2), a = r.pm(1, 4), b = r.pm(1, 6), m = r.pick([1, 2, 3, -1]);
      var x = r.int(0, 2), g = a * x * x + b, v;
      if (fam === 0) { if (g <= 0) return null; v = m * Math.log(g) / 1; }
      else if (fam === 1) { v = m * Math.exp(a * x * x) / 1; if (Math.abs(v) > 1e5) return null; }
      else { v = m * Math.sin(a * x * x + b); }
      return { fam: fam, a: a, b: b, m: m, x: x, g: g, v: v };
    },
    ask: function (d) {
      var num = ML.termTex(d.m * 2 * d.a, 'x', 1, true);
      var tex = [
        '\\dfrac{' + num + '}{' + ML.polyTex([d.a, 0, d.b]) + '}',
        num + '\\,e^{' + ML.termTex(d.a, 'x', 2, true) + '}',
        num + '\\cos(' + ML.polyTex([d.a, 0, d.b]) + ')'
      ][d.fam];
      return 'Calcula $\\displaystyle\\int ' + tex + '\\,dx$ tomando $C = 0$ y evalúa la primitiva en $x = ' + d.x + '$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'valor', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 3e-4,
    hint: function (d) {
      return ['Busca una función cuya derivada esté también en el integrando.',
        ['El numerador es ' + d.m + ' veces la derivada del denominador: sale un logaritmo.', 'Lo que multiplica es ' + d.m + ' veces la derivada del exponente: sale la misma exponencial.', 'Lo que multiplica es ' + d.m + ' veces la derivada de lo de dentro del coseno: sale un seno.'][d.fam]];
    },
    steps: function (d) {
      var prim = [d.m + '\\ln|' + ML.polyTex([d.a, 0, d.b]) + '|', d.m + 'e^{' + ML.termTex(d.a, 'x', 2, true) + '}', d.m + '\\operatorname{sen}(' + ML.polyTex([d.a, 0, d.b]) + ')'][d.fam];
      return ['Es de tipo compuesto: la primitiva es $' + prim + ' + C$.', 'En $x = ' + d.x + '$ vale $' + U.fmt(d.v, 4) + '$.', 'Comprobación: derivando $' + prim + '$ con la regla de la cadena vuelve a salir el integrando ✓'];
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'Cambio de variable',
    level: 'avanzado',
    gen: function (r) {
      var a = r.nz(-4, 4), b = r.pm(1, 6), n = r.int(2, 5);
      var x = r.pm(0, 2);
      // integral de a*(ax+b)^n dx = (ax+b)^(n+1)/(n+1)  (porque la derivada de (ax+b) es a)
      var val = Math.pow(a * x + b, n + 1) / (n + 1);
      if (Math.abs(val) > 1e6) return null;
      return { a: a, b: b, n: n, x: x, val: val };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\int ' + d.a + '\\left(' + ML.termTex(d.a, 'x', 1, true) +
        ML.termTex(d.b, '', 0, false) + '\\right)^{' + d.n + '}dx$ tomando la primitiva que se anula ' +
        'donde el paréntesis vale cero, y evalúala en $x = ' + d.x + '$ (cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'Valor en x = ' + d.x, w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Haz $t = ' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) +
        '$. Entonces $dt = ' + d.a + '\\,dx$, que es justo lo que hay delante.';
    },
    steps: function (d) {
      var dentro = ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false);
      return ['Cambio: $t = ' + dentro + '$, con $dt = ' + d.a + '\\,dx$.',
        'La integral se convierte en $\\displaystyle\\int t^{' + d.n + '}dt = \\dfrac{t^{' + (d.n + 1) + '}}{' + (d.n + 1) + '} + C$.',
        'Deshacemos el cambio: $\\dfrac{\\left(' + dentro + '\\right)^{' + (d.n + 1) + '}}{' + (d.n + 1) + '} + C$.',
        'En $x = ' + d.x + '$ el paréntesis vale $' + (d.a * d.x + d.b) + '$, así que el resultado es $' + U.fmt(d.val, 4) + '$.'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Integración por partes',
    level: 'avanzado',
    gen: function (r) {
      var k = r.nz(-5, 5);
      var x = r.pm(0, 2);
      // integral de k*x*e^x dx = k*e^x(x-1)
      var val = k * Math.exp(x) * (x - 1);
      return { k: k, x: x, val: val };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\int ' + d.k + 'x\\,e^x dx$ (tomando $C=0$) y evalúala en ' +
        '$x = ' + d.x + '$ (cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'v', label: 'Valor en x = ' + d.x, w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Por ALPES, $u = x$ (polinomio) y $dv = e^x dx$. Entonces $du = dx$ y $v = e^x$.'; },
    steps: function (d) {
      return ['Elegimos $u = x$ y $dv = e^x dx$, así que $du = dx$ y $v = e^x$.',
        '$\\displaystyle\\int x e^x dx = x e^x - \\int e^x dx = x e^x - e^x = e^x(x-1)$.',
        'Con el coeficiente: $' + d.k + 'e^x(x-1)$.',
        'En $x = ' + d.x + '$: $' + d.k + ' \\cdot ' + U.fmt(Math.exp(d.x), 4) + ' \\cdot (' + d.x + '-1) = ' + U.fmt(d.val, 4) + '$.',
        'Fíjate en que hemos elegido $u=x$ para que al derivarlo <em>desaparezca</em>: esa es toda la gracia del método.'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.keys([
    'Integrar es deshacer la derivada: $F$ es primitiva de $f$ si $F\' = f$.',
    'El $+C$ es obligatorio: hay infinitas primitivas, una por cada desplazamiento vertical.',
    '$\\int x^n dx = \\frac{x^{n+1}}{n+1}+C$, salvo en $n=-1$, donde sale $\\ln|x|+C$.',
    'Si una función aparece junto a su derivada, la integral es inmediata: $\\int \\frac{f\'}{f} = \\ln|f|$, $\\int f\'e^f = e^f$.',
    'Cambio de variable = regla de la cadena al revés: busca una función y su derivada.',
    'Por partes = regla del producto al revés. Para elegir $u$: ALPES.',
    'Integrar es bastante más difícil que derivar, y a veces sencillamente no se puede.'
  ]);
});
