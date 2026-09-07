/* Tema: Estudio de funciones y optimización */
Course.topic('fn-aplicaciones', function (p) {

  p.text('Ya sabes derivar. Ahora viene para qué sirve: la derivada permite <strong>dibujar una ' +
    'función sin dar valores</strong> y <strong>encontrar el mejor valor posible</strong> de una ' +
    'cantidad. Son las dos aplicaciones que justifican todo el cálculo diferencial.');

  p.section('La primera derivada: crecimiento y extremos');

  p.text('Todo lo que viene ahora sale de una sola frase que ya conoces: <strong>la derivada es la ' +
    'pendiente de la tangente</strong>. Si en un punto la pendiente es positiva, la tangente apunta ' +
    'hacia arriba y la función va subiendo por allí; si es negativa, apunta hacia abajo y la función ' +
    'baja. No hay nada más que memorizar, porque es lo mismo que sabes de las cuestas.');

  p.text('Piensa en un paseo por una montaña. Mientras subes, la pendiente bajo tus pies es positiva; ' +
    'mientras bajas, negativa. ¿Y en la cumbre? Justo en lo más alto el suelo está <em>llano</em> ' +
    'durante un instante: la pendiente vale cero. Lo mismo pasa en el fondo de un valle. Por eso los ' +
    'puntos donde la derivada se anula son los candidatos a máximo y mínimo.');

  p.formulas([
    'f\'(x) > 0 \\Rightarrow f \\text{ crece}',
    'f\'(x) < 0 \\Rightarrow f \\text{ decrece}',
    'f\'(x) = 0 \\Rightarrow \\text{punto crítico (posible máximo o mínimo)}'
  ], null,
    'La flecha doble $\\Rightarrow$ se lee «implica» o, más llanamente, «entonces».<br><br>' +
    'Las tres líneas se dicen: <em>«si efe prima de equis es mayor que cero, entonces efe crece»</em> · ' +
    '<em>«si es menor que cero, efe decrece»</em> · <em>«si es igual a cero, hay un punto crítico»</em>.' +
    '<br><br>Y en la cabeza conviene guardarlas así: <em>pendiente hacia arriba, subo; pendiente hacia ' +
    'abajo, bajo; suelo llano, puede que haya llegado a una cumbre o a un valle</em>.');

  p.note('Ojo con el «posible». Que la derivada se anule no garantiza que haya un extremo: en ' +
    '$f(x)=x^3$ se cumple $f\'(0)=0$ y sin embargo la función sigue subiendo. Lo que decide es si la ' +
    'derivada <strong>cambia de signo</strong> al pasar por ese punto.', 'warn');

  p.section('La segunda derivada: curvatura');

  p.text('La segunda derivada es, simplemente, la derivada de la derivada: no mide la pendiente, sino ' +
    '<strong>cómo va cambiando la pendiente</strong>. Suena rebuscado y es una idea muy física. Sigue ' +
    'en la carretera: la primera derivada es la inclinación de la cuesta; la segunda dice si esa ' +
    'cuesta se está poniendo cada vez más empinada o cada vez más suave.');

  p.text('Cuando la pendiente no para de aumentar, la curva se va doblando hacia arriba y toma forma ' +
    'de cuenco: es lo que en clase se llama <em>cóncava hacia arriba</em>. Cuando la pendiente ' +
    'disminuye, se dobla hacia abajo y toma forma de campana. Y el punto donde deja de doblarse hacia ' +
    'un lado y empieza a doblarse hacia el otro es el <strong>punto de inflexión</strong>: el ' +
    'instante en que el volante pasa de girar a la izquierda a girar a la derecha.');

  p.formulas([
    'f\'\'(x) > 0 \\Rightarrow \\text{cóncava hacia arriba (convexa)}',
    'f\'\'(x) < 0 \\Rightarrow \\text{cóncava hacia abajo}',
    'f\'\'(x) = 0 \\text{ y cambia de signo} \\Rightarrow \\text{punto de inflexión}'
  ], null,
    'Las dos comillas se leen «segunda»: $f\'\'(x)$ es «efe segunda de equis».<br><br>' +
    'Truco visual que no falla: <strong>si la segunda derivada es positiva, la curva sonríe</strong> ' +
    '(forma de $\\smile$, como un cuenco que recoge agua); si es negativa, pone cara triste (forma de ' +
    '$\\frown$). Positivo arriba, negativo abajo.');

  p.note('Cuidado con el vocabulario, porque los libros no se ponen de acuerdo: lo que aquí llamamos ' +
    '«cóncava hacia arriba» algunos lo llaman <em>convexa</em> y otros, directamente, <em>cóncava</em>. ' +
    'Para no depender de la palabra, quédate con el dibujo y con el signo: si $f\'\'>0$, la curva ' +
    'sonríe. Eso no admite discusión.', null, 'Un lío de nombres');

  p.text('Y de aquí sale el <strong>criterio rápido</strong> para clasificar un punto crítico, que te ' +
    'ahorra estudiar el signo de la primera derivada a los dos lados. Si en un punto la pendiente vale ' +
    'cero y además la curva sonríe, ese punto llano es el fondo del cuenco: un <strong>mínimo</strong>. ' +
    'Si la pendiente vale cero y la curva pone cara triste, es la cima: un <strong>máximo</strong>.');

  p.note('El criterio rápido tiene una letra pequeña: si en el punto crítico la segunda derivada ' +
    'también vale cero, <em>no decide nada</em> y hay que volver al método largo de mirar cómo cambia ' +
    'el signo de $f\'$. Es justo lo que pasa en $f(x)=x^3$ en el origen, donde las dos derivadas se ' +
    'anulan y no hay ni máximo ni mínimo.', 'warn', 'Cuando el atajo no sirve');

  p.demo({
    title: 'La función, su derivada y su segunda derivada',
    intro: 'Las tres gráficas a la vez. Donde la primera derivada corta el eje, la función tiene un pico o un valle. Donde lo corta la segunda, la curva cambia de curvatura.',
    build: function (host, d) {
      var a = 0.2, b = -0.4, c = -2;
      var out = W.readout(host, '');
      var f = function (x) { return a * x * x * x + b * x * x + c * x + 1; };
      var f1 = function (x) { return 3 * a * x * x + 2 * b * x + c; };
      var f2 = function (x) { return 6 * a * x + 2 * b; };
      var p1 = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -8, ymax: 8, height: 200, ylabel: 'f',
        draw: function (g) {
          g.fn(f, { color: 0, w: 2.6 });
          var s = ML.quadratic(3 * a, 2 * b, c);
          if (s.n === 2) {
            g.point(s.x1, f(s.x1), { color: 2, r: 5.5 });
            g.point(s.x2, f(s.x2), { color: 2, r: 5.5 });
          }
          var infl = -2 * b / (6 * a);
          g.point(infl, f(infl), { color: 4, r: 5, hollow: true });
        }
      });
      var p2 = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -8, ymax: 8, height: 170, ylabel: "f'",
        draw: function (g) {
          g.fn(f1, { color: 1, w: 2.6 });
          g.hline(0, { color: 'axis', w: 1.2 });
          var s = ML.quadratic(3 * a, 2 * b, c);
          if (s.n === 2) { g.point(s.x1, 0, { color: 2, r: 5 }); g.point(s.x2, 0, { color: 2, r: 5 }); }
        }
      });
      var p3 = W.plot(host, {
        xmin: -6, xmax: 6, ymin: -8, ymax: 8, height: 170, ylabel: "f''",
        draw: function (g) {
          g.fn(f2, { color: 3, w: 2.6 });
          g.hline(0, { color: 'axis', w: 1.2 });
          g.point(-2 * b / (6 * a), 0, { color: 4, r: 5 });
        }
      });
      function paint() {
        var s = ML.quadratic(3 * a, 2 * b, c);
        var infl = -2 * b / (6 * a);
        var txt = '$f(x) = ' + ML.polyTex([a, b, c, 1]) + '$<br>' +
          '$f\'(x) = ' + ML.polyTex([3 * a, 2 * b, c]) + '$ &nbsp;·&nbsp; ' +
          '$f\'\'(x) = ' + ML.polyTex([6 * a, 2 * b]) + '$<br>';
        if (s.n === 2) {
          var lo = Math.min(s.x1, s.x2), hi = Math.max(s.x1, s.x2);
          txt += 'Puntos críticos en $x = ' + U.fmt(lo, 3) + '$ (' + (f2(lo) > 0 ? 'mínimo' : 'máximo') +
            ') y $x = ' + U.fmt(hi, 3) + '$ (' + (f2(hi) > 0 ? 'mínimo' : 'máximo') + ').<br>';
        } else txt += 'Sin puntos críticos: la función es monótona.<br>';
        txt += 'Punto de inflexión en $x = ' + U.fmt(infl, 3) + '$.';
        out.set(txt);
        p1.render(); p2.render(); p3.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'a', min: 0.05, max: 0.5, step: 0.05, value: 0.2, dec: 2, on: function (v) { a = v; paint(); } });
      W.slider(row, { label: 'b', min: -2, max: 2, step: 0.2, value: -0.4, dec: 2, on: function (v) { b = v; paint(); } });
      W.slider(row, { label: 'c', min: -4, max: 2, step: 0.25, value: -2, dec: 2, on: function (v) { c = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('La segunda derivada tiene un nombre que oyes a menudo sin saberlo: en un coche es la ' +
    'aceleración, y su derivada —la tercera— es el <em>tirón</em>, que es lo que hace que un ' +
    'ascensor resulte cómodo o desagradable. Los ingenieros de montañas rusas y de ascensores no ' +
    'diseñan la posición, diseñan las derivadas. En una epidemia, el punto de inflexión, donde la ' +
    'segunda derivada cambia de signo, es el día en que la cosa empieza a mejorar aunque los casos ' +
    'sigan subiendo.');

  p.section('Receta para estudiar una función');
  p.text('Con todo lo anterior ya se puede dibujar una función sin dar un solo valor, y conviene hacerlo ' +
    'siempre en el mismo orden: cada paso aprovecha lo averiguado en el anterior. Esta receta es, ' +
    'literalmente, lo que se pide en el problema clásico de selectividad.');


  p.list([
    'Dominio y cortes con los ejes.',
    'Simetrías y asíntotas.',
    'Calcular $f\'$, resolver $f\'(x)=0$ y estudiar su signo → crecimiento y extremos.',
    'Calcular $f\'\'$, resolver $f\'\'(x)=0$ y estudiar su signo → curvatura e inflexiones.',
    'Dibujar juntando toda la información.'
  ], true);

  /* ---------------------------------------------------------------- */
  p.section('Optimización');

  p.text('Es la aplicación estrella: encontrar el máximo o el mínimo de algo en un problema real. ' +
    'El método siempre es el mismo, y la parte difícil <strong>nunca</strong> es derivar:');

  p.list([
    '<strong>Identificar</strong> qué se quiere maximizar o minimizar y llamarlo $f$.',
    '<strong>Escribir</strong> $f$ en función de las variables del problema.',
    'Buscar la <strong>relación</strong> entre esas variables (la condición del enunciado) y usarla para dejar $f$ con <strong>una sola variable</strong>.',
    'Derivar, igualar a cero y resolver.',
    '<strong>Comprobar</strong> que es el extremo que se busca, y traducir el resultado al enunciado.'
  ], true);

  p.note('El paso 3 es donde se falla. Si al final te queda una función con dos variables, no puedes ' +
    'derivar: te falta usar la condición del enunciado.', 'warn', 'El paso crítico');

  p.demo({
    title: 'La lata que gasta menos aluminio',
    intro: 'Con un volumen fijo, ¿qué proporción de radio y altura minimiza la superficie? Mueve el radio y busca el mínimo.',
    build: function (host, d) {
      var V = 330;   // cm3, una lata normal
      var r0 = 3;
      var out = W.readout(host, '');
      var sup = function (r) { return 2 * Math.PI * r * r + 2 * V / r; };
      var ropt = Math.pow(V / (2 * Math.PI), 1 / 3);
      var plot = W.plot(host, {
        xmin: 1, xmax: 8, ymin: 0, ymax: 800, height: 280,
        xlabel: 'radio (cm)', ylabel: 'superficie (cm²)',
        draw: function (g) {
          g.fn(sup, { from: 1.2, to: 8, color: 0, w: 2.6 });
          g.point(ropt, sup(ropt), { color: 2, r: 6, label: 'mínimo', labelDy: -14 });
          g.point(r0, sup(r0), { color: 1, r: 6 });
          g.seg(r0, 0, r0, sup(r0), { color: 1, w: 1.4, dash: true });
        }
      });
      function paint() {
        var h = V / (Math.PI * r0 * r0);
        out.set('Volumen fijo: $' + V + '$ cm³. Radio $r = ' + U.fmt(r0, 2) + '$ cm → altura $h = ' +
          U.fmt(h, 2) + '$ cm → <strong>superficie $' + U.fmt(sup(r0), 2) + '$ cm²</strong><br>' +
          '$S(r) = 2\\pi r^2 + \\dfrac{2V}{r}$, &nbsp; $S\'(r) = 4\\pi r - \\dfrac{2V}{r^2} = 0 ' +
          '\\Rightarrow r = \\sqrt[3]{\\dfrac{V}{2\\pi}} = ' + U.fmt(ropt, 3) + '$<br>' +
          (Math.abs(r0 - ropt) < 0.12
            ? '<strong style="color:var(--ok)">Es el óptimo: la altura sale igual al diámetro ($h = 2r$).</strong>'
            : 'El mínimo está en $r = ' + U.fmt(ropt, 3) + '$ cm, con $' + U.fmt(sup(ropt), 2) + '$ cm².'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'radio (cm)', min: 1.5, max: 7, step: 0.1, value: 3, dec: 2, on: function (v) { r0 = v; paint(); } });
      W.hint(host, 'Curiosidad: casi ninguna lata comercial usa esta proporción, porque además importan el coste de las tapas y el agarre.');
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Optimizar es lo que hace que las cosas cuesten menos, y está por todas partes. La forma de una ' +
    'lata de refresco que gasta menos aluminio para un volumen dado, la ruta de reparto más corta, ' +
    'el grosor mínimo de una viga que aguanta la carga, el precio que maximiza el ingreso. En todos ' +
    'los casos el método es el mismo que estás aprendiendo: escribir la magnitud a optimizar en ' +
    'función de una variable, derivar e igualar a cero. Y es también, literalmente, lo que hace una ' +
    'inteligencia artificial al entrenarse: buscar el mínimo de una función de error.');

  p.section('Practica');

  p.exercise({
    title: 'Máximos y mínimos de un polinomio',
    level: 'medio',
    gen: function (r) {
      var x1 = r.pm(1, 4), x2 = r.pm(1, 4);
      if (x1 === x2) return null;
      var lo = Math.min(x1, x2), hi = Math.max(x1, x2);
      // f'(x) = 3a(x-x1)(x-x2)  ->  tomamos a = 1/3 para que salgan enteros
      // f(x) = x^3/3 - (x1+x2)/2 x^2 + x1 x2 x  ... usamos multiplicador 6 para enteros
      // Trabajamos con f'(x) = (x-x1)(x-x2) = x^2 - (x1+x2)x + x1x2
      return { lo: lo, hi: hi, b: -(x1 + x2), c: x1 * x2 };
    },
    ask: function (d) {
      return 'La derivada de una función es $f\'(x) = ' + ML.polyTex([1, d.b, d.c]) + '$. ' +
        'Halla en qué valores de $x$ hay <strong>máximo</strong> y en cuáles <strong>mínimo</strong>.';
    },
    fields: [{ name: 'max', label: 'x del máximo', w: 'tiny' }, { name: 'min', label: 'x del mínimo', w: 'tiny' }],
    sol: function (d) { return { max: d.lo, min: d.hi }; },
    tol: 1e-6,
    hint: function (d) {
      return 'Los puntos críticos son las raíces de $f\'$. Como $f\'$ es una parábola hacia arriba, ' +
        'es positiva fuera de las raíces y negativa entre ellas: la función sube, baja y vuelve a subir.';
    },
    steps: function (d) {
      return ['Resolvemos $f\'(x) = 0$: las raíces son $x = ' + d.lo + '$ y $x = ' + d.hi + '$.',
        '$f\'$ es una parábola con $a>0$: positiva antes de $' + d.lo + '$, negativa entre las raíces y positiva después de $' + d.hi + '$.',
        'Signo de $f\'$: $+\\ -\\ +$, así que $f$ <strong>crece, decrece y vuelve a crecer</strong>.',
        'Pasar de crecer a decrecer es un <strong>máximo</strong>: en $x = ' + d.lo + '$.',
        'Pasar de decrecer a crecer es un <strong>mínimo</strong>: en $x = ' + d.hi + '$.'];
    },
    answer: function (d) { return 'Máximo en x = ' + d.lo + ', mínimo en x = ' + d.hi + '.'; }
  });

  p.exercise({
    title: 'Punto de inflexión',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-3, 3), b = r.pm(1, 9), c = r.pm(0, 8), e = r.pm(0, 8);
      // f = a x^3 + b x^2 + c x + e   ->  f'' = 6a x + 2b  ->  x = -b/(3a)
      var xi = -b / (3 * a);
      if (!Number.isInteger(xi)) return null;
      return { a: a, b: b, c: c, e: e, xi: xi };
    },
    ask: function (d) {
      return 'Halla la abscisa del punto de inflexión de $f(x) = ' + ML.polyTex([d.a, d.b, d.c, d.e]) + '$.';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }],
    sol: function (d) { return { x: d.xi }; },
    tol: 1e-6,
    hint: function () { return 'Deriva dos veces e iguala a cero la segunda derivada.'; },
    steps: function (d) {
      return ['$f\'(x) = ' + ML.polyTex([3 * d.a, 2 * d.b, d.c]) + '$',
        '$f\'\'(x) = ' + ML.polyTex([6 * d.a, 2 * d.b]) + '$',
        'Igualamos a cero: $' + (6 * d.a) + 'x + ' + (2 * d.b) + ' = 0 \\Rightarrow x = ' + d.xi + '$.',
        'Como $f\'\'$ es una recta, cambia de signo al pasar por ahí: es efectivamente un punto de inflexión.'];
    },
    answer: function (d) { return 'x = ' + d.xi; }
  });

  p.exercise({
    title: 'Optimización: dos números',
    level: 'avanzado',
    gen: function (r) {
      var S = r.int(5, 60) * 2;
      return { S: S, x: S / 2, prod: (S / 2) * (S / 2) };
    },
    ask: function (d) {
      return 'De todos los pares de números que <strong>suman</strong> $' + d.S + '$, ¿cuál es el ' +
        '<strong>mayor producto</strong> que se puede conseguir?';
    },
    fields: [{ name: 'p', label: 'Producto máximo', w: 'tiny' }],
    sol: function (d) { return { p: d.prod }; },
    tol: 1e-6,
    hint: function (d) { return 'Si uno es $x$, el otro es $' + d.S + ' - x$. El producto es $P(x) = x(' + d.S + '-x)$: derívalo.'; },
    steps: function (d) {
      return ['Llamamos $x$ a uno de los números; el otro es $' + d.S + ' - x$.',
        'Producto: $P(x) = x(' + d.S + ' - x) = -x^2 + ' + d.S + 'x$.',
        '$P\'(x) = -2x + ' + d.S + ' = 0 \\Rightarrow x = ' + d.x + '$.',
        '$P\'\'(x) = -2 < 0$, así que efectivamente es un <strong>máximo</strong>.',
        'Los dos números son $' + d.x + '$ y $' + d.x + '$, y el producto máximo es $' + d.prod + '$.',
        'Conclusión general: con suma fija, el producto es máximo cuando los dos números son iguales.'];
    },
    answer: function (d) { return d.prod + ' (con los dos números iguales a ' + d.x + ')'; }
  });

  p.exercise({
    title: 'Optimización: la caja sin tapa',
    level: 'avanzado',
    gen: function (r) {
      var L = r.pick([12, 18, 24, 30, 36, 60]);
      // caja recortando cuadrados de lado x en las esquinas de un cuadrado de lado L
      // V(x) = x(L-2x)^2 ,  V'= (L-2x)(L-6x) = 0  ->  x = L/6
      var x = L / 6;
      return { L: L, x: x, V: x * Math.pow(L - 2 * x, 2) };
    },
    ask: function (d) {
      return 'De una lámina cuadrada de $' + d.L + '$ cm de lado recortamos un cuadrado en cada esquina ' +
        'y doblamos los bordes para formar una caja sin tapa. ¿Cuánto debe medir el lado del recorte ' +
        'para que el volumen sea máximo?';
    },
    show: function (d, host) {
      W.board(host, {
        xmin: -2, xmax: d.L + 2, ymin: -2, ymax: d.L + 2, height: 230,
        grid: false, axes: false,
        draw: function (g) {
          var x = d.x;
          g.rect(0, 0, d.L, d.L, { color: 0, fill: 0, fillAlpha: .12, w: 2 });
          [[0, 0], [d.L - x, 0], [0, d.L - x], [d.L - x, d.L - x]].forEach(function (P) {
            g.rect(P[0], P[1], x, x, { color: 2, fill: 2, fillAlpha: .35, w: 1.6 });
          });
          g.text(d.L / 2, d.L / 2, 'base de la caja', { align: 'center', size: 12.5, color: 0 });
          g.text(x / 2, -0.9, 'x', { align: 'center', size: 13, color: 2, italic: true });
        }
      });
    },
    fields: [{ name: 'x', label: 'Recorte x (cm)', w: 'tiny' }, { name: 'v', label: 'Volumen (cm³)', w: 'wide' }],
    sol: function (d) { return { x: U.round(d.x, 6), v: U.round(d.V, 6) }; },
    tol: 3e-5,
    hint: function (d) { return 'La base queda de lado $' + d.L + ' - 2x$ y la altura es $x$. Deriva $V(x) = x(' + d.L + '-2x)^2$.'; },
    steps: function (d) {
      return ['Al recortar $x$ en cada esquina, la base mide $' + d.L + ' - 2x$ y la altura $x$.',
        '$V(x) = x\\left(' + d.L + ' - 2x\\right)^2$',
        'Derivando y sacando factor común: $V\'(x) = (' + d.L + '-2x)(' + d.L + '-6x)$.',
        'Se anula en $x = ' + (d.L / 2) + '$ (que daría volumen cero, no sirve) y en $x = \\dfrac{' + d.L + '}{6} = ' + U.fmt(d.x, 4) + '$.',
        'Volumen máximo: $V = ' + U.fmt(d.x, 4) + ' \\cdot ' + U.fmt(d.L - 2 * d.x, 4) + '^2 = ' + U.fmt(d.V, 4) + '$ cm³.'];
    },
    answer: function (d) { return 'x = ' + U.fmt(d.x, 4) + ' cm, con V = ' + U.fmt(d.V, 4) + ' cm³.'; }
  });

  p.keys([
    'Signo de $f\'$: crecimiento. Ceros de $f\'$: puntos críticos (hay que comprobar que cambie de signo).',
    'Signo de $f\'\'$: curvatura. Ceros de $f\'\'$ con cambio de signo: puntos de inflexión.',
    'Criterio rápido: $f\'(a)=0$ y $f\'\'(a)>0$ → mínimo; $f\'\'(a)<0$ → máximo.',
    'En optimización lo difícil es plantear, no derivar.',
    'Hay que dejar la función con <strong>una sola variable</strong> usando la condición del enunciado.',
    'Y siempre comprobar que la solución tiene sentido en el problema real.'
  ]);
});
