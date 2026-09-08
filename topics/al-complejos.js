/* Tema: Números complejos */
Course.topic('al-complejos', function (p) {

  p.text('$x^2 + 1 = 0$ no tiene solución real: ningún número real elevado al cuadrado da negativo. ' +
    'Durante siglos la respuesta fue «esta ecuación no tiene solución». Hasta que alguien probó a ' +
    '<em>inventarse</em> una.');

  p.formula('i = \\sqrt{-1} \\qquad\\text{es decir}\\qquad i^2 = -1', 'la unidad imaginaria',
    'Se lee: <em>«i es igual a la raíz de menos uno; es decir, i al cuadrado es igual a menos ' +
      'uno»</em>.<br><br>Conviene fijarse en cuál de las dos es la definición seria. La segunda, ' +
      '$i^2=-1$, es la que se usa siempre y la que no da problemas. La primera es una manera cómoda de ' +
      'decirlo, pero escribir «la raíz de menos uno» invita a operar con ella como si fuera una raíz ' +
      'corriente, y ahí aparecen paradojas.<br><br>La letra $i$ es de <em>imaginario</em>, un nombre ' +
      'que le puso Descartes con intención despectiva y que se quedó.');

  p.text('Con ese único ingrediente nuevo se construye todo un sistema numérico. Un ' +
    '<strong>número complejo</strong> tiene una parte real y una imaginaria:');

  p.formula('z = a + b\\,i \\qquad a = \\operatorname{Re}(z), \\quad b = \\operatorname{Im}(z)');

  p.hist('Los complejos no nacieron para resolver $x^2+1=0$ —eso simplemente se declaraba imposible— ' +
    'sino de las ecuaciones de <strong>tercer</strong> grado. En el siglo XVI, la fórmula de Cardano ' +
    'para algunas cúbicas obligaba a pasar por raíces de números negativos <em>aunque las tres ' +
    'soluciones finales fueran reales y evidentes</em>. Era imposible ignorarlos: hacían falta como ' +
    'camino aunque no aparecieran en el destino. Descartes los llamó «imaginarios» con desprecio, y ' +
    'el nombre se quedó. Hoy son imprescindibles en electrónica, mecánica cuántica y procesamiento de señal.');

  p.section('El plano complejo');

  p.text('La idea que lo cambió todo (Argand y Gauss, hacia 1800): si un número real es un punto de ' +
    'una recta, un complejo es un <strong>punto del plano</strong>. La parte real en el eje ' +
    'horizontal, la imaginaria en el vertical.');

  p.demo({
    title: 'Un complejo es un punto del plano',
    intro: 'Arrastra el punto. Verás sus dos formas de escribirlo: por coordenadas (binómica) y por distancia y ángulo (polar).',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 340,
        xlabel: 'Re', ylabel: 'Im',
        handles: {
          Z: { x: 3, y: 2, label: 'z', color: 0, constrain: function (h) { h.x = Math.round(h.x * 2) / 2; h.y = Math.round(h.y * 2) / 2; } }
        },
        draw: function (g) {
          var z = g.h('Z');
          var m = Math.hypot(z.x, z.y);
          var ang = Math.atan2(z.y, z.x);
          g.circle(0, 0, m, { color: 'axis', w: 1, dash: true, stroke: true });
          g.arc(0, 0, 0.8, 0, ang, { color: 2, w: 2 });
          g.vec(0, 0, z.x, z.y, { color: 0, w: 3 });
          g.seg(z.x, 0, z.x, z.y, { color: 3, w: 1.6, dash: true });
          g.seg(0, z.y, z.x, z.y, { color: 3, w: 1.6, dash: true });
          g.point(z.x, -z.y, { color: 1, r: 5, label: 'z̄', labelDy: 14 });
          var gr = ang * 180 / Math.PI;
          out.set('<strong>Binómica:</strong> $z = ' + U.fmt(z.x, 1) +
            (z.y >= 0 ? ' + ' + U.fmt(z.y, 1) : ' - ' + U.fmt(-z.y, 1)) + 'i$<br>' +
            '<strong>Módulo:</strong> $|z| = \\sqrt{' + U.fmt(z.x * z.x, 2) + ' + ' + U.fmt(z.y * z.y, 2) +
            '} = ' + U.fmt(m, 4) + '$ &nbsp;·&nbsp; <strong>Argumento:</strong> $' +
            U.fmt(gr < 0 ? gr + 360 : gr, 1) + '^\\circ$<br>' +
            '<strong>Polar:</strong> $z = ' + U.fmt(m, 3) + '_{' + U.fmt(gr < 0 ? gr + 360 : gr, 1) + '^\\circ}$ ' +
            '&nbsp;·&nbsp; <strong>Conjugado:</strong> $\\bar{z} = ' + U.fmt(z.x, 1) +
            (z.y >= 0 ? ' - ' + U.fmt(z.y, 1) : ' + ' + U.fmt(-z.y, 1)) + 'i$');
        }
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Los números complejos son la herramienta cotidiana de la ingeniería eléctrica. Una corriente ' +
    'alterna tiene amplitud y desfase —dos datos—, y meterlos en un solo número complejo convierte ' +
    'ecuaciones diferenciales endiabladas en simples sumas y productos. La electrónica de tu casa se ' +
    'diseña así. Y la mecánica cuántica no es que los use: está <em>escrita</em> en ellos, porque la ' +
    'función de onda es un número complejo en cada punto.');

  p.section('Operar en forma binómica');
  p.text('Operar con complejos en forma binómica es operar con binomios normales, tratando la $i$ como si ' +
    'fuera una letra cualquiera. Solo hay una regla extra, y es la que lo cambia todo: cada vez que ' +
    'aparezca $i^2$, se sustituye por $-1$. Con eso basta para las cuatro operaciones.');


  p.list([
    '<strong>Sumar y restar</strong>: parte real con parte real, imaginaria con imaginaria. Es sumar vectores.',
    '<strong>Multiplicar</strong>: como dos binomios, y al final se usa $i^2 = -1$.',
    '<strong>Dividir</strong>: se multiplica arriba y abajo por el <em>conjugado</em> del denominador, y así el denominador se vuelve real.'
  ]);

  p.formulas([
    '(a+bi)(c+di) = (ac - bd) + (ad + bc)i',
    '\\frac{1}{a+bi} = \\frac{a-bi}{(a+bi)(a-bi)} = \\frac{a-bi}{a^2+b^2}'
  ]);

  p.note('El <strong>conjugado</strong> $\\bar{z} = a - bi$ es el reflejo de $z$ respecto al eje real. ' +
    'Su gracia es que $z\\cdot\\bar{z} = a^2+b^2 = |z|^2$ es siempre un <em>número real positivo</em>. ' +
    'Por eso sirve para quitar la $i$ del denominador.', 'ok');

  p.sub('Las potencias de i se repiten cada cuatro');
  p.text('Elevar $i$ a potencias sucesivas no produce números cada vez mayores, como pasaría con ' +
    'cualquier número real: produce un ciclo que se repite. La razón es que $i^2=-1$ y, por tanto, ' +
    '$i^4 = (i^2)^2 = 1$; multiplicar cuatro veces por $i$ te devuelve al punto de partida. Es ' +
    'exactamente lo que ocurre al girar 90° cuatro veces.');


  p.formula('i^1 = i, \\quad i^2 = -1, \\quad i^3 = -i, \\quad i^4 = 1, \\quad i^5 = i \\dots');

  p.text('Para calcular $i^n$ basta con dividir $n$ entre 4 y quedarse con el <strong>resto</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Forma polar y De Moivre');

  p.text('En forma polar, un complejo se describe con su <strong>módulo</strong> $r$ (la distancia al ' +
    'origen) y su <strong>argumento</strong> $\\alpha$ (el ángulo). Y entonces multiplicar se vuelve ' +
    'asombrosamente sencillo:');

  p.formulas([
    'z = r_{\\alpha} = r(\\cos\\alpha + i\\operatorname{sen}\\alpha)',
    'r_{\\alpha}\\cdot s_{\\beta} = (r\\cdot s)_{\\alpha+\\beta}',
    '\\left(r_{\\alpha}\\right)^n = \\left(r^n\\right)_{n\\alpha}'
  ], 'multiplicar = multiplicar módulos y sumar argumentos',
    'La notación $r_{\\alpha}$ es solo una <strong>abreviatura</strong>, no una potencia ni un ' +
    'subíndice de posición: se lee «erre sub alfa» y significa «el complejo que está a distancia erre ' +
    'del origen, en la dirección alfa». Es como dar una posición diciendo «a 300 metros, hacia el ' +
    'noreste» en vez de «tres calles al este y dos al norte».<br><br>Las tres líneas se dicen: ' +
    '<em>«zeta es erre sub alfa, que es erre por, coseno de alfa más i seno de alfa»</em> · ' +
    '<em>«erre sub alfa por ese sub beta es erre por ese, sub alfa más beta»</em> · <em>«erre sub ' +
    'alfa, elevado a ene, es erre elevado a ene, sub ene alfa»</em>.');

  p.text('Antes de seguir conviene entender por qué al multiplicar se <em>suman</em> los ángulos, ' +
    'porque parece una regla arbitraria y es lo contrario. Ya sabes que multiplicar por un complejo ' +
    'es girar y escalar; pues bien, encadenar dos giros de 30° y 40° deja el objeto girado 70°: los ' +
    'giros se suman, igual que las vueltas de una llave. Y encadenar un doble y un triple deja algo ' +
    'seis veces mayor: las escalas se multiplican. Cada número complejo lleva dentro esas dos ' +
    'instrucciones —cuánto girar y cuánto estirar— y al multiplicarlos, cada una se combina a su manera.');

  p.note('La comprobación algebraica de esto es exactamente la fórmula de adición del seno y del ' +
    'coseno que viste en trigonometría: si desarrollas el producto $r(\\cos\\alpha+i\\operatorname{sen}' +
    '\\alpha)\\cdot s(\\cos\\beta+i\\operatorname{sen}\\beta)$ y agrupas, aparecen ' +
    '$\\cos(\\alpha+\\beta)$ y $\\operatorname{sen}(\\alpha+\\beta)$ solos. Aquellas fórmulas que ' +
    'parecían gratuitas estaban preparando esto.', 'ok', 'De dónde sale, si quieres verlo');

  p.text('Esa última es la <strong>fórmula de De Moivre</strong>. Y la lectura geométrica es preciosa: ' +
    '<em>multiplicar por un complejo es girar y escalar</em>. Multiplicar por $i$, que tiene módulo 1 ' +
    'y argumento $90^\\circ$, es girar un cuarto de vuelta. Por eso $i^2 = -1$: dos cuartos de vuelta ' +
    'son media vuelta.');

  p.demo({
    title: 'Multiplicar es girar y estirar',
    intro: 'Arrastra los dos complejos. El producto tiene por módulo el producto de los módulos y por argumento la suma de los argumentos.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 340,
        xlabel: 'Re', ylabel: 'Im',
        handles: {
          A: { x: 1.5, y: 1, label: 'z₁', color: 0, constrain: snap },
          B: { x: 1, y: 1, label: 'z₂', color: 1, constrain: snap }
        },
        draw: function (g) {
          var a = g.h('A'), b = g.h('B');
          var px = a.x * b.x - a.y * b.y, py = a.x * b.y + a.y * b.x;
          g.vec(0, 0, a.x, a.y, { color: 0, w: 2.6 });
          g.vec(0, 0, b.x, b.y, { color: 1, w: 2.6 });
          g.vec(0, 0, px, py, { color: 2, w: 3.2 });
          g.text(px, py, 'z₁·z₂', { color: 2, dx: 10, dy: -10, box: true, size: 13 });
          var m1 = Math.hypot(a.x, a.y), m2 = Math.hypot(b.x, b.y);
          var g1 = Math.atan2(a.y, a.x) * 180 / Math.PI, g2 = Math.atan2(b.y, b.x) * 180 / Math.PI;
          var gp = Math.atan2(py, px) * 180 / Math.PI;
          out.set('$|z_1| = ' + U.fmt(m1, 3) + '$, arg $= ' + U.fmt(g1, 1) + '^\\circ$ &nbsp;·&nbsp; ' +
            '$|z_2| = ' + U.fmt(m2, 3) + '$, arg $= ' + U.fmt(g2, 1) + '^\\circ$<br>' +
            'Producto: módulo $' + U.fmt(m1, 3) + ' \\cdot ' + U.fmt(m2, 3) + ' = ' + U.fmt(m1 * m2, 3) + '$, ' +
            'argumento $' + U.fmt(g1, 1) + '^\\circ + ' + U.fmt(g2, 1) + '^\\circ = ' + U.fmt(g1 + g2, 1) + '^\\circ$ ' +
            '(equivale a $' + U.fmt(gp, 1) + '^\\circ$)');
        }
      });
      function snap(h) { h.x = Math.round(h.x * 2) / 2; h.y = Math.round(h.y * 2) / 2; }
      W.hint(host, 'Pon z₂ en (0, 1), que es la i: verás que el producto es z₁ girado 90°.');
    }
  });

  p.sub('El teorema fundamental del álgebra');

  p.text('Con los complejos, el álgebra por fin se cierra: <strong>todo polinomio de grado $n$ tiene ' +
    'exactamente $n$ raíces</strong> (contando multiplicidades). Ninguna ecuación polinómica se queda ' +
    'ya sin solución. Ese fue el premio a inventarse $i$.');

  /* ================= EJERCICIOS ================= */
  p.util('En forma polar, multiplicar es girar. Esa idea es la base del tratamiento digital de señales: ' +
    'cuando el móvil separa tu voz del ruido, cuando una canción se guarda en MP3 o cuando una foto ' +
    'se comprime en JPEG, por dentro hay millones de multiplicaciones de números complejos girando. ' +
    'La verás con nombre propio en [[av-fourier|el tema de Fourier]].');

  p.section('Practica');

  p.exercise({
    title: 'Producto en forma binómica',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 7), b = r.pm(1, 7), c = r.pm(1, 7), e = r.pm(1, 7);
      return { a: a, b: b, c: c, e: e, re: a * c - b * e, im: a * e + b * c };
    },
    ask: function (d) {
      var f = function (x, y) {
        return '(' + x + (y >= 0 ? '+' + y : y) + 'i)';
      };
      return 'Calcula $' + f(d.a, d.b) + f(d.c, d.e) + '$ y da su parte real y su parte imaginaria.';
    },
    fields: [{ name: 're', label: 'Parte real', w: 'tiny' }, { name: 'im', label: 'Parte imaginaria', w: 'tiny' }],
    sol: function (d) { return { re: d.re, im: d.im }; },
    hint: function () { return 'Multiplica como dos binomios y al final sustituye $i^2 = -1$.'; },
    steps: function (d) {
      return ['Aplicamos la distributiva: $' + d.a + '\\cdot' + d.c + ' + ' + d.a + '\\cdot' + d.e + 'i + ' +
        d.b + '\\cdot' + d.c + 'i + ' + d.b + '\\cdot' + d.e + 'i^2$.',
        'El último término lleva $i^2 = -1$, así que pasa a ser real: $' + (-d.b * d.e) + '$.',
        'Parte real: $' + (d.a * d.c) + ' + (' + (-d.b * d.e) + ') = ' + d.re + '$.',
        'Parte imaginaria: $' + (d.a * d.e) + ' + ' + (d.b * d.c) + ' = ' + d.im + '$.',
        'Resultado: $' + d.re + (d.im >= 0 ? '+' + d.im : d.im) + 'i$'];
    },
    answer: function (d) { return '$' + d.re + (d.im >= 0 ? '+' + d.im : d.im) + 'i$'; }
  });

  p.exercise({
    title: 'Potencia de i',
    level: 'basico',
    gen: function (r) {
      var n = r.int(5, 200);
      var res = n % 4;
      return { n: n, res: res, texto: ['1', 'i', '-1', '-i'][res] };
    },
    ask: function (d) {
      return 'Calcula $i^{' + d.n + '}$.<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>1</code>, <code>-1</code>, ' +
        '<code>i</code> o <code>-i</code>.</span>';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.texto }; },
    check: function (v, d) {
      var t = v.raw.v.trim().toLowerCase().replace(/\s/g, '').replace('+', '');
      return t === d.texto.toLowerCase();
    },
    hint: function (d) { return 'Las potencias de $i$ se repiten cada 4. Divide $' + d.n + '$ entre 4 y quédate con el resto.'; },
    steps: function (d) {
      return ['$i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$, y vuelta a empezar.',
        'Dividimos: $' + d.n + ' = 4 \\cdot ' + Math.floor(d.n / 4) + ' + ' + d.res + '$.',
        'El resto es $' + d.res + '$, así que $i^{' + d.n + '} = i^{' + d.res + '} = ' + d.texto + '$.'];
    },
    answer: function (d) { return d.texto; }
  });

  p.exercise({
    title: 'Módulo y argumento',
    level: 'medio',
    gen: function (r) {
      var pares = [[3, 4], [4, 3], [6, 8], [5, 12], [12, 5], [8, 15], [1, 1], [1, 0], [0, 1]];
      var pr = r.pick(pares);
      var a = pr[0] * r.sign(), b = pr[1] * r.sign();
      var ang = Math.atan2(b, a) * 180 / Math.PI;
      return { a: a, b: b, mod: Math.hypot(a, b), ang: ang < 0 ? ang + 360 : ang };
    },
    ask: function (d) {
      return 'Halla el módulo y el argumento (en grados, entre $0^\\circ$ y $360^\\circ$, un decimal) de ' +
        '$z = ' + d.a + (d.b >= 0 ? '+' + d.b : d.b) + 'i$.';
    },
    fields: [{ name: 'm', label: 'Módulo', w: 'tiny' }, { name: 'a', label: 'Argumento (°)', w: 'tiny' }],
    sol: function (d) { return { m: U.round(d.mod, 4), a: U.round(d.ang, 1) }; },
    tol: 3e-4,
    hint: function () { return 'Módulo: Pitágoras con las dos partes. Argumento: arco tangente, mirando en qué cuadrante cae.'; },
    steps: function (d) {
      return ['$|z| = \\sqrt{' + d.a + '^2 + (' + d.b + ')^2} = \\sqrt{' + (d.a * d.a + d.b * d.b) + '} = ' + U.fmt(d.mod, 4) + '$',
        'El punto $(' + d.a + ', ' + d.b + ')$ está en el cuadrante ' +
        (d.a > 0 ? (d.b >= 0 ? 'I' : 'IV') : (d.b >= 0 ? 'II' : 'III')) + '.',
        '$\\alpha = \\arctan\\dfrac{' + d.b + '}{' + d.a + '}$, ajustado al cuadrante: $' + U.fmt(d.ang, 1) + '^\\circ$'];
    },
    answer: function (d) { return 'Módulo ' + U.fmt(d.mod, 4) + ', argumento ' + U.fmt(d.ang, 1) + '°.'; }
  });

  p.exercise({
    title: 'Ecuación de segundo grado con soluciones complejas',
    level: 'avanzado',
    gen: function (r) {
      var re = r.pm(0, 5), im = r.int(1, 6);
      // raices  re ± im i  ->  x^2 - 2re x + (re^2+im^2)
      return { re: re, im: im, b: -2 * re, c: re * re + im * im };
    },
    ask: function (d) {
      return 'Resuelve $' + ML.polyTex([1, d.b, d.c]) + ' = 0$ en el conjunto de los complejos. ' +
        'Da la parte real y la parte imaginaria <strong>positiva</strong> de las soluciones.';
    },
    fields: [{ name: 're', label: 'Parte real', w: 'tiny' }, { name: 'im', label: 'Parte imaginaria', w: 'tiny' }],
    sol: function (d) { return { re: d.re, im: d.im }; },
    hint: function (d) {
      return 'El discriminante sale negativo: $\\Delta = ' + (d.b * d.b - 4 * d.c) +
        '$. Escribe $\\sqrt{\\Delta} = \\sqrt{' + (4 * d.c - d.b * d.b) + '}\\,i$.';
    },
    steps: function (d) {
      var D = d.b * d.b - 4 * d.c;
      return ['$\\Delta = ' + d.b + '^2 - 4\\cdot' + d.c + ' = ' + D + '$, que es negativo.',
        'En los reales no habría solución, pero ahora sí: $\\sqrt{' + D + '} = \\sqrt{' + (-D) + '}\\,i = ' +
        U.fmt(Math.sqrt(-D), 4) + 'i$.',
        '$x = \\dfrac{' + (-d.b) + ' \\pm ' + U.fmt(Math.sqrt(-D), 4) + 'i}{2}$',
        'Soluciones: $' + d.re + ' + ' + d.im + 'i$ y $' + d.re + ' - ' + d.im + 'i$.',
        'Fíjate en que son <strong>conjugadas</strong>: siempre pasa cuando los coeficientes son reales.'];
    },
    answer: function (d) { return '$' + d.re + ' \\pm ' + d.im + 'i$'; }
  });

  p.keys([
    '$i^2 = -1$. Un complejo es $z = a+bi$: un punto del plano.',
    'Se suman como vectores; se multiplican como binomios usando $i^2=-1$.',
    'Para dividir, se multiplica arriba y abajo por el conjugado.',
    'Las potencias de $i$ se repiten cada cuatro: basta el resto de dividir entre 4.',
    'En forma polar, multiplicar = multiplicar módulos y <strong>sumar argumentos</strong>: es girar y escalar.',
    'Teorema fundamental del álgebra: todo polinomio de grado $n$ tiene $n$ raíces complejas.',
    'Si los coeficientes son reales, las raíces complejas van siempre en parejas conjugadas.'
  ]);
});
