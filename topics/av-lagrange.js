/* Tema: Optimizar con restricciones: multiplicadores de Lagrange */
Course.topic('av-lagrange', function (p) {

  p.puente('En [[fn-aplicaciones]] se optimizaba con una condición: el rectángulo de mayor área con un perímetro dado, la ' +
    'lata de menor superficie con un volumen fijo. El método era despejar una variable en la condición y sustituir. ' +
    'Funciona cuando se puede despejar, pero muchas condiciones no se dejan: una elipse, una superficie curva, un ' +
    'presupuesto con varias variables. Joseph-Louis Lagrange encontró un método que no necesita despejar nada, y que ' +
    'descansa en una observación geométrica muy bonita sobre los [[av-vectorial|gradientes]].');

  /* ---------------------------------------------------------------- */
  p.section('Extremos condicionados');

  p.text('Se quiere el máximo de $f(x, y)$, pero no en todo el plano, sino solo entre los puntos que cumplen una ' +
    'restricción $g(x, y) = c$, que dibuja una curva. El máximo absoluto de $f$ puede estar fuera de la curva; lo que ' +
    'interesa es el mayor valor de $f$ <strong>recorriendo la curva</strong>.');

  p.text('Imagina las curvas de nivel de $f$, las líneas donde $f$ vale lo mismo, como las de un mapa topográfico. ' +
    'Recorriendo la restricción, se van cruzando curvas de nivel cada vez más altas. Mientras la restricción ' +
    '<em>corta</em> una curva de nivel, se puede seguir subiendo. El máximo llega cuando ya no la corta, sino que la ' +
    '<strong>toca</strong>: cuando las dos curvas son tangentes.');

  p.comprueba('Se busca el máximo de $f$ sobre una curva. En un punto de la curva, la curva de nivel de $f$ la <em>corta</em>. ¿Puede ser ese punto el máximo?', [
    { t: 'No: si corta, a un lado de la curva $f$ vale más', ok: false, por: 'La conclusión es correcta, pero el motivo es otro: no es «a un lado de la curva», es «un poco más adelante <em>sobre</em> la curva». Al cruzar el nivel, se pasa a niveles más altos por un lado y más bajos por el otro.' },
    { t: 'No: avanzando por la curva se cruza a niveles más altos', ok: true, por: 'Si el nivel corta la restricción, seguir por la restricción en un sentido lleva a valores mayores de $f$. En el máximo, el nivel solo puede <em>tocar</em>: tangente, y gradientes paralelos.' },
    { t: 'Sí, si el corte es perpendicular', ok: false, por: 'Perpendicular es el peor caso: es cuando $f$ cambia más deprisa a lo largo de la curva. El máximo exige tangencia, el otro extremo.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('El método de los multiplicadores');

  p.text('El gradiente de una función es siempre perpendicular a sus curvas de nivel. Si en el óptimo la curva de nivel de ' +
    '$f$ y la curva $g = c$ son tangentes, sus perpendiculares tienen la misma dirección: <strong>los dos gradientes son ' +
    'paralelos</strong>.');

  p.formulas([
    '\\nabla f(x, y) = \\lambda\\,\\nabla g(x, y), \\qquad g(x, y) = c',
    '\\begin{cases} f_x = \\lambda\\,g_x \\\\ f_y = \\lambda\\,g_y \\\\ g(x, y) = c \\end{cases}'
  ], 'las condiciones de Lagrange',
    '$\\nabla f = (f_x, f_y)$ es el gradiente: el vector de las derivadas parciales.<br><br>$\\lambda$, la letra griega lambda, es ' +
    'el <strong>multiplicador de Lagrange</strong>: el número que hace iguales los dos vectores paralelos.<br><br>Son tres ecuaciones ' +
    'con tres incógnitas, $x$, $y$ y $\\lambda$. Sus soluciones son los candidatos a máximo o mínimo; se evalúa $f$ en todos y se ' +
    'comparan. Con más variables y más restricciones funciona igual, con un multiplicador por restricción.');

  p.ejemplo({
    title: 'El máximo de xy sobre una elipse',
    enunciado: 'Hallar el máximo y el mínimo de $f(x, y) = xy$ sobre la elipse $\\dfrac{x^2}{9} + \\dfrac{y^2}{4} = 1$.',
    pasos: [
      { t: '<strong>Gradientes.</strong> $\\nabla f = (y, x)$ y, con $g = \\frac{x^2}{9} + \\frac{y^2}{4}$, $\\nabla g = \\left(\\frac{2x}{9}, \\frac{y}{2}\\right)$.', antes: 'Deriva $f$ y $g$ parcialmente. ¿Qué vectores salen?' },
      { t: '<strong>Condiciones.</strong> $y = \\lambda\\frac{2x}{9}$, $x = \\lambda\\frac{y}{2}$ y la elipse. Sustituyendo la primera en la segunda: $x = \\lambda\\cdot\\frac{\\lambda x}{9}$, así que $\\lambda^2 = 9$ si $x \\ne 0$. (Con $x = 0$ saldría $y = 0$, que no está en la elipse.)', antes: 'Elimina $y$ entre las dos primeras ecuaciones. ¿Qué queda para $\\lambda$?' },
      { t: '<strong>$\\lambda = 3$.</strong> $y = \\frac{2x}{3}$. En la elipse: $\\frac{x^2}{9} + \\frac{4x^2/9}{4} = \\frac{2x^2}{9} = 1$, luego $x = \\pm\\frac{3}{\\sqrt 2}$, $y = \\pm\\sqrt 2$ (mismo signo). En los dos puntos $f = \\frac{3}{\\sqrt 2}\\cdot\\sqrt 2 = 3$.' },
      { t: '<strong>$\\lambda = -3$.</strong> $y = -\\frac{2x}{3}$: los otros dos puntos, $\\left(\\pm\\frac{3}{\\sqrt 2}, \\mp\\sqrt 2\\right)$, con $f = -3$.', antes: 'Repite con $\\lambda = -3$. ¿Qué valor toma $f$?' },
      { t: '<strong>Conclusión.</strong> Cuatro candidatos: máximo $3$ en $\\left(\\frac{3}{\\sqrt 2}, \\sqrt 2\\right) \\approx (2{,}12,\\ 1{,}41)$ y su opuesto; mínimo $-3$ en los otros dos. En la demo de abajo, el máximo está a $45^\\circ$.' }
    ],
    cierre: 'Sin Lagrange habría que despejar $y = \\pm 2\\sqrt{1 - x^2/9}$ y derivar una raíz. Con Lagrange, tres ecuaciones polinómicas y ninguna raíz. Y $\\lambda = 3$ dice además cuánto subiría el máximo si la elipse se agrandara: $\\frac{df_{\\text{máx}}}{dc} = 3$.'
  });

  p.demo({
    title: 'Cuando los gradientes son paralelos',
    intro: 'Se busca el máximo de f(x, y) = x·y sobre la elipse x²/9 + y²/4 = 1. Las curvas finas son curvas de nivel de f: hipérbolas. Recorre la elipse con el deslizador. La flecha azul es la dirección del gradiente de f y la naranja, la del gradiente de g. En el máximo son paralelas, y la hipérbola toca la elipse sin cortarla.',
    predice: 'Según el ejemplo, el máximo está a $45^\\circ$. ¿En qué otros ángulos crees que los gradientes también serán paralelos? ¿Cuántos candidatos hay en total?',
    build: function (host) {
      var t = 20;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -4.2, xmax: 4.2, ymin: -3.2, ymax: 3.2, height: 330,
        aria: 'Una elipse, curvas de nivel hiperbólicas de la función x por y y los gradientes de las dos funciones en un punto de la elipse',
        draw: function (g) {
          [0.5, 1.5, 3, 4.5].forEach(function (k) {
            g.fn(function (x) { return k / x; }, { color: 'axis', w: 1, samples: 400 });
            g.fn(function (x) { return -k / x; }, { color: 'axis', w: 1, samples: 400 });
          });
          g.param(function (s) { return 3 * Math.cos(s); }, function (s) { return 2 * Math.sin(s); }, 0, 2 * Math.PI, { color: 2, w: 2.6 });
          var a = t * Math.PI / 180, x = 3 * Math.cos(a), y = 2 * Math.sin(a);
          var fx = y, fy = x, gx = 2 * x / 9, gy = y / 2;
          var nf = Math.hypot(fx, fy) || 1, ng = Math.hypot(gx, gy) || 1;
          var nivel = x * y;
          if (Math.abs(nivel) > 1e-6) g.fn(function (xx) { return nivel / xx; }, { color: 1, w: 1.8, samples: 400 });
          g.vec(x, y, x + 1.2 * fx / nf, y + 1.2 * fy / nf, { color: 0, w: 3, label: '∇f' });
          g.vec(x, y, x + 1.2 * gx / ng, y + 1.2 * gy / ng, { color: 1, w: 3, label: '∇g' });
          g.point(x, y, { color: 'ink', r: 5 });
        }
      });
      function pinta() {
        var a = t * Math.PI / 180, x = 3 * Math.cos(a), y = 2 * Math.sin(a);
        var fx = y, fy = x, gx = 2 * x / 9, gy = y / 2, cruz = fx * gy - fy * gx;
        var sinang = cruz / ((Math.hypot(fx, fy) || 1) * (Math.hypot(gx, gy) || 1));
        out.set('Punto $(' + U.fmt(x, 3) + ',\\ ' + U.fmt(y, 3) + ')$ &nbsp;·&nbsp; $f = xy = ' + U.fmt(x * y, 3) + '$ &nbsp;·&nbsp; $f_x g_y - f_y g_x = ' + U.fmt(cruz, 3) + '$' +
          (Math.abs(sinang) < 0.01 ? ' &nbsp;·&nbsp; <strong style="color:var(--ok)">gradientes paralelos: candidato a extremo, con $\\lambda = ' + U.fmt(Math.abs(gx) > 1e-9 ? fx / gx : fy / gy, 3) + '$</strong>' : ''));
        plot.render();
      }
      W.slider(W.row(host), { label: 'posición sobre la elipse (°)', min: 0, max: 360, step: 1, value: t, on: function (v) { t = v; pinta(); } });
      W.hint(host, 'Prueba 45°: ahí f vale 3, el máximo. En 135° los gradientes también son paralelos, pero apuntan en sentidos opuestos: es un mínimo, f = −3.');
      pinta();
    }
  });

  p.note('El multiplicador tiene significado propio: $\\lambda$ es cuánto aumentaría el valor óptimo de $f$ si la ' +
    'restricción se relajara una unidad, $\\lambda = \\frac{d f_{\\text{óptimo}}}{dc}$. En economía, si $c$ es un presupuesto, ' +
    '$\\lambda$ dice cuánto beneficio extra traería un euro más: se llama <strong>precio sombra</strong>.', 'ok', 'Qué significa lambda');

  /* ---------------------------------------------------------------- */
  p.section('Aplicaciones en economía y geometría');

  p.list([
    '<strong>Consumo con presupuesto.</strong> Una persona reparte su dinero $M$ entre dos bienes de precios $p$ y $q$, y su satisfacción es $U(x, y) = x^{\\alpha}y^{1 - \\alpha}$. Lagrange da $x = \\frac{\\alpha M}{p}$ e $y = \\frac{(1 - \\alpha)M}{q}$: gasta en cada bien una fracción fija del presupuesto.',
    '<strong>Distancias.</strong> El punto de una recta o de un plano más cercano a un punto exterior sale de minimizar la distancia al cuadrado con la ecuación como restricción: es la [[ge-metrico|proyección ortogonal]] de siempre.',
    '<strong>Física.</strong> Una partícula obligada a moverse por una superficie se trata con un multiplicador, que resulta ser la fuerza con la que la superficie la sujeta.',
    '<strong>Inversión.</strong> Repartir el dinero entre activos para obtener un rendimiento dado con el menor riesgo posible es un problema de Lagrange: el de Harry Markowitz, en 1952.'
  ]);

  p.hist('Lagrange presentó el método de forma general en su <em>Mecánica analítica</em> de 1788, un libro que se jactaba ' +
    'de no contener ni una sola figura: toda la mecánica, reducida a análisis. Los multiplicadores le servían para ' +
    'tratar sistemas con ligaduras, como un péndulo cuya cuerda no se estira. Irónicamente, la mejor manera de ' +
    'entender por qué funcionan es un dibujo.');

  p.util('Las máquinas de vectores soporte, uno de los métodos clásicos del aprendizaje automático, se entrenan ' +
    'resolviendo un problema de optimización con restricciones mediante multiplicadores. Las redes eléctricas reparten ' +
    'la producción entre centrales minimizando el coste con la restricción de cubrir la demanda, y el multiplicador de ' +
    'esa restricción es, literalmente, el precio de la electricidad en el mercado mayorista.');

  p.trampas([
    { e: 'Igualar el gradiente de $f$ a cero', por: 'Eso busca el máximo libre, que suele estar fuera de la curva. Con restricción, el gradiente de $f$ no se anula: se alinea con el de $g$.' },
    { e: 'Quedarse con la primera solución', por: 'Las condiciones dan todos los candidatos, máximos y mínimos juntos. Hay que evaluar $f$ en cada uno y comparar.' },
    { e: 'Dividir por $x$ o por $y$ sin mirar si valen cero', por: 'Al eliminar $\\lambda$ se pierde el caso $x = 0$. Hay que comprobarlo aparte: a veces es un candidato.' },
    { e: 'Olvidar la ecuación de la restricción', por: '$\\nabla f = \\lambda\\nabla g$ son dos ecuaciones con tres incógnitas. La tercera es $g = c$: sin ella, no hay punto.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El rectángulo de perímetro fijo',
    level: 'basico',
    gen: function (r) { var P = r.pick([20, 36, 40, 100, 60]); return { P: P, lado: P / 4, area: P * P / 16 }; },
    ask: function (d) { return 'Con las condiciones de Lagrange, maximiza el área $f(x, y) = xy$ de un rectángulo con perímetro $2x + 2y = ' + d.P + '$. ¿Cuánto miden los lados y cuál es el área máxima?'; },
    fields: [{ name: 'x', label: 'lado $x$', w: 'tiny' }, { name: 'y', label: 'lado $y$', w: 'tiny' }, { name: 'a', label: 'área', w: 'tiny' }],
    sol: function (d) { return { x: d.lado, y: d.lado, a: d.area }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.x - d.P / 2) < 1e-6 || Math.abs(v.y - d.P / 2) < 1e-6; }, msg: 'Con un lado igual a la mitad del perímetro, el otro mide 0 y el área también: eso es el mínimo, no el máximo.' }],
    hint: function () { return ['$\\nabla f = (y, x)$ y $\\nabla g = (2, 2)$.', '$y = 2\\lambda$ y $x = 2\\lambda$: los dos lados son iguales.']; },
    steps: function (d) { return ['$y = 2\\lambda$, $x = 2\\lambda$, así que $x = y$.', 'Con $2x + 2y = ' + d.P + '$: $x = y = ' + U.fmt(d.lado, 2) + '$.', 'Área máxima: $' + U.fmt(d.lado, 2) + '^2 = ' + U.fmt(d.area, 2) + '$. El rectángulo óptimo es un cuadrado.']; },
    answer: function (d) { return 'lados ' + U.fmt(d.lado, 2) + ', área ' + U.fmt(d.area, 2); }
  });

  p.exercise({
    title: 'Máximo sobre una circunferencia',
    level: 'medio',
    gen: function (r) {
      var ab = r.pick([[3, 4], [1, 2], [2, 1], [4, 3], [1, 1]]), R = r.pick([1, 2, 5]), n = Math.hypot(ab[0], ab[1]);
      return { a: ab[0], b: ab[1], R: R, n: n, x: R * ab[0] / n, y: R * ab[1] / n, f: R * n, lam: n / (2 * R) };
    },
    ask: function (d) { return 'Halla el máximo de $f(x, y) = ' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, 'y', 1, false) + '$ sobre la circunferencia $x^2 + y^2 = ' + (d.R * d.R) + '$: el punto donde se alcanza y el valor máximo. (Tres decimales.)'; },
    fields: [{ name: 'x', label: '$x$', w: 'tiny' }, { name: 'y', label: '$y$', w: 'tiny' }, { name: 'f', label: 'máximo', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.x, 6), y: U.round(d.y, 6), f: U.round(d.f, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(v.f + d.f) < 5e-4; }, msg: 'Ese es el mínimo, en el punto diametralmente opuesto. Las condiciones de Lagrange dan los dos candidatos: hay que comparar.' }],
    hint: function (d) { return ['$(' + d.a + ', ' + d.b + ') = \\lambda\\,(2x, 2y)$: el punto es proporcional a $(' + d.a + ', ' + d.b + ')$.', 'Escribe $(x, y) = t\\,(' + d.a + ', ' + d.b + ')$ y sustituye en la circunferencia.']; },
    steps: function (d) {
      return ['De $\\nabla f = \\lambda\\nabla g$: $x = \\frac{' + d.a + '}{2\\lambda}$, $y = \\frac{' + d.b + '}{2\\lambda}$.',
        'En la circunferencia: $\\frac{' + (d.a * d.a + d.b * d.b) + '}{4\\lambda^2} = ' + (d.R * d.R) + '$, así que $\\lambda = \\pm' + U.fmt(d.lam, 3) + '$.',
        'Con $\\lambda > 0$: $(x, y) \\approx (' + U.fmt(d.x, 3) + ',\\ ' + U.fmt(d.y, 3) + ')$ y $f \\approx ' + U.fmt(d.f, 3) + '$. Con $\\lambda < 0$, el mínimo $-' + U.fmt(d.f, 3) + '$.'];
    },
    answer: function (d) { return '(' + U.fmt(d.x, 3) + ', ' + U.fmt(d.y, 3) + '), máximo ' + U.fmt(d.f, 3); }
  });

  p.exercise({
    title: 'Repartir un presupuesto',
    level: 'medio',
    gen: function (r) {
      var alfa = r.pick([ML.F(1, 2), ML.F(1, 3), ML.F(2, 3), ML.F(1, 4)]), pp = r.pick([1, 2, 4, 5]), q = r.pick([1, 2, 3, 5]), M = r.pick([60, 120, 300]);
      var a = alfa.val();
      return { alfa: alfa, p: pp, q: q, M: M, x: a * M / pp, y: (1 - a) * M / q };
    },
    ask: function (d) {
      return 'Una persona tiene ' + d.M + ' € para dos bienes de precios $p = ' + d.p + '$ € y $q = ' + d.q + '$ €, y su satisfacción es $U(x, y) = x^{' + d.alfa.tex() + '}\\,y^{' + ML.F(1).sub(d.alfa).tex() +
        '}$. ¿Qué cantidades $x$ e $y$ maximizan su satisfacción?';
    },
    fields: [{ name: 'x', label: '$x$', w: 'tiny' }, { name: 'y', label: '$y$', w: 'tiny' }],
    sol: function (d) { return { x: d.x, y: d.y }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return !d.alfa.eq(ML.F(1, 2)) && Math.abs(v.x - d.M / (2 * d.p)) < 1e-6 && Math.abs(v.y - d.M / (2 * d.q)) < 1e-6; }, msg: 'Gastar la mitad en cada bien solo es óptimo si los dos exponentes son iguales. La fracción del presupuesto para cada bien es su exponente.' }],
    hint: function () { return ['Toma logaritmos: maximizar $U$ es maximizar $\\alpha\\ln x + (1 - \\alpha)\\ln y$, que da ecuaciones más cómodas.', 'Resulta $p\\,x = \\alpha M$ y $q\\,y = (1 - \\alpha)M$.']; },
    steps: function (d) {
      return ['Con $\\ln U$: $\\frac{\\alpha}{x} = \\lambda p$ y $\\frac{1 - \\alpha}{y} = \\lambda q$, así que $px = \\frac{\\alpha}{\\lambda}$ y $qy = \\frac{1 - \\alpha}{\\lambda}$.',
        'Sumando y usando $px + qy = ' + d.M + '$: $\\frac{1}{\\lambda} = ' + d.M + '$.',
        '$x = \\dfrac{' + d.alfa.tex() + '\\cdot ' + d.M + '}{' + d.p + '} = ' + U.fmt(d.x, 2) + '$, $y = \\dfrac{' + ML.F(1).sub(d.alfa).tex() + '\\cdot ' + d.M + '}{' + d.q + '} = ' + U.fmt(d.y, 2) + '$'];
    },
    answer: function (d) { return 'x = ' + U.fmt(d.x, 2) + ', y = ' + U.fmt(d.y, 2); }
  });

  p.exercise({
    title: '¿Son paralelos los gradientes?',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pm(1, 3), b = r.pm(1, 3), c = r.pm(1, 5), s = a * a + b * b;
      var pie = [ML.F(c * a, s), ML.F(c * b, s)], t = r.bool(0.5) ? 0 : r.pm(1, 2);
      var P = [pie[0].add(-b * t), pie[1].add(a * t)];
      var det = P[0].mul(2 * b).sub(P[1].mul(2 * a));
      return { a: a, b: b, c: c, P: P, det: det, ok: det.n === 0 ? 'si' : 'no' };
    },
    ask: function (d) {
      return 'Se busca el punto de la recta $' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, 'y', 1, false) + ' = ' + d.c + '$ más cercano al origen, minimizando $f(x, y) = x^2 + y^2$. En el punto $(' + d.P[0].tex() + ',\\ ' + d.P[1].tex() +
        ')$ de la recta, calcula $f_x\\,g_y - f_y\\,g_x$. ¿Cumple ese punto la condición de Lagrange?';
    },
    fields: [{ name: 'd', label: '$f_x g_y - f_y g_x$', w: 'tiny' }, { name: 't', label: '¿Gradientes paralelos?', opts: [{ t: 'Sí: es el punto buscado', v: 'si' }, { t: 'No', v: 'no' }] }],
    sol: function (d) { return { d: d.det.val(), t: d.ok }; },
    tol: 1e-9,
    hint: function (d) { return ['$\\nabla f = (2x, 2y)$ y $\\nabla g = (' + d.a + ', ' + d.b + ')$.', 'Dos vectores del plano son paralelos si el determinante que forman vale 0.']; },
    steps: function (d) {
      return ['$f_x g_y - f_y g_x = 2x\\cdot(' + d.b + ') - 2y\\cdot(' + d.a + ') = ' + d.det.tex() + '$',
        d.ok === 'si' ? 'Vale 0: los gradientes son paralelos y el punto es el más cercano al origen, el pie de la perpendicular.' : 'No vale 0: en ese punto la recta todavía corta las circunferencias de nivel de $f$, y moviéndose por ella se puede acercar más al origen.'];
    },
    answer: function (d) { return d.det.toString() + '; ' + (d.ok === 'si' ? 'sí' : 'no'); }
  });

  p.keys([
    'Para optimizar $f$ con la restricción $g = c$, el óptimo está donde una curva de nivel de $f$ es tangente a la restricción.',
    'Eso equivale a gradientes paralelos: $\\nabla f = \\lambda\\,\\nabla g$, junto con $g = c$.',
    'Las soluciones son candidatos: se evalúa $f$ en todos para distinguir máximos y mínimos.',
    'El multiplicador $\\lambda$ mide cuánto cambia el óptimo al relajar la restricción: es un precio sombra.'
  ]);
});
