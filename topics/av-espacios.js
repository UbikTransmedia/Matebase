/* Tema: Espacios vectoriales y aplicaciones lineales */
Course.topic('av-espacios', function (p) {

  p.text('Ya sabes sumar vectores del plano y multiplicarlos por números. Ya sabes sumar polinomios y ' +
    'multiplicarlos por números. Ya sabes sumar matrices y multiplicarlas por números. Y en los tres ' +
    'casos las reglas son <strong>exactamente las mismas</strong>.');

  p.text('Cuando eso pasa, el matemático hace lo que mejor sabe hacer: olvidarse de qué son los objetos ' +
    'y quedarse solo con las reglas. Eso es un <strong>espacio vectorial</strong>.');

  p.note('Un espacio vectorial es un conjunto donde se puede <strong>sumar</strong> y ' +
    '<strong>multiplicar por escalares</strong>, cumpliendo las propiedades de siempre (asociativa, ' +
    'conmutativa, distributiva, elemento neutro, opuesto). Nada más. Los «vectores» pueden ser flechas, ' +
    'polinomios, matrices, funciones o sucesiones: el álgebra lineal vale para todos a la vez.',
    'ok', 'La definición completa cabe en tres líneas');

  p.table(['Espacio', 'Sus «vectores» son', 'Dimensión'],
    [['$\\mathbb{R}^2$, $\\mathbb{R}^3$', 'pares y ternas de números', '2, 3'],
     ['$\\mathbb{R}^n$', 'listas de $n$ números', '$n$'],
     ['$P_n$', 'polinomios de grado $\\le n$', '$n+1$'],
     ['$M_{2\\times2}$', 'matrices $2\\times2$', '4'],
     ['$C[0,1]$', 'funciones continuas', 'infinita']]);

  p.text('Ese último caso —espacios de <em>funciones</em>— parece exótico y es el que sostiene el ' +
    'análisis de Fourier: una serie de Fourier es literalmente escribir una función como combinación ' +
    'de los «vectores» $\\operatorname{sen}(nx)$ y $\\cos(nx)$, que resultan formar una base.');

  /* ---------------------------------------------------------------- */
  p.section('Independencia, base y dimensión');

  p.text('Una <strong>combinación lineal</strong> de $\\vec{v}_1, \\dots, \\vec{v}_k$ es cualquier ' +
    '$a_1\\vec{v}_1 + \\dots + a_k\\vec{v}_k$. El conjunto de todas ellas es el ' +
    '<strong>subespacio generado</strong>.');

  p.formula('\\lambda_1\\vec{v}_1 + \\dots + \\lambda_k\\vec{v}_k = \\vec{0} \\ \\Longrightarrow\\ \\lambda_1 = \\dots = \\lambda_k = 0',
    'condición de independencia lineal');

  p.text('En palabras: son <strong>independientes</strong> si la única forma de combinarlos para llegar ' +
    'a cero es no usar ninguno. Si son dependientes, alguno sobra: se puede escribir con los demás.');

  p.demo({
    title: 'Cuánto espacio generan dos vectores',
    intro: 'Arrastra los dos vectores. Mientras apunten en direcciones distintas, sus combinaciones llenan todo el plano. Alinéalos y verás cómo el espacio generado se derrumba a una recta.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 340,
        handles: {
          U: { x: 2, y: 1, label: 'v₁', color: 0, constrain: snap },
          V: { x: -1, y: 2, label: 'v₂', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V');
          var det = u.x * v.y - u.y * v.x;
          if (Math.abs(det) < 1e-9) {
            // dependientes: solo generan una recta
            if (Math.abs(u.x) > 1e-9 || Math.abs(u.y) > 1e-9) {
              g.param(function (t) { return t * u.x; }, function (t) { return t * u.y; },
                -10, 10, { color: 2, w: 7, alpha: .25 });
            }
          } else {
            // independientes: generan todo el plano
            var ctx = g.ctx;
            ctx.fillStyle = g.color(2); ctx.globalAlpha = 0.12;
            ctx.fillRect(0, 0, g.W, g.H);
            ctx.globalAlpha = 1;
            // rejilla de combinaciones enteras
            for (var i = -4; i <= 4; i++) {
              for (var j = -4; j <= 4; j++) {
                var P = [i * u.x + j * v.x, i * u.y + j * v.y];
                if (Math.abs(P[0]) < 6 && Math.abs(P[1]) < 4.5) {
                  g.point(P[0], P[1], { color: 2, r: 2.5, alpha: .8 });
                }
              }
            }
          }
          g.vec(0, 0, u.x, u.y, { color: 0, w: 3 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 3 });
          out.set('$\\vec{v}_1 = (' + u.x + ', ' + u.y + ')$, &nbsp; $\\vec{v}_2 = (' + v.x + ', ' + v.y + ')$<br>' +
            'Determinante: $' + u.x + '\\cdot' + v.y + ' - ' + u.y + '\\cdot' + v.x + ' = ' + det + '$<br>' +
            (Math.abs(det) < 1e-9
              ? '<strong style="color:var(--bad)">Dependientes</strong>: uno es múltiplo del otro, así que ' +
                'solo generan una <strong>recta</strong>. Dimensión 1.'
              : '<strong style="color:var(--ok)">Independientes</strong>: son una <strong>base</strong> de ' +
                '$\\mathbb{R}^2$. Todo punto del plano es combinación suya, y de una única manera. Dimensión 2.'));
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
      W.hint(host, 'Pon los dos vectores en la misma dirección, por ejemplo (2,1) y (4,2).');
    }
  });

  p.text('Una <strong>base</strong> es un conjunto de vectores independientes que genera todo el ' +
    'espacio. Su número de elementos es la <strong>dimensión</strong>, y no depende de qué base elijas: ' +
    'todas tienen el mismo tamaño.');

  p.note('La gracia de una base es que cada vector se escribe con ella de <strong>una sola ' +
    'manera</strong>. Esas cifras son sus <em>coordenadas</em>. Cambiar de base es cambiar el sistema ' +
    'de referencia sin tocar los objetos: es lo que haremos al diagonalizar.', null);

  /* ---------------------------------------------------------------- */
  p.section('Aplicaciones lineales: qué es de verdad una matriz');

  p.text('Una aplicación $f: V \\to W$ es <strong>lineal</strong> si respeta las dos operaciones:');

  p.formulas([
    'f(\\vec{u}+\\vec{v}) = f(\\vec{u}) + f(\\vec{v})',
    'f(\\lambda\\vec{v}) = \\lambda\\,f(\\vec{v})'
  ]);

  p.text('Traducido a imagen mental: una aplicación lineal <strong>mantiene el origen fijo, transforma ' +
    'rectas en rectas y conserva el paralelismo</strong>. Puede estirar, comprimir, girar, torcer y ' +
    'aplastar, pero nunca curvar.');

  p.note('Y aquí está la revelación del tema: <strong>toda aplicación lineal queda determinada por lo ' +
    'que le hace a una base</strong>. Si sabes dónde van $\\vec{e}_1$ y $\\vec{e}_2$, ya sabes dónde va ' +
    'todo lo demás. Y esas imágenes, puestas por columnas, <em>son</em> la matriz. Eso es una matriz: ' +
    'no una tabla de números, sino el destino de los vectores de la base.', 'ok', 'Qué es una matriz');

  p.formula('A = \\begin{pmatrix} \\uparrow & \\uparrow \\\\ f(\\vec{e}_1) & f(\\vec{e}_2) \\\\ \\downarrow & \\downarrow \\end{pmatrix}');

  p.demo({
    title: 'Deformar el plano',
    intro: 'La cuadrícula gris es el plano de partida; la de color, su imagen. Fíjate en las dos primeras columnas de la matriz: son exactamente a dónde van los vectores (1,0) y (0,1).',
    build: function (host, d) {
      var M = [[1, 0], [0, 1]];
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -5, xmax: 5, ymin: -4, ymax: 4, height: 340,
        grid: false,
        draw: function (g) {
          function T(x, y) { return [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y]; }
          // cuadricula original
          for (var i = -5; i <= 5; i++) {
            g.seg(i, -5, i, 5, { color: 'axis', w: 0.8, alpha: .25 });
            g.seg(-5, i, 5, i, { color: 'axis', w: 0.8, alpha: .25 });
          }
          // cuadricula transformada
          for (var k = -5; k <= 5; k++) {
            var A = T(k, -5), B = T(k, 5);
            g.seg(A[0], A[1], B[0], B[1], { color: 0, w: 1.2, alpha: .5 });
            var C = T(-5, k), D2 = T(5, k);
            g.seg(C[0], C[1], D2[0], D2[1], { color: 0, w: 1.2, alpha: .5 });
          }
          // cuadrado unidad y su imagen
          g.poly([[0, 0], [1, 0], [1, 1], [0, 1]], { color: 'axis', fill: false, w: 2 });
          var q = [[0, 0], T(1, 0), T(1, 1), T(0, 1)];
          g.poly(q, { color: 2, fill: 2, fillAlpha: .3, w: 2.4 });
          var e1 = T(1, 0), e2 = T(0, 1);
          g.vec(0, 0, e1[0], e1[1], { color: 1, w: 3, label: 'f(e₁)', labelDy: -12 });
          g.vec(0, 0, e2[0], e2[1], { color: 3, w: 3, label: 'f(e₂)', labelDy: -12 });
        }
      });
      function paint() {
        var det = ML.det2(M);
        out.set('$A = ' + ML.matTex(M) + '$ &nbsp;·&nbsp; $\\det A = ' + U.fmt(det, 3) + '$<br>' +
          '$f(\\vec{e}_1) = (' + U.fmt(M[0][0], 2) + ', ' + U.fmt(M[1][0], 2) + ')$ — la <strong>primera columna</strong><br>' +
          '$f(\\vec{e}_2) = (' + U.fmt(M[0][1], 2) + ', ' + U.fmt(M[1][1], 2) + ')$ — la <strong>segunda columna</strong><br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (Math.abs(det) < 1e-9
            ? '<strong style="color:var(--bad)">Determinante cero: el plano se aplasta sobre una recta.</strong> ' +
              'La aplicación pierde una dimensión, no tiene inversa y su núcleo no es solo el origen.'
            : 'El área del cuadrado unidad pasa a valer $|\\det A| = ' + U.fmt(Math.abs(det), 3) + '$. ' +
              (det < 0 ? 'El determinante es negativo: además se ha dado la vuelta al plano.' : '')) +
          '</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'identidad', value: [[1, 0], [0, 1]] },
        { label: 'estirar', value: [[2, 0], [0, 0.5]] },
        { label: 'girar 45°', value: [[0.707, -0.707], [0.707, 0.707]] },
        { label: 'cizalla', value: [[1, 1], [0, 1]] },
        { label: 'reflejar', value: [[1, 0], [0, -1]] },
        { label: 'aplastar', value: [[1, 2], [2, 4]] }
      ], { toggle: false, on: function (v) { M = v; paint(); } });
      var row = W.row(host);
      W.slider(row, { label: 'a₁₁', min: -3, max: 3, step: 0.25, value: 1, dec: 2, on: function (v) { M[0][0] = v; paint(); } });
      W.slider(row, { label: 'a₁₂', min: -3, max: 3, step: 0.25, value: 0, dec: 2, on: function (v) { M[0][1] = v; paint(); } });
      var row2 = W.row(host);
      W.slider(row2, { label: 'a₂₁', min: -3, max: 3, step: 0.25, value: 0, dec: 2, on: function (v) { M[1][0] = v; paint(); } });
      W.slider(row2, { label: 'a₂₂', min: -3, max: 3, step: 0.25, value: 1, dec: 2, on: function (v) { M[1][1] = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Que una matriz «sea» una transformación es lo que hace funcionar a los gráficos por ordenador: ' +
    'girar un modelo, escalarlo o proyectarlo en la pantalla son matrices, y encadenar movimientos ' +
    'es multiplicarlas. Pero el ejemplo que más te afecta es otro: comprimir una imagen o una ' +
    'canción consiste en cambiar de base a una en la que casi todas las coordenadas salen ' +
    'minúsculas, tirar esas y quedarse con unas pocas. Un JPEG es un cambio de base con recorte.');

  p.section('Núcleo, imagen y el teorema del rango');
  p.text('De toda aplicación lineal interesan dos conjuntos que responden a dos preguntas muy concretas: ' +
    '<em>¿qué se aplasta hasta desaparecer?</em> y <em>¿hasta dónde llega lo que sale?</em>. El ' +
    'primero es el núcleo, el segundo la imagen, y entre ambos hay una relación de conservación que ' +
    'es uno de los resultados más elegantes del álgebra lineal.');


  p.list([
    'El <strong>núcleo</strong> $\\operatorname{Ker} f$ son los vectores que van a parar al cero: lo que la aplicación destruye.',
    'La <strong>imagen</strong> $\\operatorname{Im} f$ es todo lo que se alcanza: el subespacio que queda después de aplicar $f$.'
  ]);

  p.formula('\\dim(\\operatorname{Ker} f) + \\dim(\\operatorname{Im} f) = \\dim V',
    'teorema del rango (o de las dimensiones)');

  p.text('Es una ley de conservación: lo que se aplasta más lo que sobrevive es siempre la dimensión de ' +
    'partida. Si una aplicación de $\\mathbb{R}^3$ tiene imagen de dimensión 2, entonces ha aplastado ' +
    'exactamente una dimensión, y su núcleo es una recta.');

  p.note('Y conecta con todo lo anterior: $\\dim(\\operatorname{Im} f)$ es el <strong>rango</strong> de ' +
    'la matriz, el mismo que salía al escalonar por Gauss. Que un sistema sea compatible determinado ' +
    'es, en este lenguaje, que el núcleo sea solo el cero. Rouché-Frobenius era esto disfrazado.',
    'ok', 'Todo encaja');

  /* ================= EJERCICIOS ================= */
  p.util('El núcleo es «lo que se pierde por el camino». Si una transformación tiene núcleo no trivial, ' +
    'distintos datos de entrada acaban dando la misma salida y ya no se puede volver atrás: eso es ' +
    'exactamente lo que ocurre al reducir la resolución de una foto. El teorema del rango pone ' +
    'números a ese balance —lo que conservas más lo que pierdes es siempre lo que tenías—, y es la ' +
    'razón matemática de que no exista un compresor que reduzca cualquier archivo sin perder nada.');

  p.section('Practica');

  p.exercise({
    title: '¿Independientes o dependientes?',
    level: 'basico',
    gen: function (r) {
      var u = [r.nz(-5, 5), r.nz(-5, 5)];
      var dep = r.bool(0.4);
      var k = r.nz(-3, 3);
      var v = dep ? [u[0] * k, u[1] * k] : [r.nz(-5, 5), r.nz(-5, 5)];
      var det = u[0] * v[1] - u[1] * v[0];
      return { u: u, v: v, det: det, indep: Math.abs(det) > 1e-9 };
    },
    ask: function (d) {
      return '¿Son linealmente independientes $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.indep ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === d.indep;
    },
    hint: function () { return 'En el plano, dos vectores son independientes si el determinante que forman no es cero.'; },
    steps: function (d) {
      return ['Montamos el determinante con los dos vectores: $\\begin{vmatrix}' + d.u[0] + ' & ' + d.u[1] +
        ' \\\\ ' + d.v[0] + ' & ' + d.v[1] + '\\end{vmatrix} = ' + d.det + '$.',
        d.indep ? 'No es cero: son <strong>independientes</strong> y forman una base de $\\mathbb{R}^2$.'
          : 'Es cero: son <strong>dependientes</strong>, uno es múltiplo del otro y solo generan una recta.',
        'Geométricamente, el determinante es el área del paralelogramo que forman: cero significa aplastado.'];
    },
    answer: function (d) { return d.indep ? 'Sí, independientes.' : 'No, dependientes.'; }
  });

  p.exercise({
    title: 'Matriz de una aplicación lineal',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(0, 5), b = r.pm(0, 5), c = r.pm(0, 5), e = r.pm(0, 5);
      var pos = r.int(0, 3);
      return { m: [[a, b], [c, e]], pos: pos };
    },
    ask: function (d) {
      return 'Una aplicación lineal cumple $f(1,0) = (' + d.m[0][0] + ', ' + d.m[1][0] + ')$ y ' +
        '$f(0,1) = (' + d.m[0][1] + ', ' + d.m[1][1] + ')$. Escribe los cuatro elementos de su matriz ' +
        'asociada $A$ (por filas).';
    },
    fields: [
      { name: 'a', label: '$a_{11}$', w: 'tiny' }, { name: 'b', label: '$a_{12}$', w: 'tiny' },
      { name: 'c', label: '$a_{21}$', w: 'tiny' }, { name: 'd', label: '$a_{22}$', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.m[0][0], b: d.m[0][1], c: d.m[1][0], d: d.m[1][1] }; },
    hint: function () { return 'Las imágenes de la base van en <strong>columnas</strong>, no en filas.'; },
    steps: function (d) {
      return ['La imagen de $\\vec{e}_1 = (1,0)$ es la <strong>primera columna</strong>: $(' + d.m[0][0] + ', ' + d.m[1][0] + ')$.',
        'La imagen de $\\vec{e}_2 = (0,1)$ es la <strong>segunda columna</strong>: $(' + d.m[0][1] + ', ' + d.m[1][1] + ')$.',
        '$A = ' + ML.matTex(d.m) + '$',
        'Comprobación: $A\\cdot(1,0)^T$ devuelve efectivamente la primera columna.'];
    },
    answer: function (d) { return '$A = ' + ML.matTex(d.m) + '$'; }
  });

  p.exercise({
    title: 'Imagen de un vector',
    level: 'basico',
    gen: function (r) {
      var m = [[r.pm(0, 5), r.pm(0, 5)], [r.pm(0, 5), r.pm(0, 5)]];
      var v = [r.nz(-6, 6), r.nz(-6, 6)];
      return { m: m, v: v, im: [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]] };
    },
    ask: function (d) {
      return 'Si la aplicación lineal tiene matriz $A = ' + ML.matTex(d.m) + '$, halla la imagen del ' +
        'vector $\\vec{v} = (' + d.v + ')$.';
    },
    fields: [{ name: 'x', label: '1.ª componente', w: 'tiny' }, { name: 'y', label: '2.ª componente', w: 'tiny' }],
    sol: function (d) { return { x: d.im[0], y: d.im[1] }; },
    tol: 1e-6,
    hint: function () { return 'Es multiplicar la matriz por el vector: fila por columna.'; },
    steps: function (d) {
      return ['$f(\\vec{v}) = A\\vec{v}$',
        'Primera componente: $' + d.m[0][0] + '\\cdot(' + d.v[0] + ') + ' + d.m[0][1] + '\\cdot(' + d.v[1] + ') = ' + d.im[0] + '$',
        'Segunda componente: $' + d.m[1][0] + '\\cdot(' + d.v[0] + ') + ' + d.m[1][1] + '\\cdot(' + d.v[1] + ') = ' + d.im[1] + '$',
        'Otra lectura: $\\vec{v} = ' + d.v[0] + '\\vec{e}_1 + ' + d.v[1] + '\\vec{e}_2$, así que su imagen es esa misma combinación de las columnas de $A$.'];
    },
    answer: function (d) { return '$(' + d.im + ')$'; }
  });

  p.exercise({
    title: 'Teorema del rango',
    level: 'avanzado',
    gen: function (r) {
      var dimV = r.int(2, 5);
      var rango = r.int(0, dimV);
      return { dimV: dimV, rango: rango, ker: dimV - rango };
    },
    ask: function (d) {
      return 'Una aplicación lineal $f: \\mathbb{R}^{' + d.dimV + '} \\to \\mathbb{R}^{5}$ tiene una ' +
        'imagen de dimensión $' + d.rango + '$. ¿Cuál es la dimensión de su núcleo?';
    },
    fields: [{ name: 'k', label: 'dim(Ker f)', w: 'tiny' }],
    sol: function (d) { return { k: d.ker }; },
    hint: function (d) { return '$\\dim(\\operatorname{Ker} f) + \\dim(\\operatorname{Im} f) = \\dim V$, y aquí $\\dim V = ' + d.dimV + '$.'; },
    steps: function (d) {
      return ['El teorema del rango dice $\\dim(\\operatorname{Ker}) + \\dim(\\operatorname{Im}) = \\dim V$.',
        'Aquí el espacio de partida es $\\mathbb{R}^{' + d.dimV + '}$, así que $\\dim V = ' + d.dimV + '$.',
        '$\\dim(\\operatorname{Ker}) = ' + d.dimV + ' - ' + d.rango + ' = ' + d.ker + '$',
        d.ker === 0 ? 'Núcleo nulo: la aplicación es <strong>inyectiva</strong>, no destruye nada.'
          : 'La aplicación aplasta un subespacio de dimensión ' + d.ker + ' sobre el origen, así que no es inyectiva.',
        'Fíjate en que el espacio de llegada ($\\mathbb{R}^5$) no interviene en la cuenta: solo el de partida.'];
    },
    answer: function (d) { return 'dim(Ker f) = ' + d.ker; }
  });

  p.keys([
    'Espacio vectorial = conjunto donde se puede sumar y multiplicar por escalares. Los «vectores» pueden ser flechas, polinomios o funciones.',
    'Independientes ⟺ la única combinación que da cero es la trivial.',
    'Base = independientes + generan. La dimensión no depende de la base elegida.',
    'Aplicación lineal: conserva sumas y múltiplos. Mantiene el origen, lleva rectas a rectas y conserva el paralelismo.',
    '<strong>Una matriz es el destino de los vectores de la base, puestos en columnas.</strong>',
    '$\\dim(\\operatorname{Ker}) + \\dim(\\operatorname{Im}) = \\dim V$: lo aplastado más lo que sobrevive.',
    'Determinante cero ⟺ la transformación aplasta dimensiones ⟺ no hay inversa.'
  ]);
});
