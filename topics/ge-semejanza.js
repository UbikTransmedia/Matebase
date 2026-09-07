/* Tema: Semejanza y teorema de Tales */
Course.topic('ge-semejanza', function (p) {

  p.text('Dos figuras son <strong>semejantes</strong> cuando tienen la misma forma aunque distinto ' +
    'tamaño: una es una ampliación o una reducción de la otra. Es lo que hace un mapa, una maqueta ' +
    'o una fotocopia al 150 %.');

  p.text('Para triángulos, semejante significa dos cosas <em>a la vez</em> (y basta comprobar una, ' +
    'porque cada una implica la otra):');

  p.formulas([
    '\\hat{A} = \\hat{A\'}, \\quad \\hat{B} = \\hat{B\'}, \\quad \\hat{C} = \\hat{C\'}',
    '\\frac{a}{a\'} = \\frac{b}{b\'} = \\frac{c}{c\'} = k'
  ], 'ángulos iguales · lados proporcionales');

  p.text('Ese número $k$ es la <strong>razón de semejanza</strong>. Si $k=2$, la segunda figura es el ' +
    'doble de grande en todas sus longitudes.');

  p.note('Para saber si dos triángulos son semejantes basta con comprobar que tienen ' +
    '<strong>dos ángulos iguales</strong>. Como los tres suman $180^\\circ$, el tercero sale gratis. ' +
    'Es el criterio que más se usa.', 'ok', 'El atajo');

  p.demo({
    title: 'La misma forma a distinta escala',
    intro: 'Cambia la razón de semejanza. Los ángulos no se mueven ni un grado; todas las longitudes se multiplican por k.',
    build: function (host, d) {
      var k = 1.8;
      var out = W.readout(host, '');
      var base = [[0, 0], [3, 0], [1.2, 2]];
      var plot = W.board(host, {
        xmin: -1, xmax: 9, ymin: -1, ymax: 6, height: 330,
        grid: true, axes: false,
        draw: function (g) {
          g.poly(base, { color: 0, fill: 0, fillAlpha: .18, w: 2.2 });
          var big = base.map(function (P) { return [P[0] * k + 4, P[1] * k]; });
          g.poly(big, { color: 1, fill: 1, fillAlpha: .18, w: 2.2 });
          var l = [];
          for (var i = 0; i < 3; i++) {
            var j = (i + 1) % 3;
            l.push(Math.hypot(base[j][0] - base[i][0], base[j][1] - base[i][1]));
          }
          g.text(1.4, -0.55, 'lados: ' + l.map(function (x) { return U.fmt(x, 2); }).join(', '),
            { align: 'center', size: 11.5, color: 0 });
          g.text(4 + 1.4 * k, -0.55, 'lados: ' + l.map(function (x) { return U.fmt(x * k, 2); }).join(', '),
            { align: 'center', size: 11.5, color: 1 });
        }
      });
      function paint() {
        var l1 = Math.hypot(3, 0), a1 = 0.5 * Math.abs(3 * 2 - 0 * 1.2);
        out.set('Razón de semejanza $k = ' + U.fmt(k, 2) + '$<br>' +
          'Las <strong>longitudes</strong> se multiplican por $k = ' + U.fmt(k, 2) + '$.<br>' +
          'Las <strong>áreas</strong> se multiplican por $k^2 = ' + U.fmt(k * k, 3) + '$: ' +
          'de $' + U.fmt(a1, 2) + '$ a $' + U.fmt(a1 * k * k, 2) + '$.<br>' +
          'Los <strong>ángulos</strong> no cambian.');
        plot.render();
      }
      W.slider(W.row(host), { label: 'razón k', min: 0.4, max: 2.2, step: 0.1, value: k, dec: 2, on: function (v) { k = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Áreas y volúmenes: el error clásico');

  p.text('Aquí está el error más repetido de toda la geometría, y conviene cometerlo una vez con ' +
    'conciencia para no volver a cometerlo nunca. Si duplicas todas las longitudes de una figura, el ' +
    'área <strong>no</strong> se duplica: se multiplica por cuatro. Y el volumen, por ocho.');

  p.text('Compruébalo con la figura más tonta que existe. Coge un cuadrado de 1 cm de lado: su área es ' +
    '1 cm². Duplica el lado a 2 cm: el área pasa a ser $2\\times 2 = 4$ cm². No has hecho ninguna ' +
    'trampa, y el área se ha multiplicado por cuatro. La razón es visible si lo dibujas: en el cuadrado ' +
    'grande caben <em>cuatro</em> cuadraditos del pequeño, dos de ancho por dos de alto.');

  p.text('Con el volumen ocurre lo mismo una dimensión más arriba: en un cubo de lado doble caben dos ' +
    'a lo ancho, dos a lo largo y dos a lo alto, o sea ocho cubitos. Y como toda figura se puede ' +
    'imaginar rellena de cuadraditos o de cubitos, lo que vale para el cuadrado vale para cualquier ' +
    'forma, por rara que sea.');

  p.text('La regla general se recuerda por el <strong>exponente, que coincide con el número de ' +
    'dimensiones</strong> de lo que estás midiendo: una longitud tiene una dimensión y va con $k$, un ' +
    'área tiene dos y va con $k^2$, un volumen tiene tres y va con $k^3$.');

  p.formulas([
    '\\text{longitudes} \\times k',
    '\\text{áreas} \\times k^2',
    '\\text{volúmenes} \\times k^3'
  ], null,
    'Se lee: <em>«las longitudes se multiplican por ka, las áreas por ka al cuadrado y los volúmenes ' +
    'por ka al cubo»</em>.<br><br>Con $k=3$, por ejemplo: los lados se hacen 3 veces mayores, las ' +
    'superficies 9 veces y las capacidades 27 veces. Por eso una maqueta a escala 1:3 no necesita el ' +
    'triple de material, sino veintisiete veces menos.');

  p.note('Esto tiene consecuencias que van mucho más allá de la geometría. Un animal el doble de alto ' +
    'pesa ocho veces más, pero la sección de sus huesos solo es cuatro veces mayor: por eso los ' +
    'elefantes tienen patas gruesas y las hormigas no. Se llama <em>ley del cuadrado-cubo</em>, y la ' +
    'formuló Galileo en 1638.', null, 'Por qué no existen gigantes');

  /* ---------------------------------------------------------------- */
  p.util('Esa misma ley decide cosas muy alejadas de los animales. Un cuerpo pequeño tiene mucha ' +
    'superficie para poco volumen, y por eso el hielo picado enfría la bebida mucho más rápido que un ' +
    'cubito grande, la leña fina prende antes que un tronco y un colibrí tiene que comer casi sin ' +
    'parar: pierde calor por una superficie enorme en relación con lo que pesa. En cocina es la razón ' +
    'de que la patata cortada pequeña se dore y la grande se quede cruda por dentro.');

  p.util('En ingeniería el cuadrado-cubo es una restricción de diseño. Duplicar el tamaño de un dron ' +
    'multiplica su peso por ocho y la superficie de sus hélices solo por cuatro, así que hace falta ' +
    'rediseñar el sistema entero y no simplemente «hacerlo más grande». Lo mismo limita la altura de ' +
    'los edificios y el tamaño de los barcos, y explica por qué los reactores químicos que funcionan ' +
    'en el laboratorio a veces fracasan al escalarlos a fábrica: el calor se genera con el volumen y ' +
    'se evacúa por la superficie, y al crecer la pieza esa cuenta deja de salir.',
    'Utilidad: por qué no se puede «hacer más grande» sin más');

  p.section('El teorema de Tales');

  p.text('Si varias rectas <strong>paralelas</strong> cortan a dos rectas secantes, los segmentos que ' +
    'determinan en una son proporcionales a los que determinan en la otra.');

  p.formula('\\frac{\\overline{AB}}{\\overline{A\'B\'}} = \\frac{\\overline{BC}}{\\overline{B\'C\'}} = \\frac{\\overline{AC}}{\\overline{A\'C\'}}',
    'teorema de Tales');

  p.hist('Cuenta la leyenda que Tales de Mileto (siglo VI a.C.) midió la altura de la pirámide de ' +
    'Keops con este teorema: clavó un palo en el suelo y esperó al momento en que la sombra del palo ' +
    'medía exactamente lo mismo que el palo. En ese instante, la sombra de la pirámide medía lo mismo ' +
    'que la pirámide. Sin escalar nada, sin instrumentos, solo con una proporción.');

  p.demo({
    title: 'Medir lo inaccesible con una proporción',
    intro: 'El palo y el edificio proyectan sombras a la vez, así que forman dos triángulos semejantes. Con tres medidas fáciles se obtiene la cuarta, que es imposible de medir.',
    build: function (host, d) {
      var hp = 1.5, sp = 2.4, se = 18;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -2, xmax: 26, ymin: -2, ymax: 16, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          var he = hp * se / sp;
          g.seg(-1, 0, 25, 0, { color: 'axis', w: 2 });
          // palo
          g.seg(0, 0, 0, hp, { color: 0, w: 4 });
          g.seg(0, 0, sp, 0, { color: 3, w: 3 });
          g.seg(sp, 0, 0, hp, { color: 4, w: 1.6, dash: true });
          g.text(-0.3, hp / 2, U.fmt(hp, 1) + ' m', { align: 'right', size: 11.5, color: 0 });
          g.text(sp / 2, -0.75, U.fmt(sp, 1) + ' m', { align: 'center', size: 11.5, color: 3 });
          // edificio
          g.rect(se - 3, 0, 3, he, { color: 1, fill: 1, fillAlpha: .25, w: 2 });
          g.seg(se - 3, 0, se, 0, { color: 3, w: 3 });
          g.seg(se, 0, se - 3, he, { color: 4, w: 1.6, dash: true });
          g.text(se - 3.3, he / 2, '¿?', { align: 'right', size: 15, color: 1, bold: true });
          g.text(se - 1.5, -0.75, U.fmt(se, 1) + ' m', { align: 'center', size: 11.5, color: 3 });
        }
      });
      function paint() {
        var he = hp * se / sp;
        out.set('$\\dfrac{\\text{altura del palo}}{\\text{sombra del palo}} = ' +
          '\\dfrac{\\text{altura del edificio}}{\\text{sombra del edificio}}$<br>' +
          '$\\dfrac{' + U.fmt(hp, 2) + '}{' + U.fmt(sp, 2) + '} = \\dfrac{h}{' + U.fmt(se, 1) + '} ' +
          '\\Rightarrow h = ' + U.fmt(he, 3) + '$ m');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'altura del palo (m)', min: 0.5, max: 3, step: 0.1, value: hp, dec: 1, on: function (v) { hp = v; paint(); } });
      W.slider(row, { label: 'sombra del palo (m)', min: 0.5, max: 5, step: 0.1, value: sp, dec: 1, on: function (v) { sp = v; paint(); } });
      W.slider(row, { label: 'sombra del edificio (m)', min: 5, max: 24, step: 0.5, value: se, dec: 1, on: function (v) { se = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Tales midió la pirámide de Keops con una vara y su sombra: cuando la sombra de la vara igualaba ' +
    'su altura, la sombra de la pirámide igualaba la suya. Ese mismo razonamiento se sigue usando ' +
    'para medir árboles, edificios y montañas sin escalarlos, y es el principio de un instrumento ' +
    'que se llama telémetro. También es la razón de que una foto ampliada no se deforme: al ' +
    'multiplicar todos los lados por lo mismo, las proporciones aguantan.');

  p.section('Practica');

  p.exercise({
    title: 'Lado que falta en triángulos semejantes',
    level: 'basico',
    gen: function (r) {
      var k = r.pick([1.5, 2, 2.5, 3, 0.5]);
      var a = r.int(3, 12), b = r.int(3, 12);
      var a2 = a * k, b2 = b * k;
      if (!Number.isInteger(a2 * 10) || !Number.isInteger(b2 * 10)) return null;
      return { a: a, b: b, a2: a2, b2: b2, k: k };
    },
    ask: function (d) {
      return 'Dos triángulos son semejantes. En el primero, dos lados miden $' + d.a + '$ y $' + d.b +
        '$ cm. En el segundo, el lado que se corresponde con el primero mide $' + U.fmt(d.a2, 2) +
        '$ cm. ¿Cuánto mide el que se corresponde con el segundo?';
    },
    fields: [{ name: 'v', label: 'Longitud (cm)', w: 'tiny' }],
    sol: function (d) { return { v: d.b2 }; },
    tol: 1e-5,
    hint: function (d) { return 'La razón de semejanza es $' + U.fmt(d.a2, 2) + ' : ' + d.a + ' = ' + U.fmt(d.k, 2) + '$.'; },
    steps: function (d) {
      return ['Razón de semejanza: $k = \\dfrac{' + U.fmt(d.a2, 2) + '}{' + d.a + '} = ' + U.fmt(d.k, 2) + '$.',
        'Todos los lados del segundo triángulo se obtienen multiplicando por $k$.',
        '$' + d.b + ' \\cdot ' + U.fmt(d.k, 2) + ' = ' + U.fmt(d.b2, 2) + '$ cm'];
    },
    answer: function (d) { return U.fmt(d.b2, 2) + ' cm'; }
  });

  p.exercise({
    title: 'Escalas de un mapa',
    level: 'medio',
    gen: function (r) {
      var esc = r.pick([25000, 50000, 100000, 200000, 500000]);
      var cm = r.int(2, 40) / 2;
      return { esc: esc, cm: cm, km: cm * esc / 100000 };
    },
    ask: function (d) {
      return 'En un mapa a escala $1:' + U.miles(d.esc) + '$, dos ciudades están separadas $' +
        U.fmt(d.cm, 1) + '$ cm. ¿Cuántos <strong>kilómetros</strong> hay entre ellas? (dos decimales)';
    },
    fields: [{ name: 'v', label: 'Distancia (km)', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.km, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Cada centímetro del mapa son $' + U.miles(d.esc) + '$ cm reales. Y $1$ km son $100\\,000$ cm.'; },
    steps: function (d) {
      return ['Distancia real en cm: $' + U.fmt(d.cm, 1) + ' \\cdot ' + d.esc + ' = ' + U.miles(d.cm * d.esc) + '$ cm.',
        'Pasamos a kilómetros dividiendo entre $100\\,000$.',
        '$' + U.fmt(d.cm * d.esc / 100000, 4) + '$ km'];
    },
    answer: function (d) { return U.fmt(d.km, 2) + ' km'; }
  });

  p.exercise({
    title: 'Áreas y volúmenes al escalar',
    level: 'medio',
    gen: function (r) {
      var k = r.pick([2, 3, 4, 5, 0.5]);
      var base = r.int(2, 40);
      var cual = r.bool();
      return { k: k, base: base, cual: cual, res: base * Math.pow(k, cual ? 2 : 3) };
    },
    ask: function (d) {
      if (d.cual) {
        return 'Una figura tiene un área de $' + d.base + '$ cm². Si multiplicamos todas sus ' +
          'longitudes por $' + U.fmt(d.k, 1) + '$, ¿cuál será su nueva área? (en cm²)';
      }
      return 'Un cuerpo tiene un volumen de $' + d.base + '$ cm³. Si multiplicamos todas sus ' +
        'longitudes por $' + U.fmt(d.k, 1) + '$, ¿cuál será su nuevo volumen? (en cm³)';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 1e-5,
    hint: function (d) {
      return d.cual ? 'Las áreas se multiplican por $k^2$, no por $k$.' : 'Los volúmenes se multiplican por $k^3$.';
    },
    steps: function (d) {
      var e = d.cual ? 2 : 3;
      return ['Al multiplicar las longitudes por $k$, las ' + (d.cual ? 'áreas' : 'volúmenes') +
        ' se multiplican por $k^' + e + '$.',
        '$k^' + e + ' = ' + U.fmt(d.k, 1) + '^' + e + ' = ' + U.fmt(Math.pow(d.k, e), 4) + '$',
        '$' + d.base + ' \\cdot ' + U.fmt(Math.pow(d.k, e), 4) + ' = ' + U.fmt(d.res, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + (d.cual ? ' cm²' : ' cm³'); }
  });

  p.exercise({
    title: 'Teorema de Tales',
    level: 'medio',
    gen: function (r) {
      var a = r.int(2, 12), b = r.int(2, 12), a2 = r.int(2, 12);
      var b2 = b * a2 / a;
      if (!Number.isInteger(b2 * 100) || b2 > 60) return null;
      return { a: a, b: b, a2: a2, b2: U.round(b2, 4) };
    },
    ask: function (d) {
      return 'Tres rectas paralelas cortan a dos secantes. En la primera secante determinan segmentos ' +
        'de $' + d.a + '$ y $' + d.b + '$ cm. En la segunda, el primer segmento mide $' + d.a2 +
        '$ cm. ¿Cuánto mide el segundo? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Longitud (cm)', w: 'tiny' }],
    sol: function (d) { return { v: d.b2 }; },
    tol: 3e-4,
    hint: function () { return 'Plantea la proporción $\\dfrac{a}{a\'} = \\dfrac{b}{b\'}$ y multiplica en cruz.'; },
    steps: function (d) {
      return ['Por el teorema de Tales: $\\dfrac{' + d.a + '}{' + d.a2 + '} = \\dfrac{' + d.b + '}{x}$.',
        'Multiplicamos en cruz: $' + d.a + '\\,x = ' + d.b + ' \\cdot ' + d.a2 + ' = ' + (d.b * d.a2) + '$.',
        '$x = \\dfrac{' + (d.b * d.a2) + '}{' + d.a + '} = ' + U.fmt(d.b2, 4) + '$ cm'];
    },
    answer: function (d) { return U.fmt(d.b2, 4) + ' cm'; }
  });

  p.keys([
    'Semejante = misma forma, distinto tamaño. Ángulos iguales y lados proporcionales.',
    'Basta con <strong>dos ángulos iguales</strong> para asegurar que dos triángulos son semejantes.',
    'Longitudes $\\times k$, áreas $\\times k^2$, volúmenes $\\times k^3$.',
    'Tales: paralelas cortando a dos secantes determinan segmentos proporcionales.',
    'Con una proporción se mide lo que no se puede medir directamente: alturas, distancias, mapas.'
  ]);
});
