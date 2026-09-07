/* Tema: Integral indefinida */
Course.topic('fn-integral-indef', function (p) {

  p.text('Toda operación matemática tiene su inversa: sumar y restar, multiplicar y dividir, elevar y ' +
    'extraer raíces. La derivada también tiene la suya, y se llama <strong>integración</strong>.');

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
          '<span style="font-size:12.5px;color:var(--ink-faint)">Por eso hace falta un dato extra ' +
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

  /* ---------------------------------------------------------------- */
  p.util('Integrar es deshacer una derivada, y eso responde a la pregunta inversa de la del tema ' +
    'anterior: si sé el ritmo, ¿cuánto se ha acumulado? Un caudalímetro mide litros por segundo e ' +
    'integra para facturarte el agua del mes; un contador de la luz mide potencia e integra para dar ' +
    'kilovatios hora; el navegador de un avión mide aceleración con sensores e integra dos veces ' +
    'para saber dónde está sin necesidad de señal exterior.');

  p.section('Cambio de variable');

  p.text('Es la regla de la cadena leída al revés. Si dentro de la integral aparece una función ' +
    '<em>y también su derivada</em>, se sustituye esa función por una letra nueva.');

  p.formula('\\int f(g(x))\\,g\'(x)\\,dx = \\int f(t)\\,dt \\quad \\text{con } t = g(x)');

  p.formula('\\int 2x\\,e^{x^2}dx \\ \\xrightarrow{t=x^2,\\ dt=2x\\,dx} \\ \\int e^t dt = e^t + C = e^{x^2}+C');

  p.section('Integración por partes');

  p.text('Es la regla del producto leída al revés. Sirve cuando el integrando es un producto de dos ' +
    'funciones de distinta naturaleza (un polinomio por una exponencial, por ejemplo).');

  p.formula('\\int u\\,dv = u\\,v - \\int v\\,du');

  p.note('Para elegir quién es $u$ hay una regla mnemotécnica: <strong>ALPES</strong> — ' +
    'Arcos, Logaritmos, Polinomios, Exponenciales, Senos. Se elige como $u$ el que aparezca antes en ' +
    'esa lista, porque es el que más se simplifica al derivarlo.', 'ok', 'Cómo elegir u');

  p.formula('\\int x\\,e^x dx = x\\,e^x - \\int e^x dx = x\\,e^x - e^x + C = e^x(x-1)+C');

  p.text('Integrar es mucho más difícil que derivar. Derivar es mecánico: cualquier función elemental ' +
    'se deriva siguiendo reglas. Integrar requiere reconocer patrones y a veces ni siquiera es ' +
    'posible: $\\int e^{-x^2}dx$ no tiene ninguna expresión con funciones elementales, y sin embargo ' +
    'es la integral más importante de toda la estadística.');

  /* ================= EJERCICIOS ================= */
  p.util('La constante de integración, esa $+C$ que tanto se olvida, es lo que hace falta un dato más: ' +
    'saber el ritmo no basta para saber dónde estás, hay que saber además de dónde saliste. Un GPS ' +
    'inercial que integre aceleraciones necesita una posición inicial; un depósito del que se conoce ' +
    'el caudal necesita el nivel de partida. La $C$ no es un formalismo: es el dato que falta.');

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
    'Cambio de variable = regla de la cadena al revés: busca una función y su derivada.',
    'Por partes = regla del producto al revés. Para elegir $u$: ALPES.',
    'Integrar es bastante más difícil que derivar, y a veces sencillamente no se puede.'
  ]);
});
