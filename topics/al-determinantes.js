/* Tema: Determinantes: propiedades, adjuntos y rango */
Course.topic('al-determinantes', function (p) {

  /* utilidades del tema */
  function det2(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
  function menor(M, i, j) {
    return M.filter(function (_, f) { return f !== i; }).map(function (fila) {
      return fila.filter(function (_, c) { return c !== j; });
    });
  }
  function det(M) {
    if (M.length === 1) return M[0][0];
    if (M.length === 2) return det2(M);
    var s = 0;
    for (var j = 0; j < M.length; j++) {
      if (M[0][j] === 0) continue;
      s += (j % 2 ? -1 : 1) * M[0][j] * det(menor(M, 0, j));
    }
    return s;
  }
  function rango(M) {
    var A = M.map(function (f) { return f.slice(); });
    var filas = A.length, cols = A[0].length, r = 0;
    for (var c = 0; c < cols && r < filas; c++) {
      var piv = r;
      for (var i = r + 1; i < filas; i++) if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i;
      if (Math.abs(A[piv][c]) < 1e-9) continue;
      var t = A[r]; A[r] = A[piv]; A[piv] = t;
      for (var k = r + 1; k < filas; k++) {
        var f = A[k][c] / A[r][c];
        for (var j = c; j < cols; j++) A[k][j] -= f * A[r][j];
      }
      r++;
    }
    return r;
  }
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function mt(M, d) { return ML.matTex(M, d || 'vmatrix'); }

  p.text('En el tema de [[al-matrices|matrices]] el determinante apareció como una cuenta: $ad - bc$ ' +
    'para las de orden 2 y la regla de Sarrus para las de orden 3. Aquí se convierte en una ' +
    'herramienta. Primero, sus <strong>propiedades</strong>, que permiten calcular sin hacer todas las ' +
    'cuentas y adivinar el resultado de un vistazo. Después, el <strong>desarrollo por adjuntos</strong>, ' +
    'que sirve para matrices de cualquier tamaño. Y al final, el <strong>rango</strong>, que es lo que ' +
    'de verdad se usa para discutir sistemas y posiciones de rectas y planos.');

  /* ---------------------------------------------------------------- */
  p.section('Las propiedades que ahorran cuentas');

  p.text('Todas salen de la misma fuente: el determinante es un <strong>volumen con signo</strong>. ' +
    'Si se tiene eso presente, ninguna hay que memorizarla a ciegas.');

  p.list([
    '$\\det(A^t) = \\det A$. Todo lo que se diga de las filas vale igual para las columnas.',
    'Si se <strong>intercambian dos filas</strong>, el determinante cambia de signo (la orientación se invierte).',
    'Si se <strong>multiplica una fila</strong> por $k$, el determinante queda multiplicado por $k$ (se estira una arista).',
    'Si dos filas son <strong>iguales o proporcionales</strong>, o una es de ceros, el determinante vale 0 (la caja está aplastada).',
    'Si a una fila se le <strong>suma un múltiplo de otra</strong>, el determinante no cambia. Es la propiedad que permite hacer ceros antes de calcular.',
    '$\\det(A\\cdot B) = \\det A \\cdot \\det B$ y, si existe la inversa, $\\det(A^{-1}) = \\dfrac{1}{\\det A}$.'
  ]);

  p.formulas([
    '\\det(k\\,A) = k^n \\det A \\quad (A \\text{ de orden } n)',
    '\\det(A + B) \\ne \\det A + \\det B \\quad \\text{en general}'
  ], 'las dos trampas del tema',
    'La primera se lee <em>«el determinante de ka por a es ka elevado a ene por el determinante de ' +
      'a»</em>. Multiplicar una matriz por $k$ multiplica <strong>cada una de sus $n$ filas</strong> por ' +
      '$k$, y cada fila aporta un factor $k$. Para una matriz 3×3, $\\det(2A) = 8\\det A$, no ' +
      '$2\\det A$.<br><br>La segunda es un aviso: el determinante no se lleva bien con la suma. Con el ' +
      'producto sí; con la suma no hay fórmula.');

  p.demo({
    title: 'Operaciones de fila y lo que le pasa al determinante',
    intro: 'Aplica operaciones a la matriz y mira cómo cambia el determinante. Cada botón es una propiedad: fíjate en cuáles lo dejan igual, cuáles le cambian el signo y cuáles lo multiplican.',
    build: function (host) {
      var orig = [[2, 1, 3], [1, 0, 2], [4, 1, 1]];
      var M, nota;
      var caja = U.el('div', { style: { textAlign: 'center', overflowX: 'auto' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function reset() { M = orig.map(function (f) { return f.slice(); }); nota = 'Matriz de partida.'; pinta(null); }
      function pinta(antes) {
        var d = det(M);
        caja.innerHTML = MathX.display('\\det M = ' + mt(M) + ' = ' + d);
        out.set((antes === null ? '' : 'Antes: $' + antes + '$ &nbsp;→&nbsp; ahora: $' + d + '$<br>') + nota);
      }
      function op(fn, texto) { var a = det(M); fn(); nota = texto; pinta(a); }
      W.buttons(host, [
        { t: 'Intercambiar F1 y F2', on: function () { op(function () { var t = M[0]; M[0] = M[1]; M[1] = t; }, 'Intercambiar dos filas <strong>cambia el signo</strong>.'); } },
        { t: 'F1 × 2', on: function () { op(function () { M[0] = M[0].map(function (x) { return 2 * x; }); }, 'Multiplicar una fila por 2 <strong>multiplica por 2</strong> el determinante.'); } },
        { t: 'F3 ← F3 − 2·F2', on: function () { op(function () { M[2] = M[2].map(function (x, j) { return x - 2 * M[1][j]; }); }, 'Sumar a una fila un múltiplo de otra <strong>no cambia</strong> el determinante: así se hacen ceros.'); } },
        { t: 'Copiar F1 en F3', on: function () { op(function () { M[2] = M[0].slice(); }, 'Dos filas iguales: la caja se aplasta y el determinante <strong>vale 0</strong>.'); } },
        { t: 'Trasponer', on: function () { op(function () { M = [0, 1, 2].map(function (i) { return M.map(function (f) { return f[i]; }); }); }, 'Filas por columnas: el determinante <strong>no cambia</strong>.'); } },
        { t: '↺ Reiniciar', cls: 'btn--main', on: reset }
      ]);
      reset();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Menores, adjuntos y el desarrollo de Laplace');

  p.text('Sarrus solo funciona con matrices 3×3. Para cualquier tamaño hace falta otra idea: reducir el ' +
    'determinante a determinantes más pequeños. Dos definiciones y una regla bastan.');

  p.formulas([
    'M_{ij} = \\text{determinante que queda al tachar la fila } i \\text{ y la columna } j',
    'A_{ij} = (-1)^{i+j}\\,M_{ij}',
    '\\det A = a_{i1}A_{i1} + a_{i2}A_{i2} + \\cdots + a_{in}A_{in}'
  ], 'menor complementario, adjunto y desarrollo por una fila',
    '$M_{ij}$ se dice «menor complementario de a sub i jota» y $A_{ij}$, «adjunto de a sub i jota».<br><br>' +
      'El factor $(-1)^{i+j}$ solo pone un signo: más si $i+j$ es par, menos si es impar. Se ve mejor ' +
      'como un tablero de ajedrez que empieza con más en la esquina: ' +
      '$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$.<br><br>' +
      'La tercera línea es el <strong>desarrollo de Laplace</strong>: se elige una fila (o una columna), ' +
      'se multiplica cada elemento por su adjunto y se suma. Da lo mismo la fila elegida; lo inteligente ' +
      'es elegir <strong>la que tenga más ceros</strong>, porque cada cero es un término que no hay que ' +
      'calcular.');

  p.demo({
    title: 'Desarrollar por la fila o la columna que quieras',
    intro: 'Una matriz 4×4. Elige por dónde desarrollar: el resultado es siempre el mismo, pero el trabajo no. La columna 2 tiene tres ceros y deja un único término.',
    build: function (host) {
      var M = [[2, 0, 1, 3], [1, 0, 0, 2], [3, 1, 2, 0], [0, 0, 4, 1]];
      var eleccion = 'c1';
      var caja = U.el('div', { style: { textAlign: 'center', overflowX: 'auto' } });
      host.appendChild(caja);
      caja.innerHTML = MathX.display('M = ' + mt(M, 'pmatrix'));
      var out = W.readout(host, '');
      function pinta() {
        var esFila = eleccion.charAt(0) === 'f', k = +eleccion.charAt(1);
        var terminos = [], ceros = 0, total = 0;
        for (var t = 0; t < 4; t++) {
          var i = esFila ? k : t, j = esFila ? t : k;
          var a = M[i][j];
          if (a === 0) { ceros++; continue; }
          var s = (i + j) % 2 ? -1 : 1, m = det(menor(M, i, j));
          total += a * s * m;
          terminos.push('$' + a + '\\cdot(' + (s > 0 ? '+' : '-') + ')\\cdot ' + pa(m) + '$ &nbsp;<span style="color:var(--ink-faint)">(fila ' + (i + 1) + ', columna ' + (j + 1) + ')</span>');
        }
        out.set('Términos que hay que calcular: <strong>' + terminos.length + '</strong> · ahorrados por los ceros: <strong>' + ceros + '</strong><br>' +
          terminos.join('<br>') + '<br>Suma: $\\det M = ' + total + '$');
      }
      W.chips(host, [
        { label: 'Fila 1', value: 'f0' }, { label: 'Fila 2', value: 'f1' },
        { label: 'Columna 2', value: 'c1' }, { label: 'Columna 3', value: 'c2' }
      ], { value: eleccion, on: function (v) { eleccion = v; pinta(); } });
      pinta();
    }
  });

  p.note('La estrategia de examen para un 4×4 tiene dos pasos: primero, con la propiedad de «sumar a ' +
    'una fila un múltiplo de otra», se hacen ceros en una columna hasta dejar un solo elemento; ' +
    'después se desarrolla por esa columna y queda un único determinante 3×3, que ya sale por Sarrus.',
    'ok', 'Cómo se calcula un 4×4 sin sufrir');

  p.hist('El desarrollo por menores lo publicó Pierre-Simon Laplace en 1772, dentro de un trabajo sobre ' +
    'las órbitas de los planetas: necesitaba resolver sistemas de ecuaciones y buscaba una forma general ' +
    'de escribir sus soluciones. La palabra <em>determinante</em> con su sentido actual es de Augustin ' +
    'Cauchy, en 1812, que fue quien demostró que el determinante de un producto es el producto de los ' +
    'determinantes. Las matrices, como objeto con nombre propio, no llegaron hasta 1858: durante casi un ' +
    'siglo se calcularon determinantes de tablas de números a las que nadie había dado entidad.');

  /* ---------------------------------------------------------------- */
  p.section('El rango de una matriz');

  p.text('El <strong>rango</strong> de una matriz es el número de filas linealmente independientes, es ' +
    'decir, cuántas filas quedan que no se puedan obtener combinando las demás. Es el mismo número si se ' +
    'cuentan columnas. Se calcula de dos maneras, y conviene dominar las dos:');

  p.list([
    '<strong>Por Gauss</strong>: se escalona la matriz y se cuentan las filas que no quedan enteras a cero.',
    '<strong>Por menores</strong>: el rango es el orden del mayor menor distinto de cero. Se busca un menor 2×2 no nulo y se va «orlando» (añadiendo una fila y una columna) para ver si hay alguno 3×3 no nulo.'
  ]);

  p.formula('\\operatorname{rg}(A) = r \\iff \\text{hay un menor de orden } r \\text{ no nulo y todos los de orden } r+1 \\text{ son nulos}',
    'rango por menores',
    '$\\operatorname{rg}(A)$ se lee «rango de a».<br><br>En la práctica: si una matriz 3×3 tiene ' +
      'determinante distinto de cero, su rango es 3 sin más cuentas. Si es cero, el rango es como mucho ' +
      '2, y basta encontrar un menor 2×2 no nulo para asegurar que es exactamente 2.');

  p.text('Cuando la matriz lleva un <strong>parámetro</strong>, el determinante se convierte en una ' +
    'expresión en $k$. Los valores que lo anulan, los <strong>valores críticos</strong>, son los únicos ' +
    'en los que el rango puede bajar, y hay que estudiarlos uno por uno. Es exactamente el primer paso ' +
    'de la [[al-discusion|discusión de un sistema]].');

  p.demo({
    title: 'El rango con un parámetro',
    intro: 'Mueve k. Casi siempre el rango es 3; solo en los valores que anulan el determinante baja, y no baja igual en todos.',
    build: function (host) {
      var k = 0;
      var caja = U.el('div', { style: { textAlign: 'center', overflowX: 'auto' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var A = [[1, 1, k], [1, k, 1], [k, 1, 1]];
        var d = det(A), r = rango(A);
        caja.innerHTML = MathX.display('A = ' + mt(A, 'pmatrix') + '\\qquad \\det A = -(k-1)^2(k+2)');
        out.set('Para $k = ' + k + '$: $\\det A = ' + d + '$ &nbsp;→&nbsp; $\\operatorname{rg}(A) = ' + r + '$<br>' +
          (r === 3 ? 'Determinante distinto de cero: rango máximo.'
            : (r === 2 ? 'Determinante cero, pero queda un menor 2×2 no nulo, como $\\begin{vmatrix} 1 & 1 \\\\ 1 & -2 \\end{vmatrix} = -3$: rango 2.'
              : 'Las tres filas son iguales: todos los menores 2×2 son cero y el rango cae hasta 1.')));
      }
      W.slider(W.row(host), { label: 'parámetro k', min: -4, max: 4, step: 1, value: k, on: function (x) { k = x; pinta(); } });
      W.hint(host, 'Prueba k = 1 y k = −2, las raíces del determinante.');
      pinta();
    }
  });

  p.hist('Olga Taussky-Todd, una matemática nacida en Olomouc en 1906, llegó a las matrices por un ' +
    'problema de vida o muerte. Durante la Segunda Guerra Mundial trabajó en el laboratorio nacional de ' +
    'física británico estudiando el <em>flameo</em>: la vibración que puede arrancar las alas de un avión ' +
    'a cierta velocidad. Decidir si un diseño era seguro exigía estudiar matrices enormes, y ella encontró ' +
    'maneras de acotar sus propiedades sin calcularlo todo. Después, en Estados Unidos, se convirtió en ' +
    'una de las grandes impulsoras de la teoría de matrices como disciplina propia.', 'Y quien la llevó más lejos');

  p.util('El determinante mide cuánto estira o encoge el espacio una transformación, y por eso aparece ' +
    'en un sitio inesperado: al cambiar de variables en una integral de varias dimensiones, el ' +
    'determinante (el <em>jacobiano</em>) es el factor que corrige las áreas y los volúmenes. Y el rango ' +
    'es la cuenta que hace un programa de ingeniería antes de resolver un sistema enorme: si la matriz ' +
    'de una estructura no tiene rango completo, la estructura es un mecanismo y se mueve sola, es decir, ' +
    'se cae.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Propiedades con números',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([2, 3, 3, 4]), d = r.pm(1, 6), e = r.pm(1, 5), k = r.pick([2, 3, -2, -1]);
      var tipos = [
        { t: '$\\det(' + k + 'A)$', v: Math.pow(k, n) * d, malo: k * d, porque: 'se multiplican las $' + n + '$ filas por $' + k + '$: $(' + k + ')^{' + n + '}\\cdot' + pa(d) + '$' },
        { t: '$\\det(A^t)$', v: d, porque: 'trasponer no cambia el determinante' },
        { t: '$\\det(A^{-1})$', v: 1 / d, porque: 'es el inverso: $\\frac{1}{' + d + '}$' },
        { t: '$\\det(A\\cdot B)$ sabiendo que $\\det B = ' + e + '$', v: d * e, porque: 'es el producto de los determinantes' },
        { t: '$\\det(A^2)$', v: d * d, porque: '$\\det(A\\cdot A) = (\\det A)^2$' }
      ];
      var c = r.pick(tipos);
      return { n: n, d: d, c: c };
    },
    ask: function (d) {
      return '$A$ es una matriz cuadrada de orden $' + d.n + '$ con $\\det A = ' + d.d + '$. Calcula ' + d.c.t + '.';
    },
    fields: [{ name: 'v', label: 'valor', w: 'tiny' }],
    sol: function (d) { return { v: d.c.v }; },
    tol: 1e-9,
    errores: [{
      si: function (v, d) { return d.c.malo !== undefined && d.c.malo !== d.c.v && Math.abs(v.v - d.c.malo) < 1e-9; },
      msg: 'Multiplicar la matriz por un número multiplica <strong>cada fila</strong>, y cada fila aporta un factor: $\\det(kA) = k^n\\det A$.'
    }],
    hint: function (d) { return 'Busca la propiedad que habla de ' + d.c.t + '.'; },
    steps: function (d) { return ['Porque ' + d.c.porque + '.', 'Resultado: $' + ML.F(d.c.v).tex() + '$']; },
    answer: function (d) { return '$' + ML.F(d.c.v).tex() + '$'; }
  });

  p.exercise({
    title: 'Propiedades con letras',
    level: 'medio',
    gen: function (r) {
      var D = r.pm(1, 6);
      var casos = [
        { M: '\\begin{vmatrix} 2a & 2b & 2c \\\\ d & e & f \\\\ g & h & i \\end{vmatrix}', f: 2, p: 'la primera fila está multiplicada por 2' },
        { M: '\\begin{vmatrix} d & e & f \\\\ a & b & c \\\\ g & h & i \\end{vmatrix}', f: -1, p: 'se han intercambiado las dos primeras filas' },
        { M: '\\begin{vmatrix} a + 2d & b + 2e & c + 2f \\\\ d & e & f \\\\ g & h & i \\end{vmatrix}', f: 1, p: 'a la primera fila se le ha sumado el doble de la segunda, que no cambia nada' },
        { M: '\\begin{vmatrix} 3a & 3b & 3c \\\\ 3d & 3e & 3f \\\\ 3g & 3h & 3i \\end{vmatrix}', f: 27, p: 'las tres filas están multiplicadas por 3: $3^3 = 27$' },
        { M: '\\begin{vmatrix} g & h & i \\\\ d & e & f \\\\ a & b & c \\end{vmatrix}', f: -1, p: 'se han intercambiado la primera y la tercera fila' },
        { M: '\\begin{vmatrix} 2d & 2e & 2f \\\\ a & b & c \\\\ g & h & i \\end{vmatrix}', f: -2, p: 'se han intercambiado dos filas (signo menos) y una se ha multiplicado por 2' },
        { M: '\\begin{vmatrix} a & d & g \\\\ b & e & h \\\\ c & f & i \\end{vmatrix}', f: 1, p: 'es la traspuesta' },
        { M: '\\begin{vmatrix} a & b & c \\\\ d - a & e - b & f - c \\\\ -g & -h & -i \\end{vmatrix}', f: -1, p: 'a la segunda se le ha restado la primera (no cambia) y la tercera está multiplicada por $-1$' }
      ];
      var c = r.pick(casos);
      return { D: D, c: c, v: c.f * D };
    },
    ask: function (d) {
      return 'Sabiendo que $\\begin{vmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{vmatrix} = ' + d.D + '$, calcula sin desarrollar: $' + d.c.M + '$';
    },
    fields: [{ name: 'v', label: 'valor', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    hint: function () {
      return ['Compara fila a fila con la matriz original.',
        'Cada intercambio cambia el signo, cada fila multiplicada por $k$ multiplica por $k$ y sumar múltiplos de otras filas no cambia nada.'];
    },
    steps: function (d) { return ['Se observa que ' + d.c.p + '.', 'Factor total: $' + d.c.f + '$, así que vale $' + d.c.f + '\\cdot' + pa(d.D) + ' = ' + d.v + '$.']; },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'Un adjunto',
    level: 'medio',
    gen: function (r) {
      var M = [];
      for (var f = 0; f < 3; f++) M.push([r.pm(0, 5), r.pm(0, 5), r.pm(0, 5)]);
      var i = r.int(0, 2), j = r.int(0, 2);
      var m = det(menor(M, i, j)), aij = ((i + j) % 2 ? -1 : 1) * m;
      var mji = det(menor(M, j, i)), aji = ((i + j) % 2 ? -1 : 1) * mji;
      return { M: M, i: i, j: j, m: m, aij: aij, aji: aji };
    },
    ask: function (d) {
      return 'Dada $A = ' + mt(d.M, 'pmatrix') + '$, calcula el adjunto $A_{' + (d.i + 1) + (d.j + 1) + '}$.';
    },
    fields: [{ name: 'v', label: '$A_{' + 'ij}$', w: 'tiny' }],
    sol: function (d) { return { v: d.aij }; },
    errores: [
      {
        si: function (v, d) { return (d.i + d.j) % 2 === 1 && d.m !== 0 && v.v === d.m; },
        msg: 'Ese es el menor complementario. El adjunto lleva además el signo $(-1)^{i+j}$, que aquí es negativo.'
      },
      {
        si: function (v, d) { return d.aji !== d.aij && v.v === d.aji; },
        msg: 'Has tachado al revés: primero la <strong>fila</strong> $i$ y después la <strong>columna</strong> $j$.'
      }
    ],
    hint: function (d) {
      return ['Tacha la fila ' + (d.i + 1) + ' y la columna ' + (d.j + 1) + ' y calcula el determinante 2×2 que queda.',
        'Multiplícalo por $(-1)^{' + (d.i + 1) + '+' + (d.j + 1) + '}$.'];
    },
    steps: function (d) {
      return ['Menor: $M_{' + (d.i + 1) + (d.j + 1) + '} = ' + mt(menor(d.M, d.i, d.j)) + ' = ' + d.m + '$',
        'Signo: $(-1)^{' + (d.i + d.j + 2) + '} = ' + ((d.i + d.j) % 2 ? '-1' : '+1') + '$',
        '$A_{' + (d.i + 1) + (d.j + 1) + '} = ' + d.aij + '$'];
    },
    answer: function (d) { return String(d.aij); }
  });

  p.exercise({
    title: 'Determinante de orden 4',
    level: 'avanzado',
    gen: function (r) {
      var M = [];
      for (var f = 0; f < 4; f++) M.push([r.pm(0, 3), r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)]);
      var col = r.int(0, 3), filas = r.sample([0, 1, 2, 3], 2);
      filas.forEach(function (f) { M[f][col] = 0; });
      return { M: M, col: col, d: det(M) };
    },
    ask: function (d) { return 'Calcula $' + mt(d.M) + '$'; },
    fields: [{ name: 'v', label: 'determinante', w: 'tiny' }],
    sol: function (d) { return { v: d.d }; },
    hint: function (d) {
      return ['Busca la fila o columna con más ceros: la columna ' + (d.col + 1) + ' tiene al menos dos.',
        'Desarrolla por ella: solo hay que calcular los adjuntos de los elementos que no son cero.',
        'Cada adjunto es un 3×3 con su signo del tablero $+ - + -$.'];
    },
    steps: function (d) {
      var s = [], total = 0;
      for (var i = 0; i < 4; i++) {
        var a = d.M[i][d.col];
        if (a === 0) continue;
        var sg = (i + d.col) % 2 ? -1 : 1, m = det(menor(d.M, i, d.col));
        total += a * sg * m;
        s.push('Elemento $a_{' + (i + 1) + (d.col + 1) + '} = ' + a + '$, signo $' + (sg > 0 ? '+' : '-') + '$, menor $= ' + m + '$ → término $' + (a * sg * m) + '$');
      }
      s.unshift('Se desarrolla por la columna ' + (d.col + 1) + '.');
      s.push('Suma: $' + total + '$');
      return s;
    },
    answer: function (d) { return String(d.d); }
  });

  p.exercise({
    title: 'Rango de una matriz',
    level: 'medio',
    gen: function (r) {
      var rg = r.int(1, 3);
      var F1 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      if (!F1.some(function (x) { return x; })) return null;
      var F2, F3;
      if (rg === 1) {
        F2 = F1.map(function (x) { return 2 * x; });
        F3 = F1.map(function (x) { return -x; });
      } else {
        F2 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
        if (rango([F1, F2]) < 2) return null;
        if (rg === 2) {
          var a = r.pick([1, -1, 2]), b = r.pick([1, -1, 2]);
          F3 = F1.map(function (x, j) { return a * x + b * F2[j]; });
        } else {
          F3 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
        }
      }
      var M = r.shuffle([F1, F2, F3]);
      var real = rango(M);
      return { M: M, rg: real };
    },
    ask: function (d) { return 'Calcula el rango de $A = ' + mt(d.M, 'pmatrix') + '$.'; },
    fields: [{ name: 'r', label: 'rango', opts: ['1', '2', '3'] }],
    sol: function (d) { return { r: String(d.rg) }; },
    hint: function () {
      return ['¿Hay alguna fila que sea múltiplo de otra, o combinación de las otras dos?',
        'Escalona por Gauss y cuenta las filas que no se anulan, o busca menores no nulos.'];
    },
    steps: function (d) {
      return ['Escalonando $A$ quedan <strong>' + d.rg + '</strong> filas no nulas.',
        d.rg === 1 ? 'Las tres filas son proporcionales.' : (d.rg === 2 ? 'Una de las filas es combinación lineal de las otras dos: todos los menores 3×3 se anulan, pero hay un menor 2×2 no nulo.' : 'Hay un menor 3×3 distinto de cero.'),
        '$\\operatorname{rg}(A) = ' + d.rg + '$'];
    },
    answer: function (d) { return 'rango ' + d.rg; }
  });

  p.problem({
    title: 'Rango según un parámetro',
    level: 'avanzado',
    gen: function (r) {
      var fam = r.int(0, 3), A, crit, texto;
      if (fam === 0) { A = function (k) { return [[k, 1, 1], [1, k, 1], [1, 1, k]]; }; texto = '\\begin{pmatrix} k & 1 & 1 \\\\ 1 & k & 1 \\\\ 1 & 1 & k \\end{pmatrix}'; crit = [-2, 1]; }
      else if (fam === 1) { A = function (k) { return [[1, 1, k], [1, k, 1], [k, 1, 1]]; }; texto = '\\begin{pmatrix} 1 & 1 & k \\\\ 1 & k & 1 \\\\ k & 1 & 1 \\end{pmatrix}'; crit = [-2, 1]; }
      else if (fam === 2) { A = function (k) { return [[1, k, 1], [k, 1, 1], [1, 1, k]]; }; texto = '\\begin{pmatrix} 1 & k & 1 \\\\ k & 1 & 1 \\\\ 1 & 1 & k \\end{pmatrix}'; crit = [-2, 1]; }
      else {
        var a = r.int(-3, 2), b = r.int(a + 1, 3);
        A = function (k) { return [[1, 1, 1], [a, b, k], [a * a, b * b, k * k]]; };
        texto = '\\begin{pmatrix} 1 & 1 & 1 \\\\ ' + a + ' & ' + b + ' & k \\\\ ' + (a * a) + ' & ' + (b * b) + ' & k^2 \\end{pmatrix}';
        crit = [a, b];
      }
      return { texto: texto, crit: crit, rg0: rango(A(crit[0])), rg1: rango(A(crit[1])), fam: fam };
    },
    intro: function (d) { return 'Se considera la matriz $A = ' + d.texto + '$.'; },
    partes: [
      {
        ask: function () { return '¿Para qué valores de $k$ se anula $\\det A$? Escríbelos separados por punto y coma: <em>1; -2</em>.'; },
        fields: [{ name: 'k', label: 'valores de k', w: 'wide' }],
        sol: function (d) { return { k: d.crit.join('; ') }; },
        check: function (v, d) {
          if (!String(v.raw.k || '').trim()) return { ok: false, msg: 'Escribe los valores separados por punto y coma.' };
          return Ex.sameSet(v.raw.k, d.crit);
        },
        hint: function (d) {
          return d.fam === 3 ? ['Es una matriz de Vandermonde: su determinante es un producto de diferencias.', 'Se anula cuando dos columnas son iguales.']
            : ['Suma las tres columnas en la primera: sale un factor común $k + 2$.', 'Resta la primera fila a las otras dos y desarrolla: aparece $(k - 1)^2$.'];
        },
        steps: function (d) {
          return d.fam === 3 ? ['$\\det A = (' + d.crit[1] + ' - ' + pa(d.crit[0]) + ')(k - ' + pa(d.crit[0]) + ')(k - ' + pa(d.crit[1]) + ')$, que se anula en $k = ' + d.crit[0] + '$ y $k = ' + d.crit[1] + '$.']
            : ['Haciendo operaciones de fila y columna, $\\det A = \\pm(k - 1)^2(k + 2)$.', 'Se anula en $k = 1$ (raíz doble) y en $k = -2$.'];
        },
        answer: function (d) { return 'k = ' + d.crit.join(' y k = '); }
      },
      {
        ask: function (d) { return '¿Cuál es el rango de $A$ para $k = ' + d.crit[0] + '$?'; },
        fields: [{ name: 'r', label: 'rango', opts: ['1', '2', '3'] }],
        sol: function (d) { return { r: String(d.rg0) }; },
        hint: function () { return 'Sustituye $k$ y busca un menor 2×2 distinto de cero.'; },
        steps: function (d) { return ['El determinante es 0, así que el rango no es 3.', 'Hay menores 2×2 no nulos: $\\operatorname{rg}(A) = ' + d.rg0 + '$.']; },
        answer: function (d) { return String(d.rg0); }
      },
      {
        ask: function (d) { return '¿Y para $k = ' + d.crit[1] + '$?'; },
        fields: [{ name: 'r', label: 'rango', opts: ['1', '2', '3'] }],
        sol: function (d) { return { r: String(d.rg1) }; },
        errores: [{
          si: function (v, d) { return d.rg1 === 1 && v.raw.r === '2'; },
          msg: 'Mira los menores 2×2 con cuidado: con este valor las tres filas son iguales, y todos se anulan.'
        }],
        hint: function () { return 'Sustituye y mira si las filas son proporcionales.'; },
        steps: function (d) {
          return [d.rg1 === 1 ? 'Con este valor las tres filas son iguales: todos los menores 2×2 valen 0 y el rango es 1.'
            : 'El determinante es 0 pero hay un menor 2×2 no nulo: rango 2.'];
        },
        answer: function (d) { return String(d.rg1); }
      }
    ]
  });

  p.keys([
    'Intercambiar filas cambia el signo; multiplicar una fila por $k$ multiplica por $k$; sumar múltiplos de otra fila no cambia nada.',
    '$\\det(kA) = k^n\\det A$, $\\det(AB) = \\det A\\det B$ y $\\det(A^{-1}) = 1/\\det A$. Con la suma no hay fórmula.',
    'Filas iguales, proporcionales o nulas: determinante 0.',
    'El adjunto es el menor con signo: $A_{ij} = (-1)^{i+j}M_{ij}$, signos en tablero de ajedrez.',
    'Laplace: se desarrolla por la fila o columna con más ceros, después de fabricar esos ceros.',
    'El rango es el número de filas independientes: por Gauss, o por el mayor menor no nulo.',
    'Con parámetro, los valores que anulan el determinante son los únicos en los que el rango puede bajar.'
  ]);
});
