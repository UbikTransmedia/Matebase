/* Tema: Matriz inversa, ecuaciones matriciales y potencias */
Course.topic('al-inversa', function (p) {

  /* utilidades del tema: matrices con fracciones exactas */
  var F = ML.F;
  function det2(m) { return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
  function menor(M, i, j) {
    return M.filter(function (_, f) { return f !== i; }).map(function (fila) { return fila.filter(function (_, c) { return c !== j; }); });
  }
  function det(M) {
    if (M.length === 2) return det2(M);
    var s = 0;
    for (var j = 0; j < M.length; j++) s += (j % 2 ? -1 : 1) * M[0][j] * det(menor(M, 0, j));
    return s;
  }
  function adjuntos(M) {
    return M.map(function (fila, i) { return fila.map(function (_, j) { return ((i + j) % 2 ? -1 : 1) * det(menor(M, i, j)); }); });
  }
  function trasp(M) { return M[0].map(function (_, j) { return M.map(function (f) { return f[j]; }); }); }
  function mul(A, B) {
    return A.map(function (fila) { return B[0].map(function (_, j) { var s = 0; for (var k = 0; k < B.length; k++) s += fila[k] * B[k][j]; return s; }); });
  }
  function resta(A, B) { return A.map(function (f, i) { return f.map(function (x, j) { return x - B[i][j]; }); }); }
  /** Inversa como matriz de fracciones exactas. */
  function inversaF(M) {
    var d = det(M);
    return trasp(adjuntos(M)).map(function (f) { return f.map(function (x) { return F(x, d); }); });
  }
  function texF(M) { return ML.matTex(M.map(function (f) { return f.map(function (x) { return x.tex ? x.tex() : String(x); }); })); }
  function matF(A, B) {
    // A de fracciones por B de numeros
    return A.map(function (fila) { return B[0].map(function (_, j) { var s = F(0); for (var k = 0; k < B.length; k++) s = s.add(fila[k].mul(F(B[k][j]))); return s; }); });
  }
  function mulFF(A, B) {
    return A.map(function (fila) { return B[0].map(function (_, j) { var s = F(0); for (var k = 0; k < B.length; k++) s = s.add(fila[k].mul(B[k][j])); return s; }); });
  }
  function numF(A, B) {
    // A de numeros por B de fracciones
    return A.map(function (fila) { return B[0].map(function (_, j) { var s = F(0); for (var k = 0; k < B.length; k++) s = s.add(F(fila[k]).mul(B[k][j])); return s; }); });
  }
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }

  p.text('En [[al-matrices]] la inversa apareció para matrices 2×2, con una fórmula que cabía en una ' +
    'línea. Aquí se generaliza a cualquier tamaño, de dos maneras. Y se usa para lo que de verdad ' +
    'sirve: <strong>despejar</strong> en ecuaciones cuya incógnita es una matriz entera, que es una de ' +
    'las preguntas más frecuentes del examen de matrices.');

  p.text('Una advertencia que merece ir por delante: <strong>entre matrices no existe la ' +
    'división</strong>. No se puede «pasar dividiendo». Se multiplica por la inversa, y como el producto ' +
    'no es conmutativo, importa muchísimo <em>por qué lado</em>.');

  /* ---------------------------------------------------------------- */
  p.section('La inversa por adjuntos');

  p.formula('A^{-1} = \\frac{1}{\\det A}\\,\\left(\\operatorname{Adj} A\\right)^t',
    'la inversa de una matriz cuadrada cualquiera',
    'Se lee: <em>«a inversa es uno partido por el determinante de a, por la traspuesta de la matriz ' +
      'adjunta de a»</em>.<br><br>$\\operatorname{Adj} A$ es la matriz que tiene en cada casilla el ' +
      '[[al-determinantes|adjunto]] $A_{ij}$ de ese elemento. La $t$ de arriba es trasponer: filas por ' +
      'columnas.<br><br>Solo existe si $\\det A \\ne 0$, porque hay que dividir por él.');

  p.list([
    'Calcular $\\det A$. Si es cero, no hay inversa y se acabó.',
    'Calcular la matriz de adjuntos: cada elemento sustituido por su adjunto, con su signo.',
    'Trasponerla.',
    'Dividir cada elemento por el determinante.',
    'Comprobar, si hay tiempo, que $A\\cdot A^{-1} = I$. Es la única manera segura de no entregar una inversa equivocada.'
  ], true);

  p.demo({
    title: 'La inversa, paso a paso',
    intro: 'Pulsa «Siguiente paso» para construir la inversa de una matriz 3×3. Al final se multiplica por la original para comprobar que sale la identidad.',
    build: function (host) {
      var M, paso;
      var caja = U.el('div', { style: { textAlign: 'center', overflowX: 'auto' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function nueva() {
        var r = U.rng();
        do {
          M = [[r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)]];
        } while (det(M) === 0);
        paso = 0; pinta();
      }
      function pinta() {
        var d = det(M), adj = adjuntos(M), t = trasp(adj), inv = inversaF(M);
        var lineas = ['A = ' + ML.matTex(M)];
        var nota = 'Matriz de partida.';
        if (paso >= 1) { lineas.push('\\det A = ' + d); nota = 'El determinante no es cero: la inversa existe.'; }
        if (paso >= 2) { lineas.push('\\operatorname{Adj} A = ' + ML.matTex(adj)); nota = 'Cada elemento, cambiado por su adjunto: menor complementario con el signo del tablero.'; }
        if (paso >= 3) { lineas.push('(\\operatorname{Adj} A)^t = ' + ML.matTex(t)); nota = 'Traspuesta: la primera fila pasa a ser la primera columna.'; }
        if (paso >= 4) { lineas.push('A^{-1} = ' + texF(inv)); nota = 'Se divide todo entre el determinante.'; }
        if (paso >= 5) {
          var I = matF(inv, M).map(function (f) { return f.map(function (x) { return x.tex(); }); });
          lineas.push('A^{-1}\\cdot A = ' + ML.matTex(I));
          nota = 'Sale la identidad: la inversa es correcta.';
        }
        caja.innerHTML = lineas.map(function (l) { return MathX.display(l); }).join('');
        out.set('Paso ' + paso + ' de 5. ' + nota);
      }
      W.buttons(host, [
        { t: 'Siguiente paso →', cls: 'btn--main', on: function () { if (paso < 5) { paso++; pinta(); } } },
        { t: '↻ Otra matriz', on: nueva }
      ]);
      nueva();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La inversa por Gauss-Jordan');

  p.text('La otra manera es la del método de [[al-gauss|Gauss]], llevada hasta el final. Se escribe la ' +
    'matriz con la identidad al lado y se hacen operaciones de fila hasta que la identidad esté a la ' +
    'izquierda. Lo que quede a la derecha es la inversa.');

  p.formula('\\left(\\,A \\mid I\\,\\right) \\ \\xrightarrow{\\text{operaciones de fila}}\\ \\left(\\,I \\mid A^{-1}\\,\\right)',
    'método de Gauss-Jordan',
    'Se lee: <em>«de a con la identidad pegada, haciendo operaciones de fila, a la identidad con a ' +
      'inversa pegada»</em>.<br><br>Por qué funciona: cada operación de fila equivale a multiplicar por ' +
      'la izquierda por una matriz. Si todas juntas convierten $A$ en $I$, su producto es ' +
      '$A^{-1}$... y ese mismo producto es el que se ha ido aplicando a la $I$ de la derecha.');

  p.note('¿Cuál usar? Para matrices 2×2 y 3×3 con números pequeños, adjuntos: son cuentas cortas y ' +
    'fáciles de revisar. Para matrices mayores, o con muchos ceros, Gauss-Jordan: es el método que ' +
    'usan los ordenadores, porque el número de operaciones crece mucho más despacio.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Ecuaciones matriciales: despejar sin dividir');

  p.text('Para despejar $X$ en $AX = B$ se multiplica por $A^{-1}$ los dos miembros <strong>por el ' +
    'mismo lado</strong> por el que está $A$. Como $A$ está a la izquierda de $X$, se multiplica por la ' +
    'izquierda: $A^{-1}AX = A^{-1}B$, es decir, $X = A^{-1}B$. Si $A$ estuviera a la derecha, se ' +
    'multiplicaría por la derecha.');

  p.table(['Ecuación', 'Se despeja así', 'Solución'],
    [['$AX = B$', 'por la izquierda con $A^{-1}$', '$X = A^{-1}B$'],
     ['$XA = B$', 'por la derecha con $A^{-1}$', '$X = BA^{-1}$'],
     ['$AX + B = C$', 'se pasa $B$ restando y luego como la primera', '$X = A^{-1}(C - B)$'],
     ['$AXB = C$', 'por la izquierda con $A^{-1}$ y por la derecha con $B^{-1}$', '$X = A^{-1}CB^{-1}$'],
     ['$AX + X = B$', 'se saca $X$ factor común <em>por la derecha</em>: $(A + I)X = B$', '$X = (A + I)^{-1}B$']]);

  p.note('En $AX + X = B$ es tentador escribir $(A + 1)X$. Pero $1$ es un número y $A$ una matriz: no ' +
    'se pueden sumar. Lo que se suma a $A$ es la matriz identidad $I$, que es la que hace de «uno» ' +
    'entre matrices: $X = IX$.', 'warn', 'El «uno» de las matrices es la identidad');

  p.demo({
    title: 'El orden importa',
    intro: 'Para resolver AX = B hay dos candidatos que parecen iguales: A⁻¹B y BA⁻¹. Aquí se calculan los dos y se prueba cuál cumple la ecuación de verdad.',
    build: function (host) {
      var A, B;
      var caja = U.el('div', { style: { textAlign: 'center', overflowX: 'auto' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function nuevas() {
        var r = U.rng();
        do { A = [[r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3)]]; } while (det(A) === 0);
        do { B = [[r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3)]]; } while (!det(B));
        pinta();
      }
      function pinta() {
        var inv = inversaF(A);
        var X1 = mulFF(inv, B.map(function (f) { return f.map(function (x) { return F(x); }); }));
        var X2 = mulFF(B.map(function (f) { return f.map(function (x) { return F(x); }); }), inv);
        var AX1 = numF(A, X1), AX2 = numF(A, X2);
        caja.innerHTML = MathX.display('A = ' + ML.matTex(A) + '\\quad B = ' + ML.matTex(B) + '\\quad A^{-1} = ' + texF(inv)) +
          MathX.display('A^{-1}B = ' + texF(X1) + '\\qquad BA^{-1} = ' + texF(X2));
        var igual = function (M) { return M.every(function (f, i) { return f.every(function (x, j) { return x.eq(F(B[i][j])); }); }); };
        out.set('$A\\cdot(A^{-1}B) = ' + texF(AX1) + '$ ' + (igual(AX1) ? '✓ es $B$' : '✗') + '<br>' +
          '$A\\cdot(BA^{-1}) = ' + texF(AX2) + '$ ' + (igual(AX2) ? '✓ también es $B$ (casualidad: aquí $A$ y $B$ conmutan)' : '✗ no es $B$'));
      }
      W.buttons(host, [{ t: '↻ Otras matrices', cls: 'btn--main', on: nuevas }]);
      nuevas();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Potencias de una matriz');

  p.text('Calcular $A^{50}$ multiplicando cincuenta veces no es una opción. La estrategia de examen es ' +
    'calcular $A^2$, $A^3$ y a veces $A^4$, <strong>buscar el patrón</strong> y justificarlo. Casi ' +
    'siempre aparece uno de estos comportamientos:');

  p.table(['Si ocurre que…', 'se llama', 'y entonces'],
    [['$A^2 = A$', 'idempotente', '$A^n = A$ para todo $n$'],
     ['$A^2 = I$', 'involutiva', '$A^n = I$ si $n$ es par y $A$ si es impar'],
     ['$A^k = 0$ para algún $k$', 'nilpotente', 'todas las potencias desde la $k$ son nulas'],
     ['$A^k = I$ para algún $k$', 'cíclica', 'las potencias se repiten cada $k$: $A^n = A^{n \\bmod k}$'],
     ['$A^n$ tiene elementos que crecen como $n$', 'patrón lineal', 'se conjetura la fórmula y se demuestra por inducción']]);

  p.formula('\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 1 & na \\\\ 0 & 1 \\end{pmatrix}',
    'un patrón que se demuestra por inducción',
    'Se ve calculando $A^2$ y $A^3$: la esquina vale $2a$ y $3a$. Para asegurarlo de verdad, ' +
      '[[lg-demostracion|inducción]]: si vale para $n$, al multiplicar una vez más por $A$ la esquina ' +
      'pasa a ser $na + a = (n+1)a$, así que vale para $n + 1$.');

  p.demo({
    title: 'Buscar el patrón de las potencias',
    intro: 'Elige una matriz y sube el exponente. Mira qué se repite o qué crece: eso es lo que se escribe en el examen.',
    build: function (host) {
      var FAM = {
        lin: { t: 'patrón lineal', M: [[1, 2], [0, 1]] },
        giro: { t: 'cíclica (giro de 90°)', M: [[0, -1], [1, 0]] },
        inv: { t: 'involutiva', M: [[0, 1], [1, 0]] },
        nil: { t: 'nilpotente', M: [[0, 1, 2], [0, 0, 3], [0, 0, 0]] },
        idem: { t: 'idempotente', M: [[1, 1], [0, 0]] }
      };
      var cual = 'lin', n = 3;
      var caja = U.el('div', { style: { textAlign: 'center', overflowX: 'auto' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var M = FAM[cual].M, P = M;
        for (var i = 1; i < n; i++) P = mul(P, M);
        caja.innerHTML = MathX.display('A = ' + ML.matTex(M) + '\\qquad A^{' + n + '} = ' + ML.matTex(P));
        out.set('Tipo: <strong>' + FAM[cual].t + '</strong>. Sube el exponente y fíjate en qué se repite.');
      }
      W.chips(host, Object.keys(FAM).map(function (k) { return { label: FAM[k].t, value: k }; }), { value: cual, on: function (v) { cual = v; pinta(); } });
      W.slider(W.row(host), { label: 'exponente n', min: 1, max: 12, step: 1, value: n, on: function (x) { n = x; pinta(); } });
      pinta();
    }
  });

  p.hist('En 1929 el matemático estadounidense Lester Hill publicó un sistema de cifrado hecho con ' +
    'matrices: se escriben las letras como números del 0 al 25, se agrupan en vectores y se ' +
    'multiplican por una matriz clave. Para descifrar hay que multiplicar por la matriz inversa, y la ' +
    'clave solo sirve si esa inversa existe. Hill llegó a patentar una máquina de engranajes que lo ' +
    'hacía. No se usó mucho, pero fue la primera vez que el álgebra lineal entró de lleno en la ' +
    'criptografía, que hoy está hecha casi entera de matemáticas.');

  p.util('Resolver $AX = B$ es lo que hace un programa cuando ajusta el color de una imagen, corrige la ' +
    'perspectiva de una foto de un documento o calcula cómo se reparten las fuerzas en un puente. Y las ' +
    'potencias de una matriz son la forma de ver el futuro de un sistema que evoluciona paso a paso: si ' +
    '$A$ dice cómo cambia una población de un año al siguiente, $A^{50}$ dice cómo estará dentro de ' +
    'cincuenta años. Es la idea que desarrolla el tema de [[av-markov|cadenas de Markov]].');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Despejar la incógnita',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { e: 'AX = B', ok: 'a', opts: [{ t: '$X = A^{-1}B$', v: 'a' }, { t: '$X = BA^{-1}$', v: 'b' }, { t: '$X = \\frac{B}{A}$', v: 'c' }, { t: '$X = B - A$', v: 'd' }], por: '$A$ multiplica a $X$ por la izquierda: se multiplica por $A^{-1}$ por la izquierda.' },
        { e: 'XA = B', ok: 'b', opts: [{ t: '$X = A^{-1}B$', v: 'a' }, { t: '$X = BA^{-1}$', v: 'b' }, { t: '$X = \\frac{B}{A}$', v: 'c' }, { t: '$X = A^{-1}B^{-1}$', v: 'd' }], por: '$A$ está a la derecha de $X$: se multiplica por $A^{-1}$ por la derecha.' },
        { e: 'AXB = C', ok: 'c', opts: [{ t: '$X = A^{-1}B^{-1}C$', v: 'a' }, { t: '$X = CA^{-1}B^{-1}$', v: 'b' }, { t: '$X = A^{-1}CB^{-1}$', v: 'c' }, { t: '$X = B^{-1}CA^{-1}$', v: 'd' }], por: '$A$ por la izquierda y $B$ por la derecha: cada inversa va por su lado.' },
        { e: 'AX + X = B', ok: 'd', opts: [{ t: '$X = (A + 1)^{-1}B$', v: 'a' }, { t: '$X = B(A + I)^{-1}$', v: 'b' }, { t: '$X = A^{-1}B - I$', v: 'c' }, { t: '$X = (A + I)^{-1}B$', v: 'd' }], por: 'Factor común por la derecha: $(A + I)X = B$, y luego $(A + I)^{-1}$ por la izquierda.' },
        { e: 'XA - B = 2X', ok: 'a', opts: [{ t: '$X = B(A - 2I)^{-1}$', v: 'a' }, { t: '$X = (A - 2I)^{-1}B$', v: 'b' }, { t: '$X = B(A - 2)^{-1}$', v: 'c' }, { t: '$X = BA^{-1} - 2I$', v: 'd' }], por: '$XA - 2X = B$, factor común por la izquierda: $X(A - 2I) = B$, y luego la inversa por la derecha.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return 'Suponiendo que las inversas que hagan falta existen, despeja $X$ en $' + d.e + '$.'; },
    fields: function (d) { return [{ name: 'x', label: 'Solución', opts: d.opts }]; },
    sol: function (d) { return { x: d.ok }; },
    hint: function () {
      return ['Entre matrices no se divide: se multiplica por la inversa.',
        'Fíjate en si la matriz está a la izquierda o a la derecha de $X$, y multiplica por ese mismo lado en los dos miembros.'];
    },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return d.opts.filter(function (o) { return o.v === d.ok; })[0].t; }
  });

  p.exercise({
    title: 'Un elemento de la inversa 3×3',
    level: 'medio',
    gen: function (r) {
      var M = [];
      for (var f = 0; f < 3; f++) M.push([r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)]);
      var d = det(M);
      if (!d) return null;
      var i = r.int(0, 2), j = r.int(0, 2);
      var adj = adjuntos(M);
      return { M: M, d: d, i: i, j: j, bien: F(adj[j][i], d), mal: F(adj[i][j], d), adjji: adj[j][i] };
    },
    ask: function (d) {
      return 'Calcula el elemento de la fila ' + (d.i + 1) + ' y columna ' + (d.j + 1) + ' de $A^{-1}$, siendo $A = ' + ML.matTex(d.M) + '$. (Vale una fracción.)';
    },
    fields: [{ name: 'v', label: '$(A^{-1})_{ij}$', w: 'tiny' }],
    sol: function (d) { return { v: d.bien.val() }; },
    tol: 1e-9,
    errores: [{
      si: function (v, d) { return !d.bien.eq(d.mal) && Math.abs(v.v - d.mal.val()) < 1e-9; },
      msg: 'Te has saltado la <strong>traspuesta</strong>: el elemento $(i, j)$ de la inversa usa el adjunto $A_{ji}$, con los índices cambiados.'
    }],
    hint: function (d) {
      return ['$A^{-1} = \\frac{1}{\\det A}(\\operatorname{Adj} A)^t$.',
        'Por la traspuesta, el elemento $(' + (d.i + 1) + ', ' + (d.j + 1) + ')$ de la inversa es el adjunto $A_{' + (d.j + 1) + (d.i + 1) + '}$ dividido por el determinante.'];
    },
    steps: function (d) {
      return ['$\\det A = ' + d.d + '$',
        'Por la traspuesta se usa $A_{' + (d.j + 1) + (d.i + 1) + '} = ' + d.adjji + '$',
        '$(A^{-1})_{' + (d.i + 1) + (d.j + 1) + '} = \\dfrac{' + d.adjji + '}{' + d.d + '} = ' + d.bien.tex() + '$'];
    },
    answer: function (d) { return '$' + d.bien.tex() + '$'; }
  });

  p.exercise({
    title: '¿Para qué valores hay inversa?',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(1, 4), b = r.pm(1, 4);
      if (a === b) return null;
      // det(M(k)) = (k - a)(k - b), con M(k) = [[k, s], [t, k]] y s·t = ... se fabrica ajustando
      var suma = a + b, prod = a * b;
      // [[k - suma, -prod], [1, k]]: det = k(k - suma) + prod = k^2 - suma k + prod
      return { a: a, b: b, suma: suma, prod: prod };
    },
    ask: function (d) {
      return 'Halla los valores de $k$ para los que la matriz $A = \\begin{pmatrix} ' + ML.polyTex([1, -d.suma], 'k') + ' & ' + (-d.prod) + ' \\\\ 1 & k \\end{pmatrix}$ <strong>no</strong> tiene inversa. Sepáralos con punto y coma.';
    },
    fields: [{ name: 'k', label: 'valores de k', w: 'wide' }],
    sol: function (d) { return { k: d.a + '; ' + d.b }; },
    check: function (v, d) {
      if (!String(v.raw.k || '').trim()) return { ok: false, msg: 'Escribe los valores separados por punto y coma.' };
      return Ex.sameSet(v.raw.k, [d.a, d.b]);
    },
    hint: function () { return ['No tiene inversa exactamente cuando el determinante vale cero.', 'Calcula $\\det A$ en función de $k$: sale una ecuación de segundo grado.']; },
    steps: function (d) {
      return ['$\\det A = k(' + ML.polyTex([1, -d.suma], 'k') + ') - (' + (-d.prod) + ')\\cdot 1 = ' + ML.polyTex([1, -d.suma, d.prod], 'k') + '$',
        'Se anula en $k = ' + d.a + '$ y $k = ' + d.b + '$: para esos valores no hay inversa.'];
    },
    answer: function (d) { return 'k = ' + d.a + ' y k = ' + d.b; }
  });

  p.problem({
    title: 'Una ecuación matricial completa',
    level: 'avanzado',
    gen: function (r) {
      var A = [[r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3)]];
      var dA = det(A);
      if (dA !== 1 && dA !== -1 && dA !== 2 && dA !== -2) return null;
      var X = [[r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3)]];
      var B = [[r.pm(0, 4), r.pm(0, 4)], [r.pm(0, 4), r.pm(0, 4)]];
      var C = mul(A, X).map(function (f, i) { return f.map(function (x, j) { return x + B[i][j]; }); });
      var inv = inversaF(A);
      var CB = resta(C, B);
      var malX = mulFF(CB.map(function (f) { return f.map(function (x) { return F(x); }); }), inv);
      var igual = malX.every(function (f, i) { return f.every(function (x, j) { return x.eq(F(X[i][j])); }); });
      return { A: A, B: B, C: C, X: X, dA: dA, inv: inv, CB: CB, malX: malX, conmuta: igual };
    },
    intro: function (d) {
      return 'Resuelve la ecuación $AX + B = C$, siendo $A = ' + ML.matTex(d.A) + '$, $B = ' + ML.matTex(d.B) + '$ y $C = ' + ML.matTex(d.C) + '$.';
    },
    partes: [
      {
        ask: function () { return 'Despeja: ¿cuánto vale $C - B$?'; },
        fields: [{ name: 'a', label: '(1,1)', w: 'tiny' }, { name: 'b', label: '(1,2)', w: 'tiny' }, { name: 'c', label: '(2,1)', w: 'tiny' }, { name: 'd', label: '(2,2)', w: 'tiny' }],
        sol: function (d) { return { a: d.CB[0][0], b: d.CB[0][1], c: d.CB[1][0], d: d.CB[1][1] }; },
        hint: function () { return '$AX = C - B$: resta elemento a elemento.'; },
        steps: function (d) { return ['$AX = C - B = ' + ML.matTex(d.CB) + '$']; },
        answer: function (d) { return '$' + ML.matTex(d.CB) + '$'; }
      },
      {
        ask: function () { return 'Calcula $A^{-1}$.'; },
        fields: [{ name: 'a', label: '(1,1)', w: 'tiny' }, { name: 'b', label: '(1,2)', w: 'tiny' }, { name: 'c', label: '(2,1)', w: 'tiny' }, { name: 'd', label: '(2,2)', w: 'tiny' }],
        sol: function (d) { return { a: d.inv[0][0].val(), b: d.inv[0][1].val(), c: d.inv[1][0].val(), d: d.inv[1][1].val() }; },
        tol: 1e-9,
        errores: [{
          si: function (v, d) { return Math.abs(v.a - d.A[1][1]) < 1e-9 && Math.abs(v.d - d.A[0][0]) < 1e-9 && Math.abs(v.b + d.A[0][1]) < 1e-9 && Math.abs(v.c + d.A[1][0]) < 1e-9 && d.dA !== 1; },
          msg: function (v, d) { return 'Has intercambiado y cambiado de signo bien, pero falta <strong>dividir por el determinante</strong>, que vale $' + d.dA + '$.'; }
        }],
        hint: function () { return ['Para una 2×2: se intercambia la diagonal principal, se cambia el signo de la otra…', '…y se divide todo por el determinante.']; },
        steps: function (d) { return ['$\\det A = ' + d.dA + '$', '$A^{-1} = \\dfrac{1}{' + d.dA + '}' + ML.matTex([[d.A[1][1], -d.A[0][1]], [-d.A[1][0], d.A[0][0]]]) + ' = ' + texF(d.inv) + '$']; },
        answer: function (d) { return '$' + texF(d.inv) + '$'; }
      },
      {
        ask: function () { return 'Halla $X$.'; },
        fields: [{ name: 'a', label: '(1,1)', w: 'tiny' }, { name: 'b', label: '(1,2)', w: 'tiny' }, { name: 'c', label: '(2,1)', w: 'tiny' }, { name: 'd', label: '(2,2)', w: 'tiny' }],
        sol: function (d) { return { a: d.X[0][0], b: d.X[0][1], c: d.X[1][0], d: d.X[1][1] }; },
        tol: 1e-9,
        errores: [{
          si: function (v, d) { return !d.conmuta && Math.abs(v.a - d.malX[0][0].val()) < 1e-9 && Math.abs(v.b - d.malX[0][1].val()) < 1e-9 && Math.abs(v.c - d.malX[1][0].val()) < 1e-9 && Math.abs(v.d - d.malX[1][1].val()) < 1e-9; },
          msg: 'Has multiplicado por el lado equivocado: eso es $(C - B)A^{-1}$. Como $A$ está a la izquierda de $X$, es $X = A^{-1}(C - B)$.'
        }],
        hint: function () { return ['$X = A^{-1}(C - B)$: la inversa por la izquierda.', 'Fila de $A^{-1}$ por columna de $C - B$.']; },
        steps: function (d) { return ['$X = A^{-1}(C - B) = ' + texF(d.inv) + '\\cdot' + ML.matTex(d.CB) + ' = ' + ML.matTex(d.X) + '$', 'Comprobación: $A\\cdot X + B = C$ ✓']; },
        answer: function (d) { return '$X = ' + ML.matTex(d.X) + '$'; }
      }
    ]
  });

  p.exercise({
    title: 'Una potencia muy alta',
    level: 'avanzado',
    gen: function (r) {
      var fam = r.int(0, 2), n = r.int(20, 60), a = r.pm(1, 4), M, An, preg;
      if (fam === 0) { M = [[1, a], [0, 1]]; An = [[1, n * a], [0, 1]]; preg = [0, 1]; }
      else if (fam === 1) {
        M = [[0, -1], [1, 0]];
        var ciclo = [[[1, 0], [0, 1]], [[0, -1], [1, 0]], [[-1, 0], [0, -1]], [[0, 1], [-1, 0]]];
        An = ciclo[n % 4]; preg = [r.int(0, 1), r.int(0, 1)];
      } else { M = [[1, 0], [a, 1]]; An = [[1, 0], [n * a, 1]]; preg = [1, 0]; }
      return { fam: fam, n: n, a: a, M: M, An: An, preg: preg, v: An[preg[0]][preg[1]] };
    },
    ask: function (d) {
      return 'Siendo $A = ' + ML.matTex(d.M) + '$, calcula el elemento de la fila ' + (d.preg[0] + 1) + ' y columna ' + (d.preg[1] + 1) + ' de $A^{' + d.n + '}$.';
    },
    fields: [{ name: 'v', label: 'elemento', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    hint: function (d) {
      return ['Calcula $A^2$, $A^3$ y $A^4$.',
        d.fam === 1 ? '¿Vuelve a salir la identidad? Entonces las potencias se repiten con un periodo: mira el resto de dividir ' + d.n + ' entre ese periodo.'
          : 'Uno de los elementos crece de forma regular con el exponente: escribe la fórmula para $A^n$.'];
    },
    steps: function (d) {
      if (d.fam === 1) return ['$A^2 = -I$, $A^3 = -A$, $A^4 = I$: las potencias se repiten cada 4.', '$' + d.n + ' = 4\\cdot' + Math.floor(d.n / 4) + ' + ' + (d.n % 4) + '$, así que $A^{' + d.n + '} = A^{' + (d.n % 4) + '} = ' + ML.matTex(d.An) + '$', 'El elemento pedido vale $' + d.v + '$.'];
      return ['$A^2$ y $A^3$ muestran que la esquina vale $2\\cdot' + pa(d.a) + '$ y $3\\cdot' + pa(d.a) + '$: en general $n\\cdot' + pa(d.a) + '$ (se demuestra por inducción).',
        '$A^{' + d.n + '} = ' + ML.matTex(d.An) + '$', 'El elemento pedido vale $' + d.v + '$.'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.keys([
    '$A^{-1} = \\frac{1}{\\det A}(\\operatorname{Adj} A)^t$, y solo existe si $\\det A \\ne 0$.',
    'Gauss-Jordan: $(A \\mid I) \\to (I \\mid A^{-1})$. Mejor para matrices grandes.',
    'Comprobar $A\\cdot A^{-1} = I$ es la única garantía de que la inversa está bien.',
    'Entre matrices no se divide: se multiplica por la inversa <strong>por el mismo lado</strong> en los dos miembros.',
    '$AX = B \\Rightarrow X = A^{-1}B$; $XA = B \\Rightarrow X = BA^{-1}$.',
    'El «uno» de las matrices es $I$: $AX + X = (A + I)X$.',
    'Para potencias altas: calcular unas pocas, encontrar el patrón (cíclico, nilpotente, lineal) y justificarlo por inducción.'
  ]);
});
