/* Tema: Componentes principales */
Course.topic('av-pca', function (p) {

  p.puente('Dos cosas que ya tienes se juntan aquí. De [[pe-bidimensional|regresión y correlación]] viene ' +
    'la <strong>covarianza</strong>, que mide si dos variables se mueven juntas. De [[av-lineal|autovalores]] ' +
    'viene la idea de que una matriz tiene direcciones propias, las que no tuerce. El análisis de ' +
    'componentes principales es lo que sale de aplicar la segunda idea a la primera.');

  p.text('Una nube de puntos casi nunca es redonda: se estira más en unas direcciones que en otras. La ' +
    'pregunta de este tema es <strong>cuál es la dirección en la que más se estira</strong>, y qué se ' +
    'pierde si nos quedamos solo con ella. La respuesta es limpia y un poco sorprendente: esa dirección ' +
    'es un autovector de la matriz de covarianza, y lo que mide su estiramiento es el autovalor.');

  /* ---------------------------------------------------------------- */
  p.section('La matriz que guarda la forma de la nube');

  p.text('Con dos variables hay tres números que describen la forma de la nube: cuánto varía la primera, ' +
    'cuánto la segunda, y cuánto van juntas. Se colocan en una tabla de dos por dos, la ' +
    '<strong>matriz de covarianza</strong>, que es simétrica porque la covarianza de $x$ con $y$ es la ' +
    'misma que la de $y$ con $x$.');

  p.formula('S = \\begin{pmatrix} s_{xx} & s_{xy} \\\\ s_{xy} & s_{yy} \\end{pmatrix}, \\qquad ' +
    's_{xy} = \\frac{1}{n}\\sum_{i=1}^{n} (x_i - \\overline{x})(y_i - \\overline{y})',
    'la matriz de covarianza',
    'Se lee: <em>«ese es la matriz con ese sub equis equis, ese sub equis i griega, ese sub equis i ' +
    'griega y ese sub i griega i griega»</em>.<br><br>En la diagonal van las <strong>varianzas</strong> ' +
    'de cada variable, que ya conoces: $s_{xx}$ es la varianza de $x$. Fuera de la diagonal va la ' +
    '<strong>covarianza</strong>: positiva si cuando una sube la otra también, negativa si una sube ' +
    'cuando la otra baja, y cero si no se enteran una de otra.<br><br>Antes de calcularla hay que ' +
    '<strong>centrar</strong> los datos, es decir, restar la media a cada variable. Si no se centra, lo ' +
    'que se mide no es la forma de la nube sino dónde está.');

  p.note('Centrar no es opcional y es el error más repetido del tema. Una nube pequeña y muy lejos del ' +
    'origen parecería, sin centrar, enorme y perfectamente alineada con la dirección que va del origen ' +
    'a ella. Lo primero que hace el método es mover la nube a su propio centro.', 'warn', 'Centrar primero');

  /* ---------------------------------------------------------------- */
  p.section('La dirección que más estira');

  p.text('Elige una dirección cualquiera, dada por un vector unitario $\\vec u$, y proyecta todos los ' +
    'puntos sobre ella: cada punto se convierte en un solo número. Esos números tienen su varianza, y ' +
    'esa varianza depende de la dirección que hayas elegido. La pregunta de PCA es qué $\\vec u$ la ' +
    'hace máxima.');

  p.formula('\\operatorname{Var}(\\vec u) = \\vec u^{T} S\\, \\vec u',
    'la varianza en una dirección',
    'Se lee: <em>«la varianza en la dirección u es u traspuesta por ese por u»</em>.<br><br>Es un número, ' +
    'no un vector: un vector fila por una matriz por un vector columna. Con ' +
    '$\\vec u = (\\cos\\theta, \\operatorname{sen}\\theta)$ queda ' +
    '$s_{xx}\\cos^2\\theta + 2s_{xy}\\cos\\theta\\operatorname{sen}\\theta + s_{yy}\\operatorname{sen}^2\\theta$, ' +
    'que es lo que dibuja la demo de abajo al girar el mando.');

  p.demo({
    title: 'Girar una dirección y medir cuánto estira',
    intro: 'La nube está centrada. Gira la dirección y mira dos cosas a la vez: las proyecciones de los puntos sobre esa recta, abajo, y la varianza que sale, en la curva de la derecha. Enciende la casilla para ver dónde está el máximo.',
    predice: 'La nube se estira claramente hacia una esquina. ¿Dónde crees que la varianza de las proyecciones será mayor: en el ángulo que sigue el estiramiento, o en el perpendicular a él?',
    build: function (host) {
      var ang = 0, verEjes = false;
      var r = U.rng(31), pts = [], i;
      /* Nube alargada, generada por fórmula con semilla fija: lo que
         describe el texto es lo que el alumno ve. */
      for (i = 0; i < 70; i++) {
        var t = r.real(-2.4, 2.4, 4), s = r.real(-0.75, 0.75, 4);
        pts.push([t * 0.94 - s * 0.34, t * 0.34 + s * 0.94]);
      }
      var S = cov(pts), ei = autos(S);
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3.4, xmax: 3.4, ymin: -3.4, ymax: 3.4, height: 330, equal: true,
        aria: 'Una nube de puntos alargada, con una recta que gira y las proyecciones de los puntos sobre ella',
        draw: function (g) {
          var c = Math.cos(ang), s2 = Math.sin(ang);
          g.seg(-4 * c, -4 * s2, 4 * c, 4 * s2, { color: 1, w: 2.2 });
          pts.forEach(function (q) {
            var k = q[0] * c + q[1] * s2;
            g.seg(q[0], q[1], k * c, k * s2, { color: 'axis', w: 0.8, alpha: 0.45 });
            g.point(q[0], q[1], { color: 0, r: 2.6 });
            g.point(k * c, k * s2, { color: 1, r: 2.2 });
          });
          if (verEjes) {
            g.seg(-3.2 * ei.v1[0], -3.2 * ei.v1[1], 3.2 * ei.v1[0], 3.2 * ei.v1[1], { color: 2, w: 2.4, dash: [6, 4] });
            g.seg(-2 * ei.v2[0], -2 * ei.v2[1], 2 * ei.v2[0], 2 * ei.v2[1], { color: 3, w: 2, dash: [6, 4] });
            g.text(3.2 * ei.v1[0], 3.2 * ei.v1[1] + 0.25, 'primera componente', { color: 2, size: 11.5, align: 'center', box: true });
          }
        }
      });
      function pinta() {
        var c = Math.cos(ang), s2 = Math.sin(ang);
        var v = S.xx * c * c + 2 * S.xy * c * s2 + S.yy * s2 * s2;
        var gr = ang * 180 / Math.PI, mejor = Math.atan2(ei.v1[1], ei.v1[0]) * 180 / Math.PI;
        if (mejor < 0) mejor += 180;
        out.set('Ángulo $\\theta = ' + U.fmt(gr, 0) + '^\\circ$ &nbsp;·&nbsp; varianza de las proyecciones: ' +
          '<strong>' + U.fmt(v, 3) + '</strong><br>' +
          'Máxima posible: ' + U.fmt(ei.l1, 3) + ' (en $\\theta = ' + U.fmt(mejor, 0) + '^\\circ$) &nbsp;·&nbsp; ' +
          'mínima: ' + U.fmt(ei.l2, 3) + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">La suma de las dos, ' +
          U.fmt(ei.l1 + ei.l2, 3) + ', no depende del ángulo: es toda la variabilidad de la nube, ' +
          'repartida entre dos direcciones perpendiculares.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'ángulo θ', min: 0, max: 180, step: 1, value: 0, dec: 0,
        on: function (v) { ang = v * Math.PI / 180; pinta(); }
      });
      W.chips(host, [{ label: 'esconder las componentes', value: 0 }, { label: 'enseñar las componentes', value: 1 }],
        { value: 0, on: function (v) { verEjes = !!v; pinta(); } });
      pinta();
    }
  });

  p.text('Al girar el mando se ve que la varianza no cambia de cualquier manera: tiene un máximo, un ' +
    'mínimo, y los dos están <strong>a noventa grados</strong> uno del otro. Eso no es casualidad, y ' +
    'es justo lo que dice el álgebra: $S$ es simétrica, y una matriz simétrica tiene autovectores ' +
    'perpendiculares entre sí.');

  p.formula('S\\,\\vec v = \\lambda\\,\\vec v \\quad \\Longrightarrow \\quad \\operatorname{Var}(\\vec v) = \\vec v^{T} S \\vec v = \\lambda',
    'el autovalor ES la varianza en esa dirección',
    'Se lee: <em>«si ese por uve es lambda por uve, entonces la varianza en la dirección uve vale ' +
    'lambda»</em>.<br><br>La cuenta es de una línea: si $S\\vec v = \\lambda \\vec v$, entonces ' +
    '$\\vec v^{T}S\\vec v = \\vec v^{T}(\\lambda \\vec v) = \\lambda\\,\\vec v^{T}\\vec v = \\lambda$, ' +
    'porque $\\vec v$ es unitario y $\\vec v^{T}\\vec v = 1$.<br><br>Y eso responde la pregunta del ' +
    'tema: la dirección que más estira es el autovector del <strong>mayor</strong> autovalor. Se le ' +
    'llama <strong>primera componente principal</strong>.');

  p.comprueba('La matriz de covarianza de una nube tiene autovalores $\\lambda_1 = 9$ y $\\lambda_2 = 1$. ¿Qué se puede afirmar?', [
    { t: 'La nube se estira nueve veces más varianza en una dirección que en la perpendicular, y la variabilidad total es 10', ok: true, por: 'Cada autovalor es la varianza en la dirección de su autovector. Su suma, 10, es la variabilidad total, y coincide con la traza de $S$.' },
    { t: 'La nube es nueve veces más larga que ancha', ok: false, por: 'Cuidado: los autovalores son <em>varianzas</em>, no longitudes. La proporción de longitudes es la de las desviaciones típicas, $\\sqrt{9}:\\sqrt{1} = 3:1$. Tres veces más larga, no nueve.' },
    { t: 'Las dos direcciones principales forman un ángulo de 9 a 1', ok: false, por: 'Las direcciones principales de una matriz simétrica son siempre perpendiculares, sean cuales sean los autovalores. Lo que cambia con ellos es cuánto estira cada una.' }
  ]);

  p.ejemplo({
    title: 'Componentes principales de cuatro puntos, a mano',
    enunciado: 'Hallar las componentes principales de los puntos $(1,1)$, $(3,3)$, $(5,4)$ y $(3,0)$.',
    pasos: [
      { t: '<strong>Centrar.</strong> Las medias son $\\overline{x} = \\frac{1+3+5+3}{4} = 3$ y $\\overline{y} = \\frac{1+3+4+0}{4} = 2$. Centrados: $(-2,-1)$, $(0,1)$, $(2,2)$, $(0,-2)$.', antes: 'Calcula las dos medias y réstalas a cada punto.' },
      { t: '<strong>La matriz de covarianza.</strong> $s_{xx} = \\frac{4+0+4+0}{4} = 2$, $s_{yy} = \\frac{1+1+4+4}{4} = 2{,}5$, $s_{xy} = \\frac{(-2)(-1)+0+4+0}{4} = \\frac{6}{4} = 1{,}5$. Queda $S = \\begin{pmatrix} 2 & 1{,}5 \\\\ 1{,}5 & 2{,}5\\end{pmatrix}$.', antes: 'Media de los cuadrados para la diagonal, media de los productos para la covarianza.' },
      { t: '<strong>Los autovalores.</strong> La traza es $2 + 2{,}5 = 4{,}5$ y el determinante $2\\cdot 2{,}5 - 1{,}5^2 = 5 - 2{,}25 = 2{,}75$. De $\\lambda^2 - 4{,}5\\lambda + 2{,}75 = 0$ sale $\\lambda = \\frac{4{,}5 \\pm \\sqrt{20{,}25 - 11}}{2} = \\frac{4{,}5 \\pm 3{,}041}{2}$: $\\lambda_1 = 3{,}77$ y $\\lambda_2 = 0{,}73$.', antes: 'Ecuación característica: $\\lambda^2 - (\\text{traza})\\lambda + \\det = 0$.' },
      { t: '<strong>La primera dirección.</strong> Para $\\lambda_1 = 3{,}77$ resolvemos $(S - \\lambda_1 I)\\vec v = 0$: de la primera fila, $(2 - 3{,}77)v_1 + 1{,}5\\,v_2 = 0$, o sea $v_2 = 1{,}18\\,v_1$. Un vector director es $(1,\\ 1{,}18)$, y normalizado $\\vec v_1 \\approx (0{,}646,\\ 0{,}763)$.', antes: 'Sustituye $\\lambda_1$ y resuelve el sistema. Basta una fila: la otra es proporcional.' },
      { t: '<strong>Lo que explica.</strong> $\\frac{3{,}77}{3{,}77 + 0{,}73} = 0{,}838$: la primera componente recoge el 83,8 % de la variabilidad. Quedándose solo con ella se pierde el 16,2 %.' }
    ],
    cierre: 'Fíjate en que la suma de los autovalores, $4{,}5$, es la traza de $S$, que es también $s_{xx} + s_{yy}$. Cambiar de ejes reparte la variabilidad de otra manera, pero no crea ni destruye nada.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Comprimir: quedarse con lo que importa');

  p.text('Hasta aquí solo hemos cambiado de ejes: dos componentes describen la nube igual de bien que ' +
    '$x$ e $y$. Lo interesante viene al <strong>tirar</strong> la segunda. Cada punto pasa a ser un ' +
    'solo número —su coordenada sobre la primera componente— y al reconstruirlo cae sobre esa recta. ' +
    'Se pierde información, y se sabe exactamente cuánta.');

  p.formula('\\text{proporción explicada} = \\frac{\\lambda_1}{\\lambda_1 + \\lambda_2}, \\qquad ' +
    '\\text{error cuadrático medio} = \\lambda_2',
    'lo que se guarda y lo que se pierde',
    'Se lee: <em>«la proporción explicada es lambda uno partido por lambda uno más lambda dos»</em>.<br><br>' +
    'Y la segunda parte es la que convierte esto en una herramienta: lo que se pierde al tirar una ' +
    'componente es <strong>exactamente su autovalor</strong>. No hay que estimarlo ni medirlo después: ' +
    'ya estaba en la cuenta. Con más dimensiones es igual, sumando los autovalores que se descartan.');

  p.demo({
    title: 'Tirar la segunda componente',
    intro: 'Los puntos huecos son los originales; los llenos, lo que queda al describir cada punto con un solo número sobre la primera componente. Cambia la forma de la nube y mira cómo la pérdida sube cuando la nube se vuelve redonda.',
    predice: 'Si la nube fuera un círculo perfecto, las dos componentes tendrían el mismo autovalor. ¿Qué proporción explicaría entonces la primera, y tendría sentido comprimir?',
    build: function (host) {
      var ancho = 0.25;
      var r = U.rng(17), base = [], i;
      for (i = 0; i < 60; i++) base.push([r.real(-2.4, 2.4, 4), r.real(-1, 1, 4)]);
      var out = W.readout(host, '');
      function nube() {
        return base.map(function (q) {
          var t = q[0], s = q[1] * ancho * 4;
          return [t * 0.94 - s * 0.34, t * 0.34 + s * 0.94];
        });
      }
      var plot = W.plot(host, {
        xmin: -3.4, xmax: 3.4, ymin: -3.4, ymax: 3.4, height: 320, equal: true,
        aria: 'Una nube de puntos y su reconstrucción usando solo la primera componente principal',
        draw: function (g) {
          var pts = nube(), S = cov(pts), ei = autos(S);
          g.seg(-3.4 * ei.v1[0], -3.4 * ei.v1[1], 3.4 * ei.v1[0], 3.4 * ei.v1[1], { color: 2, w: 2.2 });
          pts.forEach(function (q) {
            var k = q[0] * ei.v1[0] + q[1] * ei.v1[1];
            var rx = k * ei.v1[0], ry = k * ei.v1[1];
            g.seg(q[0], q[1], rx, ry, { color: 'bad', w: 1, alpha: 0.5 });
            g.point(q[0], q[1], { color: 0, r: 3, hollow: true });
            g.point(rx, ry, { color: 2, r: 2.6 });
          });
        }
      });
      function pinta() {
        var pts = nube(), S = cov(pts), ei = autos(S);
        var prop = ei.l1 / (ei.l1 + ei.l2);
        out.set('$\\lambda_1 = ' + U.fmt(ei.l1, 3) + '$, $\\lambda_2 = ' + U.fmt(ei.l2, 3) + '$ &nbsp;·&nbsp; ' +
          'la primera componente explica el <strong>' + U.fmt(prop * 100, 1) + ' %</strong><br>' +
          'Error cuadrático medio al reconstruir: <strong>' + U.fmt(ei.l2, 3) + '</strong>, que es ' +
          'exactamente $\\lambda_2$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (prop > 0.93 ? 'Con la nube tan alargada, un número por punto basta: se tira la mitad de los datos y casi no se nota.'
            : (prop > 0.72 ? 'La compresión empieza a costar: los segmentos rojos, que son lo que se pierde, ya se ven.'
              : 'Con la nube casi redonda no hay una dirección privilegiada, y comprimir destroza los datos.')) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'anchura de la nube', min: 0.05, max: 1, step: 0.01, value: 0.25, dec: 2,
        on: function (v) { ancho = v; pinta(); }
      });
      pinta();
    }
  });

  p.util('Esto es lo que hace posible mirar datos con cientos de variables. El caso más citado es de ' +
    'genética: en 2008, Novembre y su equipo tomaron medio millón de marcadores genéticos de unos 1400 ' +
    'europeos, se quedaron con las dos primeras componentes principales y las dibujaron en un plano. ' +
    'Salió un mapa de Europa. Nadie le había dado al método ninguna coordenada geográfica: la ' +
    'geografía era, sencillamente, la dirección en la que más variaban los genomas. El artículo se ' +
    'titula <em>Genes mirror geography within Europe</em>. La misma idea comprime imágenes, resume la ' +
    'curva de tipos de interés en dos o tres números y reduce el ruido de un sensor.');

  p.hist('Karl Pearson lo publicó en 1901 con el título <em>On lines and planes of closest fit to systems ' +
    'of points in space</em>, y lo planteó al revés de como se cuenta hoy: no buscaba la dirección de ' +
    'máxima varianza, sino la recta que minimiza la distancia a los puntos, medida ' +
    '<em>perpendicularmente</em> y no en vertical como en la regresión. Son el mismo problema, y esa ' +
    'equivalencia es la que hace que el error al comprimir sea justo el autovalor descartado. Harold ' +
    'Hotelling lo redescubrió en 1933 desde la estadística y le puso el nombre de componentes ' +
    'principales.');

  p.note('Que sea el mismo problema que el de Pearson explica una confusión frecuente: la primera ' +
    'componente principal <strong>no es</strong> la recta de regresión. La regresión minimiza errores ' +
    'verticales, porque trata $y$ como la variable a predecir; PCA minimiza distancias ' +
    'perpendiculares, porque trata las dos variables por igual. Solo coinciden si la nube ya está ' +
    'perfectamente alineada.', null, 'No es la recta de regresión');

  p.trampas([
    { e: 'No centrar los datos antes de calcular $S$', por: 'Una nube pequeña alrededor de $(100, 100)$ daría una primera componente que apunta al origen y no dice nada de su forma. Lo primero es restar las medias.' },
    { e: 'Leer los autovalores como longitudes', por: 'Son varianzas. Con $\\lambda_1 = 9$ y $\\lambda_2 = 1$ la nube es tres veces más larga que ancha, no nueve: hay que sacar la raíz.' },
    { e: 'Confundir la primera componente con la recta de regresión', por: 'La regresión mide el error en vertical; PCA, perpendicularmente. Con los puntos $(1,1), (3,3), (5,4), (3,0)$ dan rectas distintas.' },
    { e: 'Comprimir una nube redonda', por: 'Si $\\lambda_1 \\approx \\lambda_2$ no hay ninguna dirección privilegiada y quedarse con una tira la mitad de la información. La proporción explicada es la que dice si merece la pena.' },
    { e: 'Aplicar PCA a variables con unidades distintas sin tipificar', por: 'Medir la estatura en milímetros en vez de en metros multiplica su varianza por un millón, y la primera componente pasa a ser «la estatura» sin que nada haya cambiado.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La variabilidad total',
    level: 'basico',
    gen: function (r) {
      var a = r.int(2, 9), c = r.int(2, 9), b = r.int(1, Math.min(a, c) - 1);
      return { a: a, b: b, c: c, tr: a + c };
    },
    ask: function (d) {
      return 'Una matriz de covarianza vale $S = \\begin{pmatrix} ' + d.a + ' & ' + d.b + ' \\\\ ' + d.b +
        ' & ' + d.c + ' \\end{pmatrix}$. Sin calcular los autovalores, ¿cuánto vale $\\lambda_1 + \\lambda_2$?';
    },
    fields: [{ name: 's', label: 'λ₁ + λ₂', w: 'tiny' }],
    sol: function (d) { return { s: d.tr }; },
    /* El determinante puede coincidir con la traza (por ejemplo con
       a=3, c=2, b=1: los dos valen 5), y entonces la regla saltaria con
       la respuesta correcta. Por eso el guarda. */
    errores: [{ si: function (v, d) { var det = d.a * d.c - d.b * d.b; return det !== d.tr && v.s === det; }, msg: 'Eso es el determinante, que vale $\\lambda_1 \\cdot \\lambda_2$. La <em>suma</em> es la traza.' }],
    hint: function () { return 'La suma de los autovalores de cualquier matriz cuadrada es su traza: la suma de la diagonal.'; },
    steps: function (d) {
      return ['La traza es $' + d.a + ' + ' + d.c + ' = ' + d.tr + '$.',
        'Y la traza es siempre la suma de los autovalores, así que $\\lambda_1 + \\lambda_2 = ' + d.tr + '$.',
        'Esa suma es toda la variabilidad de la nube: cambiar de ejes la reparte, pero no la cambia.'];
    },
    answer: function (d) { return String(d.tr); }
  });

  p.exercise({
    title: 'Cuánto explica la primera componente',
    level: 'basico',
    gen: function (r) {
      var l1 = r.int(5, 40), l2 = r.int(1, Math.max(1, Math.floor(l1 / 2)));
      return { l1: l1, l2: l2, prop: 100 * l1 / (l1 + l2) };
    },
    ask: function (d) {
      return 'Los autovalores de la matriz de covarianza son $\\lambda_1 = ' + d.l1 + '$ y $\\lambda_2 = ' +
        d.l2 + '$. ¿Qué porcentaje de la variabilidad explica la primera componente? (un decimal)';
    },
    fields: [{ name: 'p', label: '%', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.prop, 4) }; },
    dec: 1,
    errores: [{ si: function (v, d) { return d.l1 !== d.l2 && Math.abs(v.p - 100 * d.l2 / (d.l1 + d.l2)) < 0.05; }, msg: 'Has calculado lo que explica la <em>segunda</em>. El numerador es el autovalor de la componente por la que preguntan.' }],
    hint: function () { return 'Su autovalor entre la suma de los dos, por cien.'; },
    steps: function (d) {
      return ['$\\dfrac{' + d.l1 + '}{' + d.l1 + ' + ' + d.l2 + '} = \\dfrac{' + d.l1 + '}{' + (d.l1 + d.l2) + '} = ' + U.fmt(d.prop / 100, 4) + '$',
        'En porcentaje, $' + U.fmt(d.prop, 1) + '\\,\\%$.',
        'Y lo que se pierde al quedarse solo con ella es el otro autovalor, $' + d.l2 + '$.'];
    },
    answer: function (d) { return U.fmt(d.prop, 1) + ' %'; }
  });

  p.exercise({
    title: 'La covarianza de cuatro puntos',
    level: 'medio',
    gen: function (r) {
      /* Desviaciones que suman cero: asi las medias salen enteras y el
         ejercicio se puede hacer a mano. Varios juegos, para que la
         respuesta no sea siempre la misma. */
      var dx = r.shuffle(r.pick([[-3, -1, 1, 3], [-2, -2, 2, 2], [-4, -2, 2, 4], [-1, -1, 1, 1]]));
      var dy = r.shuffle(r.pick([[-2, -2, 2, 2], [-3, -1, 1, 3], [-1, -1, 1, 1]]));
      var cx = r.int(2, 8), cy = r.int(2, 8), i;
      var pts = [], sxx = 0, sxy = 0;
      for (i = 0; i < 4; i++) {
        pts.push([cx + dx[i], cy + dy[i]]);
        sxx += dx[i] * dx[i];
        sxy += dx[i] * dy[i];
      }
      return { pts: pts, cx: cx, cy: cy, dx: dx, dy: dy, sxx: sxx / 4, sxy: sxy / 4 };
    },
    ask: function (d) {
      var lista = d.pts.map(function (q) { return '(' + q[0] + ',\\,' + q[1] + ')'; }).join(',\\ ');
      return 'Dados los puntos $' + lista + '$, calcula $s_{xx}$ y $s_{xy}$ de su matriz de covarianza, ' +
        'dividiendo entre $n = 4$. (Dos decimales.)';
    },
    fields: [{ name: 'xx', label: 's_xx', w: 'tiny' }, { name: 'xy', label: 's_xy', w: 'tiny' }],
    sol: function (d) { return { xx: d.sxx, xy: d.sxy }; },
    dec: 2,
    errores: [{ si: function (v, d) { return Math.abs(v.xx - d.sxx * 4 / 3) < 0.01 && d.sxx !== 0; }, msg: 'Has dividido entre $n - 1$. Aquí se pide dividiendo entre $n = 4$.' }],
    hint: function (d) { return 'Centra primero: las medias son $\\overline{x} = ' + d.cx + '$ y $\\overline{y} = ' + d.cy + '$. Después, media de los cuadrados y media de los productos.'; },
    steps: function (d) {
      return ['Centrados, los puntos son $(' + d.dx.map(function (v, i) { return v + ',\\,' + d.dy[i]; }).join(')$, $(') + ')$.',
        '$s_{xx} = \\dfrac{' + d.dx.map(function (v) { return v * v; }).join(' + ') + '}{4} = ' + U.fmt(d.sxx, 2) + '$',
        '$s_{xy} = \\dfrac{' + d.dx.map(function (v, i) { return '(' + v + ')(' + d.dy[i] + ')'; }).join(' + ') + '}{4} = ' + U.fmt(d.sxy, 2) + '$',
        d.sxy > 0 ? 'La covarianza es positiva: la nube se estira hacia arriba a la derecha.'
          : (d.sxy < 0 ? 'La covarianza es negativa: la nube se estira hacia abajo a la derecha.'
            : 'La covarianza es cero: los ejes $x$ e $y$ ya son las componentes principales.')];
    },
    answer: function (d) { return 's_xx = ' + U.fmt(d.sxx, 2) + ', s_xy = ' + U.fmt(d.sxy, 2); }
  });

  p.exercise({
    title: 'Los autovalores de una covarianza',
    level: 'medio',
    gen: function (r) {
      /* Se construye desde los autovalores para que salgan exactos: con
         a = c la matriz [[a,b],[b,a]] tiene autovalores a+b y a-b. */
      var l1 = r.int(6, 20), l2 = r.int(1, l1 - 3);
      if ((l1 + l2) % 2 !== 0) l2 += 1;
      if (l2 >= l1) return null;
      return { a: (l1 + l2) / 2, b: (l1 - l2) / 2, l1: l1, l2: l2 };
    },
    ask: function (d) {
      return 'Halla los dos autovalores de $S = \\begin{pmatrix} ' + d.a + ' & ' + d.b + ' \\\\ ' + d.b +
        ' & ' + d.a + ' \\end{pmatrix}$, empezando por el mayor.';
    },
    fields: [{ name: 'l1', label: 'λ₁ (mayor)', w: 'tiny' }, { name: 'l2', label: 'λ₂', w: 'tiny' }],
    sol: function (d) { return { l1: d.l1, l2: d.l2 }; },
    errores: [{ si: function (v, d) { return v.l1 === d.l2 && v.l2 === d.l1; }, msg: 'Están bien los dos números, pero al revés: se pide primero el mayor.' }],
    hint: function () { return 'Con la diagonal repetida, prueba los vectores $(1, 1)$ y $(1, -1)$: son los autovectores, y el autovalor sale de mirar qué les hace la matriz.'; },
    steps: function (d) {
      return ['Traza $= ' + (2 * d.a) + '$ y determinante $= ' + d.a + '^2 - ' + d.b + '^2 = ' + (d.a * d.a - d.b * d.b) + '$.',
        '$\\lambda^2 - ' + (2 * d.a) + '\\lambda + ' + (d.a * d.a - d.b * d.b) + ' = 0$, y sale $\\lambda = ' + d.a + ' \\pm ' + d.b + '$.',
        '$\\lambda_1 = ' + d.l1 + '$ con autovector $(1, 1)$, y $\\lambda_2 = ' + d.l2 + '$ con autovector $(1, -1)$: perpendiculares, como siempre en una matriz simétrica.',
        'La primera componente va a $45^\\circ$, y explica el $' + U.fmt(100 * d.l1 / (d.l1 + d.l2), 1) + '\\,\\%$.'];
    },
    answer: function (d) { return 'λ₁ = ' + d.l1 + ', λ₂ = ' + d.l2; }
  });

  p.exercise({
    title: 'Proyectar sobre la primera componente',
    level: 'avanzado',
    gen: function (r) {
      var u = r.pick([[3 / 5, 4 / 5], [4 / 5, 3 / 5], [-3 / 5, 4 / 5], [4 / 5, -3 / 5]]);
      var px = r.pm(1, 6), py = r.pm(1, 6);
      return { u: u, px: px, py: py, k: px * u[0] + py * u[1] };
    },
    ask: function (d) {
      return 'La primera componente principal de una nube ya centrada tiene la dirección unitaria ' +
        '$\\vec u = \\left(' + ML.F(Math.round(d.u[0] * 5), 5).tex() + ',\\ ' + ML.F(Math.round(d.u[1] * 5), 5).tex() +
        '\\right)$. ¿Cuál es la coordenada del punto centrado $(' + d.px + ',\\ ' + d.py + ')$ sobre esa ' +
        'componente? (dos decimales)';
    },
    fields: [{ name: 'k', label: 'coordenada', w: 'tiny' }],
    sol: function (d) { return { k: U.round(d.k, 6) }; },
    dec: 2,
    /* Cruzar las componentes da lo mismo que hacerlo bien cuando las dos
       coordenadas del punto son iguales: la diferencia es
       (px - py)(u2 - u1), y se anula. */
    errores: [{ si: function (v, d) { return d.px !== d.py && Math.abs(v.k - (d.px * d.u[1] + d.py * d.u[0])) < 0.005; }, msg: 'Has cruzado las componentes: la primera del punto va con la primera de $\\vec u$.' }],
    hint: function () { return 'Proyectar sobre una dirección unitaria es el producto escalar con ella: no hace falta dividir por nada, porque $|\\vec u| = 1$.'; },
    steps: function (d) {
      return ['$k = \\vec p \\cdot \\vec u = (' + d.px + ')\\cdot' + U.fmt(d.u[0], 1) + ' + (' + d.py + ')\\cdot' + U.fmt(d.u[1], 1) + '$',
        '$= ' + U.fmt(d.px * d.u[0], 2) + ' + ' + U.fmt(d.py * d.u[1], 2) + ' = ' + U.fmt(d.k, 2) + '$',
        'Ese único número sustituye a los dos del punto: eso es comprimir. Para recuperarlo aproximadamente se hace $k\\,\\vec u$, y lo que se pierde es la parte perpendicular.'];
    },
    answer: function (d) { return U.fmt(d.k, 2); }
  });

  p.keys([
    'La matriz de covarianza guarda la forma de la nube: varianzas en la diagonal, covarianza fuera. Hay que <strong>centrar</strong> antes.',
    'La varianza en una dirección unitaria es $\\vec u^{T}S\\vec u$, y es máxima en el autovector del mayor autovalor.',
    'Los autovalores <strong>son</strong> las varianzas en sus direcciones, y su suma, la traza, es toda la variabilidad.',
    'Las componentes principales son perpendiculares, porque $S$ es simétrica.',
    'Al quedarse con las primeras componentes, lo que se pierde es exactamente la suma de los autovalores descartados.',
    'No es la recta de regresión: PCA mide el error perpendicularmente y trata las dos variables por igual.'
  ]);

  /* ---- ayudas de cálculo del tema ---- */
  function cov(pts) {
    var n = pts.length, mx = 0, my = 0, i;
    for (i = 0; i < n; i++) { mx += pts[i][0]; my += pts[i][1]; }
    mx /= n; my /= n;
    var xx = 0, yy = 0, xy = 0;
    for (i = 0; i < n; i++) {
      var a = pts[i][0] - mx, b = pts[i][1] - my;
      xx += a * a; yy += b * b; xy += a * b;
    }
    return { xx: xx / n, yy: yy / n, xy: xy / n };
  }

  /* Autovalores y autovectores de una simétrica 2×2, con la fórmula
     cerrada: traza y determinante, y el vector director de cada uno. */
  function autos(S) {
    var tr = S.xx + S.yy, det = S.xx * S.yy - S.xy * S.xy;
    var raiz = Math.sqrt(Math.max(0, tr * tr - 4 * det));
    var l1 = (tr + raiz) / 2, l2 = (tr - raiz) / 2;
    function vec(l) {
      var vx, vy;
      if (Math.abs(S.xy) > 1e-12) { vx = S.xy; vy = l - S.xx; }
      else { vx = (l === S.xx) ? 1 : 0; vy = (l === S.xx) ? 0 : 1; }
      var m = Math.sqrt(vx * vx + vy * vy) || 1;
      return [vx / m, vy / m];
    }
    return { l1: l1, l2: l2, v1: vec(l1), v2: vec(l2) };
  }
});
