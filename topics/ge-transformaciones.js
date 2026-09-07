/* Tema: Movimientos y transformaciones */
Course.topic('ge-transformaciones', function (p) {

  p.text('Una <strong>transformación</strong> convierte cada punto del plano en otro punto. Las más ' +
    'importantes son las que <em>no deforman</em>: conservan las distancias, y por tanto también los ' +
    'ángulos y las áreas. Se llaman <strong>movimientos</strong> o isometrías.');

  p.text('Solo hay cuatro tipos, y con ellos se construye cualquier otro:');

  p.table(['Movimiento', 'Qué hace', 'Elementos que lo definen'],
    [['Traslación', 'desliza sin girar', 'un vector $\\vec{v}$'],
     ['Giro (rotación)', 'gira alrededor de un punto', 'un centro y un ángulo'],
     ['Simetría axial', 'refleja como un espejo', 'un eje (una recta)'],
     ['Simetría central', 'gira media vuelta', 'un centro']]);

  p.demo({
    title: 'Los cuatro movimientos',
    intro: 'Elige un movimiento y mira cómo se transforma la figura. Fíjate en que el tamaño nunca cambia; lo único que cambia en algunos casos es la orientación.',
    build: function (host, d) {
      var tipo = 'traslacion';
      var par = 3;
      var out = W.readout(host, '');
      var figura = [[0.5, 0.5], [2.5, 0.5], [2.5, 1.2], [1.2, 1.2], [1.2, 2.2], [0.5, 2.2]];
      var textos = {
        traslacion: 'Cada punto se desplaza el mismo vector. No cambia ni el tamaño ni la orientación ni la inclinación.',
        giro: 'Todos los puntos giran el mismo ángulo alrededor del centro. Se conservan distancias y orientación.',
        simetria: 'Reflejo respecto al eje vertical. Se conservan las distancias pero se <strong>invierte la orientación</strong>: la figura queda del revés, como en un espejo.',
        central: 'Media vuelta alrededor del origen. Equivale a un giro de 180°.'
      };
      var plot = W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 340,
        draw: function (g) {
          g.poly(figura, { color: 0, fill: 0, fillAlpha: .3, w: 2 });
          var img;
          if (tipo === 'traslacion') {
            img = figura.map(function (P) { return [P[0] + par, P[1] - 1]; });
            g.vec(figura[0][0], figura[0][1], figura[0][0] + par, figura[0][1] - 1, { color: 2, w: 2 });
          } else if (tipo === 'giro') {
            var a = par * Math.PI / 180 * 30;
            img = figura.map(function (P) {
              return [P[0] * Math.cos(a) - P[1] * Math.sin(a), P[0] * Math.sin(a) + P[1] * Math.cos(a)];
            });
            g.point(0, 0, { color: 2, r: 5 });
            g.arc(0, 0, 1.2, 0, a, { color: 2, w: 2 });
          } else if (tipo === 'simetria') {
            img = figura.map(function (P) { return [-P[0], P[1]]; });
            g.vline(0, { color: 2, w: 2.4, dash: true });
          } else {
            img = figura.map(function (P) { return [-P[0], -P[1]]; });
            g.point(0, 0, { color: 2, r: 5 });
          }
          g.poly(img, { color: 1, fill: 1, fillAlpha: .3, w: 2 });
        }
      });
      function paint() { out.set(textos[tipo]); plot.render(); }
      W.chips(host, [
        { label: 'traslación', value: 'traslacion' }, { label: 'giro', value: 'giro' },
        { label: 'simetría axial', value: 'simetria' }, { label: 'simetría central', value: 'central' }
      ], { value: 'traslacion', on: function (v) { tipo = v; paint(); } });
      W.slider(W.row(host), {
        label: 'parámetro (vector o ángulo)', min: 1, max: 6, step: 1, value: 3, dec: 0,
        on: function (v) { par = v; plot.render(); }
      });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('En coordenadas');
  p.text('Hasta aquí has movido figuras con la imaginación. Para que las mueva un ordenador hace falta ' +
    'traducir cada movimiento a cuentas con coordenadas, y ahí es donde estas transformaciones dejan ' +
    'de ser geometría de dibujo para convertirse en la base de cualquier programa gráfico. Fíjate en ' +
    'que todas responden a la misma pregunta: si el punto estaba en $(x,y)$, ¿dónde acaba?');


  p.formulas([
    '\\text{traslación de } \\vec{v}=(a,b):\\quad (x,y) \\mapsto (x+a,\\ y+b)',
    '\\text{simetría respecto al eje } Y:\\quad (x,y)\\mapsto(-x,\\ y)',
    '\\text{simetría respecto al eje } X:\\quad (x,y)\\mapsto(x,\\ -y)',
    '\\text{simetría central en el origen:}\\quad (x,y)\\mapsto(-x,\\ -y)',
    '\\text{giro de ángulo }\\alpha\\text{ en el origen:}\\quad (x,y)\\mapsto(x\\cos\\alpha - y\\operatorname{sen}\\alpha,\\ x\\operatorname{sen}\\alpha + y\\cos\\alpha)'
  ]);

  p.note('Esa última fórmula del giro es exactamente lo que hace la matriz $\\begin{pmatrix}\\cos\\alpha & -\\operatorname{sen}\\alpha \\\\ \\operatorname{sen}\\alpha & \\cos\\alpha\\end{pmatrix}$ ' +
    'al multiplicar por el vector $(x,y)$. Toda transformación lineal del plano <em>es</em> una matriz: ' +
    'ese es el puente entre la geometría y el álgebra lineal.', 'ok', 'Geometría = matrices');

  /* ---------------------------------------------------------------- */
  p.util('Cada vez que arrastras, giras o amplías algo en una pantalla se está aplicando una de estas ' +
    'transformaciones a miles de puntos a la vez. Los editores de imagen, los programas de diseño y ' +
    'los videojuegos las guardan como matrices y las encadenan multiplicando, que es exactamente lo ' +
    'que verás en el bloque avanzado. La animación de una película es una sucesión de ' +
    'transformaciones aplicadas a un modelo.');

  p.section('Homotecias: cambiar el tamaño');

  p.text('Una <strong>homotecia</strong> de centro $O$ y razón $k$ multiplica por $k$ la distancia de ' +
    'cada punto al centro. Ya no es un movimiento, porque cambia el tamaño: es una semejanza.');

  p.formula('(x,y) \\mapsto (k\\,x,\\ k\\,y) \\quad\\text{(centro en el origen)}');

  p.list([
    '$k > 1$: amplía.',
    '$0 < k < 1$: reduce.',
    '$k < 0$: además da la vuelta a la figura (la manda al otro lado del centro).',
    'Las longitudes se multiplican por $|k|$, las áreas por $k^2$.'
  ]);

  p.demo({
    title: 'Homotecia',
    intro: 'Cambia la razón. Todas las rectas que unen un punto con su imagen pasan por el centro: por eso es una ampliación «desde un punto», como la de un proyector.',
    build: function (host, d) {
      var k = 1.6;
      var out = W.readout(host, '');
      var fig = [[1, 0.6], [2.6, 0.6], [1.8, 2]];
      var plot = W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 330,
        draw: function (g) {
          g.point(0, 0, { color: 2, r: 5, label: 'O', labelDy: 14 });
          g.poly(fig, { color: 0, fill: 0, fillAlpha: .3, w: 2 });
          var img = fig.map(function (P) { return [P[0] * k, P[1] * k]; });
          g.poly(img, { color: 1, fill: 1, fillAlpha: .25, w: 2 });
          fig.forEach(function (P, i) {
            g.seg(0, 0, img[i][0], img[i][1], { color: 'axis', w: 1, dash: true });
          });
        }
      });
      function paint() {
        out.set('Razón $k = ' + U.fmt(k, 2) + '$<br>' +
          'Longitudes $\\times ' + U.fmt(Math.abs(k), 2) + '$ &nbsp;·&nbsp; áreas $\\times ' + U.fmt(k * k, 3) + '$<br>' +
          (k < 0 ? '<strong>Razón negativa</strong>: la imagen sale al otro lado del centro, boca abajo.'
            : (Math.abs(k) < 1 ? 'La figura se reduce.' : 'La figura se amplía.')));
        plot.render();
      }
      W.slider(W.row(host), { label: 'razón k', min: -2, max: 2.5, step: 0.1, value: k, dec: 2, on: function (v) { k = v || 0.1; paint(); } });
      paint();
    }
  });

  p.hist('Clasificar los movimientos del plano fue el germen de una idea enorme. En 1872, Felix Klein ' +
    'propuso en su <em>Programa de Erlangen</em> definir cada geometría por el <strong>grupo de ' +
    'transformaciones</strong> que deja invariantes sus propiedades. La geometría euclídea es la de ' +
    'las isometrías; si admites también homotecias sale la geometría afín; y así hasta la topología, ' +
    'donde vale cualquier deformación continua. Una misma figura es «la misma» o no según qué ' +
    'transformaciones consideres legales.');

  /* ================= EJERCICIOS ================= */
  p.util('La homotecia es lo que hace el zoom, y también lo que explica la escala de un plano o de una ' +
    'maqueta. Tiene una consecuencia que arruina presupuestos: al ampliar un plano al doble, las ' +
    'superficies se multiplican por cuatro y los volúmenes por ocho. Quien encarga una maqueta al ' +
    'doble de tamaño y espera pagar el doble de material se lleva una sorpresa.');

  p.section('Practica');

  p.exercise({
    title: 'Aplica el movimiento',
    level: 'basico',
    gen: function (r) {
      var P = [r.pm(1, 8), r.pm(1, 8)];
      var t = r.int(0, 3);
      var v = [r.pm(1, 6), r.pm(1, 6)];
      var img = [[P[0] + v[0], P[1] + v[1]], [-P[0], P[1]], [P[0], -P[1]], [-P[0], -P[1]]][t];
      return { P: P, t: t, v: v, img: img };
    },
    ask: function (d) {
      var nom = ['la traslación de vector $(' + d.v + ')$', 'la simetría respecto al eje $Y$',
        'la simetría respecto al eje $X$', 'la simetría central de centro el origen'][d.t];
      return 'Halla la imagen del punto $P(' + d.P + ')$ mediante ' + nom + '.';
    },
    fields: [{ name: 'x', label: "x'", w: 'tiny' }, { name: 'y', label: "y'", w: 'tiny' }],
    sol: function (d) { return { x: d.img[0], y: d.img[1] }; },
    hint: function (d) {
      return ['Se suma el vector a cada coordenada.', 'Cambia de signo la $x$; la $y$ se queda igual.',
        'Cambia de signo la $y$; la $x$ se queda igual.', 'Cambian de signo las dos.'][d.t];
    },
    steps: function (d) {
      var reglas = ['$(x,y) \\mapsto (x+a, y+b)$', '$(x,y) \\mapsto (-x, y)$',
        '$(x,y) \\mapsto (x, -y)$', '$(x,y) \\mapsto (-x, -y)$'];
      return ['La regla es ' + reglas[d.t] + '.',
        'Sustituimos $P(' + d.P + ')$.',
        'Imagen: $(' + d.img + ')$.'];
    },
    answer: function (d) { return '$(' + d.img + ')$'; }
  });

  p.exercise({
    title: 'Giro alrededor del origen',
    level: 'medio',
    gen: function (r) {
      var P = [r.pm(1, 6), r.pm(1, 6)];
      var ang = r.pick([90, 180, 270]);
      var a = ang * Math.PI / 180;
      var img = [Math.round(P[0] * Math.cos(a) - P[1] * Math.sin(a)),
                 Math.round(P[0] * Math.sin(a) + P[1] * Math.cos(a))];
      return { P: P, ang: ang, img: img };
    },
    ask: function (d) {
      return 'Gira el punto $P(' + d.P + ')$ un ángulo de $' + d.ang +
        '^\\circ$ (sentido positivo) alrededor del origen.';
    },
    fields: [{ name: 'x', label: "x'", w: 'tiny' }, { name: 'y', label: "y'", w: 'tiny' }],
    sol: function (d) { return { x: d.img[0], y: d.img[1] }; },
    hint: function (d) {
      if (d.ang === 90) return 'Un giro de $90^\\circ$ manda $(x,y)$ a $(-y, x)$.';
      if (d.ang === 180) return 'Un giro de $180^\\circ$ es la simetría central: $(x,y) \\mapsto (-x,-y)$.';
      return 'Un giro de $270^\\circ$ manda $(x,y)$ a $(y, -x)$.';
    },
    steps: function (d) {
      return ['Fórmula del giro: $(x\\cos\\alpha - y\\operatorname{sen}\\alpha,\\ x\\operatorname{sen}\\alpha + y\\cos\\alpha)$.',
        'Para $\\alpha = ' + d.ang + '^\\circ$: $\\cos = ' + U.fmt(Math.cos(d.ang * Math.PI / 180), 0) +
        '$ y $\\operatorname{sen} = ' + U.fmt(Math.sin(d.ang * Math.PI / 180), 0) + '$.',
        'Sustituyendo: $(' + d.img + ')$.',
        'Comprobación: el módulo no cambia, sigue siendo $' + U.fmt(Math.hypot(d.P[0], d.P[1]), 4) + '$.'];
    },
    answer: function (d) { return '$(' + d.img + ')$'; }
  });

  p.exercise({
    title: 'Homotecia',
    level: 'medio',
    gen: function (r) {
      var P = [r.pm(1, 6), r.pm(1, 6)];
      var k = r.pick([2, 3, -2, 0.5, -1, 4]);
      return { P: P, k: k, img: [P[0] * k, P[1] * k] };
    },
    ask: function (d) {
      return 'Aplica al punto $P(' + d.P + ')$ una homotecia de centro el origen y razón $k = ' +
        U.fmt(d.k, 1) + '$.';
    },
    fields: [{ name: 'x', label: "x'", w: 'tiny' }, { name: 'y', label: "y'", w: 'tiny' }],
    sol: function (d) { return { x: d.img[0], y: d.img[1] }; },
    tol: 1e-6,
    hint: function () { return 'Se multiplican las dos coordenadas por $k$.'; },
    steps: function (d) {
      return ['$(x,y) \\mapsto (kx, ky)$ con $k = ' + U.fmt(d.k, 1) + '$.',
        '$(' + U.fmt(d.P[0] * d.k, 2) + ', ' + U.fmt(d.P[1] * d.k, 2) + ')$',
        'Las áreas quedan multiplicadas por $k^2 = ' + U.fmt(d.k * d.k, 2) + '$.',
        d.k < 0 ? 'Como $k$ es negativa, la imagen queda al otro lado del centro.' : ''].filter(function (x) { return x; });
    },
    answer: function (d) { return '$(' + U.fmt(d.img[0], 2) + ', ' + U.fmt(d.img[1], 2) + ')$'; }
  });

  p.exercise({
    title: 'Composición de movimientos',
    level: 'avanzado',
    gen: function (r) {
      var P = [r.pm(1, 6), r.pm(1, 6)];
      var v = [r.pm(1, 5), r.pm(1, 5)];
      var orden = r.bool();
      var img = orden
        ? [-(P[0] + v[0]), P[1] + v[1]]        // trasladar y luego simetría en Y
        : [-P[0] + v[0], P[1] + v[1]];         // simetría en Y y luego trasladar
      return { P: P, v: v, orden: orden, img: img };
    },
    ask: function (d) {
      return 'Al punto $P(' + d.P + ')$ se le aplican, <strong>en este orden</strong>, ' +
        (d.orden
          ? 'primero una traslación de vector $(' + d.v + ')$ y después una simetría respecto al eje $Y$'
          : 'primero una simetría respecto al eje $Y$ y después una traslación de vector $(' + d.v + ')$') +
        '. ¿Cuál es la imagen final?';
    },
    fields: [{ name: 'x', label: "x'", w: 'tiny' }, { name: 'y', label: "y'", w: 'tiny' }],
    sol: function (d) { return { x: d.img[0], y: d.img[1] }; },
    hint: function () { return 'Aplica un movimiento y con el resultado aplica el otro. El orden importa: la composición no es conmutativa.'; },
    steps: function (d) {
      if (d.orden) {
        var m = [d.P[0] + d.v[0], d.P[1] + d.v[1]];
        return ['Traslación: $(' + d.P + ') + (' + d.v + ') = (' + m + ')$.',
          'Simetría respecto al eje $Y$: cambia el signo de la $x$ → $(' + d.img + ')$.',
          'Si lo hubieras hecho al revés habrías obtenido $(' + [-d.P[0] + d.v[0], d.P[1] + d.v[1]] + ')$: ' +
          'el orden <strong>sí</strong> importa.'];
      }
      var m2 = [-d.P[0], d.P[1]];
      return ['Simetría respecto al eje $Y$: $(' + d.P + ') \\mapsto (' + m2 + ')$.',
        'Traslación: $(' + m2 + ') + (' + d.v + ') = (' + d.img + ')$.',
        'Si lo hubieras hecho al revés habrías obtenido $(' + [-(d.P[0] + d.v[0]), d.P[1] + d.v[1]] + ')$.'];
    },
    answer: function (d) { return '$(' + d.img + ')$'; }
  });

  p.keys([
    'Los movimientos conservan las distancias: traslación, giro, simetría axial y simetría central.',
    'Las simetrías axiales invierten la orientación; traslaciones y giros no.',
    'En coordenadas, cada movimiento es una fórmula sencilla; el giro es una matriz.',
    'Una homotecia de razón $k$ multiplica longitudes por $|k|$ y áreas por $k^2$: ya no es un movimiento.',
    'La composición de movimientos <strong>no es conmutativa</strong>: importa el orden.',
    'Klein: cada geometría se define por el grupo de transformaciones que admite.'
  ]);
});
