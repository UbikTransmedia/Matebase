/* Tema: Geometría en el espacio */
Course.topic('ge-espacio', function (p) {

  p.text('Todo lo del plano se extiende al espacio añadiendo una coordenada. Un punto es ' +
    '$(x,y,z)$, un vector tiene tres componentes y el módulo sigue siendo Pitágoras, ahora aplicado ' +
    'dos veces.');

  p.formula('|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}');

  p.text('El producto escalar también funciona igual, sumando un término más, y sigue valiendo cero ' +
    'exactamente cuando los vectores son perpendiculares.');

  p.formula('\\vec{u}\\cdot\\vec{v} = u_1v_1+u_2v_2+u_3v_3 = |\\vec{u}||\\vec{v}|\\cos\\alpha');

  /* ---------------------------------------------------------------- */
  p.section('El producto vectorial: una operación nueva');

  p.text('En el espacio aparece algo que en el plano no tenía sentido: una operación que toma dos ' +
    'vectores y devuelve <strong>otro vector</strong>, perpendicular a los dos.');

  p.formula('\\vec{u}\\times\\vec{v} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}',
    'se calcula como un determinante');

  p.formula('\\vec{u}\\times\\vec{v} = (u_2v_3 - u_3v_2,\\ u_3v_1 - u_1v_3,\\ u_1v_2 - u_2v_1)', 'desarrollado');

  p.list([
    'Es <strong>perpendicular</strong> a $\\vec{u}$ y a $\\vec{v}$ a la vez.',
    'Su <strong>módulo</strong> es el área del paralelogramo que forman: $|\\vec{u}\\times\\vec{v}| = |\\vec u||\\vec v|\\operatorname{sen}\\alpha$.',
    'Su <strong>sentido</strong> lo da la regla de la mano derecha.',
    'No es conmutativo: $\\vec{u}\\times\\vec{v} = -\\,\\vec{v}\\times\\vec{u}$.'
  ]);

  p.note('Vale la pena tenerlo claro: el producto <em>escalar</em> devuelve un número y mide ' +
    'alineación (es cero si son perpendiculares). El producto <em>vectorial</em> devuelve un vector y ' +
    'mide perpendicularidad (es cero si son paralelos). Son complementarios.', 'ok');

  p.sub('Producto mixto y volumen');

  p.formula('[\\vec{u},\\vec{v},\\vec{w}] = \\vec{u}\\cdot(\\vec{v}\\times\\vec{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3\\end{vmatrix}');

  p.text('Su valor absoluto es el <strong>volumen</strong> del paralelepípedo que forman los tres ' +
    'vectores. Y si vale cero, los tres son coplanarios: están en el mismo plano.');

  p.demo({
    title: 'El determinante como volumen',
    intro: 'Cambia los tres vectores y observa el volumen. Cuando el determinante se anula, el paralelepípedo se aplasta: los tres vectores caben en un plano.',
    build: function (host, d) {
      var u = [2, 0, 0], v = [0, 3, 0], w = [1, 1, 2];
      var out = W.readout(host, '');
      function paint() {
        var det = ML.det3([u, v, w]);
        var cruz = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        out.set('$\\vec{u} = (' + u + ')$, &nbsp; $\\vec{v} = (' + v + ')$, &nbsp; $\\vec{w} = (' + w + ')$<br>' +
          '$\\vec{u}\\times\\vec{v} = (' + cruz + ')$ &nbsp;·&nbsp; área del paralelogramo: $' +
          U.fmt(Math.hypot(cruz[0], cruz[1], cruz[2]), 4) + '$<br>' +
          'Producto mixto $= ' + det + '$ &nbsp;→&nbsp; volumen $= ' + Math.abs(det) + '$' +
          (det === 0 ? '<br><strong style="color:var(--bad)">Volumen cero: los tres vectores son coplanarios.</strong>' : ''));
      }
      ['u', 'v', 'w'].forEach(function (nom, k) {
        var arr = [u, v, w][k];
        var fila = W.row(host);
        [0, 1, 2].forEach(function (i) {
          W.slider(fila, {
            label: nom + '<sub>' + (i + 1) + '</sub>', min: -4, max: 4, step: 1, value: arr[i], dec: 0,
            on: function (val) { arr[i] = val; paint(); }
          });
        });
      });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El producto vectorial da un vector perpendicular a otros dos, y esa es exactamente la pregunta ' +
    'que se hace cualquier motor gráfico para saber hacia dónde «mira» una superficie: sin esa ' +
    'normal no se puede calcular ni la iluminación ni si una cara se ve o queda de espaldas. En ' +
    'física es el momento de una fuerza —por qué una llave larga afloja mejor un tornillo— y la ' +
    'fuerza que sufre una carga en un campo magnético, que es lo que hace girar cualquier motor ' +
    'eléctrico.');

  p.section('El plano');

  p.text('Un plano queda determinado por un punto y <strong>dos</strong> vectores directores (o, mucho ' +
    'más cómodo, por un punto y un vector <strong>normal</strong> perpendicular a él).');

  p.formulas([
    '(x,y,z) = P + s\\,\\vec{u} + t\\,\\vec{v} \\quad\\text{(vectorial)}',
    'Ax + By + Cz + D = 0 \\quad\\text{(general)}'
  ]);

  p.note('Igual que en el plano la recta $Ax+By+C=0$ tenía normal $(A,B)$, en el espacio el plano ' +
    '$Ax+By+Cz+D=0$ tiene como <strong>vector normal</strong> $\\vec{n} = (A,B,C)$. Es el mismo patrón, ' +
    'una dimensión más arriba.', 'ok');

  p.sub('Posiciones relativas');

  p.table(['Elementos', 'Posibilidades'],
    [['Dos rectas', 'se cortan · paralelas · coincidentes · <strong>se cruzan</strong> (esto es nuevo del espacio)'],
     ['Recta y plano', 'la recta corta al plano · es paralela · está contenida'],
     ['Dos planos', 'se cortan en una recta · paralelos · coincidentes']]);

  p.text('Que dos rectas puedan <strong>cruzarse</strong> sin cortarse ni ser paralelas es la novedad ' +
    'del espacio, y no tiene equivalente en el plano. Piensa en dos carreteras a distinta altura.');

  p.sub('Distancias');

  p.formula('d(P, \\pi) = \\frac{|A p_1 + B p_2 + C p_3 + D|}{\\sqrt{A^2+B^2+C^2}}',
    'distancia de un punto a un plano');

  /* ================= EJERCICIOS ================= */
  p.util('La ecuación del plano es la base de la impresión 3D y del diseño asistido por ordenador: una ' +
    'pieza se guarda como una malla de miles de caras planas, cada una con su ecuación, y la ' +
    'impresora la corta en capas resolviendo intersecciones de planos. Los sistemas de escaneo láser ' +
    'hacen lo contrario: ajustan planos a nubes de puntos para reconstruir una habitación o un ' +
    'edificio entero.');

  p.section('Practica');

  p.exercise({
    title: 'Producto vectorial',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(0, 5), r.pm(0, 5), r.pm(0, 5)];
      var v = [r.pm(0, 5), r.pm(0, 5), r.pm(0, 5)];
      var c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      if (c[0] === 0 && c[1] === 0 && c[2] === 0) return null;
      return { u: u, v: v, c: c };
    },
    ask: function (d) {
      return 'Calcula $\\vec{u}\\times\\vec{v}$ siendo $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$.';
    },
    fields: [
      { name: 'a', label: '1.ª componente', w: 'tiny' },
      { name: 'b', label: '2.ª componente', w: 'tiny' },
      { name: 'c', label: '3.ª componente', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.c[0], b: d.c[1], c: d.c[2] }; },
    hint: function () { return 'Cada componente es un determinante 2×2 tapando la columna correspondiente. Ojo: la segunda cambia de signo.'; },
    steps: function (d) {
      return ['Primera componente: $u_2v_3 - u_3v_2 = ' + d.u[1] + '\\cdot(' + d.v[2] + ') - (' + d.u[2] + ')\\cdot(' + d.v[1] + ') = ' + d.c[0] + '$.',
        'Segunda: $u_3v_1 - u_1v_3 = ' + d.u[2] + '\\cdot(' + d.v[0] + ') - (' + d.u[0] + ')\\cdot(' + d.v[2] + ') = ' + d.c[1] + '$.',
        'Tercera: $u_1v_2 - u_2v_1 = ' + d.u[0] + '\\cdot(' + d.v[1] + ') - (' + d.u[1] + ')\\cdot(' + d.v[0] + ') = ' + d.c[2] + '$.',
        'Comprobación: $\\vec{u}\\cdot(\\vec{u}\\times\\vec{v}) = ' +
        (d.u[0] * d.c[0] + d.u[1] * d.c[1] + d.u[2] * d.c[2]) + '$, que debe ser cero ✓'];
    },
    answer: function (d) { return '$(' + d.c + ')$'; }
  });

  p.exercise({
    title: 'Ecuación del plano por un punto y un normal',
    level: 'medio',
    gen: function (r) {
      var n = [r.nz(-5, 5), r.nz(-5, 5), r.nz(-5, 5)];
      var P = [r.pm(0, 6), r.pm(0, 6), r.pm(0, 6)];
      return { n: n, P: P, D: -(n[0] * P[0] + n[1] * P[1] + n[2] * P[2]) };
    },
    ask: function (d) {
      return 'Halla la ecuación general del plano que pasa por $P(' + d.P + ')$ y tiene como vector ' +
        'normal $\\vec{n} = (' + d.n + ')$. ¿Cuánto vale $D$?';
    },
    fields: [{ name: 'D', label: 'D', w: 'tiny' }],
    sol: function (d) { return { D: d.D }; },
    hint: function () { return 'El plano es $Ax+By+Cz+D=0$ con $(A,B,C) = \\vec{n}$. Sustituye el punto para despejar $D$.'; },
    steps: function (d) {
      return ['Los coeficientes salen directamente del normal: $' + d.n[0] + 'x + ' + d.n[1] + 'y + ' + d.n[2] + 'z + D = 0$.',
        'Obligamos a que pase por $P$: $' + d.n[0] + '\\cdot(' + d.P[0] + ') + ' + d.n[1] + '\\cdot(' + d.P[1] +
        ') + ' + d.n[2] + '\\cdot(' + d.P[2] + ') + D = 0$.',
        '$' + (-d.D) + ' + D = 0 \\Rightarrow D = ' + d.D + '$'];
    },
    answer: function (d) {
      return '$' + ML.termTex(d.n[0], 'x', 1, true) + ML.termTex(d.n[1], 'y', 1, false) +
        ML.termTex(d.n[2], 'z', 1, false) + ML.termTex(d.D, '', 0, false) + ' = 0$';
    }
  });

  p.exercise({
    title: 'Volumen del paralelepípedo',
    level: 'avanzado',
    gen: function (r) {
      var m = [];
      for (var i = 0; i < 3; i++) m.push([r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)]);
      return { m: m, det: ML.det3(m), vol: Math.abs(ML.det3(m)) };
    },
    ask: function (d) {
      return 'Calcula el volumen del paralelepípedo determinado por $\\vec{u} = (' + d.m[0] +
        ')$, $\\vec{v} = (' + d.m[1] + ')$ y $\\vec{w} = (' + d.m[2] + ')$.';
    },
    fields: [{ name: 'v', label: 'Volumen', w: 'tiny' }],
    sol: function (d) { return { v: d.vol }; },
    hint: function () { return 'Volumen = valor absoluto del producto mixto, que es el determinante de la matriz con los tres vectores.'; },
    steps: function (d) {
      return ['Se monta el determinante con los tres vectores por filas.',
        'Desarrollando por Sarrus da $' + d.det + '$.',
        'El volumen es su valor absoluto: $|' + d.det + '| = ' + d.vol + '$.',
        d.vol === 0 ? 'Volumen cero: los tres vectores son <strong>coplanarios</strong>.' : ''].filter(function (x) { return x; });
    },
    answer: function (d) { return String(d.vol); }
  });

  p.exercise({
    title: 'Distancia de un punto a un plano',
    level: 'avanzado',
    gen: function (r) {
      var A = r.nz(-4, 4), B = r.nz(-4, 4), C = r.nz(-4, 4), D = r.pm(0, 9);
      var P = [r.pm(0, 6), r.pm(0, 6), r.pm(0, 6)];
      var dist = Math.abs(A * P[0] + B * P[1] + C * P[2] + D) / Math.sqrt(A * A + B * B + C * C);
      return { A: A, B: B, C: C, D: D, P: P, dist: dist };
    },
    ask: function (d) {
      return 'Calcula la distancia del punto $P(' + d.P + ')$ al plano $' +
        ML.termTex(d.A, 'x', 1, true) + ML.termTex(d.B, 'y', 1, false) + ML.termTex(d.C, 'z', 1, false) +
        ML.termTex(d.D, '', 0, false) + ' = 0$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Distancia', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.dist, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Misma fórmula que en el plano, con un término más: $\\frac{|Ap_1+Bp_2+Cp_3+D|}{\\sqrt{A^2+B^2+C^2}}$.'; },
    steps: function (d) {
      var num = d.A * d.P[0] + d.B * d.P[1] + d.C * d.P[2] + d.D;
      var den = Math.sqrt(d.A * d.A + d.B * d.B + d.C * d.C);
      return ['Numerador: $|' + num + '| = ' + Math.abs(num) + '$.',
        'Denominador: $\\sqrt{' + (d.A * d.A + d.B * d.B + d.C * d.C) + '} = ' + U.fmt(den, 4) + '$.',
        '$d = \\dfrac{' + Math.abs(num) + '}{' + U.fmt(den, 4) + '} = ' + U.fmt(d.dist, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.dist, 4); }
  });

  p.keys([
    'En el espacio todo se extiende con una coordenada más; el producto escalar sigue igual.',
    'El producto vectorial $\\vec u\\times\\vec v$ da un vector <strong>perpendicular</strong> a los dos, y su módulo es el área del paralelogramo.',
    'El producto mixto es un determinante $3\\times3$ y su valor absoluto es el <strong>volumen</strong>.',
    'Producto mixto cero ⟺ los tres vectores son coplanarios.',
    'Plano $Ax+By+Cz+D=0$: el vector $(A,B,C)$ es su normal.',
    'Dos rectas del espacio pueden <strong>cruzarse</strong> sin cortarse: eso no pasa en el plano.'
  ]);
});
