/* Tema: Teoremas de las funciones continuas */
Course.topic('fn-continuidad', function (p) {

  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }

  p.text('En [[fn-limites]] se vio qué significa que una función sea continua: que se pueda dibujar sin ' +
    'levantar el lápiz. Dicho así parece poca cosa, pero de esa propiedad se deducen tres teoremas ' +
    'con un poder sorprendente: aseguran que algo existe —una raíz, un valor, un máximo— <strong>sin ' +
    'calcularlo</strong>. Son teoremas de existencia, y su gracia está en que dicen que algo está ahí ' +
    'aunque no digan dónde.');

  p.text('Y tienen un punto débil que el examen pregunta siempre: las <strong>hipótesis</strong>. Si ' +
    'falla una sola, la conclusión deja de estar garantizada. Casi toda la dificultad del tema es ' +
    'comprobarlas antes de aplicar nada.');

  /* ---------------------------------------------------------------- */
  p.section('El teorema de Bolzano');

  p.formula('f \\text{ continua en } [a, b] \\ \\text{y}\\ f(a)\\cdot f(b) < 0 \\ \\Longrightarrow\\ \\exists\\, c \\in (a, b) : f(c) = 0',
    'teorema de Bolzano',
    'Se lee: <em>«si efe es continua en el intervalo cerrado a be y los valores en los extremos tienen ' +
      'signos contrarios, entonces existe al menos un ce entre a y be en el que efe vale cero»</em>.<br><br>' +
      'Que el producto $f(a)\\cdot f(b)$ sea negativo es una forma compacta de decir que uno es positivo ' +
      'y el otro negativo.<br><br>La idea es la de una carretera continua que sale por debajo del nivel ' +
      'del mar y llega por encima: en algún punto tiene que cruzarlo.');

  p.list([
    'Asegura <strong>al menos una</strong> raíz, no una sola: puede haber tres, o cinco.',
    '<strong>No dice dónde</strong> está, solo que está entre $a$ y $b$.',
    'Si los extremos tienen el mismo signo, <strong>no dice nada</strong>: puede haber raíces o no.'
  ]);

  p.text('Su uso más frecuente es demostrar que una ecuación tiene solución. Para ver que ' +
    '$f(x) = g(x)$ tiene solución en $(a, b)$, se estudia $h(x) = f(x) - g(x)$ y se le aplica Bolzano. ' +
    'Y si además $h$ es estrictamente creciente o decreciente en el intervalo, la solución es ' +
    '<strong>única</strong>, porque una función así solo puede cruzar el cero una vez.');

  p.demo({
    title: 'Acorralar una raíz partiendo por la mitad',
    intro: 'f(x) = x³ − x − 1 es continua, negativa en 1 y positiva en 2: Bolzano asegura una raíz en medio. Pulsa para partir el intervalo por la mitad y quedarte con la mitad donde sigue habiendo cambio de signo. Es el método de bisección.',
    build: function (host) {
      var f = function (x) { return x * x * x - x - 1; };
      var a, b, pasos;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0.6, xmax: 2.2, ymin: -2, ymax: 5, height: 300,
        draw: function (g) {
          g.rect(a, -2, b - a, 7, { fill: 0, fillAlpha: 0.12, stroke: false });
          g.fn(f, { color: 0, w: 2.6 });
          g.point(a, f(a), { color: f(a) < 0 ? 'bad' : 'ok', r: 5 });
          g.point(b, f(b), { color: f(b) < 0 ? 'bad' : 'ok', r: 5 });
        }
      });
      function reset() { a = 1; b = 2; pasos = 0; pinta(); }
      function pinta() {
        out.set('Paso ' + pasos + ': intervalo $[' + U.fmt(a, 5) + ',\\ ' + U.fmt(b, 5) + ']$, de longitud $' + U.fmt(b - a, 5) + '$<br>' +
          '$f(' + U.fmt(a, 4) + ') \\approx ' + U.fmt(f(a), 4) + '$ y $f(' + U.fmt(b, 4) + ') \\approx ' + U.fmt(f(b), 4) + '$: signos contrarios, la raíz sigue dentro.');
        plot.render();
      }
      W.buttons(host, [
        {
          t: 'Partir por la mitad', cls: 'btn--main', on: function () {
            var m = (a + b) / 2;
            if (f(a) * f(m) <= 0) b = m; else a = m;
            pasos++; pinta();
          }
        },
        { t: '↺ Empezar', on: reset }
      ]);
      W.hint(host, 'Cada paso divide la longitud por dos: con 10 pasos el error ya es menor que una milésima. La raíz es 1,3247…');
      reset();
    }
  });

  p.hist('Bernard Bolzano era un sacerdote de Praga, apartado de su cátedra por sus ideas, cuando en 1817 ' +
    'publicó una demostración de este teorema que no se apoyaba en ningún dibujo, solo en la definición ' +
    'de continuidad. Hasta entonces se daba por evidente: ¿cómo va a pasar una curva de abajo arriba ' +
    'sin cruzar? Bolzano sostuvo que lo evidente también hay que demostrarlo, porque es ahí donde se ' +
    'esconden los errores. Casi nadie lo leyó. Medio siglo después, Weierstrass llegó a las mismas ideas ' +
    'por su cuenta, y fue entonces cuando se reconoció que el cura de Praga se había adelantado a todos.');

  /* ---------------------------------------------------------------- */
  p.section('Cuando falla una hipótesis');

  p.text('La mejor manera de entender las hipótesis es ver qué pasa sin ellas. Elige un caso:');

  p.demo({
    title: 'Hipótesis que fallan y conclusiones que se caen',
    intro: 'Cuatro funciones en el intervalo marcado. Mira en cada una si se cumplen las dos hipótesis de Bolzano y si hay raíz.',
    build: function (host) {
      var CASOS = {
        bien: { t: 'continua, cambia de signo', f: function (x) { return 0.5 * x * x * x - 1; }, a: -1, b: 2, txt: 'Las dos hipótesis se cumplen: hay raíz, como promete el teorema.' },
        salto: { t: 'con un salto', f: function (x) { return x < 0.5 ? -1 : 1.5; }, a: -1, b: 2, txt: 'Cambia de signo, pero da un salto en $x = 0,5$: <strong>no es continua</strong> y no hay raíz. El teorema no se aplica.' },
        asint: { t: 'con una asíntota', f: function (x) { return 1 / (x - 0.5); }, a: -1, b: 2, txt: '$f(-1) < 0$ y $f(2) > 0$, pero en $x = 0,5$ hay una asíntota: <strong>no es continua</strong> y nunca vale 0.' },
        mismo: { t: 'mismo signo en los extremos', f: function (x) { return x * x - x - 0.5; }, a: -1, b: 2, txt: '$f(-1) > 0$ y $f(2) > 0$: <strong>no hay cambio de signo</strong>, así que Bolzano no dice nada… y sin embargo aquí hay dos raíces. No asegura, pero tampoco prohíbe.' }
      };
      var cual = 'bien';
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.4, xmax: 2.4, ymin: -3, ymax: 3, height: 280,
        draw: function (g) {
          var c = CASOS[cual];
          g.rect(c.a, -3, c.b - c.a, 6, { fill: 0, fillAlpha: 0.08, stroke: false });
          g.fn(c.f, { color: 0, w: 2.6 });
          g.point(c.a, c.f(c.a), { color: 2, r: 5, label: 'a' });
          g.point(c.b, c.f(c.b), { color: 2, r: 5, label: 'b' });
        }
      });
      function pinta() { out.set(CASOS[cual].txt); plot.render(); }
      W.chips(host, Object.keys(CASOS).map(function (k) { return { label: CASOS[k].t, value: k }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Los valores intermedios (Darboux)');

  p.formula('f \\text{ continua en } [a, b] \\ \\text{y}\\ k \\text{ entre } f(a) \\text{ y } f(b) \\ \\Longrightarrow\\ \\exists\\, c \\in [a, b] : f(c) = k',
    'teorema de los valores intermedios',
    'Se lee: <em>«si efe es continua en a be, toma todos los valores comprendidos entre efe de a y ' +
      'efe de be»</em>.<br><br>Es Bolzano aplicado a $f(x) - k$, que cambia de signo en los extremos. ' +
      'Una función continua no puede saltarse ningún valor.');

  p.util('Tiene consecuencias que parecen trucos. En algún momento de tu vida has medido exactamente un ' +
    'metro: tu altura ha cambiado de forma continua desde algo menos hasta algo más. Una mesa cuadrada ' +
    'de patas iguales en un suelo irregular (pero continuo) siempre se puede girar hasta que deje de ' +
    'cojear: al girarla un cuarto de vuelta, la función que mide cuánto cojea cambia de signo. Y en ' +
    'cada instante hay dos puntos opuestos del ecuador con exactamente la misma temperatura. Los tres son ' +
    'el teorema de los valores intermedios. Y el primero de sus usos serios es el que se ve arriba: la ' +
    'bisección, el método de búsqueda de raíces más seguro que existe, que el [[av-numerico|cálculo ' +
    'numérico]] lleva hasta el final.');

  /* ---------------------------------------------------------------- */
  p.section('El teorema de Weierstrass');

  p.formula('f \\text{ continua en } [a, b] \\ \\Longrightarrow\\ f \\text{ alcanza en } [a, b] \\text{ un máximo y un mínimo absolutos}',
    'teorema de Weierstrass',
    'Se lee: <em>«si efe es continua en el intervalo cerrado a be, hay un punto de ese intervalo donde ' +
      'efe toma su valor más alto y otro donde toma el más bajo»</em>.<br><br>Las dos hipótesis son ' +
      'imprescindibles: la continuidad y que el intervalo sea <strong>cerrado</strong>, con sus extremos ' +
      'incluidos.');

  p.text('Es la garantía que hay detrás de todos los problemas de optimización en un intervalo cerrado: ' +
    'como el máximo <em>existe</em>, basta buscarlo entre unos pocos candidatos —los extremos del ' +
    'intervalo y los puntos donde se anula la derivada—, que es lo que se hará en ' +
    '[[fn-aplicaciones]].');

  p.demo({
    title: 'Cerrado o abierto: el máximo que falta',
    intro: 'La misma función f(x) = x² en tres intervalos. Solo en el cerrado se alcanzan el máximo y el mínimo. En el abierto los valores se acercan todo lo que quieras a 4, pero ninguno llega.',
    build: function (host) {
      var cual = 'cerrado';
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 2.6, ymin: -1, ymax: 5, height: 280,
        draw: function (g) {
          var f = function (x) { return x * x; };
          if (cual === 'disc') {
            g.fn(function (x) { return x === 2 ? NaN : x * x; }, { color: 0, w: 2.6, from: 0, to: 2 });
            g.point(2, 4, { color: 0, r: 5, hollow: true });
            g.point(2, 1, { color: 0, r: 5 });
            g.point(0, 0, { color: 'ok', r: 5 });
          } else {
            g.fn(f, { color: 0, w: 2.6, from: 0.5, to: 2 });
            var cerrado = cual === 'cerrado';
            g.point(0.5, 0.25, { color: cerrado ? 'ok' : 0, r: 5, hollow: !cerrado });
            g.point(2, 4, { color: cerrado ? 'ok' : 0, r: 5, hollow: !cerrado });
          }
        }
      });
      function pinta() {
        out.set({
          cerrado: 'En $[0,5;\\ 2]$ la función es continua y el intervalo cerrado: mínimo $0,25$ en $x = 0,5$ y máximo $4$ en $x = 2$. Weierstrass cumplido.',
          abierto: 'En $(0,5;\\ 2)$ faltan los extremos: los valores se acercan a $4$ y a $0,25$ sin tocarlos. <strong>No hay máximo ni mínimo.</strong>',
          disc: 'En $[0,\\ 2]$ pero con la función cambiada en $x = 2$, donde vale 1: ya no es continua, se acerca a 4 sin llegar y <strong>no hay máximo</strong> (el mínimo, en cambio, sí está: el teorema no lo garantiza, pero tampoco lo impide).'
        }[cual]);
        plot.render();
      }
      W.chips(host, [{ label: 'intervalo cerrado', value: 'cerrado' }, { label: 'intervalo abierto', value: 'abierto' }, { label: 'con una discontinuidad', value: 'disc' }],
        { value: cual, on: function (v) { cual = v; pinta(); } });
      pinta();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Se puede aplicar Bolzano?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        function () {
          var c = r.int(1, 7), a = 0, b = 3;
          return { f: 'x^3 - ' + c, a: a, b: b, ok: 'si', por: 'es un polinomio (continuo) y $f(0) = -' + c + ' < 0$, $f(3) = ' + (27 - c) + ' > 0$' };
        },
        function () {
          var c = r.int(1, 3);
          return { f: '\\dfrac{1}{x - ' + c + '}', a: c - 1, b: c + 1, ok: 'disc', por: 'no es continua en $x = ' + c + '$, que está dentro del intervalo' };
        },
        function () {
          var c = r.int(2, 6);
          return { f: 'x^2 + ' + c, a: -2, b: 2, ok: 'signo', por: '$f(-2) = f(2) = ' + (4 + c) + '$: los dos positivos' };
        },
        function () {
          var c = r.int(2, 5);
          return { f: '\\dfrac{x^2 - ' + (c * c) + '}{x}', a: -1, b: c + 1, ok: 'disc', por: 'no está definida en $x = 0$, dentro del intervalo' };
        },
        function () {
          return { f: '\\cos x', a: 0, b: 3, ok: 'si', por: 'el coseno es continuo, $\\cos 0 = 1 > 0$ y $\\cos 3 \\approx -0,99 < 0$' };
        },
        function () {
          var c = r.int(1, 4);
          return { f: 'e^x + ' + c, a: -3, b: 3, ok: 'signo', por: '$e^x + ' + c + '$ es siempre positiva' };
        }
      ];
      return r.pick(casos)();
    },
    ask: function (d) { return '¿Se puede aplicar el teorema de Bolzano a $f(x) = ' + d.f + '$ en el intervalo $[' + d.a + ',\\ ' + d.b + ']$?'; },
    fields: [{
      name: 't', label: 'Respuesta', opts: [
        { t: 'Sí: asegura al menos una raíz', v: 'si' },
        { t: 'No: la función no es continua en el intervalo', v: 'disc' },
        { t: 'No: no cambia de signo en los extremos', v: 'signo' }]
    }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return ['Comprueba las dos hipótesis, por orden.', 'Primera: ¿es continua en todo el intervalo cerrado? Segunda: ¿tienen $f(a)$ y $f(b)$ signos contrarios?']; },
    steps: function (d) { return ['Se comprueba que ' + d.por + '.', { si: 'Las dos hipótesis se cumplen: hay al menos una raíz en el intervalo.', disc: 'Falla la continuidad: el teorema no se puede aplicar.', signo: 'No hay cambio de signo: el teorema no dice nada.' }[d.ok]]; },
    answer: function (d) { return { si: 'Sí', disc: 'No, no es continua', signo: 'No, no cambia de signo' }[d.ok]; }
  });

  p.exercise({
    title: 'Localizar una raíz entre dos enteros',
    level: 'medio',
    gen: function (r) {
      var pc = r.int(1, 5), q = r.pm(1, 20);
      var f = function (x) { return x * x * x + pc * x + q; };
      // raiz unica: la funcion es creciente
      var lo = -10;
      while (f(lo + 1) < 0 && lo < 10) lo++;
      if (f(lo) === 0 || f(lo + 1) === 0) return null;
      return { pc: pc, q: q, a: lo, fa: f(lo), fb: f(lo + 1) };
    },
    ask: function (d) {
      return 'La ecuación $' + ML.polyTex([1, 0, d.pc, d.q]) + ' = 0$ tiene una única solución real. Encuentra un entero $a$ tal que la solución esté en $(a,\\ a + 1)$.';
    },
    fields: [{ name: 'a', label: 'a =', w: 'tiny' }],
    sol: function (d) { return { a: d.a }; },
    check: function (v, d) {
      if (isNaN(v.a)) return { ok: false, msg: 'Escribe un número entero.' };
      if (v.a !== Math.round(v.a)) return { ok: false, msg: 'Tiene que ser un número entero.' };
      return v.a === d.a;
    },
    hint: function () {
      return ['Da valores enteros a $x$ y mira el signo de $f(x)$.',
        'Busca dos enteros seguidos donde el signo cambie: Bolzano asegura la raíz entre ellos.'];
    },
    steps: function (d) {
      return ['$f(' + d.a + ') = ' + d.fa + ' < 0$ y $f(' + (d.a + 1) + ') = ' + d.fb + ' > 0$.',
        'La función es continua (polinomio) y cambia de signo: por Bolzano, la raíz está en $(' + d.a + ',\\ ' + (d.a + 1) + ')$.'];
    },
    answer: function (d) { return 'a = ' + d.a; }
  });

  p.exercise({
    title: 'Dos pasos de bisección',
    level: 'medio',
    gen: function (r) {
      var c = r.pick([2, 3, 5, 6, 7, 10]);
      var f = function (x) { return x * x - c; };
      var a = Math.floor(Math.sqrt(c)), b = a + 1;
      var pasos = [];
      for (var i = 0; i < 2; i++) {
        var m = (a + b) / 2;
        pasos.push({ a: a, b: b, m: m, fm: f(m) });
        if (f(a) * f(m) <= 0) b = m; else a = m;
      }
      return { c: c, a0: Math.floor(Math.sqrt(c)), pasos: pasos, a: a, b: b };
    },
    ask: function (d) {
      return 'Para aproximar $\\sqrt{' + d.c + '}$ se busca la raíz de $f(x) = x^2 - ' + d.c + '$ en $[' + d.a0 + ',\\ ' + (d.a0 + 1) + ']$. Aplica <strong>dos</strong> pasos de bisección. ¿Qué intervalo queda?';
    },
    fields: [{ name: 'a', label: 'extremo izquierdo', w: 'tiny' }, { name: 'b', label: 'extremo derecho', w: 'tiny' }],
    sol: function (d) { return { a: d.a, b: d.b }; },
    hint: function () { return ['Calcula el punto medio y el signo de $f$ en él.', 'Quédate con la mitad en la que $f$ cambia de signo, y repite.']; },
    steps: function (d) {
      return d.pasos.map(function (s, i) {
        return 'Paso ' + (i + 1) + ': en $[' + U.fmt(s.a, 3) + ',\\ ' + U.fmt(s.b, 3) + ']$ el punto medio es $' + U.fmt(s.m, 3) + '$ y $f(' + U.fmt(s.m, 3) + ') = ' + U.fmt(s.fm, 4) + '$ → ' +
          (s.fm > 0 ? 'positivo: la raíz está a la izquierda.' : 'negativo: la raíz está a la derecha.');
      }).concat(['Queda $[' + U.fmt(d.a, 3) + ',\\ ' + U.fmt(d.b, 3) + ']$, que contiene a $\\sqrt{' + d.c + '} \\approx ' + U.fmt(Math.sqrt(d.c), 4) + '$.']);
    },
    answer: function (d) { return '[' + U.fmt(d.a, 3) + ', ' + U.fmt(d.b, 3) + ']'; }
  });

  p.problem({
    title: 'Demostrar que una ecuación tiene solución',
    level: 'avanzado',
    gen: function (r) {
      var fam = r.int(0, 2);
      if (fam === 0) return { ec: 'e^x = 3 - x', h: 'e^x + x - 3', a: 0, b: 1, ha: -2, hb: Math.E - 2, mono: '$e^x$ y $x$ son crecientes, así que su suma también lo es' };
      if (fam === 1) return { ec: '\\ln x = 2 - x', h: '\\ln x + x - 2', a: 1, b: 2, ha: -1, hb: Math.log(2), mono: '$\\ln x$ y $x$ son crecientes, así que su suma también lo es' };
      return { ec: 'x^3 = \\cos x', h: 'x^3 - \\cos x', a: 0, b: 1, ha: -1, hb: 1 - Math.cos(1), mono: '$x^3$ es creciente y $-\\cos x$ también lo es en $(0, 1)$, porque el coseno decrece ahí' };
    },
    intro: function (d) { return 'Se quiere demostrar que la ecuación $' + d.ec + '$ tiene una única solución en el intervalo $(' + d.a + ',\\ ' + d.b + ')$. Se considera $h(x) = ' + d.h + '$, que es continua en $[' + d.a + ',\\ ' + d.b + ']$.'; },
    partes: [
      {
        ask: function (d) { return 'Calcula $h(' + d.a + ')$.'; },
        fields: [{ name: 'v', label: 'h(a)', w: 'tiny' }],
        sol: function (d) { return { v: d.ha }; },
        tol: 1e-4,
        hint: function () { return 'Sustituye en $h$. Recuerda que $e^0 = 1$, $\\ln 1 = 0$ y $\\cos 0 = 1$.'; },
        steps: function (d) { return ['$h(' + d.a + ') = ' + U.fmt(d.ha, 4) + '$, negativo.']; },
        answer: function (d) { return U.fmt(d.ha, 4); }
      },
      {
        ask: function (d) { return 'Calcula $h(' + d.b + ')$ (cuatro decimales).'; },
        fields: [{ name: 'v', label: 'h(b)', w: 'wide' }],
        sol: function (d) { return { v: U.round(d.hb, 6) }; },
        tol: 3e-4,
        errores: [{
          si: function (v, d) { return d.ec.indexOf('cos') >= 0 && Math.abs(v.v - (1 - Math.cos(Math.PI / 180))) < 1e-3; },
          msg: 'La calculadora está en grados: aquí el 1 son radianes.'
        }],
        hint: function () { return 'Sustituye con la calculadora en radianes.'; },
        steps: function (d) { return ['$h(' + d.b + ') \\approx ' + U.fmt(d.hb, 4) + '$, positivo.']; },
        answer: function (d) { return U.fmt(d.hb, 4); }
      },
      {
        ask: function (d) { return '¿Cuántas soluciones tiene la ecuación en $(' + d.a + ',\\ ' + d.b + ')$?'; },
        fields: [{
          name: 't', label: 'Soluciones', opts: [
            { t: 'Exactamente una', v: 'una' },
            { t: 'Al menos una, pero no se puede saber cuántas', v: 'alguna' },
            { t: 'Ninguna', v: 'ninguna' }]
        }],
        sol: function () { return { t: 'una' }; },
        errores: [{
          si: function (v) { return v.raw.t === 'alguna'; },
          msg: 'Bolzano solo da «al menos una», es verdad. Pero mira si $h$ es creciente: una función así no puede cruzar el cero dos veces.'
        }],
        hint: function () { return ['Bolzano asegura al menos una.', '¿Es $h$ creciente en el intervalo? Entonces no puede volver a cortar el eje.']; },
        steps: function (d) {
          return ['$h$ es continua y $h(' + d.a + ') < 0 < h(' + d.b + ')$: por Bolzano hay al menos una solución.',
            'Además ' + d.mono + ': solo puede cruzar el cero una vez. Hay <strong>exactamente una</strong> solución.'];
        },
        answer: function () { return 'Exactamente una'; }
      }
    ]
  });

  p.exercise({
    title: '¿Garantiza Weierstrass máximo y mínimo?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { f: 'x^2 - 4x', I: '[0,\\ 5]', ok: 'si', por: 'es un polinomio, continuo, en un intervalo cerrado' },
        { f: 'x^2 - 4x', I: '(0,\\ 5)', ok: 'abierto', por: 'el intervalo es abierto' },
        { f: '\\dfrac{1}{x}', I: '[-1,\\ 1]', ok: 'disc', por: 'no es continua en $x = 0$' },
        { f: '\\operatorname{sen} x', I: '[0,\\ \\pi]', ok: 'si', por: 'el seno es continuo y el intervalo cerrado' },
        { f: '\\ln x', I: '(0,\\ 1]', ok: 'abierto', por: 'el intervalo no es cerrado (le falta el 0)' },
        { f: '\\dfrac{x}{x - 2}', I: '[1,\\ 3]', ok: 'disc', por: 'no es continua en $x = 2$' },
        { f: 'e^{-x^2}', I: '[-3,\\ 3]', ok: 'si', por: 'es continua y el intervalo es cerrado' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return '¿Asegura el teorema de Weierstrass que $f(x) = ' + d.f + '$ alcanza un máximo y un mínimo absolutos en $' + d.I + '$?'; },
    fields: [{
      name: 't', label: 'Respuesta', opts: [
        { t: 'Sí', v: 'si' },
        { t: 'No se puede asegurar: el intervalo no es cerrado', v: 'abierto' },
        { t: 'No se puede asegurar: la función no es continua en él', v: 'disc' }]
    }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return 'Dos hipótesis: función continua e intervalo cerrado, con los dos extremos incluidos.'; },
    steps: function (d) { return ['Se observa que ' + d.por + '.', d.ok === 'si' ? 'Las hipótesis se cumplen: sí hay máximo y mínimo absolutos.' : 'Falla una hipótesis: el teorema no garantiza nada (puede haberlos o no).']; },
    answer: function (d) { return { si: 'Sí', abierto: 'No: intervalo no cerrado', disc: 'No: no es continua' }[d.ok]; }
  });

  p.keys([
    '<strong>Bolzano</strong>: continua en $[a,b]$ y signos contrarios en los extremos ⟹ al menos una raíz en $(a,b)$.',
    'Para ver que $f(x) = g(x)$ tiene solución, se aplica Bolzano a $h = f - g$; si $h$ es monótona, la solución es única.',
    'Bolzano no dice dónde está la raíz ni cuántas hay, y si no hay cambio de signo no dice nada.',
    'La <strong>bisección</strong> parte el intervalo por la mitad una y otra vez: cada paso divide el error entre dos.',
    '<strong>Valores intermedios</strong>: una función continua en $[a,b]$ toma todos los valores entre $f(a)$ y $f(b)$.',
    '<strong>Weierstrass</strong>: continua en un intervalo <em>cerrado</em> ⟹ alcanza máximo y mínimo absolutos.',
    'Antes de aplicar cualquiera de los tres, se comprueban las hipótesis: continuidad en todo el intervalo y, en Weierstrass, extremos incluidos.'
  ]);
});
